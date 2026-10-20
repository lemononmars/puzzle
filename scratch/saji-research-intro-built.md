# SAJI web games — goals, solutions, interactive implementation, and design analysis

**Research date:** 20 October 2026 (Asia/Bangkok). **Status:** local, unpublished research notes; contains spoilers and explicitly marked hypotheses.

**Starting catalogue:** [SAJI WORKS / web games](https://sajiqook.jp/game/). The catalogue's first-party [metadata](https://sajiqook.jp/saji_meta.json) is the coverage inventory; the crawler-readable HTML exposes only fallback cards and is not a complete game list.

## Scope and how to read this report

- Covers **all 29 enabled GAME/NAZO entries** in the catalogue snapshot, including the publicly accessible entrance to the paid-bonus **HOTEL TRACE**. A non-game external word tool and a disabled game are discussed separately at the end so neither disappears from the inventory.
- The four requested fields appear for every game: **goal; solution or a clearly labelled guess; tools used for interaction; and what is interesting about the web interface, mechanics, and twist**.
- **Confirmed in source** means the downloaded first-party frontend explicitly implements the stated behavior or answer. It does not mean a full playthrough was completed or that the production server accepted an answer. **Observed** means the public page or a normal browser session showed it. **Hypothesis / guess** is a proposed solution or interpretation, not a claim of completion. Some entries have confirmed intermediate actions but no confirmed ending.
- Public source analysis includes HTML, linked JavaScript/CSS, public game assets, and ordinary initial-page state. No downloaded game code was executed in the local terminal, no solution was obtained by brute-forcing a server, and no paid hint article or password gate was bypassed. When state/answers live in PHP endpoints, the frontend alone may not disclose the answer.
- Framework names are separated from browser APIs and game engines. A React landing page does not establish the engine of the actual playable game. An obfuscated/minified script is not, by itself, a framework. PHP URLs establish a PHP-named backend interface, not its database, hosting provider, or internal architecture.
- “Tools” identifies observable runtime libraries and the APIs used to build the interaction. The author's editor, graphics application, development process, and any AI assistance cannot reliably be inferred from shipped browser files and are not invented here.
- Each claim's nearby first-party links identify its evidence; named functions/selectors make code findings easier to relocate. Asset hashes and site content can change after this date. Interpretations of why a design works are analysis, rather than claims that the author stated that intent.

**Local-only handling:** this Markdown lives under `docs/research/`, outside `src/routes`, `src/lib/content`, and `static`. It is not added to navigation, the catalogue, or the public search index. Raw research downloads are kept under `scratch/saji-research/`; there is no publication/deployment step in this work.

## Catalogue inventory

The following inventory is generated from the enabled GAME/NAZO metadata snapshot. Detailed entries below are grouped for reading, not by difficulty or a claim that they share an engine.

| # | Game | Slug | Catalogue type |
|---:|---|---|---|
| 1 | [YOU ARE NEWTON](https://sajiqook.jp/game/youarenewton/) | `youarenewton` | GAME |
| 2 | [あめよけダッシュ！](https://sajiqook.jp/game/ameyoke/) | `ameyoke` | GAME |
| 3 | [めばかり](https://sajiqook.jp/game/mebakari/) | `mebakari` | GAME |
| 4 | [Let's aim for the goal](https://sajiqook.jp/game/laftg/) | `laftg` | NAZO |
| 5 | [日曜日の予定](https://sajiqook.jp/game/diary/) | `diary` | NAZO |
| 6 | [色々](https://sajiqook.jp/game/iroiro/) | `iroiro` | NAZO |
| 7 | [サーチテスト](https://sajiqook.jp/game/search/) | `search` | NAZO |
| 8 | [この間に](https://sajiqook.jp/game/sonokanni/) | `sonokanni` | NAZO |
| 9 | [kiritori](https://sajiqook.jp/game/kiritori/) | `kiritori` | NAZO |
| 10 | [All Light](https://sajiqook.jp/game/alight/) | `alight` | NAZO |
| 11 | [CONNECT](https://sajiqook.jp/game/tconnect/) | `tconnect` | NAZO |
| 12 | [SPOITO](https://sajiqook.jp/game/supoito/) | `supoito` | NAZO |
| 13 | [choice](https://sajiqook.jp/game/sentaku/) | `sentaku` | NAZO |
| 14 | [knock](https://sajiqook.jp/game/nock/) | `nock` | NAZO |
| 15 | [short cut](https://sajiqook.jp/game/shortc/) | `shortc` | GAME |
| 16 | [結び](https://sajiqook.jp/game/kmusubi/) | `kmusubi` | NAZO |
| 17 | [RELAY](https://sajiqook.jp/game/relayr/) | `relayr` | NAZO |
| 18 | [だるまさんが](https://sajiqook.jp/game/darumas/) | `darumas` | NAZO |
| 19 | [kasane](https://sajiqook.jp/game/kasane/) | `kasane` | NAZO |
| 20 | [魔法使いの書庫](https://sajiqook.jp/game/maglibrary/) | `maglibrary` | NAZO |
| 21 | [お化け屋敷](https://sajiqook.jp/game/obakeya/) | `obakeya` | NAZO |
| 22 | [LINK](https://sajiqook.jp/game/link/) | `link` | NAZO |
| 23 | [KEY MOMENT](https://sajiqook.jp/game/keymoment/) | `keymoment` | NAZO |
| 24 | [retest](https://sajiqook.jp/game/retest/) | `retest` | NAZO |
| 25 | [Float](https://sajiqook.jp/game/float/) | `float` | NAZO |
| 26 | [feeling](https://sajiqook.jp/game/feeling/) | `feeling` | NAZO |
| 27 | [Blind Spot](https://sajiqook.jp/game/blindspot/) | `blindspot` | NAZO |
| 28 | [記録](https://sajiqook.jp/game/kiroku/) | `kiroku` | NAZO |
| 29 | [HOTEL TRACE](https://sajiqook.jp/game/hoteltrace/) | `hoteltrace` | NAZO |

## Detailed game notes

Solutions and twists below contain spoilers. An unavailable exact answer is accompanied by an evidence-based next move or hypothesis wherever the public premise supports one; it is not silently promoted to a verified solution.

