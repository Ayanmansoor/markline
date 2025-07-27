// import { NextResponse } from "next/server";
// import nodemailer from "nodemailer";


// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { email, name, phone, orderId, productNames  } = body;



//     if (!email || !name || !orderId) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//     });

//     // Email to user
//     await transporter.sendMail({
//       from: process.env.SMTP_USER,
//       to: email,
//       subject: "Order Confirmation",
//       html: `
//       <p>Hi <strong>${name}</strong></p>
//       <p>Your order <strong>#${orderId}</strong> has been placed successfully!</p>
//       <p>Your order <strong>#${productNames}</strong> has been placed successfully!</p>
//       <p>We’ll be reaching out to you shortly to confirm the details and guide you through the next steps, including payment and processing.</p>
//       `,
//     });

//     // Email to admin
//     await transporter.sendMail({
//       from: process.env.SMTP_USER,
//       to: process.env.ADMIN_EMAIL,
//       subject: "New Order Received",
//       html: `<p>Hello Admin,</p>
//             <p>A new order has been placed successfully.</p>
//             <p><strong>Customer Name:</strong> ${name} <br>
//             <p><strong>Phone number:</strong> ${phone} <br>
//             <strong>Order ID:</strong> #${orderId}</p>
//             <strong>Product name:</strong> #${productNames}</p>
//             <p>Please connect with the customer to confirm the order and proceed with the next steps, including payment processing.</p>
//             <p>Regards,<br>Your Website Notification System</p>`,
//     });

//     return NextResponse.json(
//       { message: "Emails sent successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Email error:", error);
//     return NextResponse.json(
//       { error: "Failed to send emails" },
//       { status: 500 }
//     );
//   }
// }

export interface SendEmailPayload {
  email: string;
  name: string;
  phone: string;
  orderId: string;
  productNames: string[]; // array of product names
  quantity: number[];     // array of quantities
  address: string;
  city: string;
  state: string;
  pin: string;
  finalPrice: number;
}
type Props = {
  data: SendEmailPayload;
};

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
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
    } :SendEmailPayload = body;

    if (!email || !name || !orderId || !productNames || !quantity) {
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
    });

    // Create detailed product list with quantity
    const productListHTML = productNames
      .map((product: string, i: number) => {
        const qty = quantity[i] || 1;
        return `<li>${product} — Qty: ${qty}</li>`;
      })
      .join("");

    const fullAddress = `${address}, ${city}, ${state} - ${pin}`;

    // Email to Customer
    await transporter.sendMail({
      from: `"Markline" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Order Confirmation - #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <p>Hi <strong>${name}</strong>,</p>
          <p>Thank you for your order <strong>#${orderId}</strong>!</p>
          
          <p><strong>Order Summary:</strong></p>
          <ul>${productListHTML}</ul>
          <p><strong>Total Amount:</strong> ₹${finalPrice}</p>
          <p><strong>Delivery Address:</strong><br/>${fullAddress}</p>

          <p>We’ll contact you shortly to confirm details and process your order.</p>
          <p>Thank you for shopping with us!</p>
          <p>— Markline Team</p>
        </div>
      `,
    });

    // Email to Admin
    await transporter.sendMail({
      from: `"Markline Orders" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order Received - #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <p><strong>New Order Received!</strong></p>
          <p><strong>Customer:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "N/A"}</p>
          <p><strong>Order ID:</strong> #${orderId}</p>
          
          <p><strong>Products:</strong></p>
          <ul>${productListHTML}</ul>
          <p><strong>Total Amount:</strong> ₹${finalPrice}</p>
          <p><strong>Address:</strong> ${fullAddress}</p>

          <p>Please follow up for confirmation and shipping.</p>
          <p>— Markline Notification System</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "Emails sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email sending failed:",);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
