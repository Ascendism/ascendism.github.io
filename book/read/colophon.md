---
id: colophon
index: 23
title: "Colophon"
status: draft
format: markdown
---
# Colophon

## Assisted drafting

This manuscript was written in collaboration with AI tools used as drafting and revision assistants—not as authors of record.

**Human role:** thesis, architecture (`spine.md`), research direction, fact boundaries, personal and biographical material (where present), voice calibration, accept/reject on every section, citation lock decisions at publication.

**AI role:** prose generation and multi-pass revision against `voice_calibration.md`, `revision_workflow.md`, and chapter research companions in `src_material/research/`. No biographical specifics were invented without guide input.

**Calendar span:** drafting assistance in active use from **2025 through 2026** (lock exact start/end dates before print).

**Tools in loop (representative):** Cursor IDE agents; model classes change with vendor releases—list the models and versions you used in the final publication pass if your distributor requires tool disclosure.

**Reader takeaway:** If this book argues that tools inherit incentives, its own production is a case study. The argument stands or falls on what the human kept, cut, and verified—not on whether a model typed the first draft.

## Production

- **Manuscript format:** Markdown (`BOOK/manuscript/`)
- **Build order:** `book_order.json`
- **Public web draft:** `scripts/build-book-site.ps1` → `docs/book/read/`
- **Print/ebook pipeline:** `production_plan.md` (pandoc; not yet automated in CI)

## Typeface note (print)

[ TBD — specify serif body and sans/mono code fonts when interior PDF is designed. Public web reader: Instrument Serif (body) and JetBrains Mono (code) in `docs/book/book.css`. ]
