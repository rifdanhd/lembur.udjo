import { bookingOrigin } from "./booking-origin";
import type { CheckoutProvider } from "./orders";
import { requireSandbox } from "./config";
import { BookingError, verifyNotification } from "./security";
import { notificationSchema, providerStatusSchema } from "./validation";
import { applyPaymentStatus } from "./orders";
import type { PrismaClient } from "@prisma/client";

export function validCheckoutUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "app.sandbox.midtrans.com" && (!url.port || url.port === "443")
      && !url.username && !url.password && url.pathname.startsWith("/snap/");
  } catch { return false; }
}

export function midtransProvider(): CheckoutProvider {
  const { key } = requireSandbox();
  const headers = { Authorization: `Basic ${Buffer.from(`${key}:`).toString("base64")}`, "Content-Type": "application/json", Accept: "application/json" };
  return {
    async create(order, customer) {
      const response = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
        method: "POST", headers, redirect: "error", signal: AbortSignal.timeout(10_000), cache: "no-store",
        body: JSON.stringify({
          transaction_details: { order_id: order.orderNumber, gross_amount: order.totalAmount },
          item_details: order.items.map((item) => ({ id: item.productId, name: item.productName.slice(0, 50), price: item.unitPrice, quantity: item.quantity })),
          customer_details: { first_name: customer.name, email: customer.email, phone: customer.whatsapp },
          enabled_payments: ["bca_va", "bni_va", "bri_va", "permata_va", "gopay", "other_qris", "shopeepay"],
          expiry: { start_time: `${new Date(order.expiresAt.getTime() - 900_000).toISOString().slice(0, 19).replace("T", " ")} +0000`, unit: "minutes", duration: 15 },
          page_expiry: { unit: "minutes", duration: 15 },
          callbacks: { finish: `${bookingOrigin()}/pesanan/${order.orderNumber}` },
        }),
      });
      if (!response.ok) throw new BookingError("GATEWAY_UNAVAILABLE", 502);
      const data = await response.json();
      if (typeof data.redirect_url !== "string" || !validCheckoutUrl(data.redirect_url)) throw new BookingError("GATEWAY_UNAVAILABLE", 502);
      return data.redirect_url;
    },
    async status(orderNumber) {
      const response = await fetch(`https://api.sandbox.midtrans.com/v2/${encodeURIComponent(orderNumber)}/status`, {
        headers, redirect: "error", signal: AbortSignal.timeout(10_000), cache: "no-store",
      });
      const data = await response.json();
      if (data.status_code === "404") return null; // Snap may not yet have a selected payment method.
      if (!response.ok) throw new BookingError("GATEWAY_UNAVAILABLE", 502);
      const parsed = providerStatusSchema.safeParse(data);
      if (!parsed.success || parsed.data.order_id !== orderNumber) throw new BookingError("GATEWAY_UNAVAILABLE", 502);
      return parsed.data;
    },
  };
}

export async function processNotification(db: PrismaClient, body: unknown, serverKey: string, provider: CheckoutProvider) {
  const parsed = notificationSchema.safeParse(body);
  if (!parsed.success) throw new BookingError("INVALID_INPUT");
  verifyNotification(parsed.data, serverKey);
  const exists = await db.order.findUnique({ where: { orderNumber: parsed.data.order_id }, select: { totalAmount: true } });
  if (!exists) throw new BookingError("NOT_FOUND", 404);
  if (Number(parsed.data.gross_amount) !== exists.totalAmount) throw new BookingError("AMOUNT_MISMATCH", 409);
  // The signature doesn't cover transaction_status. Fetch authoritative status
  // so a captured valid signature cannot be changed to forge a paid order.
  const status = await provider.status(parsed.data.order_id);
  if (!status) throw new BookingError("GATEWAY_UNAVAILABLE", 502);
  await applyPaymentStatus(db, status);
}
