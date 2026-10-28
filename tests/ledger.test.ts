import { test } from "node:test";
import assert from "node:assert/strict";
import { matches, score, statusOf, daysOverdue, type Commitment } from "../src/lib/ledger";
import { pickDocs } from "../src/lib/memo";
import { EMAILS, DOCS } from "../src/lib/sample";

const c = (owner: string, what: string, due: string | null): Commitment => ({ owner, what, due, quote: what } as Commitment);

test("matches requires owner, due date and word overlap", () => {
  const gold = { owner: "Priya Nair", what: "send revised pricing deck", due: "2026-10-30" };
  assert.equal(matches(c("Priya", "send the revised pricing deck", "2026-10-30"), gold), true);
  assert.equal(matches(c("Rahul", "send the revised pricing deck", "2026-10-30"), gold), false);
  assert.equal(matches(c("Priya", "send the revised pricing deck", "2026-11-01"), gold), false);
  assert.equal(matches(c("Priya", "book travel", "2026-10-30"), gold), false);
});

test("score computes recall and precision without double counting", () => {
  const gold = [{ owner: "Priya", what: "send pricing deck", due: "2026-10-30" }];
  const r = score([{ predicted: [c("Priya", "send pricing deck", "2026-10-30"), c("Priya", "send pricing deck", "2026-10-30")], gold }]);
  assert.equal(r.recall, 1);
  assert.equal(r.precision, 0.5);
});

test("score returns null when nothing to measure", () => {
  const r = score([]);
  assert.equal(r.recall, null);
  assert.equal(r.precision, null);
});

test("statusOf is relative to the fixed sample date", () => {
  assert.equal(statusOf(null), "no_date");
  assert.equal(statusOf("2026-10-30"), "overdue");
  assert.equal(statusOf("2026-11-04"), "due_soon");
  assert.equal(statusOf("2026-12-01"), "open");
  assert.equal(daysOverdue("2026-10-30"), 3);
});

test("pickDocs returns only documents sharing words with the question", () => {
  const first = DOCS[0];
  const word = first.title.split(/\s+/).find((w) => w.length > 4) ?? first.title;
  assert.ok(pickDocs(word).length >= 1);
  assert.equal(pickDocs("zzzzqqqq").length, 0);
});

test("sample mailbox has unique ids and valid gold dates", () => {
  const ids = new Set(EMAILS.map((e) => e.id));
  assert.equal(ids.size, EMAILS.length);
  for (const e of EMAILS) for (const g of e.gold) if (g.due) assert.match(g.due, /^\d{4}-\d{2}-\d{2}$/);
});
