<script lang="ts">
import UiArrowRight from '@lucide/svelte/icons/arrow-right';
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { search, isUpper, isLower } from '#lib/utils/thaiwords.js';
	import { numPuzzles } from '#lib/data/puzzles/spellingbee/index.js';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
import CheckCircleIcon from '@lucide/svelte/icons/circle-check';
import XCircleIcon from '@lucide/svelte/icons/circle-x';
import PauseIcon from '@lucide/svelte/icons/pause';
import PlayIcon from '@lucide/svelte/icons/play';
	import { username } from '#lib/store/index.js';
	import { flip } from 'svelte/animate';

	export let solvers: Array<{
		name?: string;
		username?: string;
		puzzle_type?: string;
		puzzle_id?: string;
		created_at?: string;
		score?: number;
	}> = [];

	let word = '';
	let puzzleId: number | string = '';
	let letters: string[] = [];
	let answer = '';
	let isLoading = true;
	let isStarted = false;
	let isFinished = false;
	let isWiggle = false;
	let isPaused = false;
	let showNameInput = false;
	let playerNameInput = '';

	let time = 0;
	let timer: any;

	interface LogState {
		text: string;
		type: 'success' | 'error' | 'info' | '';
	}
	let log: LogState = { text: '', type: '' };

	$: minutes = String(Math.floor(time / 60000)).padStart(2, '0');
	$: seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, '0');
	$: timeString = `${minutes}:${seconds}`;

	$: top3Solvers = (() => {
		if (!isFinished) return [];
		const currentName = $username || 'You';

		const list: Array<{ name: string; score: number | null; isPlayer: boolean }> = (solvers || [])
			.filter((s) => !s.puzzle_type || s.puzzle_type === 'spellingbee')
			.map((s) => ({
				name: s.name || s.username || 'Player',
				score: typeof s.score === 'number' ? s.score : null,
				isPlayer: false
			}));

		const playerIdx = list.findIndex(
			(s) => s.name.trim().toLowerCase() === currentName.trim().toLowerCase()
		);
		if (playerIdx >= 0) {
			list[playerIdx] = { name: currentName, score: time, isPlayer: true };
		} else {
			list.push({ name: currentName, score: time, isPlayer: true });
		}

		list.sort((a, b) => {
			if (a.score !== null && b.score !== null) return a.score - b.score;
			if (a.score !== null) return -1;
			if (b.score !== null) return 1;
			return 0;
		});

		return list.slice(0, 3);
	})();

	onMount(async () => {
		try {
			const res = await fetch('/api/puzzle/spellingbee/daily');
			const data = await res.json();
			if (data && data.word) {
				word = data.word;
				puzzleId = data.id || 'daily';
				letters = shuffle(data.word.split(''));
			}
		} catch (e) {
			console.error('Failed to load daily spelling bee:', e);
		} finally {
			isLoading = false;
		}
	});

	onDestroy(() => {
		stopTimer();
	});

	function handleStartGame() {
		isStarted = true;
		startTimer();
	}

	function startTimer() {
		stopTimer();
		timer = setInterval(() => {
			if (!isPaused && !isFinished) {
				time += 100;
			}
		}, 100);
	}

	function stopTimer() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	function togglePause() {
		isPaused = !isPaused;
	}

	function shuffle(arr: string[]) {
		const result = [...arr];
		for (let i = result.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[result[i], result[j]] = [result[j], result[i]];
		}
		return result;
	}

	function handleShuffle() {
		answer = '';
		letters = shuffle(letters);
	}

	function handleRandomNewPuzzle() {
		const randomId = Math.floor(Math.random() * numPuzzles);
		goto(`/puzzles/spellingbee/${randomId}`);
	}

	function addLetter(l: string) {
		if (!answer.includes(l)) {
			answer += l;
		} else if (answer[answer.length - 1] === l) {
			answer = answer.slice(0, answer.length - 1);
		}
	}

	function triggerWiggle() {
		isWiggle = true;
		setTimeout(() => (isWiggle = false), 600);
	}

	function isDefaultName(name: string | null | undefined): boolean {
		if (!name) return true;
		const clean = name.trim().toLowerCase();
		return clean === '' || clean === 'code breaker' || clean === 'codebreaker' || clean === 'guest';
	}

	function checkAnswer() {
		if (!answer) return;

		if (!search(answer)) {
			log = { text: `'${answer}' is not in dictionary`, type: 'error' };
			triggerWiggle();
			answer = '';
			return;
		}

		if (answer.split('').some((l) => !letters.includes(l))) {
			log = { text: `'${answer}' has invalid letters`, type: 'error' };
			triggerWiggle();
			answer = '';
			return;
		}

		if (answer.length < 7) {
			log = { text: `'${answer}' must be 7 letters`, type: 'error' };
			triggerWiggle();
			answer = '';
			return;
		}

		if (answer === word) {
			stopTimer();
			if (isDefaultName($username)) {
				showNameInput = true;
				log = { text: '🎉 Correct! Please enter your name to save score', type: 'success' };
			} else {
				isFinished = true;
				log = { text: `Correct! 🎉 Time: ${timeString}`, type: 'success' };
				submitScore();
			}
		} else {
			log = { text: `'${answer}' is not the daily word`, type: 'info' };
			triggerWiggle();
			answer = '';
		}
	}

	function handleSaveName() {
		const trimmed = playerNameInput.trim();
		if (trimmed) {
			username.set(trimmed);
		} else {
			username.set('Guest');
		}
		showNameInput = false;
		isFinished = true;
		log = { text: `Correct! 🎉 Time: ${timeString}`, type: 'success' };
		submitScore();
	}

	async function submitScore() {
		try {
			await fetch('/api/post/leaderboard', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					puzzle_type: 'spellingbee',
					puzzle_id: puzzleId,
					name: $username || 'Guest',
					score: time
				})
			});
		} catch (e) {
			console.error(e);
		}
	}
</script>

<div class="flex flex-col justify-between gap-3 sm:gap-5 w-full">
	<!-- Compact Subheader -->
	<div class="flex items-center justify-between border-b border-base-300 pb-2.5">
		<div class="flex items-center gap-2">
			<span class="h-2 w-2 rounded-full bg-primary text-primary-content"></span>
			<span class="text-xs uppercase tracking-wider text-primary font-bold">Daily Spelling Bee</span>
		</div>
		<button
			on:click={handleRandomNewPuzzle}
			class="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-base-300 text-base-content text-primary border border-primary/30 hover:bg-base-300 text-base-content transition-all shadow-sm"
		>
			Random 🎲
		</button>
	</div>

	<!-- Content Box -->
	{#if isLoading}
		<div class="flex items-center justify-center h-40 text-base-content/70 text-xs sm:text-sm">
			<span class="animate-pulse">Loading Spelling Bee...</span>
		</div>
	{:else if !isStarted}
		<div class="flex flex-col items-center justify-center py-6 sm:py-10 px-2 space-y-4 text-center">
			<p class="text-base-content/70 text-xs sm:text-sm max-w-md font-medium">
				สะกดคำ 7 ตัวอักษรจากตัวอักษรที่กำหนด! พร้อมจับเวลาหรือยัง?
			</p>
			<button
				on:click={handleStartGame}
				class="px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl font-black text-sm sm:text-base bg-gradient-to-r from-primary via-primary to-primary text-primary-content hover:from-primary hover:to-primary transition-all duration-200 shadow-lg shadow-amber-500/20 transform hover:scale-105 active:scale-95 flex items-center gap-2"

			>
				<span>Start Game 🐝</span>
			</button>
		</div>
	{:else}
		<div class="flex flex-col items-center space-y-3 sm:space-y-4 w-full">
			<!-- Letter Tiles Grid with smooth position reorder animation -->
			<div class="flex flex-wrap justify-center gap-1.5 sm:gap-2.5 max-w-lg">
				{#each letters as l (l)}
					<div animate:flip={{ duration: 300 }}>
						<button
							on:click={() => addLetter(l)}
							class="w-10 h-10 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-lg sm:rounded-xl border-2 font-black text-lg sm:text-2xl flex items-center justify-center transition-all duration-150 transform hover:scale-105 active:scale-95 shadow-sm
							{answer.includes(l)
								? 'bg-primary text-primary-content !text-primary-content border-primary/30 shadow-amber-500/30 font-black'
								: 'bg-base-100  text-primary border-base-300 hover:border-primary/30 hover:text-primary'}"
							style={answer.includes(l) ? 'color: var(--color-primary-content);' : ''}
						>
							<span class={isUpper(l) || isLower(l) ? 'translate-x-0.5' : ''}>{l}</span>
						</button>
					</div>
				{/each}
			</div>

			<!-- Input Display & Controls (Always 1 row on mobile and desktop) -->
			<div class="w-full max-w-md flex items-center gap-1.5 sm:gap-2">
				<!-- Merged Pause / Play + Timer Button -->
				<button
					on:click={togglePause}
					class="px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-lg sm:rounded-xl bg-base-100 text-base-content border border-base-300 text-base-content/70 hover:text-primary hover:border-primary/30 transition-colors flex items-center gap-1 font-mono font-bold text-xs sm:text-sm shrink-0"
					title={isPaused ? 'Resume timer' : 'Pause timer'}
				>
					{#if isPaused}
						<PlayIcon size={15} class="text-primary" />
					{:else}
						<PauseIcon size={15} class="text-primary" />
						<span class="text-primary">{timeString}</span>
					{/if}
				</button>

				<!-- Shuffle Button -->
				<button
					on:click={handleShuffle}
					class="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-base-100 text-base-content border border-base-300 text-base-content/70 hover:text-primary hover:border-primary/30 transition-colors shrink-0"
					title="Shuffle & clear"
				>
					<RefreshCwIcon size={16} />
				</button>

				<!-- Textfield -->
				<div class="relative flex-1 min-w-0" class:wiggle={isWiggle}>
					<input
						type="text"
						bind:value={answer}
						on:keydown={(e) => { if (e.key === 'Enter') checkAnswer(); }}
						placeholder=""
						class="w-full px-2.5 py-2 sm:px-3.5 sm:py-2.5 rounded-lg sm:rounded-xl !bg-base-100 text-base-content !text-base-content font-bold text-xs sm:text-base border border-base-300 focus:outline-none focus:border-primary/30 transition-colors"
						style="background-color: var(--color-base-300); color: var(--color-base-content);"
					/>
					{#if answer}
						<button
							on:click={() => (answer = '')}
							class="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/70 hover:text-base-content/70"
						>
							<XCircleIcon size={15} />
						</button>
					{/if}
				</div>

				<button
					on:click={checkAnswer}
					class="px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm bg-primary text-primary-content hover:bg-primary hover:text-primary-content !text-primary-content transition-all shrink-0 shadow-md shadow-amber-500/20"

				>
					Submit
				</button>
			</div>

			<!-- Status Feedback -->
			{#if log.text}
				<div
					class="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5
					{log.type === 'success'
						? 'bg-emerald-500/20 text-primary border border-primary/30'
						: log.type === 'error'
						? 'bg-rose-500/20 text-error-content border border-rose-500/30'
						: 'bg-base-300 text-base-content text-primary border border-primary/30'}"
				>
					{#if log.type === 'success'}
						<CheckCircleIcon size={14} />
					{/if}
					<span>{log.text}</span>
				</div>
			{/if}

			<!-- Name Input before revealing solution -->
			{#if showNameInput}
				<div class="botanical-card w-full max-w-md bg-base-100 text-base-content border border-primary/30 rounded-xl p-3 flex flex-col items-center space-y-2 shadow-xl">
					<span class="text-xs font-bold text-primary">Enter your name to save score:</span>
					<div class="flex w-full gap-1.5">
						<input
							type="text"
							bind:value={playerNameInput}
							on:keydown={(e) => { if (e.key === 'Enter') handleSaveName(); }}
							placeholder="Your name..."
							class="flex-1 px-3 py-1.5 rounded-lg !bg-base-100 text-base-content !text-base-content font-bold border border-base-300 focus:outline-none focus:border-primary/30 text-xs"
						/>
						<button
							on:click={handleSaveName}
							class="px-4 py-1.5 rounded-lg font-black bg-primary text-primary-content hover:bg-primary hover:text-primary-content  transition-all text-xs"

						>
							Save
						</button>
					</div>
				</div>
			{/if}

			<!-- Finished Solution & Single Line Ranking -->
			{#if isFinished}
				<div class="w-full bg-base-100 text-base-content border border-primary/30 rounded-xl p-2.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-[11px] sm:text-xs shadow-inner font-mono">
					<span class="font-bold text-primary font-sans flex items-center gap-1">
						🏆 Solvers:
					</span>
					{#each top3Solvers as item, index}
						{@const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
						{@const formatTime = item.score ? `${String(Math.floor(item.score / 60000)).padStart(2, '0')}:${String(Math.floor((item.score % 60000) / 1000)).padStart(2, '0')}` : ''}
						<div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md {item.isPlayer ? 'bg-primary text-primary-content border border-primary/30 font-bold text-primary-content' : 'bg-base-100   border border-base-300'}">
							<span>{medal} {index + 1}.</span>
							<span class="font-bold">{item.name}</span>
							{#if formatTime}
								<span class="text-base-content/70 text-[10px]">({formatTime})</span>
							{/if}
						</div>
					{/each}
				</div>
				<button
					on:click={handleRandomNewPuzzle}
					class="px-5 py-1.5 rounded-lg font-bold text-xs bg-emerald-500 hover:bg-emerald-400 !text-primary-content transition-all shadow-md shadow-emerald-500/20"

				>
					Next Puzzle 🎲 <UiArrowRight size={16} class="inline-block align-middle" aria-hidden="true" />
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	@keyframes wiggle {
		0%, 100% { transform: translateX(0); }
		25% { transform: translateX(-6px); }
		75% { transform: translateX(6px); }
	}
	.wiggle {
		animation: wiggle 0.4s ease-in-out;
	}
</style>
