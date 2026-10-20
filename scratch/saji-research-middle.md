# SAJI research — middle catalogue group

Research date: 2026-10-20. Spoilers. These notes inspect public first-party HTML and shipped JavaScript, not the author's paid hint article. “Code-confirmed” means the public implementation supports the result; it does not mean a full browser playthrough was completed. Obfuscated public sources were decoded as text, not executed. Source snapshots are in `scratch/saji-research/middle/`. Library absence statements apply only to inspected assets.

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

## だるまさん (`darumas`)

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

## 魔法図書館 (`maglibrary`)

**Goal.** Find three books by exploring a library, collecting ordered fragments, and eventually learning magic to reach a secret room. [Game](https://sajiqook.jp/game/maglibrary/).

**Solution — code-confirmed main path.** The rooms form a kana layout, with each room representing a syllable. Search rooms in these orders: chapter 1 **ほ → し**; chapter 2 **ま → ほ → う**; chapter 3 **り → ゆ → secret room → う**. The secret room modifies the preceding kana, turning ゆ into small ゅ and producing **りゅう**. After learning まほう, use `teleport` to enter the otherwise isolated secret room, search it after ゆ, teleport back, and search う. Coordinates (row, column, one-based) from the shipped room map: ほ=(6,8), し=(2,7), ま=(8,2), う=(1,2), り=(8,7), ゆ=(7,5), secret=(11,2). Clicking a room computes a walking path; use “search” only at the desired fragment rooms. [Game script](https://sajiqook.jp/game/maglibrary/game.js?v=20260929-special-record), `packedRooms`, `chapters`, `attemptSignature`, `searchCurrentRoom`, `teleport`.

**Tools and implementation.** DOM room buttons, CSS avatar transforms and lighting, a custom shortest-path traversal, `requestAnimationFrame` for moving light, Web Audio and PHP records. Motion checks `prefers-reduced-motion`. These inspected assets do not expose a general game engine.

**Why interesting.** The spatial map is also a writing system. Early illuminated rooms teach movement; later darkness makes remembering the underlying kana structure valuable. Magic changes navigability, while the secret room changes orthography. Optional discovery **と→く→し→ゆ→secret→ま→ほ→う** unlocks special magic, allowing further interaction variants. The main fragment signatures and optional spellbook sequence are explicit in code; optional endings and their full routes were not exhaustively played.

## おばけ屋敷 (`obakeya`)

**Goal.** Escape a haunted house by reading a mysterious paper, using a purifying memo, and entering the password. The page explicitly warns that letters can be disguised and that transcribing them restores their true form. [Game](https://sajiqook.jp/game/obakeya/).

**Solution status — confirmed mechanism, final password unavailable.** Select and **copy the suspicious text from the paper**, switch to the memo tab, and **paste** it there. This is substantive: the paste handler reads `clipboardData.getData('text/plain')`, detects Unicode private-use characters (`U+E000–U+F8FF`), and sends that copied string to the normal `purify` operation. The returned plain text replaces the pasted selection. Read the purified text and fill the password panel. **Concrete tentative continuation:** copy the entire paper rather than manually typing its visible glyphs; paste once, then use any revealed instruction to identify the password and copy additional suspicious text the same way. This should expose information unavailable from visual transcription. Confirmation requires observing the returned purified message and a successful ordinary password submission; I do not have evidence for a literal final password.

**Tools and implementation.** Vanilla JavaScript DOM tabs, native text selection/clipboard paste, textarea selection replacement, a custom glyph-disguise system, Web Audio synthesized atmosphere, viewport sizing, and a PHP JSON backend. [Application script](https://sajiqook.jp/game/obakeya/app.min.js?v=26), paste listener, function `L`, operations `purify`, `panel`, `check`, and answer-form submit handler. Password checking and purified content are server-side, so static frontend inspection alone cannot substantiate an exact answer.

**Why interesting.** Reading and copying are different actions with different outcomes: a web text representation becomes a supernatural disguise, while a mundane memo becomes a tool inside the story. This makes browser affordances feel diegetic. For adaptation, the private-use glyphs and underlying text should be deliberately authored and paste transformation should remain accessible. No private endpoints were enumerated, and no backend answers were brute-forced.
