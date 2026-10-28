import type { Metadata } from "next";
import AskBox from "../../components/AskBox";
import { SampleNotice } from "../../components/Notice";

export const metadata: Metadata = { title: "Ask | Founder's Office Agent" };

export default async function Ask({ searchParams }: PageProps<"/ask">) {
  const raw = (await searchParams).q;
  const preset = (Array.isArray(raw) ? raw[0] : raw)?.slice(0, 300) ?? "";
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-10">
      <h1 className="text-3xl font-semibold tracking-tight">Decision memos with sources</h1>
      <p className="mt-2 text-zinc-400">
        Ask an open question. The memo uses the company&apos;s sample documents and live web search. A statement that cannot point to a source is
        dropped, not guessed.
      </p>
      <div className="mt-4">
        <SampleNotice />
      </div>
      <div className="mt-6">
        <AskBox preset={preset} />
      </div>
    </main>
  );
}
