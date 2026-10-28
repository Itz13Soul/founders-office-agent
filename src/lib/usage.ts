import "server-only";
import { supabaseService } from "./supabase";

export async function withinDailyCap(): Promise<boolean | null> {
  const cap = Math.max(1, Number(process.env.DAILY_LLM_CAP ?? 120));
  const { data, error } = await supabaseService().rpc("bump_fo_usage", { cap });
  if (error) return null;
  return Boolean(data);
}

export function clientError(status: number, error: string) {
  return Response.json({ error }, { status });
}

export async function guard(): Promise<Response | null> {
  const ok = await withinDailyCap();
  if (ok === null) return clientError(503, "Service unavailable.");
  if (!ok) return clientError(429, "The daily limit for live demo requests has been reached. Please try again tomorrow.");
  return null;
}
