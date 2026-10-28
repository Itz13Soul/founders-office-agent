import { z } from "zod";
import { extractFromText } from "../../../lib/ledger";
import { clientError, guard } from "../../../lib/usage";

export const maxDuration = 30;

const Body = z.object({
  text: z.string().trim().min(20).max(1500),
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
  from: z.string().trim().max(80),
  to: z.string().trim().max(80),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return clientError(400, "Paste an email of 20 to 1500 characters and a date as YYYY-MM-DD.");
  const blocked = await guard();
  if (blocked) return blocked;
  try {
    const { text, date, from, to } = parsed.data;
    return Response.json({ commitments: await extractFromText(text, date, from, to) });
  } catch {
    return clientError(502, "Could not read the email. Please try again.");
  }
}
