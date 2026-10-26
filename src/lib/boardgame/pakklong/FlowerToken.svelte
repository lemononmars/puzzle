<script lang="ts">
	import GameIcon from './GameIcon.svelte';
	import BotanicalFlower from './BotanicalFlower.svelte';
	import type { FlowerToken } from './types';
	export let token: FlowerToken;
	export let label: string;
	export let selected = false;
	export let disabled = false;
	export let onclick: (() => void) | undefined = undefined;
</script>

<button
	class="flower-token flower-surface-{token.type}"
	class:selected
	{disabled}
	{onclick}
	aria-label={label}
	aria-pressed={selected}
>
	<BotanicalFlower type={token.type} size={30} /><strong class="quality-mark"
		><GameIcon name="star" size={13} />{token.quality}</strong
	>
</button>
