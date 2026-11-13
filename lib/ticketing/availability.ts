import type { Catalog } from "./types";

export function jakartaDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const part = (key: string) => parts.find(item => item.type === key)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
export function pricedSessions(catalog: Catalog, productId: string, date?: string) {
  const product = catalog.products.find(item => item.id === productId);
  if (!product) return [];
  return catalog.schedules.flatMap(schedule => {
    if (date && schedule.date !== date) return [];
    const offer = product.schedulePrices?.find(price => price.scheduleId === schedule.id && price.active);
    if (product.schedulePrices && !offer) return [];
    return [{ ...schedule, price: offer?.price ?? product.price }];
  });
}
export function selectedPrice(catalog: Catalog, productId: string, scheduleId: string) {
  return pricedSessions(catalog, productId).find(item => item.id === scheduleId)?.price ?? null;
}
export type BookingDate = { date: string; price: number | null; available: number; status: "available" | "sold_out" | "unavailable" };
export function bookingDates(catalog: Catalog, productId: string, today = jakartaDate()): BookingDate[] {
  const sessions = pricedSessions(catalog, productId).filter(item => item.date >= today);
  const first = Date.parse(`${today}T00:00:00Z`);
  const last = Math.max(first + 13 * 86_400_000, ...sessions.map(item => Date.parse(`${item.date}T00:00:00Z`)));
  // The calendar never synthesizes prices for dates with no configured session.
  const count = Math.min(732, Math.floor((last - first) / 86_400_000) + 1);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(first + index * 86_400_000).toISOString().slice(0, 10);
    const day = sessions.filter(item => item.date === date);
    const available = day.reduce((sum, item) => sum + item.available, 0);
    const priced = day.filter(item => item.available > 0);
    return { date, price: day.length ? Math.min(...(priced.length ? priced : day).map(item => item.price)) : null, available,
      status: !day.length ? "unavailable" : available > 0 ? "available" : "sold_out" };
  });
}
