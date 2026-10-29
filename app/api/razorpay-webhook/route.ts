import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature, deductOrderStock } from "@/lib/razorpay";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { sendOrderConfirmationEmails } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      console.warn("[Razorpay Webhook] Missing x-razorpay-signature header");
      return NextResponse.json({ error: "Missing x-razorpay-signature header" }, { status: 400 });
    }

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.error("[Razorpay Webhook] Invalid signature received. Potential unauthorized payload.");
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    console.log(`[Razorpay Webhook] Verified event: ${event.event}`);

    // 1. Process Successful Payment Events
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const paymentEntity = event.payload?.payment?.entity;
      const orderEntity = event.payload?.order?.entity;

      const razorpayPaymentId = paymentEntity?.id;
      const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
      const notes = paymentEntity?.notes || orderEntity?.notes || {};
      const internalOrderId = notes?.order_id;

      let orderQuery = mysupabase.from("orders").select(`
        *,
        address:address_id(*),
        order_items(
          *,
          product:product_id(*)
        )
      `);

      if (internalOrderId) {
        orderQuery = orderQuery.eq("id", internalOrderId);
      } else if (razorpayOrderId) {
        orderQuery = orderQuery.eq("razorpay_order_id", razorpayOrderId);
      } else {
        console.warn("[Razorpay Webhook] No identifiable order reference in webhook payload");
        return NextResponse.json({ status: "skipped", reason: "no_order_id" }, { status: 200 });
      }

      const { data: order, error } = await orderQuery.maybeSingle();

      if (error || !order) {
        console.warn(`[Razorpay Webhook] Order not found for rzp_order: ${razorpayOrderId}, internal: ${internalOrderId}`);
        return NextResponse.json({ status: "skipped", reason: "order_not_found" }, { status: 200 });
      }

      // Check Idempotency: If already paid, do nothing to avoid duplicate work
      if (order.payment_status === "PAID") {
        console.log(`[Razorpay Webhook] Order ${order.id} is already marked PAID. Skipping.`);
        return NextResponse.json({ status: "already_paid" }, { status: 200 });
      }

      // Update Order Status to PAID
      const { error: updateError } = await mysupabase
        .from("orders")
        .update({
          payment_status: "PAID",
          razorpay_payment_id: razorpayPaymentId || order.razorpay_payment_id,
          razorpay_order_id: razorpayOrderId || order.razorpay_order_id,
        })
        .eq("id", order.id);

      if (updateError) {
        console.error(`[Razorpay Webhook] Failed to update order ${order.id} to PAID:`, updateError);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
      }

      // Atomically decrement stock
      await deductOrderStock(order.id);

      // Trigger Order Confirmation Email (in case frontend didn't trigger it)
      try {
        const productNames = (order.order_items || []).map((i: any) => i.product?.name || "Markline Product");
        const quantities = (order.order_items || []).map((i: any) => i.quantity || 1);
        const recipientEmail = order.address?.email || paymentEntity?.email;
        const recipientName = order.address?.recipientName || order.address?.name || "Customer";

        if (recipientEmail) {
          await sendOrderConfirmationEmails({
            orderId: order.id,
            userEmail: recipientEmail,
            userName: recipientName,
            userPhone: order.address?.recipientPhone || order.address?.phone || "",
            productNames,
            quantity: quantities,
            grandTotal: order.grand_total,
            address: order.address?.full_address || order.address?.street_address || "",
            city: order.address?.city || "",
            state: order.address?.state_name || "",
            pin: order.address?.pin_code || "",
            createdDate: new Date().toLocaleDateString("en-IN"),
          });
        }
      } catch (mailErr) {
        console.error("[Razorpay Webhook] Failed sending order confirmation email:", mailErr);
      }

      return NextResponse.json({ status: "success", order_id: order.id }, { status: 200 });
    }

    // 2. Process Failed Payment Events
    if (event.event === "payment.failed") {
      const paymentEntity = event.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id;
      const notes = paymentEntity?.notes || {};
      const internalOrderId = notes?.order_id;

      if (internalOrderId || razorpayOrderId) {
        let updateQuery = mysupabase
          .from("orders")
          .update({ payment_status: "FAILED" });

        if (internalOrderId) {
          updateQuery = updateQuery.eq("id", internalOrderId);
        } else {
          updateQuery = updateQuery.eq("razorpay_order_id", razorpayOrderId);
        }

        // Only mark FAILED if still PENDING
        await updateQuery.eq("payment_status", "PENDING");
      }
      return NextResponse.json({ status: "failure_recorded" }, { status: 200 });
    }

    return NextResponse.json({ status: "ignored_event" }, { status: 200 });
  } catch (error: any) {
    console.error("[Razorpay Webhook Error]:", error);
    return NextResponse.json({ error: error?.message || "Webhook processing error" }, { status: 500 });
  }
}
