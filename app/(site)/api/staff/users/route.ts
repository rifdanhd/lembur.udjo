import { NextRequest } from "next/server";
import { z } from "zod";
import { unauthorized } from "@/lib/crm/auth";
import { isTicketAdmin } from "@/lib/ticketing/admin-access";
import { boundedJson, BookingError, requireSameOrigin } from "@/lib/ticketing/security";
import { hashPassword } from "@/lib/ticketing/visitor-auth";
import { ticketingDb } from "@/lib/ticketing/db";
import { json, failure } from "@/lib/ticketing/http";
const schema = z.object({ name: z.string().trim().min(2).max(100), email: z.email().max(254).transform(value => value.toLowerCase()), password: z.string().min(12).max(128).optional(), active: z.boolean(), role: z.enum(["ADMIN", "STAFF"]) }).strict();
export async function GET() {
  try { if (!(await isTicketAdmin())) return unauthorized(); return json({ users: await ticketingDb().user.findMany({ select: { id: true, name: true, email: true, active: true, role: true }, take: 200, orderBy: { email: "asc" } }) }); }
  catch (error) { return failure(error); }
}
export async function POST(request: NextRequest) {
  try {
    if (!(await isTicketAdmin())) return unauthorized(); requireSameOrigin(request);
    const input = schema.safeParse(await boundedJson(request, 4096));
    if (!input.success) throw new BookingError("INVALID_INPUT");
    const { password, ...data } = input.data;
    const passwordHash = password ? await hashPassword(password) : undefined;
    const db = ticketingDb();
    await db.$transaction(async tx => {
      const existing = await tx.user.findUnique({ where: { email: data.email } });
      if (!existing && !passwordHash) throw new BookingError("INVALID_INPUT");
      const user = await tx.user.upsert({ where: { email: data.email }, create: { ...data, passwordHash }, update: { ...data, ...(passwordHash ? { passwordHash } : {}) } });
      await tx.staffSession.deleteMany({ where: { userId: user.id } });
      await tx.auditLog.create({ data: { action: "STAFF_ACCESS_UPDATED", entityType: "User", entityId: user.id, metadata: { access: "ticket-admin", role: user.role, active: user.active } } });
    });
    return json({ ok: true });
  } catch (error) { return failure(error); }
}
