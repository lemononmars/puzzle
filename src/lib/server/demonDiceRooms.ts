import { randomBytes } from 'node:crypto';
import {
	newBattle,
	advanceBattle,
	battleMove,
	releaseBattle,
	defaultBattleOptions,
	type BattleOptions,
	type DiceBattle,
	type Seat
} from '#lib/games/demonDiceBattle.js';
import { cleanAvatar, type Avatar } from '#lib/games/demonDiceAvatar.js';
type Member = {
	token: string;
	name: string;
	avatar: Avatar;
	ready: boolean;
	lastSeen: number;
	seq: number;
	left: boolean;
};
type Room = {
	code: string;
	members: [Member, Member | null];
	options: BattleOptions;
	match: DiceBattle | null;
	created: number;
	updated: number;
};
const globalRooms = globalThis as typeof globalThis & { __demonDiceRooms?: Map<string, Room> };
const rooms = (globalRooms.__demonDiceRooms ??= new Map<string, Room>());
const name = (value: unknown) =>
	typeof value === 'string' ? value.trim().slice(0, 18) || 'Pip' : 'Pip';
const member = (body: any, now: number): Member => ({
	token: randomBytes(24).toString('hex'),
	name: name(body.name),
	avatar: cleanAvatar(body.avatar),
	ready: false,
	lastSeen: now,
	seq: 0,
	left: false
});
function options(value: any): BattleOptions {
	return {
		goal: [3, 4, 5].includes(value?.goal) ? value.goal : 4,
		minutes: [0, 3, 5].includes(value?.minutes) ? value.minutes : 3,
		size: value?.size === 6 ? 6 : 7,
		kind: ['normal', 'wood', 'ice', 'stone', 'mixed'].includes(value?.kind) ? value.kind : 'normal'
	};
}
export class RoomError extends Error {
	constructor(
		message: string,
		public status = 400
	) {
		super(message);
	}
}
export function createDiceRoom(body: any, now = Date.now()) {
	for (const [code, room] of rooms) if (now - room.updated > 45 * 60000) rooms.delete(code);
	if (rooms.size >= 500) throw new RoomError('The garden is busy. Please try again shortly.', 503);
	let code = '';
	do {
		code = randomBytes(5).toString('hex').slice(0, 8).toUpperCase();
	} while (rooms.has(code));
	const host = member(body, now);
	const room: Room = {
		code,
		members: [host, null],
		options: options(body.options),
		match: null,
		created: now,
		updated: now
	};
	rooms.set(code, room);
	return { token: host.token, ...publicRoom(room, 0, now) };
}
function findRoom(code: string, now: number) {
	if (!/^[A-F0-9]{8}$/.test(code)) throw new RoomError('Invalid room code.', 404);
	const room = rooms.get(code);
	if (!room || now - room.updated > 45 * 60000)
		throw new RoomError('This room has expired or does not exist.', 404);
	return room;
}
function authenticate(room: Room, token: string | null): Seat {
	const seat = room.members.findIndex((p) => p?.token === token && !p.left);
	if (seat !== 0 && seat !== 1) throw new RoomError('Join this room first.', 401);
	return seat;
}
function publicRoom(room: Room, seat: Seat, now: number) {
	return {
		code: room.code,
		seat,
		nextSeq: room.members[seat]!.seq + 1,
		serverTime: now,
		options: room.options,
		players: room.members.map((p, index) =>
			p
				? {
						seat: index,
						name: p.name,
						avatar: p.avatar,
						ready: p.ready,
						connected: !p.left && now - p.lastSeen < 12000
					}
				: null
		),
		match: room.match
	};
}
function advanceRoom(room: Room, now: number) {
	if (room.match?.phase === 'playing') {
		room.match = advanceBattle(room.match, now);
		for (const seat of [0, 1] as const) {
			const p = room.members[seat];
			if (p && (p.left || now - p.lastSeen > 30000) && room.match.phase === 'playing') {
				room.match.phase = 'finished';
				room.match.winner = seat === 0 ? 1 : 0;
				room.match.reason = 'opponent disconnected';
			}
		}
	}
}
export function getDiceRoom(code: string, token: string | null, now = Date.now()) {
	const room = findRoom(code, now),
		seat = authenticate(room, token);
	room.members[seat]!.lastSeen = now;
	room.updated = now;
	advanceRoom(room, now);
	return publicRoom(room, seat, now);
}
export function actDiceRoom(code: string, token: string | null, body: any, now = Date.now()) {
	const room = findRoom(code, now);
	if (body.action === 'join') {
		if (room.members[0].left) throw new RoomError('The host has left. Create a new room.', 410);
		if (room.match?.phase === 'playing')
			throw new RoomError('This match has already started.', 409);
		if (room.members[1] && !room.members[1].left && now - room.members[1].lastSeen < 30000)
			throw new RoomError('This two-player room is full.', 409);
		const guest = member(body, now);
		room.members[1] = guest;
		room.match = null;
		room.members[0].ready = false;
		room.updated = now;
		return { token: guest.token, ...publicRoom(room, 1, now) };
	}
	const seat = authenticate(room, token),
		p = room.members[seat]!;
	p.lastSeen = now;
	room.updated = now;
	advanceRoom(room, now);
	switch (body.action) {
		case 'ready':
			if (room.match?.phase === 'playing')
				throw new RoomError('The match is already running.', 409);
			p.ready = Boolean(body.ready);
			break;
		case 'avatar':
			if (room.match?.phase === 'playing') throw new RoomError('Customize between rounds.', 409);
			p.avatar = cleanAvatar(body.avatar);
			p.name = name(body.name);
			break;
		case 'start':
			if (seat !== 0) throw new RoomError('Only the host can start the match.', 403);
			if (room.match?.phase === 'playing') throw new RoomError('A match is already running.', 409);
			if (
				!room.members[1] ||
				!room.members.every((p) => p?.ready && !p.left && now - p.lastSeen < 12000)
			)
				throw new RoomError('Both players must be connected and ready.', 409);
			room.match = newBattle(room.members as [Member, Member], room.options, now);
			break;
		case 'move':
			if (!room.match || room.match.phase !== 'playing') break;
			if (!['up', 'down', 'left', 'right'].includes(body.direction))
				throw new RoomError('Invalid direction.');
			if (!Number.isSafeInteger(body.seq) || body.seq <= p.seq) break;
			p.seq = body.seq;
			room.match = battleMove(room.match, seat, body.direction, Boolean(body.holding), now);
			break;
		case 'release':
			if (room.match) releaseBattle(room.match, seat);
			break;
		case 'lobby':
			if (seat !== 0) throw new RoomError('Only the host can reset the room.', 403);
			if (room.match?.phase === 'playing') throw new RoomError('Finish the match first.', 409);
			room.match = null;
			room.members.forEach((p) => {
				if (p) p.ready = false;
			});
			break;
		case 'leave':
			p.left = true;
			p.ready = false;
			advanceRoom(room, now);
			break;
		default:
			throw new RoomError('Unknown room action.');
	}
	return publicRoom(room, seat, now);
}
export type DiceRoomView = ReturnType<typeof getDiceRoom>;
