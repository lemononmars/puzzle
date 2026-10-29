# Pip's Plot puzzle workshop

Open `/web-game/pips-plot/workshop` from the game mode menu. Select a tile in the accessible top-down editor, then add a die, change its material or face immediately, place Pip on the ground or on a die, or remove/restore empty floor. Fields can be 2–10 rows and columns; all five materials are supported. Top-face placement and directional rotation control orientations. A live 3D preview shows the layout. Set a name, move allowance, and optional hint.

Test puzzle runs an isolated copy through the existing puzzle engine, including undo, restart, animated ice arrivals, sinking, and move limits. Back to editor preserves the original arrangement. Workshop completions do not alter campaign progress.

Save & download JSON validates the layout, downloads a versioned `.json`, and generates a standalone play URL under `/workshop/play#p=…`. The fragment contains a base64url UTF-8 copy of the puzzle, so visitors need no account or database entry. Keep the entire URL including the fragment. Editing later creates a different saved version. Normal hosting still determines who can reach the site; localhost links are local preview links.

Visitors can play, restart, or edit a copy. JSON import supports round trips. Optional local storage retains an editor draft. Files are limited to 64 KB; URL payloads to 24,000 characters. Validation bounds the board, die count, text, moves, positions, materials, opposite face pairs, unique occupancy, holes, and Pip's support. Imported timers, animations, IDs, and extra fields are discarded, and state is rebuilt. Validation confirms a legal layout, not solvability; playtesting remains the author's responsibility.

`src/lib/games/pipsPlotWorkshop.ts` owns the format, validation, encoding, and conversion to the shared game component. Automated checks cover Unicode and all materials, legal play, rejected layouts, and removing transient fields. Browser checks cover editing, rotation, missing tiles, playtesting, downloads/imports, a fresh visitor playing the portable URL, edit-copy, invalid links, and mobile layout.

The compact editor uses selected-tile corner buttons: × removes a die, or an empty floor without Pip; + restores a missing floor. Rotation controls sit beside the selected die. One +/− pair sits on each of the four outer edges, appearing on hover or keyboard focus and staying visible on touch devices. Each pair adds or removes the entire edge strip, shifting objects and keeping Pip on a valid tile. Field limits remain 2–10. Hint, import, and new-puzzle controls live under Hint & files. Playtests omit mode links, campaign introductions, and the level selector.


Rotation buttons share one SVG arrow rotated through four directions, so their weight and size match.


Selected dice now have three axis rotation arrows: X, Y, and Z. Each applies a positive quarter-turn; Y keeps the top face fixed and cycles the side faces. Four clicks on any axis return to the initial orientation, and the three controls reach all 24 cube orientations.

