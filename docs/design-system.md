# Botanical Playroom

Site identity: **Chi Fun / ไขสนุก**. The canonical Chi Key artwork is `static/images/chi/chi-key.svg`; use it for the brand mark. Identity text is in `src/lib/brand.ts`, and `scripts/generate-brand-assets.cjs` derives the favicon, installed-app icons, and sharing image from that artwork.

The default DaisyUI theme is `botanical`, defined in `src/app.css`. Use semantic colors rather than fixed palette utilities. Pair every semantic surface with its content color; preserve colors that encode puzzle rules or state.

Use `PageHeading` for page introductions, `Surface` for grouped content, `LinkCard` for navigable content, and `ActionLink` for calls to action. These Svelte 5 components live in `src/lib/components/ui`. Existing game, tool, and product cards use the same theme tokens. Use DaisyUI buttons, inputs, selects, tabs, alerts, and modals for interactive controls.

The visual vocabulary is sage backgrounds, moss actions, peach accents, rounded surfaces, serif headings, and sans-serif Thai body text. Use `botanical-eyebrow`, `botanical-muted`, `botanical-surface`, and `botanical-link-card` for consistent treatments. Keep game mechanics and board geometry separate from presentation.

Draw puzzle ink with `currentColor`, `bg-base-content`, or `var(--color-base-content)` on base surfaces. SVG faces, labels, and badges should use the same semantic tokens as HTML. Avoid white ink or pale palette text inherited from the old dark theme. Keep identity colors for pieces and rule markings, with contrasting labels and visible edges; exported black-and-white puzzle canvases can retain their explicit print palette. Fullscreen surfaces must set both background and foreground tokens.

The site shell owns the navigation, content width, and footer. Pages should not add another global footer or fixed navigation. All new public pages should work at mobile widths and support keyboard focus and reduced motion.

Mobile navigation has five destinations: Home, Play, Create, Learn, and More. Keep secondary pages as separate routes in More, grouped by purpose. Portfolio, contact, and shop activate More. Use the reusable `BottomSheet` component for grouped mobile actions; its native dialog provides focus containment, Escape dismissal, and focus restoration.

Card shells use the shared botanical-card class (or DaisyUI card / Surface / LinkCard): cream background, sage border, theme radius and soft shadow. Preserve compact game cells and semantic state colors. Answer fields use botanical-answer-input with base background and readable base text. Use filled badge-error text-error-content for incorrect spellings; outlined error badges inherit the pale surface color and are unsuitable here.

Use compact page introductions and the compact-headers repository skill. Desktop and mobile share Home / Play / Create / Learn / More; grouped options use BottomSheet, shown beneath the desktop bar and above the mobile bar.

Font roles: DM Sans for English, Noto Sans Thai for the interface and headers, Sarabun is the secondary, headed Thai font for word search and Thai puzzle tiles/boxes. Use font-headed when headed letters are needed; puzzle-tiles, font-serif, and font-mono share this stack. font-mono maps to the puzzle stack; SVG/canvas exports use the same named fonts. Page h1 headings use the global compact size cap. Desktop submenus use compact page-specific symbols.

## Motion reference

Use [Takayu Studio Motion Reference](https://motion-reference.takayustudio.jp/) as the reference when creating or revising animations and interactive motion for this project. Consult relevant examples for timing, easing, transitions, and interaction behavior, then adapt them to the Botanical Playroom components and visual style. Keep controls responsive and honor `prefers-reduced-motion` with a static or reduced-motion alternative.

Puzzle listing cards use `src/lib/components/ui/PuzzlePreviewCard.svelte`: a consistent image preview above the title, without arrows, eyebrows, or descriptive copy. Use the puzzle artwork as the preview; use a neutral text-puzzle cover when the puzzle is entirely text. New puzzle lists should reuse this component rather than inventing a new card layout.

The Thai wordmark uses `BrandWordmark.svelte`: bold Noto Sans Thai with tight natural spacing, moss green สนุก, a peach underline, and a small tracked CHI FUN signature. Keep Thai combining marks intact; do not space or transform individual letters. Use the compact version in navigation and display size in identity contexts. Pair it with the canonical Chi Key.

Logo lockups: use BrandLogo with variant stacked (covers/posters), horizontal (wide headers), or occasion (events and celebrations). Transparent SVGs live in static/images/brand; regenerate using scripts/generate-logo-lockups.cjs with BRAND_SHARP set to the Sharp package location. The occasion badge has no date so it can be reused.

Applied logo roles: horizontal in the site navbar and homepage, stacked in the footer and About, occasion badge on the collaboration form. Social cards are generated from the same SVG lockups by scripts/generate-brand-assets.cjs; bump their metadata query version when artwork changes. Keep the Chi Key alone for favicon/app icons where text would be too small.

The revised Chi Key has a circular bow opened on the opposite side of the shaft (lower left) and a short, straight green crossing stroke. The Thai wordmark replaces ไ with the key turned upside down and aligned vertically; this vowel is vector artwork, not a substituted font glyph. Regenerate all lockups and social assets after changing the canonical key.

The key bow and shaft are one continuous SVG path; use exact 45-degree line segments for the shaft/teeth and a straight green cross-stroke. Only the circular bow and rounded stroke caps/joins are curved. Wordmark accent rules are straight.
