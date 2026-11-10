export type WebsiteSection = "banner" | "fasilitas" | "galeri" | "masterplan" | "siteplan" | "zona-siteplan" | "trending";

export interface WebsiteImage {
  key: string;
  section: WebsiteSection;
  title: string;
  description: string;
  category: string;
  alt: string;
  image: string;
  linkUrl?: string;
  video?: string | null;
  videoMediaId?: number | null;
  position: number;
  visible: boolean;
  mediaId: number | null;
}

export const WEBSITE_SECTIONS: { id: WebsiteSection; label: string; description: string }[] = [
  { id: "banner", label: "Banner beranda", description: "Foto, video, dan teks utama yang menyambut pengunjung." },
  { id: "fasilitas", label: "Fasilitas", description: "Foto, judul, dan deskripsi fasilitas serta pengalaman." },
  { id: "galeri", label: "Galeri", description: "Kumpulan foto kegiatan dan cerita Lembur Udjo." },
  { id: "masterplan", label: "Visualisasi Kawasan", description: "Foto kawasan, keterangan, dan urutan slide visualisasi." },
  { id: "siteplan", label: "Denah Siteplan", description: "Ganti gambar denah utama dan keterangan siteplan." },
  { id: "zona-siteplan", label: "Zona Siteplan", description: "Nama, jenis, dan keterangan titik pada denah. Nomor zona mengikuti penanda pada gambar." },
  { id: "trending", label: "Artikel Trending", description: "Gambar, judul, ringkasan, dan tautan artikel atau kabar terbaru." },
];

// Shared with the API and the public cards: never render unsafe link schemes.
export function safeArticleLink(value: string | null | undefined): string {
  const link = value?.trim() || "";
  if (!link || /[\s\\\u0000-\u001f\u007f]/.test(link)) return "";
  if (link.startsWith("/") && !link.startsWith("//")) return link;
  try {
    const url = new URL(link);
    return url.protocol === "https:" && !url.username && !url.password ? link : "";
  } catch {
    return "";
  }
}

function item(section: WebsiteSection, key: string, position: number, title: string, description: string, image: string, category = "", alt = title): WebsiteImage {
  return { section, key, position, title, description, image, category, alt, visible: true, mediaId: null };
}

export const DEFAULT_WEBSITE_IMAGES: WebsiteImage[] = [
  item("banner", "banner-ecoland", 0, "Ecoland, Ruang Hijau Pertemuan Budaya", "Lanskap alam yang membuka ruang bagi seni, tradisi, dan kehidupan masyarakat.", "/Hero.ecoland.jpg", "", "Suasana kawasan Ecoland"),
  item("banner", "banner-budaya", 1, "Menanam Budaya, Memanen Masa Depan", "Pusat seni, tradisi, dan kebudayaan Sunda terintegrasi di Kawasan Bale Pare, Kota Baru Parahyangan.", "/arsip%20Abah%20Udjo/diantara%20orang%20bule.jpg", "", "Arsip Abah Udjo bersama tamu dari mancanegara"),
  item("banner", "banner-tradisi", 2, "Harmoni Tradisi, Ruang & Keberlanjutan", "Hamparan sawah, rumpun bambu, dan seni pertunjukan dalam satu perjalanan budaya yang hidup.", "/LUP.png", "", "Suasana lanskap kawasan Lembur Udjo Parahyangan"),
  item("fasilitas", "fasilitas-bale", 0, "Bale Karesmen", "Ruang utama tempat musik, tari, angklung, arumba, dan kreativitas bertemu.", "/facilities/bale-karesmen.png", "Ruang Utama"),
  item("fasilitas", "fasilitas-workshop", 1, "Workshop Angklung", "Belajar langsung proses pembuatan angklung dari para pengrajin.", "/facilities/workshop-angklung.png", "Edukasi"),
  item("fasilitas", "fasilitas-agrowalk", 2, "Agrowalk", "Peternakan, sampah organik, bibit pepaya, arboretum bambu, dan sentra perajin dalam satu perjalanan berpemandu ke 5 titik edukasi.", "/facilities/agrowalk.png", "Unggulan"),
  item("fasilitas", "fasilitas-bambu", 3, "Konservasi Bambu", "Program pelestarian bambu sebagai sumber utama seni angklung.", "/facilities/konservasi-bambu.png", "Lingkungan"),
  item("fasilitas", "fasilitas-peternakan", 4, "Peternakan Edukasi", "Sarana edukasi bagi pengunjung untuk mengenal kehidupan agraris.", "/facilities/peternakan-edukasi.png", "Edukasi"),
  item("fasilitas", "fasilitas-hijau", 5, "Area Hijau", "Ruang hijau dan keberlanjutan. Sawah, kebun bambu, kolam.", "/facilities/area-hijau.png", "Alam"),
  item("galeri", "galeri-harmoni", 0, "Harmoni Angklung Kolosal", "Momen pengunjung dan seniman memainkan angklung bersama dalam suasana lembur Sunda.", "/gallery/harmoni-angklung-kolosal.png", "Pertunjukan"),
  item("galeri", "galeri-workshop", 1, "Workshop Merakit Bambu", "Mengenal proses merakit angklung langsung dari perajin bambu di ruang kerja yang hidup.", "/gallery/workshop-merakit-bambu.png", "Edukasi"),
  item("galeri", "galeri-wayang", 2, "Wayang Golek Parahyangan", "Keelokan pahatan kayu dan ekspresi khas wayang golek klasik Sunda.", "/gallery/wayang-golek-parahyangan.png", "Pentas Boneka"),
  item("galeri", "galeri-udjo", 3, "Sosok Inspiratif Mang Udjo", "Menelusuri jejak dedikasi Udjo Ngalagena dalam menjaga angklung sejak 1966.", "/arsip%20Abah%20Udjo/abah-udjo-legend.webp", "Sejarah"),
  item("galeri", "galeri-anak", 4, "Keceriaan Belajar Anak", "Pendidikan karakter berbasis gotong royong bagi tunas generasi penerus.", "/gallery/keceriaan-belajar-anak.png", "Edukasi"),
  item("masterplan", "masterplan-utama", 0, "Visualisasi Kawasan", "Denah lengkap kawasan Lembur Udjo Parahyangan — panggung, kriya bambu, dan kampung budaya dalam satu perjalanan.", "/Masterplan.jpg", "Visualisasi Kawasan 01"),
  item("masterplan", "masterplan-zona", 1, "Zona & Fasilitas", "Peta zona dan fasilitas kawasan: area pertunjukan, workshop, agrowalk, hingga galeri budaya.", "/Masterplan2.jpg", "Visualisasi Kawasan 02"),
  item("masterplan", "masterplan-area", 2, "Denah Area Kawasan", "Denah detail area kawasan beserta akses jalur penunjuk arah untuk memudahkan perjalanan berkunjung.", "/Masterplan3.jpg", "Visualisasi Kawasan 03"),
  ...Array.from({ length: 20 }, (_, index) => {
    const group = index < 10 ? 1 : 2;
    const number = index % 10 + 1;
    return item("masterplan", `masterplan-foto-${index + 1}`, index + 3, `Foto Kawasan ${index + 1}`, "Dokumentasi visual kawasan Lembur Udjo Parahyangan.", `/Masterplan/${encodeURIComponent(`Copy of ${group}_${number} - Photo.jpg`)}`, `Visualisasi Kawasan ${String(index + 4).padStart(2, "0")}`);
  }),
  item("siteplan", "siteplan-utama", 0, "Zona & Titik Kawasan", "Sebaran titik utama dalam siteplan Lembur Udjo Parahyangan — dari gerbang, ruang publik, pertunjukan, hingga fasilitas pengunjung.", "/SITEPLAN.png", "Siteplan Kawasan", "Siteplan kawasan Lembur Udjo Parahyangan dengan penanda lokasi 1 sampai 10"),
  ...[
    ["Ticketing & Souvenir", "Ticketing & Souvenir", "Loket tiket masuk sekaligus area pembelian cinderamata."],
    ["Bale Ageung", "Restoran", "Restoran dengan sajian kuliner Sunda untuk pengunjung kawasan."],
    ["Masigit", "Mushola", "Ruang ibadah yang tenang dan nyaman di tengah kawasan."],
    ["Bale Sawala", "Office", "Ruang kantor dan pengelolaan operasional Lembur Udjo Parahyangan."],
    ["Karesmen Udjo", "Performance Hall", "Ruang utama untuk pertunjukan seni dan budaya Lembur Udjo."],
    ["Mini Amphi", "Mini Amphitheater", "Panggung pertunjukan terbuka untuk kegiatan seni dan komunitas."],
    ["Bale Rancage", "Pendopo", "Pendopo untuk berkumpul, beristirahat, dan menikmati suasana kawasan."],
    ["Jaga Lembur", "Security Post", "Pos penjagaan dan titik layanan keamanan kawasan."],
    ["Souvenir Shop", "Souvenir Shop", "Toko cinderamata dengan pilihan produk khas Lembur Udjo."],
    ["Gerbang Utama", "Main Gate", "Pintu masuk utama menuju pengalaman budaya di Lembur Udjo Parahyangan."],
  ].map(([title, category, description], index) => item("zona-siteplan", `siteplan-zona-${index + 1}`, index + 1, title, description, "", category)),
  { ...item("trending", "trending-kabar", 0, "Lembur Udjo Parahyangan Segera Hadir di Bale Pare, KBP", "", "/Trending.jpeg", "Kabar"), linkUrl: "https://www.instagram.com/reels/DXI1ymKhmbf/" },
  { ...item("trending", "trending-tradisi", 1, "Tinggal di Kawasan Modern Tanpa Kehilangan Kehangatan Tradisi Lokal", "", "/trending-tradisi-lokal.jpg", "Tradisi"), linkUrl: "https://www.instagram.com/p/DcktTjymrTu/" },
  ...[
    ["workshop", "Workshop Angklung & Arumba", "Edukasi", "fasilitas"],
    ["agrowalk", "Agrowalk & Konservasi Bambu", "Alam", "fasilitas"],
    ["wayang", "Wayang Golek & Seni Tradisi", "Warisan", "about"],
    ["bale-karesmen", "Bale Karesmen Ruang Utama", "Venue", "fasilitas"],
  ].map(([key, title, category, anchor], index) => ({ ...item("trending", `trending-${key}`, index + 2, title, "", `/placeholders/${key}.jpg`, category), linkUrl: `/#${anchor}`, visible: false })),
];

export function sectionImages(images: WebsiteImage[], section: WebsiteSection) {
  return images.filter((image) => image.section === section && image.visible).sort((a, b) => a.position - b.position || a.key.localeCompare(b.key));
}
