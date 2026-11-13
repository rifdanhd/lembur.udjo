import { randomBytes } from "node:crypto";
import type { PrismaClient } from "@prisma/client";
import { BookingError, digest } from "./security";
import { hashPassword } from "./visitor-auth";
export const emailResetEnabled = () => Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
export async function createReset(db: PrismaClient, email: string) {
  const visitor = await db.visitorAccount.findUnique({ where: { email } });
  if (!visitor?.passwordHash) return null;
  const token = randomBytes(32).toString("hex");
  await db.passwordReset.create({ data: { tokenHash: digest(token), visitorId: visitor.id, expiresAt: new Date(Date.now() + 1800000) } });
  await db.passwordReset.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  return token;
}
export async function resetPassword(db: PrismaClient, token: string, password: string) {
  const passwordHash = await hashPassword(password);
  await db.$transaction(async tx => {
    const key = digest(token);
    const reset = await tx.passwordReset.findUnique({ where: { tokenHash: key } });
    if (!reset || reset.expiresAt <= new Date()) throw new BookingError("RESET_INVALID", 400);
    await tx.$queryRaw`SELECT id FROM "ticketing"."VisitorAccount" WHERE id = ${reset.visitorId} FOR UPDATE`;
    const consumed = await tx.passwordReset.deleteMany({ where: { tokenHash: key, expiresAt: { gt: new Date() } } });
    if (!consumed.count) throw new BookingError("RESET_INVALID", 400);
    await tx.visitorAccount.update({ where: { id: reset.visitorId }, data: { passwordHash, emailVerifiedAt: new Date() } });
    await tx.visitorSession.deleteMany({ where: { visitorId: reset.visitorId } });
    await tx.passwordReset.deleteMany({ where: { visitorId: reset.visitorId } });
    await tx.auditLog.create({ data: { action: "VISITOR_PASSWORD_RESET", entityType: "VisitorAccount", entityId: reset.visitorId } });
  });
}
