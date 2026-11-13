"use client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
export function ProfileForm({ visitor }: { visitor: { name: string; email: string } }) {
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false); const router = useRouter();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/ticketing/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name") }) });
      const data = await response.json(); setMessage(response.ok ? "Profil tersimpan." : data.error); if (response.ok) router.refresh();
    } catch { setMessage("Profil belum dapat disimpan."); } finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="max-w-xl space-y-5 rounded-2xl border border-forest/15 bg-white p-6"><label className="block text-sm">Nama lengkap<input name="name" required minLength={2} maxLength={100} defaultValue={visitor.name} className="mt-2 min-h-12 w-full rounded-xl border border-forest/20 px-4" /></label><p className="break-all text-sm">Email: {visitor.email}</p><p className="text-xs text-stone-500">Hubungi bantuan untuk perubahan email dengan verifikasi kepemilikan akun.</p><button disabled={busy} className="min-h-12 rounded-full bg-forest px-6 text-white">{busy ? "Menyimpan…" : "Simpan profil"}</button><p role="status" className="text-sm">{message}</p></form>;
}
