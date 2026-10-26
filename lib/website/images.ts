import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { fileTypeFromBuffer } from "file-type";
import { getPayloadClient } from "@/lib/crm/payload";
import type { VisualKawasan } from "@/payload-types";
import {
  DEFAULT_WEBSITE_IMAGES,
  WEBSITE_SECTIONS,
  type WebsiteImage,
  type WebsiteSection,
} from "./content";

import { IMAGE_MIME_TYPES, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES, VIDEO_MIME_TYPES } from "./media";

export { MAX_IMAGE_BYTES } from "./media";

export class ImageInputError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

export function mergeWebsiteImages(docs: VisualKawasan[]): WebsiteImage[] {
  const images = new Map(DEFAULT_WEBSITE_IMAGES.map((image) => [image.key, { ...image }]));
  for (const doc of docs) {
    if (!doc.placement || !doc.section || doc.mimeType?.startsWith("video/")) continue;
    const fallback = images.get(doc.placement);
    const image = doc.filename
      ? `/api/visual-kawasan/file/${encodeURIComponent(doc.filename)}`
      : fallback?.image;
    if (!image) continue;
    const video = doc.section === "banner" && typeof doc.heroVideo === "object" ? doc.heroVideo : null;
    images.set(doc.placement, {
      key: doc.placement,
      section: doc.section,
      title: doc.title ?? fallback?.title ?? doc.alt,
      description: doc.description ?? "",
      category: doc.category ?? "",
      alt: doc.alt,
      image,
      video: video?.filename && VIDEO_MIME_TYPES.includes(video.mimeType || "")
        ? `/api/visual-kawasan/file/${encodeURIComponent(video.filename)}`
        : null,
      videoMediaId: video?.id ?? (typeof doc.heroVideo === "number" ? doc.heroVideo : null),
      position: doc.position ?? 0,
      visible: doc.visible !== false,
      mediaId: doc.id,
    });
  }
  return [...images.values()].sort((a, b) => a.position - b.position || a.key.localeCompare(b.key));
}

export async function getWebsiteImages(): Promise<WebsiteImage[]> {
  const payload = await getPayloadClient();
  const docs: VisualKawasan[] = [];
  let page = 1;
  while (true) {
    const result = await payload.find({
      collection: "visual-kawasan",
      where: { section: { exists: true } },
      depth: 1,
      limit: 100,
      page,
      sort: "id",
    });
    docs.push(...result.docs);
    if (!result.hasNextPage) break;
    page += 1;
  }
  return mergeWebsiteImages(docs);
}

function textField(form: FormData, name: string, label: string, max: number, required = false) {
  const value = form.get(name);
  if (value !== null && typeof value !== "string") throw new ImageInputError(`${label} tidak valid.`);
  const text = (value || "").trim();
  if (required && !text) throw new ImageInputError(`${label} wajib diisi.`);
  if (text.length > max) throw new ImageInputError(`${label} maksimal ${max} karakter.`);
  return text;
}

export function parseImageFields(form: FormData) {
  const section = textField(form, "section", "Bagian beranda", 20, true);
  if (!WEBSITE_SECTIONS.some((item) => item.id === section)) throw new ImageInputError("Bagian beranda tidak valid.");
  const rawPosition = textField(form, "position", "Urutan", 6, true);
  if (!/^\d+$/.test(rawPosition) || Number(rawPosition) > 9999) throw new ImageInputError("Urutan harus berupa angka 0 sampai 9999.");
  const visible = form.get("visible");
  if (visible !== "true" && visible !== "false") throw new ImageInputError("Status tampil tidak valid.");
  const mediaType = textField(form, "mediaType", "Jenis media", 10) || "image";
  if (mediaType !== "image" && mediaType !== "video") throw new ImageInputError("Jenis media tidak valid.");
  if (mediaType === "video" && section !== "banner") throw new ImageInputError("Video hanya tersedia untuk banner beranda.");
  return {
    mediaType,
    section: section as WebsiteSection,
    title: textField(form, "title", "Judul", 160, true),
    alt: textField(form, "alt", "Deskripsi gambar", 240, true),
    description: textField(form, "description", "Keterangan", 1200),
    category: textField(form, "category", "Kategori", 60),
    position: Number(rawPosition),
    visible: visible === "true",
  };
}

async function prepareFile(form: FormData) {
  const value = form.get("image");
  if (!value || (value instanceof File && value.size === 0)) return undefined;
  if (!(value instanceof File)) throw new ImageInputError("Pilih file gambar yang valid.");
  if (value.size > MAX_IMAGE_BYTES) throw new ImageInputError("Ukuran gambar maksimal 8 MB.");
  if (!IMAGE_MIME_TYPES.includes(value.type)) throw new ImageInputError("Gunakan gambar JPG, PNG, atau WebP.");
  const input = Buffer.from(await value.arrayBuffer());
  let data: Buffer;
  try {
    const image = sharp(input, { limitInputPixels: 40_000_000, failOn: "error" });
    const metadata = await image.metadata();
    if (!["jpeg", "png", "webp"].includes(metadata.format || "")) throw new Error("Format tidak didukung");
    data = await image.rotate().resize({ width: 2560, height: 2560, fit: "inside", withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
  } catch {
    throw new ImageInputError("Gambar tidak dapat dibaca. Gunakan JPG, PNG, atau WebP dengan resolusi maksimal 40 megapiksel.");
  }
  return { data, name: `${randomUUID()}.webp`, mimetype: "image/webp", size: data.length };
}

export async function prepareVideo(form: FormData) {
  const value = form.get("video");
  if (!value || (value instanceof File && value.size === 0)) return undefined;
  if (!(value instanceof File)) throw new ImageInputError("Pilih file video yang valid.");
  if (value.size > MAX_VIDEO_BYTES) throw new ImageInputError("Ukuran video maksimal 30 MB.");
  if (!VIDEO_MIME_TYPES.includes(value.type)) throw new ImageInputError("Gunakan video MP4 atau WebM.");
  const data = Buffer.from(await value.arrayBuffer());
  let type;
  try {
    type = await fileTypeFromBuffer(data);
  } catch {
    throw new ImageInputError("Video tidak dapat dibaca. Gunakan file MP4 atau WebM yang valid.");
  }
  if (!type || !VIDEO_MIME_TYPES.includes(type.mime) || type.mime !== value.type) {
    throw new ImageInputError("Isi file harus berupa video MP4 atau WebM yang sesuai formatnya.");
  }
  return { data, name: `${randomUUID()}.${type.ext}`, mimetype: type.mime, size: data.length };
}

export async function saveWebsiteImage(form: FormData, existingKey?: string) {
  const { mediaType, ...fields } = parseImageFields(form);
  const payload = await getPayloadClient();
  const fallback = DEFAULT_WEBSITE_IMAGES.find((image) => image.key === existingKey);
  const result = existingKey
    ? await payload.find({ collection: "visual-kawasan", where: { placement: { equals: existingKey } }, depth: 0, limit: 1 })
    : null;
  const existing = result?.docs[0];
  if (existingKey && !existing && !fallback) throw new ImageInputError("Gambar tidak ditemukan. Muat ulang daftar gambar.", 404);
  if (fallback && fallback.section !== fields.section) throw new ImageInputError("Bagian gambar bawaan tidak dapat dipindahkan.");
  if (existing?.section && existing.section !== fields.section) throw new ImageInputError("Bagian konten tidak dapat dipindahkan.");
  const file = await prepareFile(form);
  if (!file && !fallback && !existing?.filename) throw new ImageInputError("Pilih gambar untuk konten baru.");
  const videoFile = await prepareVideo(form);
  if (videoFile && (fields.section !== "banner" || mediaType !== "video")) throw new ImageInputError("Video hanya dapat diunggah untuk banner dengan jenis media Video.");
  const previousVideo = typeof existing?.heroVideo === "number" ? existing.heroVideo : existing?.heroVideo?.id;
  if (mediaType === "video" && !videoFile && !previousVideo) throw new ImageInputError("Pilih video untuk banner ini.");
  let newVideoId: number | undefined;
  if (videoFile) {
    const video = await payload.create({
      collection: "visual-kawasan",
      data: { alt: fields.alt, title: fields.title, area: "lainnya" },
      file: videoFile,
    });
    newVideoId = video.id;
  }
  const data = {
    ...fields,
    heroVideo: mediaType === "video" ? newVideoId ?? previousVideo : null,
    placement: existingKey || `custom-${randomUUID()}`,
    area: existing?.area || (fields.section === "fasilitas" ? "fasilitas" as const : "lainnya" as const),
  };
  try {
    if (existing) {
      await payload.update({ collection: "visual-kawasan", id: existing.id, data, ...(file ? { file } : {}) });
    } else {
      await payload.create({ collection: "visual-kawasan", data, ...(file ? { file } : {}) });
    }
  } catch (error) {
    if (newVideoId !== undefined) {
      try {
        await payload.delete({ collection: "visual-kawasan", id: newVideoId });
      } catch (cleanupError) {
        console.error("Video baru belum berhasil dibersihkan setelah penyimpanan banner gagal", cleanupError);
      }
    }
    throw error;
  }
}

export async function readImageForm(request: Request) {
  // Bound the actual streamed body, including requests without Content-Length.
  const limit = MAX_VIDEO_BYTES + MAX_IMAGE_BYTES + 64 * 1024;
  if (Number(request.headers.get("content-length")) > limit) throw new ImageInputError("Total unggahan maksimal 38 MB (video 30 MB dan gambar 8 MB).", 413);
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) throw new ImageInputError("Permintaan tidak diizinkan.", 403);
  const reader = request.body?.getReader();
  if (!reader) throw new ImageInputError("Form gambar tidak valid.");
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) {
        await reader.cancel();
        throw new ImageInputError("Total unggahan maksimal 38 MB (video 30 MB dan gambar 8 MB).", 413);
      }
      chunks.push(value);
    }
    return await new Response(Buffer.concat(chunks), { headers: { "Content-Type": request.headers.get("content-type") || "" } }).formData();
  } catch (error) {
    if (error instanceof ImageInputError) throw error;
    throw new ImageInputError("Form gambar tidak valid. Silakan coba lagi.");
  }
}

export function imageErrorResponse(error: unknown) {
  if (error instanceof ImageInputError) return Response.json({ error: error.message }, { status: error.status });
  console.error("Pengelolaan gambar beranda gagal", error);
  const seen = new Set<unknown>();
  let cause = error;
  while (cause && typeof cause === "object" && !seen.has(cause)) {
    seen.add(cause);
    const detail = cause as { code?: string; message?: string; cause?: unknown };
    if (detail.code === "42703" || (detail.code === "42P01" && detail.message?.includes("visual_kawasan"))) {
      return Response.json({
        code: "MEDIA_SCHEMA_NOT_READY",
        error: "Media beranda belum siap karena pembaruan sistem belum selesai. Hubungi pengelola website.",
      }, { status: 503 });
    }
    cause = detail.cause;
  }
  return Response.json({ error: "Gambar belum berhasil diproses. Silakan coba lagi." }, { status: 500 });
}
