import { search } from './thai-search-engine.js';
import frequencyUrl from '../utils/dict_pythainlp.json?url';
let frequencyPromise: Promise<{ map: Record<string, number>; quartiles: number[] }> | undefined;
function frequenciesForResults() {
	return (frequencyPromise ??= fetch(frequencyUrl)
		.then((response) => {
			if (!response.ok) throw new Error('Could not load frequency data');
			return response.json();
		})
		.then((map) => {
			const values = Object.values(map)
				.filter((value): value is number => typeof value === 'number' && value > 0)
				.sort((a, b) => a - b);
			return {
				map,
				quartiles: [0.25, 0.5, 0.75].map((q) => values[Math.floor(values.length * q)] ?? 0)
			};
		}));
}
const controllers = new Map<number, AbortController>();
self.onmessage = async (event: MessageEvent) => {
	const { id, query, includeWiki, strict, frequencies, cancel } = event.data;
	if (cancel) {
		controllers.get(id)?.abort();
		return;
	}
	const controller = new AbortController();
	controllers.set(id, controller);
	const progress = { count: 0 };
	const timer = setInterval(() => self.postMessage({ id, progress: progress.count }), 150);
	try {
		const result = await search(query, includeWiki, controller.signal, progress, strict);
		let frequencyData;
		if (frequencies && !controller.signal.aborted) {
			const frequency = await frequenciesForResults();
			frequencyData = {
				quartiles: frequency.quartiles,
				values: Object.fromEntries(
					result.results.map((word) => [
						word,
						frequency.map[word.split(' ')[0]] ?? frequency.map[word] ?? 0
					])
				)
			};
		}
		self.postMessage({ id, result: { ...result, frequencyData } });
	} catch (error) {
		self.postMessage({ id, error: error instanceof Error ? error.message : 'Search failed' });
	} finally {
		clearInterval(timer);
		controllers.delete(id);
	}
};
