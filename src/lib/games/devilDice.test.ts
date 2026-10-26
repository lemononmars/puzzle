import { describe, expect, it } from 'vitest';
import {
	at,
	isClear,
	displayedMoves,
	iceSlideDuration,
	match,
	move,
	puzzles,
	roll,
	settle,
	start,
	startTrial,
	spawnDie,
	tickTrial,
	shiftTime,
	heldMove,
	EDGE_HOLD_MS,
	type Direction,
	type State
} from './devilDice';
import {
	faceColors,
	facingAngle,
	dieElevation,
	dieColors,
	dieOpacity,
	movementDuration
} from './devilDiceVisuals.js';
const fixture = (id: string) => {
	const s = start(puzzles.findIndex((p) => p.id === id));
	s.sinkDuration = 1800;
	return s;
};

describe('Devil Dice mechanics', () => {
	it('allows dropping as soon as a die starts sinking, while climbing still needs a low edge', () => {
		const s = fixture('A1');
		s.player = { x: s.dice[0].x, y: s.dice[0].y, riding: true };
		s.dice[0].sinking = 1800;
		expect(heldMove(s, 'up', EDGE_HOLD_MS, 1)?.player).toMatchObject({ riding: false, y: 1 });
		expect(heldMove(s, 'up', EDGE_HOLD_MS - 1, 1)).toBeNull();
	});
	it('waits for ice to arrive before matching and displays each square as a move', () => {
		const s = fixture('D1');
		const slid = move(s, 'right', false, 0)!;
		const duration = iceSlideDuration(3);
		expect(slid.moves).toBe(3);
		expect(displayedMoves(slid, 0)).toBe(0);
		expect(displayedMoves(slid, duration / 3)).toBe(1);
		expect(displayedMoves(slid, (duration * 2) / 3)).toBe(2);
		expect(isClear(settle(slid, duration - 1))).toBe(false);
		const arrived = settle(slid, duration);
		expect(isClear(arrived)).toBe(true);
		expect(displayedMoves(arrived, duration)).toBe(3);
		expect(arrived.dice.every((die) => die.sinking === duration + 1800)).toBe(true);
		expect(shiftTime(slid, 5000).dice[0].slide?.started).toBe(5000);
		expect(move(slid, 'up', false, 260)).not.toBeNull();
	});
	it('blocks rolls into tall sinking dice and rolls over low ones without dropping', () => {
		const s = fixture('B1');
		s.dice[1].x = 2;
		s.dice[1].sinking = 1800;
		expect(move(s, 'right', false, 400)).toBeNull();
		const next = move(s, 'right', false, 600)!;
		expect(next.player).toMatchObject({ x: 2, riding: true });
		expect(next.dice).toHaveLength(1);
		expect(next.dice[0]).toMatchObject({ x: 2, top: 2 });
		expect(next.cleared).toBe(1);
		expect(next.moves).toBe(1);
		expect(s.dice).toHaveLength(2);
	});
	it('counts every square of an ice relay and clears before matched dice disappear', () => {
		const s = fixture('D1');
		s.width = 9;
		s.dice = [1, 4, 6].map((x, i) => ({ ...s.dice[0], id: i + 1, x }));
		expect(move(s, 'right', false, 0)!.moves).toBe(5);
		expect(isClear(s)).toBe(false);
		s.dice.forEach((die) => {
			die.sinking = 1800;
		});
		expect(isClear(s)).toBe(true);
		expect(s.dice).toHaveLength(3);
	});
	it('rotates full orientations reversibly and preserves opposite faces', () => {
		const faces = { top: 2, north: 1, east: 3 };
		for (const direction of ['up', 'down', 'left', 'right'] as Direction[]) {
			let next = faces;
			for (let i = 0; i < 4; i++) next = roll(next, direction);
			expect(next).toEqual(faces);
		}
		expect(roll(roll(faces, 'up'), 'down')).toEqual(faces);
		expect(roll(roll(faces, 'left'), 'right')).toEqual(faces);
	});
	it('pushes regular dice without rotating and blocks the board edge', () => {
		const original = fixture('A1');
		const s = move(move(original, 'right')!, 'right')!;
		expect(at(s, 3, 2)?.top).toBe(2);
		expect(original.moves).toBe(0);
		expect(move(s, 'right')).toBeNull();
	});
	it('slides ice to the obstruction and rolls wood on a push', () => {
		expect(at(move(fixture('D1'), 'right')!, 4, 2)?.kind).toBe('ice');
		expect(at(move(fixture('C1'), 'right')!, 2, 2)?.top).toBe(2);
	});
	it('blocks stone pushes but allows riding, rolling, and walking between dice', () => {
		const s = fixture('E1');
		s.dice[2].kind = 'stone';
		s.player = { x: 3, y: 2, riding: false };
		expect(move(s, 'right')).toBeNull();
		expect(move(s, 'right', true)).toBeNull();
		const climbed = { ...s, player: { x: 4, y: 2, riding: true } };
		const walked = move(climbed, 'up')!;
		expect(at(walked, 4, 1)?.top).toBe(3);
		const rolled = move(walked, 'left')!;
		expect(at(rolled, 3, 1)?.kind).toBe('stone');
		expect(move(rolled, 'up', true)).toBeNull();
	});
	it('uses half-sunk dice to climb and drop, and lets the rider escape onto a full die', () => {
		const s = fixture('A1');
		s.dice[0].sinking = 1800;
		s.player = { x: 1, y: 2, riding: false };
		expect(move(s, 'right', true, 400)).toBeNull();
		const climbed = move(s, 'right', true, 1000)!;
		expect(climbed.player.riding).toBe(true);
		expect(move(climbed, 'up', true, 1000)?.player.riding).toBe(false);
		expect(move(climbed, 'up', false, 1000)).toBeNull();
		climbed.dice[1].x = 3;
		expect(move(climbed, 'right', false, 1000)?.player.x).toBe(3);
	});
	it('transfers ice momentum through multiple ice dice without rotating them', () => {
		const s = fixture('D1');
		s.width = 9;
		s.dice = [
			{ ...s.dice[0], x: 1 },
			{ ...s.dice[0], id: 2, x: 4 },
			{ ...s.dice[0], id: 3, x: 6 }
		];
		const result = move(s, 'right', false, 0)!;
		expect(result.dice.map((d) => d.x)).toEqual([3, 5, 8]);
		expect(result.dice.map((d) => d.top)).toEqual([2, 2, 2]);
	});
	it('does not match ones together; Happy One clears remote ones but spares the ridden one', () => {
		const s = fixture('A1');
		s.dice = s.dice.map((d) => ({ ...d, top: 1 }));
		s.dice[1].x = 3;
		match(s, 0);
		expect(s.dice.every((d) => d.sinking === undefined)).toBe(true);
		s.width = 7;
		s.dice.push({ ...s.dice[0], id: 3, x: 1, top: 2, sinking: 1800 });
		s.dice.push({ ...s.dice[0], id: 4, x: 6, top: 1 });
		s.player = { x: 3, y: 2, riding: true };
		match(s, 500, [1]);
		expect(s.dice.find((d) => d.id === 1)?.sinking).toBe(2300);
		expect(s.dice.find((d) => d.id === 4)?.sinking).toBe(2300);
		expect(s.dice.find((d) => d.id === 2)?.sinking).toBeUndefined();
	});
	it('passes a push through touching ice without overlapping the character', () => {
		const s = fixture('D1');
		s.dice[1].kind = 'ice';
		s.dice[1].x = 2;
		const result = move(s, 'right', false, 0)!;
		expect(result.dice.map((d) => d.x)).toEqual([1, 5]);
		expect(result.player.x).toBe(0);
		s.dice[1].x = 5;
		s.dice[0].x = 4;
		s.player.x = 3;
		expect(move(s, 'right', false, 0)).toBeNull();
	});
	it('matches orthogonal groups, allows chains, and drops the rider when sinking ends', () => {
		const s = fixture('A1');
		s.dice[0].x = 3;
		match(s, 0);
		expect(s.dice.every((d) => d.sinking === 1800)).toBe(true);
		s.dice.push({ ...s.dice[0], id: 3, x: 2, sinking: undefined });
		match(s, 500);
		expect(s.dice[2].sinking).toBe(2300);
		s.player = { x: 3, y: 2, riding: true };
		expect(settle(s, 1799).dice).toHaveLength(3);
		const end = settle(s, 1800);
		expect(end.dice).toHaveLength(1);
		expect(end.player.riding).toBe(false);
		const diagonal = fixture('A1');
		diagonal.dice[0].x = 3;
		diagonal.dice[0].y = 1;
		match(diagonal, 0);
		expect(diagonal.dice.some((d) => d.sinking !== undefined)).toBe(false);
	});
	it('keeps metal fixed from both ground and above, but allows walking across it and clearing it', () => {
		const s = fixture('E1');
		s.player = { x: 4, y: 0, riding: false };
		expect(move(s, 'down')).toBeNull();
		s.player = { x: 4, y: 1, riding: true };
		expect(move(s, 'left')).toBeNull();
		expect(move(s, 'down')?.player).toMatchObject({ x: 4, y: 2, riding: true });
	});
	it('matches the guide scoring example and does not award the same match twice', () => {
		const s = fixture('A1');
		s.dice[0].x = 3;
		match(s, 0);
		expect(s.score).toBe(4);
		match(s, 100);
		expect(s.score).toBe(4);
		s.dice.push({
			...s.dice[0],
			id: 3,
			x: 2,
			sinking: undefined,
			chain: undefined,
			chainStep: undefined
		});
		match(s, 500);
		expect(s.score).toBe(16);
		s.dice.push({
			...s.dice[0],
			id: 4,
			x: 1,
			sinking: undefined,
			chain: undefined,
			chainStep: undefined
		});
		match(s, 1000);
		expect(s.score).toBe(40);
		// The original pair disappears; the multiplier survives on the remaining dice.
		const partial = settle(s, 1800);
		expect(partial.dice).toHaveLength(2);
		partial.dice.push({
			...partial.dice[0],
			id: 5,
			x: 0,
			sinking: undefined,
			chain: undefined,
			chainStep: undefined
		});
		match(partial, 1900);
		expect(partial.score).toBe(64);
	});
	it('requires enough remaining dice to extend a chain and resets after the last disappears', () => {
		const s = fixture('E1');
		s.dice[0].x = 3;
		match(s, 0);
		expect(s.score).toBe(9);
		const last = s.dice[0];
		last.sinking = 3000;
		const partial = settle(s, 2000);
		expect(partial.dice).toHaveLength(1);
		partial.dice.push({ ...last, id: 4, x: 2, sinking: undefined });
		match(partial, 2000);
		expect(partial.dice[1].sinking).toBeUndefined();
		expect(partial.score).toBe(9);
		const empty = settle(s, 4000);
		empty.dice = [
			{ ...last, id: 8, x: 0, top: 2, sinking: undefined, chain: undefined },
			{ ...last, id: 9, x: 1, top: 2, sinking: undefined, chain: undefined }
		];
		match(empty, 5000);
		expect(empty.score).toBe(13);
		expect(empty.dice[0].chainStep).toBe(0);
	});
	it('awards one point per Happy One removed, only once', () => {
		const s = fixture('A1');
		s.dice = s.dice.map((d) => ({ ...d, top: 1, sinking: 100 }));
		const done = settle(s, 100);
		expect(done.score).toBe(2);
		expect(settle(done, 200).score).toBe(2);
	});
	it('spawns valid dice in empty squares, lifts a ground player, and freezes on a full field', () => {
		let s = startTrial(0);
		s.dice = [];
		s.player = { x: 0, y: 0, riding: false };
		s = spawnDie(s, 3000, () => 0);
		expect(s.dice).toHaveLength(1);
		expect(s.player.riding).toBe(true);
		const d = s.dice[0];
		expect(new Set([d.top, 7 - d.top, d.north, 7 - d.north, d.east, 7 - d.east]).size).toBe(6);
		expect(d.rising).toBe(7000);
		expect(s.trial?.spawned).toBe(1);
		s.width = s.height = 1;
		s.dice = [];
		s = spawnDie(s, 4000, () => 0);
		expect(s.trial?.over).toBe(false);
		expect(tickTrial(s, 7999).trial?.over).toBe(false);
		s = tickTrial(s, 8000);
		expect(s.trial?.over).toBe(true);
		expect(move(s, 'up')).toBeNull();
	});
	it('ticks spawning and formation, and shifts all deadlines when resuming', () => {
		const s = startTrial(0);
		const queued = tickTrial(s, 0, () => 0);
		expect(tickTrial(queued, 2999).dice).toHaveLength(8);
		const spawned = tickTrial(queued, 3000, () => 0);
		expect(spawned.dice).toHaveLength(9);
		expect(tickTrial(spawned, 7000).dice.every((d) => d.rising === undefined)).toBe(true);
		const shifted = shiftTime(spawned, 10000);
		expect(shifted.trial!.nextSpawn).toBe(spawned.trial!.nextSpawn + 10000);
		expect(shifted.dice.at(-1)!.rising).toBe(17000);
	});
	it('ends a complete unattended Trial when every square is occupied', () => {
		let s = startTrial(0);
		for (let i = 1; i <= 400 && !s.trial?.over; i++) s = tickTrial(s, i * 1000, () => 0);
		expect(s.trial?.over).toBe(true);
		expect(s.dice).toHaveLength(36);
		expect(new Set(s.dice.map((d) => `${d.x},${d.y}`)).size).toBe(36);
		expect(s.score).toBe(0);
	});
	it('starts every Trial type with valid six-sided orientations', () => {
		for (const kind of ['normal', 'wood', 'ice', 'stone', 'mixed'] as const) {
			const s = startTrial(0, kind);
			for (const d of s.dice)
				expect(new Set([d.top, 7 - d.top, d.north, 7 - d.north, d.east, 7 - d.east]).size).toBe(6);
			if (kind !== 'mixed') expect(s.dice.every((d) => d.kind === kind)).toBe(true);
		}
	});
	it.each(puzzles.map((p, i) => [p.title, i] as const))(
		'has a valid clearable puzzle: %s',
		(_, index) => {
			let s: State = start(index);
			for (const d of s.dice)
				expect(new Set([d.top, 7 - d.top, d.north, 7 - d.north, d.east, 7 - d.east]).size).toBe(6);
			let now = 0;
			for (const action of puzzles[index].solution) {
				if (typeof action === 'object' && 'wait' in action) {
					now += action.wait;
					s = settle(s, now);
					continue;
				}
				s = settle(s, now);
				if (typeof action === 'object') {
					now += EDGE_HOLD_MS;
					s = settle(s, now);
				}
				const before = s;
				const next =
					typeof action === 'string'
						? move(s, action, false, now)
						: heldMove(s, action.direction, EDGE_HOLD_MS, now);
				expect(next).not.toBeNull();
				s = next!;
				now += Math.max(300, movementDuration(before, s));
			}
			expect(settle(s, now + 7000).dice).toHaveLength(0);
			expect(s.moves).toBeLessThanOrEqual(puzzles[index].maxMoves!);
		}
	);
	it('faces the direction of successful movement and leaves facing unchanged when blocked', () => {
		let s = fixture('A1');
		s = move(s, 'right')!;
		expect(s.player.facing).toBe('right');
		s = move(s, 'up')!;
		expect(s.player.facing).toBe('up');
		s = move(s, 'left')!;
		expect(s.player.facing).toBe('left');
		s = move(s, 'down')!;
		expect(s.player.facing).toBe('down');
		expect(Object.values(facingAngle)).toHaveLength(4);
	});
	it('assigns six different face colors and translates sinking dice a whole cube height', () => {
		expect(new Set(Object.values(faceColors).map((c) => c.surface)).size).toBe(6);
		const d = { ...fixture('A1').dice[0], sinking: 6000 };
		expect(dieElevation(d, 0, 6000)).toBeCloseTo(0.435);
		expect(dieElevation(d, 3000, 6000)).toBeCloseTo(0);
		expect(dieElevation(d, 6000, 6000)).toBeCloseTo(-0.435);
		expect(dieElevation(d, 3000, 6000, true)).toBeCloseTo(0.435);
	});
	it('counts only actions that move dice, not walking or changing height', () => {
		let s = fixture('A1');
		s = move(s, 'right')!;
		expect(s.moves).toBe(0);
		s = move(s, 'right')!;
		expect(s.moves).toBe(1);
		const low = fixture('A1');
		low.player = { x: 1, y: 2, riding: false };
		low.dice[0].sinking = 1800;
		const climbed = heldMove(low, 'right', EDGE_HOLD_MS, 1000)!;
		expect(climbed.moves).toBe(0);
		expect(heldMove(climbed, 'up', EDGE_HOLD_MS, 1000)?.moves).toBe(0);
	});
	it('requires the full hold interval before automatically climbing or dropping', () => {
		const s = fixture('A1');
		s.player = { x: 1, y: 2, riding: false };
		s.dice[0].sinking = 1800;
		expect(heldMove(s, 'right', EDGE_HOLD_MS - 1, 1000)).toBeNull();
		const climbed = heldMove(s, 'right', EDGE_HOLD_MS, 1000)!;
		expect(climbed.player.riding).toBe(true);
		expect(heldMove(climbed, 'up', EDGE_HOLD_MS - 1, 1000)).toBeNull();
		expect(heldMove(climbed, 'up', EDGE_HOLD_MS, 1000)?.player.riding).toBe(false);
	});
	it('does not trigger Happy One for stationary ones, but does when a one is pushed', () => {
		const s = fixture('A1');
		s.width = 6;
		s.dice = [
			{ ...s.dice[0], top: 1, x: 3, y: 1 },
			{ ...s.dice[1], id: 2, top: 2, x: 3, y: 2, sinking: 5000 },
			{ ...s.dice[0], id: 3, top: 1, x: 5, y: 0 }
		];
		s.player = { x: 1, y: 1, riding: false };
		match(s, 0);
		expect(s.dice[0].sinking).toBeUndefined();
		expect(move(s, 'left', false, 0)?.dice[0].sinking).toBeUndefined();
		s.dice[0].x = 2;
		const pushed = move(s, 'right', false, 0)!;
		expect(pushed.dice.filter((d) => d.top === 1).every((d) => d.sinking !== undefined)).toBe(true);
	});
	it('uses a single color for each special type, slows ice, and fades sinking dice gradually', () => {
		for (const kind of ['wood', 'ice', 'stone', 'metal'] as const)
			expect(new Set([1, 2, 3, 4, 5, 6].map((n) => dieColors(kind, n).surface)).size).toBe(1);
		const s = fixture('D1'),
			next = move(s, 'right', false, 0)!;
		expect(movementDuration(s, next)).toBeGreaterThan(700);
		const d = { ...s.dice[0], sinking: 1800 };
		expect(dieOpacity(d, 0, 1800)).toBe(1);
		expect(dieOpacity(d, 900, 1800)).toBeCloseTo(0.54);
		expect(dieOpacity(d, 1800, 1800)).toBeCloseTo(0.08);
	});
	it('can trigger Happy One by rolling a 1 beside another sinking 1, while sparing the rider', () => {
		const s = start(puzzles.findIndex((p) => p.id === 'B1'));
		s.sinkDuration = 1800;
		s.dice[0] = { ...s.dice[0], top: 2, north: 3, east: 6 };
		s.dice[1] = { ...s.dice[1], top: 1, sinking: 5000 };
		s.dice.push({ ...s.dice[1], id: 3, x: 0, y: 0, sinking: undefined });
		const next = move(s, 'right', false, 0)!;
		expect(next.dice[0].top).toBe(1);
		expect(next.dice[0].sinking).toBeUndefined();
		expect(next.dice[2].sinking).toBe(1800);
	});
});
