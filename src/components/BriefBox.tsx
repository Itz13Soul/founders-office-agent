"use client";

import { useState } from "react";
import type { Dossier, OpenItem } from "../lib/brief";
import type { Meeting } from "../lib/sample";

export default function BriefBox({ meetings }: { meetings: Meeting[] }) {
  const [data, setData] = useState<{ dossier: Dossier; overdue: OpenItem[] } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/brief", { method: "POST" });
      const out = (await res.json().catch(() => ({ error: "The server took too long." }))) as { dossier?: Dossier; overdue?: OpenItem[]; error?: string };
      if (!res.ok || !out.dossier) setError(out.error ?? "Something went wrong.");
      else setData({ dossier: out.dossier, overdue: out.overdue ?? [] });
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={run}
        disabled={busy}
        className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-40"
      >
        {busy ? "Preparing..." : data ? "Refresh brief" : "Generate the 8 am brief"}
      </button>
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

      {data && (
        <p className="mt-5 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-50">{data.dossier.headline}</p>
      )}

      {data && data.overdue.length > 0 && (
        <section className="mt-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Most overdue promises</h2>
          <ul className="mt-2 space-y-1 text-sm text-zinc-200">
            {data.overdue.map((o, i) => (
              <li key={i}>
                {o.what} · {o.owner} · {o.days} days overdue
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Today&apos;s meetings</h2>
        <ul className="mt-2 space-y-3">
          {meetings.map((m) => {
            const d = data?.dossier.meetings.find((x) => x.id === m.id);
            return (
              <li key={m.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <p className="font-medium">{m.title}</p>
                <p className="text-sm text-zinc-400">
                  {m.when} · {m.who}
                </p>
                {d ? (
                  <>
                    <p className="mt-2 text-sm text-zinc-200">{d.summary}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-300">
                      {d.questions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-zinc-500">{m.context}</p>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
