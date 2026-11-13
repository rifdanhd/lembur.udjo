// Disposable local PostgreSQL only. Never load .env or contact the shared DB.
import { spawnSync } from "node:child_process";
import { mkdtempSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir, userInfo } from "node:os";
import { join } from "node:path";

const bin = process.env.TICKETING_TEST_PG_BIN || "/usr/local/opt/postgresql@18/bin";
if (!existsSync(join(bin, "initdb"))) throw new Error("Set TICKETING_TEST_PG_BIN to a local PostgreSQL bin directory.");
const dir = mkdtempSync(join(tmpdir(), "lembur-ticketing-tests-"));
const port = 54000 + Math.floor(Math.random() * 5000);
const user = userInfo().username;
const url = `postgresql://${encodeURIComponent(user)}@127.0.0.1:${port}/ticketing_phase2_test?schema=ticketing`;
const env = { ...process.env, NODE_ENV: "test", DATABASE_URL: url, POSTGRES_URL: url, DATABASE_URL_UNPOOLED: url, TICKETING_TEST_DATABASE_URL: url };
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", env, ...options });
  if (args.includes("--test")) {
    mkdirSync("docs/booking/evidence", { recursive: true });
    writeFileSync("docs/booking/evidence/integration.tap", result.stdout || result.stderr || "No test output");
    const cases = [...(result.stdout || "").matchAll(/^(ok|not ok) (\d+) - (.+)$/gm)].map(match => ({ id: `INT-${match[2]}`, scenario: match[3], expected: match[3], actual: match[1] === "ok" ? "All assertions passed on disposable local PostgreSQL" : "Assertion failed; see integration.tap", status: match[1] === "ok" ? "PASS" : "FAIL" }));
    writeFileSync("docs/booking/evidence/integration-results.json", JSON.stringify({ runAt: new Date().toISOString(), database: "Disposable local PostgreSQL; never the shared database", provider: "Stubbed provider responses in integration suite", exitCode: result.status, cases }, null, 2));
    process.stdout.write(result.stdout || "");
  }
  if (result.status !== 0) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    throw new Error(`Command failed: ${command}`);
  }
  return result;
}

let started = false;
try {
  run(join(bin, "initdb"), ["-D", join(dir, "data"), "--auth=trust", "--no-locale", "--encoding=UTF8"]);
  run(join(bin, "pg_ctl"), ["-D", join(dir, "data"), "-l", join(dir, "postgres.log"), "-o", `-F -h 127.0.0.1 -p ${port} -k ${dir}`, "-w", "start"]);
  started = true;
  run(join(bin, "createdb"), ["-h", "127.0.0.1", "-p", String(port), "-U", user, "ticketing_phase2_test"]);
  run(process.execPath, ["node_modules/prisma/build/index.js", "migrate", "deploy"]);
  const tests = run(process.execPath, ["--import", "tsx", "--test", "--test-reporter=tap", "tests/ticketing-security.test.ts", "tests/ticketing-orders.test.ts", "tests/subdomain-routing.test.ts"], { stdio: "pipe" });
  process.exitCode = tests.status ?? 1;
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (started) run(join(bin, "pg_ctl"), ["-D", join(dir, "data"), "-m", "fast", "-w", "stop"]);
  console.log("Test database stopped. Temporary logs:", dir);
}
