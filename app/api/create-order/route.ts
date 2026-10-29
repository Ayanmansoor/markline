import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { mysupabase } from "@/Supabase/SupabaseConfig";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, amount } = body;

    let finalAmountInPaise: number;
    let receiptId = "receipt_order_123";
    const notes: Record<string, string> = {};

    // 1. If orderId is provided, verify against Supabase database (tamper-proof)
    if (orderId) {
      const { data: dbOrder, error: dbError } = await mysupabase
        .from("orders")
        .select("id, grand_total, payment_status, razorpay_order_id")
        .eq("id", orderId)
        .single();

      if (dbError || !dbOrder) {
        return NextResponse.json(
          { error: "Order not found in database. Cannot create payment order." },
          { status: 404 }
        );
      }

      if (dbOrder.payment_status === "PAID") {
        return NextResponse.json(
          { error: "Order is already marked as PAID." },
          { status: 400 }
        );
      }

      const calculatedGrandTotal = Number(dbOrder.grand_total);
      if (isNaN(calculatedGrandTotal) || calculatedGrandTotal <= 0) {
        return NextResponse.json(
          { error: "Order has an invalid total amount." },
          { status: 400 }
        );
      }

      // Razorpay expects amount in paise (1 INR = 100 paise)
      finalAmountInPaise = Math.round(calculatedGrandTotal * 100);
      receiptId = `rcpt_${String(dbOrder.id).slice(0, 30)}`;
      notes.order_id = String(dbOrder.id);
    } else {
      // 2. Fallback if orderId is omitted (validate amount strictly)
      if (amount === undefined || amount === null || isNaN(Number(amount)) || Number(amount) <= 0) {
        return NextResponse.json(
          { error: "A valid orderId or positive amount is required." },
          { status: 400 }
        );
      }
      console.warn("POST /api/create-order called without orderId. Client-supplied amount used:", amount);
      finalAmountInPaise = Math.round(Number(amount));
    }

    const options = {
      amount: finalAmountInPaise,
      currency: "INR",
      receipt: receiptId,
      notes: notes,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Persist razorpay_order_id to the database order immediately if orderId exists
    if (orderId) {
      await mysupabase
        .from("orders")
        .update({ razorpay_order_id: razorpayOrder.id })
        .eq("id", orderId);
    }

    return NextResponse.json(razorpayOrder, { status: 200 });
  } catch (error: unknown) {
    console.error("POST /api/create-order - Error occurred:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error creating order" },
      { status: 500 }
    );
  }
}
