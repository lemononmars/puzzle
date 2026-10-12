<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		goto('/resources/logictutorial', { replaceState: true });
	});
</script>

<svelte:head>
	<meta http-equiv="refresh" content="0;url=/resources/logictutorial" />
</svelte:head>

<div class="flex items-center justify-center min-h-[50vh] text-base-content/70 font-bold">
	<p>Redirecting to /resources/logictutorial...</p>
</div>
