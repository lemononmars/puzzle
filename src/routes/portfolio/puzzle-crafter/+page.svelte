<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import LinkCard from '#lib/components/ui/LinkCard.svelte';
	import Surface from '#lib/components/ui/Surface.svelte';
	import { portfolio } from '#lib/data/portfolio.js';
	const songkran = portfolio.projects.find(project => project.title === 'Songkran puzzle round')!;
	const river = portfolio.projects.find(project => project.title === 'Rorschach’s River')!;
</script>
<svelte:head><title>Puzzle crafter · Sakulbuth Ekvittayaniphon</title><meta name="description" content="Original logic puzzles by lemononmars, collaborative constructions, and puzzle-event contributions." /></svelte:head>
<div class="text-left space-y-6">
	<a href="/portfolio" class="link link-primary text-sm">← Portfolio</a>
	<PageHeading title="Puzzle crafter" eyebrow="PORTFOLIO / FOLLOW THE CLUE" description="Logic puzzles, little discoveries, and the pleasure of making an idea click." />
	<section class="puzzle-feature botanical-surface">
		<div class="clue-grid bg-base-200 text-base-content" aria-hidden="true">{#each ['?','1','▧','2','✓','3','▧','4','?'] as tile, i}<span class:filled={i === 2 || i === 6}>{tile}</span>{/each}<strong class="aha bg-accent text-accent-content">aha!</strong></div>
		<div><p class="botanical-eyebrow">A SMALL GRID. A NEW DISCOVERY.</p><h2 class="text-2xl font-bold my-3">Made to make you think.</h2><p class="botanical-muted text-sm leading-relaxed mb-5">Follow a rule, spot a connection, and find the moment when everything fits. Explore my published logic puzzles on Puzzle Square.</p><a href="https://puzsq.logicpuzzle.app/?author=2756" class="btn btn-primary text-primary-content">Try my puzzles ↗</a><p class="botanical-muted text-xs mt-3">Puzzle Square · author 2756</p></div>
	</section>
	<section aria-labelledby="events-title">
		<h2 id="events-title" class="text-xl font-bold mb-4">Logic puzzle events & collaborations</h2>
		<div class="grid md:grid-cols-2 gap-5">
			<LinkCard href={songkran.href} title={songkran.title} description={songkran.description} eyebrow={songkran.category} mark={songkran.mark} />
			<LinkCard href={river.href} title={river.title} description={river.description} eyebrow={river.category} mark={river.mark} />
		</div>
	</section>
	<Surface><h2 class="text-xl font-bold mb-4">Around the puzzle community</h2><div class="grid md:grid-cols-2 gap-6">{#each portfolio.facts as fact}<article><h3 class="font-bold mb-2">{fact.title}</h3><p class="botanical-muted text-sm leading-relaxed mb-3">{fact.description}</p><a href={fact.href} class="link link-primary text-sm">{fact.source} ↗</a></article>{/each}</div></Surface>
</div>

<style>.puzzle-feature { display:grid; grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr); gap:32px; align-items:center; }.clue-grid { position:relative; display:grid; grid-template-columns:repeat(3,1fr); gap:8px; padding:24px; border-radius:24px; max-width:290px; width:100%; margin:auto; }.clue-grid span { aspect-ratio:1; display:grid; place-items:center; border:2px solid var(--color-primary); border-radius:9px; font-size:26px; background:var(--color-base-100); color:var(--color-primary); }.clue-grid span.filled { background:var(--color-primary); color:var(--color-primary-content); }.aha { position:absolute; right:-8px; bottom:-8px; border-radius:18px; padding:12px 18px; transform:rotate(-9deg); font-size:22px; }@media(max-width:640px) { .puzzle-feature { grid-template-columns:1fr; } }</style>
