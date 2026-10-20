<script lang="ts">
	import EnigMarchContent from './EnigMarchContent.svelte';
	import type { EnigMarchBlock } from '#lib/enigmarch.js';
	let { blocks }: { blocks: EnigMarchBlock[] } = $props();
</script>
<div class="puzzle-content space-y-4">
	{#each blocks as block}
		{#if block.type === 'image' && block.src}
			<figure><a href={block.src} target="_blank" rel="noreferrer"><img src={block.src} alt={block.text || 'Puzzle diagram'} class="max-w-full max-h-[850px] mx-auto rounded-xl" loading="lazy" /></a></figure>
		{:else if block.type === 'divider'}<hr class="border-base-300" />
		{:else if block.type === 'toggle'}<details class="rounded-xl border border-base-300 p-4"><summary class="cursor-pointer font-bold">{block.text}</summary><div class="mt-4"><EnigMarchContent blocks={block.children} /></div></details>
		{:else if block.type === 'table'}<div class="overflow-x-auto"><table class="table table-sm"><tbody>{#each block.children as row}<tr>{#each row.children as cell}<td>{@html cell.html}</td>{/each}</tr>{/each}</tbody></table></div>
		{:else if block.type.startsWith('header')}<h2 class="text-xl font-bold">{block.text}</h2>
		{:else if block.html}<div class:font-mono={block.type === 'code'} class="whitespace-pre-wrap leading-relaxed">{@html block.html}</div>
		{/if}
		{#if block.children.length && !['toggle','table'].includes(block.type)}<div class="pl-4"><EnigMarchContent blocks={block.children} /></div>{/if}
	{/each}
</div>
<style>.puzzle-content :global(a) { color:var(--color-primary); text-decoration:underline; text-underline-offset:3px; }.puzzle-content :global(img) { background:white; }.puzzle-content :global(iframe) { width:100%; aspect-ratio:16/9; }</style>
