"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ImagePlus, LoaderCircle, Pencil, Plus, RefreshCw, X } from "lucide-react";
import { WEBSITE_SECTIONS, type WebsiteImage, type WebsiteSection } from "@/lib/website/content";
import { IMAGE_MIME_TYPES, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES, VIDEO_MIME_TYPES } from "@/lib/website/media";

const inputClass = "min-h-11 min-w-0 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-base sm:text-sm text-stone-900 outline-none focus:border-forest focus:ring-2 focus:ring-forest/15 disabled:bg-stone-100";

export default function WebsiteImages() {
  const router = useRouter();
  const [images, setImages] = useState<WebsiteImage[]>([]);
  const [section, setSection] = useState<WebsiteSection>("banner");
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<{ image: WebsiteImage; isNew: boolean } | null>(null);
  const requestId = useRef(0);

  const fetchImages = useCallback(async (): Promise<WebsiteImage[]> => {
    const response = await fetch("/api/website-images", { cache: "no-store" });
    if (response.status === 401) {
      router.replace("/admin/login");
      throw new Error("Sesi berakhir. Silakan masuk kembali.");
    }
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Daftar gambar belum berhasil dimuat.");
    return data.images;
  }, [router]);

  const applyImages = useCallback((images: WebsiteImage[]) => {
    setImages(images);
    setLoaded(true);
    setError("");
  }, []);

  const showError = useCallback((error: unknown) => {
    setError(error instanceof Error ? error.message : "Daftar gambar belum berhasil dimuat. Coba lagi.");
  }, []);

  async function load() {
    const id = ++requestId.current;
    try {
      const images = await fetchImages();
      if (id === requestId.current) applyImages(images);
    } catch (error) {
      if (id === requestId.current) showError(error);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }

  useEffect(() => {
    const id = ++requestId.current;
    void fetchImages()
      .then((images) => { if (id === requestId.current) applyImages(images); })
      .catch((error: unknown) => { if (id === requestId.current) showError(error); })
      .finally(() => { if (id === requestId.current) setLoading(false); });
    return () => { requestId.current += 1; };
  }, [fetchImages, applyImages, showError]);

  const items = images.filter((image) => image.section === section);
  const currentSection = WEBSITE_SECTIONS.find((item) => item.id === section)!;

  function addImage() {
    setEditing({
      isNew: true,
      image: {
        key: "", section, title: "", alt: "", description: "", category: "", image: "",
        position: items.length ? Math.max(...items.map((image) => image.position)) + 1 : 0,
        visible: true, mediaId: null,
      },
    });
  }

  return (
    <section aria-labelledby="website-images-title">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Konten website</p>
          <h1 id="website-images-title" className="mt-2 font-tan text-2xl text-forest sm:text-3xl">Media beranda</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-600">Kelola foto, video hero, dan cerita yang dilihat pengunjung. Perubahan tampil di beranda setelah disimpan.</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl border border-stone-300 bg-white px-4 text-sm font-medium hover:bg-stone-50">
          Lihat beranda <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </div>

      <div className="my-6 grid grid-cols-3 gap-2 rounded-2xl border border-stone-200 bg-white p-2" aria-label="Bagian gambar">
        {WEBSITE_SECTIONS.map((item) => (
          <button key={item.id} type="button" aria-pressed={section === item.id} onClick={() => setSection(item.id)} className={`min-h-12 rounded-xl px-2 text-xs font-semibold transition-colors sm:text-sm ${section === item.id ? "bg-forest text-white" : "text-stone-600 hover:bg-cream"}`}>
            {item.label}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}{loaded && " Data terakhir tetap ditampilkan."}</p>}
      <p role="status" aria-live="polite" className={notice ? "mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" : "sr-only"}>{notice}</p>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-forest">{currentSection.label}</h2>
          <p className="mt-1 text-xs text-stone-500">{loaded ? `${items.filter((image) => image.visible).length} tampil · ${items.length} konten` : currentSection.description}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => { setLoading(true); void load(); }} disabled={loading} aria-label="Muat ulang gambar" className="flex size-11 items-center justify-center rounded-xl border border-stone-300 bg-white text-stone-600 disabled:opacity-50">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} aria-hidden="true" />
          </button>
          <button type="button" onClick={addImage} disabled={!loaded || loading} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-forest px-4 text-sm font-semibold text-white hover:bg-forest-light disabled:opacity-50">
            <Plus size={18} aria-hidden="true" /> {section === "banner" ? "Tambah banner" : "Tambah gambar"}
          </button>
        </div>
      </div>

      {loading && !loaded ? (
        <div role="status" aria-label="Memuat gambar" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => <div key={item} className="h-80 animate-pulse rounded-2xl border border-stone-200 bg-stone-100" />)}
        </div>
      ) : loaded && !items.length ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-12 text-center">
          <ImagePlus size={32} className="mx-auto text-stone-400" aria-hidden="true" />
          <h3 className="mt-4 font-semibold text-forest">Belum ada gambar</h3>
          <p className="mt-2 text-sm text-stone-500">Tambahkan foto pertama untuk bagian ini.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((image) => (
            <article key={image.key} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className={`relative aspect-[16/10] bg-stone-100 ${image.visible ? "" : "opacity-60"}`}>
                <Image src={image.image} alt={image.alt} fill unoptimized sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${image.visible ? "bg-white text-forest" : "bg-stone-800 text-white"}`}>{image.visible ? "Tampil" : "Disembunyikan"}</span>
                {image.videoMediaId && <span className="absolute bottom-3 left-3 rounded-full bg-forest px-2.5 py-1 text-xs font-semibold text-white">Video hero</span>}
              </div>
              <div className="p-4">
                <div className="flex justify-between gap-3 text-xs text-stone-500"><span>{image.category || currentSection.label}</span><span className="shrink-0">Urutan {image.position}</span></div>
                <h3 className="mt-2 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-forest">{image.title}</h3>
                <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-stone-500">{image.description || "Belum ada keterangan."}</p>
                <button type="button" onClick={() => setEditing({ image, isNew: false })} aria-label={`Ubah ${image.section === "banner" ? "banner" : "gambar"} ${image.title}`} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-cream text-sm font-semibold text-forest hover:bg-stone-100">
                  <Pencil size={16} aria-hidden="true" /> {image.section === "banner" ? "Ubah banner" : "Ubah gambar"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && <ImageEditor image={editing.image} isNew={editing.isNew} onClose={() => setEditing(null)} onSaved={() => {
        setEditing(null);
        setNotice("Media berhasil disimpan dan diterapkan ke beranda.");
        setLoading(true);
        void load();
      }} />}
    </section>
  );
}

function ImageEditor({ image, isNew, onClose, onSaved }: { image: WebsiteImage; isNew: boolean; onClose: () => void; onSaved: () => void }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">(image.videoMediaId ? "video" : "image");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const modal = dialog.current;
    modal?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { modal?.close(); document.body.style.overflow = previous; };
  }, []);

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  useEffect(() => {
    return () => { if (videoPreview) URL.revokeObjectURL(videoPreview); };
  }, [videoPreview]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setError("");
    if (isNew && !file) { setError("Pilih gambar untuk konten baru."); fileInput.current?.focus(); return; }
    if (mediaType === "video" && !videoFile && !image.videoMediaId) { setError("Pilih video untuk banner ini."); videoInput.current?.focus(); return; }
    const form = new FormData(event.currentTarget);
    form.set("section", image.section);
    form.set("visible", form.has("visible") ? "true" : "false");
    form.set("mediaType", mediaType);
    if (mediaType === "video" && videoFile) form.set("video", videoFile);
    else form.delete("video");
    if (file) form.set("image", file);
    else form.delete("image");
    setSaving(true);
    try {
      const response = await fetch(isNew ? "/api/website-images" : `/api/website-images/${encodeURIComponent(image.key)}`, { method: isNew ? "POST" : "PUT", body: form });
      if (response.status === 401) { router.replace("/admin/login"); throw new Error("Sesi berakhir. Silakan masuk kembali."); }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gambar belum berhasil disimpan.");
      onSaved();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Gambar belum berhasil disimpan. Periksa koneksi dan coba lagi.");
      setSaving(false);
    }
  }

  const source = preview || image.image;
  const videoSource = videoPreview || image.video;
  return (
    <dialog ref={dialog} aria-labelledby="image-editor-title" onCancel={(event) => { event.preventDefault(); if (!saving) onClose(); }} className="fixed inset-0 m-auto max-h-[100dvh] w-full max-w-2xl overflow-y-auto overscroll-contain border-0 bg-cream p-0 text-stone-900 shadow-2xl backdrop:bg-forest/60 sm:max-h-[92dvh] sm:rounded-2xl">
      <form onSubmit={submit}>
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-stone-200 bg-cream px-5 py-4 sm:px-6">
          <div><p className="text-xs text-stone-500">{WEBSITE_SECTIONS.find((item) => item.id === image.section)?.label}</p><h2 id="image-editor-title" className="mt-1 text-lg font-semibold text-forest">{isNew ? "Tambah" : "Ubah"} {image.section === "banner" ? "banner" : "gambar"}</h2></div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Tutup form gambar" className="flex size-11 items-center justify-center rounded-xl hover:bg-stone-200 disabled:opacity-40"><X size={21} aria-hidden="true" /></button>
        </div>
        <fieldset disabled={saving} className="space-y-5 p-5 sm:p-6">
          {image.section === "banner" && (
            <fieldset>
              <legend className="mb-2 text-sm font-semibold">Jenis banner</legend>
              <div className="grid grid-cols-2 gap-3">
                {(["image", "video"] as const).map((type) => (
                  <label key={type} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm font-semibold ${mediaType === type ? "border-forest bg-forest/5 text-forest" : "border-stone-300 bg-white"}`}>
                    <input type="radio" name="banner-type" value={type} checked={mediaType === type} onChange={() => { setMediaType(type); setError(""); setVideoFile(null); setVideoPreview(""); }} className="size-4 accent-forest" />
                    {type === "image" ? "Gambar" : "Video"}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          {mediaType === "video" && (
            <div>
              {videoSource && <video key={videoSource} src={videoSource} poster={source || undefined} controls muted playsInline preload="metadata" aria-label="Pratinjau video hero" className="mb-3 aspect-video w-full rounded-xl bg-stone-950 object-cover" />}
              <label htmlFor="website-video-file" className="mb-2 block text-sm font-semibold">{image.videoMediaId ? "Ganti video (opsional)" : "Pilih video"}</label>
              <input ref={videoInput} id="website-video-file" name="video" type="file" accept="video/mp4,video/webm" aria-describedby="video-file-hint" className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-forest file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white`} onChange={(event) => {
                const selected = event.target.files?.[0];
                setError("");
                if (selected && (selected.size > MAX_VIDEO_BYTES || !VIDEO_MIME_TYPES.includes(selected.type))) {
                  setError("Gunakan video MP4 atau WebM maksimal 30 MB.");
                  event.target.value = "";
                  setVideoFile(null); setVideoPreview(""); return;
                }
                setVideoFile(selected || null); setVideoPreview(selected ? URL.createObjectURL(selected) : "");
              }} />
              <p id="video-file-hint" className="mt-2 text-xs leading-relaxed text-stone-500">MP4 (H.264) atau WebM, maksimal 30 MB. Disarankan video mendatar 8–15 detik. Hero memutar video tanpa suara; gambar cadangan tampil saat video belum siap atau tidak dapat diputar.</p>
            </div>
          )}
          <div>
            <div className="relative mb-3 flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
              {source ? <Image src={source} alt="Pratinjau gambar yang dipilih" fill unoptimized sizes="640px" className="object-cover" /> : <ImagePlus size={40} className="text-stone-400" aria-hidden="true" />}
            </div>
            <label htmlFor="website-image-file" className="mb-2 block text-sm font-semibold">{mediaType === "video" ? (isNew ? "Pilih gambar cadangan" : "Ganti gambar cadangan (opsional)") : (isNew ? "Pilih gambar" : "Ganti foto (opsional)")}</label>
            <input ref={fileInput} id="website-image-file" name="image" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="image-file-hint" className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-forest file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white`} onChange={(event) => {
              const selected = event.target.files?.[0];
              setError("");
              if (selected && (selected.size > MAX_IMAGE_BYTES || !IMAGE_MIME_TYPES.includes(selected.type))) {
                setError("Gunakan gambar JPG, PNG, atau WebP maksimal 8 MB.");
                event.target.value = "";
                setFile(null); setPreview(""); return;
              }
              setFile(selected || null); setPreview(selected ? URL.createObjectURL(selected) : "");
            }} />
            <p id="image-file-hint" className="mt-2 text-xs leading-relaxed text-stone-500">JPG, PNG, atau WebP, maksimal 8 MB. Gunakan foto mendatar untuk hasil terbaik.</p>
          </div>
          <div><label htmlFor="image-title" className="mb-2 block text-sm font-semibold">Judul <span className="text-rose-700">*</span></label><input id="image-title" name="title" required maxLength={160} defaultValue={image.title} className={inputClass} /></div>
          <div><label htmlFor="image-alt" className="mb-2 block text-sm font-semibold">Deskripsi gambar <span className="text-rose-700">*</span></label><input id="image-alt" name="alt" required maxLength={240} defaultValue={image.alt} aria-describedby="image-alt-hint" className={inputClass} /><p id="image-alt-hint" className="mt-2 text-xs text-stone-500">Jelaskan isi foto secara singkat untuk pengunjung yang memakai pembaca layar.</p></div>
          <div><label htmlFor="image-description" className="mb-2 block text-sm font-semibold">Keterangan di beranda</label><textarea id="image-description" name="description" maxLength={1200} rows={3} defaultValue={image.description} className={inputClass} /></div>
          <div className="grid gap-5 sm:grid-cols-2">
            {image.section !== "banner" && <div><label htmlFor="image-category" className="mb-2 block text-sm font-semibold">Kategori</label><input id="image-category" name="category" maxLength={60} defaultValue={image.category} placeholder="Misalnya: Edukasi" className={inputClass} /></div>}
            <div><label htmlFor="image-position" className="mb-2 block text-sm font-semibold">Urutan tampil</label><input id="image-position" name="position" type="number" required min={0} max={9999} step={1} defaultValue={image.position} aria-describedby="image-position-hint" className={inputClass} /><p id="image-position-hint" className="mt-2 text-xs text-stone-500">Angka kecil tampil lebih dahulu, mulai dari 0.</p></div>
          </div>
          <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border border-stone-200 bg-white p-4"><input name="visible" type="checkbox" defaultChecked={image.visible} className="mt-0.5 size-5 shrink-0 accent-forest" /><span><span className="block text-sm font-semibold">Tampilkan di beranda</span><span className="mt-1 block text-xs leading-relaxed text-stone-500">Matikan untuk menyembunyikan konten ini dari pengunjung.</span></span></label>
        </fieldset>
        {error && <p role="alert" className="mx-5 mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 sm:mx-6">{error}</p>}
        <div className="sticky bottom-0 flex flex-wrap justify-end gap-3 border-t border-stone-200 bg-cream px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
          <button type="button" onClick={onClose} disabled={saving} className="min-h-11 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold disabled:opacity-50">Batal</button>
          <button type="submit" disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-forest px-4 text-sm font-semibold text-white hover:bg-forest-light disabled:opacity-60">{saving && <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />}{saving ? "Menyimpan…" : "Simpan & terapkan"}</button>
        </div>
      </form>
    </dialog>
  );
}
