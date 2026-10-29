# Pip’s Plot Random garden

Original AAA–JJJ collection, version 1. These boards are generated for Pip’s Plot,
not reconstructed from Devil Dice’s additional puzzles.

- 1,000 stable IDs; six normal dice on a complete 4×4 field.
- Original-style 20-move allowance. Every board has a six-sixes solution within
  15 dice moves; walking between dice does not consume moves.
- One star for a sixes finish, two for a sixes finish within 15 moves.
- Accessible directly through Random on the main menu; no Retro unlock required.
- Completion and best sixes results use separate Random local-storage keys.

Regenerate with `python scripts/generate-pips-random.py`. The seeded generator
grows connected six-cell goals, assigns physical dice orientations, then scrambles
with reversible riding/walking moves. It rejects intermediate matching groups and
duplicate starts. The reverse paths are solution certificates, not optimality claims.

`src/lib/games/pipsPlotRandom.test.ts` replays all 1,000 certificates through the
production engine, checks physical orientations and board uniqueness, rejects early
matches, and verifies all six dice finish as sixes within 15 moves.
