type ProgressMode = 'tutorials' | 'puzzles';
const key = (mode: ProgressMode) =>
	`demon-dice.completed.${mode}.${mode === 'puzzles' ? 'v3' : 'v1'}`;
export function loadTutorialBest(storage: Pick<Storage, 'getItem'>): Record<string, number> {
	try {
		const value = JSON.parse(storage.getItem('demon-dice.tutorial-best.v1') ?? '{}');
		if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
		return Object.fromEntries(
			Object.entries(value).filter(
				([id, moves]) =>
					/^[A-E][1-5]$/.test(id) &&
					typeof moves === 'number' &&
					Number.isInteger(moves) &&
					moves >= 0
			)
		) as Record<string, number>;
	} catch {
		return {};
	}
}
export function saveTutorialBest(storage: Pick<Storage, 'setItem'>, best: Record<string, number>) {
	try {
		storage.setItem('demon-dice.tutorial-best.v1', JSON.stringify(best));
	} catch {
		/* Session progress still works. */
	}
}
export function loadCompleted(
	storage: Pick<Storage, 'getItem'>,
	mode: ProgressMode,
	ids: readonly string[]
) {
	try {
		const value: unknown = JSON.parse(storage.getItem(key(mode)) ?? '[]');
		return Array.isArray(value)
			? [...new Set(value.filter((id): id is string => typeof id === 'string' && ids.includes(id)))]
			: [];
	} catch {
		return [];
	}
}
export function saveCompleted(
	storage: Pick<Storage, 'setItem'>,
	mode: ProgressMode,
	ids: string[]
) {
	try {
		storage.setItem(key(mode), JSON.stringify(ids));
	} catch {
		/* Progress remains available for this visit when storage is disabled. */
	}
}

