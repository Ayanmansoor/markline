import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const isVerified = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (isVerified) {
      return NextResponse.json({ verified: true }, { status: 200 });
    } else {
      return NextResponse.json({ verified: false, error: "Invalid payment signature" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { verified: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
