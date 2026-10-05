import { clearSessionCookie } from "@/lib/crm/auth";

export async function POST() {
  await clearSessionCookie();
  return Response.json({ ok: true });
}
