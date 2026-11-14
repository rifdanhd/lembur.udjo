import { randomBytes } from 'node:crypto';
import type { Prisma, PrismaClient } from '@prisma/client';
import { configuredEmailTransport, type EmailTransport } from './email';
import { bookingOrigin } from './booking-origin';
import { digest } from './security';
import { rupiah } from './types';
export type BookingEmailKind = 'RESERVATION' | 'PAYMENT' | 'TICKETS';
export async function queueBookingEmail(tx: Prisma.TransactionClient, orderId: string, recipient: string, kind: BookingEmailKind) {
  const order = await tx.order.findUniqueOrThrow({ where: { id: orderId }, include: { items: { include: { schedule: true } } } });
  const title = { RESERVATION: 'Reservasi diterima', PAYMENT: 'Pembayaran terkonfirmasi', TICKETS: 'E-ticket tersedia' }[kind];
  const lines = order.items.map(item => `${item.productName} × ${item.quantity} — ${new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'Asia/Jakarta' }).format(item.schedule.date)} ${item.schedule.session} WIB`);
  const text = ['Lembur Udjo Parahyangan', 'SIMULASI SANDBOX — bukan pembayaran/pendapatan nyata.', title, `Referensi: ${order.orderNumber}`, ...lines, `Nominal simulasi: ${rupiah(order.totalAmount)}`, `Status dan e-ticket: ${bookingOrigin()}/account/bookings/${order.orderNumber}`, 'Masuk dengan akun pemilik untuk melihat status terbaru dan mengunduh PDF.', 'Tiket Sandbox tidak berlaku untuk masuk kawasan.'].join('\n');
  await tx.emailDelivery.upsert({ where: { eventKey: `${orderId}:${kind}` }, create: { eventKey: `${orderId}:${kind}`, orderId, recipient, kind, subject: `[Sandbox LUP] ${title} — ${order.orderNumber}`, text }, update: {} });
}

// Worker only. Payment/webhook handlers never wait for a provider to send email.
export async function dispatchEmails(db: PrismaClient, transport: EmailTransport | null = configuredEmailTransport(), now = new Date()) {
  if (!transport) return { enabled: false, sent: 0, failed: 0 };
  const oldest = new Date(now.getTime() - 23 * 3600000);
  const due = { OR: [{ state: 'PENDING', nextAttemptAt: { lte: now } }, { state: 'SENDING', lockedUntil: { lte: now } }] };
  await db.emailDelivery.updateMany({ where: { ...due, createdAt: { lt: oldest } }, data: { state: 'CANCELLED', claimId: null, lockedUntil: null, lastError: 'DELIVERY_WINDOW_CLOSED' } });
  const pending = await db.emailDelivery.findMany({ where: { ...due, createdAt: { gte: oldest } }, orderBy: { createdAt: 'asc' }, take: 5 });
  let sent = 0, failed = 0;
  for (const email of pending) {
    const claimId = randomBytes(16).toString('hex');
    const claim = await db.emailDelivery.updateMany({ where: { id: email.id, ...due }, data: { state: 'SENDING', claimId, lockedUntil: new Date(now.getTime() + 300000), attempts: { increment: 1 } } });
    if (!claim.count) continue;
    try {
      const result = await transport.send({ to: email.recipient, subject: email.subject, text: email.text }, digest(email.eventKey));
      await db.emailDelivery.updateMany({ where: { id: email.id, claimId, state: 'SENDING' }, data: { state: 'SENT', providerMessageId: result.id, claimId: null, lockedUntil: null, lastError: null } });
      sent++;
    } catch {
      const attempts = email.attempts + 1;
      await db.emailDelivery.updateMany({ where: { id: email.id, claimId, state: 'SENDING' }, data: { state: attempts >= 8 ? 'FAILED' : 'PENDING', nextAttemptAt: new Date(now.getTime() + Math.min(3600000, 60000 * 2 ** (attempts - 1))), claimId: null, lockedUntil: null, lastError: 'PROVIDER_DELIVERY_FAILED' } });
      await db.auditLog.create({ data: { action: 'EMAIL_DELIVERY_FAILED', entityType: 'EmailDelivery', entityId: email.id } });
      failed++;
    }
  }
  return { enabled: true, sent, failed };
}
