import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import type { ticketDownloadData } from "./tickets";

type TicketOrder = Awaited<ReturnType<typeof ticketDownloadData>>;
export async function ticketPdf(order: TicketOrder): Promise<Buffer> {
  const document = new PDFDocument({ size: "A5", margin: 32, autoFirstPage: false, info: { Title: `E-Tiket Sandbox ${order.orderNumber}`, Author: "Lembur Udjo Parahyangan" } });
  const chunks: Buffer[] = [];
  const complete = new Promise<Buffer>((resolve, reject) => { document.on("data", chunk => chunks.push(chunk)); document.on("end", () => resolve(Buffer.concat(chunks))); document.on("error", reject); });
  for (const ticket of order.tickets) {
    const qr = await QRCode.toBuffer(`LUP1:${ticket.code}:${ticket.qrToken}`, { errorCorrectionLevel: "M", width: 320, margin: 4 });
    document.addPage();
    document.rect(0, 0, 420, 100).fill("#0d2317");
    document.fillColor("#f7f5f0").fontSize(20).text("Lembur Udjo", 32, 28).fontSize(12).text("Parahyangan · E-Tiket", 32, 55);
    document.fillColor("#8b6914").fontSize(11).text("SIMULASI SANDBOX", 32, 119);
    document.fillColor("#0d2317").fontSize(10).text("Tidak berlaku untuk masuk kawasan.", 32, 137);
    document.fontSize(10).text(`Reservasi: ${order.orderNumber}`, 32, 165).text(`Tiket: ${ticket.code}`, 32, 183).text(`Status: ${ticket.status}`, 32, 201);
    const items = ticket.orderItem ? [ticket.orderItem] : order.items;
    let y = 228;
    for (const item of items) {
      const date = new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "Asia/Jakarta" }).format(item.schedule.date);
      document.fontSize(12).text(item.productName, 32, y, { width: 350 });
      y = document.y + 6;
      document.fontSize(10).text(`${date} · ${item.schedule.session} WIB`, 32, y, { width: 350 });
      y = document.y + 12;
    }
    if (!ticket.orderItem && order.items.length > 1) document.fontSize(9).text("Tiket lama: kategori per tiket belum tercatat.", 32, y);
    document.image(qr, 130, 340, { width: 160, height: 160 });
    document.fontSize(9).fillColor("#57534e").text("Tunjukkan QR ini kepada petugas berwenang.\nSatu tiket hanya dapat digunakan satu kali.", 32, 520, { width: 350, align: "center" });
  }
  document.end();
  return complete;
}
