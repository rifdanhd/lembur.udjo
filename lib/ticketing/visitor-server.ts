import "server-only";
import { cookies } from "next/headers";
import { ticketingDb } from "./db";
import { VISITOR_COOKIE, visitorSession } from "./visitor-auth";

export async function currentVisitor() {
  const token = (await cookies()).get(VISITOR_COOKIE)?.value;
  if (!token) return null;
  return (await visitorSession(ticketingDb(), token))?.visitor || null;
}
