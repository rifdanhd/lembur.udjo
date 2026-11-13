import { NextRequest } from "next/server";
import { unauthorized } from "@/lib/crm/auth";
import { isTicketAdmin } from "@/lib/ticketing/admin-access";
import { ticketingDb } from "@/lib/ticketing/db";
import { catalogActionSchema, adminCatalog, saveCatalog } from "@/lib/ticketing/catalog-admin";
import { boundedJson, requireSameOrigin, BookingError } from "@/lib/ticketing/security";
import { failure, json } from "@/lib/ticketing/http";
export const runtime = "nodejs";
export async function GET() {
  try { if (!(await isTicketAdmin())) return unauthorized(); return json(await adminCatalog(ticketingDb())); }
  catch (error) { return failure(error); }
}
export async function POST(request: NextRequest) {
  try {
    if (!(await isTicketAdmin())) return unauthorized();
    requireSameOrigin(request);
    const input = catalogActionSchema.safeParse(await boundedJson(request));
    if (!input.success) throw new BookingError("INVALID_INPUT");
    return json(await saveCatalog(ticketingDb(), input.data));
  } catch (error) { return failure(error); }
}
