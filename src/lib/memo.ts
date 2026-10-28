import { z } from "zod";
import { groundedSearch, llmJson, type WebSource } from "./llm";
import { DOCS, type Doc } from "./sample";

export type SourceRef = { id: string; kind: "doc" | "web"; title: string; url: string | null; excerpt: string | null };

const MemoSchema = z.object({
  title: z.string(),
  recommendation: z.string(),
  claims: z
    .array(z.object({ text: z.string(), sources: z.array(z.string()) }))
    .max(8),
  risks: z.array(z.object({ text: z.string(), sources: z.array(z.string()) })).max(4),
  next_steps: z.array(z.string()).max(5),
});

export type Memo = {
  title: string;
  recommendation: string;
  claims: { text: string; sources: string[] }[];
  risks: { text: string; sources: string[] }[];
  next_steps: string[];
  sources: SourceRef[];
  dropped: number;
  webUsed: boolean;
};

const STOP = new Set(["the", "and", "for", "with", "that", "this", "should", "we", "our", "from", "what", "how", "are", "does", "into", "about", "have", "will"]);

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

export function pickDocs(question: string, limit = 3): Doc[] {
  const q = new Set(tokens(question));
  return DOCS.map((d) => {
    const t = tokens(d.title + " " + d.text);
    let score = 0;
    for (const w of t) if (q.has(w)) score++;
    return { d, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.d);
}

function excerpt(text: string): string {
  return text.length > 220 ? text.slice(0, 217) + "..." : text;
}

const SYSTEM = `You write a one-page decision memo for a startup founder.
You are given numbered sources: internal documents (ids D1, D2, ...) and web findings (ids W1, W2, ...).
Rules:
- Every claim must be supported by at least one source id from the list. Put the ids in "sources". Never invent an id.
- Use only facts present in the sources. If the sources do not contain a needed fact, say so in a risk or a next step instead of guessing numbers.
- recommendation: one or two sentences with a clear decision.
- claims: up to 6 short factual statements that support the recommendation.
- risks: up to 3 risks, each with sources when available.
- next_steps: up to 4 concrete actions.
Return one JSON object: {"title","recommendation","claims":[{"text","sources":[]}],"risks":[{"text","sources":[]}],"next_steps":[]}.`;

export async function buildMemo(question: string): Promise<Memo> {
  const docs = pickDocs(question);
  const sources: SourceRef[] = docs.map((d) => ({ id: d.id, kind: "doc", title: d.title, url: null, excerpt: excerpt(d.text) }));

  let webText = "";
  let web: WebSource[] = [];
  try {
    const found = await groundedSearch(
      `Research this founder question using current public web sources and report the key facts with numbers where they exist. Be concise (under 250 words). Question: ${question}`,
    );
    webText = found.text.trim();
    web = found.sources;
  } catch {
    webText = "";
    web = [];
  }
  web.forEach((w, i) => sources.push({ id: `W${i + 1}`, kind: "web", title: w.title, url: w.url, excerpt: null }));

  const docBlock = docs.map((d) => `[${d.id}] ${d.title}: ${d.text}`).join("\n");
  const webBlock = webText && web.length ? `Web findings (cite with ${web.map((_, i) => `W${i + 1}`).join(", ")}):\n${webText}` : "No web findings available.";
  const user = `Question: ${question}\n\nInternal documents:\n${docBlock || "None matched."}\n\n${webBlock}`;

  const raw = await llmJson(MemoSchema, { system: SYSTEM, user });
  const valid = new Set(sources.map((s) => s.id));
  let dropped = 0;
  const keep = <T extends { sources: string[] }>(items: T[]): T[] =>
    items
      .map((it) => ({ ...it, sources: it.sources.filter((id) => valid.has(id)) }))
      .filter((it) => {
        if (it.sources.length === 0) {
          dropped++;
          return false;
        }
        return true;
      });

  const claims = keep(raw.claims);
  const risks = keep(raw.risks);
  const used = new Set([...claims, ...risks].flatMap((c) => c.sources));
  return {
    title: raw.title,
    recommendation: raw.recommendation,
    claims,
    risks,
    next_steps: raw.next_steps,
    sources: sources.filter((s) => used.has(s.id)),
    dropped,
    webUsed: web.length > 0,
  };
}
