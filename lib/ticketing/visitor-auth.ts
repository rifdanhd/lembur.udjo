import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { BookingError, digest } from "./security";

export const VISITOR_COOKIE = "lup_visitor";
export const SESSION_SECONDS = 7 * 24 * 60 * 60;
export const loginSchema = z.object({ email: z.email().trim().max(254).transform(v => v.toLowerCase()), password: z.string().min(1).max(128) }).strict();
export const registrationSchema = loginSchema.extend({ name: z.string().trim().min(2).max(100), password: z.string().min(12).max(128), consent: z.literal(true) }).strict();

function scrypt(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => scryptCallback(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (error, key) => error ? reject(error) : resolve(key)));
}
export async function hashPassword(password: string) {
  const salt = randomBytes(32).toString("hex");
  return `scrypt-v1$${salt}$${(await scrypt(password, salt)).toString("hex")}`;
}
export async function checkPassword(password: string, encoded: string) {
  const match = /^scrypt-v1\$([a-f0-9]{64})\$([a-f0-9]{128})$/.exec(encoded);
  if (!match) return false;
  const key = await scrypt(password, match[1]);
  return timingSafeEqual(key, Buffer.from(match[2], "hex"));
}
export async function visitorSession(db: PrismaClient, token?: string) {
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const session = await db.visitorSession.findUnique({ where: { tokenHash: digest(token) }, include: { visitor: { select: { id: true, name: true, email: true } } } });
  return session && session.expiresAt > new Date() ? session : null;
}
export async function createVisitorSession(db: PrismaClient, visitorId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_SECONDS * 1000);
  await db.visitorSession.create({ data: { visitorId, tokenHash: digest(token), expiresAt } });
  await db.visitorSession.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  return { token, expiresAt };
}
export async function registerVisitor(db: PrismaClient, input: z.infer<typeof registrationSchema>) {
  const passwordHash = await hashPassword(input.password);
  try {
    return await db.visitorAccount.create({ data: { name: input.name, email: input.email, passwordHash }, select: { id: true, name: true, email: true } });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") throw new BookingError("REGISTRATION_UNAVAILABLE", 409);
    throw error;
  }
}
export async function loginVisitor(db: PrismaClient, input: z.infer<typeof loginSchema>) {
  const visitor = await db.visitorAccount.findUnique({ where: { email: input.email } });
  const dummy = `scrypt-v1$${"0".repeat(64)}$${"0".repeat(128)}`;
  const valid = await checkPassword(input.password, visitor?.passwordHash || dummy);
  if (!visitor || !valid) throw new BookingError("LOGIN_FAILED", 401);
  return { id: visitor.id, name: visitor.name, email: visitor.email };
}
export async function ownedOrder(db: PrismaClient, visitorId: string, orderNumber: string) {
  const order = await db.order.findFirst({ where: { orderNumber, visitorId }, select: { id: true, orderNumber: true } });
  if (!order) throw new BookingError("NOT_FOUND", 404);
  return order;
}
