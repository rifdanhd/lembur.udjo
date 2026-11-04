# UI/UX Preview — Angklung Journey

**Tanggal:** 4 November 2026  
**Status:** Draft untuk review (bukan rilis publik)  
**Branch:** `design/angklung-journey-preview-20261104`  
**Pull request:** #1  
**Target:** Website Lembur Udjo Parahyangan

## Acuan editorial

Section `#angklung-journey` mengikuti tepat empat bab dalam Master Storytelling Document:

1. **Ritual & Tradisi** — akar hubungan manusia, alam, bambu, dan kebudayaan.
2. **Daeng Soetigna** — pembaruan angklung diatonis pada 1938 serta perluasan ruang pendidikan dan musik.
3. **Udjo Ngalagena** — pendirian Saung Angklung Udjo bersama Uum Sumiati pada 1966, dengan pendidikan, pertunjukan, dan edutainment.
4. **Lembur Udjo Parahyangan** — kelanjutan kreatif dengan prinsip **Keep the Old, Create the New**.

Copy diimplementasikan sebagai narasi kuratorial website, bukan kutipan langsung tokoh sejarah. Klaim sejarah tetap perlu pemeriksaan akhir oleh pemilik materi sebelum publikasi.

## Implementasi

- Section diletakkan sesudah About dan sebelum Heritage Badges.
- Empat kartu menggunakan urutan angka 01–04 dan judul final di atas.
- Setiap bab memiliki transisi naratif menuju bab berikutnya agar alurnya terbaca sebagai perjalanan, bukan katalog fasilitas.
- Visual memakai aset repository yang tersedia:
  - Bab I: konservasi bambu.
  - Bab II: workshop merakit bambu.
  - Bab III: arsip Abah Udjo.
  - Bab IV: `LUP.png`, diberi alt text sebagai **visualisasi rencana kawasan**, bukan dokumentasi kondisi operasional.
- Masterplan dan Siteplan tetap dirender sebagai section terpisah di homepage.
- Tidak mengubah `ComingSoon.tsx`, konfigurasi environment, layanan booking, API, database, atau main branch.
- Tidak menambahkan jadwal, janji tanggal pembukaan, atau penjualan tiket.

## Arahan visual dan responsif

- Mempertahankan sistem warna forest/cream dan tipografi editorial existing.
- Desktop/tablet memakai grid dua kolom; layar kecil turun menjadi satu kolom.
- Foto tetap menjadi pembawa suasana, sementara copy menjaga konteks historis tetap ringkas.
- Hover bukan satu-satunya cara memahami konten; transisi gambar memiliki dukungan `motion-reduce`.
- Heading, daftar berurutan, alt text, fokus keyboard, dan kontras perlu diperiksa kembali pada preview browser.

## Batas penggunaan aset

Foto arsip dan foto kegiatan harus memiliki izin penggunaan yang sesuai. Aset visualisasi LUP tidak boleh dipresentasikan sebagai foto kawasan yang sudah beroperasi. Jika tersedia foto otentik yang telah disetujui, aset dapat diganti tanpa mengubah struktur empat bab.

## Checklist sebelum merge

- [ ] `npm ci`
- [ ] `npx tsc --noEmit`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] Uji pada 320, 375, 768, 1024, dan 1440 px.
- [ ] Uji scroll, anchor `/#angklung-journey`, dan navigasi keyboard.
- [ ] Validasi foto, hak penggunaan, copy historis, dan kontras.
- [ ] Pastikan Coming Soon tetap aktif pada production.
- [ ] Deploy hanya ke preview terpisah bila diperlukan untuk persetujuan UI.
- [ ] Merge hanya setelah review dan persetujuan pemilik produk.

## Status verifikasi

Perubahan kode sudah diperbarui pada branch draft. Build, lint, dan uji browser/responsif belum dianggap terbukti sampai dijalankan pada checkout branch yang sama. PR tetap draft dan belum merge/deploy publik.
