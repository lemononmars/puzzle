<script lang="ts">
	import type { PakklongGame } from './types';
	import { achievementString } from './constants';
	export let game: PakklongGame;
</script>

<div class="table-details">
	<section class="table-panel" aria-labelledby="players-heading">
		<h2 id="players-heading">Players</h2>
		<div class="player-list">
			{#each game.players as player, index}<div
					class="player-row"
					class:current-player={index === game.currentPlayer}
					style:border-left-color={player.color}
				>
					<div>
						<strong>{player.username}{index === game.myID ? ' (You)' : ''}</strong><small
							>{player.isBot ? 'Autoplay' : 'Player'} · ฿{player.money} · {player.actionCubes} cubes ·
							{player.numRibbons} ribbons</small
						><small>Flowers arranged: {player.stars.join(' / ')}</small>
					</div>
					<strong>{player.score} pts</strong>
				</div>{/each}
		</div>
	</section>
	<section class="table-panel" aria-labelledby="achievements-heading">
		<h2 id="achievements-heading">Achievements</h2>
		<div class="achievement-list">
			{#each game.achievements as achievement, index}<button
					class="achievement"
					disabled={!game.canShop(6) ||
						!game.checkAchievement(achievement.type, game.me) ||
						achievement.claimedBy.includes(game.myID)}
					onclick={() => game.clickGoods(6, index)}
					><strong>{achievementString[achievement.type]}</strong><small
						>{achievement.claimedBy.length
							? achievement.claimedBy.map((id) => game.players[id]?.username).join(', ')
							: 'Unclaimed'}{game.checkAchievement(achievement.type, game.me) &&
						!achievement.claimedBy.includes(game.myID)
							? ' · Ready to claim'
							: ''}</small
					></button
				>{/each}
		</div>
	</section>
	<details class="table-panel game-log">
		<summary>Game log <small>{game.gameLogs.length} events</small></summary>
		<ol>
			{#each [...game.gameLogs].reverse() as log}<li
					style:border-left-color={log.color || 'var(--color-base-300)'}
				>
					<time>{log.timestamp}</time><span>{log.msg}</span>
				</li>{/each}
		</ol>
	</details>
</div>
