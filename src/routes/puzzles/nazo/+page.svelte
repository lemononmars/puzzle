<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import PuzzlePreviewCard from '#lib/components/ui/PuzzlePreviewCard.svelte';
	import { nazoPuzzles } from '#lib/data/puzzles/nazo.js';
</script>
<svelte:head><title>Nazo · Chi Fun</title><meta name="description" content="ปริศนาภาพและภาษา Nazo ทั้ง 29 ข้อ" /></svelte:head>
<div class="mx-auto max-w-6xl px-4 py-6">
	<a class="link mb-3 inline-block text-sm" href="/puzzles/crafted">← Crafted</a>
	<PageHeading title="Nazo" description="ปริศนาภาพและภาษา 29 ข้อ" />
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each nazoPuzzles as puzzle}
			<PuzzlePreviewCard href="/puzzles/nazo/{puzzle.id}" title={puzzle.title} image={puzzle.image} imageAlt={puzzle.title} />
		{/each}
	</div>
</div>
