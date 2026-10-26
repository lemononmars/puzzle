# New word game recommendation: คำต่อชิ้น (working title)

**Research date:** 24 October 2026 (Asia/Bangkok). **Status:** recommendation only; no game implemented or published. External mechanics below are sourced; product choices, effort assessments, and predicted audience fit are proposals, not measured findings.

## Recommendation

Add a Thai-first **word-fragment assembly puzzle**: read five clues, combine a shared bank of word chunks to answer them, and use each physical tile once. Working title: **คำต่อชิ้น**. Start with a small authored archive, rather than promising a fresh daily puzzle immediately.

The reference is **7 Little Words**. Its official game teaches players to combine tiles to match clues, solve in any order, and use letter counts; its syndicator's sample states that every letter combination is required and can be used only once. This establishes the reference mechanic, not evidence that a Thai version will be popular. [Official playable instructions](https://7littlewords.com/7lw), [Andrews McMeel syndication sample](https://syndication.andrewsmcmeel.com/wp-content/uploads/2026/03/Broadsheet-Puzzles_P2.pdf).

Our proposed differences are five clues, Thai chunks curated by an editor, **chunk counts instead of letter counts**, an untimed session, and a gentle hint ladder. The distinctive interaction is constructing answers from a shrinking common resource: solving one clue makes the others easier. This offers a different activity from typing dictionary words or uncovering missing letters.

## Fit with the current website

The checked local catalogue and routes already cover substantial word-game territory. These observations concern local source, not a verified production deployment:

| Existing game | Existing activity | Difference offered by this proposal |
|---|---|---|
| [Blanks](../../src/routes/puzzles/blanks/+page.svelte) | Thai dictionary game with normal, timed, and endless modes | Several authored clue answers compete for one finite tile bank |
| [Spelling Bee](../../src/routes/puzzles/spellingbee/+page.svelte), [Boggle](../../src/routes/puzzles/boggle/+page.svelte) | Word-finding games | A small explicit finish condition, without requiring an exhaustive accepted-word list |
| [Word Ladder](../../src/routes/puzzles/wordladder/+page.svelte) | Transform words through legal neighboring words; daily/random setup and path hints | Assemble chunks rather than walk a word graph |
| [Crossroad](../../src/routes/puzzles/crossroad/+page.svelte) | Supply a central word to combine with prefix/suffix clues | Multiple complete answers consume separate tiles, rather than one answer joining four directions |
| [Hidden Link](../../src/routes/puzzles/hiddenlink/+page.svelte) | Find a connection across four provided words | Build answers from fragments rather than name a shared association |
| [Missing Vowels](../../src/routes/puzzles/missingvowels/+page.svelte), [Cryptogram](../../src/routes/puzzles/cryptogram/+page.svelte), [Alphabet](../../src/routes/puzzles/alphabet/+page.svelte) | Recover words from partial letters, substitution, or clues | Visible movable word pieces and deduction across answers |
| [Thai Language](../../src/routes/puzzles/thai-language/+page.svelte), [Nazo](../../src/routes/puzzles/nazo/+page.svelte) | Sequential language puzzle/checker and authored puzzle gallery | A compact standalone board with directly manipulable pieces |

Four Lines concerns spatial deduction rather than vocabulary. `seventh` appears in retirement guards/tests, not as an active route in this checkout, so it was not treated as a current new-game slot. Supporting local evidence: [catalogue descriptions](../../src/lib/data/metadata.ts), [retired puzzle checks](../../src/lib/retiredPuzzles.test.ts).

This is still a clue-solving game, so it shares content-writing work with Alphabet and Crosswords. Its strongest novelty for this site is the **shared, consumable chunk bank**, not the fact that it uses clues.

## Concrete original teaching puzzle

This example is newly drafted for this recommendation, not taken from the reference game. Each answer uses exactly two tiles. Repeated text represents separate physical tiles, marked here with IDs for auditing; the UI need not show those IDs.

**Shuffled bank:** `น้ำ[A]`, `ดี`, `ดอก[A]`, `แม่`, `เบี้ย`, `ใจ`, `ไม้`, `ปลา`, `ดอก[B]`, `น้ำ[B]`.

| Clue | Answer | Tile consumption |
|---|---|---|
| ส่วนของพืชที่มักมีกลีบและสีสวย | ดอกไม้ | ดอก[A] + ไม้ |
| เงินที่ได้รับเพิ่มจากการฝากเงิน | ดอกเบี้ย | ดอก[B] + เบี้ย |
| ลำน้ำสายใหญ่ที่ไหลลงสู่ทะเลหรือแหล่งน้ำอื่น | แม่น้ำ | แม่ + น้ำ[A] |
| เครื่องปรุงรสเค็มที่ทำจากปลา | น้ำปลา | น้ำ[B] + ปลา |
| มีเมตตาและชอบช่วยเหลือผู้อื่น | ใจดี | ใจ + ดี |

All ten tiles are consumed once and concatenate exactly to the five displayed answers. Swapping the identical น้ำ or ดอก tile IDs must also be accepted. This is deliberately an easy tutorial; it does not establish the desired difficulty of later puzzles. Thai editorial review and user testing remain necessary.

**Player loop:** select a clue → tap chunks in order → submit → correct chunks move into that clue's solved row → continue with the smaller bank. Wrong attempts return the pieces without a life penalty. Let players undo the current assembly, change clues, shuffle only the bank, and request a hint. Solved rows remain visible.

## Thai and English design decisions

Prefer **human-authored whole-word, compound-part, or readable syllable chunks** for Thai. Never derive tiles with `split('')`, split a combining mark from its base, or assume Unicode grapheme boundaries define meaningful puzzle syllables. W3C explicitly treats Thai shaping, segmentation, and selection as distinct layout concerns; its current Thai resources are a draft reference, not a guarantee of browser behavior. [W3C Thai Script Resources](https://www.w3.org/TR/thai-lreq/).

The repository already has [Thai text utilities](../../src/lib/utils/thai-text.ts), including project-specific character grouping/counting. Inspect and test them before reuse; their presence alone does not make automated chunking linguistically correct. For the MVP, store the chunk text explicitly and show “2 ชิ้น” rather than an ambiguous Thai character count.

English can use the same assembly engine with separately written clues and chunks. Do not translate an existing Thai board mechanically: its shared fragments and difficulty will generally change. A separate English pack is a later option, not a bilingual launch requirement. Fixed authored answers also avoid the large dictionary-policy surface of an English open-vocabulary game.

## Alternatives considered

| Candidate | Verified reference mechanic | Assessment for this website |
|---|---|---|
| Word-fragment assembly | Clues answered with shared letter-group tiles, each used once | **First choice:** clear finish, Thai-friendly authored chunks, small validation surface |
| Category grouping | Connections presents 16 words to organize into four groups sharing something | Strong Thai fit through whole-word tiles, but association solving overlaps Hidden Link and requires careful ambiguity testing. [NYT official help](https://thenewyorktimeshelpcenter.helpjuice.com/360011158491-New-York-Times-Games/28525912587924-Connections) |
| Letter-chain coverage | Letter Boxed places letters on square sides and chains words through matching ending/starting letters | Attractive optimization puzzle, but dictionary coverage and Thai unit definitions introduce more risk; Word Ladder already supplies a chain-oriented word experience. This mechanic description is supported by the researchers' own formal treatment, rather than a publisher instruction page. [FUN 2026 paper](https://drops.dagstuhl.de/storage/00lipics/lipics-vol366-fun2026/LIPIcs.FUN.2026.2/LIPIcs.FUN.2026.2.pdf) |

These are product-fit judgments, not market research. No audience analytics, competitor retention data, or player interviews were available for this research.

## MVP boundary and implementation shape

1. **Content:** one tutorial plus ten authored Thai boards, each with five clues and roughly 10–15 tiles. Include answer, ordered chunk strings, explanation, difficulty, puzzle ID, and content version. Use a variable number of chunks per answer after the tutorial.
2. **Interaction:** click/tap buttons; keyboard focus and Enter/Space activation; undo, clear, shuffle, hint, and reveal. Avoid making drag gestures necessary. Provide text status feedback and visible focus, and distinguish selected/used states with labels or position as well as color.
3. **Validation:** accept any unused tile sequence whose joined text equals the selected clue's answer. Use stable tile IDs for state and duplicate text as a multiset for validation. Reject duplicate consumption. A wrong attempt must not mutate solved state. Editorial tools should check that the authored solution consumes the complete bank exactly once.
4. **Hints:** first reveal an extra semantic clue, then one required chunk; full reveal marks the board assisted. Record hint count rather than punish wrong experiments. Distinguish an assisted solve in spoiler-free share text.
5. **Progress:** local save per puzzle ID/content version, with completion and hint count; archive picker and replay. Check the current [progress module](../../src/lib/progress/local.ts) before deciding how to integrate. No login, leaderboard, multiplayer, or daily generator in this first release.
6. **Presentation:** follow [Botanical Playroom](../design-system.md): compact heading, semantic surfaces/content colors, Noto Serif Thai puzzle tiles, and a responsive board. Consult the repository's Svelte/compact-header skills during implementation. Any newly designed movement must first consult the [required motion reference](https://motion-reference.takayustudio.jp/) and respect reduced motion; animation is not necessary to validate this concept.

The board engine should be comparatively small; good clue writing, fair chunk choices, and ambiguity review are the main recurring work. No time estimate is asserted without an implementation spike.

## Validation before committing to regular releases

- **Editorial fairness:** have a second Thai reader solve every board without the answer sheet. Record plausible synonyms and alternative chunk partitions; rewrite ambiguous clues or explicitly accept tested equivalents. Repeated identical tiles must not create false rejection.
- **Mechanical checks:** verify each answer concatenates exactly; each tile is consumed once across the authored solution; multiple clue orders remain solvable; restoring a saved board preserves available tiles. Test a duplicate-fragment fixture explicitly.
- **Small playtest:** give the tutorial and three boards to 5–8 Thai readers, with a mix of frequent and occasional puzzle players. Proposed pass criteria: at least 4/5 understand the rules without coaching, median board time roughly 3–7 minutes, and no repeat complaint that a reasonable answer is rejected. These are decision thresholds, not observed results or statistically representative estimates.
- **Content sustainability:** write the first ten boards before promising a daily schedule. Record authoring/review time per board. If chunks make every clue obvious, introduce mixed two/three-piece answers before harder vocabulary.
- **Access and layout:** test keyboard-only completion, touch on narrow screens, Thai mark clipping, zoom, screen-reader status, and reduced motion. Avoid rearranging focus when shuffling or solving.
- **Rights and provenance:** write original names, clues, puzzle sets, artwork, and explanations; record inspiration and dataset provenance. This research does not establish permission to copy publisher content, branding, or assets, nor make a legal conclusion about game mechanics.

**Decision:** validate คำต่อชิ้น with three playable authored boards before adding daily scheduling or a larger content pipeline. Its finite answers and explicit Thai chunks make it a practical next word-game experiment while adding a distinct interaction to this catalogue.
