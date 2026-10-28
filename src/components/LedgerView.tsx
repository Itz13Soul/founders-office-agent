"use client";

import { useMemo, useState } from "react";
import CopyButton from "./CopyButton";

export type Row = {
  key: string;
  owner: string;
  what: string;
  due: string | null;
  quote: string;
  from: string;
  subject: string;
  date: string;
  status: "overdue" | "due_soon" | "open" | "no_date";
  days: number | null;
};

const BADGE: Record<Row["status"], string> = {
  overdue: "bg-red-500/15 text-red-200",
  due_soon: "bg-amber-400/15 text-amber-200",
  open: "bg-zinc-500/20 text-zinc-300",
  no_date: "bg-zinc-500/10 text-zinc-400",
};

const LABEL: Record<Row["status"], string> = {
  overdue: "Overdue",
  due_soon: "Due soon",
  open: "Open",
  no_date: "No date",
};

export default function LedgerView({ rows, owners }: { rows: Row[]; owners: string[] }) {
  const [owner, setOwner] = useState("");
  const [done, setDone] = useState<Set<string>>(new Set());
  const [drafts, setDrafts] = useState<Record<string, { subject: string; body: string } | "busy" | string>>({});

  const shown = useMemo(() => rows.filter((r) => !owner || r.owner === owner), [rows, owner]);

  async function chase(r: Row) {
    setDrafts((d) => ({ ...d, [r.key]: "busy" }));
    try {
      const res = await fetch("/api/chase", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ owner: r.owner, what: r.what, due: r.due, quote: r.quote }),
      });
      const data = (await res.json().catch(() => ({ error: "The server took too long." }))) as { subject?: string; body?: string; error?: string };
      setDrafts((d) => ({
        ...d,
        [r.key]: data.subject && data.body ? { subject: data.subject, body: data.body } : (data.error ?? "Failed."),
      }));
    } catch {
      setDrafts((d) => ({ ...d, [r.key]: "Network error." }));
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm">
        <label htmlFor="owner" className="text-zinc-400">
          Owner
        </label>
        <select
          id="owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          className="rounded-lg border border-white/10 bg-black/30 p-2 text-sm focus:border-amber-400/60 focus:outline-none"
        >
          <option value="">Everyone</option>
          {owners.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <ul className="mt-4 space-y-3">
        {shown.map((r) => {
          const isDone = done.has(r.key);
          const draft = drafts[r.key];
          return (
            <li key={r.key} className={`rounded-2xl border border-white/10 bg-white/[0.035] p-4 ${isDone ? "opacity-50" : ""}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${BADGE[isDone ? "open" : r.status]}`}>
                  {isDone ? "Done" : LABEL[r.status]}
                </span>
                <span className="font-medium">{r.what}</span>
              </div>
              <p className="mt-1 text-sm text-zinc-400">
                {r.owner} · due {r.due ?? "not stated"}
                {r.status === "overdue" && r.days ? ` · ${r.days} day${r.days === 1 ? "" : "s"} overdue` : ""}
              </p>
              <blockquote className="mt-2 border-l-2 border-amber-400/40 pl-3 text-sm italic text-zinc-300">&ldquo;{r.quote}&rdquo;</blockquote>
              <p className="mt-1 text-xs text-zinc-500">
                From {r.from} · {r.subject} · {r.date}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() =>
                    setDone((s) => {
                      const n = new Set(s);
                      if (n.has(r.key)) n.delete(r.key);
                      else n.add(r.key);
                      return n;
                    })
                  }
                  className="rounded-md border border-white/15 px-2 py-1 text-zinc-300 hover:border-amber-400/60"
                >
                  {isDone ? "Reopen" : "Mark done"}
                </button>
                {!isDone && r.status !== "no_date" && (
                  <button
                    type="button"
                    disabled={draft === "busy"}
                    onClick={() => chase(r)}
                    className="rounded-md bg-amber-400 px-2 py-1 font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-40"
                  >
                    {draft === "busy" ? "Drafting..." : "Draft chase-up"}
                  </button>
                )}
              </div>
              {typeof draft === "string" && draft !== "busy" && <p className="mt-2 text-sm text-red-300">{draft}</p>}
              {draft && typeof draft === "object" && (
                <div className="mt-3 rounded-lg border border-white/10 bg-black/30 p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{draft.subject}</span>
                    <CopyButton text={`${draft.subject}\n\n${draft.body}`} />
                  </div>
                  <pre className="mt-2 whitespace-pre-wrap font-sans text-zinc-200">{draft.body}</pre>
                  <p className="mt-2 text-xs text-zinc-500">A draft only. Nothing is sent.</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
