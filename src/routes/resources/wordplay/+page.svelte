<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import Surface from '#lib/components/ui/Surface.svelte';
	import type { PageData } from './$types';
	import { goto, afterNavigate, beforeNavigate } from '$app/navigation';
	import { onDestroy, tick, untrack } from 'svelte';
	let { data }: { data: PageData } = $props();
	let query = $state(untrack(() => data.query));
	let minLength = $state(untrack(() => String(data.minLength ?? '')));
	let maxLength = $state(untrack(() => String(data.maxLength ?? '')));
	let timer: ReturnType<typeof setTimeout> | undefined;
	let searchError = $state('');
	beforeNavigate(() => clearTimeout(timer));
	let resultPanel: HTMLElement;
	let tabStrip: HTMLDivElement;
	let tabElements = $state<HTMLAnchorElement[]>([]);
	$effect(() => {
		const rule = data.rule;
		void tick().then(() => {
			const tab = tabElements[rule - 1];
			if (!tab || !tabStrip) return;
			const item = tab.getBoundingClientRect();
			const strip = tabStrip.getBoundingClientRect();
			if (item.left < strip.left) tabStrip.scrollLeft += item.left - strip.left;
			else if (item.right > strip.right) tabStrip.scrollLeft += item.right - strip.right;
		});
	});
	const resultKey = () =>
		JSON.stringify([data.rule, data.query, data.minLength, data.maxLength, data.page]);
	let previousResults = untrack(resultKey);
	afterNavigate(async ({ type }) => {
		if (type === 'popstate') {
			clearTimeout(timer);
			query = data.query;
			minLength = String(data.minLength ?? '');
			maxLength = String(data.maxLength ?? '');
		}
		const nextResults = resultKey();
		const changed = nextResults !== previousResults;
		previousResults = nextResults;
		if (type !== 'enter' && changed) {
			await tick();
			if (resultPanel) {
				const offset = window.matchMedia('(min-width:1024px)').matches ? 100 : 16;
				window.scrollTo({
					top: window.scrollY + resultPanel.getBoundingClientRect().top - offset,
					behavior: 'instant'
				});
			}
		}
	});
	function selectType(event: MouseEvent, rule: number) {
		if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
			return;
		event.preventDefault();
		clearTimeout(timer);
		searchError = '';
		void goto(link(rule), { reset: false }).catch(() => {
			searchError = 'Could not update results. Please try again.';
		});
	}
	function moveTab(event: KeyboardEvent, index: number) {
		let next: number;
		if (event.key === 'ArrowRight') next = (index + 1) % rules.length;
		else if (event.key === 'ArrowLeft') next = (index + rules.length - 1) % rules.length;
		else if (event.key === 'Home') next = 0;
		else if (event.key === 'End') next = rules.length - 1;
		else return;
		event.preventDefault();
		tabElements[next]?.focus();
		tabElements[next]?.click();
	}
	onDestroy(() => clearTimeout(timer));
	// React to the bound values, including text entered before hydration completed.
	$effect(() => {
		const current = { query, minLength, maxLength };
		const loaded = untrack(() => ({
			query: data.query,
			minLength: String(data.minLength ?? ''),
			maxLength: String(data.maxLength ?? '')
		}));
		if (
			current.query !== loaded.query ||
			current.minLength !== loaded.minLength ||
			current.maxLength !== loaded.maxLength
		)
			search(current.query !== loaded.query ? 200 : 0);
	});
	function search(delay = 0) {
		clearTimeout(timer);
		timer = setTimeout(async () => {
			searchError = '';
			try {
				await goto(link(data.rule), { replace: true, reset: false });
			} catch {
				searchError = 'Could not update results. Please try again.';
			}
		}, delay);
	}
	const rules = [
		{
			title: 'Anagram pairs',
			description:
				'Two distinct dictionary words with exactly the same tiles, including repeated tiles. Simple AB → BA rotations are excluded.'
		},
		{
			title: 'Split into words',
			description:
				'Split a dictionary word into two or three contiguous dictionary words. Words containing การ, ความ, or เครื่อง are excluded.'
		},
		{
			title: 'Interleaved words',
			description:
				'Assign every tile to one of two dictionary words, preserving order within each. Simple contiguous splits are excluded. Example: กราม = กม + รา.'
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
		},
		{
			title: 'Rotation',
			description:
				'Split a dictionary word into two nonempty sections, then swap them to form a different dictionary word. Tile order inside each section stays unchanged. The sections need not be dictionary words; each pair appears once.'
		}
	];
	function link(rule: number, page = 1) {
		const params = new URLSearchParams({ rule: String(rule), q: query, page: String(page) });
		if (minLength) params.set('min', minLength);
		if (maxLength) params.set('max', maxLength);
		return `?${params}`;
	}
	const visiblePages = $derived([
		...new Set([
			1,
			...Array.from({ length: 5 }, (_, i) => data.page - 2 + i).filter(
				(page) => page > 1 && page < data.pages
			),
			data.pages
		])
	]);
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

<details class="mb-6 rounded-xl border border-base-300 p-4 text-sm botanical-muted">
	<summary class="cursor-pointer font-semibold text-base-content"
		>Dictionary and letter rules</summary
	>
	<div class="mt-3 space-y-3">
		<p>
			Source: the site’s Thai dictionary (dict.ts), {data.dictionarySize.toLocaleString()} unique Thai-only
			entries. Dictionary membership is mechanical; entries may include rare words or names.
		</p>
		<p>
			A letter means a puzzle tile: combining vowels and tone marks stay attached to the preceding
			base letter; leading vowels remain separate. No marks are removed or substituted. All matching
			sets are included; equivalent assignments are deduplicated.
		</p>
		<p>
			One-tile words, including letters with attached vowels or tone marks, are excluded from every
			list except Reverse + one letter. Length filters count tiles in the main/result word.
		</p>
	</div>
</details>
<div
	bind:this={tabStrip}
	class="mb-6 max-w-full overflow-x-auto rounded-box border border-base-300 bg-base-100 text-base-content"
>
	<div
		class="tabs tabs-box flex w-max min-w-full flex-nowrap gap-1 bg-base-100 text-base-content"
		role="tablist"
		aria-label="Wordplay types"
	>
		{#each rules as rule, index}
			<a
				bind:this={tabElements[index]}
				class="tab h-auto min-h-11 flex-none whitespace-nowrap gap-2 py-2 {data.rule === index + 1
					? 'tab-active bg-primary text-primary-content'
					: 'text-base-content'}"
				href={link(index + 1)}
				role="tab"
				id={`wordplay-tab-${index + 1}`}
				aria-selected={data.rule === index + 1}
				aria-controls="wordplay-results"
				tabindex={data.rule === index + 1 ? 0 : -1}
				onclick={(event) => selectType(event, index + 1)}
				onkeydown={(event) => moveTab(event, index)}
			>
				<span>{rule.title}</span><span class="badge badge-sm bg-base-200 text-base-content"
					>{data.counts[index].toLocaleString()}</span
				>
			</a>
		{/each}
	</div>
</div>
<div
	id="wordplay-results"
	bind:this={resultPanel}
	role="tabpanel"
	tabindex="0"
	aria-labelledby={`wordplay-tab-${data.rule}`}
	class="scroll-mt-4 lg:scroll-mt-24"
>
	<Surface>
		<h2 class="mb-2 text-xl font-bold">{rules[data.rule - 1].title}</h2>
		<p class="mb-4 botanical-muted">{rules[data.rule - 1].description}</p>
		<form
			method="GET"
			class="mb-4 grid grid-cols-2 items-end gap-3 sm:flex sm:flex-wrap"
			onsubmit={(event) => {
				event.preventDefault();
				search();
			}}
		>
			<input type="hidden" name="rule" value={data.rule} />
			<label class="col-span-2 flex min-w-0 flex-1 flex-col gap-1" for="query"
				>Find a word<input
					class="input w-full"
					id="query"
					name="q"
					bind:value={query}
					placeholder="ค้นหาคำไทย"
				/></label
			>
			<label class="flex flex-col gap-1 sm:w-28" for="min-length"
				>Min. length
				<select
					class="select w-full"
					id="min-length"
					name="min"
					aria-label="Min. length"
					bind:value={minLength}
					><option value="">Any</option
					>{#each [...new Set( [...data.lengths, ...(minLength ? [Number(minLength)] : [])] )].sort((a, b) => a - b) as length}<option
							value={String(length)}>{length}</option
						>{/each}</select
				>
			</label>
			<label class="flex flex-col gap-1 sm:w-28" for="max-length"
				>Max. length
				<select
					class="select w-full"
					id="max-length"
					name="max"
					aria-label="Max. length"
					bind:value={maxLength}
					><option value="">Any</option
					>{#each [...new Set( [...data.lengths, ...(maxLength ? [Number(maxLength)] : [])] )].sort((a, b) => a - b) as length}<option
							value={String(length)}>{length}</option
						>{/each}</select
				>
			</label>
			<button class="btn btn-primary text-primary-content" type="submit">Search</button>
			<a
				class="btn btn-ghost"
				href={`?rule=${data.rule}`}
				onclick={() => {
					clearTimeout(timer);
					query = '';
					minLength = '';
					maxLength = '';
				}}>Clear</a
			>
		</form>
		{#if searchError}<p role="alert" class="text-error">{searchError}</p>{/if}
		<p class="mb-3 text-sm" aria-live="polite">
			{data.total.toLocaleString()} sets · {data.total ? (data.page - 1) * 100 + 1 : 0}–{Math.min(
				data.page * 100,
				data.total
			)} · 100 sets per page
		</p>
		{@render pagination('Top result pages')}
		<ul class="flex flex-wrap items-start gap-3" aria-label="Word sets">
			{#each data.rows as row}
				<li
					class="flex max-w-full flex-wrap items-center gap-2 rounded-xl border border-base-300 bg-base-100 p-3 text-base-content"
				>
					{#each row.words as word, index}
						{#if index > 0}<span aria-hidden="true"
								>{index === 1
									? data.rule === 1 || data.rule === 8
										? '↔'
										: data.rule === 4 || data.rule === 6
											? '→'
											: '='
									: '+'}</span
							>{/if}
						<span
							lang="th"
							class="badge h-auto max-w-full whitespace-normal break-all py-2 font-headed text-lg {index ===
							0
								? 'badge-primary text-primary-content'
								: 'badge-outline'}">{word}</span
						>
					{/each}
					{#if row.parity}<span class="text-xs botanical-muted">{row.parity}</span>{/if}
				</li>
			{:else}<li class="list-none py-6">No matching sets.</li>{/each}
		</ul>
		{@render pagination('Bottom result pages')}
	</Surface>
</div>

{#snippet pagination(label: string)}
	<nav class="my-4 flex flex-wrap items-center justify-center gap-2" aria-label={label}>
		{#if data.page > 1}<a
				class="btn btn-sm btn-outline"
				href={link(data.rule, data.page - 1)}
				aria-label="Previous page">‹</a
			>{/if}
		<div class="join flex max-w-full flex-wrap justify-center">
			{#each visiblePages as page, index}
				{#if index > 0 && page - visiblePages[index - 1] > 1}<span
						class="join-item flex items-center px-2"
						aria-hidden="true">…</span
					>{/if}
				<a
					class="join-item btn btn-sm {page === data.page
						? 'btn-accent text-accent-content'
						: 'btn-outline'}"
					href={link(data.rule, page)}
					aria-label={`Page ${page}`}
					aria-current={page === data.page ? 'page' : undefined}>{page}</a
				>
			{/each}
		</div>
		{#if data.page < data.pages}<a
				class="btn btn-sm btn-outline"
				href={link(data.rule, data.page + 1)}
				aria-label="Next page">›</a
			>{/if}
	</nav>
{/snippet}
