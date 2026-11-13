import * as oidc from "openid-client";
import type { PrismaClient } from "@prisma/client";
import { BookingError } from "./security";
import { bookingOrigin } from "./booking-origin";
export const GOOGLE_COOKIE = "lup_oauth_state";
export const googleEnabled = () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
export const googleCallback = () => `${bookingOrigin()}/api/ticketing/auth/google/callback`;
export async function googleClient() {
  if (!googleEnabled()) throw new BookingError("GOOGLE_UNAVAILABLE", 503);
  return oidc.discovery(new URL("https://accounts.google.com"), process.env.GOOGLE_CLIENT_ID!, process.env.GOOGLE_CLIENT_SECRET!);
}
export async function googleVisitor(db: PrismaClient, claims: { sub?: unknown; email?: unknown; email_verified?: unknown; name?: unknown }) {
  if (typeof claims.sub !== "string" || !claims.sub || claims.sub.length > 255 || claims.email_verified !== true || typeof claims.email !== "string" || claims.email.length > 254) throw new BookingError("GOOGLE_LOGIN_FAILED", 401);
  const existing = await db.visitorAccount.findUnique({ where: { googleSubject: claims.sub }, select: { id: true } });
  if (existing) return existing;
  const email = claims.email.toLowerCase();
  // A verified Google email must still never claim an existing local account.
  if (await db.visitorAccount.findUnique({ where: { email }, select: { id: true } })) throw new BookingError("GOOGLE_LINK_REQUIRED", 409);
  return db.visitorAccount.create({ data: { email, googleSubject: claims.sub, emailVerifiedAt: new Date(), name: typeof claims.name === "string" ? claims.name.slice(0, 100) : "Pengunjung", passwordHash: null }, select: { id: true } });
}
