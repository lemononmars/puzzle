<script lang="ts">
	import { onMount } from 'svelte';
	import dict from '#lib/dict.json';
	import { CheckCircleIcon } from 'svelte-feather-icons';

	interface ThaiBlock {
		base: string;
		upper: string;
		lower: string;
	}

	let word = '';
	let blocks: ThaiBlock[] = [];
	let targetChar = '';
	let choices: string[] = [];
	let selectedChoice = '';
	let wrongChoice = '';
	let isSolved = false;

	const allThaiLetters = [
		'ก', 'ข', 'ค', 'ง', 'จ', 'ฉ', 'ช', 'ซ', 'ญ', 'ด', 'ต', 'ถ', 'ท', 'น',
		'บ', 'ป', 'ผ', 'ฝ', 'พ', 'ฟ', 'ม', 'ย', 'ร', 'ล', 'ว', 'ส', 'ห', 'อ'
	];

	function isUpperChar(c: string): boolean {
		return ['ั', 'ิ', 'ี', 'ึ', 'ื', '็', '่', '้', '๊', '๋', '์', 'ํ'].includes(c);
	}

	function isLowerChar(c: string): boolean {
		return ['ุ', 'ู', 'ฺ'].includes(c);
	}

	function parseThaiBlocks(w: string): ThaiBlock[] {
		const result: ThaiBlock[] = [];
		for (const char of w) {
			if (isUpperChar(char)) {
				if (result.length > 0) {
					result[result.length - 1].upper += char;
				} else {
					result.push({ base: '', upper: char, lower: '' });
				}
			} else if (isLowerChar(char)) {
				if (result.length > 0) {
					result[result.length - 1].lower += char;
				} else {
					result.push({ base: '', upper: '', lower: char });
				}
			} else {
				result.push({ base: char, upper: '', lower: '' });
			}
		}
		return result;
	}

	import dictPythaiRaw from '#lib/utils/dict_pythainlp.json?raw';
	const pythaiMap: Record<string, number> = JSON.parse(dictPythaiRaw);

	function loadNewQuestion() {
		isSolved = false;
		wrongChoice = '';
		selectedChoice = '';

		const eligibleWords = dict.filter((w) => {
			const bList = parseThaiBlocks(w);
			if (bList.length < 3 || bList.length > 7) return false;
			if ((pythaiMap[w] ?? 0) < 1) return false;
			const baseChars = bList.map((b) => b.base).filter((b) => allThaiLetters.includes(b));
			const uniqueBases = Array.from(new Set(baseChars));
			return uniqueBases.some((c) => baseChars.filter((x) => x === c).length >= 2);
		});

		let foundWord = '';
		let foundChar = '';
		let foundBlocks: ThaiBlock[] = [];

		let attempts = 0;
		while (attempts < 500 && eligibleWords.length > 0) {
			attempts++;
			const randomW = eligibleWords[Math.floor(Math.random() * eligibleWords.length)];
			const bList = parseThaiBlocks(randomW);
			const baseChars = bList.map((b) => b.base).filter((b) => allThaiLetters.includes(b));
			const uniqueBases = Array.from(new Set(baseChars));
			const multiples = uniqueBases.filter((c) => baseChars.filter((x) => x === c).length >= 2);

			if (multiples.length > 0) {
				foundChar = multiples[Math.floor(Math.random() * multiples.length)];
				foundWord = randomW;
				foundBlocks = bList;
				break;
			}
		}

		if (!foundWord) {
			foundWord = 'กงเกวียน';
			foundChar = 'ก';
			foundBlocks = parseThaiBlocks('กงเกวียน');
		}

		word = foundWord;
		blocks = foundBlocks;
		targetChar = foundChar;

		const distractors = allThaiLetters.filter((c) => c !== targetChar);
		const shuffledDistractors = [...distractors].sort(() => 0.5 - Math.random()).slice(0, 3);
		choices = [targetChar, ...shuffledDistractors].sort(() => 0.5 - Math.random());
	}

	onMount(() => {
		loadNewQuestion();
	});

	function handleChoiceClick(choice: string) {
		if (isSolved) return;
		selectedChoice = choice;
		if (choice === targetChar) {
			isSolved = true;
			wrongChoice = '';
		} else {
			wrongChoice = choice;
			setTimeout(() => (wrongChoice = ''), 800);
		}
	}
</script>

<div class="flex flex-col justify-between gap-3 sm:gap-4 w-full">
	<!-- Compact Subheader -->
	<div class="flex items-center justify-between border-b border-base-300 pb-2.5">
		<div class="flex items-center gap-2">
			<span class="h-2 w-2 rounded-full bg-sky-400"></span>
			<span class="text-xs uppercase tracking-wider text-primary font-bold">Daily Blanks</span>
		</div>
		<a
			href="/puzzles/blanks"
			class="inline-flex items-center text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-500/20 text-primary border border-sky-500/40 hover:bg-sky-500/30 transition-all shadow-sm"
		>
			Full Mode →
		</a>
	</div>

	<!-- Content Box -->
	<div class="flex flex-col items-center space-y-3 sm:space-y-4 w-full">
		<p class="text-[11px] sm:text-xs text-base-content/70 font-medium text-center">
			เลือกพยัญชนะตัวเดียวกันเติมลงในช่องว่างเพื่อให้เป็นคำที่ถูกต้อง
		</p>

		<!-- Word Display with Blanks -->
		<div class="flex items-center justify-center gap-1 sm:gap-2 py-2.5 px-2 bg-base-100 text-base-content border border-base-300 rounded-xl w-full max-w-md shadow-inner overflow-x-auto">
			{#each blocks as b}
				{@const isBlank = b.base === targetChar}
				<div class="flex flex-col items-center justify-center select-none min-w-[24px] max-w-[38px] sm:max-w-[44px] flex-1">
					<!-- Upper mark -->
					<div class="h-4 sm:h-6 font-black text-base sm:text-2xl text-primary flex items-center justify-center leading-none">
						{b.upper || ''}
					</div>
					<!-- Base box -->
					<div
						class="w-full aspect-square max-h-9 sm:max-h-12 rounded-lg sm:rounded-xl border-2 flex items-center justify-center font-black text-sm sm:text-xl transition-all
						{isBlank
							? isSolved
								? 'bg-emerald-500/20 text-primary border-primary/30'
								: 'bg-sky-500/10 text-primary border-sky-500/40 shadow-sm'
							: 'border-base-300 bg-base-100 text-base-content text-base-content'}"
					>
						{isBlank ? (isSolved ? targetChar : '_') : b.base}
					</div>
					<!-- Lower mark -->
					<div class="h-4 sm:h-6 font-black text-base sm:text-2xl text-primary flex items-center justify-center leading-none">
						{b.lower || ''}
					</div>
				</div>
			{/each}
		</div>

		<!-- Fixed Height Container for Choices & Solved State -->
		<div class="w-full max-w-md h-[46px] sm:h-[54px] flex items-center justify-center">
			{#if !isSolved}
				<div class="grid grid-cols-4 gap-1.5 sm:gap-2.5 w-full h-full">
					{#each choices as choice}
						<button
							on:click={() => handleChoiceClick(choice)}
							class="w-full h-full rounded-xl font-black text-lg sm:text-2xl border-2 transition-all transform active:scale-95 shadow-sm flex items-center justify-center
							{wrongChoice === choice
								? 'bg-rose-500/20 text-error-content border-rose-500/50 animate-shake'
								: 'bg-base-100 text-base-content text-base-content/70 border-base-300 hover:border-sky-400 hover:text-primary'}"
						>
							{choice}
						</button>
					{/each}
				</div>
			{:else}
				<!-- Solved Row: Correct Badge + Next Question Button -->
				<div class="flex flex-row items-center justify-center gap-2 w-full h-full">
					<div class="flex-1 h-full px-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500/20 text-primary border border-primary/30 flex items-center justify-center gap-1.5 truncate">
						<CheckCircleIcon size="15" /> Correct! "{word}"
					</div>
					<button
						on:click={loadNewQuestion}
						class="px-4 h-full rounded-xl font-black bg-sky-500 hover:bg-sky-400 text-base-content/70 transition-all shadow-md shadow-sky-500/20 text-xs sm:text-sm whitespace-nowrap flex items-center justify-center"

					>
						Next 🎲 →
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>
