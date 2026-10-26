<script lang="ts">
	import type { PakklongGame } from './types';
	export let game: PakklongGame;
	export let height = 0;
	const phases = ['Early bird', 'Planning', 'Market buying', 'Aftermarket', 'Arranging'];
	$: active = game.players[game.currentPlayer];
</script>

<header class="game-status-bar phase-bar" bind:clientHeight={height} aria-label="Game status">
	<div class="status-navigation">
		<slot />
		<div class="phase-summary">
			<strong
				>{game.gameState === 2
					? 'Final scores'
					: `Turn ${game.turn} · ${phases[game.phase]}`}</strong
			>
		</div>
	</div>
	<div class="status-players">
		<span
			class="active-player-chip"
			style:border-color={active?.color || 'var(--color-primary)'}
			role="status"
			>Active: {game.gameState === 2
				? 'Game finished'
				: game.phase === 1
					? 'Everyone plans'
					: game.phase === 4
						? 'Everyone arranges'
						: active?.username || 'Waiting'}</span
		>
		<ol class="turn-order" aria-label="Turn order">
			{#each game.turnOrder as player, index}<li
					class:playing={player.id === game.currentPlayer && ![1, 4].includes(game.phase)}
					style:border-color={player.color}
					aria-current={player.id === game.currentPlayer && ![1, 4].includes(game.phase)
						? 'step'
						: undefined}
				>
					<span>{index + 1}</span>{player.username}{player.id === game.myID ? ' (You)' : ''}
				</li>{/each}
		</ol>
	</div>
</header>
