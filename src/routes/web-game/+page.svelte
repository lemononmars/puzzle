<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import PuzzlePreviewCard from '#lib/components/ui/PuzzlePreviewCard.svelte';
	const games = [
		['pips-plot', "Pip's Plot", '/web-game/pips-plot-preview.png'],
		['pakklongboard', 'Pakklong Talat · Board Game', '/boardgame/shops/rose.webp'],
		['sky-scan', 'Sky Scan', '/web-game/sky-scan-preview.svg'],
		['pakklongcard', 'Pakklong Talat · Card Game'],
		['spacespy', 'Space Spy'],
		['wordwars', 'Word Wars']
	];
</script>

<svelte:head>
	<title>Web Game · Chi Fun</title>
	<meta name="description" content="เกมบนเว็บไซต์ บอร์ดเกม และสวนลูกเต๋าของ Pip" />
</svelte:head>

<PageHeading title="Web Game" description="เกมบนเว็บไซต์ บอร์ดเกม และสวนลูกเต๋าของ Pip" />
<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
	{#each games as [slug, title, image]}
		<PuzzlePreviewCard
			href={`/web-game/${slug}`}
			{title}
			{image}
			imageAlt={`${title} game preview`}
		/>
	{/each}
	<PuzzlePreviewCard
		href="/web-game/four-lines"
		title="Four Lines"
		image="/puzzles/four-lines/preview.png"
		imageAlt="Four Lines เวอร์ชันปัจจุบัน พร้อมวงกลมความคืบหน้าบนกระดาน"
	/>
</div>
