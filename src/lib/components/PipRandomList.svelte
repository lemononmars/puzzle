<script lang="ts">
	let {
		entries,
		level,
		completed,
		best,
		onplay
	}: {
		entries: { id: string }[];
		level: number;
		completed: string[];
		best: Record<string, number>;
		onplay: (index: number) => void;
	} = $props();
	let search = $state('');
	let list: HTMLDivElement;
	const letters = 'ABCDEFGHIJ'.split('');
	const query = $derived(search.trim().toUpperCase());
	const visible = $derived(
		entries
			.map((entry, index) => ({ ...entry, index }))
			.filter((entry) => entry.id.startsWith(query))
	);
	function jump(letter: string) {
		const section = list.querySelector<HTMLElement>(`[data-letter="${letter}"]`);
		if (section) list.scrollTop = section.offsetTop;
	}
</script>

<label class="input w-full bg-base-100 text-base-content"
	><svg
		viewBox="0 0 24 24"
		width="18"
		height="18"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		aria-hidden="true"><circle cx="10" cy="10" r="6" /><path d="m15 15 6 6" /></svg
	><input
		aria-label="Find a level"
		placeholder="Find a level · AAA–JJJ"
		maxlength="3"
		bind:value={search}
	/></label
>
<nav class="letter-jumps" aria-label="Jump to level group">
	{#each letters as letter}<button
			class="btn btn-xs btn-ghost"
			disabled={!!query && !letter.startsWith(query[0])}
			onclick={() => jump(letter)}>{letter}</button
		>{/each}
</nav>
<div class="all-levels" bind:this={list}>
	{#each letters as letter}
		{@const group = visible.filter((entry) => entry.id.startsWith(letter))}
		{#if group.length}<section data-letter={letter} aria-label={`${letter} levels`}>
				<h3>
					{letter}<small>{completed.filter((id) => id.startsWith(letter)).length} / 100</small>
				</h3>
				<div class="random-grid">
					{#each group as entry}<button
							class="random-level"
							class:current={level === entry.index}
							class:done={completed.includes(entry.id)}
							aria-current={level === entry.index ? 'step' : undefined}
							aria-label={`${entry.id}${completed.includes(entry.id) ? ', completed' : ''}${best[entry.id] !== undefined ? (best[entry.id] <= 15 ? ', two stars' : ', one star') : ''}`}
							onclick={() => onplay(entry.index)}
							><strong>{entry.id}</strong><span aria-hidden="true"
								>{best[entry.id] !== undefined
									? best[entry.id] <= 15
										? '★★'
										: '★'
									: completed.includes(entry.id)
										? '●'
										: '·'}</span
							></button
						>{/each}
				</div>
			</section>{/if}
	{/each}
	{#if !visible.length}<p class="botanical-muted empty-list">No matching levels.</p>{/if}
</div>

<style>
	.letter-jumps {
		display: flex;
		justify-content: space-between;
		gap: 2px;
		margin: 12px 0;
	}
	.all-levels {
		position: relative;
		max-height: min(52dvh, 480px);
		overflow-y: auto;
		overscroll-behavior: contain;
		scrollbar-gutter: stable;
		padding: 4px 6px 6px;
	}
	section {
		margin-bottom: 24px;
	}
	h3 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 22px;
		font-weight: 800;
		color: var(--color-primary);
		margin-bottom: 10px;
	}
	h3 small {
		font-size: 11px;
		font-weight: 500;
		color: var(--color-base-content);
		opacity: 0.6;
	}
	.random-grid {
		display: grid;
		grid-template-columns: repeat(10, minmax(0, 1fr));
		gap: 6px;
	}
	.random-level {
		border: 1px solid var(--color-base-300);
		border-radius: 10px;
		padding: 8px 2px 5px;
		background: var(--color-base-200);
		color: var(--color-base-content);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		cursor: pointer;
	}
	.random-level strong {
		font-size: 12px;
	}
	.random-level span {
		font-size: 10px;
		line-height: 14px;
		color: var(--color-primary);
	}
	.random-level.done {
		background: color-mix(in srgb, var(--color-success) 20%, var(--color-base-100));
	}
	.random-level.current {
		outline: 2px solid var(--color-primary);
		outline-offset: 1px;
	}
	.random-level:hover {
		border-color: var(--color-primary);
	}
	.random-level:focus-visible {
		outline: 3px solid var(--color-primary);
		outline-offset: 1px;
	}
	.empty-list {
		padding: 30px 0;
		text-align: center;
	}
	@media (max-width: 600px) {
		.random-grid {
			grid-template-columns: repeat(5, minmax(0, 1fr));
		}
		.random-level strong {
			font-size: 14px;
		}
	}
</style>
