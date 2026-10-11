import nodemailer from "nodemailer";
import {
  getUserCancellationEmailTemplate,
  getAdminCancellationEmailTemplate,
  getUserConfirmationEmailTemplate,
  getAdminConfirmationEmailTemplate,
} from "./email-templates";

export interface SendCancellationEmailsParams {
  orderId: string;
  reason?: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  grandTotal?: number | string;
  createdDate?: string;
}

export interface SendConfirmationEmailsParams {
  orderId: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  productNames?: string[];
  quantity?: number[];
  grandTotal?: number | string;
  address?: string;
  city?: string;
  state?: string;
  pin?: string;
  createdDate?: string;
}

export function createSmtpTransporter() {
  const rawUser = process.env.SMTP_USER || process.env.ADMIN_EMAIL || '';
  const rawPass = process.env.SMTP_PASS || '';

  const smtpUser = rawUser.replace(/^['"]|['"]$/g, '').trim();
  const smtpPass = rawPass.replace(/^['"]|['"]$/g, '').trim();

  if (!smtpPass || !smtpUser) {
    console.warn("[Email Service] Missing SMTP_PASS or SMTP_USER/ADMIN_EMAIL environment variables.");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true", // false for 587, true for 465
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export async function sendCancellationEmails({
  orderId,
  reason = "Requested by customer",
  userEmail,
  userName = "Valued Customer",
  userPhone = "N/A",
  grandTotal,
  createdDate,
}: SendCancellationEmailsParams) {
  try {
    const transporter = createSmtpTransporter();
    const fromAddress = process.env.SMTP_USER || process.env.ADMIN_EMAIL || "no-reply@shopmarkline.in";
    const adminEmail = process.env.ADMIN_EMAIL;

    const emailTasks: Promise<any>[] = [];

    // 1. Send Email to Customer
    if (userEmail && userEmail.trim()) {
      const userTemplate = getUserCancellationEmailTemplate({
        orderId,
        userName,
        reason,
        grandTotal,
        createdDate,
      });

      emailTasks.push(
        transporter.sendMail({
          from: `"Markline" <${fromAddress}>`,
          to: userEmail.trim(),
          subject: userTemplate.subject,
          html: userTemplate.html,
        }).then(() => {
          console.log(`[Email Service] Customer cancellation email sent successfully to ${userEmail}`);
        }).catch((err) => {
          console.error(`[Email Service Error] Failed to send customer email to ${userEmail}:`, err?.message || err);
        })
      );
    }

    // 2. Send Email to Admin
    if (adminEmail && adminEmail.trim()) {
      const adminTemplate = getAdminCancellationEmailTemplate({
        orderId,
        userName,
        userEmail,
        userPhone,
        reason,
        grandTotal,
        createdDate,
      });

      emailTasks.push(
        transporter.sendMail({
          from: `"Markline System" <${fromAddress}>`,
          to: adminEmail.trim(),
          subject: adminTemplate.subject,
          html: adminTemplate.html,
        }).then(() => {
          console.log(`[Email Service] Admin cancellation alert sent successfully to ${adminEmail}`);
        }).catch((err) => {
          console.error(`[Email Service Error] Failed to send admin alert to ${adminEmail}:`, err?.message || err);
        })
      );
    }

    await Promise.allSettled(emailTasks);
  } catch (error: any) {
    console.error("[Email Service Critical Error]:", error?.message || error);
  }
}

export async function sendOrderConfirmationEmails({
  orderId,
  userEmail,
  userName = "Valued Customer",
  userPhone = "N/A",
  productNames = [],
  quantity = [],
  grandTotal,
  address = "",
  city = "",
  state = "",
  pin = "",
  createdDate,
}: SendConfirmationEmailsParams) {
  try {
    const transporter = createSmtpTransporter();
    const fromAddress = process.env.ADMIN_EMAIL || "no-reply@shopmarkline.in";
    const adminEmail = process.env.ADMIN_EMAIL;

    const emailTasks: Promise<any>[] = [];

    // 1. Send Email to Customer
    if (userEmail && userEmail.trim()) {
      const userTemplate = getUserConfirmationEmailTemplate({
        orderId,
        userName,
        productNames,
        quantity,
        grandTotal,
        address,
        city,
        state,
        pin,
        createdDate,
      });

      emailTasks.push(
        transporter.sendMail({
          from: `"Markline" <${fromAddress}>`,
          to: userEmail.trim(),
          subject: userTemplate.subject,
          html: userTemplate.html,
        }).then(() => {
          console.log(`[Email Service] Order confirmation email sent to customer ${userEmail}`);
        }).catch((err) => {
          console.error(`[Email Service Error] Failed to send confirmation email to ${userEmail}:`, err?.message || err);
        })
      );
    }

    // 2. Send Email to Admin
    if (adminEmail && adminEmail.trim()) {
      const adminTemplate = getAdminConfirmationEmailTemplate({
        orderId,
        userName,
        userEmail,
        userPhone,
        productNames,
        quantity,
        grandTotal,
        address,
        city,
        state,
        pin,
      });

      emailTasks.push(
        transporter.sendMail({
          from: `"Markline Orders" <${fromAddress}>`,
          to: adminEmail.trim(),
          subject: adminTemplate.subject,
          html: adminTemplate.html,
        }).then(() => {
          console.log(`[Email Service] New order confirmation alert sent to admin ${adminEmail}`);
        }).catch((err) => {
          console.error(`[Email Service Error] Failed to send admin new order alert to ${adminEmail}:`, err?.message || err);
        })
      );
    }

    await Promise.allSettled(emailTasks);
  } catch (error: any) {
    console.error("[Email Service Order Confirmation Error]:", error?.message || error);
  }
}
