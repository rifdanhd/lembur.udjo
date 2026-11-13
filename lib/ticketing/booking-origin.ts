import { BookingError } from "./security";
import { TICKET_URL } from "../site-domains";
export function bookingOrigin() {
  const url = new URL(process.env.BOOKING_PUBLIC_URL || TICKET_URL);
  const allowed = ["ticket.lemburudjoparahyangan.com", "booking.lemburudjoparahyangan.com"];
  const local = process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1", "ticket.localhost", "booking.localhost"].includes(url.hostname);
  if ((!local && (url.protocol !== "https:" || !allowed.includes(url.hostname) || url.port)) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new BookingError("CONFIGURATION_INVALID", 503);
  return url.origin;
}
