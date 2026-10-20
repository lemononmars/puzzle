<script lang="ts">
import UiArrowLeft from '@lucide/svelte/icons/arrow-left';
import UiArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import LinkCard from '#lib/components/ui/LinkCard.svelte';
	import Surface from '#lib/components/ui/Surface.svelte';
	const references = [
		{ title: 'ปั้นกระดาน 1', href: 'https://www.facebook.com/photo.php?fbid=875845439417228&set=pb.100066543193867.-2207520000&type=3', description: 'ภาพอ้างอิงจากปั้นกระดาน ครั้งที่ 1 บน Facebook', mark: '01' },
		{ title: 'ปั้นกระดาน 2', href: 'https://www.facebook.com/photo.php?fbid=901471710187934&set=pb.100066543193867.-2207520000&type=3', description: 'ภาพอ้างอิงจากปั้นกระดาน ครั้งที่ 2 บน Facebook', mark: '02' }
	];
</script>
<svelte:head><title>Board game designer · Sakulbuth Ekvittayaniphon</title><meta name="description" content="Sakulbuth’s board-game design references: ปั้นกระดาน and a BoardGameGeek designer profile." /></svelte:head>
<div class="text-left space-y-6">
	<a href="/portfolio" class="link link-primary text-sm"><UiArrowLeft size={16} class="inline-block align-middle" aria-hidden="true" /> Portfolio</a>
	<PageHeading title="Board game designer" eyebrow="PORTFOLIO / AT THE TABLE" description="A place for the games I design, from the first idea to the final table." />
	<section class="botanical-surface flex flex-wrap items-center gap-6"><span class="rounded-3xl bg-accent text-accent-content p-6 text-6xl" aria-hidden="true">⚄</span><div class="flex-1"><p class="botanical-eyebrow">DESIGNER PROFILE</p><h2 class="text-xl font-bold my-3">Find me on BoardGameGeek</h2><p class="botanical-muted text-sm mb-4">Sakulbuth Ekvittayaniphon · board game designer</p><a href="https://boardgamegeek.com/boardgamedesigner/136751/sakulbuth-ekvittayaniphon" class="btn btn-sm btn-primary text-primary-content">View designer profile <UiArrowUpRight size={16} class="inline-block align-middle" aria-hidden="true" /></a></div></section>
	<section aria-labelledby="pan-title"><h2 id="pan-title" class="text-xl font-bold mb-4">ปั้นกระดาน</h2><div class="grid md:grid-cols-2 gap-5">{#each references as reference}<LinkCard href={reference.href} title={reference.title} description={reference.description} mark={reference.mark} eyebrow="BOARD-GAME DESIGN / FACEBOOK" />{/each}</div></section>
	<Surface><p class="botanical-eyebrow">MORE FROM MY GAME SHELF</p><h2 class="text-xl font-bold my-3">Design stories coming next.</h2><p class="botanical-muted text-sm leading-relaxed">I’ll add individual games, rules, and behind-the-scenes notes here as the collection grows.</p></Surface>
</div>
