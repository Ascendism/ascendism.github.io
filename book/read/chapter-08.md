---
id: chapter-08
index: 13
title: "Chapter 8 — Honest Objections, Honest Answers"
status: draft
format: markdown
---
# Chapter 8 — Honest Objections, Honest Answers

The prior chapter named the mechanism: next-token prediction, training versus inference, systems versus models. This chapter names the costs. Not to scare you into purity paralysis, and not to hand you a vendor brochure. The objections are real. So are the tradeoffs. Your job is to match each risk to the stakes of the task and the design of the stack you actually run.

---

"It makes things up."

True. The polite word is hallucination: fluent text that fails the fact test. Benchmark papers such as HALoGEN (ACL 2025; verify methods at publication) show rates that swing by task, model, and whether anyone measured retrieval-augmented setups honestly. A worst-case headline number is useless if your workflow is spell-checking a parish newsletter versus dosing a medication.

The running example from the last chapter still applies. The model completes "The farmer moved the stock to higher ___" with plausible language. It does not walk the field. For low-stakes drafting, you treat output as copy to verify. For high-stakes decisions, you require citations you can open, a second human, or an instrument that does not run on prose alone. FDA and similar regulators have been clarifying software-as-medical-device boundaries for years; if you touch health, read the current guidance and hire a lawyer—this book is not medical advice.

Where safety advocates and skeptics often agree: evaluations matter. Neither side wins by vibes. If a vendor cannot show task-specific error rates on work like yours, you are the evaluation.

---

"It stole everyone's work."

Partly a legal question, partly a political one. The U.S. Copyright Office maintains an AI policy hub with registration guidance and multi-part reports on training, copyrightability of outputs, and digital replicas—read the PDFs, not a thread. Active litigation such as *New York Times v. OpenAI* (track the docket, do not predict outcomes) turns on fair use, licensing markets, and harm theories courts have not finished sorting.

The honest position for a builder: training data is a design choice with downstream liability and ethics attached. Opt-out regimes, robots.txt norms, and EU text-and-data-mining rules are moving targets. If your product trains on scraped corpora, your risk profile differs from a model trained on licensed bundles with audit trails. Ordinary users inherit that risk when they use hosted tools whose terms they did not read.

---

"It burns the grid."

Also true in aggregate, easy to garble in a meme. The International Energy Agency's Energy and AI reporting is the place to anchor totals—siting and grid context sit in the infrastructure chapter. Peer life-cycle work on per-task inference is more useful than a naked terawatt-hour headline for deciding whether your job belongs on a local GPU at night or on a frontier cluster in a dry county.

Right-sizing is not denial. It is load-shaping paired with siting scrutiny.

---

"It deskills us."

Sometimes. Ethnographic work on coding assistants in software teams (search ACM for recent qualitative studies at publication) shows speed gains paired with unease about judgment atrophy—junior developers who accept suggestions they cannot debug, seniors who stop reading diffs. The pattern is older than transformers. Calculators did not end arithmetic; they moved the skill boundary. The question is which boundary you still defend on purpose.

For assistive stacks, deskilling cuts both ways. A user who depends on captioning may gain participation while a platform that sunsets the feature loses a capability they built their week around. The harm is not "used a tool." The harm is no fallback when the vendor moves.

---

"It helps disabled people, so leave it alone."

That sentence is a trap dressed as solidarity.

Many disabled people already receive real, daily function from AI-shaped tools: communication when speech is unreliable, captioning when audio is inaccessible, description when images are opaque, automation when executive function is thin. Denying that benefit to win an argument is dishonest. Pretending those tools have no risks is also dishonest.

The steelman, stated cleanly: access technologies built on the same machinery as ad-tech classifiers can be life-expanding and structurally fragile at once. Cost bars people out. Privacy policies expose intimate data. Vendor lock-in turns accommodation into rent. Wrong outputs in legal or medical contexts hurt the same users the tool was supposed to protect. Sunsetting a feature without migration path is an act of design violence even when the press release calls it innovation.

Regulation is not automatically the enemy of access. Bad regulation written without disabled stakeholders can be. Good design—offline modes, portable formats, user-held keys, redundancy—is the argument this book keeps making. Do not use disabled people as a shield against all critique. Do not use critique as an excuse to delay access improvements you could build today with open weights and local inference.

Purpose-first products still orphan their original use case when engagement metrics take over—the incentive drift pattern traced earlier.

---

"Big companies will capture it all."

The concentration chapter in this book already traced index weight and platform defaults. On safety governance, NIST's AI Risk Management Framework is voluntary in the United States; the EU AI Act layers obligations on general-purpose models and high-risk categories with timelines you must read in primary Commission materials. Neither replaces antitrust enforcement. Both admit that documentation, evals, and incident reporting are now part of the product surface.

Export controls on advanced chips and weights are real policy levers with scope that shifts by administration and ally set. If you cite them, cite the Bureau of Industry and Security notices or successor texts for the date you print—do not paraphrase a podcast about "China bans."

---

Skeptics and safety advocates disagree on pace and jurisdiction more often than they disagree on whether errors exist. Task-specific measurement beats slogan wars. Misuse scenarios deserve red-team time, not only marketing demos. Concentrated hosting creates single points of failure—for truth, for access, for uptime. Open weights and local inference are not utopia; they are risk redistribution you may want.

---

You are not required to dismiss every objection to use the tools. You are required to stop answering objections with mythology—either the myth that the tools are mind-readers or the myth that they are only scams.

Before you adopt or defend a system, write answers down: what happens when this output is wrong at your stakes; whose data trained it and under what license; where inference runs and who pays the marginal kilowatt-hour; which skill you still practice without the tool weekly; who loses function if the vendor changes terms; and whether you can exit without rebuilding from zero.

The next chapter turns from defense to offense: what ordinary people—not only institutions—can do with the window while it is open, including disabled people using adaptive stacks without flattening anyone into a poster.

---

*Sources to verify at publication: HALoGEN ACL 2025 (https://aclanthology.org/2025.acl-long.71/; arXiv:2501.08292); Copyright.gov AI hub (https://www.copyright.gov/ai/) and report parts (Part 1 digital replicas Jul 2024; Part 2 copyrightability Jan 2025; Part 3 training May 2025); FR 88 FR 16190 registration guidance (https://www.federalregister.gov/documents/2023/03/16/2023-05321); *New York Times v. OpenAI* docket as cited; IEA Energy and AI (https://www.iea.org/reports/energy-and-ai/understanding-the-energy-ai-nexus); NIST AI RMF (https://www.nist.gov/itl/ai-risk-management-framework); EU AI Act Commission texts (https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai); BIS export-control notices if cited (https://www.bis.gov); FDA software-as-medical-device guidance if health claims appear; WHO/AT program materials for access subsection; ACM qualitative studies on coding assistants if cited. Not legal, medical, financial, or engineering advice.*
