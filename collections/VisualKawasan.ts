import type { CollectionConfig } from "payload";

export const VisualKawasan: CollectionConfig = {
  slug: "visual-kawasan",

  admin: {
    useAsTitle: "alt",
    defaultColumns: ["alt", "area", "description", "updatedAt"],
    group: "Website",
  },

  upload: {
    mimeTypes: [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
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
