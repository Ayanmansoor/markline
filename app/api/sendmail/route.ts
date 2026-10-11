import { NextResponse, after } from "next/server";
import { sendOrderConfirmationEmails } from "@/lib/email";

export interface SendEmailPayload {
  email: string;
  name: string;
  phone?: string;
  orderId: string;
  productNames: string[];
  quantity: number[];
  address?: string;
  city?: string;
  state?: string;
  pin?: string;
  finalPrice?: number;
}

export async function POST(req: Request) {
  try {
    const body: SendEmailPayload = await req.json();
    const {
      email,
      name,
      phone,
      orderId,
      productNames,
      quantity,
      address,
      city,
      state,
      pin,
      finalPrice,
    } = body;

    if (!email || !name || !orderId || !productNames || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Schedule background email sending using Next.js after()
    after(async () => {
      console.log(`[Background Email] Sending order confirmation emails for #${orderId} to ${email}`);
      await sendOrderConfirmationEmails({
        orderId,
        userEmail: email,
        userName: name,
        userPhone: phone || "N/A",
        productNames,
        quantity,
        grandTotal: finalPrice,
        address,
        city,
        state,
        pin,
      });
    });

    // Return response immediately to client
    return NextResponse.json(
      { message: "Emails scheduled for background processing" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email scheduling failed:", error);
    return NextResponse.json(
      { error: "Failed to schedule confirmation emails" },
      { status: 500 }
    );
  }
}
