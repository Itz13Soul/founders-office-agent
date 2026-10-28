export const COMPANY = "Northwind Foods";
export const ASOF = "2026-11-02";
export const SAMPLE_NOTICE = "Sample data. Northwind Foods, its people and every email below are fictional.";

export type Gold = { owner: string; what: string; due: string | null };
export type Email = {
  id: string;
  thread: string;
  date: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  gold: Gold[];
};

export const PEOPLE = {
  riya: "Riya Mehta",
  arjun: "Arjun Rao",
  neha: "Neha Kapoor",
  sameer: "Sameer Joshi",
  ananya: "Ananya Iyer",
  karan: "Karan Shah",
  meera: "Meera Das",
};

const R = PEOPLE.riya, A = PEOPLE.arjun, N = PEOPLE.neha, S = PEOPLE.sameer, I = PEOPLE.ananya, K = PEOPLE.karan, M = PEOPLE.meera;

export const EMAILS: Email[] = [
  { id: "e01", thread: "t1", date: "2026-10-12", from: R, to: I, subject: "Series A update and deck", body: "Thanks for the call, Ananya. I'll send the updated deck with the new retention numbers by Friday.", gold: [{ owner: R, what: "send updated deck retention numbers", due: "2026-10-16" }] },
  { id: "e02", thread: "t1", date: "2026-10-13", from: I, to: R, subject: "Re: Series A update and deck", body: "Great. Once I have it, I will share it with the partners and get back to you with feedback by October 23.", gold: [{ owner: I, what: "share deck with partners and give feedback", due: "2026-10-23" }] },
  { id: "e03", thread: "t2", date: "2026-10-12", from: A, to: R, subject: "Fresh Fields delivery delays", body: "Two of last week's deliveries from Fresh Fields arrived late. I will call Sameer tomorrow and confirm a fix. FYI the cold storage audit passed.", gold: [{ owner: A, what: "call Sameer confirm delivery fix", due: "2026-10-13" }] },
  { id: "e04", thread: "t2", date: "2026-10-13", from: A, to: S, subject: "Late deliveries", body: "Sameer, we need a written plan to stop the late deliveries. Can you send it over this week?", gold: [] },
  { id: "e05", thread: "t2", date: "2026-10-14", from: S, to: A, subject: "Re: Late deliveries", body: "Understood. I'll send the written delivery plan by Monday and we will add a second truck from the 26th.", gold: [{ owner: S, what: "send written delivery plan", due: "2026-10-19" }, { owner: S, what: "add second truck", due: "2026-10-26" }] },
  { id: "e06", thread: "t3", date: "2026-10-13", from: N, to: R, subject: "September books", body: "September books are closed. Net revenue was up on August. Nothing needed from you.", gold: [] },
  { id: "e07", thread: "t3", date: "2026-10-14", from: R, to: N, subject: "GST filing", body: "Neha, please file the GSTR-3B for September before the 20th and send me the acknowledgement.", gold: [{ owner: N, what: "file GSTR-3B September", due: "2026-10-20" }, { owner: N, what: "send acknowledgement", due: "2026-10-20" }] },
  { id: "e08", thread: "t3", date: "2026-10-15", from: N, to: R, subject: "Re: GST filing", body: "Will do. I'll file on the 19th and forward the acknowledgement the same day.", gold: [{ owner: N, what: "file GST and forward acknowledgement", due: "2026-10-19" }] },
  { id: "e09", thread: "t4", date: "2026-10-14", from: K, to: R, subject: "QuickCart listing", body: "We would like to list your millet snacks in 40 stores. I'll send the commercial terms by the end of next week.", gold: [{ owner: K, what: "send commercial terms", due: "2026-10-23" }] },
  { id: "e10", thread: "t4", date: "2026-10-15", from: R, to: K, subject: "Re: QuickCart listing", body: "Happy to proceed. I will share our margin sheet and the product spec on Tuesday.", gold: [{ owner: R, what: "share margin sheet and product spec", due: "2026-10-20" }] },
  { id: "e11", thread: "t5", date: "2026-10-15", from: M, to: R, subject: "New pack design", body: "Attaching round one of the pack design. Let me know what you think. I might tweak the colours later.", gold: [] },
  { id: "e12", thread: "t5", date: "2026-10-16", from: R, to: M, subject: "Re: New pack design", body: "Love the direction. Give me until Wednesday and I will send consolidated feedback from the team.", gold: [{ owner: R, what: "send consolidated feedback pack design", due: "2026-10-21" }] },
  { id: "e13", thread: "t5", date: "2026-10-19", from: M, to: R, subject: "Re: New pack design", body: "Perfect. I'll turn round two within three days of getting your feedback.", gold: [{ owner: M, what: "deliver round two of design", due: null }] },
  { id: "e14", thread: "t6", date: "2026-10-16", from: A, to: R, subject: "Hiring a QA lead", body: "We have four candidates for the QA lead role. I'll schedule interviews and share the shortlist by Thursday.", gold: [{ owner: A, what: "schedule interviews and share shortlist", due: "2026-10-22" }] },
  { id: "e15", thread: "t6", date: "2026-10-19", from: R, to: A, subject: "Re: Hiring a QA lead", body: "Thanks. I sent the job description to the recruiter yesterday. Let's talk when the shortlist is ready.", gold: [] },
  { id: "e16", thread: "t7", date: "2026-10-19", from: I, to: R, subject: "Diligence list", body: "Here is our diligence checklist. Please send the cap table and the FSSAI licences by October 30.", gold: [{ owner: R, what: "send cap table and FSSAI licences", due: "2026-10-30" }] },
  { id: "e17", thread: "t7", date: "2026-10-20", from: R, to: I, subject: "Re: Diligence list", body: "Noted. Neha will pull the cap table; I'll personally send the licences once legal reviews them.", gold: [{ owner: N, what: "pull cap table", due: null }, { owner: R, what: "send licences after legal review", due: null }] },
  { id: "e18", thread: "t8", date: "2026-10-20", from: N, to: R, subject: "Budget for Q4", body: "Attached is the Q4 budget draft. Can you review it? I have a few open questions on marketing spend.", gold: [] },
  { id: "e19", thread: "t8", date: "2026-10-21", from: R, to: N, subject: "Re: Budget for Q4", body: "Reviewing tonight. I'll reply with comments by tomorrow noon.", gold: [{ owner: R, what: "reply with budget comments", due: "2026-10-22" }] },
  { id: "e20", thread: "t9", date: "2026-10-21", from: S, to: A, subject: "Price revision", body: "Due to millet price rise we are revising rates by 6 percent from next month. We will send the revised rate card on the 25th.", gold: [{ owner: S, what: "send revised rate card", due: "2026-10-25" }] },
  { id: "e21", thread: "t9", date: "2026-10-22", from: A, to: S, subject: "Re: Price revision", body: "A 6 percent rise is steep. I'll check with Riya and revert to you early next week.", gold: [{ owner: A, what: "check with Riya and revert on price", due: "2026-10-26" }] },
  { id: "e22", thread: "t10", date: "2026-10-22", from: K, to: R, subject: "Store launch date", body: "We are targeting 15 November for the launch. If the terms are signed in time we can hold the date.", gold: [] },
  { id: "e23", thread: "t10", date: "2026-10-23", from: R, to: K, subject: "Re: Store launch date", body: "I will have our legal team return the signed agreement by October 28.", gold: [{ owner: R, what: "return signed agreement", due: "2026-10-28" }] },
  { id: "e24", thread: "t11", date: "2026-10-23", from: M, to: R, subject: "Invoice", body: "Invoice attached for round one. Payment terms are 15 days.", gold: [] },
  { id: "e25", thread: "t11", date: "2026-10-26", from: R, to: N, subject: "Fwd: Invoice", body: "Neha, can you clear Meera's invoice this week? I'll confirm the amount with her by tomorrow.", gold: [{ owner: N, what: "clear Meera invoice", due: "2026-10-30" }, { owner: R, what: "confirm invoice amount with Meera", due: "2026-10-27" }] },
  { id: "e26", thread: "t12", date: "2026-10-26", from: A, to: R, subject: "Cold storage expansion", body: "Quotes for the second cold room are in. I'll put together a comparison and walk you through it on Friday.", gold: [{ owner: A, what: "prepare cold room quote comparison and walk through", due: "2026-10-30" }] },
  { id: "e27", thread: "t12", date: "2026-10-27", from: R, to: A, subject: "Re: Cold storage expansion", body: "Sounds good. I won't decide before I see the comparison.", gold: [] },
  { id: "e28", thread: "t13", date: "2026-10-27", from: I, to: R, subject: "Partner feedback", body: "The partners liked the retention story. I will send our term sheet draft next Monday.", gold: [{ owner: I, what: "send term sheet draft", due: "2026-11-02" }] },
  { id: "e29", thread: "t13", date: "2026-10-28", from: R, to: I, subject: "Re: Partner feedback", body: "Wonderful. We'll arrange a call with our lawyer on Wednesday to go through it once it arrives.", gold: [{ owner: R, what: "arrange call with lawyer", due: "2026-11-04" }] },
  { id: "e30", thread: "t14", date: "2026-10-28", from: S, to: A, subject: "Second truck", body: "The second truck is delayed by a week because of a permit. Sorry about this. I will keep you posted.", gold: [] },
];

export type Doc = { id: string; title: string; text: string };

export const DOCS: Doc[] = [
  { id: "D1", title: "Northwind Foods FY26 plan (sample)", text: "Northwind Foods sells millet snacks in India. FY26 revenue target is 18 crore, up from 9 crore in FY25. Gross margin is 41 percent. The plan assumes a Series A of 25 crore closing in the third quarter and new modern-trade listings in 40 stores through QuickCart." },
  { id: "D2", title: "Supplier summary: Fresh Fields (sample)", text: "Fresh Fields supplies 70 percent of Northwind's millet. Deliveries were late in four of the last twelve weeks. Fresh Fields has proposed a 6 percent price rise from November. The next cheapest supplier quoted 9 percent higher on volume but offers a delivery guarantee. Cold storage capacity is at 85 percent utilisation." },
  { id: "D3", title: "Retention and unit economics (sample)", text: "Repeat purchase rate is 38 percent at 90 days. Customer acquisition cost on quick commerce is 140 rupees against a contribution of 95 rupees per order. Offline modern trade has no acquisition cost but a 22 percent trade margin. Cold storage expansion is quoted between 35 and 48 lakh for a second room." },
  { id: "D4", title: "Team and hiring plan (sample)", text: "Team size is 31. Open roles: QA lead, regional sales manager, and a supply planner. Hiring budget for Q4 is 24 lakh. Attrition in operations over the last year was 14 percent." },
  { id: "D5", title: "Board and investor notes (sample)", text: "The lead investor candidate, Lakeshore Capital, asked for the cap table, licences and retention data. Its partners reacted well to the retention story. A term sheet is expected the first week of November. The founder prefers to keep dilution under 18 percent." },
];

export type Meeting = { id: string; when: string; title: string; who: string; context: string };

export const MEETINGS: Meeting[] = [
  { id: "m1", when: "2026-11-02 11:00", title: "Term sheet walkthrough", who: "Ananya Iyer, Lakeshore Capital", context: "Series A lead candidate. Asked for cap table and licences. Partners liked the retention story. Term sheet draft expected today." },
  { id: "m2", when: "2026-11-02 15:00", title: "Delivery plan review", who: "Sameer Joshi, Fresh Fields", context: "Supplier of 70 percent of millet. Late deliveries in four of twelve weeks. Proposed a 6 percent price rise and a second truck." },
  { id: "m3", when: "2026-11-03 10:30", title: "QuickCart launch sync", who: "Karan Shah, QuickCart", context: "Listing in 40 stores targeted for 15 November. Signed agreement was due October 28." },
];

export const HINGLISH_EXAMPLES = [
  "Kal subah Arjun ko call karna hai cold storage quotes ke baare mein, aur Friday tak Ananya ko cap table bhejna hai.",
  "Ek memo chahiye ki Fresh Fields ka 6 percent price increase accept karein ya naya supplier lein.",
  "Karan ko yaad dilana hai ki signed agreement abhi pending hai.",
];
