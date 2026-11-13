import { randomBytes } from "node:crypto";
import { Prisma, type PrismaClient } from "@prisma/client";
import type { CheckoutInput, ProviderStatus } from "./validation";
import type { Catalog, Receipt } from "./types";
import { BookingError, digest } from "./security";

const includeOrder = { items: { include: { schedule: true } }, payments: true, tickets: true } satisfies Prisma.OrderInclude;
type FullOrder = Prisma.OrderGetPayload<{ include: typeof includeOrder }>;
type Tx = Prisma.TransactionClient;
const transactionOptions = { maxWait: 10_000, timeout: 20_000 };

export function sessionStarts(date: Date, session: string) {
  if (!/^\d{2}:\d{2}$/.test(session)) return NaN;
  return Date.parse(`${date.toISOString().slice(0, 10)}T${session}:00+07:00`);
}

async function lockOrder(tx: Tx, orderNumber: string) {
  await tx.$queryRaw`SELECT id FROM "ticketing"."Order" WHERE "orderNumber" = ${orderNumber} FOR UPDATE`;
}

async function releaseQuota(tx: Tx, items: FullOrder["items"]) {
  const quantities = new Map<string, number>();
  for (const item of items) quantities.set(item.scheduleId, (quantities.get(item.scheduleId) || 0) + item.quantity);
  for (const [id, quantity] of [...quantities].sort()) {
    const changed = await tx.schedule.updateMany({ where: { id, reserved: { gte: quantity } }, data: { reserved: { decrement: quantity } } });
    if (changed.count !== 1) throw new BookingError("QUOTA_INCONSISTENT", 503);
  }
}

export async function expireOrder(db: PrismaClient, orderNumber: string, now = new Date()) {
  return db.$transaction(async (tx) => {
    await lockOrder(tx, orderNumber);
    const order = await tx.order.findUnique({ where: { orderNumber }, include: includeOrder });
    if (!order || order.status !== "PENDING" || order.expiresAt > now) return false;
    await releaseQuota(tx, order.items);
    await tx.order.update({ where: { id: order.id }, data: { status: "EXPIRED" } });
    await tx.payment.updateMany({ where: { orderId: order.id, status: "PENDING" }, data: { status: "EXPIRED" } });
    await tx.auditLog.create({ data: { action: "ORDER_EXPIRED", entityType: "Order", entityId: order.id } });
    return true;
  }, transactionOptions);
}

export async function expireDueOrders(db: PrismaClient, now = new Date()) {
  const orders = await db.order.findMany({ where: { status: "PENDING", expiresAt: { lte: now } }, select: { orderNumber: true }, take: 20, orderBy: { expiresAt: "asc" } });
  for (const order of orders) await expireOrder(db, order.orderNumber, now);
}

export async function catalog(db: PrismaClient, checkoutEnabled: boolean, now = new Date()): Promise<Catalog> {
  await expireDueOrders(db, now);
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(now);
  const [products, sessions, categories] = await Promise.all([
    db.product.findMany({ where: { active: true, price: { gt: 0 }, OR: [{ categoryId: null }, { category: { active: true } }] }, select: { id: true, name: true, description: true, price: true, type: true, categoryId: true, imagePath: true, policy: true, schedules: { select: { scheduleId: true, price: true, active: true } } }, orderBy: { price: "asc" } }),
    db.schedule.findMany({ where: { active: true, date: { gte: new Date(`${today}T00:00:00Z`) } }, orderBy: [{ date: "asc" }, { session: "asc" }], take: 1000 }),
    db.bookingCategory.findMany({ where: { active: true }, select: { id: true, slug: true, name: true, description: true, image: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
  ]);
  const schedules = sessions.filter((s) => sessionStarts(s.date, s.session) > now.getTime()).map((s) => ({ id: s.id, date: s.date.toISOString().slice(0, 10), session: s.session, available: Math.max(0, s.capacity - s.reserved - s.sold) }));
  return { state: products.length && schedules.length ? "available" : "not_open", sandbox: true, checkoutEnabled, categories,
    products: products.map(({ schedules: prices, ...product }) => ({ ...product, ...(prices.length ? { schedulePrices: prices } : {}) })), schedules };
}

export async function reserveOrder(db: PrismaClient, input: CheckoutInput, now = new Date(), visitorId?: string) {
  await expireDueOrders(db, now);
  const requestKeyHash = digest(input.requestKey);
  const requestHash = digest(JSON.stringify({ ...input, items: [...input.items].sort((a, b) => a.productId.localeCompare(b.productId)) }));
  return db.$transaction(async (tx) => {
    // Serialize retries of one request even before its order exists.
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${requestKeyHash}, 0))`;
    const existing = await tx.order.findUnique({ where: { requestKeyHash }, include: includeOrder });
    if (existing) {
      if (existing.requestHash !== requestHash || existing.visitorId !== (visitorId || null)) throw new BookingError("REQUEST_CONFLICT", 409);
      return existing;
    }
    await tx.$queryRaw`SELECT id FROM "ticketing"."Schedule" WHERE id = ${input.scheduleId} FOR UPDATE`;
    const schedule = await tx.schedule.findUnique({ where: { id: input.scheduleId } });
    if (!schedule?.active || !(sessionStarts(schedule.date, schedule.session) > now.getTime())) throw new BookingError("SCHEDULE_UNAVAILABLE", 409);
    const quantity = input.items.reduce((sum, item) => sum + item.quantity, 0);
    if (schedule.capacity - schedule.reserved - schedule.sold < quantity) throw new BookingError("QUOTA_FULL", 409);
    let products = await tx.product.findMany({ where: { id: { in: input.items.map((item) => item.productId) }, active: true, price: { gt: 0 }, OR: [{ categoryId: null }, { category: { active: true } }] } });
    if (products.length !== input.items.length) throw new BookingError("PRODUCT_UNAVAILABLE", 409);
    // Product locks serialize price/configuration changes with reservation snapshots.
    for (const id of products.map(product => product.id).sort()) {
      await tx.$queryRaw`SELECT id FROM "ticketing"."Product" WHERE id = ${id} FOR SHARE`;
    }
    for (const id of [...new Set(products.flatMap(product => product.categoryId ? [product.categoryId] : []))].sort()) {
      await tx.$queryRaw`SELECT id FROM "ticketing"."BookingCategory" WHERE id = ${id} FOR SHARE`;
    }
    products = await tx.product.findMany({ where: { id: { in: input.items.map(item => item.productId) }, active: true, price: { gt: 0 }, OR: [{ categoryId: null }, { category: { active: true } }] } });
    if (products.length !== input.items.length) throw new BookingError("PRODUCT_UNAVAILABLE", 409);
    const prices = await tx.productSchedule.findMany({ where: { productId: { in: products.map(product => product.id) } } });
    const items = input.items.map((item) => {
      const product = products.find((product) => product.id === item.productId)!;
      const configured = prices.filter(price => price.productId === product.id);
      const offer = configured.find(price => price.scheduleId === schedule.id && price.active);
      if (configured.length && !offer) throw new BookingError("PRODUCT_UNAVAILABLE", 409);
      const unitPrice = offer?.price ?? product.price;
      return { productId: product.id, scheduleId: schedule.id, productName: product.name, unitPrice, quantity: item.quantity, lineTotal: unitPrice * item.quantity };
    });
    const totalAmount = items.reduce((sum, item) => sum + item.lineTotal, 0);
    if (!Number.isSafeInteger(totalAmount) || totalAmount <= 0 || totalAmount > 1_000_000_000) throw new BookingError("INVALID_TOTAL");
    // Existing customer profiles are never overwritten by an unauthenticated buyer.
    const customer = await tx.customer.upsert({ where: { email: input.customer.email }, update: {}, create: input.customer });
    const order = await tx.order.create({
      data: { orderNumber: `LU-${randomBytes(12).toString("hex")}`, customerId: customer.id, visitorId, totalAmount,
        requestKeyHash, requestHash, expiresAt: new Date(now.getTime() + 15 * 60_000),
        items: { create: items }, payments: { create: { provider: "midtrans-sandbox", amount: totalAmount } } }, include: includeOrder,
    });
    await tx.schedule.update({ where: { id: schedule.id }, data: { reserved: { increment: quantity } } });
    await tx.auditLog.create({ data: { action: "ORDER_RESERVED", entityType: "Order", entityId: order.id } });
    return order;
  }, transactionOptions);
}

export type CheckoutProvider = {
  create(order: FullOrder, customer: CheckoutInput["customer"]): Promise<string>;
  status(orderNumber: string): Promise<ProviderStatus | null>;
};

export async function startCheckout(db: PrismaClient, order: FullOrder, customer: CheckoutInput["customer"], provider: CheckoutProvider) {
  const payment = order.payments[0];
  if (order.status !== "PENDING" || order.expiresAt <= new Date() || !payment || payment.checkoutUrl) return;
  const claimed = await db.payment.updateMany({ where: { id: payment.id, checkoutStartedAt: null, status: "PENDING" }, data: { checkoutStartedAt: new Date() } });
  if (!claimed.count) return;
  try {
    const checkoutUrl = await provider.create(order, customer);
    await db.payment.update({ where: { id: payment.id }, data: { checkoutUrl } });
  } catch {
    // A timed-out create may have succeeded upstream. Keep the hold; never
    // duplicate the gateway transaction or release a possibly paid reservation.
    await db.auditLog.create({ data: { action: "CHECKOUT_CREATE_UNCERTAIN", entityType: "Order", entityId: order.id } });
  }
}

export async function receipt(db: PrismaClient, orderNumber: string): Promise<Receipt> {
  await expireOrder(db, orderNumber);
  const order = await db.order.findUnique({ where: { orderNumber }, include: includeOrder });
  if (!order) throw new BookingError("NOT_FOUND", 404);
  return { orderNumber: order.orderNumber, status: order.status, totalAmount: order.totalAmount,
    expiresAt: order.expiresAt.toISOString(), checkoutUrl: order.status === "PENDING" ? order.payments[0]?.checkoutUrl || null : null,
    items: order.items.map((item) => ({ name: item.productName, quantity: item.quantity, total: item.lineTotal, date: item.schedule.date.toISOString().slice(0, 10), session: item.schedule.session })),
    tickets: order.tickets.map((ticket) => ({ code: ticket.code, status: ticket.status })) };
}

export async function applyPaymentStatus(db: PrismaClient, status: ProviderStatus, now = new Date()) {
  return db.$transaction(async (tx) => {
    await lockOrder(tx, status.order_id);
    const order = await tx.order.findUnique({ where: { orderNumber: status.order_id }, include: includeOrder });
    if (!order) throw new BookingError("NOT_FOUND", 404);
    const payment = order.payments.find((p) => p.provider === "midtrans-sandbox");
    if (!payment || Number(status.gross_amount) !== order.totalAmount || payment.amount !== order.totalAmount) throw new BookingError("AMOUNT_MISMATCH", 409);
    if (payment.providerPaymentId && payment.providerPaymentId !== status.transaction_id) throw new BookingError("PAYMENT_MISMATCH", 409);
    const paid = status.status_code === "200" && (status.transaction_status === "settlement" || (status.transaction_status === "capture" && status.fraud_status === "accept"))
      && (!status.fraud_status || status.fraud_status === "accept");
    // Only allow forward transitions. Replays and old pending notifications do nothing.
    if (paid && !["PAID", "REFUNDED", "PAYMENT_REVIEW"].includes(order.status)) {
      const late = order.status !== "PENDING" || order.expiresAt <= now;
      if (late && order.status === "PENDING") await releaseQuota(tx, order.items);
      if (!late) {
        const quantities = new Map<string, number>();
        for (const item of order.items) quantities.set(item.scheduleId, (quantities.get(item.scheduleId) || 0) + item.quantity);
        for (const [id, quantity] of [...quantities].sort()) {
          const updated = await tx.schedule.updateMany({ where: { id, reserved: { gte: quantity } }, data: { reserved: { decrement: quantity }, sold: { increment: quantity } } });
          if (updated.count !== 1) throw new BookingError("QUOTA_INCONSISTENT", 503);
        }
        await tx.ticket.createMany({ data: order.items.flatMap(item => Array.from({ length: item.quantity }, () => ({ orderId: order.id, orderItemId: item.id, code: `LUT-${randomBytes(12).toString("hex")}`, qrToken: randomBytes(32).toString("hex") }))) });
      }
      await tx.order.update({ where: { id: order.id }, data: { status: late ? "PAYMENT_REVIEW" : "PAID", paidAt: now } });
      await tx.payment.update({ where: { id: payment.id }, data: { status: "SETTLED", providerPaymentId: status.transaction_id, paidAt: now } });
      await tx.auditLog.create({ data: { action: late ? "LATE_PAYMENT_REVIEW" : "PAYMENT_SETTLED", entityType: "Order", entityId: order.id } });
    } else if (["deny", "cancel", "expire", "failure"].includes(status.transaction_status) && order.status === "PENDING") {
      await releaseQuota(tx, order.items);
      await tx.order.update({ where: { id: order.id }, data: { status: status.transaction_status === "expire" ? "EXPIRED" : "CANCELLED" } });
      await tx.payment.update({ where: { id: payment.id }, data: { status: status.transaction_status === "expire" ? "EXPIRED" : "FAILED", providerPaymentId: status.transaction_id } });
      await tx.auditLog.create({ data: { action: "PAYMENT_CLOSED", entityType: "Order", entityId: order.id } });
    } else if (status.transaction_status === "cancel" && order.status === "PAID") {
      // A captured card transaction can still be voided before settlement.
      await tx.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
      await tx.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
      await tx.ticket.updateMany({ where: { orderId: order.id, status: "ISSUED" }, data: { status: "CANCELLED" } });
      await tx.auditLog.create({ data: { action: "PAYMENT_VOIDED", entityType: "Order", entityId: order.id } });
    } else if (["refund", "chargeback"].includes(status.transaction_status) && ["PAID", "PAYMENT_REVIEW"].includes(order.status)) {
      await tx.order.update({ where: { id: order.id }, data: { status: "REFUNDED" } });
      await tx.payment.update({ where: { id: payment.id }, data: { status: "REFUNDED" } });
      await tx.ticket.updateMany({ where: { orderId: order.id, status: "ISSUED" }, data: { status: "CANCELLED" } });
      // Do not reopen seats automatically after refunds, including used tickets.
      await tx.auditLog.create({ data: { action: "PAYMENT_REFUNDED", entityType: "Order", entityId: order.id } });
    } else if (["partial_refund", "partial_chargeback"].includes(status.transaction_status) && order.status === "PAID") {
      await tx.order.update({ where: { id: order.id }, data: { status: "PAYMENT_REVIEW" } });
      await tx.ticket.updateMany({ where: { orderId: order.id, status: "ISSUED" }, data: { status: "CANCELLED" } });
      await tx.auditLog.create({ data: { action: "PARTIAL_REFUND_REVIEW", entityType: "Order", entityId: order.id } });
    }
  }, transactionOptions);
}

export async function rateLimit(db: PrismaClient, scope: string, identity: string, limit: number, windowMs = 60_000) {
  const now = Date.now();
  const window = Math.floor(now / windowMs);
  const key = digest(`${scope}:${identity}:${window}`);
  const counter = await db.rateLimit.upsert({ where: { key }, create: { key, expiresAt: new Date((window + 1) * windowMs) }, update: { count: { increment: 1 } } });
  if (counter.count > limit) throw new BookingError("RATE_LIMITED", 429);
  // Bounded opportunistic cleanup; never log IPs, emails, or webhook payloads.
  await db.$executeRaw`DELETE FROM "ticketing"."RateLimit" WHERE key IN (SELECT key FROM "ticketing"."RateLimit" WHERE "expiresAt" < NOW() LIMIT 100)`;
}
