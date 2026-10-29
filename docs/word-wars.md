# Word Wars

Play `/web-game/wordwars` against Mali. Ten independent random starting tiles sit in a shared reserve; the word pool starts empty. Select a tile and choose Add selected letter, or double-click it to add immediately. Each addition consumes exactly one reserve tile and passes the turn. Keyboard and touch users can keep using the explicit Add button.

Challenge sends the word-finding task to the opponent. They have 15 seconds to make one dictionary word using every pool tile exactly once. Unselected reserve tiles cannot be used. Invalid answers can be corrected before the deadline. A valid answer earns the defender a point; giving up or timing out awards the challenger a point. Turn timeout also loses the round. First to three wins; new rounds alternate starters.

Starting letters use the exact Countdown weights from `src/lib/utils/dict.ts`: count consonants and vowels separately, weight each character by `max(1, floor(sqrt(count)))`, and use Countdown's 35% vowel / 65% consonant choice for each independent draw. A starting word is not guaranteed. Generated weights live in `src/lib/games/countdownLetterFrequency.json`; regenerate with `node scripts/generate-countdown-letter-frequency.mjs`. A test compares all generated weights against the live Countdown dictionary.

The main play area comes first, followed by scores and collapsed rules. Word Wars omits the board-game header and page introduction. Mali chooses only reserve tiles, challenges pools without a known answer, and answers from the pool's exact dictionary anagrams. Validation runs locally using the site's Thai dictionary.

Five rules tests cover independent frequency draws, exact Countdown parity, tile consumption, opponent challenge ownership, pool-only answers, timeout scoring, and bot behavior. Browser checks cover double-click consumption, explicit-add fallback, challenges in both directions, bot answers, scoring, and compact mobile layout.
