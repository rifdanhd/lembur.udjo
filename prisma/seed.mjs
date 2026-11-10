import { PrismaClient, ProductType } from "@prisma/client";

if (!process.env.DATABASE_URL || new URL(process.env.DATABASE_URL).searchParams.get("schema") !== "ticketing") {
  throw new Error("Jalankan npm run db:seed agar data contoh hanya masuk ke schema ticketing.");
}

const prisma = new PrismaClient();

const products = [
  { name: "Tiket Dewasa", slug: "tiket-dewasa", type: ProductType.ADULT, price: 75000, description: "Akses kunjungan budaya untuk satu orang dewasa." },
  { name: "Tiket Anak", slug: "tiket-anak", type: ProductType.CHILD, price: 45000, description: "Akses kunjungan budaya untuk satu anak." },
  { name: "Paket Pertunjukan", slug: "paket-pertunjukan", type: ProductType.PERFORMANCE_PACKAGE, price: 125000, description: "Kunjungan dan pengalaman pertunjukan budaya." },
  { name: "Paket Rombongan", slug: "paket-rombongan", type: ProductType.GROUP, price: 60000, description: "Harga khusus per orang untuk rombongan." },
];

const dateOnly = (daysFromToday) => {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + daysFromToday);
  return date;
};

try {
  for (const product of products) {
    // Example prices must not open sales or overwrite staff-managed prices.
    await prisma.product.upsert({ where: { slug: product.slug }, update: {}, create: { ...product, active: false } });
  }

  for (const days of [1, 2, 3]) {
    for (const session of ["09:00", "13:00", "15:30"]) {
      await prisma.schedule.upsert({
        where: { date_session: { date: dateOnly(days), session } },
        update: {},
        create: { date: dateOnly(days), session, capacity: 100, active: false },
      });
    }
  }

  console.log(`Seed selesai: ${products.length} contoh produk dan 9 contoh sesi (data baru tidak aktif; data lama dipertahankan).`);
} finally {
  await prisma.$disconnect();
}
