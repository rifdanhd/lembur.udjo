import { configuredEmailTransport } from "@/lib/ticketing/email";
import { digest } from "@/lib/ticketing/security";
import { NextRequest } from "next/server";
import { z } from "zod";
import { createReset, emailResetEnabled, resetPassword } from "@/lib/ticketing/password-reset";
import { bookingOrigin } from "@/lib/ticketing/booking-origin";
import { ticketingDb } from "@/lib/ticketing/db";
import { boundedJson, BookingError, requireSameOrigin } from "@/lib/ticketing/security";
import { json, failure, limited } from "@/lib/ticketing/http";
import { rateLimit } from "@/lib/ticketing/orders";
const schema = z.union([z.object({ email: z.email().max(254).transform(value => value.toLowerCase()) }).strict(), z.object({ token: z.string().regex(/^[a-f0-9]{64}$/), password: z.string().min(12).max(128) }).strict()]);
export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request); await limited(request, "password-reset", 10);
    const input = schema.safeParse(await boundedJson(request, 4096));
    if (!input.success) throw new BookingError("INVALID_INPUT");
    const db = ticketingDb();
    if ("token" in input.data) {
      await resetPassword(db, input.data.token, input.data.password);
      return json({ message: "Kata sandi diperbarui. Silakan masuk kembali." });
    }
    if (!emailResetEnabled()) throw new BookingError("EMAIL_UNAVAILABLE", 503);
    await rateLimit(db, "reset-email", input.data.email, 3, 3600000);
    const token = await createReset(db, input.data.email);
    if (token) {
      try {
        await configuredEmailTransport()!.send({ to: input.data.email, subject: "Atur ulang kata sandi akun LUP", text: `Buka tautan ini untuk mengatur ulang kata sandi. Berlaku 30 menit dan hanya sekali pakai.\n${bookingOrigin()}/atur-ulang-sandi#${token}\nAbaikan bila Anda tidak meminta perubahan ini.` }, digest(`reset:${token}`));
      } catch { console.error("ticketing: reset email delivery failed"); }
    }
    return json({ message: "Jika email terdaftar dengan kata sandi, tautan pemulihan akan dikirim. Periksa kotak masuk dan folder spam." });
  } catch (error) { return failure(error); }
}
