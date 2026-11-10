import { NextRequest } from "next/server";
import { ticketingDb } from "@/lib/ticketing/db";
import { requireSandbox } from "@/lib/ticketing/config";
import { checkoutSchema } from "@/lib/ticketing/validation";
import { BookingError, boundedJson, requireSameOrigin } from "@/lib/ticketing/security";
import { reserveOrder, startCheckout, receipt, rateLimit } from "@/lib/ticketing/orders";
import { midtransProvider } from "@/lib/ticketing/midtrans";
import { failure, json, limited, grantOrder } from "@/lib/ticketing/http";
import { VISITOR_COOKIE, visitorSession } from "@/lib/ticketing/visitor-auth";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request);
    requireSandbox();
    await limited(request, "create", 10);
    const parsed = checkoutSchema.safeParse(await boundedJson(request));
    if (!parsed.success) throw new BookingError("INVALID_INPUT");
    const db = ticketingDb();
    const session = await visitorSession(db, request.cookies.get(VISITOR_COOKIE)?.value);
    if (!session) throw new BookingError("LOGIN_REQUIRED", 401);
    if (parsed.data.customer.email !== session.visitor.email) throw new BookingError("INVALID_INPUT");
    await rateLimit(db, "email", parsed.data.customer.email, 5, 15 * 60_000);
    const order = await reserveOrder(db, parsed.data, new Date(), session.visitor.id);
    await startCheckout(db, order, parsed.data.customer, midtransProvider());
    return grantOrder(json(await receipt(db, order.orderNumber), 201), request, order.orderNumber);
  } catch (error) { return failure(error); }
}
