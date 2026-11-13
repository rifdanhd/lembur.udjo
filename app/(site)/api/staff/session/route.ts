import { NextRequest } from "next/server";
import { ticketingDb } from "@/lib/ticketing/db";
import { loginSchema } from "@/lib/ticketing/visitor-auth";
import { loginStaff, STAFF_COOKIE } from "@/lib/ticketing/staff-auth";
import { boundedJson, BookingError, digest, requireSameOrigin } from "@/lib/ticketing/security";
import { rateLimit } from "@/lib/ticketing/orders";
import { json, failure } from "@/lib/ticketing/http";
export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request);
    const db = ticketingDb();
    await rateLimit(db, "staff-login", process.env.TICKETING_TRUST_PROXY === "true" ? request.headers.get("x-real-ip") || "shared" : "shared", 20, 900000);
    const input = loginSchema.safeParse(await boundedJson(request, 4096));
    if (!input.success) throw new BookingError("INVALID_INPUT");
    const token = await loginStaff(db, input.data.email, input.data.password);
    const oldToken = request.cookies.get(STAFF_COOKIE)?.value;
    if (oldToken) await db.staffSession.deleteMany({ where: { tokenHash: digest(oldToken) } });
    const response = json({ ok: true });
    response.cookies.set(STAFF_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: !request.nextUrl.hostname.endsWith("localhost") && request.nextUrl.hostname !== "127.0.0.1", path: "/", maxAge: 8 * 3600 });
    return response;
  } catch (error) { return failure(error); }
}
export async function DELETE(request: NextRequest) {
  try {
    requireSameOrigin(request);
    const token = request.cookies.get(STAFF_COOKIE)?.value;
    if (token) await ticketingDb().staffSession.deleteMany({ where: { tokenHash: digest(token) } });
    const response = json({ ok: true }); response.cookies.delete(STAFF_COOKIE); return response;
  } catch (error) { return failure(error); }
}
