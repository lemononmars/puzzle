import { clone, type State } from './devilDice.js';
import type { Tutorial } from './devilDiceTutorials.js';
import data from './demonDiceRetroData.json';

export type RetroPuzzle = Tutorial & {
	maxMoves: number;
	sourceStage: number;
	sourceTimes: number[];
};
export const retroPuzzles = data as RetroPuzzle[];
export const startRetro = (index: number): State =>
	clone({ ...retroPuzzles[index].state, moves: 0, cleared: 0, score: 0, chainSerial: 0 });
