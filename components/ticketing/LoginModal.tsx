"use client";
import Image from "next/image";
import Link from "next/link";
import { useId, useRef } from "react";
import { X } from "lucide-react";
import { VisitorAuthForm } from "./VisitorAuthForm";
export function LoginModal({ google = false, next = "/account", onOpen }: { google?: boolean; next?: string; onOpen?: () => void }) {
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  return <><button type="button" onClick={() => { onOpen?.(); dialog.current?.showModal(); }} className="min-h-11 px-2 py-3">Masuk</button><dialog ref={dialog} aria-labelledby={titleId} className="fixed inset-0 z-50 m-auto max-h-[92svh] w-[min(96vw,1024px)] overflow-y-auto rounded-[2rem] border-0 bg-white text-forest shadow-2xl backdrop:bg-forest/40 backdrop-blur-sm" onClick={event => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current?.close(); } }}>
    <button type="button" aria-label="Tutup formulir masuk" onClick={() => dialog.current?.close()} className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full border border-bamboo/20 bg-white text-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bamboo"><X size={20} /></button>
    <div className="grid md:grid-cols-[1fr_1.15fr]">
      <aside className="relative hidden min-h-44 flex-col justify-end overflow-hidden bg-forest p-8 text-white md:flex lg:min-h-[560px] lg:p-10">
        <Image src="/Pertunjukanluar.webp" alt="Suasana pertunjukan angklung di Lembur Udjo" fill sizes="(max-width: 767px) 96vw, 440px" className="object-cover object-center opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3d2a1f]/90 via-[#3d2a1f]/30 to-transparent" />
        <div className="relative z-10">
          <p className="text-[10px] uppercase tracking-widest text-white/80">Lembur Udjo Parahyangan</p>
          <h2 className="mt-4 text-3xl font-playfair leading-tight">Awali cerita kunjunganmu</h2>
          <p className="mt-4 text-sm leading-7 text-white/80 max-w-xs">Simpan rencana, kelola reservasi, dan temukan tiketmu dalam satu akun.</p>
          <Link href={`/daftar?lanjut=${encodeURIComponent(next)}`} onClick={() => dialog.current?.close()} className="mt-6 inline-flex min-h-12 items-center gap-2 text-sm font-semibold underline underline-offset-4">Belum punya akun? Daftar <ArrowRightIcon size={16} /></Link>
        </div>
      </aside>
      <section className="px-6 pb-8 pt-10 sm:px-8 sm:pb-10 md:pt-14 lg:px-12">
        <h2 id={titleId} className="px-0 text-2xl font-playfair leading-tight">Selamat datang kembali</h2>
        <p className="mt-3 max-w-md text-sm leading-7 text-stone-600">Masuk untuk melihat pesanan dan tiket yang terhubung dengan akunmu.</p>
        <VisitorAuthForm register={false} next={next} google={google} onAuthenticated={() => dialog.current?.close()} />
      </section>
    </div>
  </dialog></>;
};

function ArrowRightIcon({ size }: { size: number }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 14 14-14-14"/><path d="m19 12-6 6"/><path d="m19 12-6-6"/></svg>
}
