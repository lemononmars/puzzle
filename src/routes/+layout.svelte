<script lang="ts">
 import '../app.css';
 import Navbar from '#lib/components/Navbar.svelte';
 import Footer from '#lib/components/Footer.svelte';
 import { navigating } from '$app/state';
 import { page } from '$app/state';
 const customSocialPages = ['/tools/wordsearch', '/tools/thwordsearch', '/tools/jigsaw', '/tools/crossword', '/tools/check'];
 import PageNavIndicator from '#lib/components/PageNavIndicator.svelte';
 import OfflineIndicator from '#lib/components/OfflineIndicator.svelte';
 let { children }: { children?: import('svelte').Snippet } = $props();
</script>
<svelte:head>
 <meta property="og:site_name" content="Puzzle" />
 {#if !customSocialPages.includes(page.url.pathname.replace(/\/$/, ''))}
 <meta property="og:title" content="Puzzle · Small puzzles. Fresh discoveries." />
 <meta property="og:description" content="A playroom for curious minds. Play puzzles, create your own, and explore new ideas." />
 <meta property="og:type" content="website" />
 <meta property="og:image" content={new URL('/og-main.png', page.url.origin).href} />
 <meta property="og:image:width" content="1200" />
 <meta property="og:image:height" content="630" />
 <meta property="og:image:alt" content="Puzzle botanical playroom: Small puzzles. Fresh discoveries. A word grid on sage green with a peach aha sticker." />
 <meta name="twitter:card" content="summary_large_image" />
 <meta name="twitter:image" content={new URL('/og-main.png', page.url.origin).href} />
 {/if}
</svelte:head>
<header class="fixed inset-x-0 bottom-0 lg:bottom-auto lg:top-0 z-40">
 {#if navigating.to}<PageNavIndicator />{/if}<Navbar />
</header>
<main class="site-main" id="main">{@render children?.()}</main>
<Footer /><OfflineIndicator />
