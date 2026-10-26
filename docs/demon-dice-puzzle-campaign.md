# Demon Dice: replacement puzzle campaign

These twenty new layouts replace the previous set. The authoring constraints were selected from [the design research](demon-dice-design-research.md), then a deterministic search found legal multi-step plans. Every board has blocked cells, starts without an automatic match, and requires moving at least two distinct dice in its verified plan. Hints name the question rather than give direction sequences.

The checked traces prove solvability within the displayed budgets. Search limits and stance abstractions are recorded with each board; these are not claims of unique solutions or mathematically optimal budgets. Alternate solutions are valid.

| Level | Name | Focus | Budget | Actions incl. waits | Search states |
|---|---|---|---:|---:|---:|
| P1 | Passing place | Access and order | 6 | 15 | 1249 |
| P2 | Shared courtyard | Access and order | 6 | 29 | 7328 |
| P3 | Close the gate last | Access and order | 7 | 20 | 2321 |
| P4 | Three crowded beds | Access and order | 7 | 26 | 1245 |
| P5 | The long way round | Orientation | 6 | 12 | 2214 |
| P6 | Turn before the doorway | Orientation | 6 | 18 | 9476 |
| P7 | Two wooden keys | Orientation | 7 | 27 | 9675 |
| P8 | One square to turn | Orientation | 7 | 30 | 5629 |
| P9 | Borrowed bank | Momentum | 5 | 12 | 5711 |
| P10 | Pass the stopper | Momentum | 6 | 12 | 5230 |
| P11 | Two frozen lanes | Momentum | 8 | 27 | 8325 |
| P12 | Return the bank | Momentum | 10 | 43 | 3598 |
| P13 | Stay above ground | Stance and support | 6 | 8 | 14336 |
| P14 | A borrowed foothold | Stance and support | 6 | 8 | 12019 |
| P15 | Trade the driver | Stance and support | 8 | 10 | 10174 |
| P16 | The last bridge | Stance and support | 10 | 21 | 13004 |
| P17 | Different answers | Synthesis | 5 | 9 | 8083 |
| P18 | Timber on ice | Synthesis | 6 | 19 | 2887 |
| P19 | One path, two stances | Synthesis | 9 | 25 | 529 |
| P20 | The patient garden | Synthesis | 9 | 26 | 7012 |

## Access and order

Clearing changes access: choose the pair order before committing a die to an edge.

Tempting mistake: A convenient first pair can strand another die against an edge or hole.

## Orientation

A wooden die must reach the right location with the right orientation; the shortest spatial route can show the wrong face.

Tempting mistake: Pushing straight toward the partner can leave the wrong number facing up.

## Momentum

A sliding die needs a useful bank, and that bank must remain until the route is complete.

Tempting mistake: Clearing the easy pair first can remove the stopper needed by the remaining ice.

## Stance and support

The current supporting die is a resource: preserve a route onto the next movable die before the first group disappears.

Tempting mistake: Making a match from the wrong support can leave Pip on the ground with stone still to move.

## Synthesis

The same space plays different roles for different materials; coordinate a wood orientation with an ice stopping position.

Tempting mistake: Treating wood like a slider, or clearing stone/metal before the ice is parked, breaks the intended route.
