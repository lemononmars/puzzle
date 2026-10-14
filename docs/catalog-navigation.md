# Catalog navigation

Puzzles and tools use five category overview pages, driven by src/lib/data/catalog.json. CatalogHub renders the overview and CatalogSection renders a collection. The navbar reads the same category data, so labels and destinations stay consistent.

Individual pages retain short canonical URLs, such as /puzzles/rebus and /tools/crossword. Category pages, such as /puzzles/crafted and /tools/builders, are browsing collections rather than URL parents. This preserves existing shares and saved games and permits regrouping without migrations or duplicate routes.

Arena is temporarily omitted from the catalog and marked noindex. Its existing route and multiplayer APIs remain available for development. Restore discoverability deliberately when it is ready.

Resources has five destinations: ciphers, spelling dictionary, knowledge, mechanics and logic tutorials. Keep all five in the ข้อมูล submenu, preceded by ข้อมูลทั้งหมด (/resources).

The homepage letter warm-up is keyboard accessible and uses a reduced-motion-aware animation. It does not store answers or send results.
