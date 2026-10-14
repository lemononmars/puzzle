<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon } from 'svelte-feather-icons';

	let dice: number[] = [1, 3, 5, 2, 4];
	let petalsGuess = '';
	let petalsStreak = 0;
	let petalsMessage = '';
	let petalsStatus: 'neutral' | 'correct' | 'incorrect' = 'neutral';
	let petalsSolved = false;
	let isRolling = false;
	let showHistory = false;

	const diceUnicodeMap: Record<number, string> = {
		1: '⚀',
		2: '⚁',
		3: '⚂',
		4: '⚃',
		5: '⚄',
		6: '⚅'
	};

	interface IHistoryItem {
		dice: number[];
		guess: number;
		correctScore: number;
		isCorrect: boolean;
	}
	let history: IHistoryItem[] = [];

	function rollDice() {
		isRolling = true;
		setTimeout(() => {
			dice = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
			isRolling = false;
		}, 250);
	}

	function getPetalsScore(roll: number[]): number {
		let score = 0;
		for (const d of roll) {
			if (d === 3) score += 2;
			else if (d === 5) score += 4;
		}
		return score;
	}

	function handlePetalsSubmit() {
		if (petalsSolved) return;

		const targetScore = getPetalsScore(dice);
		const userScore = parseInt(String(petalsGuess ?? '').trim(), 10);

		if (isNaN(userScore)) {
			petalsMessage = 'กรุณากรอกตัวเลขคะแนน';
			return;
		}

		const isCorrect = userScore === targetScore;
		history = [
			{
				dice: [...dice],
				guess: userScore,
				correctScore: targetScore,
				isCorrect
			},
			...history
		];

		if (isCorrect) {
			petalsStreak += 1;
			petalsStatus = 'correct';
			petalsMessage = `ถูกต้อง! (คะแนน = ${targetScore})`;
			if (petalsStreak >= 5) {
				petalsSolved = true;
			} else {
				petalsGuess = '';
				rollDice();
			}
		} else {
			petalsStreak = 0;
			petalsStatus = 'incorrect';
			petalsMessage = `คำตอบยังไม่ถูกต้อง (คำตอบที่ถูกคือ ${targetScore})`;
			petalsGuess = '';
			rollDice();
		}
	}

	function resetGame() {
		petalsStreak = 0;
		petalsGuess = '';
		petalsMessage = '';
		petalsStatus = 'neutral';
		petalsSolved = false;
		history = [];
		rollDice();
	}

	// Die Pip Matrix: Returns boolean array of 9 positions (3x3 grid) for die value 1-6
	function getDiePips(val: number): boolean[] {
		const p = Array(9).fill(false);
		if (val === 1) { p[4] = true; }
		else if (val === 2) { p[2] = true; p[6] = true; }
		else if (val === 3) { p[2] = true; p[4] = true; p[6] = true; }
		else if (val === 4) { p[0] = true; p[2] = true; p[6] = true; p[8] = true; }
		else if (val === 5) { p[0] = true; p[2] = true; p[4] = true; p[6] = true; p[8] = true; }
		else if (val === 6) { p[0] = true; p[2] = true; p[3] = true; p[5] = true; p[6] = true; p[8] = true; }
		return p;
	}

	onMount(() => {
		rollDice();
	});
</script>

<svelte:head>
	<title>Puzzle | Petals Around the Rose 🌹</title>
	<meta
		name="description"
		content="เกมกลีบรอบกุหลาบ"
	/>
</svelte:head>

<div class="flex flex-col gap-8 w-full max-w-2xl mx-auto px-4 py-8 select-none">
	<!-- Navigation -->
	<div class="flex items-center justify-between">
		<a href="/puzzles/deduction" class="btn btn-ghost btn-xs gap-1.5 font-bold text-base-content/70 hover:text-base-content">
			<ArrowLeftIcon size="14" />
			<span>กลับไปหน้า Deduction Games</span>
		</a>
	</div>

	<!-- Main Game Card -->
	<section class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
		<!-- Header Info -->
		<div class="space-y-2 text-center">
			<h1 class="text-2xl sm:text-4xl font-black text-base-content">Petals Around the Rose</h1>
			<p class="text-xs sm:text-sm text-base-content/70 font-medium">
				หารูปแบบคำตอบในลูกเต๋า 5 ลูก
			</p>

			<!-- 5 Circles Streak Indicator (Red turns Green) -->
			<div class="flex items-center justify-center gap-2 pt-3">
				{#each Array(5) as _, i}
					<div
						class="w-4 h-4 rounded-full transition-all duration-300 shadow-md border
						{i < petalsStreak
							? 'bg-emerald-500 border-primary/30 scale-110 shadow-emerald-500/50'
							: 'bg-rose-500/80 border-rose-600/40 opacity-50'}"
					></div>
				{/each}
			</div>
		</div>

		<!-- Dice Display with Animated Pips -->
		<div class="botanical-card bg-base-100 text-base-content p-6 sm:p-8 rounded-2xl border border-base-300 flex items-center justify-center gap-3 sm:gap-4 flex-wrap shadow-inner min-h-[120px]">
			{#each dice as d}
				<div
					class="botanical-card w-13 h-13 sm:w-16 sm:h-16 bg-base-100 text-base-content rounded-2xl p-2.5 sm:p-3 shadow-xl border-2 border-base-300 select-none grid grid-cols-3 grid-rows-3 gap-0.5 sm:gap-1 transition-all duration-300
					{isRolling ? 'animate-bounce scale-105 rotate-12' : ''}"
				>
					{#each getDiePips(d) as hasPip}
						<div class="flex items-center justify-center">
							{#if hasPip}
								<div class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-base-content"></div>
							{/if}
						</div>
					{/each}
				</div>
			{/each}
		</div>

		<!-- Message Feedback -->
		{#if petalsMessage}
			<div class="alert text-xs font-bold rounded-xl py-2 px-3
				{petalsStatus === 'correct' ? 'alert-success' : ''}
				{petalsStatus === 'incorrect' ? 'alert-error' : ''}">
				<span>{petalsMessage}</span>
			</div>
		{/if}

		<!-- Congratulations Banner (When streak reaches 5) -->
		{#if petalsSolved}
			<div class="bg-emerald-500/10 border border-primary/30 rounded-2xl p-6 text-center space-y-3 animate-fade-in">
				<div class="text-4xl">🎉</div>
				<h3 class="text-xl sm:text-2xl font-black text-primary">
					ยินดีด้วย! คุณถอดรหัสสำเร็จแล้ว!
				</h3>
				<p class="text-xs sm:text-sm text-base-content/70 font-light">
					คุณไขความลับรูปแบบของลูกเต๋า 5 ลูกได้สำเร็จครบ 5 ครั้งติดต่อกัน!
				</p>
				<button on:click={resetGame} class="btn btn-emerald btn-sm rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-content border-none px-6 mt-2">
					เล่นอีกครั้ง
				</button>
			</div>
		{:else}
			<!-- Grouped Input & Submit Button with DaisyUI input-group -->
			<form on:submit|preventDefault={handlePetalsSubmit} class="flex flex-col gap-2 max-w-md mx-auto">
				<div class="join justify-center">
					<input
						type="number"
						bind:value={petalsGuess}
						placeholder="กรอกคำตอบ..."
						class:botanical-answer-input={true}
						class="join-item input  border border-base-300 focus:border-rose-400 flex-1 text-sm font-bold"
						min="0"
						max="20"
						required
					/>
					<button type="submit" class="join-item btn bg-primary hover:bg-primary/90 text-primary-content font-bold border-none shadow-lg px-6">
						ตอบ
					</button>
				</div>
			</form>
		{/if}

		<!-- Expandable History Badges -->
		{#if history.length > 0}
			<div class="border-t border-base-300 pt-4 space-y-3">
				<button
					on:click={() => (showHistory = !showHistory)}
					class="btn btn-ghost btn-xs text-xs text-base-content/70 hover:text-base-content flex items-center justify-between w-full font-bold"
				>
					<span>ประวัติการตอบ ({history.length} รายการ)</span>
					{#if showHistory}
						<ChevronUpIcon size="14" />
					{:else}
						<ChevronDownIcon size="14" />
					{/if}
				</button>

				{#if showHistory}
					<div class="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1 pt-1">
						{#each history as item}
							<span class="badge badge-xl p-3 sm:p-4 gap-2.5 font-mono border text-sm shadow-sm
								{item.isCorrect
									? 'bg-emerald-500/20 text-primary border-primary/30'
									: 'bg-rose-500/20 text-error-content border-rose-500/40'}">
								<span class="text-base tracking-widest">{item.dice.map((d) => diceUnicodeMap[d]).join(' ')}</span>
								<span class="text-base-content/70">→</span>
								<span class="font-bold">{item.guess}</span>
								<span class="text-xs opacity-80">{item.isCorrect ? '✓' : `(เฉลย ${item.correctScore})`}</span>
							</span>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</section>
</div>
