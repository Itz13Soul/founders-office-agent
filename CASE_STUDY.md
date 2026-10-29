# Founder's Office Agent: case study

**Problem.** Founders lose promises made inside email threads and spend hours turning vague questions into decisions. Inbox assistants such as Superhuman, Shortwave and Fyxer sort and draft email, but none publishes how often they miss a commitment.

**What I built.** A demo on a fictional company (Northwind Foods): cited decision memos, a promise ledger with overdue tracking and chase-up drafts, Hinglish voice notes, and a morning brief with meeting dossiers.

**Decisions.**
- No inbox connection. Gmail access needs Google's app verification, and a public demo should not hold anyone's mail. A labelled synthetic mailbox also allows measurement.
- Memo claims must cite a source id from a numbered list. Claims with an unknown id are deleted in code, not trusted to the model.
- Extraction is scored against hand labels, and the score is published on the Method page.

**Result.** Recall 88% and precision 76% on 30 emails and 25 labelled promises, below the 90% recall target. Misses are date-resolution errors. Next steps: fix the reference date handling, grow the set to 100 emails, and add real-world messy email.

**Limits.** Small synthetic set written by the developer. Model output is a suggestion to verify. Not legal or financial advice.

Copyright (c) 2026 Divyansh Srivastava. All rights reserved.
