<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import AwardIcon from '@lucide/svelte/icons/award';
import ClockIcon from '@lucide/svelte/icons/clock';
import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
import PlayIcon from '@lucide/svelte/icons/play';
import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
import CheckCircleIcon from '@lucide/svelte/icons/circle-check';
import XCircleIcon from '@lucide/svelte/icons/circle-x';
import BookOpenIcon from '@lucide/svelte/icons/book-open';
import ZapIcon from '@lucide/svelte/icons/zap';
import SendIcon from '@lucide/svelte/icons/send';
import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
import Volume2Icon from '@lucide/svelte/icons/volume-2';
import VolumeXIcon from '@lucide/svelte/icons/volume-x';
import RadioIcon from '@lucide/svelte/icons/radio';
import SettingsIcon from '@lucide/svelte/icons/settings';
import MicIcon from '@lucide/svelte/icons/mic';

	import { THAI_QUIZ_CATEGORIES } from '#lib/data/puzzles/thaiquiz/catalog.js';
	import type { ThaiQuizCategory } from '#lib/data/puzzles/thaiquiz/types.js';
	import {
		answerQuizQuestion,
		rateQuizQuestion,
		startQuizSession,
		type DeliveredQuizQuestion,
		type QuizAnswerResult
	} from '#lib/quiz/client.js';
	import {
		initVoices,
		speakThai,
		stopSpeech,
		playQuizShowSound
	} from '#lib/utils/tts.js';
	import { loadMastery, masteryLabel, masteryPercent, recordMastery, type MasteryMap } from '#lib/quiz/mastery.js';

	// Top-Level Main Style Mode
	let activeStyleTab: 'quizshow' | 'normal' = 'quizshow';

	// Sub-modes for Normal style
	type NormalGameMode = 'daily' | 'timeattack' | 'survival' | 'category' | 'endless';
	let selectedNormalMode: NormalGameMode = 'timeattack';
	let selectedCategory: ThaiQuizCategory | 'all' = 'all';

	// Views
	let currentView: 'selection' | 'countdown' | 'playing_normal' | 'playing_quizshow' | 'summary' = 'selection';

	// Question Deck
	interface QuizQuestionInstance extends DeliveredQuizQuestion {
		category: ThaiQuizCategory;
		correctIndex: number;
		explanation: string;
		acceptableAnswers: string[];
		tags: string[];
	}
	let questions: QuizQuestionInstance[] = [];
	let quizSessionId = '';
	let sessionTotal = 0;
	let sessionScoreOffset = 0;
	let currentQIdx = 0;
	let userAnswers: Array<{
		question: QuizQuestionInstance;
		chosenText: string;
		isCorrect: boolean;
		pointsEarned: number;
		buzzedCharIndex?: number;
	}> = [];

	// Stats
	let score = 0;
	let streak = 0;
	let maxStreak = 0;
	let lives = 3;
	let correctCount = 0;

	// Normal Mode Timers & State
	let timeLeft = 60;
	let timerInterval: any = null;
	let countdown = 3;
	let countdownInterval: any = null;
	let selectedChoiceIdx: number | null = null;
	let isAnswering = false;

	// =========================================================================
	// QUIZ SHOW (JAPANESE 早押し HAYAOSHI) & TTS SETTINGS STATE
	// =========================================================================
	let isTTSMuted = false;
	let speechRate = 1.0;
	let showVoiceModal = false;
	let isTestingVoice = false;
	let thaiVoices: SpeechSynthesisVoice[] = [];
	let selectedVoiceURI = '';

	// Speech-to-Text Recognition State
	let isListening = false;
	let speechRecognition: any = null;
	let speechRecognitionSupported = false;

	let revealedCharCount = 0;
	let revealInterval: any = null;
	let isTextRevealing = false;
	let quizShowState: 'revealing' | 'buzzed' | 'incorrect_paused' | 'solved' | 'timeout' = 'revealing';
	let buzzInput = '';
	let buzzInputElement: HTMLInputElement | null = null;
	let feedbackMessage = '';

	// Leaderboard Submission
	let submitName = '';
	let submitStatus: 'idle' | 'loading' | 'success' | 'error' | 'duplicate' = 'idle';
	let submitError = '';
	let pendingTimeouts = new Set<any>();
	let mastery: MasteryMap = {};
	let questionRatings: Record<string, -1 | 1 | 'pending'> = {};

	onMount(() => {
		if (typeof window !== 'undefined') {
			mastery = loadMastery();
			const saved = localStorage.getItem('codebreaker_player_name');
			if (saved) submitName = saved;

			const savedRate = localStorage.getItem('cb_tts_rate');
			if (savedRate) speechRate = parseFloat(savedRate) || 1.0;

			const savedVoice = localStorage.getItem('cb_tts_voice_uri');
			if (savedVoice) selectedVoiceURI = savedVoice;

			initVoices((voices) => {
				thaiVoices = voices;
				if (!selectedVoiceURI && voices.length > 0) {
					selectedVoiceURI = voices[0].voiceURI;
				}
			});

			initSpeechRecognition();
		}
	});

	onDestroy(() => {
		stopAllTimersAndAudio();
	});

	function initSpeechRecognition() {
		if (typeof window !== 'undefined') {
			const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
			if (SpeechRecognitionClass) {
				speechRecognitionSupported = true;
				speechRecognition = new SpeechRecognitionClass();
				speechRecognition.lang = 'th-TH';
				speechRecognition.continuous = false;
				speechRecognition.interimResults = true;

				speechRecognition.onresult = (event: any) => {
					let transcript = '';
					for (let i = 0; i < event.results.length; i++) {
						transcript += event.results[i][0].transcript;
					}
					buzzInput = transcript;
				};

				speechRecognition.onerror = (e: any) => {
					console.error('Speech recognition error:', e);
					isListening = false;
				};

				speechRecognition.onend = () => {
					const shouldSubmit = isListening && quizShowState === 'buzzed' && buzzInput.trim().length > 0;
					isListening = false;
					if (shouldSubmit) {
						handleBuzzAnswerSubmit();
					}
				};
			}
		}
	}

	function toggleSpeechRecognition() {
		if (!speechRecognition) return;
		if (isListening) {
			speechRecognition.stop();
			isListening = false;
		} else {
			try {
				buzzInput = '';
				speechRecognition.start();
				isListening = true;
			} catch (e) {
				console.error(e);
			}
		}
	}

	function saveVoiceSettings() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('cb_tts_rate', speechRate.toString());
			if (selectedVoiceURI) {
				localStorage.setItem('cb_tts_voice_uri', selectedVoiceURI);
			}
		}
	}

	async function testVoiceSample() {
		isTestingVoice = true;
		await speakThai('ยินดีต้อนรับสู่ Quiz โดย One Piece และ DNA', {
			voiceURI: selectedVoiceURI,
			rate: speechRate
		});
		isTestingVoice = false;
	}

	function stopAllTimersAndAudio() {
		clearInterval(timerInterval);
		clearInterval(countdownInterval);
		clearInterval(revealInterval);
		for (const timeout of pendingTimeouts) clearTimeout(timeout);
		pendingTimeouts.clear();
		if (isListening && speechRecognition) {
			try { speechRecognition.stop(); } catch (e) {}
			isListening = false;
		}
		stopSpeech();
	}

	function schedule(callback: () => void, delayMs: number) {
		const timeout = setTimeout(() => {
			pendingTimeouts.delete(timeout);
			callback();
		}, delayMs);
		pendingTimeouts.add(timeout);
		return timeout;
	}

	function toClientQuestion(question: DeliveredQuizQuestion): QuizQuestionInstance {
		return {
			...question,
			category: question.category as ThaiQuizCategory,
			correctIndex: -1,
			explanation: '',
			acceptableAnswers: [],
			tags: []
		};
	}

	function getDailySeed(): number {
		const date = new Date();
		return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
	}

	// ─── START GAME FLOW ────────────────────────────────────────────────────────

	async function startCountdown(style: 'normal' | 'quizshow', mode: NormalGameMode = 'timeattack', category: ThaiQuizCategory | 'all' = 'all') {
		stopAllTimersAndAudio();
		activeStyleTab = style;
		selectedNormalMode = mode;
		selectedCategory = category;
		const count = style === 'quizshow' ? 10 : mode === 'endless' ? 50 : mode === 'category' ? 10 : mode === 'survival' ? 40 : 30;
		try {
			const session = await startQuizSession({
				type: style === 'quizshow' ? 'quizshow' : 'thaiquiz',
				count,
				category: category === 'all' ? undefined : category,
				mode
			});
			quizSessionId = session.sessionId;
			sessionTotal = session.total;
			sessionScoreOffset = 0;
			questions = [toClientQuestion(session.firstQuestion)];
		} catch (error) {
			feedbackMessage = error instanceof Error ? error.message : 'ไม่สามารถเริ่มเกมได้';
			return;
		}

		currentQIdx = 0;
		userAnswers = [];
		score = 0;
		streak = 0;
		maxStreak = 0;
		lives = 3;
		correctCount = 0;
		selectedChoiceIdx = null;
		isAnswering = false;
		submitStatus = 'idle';

		countdown = 3;
		currentView = 'countdown';
		countdownInterval = setInterval(() => {
			countdown--;
			if (countdown <= 0) {
				clearInterval(countdownInterval);
				if (activeStyleTab === 'quizshow') {
					startQuizShowQuestion(0);
				} else {
					beginNormalPlaying();
				}
			}
		}, 1000);
	}

	// ─── NORMAL MODE HANDLERS ───────────────────────────────────────────────────

	function beginNormalPlaying() {
		currentView = 'playing_normal';
		if (selectedNormalMode === 'timeattack') {
			timeLeft = 60;
			clearInterval(timerInterval);
			timerInterval = setInterval(() => {
				if (timeLeft > 0) {
					timeLeft--;
				} else {
					finishGame();
				}
			}, 1000);
		}
	}

	async function handleChoiceClick(idx: number) {
		if (isAnswering || currentView !== 'playing_normal') return;
		const currentQ = questions[currentQIdx];
		if (!currentQ) return;

		isAnswering = true;
		selectedChoiceIdx = idx;

		let result: QuizAnswerResult;
		try {
			result = await answerQuizQuestion({
				sessionId: quizSessionId,
				questionId: currentQ.id,
				choiceIndex: idx,
				timeRemainingRatio: selectedNormalMode === 'timeattack' ? timeLeft / 60 : 1
			});
		} catch (error) {
			isAnswering = false;
			feedbackMessage = error instanceof Error ? error.message : 'ตรวจคำตอบไม่สำเร็จ';
			return;
		}
		currentQ.correctIndex = result.correctIndex;
		currentQ.explanation = result.explanation;
		const isCorrect = result.isCorrect;
		mastery = recordMastery(currentQ.category, isCorrect);
		const points = result.points;
		score = sessionScoreOffset + result.totalScore;
		streak = result.streak;
		maxStreak = result.maxStreak;

		if (isCorrect) {
			playQuizShowSound('correct');
			correctCount++;
		} else {
			playQuizShowSound('wrong');
			if (selectedNormalMode === 'survival') {
				lives--;
			}
		}

		userAnswers = [
			...userAnswers,
			{
				question: currentQ,
				chosenText: currentQ.choices[idx],
				isCorrect,
				pointsEarned: points
			}
		];
		if (result.nextQuestion) questions = [...questions, toClientQuestion(result.nextQuestion)];

		schedule(() => {
			selectedChoiceIdx = null;
			isAnswering = false;

			if (selectedNormalMode === 'survival' && lives <= 0) {
				finishGame();
				return;
			}

			const nextIdx = currentQIdx + 1;
			if (result.isCompleted) {
				if (selectedNormalMode === 'endless') startEndlessContinuation();
				else finishGame();
			} else {
				currentQIdx = nextIdx;
			}
		}, 600);
	}

	async function startEndlessContinuation() {
		const session = await startQuizSession({ type: 'thaiquiz', count: 50, mode: 'endless' });
		quizSessionId = session.sessionId;
		sessionTotal += session.total;
		sessionScoreOffset = score;
		questions = [...questions, toClientQuestion(session.firstQuestion)];
		currentQIdx++;
	}

	// ─── JAPANESE QUIZ SHOW (早押し HAYAOSHI) ENGINE ────────────────────────────

	function startQuizShowQuestion(idx: number) {
		stopAllTimersAndAudio();
		currentQIdx = idx;
		currentView = 'playing_quizshow';
		quizShowState = 'revealing';
		revealedCharCount = 0;
		buzzInput = '';
		feedbackMessage = '';

		const currentQ = questions[idx];
		if (!currentQ) {
			finishGame();
			return;
		}

		resumeQuestionRevealAndAudio();
	}

	function resumeQuestionRevealAndAudio() {
		const currentQ = questions[currentQIdx];
		if (!currentQ) return;

		quizShowState = 'revealing';
		isTextRevealing = true;
		feedbackMessage = '';

		const fullText = currentQ.question;
		const remainingText = fullText.slice(revealedCharCount);

		// Start / resume TTS from current revealed point if audio enabled
		if (!isTTSMuted) {
			speakThai(remainingText, {
				voiceURI: selectedVoiceURI,
				rate: speechRate,
				onEnd: () => {
					// Audio finished reading
				}
			});
		}

		// Reveal characters at a steady game-show typewriter pace synced with speech rate
		clearInterval(revealInterval);
		const paceMs = Math.round(48 / Math.max(0.7, speechRate));
		revealInterval = setInterval(() => {
			if (revealedCharCount < fullText.length) {
				revealedCharCount++;
			} else {
				clearInterval(revealInterval);
				isTextRevealing = false;
			}
		}, paceMs);
	}

	function handleBuzzerClick() {
		if (quizShowState !== 'revealing') return;

		// 1. Buzz in: pause reveal & pause TTS immediately
		stopSpeech();
		clearInterval(revealInterval);
		isTextRevealing = false;
		quizShowState = 'buzzed';
		buzzInput = '';
		feedbackMessage = '';

		playQuizShowSound('buzz');

		// Focus the input
		schedule(() => {
			if (buzzInputElement) {
				buzzInputElement.focus();
			}
		}, 80);
	}

	async function handleBuzzAnswerSubmit() {
		if (quizShowState !== 'buzzed') return;
		const currentQ = questions[currentQIdx];
		if (!currentQ || !buzzInput.trim()) return;

		const buzzedCharIndex = revealedCharCount;
		const result = await answerQuizQuestion({
			sessionId: quizSessionId,
			questionId: currentQ.id,
			textAnswer: buzzInput,
			timeRemainingRatio: 1 - buzzedCharIndex / Math.max(1, currentQ.question.length)
		});
		const isCorrect = result.isCorrect;

		if (isCorrect) {
			// CORRECT (正解)
			playQuizShowSound('correct');
			stopSpeech();
			clearInterval(revealInterval);
			quizShowState = 'solved';
			currentQ.correctIndex = result.correctIndex;
			currentQ.explanation = result.explanation;
			revealedCharCount = currentQ.question.length; // Reveal full question
			streak = result.streak;
			maxStreak = result.maxStreak;
			correctCount++;
			mastery = recordMastery(currentQ.category, true);
			const earned = result.points;
			score = sessionScoreOffset + result.totalScore;

			userAnswers = [
				...userAnswers,
				{
					question: currentQ,
					chosenText: buzzInput.trim(),
					isCorrect: true,
					pointsEarned: earned,
					buzzedCharIndex
				}
			];
			if (result.nextQuestion) questions = [...questions, toClientQuestion(result.nextQuestion)];
		} else {
			// INCORRECT (不正解)
			playQuizShowSound('wrong');
			quizShowState = 'incorrect_paused';
			feedbackMessage = `"${buzzInput.trim()}" ยังไม่ถูกต้อง`;
			buzzInput = '';
		}
	}

	function handleContinueReading() {
		if (quizShowState !== 'incorrect_paused') return;
		feedbackMessage = '';
		resumeQuestionRevealAndAudio();
	}

	function handleNextQuizShowQuestion() {
		const next = currentQIdx + 1;
		if (next >= questions.length) {
			finishGame();
		} else {
			startQuizShowQuestion(next);
		}
	}

	async function handleSkipOrReveal() {
		const currentQ = questions[currentQIdx];
		if (!currentQ) return;
		stopSpeech();
		clearInterval(revealInterval);
		const result = await answerQuizQuestion({
			sessionId: quizSessionId,
			questionId: currentQ.id,
			skip: true
		});
		currentQ.correctIndex = result.correctIndex;
		currentQ.explanation = result.explanation;
		mastery = recordMastery(currentQ.category, false);
		if (result.nextQuestion) questions = [...questions, toClientQuestion(result.nextQuestion)];
		quizShowState = 'solved';
		revealedCharCount = currentQ.question.length;

		streak = 0;
		userAnswers = [
			...userAnswers,
			{
				question: currentQ,
				chosenText: '(ข้าม / เฉลย)',
				isCorrect: false,
				pointsEarned: 0
			}
		];
	}

	function finishGame() {
		stopAllTimersAndAudio();
		currentView = 'summary';
	}

	async function handleQuestionRating(question: QuizQuestionInstance, rating: -1 | 1) {
		const key = `thaiquiz:${question.category}:${question.id}`;
		if (questionRatings[key]) return;
		questionRatings = { ...questionRatings, [key]: 'pending' };
		try {
			await rateQuizQuestion({ questionKey: key, category: question.category, rating });
			questionRatings = { ...questionRatings, [key]: rating };
		} catch {
			delete questionRatings[key];
			questionRatings = { ...questionRatings };
		}
	}

	// ─── KEYBOARD SHORTCUTS ─────────────────────────────────────────────────────

	function handleGlobalKeyDown(e: KeyboardEvent) {
		if (currentView === 'playing_normal') {
			if (isAnswering) return;
			const key = e.key.toUpperCase();
			if (key === '1' || key === 'A') handleChoiceClick(0);
			else if (key === '2' || key === 'B') handleChoiceClick(1);
			else if (key === '3' || key === 'C') handleChoiceClick(2);
			else if (key === '4' || key === 'D') handleChoiceClick(3);
			return;
		}

		if (currentView === 'playing_quizshow') {
			if (quizShowState === 'revealing') {
				if (e.code === 'Space' || e.key === ' ') {
					e.preventDefault();
					handleBuzzerClick();
				}
			} else if (quizShowState === 'buzzed') {
				if (e.key === 'Enter') {
					e.preventDefault();
					handleBuzzAnswerSubmit();
				}
			} else if (quizShowState === 'incorrect_paused') {
				if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') {
					e.preventDefault();
					handleContinueReading();
				}
			} else if (quizShowState === 'solved') {
				if (e.key === 'Enter' || e.code === 'Space') {
					e.preventDefault();
					handleNextQuizShowQuestion();
				}
			}
		}
	}

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
				body: JSON.stringify({
					name,
					puzzle_type: activeStyleTab === 'quizshow' ? 'thaiquizshow' : 'thaiquiz',
					puzzle_id: selectedNormalMode === 'daily' ? getDailySeed() : 0,
					score
				})
			});

			if (res.status === 400) {
				submitStatus = 'duplicate';
			} else if (!res.ok) {
				submitStatus = 'error';
				submitError = 'เกิดข้อผิดพลาดในการส่งคะแนน';
			} else {
				submitStatus = 'success';
			}
		} catch {
			submitStatus = 'error';
			submitError = 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้';
		}
	}

	$: currentQuestion = questions[currentQIdx];
	$: activeCategory = currentQuestion ? THAI_QUIZ_CATEGORIES.find((c) => c.id === currentQuestion.category) : null;
	$: revealedQuestionText = currentQuestion ? currentQuestion.question.slice(0, revealedCharCount) : '';
</script>

<svelte:window on:keydown={handleGlobalKeyDown} />

<svelte:head>
	<title>Code Breaker | Quiz 🇹🇭</title>
	<meta
		name="description"
		content="เกมประลองความรู้รอบตัวไทย สไตล์ Japanese Quiz Show อ่านออกเสียงด้วย Text-to-Speech พร้อมระบบกดกริ่งชิงตอบ"
	/>
</svelte:head>

<div class="min-h-screen bg-base-100 text-base-content text-base-content/70 pb-20 pt-4 px-3 sm:px-4 selection:bg-amber-500 selection:text-base-content/70">
	<div class="max-w-4xl mx-auto flex flex-col gap-4">

		<!-- Top Header Navigation Bar (Compact & Mobile-Responsive) -->
		<header class="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 bg-base-100 text-base-content backdrop-blur-md border border-base-300 rounded-xl px-2.5 py-2 sm:px-4 sm:py-2.5 shadow-lg overflow-hidden">
			<div class="flex items-center gap-1.5 sm:gap-3 min-w-0">
				<a
					href="/puzzles"
					class="btn btn-xs sm:btn-sm btn-ghost gap-1 text-base-content/70 hover:text-base-content px-1 sm:px-1.5 shrink-0"
					title="กลับหน้า Puzzles"
				>
					<ArrowLeftIcon size={14} />
					<span class="hidden sm:inline text-xs">Puzzles</span>
				</a>
				<div class="h-4 w-px bg-base-100 text-base-content shrink-0"></div>
				<div class="flex items-center gap-1.5 min-w-0">
					<span class="text-base sm:text-xl shrink-0">🇹🇭</span>
					<div class="flex items-baseline gap-1.5 min-w-0">
						<h1 class="text-xs sm:text-base font-black tracking-tight text-primary truncate">
							Quiz
						</h1>
						<span class="text-[10px] text-base-content/70 font-medium hidden md:inline shrink-0">• Japanese Quiz Show & 4 Choices</span>
					</div>
				</div>
			</div>

			<div class="flex items-center gap-1 shrink-0">
				<button
					class="btn btn-xs {isTTSMuted ? 'btn-ghost text-base-content/70' : 'btn-ghost text-warning-content'} gap-1 px-1.5 sm:px-2"
					on:click={() => {
						isTTSMuted = !isTTSMuted;
						if (isTTSMuted) stopSpeech();
					}}
					title={isTTSMuted ? 'เปิดเสียงอ่าน TTS' : 'ปิดเสียงอ่าน TTS'}
				>
					{#if isTTSMuted}
						<VolumeXIcon size={13} />
						<span class="text-[11px] hidden sm:inline">Muted</span>
					{:else}
						<Volume2Icon size={13} />
						<span class="text-[11px] hidden sm:inline">TTS On</span>
					{/if}
				</button>

				<button
					class="btn btn-xs btn-ghost text-base-content/70 hover:text-warning-content gap-1 px-1.5 sm:px-2"
					on:click={() => (showVoiceModal = true)}
					title="ตั้งค่าความเร็วและเสียงอ่าน TTS"
				>
					<SettingsIcon size={13} />
					<span class="text-[11px] hidden sm:inline">{speechRate}x</span>
				</button>

				<a href="/puzzles/battle" class="btn btn-xs btn-primary font-bold text-primary-content gap-1 px-2 shadow-sm">
					⚔️ <span class="hidden xs:inline">Battle</span>
				</a>
			</div>
		</header>

		<!-- ========================================================================= -->
		<!-- VIEW 1: MODE SELECTION (TAB SWITCH: QUIZ SHOW vs NORMAL)                  -->
		<!-- ========================================================================= -->
		{#if currentView === 'selection'}
			<div class="flex flex-col gap-5" in:fade={{ duration: 200 }}>

				<!-- Style Mode Tabs (2 Iconic Formats) -->
				<div class="botanical-card grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-base-100 text-base-content border border-base-300 shadow-xl">
					<button
						class="py-2.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all {activeStyleTab === 'quizshow' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-base-content/70 shadow-lg shadow-amber-500/20' : 'text-base-content/70 hover:text-base-content'}"
						on:click={() => (activeStyleTab = 'quizshow')}
					>
						<span class="text-base sm:text-lg">🏮</span>
						<span>Quiz Show (早押し กดกริ่งชิงตอบ)</span>
					</button>

					<button
						class="py-2.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all {activeStyleTab === 'normal' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-base-content/70 shadow-lg shadow-amber-500/20' : 'text-base-content/70 hover:text-base-content'}"
						on:click={() => (activeStyleTab = 'normal')}
					>
						<span class="text-base sm:text-lg">🎮</span>
						<span>โหมดปกติ (4 ตัวเลือก)</span>
					</button>
				</div>

				<!-- TAB 1: JAPANESE QUIZ SHOW MODE SELECTION -->
				{#if activeStyleTab === 'quizshow'}
					<div class="flex flex-col gap-4" in:fly={{ y: 10, duration: 200 }}>
						<div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-base-200 via-base-200 to-amber-950/40 border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
							<div class="absolute -right-10 -top-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
							<div class="relative z-10 flex flex-col gap-3 max-w-xl text-center sm:text-left items-center sm:items-start">
								<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-warning-content text-xs font-black w-fit">
									<RadioIcon size={12} class="animate-pulse" />
									<span>Japanese Quiz Show • 早押しクイズ</span>
								</div>
								<h2 class="text-2xl sm:text-4xl font-black text-base-content tracking-tight">
									กดกริ่งชิงตอบสดด้วยเสียงอ่าน TTS!
								</h2>
								<p class="text-xs sm:text-sm text-base-content/70 leading-relaxed">
									ระบบจะอ่านคำถามทีละตัวอักษรด้วยเสียงพูด <strong>กด Spacebar หรือคลิกปุ่มกริ่งเพื่อหยุดเสียงและพิมพ์คำตอบ</strong> ยิ่งตอบได้เร็วเมื่อตัวอักษรขึ้นน้อย ยิ่งได้คะแนนโบนัสสูง!
								</p>
								<div class="flex items-center justify-center sm:justify-start gap-3 mt-3 w-full">
									<button
										on:click={() => startCountdown('quizshow', 'timeattack')}
										class="btn btn-warning btn-md text-warning-content font-black gap-2 shadow-lg shadow-amber-500/30 rounded-2xl w-full sm:w-auto"
									>
										<PlayIcon size={18} />
										เริ่มเล่นควิซโชว์ทันที (10 ข้อ)
									</button>
								</div>
							</div>
						</div>

						<!-- Category Selection for Quizshow -->
						<div class="flex flex-col gap-3 mt-1">
							<div class="flex items-center gap-2 border-b border-base-300 pb-2">
								<BookOpenIcon size={16} class="text-warning-content" />
								<h3 class="text-sm font-bold text-base-content">หรือเลือกเล่นควิซโชว์เฉพาะหมวดหมู่</h3>
							</div>

							<div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
								{#each THAI_QUIZ_CATEGORIES as cat}
									<button
										on:click={() => startCountdown('quizshow', 'category', cat.id)}
										class="bg-base-100 text-base-content hover:bg-base-100 text-base-content border border-base-300 hover:border-amber-500/40 rounded-2xl p-3 text-left flex items-center gap-2.5 shadow-md transition-all group"
									>
										<span class="text-2xl">{cat.icon}</span>
										<div class="truncate">
											<h4 class="font-bold text-xs text-base-content group-hover:text-warning-content transition-colors truncate">{cat.name}</h4>
											<p class="text-[10px] text-base-content/70 truncate">{cat.description}</p>
											<p class="text-[10px] text-warning-content mt-1">{masteryLabel(mastery[cat.id])} • {masteryPercent(mastery[cat.id])}%</p>
										</div>
									</button>
								{/each}
							</div>
						</div>
					</div>

				<!-- TAB 2: NORMAL MULTIPLE-CHOICE MODE -->
				{:else}
					<div class="flex flex-col gap-4" in:fly={{ y: 10, duration: 200 }}>
						<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
							<!-- Time Attack -->
							<button
								on:click={() => startCountdown('normal', 'timeattack')}
								class="bg-base-100 text-base-content hover:bg-base-100 text-base-content border border-base-300 hover:border-amber-400/50 rounded-2xl p-5 text-left flex flex-col justify-between gap-4 shadow-xl group transition-all transform hover:-translate-y-1"
							>
								<div class="flex flex-col gap-2">
									<div class="w-12 h-12 rounded-2xl bg-amber-500/20 text-warning-content flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
										⚡
									</div>
									<div>
										<h3 class="font-black text-lg text-base-content group-hover:text-warning-content transition-colors">Time Attack</h3>
										<p class="text-xs text-base-content/70 mt-1">สปีดควิซ 60 วินาที 4 ตัวเลือก ตอบให้ได้คะแนนสูงสุด</p>
									</div>
								</div>
								<div class="flex items-center justify-between text-xs font-bold text-warning-content pt-2 border-t border-base-300">
									<span>เริ่มเล่น 60s</span>
									<ChevronRightIcon size={14} />
								</div>
							</button>

							<!-- Survival (3 Lives) -->
							<button
								on:click={() => startCountdown('normal', 'survival')}
								class="bg-base-100 text-base-content hover:bg-base-100 text-base-content border border-base-300 hover:border-rose-400/50 rounded-2xl p-5 text-left flex flex-col justify-between gap-4 shadow-xl group transition-all transform hover:-translate-y-1"
							>
								<div class="flex flex-col gap-2">
									<div class="w-12 h-12 rounded-2xl bg-rose-500/20 text-error-content flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
										❤️
									</div>
									<div>
										<h3 class="font-black text-lg text-base-content group-hover:text-error-content transition-colors">Survival (3 ชีวิต)</h3>
										<p class="text-xs text-base-content/70 mt-1">ตอบต่อเนื่องสะสม Streak ห้ามผิดเกิน 3 ครั้ง</p>
									</div>
								</div>
								<div class="flex items-center justify-between text-xs font-bold text-error-content pt-2 border-t border-base-300">
									<span>เริ่มเล่นทันที</span>
									<ChevronRightIcon size={14} />
								</div>
							</button>

							<!-- Endless Mode -->
							<button
								on:click={() => startCountdown('normal', 'endless')}
								class="bg-base-100 text-base-content hover:bg-base-100 text-base-content border border-base-300 hover:border-primary/30 rounded-2xl p-5 text-left flex flex-col justify-between gap-4 shadow-xl group transition-all transform hover:-translate-y-1 sm:col-span-2 md:col-span-1"
							>
								<div class="flex flex-col gap-2">
									<div class="w-12 h-12 rounded-2xl bg-emerald-500/20 text-primary flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
										♾️
									</div>
									<div>
										<h3 class="font-black text-lg text-base-content group-hover:text-primary transition-colors">Endless Mode</h3>
										<p class="text-xs text-base-content/70 mt-1">เล่นต่อเนื่องไม่จำกัดข้อ ตอบสะสมคะแนนได้เรื่อยๆ</p>
									</div>
								</div>
								<div class="flex items-center justify-between text-xs font-bold text-primary pt-2 border-t border-base-300">
									<span>เริ่มเล่นต่อเนื่อง</span>
									<ChevronRightIcon size={14} />
								</div>
							</button>
						</div>

						<!-- Category Focus Section -->
						<div class="flex flex-col gap-3 mt-1">
							<div class="flex items-center gap-2 border-b border-base-300 pb-2">
								<BookOpenIcon size={16} class="text-warning-content" />
								<h3 class="text-sm font-bold text-base-content">เลือกเล่นเจาะลึกเฉพาะหมวดหมู่ (10 ข้อ)</h3>
							</div>

							<div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
								{#each THAI_QUIZ_CATEGORIES as cat}
									<button
										on:click={() => startCountdown('normal', 'category', cat.id)}
										class="bg-base-100 text-base-content hover:bg-base-100 text-base-content border border-base-300 hover:border-base-300 rounded-2xl p-3 text-left flex items-center gap-2.5 shadow-md transition-all group"
									>
										<span class="text-2xl">{cat.icon}</span>
										<div class="truncate">
											<h4 class="font-bold text-xs text-base-content group-hover:text-warning-content transition-colors truncate">{cat.name}</h4>
											<p class="text-[10px] text-base-content/70 truncate">{cat.description}</p>
											<p class="text-[10px] text-warning-content mt-1">{masteryLabel(mastery[cat.id])} • {masteryPercent(mastery[cat.id])}%</p>
										</div>
									</button>
								{/each}
							</div>
						</div>
					</div>
				{/if}
			</div>

		<!-- ========================================================================= -->
		<!-- VIEW 2: COUNTDOWN SCREEN                                                  -->
		<!-- ========================================================================= -->
		{:else if currentView === 'countdown'}
			<div class="flex flex-col items-center justify-center gap-6 py-20 text-center select-none" in:fade>
				<span class="text-sm uppercase tracking-widest text-warning-content font-black animate-pulse">
					{activeStyleTab === 'quizshow' ? '🏮 QUIZ SHOW ARENA' : 'เตรียมพร้อม!'}
				</span>
				<div class="text-8xl sm:text-9xl font-black bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 text-primary animate-bounce" in:scale>
					{countdown}
				</div>
				<p class="text-sm text-base-content/70 font-semibold">
					{activeStyleTab === 'quizshow'
						? 'ระบบจะอ่านคำถามและค่อยๆ เผยตัวอักษร • กด Spacebar เพื่อกดกริ่งตอบ'
						: 'โหมดปกติ 4 ตัวเลือก'}
				</p>
			</div>

		<!-- ========================================================================= -->
		<!-- VIEW 3A: JAPANESE QUIZ SHOW (早押し HAYAOSHI GAMEPLAY)                      -->
		<!-- ========================================================================= -->
		{:else if currentView === 'playing_quizshow' && currentQuestion}
			<div class="flex flex-col gap-4" in:fade={{ duration: 200 }}>
				<!-- Top Status Bar -->
				<div class="botanical-card flex items-center justify-between bg-base-100 text-base-content border border-base-300 rounded-2xl p-3.5 sm:p-4 shadow-xl">
					<div class="flex items-center gap-2.5">
						<span class="badge badge-warning text-warning-content font-mono text-xs font-black py-2">
							ข้อที่ {currentQIdx + 1}/{sessionTotal}
						</span>
						{#if activeCategory}
							<span class="badge {activeCategory.color} badge-xs sm:badge-sm font-semibold">
								{activeCategory.icon} {activeCategory.name}
							</span>
						{/if}
					</div>

					<div class="flex items-center gap-3">
						{#if streak > 1}
							<span class="badge badge-warning badge-sm font-bold animate-bounce hidden sm:inline-flex">
								🔥 Streak x{streak}
							</span>
						{/if}

						<div class="flex items-center gap-1 bg-base-100 text-base-content border border-base-300 rounded-xl px-3 py-1">
							<AwardIcon size={14} class="text-warning-content" />
							<span class="font-mono font-black text-warning-content text-sm">{score} pt</span>
						</div>
					</div>
				</div>

				<!-- Main Quiz Show Stage -->
				<div class="botanical-card bg-base-100 text-base-content backdrop-blur-xl border border-amber-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col justify-between gap-6 min-h-[420px] relative overflow-hidden">

					<!-- Question Reveal Box (Gradual Typewriter Display) -->
					<div class="flex flex-col gap-4 text-center my-auto">
						<div class="flex items-center justify-center gap-2 text-xs font-bold text-warning-content">
							{#if isTextRevealing}
								<span class="h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping"></span>
								<span>กำลังอ่านคำถาม...</span>
							{:else if quizShowState === 'buzzed'}
								<span class="text-error-content animate-pulse font-black">🔔 กดกริ่งแล้ว! พิมพ์คำตอบ...</span>
							{:else if quizShowState === 'solved'}
								<span class="text-primary font-black">🎉 ข้อนี้ตอบถูกต้อง!</span>
							{:else}
								<span class="text-base-content/70">หยุดอ่านชั่วคราว</span>
							{/if}
						</div>

						<!-- Text Box -->
						<div class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl p-6 sm:p-8 shadow-inner min-h-[140px] flex items-center justify-center">
							<h2 class="text-xl sm:text-3xl font-black text-base-content leading-relaxed tracking-tight max-w-2xl mx-auto">
								{revealedQuestionText}
								{#if isTextRevealing}
									<span class="inline-block w-2.5 h-6 sm:h-8 bg-amber-400 animate-pulse ml-1 align-middle"></span>
								{/if}
							</h2>
						</div>

						<!-- Feedback Warning -->
						{#if feedbackMessage}
							<div class="text-sm font-bold text-error-content animate-bounce" in:scale>
								{feedbackMessage}
							</div>
						{/if}
					</div>

					<!-- CONTROL SECTION: BUZZER BUTTON vs INPUT POPUP vs SOLVED SUMMARY -->
					<div class="flex flex-col items-center justify-center gap-3 w-full max-w-xl mx-auto">

						<!-- STATE 1: REVEALING → GIANT GLOWING BUZZER BUTTON -->
						{#if quizShowState === 'revealing'}
							<div class="flex flex-col items-center gap-2 w-full">
								<button
									on:click={handleBuzzerClick}
									class="w-full sm:w-80 py-5 px-6 rounded-3xl bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 hover:from-rose-400 hover:to-red-500 text-base-content font-black text-xl sm:text-2xl shadow-2xl shadow-rose-600/50 border-2 border-rose-400 transform active:scale-95 transition-all duration-150 flex items-center justify-center gap-3 group animate-pulse"
								>
									<span class="text-3xl group-hover:scale-125 transition-transform">🔔</span>
									<span>กดกริ่งตอบ! (Space)</span>
								</button>
								<span class="text-[11px] text-base-content/70 font-mono">กด Spacebar หรือคลิกเพื่อหยุดและตอบ</span>
							</div>

						<!-- STATE 2: BUZZED → TEXT INPUT BOX -->
						{:else if quizShowState === 'buzzed'}
							<div class="flex flex-col items-center gap-2 w-full max-w-full" in:scale={{ duration: 150 }}>
								<div class="flex items-center gap-1.5 sm:gap-2 w-full max-w-full">
									<input
										type="text"
										bind:value={buzzInput}
										bind:this={buzzInputElement}
										placeholder="พิมพ์หรือพูดคำตอบ..."
										class="input input-md sm:input-lg  flex-1 min-w-0 bg-base-100 text-base-content text-base-content font-black border-2 border-amber-400 text-base sm:text-xl text-center focus:outline-none shadow-xl shadow-amber-500/20"
										class:botanical-answer-input={true}
										on:keydown={(e) => {
											if (e.key === 'Enter') handleBuzzAnswerSubmit();
										}}
									/>

									{#if speechRecognitionSupported}
										<button
											type="button"
											class="btn btn-md sm:btn-lg {isListening ? 'btn-error animate-pulse text-base-content' : 'btn-outline border-amber-500/60 text-warning-content hover:bg-amber-500/20'} px-2.5 sm:px-3.5 rounded-2xl shrink-0"
											on:click={toggleSpeechRecognition}
											title={isListening ? 'กำลังฟังเสียง... (คลิกเพื่อหยุด)' : 'พูดคำตอบด้วยไมโครโฟน'}
										>
											<MicIcon size={18} />
										</button>
									{/if}

									<button
										type="button"
										on:click={handleBuzzAnswerSubmit}
										class="btn btn-md sm:btn-lg btn-warning text-warning-content font-black px-3 sm:px-6 rounded-2xl shadow-lg shrink-0"
									>
										ส่ง
									</button>
								</div>
								<div class="flex items-center justify-between w-full text-[11px] text-base-content/70 font-mono px-1">
									{#if isListening}
										<span class="text-error-content animate-pulse font-bold flex items-center gap-1">
											🔴 กำลังฟัง... (หยุดพูดเพื่อส่งคำตอบอัตโนมัติ)
										</span>
									{:else}
										<span>กด Enter หรือคลิกปุ่มส่ง</span>
									{/if}
									{#if speechRecognitionSupported}
										<span class="text-base-content/70 hidden sm:inline">🎙️ ระบบตรวจจับเสียงอัตโนมัติ</span>
									{/if}
								</div>
							</div>

						<!-- STATE 3: INCORRECT → CONTINUE BUTTON -->
						{:else if quizShowState === 'incorrect_paused'}
							<div class="flex flex-col sm:flex-row items-center gap-2.5 w-full justify-center" in:scale>
								<button
									on:click={handleContinueReading}
									class="btn btn-md btn-warning text-warning-content font-black px-6 rounded-2xl shadow-lg gap-2"
								>
									<PlayIcon size={16} />
									อ่านคำถามต่อ (Continue / Spacebar)
								</button>
								<button
									on:click={handleSkipOrReveal}
									class="btn btn-md btn-ghost text-base-content/70 hover:text-base-content"
								>
									ยอมแพ้ / เฉลย
								</button>
							</div>

						<!-- STATE 4: SOLVED → REVEAL EXPLANATION & NEXT QUESTION BUTTON -->
						{:else if quizShowState === 'solved'}
							<div class="botanical-card flex flex-col items-center gap-3 w-full bg-base-100 text-base-content border border-primary/30 rounded-2xl p-4 shadow-xl" in:scale>
								<div class="flex items-center justify-between w-full border-b border-base-300 pb-2">
									<span class="font-bold text-xs text-primary flex items-center gap-1">
										<CheckCircleIcon size={14} />
										เฉลย: {currentQuestion.choices[currentQuestion.correctIndex]}
									</span>
									<span class="badge badge-success badge-sm font-black font-mono">
										+{userAnswers[userAnswers.length - 1]?.pointsEarned || 0} pt
									</span>
								</div>

								<p class="text-xs text-base-content/70 leading-relaxed text-left w-full">
									<span class="font-bold text-warning-content">💡 เกร็ดความรู้:</span> {currentQuestion.explanation}
								</p>

								<button
									on:click={handleNextQuizShowQuestion}
									class="btn btn-md btn-success text-success-content font-black px-8 rounded-2xl shadow-lg gap-2 mt-1"
								>
									<span>ข้อถัดไป (Next / Enter)</span>
									<ChevronRightIcon size={16} />
								</button>
							</div>
						{/if}

					</div>
				</div>
			</div>

		<!-- ========================================================================= -->
		<!-- VIEW 3B: NORMAL 4-CHOICE GAMEPLAY                                         -->
		<!-- ========================================================================= -->
		{:else if currentView === 'playing_normal' && currentQuestion}
			<div class="flex flex-col gap-4" in:fade={{ duration: 200 }}>
				<!-- Status Bar (Score, Streak, Timer/Lives) -->
				<div class="botanical-card flex items-center justify-between bg-base-100 text-base-content border border-base-300 rounded-2xl p-3.5 sm:p-4 shadow-xl">
					<div class="flex items-center gap-2.5">
						<span class="badge badge-neutral font-mono text-xs font-bold py-2">
							ข้อ {currentQIdx + 1}{selectedNormalMode === 'endless' ? ' (โหมดต่อเนื่อง)' : `/${sessionTotal}`}
						</span>
						{#if activeCategory}
							<span class="badge {activeCategory.color} badge-xs sm:badge-sm font-semibold hidden sm:inline-flex">
								{activeCategory.icon} {activeCategory.name}
							</span>
						{/if}
					</div>

					<div class="flex items-center gap-4">
						{#if selectedNormalMode === 'timeattack'}
							<div class="flex items-center gap-1.5 font-mono text-sm sm:text-base font-black {timeLeft <= 10 ? 'text-error-content animate-pulse' : 'text-warning-content'}">
								<ClockIcon size={16} />
								<span>{timeLeft}s</span>
							</div>
						{:else if selectedNormalMode === 'survival'}
							<div class="flex items-center gap-1">
								{#each Array(3) as _, i}
									<span class="text-base {i < lives ? 'text-rose-500' : 'text-base-content/70 opacity-40'}">❤️</span>
								{/each}
							</div>
						{:else if selectedNormalMode === 'endless'}
							<button class="btn btn-xs btn-outline border-base-300 text-base-content/70 hover:bg-rose-500/20 hover:text-error-content" on:click={finishGame}>
								สรุปผลคะแนน 🏁
							</button>
						{/if}

						<div class="flex items-center gap-1 bg-base-100 text-base-content border border-base-300 rounded-xl px-3 py-1">
							<AwardIcon size={14} class="text-warning-content" />
							<span class="font-mono font-black text-warning-content text-sm">{score}</span>
						</div>
					</div>
				</div>

				<!-- Question Card -->
				<div class="botanical-card bg-base-100 text-base-content backdrop-blur-xl border border-base-300 rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col gap-6 text-center relative overflow-hidden min-h-[360px] justify-between">
					<div class="flex flex-col gap-3">
						<div class="flex items-center justify-center gap-2">
							{#if streak > 1}
								<span class="badge badge-warning badge-sm font-bold animate-bounce">
									🔥 Streak x{streak}
								</span>
							{/if}
						</div>

						<h2 class="text-xl sm:text-3xl font-black text-base-content leading-relaxed tracking-tight max-w-2xl mx-auto">
							{currentQuestion.question}
						</h2>
					</div>

					<!-- 4 Response Cards (Grid) -->
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-2xl mx-auto">
						{#each currentQuestion.choices as choice, cIdx}
							{@const isSelected = selectedChoiceIdx === cIdx}
							{@const isCorrectChoice = cIdx === currentQuestion.correctIndex}
							<button
								disabled={isAnswering}
								on:click={() => handleChoiceClick(cIdx)}
								class="p-4 sm:p-5 rounded-2xl border-2 text-left flex items-center justify-between gap-3 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl relative overflow-hidden group
								{isAnswering && isCorrectChoice
									? 'bg-emerald-500/20 border-primary/30 text-primary scale-[1.02]'
									: isAnswering && isSelected && !isCorrectChoice
										? 'bg-rose-500/20 border-rose-500 text-error-content animate-shake'
										: 'bg-base-100 text-base-content border-base-300 text-base-content/70 hover:border-amber-400/80 hover:text-base-content'}"
							>
								<div class="flex items-center gap-3">
									<span class="w-7 h-7 rounded-xl bg-base-100 text-base-content border border-base-300 flex items-center justify-center font-mono text-xs font-bold text-base-content/70 group-hover:text-warning-content">
										{['1', '2', '3', '4'][cIdx]}
									</span>
									<span class="font-bold text-base sm:text-lg">{choice}</span>
								</div>

								{#if isAnswering && isCorrectChoice}
									<CheckCircleIcon size={18} class="text-primary shrink-0" />
								{:else if isAnswering && isSelected && !isCorrectChoice}
									<XCircleIcon size={18} class="text-error-content shrink-0" />
								{/if}
							</button>
						{/each}
					</div>

					<div class="text-[11px] text-base-content/70 font-mono">
						กดแป้นพิมพ์ [1] [2] [3] [4] เพื่อเลือกคำตอบ
					</div>
				</div>
			</div>

		<!-- ========================================================================= -->
		<!-- VIEW 4: SUMMARY & DETAILED EXPLANATIONS                                   -->
		<!-- ========================================================================= -->
		{:else if currentView === 'summary'}
			<div class="flex flex-col gap-6" in:scale={{ duration: 300 }}>
				<!-- Score Hero -->
				<div class="bg-gradient-to-br from-base-200 via-base-200 to-amber-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center gap-4 shadow-2xl">
					<span class="text-5xl animate-bounce">🏆</span>
					<div>
						<h2 class="text-3xl sm:text-5xl font-black text-primary">
							{score} คะแนน
						</h2>
						<p class="text-xs sm:text-sm text-base-content/70 mt-1">
							{activeStyleTab === 'quizshow' ? '🏮 โหมดควิซโชว์ (Quiz Show)' : 'โหมดปกติ'} • ตอบถูก {correctCount} / {userAnswers.length} ข้อ ({Math.round((correctCount / Math.max(1, userAnswers.length)) * 100)}%) • Max Streak 🔥 {maxStreak}
						</p>
					</div>

					<!-- Leaderboard Submission Box -->
					<div class="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md mt-2">
						<input
							type="text"
							bind:value={submitName}
							disabled={submitStatus === 'success'}
							placeholder="ใส่ชื่อของคุณ..."
							maxlength="20"
							class="input input-sm sm:input-md  bg-base-100 text-base-content text-base-content font-bold border-base-300 w-full focus:border-amber-400"
						/>
						<button
							class="btn btn-sm sm:btn-md btn-warning text-warning-content font-bold w-full sm:w-auto shadow-md"
							disabled={submitStatus === 'loading' || submitStatus === 'success' || !submitName.trim() || score === 0}
							on:click={submitToLeaderboard}
						>
							{#if submitStatus === 'loading'}
								<span class="loading loading-spinner loading-xs"></span>
							{:else if submitStatus === 'success'}
								<CheckCircleIcon size={16} /> บันทึกแล้ว!
							{:else}
								<SendIcon size={16} /> บันทึกคะแนน
							{/if}
						</button>
					</div>
					{#if submitStatus === 'duplicate'}
						<span class="text-xs text-warning-content">คุณได้บันทึกคะแนนข้อสอบชุดนี้ไปแล้ว</span>
					{:else if submitStatus === 'error'}
						<span class="text-xs text-error-content">{submitError}</span>
					{/if}

					<div class="flex flex-wrap items-center gap-3 mt-2">
						<button
							class="btn btn-sm btn-primary font-bold text-primary-content gap-1.5 shadow-lg"
							on:click={() => startCountdown(activeStyleTab, selectedNormalMode, selectedCategory)}
						>
							<RefreshCwIcon size={14} />
							เล่นใหม่อีกครั้ง
						</button>
						<button
							class="btn btn-sm btn-outline border-base-300 text-base-content/70 hover:bg-base-100 text-base-content"
							on:click={() => (currentView = 'selection')}
						>
							เลือกโหมดอื่น
						</button>
					</div>
				</div>

				<!-- Detailed Explanations Cards -->
				<div class="flex flex-col gap-3">
					<h3 class="text-base font-bold text-base-content flex items-center gap-2 border-b border-base-300 pb-2">
						<BookOpenIcon size={18} class="text-warning-content" />
						<span>เฉลยละเอียดและเกร็ดความรู้ ({userAnswers.length} ข้อ)</span>
					</h3>

					<div class="flex flex-col gap-3">
						{#each userAnswers as ans, idx}
							{@const q = ans.question}
							{@const cat = THAI_QUIZ_CATEGORIES.find((c) => c.id === q.category)}
							<div class="botanical-card bg-base-100 text-base-content border {ans.isCorrect ? 'border-primary/30' : 'border-rose-500/30'} rounded-2xl p-4 sm:p-5 flex flex-col gap-2.5 shadow-lg">
								<div class="flex items-start justify-between gap-2">
									<div class="flex items-center gap-2">
										<span class="badge {ans.isCorrect ? 'badge-success text-success-content' : 'badge-error text-error-content'} badge-sm font-bold font-mono">
											#{idx + 1} {ans.isCorrect ? '✔ ถูกต้อง' : '✖ ไม่ถูกต้อง'}
										</span>
										{#if cat}
											<span class="badge {cat.color} badge-xs font-semibold">{cat.icon} {cat.name}</span>
										{/if}
									</div>
									<span class="font-mono text-xs font-bold text-warning-content">+{ans.pointsEarned} pt</span>
								</div>

								<h4 class="font-bold text-sm sm:text-base text-base-content">{q.question}</h4>

								<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
									<div class="p-2.5 rounded-xl bg-emerald-500/10 border border-primary/30 text-primary font-medium">
										<span class="font-bold">คำตอบที่ถูกต้อง:</span> {q.choices[q.correctIndex]}
									</div>
									{#if !ans.isCorrect}
										<div class="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-error-content font-medium">
											<span class="font-bold">คำตอบของคุณ:</span> {ans.chosenText || 'ไม่ได้ตอบ'}
										</div>
									{/if}
								</div>

								<div class="p-3 rounded-xl bg-base-100 text-base-content border border-base-300 text-xs text-base-content/70 leading-relaxed mt-1">
									<span class="font-bold text-warning-content">💡 เกร็ดความรู้:</span> {q.explanation}
								</div>
								<div class="flex items-center justify-end gap-2 text-[11px] text-base-content/70">
									<span>คำถามนี้มีคุณภาพไหม?</span>
									<button class="btn btn-xs btn-ghost" disabled={!!questionRatings[`thaiquiz:${q.category}:${q.id}`]} on:click={() => handleQuestionRating(q, 1)}>👍 ดี</button>
									<button class="btn btn-xs btn-ghost" disabled={!!questionRatings[`thaiquiz:${q.category}:${q.id}`]} on:click={() => handleQuestionRating(q, -1)}>👎 ควรแก้</button>
									{#if questionRatings[`thaiquiz:${q.category}:${q.id}`] === 1 || questionRatings[`thaiquiz:${q.category}:${q.id}`] === -1}<span class="text-success-content">ขอบคุณสำหรับความคิดเห็น</span>{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

	</div>
</div>

<!-- TTS SPEED SETTINGS MODAL -->
{#if showVoiceModal}
	<div class="modal modal-open bg-base-100 text-base-content backdrop-blur-md z-50">
		<div class="botanical-card modal-box bg-base-100 text-base-content border border-base-300 rounded-3xl p-5 sm:p-6 max-w-sm text-base-content shadow-2xl flex flex-col gap-4">
			<div class="flex items-center justify-between border-b border-base-300 pb-2.5">
				<h3 class="text-base sm:text-lg font-black text-base-content flex items-center gap-2">
					<ZapIcon size={18} class="text-warning-content" />
					ความเร็วเสียงอ่าน (TTS Speed)
				</h3>
				<button class="btn btn-xs btn-circle btn-ghost" on:click={() => (showVoiceModal = false)}>✕</button>
			</div>

			<div class="flex flex-col gap-4 text-xs">
				<!-- Voice Profile Selection -->
				<div class="flex flex-col gap-2">
					<label for="voice-profile-select" class="label py-1">
						<span class="text-sm text-xs text-base-content/70 font-bold">โปรไฟล์เสียงอ่าน (Voice Profile)</span>
					</label>
					{#if thaiVoices.length > 1}
						<select
							id="voice-profile-select"
							bind:value={selectedVoiceURI}
							on:change={saveVoiceSettings}
							class="select  select-sm w-full bg-base-100 text-base-content text-base-content/70 border-base-300 focus:border-amber-400 text-xs"
						>
							{#each thaiVoices as voice}
								<option value={voice.voiceURI}>{voice.name} ({voice.lang})</option>
							{/each}
						</select>
					{:else if thaiVoices.length === 1}
						<div class="p-2.5 rounded-xl bg-base-100 text-base-content border border-base-300 text-xs text-warning-content font-mono">
							{thaiVoices[0].name} ({thaiVoices[0].lang})
						</div>
					{:else}
						<div class="p-2.5 rounded-xl bg-base-100 text-base-content border border-base-300 text-xs text-base-content/70">
							Default System Voice (th-TH)
						</div>
					{/if}
				</div>

				<!-- Speed Rate Slider (0.5x to 2.0x) -->
				<div class="flex flex-col gap-2">
					<div class="flex items-center justify-between">
						<label for="speech-rate-range" class="label py-1"><span class="text-sm text-xs text-base-content/70 font-bold">ความเร็วการอ่าน (Speed Rate)</span></label>
						<span class="font-mono text-xs text-warning-content font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">{speechRate.toFixed(2)}x</span>
					</div>
					<input
						id="speech-rate-range"
						type="range"
						min="0.5"
						max="2.0"
						step="0.25"
						bind:value={speechRate}
						on:input={saveVoiceSettings}
						class="range range-warning range-xs mt-2"
					/>
					<div class="w-full flex justify-between text-[10px] text-base-content/70 px-0.5 font-mono mt-1">
						<span>0.5x</span>
						<span>0.75x</span>
						<span>1.0x</span>
						<span>1.25x</span>
						<span>1.5x</span>
						<span>1.75x</span>
						<span>2.0x</span>
					</div>
				</div>

				<div class="p-2.5 rounded-xl bg-base-100 text-base-content border border-base-300 text-[11px] text-base-content/70 leading-relaxed">
					💡 <strong>Pre-processing:</strong> ระบบจะแปลงคำภาษาอังกฤษ ตัวย่อ และสูตรวิทยาศาสตร์ (เช่น DNA, One Piece, E=mc²) ให้ออกเสียงเป็นสำเนียงไทยโดยอัตโนมัติ
				</div>

				<!-- Test Audio Button -->
				<div class="pt-2 border-t border-base-300 flex items-center justify-between">
					<button
						class="btn btn-sm btn-outline border-amber-500/50 text-warning-content hover:bg-amber-500/20 font-bold gap-1.5"
						disabled={isTestingVoice}
						on:click={testVoiceSample}
					>
						<Volume2Icon size={14} />
						{#if isTestingVoice}
							<span>กำลังอ่าน ({speechRate}x)...</span>
						{:else}
							<span>ทดสอบเสียง 🔊</span>
						{/if}
					</button>

					<button
						class="btn btn-sm btn-warning font-bold text-warning-content px-5"
						on:click={() => {
							saveVoiceSettings();
							showVoiceModal = false;
						}}
					>
						บันทึกและปิด
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
