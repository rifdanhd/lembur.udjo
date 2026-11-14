import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID, createHash } from "node:crypto";
import { checkoutSchema, providerStatusSchema } from "../lib/ticketing/validation";
import { BookingError, boundedJson, equalSecret, orderAccess, requireSameOrigin, verifyNotification } from "../lib/ticketing/security";
import { validCheckoutUrl, midtransProvider, sandboxNotificationOverride } from "../lib/ticketing/midtrans";
import type { CheckoutProvider } from "../lib/ticketing/orders";
import { sandboxConfig } from "../lib/ticketing/config";
import { cartSchema, safeContinue } from "../lib/ticketing/portal-data";

const valid = () => ({ requestKey: randomUUID(), scheduleId: "schedule", items: [{ productId: "adult", quantity: 2 }], customer: { name: "Pengunjung Uji", email: "uji@example.test", whatsapp: "081234567890" }, consent: true });

test("checkout rejects client pricing, fractional/negative quantities, duplicate lines, missing consent and totals above 20", () => {
  assert.ok(checkoutSchema.safeParse(valid()).success);
  for (const quantity of [-1, 0, 1.5, 21]) assert.equal(checkoutSchema.safeParse({ ...valid(), items: [{ productId: "adult", quantity }] }).success, false);
  assert.equal(checkoutSchema.safeParse({ ...valid(), totalAmount: 1 }).success, false);
  assert.equal(checkoutSchema.safeParse({ ...valid(), items: [{ productId: "adult", quantity: 1, price: 1 }] }).success, false);
  assert.equal(checkoutSchema.safeParse({ ...valid(), items: [{ productId: "adult", quantity: 1 }, { productId: "adult", quantity: 1 }] }).success, false);
  assert.equal(checkoutSchema.safeParse({ ...valid(), items: [{ productId: "adult", quantity: 15 }, { productId: "child", quantity: 10 }] }).success, false);
  assert.equal(checkoutSchema.safeParse({ ...valid(), consent: false }).success, false);
});

test("same-origin checks reject missing, opaque and sibling origins even behind TLS termination", () => {
  const request = (origin?: string) => new Request("http://127.0.0.1/api/ticketing/orders", { method: "POST", headers: { host: "ticket.lemburudjoparahyangan.com", ...(origin ? { origin } : {}) } });
  assert.doesNotThrow(() => requireSameOrigin(request("https://ticket.lemburudjoparahyangan.com")));
  for (const origin of [undefined, "null", "https://app.lemburudjoparahyangan.com", "https://evil.test"]) assert.throws(() => requireSameOrigin(request(origin)), BookingError);
});

test("request body limit works without Content-Length and rejects invalid JSON", async () => {
  const request = (body: string) => new Request("http://localhost", { method: "POST", headers: { "content-type": "application/json" }, body });
  await assert.rejects(boundedJson(request(JSON.stringify({ value: "x".repeat(30) })), 20), (error: unknown) => error instanceof BookingError && error.status === 413);
  await assert.rejects(boundedJson(request("{")), BookingError);
  assert.deepEqual(await boundedJson(request('{"ok":true}')), { ok: true });
});

test("order capabilities are scope-bound and signature verification rejects tampering", () => {
  const secret = "test-secret";
  assert.notEqual(orderAccess("one", secret), orderAccess("two", secret));
  assert.equal(equalSecret("garbage", orderAccess("one", secret)), false);
  const body = { order_id: "LU-012345678901234567890123", status_code: "200", gross_amount: "150000.00", signature_key: "" };
  body.signature_key = createHash("sha512").update(body.order_id + body.status_code + body.gross_amount + secret).digest("hex");
  assert.doesNotThrow(() => verifyNotification(body, secret));
  assert.throws(() => verifyNotification({ ...body, gross_amount: "1.00" }, secret), BookingError);
});

test("checkout redirects allow only the sandbox hosted payment domain", () => {
  assert.ok(validCheckoutUrl("https://app.sandbox.midtrans.com/snap/v4/redirection/test"));
  for (const url of ["https://evil.test/snap/test", "https://app.midtrans.com/snap/test", "https://app.sandbox.midtrans.com.evil.test/snap/test", "javascript:alert(1)", "https://user@app.sandbox.midtrans.com/snap/test", "http://app.sandbox.midtrans.com/snap/test"]) assert.equal(validCheckoutUrl(url), false);
});

test("production keys and missing settings cannot enable sandbox sales", () => {
  const previous = { ...process.env };
  try {
    process.env.TICKETING_SANDBOX_ENABLED = "true";
    process.env.TICKETING_SALES_APPROVED = "true";
    process.env.TICKETING_SECRET = "x".repeat(32);
    process.env.MIDTRANS_SERVER_KEY = "SB-Mid-server-test-key-for-tests";
    process.env.MIDTRANS_IS_PRODUCTION = "false";
    assert.ok(sandboxConfig());
    process.env.TICKETING_SALES_APPROVED = "false";
    assert.equal(sandboxConfig(), null);
    process.env.TICKETING_SALES_APPROVED = "true";
    process.env.MIDTRANS_IS_PRODUCTION = "true";
    assert.equal(sandboxConfig(), null);
    process.env.MIDTRANS_IS_PRODUCTION = "false";
    // Built from parts so push protection does not mistake this fake for a real key.
    process.env.MIDTRANS_SERVER_KEY = ["Mid", "server", "Ab3dEf6hIj9kLm2nOp5qRs8t"].join("-");
    assert.ok(sandboxConfig()); // newer sandbox keys carry no SB- prefix
    process.env.MIDTRANS_SERVER_KEY = "Mid-server-production-key";
    assert.equal(sandboxConfig(), null);
  } finally { process.env = previous; }
  assert.equal(providerStatusSchema.safeParse({ order_id: "unknown" }).success, false);
});

test("cart planning rejects impossible dates and oversized or duplicate selections; account redirect stays internal", () => {
  const line = { id: "test", category: "kunjungan", date: "2026-12-01", session: "pagi", quantity: 2, example: true };
  assert.ok(cartSchema.safeParse([line]).success);
  assert.equal(cartSchema.safeParse([{ ...line, date: "2026-02-30" }]).success, false);
  assert.equal(cartSchema.safeParse([{ ...line, quantity: 21 }]).success, false);
  assert.equal(cartSchema.safeParse([line,line]).success, false);
  for (const next of ["https://evil.test", "//evil.test", "/admin", "/checkout?to=//evil.test"]) assert.equal(safeContinue(next), "/akun");
  assert.equal(safeContinue("/checkout"), "/checkout");
});

test("sandbox request returns to the account order page and shares the server reservation deadline", async () => {
  const previous = { ...process.env }; const originalFetch = globalThis.fetch;
  try {
    Object.assign(process.env, { TICKETING_SALES_APPROVED: "true", TICKETING_SANDBOX_ENABLED: "true", TICKETING_SECRET: "x".repeat(32), MIDTRANS_SERVER_KEY: "SB-Mid-server-key-for-unit-tests", MIDTRANS_IS_PRODUCTION: "false" });
    let payload: Record<string, unknown> = {};
    globalThis.fetch = async (url, init) => {
      assert.equal(url, "https://app.sandbox.midtrans.com/snap/v1/transactions");
      payload = JSON.parse(String(init?.body));
      return Response.json({ redirect_url: "https://app.sandbox.midtrans.com/snap/v4/redirection/test" });
    };
    const order = { orderNumber: "LU-012345678901234567890123", totalAmount: 75000, expiresAt: new Date("2026-12-01T03:15:00Z"), items: [{ productId: "adult", productName: "Tiket Uji", unitPrice: 75000, quantity: 1 }] } as unknown as Parameters<CheckoutProvider["create"]>[0];
    await midtransProvider().create(order, { name: "Pengunjung Uji", email: "uji@example.invalid", whatsapp: "081234567890" });
    assert.deepEqual(payload.callbacks, { finish: "https://ticket.lemburudjoparahyangan.com/pesanan/LU-012345678901234567890123" });
    assert.deepEqual(payload.expiry, { start_time: "2026-12-01 03:00:00 +0000", unit: "minutes", duration: 15 });
  } finally { process.env = previous; globalThis.fetch = originalFetch; }
});

test("notification override is HTTPS-only and refuses shared DBs or a missing isolated-test flag", () => {
  const keys = ["DATABASE_URL", "POSTGRES_URL", "DATABASE_URL_UNPOOLED", "TICKETING_SANDBOX_NOTIFICATION_URL", "TICKETING_ISOLATED_SANDBOX_TEST"];
  const saved = new Map(keys.map(key => [key, process.env[key]]));
  try {
    for (const key of keys.slice(0, 3)) process.env[key] = "postgresql://fixture@127.0.0.1:5432/ticketing_midtrans_e2e";
    process.env.TICKETING_SANDBOX_NOTIFICATION_URL = "https://fixture.ngrok-free.dev/random/api/ticketing/webhook";
    delete process.env.TICKETING_ISOLATED_SANDBOX_TEST;
    assert.throws(() => sandboxNotificationOverride());
    process.env.TICKETING_ISOLATED_SANDBOX_TEST = "true";
    assert.equal(sandboxNotificationOverride(), process.env.TICKETING_SANDBOX_NOTIFICATION_URL);
    process.env.POSTGRES_URL = "postgresql://fixture@database.example.test/shared";
    assert.throws(() => sandboxNotificationOverride());
    process.env.POSTGRES_URL = process.env.DATABASE_URL;
    process.env.TICKETING_SANDBOX_NOTIFICATION_URL = "http://fixture.ngrok-free.dev/random/api/ticketing/webhook";
    assert.throws(() => sandboxNotificationOverride());
  } finally {
    for (const [key, value] of saved) { if (value === undefined) delete process.env[key]; else process.env[key] = value; }
  }
});
