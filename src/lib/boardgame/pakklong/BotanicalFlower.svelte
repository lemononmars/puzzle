<script lang="ts">
	export let type: number;
	export let size = 26;
	const names = ['rose', 'orchid', 'mum'];
	const inks = ['#97455e', '#3e7495', '#756e54'];
	const fills = ['#efb7c8', '#c4e0ef', '#fffdf4'];
</script>

<svg
	class="botanical-flower"
	data-flower-kind={names[type]}
	width={size}
	height={size}
	viewBox="0 0 48 48"
	fill="none"
	stroke="currentColor"
	stroke-width="1.7"
	stroke-linecap="round"
	stroke-linejoin="round"
	style={`--petal: ${fills[type]}; color: ${inks[type]}`}
	aria-hidden="true"
>
	{#if type === 0}
		<path
			d="M24 34v10m0-4c-7 0-11-4-11-8 6 0 10 3 11 8m0-3c4-5 8-6 12-5-1 5-6 8-12 8"
			fill="var(--petal)"
		/>
		<path
			d="M24 35C11 35 5 27 8 18c0-7 7-12 13-10 5-5 14-1 15 5 8 4 7 14 1 18-4 3-8 4-13 4Z"
			fill="var(--petal)"
		/>
		<path
			d="M12 17c6-6 14-7 20-1m-21 8c3-7 11-12 19-8 5 3 6 9 1 13-5 4-15 1-15-5 0-5 7-8 11-5 4 3 0 8-4 6m-8 8c-4-5-3-11 1-15m21 7c-4 1-7 5-8 9"
		/>
	{:else if type === 1}
		<path
			d="M23 25C9 30 3 23 7 15c4-5 13-1 16 10Zm2 0c14 5 20-2 16-10-4-5-13-1-16 10Z"
			fill="var(--petal)"
		/>
		<path
			d="M24 23C11 15 14 4 24 5c10-1 13 10 0 18Zm-2 3C9 22 7 36 14 39c6 2 8-6 8-13Zm4 0c13-4 15 10 8 13-6 2-8-6-8-13Z"
			fill="var(--petal)"
		/>
		<path d="M20 24c-4 5-4 10 0 13l4 5 4-5c4-3 4-8 0-13Z" fill="var(--petal)" />
		<path d="m20 31 4 4 4-4m-4-13v9m-4-5 4-3 4 3" /><circle
			cx="24"
			cy="25"
			r="2.5"
			fill="currentColor"
		/>
	{:else}
		<g fill="var(--petal)"
			>{#each Array(16) as _, i}<ellipse
					cx="24"
					cy="13"
					rx="3.3"
					ry="10.5"
					transform={`rotate(${i * 22.5} 24 24)`}
				/>{/each}</g
		>
		<g fill="var(--petal)"
			>{#each Array(10) as _, i}<ellipse
					cx="24"
					cy="18"
					rx="2.8"
					ry="7"
					transform={`rotate(${i * 36} 24 24)`}
				/>{/each}</g
		><circle cx="24" cy="24" r="4.5" fill="currentColor" />
	{/if}
</svg>
