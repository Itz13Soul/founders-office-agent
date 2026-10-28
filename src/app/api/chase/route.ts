import { z } from "zod";
import { draftChase } from "../../../lib/chase";
import { clientError, guard } from "../../../lib/usage";

export const maxDuration = 30;

const Body = z.object({
  owner: z.string().trim().min(2).max(80),
  what: z.string().trim().min(3).max(200),
  due: z.string().trim().max(10).nullable(),
  quote: z.string().trim().max(400),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return clientError(400, "Invalid request.");
  const blocked = await guard();
  if (blocked) return blocked;
  try {
    return Response.json(await draftChase({ ...parsed.data, founder: "Riya" }));
  } catch {
    return clientError(502, "Could not draft the message. Please try again.");
  }
}
