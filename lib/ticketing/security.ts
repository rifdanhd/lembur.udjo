import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { siteForHost } from "../site-domains";

export class BookingError extends Error {
  constructor(public code: string, public status = 400) { super(code); }
}

export function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function equalSecret(actual: string, expected: string) {
  if (!/^[a-fA-F0-9]+$/.test(actual) || actual.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(actual.toLowerCase(), "utf8"), Buffer.from(expected.toLowerCase(), "utf8"));
}

export function orderAccess(orderNumber: string, secret: string) {
  return createHmac("sha256", secret).update(`ticket-order:${orderNumber}`).digest("hex");
}

export function verifyNotification(input: { order_id: string; status_code: string; gross_amount: string; signature_key: string }, serverKey: string) {
  const signature = createHash("sha512").update(input.order_id + input.status_code + input.gross_amount + serverKey).digest("hex");
  if (!equalSecret(input.signature_key, signature)) throw new BookingError("INVALID_SIGNATURE", 403);
}

export function allowTicketHost(request: Request) {
  const host = request.headers.get("host") || new URL(request.url).host;
  const site = siteForHost(host);
  const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
  if (site !== "ticket" && !(process.env.NODE_ENV !== "production" && local)) throw new BookingError("NOT_FOUND", 404);
}

export function requireSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host") || new URL(request.url).host;
  try {
    const url = new URL(origin || "");
    if (!["https:", "http:"].includes(url.protocol) || url.host !== host) throw new Error();
    if (request.headers.get("sec-fetch-site") === "cross-site") throw new Error();
  } catch { throw new BookingError("ORIGIN_REJECTED", 403); }
}

export async function boundedJson(request: Request, limit = 16_384): Promise<unknown> {
  if (!(request.headers.get("content-type") || "").toLowerCase().startsWith("application/json")) throw new BookingError("JSON_REQUIRED", 415);
  if (Number(request.headers.get("content-length")) > limit) throw new BookingError("BODY_TOO_LARGE", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new BookingError("INVALID_INPUT");
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) { await reader.cancel(); throw new BookingError("BODY_TOO_LARGE", 413); }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch (error) {
    if (error instanceof BookingError) throw error;
    throw new BookingError("INVALID_INPUT");
  } finally { reader.releaseLock(); }
}
