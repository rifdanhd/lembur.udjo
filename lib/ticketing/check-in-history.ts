import type { PrismaClient } from '@prisma/client';
import { orderNumberSchema } from './validation';
import { BookingError } from './security';
export async function checkInHistory(db: PrismaClient, orderNumber?: string) {
  if (orderNumber && !orderNumberSchema.safeParse(orderNumber).success) throw new BookingError('INVALID_INPUT');
  const rows = await db.checkIn.findMany({
    where: orderNumber ? { ticket: { order: { orderNumber } } } : {}, take: 100, orderBy: { checkedAt: 'desc' },
    select: { id: true, checkedAt: true, source: true, checkedBy: { select: { name: true } }, ticket: { select: { code: true, status: true, order: { select: { orderNumber: true } } } } },
  });
  return rows.map(row => ({ id: row.id, at: row.checkedAt.toISOString(), source: row.source, staff: row.checkedBy?.name || 'Petugas historis', code: row.ticket.code, status: row.ticket.status, orderNumber: row.ticket.order.orderNumber }));
}
