# Online Garden Battle

Enter `/puzzles/pips-plot/battle`. Create a room, share its invite link, customize Pip, and have both players mark Ready. The host starts the match. Both players share one authoritative field; arrows/WASD and the on-screen controller work for each player.

## Victory and scoring

Following the [original manual](https://www.videogamemanual.com/ps1/Devil%20Dice%20(USA).pdf), Battle is won by owning 3, 4, or 5 distinct face premiums (default 4). Matching a face claims its premium; extending an opponent's sinking group steals that premium. Rolling onto a grounded opponent steals the post-roll face only if they own it. Crushing with stone wins immediately. Pip points remain a secondary total, not the victory condition.

The host can select a timer, field size, and dice mix. At the time limit or a full field, the player owning more premiums wins; equal ownership draws. This tie policy is an adaptation. See [design research](demon-dice-design-research.md) for source distinctions.

## Hosting

Rooms live in memory in one shared, long-running Node server. Deploy this app to a reachable Node host for friends on other devices. Separate serverless instances or multiple replicas require a shared room store before deployment; local preview alone does not publish internet multiplayer. Restarting the server clears rooms. Unused rooms expire after 45 minutes.

The server validates actions, room membership, movement timing, and input sequence numbers. Private seat tokens stay in session storage and authenticate requests with Bearer headers; public room snapshots omit tokens. Polling synchronizes clients and advances the server clock. Reloading the same tab resumes its seat. A disconnected player has 30 seconds to return; leaving explicitly forfeits immediately. Avatar preferences persist locally.

The room endpoints are `POST /api/demon-dice/battle` and `GET/POST /api/demon-dice/battle/[code]`. Room codes are invite credentials, not account identities. This version supports two friends per room.

