# Demon Dice: puzzle-design research and Battle rules

Research date: 26 October 2026. This note separates source facts from proposed design criteria for this browser adaptation.

## Primary sources and findings

### A clear goal, backward construction, and testing

Alexia Mandeville describes her own Area 52 design process: choose a mechanic/theme, map the flow from the final goal backward, place obstacles between the player and that goal, make the objective unmistakable, and increase complexity through successive applications of an established mechanic. Her playtesting checks include solvability, objective clarity, and unintended shortcuts. **Application:** write the intended deduction and solution before arranging the board. A longer walk is not a new deduction. A level needs a genuine constraint or dependency that blocks the obvious approach. [Mandeville, *How to Design Puzzle Games*, 2 June 2022](https://medium.com/design-bootcamp/how-to-design-puzzle-games-319aef443c44).

### Clarity without giving the deduction away

In a direct designer-to-designer conversation, Rand Miller distinguishes meaningful freedom from losing the player's path and describes environmental guidance that points toward the relevant place. Jonathan Blow stresses the benefit of obvious, discrete puzzles and predictable interactions. **Application:** use visible holes, material differences, readable side faces, and a clear final matching goal. An obstacle should communicate the question, while the player still has to work out its answer. [Miller and Blow, PlayStation Blog, 24 August 2017](https://blog.playstation.com/archive/2017/08/24/the-witness-jonathan-blow-talks-game-design-with-myst-co-creator-rand-miller/).

### Difficulty from consequences, not obfuscation

Jonathan Blow explains that individual puzzles express an idea. He describes reducing red herrings and keeping puzzles minimal so difficulty comes from not yet seeing the system's possibilities. **Application:** a tempting early match should have a real consequence, such as removing a needed stepping stone. Do not add unrelated dice merely to look complicated. [Direct interview with Blow, TIME, 2016](https://time.com/4355763/the-witness-jonathan-blow-interview/).

## Proposed authoring rubric for twenty replacement puzzles

The following is our design rubric, inferred from the sources above rather than a quotation or claim that any source recommends these exact numbers.

For every puzzle, document:

| Field | Required answer |
| --- | --- |
| Goal | Which complete removal or final combination is required? |
| Insight | One sentence naming the non-obvious consequence the player must notice. |
| Dependency | What must happen before what, and why? |
| Essential constraint | Which hole, orientation, material, or stance makes the dependency necessary? |
| Temptation | A plausible but worse move, with a visible mechanical consequence. |
| Plan | A legal full solution trace, including material motion and necessary waits/transfers. |
| Budget | Dice-move cost of the trace, counting every ice square; avoid padding with free walking. |
| Bypass check | Could a direct match, reversed order, alternate rolling route, or premature Happy One bypass the insight? |
| Escalation | Which earlier insight does this puzzle extend or combine? |

Reject a candidate if one or two direct moves clear everything, if its only difficulty is walking around an open board, if a constraint has no purpose, or if the claimed dependency is optional at the same budget. A solution trace proves solvability, **not** uniqueness or optimality. Only label an optimum/unique solution when the bounded search actually proves it. Leave alternate equally elegant solutions valid.

Suggested campaign structure:

| Puzzles | Focus | Required form of reasoning |
| --- | --- | --- |
| 1–4 | Space and access | Choose an order; clear a gate while preserving access or support. |
| 5–8 | Orientation | Route length/turn order changes a die's top; the short spatial path can have the wrong face. |
| 9–12 | Momentum | Place or preserve a stopper before an ice push; eventually clear the stopper too. |
| 13–16 | Stance and support | Exploit ground pushing versus riding; keep a bridge until it has served its purpose. |
| 17–20 | Synthesis | Reuse a die as support/stopper before matching it; combine orientation, order, and material constraints. |

For automated verification: replay every trace under the real engine; assert the final clear and budget; validate all six face numbers/opposites; check coordinates and duplicate occupancy; run a cheaper-solution search where tractable; explicitly test the intended wrong-first-move branches. For human review: give the board to a fresh player without the solution, observe what they think the goal is, and ask what insight resolved it. Do not claim the latter has happened based only on automated tests.

## Original Battle mode: verified rules

The USA instruction manual, printed pp. 11–12 (PDF pages 13–14), establishes:

- Two opponents share one playfield.
- Choose **three, four, or five distinct patterns**. Four is a reasonable adaptation default; the original default is unverified.
- One box per face value; repeats do not add boxes. First to fill the target wins.
- Steal an owned value by matching it again or attaching a same-faced die to the rival's descending group.
- Crushing a grounded rival steals their pattern matching the die's **top after rolling**.
- “Check” means one pattern remains.

**Crush ownership interpretation:** require the rival to own that face before transferring it. The manual describes stealing “his pattern”; it does not explicitly demonstrate crushing for an unowned face. Granting a fresh premium is unsupported.

Battle scores pattern ownership, not Trial points. Wars (printed pp. 13–14) uses life damage, resolves sets when they disappear, and heals via Happy One. Puzzle (pp. 15–16) uses move limits, impassable holes, and sometimes multiple successive patterns. [Original USA manual](https://www.videogamemanual.com/ps1/Devil%20Dice%20(USA).pdf).

## Wiki-specific details and confidence

The supplied Giant Bomb main host returned 403 during research, but its origin mirror was readable. Its Battle section says each face 1–6 has a premium, claims can be stolen through a same-value match, chain extension, or crushing, and stone-die crushing causes an immediate win. It lists time settings of 3 minutes, 5 minutes, or unlimited, plus board/grid/type choices. Its Trial scoring section gives pip totals and increasing chain multipliers; that formula belongs to Trial, not Battle's premium gauge. [Giant Bomb origin mirror, Battle/Trial/Wars sections](https://wiki-origin.giantbomb.com/wiki/Games/Devil_Dice).

Confidence is high for the manual-verified facts above: they were read directly from rendered pages. Stone instant-win and the exact timing/configuration values above are supported by the requested wiki but were not corroborated in the manual pages inspected. The sources inspected did not settle time-expiry ties or simultaneous last-pattern awards; any handling of those cases should be documented as an adaptation, not attributed to the original.

Online room transport, synchronization, reconnect policy, avatar customization, and modern keyboard/touch controls are application choices; the original rules sources do not prescribe them.


## Concrete twenty-puzzle authoring brief

These are **proposed construction briefs**, not tested layouts. Names, mechanisms and move bands below are authoring targets. The implementation's exact-engine search must supply each actual board, legal solution, lower-bound result and wrong-branch evidence. Do not ship a brief whose intended dependency is bypassed by a simpler engine-legal sequence.

All twenty should require at least four dice moves in the verified search model. Suggested bands describe progression; they are not claims of measured optimal cost. Walking, waiting and climbing are not to be inflated into artificial difficulty. A valid alternate solution is welcome when it preserves the level's reasoning challenge.

### Family 1 — Access and commitment (P1–P4)

**P1 — The Garden Latch**  
Intended insight: move a useful die away from its matching partner before bringing it back. Essential dependency: the movable normal die temporarily controls the side approach to a narrow passage; it must be repositioned while another die crosses. Temptation: push it directly into the obvious pair, making it sink before its positioning job is finished. Construction target: 4–5 dice moves, two useful phases, no immediate full clear. Verify the direct-match branch cannot solve within the target.

**P2 — A Passing Place**  
Intended insight: a small alcove is working space, not the destination. Essential dependency: two movable dice share a one-cell lane and need to pass or change pushing sides; one must be parked in the alcove and retrieved. Temptation: keep pushing toward the visible partner and lose the required approach square. Construction target: 4–6 moves. Verify that widening the lane or deleting the alcove meaningfully changes the solution.

**P3 — The Last Corner**  
Intended insight: order the final approaches so no die is committed to an unrecoverable corner too soon. Essential dependency: two matching groups compete for the same turning square; one die must first make room for the other and later return. Temptation: make the visually nearer match or corner placement first. Construction target: 5–6 moves. Test recovery through riding and sinking steps before calling a corner a dead end.

**P4 — The Gatekeeper**  
Intended insight: a die can be both a temporary stopper and the key that clears a fixed metal gate. Essential dependency: position the movable partner to route another die before matching the metal. Temptation: unlock the gate immediately and permanently lose the necessary stopper. Construction target: 5–7 moves. Every gate/stopper must eventually be cleared; the second task must use the same resource rather than an unrelated remote pair.

### Family 2 — Orientation as a spatial constraint (P5–P8)

**P5 — The Twisted Path**  
Intended insight: the destination alone does not determine the top face; turn order matters. Essential dependency: holes create two plausible routes for a ridden die, only one of which reaches the matching anchor with the required orientation within budget. Temptation: take the shortest-looking route. Construction target: 4–6 rolls. Compare both actual engine face triples at the destination; do not infer validity from path length alone.

**P6 — Two Fronts**  
Intended insight: prepare two dice for two different faces before committing either to a sinking group. Essential dependency: two rolling routes share a staging square, and the first match removes or locks a required movable resource. Temptation: complete the first available match without preparing the second route. Construction target: 5–7 moves. The obstruction should be a real shared square/material, not a written sequencing instruction.

**P7 — No Room to Turn**  
Intended insight: orient the stone in the roomy area before sending it into the narrow lane. Essential dependency: one small turning pad permits a nontrivial orientation loop; the lane itself does not. Temptation: enter the lane first and discover that the visible matching number is on the wrong face. Construction target: 6–8 rolls. Verify there is no equal-cost reverse route or roll-over shortcut that makes the turning pad irrelevant.

**P8 — The Long Way Home**  
Intended insight: a loop that returns to the same square can still change the die's orientation. Essential dependency: a temporary bridge permits an orientation-changing circuit; only after using it can that bridge be included in the final match. Temptation: treat returning to the same square as wasted movement, or remove the bridge before the circuit. Construction target: 6–8 moves. Reject routes whose effect is merely immediately rolling forward and backward, which cancels.

### Family 3 — Momentum and reusable stoppers (P9–P12)

**P9 — A Borrowed Bank**  
Intended insight: the board edge is not the only way to stop ice. Essential dependency: a normal die must be positioned as a bank so ice stops at an interior square, after which the bank must be retrieved and matched. Temptation: launch the ice before preparing the bank. Construction target: 5–7 dice-square moves. The wrong launch must miss the useful stopping square, not merely take longer to animate.

**P10 — Two Ponds, One Bank**  
Intended insight: preserve and relocate a stopper between two different slides. Essential dependency: the same normal die banks both ice paths and must not match after the first. Temptation: accept the first easy pair and lose the bank for the second route. Construction target: 6–8 dice-square moves. Reject layouts with a spare edge/obstruction that makes the second banking task independent.

**P11 — The Relay Switch**  
Intended insight: the die first pushed need not be the die that performs the important long travel. Essential dependency: a movable stopper determines where a momentum relay hands off and where its first die parks; that parked die is needed later. Temptation: route only the last ice die and ignore the first die's position. Construction target: 6–9 dice-square moves. Verify both final positions and the sequential collision timing.

**P12 — A Frost Ladder**  
Intended insight: a parked ice die can become a walking route before it becomes a match. Essential dependency: Pip, initially riding, must use the ice's arrival position as access to another die, then roll or reposition it for the final group. Temptation: park the ice at its matching partner immediately, losing a movable access resource. Construction target: 6–9 moves. Avoid requiring a ground player to climb an ordinary full-height die; use a legal existing ride/step route.

### Family 4 — Stance, weight and global effects (P13–P16)

**P13 — The Wooden Key**  
Intended insight: plan both the wood's final face and where Pip will stand after moving it. Essential dependency: a ground push and a ridden roll can leave the die similarly oriented but put Pip on different squares/heights, affecting access to a stone. Temptation: choose a correct-looking wood roll that strands Pip on the wrong side. Construction target: 6–9 moves. The next approach must make the stance difference matter.

**P14 — A Heavy Shortcut**  
Intended insight: use stone as a movable obstruction from above before letting it match. Essential dependency: riding across fixed metal reaches the stone; rolling the stone first exposes the pushing side of a wood/normal die, and the stone is matched only afterward. Temptation: roll straight into the stone's visible final partner. Construction target: 6–9 moves. The metal bridge should provide access without becoming a redundant decorative obstacle.

**P15 — One Left Behind**  
Intended insight: Happy One does not clear the die supporting Pip. Essential dependency: a ridden die turns to 1 while triggering the other ones, then must be rolled to another usable face and matched through a prepared route. Temptation: clear the last non-one partners too early and leave the ridden 1 without a finishing plan. Construction target: 7–10 moves. Test the actual supporting-die exception; do not assume all ones vanish.

**P16 — Changing Places**  
Intended insight: preserve a normal die's face with ground pushes while staging it, then deliberately ride it to change that face. Essential dependency: the die first serves as a precisely located obstruction, then becomes a rolling match key after a legal climb/crossing. Temptation: ride it during the positioning phase or push it during the final orientation phase. Construction target: 7–10 moves. The fixed anchor's value and route must distinguish these choices.

### Family 5 — Synthesis with no spare pieces (P17–P20)

**P17 — The Living Dam**  
Intended insight: a wooden stopper has both a position and an orientation to prepare. Essential dependency: wood must bank an ice slide at an interior square while retaining a face arrangement that can later be matched. Temptation: put the bank in the correct square via the wrong rolling route. Construction target: 8–11 moves. Both the ice stop and eventual wood clear must be verified; avoid an alternate normal stopper.

**P18 — Three Locks**  
Intended insight: the order of matching three groups is the real key. Essential dependency: one group opens access, another supplies a temporary movable stopper/support, and Happy One clears remaining fixed one-valued pieces only after their job is done. Temptation: take an easy 2-pair or activate Happy One as soon as it appears. Construction target: 8–12 moves. Each group must affect the next; three unrelated mini-puzzles do not meet the brief.

**P19 — Uneven Symmetry**  
Intended insight: geometrically similar routes can behave differently when one side uses wood and the other uses ordinary or stone dice. Essential dependency: the first side establishes a reusable position or bridge, but mirroring its move sequence on the second changes the wrong face or requires the wrong stance. Temptation: repeat the successful first-half sequence mechanically. Construction target: 9–13 moves. Make the material difference legible; do not hide a rule change.

**P20 — Keeper of the Garden**  
Intended insight: prepare, reuse, then clear resources in a deliberate dependency chain. Essential dependency: every die has an interim role—bank, bridge, rolling key, or final anchor—and at least one resource is reused across two mechanisms before being removed. Temptation: greedily clear the largest available group or resolve each material independently. Construction target: 10–16 moves with roughly 6–10 purposeful dice, subject to search. Require at least three dependent phases and a verified nontrivial finishing plan; do not add pieces solely to increase length.

## Reusable constraints and exact-engine cautions

- **Holes and approach squares:** remove a specific pushing side, create a one-cell lane or a turning pad, or force a route choice. A hole must be essential to the intended dependency.
- **Orientation order:** use actual `top/north/east` transitions. Two routes with equal endpoints or similar lengths can differ; pure backtracking cancels. The preview should make the relevant side face readable.
- **Temporary stoppers:** a die that is useful before matching becomes immovable once it starts sinking. This is a stronger immediate commitment than merely deleting a walking bridge after a timer.
- **Support preservation:** do not assume that making a bridge sink removes it instantly. The engine leaves a usable sinking interval and permits climbing when low; a player may bypass a supposed dependency by crossing during that interval.
- **Ground versus riding:** a normal push preserves its face, wood pushes roll, stone cannot be ground-pushed, metal cannot move, and a ridden move onto a neighboring occupied die is a walk rather than a roll. These are useful state constraints, but a legal transfer route must exist.
- **Matching versus finishing:** the game clears when all dice are matched, not after every die has physically disappeared. Any claimed later requirement must occur before the final full match.
- **Happy One:** only a moved 1 next to a sinking group triggers it; the supporting 1 survives. A stationary 1 is not an automatic clear.
- **Ice:** destination reservations are not arrival. Include the sequential slide timeline, per-square move cost, and match-on-contact behavior in the solver trace and shortcut checks.
- **Time windows:** build reasoning challenges rather than reflex tests. If a design depends on sinking access, include explicit waits/transfers in the trace and test with the real movement cooldown. Reject solutions needing tighter timing than normal controls comfortably permit.

These cautions summarize the repository's existing engine contract for authoring; they do not claim to reproduce every original-console mechanic. Final authored boards should record which brief they satisfy and which tempting branches the search actually checked.

