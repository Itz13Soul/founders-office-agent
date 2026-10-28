import { z } from "zod";
import { isAdmin } from "../../../../lib/admin";
import { extractCommitments } from "../../../../lib/ledger";
import { EMAILS } from "../../../../lib/sample";
import { supabaseService } from "../../../../lib/supabase";

export const maxDuration = 60;

const Body = z.object({ from: z.number().int().min(0).max(EMAILS.length), count: z.number().int().min(1).max(4) });

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorised." }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid request." }, { status: 400 });
  const slice = EMAILS.slice(parsed.data.from, parsed.data.from + parsed.data.count);
  const db = supabaseService();
  const model = process.env.GEMINI_MODEL ?? "unknown";
  const results = await Promise.all(
    slice.map(async (e) => {
      try {
        const commitments = await extractCommitments(e);
        const { error } = await db.from("fo_extractions").upsert({ email_id: e.id, commitments, model });
        return { id: e.id, ok: !error, n: commitments.length, error: error?.message };
      } catch (err) {
        return { id: e.id, ok: false, n: 0, error: String(err).slice(0, 200) };
      }
    }),
  );
  return Response.json({ next: parsed.data.from + slice.length, total: EMAILS.length, results });
}
