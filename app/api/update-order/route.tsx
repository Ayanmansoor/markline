import { NextRequest, NextResponse } from "next/server";
import { mysupabase } from "@/Supabase/SupabaseConfig";
import { verifyPaymentSignature, deductOrderStock } from "@/lib/razorpay";

interface ApiOrderProps {
  SavedOrders: any;
  user_id?: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  razorpay_payment_id: string;
}

export async function POST(req: NextRequest) {
  try {
    const {
      SavedOrders,
      user_id,
      razorpay_order_id,
      razorpay_signature,
      razorpay_payment_id,
    }: ApiOrderProps = await req.json();

    const targetOrderId = SavedOrders?.id || SavedOrders;

    if (!targetOrderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing required payment verification details" },
        { status: 400 }
      );
    }

    // 1. Verify Razorpay cryptographic HMAC-SHA256 signature
    const isValidSignature = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValidSignature) {
      console.error(`Invalid Razorpay signature for order ${targetOrderId}. Possible tampering.`);
      return NextResponse.json(
        { success: false, error: "Payment verification failed. Invalid signature." },
        { status: 400 }
      );
    }

    // 2. Fetch existing order to check idempotency
    const { data: existingOrder, error: fetchError } = await mysupabase
      .from("orders")
      .select("id, payment_status")
      .eq("id", targetOrderId)
      .single();

    if (fetchError || !existingOrder) {
      return NextResponse.json(
        { success: false, error: "Target order record not found" },
        { status: 404 }
      );
    }

    // If order was already marked PAID (e.g. by webhook), return success idempotently
    if (existingOrder.payment_status === "PAID") {
      const { data: currentData } = await mysupabase
        .from("orders")
        .select(`
          *,
          address:address_id(*),
          order_items(
            *,
            product:product_id(*),
            variant:variant_id(*)
          )
        `)
        .eq("id", targetOrderId)
        .single();

      return NextResponse.json({ success: true, updated: currentData, alreadyPaid: true }, { status: 200 });
    }

    // 3. Update order in database to PAID
    let query = mysupabase
      .from("orders")
      .update({
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        payment_status: "PAID",
      })
      .eq("id", targetOrderId);

    if (user_id) {
      query = query.eq("user_id", user_id);
    }

    const { data, error } = await query
      .select(`
        *,
        address:address_id(*),
        order_items(
          *,
          product:product_id(*),
          variant:variant_id(*)
        )
      `)
      .single();

    if (error) {
      console.error("Error updating order payment status:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // 4. Atomically deduct inventory stock
    await deductOrderStock(targetOrderId);

    return NextResponse.json({ success: true, updated: data }, { status: 200 });
  } catch (error) {
    console.error("Server error updating order:", error);
    return NextResponse.json(
      { success: false, error: "Server error", details: String(error) },
      { status: 500 }
    );
  }
}
