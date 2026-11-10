import { Prisma, type PrismaClient } from "@prisma/client";
import { ticketingDb } from "./db";
import { orderNumberSchema } from "./validation";
import { BookingError } from "./security";

export const ORDER_STATUSES = ["PENDING", "PAID", "EXPIRED", "CANCELLED", "REFUNDED", "PAYMENT_REVIEW"] as const;
export type StaffOrderStatus = (typeof ORDER_STATUSES)[number];

const emptyCount = (): Record<StaffOrderStatus, number> => ({
  PENDING: 0, PAID: 0, EXPIRED: 0, CANCELLED: 0, REFUNDED: 0, PAYMENT_REVIEW: 0,
});

export type StaffOrder = {
  orderNumber: string;
  status: StaffOrderStatus;
  totalAmount: number;
  createdAt: string;
  expiresAt: string;
  paidAt: string | null;
  customer: { name: string; email: string; whatsapp: string | null };
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    date: string;
    session: string;
  }[];
  payment: {
    status: string;
    providerPaymentId: string | null;
    checkoutUrl: string | null;
    paidAt: string | null;
  } | null;
  tickets: { code: string; status: string }[];
};

export type StaffSummary = {
  counts: Record<StaffOrderStatus, number>;
  paidTotal: number;
  reviewTotal: number;
  tickets: { ISSUED: number; USED: number; CANCELLED: number };
};

const includeOrder = {
  customer: { select: { name: true, email: true, whatsapp: true } },
  items: {
    orderBy: { createdAt: "asc" as const },
    include: { schedule: { select: { date: true, session: true } } },
  },
  payments: {
    orderBy: { createdAt: "asc" as const },
    select: { provider: true, providerPaymentId: true, status: true, amount: true, paidAt: true, checkoutUrl: true },
  },
  tickets: { orderBy: { issuedAt: "asc" as const }, select: { code: true, status: true } },
} satisfies Prisma.OrderInclude;

function toStaffOrder(order: Prisma.OrderGetPayload<{ include: typeof includeOrder }>): StaffOrder {
  const payment = order.payments.find((p) => p.provider === "midtrans-sandbox") || order.payments[0] || null;
  return {
    orderNumber: order.orderNumber,
    status: order.status,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt.toISOString(),
    expiresAt: order.expiresAt.toISOString(),
    paidAt: order.paidAt?.toISOString() || null,
    customer: {
      name: order.customer.name,
      email: order.customer.email,
      whatsapp: order.customer.whatsapp,
    },
    items: order.items.map((item) => ({
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
      date: item.schedule.date.toISOString().slice(0, 10),
      session: item.schedule.session,
    })),
    payment: payment && {
      status: payment.status,
      providerPaymentId: payment.providerPaymentId,
      checkoutUrl: payment.checkoutUrl,
      paidAt: payment.paidAt?.toISOString() || null,
    },
    tickets: order.tickets.map((t) => ({ code: t.code, status: t.status })),
  };
}

export function parseStaffStatus(value: string | null): StaffOrderStatus | null {
  if (!value) return null;
  return (ORDER_STATUSES as readonly string[]).includes(value) ? (value as StaffOrderStatus) : null;
}

export function parseStaffQuery(value: string | null): string | null {
  const q = (value || "").trim().replace(/[\u0000-\u001f]/g, "");
  if (!q) return null;
  return q.slice(0, 120);
}

function buildWhere(status: StaffOrderStatus | null, q: string | null): Prisma.OrderWhereInput {
  const where: Prisma.OrderWhereInput = {};
  if (status) where.status = status;
  if (q) {
    if (orderNumberSchema.safeParse(q).success) where.orderNumber = q;
    else {
      where.OR = [
        { orderNumber: { equals: q.toUpperCase() } },
        { customer: { name: { contains: q, mode: "insensitive" } } },
        { customer: { email: { contains: q, mode: "insensitive" } } },
        { customer: { whatsapp: { contains: q } } },
      ];
    }
  }
  return where;
}

export async function staffOrders(
  db: PrismaClient,
  options: { status?: StaffOrderStatus | null; q?: string | null; take?: number; skip?: number } = {},
): Promise<StaffOrder[]> {
  const take = Math.min(Math.max(options.take ?? 25, 1), 50);
  const skip = Math.min(Math.max(options.skip ?? 0, 0), 5_000);
  const orders = await db.order.findMany({
    where: buildWhere(options.status ?? null, options.q ?? null),
    include: includeOrder,
    orderBy: { createdAt: "desc" },
    take,
    skip,
  });
  return orders.map(toStaffOrder);
}

export async function staffOrder(db: PrismaClient, orderNumber: string): Promise<StaffOrder> {
  const parsed = orderNumberSchema.safeParse(orderNumber);
  if (!parsed.success) throw new BookingError("NOT_FOUND", 404);
  const order = await db.order.findUnique({ where: { orderNumber: parsed.data }, include: includeOrder });
  if (!order) throw new BookingError("NOT_FOUND", 404);
  return toStaffOrder(order);
}

export async function staffSummary(db: PrismaClient): Promise<StaffSummary> {
  const [orders, tickets] = await Promise.all([
    db.order.groupBy({ by: ["status"], _count: { _all: true }, _sum: { totalAmount: true } }),
    db.ticket.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const counts = emptyCount();
  let paidTotal = 0;
  let reviewTotal = 0;
  for (const row of orders) {
    counts[row.status] = row._count._all;
    if (row.status === "PAID") paidTotal = row._sum.totalAmount || 0;
    if (row.status === "PAYMENT_REVIEW") reviewTotal = row._sum.totalAmount || 0;
  }
  const ticketCounts = { ISSUED: 0, USED: 0, CANCELLED: 0 };
  for (const row of tickets) {
    if (row.status in ticketCounts) ticketCounts[row.status as keyof typeof ticketCounts] = row._count._all;
  }
  return { counts, paidTotal, reviewTotal, tickets: ticketCounts };
}

export function ticketingForStaff() {
  return ticketingDb();
}
