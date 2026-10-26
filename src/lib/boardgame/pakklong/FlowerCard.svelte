<script lang="ts">
	import GameIcon from './GameIcon.svelte';
	import BotanicalFlower from './BotanicalFlower.svelte';
	export let card: { flowers: number[]; quality: number; score: number };
	export let repeated = false;
	export let selected = false;
	export let disabled = false;
	export let onclick: (() => void) | undefined = undefined;
	export let label = 'Bouquet order';
	const names = ['Pink', 'Blue', 'White'];
</script>

<button
	class="order-card"
	class:selected
	{disabled}
	{onclick}
	aria-label={`${label}: ${card.flowers
		.map((n, i) => (n ? `${n} ${names[i]}` : ''))
		.filter(Boolean)
		.join(', ')}, quality ${card.quality}, ${card.score} points`}
	aria-pressed={selected}
>
	<span class="flower-requirements"
		>{#each card.flowers as quantity, type}{#if quantity > 0}<span
					class="flower-count flower-ink-{type}"
					data-flower-type={type}
					>{#if repeated}{#each Array(quantity) as _}<BotanicalFlower
								{type}
								size={22}
							/>{/each}{:else}<BotanicalFlower {type} size={25} /><strong>{quantity}</strong
						>{/if}<span class="sr-only">{names[type]}</span></span
				>{/if}{/each}</span
	>
	<span class="order-values"
		><strong class="quality-mark"><GameIcon name="star" size={14} />{card.quality}</strong><span
			class="quality-mark"><GameIcon name="trophy" size={14} />{card.score}</span
		></span
	>
</button>

<style>
	.flower-ink-0 :global(svg) {
		fill: #efb7c8;
		stroke: #97455e;
	}
	.flower-ink-1 :global(svg) {
		fill: #c4e0ef;
		stroke: #3e7495;
	}
	.flower-ink-2 :global(svg) {
		fill: #fffdf4;
		stroke: #756e54;
	}
</style>
