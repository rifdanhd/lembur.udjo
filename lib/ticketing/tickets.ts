import type { PrismaClient } from "@prisma/client";
import { BookingError } from "./security";
import { jakartaDate } from "./availability";

export function parseTicketInput(value: string) {
  const qr = /^LUP1:(LUT-[a-f0-9]{24}):([a-f0-9]{64})$/.exec(value.trim());
  if (qr) return { code: qr[1], qrToken: qr[2] };
  if (/^LUT-[a-f0-9]{24}$/.test(value.trim())) return { code: value.trim() };
  throw new BookingError("TICKET_INVALID", 400);
}
export async function checkInTicket(db: PrismaClient, userId: string, value: string, now = new Date()) {
  const identity = parseTicketInput(value);
  return db.$transaction(async tx => {
    const staff = await tx.user.findFirst({ where: { id: userId, active: true } });
    if (!staff) throw new BookingError("STAFF_REQUIRED", 403);
    const initial = await tx.ticket.findUnique({ where: { code: identity.code }, select: { orderId: true } });
    if (!initial) throw new BookingError("TICKET_INVALID", 404);
    // Payment revocation and check-in serialize on the same order lock.
    await tx.$queryRaw`SELECT id FROM "ticketing"."Order" WHERE id = ${initial.orderId} FOR UPDATE`;
    const ticket = await tx.ticket.findUnique({ where: { code: identity.code }, include: { orderItem: { include: { schedule: true } }, order: { include: { items: { include: { schedule: true } } } } } });
    if (!ticket || (identity.qrToken && ticket.qrToken !== identity.qrToken)) throw new BookingError("TICKET_INVALID", 404);
    if (ticket.status === "USED") throw new BookingError("TICKET_USED", 409);
    if (ticket.status !== "ISSUED" || ticket.order.status !== "PAID") throw new BookingError("TICKET_INACTIVE", 409);
    const items = ticket.orderItem ? [ticket.orderItem] : ticket.order.items;
    if (!items.length || items.some(item => item.schedule.date.toISOString().slice(0, 10) !== jakartaDate(now))) throw new BookingError("TICKET_DATE", 409);
    const updated = await tx.ticket.updateMany({ where: { id: ticket.id, status: "ISSUED" }, data: { status: "USED", usedAt: now } });
    if (updated.count !== 1) throw new BookingError("TICKET_USED", 409);
    await tx.checkIn.create({ data: { ticketId: ticket.id, checkedById: userId, checkedAt: now, source: identity.qrToken ? "QR_SANDBOX" : "MANUAL_SANDBOX" } });
    await tx.auditLog.create({ data: { actorId: userId, action: "TICKET_CHECKED_IN_SANDBOX", entityType: "Ticket", entityId: ticket.id } });
    return { code: ticket.code, status: "USED", sandbox: true, program: items.map(item => item.productName).join(", "), session: items.map(item => item.schedule.session).join(", "), date: jakartaDate(now) };
  });
}
export async function ticketDownloadData(db: PrismaClient, orderNumber: string) {
  const order = await db.order.findUnique({ where: { orderNumber }, include: { tickets: { orderBy: { issuedAt: "asc" }, include: { orderItem: { include: { schedule: true } } } }, items: { include: { schedule: true } } } });
  if (!order || order.status !== "PAID" || !order.tickets.some(ticket => ticket.status === "ISSUED" || ticket.status === "USED")) throw new BookingError("TICKET_INACTIVE", 409);
  return order;
}
