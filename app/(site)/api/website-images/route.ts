import { isAuthed, unauthorized } from "@/lib/crm/auth";
import { getWebsiteImages, imageErrorResponse, readImageForm, saveWebsiteImage } from "@/lib/website/images";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAuthed())) return unauthorized();
  try {
    return Response.json({ images: await getWebsiteImages() }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return imageErrorResponse(error);
  }
}

export async function POST(request: Request) {
  if (!(await isAuthed())) return unauthorized();
  try {
    await saveWebsiteImage(await readImageForm(request));
    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    return imageErrorResponse(error);
  }
}
