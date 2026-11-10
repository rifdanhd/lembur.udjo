import { after, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID, createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { reserveOrder, expireOrder, applyPaymentStatus, receipt, catalog, startCheckout, rateLimit, type CheckoutProvider } from "../lib/ticketing/orders";
import { processNotification } from "../lib/ticketing/midtrans";
import { BookingError } from "../lib/ticketing/security";
import type { CheckoutInput, ProviderStatus } from "../lib/ticketing/validation";
import { registerVisitor, loginVisitor, visitorSession, createVisitorSession, ownedOrder } from "../lib/ticketing/visitor-auth";
import { digest } from "../lib/ticketing/security";

const url = process.env.TICKETING_TEST_DATABASE_URL;
if (!url || new URL(url).hostname !== "127.0.0.1" || new URL(url).pathname !== "/ticketing_phase2_test") throw new Error("Run node scripts/test-ticketing.mjs. Tests may only use the disposable local database.");
const db = new PrismaClient({ datasourceUrl: url });
after(async () => { await db.$disconnect(); });
let productId: string;
let scheduleId: string;

beforeEach(async () => {
  await db.$transaction([db.checkIn.deleteMany(), db.ticket.deleteMany(), db.payment.deleteMany(), db.orderItem.deleteMany(), db.order.deleteMany(), db.visitorSession.deleteMany(), db.visitorAccount.deleteMany(), db.customer.deleteMany(), db.product.deleteMany(), db.schedule.deleteMany(), db.auditLog.deleteMany(), db.rateLimit.deleteMany()]);
  const product = await db.product.create({ data: { name: "Tiket Uji", slug: "test", type: "ADULT", price: 75000 } });
  const date = new Date(Date.now() + 86_400_000);
  const schedule = await db.schedule.create({ data: { date, session: "13:00", capacity: 5 } });
  productId = product.id; scheduleId = schedule.id;
});

function input(quantity = 1): CheckoutInput {
  return { requestKey: randomUUID(), scheduleId, items: [{ productId, quantity }], customer: { name: "Pelanggan Uji", email: `${randomUUID()}@example.test`, whatsapp: "081234567890" }, consent: true };
}
function status(order: { orderNumber: string; totalAmount: number }, transaction_status: ProviderStatus["transaction_status"] = "settlement"): ProviderStatus {
  return { order_id: order.orderNumber, gross_amount: `${order.totalAmount}.00`, transaction_id: "transaction-test", status_code: "200", transaction_status, fraud_status: "accept", currency: "IDR" };
}
const isError = (code: string) => (error: unknown) => error instanceof BookingError && error.code === code;

test("10 simultaneous buyers cannot oversell 5 seats; totals and 15-minute hold come from server", async () => {
  const results = await Promise.allSettled(Array.from({ length: 10 }, () => reserveOrder(db, input())));
  assert.equal(results.filter((result) => result.status === "fulfilled").length, 5);
  const schedule = await db.schedule.findUniqueOrThrow({ where: { id: scheduleId } });
  assert.equal(schedule.reserved, 5); assert.equal(schedule.sold, 0);
  const orders = await db.order.findMany();
  assert.equal(orders.length, 5);
  assert.ok(orders.every((order) => order.totalAmount === 75000 && Math.abs(order.expiresAt.getTime() - order.createdAt.getTime() - 900000) < 2000));
});

test("concurrent retries create exactly one order; changed payload cannot reuse its key", async () => {
  const data = input(2);
  const orders = await Promise.all(Array.from({ length: 5 }, () => reserveOrder(db, data)));
  assert.equal(new Set(orders.map((order) => order.id)).size, 1);
  assert.equal((await db.schedule.findUniqueOrThrow({ where: { id: scheduleId } })).reserved, 2);
  await assert.rejects(reserveOrder(db, { ...data, items: [{ productId, quantity: 3 }] }), isError("REQUEST_CONFLICT"));
});

test("inactive and past sessions cannot be booked, and inactive examples remain hidden", async () => {
  await db.product.update({ where: { id: productId }, data: { active: false } });
  await assert.rejects(reserveOrder(db, input()), isError("PRODUCT_UNAVAILABLE"));
  assert.equal((await catalog(db, false)).products.length, 0);
  await db.product.update({ where: { id: productId }, data: { active: true } });
  await db.schedule.update({ where: { id: scheduleId }, data: { date: new Date("2000-01-01") } });
  await assert.rejects(reserveOrder(db, input()), isError("SCHEDULE_UNAVAILABLE"));
});

test("expired reservation releases quota exactly once under concurrent expiry", async () => {
  const order = await reserveOrder(db, input(3));
  const later = new Date(order.expiresAt.getTime() + 1);
  const results = await Promise.all(Array.from({ length: 5 }, () => expireOrder(db, order.orderNumber, later)));
  assert.equal(results.filter(Boolean).length, 1);
  assert.equal((await db.schedule.findUniqueOrThrow({ where: { id: scheduleId } })).reserved, 0);
});

test("concurrent signed webhook replay issues tickets and converts reserved quota only once", async () => {
  const order = await reserveOrder(db, input(2));
  const key = "sandbox-server-key";
  const notification = { ...status(order), signature_key: "" };
  notification.signature_key = createHash("sha512").update(notification.order_id + notification.status_code + notification.gross_amount + key).digest("hex");
  const provider: CheckoutProvider = { async create() { return "unused"; }, async status() { return status(order); } };
  await Promise.all(Array.from({ length: 5 }, () => processNotification(db, notification, key, provider)));
  const result = await receipt(db, order.orderNumber);
  assert.equal(result.status, "PAID"); assert.equal(result.tickets.length, 2);
  const schedule = await db.schedule.findUniqueOrThrow({ where: { id: scheduleId } });
  assert.equal(schedule.sold, 2); assert.equal(schedule.reserved, 0);
  assert.equal(await db.auditLog.count({ where: { action: "PAYMENT_SETTLED" } }), 1);
  await applyPaymentStatus(db, status(order, "pending"));
  assert.equal((await receipt(db, order.orderNumber)).status, "PAID");
});

test("valid signature with forged success cannot override provider pending; bad signature never calls provider", async () => {
  const order = await reserveOrder(db, input());
  const key = "sandbox-server-key";
  const body = { ...status(order), signature_key: "" };
  body.signature_key = createHash("sha512").update(body.order_id + body.status_code + body.gross_amount + key).digest("hex");
  let calls = 0;
  const provider: CheckoutProvider = { async create() { return "unused"; }, async status() { calls++; return status(order, "pending"); } };
  await processNotification(db, body, key, provider);
  assert.equal((await receipt(db, order.orderNumber)).status, "PENDING");
  await assert.rejects(processNotification(db, { ...body, signature_key: "0".repeat(128) }, key, provider), isError("INVALID_SIGNATURE"));
  assert.equal(calls, 1);
});

test("wrong amount and challenged capture cannot issue tickets", async () => {
  const order = await reserveOrder(db, input());
  await assert.rejects(applyPaymentStatus(db, { ...status(order), gross_amount: "1.00" }), isError("AMOUNT_MISMATCH"));
  await applyPaymentStatus(db, { ...status(order, "capture"), fraud_status: "challenge" });
  assert.equal((await receipt(db, order.orderNumber)).status, "PENDING");
  assert.equal(await db.ticket.count(), 0);
});

test("late settlement goes to manual review without overselling or issuing tickets", async () => {
  const order = await reserveOrder(db, input(5));
  const later = new Date(order.expiresAt.getTime() + 1);
  await expireOrder(db, order.orderNumber, later);
  await reserveOrder(db, input(5));
  await applyPaymentStatus(db, status(order), later);
  assert.equal((await receipt(db, order.orderNumber)).status, "PAYMENT_REVIEW");
  assert.equal(await db.ticket.count(), 0);
  assert.equal((await db.schedule.findUniqueOrThrow({ where: { id: scheduleId } })).reserved, 5);
});

test("provider expiry releases hold and full refunds revoke tickets without reopening used capacity", async () => {
  const expired = await reserveOrder(db, input(2));
  await applyPaymentStatus(db, status(expired, "expire"));
  assert.equal((await db.schedule.findUniqueOrThrow({ where: { id: scheduleId } })).reserved, 0);
  const order = await reserveOrder(db, input(2));
  await applyPaymentStatus(db, { ...status(order), transaction_id: "other-payment" });
  await applyPaymentStatus(db, { ...status(order, "refund"), transaction_id: "other-payment" });
  assert.equal((await receipt(db, order.orderNumber)).status, "REFUNDED");
  assert.equal(await db.ticket.count({ where: { status: "CANCELLED" } }), 2);
  assert.equal((await db.schedule.findUniqueOrThrow({ where: { id: scheduleId } })).sold, 2);
});

test("gateway timeout never retries a possibly created payment or releases its quota early", async () => {
  const data = input(2);
  const order = await reserveOrder(db, data);
  let calls = 0;
  const provider: CheckoutProvider = { async create() { calls++; throw new Error("timeout"); }, async status() { return null; } };
  await Promise.all([startCheckout(db, order, data.customer, provider), startCheckout(db, order, data.customer, provider)]);
  assert.equal(calls, 1);
  assert.equal((await db.schedule.findUniqueOrThrow({ where: { id: scheduleId } })).reserved, 2);
  assert.equal((await receipt(db, order.orderNumber)).status, "PENDING");
});

test("buyer cannot overwrite another customer's profile and receipts never expose customer PII or QR secrets", async () => {
  const data = input();
  await db.customer.create({ data: { name: "Original", email: data.customer.email, whatsapp: "081111111111" } });
  const order = await reserveOrder(db, data);
  assert.equal((await db.customer.findUniqueOrThrow({ where: { email: data.customer.email } })).name, "Original");
  const output = JSON.stringify(await receipt(db, order.orderNumber));
  assert.ok(!output.includes(data.customer.email)); assert.ok(!output.includes("qrToken"));
});

test("database rate limiting remains atomic under concurrent requests", async () => {
  const results = await Promise.allSettled(Array.from({ length: 10 }, () => rateLimit(db, "test", "visitor", 3)));
  assert.equal(results.filter((result) => result.status === "fulfilled").length, 3);
});

test("visitor registration hashes passwords; login, session expiry and server-side revocation work", async () => {
  const data = { name: "Pengunjung Tes", email: "visitor@example.test", password: "Kata-Sandi-Uji-Panjang-123", consent: true as const };
  const visitor = await registerVisitor(db, data);
  const saved = await db.visitorAccount.findUniqueOrThrow({ where: { id: visitor.id } });
  assert.notEqual(saved.passwordHash, data.password); assert.ok(saved.passwordHash.startsWith("scrypt-v1$"));
  await assert.rejects(loginVisitor(db, { email: data.email, password: "salah" }), isError("LOGIN_FAILED"));
  assert.equal((await loginVisitor(db, data)).id, visitor.id);
  const session = await createVisitorSession(db, visitor.id);
  assert.equal((await visitorSession(db, session.token))?.visitor.id, visitor.id);
  assert.equal(await db.visitorSession.count({ where: { tokenHash: session.token } }), 0);
  await db.visitorSession.update({ where: { tokenHash: digest(session.token) }, data: { expiresAt: new Date(0) } });
  assert.equal(await visitorSession(db, session.token), null);
  const fresh = await createVisitorSession(db, visitor.id);
  await db.visitorSession.deleteMany({ where: { tokenHash: digest(fresh.token) } });
  assert.equal(await visitorSession(db, fresh.token), null);
  await assert.rejects(registerVisitor(db, data), isError("REGISTRATION_UNAVAILABLE"));
});

test("orders are account-owned; matching email never claims historical orders; another account cannot replay an order", async () => {
  const data = input();
  const historical = await reserveOrder(db, data);
  const a = await registerVisitor(db, { name: "Visitor A", email: data.customer.email, password: "Kata-Sandi-Uji-Panjang-123", consent: true });
  const b = await registerVisitor(db, { name: "Visitor B", email: "other@example.test", password: "Kata-Sandi-Uji-Panjang-456", consent: true });
  await assert.rejects(ownedOrder(db, a.id, historical.orderNumber), isError("NOT_FOUND"));
  const next = { ...data, requestKey: randomUUID() };
  const order = await reserveOrder(db, next, new Date(), a.id);
  assert.equal((await ownedOrder(db, a.id, order.orderNumber)).id, order.id);
  await assert.rejects(ownedOrder(db, b.id, order.orderNumber), isError("NOT_FOUND"));
  await assert.rejects(reserveOrder(db, next, new Date(), b.id), isError("REQUEST_CONFLICT"));
});
