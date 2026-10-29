import { NextResponse, after } from "next/server";
import { sendOrderConfirmationEmails } from "@/lib/email";
import { mysupabase } from "@/Supabase/SupabaseConfig";

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

    // 1. Basic validation
    if (!email || !name || !orderId || !productNames || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid recipient email format" },
        { status: 400 }
      );
    }

    // 2. Prevent open email relay: Verify order exists in the database
    const { data: existingOrder, error: orderErr } = await mysupabase
      .from("orders")
      .select("id")
      .eq("id", orderId)
      .maybeSingle();

    if (orderErr || !existingOrder) {
      return NextResponse.json(
        { error: "Order not found or invalid" },
        { status: 400 }
      );
    }

    // 3. Schedule background email sending using Next.js after()
    after(async () => {
      console.log(`[Background Email] Sending order confirmation emails for #${orderId} to ${email}`);
      try {
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
      } catch (sendErr) {
        console.error(`[Background Email] Failed to send email for #${orderId}:`, sendErr);
      }
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
