import { randomBytes } from "node:crypto";
import type { PrismaClient } from "@prisma/client";
import { checkPassword } from "./visitor-auth";
import { BookingError, digest } from "./security";
export const STAFF_COOKIE = "lup_staff";
export async function staffSession(db: PrismaClient, token?: string) {
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const session = await db.staffSession.findUnique({ where: { tokenHash: digest(token) }, include: { user: true } });
  return session && session.expiresAt > new Date() && session.user.active ? { id: session.user.id, name: session.user.name, role: session.user.role } : null;
}
export async function loginStaff(db: PrismaClient, email: string, password: string) {
  const user = await db.user.findUnique({ where: { email } });
  const valid = await checkPassword(password, user?.passwordHash || `scrypt-v1$${"0".repeat(64)}$${"0".repeat(128)}`);
  if (!user?.active || !valid) throw new BookingError("LOGIN_FAILED", 401);
  const token = randomBytes(32).toString("hex");
  await db.staffSession.create({ data: { tokenHash: digest(token), userId: user.id, expiresAt: new Date(Date.now() + 8 * 3600000) } });
  return token;
}
