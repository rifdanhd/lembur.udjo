# LUP Booking — development handoff

Branch: `feat/lup-booking-platform`. Repositori aplikasi yang benar telah diverifikasi dari remote dan source ticketing. Perubahan awal milik pengguna tetap dipertahankan. Tidak ada push, deploy, atau migrasi database bersama.

## Status terbaru — 14 November 2026

[Laporan penyelesaian Phase 2](phase-2-completion-2026-11-14.md) dan [matriks E2E-01–20](phase-2/e2e-matrix.md) adalah acuan terbaru. Pembayaran Sandbox nyata + notifikasi HTTPS + PAID + PDF + one-time check-in berhasil, 15/15 pemeriksaan. Integrasi 50/50; browser 32/32; hero/media 13/13. Advisory critical/high 0/0; moderate/low masih ada. Google authorization page terbuka tetapi login belum selesai; email nyata, HTTPS booking, kamera fisik, dan UAT stakeholder belum terverifikasi. Tidak ada deployment atau migrasi shared DB.

## Status baseline historis per fase master prompt

| Fase | Implementasi | Pengujian dan sisa pekerjaan |
| --- | --- | --- |
| 1 Audit | Framework/routing/auth/schema/Midtrans/admin/hosting dipetakan | Baseline 32 tes; laporan audit tersedia |
| 2 Domain | booking alias, origin, canonical portal, callback Snap, cutover GET/HEAD opt-in | Routing lokal diuji; ticket HTTPS 200; booking belum ter-resolve; DNS/TLS/console dan webhook baru belum diuji publik |
| 3 Desain | Token portal LUP dipertahankan; foto LUP; selector responsif; modal dua kolom | Screenshot dan QA 1440/768/390 px; bukan uji ponsel fisik |
| 4 Akun | Email register/login/logout, profil, account/bookings/tickets, OIDC Google, reset email | Ownership dan sesi diuji; Google/email delivery nyata belum diuji karena credentials/provider belum tersedia |
| 5 Katalog | Kategori/program/foto/ketentuan dari DB; admin kategori, sesi, kuota, harga per sesi | Data fixture lokal; tidak ada paket/harga resmi diaktifkan di DB bersama |
| 6 Reservasi | Keranjang tanggal/sesi, checkout server, harga ulang, idempotensi, lock kapasitas, expiry | Suite PostgreSQL dan submit HTTP browser; kuota tetap bersama per sesi sesuai model lama |
| 7 Midtrans | Snap Sandbox dipertahankan; signature + GET status, nominal dan transisi idempotent | Satu pembuatan Snap Sandbox nyata sukses; paid lifecycle/replay memakai provider stub; webhook publik belum terbukti |
| 8 E-ticket | Tiket item-bound, PDF+QR privat, check-in QR/manual atomik | PDF dirender/diperiksa; endpoint ownership dan duplicate check-in diuji; kamera fisik belum diuji |
| 9 Admin/staf | Panel katalog, monitoring, rekonsiliasi/expiry lama, akun individual ADMIN/STAFF | RBAC HTTP diuji; admin CRM lama dipertahankan; bukan migrasi semua akun CRM ke identitas individual |
| 10 Database | Tiga migrasi baru additive dan indeks/constraints | Berhasil diterapkan berulang ke DB lokal disposable; belum pada salinan/DB produksi |
| 11 Testing | Suite integrasi + QA browser + gateway smoke | Hasil lengkap di test-report dan evidence; tidak menyamakan stub, browser dan layanan publik |
| 12 RAD | Kebutuhan, desain, UML/ERD, spesifikasi DB/status, wireframe, iterasi, matriks dan checklist UAT | Berdasarkan source dan pekerjaan nyata; UAT/interview tidak direkayasa; sumber PlantUML belum dievaluasi oleh penguji akademik |
| 13 Prioritas | Audit → backend/harga/checkout → tiket/auth/admin/UI → domain/docs | Cutover publik tetap tertunda sampai infrastruktur dan pembayaran HTTPS diverifikasi |

## Berkas acuan

- [Audit awal](audit-2026-11-13.md)
- [Desain dan RAD](rad-design.md)
- [Runbook migrasi domain](domain-migration.md)
- [Hasil dan matriks tes](test-report.md)
- [Checklist UAT yang belum diisi](uat-checklist.md)
- [Review keamanan dan advisory yang tersisa](security-review.md)
- [Evidence](evidence/)

## Menjalankan pemeriksaan

```sh
npm ci
npm run db:generate
npm run test:ticketing
npm run test:booking-browser
npx tsc --noEmit
npm run lint
npm run build -- --webpack
```

Tes database memerlukan PostgreSQL lokal (default `/usr/local/opt/postgresql@18/bin`, atau set `TICKETING_TEST_PG_BIN`). Tes browser memerlukan `npx playwright install chromium`. Kedua runner membuat cluster/database lokal sendiri, mengabaikan URL DB aplikasi dan menghentikan proses miliknya di akhir. Jangan menjalankan migrasi/reset manual pada database bersama untuk menjalankan tes. Build browser mempunyai distDir dan tsconfig terpisah; jalankan QA browser lalu build produksi agar tidak berebut resource.

`node scripts/check-midtrans-sandbox.mjs` adalah smoke test **opt-in** yang membuat satu transaksi Sandbox fixture Rp10.000 tanpa menyentuh DB. Bukan harga resmi, bukan penjualan nyata, dan tidak membuktikan pembayaran berhasil/webhook. Jangan menjalankannya otomatis pada setiap test/build.

Sebelum deploy: backup dan uji pada salinan database, `npm run db:migrate` dengan URL direct yang sesuai, build/restart service yang benar, lalu cek runtime authenticated dan HTTPS. Isi harga/jadwal resmi melalui admin setelah mendapat keputusan bisnis. Pertahankan `MIDTRANS_IS_PRODUCTION=false` dan redirect domain false sampai target benar-benar lolos pengujian.
