<script lang="ts">
	import type { PakklongGame } from './types';
	import { timeTokenList } from './constants';
	import FlowerCard from './FlowerCard.svelte';
	import FlowerToken from './FlowerToken.svelte';
	import GameIcon from './GameIcon.svelte';
	import BotanicalFlower from './BotanicalFlower.svelte';
	import IconHint from './IconHint.svelte';
	import RoomControls from './RoomControls.svelte';
	export let game: PakklongGame;
	export let roomID: string;
	export let showHelp = true;
	const names = ['Pink', 'Blue', 'White'];
</script>

{#if game.me}
	<aside
		class="player-panel table-panel"
		aria-labelledby="player-heading"
		data-testid="pakklong-player"
	>
		<div class="panel-heading">
			<h2 id="player-heading">Your flower shop</h2>
			<button
				type="button"
				class="score-counter tooltip tooltip-left"
				data-tip="Victory points"
				aria-label={`${game.me.score} victory points`}
				><GameIcon name="trophy" />{game.me.score}</button
			>
		</div>
		<div class="autoplay-controls">
			{#if game.gameState === 1}<button
					class="btn btn-ghost tooltip"
					class:btn-active={game.autoplay}
					data-tip={`Autoplay: ${game.autoplay ? 'On' : 'Off'}`}
					aria-label={`Autoplay: ${game.autoplay ? 'On' : 'Off'}`}
					aria-pressed={game.autoplay}
					onclick={game.triggerAutoplay}><GameIcon name="bot" /></button
				>{/if}<select
				class="select select-sm"
				aria-label="Autoplay speed"
				value={game.autoplaySpeed}
				onchange={(event) => game.setAutoplaySpeed(Number(event.currentTarget.value))}
				><option value={0.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option
				><option value={4}>4×</option></select
			>
		</div>
		<p class="player-name" style:border-color={game.me.color}>{game.me.username}</p>
		<dl class="resource-grid">
			<div>
				<dt><IconHint name="coins" label="Money" /></dt>
				<dd>{game.me.money}</dd>
			</div>
			<div>
				<dt><IconHint name="ribbon" label="Ribbons" /></dt>
				<dd>{game.me.numRibbons}</dd>
			</div>
			<div>
				<dt><IconHint name="box" label="Action cubes" /></dt>
				<dd>{game.me.actionCubes}</dd>
			</div>
			<div>
				<dt><IconHint name="clock" label="Clock level" /></dt>
				<dd>{game.me.time}</dd>
			</div>
		</dl>
		<div class="bonus-grid" aria-label="Bouquet bonuses">
			{#each ['star', 'coins', 'trophy'] as icon, index}<button
					type="button"
					class="tooltip"
					data-tip={`${['Quality', 'Money', 'Points'][index]} bonus: ${names[game.me.bonus[index]]} flowers, ${game.me.stars[game.me.bonus[index]]}`}
					aria-label={`${['Quality', 'Money', 'Points'][index]} bonus: ${names[game.me.bonus[index]]} flowers, ${game.me.stars[game.me.bonus[index]]}`}
					><GameIcon name={icon as 'star' | 'coins' | 'trophy'} size={17} /><span
						class="flower-count flower-ink-{game.me.bonus[index]}"
						><BotanicalFlower type={game.me.bonus[index]} size={24} /></span
					>{game.me.stars[game.me.bonus[index]]}</button
				>{/each}
		</div>
		{#if game.phase === 1}
			<section aria-labelledby="tokens-heading">
				<h3 id="tokens-heading">
					<IconHint name="clock" label="Plan your shop visits" /><small aria-label="Shops planned"
						>{game.chosenTimeTokens.filter((value) => value !== null).length}/6</small
					>
				</h3>
				<div class="token-pool">
					{#each game.getMyTimeTokens(game.me) as value}{#if !game.chosenTimeTokens.includes(value)}<button
								class="btn"
								class:btn-primary={game.selectedTimeToken === value}
								class:btn-outline={game.selectedTimeToken !== value}
								aria-pressed={game.selectedTimeToken === value}
								aria-label={`Select time token ${timeTokenList[value]}`}
								disabled={game.isDone}
								onclick={() => game.handleSelectTimeToken(value)}>{timeTokenList[value]}</button
							>{/if}{/each}
				</div>
			</section>
		{/if}
		<section aria-labelledby="vases-heading">
			<h3 id="vases-heading">
				<IconHint name="vase" label="Fresh flowers / vase capacity" /><small
					>{game.me.vases.length}/{game.me.numVases}</small
				>
			</h3>
			<div class="vase-grid">
				{#each Array(game.me.numVases) as _, index}{@const token =
						game.me.vases[index]}{#if token}<FlowerToken
							{token}
							selected={game.selectedVasesIndices.includes(index)}
							label={`Select ${names[token.type]} flower quality ${token.quality}`}
							disabled={game.phase !== 4 || game.isDone}
							onclick={() => game.selectVaseToken(index)}
						/>{:else}<div
							role="img"
							class="empty-vase tooltip"
							data-tip="Empty vase"
							aria-label="Empty vase"
						>
							<GameIcon name="vase" />
						</div>{/if}{/each}
			</div>
		</section>
		<section aria-labelledby="hand-heading">
			<h3 id="hand-heading">
				<IconHint name="book" label="Bouquet orders / hand limit" /><small
					>{game.me.hand.length}/4</small
				>
			</h3>
			<div class="order-hand">
				{#each game.me.hand as card, index}<FlowerCard
						{card}
						selected={game.selectedFlowerCardIndex === index}
						disabled={game.phase !== 4 || game.isDone}
						onclick={() => game.selectFlowerCard(index)}
						label="Select order"
					/>{:else}<span
						class="empty-copy tooltip"
						data-tip="Visit the Bookstore to draw an order"
						role="img"
						aria-label="No orders in hand. Visit the Bookstore."
						><GameIcon name="book" size={28} /></span
					>{/each}
			</div>
		</section>
		{#if game.phase === 4 && !game.isDone}<label class="ribbon-picker" for="bouquet-ribbons"
				><IconHint name="ribbon" label="Ribbons: each adds 2 quality" /><select
					id="bouquet-ribbons"
					aria-label="Ribbons to use"
					class="select"
					bind:value={game.chosenRibbons}
					>{#each Array(game.me.numRibbons + 1) as _, count}<option value={count}
							>{count} (+{count * 2} ★)</option
						>{/each}</select
				></label
			>{/if}
		{#if game.notice?.target === 'player'}<p
				class="player-feedback alert"
				class:alert-error={game.notice.severity === 'error'}
				class:text-error-content={game.notice.severity === 'error'}
				class:alert-info={game.notice.severity !== 'error'}
				class:text-info-content={game.notice.severity !== 'error'}
				role={game.notice.severity === 'error' ? 'alert' : 'status'}
			>
				{game.notice.message}
			</p>{/if}
		<div class="player-actions icon-actions">
			{#if game.phase === 1 && !game.isDone}<button
					class="btn btn-primary tooltip"
					data-tip="Submit Planning"
					aria-label="Submit Planning"
					disabled={game.chosenTimeTokens.filter((value) => value !== null).length < 4}
					onclick={game.submitTimePlanning}><GameIcon name="send" /></button
				>{/if}
			{#if game.phase === 4 && !game.isDone}<button
					class="btn btn-primary tooltip"
					data-tip="Arrange Bouquet"
					aria-label="Arrange Bouquet"
					disabled={game.selectedFlowerCardIndex === -1}
					onclick={game.arrangeFlower}><GameIcon name="flower" /></button
				>{/if}

			{#if game.isDone}<span
					class="tooltip"
					data-tip="Waiting for the other players"
					role="status"
					aria-label="Waiting for the other players"><GameIcon name="clock" /></span
				>{/if}
		</div>
		{#if game.phase === 4 && game.canPass}<div class="finish-phase">
				<button class="btn btn-outline" aria-label="Finish arranging" onclick={game.passTurn}
					><GameIcon name="check" /><span>Finish arranging</span></button
				>
			</div>{/if}
		<RoomControls {roomID} bind:showHelp />
	</aside>
{/if}
