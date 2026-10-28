import Link from "next/link";
import OrbitLoader from "../components/OrbitLoader";
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
      <section className="grid items-center gap-6 pt-4 md:grid-cols-2">
        <div className="rise">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-300">AI Founder&apos;s Office</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Never lose a promise.{" "}
            <span className="bg-gradient-to-r from-amber-300 to-pink-400 bg-clip-text text-transparent">Never answer without a source.</span>
          </h1>
          <p className="mt-4 max-w-md text-zinc-400">
            Inbox tools sort your email. A founder loses the promises made inside it, and the hours spent turning a vague question into a
            decision. Try it on a fictional food startup, with no sign-in.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/ask" className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-amber-300">
              Try a cited memo
            </Link>
            <Link href="/ledger" className="rounded-lg border border-white/15 px-4 py-2 text-sm text-zinc-200 transition hover:border-amber-400/60">
              See the ledger
            </Link>
          </div>
          <p className="mt-4 text-xs text-zinc-500">Red cards in the scene are overdue promises. Move your mouse over it.</p>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute inset-[18%] rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute inset-0">
            <OrbitLoader />
          </div>
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

      <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-lg font-semibold">Where this differs from inbox assistants</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Superhuman, Shortwave and Fyxer triage and draft email. This does three things they do not claim to measure.
        </p>
        <ul className="mt-3 grid gap-3 text-sm text-zinc-300 sm:grid-cols-3">
          <li className="rounded-lg bg-black/30 p-3">Promises are scored against hand labels. Recall and precision are on the Method page.</li>
          <li className="rounded-lg bg-black/30 p-3">A memo claim without a valid source id is deleted in code before you see it.</li>
          <li className="rounded-lg bg-black/30 p-3">Hinglish voice input turns a spoken note into dated tasks.</li>
        </ul>
      </section>

      <div className="mt-8">
        <SampleNotice />
      </div>
    </main>
  );
}
