import type { Metadata } from "next";
import VoiceBox from "../../components/VoiceBox";
import { HINGLISH_EXAMPLES } from "../../lib/sample";

export const metadata: Metadata = { title: "Voice notes | Founder's Office Agent" };

export default function Voice() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-10">
      <h1 className="text-3xl font-semibold tracking-tight">Speak a note in Hinglish</h1>
      <p className="mt-2 text-zinc-400">
        Say what is on your mind in Hindi, Hinglish or English. It becomes tasks, follow-ups and memo requests, with dates like &ldquo;kal&rdquo; and
        &ldquo;Friday tak&rdquo; resolved. Speech recognition runs in your browser; only the text is sent.
      </p>
      <div className="mt-6">
        <VoiceBox examples={HINGLISH_EXAMPLES} />
      </div>
    </main>
  );
}
