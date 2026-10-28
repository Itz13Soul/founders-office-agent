import type { Metadata } from "next";
import { score, type Commitment } from "../../lib/ledger";
import { EMAILS } from "../../lib/sample";
import { supabaseAnon } from "../../lib/supabase";

export const metadata: Metadata = { title: "Method | Founder's Office Agent" };
export const revalidate = 300;

const pct = (v: number | null) => (v === null ? "n/a" : `${Math.round(v * 100)}%`);

export default async function Method() {
  const db = supabaseAnon();
  const { data } = db ? await db.from("fo_extractions").select("email_id, commitments, model") : { data: [] };
  const stored = new Map(((data ?? []) as { email_id: string; commitments: Commitment[]; model: string }[]).map((r) => [r.email_id, r]));
  const rows = EMAILS.filter((e) => stored.has(e.id)).map((e) => ({ predicted: stored.get(e.id)!.commitments, gold: e.gold }));
  const result = score(rows);
  const models = [...new Set([...stored.values()].map((r) => r.model))];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-10">
      <h1 className="text-3xl font-semibold tracking-tight">How it works, and how it is measured</h1>

      <h2 className="mt-8 text-xl font-semibold">Cited memos</h2>
      <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-zinc-300">
        <li>The question is matched to the company&apos;s sample documents by keyword.</li>
        <li>A web search with grounding returns findings and the pages they came from.</li>
        <li>The memo is written with every source numbered. Any claim whose source ids are not in that list is removed in code before you see it.</li>
      </ol>

      <h2 className="mt-8 text-xl font-semibold">Commitment extraction: measured</h2>
      <p className="mt-2 text-sm text-zinc-400">
        A promise counts as found when the owner, the due date and the key words of the task all match the hand label. Recall is the share of labelled
        promises found. Precision is the share of extracted promises that are labelled.
      </p>
      {result.emails === 0 ? (
        <p className="mt-3 rounded-lg bg-white/5 p-3 text-sm text-zinc-300">The evaluation has not been run yet, so no score is reported.</p>
      ) : (
        <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-sm">
          <ul className="space-y-1">
            <li className="flex justify-between">
              <span>Emails evaluated</span>
              <span className="tabular-nums">{result.emails}</span>
            </li>
            <li className="flex justify-between">
              <span>Labelled promises</span>
              <span className="tabular-nums">{result.goldTotal}</span>
            </li>
            <li className="flex justify-between font-medium">
              <span>Recall</span>
              <span className="tabular-nums">{pct(result.recall)}</span>
            </li>
            <li className="flex justify-between font-medium">
              <span>Precision</span>
              <span className="tabular-nums">{pct(result.precision)}</span>
            </li>
          </ul>
          <p className="mt-3 text-xs text-zinc-500">Model: {models.join(", ")}.</p>
        </div>
      )}

      <h2 className="mt-8 text-xl font-semibold">Limits</h2>
      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-zinc-300">
        <li>The evaluation set is {EMAILS.length} short synthetic emails written and labelled by the developer. The target in the plan is above 90% recall on 100 labelled emails; this set is smaller and easier than real mail, so treat the score as early.</li>
        <li>The demo does not connect to anyone&apos;s inbox. Connecting Gmail needs Google&apos;s app verification, which is not done.</li>
        <li>Promises are not auto-closed when fulfilled. Use Mark done.</li>
        <li>Outputs are model suggestions to verify. Not legal or financial advice.</li>
      </ul>
    </main>
  );
}
