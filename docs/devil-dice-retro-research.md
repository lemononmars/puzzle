# Devil Dice Retro research

Investigated 27–28 October 2026. The 100 original board layouts are now reconstructed and playable in Pip's Plot's Retro mode. `docs/retro-stages-verified.json` is the consolidated reconstruction record; the other observation files retain the research history, including readings corrected by replay checks.

## Implemented Retro pack

Route: `/web-game/pips-plot/retro`. All 100 boards clear within their original move allowances in the current engine. Ninety-nine clear with the historical normal-solution reference; Stage 096 requires the final LEFT push shown at approximately 1852s in the recording, rather than the written guide's final UP. That correction clears in exactly 12 moves. No guide prose or full solution list is published in the game.

Board shapes, materials and top values were cross-checked against the top-down catalogue. Starting positions were checked against the earliest board/selection views, since the player often walks without consuming a move before the main view settles. Visible face readings were completed using the 24 rigid orientations of the physical die layout observed in Stage001 (top1, north5, east3), then checked by replay. Some completely occluded stationary faces cannot be identified from the recording; those are explicitly marked in the consolidated record and use a consistent physical orientation that preserves the verified clear. Thus this is a credited independent recreation, not a claim of bit-for-bit recovery of the original level data.

Retro uses a 4.8-second sink window and the existing automatic climb/drop controls. Its ice stops at the first square that completes a group, but matching starts only once the animation arrives. Pushed wood can roll over a sufficiently low sinking die, matching the same rule as a ridden roll. The ice compatibility flag is confined to Retro so the existing tutorial, puzzle and endless layouts keep their established behavior.

The mode has ten groups of ten stages, independent local completion/best-move records, a bonus star for beating the allowance, Space to continue, undo/restart shortcuts, and in-game original-game/source credits. Data is built by `python scripts/build-pips-retro.py`; the focused unit suite includes structural checks of all100 boards and replay regressions for the opening stages and Stage096.

## Local frame catalogue

The recording is now accessible locally. Extracted **59,850 JPEG frames at 30 fps** from the 480p research copy, covering every frame from the first stage chapter at 11s through the end of stage 100's chapter at 2006s. There are 100 ZIPs in `scratch/retro-frame-archives`, each containing JPEGs and `timestamps.json`. The higher-resolution recording is retained at `scratch/retro-playthrough.webm` for closer inspection.

`scratch/retro-frames/index.html` provides 100 opening contact sheets and links to each stage's full-frame ZIP. Its individual sampled images run at 2fps. Folder names follow the uploader's chapter markers, **not verified gameplay boundaries**: stage009's initial state occurs in the stage-008 chapter. Always check the on-screen stage number. The full sequence is continuous across those boundaries.

Reproduction tools: `scripts/extract-devil-dice-frames.py`, `scripts/catalogue-devil-dice-frames.py`, and `scripts/verify-devil-dice-frames.py`. Validation checked all 100 archives' frame counts and timestamp boundaries and decoded their first/last JPEGs. Frame capture, reconstruction, and clear-replay validation of the100-board Retro pack are complete; see the consolidated record above for inference caveats.

## Source references

- [Original US manual scan](https://www.videogamemanual.com/ps1/Devil%20Dice%20%28USA%29.pdf) and [English manual scan](https://db.hfsplay.fr/files/2021/01/21/devil_dice_english_WviqaVa.pdf): primary sources for rules, controls, and notices. They are not a catalogue of every initial puzzle state.
- [Devil Dice — Puzzle Mode Stages 1–100](https://www.youtube.com/watch?v=Um5NdG5McKI), by BigSilentRob Retro Gaming: recording used for the local captures. Sampled and full-frame exports are complete. Stage 001 has been visually checked as described below.
- [Verified 100-puzzle speedrun category/run](https://www.speedrun.com/devil_dice/runs/zx65l38z): another recording candidate. Confirm region/version before combining observations.
- [aLea-aRea basic puzzle catalogue](https://scrapbox.io/alea-area/XI(s%C3%A1i)_%E5%9F%BA%E6%9C%AC%E3%83%91%E3%82%BA%E3%83%AB%E4%B8%80%E8%A6%A7): community top-down diagrams. Its public page API contains exactly 100 STEP entries and rows of tile/die icons. The author explicitly describes the diagrams as top views only. These establish board shapes, top values, materials, and move limits, but contain no player start markers or full side-face data.
- [John Talbot’s normal puzzle solutions](https://www.geocities.ws/timessquare/7893/dd/solution.htm): all 100 move allowances and solution sequences, but not their complete starting states. Useful only for cross-checking reconstructed levels. Do not republish the guide or its solution text wholesale.
- [Devil Dice recompilation project](https://github.com/alexbeavs-ps1-ports/devil-dice-recomp): an owned-input reconstruction candidate identified during the main research. It does not bundle the original stage data; it is not a ready-to-import level dataset.

## What remains unknown

The remaining uncertainty concerns a few fully occluded stationary faces; player starts and all gameplay-relevant faces have been reconstructed and clear-replay checked. A top face leaves four possible rotations around the vertical axis; selecting one arbitrarily can change whether a puzzle is solvable. Top texture variants such as `d-02` and `d-02b` do not supply a complete face mapping. The relevant icon pages describe recreated normal/wood top textures, not game-state records, and ask that the author be contacted for use of those image assets outside the site. No third-party icon assets were copied.

## Stage 001 observed initial state

Evidence: `scratch/retro-frames/stage-001/frame-00009.jpg` at 15.0 seconds, `frame-00015.jpg` at 18.0 seconds, and the stage contact sheet `scratch/retro-stage-001-contact.jpg`. Timestamps are recorded in the stage folder's `timestamps.json`.

Use zero-based coordinates with the origin at the rear corner. Increasing x points screen-down-right; increasing y points screen-down-left. The board is a full 4×4 square with no holes. The player starts riding the normal die at `(2,1)`. The HUD shows 2 allowed moves and a three-3s target.

| Initial coordinate | Type | Top | South | East | North (opposite South) | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| (2,1) | Normal | 1 | 2 | 3 | 5 | 15.0s upper-left Info cube shows all three faces; player stands on this die |
| (1,2) | Normal | 3 | 1 | 2 | 6 | Top/South at 15.0s; East becomes visible at 18.0s after the neighboring die moves. This die stays in place and is not rolled |
| (2,2) | Normal | 2 | 3 | 1 | 4 | 15.0s before either counted move |

The North values above are deductions from the game's opposite-face sum of seven, not direct views of the hidden side. This stage demonstrates that occluded initial faces can sometimes be recovered from later footage. This stage is now replay-validated in Pip's Plot. The consolidated record documents the other99 reconstructions separately; region/version equivalence is not assumed.

Stages 002–005 have also been visually transcribed in [retro-observations.json](./retro-observations.json), with evidence timestamps per die and explicit opposite-face deductions. These observations are complete initial states but remain unvalidated against the current gameplay engine. Stage 002's occluded East face is exposed at 26.5s; Stage 004's occluded South face is exposed at 50.0s. No unobserved vertical-axis orientations were assigned.

The same observation file now includes stages 006–010. Stages 006, 009, and 010 have complete face records; 007 retains an unknown East face on the central die and 008 retains an unknown North face on its rear-right die. The raw observation file keeps those direct-observation unknowns as `null`. The consolidated record resolves them uniquely through the verified physical face layout and passes replay validation; the raw file is not the production level pack.

Frame folder names follow video chapter intervals, which do not always coincide with stage transitions: stage 009's actual initial board is at 105.5s in `stage-008/frame-00036.jpg`, while the `stage-009` folder begins after the puzzle is already solved. Use the number displayed in the footage and the timestamp manifest, not folder names alone, for stage identification.

## Credits and implementation prerequisites

Credit the original as **Devil Dice / XI [sai], developed by Shift, 1998**. Regional publishers are **Sony Computer Entertainment** (Japan/PAL) and **THQ** (North America); see the original manual notices and [release records](https://www.mobygames.com/game/8808/devil-dice/releases/). An independent adaptation should not imply endorsement or official status.

The reconstruction retains source/timestamp evidence and distinguishes direct observations, physical-face deductions, and normalized fully hidden faces. Board numbering and move targets were cross-checked, and all100 clear solutions were replayed with Pip's Plot's movement and sinking rules. Differences in climb timing, ice transfer, roll cancellation, or Happy One behavior may require compatibility work. Credit alone does not establish permission to reuse a source's artwork or written walkthrough.

The Retro route and complete100-board pack are now implemented. Fully occluded face completions remain documented as inferences, rather than represented as direct observations.
