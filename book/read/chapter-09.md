---
id: chapter-09
index: 14
title: "Chapter 9 — AI as Leverage for Ordinary People"
status: draft
format: markdown
---
# Chapter 9 — AI as Leverage for Ordinary People

Objections are on the table. This chapter answers a different question: what can you actually do with the machinery while the window stays open—without pretending every user gets the same lift, and without treating a prompt cheat sheet as a book.

Ordinary is not a demographic. It is anyone who runs a life or a small operation without a procurement department: a tenant farmer reconciling invoices after market, a parish volunteer drafting a grant outline, a disabled person routing speech through a captioning stack because phone trees were never built for their body, a two-person shop that cannot hire a second analyst. Institutions buy seats in bulk. Ordinary people buy time in slices and pay the verification tax themselves.

---

The evidence is mixed on purpose.

Goldman Sachs and similar banks publish small-business AI surveys through their press rooms—search the primary PDF before you quote a headline about "fully embedded" adoption. Secondary coverage often lands near low double-digit percentages for deep integration while a larger share experiments at the edges. Treat that gap as signal: interest outruns infrastructure.

McKinsey's annual *State of AI* reports are useful for corporate adoption curves and vendor concentration. They are not a census of your neighbor's tool shed. Selection bias toward firms that already answer McKinsey surveys is part of the instrument. Cite them as large-company weather, not as proof your cousin's bakery saved forty hours last month.

Government anchors matter when you can match the question to the claim. The U.S. Small Business Administration's Office of Advocacy publishes outlook material that occasionally touches automation—read the current-year PDF, not a screenshot. The Census Bureau's Business Trends and Outlook waves sometimes add AI-adoption wording; verify the exact survey item before you paste a percentage into a talk. A number about "using AI" can mean anything from ChatGPT once to a custom model in production.

Academic randomized trials tell a sharper story and a humbler one. NBER Working Paper w33795 (*Generative AI at Work*, 2024—confirm title and authors at publication) reports field-experiment results where contact-center workers gained speed on some tasks while effects elsewhere were uneven. Less time in email is a real outcome. It is not a universal productivity fairy. MIT-linked randomized work on coding assistants (find the current economics.mit.edu draft or published version before citing) often shows gains that split by experience level: juniors move faster on boilerplate; seniors sometimes spend more time reviewing. That pattern is deskilling risk in one direction and skill-boundary management in another—pair junior speed with senior review when the task allows no silent failure.

Never blend a bank survey, a corporate consultant chart, and an RCT into one "AI adds X percent" slide. They measure different populations, different tasks, and different definitions of success.

---

Integration is the bottleneck, not curiosity.

The honest read of 2025–2026 adoption headlines is a two-tier map. A thin band embeds models into workflows with logging, evals, and fallbacks. A thick band uses hosted chat for one-off drafts and stops there. Neither band is morally superior. They are different depths of design.

If you are in the thick band, your next move is not "buy a more expensive model." Pick one recurring task—weekly market recap, parts reorder email, zoning comment letter—and build a repeatable pipeline: input template, model pass, human verification, archive of what shipped. Depth beats novelty. Vendors will keep selling you new interfaces. Your job is to refuse the churn until a measured line moves.

---

Ordinary includes access stacks—and cost bars people out.

Assistive pipelines already named in earlier chapters fit every bucket below. They are load-bearing, not demos, and they face the same enclosure risks as any hosted tool: subscription price, privacy policy, feature sunsetting, wrong outputs in high-stakes forms.

Affordability is not a footnote. A tool that saves an hour but costs a day of wages is not leverage for the person who needs it. Open-weight models on modest hardware do not solve every access need, but they change the rent equation when they work. Ordinary must include people whose "work" is participating in public life when the default interfaces were hostile.

---

Six buckets—not six magic spells.

Appendix B will expand this list. The chapter keeps one worked example per bucket plus the verification step that separates leverage from lottery.

Learn. You are studying a new irrigation scheduling method and the extension PDF is eighty pages. You use a model to generate questions and a one-page glossary of terms you do not know—not to replace the PDF. Verification: open the primary bulletin and check every definition the model gave you. If a term is wrong, the failure mode is obvious before you bet a standpipe on it.

Plan. You need a crop rotation sketch for a three-field lease with a cover-crop goal and an equipment constraint. You ask for three scenarios with explicit assumptions (days to maturity, equipment passes, frost window). Verification: run the scenarios past your soil test, your lease clauses, and—if you have one—your extension agent. The model does not know your neighbor's hog lagoon.

Draft. A food hub needs a plain-language email to members about a pickup time change. The model produces a draft in the hub's tone if you feed two prior emails. Verification: a human reads for wrong dates, wrong fees, and accidental promises. Low stakes, still worth a calendar check.

Code. A maintainer adds a script to parse CSV exports from a co-op ledger. The model proposes boilerplate; you run tests, read diffs, and keep the parts you can debug at 11 p.m. Verification: the test suite and one manual edge case you invent (empty file, duplicated row). Mixed-experience teams should pair junior speed with senior review—the RCT pattern above.

Admin. Invoices, grant deadlines, license renewals—the paperwork that eats evenings. The model sorts a pile into buckets with dates and drafts reminder language. Verification: cross-check every date against the PDF in the envelope pile. Models confuse fiscal years easily.

Research. You need to know whether a state bill still affects small slaughter facilities. The model summarizes with citations you can click. Verification: read the statute section headings yourself or pay someone licensed. Research buckets fail loudest when users skip the click.

Across buckets the design pattern is the same: model proposes, human disposes, archive proves what shipped.

---

What this chapter refuses to sell.

If you cannot tie a ROI claim to a labeled survey, a cited paper, or your own logged before/after on one task, do not put it on a slide. Prompt tricks age in weeks; design lasts a season—this is not a cheat sheet chapter. Vendor demos are cherry orchards; ask for task-specific error rates on work like yours or run your own eval. And no replacement pitch for skilled humans in high-trust roles—medicine, law, structural engineering, food safety sign-off.

---

The same Monday can include a grazing log on paper, a spreadsheet, and a local model rewriting column headers so the export matches what your co-op's portal expects. Neither identity wins. The task wins when the verification step matches the harm if the output is wrong.

A systems-first reader might ship a small RAG stack over municipal PDFs so neighbors can query zoning without reading three hundred pages. A place-first reader might use speech-to-text to draft testimony for a water board hearing after a long field day. The leverage is not the brand on the model. It is calendar returned with errors caught before they become someone else's emergency.

---

Pick one bucket. Pick one recurring task inside it. Log one week: minutes before, minutes after, one error caught in verification, one error that would have shipped without verification. That log is worth more than any third-party "productivity percent."

If the log shows no gain, you have data—not a moral failure. Maybe the task was already fast. Maybe the model added review work. Maybe you need offline inference because upload latency breaks your flow. Adjust the design; do not adjust your self-image to match marketing.

---

The next chapter steps back to clock speed: why this era of cheap hosted inference and open-weight releases is temporary—pricing, terms of service, export controls, and concentration can close the window you are using today. Use the buckets while they are cheap enough to test. Build the archive and the exit habits before the terms change.

---

*Sources to verify at publication: Goldman Sachs pressroom small-business AI survey primary PDF (https://www.goldmansachs.com/pressroom/); McKinsey State of AI (https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai); SBA Office of Advocacy (https://advocacy.sba.gov/) current outlook PDF; Census BTOS AI-adoption survey items if cited (https://www.census.gov/econdata/business-trends-and-outlook-survey); NBER w33795 (https://www.nber.org/papers/w33795); MIT/Copilot RCT papers via economics.mit.edu as cited; WHO assistive-technology materials (https://www.who.int/health-topics/assistive-technology). Not legal, medical, financial, or engineering advice.*
