# UI/UX Preview — Angklung Journey

**Tanggal:** 4 November 2026  
**Status:** Draft untuk review (bukan rilis publik)  
**Branch:** `design/angklung-journey-preview-20261104`  
**Target:** Website Lembur Udjo Parahyangan

## Tujuan
Memperkuat storytelling dari alam dan bambu menjadi angklung hingga pengalaman budaya hidup. Referensi kualitas pengalaman: website destinasi berbasis alam, termasuk EIGER Nature. Tidak menyalin identitas, konten, maupun susunan khas situs referensi.

## Batas perubahan tahap pertama
- Memakai sistem warna `forest` dan `cream`, tipografi editorial, dan aset yang sudah ada.
- Membuat seksi `#angklung-journey`, disisipkan sesudah About dan sebelum Heritage Badges.
- Empat bab: **Dari Alam**, **Menemukan Nada**, **Jejak Abah Udjo**, **Lembur yang Hidup**.
- Menambah tautan Angklung Journey di navigasi Pengalaman.
- Menghilangkan navigasi ke `#jadwal` yang tidak dirender di `app/(site)/page.tsx`; informasi kelompok diarahkan ke `#kontak` sampai data jadwal/tiket resmi tersedia.
- Tidak mengubah `ComingSoon.tsx`, konfigurasi environment, layanan booking, API, database, atau main branch.

## Pilihan desain
- Hero utama existing dibiarkan tetap; konten naratif dibuat sebagai seksi tersendiri.
- Struktur halaman Masterplan dan Siteplan tetap terpisah.
- Grid foto bertingkat, dengan detail empat tahap; responsive dua kolom pada tablet/desktop, satu kolom pada layar kecil.
- Foto yang sudah ada di repo adalah visual pendukung, **bukan klaim foto dokumentasi operasional LUP**. Foto dan hak pemakaiannya perlu diverifikasi sebelum rilis.
- Komponen mengandalkan HTML semantik `section`, `ol`, `article`; heading dan alt text eksplisit; hover tidak menjadi satu-satunya cara memahami konten.
- Animasi terbatas pada hover gambar dengan `motion-reduce`; tanpa autoplay atau video tambahan.

## Keputusan editorial yang perlu divalidasi
1. Kalimat “Sebelum menjadi musik, angklung adalah doa” adalah narasi kuratorial/tagline yang diusulkan, bukan kutipan historis yang diatribusikan kepada Abah Udjo.
2. Finalisasi nama program dan fasilitas melalui pemilik produk; pertunjukan bernama **Karesmen Udjo**, gedung **Bale Pinton** (kapasitas 500 menurut brief), dan Agrowalk sesuai rute kawasan.
3. Jadwal launching Juni/Juli 2027 adalah target internal yang dapat berubah, sehingga tidak dijadikan janji tanggal spesifik pada section.
4. Tahap ini **belum mengaktifkan penjualan tiket** atau menjanjikan ketersediaan.
5. Identitas visual diperluas tanpa mengganti logo dan sistem warna existing.

## Checklist verifikasi sebelum merge
- [ ] `npm ci`, `npx tsc --noEmit`, `npm run lint`, `npm run build`
- [ ] Periksa pada 320, 375, 768, 1024, 1440 px.
- [ ] Scroll dan keyboard navigation berjalan baik; menu Angklung Journey menuju `#angklung-journey`.
- [ ] Semua foto tampil; foto arsip memiliki izin penggunaan.
- [ ] Semua copywriting dikonfirmasi pengelola.
- [ ] `prefers-reduced-motion` dan kontras warna diperiksa manual.
- [ ] Pastikan Coming Soon tetap muncul di production selama flag lingkungan masih aktif.
- [ ] Deploy *branch preview* ke URL terpisah untuk persetujuan UI, tanpa mengganti DNS domain utama.
- [ ] Uji kontak WhatsApp dan alur yang belum mempunyai jadwal operasional resmi.
- [ ] Merge setelah review dan approval pemilik produk.

## Catatan risiko existing
Dokumentasi PRD/UIUX tertanggal 5 Oktober 2026 tidak sepenuhnya sama dengan kode `main` pada 4 November 2026; khususnya `ScheduleSection` disebut aktif dalam dokumen lama, tetapi tidak dirender oleh homepage yang diperiksa. Dokumentasi perlu diselaraskan setelah desain disetujui.
