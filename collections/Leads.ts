import type { CollectionConfig } from "payload";

export const Leads: CollectionConfig = {
  slug: "leads",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "source", "status", "value", "createdAt"],
    group: "CRM",
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: { position: "sidebar" },
    },
    {
      name: "phone",
      type: "text",
    },
    {
      name: "email",
      type: "email",
    },
    {
      name: "org",
      type: "text",
      label: "Instansi / Perusahaan",
    },
    {
      name: "source",
      type: "select",
      defaultValue: "Lainnya",
      options: [
        { label: "WhatsApp", value: "WhatsApp" },
        { label: "Telepon", value: "Telepon" },
        { label: "Instagram", value: "Instagram" },
        { label: "Website", value: "Website" },
        { label: "Referensi", value: "Referensi" },
        { label: "Walk-in", value: "Walk-in" },
        { label: "Lainnya", value: "Lainnya" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "baru",
      options: [
        { label: "Baru", value: "baru" },
        { label: "Dihubungi", value: "dihubungi" },
        { label: "Reservasi", value: "reservasi" },
        { label: "Selesai", value: "selesai" },
        { label: "Hilang", value: "hilang" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "value",
      type: "number",
      label: "Nilai (Rp)",
      admin: { position: "sidebar" },
    },
    {
      name: "notes",
      type: "join",
      collection: "notes",
      on: "lead",
    },
    {
      name: "followups",
      type: "join",
      collection: "followups",
      on: "lead",
    },
  ],
};
