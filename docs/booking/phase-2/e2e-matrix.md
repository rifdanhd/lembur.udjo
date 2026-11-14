# Matriks E2E aktual — 14 November 2026

Lingkungan: branch `feat/lup-booking-platform`, PostgreSQL lokal disposable, Next.js development, Chromium. Tidak ada database bersama atau deployment produksi yang diubah. Harga fixture bukan harga resmi. PASS lokal tidak menyatakan layanan publik sudah siap.

Bukti: **R** = [15 pemeriksaan Midtrans nyata](evidence/real-midtrans-delivery.json), **B** = [32 pemeriksaan browser](../evidence/browser-results.json), **I** = [50 pemeriksaan integrasi](../evidence/integration-results.json). B dan I menggunakan status provider terkontrol; hanya R membayar melalui simulator resmi dan menerima notifikasi asli.

| ID / fitur | Environment dan input | Expected | Actual | Status / evidence |
| --- | --- | --- | --- | --- |
| E2E-01 Guest booking | B, pengunjung tanpa sesi menuju checkout | Pembelian tanpa akun bila kebijakan mengizinkan | Bisa memilih tiket; checkout mewajibkan login, POST 401. Pembelian tanpa akun belum didukung oleh kebijakan implementasi | **BLOCKED** untuk pembelian guest; gate B GUEST-ACCOUNT-POLICY PASS |
| E2E-02 Registered customer | R dan B, daftar/login lalu tanggal/sesi/jumlah 2 | Reservasi persisten dengan harga server | HTTP 201, total fixture Rp20.000, order/items/payment tersimpan | **PASS** R REAL-CHECKOUT; B AUTH-REGISTER-LOGOUT |
| E2E-03 Google login + booking | Google authorization endpoint dengan client lokal | Consent, callback, sesi pelanggan, kembali booking | Halaman Google dapat dibuka; credential ada; akun penguji/consent dan sesi selesai belum diamati | **BLOCKED**, [probe](evidence/google-authorization-probe.json) |
| E2E-04 Payment success | R, Snap BNI VA dan simulator resmi | Callback terpercaya → PAID → tepat 2 tiket | Settlement provider, webhook HTTPS, DB PAID/SETTLED, 2 tiket unik | **PASS** R REAL-BANK-SETTLEMENT / REAL-TICKETS |
| E2E-05 Pending | R, VA dibuat sebelum simulator membayar | PENDING, tidak ada tiket | Status API Midtrans pending, callback asli 200, tiket 0 | **PASS** R REAL-PENDING |
| E2E-06 Failed / cancelled | I deny/failure terkontrol; R cancel API resmi | CANCELLED/FAILED, hold dilepas, tidak ada tiket | Deny/failure lewat integrasi PASS; cancel asli + webhook asli 200, tiket 0. Penolakan bank nyata belum diuji | **PASS** lingkup tersebut, R REAL-CANCEL dan I; actual bank decline **NOT RUN** |
| E2E-07 Expired | R expire API resmi; I expiry hold | EXPIRED, kapasitas dilepas sekali | Callback expire asli 200; tidak ada tiket; constraint kapasitas tetap valid. Tidak menunggu expiry alami 15 menit pada provider | **PASS** R REAL-EXPIRE dan I |
| E2E-08 Duplicate/retry webhook | R, satu 503 lalu retry provider; 3 replay body asli bersamaan | Retry aman, tiket/audit tidak dobel | Retry Midtrans 200; replay 200; tetap 2 tiket dan 1 settlement event | **PASS** R REAL-HTTPS-RETRY / REAL-REPLAY |
| E2E-09 Invalid notification | R, signature diubah pada body asli | Ditolak tanpa mutasi pembayaran | HTTPS 403 | **PASS** R REAL-INVALID |
| E2E-10 Concurrent quota | I, checkout bersamaan mendekati kapasitas | Tidak overbook, idempotent checkout | Assertions database/constraint/hold dan request key lulus | **PASS** I |
| E2E-11 PDF | R, sesi pemilik order paid mengunduh | PDF tepat 2 tiket | HTTP 200, PDF dua halaman; halaman pertama dirender dan diperiksa secara visual | **PASS** R REAL-PDF; [PDF fixture nyata](evidence/real-paid-tickets.pdf) |
| E2E-12 QR validation | R, payload QR dari tiket paid ke API staf | Check-in pertama berhasil dan tercatat | HTTP 200, satu CheckIn; kamera fisik tidak digunakan | **PASS** API, R REAL-CHECKIN; physical camera **NOT RUN** |
| E2E-13 Concurrent duplicate scan | R, 3 request payload sama bersamaan | Hanya satu sukses | 200 / 409 / 409, tepat satu CheckIn | **PASS** R REAL-CHECKIN |
| E2E-14 Booking history | B, pemilik membuka akun | Hanya riwayat miliknya | Order pemilik muncul pada halaman akun | **PASS** B ACCOUNT-HISTORY |
| E2E-15 Cross-customer access | B/I, customer lain meminta PDF/detail | Tidak membocorkan booking | Pemilik sah bisa unduh; customer lain 404 | **PASS** B TICKET-OWNER dan I |
| E2E-16 Admin monitoring | R/B, ADMIN melihat order dan check-in; STAFF meminta data admin | ADMIN boleh, STAFF ditolak | PAID terlihat; history berisi satu event; STAFF 401 | **PASS** R REAL-ADMIN / REAL-CHECKIN-HISTORY; B ADMIN-CHECKIN-HISTORY |
| E2E-17 Mobile flow | B, 390/768/1440 px, keyboard, calendar, panah tanggal, checkout | Harga/sesi akurat; tanpa overflow; kontrol bisa digunakan | 32 pemeriksaan browser lulus, termasuk tanggal tidak tersedia tetap disabled | **PASS** B; perangkat fisik **NOT RUN** |
| E2E-18 Password reset email | I token hash/single-use/expiry; provider lokal kosong | Email diterima dan link reset berhasil | Aturan token dan adapter tersedia; inbox/delivery asli belum diuji | **BLOCKED** real delivery; I token logic PASS |
| E2E-19 Domain / OAuth callback | DNS dan HTTPS publik, Google probe | booking HTTPS valid dan callback login sukses | Kedua A 157.10.160.37; ticket HTTPS200; probe awal booking ECONNREFUSED, probe IP lanjutan certificate hostname mismatch (SAN belum booking). Login/callback Google belum selesai | **BLOCKED**, [domain](evidence/domain-probes.json), [Google](evidence/google-authorization-probe.json) |
| E2E-20 Paid + email failure | R pembayaran asli, email transport sengaja gagal | PAID dan PDF tetap tersedia | Tiga event email gagal terkendali; order tetap PAID dan 2 tiket valid; PDF200 | **PASS** R REAL-PAID-EMAIL-FAILURE; bukan delivery email nyata |

UAT perwakilan PT Angklung Udjo Heritage belum dilaksanakan. Checklist, skenario, dan screenshot pengembang tidak menggantikan penerimaan stakeholder.
