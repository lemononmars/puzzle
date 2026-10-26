import {
	at,
	clone,
	move,
	heldMove,
	settle,
	tickTrial,
	startTrial,
	type State,
	type Direction,
	type Kind,
	EDGE_HOLD_MS
} from './devilDice.js';
import { makeDie } from './devilDiceTutorials.js';
import { defaultAvatar, type Avatar } from './demonDiceAvatar.js';
export type Seat = 0 | 1;
export type BattleOptions = {
	goal: 3 | 4 | 5;
	minutes: 0 | 3 | 5;
	kind: 'normal' | 'wood' | 'ice' | 'stone' | 'mixed';
	size: 6 | 7;
};
export type BattlePlayer = {
	name: string;
	avatar: Avatar;
	position: State['player'];
	points: number;
	ready: boolean;
	lastSeen: number;
	cooldown: number;
	held?: Direction;
	heldAt?: number;
};
export type DiceBattle = {
	board: State;
	players: [BattlePlayer, BattlePlayer];
	premiums: (Seat | null)[];
	options: BattleOptions;
	phase: 'playing' | 'finished';
	winner: Seat | null;
	reason: string;
	endsAt: number | null;
	slideOwners: Record<number, Seat>;
	oneOwners: Record<number, Seat>;
	revision: number;
	updatedAt: number;
};
export const defaultBattleOptions: BattleOptions = { goal: 4, minutes: 3, kind: 'normal', size: 7 };
export function newBattle(
	players: [Pick<BattlePlayer, 'name' | 'avatar'>, Pick<BattlePlayer, 'name' | 'avatar'>],
	options: BattleOptions,
	now: number,
	random = Math.random
): DiceBattle {
	const board = startTrial(now, options.kind, random);
	board.width = board.height = options.size;
	board.dice = [];
	const n = options.size;
	let id = 0;
	for (let y = 0; y < n; y++)
		for (let x = 0; x < n; x++) {
			if ((x + y) % 2 !== 0) continue;
			const top = 2 + Math.floor(random() * 5),
				east = [1, 2, 3, 4, 5, 6].filter((v) => v !== top && v !== 7 - top)[
					Math.floor(random() * 4)
				];
			const kind: Kind =
				options.kind === 'mixed'
					? (['normal', 'wood', 'ice', 'stone'] as Kind[])[id % 4]
					: options.kind;
			board.dice.push(makeDie(++id, x, y, top, kind, east));
		}
	// Sparse checkerboard starts leave rolling lanes; both players begin on dice.
	board.trial!.serial = id;
	board.trial!.nextSpawn = now + 5000;
	board.trial!.started = now;
	board.trial!.warnings = [];
	const supports = [
		board.dice.find((d) => d.y === n - 1) ?? board.dice[0],
		[...board.dice].reverse().find((d) => d.y === 0) ?? board.dice.at(-1)!
	];
	return {
		board,
		players: players.map((p, i) => ({
			name: p.name,
			avatar: { ...p.avatar },
			position: { x: supports[i].x, y: supports[i].y, riding: true },
			points: 0,
			ready: true,
			lastSeen: now,
			cooldown: 0
		})) as [BattlePlayer, BattlePlayer],
		premiums: Array(6).fill(null),
		options,
		phase: 'playing',
		winner: null,
		reason: '',
		endsAt: options.minutes ? now + options.minutes * 60000 : null,
		slideOwners: {},
		oneOwners: {},
		revision: 1,
		updatedAt: now
	};
}
export function ownedPatterns(battle: DiceBattle, seat: Seat) {
	return battle.premiums.filter((owner) => owner === seat).length;
}
function checkWinner(b: DiceBattle) {
	if (b.phase !== 'playing') return;
	for (const seat of [0, 1] as const)
		if (ownedPatterns(b, seat) >= b.options.goal) {
			b.phase = 'finished';
			b.winner = seat;
			b.reason = 'patterns';
		}
}
function credit(b: DiceBattle, before: State, after: State, seat: Seat, triggers?: number[]) {
	const changed = after.dice.filter(
		(d) =>
			d.sinking !== undefined &&
			before.dice.some(
				(old) => old.id === d.id && (old.sinking === undefined || old.chainStep !== d.chainStep)
			)
	);
	const chains = new Set(changed.filter((d) => d.top > 1).map((d) => d.chain));
	for (const chain of chains) {
		const group = after.dice.filter((d) => d.chain === chain);
		if (!group.length) continue;
		if (triggers && !group.some((die) => triggers.includes(die.id))) continue;
		const face = group[0].top;
		b.premiums[face - 1] = seat;
		b.players[seat].points += face * group.length * ((group[0].chainStep ?? 0) + 1);
	}
	for (const die of changed.filter(
		(d) =>
			d.top === 1 &&
			(!triggers || triggers.some((id) => after.dice.find((next) => next.id === id)?.top === 1))
	)) {
		b.premiums[0] = seat;
		b.oneOwners[die.id] = seat;
	}
	checkWinner(b);
}
export function advanceBattle(state: DiceBattle, now: number, random = Math.random): DiceBattle {
	if (state.phase === 'finished') return state;
	const b = JSON.parse(JSON.stringify(state)) as DiceBattle;
	const before = b.board;
	const arrivals = [
		...new Set(
			before.dice
				.filter((d) => d.slide && d.slide.started + d.slide.duration <= now)
				.map((d) => d.slide!.started + d.slide!.duration)
		)
	].sort((a, c) => a - c);
	let board = before;
	for (const time of arrivals) {
		const seats = [
			...new Set(
				board.dice
					.filter((d) => d.slide && d.slide.started + d.slide.duration === time)
					.map((d) => b.slideOwners[d.id])
					.filter((s) => s !== undefined)
			)
		];
		const next = settle(board, time);
		for (const seat of seats)
			credit(
				b,
				board,
				next,
				seat,
				board.dice
					.filter(
						(die) =>
							die.slide &&
							die.slide.started + die.slide.duration === time &&
							b.slideOwners[die.id] === seat
					)
					.map((die) => die.id)
			);
		board = next;
	}
	const next = tickTrial(board, now, random);
	for (const die of before.dice)
		if (
			die.top === 1 &&
			!next.dice.some((d) => d.id === die.id) &&
			b.oneOwners[die.id] !== undefined
		) {
			b.players[b.oneOwners[die.id]].points++;
			delete b.oneOwners[die.id];
		}
	b.board = next;
	for (const p of b.players) {
		const support = at(next, p.position.x, p.position.y);
		if (!support) p.position.riding = false;
		else if (support.rising !== undefined && support.rising > now) p.position.riding = true;
	}
	b.updatedAt = now;
	b.revision++;
	if (b.phase === 'playing' && ((b.endsAt !== null && now >= b.endsAt) || next.trial?.over)) {
		const counts = [ownedPatterns(b, 0), ownedPatterns(b, 1)];
		b.phase = 'finished';
		b.winner = counts[0] === counts[1] ? null : counts[0] > counts[1] ? 0 : 1;
		b.reason = next.trial?.over ? 'field full' : 'time';
	}
	return b;
}
export function battleMove(
	state: DiceBattle,
	seat: Seat,
	direction: Direction,
	holding: boolean,
	now: number
): DiceBattle {
	let b = advanceBattle(state, now);
	if (b.phase !== 'playing') return b;
	const p = b.players[seat],
		other = b.players[seat === 0 ? 1 : 0];
	if (p.held !== direction) {
		p.held = direction;
		p.heldAt = now;
	}
	if (now < p.cooldown) return b;
	const before = { ...b.board, player: { ...p.position } };
	let after = move(before, direction, false, now);
	if (!after && holding && now - (p.heldAt ?? now) >= EDGE_HOLD_MS)
		after = heldMove(before, direction, EDGE_HOLD_MS, now);
	if (!after) return b;
	const target = after.player;
	if (target.x === other.position.x && target.y === other.position.y) {
		const rolled =
			p.position.riding &&
			after.dice.some((d) => {
				const old = at(before, p.position.x, p.position.y);
				return old?.id === d.id && (d.x !== old.x || d.y !== old.y);
			});
		if (!rolled || other.position.riding) return b;
		const die = at(after, target.x, target.y)!;
		if (b.premiums[die.top - 1] === (seat === 0 ? 1 : 0)) b.premiums[die.top - 1] = seat;
		if (die.kind === 'stone') {
			b.phase = 'finished';
			b.winner = seat;
			b.reason = 'stone crush';
		}
		const safe = after.dice.find(
			(d) =>
				d.sinking === undefined &&
				!(d.rising !== undefined && d.rising > now) &&
				(d.x !== target.x || d.y !== target.y)
		);
		other.position = safe ? { x: safe.x, y: safe.y, riding: true } : { x: 0, y: 0, riding: false };
	}
	p.position = { ...after.player };
	p.cooldown = now + 420;
	p.lastSeen = now;
	b.board = after;
	for (const die of after.dice)
		if (die.slide && !before.dice.find((d) => d.id === die.id)?.slide) b.slideOwners[die.id] = seat;
	credit(b, before, after, seat);
	b.revision++;
	return b;
}
export function releaseBattle(state: DiceBattle, seat: Seat) {
	delete state.players[seat].held;
	delete state.players[seat].heldAt;
}
