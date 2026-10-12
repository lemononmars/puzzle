# Puzzle

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
