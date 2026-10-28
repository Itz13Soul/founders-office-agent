import { z } from "zod";
import { buildMemo } from "../../../lib/memo";
import { clientError, guard } from "../../../lib/usage";

export const maxDuration = 60;

const Body = z.object({ question: z.string().trim().min(12).max(300) });

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return clientError(400, "Ask a full question of 12 to 300 characters.");
  const blocked = await guard();
  if (blocked) return blocked;
  try {
    return Response.json({ memo: await buildMemo(parsed.data.question) });
  } catch {
    return clientError(502, "Could not write the memo. Please try again.");
  }
}
