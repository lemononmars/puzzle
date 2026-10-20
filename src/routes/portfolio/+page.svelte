<script lang="ts">
import UiArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import ActionLink from '#lib/components/ui/ActionLink.svelte';
	import { portfolio } from '#lib/data/portfolio.js';
	import { portfolioSections } from '#lib/data/portfolioSections.js';
</script>

<svelte:head>
	<title>{portfolio.name} · Portfolio</title>
	<meta name="description" content={portfolio.bio} />
</svelte:head>

<div class="text-left">
	<PageHeading title={portfolio.name} eyebrow="HELLO, I’M LEMONONMARS" description={portfolio.bio} />
	<p class="botanical-muted mb-6 text-sm">Four ways I follow my curiosity. Pick a door and take a look.</p>
	<div class="portfolio-doors grid md:grid-cols-2 gap-5">
		{#each portfolioSections as section, i}
			<a href={'/portfolio/' + section.id} class="botanical-link-card portfolio-door">
				<div class="door-art bg-base-200 text-base-content" aria-hidden="true">
					<svg viewBox="0 0 200 120" class="text-primary" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
						{#if i === 0}
							<rect x="31" y="20" width="65" height="78" rx="9" transform="rotate(-9 63 59)" fill="var(--color-base-100)"/><path d="M48 38H72M48 51H78"/><rect x="109" y="36" width="59" height="59" rx="12" transform="rotate(12 139 65)" fill="var(--color-accent)"/><circle cx="126" cy="52" r="3"/><circle cx="140" cy="66" r="3"/><circle cx="154" cy="80" r="3"/>
						{:else if i === 1}
							<rect x="42" y="16" width="88" height="88" rx="8" fill="var(--color-base-100)"/><path d="M64 16V104M86 16V104M108 16V104M42 38H130M42 60H130M42 82H130"/><path d="M66 40H84V58H66ZM88 62H106V80H88Z" fill="var(--color-accent)" stroke="none"/><path d="M139 28L157 46L138 65M157 46H173"/>
						{:else if i === 2}
							<path d="M52 106V17H137V106" fill="var(--color-base-100)"/><path d="M64 106V28H125V106Z" fill="var(--color-accent)"/><circle cx="113" cy="66" r="3"/><circle cx="154" cy="40" r="14" fill="var(--color-base-100)"/><path d="M154 54V85H172V78M164 85V78M41 106H145"/>
						{:else}
							<rect x="31" y="20" width="138" height="80" rx="10" fill="var(--color-base-100)"/><path d="M31 39H169M73 55L58 69L73 83M127 55L142 69L127 83M108 52L92 87"/><circle cx="45" cy="30" r="2" fill="currentColor"/><circle cx="55" cy="30" r="2" fill="currentColor"/><path d="M73 109H127"/>
						{/if}
					</svg>
					<span class="door-sticker bg-accent text-accent-content">{['roll an idea', 'aha!', 'one more room', 'hello, world'][i]}</span>
				</div>
				<p class="botanical-eyebrow mt-5">{section.eyebrow}</p>
				<h2 class="text-xl font-bold my-3 flex justify-between gap-3">{section.title}<span aria-hidden="true"><UiArrowUpRight size={16} class="inline-block align-middle" aria-hidden="true" /></span></h2>
				<p class="botanical-muted text-sm leading-relaxed">{section.description}</p>
			</a>
		{/each}
	</div>
	<section class="botanical-surface mt-8 flex flex-wrap items-center justify-between gap-4">
		<div><h2 class="text-xl font-bold">Let’s make something curious.</h2><p class="botanical-muted text-sm mt-2">Puzzles, games, or a website with a playful idea.</p></div>
		<ActionLink href="/contact">Contact for work ↗</ActionLink>
	</section>
</div>

<style>
	.door-art { position:relative; display:grid; place-items:center; border-radius:22px; min-height:155px; }
	.door-art svg { width:200px; max-width:80%; height:120px; }
	.door-sticker { position:absolute; bottom:12px; right:12px; padding:7px 12px; border-radius:14px; font-size:11px; transform:rotate(-6deg); }
	.portfolio-door:nth-child(even) .door-sticker { transform:rotate(6deg); }
</style>
