<script lang="ts">
	import { onMount } from 'svelte';
	import { wordDatabase, type WordItem } from '#lib/data/puzzles/spelling/words.js';
	import { CheckCircleIcon, XCircleIcon } from 'svelte-feather-icons';

	let currentItem: WordItem | null = null;
	let choices: { text: string; isCorrect: boolean }[] = [];
	let selectedText = '';
	let isAnswered = false;
	let isCorrectChoice = false;

	function loadNewQuestion() {
		isAnswered = false;
		isCorrectChoice = false;
		selectedText = '';

		const item = wordDatabase[Math.floor(Math.random() * wordDatabase.length)];
		currentItem = item;

		const wrong = item.incorrect[Math.floor(Math.random() * item.incorrect.length)];
		const list = [
			{ text: item.correct, isCorrect: true },
			{ text: wrong, isCorrect: false }
		];
		choices = list.sort(() => 0.5 - Math.random());
	}

	onMount(() => {
		loadNewQuestion();
	});

	function handleChoiceClick(choice: { text: string; isCorrect: boolean }) {
		if (isAnswered) return;
		selectedText = choice.text;
		isAnswered = true;
		isCorrectChoice = choice.isCorrect;
	}
</script>

<div class="flex flex-col justify-between gap-3 sm:gap-4 w-full">
	<!-- Compact Subheader -->
	<div class="flex items-center justify-between border-b border-base-300 pb-2.5">
		<div class="flex items-center gap-2">
			<span class="h-2 w-2 rounded-full bg-teal-400"></span>
			<span class="text-xs uppercase tracking-wider text-primary font-bold">Daily Spelling Quiz</span>
		</div>
		<a
			href="/puzzles/spellingquiz"
			class="inline-flex items-center text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-500/20 text-primary border border-primary/30 hover:bg-teal-500/30 transition-all shadow-sm"
		>
			Full Mode →
		</a>
	</div>

	<!-- Content Box -->
	{#if currentItem}
		<div class="flex flex-col items-center space-y-3 sm:space-y-4 w-full">
			<!-- 2 Choices -->
			<div class="grid grid-cols-2 gap-2 sm:gap-3.5 w-full max-w-md">
				{#each choices as c}
					<button
						on:click={() => handleChoiceClick(c)}
						disabled={isAnswered}
						class="py-2.5 sm:py-3.5 px-3 sm:px-5 rounded-xl font-black text-sm sm:text-xl border-2 transition-all transform active:scale-95 shadow-sm text-center truncate
						{isAnswered && c.isCorrect
							? 'bg-emerald-500 text-base-content/70 border-primary/30 shadow-emerald-500/30'
							: isAnswered && !c.isCorrect && selectedText === c.text
							? 'bg-rose-500/20 text-error-content border-rose-500/50'
							: 'bg-base-100 text-base-content text-base-content/70 border-base-300 hover:border-primary/30 hover:text-primary'}"
						style={isAnswered && c.isCorrect ? 'color: var(--color-base-content);' : ''}
					>
						{c.text}
					</button>
				{/each}
			</div>

			<!-- Fixed Height Container for Helper Text / Answer Response -->
			<div class="w-full max-w-md h-10 flex items-center justify-center">
				{#if !isAnswered}
					<p class="text-[11px] sm:text-xs text-base-content/70 font-semibold tracking-wide text-center">
						เลือกคำที่เขียนสะกดถูกต้องตามพจนานุกรม
					</p>
				{:else}
					<div class="flex flex-row items-center justify-center gap-2 w-full h-full">
						<div
							class="flex-1 h-full px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 truncate
							{isCorrectChoice
								? 'bg-emerald-500/20 text-primary border border-primary/30'
								: 'bg-rose-500/20 text-error-content border border-rose-500/30'}"
						>
							{#if isCorrectChoice}
								<CheckCircleIcon size="15" />
								<span>Correct! "{currentItem.correct}"</span>
							{:else}
								<XCircleIcon size="15" />
								<span>Answer: "{currentItem.correct}"</span>
							{/if}
						</div>

						<button
							on:click={loadNewQuestion}
							class="px-4 h-full rounded-xl font-black bg-teal-500 hover:bg-teal-400 text-base-content/70 transition-all shadow-md shadow-teal-500/20 text-xs sm:text-sm whitespace-nowrap flex items-center justify-center"

						>
							Next 🎲 →
						</button>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
