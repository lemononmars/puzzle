# Board games

The SNOWBOARD project is integrated at `/web-game`. The Puzzle layout supplies navigation, fonts, and the Botanical theme. Game logic, stores, and shared components live in `src/lib/boardgame`; assets are namespaced under `static/boardgame`.

Pakklong Dice and Pakklong Board retain their room routes. Word Wars is a letter-tile preview. The original project has no playable Space Spy room or Svelte card-game route; their entries explain that they are in development. The legacy standalone card-game assets are retained under `/web-game/p/` for reference; they require the old Socket.IO server and are not linked as playable games.

Multiplayer uses the existing `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` public configuration. Realtime broadcast and presence must be enabled. The `rooms` table is used for best-effort room discovery; host broadcasts also announce rooms. The room creator must keep their tab open while hosting. Missing configuration displays an unavailable notice rather than starting a broken client.

Player preferences use the `boardgame:selfInfo` local-storage key. The site controls the theme. Imported game-state JavaScript retains its dynamic types; porting it to TypeScript is separate work.

## Pakklong table

Pakklong Board uses its own natural-height table rather than the dice game's fixed canvas. Only `/web-game/pakklongboard/[roomID]` opts into the full desktop content width. At 1200px and above the marketplace sits beside a sticky, scrollable player panel. Smaller screens provide Market, Your shop, and Players & goals views; planning controls are also available directly above the mobile marketplace.

`src/lib/boardgame/pakklong/game.svelte.js` owns reactive game state, room membership, bot scheduling, and socket subscriptions. It exposes a typed view interface in `types.ts`. The UI modules render the market, personal shop, order cards, and table details. `rules.ts` contains pure market generation, bouquet validation, achievements, and planning-token rules. `constants.ts` contains the shared game data. Navigation tears down the room listeners and pending bot timers.

Planning supports token-first selection or a shop-first, keyboard-accessible popover. Used tokens swap shop assignments; at least four visits are required before submission. Arranging allows each player to finish independently. Phase transitions return after synchronous event delivery, preserving the next phase's active player. Tool offers use valid tier indices so prices and labels remain defined.

Focused checks: `npx vitest run src/lib/boardgame/pakklong/rules.test.ts` and `tests/browser/pakklongboard.spec.ts` (requires configured Supabase public environment variables).

## Dedicated game-room UI and rulebook

Game rooms omit the site navbar/footer and their reserved spacing; normal lobbies and `/web-game/pakklongboard/rules` retain the regular site shell. The sticky phase/turn-order/active-player bar occupies the top edge, with the bazaar directly beneath it. Room identity, room settings and exit controls live below the personal shop. Settings use a native dialog and the rulebook opens separately so reading it does not leave the live room.

Six generated botanical shop backgrounds are stored in `static/boardgame/shops/` as WebP assets (about 745 KiB combined). Their prompts and generation provenance are in `docs/boardgame-shop-art.md`. The desktop bazaar has shops 1–4 across its first row and shops 5–6 across the second. Small screens adapt to two columns.

`GameIcon`, `IconHint`, `FlowerToken` and `FlowerCard` share the visual language: flower-shaped icons, flower-colored token surfaces, star quality and trophy points. Zero-quantity flower types are omitted from order cards. Personal resources and actions use icons with accessible names and hover/focus labels.

The rulebook follows the controller, pure rules and constants. It covers setup, all five phases, every shop and tool, bouquets, bonus tracks, achievements, end conditions, worked examples and prototype edge cases. Published Patchwork and Wingspan rules are linked as presentation references, not sources of Pakklong mechanics.

## Interaction refinements

The status bar exposes the active player and actual shop visit order during buying, or tie-break priority during the other phases. The active buying shop has a strong outline and a named banner. Feedback carries a shop or personal-board target and appears at that interaction instead of below the whole table. Arranging completion is separated from the bouquet action. Concrete rose, orchid and mum SVGs are shared by tokens, orders and bonus tracks. Victory-point tooltips open inward. The floating chat launcher is no longer mounted, and socket diagnostics do not write to the console.

Automation is phase-aware, keyed to the current turn/action and cancelled when stale or disabled. The host drives native computer seats; each human client drives its own Autoplay seat. Planning and arranging completion are deduplicated by player ID. Bouquet automation uses nonnegative, rounded-up ribbon requirements, avoids exhausted tools and completes flower-voucher follow-ups. The regression tests cover shop-first swaps, keyboard popovers, local arrangement errors, phase completion and stopping Autoplay.

