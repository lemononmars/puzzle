<script lang="ts">
	import SocialMetadata from '#lib/components/SocialMetadata.svelte';
	import '../app.css';
	import Navbar from '#lib/components/Navbar.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import { isGameRoom } from '#lib/boardgame/routes.ts';
	import { navigating, page } from '$app/state';
	import PageNavIndicator from '#lib/components/PageNavIndicator.svelte';
	import OfflineIndicator from '#lib/components/OfflineIndicator.svelte';
	let roomView = $derived(isGameRoom(page.url.pathname));
	let { children }: { children?: import('svelte').Snippet } = $props();
</script>

<SocialMetadata />
{#if !roomView}<header
		data-testid="site-navbar"
		class="fixed inset-x-0 bottom-0 lg:bottom-auto lg:top-0 z-40"
	>
		{#if navigating.to}<PageNavIndicator />{/if}<Navbar />
	</header>{/if}
<main class="site-main" class:game-room={roomView} id="main">
	{@render children?.()}
</main>
{#if !roomView}<Footer />{/if}<OfflineIndicator />

<style>
	:global(.site-main.game-room) {
		max-width: none;
		width: 100%;
		padding: 0;
		text-align: left;
	}
</style>
