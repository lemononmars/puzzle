import { describe, it, expect } from 'vitest';
import { chooseBotMove } from './demonDiceBot.js';
import { battleMove, newBattle, defaultBattleOptions } from './demonDiceBattle.js';
import { defaultAvatar } from './demonDiceAvatar.js';
import { makeDie } from './devilDiceTutorials.js';

describe('Battle bot', () => {
	it('chooses a legal match to steal a premium without mutating the live board', () => {
		const b = newBattle(
			[
				{ name: 'Pip', avatar: defaultAvatar },
				{ name: 'Fern', avatar: defaultAvatar }
			],
			defaultBattleOptions,
			0
		);
		b.board.dice = [makeDie(1, 1, 2), makeDie(2, 3, 2)];
		b.players[1].position = { x: 0, y: 2, riding: false };
		b.players[0].position = { x: 6, y: 6, riding: false };
		b.premiums[1] = 0;
		const saved = JSON.stringify(b);
		const direction = chooseBotMove(b, 1000);
		expect(direction).toBe('right');
		expect(JSON.stringify(b)).toBe(saved);
		expect(battleMove(b, 1, direction, true, 1000).premiums[1]).toBe(1);
	});
});
