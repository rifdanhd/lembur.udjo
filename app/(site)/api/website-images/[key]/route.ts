import { isAuthed, unauthorized } from "@/lib/crm/auth";
import { imageErrorResponse, readImageForm, saveWebsiteImage } from "@/lib/website/images";

export const runtime = "nodejs";

export async function PUT(request: Request, { params }: { params: Promise<{ key: string }> }) {
  if (!(await isAuthed())) return unauthorized();
  try {
    const { key } = await params;
    await saveWebsiteImage(await readImageForm(request), key);
    return Response.json({ success: true });
  } catch (error) {
    return imageErrorResponse(error);
  }
}
