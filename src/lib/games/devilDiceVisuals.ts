import type { Die, Direction, Kind, State } from './devilDice.js';
import { SPAWN_RISE_MS, iceSlideDuration } from './devilDice.js';

// Identity colors from the original game's colored dice: 1 white/red, 2 yellow,
// 3 blue, 4 cyan, 5 green, 6 pink. Pips remain readable without color perception.
export const faceColors: Record<number, { name: string; surface: string; pip: string }> = {
	1: { name: 'White', surface: '#faf8ef', pip: '#b52b38' },
	2: { name: 'Yellow', surface: '#eddf8e', pip: '#26382e' },
	3: { name: 'Blue', surface: '#a9a9e6', pip: '#26304c' },
	4: { name: 'Cyan', surface: '#a0dadd', pip: '#203d40' },
	5: { name: 'Green', surface: '#a2d69a', pip: '#244029' },
	6: { name: 'Pink', surface: '#dfa7d2', pip: '#462b42' }
};
export const facingAngle: Record<Direction, number> = {
	down: 0,
	right: Math.PI / 2,
	up: Math.PI,
	left: -Math.PI / 2
};
export const specialColors: Record<Exclude<Kind, 'normal'>, { surface: string; pip: string }> = {
	wood: { surface: '#bb9068', pip: '#30251b' },
	ice: { surface: '#a6dce5', pip: '#243e47' },
	stone: { surface: '#657169', pip: '#f6f3e8' },
	metal: { surface: '#b8c0c5', pip: '#273136' }
};
export const dieColors = (kind: Kind, face: number) =>
	kind === 'normal' ? faceColors[face] : specialColors[kind];
export function dieOpacity(d: Die, now: number, duration: number) {
	return d.sinking === undefined
		? 1
		: 1 - 0.92 * Math.max(0, Math.min(1, 1 - (d.sinking - now) / duration));
}
export function movementDuration(before: State, after: State, reduced = false) {
	if (reduced) return 0;
	let duration = 400;
	for (const d of after.dice) {
		const old = before.dice.find((v) => v.id === d.id);
		if (!old) continue;
		duration = Math.max(duration, dieMovementDuration(old, d));
	}
	return duration;
}
export function dieMovementDuration(old: Die, next: Die) {
	const distance = Math.hypot(next.x - old.x, next.y - old.y);
	if (!distance) return 0;
	const rolled = old.top !== next.top || old.north !== next.north || old.east !== next.east;
	return next.kind === 'ice' && !rolled ? iceSlideDuration(distance) : 420;
}
export function inputCooldown(before: State, after: State, reduced = false) {
	const sliding = after.dice.some((die) => die.slide);
	return reduced ? 120 : Math.min(sliding ? 260 : 420, movementDuration(before, after));
}
// Move a full-sized cube through the floor. Clip the underground portion in the renderer.
export function dieElevation(d: Die, now: number, duration: number, reduced = false) {
	if (reduced) return 0.435;
	if (d.sinking !== undefined)
		return 0.435 - 0.87 * Math.max(0, Math.min(1, 1 - (d.sinking - now) / duration));
	if (d.rising !== undefined)
		return -0.435 + 0.87 * Math.max(0, Math.min(1, 1 - (d.rising - now) / SPAWN_RISE_MS));
	return 0.435;
}
