# Founder's Office Agent

An assistant for a startup founder's office, demonstrated on a fictional company (Northwind Foods).

- **Ask**: decision memos where every claim carries a source id. Claims without a valid source are removed in code.
- **Ledger**: promises extracted from email, with owner, due date and status. Overdue items surface first, and a chase-up note can be drafted.
- **Voice**: speak or type in Hinglish; get tasks, follow-ups and memo requests with dates resolved.
- **Morning brief**: overdue promises and a dossier for each meeting of the day.
- **Method**: the measured recall and precision of the extraction, and the limits.

## Existing tools and the wedge

Tools such as Superhuman, Shortwave and Fyxer draft and triage email. This project does not try to beat them on inbox UX. The wedge is narrower: a promise ledger that is scored against hand labels, memos whose claims are checked against numbered sources, and Hinglish voice input for Indian founders.

## Evaluation

The sample mailbox has 30 short synthetic emails with hand-written labels. A promise counts as found when owner, due date and key words match. Results are stored by the admin console and published on the Method page. The plan's target of 100 labelled emails is not met; the set is smaller and easier than real mail, so scores are early.

### Result (29 Oct 2026)

On the 30 sample emails (25 labelled promises), with a Gemini Flash model: **recall 88% (22 of 25), precision 76% (22 of 29)**. This is below the plan's 90% recall target. All three misses are relative-date resolutions ("end of next week", "this week", "Wednesday") where the model chose a different date from the label. The extra 7 predictions are mostly requests and statements of terms that were not labelled as promises. The prompt was not tuned on this set, so the figure is a first measurement, not a best case.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill it in. Secrets are read only on the server.
3. Apply `supabase/schema.sql` to a Supabase project.
4. `npm run dev`

`ADMIN_PASSWORD` must be at least 16 characters. Open `/admin`, sign in, and run extraction to fill the ledger.

## Checks

`npm run typecheck`, `npm run lint`, `npm test`, `npm run secret-scan`.

## Deployment

Deploy on Vercel with the variables listed in `.env.example`. Run `npm run build` locally to verify first.

## Notice

Model output is a suggestion to verify. Not legal or financial advice. The demo does not connect to anyone's inbox.

## License

Copyright (c) 2026 Divyansh Srivastava. All rights reserved. Viewing only; see LICENSE.

Read the one-page [case study](CASE_STUDY.md).
