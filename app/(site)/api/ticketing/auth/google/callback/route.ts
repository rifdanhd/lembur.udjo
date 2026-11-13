import { NextRequest, NextResponse } from "next/server";
import * as oidc from "openid-client";
import { googleClient, googleCallback, googleVisitor, GOOGLE_COOKIE } from "@/lib/ticketing/google-auth";
import { bookingOrigin } from "@/lib/ticketing/booking-origin";
import { ticketingDb } from "@/lib/ticketing/db";
import { limited } from "@/lib/ticketing/http";
import { BookingError, digest, equalSecret } from "@/lib/ticketing/security";
import { createVisitorSession, SESSION_SECONDS, VISITOR_COOKIE } from "@/lib/ticketing/visitor-auth";
export async function GET(request: NextRequest) {
  let destination = "/masuk?oauth=gagal";
  let token: string | undefined;
  try {
    await limited(request, "google-callback", 30);
    const state = request.nextUrl.searchParams.get("state"); const cookie = request.cookies.get(GOOGLE_COOKIE)?.value;
    if (!state || state.length > 200 || !cookie || !equalSecret(digest(state), digest(cookie)) || new URL(bookingOrigin()).host !== request.headers.get("host")) throw new BookingError("GOOGLE_LOGIN_FAILED", 401);
    const db = ticketingDb(); const key = digest(state);
    const attempt = await db.oAuthAttempt.findUnique({ where: { stateHash: key } });
    if (!attempt || attempt.expiresAt <= new Date()) throw new BookingError("GOOGLE_LOGIN_FAILED", 401);
    const consumed = await db.oAuthAttempt.deleteMany({ where: { stateHash: key, expiresAt: { gt: new Date() } } });
    if (!consumed.count) throw new BookingError("GOOGLE_LOGIN_FAILED", 401);
    // Construct a trusted callback origin instead of using internal upstream URLs.
    const callback = new URL(googleCallback()); callback.search = request.nextUrl.search;
    const tokens = await oidc.authorizationCodeGrant(await googleClient(), callback, { pkceCodeVerifier: attempt.verifier, expectedState: state, expectedNonce: attempt.nonce, idTokenExpected: true });
    const claims = tokens.claims();
    if (!claims) throw new BookingError("GOOGLE_LOGIN_FAILED", 401);
    const visitor = await googleVisitor(db, claims);
    token = (await createVisitorSession(db, visitor.id)).token;
    const oldToken = request.cookies.get(VISITOR_COOKIE)?.value;
    if (oldToken) await db.visitorSession.deleteMany({ where: { tokenHash: digest(oldToken) } });
    destination = attempt.continueTo;
  } catch { /* No tokens, identity claims or provider responses in logs/URLs. */ }
  const response = NextResponse.redirect(new URL(destination, bookingOrigin()));
  response.headers.set("Cache-Control", "no-store"); response.headers.set("Referrer-Policy", "no-referrer");
  response.cookies.set(GOOGLE_COOKIE, "", { httpOnly: true, secure: bookingOrigin().startsWith("https:"), sameSite: "lax", path: "/api/ticketing/auth/google", maxAge: 0 });
  if (token) response.cookies.set(VISITOR_COOKIE, token, { httpOnly: true, secure: bookingOrigin().startsWith("https:"), sameSite: "lax", path: "/", maxAge: SESSION_SECONDS });
  return response;
}
