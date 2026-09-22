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

  const closeMenu = useCallback(() => setMenuOpen(false), []);

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
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-stone-200/60 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <a href="#beranda" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded overflow-hidden">
              <img src="/LOGO_Lembur.udjo.png" alt="Logo" width={40} height={40} className="w-full h-full object-contain" />
            </div>
            <span className="font-serif text-xs sm:text-sm md:text-base font-semibold text-amber-600 tracking-widest uppercase">Parahyangan</span>
          </a>

          <nav className="hidden md:flex items-center gap-3 sm:gap-5">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-xs sm:text-sm text-stone-700 hover:text-forest transition-colors font-medium">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 text-stone-600 hover:text-stone-900 transition-colors rounded-lg active:scale-90 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Menu"
              aria-expanded={menuOpen}
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
        className={`fixed inset-0 z-40 transition-opacity duration-300 md:hidden ${menuOpen ? "opacity-100 bg-black/50" : "opacity-0 pointer-events-none"}`}
        onClick={closeMenu}
      />
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <span className="font-serif font-bold text-forest text-sm">Menu</span>
          <button
            type="button"
            onClick={closeMenu}
            className="p-2 rounded-lg hover:bg-stone-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col p-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="py-3.5 px-4 text-sm text-stone-700 hover:text-forest hover:bg-stone-50 rounded-lg transition-colors min-h-[44px] flex items-center"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
