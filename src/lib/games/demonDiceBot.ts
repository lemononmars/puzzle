import { battleMove, ownedPatterns, type DiceBattle } from './demonDiceBattle.js';
import { type Direction } from './devilDice.js';

const directions: Direction[] = ['up', 'right', 'down', 'left'];
export const botStepMs = 650;
export function botPosition(b: DiceBattle) {
	const p = b.players[1].position;
	return `${p.x},${p.y},${p.riding}`;
}

// Small, bounded lookahead uses the same legal moves as the human. It values
// premiums first, then matching opportunities, and avoids retracing its steps.
export function chooseBotMove(battle: DiceBattle, now: number, recent: string[] = []): Direction {
	function value(b: DiceBattle) {
		if (b.phase === 'finished') return b.winner === 1 ? 10000 : b.winner === 0 ? -10000 : 0;
		let score = 150 * ownedPatterns(b, 1) - 100 * ownedPatterns(b, 0) + b.players[1].points * 0.2;
		const p = b.players[1].position;
		const die = b.board.dice.find((d) => d.x === p.x && d.y === p.y);
		if (p.riding && die && !die.sinking) {
			let nearest = 20;
			for (const other of b.board.dice) {
				if (other.id === die.id || other.rising) continue;
				if (other.top === die.top)
					nearest = Math.min(nearest, Math.abs(other.x - die.x) + Math.abs(other.y - die.y));
			}
			score += 8 - nearest;
		}
		score -= recent.filter((pos) => pos === botPosition(b)).length * 4;
		return score;
	}
	function search(b: DiceBattle, time: number, depth: number): number {
		const current = value(b);
		if (!depth || b.phase !== 'playing') return current;
		return Math.max(
			...directions.map((direction) => {
				const next = battleMove(b, 1, direction, true, time);
				return 0.15 * current + 0.85 * search(next, time + botStepMs, depth - 1);
			})
		);
	}
	let best = -Infinity,
		chosen = directions[Math.floor(now / botStepMs) % 4];
	for (const direction of [
		...directions.slice(directions.indexOf(chosen)),
		...directions.slice(0, directions.indexOf(chosen))
	]) {
		const next = battleMove(battle, 1, direction, true, now);
		const moved =
			botPosition(next) !== botPosition(battle) || next.board.moves !== battle.board.moves;
		const score = search(next, now + botStepMs, 2) - (moved ? 0 : 2);
		if (score > best) {
			best = score;
			chosen = direction;
		}
	}
	return chosen;
}
