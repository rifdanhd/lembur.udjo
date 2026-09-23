"use client";

import { useState, useEffect, useCallback } from "react";

const navLinks = [
  { href: "#beranda", label: "Beranda" },
  { href: "#about", label: "Tentang" },
  { href: "#pertunjukan", label: "Pertunjukan" },
  { href: "#warisan", label: "Warisan" },
  { href: "#fasilitas", label: "Fasilitas" },
  { href: "#galeri", label: "Galeri" },
  { href: "#jadwal", label: "Jadwal" },
  { href: "#kontak", label: "Kontak" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) closeMenu();
    };
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [menuOpen, closeMenu]);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs py-2 sm:py-2.5 text-stone-800" 
          : "bg-gradient-to-b from-black/70 via-black/30 to-transparent border-transparent py-3 sm:py-4 text-white"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-14">
          {/* Brand Logo & Title */}
          <a href="#beranda" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden shrink-0 bg-white/10 p-0.5 backdrop-blur-xs">
              <img src="/LOGO_Lembur.udjo.png" alt="Logo Lembur Udjo" width={40} height={40} className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className={`font-cinzel text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors ${scrolled ? "text-forest" : "text-white"}`}>
                Lembur Udjo
              </span>
              <span className="font-serif text-[10px] sm:text-xs text-amber-500 font-semibold tracking-widest uppercase -mt-0.5">
                Parahyangan
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                className={`text-xs font-semibold uppercase tracking-wider transition-colors py-2 ${
                  scrolled 
                    ? "text-stone-700 hover:text-amber-600" 
                    : "text-white/90 hover:text-amber-300 drop-shadow-xs"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions: CTA Button + Lang + Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Desktop Quick CTA Button */}
            <a 
              href="#jadwal" 
              className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xs ${
                scrolled 
                  ? "bg-forest hover:bg-forest-light text-white" 
                  : "bg-amber-500 hover:bg-amber-400 text-stone-900 font-black"
              }`}
            >
              <span>Pesan Tiket</span>
              <span>&rarr;</span>
            </a>

            {/* Language Switcher pill */}
            <div className={`hidden sm:flex items-center text-[11px] font-bold px-2 py-1 rounded-full border ${scrolled ? "border-stone-300 text-stone-700" : "border-white/30 text-white"}`}>
              ID
            </div>

            {/* Hamburger Button for Mobile */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer ${
                scrolled 
                  ? "text-stone-800 hover:bg-stone-100" 
                  : "text-white hover:bg-white/10"
              }`}
              aria-label={menuOpen ? "Tutup menu" : "Buka menu navigasi"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-drawer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay + Slide-in Menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />
      <div
        id="mobile-nav-drawer"
        className={`fixed top-0 right-0 h-full w-[290px] max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi mobile"
      >
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
              <img src="/LOGO_Lembur.udjo.png" alt="Logo" width={32} height={32} className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-cinzel font-bold text-forest text-sm block">Lembur Udjo</span>
              <span className="text-[10px] text-amber-600 font-semibold tracking-wider uppercase block">Parahyangan</span>
            </div>
          </div>
          <button
            type="button"
            onClick={closeMenu}
            className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Tutup menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="py-3 px-4 text-sm font-semibold text-stone-700 hover:text-forest hover:bg-stone-50 active:bg-stone-100 rounded-lg transition-colors min-h-[44px] flex items-center"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-2">
          <a
            href="#jadwal"
            onClick={closeMenu}
            className="w-full py-2.5 px-4 rounded-full bg-forest text-white text-center text-xs font-bold uppercase tracking-wider block shadow-sm min-h-[44px] flex items-center justify-center"
          >
            Pesan Tiket & Jadwal
          </a>
          <p className="text-[11px] text-stone-500 text-center">Bale Pare, Kota Baru Parahyangan</p>
        </div>
      </div>
    </header>
  );
}
