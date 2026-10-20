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

## Technology overview: what is actually being used

| Layer | Evidence in this catalogue | What that means for recreating an interaction |
|---|---|---|
| Custom HTML/CSS/JavaScript | Native text selection/clipboard in [Search](https://sajiqook.jp/game/search/) and [Kiritori](https://sajiqook.jp/game/kiritori/); viewport-driven grid layout in [Diary](https://sajiqook.jp/game/diary/); reload/session state in [CONNECT](https://sajiqook.jp/game/tconnect/). | Many signature interactions are ordinary browser affordances with carefully authored rules. A dedicated game engine is not required. |
| SVG and DOM geometry | Shape paths, unit-area calculations and pointer resizing in [Mebakari](https://sajiqook.jp/game/mebakari/); map/wire/board UI in the relevant entries below. | SVG is well suited to selectable shapes and legible text; explicit geometry/state can stay independent of rendering. |
| Native Canvas 2D | A custom frame loop in [Rain-Dodging Dash's application bundle](https://sajiqook.jp/game/ameyoke/assets/index-B1gA4Bq6.js) and [Blind Spot's game script](https://sajiqook.jp/game/blindspot/game.js). | Continuous animation and collision can use an ordinary canvas without Phaser/Pixi. See each entry for the actual loop and input mechanism. |
| React applications | Identifiable runtimes in [Let's aim for the goal](https://sajiqook.jp/game/laftg/assets/index-B7tfBXWO.js), [choice](https://sajiqook.jp/game/sentaku/assets/index-CpF4TF9C.js), and [Rain-Dodging Dash](https://sajiqook.jp/game/ameyoke/assets/index-B1gA4Bq6.js). SPOITO additionally exposes vinext/Vite/RSC runtime markers. | React is the component/state layer here; it is not itself a physics/game engine. Svelte could serve the same application role in a new implementation. |
| Godot Web export | The playable [You Are Newton demo](https://sajiqook.jp/game/youarenewton/game/index.html?build=0730-demo-cursor-sync&lang=ja) contains `GODOT_CONFIG`, `new Engine(...)`, and a `.wasm`/`.pck` loading path. | This is an actual game-engine export. Its separate React landing page should not be mistaken for the playable runtime. |
| Browser-native audio and persistence | Web Audio synthesis appears across the public puzzle scripts; local/session storage preserves preferences or puzzle state. PHP-named endpoints handle state/validation/records in several games. | Audio and save/state infrastructure can remain small. Do not assume the frontend reveals all validation logic, especially in newer server-backed puzzles. |

**Not established:** a single shared engine for the whole catalogue, the author's IDE/art tools, the complete backend architecture, or universal use/non-use of a library outside the inspected public assets. Tools and markers are reported per game below.

## Detailed game notes

Solutions and twists below contain spoilers. An unavailable exact answer is accompanied by an evidence-based next move or hypothesis wherever the public premise supports one; it is not silently promoted to a verified solution.

## あめよけダッシュ！ — Rain-Dodging Dash (`ameyoke`)

**Goal.** Survive falling rain by moving the character horizontally and improve the score. This is an endurance/action game, not a fixed-answer deduction puzzle. The public code computes the score as `floor(elapsedSeconds * 10) + bonus`; there is no finite level-clear condition in the inspected loop. [Game](https://sajiqook.jp/game/ameyoke/), [public application bundle](https://sajiqook.jp/game/ameyoke/assets/index-B1gA4Bq6.js).

**Solution / strategy — code-confirmed rules, proposed playing strategy.** Use left/right arrows, A/D, or horizontal pointer dragging; keep moving into gaps in the rain. Collect an umbrella for a single rain-hit shield, candy for a 50-point bonus, and the yo-yo power-up when it becomes available at higher scores. At long survival times, lightning adds a separate threat: leave its warned column before the strike. The yo-yo protection can absorb a lightning hit; an umbrella is checked separately for rain collisions. A sensible strategy is to prioritize survival and power-ups over risky candy collection, then move out of warned lightning columns early. This is a strategy inferred from the collision/update rules, not a demonstrated record run. [Bundle: `ae`, `Me`, frame callback `b`, `de`/`fe` power-up flags](https://sajiqook.jp/game/ameyoke/assets/index-B1gA4Bq6.js).

**Tools / interactive implementation — confirmed.** React/React DOM 19.2.6 are bundled; the game uses a native 720×720 Canvas 2D surface, a `requestAnimationFrame` update/draw loop, image sprites, React refs for rapidly changing simulation state, keyboard listeners, pointer capture, local storage for the best score, and a PHP endpoint for activity/statistics. Canvas also produces a downloadable result card. The bundle does not identify Phaser/Pixi as its game renderer. [HTML](https://sajiqook.jp/game/ameyoke/), [bundle: `getContext('2d')`, `createRoot`, `ne`, `Fe`](https://sajiqook.jp/game/ameyoke/assets/index-B1gA4Bq6.js).

**Why it is interesting.** **Web interface:** the same playfield accepts keyboard and touch input, while the result is turned into a shareable image. **Mechanics:** spawn frequency, fall speed, and extra hazards escalate with time/score; different pickups protect against different threats. **Twist:** the initial umbrella-and-rain premise expands into lightning and a yo-yo protection reference, with increasingly extravagant speed-rank names. This is an escalation/reward surprise, not evidence of a hidden final riddle. The catalogue's “looks stopped” line fits the speed fantasy but is not proof of a secret time-stop solution. [Catalogue metadata](https://sajiqook.jp/saji_meta.json), [bundle: rank function `T`, lightning branch, result JSX](https://sajiqook.jp/game/ameyoke/assets/index-B1gA4Bq6.js).

## めばかり — By Eye / Match the Area (`mebakari`)

**Goal.** Resize your shape until its area equals a differently shaped reference. Modes include a circle/square warm-up, a five-question mix, a one-drag attempt, a reference that disappears after one second, and a shared daily five-question set. [Game and readable inline source: `MODES`, English/Japanese copy](https://sajiqook.jp/game/mebakari/).

**Solution — formula confirmed in source; manual play remains an estimation task.** The exact radius is `sqrt(referenceArea / K[targetShape])`, where `K` is the area of the target's unit-radius polygon (or π for a circle). Equivalently, multiply the displayed radius by `sqrt(referenceArea/currentArea)`. Circle-to-square matching requires side length `sqrt(π) * circleRadius`; equal outer widths will generally be wrong. The judge uses relative area error and approximately deducts one point per percentage point of error, rounding to integer points. Normal play deliberately asks you to estimate rather than read these hidden quantities. In the one-shot mode, make the adjustment before releasing; in the memory mode, memorize area before the reference fades. No single fixed answer applies because questions vary. [Source: `shoelace`, `K`, `areaOf`, `radiusFor`, `scoreOf`, `makeQuestion`, `judge`](https://sajiqook.jp/game/mebakari/).

**Tools / interactive implementation — confirmed.** Custom JavaScript in one HTML page; SVG paths/circles render the shapes. Pointer capture and radial drag distance resize them, with mouse-wheel and arrow-key fine adjustment. `mulberry32` plus a calendar-date seed makes the daily set repeatable; local storage tracks mode bests and the daily recorded attempt. CSS handles fading and state classes. An off-screen Canvas 2D surface exports the results card. The application uses a small PHP-backed activity/statistics call, not an identified external game engine. [Source: `shapeSVG`, drag handlers, wheel/keydown handlers, `todayKey`, `start`, canvas export, `ping`](https://sajiqook.jp/game/mebakari/).

**Why it is interesting.** **Web interface:** grabbing farther from the center produces finer control; the judge superimposes the correct silhouette and displays signed error, making feedback immediately legible. **Mechanics:** area scales with the square of size, so bounding-box intuition is unreliable; random rotations and different shapes intensify that bias. **Twist:** the same basic interaction becomes a commitment puzzle when release locks the shape and a memory puzzle when the reference disappears. The reference is actually removed from the DOM after its fade, rather than merely made transparent. These are source-confirmed mode changes, not a hidden narrative ending. [Source: `loadQuestion`, `lockYou`, `judge`, mode descriptions](https://sajiqook.jp/game/mebakari/).

## laftg — Let's aim for the goal

**Goal.** Reach the goal using a circular percentage selector, a central input button, and Decision. The interface looks like a loading/progress control, but selections actually build a hidden word of at most four letters.

**Solution — source-confirmed.** The ten positions, 10% through 100%, encode the letters `nowloading` in order. Select 100% → 20% (or 50%) → 60% → 40%, clicking the central button after each selection, then Decision. This spells `goal`. The local FNV-style checker accepts its hash `376399990`. Entering `now` using 10%, 20%, 30% instead produces a live time display, a useful intermediate discovery. Other inputs can produce sprite pictures or a blank result. The mapping and the two hash matches were independently validated locally; the success screen was not observed in a browser.

**Tools.** React 19.2.6 and React DOM are identifiable in the shipped bundle; Vite’s modulepreload bootstrap is present. The puzzle itself uses React state, pointer angle calculations, keyboard arrows/Enter, CSS and a result-image sprite sheet. There is no evidence of a separate game engine. Useful source markers are the decoded character array `m`, hash function `x`, angular pointer handler `ie`, append handler `ae`, and Decision handler `oe`. Statistics calls are aggregate tracking, not the answer authority.

**Why interesting.** The web convention of a loading ring becomes an alphabet. The title supplies a literal executable instruction: construct “goal,” rather than wait for loading to reach 100%. Small alternate outputs reward experiments and teach the hidden encoding. A comparable implementation can start with ten radial DOM hit areas and a tiny dictionary of meaningful outputs; the hard part is making enough discoveries legible without exposing the alphabet immediately.

Sources: [game](https://sajiqook.jp/game/laftg/), [public application bundle](https://sajiqook.jp/game/laftg/assets/index-B7tfBXWO.js).

## diary — 日曜日の予定 / Sunday’s plans

**Goal.** Read a suspicious diary and answer “What is the purpose?” The prose says preparations have been made to erase something over the weekend, supposedly to protect the reader.

**Solution — source-confirmed.** Resize the viewport until the diary displays seven columns. The desktop `columnCount(width)` deliberately provides this at widths roughly 540–650 pixels; approximately 600 pixels is a useful starting point. Read the Sunday/first column vertically. Six initial blank cells followed by the diary’s characters produce `ころすため` (“in order to kill”). Enter that phrase. The checker also accepts `殺すため`, `殺す為`, and several kana variants. The seven-column extraction was reproduced from the literal source text and blank-cell offset. Mobile layout uses a separate character-width calculation, so the precise window width is a desktop recommendation, not a universal pixel requirement.

**Tools.** Plain HTML, CSS grid and JavaScript. The implementation listens for viewport changes, uses `visualViewport`, and schedules layout work with `requestAnimationFrame`. No canvas or game engine is needed. Relevant source evidence includes `columnCount`, the `entries` array, the `index % 7 === 0` Sunday rule, and the accepted-answer list. Calendar weekday headings become apparent on completion.

**Why interesting.** Responsive reflow is normally a presentation concern; here it is the player’s main manipulation. The title’s Sunday clue tells the player to impose a calendar interpretation on apparently ordinary prose. Reading along the newly aligned column changes the reassuring “protect you” story into a threat. It combines a spatial acrostic with a narrative reversal, and the browser’s adjustable width makes the clue materially interactive. For a similar game, render real text cells and test multiple viewport sizes carefully: the intended alignment must be discoverable and the text must remain usable on phones.

Source: [game and inline script](https://sajiqook.jp/game/diary/), particularly `columnCount` and the answer-check branch.

## iroiro — 色々

**Goal.** Explore a color palette and four unlabeled character buttons to discover the successful word. Colors can be selected, their naming language switched, and character selections submitted as a masked string.

**Solution — source-confirmed.** Each button contributes the corresponding character of the selected color’s name. Japanese and phonetic English names are different character resources. Starting with red, pink and purple: (1) select purple in Japanese and press button 4 to enter `き`; submit to unlock yellow. (2) Enter `くろ`: pink English button 3 (`く`), yellow English button 3 (`ろ`); submit to unlock black. (3) Enter `ぶるー`: black English button 1 (`ぶ`), purple English button 4 (`る`), purple English button 2 (`ー`); submit to unlock blue. (4) Enter `おどろき`: blue Japanese button 2, red English button 3, yellow English button 3, yellow Japanese button 1. Submit. The final literal is `おどろき` (“surprise”), and the checker additionally requires blue to have been unlocked. This sequence follows the embedded names and unlock conditions; no browser completion was observed.

**Tools.** Plain DOM buttons, CSS palette styling, JavaScript state and base64-packed string data. Source markers `COLORS`, `unpack`, `TOKEN`, `unlocked`, and the submit handler expose the rule. A persistent red dot is also a selectable color resource. There is no evidence of a graphics engine or external game library.

**Why interesting.** Colors are not a matching exercise: their names are reusable alphabets. The language toggle changes what can be typed and is therefore a mechanical tool rather than a localization preference. Newly spelled colors expand the available vocabulary, creating a small dependency graph. The dot-only answer buffer makes players infer the mapping through experiments. The surprise is that completing the palette is not the final objective; a non-color word assembled from the unlocked resources ends the game.

Source: [game and inline script](https://sajiqook.jp/game/iroiro/), especially `COLORS` and final `TOKEN` condition.

## search — サーチテスト / Search test

**Goal.** Recover the password from a mysterious text file displayed as a small editor. Selected text can be copied into a side clipboard, and the final answer is entered into an authentication field.

**Solution — source-confirmed.** Copy the six exact ranges: `・行空き・`, `「書き残し」`, `一つのパスワー` (without the final ド), `。左右の文字は動かない。`, `、同一なら、`, and `　文字を書き写す　` (including its full-width spaces). Their clipboard rows carry circled ordering marks. The indicated vertical character column reads `空きの右一字`: take one character immediately right of each new gap. Read those neighbors in circled-number order to obtain `入力はサイド` (“the input is side”). Enter `サイド` or `さいど`. Both locally calculated SHA-256 hashes match the shipped accepted hashes. This confirms the answer condition; exact selection and the visual alignment were reconstructed from source, not demonstrated through a browser playthrough.

**Tools.** Ordinary HTML text, native `Selection` and `Range`, `TreeWalker`, `copy`/`cut` handlers, `clipboardData.setData`, and DOM/CSS wrappers. Copied ranges disappear visually while their widths remain, preserving neighboring character positions. Wrong selections have recoverable history and undo behavior. Relevant markers include `encodedTargets`, `handleClipboardAction`, and `alignClipboardArrow`. No game engine is present.

**Why interesting.** Copying unexpectedly removes text from the visible document, turning an operating-system convention into a spatial puzzle action. The clipboard is a second clue surface, not merely feedback. Punctuation, exact selection boundaries and blank widths matter, so the player alternates between linguistic parsing and precise interface operations. The first decoded instruction explains how to use the gaps created by the earlier actions. A similar implementation needs robust selection normalization and forgiving undo: otherwise browser selection friction would obscure the deduction.

Source: [game and inline script](https://sajiqook.jp/game/search/), including encoded ranges, arrow positioning and accepted password hashes.

## sonokanni — この間に / In this interval

**Goal.** Use a single PUSH button and a movable writing divider to produce the successful hidden word. The text buffer is masked, while recognized words can produce visible interpretations.

**Solution — source-confirmed.** Holding and releasing for 1–2 seconds writes `いち`; 2–3 writes `に`; 3–4 writes `さん`; 4–5 writes `し`; 5–6 writes `ご`. Releases before one second or after the cancellation limit do not write a token. To win: hold 3–4 seconds to write `さん`; move the divider between `さ` and `ん`; hold 1–2 seconds to overwrite with `いち`, producing `さいち`; move the divider before `ち`; hold 5–6 seconds to overwrite it with `ご`. The result is `さいご`, displayed as `最後` (“last/end”). Its locally calculated SHA-256 equals the embedded `GOAL` hash. This is a deterministic solution derived from the input/overwrite logic, not an observed browser clear.

**Tools.** Plain HTML/CSS/JavaScript, native pointer capture, `pointerdown`/`pointerup`, `performance.now`, and `requestAnimationFrame` for timed hold feedback. Keyboard Space/Enter supports holding; arrow keys move the caret. `crypto.subtle` hashes recognized words. `TOKENS`, `finishHold`, the overwrite writer and `renderResult` are useful source markers. No engine or canvas is necessary.

**Why interesting.** “Between” describes both temporal intervals and positions between characters. A button press is not a binary action: duration chooses a Japanese number reading, whose variable character length becomes material for editing. The divider behaves as an overwrite position, so players must compose a new word from overlapping number words. Masking prevents direct transcription and encourages inference from token lengths and recognized outputs. To build something similar, keep the timing states explicit and make thresholds, cancellation and keyboard alternatives reliable enough that the challenge remains conceptual.

Source: [game and inline script](https://sajiqook.jp/game/sonokanni/), particularly `TOKENS`, overwrite logic and `GOAL`.

## kiritori — Cut out

**Goal.** Cut objects into roman-letter tiles, then arrange tiles to answer the displayed Japanese word. The first target is treasure, `お宝`; a later target is scallop, `ホタテ`.

**Solution — source-confirmed.** Saw the wooden board with repeated back-and-forth movement to obtain `ITA`; make a fast knife swipe across the lettuce to obtain `RETASU`. Then choose no tool, select the editable source labels `答` and `え`, and use the browser’s Cut command/Ctrl-X or Cmd-X. These produce `KOTA` and `E`. Assemble `OTAKARA` and submit. The next target is `HOTATE`. Submit an incorrect attempt to expose the feedback `違うよ`; cut that feedback to obtain `CHIGAUYO`. The remaining original tiles supply two Ts and E, while this new source supplies H, O and A; assemble `HOTATE`. Both exact target strings, resource creation and the feedback cut handler are in the client code. The gesture thresholds were inspected, but the sequence was not browser-tested.

**Tools.** Native pointer events measure reversal direction and speed: the saw requires five substantial reversals; the knife uses a velocity threshold. DOM tile buttons transfer letters into answer slots. Carefully restricted `contenteditable`, native text selection and `cut` handlers support the second meaning of cutting; paste and arbitrary edits are blocked. Source markers include `objectData`, tool gesture handlers and cut conversions for `KOTA`, `E`, `CHIGAUYO`.

**Why interesting.** “Cut” begins as a physical gesture on illustrated objects and then becomes the operating-system text command. Interface labels are legitimate resources. The second stage escalates this rule: a failure message, normally disposable feedback, supplies otherwise unavailable letters. It teaches a reusable idea, tests whether the player generalizes it, and makes failure productive. A similar puzzle benefits from an explicit finite letter inventory and visible conservation of used tiles, rather than unrestricted word entry.

Source: [game and inline script](https://sajiqook.jp/game/kiritori/), including target checks and native cut handling.

## alight — All Light

**Goal.** Make the correct “light” and operate the switch. The page alternates bright and dark appearances, with blank-looking letter controls whose meanings depend on the current color mode.

**Solution — source-confirmed.** The hidden banks are `WHITE`, `BLACK`, and `ORANGE`; each key selects its indexed character. Build `LIGHT`: switch off, press black bank key 2 for L; switch on, press white key 3 for I. Toggle through four uninterrupted off→on cycles to reach orange mode, then press key 5 for G. Do one additional off→on cycle to return to white; press keys 2 and 4 for H and T. Flip the switch to validate `LIGHT`. Typing, clearing or backspacing resets the uninterrupted cycle counter, so obtain orange only when ready for G. The exact banks and success string were decoded from public client data, and the counter/state transitions were checked in source. No browser clear is claimed.

**Tools.** Plain JavaScript and DOM buttons, CSS driven by `body.dataset.mode`, a stateful on/off switch and a short client-side checker. Source markers include `darkCycles`, the switch handler and decoded bank data. Buttons are enabled according to bank length; no canvas or game engine is needed. The English/Japanese toggle changes instructions rather than the letter-bank rules.

**Why interesting.** A light switch normally affects visibility; here its visual state chooses the available alphabet. Literal color names connect appearance to hidden letters. WHITE and BLACK supply most of the desired word but cannot provide G, creating a productive dead end. Repeated switching reveals ORANGE as a third state and the missing resource. The final switch press is simultaneously a normal lighting action and answer submission. A comparable design can be implemented as a tiny finite-state machine, but should make the repeated-action discovery feel supported rather than arbitrary.

Source: [game and inline script](https://sajiqook.jp/game/alight/), especially the mode cycle and `LIGHT` validation.

## tconnect — CONNECT

**Goal.** Communicate across dates while sending only one Japanese character per day. Instructions suggest that the required word is known in the future; the interface initially appears to permit travel only forward.

**Solution — source-confirmed.** On day 1 send `か`; advance to day 2 and send `こ`, creating `かこ` (“past”) and completing the first connection. Reload the browser once to return to day 1, then reload again to reach day 0. Send `み` on day 0, advance and send `ら` on day 1, then advance and send `い` on day 2. This spells `みらい` (“future”) across the three records and completes the game. `firstSolved` explicitly checks records 0/1 for か/こ, while `secondSolved` checks records −1/0/1 for み/ら/い. The refresh transition only becomes available after the future has been visited. This is source-confirmed, not a browser playthrough.

**Tools.** Plain DOM forms and JavaScript state; `sessionStorage` under `past-communication-puzzle-v1` preserves the timeline. The Navigation Timing entry distinguishes a page reload from a fresh visit and moves the current day backward. CSS glitch effects, cloned DOM and Web Audio support the communication presentation. Aggregate PHP statistics are separate from the locally held puzzle state. No game engine was detected.

**Why interesting.** Reload is an action outside the apparent game controls, and its ordinary persistence semantics become time travel. Advancing the day alone cannot satisfy the later condition, so the browser itself supplies the missing direction. Japanese `こうしん` can suggest both communication/update language and refreshing a page. The initial word PAST teaches the concept before the second word FUTURE requires applying it over a longer timeline. For a comparable game, separate a deliberate reset from refresh carefully and ensure persisted state cannot strand the player after a mistaken navigation.

Source: [game and inline script](https://sajiqook.jp/game/tconnect/), including reload detection and `firstSolved`/`secondSolved`.

## supoito — SPOITO / Eyedropper

**Goal.** Sample colors from the page and paint empty circles to match a reference. Matching removes circles; the ultimate objective is to remove all of them.

**Solution — source-confirmed color targets; inferred interaction sequence.** Match red from the red O in the title, then blue from the blue help button. For the third target, open Help and sample that blue through the 60% white veil: the resulting color is `#afc5ef`. The fourth target is `#25282d`, obtainable from the black shadow inside the help presentation. Finally sample cream `#f5f0e6` and paint the small circle/handakuten on ポ in the instruction word `スポイト`. That typographic circle is a fifth paint destination. The reducer requires the target sequence red `#e34b4e`, blue `#366ed8`, pale blue, black, cream. The proposed source locations follow the rendered DOM attributes and mixing function; confirming all five in an actual browser remains necessary, particularly shadow hit testing and the final small target.

**Tools.** React with explicit `vinext` runtime identifiers and Vite/RSC resource markers. The `_next/` asset path alone should not be treated as proof of Next.js. Lucide-style React icon code is present. The application implements its own DOM sampler (`Do`, with color normalization `Eo`), using `data-color`, computed text/background/border colors and text ranges. It does not use the browser EyeDropper API or read canvas pixels. Help/record dialogs use bundled focus/positioning primitives. Target/palette nodes are explicitly excluded from sampling.

**Why interesting.** Interface chrome is the color inventory. A modal’s dimming layer mathematically creates a new color; help is an active puzzle object. The final “circle” is linguistic typography rather than an obvious palette slot, asking the player to generalize a visual category across the whole page. This is especially suited to DOM implementation, where semantic sampling can remain deterministic across devices rather than depending on screenshot pixels.

Sources: [game](https://sajiqook.jp/game/supoito/), [application chunk](https://sajiqook.jp/game/supoito/_next/static/chunks/page-CdTRJSO-.js), [bootstrap/runtime](https://sajiqook.jp/game/supoito/_next/static/chunks/index-D6hqwU44.js).

## choice (`sentaku`)

**Goal.** Get 100 points on a deceptively simple multiple-choice questionnaire: capital of Japan, even numbers, largest A, number of questions, and the final instruction to select the grading text. [Game](https://sajiqook.jp/game/sentaku/).

**Solution — code-confirmed.** Choose Tokyo; check 2 and 4; also set the sound-volume slider to **50**, another even number. Open settings and select its **large A**, rather than an A among the question's apparent answers. Choose **5** for the question count. Finally use ordinary browser text selection to highlight exactly the final **採点 / Check answers** label, then view results. The `gp` scorer awards 10 for Tokyo, 10 only when 2/4 and volume 50 are all selected, 20 for `letter === 'settings-large'`, 30 for count 5, and 30 for `ending`. The selection detector `te` checks `window.getSelection()`, exact text equality, and intersection with the final label. [Application bundle](https://sajiqook.jp/game/sentaku/assets/index-CpF4TF9C.js).

**Tools and implementation.** This one actually ships React: the bundle contains the React runtime and the app uses hooks and JSX runtime calls. Its controls are DOM form components, with custom Web Audio synthesis (`AudioContext`, oscillator/gain envelopes), browser Range/Selection, and localStorage; `records.php` collects records. No canvas or heavyweight game engine is required for these interactions.

**Why interesting.** The page first teaches a conventional form contract and then broadens what counts as an answer. Settings contain legitimate answer candidates, and “select” changes meaning from choosing a control to selecting text. The scoring lets players diagnose partial understanding rather than merely receiving a generic rejection. For a similar prototype, make the underlying answer model include both explicit form fields and browser state. The implementation confirms the answer conditions; exact mobile selection ergonomics were not tested.

## knock (`nock`)

**Goal.** Somehow gain admission through a closed club door. Knocking produces movable square tokens and a five-cell answer area. [Game](https://sajiqook.jp/game/nock/).

**Solution — code-confirmed derivation.** Knock **21 times** during the counting window (the settings offer a longer window). This produces tokens representing 二, 十, 一, 回. Internally their readings are に, じゅう, いっ, かい. Place **十** starting in cell 1, then overwrite its first cell with **二**, then place **回** starting in cell 4. The board becomes **にゅうかい** (“admission”). The 一 token is unnecessary. This takes advantage of the implementation allowing a later token to overwrite existing letters. The public hash function applied locally to にゅうかい gives **4201482606**, exactly the main-success comparison in `ve`. The pronunciation rule matters: 20 alone uses じゅっ before 回 and cannot supply the necessary う. [Game script](https://sajiqook.jp/game/nock/game.js?v=20260913-quote-share), markers `me`, `ye`, `ve`, and the initial reading table.

**Tools and implementation.** Custom DOM buttons and slot rendering, Pointer Events and pointer capture for dragging, keyboard activation, `performance.now`/`requestAnimationFrame` for the knock timer, and Web Audio oscillator/noise effects. Preferences and records use browser storage and a PHP endpoint. No third-party gameplay engine was identified.

**Why interesting.** Physical repetition manufactures linguistic material. The apparently blank squares conceal kanji whose *readings*, not their visual geometry, fill the answer cells. Overwriting is a meaningful combinator rather than an error. Multiple recognized alternate strings generate side outcomes, rewarding experimentation. A good adaptation would preserve clear undo and a generous timer so insight, rather than tapping speed, dominates. The main answer is validated against public code; the complete list of alternate endings has not been solved.

## short cut (`shortc`)

**Goal.** Send at least **10 cars** through a signal within **15 seconds**, stopping at yellow and red. [Game](https://sajiqook.jp/game/shortc/).

**Solution — code-confirmed timing rule; suggested sequence.** Cars may pass on **green AND when the signal is dark**. The source rejects only `red` and `yellow`, so the short unlit intervals are usable. Each car imposes a 650 ms cooldown; an illegal pass costs two seconds. A feasible ten-car schedule in game time is approximately **0.00, 0.65, 1.30, 4.75, 5.40, 6.05, 9.75, 10.40, 11.05, 14.75 seconds**. The 4.75/9.75/14.75 passes exploit the dark phase after red. These times follow the exact phase and cooldown constants; live input latency could require modest adjustment. The phase table is green 1600 ms, dark 325, yellow 1050, dark 325, red 1375, dark 325, repeating every 5000 ms. [Public application script](https://sajiqook.jp/game/shortc/app.min.js?v=202609151245), decoded class `e`, methods `S`, `R`, `B`, getter `N`.

**Tools and implementation.** A custom JavaScript simulation with DOM/CSS cars, CSS animation end cleanup, `requestAnimationFrame` and high-resolution timestamps, Web Audio, native dialogs, and localStorage/PHP records. Blur and document visibility pause game time. No external gameplay library was evident in the inspected application.

**Why interesting.** The wording states prohibitions, not a green-only rule. Tiny transition states become the overlooked resource. It blends a deduction with a timed execution challenge and supports higher scores up to 15. The browser's elapsed-time loop can keep simulation and display aligned, while pause handling avoids punishing tab switches. The ten-car schedule is a calculation from public rules, not a recorded browser clear; maximum-score strategy remains unverified.

## 結び (`kmusubi`)

**Goal.** Connect “leaves of words”: listen to a serpentine grid of **32 sound circles** and arrange four circles in four answer slots. The grid, playback timeline, and draggable circles are the actual puzzle surface. [Game and inline source](https://sajiqook.jp/game/kmusubi/).

**Solution status — exact four circles not confirmed.** The implementation stores 32 note phrases at 69 BPM, not visible syllable labels, and hashes the four selected zero-based circle IDs as `leaf-v2:i:j:k:l`. Two SHA-256 digests are accepted. Thus neither an invented literal answer nor a confident guessed circle sequence is justified. **Concrete hypothesis to test:** play the full serpentine sequence, transcribe the melody as the Japanese song *Ōkina kuri no ki no shita de* (Under the Big Chestnut Tree), then assign its sung fragments to the circles. As an initial answer hypothesis, try the four consecutive fragments **な・か・よ・く** (get along together), provisionally circles 16–19 counting from one along the arrows. The note contour supports the song identification, but the lyric-to-circle alignment and answer hypothesis are unconfirmed; simply choosing the first four circles does **not** match either published digest. Confirmation would require matching the lyric segmentation to the note phrases and obtaining the success dialog from a four-circle arrangement.

**Tools and implementation.** Plain DOM buttons and answer slots; SVG arrows establish reading order. `phrases`, `BEAT`, and `choose`/playback functions synthesize music with Web Audio. Pointer capture implements dragging, and the timeline supports scrubbing/replaying. `check` uses native `crypto.subtle.digest('SHA-256', ...)`; localStorage stores preferences and PHP records track clears. No separate game engine was identified.

**Why interesting.** The same object is a musical fragment, a movable answer token, and a position in a song. A scrubber makes close listening a practical interaction rather than a memory test. The hidden transition from notes to language appears central, but the intended lyrical extraction is still a hypothesis. For adaptation, supply keyboard selection and replay of individual clips; those affordances let players investigate the material without needing accurate drag gestures.

## RELAY (`relayr`)

**Goal.** Enter the cabin, receive three encrypted reports, decrypt each with its matching connection state, and forward them to headquarters. [Game and inline source](https://sajiqook.jp/game/relayr/).

**Solution — code-confirmed, with one entry-clue uncertainty.** Cabin password: **7316** (`accessCode` decodes four character values). Receive reports while connected. For **A**, drag the header's connection lamp onto its port while connected with settings closed. For **B**, disconnect the device/browser's actual network, drag the now-offline lamp to B, then reconnect before forwarding. For **C**, open the settings window so the lamp becomes the **shielded** signal, drag that signal to C, close settings, and forward while connected. `reportSignals` maps A/B/C to 0/1/2; `currentSignal` maps ordinary online/offline/settings-open to exactly those values. `transfer` requires online status and settings closed. The intended visual way to discover 7316 was not established, so the password is a source-confirmed answer, not a claimed observed clue deduction.

**Tools and implementation.** Custom JavaScript/DOM, SVG drawn connection wires, Pointer Events, a draggable nonmodal settings dialog, and Web Audio. `navigator.onLine`, `online`/`offline` listeners, and a `fetch` probe of public `connection.txt` determine connection state; successful text is `silent-line-ok-v1`. Session storage preserves progress. There is no need for a game engine to implement this browser-state puzzle.

**Why interesting.** A UI status lamp becomes a draggable resource. Real networking and the settings window participate in the fiction instead of merely representing it. Crucially, the state needed to decrypt B is incompatible with the state needed to transmit, requiring a deliberate two-step workflow. A similar game should make reconnection recoverable and persist progress; relying on real network changes creates device-specific friction. These mechanics are explicit in source; full OS-level disconnection play was not performed.

## だるまさんが (`darumas`)

**Goal.** Play the reversed “daruma-san”/red-light-green-light encounter: the opponent approaches while you are not watching, tags you, and then orders a number of steps. Catch it without falling off the board. [Game](https://sajiqook.jp/game/darumas/).

**Solution — code-confirmed.** During the approach phase, look away from the page **exactly five times**, allowing at least **11 seconds total** away time. For example, leave the game tab for about 2.3 seconds and return, repeated five times. Do not count the initial page opening as an absence. The opponent reaches you after 11000 ms accumulated away time. The subsequent instruction uses the number of lookaways (`turns`) as your required step count. The opponent retreats five spaces and the further spaces collapse. Follow the walking instruction: **five** steps wins; fewer stops short and more than five falls. Avoid additional accidental blur events while setting up the sequence. [Game script](https://sajiqook.jp/game/darumas/game.js?v=292d94fe9bca), markers `awayAt`, `turns`, `elapsed`, `retreatStep`, `Se`, and the walking phase's `5 === t ? 'won' : 'short'` comparison.

**Tools and implementation.** DOM/SVG board presentation, `visibilitychange`, `blur`, and `focus` as gameplay inputs, a custom state machine, timers/animation updates, Web Audio, and browser storage. The script includes persistence validation so interrupted play can be restored. No external gameplay engine was identified in the shipped script.

**Why interesting.** Looking away is the move: the browser's focus system becomes a physical rule. Time away controls approach distance, while the *count* of absences controls the later command, so these two quantities must be managed separately. The reveal retrospectively explains why careless tab switching failed. The five-absence condition is certain from code; precise focus-event behavior across browsers and operating systems was not live-tested. An adaptation should deduplicate blur/visibility changes and explain accessibility alternatives without spoiling the counting twist.

## かさね (`kasane`)

**Goal.** Stack and horizontally shift binary plates until the lit cells match a target, then synthesize the successful stack and unlock the next of three stages. [Game and inline source](https://sajiqook.jp/game/kasane/).

**Solution — code-confirmed algebraic derivation.** Overlapping 1s **cancel by XOR**, not OR. Offsets below are zero-based from the left, with short plates right-padded with zeroes to the target width.

1. Stage 1, target `010`: plate `11` at offset 1 (`011`) XOR `001` at offset 0 = `010`. Synthesize unit 1.
2. Carry unit 1 into stage 2. Target `011`: unit `010` at 0 XOR plate `101` at 0 XOR plate `10` at 0 (`100`) = `011`. Synthesize unit 2. **Preserve the unused `100` plate.**
3. Carry that `100` plate and unit 2 into stage 3. Target `1101`: `100` at 0 (`1000`) XOR `0100` at 0 XOR unit `011` at 1 (`0011`) XOR `010` at 1 (`0010`) = `1101`.

The code's stage data, `resultBits`, `synthesize`, and item-transfer logic establish these operations. The sequence was calculated from public data, rather than recorded through UI play.

**Tools and implementation.** Custom DOM/CSS light cells, pointer-driven plate manipulation, stage tabs, keyboard support, native Web Audio and browser storage; a PHP endpoint records play. The encoded initial stage data is ordinary base64 JSON, not evidence of a third-party engine.

**Why interesting.** Successful answers become *physical resources*. A locally valid stage-2 solution can consume plates needed later, so earlier completion is not the same as globally good planning. Carrying a completed result between stages changes a familiar overlay toy into a resource deduction puzzle. A similar implementation should model plates as persistent objects with location, width and bit pattern, and offer clear recovery after a dead end.

## 魔法使いの書庫 / The Wizard’s Library (`maglibrary`)

**Goal.** Find three books by exploring a library, collecting ordered fragments, and eventually learning magic to reach a secret room. [Game](https://sajiqook.jp/game/maglibrary/).

**Solution — code-confirmed main path.** The rooms form a kana layout, with each room representing a syllable. Search rooms in these orders: chapter 1 **ほ → し**; chapter 2 **ま → ほ → う**; chapter 3 **り → ゆ → secret room → う**. The secret room modifies the preceding kana, turning ゆ into small ゅ and producing **りゅう**. After learning まほう, use `teleport` to enter the otherwise isolated secret room, search it after ゆ, teleport back, and search う. Coordinates (row, column, one-based) from the shipped room map: ほ=(6,8), し=(2,7), ま=(8,2), う=(1,2), り=(8,7), ゆ=(7,5), secret=(11,2). Clicking a room computes a walking path; use “search” only at the desired fragment rooms. [Game script](https://sajiqook.jp/game/maglibrary/game.js?v=20260929-special-record), `packedRooms`, `chapters`, `attemptSignature`, `searchCurrentRoom`, `teleport`.

**Tools and implementation.** DOM room buttons, CSS avatar transforms and lighting, a custom shortest-path traversal, `requestAnimationFrame` for moving light, Web Audio and PHP records. Motion checks `prefers-reduced-motion`. These inspected assets do not expose a general game engine.

**Why interesting.** The spatial map is also a writing system. Early illuminated rooms teach movement; later darkness makes remembering the underlying kana structure valuable. Magic changes navigability, while the secret room changes orthography. Optional discovery **と→く→し→ゆ→secret→ま→ほ→う** unlocks special magic, allowing further interaction variants. The main fragment signatures and optional spellbook sequence are explicit in code; optional endings and their full routes were not exhaustively played.

## お化け屋敷 (`obakeya`)

**Goal.** Escape a haunted house by reading a mysterious paper, using a purifying memo, and entering the password. The page explicitly warns that letters can be disguised and that transcribing them restores their true form. [Game](https://sajiqook.jp/game/obakeya/).

**Solution status — confirmed mechanism, final password unavailable.** Select and **copy the suspicious text from the paper**, switch to the memo tab, and **paste** it there. This is substantive: the paste handler reads `clipboardData.getData('text/plain')`, detects Unicode private-use characters (`U+E000–U+F8FF`), and sends that copied string to the normal `purify` operation. The returned plain text replaces the pasted selection. Read the purified text and fill the password panel. **Concrete tentative continuation:** copy the entire paper rather than manually typing its visible glyphs; paste once, then use any revealed instruction to identify the password and copy additional suspicious text the same way. This should expose information unavailable from visual transcription. Confirmation requires observing the returned purified message and a successful ordinary password submission; I do not have evidence for a literal final password.

**Tools and implementation.** Vanilla JavaScript DOM tabs, native text selection/clipboard paste, textarea selection replacement, a custom glyph-disguise system, Web Audio synthesized atmosphere, viewport sizing, and a PHP JSON backend. [Application script](https://sajiqook.jp/game/obakeya/app.min.js?v=26), paste listener, function `L`, operations `purify`, `panel`, `check`, and answer-form submit handler. Password checking and purified content are server-side, so static frontend inspection alone cannot substantiate an exact answer.

**Why interesting.** Reading and copying are different actions with different outcomes: a web text representation becomes a supernatural disguise, while a mundane memo becomes a tool inside the story. This makes browser affordances feel diegetic. For adaptation, the private-use glyphs and underlying text should be deliberately authored and paste transformation should remain accessible. No private endpoints were enumerated, and no backend answers were brute-forced.

## LINK (`link`)

- **Goal:** Operate the lamp controls in three linked boxes and clear the stages; the interface also records shortest clears. The opening state has one lit lamp and two unlit controllable lamps in the first row.
- **Solution confidence — partial mechanism confirmed; complete solution unverified.** The client receives lamp states and switch effects from the server, so the downloaded client does not contain a trustworthy complete switch sequence. A concrete starting hypothesis is to map what each switch changes, retain that map when a second/third box becomes available, and revisit earlier boxes to satisfy the combined state. Do not assume every lamp is a button: `render()` deliberately creates either buttons or passive indicators. The separately rendered lamp-shaped **I** in LINK is a possible additional clue, but its exact role was not solved and should not be stated as a confirmed final twist.
- **Tools:** Custom JavaScript and HTML/CSS rather than an identified game engine. `render()` builds the title, box navigation, and lamps; `press`, `confirm`, `next`, `undo`, and `reset` actions go to the PHP API. A separate `audio.js` module uses browser Web Audio; localStorage stores preferences/visitor identity, and native dialogs provide overlays. [Page and script references](https://sajiqook.jp/game/link/), [interaction source: render and action dispatch](https://sajiqook.jp/game/link/app.js?v=20261004-ui3), [audio implementation](https://sajiqook.jp/game/link/audio.js).
- **Why interesting:** This is a compact dependency puzzle built from ordinary buttons. Different treatment of a lamp as an indicator versus a control makes observation necessary, while newly available boxes can change the meaning of earlier states. Title typography suggests that even the page heading deserves attention. The server-held rules limit how confidently one can reconstruct the full ending from public client code alone.

## KEY MOMENT (`keymoment`)

- **Goal:** Open a time-locked safe by interpreting its monitor clues and confirming at the correct displayed time. Records distinguish blue-banana and yellow-banana clears.
- **Solution confidence — interaction tricks confirmed; accepted answer/time unverified.** The clock supports hours **00–29**, not merely a conventional 24-hour day. Source also implements breakable protective glass: four taps break the slot glass; ten taps break the clock glass, and the tenth tap freezes its displayed time. These are concrete investigatory actions, not a verified complete solution. A reasonable hypothesis is to compare the monitor phrase at candidate times, exploit the unusual 30-hour range, expose the obscured letters, and freeze a relevant moment before confirming. The server supplies phrases, preview identifiers, and the accepted result, so no exact winning time or banana route is claimed here.
- **Tools:** Bespoke DOM/CSS safe interface, native dialogs, Web Audio, localStorage clock/sound settings, and PHP API requests. The clock function rolls through 1,800 minutes; preview/check requests carry time values, while glass-tap counters and the frozen clock are implemented client-side. No general-purpose engine was identified. [Public page](https://sajiqook.jp/game/keymoment/), [client source: clock, glass handlers, preview/check](https://sajiqook.jp/game/keymoment/app.min.js?v=8).
- **Why interesting:** An apparently informational clock is also a manipulable puzzle device. Manual time entry, automatic time, concealed letters, fragile glass, and a frozen moment create several meanings of “the right time.” The interface teaches its affordances indirectly through object interaction, rather than presenting a conventional keypad riddle. Multiple recorded reward types imply more than one successful interpretation, although the exact branching conditions remain unverified.

## retest (`retest`)

- **Goal:** Answer three kana-transformation questions, marked 30, 30, and 40 points, then submit the paper. The records also advertise 150-point achievers, indicating something beyond the apparent 100-point test.
- **Solution confidence — unsolved; naive hypothesis tested and failed.** Observed examples included red 青（あお）→烏賊（いか）, a red 桶（おけ） question, blue 気化（きか）→顔（かお）, a blue 寿司（すし） question, and gray ???→規則（きそく）. A tempting hypothesis is that red advances kana and blue reverses them, yielding provisional `かこ`, `しさ`, and `きそく`. A normal gameplay trial did **not** validate these: it returned 0/100, and an answer later appeared transformed. These strings are failed candidates, not a walkthrough. A stronger next hypothesis is that the answer field's own gray/black presentation and repeated submission/retest behavior participate in the transformation. The exact final answers and 150-point route remain unknown.
- **Tools:** Custom inline JavaScript, HTML forms and ruby/furigana, CSS, native dialogs, localStorage, and synthesized Web Audio pencil/noise sounds. Actions including `edit`, `submit`, `visit`, and `restart` use a PHP backend. Public client logic explicitly changes answer styling based on `answer.tone === 'black'` and the `literal` class; question answers themselves are server-held. [Page, embedded script, and question interface](https://sajiqook.jp/game/retest/).
- **Why interesting:** A school-test format supplies familiar expectations, then makes grading, answer presentation, and trying again potential parts of the problem. The gap between the nominal 100-point paper and a 150-point leaderboard is a particularly effective signal that ordinary correct answers may be insufficient.

## Float (`float`)

- **Goal:** Remove matching number-like pieces from the page. The initial interface reports nine pairs, even though the obvious board numerals do not supply nine straightforward pairs.
- **Solution confidence — whole-page mechanism confirmed; complete pairing list unverified.** The client walks body text and wraps individual non-space characters as selectable pieces. Consequently, inspect headings, instructions, and controls as well as the main number field. A concrete confirmed affordance is the sound setting: enabling it renders 音あり with り split into separate glyph parts, one with its own puzzle slot. The exact server-accepted pairings were not recovered. The working hypothesis is to match visually/semantically equivalent numeral fragments across the board and interface, including this split glyph. Completion changes the title from **Float** to **Flat** and applies the `flat` state; that final transformation is code-confirmed, not a guessed interpretation.
- **Tools:** Vanilla JavaScript module and DOM/CSS, not an identified canvas/game framework. `selectableText()` wraps page characters, `renderSound()` creates the special sound-label pieces, and `render()` removes matched pieces and changes the document title. A PHP API maintains puzzle state; browser Web Audio and local/sessionStorage support sound/preferences. [Page](https://sajiqook.jp/game/float/), [source: selectableText, renderSound, render](https://sajiqook.jp/game/float/app.js).
- **Why interesting:** This erases the usual boundary between the puzzle board and its settings. Changing a preference can expose a needed piece, while typography can be decomposed into something other than normal reading. The title's one-letter transformation gives a satisfying visual and linguistic consequence to the action of removing pieces. A similar project could use DOM text spans and CSS transforms rather than adopting a heavyweight engine.

## feeling (`feeling`)

- **Goal:** “Make breakfast using only the senses.” A toast image is the central object, with previous/next sense controls and a concealed character-input interface.
- **Solution confidence — interface mechanics confirmed; food answers unverified.** Start by selecting different senses and interacting with the bread, then choose the exposed left/right character positions to compose an answer. This is an evidence-supported exploration procedure, not a solved recipe. Client state contains selectable character positions, concealed choices, and small-kana input represented by smaller circles. A hearing state plays synthetic sound bursts. The records distinguish breakfast, lunch, space, and staple-food outcomes; therefore the puzzle supports discoveries beyond a single breakfast answer. The hypothesis is that sensory descriptions or sounds encode kana which can be recombined into food names, with alternate readings producing the other categories. Exact strings and their ordering are server-held and were not verified.
- **Tools:** Custom HTML/CSS/JavaScript, native dialogs, browser Web Audio, and localStorage. JSON requests go to an extensionless `./api` endpoint; its server language cannot be established from that URL. `reveal`, `pick`, sense switching, concealed/inert choice buttons, and result paging are visible in the client. No external game engine was identified. [Public page](https://sajiqook.jp/game/feeling/), [source: sense state, reveal/pick, audio, result rendering](https://sajiqook.jp/game/feeling/app.js?v=55e505ae3417).
- **Why interesting:** It replaces direct visible spelling with sensory selection and a deliberately opaque input channel. Even the dot sizes carry information about kana. Result paging and multiple recorded meal categories make interpretation richer than a binary answer checker. The uncertainty is substantial: the client proves the interaction vocabulary and alternate outcomes, but not the hidden mapping from sensations to accepted words.

## Blind Spot (`blindspot`)

- **Goal:** Move the character to an exit while avoiding surveillance-camera sight across the stages. Standard movement/jump controls coexist with a draggable stage-selection menu.
- **Solution confidence — central trick code-confirmed; full stage routes unverified.** Open and reposition the stage menu: it is physically part of the level. `solids()` includes `menuRect()`, and `predictMenu()` explicitly carries the player when their support is `menu`, while preventing the menu from overlapping the character. Camera-cone rendering raycasts against those solids, so the menu also changes apparent sight obstruction. The concrete strategy is to use it as cover and/or a movable platform, then reach the exit via fixed/moving platforms. This is not a verified frame-by-frame walkthrough. Records reveal hidden-stage clears, but their unlocking sequence was not established.
- **Tools:** Custom Canvas 2D renderer (`getContext('2d')`) plus a DOM menu and touch controls. `PuzzleCore.Game` supplies bespoke physics, collision, prediction, and ray/rectangle geometry; the client batches commands to a PHP backend. Native Web Audio handles sound. No Phaser, Pixi, Unity, or other off-the-shelf gameplay engine was identified. [Page](https://sajiqook.jp/game/blindspot/), [source: PuzzleCore.Game, menuRect, solids, predictMenu, rayRect](https://sajiqook.jp/game/blindspot/game.js?v=48efa9faf35b).
- **Why interesting:** A menu normally lives outside the simulated world; here its position and open state have physical consequences. Moving UI becomes a stealth/platforming tool, and visual line-of-sight can be studied directly. This is a useful implementation model for web-native puzzles: a small custom canvas simulation can coordinate with accessible DOM controls without needing a large engine.

## 記録 / Kiroku (`kiroku`)

- **Goal:** Investigate an “observation record” album made with another person. The opening album has two unfilled progress stars; records distinguish ordinary clears from `truthClears`, indicating a further truth ending.
- **Solution confidence — image-saving trick confirmed; answers/endings unverified.** Use the photo's normal save/download affordance and compare the resulting image with what the page appears to show. The public client explicitly creates a `.visible-image` background from the currently displayed image, requests a `reveal` result, and replaces the underlying `<img>` with the returned PNG while preserving that background. It supports saving `photo.png` and context-menu/touch/keyboard image interactions. Thus the displayed composite and actual downloadable image can differ. The concrete hypothesis is that downloaded photos reveal clues hidden behind the album's displayed layer, leading through its pages and ultimately to the second star/truth route. No exact answer strings or ending sequence were recovered.
- **Tools:** Bespoke DOM album, server-rendered HTML inserted into a view root, layered image surfaces, fetch/Blob/data-URL image handling, native dialogs, Web Audio, and localStorage. A PHP API uses CSRF/request identifiers and retry/idempotency handling. The public `game.js` implements the image-layer replacement and saving flow; no general game framework was identified. [Album page](https://sajiqook.jp/game/kiroku/), [source: image-surface, visible-image, reveal, photo.png](https://sajiqook.jp/game/kiroku/game.js?v=12).
- **Why interesting:** It turns an ordinary browser action—saving a picture—into a clue-reading instrument. The nostalgic album presentation encourages trust in the visible record, while the distinction between presentation and actual file contents undermines that trust mechanically. The separate truth-clear counter supports a layered narrative conclusion, but its content remains unknown from this investigation.

## HOTEL TRACE (`hoteltrace`)

- **Goal:** Enter and investigate a mysterious hotel. The public reception shows player name `sam`, a belongings control, and a rule that the hotel borrows “a certain thing” on entry to the building/rooms and returns everything on leaving.
- **Solution confidence — access-limited; hypothesis only.** The game explicitly requires a password supplied with a paid article. Investigation stopped at the public reception: no password guessing, protected gameplay traversal, or paid hint access was attempted. A concrete but low-confidence hypothesis is that room entry/exit changes an inventory or a stock of letters associated with names: track exactly what is borrowed on each threshold and what must be returned. The name `sam`, belongings control, and borrowing rule support examining that possibility, but do **not** establish a letter-based solution. There is no verified answer or route available from the inspected public landing.
- **Tools:** The landing uses ordinary HTML controls and loads a custom `app.js` plus analytics. That alone does not establish the playable engine or backend. The gated game bundle was deliberately not inspected; therefore claims such as “vanilla JS engine” or “PHP implementation” would exceed the evidence. [Public reception and access notice](https://sajiqook.jp/game/hoteltrace/).
- **Why interesting:** The reception combines narrative rules with familiar hotel concepts—guest identity, possessions, entering rooms, and returning borrowed things—giving the player a concrete system to observe. The likely appeal is that a mundane hospitality rule becomes an accounting/deduction constraint. Any more specific twist is unknown behind the access gate. A similar original game could present a changing inventory and reversible room-entry transactions, but that is a design extrapolation, not a claim about this game's hidden implementation.

## YOU ARE NEWTON (`youarenewton`)

- **Goal:** Guide an apple to the goal with as few gravity changes as possible. Direction keys/WASD change global gravity; reset and undo support experimentation. A rock can receive its own gravity direction once, becoming a strategically placed stopper.
- **Solution confidence — published rules confirmed; individual stage sequences unverified.** The public demo has five stages. Work backward from the goal to identify the needed final stopping surface, position a rock if necessary, then choose gravity changes that bring the apple to that alignment. Published obstacles include spikes, gates/buttons, warps, and gravity tiles that can stop the apple without an ordinary wall. This is a concrete solving strategy, not a completed optimal walkthrough; no precise per-stage direction sequence is claimed.
- **Tools:** The **playable demo is a Godot Web export**. Its HTML declares `GODOT_CONFIG`, constructs `new Engine(GODOT_CONFIG)`, and starts the game with `index.wasm` and `index.pck`. A `pako_inflate.min.js` wrapper decompresses packaged binaries, with the PCK split into public parts. The landing page separately contains React/Vinext RSC markers and Vite/Rolldown-style assets. These are two distinct stacks: React landing, Godot gameplay. No engine binaries were downloaded or decompiled. [Landing and published rules](https://sajiqook.jp/game/youarenewton/), [linked public demo and Godot loader](https://sajiqook.jp/game/youarenewton/game/index.html?build=0730-demo-cursor-sync&lang=ja).
- **Why interesting:** The player controls the force field rather than directly walking the apple. Every obstacle becomes a possible stopping tool, and the separately controlled rock changes the future movement graph. Optimizing gravity-change counts adds a second challenge after reaching the goal. Unlike the smaller DOM puzzles above, this project uses a full engine appropriate to spatial movement, animation, and an announced stage-editor direction.

## What to borrow when designing your own web puzzles

These are design/implementation conclusions from the entries above, not claims about the author's intentions.

| Pattern | Why it works | A practical way to build it |
|---|---|---|
| Ordinary interface elements become puzzle material | Players revise an assumption about the screen instead of merely entering a harder answer. | Use real DOM text/buttons as inspectable objects; maintain explicit object identity and interaction state. Float is a useful example. |
| One interaction, several rules | Reusing one control makes a later exception meaningful and keeps the interface learnable. | Separate a small action reducer from stage data and validation; introduce the exception only after the base rule has evidence. |
| Cross-stage consequences | A solved stage remains relevant, so remembering earlier tools can replace adding more controls. | Persist inventory/resources across stages and allow revisiting where required; test the final route through the whole state machine. |
| Immediate, interpretable feedback | A player can test a theory instead of guessing whether the interface registered an action. | Show the changed state; where appropriate expose an error measure or overlay, as in Mebakari's correct-size silhouette. |
| Browser capabilities become mechanics | Pointer position, selection, timing, connection state, and layered elements offer richer verbs than an answer box. | Start from native browser APIs; make the necessary action discoverable, and supply keyboard/mobile alternatives when the design permits. Document any intentional desktop dependency. |
| Keep presentation separate from authoritative state | Attractive interactions do not require a large engine, while server validation can prevent accidental answer exposure. | Choose DOM/SVG for text/forms/layers, Canvas for continuous scenes, and an engine only when its scene/physics/export workflow earns its complexity. |
| A small optional layer adds replay value | Daily seeds, one-shot commitment, memory constraints, or endurance scoring can extend a simple core. | Reuse the same geometric/rule model, vary only the constraint, and clearly state when the goal is a high score rather than a fixed solution. |

For this project's first few original games, the evidence supports keeping Svelte as the page/state layer and adding browser-native SVG, Canvas, pointer, and Web Audio APIs as needed. That is a proposed recreation approach, not a claim that SAJI uses Svelte. The catalogue itself demonstrates that a game engine is a per-project decision, not a requirement shared by every game.

## Inventory entries outside the 29 enabled games

### ことばこーぼー — Kotobakooboo (`kotobakooboo`, SITE)

- **Goal:** search Japanese words by specified conditions, rather than solve a single authored puzzle. The catalogue explicitly labels this entry `SITE`, not `GAME`/`NAZO`. [Catalogue metadata](https://sajiqook.jp/saji_meta.json), [site](https://kotobakooboo.com/).
- **Solution:** not applicable as a fixed game solution; its output depends on the user's search conditions. A useful role in a puzzle workflow would be candidate-word generation, but that is a proposed use, not a hidden solution to another game.
- **Tools:** the public HTML loads `/_next/static/chunks/…` assets, including a `turbopack-…` runtime. Those are Next.js/Turbopack build signals; the package versions and underlying word-search backend were not established by this inspection. [Public HTML](https://kotobakooboo.com/).
- **Interest:** its role is a word-construction/search tool alongside the authored games. No specific puzzle twist is claimed.

### 能力じゃんけん — Ability Rock–Paper–Scissors (`janken`, disabled)

- **Goal in metadata:** a one-versus-one psychological rock–paper–scissors game with special abilities. Its `enabled` field was `false` in the research snapshot, so it is not one of the visible enabled games counted above. [Metadata](https://sajiqook.jp/saji_meta.json).
- **Solution / guess:** no verified public play session or ruleset was examined. A cautious hypothesis is that predicting the opponent and managing special-ability information matters more than selecting a universally winning move; a full strategy cannot be derived from the catalogue description alone.
- **Tools:** not established; do not infer an engine from neighbouring games.
- **Interest / twist:** hidden information plus abilities is the advertised premise, but the actual power rules and interface remain unverified.

## Remaining research limits

The report covers the catalogue inventory, not a claim of completing all games. Some exact answers are established by readable or encoded frontend validators; others are proposed next steps based on visible clues, UI behavior, and client-side state. A hash or client condition confirms what the inspected frontend expects but does not prove that a live server accepted it. Server-private stages, password-protected bonus content, and paid author explanations remain unavailable unless specifically noted as accessible.

Where a game is open-ended or procedurally generated, a winning strategy or exact rule replaces a nonexistent single answer. Where the public information is insufficient, the report explicitly says so instead of inventing a final password. The catalogue and asset URLs may change; the raw research snapshot under `scratch/saji-research/` is the local evidence behind this dated report.
