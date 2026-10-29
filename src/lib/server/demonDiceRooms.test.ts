import { describe, it, expect } from 'vitest';
import { createDiceRoom, actDiceRoom, getDiceRoom } from './demonDiceRooms.js';
describe('Authoritative online rooms', () => {
	it('starts a fresh bot round from the finished result', () => {
		const host = createDiceRoom({ opponent: 'bot' }, 1000);
		const ended = getDiceRoom(host.code, host.token, 181001);
		expect(ended.match?.phase).toBe('finished');
		const next = actDiceRoom(host.code, host.token, { action: 'start' }, 181002);
		expect(next.match?.phase).toBe('playing');
		expect(next.match?.premiums).toEqual(Array(6).fill(null));
		expect(next.match?.endsAt).toBe(361002);
	});
	it('starts a bot immediately, advances it without guest polling, and keeps it connected', () => {
		const host = createDiceRoom({ name: 'Pip', opponent: 'bot', options: { minutes: 0 } }, 1000);
		expect(host.opponent).toBe('bot');
		expect(host.match?.phase).toBe('playing');
		expect(() => actDiceRoom(host.code, null, { action: 'join' }, 1200)).toThrow('solo');
		const before = host.match!.players[1].position;
		const after = getDiceRoom(host.code, host.token, 2000);
		expect(after.match!.players[1].position).not.toEqual(before);
		const later = getDiceRoom(host.code, host.token, 32000);
		expect(later.players[1]?.connected).toBe(true);
		expect(later.match?.reason).not.toBe('opponent disconnected');
		expect(JSON.stringify(later)).not.toContain(host.token);
	});
	it('joins two separate players, protects host actions, and never exposes access tokens', () => {
		const host = createDiceRoom({ name: 'Host' }, 1000);
		const guest = actDiceRoom(
			host.code,
			null,
			{ action: 'join', name: 'Guest' },
			1100
		) as ReturnType<typeof createDiceRoom>;
		expect(() => actDiceRoom(host.code, guest.token, { action: 'start' }, 1200)).toThrow(
			'Only the host'
		);
		expect(() => getDiceRoom(host.code, 'fake', 1200)).toThrow('Join');
		expect(() => actDiceRoom(host.code, null, { action: 'join' }, 1200)).toThrow('full');
		actDiceRoom(host.code, host.token, { action: 'ready', ready: true }, 1300);
		actDiceRoom(host.code, guest.token, { action: 'ready', ready: true }, 1300);
		const playing = actDiceRoom(host.code, host.token, { action: 'start' }, 1400);
		expect(playing.match?.phase).toBe('playing');
		expect(JSON.stringify(getDiceRoom(host.code, guest.token, 1500))).not.toContain(host.token);
		expect(JSON.stringify(getDiceRoom(host.code, host.token, 1500))).not.toContain(guest.token);
		const after = actDiceRoom(
			host.code,
			host.token,
			{ action: 'move', direction: 'up', holding: false, seq: 1 },
			1600
		);
		const duplicate = actDiceRoom(
			host.code,
			host.token,
			{ action: 'move', direction: 'up', holding: false, seq: 1 },
			2100
		);
		expect(duplicate.match?.board.moves).toBe(after.match?.board.moves);
		const over = getDiceRoom(host.code, host.token, 32000);
		expect(over.match?.reason).toBe('opponent disconnected');
		expect(over.match?.winner).toBe(0);
	});
});
