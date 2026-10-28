import { z } from "zod";
import { llmJson } from "../../../lib/llm";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET() {
  const started = Date.now();
  try {
    await llmJson(z.object({ ok: z.boolean() }), { system: 'Return {"ok": true} as JSON.', user: "ping" });
    return Response.json({ ok: true, model: process.env.GEMINI_MODEL ?? null, fallback: process.env.GEMINI_FALLBACK_MODEL ?? null, ms: Date.now() - started });
  } catch (e) {
    return Response.json({ ok: false, model: process.env.GEMINI_MODEL ?? null, fallback: process.env.GEMINI_FALLBACK_MODEL ?? null, ms: Date.now() - started, error: String(e).slice(0, 300) }, { status: 503 });
  }
}
