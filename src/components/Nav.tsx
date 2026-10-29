import Link from "next/link";

const LINKS = [
  { href: "/ask", label: "Ask" },
  { href: "/ledger", label: "Ledger" },
  { href: "/voice", label: "Voice" },
  { href: "/brief", label: "Morning brief" },
  { href: "/method", label: "Method" },
];

export default function Nav() {
  return (
    <header className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-y-2 px-4 py-5">
      <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_2px_rgba(251,191,36,0.7)]" />
        Founder&apos;s Office
      </Link>
      <nav aria-label="Primary" className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-sm text-zinc-300">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="transition-colors hover:text-zinc-100">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
