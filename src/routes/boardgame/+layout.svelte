<script>
	import { isGameRoom } from '#lib/boardgame/routes.ts';
	import { onMount } from 'svelte';
	import { page as routePage } from '$app/state';
	import { toStore } from 'svelte/store';
	const page = toStore(() => ({ url: routePage.url, params: routePage.params }));
	import { selfInfo } from '#lib/boardgame/stores/self.js';
	import { boardgameConfigured } from '#lib/boardgame/supabase.js';
	onMount(() => {
		selfInfo.useLocalStorage();
	});
	$: roomView = isGameRoom($page.url.pathname);
	$: needsRealtime =
		!$page.url.pathname.endsWith('/rules') &&
		![
			'/boardgame',
			'/boardgame/wordwars',
			'/boardgame/about',
			'/boardgame/settings',
			'/boardgame/spacespy',
			'/boardgame/pakklongcard'
		].includes($page.url.pathname.replace(/\/$/, ''));
</script>

<svelte:head
	><link
		href="https://fonts.googleapis.com/icon?family=Material+Icons"
		rel="stylesheet"
	/></svelte:head
>
<div class="boardgame-area" class:wide-table={roomView}>
	{#if !roomView}<div class="flex flex-wrap items-center justify-between gap-3 mb-6">
			<a class="btn btn-ghost btn-sm" href="/boardgame">Board games</a><a
				class="btn btn-ghost btn-sm"
				href="/boardgame/settings">Player settings</a
			>
		</div>{/if}
	{#if needsRealtime && !boardgameConfigured}<div
			role="status"
			class="alert bg-base-200 text-base-content"
		>
			Multiplayer is not configured yet. Please try again later.
		</div>{:else}<slot />{/if}
</div>

<style>
	.boardgame-area {
		max-width: 1120px;
		margin: 0 auto;
		padding: 24px 0;
		text-align: left;
		color: var(--color-base-content);
	}
	.boardgame-area.wide-table {
		max-width: none;
		padding: 0;
	}
	.boardgame-area :global(.material-icons) {
		font-family: 'Material Icons';
		font-weight: normal;
		font-style: normal;
		font-size: 1.25em;
		display: inline-block;
		line-height: 1;
		text-transform: none;
		letter-spacing: normal;
		white-space: nowrap;
		font-feature-settings: 'liga';
	}
	@media (prefers-reduced-motion: reduce) {
		.boardgame-area :global(*),
		.boardgame-area :global(*::before),
		.boardgame-area :global(*::after) {
			animation: none !important;
			transition: none !important;
			scroll-behavior: auto !important;
		}
	}
</style>
