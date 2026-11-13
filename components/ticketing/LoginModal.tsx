"use client";
import Image from "next/image";
import Link from "next/link";
import { useId, useRef } from "react";
import { X } from "lucide-react";
import { VisitorAuthForm } from "./VisitorAuthForm";
export function LoginModal({ google = false, next = "/account", onOpen }: { google?: boolean; next?: string; onOpen?: () => void }) {
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  return <><button type="button" onClick={() => { onOpen?.(); dialog.current?.showModal(); }} className="min-h-11 px-2 py-3">Masuk</button><dialog ref={dialog} aria-labelledby={titleId} className="fixed inset-0 m-auto max-h-[90svh] w-[min(94vw,940px)] overflow-y-auto rounded-3xl border-0 bg-cream p-0 text-forest shadow-2xl backdrop:bg-forest/60" onClick={event => { if (event.target === event.currentTarget) { const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current?.close(); } }}>
    <button type="button" aria-label="Tutup formulir masuk" onClick={() => dialog.current?.close()} className="absolute right-3 top-3 z-10 flex size-11 items-center justify-center rounded-full border border-forest/10 bg-white text-forest"><X size={20} /></button>
    <div className="grid md:grid-cols-[.85fr_1.15fr]"><aside className="relative flex min-h-40 flex-col justify-end overflow-hidden bg-forest p-6 text-white md:min-h-[600px] md:p-9"><Image src="/angklung.webp" alt="Angklung dan suasana budaya Lembur Udjo" fill sizes="(max-width: 767px) 94vw, 400px" className="object-cover opacity-65" /><div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" /><div className="relative"><p className="text-xs uppercase tracking-widest">Lembur Udjo Parahyangan</p><h2 className="mt-3 text-3xl font-semibold">Awali cerita kunjunganmu</h2><p className="mt-3 hidden text-sm leading-7 md:block">Simpan rencana, kelola reservasi, dan temukan tiketmu dalam satu akun.</p><Link href={`/daftar?lanjut=${encodeURIComponent(next)}`} onClick={() => dialog.current?.close()} className="mt-4 inline-flex min-h-11 items-center text-sm underline">Belum punya akun? Daftar</Link></div></aside><section className="px-2 pb-4 pt-8 sm:px-5 sm:pb-6 md:pt-14"><h2 id={titleId} className="px-6 text-2xl font-semibold">Selamat datang kembali</h2><VisitorAuthForm register={false} next={next} google={google} onAuthenticated={() => dialog.current?.close()} /></section></div>
  </dialog></>;
}
