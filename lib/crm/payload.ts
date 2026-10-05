import { getPayload } from "payload";
import configPromise from "@payload-config";
import type { FollowUp, Lead, Note } from "./types";

export async function getPayloadClient() {
  const config = await configPromise;
  return getPayload({ config });
}

interface Join<T> {
  docs?: T[];
}

interface NoteDoc {
  id: number | string;
  body?: string | null;
  createdAt?: string;
}

interface FollowUpDoc {
  id: number | string;
  task?: string | null;
  due_at?: string | null;
  done?: boolean | null;
  createdAt?: string;
}

export interface LeadDoc {
  id: number | string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  org?: string | null;
  source?: string | null;
  status?: string | null;
  value?: number | string | null;
  createdAt?: string;
  updatedAt?: string;
  notes?: Join<NoteDoc>;
  followups?: Join<FollowUpDoc>;
}

function toNotes(doc: LeadDoc): Note[] {
  const list = doc.notes?.docs ?? [];
  return list
    .map((n) => ({
      id: Number(n.id),
      body: String(n.body ?? ""),
      created_at: n.createdAt ?? "",
    }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

function toFollowups(doc: LeadDoc): FollowUp[] {
  const list = doc.followups?.docs ?? [];
  return list
    .map((f) => ({
      id: Number(f.id),
      task: String(f.task ?? ""),
      due_at: f.due_at ? String(f.due_at).slice(0, 10) : null,
      done: Boolean(f.done),
      created_at: f.createdAt ?? "",
    }))
    .sort((a, b) => {
      if (!a.due_at && !b.due_at) return 0;
      if (!a.due_at) return 1;
      if (!b.due_at) return -1;
      return a.due_at.localeCompare(b.due_at);
    });
}

export function toLead(doc: LeadDoc): Lead {
  return {
    id: Number(doc.id),
    name: String(doc.name ?? ""),
    phone: doc.phone ?? null,
    email: doc.email ?? null,
    org: doc.org ?? null,
    source: doc.source ?? "Lainnya",
    status: (doc.status ?? "baru") as Lead["status"],
    value: doc.value == null ? null : Number(doc.value),
    notes: toNotes(doc),
    followups: toFollowups(doc),
    created_at: doc.createdAt ?? "",
    updated_at: doc.updatedAt ?? "",
  };
}
