import { checkPassword, createSessionToken, setSessionCookie } from "@/lib/crm/auth";

export async function POST(request: Request) {
  let password = "";
  try {
    const body = await request.json();
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return Response.json({ error: "Body tidak valid" }, { status: 400 });
  }

  if (!password) return Response.json({ error: "Password wajib diisi" }, { status: 400 });

  try {
    if (!checkPassword(password)) {
      return Response.json({ error: "Password salah" }, { status: 401 });
    }
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }

  await setSessionCookie(createSessionToken());
  return Response.json({ ok: true });
}
