<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import PuzzlePreviewCard from '#lib/components/ui/PuzzlePreviewCard.svelte';
	import games from '#lib/data/web-games.json';
</script>

<svelte:head>
	<title>Web Game · Chi Fun</title>
	<meta name="description" content="เกมบนเว็บไซต์ บอร์ดเกม และสวนลูกเต๋าของ Pip" />
</svelte:head>

<PageHeading title="Web Game" description="เกมบนเว็บไซต์ บอร์ดเกม และสวนลูกเต๋าของ Pip" />
<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
	{#each games as { slug, title, image }}
		<PuzzlePreviewCard
			href={`/web-game/${slug}`}
			{title}
			{image}
			imageAlt={`${title} game preview`}
		/>
	{/each}
</div>
