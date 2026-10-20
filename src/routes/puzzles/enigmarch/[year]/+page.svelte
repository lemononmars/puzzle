<script lang="ts">
import UiArrowLeft from '@lucide/svelte/icons/arrow-left';
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import PuzzlePreviewCard from '#lib/components/ui/PuzzlePreviewCard.svelte';
	let { data } = $props();
</script>
<svelte:head><title>EnigMarch {data.year} · Puzzle</title><meta name="description" content={`Daily puzzles by lemononmars from EnigMarch ${data.year}, with hints and answer checking.`} /></svelte:head>
<div class="text-left space-y-6">
	<a href="/puzzles/crafted" class="link link-primary text-sm"><UiArrowLeft size={16} class="inline-block align-middle" aria-hidden="true" /> Crafted puzzles</a>
	<PageHeading title={`EnigMarch ${data.year}`} description={data.year === 2024 ? 'A collection of Japanese-style nazo puzzles.' : 'Daily puzzles inspired by EnigMarch prompts, with the original hints and solutions.'} />
	<nav class="flex flex-wrap gap-2" aria-label="Choose collection"><a href="/puzzles/enigmarch/2023" class="btn btn-sm btn-outline">2023 · Hunt-style puzzles</a><a href="/puzzles/enigmarch/2024" class="btn btn-sm btn-outline">2024 · Nazo</a></nav>
	<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{#each data.puzzles as puzzle}<PuzzlePreviewCard image={puzzle.image} href={`/puzzles/enigmarch/${data.year}/${puzzle.day}`} title={puzzle.title} />{/each}</div>
</div>
