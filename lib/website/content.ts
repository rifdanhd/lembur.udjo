export type WebsiteSection = "banner" | "fasilitas" | "galeri";

export interface WebsiteImage {
  key: string;
  section: WebsiteSection;
  title: string;
  description: string;
  category: string;
  alt: string;
  image: string;
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
];

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
];

export function sectionImages(images: WebsiteImage[], section: WebsiteSection) {
  return images.filter((image) => image.section === section && image.visible).sort((a, b) => a.position - b.position || a.key.localeCompare(b.key));
}
