<script lang="ts">
	import GameIcon from './GameIcon.svelte';
	import type { GameIconName } from './types';
	export let name: GameIconName;
	export let label: string;
	export let size = 20;
</script>

<button type="button" class="tooltip icon-hint" data-tip={label} aria-label={label}
	><GameIcon {name} {size} /></button
>

<style>
	.icon-hint {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 0;
		background: transparent;
		padding: 0;
		cursor: help;
	}
</style>
