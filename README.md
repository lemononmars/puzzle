# Chi Fun / ไขสนุก

Puzzle games, creation tools, and reference resources, migrated from a Code Breaker clone.

Requires Node.js 22.17 or newer (Node 24 recommended).

```sh
npm ci
npm run dev
```

```sh
npm run check
npm run test
npm run build
```

The project uses Svelte 5, SvelteKit 3, Tailwind CSS 4, and DaisyUI 5. SvelteKit configuration lives in `vite.config.ts`; theme configuration lives in `src/app.css`. Existing components can use Svelte 5's supported legacy syntax. The application shell and pages using route state use runes.

Local builds use the Node adapter (`node build` to start the result). Vercel builds use the Vercel adapter when `VERCEL` is set by the hosting platform.

Weekly puzzles and events have been retired, including their pages, admin screens, and weekly leaderboard APIs. Existing backend records have not been deleted.

The clone still includes inherited branding, shop products, historical puzzle content, and integrations. Review those before publishing the new project. Configure a separate Supabase project and integration credentials for the new site.

The development server stays on port 5173 (`strictPort` prevents an unnoticed switch). If a separate preview is needed, start it with an explicit port, for example `npm run dev -- --port 5184`. Each development port has its own Vite optimizer cache; builds use a separate cache so concurrent processes do not replace one another’s dependency files. Lucide icons use direct component imports and stay outside dependency prebundling.

To write mechanics resources, copy `templates/mechanics/article.svelte` into `src/lib/content/mechanics/<mechanic-id>.svelte`. See [the authoring guide](docs/mechanics-authoring.md) for IDs, images, and publishing details.


## Search, icons, and sharing

- Lucide is the UI icon library. Import individual components from `@lucide/svelte/icons/<name>`; use `PageIcon.svelte` for route/card icons. Keep original puzzle diagrams and illustrations separate from interface icons. Feather has been removed.
- `npm run dev` and `npm run build` generate Pagefind assets. After changing public catalog metadata during development, run `npm run search:index` again. Search lives at `/search` and in the ค้น menu.
- `scripts/public-records.mjs` is the search allowlist: public titles and descriptions only. It intentionally excludes answers, hints, the unlisted board-game sale page, admin pages, and user-generated check links. Article bodies are not automatically indexed. Generated files in `static/pagefind` and `static/search-records.json` are ignored by Git.
- `SocialMetadata.svelte` owns canonical, Open Graph, and Twitter tags. `src/lib/metadata/social.ts` resolves route-specific titles, descriptions, and images. Page loaders may return `social: { title, description, image, imageAlt }` for explicit overrides. Images must be root-relative PNG/JPEG/WebP paths; do not include solutions. Avoid adding duplicate social tags in individual pages.

## Validation and bundle budgets

`npm test` runs unit tests. To run the small browser/accessibility suite:

```sh
npm run build
npx playwright install chromium
npm run test:e2e
```

Playwright starts the built Node server on port 5186, checks mechanics navigation and axe accessibility, mobile search/menu behavior, search privacy, and server-rendered sharing metadata. It does not use or modify production data. Only Chromium is required.

Vite warns about chunks over 500 kB. Every production build also writes `artifacts/bundles.json` and enforces `bundle-budget.json`: 2.5 MiB gzip for all client JavaScript, and 384 KiB gzip for the largest chunk. These are whole-site baselines, not homepage load targets. The existing Thai word-list chunk is a known large asset; avoid increasing the budgets to silence a regression without reviewing the report. Reports include public Pagefind JavaScript and exclude WASM/data files and source maps.

## Local progress and word-tool performance

- `/library` (More → ปริศนาของฉัน) holds local favorites, private notes, and resumable games. Player settings also provide JSON backup export/import and a scoped reset. After import/reset, use **Reload to apply** so an already-open game cannot overwrite restored data.
- Automatic board resume currently covers Euler Square, Word Ladder, Cryptogram, Crossword, and Word Search. EnigMarch, Cryptic, mechanics exercises, and TBS2021 preserve answer drafts/history; existing Mathdle attempts and TBS letter marks are included in backups. Live competitive/timed rounds and externally embedded solvers keep their own behavior.
- Data stays in this browser. Backups exclude account credentials, player identity, and unrelated local-storage keys. Treat backups as personal files: they can contain your notes and guesses. Invalid imports are rejected before records are written; a blocked/full browser store shows a warning, and notes remain exportable from memory.
- Pure Thai text helpers live in `src/lib/utils/thai-text.ts` and do not import dictionaries. The synchronous dictionary-backed API remains in `thaiwords.ts` for existing game validation and server callers.
- Thai pattern searches and word-ladder generation/path/graph analysis run in dedicated Web Workers. Dictionary JSON is requested on demand, and Wikipedia titles load only when enabled. Worker searches support cancellation; route disposal releases workers.
- Homepage mini-games load only after selection. The service worker precaches the shell and caches other assets only after use. Tailwind scans `src` rather than scratch downloads and build artifacts.
