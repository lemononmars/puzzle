import { puzzles, makeDie as die } from './devilDiceTutorials.js';
export { puzzles } from './devilDiceTutorials.js';
export type Direction = 'up' | 'down' | 'left' | 'right';
export type Kind = 'normal' | 'ice' | 'stone' | 'wood' | 'metal';
export type Faces = { top: number; north: number; east: number };
export type SpawnWarning = { id: number; x: number; y: number; appearsAt: number };
export type Die = Faces & {
	id: number;
	x: number;
	y: number;
	kind: Kind;
	sinking?: number;
	rising?: number;
	chain?: number;
	chainStep?: number;
	slide?: { started: number; duration: number; fromX: number; fromY: number; steps: number };
};
export type State = {
	width: number;
	height: number;
	removedTiles?: { x: number; y: number }[];
	dice: Die[];
	player: { x: number; y: number; riding: boolean; facing?: Direction };
	sinkDuration?: number;
	/** Original puzzle-mode ice stops at the first square that completes a group. */
	iceMatchStops?: boolean;
	moves: number;
	cleared: number;
	score: number;
	chainSerial: number;
	trial?: {
		nextSpawn: number;
		spawned: number;
		started: number;
		over: boolean;
		level: number;
		serial: number;
		warnings: SpawnWarning[];
		endedAt?: number;
		reason?: 'full' | 'ended';
		kind: Kind | 'mixed';
	};
};
export const vectors: Record<Direction, [number, number]> = {
	up: [0, -1],
	down: [0, 1],
	left: [-1, 0],
	right: [1, 0]
};
export function roll(f: Faces, direction: Direction): Faces {
	switch (direction) {
		case 'up':
			return { top: 7 - f.north, north: f.top, east: f.east };
		case 'down':
			return { top: f.north, north: 7 - f.top, east: f.east };
		case 'left':
			return { top: f.east, north: f.north, east: 7 - f.top };
		case 'right':
			return { top: 7 - f.east, north: f.north, east: f.top };
	}
}
export const at = (s: State, x: number, y: number) => s.dice.find((d) => d.x === x && d.y === y);
export const inside = (s: State, x: number, y: number) =>
	x >= 0 &&
	y >= 0 &&
	x < s.width &&
	y < s.height &&
	!s.removedTiles?.some((tile) => tile.x === x && tile.y === y);
export const isClear = (s: State) => s.dice.every((die) => die.sinking !== undefined);
export const iceSlideDuration = (steps: number) => Math.min(1800, 380 + steps * 190);
export const slideProgress = (die: Die, now: number) =>
	die.slide ? Math.max(0, Math.min(1, (now - die.slide.started) / die.slide.duration)) : 1;
export const displayedMoves = (state: State, now: number) =>
	state.moves -
	state.dice.reduce(
		(sum, die) =>
			sum +
			(die.slide
				? die.slide.steps - Math.floor(slideProgress(die, now) * die.slide.steps + 1e-6)
				: 0),
		0
	);
export const clone = (s: State): State => JSON.parse(JSON.stringify(s));
export const SINK_DURATION = 1800;
export const ENDLESS_SINK_MS = 6500;
export const SPAWN_WARNING_MS = 3000;
export const SPAWN_RISE_MS = 4000;
export const scoreForLevel = (level: number) => 50 * Math.max(0, level - 1) * Math.max(1, level);
export const levelForScore = (score: number) =>
	Math.floor((1 + Math.sqrt(1 + Math.max(0, score) * 0.08)) / 2);
export const spawnInterval = (level: number) =>
	Math.max(1100, 6500 - (Math.max(1, level) - 1) * 450);
// A quarter-sunk die is low enough to climb, drop from, or roll over.
export const isLow = (d: Die | undefined, now: number, duration = SINK_DURATION) =>
	!!d &&
	((d.sinking !== undefined && d.sinking > now && d.sinking - now <= duration * 0.75) ||
		(d.rising !== undefined && d.rising > now));
export const canDropFrom = (die: Die | undefined, now: number, duration = SINK_DURATION) =>
	!!die && ((die.sinking !== undefined && die.sinking > now) || isLow(die, now, duration));
export function match(s: State, now: number, movedDice?: readonly number[]) {
	const visited = new Set<number>();
	for (const die of s.dice) {
		if (
			visited.has(die.id) ||
			die.slide !== undefined ||
			die.top === 1 ||
			(die.sinking !== undefined && die.sinking <= now) ||
			(die.rising !== undefined && die.rising > now)
		)
			continue;
		const group = [die];
		visited.add(die.id);
		for (let i = 0; i < group.length; i++) {
			for (const [dx, dy] of Object.values(vectors)) {
				const next = at(s, group[i].x + dx, group[i].y + dy);
				if (
					next &&
					next.slide === undefined &&
					next.top === die.top &&
					!visited.has(next.id) &&
					!(next.sinking !== undefined && next.sinking <= now) &&
					!(next.rising !== undefined && next.rising > now)
				) {
					visited.add(next.id);
					group.push(next);
				}
			}
		}
		const fresh = group.filter((d) => d.sinking === undefined);
		if (movedDice && !group.some((die) => movedDice.includes(die.id))) continue;
		if (group.length >= die.top && fresh.length) {
			const active = group.filter((d) => d.sinking !== undefined);
			const ids = new Set(active.map((d) => d.chain).filter((id) => id !== undefined));
			const chain = active.find((d) => d.chain !== undefined)?.chain ?? ++s.chainSerial;
			const step = active.length ? Math.max(0, ...active.map((d) => d.chainStep ?? 0)) + 1 : 0;
			s.score += die.top * group.length * (step + 1);
			for (const d of s.dice)
				if (d.chain !== undefined && ids.has(d.chain)) {
					d.chain = chain;
					d.chainStep = step;
				}
			for (const d of group) {
				d.chain = chain;
				d.chainStep = step;
				d.sinking ??= now + (s.sinkDuration ?? SINK_DURATION);
			}
		}
	}
	// Happy One clears every exposed one except the one supporting the character.
	const ridden = s.player.riding ? at(s, s.player.x, s.player.y) : undefined;
	const trigger = s.dice.find(
		(d) =>
			movedDice?.includes(d.id) &&
			d.top === 1 &&
			d.slide === undefined &&
			d.sinking === undefined &&
			!(d.rising !== undefined && d.rising > now) &&
			Object.values(vectors).some(([dx, dy]) => {
				const neighbor = at(s, d.x + dx, d.y + dy);
				return neighbor?.sinking !== undefined && neighbor.sinking > now;
			})
	);
	if (trigger)
		for (const d of s.dice) {
			if (d.top === 1 && d.id !== ridden?.id && !(d.rising !== undefined && d.rising > now))
				d.sinking ??= now + (s.sinkDuration ?? SINK_DURATION);
		}
}
export function settle(state: State, now: number): State {
	const s = clone(state);
	const arrivals = [
		...new Set(
			s.dice
				.filter((die) => die.slide && die.slide.started + die.slide.duration <= now)
				.map((die) => die.slide!.started + die.slide!.duration)
		)
	].sort((a, b) => a - b);
	for (const time of arrivals) {
		const arrived = s.dice.filter(
			(die) => die.slide && die.slide.started + die.slide.duration === time
		);
		for (const die of arrived) delete die.slide;
		match(
			s,
			time,
			arrived.map((die) => die.id)
		);
	}
	const removed = s.dice.filter((d) => d.sinking !== undefined && d.sinking <= now);
	s.dice = s.dice.filter((d) => !removed.includes(d));
	s.cleared += removed.length;
	s.score += removed.filter((d) => d.top === 1).length;
	for (const d of s.dice) if (d.rising !== undefined && d.rising <= now) delete d.rising;
	if (!at(s, s.player.x, s.player.y)) s.player.riding = false;
	return s;
}
/** Predict the first stopping square without starting a match before the die arrives. */
function completesMatchAt(s: State, moving: Die, x: number, y: number, now: number): boolean {
	const neighbors = (cx: number, cy: number) =>
		Object.values(vectors)
			.map(([dx, dy]) =>
				s.dice.find((d) => d.id !== moving.id && d.x === cx + dx && d.y === cy + dy)
			)
			.filter(
				(d): d is Die =>
					!!d &&
					!d.slide &&
					!(d.rising !== undefined && d.rising > now) &&
					!(d.sinking !== undefined && d.sinking <= now)
			);
	if (moving.top === 1) return neighbors(x, y).some((d) => d.sinking !== undefined);
	const group = [{ ...moving, x, y }];
	const visited = new Set([moving.id]);
	for (let i = 0; i < group.length; i++) {
		for (const die of neighbors(group[i].x, group[i].y)) {
			if (die.top !== moving.top || visited.has(die.id)) continue;
			visited.add(die.id);
			group.push(die);
		}
	}
	return group.length >= moving.top;
}
export function move(
	state: State,
	direction: Direction,
	transfer = false,
	now = Date.now()
): State | null {
	const s = clone(state),
		[dx, dy] = vectors[direction],
		p = s.player;
	if (s.trial?.over) return null;
	const x = p.x + dx,
		y = p.y + dy;
	if (!inside(s, x, y)) return null;
	const target = at(s, x, y);
	if (target?.slide || (p.riding && at(s, p.x, p.y)?.slide)) return null;
	if (transfer) {
		if (
			p.riding
				? !!target || !canDropFrom(at(s, p.x, p.y), now, s.sinkDuration)
				: !isLow(target, now, s.sinkDuration)
		)
			return null;
		p.x = x;
		p.y = y;
		p.riding = !p.riding;
	} else if (p.riding) {
		const current = at(s, p.x, p.y);
		if (!current) return null;
		const rollingOver = target?.sinking !== undefined && current.sinking === undefined;
		if (rollingOver && !isLow(target, now, s.sinkDuration)) return null;
		if (!target || rollingOver || (target.rising !== undefined && target.rising > now)) {
			if (
				current.kind === 'metal' ||
				current.sinking !== undefined ||
				(current.rising !== undefined && current.rising > now)
			)
				return null;
			if (target?.sinking !== undefined) {
				s.dice = s.dice.filter((die) => die.id !== target.id);
				s.cleared++;
				if (target.top === 1) s.score++;
			} else if (target) {
				target.x = p.x;
				target.y = p.y;
			}
			current.x = x;
			current.y = y;
			Object.assign(current, roll(current, direction));
		}
		p.x = x;
		p.y = y;
	} else {
		if (target) {
			if (
				target.kind === 'metal' ||
				target.kind === 'stone' ||
				target.sinking !== undefined ||
				(target.rising !== undefined && target.rising > now)
			)
				return null;
			let tx = x + dx,
				ty = y + dy;
			if (target.kind === 'ice') {
				// Transfer momentum at each ice collision; earlier dice stop at contact.
				let sliding = target;
				let moved = false;
				let matchingStop = false;
				let startsAt = now;
				tx = x;
				ty = y;
				while (true) {
					while (inside(s, tx + dx, ty + dy) && !at(s, tx + dx, ty + dy)) {
						tx += dx;
						ty += dy;
						if (s.iceMatchStops && completesMatchAt(s, sliding, tx, ty, startsAt)) {
							matchingStop = true;
							break;
						}
					}
					const steps = Math.abs(sliding.x - tx) + Math.abs(sliding.y - ty);
					moved ||= steps > 0;
					if (steps) {
						sliding.slide = {
							started: startsAt,
							duration: iceSlideDuration(steps),
							fromX: sliding.x,
							fromY: sliding.y,
							steps
						};
						startsAt += sliding.slide.duration;
					}
					sliding.x = tx;
					sliding.y = ty;
					if (matchingStop) break;
					const hit = at(s, tx + dx, ty + dy);
					if (
						!hit ||
						hit.kind !== 'ice' ||
						hit.slide !== undefined ||
						hit.sinking !== undefined ||
						(hit.rising !== undefined && hit.rising > now)
					)
						break;
					sliding = hit;
					tx = hit.x;
					ty = hit.y;
				}
				if (!moved) return null;
			} else {
				if (!inside(s, tx, ty)) return null;
				const destination = at(s, tx, ty);
				if (destination) {
					if (
						target.kind !== 'wood' ||
						destination.sinking === undefined ||
						!isLow(destination, now, s.sinkDuration)
					)
						return null;
					s.dice = s.dice.filter((die) => die.id !== destination.id);
					s.cleared++;
					if (destination.top === 1) s.score++;
				}
				target.x = tx;
				target.y = ty;
			}
			if (target.kind === 'wood') Object.assign(target, roll(target, direction));
		}
		if (!at(s, x, y)) {
			p.x = x;
			p.y = y;
		}
	}
	p.facing = direction;
	// A roll/push may occupy a warning square. Move its reservation into the vacated square.
	if (s.trial)
		for (const warning of s.trial.warnings) {
			if (!at(s, warning.x, warning.y)) continue;
			const vacated = state.dice.find(
				(d) =>
					!at(s, d.x, d.y) &&
					!s.trial!.warnings.some((w) => w !== warning && w.x === d.x && w.y === d.y)
			);
			if (vacated) {
				warning.x = vacated.x;
				warning.y = vacated.y;
			}
		}
	const movedDice = s.dice
		.filter((d) =>
			state.dice.some(
				(old) =>
					old.id === d.id &&
					(old.x !== d.x ||
						old.y !== d.y ||
						old.top !== d.top ||
						old.north !== d.north ||
						old.east !== d.east)
			)
		)
		.map((d) => d.id);
	s.moves += s.dice.reduce((total, die) => {
		const old = state.dice.find((previous) => previous.id === die.id);
		if (!old || !movedDice.includes(die.id)) return total;
		// Rising dice displaced by a roll are not a second player move.
		if (old.rising !== undefined && old.rising > now) return total;
		return total + (die.kind === 'ice' ? Math.abs(old.x - die.x) + Math.abs(old.y - die.y) : 1);
	}, 0);
	match(s, now, movedDice);
	updateLevel(s, now);
	return s;
}
export const EDGE_HOLD_MS = 180;
export function canTransferAt(state: State, direction: Direction, now: number): boolean {
	const [dx, dy] = vectors[direction],
		p = state.player,
		x = p.x + dx,
		y = p.y + dy;
	if (!inside(state, x, y) || state.trial?.over) return false;
	const target = at(state, x, y);
	return p.riding
		? !target && canDropFrom(at(state, p.x, p.y), now, state.sinkDuration)
		: isLow(target, now, state.sinkDuration);
}
export function heldMove(
	state: State,
	direction: Direction,
	heldMs: number,
	now = Date.now()
): State | null {
	return (
		move(state, direction, false, now) ??
		(heldMs >= EDGE_HOLD_MS && canTransferAt(state, direction, now)
			? move(state, direction, true, now)
			: null)
	);
}
export function start(index: number): State {
	return clone({
		...puzzles[index].state,
		moves: 0,
		cleared: 0,
		score: 0,
		chainSerial: 0
	} as State);
}

export function startTrial(
	now = Date.now(),
	kind: Kind | 'mixed' = 'normal',
	random = Math.random
): State {
	const state: State = {
		width: 6,
		height: 6,
		player: { x: 2, y: 2, riding: true },
		moves: 0,
		cleared: 0,
		score: 0,
		chainSerial: 0,
		sinkDuration: ENDLESS_SINK_MS,
		dice: [
			die(1, 2, 2, 3, 'normal', 5),
			die(2, 4, 2, 2),
			die(3, 0, 0, 4),
			die(4, 3, 0, 5),
			die(5, 5, 1, 6),
			die(6, 1, 4, 3),
			die(7, 4, 4, 4),
			die(8, 0, 5, 6)
		].map((d, i) => ({
			...d,
			kind: kind === 'mixed' ? (['normal', 'wood', 'ice', 'stone'] as Kind[])[i % 4] : kind
		})),
		trial: {
			nextSpawn: now,
			spawned: 0,
			started: now,
			over: false,
			kind,
			level: 1,
			serial: 8,
			warnings: []
		}
	};
	const support = state.dice[pickIndex(state.dice.length, random)];
	state.player = { x: support.x, y: support.y, riding: true };
	return state;
}
function updateLevel(s: State, now: number) {
	if (!s.trial) return;
	const level = levelForScore(s.score);
	if (level > s.trial.level) {
		s.trial.level = level;
		s.trial.nextSpawn = Math.min(s.trial.nextSpawn, now + spawnInterval(level));
	}
}
function emptySquares(s: State) {
	const cells: { x: number; y: number }[] = [];
	for (let y = 0; y < s.height; y++)
		for (let x = 0; x < s.width; x++)
			if (!at(s, x, y) && !s.trial?.warnings.some((w) => w.x === x && w.y === y))
				cells.push({ x, y });
	return cells;
}
const pickIndex = (length: number, random: () => number) =>
	Math.min(length - 1, Math.max(0, Math.floor(random() * length)));
function addRisingDie(
	s: State,
	x: number,
	y: number,
	id: number,
	now: number,
	random: () => number
) {
	if (!s.trial || at(s, x, y)) return;
	const top = pickIndex(6, random) + 1;
	const east = [1, 2, 3, 4, 5, 6].filter((n) => n !== top && n !== 7 - top)[pickIndex(4, random)];
	const kind =
		s.trial.kind === 'mixed'
			? (['normal', 'wood', 'ice', 'stone'] as Kind[])[pickIndex(4, random)]
			: s.trial.kind;
	s.dice.push({ ...die(id, x, y, top, kind, east), rising: now + SPAWN_RISE_MS });
	if (s.player.x === x && s.player.y === y) s.player.riding = true;
	s.trial.spawned++;
}
export function queueSpawn(state: State, now: number, random = Math.random): State {
	const s = clone(state);
	if (!s.trial || s.trial.over) return s;
	const empty = emptySquares(s);
	if (empty.length) {
		const cell = empty[pickIndex(empty.length, random)];
		s.trial.warnings.push({ ...cell, id: ++s.trial.serial, appearsAt: now + SPAWN_WARNING_MS });
	}
	s.trial.nextSpawn = now + spawnInterval(s.trial.level);
	return s;
}
export function spawnDie(state: State, now: number, random = Math.random): State {
	const s = clone(state);
	if (!s.trial || s.trial.over) return s;
	const empty = emptySquares(s);
	if (!empty.length) return s;
	const cell = empty[pickIndex(empty.length, random)];
	addRisingDie(s, cell.x, cell.y, ++s.trial.serial, now, random);
	return s;
}
export function tickTrial(state: State, now: number, random = Math.random): State {
	if (!state.trial || state.trial.over) return state;
	let s = settle(state, now);
	match(s, now);
	updateLevel(s, now);
	const due = s.trial!.warnings.filter((w) => w.appearsAt <= now);
	s.trial!.warnings = s.trial!.warnings.filter((w) => w.appearsAt > now);
	for (const warning of due)
		addRisingDie(s, warning.x, warning.y, warning.id, warning.appearsAt, random);
	if (
		s.dice.length === s.width * s.height &&
		!s.dice.some((d) => d.rising !== undefined && d.rising > now)
	)
		return finishTrial(s, now, 'full');
	if (now >= s.trial!.nextSpawn) s = queueSpawn(s, now, random);
	return s;
}
/** Accelerate only new growth, keeping sinking/combo time and the run clock unchanged. */
export function accelerateSpawns(state: State, extraMs: number): State {
	const s = clone(state);
	if (!s.trial || s.trial.over) return s;
	s.trial.nextSpawn -= extraMs;
	for (const warning of s.trial.warnings) warning.appearsAt -= extraMs;
	for (const die of s.dice) if (die.rising !== undefined) die.rising -= extraMs;
	return s;
}
export function finishTrial(state: State, now: number, reason: 'full' | 'ended' = 'ended'): State {
	const s = clone(state);
	if (s.trial) {
		s.trial.over = true;
		s.trial.endedAt = now;
		s.trial.reason = reason;
	}
	return s;
}
export function shiftTime(state: State, delta: number): State {
	const s = clone(state);
	for (const d of s.dice) {
		if (d.sinking !== undefined) d.sinking += delta;
		if (d.rising !== undefined) d.rising += delta;
		if (d.slide) d.slide.started += delta;
	}
	if (s.trial) {
		s.trial.nextSpawn += delta;
		s.trial.started += delta;
		for (const warning of s.trial.warnings) warning.appearsAt += delta;
		if (s.trial.endedAt !== undefined) s.trial.endedAt += delta;
	}
	return s;
}
