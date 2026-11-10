# Fondasi pemesanan online — Fase 1

Target pengunjung: `https://ticket.lemburudjoparahyangan.com`.
Host tersebut sudah me-rewrite `/` ke `/ticket`; akses CRM/Payload tetap ditutup.
Halaman pengunjung masih melayani reservasi WhatsApp sampai checkout siap.

Kelanjutan 6 November 2026: lihat [implementasi dan verifikasi Fase 2](./ticketing-checkout.md).

## Hasil verifikasi 5 November 2026

- Koneksi langsung ke database berhasil; identitasnya sama dengan database CMS.
- Backup lokal format custom berhasil dibuat dan daftar isi archive dapat dibaca.
  Pemulihan backup belum diuji.
- Simulasi migrasi pada schema sementara lulus dan seluruh perubahan uji di-rollback.
- Migrasi `20261105090000_ticketing_foundation` berhasil diterapkan ke schema `ticketing`.
- Seed dijalankan dua kali; pemeriksaan akhir menemukan 10 tabel, 4 produk, dan
  9 sesi. Produk aktif dan sesi aktif masing-masing 0.
- Enam tes routing subdomain lulus. Validasi schema Prisma, TypeScript, dan lint
  lulus; lint proyek masih memiliki 23 peringatan lama.
- Kode belum di-push/deploy ke VPS. Checkout, pembayaran, serta DNS/TLS dan
  tampilan browser pada domain publik belum diuji pada tahap ini.

## Database

Gunakan database PostgreSQL yang sama dengan Payload, dengan schema `ticketing`
untuk memisahkan tabel dan riwayat migrasi Prisma dari schema `public` milik CMS.
Script membandingkan identitas database aplikasi dan koneksi langsung sebelum
migrasi. `.env.local` dibaca melalui loader Next.js; koneksi tidak dicetak.

```sh
node scripts/verify-ticketing-migration.mjs
npm run db:migrate
npm run db:seed
npm run db:check
```

Sebelum migrasi pada database bersama, ambil backup yang dapat dipulihkan dan
uji migrasi pada branch database. Script verifikasi yang tersedia juga dapat
menguji SQL di schema sementara dalam satu transaksi yang selalu di-rollback;
ini memeriksa eksekusi SQL dan foreign key, bukan pengganti pengujian checkout.

`db:migrate` memakai **migrate deploy**, bukan `migrate dev` atau reset. Hanya
migrasi SQL yang tercatat di repo yang diterapkan. Jangan menjalankan Prisma
langsung dengan URL schema `public`: tabel CMS bukan dikelola oleh Prisma.
Untuk akses Prisma di kode aplikasi berikutnya, gunakan URL pooled yang sama
dengan parameter `schema=ticketing`; URL direct hanya untuk administrasi.

Seed membuat empat contoh produk dan sembilan contoh sesi, semuanya tidak aktif.
Harga contoh bukan harga resmi. Menjalankan ulang seed mempertahankan harga,
status aktif, kuota, reserved, dan sold yang sudah tersimpan. Tanggal contoh
dihitung relatif terhadap hari eksekusi; seed pada hari berbeda dapat menambah
sesi contoh baru yang tetap tidak aktif.

## Batas fase

Fase ini menyiapkan tabel User, Product, Schedule, Customer, Order, OrderItem,
Payment, Ticket, CheckIn, dan AuditLog. Tidak ada endpoint penjualan baru atau
penerimaan pembayaran pada tahap ini.

Sebelum fase berikutnya, konfirmasikan harga/kategori, jadwal dan kuota resmi,
aturan anak/rombongan, serta akun payment gateway sandbox. Lanjutkan sesuai
persetujuan per fase. Checkout berikutnya harus menghitung harga di server,
mengunci kuota secara transaksional, membatasi reservasi 15 menit, memvalidasi
input dan transisi status, membatasi permintaan, serta memverifikasi signature
dan idempotensi webhook. Uji pesanan bersamaan dan webhook replay sebelum live.

Deploy kode ke VPS, DNS/TLS, dan uji browser pada domain publik merupakan
verifikasi terpisah dari keberhasilan migrasi dan seed.
