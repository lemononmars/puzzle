import { roll, type Faces, type State, type Kind } from './devilDice.js';
import type { Tutorial } from './devilDiceTutorials.js';
import { makeDie } from './devilDiceTutorials.js';
export type DiceAxis = 'x' | 'y' | 'z';
export function rotateWorkshopDie(faces: Faces, axis: DiceAxis): Faces {
	if (axis === 'x') return roll(faces, 'up');
	if (axis === 'z') return roll(faces, 'right');
	return { top: faces.top, north: 7 - faces.east, east: faces.north };
}

export type WorkshopPuzzle = {
	format: 'pips-plot-puzzle';
	version: 1;
	title: string;
	hint: string;
	maxMoves: number;
	field: Tutorial['state'];
};
const kinds: Kind[] = ['normal', 'wood', 'ice', 'stone', 'metal'];
const integer = (v: unknown, min: number, max: number) =>
	typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
export function readWorkshopPuzzle(value: unknown): WorkshopPuzzle {
	const p = value as WorkshopPuzzle;
	if (!p || p.format !== 'pips-plot-puzzle' || p.version !== 1)
		throw Error('Choose a Pip’s Plot puzzle JSON (version 1).');
	if (typeof p.title !== 'string' || !p.title.trim() || p.title.length > 80)
		throw Error('Give the puzzle a name of 1–80 characters.');
	if (typeof p.hint !== 'string' || p.hint.length > 500)
		throw Error('Keep the hint under 500 characters.');
	if (!integer(p.maxMoves, 1, 999)) throw Error('Moves must be a whole number from 1 to 999.');
	const f = p.field;
	if (!f || !integer(f.width, 2, 10) || !integer(f.height, 2, 10))
		throw Error('The field must be 2–10 rows and columns.');
	const position = (v: { x: number; y: number }) =>
		v && integer(v.x, 0, f.width - 1) && integer(v.y, 0, f.height - 1);
	if (!Array.isArray(f.removedTiles ?? []) || (f.removedTiles?.length ?? 0) > 100)
		throw Error('Invalid missing tiles.');
	const holes = new Set<string>();
	const removedTiles = (f.removedTiles ?? []).map((tile) => {
		if (!position(tile) || holes.has(`${tile.x},${tile.y}`))
			throw Error('Missing tiles must be unique positions inside the field.');
		holes.add(`${tile.x},${tile.y}`);
		return { x: tile.x, y: tile.y };
	});
	if (!Array.isArray(f.dice) || f.dice.length < 1 || f.dice.length > 100)
		throw Error('Add at least one die (up to 100).');
	const occupied = new Set<string>();
	const dice = f.dice.map((d, index) => {
		const key = `${d.x},${d.y}`;
		if (!position(d) || holes.has(key) || occupied.has(key))
			throw Error('Each die needs its own floor tile.');
		if (
			!kinds.includes(d.kind) ||
			![d.top, d.north, d.east].every((n) => integer(n, 1, 6)) ||
			new Set([d.top, 7 - d.top, d.north, 7 - d.north, d.east, 7 - d.east]).size !== 6
		)
			throw Error('Dice must have valid materials and faces, with opposite sides totaling seven.');
		occupied.add(key);
		return makeDie(index + 1, d.x, d.y, d.top, d.kind, d.east, d.north);
	});
	if (
		!position(f.player) ||
		holes.has(`${f.player.x},${f.player.y}`) ||
		typeof f.player.riding !== 'boolean' ||
		f.player.riding !== occupied.has(`${f.player.x},${f.player.y}`)
	)
		throw Error('Place Pip on a floor tile or on top of a die.');
	return {
		format: 'pips-plot-puzzle',
		version: 1,
		title: p.title.trim(),
		hint: p.hint,
		maxMoves: p.maxMoves,
		field: {
			width: f.width,
			height: f.height,
			removedTiles,
			dice,
			player: { x: f.player.x, y: f.player.y, riding: f.player.riding },
			sinkDuration: 6000
		}
	};
}
export function workshopState(p: WorkshopPuzzle): State {
	return { ...JSON.parse(JSON.stringify(p.field)), moves: 0, score: 0, cleared: 0, chainSerial: 0 };
}
export function editWorkshopAxis(
	field: WorkshopPuzzle['field'],
	axis: 'x' | 'y',
	index: number,
	add: boolean
): WorkshopPuzzle['field'] {
	const next = JSON.parse(JSON.stringify(field)) as WorkshopPuzzle['field'];
	const dimension = axis === 'x' ? 'width' : 'height';
	const length = next[dimension];
	if (!Number.isInteger(index) || index < 0 || index >= length + (add ? 1 : 0))
		throw Error('Choose a row or column inside the field.');
	if ((add && length >= 10) || (!add && length <= 2)) return next;
	next[dimension] += add ? 1 : -1;
	const shift = <T extends { x: number; y: number }>(items: T[]) =>
		items
			.filter((p) => add || p[axis] !== index)
			.map((p) => ({ ...p, [axis]: p[axis] >= index ? p[axis] + (add ? 1 : -1) : p[axis] }));
	next.dice = shift(next.dice);
	next.removedTiles = shift(next.removedTiles ?? []);
	const player = {
		...next.player,
		[axis]:
			next.player[axis] >= index
				? Math.min(next[dimension] - 1, next.player[axis] + (add ? 1 : -1))
				: next.player[axis]
	};
	const floors: { x: number; y: number }[] = [];
	for (let y = 0; y < next.height; y++)
		for (let x = 0; x < next.width; x++)
			if (!next.removedTiles.some((p) => p.x === x && p.y === y)) floors.push({ x, y });
	if (!floors.length) throw Error('Keep at least one floor tile for Pip.');
	floors.sort(
		(a, b) =>
			Math.abs(a.x - player.x) +
			Math.abs(a.y - player.y) -
			Math.abs(b.x - player.x) -
			Math.abs(b.y - player.y)
	);
	next.player = {
		...floors[0],
		riding: next.dice.some((d) => d.x === floors[0].x && d.y === floors[0].y)
	};
	return next;
}
export function workshopChallenge(p: WorkshopPuzzle): Tutorial {
	return {
		id: 'Workshop',
		set: 'Workshop',
		title: p.title,
		lesson: '',
		hint: p.hint || 'Clear every die within the move allowance.',
		maxMoves: p.maxMoves,
		solution: [],
		state: p.field
	};
}
export function encodeWorkshopPuzzle(puzzle: WorkshopPuzzle): string {
	const bytes = new TextEncoder().encode(JSON.stringify(readWorkshopPuzzle(puzzle)));
	return btoa(String.fromCharCode(...bytes))
		.replaceAll('+', '-')
		.replaceAll('/', '_')
		.replaceAll('=', '');
}
export function decodeWorkshopPuzzle(encoded: string): WorkshopPuzzle {
	if (encoded.length > 24000 || !/^[A-Za-z0-9_-]+$/.test(encoded))
		throw Error('This puzzle link is invalid or too large.');
	try {
		const bytes = Uint8Array.from(atob(encoded.replaceAll('-', '+').replaceAll('_', '/')), (c) =>
			c.charCodeAt(0)
		);
		return readWorkshopPuzzle(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)));
	} catch (error) {
		throw Error(error instanceof Error ? error.message : 'This puzzle link could not be opened.');
	}
}
