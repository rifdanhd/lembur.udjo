import { z } from "zod";
import { ProductType, type PrismaClient } from "@prisma/client";
import { BookingError } from "./security";

const id = z.string().min(1).max(100);
const imagePath = z.string().regex(/^\/[A-Za-z0-9_./-]+\.(?:webp|png|jpe?g|avif)$/).refine(value => !value.includes(".."));
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
});
export const catalogActionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("category"), id: id.optional(), name: z.string().trim().min(2).max(100), slug: z.string().regex(/^[a-z0-9-]{2,100}$/), description: z.string().max(5000), image: imagePath, active: z.boolean(), sortOrder: z.number().int().min(0).max(1000) }).strict(),
  z.object({ action: z.literal("product"), id: id.optional(), name: z.string().trim().min(2).max(100), slug: z.string().regex(/^[a-z0-9-]{2,100}$/), description: z.string().max(5000), type: z.enum(ProductType), categoryId: id.nullable().optional(), imagePath: imagePath.nullable().optional(), policy: z.string().max(5000).nullable().optional(), price: z.number().int().min(1).max(1_000_000_000), active: z.boolean() }).strict(),
  z.object({ action: z.literal("schedule"), id: id.optional(), date, session: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/), capacity: z.number().int().min(1).max(100_000), active: z.boolean() }).strict(),
  z.object({ action: z.literal("offer"), productId: id, scheduleId: id, price: z.number().int().min(1).max(1_000_000_000), active: z.boolean() }).strict(),
]);
export async function adminCatalog(db: PrismaClient) {
  const [products, schedules, categories] = await Promise.all([
    db.product.findMany({ include: { schedules: true }, orderBy: { name: "asc" }, take: 500 }),
    db.schedule.findMany({ orderBy: [{ date: "desc" }, { session: "asc" }], take: 500 }),
    db.bookingCategory.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], take: 200 }),
  ]);
  return { products, categories, schedules: schedules.map(item => ({ ...item, date: item.date.toISOString().slice(0, 10) })) };
}
export async function saveCatalog(db: PrismaClient, input: z.infer<typeof catalogActionSchema>) {
  return db.$transaction(async tx => {
    let entityId: string;
    if (input.action === "category") {
      const { action, id, ...data } = input; void action;
      if (id) await tx.$queryRaw`SELECT id FROM "ticketing"."BookingCategory" WHERE id = ${id} FOR UPDATE`;
      const category = id ? await tx.bookingCategory.update({ where: { id }, data }) : await tx.bookingCategory.create({ data });
      entityId = category.id;
    } else if (input.action === "product") {
      const { action, id, ...data } = input;
      void action;
      if (id) await tx.$queryRaw`SELECT id FROM "ticketing"."Product" WHERE id = ${id} FOR UPDATE`;
      const product = id ? await tx.product.update({ where: { id }, data }) : await tx.product.create({ data });
      entityId = product.id;
    } else if (input.action === "schedule") {
      const { action, id, date, ...rest } = input;
      void action;
      const data = { ...rest, date: new Date(`${date}T00:00:00Z`) };
      if (id) {
        await tx.$queryRaw`SELECT id FROM "ticketing"."Schedule" WHERE id = ${id} FOR UPDATE`;
        const existing = await tx.schedule.findUnique({ where: { id } });
        if (!existing || data.capacity < existing.reserved + existing.sold) throw new BookingError("QUOTA_INCONSISTENT", 409);
        if ((existing.reserved || existing.sold) && (date !== existing.date.toISOString().slice(0, 10) || rest.session !== existing.session)) throw new BookingError("SCHEDULE_IN_USE", 409);
      }
      const schedule = id ? await tx.schedule.update({ where: { id }, data }) : await tx.schedule.create({ data });
      entityId = schedule.id;
    } else {
      const { action, ...data } = input;
      void action;
      // Same lock order as checkout: schedule, then product.
      await tx.$queryRaw`SELECT id FROM "ticketing"."Schedule" WHERE id = ${data.scheduleId} FOR UPDATE`;
      await tx.$queryRaw`SELECT id FROM "ticketing"."Product" WHERE id = ${data.productId} FOR UPDATE`;
      await tx.productSchedule.upsert({ where: { productId_scheduleId: { productId: data.productId, scheduleId: data.scheduleId } }, create: data, update: { price: data.price, active: data.active } });
      entityId = `${data.productId}:${data.scheduleId}`;
    }
    await tx.auditLog.create({ data: { action: `CATALOG_${input.action.toUpperCase()}_SAVED`, entityType: "Catalog", entityId, metadata: { access: "ticket-admin" } } });
    return { saved: true };
  });
}
