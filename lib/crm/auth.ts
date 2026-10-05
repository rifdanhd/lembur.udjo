import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "crm_session";
const SESSION_DAYS = 7;

function getSecret() {
  const s = process.env.CRM_SECRET || process.env.CRM_PASSWORD;
  if (!s) {
    throw new Error("Set CRM_SECRET (atau CRM_PASSWORD) di environment variable proyek Vercel.");
  }
  return s;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createSessionToken() {
  const exp = Date.now() + SESSION_DAYS * 86_400_000;
  const raw = String(exp);
  return `${raw}.${sign(raw)}`;
}

export function verifySessionToken(token?: string): boolean {
  if (!token) return false;
  const [expRaw, sig] = token.split(".");
  if (!expRaw || !sig) return false;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const expected = Buffer.from(sign(expRaw));
  const actual = Buffer.from(sig);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function checkPassword(input: string) {
  const password = process.env.CRM_PASSWORD;
  if (!password) {
    throw new Error("Set CRM_PASSWORD di environment variable proyek Vercel.");
  }
  const a = Buffer.from(createHmac("sha256", getSecret()).update(input).digest());
  const b = Buffer.from(createHmac("sha256", getSecret()).update(password).digest());
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
