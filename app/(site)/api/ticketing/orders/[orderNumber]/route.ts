import { NextRequest } from "next/server";
import { ticketingDb } from "@/lib/ticketing/db";
import { orderNumberSchema } from "@/lib/ticketing/validation";
import { BookingError, requireSameOrigin } from "@/lib/ticketing/security";
import { applyPaymentStatus, receipt } from "@/lib/ticketing/orders";
import { midtransProvider } from "@/lib/ticketing/midtrans";
import { failure, json, limited, authorizeOrder } from "@/lib/ticketing/http";

export const runtime = "nodejs";
type Context = { params: Promise<{ orderNumber: string }> };
async function orderNumber(request: NextRequest, context: Context) {
  const parsed = orderNumberSchema.safeParse((await context.params).orderNumber);
  if (!parsed.success) throw new BookingError("NOT_FOUND", 404);
  await authorizeOrder(request, parsed.data);
  await limited(request, "receipt", 120);
  return parsed.data;
}

export async function GET(request: NextRequest, context: Context) {
  try { return json(await receipt(ticketingDb(), await orderNumber(request, context))); }
  catch (error) { return failure(error); }
}

export async function POST(request: NextRequest, context: Context) {
  try {
    requireSameOrigin(request);
    const number = await orderNumber(request, context);
    await limited(request, "refresh", 20);
    const status = await midtransProvider().status(number);
    if (status) await applyPaymentStatus(ticketingDb(), status);
    return json(await receipt(ticketingDb(), number));
  } catch (error) { return failure(error); }
}
