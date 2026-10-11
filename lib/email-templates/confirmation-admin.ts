export interface AdminConfirmationEmailParams {
  orderId: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  productNames?: string[];
  quantity?: number[];
  grandTotal?: number | string;
  address?: string;
  city?: string;
  state?: string;
  pin?: string;
}

export function getAdminConfirmationEmailTemplate({
  orderId,
  userName = "Customer",
  userEmail = "N/A",
  userPhone = "N/A",
  productNames = [],
  quantity = [],
  grandTotal,
  address = "",
  city = "",
  state = "",
  pin = "",
}: AdminConfirmationEmailParams): { subject: string; html: string } {
  const shortId = orderId.length > 8 ? orderId.slice(0, 8).toUpperCase() : orderId.toUpperCase();
  const formattedTotal = grandTotal
    ? (typeof grandTotal === 'number'
        ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(grandTotal)
        : grandTotal)
    : undefined;

  const fullAddress = [address, city, state, pin].filter(Boolean).join(", ");
  const subject = `[NEW ORDER] Order Received - #Ord-${shortId}`;

  const itemsListHTML = productNames.length > 0
    ? productNames.map((pName, idx) => {
        const qty = quantity[idx] || 1;
        return `<li><strong>${pName}</strong> — Qty: ${qty}</li>`;
      }).join("")
    : "<li>Markline Product</li>";

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
            <td style="background-color: #09090b; padding: 24px 30px;">
              <span style="background-color: #166534; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px;">
                New Order Received
              </span>
              <h1 style="margin: 10px 0 0 0; font-size: 20px; font-weight: 800; color: #ffffff;">
                Order Confirmation Alert
              </h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #475569; font-weight: 500;">
                A new order has been placed and payment confirmed. Review the details below:
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
                        <td style="padding-bottom: 10px; color: #64748b; font-weight: 600;">Customer Name:</td>
                        <td style="padding-bottom: 10px; color: #0f172a; font-weight: 700;">${userName}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px; color: #64748b; font-weight: 600;">Customer Email:</td>
                        <td style="padding-bottom: 10px; color: #2563eb; font-weight: 600;">${userEmail}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px; color: #64748b; font-weight: 600;">Customer Phone:</td>
                        <td style="padding-bottom: 10px; color: #0f172a; font-weight: 600;">${userPhone}</td>
                      </tr>
                      ${formattedTotal ? `
                      <tr>
                        <td style="padding-bottom: 10px; color: #64748b; font-weight: 600;">Grand Total:</td>
                        <td style="padding-bottom: 10px; color: #166534; font-weight: 900; font-size: 16px;">${formattedTotal}</td>
                      </tr>
                      ` : ''}
                      ${fullAddress ? `
                      <tr>
                        <td style="padding-top: 10px; border-top: 1px dashed #cbd5e1; color: #64748b; font-weight: 600;">Shipping Address:</td>
                        <td style="padding-top: 10px; border-top: 1px dashed #cbd5e1; color: #334155; font-weight: 500;">${fullAddress}</td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Product List -->
              <div style="margin-bottom: 24px;">
                <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Items Ordered</h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #334155; line-height: 1.6;">
                  ${itemsListHTML}
                </ul>
              </div>

              <!-- Action Link -->
              <div style="text-align: center;">
                <a href="http://192.168.0.107:3001/orders" target="_blank" style="display: inline-block; background-color: #09090b; color: #ffffff; text-decoration: none; padding: 12px 26px; border-radius: 10px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px;">
                  Process Order in CMS
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #f1f5f9; padding: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
              Markline Order Fulfillment Engine
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
