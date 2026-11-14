"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AdminRole } from "@prisma/client";

type Detector = { detect(video: HTMLVideoElement): Promise<{ rawValue: string }[]> };
export function CheckInDesk({ staff }: { staff: { id: string; name: string | null; role: AdminRole } | null }) {
  const router = useRouter(); const [error, setError] = useState(""); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false); const [camera, setCamera] = useState(false);
  const video = useRef<HTMLVideoElement>(null); const stream = useRef<MediaStream | null>(null); const timer = useRef<ReturnType<typeof setTimeout> | null>(null); const running = useRef(false);
  function stop() { running.current = false; if (timer.current) clearTimeout(timer.current); stream.current?.getTracks().forEach(track => track.stop()); stream.current = null; setCamera(false); }
  useEffect(() => () => { running.current = false; if (timer.current) clearTimeout(timer.current); stream.current?.getTracks().forEach(track => track.stop()); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(staff ? "/api/staff/check-in" : "/api/staff/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Permintaan gagal.");
      if (staff) setMessage(`${data.code}: check-in simulasi berhasil. ${data.program} · ${data.session} WIB`); else { router.refresh(); }
    } catch (err) { setError(err instanceof Error ? err.message : "Layanan belum tersedia."); } finally { setBusy(false); }
  }
  async function start() {
    setError(""); setMessage("");
    const Constructor = (window as unknown as { BarcodeDetector?: new(options: { formats: string[] }) => Detector }).BarcodeDetector;
    if (!Constructor) { setError("Pemindai QR belum didukung browser ini. Gunakan kode manual."); return; }
    try {
      const detector = new Constructor({ formats: ["qr_code"] });
      stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      if (!video.current) { stop(); return; }
      video.current.srcObject = stream.current; await video.current.play(); running.current = true; setCamera(true);
      const scan = async () => {
        if (!running.current || !video.current) return;
        try {
          const codes = await detector.detect(video.current);
          if (codes[0]) {
            stop(); setBusy(true);
            const response = await fetch("/api/staff/check-in", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: codes[0].rawValue }) });
            const data = await response.json(); if (!response.ok) throw new Error(data.error || "QR tidak dapat divalidasi.");
            setMessage(`${data.code}: check-in simulasi berhasil. ${data.program} · ${data.session} WIB`); setBusy(false); return;
          }
        } catch (err) { stop(); setBusy(false); setError(err instanceof Error ? err.message : "Pemindaian gagal. Gunakan kode manual."); return; }
        timer.current = setTimeout(() => void scan(), 350);
      };
      void scan();
    } catch { stop(); setError("Kamera belum dapat diakses. Periksa izin kamera atau gunakan kode manual."); }
  }
  const field = "mt-2 min-h-12 w-full rounded-xl border border-forest/20 bg-white px-4";
  return <div className="mt-8 rounded-2xl border border-forest/15 bg-white p-6">{staff?.role === "ADMIN" && <nav className="mb-5 flex flex-wrap gap-4 text-sm"><Link href="/admin/tiket" className="min-h-11 underline">Panel pesanan</Link><Link href="/admin/tiket/check-in" className="min-h-11 underline">Riwayat check-in</Link><Link href="/admin/tiket/katalog" className="min-h-11 underline">Katalog & petugas</Link></nav>}{staff && <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><p className="text-sm">Petugas: {staff.name} · {staff.role}</p><button className="min-h-11 underline" onClick={async () => { stop(); const response = await fetch("/api/staff/session", { method: "DELETE" }); if (response.ok) router.refresh(); else setError("Belum dapat keluar. Coba lagi."); }}>Keluar</button></div>}
    <form onSubmit={submit}><fieldset disabled={busy} className="space-y-5">{staff ? <label className="block text-sm">Kode tiket atau isi QR<input name="code" autoComplete="off" required maxLength={150} className={field} /></label> : <><label className="block text-sm">Email petugas<input name="email" type="email" required autoComplete="username" className={field} /></label><label className="block text-sm">Kata sandi<input name="password" type="password" required autoComplete="current-password" maxLength={128} className={field} /></label></>}<button className="min-h-12 rounded-full bg-forest px-6 text-white">{busy ? "Memproses…" : staff ? "Validasi & check-in" : "Masuk sebagai petugas"}</button></fieldset></form>
    {staff && <div className="mt-6 space-y-4"><video ref={video} playsInline muted className={camera ? "w-full rounded-xl" : "hidden"} /><button type="button" disabled={busy} onClick={camera ? stop : () => void start()} className="min-h-12 rounded-full border border-forest/20 px-6">{camera ? "Hentikan kamera" : "Pindai QR dengan kamera"}</button><p className="text-xs text-stone-500">Tiket hanya berlaku pada tanggal kunjungan dalam WIB.</p></div>}
    {error && <p role="alert" className="mt-5 text-sm text-red-800">{error}</p>}{message && <p role="status" className="mt-5 text-sm text-green-800">{message}</p>}
  </div>;
}
