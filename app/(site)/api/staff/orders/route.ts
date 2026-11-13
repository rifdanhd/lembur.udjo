import { NextRequest } from "next/server";
import { unauthorized } from "@/lib/crm/auth";
import { isTicketAdmin } from "@/lib/ticketing/admin-access";
import { BookingError, requireSameOrigin, boundedJson } from "@/lib/ticketing/security";
import { json } from "@/lib/ticketing/http";
import { ticketingDb } from "@/lib/ticketing/db";
import { applyPaymentStatus, expireOrder } from "@/lib/ticketing/orders";
import { midtransProvider } from "@/lib/ticketing/midtrans";
import { orderNumberSchema } from "@/lib/ticketing/validation";
import {
  parseStaffQuery, parseStaffStatus, staffOrder, staffOrders, staffSummary,
} from "@/lib/ticketing/staff";

export const runtime = "nodejs";

const actionSchema = { refresh: true, expire: true } as const;

export async function GET(request: NextRequest) {
  try {
    if (!(await isTicketAdmin())) return unauthorized();
    const db = ticketingDb();
    const params = request.nextUrl.searchParams;
    const [orders, summary] = await Promise.all([
      staffOrders(db, {
        status: parseStaffStatus(params.get("status")),
        q: parseStaffQuery(params.get("q")),
        take: Number(params.get("take")) || undefined,
        skip: Number(params.get("skip")) || undefined,
      }),
      params.get("skip") ? null : staffSummary(db),
    ]);
    return json(summary ? { orders, summary } : { orders });
  } catch (error) { return staffFailure(error); }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isTicketAdmin())) return unauthorized();
    requireSameOrigin(request);
    const body = await boundedJson(request) as Record<string, unknown> | null;
    if (!body) throw new BookingError("INVALID_INPUT");
    const action = typeof body.action === "string" ? body.action : "";
    if (!(action in actionSchema)) throw new BookingError("INVALID_INPUT");
    const number = orderNumberSchema.safeParse(body.orderNumber);
    if (!number.success) throw new BookingError("NOT_FOUND", 404);
    const db = ticketingDb();

    if (action === "refresh") {
      const status = await midtransProvider().status(number.data);
      if (status) await applyPaymentStatus(db, status);
      return json({ order: await staffOrder(db, number.data), settled: Boolean(status) });
    }

    const expired = await expireOrder(db, number.data);
    if (!expired) throw new BookingError("NOT_YET_DUE", 409);
    return json({ order: await staffOrder(db, number.data) });
  } catch (error) { return staffFailure(error); }
}

function staffFailure(error: unknown) {
  if (error instanceof BookingError) {
    const messages: Record<string, string> = {
      INVALID_INPUT: "Aksi tidak dikenali. Muat ulang halaman admin.",
      NOT_FOUND: "Pesanan tidak ditemukan atau tidak dapat diakses dari browser ini.",
      NOT_YET_DUE: "Pesanan belum jatuh tempo, sehingga tidak dapat ditandai kedaluwarsa.",
      CHECKOUT_CLOSED: "Pembayaran online (sandbox) belum dikonfigurasi di server, sehingga status tidak dapat diperiksa.",
      GATEWAY_UNAVAILABLE: "Status pembayaran belum dapat diperbarui. Silakan coba lagi.",
      AMOUNT_MISMATCH: "Nominal pembayaran tidak cocok dengan pesanan. Periksa manual di dashboard Midtrans.",
      RATE_LIMITED: "Terlalu banyak permintaan. Coba lagi sebentar.",
    };
    return json({ error: messages[error.code] || "Permintaan tidak dapat diproses.", code: error.code }, error.status);
  }
  console.error("staff tickets: request failed");
  return json({ error: "Panel tiket sedang tidak tersedia. Silakan coba lagi.", code: "UNAVAILABLE" }, 503);
}
