import "server-only";
import { catalog } from "./orders";
import { ticketingDb } from "./db";
import { sandboxConfig } from "./config";
import type { Catalog } from "./types";
export async function portalCatalog(): Promise<Catalog> {
  try { return await catalog(ticketingDb(), Boolean(sandboxConfig())); }
  catch { return { state: "unavailable", sandbox: true, checkoutEnabled: false, products: [], schedules: [] }; }
}
