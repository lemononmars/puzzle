export * from './utils/thai-pattern.js';
type Result = {
	valid: boolean;
	count: number;
	results: string[];
	aborted?: boolean;
	frequencyData?: { quartiles: number[]; values: Record<string, number> };
};
let worker: Worker | undefined;
let nextId = 0;
const pending = new Map<
	number,
	{
		resolve: (result: Result) => void;
		reject: (error: Error) => void;
		progress?: { count: number };
		cleanup: () => void;
	}
>();
export function disposeDictionaryWorker() {
	worker?.terminate();
	worker = undefined;
	for (const task of pending.values()) {
		task.cleanup();
		task.reject(new DOMException('Search cancelled', 'AbortError'));
	}
	pending.clear();
}
function getWorker() {
	if (!worker) {
		worker = new Worker(new URL('./workers/thai-search.worker.ts', import.meta.url), {
			type: 'module'
		});
		worker.onmessage = ({ data }) => {
			const task = pending.get(data.id);
			if (!task) return;
			if ('progress' in data) {
				if (task.progress) task.progress.count = data.progress;
				return;
			}
			pending.delete(data.id);
			task.cleanup();
			if (data.error) task.reject(new Error(data.error));
			else task.resolve(data.result);
		};
		worker.onerror = () => {
			for (const task of pending.values()) {
				task.cleanup();
				task.reject(new Error('Could not load the word-search worker. Please try again.'));
			}
			pending.clear();
			worker?.terminate();
			worker = undefined;
		};
	}
	return worker;
}
export async function search(
	query: string,
	includeWiki: boolean,
	signal?: AbortSignal,
	progress?: { count: number },
	strict = true,
	frequencies = false
): Promise<Result> {
	if (signal?.aborted) throw new DOMException('Search cancelled', 'AbortError');
	if (typeof Worker === 'undefined') {
		const engine = await import('./workers/thai-search-engine.js');
		return engine.search(query, includeWiki, signal, progress, strict);
	}
	return new Promise((resolve, reject) => {
		const id = ++nextId;
		const abort = () => {
			pending.delete(id);
			signal?.removeEventListener('abort', abort);
			reject(new DOMException('Search cancelled', 'AbortError'));
			if (!pending.size) {
				worker?.terminate();
				worker = undefined;
			} else worker?.postMessage({ id, cancel: true });
		};
		pending.set(id, {
			resolve,
			reject,
			progress,
			cleanup: () => signal?.removeEventListener('abort', abort)
		});
		signal?.addEventListener('abort', abort, { once: true });
		try {
			getWorker().postMessage({ id, query, includeWiki, strict, frequencies });
		} catch (error) {
			pending.delete(id);
			signal?.removeEventListener('abort', abort);
			reject(error);
		}
	});
}
export const searchStrict = (
	query: string,
	includeWiki: boolean,
	signal?: AbortSignal,
	progress?: { count: number }
) => search(query, includeWiki, signal, progress, true);
export const solveSystem = search;
