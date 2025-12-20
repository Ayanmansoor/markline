import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function GenerateInvoice(order: any) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  let y = 40;

  // -----------------------------------------
  // HEADER LOGO
  // -----------------------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text("MARKLINE", pageWidth / 2, y, { align: "center" });

  y += 28;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("INVOICE", pageWidth / 2, y, { align: "center" });

  y += 30;

  // -----------------------------------------
  // ORDER INFO
  // -----------------------------------------
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  doc.text(`Order ID: ${order.id}`, 50, y);
  y += 15;

  doc.text(`Date: ${new Date(order.created_at).toDateString()}`, 50, y);
  y += 25;

  // -----------------------------------------
  // AUTOTABLE – PRODUCT TABLE
  // -----------------------------------------

  const colorObj = JSON.parse(order.color);
  const sizeObj = JSON.parse(order.size);

  autoTable(doc, {
    startY: y,
    head: [
      ["Product", "Color", "Size", "Qty", "Price", "Total"]
    ],
    body: [
      [
        order.product.name,
        colorObj.name,
        `${sizeObj.size} ${sizeObj.unit}`,
        order.quantity,
        `₹${order.final_price}`,
        `₹${order.final_price * order.quantity}`,
      ],
    ],

    // CLEAN WIDTHS
    columnStyles: {
      0: { cellWidth: 180 }, // Product
      1: { cellWidth: 80 },  // Color
      2: { cellWidth: 60 },  // Size
      3: { cellWidth: 40 },  // Qty
      4: { cellWidth: 70 },  // Price
      5: { cellWidth: 80 },  // Total
    },

    styles: {
      fontSize: 10,
      cellPadding: 6,
      overflow: "linebreak",
    },

    headStyles: {
      fillColor: [40, 40, 40],
      textColor: "#fff",
      fontSize: 11,
    },
  });

  y = (doc as any).lastAutoTable.finalY + 30;

  // -----------------------------------------
  // AMOUNT DETAILS
  // -----------------------------------------
  const subtotal = order.final_price * order.quantity;
  const discount = order.discount_amount || 0;
  const total = order.total_amount;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Amount Details:", 50, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  doc.text(`Subtotal: ₹${subtotal}`, 50, y);
  y += 18;

  doc.text(`Discount: ₹${discount}`, 50, y);
  y += 18;

  doc.setFont("helvetica", "bold");
  doc.text(`Total Amount: ₹${total}`, 50, y);
  y += 40;

  // -----------------------------------------
  // FOOTER
  // -----------------------------------------
  const footerY = doc.internal.pageSize.height - 60;

  doc.setLineWidth(0.5);
  doc.line(40, footerY, pageWidth - 40, footerY);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text("Thank you for shopping with Markline!", 50, footerY + 20);
  doc.text("www.marklinefashion.in", pageWidth - 150, footerY + 20);

  // -----------------------------------------
  // SAVE
  // -----------------------------------------
  doc.save(`Invoice_${order.id}.pdf`);
}
