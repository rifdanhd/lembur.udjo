// Rehearse the exact migration in an isolated schema, then roll everything back.
import nextEnv from "@next/env";
import pg from "pg";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

nextEnv.loadEnvConfig(process.cwd());
if (!process.env.DATABASE_URL_UNPOOLED) throw new Error("DATABASE_URL_UNPOOLED required");
const client = new pg.Client({ connectionString: process.env.DATABASE_URL_UNPOOLED, connectionTimeoutMillis:15000 });
const schema = `ticketing_verify_${randomBytes(8).toString("hex")}`;
const sql = readFileSync(new URL("../prisma/migrations/20261105090000_ticketing_foundation/migration.sql", import.meta.url), "utf8")
  .replace(/^BEGIN;\s*/, "").replace(/COMMIT;\s*$/, "");
try {
  await client.connect();
  await client.query("BEGIN");
  await client.query(`CREATE SCHEMA "${schema}"`);
  await client.query(`SET LOCAL search_path TO "${schema}"`);
  await client.query(sql);
  const { rows } = await client.query("SELECT count(*)::int AS count FROM information_schema.tables WHERE table_schema = $1", [schema]);
  assert.equal(rows[0].count, 10);
  await client.query("SAVEPOINT invalid_order");
  await assert.rejects(
    client.query(`INSERT INTO "Order" (id, "orderNumber", "customerId", "totalAmount", "expiresAt", "updatedAt") VALUES ('test', 'test', 'missing-customer', 100, NOW(), NOW())`),
    (error) => error.code === "23503",
  );
  await client.query("ROLLBACK TO SAVEPOINT invalid_order");
  await client.query("ROLLBACK");
  const remaining = await client.query("SELECT count(*)::int AS count FROM information_schema.schemata WHERE schema_name = $1", [schema]);
  assert.equal(remaining.rows[0].count, 0);
  console.log("PASS: migrasi membuat 10 tabel, foreign key menolak order tanpa pelanggan, seluruh simulasi di-rollback.");
} catch (error) {
  await client.query("ROLLBACK").catch(() => {});
  console.error("Verifikasi migrasi gagal:", error.code || error.name);
  process.exitCode = 1;
} finally {
  await client.end();
}
