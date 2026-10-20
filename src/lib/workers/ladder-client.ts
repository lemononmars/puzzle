export function createLadderWorker() {
	let worker: Worker | undefined;
	let sequence = 0;
	const tasks = new Map<
		number,
		{ resolve: (value: any) => void; reject: (reason: Error) => void }
	>();
	function dispose() {
		worker?.terminate();
		worker = undefined;
		for (const task of tasks.values()) task.reject(new DOMException('Cancelled', 'AbortError'));
		tasks.clear();
	}
	function run(payload: {
		action: 'puzzle' | 'graph' | 'path';
		size?: number;
		seed?: number;
		start?: string;
		end?: string;
	}): Promise<any> {
		// A replacement puzzle/graph cancels stale CPU work, rather than queuing behind it.
		if (payload.action !== 'path' && tasks.size) dispose();
		if (!worker) {
			worker = new Worker(new URL('./ladder.worker.ts', import.meta.url), { type: 'module' });
			worker.onmessage = ({ data }) => {
				const task = tasks.get(data.id);
				if (!task) return;
				tasks.delete(data.id);
				if (data.error) task.reject(new Error(data.error));
				else task.resolve(data.result);
			};
			worker.onerror = () => {
				for (const task of tasks.values())
					task.reject(new Error('Could not load the word-ladder worker'));
				tasks.clear();
				worker?.terminate();
				worker = undefined;
			};
		}
		const id = ++sequence;
		return new Promise((resolve, reject) => {
			tasks.set(id, { resolve, reject });
			worker!.postMessage({ id, ...payload });
		});
	}
	return { run, dispose };
}
