export interface UserConfirmationEmailParams {
  orderId: string;
  userName?: string;
  productNames?: string[];
  quantity?: number[];
  grandTotal?: number | string;
  address?: string;
  city?: string;
  state?: string;
  pin?: string;
  createdDate?: string;
}

export function getUserConfirmationEmailTemplate({
  orderId,
  userName = "Valued Customer",
  productNames = [],
  quantity = [],
  grandTotal,
  address = "",
  city = "",
  state = "",
  pin = "",
}: UserConfirmationEmailParams): { subject: string; html: string } {
  const shortId = orderId.length > 8 ? orderId.slice(0, 8).toUpperCase() : orderId.toUpperCase();
  const formattedTotal = grandTotal
    ? (typeof grandTotal === 'number'
        ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(grandTotal)
        : grandTotal)
    : undefined;

  const fullAddress = [address, city, state, pin].filter(Boolean).join(", ");
  const subject = `Order Confirmed! - #Ord-${shortId}`;

  const itemsListHTML = productNames.length > 0
    ? productNames.map((pName, idx) => {
        const qty = quantity[idx] || 1;
        return `
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-size: 13px; font-weight: 600; color: #0f172a;">
              ${pName}
            </td>
            <td align="right" style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-size: 13px; font-weight: 700; color: #475569; width: 60px;">
              x${qty}
            </td>
          </tr>
        `;
      }).join("")
    : `
      <tr>
        <td colspan="2" style="padding: 12px 16px; font-size: 13px; color: #64748b;">
          Markline Creation
        </td>
      </tr>
    `;

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
              <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
                <h2 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 800; color: #166534;">
                  🎉 Order Confirmed!
                </h2>
                <p style="margin: 0; font-size: 13px; color: #15803d; font-weight: 600;">
                  Order ID: <strong style="font-family: monospace;">#Ord-${shortId}</strong>
                </p>
              </div>

              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                Hi <strong>${userName}</strong>,
              </p>
              
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                Thank you for shopping with Markline! Your order has been placed successfully and is being prepared for dispatch.
              </p>

              <!-- Items Summary Table -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 20px; border-collapse: separate; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f8fafc;">
                    <th align="left" style="padding: 12px 16px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Item Details</th>
                    <th align="right" style="padding: 12px 16px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsListHTML}
                </tbody>
              </table>

              <!-- Financial & Address Summary Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      ${formattedTotal ? `
                      <tr>
                        <td style="padding-bottom: 8px; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                          Total Amount Paid
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 18px; font-weight: 900; color: #0f172a; padding-bottom: 14px;">
                          ${formattedTotal}
                        </td>
                      </tr>
                      ` : ''}
                      ${fullAddress ? `
                      <tr>
                        <td style="border-top: 1px dashed #cbd5e1; padding-top: 12px; padding-bottom: 4px; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                          Delivery Address
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; font-weight: 500; color: #334155; line-height: 1.5;">
                          ${fullAddress}
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <div style="text-align: center; margin-top: 28px;">
                <a href="https://shopmarkline.in/user/order/${orderId}" target="_blank" style="display: inline-block; background-color: #09090b; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px;">
                  Track Your Order
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #f1f5f9; padding: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
              <p style="margin: 0 0 6px 0;">© ${new Date().getFullYear()} Markline. All rights reserved.</p>
              <p style="margin: 0;">Need help? Reply to this email or visit our help center.</p>
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
