"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Sprout,
} from "lucide-react";

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const passwordInput = useRef<HTMLInputElement>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || !password) return;
    setLoading(true);
    setError("");
    setInvalidPassword(false);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.status === 401) {
        setInvalidPassword(true);
        setError("Kata sandi belum sesuai. Periksa kembali, lalu coba lagi.");
        setLoading(false);
        passwordInput.current?.focus();
        return;
      }
      if (!res.ok) {
        setError(
          "Belum bisa masuk saat ini. Coba lagi atau hubungi pengelola akses CRM.",
        );
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError(
        "Koneksi belum berhasil. Periksa koneksi internet Anda, lalu coba lagi.",
      );
      setLoading(false);
    }
  }

  return (
    <main className="min-h-svh bg-cream p-4 sm:p-6 lg:p-5">
      <div className="mx-auto grid min-h-[calc(100svh-2rem)] max-w-[1440px] gap-6 sm:min-h-[calc(100svh-3rem)] lg:min-h-[calc(100svh-2.5rem)] lg:grid-cols-2 lg:gap-10 xl:gap-16">
        <aside
          className="relative hidden min-h-[640px] flex-col justify-between overflow-hidden rounded-[2rem] bg-forest p-8 text-white lg:flex xl:p-12"
          aria-labelledby="welcome-title"
        >
          <Image
            src="/Hero.ecoland.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 1px"
            className="object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-forest via-forest/40 to-forest/40"
          />
          <div className="relative flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm">
              <Sprout size={25} aria-hidden="true" />
            </span>
            <div>
              <p className="text-lg font-semibold tracking-tight">
                Lembur Udjo
              </p>
              <p className="text-xs tracking-[0.18em] text-white/85">
                PARAHYANGAN
              </p>
            </div>
          </div>
          <div className="relative mt-32">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-forest/30 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
              <span
                className="size-1.5 rounded-full bg-amber-200"
                aria-hidden="true"
              />
              Ruang layanan tim Udjo
            </span>
            <h2
              id="welcome-title"
              className="mt-6 max-w-lg font-playfair text-4xl leading-[1.2] tracking-tight xl:text-5xl"
            >
              Setiap kunjungan,
              <br />
              berawal dari
              <br />
              <span className="italic text-[#e6d3a3]">sapaan hangat.</span>
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/85">
              Satu ruang untuk menyambut calon pengunjung, merencanakan
              kunjungan, dan menjaga setiap hubungan.
            </p>
            <div className="mt-9 flex items-center gap-3 border-t border-white/20 pt-5 text-xs tracking-wide text-white/80">
              <span>Budaya</span>
              <span aria-hidden="true">·</span>
              <span>Alam</span>
              <span aria-hidden="true">·</span>
              <span>Kebersamaan</span>
            </div>
          </div>
        </aside>

        <section
          aria-labelledby="login-title"
          className="flex min-w-0 flex-col px-1 py-2 sm:px-6 lg:px-3 lg:py-4 xl:pr-10"
        >
          <Link
            href="/"
            className={`inline-flex min-h-11 w-fit items-center gap-2 rounded-lg px-2 text-sm font-medium text-stone-600 transition-colors hover:text-forest ${focus}`}
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Kembali ke website
          </Link>

          <div className="flex flex-1 items-center justify-center py-8 sm:py-12">
            <div className="w-full max-w-[420px]">
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-forest text-cream">
                  <Sprout size={23} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-forest">Lembur Udjo</p>
                  <p className="text-xs text-stone-600">
                    Parahyangan · Ruang layanan
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-forest/10 bg-forest/5 px-3 py-1.5 text-xs font-semibold text-forest">
                <LockKeyhole size={13} aria-hidden="true" />
                Akses admin CRM
              </span>
              <h1
                id="login-title"
                className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-forest sm:text-4xl"
              >
                Selamat datang
                <br />
                kembali.
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                Masuk untuk mengelola kontak, reservasi, dan tindak lanjut
                pengunjung Lembur Udjo.
              </p>

              <form
                onSubmit={submit}
                aria-busy={loading}
                className="mt-8 rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_12px_40px_-24px_rgba(13,35,23,0.2)] sm:p-7"
              >
                <label
                  htmlFor="crm-password"
                  className="block text-sm font-semibold text-stone-800"
                >
                  Kata sandi
                </label>
                <div className="relative mt-2">
                  <LockKeyhole
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-stone-500"
                  />
                  <input
                    ref={passwordInput}
                    id="crm-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    readOnly={loading}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setInvalidPassword(false);
                      setError("");
                    }}
                    onKeyDown={(e) =>
                      setCapsLock(e.getModifierState("CapsLock"))
                    }
                    onKeyUp={(e) => setCapsLock(e.getModifierState("CapsLock"))}
                    onBlur={() => setCapsLock(false)}
                    aria-invalid={invalidPassword}
                    aria-describedby={`password-hint${error ? " password-error" : ""}${capsLock ? " caps-lock-hint" : ""}`}
                    className={`min-h-14 w-full rounded-xl border bg-stone-50/70 py-3.5 pr-14 pl-11 text-base text-stone-900 outline-none transition-colors placeholder:text-stone-500 focus:bg-white focus:ring-2 ${invalidPassword ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100" : "border-stone-300 focus:border-forest focus:ring-forest/10"}`}
                    placeholder="Masukkan kata sandi Anda"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((shown) => !shown)}
                    aria-label={
                      showPassword
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
                    }
                    aria-pressed={showPassword}
                    aria-controls="crm-password"
                    className={`absolute top-1/2 right-1 flex size-12 -translate-y-1/2 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-stone-100 hover:text-forest ${focus}`}
                  >
                    {showPassword ? (
                      <EyeOff size={19} aria-hidden="true" />
                    ) : (
                      <Eye size={19} aria-hidden="true" />
                    )}
                  </button>
                </div>
                <p
                  id="password-hint"
                  className="mt-2 text-xs leading-relaxed text-stone-600"
                >
                  Gunakan kata sandi admin yang diberikan pengelola.
                </p>
                {capsLock && (
                  <p
                    id="caps-lock-hint"
                    role="status"
                    className="mt-2 text-xs font-medium text-amber-800"
                  >
                    Caps Lock sedang aktif.
                  </p>
                )}
                {error && (
                  <div
                    id="password-error"
                    role="alert"
                    className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-3 text-sm leading-relaxed text-rose-800"
                  >
                    <AlertCircle
                      size={17}
                      className="mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    <p>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !password}
                  className={`mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-60 ${focus}`}
                >
                  {loading ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="motion-safe:animate-spin"
                        aria-hidden="true"
                      />
                      Sedang masuk…
                    </>
                  ) : (
                    <>
                      Masuk ke CRM
                      <ArrowRight size={18} aria-hidden="true" />
                    </>
                  )}
                </button>
                <p role="status" aria-live="polite" className="sr-only">
                  {loading ? "Memeriksa kata sandi. Mohon tunggu." : ""}
                </p>
              </form>

              <p className="mt-6 text-center text-xs leading-relaxed text-stone-600">
                Butuh akses atau lupa kata sandi?
                <br />
                <span className="font-medium text-stone-700">
                  Hubungi pengelola akses CRM.
                </span>
              </p>
            </div>
          </div>

          <p className="flex items-center justify-center gap-2 text-center text-xs text-stone-600">
            <LockKeyhole size={13} aria-hidden="true" />
            Akses khusus tim Lembur Udjo Parahyangan.
          </p>
        </section>
      </div>
    </main>
  );
}
