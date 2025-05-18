import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, orderId } = body;

    if (!email || !name || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "ayanmansoor0919@gmail.com",
        pass: "ayan_bk_sovorun!$!%",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Email to user
    await transporter.sendMail({
      from: "ayanmansoor0919@gmail.com",
      to: email,
      subject: "Order Confirmation",
      html: `<p>Hi ${name},</p><p>Your order #${orderId} has been placed successfully!</p>`,
    });

    // Email to admin
    await transporter.sendMail({
      from: "ayanmansoor0919@gmail.com",
      to: "ayanmansoor0919@gmail.com",
      subject: "New Order Received",
      html: `<p>New order placed by ${name} (${email}), order ID: ${orderId}.</p>`,
    });

    return NextResponse.json({ message: "Emails sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send emails" }, { status: 500 });
  }
}
