"use client";

import { useEffect, useState } from "react";

const navLinks = [
  { href: "/#about", label: "Tentang Kami" },
  { href: "/#warisan", label: "Warisan" },
  { href: "/#fasilitas", label: "Fasilitas" },
  { href: "/#masterplan", label: "Masterplan" },
  { href: "/#siteplan", label: "Siteplan" },
  { href: "/#galeri", label: "Galeri" },
  { href: "/#lokasi", label: "Lokasi" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = navLinks.map((l) => l.href.split("#")[1]).filter(Boolean);
      const scrollPos = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          return;
        }
      }
      setActiveSection("");
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-white border-b border-stone-200 transition-all duration-300 ${
        scrolled ? "shadow-sm shadow-black/5" : "shadow-none"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`relative flex items-center justify-between transition-all duration-300 animate-[navEnter_0.55s_ease-out_both] ${
            scrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"
          }`}
        >
          {/* Logo Brand */}
          <a href="/#beranda" className="flex items-center shrink-0 group" aria-label="Lembur Udjo Parahyangan">
            <img
              src="/LOGO_Lembur.udjo.png"
              alt="Logo Lembur Udjo Parahyangan"
              width={44}
              height={44}
              className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
            />
          </a>

          {/* Desktop Navigation — center */}
          <nav className="hidden lg:flex w-max items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navLinks.map((link, i) => {
              const isActive = activeSection === link.href.split("#")[1];
              return (
                <a
                  key={link.href}
                  href={link.href}
                  style={{ animationDelay: `${140 + i * 60}ms` }}
                  className={`relative whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.16em] px-3 py-2 rounded-full transition-colors duration-300 animate-[fadeInUp_0.5s_ease-out_both] ${
                    isActive
                      ? "text-forest bg-stone-100 font-extrabold"
                      : "text-stone-600 hover:text-stone-950 hover:bg-stone-100"
                  } after:absolute after:left-3 after:right-3 after:bottom-1 after:h-0.5 after:rounded-full after:origin-left after:transition-transform after:duration-300 after:bg-forest ${
                    isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Mobile Hamburger Button — animated morph ke X */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl text-stone-900 hover:bg-stone-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label={menuOpen ? "Tutup menu" : "Buka menu navigasi"}
              aria-expanded={menuOpen}
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

      {/* Mobile Backdrop Overlay — fade in/out */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-[82vw] max-w-xs bg-white z-50 transform transition-transform duration-300 ease-out lg:hidden shadow-2xl flex flex-col justify-between border-l border-stone-200 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi mobile"
      >
        <div>
          {/* Close Button */}
          <div className="flex items-center justify-end p-3.5 border-b border-stone-100">
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Links List — stagger saat drawer dibuka */}
          <nav className="flex flex-col p-3.5 space-y-1">
            {navLinks.map((link, i) => {
              const isActive = activeSection === link.href.split("#")[1];
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={menuOpen ? { animationDelay: `${80 + i * 50}ms` } : undefined}
                  className={`py-3 px-4 text-xs font-bold uppercase tracking-widest rounded-xl min-h-[48px] flex items-center justify-between transition-colors ${
                    isActive
                      ? "text-forest bg-stone-100 font-extrabold"
                      : "text-stone-700 hover:text-stone-950 hover:bg-stone-100"
                  } ${menuOpen ? "animate-[fadeInUp_0.4s_ease-out_both]" : ""}`}
                >
                  <span>{link.label}</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full bg-forest transition-all duration-300 ${
                      isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                    }`}
                  />
                </a>
              );
            })}
          </nav>
        </div>

        {/* Footer Drawer */}
        <div className="p-4 border-t border-stone-100">
          <a
            href="https://wa.me/6281219279765?text=Halo%20Lembur%20Udjo,%20saya%20ingin%20tanya%20informasi"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="w-full py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#1eb857] text-white text-center text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            Hubungi WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
