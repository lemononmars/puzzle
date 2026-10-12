import fs from 'fs';
import path from 'path';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const projectRoot = process.cwd();
		const dirPath = path.join(projectRoot, 'src/lib/data/puzzles/spellingbee');

		const sevenMainPath = path.join(dirPath, '7letters.json');
		const sevenPrunedPath = path.join(dirPath, '7letters_pruned_q1.json');
		const dailyMainPath = path.join(dirPath, 'daily.json');
		const dailyPrunedPath = path.join(dirPath, 'daily_pruned_q1.json');

		// 1. Process 7letters
		const sevenMain: any[] = JSON.parse(fs.readFileSync(sevenMainPath, 'utf-8'));
		const sevenPruned: any[] = JSON.parse(fs.readFileSync(sevenPrunedPath, 'utf-8'));

		const sevenWithFreq1Plus = sevenPruned.filter((i) => (i.freq ?? 0) >= 1);
		const sevenFreqZero = sevenPruned.filter((i) => (i.freq ?? 0) < 1);

		// 2. Process daily
		const dailyMain: any[] = JSON.parse(fs.readFileSync(dailyMainPath, 'utf-8'));
		const dailyPruned: any[] = JSON.parse(fs.readFileSync(dailyPrunedPath, 'utf-8'));

		const dailyWithFreq1Plus = dailyPruned.filter((i) => (i.freq ?? 0) >= 1);
		const dailyFreqZero = dailyPruned.filter((i) => (i.freq ?? 0) < 1);

		return Response.json(
			{
				sevenLetters: {
					totalInPruned: sevenPruned.length,
					countFreq1Plus: sevenWithFreq1Plus.length,
					countFreq0: sevenFreqZero.length,
					samplesWithFreq1Plus: sevenWithFreq1Plus.slice(0, 10)
				},
				daily: {
					totalInPruned: dailyPruned.length,
					countFreq1Plus: dailyWithFreq1Plus.length,
					countFreq0: dailyFreqZero.length,
					samplesWithFreq1Plus: dailyWithFreq1Plus.slice(0, 10)
				}
			},
			{ status: 200 }
		);
	} catch (e: any) {
		return Response.json({ error: e.message }, { status: 500 });
	}
};
