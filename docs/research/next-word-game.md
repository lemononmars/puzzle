# Next word game: จัดคำเข้าพวก (working title)

**Researched:** 25 October 2026 (Asia/Bangkok). **Scope:** recommendation only; no implementation. Reference rules are sourced below; proposed product decisions and expected fit are judgments, not player-test findings.

## Recommendation

Build a **Thai word-grouping puzzle**: sixteen whole-word tiles hide four groups of four. Select four related words, submit the group, and reveal its explanation. Solve the full partition.

The reference mechanic is established by [NYT's official Connections help](https://thenewyorktimeshelpcenter.helpjuice.com/360011158491-New-York-Times-Games/28525912587924-Connections): sixteen words, groups of four sharing a theme, and exactly one complete solution despite overlapping apparent categories. [PuzzGrid's own guidance](https://puzzgrid.nfshost.com/about.php) explains the important editorial distinction: a word may suggest several groups, but swapping two words between groups must not produce another equally valid complete solution. PuzzGrid credits the connecting-wall round of Only Connect as its inspiration.

**Why next:** whole Thai words avoid letter segmentation and dictionary acceptance problems. The finite board makes the engine small, while selecting and excluding competing groups supplies a different puzzle activity from constructing words. The main investment is careful Thai content editing.

## Existing-game overlap

Checked the local routes/catalogue on the research date; this is not a production-deployment audit.

- [Word Pieces](../../src/routes/puzzles/wordpieces/+page.svelte) is now implemented: players assemble clue answers from fragments. This proposal instead classifies complete words; it has no ordered assembly or clue selected in advance.
- [Hidden Link](../../src/routes/puzzles/hiddenlink/+page.svelte) already asks for a common connection among four provided words. The theme is related, so present this honestly as a related addition. Its distinct challenge is **discovering which four belong together among sixteen**, then resolving the entire board consistently. Hidden Link supplies the quartet already; it does not expose a sixteen-tile partition board.
- [Crossroad](../../src/routes/puzzles/crossroad/+page.svelte) finds a connecting word for prefix/suffix clues; [Word Ladder](../../src/routes/puzzles/wordladder/+page.svelte) transforms words along a graph. Boggle, Spelling Bee, Blanks, Missing Vowels, Cryptogram, and Alphabet also cover word generation/recovery rather than partitioning. [Local catalogue](../../src/lib/data/catalog.json).

## Original beginner example

Show these sixteen tiles shuffled, with category names hidden:

| เชียงใหม่ | ตะหลิว | เย็น | ผึ้ง |
|---|---|---|---|
| กระทะ | ภูเก็ต | จิ้งหรีด | ร้าย |
| มด | กว้าง | เขียง | ชลบุรี |
| ดี | ยุง | ขอนแก่น | ครก |

Intended solution:

| Group explanation | Four tiles |
|---|---|
| จังหวัดของไทย | เชียงใหม่, ภูเก็ต, ชลบุรี, ขอนแก่น |
| อุปกรณ์ทำอาหาร | ตะหลิว, กระทะ, เขียง, ครก |
| แมลง | มด, ผึ้ง, จิ้งหรีด, ยุง |
| เติมหลัง “ใจ” ได้คำบอกลักษณะนิสัย | ดี, เย็น, ร้าย, กว้าง → ใจดี, ใจเย็น, ใจร้าย, ใจกว้าง |

This is an original teaching example, intentionally easy and not a validated release puzzle. Every tile appears once. Later boards should mix concrete categories and Thai wordplay, with restrained red herrings. A second Thai editor must check complete-board ambiguity; a stored answer key cannot prove semantic uniqueness.

## Proposed MVP

1. **Content:** one tutorial and five reviewed boards in a small archive, stored as sixteen stable word IDs plus four group definitions and explanations. Do not promise a daily release until content-writing capacity is known.
2. **Play:** tap or keyboard-select four tiles, submit, clear selection, shuffle, and reveal. Correct groups move to labeled solved rows. Wrong submissions keep the board intact and show neutral feedback; repeated identical submissions do not increase the error count.
3. **Finish:** untimed, unlimited attempts, with mistakes recorded rather than a failure cutoff. These are our proposed choices, not NYT rules. Offer a category hint and full reveal; mark assisted completion separately. Avoid “one away” feedback initially because it can encourage brute-force guessing and adds little to the first usability test.
4. **State:** local progress by puzzle ID/content version; save solved group IDs, mistake sets, and hints. Reuse the current project progress system where appropriate. No accounts, multiplayer, leaderboard, generated boards, or typed category answers in the MVP.
5. **Checks:** each word ID occurs exactly once across groups; each group contains exactly four distinct IDs; unordered selection validation; duplicate-guess handling; restore/reset; keyboard-only completion. Maintain focus after a correct group or shuffle. Text and labels must communicate state alongside color.
6. **UI:** follow [Botanical Playroom](../design-system.md), repository Svelte and compact-header skills, generous Thai line height, and responsive whole-word buttons. Any new animation must consult the required motion reference and respect reduced motion.

Not asking players to type the group name deliberately limits synonym rejection. PuzzGrid's first-party help documents that typed-link acceptance depends on the setter anticipating player wording; selection plus automatic explanation avoids this particular issue. [PuzzGrid help](https://puzzgrid.nfshost.com/about.php).

## Two alternatives

| Alternative | Primary-source mechanic | Why second choice here |
|---|---|---|
| Swap-letter word grid, inspired by Waffle | Rearrange letters to solve horizontal/vertical words, with position feedback and limited swaps. [Official Waffle instructions](https://www.wafflegame.net/) | Distinct spatial word puzzle, but Thai tile-unit definitions, interlocking words, repeated-letter feedback, and puzzle construction are a larger validation task. English-first is a more direct fit, with a smaller Thai-language benefit. |
| Letter-chain coverage, inspired by Letter Boxed | Form words from letters on square sides; successive words share an ending/starting letter. [Researchers' formal treatment, FUN 2026](https://drops.dagstuhl.de/storage/00lipics/lipics-vol366-fun2026/LIPIcs.FUN.2026.2/LIPIcs.FUN.2026.2.pdf) | Requires accepted-word policy and Thai unit decisions; chain play also sits closer to existing Word Ladder. The source here is original research, not publisher help. |

## Risks and decision test

**Editorial ambiguity is the main risk.** Require two independent Thai solvers to explain every intended group and actively find alternative complete partitions. Use everyday vocabulary before obscure trivia or accent-dependent wordplay. English boards can use the same engine later but need separate authorship; translating a Thai board does not preserve its relationships.

Playtest the tutorial and two boards with 5–8 Thai readers. Proposed decision criteria: most understand selection/submission without coaching, finish a beginner board in roughly 3–8 minutes, and consider category explanations fair. Record completion time, hint use, disputed groups, and desire to play a second board. These are proposed checks, not measured performance claims.

Use an original name, authored Thai sets/explanations, and original artwork. Sources establish inspiration and behavior; this research does not establish permission to copy publisher puzzles, branding, or assets.

**Decision:** prototype the sixteen-word partition board next. It has the strongest combination of Thai fit, finite content, and a clearly different interaction from the recently added Word Pieces.
