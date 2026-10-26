<script lang="ts">
	let { muted = false }: { muted?: boolean } = $props();
</script>

<svg
	width="22"
	height="22"
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.8"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	><path d="m11 4-6 5H2v6h3l6 5z" />{#if muted}<path d="m16 9 6 6m0-6-6 6" />{:else}<path
			d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"
		/>{/if}</svg
>
