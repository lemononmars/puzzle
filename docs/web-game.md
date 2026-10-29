# Web Game collection

`/web-game` groups Four Lines, Pip's Plot, and all five board games. Each game has a direct child route: `four-lines`, `pips-plot`, `pakklongboard`, `sky-scan`, `pakklongcard`, `spacespy`, and `wordwars`.

Board-game routes share the `(boardgames)` route-group layout, preserving their realtime configuration checks, local player preferences, and full-width room view. Pip's Plot and Four Lines do not inherit the board-game layout. Static images remain under `/boardgame/`.

Permanent redirects retain the path suffix and query for `/boardgame`, `/puzzles/web-game`, and `/puzzles/pips-plot`. Older Demon Dice redirects go directly to the new Pip's Plot location. Existing room invitations remain usable.


Sky Scan is the renamed Pakklong Dice game. Its public route is /web-game/sky-scan; the internal realtime game ID remains pakklongdice for existing rooms. The default sky theme uses four SVG faces: sun, cloud, moon, and star. Other themes remain selectable. Legacy Pakklong Dice routes redirect with room IDs and queries intact. The collection previews use the Pip's Plot scene, Pakklong's existing rose-market illustration, and a Sky Scan dice illustration.

