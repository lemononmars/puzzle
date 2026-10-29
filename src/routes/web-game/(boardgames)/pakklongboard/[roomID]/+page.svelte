<script lang="ts">
	import { page } from '$app/state';
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import { createPakklongGame } from '#lib/boardgame/pakklong/game.svelte.js';
	import Marketplace from '#lib/boardgame/pakklong/Marketplace.svelte';
	import PlayerBoard from '#lib/boardgame/pakklong/PlayerBoard.svelte';
	import StatusBar from '#lib/boardgame/pakklong/StatusBar.svelte';
	import RoomControls from '#lib/boardgame/pakklong/RoomControls.svelte';
	import TableDetails from '#lib/boardgame/pakklong/TableDetails.svelte';
	import '#lib/boardgame/pakklong/table.css';
	const game = createPakklongGame(page.params.roomID!);
	let activePanel = $state('market');
	let statusHeight = $state(0);
	let showHelp = $state(true);
	let phaseHelp = $derived(
		game.gameState === 2
			? 'The game has finished. Review the final scores below.'
			: game.phase === 1
				? 'Plan your shop visits with time tokens. Lower numbers buy first.'
				: game.phase === 4
					? 'Make bouquets from your orders and flowers, then finish arranging.'
					: game.currentPlayer === game.myID
						? 'Your turn. Choose goods from an available shop, or pass.'
						: `Waiting for ${game.players[game.currentPlayer]?.username || 'the next player'}.`
	);
</script>

<svelte:head><title>Pakklong Talat Board Game | Chi Fun</title></svelte:head>
<div
	class="pakklong-table"
	data-testid="pakklong-table"
	style={`--status-height: ${statusHeight}px`}
>
	{#if game.gameState === 0}
		<PageHeading
			title="Pakklong Talat"
			description="Collect flowers, plan your visits, and arrange bouquets."
		/>
		<section class="table-panel pregame" aria-labelledby="setup-heading">
			<h2 id="setup-heading">Gather around the table</h2>
			<p>{game.lobbyPlayers.map((player) => player.username).join(', ') || 'Joining room…'}</p>
			<label class="label" for="bots-select">Add computer players</label><select
				id="bots-select"
				class="select"
				bind:value={game.numBots}
				>{#each Array(Math.max(1, 7 - game.lobbyPlayers.length)) as _, count}<option value={count}
						>{count === 0 ? 'No bots' : `${count} ${count === 1 ? 'bot' : 'bots'}`}</option
					>{/each}</select
			><button class="btn btn-primary" disabled={!game.joined} onclick={game.start}
				>Start Game!</button
			>
			<p class="help-copy">The host must keep their tab open during play.</p>
			<RoomControls roomID={page.params.roomID!} bind:showHelp />
		</section>
	{:else if game.me}
		<StatusBar {game} bind:height={statusHeight}>
			<nav class="table-sections" aria-label="Table sections">
				<button
					class="btn btn-sm"
					class:btn-primary={activePanel === 'market'}
					aria-pressed={activePanel === 'market'}
					onclick={() => (activePanel = 'market')}>Market</button
				><button
					class="btn btn-sm"
					class:btn-primary={activePanel === 'shop'}
					aria-pressed={activePanel === 'shop'}
					onclick={() => (activePanel = 'shop')}>Your shop</button
				><button
					class="btn btn-sm"
					class:btn-primary={activePanel === 'details'}
					aria-pressed={activePanel === 'details'}
					onclick={() => (activePanel = 'details')}>Players & goals</button
				>
			</nav>
		</StatusBar>
		<div class="table-workspace" data-panel={activePanel}>
			<Marketplace {game} {phaseHelp} {showHelp} /><PlayerBoard
				{game}
				roomID={page.params.roomID!}
				bind:showHelp
			/><TableDetails {game} />
		</div>
	{:else}<p class="alert bg-base-200 text-base-content" role="status">
			Loading your seat at the table…
		</p>{/if}
</div>
