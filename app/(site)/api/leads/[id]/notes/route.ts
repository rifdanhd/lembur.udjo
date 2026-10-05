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

  const note = typeof body.body === "string" ? body.body.trim() : "";
  if (!note) return Response.json({ error: "Catatan kosong" }, { status: 400 });

  try {
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "notes",
      data: { lead: Number(id), body: note },
    });
    return Response.json(
      { note: { id: doc.id, body: doc.body, created_at: doc.createdAt } },
      { status: 201 }
    );
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  if (!(await isAuthed())) return unauthorized();
  const { id } = await params;

  let noteId: number;
  try {
    const body = await request.json();
    noteId = Number(body.id);
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }
  if (!Number.isFinite(noteId)) return Response.json({ error: "ID tidak valid" }, { status: 400 });

  try {
    const payload = await getPayloadClient();
    const existing = await payload.findByID({ collection: "notes", id: noteId });
    if (String(existing.lead) !== String(id)) {
      return Response.json({ error: "Catatan tidak ditemukan" }, { status: 404 });
    }
    await payload.delete({ collection: "notes", id: noteId });
    return Response.json({ ok: true });
  } catch (err) {
    const message = (err as Error).message || "";
    if (/not found/i.test(message)) {
      return Response.json({ error: "Catatan tidak ditemukan" }, { status: 404 });
    }
    return Response.json({ error: message }, { status: 500 });
  }
}
