import { z } from "zod";
import { llmJson } from "./llm";
import { ASOF, type Email, type Gold } from "./sample";

export const CommitmentSchema = z.object({
  owner: z.string(),
  what: z.string(),
  due: z.string().nullable(),
  quote: z.string(),
});
export type Commitment = z.infer<typeof CommitmentSchema>;

const ResultSchema = z.object({ commitments: z.array(CommitmentSchema).max(6) });

const SYSTEM = `You extract commitments from one business email.
A commitment is a clear promise by a named person to do something in the future ("I'll send the deck by Friday", "Neha, please file X by the 20th" makes Neha the owner).
Rules:
- owner: the full name of the person who must do the work, taken from the From, To or body. Use the names as written in the header.
- what: a short imperative phrase of the task.
- due: an ISO date YYYY-MM-DD resolved from the email's own date (for example "by Friday" means the next Friday after the email date). Use null when no time is stated.
- quote: the exact words from the email that contain the promise.
- Do NOT include questions, requests that are only suggestions, things already done, conditional statements with no promise, or FYI statements.
Return one JSON object: {"commitments": [{"owner","what","due","quote"}]}. Use an empty array when there are none.`;

export async function extractCommitments(email: Email): Promise<Commitment[]> {
  const user = `Email date: ${email.date}\nFrom: ${email.from}\nTo: ${email.to}\nSubject: ${email.subject}\n\n${email.body}`;
  const out = await llmJson(ResultSchema, { system: SYSTEM, user });
  return out.commitments;
}

export async function extractFromText(text: string, date: string, from: string, to: string): Promise<Commitment[]> {
  const user = `Email date: ${date}\nFrom: ${from || "Unknown"}\nTo: ${to || "Unknown"}\n\n${text}`;
  const out = await llmJson(ResultSchema, { system: SYSTEM, user });
  return out.commitments;
}

const STOP = new Set(["the", "a", "an", "to", "and", "of", "for", "with", "on", "in", "our", "us", "send", "by"]);

function words(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  );
}

export function sameOwner(a: string, b: string): boolean {
  const x = a.toLowerCase().trim();
  const y = b.toLowerCase().trim();
  return x === y || x.split(" ")[0] === y.split(" ")[0];
}

export function matches(pred: Commitment, gold: Gold): boolean {
  if (!sameOwner(pred.owner, gold.owner)) return false;
  if ((pred.due ?? null) !== (gold.due ?? null)) return false;
  const g = words(gold.what);
  const p = words(pred.what + " " + pred.quote);
  if (g.size === 0) return true;
  let hit = 0;
  for (const w of g) if (p.has(w)) hit++;
  return hit / g.size >= 0.4;
}

export function score(rows: { predicted: Commitment[]; gold: Gold[] }[]) {
  let goldTotal = 0;
  let found = 0;
  let predTotal = 0;
  let correct = 0;
  for (const r of rows) {
    goldTotal += r.gold.length;
    predTotal += r.predicted.length;
    const used = new Set<number>();
    for (const g of r.gold) {
      const idx = r.predicted.findIndex((p, i) => !used.has(i) && matches(p, g));
      if (idx >= 0) {
        used.add(idx);
        found++;
      }
    }
    correct += used.size;
  }
  return {
    emails: rows.length,
    goldTotal,
    predTotal,
    recall: goldTotal ? found / goldTotal : null,
    precision: predTotal ? correct / predTotal : null,
  };
}

export type Status = "overdue" | "due_soon" | "open" | "no_date";

export function statusOf(due: string | null): Status {
  if (!due) return "no_date";
  const days = Math.round((Date.parse(due) - Date.parse(ASOF)) / 86400000);
  if (days < 0) return "overdue";
  if (days <= 3) return "due_soon";
  return "open";
}

export function daysOverdue(due: string): number {
  return Math.round((Date.parse(ASOF) - Date.parse(due)) / 86400000);
}
