import { clone, type State } from './devilDice.js';
import type { Tutorial } from './devilDiceTutorials.js';
import data from './pipsPlotRandomData.json';

/** Original, reproducible puzzles; these are not the original Devil Dice boards. */
export const randomPuzzles = data as Tutorial[];
export const startRandom = (index: number): State =>
	clone({ ...randomPuzzles[index].state, moves: 0, cleared: 0, score: 0, chainSerial: 0 });
