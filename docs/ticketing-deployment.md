# Deployment portal tiket Lembur Udjo

## Portal multi-halaman

Root subdomain tiket kini membuka landing page pengantar dengan foto kawasan,
cerita pengalaman, langkah pemesanan, dan tombol Pesan Tiket. Tombol tersebut
menuju `/order-tickets` untuk memilih kategori. Logo header kembali ke landing page. Halaman
pemesanan sebelumnya tetap dipertahankan di `/pemesanan-lama`; isi formulirnya tidak diganti, hanya dibungkus header/footer portal yang sama. Tautan lama `/?pesanan=...` tetap ditangani. Homepage domain
utama tidak dibawa dari perubahan desain yang belum di-commit di workspace.

Struktur kategori dan tab dipelajari dari
[referensi alur](https://booking.eigernature.com/order-tickets). Logo, foto, nama,
dan seluruh teks memakai konten Lembur Udjo sendiri. Tiga kategori awal bertanda
**contoh — belum resmi**: kunjungan kawasan, pengalaman budaya, dan rombongan.
Kategori resmi telah ditanyakan; belum ada konfirmasi harga, jadwal, atau kuota.

| Halaman | URL pada subdomain tiket | Pemeriksaan HTTPS |
| --- | --- | --- |
| Landing page booking | `/`, `/beranda-tiket` | 200 — lulus HTTPS |
| Pilihan kategori | `/order-tickets` | 200 — lulus HTTPS |
| Kategori kunjungan | `/order-tickets?tab=kunjungan` | 200 — lulus HTTPS |
| Kategori budaya | `/order-tickets?tab=budaya` | 200 — lulus HTTPS |
| Kategori rombongan | `/order-tickets?tab=rombongan` | 200 — lulus HTTPS |
| Pilih tiket | `/pilih-tiket?kategori=kunjungan` | 200 — lulus HTTPS |
| Keranjang | `/keranjang` | 200 — lulus HTTPS |
| Checkout | `/checkout` | 200; form akun dan ajakan masuk tamu diuji |
| Daftar pesanan | `/pesanan` | 200 — lulus HTTPS |
| Status pesanan | `/pesanan/[kode]`, `/pesanan/contoh` | Pemilik 200; akun lain 404; contoh 200 |
| Tiket saya | `/tiket-saya` | 200 — lulus HTTPS |
| Masuk | `/masuk` | 200 — lulus HTTPS |
| Daftar | `/daftar` | 200 — lulus HTTPS |
| Akun saya | `/akun` | 200 — lulus HTTPS |
| Bantuan | `/bantuan` | 200 — lulus HTTPS |
| FAQ | `/faq` | 200 — lulus HTTPS |
| Pemesanan sebelumnya | `/pemesanan-lama` | 200 — lulus HTTPS |

Seluruh halaman baru memakai satu header dan footer. Header menyediakan pilihan
bahasa Indonesia, navigasi, keranjang, serta akses akun. Footer berisi bantuan,
FAQ, informasi pembayaran yang belum aktif, media sosial dan saluran reservasi,
serta hak cipta. Jam layanan tidak dikarang dan diberi keterangan menunggu tim.

### Akun dan alur pesanan

- Registrasi dan login memakai akun pengunjung terpisah dari akun staf.
  Password di-hash dengan scrypt; token sesi acak hanya disimpan dalam bentuk
  hash di database. Cookie HttpOnly, Secure pada HTTPS, host-only, SameSite=Lax.
- Form akun memakai POST secara eksplisit, termasuk saat JavaScript tidak aktif,
  agar kata sandi tidak masuk URL. Penggunaan form akun memerlukan JavaScript.
- Logout mencabut sesi di server. Sesi kedaluwarsa setelah tujuh hari.
- Pesanan baru terikat ke ID akun. Email yang sama tidak otomatis mengambil
  kepemilikan pesanan lama. Halaman dan API pesanan memeriksa pemiliknya.
- Keranjang rencana disimpan di browser tanpa data pemesan; tidak menahan kuota.
  Tanggal/preferensi sesi contoh bukan jadwal resmi atau reservasi.
- Pembayaran tetap tertutup. Selain flag sandbox dan key, dibutuhkan flag
  persetujuan penjualan `TICKETING_SALES_APPROVED=true`; default-nya false.
  Flag tersebut tidak diaktifkan pada deployment portal ini.
- Halaman status contoh tidak membuat pesanan, menghitung waktu palsu, atau
  menerbitkan tiket. Pesanan/tiket akun kosong menampilkan keadaan kosong.
- Verifikasi email dan pemulihan password otomatis belum tersedia; bantuan akun
  diarahkan ke tim reservasi. Tidak ada klaim email pengguna sudah terverifikasi.

Migrasi additive `20261106140000_visitor_accounts` menambah VisitorAccount,
VisitorSession, dan relasi akun pada Order. Migrasi tidak menghapus tabel/data
dan tidak mengubah kredensial staf. Backup wajib dibuat sebelum migrasi VPS.

### Validasi awal

30 tes lulus pada PostgreSQL lokal sementara, termasuk hash password, login,
revokasi/expiry sesi, isolasi pemilik pesanan, replay request antar-akun,
validasi keranjang, redirect aman, dan seluruh regresi kuota/webhook sebelumnya.
TypeScript dan lint area portal lulus. Build Webpack snapshot rilis dan staging VPS lulus. Seluruh hasil live di bawah diperiksa setelah aktivasi.

Browser automation mengembalikan `browser access host is unavailable`.
Karena itu hasil HTTP tidak akan disebut sebagai bukti pengujian visual pada
perangkat fisik. Layout menggunakan breakpoint ponsel/desktop dan kontrol sentuh
minimal 44 px; pemeriksaan visual tetap dibedakan dari pengujian HTTPS.

### Hasil aktivasi final

Versi kode aplikasi **`5c3d555`**, branch VPS `deploy/ticket-logo`. Paket dibangun
terpisah dari perubahan homepage yang belum di-commit. Tidak ada Git push atau
perubahan kode pada layanan port 3000. Dokumentasi dilengkapi setelah tes live.

- **21 alamat halaman**, **27 tautan internal** (termasuk anchor), dan **30 aset**
  CSS/JS/gambar lulus melalui HTTPS normal pada domain publik.
- Header dan footer seragam juga diverifikasi pada halaman pemesanan lama.
- Registrasi, login, cookie Secure/HttpOnly/host-only, revokasi sesi, checkout akun,
  dan akses status pesanan lulus. Pemilik mendapat 200; akun lain mendapat 404.
- API katalog tetap `checkoutEnabled=false`; POST pemesanan ditolak dengan
  `503 CHECKOUT_CLOSED`. API CRM pada host tiket tetap 404.
- Dua akun dan satu pesanan kedaluwarsa tanpa item/pembayaran dibuat sebagai
  fixture pemeriksaan, lalu dihapus. Pemeriksaan akhir menemukan **0 akun uji**,
  **0 pelanggan uji**, **0 produk aktif**, dan **0 sesi aktif**.
- Kedua layanan Lembur Udjo dan Maxius aktif. File environment asli dipertahankan;
  salinan environment staging baru dan staging preview lama sudah dihapus.
- Laporan rinci VPS: `/home/maxis/lembur-portal-qa-0c081ef-https.json`.

| Pemeriksaan tambahan | Hasil |
| --- | --- |
| Halaman dengan sesi akun dan tanpa sesi | Lulus |
| Registrasi, login, logout, pencabutan sesi | Lulus |
| Form masuk/daftar memakai POST eksplisit | Lulus pada HTML HTTPS |
| Status pesanan akun lain | 404, tanpa data pesanan |
| CSS, JS, dan gambar yang dirujuk HTML | 30 aset, seluruhnya 200 dan tipe konten sesuai |
| Tautan antarhalaman dan target anchor | 27 tautan, seluruhnya lulus |
| Gate pembayaran | Tetap nonaktif pada UI dan API |
| Akun/pesanan uji dan salinan kredensial sementara | Dibersihkan |
| Visual landing/header | Chrome desktop dan responsif 320/375/768 px diperiksa; perangkat fisik belum diuji |

Backup database sebelum migrasi akun:
`/home/maxis/lembur-portal-db-backup-0c081ef-k0kwmF/database.dump`.
Archive telah diperiksa; pemulihan backup belum diuji.
Backup build/dependensi dan source sebelum aktivasi:
`/home/maxis/lembur-portal-app-backup-0c081ef/`.
Backup build sebelum landing page: `/home/maxis/lembur-booking-landing-backup/`.
Backup build sebelum pengaman POST: `/home/maxis/lembur-portal-form-safety-backup/`.

### Pembaruan tampilan dan penghapusan logo

- Palet portal berubah menjadi krem hangat dan cokelat tua, khusus dalam frame
  portal. Font memakai Barlow Condensed regular/semibold yang dihosting sendiri
  dengan `next/font/local`; lisensi OFL disertakan.
- Aturan tautan global sebelumnya menimpa warna tombol, sehingga tulisan putih
  di atas tombol putih pada hero tidak terlihat. Warna tautan tombol kini
  ditetapkan dalam CSS module portal dengan kontras yang sesuai.
- Header memakai menu seluler sampai lebar 1024 px; pilihan bahasa hanya tampil
  di header desktop yang cukup lebar. Aksi hero/login/status tersusun vertikal
  pada ponsel. Kontrol input dan isi grid dapat menyusut mengikuti ruangnya.
- Gambar `UdjoFullColor.png` di header tiket dihapus dan diganti wordmark teks.
  URL sumber `/UdjoFullColor.png` dan URL `/_next/image?url=%2FUdjoFullColor.png&w=256&q=75`
  ditutup dengan 404 khusus pada host tiket. Asset website utama tetap terpisah.
- URL logo sumber dan optimasi sudah dibuktikan 404 melalui HTTPS. Sebanyak
  27 file font yang dirujuk CSS juga diperiksa dan semuanya 200.
- ESLint area perubahan dan 9 tes routing lulus; build Webpack dan TypeScript
  pada VPS lulus. Pemeriksaan HTTPS diulang setelah rilis ini.
- Visual landing/header diperiksa melalui Chrome desktop dan mode responsif
  320, 375, dan 768 px. Font condensed, tulisan CTA, susunan tombol, dan menu
  seluler terlihat sesuai. Ini bukan pengujian perangkat fisik atau audit visual
  menyeluruh setiap keadaan formulir.
- Staging sementara dari rilis sebelumnya dibersihkan setelah disk VPS hampir
  penuh. Database, aplikasi live, layanan lain, dan backup tetap dipertahankan.
  Backup build sebelum rilis logo: `/home/maxis/lembur-ticket-logo-backup/`.

### Permintaan uji coba pembayaran

Pengguna telah meminta pembayaran dibuka untuk uji coba. Jalur yang disiapkan
adalah Midtrans sandbox (tanpa uang sungguhan). Server Key sandbox belum tersedia;
pembayaran tidak dapat berjalan sebelum kredensial valid terpasang di environment
server. Jangan menaruh kunci di chat, dokumentasi, atau repo. Kategori/harga/jadwal
uji harus diberi label simulasi, terpisah dari data resmi.

### Masih menunggu

Kategori resmi, harga, batas usia/rombongan, jadwal, kuota, jam layanan, dan key
Midtrans sandbox. Pembayaran tidak diaktifkan selama informasi tersebut belum
siap. Rahasia runtime tidak ditaruh dalam Git; salinan environment staging harus
dihapus setelah aktivasi selesai.

### Rilis panel admin tiket — 7 November 2026

Target: `https://app.lemburudjoparahyangan.com/admin/tiket` (login memakai
`CRM_PASSWORD` yang sama dengan CRM).

- Rute baru: halaman `app/(site)/admin/tiket` (server + loading), API staf
  `app/(site)/api/staff/orders` (GET daftar/ringkasan; POST `refresh`/`expire`
  memakai `applyPaymentStatus`/`expireOrder`), `lib/ticketing/staff.ts`
  (query + ringkasan), `components/admin/TicketApp.tsx` (UI), tambahan
  passthrough `under("/admin")` pada host app di `proxy.ts`, dan link "Panel
  tiket" di sidebar `CrmShell`.
- API staf memakai sesi CRM (`isAuthed`), guard same-origin, dan berada di luar
  prefix `/api/ticketing` sehingga tetap 404 pada host tiket.
- `CRM_PASSWORD` dan `CRM_SECRET` sebelumnya tidak pernah di-set di `.env` VPS
  (login produksi 500). Keduanya kini di-set dan layanan direstart. Tabel CMS
  (`leads`, dll.) juga baru dibuat via `npx payload migrate` di VPS; CRM dan
  DB memang belum memiliki data kontak (0 di produksi maupun Neon).
- Aktivasi: staging `/home/maxis/lembur-tiket-admin-staging` (node_modules
  di-share, build Webpack lulus dengan rute `/admin/tiket` + `/api/staff/orders`,
  smoke test staging lulus), `.next` sebelumnya dibackup ke
  `/home/maxis/lembur-admin-tiket-prev-next.tgz`, lalu `rsync .next` ke live dan
  restart `lembur-udjo.service`. Staging dihapus setelah aktivasi.
- Verifikasi produksi (HTTPS domain asli): login 200, `/admin/tiket` 200 dan
  merender panel, `/api/staff/orders` 200 berisi ringkasan, API staf 404 pada
  host tiket, portal tiket 200, katalog `checkoutEnabled=false`, dan
  `maxius-omni.service` tidak disentuh.



---

## Riwayat: deployment preview satu halaman — 6 November 2026

Target: https://ticket.lemburudjoparahyangan.com/

Rilis `8acdb22` dibuat dari baseline produksi `5138e34` di checkout terpisah.
Hanya perubahan tiket, dependensi Prisma/Zod, dan perbaikan import ThreeUI yang
dibawa. Perubahan homepage yang masih belum di-commit di workspace tidak ikut
dideploy. Snapshot homepage rilis identik dengan baseline produksi.

## Lokasi dan versi

- Akun VPS: `maxis`, host `157.10.160.37`.
- Direktori aplikasi: `/home/maxis/lembur-udjo`.
- Branch lokal di VPS: `deploy/ticket-sandbox-20261106`, commit `8acdb22`.
- Rilis dikirim melalui archive dan Git bundle. Branch ini belum di-push ke GitHub.
- Service: `lembur-udjo.service`, port 3001, tetap bind ke loopback.
- `maxius-omni.service` pada port 3000 tidak dihentikan atau diubah.

Build Webpack berhasil pada paket rilis lokal dan pada staging VPS. Import
Sketchbook dipersempit ke export komponen ThreeUI agar modul Gallery dengan
data URL bermasalah tidak ikut di-resolve oleh Webpack.

## Database yang benar

Database VPS adalah PostgreSQL lokal `127.0.0.1:5432`, berbeda dengan Neon pada
environment pengembangan lokal. Layanan systemd tidak menimpa URL database dari
`.env`. Database VPS dicadangkan dan dua migrasi tiket additive diterapkan di
schema `ticketing`, tanpa reset atau perubahan tabel CMS.

Hasil VPS: 11 tabel tiket, 4 produk contoh dan 9 sesi contoh, semuanya tidak
aktif. Harga/jadwal resmi serta Server Key Midtrans belum dikonfigurasi;
checkout tetap tertutup. File `.env` VPS dan flag Coming Soon dipertahankan.

Backup database format custom (daftar isi archive berhasil diverifikasi,
pemulihan belum diuji):

`/home/maxis/lembur-ticket-backup-8acdb22-wRJWUL/database-before-ticket.dump`

Backup aplikasi sebelum aktivasi:

`/home/maxis/lembur-release-backup-8acdb22/`

Folder itu menyimpan source archive, commit/branch awal, `.next` dan
`node_modules` sebelumnya. Aktivasi memakai pemeriksaan staging dan rollback
otomatis jika smoke test aplikasi gagal.

## Perbaikan HTTPS pada VPS

Request langsung dengan HTTP berhasil, tetapi header `X-Forwarded-Proto: https`
menyebabkan rewrite ke `https://localhost:3001/ticket` dianggap eksternal saat
Next.js di-bind memakai hostname `127.0.0.1`. Next mencoba TLS ke port HTTP dan
menghasilkan `EPROTO`/500. Kondisi ini sudah ada sebelum deployment.

Binding `localhost` dengan DNS IPv4-first diuji pada proses sementara dengan
header Nginx yang sama. Setelah lulus, konfigurasi final dipasang melalui:

`/etc/systemd/system/lembur-udjo.service.d/zz-ticket-loopback.conf`

```ini
[Service]
ExecStart=
ExecStart=/usr/bin/node --dns-result-order=ipv4first /home/maxis/lembur-udjo/node_modules/next/dist/bin/next start -p 3001 -H localhost
```

Nama `zz-...` diperlukan karena `override.conf` yang sudah ada mengatur ExecStart
dan dibaca setelah nama drop-in bernomor. Config override lama tetap disimpan.
Listener aktual tetap `127.0.0.1:3001`; port aplikasi tidak dibuka ke publik.
Nginx dan sertifikat TLS yang sudah ada dipertahankan.

## Batas verifikasi

Pemeriksaan HTTPS publik dari VPS setelah perbaikan:

| Pemeriksaan | Hasil |
| --- | --- |
| Root subdomain tiket dan tiga langkah form | 200, isi sesuai |
| Katalog tiket | 200, `checkoutEnabled=false`, produk/sesi aktif kosong |
| CSS dan gambar hero melalui image optimizer | 200 |
| API CRM pada host tiket | 404 |
| Website utama dan halaman login staf | 200 |
| Permintaan checkout ketika belum dikonfigurasi | 503 `CHECKOUT_CLOSED` |
| Layanan Lembur Udjo dan Maxius | Keduanya aktif |

HTTP dan pemeriksaan isi halaman bukan pemeriksaan visual browser atau transaksi
Midtrans nyata. Browser automation sebelumnya tidak tersedia. Resolusi DNS dari
lingkungan agen lokal timeout; pemeriksaan HTTPS memakai resolver VPS melalui
domain publik dan sertifikat TLS normal, tanpa menonaktifkan verifikasi TLS.

Jangan mengaktifkan produk/harga contoh untuk menerima pemesanan sungguhan.
Pengujian pembayaran asli masih menunggu konfigurasi sandbox dan data resmi.
