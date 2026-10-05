# UI/UX Specification — Lembur Udjo Parahyangan

> **Status:** v1.0 · **Tanggal:** 5 Oktober 2026
> **Berkaitan dengan:** [`PRD-lembur-udjo-parahyangan.md`](./PRD-lembur-udjo-parahyangan.md) §7.1 (struktur beranda)
> **Sumber kebenaran:** nilai di dokumen ini **diambil dari kode yang berjalan**. Jika kode berubah, dokumen ini yang harus disesuaikan — bukan sebaliknya.

---

## 1. Prinsip

| # | Prinsip | Konsekuensi praktis |
| --- | --- | --- |
| P1 | **Budaya dulu, produk belakangan.** | Hero membuka dengan tempat & suara, bukan daftar harga. Tidak ada tarif di layar pertama. |
| P2 | **Satu halaman, sedikit pilihan.** | Beranda = 13 seksi + footer (PRD §7.1). Setiap blok punya satu tujuan dan satu CTA utama. |
| P3 | **CTA selalu WhatsApp.** | Seluruh jalur konversi berakhir di `wa.me/6281219279765`. Tidak ada form checkout di Fase 1. |
| P4 | **Jangan mengulang.** | Satu informasi hanya muncul sekali di beranda. Materi duplikat dipangkas (lihat §12). |
| P5 | **Gerak sebagai penekanan, bukan hiasan.** | Animasi hanya dipakai untuk memperkenalkan judul & memperjelas hierarki. Semua efek wajib bisa dimatikan (`prefers-reduced-motion`). |

---

## 2. Design tokens

### 2.1 Warna

Didefinisikan di `app/(site)/globals.css` → `@theme`.

| Token | Hex | Peran |
| --- | --- | --- |
| `forest` | `#0d2317` | Latar gelap utama (hero, footer, blok gelap) |
| `forest-light` | `#163826` | Permukaan gelap sekunder, kartu di atas latar gelap |
| `cream` | `#fcfaf6` | Latar terang utama (sebagian besar seksie) |
| `bamboo` | `#8b6914` | Aksen logam/serat bambu (garis, label kecil) |
| `emerald-400` | `#34d399` | Aksen terang di atas gelap (label "budaya", data) |
| `emerald-600` | `#059669` | Aksen terang sekunder |
| `#14532d` | — | Judul sekunder di blok terang (About) |
| `#25D366` | — | Tombol WhatsApp (hover `#1eb857`) |
| `stone-950` | `#0c0a09` | Overlay hero / teks terkuat di atas terang |

Skala netral memakai Tailwind `stone-*` bawaan:

`50 #fafaf9` · `100 #f5f5f4` · `200 #e7e5e4` · `300 #d6d3d1` · `400 #a8a29e` · `500 #78716c` · `600 #57534e` · `950 #0c0a09`

**Rasio kontras terhadap `cream` (#fcfaf6) — hasil pengukuran:**

| Pemakaian | Rasio | Status |
| --- | --- | --- |
| `forest` (teks utama) | 15.86 : 1 | AA ✓ |
| `#14532d` | 8.74 : 1 | AA ✓ |
| `stone-600` (deskripsi kartu) | 7.32 : 1 | AA ✓ |
| `stone-500` (aksen ikon, body) | 4.60 : 1 | AA ✓ (mepet) |
| `emerald-400` di atas `forest` | 8.60 : 1 | AA ✓ |
| **`stone-400` (label HeritageBadges, teks footer)** | **2.42 : 1** | **GAGAL AA** — lihat §12 |
| **`stone-300` (nomor kartu `01`–`06` di atas putih)** | **1.49 : 1** | **GAGAL AA** — lihat §12 |

### 2.2 Tipografi

| Token | Font | Pemakaian | Catatan |
| --- | --- | --- | --- |
| `font-tan` | **TAN MERINGUE** (lokal, `app/(site)/fonts/TAN-MERINGUE-Regular.otf`) | 35× — semua judul seksie | **Lihat §3 — aturan wajib** |
| `font-playfair` | Playfair Display | 8× — kutipan, teks editorial | |
| `font-jakarta` / `font-sans` | Plus Jakarta Sans | body, UI, tombol | Bahasa Indonesia punya akurasi glyph terbaik |
| `font-lobster` | Lobster | 3× — aksen tulisan tangan | |
| `font-cinzel` | Cinzel Decorative | 1× — cek: masih dipakai? | Kandidat dihapus bila tidak terpakai |

**Skala ukuran yang dipakai** (bukan skala tipografi formal, melainkan nilai aktual di kode):

| Elemen | Nilai | Berat | Transform / Tracking |
| --- | --- | --- | --- |
| Eyebrow / label | `text-[10px]` → `text-[11px]` | `font-extrabold` | `uppercase` · `tracking-[0.2em]`–`tracking-[0.25em]` |
| Judul H2 (TAN MERINGUE) | `text-2xl` (24) → `sm:text-3xl` (30) → `md:text-4xl` (36) atau `md:text-5xl` (48) | 400 (satu-satunya weight) | `uppercase` |
| Deck / lede | `text-sm` (16) → `md:text-base` (18) | `font-medium` | `leading-relaxed` |
| Body & deskripsi kartu | `text-xs` (12) → `sm:text-sm` (14) → `md:text-base` (16) | 400/500 | `leading-relaxed` |
| Tombol & CTA | `text-[11px]`–`text-sm` | `font-extrabold` | `uppercase` · `tracking-wider` |

### 2.3 Layout

| Token | Nilai |
| --- | --- |
| Container | `max-w-6xl` (1152 px) + `px-4 sm:px-6 lg:px-8` |
| Padding seksie vertikal | `py-12` (48) → `sm:py-16` (64) → `md:py-20` (80) |
| Radius kartu | `rounded-xl` · `rounded-2xl` · `rounded-3xl` |
| Radius pill/tombol | `rounded-full` |
| **Scroll offset anchor** | `scroll-margin-top: 80px` untuk `section, [id]` — cocok dengan tinggi navbar `h-16`/`h-20` |
| Scroll behavior | `html { scroll-behavior: smooth }` |

### 2.4 Breakpoint

Didefinisikan di `@theme` (`app/(site)/globals.css:4`):

| Prasetel | Rem | px |
| --- | --- | --- |
| `sm` | 40rem | 640 |
| `md` | 48rem | 768 |
| `lg` | 64rem | 1024 |
| `xl` | 80rem | 1280 |
| `2xl` | 96rem | 1536 |

> **Selisih dengan PRD §9:** PRD menyebut 480 / 640 / 860 / 940 / 1100 / 1200 px (diwarisi dari situs teaser). Kode memakai skala Tailwind default di atas. **Pilih salah satu** sebelum Fase 2 — saat ini **kode yang menang.**

---

## 3. ATURAN KRITIS — line-height TAN MERINGUE

TAN MERINGUE adalah font display dengan **bounding box yang sangat tinggi**. Metriknya (unitsPerEm 1000):

```
ascent    1010   → 1.010 em
descent    341   → 0.341 em
cap height 1000  → 1.000 em  (ink tertinggi 'd' = 1010 → 1.010 em)
ink terendah ('g','y') = -320 → 0.320 em di bawah baseline
```

**Extent vertikal glyph = 1.330 em.**
`line-height` minimal yang aman = `1.010 + 0.341 = 1.351 em`.

### Akar bug "tulisan terpotong"

`MaskText` membungkus setiap kata dengan `<span class="overflow-hidden">` untuk animasi reveal. Jika `line-height` elemen lebih kecil dari **1.351 em**, box-nya lebih pendek dari glyph-nya → **bagian atas huruf terpotong oleh `overflow-hidden`**.

Heading di kode memakai `leading-[1.05]` s/d `leading-tight` (1.25). Tanpa koreksi, cap-height `d` naik **0.14 em di luar** clip box.

### Perbaikan yang berlaku (5 Okt 2026)

`components/anim/MaskText.tsx:79`

```diff
- <span className="inline-block overflow-hidden pb-[0.18em] -mb-[0.18em]">
+ <span className="inline-block overflow-hidden leading-[1.36] -mb-[0.19em]">
```

Hasil perhitungan (diukur terhadap baseline B, satuan em):

| Nilai | | Status |
| --- | --- | --- |
| Box clip atas | `-1.1700` | |
| Cap top huruf `d` | `-1.1655` | **+0.0045 em ruang aman** ✓ |
| Baseline kata | `0` (satu garis) | |
| Ink terendah `g/y` | `+0.1645` | |
| Box clip bawah | `+0.1900` | **+0.0255 em ruang aman** ✓ |
| Jarak baris (leading h2 1.05) | `1.3605` | vs extent `1.330` — **+0.0305 aman, tidak tumpang tindih** ✓ |
| Geseran posisi baseline | `0.035 em` | ≈ 1.3 px pada 36 px — tak terlihat ✓ |

**Aturan untuk kontributor:**

1. **Setiap** elemen pembawa TAN MERINGUE yang pakai `overflow-hidden` **wajib** punya `line-height ≥ 1.36`.
2. Jangan mengganti `leading-*` judul ke nilai `< 1.36` tanpa mengulang perhitungan di atas.
3. `yPercent: 115` pada animasi reveal masih cukup (mask hanya 1.36 em tinggi, kata naik dari `yPercent 115` = 1.564 em) — jangan dinaikkan, akan membuat kata "muncul dari bawah box yang terlalu jauh".

---

## 4. Pola komponen

### 4.1 Section header (pola dominan)

Dipakai oleh hampir semua seksie — jangan menemukan pola baru:

```tsx
<div className="max-w-3xl mb-10 md:mb-14">
  <p className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.25em] text-stone-500 mb-3">
    {eyebrow}
  </p>
  <h2 className="font-tan text-3xl md:text-4xl lg:text-5xl uppercase leading-[1.05]">
    <MaskText text={judul} />
  </h2>
  <p className="mt-4 text-sm md:text-base text-stone-600 leading-relaxed">
    {lede}
  </p>
</div>
```

Urutan wajib: **eyebrow → judul → lede**. Eyebrow selalu `uppercase` + `tracking ≥ 0.2em`.

### 4.2 Kartu (unggul → berat)

Terang: `bg-white border border-stone-200 rounded-xl p-4 shadow-sm`
Gelap: `bg-forest-light/70 border border-white/10 rounded-xl p-4 backdrop-blur-sm`

Isi: **label kecil → judul → deskripsi 1–2 baris → CTA/link**. Jangan ada kartu dengan lebih dari satu tombol primer.

### 4.3 Carousel horizontal (snap)

Dipakai: `TrendingCarousel`, `FacilitiesSection`, `SiteplanSection`.

```
container: overflow-x-auto snap-x snap-mandatory no-scrollbar  →  px-4
items:     snap-start shrink-0  (lebar tetap / basis persen)
kontrol:   tombol ←/→ memanggil scrollBy(±0.85 × clientWidth, smooth)
edge:      scrollLeft <= 4 → tombol kiri disabled (opacity-30 cursor-not-allowed)
```

- **Tidak ada** autoplay pada carousel jenis ini.
- Tombol panah wajib punya `aria-label` ("Sebelumnya" / "Berikutnya").
- Helper `no-scrollbar` ada di `globals.css:114`.

### 4.4 Carousel full-bleed (ada autoplay + swipe)

Dipakai: `HeroSection`, `QuotesSection`, `MasterplanSection`.

| Properti | Hero | Quotes | Masterplan |
| --- | --- | --- | --- |
| Interval | **7000 ms** | **6000 ms** | **8000 ms** |
| Tick progress | 50 ms | 50 ms | 50 ms |
| Swipe threshold | 40 px | 40 px | 40 px |
| Jeda saat hover/touch | ✓ `paused` | ✓ `paused` | ✓ `paused` |
| Indikator progres | bar bawah | titik | titik/label |
| CTA di dalam slide | ✓ | — | — |

**Wajib ada** untuk jenis ini: mekanisme jeda (hover, fokus, interaksi) — sudah terpenuhi. Lihat §12 untuk celah `prefers-reduced-motion`.

### 4.5 Marquee

`HeritageBadges` — `.marquee-track` animasi `@keyframes marquee` (globals.css:89), durasi **50 s linear infinite**, `animation-play-state: paused` saat hover, ujung dibuat luntur dengan mask gradasi, dan **dimatikan total** pada `prefers-reduced-motion: reduce` (globals.css:108).

### 4.6 Accordion (FAQ)

`FaqSection` — satu item terbuka pada satu waktu (`openIndex`, default `0`).
Wajib: `aria-expanded`, `aria-controls`, `id` panel. Pertanyaan `font-playfair`, jawaban `text-stone-600 text-sm md:text-base leading-relaxed`.
Tidak ada autoplay → patuh terhadap WCAG 2.2.2.

### 4.7 Anchor & scrollspy

- Semua id di satu tempat: lihat PRD §7.1.
- `Navbar` menandai link aktif dengan garis bawah `bamboo`/`forest`.
- **Aturan:** setiap `href="#x"` di `Navbar.tsx` / `Footer.tsx` wajib cocok dengan `id="x"` di HTML build. Sudah diverifikasi 5 Okt 2026.
- Fallback tambahan: rule global `section, [id] { scroll-margin-top: 80px }`.

### 4.8 Popup WhatsApp

`components/WhatsAppPopup.tsx` — *muncul di saat yang tepat, bukan mengganggu*:

| Fase | Pemicu | Perilaku |
| --- | --- | --- |
| Tombol FAB | **digulir melewati ±80% layar pertama** (≈ lewat hero); `min 320 px` | fade-in + translate-y (500 ms); **kembali tersembunyi** bila digulir ke puncak halaman; `z-30`, inset `env(safe-area-inset-bottom)` |
| Panel pesan | **+1500 ms** setelah FAB muncul (mobile **+2500 ms**) | `animate-[fadeInUp_0.3s]`, dapat ditutup, terbuka lagi saat FAB muncul ulang |
| Tutup panel | kapan saja | tombol `aria-label="Tutup"` tap-area **40 × 40 px** |

**Ukuran (disesuaikan 5 Okt 2026):**

| Elemen | Nilai |
| --- | --- |
| FAB | **standar** — 48 px (≤639) / 56 px (≥640), ikon 24/28 px, `hover:scale-110 active:scale-95` |
| Panel | **diperbesar** — 384 px (`min(24rem, …)`) · 320 px (`sm`) · 368 px (`md`), radius `rounded-3xl` |
| Judul panel | `text-sm sm:text-base` |
| Body panel | `text-sm` |
| Tombol chat | `text-xs sm:text-[13px]` · `px-6 py-3.5` · `min-h-[48px]` |
| Jarak dari tepi | `16 px` / `32 px` |

> Aturan: **icon FAB = standar (48/56 px)**; yang diperbesar hanya **panel pesan**.

Posisi memakai listener `scroll` `passive: true` + `resize`; threshold dihitung ulang setiap event sehingga tetap benar setelah rotate/resize. SSR aman (state awal `false`, tanpa akses `window` di render).


---

## 5. Motion & animasi

### 5.1 Inventaris

| Efek | Komponen | Parameter | Trigger | Reduced-motion |
| --- | --- | --- | --- | --- |
| **MaskText reveal** | 15 komponen | `yPercent 115 → 0`, durasi **1 s**, `stagger 0.05`, `power4.out` | `start: "top 88%"`, `once: true` | ✓ diabaikan (teks tetap tampil) |
| **MaskText parallax** | idem | `y: 0 → -36`, `scrub: true` | `start: "top 12%"`, `end: "+=160"` | ✓ diabaikan |
| **Reveal (fade+slide)** | `QuotesSection` (3), `CompanyProfileSection` (5) | `y: 32 → 0`, durasi **0.85 s**, `power3.out` | `start: "top 85%"`, `once: true` | ✓ diabaikan |
| **Reveal `wipe`** | varian | `clipPath inset(100% 0 0 0) → inset(0)` + `scale 1.15 → 1` | idem | ✓ diabaikan |
| **Reveal `parallax`** | varian | `y` mengikuti scroll (`scrub`) | idem | ✓ diabaikan |
| **Hero text scroll-fade** | `HeroSection:112` | `y: 0 → -48`, `autoAlpha → 0` | scrub saat hero tergulir | ✓ diabaikan |
| **Marquee** | `HeritageBadges` | 50 s linear | kontinu, pause saat hover | ✓ `animation: none` |
| **Autoplay slide** | Hero/Quotes/Masterplan | lihat §4.4 | interval | ✗ **tidak dicek** — §12 |
| **Drawer nav** | `Navbar` | `fadeInUp` / `navEnter` | klik menu | ✗ tidak dicek |

Semua GSAP wajib lewat `gsap.matchMedia()` / `gsap.context()` dan di-`revert()` saat unmount.

### 5.2 Durasi & easing

- **Judul:** 1.0 s / `power4.out` — berat, teatrikal, sesuai brand.
- **Konten:** 0.85 s / `power3.out`.
- **UI (hover, drawer, popup):** 0.15–0.5 s, `ease-out`.
- **Jangan** memakai easing `bounce`/`elastic` — tidak sesuai register budaya.

### 5.3 Prinsip gerak

1. **Maksimal dua lapis animasi** per viewport (mis. mask-reveal judul + fade kartu).
2. Tidak ada elemen yang bergerak sambil dibaca (kecuali marquee, yang harus `paused` saat hover).
3. Jangan animasikan `height`/`top` — gunakan `transform` & `opacity` saja.
4. Konten **tidak pernah** hanya muncul akibat animasi: jika JS gagal, teks harus tetap terbaca. (MaskText aslinya `opacity-0` hanya saat GSAP hidup — pastikan fallback ini dipertahankan.)

---

## 6. Responsif — perilaku per blok

| Blok | ≤640 px | 641–1024 px | ≥1025 px |
| --- | --- | --- | --- |
| Hero | 1 slide, deck 2 baris, 2 CTA menumpuk | 3 slide aktif | parallax + 2 CTA berdampingan |
| Trending | 1 kartu, scroll snap | 2 kartu | 2 kartu |
| Fasilitas | 1 kartu/scroll, sembunyikan arrow | 1.5–2 kartu + arrow | 3 kartu + arrow |
| Masterplan / Siteplan | 1 kartu/scroll + label | 2 kartu | 3 kartu + label besar |
| Galeri | swipe + titik | swipe + arrow | arrow |
| Penghargaan | marquee | marquee | marquee |
| FAQ | 1 kolom, tepi penuh | 1 kolom terpusat | 1 kolom terpusat (maks `2xl`) |
| Jadwal | menumpuk + tombol penuh | 3 kolom ringkas | 3 kartu + CTA |
| Peta | embed penuh + tombol arah | embed + arah | embed + arah |

**Aturan umum:**
- Setiap carousel wajib bisa dioperasikan dengan **satu jari** (scroll snap, bukan hover).
- Tombol minimal 44 × 44 px.
- Tidak ada teks `text-[10px]` untuk body di layar apa pun — `10px` hanya untuk eyebrow.

---

## 7. Aksesibilitas

### Sudah baik

| Aspek | Bukti di kode |
| --- | --- |
| Alt text gambar | **Semua 17 `<img>` di komponen beranda punya `alt`** — 5 di antaranya `alt=""` + `aria-hidden` (dekoratif) ✓ |
| Ikon dekoratif | `aria-hidden="true"` pada SVG ikon |
| Label tombol ikon | `aria-label` pada tombol panah carousel, tombol drawer, tombol tutup popup, FAB WhatsApp |
| FAQ | `aria-expanded` + `aria-controls` + `id` panel |
| Embed peta | `title` pada `<iframe>` |
| Reduced motion | MaskText, Reveal, marquee, parallax hero |
| Fokus keyboard | `focus-visible` pada link nav & tombol utama |
| Scroll offset | anchor tidak tersembunyi di balik navbar |

### Perlu ditangani

Lihat **§12 — Utang UI/UX**.

---

## 8. Copy & konten

- **Bahasa utama:** Indonesia. EN hanya untuk label/brand singkat ("Angklung to the World").
- **Eyebrow:** selalu 1–3 kata, `UPPERCASE`, tracking lebar. Contoh: `WARISAN BUDAYA SEJAK 1966`, `JADWAL KUNJUNGAN`.
- **Judul:** pendek (2–4 kata) — karena TAN MERINGUE `UPPERCASE` + ukuran besar, judul panjang akan pecah jelek.
- **Deskripsi:** maksimal 2 baris pada desktop, 3 baris pada mobile.
- **Angka & waktu** ditulis konsisten: `15.30` (titik), `Sel–Min` (singkat), tahun `1966`.
- **Tombol:** kerja kata kerja + objek — `Pesan Tiket`, `Pelajari Warisan Budaya`, `Informasi Kunjungan`, `Pilih Jadwal`. Hindari `Klik Di Sini`, `Selengkapnya`.
- **Kutipan Abah Udjo** muncul **satu kali saja** di beranda (seksi Kutipan). Jangan diulang di blok Visi.
- **Nama produk:** `Lembur Udjo Parahyangan` pada konteks resmi; `Lembur Udjo` setelahnya.

---

## 9. Funnel konversi (Fase 1)

```
Layar 1   Sticky nav         ──► "Pesan Tiket" ─────────┐
          FAB + panel WA     ──► WhatsApp   (muncul setelah scroll >80% layar)
          Drawer (mobile)    ──► "Pesan Tiket" ─────────┤
          Fasilitas          ──► #kontak ───────────────┤
          FAQ                ──► WhatsApp ──────────────┤
          Footer             ──► WhatsApp ──────────────┤
                                                   ▼
                                           wa.me/6281219279765

   Hero tidak punya CTA (dihapus 5 Okt 2026).
```

**Pesan WhatsApp selalu di-prefill** (bukan pesan kosong):

```
https://wa.me/6281219279765?text=Halo%20Lembur%20Udjo,%20saya%20ingin%20pesan%20tiket
https://wa.me/6281219279765?text=Halo%20Lembur%20Udjo,%20saya%20ingin%20tanya%20informasi
```

Ubah pesan sesuai konteks klik, tetapi **jangan pernah** menghilangkan prefills.

**Aturan:** setiap seksi yang menyebut "kunjungi" harus punya jalur ke WhatsApp atau ke `#kontak`. Saat ini seluruh jalur terpenuhi.

---

## 10. Kinerja (Core Web Vitals)

| Target | Nilai |
| --- | --- |
| LCP | ≤ 2.5 s (hero: kompres `Hero.ecoland.jpg` → AVIF/WebP, prioritas `fetchPriority="high"`) |
| CLS | ≤ 0.1 — **wajib** `width`/`height` pada semua `<img>`; `aspect-ratio` pada slide carousel |
| INP | ≤ 200 ms |
| Ukuran gambar | ≤ 200 KB hero, ≤ 80 KB kartu; hindari `fill` di CSS |
| Font | `next/font` sudah dipakai untuk Google Fonts; TAN MERINGUE lokal `preload` |

GSAP di-import di client component saja — pastikan tidak ada import GSAP di module server.

---

## 11. Checklist QA antarmuka

Sebelum setiap rilis, jalankan semuanya:

**Fungsional**
- [ ] `npx tsc --noEmit` → 0 error
- [ ] `npm run lint` → 0 error
- [ ] `npm run build` → sukses, `/` prerender statis
- [ ] Setiap `href="#x"` cocok dengan `id="x"` di HTML build
- [ ] Setiap CTA WhatsApp terbuka di tab baru (`target="_blank"` + `rel="noopener noreferrer"`) dan pesannya ter-prefill

**Visual**
- [ ] Judul TAN MERINGUE **tidak terpotong** pada 320 / 375 / 768 / 1024 / 1440 px (lihat §3)
- [ ] Tidak ada teks meluber dari kartu / clip box
- [ ] Eyebrow selalu terlihat & `UPPERCASE`
- [ ] Tidak ada informasi yang muncul dua kali di beranda

**Aksesibilitas**
- [ ] Seluruh halaman dapat dioperasikan dengan keyboard saja (tab order logis, focus terlihat)
- [ ] `prefers-reduced-motion: reduce` → tidak ada gerak sama sekali (term autoplay, lihat §12)
- [ ] Kontras teks ≥ 4.5:1 (daftar pemakai berisiko di §2.1)
- [ ] Zoom 200% tidak memotong konten

**Responsif**
- [ ] Carousel bisa di-swipe satu jari di mobile
- [ ] Tidak ada `horizontal overflow` pada body
- [ ] Anchor landing tepat di bawah navbar (offset 80 px)

---

## 12. Utang UI/UX (belum dikerjakan)

Diurutkan berdasarkan keparahan.

### Kritis

| # | Masalah | Lokasi | Usulan |
| --- | --- | --- | --- |
| K1 | **Kontras gagal AA**: `text-stone-400` (**2.42:1**) pada latar terang | `HeritageBadges.tsx:85` (bg `cream`), `Footer.tsx:40,59,84` (bg putih) | Ganti ke `text-stone-500` (4.60:1). *Catatan: `SiteplanSection.tsx:89` juga `stone-400`, tetapi di atas `forest` → 6.56:1, lolos.* |
| K2 | **Kontras gagal AA**: nomor kartu `text-stone-300` (**1.49:1**) di atas kartu putih; menyala saat hover (`group-hover:text-forest`) tetapi default-nya tak terbaca | `KaulinanSection.tsx:46`; (juga `EcoTourismSection.tsx:42` & `HeritageSection.tsx:15` — keduanya tidak dirender) | `text-stone-400` (2.52:1) masih gagal; pakai `text-stone-500` (4.80:1) atau `text-forest/40` bila angka memang bersifat dekoratif — lalu tandai `aria-hidden` |
| K3 | **Autoplay tidak patuh `prefers-reduced-motion`** | `HeroSection.tsx:91`, `QuotesSection.tsx:156`, `MasterplanSection.tsx:127` | Hentikan `setInterval` jika `matchMedia("(prefers-reduced-motion: reduce)").matches` |
| K4 | **`/sitemap.xml` & `/robots.txt` belum ada** — PRD §6 menandai ini wajib | repo | Buat `app/sitemap.ts` + `app/robots.ts` (Next.js Metadata API) |

### Sedang

| # | Masalah | Lokasi | Usulan |
| --- | --- | --- | --- |
| S1 | Gambar placeholder (13 berkas `public/placeholders/`) masih dipakai di beranda & halaman cerita angklung | `FacilitiesSection.tsx`, `GallerySection.tsx`, `ScheduleSection.tsx`, `TrendingCarousel.tsx`, `ShowsSection.tsx` (tak dirender), `app/(site)/the-story-of-angklung/page.tsx` | Ganti foto asli sebelum launch — PRD §10 |
| S2 | Breakpoint PRD (480/640/860/940/1100/1200) ≠ kode (640/768/1024/1280/1536) | `globals.css:4` | Pilih satu; disarankan ikut kode |
| S3 | `font-cinzel` dideklarasikan tapi terpakai 1× | `globals.css:14` | Audit lalu hapus bila tidak dipakai |
| ~~S4~~ | ~~Tombol tutup popup WA 28×28 px~~ — **selesai 5 Okt 2026**, kini 40 × 40 px | `WhatsAppPopup.tsx` | ✅ |
| S5 | `fetchPriority` belum dipasang pada gambar LCP | `HeroSection.tsx:148` | Tambah `fetchPriority="high"`; pastikan `width`/`height` eksplisit untuk CLS (11 gambar sudah `loading="lazy"`) |
| S6 | Drawer sudah `role="dialog"` + `aria-expanded` + `Escape` + focus-return + scroll-lock ✓, tetapi **tanpa focus trap** (Tab bisa keluar ke konten belakang) dan fokus tidak dipindahkan ke item pertama saat dibuka | `Navbar.tsx:402` | Fokuskan item pertama saat `menuOpen` berubah; batasi Tab ke dalam dialog |

### Rendah

| # | Masalah | Usulan |
| --- | --- | --- |
| R1 | Tidak ada status `hover`/`active` yang konsisten pada kartu | Standarkan `hover:-translate-y-1 hover:shadow-lg transition` |
| R2 | Tidak ada skala tipografi formal (heading 24/30/36/48 ditulis literal) | Konsolidasikan ke `--text-*` di `@theme` |
| R3 | `Reveal` hanya dipakai di 2 komponen; 13 lainnya memakai `MaskText` | Tentukan: judul = MaskText, kartu = Reveal. Terapkan konsisten |
| R4 | Belum ada pola `Error`/`Empty` state untuk daftar yang kosong (jadwal, galeri) | Siapkan sebelum CMS terisi |

---

## 13. Keputusan desain yang sudah dikunci

| Tanggal | Keputusan | Alasan |
| --- | --- | --- |
| 5 Okt 2026 | Masterplan dan Siteplan tetap **dua seksi terpisah** | Permintaan pemilik — jangan digabung |
| 5 Okt 2026 | `EcoTourismSection` & `HeritageSection` **tidak dirender** | 3/4 isinya duplikat blok Fasilitas & Tentang; materi unik sudah dipindahkan |
| 5 Okt 2026 | `ScheduleSection` **diaktifkan** | Seluruh menu navigasi menunjuk ke `#jadwal` sebelumnya — anchor mati |
| 5 Okt 2026 | `MaskText` `line-height` dikunci **1.36** | Satu-satunya nilai yang memuat seluruh glyph TAN MERINGUE (lihat §3) |
| 5 Okt 2026 | Anchor `#warisan` & `#pertunjukan` **dihapus dari navigasi** | Tidak ada elemen targetnya |
| 5 Okt 2026 | **Hero tanpa CTA** — tombol "Pesan via WhatsApp" & "Lihat Jadwal" dihapus | Permintaan pemilik; konversi cukup lewat navbar, drawer, dan popup WA |

---

*Selesai. Dokumen ini hidup — perbarui setiap kali kontrak di §4–§5 berubah.*
