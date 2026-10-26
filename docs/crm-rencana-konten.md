# Rancangan pengelolaan media sosial di CRM

Modul ini menambah dua menu: **Kalender konten** dan **Pillar konten**. Semua teks antarmuka menggunakan bahasa Indonesia dan mengikuti tampilan CRM yang sudah ada.

## Kalender konten

- Tampilan kalender bulanan di desktop dan agenda per tanggal di HP.
- Navigasi bulan sebelumnya/berikutnya dan tombol kembali ke bulan ini.
- Pencarian judul/caption; filter platform, status, dan pillar.
- Ringkasan jumlah konten bulan ini, draf, siap terbit, dan sudah terbit.
- Form tambah/edit: judul, caption, platform, tanggal/jam rencana tayang, status, dan pillar.
- Status: Ide, Draf, Siap terbit, Terjadwal, Terbit. Status dan jadwal mencatat rencana kerja tim; admin menerbitkan konten ke platform dan memperbarui status melalui CRM.
- Platform awal: Instagram, TikTok, Facebook, YouTube, dan WhatsApp.
- Loading, keadaan kosong, validasi, dan pesan keberhasilan/kegagalan.

## Pillar konten

- Kartu nama, deskripsi, warna penanda, dan jumlah konten terkait.
- Tambah/edit pillar tanpa mengubah konten lain.
- Contoh yang sesuai identitas Lembur Udjo: Budaya Sunda, Edukasi Angklung, Kehidupan Lembur, Program & Kunjungan, Cerita Pengunjung. Contoh ditampilkan sebagai saran; pembuatan data dilakukan oleh admin.

## Struktur data yang diusulkan

`social-pillars`: nama wajib, deskripsi, warna pilihan, waktu dibuat/diperbarui.

`social-content`: judul wajib, caption, platform wajib, rencana tayang wajib, status wajib, relasi ke pillar opsional, waktu dibuat/diperbarui.

Jadwal ditampilkan dalam WIB, dengan penyimpanan timestamp yang konsisten. API pengelolaan memerlukan sesi CRM; koleksi Payload menolak akses publik. Penambahan koleksi menunggu konfirmasi sesuai aturan perubahan skema proyek.

## Urutan implementasi

1. Koleksi, migrasi, validasi, dan API setelah struktur data disetujui.
2. Pengelolaan pillar dan form konten.
3. Kalender desktop, agenda mobile, filter, dan ringkasan.
4. Uji penyimpanan, relasi pillar, jadwal WIB, proteksi akses, lint, dan build.
