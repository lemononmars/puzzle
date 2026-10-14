<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import Surface from '#lib/components/ui/Surface.svelte';
</script>
<svelte:head><title>Board game designer · Sakulbuth Ekvittayaniphon</title><meta name="description" content="A future home for Sakulbuth’s original board-game designs." /></svelte:head>
<div class="text-left">
	<a href="/portfolio" class="link link-primary text-sm">← Portfolio</a>
	<div class="mt-5"><PageHeading title="Board game designer" eyebrow="PORTFOLIO / AT THE TABLE" description="A place for the games I design, from the first idea to the final table." /></div>
	<Surface>
		<div class="flex flex-wrap items-center gap-6">
			<span class="rounded-3xl bg-accent text-accent-content p-6 text-6xl" aria-hidden="true">⚄</span>
			<div><p class="botanical-eyebrow">RESERVED ON THE SHELF</p><h2 class="text-xl font-bold my-3">The first game goes here.</h2><p class="botanical-muted text-sm max-w-xl leading-relaxed">I’ll add my board games here in the future, with their rules, design stories, and ways to play. This shelf is waiting for its first entry.</p></div>
		</div>
	</Surface>
</div>
