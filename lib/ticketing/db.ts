import "server-only";
import { PrismaClient } from "@prisma/client";

const globalDb = globalThis as unknown as { ticketingDb?: PrismaClient };

export function ticketingDb() {
  if (globalDb.ticketingDb) return globalDb.ticketingDb;
  const value = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!value) throw new Error("TICKETING_DATABASE_MISSING");
  const url = new URL(value);
  url.searchParams.set("schema", "ticketing");
  const db = new PrismaClient({ datasourceUrl: url.toString(), log: [] });
  globalDb.ticketingDb = db;
  return db;
}
