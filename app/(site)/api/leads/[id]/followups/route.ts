import { isAuthed, unauthorized } from "@/lib/crm/auth";
import { getPayloadClient } from "@/lib/crm/payload";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  if (!(await isAuthed())) return unauthorized();
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const task = typeof body.task === "string" ? body.task.trim() : "";
  if (!task) return Response.json({ error: "Tugas wajib diisi" }, { status: 400 });
  const dueAt = typeof body.due_at === "string" && body.due_at ? body.due_at : null;

  try {
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "followups",
      data: { lead: Number(id), task, due_at: dueAt },
    });
    return Response.json(
      {
        followup: {
          id: doc.id,
          task: doc.task,
          due_at: doc.due_at ? String(doc.due_at).slice(0, 10) : null,
          done: Boolean(doc.done),
          created_at: doc.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  if (!(await isAuthed())) return unauthorized();
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const followupId = Number(body.id);
  if (!Number.isFinite(followupId)) {
    return Response.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (typeof body.done === "boolean") data.done = body.done;
  if (typeof body.task === "string" && body.task.trim()) data.task = body.task.trim();
  if ("due_at" in body) data.due_at = typeof body.due_at === "string" && body.due_at ? body.due_at : null;

  if (!Object.keys(data).length) {
    return Response.json({ error: "Tidak ada perubahan" }, { status: 400 });
  }

  try {
    const payload = await getPayloadClient();
    const existing = await payload.findByID({ collection: "followups", id: followupId });
    if (String(existing.lead) !== String(id)) {
      return Response.json({ error: "Tugas tidak ditemukan" }, { status: 404 });
    }
    await payload.update({ collection: "followups", id: followupId, data });
    return Response.json({ ok: true });
  } catch (err) {
    const message = (err as Error).message || "";
    if (/not found/i.test(message)) {
      return Response.json({ error: "Tugas tidak ditemukan" }, { status: 404 });
    }
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  if (!(await isAuthed())) return unauthorized();
  const { id } = await params;

  let followupId: number;
  try {
    const body = await request.json();
    followupId = Number(body.id);
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }
  if (!Number.isFinite(followupId)) {
    return Response.json({ error: "ID tidak valid" }, { status: 400 });
  }

  try {
    const payload = await getPayloadClient();
    const existing = await payload.findByID({ collection: "followups", id: followupId });
    if (String(existing.lead) !== String(id)) {
      return Response.json({ error: "Tugas tidak ditemukan" }, { status: 404 });
    }
    await payload.delete({ collection: "followups", id: followupId });
    return Response.json({ ok: true });
  } catch (err) {
    const message = (err as Error).message || "";
    if (/not found/i.test(message)) {
      return Response.json({ error: "Tugas tidak ditemukan" }, { status: 404 });
    }
    return Response.json({ error: message }, { status: 500 });
  }
}
