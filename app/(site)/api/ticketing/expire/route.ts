import { NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { ticketingDb } from "@/lib/ticketing/db";
import { allowTicketHost, BookingError } from "@/lib/ticketing/security";
import { expireDueOrders } from "@/lib/ticketing/orders";
import { failure, json } from "@/lib/ticketing/http";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    allowTicketHost(request);
    const expected = process.env.TICKETING_CRON_SECRET || "";
    const actual = request.headers.get("authorization")?.replace(/^Bearer /, "") || "";
    const left = Buffer.from(actual);
    const right = Buffer.from(expected);
    if (right.length < 32 || left.length !== right.length || !timingSafeEqual(left, right)) throw new BookingError("UNAUTHORIZED", 401);
    await expireDueOrders(ticketingDb());
    return json({ processed: true });
  } catch (error) { return failure(error); }
}
