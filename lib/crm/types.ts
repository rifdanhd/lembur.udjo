export type LeadStatus = "baru" | "dihubungi" | "reservasi" | "selesai" | "hilang";

export const STATUSES: { id: LeadStatus; label: string; badge: string; dot: string }[] = [
  { id: "baru", label: "Baru", badge: "bg-sky-50 text-sky-700 border-sky-200", dot: "bg-sky-500" },
  { id: "dihubungi", label: "Dihubungi", badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  { id: "reservasi", label: "Reservasi", badge: "bg-violet-50 text-violet-700 border-violet-200", dot: "bg-violet-500" },
  { id: "selesai", label: "Selesai", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  { id: "hilang", label: "Hilang", badge: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500" },
];

export type LeadSource =
  | "WhatsApp"
  | "Telepon"
  | "Instagram"
  | "Website"
  | "Referensi"
  | "Walk-in"
  | "Lainnya";

export const SOURCES: LeadSource[] = [
  "WhatsApp",
  "Telepon",
  "Instagram",
  "Website",
  "Referensi",
  "Walk-in",
  "Lainnya",
];

export interface Note {
  id: number;
  body: string;
  created_at: string;
}

export interface FollowUp {
  id: number;
  task: string;
  due_at: string | null;
  done: boolean;
  created_at: string;
}

export interface Lead {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  org: string | null;
  source: string;
  status: LeadStatus;
  value: number | null;
  notes: Note[];
  followups: FollowUp[];
  created_at: string;
  updated_at: string;
}

export function statusMeta(id: string) {
  return STATUSES.find((s) => s.id === id) ?? STATUSES[0];
}
