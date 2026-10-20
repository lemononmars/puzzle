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
