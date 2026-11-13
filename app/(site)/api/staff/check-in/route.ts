import { NextRequest } from "next/server";
import { z } from "zod";
import { ticketingDb } from "@/lib/ticketing/db";
import { STAFF_COOKIE, staffSession } from "@/lib/ticketing/staff-auth";
import { checkInTicket } from "@/lib/ticketing/tickets";
import { boundedJson, BookingError, requireSameOrigin } from "@/lib/ticketing/security";
import { json, failure } from "@/lib/ticketing/http";
import { rateLimit } from "@/lib/ticketing/orders";
export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request);
    const db = ticketingDb();
    const staff = await staffSession(db, request.cookies.get(STAFF_COOKIE)?.value);
    if (!staff) throw new BookingError("STAFF_REQUIRED", 403);
    await rateLimit(db, "check-in", staff.id, 120);
    const input = z.object({ code: z.string().min(1).max(150) }).strict().safeParse(await boundedJson(request, 2048));
    if (!input.success) throw new BookingError("TICKET_INVALID");
    return json(await checkInTicket(db, staff.id, input.data.code));
  } catch (error) { return failure(error); }
}
