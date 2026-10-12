import type { TheChaseQuestion } from './types';
import { PACK1_QUESTIONS } from './data/pack1';
import { PACK2_QUESTIONS } from './data/pack2';
import { PACK3_QUESTIONS } from './data/pack3';
import { PACK4_QUESTIONS } from './data/pack4';
import { PACK5_QUESTIONS } from './data/pack5';

export const THE_CHASE_DATABASE: TheChaseQuestion[] = [
	...PACK1_QUESTIONS,
	...PACK2_QUESTIONS,
	...PACK3_QUESTIONS,
	...PACK4_QUESTIONS,
	...PACK5_QUESTIONS
];

export function getChaseQuestions(options?: {
	count?: number;
	category?: string;
	excludeIds?: number[];
	pack?: number;
}): TheChaseQuestion[] {
	const packs: Record<number, TheChaseQuestion[]> = {
		1: PACK1_QUESTIONS,
		2: PACK2_QUESTIONS,
		3: PACK3_QUESTIONS,
		4: PACK4_QUESTIONS,
		5: PACK5_QUESTIONS
	};
	let pool =
		typeof options?.pack === 'number' ? [...(packs[options.pack] || [])] : [...THE_CHASE_DATABASE];

	if (options?.category && options.category !== 'all') {
		pool = pool.filter((q) => q.category === options.category);
	}

	if (options?.excludeIds && options.excludeIds.length > 0) {
		const excluded = new Set(options.excludeIds);
		pool = pool.filter((q) => !excluded.has(q.id));
	}

	// Fisher-Yates shuffle
	for (let i = pool.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[pool[i], pool[j]] = [pool[j], pool[i]];
	}

	const count = options?.count ?? 10;
	return pool.slice(0, count);
}
