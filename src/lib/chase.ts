import { z } from "zod";
import { llmJson } from "./llm";
import { ASOF } from "./sample";

const Schema = z.object({ subject: z.string(), body: z.string() });

const SYSTEM = `You draft a short, polite chase-up email from a founder about an unfulfilled promise.
Rules: use only the facts given. Reference the original promise and its due date plainly. Three or four short sentences, no flattery, no placeholders in brackets, sign off with the founder's first name. If the promise is not overdue, write a friendly reminder instead of a complaint. Return JSON: {"subject","body"}.`;

export async function draftChase(input: { owner: string; what: string; due: string | null; quote: string; founder: string }) {
  const user = JSON.stringify({ today: ASOF, ...input });
  return llmJson(Schema, { system: SYSTEM, user });
}
