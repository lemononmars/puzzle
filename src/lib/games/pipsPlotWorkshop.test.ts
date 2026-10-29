import { describe, it, expect } from 'vitest';
import {
	readWorkshopPuzzle,
	editWorkshopAxis,
	rotateWorkshopDie,
	encodeWorkshopPuzzle,
	decodeWorkshopPuzzle,
	workshopChallenge,
	workshopState,
	type WorkshopPuzzle
} from './pipsPlotWorkshop.js';
import { makeDie } from './devilDiceTutorials.js';
import { move, isClear } from './devilDice.js';
const example = (): WorkshopPuzzle => ({
	format: 'pips-plot-puzzle',
	version: 1,
	title: 'Pip’s สวน 🌱',
	hint: 'Push the pair.',
	maxMoves: 5,
	field: {
		width: 5,
		height: 4,
		player: { x: 0, y: 2, riding: false },
		dice: [makeDie(1, 2, 2), makeDie(2, 4, 2)],
		removedTiles: [{ x: 0, y: 0 }]
	}
});
describe('Pip’s Plot workshop files and portable links', () => {
	it('rotates all three axes independently and returns after four quarter turns', () => {
		const start = { top: 2, north: 1, east: 3 };
		expect(rotateWorkshopDie(start, 'y')).toEqual({ top: 2, north: 4, east: 1 });
		for (const axis of ['x', 'y', 'z'] as const) {
			let faces = start;
			for (let i = 0; i < 4; i++) faces = rotateWorkshopDie(faces, axis);
			expect(faces).toEqual(start);
		}
		const queue = [start],
			seen = new Set<string>();
		while (queue.length) {
			const f = queue.shift()!;
			const key = JSON.stringify(f);
			if (seen.has(key)) continue;
			seen.add(key);
			for (const axis of ['x', 'y', 'z'] as const) queue.push(rotateWorkshopDie(f, axis));
		}
		expect(seen.size).toBe(24);
	});
	it('inserts and removes specific rows and columns while shifting dice, holes and Pip', () => {
		const p = example();
		const inserted = editWorkshopAxis(p.field, 'x', 1, true);
		expect(inserted.width).toBe(6);
		expect(inserted.dice.map((d) => d.x)).toEqual([3, 5]);
		expect(inserted.player).toEqual(p.field.player);
		expect(editWorkshopAxis(inserted, 'x', 1, false)).toEqual(p.field);
		const row = editWorkshopAxis(p.field, 'y', 1, true);
		expect(row.player.y).toBe(3);
		expect(row.dice.every((d) => d.y === 3)).toBe(true);
		expect(editWorkshopAxis(row, 'y', 1, false)).toEqual(p.field);
	});
	it('keeps Pip supported when removing a row through objects and respects size limits', () => {
		const p = example();
		const removed = editWorkshopAxis(p.field, 'y', 2, false);
		expect(removed.dice).toHaveLength(0);
		expect(removed.player.y).toBeGreaterThanOrEqual(0);
		expect(removed.player.y).toBeLessThan(removed.height);
		expect(
			removed.removedTiles?.some((t) => t.x === removed.player.x && t.y === removed.player.y)
		).toBe(false);
		const small = { ...p.field, width: 2 };
		expect(editWorkshopAxis(small, 'x', 0, false).width).toBe(2);
		expect(() => editWorkshopAxis(p.field, 'x', -1, true)).toThrow();
	});
	it('round trips unicode names, all materials, holes and faces through a standalone link', () => {
		const p = example();
		p.field.dice = ['normal', 'wood', 'ice', 'stone', 'metal'].map((kind, i) =>
			makeDie(i + 1, i, 1, 3, kind as 'normal', 5, 1)
		);
		expect(decodeWorkshopPuzzle(encodeWorkshopPuzzle(p))).toEqual(readWorkshopPuzzle(p));
	});
	it('rebuilds clean state and plays the same rules as campaign puzzles', () => {
		const p = readWorkshopPuzzle(example());
		const game = workshopState(p);
		const walked = move(game, 'right', false, 0)!;
		const matched = move(walked, 'right', false, 500)!;
		expect(isClear(matched)).toBe(true);
		expect(matched.moves).toBe(1);
		expect(workshopState(p).moves).toBe(0);
		expect(workshopChallenge(p).hint).toBe('Push the pair.');
	});
	it('rejects overlapping dice, holes, invalid orientations, unsupported versions and invalid Pip positions', () => {
		for (const change of [
			(p: WorkshopPuzzle) => {
				p.field.dice[1] = { ...p.field.dice[0] };
			},
			(p: WorkshopPuzzle) => {
				p.field.removedTiles = [{ x: 2, y: 2 }];
			},
			(p: WorkshopPuzzle) => {
				p.field.dice[0].east = 5;
			},
			(p: WorkshopPuzzle) => {
				p.field.player = { x: 2, y: 2, riding: false };
			},
			(p: WorkshopPuzzle) => {
				p.field.width = 50;
			},
			(p: WorkshopPuzzle) => {
				p.maxMoves = 0;
			},
			(p: WorkshopPuzzle) => {
				p.field.dice = [];
			}
		]) {
			const p = example();
			change(p);
			expect(() => readWorkshopPuzzle(p)).toThrow();
		}
		expect(() => readWorkshopPuzzle({ ...example(), version: 2 })).toThrow();
		expect(() => decodeWorkshopPuzzle('!not-a-puzzle')).toThrow();
		expect(() => decodeWorkshopPuzzle('a'.repeat(24001))).toThrow();
	});
	it('discards gameplay timers and extra fields from imported JSON', () => {
		const p = example();
		Object.assign(p.field.dice[0], { sinking: 123, slide: { steps: 99 } });
		const clean = readWorkshopPuzzle(p);
		expect(clean.field.dice[0].sinking).toBeUndefined();
		expect(clean.field.dice[0].slide).toBeUndefined();
	});
});
