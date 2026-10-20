# SAJI game research — early group

Research based on public first-party HTML and shipped JavaScript, retrieved 20 October 2026. Exact answer conditions below were checked against client code, including locally decoding embedded strings and comparing hashes. These are source-confirmed solutions, not claimed browser playthroughs. No downloaded JavaScript was executed and no private service or paid hint article was accessed. Each “interesting” assessment is an interpretation of the evidenced mechanism.

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
