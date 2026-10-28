"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch {
      setDone(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-md border border-white/15 px-2 py-1 text-xs text-zinc-300 transition hover:border-amber-400/60 hover:text-amber-200"
    >
      {done ? "Copied" : "Copy note"}
    </button>
  );
}
