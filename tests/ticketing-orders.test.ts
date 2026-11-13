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
import { bookingDates, pricedSessions, selectedPrice, jakartaDate } from "../lib/ticketing/availability";
import { checkInTicket, ticketDownloadData } from "../lib/ticketing/tickets";
import { ticketPdf } from "../lib/ticketing/ticket-pdf";
import { googleVisitor } from "../lib/ticketing/google-auth";
import { createReset, resetPassword } from "../lib/ticketing/password-reset";
import { loginStaff, staffSession } from "../lib/ticketing/staff-auth";
import { hashPassword } from "../lib/ticketing/visitor-auth";
import { saveCatalog } from "../lib/ticketing/catalog-admin";

const url = process.env.TICKETING_TEST_DATABASE_URL;
if (!url || new URL(url).hostname !== "127.0.0.1" || new URL(url).pathname !== "/ticketing_phase2_test") throw new Error("Run node scripts/test-ticketing.mjs. Tests may only use the disposable local database.");
const db = new PrismaClient({ datasourceUrl: url });
after(async () => { await db.$disconnect(); });
let productId: string;
let scheduleId: string;

beforeEach(async () => {
  await db.$transaction([db.checkIn.deleteMany(), db.ticket.deleteMany(), db.payment.deleteMany(), db.orderItem.deleteMany(), db.order.deleteMany(), db.passwordReset.deleteMany(), db.oAuthAttempt.deleteMany(), db.staffSession.deleteMany(), db.user.deleteMany(), db.visitorSession.deleteMany(), db.visitorAccount.deleteMany(), db.customer.deleteMany(), db.productSchedule.deleteMany(), db.product.deleteMany(), db.bookingCategory.deleteMany(), db.schedule.deleteMany(), db.auditLog.deleteMany(), db.rateLimit.deleteMany()]);
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
  assert.notEqual(saved.passwordHash, data.password); assert.ok(saved.passwordHash!.startsWith("scrypt-v1$"));
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

test("date-specific prices, product sessions and checkout share authoritative configuration", async () => {
  const second = await db.schedule.create({ data: { date: new Date(Date.now() + 2 * 86400000), session: "10:00", capacity: 3 } });
  await saveCatalog(db, { action: "offer", productId, scheduleId, price: 91000, active: true });
  await saveCatalog(db, { action: "offer", productId, scheduleId: second.id, price: 62000, active: true });
  const result = await catalog(db, true);
  assert.equal(selectedPrice(result, productId, scheduleId), 91000);
  assert.equal(selectedPrice(result, productId, second.id), 62000);
  const order = await reserveOrder(db, { ...input(2), scheduleId: second.id });
  assert.equal(order.totalAmount, 124000);
  assert.equal(order.items[0].unitPrice, 62000);
  assert.equal(order.items[0].scheduleId, second.id);
  assert.equal((await receipt(db, order.orderNumber)).items[0].date, second.date.toISOString().slice(0, 10));
  await saveCatalog(db, { action: "offer", productId, scheduleId: second.id, price: 64000, active: true });
  assert.equal((await receipt(db, order.orderNumber)).totalAmount, 124000);
  assert.equal((await reserveOrder(db, { ...input(), scheduleId: second.id })).totalAmount, 64000);
});

test("disabled and unconfigured product sessions cannot bypass checkout, including stale carts", async () => {
  const second = await db.schedule.create({ data: { date: new Date(Date.now() + 2 * 86400000), session: "10:00", capacity: 3 } });
  await saveCatalog(db, { action: "offer", productId, scheduleId, price: 91000, active: false });
  assert.equal(pricedSessions(await catalog(db, true), productId).length, 0);
  await assert.rejects(reserveOrder(db, input()), isError("PRODUCT_UNAVAILABLE"));
  await assert.rejects(reserveOrder(db, { ...input(), scheduleId: second.id }), isError("PRODUCT_UNAVAILABLE"));
});

test("earliest available day skips sold out dates; unavailable days have no invented price; WIB boundary", async () => {
  await db.schedule.update({ where: { id: scheduleId }, data: { sold: 5 } });
  const second = await db.schedule.create({ data: { date: new Date(Date.now() + 3 * 86400000), session: "10:00", capacity: 3 } });
  const result = await catalog(db, true);
  const days = bookingDates(result, productId);
  assert.equal(days.find(item => item.status === "available")?.date, second.date.toISOString().slice(0, 10));
  assert.equal(days.find(item => item.date === result.schedules.find(item => item.id === scheduleId)!.date)?.status, "sold_out");
  assert.ok(days.filter(item => item.status === "unavailable").every(item => item.price === null));
  assert.equal(jakartaDate(new Date("2026-11-13T17:00:00Z")), "2026-11-14");
  await assert.rejects(reserveOrder(db, input()), isError("QUOTA_FULL"));
});

test("admin cannot shrink held quota or move a reserved session; price constraints and audit are persisted", async () => {
  await reserveOrder(db, input(3));
  const schedule = await db.schedule.findUniqueOrThrow({ where: { id: scheduleId } });
  const data = { action: "schedule" as const, id: scheduleId, date: schedule.date.toISOString().slice(0, 10), session: schedule.session, capacity: 2, active: true };
  await assert.rejects(saveCatalog(db, data), isError("QUOTA_INCONSISTENT"));
  await assert.rejects(saveCatalog(db, { ...data, capacity: 5, session: "14:00" }), isError("SCHEDULE_IN_USE"));
  await assert.rejects(db.productSchedule.create({ data: { productId, scheduleId, price: -1 } }));
  await saveCatalog(db, { action: "offer", productId, scheduleId, price: 90000, active: true });
  assert.equal(await db.auditLog.count({ where: { action: "CATALOG_OFFER_SAVED" } }), 1);
});

test("paid tickets are item-bound, downloadable PDFs contain QR; unpaid orders cannot download", async () => {
  const order = await reserveOrder(db, input(2));
  await assert.rejects(ticketDownloadData(db, order.orderNumber), isError("TICKET_INACTIVE"));
  await applyPaymentStatus(db, status(order));
  const data = await ticketDownloadData(db, order.orderNumber);
  assert.equal(data.tickets.length, 2);
  assert.ok(data.tickets.every(ticket => ticket.orderItemId === order.items[0].id));
  assert.equal(new Set(data.tickets.map(ticket => ticket.qrToken)).size, 2);
  const pdf = await ticketPdf(data);
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  assert.ok(pdf.includes(Buffer.from("/Subtype /Image")));
});

test("concurrent QR/manual check-in permits exactly one entry and records individual staff", async () => {
  const staff = await db.user.create({ data: { email: "staff@example.test", role: "STAFF", active: true } });
  const order = await reserveOrder(db, input()); await applyPaymentStatus(db, status(order));
  const ticket = await db.ticket.findFirstOrThrow();
  const schedule = await db.schedule.findUniqueOrThrow({ where: { id: scheduleId } });
  const visit = new Date(`${schedule.date.toISOString().slice(0, 10)}T10:00:00+07:00`);
  await assert.rejects(checkInTicket(db, staff.id, `LUP1:${ticket.code}:${"0".repeat(64)}`, visit), isError("TICKET_INVALID"));
  await assert.rejects(checkInTicket(db, staff.id, ticket.code, new Date("2000-01-01")), isError("TICKET_DATE"));
  const results = await Promise.allSettled(Array.from({ length: 6 }, (_, index) => checkInTicket(db, staff.id, index % 2 ? ticket.code : `LUP1:${ticket.code}:${ticket.qrToken}`, visit)));
  assert.equal(results.filter(result => result.status === "fulfilled").length, 1);
  assert.equal(await db.checkIn.count({ where: { ticketId: ticket.id, checkedById: staff.id } }), 1);
  assert.equal((await db.ticket.findUniqueOrThrow({ where: { id: ticket.id } })).status, "USED");
});

test("refunded tickets and inactive staff cannot check in; staff sessions revoke immediately", async () => {
  const password = "Staff-Sandi-Panjang-123";
  const staff = await db.user.create({ data: { email: "staff@example.test", passwordHash: await hashPassword(password), role: "STAFF", active: true } });
  const token = await loginStaff(db, staff.email, password);
  assert.equal((await staffSession(db, token))?.role, "STAFF");
  await assert.rejects(loginStaff(db, staff.email, "wrong"), isError("LOGIN_FAILED"));
  const order = await reserveOrder(db, input()); await applyPaymentStatus(db, status(order));
  const ticket = await db.ticket.findFirstOrThrow(); await applyPaymentStatus(db, status(order, "refund"));
  await assert.rejects(checkInTicket(db, staff.id, ticket.code), isError("TICKET_INACTIVE"));
  await db.user.update({ where: { id: staff.id }, data: { active: false } });
  assert.equal(await staffSession(db, token), null);
  await assert.rejects(checkInTicket(db, staff.id, ticket.code), isError("STAFF_REQUIRED"));
});

test("Google verified identity never links matching local email or accepts unverified email", async () => {
  await registerVisitor(db, { name: "Local", email: "local@example.test", password: "Local-Sandi-Panjang-123", consent: true });
  await assert.rejects(googleVisitor(db, { sub: "google-sub", email: "local@example.test", email_verified: true }), isError("GOOGLE_LINK_REQUIRED"));
  await assert.rejects(googleVisitor(db, { sub: "google-sub", email: "new@example.test", email_verified: false }), isError("GOOGLE_LOGIN_FAILED"));
  const user = await googleVisitor(db, { sub: "google-sub", email: "new@example.test", email_verified: true, name: "Google User" });
  const repeated = await googleVisitor(db, { sub: "google-sub", email: "changed@example.test", email_verified: true });
  assert.equal(user.id, repeated.id);
  assert.equal((await db.visitorAccount.findUniqueOrThrow({ where: { id: user.id } })).passwordHash, null);
});

test("password reset is hashed, single-use under concurrency and revokes every visitor session", async () => {
  const user = await registerVisitor(db, { name: "Reset", email: "reset@example.test", password: "Old-Sandi-Panjang-123", consent: true });
  const session = await createVisitorSession(db, user.id);
  assert.equal(await createReset(db, "unknown@example.test"), null);
  const token = await createReset(db, "reset@example.test"); assert.ok(token);
  assert.equal(await db.passwordReset.count({ where: { tokenHash: token } }), 0);
  const attempts = await Promise.allSettled([resetPassword(db, token, "New-Sandi-Panjang-123"), resetPassword(db, token, "New-Sandi-Panjang-123")]);
  assert.equal(attempts.filter(item => item.status === "fulfilled").length, 1);
  assert.equal(await visitorSession(db, session.token), null);
  assert.equal((await loginVisitor(db, { email: "reset@example.test", password: "New-Sandi-Panjang-123" })).id, user.id);
  await assert.rejects(resetPassword(db, token, "Third-Sandi-Panjang-123"), isError("RESET_INVALID"));
});

test("configured categories, program photo and policy come from DB; inactive category closes checkout", async () => {
  await saveCatalog(db, { action: "category", slug: "program-qa", name: "Program QA", description: "Kategori fixture lokal", image: "/angklung.webp", active: true, sortOrder: 1 });
  const category = await db.bookingCategory.findUniqueOrThrow({ where: { slug: "program-qa" } });
  await db.product.update({ where: { id: productId }, data: { categoryId: category.id, policy: "Ketentuan fixture", imagePath: "/angklung.webp" } });
  const result = await catalog(db, true);
  assert.equal(result.categories?.[0].slug, "program-qa");
  assert.equal(result.products[0].policy, "Ketentuan fixture");
  await saveCatalog(db, { action: "category", id: category.id, slug: category.slug, name: category.name, description: category.description, image: category.image, active: false, sortOrder: 1 });
  assert.equal((await catalog(db, true)).products.length, 0);
  await assert.rejects(reserveOrder(db, input()), isError("PRODUCT_UNAVAILABLE"));
});
