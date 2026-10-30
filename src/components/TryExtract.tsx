"use client";

import { track } from "../lib/track";
import { useState } from "react";

type C = { owner: string; what: string; due: string | null; quote: string };

export default function TryExtract() {
  const [text, setText] = useState("Hi Riya, thanks for the walkthrough. I'll send the revised pricing sheet by Thursday and Arjun will confirm the delivery slots on Monday.");
  const [from, setFrom] = useState("Karan Shah");
  const [to, setTo] = useState("Riya Mehta");
  const [date, setDate] = useState("2026-10-26");
  const [out, setOut] = useState<C[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError("");
    setOut(null);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, from, to, date }),
      });
      const data = (await res.json().catch(() => ({ error: "The server took too long." }))) as { commitments?: C[]; error?: string };
      if (!res.ok || !data.commitments) { setError(data.error ?? "Something went wrong."); track("extract_error"); }
      else { setOut(data.commitments); track("extract_run", { commitments: data.commitments.length }); }
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  const f = "rounded-lg border border-white/10 bg-black/30 p-2 text-sm focus:border-amber-400/60 focus:outline-none";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <h2 className="text-lg font-semibold">Try it on your own email text</h2>
      <p className="mt-1 text-sm text-zinc-400">Paste any email. Do not paste confidential text: this is a public demo.</p>
      <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={1500} rows={4} className={`${f} mt-3 w-full`} />
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="From" className={f} />
        <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="To" className={f} />
        <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="Sent date YYYY-MM-DD" className={f} />
      </div>
      <button
        type="button"
        disabled={busy || text.trim().length < 20}
        onClick={run}
        className="mt-3 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-40"
      >
        {busy ? "Reading..." : "Find the promises"}
      </button>
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      {out && (
        <ul className="mt-4 space-y-2 text-sm">
          {out.length === 0 && <li className="text-zinc-400">No promises found in this email.</li>}
          {out.map((c, i) => (
            <li key={i} className="rounded-lg border border-white/10 bg-black/30 p-3">
              <span className="font-medium">{c.what}</span>
              <span className="text-zinc-400">
                {" "}
                · {c.owner} · due {c.due ?? "not stated"}
              </span>
              <p className="mt-1 text-xs italic text-zinc-500">&ldquo;{c.quote}&rdquo;</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
