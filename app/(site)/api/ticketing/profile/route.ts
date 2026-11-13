import { NextRequest } from "next/server";
import { z } from "zod";
import { ticketingDb } from "@/lib/ticketing/db";
import { visitorSession, VISITOR_COOKIE } from "@/lib/ticketing/visitor-auth";
import { boundedJson, BookingError, requireSameOrigin } from "@/lib/ticketing/security";
import { limited, json, failure } from "@/lib/ticketing/http";
export async function PATCH(request: NextRequest) {
  try {
    requireSameOrigin(request); await limited(request, "profile", 20);
    const db = ticketingDb(); const session = await visitorSession(db, request.cookies.get(VISITOR_COOKIE)?.value);
    if (!session) throw new BookingError("LOGIN_REQUIRED", 401);
    const input = z.object({ name: z.string().trim().min(2).max(100) }).strict().safeParse(await boundedJson(request, 2048));
    if (!input.success) throw new BookingError("INVALID_INPUT");
    await db.visitorAccount.update({ where: { id: session.visitor.id }, data: input.data });
    return json({ ok: true });
  } catch (error) { return failure(error); }
}
