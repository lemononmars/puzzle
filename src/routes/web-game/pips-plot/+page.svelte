<script lang="ts">
	import DemonDieIcon from '#lib/components/DemonDieIcon.svelte';
	import PipMascot from '#lib/components/PipMascot.svelte';
	import { onMount } from 'svelte';
	import { createMovementAudio } from '#lib/games/devilDiceAudio.js';
	let smiling = $state(false);
	let ready = $state(false);
	let pipAudio: ReturnType<typeof createMovementAudio>;
	let smileTimer: ReturnType<typeof setTimeout>;
	function petPip() {
		pipAudio ??= createMovementAudio();
		pipAudio.unlock();
		pipAudio.play('pip');
		smiling = true;
		clearTimeout(smileTimer);
		smileTimer = setTimeout(() => (smiling = false), 1200);
	}
	onMount(() => {
		ready = true;
		return () => {
			clearTimeout(smileTimer);
			pipAudio?.dispose();
		};
	});
	import { roll } from '#lib/games/devilDice.js';
	const base = { top: 2, north: 1, east: 3 };
	const modes = [
		{
			id: 'tutorials',
			title: 'Tutorials',
			subtitle: 'Learn the garden’s little tricks',
			number: '01'
		},
		{
			id: 'puzzles',
			title: 'Puzzles',
			subtitle: 'Retro, Random, and garden challenges.',
			number: '02'
		},
		{ id: 'endless', title: 'Endless', subtitle: 'Keep rolling. Keep growing.', number: '03' },
		{
			id: 'battle',
			title: 'Battle',
			subtitle: 'Challenge a friend or Fern the bot.',
			number: '04'
		},
		{
			id: 'workshop',
			title: 'Workshop',
			subtitle: 'Build, test, and share your own little plot.',
			number: '05'
		}
	];
</script>

<svelte:head
	><title>Pip's Plot · Choose your mode</title><meta
		name="description"
		content="Pip's Plot: tutorials, puzzles and endless survival in a little dice garden. Inspired by Devil Dice."
	/></svelte:head
>
<section class="title-screen bg-base-100 text-base-content" aria-label="Pip's Plot game menu">
	<div class="garden-art">
		<div class="garden-bed"></div>
		<div class="menu-die one"><DemonDieIcon orientation={base} /></div>
		<div class="menu-die two"><DemonDieIcon kind="wood" orientation={roll(base, 'left')} /></div>
		<div class="menu-die three"><DemonDieIcon kind="ice" orientation={roll(base, 'up')} /></div>
		<button class="sprout pip-button" aria-label="Make Pip smile" disabled={!ready} onclick={petPip}
			><PipMascot {smiling} /></button
		>
		<span class="flower f1">✿</span><span class="flower f2">✿</span><span class="flower f3">✿</span>
	</div>
	<div class="title-menu">
		<p class="edition botanical-muted">THE DICE GARDEN</p>
		<h1><span class="game-logo">Pip's <span>Plot</span></span></h1>
		<nav aria-label="Choose game mode">
			{#each modes as mode}<a class="mode-button" href={`/web-game/pips-plot/${mode.id}`}
					><svg
						class="mode-icon"
						width="26"
						height="26"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.6"
						aria-hidden="true"
						>{#if mode.id === 'tutorials'}<path
								d="M12 20V10M12 14C4 14 3 9 3 5c7 0 9 4 9 9Zm0-4c0-6 4-8 9-8 0 6-3 10-9 10"
							/>{:else if mode.id === 'puzzles' || mode.id === 'random'}<rect
								x="3"
								y="3"
								width="18"
								height="18"
								rx="4"
							/><path d="M9 3v18M3 9h18M15 9v12M9 15h12" />{:else if mode.id === 'endless'}<path
								d="M12 12C6 3 2 7 2 12s4 9 10 0 10-5 10 0-4 9-10 0Z"
							/>{:else if mode.id === 'retro'}<rect
								x="3"
								y="4"
								width="18"
								height="14"
								rx="3"
							/><path
								d="M8 21h8M9 18v3m6-3v3M7 9h4m-2-2v4m7-3h.01M18 11h.01"
							/>{:else if mode.id === 'workshop'}<path
								d="m4 20 9-9m-2-5 7 7m-7-7 4-4 7 7-4 4M3 21l4-1-3-3-1 4Z"
							/>{:else}<path
								d="m4 3 17 17m-1-4-4 4M20 3 3 20m1-4 4 4M4 3l4 1-4 4V3Zm16 0-4 1 4 4V3Z"
							/>{/if}</svg
					><span><strong>{mode.title}</strong><small>{mode.subtitle}</small></span></a
				>{/each}
		</nav>
		<p class="inspiration botanical-muted">
			Inspired by <a
				class="link"
				href="https://giantbomb.com/wiki/Games/Devil_Dice"
				target="_blank"
				rel="noreferrer">Devil Dice</a
			>
		</p>
	</div>
</section>

<style>
	.pip-button :global(svg) {
		animation: pip-bob 4s ease-in-out infinite;
	}
	@media (prefers-reduced-motion: reduce) {
		.pip-button :global(svg) {
			animation: none;
		}
	}
	.pip-button {
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
		border-radius: 40%;
		color: var(--color-base-content);
	}
	.pip-button:focus-visible {
		outline: 3px solid var(--color-primary);
		outline-offset: 4px;
	}
	.mode-icon {
		flex: none;
		color: var(--color-primary);
	}
	.garden-art .sprout {
		width: 100px;
		height: 112px;
		left: 40%;
		top: 40%;
		font-size: initial;
		z-index: 2;
		animation: none;
	}
	.menu-die {
		animation: die-float 5s ease-in-out infinite;
		--tilt: 0deg;
	}
	.menu-die.one {
		--tilt: -8deg;
	}
	.menu-die.two {
		--tilt: -7deg;
		animation-delay: -1.7s;
	}
	.menu-die.three {
		--tilt: 9deg;
		animation-delay: -3.3s;
	}
	.flower {
		animation: flower-sway 6s ease-in-out infinite;
	}
	.flower.f2 {
		animation-delay: -2s;
	}
	.flower.f3 {
		animation-delay: -4s;
	}
	.title-menu {
		animation: menu-in 0.65s cubic-bezier(0.2, 0.7, 0.3, 1) both;
	}
	.garden-bed {
		animation: bed-in 0.8s ease-out both;
	}
	@keyframes die-float {
		0%,
		100% {
			transform: translateY(0) rotate(var(--tilt));
		}
		50% {
			transform: translateY(-10px) rotate(calc(var(--tilt) + 4deg));
		}
	}
	@keyframes pip-bob {
		50% {
			transform: translateY(-5px) rotate(-3deg);
		}
	}
	@keyframes flower-sway {
		50% {
			transform: rotate(12deg);
		}
	}
	@keyframes menu-in {
		from {
			opacity: 0;
			translate: 0 12px;
		}
		to {
			opacity: 1;
			translate: 0 0;
		}
	}
	@keyframes bed-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@media (max-width: 650px) {
		.garden-art .sprout {
			width: 65px;
			height: 75px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.menu-die,
		.garden-art .sprout,
		.flower,
		.title-menu,
		.garden-bed {
			animation: none;
		}
	}
	.game-logo {
		font-size: clamp(42px, 6vw, 70px);
		line-height: 1.05;
		display: inline-block;
	}
	.title-menu h1 .game-logo {
		color: var(--color-primary);
	}
	.title-menu h1 .game-logo span {
		color: var(--color-base-content);
	}
	.title-screen {
		position: relative;
		isolation: isolate;
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		min-height: 610px;
		max-width: 1080px;
		margin: 0 auto;
		border: 1px solid var(--color-base-300);
		border-radius: 32px;
		overflow: hidden;
		background: radial-gradient(
			ellipse at 15% 60%,
			color-mix(in srgb, var(--color-primary) 19%, var(--color-base-100)),
			var(--color-base-100) 65%
		);
	}
	.title-menu {
		padding: 40px 44px 32px 12px;
		position: relative;
	}
	.edition {
		font-size: 10px;
		letter-spacing: 0.25em;
		margin-bottom: 12px;
	}
	.title-menu h1 {
		font-size: clamp(42px, 6vw, 70px);
		font-weight: 600;
		letter-spacing: -0.06em;
		line-height: 1;
		margin: 0 0 32px;
		color: var(--color-primary);
	}
	.title-menu h1 span {
		color: var(--color-base-content);
	}
	nav {
		display: grid;
		gap: 8px;
	}
	.mode-button {
		display: flex;
		align-items: center;
		gap: 16px;
		width: 100%;
		text-align: left;
		padding: 15px 18px;
		border: 1px solid var(--color-base-300);
		border-radius: 16px;
		background: var(--color-base-100);
		color: var(--color-base-content);
		text-decoration: none;
		transition:
			background 0.18s,
			transform 0.18s;
	}
	.mode-button:hover:not(:disabled) {
		background: var(--color-base-200);
		transform: translateX(4px);
	}
	.mode-button:focus-visible {
		outline: 3px solid var(--color-primary);
		outline-offset: 3px;
	}
	.mode-button > span:nth-child(2) {
		flex: 1;
	}
	.mode-button strong {
		display: block;
		font-size: 19px;
		font-weight: 500;
	}
	.mode-button small {
		display: block;
		font-size: 11px;
		opacity: 0.65;
		margin-top: 3px;
	}
	.mode-button:disabled {
		opacity: 0.45;
	}
	.inspiration {
		font-size: 11px;
		margin-top: 22px;
		text-align: center;
	}
	.garden-art {
		position: relative;
		height: 430px;
		margin: 0 10px;
	}
	.garden-bed {
		position: absolute;
		width: 78%;
		height: 57%;
		background: var(--color-base-200);
		border: 12px solid color-mix(in srgb, var(--color-primary) 40%, var(--color-base-200));
		transform: rotate(-25deg) skew(12deg);
		left: 12%;
		top: 28%;
		border-radius: 32px;
		background-image:
			linear-gradient(90deg, transparent 96%, var(--color-base-300) 96%),
			linear-gradient(transparent 96%, var(--color-base-300) 96%);
		background-size: 52px 52px;
	}
	.menu-die {
		position: absolute;
		width: 125px;
		height: 140px;
	}
	.one {
		left: 36%;
		top: 14%;
		transform: rotate(-8deg);
	}
	.two {
		left: 12%;
		top: 44%;
		transform: rotate(-7deg);
	}
	.three {
		left: 56%;
		top: 43%;
		transform: rotate(9deg);
	}
	.sprout {
		position: absolute;
		left: 47%;
		top: 42%;
		font-size: 90px;
		line-height: 1;
		color: var(--color-primary);
	}
	.flower {
		position: absolute;
		font-size: 45px;
		color: var(--color-secondary);
	}
	.f1 {
		left: 12%;
		top: 25%;
	}
	.f2 {
		left: 78%;
		top: 65%;
		font-size: 32px;
	}
	.f3 {
		left: 34%;
		top: 75%;
		font-size: 28px;
	}
	@media (max-width: 650px) {
		.title-screen {
			grid-template-columns: 1fr;
			min-height: auto;
		}
		.garden-art {
			height: 220px;
			width: 290px;
			margin: 0 auto -20px;
		}
		.garden-bed {
			border-width: 8px;
		}
		.menu-die {
			width: 75px;
			height: 85px;
		}
		.sprout {
			font-size: 52px;
		}
		.flower {
			font-size: 28px;
		}
		.title-menu {
			padding: 24px;
		}
		.edition {
			text-align: center;
		}
		.title-menu h1 {
			text-align: center;
			margin-bottom: 24px;
		}
		.mode-button {
			padding: 12px 16px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.mode-button {
			transition: none;
		}
		.mode-button:hover:not(:disabled) {
			transform: none;
		}
	}
</style>
