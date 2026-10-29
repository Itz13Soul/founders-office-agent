# Founder's Office Agent: case study

**Problem.** A founder's office loses track of promises made over email, and decision memos often contain claims nobody can trace.

**Existing tools.** Superhuman, Shortwave and Fyxer triage and draft email. I did not try to beat them on inbox design.

**What I built.** A demo on a fictional company (Northwind Foods):
- **Ask:** decision memos where every claim carries a source id. Claims without a valid source are removed in code.
- **Ledger:** promises extracted from email with owner, due date and status; overdue first; chase-up drafts.
- **Voice:** Hinglish speech or text into tasks, follow-ups and memo requests with dates resolved.
- **Morning brief:** overdue promises and a dossier per meeting.

**Decisions.** Source checks happen in code, not in the prompt. The demo never connects to a real inbox. Model output is labelled a suggestion to verify.

**Evidence.** 30 synthetic emails with 25 hand-labelled promises (29 Oct 2026): **recall 88% (22 of 25), precision 76% (22 of 29)**. That is below my 90% recall target. All three misses were relative dates ("end of next week", "this week", "Wednesday"). Most of the 7 extra predictions were requests or terms I had not labelled as promises. The prompt was not tuned on this set.

**Speed work.** The model call raced against a faster backup model, repeat inputs are cached, and the server runs in Mumbai. A trivial model call measured 2.3 to 9 s before and about 3.6 to 4.5 s after; page loads dropped from about 920 ms to about 93 ms.

**Limits.** 30 emails against a plan of 100. Synthetic and easier than real mail. Relative-date handling is the known weak spot.

**Next.** Resolve relative dates in code against the email's sent date, then grow the labelled set.

Live: https://founders-office-agent.vercel.app
