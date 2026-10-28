import { z } from "zod";
import { llmJson } from "./llm";

export const VoiceItemSchema = z.object({
  type: z.enum(["task", "follow_up", "memo_request"]),
  text: z.string(),
  who: z.string().nullable(),
  due: z.string().nullable(),
});
export type VoiceItem = z.infer<typeof VoiceItemSchema>;

const ResultSchema = z.object({ english: z.string(), items: z.array(VoiceItemSchema).max(8) });

const SYSTEM = `You turn a founder's spoken note, written in Hindi, Hinglish (Hindi in Roman letters) or English, into structured items.
Rules:
- english: a faithful one-sentence English rendering of what was said.
- items: each distinct instruction becomes one item.
  type "task": something the founder must do.
  type "follow_up": a reminder to chase another person about something owed.
  type "memo_request": the founder wants a researched decision memo on a question; put the question in text.
- text: short English phrase. who: the person involved or null. due: ISO date YYYY-MM-DD resolved from the given today date (e.g. "kal" is tomorrow, "parso" the day after, "Friday tak" the next Friday) or null.
- Do not invent items that were not said.
Return one JSON object: {"english","items":[{"type","text","who","due"}]}.`;

export async function parseVoice(transcript: string, today: string) {
  const user = `Today: ${today}\nTranscript: ${JSON.stringify(transcript)}`;
  return llmJson(ResultSchema, { system: SYSTEM, user });
}
