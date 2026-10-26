import { describe, it, expect } from 'vitest';
import {
	startTrial,
	tickTrial,
	queueSpawn,
	move,
	shiftTime,
	scoreForLevel,
	levelForScore,
	spawnInterval,
	SPAWN_WARNING_MS,
	SPAWN_RISE_MS,
	ENDLESS_SINK_MS,
	EDGE_HOLD_MS
} from './devilDice.js';
import { accelerateSpawns } from './devilDice.js';
import { makeDie } from './devilDiceTutorials.js';
import { inputCooldown, movementDuration } from './devilDiceVisuals.js';
import { challengePuzzles, startChallenge } from './demonDiceChallenges.js';
import { settle, heldMove, EDGE_HOLD_MS as HOLD } from './devilDice.js';
import { match } from './devilDice.js';

describe('Demon Dice Endless', () => {
	it('accelerates warnings and rising dice without speeding up sinking or elapsed time', () => {
		const state = queueSpawn(startTrial(0), 0, () => 0);
		state.dice[0].rising = 4000;
		state.dice[1].sinking = 6500;
		const faster = accelerateSpawns(state, 1200);
		expect(faster.trial!.nextSpawn).toBe(state.trial!.nextSpawn - 1200);
		expect(faster.trial!.warnings[0].appearsAt).toBe(1800);
		expect(faster.dice[0].rising).toBe(2800);
		expect(faster.dice[1].sinking).toBe(6500);
		expect(faster.trial!.started).toBe(0);
		expect(state.dice[0].rising).toBe(4000);
	});
	it('randomizes the player start while keeping them aboard an existing movable die', () => {
		const positions = new Set<string>();
		for (let i = 0; i < 8; i++) {
			const state = startTrial(0, 'mixed', () => i / 8);
			expect(state.player.riding).toBe(true);
			expect(
				state.dice.some(
					(die) => die.x === state.player.x && die.y === state.player.y && die.kind !== 'metal'
				)
			).toBe(true);
			positions.add(`${state.player.x},${state.player.y}`);
		}
		expect(positions.size).toBe(8);
	});
	it('warns on a reserved ground square three seconds before a die starts its long rise', () => {
		const initial = startTrial(0);
		const queued = queueSpawn(initial, 0, () => 0);
		expect(queued.dice).toHaveLength(8);
		expect(queued.trial!.warnings).toHaveLength(1);
		expect(queued.trial!.warnings[0].appearsAt).toBe(SPAWN_WARNING_MS);
		expect(tickTrial(queued, SPAWN_WARNING_MS - 1).dice).toHaveLength(8);
		const appearing = tickTrial(queued, SPAWN_WARNING_MS, () => 0);
		expect(appearing.dice).toHaveLength(9);
		expect(appearing.trial!.warnings).toHaveLength(0);
		expect(appearing.dice.at(-1)!.rising).toBe(SPAWN_WARNING_MS + SPAWN_RISE_MS);
		expect(initial.sinkDuration).toBe(ENDLESS_SINK_MS);
		expect(ENDLESS_SINK_MS).toBeGreaterThan(4000);
	});
	it('uses increasing score thresholds, starting at level one, and speeds up spawning', () => {
		expect([0, 99, 100, 299, 300, 600].map(levelForScore)).toEqual([1, 1, 2, 2, 3, 4]);
		expect([1, 2, 3, 4].map(scoreForLevel)).toEqual([0, 100, 300, 600]);
		const s = startTrial(0);
		s.score = 300;
		const next = tickTrial(s, 10, () => 0);
		expect(next.trial!.level).toBe(3);
		expect(spawnInterval(3)).toBeLessThan(spawnInterval(1));
	});
	it('only loses when the last die completely rises, and can free a square in time', () => {
		const s = startTrial(0);
		s.width = 2;
		s.height = 1;
		s.dice = [makeDie(1, 0, 0, 1), { ...makeDie(2, 1, 0, 1), rising: 4000 }];
		s.player = { x: 0, y: 0, riding: true };
		expect(tickTrial(s, 3999).trial!.over).toBe(false);
		expect(tickTrial(s, 4000).trial!.reason).toBe('full');
		s.dice[0].sinking = 3500;
		expect(tickTrial(s, 4000).trial!.over).toBe(false);
	});
	it('rolls normally into a forming die and swaps that die into the previous square', () => {
		const s = startTrial(0);
		s.dice = [makeDie(1, 0, 0, 2), { ...makeDie(2, 1, 0, 5), rising: 4000 }];
		s.player = { x: 0, y: 0, riding: true };
		const next = move(s, 'right', false, 100)!;
		expect(next.dice[0]).toMatchObject({ x: 1, y: 0, top: 4 });
		expect(next.dice[1]).toMatchObject({ x: 0, y: 0, top: 5, rising: 4000 });
		expect(next.player).toMatchObject({ x: 1, y: 0, riding: true });
		expect(next.moves).toBe(1);
	});
	it('moves a ground warning into a vacated square when a die rolls over it', () => {
		const s = startTrial(0);
		s.dice = [makeDie(1, 0, 0, 2)];
		s.player = { x: 0, y: 0, riding: true };
		s.trial!.warnings = [{ id: 9, x: 1, y: 0, appearsAt: 3000 }];
		expect(move(s, 'right', false, 100)!.trial!.warnings[0]).toMatchObject({ x: 0, y: 0 });
	});
	it('shifts warning and rise deadlines on pause, and leaves ice movement independent of input', () => {
		const s = queueSpawn(startTrial(0), 0, () => 0);
		s.dice[0].rising = 4000;
		const shifted = shiftTime(s, 10000);
		expect(shifted.trial!.warnings[0].appearsAt).toBe(13000);
		expect(shifted.dice[0].rising).toBe(14000);
		const ice = startTrial(0);
		ice.dice = [makeDie(1, 1, 2, 2, 'ice'), makeDie(2, 5, 2, 2)];
		ice.player = { x: 0, y: 2, riding: false };
		const slid = move(ice, 'right', false, 0)!;
		expect(inputCooldown(ice, slid)).toBeLessThan(movementDuration(ice, slid));
		expect(move(slid, 'up', false, 260)?.player.y).toBe(1);
		expect(EDGE_HOLD_MS).toBeLessThan(250);
	});
});
describe('Demon Dice puzzle mode', () => {
	it('provides twenty distinct authored boards covering every material', () => {
		expect(challengePuzzles).toHaveLength(20);
		expect(new Set(challengePuzzles.map((p) => JSON.stringify(p.state))).size).toBe(20);
		expect(new Set(challengePuzzles.flatMap((p) => p.state.dice.map((d) => d.kind)))).toEqual(
			new Set(['normal', 'wood', 'ice', 'stone', 'metal'])
		);
	});
	it('uses deliberate constraints, legal orientations and no automatic starting matches', () => {
		for (let i = 0; i < challengePuzzles.length; i++) {
			const puzzle = challengePuzzles[i],
				state = startChallenge(i);
			expect(puzzle.maxMoves).toBeGreaterThanOrEqual(4);
			expect(puzzle.state.removedTiles!.length).toBeGreaterThanOrEqual(3);
			expect(puzzle.design.verifiedDiceMoved).toBeGreaterThanOrEqual(2);
			for (const die of state.dice)
				expect(
					new Set([die.top, 7 - die.top, die.north, 7 - die.north, die.east, 7 - die.east]).size
				).toBe(6);
			match(
				state,
				0,
				state.dice.map((die) => die.id)
			);
			expect(state.dice.every((die) => die.sinking === undefined)).toBe(true);
		}
	});
	it.each(challengePuzzles.map((p, i) => [p.id, i] as const))(
		'solves %s within its dice-move budget',
		(_, index) => {
			let s = startChallenge(index),
				now = 0;
			for (const action of challengePuzzles[index].solution) {
				if (typeof action === 'object' && 'wait' in action) {
					now += action.wait;
					continue;
				}
				s = settle(s, now);
				if (typeof action === 'object') now += HOLD;
				const next =
					typeof action === 'string'
						? move(s, action, false, now)
						: heldMove(s, action.direction, HOLD, now);
				expect(next).not.toBeNull();
				now += Math.max(280, inputCooldown(s, next!));
				s = next!;
			}
			expect(s.moves).toBeLessThanOrEqual(challengePuzzles[index].maxMoves);
			expect(settle(s, now + 8000).dice).toHaveLength(0);
		}
	);
});
