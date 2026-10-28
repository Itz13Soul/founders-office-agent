import { z } from "zod";
import { parseVoice } from "../../../lib/voice";
import { clientError, guard } from "../../../lib/usage";

export const maxDuration = 30;

const Body = z.object({ transcript: z.string().trim().min(6).max(600) });

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return clientError(400, "Say or type a note of 6 to 600 characters.");
  const blocked = await guard();
  if (blocked) return blocked;
  try {
    const today = new Date().toISOString().slice(0, 10);
    return Response.json(await parseVoice(parsed.data.transcript, today));
  } catch {
    return clientError(502, "Could not read the note. Please try again.");
  }
}
