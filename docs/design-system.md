# Botanical Playroom

The default DaisyUI theme is `botanical`, defined in `src/app.css`. Use semantic colors rather than fixed palette utilities. Pair every semantic surface with its content color; preserve colors that encode puzzle rules or state.

Use `PageHeading` for page introductions, `Surface` for grouped content, `LinkCard` for navigable content, and `ActionLink` for calls to action. These Svelte 5 components live in `src/lib/components/ui`. Existing game, tool, and product cards use the same theme tokens. Use DaisyUI buttons, inputs, selects, tabs, alerts, and modals for interactive controls.

The visual vocabulary is sage backgrounds, moss actions, peach accents, rounded surfaces, serif headings, and sans-serif Thai body text. Use `botanical-eyebrow`, `botanical-muted`, `botanical-surface`, and `botanical-link-card` for consistent treatments. Keep game mechanics and board geometry separate from presentation.

Draw puzzle ink with `currentColor`, `bg-base-content`, or `var(--color-base-content)` on base surfaces. SVG faces, labels, and badges should use the same semantic tokens as HTML. Avoid white ink or pale palette text inherited from the old dark theme. Keep identity colors for pieces and rule markings, with contrasting labels and visible edges; exported black-and-white puzzle canvases can retain their explicit print palette. Fullscreen surfaces must set both background and foreground tokens.

The site shell owns the navigation, content width, and footer. Pages should not add another global footer or fixed navigation. All new public pages should work at mobile widths and support keyboard focus and reduced motion.

Mobile navigation has five destinations: Home, Play, Create, Learn, and More. Keep secondary pages as separate routes in More, grouped by purpose. Portfolio, contact, and shop activate More. Use the reusable `BottomSheet` component for grouped mobile actions; its native dialog provides focus containment, Escape dismissal, and focus restoration.
