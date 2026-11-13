# Migrasi domain booking

Status 13 November 2026: **belum cutover, belum deploy**. Pemeriksaan HTTPS langsung: domain lama memberi HTTP 200; domain baru belum ter-resolve dari lingkungan pengujian. DNS provider, Google Console, Midtrans Dashboard dan VPS belum diubah dalam pekerjaan ini.

## Konfigurasi yang disiapkan

1. DNS: buat record **CNAME** `booking` → `ticket.lemburudjoparahyangan.com` (tanpa path/protokol). Alternatif A/AAAA harus menyalin IP upstream aktual domain lama; jangan menebak IP. Gunakan DNS-only saat menerbitkan sertifikat bila proxy provider menghalangi challenge.
2. Nginx: tambahkan `booking.lemburudjoparahyangan.com` pada server_name upstream aplikasi yang sama. Contoh di `deploy/nginx-subdomains.conf.example`. Pertahankan `Host $host`, overwrite `X-Real-IP`, upstream 3001 dan layanan lain pada port 3000. Jalankan `nginx -t` sebelum reload.
3. TLS: perluas sertifikat untuk **kedua** domain; verifikasi chain dan masa berlaku dengan klien HTTPS publik. Jangan menghapus sertifikat/routing domain lama.
4. Jalankan migrasi additive pada schema ticketing melalui direct URL setelah backup dan pengujian pada salinan data: `npm run db:migrate`. Tidak memakai reset, `db push`, atau `migrate dev`.
5. Deploy build yang telah diuji ke service yang sudah ada. Jangan mengubah database, secret sesi, atau Midtrans key saat mengganti host.
6. Awalnya pertahankan `BOOKING_PUBLIC_URL=https://ticket.lemburudjoparahyangan.com` dan `BOOKING_REDIRECT_VERIFIED=false`. Kedua host diterima proxy; API staf/CMS tetap tertutup di host booking.
7. Google OAuth **Web application**:
   - Authorized JavaScript origins: `https://ticket.lemburudjoparahyangan.com` dan `https://booking.lemburudjoparahyangan.com`.
   - Authorized redirect URIs: `https://ticket.lemburudjoparahyangan.com/api/ticketing/auth/google/callback` dan `https://booking.lemburudjoparahyangan.com/api/ticketing/auth/google/callback`.
   - Scope: `openid email profile`. Konfigurasi consent screen dan test users sesuai status publikasi aplikasi. Isi `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` privat. Library tidak menautkan akun email lokal otomatis.
8. Setelah HTTPS baru berhasil, set `BOOKING_PUBLIC_URL=https://booking.lemburudjoparahyangan.com`. Ini mengubah callback Snap dan origin OAuth yang tepercaya. Uji login pada host tersebut; permintaan start Google dari host lain ditolak agar cookie state tetap terikat host yang benar.
9. Midtrans **Sandbox**: siapkan Payment Notification URL `https://booking.lemburudjoparahyangan.com/api/ticketing/webhook`; finish/unfinish/error redirect ke origin baru (finish per pesanan dikirim backend). Uji **POST langsung** ke endpoint baru dengan transaksi Sandbox nyata dan verifikasi signature + GET status + nominal + replay. Jangan memasang redirect pada webhook lama atau menganggap browser finish sebagai pembayaran berhasil. Endpoint lama tetap melayani POST agar transaksi yang sudah dibuat tetap dapat diperbarui.
10. Uji katalog, login/logout, ownership, checkout, pembayaran, PDF, check-in dan error pada kedua host. Tuntaskan akses pesanan guest/sesi lama melalui dukungan atau tunggu jendela aksesnya berakhir karena cookie host-only tidak berpindah. Setelah bukti lengkap, `BOOKING_REDIRECT_VERIFIED=true` mengaktifkan **307 hanya GET/HEAD rute pelanggan** pada domain lama. API, webhook, aset, dan POST tidak dialihkan. Rollback: kembalikan flag false; origin ke domain lama bila diperlukan.

## Sesi

Cookie tetap host-only, HttpOnly, SameSite=Lax; tidak diperluas ke semua subdomain. Sesi dan akses guest lama tetap berlaku pada domain lama. Cookie host-only tidak dapat dibaca host baru: pelanggan perlu login ulang pada host baru. Ini tidak menghapus akun, pesanan, atau sesi di database. Login Google tidak memindahkan kepemilikan pesanan berdasarkan email.

Portal tetap noindex/no-store. Metadata portal memakai origin terkonfigurasi dan menghapus canonical homepage publik yang semula diwarisi. Domain publik utama dan halaman karier tetap dipertahankan.

## Blocker eksternal

DNS/hosting/TLS baru, OAuth credentials/console dan webhook Midtrans HTTPS baru belum terverifikasi. Jangan menandai migrasi atau demo end-to-end publik selesai sebelum pemeriksaan tersebut lulus.
