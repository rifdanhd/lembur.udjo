# Penyelesaian Phase 2 — 14 November 2026

Repository `rifdanhd/lembur.udjo`, branch `feat/lup-booking-platform`, PT Angklung Udjo Heritage. Baseline sebelum perubahan ini: `08bae20`. Tidak merge, push, deploy, mengubah DNS, beralih Midtrans Production, atau memigrasi database bersama.

## 1. Status keseluruhan

**Alur Sandbox nyata terverifikasi pada infrastruktur uji terisolasi:** pilih tiket/tanggal/sesi → checkout → Snap → simulator bank resmi → webhook HTTPS asli → verifikasi server → PAID → dua e-ticket → unduh PDF → check-in pertama berhasil dan duplikat ditolak. Ini memenuhi alur inti demonstrasi pada lingkungan pengembang. Public end-to-end pada target domain belum selesai.

Laporan lama yang menyebut webhook simulasi sebagai VERIFIED tidak dipakai sebagai bukti pembayaran nyata. Tes lama tidak dihitung sebagai eksekusi baru. Hasil di bawah dijalankan kembali; rincian timestamp ada di evidence JSON/log.

## 2. Midtrans Sandbox nyata

Run `2026-11-13T23:40:19.340Z` (14 November WIB), **15/15 PASS**. Order fixture `LU-9f531d73e0ccd534ac852915`, nominal simulasi Rp20.000 untuk dua tiket. BNI VA dibayar lewat simulator resmi. Backend memeriksa SHA-512, order/amount/transaction reference dan GET status Midtrans sebelum mencatat PAID/SETTLED. Tepat dua tiket diterbitkan.

HTTPS tunnel hanya membuka path webhook acak menuju API lokal, bukan seluruh aplikasi. Satu delivery settlement sengaja dijawab 503; retry asli Midtrans kemudian 200. Tiga replay bersamaan dari body notifikasi asli tetap menghasilkan dua tiket dan satu settlement event; signature yang diubah ditolak 403. Cancel dan expire memakai API resmi serta callback asli; kapasitas dilepas tanpa tiket. Provider deny/failure diuji terkontrol, bukan klaim penolakan bank nyata.

Tidak mengubah notification URL global dashboard. Override per transaksi hanya diizinkan untuk DB localhost dengan flag isolated test; key tetap privat. Tunnel dan DB milik runner dihentikan. [Hasil terstruktur](phase-2/evidence/real-midtrans-delivery.json), [provenance](phase-2/evidence/README.md), [runner](../../scripts/test-midtrans-delivery.mjs).

## 3. OAuth

Implementasi OIDC mempertahankan PKCE/state/nonce, claims terverifikasi, OAuthAttempt sekali pakai, cookie host-only, dan tidak auto-link akun lokal melalui email. Kredensial lokal kini ada. Probe Google membuka authorization page untuk callback `http://localhost:3000/api/ticketing/auth/google/callback`; tidak menemukan error konfigurasi yang dikenal pada halaman itu. **Login, consent, callback exchange, logout Google dan sesi pelanggan nyata belum diselesaikan**, sehingga E2E-03 tetap BLOCKED. Ini juga belum membuktikan registrasi redirect URI target domain. [Probe](phase-2/evidence/google-authorization-probe.json), [panduan owner](phase-2/email-and-owner-configuration.md).

Customer lain tidak dapat mengambil PDF milik pemesan: pengujian registered stranger menghasilkan 404. Logout email dan ownership diuji melalui browser/API.

## 4. Email

Service `EmailTransport`/adapter Resend digunakan bersama oleh reset password dan notifikasi booking. Outbox `EmailDelivery` menyimpan event RESERVATION/PAYMENT/TICKETS dalam transaksi booking, eventKey unik, worker claim/lease atomik, backoff terbatas, provider idempotency key dan expiry delivery window. Network email berjalan di luar webhook/transaksi pembayaran.

Endpoint worker POST `/api/ticketing/emails/dispatch` membutuhkan bearer `TICKETING_CRON_SECRET`. Booking tetap PAID dan PDF tetap dapat diunduh saat transport email sengaja gagal, termasuk pada pembayaran Sandbox nyata. **RESEND_API_KEY dan EMAIL_FROM belum tersedia; tidak ada email sungguhan dikirim/diterima.** Tidak mengklaim verifikasi inbox. Email verification bukan gate kebijakan akun existing. [Konfigurasi dan batas](phase-2/email-and-owner-configuration.md).

## 5. QR dan riwayat check-in

Tiket paid nyata diuji dengan tiga scan payload QR bersamaan: **200/409/409**, tepat satu CheckIn. Kode tidak dikenal ditolak. Manual entry dan RBAC diuji browser. Halaman admin `/admin/tiket/check-in` menampilkan riwayat/filter order, staff/time/source tanpa membocorkan qrToken; STAFF tidak memperoleh history admin. Kamera ponsel fisik **NOT RUN**. PDF dua halaman diunduh pemilik dan halaman pertama dirender/diperiksa: identitas, ref, program, sesi, status dan QR terbaca. [PDF Sandbox](phase-2/evidence/real-paid-tickets.pdf).

## 6. Keamanan migrasi database

Migrasi baru `20261114050000_booking_email_outbox` membuat tabel/index/constraint/FK EmailDelivery saja. Backup custom pg_dump benar-benar direstore ke database kedua berisi legacy fixture (akun/sesi/PAID/items/payments/tickets/check-in). Migrasi diterapkan ke copy; snapshot lama tetap sama, constraint menolak write invalid, migrate deploy kedua idempotent: **3/3 PASS**. Ini populated synthetic copy, **bukan clone produksi**. [Prosedur backup/rollback](phase-2/migration-safety.md), [bukti](phase-2/evidence/migration-copy.json). Shared/production DB tetap tidak disentuh; backup dan clone data aktual memerlukan akses/approval owner.

## 7. Kesiapan domain

A `ticket` dan `booking` sekarang sama-sama `157.10.160.37`. Domain lama HTTPS200, chain valid; domain baru mengembalikan ECONNREFUSED dari lingkungan pengujian. Probe lanjutan langsung ke IP berhasil melakukan handshake TLS tetapi curl menolak hostname mismatch. Sertifikat SAN hanya mencakup `app` dan `ticket`, belum `booking` (ERR_TLS_CERT_ALTNAME_INVALID). Nginx teramati pada domain lama; konfigurasi service/VPS aktif belum diperiksa lewat akses server. Penyebab refusal awal belum dipastikan; mismatch sertifikat adalah blocker tersendiri yang teramati. Tidak memasang redirect webhook. Endpoint target baru, OAuth target, dan cutover belum lulus. [Probe](phase-2/evidence/domain-probes.json), [runbook](domain-migration.md).

## 8. Audit keamanan dependency

Tujuh high ditangani melalui override terarah Effect 3.20.0, deepmerge-ts 8.0.0 dan Happy DOM 21.0.4. Prisma 6.19/Payload 3.90.2 tetap dipertahankan. Dua transitive major ditinjau pemakaiannya dan diuji kompatibilitas; tidak memakai force fix atau upgrade major root tanpa batas.

Audit terbaru: **0 critical / 0 high / 13 moderate / 7 low**. Exit npm audit masih nonzero, bukan audit bebas temuan. Tiga tes API dependency yang dipakai lulus, diikuti suite integrasi/browser/hero dan build. Runtime server owner masih perlu dicocokkan saat deployment. [Tabel tujuh advisory lengkap](phase-2/security-resolution.md).

## 9. Pengujian baru dan matriks E2E lengkap

| Check | Actual | Evidence |
| --- | --- | --- |
| Real Sandbox + HTTPS notifications + paid tickets/check-in | 15/15 PASS | [JSON](phase-2/evidence/real-midtrans-delivery.json) |
| PostgreSQL integration | 50/50 PASS | [JSON](evidence/integration-results.json), [log](phase-2/evidence/integration-run.log) |
| Chromium desktop/tablet/mobile | 32/32 PASS | [JSON](evidence/browser-results.json), [log](phase-2/evidence/browser-run.log) |
| Hero/media regression | 13/13 PASS | [log](phase-2/evidence/hero-regression.log) |
| Dependency compatibility | 3/3 PASS | [log](phase-2/evidence/dependency-compatibility.log) |
| Legacy copy/restore/additive upgrade | 3/3 PASS | [JSON](phase-2/evidence/migration-copy.json) |
| TypeScript | PASS, standalone noEmit dan produksi | [log](phase-2/evidence/typecheck.log), [build](phase-2/evidence/build.log) |
| ESLint | Exit0, 0 errors, 22 existing warnings | [log](phase-2/evidence/lint.log) |
| Production Webpack build | Exit0, Next16.4.6, typecheck/prerender selesai | [log](phase-2/evidence/build.log) |

Build final menggunakan `BOOKING_PUBLIC_URL=https://booking.lemburudjoparahyangan.com`. Percobaan awal memakai HTTP localhost dari konfigurasi development ditolak guard production (`CONFIGURATION_INVALID`); guard tidak dilonggarkan. Build tetap memuat warning metadata themeColor existing. Screenshot kegagalan awal BNI disimpan sebagai jejak gagal, bukan keberhasilan. [Matriks E2E-01 sampai E2E-20: environment/input/expected/actual/status/evidence](phase-2/e2e-matrix.md).

Selector kini tetap menampilkan tanggal unavailable/sold-out sebagai disabled dan arrow mengikuti batas scroll aktual, bukan tanggal yang dipilih. Harga/sesi/kuota tetap backend. Screenshot UI browser terbaru ada pada folder evidence baseline, tanpa mendesain ulang situs publik.

## 10. Berkas berubah

Kelompok utama: service/outbox email dan reset adapter; schema/migrasi additive; endpoint worker; riwayat check-in admin/API/UI; pemilih tanggal; lockfile security overrides; runner nyata dan migration-copy; tes integrasi/browser/compatibility; dokumentasi RAD, domain, audit dan bukti. [Daftar berkas perubahan](phase-2/changed-files.txt). Source aplikasi lama, aset LUP, credentials privat dan record bersama dipertahankan.

## 11. Commit

Implementasi dan tes: **`b735c8a` — feat(booking): verify sandbox delivery and add resilient email outbox**. Dokumentasi/evidence ditambahkan dalam commit handoff berikutnya; hash tersedia melalui `git log` dan jawaban handoff. Baseline historis `08bae20`; laporan terdahulu bukan bukti bahwa deployment terbaru sudah aktif. Tidak ada push/merge/deploy dalam eksekusi ini.

## 12. Blocker yang tersisa

Google user consent/session nyata; provider/sender email dan inbox penguji; HTTPS/routing target booking; akses/approval backup dan clone produksi; kamera fisik; penerimaan stakeholder. Guest purchase belum didukung kebijakan account-required; bila wajib, perlu keputusan owner dan implementasi secure guest access. Actual bank-decline dan natural timed provider-expiry belum diuji. Moderate/low advisories masih memerlukan triage lanjutan.

## 13. Tindakan owner

1. Sediakan akun Google test user dan selesaikan consent/callback pada origin yang sama; daftarkan redirect URI lokal/target persis sesuai panduan.
2. Konfigurasi private Resend key/sender terverifikasi dan cron secret; jalankan worker dan verifikasi inbox reset/booking/payment/ticket.
3. Periksa Nginx server_name, service/upstream3001, TLS/SNI/firewall pada host booking; perluas sertifikat SAN untuk mencakup booking; pertahankan domain lama. Jalankan transaksi baru langsung ke webhook booking setelah HTTPS berfungsi, baru pertimbangkan cutover GET/HEAD.
4. Setujui dan jalankan backup/restore clone data aktual serta review runtime VPS sebelum migrasi/deployment. Tidak menjalankan reset/migrate dev.
5. Uji kamera ponsel HTTPS dan manual fallback, lalu isi checklist UAT dengan perwakilan perusahaan. Tetapkan kebijakan guest dan verifikasi email bila hendak mewajibkannya.

## 14. Rekomendasi rilis

**Layak untuk UAT terkontrol pada lingkungan terisolasi dengan akun email/password dan Midtrans Sandbox**, dengan batas Google/email/kamera diinformasikan kepada penguji. **Belum layak produksi atau klaim public end-to-end pada target domain.** RAD mencatat konstruksi/pengujian nyata; UAT, wawancara dan cutover produksi belum dilakukan. [RAD/UML/ERD](rad-design.md), [checklist UAT](uat-checklist.md).
