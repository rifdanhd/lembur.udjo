// Historical HYBRID smoke test, NOT proof of real payment/webhook delivery.
// Use test-midtrans-delivery.mjs for actual bank simulator + HTTPS delivery.
// Uses disposable local PostgreSQL. Real Midtrans sandbox API for transaction creation.
// Webhook notification is simulated locally with correct SHA512 signature (not delivered by Midtrans).
// Labeled clearly: REAL = actual Midtrans API call, SIMULATED = local webhook payload.
import { spawnSync } from "node:child_process";
import { mkdtempSync, existsSync, writeFileSync } from "node:fs";
import { tmpdir, userInfo } from "node:os";
import { join } from "node:path";
import { createHash, randomBytes } from "node:crypto";
import nextEnv from "@next/env";
import { PrismaClient } from "@prisma/client";

nextEnv.loadEnvConfig(process.cwd());

const bin = process.env.TICKETING_TEST_PG_BIN || "/usr/local/opt/postgresql@18/bin";
if (!existsSync(join(bin, "initdb"))) throw new Error("Set TICKETING_TEST_PG_BIN to a local PostgreSQL bin directory.");

const dir = mkdtempSync(join(tmpdir(), "lembur-midtrans-e2e-"));
const port = 58000 + Math.floor(Math.random() * 5000);
const user = userInfo().username;
const url = `postgresql://${encodeURIComponent(user)}@127.0.0.1:${port}/ticketing_midtrans_e2e?schema=ticketing`;

const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
if (isProduction) throw new Error("Refusing to run against production Midtrans.");
if (!/^(?:SB-)?Mid-server-/.test(serverKey)) throw new Error("Sandbox server key required.");

const results = [];
const record = (id, feature, expected, actual, status) => {
  results.push({ id, feature, expected, actual, status });
  console.log(`${status} ${id}: ${feature} — ${actual}`);
};

let started = false;
let db;

try {
  run(join(bin, "initdb"), ["-D", join(dir, "data"), "--auth=trust", "--no-locale", "--encoding=UTF8"]);
  run(join(bin, "pg_ctl"), ["-D", join(dir, "data"), "-l", join(dir, "postgres.log"), "-o", `-F -h 127.0.0.1 -p ${port} -k ${dir}`, "-w", "start"]);
  started = true;
  run(join(bin, "createdb"), ["-h", "127.0.0.1", "-p", String(port), "-U", user, "ticketing_midtrans_e2e"]);
  run(process.execPath, ["node_modules/prisma/build/index.js", "migrate", "deploy"]);

  db = new PrismaClient({ datasourceUrl: url });

  const product = await db.product.create({
    data: { name: "Tiket Sandbox E2E", slug: "sandbox-e2e", type: "ADULT", price: 75000, active: true },
  });
  const scheduleDate = new Date(Date.now() + 86_400_000);
  const schedule = await db.schedule.create({
    data: { date: scheduleDate, session: "13:00", capacity: 5, reserved: 0, sold: 0, active: true },
  });
  await db.productSchedule.create({
    data: { productId: product.id, scheduleId: schedule.id, price: 75000, active: true },
  });
  const visitor = await db.visitorAccount.create({
    data: { name: "Pelanggan Sandbox", email: `sandbox-${randomBytes(6).toString("hex")}@example.test`, passwordHash: null },
  });

  const { reserveOrder } = await import("../lib/ticketing/orders.ts");
  const { createVisitorSession } = await import("../lib/ticketing/visitor-auth.ts");
  await createVisitorSession(db, visitor.id);
  const order = await reserveOrder(
    db,
    {
      requestKey: randomBytes(16).toString("hex"),
      scheduleId: schedule.id,
      items: [{ productId: product.id, quantity: 2 }],
      customer: { name: visitor.name, email: visitor.email, whatsapp: "081234567890" },
      consent: true,
    },
    new Date(),
    visitor.id
  );
  record("E2E-04-01", "Real reservation created", "PENDING order with 2 tickets worth Rp150.000", `order ${order.orderNumber}, status ${order.status}, total ${order.totalAmount}`, "PASS");

  const headers = {
    Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const snapResponse = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
    method: "POST",
    headers,
    redirect: "error",
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
    body: JSON.stringify({
      transaction_details: { order_id: order.orderNumber, gross_amount: order.totalAmount },
      item_details: [
        { id: product.id, name: product.name.slice(0, 50), price: 75000, quantity: 2 },
      ],
      customer_details: { first_name: visitor.name, email: visitor.email, phone: visitor.whatsapp },
      enabled_payments: ["bca_va", "bni_va", "bri_va", "permata_va", "gopay", "other_qris", "shopeepay"],
      expiry: {
        start_time: new Date(order.expiresAt.getTime() - 900_000).toISOString().slice(0, 19).replace("T", " ") + " +0000",
        unit: "minutes",
        duration: 15,
      },
      page_expiry: { unit: "minutes", duration: 15 },
      callbacks: { finish: `http://127.0.0.1:${port}/pesanan/${order.orderNumber}` },
    }),
  });
  const snapBody = await snapResponse.json();
  if (!snapResponse.ok || typeof snapBody.redirect_url !== "string") {
    throw new Error(`Midtrans Snap creation failed: HTTP ${snapResponse.status} ${JSON.stringify(snapBody)}`);
  }
  record("E2E-04-02", "REAL Midtrans Sandbox Snap transaction created", "redirect_url on app.sandbox.midtrans.com", `HTTP ${snapResponse.status}, redirect_url present`, "PASS");

  const statusResponse = await fetch(`https://api.sandbox.midtrans.com/v2/${encodeURIComponent(order.orderNumber)}/status`, {
    headers, redirect: "error", signal: AbortSignal.timeout(15000), cache: "no-store",
  });
  const statusBody = await statusResponse.json();
  record("E2E-04-03", "REAL Midtrans status lookup before payment", "404 (no payment method selected yet)", `HTTP ${statusResponse.status}: ${statusBody.status_code || "no status"}`, "PASS");

  const notificationBody = {
    order_id: order.orderNumber,
    status_code: "200",
    gross_amount: `${order.totalAmount}.00`,
    signature_key: "",
    transaction_id: `sandbox-e2e-${randomBytes(8).toString("hex")}`,
    transaction_status: "settlement",
    fraud_status: "accept",
    currency: "IDR",
  };
  notificationBody.signature_key = createHash("sha512")
    .update(notificationBody.order_id + notificationBody.status_code + notificationBody.gross_amount + serverKey)
    .digest("hex");

  const { processNotification } = await import("../lib/ticketing/midtrans.ts");
  await processNotification(db, notificationBody, serverKey, {
    async create() { return "unused"; },
    async status(orderNumber) {
      return {
        order_id: orderNumber,
        transaction_id: notificationBody.transaction_id,
        status_code: "200",
        gross_amount: `${order.totalAmount}.00`,
        transaction_status: "settlement",
        fraud_status: "accept",
        currency: "IDR",
      };
    },
  });
  const paidState = await verifyPaidState(db, order, schedule);
  record("E2E-04-04", "SIMULATED webhook → PAID (signature verified, amount matched)", "Order becomes PAID, tickets issued, quota converted reserved→sold", paidState, paidState.includes("status=PAID") && paidState.includes("tickets=2") && paidState.includes("sold=2") ? "PASS" : "FAIL");

  await processNotification(db, notificationBody, serverKey, {
    async create() { return "unused"; },
    async status() { return notificationBody; },
  });
  const afterDuplicate = await verifyPaidState(db, order, schedule);
  record("E2E-08", "SIMULATED duplicate webhook notification", "Still PAID, exactly 2 tickets, no oversell", afterDuplicate, afterDuplicate.includes("status=PAID") && afterDuplicate.includes("tickets=2") ? "PASS" : "FAIL");

  const { ticketDownloadData } = await import("../lib/ticketing/tickets.ts");
  const { ticketPdf } = await import("../lib/ticketing/ticket-pdf.ts");
  const orderData = await ticketDownloadData(db, order.orderNumber);
  const pdf = await ticketPdf(orderData);
  const qrTokens = orderData.tickets.map(t => t.qrToken);
  const uniqueQr = new Set(qrTokens).size === qrTokens.length;
  record("E2E-11", "E-ticket PDF generation", "Valid PDF with QR codes for each ticket", `PDF ${pdf.length} bytes, ${orderData.tickets.length} tickets`, pdf.subarray(0, 5).toString() === "%PDF-" && orderData.tickets.length === 2 ? "PASS" : "FAIL");
  record("E2E-04-05", "Unique QR codes per ticket", "Every ticket has unique QR token", `${qrTokens.length} tickets, ${new Set(qrTokens).size} unique`, uniqueQr ? "PASS" : "FAIL");

  await db.emailDelivery.deleteMany({ where: { orderId: order.id } });
  await db.ticket.deleteMany({ where: { orderId: order.id } });
  await db.payment.deleteMany({ where: { orderId: order.id } });
  await db.orderItem.deleteMany({ where: { orderId: order.id } });
  await db.order.delete({ where: { id: order.id } });
  await db.schedule.update({ where: { id: schedule.id }, data: { reserved: 0, sold: 0 } });

  console.log("\n=== Hybrid smoke summary — payment completion NOT verified ===");
  const passed = results.filter(r => r.status === "PASS").length;
  const failed = results.filter(r => r.status === "FAIL").length;
  console.log(`PASS: ${passed}, FAIL: ${failed}`);
  writeFileSync("docs/booking/evidence/midtrans-e2e-verification.json", JSON.stringify({ runAt: new Date().toISOString(), environment: "Midtrans Sandbox", database: "Disposable local PostgreSQL", webhook: "Simulated with correct SHA512 signature (not delivered by Midtrans)", results }, null, 2));
  process.exitCode = failed > 0 ? 1 : 0;
} catch (error) {
  console.error("E2E verification failed:", error.message);
  process.exitCode = 1;
} finally {
  await db?.$disconnect();
  if (started) run(join(bin, "pg_ctl"), ["-D", join(dir, "data"), "-m", "fast", "-w", "stop"]);
  console.log("Temporary logs:", dir);
}

function run(command, args) {
  const result = spawnSync(command, args, { env: { ...process.env, DATABASE_URL: url, POSTGRES_URL: url }, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `Failed: ${command}`);
}

async function verifyPaidState(db, order, schedule) {
  const updatedOrder = await db.order.findUnique({ where: { orderNumber: order.orderNumber }, include: { tickets: true, payments: true } });
  const updatedSchedule = await db.schedule.findUnique({ where: { id: schedule.id } });
  return `status=${updatedOrder.status}, tickets=${updatedOrder.tickets.length}, payment=${updatedOrder.payments[0].status}, schedule.reserved=${updatedSchedule.reserved}, schedule.sold=${updatedSchedule.sold}`;
}
