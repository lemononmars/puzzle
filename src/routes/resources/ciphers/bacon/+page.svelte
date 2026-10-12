<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		goto('/resources/ciphers', { replaceState: true });
	});
</script>

<svelte:head>
	<meta http-equiv="refresh" content="0;url=/resources/ciphers" />
</svelte:head>

<div class="flex items-center justify-center min-h-[50vh] text-base-content/70 font-bold">
	<p>Redirecting to /resources/ciphers...</p>
</div>
