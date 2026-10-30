"use client";

import { track } from "../lib/track";
import { useRef, useState, useSyncExternalStore } from "react";
import type { VoiceItem } from "../lib/voice";

type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
};

type RecognitionCtor = new () => Recognition;

const TYPE_LABEL: Record<VoiceItem["type"], string> = {
  task: "Task",
  follow_up: "Follow-up",
  memo_request: "Memo request",
};

export default function VoiceBox({ examples }: { examples: string[] }) {
  const [text, setText] = useState("");
  const [lang, setLang] = useState("hi-IN");
  const [listening, setListening] = useState(false);
  const supported = useSyncExternalStore(
    () => () => {},
    () => {
      const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
      return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
    },
    () => false,
  );
  const [result, setResult] = useState<{ english: string; items: VoiceItem[] } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const rec = useRef<Recognition | null>(null);

  function toggle() {
    if (listening) {
      rec.current?.stop();
      return;
    }
    const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = lang;
    r.interimResults = true;
    r.continuous = true;
    r.onresult = (e) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript + " ";
      setText(t.trim());
    };
    r.onend = () => setListening(false);
    r.onerror = (e) => {
      setListening(false);
      setError(e.error === "not-allowed" ? "Microphone permission was denied." : `Speech recognition error: ${e.error}`);
    };
    rec.current = r;
    setError("");
    setListening(true);
    r.start();
  }

  async function submit() {
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ transcript: text }),
      });
      const data = (await res.json().catch(() => ({ error: "The server took too long." }))) as {
        english?: string;
        items?: VoiceItem[];
        error?: string;
      };
      if (!res.ok || !data.items) { setError(data.error ?? "Something went wrong."); track("voice_error"); }
      else { setResult({ english: data.english ?? "", items: data.items }); track("voice_processed", { items: data.items.length }); }
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          onClick={toggle}
          disabled={!supported}
          className={`rounded-full px-4 py-2 font-semibold transition disabled:opacity-40 ${
            listening ? "bg-red-500 text-white" : "bg-amber-400 text-zinc-950 hover:bg-amber-300"
          }`}
        >
          {listening ? "Stop" : "Speak"}
        </button>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          disabled={listening}
          className="rounded-lg border border-white/10 bg-black/30 p-2 focus:border-amber-400/60 focus:outline-none"
        >
          <option value="hi-IN">Hindi / Hinglish</option>
          <option value="en-IN">English (India)</option>
        </select>
        {!supported && <span className="text-xs text-zinc-500">Voice input needs Chrome or Edge. You can type instead.</span>}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={600}
        rows={3}
        placeholder="Your note appears here. You can edit it."
        className="mt-3 w-full rounded-lg border border-white/10 bg-black/30 p-3 text-sm placeholder:text-zinc-500 focus:border-amber-400/60 focus:outline-none"
      />
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        {examples.map((ex) => (
          <button key={ex} type="button" onClick={() => setText(ex)} className="rounded-full border border-white/15 px-3 py-1 text-left text-zinc-300 hover:border-amber-400/60">
            {ex}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={busy || text.trim().length < 6}
        onClick={submit}
        className="mt-3 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-300 disabled:opacity-40"
      >
        {busy ? "Reading..." : "Turn into tasks"}
      </button>
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      {result && (
        <div className="mt-4">
          <p className="text-sm text-zinc-400">
            <span className="font-medium text-zinc-200">In English: </span>
            {result.english}
          </p>
          <ul className="mt-3 space-y-2">
            {result.items.length === 0 && <li className="text-sm text-zinc-400">No actions found in this note.</li>}
            {result.items.map((it, i) => (
              <li key={i} className="rounded-lg border border-white/10 bg-black/30 p-3 text-sm">
                <span className="mr-2 rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
                  {TYPE_LABEL[it.type]}
                </span>
                {it.text}
                <span className="text-zinc-400">
                  {it.who ? ` · ${it.who}` : ""}
                  {it.due ? ` · due ${it.due}` : ""}
                </span>
                {it.type === "memo_request" && (
                  <a href={`/ask?q=${encodeURIComponent(it.text)}`} className="ml-2 text-amber-300 underline">
                    Open in Ask
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
