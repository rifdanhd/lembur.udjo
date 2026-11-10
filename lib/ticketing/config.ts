import { BookingError } from "./security";

// Older Midtrans accounts issue sandbox keys as "SB-Mid-server-…"; newer ones
// drop the prefix and hand out "Mid-server-…". Both only authenticate against
// the sandbox API, which is the only endpoint this integration calls. Keys from
// the newer format carry no prefix marker, so the random-looking shape is what
// separates them from hand-written values such as "Mid-server-production-key".
function isSandboxServerKey(key: string) {
  if (key.startsWith("SB-Mid-server-")) return key.length >= 24 && !key.includes("...");
  return /^Mid-server-[A-Za-z0-9]{20,}$/.test(key) && /[A-Z]/.test(key) && /\d/.test(key);
}

export function sandboxConfig() {
  const key = process.env.MIDTRANS_SERVER_KEY || "";
  const secret = process.env.TICKETING_SECRET || "";
  if (process.env.TICKETING_SALES_APPROVED !== "true" || process.env.TICKETING_SANDBOX_ENABLED !== "true" || process.env.MIDTRANS_IS_PRODUCTION === "true"
    || !isSandboxServerKey(key) || secret.length < 32) {
    return null;
  }
  return { key, secret };
}

export function requireSandbox() {
  const config = sandboxConfig();
  if (!config) throw new BookingError("CHECKOUT_CLOSED", 503);
  return config;
}
