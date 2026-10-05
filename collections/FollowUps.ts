import type { CollectionConfig } from "payload";

export const FollowUps: CollectionConfig = {
  slug: "followups",
  admin: {
    useAsTitle: "task",
    defaultColumns: ["task", "lead", "due_at", "done", "createdAt"],
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
      name: "task",
      type: "text",
      required: true,
    },
    {
      name: "due_at",
      type: "date",
      label: "Jatuh Tempo",
      admin: { position: "sidebar" },
    },
    {
      name: "done",
      type: "checkbox",
      defaultValue: false,
    },
  ],
};
