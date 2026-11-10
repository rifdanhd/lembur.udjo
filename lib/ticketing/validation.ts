import { z } from "zod";

export const checkoutSchema = z.object({
  requestKey: z.uuid(),
  scheduleId: z.string().min(1).max(100),
  items: z.array(z.object({
    productId: z.string().min(1).max(100),
    quantity: z.number().int().min(1).max(20),
  }).strict()).min(1).max(10),
  customer: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.email().max(254).transform((email) => email.toLowerCase()),
    whatsapp: z.string().trim().regex(/^(?:\+62|62|0)8\d{7,12}$/, "Gunakan nomor WhatsApp Indonesia yang valid."),
  }).strict(),
  consent: z.literal(true),
}).strict().superRefine((data, ctx) => {
  if (new Set(data.items.map((item) => item.productId)).size !== data.items.length) {
    ctx.addIssue({ code: "custom", message: "Kategori tiket tidak boleh berulang." });
  }
  if (data.items.reduce((sum, item) => sum + item.quantity, 0) > 20) {
    ctx.addIssue({ code: "custom", message: "Maksimal 20 tiket per pesanan. Hubungi tim untuk rombongan." });
  }
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export const orderNumberSchema = z.string().regex(/^LU-[a-f0-9]{24}$/);

export const notificationSchema = z.object({
  order_id: orderNumberSchema,
  status_code: z.string().regex(/^\d{3}$/),
  gross_amount: z.string().regex(/^\d{1,10}(?:\.00)?$/),
  signature_key: z.string().regex(/^[a-fA-F0-9]{128}$/),
});

export const providerStatusSchema = z.object({
  order_id: orderNumberSchema,
  transaction_id: z.string().min(1).max(100),
  status_code: z.string().regex(/^\d{3}$/),
  gross_amount: z.string().regex(/^\d{1,10}(?:\.00)?$/),
  transaction_status: z.enum(["pending", "authorize", "capture", "settlement", "deny", "cancel", "expire", "failure", "refund", "partial_refund", "chargeback", "partial_chargeback"]),
  fraud_status: z.enum(["accept", "challenge", "deny"]).optional(),
  currency: z.literal("IDR").optional(),
});

export type ProviderStatus = z.infer<typeof providerStatusSchema>;
