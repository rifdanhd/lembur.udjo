import type { CollectionConfig } from "payload";
import path from "node:path";

export const VisualKawasan: CollectionConfig = {
  slug: "visual-kawasan",
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },

  admin: {
    useAsTitle: "alt",
    defaultColumns: ["alt", "area", "description", "updatedAt"],
    group: "Website",
  },

  upload: {
    // Runtime uploads live on the VPS; they are not build artifacts to trace.
    staticDir: path.resolve(/* turbopackIgnore: true */ process.env.MEDIA_UPLOAD_DIR || "visual-kawasan"),
    filesRequiredOnCreate: false,
    mimeTypes: [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "video/mp4",
      "video/webm",
    ],
    adminThumbnail: "thumbnail",
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        fit: "cover",
      },
      {
        name: "card",
        width: 800,
        height: 600,
        fit: "cover",
      },
      {
        name: "hero",
        width: 1920,
        height: 1080,
        fit: "cover",
      },
    ],
  },

  fields: [
    {
      name: "placement",
      type: "text",
      unique: true,
      label: "Identitas posisi gambar",
      admin: { readOnly: true },
    },
    {
      name: "section",
      type: "select",
      label: "Bagian beranda",
      options: [
        { label: "Banner beranda", value: "banner" },
        { label: "Fasilitas", value: "fasilitas" },
        { label: "Galeri", value: "galeri" },
      ],
    },
    { name: "title", type: "text", label: "Judul", maxLength: 160 },
    { name: "category", type: "text", label: "Kategori", maxLength: 60 },
    { name: "position", type: "number", label: "Urutan", defaultValue: 0, min: 0, max: 9999 },
    { name: "visible", type: "checkbox", label: "Tampilkan di beranda", defaultValue: true },
    {
      name: "heroVideo",
      type: "upload",
      relationTo: "visual-kawasan",
      label: "Video hero",
      maxDepth: 1,
      filterOptions: { mimeType: { in: ["video/mp4", "video/webm"] } },
      admin: { condition: (_, siblingData) => siblingData.section === "banner" },
    },
    {
      name: "alt",
      type: "text",
      required: true,
      label: "Alt Text / Judul",
    },
    {
      name: "area",
      type: "select",
      required: true,
      options: [
        { label: "Area Depan", value: "area-depan" },
        { label: "Panggung", value: "panggung" },
        { label: "Kolam", value: "kolam" },
        { label: "Fasilitas", value: "fasilitas" },
        { label: "Lainnya", value: "lainnya" },
      ],
    },
    {
      name: "description",
      type: "textarea",
      label: "Deskripsi",
    },
  ],
};
