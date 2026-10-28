import type { Metadata } from "next";
import LedgerView, { type Row } from "../../components/LedgerView";
import { SampleNotice } from "../../components/Notice";
import TryExtract from "../../components/TryExtract";
import { statusOf, daysOverdue, type Commitment } from "../../lib/ledger";
import { ASOF, EMAILS } from "../../lib/sample";
import { supabaseAnon } from "../../lib/supabase";

export const metadata: Metadata = { title: "Ledger | Founder's Office Agent" };
export const revalidate = 300;

export default async function Ledger() {
  const db = supabaseAnon();
  const { data } = db ? await db.from("fo_extractions").select("email_id, commitments") : { data: [] };
  const byEmail = new Map(((data ?? []) as { email_id: string; commitments: Commitment[] }[]).map((r) => [r.email_id, r.commitments]));

  const rows: Row[] = [];
  for (const e of EMAILS) {
    (byEmail.get(e.id) ?? []).forEach((c, i) => {
      const status = statusOf(c.due);
      rows.push({
        key: `${e.id}-${i}`,
        owner: c.owner,
        what: c.what,
        due: c.due,
        quote: c.quote,
        from: e.from,
        subject: e.subject,
        date: e.date,
        status,
        days: status === "overdue" && c.due ? daysOverdue(c.due) : null,
      });
    });
  }
  const order = { overdue: 0, due_soon: 1, open: 2, no_date: 3 } as const;
  rows.sort((a, b) => order[a.status] - order[b.status] || (b.days ?? 0) - (a.days ?? 0));
  const owners = [...new Set(rows.map((r) => r.owner))].sort();
  const overdue = rows.filter((r) => r.status === "overdue").length;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-10">
      <h1 className="text-3xl font-semibold tracking-tight">Commitment ledger</h1>
      <p className="mt-2 text-zinc-400">
        {rows.length > 0
          ? `${rows.length} promises found in ${EMAILS.length} sample emails; ${overdue} overdue as of ${ASOF}.`
          : "The extraction has not been run on the sample mailbox yet."}{" "}
        Every row shows the exact quote it came from.
      </p>
      <div className="mt-4">
        <SampleNotice />
      </div>
      <div className="mt-6">
        <LedgerView rows={rows} owners={owners} />
      </div>
      <div className="mt-8">
        <TryExtract />
      </div>
    </main>
  );
}
