<script lang="ts">
	import { onDestroy } from 'svelte';
	import { ArrowLeftIcon, RotateCcwIcon, AwardIcon, CheckIcon, XIcon, PlayIcon, ChevronDownIcon, ChevronUpIcon } from 'svelte-feather-icons';

	// Game state
	let turnState: 'idle' | 'animating' | 'guessing' | 'revealed' = 'idle';
	let animFinger: number | null = null;
	let currentFinger: number = 1;
	let prevFinger: number = 5;
	let streak: number = 0;
	let isSolved: boolean = false;
	let lastGuess: number | null = null;
	let status: 'neutral' | 'correct' | 'incorrect' = 'neutral';
	let message: string = '';
	let showHistory: boolean = false;
	let animTimeout: ReturnType<typeof setTimeout> | null = null;

	interface IHistoryItem {
		targetFinger: number;
		guess: number;
		correctAnswer: number;
		isCorrect: boolean;
	}
	let history: IHistoryItem[] = [];

	function clearAnimTimer() {
		if (animTimeout) {
			clearTimeout(animTimeout);
			animTimeout = null;
		}
	}

	function getNextTargetFinger(last: number): number {
		let next: number;
		do {
			next = Math.floor(Math.random() * 5) + 1;
		} while (next === last);
		return next;
	}

	function startInitialAnimation() {
		clearAnimTimer();
		turnState = 'animating';

		let currentStep = 1;
		animFinger = 1;

		const nextStep = () => {
			currentStep += 1;
			if (currentStep <= 5) {
				animFinger = currentStep;
				animTimeout = setTimeout(nextStep, 1000);
			} else {
				animFinger = null;
				turnState = 'guessing';
				status = 'neutral';
				message = '';
			}
		};

		animTimeout = setTimeout(nextStep, 1000);
	}

	function handleStartGame() {
		history = [];
		streak = 0;
		isSolved = false;
		prevFinger = 5;
		currentFinger = Math.floor(Math.random() * 5) + 1;
		startInitialAnimation();
	}

	function handleSelectOption(choice: number) {
		if (turnState !== 'guessing' || isSolved) return;

		lastGuess = choice;
		const isCorrect = choice === prevFinger;

		history = [
			{
				targetFinger: currentFinger,
				guess: choice,
				correctAnswer: prevFinger,
				isCorrect
			},
			...history
		];

		if (isCorrect) {
			streak += 1;
			status = 'correct';
			message = 'ถูกต้อง!';
			if (streak >= 5) {
				isSolved = true;
			}
		} else {
			streak = 0;
			status = 'incorrect';
			message = 'ยังไม่ถูกต้อง!';
		}

		turnState = 'revealed';
	}

	function handleNextTurn() {
		if (turnState !== 'revealed') return;

		// The target finger shown in current turn becomes previous finger for next turn
		prevFinger = currentFinger;
		// Pick new finger strictly different from current finger
		currentFinger = getNextTargetFinger(currentFinger);
		status = 'neutral';
		message = '';
		lastGuess = null;

		// Move directly to guessing turn
		turnState = 'guessing';
	}

	function resetGame() {
		clearAnimTimer();
		streak = 0;
		isSolved = false;
		status = 'neutral';
		message = '';
		lastGuess = null;
		history = [];
		handleStartGame();
	}

	onDestroy(() => {
		clearAnimTimer();
	});
</script>

<svelte:head>
	<title>Puzzle | Back to the Future ⏳</title>
	<meta name="description" content="เกม Back to the Future" />
</svelte:head>

<div class="flex flex-col gap-6 w-full max-w-4xl mx-auto px-4 py-6 select-none">
	<!-- Navigation & Reset -->
	<div class="flex items-center justify-between">
		<a href="/puzzles/deduction" class="btn btn-ghost btn-xs gap-1.5 font-bold text-base-content/70 hover:text-base-content">
			<ArrowLeftIcon size="14" />
			<span>กลับไปหน้า Deduction Games</span>
		</a>

		<button
			on:click={resetGame}
			class="btn btn-ghost btn-xs gap-1.5 font-bold text-primary hover:text-primary hover:bg-indigo-500/10"
		>
			<RotateCcwIcon size="14" />
			<span>เริ่มใหม่ (Reset)</span>
		</button>
	</div>

	<!-- Main Game Canvas Card -->
	<div class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
		<!-- Background Glow -->
		<div class="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
		<div class="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

		<!-- Card Title & Streak Header (inside game div) -->
		<div class="space-y-2 text-center">
			<h1 class="text-2xl sm:text-3xl font-black tracking-tight text-base-content">
				Back to the Future ⏳
			</h1>

			<!-- 5 Circles Streak Indicator -->
			<div class="flex items-center justify-center gap-2 pt-1">
				{#each Array(5) as _, i}
					<div
						class="w-4 h-4 rounded-full transition-all duration-300 shadow-md border {i < streak
							? 'bg-emerald-500 border-primary/30 scale-110 shadow-emerald-500/50'
							: 'bg-rose-500/80 border-rose-600/40 opacity-50'}"
					></div>
				{/each}
			</div>
		</div>

		<!-- 2-Column Layout Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
			<!-- LEFT COLUMN: Hand SVG (or YOU WIN screen) -->
			<div class="flex items-center justify-center min-h-[320px]">
				{#if isSolved}
					<!-- YOU WIN Screen (replaces Hand SVG when solved) -->
					<div class="w-full py-8 flex flex-col items-center justify-center text-center space-y-5 animate-fade-in">
						<div class="w-20 h-20 rounded-3xl bg-indigo-500/20 text-primary flex items-center justify-center border-2 border-indigo-500/40 shadow-2xl shadow-indigo-500/20 animate-bounce">
							<AwardIcon size="48" />
						</div>
						<div class="space-y-2">
							<h2 class="text-3xl font-black text-primary tracking-tight">
								YOU WIN! 🎉
							</h2>
							<p class="text-base-content/70 text-sm max-w-xs mx-auto leading-relaxed">
								คุณตอบถูกต้องติดต่อกันครบ 5 ครั้งแล้ว!
							</p>
						</div>
						<button
							on:click={resetGame}
							class="btn bg-primary text-primary-content hover:bg-primary/90 font-black text-base px-8 h-12 rounded-2xl border-none shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:scale-105"
						>
							เล่นใหม่อีกครั้ง
						</button>
					</div>
				{:else}
					<!-- Line Art SVG Hand Model -->
					<div class="w-full max-w-sm h-72 sm:h-80 relative flex items-center justify-center">
						<svg viewBox="-10 -60 520 580" class="w-full h-full drop-shadow-2xl overflow-visible">
							<defs>
								<filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
									<feGaussianBlur stdDeviation="8" result="blur" />
									<feComposite in="SourceGraphic" in2="blur" operator="over" />
								</filter>
							</defs>

							<!-- Wrist vertical lines -->
							<line x1="205" y1="440" x2="205" y2="505" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
							<line x1="315" y1="440" x2="315" y2="505" stroke="currentColor" stroke-width="5" stroke-linecap="round" />

							<!-- Outer Hand Line Art Contour -->
							<path
								d="M 205 440
								   C 188 400, 175 310, 165 260
								   C 152 230, 138 195, 154 170
								   C 172 150, 184 185, 192 230
								   C 195 250, 198 260, 198 260"
								fill="none"
								stroke="currentColor"
								stroke-width="5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>

							<!-- Thumb Web Line (curving into palm) -->
							<path
								d="M 190 240 C 212 260, 255 280, 260 325"
								fill="none"
								stroke="currentColor"
								stroke-width="5"
								stroke-linecap="round"
							/>

							<!-- Finger 2 (Index) -->
							<path
								d="M 198 230 L 198 100 C 198 80, 232 80, 232 100 L 232 215"
								fill="none"
								stroke="currentColor"
								stroke-width="5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>

							<!-- Finger 3 (Middle) -->
							<path
								d="M 237 215 L 237 70 C 237 50, 273 50, 273 70 L 273 215"
								fill="none"
								stroke="currentColor"
								stroke-width="5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>

							<!-- Finger 4 (Ring) -->
							<path
								d="M 278 215 L 278 95 C 278 75, 314 75, 314 95 L 314 225"
								fill="none"
								stroke="currentColor"
								stroke-width="5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>

							<!-- Finger 5 (Pinky) & Right Palm Outer Edge -->
							<path
								d="M 319 225 L 319 150 C 319 130, 354 130, 354 150 L 354 280 C 354 350, 340 390, 315 440"
								fill="none"
								stroke="currentColor"
								stroke-width="5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>

							<!-- Dynamic Circle Badges -->
							<!-- Thumb (1) -->
							{#if (turnState === 'animating' && animFinger === 1) || (turnState !== 'animating' && turnState !== 'idle' && currentFinger === 1)}
								<g transform="translate(154, 120)">
									{#if turnState === 'animating'}
										<circle r="24" fill="var(--color-primary)" filter="url(#glow)" class="animate-bounce" />
										<text x="0" y="8" text-anchor="middle" fill="var(--color-primary-content)" font-size="22" font-weight="900">1</text>
									{:else}
										{#key currentFinger}
											<g class="drop-anim">
												<circle r="26" fill="var(--color-secondary)" filter="url(#glow)" class="animate-pulse" />
												<text x="0" y="9" text-anchor="middle" fill="var(--color-secondary-content)" font-size="26" font-weight="900">?</text>
											</g>
										{/key}
									{/if}
								</g>
							{/if}

							<!-- Index (2) -->
							{#if (turnState === 'animating' && animFinger === 2) || (turnState !== 'animating' && turnState !== 'idle' && currentFinger === 2)}
								<g transform="translate(215, 30)">
									{#if turnState === 'animating'}
										<circle r="24" fill="var(--color-primary)" filter="url(#glow)" class="animate-bounce" />
										<text x="0" y="8" text-anchor="middle" fill="var(--color-primary-content)" font-size="22" font-weight="900">2</text>
									{:else}
										{#key currentFinger}
											<g class="drop-anim">
												<circle r="26" fill="var(--color-secondary)" filter="url(#glow)" class="animate-pulse" />
												<text x="0" y="9" text-anchor="middle" fill="var(--color-secondary-content)" font-size="26" font-weight="900">?</text>
											</g>
										{/key}
									{/if}
								</g>
							{/if}

							<!-- Middle (3) -->
							{#if (turnState === 'animating' && animFinger === 3) || (turnState !== 'animating' && turnState !== 'idle' && currentFinger === 3)}
								<g transform="translate(255, 0)">
									{#if turnState === 'animating'}
										<circle r="24" fill="var(--color-primary)" filter="url(#glow)" class="animate-bounce" />
										<text x="0" y="8" text-anchor="middle" fill="var(--color-primary-content)" font-size="22" font-weight="900">3</text>
									{:else}
										{#key currentFinger}
											<g class="drop-anim">
												<circle r="26" fill="var(--color-secondary)" filter="url(#glow)" class="animate-pulse" />
												<text x="0" y="9" text-anchor="middle" fill="var(--color-secondary-content)" font-size="26" font-weight="900">?</text>
											</g>
										{/key}
									{/if}
								</g>
							{/if}

							<!-- Ring (4) -->
							{#if (turnState === 'animating' && animFinger === 4) || (turnState !== 'animating' && turnState !== 'idle' && currentFinger === 4)}
								<g transform="translate(296, 25)">
									{#if turnState === 'animating'}
										<circle r="24" fill="var(--color-primary)" filter="url(#glow)" class="animate-bounce" />
										<text x="0" y="8" text-anchor="middle" fill="var(--color-primary-content)" font-size="22" font-weight="900">4</text>
									{:else}
										{#key currentFinger}
											<g class="drop-anim">
												<circle r="26" fill="var(--color-secondary)" filter="url(#glow)" class="animate-pulse" />
												<text x="0" y="9" text-anchor="middle" fill="var(--color-secondary-content)" font-size="26" font-weight="900">?</text>
											</g>
										{/key}
									{/if}
								</g>
							{/if}

							<!-- Pinky (5) -->
							{#if (turnState === 'animating' && animFinger === 5) || (turnState !== 'animating' && turnState !== 'idle' && currentFinger === 5)}
								<g transform="translate(336.5, 80)">
									{#if turnState === 'animating'}
										<circle r="24" fill="var(--color-primary)" filter="url(#glow)" class="animate-bounce" />
										<text x="0" y="8" text-anchor="middle" fill="var(--color-primary-content)" font-size="22" font-weight="900">5</text>
									{:else}
										{#key currentFinger}
											<g class="drop-anim">
												<circle r="26" fill="var(--color-secondary)" filter="url(#glow)" class="animate-pulse" />
												<text x="0" y="9" text-anchor="middle" fill="var(--color-secondary-content)" font-size="26" font-weight="900">?</text>
											</g>
										{/key}
									{/if}
								</g>
							{/if}
						</svg>
					</div>
				{/if}
			</div>

			<!-- RIGHT COLUMN: Options, Result, and Next Controls -->
			<div class="flex flex-col justify-center gap-4 min-h-[220px]">
				{#if turnState === 'idle'}
					<button
						on:click={handleStartGame}
						class="btn bg-primary text-primary-content hover:bg-primary/90 font-black text-lg w-full h-14 rounded-2xl border-none shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:scale-[1.02] gap-2 flex items-center justify-center"
					>
						<PlayIcon size="20" fill="currentColor" />
						<span>เริ่มเล่น</span>
					</button>
				{:else if turnState === 'animating'}
					<div class="py-8 text-center text-primary font-bold text-sm tracking-wide animate-pulse">
						กำลังสแกนลำดับ 1 - 5...
					</div>
				{:else if turnState === 'guessing'}
					<div class="w-full space-y-3">
						<div class="grid grid-cols-5 gap-2">
							{#each [1, 2, 3, 4, 5] as num}
								<button
									on:click={() => handleSelectOption(num)}
									class="btn bg-base-100 text-base-content hover:bg-primary hover:text-primary-content text-base-content font-black text-lg h-14 rounded-2xl border border-base-300 hover:border-indigo-400 transition-all duration-200 shadow-md hover:scale-105"
								>
									{num}
								</button>
							{/each}
						</div>
					</div>
				{:else if turnState === 'revealed'}
					<div class="w-full space-y-4">
						<!-- Option Buttons showing highlighted correct answer -->
						<div class="grid grid-cols-5 gap-2">
							{#each [1, 2, 3, 4, 5] as num}
								<div
									class="botanical-card h-14 rounded-2xl flex items-center justify-center font-black text-lg border transition-all duration-200 {num ===
									prevFinger
										? 'bg-emerald-500/20 border-primary/30 text-primary ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/20'
										: num === lastGuess
										? 'bg-rose-500/20 border-rose-500 text-error-content'
										: 'bg-base-100 text-base-content border-base-300 text-base-content/70'}"
								>
									{num}
								</div>
							{/each}
						</div>

						<!-- Solution Reveal Banner -->
						<div class="botanical-card p-4 rounded-2xl bg-base-100 text-base-content border border-base-300 flex items-center justify-between shadow-inner">
							<div class="flex items-center gap-3">
								<div
									class="w-10 h-10 rounded-xl flex items-center justify-center font-black {status ===
									'correct'
										? 'bg-emerald-500/20 text-primary border border-primary/30'
										: 'bg-rose-500/20 text-error-content border border-rose-500/30'}"
								>
									{#if status === 'correct'}
										<CheckIcon size="20" />
									{:else}
										<XIcon size="20" />
									{/if}
								</div>
								<div>
									<p class="text-sm font-bold {status === 'correct' ? 'text-primary' : 'text-error-content'}">
										{message}
									</p>
									<p class="text-xs text-base-content/70">
										คำตอบที่ถูกคือ <span class="font-bold text-primary">ตัวเลือก {prevFinger}</span>
									</p>
								</div>
							</div>

							<span class="text-xs font-mono text-base-content/70">
								คุณตอบ: {lastGuess}
							</span>
						</div>

						<!-- Next Turn Button -->
						<button
							on:click={handleNextTurn}
							class="btn bg-primary text-primary-content hover:bg-primary/90 font-black text-base w-full h-12 rounded-2xl border-none shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:scale-[1.02]"
						>
							ถัดไป →
						</button>
					</div>
				{/if}
			</div>
		</div>

		<!-- Expandable History Log -->
		{#if history.length > 0}
			<div class="border-t border-base-300 pt-4 space-y-3 w-full">
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
							<span
								class="badge badge-xl p-3 sm:p-4 gap-2.5 font-mono border text-sm shadow-sm {item.isCorrect
									? 'bg-emerald-500/20 text-primary border-primary/30'
									: 'bg-rose-500/20 text-error-content border-rose-500/40'}"
							>
								<span class="font-bold text-primary">{item.targetFinger}</span>
								<span class="text-base-content/70">→</span>
								<span class="font-bold">{item.guess}</span>
								<span class="text-xs opacity-80">{item.isCorrect ? '✓' : `(เฉลย ${item.correctAnswer})`}</span>
							</span>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	@keyframes dropFromAbove {
		0% {
			transform: translateY(-50px);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.drop-anim {
		transform-box: fill-box;
		transform-origin: center;
		animation: dropFromAbove 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}
</style>
