# Pengelolaan gambar dan video beranda melalui CRM

Masuk ke `/admin`, pilih **Media beranda**, lalu pilih **Banner beranda**, **Fasilitas**, atau **Galeri**. Gunakan **Ubah banner** atau **Ubah gambar** untuk mengganti media atau teks. **Tambah banner** membuat banner baru; bagian lain menggunakan **Tambah gambar**.

Untuk hero video, pilih **Banner beranda → Ubah banner → Jenis banner: Video**. Unggah MP4 (disarankan H.264) atau WebM maksimal 30 MB, lalu simpan. Foto banner yang sudah ada menjadi gambar cadangan; banner baru wajib memiliki gambar cadangan JPG, PNG, atau WebP maksimal 8 MB. Editor menyediakan pratinjau video sebelum disimpan. Disarankan video mendatar berdurasi 8–15 detik; server memeriksa format container, bukan codec atau durasinya, dan tidak melakukan transcoding.

Video hero berulang tanpa suara dengan `playsInline`. Hanya video slide aktif yang dimuat. Slide video bertahan sampai pengunjung memilih slide lain; tombol jeda menghentikan video dan autoplay gambar. Jika autoplay ditolak atau file gagal diputar, gambar cadangan tetap terlihat. Mode reduced motion, penghemat data yang terdeteksi browser, serta tab tersembunyi menggunakan gambar cadangan. Pengunjung dapat kembali ke banner gambar dengan memilih **Jenis banner: Gambar**. Mengganti atau menonaktifkan video tidak menghapus unggahan sebelumnya.

Form menyediakan judul, deskripsi gambar untuk pembaca layar, keterangan, kategori, urutan, dan pilihan tampil/sembunyikan. Urutan dimulai dari 0; angka yang lebih kecil tampil lebih dahulu. Jika angka sama, identitas gambar menjadi pembanding yang konsisten. Menyembunyikan seluruh gambar suatu bagian akan menyembunyikan bagian tersebut dari beranda.

**Simpan & terapkan** langsung memperbarui beranda; pengunjung melihat perubahan saat memuat halaman kembali. Konten bawaan tetap tersedia sampai ada penggantian melalui CRM. Menyembunyikan konten tidak menghapus file.

## Penyimpanan pada VPS

Set environment aplikasi dengan folder absolut yang tetap tersedia antar-release, misalnya:

```dotenv
MEDIA_UPLOAD_DIR=/var/lib/lembur-udjo/media
```

Buat folder tersebut dan beri izin baca/tulis kepada akun proses Node. Jika memakai Docker, mount volume permanen ke folder itu. Gunakan folder yang sama untuk semua proses aplikasi dan saat menjalankan migrasi. Cadangkan folder ini bersama database.

Jika `MEDIA_UPLOAD_DIR` belum diatur, aplikasi menggunakan folder `visual-kawasan` di direktori kerja, sama dengan lokasi bawaan koleksi sebelumnya. Sebelum mengganti lokasi, salin unggahan yang sudah ada dari folder lama ke folder baru agar URL gambar lama tetap berfungsi. Jangan menyimpan unggahan di dalam folder release yang akan dihapus saat deploy.

Pada Nginx, sediakan batas body yang cukup pada blok `server` atau `location` aplikasi:

```nginx
client_max_body_size 40m;
```

Unggah melalui CRM menerima JPG, PNG, atau WebP maksimal 8 MB dan 40 megapiksel. Server memeriksa isi gambar, memperbaiki orientasi, mengubahnya menjadi WebP, serta membatasi sisi terpanjang menjadi 2560 piksel. Payload membuat varian thumbnail, card, dan hero. File disajikan melalui `/api/visual-kawasan/file/...`.

Video memakai penyimpanan yang sama. Endpoint media Payload mendukung byte-range (`206 Partial Content`) untuk pemutaran video. Request upload dibatasi 38 MB ditambah overhead form (video 30 MB + gambar 8 MB); tiap file tetap memiliki batas sendiri. Pastikan reverse proxy menerima request 40 MB. Untuk Vercel, filesystem aplikasi bukan penyimpanan permanen dan upload melalui function memiliki batas tersendiri: dukungan produksi memerlukan object storage dan direct upload, bukan sekadar menaikkan batas form aplikasi.

## Migrasi dan rilis

Pemeriksaan isi video menggunakan dependency `file-type` yang juga digunakan Payload, sekarang dicatat sebagai dependency langsung. Gunakan konfigurasi database proyek yang sudah ada. Cadangkan database dan folder media, lalu terapkan migrasi sebelum menjalankan versi aplikasi yang baru:

```sh
node node_modules/payload/bin.js migrate
npm run lint
npm run build
```

Migrasi `20261008_081801_website_images` mendukung database baru maupun tabel `visual_kawasan` yang sebelumnya dibuat melalui dev push. Migrasi menambahkan metadata tanpa menghapus baris gambar atau tabel CRM. Rollback hanya menghapus metadata baru; tabel media dan unggahan dipertahankan. Rollback metadata menghilangkan penempatan dan perubahan teks/urutan/tampilan yang disimpan melalui fitur ini, jadi cadangkan database sebelum rollback.

Migrasi `20261015_120000_hero_video` menambah relasi video opsional pada banner. Gambar, file, dan metadata lama dipertahankan. Rollback migrasi ini melepaskan relasi video tanpa menghapus file media. Migrasi produksi tidak dijalankan otomatis oleh proses build.

Payload dapat menampilkan peringatan umum jika riwayat database berisi migrasi `dev`. Periksa daftar migrasi yang belum berjalan dan cadangan sebelum melanjutkan. Jangan gunakan `migrate:fresh` atau `migrate:reset` pada database berisi data. Konfigurasi `push: false` memastikan aplikasi tidak mengubah skema otomatis saat dijalankan dalam mode development.

## Akses dan kegagalan

API pengelolaan `/api/website-images` memerlukan sesi CRM. Penulisan melalui REST bawaan Payload memerlukan akun Payload yang terautentikasi. Foto bersifat publik agar pengunjung dapat melihatnya.

Jika database tidak tersedia, beranda menggunakan konten bawaan. CRM menampilkan pesan kegagalan dan mempertahankan daftar terakhir yang berhasil dimuat. Gangguan file atau salah konfigurasi folder penyimpanan perlu diperbaiki di VPS; fallback database tidak memulihkan file yang hilang.

## Verifikasi video

```sh
node --test tests/hero-video.test.mjs
npx tsc --noEmit --pretty false
npm run lint
```

Pengujian server menggunakan MP4/WebM contoh dan client database tiruan; tidak mengubah database proyek. Cakupannya meliputi format file, batas request, gambar cadangan, relasi video, pembaruan metadata, dan pembersihan video baru jika penyimpanan banner gagal. Uji browser komponen dengan API tiruan mencakup lebar 320, 390, dan 1280 piksel, upload/pratinjau/simpan, jeda video, serta fallback reduced motion, penghemat data, autoplay ditolak, dan file gagal dimuat. Pengujian tersebut tidak membuktikan konfigurasi storage atau migrasi produksi.
