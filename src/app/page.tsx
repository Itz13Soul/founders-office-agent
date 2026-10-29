import Link from "next/link";
import OrbitLoader from "../components/OrbitLoader";

const TOOLS = [
  { href: "/ask", t: "Ask", b: "A one-page decision memo where every claim links to a source." },
  { href: "/ledger", t: "Ledger", b: "Every promise in the mailbox, with owner, due date and the exact quote." },
  { href: "/voice", t: "Voice", b: "Speak in Hindi, Hinglish or English and get dated tasks." },
  { href: "/brief", t: "Morning brief", b: "Overdue promises and a dossier for each meeting today." },
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pb-16 pt-12 md:grid-cols-[1.2fr_0.8fr] md:pt-20">
        <div>
          <h1 className="font-display hero-in text-5xl font-normal leading-[1.05] sm:text-6xl">
            Never lose a promise. Never answer without a source.
          </h1>
          <p className="hero-in mt-5 max-w-md text-lg text-zinc-300" style={{ animationDelay: "100ms" }}>
            It keeps the promises made in email and writes the memo, with proof for every line.
          </p>
          <div className="hero-in mt-8 flex flex-wrap items-center gap-4" style={{ animationDelay: "200ms" }}>
            <Link href="/ask" className="rounded-full bg-amber-300 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-amber-200">
              Try a cited memo
            </Link>
            <span className="text-sm text-zinc-400">Fictional company. No sign-in.</span>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <OrbitLoader />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16">
        <ul className="divide-y divide-white/10 border-y border-white/10">
          {TOOLS.map((t) => (
            <li key={t.href}>
              <Link href={t.href} className="grid gap-1 py-5 transition hover:bg-white/[0.03] sm:grid-cols-[10rem_1fr] sm:items-baseline sm:px-2">
                <span className="font-display text-2xl">{t.t}</span>
                <span className="text-zinc-300">{t.b}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20">
        <p className="max-w-2xl text-zinc-300">
          In a test on 30 synthetic emails, it found 88% of the labelled promises and 76% of what it extracted was correct. Any memo claim without a valid source is deleted in code before you see it.{" "}
          <Link href="/method" className="text-amber-200 underline-offset-4 hover:underline">Method</Link>
        </p>
        <p className="mt-4 text-sm text-zinc-400">
          Sample data. Northwind Foods, its people and emails are fictional. Outputs are model suggestions to be checked, not facts or advice.
        </p>
      </section>
    </main>
  );
}
