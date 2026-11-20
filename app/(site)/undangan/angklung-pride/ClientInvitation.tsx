"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  ExternalLink,
  MailOpen,
  MapPin,
  X,
  ZoomIn,
} from "lucide-react";

export type GuestTier = "VVIP" | "VIP" | "Reguler";

const TIER_SCHEDULE: Record<
  GuestTier,
  { arrival: string; timeText: string; caption: string }
> = {
  VVIP: {
    arrival: "17.30",
    timeText: "Kedatangan pukul 17.30 WIB",
    caption: "Pertunjukan utama dimulai tepat pukul 19.00 WIB",
  },
  VIP: {
    arrival: "18.00",
    timeText: "Kedatangan pukul 18.00 WIB",
    caption: "Pertunjukan utama dimulai tepat pukul 19.00 WIB",
  },
  Reguler: {
    arrival: "18.00",
    timeText: "Kedatangan pukul 18.00 WIB",
    caption: "Pertunjukan utama dimulai tepat pukul 19.00 WIB",
  },
};

const EVENT = {
  title: "Angklung Pride 2026",
  subtitle: "One Sound, a Symphony for the World",
  director: "Directed by Buky Wibawa Karya Guna",
  dateFull: "JUMAT, 27 NOVEMBER 2026",
  dateIso: "2026-11-27T19:00:00+07:00",
  time: "19.00 WIB s.d. selesai",
  timeCaption: "Pertunjukan utama dimulai tepat pukul 19.00 WIB",
  venue: "Saung Angklung Udjo",
  address: "Jl. Padasuka No. 118, Pasirlayung, Kec. Cibeunying Kidul, Bandung",
  googleMapsUrl: "https://maps.app.goo.gl/9Z4X3k2K8B8YyH3H7",
  defaultGuest: "Prof. Dr. Ir. Jaka Sembiring, M.Eng.",
  flyerSrc: "/undangan/angklung-pride/flyer.webp",
  flyerWidth: 819,
  flyerHeight: 1024,
  waPanitia: "6282182828600",
} as const;

const STORAGE_KEY = "pride-2026-rsvp-v3";

type Attendance = "hadir" | "berhalangan" | null;

interface StoredData {
  name: string;
  attendance: Attendance;
  tier: GuestTier;
  submittedAt?: string;
}

function parseTier(raw: string | null): GuestTier {
  if (!raw) return "VVIP";
  const normalized = raw.trim().toUpperCase();
  if (normalized === "VIP") return "VIP";
  if (normalized === "REGULER" || normalized === "REGULAR") return "Reguler";
  return "VVIP";
}

export default function ClientInvitation() {
  // State for opening animation
  const [isOpened, setIsOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  // Guest data & Tier (tier tracked silently for admin panel)
  const [guestName, setGuestName] = useState<string>(EVENT.defaultGuest);
  const [tier, setTier] = useState<GuestTier>("VVIP");
  const [customArrival, setCustomArrival] = useState<string | null>(null);

  // RSVP Form & Storage
  const [stored, setStored] = useState<StoredData | null>(null);
  const [formAttendance, setFormAttendance] = useState<Attendance>(null);

  // Modals
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [thankYouOpen, setThankYouOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  // Initialize from URL & LocalStorage once on mount to prevent hydration mismatch
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const paramGuest = params.get("kepada") || params.get("to") || params.get("nama");
      const paramTier = params.get("kategori") || params.get("tipe") || params.get("tier");

      const resolvedGuest = paramGuest?.trim().slice(0, 160) || EVENT.defaultGuest;
      const resolvedTier = parseTier(paramTier);
      const paramJam = params.get("jam") || params.get("waktu") || params.get("arrival");

      setGuestName(resolvedGuest);
      setTier(resolvedTier);
      if (paramJam) {
        setCustomArrival(paramJam.trim());
      }

      // Check auto-open param
      if (params.get("buka") === "1" || params.get("open") === "1") {
        setIsOpened(true);
      }

      // Check existing RSVP
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredData;
        if (parsed && (parsed.attendance === "hadir" || parsed.attendance === "berhalangan")) {
          setStored(parsed);
          setFormAttendance(parsed.attendance);
        }
      }
    } catch {
      // Safe fallback
    }
  }, []);

  // Handle envelope opening with cinematic delay
  const handleOpenInvitation = () => {
    setIsOpening(true);
    setTimeout(() => {
      setIsOpened(true);
      setIsOpening(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600);
  };

  // Handle RSVP Submit -> open thank you modal
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim() || guestName;
    const chosen = (formData.get("attendance") as Attendance) || formAttendance;

    if (!chosen) return;

    const record: StoredData = {
      name,
      attendance: chosen,
      tier,
      submittedAt: new Date().toISOString(),
    };

    setStored(record);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Storage unavailable
    }

    // Open Thank You Pop-Up Modal
    setThankYouOpen(true);
  };

  const schedule = TIER_SCHEDULE[tier] || TIER_SCHEDULE.VVIP;
  const arrivalTimeText = customArrival
    ? (customArrival.includes("WIB") || customArrival.includes("pukul")
        ? customArrival
        : `Kedatangan pukul ${customArrival} WIB`)
    : schedule.timeText;
  const arrivalCaptionText = schedule.caption;

  return (
    <div className="relative min-h-screen bg-[#f8f4e8] text-[#282821] font-['Bricolage_Grotesque',sans-serif] selection:bg-[#fcd964]">
      {/* =========================================================================
          SCREEN 1: ANIMASI COVER AMPLOP SURAT UNDANGAN DIGITAL
      ========================================================================= */}
      {!isOpened && (
        <section
          aria-label="Cover Amplop Undangan"
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f2822]/85 backdrop-blur-md transition-all duration-700 ${
            isOpening ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
          }`}
        >
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#f8f4e8] p-6 sm:p-8 shadow-2xl border-2 border-[#d8cdb8] text-center">
            {/* Ornamen Sudut */}
            <div className="absolute top-3 left-3 text-xs tracking-widest text-[#a8987b] select-none">
              ❖
            </div>
            <div className="absolute top-3 right-3 text-xs tracking-widest text-[#a8987b] select-none">
              ❖
            </div>
            <div className="absolute bottom-3 left-3 text-xs tracking-widest text-[#a8987b] select-none">
              ❖
            </div>
            <div className="absolute bottom-3 right-3 text-xs tracking-widest text-[#a8987b] select-none">
              ❖
            </div>

            {/* Header Amplop */}
            <div className="pt-2">
              <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#3976bf] border border-[#3976bf]/30 bg-[#3976bf]/5 rounded-full">
                Surat Undangan Resmi
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#3976bf]">
                {EVENT.title}
              </h2>
              <p className="mt-1 text-xs text-[#6b685e] italic">{EVENT.subtitle}</p>
            </div>

            {/* Ornamen Pemisah Palet Brand */}
            <div className="my-5 flex items-center justify-center gap-2 text-xs">
              <span className="h-px w-12 bg-[#3976bf]/30" />
              <span className="text-[#3976bf]">◇</span>
              <span className="text-[#eb5a4b] font-bold">✳</span>
              <span className="text-[#fcd964] font-bold">◇</span>
              <span className="h-px w-12 bg-[#3976bf]/30" />
            </div>

            {/* Bagian Penerima Undangan */}
            <div className="my-4 rounded-2xl bg-white/90 p-5 border border-[#e4dcce] shadow-inner">
              <p className="text-xs uppercase tracking-wider text-[#6b685e] font-semibold">
                Kepada Yth. Bapak/Ibu:
              </p>
              <h3 className="mt-2 text-xl sm:text-2xl font-extrabold text-[#282821] leading-snug">
                {guestName}
              </h3>
            </div>

            {/* Jadwal Ringkas */}
            <p className="text-xs text-[#6b685e]">
              {EVENT.dateFull} · {arrivalTimeText}
              <br />
              Pertunjukan mulai 19.00 WIB · <strong>{EVENT.venue}</strong>, Bandung
            </p>

            {/* Tombol Interaktif Buka Undangan dengan Palet Warna Baru */}
            <div className="mt-6 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={handleOpenInvitation}
                disabled={isOpening}
                className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-[#3976bf] hover:bg-[#eb5a4b] active:bg-[#eb5a4b] active:ring-4 active:ring-[#fcd964] px-8 py-3.5 text-sm font-bold tracking-wider uppercase text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <MailOpen
                  size={18}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5"
                />
                <span>{isOpening ? "Membuka Undangan..." : "Buka Undangan"}</span>
              </button>
              <span className="text-[11px] text-[#8a7657] mt-1">
                Ketuk tombol untuk melihat lembar undangan
              </span>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SCREEN 2: ISI UNDANGAN LENGKAP (POSTER & FORM RSVP)
      ========================================================================= */}
      <main className="invitation min-h-screen">
        {/* Kolom Kiri: Poster Flyer dengan Interaksi Zoom / Lightbox */}
        <div className="poster-wrap">
          <div className="relative group w-full max-w-lg cursor-pointer">
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="poster-link relative block w-full rounded-2xl overflow-hidden focus:outline-none focus:ring-4 focus:ring-[#fcd964]"
              aria-label="Perbesar poster Angklung Pride 2026"
            >
              <Image
                src={EVENT.flyerSrc}
                alt="Flyer Angklung Pride 2026 — One Sound, a Symphony for the World"
                width={EVENT.flyerWidth}
                height={EVENT.flyerHeight}
                priority
                className="poster rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Overlay hover badge: Klik untuk zoom */}
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-stone-900 shadow-lg backdrop-blur-xs">
                  <ZoomIn size={16} className="text-[#eb5a4b]" />
                  Klik untuk melihat ukuran penuh
                </span>
              </div>
            </button>

            {/* Hint Mobile di bawah gambar */}
            <div className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-[#6b685e] sm:hidden">
              <ZoomIn size={13} />
              <span>Ketuk foto untuk memperbesar</span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Rincian Undangan & Formulir Konfirmasi */}
        <section
          className="invite-content"
          aria-label="Undangan resmi dan konfirmasi kehadiran"
        >
          {/* Ornamen Tradisional Berwarna Palet Brand */}
          <div className="ornament" aria-hidden="true">
            <span style={{ color: "#3976bf" }}>◇</span>
            <span style={{ color: "#eb5a4b" }}>✳</span>
            <span style={{ color: "#fcd964" }}>◇</span>
          </div>

          {/* Salutation & Guest Card */}
          <div className="mt-4 mb-2">
            <p className="salutation">Kepada Yth:</p>
            <h1 className="guest-name" id="guest-name">
              {guestName}
            </h1>
          </div>

          <p className="intro">
            Dengan hormat, kami mengundang Bapak/Ibu untuk hadir dan merayakan harmoni
            angklung bersama kami dalam pergelaran akbar berkelas dunia.
          </p>

          {/* Detail Jadwal & Lokasi */}
          <div className="event-details">
            <div className="detail-row">
              <span className="detail-label" style={{ color: "#3976bf" }}>
                {EVENT.dateFull}
              </span>
              <strong id="arrival-time">{arrivalTimeText}</strong>
              <span id="arrival-caption">{arrivalCaptionText}</span>
            </div>
            <span className="detail-divider" aria-hidden="true" />
            <div className="detail-row">
              <span className="detail-label" style={{ color: "#3976bf" }}>
                LOKASI ACARA
              </span>
              <strong>{EVENT.venue}</strong>
              <span>{EVENT.address}</span>
              <a
                href={EVENT.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[#3976bf] hover:text-[#eb5a4b] hover:underline"
              >
                <MapPin size={12} /> Buka di Google Maps
                <ExternalLink size={10} />
              </a>
            </div>
          </div>

          {/* Formulir Konfirmasi Kehadiran (RSVP) */}
          <form
            ref={formRef}
            id="rsvp-form"
            className="rsvp"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <h2 id="rsvp-title" className="!font-['Bricolage_Grotesque',sans-serif] text-2xl font-extrabold tracking-tight text-[#1f2822]">
                Konfirmasi Kehadiran
              </h2>
              {stored && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#3976bf] px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 size={12} /> Sudah Mengisi
                </span>
              )}
            </div>
            <p className="form-caption !font-['Bricolage_Grotesque',sans-serif] text-xs text-[#6b685e]">
              Mohon konfirmasikan kehadiran Anda untuk persiapan tempat duduk dan jamuan.
            </p>

            {/* Input Nama Tamu Undangan */}
            <div className="field">
              <label className="field-label" htmlFor="name">
                Nama Tamu Undangan
              </label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={160}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="name-input focus:outline-none focus:border-[#3976bf] focus:ring-2 focus:ring-[#3976bf]/20"
                placeholder="Masukkan nama lengkap Anda"
              />
              <input type="hidden" name="tier" value={tier} />
            </div>

            {/* Pilihan Hadir / Berhalangan dengan Palet Warna Baru saat Dipencet */}
            <fieldset className="choices-field">
              <legend>Status Kehadiran</legend>
              <div className="choices">
                <label
                  className={`choice flex-1 transition-all duration-200 ${
                    formAttendance === "hadir"
                      ? "!border-[#3976bf] !bg-[#3976bf] text-white font-bold ring-4 ring-[#fcd964]/50 shadow-md scale-[1.02]"
                      : "hover:border-[#3976bf]/50 hover:bg-[#3976bf]/5 active:scale-95"
                  }`}
                >
                  <input
                    type="radio"
                    name="attendance"
                    value="hadir"
                    required
                    checked={formAttendance === "hadir"}
                    onChange={() => setFormAttendance("hadir")}
                  />
                  <span>
                    <span
                      aria-hidden="true"
                      className={`font-bold ${formAttendance === "hadir" ? "text-[#fcd964]" : "text-[#3976bf]"}`}
                    >
                      ✓
                    </span>{" "}
                    Hadir
                  </span>
                </label>

                <label
                  className={`choice flex-1 transition-all duration-200 ${
                    formAttendance === "berhalangan"
                      ? "!border-[#eb5a4b] !bg-[#eb5a4b] text-white font-bold ring-4 ring-[#fcd964]/50 shadow-md scale-[1.02]"
                      : "hover:border-[#eb5a4b]/50 hover:bg-[#eb5a4b]/5 active:scale-95"
                  }`}
                >
                  <input
                    type="radio"
                    name="attendance"
                    value="berhalangan"
                    required
                    checked={formAttendance === "berhalangan"}
                    onChange={() => setFormAttendance("berhalangan")}
                  />
                  <span>
                    <span
                      aria-hidden="true"
                      className={`font-bold ${formAttendance === "berhalangan" ? "text-[#fcd964]" : "text-[#eb5a4b]"}`}
                    >
                      —
                    </span>{" "}
                    Berhalangan
                  </span>
                </label>
              </div>
            </fieldset>

            {/* Tombol Kirim Konfirmasi dengan Palet Warna */}
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="primary-button flex items-center justify-center gap-2 w-full py-3.5 text-sm font-bold tracking-wider uppercase bg-[#eb5a4b] hover:bg-[#3976bf] active:bg-[#3976bf] active:ring-4 active:ring-[#fcd964] text-white rounded-xl shadow-md transition-all duration-200 active:scale-[0.98]"
              >
                <span>Kirim Konfirmasi Kehadiran</span>
                <span aria-hidden="true">↗</span>
              </button>

              {stored && (
                <button
                  type="button"
                  onClick={() => setThankYouOpen(true)}
                  className="text-xs font-semibold text-[#3976bf] underline hover:text-[#eb5a4b] text-center py-1 transition-colors"
                >
                  Lihat Rincian Bukti Konfirmasi Kehadiran
                </button>
              )}
            </div>
          </form>

          {/* Penutup */}
          <p className="closing mt-8">
            One Sound, a Symphony for the World.<br />
            <span>Sampai bertemu di Angklung Pride 2026.</span>
          </p>
        </section>
      </main>

      {/* =========================================================================
          MODAL 1: POP-UP TERIMA KASIH (SETELAH KIRIM KONFIRMASI)
      ========================================================================= */}
      {thankYouOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="thank-you-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setThankYouOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-stone-200 text-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Tutup Silang */}
            <button
              type="button"
              onClick={() => setThankYouOpen(false)}
              className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              aria-label="Tutup jendela pop-up"
            >
              <X size={20} />
            </button>

            {/* Icon Status */}
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#3976bf]/10 text-[#3976bf] mb-4">
              <CheckCircle2 size={36} className="text-[#3976bf]" />
            </div>

            <span className="inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#3976bf] bg-[#3976bf]/10 rounded-full border border-[#3976bf]/20">
              Konfirmasi Berhasil Diterima
            </span>

            <h2
              id="thank-you-title"
              className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#3976bf]"
            >
              Hatur Nuhun,
              <br />
              <span className="text-stone-800">{guestName}</span>
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-[#44544a] leading-relaxed">
              {formAttendance === "hadir"
                ? "Konfirmasi kehadiran Anda telah tersimpan. Kami sangat menantikan kehadiran Anda merayakan harmoni angklung."
                : "Terima kasih atas konfirmasi Anda. Kami mendoakan kelancaran agenda Anda dan berharap dapat menyambut Anda di perhelatan berikutnya."}
            </p>

            {/* Kartu Ringkasan (HANYA Nama & Status Kehadiran, Waktu, Tempat) */}
            <div className="my-5 rounded-2xl bg-[#f8f5ee] p-4 text-left border border-[#e4dcce] space-y-2.5">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#e4dcce]">
                <span className="text-stone-500 font-medium">Status Kehadiran:</span>
                <strong
                  className={
                    formAttendance === "hadir"
                      ? "text-[#3976bf] font-extrabold bg-[#3976bf]/10 px-2.5 py-0.5 rounded-full"
                      : "text-[#eb5a4b] font-extrabold bg-[#eb5a4b]/10 px-2.5 py-0.5 rounded-full"
                  }
                >
                  {formAttendance === "hadir" ? "✓ Hadir" : "— Berhalangan Hadir"}
                </strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">Waktu Acara:</span>
                <span className="font-semibold text-stone-800">
                  27 Nov 2026 · {arrivalTimeText}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">Tempat:</span>
                <span className="font-semibold text-stone-800">Saung Angklung Udjo</span>
              </div>
            </div>

            {/* Tombol Aksi Tutup */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setThankYouOpen(false)}
                className="flex min-h-12 w-full items-center justify-center rounded-full bg-[#3976bf] hover:bg-[#eb5a4b] active:ring-4 active:ring-[#fcd964] px-5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all duration-200 active:scale-95"
              >
                Kembali ke Halaman Undangan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: LIGHTBOX ZOOM POSTER (FULLSCREEN PREVIEW)
      ========================================================================= */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan penuh flyer Angklung Pride 2026"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Tombol Close */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 flex size-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform hover:scale-110 hover:bg-white/30"
            aria-label="Tutup zoom gambar"
          >
            <X size={24} />
          </button>

          {/* Container Gambar Zoom */}
          <div
            className="relative max-h-[92vh] max-w-[92vw] overflow-auto rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={EVENT.flyerSrc}
              alt="Flyer Angklung Pride 2026 — Ukuran Penuh"
              width={EVENT.flyerWidth}
              height={EVENT.flyerHeight}
              className="max-h-[88vh] w-auto rounded-xl object-contain shadow-2xl"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
