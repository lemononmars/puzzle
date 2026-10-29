<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	let {
		level,
		entries,
		completed,
		best,
		onplay
	}: {
		level: number;
		entries: { id: string }[];
		completed: string[];
		best: Record<string, number>;
		onplay: (index: number) => void;
	} = $props();
	let digits = $state(untrack(() => entries[level].id.split('').map((c) => c.charCodeAt(0) - 65)));
	let directions = $state([1, 1, 1]);
	let reduced = $state(true);
	const letters = 'ABCDEFGHIJ';
	const code = $derived(digits.map((d) => letters[d]).join(''));
	const selected = $derived(entries.findIndex((entry) => entry.id === code));
	const done = $derived(completed.includes(code));
	const stars = $derived(best[code] === undefined ? 0 : best[code] <= 15 ? 2 : 1);
	function turn(index: number, amount: number) {
		directions[index] = Math.sign(amount);
		digits[index] = (digits[index] + amount + 10) % 10;
	}
	function key(event: KeyboardEvent, index: number) {
		const letter = event.key.toUpperCase();
		if (/^[A-J]$/.test(letter)) {
			event.preventDefault();
			directions[index] = letters.indexOf(letter) >= digits[index] ? 1 : -1;
			digits[index] = letters.indexOf(letter);
		} else if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
			event.preventDefault();
			if (event.key === 'Home' || event.key === 'End') digits[index] = event.key === 'Home' ? 0 : 9;
			else turn(index, event.key === 'ArrowUp' ? 1 : -1);
		} else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
			event.preventDefault();
			const wheels =
				event.currentTarget instanceof HTMLElement
					? event.currentTarget
							.closest('.wheels')
							?.querySelectorAll<HTMLElement>('[role="spinbutton"]')
					: undefined;
			wheels?.[(index + (event.key === 'ArrowRight' ? 1 : 2)) % 3].focus();
		} else if (event.key === 'Enter' && selected >= 0) {
			event.preventDefault();
			onplay(selected);
		}
	}
	function surprise() {
		const id = entries[Math.floor(Math.random() * entries.length)].id;
		directions = [1, 1, 1];
		digits = id.split('').map((c) => c.charCodeAt(0) - 65);
	}
	onMount(() => {
		const preference = matchMedia('(prefers-reduced-motion: reduce)');
		const update = () => {
			reduced = preference.matches;
		};
		update();
		preference.addEventListener('change', update);
		return () => preference.removeEventListener('change', update);
	});
</script>

<div class="combination-lock">
	<div class="shackle" aria-hidden="true"></div>
	<div class="lock-body bg-base-200 text-base-content">
		<p class="lock-label">RANDOM GARDEN</p>
		<div class="wheels" aria-label="Level combination">
			{#each digits as digit, i}
				<div class="wheel-column">
					<button
						class="btn btn-ghost btn-circle"
						aria-label={`Increase letter ${i + 1}`}
						onclick={() => turn(i, 1)}
						><svg
							viewBox="0 0 24 24"
							width="22"
							height="22"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							aria-hidden="true"><path d="m6 15 6-6 6 6" /></svg
						></button
					>
					<div
						class="wheel"
						role="spinbutton"
						tabindex="0"
						aria-label={`Letter ${i + 1}`}
						aria-valuemin="0"
						aria-valuemax="9"
						aria-valuenow={digit}
						aria-valuetext={letters[digit]}
						onkeydown={(event) => key(event, i)}
					>
						<span class="neighbor" aria-hidden="true">{letters[(digit + 9) % 10]}</span>
						<div class="letter-window" aria-hidden="true">
							{#key digit}<strong
									in:fly={{ y: directions[i] * 16, duration: reduced ? 0 : 150, easing: cubicOut }}
									>{letters[digit]}</strong
								>{/key}
						</div>
						<span class="neighbor" aria-hidden="true">{letters[(digit + 1) % 10]}</span>
					</div>
					<button
						class="btn btn-ghost btn-circle"
						aria-label={`Decrease letter ${i + 1}`}
						onclick={() => turn(i, -1)}
						><svg
							viewBox="0 0 24 24"
							width="22"
							height="22"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg
						></button
					>
				</div>
			{/each}
		</div>
		<div class="combination-status" aria-live="polite" aria-atomic="true">
			<strong>{code}</strong><span class="lock-status" class:finished={done}
				>{done
					? stars === 2
						? '★★ Completed'
						: stars === 1
							? '★ Completed'
							: 'Completed'
					: 'Unplayed'}</span
			>
		</div>
	</div>
	<div class="lock-actions">
		<button class="btn btn-ghost" onclick={surprise}>Surprise me</button><button
			class="btn btn-primary"
			disabled={selected < 0}
			onclick={() => onplay(selected)}>Play {code}</button
		>
	</div>
	<p class="keyboard-tip botanical-muted">↑ ↓ turn · ← → switch · A–J type</p>
	<p class="completion-count botanical-muted">
		{completed.length} / {entries.length.toLocaleString('en-US')} completed
	</p>
</div>

<style>
	.combination-lock {
		max-width: 370px;
		margin: 0 auto;
		padding-top: 4px;
	}
	.shackle {
		width: 148px;
		height: 82px;
		border: 15px solid var(--color-primary);
		border-bottom: 0;
		border-radius: 80px 80px 0 0;
		margin: 0 auto -5px;
		opacity: 0.7;
	}
	.lock-body {
		position: relative;
		border: 2px solid var(--color-primary);
		border-radius: 30px;
		padding: 22px 20px 18px;
	}
	.lock-label {
		text-align: center;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.22em;
		color: var(--color-primary);
	}
	.wheels {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px;
		margin: 10px 0 18px;
	}
	.wheel-column {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		min-width: 0;
	}
	.wheel {
		width: 100%;
		border-radius: 16px;
		border: 2px solid var(--color-base-300);
		background: var(--color-base-100);
		color: var(--color-base-content);
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 7px 0;
		cursor: default;
	}
	.wheel:focus-visible {
		outline: 3px solid var(--color-primary);
		outline-offset: 3px;
	}
	.neighbor {
		opacity: 0.28;
		font-size: 19px;
		line-height: 26px;
		font-weight: 700;
	}
	.letter-window {
		width: 100%;
		height: 64px;
		display: grid;
		place-items: center;
		overflow: hidden;
		border-block: 1px solid var(--color-base-300);
		background: color-mix(in srgb, var(--color-primary) 8%, var(--color-base-100));
	}
	.letter-window strong {
		display: block;
		font-size: 48px;
		line-height: 1;
		color: var(--color-primary);
		font-weight: 800;
	}
	.combination-status {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		min-height: 26px;
	}
	.combination-status > strong {
		letter-spacing: 0.15em;
		font-size: 18px;
	}
	.lock-status {
		font-size: 12px;
		opacity: 0.65;
	}
	.lock-status.finished {
		color: var(--color-primary);
		opacity: 1;
	}
	.lock-actions {
		display: flex;
		justify-content: center;
		gap: 12px;
		margin-top: 22px;
	}
	.keyboard-tip,
	.completion-count {
		text-align: center;
		font-size: 11px;
		margin-top: 16px;
	}
	.completion-count {
		margin-top: 8px;
	}
	@media (max-width: 380px) {
		.lock-body {
			padding-inline: 12px;
		}
		.wheels {
			gap: 8px;
		}
		.letter-window strong {
			font-size: 40px;
		}
	}
</style>

