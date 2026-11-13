import nextEnv from "@next/env";
import { PrismaClient } from "@prisma/client";
import { spawnSync } from "node:child_process";

nextEnv.loadEnvConfig(process.cwd());

const action = process.argv[2];
if (!["check", "migrate", "seed"].includes(action)) {
  console.error("Gunakan check, migrate, atau seed.");
  process.exit(1);
}

// Payload and ticketing must share a database. Migrations use a direct connection.
const applicationUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const directUrl = process.env.DATABASE_URL_UNPOOLED;
function databaseIdentity(value) {
  const url = new URL(value);
  return `${url.hostname.replace(/-pooler(?=\.)/, "")}:${url.port || "5432"}${url.pathname}`;
}

try {
  if (!applicationUrl || !directUrl) throw new Error("MISSING_DATABASE_CONFIG");
  if (new URL(directUrl).hostname.includes("-pooler.")) throw new Error("DIRECT_CONNECTION_REQUIRED");
  if (databaseIdentity(applicationUrl) !== databaseIdentity(directUrl)) throw new Error("DATABASE_MISMATCH");
  // A dedicated schema keeps Prisma migration history separate from Payload.
  const ticketingUrl = new URL(directUrl);
  ticketingUrl.searchParams.set("schema", "ticketing");
  process.env.DATABASE_URL = ticketingUrl.toString();

  if (action === "migrate") {
    // Deploy applies only checked-in additive SQL; migrate dev may propose a reset
    // because Payload owns other tables in this database.
    const result = spawnSync(process.execPath, ["node_modules/prisma/build/index.js", "migrate", "deploy"], {
      stdio: "inherit", env: process.env,
    });
    process.exitCode = result.status ?? 1;
  } else if (action === "seed") {
    await import("../prisma/seed.mjs");
  } else {
    const prisma = new PrismaClient();
    try {
      // Prisma qualifies model queries with its URL schema, but raw SQL can
      // retain PostgreSQL's default search_path (public). Inspect explicitly.
      const schemas = await prisma.$queryRaw`SELECT nspname::text AS schema FROM pg_namespace WHERE nspname = 'ticketing'`;
      const schema = schemas[0]?.schema ?? null;
      const rows = await prisma.$queryRaw`
        SELECT table_name FROM information_schema.tables WHERE table_schema = 'ticketing'
      `;
      const expected = ["User", "Product", "Schedule", "Customer", "Order", "OrderItem", "Payment", "Ticket", "CheckIn", "AuditLog", "RateLimit", "VisitorAccount", "VisitorSession", "ProductSchedule", "StaffSession", "PasswordReset", "OAuthAttempt", "BookingCategory"];
      const found = new Set(rows.map((row) => row.table_name));
      const missing = expected.filter((table) => !found.has(table));
      const data = missing.length ? null : {
        products: await prisma.product.count(),
        schedules: await prisma.schedule.count(),
        activeProducts: await prisma.product.count({ where: { active: true } }),
        activeSchedules: await prisma.schedule.count({ where: { active: true } }),
      };
      console.log(JSON.stringify({ connected: true, schema, ticketingTables: expected.length - missing.length, missing, data }, null, 2));
      if (missing.length) process.exitCode = 1;
    } finally {
      await prisma.$disconnect();
    }
  }
} catch (error) {
  // Never log full connection strings or Prisma messages containing credentials.
  console.error("Pemeriksaan database tiket gagal:", error.code || (error.message?.match(/^[A-Z_]+$/) ? error.message : "DATABASE_ERROR"));
  process.exitCode = 1;
}
