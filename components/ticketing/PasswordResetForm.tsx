"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
export function PasswordResetForm({ reset }: { reset: boolean }) {
  const [token, setToken] = useState(""); const [busy, setBusy] = useState(false); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  useEffect(() => { const read = () => { const hash = window.location.hash.slice(1); if (/^[a-f0-9]{64}$/.test(hash)) { setToken(hash); history.replaceState(null, "", window.location.pathname); } }; read(); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage(""); const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/ticketing/auth/password-reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(reset ? { token, password: form.get("password") } : { email: form.get("email") }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Permintaan belum dapat diproses."); setMessage(data.message);
    } catch (err) { setError(err instanceof Error ? err.message : "Layanan belum tersedia."); } finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="mx-auto max-w-lg rounded-2xl border border-forest/15 bg-white p-6"><fieldset disabled={busy || Boolean(message)} className="space-y-5"><label className="block text-sm">{reset ? "Kata sandi baru (minimal 12 karakter)" : "Email akun"}<input name={reset ? "password" : "email"} type={reset ? "password" : "email"} autoComplete={reset ? "new-password" : "email"} minLength={reset ? 12 : undefined} maxLength={reset ? 128 : 254} required className="mt-2 min-h-12 w-full rounded-xl border border-forest/20 px-4" /></label><button disabled={reset && !token} className="min-h-12 rounded-full bg-forest px-6 text-sm text-white disabled:opacity-50">{busy ? "Memproses…" : reset ? "Simpan kata sandi" : "Kirim tautan pemulihan"}</button></fieldset>{reset && !token && <p className="mt-4 text-sm">Buka tautan pemulihan dari email untuk melanjutkan.</p>}{error && <p role="alert" className="mt-4 text-sm text-red-800">{error}</p>}{message && <p role="status" className="mt-4 text-sm">{message}</p>}<Link href="/masuk" className="mt-5 inline-flex min-h-11 items-center text-sm underline">Kembali masuk</Link></form>;
}
