export const WEBSITE_URL = "https://lemburudjoparahyangan.com";
export const KARIER_URL = "https://karier.lemburudjoparahyangan.co.id";
export const TICKET_URL = "https://ticket.lemburudjoparahyangan.com";
export const BOOKING_URL = "https://booking.lemburudjoparahyangan.com";
export const APP_URL = "https://app.lemburudjoparahyangan.com";
export const RESERVATION_URL =
  "https://wa.me/6281219279765?text=Halo%20Lembur%20Udjo,%20saya%20ingin%20pesan%20tiket";

export type Site = "website" | "karier" | "ticket" | "app" | "preview";

export function siteForHost(host: string): Site {
  const hostname = host.toLowerCase().split(":")[0].replace(/\.$/, "");
  if (["karier.lemburudjoparahyangan.co.id", "karier.lemburudjoparahyangan.com", "karier.localhost"].includes(hostname)) return "karier";
  if (["app.lemburudjoparahyangan.com", "app.localhost"].includes(hostname)) return "app";
  if (["ticket.lemburudjoparahyangan.com", "ticket.localhost", "booking.lemburudjoparahyangan.com", "booking.localhost"].includes(hostname)) return "ticket";
  if (["lemburudjoparahyangan.com", "www.lemburudjoparahyangan.com"].includes(hostname)) return "website";
  return "preview";
}
