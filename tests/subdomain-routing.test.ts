import assert from "node:assert/strict";
import { test } from "node:test";
import { NextRequest } from "next/server";
import { proxy } from "../proxy";
import { siteForHost } from "../lib/site-domains";

const base = "lemburudjoparahyangan.com";
function request(host: string, path = "/", init?: { method?: string; headers?: Record<string, string> }) {
  return proxy(new NextRequest(`https://${host}${path}`, {
    ...init,
    headers: { host, ...init?.headers },
  }));
}

test("website and local previews keep existing public routes", () => {
  for (const host of [base, `www.${base}`, "localhost:3107", "preview.vercel.app"]) {
    assert.equal(request(host).headers.get("x-middleware-next"), "1");
    assert.equal(request(host, "/info").headers.get("x-middleware-next"), "1");
  }
  assert.equal(siteForHost(`APP.${base}:443`), "app");
  assert.equal(siteForHost(`app.${base}.evil.test`), "preview");
});

test("staff URLs reach the existing protected CRM and preserve queries", () => {
  const host = `app.${base}`;
  assert.equal(request(host).headers.get("location"), `https://${host}/dashboard`);
  assert.equal(request(host, "/dashboard?view=leads").headers.get("x-middleware-rewrite"), `https://${host}/admin?view=leads`);
  assert.equal(request(host, "/login").headers.get("x-middleware-rewrite"), `https://${host}/admin/login`);
  assert.equal(request(host, "/admin/login").headers.get("location"), `https://${host}/login`);
  assert.equal(request(base, "/admin").headers.get("location"), `https://${host}/dashboard`);
  assert.equal(request(base, "/admin/login").headers.get("location"), `https://${host}/login`);
});

test("ticket hostname cannot reach staff pages or APIs", () => {
  const host = `ticket.${base}`;
  assert.equal(request(host).headers.get("x-middleware-rewrite"), `https://${host}/beranda-tiket`);
  for (const path of ["/admin", "/login", "/api/leads", "/api/auth/login", "/api/users", "/api/leads.json", "/hrd", "/ticket"]) {
    assert.equal(request(host, path).status, 404, path);
  }
  assert.equal(request(base, "/ticket").status, 404);
  assert.equal(request(`app.${base}`, "/info").status, 404);
});

test("static assets remain accessible, private pages are not cached or indexed", async () => {
  for (const host of [`app.${base}`, `ticket.${base}`]) {
    for (const path of ["/_next/static/chunk.js", "/_next/image?url=%2FHero.ecoland.jpg&w=640&q=75", "/favicon.ico"]) {
      assert.equal(request(host, path).headers.get("x-middleware-next"), "1");
    }
    assert.equal(await request(host, "/robots.txt").text(), "User-agent: *\nDisallow: /\n");
    assert.equal(request(host).headers.get("x-robots-tag"), "noindex, nofollow");
    assert.equal(request(host).headers.get("cache-control"), "private, no-store");
  }
});

test("staff API retains session handlers and rejects cross-origin writes", () => {
  const host = `app.${base}`;
  assert.equal(request(host, "/api/leads").headers.get("x-middleware-next"), "1");
  assert.equal(request(host, "/api/auth/login", { method: "POST", headers: { origin: `https://${host}` } }).headers.get("x-middleware-next"), "1");
  assert.equal(request(host, "/api/auth/login", { method: "POST", headers: { origin: `https://ticket.${base}` } }).status, 403);
  assert.equal(request(host, "/api/auth/logout", { method: "POST", headers: { origin: "https://evil.test" } }).status, 403);
  assert.equal(request(host, "/api/auth/login", { method: "POST", headers: { origin: "null" } }).status, 403);
  // TLS may terminate at Nginx while the upstream request uses HTTP.
  const upstream = new NextRequest(`http://127.0.0.1:3001/api/auth/login`, {
    method: "POST", headers: { host, origin: `https://${host}` },
  });
  assert.equal(proxy(upstream).headers.get("x-middleware-next"), "1");
});

test("local subdomains use the same mappings without production redirects", () => {
  assert.equal(request("app.localhost:3107", "/login").headers.get("x-middleware-rewrite"), "https://app.localhost:3107/admin/login");
  assert.equal(request("ticket.localhost:3107").headers.get("x-middleware-rewrite"), "https://ticket.localhost:3107/beranda-tiket");
});

test("complete ticket portal routes are isolated and the original reservation remains reachable", () => {
  for (const path of ["/beranda-tiket", "/order-tickets", "/order-tickets?tab=budaya", "/pilih-tiket", "/keranjang", "/checkout", "/masuk", "/daftar", "/akun", "/pesanan", "/pesanan/contoh", "/tiket-saya", "/bantuan", "/faq"]) {
    assert.equal(request(`ticket.${base}`, path).headers.get("x-middleware-next"), "1", path);
    assert.equal(request(base, path).status, 404, path);
    assert.equal(request(`app.${base}`, path).status, 404, path);
  }
  assert.equal(request(`ticket.${base}`, "/pemesanan-lama").headers.get("x-middleware-rewrite"), `https://ticket.${base}/ticket`);
  assert.equal(request(`ticket.${base}`, "/?pesanan=LU-012345678901234567890123").headers.get("x-middleware-rewrite"), `https://ticket.${base}/ticket?pesanan=LU-012345678901234567890123`);
  const upstream = new NextRequest("https://localhost:3001/", { headers: { host: `app.${base}` } });
  assert.equal(proxy(upstream).headers.get("location"), `https://app.${base}/dashboard`);
});

test("ticket API allowlist keeps visitor checkout separate from staff and website", () => {
  for (const path of ["/api/ticketing/catalog", "/api/ticketing/orders", "/api/ticketing/orders/LU-test", "/api/ticketing/webhook"]) {
    assert.equal(request(`ticket.${base}`, path).headers.get("x-middleware-next"), "1");
    assert.equal(request(`ticket.${base}`, path).headers.get("cache-control"), "private, no-store");
    assert.equal(request(base, path).status, 404);
    assert.equal(request(`app.${base}`, path).status, 404);
  }
  assert.equal(request(`ticket.${base}`, "/api/leads").status, 404);
});

 test("retired logo is unavailable on ticket host while website assets remain unchanged", () => {
  const host = `ticket.${base}`;
  for (const path of ["/UdjoFullColor.png", "/_next/image?url=%2FUdjoFullColor.png&w=256&q=75", `/_next/image?url=${encodeURIComponent(`https://${base}/UdjoFullColor.png`)}&w=256&q=75`]) {
    assert.equal(request(host, path).status, 404);
  }
  assert.equal(request(base, "/UdjoFullColor.png").headers.get("x-middleware-next"), "1");
});
