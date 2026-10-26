import { describe, it, expect } from 'vitest';
import {
	puzzles,
	start,
	move,
	settle,
	match,
	heldMove,
	EDGE_HOLD_MS,
	type State
} from './devilDice.js';
import { movementDuration } from './devilDiceVisuals.js';
import { tutorialSets } from './devilDiceTutorials.js';

function rehearse(id: string) {
	const index = puzzles.findIndex((p) => p.id === id);
	let state = start(index),
		now = 0;
	const events: { before: State; after: State; push: boolean; roll: boolean; transfer: boolean }[] =
		[];
	for (const action of puzzles[index].solution) {
		if (typeof action === 'object' && 'wait' in action) {
			now += action.wait;
			state = settle(state, now);
			continue;
		}
		state = settle(state, now);
		if (typeof action === 'object') {
			now += EDGE_HOLD_MS;
			state = settle(state, now);
		}
		const before = state;
		const after =
			typeof action === 'string'
				? move(state, action, false, now)
				: heldMove(state, action.direction, EDGE_HOLD_MS, now);
		if (!after) throw new Error(`${id}: blocked at ${now}ms`);
		const moved = after.dice.some((d) =>
			before.dice.some((old) => old.id === d.id && (old.x !== d.x || old.y !== d.y))
		);
		events.push({
			before,
			after,
			push: moved && !before.player.riding,
			roll: moved && before.player.riding,
			transfer: before.player.riding !== after.player.riding
		});
		state = after;
		now += Math.max(300, movementDuration(before, state));
	}
	return { events, state, cleared: settle(state, now + 7000) };
}
describe('Tutorial learning goals', () => {
	it('provides exactly five uniquely labeled levels in each requested set', () => {
		expect(puzzles).toHaveLength(25);
		for (const set of tutorialSets)
			expect(puzzles.filter((p) => p.set === set.id).map((p) => p.id)).toEqual(
				[1, 2, 3, 4, 5].map((n) => `${set.id}${n}`)
			);
		for (let i = 0; i < puzzles.length; i++) {
			const s = start(i);
			match(s, 0, []);
			expect(
				s.dice.every((d) => d.sinking === undefined),
				puzzles[i].id
			).toBe(true);
		}
	});
	it('A2 uses exactly two pushes and joins the third die after the pair starts sinking', () => {
		const { events, cleared } = rehearse('A2');
		const pushes = events.filter((e) => e.push);
		expect(pushes).toHaveLength(2);
		expect(pushes[0].after.dice.filter((d) => d.sinking !== undefined)).toHaveLength(2);
		expect(pushes[1].after.dice.filter((d) => d.sinking !== undefined)).toHaveLength(3);
		expect(cleared.dice).toHaveLength(0);
	});
	it('A3 crosses a sinking bridge on the cut-out field in two dice moves', () => {
		const { state, cleared, events } = rehearse('A3');
		expect(state.width).toBe(7);
		expect(state.height).toBe(2);
		expect(state.removedTiles).toEqual([0, 1, 2, 3].map((x) => ({ x, y: 1 })));
		expect(move(start(2), 'down', false, 0)).toBeNull();
		expect(state.moves).toBe(2);
		expect(events.filter((event) => event.transfer)).toHaveLength(2);
		expect(cleared.dice).toHaveLength(0);
	});
	it('A4 uses four pushes, with the first pair gone before moving the second pair', () => {
		const { state, events, cleared } = rehearse('A4');
		const pushes = events.filter((event) => event.push);
		expect(pushes).toHaveLength(4);
		expect(pushes[1].before.dice).toHaveLength(2);
		expect(state.moves).toBe(4);
		expect(cleared.dice).toHaveLength(0);
		const walked = move(start(3), 'up', false, 0)!;
		expect(walked.dice.every((die) => die.sinking === undefined)).toBe(true);
	});
	it('A5 triggers Happy One for all three ones including the distant one', () => {
		const { state, cleared } = rehearse('A5');
		expect(state.dice.filter((d) => d.top === 1 && d.sinking !== undefined)).toHaveLength(3);
		expect(cleared.score).toBe(7);
		expect(cleared.dice).toHaveLength(0);
	});
	it('B2 starts with adjacent dice and teaches walking before rolling', () => {
		const { events, cleared } = rehearse('B2');
		expect(events[0].after.dice).toEqual(events[0].before.dice);
		expect(events[0].after.player.x).toBe(2);
		expect(events.slice(1).every((e) => e.roll)).toBe(true);
		expect(cleared.dice).toHaveLength(0);
	});
	it('B4 requires a ride-to-ground transition before the third 2 is pushed', () => {
		const { events, cleared } = rehearse('B4');
		expect(events[0].roll).toBe(true);
		expect(events[0].after.dice.filter((d) => d.sinking !== undefined)).toHaveLength(2);
		const drop = events.findIndex((e) => e.transfer && e.before.player.riding);
		const push = events.findIndex((e) => e.push);
		expect(drop).toBeGreaterThan(0);
		expect(push).toBeGreaterThan(drop);
		expect(cleared.dice).toHaveLength(0);
	});
	it('B5 makes a pair on the ground, climbs, then rolls the third 2 into it', () => {
		const { events, cleared } = rehearse('B5');
		const push = events.findIndex((e) => e.push);
		expect(events[push].after.dice.filter((d) => d.sinking !== undefined)).toHaveLength(2);
		const climb = events.findIndex((e) => e.transfer && !e.before.player.riding);
		const roll = events.findIndex((e) => e.roll);
		expect(climb).toBeGreaterThan(push);
		expect(roll).toBeGreaterThan(climb);
		expect(cleared.dice).toHaveLength(0);
	});
});
