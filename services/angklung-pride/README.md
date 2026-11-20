# Undangan Angklung Pride 2026

Undangan mobile dengan flyer asli, sapaan Prof. Dr. Ir. Jaka Sembiring, M.Eng., formulir nama dan pilihan Hadir/Berhalangan hadir. Parameter `?kepada=Nama%20Tamu` menyesuaikan sapaan dan isian awal.

- Undangan: https://lemburudjoparahyangan.com/undangan/angklung-pride/
- Dashboard panitia: https://lemburudjoparahyangan.com/undangan/angklung-pride/dashboard
- Dashboard meminta kata sandi panitia; data nama tidak tersedia melalui API tanpa sesi login.
- Dashboard dapat membuat undangan bernama dengan kategori VIP (kedatangan 17.30 WIB), VIP biasa (18.00 WIB), dan Reguler (18.00 WIB). Waktu pertunjukan tetap 19.00 WIB. Pembagian kategori ini mengikuti interpretasi sementara instruksi owner pada 20 November.
- Tombol Salin pesan menyiapkan teks WhatsApp; Salin tautan menyalin URL unik. Setiap undangan tersimpan di SQLite dan muncul sebagai Belum konfirmasi sebelum dijawab.
- Undangan yang dibuat dashboard memakai tautan nama `?kepada=nama-penerima`. Nama yang sama mendapatkan akhiran `-2`, `-3`, dst. ID internal tetap dipertahankan untuk identitas RSVP; tautan `?id=...` lama tetap dapat dibuka dan tampilan URL diganti menjadi tautan nama setelah undangan dimuat. Nama dan jam dibaca dari server; konfirmasi ditautkan pada undangan tersebut, sehingga membuka beberapa undangan di satu browser tidak saling menimpa. Tautan harus dibagikan kepada penerima yang sesuai karena siapa pun yang memegangnya dapat memberikan konfirmasi.
- Tautan undangan dari dashboard dapat dipakai kembali untuk memperbarui konfirmasi dari perangkat berbeda. Untuk tautan lama tanpa `id`, konfirmasi diperbarui dari perangkat/browser yang sama; nama yang sama pada browser lain ditolak.

## Runtime

Layanan mandiri Node.js 22.13+ menggunakan SQLite bawaan, tanpa paket tambahan. Ini dipisahkan dari aplikasi Next.js yang memiliki perubahan booking belum dirilis. Proses existing pada port 3000/3001 tidak dibangun ulang atau direstart.

- Service VPS: `angklung-pride.service`, loopback `127.0.0.1:3002`.
- Aplikasi: `/home/maxis/angklung-pride`.
- Data persisten: `/home/maxis/angklung-pride/data/rsvp.sqlite` beserta berkas WAL/SHM; direktori ini harus dipertahankan pada pembaruan.
- Environment service: `/etc/angklung-pride.env` (mode 600). Salinan konfigurasi unggahan: `production.env` (diabaikan Git).
- Nginx hanya meneruskan prefix `/undangan/angklung-pride/` pada domain utama; www diarahkan ke domain utama.
- Konfigurasi Nginx sebelumnya dicadangkan; lokasi backup dicatat di `nginx-backup-path.txt` pada VPS.
- Login dibatasi 10 percobaan/15 menit/IP; konfirmasi 60 permintaan/15 menit/IP. Sesi panitia kedaluwarsa 12 jam; logout mencabut sesi server.

Pengujian lokal: `node --test services/angklung-pride/test.mjs`.

Untuk preview lokal, atur `ADMIN_PASSWORD` (minimal 16 karakter), `PUBLIC_ORIGIN=http://127.0.0.1:3002`, `COOKIE_SECURE=false`, dan `PRIDE_DATABASE` ke file uji baru; jalankan `node services/angklung-pride/server.mjs`.

## Verifikasi 20 November 2026

Uji integrasi lokal dan VPS lulus: penyimpanan, pembaruan status, duplikasi nama, penolakan origin asing, proteksi dashboard, persistensi sesudah restart, dan pencabutan sesi logout. ESLint pada empat berkas JavaScript lulus.

Browser pada lebar 320, 390, 430, dan 1440 piksel tidak menunjukkan overflow horizontal; nama penerima terlihat pada viewport awal. Dashboard mobile diperiksa melalui screenshot.

HTTPS publik mengembalikan 200. Uji browser publik berhasil mengirim Hadir, memuat ulang konfirmasi tersimpan, memperbarui ke Berhalangan hadir, login dashboard, menemukan nama/status yang sesuai, serta logout. Entri bernama `Verifikasi Sistem 20261120-1348` dibuat hanya untuk uji dan dihapus setelah pemeriksaan. Tidak mengirim konfirmasi atas nama penerima undangan.

Pembaruan pembuat undangan: uji lokal dan VPS lulus untuk ketiga kategori, persistensi undangan, penolakan pembuatan tanpa login, serta konfirmasi beberapa tautan pada browser yang sama. Browser 320/390 piksel memverifikasi Salin pesan, Salin tautan, nama/jam tamu dan jumlah RSVP. Uji publik berhasil membuat satu undangan VIP, menyalin tautan dan pesan, menampilkan kedatangan 17.30 WIB, serta membaca konfirmasi di dashboard. Data SQLite dan versi aplikasi sebelumnya dicadangkan ke `/home/maxis/angklung-pride-backups` sebelum pembaruan; proses utama tidak direstart.
