export interface AdminCancellationEmailParams {
  orderId: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  reason?: string;
  grandTotal?: number | string;
  createdDate?: string;
}

export function getAdminCancellationEmailTemplate({
  orderId,
  userName = "Customer",
  userEmail = "N/A",
  userPhone = "N/A",
  reason = "Not specified",
  grandTotal,
}: AdminCancellationEmailParams): { subject: string; html: string } {
  const shortId = orderId.length > 8 ? orderId.slice(0, 8).toUpperCase() : orderId.toUpperCase();
  const formattedTotal = grandTotal
    ? (typeof grandTotal === 'number'
        ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(grandTotal)
        : grandTotal)
    : undefined;

  const subject = `[ADMIN ALERT] Order Cancelled - #Ord-${shortId}`;

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
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #991b1b; padding: 24px 30px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span style="background-color: #fef2f2; color: #991b1b; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px;">
                      Admin Notification
                    </span>
                    <h1 style="margin: 10px 0 0 0; font-size: 20px; font-weight: 800; color: #ffffff;">
                      Order Cancelled Alert
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #475569; font-weight: 500;">
                An order has been cancelled by the customer. Please review the details below:
              </p>

              <!-- Order Overview Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px;">
                      <tr>
                        <td style="padding-bottom: 10px; color: #64748b; font-weight: 600; width: 140px;">Order ID:</td>
                        <td style="padding-bottom: 10px; color: #0f172a; font-weight: 800; font-family: monospace; font-size: 14px;">#Ord-${shortId}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px; color: #64748b; font-weight: 600;">Full Order ID:</td>
                        <td style="padding-bottom: 10px; color: #334155; font-family: monospace; font-size: 11px; word-break: break-all;">${orderId}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px; color: #64748b; font-weight: 600;">Customer Name:</td>
                        <td style="padding-bottom: 10px; color: #0f172a; font-weight: 700;">${userName}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px; color: #64748b; font-weight: 600;">Customer Email:</td>
                        <td style="padding-bottom: 10px; color: #2563eb; font-weight: 600;">
                          <a href="mailto:${userEmail}" style="color: #2563eb; text-decoration: none;">${userEmail}</a>
                        </td>
                      </tr>
                      ${userPhone && userPhone !== 'N/A' ? `
                      <tr>
                        <td style="padding-bottom: 10px; color: #64748b; font-weight: 600;">Customer Phone:</td>
                        <td style="padding-bottom: 10px; color: #0f172a; font-weight: 600;">${userPhone}</td>
                      </tr>
                      ` : ''}
                      ${formattedTotal ? `
                      <tr>
                        <td style="padding-bottom: 10px; color: #64748b; font-weight: 600;">Grand Total:</td>
                        <td style="padding-bottom: 10px; color: #0f172a; font-weight: 800; font-size: 15px;">${formattedTotal}</td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding-top: 10px; border-top: 1px dashed #cbd5e1; color: #64748b; font-weight: 600;">Cancellation Reason:</td>
                        <td style="padding-top: 10px; border-top: 1px dashed #cbd5e1; color: #b91c1c; font-weight: 700;">${reason}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CMS Action Button -->
              <div style="text-align: center; margin-top: 28px;">
                <a href="http://192.168.0.107:3001/orders" target="_blank" style="display: inline-block; background-color: #09090b; color: #ffffff; text-decoration: none; padding: 12px 26px; border-radius: 10px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px;">
                  Open CMS Dashboard
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #f1f5f9; padding: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
              Markline Store Operations & Automated Notification Engine
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
