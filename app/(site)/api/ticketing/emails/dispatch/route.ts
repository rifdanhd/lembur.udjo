import { NextRequest } from 'next/server';
import { allowTicketHost, BookingError, equalSecret, digest } from '@/lib/ticketing/security';
import { failure, json } from '@/lib/ticketing/http';
import { ticketingDb } from '@/lib/ticketing/db';
import { dispatchEmails } from '@/lib/ticketing/email-outbox';
export async function POST(request: NextRequest) {
  try {
    allowTicketHost(request);
    const expected = process.env.TICKETING_CRON_SECRET || '';
    const actual = request.headers.get('authorization')?.replace(/^Bearer /, '') || '';
    if (expected.length < 32 || !equalSecret(digest(actual), digest(expected))) throw new BookingError('UNAUTHORIZED', 401);
    return json(await dispatchEmails(ticketingDb()));
  } catch (error) { return failure(error); }
}
