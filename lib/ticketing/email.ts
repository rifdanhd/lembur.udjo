import { BookingError } from './security';

export type EmailMessage = { to: string; subject: string; text: string };
export interface EmailTransport {
  send(message: EmailMessage, idempotencyKey: string): Promise<{ id: string }>;
}
export function configuredEmailTransport(): EmailTransport | null {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) return null;
  return {
    async send(message, idempotencyKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST', redirect: 'error', signal: AbortSignal.timeout(10000),
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
        body: JSON.stringify({ from, to: [message.to], subject: message.subject, text: message.text }),
      });
      if (!response.ok) throw new BookingError('EMAIL_DELIVERY_FAILED', 502);
      const body = await response.json();
      if (typeof body.id !== 'string') throw new BookingError('EMAIL_DELIVERY_FAILED', 502);
      return { id: body.id };
    },
  };
}
