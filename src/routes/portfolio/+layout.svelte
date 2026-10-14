<script lang="ts">
	import { page } from '$app/state';
	import { portfolioSections } from '#lib/data/portfolioSections.js';
	let { children }: { children: import('svelte').Snippet } = $props();
</script>

{@render children()}

{#if page.url.pathname.replace(/\/$/, '') !== '/portfolio'}
	<nav aria-label="Explore portfolio sections" class="mt-10 border-t border-base-300 pt-5 text-left">
		<p class="botanical-eyebrow mb-3">OTHER SIDES OF MY WORK</p>
		<div class="flex flex-wrap gap-2">
			<a href="/portfolio" class="btn btn-sm btn-ghost">← Portfolio</a>
			{#each portfolioSections as section}
				<a href={'/portfolio/' + section.id} aria-current={page.url.pathname === '/portfolio/' + section.id ? 'page' : undefined} class="btn btn-sm {page.url.pathname === '/portfolio/' + section.id ? 'btn-primary text-primary-content' : 'btn-outline text-base-content'}">{section.title}</a>
			{/each}
		</div>
	</nav>
{/if}
