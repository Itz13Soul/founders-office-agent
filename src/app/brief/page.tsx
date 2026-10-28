import type { Metadata } from "next";
import BriefBox from "../../components/BriefBox";
import { SampleNotice } from "../../components/Notice";
import { ASOF, MEETINGS } from "../../lib/sample";

export const metadata: Metadata = { title: "Morning brief | Founder's Office Agent" };

export default function Brief() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-10">
      <h1 className="text-3xl font-semibold tracking-tight">Morning brief</h1>
      <p className="mt-2 text-zinc-400">Sample day: {ASOF}. Overdue promises from the ledger, and a dossier for each meeting.</p>
      <div className="mt-4">
        <SampleNotice />
      </div>
      <div className="mt-6">
        <BriefBox meetings={MEETINGS} />
      </div>
    </main>
  );
}
