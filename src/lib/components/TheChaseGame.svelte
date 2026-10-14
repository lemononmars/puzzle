<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly, scale, slide } from 'svelte/transition';
	import {
		ZapIcon,
		ShieldIcon,
		TrendingUpIcon,
		TrendingDownIcon,
		PlayIcon,
		RefreshCwIcon,
		Volume2Icon,
		VolumeXIcon,
		ActivityIcon,
		ArrowRightIcon
	} from 'svelte-feather-icons';
	import type { TheChaseQuestion, ChaserProfile, TableOffers, ChaseGamePhase } from '#lib/data/puzzles/thechase/types.js';
	import { CHASERS, getRandomChaser, calculateOffers, resolveBoardStepState } from '#lib/data/puzzles/thechase/engine.js';
	import { answerQuizQuestion, startQuizSession, type DeliveredQuizQuestion } from '#lib/quiz/client.js';
	import { speakThai, stopSpeech, playQuizShowSound } from '#lib/utils/tts.js';

	type ClientChaseQuestion = Omit<TheChaseQuestion, 'choices' | 'correctIndex' | 'difficulty'> & {
		choices: string[];
		correctIndex: number;
		difficulty?: string;
	};

	// Game State
	let phase: ChaseGamePhase = 'intro';
	let chaser: ChaserProfile = CHASERS[0];
	let bankedAmount = 0;
	let isSpeechMuted = false;

	// Cash Builder State (Round 1)
	let cashBuilderTime = 60;
	let cashBuilderTimer: any = null;
	let cashBuilderQuestions: ClientChaseQuestion[] = [];
	let cashBuilderIdx = 0;
	let cashBuilderCorrect = 0;
	let cashBuilderAnswering = false;
	let cashBuilderChoicesRevealed = false;
	let cashBuilderRevealTimeout: any = null;
	let cashBuilderAnswerChoice: number | null = null;
	let cashBuilderAnswerFeedback: 'correct' | 'wrong' | null = null;

	// Offer State (Round 2 Prep)
	let offers: TableOffers | null = null;

	// Head-to-Head Board State (Round 2)
	let playerStep = 4; // 0 to 7
	let chaserStep = 0; // 0 to 7
	let boardQuestions: ClientChaseQuestion[] = [];
	let currentBoardQIdx = 0;
	let playerChoice: number | null = null;
	let chaserChoice: number | null = null;
	let boardState: 'reading' | 'player_locked' | 'chaser_locked' | 'revealing_player' | 'revealing_chaser' | 'moving' | 'question_done' = 'reading';
	let chaserLockTimeout: any = null;

	// Final Chase State (Round 3)
	let finalTargetSteps = 0;
	let finalPlayerTime = 60;
	let finalChaserTime = 60;
	let finalChaseTimer: any = null;
	let finalQuestions: ClientChaseQuestion[] = [];
	let finalQIdx = 0;
	let finalChaserSteps = 0;
	let pushbackPending = false;
	let pushbackAnswerChoice: number | null = null;
	let finalChoicesRevealed = false;
	let finalRevealTimeout: any = null;
	let finalPlayerAnswerChoice: number | null = null;
	let finalPlayerFeedback: 'correct' | 'wrong' | null = null;
	let pendingTimeouts = new Set<any>();
	let usedQuestionIds = new Set<number>();
	let chaseSessionId = '';

	onMount(() => {
		if (typeof window !== 'undefined') {
			const savedMuted = localStorage.getItem('cb_thechase_muted');
			if (savedMuted !== null) isSpeechMuted = savedMuted === 'true';
		}
		resetAll();
	});

	onDestroy(() => {
		clearAllTimers();
		stopSpeech();
	});

	function toggleAudioMute() {
		isSpeechMuted = !isSpeechMuted;
		if (typeof window !== 'undefined') {
			localStorage.setItem('cb_thechase_muted', isSpeechMuted.toString());
		}
		if (isSpeechMuted) stopSpeech();
	}

	function clearAllTimers() {
		clearInterval(cashBuilderTimer);
		clearInterval(finalChaseTimer);
		clearTimeout(chaserLockTimeout);
		clearTimeout(cashBuilderRevealTimeout);
		clearTimeout(finalRevealTimeout);
		for (const timeout of pendingTimeouts) clearTimeout(timeout);
		pendingTimeouts.clear();
	}

	function schedule(callback: () => void | Promise<void>, delayMs: number) {
		const timeout = setTimeout(() => {
			pendingTimeouts.delete(timeout);
			void callback();
		}, delayMs);
		pendingTimeouts.add(timeout);
		return timeout;
	}

	function toChaseQuestion(question: DeliveredQuizQuestion): ClientChaseQuestion {
		return { ...question, correctIndex: -1, explanation: '', category: question.category as TheChaseQuestion['category'] };
	}

	async function drawQuestions(count: number) {
		const session = await startQuizSession({
			type: 'thechase',
			count,
			excludeIds: Array.from(usedQuestionIds)
		});
		chaseSessionId = session.sessionId;
		usedQuestionIds.add(session.firstQuestion.id);
		return [toChaseQuestion(session.firstQuestion)];
	}

	function revealAndAppend(
		question: ClientChaseQuestion,
		result: Awaited<ReturnType<typeof answerQuizQuestion>>,
		append: (next: ClientChaseQuestion) => void
	) {
		question.correctIndex = result.correctIndex;
		question.explanation = result.explanation;
		if (result.nextQuestion) {
			usedQuestionIds.add(result.nextQuestion.id);
			append(toChaseQuestion(result.nextQuestion));
		}
	}

	function resetAll() {
		clearAllTimers();
		stopSpeech();
		phase = 'intro';
		chaser = getRandomChaser();
		bankedAmount = 0;
		cashBuilderCorrect = 0;
		playerStep = 4;
		chaserStep = 0;
		finalTargetSteps = 0;
		finalChaserSteps = 0;
		pushbackPending = false;
		cashBuilderChoicesRevealed = false;
		cashBuilderAnswerChoice = null;
		cashBuilderAnswerFeedback = null;
		finalChoicesRevealed = false;
		finalPlayerAnswerChoice = null;
		finalPlayerFeedback = null;
		usedQuestionIds = new Set<number>();
	}

	// =========================================================================
	// PHASE 1: CASH BUILDER (60 วินาที)
	// =========================================================================

	function startCashBuilder() {
		resetAll();
		phase = 'cash_builder_countdown';
		playQuizShowSound('buzz');

		schedule(async () => {
			phase = 'cash_builder_playing';
			cashBuilderQuestions = await drawQuestions(30);
			cashBuilderIdx = 0;
			cashBuilderCorrect = 0;
			cashBuilderTime = 60;
			cashBuilderAnswering = false;

			playQuizShowSound('lock');
			setupCashBuilderQuestion();

			cashBuilderTimer = setInterval(() => {
				if (cashBuilderTime > 0) {
					cashBuilderTime--;
					if (cashBuilderTime <= 5) {
						playQuizShowSound('tick');
					}
				} else {
					finishCashBuilder();
				}
			}, 1000);
		}, 1000);
	}

	function setupCashBuilderQuestion() {
		cashBuilderChoicesRevealed = false;
		cashBuilderAnswerChoice = null;
		cashBuilderAnswerFeedback = null;
		clearTimeout(cashBuilderRevealTimeout);

		const q = cashBuilderQuestions[cashBuilderIdx];
		if (!q) return;

		if (!isSpeechMuted) {
			speakThai(q.question, { rate: 1.15 });
		}

		// 2-second anti-spam delay before revealing choices
		cashBuilderRevealTimeout = schedule(() => {
			cashBuilderChoicesRevealed = true;
		}, 2000);
	}

	async function handleCashBuilderChoice(idx: number) {
		if (!cashBuilderChoicesRevealed || cashBuilderAnswering || phase !== 'cash_builder_playing') return;
		const q = cashBuilderQuestions[cashBuilderIdx];
		if (!q) return;

		cashBuilderAnswering = true;
		cashBuilderAnswerChoice = idx;
		(document.activeElement as HTMLElement)?.blur();

		const result = await answerQuizQuestion({ sessionId: chaseSessionId, questionId: q.id, choiceIndex: idx });
		revealAndAppend(q, result, (next) => (cashBuilderQuestions = [...cashBuilderQuestions, next]));
		const isCorrect = result.isCorrect;
		cashBuilderAnswerFeedback = isCorrect ? 'correct' : 'wrong';

		if (isCorrect) {
			playQuizShowSound('correct');
			cashBuilderCorrect++;
		} else {
			playQuizShowSound('wrong');
		}

		schedule(async () => {
			cashBuilderAnswering = false;
			cashBuilderAnswerChoice = null;
			cashBuilderAnswerFeedback = null;
			cashBuilderIdx++;
			if (cashBuilderIdx < cashBuilderQuestions.length) {
				setupCashBuilderQuestion();
			} else if (result.isCompleted) {
				cashBuilderQuestions = [...cashBuilderQuestions, ...(await drawQuestions(10))];
				setupCashBuilderQuestion();
			}
		}, 700);
	}

	function finishCashBuilder() {
		clearAllTimers();
		stopSpeech();
		bankedAmount = cashBuilderCorrect * 10000;
		phase = 'cash_builder_summary';
		playQuizShowSound('safe');
	}

	// =========================================================================
	// PHASE 2: CHASER OFFERS
	// =========================================================================

	function proceedToOffers() {
		phase = 'offer_selection';
		offers = calculateOffers(bankedAmount);
		playQuizShowSound('gong');
		if (!isSpeechMuted) {
			speakThai(`${chaser.title} เสนอข้อเสนอให้กับคุณบนกระดานไล่ล่า`, { rate: 1.05 });
		}
	}

	function selectOffer(type: 'low' | 'mid' | 'high') {
		if (!offers) return;
		playQuizShowSound('lock');

		if (type === 'low') {
			bankedAmount = offers.lowAmount;
			playerStep = offers.lowStep;
		} else if (type === 'mid') {
			bankedAmount = offers.midAmount;
			playerStep = offers.midStep;
		} else {
			bankedAmount = offers.highAmount;
			playerStep = offers.highStep;
		}

		chaserStep = 0;
		startBoardChase();
	}

	// =========================================================================
	// PHASE 3: HEAD-TO-HEAD BOARD CHASE (7 STEPS)
	// =========================================================================

	async function startBoardChase() {
		phase = 'board_chase';
		boardQuestions = await drawQuestions(25);
		currentBoardQIdx = 0;
		startBoardQuestion();
	}

	function startBoardQuestion() {
		const q = boardQuestions[currentBoardQIdx];
		if (!q) return;
		playerChoice = null;
		chaserChoice = null;
		boardState = 'reading';

		const currentQ = boardQuestions[currentBoardQIdx];
		if (currentQ && !isSpeechMuted) {
			speakThai(currentQ.question, { rate: 1.1 });
		}
	}

	async function handleBoardPlayerChoice(idx: number) {
		if (boardState !== 'reading') return;
		playerChoice = idx;
		boardState = 'player_locked';
		playQuizShowSound('lock');
		(document.activeElement as HTMLElement)?.blur();

		const currentQ = boardQuestions[currentBoardQIdx];
		if (!currentQ) return;
		const result = await answerQuizQuestion({ sessionId: chaseSessionId, questionId: currentQ.id, choiceIndex: idx });
		revealAndAppend(currentQ, result, (next) => (boardQuestions = [...boardQuestions, next]));

		// Simulate Chaser thinking & locking in
		const chaserIsCorrect = Math.random() < chaser.accuracyRate;
		const incorrectChoices = currentQ.choices.map((_choice, index) => index).filter((index) => index !== currentQ.correctIndex);
		const simulatedChoice = chaserIsCorrect
			? currentQ.correctIndex
			: incorrectChoices[Math.floor(Math.random() * incorrectChoices.length)];
		chaserLockTimeout = schedule(() => {
			chaserChoice = simulatedChoice;
			boardState = 'chaser_locked';
			playQuizShowSound('tick');

			// Step 1: Reveal Player Answer
			schedule(() => {
				boardState = 'revealing_player';
				const pCorrect = playerChoice === currentQ.correctIndex;
				if (pCorrect) {
					playQuizShowSound('correct');
				} else {
					playQuizShowSound('wrong');
				}

				// Step 2: Reveal Chaser Answer
				schedule(() => {
					boardState = 'revealing_chaser';
					const cCorrect = chaserChoice === currentQ.correctIndex;
					if (cCorrect) {
						playQuizShowSound('correct');
					} else {
						playQuizShowSound('wrong');
					}

					// Step 3: Move on Board
					schedule(() => {
						boardState = 'moving';
						const stepResult = resolveBoardStepState(playerStep, chaserStep, pCorrect, cCorrect);
						playerStep = stepResult.nextPlayerStep;
						chaserStep = stepResult.nextChaserStep;
						playQuizShowSound('step');

						schedule(() => {
							if (stepResult.status === 'safe') {
								// Escaped safely to Final Chase!
								playQuizShowSound('safe');
								phase = 'board_result';
							} else if (stepResult.status === 'caught') {
								// Caught by Chaser!
								playQuizShowSound('caught');
								phase = 'game_over';
							} else {
								// Next question
								currentBoardQIdx++;
								startBoardQuestion();
							}
						}, 1200);
					}, 1000);
				}, 1200);
			}, 800);
		}, 700 + Math.random() * 900);
	}

	// =========================================================================
	// PHASE 4: THE FINAL CHASE
	// =========================================================================

	async function proceedToFinalChase() {
		phase = 'final_chase_player_prep';
		finalQuestions = await drawQuestions(40);
		finalQIdx = 0;
		finalTargetSteps = 1; // 1 step head start for making it to Final Chase
		playQuizShowSound('gong');
	}

	function startFinalPlayerRound() {
		phase = 'final_chase_player_playing';
		finalPlayerTime = 60;
		playQuizShowSound('buzz');
		setupFinalPlayerQuestion();

		finalChaseTimer = setInterval(() => {
			if (finalPlayerTime > 0) {
				finalPlayerTime--;
				if (finalPlayerTime <= 5) playQuizShowSound('tick');
			} else {
				finishFinalPlayerRound();
			}
		}, 1000);
	}

	function setupFinalPlayerQuestion() {
		finalChoicesRevealed = false;
		finalPlayerAnswerChoice = null;
		finalPlayerFeedback = null;
		clearTimeout(finalRevealTimeout);

		const q = finalQuestions[finalQIdx];
		if (!q) return;

		if (!isSpeechMuted) {
			speakThai(q.question, { rate: 1.15 });
		}

		// 2-second anti-spam delay before revealing choices
		finalRevealTimeout = schedule(() => {
			finalChoicesRevealed = true;
		}, 2000);
	}

	async function handleFinalPlayerChoice(idx: number) {
		if (!finalChoicesRevealed || phase !== 'final_chase_player_playing') return;
		const q = finalQuestions[finalQIdx];
		if (!q) return;

		finalPlayerAnswerChoice = idx;
		(document.activeElement as HTMLElement)?.blur();

		const result = await answerQuizQuestion({ sessionId: chaseSessionId, questionId: q.id, choiceIndex: idx });
		revealAndAppend(q, result, (next) => (finalQuestions = [...finalQuestions, next]));
		const isCorrect = result.isCorrect;
		finalPlayerFeedback = isCorrect ? 'correct' : 'wrong';

		if (isCorrect) {
			playQuizShowSound('correct');
			finalTargetSteps++;
		} else {
			playQuizShowSound('wrong');
		}

		schedule(async () => {
			finalPlayerAnswerChoice = null;
			finalPlayerFeedback = null;
			finalQIdx++;
			if (finalQIdx < finalQuestions.length) {
				setupFinalPlayerQuestion();
			} else if (result.isCompleted) {
				finalQuestions = [...finalQuestions, ...(await drawQuestions(15))];
				setupFinalPlayerQuestion();
			}
		}, 700);
	}

	function finishFinalPlayerRound() {
		clearAllTimers();
		stopSpeech();
		phase = 'final_chase_chaser_playing';
		finalChaserSteps = 0;
		finalChaserTime = 60;
		playQuizShowSound('gong');

		schedule(() => {
			runChaserFinalStep();
			finalChaseTimer = setInterval(() => {
				if (!pushbackPending) {
					if (finalChaserTime > 0) {
						finalChaserTime--;
					} else {
						// Chaser ran out of time -> PLAYER WINS!
						clearAllTimers();
						stopSpeech();
						playQuizShowSound('safe');
						phase = 'victory';
					}
				}
			}, 1000);
		}, 1500);
	}

	async function runChaserFinalStep() {
		if (phase !== 'final_chase_chaser_playing' || pushbackPending) return;

		const q = finalQuestions[finalQIdx];
		if (!q) return;

		const result = await answerQuizQuestion({
			sessionId: chaseSessionId,
			questionId: q.id,
			simulateAccuracy: chaser.accuracyRate
		});
		revealAndAppend(q, result, (next) => (finalQuestions = [...finalQuestions, next]));

		schedule(() => {
			if (phase !== 'final_chase_chaser_playing' || pushbackPending) return;

			if (result.isCorrect) {
				playQuizShowSound('correct');
				finalChaserSteps++;

				if (finalChaserSteps >= finalTargetSteps) {
					// Chaser caught player in final chase
					clearAllTimers();
					stopSpeech();
					playQuizShowSound('caught');
					phase = 'game_over';
					return;
				}

				finalQIdx++;
				runChaserFinalStep();
			} else {
				// Chaser answered incorrectly -> PUSHBACK OPPORTUNITY!
				playQuizShowSound('wrong');
				pushbackPending = true;
				pushbackAnswerChoice = null;
				if (!isSpeechMuted) {
					speakThai(`ผู้ล่าตอบผิด! ${q.question}`, { rate: 1.1 });
				}
			}
		}, 700 + Math.random() * 900);
	}

	function handlePushbackChoice(idx: number) {
		if (phase !== 'final_chase_chaser_playing' || !pushbackPending || pushbackAnswerChoice !== null) return;
		const q = finalQuestions[finalQIdx];
		if (!q) return;

		pushbackAnswerChoice = idx;
		(document.activeElement as HTMLElement)?.blur();
		const isCorrect = idx === q.correctIndex;

		if (isCorrect) {
			playQuizShowSound('safe');
			// Push Chaser back 1 step (minimum 0)
			finalChaserSteps = Math.max(0, finalChaserSteps - 1);
		} else {
			playQuizShowSound('wrong');
		}

		schedule(() => {
			pushbackPending = false;
			finalQIdx++;
			runChaserFinalStep();
		}, 1200);
	}
</script>

<div class="flex flex-col gap-4 max-w-4xl mx-auto w-full select-none" in:fade={{ duration: 200 }}>

	<!-- Top Audio Control Bar -->
	<div class="flex items-center justify-between px-3 py-1.5 rounded-xl bg-base-100 text-base-content border border-base-300 text-xs">
		<div class="flex items-center gap-2">
			<span class="text-warning-content font-bold">⚡ The Chase Game</span>
		</div>
		<button
			class="btn btn-xs {isSpeechMuted ? 'btn-ghost text-base-content/70' : 'btn-ghost text-warning-content'} gap-1 px-2"
			on:click={toggleAudioMute}
			title={isSpeechMuted ? 'เปิดเสียงอ่าน TTS' : 'ปิดเสียงอ่าน TTS'}
		>
			{#if isSpeechMuted}
				<VolumeXIcon size="13" />
				<span>Muted</span>
			{:else}
				<Volume2Icon size="13" />
				<span>TTS On</span>
			{/if}
		</button>
	</div>

	<!-- ========================================================================= -->
	<!-- 1. INTRO / WELCOME SCREEN                                                 -->
	<!-- ========================================================================= -->
	{#if phase === 'intro'}
		<div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-base-200 via-base-200 to-amber-950/60 border border-amber-500/40 p-6 sm:p-8 shadow-2xl flex flex-col gap-5">
			<div class="absolute -right-16 -top-16 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

			<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-base-300 pb-4">
				<div class="flex items-center gap-3">
					<span class="text-4xl sm:text-5xl">{chaser.avatarEmoji}</span>
					<div>
						<div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-warning-content text-[11px] font-black">
							<ZapIcon size="11" class="animate-pulse" />
							<span>The Chase UK Quiz Show</span>
						</div>
						<h2 class="text-2xl sm:text-3xl font-black text-base-content tracking-tight mt-1">
							{chaser.title}
						</h2>
						<p class="text-xs text-warning-content font-medium">{chaser.thaiTitle} • แม่นยำ {Math.round(chaser.accuracyRate * 100)}%</p>
					</div>
				</div>

				<button
					class="btn btn-sm btn-ghost border border-base-300 text-base-content/70 hover:text-base-content rounded-xl text-xs gap-1.5"
					on:click={() => (chaser = getRandomChaser())}
					title="สุ่ม Chaser ท่านอื่น"
				>
					<RefreshCwIcon size="13" />
					<span>สุ่มผู้ล่าคนใหม่</span>
				</button>
			</div>

			<!-- Rules of The Chase -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
				<div class="p-3.5 rounded-2xl bg-base-100 text-base-content border border-base-300 flex flex-col gap-1.5">
					<div class="flex items-center gap-2 text-warning-content font-bold text-xs">
						<span>1. Cash Builder</span>
					</div>
					<p class="text-[11px] text-base-content/70 leading-relaxed">
						60 วินาทีตอบคำถาม 3 ตัวเลือกแบบสปีดควิซ สะสมข้อละ ฿10,000
					</p>
				</div>

				<div class="p-3.5 rounded-2xl bg-base-100 text-base-content border border-base-300 flex flex-col gap-1.5">
					<div class="flex items-center gap-2 text-warning-content font-bold text-xs">
						<span>2. The Board Chase</span>
					</div>
					<p class="text-[11px] text-base-content/70 leading-relaxed">
						ประลอง 3 ตัวเลือกบนบอร์ด 7 ขั้น หนี Chaser เข้าบ้านให้ทันก่อนโดนจับ
					</p>
				</div>

				<div class="p-3.5 rounded-2xl bg-base-100 text-base-content border border-base-300 flex flex-col gap-1.5">
					<div class="flex items-center gap-2 text-warning-content font-bold text-xs">
						<span>3. The Final Chase</span>
					</div>
					<p class="text-[11px] text-base-content/70 leading-relaxed">
						สร้างแต้มต่อแล้วป้องกันเงินรางวัลจาก Chaser พร้อมโอกาส Pushback ดันผู้ล่ากลับ!
					</p>
				</div>
			</div>

			<div class="flex items-center justify-center pt-2">
				<button
					class="btn btn-warning btn-md font-black text-warning-content gap-2 px-10 rounded-2xl shadow-xl shadow-amber-500/20 w-full sm:w-auto"
					on:click={startCashBuilder}
				>
					<PlayIcon size="18" />
					<span>เข้าสู่สังเวียน The Chase!</span>
				</button>
			</div>
		</div>

	<!-- ========================================================================= -->
	<!-- 2. CASH BUILDER PLAYING (60s)                                             -->
	<!-- ========================================================================= -->
	{:else if phase === 'cash_builder_playing' || phase === 'cash_builder_countdown'}
		<div class="flex flex-col gap-4">
			<!-- HUD -->
			<div class="botanical-card flex items-center justify-between bg-base-100 text-base-content border border-base-300 rounded-2xl px-4 py-3 shadow-lg">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-black text-warning-content text-lg">
						{cashBuilderTime}s
					</div>
					<div>
						<div class="text-[10px] text-base-content/70 uppercase font-bold tracking-wider">Cash Builder Round</div>
						<div class="text-base font-black text-base-content">ข้อที่ {cashBuilderIdx + 1}</div>
					</div>
				</div>

				<div class="text-right">
					<div class="text-[10px] text-base-content/70 uppercase font-bold tracking-wider">เงินรางวัลสะสม</div>
					<div class="text-lg sm:text-xl font-black text-warning-content font-mono">฿{(cashBuilderCorrect * 10000).toLocaleString()}</div>
				</div>
			</div>

			<!-- Question Card -->
			{#if cashBuilderQuestions[cashBuilderIdx]}
				{@const q = cashBuilderQuestions[cashBuilderIdx]}
				<div class="botanical-card flex flex-col gap-4 bg-base-100 text-base-content border border-base-300 rounded-3xl p-5 sm:p-7 shadow-2xl" in:fly={{ y: 10, duration: 150 }}>
					<h3 class="text-lg sm:text-2xl font-black text-base-content leading-snug min-h-[4rem] flex items-center">
						{q.question}
					</h3>

					<!-- Anti-spam & Choices Container -->
					<div class="grid grid-cols-1 gap-2.5 pt-1">
						{#if !cashBuilderChoicesRevealed}
							<div class="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-base-100 text-base-content border border-amber-500/30 text-warning-content text-xs font-mono animate-pulse">
								<span class="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
								<span>กำลังอ่านคำถาม... ตัวเลือกจะเปิดใน 2 วินาที</span>
							</div>
						{/if}

						{#each q.choices as choice, idx}
							{@const isSelected = cashBuilderAnswerChoice === idx}
							{@const isCorrectChoice = idx === q.correctIndex}
							{@const showFeedback = cashBuilderAnswerFeedback !== null}
							<button
								class="btn btn-lg justify-start h-auto py-3.5 px-5 rounded-2xl font-bold text-sm sm:text-base border transition-all text-left flex items-center justify-between
								{!cashBuilderChoicesRevealed ? 'opacity-40 pointer-events-none bg-base-100 text-base-content border-base-300 text-base-content/70' : ''}
								{showFeedback && isSelected && isCorrectChoice ? 'bg-emerald-600 border-primary/30 text-base-content shadow-lg shadow-emerald-500/30' : ''}
								{showFeedback && isSelected && !isCorrectChoice ? 'bg-rose-600 border-rose-400 text-base-content shadow-lg shadow-rose-500/30 animate-shake' : ''}
								{showFeedback && !isSelected && isCorrectChoice ? 'border-primary/30 bg-base-300 text-base-content text-primary' : ''}
								{!showFeedback && cashBuilderChoicesRevealed ? 'border-base-300 bg-base-100 text-base-content text-base-content/70 hover:bg-amber-500 hover:text-base-content/70 hover:border-amber-400' : ''}"
								disabled={cashBuilderAnswering || !cashBuilderChoicesRevealed}
								on:click={() => handleCashBuilderChoice(idx)}
							>
								<div class="flex items-center gap-3">
									<span class="w-7 h-7 rounded-lg bg-base-100 text-base-content font-mono text-xs flex items-center justify-center font-black text-warning-content shrink-0">
										{['A', 'B', 'C'][idx]}
									</span>
									<span class="grow">{choice}</span>
								</div>
								{#if showFeedback && isSelected}
									<span class="badge badge-sm {isCorrectChoice ? 'badge-success text-success-content' : 'badge-error text-error-content'} font-bold">
										{isCorrectChoice ? '✔ ถูกต้อง (+฿10k)' : '✖ ไม่ถูกต้อง'}
									</span>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>

	<!-- ========================================================================= -->
	<!-- 3. CASH BUILDER SUMMARY                                                   -->
	<!-- ========================================================================= -->
	{:else if phase === 'cash_builder_summary'}
		<div class="botanical-card rounded-3xl bg-base-100 text-base-content border border-base-300 p-6 sm:p-8 flex flex-col items-center text-center gap-4 shadow-2xl" in:scale={{ duration: 200 }}>
			<div class="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl">
				💰
			</div>
			<div>
				<h3 class="text-xl sm:text-2xl font-black text-base-content">หมดเวลา Cash Builder!</h3>
				<p class="text-xs text-base-content/70 mt-1">คุณตอบถูกทั้งหมด {cashBuilderCorrect} ข้อ</p>
			</div>

			<div class="text-3xl sm:text-5xl font-black text-warning-content font-mono py-2">
				฿{bankedAmount.toLocaleString()}
			</div>

			<p class="text-xs text-base-content/70 max-w-md">
				ถึงเวลาเผชิญหน้ากับ <strong>{chaser.name}</strong> บนโต๊ะเจรจาข้อเสนอ!
			</p>

			<button
				class="btn btn-warning btn-md font-black text-warning-content px-8 rounded-2xl gap-2 shadow-lg shadow-amber-500/20 mt-2"
				on:click={proceedToOffers}
			>
				<span>ไปรับข้อเสนอของผู้ล่า</span>
				<ArrowRightIcon size="16" />
			</button>
		</div>

	<!-- ========================================================================= -->
	<!-- 4. TABLE OFFERS SELECTION & BOARD VISUALIZATION                           -->
	<!-- ========================================================================= -->
	{:else if phase === 'offer_selection' && offers}
		<div class="flex flex-col gap-4" in:fade={{ duration: 200 }}>
			<div class="botanical-card flex items-center gap-3 bg-base-100 text-base-content border border-base-300 rounded-2xl p-4">
				<span class="text-3xl">{chaser.avatarEmoji}</span>
				<div>
					<h3 class="font-black text-base-content text-base">{chaser.name} ยื่นข้อเสนอบนกระดาน</h3>
					<p class="text-xs text-base-content/70">ดูตำแหน่งเริ่มต้นบนกระดานด้านล่าง แล้วเลือกข้อเสนอที่ต้องการ</p>
				</div>
			</div>

			<!-- Visual Chase Board Showing Offer Positions -->
			<div class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-2xl p-3 flex flex-col gap-2 shadow-lg">
				<div class="flex items-center justify-between text-xs font-bold text-base-content/70 border-b border-base-300 pb-1.5">
					<span class="text-warning-content">⚡ ตำแหน่งข้อเสนอบนกระดาน 7 ขั้น</span>
					<span class="text-[11px] text-base-content/70">Chaser เริ่มที่ขั้น 0 • Home ที่ขั้น 7</span>
				</div>

				<!-- Horizontal Board Representation -->
				<div class="flex flex-row gap-1 w-full overflow-x-auto py-1">
					{#each [0, 1, 2, 3, 4, 5, 6, 7] as stepIdx}
						{@const isHigh = stepIdx === 2}
						{@const isMid = stepIdx === 3}
						{@const isLow = stepIdx === 5}
						{@const isHome = stepIdx === 7}
						{@const isChaser = stepIdx === 0}
						<div
							class="flex-1 min-w-[38px] h-12 rounded-xl border flex flex-col items-center justify-center text-center p-0.5 relative transition-all
							{isChaser ? 'bg-error border-red-500/50 text-error-content' : ''}
							{isHigh ? 'bg-red-500/20 border-red-500 text-error-content ring-1 ring-red-400' : ''}
							{isMid ? 'bg-amber-500/20 border-amber-500 text-warning-content ring-1 ring-amber-400' : ''}
							{isLow ? 'bg-emerald-500/20 border-primary/30 text-primary ring-1 ring-emerald-400' : ''}
							{isHome ? 'bg-base-300 text-base-content border-primary/30 text-primary' : ''}
							{!isChaser && !isHigh && !isMid && !isLow && !isHome ? 'bg-base-100 text-base-content border-base-300 text-base-content/70' : ''}"
						>
							<span class="text-[9px] font-mono font-bold leading-none">
								{isChaser ? '👹' : isHome ? '🏆' : stepIdx}
							</span>
							{#if isHigh}
								<span class="text-[8px] font-black text-error-content mt-0.5 leading-none">HIGH</span>
							{:else if isMid}
								<span class="text-[8px] font-black text-warning-content mt-0.5 leading-none">MID</span>
							{:else if isLow}
								<span class="text-[8px] font-black text-primary mt-0.5 leading-none">LOW</span>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- 3 Offer Cards -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
				<!-- High Offer -->
				<button
					class="flex flex-col items-center justify-between p-4 sm:p-5 rounded-3xl bg-base-100 text-base-content border border-red-500/40 hover:border-red-400 hover:bg-base-100 text-base-content hover:scale-[1.02] transition-all text-center gap-2.5 shadow-xl group"
					on:click={() => selectOffer('high')}
				>
					<div class="inline-flex items-center gap-1 text-[10px] font-black text-error-content bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
						<TrendingUpIcon size="11" />
						<span>ข้อเสนอสูง (เริ่มขั้น 2)</span>
					</div>
					<div class="text-2xl sm:text-3xl font-black text-error-content font-mono group-hover:scale-105 transition-transform">
						฿{offers.highAmount.toLocaleString()}
					</div>
					<div class="text-[11px] text-base-content/70 leading-snug">
						ห่างจาก Chaser <strong>2 ขั้น</strong><br>(4 ก้าวถึงบ้าน)
					</div>
					<div class="btn btn-xs btn-error text-error-content font-bold w-full rounded-xl mt-1">เลือกข้อเสนอสูง</div>
				</button>

				<!-- Mid Offer -->
				<button
					class="flex flex-col items-center justify-between p-4 sm:p-5 rounded-3xl bg-base-100 text-base-content border-2 border-amber-500 hover:border-amber-400 hover:bg-base-100 text-base-content hover:scale-[1.02] transition-all text-center gap-2.5 shadow-xl shadow-amber-500/10 group"
					on:click={() => selectOffer('mid')}
				>
					<div class="inline-flex items-center gap-1 text-[10px] font-black text-warning-content bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
						<ShieldIcon size="11" />
						<span>ข้อเสนอปกติ (เริ่มขั้น 3)</span>
					</div>
					<div class="text-2xl sm:text-3xl font-black text-warning-content font-mono group-hover:scale-105 transition-transform">
						฿{offers.midAmount.toLocaleString()}
					</div>
					<div class="text-[11px] text-base-content/70 leading-snug">
						ห่างจาก Chaser <strong>3 ขั้น</strong><br>(3 ก้าวถึงบ้าน)
					</div>
					<div class="btn btn-xs btn-warning text-warning-content font-bold w-full rounded-xl mt-1">เลือกข้อเสนอนี้</div>
				</button>

				<!-- Low Offer -->
				<button
					class="flex flex-col items-center justify-between p-4 sm:p-5 rounded-3xl bg-base-100 text-base-content border border-primary/30 hover:border-primary/30 hover:bg-base-100 text-base-content hover:scale-[1.02] transition-all text-center gap-2.5 shadow-xl group"
					on:click={() => selectOffer('low')}
				>
					<div class="inline-flex items-center gap-1 text-[10px] font-black text-primary bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-primary/30">
						<TrendingDownIcon size="11" />
						<span>ข้อเสนอต่ำ (เริ่มขั้น 5)</span>
					</div>
					<div class="text-2xl sm:text-3xl font-black text-primary font-mono group-hover:scale-105 transition-transform">
						฿{offers.lowAmount.toLocaleString()}
					</div>
					<div class="text-[11px] text-base-content/70 leading-snug">
						ห่างจาก Chaser <strong>5 ขั้น</strong><br>(2 ก้าวถึงบ้าน)
					</div>
					<div class="btn btn-xs btn-success text-success-content font-bold w-full rounded-xl mt-1">เลือกข้อเสนอต่ำ</div>
				</button>
			</div>
		</div>

	<!-- ========================================================================= -->
	<!-- 5. HEAD-TO-HEAD BOARD CHASE (7 STEPS)                                     -->
	<!-- ========================================================================= -->
	{:else if phase === 'board_chase'}
		<div class="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">

			<!-- CHASE BOARD: Horizontal on Mobile with minimal height, Vertical on Desktop -->
			<div class="botanical-card md:col-span-4 bg-base-100 text-base-content border border-base-300 rounded-2xl p-2.5 sm:p-4 flex flex-col gap-1.5 sm:gap-2 shadow-2xl">
				<div class="flex items-center justify-between border-b border-base-300 pb-1.5 px-0.5">
					<div class="text-[11px] sm:text-xs font-black text-base-content flex items-center gap-1.5">
						<span>⚡ CHASE BOARD</span>
					</div>
					<span class="font-mono text-xs font-bold text-warning-content">฿{bankedAmount.toLocaleString()}</span>
				</div>

				<!-- Responsive Board: flex-row on mobile (h-8), flex-col on desktop -->
				<div class="flex flex-row md:flex-col gap-1 sm:gap-1.5 w-full overflow-x-auto py-0.5">
					{#each [0, 1, 2, 3, 4, 5, 6, 7] as stepIdx}
						{@const isChaserHere = chaserStep === stepIdx}
						{@const isPlayerHere = playerStep === stepIdx}
						{@const isHome = stepIdx === 7}

						<div
							class="botanical-card flex-1 md:flex-initial min-w-[36px] h-8 sm:h-9 rounded-xl border transition-all flex items-center justify-center md:justify-between px-1 md:px-3 relative overflow-hidden
							{isHome ? 'bg-gradient-to-r from-base-200 to-base-200 border-primary/30' : 'bg-base-100 text-base-content border-base-300'}
							{isPlayerHere ? 'ring-2 ring-blue-400 shadow-lg shadow-blue-500/30' : ''}
							{isChaserHere ? 'ring-2 ring-red-500 shadow-lg shadow-red-500/30' : ''}"
						>
							<!-- Step label -->
							<div class="flex items-center gap-1 z-10">
								<span class="font-mono text-[9px] sm:text-[10px] text-base-content/70 font-bold">
									{stepIdx === 0 ? 'START' : isHome ? 'HOME' : `${stepIdx}`}
								</span>
							</div>

							<!-- Occupant Markers -->
							<div class="flex items-center gap-1 z-10 ml-1 md:ml-0">
								{#if isChaserHere}
									<span class="inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-red-500/20 border border-red-500/50 text-error-content text-[9px] sm:text-[10px] font-black animate-pulse">
										{chaser.avatarEmoji} <span class="hidden md:inline">CHASER</span>
									</span>
								{/if}
								{#if isPlayerHere}
									<span class="inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-blue-500/20 border border-blue-500/50 text-primary text-[9px] sm:text-[10px] font-black animate-bounce">
										🔵 <span class="hidden md:inline">YOU</span>
									</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- QUESTION & 3-CHOICE LOCK-IN (8 cols) -->
			<div class="md:col-span-8 flex flex-col gap-3">
				{#if boardQuestions[currentBoardQIdx]}
					{@const q = boardQuestions[currentBoardQIdx]}
					<div class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl p-4 sm:p-7 shadow-2xl flex flex-col gap-3.5 sm:gap-4">

						<!-- Question status banner -->
						<div class="flex items-center justify-between border-b border-base-300 pb-2">
							<span class="text-xs text-base-content/70 font-bold">ข้อที่ {currentBoardQIdx + 1}</span>
							<div class="flex items-center gap-2">
								{#if boardState === 'player_locked'}
									<span class="text-xs text-primary font-bold animate-pulse">🔒 คุณเลือกแล้ว (รอ Chaser)...</span>
								{:else if boardState === 'revealing_player' || boardState === 'revealing_chaser'}
									<span class="text-xs text-warning-content font-bold">⚡ กำลังเฉลยคำตอบ...</span>
								{/if}
							</div>
						</div>

						<h3 class="text-base sm:text-xl font-black text-base-content leading-snug min-h-[3rem] sm:min-h-[3.5rem] flex items-center">
							{q.question}
						</h3>

						<!-- 3 Choices -->
						<div class="flex flex-col gap-2 pt-1">
							{#each q.choices as choice, idx}
								{@const isPlayerSelected = playerChoice === idx}
								{@const isChaserSelected = chaserChoice === idx}
								{@const isCorrectChoice = q.correctIndex === idx}
								{@const showPlayerReveal = boardState === 'revealing_player' || boardState === 'revealing_chaser' || boardState === 'moving'}
								{@const showChaserReveal = boardState === 'revealing_chaser' || boardState === 'moving'}

								<button
									class="btn btn-lg justify-start h-auto py-3 px-4 rounded-2xl font-bold text-sm sm:text-base transition-all text-left flex items-center justify-between border
									{isPlayerSelected && !showPlayerReveal ? 'bg-blue-600 border-blue-400 text-base-content' : ''}
									{showPlayerReveal && isPlayerSelected && isCorrectChoice ? 'bg-emerald-600 border-primary/30 text-base-content shadow-lg shadow-emerald-500/20' : ''}
									{showPlayerReveal && isPlayerSelected && !isCorrectChoice ? 'bg-rose-600 border-rose-400 text-base-content shadow-lg shadow-rose-500/20' : ''}
									{!isPlayerSelected && !showPlayerReveal ? 'bg-base-100 text-base-content border-base-300 text-base-content/70 hover:border-amber-400 hover:bg-base-100 text-base-content' : ''}
									{showPlayerReveal && !isPlayerSelected && isCorrectChoice ? 'border-primary/30 bg-base-300 text-base-content text-primary' : ''}
									{showPlayerReveal && !isPlayerSelected && !isCorrectChoice ? 'bg-base-100 text-base-content border-base-300 text-base-content/70' : ''}"
									disabled={boardState !== 'reading'}
									on:click={() => handleBoardPlayerChoice(idx)}
								>
									<div class="flex items-center gap-3">
										<span class="w-6 h-6 rounded-md bg-base-100 text-base-content font-mono text-xs flex items-center justify-center font-black">
											{['A', 'B', 'C'][idx]}
										</span>
										<span>{choice}</span>
									</div>

									<div class="flex items-center gap-1.5">
										{#if showPlayerReveal && isPlayerSelected}
											<span class="badge badge-xs {isCorrectChoice ? 'badge-success text-success-content' : 'badge-error text-error-content'} font-bold">YOU</span>
										{/if}
										{#if showChaserReveal && isChaserSelected}
											<span class="badge badge-xs badge-neutral border-red-500 text-error-content font-bold">{chaser.avatarEmoji}</span>
										{/if}
									</div>
								</button>
							{/each}
						</div>

						<!-- Trivia Explanation after reveal -->
						{#if boardState === 'moving' || boardState === 'revealing_chaser'}
							<div class="p-3 rounded-xl bg-base-100 text-base-content border border-base-300 text-xs text-base-content/70 leading-relaxed" in:slide={{ duration: 150 }}>
								💡 <strong>คำอธิบาย:</strong> {q.explanation}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>

	<!-- ========================================================================= -->
	<!-- 6. BOARD RESULT (SAFE TO FINAL CHASE)                                     -->
	<!-- ========================================================================= -->
	{:else if phase === 'board_result'}
		<div class="botanical-card rounded-3xl bg-base-100 text-base-content border border-primary/30 p-6 sm:p-8 flex flex-col items-center text-center gap-4 shadow-2xl" in:scale={{ duration: 200 }}>
			<div class="w-16 h-16 rounded-full bg-emerald-500/20 border border-primary/30 flex items-center justify-center text-3xl">
				🏆
			</div>
			<div>
				<h3 class="text-2xl sm:text-3xl font-black text-base-content">คุณรอดกลับบ้านสำเร็จ!</h3>
				<p class="text-xs text-base-content/70 mt-1">เงินรางวัล <strong>฿{bankedAmount.toLocaleString()}</strong> เข้าสู่รอบ Final Chase!</p>
			</div>

			<button
				class="btn btn-success btn-md font-black text-success-content px-8 rounded-2xl gap-2 shadow-lg shadow-emerald-500/20 mt-2"
				on:click={proceedToFinalChase}
			>
				<span>เข้าสู่รอบตัดสิน The Final Chase!</span>
				<ArrowRightIcon size="16" />
			</button>
		</div>

	<!-- ========================================================================= -->
	<!-- 7. FINAL CHASE PREP & PLAYER ROUND                                        -->
	<!-- ========================================================================= -->
	{:else if phase === 'final_chase_player_prep'}
		<div class="botanical-card rounded-3xl bg-base-100 text-base-content border border-base-300 p-6 sm:p-8 flex flex-col items-center text-center gap-4 shadow-2xl" in:fade={{ duration: 200 }}>
			<span class="text-5xl">⚡</span>
			<h3 class="text-2xl sm:text-3xl font-black text-base-content">THE FINAL CHASE</h3>
			<p class="text-xs sm:text-sm text-base-content/70 max-w-md leading-relaxed">
				คุณมีเวลา <strong>60 วินาที</strong> ในการตอบคำถามให้ได้มากที่สุด ทุก 1 ข้อที่ถูกต้องจะเพิ่ม <strong>Target Step (ก้าวหนี)</strong> ให้กับคุณ!
			</p>
			<button class="btn btn-warning btn-md font-black text-warning-content px-8 rounded-2xl mt-2" on:click={startFinalPlayerRound}>
				<PlayIcon size="18" />
				<span>เริ่มจับเวลา 60 วินาที</span>
			</button>
		</div>

	{:else if phase === 'final_chase_player_playing'}
		<div class="flex flex-col gap-4">
			<div class="botanical-card flex items-center justify-between bg-base-100 text-base-content border border-base-300 rounded-2xl px-4 py-3 shadow-lg">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-black text-warning-content text-lg">
						{finalPlayerTime}s
					</div>
					<div>
						<div class="text-[10px] text-base-content/70 font-bold uppercase">Final Chase: Set The Target</div>
						<div class="text-base font-black text-base-content">ข้อที่ {finalQIdx + 1}</div>
					</div>
				</div>

				<div class="text-right">
					<div class="text-[10px] text-base-content/70 font-bold uppercase">Target Steps</div>
					<div class="text-xl font-black text-warning-content font-mono">{finalTargetSteps} ก้าว</div>
				</div>
			</div>

			{#if finalQuestions[finalQIdx]}
				{@const q = finalQuestions[finalQIdx]}
				<div class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col gap-4">
					<h3 class="text-lg sm:text-xl font-black text-base-content min-h-[3.5rem] flex items-center">
						{q.question}
					</h3>

					<div class="grid grid-cols-1 gap-2.5">
						{#if !finalChoicesRevealed}
							<div class="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-base-100 text-base-content border border-amber-500/30 text-warning-content text-xs font-mono animate-pulse">
								<span class="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
								<span>กำลังอ่านคำถาม... ตัวเลือกจะเปิดใน 2 วินาที</span>
							</div>
						{/if}

						{#each q.choices as choice, idx}
							{@const isSelected = finalPlayerAnswerChoice === idx}
							{@const isCorrectChoice = idx === q.correctIndex}
							{@const showFeedback = finalPlayerFeedback !== null}
							<button
								class="btn btn-lg justify-start h-auto py-3.5 px-4 rounded-2xl font-bold text-sm sm:text-base border transition-all text-left flex items-center justify-between
								{!finalChoicesRevealed ? 'opacity-40 pointer-events-none bg-base-100 text-base-content border-base-300 text-base-content/70' : ''}
								{showFeedback && isSelected && isCorrectChoice ? 'bg-emerald-600 border-primary/30 text-base-content shadow-lg shadow-emerald-500/30' : ''}
								{showFeedback && isSelected && !isCorrectChoice ? 'bg-rose-600 border-rose-400 text-base-content shadow-lg shadow-rose-500/30 animate-shake' : ''}
								{showFeedback && !isSelected && isCorrectChoice ? 'border-primary/30 bg-base-300 text-base-content text-primary' : ''}
								{!showFeedback && finalChoicesRevealed ? 'border-base-300 bg-base-100 text-base-content text-base-content/70 hover:bg-amber-500 hover:text-base-content/70 hover:border-amber-400' : ''}"
								disabled={!finalChoicesRevealed || showFeedback}
								on:click={() => handleFinalPlayerChoice(idx)}
							>
								<div class="flex items-center gap-3">
									<span class="w-6 h-6 rounded-md bg-base-100 text-base-content font-mono text-xs flex items-center justify-center font-black text-warning-content">
										{['A', 'B', 'C'][idx]}
									</span>
									<span>{choice}</span>
								</div>
								{#if showFeedback && isSelected}
									<span class="badge badge-sm {isCorrectChoice ? 'badge-success text-success-content' : 'badge-error text-error-content'} font-bold">
										{isCorrectChoice ? '✔ +1 ก้าว' : '✖ 0 ก้าว'}
									</span>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>

	<!-- ========================================================================= -->
	<!-- 8. FINAL CHASE: CHASER RUN & PUSHBACK                                     -->
	<!-- ========================================================================= -->
	{:else if phase === 'final_chase_chaser_playing'}
		<div class="flex flex-col gap-4">
			<!-- Chaser Status HUD -->
			<div class="botanical-card flex items-center justify-between bg-base-100 text-base-content border border-base-300 rounded-2xl px-4 py-3 shadow-lg">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center font-black text-error-content text-lg">
						{finalChaserTime}s
					</div>
					<div>
						<div class="text-[10px] text-base-content/70 font-bold uppercase">{chaser.name} กำลังไล่ล่า!</div>
						<div class="text-sm font-black text-base-content">Chaser: {finalChaserSteps} / {finalTargetSteps} ก้าว</div>
					</div>
				</div>

				<div class="text-right">
					<div class="text-[10px] text-base-content/70 font-bold uppercase">เงินเดิมพัน</div>
					<div class="text-base font-black text-warning-content font-mono">฿{bankedAmount.toLocaleString()}</div>
				</div>
			</div>

			<!-- Pushback Modal or Active Question -->
			{#if pushbackPending}
				{@const q = finalQuestions[finalQIdx]}
				<div class="bg-gradient-to-br from-amber-950/80 to-base-200 border-2 border-amber-500 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col gap-4 animate-pulse">
					<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-warning-content text-xs font-black w-fit">
						<ActivityIcon size="14" />
						<span>PUSHBACK OPPORTUNITY! (ผู้ล่าตอบผิด!)</span>
					</div>

					<h3 class="text-lg sm:text-xl font-black text-base-content">{q.question}</h3>

					<p class="text-xs text-warning-content">ตอบถูกเพื่อดัน Chaser ถอยหลัง 1 ก้าว!</p>

					<div class="grid grid-cols-1 gap-2.5">
						{#each q.choices as choice, idx}
							<button
								class="btn btn-lg justify-start h-auto py-3.5 px-4 rounded-2xl font-bold text-sm sm:text-base border-amber-500/40 bg-base-100 text-base-content text-base-content/70 hover:bg-amber-500 hover:text-base-content/70 transition-all text-left flex items-center gap-3"
								disabled={pushbackAnswerChoice !== null}
								on:click={() => handlePushbackChoice(idx)}
							>
								<span class="w-6 h-6 rounded-md bg-base-100 text-base-content font-mono text-xs flex items-center justify-center font-black text-warning-content">
									{['A', 'B', 'C'][idx]}
								</span>
								<span>{choice}</span>
							</button>
						{/each}
					</div>
				</div>
			{:else}
				<div class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl p-8 text-center flex flex-col items-center gap-3 shadow-2xl">
					<span class="text-5xl animate-bounce">{chaser.avatarEmoji}</span>
					<h3 class="text-xl font-black text-base-content">{chaser.title} กำลังประมวลผลคำถาม...</h3>
					<p class="text-xs text-base-content/70">หาก Chaser ตอบผิด เวลาจะหยุดและคุณจะมีโอกาส Pushback ทันที!</p>
				</div>
			{/if}
		</div>

	<!-- ========================================================================= -->
	<!-- 9. VICTORY / GAME OVER                                                    -->
	<!-- ========================================================================= -->
	{:else if phase === 'victory'}
		<div class="botanical-card rounded-3xl bg-base-100 text-base-content border border-primary/30 p-7 sm:p-10 flex flex-col items-center text-center gap-5 shadow-2xl shadow-emerald-500/10" in:scale={{ duration: 250 }}>
			<div class="w-20 h-20 rounded-full bg-emerald-500/20 border border-primary/30 flex items-center justify-center text-4xl">
				👑
			</div>
			<div>
				<h2 class="text-2xl sm:text-4xl font-black text-primary">YOU BEAT THE CHASER!</h2>
				<p class="text-sm text-base-content/70 mt-1">คุณสามารถเอาชนะ {chaser.name} และคว้ารางวัลกลับบ้านสำเร็จ!</p>
			</div>

			<div class="text-3xl sm:text-5xl font-black text-warning-content font-mono py-2">
				฿{bankedAmount.toLocaleString()}
			</div>

			<div class="flex items-center justify-center gap-3 mt-2">
				<button class="btn btn-warning font-black text-warning-content px-8 rounded-2xl" on:click={resetAll}>
					<RefreshCwIcon size="16" />
					<span>เล่นใหม่อีกครั้ง</span>
				</button>
			</div>
		</div>

	{:else if phase === 'game_over'}
		<div class="botanical-card rounded-3xl bg-base-100 text-base-content border border-red-500/50 p-7 sm:p-10 flex flex-col items-center text-center gap-5 shadow-2xl shadow-red-500/10" in:scale={{ duration: 250 }}>
			<div class="w-20 h-20 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-4xl">
				💀
			</div>
			<div>
				<h2 class="text-2xl sm:text-4xl font-black text-red-500">CAUGHT BY THE CHASER!</h2>
				<p class="text-sm text-base-content/70 mt-1">{chaser.title} ไล่ตามทันและจับคุณได้สำเร็จ!</p>
			</div>

			<div class="flex items-center justify-center gap-3 mt-2">
				<button class="btn btn-error font-black text-error-content px-8 rounded-2xl" on:click={resetAll}>
					<RefreshCwIcon size="16" />
					<span>ท้าดวลอีกครั้ง</span>
				</button>
			</div>
		</div>
	{/if}

</div>
