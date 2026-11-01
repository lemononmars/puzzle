<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import PageIcon from '#lib/components/ui/PageIcon.svelte';
	import Search from '@lucide/svelte/icons/search';
	import { searchRecords, type SearchRecord } from '#lib/search';
	let query = $state('');
	let results = $state<SearchRecord[]>([]);
	let busy = $state(false);
	let searched = $state(false);
	let message = $state('');
	let sequence = 0;
	let records: Promise<SearchRecord[]> | undefined;
	function loadRecords() {
		return (records ??= fetch('/search-records.json')
			.then((response) => {
				if (!response.ok) throw new Error('Unavailable');
				return response.json();
			})
			.catch((error) => {
				records = undefined;
				throw error;
			}));
	}
	async function search(value: string, current: number) {
		try {
			const matches = searchRecords(await loadRecords(), value);
			if (current === sequence) results = matches;
		} catch {
			if (current === sequence) message = 'Search is temporarily unavailable. Please try again.';
		} finally {
			if (current === sequence) busy = false;
		}
	}
	function scheduleSearch(immediate = false) {
		const current = ++sequence;
		const value = query.trim();
		results = [];
		message = '';
		searched = Boolean(value);
		busy = Boolean(value);
		if (!value) return;
		return setTimeout(() => search(value, current), immediate ? 0 : 150);
	}
	$effect(() => {
		// Read query here so every edit, including clearing the field, invalidates old results.
		query;
		const timer = scheduleSearch();
		return () => clearTimeout(timer);
	});
</script>

<svelte:head
	><title>Search / ค้นหา · Chi Fun</title><meta
		name="description"
		content="Find puzzles, tools, mechanics, and portfolio projects."
	/></svelte:head
>
<PageHeading
	title="ค้นหาทั้งเว็บไซต์"
	eyebrow="FOLLOW YOUR CURIOSITY"
	description="ค้นชื่อปริศนา เครื่องมือ กลไก และผลงาน โดยไม่เปิดเผยเฉลย"
/>
<form
	onsubmit={(event) => {
		event.preventDefault();
		scheduleSearch(true);
	}}
	class="flex gap-2 mb-6"
	role="search"
>
	<label class="input bg-base-100 text-base-content flex flex-1 items-center gap-2 min-w-0"
		><Search size={20} aria-hidden="true" /><input
			type="search"
			bind:value={query}
			aria-label="Search the website"
			placeholder="ค้นหา / Search…"
			class="min-w-0 w-full"
		/></label
	>
	<button type="submit" class="btn btn-primary text-primary-content" aria-busy={busy}
		>{busy ? 'Searching…' : 'ค้นหา'}</button
	>
</form>
<p role="status" class="botanical-muted text-sm mb-4">
	{message ||
		(busy ? 'Searching…' : '') ||
		(searched && !busy ? `${results.length}${results.length === 30 ? '+' : ''} results` : '')}
</p>
{#if searched && !busy && !results.length && !message}<p>
		ไม่พบผลลัพธ์ ลองใช้คำอื่น / No matches. Try another keyword.
	</p>{/if}
<ul class="grid gap-3">
	{#each results as result}<li>
			<a href={result.url} class="botanical-link-card flex gap-4 items-start"
				><span class="text-primary"><PageIcon href={result.url} /></span>
				<div>
					<h2 class="font-bold">{result.title}</h2>
					<p class="botanical-muted text-sm mt-1">{result.description}</p>
				</div></a
			>
		</li>{/each}
</ul>
