"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  CreditCard,
  ExternalLink,
  Eye,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  Ticket,
  Users,
  XCircle,
} from "lucide-react";
import { rupiah } from "@/lib/ticketing/types";
import type { StaffOrder, StaffOrderStatus, StaffSummary } from "@/lib/ticketing/staff";

const PAGE_SIZE = 25;

const STATUS_META: Record<StaffOrderStatus, { label: string; badge: string; dot: string }> = {
  PENDING: { label: "Menunggu bayar", badge: "border-amber-200 bg-amber-50 text-amber-800", dot: "bg-amber-400" },
  PAID: { label: "Lunas", badge: "border-emerald-200 bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  PAYMENT_REVIEW: { label: "Perlu review", badge: "border-violet-200 bg-violet-50 text-violet-700", dot: "bg-violet-400" },
  EXPIRED: { label: "Kedaluwarsa", badge: "border-stone-200 bg-stone-100 text-stone-500", dot: "bg-stone-400" },
  CANCELLED: { label: "Dibatalkan", badge: "border-rose-200 bg-rose-50 text-rose-700", dot: "bg-rose-400" },
  REFUNDED: { label: "Refund", badge: "border-sky-200 bg-sky-50 text-sky-700", dot: "bg-sky-400" },
};

const TICKET_META: Record<string, { label: string; badge: string }> = {
  ISSUED: { label: "Aktif", badge: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  USED: { label: "Dipakai", badge: "border-stone-200 bg-stone-100 text-stone-500" },
  CANCELLED: { label: "Dibatalkan", badge: "border-rose-200 bg-rose-50 text-rose-600" },
};

const PAYMENT_LABELS: Record<string, string> = {
  PENDING: "Perlu dibayar",
  AUTHORIZED: "Dipinjamkan/authorized",
  SETTLED: "Diterima",
  FAILED: "Gagal",
  EXPIRED: "Kedaluwarsa",
  REFUNDED: "Dikembalikan",
};

const FILTERS: Array<{ id: StaffOrderStatus | ""; label: string }> = [
  { id: "", label: "Semua status" },
  { id: "PENDING", label: "Menunggu bayar" },
  { id: "PAYMENT_REVIEW", label: "Perlu review" },
  { id: "PAID", label: "Lunas" },
  { id: "EXPIRED", label: "Kedaluwarsa" },
  { id: "CANCELLED", label: "Dibatalkan" },
  { id: "REFUNDED", label: "Refund" },
];

const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200";

function formatWib(iso: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).format(new Date(iso));
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

export default function TicketApp({
  initialOrders,
  initialSummary,
  initialError,
}: {
  initialOrders: StaffOrder[];
  initialSummary: StaffSummary | null;
  initialError: string;
}) {
  const router = useRouter();
  const [orders, setOrders] = useState<StaffOrder[]>(initialOrders);
  const [summary, setSummary] = useState<StaffSummary | null>(initialSummary);
  const [error, setError] = useState(initialError);
  const [notice, setNotice] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<StaffOrderStatus | "">("");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [drawerOrder, setDrawerOrder] = useState<string | null>(null);
  const [busyOrder, setBusyOrder] = useState("");
  const [actionError, setActionError] = useState("");
  const [hasMore, setHasMore] = useState(initialOrders.length >= PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const requestId = useRef(0);

  const opened = orders.find((order) => order.orderNumber === drawerOrder) || null;

  const load = useCallback(async (nextStatus: StaffOrderStatus | "", nextSearch: string) => {
    const id = ++requestId.current;
    setRefreshing(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (nextStatus) params.set("status", nextStatus);
      if (nextSearch) params.set("q", nextSearch);
      const res = await fetch(`/api/staff/orders?${params.toString()}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        throw new Error(data.error || "Gagal memuat pesanan.");
      }
      if (id !== requestId.current) return;
      setOrders(data.orders || []);
      if (data.summary) setSummary(data.summary);
      setHasMore((data.orders || []).length >= PAGE_SIZE);
    } catch (err) {
      if (id === requestId.current) setError((err as Error).message);
    } finally {
      if (id === requestId.current) setRefreshing(false);
    }
  }, [router]);

  const loadMore = useCallback(async () => {
    const id = ++requestId.current;
    setLoadingMore(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filter) params.set("status", filter);
      if (appliedSearch) params.set("q", appliedSearch);
      params.set("skip", String(orders.length));
      const res = await fetch(`/api/staff/orders?${params.toString()}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        throw new Error(data.error || "Gagal memuat pesanan.");
      }
      if (id !== requestId.current) return;
      const more: StaffOrder[] = data.orders || [];
      const known = new Set(orders.map((order) => order.orderNumber));
      setOrders((current) => [...current, ...more.filter((order) => !known.has(order.orderNumber))]);
      setHasMore(more.length >= PAGE_SIZE);
    } catch (err) {
      if (id === requestId.current) setError((err as Error).message);
    } finally {
      if (id === requestId.current) setLoadingMore(false);
    }
  }, [appliedSearch, filter, orders, router]);

  async function act(order: StaffOrder, action: "refresh" | "expire") {
    setBusyOrder(order.orderNumber);
    setActionError("");
    try {
      const res = await fetch("/api/staff/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, orderNumber: order.orderNumber }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        throw new Error(data.error || "Gagal memproses permintaan.");
      }
      const updated: StaffOrder | undefined = data.order;
      if (updated) setOrders((current) => current.map((item) => (item.orderNumber === updated.orderNumber ? updated : item)));
      const message = action === "expire"
        ? (updated?.status === "EXPIRED" ? "Pesanan ditandai kedaluwarsa." : "Pesanan belum bisa ditandai kedaluwarsa.")
        : data.settled
          ? updated?.status === "PENDING"
            ? "Status Midtrans ditemukan, seperti sedang diproses. Data sudah disegarkan."
            : "Pembayaran diperbarui dari Midtrans."
          : "Pembayaran belum terekam di Midtrans. Kuota tetap ditahan sampai jatuh tempo.";
      setNotice(message);
    } catch (err) {
      setActionError((err as Error).message);
    } finally {
      setBusyOrder("");
    }
  }

  async function logout() {
    setLoggingOut(true);
    try {
      const responses = await Promise.all([fetch("/api/auth/logout", { method: "POST" }), fetch("/api/staff/session", { method: "DELETE" })]);
      if (responses.some(response => !response.ok)) throw new Error("Belum dapat keluar. Coba lagi.");
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  useEffect(() => {
    const timer = window.setInterval(() => router.refresh(), 5 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, [router]);

  const cards = [
    { label: "Menunggu bayar", value: summary?.counts.PENDING ?? 0, hint: "Kuota sesi ditahan menunggu bayar", tone: "bg-amber-50 text-amber-800", status: "PENDING" as const, icon: CalendarClock },
    { label: "Perlu review", value: summary?.counts.PAYMENT_REVIEW ?? 0, hint: "Bayar telat / refund sebagian", tone: "bg-violet-50 text-violet-700", status: "PAYMENT_REVIEW" as const, icon: Eye },
    { label: "Lunas", value: summary?.counts.PAID ?? 0, hint: "Tiket sudah diterbitkan", tone: "bg-emerald-50 text-emerald-700", status: "PAID" as const, icon: BadgeCheck },
    { label: "Kedaluwarsa", value: summary?.counts.EXPIRED ?? 0, hint: "Tak menyelesaikan pembayaran", tone: "bg-stone-100 text-stone-600", status: "EXPIRED" as const, icon: XCircle },
  ];

  return (
    <div className="min-h-svh bg-cream text-stone-900">
      <a
        href="#tiket-workspace"
        className="sr-only z-50 rounded-xl bg-white px-4 py-3 text-forest focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Ke daftar pesanan
      </a>
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-20 max-w-[1400px] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs text-stone-500">
              <span className="hidden sm:inline">Admin</span>
              <span className="hidden sm:inline" aria-hidden="true">
                ·
              </span>
              <span className="truncate">Panel tiket</span>
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold text-forest">Tiket Lembur Udjo</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/admin/tiket/katalog" className="inline-flex min-h-11 items-center rounded-xl border border-stone-300 px-3 text-sm font-semibold">Katalog & jadwal</Link>
            <Link
              href="/admin"
              className={`inline-flex min-h-11 items-center gap-2 rounded-xl border border-stone-300 px-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest ${focus}`}
            >
              <Users size={18} aria-hidden="true" />
              <span className="hidden sm:inline">Ruang kerja CRM</span>
              <ArrowUpRight size={15} aria-hidden="true" className="sm:hidden" />
            </Link>
            <button
              type="button"
              disabled={loggingOut}
              onClick={() => logout()}
              className={`inline-flex min-h-11 items-center gap-2 rounded-xl border border-stone-300 px-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-cream disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest ${focus}`}
            >
              <LogOut size={18} aria-hidden="true" />
              <span className="hidden sm:inline">{loggingOut ? "Sedang keluar…" : "Keluar"}</span>
            </button>
          </div>
        </div>
      </header>

      <main id="tiket-workspace" tabIndex={-1} className="outline-none">
        <section className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8" aria-busy={refreshing}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-bamboo">Panel penjualan tiket</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-forest sm:text-3xl">
                Pesanan &amp; pembayaran tiket.
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600">
                Pantau pesanan, periksa pembayaran, dan tangani pesanan yang perlu ditinjau.
              </p>
            </div>
            <button
              type="button"
              disabled={refreshing}
              onClick={() => load(filter, appliedSearch)}
              className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-forest px-4 text-sm font-semibold text-white transition-colors hover:bg-forest-light disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 ${focus}`}
            >
              <RefreshCw size={17} aria-hidden="true" className={refreshing ? "motion-safe:animate-spin" : undefined} />
              {refreshing ? "Memuat…" : "Muat ulang"}
            </button>
          </div>

          {summary && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {cards.map(({ label, value, hint, tone, status, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setFilter(status);
                    load(status, appliedSearch);
                  }}
                  className={`rounded-2xl border border-stone-200 bg-white p-4 text-left transition-colors hover:border-forest/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 ${focus}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span className="text-2xl font-bold tabular-nums text-stone-900">
                      {value.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-stone-800">{label}</p>
                  <p className="text-xs text-stone-500">{hint}</p>
                </button>
              ))}
            </div>
          )}

          {summary && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-stone-200 bg-forest p-4 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Total lunas</p>
                <p className="mt-1.5 text-xl font-bold tabular-nums">{rupiah(summary.paidTotal)}</p>
                <p className="mt-0.5 text-xs text-white/65">Nominal pesanan berstatus lunas</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">Perlu review</p>
                <p className="mt-1.5 text-xl font-bold tabular-nums text-stone-900">{rupiah(summary.reviewTotal)}</p>
                <p className="mt-0.5 text-xs text-stone-500">Nominal yang perlu diverifikasi</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">Tiket aktif</p>
                <p className="mt-1.5 text-xl font-bold tabular-nums text-stone-900">
                  {summary.tickets.ISSUED.toLocaleString("id-ID")}
                </p>
                <p className="mt-0.5 text-xs text-stone-500">
                  {summary.tickets.USED.toLocaleString("id-ID")} dipakai ·{" "}
                  {summary.tickets.CANCELLED.toLocaleString("id-ID")} dibatalkan
                </p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">Pembatalan/refund</p>
                <p className="mt-1.5 text-xl font-bold tabular-nums text-stone-900">
                  {(summary.counts.CANCELLED + summary.counts.REFUNDED).toLocaleString("id-ID")}
                </p>
                <p className="mt-0.5 text-xs text-stone-500">
                  {summary.counts.CANCELLED.toLocaleString("id-ID")} dibatalkan ·{" "}
                  {summary.counts.REFUNDED.toLocaleString("id-ID")} refund
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label className="flex min-h-11 items-center gap-2 text-sm font-semibold text-stone-600">
                Status
              </label>
              <select
                value={filter}
                onChange={(event) => {
                  const next = event.target.value as StaffOrderStatus | "";
                  setFilter(next);
                  load(next, appliedSearch);
                }}
                className="min-h-11 rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/15 lg:w-52"
              >
                {FILTERS.map((option) => (
                  <option key={option.id || "ALL"} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <form
                className="flex flex-1 flex-col gap-2 sm:flex-row"
                onSubmit={(event) => {
                  event.preventDefault();
                  const next = search.trim();
                  setAppliedSearch(next);
                  load(filter, next);
                }}
              >
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari nomor pesanan, nama, email, atau WhatsApp…"
                  className="min-h-11 min-w-0 flex-1 rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/15"
                />
                <button
                  type="submit"
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-stone-300 px-4 text-sm font-semibold text-stone-700 transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest ${focus}`}
                >
                  <Search size={17} aria-hidden="true" />
                  Cari
                </button>
              </form>
            </div>

            <div className="mt-4" role="status" aria-live="polite">
              {error && (
                <p className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                  {error}
                </p>
              )}
              {notice && !drawerOrder && (
                <p className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                  {notice}
                </p>
              )}
            </div>

            <ul className="mt-2 space-y-2">
              {orders.map((order) => {
                const meta = STATUS_META[order.status];
                return (
                  <li key={order.orderNumber}>
                    <button
                      type="button"
                      onClick={() => {
                        setDrawerOrder(order.orderNumber);
                        setNotice("");
                        setActionError("");
                      }}
                      className={`flex w-full flex-col gap-2 rounded-xl border border-stone-200 px-3 py-3 text-left transition-colors hover:border-forest/40 hover:bg-cream sm:flex-row sm:items-center sm:gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest ${focus}`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className={`inline-block size-2 shrink-0 rounded-full ${meta.dot}`} aria-hidden="true" />
                          <span className="truncate font-mono text-sm font-semibold text-stone-900">
                            {order.orderNumber}
                          </span>
                        </span>
                        <span className="mt-1 block truncate text-xs text-stone-500">
                          {order.customer.name} · {formatWib(order.createdAt)}
                        </span>
                      </span>
                      <span className="min-w-0 flex-1 truncate text-xs text-stone-600">
                        {order.items.map((item) => `${item.quantity}× ${item.productName}`).join(", ")}
                        <br />
                        <span className="text-stone-400">{formatDate(order.items[0]?.date || "")} {order.items[0] ? `· sesi ${order.items[0].session}` : ""}</span>
                      </span>
                      <span className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${meta.badge}`}>
                          {meta.label}
                        </span>
                        <span className="text-sm font-bold tabular-nums text-stone-900">
                          {rupiah(order.totalAmount)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
              {orders.length === 0 && !refreshing && (
                <li className="rounded-xl border border-dashed border-stone-300 px-3 py-8 text-center text-sm text-stone-500">
                  Tidak ada pesanan yang cocok. Coba ubah filter atau kata kunci.
                </li>
              )}
            </ul>

            {hasMore && (
              <button
                type="button"
                disabled={loadingMore || refreshing}
                onClick={() => loadMore()}
                className={`mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-stone-300 text-sm font-semibold text-stone-700 transition-colors hover:bg-cream disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest ${focus}`}
              >
                {loadingMore ? <Loader2 size={17} aria-hidden="true" className="motion-safe:animate-spin" /> : <Ticket size={17} aria-hidden="true" />}
                {loadingMore ? "Memuat…" : "Muat lebih banyak"}
              </button>
            )}
          </div>

          <p className="mt-4 text-xs text-stone-500">
            {orders.length.toLocaleString("id-ID")} pesanan ditampilkan · kuota sesi ditahan otomatis sampai 15 menit setelah
            pesanan dibuat.
          </p>
        </section>
      </main>

      {opened && (
        <div className="fixed inset-0 z-40 flex justify-end" role="dialog" aria-modal="true" aria-label={`Detail pesanan ${opened.orderNumber}`}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOrder(null)} />
          <aside className="relative flex h-dvh w-full flex-col border-l border-stone-200 bg-white shadow-2xl sm:w-[480px]">
            <header className="flex items-start gap-3 border-b border-stone-200 px-4 py-4 sm:px-5">
              <div className="min-w-0 flex-1">
                <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${STATUS_META[opened.status].badge}`}>
                  {STATUS_META[opened.status].label}
                </span>
                <h2 className="mt-1.5 break-words font-mono text-lg font-extrabold leading-tight text-stone-950">
                  {opened.orderNumber}
                </h2>
                <p className="text-[11px] text-stone-500">Dibuat {formatWib(opened.createdAt)}</p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOrder(null)}
                aria-label="Tutup detail pesanan"
                className={`h-11 w-11 shrink-0 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest ${focus}`}
              >
                ✕
              </button>
            </header>

            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5">
              {actionError && (
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                  {actionError}
                </p>
              )}
              {notice && (
                <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                  {notice}
                </p>
              )}

              <section>
                <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-stone-400">Pelanggan</h3>
                <div className="mt-2.5 space-y-2 rounded-xl border border-stone-200 bg-stone-50 p-3">
                  <p className="flex items-center gap-2 text-sm font-semibold text-stone-800">
                    <Users size={16} aria-hidden="true" />
                    {opened.customer.name}
                  </p>
                  <p className="pl-6 text-xs break-words text-stone-600">{opened.customer.email}</p>
                  {opened.customer.whatsapp && <p className="pl-6 text-xs break-words text-stone-600">WhatsApp {opened.customer.whatsapp}</p>}
                  <div className="flex flex-wrap gap-2 pl-6">
                    {opened.customer.whatsapp && (
                      <a
                        href={`https://wa.me/${opened.customer.whatsapp.replace(/\D/g, "").replace(/^0/, "62")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-[#25D366] px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-white hover:brightness-95"
                      >
                        Chat WhatsApp
                      </a>
                    )}
                    <a
                      href={`mailto:${opened.customer.email}`}
                      className="rounded-lg border border-stone-300 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-stone-600 hover:bg-stone-100"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-stone-400">Rincian tiket</h3>
                <ul className="mt-2.5 space-y-2">
                  {opened.items.map((item) => (
                    <li key={`${item.productName}-${item.date}-${item.session}`} className="rounded-xl border border-stone-200 px-3 py-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-stone-800">
                          {item.quantity}× {item.productName}
                        </p>
                        <p className="text-sm font-bold tabular-nums text-stone-900">{rupiah(item.lineTotal)}</p>
                      </div>
                      <p className="mt-0.5 text-xs text-stone-500">
                        {formatDate(item.date)} · sesi {item.session} WIB · {rupiah(item.unitPrice)}/tiket
                      </p>
                    </li>
                  ))}
                  <li className="flex items-center justify-between border-t border-stone-200 pt-2 text-sm">
                    <span className="font-semibold text-stone-700">Total</span>
                    <span className="font-bold tabular-nums text-stone-900">{rupiah(opened.totalAmount)}</span>
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-stone-400">Pembayaran</h3>
                <div className="mt-2.5 space-y-2 rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs text-stone-600">
                  {opened.payment ? (
                    <>
                      <p>
                        <span className="font-semibold text-stone-800">{PAYMENT_LABELS[opened.payment.status] || opened.payment.status}</span>{" "}
                        · kanal {opened.payment.providerPaymentId ? "terhubung Midtrans" : "belum memilih metode"}
                      </p>
                      {opened.payment.paidAt && <p>Sertifikat pembayaran diterima {formatWib(opened.payment.paidAt)}.</p>}
                      <p>
                        Jatuh tempo {formatWib(opened.expiresAt)}
                        {opened.status === "PENDING" && new Date(opened.expiresAt) <= new Date() && " · sudah lewat"}
                      </p>
                      {opened.payment.checkoutUrl && opened.status === "PENDING" && (
                        <a
                          href={opened.payment.checkoutUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-stone-600 hover:bg-stone-100"
                        >
                          Buka halaman bayar
                          <ExternalLink size={13} aria-hidden="true" />
                        </a>
                      )}
                    </>
                  ) : (
                    <p>Tidak ada catatan pembayaran.</p>
                  )}
                  {opened.paidAt && <p className="text-stone-500">Pesanan lunas {formatWib(opened.paidAt)} WIB.</p>}
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-stone-400">
                  Tiket ({opened.tickets.length})
                </h3>
                {opened.tickets.length > 0 ? (
                  <ul className="mt-2.5 flex flex-wrap gap-1.5">
                    {opened.tickets.map((ticket) => {
                      const meta = TICKET_META[ticket.status] || { label: ticket.status, badge: "border-stone-200 bg-stone-100 text-stone-500" };
                      return (
                        <li key={ticket.code}>
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-mono font-semibold ${meta.badge}`}>
                            {ticket.code}
                            <span className="font-sans text-[9px] uppercase tracking-wider opacity-70">{meta.label}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs text-stone-500">Tiket diterbitkan otomatis setelah pembayaran lunas.</p>
                )}
              </section>

              <section className="space-y-2 border-t border-stone-200 pt-4">
                {(opened.status === "PENDING" || opened.status === "PAYMENT_REVIEW" || opened.status === "PAID") ? (
                  <button
                    type="button"
                    disabled={busyOrder === opened.orderNumber}
                    onClick={() => act(opened, "refresh")}
                    className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-forest py-2.5 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-forest-light disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 ${focus}`}
                  >
                    <CreditCard size={16} aria-hidden="true" />
                    {busyOrder === opened.orderNumber ? "Memperbarui…" : "Periksa pembayaran via Midtrans"}
                  </button>
                ) : (
                  <p className="text-xs leading-relaxed text-stone-500">
                    {opened.status === "EXPIRED" || opened.status === "CANCELLED"
                      ? "Pesanan tidak dibayar. Kuota sesi sudah dilepas."
                      : "Status akhir pesanan; perubahan dikuasai pembayaran refund Midtrans."}
                  </p>
                )}
                {opened.status === "PENDING" && new Date(opened.expiresAt) <= new Date() && (
                  <button
                    type="button"
                    disabled={busyOrder === opened.orderNumber}
                    onClick={() => act(opened, "expire")}
                    className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-stone-300 py-2.5 text-xs font-extrabold uppercase tracking-wider text-stone-700 hover:bg-stone-100 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest ${focus}`}
                  >
                    {busyOrder === opened.orderNumber ? "Memproses…" : "Tandai kedaluwarsa"}
                  </button>
                )}
              </section>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
