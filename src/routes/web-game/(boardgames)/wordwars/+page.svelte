<script lang="ts">
	import { onMount } from 'svelte';
	import dictionaryUrl from '#lib/dict.json?url';
	import {
		displayLetter,
		prepareDictionary,
		newWar,
		addWarLetter,
		challengeWar,
		answerWar,
		concedeWar,
		expireWar,
		nextWarRound,
		botWarAction,
		TURN_MS,
		TARGET_SCORE,
		type WordWar,
		type WarDictionary
	} from '#lib/games/wordWars.js';
	let dictionary = $state<WarDictionary | null>(null),
		game = $state<WordWar | null>(null);
	let loading = $state(true),
		loadError = $state(''),
		error = $state(''),
		letter = $state(''),
		answer = $state(''),
		picked = $state<number[]>([]),
		clock = $state(Date.now());
	let selectedReserve = $state<number | null>(null);
	let botAt = 0,
		controller: AbortController | undefined;
	let humanTurn = $derived(game?.turn === 0 && game.phase === 'turn');
	let humanAnswer = $derived(game?.turn === 0 && game.phase === 'answer');
	let active = $derived(game?.phase === 'turn' || game?.phase === 'answer');
	let remaining = $derived(
		game && active ? Math.max(0, Math.ceil((game.deadline - clock) / 1000)) : 0
	);
	async function loadDictionary() {
		controller?.abort();
		controller = new AbortController();
		loading = true;
		loadError = '';
		try {
			const response = await fetch(dictionaryUrl, { signal: controller.signal });
			if (!response.ok) throw Error('The Thai dictionary could not be loaded.');
			dictionary = prepareDictionary(await response.json());
		} catch (e) {
			if ((e as Error).name !== 'AbortError') loadError = (e as Error).message;
		} finally {
			loading = false;
		}
	}
	function update(next: WordWar) {
		game = next;
		clock = Date.now();
		botAt = clock + 2500;
		error = '';
		answer = '';
		picked = [];
		letter = '';
		selectedReserve = null;
	}
	function start() {
		if (dictionary) update(newWar(dictionary, Date.now()));
	}
	function act(action: 'add' | 'challenge' | 'answer' | 'concede' | 'next') {
		if (!game || !dictionary) return;
		const now = Date.now();
		const expired = expireWar(game, dictionary, now);
		if (expired !== game) {
			update(expired);
			return;
		}
		try {
			if (action === 'add' && humanTurn) update(addWarLetter(game, letter, now));
			else if (action === 'challenge' && humanTurn) update(challengeWar(game, now));
			else if (action === 'answer' && humanAnswer) update(answerWar(game, answer, dictionary, now));
			else if (action === 'concede' && humanAnswer) update(concedeWar(game, dictionary));
			else if (action === 'next') update(nextWarRound(game, dictionary, now));
		} catch (e) {
			error = (e as Error).message;
		}
	}
	function pickTile(index: number) {
		if (!humanAnswer || !game || picked.includes(index)) return;
		picked = [...picked, index];
		answer += game.pool[index];
	}
	onMount(() => {
		void loadDictionary();
		const timer = setInterval(() => {
			clock = Date.now();
			if (!game || !dictionary) return;
			const next = expireWar(game, dictionary, clock);
			if (next !== game) {
				update(next);
				return;
			}
			if (game.turn === 1 && (game.phase === 'turn' || game.phase === 'answer') && clock >= botAt)
				update(botWarAction(game, dictionary, clock));
		}, 100);
		return () => {
			controller?.abort();
			clearInterval(timer);
		};
	});
</script>

<svelte:head
	><title>Word Wars · Chi Fun</title><meta
		name="description"
		content="Select starting letters into a shared pool, then make a dictionary word from the pool."
	/></svelte:head
>

<div class="war">
	{#if loading}<section class="botanical-surface setup">
			<p role="status">Loading the Thai dictionary…</p>
		</section>
	{:else if loadError}<section class="botanical-surface setup">
			<p role="alert">{loadError}</p>
			<button class="btn btn-primary" onclick={loadDictionary}>Retry dictionary</button>
		</section>
	{:else if !game}<section class="botanical-surface setup">
			<h1>Word Wars</h1>
			<div class="versus"><strong>You</strong><span>vs</span><strong>Mali 🌼</strong></div>
			<button class="btn btn-primary" onclick={start}>Play against Mali</button>
		</section>
	{:else}
		<section class="botanical-surface arena">
			<div class="turn-heading">
				<h2>
					{game.phase === 'finished'
						? game.winner === 0
							? 'You win the match!'
							: 'Mali wins the match'
						: game.phase === 'result'
							? game.winner === 0
								? 'You win this round!'
								: 'Mali wins this round'
							: game.phase === 'answer'
								? game.turn === 0
									? 'Find a word'
									: 'Mali is making a word'
								: game.turn === 0
									? 'Your turn'
									: 'Mali’s turn'}
				</h2>
				{#if active}<span
						class="clock"
						role="timer"
						aria-label="Seconds remaining"
						data-testid="war-timer">{remaining}</span
					>{/if}
			</div>
			{#if active}<progress
					class="progress progress-primary w-full"
					max={TURN_MS}
					value={Math.max(0, game.deadline - clock)}
					aria-label="Turn time remaining"
				></progress>{/if}
			<p role="status" class="turn-status">{game.lastAction}</p>
			<section class="reserve-area" aria-label="Starting letter reserve">
				<h3>Starting letters</h3>

				<div class="pool reserve">
					{#each game.reserve as tile, index}<button
							type="button"
							class="tile"
							class:chosen={selectedReserve === index}
							disabled={!humanTurn}
							aria-label={`Starting tile ${index + 1}: ${displayLetter(tile)}`}
							aria-pressed={selectedReserve === index}
							title="Double-click to add"
							ondblclick={() => {
								letter = tile;
								act('add');
							}}
							onclick={() => {
								letter = tile;
								selectedReserve = index;
							}}>{displayLetter(tile)}</button
						>{/each}
				</div>
				{#if !game.reserve.length}<p>All starting letters have been selected.</p>{/if}
			</section>
			<h3>Word pool</h3>
			<div class="pool" aria-label="Shared letter pool">
				{#if !game.pool.length}<p class="botanical-muted">
						The pool is empty. Select a starting letter.
					</p>{/if}
				{#each game.pool as tile, index}<button
						type="button"
						class="tile"
						class:used={picked.includes(index)}
						disabled={!humanAnswer || picked.includes(index)}
						aria-label={`Tile ${index + 1}: ${displayLetter(tile)}`}
						onclick={() => pickTile(index)}><span lang="th">{displayLetter(tile)}</span></button
					>{/each}
			</div>
			<p class="botanical-muted pool-count">{game.pool.length} tiles · use all of them</p>
			{#if humanTurn}
				<div class="add-control">
					<button
						class="btn btn-primary"
						disabled={!game.reserve.includes(letter)}
						onclick={() => act('add')}>Add selected letter</button
					><button
						class="btn btn-outline"
						disabled={game.pool.length < 2}
						onclick={() => act('challenge')}>Challenge</button
					>
				</div>{:else if humanAnswer}
				<form
					onsubmit={(e) => {
						e.preventDefault();
						act('answer');
					}}
				>
					<label for="war-answer">Make one word using every tile</label>
					<input
						id="war-answer"
						class="input w-full answer"
						lang="th"
						bind:value={answer}
						oninput={() => (picked = [])}
						autocomplete="off"
						autocapitalize="off"
						spellcheck="false"
					/>
					<p class="botanical-muted">
						Type your word, or tap tiles in order. Only words in this game’s dictionary count.
					</p>
					<div class="actions">
						<button class="btn btn-primary" disabled={!answer.trim()}>Submit word</button><button
							type="button"
							class="btn"
							onclick={() => {
								answer = '';
								picked = [];
								error = '';
							}}>Clear word</button
						><button type="button" class="btn btn-ghost" onclick={() => act('concede')}
							>Give up</button
						>
					</div>
				</form>
			{:else if active}<p class="bot-thinking" role="status">
					{game.phase === 'answer'
						? 'Mali is arranging the letters…'
						: 'Mali is deciding whether to add or challenge…'}
				</p>
			{:else}
				<div class="result" role="status">
					<p>{game.message}</p>
					{#if game.revealed}<p class="dictionary-word" lang="th">{game.revealed}</p>
						<p class="botanical-muted">A dictionary word using this pool.</p>{:else}<p
							class="botanical-muted"
						>
							No word in this game’s dictionary uses the full pool.
						</p>{/if}
				</div>
				<button
					class="btn btn-primary"
					onclick={() => (game?.phase === 'finished' ? start() : act('next'))}
					>{game.phase === 'finished' ? 'Play again' : 'Next round'}</button
				>
			{/if}
			{#if error}<p class="text-error" role="alert">{error}</p>{/if}
		</section>
		<div class="scoreboard">
			<div class:current={active && game.turn === 0} class="botanical-surface">
				<strong>You</strong><span data-testid="human-score">{game.scores[0]}</span>
			</div>
			<div class="round"><span>Round {game.round}</span><small>First to {TARGET_SCORE}</small></div>
			<div class:current={active && game.turn === 1} class="botanical-surface">
				<strong>Mali 🌼</strong><span data-testid="bot-score">{game.scores[1]}</span>
			</div>
		</div>
		<details class="botanical-surface rules">
			<summary>Rules & dictionary</summary>
			<p>
				Ten starting letters sit in a shared reserve. The word pool starts empty. Take turns
				selecting one remaining starting tile and adding it to the pool. Selected tiles leave the
				reserve.
			</p>
			<p>
				Instead of adding, choose Challenge. Your opponent then has 15 seconds to make a dictionary
				word using every pool tile exactly once. Starting letters that have not been selected cannot
				be used. Add at least two pool tiles first.
			</p>
			<p>
				A correct answer scores one point. Giving up or running out of time awards the opponent a
				point. Turns also last 15 seconds. First to three points wins; each new round deals ten new
				letters and alternates the starter.
			</p>
			<p>
				Uses {dictionary?.words.length.toLocaleString()} entries from the site's Thai dictionary. Vowels
				and tone marks are individual tiles.
			</p>
		</details>
	{/if}
</div>

<style>
	.reserve-area {
		border-bottom: 1px solid var(--color-base-300);
		margin-bottom: 20px;
	}
	.reserve-area p {
		font-size: 13px;
	}
	.tile.chosen {
		outline: 2px solid var(--color-primary);
	}
	.war {
		max-width: 850px;
		margin: 0 auto;
	}
	.setup,
	.arena,
	.rules {
		padding: 24px;
	}
	.setup p {
		margin: 16px 0;
		line-height: 1.7;
	}
	.versus {
		display: flex;
		justify-content: center;
		gap: 30px;
		align-items: center;
		font-size: 24px;
		margin-bottom: 24px;
	}
	.versus span {
		font-size: 15px;
		opacity: 0.6;
	}
	.scoreboard {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: 16px;
		align-items: center;
		margin-bottom: 16px;
	}
	.scoreboard > div:not(.round) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 20px;
	}
	.scoreboard span[data-testid] {
		font-size: 30px;
	}
	.scoreboard .current {
		border-color: var(--color-primary);
	}
	.round {
		text-align: center;
	}
	.round small {
		display: block;
		font-size: 11px;
		opacity: 0.65;
	}
	.turn-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	.turn-heading h2 {
		font-size: 24px;
	}
	.clock {
		font-size: 36px;
		font-variant-numeric: tabular-nums;
		color: var(--color-primary);
	}
	.turn-status {
		min-height: 30px;
		margin: 16px 0;
		font-size: 14px;
	}
	.pool {
		display: flex;
		flex-wrap: wrap;
		gap: 9px;
		justify-content: center;
		padding: 20px 0;
	}
	.tile {
		width: 58px;
		height: 65px;
		border: 1px solid var(--color-base-300);
		border-bottom-width: 4px;
		border-radius: 12px;
		background: var(--color-base-200);
		color: var(--color-base-content);
		display: grid;
		place-items: center;
		font-family: var(--font-serif);
		font-size: 30px;
	}
	.tile:disabled {
		opacity: 1;
		cursor: default;
	}
	.tile.used {
		opacity: 0.3;
	}
	.tile:not(:disabled) {
		cursor: pointer;
	}
	.pool-count {
		text-align: center;
		font-size: 12px;
		margin-bottom: 24px;
	}
	.add-control,
	.actions {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		margin: 12px 0;
	}
	.tile:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 3px;
	}
	.answer {
		font-size: 24px;
		margin: 10px 0;
	}
	.bot-thinking {
		text-align: center;
		padding: 20px;
	}
	.result {
		text-align: center;
		margin: 20px 0;
	}
	.dictionary-word {
		font-size: 32px;
		margin: 14px 0;
	}
	.rules {
		margin-top: 16px;
	}
	.rules summary {
		cursor: pointer;
	}
	.rules p {
		font-size: 14px;
		line-height: 1.7;
		margin-top: 12px;
	}
	@media (max-width: 600px) {
		.setup,
		.arena,
		.rules {
			padding: 16px;
		}
		.scoreboard {
			gap: 8px;
		}
		.scoreboard > div:not(.round) {
			padding: 12px;
			gap: 8px;
		}
		.tile {
			width: 45px;
			height: 54px;
			font-size: 27px;
		}
		.pool {
			gap: 7px;
		}
		.turn-heading h2 {
			font-size: 20px;
		}
	}
</style>
