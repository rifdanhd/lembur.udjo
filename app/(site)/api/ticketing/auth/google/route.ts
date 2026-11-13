import { NextRequest, NextResponse } from "next/server";
import * as oidc from "openid-client";
import { googleClient, googleCallback, GOOGLE_COOKIE } from "@/lib/ticketing/google-auth";
import { bookingOrigin } from "@/lib/ticketing/booking-origin";
import { ticketingDb } from "@/lib/ticketing/db";
import { limited, failure } from "@/lib/ticketing/http";
import { safeContinue } from "@/lib/ticketing/portal-data";
import { BookingError, digest } from "@/lib/ticketing/security";
export async function GET(request: NextRequest) {
  try {
    await limited(request, "google-start", 20);
    if (new URL(bookingOrigin()).host !== request.headers.get("host")) throw new BookingError("GOOGLE_ORIGIN", 409);
    const config = await googleClient();
    const state = oidc.randomState(); const verifier = oidc.randomPKCECodeVerifier(); const nonce = oidc.randomNonce();
    const db = ticketingDb();
    await db.oAuthAttempt.deleteMany({ where: { expiresAt: { lt: new Date() } } });
    await db.oAuthAttempt.create({ data: { stateHash: digest(state), verifier, nonce, continueTo: safeContinue(request.nextUrl.searchParams.get("lanjut")), expiresAt: new Date(Date.now() + 600000) } });
    const url = oidc.buildAuthorizationUrl(config, { redirect_uri: googleCallback(), scope: "openid email profile", state, nonce, code_challenge: await oidc.calculatePKCECodeChallenge(verifier), code_challenge_method: "S256", prompt: "select_account" });
    const response = NextResponse.redirect(url);
    response.headers.set("Cache-Control", "no-store"); response.headers.set("Referrer-Policy", "no-referrer");
    response.cookies.set(GOOGLE_COOKIE, state, { httpOnly: true, secure: bookingOrigin().startsWith("https:"), sameSite: "lax", path: "/api/ticketing/auth/google", maxAge: 600 });
    return response;
  } catch (error) { return failure(error); }
}
