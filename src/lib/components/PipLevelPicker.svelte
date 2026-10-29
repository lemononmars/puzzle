<script lang="ts">
	import PipRandomLock from './PipRandomLock.svelte';
	import PipRandomList from './PipRandomList.svelte';
	let {
		entries,
		level,
		completed,
		best = {},
		tutorial = false,
		random = false,
		onselect
	}: {
		entries: { id: string; set: string; title: string; maxMoves?: number }[];
		level: number;
		completed: string[];
		best?: Record<string, number>;
		tutorial?: boolean;
		random?: boolean;
		onselect: (index: number) => void;
	} = $props();
	let dialog: HTMLDialogElement;
	let pickerOpen = $state(false);
	let randomView = $state<'lock' | 'list'>('lock');
	let group = $state('');
	const groupFor = (index: number) =>
		random
			? entries[index].id.slice(0, 2)
			: tutorial
				? entries[index].set
				: String(Math.floor(index / 10) + 1);
	const groups = $derived([...new Set(entries.map((_, i) => groupFor(i)))]);
	function open() {
		group = groupFor(level);
		dialog.showModal();
		pickerOpen = true;
	}
	function choose(index: number) {
		dialog.close();
		onselect(index);
	}
	const label = (id: string) => (id.startsWith('R') ? id.slice(1) : id);
</script>

<nav class="stage-nav" aria-label="Level navigation" data-game-ui>
	<button
		class="btn btn-circle btn-ghost"
		aria-label="Previous level"
		disabled={level === 0}
		onclick={() => onselect(level - 1)}
		><svg
			viewBox="0 0 24 24"
			width="22"
			height="22"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg
		></button
	>
	<button
		class="stage-title btn"
		class:done={completed.includes(entries[level].id)}
		onclick={open}
		aria-haspopup="dialog"
		aria-label="Choose level"
		><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"
			><rect x="3" y="3" width="7" height="7" rx="2" /><rect
				x="14"
				y="3"
				width="7"
				height="7"
				rx="2"
			/><rect x="3" y="14" width="7" height="7" rx="2" /><rect
				x="14"
				y="14"
				width="7"
				height="7"
				rx="2"
			/></svg
		><span>{entries[level].title}</span>{#if !entries[level].title.startsWith('Stage ')}<small
				>{label(entries[level].id)}</small
			>{/if}</button
	>
	<button
		class="btn btn-circle btn-ghost"
		aria-label="Next level"
		disabled={level === entries.length - 1}
		onclick={() => onselect(level + 1)}
		><svg
			viewBox="0 0 24 24"
			width="22"
			height="22"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg
		></button
	>
</nav>
<dialog
	bind:this={dialog}
	class="modal"
	aria-labelledby="plot-level-title"
	data-game-ui
	onclose={() => {
		pickerOpen = false;
	}}
>
	<div class="modal-box bg-base-100 text-base-content level-map">
		<header>
			<h2 id="plot-level-title">Choose a level</h2>
			<button
				class="btn btn-circle btn-ghost"
				aria-label="Close level selection"
				onclick={() => dialog.close()}>✕</button
			>
		</header>
		{#if random}
			<div class="picker-views" aria-label="Level selection view">
				<button
					class="btn btn-sm"
					class:btn-primary={randomView === 'lock'}
					aria-pressed={randomView === 'lock'}
					onclick={() => {
						randomView = 'lock';
					}}>Padlock</button
				><button
					class="btn btn-sm"
					class:btn-primary={randomView === 'list'}
					aria-pressed={randomView === 'list'}
					onclick={() => {
						randomView = 'list';
					}}>Full list</button
				>
			</div>
			{#if pickerOpen}{#if randomView === 'lock'}<PipRandomLock
						{entries}
						{level}
						{completed}
						{best}
						onplay={choose}
					/>{:else}<PipRandomList {entries} {level} {completed} {best} onplay={choose} />{/if}{/if}
		{:else}
			<nav class="sets" aria-label="Level sets">
				{#each groups as set, index}<button
						class="btn btn-sm"
						class:btn-primary={group === set}
						aria-pressed={group === set}
						onclick={() => (group = set)}
						>{random
							? `${set}A–${set}J`
							: tutorial
								? set
								: `${index * 10 + 1}–${Math.min(entries.length, (index + 1) * 10)}`}</button
					>{/each}
			</nav>
			<div class="level-grid">
				{#each entries as entry, i}{#if groupFor(i) === group}<button
							class="level-tile"
							class:current={level === i}
							class:done={completed.includes(entry.id)}
							aria-current={level === i ? 'step' : undefined}
							aria-label={`${entry.id} ${entry.title}${completed.includes(entry.id) ? ', completed' : ''}`}
							onclick={() => choose(i)}
							><strong>{label(entry.id)}</strong
							>{#if !/^Stage (?:\d+|[A-J]{3})$/.test(entry.title)}<span>{entry.title}</span
								>{/if}{#if completed.includes(entry.id)}<small aria-label="Completed"
									>{random
										? best[entry.id] !== undefined
											? best[entry.id] <= 15
												? '★★'
												: '★'
											: '●'
										: tutorial
											? best[entry.id] !== undefined && best[entry.id] <= (entry.maxMoves ?? 0)
												? '★★'
												: '★'
											: best[entry.id] !== undefined && best[entry.id] < (entry.maxMoves ?? 0)
												? '★'
												: '●'}</small
								>{/if}</button
						>{/if}{/each}
			</div>
		{/if}
	</div>
	<form method="dialog" class="modal-backdrop"><button>Close</button></form>
</dialog>

<style>
	.picker-views {
		display: flex;
		justify-content: center;
		gap: 8px;
		margin-bottom: 18px;
	}
	.stage-nav {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
	}
	.stage-title {
		min-width: 0;
		max-width: 70%;
		gap: 10px;
		border-radius: 24px;
		background: var(--color-base-200);
		color: var(--color-base-content);
	}
	.stage-title span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.stage-title.done {
		background: color-mix(in srgb, var(--color-success) 18%, var(--color-base-100));
	}
	.stage-title small {
		opacity: 0.55;
		font-size: 11px;
	}
	.level-map {
		max-width: 620px;
		border: 2px solid var(--color-primary);
		border-radius: 28px;
	}
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
	}
	h2 {
		font-size: 23px;
		font-weight: 700;
	}
	.sets {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 20px;
	}
	.level-grid {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 10px;
	}
	.level-tile {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 88px;
		border: 2px solid var(--color-base-300);
		border-radius: 20px;
		background: var(--color-base-200);
		color: var(--color-base-content);
		cursor: pointer;
		padding: 10px 5px;
	}
	.level-tile strong {
		font-size: 25px;
	}
	.level-tile span {
		font-size: 10px;
		text-wrap: balance;
	}
	.level-tile.done {
		background: color-mix(in srgb, var(--color-success) 18%, var(--color-base-100));
	}
	.level-tile.current {
		border-color: var(--color-primary);
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	.level-tile:hover {
		border-color: var(--color-primary);
	}
	.level-tile:focus-visible {
		outline: 3px solid var(--color-primary);
		outline-offset: 3px;
	}
	.level-tile small {
		position: absolute;
		right: 7px;
		top: 4px;
		color: var(--color-primary);
	}
	@media (max-width: 480px) {
		.level-grid {
			gap: 7px;
		}
		.level-tile {
			min-height: 76px;
			border-radius: 15px;
		}
		.level-tile strong {
			font-size: 22px;
		}
		.stage-title {
			font-size: 13px;
			padding-inline: 12px;
		}
	}
</style>
