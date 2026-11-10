export type NavChild = { href: string; label: string };
export type NavItem = { label: string; children: NavChild[] };

/**
 * Satu sumber konfigurasi navigasi — dipakai Navbar dan Footer
 * agar tidak ada informasi yang terduplikasi.
 */
export const PRIMARY_NAV: NavItem[] = [
  {
    label: "Perjalanan",
    children: [
      { label: "Bab 01 · Ritual & Tradisi", href: "/#bab-01" },
      { label: "Bab 02 · Daeng Soetigna", href: "/#bab-02" },
      { label: "Bab 03 · Udjo Ngalagena", href: "/#bab-03" },
      { label: "Bab 04 · Lembur Udjo Parahyangan", href: "/#bab-04" },
    ],
  },
  {
    label: "Pengalaman",
    children: [
      { label: "Karesmen Udjo", href: "/#karesmen" },
      { label: "Agrowalk", href: "/#agrowalk" },
      { label: "Workshop Angklung", href: "/#workshop" },
    ],
  },
  {
    label: "Kawasan",
    children: [
      { label: "Fasilitas", href: "/#fasilitas" },
      { label: "Visualisasi Kawasan", href: "/#masterplan" },
      { label: "Siteplan", href: "/#siteplan" },
    ],
  },
  {
    label: "Galeri",
    children: [
      { label: "Foto", href: "/#galeri" },
      { label: "Cerita", href: "/#cerita" },
    ],
  },
  {
    label: "Kunjungan",
    children: [
      { label: "Rencanakan Kunjungan", href: "/#kunjungan" },
      { label: "FAQ", href: "/#faq" },
      { label: "Lokasi & Peta", href: "/#lokasi" },
      { label: "Karier", href: "/karier" },
    ],
  },
];

/** Anchor section yang selalu ikut dalam scrollspy Navbar. */
export const BASE_NAV_ANCHORS = ["beranda"];

export const FOOTER_NAV_LINKS: NavChild[] = [
  { label: "Perjalanan Angklung", href: "/#perjalanan" },
  { label: "Pengalaman", href: "/#pengalaman" },
  { label: "Fasilitas", href: "/#fasilitas" },
  { label: "Visualisasi Kawasan", href: "/#masterplan" },
  { label: "Siteplan", href: "/#siteplan" },
  { label: "Galeri & Cerita", href: "/#galeri" },
  { label: "Rencanakan Kunjungan", href: "/#kunjungan" },
  { label: "FAQ", href: "/#faq" },
  { label: "Lokasi", href: "/#lokasi" },
  { label: "The Story of Angklung", href: "/the-story-of-angklung" },
  { label: "Karier", href: "/karier" },
];

export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "YouTube", href: "https://www.youtube.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
] as const;
