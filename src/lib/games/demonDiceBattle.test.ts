import { describe, it, expect } from 'vitest';
import {
	newBattle,
	battleMove,
	advanceBattle,
	ownedPatterns,
	defaultBattleOptions
} from './demonDiceBattle.js';
import { defaultAvatar } from './demonDiceAvatar.js';
import { makeDie } from './devilDiceTutorials.js';
const players = [
	{ name: 'Pip', avatar: defaultAvatar },
	{ name: 'Fern', avatar: { ...defaultAvatar, seed: 'rose' as const } }
] as const;
function fixture() {
	const b = newBattle([...players], defaultBattleOptions, 0, () => 0.1);
	b.board.width = 8;
	b.board.height = 4;
	b.board.dice = [makeDie(1, 1, 2), makeDie(2, 3, 2), makeDie(3, 4, 1)];
	b.players[0].position = { x: 0, y: 2, riding: false };
	b.players[1].position = { x: 4, y: 0, riding: false };
	return b;
}
describe('Online Dice Battle rules', () => {
	it('awards premiums and allows chain stealing with the wiki chain points', () => {
		const first = battleMove(fixture(), 0, 'right', false, 0);
		expect(first.premiums[1]).toBe(0);
		expect(first.players[0].points).toBe(4);
		expect(ownedPatterns(first, 0)).toBe(1);
		const stolen = battleMove(first, 1, 'down', false, 500);
		expect(stolen.premiums[1]).toBe(1);
		expect(stolen.players[1].points).toBe(12);
		expect(ownedPatterns(stolen, 0)).toBe(0);
	});
	it('counts a repeated value only once and wins at the configured distinct-pattern goal', () => {
		const b = fixture();
		b.options.goal = 3;
		b.premiums[2] = 0;
		b.premiums[3] = 0;
		const won = battleMove(b, 0, 'right', false, 0);
		expect(won.phase).toBe('finished');
		expect(won.winner).toBe(0);
	});
	it('steals the post-roll face on a crush and makes stone crushing an instant win', () => {
		for (const kind of ['normal', 'stone'] as const) {
			const b = fixture();
			b.premiums[1] = 1;
			b.board.dice = [makeDie(1, 1, 1, 3, kind, 5, 1), makeDie(2, 5, 3, 6)];
			b.players[0].position = { x: 1, y: 1, riding: true };
			b.players[1].position = { x: 2, y: 1, riding: false };
			const next = battleMove(b, 0, 'right', false, 0);
			expect(next.premiums[1]).toBe(0);
			expect(next.players[1].position).not.toMatchObject({ x: 2, y: 1 });
			expect(next.phase).toBe(kind === 'stone' ? 'finished' : 'playing');
		}
	});
	it('enforces input cooldown and resolves a time-limit tie as a draw', () => {
		const b = fixture();
		b.board.dice = [makeDie(1, 1, 1, 3)];
		b.players[0].position = { x: 1, y: 1, riding: true };
		b.players[1].position = { x: 7, y: 3, riding: false };
		const first = battleMove(b, 0, 'right', false, 0),
			blocked = battleMove(first, 0, 'right', false, 100);
		expect(blocked.players[0].position).toEqual(first.players[0].position);
		b.endsAt = 500;
		expect(advanceBattle(b, 501).winner).toBeNull();
		expect(advanceBattle(b, 501).reason).toBe('time');
	});
	it('does not invent a premium when crushing an opponent who does not own that face', () => {
		const b = fixture();
		b.board.dice = [makeDie(1, 1, 1, 3, 'normal', 5, 1), makeDie(2, 5, 3, 6)];
		b.players[0].position = { x: 1, y: 1, riding: true };
		b.players[1].position = { x: 2, y: 1, riding: false };
		const next = battleMove(b, 0, 'right', false, 0);
		expect(next.premiums[1]).toBeNull();
		expect(ownedPatterns(next, 0)).toBe(0);
	});
});
