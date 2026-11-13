import { NextRequest, NextResponse } from "next/server";
import { BookingError, orderAccess, equalSecret, allowTicketHost } from "./security";
import { requireSandbox } from "./config";
import { ticketingDb } from "./db";
import { rateLimit } from "./orders";
import { VISITOR_COOKIE, visitorSession } from "./visitor-auth";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "no-referrer" } });
}

const messages: Record<string, string> = {
  RESET_INVALID: "Tautan pemulihan sudah digunakan, kedaluwarsa, atau tidak valid.",
  EMAIL_UNAVAILABLE: "Pemulihan email belum tersedia. Hubungi bantuan akun.",
  GOOGLE_UNAVAILABLE: "Masuk dengan Google belum dikonfigurasi.",
  GOOGLE_ORIGIN: "Buka portal pada domain login yang dikonfigurasi untuk melanjutkan Google.",
  STAFF_REQUIRED: "Masuk sebagai petugas yang masih aktif untuk memvalidasi tiket.",
  TICKET_INVALID: "Kode tiket tidak valid atau tidak ditemukan.",
  TICKET_USED: "Tiket ini sudah digunakan. Check-in kedua ditolak.",
  TICKET_INACTIVE: "Tiket belum dibayar, dibatalkan, atau tidak berlaku.",
  TICKET_DATE: "Tanggal kunjungan tiket berbeda dengan hari ini (WIB).",
  SCHEDULE_IN_USE: "Sesi sudah memiliki reservasi. Tanggal dan jamnya tidak dapat dipindahkan.",
  QUOTA_INCONSISTENT: "Kuota tidak boleh lebih kecil dari jumlah ditahan dan terjual.",
  QUOTA_FULL: "Kuota sesi ini tidak mencukupi. Pilih sesi atau jumlah tiket lain.",
  SCHEDULE_UNAVAILABLE: "Jadwal ini sudah tidak tersedia. Silakan pilih jadwal lain.",
  PRODUCT_UNAVAILABLE: "Kategori tiket berubah. Muat ulang daftar tiket.",
  CHECKOUT_CLOSED: "Pemesanan online belum dibuka. Silakan hubungi tim reservasi.",
  REQUEST_CONFLICT: "Data pesanan berubah. Silakan mulai pesanan baru.",
  RATE_LIMITED: "Terlalu banyak permintaan. Coba lagi sebentar.",
  NOT_FOUND: "Pesanan tidak ditemukan atau tidak dapat diakses dari browser ini.",
  GATEWAY_UNAVAILABLE: "Status pembayaran belum dapat diperbarui. Silakan coba lagi.",
  INVALID_INPUT: "Periksa kembali data pemesanan yang diisi.",
  LOGIN_FAILED: "Email atau kata sandi tidak sesuai.",
  LOGIN_REQUIRED: "Silakan masuk untuk mengakses akun dan pesanan.",
  REGISTRATION_UNAVAILABLE: "Email ini tidak dapat didaftarkan. Silakan masuk atau hubungi bantuan.",
  AUTH_INPUT_INVALID: "Periksa data akun. Saat mendaftar, gunakan nama minimal 2 karakter, email yang valid, dan kata sandi minimal 12 karakter.",
};

export function failure(error: unknown) {
  if (error instanceof BookingError) {
    const response = json({ error: messages[error.code] || "Permintaan tidak dapat diproses.", code: error.code }, error.status);
    if (error.status === 429) response.headers.set("Retry-After", "60");
    return response;
  }
  // No provider responses, database URLs, or visitor details in logs/responses.
  console.error("ticketing: request failed");
  return json({ error: "Layanan pemesanan sedang tidak tersedia. Silakan coba lagi.", code: "UNAVAILABLE" }, 503);
}

export async function limited(request: NextRequest, scope: string, limit: number) {
  allowTicketHost(request);
  // Nginx must overwrite X-Real-IP. Untrusted deployments share a conservative
  // bucket rather than accepting arbitrary client X-Forwarded-For values.
  const identity = process.env.TICKETING_TRUST_PROXY === "true" ? request.headers.get("x-real-ip") || "unknown" : "shared";
  await rateLimit(ticketingDb(), scope, identity, limit);
}

const cookieName = (orderNumber: string) => `ticket-${orderNumber}`;

export async function authorizeOrder(request: NextRequest, orderNumber: string) {
  const db = ticketingDb();
  const order = await db.order.findUnique({ where: { orderNumber }, select: { visitorId: true } });
  if (!order) throw new BookingError("NOT_FOUND", 404);
  if (order.visitorId) {
    const session = await visitorSession(db, request.cookies.get(VISITOR_COOKIE)?.value);
    if (session?.visitor.id !== order.visitorId) throw new BookingError("NOT_FOUND", 404);
    return;
  }
  const { secret } = requireSandbox();
  const value = request.cookies.get(cookieName(orderNumber))?.value || "";
  if (!equalSecret(value, orderAccess(orderNumber, secret))) throw new BookingError("NOT_FOUND", 404);
}

export function grantOrder(response: NextResponse, request: NextRequest, orderNumber: string) {
  const { secret } = requireSandbox();
  const host = request.headers.get("host") || new URL(request.url).host;
  response.cookies.set(cookieName(orderNumber), orderAccess(orderNumber, secret), {
    httpOnly: true, sameSite: "lax", secure: !/^(localhost|127\.0\.0\.1|(?:ticket|booking)\.localhost)(:\d+)?$/.test(host),
    path: "/", maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
