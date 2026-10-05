# PRD — Website Lembur Udjo Parahyangan

> **Status:** Draft v1.1 · **Pemilik:** Tim Lembur Udjo Parahyangan · **Terakhir diperbarui:** 5 Oktober 2026
> **Target peluncuran:** ± Agustus 2027 (10 bulan dari penyusunan ini)

> **Dokumen terkait:** [`docs/UIUX-lembur-udjo-parahyangan.md`](./UIUX-lembur-udjo-parahyangan.md) — design system, pola komponen, motion, dan checklist QA antarmuka.

### Riwayat revisi

| Versi | Tanggal | Perubahan |
| --- | --- | --- |
| v1.0 | 3 Okt 2026 | Draft awal. |
| v1.1 | 5 Okt 2026 | §6 disesuaikan dengan rute yang benar-benar ada; §7.1 menambahkan struktur beranda aktual (12 blok); §8 F-3 ditandai sudah tersedia; §10 diperbarui soal aset placeholder; ditambahkan referensi dokumen UI/UX. |


---

## 1. Ringkasan Eksekutif

Lembur Udjo Parahyangan adalah **cabang baru dari Saung Angklung Udjo** (berdiri 1966 oleh Abah Udjo / Udjo Ngalagena) yang berlokasi di **Kawasan Bale Pare, Kota Baru Parahyangan, Padalarang, Kab. Bandung Barat**. Kawasan ini dirancang sebagai *lembur* (kampung) Sunda terintegrasi: sawah, rumpun bambu, pertunjukan angklung, permainan rakyat, dan edukasi keberlanjutan (Agrowalk).

Website berfungsi sebagai **etalase digital utama** sebelum dan sesudah peluncuran: memperkenalkan warisan Saung Angklung Udjo, menjelaskan pengalaman yang ditawarkan, dan mengonversi pengunjung menjadi **reservasi tiket via WhatsApp** pada fase awal.

Landing page teaser HTML statik (`public/landing-pages/lembur-udjo.html`) sudah **dihapus**; peran teaser diambil alih sepenuhnya oleh situs Next.js di repo ini (Fase 1 live dari repo ini, bukan dari file terpisah).

## 2. Latar Belakang

- Saung Angklung Udjo (SAU) memiliki reputasi nasional/internasional; angklung diakui UNESCO sebagai Warisan Budaya Takbenda (2010).
- Cabang baru di Bale Pare akan diluncurkan ±10 bulan lagi; kawasan masih dalam tahap pengembangan (stiker di teaser: "Bale Pare · 2027").
- Kebutuhan utama saat prapeluncuran: membangun *awareness*, menampung kontak prospek (rombongan sekolah, komunitas, korporat), dan mendokumentasikan visi Abah Udjo sebagai narasi merek: **"Angklung to the World"**.
- Kebutuhan setelah peluncuran: jadwal & reservasi yang jelas, informasi akurat untuk pengunjung individu dan rombongan, serta kanal konten (galeri/jurnal) untuk SEO dan media sosial.

## 3. Tujuan & Metrik Sukses

| Tujuan | Metrik | Target (6 bulan pasca-launch) |
| --- | --- | --- |
| Menghasilkan reservasi | Chat WhatsApp masuk dari website | ≥ 300 chat/bulan |
| Membangun awareness prapeluncuran | Pengunjung unik teaser | ≥ 10.000/bulan saat launch |
| Terlacak & terukur | Konversi kunjungan → klik WA | ≥ 8% |
| Pencarian lokal | Posisi Google untuk "angklung bandung barat", "wisata edukasi padalarang" | Top 10 |
| Kepuasan informasi | Pertanyaan berulang yang terjawab oleh FAQ | ≥ 70% |

## 4. Audiens & Persona

1. **Keluarga Bandung Raya** (28–45) — cari wisata akhir pekan yang edukatif; akses via mobil; sensitif harga & parkir.
2. **Guru/Pihak sekolah** — rombongan study tour; butuh paket, jadwal, surat resmi, dan jalur komunikasi cepat (WA).
3. **Turis mancanegara & ekspatriat** — cari pengalaman budaya autentik; butuh konten **bahasa Inggris** dan lokasi yang mudah ditemukan.
4. **Komunitas seni & media** — mencari cerita merek, arsip sejarah, dan materi pers.
5. **Korporat/MICE** — sewa venue Bale Karesmen untuk acara (kapasitas 1.000+).

## 5. Positioning & Pesan Kunci

- **Tagline kawasan:** *Angklung to the World — Menanam Budaya, Memanen Masa Depan.*
- **Narasi warisan:** "Dari Abah Udjo (1966) untuk generasi berikutnya" — cabang baru, bukan imitasi.
- **Diferensiasi:** satu-satunya kawasan yang memadukan pertunjukan angklung interaktif + agrowalk keberlanjutan + arsitektur lembur Sunda di kawasan terencana (Kota Baru Parahyangan).
- **Bukti:** sejak 1966, UNESCO 2010, kapasitas 1.000+, 5 titik edukasi.

## 6. Sitemap & Struktur Informasi

**Jawaban singkat:** landing page satu-halaman saat ini **cukup untuk fase teaser** (H-10 s.d. H-3 bulan). Struktur multi-halaman baru diperlukan menjelang peluncuran. Rekomendasi bertahap:

### Fase 1 — Teaser (sekarang, situs ringan)

```
/                          Beranda satu halaman — 12 blok, lihat §7.1
/the-story-of-angklung     The Story of Angklung: asal-usul, linimasa,
                           jenis & cara memainkan
/inovasi                   Inovasi digital: QR "Dengarkan Warisan Suara"
/cms · /admin              Panel Payload CMS (koleksi Leads sudah aktif)

BELUM ADA — wajib ditambahkan segera (SEO dasar):
/sitemap.xml · /robots.txt
```

Catatan: `/sketchbook` ada di repo tetapi merupakan demo teknis pihak ketiga
(portfolio "Meng To") — **di luar IA produk**, jangan ditautkan dari navigasi.

```
Layanan pendukung (bukan halaman publik):
/api/*                     Reservasi/leads (Payload), auth, GraphQL
```

### Fase 2 — Situs penuh (H-3 bulan s.d. launch)

```
/                          Beranda (ringkasan + peta jalur kunjungan)
/tentang                   Sejarah SAU → Lembur Udjo, profil Abah Udjo, visi
/pengalaman                Indeks pengalaman
  /pengalaman/[slug]       Detail: pertunjukan-angklung, helaran, arumba,
                           workshop, agrowalk, kaulinan, bale-karesmen
/jadwal-tiket              Jadwal mingguan, harga paket, kanal reservasi
/galeri                    Foto & video (filter per kategori)
/jurnal                    Cerita budaya, agenda, siaran pers (SEO)
/faq                       FAQ lengkap (dipisah dari beranda)
/kontak                    Alamat, peta, jam operasional, formulir pesan
/privasi                   Kebijakan privasi
/404                       Halaman tidak ditemukan
```

### Fase 3 — Pasca-launch (opsional, sesuai permintaan)

```
/en/*                      Versi Inggris (hreflang) — bisa lebih awal jika target turis diprioritaskan
/tiket                     Booking online (pembayaran)
/merch                     Toko produk bambu/angklung
/virtual-tour              Tur 360° kawasan
/donasi                    Program palestarian bambu
```

**Navigasi global (Fase 2):** Beranda · Tentang · Pengalaman · Jadwal & Tiket · Galeri · Jurnal · Kontak + CTA tetap "Pesan via WhatsApp".

## 7. Spesifikasi Halaman (Fase 2)

| Halaman | Tujuan | Bagian utama | CTA utama |
| --- | --- | --- | --- |
| Beranda | Convince + orientasi cepat | Hero, highlight pengalaman, jadwal ringkas, visi, testimoni, peta | Tanpa CTA di hero (dihapus 5 Okt 2026); WhatsApp via navbar & popup |
| Tentang | Membangun trust warisan | Linimasa 1966→kini, Abah Udjo, relasi SAU, tim kurasi | Jelajahi Pengalaman |
| Pengalaman (indeks) | Eksplorasi | Kartu pengalaman, durasi, target usia | Detail per pengalaman |
| Detail pengalaman | Mengubah minat jadi rencana | Deskripsi, foto/video, durasi, jadwal terkait, FAQ mini | Pesan via WhatsApp |
| Jadwal & Tiket | Informasi operasional | Kalender mingguan, tabel harga (individu/rombongan), ketentuan | Reservasi (WA / formulir) |
| Galeri | Bukti visual | Mosaic foto, video pertunjukan, kredit fotografer | Ikuti Instagram |
| Jurnal | SEO & retensi | Artikel 800–1.500 kata, agenda | Berlangganan kabar |
| Kontak | Menjawab lokasi/logistik | Peta embed, rute dari tol, transportasi, kontak resmi | Buka Peta / WhatsApp |

### 7.1 Struktur Beranda — Fase 1 (aktual, 5 Okt 2026)

Beranda adalah **satu halaman** berisi 13 seksi + footer. Anchor di kolom ke-3 adalah
satu-satunya sumber kebenaran untuk tautan navigasi; setiap anchor wajib punya elemen
pembawa `id` yang sama persis.

| # | Blok | Anchor | Isi | CTA |
| --- | --- | --- | --- | --- |
| 1 | Hero | `#beranda` | 3 slide background (Ecoland / arsip / lanskap), H1 + deck | **tanpa CTA** — jalur konversi via navbar, drawer "Pesan Tiket", dan popup WA |
| 2 | Trending | *(tanpa id)* | 2 kartu tautan Instagram (kabar & tradisi) | Lihat di Instagram |
| 3 | Kutipan | `#kata` | Slider 3 kutipan + foto arsip Abah Udjo | — |
| 4 | Tentang & Visi | `#about`, `#visi` | Cerita 1966, 3 paragraf nilai; banner "Angklung to the World" | Pelajari Warisan Budaya → `/the-story-of-angklung` |
| 5 | Penghargaan | `#penghargaan` | Marquee 5 badge: Culture, Since 1966, Ecoland, UNESCO 2010, Hadir 2027 | — |
| 6 | Kaulinan | `#kaulinan` | 6 permainan tradisional (Congklak, Egrang, Gobak Sodor, …) | The Story of Angklung → |
| 7 | Fasilitas | `#fasilitas` | Carousel 6 kartu: Bale Karesmen, Workshop, Agrowalk, Konservasi Bambu, Peternakan, Area Hijau | Informasi Kunjungan → `#kontak` |
| 8 | Jadwal | `#jadwal` | 3 agenda: Pertunjukan 15.30, Helaran 10.00, Agrowalk 08.00–14.00 | Pilih Jadwal (interaktif) |
| 9 | Masterplan | `#masterplan` | Carousel denah kawasan (3 foto asli + arsip foto) | — |
| 10 | Siteplan | `#siteplan` | 12 zona bernama (Lawang Kori → Glamping) | — |
| 11 | Galeri | `#galeri` | Slider kartu foto per kategori | — |
| 12 | FAQ | `#faq` | 6 Q&A accordion (satu terbuka) | Masih Ada Pertanyaan? → WhatsApp |
| 13 | Peta | `#lokasi` | Embed Google Maps Bale Pare | — |
| — | Footer | `#kontak` | Navigasi cepat, telepon, email, alamat | Kembali ke Atas |

**Keputusan IA (5 Okt 2026):**

- `EcoTourismSection` dan `HeritageSection` **dihapus dari render** karena 3 dari 4 isinya
  identik dengan blok Fasilitas dan paragraf Tentang. Materi uniknya ("Agrowalk 5 titik
  edukasi", "Inovasi tradisi") dipindahkan ke dalam teks blok 7 dan 4.
- Masterplan dan Siteplan tetap **dua seksi terpisah** (dipertahankan atas permintaan pemilik).
- `ScheduleSection` diaktifkan karena seluruh menu "Pengalaman" dan "Informasi" mengarah ke `#jadwal`.
- Menu navigasi tidak boleh menautkan ke anchor yang tidak ada. Saat ini seluruh anchor
  di `Navbar.tsx` dan `Footer.tsx` terverifikasi ada di HTML hasil build.

**Pekerjaan tertunda (belum dikerjakan):**

- Galeri masih memakai 5 gambar `/placeholders/*` — **wajib diganti foto asli sebelum launch** (lihat §10).
- `/sitemap.xml` dan `/robots.txt` belum ada (lihat §6).


## 8. Kebutuhan Fungsional

- **F-1 CTA WhatsApp melayang:** tombol besar & responsive, **muncul hanya setelah pengunjung menggulir melewati ±80% layar pertama** (≈ lewat hero) dan kembali tersembunyi di puncak halaman; panel pesan terbuka otomatis 1,5 s (mobile 2,5 s) setelah tombol muncul. Ukuran FAB **standar 48 px (mobile) / 56 px (desktop)** — panel pesan yang diperbesar, bukan ikonnya. **Status:** sudah diimplementasikan (diperbarui 5 Okt 2026, sebelumnya memakai timer tetap). Pesan terisi otomatis.
- **F-2 Reservasi:** Fase 2 menyediakan formulir reservasi (nama, tanggal, jumlah orang, jenis individu/rombongan) yang meneruskan ke WhatsApp/email corsec; **tanpa pembayaran online**.
- **F-3 Jadwal:** jadwal mingguan (pertunjukan 15.30, helaran 10.00, agrowalk 08.00–14.00 Sel–Min) dikelola dari CMS agar mudah diperbarui. **Status Fase 1:** tampil di beranda (`#jadwal`), masih hardcoded di `components/ScheduleSection.tsx` — pemindahan ke CMS menunggu Fase 2.
- **F-4 Peta:** embed Google Maps kawasan Bale Pare + tombol "Buka Peta".
- **F-5 Galeri:** grid foto dengan lazy-load dan kredit; video YouTube/Vimeo embed.
- **F-6 FAQ:** daftar `details/summary`, satu terbuka pada satu waktu (sudah ada di teaser).
- **F-7 Formulir kontak/jurnal:** validasi dasar, spam protection (honeypot/reCAPTCHA), notifikasi email.
- **F-8 Multi-bahasa (Fase 3):** ID/EN dengan switcher dan `hreflang`.
- **F-9 Analitik:** GA4 + Meta Pixel; event `wa_click`, `view_jadwal`, `submit_reservasi`.

## 9. Kebutuhan Non-Fungsional

- **Performa:** LCP < 2,5 s di 4G, CLS < 0,1; gambar WebP/AVIF responsif; font di-host sendiri bila memungkinkan.
- **SEO:** metadata + Open Graph per halaman, `sitemap.xml`, `robots.txt`, data terstruktur (`TouristAttraction`, `Event`, `FAQPage`, `Organization`).
- **Aksesibilitas:** WCAG 2.1 AA — kontras, fokus terlihat, `prefers-reduced-motion` (sudah di teaser), alt text wajib.
- **Responsif:** breakpoint utama 480 / 640 / 860 / 940 / 1100 / 1200 px (mengikuti teaser).
- **Keamanan:** header keamanan standar, formulir dengan proteksi spam.
- **Perawatan:** konten jadwal & harga harus dapat diperbarui non-teknis (CMS).

## 10. Konten & Aset

- Foto arsip Abah Udjo (folder `public/arsip Abah Udjo/`) — perlu izin/kredit keluarga.
- Foto kawasan: `Hero.ecoland.jpg`, `LUP.png`, `Masterplan.jpg`, `Masterplan2.jpg`, `Masterplan3.jpg` sudah asli.
- **Masih placeholder (`public/placeholders/`, 13 berkas)** — dipakai oleh blok Fasilitas,
  Galeri, Jadwal, Trending, dan `/the-story-of-angklung`: `bale-karesmen`, `workshop`,
  `agrowalk`, `konservasi-bambu`, `peternakan-edukasi`, `area-hijau`, `angklung`,
  `wayang`, `founder`, `education`, `helaran`, `arumba`, `hero` —
  **wajib diganti foto asli sebelum launch**.
- Naskah: teaser sudah memuat copy ID; versi EN ditulis ulang (bukan terjemahan mesin).
- Video: rekaman pertunjukan interaktif (1–2 menit) untuk hero Fase 2.
- Data faktual: jadwal, harga, kapasitas, jam operasional — divalidasi pihak kawasan.

## 11. Teknologi

- **Repo ini:** Next.js (App Router) + Payload CMS — dipakai untuk Fase 2+; koleksi: `Pengalaman`, `Jadwal`, `Artikel`, `Galeri`, `FAQ`, `Pengaturan Global`.
- **Teaser:** sudah tidak berupa HTML statik — halaman teaser lama dihapus, digantikan situs Next.js ini (satu build, satu sumber kebenaran).
- **Hosting:** Vercel (sudah ada folder `.vercel`).
- **Domain:** disarankan domain sendiri, mis. `lemburudjo-parahyangan.id` atau subdomain `balepare.saungangklungudjo.com` (menunggu keputusan — lihat Open Questions).

## 12. Timeline 10 Bulan (Okt 2026 → Agu 2027)

| Bulan | Milestone |
| --- | --- |
| 1 (Okt) | Teaser live + SEO dasar (sitemap.xml, robots, OG, GA4) · kumpulkan foto arsip & izin |
| 2 (Nov) | Riset harga & jadwal final · retouch foto · desain sistem visual (fase 2) |
| 3 (Des) | Struktur CMS + koleksi · desain halaman kunci (beranda, pengalaman, jadwal) |
| 4 (Jan) | Development Fase 2: beranda, tentang, pengalaman |
| 5 (Feb) | Development: jadwal-tiket, galeri, kontak, FAQ |
| 6 (Mar) | Konten jurnal 6 artikel pertama · versi EN mulai |
| 7 (Apr) | QA: aksesibilitas, performa, SEO teknis · uji reservasi end-to-end |
| 8 (Mei) | Soft launch (undangan, rombongan terbatas) · perbaikan dari umpan balik |
| 9 (Jun) | Persiapan kampanye peluncuran · finalisasi foto asli kawasan |
| 10 (Agu) | **Publik launch** — paralel dengan pembukaan kawasan |

## 13. Risiko & Mitigasi

| Risiko | Mitigasi |
| --- | --- |
| Jadwal/harga berubah saat konstruksi kawasan | Data operasional dikelola dari CMS, satu sumber kebenaran |
| Foto asli belum tersedia | Placeholder bergaya + jadwalkan sesi foto di bulan 9 |
| Chat WA melebihi kapasitas corsec | Template balasan cepat + jam layanan chat yang diterbitkan |
| Tumpang-tindih merek dengan SAU | Halaman Tentang menjelaskan relasi induk–cabang secara eksplisit |

## 14. Di Luar Lingkup (untuk saat ini)

- Pembayaran/ticketing online penuh (Fase 3)
- Aplikasi mobile native
- Multibahasa > 2 bahasa
- Integrasi OTA (Traveloka, Tiket.com) — dievaluasi pasca-launch

## 15. Pertanyaan Terbuka

1. Domain resmi: domain baru atau subdomain dari saungangklungudjo.com?
2. Tiket dibeli di lokasi saja saat launch, atau perlu prapenjualan?
3. Siapa penanggung jawab validasi jadwal/harga di sisi kawasan?
4. Kapan foto & video profesional kawasan tersedia?
5. Versi EN diprioritaskan lebih awal (target turis) atau tetap Fase 3?

---

**Persetujuan:**

| Peran | Nama | Tanda tangan/Tanggal |
| --- | --- | --- |
| Pemilik produk | | |
| Perwakilan kawasan | | |
| Pelaksana teknis | | |
