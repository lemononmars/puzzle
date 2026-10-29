import letterFrequency from './countdownLetterFrequency.json';
export const TURN_MS = 15000;
export const TARGET_SCORE = 3;
export type Seat = 0 | 1;
export type WordWar = {
	pool: string[];
	reserve: string[];
	turn: Seat;
	challenger: Seat | null;
	phase: 'turn' | 'answer' | 'result' | 'finished';
	deadline: number;
	scores: [number, number];
	round: number;
	winner: Seat | null;
	message: string;
	revealed: string;
	lastAction: string;
};
export const alphabet = [...'กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮะาำิีึืุูเแโใไ็่้๊๋์ฤฦๅ'];
export const normalizeWord = (word: string) => word.trim().normalize('NFC');
export const signature = (letters: string[] | string) => [...letters].sort().join('');
export const displayLetter = (letter: string) =>
	/^[ิีึืุู็่้๊๋์]$/.test(letter) ? `◌${letter}` : letter;
export type WarDictionary = ReturnType<typeof prepareDictionary>;
export function prepareDictionary(raw: string[]) {
	const words = [
		...new Set(
			raw
				.map(normalizeWord)
				.filter(
					(w) =>
						[...w].every((letter) => alphabet.includes(letter)) &&
						/[ก-ฮ]/.test(w) &&
						[...w].length >= 2 &&
						[...w].length <= 30
				)
		)
	];
	const set = new Set(words),
		anagrams = new Map<string, string[]>();
	for (const word of words) {
		const key = signature(word);
		const group = anagrams.get(key) ?? [];
		group.push(word);
		anagrams.set(key, group);
	}
	return { words, set, anagrams };
}
const pick = <T>(items: T[], random: () => number) =>
	items[Math.min(items.length - 1, Math.floor(random() * items.length))];
export function startingPool(dict: WarDictionary, random = Math.random) {
	return Array.from({ length: 10 }, () => {
		const weights = random() < 0.35 ? letterFrequency.vowels : letterFrequency.consonants;
		let roll = Math.floor(
			random() * weights.reduce((total, [, weight]) => total + Number(weight), 0)
		);
		for (const [letter, weight] of weights) {
			roll -= Number(weight);
			if (roll < 0) return String(letter);
		}
		return String(weights.at(-1)![0]);
	});
}
export function newWar(dict: WarDictionary, now: number, random = Math.random): WordWar {
	return {
		pool: [],
		reserve: startingPool(dict, random),
		turn: 0,
		challenger: null,
		phase: 'turn',
		deadline: now + TURN_MS,
		scores: [0, 0],
		round: 1,
		winner: null,
		message: '',
		revealed: '',
		lastAction: 'You start.'
	};
}
const other = (seat: Seat): Seat => (seat === 0 ? 1 : 0);
export function availableWord(s: WordWar, dict: WarDictionary) {
	return dict.anagrams.get(signature(s.pool))?.[0] ?? '';
}
function finishRound(
	s: WordWar,
	winner: Seat,
	message: string,
	dict: WarDictionary,
	revealed = ''
): WordWar {
	const scores: [number, number] = [...s.scores];
	scores[winner]++;
	return {
		...s,
		scores,
		winner,
		message,
		revealed: revealed || availableWord(s, dict),
		phase: scores[winner] >= TARGET_SCORE ? 'finished' : 'result'
	};
}
export function expireWar(s: WordWar, dict: WarDictionary, now: number): WordWar {
	if ((s.phase !== 'turn' && s.phase !== 'answer') || now < s.deadline) return s;
	return finishRound(s, other(s.turn), `${s.turn === 0 ? 'You' : 'Mali'} ran out of time.`, dict);
}
export function addWarLetter(s: WordWar, letter: string, now: number): WordWar {
	if (s.phase !== 'turn' || now >= s.deadline) throw Error('This turn has ended.');
	if (!s.reserve.includes(letter)) throw Error('Choose one of the remaining starting letters.');
	return {
		...s,
		pool: [...s.pool, letter],
		reserve: s.reserve.filter((_, index) => index !== s.reserve.indexOf(letter)),
		turn: other(s.turn),
		deadline: now + TURN_MS,
		lastAction: `${s.turn === 0 ? 'You' : 'Mali'} added ${displayLetter(letter)}.`
	};
}
export function challengeWar(s: WordWar, now: number): WordWar {
	if (s.phase !== 'turn' || now >= s.deadline) throw Error('This turn has ended.');
	if (s.pool.length < 2) throw Error('Add at least two letters to the pool before making a word.');
	return {
		...s,
		phase: 'answer',
		challenger: s.turn,
		turn: other(s.turn),
		deadline: now + TURN_MS,
		lastAction: `${s.turn === 0 ? 'Mali' : 'You'} must make a word from the pool.`
	};
}
export function answerWar(s: WordWar, answer: string, dict: WarDictionary, now: number): WordWar {
	if (s.phase !== 'answer' || now >= s.deadline) throw Error('The challenge has ended.');
	const word = normalizeWord(answer);
	if (signature(word) !== signature(s.pool))
		throw Error('Use every tile exactly once, including repeated letters.');
	if (!dict.set.has(word))
		throw Error('That word is not in this game’s Thai dictionary. Try another arrangement.');
	return finishRound(
		s,
		s.turn,
		`${s.turn === 0 ? 'You' : 'Mali'} made a dictionary word and won the challenge.`,
		dict,
		word
	);
}
export function concedeWar(s: WordWar, dict: WarDictionary): WordWar {
	if (s.phase !== 'answer') return s;
	return finishRound(
		s,
		other(s.turn),
		`${s.turn === 0 ? 'You' : 'Mali'} could not make a word.`,
		dict
	);
}
export function nextWarRound(
	s: WordWar,
	dict: WarDictionary,
	now: number,
	random = Math.random
): WordWar {
	if (s.phase !== 'result') return s;
	return {
		...newWar(dict, now, random),
		scores: [...s.scores],
		round: s.round + 1,
		turn: (s.round % 2) as Seat,
		lastAction: s.round % 2 ? 'Mali starts this round.' : 'You start this round.'
	};
}
export function botWarAction(
	s: WordWar,
	dict: WarDictionary,
	now: number,
	random = Math.random
): WordWar {
	s = expireWar(s, dict, now);
	if (s.turn !== 1) return s;
	if (s.phase === 'answer') {
		const word = availableWord(s, dict);
		return word ? answerWar(s, word, dict, now) : concedeWar(s, dict);
	}
	if (s.phase !== 'turn') return s;
	if ((s.pool.length >= 2 && !availableWord(s, dict)) || !s.reserve.length)
		return challengeWar(s, now);
	const options = [...new Set(s.reserve)];
	const completions = options.filter((letter) => dict.anagrams.has(signature([...s.pool, letter])));
	return addWarLetter(s, pick(completions.length ? completions : options, random), now);
}
