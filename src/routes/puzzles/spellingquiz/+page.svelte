<script lang="ts">
	import { onMount } from 'svelte';
	import CompassIcon from '@lucide/svelte/icons/compass';
import AwardIcon from '@lucide/svelte/icons/award';
import HeartIcon from '@lucide/svelte/icons/heart';
import HelpCircleIcon from '@lucide/svelte/icons/circle-help';
import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
import PlayIcon from '@lucide/svelte/icons/play';
import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
import CheckCircleIcon from '@lucide/svelte/icons/circle-check';
import XCircleIcon from '@lucide/svelte/icons/circle-x';
import BookOpenIcon from '@lucide/svelte/icons/book-open';
import ClockIcon from '@lucide/svelte/icons/clock';
import SendIcon from '@lucide/svelte/icons/send';
import Maximize2Icon from '@lucide/svelte/icons/maximize-2';
import Minimize2Icon from '@lucide/svelte/icons/minimize-2';

	import { wordDatabase, type WordItem } from '#lib/data/puzzles/spelling/words.js';

	// Global leaderboard submission
	let submitName = '';
	let submitStatus: 'idle' | 'loading' | 'success' | 'error' | 'duplicate' = 'idle';
	let submitError = '';

	async function submitToLeaderboard() {
		const name = submitName.trim();
		if (!name || score === 0) return;
		submitStatus = 'loading';
		try {
			if (typeof window !== 'undefined') {
				localStorage.setItem('codebreaker_player_name', name);
			}
			const res = await fetch('/api/post/leaderboard', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, puzzle_type: 'spellingquiz', puzzle_id: 0, score })
			});
			if (res.status === 400) {
				submitStatus = 'duplicate';
			} else if (!res.ok) {
				submitStatus = 'error';
				submitError = 'เกิดข้อผิดพลาด ลองใหม่อีกครั้ง';
			} else {
				submitStatus = 'success';
			}
		} catch (e) {
			submitStatus = 'error';
			submitError = 'ไม่สามารถเชื่อมต่อได้';
		}
	}

	// Game States
	let currentMode: 'selection' | 'countdown' | 'playing' | 'gameover' = 'selection';
	let gameMode: 'normal' | 'endless' | 'timeattack' = 'normal';
	let gameType: 'choices' | 'yesno' = 'choices';
	let isFullscreen = false;
	let endlessState: 'playing' | 'revealed' = 'playing';

	function toggleFullscreen() {
		if (typeof window === 'undefined') return;
		const elem = document.getElementById('spelling-game-container');
		if (!elem) return;

		if (!document.fullscreenElement) {
			elem.requestFullscreen().catch(err => {
				console.warn(`Error attempting to enable full-screen: ${err.message}`);
			});
		} else {
			document.exitFullscreen().catch(() => {});
		}
	}

	function revealAnswer() {
		if (!currentQuestion) return;
		answerStatus = 'correct';
		playSFX('correct');
		endlessState = 'revealed';
	}

	function loadNextQuestion() {
		endlessState = 'playing';
		getNextQuestion();
	}

	// Game Statistics
	let score = 0;
	let streak = 0;
	let maxStreak = 0;
	let lives = 3;
	let totalAnswered = 0;
	let correctCount = 0;
	let highScores = {
		choices_normal: 0,
		choices_endless: 0,
		choices_timeattack: 0,
		yesno_normal: 0,
		yesno_endless: 0,
		yesno_timeattack: 0
	};



	let includeLoanWords = true;
	$: filteredQuizWords = includeLoanWords
		? wordDatabase
		: wordDatabase.filter((word) => !word.isLoanWord);

	let currentQuestion: WordItem | null = null;
	let leftOption = '';
	let rightOption = '';
	let leftIsCorrect = false;

	// Yes/No Mode State
	let yesNoWordShown = '';
	let yesNoIsCorrect = false;

	// Session missed words tracking
	let missedWords: Array<{ word: WordItem; shownWord: string; userWasCorrect: boolean }> = [];

	// Interactive animations states
	let answerStatus: 'idle' | 'correct' | 'incorrect' = 'idle';
	let chosenSide: 'left' | 'right' | null = null;
	let activeKey: 'left' | 'right' | null = null;
	let lastAnswerCorrect = false;

	// Timer state for Normal Mode (5s per question)
	let timeLeft = 5.0;
	let timerInterval: any = null;

	// Time Attack Mode state (total game clock)
	let attackTimeLeft = 60;
	let attackTimerInterval: any = null;

	// Countdown state
	let countdown = 3;
	let countdownInterval: any = null;

	// Play synthesized arcade-style sound effects
	function playSFX(type: 'correct' | 'incorrect') {
		if (typeof window === 'undefined') return;
		try {
			const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
			if (!AudioContextClass) return;
			const ctx = new AudioContextClass();

			if (type === 'correct') {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.type = 'sine';
				osc.frequency.setValueAtTime(523.25, ctx.currentTime);
				osc.frequency.exponentialRampToValueAtTime(880.0, ctx.currentTime + 0.12);
				gain.gain.setValueAtTime(0.1, ctx.currentTime);
				gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.start();
				osc.stop(ctx.currentTime + 0.25);
			} else {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.type = 'sawtooth';
				osc.frequency.setValueAtTime(160, ctx.currentTime);
				osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.25);
				gain.gain.setValueAtTime(0.12, ctx.currentTime);
				gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.start();
				osc.stop(ctx.currentTime + 0.25);
			}
		} catch (e) {
			console.warn('AudioContext error:', e);
		}
	}

	// ── Normal Mode: 5s per-question countdown ──────────────────────────────
	function startTimer() {
		stopTimer();
		timeLeft = 5.0;
		timerInterval = setInterval(() => {
			timeLeft -= 0.1;
			if (timeLeft <= 0.05) {
				timeLeft = 0;
				stopTimer();
				handleTimeout();
			}
		}, 100);
	}

	// ── Timeout Handler ───────────────────────────────────────────────────
	function handleTimeout() {
		if (currentMode !== 'playing' || answerStatus !== 'idle') return;

		totalAnswered++;
		answerStatus = 'incorrect';
		streak = 0;
		lastAnswerCorrect = false;

		playSFX('incorrect');

		// Track missed word
		if (currentQuestion) {
			if (!missedWords.some((w) => w.word.correct === currentQuestion!.correct)) {
				missedWords = [
					...missedWords,
					{
						word: currentQuestion,
						shownWord: gameType === 'choices' ? currentQuestion.correct : yesNoWordShown,
						userWasCorrect: false
					}
				];
			}
		}

		if (gameMode === 'normal') {
			lives--;
			if (lives <= 0) {
				setTimeout(() => triggerGameOver(), 1200);
				return;
			}
		}

		setTimeout(() => {
			if (currentMode === 'playing') getNextQuestion();
		}, 1200);
	}

	function stopTimer() {
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
	}

	function getHighScore(type: string, mode: string) {
		const highScores = typeof localStorage !== 'undefined' ? localStorage.getItem('spellingHighScores') || '{}' : '{}';
		return JSON.parse(highScores)[type]?.[mode] || 0;
	}

	// ── Time Attack Mode: 60s global game clock ──────────────────────────────
	function startAttackTimer() {
		stopAttackTimer();
		attackTimeLeft = 60;
		attackTimerInterval = setInterval(() => {
			attackTimeLeft -= 0.1;
			if (attackTimeLeft <= 0.05) {
				attackTimeLeft = 0;
				stopAttackTimer();
				triggerGameOver();
			}
		}, 100);
	}

	function stopAttackTimer() {
		if (attackTimerInterval) {
			clearInterval(attackTimerInterval);
			attackTimerInterval = null;
		}
	}

	// ── High Scores ────────────────────────────────────────────────────────────
	onMount(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('codebreaker_spelling_highscores');
			if (saved) {
				try {
					const parsed = JSON.parse(saved);
					highScores.choices_normal =
						parsed.choices_normal || parsed.normal || parsed.survival || 0;
					highScores.choices_endless = parsed.choices_endless || parsed.endless || 0;
					highScores.choices_timeattack = parsed.choices_timeattack || parsed.timeattack || 0;
					highScores.yesno_normal = parsed.yesno_normal || 0;
					highScores.yesno_endless = parsed.yesno_endless || 0;
					highScores.yesno_timeattack = parsed.yesno_timeattack || 0;
				} catch (e) {
					console.error(e);
				}
			}
			// Pre-fill saved player name
			submitName = localStorage.getItem('codebreaker_player_name') || '';
		}

		const handleFsChange = () => {
			isFullscreen = !!document.fullscreenElement;
		};
		if (typeof document !== 'undefined') {
			document.addEventListener('fullscreenchange', handleFsChange);
		}

		return () => {
			stopTimer();
			stopAttackTimer();
			if (countdownInterval) clearInterval(countdownInterval);
			if (typeof document !== 'undefined') {
				document.removeEventListener('fullscreenchange', handleFsChange);
			}
		};
	});

	// ── Question generation ────────────────────────────────────────────────────
	function getNextQuestion() {
		answerStatus = 'idle';
		chosenSide = null;
		endlessState = 'playing';
		stopTimer();

		const idx = Math.floor(Math.random() * filteredQuizWords.length);
		const selected = filteredQuizWords[idx];
		currentQuestion = selected;

		if (gameType === 'choices') {
			leftIsCorrect = Math.random() < 0.5;
			const incorrectWord =
				selected.incorrect[Math.floor(Math.random() * selected.incorrect.length)];
			if (leftIsCorrect) {
				leftOption = selected.correct;
				rightOption = incorrectWord;
			} else {
				leftOption = incorrectWord;
				rightOption = selected.correct;
			}
		} else {
			// yesno mode: 50% chance of showing correct, 50% chance of showing incorrect
			yesNoIsCorrect = Math.random() < 0.5;
			if (yesNoIsCorrect) {
				yesNoWordShown = selected.correct;
			} else {
				yesNoWordShown = selected.incorrect[Math.floor(Math.random() * selected.incorrect.length)];
			}
		}

		if (gameMode === 'normal') {
			startTimer();
		}
	}

	// ── Start game ─────────────────────────────────────────────────────────────
	function startQuiz(mode: 'normal' | 'endless' | 'timeattack') {
		gameMode = mode;
		score = 0;
		streak = 0;
		maxStreak = 0;
		lives = 3;
		totalAnswered = 0;
		correctCount = 0;
		missedWords = [];
		currentMode = 'playing';
		endlessState = 'playing';
		stopAttackTimer();

		if (mode === 'timeattack') {
			startAttackTimer();
		}

		getNextQuestion();
	}

	// ── Shared Answer Result Handler ──────────────────────────────────────────
	function handleAnswerResult(isCorrect: boolean, errorDetail?: { shownWord: string }) {
		totalAnswered++;
		lastAnswerCorrect = isCorrect;

		if (isCorrect) {
			answerStatus = 'correct';
			playSFX('correct');
			if (gameMode !== 'endless') {
				score += 10 + Math.min(streak * 2, 20);
				streak++;
				if (streak > maxStreak) maxStreak = streak;
			}
			correctCount++;

			// Time Attack: +1 second bonus
			if (gameMode === 'timeattack') {
				attackTimeLeft = Math.min(attackTimeLeft + 1, 99);
			}
		} else {
			answerStatus = 'incorrect';
			playSFX('incorrect');
			if (gameMode !== 'endless') {
				streak = 0;

				// Track missed word
				if (currentQuestion) {
					if (!missedWords.some((w) => w.word.correct === currentQuestion!.correct)) {
						missedWords = [
							...missedWords,
							{
								word: currentQuestion,
								shownWord: errorDetail?.shownWord || currentQuestion.correct,
								userWasCorrect: false
							}
						];
					}
				}
			}

			if (gameMode === 'normal') {
				lives--;
				if (lives <= 0) {
					setTimeout(() => triggerGameOver(), 1200);
					return;
				}
			}
		}

		if (gameMode === 'endless') {
			endlessState = 'revealed';
		} else {
			setTimeout(() => {
				if (currentMode === 'playing') getNextQuestion();
			}, 1200);
		}
	}

	// ── Answer selection ───────────────────────────────────────────────────────
	function selectOption(side: 'left' | 'right') {
		if (currentMode !== 'playing' || answerStatus !== 'idle') return;
		stopTimer();
		chosenSide = side;

		const selectedCorrect =
			(side === 'left' && leftIsCorrect) || (side === 'right' && !leftIsCorrect);
		const shownWord = side === 'left' ? leftOption : rightOption;
		handleAnswerResult(selectedCorrect, { shownWord });
	}

	function selectYesNo(userChoice: boolean) {
		if (currentMode !== 'playing' || answerStatus !== 'idle') return;
		stopTimer();
		chosenSide = userChoice ? 'right' : 'left'; // Map right = true/correct, left = false/incorrect

		const selectedCorrect = userChoice === yesNoIsCorrect;
		handleAnswerResult(selectedCorrect, { shownWord: yesNoWordShown });
	}

	// ── Keyboard shortcuts ─────────────────────────────────────────────────────
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === ' ') {
			if (currentMode === 'playing' && gameMode === 'endless') {
				event.preventDefault();
				if (endlessState === 'playing') {
					revealAnswer();
				} else {
					loadNextQuestion();
				}
			} else {
				event.preventDefault();
				toggleFullscreen();
			}
			return;
		}

		if (currentMode !== 'playing') return;
		if (answerStatus !== 'idle') return;
		if (event.key === 'ArrowLeft') {
			activeKey = 'left';
			if (gameType === 'choices') {
				selectOption('left');
			} else {
				selectYesNo(false);
			}
			setTimeout(() => (activeKey = null), 150);
		} else if (event.key === 'ArrowRight') {
			activeKey = 'right';
			if (gameType === 'choices') {
				selectOption('right');
			} else {
				selectYesNo(true);
			}
			setTimeout(() => (activeKey = null), 150);
		}
	}

	// ── Game over ──────────────────────────────────────────────────────────────
	function triggerGameOver() {
		stopTimer();
		stopAttackTimer();
		currentMode = 'gameover';

		const scoreKey = `${gameType}_${gameMode}` as keyof typeof highScores;
		if (score > highScores[scoreKey]) {
			highScores[scoreKey] = score;
			if (typeof window !== 'undefined') {
				localStorage.setItem('codebreaker_spelling_highscores', JSON.stringify(highScores));
			}
		}
	}

	function goHome() {
		stopTimer();
		stopAttackTimer();
		if (countdownInterval) {
			clearInterval(countdownInterval);
			countdownInterval = null;
		}
		currentMode = 'selection';
	}

	function beginCountdown() {
		if (countdownInterval) clearInterval(countdownInterval);
		countdown = 3;
		currentMode = 'countdown';
		countdownInterval = setInterval(() => {
			countdown--;
			if (countdown <= 0) {
				clearInterval(countdownInterval);
				countdownInterval = null;
				startQuiz(gameMode);
			}
		}, 1000);
	}

	// Derived: formatted Time Attack clock display
	$: attackSeconds = Math.max(0, Math.ceil(attackTimeLeft));
	$: attackPct = Math.max(0, Math.min((attackTimeLeft / 60) * 100, 100));
	$: attackUrgent = attackTimeLeft < 15;
	$: currentHighScore = highScores[`${gameType}_${gameMode}` as keyof typeof highScores] || 0;
</script>

<svelte:window on:keydown={handleKeyDown} />

<svelte:head>
	<title>Chi Fun | สะกดศัพท์ ✏️</title>
	<meta name="description" content="เกมประลองคำสะกดภาษาไทย ค้นหาคำที่เขียนถูกต้องตามพจนานุกรม" />
</svelte:head>

<div id="spellingquiz-game-container" class="max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-4 flex flex-col gap-3 select-none">
	<div class="botanical-card bg-base-100 text-base-content text-base-content border border-base-300 rounded-3xl p-3 sm:p-6 shadow-2xl flex flex-col gap-3 relative overflow-hidden text-center">
		<div class="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

		<!-- 1. SELECT GAME MODE SCREEN -->
		{#if currentMode === 'selection'}
			<div class="flex items-center justify-between gap-2 border-b border-base-300/80 pb-2 text-left">
				<div class="flex items-center gap-2 overflow-hidden">
					<span class="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0"></span>
					<h1 class="text-base sm:text-xl font-extrabold text-base-content tracking-tight truncate">
						ควิซสะกดคำ <span class="text-xs text-base-content/70 font-medium hidden sm:inline">(Spelling Quiz)</span>
					</h1>
				</div>

				<div class="flex items-center gap-1 shrink-0">
					<button
						on:click={toggleFullscreen}
						class="btn btn-ghost btn-xs sm:btn-sm gap-1 text-primary hover:bg-primary/20"
						title={isFullscreen ? 'ออกจากเต็มจอ' : 'เต็มจอ'}
					>
						{#if isFullscreen}
							<Minimize2Icon size={16} />
							<span class="hidden sm:inline">ออกจากเต็มจอ</span>
						{:else}
							<Maximize2Icon size={16} />
							<span class="hidden sm:inline">เต็มจอ</span>
						{/if}
					</button>
					<a href="/puzzles/spellingquiz/leaderboard" class="btn btn-ghost btn-xs sm:btn-sm gap-1 text-base-content hover:bg-base-200">
						<AwardIcon size={16} />
						<span class="hidden sm:inline">ตารางคะแนน</span>
					</a>
				</div>
			</div>

			<!-- New Game Button -->
			<div class="w-full my-2">
				<button
					on:click={beginCountdown}
					class="btn btn-primary text-primary-content w-full py-4 rounded-2xl font-black text-xl sm:text-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3"
				>
					<PlayIcon size={28} />
					เริ่มเล่นเกมใหม่ 🚀
				</button>
			</div>

			<!-- Settings Dropdowns -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left my-2">
				<!-- Game Type Select -->
				<div class="flex flex-col gap-2">
					<label for="gameType" class="text-sm font-extrabold text-base-content flex items-center gap-1.5 px-1">
						✏️ วิธีเล่น
					</label>
					<select
						id="gameType"
						bind:value={gameType}
						class="select  w-full bg-base-300 text-base-content border-base-300 font-extrabold focus:border-primary text-sm sm:text-base py-2.5 h-auto rounded-2xl cursor-pointer"
					>
						<option value="choices">เลือกคำที่ถูก (2 ตัวเลือก)</option>
						<option value="yesno">ถูกหรือผิด? ❓</option>
					</select>
				</div>

				<!-- Game Mode Select -->
				<div class="flex flex-col gap-2">
					<label for="gameMode" class="text-sm font-extrabold text-base-content flex items-center gap-1.5 px-1">
						🏆 รูปแบบการเล่น
					</label>
					<select
						id="gameMode"
						bind:value={gameMode}
						class="select  w-full bg-base-300 text-base-content border-base-300 font-extrabold focus:border-primary text-sm sm:text-base py-2.5 h-auto rounded-2xl cursor-pointer"
					>
						<option value="normal">Normal (❤️ 3 ชีวิต)</option>
						<option value="timeattack">Time Attack (⚡ 60 วินาที)</option>
						<option value="endless">Endless (♾️ เล่นไปเรื่อยๆ)</option>
					</select>
				</div>
			</div>

			<!-- High Score Info -->
			{#if currentHighScore > 0}
				<div class="text-xs sm:text-sm font-bold text-primary bg-base-100 text-base-content p-3 rounded-2xl border border-base-300 my-1">
					👑 คะแนนสูงสุดในโหมดนี้: <span class="font-mono font-extrabold text-base-content">{currentHighScore}</span> คะแนน
				</div>
			{/if}

			<!-- Options Toggle -->
			<div
				class="card bg-base-100 text-base-content text-base-content shadow-lg w-full border border-base-300 mb-2"
			>
				<div class="card-body p-3 flex flex-row items-center justify-between gap-3">
					<div class="flex items-center gap-2">
						<div
							class="w-8 h-8 rounded-xl bg-base-100 flex items-center justify-center text-primary shadow-inner"
						>
							<CompassIcon size={16} />
						</div>
						<div class="flex flex-col items-start text-left">
							<span class="text-xs sm:text-sm font-extrabold text-primary"
								>รวมคำทับศัพท์ต่างประเทศ</span
							>
							<span class="text-[10px] opacity-75 leading-tight">
								เช่น ดิจิทัล, อัปเดต, เว็บไซต์ ({wordDatabase.filter((w) => w.isLoanWord).length} คำ)
							</span>
						</div>
					</div>

					<div class="flex flex-col gap-2">
						<label class="label cursor-pointer gap-2 p-0">
							<input
								type="checkbox"
								class="toggle toggle-sm toggle-primary"
								bind:checked={includeLoanWords}
							/>
						</label>
					</div>
				</div>
			</div>

			<div
				class="alert alert-info shadow-md text-left p-3 flex items-start gap-2 border border-info/30 bg-info mt-2"
			>
				<HelpCircleIcon class="flex-shrink-0 mt-0.5 text-info-content" size={20} />
				<p class="text-xs sm:text-sm leading-relaxed text-info-content">
					<b>คำแนะนำ:</b> ใช้เมาส์คลิกคำตอบ หรือใช้ปุ่มลูกศรซ้าย
					<kbd class="kbd kbd-sm">◀</kbd>
					และขวา <kbd class="kbd kbd-sm">▶</kbd> บนคีย์บอร์ด
				</p>
			</div>

			<!-- Dictionary Button -->
			<a
				href="/resources/spellingdictionary"
				class="card bg-base-100 text-base-content text-base-content shadow-md hover:shadow-xl hover:border-primary border border-transparent transition-all duration-300 hover:-translate-y-0.5 block w-full"
			>
				<div class="card-body p-4 flex flex-row items-center gap-4 justify-center">
					<div
						class="w-10 h-10 rounded-xl bg-base-100 flex items-center justify-center text-primary shadow-inner"
					>
						<BookOpenIcon size={20} />
					</div>
					<div class="flex flex-col items-start text-left flex-1">
						<span class="text-sm sm:text-base font-extrabold text-primary">คลังคำสะกดในระบบ</span>
						<span class="text-xs opacity-75 mt-0.5"
							>อ่านทบทวนคำสะกดที่มักสะกดผิดบ่อยทั้งหมด {wordDatabase.length} คำ</span
						>
					</div>
				</div>
			</a>

			<!-- 2. COUNTDOWN SCREEN -->
		{:else if currentMode === 'countdown'}
			<div class="flex flex-col items-center justify-center gap-6 py-16 select-none">
				<p
					class="text-sm font-black uppercase tracking-widest opacity-70 text-secondary animate-pulse"
				>
					เตรียมพร้อม!
				</p>
				<div
					class="text-[9rem] sm:text-[12rem] font-black leading-none text-primary transition-all duration-300 drop-shadow-2xl tabular-nums"
					style="text-shadow: 0 0 80px hsl(var(--p) / 0.55);"
				>
					{countdown}
				</div>
				<p class="text-sm opacity-60 font-bold">
					{gameMode === 'normal'
						? '❤️ Normal Mode'
						: gameMode === 'timeattack'
						? '⚡ Time Attack'
						: '♾️ Endless Mode'}
				</p>
				<button on:click={goHome} class="btn btn-ghost btn-sm opacity-50 hover:opacity-100 mt-2">
					ยกเลิก
				</button>
			</div>

			<!-- 2. GAME PLAYING SCREEN -->
		{:else if currentMode === 'playing'}
			<div id="spelling-game-container" class="w-full flex flex-col gap-4">
				<!-- Top Bar with Back, Quit and Maximize Toggle -->
				<div class="flex justify-between items-center px-1">
					<div class="flex gap-2">
						<button
							on:click={goHome}
							class="btn btn-ghost btn-sm gap-1.5 opacity-60 hover:opacity-100 text-base-content font-bold"
						>
							<ArrowLeftIcon size={14} /> กลับหน้าหลัก
						</button>
						<button
							on:click={triggerGameOver}
							class="btn btn-ghost btn-sm gap-1.5 text-error-content font-bold hover:bg-error/10 border-none rounded-xl"
						>
							<XCircleIcon size={14} /> จบเกม
						</button>
					</div>
					<button
						on:click={toggleFullscreen}
						class="btn btn-ghost btn-sm gap-1.5 text-base-content font-bold bg-base-100 text-base-content hover:bg-base-100 text-base-content border-none rounded-xl"
					>
						{#if isFullscreen}
							<Minimize2Icon size={14} /> ย่อขนาด{#if gameMode !== 'endless'}<span class="opacity-50 text-[10px] ml-1 font-mono">[Space]</span>{/if}
						{:else}
							<Maximize2Icon size={14} /> ขยายเต็มจอ{#if gameMode !== 'endless'}<span class="opacity-50 text-[10px] ml-1 font-mono">[Space]</span>{/if}
						{/if}
					</button>
				</div>

				<!-- Score board and stats -->
				{#if gameMode === 'endless'}
					<div
						class="flex items-center justify-center bg-base-100 text-base-content text-base-content rounded-2xl border border-base-300 py-3 px-6 shadow text-sm sm:text-base font-bold transition-all duration-300 {isFullscreen ? 'py-1.5 px-3 text-xs sm:text-sm' : ''}"
					>
						<span>🎯 โหมดฝึกซ้อมสะกดคำ (ไม่มีการสะสมคะแนน)</span>
					</div>
				{:else}
					<div
						class="botanical-card flex items-center justify-between bg-base-100 text-base-content text-base-content rounded-2xl border border-base-300 transition-all duration-300 {isFullscreen ? 'p-2 px-4 text-xs sm:text-sm' : 'p-4 px-6 text-sm sm:text-lg font-bold shadow-lg'}"
					>
						<div class="flex items-center gap-6">
							<span
								>คะแนน: <span class="text-primary font-black font-mono transition-all duration-300 {isFullscreen ? 'text-sm sm:text-lg' : 'text-lg sm:text-2xl'}"
									>{score}</span
								></span
							>
							<span
								>คอมโบ: <span class="text-accent-content font-black font-mono transition-all duration-300 {isFullscreen ? 'text-sm sm:text-lg' : 'text-lg sm:text-2xl'}"
									>🔥 {streak}</span
								></span
							>
						</div>
						<div class="flex items-center gap-3">
							{#if gameMode === 'normal'}
								<span class="opacity-60 text-xs sm:text-sm font-bold mr-1">ชีวิต:</span>
								<span class="flex items-center gap-1">
									{#each Array(3) as _, i}
										<HeartIcon
											size={isFullscreen ? "14" : "20"}
											class={i < lives ? 'text-error-content fill-error filter drop-shadow' : 'opacity-20'}
										/>
									{/each}
								</span>
							{:else if gameMode === 'timeattack'}
								<ClockIcon
									size={isFullscreen ? "14" : "18"}
									class="opacity-70 {attackUrgent ? 'text-error-content animate-pulse' : ''}"
								/>
								<span
									class="font-mono font-black transition-all duration-300 {attackUrgent
										? 'text-error-content animate-pulse'
										: 'text-warning-content'} {isFullscreen ? 'text-sm sm:text-base' : 'text-lg sm:text-2xl'}"
								>
									{attackSeconds}s
								</span>
							{:else}
								<span
									>ความแม่นยำ: <span class="text-success-content font-black font-mono transition-all duration-300 {isFullscreen ? 'text-sm sm:text-lg' : 'text-lg sm:text-2xl'}"
										>{totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0}%</span
									></span
								>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Timer bars (Normal per-question, Time Attack global) -->
				{#if gameMode === 'normal'}
					<div
						class="w-full bg-base-300/40 rounded-full overflow-hidden relative border border-base-300 shadow-inner transition-all duration-300 {isFullscreen ? 'h-1.5' : 'h-3 sm:h-4'}"
					>
						<div
							class="h-full rounded-full transition-all duration-100 ease-linear {timeLeft > 2.5
								? 'bg-gradient-to-r from-success to-warning'
								: 'bg-gradient-to-r from-warning to-error animate-pulse'}"
							style="width: {(timeLeft / 5) * 100}%"
						/>
					</div>
				{:else if gameMode === 'timeattack'}
					<div
						class="w-full bg-base-300/40 rounded-full overflow-hidden relative border border-base-300 shadow-inner transition-all duration-300 {isFullscreen ? 'h-1.5' : 'h-3 sm:h-4'}"
					>
						<div
							class="h-full rounded-full transition-all duration-100 ease-linear {attackUrgent
								? 'bg-gradient-to-r from-warning to-error animate-pulse'
								: 'bg-gradient-to-r from-warning to-success'}"
							style="width: {attackPct}%"
						/>
					</div>
				{/if}

				<!-- Question instruction -->
				<div class="text-center py-1 sm:py-2">
					<span
						class="text-sm sm:text-lg opacity-85 font-extrabold tracking-wider block uppercase text-secondary"
					>
						{#if gameType === 'choices'}
							เลือกคำที่สะกดถูก
						{:else}
							คำนี้สะกดได้ถูกต้องหรือไม่?
						{/if}
					</span>
				</div>

				<!-- QUESTION RENDER ZONE -->
				{#if gameType === 'choices'}
					<!-- Left and Right choice panels — stacked on mobile, side-by-side on sm+ -->
					<div class="flex flex-col sm:grid sm:grid-cols-2 gap-4 w-full">
						<!-- Left Choice Card -->
						<button
							on:click={() => selectOption('left')}
							class="card bg-base-100 text-base-content text-base-content border-2 shadow-md cursor-pointer hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex flex-col items-center justify-center p-4 relative overflow-hidden group
								{isFullscreen ? 'h-24 sm:h-32 md:h-40' : 'h-28 sm:h-44'}
								{(endlessState === 'revealed' || answerStatus !== 'idle')
									? (leftIsCorrect
										? 'border-success bg-success/20 text-success-content pointer-events-none'
										: (chosenSide === 'left'
											? 'border-error bg-error/20 text-error-content animate-shake pointer-events-none'
											: 'opacity-40 border-base-300 pointer-events-none'))
									: (activeKey === 'left'
										? 'border-primary bg-primary/10'
										: 'border-base-300 hover:border-primary')}"
						>
							<!-- Key shortcut indicator -->
							<div
								class="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 opacity-80"
							>
								<kbd class="kbd kbd-md font-mono text-sm font-black shadow-lg">◀</kbd>
							</div>

							<span
								class="font-black tracking-wide filter drop-shadow-md transition-transform group-hover:scale-105
									{isFullscreen ? 'text-2xl sm:text-4xl md:text-5xl' : 'text-3xl sm:text-5xl'}"
							>
								{leftOption}
							</span>
						</button>

						<!-- Right Choice Card -->
						<button
							on:click={() => selectOption('right')}
							class="card bg-base-100 text-base-content text-base-content border-2 shadow-md cursor-pointer hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex flex-col items-center justify-center p-4 relative overflow-hidden group
								{isFullscreen ? 'h-24 sm:h-32 md:h-40' : 'h-28 sm:h-44'}
								{(endlessState === 'revealed' || answerStatus !== 'idle')
									? (!leftIsCorrect
										? 'border-success bg-success/20 text-success-content pointer-events-none'
										: (chosenSide === 'right'
											? 'border-error bg-error/20 text-error-content animate-shake pointer-events-none'
											: 'opacity-40 border-base-300 pointer-events-none'))
									: (activeKey === 'right'
										? 'border-primary bg-primary/10'
										: 'border-base-300 hover:border-primary')}"
						>
							<!-- Key shortcut indicator -->
							<div
								class="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 opacity-80"
							>
								<kbd class="kbd kbd-md font-mono text-sm font-black shadow-lg">▶</kbd>
							</div>

							<span
								class="font-black tracking-wide filter drop-shadow-md transition-transform group-hover:scale-105
									{isFullscreen ? 'text-2xl sm:text-4xl md:text-5xl' : 'text-3xl sm:text-5xl'}"
							>
								{rightOption}
							</span>
						</button>
					</div>
				{:else}
					<!-- Yes/No Mode layout: One giant word in the center and correct/incorrect choices below -->
					<div class="flex flex-col gap-4 w-full">
						<!-- Giant Word Card -->
						<div
							class="card bg-base-100 text-base-content text-base-content border-2 border-base-300 shadow-xl p-8 py-10 sm:py-14 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300
								{isFullscreen ? 'min-h-[120px] sm:min-h-[160px] md:min-h-[200px]' : 'min-h-[160px] sm:min-h-[220px]'}"
						>
							<span
								class="font-black tracking-tight filter drop-shadow-md text-base-content select-text transition-all duration-300
									{isFullscreen ? 'text-3xl sm:text-5xl md:text-6xl' : 'text-4xl sm:text-6xl'}"
							>
								{yesNoWordShown}
							</span>
						</div>

						<div class="grid grid-cols-2 gap-4 w-full">
							<!-- Incorrect Choice Card (Left) -->
							<button
								on:click={() => selectYesNo(false)}
								class="card bg-base-100 text-base-content text-base-content border-2 shadow-lg cursor-pointer hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex flex-col items-center justify-center p-4 relative overflow-hidden group
									{isFullscreen ? 'h-20 sm:h-28 md:h-32' : 'h-24 sm:h-36'}
									{(endlessState === 'revealed' || answerStatus !== 'idle')
										? (!yesNoIsCorrect
											? 'border-success bg-success/20 text-success-content pointer-events-none'
											: (chosenSide === 'left'
												? 'border-error bg-error/20 text-error-content animate-shake pointer-events-none'
												: 'opacity-40 border-base-300 pointer-events-none'))
										: (activeKey === 'left'
											? 'border-error bg-error/15 text-error-content shadow-inner'
											: 'border-base-300 hover:border-error hover:bg-error/5 hover:text-error-content')}"
							>
								<div
									class="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 opacity-80"
								>
									<kbd class="kbd kbd-md font-mono text-sm font-black shadow-lg">◀</kbd>
								</div>
								<span
									class="font-black tracking-wider flex items-center gap-1 sm:gap-2
										{isFullscreen ? 'text-xl sm:text-3xl' : 'text-2xl sm:text-4xl'}"
								>
									❌ ผิด
								</span>
							</button>

							<!-- Correct Choice Card (Right) -->
							<button
								on:click={() => selectYesNo(true)}
								class="card bg-base-100 text-base-content text-base-content border-2 shadow-lg cursor-pointer hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex flex-col items-center justify-center p-4 relative overflow-hidden group
									{isFullscreen ? 'h-20 sm:h-28 md:h-32' : 'h-24 sm:h-36'}
									{(endlessState === 'revealed' || answerStatus !== 'idle')
										? (yesNoIsCorrect
											? 'border-success bg-success/20 text-success-content pointer-events-none'
											: (chosenSide === 'right'
												? 'border-error bg-error/20 text-error-content animate-shake pointer-events-none'
												: 'opacity-40 border-base-300 pointer-events-none'))
										: (activeKey === 'right'
											? 'border-success bg-success/15 text-success-content shadow-inner'
											: 'border-base-300 hover:border-success hover:bg-success/5 hover:text-success-content')}"
							>
								<div
									class="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 opacity-80"
								>
									<kbd class="kbd kbd-md font-mono text-sm font-black shadow-lg">▶</kbd>
								</div>
								<span
									class="font-black tracking-wider flex items-center gap-1 sm:gap-2
										{isFullscreen ? 'text-xl sm:text-3xl' : 'text-2xl sm:text-4xl'}"
								>
									✔️ ถูก
								</span>
							</button>
						</div>
					</div>
				{/if}

				<!-- Endless Mode action buttons -->
				{#if gameMode === 'endless'}
					<div class="flex justify-center my-4">
						<button
							on:click={endlessState === 'playing' ? revealAnswer : loadNextQuestion}
							class="btn btn-secondary btn-wide font-black text-lg gap-2 shadow-md rounded-2xl py-3 h-auto"
						>
							{#if endlessState === 'playing'}
								👁️ เฉลย (Space)
							{:else}
								➡️ คำถัดไป (Space)
							{/if}
						</button>
					</div>
				{/if}

				<!-- Word explanation in play zone -->
				{#if (endlessState === 'revealed' || answerStatus !== 'idle') && currentQuestion && currentQuestion.explanation}
					<div class="botanical-card mt-2 p-4 bg-base-100 text-base-content border border-base-300 rounded-2xl text-left max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
						<p class="text-sm text-primary font-black mb-1">💡 คำอธิบาย:</p>
						<p class="text-xs sm:text-sm text-base-content leading-relaxed">
							{currentQuestion.explanation}
						</p>
					</div>
				{/if}

				<!-- Fixed-height feedback zone — always occupies space to prevent layout shift -->
				<div class="h-12 flex items-center justify-center my-1">
					{#if answerStatus === 'correct'}
						<div
							class="flex items-center gap-2.5 text-success-content font-black text-base sm:text-xl animate-in fade-in slide-in-from-bottom-3 duration-200"
						>
							<CheckCircleIcon size={22} />
							ถูกต้อง! {#if gameMode === 'timeattack'}<span
									class="text-warning-content font-black ml-1 animate-bounce">+1s ⚡</span
								>{/if}
						</div>
					{:else if answerStatus === 'incorrect'}
						<div
							class="flex items-center gap-2.5 text-error-content font-black text-base sm:text-xl animate-in fade-in slide-in-from-bottom-3 duration-200"
						>
							<XCircleIcon size={22} />
							{chosenSide !== null ? 'ตอบผิด!' : 'หมดเวลา!'}
						</div>
					{/if}
				</div>

			</div>

			<!-- 3. GAMEOVER STATS SCREEN -->
		{:else if currentMode === 'gameover'}
			<div class="flex flex-col items-center text-center gap-4 max-w-xl mx-auto py-2">
				<div class="flex flex-col gap-1">
					<h2 class="text-2xl sm:text-4xl font-black text-warning-content">สรุปผล 🎉</h2>
					<p class="text-xs font-extrabold tracking-wide uppercase opacity-75">
						รูปแบบ: {gameType === 'choices' ? 'เลือกคำที่สะกดถูก' : 'ถูกหรือผิด?'} • โหมด: {gameMode === 'normal' ? 'Normal' : gameMode === 'timeattack' ? 'Time Attack ⚡' : 'Endless'}
					</p>
				</div>

				<!-- Stats card (Single Line) -->
				<div class="botanical-card flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 bg-base-100 text-base-content text-base-content rounded-xl p-3 px-4 border border-base-300 w-full text-xs sm:text-sm font-extrabold shadow-md">
					<span>คะแนน: <span class="text-primary font-black font-mono text-base">{score}</span></span>
					<span class="opacity-30">|</span>
					<span>ความแม่นยำ: <span class="text-success-content font-black font-mono text-base">{totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0}%</span></span>
					<span class="opacity-30">|</span>
					<span>ตอบทั้งหมด: <span class="text-secondary font-black font-mono text-base">{totalAnswered} คำ</span></span>
					<span class="opacity-30">|</span>
					<span>คอมโบสูงสุด: <span class="text-warning-content font-black font-mono text-base">🔥 {maxStreak}</span></span>
				</div>

				<!-- High Score celebration -->
				{#if score >= getHighScore(gameType, gameMode)}
					<div class="badge badge-warning font-black py-1.5 px-3 animate-bounce text-xs shadow-md">
						👑 New Record!!
					</div>
				{/if}

				<!-- Global Leaderboard Submit -->
				{#if score > 0}
					<div class="card bg-base-100 text-base-content border border-base-300 shadow-md w-full">
						<div class="card-body p-3 flex flex-col gap-2.5">
							<p class="text-xs font-black text-base-content flex items-center gap-1.5">
								<AwardIcon size={14} class="text-warning-content" />
								ส่งคะแนนขึ้นกระดานโลก
							</p>
							{#if submitStatus === 'success'}
								<div class="alert alert-success text-xs font-bold py-1.5 px-3">✅ ส่งคะแนนสำเร็จ! ดูอันดับได้ในตารางคะแนนทั่วโลก</div>
							{:else if submitStatus === 'duplicate'}
								<div class="alert alert-warning text-xs font-bold py-1.5 px-3">⚠️ ชื่อนี้เคยส่งคะแนนไปแล้ว</div>
							{:else if submitStatus === 'error'}
								<div class="alert alert-error text-xs font-bold py-1.5 px-3">❌ {submitError}</div>
							{:else}
								<div class="flex gap-2">
									<input
										type="text"
										bind:value={submitName}
										placeholder="ชื่อของคุณ..."
										maxlength="20"
										class="input  input-sm flex-1 bg-base-100 text-xs font-bold focus:border-primary"
										on:keydown={(e) => e.key === 'Enter' && submitToLeaderboard()}
									/>
									<button
										on:click={submitToLeaderboard}
										disabled={submitStatus === 'loading' || !submitName.trim()}
										class="btn btn-warning btn-sm gap-2 font-black"
									>
										{#if submitStatus === 'loading'}
											<span class="loading loading-spinner loading-xs" />
										{:else}
											<SendIcon size={12} /> ส่ง
										{/if}
									</button>
								</div>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Action Buttons -->
				<div class="flex flex-col sm:flex-row gap-2 w-full mt-1">
					<button
						on:click={beginCountdown}
						class="btn btn-primary flex-1 gap-2 btn-sm sm:btn-md font-black text-xs sm:text-sm shadow-md"
					>
						<RefreshCwIcon size={14} />
						เล่นอีกรอบ!
					</button>
					<button
						on:click={goHome}
						class="btn btn-outline flex-1 gap-2 btn-sm sm:btn-md font-black text-xs sm:text-sm shadow-md"
					>
						<ArrowLeftIcon size={14} />
						กลับหน้าหลัก
					</button>
					<a
						href="/puzzles/spellingquiz/leaderboard"
						class="btn btn-outline btn-warning flex-1 gap-2 btn-sm sm:btn-md font-black text-xs sm:text-sm shadow-md"
					>
						<AwardIcon size={14} />
						ตารางคะแนน
					</a>
				</div>

				<!-- Missed Words List -->
				{#if missedWords.length > 0}
					<div
						class="card bg-base-100 text-base-content text-base-content shadow-lg w-full text-left border border-base-300 mt-2"
					>
						<div class="card-body p-4 sm:p-5">
							<h3 class="text-sm sm:text-base font-black text-error-content flex items-center gap-2 mb-2">
								<BookOpenIcon size={18} class="hidden sm:inline" />
								ข้อที่ตอบผิด ({missedWords.length} คำ)
							</h3>

							<div class="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
								{#each missedWords as item, idx}
									<div
										class="p-2.5 bg-base-100 rounded-xl flex flex-col gap-1.5 shadow-inner border border-base-300"
									>
										<div class="flex flex-wrap items-center justify-between gap-1">
											<div class="flex items-center gap-2 text-sm">
												<span class="badge badge-error badge-sm text-[9px] font-black"
													># {idx + 1}</span
												>
												<span class="text-success-content font-black flex items-center gap-1">
													✅ {item.word.correct}
												</span>
												<span class="text-xs opacity-40 font-bold">VS</span>
												<span class="text-error-content font-extrabold line-through">
													{item.word.incorrect[0]}
												</span>
											</div>
										</div>
										{#if item.word.explanation}
											<p
												class="text-xs opacity-90 bg-base-100 text-base-content p-2.5 rounded-lg border-l-4 border-primary leading-relaxed mt-1"
											>
												💡 <b>คำอธิบาย:</b>
												{item.word.explanation}
											</p>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	:global(.animate-shake) {
		animation: shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
	}
	@keyframes shake {
		10%,
		90% {
			transform: translate3d(-1px, 0, 0);
		}
		20%,
		80% {
			transform: translate3d(2px, 0, 0);
		}
		30%,
		50%,
		70% {
			transform: translate3d(-4px, 0, 0);
		}
		40%,
		60% {
			transform: translate3d(4px, 0, 0);
		}
	}
	@keyframes animate-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-in {
		animation: animate-in 0.25s ease both;
	}
	#spelling-game-container:fullscreen {
		width: 100vw !important;
		height: 100vh !important;
		max-width: none !important;
		max-height: none !important;
		border: none !important;
		border-radius: 0 !important;
		background: var(--color-base-200) !important;
		color: var(--color-base-content);
		padding: 2rem !important;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
