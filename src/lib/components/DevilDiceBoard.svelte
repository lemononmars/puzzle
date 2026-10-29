<script lang="ts">
	import { onMount } from 'svelte';
	import { at, type State, type Direction } from '#lib/games/devilDice.js';
	import type { createDiceScene } from '#lib/games/devilDiceScene.js';
	import type { Avatar } from '#lib/games/demonDiceAvatar.js';
	let {
		game,
		reducedMotion = false,
		paused = false,
		lost = false,
		won = false,
		avatar,
		opponent,
		blocked,
		controlsInset = 0,
		onMotionChange = (_moving: boolean) => {}
	}: {
		game: State;
		reducedMotion?: boolean;
		paused?: boolean;
		lost?: boolean;
		won?: boolean;
		avatar?: Avatar;
		opponent?: { position: State['player']; avatar: Avatar; name: string };
		blocked?: { direction: Direction; serial: number };
		controlsInset?: number;
		onMotionChange?: (moving: boolean) => void;
	} = $props();
	let host: HTMLDivElement;
	let failed = $state(false);
	let loaded = $state(false);
	let view: ReturnType<typeof createDiceScene> | undefined;
	const labels = { normal: 'Regular', wood: 'Wood', ice: 'Ice', stone: 'Stone', metal: 'Metal' };
	let ridden = $derived(game.player.riding ? at(game, game.player.x, game.player.y) : undefined);
	$effect(() => {
		if (blocked && view) view.bump(blocked.direction);
	});
	$effect(() => {
		const snapshot = game;
		const reduce = reducedMotion;
		const pause = paused;
		const losing = lost;
		const winning = won;
		const appearance = avatar;
		const rival = opponent;
		if (view) {
			view.setControlsInset(controlsInset);
			view.setReduced(reduce);
			view.setPaused(pause);
			view.setLost(losing);
			view.setWon(winning);
			view.setAvatar(appearance);
			view.setOpponent(rival);
			view.sync(snapshot);
		}
	});
	onMount(() => {
		let cancelled = false;
		import('#lib/games/devilDiceScene.js')
			.then(({ createDiceScene }) => {
				if (cancelled) return;
				try {
					view = createDiceScene(host, (moving) => onMotionChange(moving));
					view.setControlsInset(controlsInset);
					view.setReduced(reducedMotion);
					view.setPaused(paused);
					view.setLost(lost);
					view.setWon(won);
					view.setAvatar(avatar);
					view.setOpponent(opponent);
					view.sync(game, false);
					loaded = true;
				} catch (error) {
					console.error('Dice renderer:', error);
					failed = true;
					onMotionChange(false);
				}
			})
			.catch(() => {
				failed = true;
				onMotionChange(false);
			});
		return () => {
			cancelled = true;
			view?.dispose();
		};
	});
</script>

<div
	class="scene"
	style:--controls-inset={controlsInset + 'px'}
	bind:this={host}
	role="img"
	aria-label={`Puzzle board. Character at column ${game.player.x + 1}, row ${game.player.y + 1}, ${game.player.riding ? 'on a die' : 'on the ground'}. ${game.dice.map((d) => `${labels[d.kind]}: top ${d.top}, north ${d.north}, east ${d.east}, column ${d.x + 1}, row ${d.y + 1}`).join('. ')}. ${(game.trial?.warnings ?? []).map((w) => `Incoming die at column ${w.x + 1}, row ${w.y + 1}`).join('. ')}`}
	data-ready={loaded}
>
	<div class="preview-frame" aria-hidden="true">
		<span>Now</span>
	</div>
	{#if ridden}
		<span
			class="sr-only"
			role="img"
			aria-label={`Ridden die preview: top ${ridden.top}, north ${ridden.north}, east ${ridden.east}`}
		></span>{/if}
	{#if !loaded && !failed}<p class="loading botanical-muted">Setting the dice…</p>{/if}
	{#if failed}<div class="fallback">
			<p>3D graphics are unavailable in this browser. Board positions and faces:</p>
			<ul>
				{#each game.dice as d}<li>
						{labels[d.kind]} · ({d.x + 1}, {d.y + 1}) · top {d.top}, N {d.north}, E {d.east}
					</li>{/each}
			</ul>
		</div>{/if}
</div>

<style>
	.preview-frame {
		position: absolute;
		left: 8px;
		top: 8px;
		width: min(110px, 25%);
		aspect-ratio: 0.83;
		border: 1px solid var(--color-base-300);
		border-radius: 16px;
		pointer-events: none;
	}
	.preview-frame span {
		position: absolute;
		bottom: 4px;
		left: 0;
		right: 0;
		text-align: center;
		font-size: 10px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--color-base-content);
	}
	.scene {
		background:
			radial-gradient(
				ellipse at 25% 10%,
				color-mix(in srgb, var(--color-accent) 10%, transparent),
				transparent 55%
			),
			linear-gradient(
				155deg,
				var(--color-base-100),
				color-mix(in srgb, var(--color-primary) 13%, var(--color-base-100))
			);
		height: calc(440px + var(--controls-inset, 0px));
		width: 100%;
		position: relative;
		overflow: hidden;
		border-radius: 20px;
	}
	.scene :global(canvas) {
		display: block;
		width: 100%;
		height: 100%;
	}
	.loading {
		position: absolute;
		inset: 45% 0;
		text-align: center;
		font-size: 13px;
	}
	.fallback {
		padding: 20px;
		font-size: 13px;
	}
	@media (max-width: 540px) {
		.scene {
			height: calc(330px + var(--controls-inset, 0px));
		}
	}
</style>
