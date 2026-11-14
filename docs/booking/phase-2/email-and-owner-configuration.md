# Email dan konfigurasi pemilik — 14 November 2026

## Hasil aktual

Provider email lokal belum tersedia: `RESEND_API_KEY` dan `EMAIL_FROM` belum dikonfigurasi. Tidak ada klaim email sungguhan diterima. Google Client ID/Secret lokal kini tersedia. Probe membuka halaman otorisasi Google dengan callback `http://localhost:3000/api/ticketing/auth/google/callback`; consent, callback sukses dan sesi pelanggan belum diamati. Owner perlu memakai akun penguji yang diizinkan dan mendaftarkan URI yang tepat. Identity/linking rules sudah diuji secara lokal.

## Service email dan antrean

`lib/ticketing/email.ts` menyediakan interface `EmailTransport` dan adapter Resend. Reset kata sandi memakai adapter yang sama, tetap dengan token hash sekali pakai 30 menit dan revokasi semua sesi setelah reset.

Reservasi, pembayaran terverifikasi, dan ketersediaan e-ticket membuat tiga jenis event `EmailDelivery`: RESERVATION, PAYMENT, TICKETS. EventKey unik adalah order/kind; body disimpan sebagai snapshot yang tidak berubah saat retry. Tidak ada token QR atau tiket tanpa login dalam email; link menuju akun pemilik. Seluruh pesan menampilkan label Sandbox.

Event masuk antrean dalam transaksi database yang sama dengan perubahan booking. Network email **tidak** berjalan di dalam transaksi atau webhook. Worker mengklaim event secara atomik, memakai lease 5 menit, retry exponential maksimal 8 attempt, serta Idempotency-Key stabil pada Resend. Event lewat 23 jam dibatalkan agar tidak melewati jendela dedupe provider 24 jam. Kegagalan provider disimpan sebagai kode statis tanpa payload/key/email di log. Provider yang belum diatur tidak menghapus antrean.

Bukti: suite integrasi mencakup duplicate checkout/webhook → tiga event saja, provider down → booking tetap PAID/PDF valid, klaim worker bersamaan, retry dan stale window. Runner pembayaran nyata juga memaksa transport email gagal setelah pembayaran Sandbox asli; hasil tetap PAID dan PDF terunduh. Transport error itu terkontrol oleh harness, **bukan** bukti delivery email nyata.

## Konfigurasi owner

1. Gunakan akun Resend yang berwenang dan verifikasi sender domain (SPF/DKIM sesuai instruksi dashboard provider). Jangan mengubah DNS tanpa izin owner.
2. Set `RESEND_API_KEY` dan `EMAIL_FROM` privat pada environment server. Contoh sender: `Lembur Udjo <reservasi@DOMAIN_YANG_SUDAH_DIVERIFIKASI>`; jangan memakai domain contoh untuk rilis.
3. Sebelum memakai kode baru, terapkan migrasi additive EmailDelivery pada salinan database, kemudian pada database bersama hanya setelah approval. Tidak ada migrasi shared DB dilakukan dalam pekerjaan ini.
4. Jadwalkan POST per menit ke `/api/ticketing/emails/dispatch` pada host booking/ticket dengan header `Authorization: Bearer` yang nilainya dibaca dari `TICKETING_CRON_SECRET`. Gunakan secret store/service config, bukan menyimpan key dalam repository. Endpoint menolak pengunjung biasa (401).
5. Worker memproses maksimal lima email per panggilan. Pantau state PENDING/SENT/FAILED/CANCELLED, providerMessageId dan audit `EMAIL_DELIVERY_FAILED` dari akses database/admin yang berwenang. Tidak ada reset otomatis untuk FAILED; tinjau penyebab sebelum retry manual.
6. Kirim reset/konfirmasi ke alamat uji milik penguji yang disetujui. Verifikasi inbox, link akun, nominal Sandbox, reset single-use, dan jalankan test provider-down. Sampai itu dilakukan, delivery nyata berstatus BLOCKED.

Email verification bukan gate pada desain akun email yang sudah ada. Akun lokal yang belum diverifikasi tidak boleh mengklaim pesanan historis atau ditautkan otomatis ke Google hanya lewat kecocokan email. Google hanya menerima email_verified=true; reset yang sah membuktikan penguasaan email. Bila bisnis mewajibkan verifikasi email sebelum checkout, itu memerlukan keputusan kebijakan dan alur tambahan, belum diaktifkan diam-diam.

## Google OAuth

Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, dan `BOOKING_PUBLIC_URL` melalui environment privat. Gunakan OAuth **Web application**, scope `openid email profile`, consent screen dan test users yang benar.

Authorized JavaScript origins:

- `https://ticket.lemburudjoparahyangan.com`
- `https://booking.lemburudjoparahyangan.com`

Authorized redirect URIs:

- `https://ticket.lemburudjoparahyangan.com/api/ticketing/auth/google/callback`
- `https://booking.lemburudjoparahyangan.com/api/ticketing/auth/google/callback`

Origin aktif harus sama dengan host browser saat memulai login. PKCE, state, nonce, claims dan sesi server-side sudah ditulis; OAuthAttempt sekali pakai, cookie host-only. Jangan menggunakan credential Google Drive/Fonts sebagai OAuth client aplikasi. Jangan menaruh client secret dalam chat, source, screenshot, atau browser props. Akun lokal yang memakai email sama harus login lewat sandi; tidak ada auto-link.

## Domain dan deployment

Probe terbaru: A kedua host menunjuk `157.10.160.37`. `ticket` memberi HTTPS 200 dengan sertifikat valid; `booking` belum berhasil membuka HTTPS dari lingkungan pengujian. Probe lanjutan langsung ke IP menunjukkan hostname mismatch: sertifikat hanya mencakup app/ticket, belum booking. Periksa virtual host, perluas SAN sertifikat, TLS/SNI, firewall dan service pada VPS sebelum cutover. Ini perkembangan dari temuan lama “DNS belum ter-resolve”; record DNS tidak diubah oleh agen.

Pertahankan domain lama, database, key Sandbox, secret sesi dan endpoint webhook lama. Jangan mengaktifkan redirect sampai HTTPS/OAuth/webhook baru benar-benar lulus. Cookie host-only tidak berpindah antarsubdomain: pelanggan perlu login ulang; pesanan tetap milik account ID yang sama. Rincian: `domain-migration.md`.

## Referensi

- Resend idempotency: https://resend.com/docs/dashboard/emails/idempotency-keys
- Google OIDC: https://developers.google.com/identity/openid-connect/openid-connect
- Midtrans notification override: https://github.com/Midtrans/technical-documentation-site/blob/master/id/after-payment/http-notification.md#kustomisasi-url-notifikasi-melalui-api
