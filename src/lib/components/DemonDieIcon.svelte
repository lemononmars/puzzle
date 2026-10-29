<script lang="ts">
	import { dieColors } from '#lib/games/devilDiceVisuals.js';
	import type { Kind, Faces } from '#lib/games/devilDice.js';
	let {
		kind = 'normal',
		label = 'Die',
		orientation = { top: 2, north: 1, east: 3 }
	}: { kind?: Kind | 'mixed'; label?: string; orientation?: Faces } = $props();
	const dots: Record<number, number[][]> = {
		1: [[0, 0]],
		2: [
			[-1, -1],
			[1, 1]
		],
		3: [
			[-1, -1],
			[0, 0],
			[1, 1]
		],
		4: [
			[-1, -1],
			[1, -1],
			[-1, 1],
			[1, 1]
		],
		5: [
			[-1, -1],
			[1, -1],
			[0, 0],
			[-1, 1],
			[1, 1]
		],
		6: [
			[-1, -1],
			[1, -1],
			[-1, 0],
			[1, 0],
			[-1, 1],
			[1, 1]
		]
	};
	let faces = $derived([
		{
			n: orientation.top,
			transform: 'matrix(1 .56 -1 .56 50 28)',
			points: '50,4 94,28 50,53 6,28',
			type: kind === 'mixed' ? 'ice' : kind
		},
		{
			n: 7 - orientation.north,
			transform: 'matrix(1 .56 0 1.12 28 66)',
			points: '6,28 50,53 50,104 6,79',
			type: kind === 'mixed' ? 'wood' : kind
		},
		{
			n: orientation.east,
			transform: 'matrix(1 -.56 0 1.12 72 66)',
			points: '50,53 94,28 94,79 50,104',
			type: kind === 'mixed' ? 'normal' : kind
		}
	]);
</script>

<svg
	viewBox="0 0 100 110"
	role="img"
	aria-label={label}
	data-faces={`${orientation.top},${7 - orientation.north},${orientation.east}`}
>
	{#each faces as face}{@const palette = dieColors(face.type as Kind, face.n)}<polygon
			points={face.points}
			fill={palette.surface}
		/><g transform={face.transform} fill={palette.pip}
			>{#each dots[face.n] as [x, y]}<circle cx={x * 13} cy={y * 13} r="4.6" />{/each}</g
		>{/each}
	<path d="M6 28 50 53 94 28M50 53v51" fill="none" stroke="currentColor" opacity=".2" />
	{#if kind === 'wood' || kind === 'mixed'}<path
			d="m10 37 5 3m-5 18 31 18m-21 5 21 12M58 8l28 15"
			fill="none"
			stroke="currentColor"
			opacity=".2"
		/>{/if}
	{#if kind === 'ice'}<path
			d="m15 30 29 17M56 60l30-17"
			fill="none"
			stroke="white"
			stroke-width="3"
			opacity=".65"
		/>{/if}
</svg>

<style>
	svg {
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
	}
</style>
