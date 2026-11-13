import type { Catalog } from "./types";
import { z } from "zod";

export const categories = [
  { slug: "kunjungan", name: "Kunjungan kawasan", description: "Susun rencana menikmati suasana alam dan kebersamaan di Lembur Udjo.", image: "/Hero.ecoland.jpg", type: ["ADULT", "CHILD"], example: true },
  { slug: "budaya", name: "Pengalaman budaya", description: "Rencanakan waktu untuk mengenal angklung dan cerita budaya Sunda.", image: "/Pertunjukanluar.webp", type: ["PERFORMANCE_PACKAGE"], example: true },
  { slug: "rombongan", name: "Kunjungan rombongan", description: "Mulai percakapan tentang kunjungan bersama sekolah, komunitas, atau keluarga besar.", image: "/angklung.webp", type: ["GROUP"], example: true },
] as const;
export const categoryBySlug = (slug: string) => categories.find(category => category.slug === slug);
export function safeContinue(value: unknown) {
  return typeof value === "string" && /^\/(?:account(?:\/profile|\/tickets|\/bookings(?:\/LU-[a-f0-9]{24})?)?|checkout|keranjang|akun|tiket-saya|pesanan(?:\/LU-[a-f0-9]{24})?)$/.test(value) ? value : "/akun";
}
export const cartLineSchema = z.object({
  id: z.string().min(1).max(120), category: z.string().regex(/^[a-z0-9-]{1,100}$/), categoryName: z.string().max(100).optional(),
  productId: z.string().max(100).optional(), scheduleId: z.string().max(100).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => { const date = new Date(`${value}T00:00:00Z`); return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10) === value; }), session: z.string().min(1).max(80),
  quantity: z.number().int().min(1).max(20), example: z.boolean(),
}).strict();
export const cartSchema = z.array(cartLineSchema).max(10).refine(lines => lines.reduce((sum, line) => sum + line.quantity, 0) <= 20 && new Set(lines.map(line => line.id)).size === lines.length);
export type CartLine = z.infer<typeof cartLineSchema>;
export const faqItems = [
  { question: "Apakah tiket sudah bisa dibeli?", answer: "Ketersediaan program, harga, dan sesi mengikuti katalog yang dibuka tim. Pembayaran pada platform ini memakai Midtrans Sandbox untuk simulasi; tiket Sandbox tidak berlaku masuk kawasan." },
  { question: "Apakah data contoh merupakan harga dan jadwal resmi?", answer: "Bukan. Kategori bertanda contoh dan preferensi sesi hanya membantu melihat alur portal. Rencana dalam keranjang belum menjadi reservasi atau jaminan kuota." },
  { question: "Mengapa perlu membuat akun?", answer: "Akun digunakan untuk menyimpan akses ke pesanan dan tiket yang diterbitkan. Satu akun hanya dapat melihat pesanan miliknya sendiri." },
  { question: "Berapa lama batas pembayaran?", answer: "Saat penjualan telah dibuka, reservasi pesanan berlaku 15 menit. Batas waktunya ditampilkan pada halaman status pesanan. Keranjang rencana saat ini tidak menahan kuota." },
  { question: "Bagaimana dengan kunjungan rombongan?", answer: "Hubungi tim reservasi melalui WhatsApp untuk mendiskusikan kebutuhan kunjungan. Ketentuan dan harga rombongan resmi masih menunggu konfirmasi." },
  { question: "Saya lupa kata sandi, bagaimana caranya?", answer: "Gunakan halaman Lupa kata sandi bila layanan email telah tersedia. Jika belum tersedia, hubungi tim bantuan resmi. Jangan membagikan kata sandi kepada siapa pun." },
];

export type PortalCategory = { id?: string; slug: string; name: string; description: string; image: string; type: readonly string[]; example: boolean };
export function catalogCategories(catalog: Catalog): PortalCategory[] {
  const configured = (catalog.categories || []).map(category => ({ ...category, type: [] as string[], example: false }));
  const legacy = categories.filter(category => !configured.some(item => item.slug === category.slug) && (!configured.length || catalog.products.some(product => !product.categoryId && (category.type as readonly string[]).includes(product.type || ""))));
  return [...configured, ...legacy];
}
export function categoryProducts(catalog: Catalog, category: PortalCategory) {
  return catalog.products.filter(product => category.id ? product.categoryId === category.id || (!product.categoryId && (categoryBySlug(category.slug)?.type as readonly string[] | undefined)?.includes(product.type || "")) : !product.categoryId && category.type.includes(product.type || ""));
}
