---
name: compact-headers
description: Apply the Puzzle project's compact page headers and grouped navigation when adding or restyling pages and navigation.
---

# Compact headers for Puzzle

Keep page introductions short: eyebrow, concise title, and at most one brief description. Use src/lib/components/ui/PageHeading.svelte. Prefer a 24px gap below the header and a responsive title around 26–38px. Put detailed instructions in the page body or an expandable help section; avoid oversized hero blocks for tools and games. Portfolio artwork may be playful while keeping its introduction compact.

Use five top-level navigation destinations on desktop and mobile: Home, Play, Create, Info, More. Home links directly; desktop hovering opens a dropdown anchored directly below its button; mobile tapping reveals grouped sub-options using the shared BottomSheet. Keep secondary pages inside these groups instead of adding top-level tabs. The board-game sale page remains unlisted.

Preserve native dialog focus containment, Escape dismissal, active-section styling, and closure after navigation. Desktop dropdowns appear directly beneath their own button and remain open while moving into their links; mobile menus open above the bottom navbar. Use Botanical semantic background/content pairs and readable labels. Check both desktop and mobile layouts after changes.
