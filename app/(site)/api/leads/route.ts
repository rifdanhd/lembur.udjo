import { isAuthed, unauthorized } from "@/lib/crm/auth";
import { getPayloadClient, toLead, type LeadDoc } from "@/lib/crm/payload";
import { SOURCES, type LeadSource, type LeadStatus } from "@/lib/crm/types";

export async function GET() {
  if (!(await isAuthed())) return unauthorized();
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: "leads",
      depth: 1,
      limit: 1000,
      sort: "-createdAt",
    });
    return Response.json({ leads: res.docs.map((d) => toLead(d as unknown as LeadDoc)) });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAuthed())) return unauthorized();

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return Response.json({ error: "Nama wajib diisi" }, { status: 400 });

  try {
    const payload = await getPayloadClient();
    const doc = await payload.create({
      collection: "leads",
      data: {
        name,
        phone: str(body.phone),
        email: str(body.email),
        org: str(body.org),
        source: (SOURCES as string[]).includes(String(body.source))
          ? (body.source as LeadSource)
          : "Lainnya",
        status: (body.status === "hilang" ? "hilang" : "baru") as LeadStatus,
        value: typeof body.value === "number" && body.value > 0 ? body.value : null,
      },
    });
    return Response.json({ id: doc.id }, { status: 201 });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}

function str(v: unknown) {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t ? t : null;
}
