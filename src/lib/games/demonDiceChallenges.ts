import { clone, type State } from './devilDice.js';
import type { Tutorial } from './devilDiceTutorials.js';
import designed from './demonDicePuzzleData.json';
export type DesignedChallenge = Tutorial & {
	maxMoves: number;
	design: {
		family: string;
		insight: string;
		temptation: string;
		searchStates: number;
		verifiedDiceMoved: number;
		searchModel: string;
	};
};
export const challengePuzzles = designed as DesignedChallenge[];
export const startChallenge = (index: number): State =>
	clone({ ...challengePuzzles[index].state, moves: 0, cleared: 0, score: 0, chainSerial: 0 });
