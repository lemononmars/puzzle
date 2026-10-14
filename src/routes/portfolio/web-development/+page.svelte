<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import LinkCard from '#lib/components/ui/LinkCard.svelte';
	import ManimClip from '#lib/components/ManimClip.svelte';
</script>
<svelte:head><title>Web development · Sakulbuth Ekvittayaniphon</title><meta name="description" content="Sakulbuth’s web projects: Thai Board Game Database, a Manim animation collection, and the Puzzle playroom." /></svelte:head>
<div class="text-left space-y-6">
	<a href="/portfolio" class="link link-primary text-sm">← Portfolio</a>
	<PageHeading title="Web development" eyebrow="PORTFOLIO / MADE WITH CODE" description="Websites and experiments that turn interests into things people can explore." />
	<div class="flex flex-wrap gap-2"><span class="badge badge-accent text-accent-content">hand-coded beginnings</span><span class="badge bg-base-200 text-base-content">games × code × curiosity</span></div>
	<section class="showcase botanical-surface">
		<a href="https://thaibg.vercel.app/" class="browser-preview"><div class="browser-bar bg-base-200 text-base-content"><span aria-hidden="true">● ● ●</span><span>thaibg.vercel.app ↗</span></div><img src="/images/portfolio/thai-board-game-database.png" alt="Thai Board Game Database homepage with its Thai board-game archive and featured games" width="1280" height="720" /></a>
		<div class="project-story"><p class="botanical-eyebrow">01 / A HOME FOR THAI BOARD GAMES</p><h2>Thai Board Game Database</h2><p class="botanical-muted">A growing catalogue of games, people, and organisations in the Thai board-game community. An earlier, hand-coded project, built around an interest that deserved a home of its own.</p><a class="btn btn-primary text-primary-content btn-sm" href="https://thaibg.vercel.app/">Explore the database ↗</a><a class="link link-primary text-sm" href="https://lemononmars.wordpress.com/2025/02/01/database-first-time/">Read the development notes ↗</a></div>
	</section>
	<section class="showcase botanical-surface">
		<ManimClip />
		<div class="project-story"><p class="botanical-eyebrow">02 / MATH MEETS BEAUTY</p><h2>Manim collection</h2><p class="botanical-muted">Mathematical ideas, drawn with code. This Exponential Sum clip is one of the experiments in my earlier, hand-coded collection, alongside text effects and animation studies.</p><a class="btn btn-primary text-primary-content btn-sm" href="https://lemononmars.github.io/manim/myprojects/">Browse the collection ↗</a><p class="botanical-muted text-xs">The animation plays only when you choose to start it.</p></div>
	</section>
	<div class="grid md:grid-cols-2 gap-5"><LinkCard href="/" title="Puzzle · this website" description="A botanical playroom for playable puzzles, creation tools, reference resources, and this portfolio." eyebrow="03 / YOU ARE HERE" mark="✦" /><LinkCard href="/design/chi" title="Chi symbol studies" description="A visual sketchbook: maze, cube, square, infinity, and a key." eyebrow="BONUS / DESIGN SKETCHBOOK" mark="χ" /></div>
</div>
<style>.showcase { display:grid; grid-template-columns:minmax(0,1.2fr) minmax(0,1fr); gap:28px; align-items:center; }.browser-preview { border:1px solid var(--color-base-300); border-radius:20px; overflow:hidden; display:block; }.browser-bar { display:flex; justify-content:space-between; gap:12px; padding:12px; font-size:11px; }.browser-preview img { width:100%; height:auto; }.project-story { display:flex; flex-direction:column; align-items:flex-start; gap:16px; }.project-story h2 { font-size:25px; font-weight:700; }.project-story > p { font-size:14px; line-height:1.8; }@media(max-width:760px) { .showcase { grid-template-columns:1fr; } }</style>
