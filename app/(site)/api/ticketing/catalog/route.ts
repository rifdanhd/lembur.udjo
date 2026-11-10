import { NextRequest } from "next/server";
import { ticketingDb } from "@/lib/ticketing/db";
import { sandboxConfig } from "@/lib/ticketing/config";
import { catalog } from "@/lib/ticketing/orders";
import { failure, json, limited } from "@/lib/ticketing/http";

export const runtime = "nodejs";
export async function GET(request: NextRequest) {
  try {
    await limited(request, "catalog", 120);
    return json(await catalog(ticketingDb(), Boolean(sandboxConfig())));
  } catch (error) { return failure(error); }
}
