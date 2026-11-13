import { NextRequest } from "next/server";
import { ticketingDb } from "@/lib/ticketing/db";
import { authorizeOrder, failure, limited } from "@/lib/ticketing/http";
import { ticketDownloadData } from "@/lib/ticketing/tickets";
import { ticketPdf } from "@/lib/ticketing/ticket-pdf";
import { orderNumberSchema } from "@/lib/ticketing/validation";
import { BookingError } from "@/lib/ticketing/security";
export const runtime = "nodejs";
export async function GET(request: NextRequest, context: { params: Promise<{ orderNumber: string }> }) {
  try {
    await limited(request, "ticket-download", 20);
    const parsed = orderNumberSchema.safeParse((await context.params).orderNumber);
    if (!parsed.success) throw new BookingError("NOT_FOUND", 404);
    await authorizeOrder(request, parsed.data);
    const pdf = await ticketPdf(await ticketDownloadData(ticketingDb(), parsed.data));
    return new Response(new Uint8Array(pdf), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${parsed.data}-sandbox.pdf"`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "X-Robots-Tag": "noindex", "Referrer-Policy": "no-referrer" } });
  } catch (error) { return failure(error); }
}
