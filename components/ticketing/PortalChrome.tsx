"use client";
import Link from "next/link";
import { LoginModal } from "./LoginModal";
import { ShoppingBag, Menu, X, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cartSchema } from "@/lib/ticketing/portal-data";

export const CART_KEY = "lup-ticket-cart-v1";
export const CART_EVENT = "lup-cart-changed";
export function PortalHeader({ visitor, google = false }: { visitor: { name: string } | null; google?: boolean }) {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const path = usePathname();
  const router = useRouter();
  useEffect(() => {
    const update = () => {
      try { const parsed = cartSchema.safeParse(JSON.parse(localStorage.getItem(CART_KEY) || "[]")); setCount(parsed.success ? parsed.data.reduce((sum, item) => sum + item.quantity, 0) : 0); }
      catch { setCount(0); }
    };
    update(); window.addEventListener(CART_EVENT, update); window.addEventListener("storage", update);
    return () => { window.removeEventListener(CART_EVENT, update); window.removeEventListener("storage", update); };
  }, []);
  async function logout() {
    setError("");
    try { const response = await fetch("/api/ticketing/auth/logout", { method: "POST" }); if (!response.ok) throw new Error(); router.replace("/order-tickets"); router.refresh(); }
    catch { setError("Belum dapat keluar. Coba lagi."); }
  }
  return <header className="sticky top-0 z-40 border-b border-forest/10 bg-white/95 backdrop-blur">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-3 gap-y-0 px-5 py-3 sm:px-8">
      <Link href="/" aria-label="Beranda tiket Lembur Udjo" className="shrink-0"><span className="flex min-h-12 flex-col justify-center leading-none"><span className="text-xl font-semibold tracking-wide">LEMBUR UDJO</span><span className="mt-1 text-[10px] tracking-[.24em]">PARAHYANGAN</span></span></Link>
      <nav aria-label="Navigasi tiket" className="hidden min-w-0 items-center gap-5 whitespace-nowrap text-sm font-medium lg:flex"><Link href="/order-tickets" aria-current={path === "/order-tickets" ? "page" : undefined}>Pesan Tiket</Link><Link href="/pesanan">Pesanan</Link><Link href="/tiket-saya">Tiket Saya</Link><Link href="/bantuan">Bantuan</Link></nav>
      <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0 lg:gap-3"><label className="hidden text-xs xl:block"><span className="sr-only">Bahasa</span><select aria-label="Bahasa portal" className="min-h-11 rounded-lg bg-transparent px-2"><option value="id">ID — Indonesia</option></select></label>
        <Link href="/keranjang" aria-label={`Keranjang, ${count} tiket`} className="relative flex size-11 items-center justify-center rounded-full border border-forest/15"><ShoppingBag size={20} aria-hidden="true" /><span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-forest px-1 text-[10px] leading-5 text-white">{count}</span></Link>
        <div className="hidden items-center gap-3 whitespace-nowrap text-sm lg:flex">{visitor ? <><Link href="/akun" className="font-semibold">Akun Saya</Link><button type="button" onClick={logout} className="flex min-h-11 items-center gap-1 text-xs"><LogOut size={15} aria-hidden="true" />Keluar</button></> : <><LoginModal google={google} next={path === "/checkout" ? "/checkout" : "/account"} /><Link href="/daftar" className="rounded-full bg-forest px-5 py-3 font-semibold text-white">Daftar</Link></>}</div>
        <div className="lg:hidden">{!visitor && <LoginModal google={google} next={path === "/checkout" ? "/checkout" : "/account"} />}</div><button type="button" aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open} aria-controls="portal-menu" onClick={() => setOpen(!open)} className="flex size-11 items-center justify-center lg:hidden">{open ? <X size={23} /> : <Menu size={23} />}</button>
      </div>
      {open && <nav id="portal-menu" aria-label="Menu seluler" className="mt-3 grid max-h-[calc(100svh-100px)] w-full grid-cols-2 gap-2 overflow-y-auto border-t border-forest/10 pt-3 text-sm lg:hidden">{[["/order-tickets", "Pesan Tiket"], ["/pesanan", "Pesanan"], ["/tiket-saya", "Tiket Saya"], ["/bantuan", "Bantuan"], [visitor ? "/akun" : "/masuk", visitor ? "Akun Saya" : "Masuk"], ...(!visitor ? [["/daftar", "Daftar"]] : [])].map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 hover:bg-forest/5">{label}</Link>)}{visitor && <button type="button" onClick={logout} className="px-3 py-3 text-left">Keluar</button>}</nav>}
      {error && <p role="alert" className="w-full text-xs text-red-800">{error}</p>}
    </div>
  </header>;
}
