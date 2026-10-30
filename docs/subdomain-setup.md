# Satu Next.js untuk website, ticket, dan app

## Perilaku

| Host | Alamat | Tujuan internal |
| --- | --- | --- |
| lemburudjoparahyangan.com / www | halaman publik | tidak berubah |
| app.lemburudjoparahyangan.com | / | redirect /dashboard |
| app.lemburudjoparahyangan.com | /dashboard | rewrite /admin (CRM yang ada) |
| app.lemburudjoparahyangan.com | /login | rewrite /admin/login |
| ticket.lemburudjoparahyangan.com | / | rewrite /ticket |

Proxy memilih bagian aplikasi berdasarkan Host yang diteruskan Nginx. Rewrite
mempertahankan alamat subdomain di browser. Link lama /admin di domain utama
diarahkan ke app, dan link /admin di app dinormalisasi ke /dashboard atau /login.
Localhost dan preview Vercel mempertahankan /admin dan /admin/login yang lama.
Pada app/ticket, rute halaman lain menghasilkan 404; ticket juga menutup API CRM/Payload.
Static assets tetap tersedia. Subdomain memiliki noindex dan robots Disallow: /.
Coming Soon homepage tidak menutupi halaman subdomain.

## Batas fitur saat ini

- app menggunakan autentikasi CRM yang ada (satu kata sandi admin).
- Cookie CRM tidak memakai atribut Domain, sehingga sesi terbatas pada host login.
  Pengguna /admin lama perlu masuk lagi di app; jangan memperluas cookie ke seluruh subdomain.
- Pemeriksaan sesi pada Server Component dan Route Handler tetap berlaku.
- HRD, akun staf individual/peran, akun pengunjung/OTP, checkout, payment gateway,
  dan e-ticket belum diimplementasikan. Halaman ticket menyatakan pembelian online
  belum tersedia dan meneruskan reservasi ke WhatsApp resmi yang sudah digunakan.
- Tidak ada perubahan schema, migrasi, atau data untuk pembagian domain ini.

## Aktivasi di VPS

1. Pastikan DNS A untuk app dan ticket menuju IP VPS 157.10.160.37.
2. Periksa service Lembur Udjo dan port sebelum mengubah konfigurasi. Catatan lama
   menyebut lembur-udjo.service pada 3001, tetapi kondisi aktual harus diperiksa.
   Jangan mengubah service lain pada port 3000.
3. Deploy perubahan kode ke checkout Lembur Udjo yang benar, jalankan npm ci dan
   npm run build, lalu restart service Lembur Udjo yang telah dikonfirmasi.
   Perubahan pembagian domain ini tidak membutuhkan migrasi. Bila checkout memiliki
   perubahan schema lain, ikuti prosedur migrasi perubahan tersebut secara terpisah.
4. Periksa apakah app/ticket sudah memiliki server block (`sudo nginx -T`).
   Cadangkan konfigurasi yang akan disentuh. Adaptasi
   deploy/nginx-subdomains.conf.example sebagai server block baru (jangan duplikasi
   server_name yang sudah ada). Pertahankan domain utama dan layanan lain.
5. Jalankan sudo nginx -t, kemudian sudo systemctl reload nginx hanya jika valid.
6. Gunakan mekanisme TLS yang sudah dipakai server. Untuk Certbot/Nginx yang
   sudah terpasang: sudo certbot --nginx -d app.lemburudjoparahyangan.com
   -d ticket.lemburudjoparahyangan.com --redirect (satu baris).
   Validasi nginx -t lagi. HTTPS harus aktif sebelum menguji login staf.
7. Uji HTTPS: website utama tetap tampil, ticket menampilkan reservasi, app
   mengarah ke login. Setelah masuk, CRM bisa mengambil leads dan menyimpan
   perubahan. Uji keluar dan pastikan dashboard kembali meminta login.
8. Pastikan ticket/api/leads dan ticket/admin menghasilkan 404. Sesi app tidak
   memberi akses pada ticket. Verifikasi gambar website dapat diubah melalui app.

Jangan menambahkan cache Nginx/CDN pada login, dashboard, atau API berautentikasi.
Jangan membuka port Next.js langsung ke publik. Nginx harus meneruskan Host asli
dan mengganti X-Forwarded-Proto dengan scheme koneksi yang dipercaya.

## Pemeriksaan lokal

```sh
node --import tsx --test tests/subdomain-routing.test.ts
npx tsc --noEmit
npm run lint
npm run build
```

Untuk uji browser, jalankan Next.js di port yang kosong, lalu buka
http://app.localhost:PORT/login dan http://ticket.localhost:PORT/.
Jika browser/OS tidak mendukung *.localhost, petakan kedua nama itu ke 127.0.0.1.
Halaman ticket juga dapat dipreview pada localhost:PORT/ticket. Uji Host dengan
curl membuktikan routing server, tetapi tidak membuktikan DNS/TLS atau login di VPS.
