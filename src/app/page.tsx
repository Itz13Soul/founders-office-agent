import Link from "next/link";
import { SampleNotice } from "../components/Notice";

const CARDS = [
  {
    href: "/ask",
    title: "Ask a question, get a cited memo",
    body: "A one-page decision memo where every claim links to an internal document or a web source. Claims without a source are removed.",
    tag: "Core",
  },
  {
    href: "/ledger",
    title: "Commitment ledger",
    body: "Every promise in the mailbox with owner, due date and the exact quote. Overdue ones get a one-click chase draft.",
    tag: "Measured",
  },
  {
    href: "/voice",
    title: "Hinglish voice notes",
    body: "Speak in Hindi, Hinglish or English. Get tasks, follow-ups and memo requests with dates resolved.",
    tag: "Try it",
  },
  {
    href: "/brief",
    title: "Morning brief",
    body: "Overdue promises and a dossier for each meeting today, with questions worth asking.",
    tag: "Daily",
  },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-10">
      <section className="rise pt-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-300">AI Founder&apos;s Office</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Never lose a promise. Never answer a question without a source.
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-400">
          Inbox tools sort your email. A founder loses the promises made inside it and the hours spent turning a vague question into a
          decision. This is a working demo on a fictional food startup: try it in under a minute, with no sign-in.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/ask" className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-amber-300">
            Try a cited memo
          </Link>
          <Link href="/ledger" className="rounded-lg border border-white/15 px-4 py-2 text-sm text-zinc-200 transition hover:border-amber-400/60">
            See the ledger
          </Link>
        </div>
      </section>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {CARDS.map((c, i) => (
          <li key={c.href} style={{ animationDelay: `${i * 70}ms` }} className="rise">
            <Link href={c.href} className="block h-full rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur transition hover:border-amber-400/40">
              <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200">{c.tag}</span>
              <h2 className="mt-3 text-lg font-semibold">{c.title}</h2>
              <p className="mt-1 text-sm text-zinc-400">{c.body}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <SampleNotice />
      </div>
    </main>
  );
}
