<script lang="ts">
 import '../app.css';
 import Navbar from '#lib/components/Navbar.svelte';
 import Footer from '#lib/components/Footer.svelte';
 import { navigating } from '$app/state';
 import PageNavIndicator from '#lib/components/PageNavIndicator.svelte';
 import PWAInstallBanner from '#lib/components/PWAInstallBanner.svelte';
 import OfflineIndicator from '#lib/components/OfflineIndicator.svelte';
 let { children }: { children?: import('svelte').Snippet } = $props();
</script>
<header class="fixed inset-x-0 bottom-0 lg:bottom-auto lg:top-0 z-40">
 {#if navigating.to}<PageNavIndicator />{/if}<Navbar />
</header>
<main class="site-main" id="main">{@render children?.()}</main>
<Footer /><OfflineIndicator /><PWAInstallBanner />
