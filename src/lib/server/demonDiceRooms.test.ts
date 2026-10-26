import { describe, it, expect } from 'vitest';
import { createDiceRoom, actDiceRoom, getDiceRoom } from './demonDiceRooms.js';
describe('Authoritative online rooms', () => {
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
