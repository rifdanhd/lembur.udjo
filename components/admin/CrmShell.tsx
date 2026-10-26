"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarCheck2,
  ChevronRight,
  ClipboardList,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Sprout,
  Users,
  X,
} from "lucide-react";

export type CrmView = "ringkasan" | "kontak" | "reservasi" | "tindak-lanjut" | "gambar-beranda";

export const CRM_VIEW_LABELS: Record<CrmView, string> = {
  ringkasan: "Ringkasan",
  kontak: "Kontak",
  reservasi: "Reservasi",
  "tindak-lanjut": "Tindak lanjut",
  "gambar-beranda": "Media beranda",
};

const navigation = [
  { id: "ringkasan" as const, icon: LayoutDashboard },
  { id: "kontak" as const, icon: Users },
  { id: "reservasi" as const, icon: CalendarCheck2 },
  { id: "tindak-lanjut" as const, icon: ClipboardList },
  { id: "gambar-beranda" as const, icon: Images },
];

export default function CrmShell({
  children,
  view,
  counts,
  onNavigate,
  onAdd,
  onLogout,
  loggingOut,
}: {
  children: ReactNode;
  view: CrmView;
  counts: Partial<Record<CrmView, number>>;
  onNavigate: (view: CrmView) => void;
  onAdd: () => void;
  onLogout: () => void;
  loggingOut: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileMenu = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const dialog = mobileMenu.current;
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.body.style.overflow = previousOverflow;
      dialog?.close();
    };
  }, [menuOpen]);

  function navigate(next: CrmView) {
    setMenuOpen(false);
    onNavigate(next);
  }

  function sidebar(mobile: boolean) {
    return (
      <div className="flex h-full min-h-0 flex-col text-white">
        <div className="flex items-center gap-3 px-5 pt-7 pb-6">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[#e6d3a3]">
            <Sprout size={25} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-base font-semibold tracking-tight text-white">
              Lembur Udjo
            </p>
            <p className="mt-0.5 text-[10px] tracking-[0.18em] text-white/70">
              PARAHYANGAN
            </p>
          </div>
          {mobile && (
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Tutup navigasi"
              className="ml-auto flex size-11 shrink-0 items-center justify-center rounded-xl text-white/80 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
            >
              <X size={20} aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="mx-5 border-t border-white/10" />
        <nav
          aria-label={mobile ? "Navigasi CRM seluler" : "Navigasi utama CRM"}
          className="flex-1 overflow-y-auto px-3 py-6"
        >
          <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.18em] text-white/60">
            RUANG KERJA
          </p>
          <ul className="space-y-1.5">
            {navigation.map(({ id, icon: Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => navigate(id)}
                  aria-current={view === id ? "page" : undefined}
                  className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 ${view === id ? "bg-[#e6d3a3] text-forest shadow-sm" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
                >
                  <Icon size={19} className="shrink-0" aria-hidden="true" />
                  <span className="flex-1">{CRM_VIEW_LABELS[id]}</span>
                  {counts[id] !== undefined && (
                    <span
                      aria-label={`${counts[id]} ${id === "tindak-lanjut" ? "tugas belum selesai" : "kontak"}`}
                      className={`rounded-md px-1.5 py-0.5 text-xs tabular-nums ${view === id ? "bg-forest/10 text-forest" : "bg-white/10 text-white/80"}`}
                    >
                      {counts[id]!.toLocaleString("id-ID")}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <div className="mx-3 mt-7 border-t border-white/10 pt-5">
            <Link
              href="/"
              className="flex min-h-11 items-center justify-between gap-2 rounded-lg text-sm text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
            >
              Lihat situs Lembur Udjo
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-[#e6d3a3]"
              aria-hidden="true"
            >
              LU
            </span>
            <div>
              <p className="text-sm font-semibold text-white">
                Tim Lembur Udjo
              </p>
              <p className="text-xs text-white/65">Administrator CRM</p>
            </div>
          </div>
          <button
            type="button"
            disabled={loggingOut}
            onClick={() => {
              setMenuOpen(false);
              onLogout();
            }}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 disabled:opacity-50"
          >
            <LogOut size={18} aria-hidden="true" />
            {loggingOut ? "Sedang keluar…" : "Keluar dari CRM"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-cream text-stone-900">
      <a
        href="#crm-workspace"
        className="sr-only z-50 rounded-xl bg-white px-4 py-3 text-forest focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Langsung ke ruang kerja
      </a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-forest-light bg-forest lg:block">
        {sidebar(false)}
      </aside>
      <dialog
        ref={mobileMenu}
        id="crm-mobile-navigation"
        aria-label="Menu CRM"
        onCancel={(event) => {
          event.preventDefault();
          setMenuOpen(false);
        }}
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            setMenuOpen(false);
        }}
        className="fixed inset-y-0 right-auto left-0 m-0 h-dvh max-h-none w-72 max-w-[calc(100vw-2rem)] border-0 bg-forest p-0 text-white shadow-2xl backdrop:bg-forest/50 lg:hidden"
      >
        {sidebar(true)}
      </dialog>

      <div className="min-w-0 lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex min-h-20 max-w-[1400px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Buka navigasi CRM"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls="crm-mobile-navigation"
              className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-stone-200 text-forest hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest lg:hidden"
            >
              <Menu size={21} aria-hidden="true" />
            </button>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-xs text-stone-500">
                <span className="hidden sm:inline">Ruang kerja</span>
                <ChevronRight
                  size={12}
                  className="hidden sm:block"
                  aria-hidden="true"
                />
                <span className="truncate">{CRM_VIEW_LABELS[view]}</span>
              </p>
              <p className="mt-0.5 truncate text-sm font-semibold text-forest">
                CRM Lembur Udjo
              </p>
            </div>
            {view !== "gambar-beranda" && <button
              type="button"
              onClick={onAdd}
              className="ml-auto inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-forest px-3 text-sm font-semibold text-white transition-colors hover:bg-forest-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 sm:px-4"
            >
              <Plus size={18} aria-hidden="true" />
              <span className="sm:hidden">Tambah</span>
              <span className="hidden sm:inline">Tambah kontak</span>
            </button>}
          </div>
        </header>
        <main id="crm-workspace" tabIndex={-1} className="outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
