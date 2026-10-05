"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavChild = { href: string; label: string };
type NavItem = { label: string; children: NavChild[] };

// Satu sumber konfigurasi menu — ubah di sini saja.
const navItems: NavItem[] = [
  {
    label: "Tentang Kami",
    children: [
      { label: "Sejarah Abah Udjo", href: "/the-story-of-angklung" },
      { label: "Warisan Budaya", href: "/#about" },
      { label: "Visi dan Misi", href: "/#visi" },
      { label: "Penghargaan", href: "/#penghargaan" },
    ],
  },
  {
    label: "Pengalaman",
    children: [
      { label: "Pertunjukan", href: "/#jadwal" },
      { label: "Workshop Angklung", href: "/#fasilitas" },
      { label: "Kaulinan Budak Lembur", href: "/#kaulinan" },
      { label: "Kunjungan Sekolah", href: "/#jadwal" },
      { label: "Paket Rombongan", href: "/#jadwal" },
      { label: "Acara dan Festival", href: "/#jadwal" },
    ],
  },
  {
    label: "Kawasan",
    children: [
      { label: "Fasilitas", href: "/#fasilitas" },
      { label: "Masterplan", href: "/#masterplan" },
      { label: "Siteplan", href: "/#siteplan" },
    ],
  },
  {
    label: "Galeri",
    children: [
      { label: "Foto", href: "/#galeri" },
      { label: "Video", href: "/#galeri" },
      { label: "Arsip Abah Udjo", href: "/#kata" },
    ],
  },
  {
    label: "Informasi",
    children: [
      { label: "Jam Operasional", href: "/#jadwal" },
      { label: "Harga Tiket", href: "/#jadwal" },
      { label: "Lokasi dan Peta", href: "/#lokasi" },
      { label: "FAQ", href: "/#faq" },
      { label: "Kontak", href: "/#kontak" },
    ],
  },
];

// TODO: halaman belum ada — untuk sekarang diarahkan ke WhatsApp (pola CTA yang sudah dipakai di project).
const ticketHref =
  "https://wa.me/6281219279765?text=Halo%20Lembur%20Udjo,%20saya%20ingin%20pesan%20tiket";

const CLOSE_DELAY_MS = 150;

// Semua anchor section yang dipakai menu (untuk scrollspy)
const anchors = Array.from(
  new Set(
    navItems
      .flatMap((item) => item.children.map((child) => child.href))
      .filter((href) => href.startsWith("/#"))
      .map((href) => href.slice(2)),
  ),
);

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-3 w-3 transition-transform duration-300 motion-reduce:transition-none ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function ExternalArrowIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0 opacity-40"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [accordionIndex, setAccordionIndex] = useState<number | null>(null);

  const pathname = usePathname();
  const navWrapRef = useRef<HTMLElement | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Tutup drawer saat berpindah halaman (disesuaikan saat render, bukan di effect)
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
    setOpenIndex(null);
    setAccordionIndex(null);
  }

  const isCurrent = (href: string) =>
    href.startsWith("/#") ? href === `/#${activeSection}` : href === pathname;

  const isItemActive = (item: NavItem) => item.children.some((child) => isCurrent(child.href));

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openDropdown = (index: number) => {
    clearCloseTimer();
    setOpenIndex(index);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpenIndex(null), CLOSE_DELAY_MS);
  };

  const focusPanelItem = (index: number, position: "first" | "last") => {
    requestAnimationFrame(() => {
      const links = panelRefs.current[index]?.querySelectorAll("a");
      if (!links || links.length === 0) return;
      const target = position === "first" ? links[0] : links[links.length - 1];
      target.focus();
    });
  };

  const moveInPanel = (panel: HTMLDivElement, direction: "next" | "prev") => {
    const links = Array.from(panel.querySelectorAll("a"));
    if (links.length === 0) return;
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next =
      direction === "next"
        ? current < 0
          ? 0
          : (current + 1) % links.length
        : current < 0
          ? links.length - 1
          : (current - 1 + links.length) % links.length;
    links[next].focus();
  };

  // Scrollspy: tandai section yang sedang terlihat (anchors konstanta di scope module)
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const scrollPos = window.scrollY + 120;
      for (let i = anchors.length - 1; i >= 0; i--) {
        const el = document.getElementById(anchors[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(anchors[i]);
          return;
        }
      }
      setActiveSection("");
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Kunci scroll halaman saat drawer mobile terbuka
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Tutup dropdown desktop saat klik di luar navbar
  useEffect(() => {
    if (openIndex === null) return;
    const onPointerDown = (e: PointerEvent) => {
      const el = navWrapRef.current;
      if (el && !el.contains(e.target as Node)) setOpenIndex(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openIndex]);

  // Esc: tutup dropdown (kembalikan fokus ke pemicu), lalu drawer, lalu accordion
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (openIndex !== null) {
        const index = openIndex;
        setOpenIndex(null);
        triggerRefs.current[index]?.focus();
        return;
      }
      if (menuOpen) {
        setMenuOpen(false);
        return;
      }
      setAccordionIndex(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openIndex, menuOpen]);

  useEffect(() => () => clearCloseTimer(), []);

  return (
    <>
      {/* Mobile Backdrop Overlay — di LUAR <header> agar bar navbar tidak ikut ter-blur/dim */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 lg:hidden transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

    <header
      className={`fixed top-0 left-0 w-full z-50 bg-cream border-b border-stone-200 transition-all duration-300 ${
        scrolled ? "shadow-sm shadow-black/5" : "shadow-none"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`relative z-40 flex items-center justify-between transition-all duration-300 animate-[navEnter_0.55s_ease-out_both] ${
            scrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"
          }`}
        >
          {/* Logo Brand + Tagline */}
          <Link href="/#beranda" className="flex items-center shrink-0 group" aria-label="Lembur Udjo Parahyangan">
            <img
              src="/LOGO_Lembur.udjo.png"
              alt="Logo Lembur Udjo Parahyangan"
              width={44}
              height={44}
              className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
            />
            <span className="block ml-2 sm:ml-2.5 leading-none">
              <span className="block text-[9px] sm:text-[11px] font-extrabold uppercase tracking-[0.2em] sm:tracking-[0.28em] text-bamboo whitespace-nowrap">
                Angklung Journey
              </span>
            </span>
          </Link>

          {/* Desktop Navigation — center */}
          <nav
            ref={navWrapRef}
            aria-label="Navigasi utama"
            className="hidden lg:flex w-max items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <ul className="flex items-center gap-1">
              {navItems.map((item, i) => {
                const isOpen = openIndex === i;
                const isActive = isItemActive(item);

                return (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => openDropdown(i)}
                    onMouseLeave={scheduleClose}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setOpenIndex((current) => (current === i ? null : current));
                      }
                    }}
                  >
                    <button
                      type="button"
                      ref={(el) => {
                        triggerRefs.current[i] = el;
                      }}
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          openDropdown(i);
                          focusPanelItem(i, "first");
                        } else if (e.key === "ArrowUp") {
                          e.preventDefault();
                          openDropdown(i);
                          focusPanelItem(i, "last");
                        }
                      }}
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      aria-controls={`nav-panel-${i}`}
                      style={{ animationDelay: `${140 + i * 60}ms` }}
                      className={`relative flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors duration-300 animate-[fadeInUp_0.5s_ease-out_both] focus-visible:ring-2 focus-visible:ring-forest after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:origin-left after:rounded-full after:bg-forest after:transition-transform after:duration-300 ${
                        isActive || isOpen
                          ? "bg-stone-100 font-extrabold text-stone-950 after:scale-x-100"
                          : "text-stone-600 hover:bg-stone-100 hover:text-stone-950 after:scale-x-0 hover:after:scale-x-100"
                      }`}
                    >
                      {item.label}
                      <ChevronIcon className={`-mt-0.5 ${isOpen ? "rotate-180" : "rotate-0"}`} />
                    </button>

                    <div
                      id={`nav-panel-${i}`}
                      ref={(el) => {
                        panelRefs.current[i] = el;
                      }}
                      role="menu"
                      aria-label={item.label}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          moveInPanel(e.currentTarget, "next");
                        } else if (e.key === "ArrowUp") {
                          e.preventDefault();
                          moveInPanel(e.currentTarget, "prev");
                        }
                      }}
                      className={`absolute left-0 top-full mt-1.5 min-w-[220px] w-max origin-top rounded-2xl border border-stone-200 bg-cream p-1.5 shadow-lg shadow-black/10 transition-all duration-200 ease-out motion-reduce:transition-none z-50 ${
                        isOpen
                          ? "visible translate-y-0 scale-100 opacity-100"
                          : "invisible pointer-events-none -translate-y-1 scale-95 opacity-0"
                      }`}
                    >
                      <ul role="none" className="space-y-0.5">
                        {item.children.map((child) => (
                          <li key={child.label} role="none">
                            <a
                              href={child.href}
                              role="menuitem"
                              aria-current={isCurrent(child.href) ? "page" : undefined}
                              onClick={() => setOpenIndex(null)}
                              className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-950 focus-visible:ring-2 focus-visible:ring-forest"
                            >
                              {child.label}
                              {child.href.startsWith("/#") ? null : <ExternalArrowIcon />}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Aksi kanan: tombol Pesan Tiket (desktop) + hamburger (mobile) */}
          <div className="flex items-center gap-2">
            <a
              href={ticketHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center justify-center whitespace-nowrap rounded-full bg-white border border-stone-200 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-forest transition-all hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-forest"
            >
              Pesan Tiket
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl text-stone-900 hover:bg-stone-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer lg:hidden focus-visible:ring-2 focus-visible:ring-forest"
              aria-label={menuOpen ? "Tutup menu" : "Buka menu navigasi"}
              aria-expanded={menuOpen}
              aria-controls="nav-mobile-panel"
            >
              <span className="flex h-6 w-6 flex-col items-center justify-center gap-[5px]" aria-hidden="true">
                <span className={`h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
                <span className={`h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${menuOpen ? "opacity-0 scale-0" : ""}`} />
                <span className={`h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer — panel penuh di bawah navbar */}
      <div
        id="nav-mobile-panel"
        className={`lg:hidden absolute left-0 top-full z-40 w-full h-[calc(100dvh_-_100%)] bg-cream border-b border-stone-200 flex flex-col transition-all duration-300 ease-out motion-reduce:transition-none ${
          menuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi mobile"
      >
        <div className="flex-1 overflow-y-auto overscroll-contain p-3.5">
          <nav aria-label="Navigasi utama">
            <ul className="space-y-1">
            {navItems.map((item, i) => {
              const isExpanded = accordionIndex === i;
              const isActive = isItemActive(item);

              return (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => setAccordionIndex(isExpanded ? null : i)}
                    aria-expanded={isExpanded}
                    aria-haspopup="true"
                    aria-controls={`nav-accordion-${i}`}
                    style={menuOpen ? { animationDelay: `${80 + i * 50}ms` } : undefined}
                    className={`w-full min-h-[48px] cursor-pointer rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-between transition-colors focus-visible:ring-2 focus-visible:ring-forest ${
                      isActive
                        ? "text-forest bg-stone-100 font-extrabold"
                        : "text-stone-700 hover:text-stone-950 hover:bg-stone-100"
                    } ${menuOpen ? "animate-[fadeInUp_0.4s_ease-out_both]" : ""}`}
                  >
                    <span>{item.label}</span>
                    <ChevronIcon className={`h-4 w-4 ${isExpanded ? "rotate-180" : "rotate-0"}`} />
                  </button>

                  <div
                    id={`nav-accordion-${i}`}
                    className={`grid transition-all duration-300 ease-out motion-reduce:transition-none ${
                      isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="ml-5 mt-1 mb-1 space-y-1 border-l-2 border-stone-200 pl-2">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <a
                              href={child.href}
                              aria-current={isCurrent(child.href) ? "page" : undefined}
                              tabIndex={isExpanded ? 0 : -1}
                              onClick={() => setMenuOpen(false)}
                              className="flex min-h-[44px] items-center rounded-lg px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-950 focus-visible:ring-2 focus-visible:ring-forest"
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
            </ul>
          </nav>
        </div>

        {/* Tombol Pesan Tiket — bawah drawer, lebar penuh */}
        <div className="p-4 border-t border-stone-200">
          <a
            href={ticketHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="w-full min-h-[44px] py-3 px-4 rounded-full bg-white border border-stone-200 text-forest text-center text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-forest"
          >
            Pesan Tiket
          </a>
        </div>
      </div>
    </header>
    </>
  );
}
