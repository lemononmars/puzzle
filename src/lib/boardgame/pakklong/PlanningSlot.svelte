<script lang="ts">
	import type { PakklongGame } from './types';
	import { shopList, timeTokenList } from './constants';
	export let game: PakklongGame;
	export let index: number;
	export let name: string;
	let menu: HTMLDivElement;
	let trigger: HTMLButtonElement;
	let opened = false;
	function openMenu() {
		menu.showPopover();
		menu.style.maxHeight = `${Math.max(180, innerHeight - (document.querySelector('.game-status-bar')?.getBoundingClientRect().bottom || 0) - 24)}px`;
		const anchor = trigger.getBoundingClientRect();
		const box = menu.getBoundingClientRect();
		const statusBottom =
			document.querySelector('.game-status-bar')?.getBoundingClientRect().bottom || 0;
		menu.style.left = `${Math.max(12, Math.min(anchor.left, innerWidth - box.width - 12))}px`;
		menu.style.top = `${Math.max(statusBottom + 8, anchor.bottom + box.height + 20 < innerHeight ? anchor.bottom + 8 : anchor.top - box.height - 8)}px`;
		menu.querySelector('button')?.focus();
	}
	function chooseShop() {
		if (game.selectedTimeToken !== null) game.assignTimeToken(index);
		else openMenu();
	}
	function choose(token: number) {
		game.assignTimeToken(index, token);
		menu.hidePopover();
		trigger.focus();
	}
</script>

<div class="planning-slot">
	<button
		bind:this={trigger}
		class="btn planning-token"
		class:needs-token={game.chosenTimeTokens[index] === null && !game.isDone}
		class:btn-secondary={game.chosenTimeTokens[index] !== null}
		class:btn-outline={game.chosenTimeTokens[index] === null}
		disabled={game.isDone}
		onclick={chooseShop}
		aria-label={game.chosenTimeTokens[index] === null
			? `Place selected token at ${name}`
			: `Change time token at ${name}`}
		aria-haspopup="dialog"
		aria-controls={`planning-picker-${index}`}
		aria-expanded={opened}
		>{game.chosenTimeTokens[index] !== null
			? timeTokenList[game.chosenTimeTokens[index]!]
			: '+'}</button
	>
	{#if game.chosenTimeTokens[index] !== null && !game.isDone}<button
			class="remove-token"
			onclick={() => game.handleRemoveTimeToken(index)}
			aria-label={`Remove time token from ${name}`}>×</button
		>{/if}
	<div
		bind:this={menu}
		id={`planning-picker-${index}`}
		class="planning-picker"
		ontoggle={(event) => (opened = event.newState === 'open')}
		onkeydown={(event) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				menu.hidePopover();
				trigger.focus();
			}
		}}
		popover="auto"
		tabindex="-1"
		role="dialog"
		aria-label={`Time tokens for ${name}`}
	>
		<div class="picker-tokens">
			{#each game.getMyTimeTokens(game.me!) as value}{@const owner =
					game.chosenTimeTokens.indexOf(value)}<button
					class="btn"
					class:btn-primary={owner === index}
					onclick={() => choose(value)}
					aria-label={`Use time token ${timeTokenList[value]} for ${name}${owner !== -1 && owner !== index ? `, swap with ${shopList[owner]}` : ''}`}
					>{timeTokenList[value]}</button
				>{/each}
		</div>
	</div>
</div>
