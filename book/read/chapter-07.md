---
id: chapter-07
index: 12
title: "Chapter 7 — What AI Actually Is"
status: draft
format: markdown
---
# Chapter 7 — What AI Actually Is

The word "AI" on a product page is not a specification. It is a mood board.

Sometimes it means a rules engine someone relabeled last quarter. Sometimes it means a frontier model behind an API. Sometimes it means a speech pipeline that has been shipping for a decade and only recently got called intelligence because the marketing budget moved. If you cannot separate those shapes, every argument about the thing collapses into the wrong fight.

One running example carries through the next chapters on failure and use: the model predicts the next token—the next word-piece in a sequence—given everything before it.

---

Start with definitions that can survive a permit hearing.

The U.S. National Institute of Standards and Technology maintains glossary entries and an AI Risk Management Framework aimed at organizations, not hype merchants. Their materials distinguish artificial intelligence as engineered systems that generate outputs such as predictions or recommendations from inputs, and machine learning as a subset where behavior is learned from data rather than hand-coded rule by rule. Read the CSRC glossary entries and the framework hub at publication time; the wording shifts slightly as documents revise, and you want the primary text, not a blog paraphrase.

European law adds a third layer. The EU AI Act defines an AI system for regulatory purposes—a definition that does not match every vendor slide. Colloquial "AI," NIST-style engineering language, and EU legal categories can all be true in their own rooms. Confusing them is how a county board ends up debating a chatbot as if it were the same object as a decades-old adaptive controller in a combine.

Model is not system. A model is weights and architecture: the pattern-matching core. A system is the model plus data pipelines, hosting, user interface, logging, billing, policy filters, and the humans on call when it fails. Model cards and system cards—when vendors publish them honestly—are where you read intended use, training data boundaries, and known failure modes. When they are missing, that absence is also data.

---

Hold the running example in your hand.

You type: "The creek rose after the storm, so the farmer moved the stock to higher"

A large language model does not "know" creeks, storms, or cattle in the way a person who has mucked a paddock knows them. It assigns probabilities to candidate continuations. "ground" might rank high. "ground and checked the fence" might rank higher if the training corpus linked those phrases often. It does not consult reality. It consults statistics of text—and, in multimodal systems, statistics of paired images, audio, or other inputs encoded into the same machinery.

That is not an insult. It is the job description.

Training is the expensive phase: expose the model to enormous corpora—web text, books, licensed bundles, sometimes user content if terms allow—and adjust internal parameters so prediction error drops. Inference is the cheap-to-you, costly-to-someone phase: run the trained model on a new prompt and read off outputs. The electricity bill, the vendor lock-in, and the privacy exposure mostly sit in who hosts inference and what they log, not in whether the math is mystical.

Outputs are stochastic: the same prompt can yield different answers if the sampler draws differently. That is why "deterministic software" instincts mislead here. You are not filing a bug when a paragraph shifts on rerun. You are observing the design—unless the product falsely promises repeatability it does not deliver.

Illustrated transformer walkthroughs and visual neural-network series are useful for intuition. Treat them like a good machinist's chalk talk, not a peer-reviewed result. When this book cites mechanism, it cites glossaries, framework documents, and primary papers—not a YouTube thumbnail.

---

The limits matter as much as the capability.

Bender and colleagues' "stochastic parrots" framing (ACM, 2021) is often caricatured as "AI can never think." The careful claim is narrower: models trained to mimic text distributions are not, by that training alone, guaranteed to ground claims in the world. They can produce fluent falsehoods—hallucinations in the vendor euphemism—because plausibility in language and truth in fact are different tests.

Emergence—sudden jumps in capability at scale—belongs in the chapter only with measurement attached. If a later paper deflates a headline about magic thresholds, believe the measurement. The book does not need the model to be demonic or divine. It needs you to know what failure mode you are buying.

When someone says the model "understands," ask what task would falsify that. Can it cite a source that exists? Can it run your spreadsheet on your machine without sending the file to a stranger's GPU? Can it refuse a harmful instruction because of policy, because of weights, or because a filter regex caught a keyword? Those are different mechanisms. They deserve different scrutiny.

---

Where the mechanism already lives is not a slide deck from last month.

Many disabled people already depend on assistive pipelines the panic chapter named—not a slide deck from last month. Precursors existed before the current marketing wave; the label moved. WHO assistive-technology materials and national assistive-technology programs frame these as participation infrastructure, not party tricks.

The same next-token engine that drafts marketing copy can sit behind a caption track someone needs for a job interview. The math does not care. The system design cares: who hosts the audio, what the retention policy says, what happens when the vendor deprecates the API, whether offline fallback exists. If you do not know what the system is, you cannot judge whether your fight is aimed at the right layer.

Disability-led accounts and AT policy primaries beat vendor hero stories.

---

Some readers reach for creature metaphors or theological ones. Name the parallel and return to design.

Modern models are biomimicry at the engineering layer: attention mechanisms inspired by neuroscience literature, training targets built from human-generated text and labels, optimization shaped by human preferences in fine-tuning passes. That is mimicry of patterns humans already made visible, not a claim that silicon has a soul or that a data center has standing in court.

If you use *imago Dei* language—humans bearing the image of God—the honest parallel in the machine case is second-order reflection: systems trained on human speech about the world, not the world itself. The design question that follows is older than GPUs: does this artifact serve the person, substitute for relationship and skill in a way that harms them, or become an idol that must be obeyed? You do not need global survey statistics on belief to ask that. You need to name which role a product plays on your farm, in your shop, or at your kitchen table.

Return to the running example. The farmer sentence is not about theology. It is about whether you treat the continuation as authoritative fact or as draft text that still owes you a walk to the fence line.

---

This book largely avoids the term AGI—artificial general intelligence—not because the conversation is forbidden, but because it functions as a fundraising fog machine. It bundles every unresolved safety worry into one acronym and invites you to pick a tribe before you have named the system on your desk. You can have strong views about long-horizon risk and still insist on plain language for the tools shipping this year: recommender, classifier, chat completion server, fine-tuned adapter, on-device whisper model.

What you have today is narrow, high-volume pattern completion wrapped in platforms that monetize attention and data. That is enough to reorganize work, access, and power while the acronym debate continues on podcasts.

---

The next chapter stops explaining and starts answering: hallucination rates, copyright fights, training ethics, energy, deskilling, export controls—and, for assistive stacks, honest upside paired with vendor risk, without using disabled people as a shield against critique.

Pick a tool you actually use. Is it a model or a system? Where does inference run? What happens to the prompt if you cancel the subscription? Write the answers down. Hype cannot survive a filled-in form.

---

*Sources to verify at publication: NIST AI RMF hub (https://www.nist.gov/itl/ai-risk-management-framework); NIST CSRC glossary — artificial intelligence (https://csrc.nist.gov/glossary/term/artificial_intelligence), machine learning (https://csrc.nist.gov/glossary/term/machine_learning); EU AI Act and Commission guidelines (https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai); Bender et al. 2021, "On the Dangers of Stochastic Parrots" (https://doi.org/10.1145/3442188.3445922); WHO assistive technology (https://www.who.int/health-topics/assistive-technology); national AT program pages as cited; model/system card examples from vendors you name. Popular explainers (e.g. Alammar illustrated transformer, https://jalammar.github.io/illustrated-transformer/) for intuition only—not evidentiary. Not legal, medical, or engineering advice.*
