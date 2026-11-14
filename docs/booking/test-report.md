> **Catatan historis:** hasil di bawah berasal dari iterasi sebelumnya, bukan eksekusi terbaru. Gunakan [verifikasi 14 November 2026](phase-2-completion-2026-11-14.md). Laporan Phase 2 lama memakai webhook/provider terkontrol; itu bukan bukti payment end-to-end nyata. Run nyata terbaru, status domain/OAuth, dan advisory berada pada laporan baru.

# Hasil pengujian LUP Booking — 13 November 2026

**Implementasi lokal teruji; demo end-to-end publik belum dinyatakan siap.** Tidak ada push, deploy, aktivasi harga/jadwal resmi, atau migrasi pada database bersama.

## Hasil yang benar-benar dijalankan

| Pemeriksaan | Hasil aktual | Bukti |
| --- | --- | --- |
| `npm run test:ticketing` | **44/44 PASS**, PostgreSQL lokal disposable; mencakup concurrency, kuota, harga, expiry, status, signature/replay, akun/ownership, reset, tiket dan check-in | [TAP](evidence/integration.tap), [JSON](evidence/integration-results.json) |
| `npm run test:booking-browser` | **25/25 PASS**, Chromium, aplikasi Next.js nyata dengan PostgreSQL lokal; 1440×1000, 768×1024, 390×844 | [JSON](evidence/browser-results.json) |
| `node --test tests/hero-video.test.mjs` | **13/13 PASS**, regresi media/hero yang sudah ada | [Log](evidence/hero-regression.log) |
| `npx tsc --noEmit` | PASS | Proses dijalankan; TypeScript juga lulus di build akhir |
| `npm run lint` | PASS, **0 error / 22 warning lama** | Warning berada di media/homepage dan migrasi lama; folder output QA dikecualikan |
| `npm run build -- --webpack` | **PASS**, Next.js **16.4.6**; compile, TypeScript, page data dan prerender selesai; exit 0 | [Build log](evidence/build.log) |
| `git diff --check` | PASS | Tidak ada error whitespace |
| Pemindaian nilai secret environment di berkas perubahan | Tidak ditemukan nilai kredensial environment tersalin | 107 path perubahan diperiksa; binary dikecualikan dari perbandingan teks; bukan audit seluruh histori Git |
| Gateway smoke nyata | **PASS pembuatan Snap Sandbox**, metode pembayaran belum dipilih; tidak ada reservasi DB pada smoke ini | [JSON](evidence/midtrans-sandbox-smoke.json) |
| Dependency audit | **0 critical**, **7 high**, 13 moderate, 6 low | [Audit](evidence/dependency-audit.json), [penjelasan dan batas](security-review.md) |

[Matriks test-case lengkap](test-matrix.md) berisi ID, fitur/input/skenario, hasil yang diharapkan, aktual, status, dan bukti. Tidak menandai pengujian eksternal yang belum dilakukan sebagai PASS.

## Yang dibuktikan oleh browser

- Pilihan awal melewati tanggal habis dan memilih yang masih tersedia.
- Keyboard berpindah ke hari tersedia berikutnya; harga dan sesi berubah sesuai DB.
- Tanggal tanpa sesi tidak mendapat harga karangan; kalender menolak tanggal habis.
- Katalog dimuat ulang dari backend ketika produk/tanggal dipilih; booking menunggu loading selesai.
- Tanggal, scheduleId dan jumlah tersimpan di keranjang; checkout memakai harga sesi terbaru.
- Submit checkout melalui endpoint aplikasi menyimpan order PENDING milik akun dengan total yang benar. Key gateway pada server QA sengaja **dummy**, sehingga tidak dianggap pembayaran nyata.
- Status paid dan penerbitan tiket pada QA browser dilakukan melalui harness dengan provider status simulasi; tidak ada endpoint payment bypass yang ditambahkan ke aplikasi.
- Pemilik akun menerima PDF; browser lain mendapat 404.
- STAFF tidak dapat mengakses API katalog/monitor admin (401); ADMIN dapat (200).
- QR endpoint check-in pertama 200, entri kedua dengan kode manual 409.
- Register email 201, logout 200, sesi menjadi null.
- Modal login ditutup dengan Escape; error dan empty katalog menonaktifkan pemesanan.
- Tidak ada overflow halaman setelah navigasi keyboard, kalender, dan perubahan keranjang pada ketiga viewport. Ponsel/tablet adalah emulasi browser, bukan perangkat fisik.

## Bukti visual

- [Desktop](evidence/date-selector-desktop.png)
- [Tablet](evidence/date-selector-tablet.png)
- [Mobile](evidence/date-selector-mobile.png)
- [PDF fixture Sandbox](evidence/ticket-fixture-sandbox.pdf)

Screenshot memakai program dan nominal fixture yang hanya ada pada cluster lokal tes. Ini bukan paket atau harga resmi LUP. PDF dirender melalui Poppler dan diperiksa secara visual; teks, identitas, referensi dan QR terbaca/tidak terpotong. Kamera fisik belum diuji.

## Temuan selama iterasi dan koreksi

1. Sandbox awal memblokir shared memory PostgreSQL, DNS/font dan port subprocess Turbopack. Tes dijalankan dengan izin yang sesuai; Webpack dipakai untuk build produksi. Kegagalan awal Turbopack tidak dilabeli PASS.
2. Test lama mengasumsikan passwordHash selalu terisi; disesuaikan karena akun Google tidak menyimpan sandi lokal.
3. Regex redirect akun salah escaping; ditemukan oleh TypeScript/tes, diperbaiki, lalu suite lulus.
4. Inspeksi screenshot menemukan overflow mobile setelah keyboard yang tidak terdeteksi cek awal. Diperbaiki dengan grid minmax dan scroll lokal; assertion sesudah interaksi ditambahkan.
5. Dev QA dan build sempat berbagi generated types; tsconfig/distDir QA dipisahkan. Pengujian browser dan build final dijalankan berurutan.
6. Chromium awal tidak cocok dengan versi Playwright; browser yang sesuai diunduh. Cold compilation memerlukan timeout navigasi lebih panjang.
7. Setelah refetch tanggal ditambahkan, tes harus menunggu loading backend selesai sebelum interaksi berikutnya. Harness disesuaikan lalu 25 kasus lulus kembali.
8. Npm menemukan dua critical pada dependensi lama. Next.js/eslint-config-next 16.4.6, DOMPurify 3.4.17 dan Undici 7.30.2 diterapkan; audit final nol critical, tetapi high belum nol. Tidak menggunakan `audit fix --force` atau mengubah Prisma menjadi major 7.

## Belum dibuktikan

- Google login/logout melalui Google nyata: client ID/secret belum ada di environment lokal; perlu console redirect URI yang sesuai.
- Pengiriman dan penerimaan email reset nyata: provider lokal belum dikonfigurasi. Token hashing/expiry/sekali pakai/revokasi telah diuji terpisah.
- Pembayaran sukses/pending/gagal/expire serta webhook HTTPS pada transaksi reservasi **nyata di Midtrans Sandbox**. Smoke hanya membuktikan initiation dan akses Get Status sebelum metode dipilih; status lifecycle pada suite memakai provider stub.
- DNS/TLS/routing `booking.lemburudjoparahyangan.com`, callback OAuth dan POST webhook baru. Domain lama memberi HTTPS 200; domain baru belum ter-resolve dari lingkungan audit.
- Kamera ponsel fisik, proses restore backup, migrasi pada salinan produksi, deployment/restart dan UAT oleh pihak bisnis.
- Penutupan tujuh advisory high yang tersisa pada rantai Prisma/Payload; lihat security-review. Tidak ada klaim production security selesai.

Runbook: [domain migration](domain-migration.md). Penerimaan: [checklist UAT](uat-checklist.md). Dokumen RAD: [desain](rad-design.md).
