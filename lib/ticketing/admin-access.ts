import "server-only";
import { cookies } from "next/headers";
import { isAuthed } from "../crm/auth";
import { staffSession, STAFF_COOKIE } from "./staff-auth";
import { ticketingDb } from "./db";
export async function isTicketAdmin() {
  if (await isAuthed()) return true;
  const token = (await cookies()).get(STAFF_COOKIE)?.value;
  return token ? (await staffSession(ticketingDb(), token))?.role === "ADMIN" : false;
}
