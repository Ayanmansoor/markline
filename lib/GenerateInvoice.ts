import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { safeJsonParse } from "./utils";

const parseColor = (raw: any): string => {
  if (!raw) return 'Standard';
  if (typeof raw === 'string') {
    const parsed = safeJsonParse(raw);
    if (parsed) return parsed.name || parsed.color || raw;
    return raw;
  }
  return raw.name || 'Standard';
};

const parseSize = (raw: any): string => {
  if (!raw) return 'Standard';
  if (typeof raw === 'string') {
    const parsed = safeJsonParse(raw);
    if (parsed) return parsed.size ? `${parsed.size} ${parsed.unit || ''}`.trim() : raw;
    return raw;
  }
  return raw.size ? `${raw.size} ${raw.unit || ''}`.trim() : 'Standard';
};

export function GenerateInvoice(order: any) {
  if (!order) return;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  let y = 40;

  // -----------------------------------------
  // HEADER LOGO & INVOICE TITLE
  // -----------------------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("MARKLINE", pageWidth / 2, y, { align: "center" });

  y += 24;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("ACQUISITION INVOICE", pageWidth / 2, y, { align: "center" });

  y += 30;

  // -----------------------------------------
  // ORDER METADATA
  // -----------------------------------------
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const orderId = order.id ? order.id.toString() : 'N/A';
  const orderDate = order.created_at ? new Date(order.created_at).toDateString() : new Date().toDateString();
  const paymentMethod = order.payment_method || 'Online Payment';
  const paymentStatus = (order.payment_status || 'Paid').toUpperCase();

  doc.text(`Order ID: ${orderId}`, 50, y);
  doc.text(`Payment Method: ${paymentMethod}`, pageWidth - 200, y);
  y += 16;

  doc.text(`Order Date: ${orderDate}`, 50, y);
  doc.text(`Payment Status: ${paymentStatus}`, pageWidth - 200, y);
  y += 25;

  // -----------------------------------------
  // AUTOTABLE – MULTI-ITEM PRODUCT TABLE
  // -----------------------------------------
  const itemsList = Array.isArray(order.order_items) && order.order_items.length > 0 
    ? order.order_items 
    : [order];

  const tableBody = itemsList.map((item: any) => {
    const prodName = item.product?.name || item.name || 'Markline Creation';
    const colorStr = parseColor(item.color);
    const sizeStr = parseSize(item.size);
    const qty = item.quantity || 1;
    const unitPrice = Number(item.unit_price || item.final_price || 0);
    const finalPrice = Number(item.final_price || (unitPrice * qty));

    return [
      prodName,
      colorStr,
      sizeStr,
      qty,
      `INR ${unitPrice}`,
      `INR ${finalPrice}`,
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [
      ["Product Description", "Color", "Size", "Qty", "Unit Price", "Total"]
    ],
    body: tableBody,

    columnStyles: {
      0: { cellWidth: 180 }, // Product
      1: { cellWidth: 70 },  // Color
      2: { cellWidth: 60 },  // Size
      3: { cellWidth: 40 },  // Qty
      4: { cellWidth: 70 },  // Price
      5: { cellWidth: 80 },  // Total
    },

    styles: {
      fontSize: 9,
      cellPadding: 8,
      overflow: "linebreak",
    },

    headStyles: {
      fillColor: [20, 20, 20],
      textColor: "#ffffff",
      fontSize: 10,
      fontStyle: "bold",
    },
  });

  y = (doc as any).lastAutoTable.finalY + 25;

  // -----------------------------------------
  // FINANCIAL BREAKDOWN
  // -----------------------------------------
  const subtotal = order.subtotal 
    ? Number(order.subtotal) 
    : itemsList.reduce((acc: number, curr: any) => acc + (Number(curr.final_price || curr.unit_price || 0) * (curr.quantity || 1)), 0);

  const discount = Number(order.discount_amount || 0);
  const shipping = Number(order.shipping_charge || 0);
  const tax = Number(order.tax_amount || 0);
  const grandTotal = order.grand_total ? Number(order.grand_total) : (subtotal - discount + shipping + tax);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Financial Breakdown:", 50, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text(`Subtotal:`, 50, y);
  doc.text(`INR ${subtotal}`, 160, y);
  y += 16;

  if (discount > 0) {
    doc.text(`Discount ${order.coupon_code ? `(${order.coupon_code})` : ''}:`, 50, y);
    doc.text(`- INR ${discount}`, 160, y);
    y += 16;
  }

  doc.text(`Shipping Charge:`, 50, y);
  doc.text(`${shipping > 0 ? `INR ${shipping}` : 'Free Delivery'}`, 160, y);
  y += 16;

  if (tax > 0) {
    doc.text(`Tax Amount:`, 50, y);
    doc.text(`INR ${tax}`, 160, y);
    y += 16;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Grand Total:`, 50, y);
  doc.text(`INR ${grandTotal}`, 160, y);
  y += 35;

  // -----------------------------------------
  // FOOTER
  // -----------------------------------------
  const footerY = doc.internal.pageSize.height - 50;

  doc.setLineWidth(0.5);
  doc.setDrawColor(220, 220, 220);
  doc.line(40, footerY, pageWidth - 40, footerY);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.text("Thank you for choosing Markline.", 50, footerY + 18);
  doc.text("www.marklinefashion.in", pageWidth - 140, footerY + 18);

  // -----------------------------------------
  // SAVE FILE
  // -----------------------------------------
  doc.save(`Invoice_ORD_${orderId.slice(0, 8).toUpperCase()}.pdf`);
}
