---
id: appendix-b
index: 20
title: "Appendix B — Thirty Practical AI Use Cases for Skeptics"
status: draft
format: markdown
---
# Appendix B — Thirty Practical AI Use Cases for Skeptics

The main text named six buckets—**learn, plan, draft, code, admin, research**—and refused to sell a prompt list as a book. This appendix expands the buckets into **thirty workflows** you can inspect, adapt, or reject.

Each entry follows the same skeleton:

- **Inputs** — what you feed the system
- **Model class** — hosted chat, local open-weight, or speech/vision assistive stack (pick what matches your privacy and cost bar)
- **Verification** — the step that separates leverage from lottery
- **Harm if wrong** — low / medium / high (high always means licensed human review, not "try again")

**Ordinary** includes disabled people running load-bearing access pipelines. Several entries below are written for that reality—not as inspiration, but as design.

No entry below replaces a clinician, lawyer, accountant, engineer, or food-safety sign-off.

---

## Learn (1–5)

These five workflows help you **read primary material faster** without treating the model as the primary.

**1. Extension bulletin glossary**
- *Inputs:* PDF soil bulletin; list of terms you do not know
- *Model class:* hosted or local text model
- *Verification:* open the PDF; check every definition against the primary text
- *Harm if wrong:* medium (bad agronomy decisions downstream)

**2. Equipment manual triage**
- *Inputs:* scanner PDF of a used tractor manual; your symptom list
- *Model class:* hosted or local
- *Verification:* locate the cited page in the manual; confirm part numbers before ordering
- *Harm if wrong:* medium

**3. Codebase orientation for a volunteer**
- *Inputs:* repo README + one module; newcomer questions
- *Model class:* hosted or local
- *Verification:* senior maintainer reads answers; newcomer follows links and flags hallucinated paths
- *Harm if wrong:* low for reading; medium if they commit code on faith

**4. Second-language study prompts**
- *Inputs:* chapter text you are assigned; target language
- *Model class:* hosted
- *Verification:* instructor or native speaker checks generated exercises
- *Harm if wrong:* low

**5. Safety training quiz draft**
- *Inputs:* your shop's actual procedures (written); job role
- *Model class:* hosted or local
- *Verification:* foreperson or safety lead rewrites anything that contradicts posted rules
- *Harm if wrong:* high—treat model output as **draft only**

---

## Plan (6–10)

Planning entries fail when they ignore **lease clauses, frost dates, and permits** the model cannot see from a prompt alone.

**6. Three-field rotation sketch**
- *Inputs:* lease constraints, equipment passes, frost dates, cover-crop goal
- *Model class:* hosted or local
- *Verification:* extension agent or experienced neighbor; soil test; lease clause check
- *Harm if wrong:* medium

**7. Market garden weekly task board**
- *Inputs:* crop list, stand hours, volunteer count
- *Model class:* hosted
- *Verification:* walk the field; delete tasks that ignore mud, frost, or equipment overlap
- *Harm if wrong:* low

**8. Small retrofit scope options**
- *Inputs:* photos + dimensions of a root cellar or cooler wall; budget band
- *Model class:* hosted
- *Verification:* licensed contractor or experienced builder before spending money
- *Harm if wrong:* high for structural work—model proposes **questions**, not approvals

**9. Event run-of-show draft**
- *Inputs:* prior year schedule; vendor constraints; accessibility needs (captioning, seating, quiet room)
- *Model class:* hosted
- *Verification:* human checks times, permits, ADA routes, and vendor contracts
- *Harm if wrong:* medium

**10. Personal budget scenario labels**
- *Inputs:* anonymized expense categories; goal from Appendix C (cash months)
- *Model class:* hosted or local **on your machine only**
- *Verification:* you reconcile against bank exports; model never sees credentials
- *Harm if wrong:* medium—still not tax advice

---

## Draft (11–15)

Drafting is where verification is most often skipped because the output **looks** finished.

**11. Co-op pickup time change email**
- *Inputs:* two prior member emails for tone; new date/time; fee rules
- *Model class:* hosted
- *Verification:* coordinator reads for wrong dates, wrong fees, accidental promises
- *Harm if wrong:* low–medium (forty families at the wrong dock)

**12. Grant narrative first pass**
- *Inputs:* funder rubric; bullet list of your project facts
- *Model class:* hosted
- *Verification:* grant writer or board member; every statistic traced to a primary source
- *Harm if wrong:* medium (reputation + deadline)

**13. Zoning comment letter draft**
- *Inputs:* your stake; ordinance section headings; hearing date
- *Model class:* hosted or local
- *Verification:* read the statute sections yourself; lawyer if property rights are at stake
- *Harm if wrong:* high for legal outcomes—drafting aid only

**14. Job posting plain language**
- *Inputs:* role tasks; wage band; physical requirements stated honestly
- *Model class:* hosted
- *Verification:* HR or owner checks for discriminatory phrasing and wrong wage statements
- *Harm if wrong:* medium–high

**15. Meeting notes to action items**
- *Inputs:* audio transcript or rough notes
- *Model class:* hosted or speech-to-text + text model
- *Verification:* chair approves action list; assignees confirm they accept the task
- *Harm if wrong:* low–medium

---

## Code (16–20)

Codegen saves keystrokes; it does not save **review** when money or safety moves through the diff.

**16. CSV ledger parser**
- *Inputs:* sample export from co-op software; expected columns
- *Model class:* hosted codegen
- *Verification:* unit tests; empty file + duplicate row edge cases; human reads diff
- *Harm if wrong:* medium (wrong payouts)

**17. API client scaffold**
- *Inputs:* OpenAPI snippet; auth method
- *Model class:* hosted codegen
- *Verification:* replay one request in curl with headers you typed
- *Harm if wrong:* medium

**18. Rename columns for portal upload**
- *Inputs:* spreadsheet headers; portal template
- *Model class:* local script assist
- *Verification:* portal accepts file; spot-check five rows
- *Harm if wrong:* low–medium

**19. Terraform/module stub for homelab**
- *Inputs:* desired services; network diagram in prose
- *Model class:* hosted or local
- *Verification:* `plan` before `apply`; senior reviewer if production
- *Harm if wrong:* high if exposed to internet—lab only without review

**20. Test fixtures from examples**
- *Inputs:* three real anonymized records
- *Model class:* hosted codegen
- *Verification:* tests fail on intentionally broken input you add
- *Harm if wrong:* medium

---

## Admin (21–25)

Admin tasks look low-stakes until a **missed renewal date** or a wrong fee line hits.

**21. Invoice pile sorted by due date**
- *Inputs:* scanned envelopes or PDF folder
- *Model class:* hosted vision or text
- *Verification:* cross-check every date against the PDF in the pile
- *Harm if wrong:* medium (late fees)

**22. License renewal calendar**
- *Inputs:* list of business, vehicle, and pesticide/applicator licenses
- *Model class:* hosted
- *Verification:* pull each renewal from the issuing agency website
- *Harm if wrong:* medium–high

**23. Travel reimbursement line items**
- *Inputs:* receipt photos; employer policy excerpt
- *Model class:* hosted
- *Verification:* finance clerk; policy PDF open beside the draft
- *Harm if wrong:* medium

**24. Inbound email routing labels**
- *Inputs:* sample inbox export (redacted)
- *Model class:* hosted
- *Verification:* you review a week of false positives/negatives before automating
- *Harm if wrong:* low–medium

**25. Plain-language summary of a vendor contract**
- *Inputs:* contract PDF
- *Model class:* hosted **only if confidentiality allows**
- *Verification:* read termination, auto-renew, liability, and data clauses in the original; lawyer for high stakes
- *Harm if wrong:* high

---

## Research (26–30)

Research entries carry the highest integrity bar: **open the source** or do not cite it.

**26. Statute section map**
- *Inputs:* bill number or municipal code URL; your question in one sentence
- *Model class:* hosted with citation links
- *Verification:* click every cited section; headings must match
- *Harm if wrong:* high for compliance decisions

**27. Supplier comparison table**
- *Inputs:* spec sheets you provide; weighted criteria you define
- *Model class:* hosted
- *Verification:* call one supplier; confirm lead time and price on the phone
- *Harm if wrong:* medium

**28. Literature scan for a thesis paragraph**
- *Inputs:* three known good papers; research question
- *Model class:* hosted
- *Verification:* read abstracts in the primary database; never cite what you have not opened
- *Harm if wrong:* medium (academic integrity)

**29. Weather/climate dataset orientation**
- *Inputs:* NOAA or extension dataset landing page; your county
- *Model class:* hosted
- *Verification:* download the file; plot one series yourself
- *Harm if wrong:* medium

**30. Assistive stack evaluation checklist**
- *Inputs:* your access needs; three candidate tools' privacy policies and export terms
- *Model class:* hosted for comparison prose; **decision stays human**
- *Verification:* trial week with real tasks; disabled user or occupational therapist input when available
- *Harm if wrong:* high—participation tools are load-bearing

---

## How to adopt one use case without adopting thirty

Pick **one bucket**. Pick **one recurring task**. Run it for a week with logging (minutes before, minutes after, errors caught). If verification eats the savings, redesign. If the vendor changes terms, re-run Appendix A.

The list will age. The design pattern will not: **model proposes, human disposes, archive proves what shipped.**

---

*Workflow appendix; no ROI statistics. NIST AI RMF if cross-referencing governance: https://www.nist.gov/itl/ai-risk-management-framework. Re-verify vendor names, model classes, and policy URLs at publication. Not medical, legal, tax, engineering, or food-safety advice.*
