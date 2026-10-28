import { z } from "zod";
import { llmJson } from "./llm";
import { ASOF, MEETINGS } from "./sample";

const DossierSchema = z.object({
  meetings: z
    .array(
      z.object({
        id: z.string(),
        summary: z.string(),
        questions: z.array(z.string()).max(4),
      }),
    )
    .max(5),
  headline: z.string(),
});
export type Dossier = z.infer<typeof DossierSchema>;

export type OpenItem = { owner: string; what: string; due: string | null; days: number | null };

const SYSTEM = `You write a morning brief for a founder from facts given as JSON.
Rules: use only the facts provided; do not add numbers or names. headline: one sentence on the most important thing today. For each meeting return id, a two-sentence summary of who the counterparty is and what is at stake, and up to 3 sharp questions the founder should ask. Return JSON: {"headline","meetings":[{"id","summary","questions":[]}]}.`;

export async function buildDossier(openItems: OpenItem[]): Promise<Dossier> {
  const facts = { today: ASOF, meetings: MEETINGS, most_overdue: openItems.slice(0, 5) };
  return llmJson(DossierSchema, { system: SYSTEM, user: JSON.stringify(facts) });
}
