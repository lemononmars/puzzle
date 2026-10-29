<script lang="ts">
	import { onMount } from 'svelte';
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import DevilDiceBoard from '#lib/components/DevilDiceBoard.svelte';
	import DemonDiceGame from '#lib/components/DemonDiceGame.svelte';
	import DemonDieIcon from '#lib/components/DemonDieIcon.svelte';
	import { makeDie } from '#lib/games/devilDiceTutorials.js';
	import { type Kind } from '#lib/games/devilDice.js';
	import {
		editWorkshopAxis,
		rotateWorkshopDie,
		type DiceAxis,
		readWorkshopPuzzle,
		encodeWorkshopPuzzle,
		decodeWorkshopPuzzle,
		workshopChallenge,
		workshopState,
		type WorkshopPuzzle
	} from '#lib/games/pipsPlotWorkshop.js';
	const fresh = (): WorkshopPuzzle => ({
		format: 'pips-plot-puzzle',
		version: 1,
		title: 'My little plot',
		hint: '',
		maxMoves: 5,
		field: {
			width: 5,
			height: 4,
			removedTiles: [],
			player: { x: 0, y: 2, riding: false },
			dice: [makeDie(1, 2, 2), makeDie(2, 4, 2)],
			sinkDuration: 6000
		}
	});
	let draft = $state<WorkshopPuzzle>(fresh());
	let selected = $state({ x: 2, y: 2 }),
		kind = $state<Kind>('normal'),
		face = $state(2);
	let ready = $state(false),
		testing = $state(false),
		reduced = $state(false),
		error = $state(''),
		notice = $state(''),
		shareUrl = $state(''),
		saved = $state('');
	let testPuzzle = $state<WorkshopPuzzle | null>(null),
		testKey = $state(0);
	let selectedDie = $derived(
		draft.field.dice.find((d) => d.x === selected.x && d.y === selected.y)
	);
	let hole = $derived(
		(draft.field.removedTiles ?? []).some((p) => p.x === selected.x && p.y === selected.y)
	);
	let preview = $derived(workshopState(draft));
	$effect(() => {
		if (selectedDie) {
			kind = selectedDie.kind;
			face = selectedDie.top;
		}
	});
	$effect(() => {
		const json = JSON.stringify(draft);
		if (ready) {
			try {
				localStorage.setItem('pips-plot.workshop.draft.v1', json);
			} catch {
				/* Draft storage is optional. */
			}
		}
		if (saved && json !== saved) {
			shareUrl = '';
			saved = '';
		}
	});
	onMount(() => {
		reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		try {
			const encoded = new URLSearchParams(location.hash.slice(1)).get('p');
			if (encoded) draft = decodeWorkshopPuzzle(encoded);
			else {
				const value = localStorage.getItem('pips-plot.workshop.draft.v1');
				if (value) draft = readWorkshopPuzzle(JSON.parse(value));
			}
		} catch (e) {
			error = (e as Error).message;
		}
		ready = true;
	});
	function resizeAxis(axis: 'x' | 'y', index: number, add: boolean) {
		try {
			const dimension = axis === 'x' ? 'width' : 'height';
			const previousLength = draft.field[dimension];
			draft.field = editWorkshopAxis(draft.field, axis, index, add);
			if (draft.field[dimension] !== previousLength) {
				const coordinate = selected[axis];
				selected = {
					...selected,
					[axis]:
						add && coordinate >= index
							? coordinate + 1
							: !add && coordinate > index
								? coordinate - 1
								: coordinate
				};
			}
			selected = {
				x: Math.min(selected.x, draft.field.width - 1),
				y: Math.min(selected.y, draft.field.height - 1)
			};
			error = '';
		} catch (e) {
			error = (e as Error).message;
		}
	}
	function applyBrush() {
		if (selectedDie)
			Object.assign(selectedDie, makeDie(selectedDie.id, selected.x, selected.y, face, kind));
	}
	function removeDie() {
		draft.field.dice = draft.field.dice.filter((d) => d.x !== selected.x || d.y !== selected.y);
		if (draft.field.player.x === selected.x && draft.field.player.y === selected.y)
			draft.field.player.riding = false;
	}
	function addDie() {
		if (hole) return;
		removeDie();
		draft.field.dice.push(
			makeDie(
				Math.max(0, ...draft.field.dice.map((d) => d.id)) + 1,
				selected.x,
				selected.y,
				face,
				kind
			)
		);
		if (draft.field.player.x === selected.x && draft.field.player.y === selected.y)
			draft.field.player.riding = true;
	}
	function toggleFloor() {
		if (hole)
			draft.field.removedTiles = (draft.field.removedTiles ?? []).filter(
				(p) => p.x !== selected.x || p.y !== selected.y
			);
		else if (
			!selectedDie &&
			!(draft.field.player.x === selected.x && draft.field.player.y === selected.y)
		)
			draft.field.removedTiles = [...(draft.field.removedTiles ?? []), { ...selected }];
	}
	function turn(axis: DiceAxis) {
		if (selectedDie) {
			Object.assign(selectedDie, rotateWorkshopDie(selectedDie, axis));
			face = selectedDie.top;
		}
	}
	function test() {
		try {
			testPuzzle = readWorkshopPuzzle(draft);
			testKey++;
			testing = true;
			error = '';
		} catch (e) {
			error = (e as Error).message;
		}
	}
	function save() {
		try {
			const puzzle = readWorkshopPuzzle(draft);
			shareUrl = `${location.origin}/web-game/pips-plot/workshop/play#p=${encodeWorkshopPuzzle(puzzle)}`;
			saved = JSON.stringify(draft);
			const blob = new Blob([JSON.stringify(puzzle, null, 2)], { type: 'application/json' });
			const objectUrl = URL.createObjectURL(blob),
				link = document.createElement('a');
			link.href = objectUrl;
			link.download = `${
				puzzle.title
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, '-')
					.replace(/^-|-$/g, '') || 'pips-plot-puzzle'
			}.json`;
			link.click();
			setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
			error = '';
			notice = 'JSON downloaded. Share the link below to let anyone play this version.';
		} catch (e) {
			error = (e as Error).message;
		}
	}
	async function importFile(event: Event) {
		const input = event.target as HTMLInputElement,
			file = input.files?.[0];
		if (!file) return;
		try {
			if (file.size > 65536) throw Error('Choose a puzzle JSON smaller than 64 KB.');
			draft = readWorkshopPuzzle(JSON.parse(await file.text()));
			selected = { x: 0, y: 0 };
			error = '';
			notice = 'Puzzle imported.';
		} catch (e) {
			error = (e as Error).message;
		} finally {
			input.value = '';
		}
	}
	async function copy() {
		try {
			await navigator.clipboard.writeText(shareUrl);
			notice = 'Link copied.';
		} catch {
			notice = 'Select and copy the link below.';
		}
	}
</script>

<svelte:head><title>Pip's Plot · Workshop</title></svelte:head>
{#if !testing}<div class="workshop-heading">
		<PageHeading title="Workshop" /><a class="btn btn-ghost btn-sm" href="/web-game/pips-plot"
			>All modes</a
		>
	</div>{/if}
{#if testing && testPuzzle}
	<button class="btn mb-4" onclick={() => (testing = false)}>← Back to editor</button>
	{#key testKey}<DemonDiceGame mode="puzzles" customPuzzle={workshopChallenge(testPuzzle)} />{/key}
{:else}
	<div class="workshop">
		<section class="botanical-surface editor" inert={!ready}>
			<div class="name-row">
				<input
					aria-label="Puzzle name"
					class="input input-sm"
					maxlength="80"
					bind:value={draft.title}
				/><label
					>Moves<input
						aria-label="Moves"
						class="input input-sm"
						type="number"
						min="1"
						max="999"
						bind:value={draft.maxMoves}
					/></label
				>
			</div>
			<div class="field-shell">
				<div
					class="field-grid"
					style={'grid-template-columns: repeat(' + draft.field.width + ', minmax(0,1fr))'}
					aria-label="Puzzle field editor"
				>
					{#each Array(draft.field.height) as _, y}
						{#each Array(draft.field.width) as _, x}
							{@const die = draft.field.dice.find((d) => d.x === x && d.y === y)}
							{@const missing = (draft.field.removedTiles ?? []).some(
								(p) => p.x === x && p.y === y
							)}
							{@const pip = draft.field.player.x === x && draft.field.player.y === y}
							{@const active = selected.x === x && selected.y === y}
							<div class="cell" class:active>
								<button
									class="tile"
									class:missing
									class:selected={active}
									aria-label={'Row ' +
										(y + 1) +
										', column ' +
										(x + 1) +
										(die ? ', ' + die.kind + ' ' + die.top : '') +
										(pip ? ', Pip' : '') +
										(missing ? ', no floor' : '')}
									aria-pressed={active}
									onclick={() => {
										selected = { x, y };
										if (die) {
											kind = die.kind;
											face = die.top;
										}
									}}
								>
									{#if die}<DemonDieIcon kind={die.kind} orientation={die} />{:else}<span
											aria-hidden="true">{missing ? '·' : ''}</span
										>{/if}
									{#if pip}<span class="pip-mark" aria-hidden="true">🌱</span>{/if}
								</button>
								{#if active}
									{#if die}<button
											class="corner"
											aria-label="Remove selected die"
											title="Remove die"
											onclick={removeDie}>×</button
										>
									{:else if missing}<button
											class="corner"
											aria-label="Restore selected floor"
											title="Restore floor"
											onclick={toggleFloor}>+</button
										>
									{:else if !pip}<button
											class="corner"
											aria-label="Remove selected floor"
											title="Remove floor"
											onclick={toggleFloor}>×</button
										>{/if}
									{#if die}<div class="orientation-tools" aria-label="Rotate selected die">
											{#each ['x', 'y', 'z'] as axis}<button
													class="turn axis-{axis}"
													aria-label={'Rotate selected die around ' + axis.toUpperCase() + ' axis'}
													title={axis.toUpperCase() + ' axis · quarter turn'}
													onclick={() => turn(axis as DiceAxis)}
													><svg
														width="22"
														height="22"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="2"
														aria-hidden="true"
														><g
															transform={axis === 'x'
																? 'rotate(-40 12 12)'
																: axis === 'z'
																	? 'rotate(40 12 12)'
																	: 'translate(0 4) scale(1 .65)'}
															><path
																d="M19 8a8 8 0 1 0 1 8"
																vector-effect="non-scaling-stroke"
															/><path d="m14 8 5 1 1-5" vector-effect="non-scaling-stroke" /></g
														></svg
													><span>{axis.toUpperCase()}</span></button
												>{/each}
										</div>{/if}
								{/if}
							</div>
						{/each}
					{/each}
				</div>
				{#each ['top', 'right', 'bottom', 'left'] as edge}
					{@const axis = edge === 'left' || edge === 'right' ? 'x' : 'y'}
					{@const length = axis === 'x' ? draft.field.width : draft.field.height}
					{@const leading = edge === 'top' || edge === 'left'}
					<div class="edge-tools edge-{edge}">
						<button
							aria-label={'Add ' + edge + ' edge'}
							title={'Add ' + edge + ' edge'}
							disabled={length >= 10}
							onclick={() => resizeAxis(axis, leading ? 0 : length, true)}>+</button
						><button
							aria-label={'Remove ' + edge + ' edge'}
							title={'Remove ' + edge + ' edge'}
							disabled={length <= 2}
							onclick={() => resizeAxis(axis, leading ? 0 : length - 1, false)}>−</button
						>
					</div>
				{/each}
			</div>
			<div class="tile-toolbar">
				<select
					class="select select-sm"
					aria-label="Die type"
					bind:value={kind}
					onchange={(e) => {
						const el = e.currentTarget;
						if (el.getAttribute('aria-label') === 'Die type') kind = el.value as Kind;
						else face = Number(el.value);
						applyBrush();
					}}
					>{#each ['normal', 'wood', 'ice', 'stone', 'metal'] as material}<option value={material}
							>{material}</option
						>{/each}</select
				>
				<select
					class="select select-sm face"
					aria-label="Top face"
					bind:value={face}
					onchange={(e) => {
						face = Number(e.currentTarget.value);
						applyBrush();
					}}
					>{#each [1, 2, 3, 4, 5, 6] as number}<option value={number}>{number}</option
						>{/each}</select
				>
				{#if !selectedDie}<button class="btn btn-sm btn-primary" disabled={hole} onclick={addDie}
						>Add die</button
					>{/if}
				<button
					class="btn btn-sm"
					disabled={hole}
					onclick={() => (draft.field.player = { ...selected, riding: !!selectedDie })}
					>{selectedDie ? 'Place Pip on die' : 'Place Pip'}</button
				>
			</div>
			<details class="editor-details">
				<summary>Hint & files</summary><label
					>Hint (optional)<textarea class="textarea w-full" maxlength="500" bind:value={draft.hint}
					></textarea></label
				><label
					>Import puzzle JSON<input
						class="file-input file-input-sm w-full"
						type="file"
						accept=".json,application/json"
						onchange={importFile}
					/></label
				><button
					class="btn btn-ghost btn-sm"
					onclick={() => {
						draft = fresh();
						selected = { x: 2, y: 2 };
						error = '';
						notice = '';
					}}>New puzzle</button
				>
			</details>
		</section>
		<section class="botanical-surface preview" inert={!ready}>
			{#key JSON.stringify(draft.field)}<DevilDiceBoard
					game={preview}
					paused
					reducedMotion={reduced}
				/>{/key}
			<div class="controls">
				<button class="btn btn-primary" disabled={!ready} onclick={test}>Test puzzle</button><button
					class="btn"
					disabled={!ready}
					onclick={save}>Save & download JSON</button
				>
			</div>
		</section>
	</div>
{/if}
{#if error}<p role="alert" class="text-error">{error}</p>{/if}
{#if notice}<p role="status">{notice}</p>{/if}
{#if shareUrl}<section class="botanical-surface share">
		<label
			>Shareable puzzle URL<input
				class="input w-full"
				readonly
				value={shareUrl}
				onclick={(e) => e.currentTarget.select()}
			/></label
		>
		<div class="controls">
			<button class="btn" onclick={copy}>Copy link</button><a
				class="btn btn-primary"
				href={shareUrl}
				target="_blank"
				rel="noreferrer">Play shared puzzle</a
			>
		</div>
		<p class="botanical-muted">
			The link contains the puzzle itself. Keep the entire link, including everything after #. Later
			edits won’t change this saved version.
		</p>
	</section>{/if}

<style>
	.workshop-heading {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
	}
	.workshop {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 16px;
		align-items: start;
	}
	.editor,
	.preview,
	.share {
		padding: 16px;
		min-width: 0;
	}
	.editor {
		display: grid;
		gap: 12px;
	}
	.name-row {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.name-row > input {
		flex: 1;
		min-width: 0;
	}
	.name-row label {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
	}
	.name-row label input {
		width: 65px;
	}
	.field-shell {
		position: relative;
		margin: 30px;
	}
	.field-grid {
		display: grid;
		gap: 5px;
		align-items: center;
	}
	.cell {
		position: relative;
		min-width: 0;
		aspect-ratio: 1;
	}
	.cell.active {
		z-index: 3;
	}
	.tile {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		position: relative;
		border: 1px solid var(--color-base-300);
		border-radius: 8px;
		background: var(--color-base-200);
		color: var(--color-base-content);
		cursor: pointer;
		padding: 2px;
	}
	.tile.selected {
		outline: 2px solid var(--color-primary);
		outline-offset: 0;
	}
	.tile.missing {
		background: var(--color-base-100);
		border-style: dashed;
	}
	.tile :global(svg) {
		width: 100%;
		height: 100%;
		max-height: 74px;
	}
	.pip-mark {
		position: absolute;
		bottom: 0;
		right: 0;
		font-size: 20px;
	}
	.corner {
		position: absolute;
		right: -5px;
		top: -5px;
		width: 24px;
		height: 24px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		border: 1px solid var(--color-base-300);
		background: var(--color-base-100);
		color: var(--color-base-content);
		font-size: 19px;
		cursor: pointer;
		z-index: 5;
	}
	.orientation-tools {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 6;
	}
	.orientation-tools .turn {
		position: absolute;
		pointer-events: auto;
		width: 30px;
		height: 34px;
	}
	.axis-x {
		left: -34px;
		top: 50%;
		transform: translateY(-50%);
	}
	.axis-y {
		top: -38px;
		left: 50%;
		transform: translateX(-50%);
	}
	.axis-z {
		right: -34px;
		top: 50%;
		transform: translateY(-50%);
	}
	.turn,
	.edge-tools button {
		display: grid;
		place-items: center;
		border: 1px solid var(--color-base-300);
		background: var(--color-base-100);
		color: var(--color-base-content);
		border-radius: 6px;
		cursor: pointer;
		width: 26px;
		height: 26px;
		font-size: 17px;
	}
	.edge-tools {
		position: absolute;
		display: flex;
		gap: 3px;
		justify-content: center;
		opacity: 0;
	}
	.turn {
		width: 28px;
		height: 42px;
		padding: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0;
	}
	.turn span {
		font-size: 10px;
		line-height: 12px;
	}
	.field-shell:hover .edge-tools,
	.field-shell:focus-within .edge-tools {
		opacity: 1;
	}
	.edge-tools button:disabled {
		opacity: 0.3;
		cursor: default;
	}
	.edge-top {
		top: -30px;
		left: 50%;
		transform: translateX(-50%);
	}
	.edge-bottom {
		bottom: -30px;
		left: 50%;
		transform: translateX(-50%);
	}
	.edge-left {
		left: -30px;
		top: 50%;
		transform: translateY(-50%);
		flex-direction: column;
	}
	.edge-right {
		right: -30px;
		top: 50%;
		transform: translateY(-50%);
		flex-direction: column;
	}

	.tile-toolbar {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
		align-items: center;
	}
	.tile-toolbar .select {
		width: 105px;
	}
	.tile-toolbar .face {
		width: 56px;
	}
	button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 3px;
	}
	.editor-details {
		font-size: 13px;
	}
	.editor-details summary {
		cursor: pointer;
	}
	.editor-details label {
		display: grid;
		gap: 5px;
		margin-top: 12px;
	}
	.controls {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		margin-top: 12px;
	}
	.controls .btn {
		font-size: 13px;
	}
	.share {
		margin-top: 16px;
	}
	.share label {
		display: grid;
		gap: 6px;
		font-size: 13px;
	}
	.share p {
		font-size: 12px;
		overflow-wrap: anywhere;
	}
	@media (hover: none) {
		.edge-tools {
			opacity: 1;
		}
	}
	@media (max-width: 760px) {
		.workshop {
			grid-template-columns: minmax(0, 1fr);
		}
		.editor,
		.preview {
			padding: 12px;
		}
	}
</style>
