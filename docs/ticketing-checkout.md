# Pemesanan tiket — Fase 2

Target pengunjung: `https://ticket.lemburudjoparahyangan.com`.

Update deployment: lihat [rilis preview pada VPS](./ticketing-deployment.md).
Status build/deploy pada hasil awal di bawah merupakan catatan sebelum rilis itu.

## Perilaku yang disiapkan

- Halaman `/ticket` berisi pilihan sesi WIB, jumlah tiket, data pemesan,
  persetujuan penggunaan data, total, serta ringkasan/status pesanan.
- Produk dan jadwal harus aktif di database sebelum terlihat. Harga contoh
  Fase 1 dan sembilan sesi contoh tetap tidak aktif. Belum ada harga resmi.
- Maksimal 20 tiket per pesanan. Rombongan diarahkan ke WhatsApp reservasi.
- Harga dihitung ulang dari database di server. Kuota dikunci dengan row lock
  PostgreSQL, disimpan sebagai reserved, dan diubah menjadi sold saat pembayaran
  yang tervalidasi diterima. Database juga memiliki CHECK constraint untuk kuota
  dan nilai uang.
- Reservasi berlaku 15 menit. Pesanan kedaluwarsa dilepas saat katalog, pesanan,
  atau pemesanan baru diproses. Endpoint cron tersedia untuk proses terjadwal.
- Request key menghindari pesanan ganda ketika permintaan diulang. Pembuatan
  transaksi gateway diklaim sekali; timeout tidak memicu transaksi baru atau
  pelepasan kuota lebih awal. Kasus ambigu menunggu verifikasi/expiry.
- Pembayaran dibuka melalui halaman hosted Midtrans sandbox. Tidak ada form
  kartu atau penyimpanan data kartu di aplikasi ini.
- Signature webhook SHA-512 diverifikasi, lalu status diambil lagi dari API
  Midtrans. `transaction_status` pada payload notifikasi tidak dipercaya begitu
  saja karena field itu tidak termasuk komponen signature.
- Webhook berulang dan status lama tidak menerbitkan tiket atau mengurangi kuota
  dua kali. Tiket uji diberi kode acak dan label simulasi.
- Pembayaran yang diterima setelah hold berakhir masuk `PAYMENT_REVIEW`; tidak
  ada tiket baru dan tidak mengambil kuota pengunjung lain. Tim perlu memeriksa
  serta menyelesaikan refund/penanganannya secara manual.
- Full refund/chargeback menonaktifkan tiket yang belum digunakan. Partial
  refund masuk peninjauan. Kuota sold tidak otomatis dibuka kembali saat refund.
- Ringkasan pesanan memerlukan cookie HMAC HttpOnly, SameSite=Lax, host-only.
  Nomor pesanan pada URL saja tidak memberi akses. Nama, email, WhatsApp dan
  token QR tidak ikut dikirim dalam API ringkasan. Browser lain memerlukan
  bantuan reservasi; alur pemulihan akses belum dibuat.
- Rate limit disimpan di database agar konsisten lintas worker. Zod memvalidasi
  input, body dibatasi 16 KiB, dan mutasi pengunjung memerlukan Origin yang sama.

## Konfigurasi sandbox

Isi environment server secara privat. Jangan menaruh key asli di chat atau repo.

```dotenv
TICKETING_SANDBOX_ENABLED=true
TICKETING_SECRET=<minimal 32 karakter acak>
TICKETING_CRON_SECRET=<rahasia berbeda, minimal 32 karakter>
MIDTRANS_SERVER_KEY=<Server Key sandbox dari dashboard Midtrans>
MIDTRANS_IS_PRODUCTION=false
TICKETING_TRUST_PROXY=false
```

Checkout tetap tertutup jika flag, key sandbox, atau rahasia cookie belum siap.
Key production ditolak oleh implementasi fase ini. Integrasi hosted redirect
tidak membutuhkan Client Key atau SDK kartu di browser.

Pada Nginx yang menimpa `X-Real-IP` dengan alamat pengunjung tepercaya (seperti
contoh `deploy/nginx-subdomains.conf.example`), `TICKETING_TRUST_PROXY=true`
dapat dipakai untuk limit per IP. Tanpa itu semua pengunjung berbagi bucket
konservatif: katalog 120/menit, buat pesanan 10/menit, refresh status 20/menit.
Email juga dibatasi 5 permintaan checkout per 15 menit. Pastikan port upstream
Next.js tidak terbuka langsung ke publik.

Atur **Payment Notification URL** sandbox ke:

`https://ticket.lemburudjoparahyangan.com/api/ticketing/webhook`

Finish callback mengarah ke root subdomain dengan nomor pesanan. Redirect dari
browser tidak pernah dianggap sebagai bukti pembayaran. Siapkan cron per menit
yang mengirim POST ke `/api/ticketing/expire` dengan Authorization Bearer dari
`TICKETING_CRON_SECRET`; setiap eksekusi memproses maksimal 20 pesanan.
Jangan menyimpan header rahasia pada berkas yang dapat dibaca publik.

Referensi implementasi: [Snap Backend Integration](https://docs.midtrans.com/reference/backend-integration),
[Expiry](https://docs.midtrans.com/reference/json-objects),
[Notifikasi dan verifikasi signature](https://docs.midtrans.com/docs/https-notification-webhooks),
[Get Transaction Status](https://docs.midtrans.com/reference/get-transaction-status).

## Migrasi dan pengujian

Migrasi additive `20261106090000_ticketing_checkout` menambah request hash,
idempotency key hash, metadata hosted checkout, status peninjauan, tabel
RateLimit, dan constraint. Tabel Payload/CMS tidak dikelola migrasi ini.

```sh
npm run db:generate
npm run test:ticketing
npx tsc --noEmit
npm run lint
npm run build
```

Runner tes membuat cluster PostgreSQL lokal sementara, database khusus
`ticketing_phase2_test`, menjalankan dua migrasi, menjalankan tes, lalu mematikan
cluster. Tidak membaca `.env.local` dan menolak URL tes nonlokal. Set
`TICKETING_TEST_PG_BIN` bila binary PostgreSQL berada di lokasi lain.

Hasil 6 November 2026:

- 25/25 tes lulus pada PostgreSQL lokal asli. Meliputi pesanan bersamaan,
  idempotensi, expiry bersamaan, webhook replay bersamaan, signature salah,
  status sukses palsu, nominal salah, late settlement, refund, timeout gateway,
  rate limit bersamaan, validasi input, dan pemisahan host/API.
- Prisma Client berhasil di-generate; TypeScript lulus. Lint tanpa error,
  dengan 23 peringatan lama dari area lain proyek.
- Backup database format custom dibuat dan daftar isi archive diverifikasi;
  pemulihan backup belum diuji. Migrasi Fase 2 berhasil diterapkan ke schema
  `ticketing` pada database bersama. `db:check`: 11 tabel, 4 produk dan 9 sesi,
  nol produk aktif dan nol sesi aktif.
- Build Turbopack gagal karena `Operation not permitted` pada port proses CSS.
  Fallback Webpack juga gagal pada dependensi homepage `@designcodeio/threeui`
  (`asset/inline` dengan generator `filename`). Tidak ada klaim build produksi
  yang berhasil dan masalah homepage tersebut tidak diubah pada fase tiket.
- Pemeriksaan visual belum terverifikasi: koneksi browser tidak tersedia dan
  akses native Chrome timeout. Server dev yang sudah ada tidak dihentikan.
  Pemeriksaan HTTP pada server lokal yang sudah berjalan juga timeout, sehingga
  hasil tes service/logic tidak dinyatakan sebagai bukti runtime browser.
- Pengujian logika gateway memakai provider stub; belum ada transaksi ke layanan
  Midtrans sandbox asli karena Server Key belum dikonfigurasi.
- Belum ada push, deploy VPS, aktivasi penjualan, atau pengujian DNS/TLS domain
  publik pada fase ini.

## Sebelum dibuka

Tentukan kategori/harga, aturan usia dan rombongan, sesi, kuota, dan aturan
pembatalan resmi. Lengkapi key sandbox, uji alur hosted checkout dan webhook asli
melalui URL HTTPS yang dapat diakses Midtrans, tinjau tampilan mobile/desktop,
dan selesaikan build/deploy. Integrasi production, pengiriman tiket lewat email,
QR/check-in staf, layar rekonsiliasi, dan pemulihan akses browser memerlukan
pekerjaan berikutnya; penjualan sungguhan belum diaktifkan.
