import { z } from "zod";

export const categories = [
  { slug: "kunjungan", name: "Kunjungan kawasan", description: "Susun rencana menikmati suasana alam dan kebersamaan di Lembur Udjo.", image: "/Hero.ecoland.jpg", type: ["ADULT", "CHILD"], example: true },
  { slug: "budaya", name: "Pengalaman budaya", description: "Rencanakan waktu untuk mengenal angklung dan cerita budaya Sunda.", image: "/Pertunjukanluar.webp", type: ["PERFORMANCE_PACKAGE"], example: true },
  { slug: "rombongan", name: "Kunjungan rombongan", description: "Mulai percakapan tentang kunjungan bersama sekolah, komunitas, atau keluarga besar.", image: "/angklung.webp", type: ["GROUP"], example: true },
] as const;
export const categoryBySlug = (slug: string) => categories.find(category => category.slug === slug);
export function safeContinue(value: unknown) {
  return typeof value === "string" && /^\/(?:checkout|keranjang|akun|tiket-saya|pesanan(?:\/LU-[a-f0-9]{24})?)$/.test(value) ? value : "/akun";
}
export const cartLineSchema = z.object({
  id: z.string().min(1).max(120), category: z.enum(["kunjungan", "budaya", "rombongan"]),
  productId: z.string().max(100).optional(), scheduleId: z.string().max(100).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => { const date = new Date(`${value}T00:00:00Z`); return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10) === value; }), session: z.string().min(1).max(80),
  quantity: z.number().int().min(1).max(20), example: z.boolean(),
}).strict();
export const cartSchema = z.array(cartLineSchema).max(10).refine(lines => lines.reduce((sum, line) => sum + line.quantity, 0) <= 20 && new Set(lines.map(line => line.id)).size === lines.length);
export type CartLine = z.infer<typeof cartLineSchema>;
export const faqItems = [
  { question: "Apakah tiket sudah bisa dibeli?", answer: "Belum. Portal dapat dijelajahi dan keranjang rencana dapat disusun, tetapi pembayaran tetap nonaktif sampai kategori, harga, jadwal, dan konfigurasi pembayaran resmi siap." },
  { question: "Apakah data contoh merupakan harga dan jadwal resmi?", answer: "Bukan. Kategori bertanda contoh dan preferensi sesi hanya membantu melihat alur portal. Rencana dalam keranjang belum menjadi reservasi atau jaminan kuota." },
  { question: "Mengapa perlu membuat akun?", answer: "Akun digunakan untuk menyimpan akses ke pesanan dan tiket yang nantinya diterbitkan. Satu akun hanya dapat melihat pesanan miliknya sendiri." },
  { question: "Berapa lama batas pembayaran?", answer: "Saat penjualan telah dibuka, reservasi pesanan berlaku 15 menit. Batas waktunya ditampilkan pada halaman status pesanan. Keranjang rencana saat ini tidak menahan kuota." },
  { question: "Bagaimana dengan kunjungan rombongan?", answer: "Hubungi tim reservasi melalui WhatsApp untuk mendiskusikan kebutuhan kunjungan. Ketentuan dan harga rombongan resmi masih menunggu konfirmasi." },
  { question: "Saya lupa kata sandi, bagaimana caranya?", answer: "Hubungi tim bantuan melalui WhatsApp resmi. Pemulihan kata sandi otomatis melalui email belum tersedia; jangan membagikan kata sandi kepada siapa pun." },
];
