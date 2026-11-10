import { NextRequest } from "next/server";
import { ticketingDb } from "@/lib/ticketing/db";
import { requireSandbox } from "@/lib/ticketing/config";
import { allowTicketHost, boundedJson } from "@/lib/ticketing/security";
import { midtransProvider, processNotification } from "@/lib/ticketing/midtrans";
import { failure, json } from "@/lib/ticketing/http";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    allowTicketHost(request);
    const { key } = requireSandbox();
    await processNotification(ticketingDb(), await boundedJson(request), key, midtransProvider());
    return json({ received: true });
  } catch (error) { return failure(error); }
}
