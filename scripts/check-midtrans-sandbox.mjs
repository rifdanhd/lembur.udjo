// Opt-in read/write gateway smoke test: creates ONE sandbox transaction only.
// No database connection, no app flag changes, no production endpoints.
import nextEnv from "@next/env";
import { randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";
nextEnv.loadEnvConfig(process.cwd());
const key = process.env.MIDTRANS_SERVER_KEY || "";
if (process.env.MIDTRANS_IS_PRODUCTION === "true" || !/^(?:SB-)?Mid-server-/.test(key)) throw new Error("Sandbox configuration required.");
const order = `LU-${randomBytes(12).toString("hex")}`;
const headers = { Authorization: `Basic ${Buffer.from(`${key}:`).toString("base64")}`, "Content-Type": "application/json" };
const result = { runAt: new Date().toISOString(), environment: "Midtrans Sandbox", fixture: "Synthetic IDR 10000 gateway smoke test; not an official LUP price; no database reservation", orderReference: order, creation: "NOT_RUN", statusLookup: "NOT_RUN", verifiedPayment: false, webhookVerified: false };
try {
  const response = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", { method: "POST", headers, redirect: "error", signal: AbortSignal.timeout(15000), body: JSON.stringify({ transaction_details: { order_id: order, gross_amount: 10000 }, item_details: [{ id: "qa-gateway", name: "QA akademik sandbox - bukan tiket", price: 10000, quantity: 1 }], expiry: { unit: "minutes", duration: 15 } }) });
  const body = await response.json();
  result.creation = `HTTP ${response.status}`;
  if (!response.ok || typeof body.redirect_url !== "string" || new URL(body.redirect_url).hostname !== "app.sandbox.midtrans.com") throw new Error("Sandbox initiation rejected.");
  result.creation = "PASS: Snap transaction created; sandbox checkout URL validated (token omitted)";
  const status = await fetch(`https://api.sandbox.midtrans.com/v2/${order}/status`, { headers, redirect: "error", signal: AbortSignal.timeout(15000) });
  const state = await status.json(); result.statusLookup = `HTTP ${status.status}: ${state.status_code === "404" ? "Payment method not selected (expected before Snap interaction)" : String(state.transaction_status || "no transaction status")}`;
  console.log(result.creation); console.log(result.statusLookup);
} catch (error) { result.error = error.cause?.code || error.message; console.error("Sandbox smoke test did not finish:", result.error); process.exitCode = 1; }
finally { writeFileSync("docs/booking/evidence/midtrans-sandbox-smoke.json", JSON.stringify(result, null, 2)); }
