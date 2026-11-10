export type Catalog = {
  state: "available" | "not_open" | "unavailable";
  sandbox: true;
  checkoutEnabled: boolean;
  products: { id: string; name: string; description: string | null; price: number; type?: string }[];
  schedules: { id: string; date: string; session: string; available: number }[];
};

export type Receipt = {
  orderNumber: string;
  status: string;
  totalAmount: number;
  expiresAt: string;
  checkoutUrl: string | null;
  items: { name: string; quantity: number; total: number; date: string; session: string }[];
  tickets: { code: string; status: string }[];
};

export const rupiah = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
