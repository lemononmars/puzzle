<script lang="ts">
	let { text }: { text: string } = $props();
	let tokens = $derived(text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g));
</script>
<div class="whitespace-pre-line leading-relaxed">{#each tokens as token}{#if token.startsWith('**')}<strong>{token.slice(2,-2)}</strong>{:else if token.startsWith('*')}<em>{token.slice(1,-1)}</em>{:else if token.startsWith('`')}<code class="bg-base-200 text-base-content rounded px-1">{token.slice(1,-1)}</code>{:else}{token}{/if}{/each}</div>
