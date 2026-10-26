<script lang="ts">
	import type { PakklongGame, GameIconName } from './types';
	import { shopList, timeTokenList } from './constants';
	import FlowerCard from './FlowerCard.svelte';
	import FlowerToken from './FlowerToken.svelte';
	import PlanningSlot from './PlanningSlot.svelte';
	import GameIcon from './GameIcon.svelte';
	export let game: PakklongGame;
	export let phaseHelp = '';
	export let showHelp = true;
	const shopArt = ['restaurant-foodstand', 'rose', 'orchid', 'mums', 'bookstore', 'tools'];
	const toolNames = ['Clock', 'Vase', 'Ribbons', 'Flower voucher', 'Tie priority', 'Action cubes'];
	const toolIcons: GameIconName[] = ['clock', 'vase', 'ribbon', 'flower', 'arrow', 'box'];
</script>

<section class="market-panel table-panel" aria-label="Marketplace" data-testid="pakklong-market">
	{#if showHelp}<p class="market-help">{phaseHelp}</p>{/if}
	<div class="mobile-market-controls">
		{#if game.phase === 1}<div class="token-pool">
				{#each game.getMyTimeTokens(game.me!) as value}{#if !game.chosenTimeTokens.includes(value)}<button
							class="btn"
							class:btn-primary={game.selectedTimeToken === value}
							aria-pressed={game.selectedTimeToken === value}
							disabled={game.isDone}
							aria-label={`Select time token ${timeTokenList[value]}`}
							onclick={() => game.handleSelectTimeToken(value)}>{timeTokenList[value]}</button
						>{/if}{/each}
			</div>
			<button
				class="btn btn-primary"
				disabled={game.isDone || game.chosenTimeTokens.filter((v) => v !== null).length < 4}
				onclick={game.submitTimePlanning}>Submit Planning</button
			>{/if}
	</div>
	<div class="shop-grid">
		{#each shopList as name, index}<section
				class="shop"
				class:active-shop={game.phase === 2 && game.activeShop === index}
				class:waiting-shop={game.phase === 2 && game.activeShop !== index}
				aria-label={`${name} shop`}
			>
				<img
					class="shop-art"
					src={`/boardgame/shops/${shopArt[index]}.webp`}
					alt=""
					aria-hidden="true"
				/>
				<div class="shop-heading">
					<h3><span class="shop-number">{index + 1}</span>{name}</h3>
					<span class="shop-description"
						>{index === 0
							? 'Collect money'
							: index <= 3
								? '฿1 / flower'
								: index === 4
									? 'Draw an order'
									: 'Upgrade'}</span
					>
				</div>
				<div class="shop-goods">
					{#if index === 0}{#each game.shops[0] as coins, i}<button
								class="btn btn-primary"
								disabled={!game.canShop(index)}
								onclick={() => game.clickGoods(index, i)}
								aria-label={`Collect ${coins} money`}>฿{coins}</button
							>{:else}<span class="empty-copy">No money left</span>{/each}
					{:else if index <= 3}{#each game.shops[index as 1 | 2 | 3] as token, i}<FlowerToken
								{token}
								disabled={!game.canShop(index)}
								onclick={() => game.clickGoods(index, i)}
								label={`Buy ${['Pink', 'Blue', 'White'][index - 1]} flower, quality ${token.quality}`}
							/>{:else}<span class="empty-copy">No flowers left</span>{/each}
					{:else if index === 4}{#each game.shops[4] as card, i}<FlowerCard
								{card}
								repeated
								disabled={!game.canShop(index)}
								onclick={() => game.clickGoods(index, i)}
								label="Draw order"
							/>{:else}<span class="empty-copy">No orders left</span>{/each}
					{:else}{#each game.shops[5] as tool, i}{#if tool.level > 0}<button
									class="tool-card"
									disabled={!game.canShop(index)}
									onclick={() => game.clickGoods(index, i)}
									aria-label={`${toolNames[tool.type]}, ${tool.type === 4 ? 'First in ties' : tool.type === 3 ? 'Choose a flower' : '+' + tool.amount}, ฿${tool.cost}`}
									title={toolNames[tool.type]}
									><GameIcon name={toolIcons[tool.type]} /><strong>฿{tool.cost}</strong><small
										>{tool.type === 4 ? 'First' : tool.type === 3 ? '+1' : `+${tool.amount}`}</small
									></button
								>{/if}{/each}{/if}
				</div>
				{#if game.notice?.target === index}<div
						class="shop-feedback alert"
						class:alert-error={game.notice.severity === 'error'}
						class:text-error-content={game.notice.severity === 'error'}
						class:alert-info={game.notice.severity !== 'error'}
						class:text-info-content={game.notice.severity !== 'error'}
						role={game.notice.severity === 'error' ? 'alert' : 'status'}
					>
						{game.notice.message}
					</div>{/if}
				{#if game.phase === 1}<PlanningSlot {game} {index} {name} />{:else if game.phase === 2}<div
						class="shop-queue"
						aria-label={`${name} time token queue`}
					>
						{#each game.timeTokensByShop[index] || [] as token}<span
								class="queue-token"
								style:border-color={game.players[token.id]?.color}
								title={game.players[token.id]?.username}
								aria-label={`${game.players[token.id]?.username}: time token ${timeTokenList[token.value]}`}
								>{timeTokenList[token.value]}</span
							>{/each}
						<button
							class="btn btn-outline shop-pass"
							class:pass-hidden={game.activeShop !== index || !game.canPass}
							disabled={game.activeShop !== index || !game.canPass}
							aria-label="Pass / End Turn"
							onclick={game.passTurn}><GameIcon name="arrow" size={17} /><span>Pass</span></button
						>
					</div>{:else if game.phase !== 4}<div class="shop-queue">
						<button
							class="btn btn-outline shop-pass"
							class:pass-hidden={index !== 0 || !game.canPass}
							disabled={index !== 0 || !game.canPass}
							aria-label="Pass / End Turn"
							onclick={game.passTurn}><GameIcon name="arrow" size={17} /><span>Pass</span></button
						>
					</div>{/if}
			</section>{/each}
	</div>
</section>
