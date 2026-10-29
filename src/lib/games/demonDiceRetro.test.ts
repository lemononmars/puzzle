import { describe, expect, it } from 'vitest';
import { retroPuzzles, startRetro } from './demonDiceRetro.js';
import { heldMove, inside, isClear, move, roll, settle } from './devilDice.js';
import type { Direction } from './devilDice.js';

describe('Devil Dice Retro reconstruction', () => {
	it('contains all 100 numbered boards with supported starts and physical dice', () => {
		expect(retroPuzzles).toHaveLength(100);
		const orientations = new Set<string>();
		const queue = [{ top: 1, north: 5, east: 3 }];
		while (queue.length) {
			const faces = queue.pop()!;
			const key = JSON.stringify(faces);
			if (orientations.has(key)) continue;
			orientations.add(key);
			for (const direction of ['up', 'down', 'left', 'right'] as Direction[])
				queue.push(roll(faces, direction));
		}
		for (let i = 0; i < 100; i++) {
			const entry = retroPuzzles[i];
			expect(entry.id).toBe(`R${String(i + 1).padStart(3, '0')}`);
			expect(entry.maxMoves).toBeGreaterThan(0);
			const state = startRetro(i);
			expect(inside(state, state.player.x, state.player.y)).toBe(true);
			const squares = new Set<string>();
			for (const die of state.dice) {
				expect(inside(state, die.x, die.y)).toBe(true);
				const square = `${die.x},${die.y}`;
				expect(squares.has(square)).toBe(false);
				squares.add(square);
				expect(
					orientations.has(JSON.stringify({ top: die.top, north: die.north, east: die.east }))
				).toBe(true);
			}
			expect(squares.has(`${state.player.x},${state.player.y}`)).toBe(state.player.riding);
		}
	});

	it.each([
		[1, 'LDRU'],
		[2, 'DL'],
		[3, 'DLU'],
		[4, 'DLULDR'],
		[5, 'RR'],
		[6, 'DRURDL'],
		[7, 'UULLDDR'],
		[8, 'RRDU'],
		[9, 'URRRUL'],
		[10, 'URRRUL'],
		// The recording's final push is left; the old written guide incorrectly says up.
		[96, 'DDRRUUUDLLLLLUUURRDDDRRRRUUUULRDDL']
	] as const)('replays the observed opening solution for stage %i', (number, path) => {
		const directions: Record<string, Direction> = { U: 'up', D: 'down', L: 'left', R: 'right' };
		const index = retroPuzzles.findIndex((entry) => entry.sourceStage === number);
		let state = startRetro(index);
		let now = 100;
		for (const direction of path) {
			state = settle(state, now);
			const vectors: Record<string, [number, number]> = {
				U: [0, -1],
				D: [0, 1],
				L: [-1, 0],
				R: [1, 0]
			};
			const [dx, dy] = vectors[direction];
			const target = state.dice.find(
				(d) => d.x === state.player.x + dx && d.y === state.player.y + dy
			);
			if (!state.player.riding && target?.kind === 'ice' && state.dice.some((d) => d.slide)) {
				now = Math.max(
					now,
					...state.dice.filter((d) => d.slide).map((d) => d.slide!.started + d.slide!.duration)
				);
				state = settle(state, now);
			}
			let next =
				move(state, directions[direction], false, now) ??
				heldMove(state, directions[direction], 200, now);
			if (!next) {
				// Wait for a matched target to become low enough to roll over.
				now += 1250;
				state = settle(state, now);
				next = heldMove(state, directions[direction], 200, now);
			}
			expect(next, `Stage ${number}, ${direction} at ${now}`).not.toBeNull();
			state = next!;
			now += number === 96 ? 140 : 280;
		}
		state = settle(
			state,
			Math.max(
				now,
				...state.dice.filter((d) => d.slide).map((d) => d.slide!.started + d.slide!.duration)
			)
		);
		expect(isClear(state)).toBe(true);
		expect(state.moves).toBeLessThanOrEqual(retroPuzzles[index].maxMoves);
	});
	it('starts independent copies so replay cannot mutate the level catalogue', () => {
		const first = startRetro(0);
		first.dice[0].top = 6;
		expect(startRetro(0).dice[0].top).toBe(1);
	});
});
