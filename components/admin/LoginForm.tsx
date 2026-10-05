"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal login");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-white border border-stone-200 rounded-2xl shadow-sm p-7 sm:p-8"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-forest">
          Lembur Udjo Parahyangan
        </span>
        <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-stone-950">Login CRM</h1>
        <p className="mt-1 text-xs text-stone-500">Masukkan password admin untuk melanjutkan.</p>

        <label className="block mt-6 text-[11px] font-bold uppercase tracking-wider text-stone-500">
          Password
        </label>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/15"
          placeholder="••••••••"
        />

        {error && <p className="mt-3 text-xs font-semibold text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={loading || !password}
          className="mt-5 w-full rounded-lg bg-forest text-white text-xs font-extrabold uppercase tracking-wider py-3 hover:bg-stone-950 disabled:opacity-50 transition-colors"
        >
          {loading ? "Memeriksa…" : "Masuk"}
        </button>
      </form>
    </main>
  );
}
