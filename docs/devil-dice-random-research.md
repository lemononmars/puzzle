# Devil Dice / XI: the extra 1,000 puzzles

Researched 2026-10-29. This is research only; no additional levels were implemented.

## Confirmed behavior

Richard Uyeyama's firsthand record of solving all 1,000 Japanese XI puzzles establishes:

- Clearing the original 100 unlocks Random mode.
- Its boards are repeatable, numbered **AAA–JJJ**. Interpreting A–J as digits 0–9 gives 000–999.
- Random chooses a starting board; it does **not** invent a new board on every play. Players can continue sequentially or select another board. Select jumps to AAA in the Japanese version.
- Every board has **six dice, a 4×4 field, and 20 moves**.
- Clearing with sixes awards one star; doing so with at least five moves left awards two.
- Seven boards contain an immovable iron die whose face prevents a sixes finish.
- Completing all 1,000 changes the remaining-board display to a total star count and adds falling stars.

The author explicitly leaves Japanese-versus-North-American board identity unconfirmed. His guide contains solutions, not the starting positions and face orientations required for a playable level dataset. [Richard Uyeyama, Random Puzzle Mode Solutions, sections I.1–I.3](https://gamefaqs.gamespot.com/ps/197108-devil-dice/faqs/6642).

## Independent firsthand corroboration

Peter Stock records his own puzzle-star results and independently describes the same repeatable 1,000-board collection, dimensions, dice count, move allowance, and star conditions. He speculates that a pseudorandom generator may have been used to construct the collection. That is a hypothesis, **not documentation of the game's implementation**. [Peter Stock, Devil Dice puzzle mode](https://www.peterstock.co.uk/games/devil_dice/).

A Japanese community reference agrees that all discs expose the same boards and that Random is unlocked after clearing all 100. Its proposed Random puzzle-list section is still a placeholder; its existing detailed board catalogue covers the normal 100. This is corroborating secondary evidence, not a recovered game-data source. [aLea-aRea, XI(sái) PUZZLE](https://scrapbox.io/alea-area/XI%28s%C3%A1i%29%20PUZZLE).

## What remains unknown

- No verified complete starting-layout dataset, documented seed mapping, or generation algorithm was located in this search.
- The English manual scan is available, but its image-only pages did not yield searchable text through the research tool. No Random-mode claim here is attributed to the manual. [Original English manual scan](https://db.hfsplay.fr/files/2021/01/21/devil_dice_english_WviqaVa.pdf).
- “Fixed collection” describes observable play. It does not establish whether the executable stores all layouts or deterministically reconstructs them internally.

## Implication for Pip's Plot

An authentic extra Retro pack would require recording or extracting those starting states, then validating reconstructed boards against observed play and the existing solution records. Generating 1,000 new puzzles with the same format would be a separate inspired mode, not a reconstruction of the original collection.
