import { buildDossier, type OpenItem } from "../../../lib/brief";
import { daysOverdue } from "../../../lib/ledger";
import { clientError, guard } from "../../../lib/usage";
import { supabaseAnon } from "../../../lib/supabase";
import type { Commitment } from "../../../lib/ledger";

export const maxDuration = 45;

export async function POST() {
  const db = supabaseAnon();
  if (!db) return clientError(503, "Service unavailable.");
  const { data } = await db.from("fo_extractions").select("commitments");
  const items: OpenItem[] = ((data ?? []) as { commitments: Commitment[] }[])
    .flatMap((r) => r.commitments)
    .filter((c) => c.due)
    .map((c) => ({ owner: c.owner, what: c.what, due: c.due, days: c.due ? daysOverdue(c.due) : null }))
    .filter((c) => (c.days ?? 0) > 0)
    .sort((a, b) => (b.days ?? 0) - (a.days ?? 0));
  const blocked = await guard();
  if (blocked) return blocked;
  try {
    return Response.json({ dossier: await buildDossier(items), overdue: items.slice(0, 5) });
  } catch {
    return clientError(502, "Could not build the brief. Please try again.");
  }
}
