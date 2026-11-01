<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import Surface from '#lib/components/ui/Surface.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	const rules = [
		{
			title: 'Anagram pairs',
			description:
				'Two distinct dictionary words with exactly the same tiles, including repeated tiles.'
		},
		{
			title: 'Split into words',
			description:
				'Split a dictionary word into two or more contiguous dictionary words, preserving every tile in order.'
		},
		{
			title: 'Interleaved words',
			description:
				'Assign every tile to one of two dictionary words, preserving order within each. Contiguous splits also qualify. Example: กราม = กม + รา.'
		},
		{
			title: 'Reverse + one letter',
			description:
				'Reverse the source word’s tiles, then insert exactly one tile anywhere to make another dictionary word.'
		},
		{
			title: 'Word inside a word',
			description:
				'Insert one whole dictionary word strictly inside another, leaving at least one tile on each side. The result must also be a dictionary word. Each row lists the result, outer word, and inserted word; equivalent insertion positions appear once.'
		},
		{
			title: 'Odd / even letters',
			description:
				'Take all tiles at odd positions (1, 3, 5, …) or all tiles at even positions (2, 4, 6, …) to form a dictionary word. Positions start at 1. Only one of the two extractions needs to be a word; sources have at least two tiles.'
		},
		{
			title: 'Alternating merge',
			description:
				'Alternate one tile from the first word, then one from the second, to form the result: A₁ B₁ A₂ B₂ … . Both source words must be dictionary words. They have equal tile counts, or the first has exactly one extra tile. Each row shows result = starting word + second word.'
		}
	];
	function link(rule: number, page = 1) {
		return `?${new URLSearchParams({ rule: String(rule), q: data.query, page: String(page) })}`;
	}
</script>

<svelte:head>
	<title>Thai word sets · Unlisted resources</title>
	<meta name="robots" content="noindex, nofollow, noarchive" />
</svelte:head>

<PageHeading
	eyebrow="Resources · Unlisted"
	title="Thai word sets"
	description="Dictionary wordplay sets for puzzle construction."
/>

<div class="mb-6 space-y-3 text-sm botanical-muted">
	<p>
		Source: the site’s Thai dictionary (dict.ts), {data.dictionarySize.toLocaleString()} unique Thai-only
		entries. Dictionary membership is mechanical; entries may include rare words or names.
	</p>
	<p>
		A letter means a puzzle tile: combining vowels and tone marks stay attached to the preceding
		base letter; leading vowels remain separate. No marks are removed or substituted. All matching
		sets are included; equivalent assignments are deduplicated.
	</p>
</div>
<nav class="mb-6 grid gap-2 sm:grid-cols-2" aria-label="Word restrictions">
	{#each rules as rule, index}
		<a
			class="btn h-auto justify-between py-3 {data.rule === index + 1
				? 'btn-primary text-primary-content'
				: 'btn-outline'}"
			href={link(index + 1)}
			aria-current={data.rule === index + 1 ? 'page' : undefined}
		>
			<span>{index + 1}. {rule.title}</span><span>{data.counts[index].toLocaleString()}</span>
		</a>
	{/each}
</nav>
<Surface>
	<h2 class="mb-2 text-xl font-bold">{rules[data.rule - 1].title}</h2>
	<p class="mb-4 botanical-muted">{rules[data.rule - 1].description}</p>
	<form method="GET" class="mb-4 flex flex-wrap items-end gap-3">
		<input type="hidden" name="rule" value={data.rule} />
		<label class="flex min-w-0 flex-1 flex-col gap-1" for="query"
			>Find a word<input
				class="input w-full"
				id="query"
				name="q"
				value={data.query}
				placeholder="ค้นหาคำไทย"
			/></label
		>
		<button class="btn btn-primary text-primary-content" type="submit">Search</button>
		<a class="btn btn-ghost" href={`?rule=${data.rule}`}>Clear</a>
	</form>
	<p class="mb-3 text-sm" aria-live="polite">
		{data.total.toLocaleString()} sets · Page {data.page} / {data.pages}
	</p>
	<ol start={(data.page - 1) * 100 + 1} class="list-inside list-decimal divide-y divide-base-300">
		{#each data.rows as row}
			<li class="py-3 break-words">
				<span lang="th" class="font-headed text-lg"
					>{row.words[0]}
					{data.rule === 1 ? '↔' : data.rule === 4 || data.rule === 6 ? '→' : '='}
					{row.words.slice(1).join(' + ')}</span
				>{#if row.added}<span class="ml-3 text-sm botanical-muted"
						>added: <span lang="th">{row.added}</span></span
					>{/if}
				{#if row.insertionAt !== undefined}<span class="ml-3 text-sm botanical-muted"
						>insert after tile {row.insertionAt} of outer word</span
					>{/if}
				{#if row.parity}<span class="ml-3 text-sm botanical-muted">{row.parity} positions</span
					>{/if}
				{#if data.rule === 7}<span class="ml-3 text-sm botanical-muted"
						>alternate tiles, starting with {row.words[1]}</span
					>{/if}
			</li>
		{:else}<li class="list-none py-6">No matching sets.</li>{/each}
	</ol>
	<nav class="mt-5 flex items-center justify-between gap-3" aria-label="Result pages">
		{#if data.page > 1}<a class="btn btn-outline" href={link(data.rule, data.page - 1)}>Previous</a
			>{:else}<span></span>{/if}
		{#if data.page < data.pages}<a class="btn btn-outline" href={link(data.rule, data.page + 1)}
				>Next</a
			>{/if}
	</nav>
</Surface>
