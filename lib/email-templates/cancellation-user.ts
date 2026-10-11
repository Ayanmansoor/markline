export interface UserCancellationEmailParams {
  orderId: string;
  userName?: string;
  reason?: string;
  grandTotal?: number | string;
  createdDate?: string;
}

export function getUserCancellationEmailTemplate({
  orderId,
  userName = "Valued Customer",
  reason = "Requested by customer",
  grandTotal,
}: UserCancellationEmailParams): { subject: string; html: string } {
  const shortId = orderId.length > 8 ? orderId.slice(0, 8).toUpperCase() : orderId.toUpperCase();
  const formattedTotal = grandTotal
    ? (typeof grandTotal === 'number'
        ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(grandTotal)
        : grandTotal)
    : undefined;

  const subject = `Order Cancelled - #Ord-${shortId}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01); border: 1px solid #e2e8f0;">
          
          <!-- Brand Header -->
          <tr>
            <td align="center" style="background-color: #09090b; padding: 28px 20px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 2px; color: #ffffff; text-transform: uppercase;">
                MARKLINE
              </h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 30px;">
              <div style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
                <h2 style="margin: 0 0 6px 0; font-size: 18px; font-weight: 700; color: #991b1b;">
                  Order Cancellation Confirmed
                </h2>
                <p style="margin: 0; font-size: 13px; color: #b91c1c; font-weight: 500;">
                  Order ID: <strong style="font-family: monospace;">#Ord-${shortId}</strong>
                </p>
              </div>

              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                Hi <strong>${userName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                Your order <strong>#Ord-${shortId}</strong> has been successfully cancelled as requested.
              </p>

              <!-- Cancellation Details Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 8px; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                          Cancellation Reason
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 14px; font-weight: 600; color: #0f172a; padding-bottom: 12px;">
                          ${reason}
                        </td>
                      </tr>
                      ${formattedTotal ? `
                      <tr>
                        <td style="border-top: 1px dashed #cbd5e1; padding-top: 12px; padding-bottom: 4px; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                          Order Total
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 16px; font-weight: 800; color: #0f172a;">
                          ${formattedTotal}
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Refund & Support Notice -->
              <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #166534;">
                  💳 Refund Process
                </p>
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #15803d;">
                  If any online payment was completed for this order, your refund will be automatically credited to your original payment method within 5–7 business days.
                </p>
              </div>

              <p style="margin: 0 0 24px 0; font-size: 13px; line-height: 1.6; color: #64748b;">
                If you have any questions or need further assistance, please feel free to reach out to our customer care team.
              </p>

              <div style="text-align: center;">
                <a href="https://shopmarkline.in/user" target="_blank" style="display: inline-block; background-color: #09090b; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px;">
                  View My Account
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #f1f5f9; padding: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
              <p style="margin: 0 0 6px 0;">© ${new Date().getFullYear()} Markline. All rights reserved.</p>
              <p style="margin: 0;">This is an automated notification. Please do not reply directly to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return { subject, html };
}
