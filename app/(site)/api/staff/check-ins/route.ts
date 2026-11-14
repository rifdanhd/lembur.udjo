import { NextRequest } from 'next/server';
import { isTicketAdmin } from '@/lib/ticketing/admin-access';
import { unauthorized } from '@/lib/crm/auth';
import { failure, json } from '@/lib/ticketing/http';
import { ticketingDb } from '@/lib/ticketing/db';
import { checkInHistory } from '@/lib/ticketing/check-in-history';
export async function GET(request: NextRequest) {
  try {
    if (!(await isTicketAdmin())) return unauthorized();
    return json({ checkIns: await checkInHistory(ticketingDb(), request.nextUrl.searchParams.get('orderNumber') || undefined), sandbox: true });
  } catch (error) { return failure(error); }
}
