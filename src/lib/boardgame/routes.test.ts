import { describe, it, expect } from 'vitest';
import { isGameRoom } from './routes';

describe('Web game room layout', () => {
	it('uses the table layout only inside board game rooms', () => {
		for (const game of ['pakklongboard', 'pakklongdice', 'sky-scan', 'game']) {
			expect(isGameRoom(`/web-game/${game}/ROOM1`)).toBe(true);
			expect(isGameRoom(`/web-game/${game}/rules`)).toBe(false);
		}
		for (const path of [
			'/web-game',
			'/web-game/pakklongboard',
			'/web-game/pips-plot/battle',
			'/web-game/four-lines'
		]) {
			expect(isGameRoom(path)).toBe(false);
		}
	});
});
