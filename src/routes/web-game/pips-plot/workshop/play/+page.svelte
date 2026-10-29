<script lang="ts">
	import { onMount } from 'svelte';
	import DemonDiceGame from '#lib/components/DemonDiceGame.svelte';
	import {
		decodeWorkshopPuzzle,
		encodeWorkshopPuzzle,
		workshopChallenge,
		type WorkshopPuzzle
	} from '#lib/games/pipsPlotWorkshop.js';
	let puzzle = $state<WorkshopPuzzle | null>(null),
		error = $state(''),
		revision = $state(0);
	onMount(() => {
		const open = () => {
			try {
				puzzle = decodeWorkshopPuzzle(new URLSearchParams(location.hash.slice(1)).get('p') ?? '');
				error = '';
				revision++;
			} catch (e) {
				puzzle = null;
				error = (e as Error).message;
			}
		};
		open();
		window.addEventListener('hashchange', open);
		return () => window.removeEventListener('hashchange', open);
	});
</script>

<svelte:head><title>{puzzle?.title ?? 'Shared puzzle'} · Pip's Plot</title></svelte:head>
{#if puzzle}
	<div class="flex gap-3 flex-wrap mb-4">
		<a class="btn btn-sm" href={`/web-game/pips-plot/workshop#p=${encodeWorkshopPuzzle(puzzle)}`}
			>Edit a copy</a
		>
	</div>
	{#key revision}<DemonDiceGame mode="puzzles" customPuzzle={workshopChallenge(puzzle)} />{/key}
{:else if error}<div class="botanical-surface p-6">
		<p role="alert">{error}</p>
		<a class="btn mt-4" href="/web-game/pips-plot/workshop">Open workshop</a>
	</div>
{:else}<p role="status">Opening your little plot…</p>{/if}
