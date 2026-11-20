"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Lock,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Ticket,
  Users,
  XCircle,
} from "lucide-react";

export interface GuestRecord {
  id: string;
  name: string;
  category: "vvip" | "vip" | "reguler";
  label: string;
  arrival: string;
  attendance: "hadir" | "berhalangan" | null;
  url: string;
  createdAt: string;
}

const CATEGORY_MAP = {
  vvip: { label: "VVIP", arrival: "17.30" },
  vip: { label: "VIP", arrival: "18.00" },
  reguler: { label: "Reguler", arrival: "18.00" },
};

const DEFAULT_GUESTS: GuestRecord[] = [
  {
    id: "jaka-sembiring",
    name: "Prof. Dr. Ir. Jaka Sembiring, M.Eng.",
    category: "vvip",
    label: "VVIP",
    arrival: "17.30",
    attendance: null,
    url: "/undangan/angklung-pride/?kepada=Prof.+Dr.+Ir.+Jaka+Sembiring%2C+M.Eng.&kategori=VVIP&jam=17.30",
    createdAt: new Date().toISOString(),
  },
];

const LOCAL_STORAGE_GUESTS_KEY = "angklung_pride_dashboard_guests_v1";

export default function AngklungPrideDashboardPage() {
  const [guests, setGuests] = useState<GuestRecord[]>(DEFAULT_GUESTS);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form Buat Undangan
  const [nameInput, setNameInput] = useState("");
  const [categoryInput, setCategoryInput] = useState<"vvip" | "vip" | "reguler">("vvip");
  const [latestInvite, setLatestInvite] = useState<GuestRecord | null>(null);
  const [copiedPesan, setCopiedPesan] = useState(false);
  const [copiedTautan, setCopiedTautan] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_GUESTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGuests(parsed);
          return;
        }
      }
      localStorage.setItem(LOCAL_STORAGE_GUESTS_KEY, JSON.stringify(DEFAULT_GUESTS));
    } catch {
      // Safe fallback
    }
  }, []);

  const saveGuests = (nextGuests: GuestRecord[]) => {
    setGuests(nextGuests);
    try {
      localStorage.setItem(LOCAL_STORAGE_GUESTS_KEY, JSON.stringify(nextGuests));
    } catch {}
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    const trimmed = nameInput.trim();
    const cat = CATEGORY_MAP[categoryInput];
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const cleanUrl = `${origin}/undangan/angklung-pride/?kepada=${encodeURIComponent(trimmed)}&kategori=${cat.label}&jam=${cat.arrival}`;

    const newGuest: GuestRecord = {
      id: "guest-" + Date.now(),
      name: trimmed,
      category: categoryInput,
      label: cat.label,
      arrival: cat.arrival,
      attendance: null,
      url: cleanUrl,
      createdAt: new Date().toISOString(),
    };

    const next = [newGuest, ...guests];
    saveGuests(next);
    setLatestInvite(newGuest);
    setNameInput("");
  };

  const generateWhatsappMessage = (guest: GuestRecord) => {
    return `Kepada Yth:\n${guest.name}\n\nDengan hormat, kami mengundang Bapak/Ibu untuk menghadiri Angklung Pride 2026 — One Sound, a Symphony for the World.\n\nJumat, 27 November 2026\nKategori: ${guest.label}\nKedatangan: pukul ${guest.arrival} WIB\nPertunjukan: pukul 19.00 WIB\nSaung Angklung Udjo, Jl. Padasuka No. 118, Bandung\n\nSilakan buka undangan dan konfirmasikan kehadiran melalui tautan berikut:\n${guest.url}\n\nTerima kasih. Kami menantikan kehadiran Bapak/Ibu.`;
  };

  const copyText = (text: string, type: "pesan" | "tautan") => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "pesan") {
        setCopiedPesan(true);
        setTimeout(() => setCopiedPesan(false), 2000);
      } else {
        setCopiedTautan(true);
        setTimeout(() => setCopiedTautan(false), 2000);
      }
    });
  };

  const filteredGuests = guests.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const total = guests.length;
  const hadir = guests.filter((g) => g.attendance === "hadir").length;
  const berhalangan = guests.filter((g) => g.attendance === "berhalangan").length;
  const belum = guests.filter((g) => !g.attendance).length;

  return (
    <div className="min-h-screen bg-[#f8f4e8] text-[#282821] font-['Bricolage_Grotesque',sans-serif] p-4 sm:p-8 selection:bg-[#fcd964]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Dashboard */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#d8cdb8] pb-6">
          <div>
            <span className="inline-block px-3 py-1 text-[11px] font-bold tracking-wider uppercase text-[#3976bf] bg-[#3976bf]/10 rounded-full mb-1">
              PANITIA ANGKLUNG PRIDE 2026
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1f2822]">
              Dashboard Konfirmasi Kehadiran
            </h1>
            <p className="text-xs sm:text-sm text-[#6b685e]">
              Jumat, 27 November 2026 · Saung Angklung Udjo, Bandung
            </p>
          </div>
          <Link
            href="/undangan/angklung-pride/"
            target="_blank"
            className="inline-flex items-center gap-1.5 self-start sm:self-auto px-4 py-2 text-xs font-bold rounded-xl border border-[#c9c2b1] bg-white text-stone-700 shadow-2xs hover:bg-stone-50"
          >
            Lihat Halaman Undangan <ExternalLink size={13} />
          </Link>
        </header>

        {/* Section: Buat Undangan Baru */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e4dcce] shadow-xs">
          <h2 className="text-xl font-extrabold text-[#1f2822]">Buat Undangan Baru</h2>
          <p className="text-xs text-[#6b685e] mt-1">
            Ketik nama tamu, pilih kategori (VVIP, VIP, atau Reguler), lalu salin pesan undangan untuk dikirim via WhatsApp.
          </p>

          <form onSubmit={handleCreate} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_220px] gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5" htmlFor="invite-name">
                  Nama Tamu Undangan
                </label>
                <input
                  id="invite-name"
                  type="text"
                  required
                  placeholder="Contoh: Prof. Dr. Ir. Jaka Sembiring, M.Eng."
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full min-h-12 px-4 rounded-xl border border-[#c9c2b1] bg-[#f8f4e8] text-sm font-semibold focus:outline-none focus:border-[#3976bf] focus:ring-2 focus:ring-[#3976bf]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5" htmlFor="invite-category">
                  Kategori &amp; Kedatangan
                </label>
                <select
                  id="invite-category"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value as any)}
                  className="w-full min-h-12 px-3 rounded-xl border border-[#c9c2b1] bg-[#f8f4e8] text-sm font-bold focus:outline-none focus:border-[#3976bf] focus:ring-2 focus:ring-[#3976bf]/20"
                >
                  <option value="vvip">VVIP · 17.30 WIB</option>
                  <option value="vip">VIP · 18.00 WIB</option>
                  <option value="reguler">Reguler · 18.00 WIB</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#3976bf] hover:bg-[#eb5a4b] active:scale-95 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-200"
            >
              <Plus size={16} />
              <span>Buat Undangan</span>
            </button>
          </form>

          {/* Kotak Hasil Undangan Baru Siap Kirim */}
          {latestInvite && (
            <div className="mt-6 rounded-2xl bg-[#f8f5ee] p-5 border border-[#e4dcce] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800">
                  Undangan Berhasil Dibuat untuk:{" "}
                  <strong className="text-[#3976bf]">{latestInvite.name}</strong> ({latestInvite.label})
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#3976bf]/10 text-[#3976bf]">
                  Kedatangan {latestInvite.arrival} WIB
                </span>
              </div>

              <textarea
                rows={7}
                readOnly
                value={generateWhatsappMessage(latestInvite)}
                className="w-full p-3 rounded-xl border border-[#c9c2b1] bg-white text-xs font-mono text-stone-700 leading-relaxed focus:outline-none"
              />

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => copyText(generateWhatsappMessage(latestInvite), "pesan")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3976bf] hover:bg-[#eb5a4b] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  {copiedPesan ? <Check size={14} /> : <Send size={14} />}
                  <span>{copiedPesan ? "Pesan Tersalin!" : "Salin Pesan WhatsApp"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => copyText(latestInvite.url, "tautan")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#c9c2b1] bg-white text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors"
                >
                  {copiedTautan ? <Check size={14} className="text-[#3976bf]" /> : <ExternalLink size={14} />}
                  <span>{copiedTautan ? "Tautan Tersalin!" : "Salin Tautan"}</span>
                </button>
                <Link
                  href={latestInvite.url}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-stone-600 text-xs font-semibold hover:underline"
                >
                  Buka Undangan ↗
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Section: Kartu Ringkasan Statistik */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-5 rounded-2xl border border-[#e4dcce] shadow-2xs text-center">
            <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Total Tamu</span>
            <p className="text-3xl font-extrabold text-stone-800 mt-1">{total}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#e4dcce] shadow-2xs text-center">
            <span className="text-xs text-[#3976bf] font-semibold uppercase tracking-wider">Hadir</span>
            <p className="text-3xl font-extrabold text-[#3976bf] mt-1">{hadir}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#e4dcce] shadow-2xs text-center">
            <span className="text-xs text-[#eb5a4b] font-semibold uppercase tracking-wider">Berhalangan</span>
            <p className="text-3xl font-extrabold text-[#eb5a4b] mt-1">{berhalangan}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#e4dcce] shadow-2xs text-center">
            <span className="text-xs text-amber-700 font-semibold uppercase tracking-wider">Belum Konfirmasi</span>
            <p className="text-3xl font-extrabold text-amber-700 mt-1">{belum}</p>
          </div>
        </section>

        {/* Section: Daftar Tamu & Pencarian */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e4dcce] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-xl font-extrabold text-[#1f2822]">Daftar Tamu Undangan</h2>
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="search"
                placeholder="Cari nama tamu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#c9c2b1] bg-[#f8f4e8] text-xs font-semibold focus:outline-none focus:border-[#3976bf]"
              />
            </div>
          </div>

          <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
            {filteredGuests.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                Nama tamu tidak ditemukan.
              </div>
            ) : (
              filteredGuests.map((guest) => {
                const isCopied = copiedId === guest.id;
                return (
                  <div
                    key={guest.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#faf7f0] transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-stone-900">{guest.name}</strong>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#3976bf]/10 text-[#3976bf]">
                          {guest.label} · {guest.arrival} WIB
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500">
                        Pertunjukan 19.00 WIB · Saung Angklung Udjo
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {guest.attendance === "hadir" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white bg-[#3976bf]">
                          <CheckCircle2 size={13} /> Hadir
                        </span>
                      ) : guest.attendance === "berhalangan" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white bg-[#eb5a4b]">
                          <XCircle size={13} /> Berhalangan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-amber-800 bg-amber-100">
                          Belum konfirmasi
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(guest.url);
                          setCopiedId(guest.id);
                          setTimeout(() => setCopiedId(null), 1800);
                        }}
                        className="px-3 py-1 text-xs font-bold rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 shadow-2xs transition-colors"
                      >
                        {isCopied ? "Tersalin ✓" : "Salin Tautan"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
