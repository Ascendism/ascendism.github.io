---
id: chapter-10
index: 15
title: "Chapter 10 — Why This Era Is Temporary"
status: draft
format: markdown
---
# Chapter 10 — Why This Era Is Temporary

You have seen what ordinary people can build while access stays cheap enough to test. This chapter asks the harder follow-up: what closes the window—and why temporary is not prophecy.

Temporary is not a countdown to doom. It is a description of pressure: law that adds compliance cost, export rules that choke compute supply, pricing that moves faster than your budget, terms of service that rewrite what you may do with a model you thought you owned, and concentration that makes one vendor's outage your week's emergency. The era of hosted frontier inference and periodic open-weight releases feels open because you are living inside it. That feeling is accurate. It is not a guarantee.

---

The EU AI Act is a calendar, not a mood.

European product-safety law for AI now has dates you can mark on a wall calendar—verify every date against the European Commission's regulatory framework page and the AI Act Service Desk timeline before you print, because Digital Omnibus negotiations and simplification packages can shift high-risk timing without changing the core point: obligations arrive on a schedule.

As of the Commission's published implementation timeline (re-read at publication): prohibited practices and AI literacy provisions under the general framework took effect 2 February 2025; governance for general-purpose AI models, national authority structures, penalty frameworks, and EU-level bodies begin to bite for GPAI providers on 2 August 2025; the bulk of remaining rules, including transparency obligations under Article 50 and many Annex III high-risk categories on the non-embedded path, land on 2 August 2026; high-risk AI embedded inside regulated products tied to Annex II sectors follows on 2 August 2027.

The regulation text lives on EUR-Lex (CELEX:32024R1689). Read the primary text when you need a precise category definition—not a thread that conflates "chatbot" with "safety component in a medical device."

What this means for an ordinary builder is not "Brussels banned thinking." Most systems the Commission describes publicly sit in minimal-risk buckets. The honest read is procurement friction: a clinic, school, co-op, or municipal office that waited for a trusted compliance path may finally adopt tools they avoided when the liability was vague. A solo operator shipping a fine-tuned model into the EU without reading Annex III may discover they are building documentation they did not budget for. Both outcomes can be true in the same year.

Bruegel's analysis of the Act as "premature or precocious" regulation is worth pairing with the Commission overview—not as a verdict, but as a reminder that implementation risk is its own variable. Rules on paper and rules in a working procurement department are different objects.

---

US export controls treat advanced compute as a choke point.

The Bureau of Industry and Security publishes advanced computing and semiconductor rules through Federal Register notices and agency guidance PDFs. If you cite export posture, cite BIS primary materials for the date you print—not a podcast summary of "what China can't buy."

The steelman is not cynical cover for monopoly. Advanced compute controls are defended as slowing diversion of chips and model weights into military, surveillance, and proliferation-relevant stacks. Paired domestic fab policy—CHIPS-class investment narratives—often frames the same decade as "paying for resilience" rather than only starving rivals. Think-tank analysis such as CSIS work on updated export controls belongs in your notes alongside the agency rule, labeled as interpretation.

For a builder outside the Fortune 500, the practical effect is supply-side: fewer GPUs in the secondary market at prices you could stomach, longer lead times on clusters, licensing uncertainty for weights hosted across borders, and a research landscape where where the model runs becomes a legal question—not only a latency question. That is pressure on the window. It is not proof the window is already shut for everyone everywhere. It is proof the window has politics welded to the hinges.

---

Cloud concentration is an enclosure you can measure.

Most ordinary leverage runs on rented metal whose price, terms, and feature set change on someone else's roadmap.

Cloud pricing pages have histories. If you claim inference "used to be cheaper," archive.org snapshots of provider pricing tables are your friend—not a screenshot from a forum. API deprecation posts on OpenAI, Anthropic, Google, and smaller hosts are existence proof that the model ID in your script is a lease, not a deed. Sunsets can track abuse prevention, copyright pressure, safety retrofits, or endpoints that no longer pay for themselves. One documented changelog read in good faith is enough to steelman a vendor before you imply bad faith across the board.

The counter-steelman matters: concentrated clouds sell patch velocity, physical security, compliance attestations, and global routing many small organizations cannot home-build at the same standard. Plenty of SMEs choose rent because self-hosting would be less safe—not only because they love oligopoly. That is true. It does not follow that rent is forever at today's price, or that today's acceptable terms survive the next funding round.

Terms of service are the quiet enclosure. Training opt-out defaults, logging policies, enterprise-only features, geographic restrictions, and "acceptable use" clauses that expand without a vote—these rewrite what "your stack" means while your integration deepens. Your one-week task log assumes you can rerun the pipeline next month. ToS assumes you read what changed at 2 a.m.

---

Connectivity and compute are not the same bottleneck.

ITU *Facts and Figures* reporting (verify the current edition at publication) is the sober anchor for global inequality claims: billions still offline or under-connected, regional and income gaps that no product launch erases. Use one careful paragraph here—not a deterministic "West locks the Global South out of AI forever" stack.

Mobile-first leapfrogging and regional investment complicate single-story rhetoric. The narrow claim that holds: a person with intermittent connectivity and no local GPU faces a different window than a researcher with a cluster allocation—and both may be "using AI" in a survey item that means nothing comparable. Connectivity pressure and compute pressure stack; they are not interchangeable.

If your exit ramp assumes hardware you can buy retail, name who that assumption excludes—and whether open-weight releases on modest machines change the rent equation for them, partially, sometimes, with work.

---

Steelman the goods before you steelman the squeeze.

This chapter fails if it reads like a conspiracy wall. The mechanisms above are defensible tensions: product safety, diversion control, reliability at scale, abuse prevention, proportionality fights in live legislation.

Regulation can give institutions a procurement path they trust—schools, clinics, utilities—so assistive and operational tools ship with documentation instead of shadow IT. Export controls express a real preference: fewer surprise wars driven by mass surveillance and autonomous weapons pipelines; the dispute is cost-sharing and collateral damage to researchers, not whether any line exists. Cloud rent buys uptime ordinary teams cannot replicate in a closet rack without learning hard lessons about cooling, patching, and breach response. Model sunsets sometimes retire endpoints that were being abused at scale or that courts and licensors made uneconomic—not only to extract more rent from captive integrations. Digital Omnibus and simplification lobbying are the Commission's counter to "Brussels crushed SMEs"—rules may stretch because lawmakers heard proportionality complaints. Re-pull the Service Desk FAQ when you draft; live negotiation beats frozen outrage.

Your job is not to pick a team. Your job is to design as if both halves are true: the window is useful because serious goods exist behind the rent, and the window narrows because the same structures that deliver those goods also concentrate power to change price, scope, and access.

---

None of the mechanisms above guarantees a clean before-and-after date. Markets adapt. Weights leak. Local inference improves. Policy reverses with administrations. Courts delay enforcement. A co-op runs the same pipeline on open weights while a neighbor's API bill doubles—both can be right in the same county.

What is guaranteed is asymmetry: vendors and regulators move on institutional clocks; your lease, your land, your body, and your co-op's cash flow move on different ones. The narrowing window from the introduction was never about gadget novelty expiring. It was about design literacy running out before enclosure hardens.

The next chapter turns to what you do inside the window without becoming owned—attention, loops, hygiene, and the difference between using a tool and serving a feed. Use the buckets while testing is cheap enough to log; archive what shipped; assume terms, prices, and model IDs will change; build redundancy before the changelog becomes an emergency.

The machines kept coming in every prior tool chapter. So did the price changes.

---

*Sources locked 2026-06-17: European Commission AI Act overview (https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai); AI Act Service Desk timeline (https://ai-act-service-desk.ec.europa.eu/en/ai-act/timeline/timeline-implementation-eu-ai-act — verified dates: Feb 2025, Aug 2025, Aug 2026, Aug 2027); EUR-Lex Regulation (EU) 2024/1689 (https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689); Bruegel AI Act analysis (https://www.bruegel.org/analysis/european-union-ai-act-premature-or-precocious-regulation); BIS advanced computing rules (https://www.bis.gov/); CSIS export-control analysis (https://www.csis.org/analysis/understanding-biden-administrations-updated-export-controls); ITU Facts and Figures (https://www.itu.int/itu-d/reports/statistics/facts-figures-2024); cloud provider pricing archives (https://web.archive.org/). Not legal, export-compliance, financial, or engineering advice.*
