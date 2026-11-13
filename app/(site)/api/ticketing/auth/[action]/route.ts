import { NextRequest } from "next/server";
import { ticketingDb } from "@/lib/ticketing/db";
import { BookingError, allowTicketHost, boundedJson, digest, requireSameOrigin } from "@/lib/ticketing/security";
import { json, failure, limited } from "@/lib/ticketing/http";
import { rateLimit } from "@/lib/ticketing/orders";
import { VISITOR_COOKIE, SESSION_SECONDS, createVisitorSession, visitorSession, registerVisitor, loginVisitor, loginSchema, registrationSchema } from "@/lib/ticketing/visitor-auth";

export const runtime = "nodejs";
type Context = { params: Promise<{ action: string }> };
export async function GET(request: NextRequest, context: Context) {
  try {
    allowTicketHost(request);
    if ((await context.params).action !== "session") throw new BookingError("NOT_FOUND", 404);
    const session = await visitorSession(ticketingDb(), request.cookies.get(VISITOR_COOKIE)?.value);
    return json({ visitor: session?.visitor || null });
  } catch (error) { return failure(error); }
}
export async function POST(request: NextRequest, context: Context) {
  try {
    allowTicketHost(request); requireSameOrigin(request);
    const { action } = await context.params;
    if (!["register", "login", "logout"].includes(action)) throw new BookingError("NOT_FOUND", 404);
    await limited(request, `visitor-${action}`, action === "register" ? 5 : 20);
    const db = ticketingDb();
    const oldToken = request.cookies.get(VISITOR_COOKIE)?.value;
    if (action === "logout") {
      if (oldToken) await db.visitorSession.deleteMany({ where: { tokenHash: digest(oldToken) } });
      const response = json({ ok: true });
      response.cookies.set(VISITOR_COOKIE, "", { httpOnly: true, secure: !request.headers.get("host")?.includes("localhost"), sameSite: "lax", path: "/", maxAge: 0 });
      return response;
    }
    const body = await boundedJson(request, 4096);
    const parsed = (action === "register" ? registrationSchema : loginSchema).safeParse(body);
    if (!parsed.success) throw new BookingError("AUTH_INPUT_INVALID");
    await rateLimit(db, "visitor-email", parsed.data.email, 10, 15 * 60_000);
    const visitor = action === "register"
      ? await registerVisitor(db, registrationSchema.parse(body))
      : await loginVisitor(db, loginSchema.parse(body));
    const session = await createVisitorSession(db, visitor.id);
    if (oldToken) await db.visitorSession.deleteMany({ where: { tokenHash: digest(oldToken) } });
    const response = json({ visitor }, action === "register" ? 201 : 200);
    const host = request.headers.get("host") || "";
    response.cookies.set(VISITOR_COOKIE, session.token, { httpOnly: true, secure: !/^(localhost|127\.0\.0\.1|(?:ticket|booking)\.localhost)(:\d+)?$/.test(host), sameSite: "lax", path: "/", maxAge: SESSION_SECONDS });
    return response;
  } catch (error) { return failure(error); }
}
