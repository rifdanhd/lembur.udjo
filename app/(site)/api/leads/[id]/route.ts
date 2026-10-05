import { isAuthed, unauthorized } from "@/lib/crm/auth";
import { getPayloadClient } from "@/lib/crm/payload";
import { SOURCES, STATUSES } from "@/lib/crm/types";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  if (!(await isAuthed())) return unauthorized();
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};

  if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
  for (const field of ["phone", "email", "org"] as const) {
    if (field in body) {
      const v = typeof body[field] === "string" ? (body[field] as string).trim() : "";
      data[field] = v || null;
    }
  }
  if (typeof body.source === "string" && (SOURCES as string[]).includes(body.source)) {
    data.source = body.source;
  }
  if (typeof body.status === "string" && STATUSES.some((s) => s.id === body.status)) {
    data.status = body.status;
  }
  if ("value" in body) {
    data.value = typeof body.value === "number" && body.value > 0 ? body.value : null;
  }

  if (!Object.keys(data).length) {
    return Response.json({ error: "Tidak ada perubahan" }, { status: 400 });
  }

  try {
    const payload = await getPayloadClient();
    await payload.update({ collection: "leads", id: Number(id), data });
    return Response.json({ ok: true });
  } catch (err) {
    const message = (err as Error).message || "";
    if (/not found/i.test(message)) {
      return Response.json({ error: "Lead tidak ditemukan" }, { status: 404 });
    }
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAuthed())) return unauthorized();
  const { id } = await params;

  try {
    const payload = await getPayloadClient();
    await payload.delete({
      collection: "notes",
      where: { lead: { equals: Number(id) } },
    });
    await payload.delete({
      collection: "followups",
      where: { lead: { equals: Number(id) } },
    });
    await payload.delete({ collection: "leads", id: Number(id) });
    return Response.json({ ok: true });
  } catch (err) {
    const message = (err as Error).message || "";
    if (/not found/i.test(message)) {
      return Response.json({ error: "Lead tidak ditemukan" }, { status: 404 });
    }
    return Response.json({ error: message }, { status: 500 });
  }
}
