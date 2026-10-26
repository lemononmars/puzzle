# Pip's Plot browser puzzles

Enter at `/puzzles/pips-plot`, a garden-themed game title screen with an illustrated dice bed and mode menu. The previous `/puzzles/devil-dice` route redirects permanently to the new landing page. Tutorials, Puzzles, Endless, and online Battle have separate subroutes. See [online hosting and rules](demon-dice-online.md). The title screen credits Devil Dice as the inspiration. The pure game engine remains in `src/lib/games/devilDice.ts`.

Gameplay reference: [Giant Bomb's Devil Dice guide](https://giantbomb.com/wiki/Games/Devil_Dice).

- Moving a die into an orthogonally connected group of equal faces 2–6 clears the group when it reaches the face value. Same-face dice can join a sinking group. Walking alone does not activate starting groups.
- Ones cannot clear as an ordinary group. Happy One activates only when a 1 is rolled or pushed beside a sinking die. A stationary 1 beside a new match, a character walking nearby, or a tick/spawn never activates it. All ones clear except the die supporting the character.
- Normal dice slide one cell when pushed; wood dice roll. Metal (the guide's iron) cannot be pushed or rolled, but can be walked across and matched.
- Ice slides to an obstruction or board edge and transfers its motion to another ice die on collision. Each slide reserves its destination, but matching waits for actual arrival. Relays start sequentially at contact, and the visible move counter ticks once for each square crossed. The player can continue moving during slides. Stone can be rolled from above but cannot be pushed.
- A character atop dice can walk across occupied neighbors or roll their current die into an empty square. Rolling into a sinking die is blocked until it is a quarter sunk; then the roll removes the sinking die and replaces it. Walking between sinking dice remains possible.
- A die at least a quarter sunk, or a forming die, allows climbing from ground to dice height. Hold the directional key or touch arrow at that edge for 180ms to climb automatically. Dropping toward empty ground is allowed as soon as the supporting die starts sinking, with the same hold interval; it does not require a low die. Releasing the arrow, switching direction, losing focus, or pausing cancels the hold. A die forming under the character lifts them automatically.
- Regular, wood, and stone movements cost one move. Ice costs one move per square traveled, including each die in a relay. Walking and climbing/dropping do not count. Tutorials count moves upward beside a target; puzzles show their remaining allowance at the upper right of the field.

Endless uses a 6.5-second sinking period; tutorials use six seconds. These are tuning choices. Tutorials include ground starts and a target validated against their solution. The target is optional: extra moves never block a tutorial. Battle uses a separate authoritative online room service.

Tutorials use a single level selector showing only the ID and name. The controller uses equal-size arrows in a cross. Undo (Z), Restart (R), Hint and tutorial dice information are always visible. Shortcuts work while the game buttons have focus. A lesson clears as soon as every remaining die is matched, while the dice are still sinking. Clear appears at the top of the field, followed by Next level at the bottom after 800ms, leaving the center unobstructed.

The centered tutorial selector groups A–E with native option groups. Completed tutorials and puzzles use a colored selection background, saved separately in local storage under `demon-dice.completed.tutorials.v1` and `demon-dice.completed.puzzles.v3`. The puzzle key is versioned for the replacement campaign. Invalid saved IDs are ignored and unavailable storage is tolerated. Tutorials award one star for completion and a second for meeting the target. Best move totals persist in `demon-dice.tutorial-best.v1`; a worse replay never removes an earned star. First encounters with each dice material open an explanation modal; OK closes it and the info button reopens it. Help pauses the board and shifts deadlines on close. Seen materials persist in `demon-dice.seen-types.v1`. Sound toggles use accessible speaker icons.

## Tutorials A–E

`devilDiceTutorials.ts` contains 25 levels with starting orientations, a learning objective, a hint, and a validated solution including waits and climb/drop actions.

- A1–A5: ordinary pushes; an L-shaped two-push chain; crossing a sinking bridge on a 2×7 field with r2c1–r2c4 removed; two pairs in four pushes with a wait between pairs; and Happy One. A4 uses a 3×5 field, with dice at r1c2, r2c3, r2c5, and r3c2.
- B1–B5: rolling from above, walking across adjacent dice, maneuvering three 3s, riding then dropping to push, and pushing then climbing to roll.
- C1–C5: wood pushes change the top; two turns, corners, threes, and chain extensions.
- D1–D5: ice stops, board edges, momentum transfers, chain slides, and a relay around a corner.
- E1–E5: fixed partners, rolling stone, walking across metal, maneuvering stone, and a final climb/roll/Happy One combination.

## Puzzles

`demonDiceChallenges.ts` loads twenty constraint-designed boards with explicit validated solutions and move budgets, including per-square ice costs. The new campaign progresses through access and order, wood orientation, ice banks, stone riding with fixed metal partners, and combined materials. See the campaign design document for search limits and solution traces. Walking and height transitions are free. The interface rejects a move that would exceed the budget while still allowing free movement, undo, and restart.

## Endless

`/puzzles/pips-plot/endless` starts on a settings screen. Choose regular, wood, ice, stone, or mixed dice; metal remains puzzle-only. Settings are retained across retry/back within the page. Ending a run returns directly to settings with an option to view its summary. Losing plays a short dizzy-demon animation, then opens a score/level/time/cleared/best-chain summary with Retry and Back to settings actions.

Dice choices use illustrated radio cards with material previews. Every run randomly chooses the player's supporting die from the eight starting dice. Endless has no dice-move allowance; tutorial and puzzle budgets must never apply to this mode. Time and summary duration use `mm:ss`. The browser regression test `tests/browser/demon-dice-endless.spec.ts` covers rolling repeatedly and after more than a minute.

The field is 6×6. Each incoming die reserves an empty square with a ground glow three seconds before appearing, then takes four seconds to rise. Rolling a full die into a forming die rolls normally and swaps the forming die into the vacated square without resetting its rise deadline. Rolling onto a pending ground warning relocates the warning into the vacated square.

Levels start at 1. Total score thresholds are 0, 100, 300, 600, 1000… (`50 × level × (level − 1)`). Ground warning scheduling starts 6.5 seconds apart and accelerates by 450ms per level down to 1.1 seconds. Existing warnings retain their appearance deadline. The run ends only when all squares contain dice and no die is still rising. Clearing a square before the last die completes its rise avoids losing.

Pause/resume shifts sinking, rising, warning, and schedule deadlines; hiding the tab pauses automatically. The playing HUD contains score, level, time, and level progress. Settings, occupancy counts, spawn countdowns, introductions, and state text are absent from the active playfield. Holding Space accelerates spawn scheduling, ground warnings and rising dice by 4×, without speeding up sinking or the run clock. When fewer than the eight starting dice remain, the field shows the Space tip. Blur, pause, key release and ending a run cancel acceleration.

Initial matches award their total pips. Each extension awards the pips still in the connected group multiplied by the next chain multiplier. Two 2s score 4; a third adds 12; a fourth adds 24. New additions sink for their own full duration; the chain persists on surviving members until the last disappears. Extensions still require at least the face value in the connected group. Happy One awards one point for each one actually removed.

## Rendering

`devilDiceScene.ts` owns a lazy-loaded Three.js orthographic scene. The visible face textures use the engine's exact top/north/east orientation, and opposite faces sum to seven. Regular face colors follow the reference: white/red-pip 1, yellow 2, blue 3, cyan 4, green 5, pink 6. Each special type uses one color on all faces: brown wood, blue ice, gray stone, and silver metal, with material markings. Cast shadows are disabled.

The garden setting uses textured lawn tiles, a moss-colored base, and low-poly leaves and flowers around the perimeter, with a soft botanical page background. Dice faces omit the inset frame and bottom labels. Fading faces retain depth writes so a sinking cube stays closed. When riding a die, an upper-left inset renders the same face textures and animated quaternion in a second viewport on the same canvas; the preview remains opaque and does not sink.

Pip, a terracotta seedling with two leaves, root feet and dark eyes, replaces the horned character. Leaves flutter during movement; Pip crouches when riding, wilts on losing, and blooms on the summary screen. A matching SVG mascot appears on the title screen alongside gently floating dice, swaying flowers and mode icons. Clicking Pip (or activating the button by keyboard) produces a wide smile, a happy hop and an original three-note chirp. Completing a board plays a root-kicking, leaf-waving hop-and-turn celebration in the 3D scene. All title-screen dice use valid engine orientations (opposite faces total seven); their visible face triples differ. Reduced motion disables decorative loops and entrance motion.

The character faces the direction of successful movement. Walking and rolling use a 400–420ms smoothstep motion, with alternating root-foot steps and a small hop; each roll composes a world-space quarter-turn onto the previous quaternion and retains that orientation afterward. Face textures stay attached to the cube. Ice slides take 380ms + 190ms per cell, capped at 1.8 seconds, and input cooldown during slides stays capped at 260ms: character movement does not wait for the slide animation. Each die has an independent animation timeline. Sinking translates a full-size cube downward while opacity gradually drops from 1 to 0.08; a ground clipping plane hides its underground portion. Spawning translates upward through the same plane. Reduced motion skips movement, rolling, and vertical animations while preserving final orientation; warning effects stay static and loss transitions are shortened. Rendering resources and resize observers are disposed on navigation or restart. Motion adapts the tumble, glow, and bounce references from [Takayu Studio](https://motion-reference.takayustudio.jp/).

`devilDiceAudio.ts` synthesizes separate walking, rolling, and pushing sounds using Web Audio. Material timbres distinguish regular clicks, hollow wood knocks, bright ice chimes, low stone thuds, and longer metallic rings (including footsteps across fixed metal). Audio starts only after a user gesture and can be muted with the Sound button. It is disposed when leaving the page. The ridden die inset has a frame and “Now” label.

`demonDiceMusic.ts` plays original stereo background loops: “Garden Steps” (72 BPM, warm electric piano and soft bells, 53 seconds) for tutorials/puzzles, and “Twilight Drift” (84 BPM, ambient keys, bass and gentle percussion, 46 seconds) for Endless. The Sound control mutes music and effects together. Music starts after interaction, continues between tutorials, and pauses when hidden or paused and outside active Endless play. Leaving the game releases the audio element. Regenerate both MP3 assets with `node scripts/generate-demon-dice-music.mjs` (requires ffmpeg); the deterministic source includes circular reverb tails for loop continuity.

Run mechanics checks with `npx vitest run src/lib/games/devilDice.test.ts`.



A1 introduces matching and winning, A5 explains Happy One, and B1 illustrates rolling with before/after dice. These lessons retain a short goal inside the field. The replacement 20-puzzle campaign and legal solution traces are documented in [campaign design](demon-dice-puzzle-campaign.md).



