import type { CollectionConfig } from "payload";

export const Notes: CollectionConfig = {
  slug: "notes",
  admin: {
    useAsTitle: "body",
    defaultColumns: ["body", "lead", "createdAt"],
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
      name: "lead",
      type: "relationship",
      relationTo: "leads",
      required: true,
      index: true,
      admin: { position: "sidebar" },
    },
    {
      name: "body",
      type: "textarea",
      required: true,
    },
  ],
};
