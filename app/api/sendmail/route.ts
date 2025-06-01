import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, phone, orderId, productNames, finalamount } = body;

    const options = {
      amount: finalamount * 100, // in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order=razorpay.orders.create(
      options
    )
    console.log(order,"order is save on razorpay")


    if (!email || !name || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Email to user
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Order Confirmation",
      html: `
      <p>Hi <strong>${name}</strong></p>
      <p>Your order <strong>#${orderId}</strong> has been placed successfully!</p>
      <p>Your order <strong>#${productNames}</strong> has been placed successfully!</p>
      <p>We’ll be reaching out to you shortly to confirm the details and guide you through the next steps, including payment and processing.</p>
      `,
    });

    // Email to admin
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "New Order Received",
      html: `<p>Hello Admin,</p>
            <p>A new order has been placed successfully.</p>
            <p><strong>Customer Name:</strong> ${name} <br>
            <p><strong>Phone number:</strong> ${phone} <br>
            <strong>Order ID:</strong> #${orderId}</p>
            <strong>Product name:</strong> #${productNames}</p>
            <p>Please connect with the customer to confirm the order and proceed with the next steps, including payment processing.</p>
            <p>Regards,<br>Your Website Notification System</p>`,
    });

    return NextResponse.json(
      { message: "Emails sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
