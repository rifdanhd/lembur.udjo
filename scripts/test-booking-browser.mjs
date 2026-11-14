// Real app + disposable LOCAL PostgreSQL. No shared DB, real keys or real sales.
import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, existsSync, mkdirSync, writeFileSync, openSync, closeSync } from "node:fs";
import { tmpdir, userInfo } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";
import { chromium } from "@playwright/test";
import { hashPassword } from "../lib/ticketing/visitor-auth.ts";
import { reserveOrder, applyPaymentStatus } from "../lib/ticketing/orders.ts";

const bin = process.env.TICKETING_TEST_PG_BIN || "/usr/local/opt/postgresql@18/bin";
if (!existsSync(join(bin, "initdb"))) throw new Error("Set TICKETING_TEST_PG_BIN to a local PostgreSQL installation.");
const dir = mkdtempSync(join(tmpdir(), "lup-booking-browser-"));
const port = 56000 + Math.floor(Math.random() * 2000);
const webPort = 3200 + Math.floor(Math.random() * 400);
const url = `postgresql://${encodeURIComponent(userInfo().username)}@127.0.0.1:${port}/ticketing_browser_test?schema=ticketing`;
const env = { ...process.env, NODE_ENV: "development", DATABASE_URL: url, POSTGRES_URL: url, DATABASE_URL_UNPOOLED: url, LUP_TEST_DIST_DIR: ".next-booking-tests", TICKETING_SANDBOX_ENABLED: "true", TICKETING_SALES_APPROVED: "true", TICKETING_SECRET: "local-browser-test-secret-12345678901234567890", TICKETING_TRUST_PROXY: "false", MIDTRANS_SERVER_KEY: "SB-Mid-server-local-browser-test-only", MIDTRANS_IS_PRODUCTION: "false", GOOGLE_CLIENT_ID: "", GOOGLE_CLIENT_SECRET: "", RESEND_API_KEY: "", NEXT_PUBLIC_SHOW_COMING_SOON: "false", BOOKING_PUBLIC_URL: `http://127.0.0.1:${webPort}`, CRM_SECRET: "local-browser-crm-secret-1234567890", CRM_PASSWORD: "local-browser-crm-password" };
function run(command, args) {
  const result = spawnSync(command, args, { env, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `Failed: ${command}`);
}
let started = false, server, browser, db, browserOrder;
const evidence = "docs/booking/evidence"; mkdirSync(evidence, { recursive: true });
const results = [];
const record = (id, feature, expected, actual) => { results.push({ id, feature, expected, actual, status: "PASS" }); console.log(`PASS ${id}: ${feature}`); };
const base = `http://127.0.0.1:${webPort}`;
try {
  run(join(bin, "initdb"), ["-D", join(dir, "data"), "--auth=trust", "--no-locale", "--encoding=UTF8"]);
  run(join(bin, "pg_ctl"), ["-D", join(dir, "data"), "-l", join(dir, "postgres.log"), "-o", `-F -h 127.0.0.1 -p ${port} -k ${dir}`, "-w", "start"]); started = true;
  run(join(bin, "createdb"), ["-h", "127.0.0.1", "-p", String(port), "-U", userInfo().username, "ticketing_browser_test"]);
  run(process.execPath, ["node_modules/prisma/build/index.js", "migrate", "deploy"]);
  db = new PrismaClient({ datasourceUrl: url });
  const product = await db.product.create({ data: { name: "Program QA Lokal", slug: "qa-local", type: "ADULT", price: 70000, description: "Data fixture lokal. Bukan paket atau harga resmi LUP." } });
  const day = offset => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);
  const dates = [day(1), day(2), day(4)];
  const sessions = [];
  for (const [i, date] of dates.entries()) {
    const schedule = await db.schedule.create({ data: { date: new Date(date), session: "13:00", capacity: i === 0 ? 1 : 8, sold: i === 0 ? 1 : 0 } });
    await db.productSchedule.create({ data: { productId: product.id, scheduleId: schedule.id, price: [71000, 82000, 63000][i], active: true } }); sessions.push(schedule);
  }
  const visitor = await db.visitorAccount.create({ data: { name: "QA Pengunjung", email: "browser@example.test", passwordHash: await hashPassword("Browser-Test-Panjang-123") } });
  const log = openSync(join(dir, "next.log"), "w");
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--webpack", "--hostname", "127.0.0.1", "--port", String(webPort)], { env, stdio: ["ignore", log, log], detached: true }); closeSync(log);
  const deadline = Date.now() + 180000;
  while (true) {
    try { const response = await fetch(`${base}/api/ticketing/catalog`, { signal: AbortSignal.timeout(10000) }); if (response.ok) break; } catch {}
    if (Date.now() > deadline) throw new Error(`Next server did not become ready. See ${dir}/next.log`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  browser = await chromium.launch({ headless: true, channel: "chromium" });
  for (const [width, height, name] of [[1440, 1000, "desktop"], [768, 1024, "tablet"], [390, 844, "mobile"]]) {
    const context = await browser.newContext({ viewport: { width, height }, isMobile: name === "mobile", hasTouch: name === "mobile" });
    const page = await context.newPage(); page.setDefaultNavigationTimeout(120000); page.setDefaultTimeout(60000);
    await page.goto(`${base}/pilih-tiket?kategori=kunjungan&produk=${product.id}`);
    const selected = page.locator(`[data-date="${dates[1]}"]`);
    await selected.waitFor(); await page.getByText("Memuat harga dan ketersediaan…", { exact: true }).waitFor({ state: "hidden" }); await page.waitForFunction(date => document.querySelector(`[data-date="${date}"]`)?.getAttribute("aria-pressed") === "true", dates[1]);
    assert.equal(await page.locator(`[data-date="${dates[0]}"]`).isDisabled(), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    record(`UI-${name}-1`, `Earliest available date and responsive width (${width}px)`, "Sold-out disabled; earliest available selected; no page overflow", `${dates[1]} selected, ${dates[0]} disabled`);
    const strip = page.getByRole("group", { name: "Tanggal kunjungan, gunakan tombol panah untuk berpindah" });
    const beforeScroll = await strip.evaluate(element => element.scrollLeft);
    await page.getByRole("button", { name: "Tanggal berikutnya", exact: true }).click();
    await page.waitForFunction(before => document.querySelector('[role="group"][aria-label^="Tanggal kunjungan"]')?.scrollLeft > before + 5, beforeScroll);
    const afterScroll = await strip.evaluate(element => element.scrollLeft);
    await page.getByRole("button", { name: "Tanggal sebelumnya", exact: true }).click();
    await page.waitForFunction(after => document.querySelector('[role="group"][aria-label^="Tanggal kunjungan"]')?.scrollLeft < after - 5, afterScroll);
    const unavailable = page.locator(`[data-date="${day(3)}"]`); assert.equal(await unavailable.isDisabled(), true); assert.ok(!(await unavailable.innerText()).includes("Rp"));
    record(`UI-${name}-6`, "Horizontal arrows scroll and unavailable dates have no fictional price", "Both arrows move the strip; unavailable disabled without IDR price", "Scroll verified both directions; unavailable date disabled");
    await selected.focus(); await page.keyboard.press("ArrowRight"); await page.keyboard.press("Enter");
    await page.waitForFunction(date => document.querySelector(`[data-date="${date}"]`)?.getAttribute("aria-pressed") === "true", dates[2]);
    await page.getByText("Memuat harga dan ketersediaan…", { exact: true }).waitFor({ state: "hidden" });
    assert.ok((await page.locator("aside").last().innerText()).includes("63.000"));
    record(`UI-${name}-2`, "Keyboard changes date, session and price", "Next available date and IDR 63,000", `${dates[2]}, 13:00 WIB, Rp63.000`);
    await page.getByRole("button", { name: "Buka kalender", exact: true }).click();
    await page.getByLabel("Cari tanggal melalui kalender").fill(dates[0]);
    await page.getByText("Tanggal ini belum tersedia. Pilih tanggal lain.").waitFor();
    assert.equal(await page.locator(`[data-date="${dates[2]}"]`).getAttribute("aria-pressed"), "true");
    record(`UI-${name}-3`, "Calendar rejects sold-out day", "Selection unchanged and error announced", "Selection unchanged; live message shown");
    await page.getByLabel("Jumlah pengunjung").fill("2");
    await page.getByRole("button", { name: "Tambahkan ke keranjang" }).click();
    const cart = await page.evaluate(() => JSON.parse(localStorage.getItem("lup-ticket-cart-v1")));
    assert.equal(cart[0].date, dates[2]); assert.equal(cart[0].scheduleId, sessions[2].id); assert.equal(cart[0].quantity, 2);
    record(`UI-${name}-4`, "Selected date/session survives cart", "Selected schedule and quantity persisted", "Correct date, scheduleId and quantity stored");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth && window.scrollX === 0), true, "No page overflow after keyboard, calendar and cart interactions");
    await page.screenshot({ path: `${evidence}/date-selector-${name}.png`, fullPage: true });
    // Login and test the real checkout UI total without contacting Midtrans.
    const login = await context.request.post(`${base}/api/ticketing/auth/login`, { headers: { Origin: base }, data: { email: visitor.email, password: "Browser-Test-Panjang-123" } }); assert.equal(login.status(), 200);
    await page.goto(`${base}/checkout`); await page.getByText(/126\.000/).waitFor();
    record(`UI-${name}-5`, "Checkout reads current backend session price", "2 × 63,000 = 126,000", "Rp126.000 rendered from configured session");
    if (name === "desktop") {
      await page.getByLabel("Nomor WhatsApp").fill("081234567890");
      await page.getByRole("checkbox").check();
      await page.getByRole("button", { name: "Buat pesanan & lanjut pembayaran" }).click();
      await page.waitForURL(/\/pesanan\/LU-[a-f0-9]{24}$/, { timeout: 60000 });
      const number = new URL(page.url()).pathname.split("/").at(-1);
      browserOrder = await db.order.findUniqueOrThrow({ where: { orderNumber: number } });
      assert.equal(browserOrder.totalAmount, 126000); assert.equal(browserOrder.visitorId, visitor.id); assert.equal(browserOrder.status, "PENDING");
      record("CHECKOUT-HTTP", "Browser submits checkout through real reservation API", "Owned PENDING order stored with total 126000 and selected schedule", "Order stored, total 126000, correct visitor; fake gateway key intentionally cannot pay");
    }
    await context.close();
  }
  const context = await browser.newContext(); const page = await context.newPage(); page.setDefaultNavigationTimeout(120000); page.setDefaultTimeout(60000);
  await page.goto(`${base}/masuk`); await page.locator("header").getByRole("button", { name: "Masuk", exact: true }).filter({ visible: true }).click();
  const dialog = page.getByRole("dialog"); await dialog.waitFor(); await page.keyboard.press("Escape"); assert.equal(await dialog.isVisible(), false);
  record("AUTH-MODAL", "Login dialog keyboard close", "Escape closes dialog", "Dialog closed");
  await page.goto(`${base}/checkout`); await page.getByText("Masuk untuk melanjutkan", { exact: true }).waitFor();
  const guest = await context.request.post(`${base}/api/ticketing/orders`, { headers: { Origin: base }, data: { requestKey: crypto.randomUUID(), scheduleId: sessions[2].id, items: [{ productId: product.id, quantity: 1 }], customer: { name: "Tamu QA", email: "guest@example.test", whatsapp: "081234567890" }, consent: true } }); assert.equal(guest.status(), 401);
  record("GUEST-ACCOUNT-POLICY", "Guest can plan but checkout requires an account", "Login prompt and API 401; no guest order", "Login prompt rendered; API 401");
  const login = await context.request.post(`${base}/api/ticketing/auth/login`, { headers: { Origin: base }, data: { email: visitor.email, password: "Browser-Test-Panjang-123" } }); assert.equal(login.status(), 200);
  // Simulated provider status in test harness only; no payment bypass endpoint exists.
  const order = browserOrder || await reserveOrder(db, { requestKey: crypto.randomUUID(), scheduleId: sessions[2].id, items: [{ productId: product.id, quantity: 1 }], customer: { name: visitor.name, email: visitor.email, whatsapp: "081234567890" }, consent: true }, new Date(), visitor.id);
  await applyPaymentStatus(db, { order_id: order.orderNumber, transaction_id: "browser-simulated-provider", gross_amount: `${order.totalAmount}.00`, status_code: "200", transaction_status: "settlement", fraud_status: "accept", currency: "IDR" });
  await page.goto(`${base}/account/bookings`); await page.getByText(order.orderNumber, { exact: true }).waitFor();
  record("ACCOUNT-HISTORY", "Owner views booking history", "Owned booking reference listed", "Owned booking listed");
  await page.goto(`${base}/account/bookings/${order.orderNumber}`); await page.getByText("Pembayaran terkonfirmasi", { exact: true }).waitFor();
  const pdf = await context.request.get(`${base}/api/ticketing/orders/${order.orderNumber}/tickets`); assert.equal(pdf.status(), 200); assert.equal((await pdf.body()).subarray(0, 5).toString(), "%PDF-");
  writeFileSync(`${evidence}/ticket-fixture-sandbox.pdf`, await pdf.body());
  record("TICKET-PDF", "Owned paid booking PDF route", "Authenticated owner receives PDF", "200 application/pdf, valid PDF header; provider simulated in harness");
  const stranger = await browser.newContext(); const registeredStranger = await stranger.request.post(`${base}/api/ticketing/auth/register`, { headers: { Origin: base }, data: { name: "Akun QA Lain", email: "stranger-browser@example.test", password: "Stranger-Browser-Panjang-123", consent: true } }); assert.equal(registeredStranger.status(), 201); const forbidden = await stranger.request.get(`${base}/api/ticketing/orders/${order.orderNumber}/tickets`); assert.equal(forbidden.status(), 404); await stranger.close();
  record("TICKET-OWNER", "Another browser cannot download ticket", "404", "404");
  // Failure and empty catalog states, using browser transport fixtures only.
  await page.route("**/api/ticketing/catalog", route => route.fulfill({ status: 503, contentType: "application/json", body: '{"error":"QA transport failure"}' }));
  await page.goto(`${base}/pilih-tiket?kategori=kunjungan&produk=${product.id}`); await page.getByText("Harga dan jadwal belum dapat dimuat. Silakan coba lagi.").waitFor();
  assert.equal(await page.getByRole("button", { name: "Tambahkan ke keranjang" }).isDisabled(), true);
  record("DATE-ERROR", "Catalog network error disables booking", "Error with retry, booking disabled", "Error shown; booking disabled");
  await page.unroute("**/api/ticketing/catalog");
  await page.route("**/api/ticketing/catalog", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ state: "not_open", sandbox: true, checkoutEnabled: true, products: [{ id: product.id, name: product.name, price: product.price, type: "ADULT", description: "Fixture lokal" }], schedules: [] }) }));
  await page.goto(`${base}/pilih-tiket?kategori=kunjungan&produk=${product.id}`);
  await page.getByText("Belum ada tanggal yang dapat dipesan untuk program ini.").waitFor();
  assert.equal(await page.getByRole("button", { name: "Tambahkan ke keranjang" }).isDisabled(), true);
  record("DATE-EMPTY", "Empty backend schedules", "Empty message, booking disabled", "Empty message shown; no fictional prices");
  const staff = await db.user.create({ data: { name: "QA Staff", email: "staff-browser@example.test", role: "STAFF", passwordHash: await hashPassword("Staff-Browser-Panjang-123") } });
  const staffContext = await browser.newContext();
  const staffLogin = await staffContext.request.post(`${base}/api/staff/session`, { headers: { Origin: base }, data: { email: staff.email, password: "Staff-Browser-Panjang-123" } }); assert.equal(staffLogin.status(), 200);
  assert.equal((await staffContext.request.get(`${base}/api/staff/catalog`)).status(), 401);
  assert.equal((await staffContext.request.get(`${base}/api/staff/orders`)).status(), 401);
  record("STAFF-RBAC", "Check-in STAFF cannot read admin catalog or orders", "401 for both admin APIs", "401 / 401");
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());
  const current = await db.schedule.create({ data: { date: new Date(today), session: "23:59", capacity: 3 } });
  await db.productSchedule.create({ data: { productId: product.id, scheduleId: current.id, price: 63000 } });
  const checkOrder = await reserveOrder(db, { requestKey: crypto.randomUUID(), scheduleId: current.id, items: [{ productId: product.id, quantity: 1 }], customer: { name: visitor.name, email: visitor.email, whatsapp: "081234567890" }, consent: true }, new Date(), visitor.id);
  await applyPaymentStatus(db, { order_id: checkOrder.orderNumber, transaction_id: "checkin-browser-simulated", gross_amount: "63000.00", status_code: "200", transaction_status: "settlement", currency: "IDR" });
  const checkTicket = await db.ticket.findFirstOrThrow({ where: { orderId: checkOrder.id } });
  const check = data => staffContext.request.post(`${base}/api/staff/check-in`, { headers: { Origin: base }, data });
  assert.equal((await check({ code: `LUP1:${checkTicket.code}:${checkTicket.qrToken}` })).status(), 200);
  assert.equal((await check({ code: checkTicket.code })).status(), 409);
  record("STAFF-CHECKIN", "Authenticated QR endpoint and duplicate manual entry", "200 then 409", "200 first QR check-in; 409 duplicate code; no physical camera claim");
  const admin = await db.user.create({ data: { name: "QA Admin", email: "admin-browser@example.test", role: "ADMIN", passwordHash: await hashPassword("Admin-Browser-Panjang-123") } });
  const adminContext = await browser.newContext();
  assert.equal((await adminContext.request.post(`${base}/api/staff/session`, { headers: { Origin: base }, data: { email: admin.email, password: "Admin-Browser-Panjang-123" } })).status(), 200);
  assert.equal((await adminContext.request.get(`${base}/api/staff/catalog`)).status(), 200);
  assert.equal((await adminContext.request.get(`${base}/api/staff/orders`)).status(), 200);
  record("ADMIN-RBAC", "Individual ADMIN reads catalog and booking monitor", "200 for both APIs", "200 / 200");
  assert.equal((await staffContext.request.get(`${base}/api/staff/check-ins`)).status(), 401);
  const history = await adminContext.request.get(`${base}/api/staff/check-ins?orderNumber=${checkOrder.orderNumber}`);
  assert.equal(history.status(), 200); assert.equal((await history.json()).checkIns.length, 1);
  const historyPage = await adminContext.newPage(); historyPage.setDefaultNavigationTimeout(120000);
  await historyPage.goto(`${base}/admin/tiket/check-in`); await historyPage.getByText(checkTicket.code, { exact: true }).waitFor();
  await historyPage.screenshot({ path: `${evidence}/check-in-history-admin.png`, fullPage: true });
  record("ADMIN-CHECKIN-HISTORY", "Admin sees check-in history while STAFF is denied", "Admin sees one event, staff API 401, no QR secret", "Admin history rendered; one event; STAFF 401");
  const dispatch = await context.request.post(`${base}/api/ticketing/emails/dispatch`, { headers: { Origin: base } }); assert.equal(dispatch.status(), 401);
  record("EMAIL-WORKER-AUTH", "Public visitor cannot run email worker", "401", "401");

  const registration = await context.request.post(`${base}/api/ticketing/auth/register`, { headers: { Origin: base }, data: { name: "QA Registrasi", email: "register-browser@example.test", password: "Register-Browser-Panjang-123", consent: true } }); assert.equal(registration.status(), 201);
  assert.equal((await context.request.post(`${base}/api/ticketing/auth/logout`, { headers: { Origin: base } })).status(), 200);
  assert.equal((await (await context.request.get(`${base}/api/ticketing/auth/session`)).json()).visitor, null);
  record("AUTH-REGISTER-LOGOUT", "Email registration and secure logout", "201 register, 200 logout, session null", "201 / 200 / null");
  await adminContext.close(); await staffContext.close();
  await context.close();
} catch (error) {
  results.push({ id: "RUN", status: "FAIL", actual: error.message }); console.error(error); process.exitCode = 1;
} finally {
  writeFileSync(`${evidence}/browser-results.json`, JSON.stringify({ runAt: new Date().toISOString(), database: "disposable local PostgreSQL", payment: "provider simulated in harness; no real Midtrans transaction", results }, null, 2));
  await browser?.close(); await db?.$disconnect();
  if (server?.pid) { try { process.kill(-server.pid, "SIGTERM"); } catch {} }
  if (started) run(join(bin, "pg_ctl"), ["-D", join(dir, "data"), "-m", "fast", "-w", "stop"]);
  console.log(`Temporary server/database logs: ${dir}`);
}
