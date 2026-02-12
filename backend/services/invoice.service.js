import { PDFDocument, StandardFonts } from "pdf-lib";

export const generateInvoicePDFBuffer = async (booking) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = 800;

  page.drawText("INVOICE", { x: 450, y, size: 20, font: bold });
  y -= 40;

  page.drawText(
    `Guest: ${booking.user.firstName} ${booking.user.lastName}`,
    { x: 40, y, size: 12, font }
  );

  y -= 20;
  page.drawText(`Room: ${booking.room.name}`, { x: 40, y, font });

  y -= 20;
  page.drawText(
    `Stay: ${booking.checkInDate.toISOString().split("T")[0]} to ${booking.checkOutDate.toISOString().split("T")[0]}`,
    { x: 40, y, font }
  );

  y -= 40;
  page.drawText("Description", { x: 40, y, font: bold });
  page.drawText("Qty", { x: 300, y, font: bold });
  page.drawText("Amount", { x: 400, y, font: bold });

  y -= 20;
  page.drawText("Room Charges", { x: 40, y, font });
  page.drawText("1", { x: 300, y, font });
  page.drawText(`INR ${booking.totalAmount}`, { x: 400, y, font });

  booking.addOns.forEach(a => {
    y -= 20;
    page.drawText(a.name, { x: 40, y, font });
    page.drawText(String(a.quantity), { x: 300, y, font });
    page.drawText(`INR ${a.price * a.quantity}`, { x: 400, y, font });
  });

  y -= 40;
  page.drawText(`TOTAL: INR ${booking.totalAmount}`, {
    x: 350,
    y,
    size: 14,
    font: bold
  });

  return Buffer.from(await pdfDoc.save());
};
