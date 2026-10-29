import Link from "next/link";
import OrbitLoader from "../components/OrbitLoader";
import { SampleNotice } from "../components/Notice";

const STEPS = [
  { t: "Ask", b: "Type a vague question the way you would put it to a chief of staff." },
  { t: "Gather", b: "It pulls from the company's documents and from the web, keeping an id for every source." },
  { t: "Draft", b: "The memo is written with a source id on every claim." },
  { t: "Cut", b: "Code deletes any claim whose source id is missing or invalid, before you see it." },
];

const COMPARE: [string, string][] = [
  ["Promises in the mailbox", "Extracted with owner, due date and quote, then scored against hand labels"],
  ["Answers to a question", "One-page memo, every claim linked to a source"],
  ["Spoken notes in Hinglish", "Tasks, follow-ups and memo requests with dates resolved"],
];

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <section className="relative">
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pb-16 pt-14 md:grid-cols-[1.15fr_0.85fr] md:pt-20">
          <div>
            <h1 className="font-display hero-in text-5xl font-normal leading-[1.02] sm:text-6xl lg:text-7xl" style={{ animationDelay: "60ms" }}>
              Never lose a promise. Never answer without a source.
            </h1>
            <p className="hero-in mt-6 max-w-lg text-lg text-zinc-300" style={{ animationDelay: "160ms" }}>
              A founder loses the promises made inside email, and hours turning a vague question into a decision. This keeps the promises and writes the memo, with proof for every line.
            </p>
            <div className="hero-in mt-8 flex flex-wrap gap-3" style={{ animationDelay: "260ms" }}>
              <Link href="/ask" className="rounded-full bg-amber-300 px-6 py-3 font-semibold text-zinc-950 shadow-[0_0_40px_-8px_rgba(252,211,77,0.7)] transition hover:bg-amber-200">
                Try a cited memo
              </Link>
              <Link href="/ledger" className="rounded-full border border-white/20 px-6 py-3 font-medium transition hover:bg-white/5">
                See the ledger
              </Link>
            </div>
            <p className="hero-in mt-5 text-sm text-zinc-400" style={{ animationDelay: "340ms" }}>
              Runs on a fictional food startup. No sign-in needed.
            </p>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-[18%] rounded-full bg-amber-400/10 blur-3xl" />
            <div className="absolute inset-0">
              <OrbitLoader />
            </div>
            <div className="glass float-y absolute -bottom-3 left-0 w-64 rounded-2xl p-4 shadow-2xl sm:-left-8">
              <p className="text-xs text-zinc-400">In the scene</p>
              <p className="mt-1 text-sm">
                Each card is a promise. <span className="text-red-300">Red</span> ones are overdue. Move your mouse over it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-white/[0.02]">
        <dl className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-zinc-400">Promises found, of those labelled</dt>
            <dd className="font-display text-5xl">88%</dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-400">Extracted promises that were correct</dt>
            <dd className="font-display text-5xl">76%</dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-400">Basis</dt>
            <dd className="mt-2 text-sm text-zinc-300">30 short synthetic emails written and labelled by the developer. Easier than real mail, so an early score.</dd>
          </div>
        </dl>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <h2 className="font-display max-w-2xl text-4xl sm:text-5xl">Four things a founder&apos;s office does every day</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-6">
          <Link href="/ask" className="glass group rounded-3xl p-7 transition hover:border-amber-300/40 md:col-span-4 md:row-span-2">
            <h3 className="font-display text-3xl">Ask a question, get a cited memo</h3>
            <p className="mt-3 max-w-md text-zinc-300">A one-page decision memo where every claim links to an internal document or a web source. Claims without a source are removed.</p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-5 text-sm">
              <p className="text-zinc-400">Illustration, fictional company</p>
              <p className="mt-2 text-zinc-100">Recommendation: hold the launch until the supplier question is answered.</p>
              <p className="mt-2 text-zinc-300">
                The latest supplier email asks for a revised timeline <span className="rounded bg-amber-300/20 px-1.5 text-amber-100">[1]</span>, and the plan assumes the original one{" "}
                <span className="rounded bg-amber-300/20 px-1.5 text-amber-100">[2]</span>.
              </p>
            </div>
            <span className="mt-6 inline-block font-medium text-amber-200 underline-offset-4 group-hover:underline">Ask a question</span>
          </Link>
          <Link href="/ledger" className="glass rounded-3xl p-6 transition hover:border-amber-300/40 md:col-span-2">
            <h3 className="font-display text-2xl">Commitment ledger</h3>
            <p className="mt-2 text-sm text-zinc-300">Every promise with owner, due date and the exact quote. Overdue ones get a chase draft.</p>
          </Link>
          <Link href="/voice" className="glass rounded-3xl p-6 transition hover:border-amber-300/40 md:col-span-2">
            <h3 className="font-display text-2xl">Hinglish voice notes</h3>
            <p className="mt-2 text-sm text-zinc-300">Speak in Hindi, Hinglish or English. Get dated tasks and follow-ups.</p>
          </Link>
          <Link href="/brief" className="glass rounded-3xl p-6 transition hover:border-amber-300/40 md:col-span-6">
            <h3 className="font-display text-2xl">Morning brief</h3>
            <p className="mt-2 max-w-xl text-sm text-zinc-300">Overdue promises and a dossier for each meeting today, with the questions worth asking.</p>
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20">
        <h2 className="font-display max-w-2xl text-4xl sm:text-5xl">How a memo earns its citations</h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.t} className="rounded-2xl border border-white/10 p-5">
              <span className="font-display text-3xl text-amber-300">{i + 1}</span>
              <h3 className="font-display mt-3 text-2xl">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{s.b}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20">
        <h2 className="font-display max-w-3xl text-4xl sm:text-5xl">Next to Superhuman, Shortwave and Fyxer</h2>
        <p className="mt-4 max-w-2xl text-zinc-300">Those tools triage and draft email, and they do it well. This covers the work around the inbox.</p>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[460px] text-left text-sm">
            <thead className="bg-white/[0.04] text-zinc-300">
              <tr>
                <th className="p-4 font-medium">Job</th>
                <th className="p-4 font-medium text-amber-200">Founder&apos;s Office Agent</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map(([a, c]) => (
                <tr key={a} className="border-t border-white/10 align-top">
                  <td className="p-4 font-medium">{a}</td>
                  <td className="p-4 text-zinc-100">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-amber-300/10 via-transparent to-orange-400/10 p-8 sm:p-12">
          <h2 className="font-display text-4xl sm:text-5xl">See the first memo in under a minute</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/ask" className="rounded-full bg-amber-300 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-amber-200">Try a cited memo</Link>
            <Link href="/method" className="rounded-full border border-white/20 px-6 py-3 font-medium transition hover:bg-white/5">Read the method</Link>
          </div>
        </div>
        <div className="mt-6">
          <SampleNotice />
        </div>
      </section>
    </main>
  );
}
