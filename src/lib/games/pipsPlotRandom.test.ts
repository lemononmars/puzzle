import { expect, it } from 'vitest';
import { randomPuzzles, startRandom } from './pipsPlotRandom.js';
import { isClear, move, roll, type Direction } from './devilDice.js';

it('certifies every AAA–JJJ board clears all six sixes within 15 dice moves', () => {
	expect(randomPuzzles).toHaveLength(1000);
	const unique = new Set<string>();
	const faces = new Set<string>();
	const queue = [{ top: 1, north: 5, east: 3 }];
	while (queue.length) {
		const f = queue.pop()!;
		const key = JSON.stringify(f);
		if (faces.has(key)) continue;
		faces.add(key);
		for (const d of ['up', 'down', 'left', 'right'] as Direction[]) queue.push(roll(f, d));
	}
	for (const [i, entry] of randomPuzzles.entries()) {
		const id = [Math.floor(i / 100), Math.floor(i / 10) % 10, i % 10]
			.map((n) => String.fromCharCode(65 + n))
			.join('');
		expect(entry.id).toBe(id);
		let state = startRandom(i);
		expect([state.width, state.height, state.dice.length]).toEqual([4, 4, 6]);
		expect(new Set(state.dice.map((d) => `${d.x},${d.y}`)).size).toBe(6);
		for (const d of state.dice) {
			expect(d.kind).toBe('normal');
			expect(d.x >= 0 && d.x < 4 && d.y >= 0 && d.y < 4).toBe(true);
			expect(faces.has(JSON.stringify({ top: d.top, north: d.north, east: d.east }))).toBe(true);
		}
		const signature = JSON.stringify([
			state.player,
			state.dice.map((d) => [d.x, d.y, d.top, d.north, d.east]).sort()
		]);
		expect(unique.has(signature)).toBe(false);
		unique.add(signature);
		for (const [step, direction] of entry.solution.entries()) {
			expect(typeof direction).toBe('string');
			const next = move(state, direction as Direction, false, 100 + step * 400);
			expect(next, `${id} step ${step}`).not.toBeNull();
			state = next!;
			if (step < entry.solution.length - 1)
				expect(
					state.dice.every((d) => d.sinking === undefined),
					`${id} premature match`
				).toBe(true);
		}
		expect(isClear(state), id).toBe(true);
		expect(state.dice).toHaveLength(6);
		expect(
			state.dice.every((d) => d.top === 6 && d.sinking !== undefined),
			id
		).toBe(true);
		expect(state.moves, id).toBeLessThanOrEqual(15);
	}
});
