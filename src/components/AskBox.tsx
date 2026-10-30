"use client";

import { track } from "../lib/track";
import { useState } from "react";
import type { Memo } from "../lib/memo";

const EXAMPLES = [
  "Should we accept Fresh Fields' 6 percent price rise or switch supplier?",
  "Should we expand cold storage now or wait until the Series A closes?",
  "Is quick commerce or modern trade the better channel for our millet snacks?",
];

export default function AskBox({ preset = "" }: { preset?: string }) {
  const [q, setQ] = useState(preset);
  const [memo, setMemo] = useState<Memo | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function ask(question: string) {
    setBusy(true);
    setError("");
    setMemo(null);
    try {
      const res = await fetch("/api/memo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = (await res.json().catch(() => ({ error: "The server took too long. Try again." }))) as { memo?: Memo; error?: string };
      if (!res.ok || !data.memo) { setError(data.error ?? "Something went wrong."); track("memo_error"); }
      else { setMemo(data.memo); track("memo_generated"); }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const order = (id: string) => memo?.sources.findIndex((s) => s.id === id) ?? -1;

  const cites = (ids: string[]) =>
    ids.map((id) => {
      const n = order(id) + 1;
      return (
        <a key={id} href={`#src-${id}`} className="ml-1 rounded bg-amber-400/15 px-1 text-[11px] font-semibold text-amber-200 no-underline">
          {n > 0 ? n : "?"}
        </a>
      );
    });

  return (
    <div>
      <div className="flex flex-wrap gap-2 text-xs">
        {EXAMPLES.map((e) => (
          <button key={e} type="button" onClick={() => setQ(e)} className="rounded-full border border-white/15 px-3 py-1 text-zinc-300 transition hover:border-amber-400/60">
            {e}
          </button>
        ))}
      </div>
      <textarea
        value={q}
        onChange={(e) => setQ(e.target.value)}
        maxLength={300}
        rows={3}
        placeholder="Ask a decision question about Northwind Foods"
        className="mt-3 w-full rounded-lg border border-white/10 bg-black/30 p-3 text-sm placeholder:text-zinc-500 focus:border-amber-400/60 focus:outline-none"
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          disabled={busy || q.trim().length < 12}
          onClick={() => ask(q.trim())}
          className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-amber-300 disabled:opacity-40"
        >
          {busy ? "Researching..." : "Write the memo"}
        </button>
        <span className="text-xs text-zinc-500">Takes up to a minute. It searches the sample documents and the web.</span>
      </div>
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

      {memo && (
        <article className="mt-6 rounded-2xl border border-white/10 bg-white/[0.035] p-6">
          <h2 className="text-xl font-semibold">{memo.title}</h2>
          <p className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-50">
            <span className="font-semibold">Recommendation: </span>
            {memo.recommendation}
          </p>
          <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-zinc-500">Evidence</h3>
          <ul className="mt-2 space-y-2 text-sm text-zinc-200">
            {memo.claims.map((c, i) => (
              <li key={i}>
                {c.text}
                {cites(c.sources)}
              </li>
            ))}
          </ul>
          {memo.risks.length > 0 && (
            <>
              <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-zinc-500">Risks</h3>
              <ul className="mt-2 space-y-2 text-sm text-zinc-200">
                {memo.risks.map((c, i) => (
                  <li key={i}>
                    {c.text}
                    {cites(c.sources)}
                  </li>
                ))}
              </ul>
            </>
          )}
          <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-zinc-500">Next steps</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-zinc-200">
            {memo.next_steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-zinc-500">Sources</h3>
          <ol className="mt-2 space-y-2 text-sm">
            {memo.sources.map((s, i) => (
              <li key={s.id} id={`src-${s.id}`} className="text-zinc-300">
                <span className="mr-1 text-amber-200">{i + 1}.</span>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline">
                    {s.title}
                  </a>
                ) : (
                  <span>{s.title} (internal sample document)</span>
                )}
                {s.excerpt && <p className="ml-4 text-xs text-zinc-500">{s.excerpt}</p>}
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs text-zinc-500">
            {memo.dropped > 0 ? `${memo.dropped} statement(s) were removed because no source supported them. ` : "Every statement above has a source. "}
            {memo.webUsed ? "" : "No web sources were available for this question. "}
            Model output: verify before acting. Not legal or financial advice.
          </p>
        </article>
      )}
    </div>
  );
}
