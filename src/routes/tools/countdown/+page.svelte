<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import dict from '#lib/utils/dict.js';
	import {
		ClockIcon,
		PlayIcon,
		PauseIcon,
		RotateCcwIcon,
		CheckCircleIcon,
		XCircleIcon,
		Trash2Icon,
		AwardIcon,
		ChevronRightIcon,
		EyeOffIcon,
		LogOutIcon,
		Maximize2Icon,
		Minimize2Icon,
		LayersIcon
	} from 'svelte-feather-icons';
	import { scale, fade } from 'svelte/transition';

	// Full Thai Tone marks (่ ้ ๊ ๋ ็ ํ ๎) and Garun (์) regex - Unicode U+0E47 to U+0E4E
	const TONE_GARUN_REGEX = /[\u0E47-\u0E4E]/g;

	// Global normalized dictionary Set for fast & robust lookups
	let dictSet = new Set<string>();

	// Full Screen, Round Number and Setup State
	let gameStarted = false;
	let isFullscreen = false;
	let roundNumber = 1;

	// Options Setup: Duration (30s vs 60s) & Tile Count (9 vs unlimited)
	let gameDuration = 30; // 30s or 60s
	let tileLimitMode: '9' | 'unlimited' = '9';
	$: maxPoolSize = tileLimitMode === '9' ? 9 : 99;

	let timeLeft = 30;
	let timerInterval: any = null;
	let isTimerRunning = false;
	let isTimerPaused = false;

	// Audio Context for SFX & Countdown Soundtrack
	let audioCtx: AudioContext | null = null;

	// Phase State: 'pool' | 'timer' | 'validation' | 'results' | 'podium'
	let phase: 'pool' | 'timer' | 'validation' | 'results' | 'podium' = 'pool';

	// Pool of letter tiles
	let pool: string[] = [];
	let isTwoRows = false; // Tile Pool Layout: 1 Row vs 2 Rows
	let isSpinningSlot = false;
	let spinningTileIndex = -1;
	let tempSpinChar = '';

	// Weighted Pools for Frequency-based Randomization
	let weightedConsonants: string[] = [];
	let weightedVowels: string[] = [];

	// Team Interface
	interface Team {
		id: string;
		name: string;
		score: number;
		submittedWord?: string;
		wordScore?: number;
		isCorrect?: boolean;
		feedbackReason?: string;
	}

	let teams: Team[] = [];
	let setupTeamName = '';

	// Reactive sorted teams for podium
	$: sortedTeams = [...teams].sort((a, b) => b.score - a.score);

	// Reactive tile counts for pool rendering
	$: totalDisplayTiles = tileLimitMode === '9' ? 9 : Math.max(9, pool.length);
	$: row1Count = Math.ceil(totalDisplayTiles / 2);
	$: row2Count = Math.floor(totalDisplayTiles / 2);

	// Randomized order of teams for validation phase
	let randomizedTeams: Team[] = [];
	let currentTeamIndex = 0;
	let currentTeamInput = '';
	let currentSubmissionResult: { isCorrect: boolean; isValid: boolean; score: number; reason: string } | null = null;
	let showAnswerAnimation = false;

	// Pre-calculated Valid Solutions & Acceptable Answers
	let computedSolutionsSet = new Set<string>();
	let groupedAcceptableAnswers: Record<number, string[]> = {};
	let sortedScoreKeys: number[] = [];

	// SVG Circular Countdown Clock Math (6 degrees per second, 0 degrees = 12 o'clock top center)
	$: elapsedTime = gameDuration - timeLeft;
	$: clockAngle = elapsedTime * 6;
	$: needleTip = polarToCartesian(120, 120, 88, clockAngle);

	// Calculate SVG Arc Sector Path for passed time
	function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
		if (endAngle - startAngle >= 360) {
			endAngle = 359.999;
		}
		const start = polarToCartesian(x, y, radius, endAngle);
		const end = polarToCartesian(x, y, radius, startAngle);
		const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
		return [
			'M', x, y,
			'L', end.x, end.y,
			'A', radius, radius, 0, largeArcFlag, 1, start.x, start.y,
			'Z'
		].join(' ');
	}

	function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
		const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
		return {
			x: centerX + radius * Math.cos(angleInRadians),
			y: centerY + radius * Math.sin(angleInRadians)
		};
	}

	// Build Letter Frequency Pools & Normalized Dictionary Set on Mount
	onMount(() => {
		const cCounts: Record<string, number> = {};
		const vCounts: Record<string, number> = {};

		const cRegex = /[ก-ฮ]/;
		const vRegex = /[ะาิีึืุูเแโใไำฤ]/;

		const setObj = new Set<string>();

		for (const w of dict) {
			const normWord = w.trim().normalize('NFC');
			setObj.add(normWord);

			for (const char of normWord.split('')) {
				if (cRegex.test(char)) {
					cCounts[char] = (cCounts[char] || 0) + 1;
				} else if (vRegex.test(char)) {
					vCounts[char] = (vCounts[char] || 0) + 1;
				}
			}
		}

		dictSet = setObj;

		// Build weighted arrays
		const tempC: string[] = [];
		for (const [char, count] of Object.entries(cCounts)) {
			const weight = Math.max(1, Math.floor(Math.sqrt(count)));
			for (let i = 0; i < weight; i++) tempC.push(char);
		}

		const tempV: string[] = [];
		for (const [char, count] of Object.entries(vCounts)) {
			const weight = Math.max(1, Math.floor(Math.sqrt(count)));
			for (let i = 0; i < weight; i++) tempV.push(char);
		}

		weightedConsonants = tempC.length > 0 ? tempC : ['ก', 'น', 'ร', 'ม', 'ส', 'ต', 'ย', 'ล', 'ว', 'ด'];
		weightedVowels = tempV.length > 0 ? tempV : ['ะ', 'า', 'ิ', 'ี', 'ุ', 'ู', 'เ', 'แ', 'โ', 'ใ', 'ไ'];

		const handleFsChange = () => {
			isFullscreen = !!document.fullscreenElement;
		};
		document.addEventListener('fullscreenchange', handleFsChange);
		return () => document.removeEventListener('fullscreenchange', handleFsChange);
	});

	function getAudioCtx() {
		if (typeof window === 'undefined') return null;
		if (!audioCtx) {
			audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
		}
		if (audioCtx && audioCtx.state === 'suspended') {
			audioCtx.resume().catch(() => {});
		}
		return audioCtx;
	}

	// Slot Machine Reel Tick Sound Effect
	function playSlotMachineSFX() {
		const ctx = getAudioCtx();
		if (!ctx) return;
		try {
			const now = ctx.currentTime;
			[0, 0.06, 0.12, 0.18, 0.25].forEach((timeOffset, idx) => {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.type = 'triangle';
				osc.frequency.setValueAtTime(350 + idx * 110, now + timeOffset);
				gain.gain.setValueAtTime(0.2, now + timeOffset);
				gain.gain.exponentialRampToValueAtTime(0.01, now + timeOffset + 0.04);

				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.start(now + timeOffset);
				osc.stop(now + timeOffset + 0.05);
			});
		} catch (e) {}
	}

	// Real Gameshow Countdown Clock Tick-Tock & End Chime
	function playCountdownBeat(secRemaining: number) {
		const ctx = getAudioCtx();
		if (!ctx) return;
		try {
			const now = ctx.currentTime;
			if (secRemaining === 0) {
				// End Chime Bell
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.type = 'sine';
				osc.frequency.setValueAtTime(880, now);
				gain.gain.setValueAtTime(0.4, now);
				gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.start(now);
				osc.stop(now + 1.2);
			} else {
				// Tick Tock Woodblock Beat
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.type = 'sine';
				const isTick = secRemaining % 2 === 0;
				osc.frequency.setValueAtTime(isTick ? 600 : 450, now);
				gain.gain.setValueAtTime(0.15, now);
				gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.start(now);
				osc.stop(now + 0.09);
			}
		} catch (e) {}
	}

	// Add Team (Defaults to "ทีม n" if no name provided)
	function addSetupTeam() {
		const nameToAdd = setupTeamName.trim() || `ทีม ${teams.length + 1}`;
		teams = [...teams, { id: String(Date.now()), name: nameToAdd, score: 0 }];
		setupTeamName = '';
	}

	function removeSetupTeam(id: string) {
		teams = teams.filter((t) => t.id !== id);
	}

	// Native Element Fullscreen Trigger (Hides Navbar automatically)
	function startGameShow() {
		if (teams.length === 0) return;
		gameStarted = true;
		phase = 'pool';
		timeLeft = gameDuration;
		roundNumber = 1;

		if (typeof window !== 'undefined') {
			const elem = document.getElementById('countdown-fullscreen-container');
			if (elem && elem.requestFullscreen) {
				elem.requestFullscreen().catch(() => {});
			}
		}
	}

	function toggleFullscreenMode() {
		if (typeof window === 'undefined') return;
		const elem = document.getElementById('countdown-fullscreen-container');
		if (!elem) return;

		if (!document.fullscreenElement) {
			elem.requestFullscreen().catch(() => {});
		} else {
			document.exitFullscreen().catch(() => {});
		}
	}

	function triggerGameEndPodium() {
		stopTimer();
		phase = 'podium';
	}

	function exitGameShow() {
		gameStarted = false;
		phase = 'pool';
		if (typeof document !== 'undefined' && document.exitFullscreen && document.fullscreenElement) {
			document.exitFullscreen().catch(() => {});
		}
		startNewRound();
	}

	// Draw random Consonant with Slot Machine Animation & Sound
	function addConsonant() {
		if (pool.length >= maxPoolSize || weightedConsonants.length === 0 || isSpinningSlot) return;
		const finalChar = weightedConsonants[Math.floor(Math.random() * weightedConsonants.length)];
		runSlotMachineAnimation(finalChar);
	}

	// Draw random Vowel with Slot Machine Animation & Sound
	function addVowel() {
		if (pool.length >= maxPoolSize || weightedVowels.length === 0 || isSpinningSlot) return;
		const finalChar = weightedVowels[Math.floor(Math.random() * weightedVowels.length)];
		runSlotMachineAnimation(finalChar);
	}

	// Randomize All Pool Tiles (Guarantees at least one 7-letter word, then fills remaining slots)
	function randomizeAll() {
		if (isSpinningSlot) return;

		// 1. Find dictionary words with length 7
		const words7 = dict.filter((w) => w.trim().length === 7);
		if (words7.length === 0) return;

		// 2. Pick a random 7-letter word & extract base letters
		const targetWord = words7[Math.floor(Math.random() * words7.length)].trim().normalize('NFC');
		const baseLetters = targetWord.replace(TONE_GARUN_REGEX, '').split('');

		// 3. Fill remaining slots to reach target pool size (9 tiles)
		const targetCount = tileLimitMode === '9' ? 9 : Math.max(9, baseLetters.length + 2);
		const remainingCount = Math.max(0, targetCount - baseLetters.length);
		const extraTiles: string[] = [];

		for (let i = 0; i < remainingCount; i++) {
			const useVowel = Math.random() < 0.35;
			if (useVowel && weightedVowels.length > 0) {
				extraTiles.push(weightedVowels[Math.floor(Math.random() * weightedVowels.length)]);
			} else if (weightedConsonants.length > 0) {
				extraTiles.push(weightedConsonants[Math.floor(Math.random() * weightedConsonants.length)]);
			}
		}

		// 4. Combine & shuffle pool tiles
		const fullPool = [...baseLetters, ...extraTiles].sort(() => 0.5 - Math.random());

		// 5. Trigger slot-machine sound & reel animation
		playSlotMachineSFX();
		isSpinningSlot = true;

		const sampleChars = ['ก', 'ข', 'ค', 'ง', 'จ', 'ช', 'ด', 'ต', 'บ', 'ป', 'ม', 'ย', 'ร', 'ล', 'ว', 'ส', 'ะ', 'า', 'ิ', 'ี', 'เ', 'โ'];
		let spins = 0;
		const spinInterval = setInterval(() => {
			spins++;
			tempSpinChar = sampleChars[Math.floor(Math.random() * sampleChars.length)];
			if (spins >= 10) {
				clearInterval(spinInterval);
				pool = fullPool;
				isSpinningSlot = false;
				spinningTileIndex = -1;
				tempSpinChar = '';
			}
		}, 35);
	}

	// Slot Machine Reel Cycling Animation
	function runSlotMachineAnimation(finalChar: string) {
		isSpinningSlot = true;
		spinningTileIndex = pool.length;
		playSlotMachineSFX();

		const samplePool = ['ก', 'ข', 'ค', 'ง', 'จ', 'ช', 'ด', 'ต', 'บ', 'ป', 'ม', 'ย', 'ร', 'ล', 'ว', 'ส', 'ะ', 'า', 'ิ', 'ี', 'เ', 'โ'];
		let spins = 0;

		const spinInterval = setInterval(() => {
			tempSpinChar = samplePool[Math.floor(Math.random() * samplePool.length)];
			spins++;
			if (spins >= 8) {
				clearInterval(spinInterval);
				pool = [...pool, finalChar];
				isSpinningSlot = false;
				spinningTileIndex = -1;
				tempSpinChar = '';
			}
		}, 35);
	}

	// Remove tile from pool
	function removeTile(index: number) {
		if (isSpinningSlot) return;
		pool = pool.filter((_, idx) => idx !== index);
	}

	// Reset Letter Pool
	function resetPool() {
		pool = [];
		phase = 'pool';
		stopTimer();
		timeLeft = gameDuration;
		isTimerPaused = false;
	}

	// Pre-calculate Solutions when game/timer starts
	function computeSolutionsAndStartTimer() {
		if (pool.length === 0) return;
		computeGroupedAcceptableAnswers();
		phase = 'timer';
		timeLeft = gameDuration;
		isTimerPaused = false;
		startTimer();
	}

	function startTimer() {
		if (isTimerRunning) return;
		isTimerRunning = true;
		isTimerPaused = false;
		playCountdownBeat(timeLeft);

		timerInterval = setInterval(() => {
			if (timeLeft > 0) {
				timeLeft -= 1;
				playCountdownBeat(timeLeft);
			} else {
				stopTimer();
				finishTimerPhase();
			}
		}, 1000);
	}

	function pauseTimer() {
		stopTimer();
		isTimerPaused = true;
	}

	function stopTimer() {
		isTimerRunning = false;
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
	}

	function resetTimer() {
		stopTimer();
		timeLeft = gameDuration;
		isTimerPaused = false;
	}

	function finishTimerPhase() {
		stopTimer();
		isTimerPaused = false;
		phase = 'validation';
		// Ensure solutions are pre-calculated
		if (computedSolutionsSet.size === 0) {
			computeGroupedAcceptableAnswers();
		}
		// Randomize team order for answering
		randomizedTeams = teams.map((t) => ({ ...t, submittedWord: undefined, wordScore: undefined, isCorrect: undefined })).sort(() => 0.5 - Math.random());
		currentTeamIndex = 0;
		currentTeamInput = '';
		currentSubmissionResult = null;
		showAnswerAnimation = false;
	}

	// Clean base letter extraction (removes all tone marks U+0E47-U+0E4E)
	function getBaseLetters(word: string): string[] {
		return word
			.normalize('NFC')
			.replace(TONE_GARUN_REGEX, '')
			.split('');
	}

	// Robust Pool Letter Matcher
	function canFormWord(word: string, tilePool: string[]): boolean {
		if (!word || word.length <= 1) return false;
		const baseLetters = getBaseLetters(word);
		const poolCounts: Record<string, number> = {};
		for (const t of tilePool) {
			const normT = t.normalize('NFC');
			poolCounts[normT] = (poolCounts[normT] || 0) + 1;
		}
		for (const char of baseLetters) {
			if (!poolCounts[char] || poolCounts[char] <= 0) {
				return false;
			}
			poolCounts[char]--;
		}
		return true;
	}

	// Pre-calculate Grouped Solutions & Solution Lookup Set
	function computeGroupedAcceptableAnswers() {
		if (pool.length === 0) {
			groupedAcceptableAnswers = {};
			sortedScoreKeys = [];
			computedSolutionsSet = new Set();
			return;
		}

		const grouped: Record<number, string[]> = {};
		const validSet = new Set<string>();

		for (const w of dict) {
			const clean = w.trim().normalize('NFC');
			if (clean.length > 1 && canFormWord(clean, pool)) {
				validSet.add(clean);
				const score = clean.length;
				if (!grouped[score]) grouped[score] = [];
				if (!grouped[score].includes(clean)) {
					grouped[score].push(clean);
				}
			}
		}

		for (const scoreStr in grouped) {
			grouped[scoreStr].sort((a, b) => a.localeCompare(b));
		}

		computedSolutionsSet = validSet;
		groupedAcceptableAnswers = grouped;
		sortedScoreKeys = Object.keys(grouped)
			.map(Number)
			.sort((a, b) => b - a);
	}

	// Validate Team Word against Pre-calculated Solutions or Dictionary
	function validateWord(word: string): { isCorrect: boolean; isValid: boolean; score: number; reason: string } {
		const clean = word.trim().normalize('NFC');
		if (clean.length <= 1) {
			return { isCorrect: false, isValid: false, score: 0, reason: 'ต้องยาวมากกว่า 1 ตัวอักษร' };
		}

		// Check against pre-calculated valid solutions set
		if (computedSolutionsSet.has(clean)) {
			return { isCorrect: true, isValid: true, score: clean.length, reason: 'ถูกต้อง!' };
		}

		// Fallback check: is in dictionary AND forms from pool?
		if (dictSet.has(clean) && canFormWord(clean, pool)) {
			return { isCorrect: true, isValid: true, score: clean.length, reason: 'ถูกต้อง!' };
		}

		if (!dictSet.has(clean)) {
			return { isCorrect: false, isValid: false, score: 0, reason: 'ไม่อยู่ในพจนานุกรม' };
		}

		return { isCorrect: false, isValid: false, score: 0, reason: 'ใช้ตัวอักษรนอกเหนือจากกระดาน' };
	}

	function submitTeamAnswer() {
		if (currentTeamIndex >= randomizedTeams.length || showAnswerAnimation) return;
		const team = randomizedTeams[currentTeamIndex];
		const res = validateWord(currentTeamInput);

		team.submittedWord = currentTeamInput.trim();
		team.isCorrect = res.isCorrect;
		team.wordScore = res.score;
		team.feedbackReason = res.reason;

		currentSubmissionResult = res;
		showAnswerAnimation = true;

		// Update total team score
		const origTeam = teams.find((t) => t.id === team.id);
		if (origTeam && res.isCorrect) {
			origTeam.score += res.score;
		}

		teams = [...teams];
		randomizedTeams = [...randomizedTeams];

		setTimeout(() => {
			showAnswerAnimation = false;
			currentTeamIndex += 1;
			currentTeamInput = '';
			currentSubmissionResult = null;

			if (currentTeamIndex >= randomizedTeams.length) {
				phase = 'results';
			}
		}, 1800);
	}

	function handleAnswerKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			submitTeamAnswer();
		}
	}

	function startNewRound() {
		pool = [];
		phase = 'pool';
		stopTimer();
		timeLeft = gameDuration;
		isTimerPaused = false;
		currentTeamIndex = 0;
		currentTeamInput = '';
		currentSubmissionResult = null;
		showAnswerAnimation = false;
		roundNumber += 1;
	}

	onDestroy(() => {
		stopTimer();
	});
</script>

<svelte:head>
	<title>Code Breaker | Countdown</title>
</svelte:head>

<div id="countdown-fullscreen-container" class="w-full min-h-screen bg-base-100 text-base-content text-base-content/70 font-sans">

	<!-- INITIAL SETUP SCREEN (When game has not started) -->
	{#if !gameStarted}
		<div class="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen max-w-2xl text-center space-y-8">
			<!-- Title Header: Just "Countdown" -->
			<div>
				<h1 class="text-5xl sm:text-7xl font-black tracking-tight text-base-content">
					Countdown
				</h1>
			</div>

			<!-- Setup Settings Card -->
			<div class="w-full bg-base-100 text-base-content border border-blue-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col gap-6">

				<!-- Options: Duration (30s vs 60s) & Tile Limit Mode (9 vs Unlimited) -->
				<div class="flex flex-col gap-4 border-b border-base-300 pb-4">
					<!-- Duration Selector -->
					<div class="flex items-center justify-between">
						<span class="text-sm font-bold text-base-content flex items-center gap-2">
							<ClockIcon size="18" class="text-primary" /> เวลาต่อรอบ:
						</span>
						<div class="flex rounded-2xl bg-base-100 text-base-content p-1 border border-base-300">
							<button
								on:click={() => (gameDuration = 30)}
								class="px-4 py-2 rounded-xl text-xs font-black transition-all {gameDuration === 30 ? 'bg-blue-500 text-base-content shadow-md' : 'text-base-content/70 hover:text-base-content'}"
							>
								30 วินาที
							</button>
							<button
								on:click={() => (gameDuration = 60)}
								class="px-4 py-2 rounded-xl text-xs font-black transition-all {gameDuration === 60 ? 'bg-blue-500 text-base-content shadow-md' : 'text-base-content/70 hover:text-base-content'}"
							>
								60 วินาที
							</button>
						</div>
					</div>

					<!-- Number of Tiles Option (9 vs Unlimited) -->
					<div class="flex items-center justify-between">
						<span class="text-sm font-bold text-base-content flex items-center gap-2">
							<LayersIcon size="18" class="text-primary" /> จำนวนช่องตัวอักษร:
						</span>
						<div class="flex rounded-2xl bg-base-100 text-base-content p-1 border border-base-300">
							<button
								on:click={() => (tileLimitMode = '9')}
								class="px-4 py-2 rounded-xl text-xs font-black transition-all {tileLimitMode === '9' ? 'bg-blue-500 text-base-content shadow-md' : 'text-base-content/70 hover:text-base-content'}"
							>
								9 ช่อง
							</button>
							<button
								on:click={() => (tileLimitMode = 'unlimited')}
								class="px-4 py-2 rounded-xl text-xs font-black transition-all {tileLimitMode === 'unlimited' ? 'bg-blue-500 text-base-content shadow-md' : 'text-base-content/70 hover:text-base-content'}"
							>
								ไม่จำกัด
							</button>
						</div>
					</div>
				</div>

				<!-- Team List Setup Section -->
				<h2 class="text-lg font-bold text-base-content flex items-center justify-center gap-2">
					<AwardIcon class="text-primary" /> เพิ่มทีมผู้แข่งขัน
				</h2>

				<div class="flex gap-2">
					<input
						type="text"
						bind:value={setupTeamName}
						placeholder="ชื่อทีม (เว้นว่างเพื่อสร้าง ทีม 1, ทีม 2...)"
						on:keydown={(e) => e.key === 'Enter' && addSetupTeam()}
						class="flex-1 px-4 py-3 rounded-2xl bg-base-100 text-base-content border border-base-300 text-base-content font-bold focus:outline-none focus:border-blue-400 text-sm"
					/>
					<button
						on:click={addSetupTeam}
						class="px-5 py-3 rounded-2xl font-black bg-blue-500 hover:bg-blue-400 text-base-content transition-all text-sm"
					>
						+ เพิ่มทีม
					</button>
				</div>

				<!-- Teams List -->
				<div class="flex flex-col gap-2 max-h-60 overflow-y-auto">
					{#each teams as t, idx}
						<div class="flex items-center justify-between px-4 py-3 rounded-2xl bg-base-100 text-base-content border border-base-300 text-sm font-bold text-base-content">
							<span class="flex items-center gap-2">
								<span class="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 text-primary text-xs flex items-center justify-center font-mono">{idx + 1}</span>
								{t.name}
							</span>
							<button on:click={() => removeSetupTeam(t.id)} class="text-base-content/70 hover:text-error-content transition-colors p-1">
								<Trash2Icon size="16" />
							</button>
						</div>
					{/each}
				</div>
			</div>

			<!-- Start Game CTA Button -->
			<button
				on:click={startGameShow}
				disabled={teams.length === 0}
				class="w-full max-w-md py-4 rounded-3xl font-black text-xl bg-blue-500 hover:bg-blue-400 text-base-content transition-all shadow-xl shadow-blue-500/30 disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98]"
			>
				เริ่มเกม 🚀 (Full Screen)
			</button>
		</div>

	<!-- ACTIVE GAME SHOW FULLSCREEN OVERLAY -->
	{:else}
		<div class="fixed inset-0 z-[10000] bg-base-100 text-base-content text-base-content/70 flex flex-col justify-between overflow-y-auto p-4 sm:p-8 w-screen h-screen">
			<div class="max-w-6xl mx-auto w-full flex flex-col gap-6 flex-1 justify-between pb-24">

				<!-- Top Controls Bar -->
				<div class="flex items-center justify-between gap-4">
					<!-- Flow Steps -->
					<div class="flex items-center gap-1 sm:gap-2 text-xs font-bold py-2 px-3 sm:px-4 rounded-2xl bg-base-100 text-base-content border border-blue-500/30 shadow-xl overflow-x-auto">
						<div class="px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap {phase === 'pool' ? 'bg-blue-500 text-base-content font-black shadow-lg shadow-blue-500/30' : 'text-base-content/70'}">
							1. สุ่มตัวอักษร ({pool.length}/{maxPoolSize === 99 ? '∞' : maxPoolSize})
						</div>

						<ChevronRightIcon size="16" class="text-blue-500/50 shrink-0" />

						<div class="px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap {phase === 'timer' ? 'bg-blue-500 text-base-content font-black shadow-lg shadow-blue-500/30' : 'text-base-content/70'}">
							2. จับเวลา ({gameDuration}s)
						</div>

						<ChevronRightIcon size="16" class="text-blue-500/50 shrink-0" />

						<div class="px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap {phase === 'validation' ? 'bg-blue-500 text-base-content font-black shadow-lg shadow-blue-500/30' : 'text-base-content/70'}">
							3. ตรวจคำตอบ
						</div>

						<ChevronRightIcon size="16" class="text-blue-500/50 shrink-0" />

						<div class="px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap {phase === 'results' || phase === 'podium' ? 'bg-blue-500 text-base-content font-black shadow-lg shadow-blue-500/30' : 'text-base-content/70'}">
							4. เฉลย & สรุป
						</div>
					</div>

					<!-- Top Control Button Group: Row Layout Toggle (1 / 2) + Fullscreen Toggle -->
					<div class="flex items-center gap-2 shrink-0">
						<div class="flex rounded-xl bg-base-100 text-base-content border border-base-300 p-1">
							<button
								on:click={() => (isTwoRows = false)}
								class="px-3 py-1.5 rounded-lg text-xs font-black transition-all {!isTwoRows ? 'bg-blue-500 text-base-content shadow-md' : 'text-base-content/70 hover:text-base-content'}"
							>
								1 แถว
							</button>
							<button
								on:click={() => (isTwoRows = true)}
								class="px-3 py-1.5 rounded-lg text-xs font-black transition-all {isTwoRows ? 'bg-blue-500 text-base-content shadow-md' : 'text-base-content/70 hover:text-base-content'}"
							>
								2 แถว
							</button>
						</div>

						<button
							on:click={toggleFullscreenMode}
							class="p-2.5 rounded-xl bg-base-100 text-base-content border border-base-300 text-base-content/70 hover:text-base-content transition-colors"
							title="Toggle Native Fullscreen"
						>
							{#if isFullscreen}
								<Minimize2Icon size="18" />
							{:else}
								<Maximize2Icon size="18" />
							{/if}
						</button>
					</div>
				</div>

				<!-- Main Stage Blue Theme Card -->
				<div class="bg-base-100 text-base-content backdrop-blur-2xl border border-blue-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col gap-8 relative overflow-hidden flex-1 justify-center">
					<div class="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

					<!-- FIXED POSITION TILE POOL (Kept at top of card across all steps, except Podium) -->
					{#if phase !== 'podium'}
						<div class="w-full flex flex-col items-center gap-4">
							<div class="w-full relative min-h-[140px] flex items-center justify-center">
								{#if isTimerPaused}
									<div
										in:fade={{ duration: 200 }}
										class="absolute inset-0 bg-base-100 text-base-content backdrop-blur-md rounded-3xl z-20 flex flex-col items-center justify-center gap-2 border border-blue-500/40 text-primary"
									>
										<EyeOffIcon size="36" />
										<span class="text-base font-black uppercase tracking-widest">ซ่อนกระดาน (PAUSED)</span>
									</div>
								{/if}

								<!-- TILE POOL RENDER (1 Row or 2 Rows Layout) -->
								{#if !isTwoRows}
									<div class="w-full flex flex-wrap justify-center items-center gap-2 sm:gap-3 py-2">
										{#each Array(totalDisplayTiles) as _, idx}
											{#if idx === spinningTileIndex}
												<div class="flex-1 max-w-[72px] sm:max-w-[84px] h-16 sm:h-20 rounded-2xl bg-blue-600 border-2 border-amber-400 text-base-content font-black text-3xl sm:text-4xl flex items-center justify-center shadow-xl animate-bounce">
													{tempSpinChar}
												</div>
											{:else if pool[idx]}
												<button
													on:click={() => phase === 'pool' && removeTile(idx)}
													disabled={phase !== 'pool'}
													class="flex-1 max-w-[72px] sm:max-w-[84px] h-16 sm:h-20 rounded-2xl bg-base-100 text-base-content border-2 border-blue-400 text-primary font-black text-3xl sm:text-4xl flex items-center justify-center shadow-xl transition-all transform hover:scale-105 active:scale-95 group relative"
												>
													<span>{pool[idx]}</span>
													{#if phase === 'pool'}
														<span class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-base-content text-[10px] items-center justify-center hidden group-hover:flex">×</span>
													{/if}
												</button>
											{:else}
												<div class="flex-1 max-w-[72px] sm:max-w-[84px] h-16 sm:h-20 rounded-2xl bg-base-100 text-base-content border border-base-300 text-base-content/70 font-mono text-sm flex items-center justify-center shadow-inner">
													{idx + 1}
												</div>
											{/if}
										{/each}
									</div>
								{:else}
									<!-- Two Rows Split Layout: Dividies total tiles by 2, flexing evenly so it never spills to 3 rows -->
									<div class="w-full flex flex-col items-center gap-3 py-2">
										<!-- Row 1: Ceil(Total/2) Tiles -->
										<div class="flex justify-center gap-2 sm:gap-3 w-full max-w-4xl">
											{#each Array(row1Count) as _, idx}
												{#if idx === spinningTileIndex}
													<div class="flex-1 min-w-0 max-w-[120px] h-16 sm:h-20 rounded-2xl bg-blue-600 border-2 border-amber-400 text-base-content font-black text-3xl sm:text-5xl flex items-center justify-center shadow-2xl animate-bounce">
														{tempSpinChar}
													</div>
												{:else if pool[idx]}
													<button
														on:click={() => phase === 'pool' && removeTile(idx)}
														disabled={phase !== 'pool'}
														class="flex-1 min-w-0 max-w-[120px] h-16 sm:h-20 rounded-2xl bg-base-100 text-base-content border-2 border-blue-400 text-primary font-black text-3xl sm:text-5xl flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 active:scale-95 group relative"
													>
														<span>{pool[idx]}</span>
														{#if phase === 'pool'}
															<span class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-base-content text-[10px] items-center justify-center hidden group-hover:flex">×</span>
														{/if}
													</button>
												{:else}
													<div class="flex-1 min-w-0 max-w-[120px] h-16 sm:h-20 rounded-2xl bg-base-100 text-base-content border border-base-300 text-base-content/70 font-mono text-sm flex items-center justify-center shadow-inner">
														{idx + 1}
													</div>
												{/if}
											{/each}
										</div>

										<!-- Row 2: Floor(Total/2) Tiles -->
										<div class="flex justify-center gap-2 sm:gap-3 w-full max-w-4xl">
											{#each Array(row2Count) as _, i}
												{@const idx = i + row1Count}
												{#if idx === spinningTileIndex}
													<div class="flex-1 min-w-0 max-w-[120px] h-16 sm:h-20 rounded-2xl bg-blue-600 border-2 border-amber-400 text-base-content font-black text-3xl sm:text-5xl flex items-center justify-center shadow-2xl animate-bounce">
														{tempSpinChar}
													</div>
												{:else if pool[idx]}
													<button
														on:click={() => phase === 'pool' && removeTile(idx)}
														disabled={phase !== 'pool'}
														class="flex-1 min-w-0 max-w-[120px] h-16 sm:h-20 rounded-2xl bg-base-100 text-base-content border-2 border-blue-400 text-primary font-black text-3xl sm:text-5xl flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 active:scale-95 group relative"
													>
														<span>{pool[idx]}</span>
														{#if phase === 'pool'}
															<span class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-base-content text-[10px] items-center justify-center hidden group-hover:flex">×</span>
														{/if}
													</button>
												{:else}
													<div class="flex-1 min-w-0 max-w-[120px] h-16 sm:h-20 rounded-2xl bg-base-100 text-base-content border border-base-300 text-base-content/70 font-mono text-sm flex items-center justify-center shadow-inner">
														{idx + 1}
													</div>
												{/if}
											{/each}
										</div>
									</div>
								{/if}
							</div>

							<!-- STEP 1 ACTIONS: Pool Draw Buttons + ALWAYS VISIBLE Start Game Button -->
							{#if phase === 'pool'}
								<div class="w-full flex flex-wrap justify-center items-center gap-3 pt-2">
									<button
										on:click={addConsonant}
										disabled={pool.length >= maxPoolSize || isSpinningSlot}
										class="px-6 py-3.5 rounded-2xl font-black bg-blue-600 hover:bg-blue-500 text-base-content transition-all shadow-lg shadow-blue-600/30 text-base disabled:opacity-50"
									>
										+ พยัญชนะ
									</button>

									<button
										on:click={addVowel}
										disabled={pool.length >= maxPoolSize || isSpinningSlot}
										class="px-6 py-3.5 rounded-2xl font-black bg-sky-500 hover:bg-sky-400 text-base-content/70 transition-all shadow-lg shadow-sky-500/30 text-base disabled:opacity-50"
										style="color: var(--color-base-content);"
									>
										+ สระ
									</button>

									<button
										on:click={randomizeAll}
										disabled={isSpinningSlot}
										class="px-6 py-3.5 rounded-2xl font-black bg-indigo-600 hover:bg-indigo-500 text-base-content transition-all shadow-lg shadow-indigo-600/30 text-base disabled:opacity-50"
									>
										🎲 สุ่มทั้งหมด
									</button>

									<button
										on:click={resetPool}
										disabled={pool.length === 0 || isSpinningSlot}
										class="px-5 py-3.5 rounded-2xl font-bold bg-base-100 text-base-content border border-base-300 text-base-content/70 hover:text-error-content hover:border-rose-500/40 transition-colors text-sm disabled:opacity-50"
									>
										รีเซ็ต
									</button>

									<button
										on:click={computeSolutionsAndStartTimer}
										disabled={pool.length === 0 || isSpinningSlot}
										class="px-8 py-3.5 rounded-2xl font-black bg-emerald-400 hover:bg-emerald-300 text-base-content/70 transition-all shadow-xl shadow-emerald-400/30 text-base disabled:opacity-40 disabled:cursor-not-allowed"
										style="color: var(--color-base-content);"
									>
										เริ่มเกม ({gameDuration}s) →
									</button>
								</div>
							{/if}
						</div>
					{/if}

					<!-- STEP 2: TIMER PHASE (Authentic Countdown Circular Clock Graphic) -->
					{#if phase === 'timer'}
						<div class="flex flex-col items-center gap-6 py-2 border-t border-base-300">
							<!-- REAL COUNTDOWN CIRCULAR CLOCK GRAPHIC WITH SWEEPING SECTOR & ROTATING NEEDLE -->
							<div class="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
								<svg class="w-full h-full drop-shadow-2xl" viewBox="0 0 240 240">
									<defs>
										<!-- Sector Highlight Gradient -->
										<linearGradient id="clockSectorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
											<stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.8" />
											<stop offset="100%" stop-color="var(--color-accent)" stop-opacity="0.4" />
										</linearGradient>
									</defs>

									<!-- Clock Face Background Circle -->
									<circle cx="120" cy="120" r="100" fill="var(--color-base-100)" stroke="var(--color-base-300)" stroke-width="8" />

									<!-- Elapsed Time Sector Wedge (Highlighting passed time clockwise from 12 o'clock) -->
									{#if clockAngle > 0}
										<path
											d={describeArc(120, 120, 96, 0, clockAngle)}
											fill="url(#clockSectorGradient)"
										/>
									{/if}

									<!-- Circular Tick Marks (30 or 60 segments) -->
									{#each Array(gameDuration) as _, idx}
										{@const tickAngle = (idx / gameDuration) * 360}
										{@const isMajor = idx % 5 === 0}
										{@const p1 = polarToCartesian(120, 120, 96, tickAngle)}
										{@const p2 = polarToCartesian(120, 120, isMajor ? 82 : 90, tickAngle)}
										<line
											x1={p1.x}
											y1={p1.y}
											x2={p2.x}
											y2={p2.y}
											stroke={isMajor ? 'var(--color-primary)' : 'var(--color-base-content)'}
											stroke-width={isMajor ? '3' : '1.5'}
										/>
									{/each}

									<!-- Rotating Sweeping Needle (Starts at top 12 o'clock, moves 6 deg/sec) -->
									<line
										x1="120"
										y1="120"
										x2={needleTip.x}
										y2={needleTip.y}
										stroke="var(--color-secondary)"
										stroke-width="5"
										stroke-linecap="round"
									/>
									<circle cx="120" cy="120" r="8" fill="var(--color-secondary)" />
								</svg>

								<!-- Digital Time Remaining in Center -->
								<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
									<span class="text-4xl sm:text-5xl font-black font-mono text-base-content drop-shadow-md">
										{String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
									</span>
								</div>
							</div>

							<!-- Controls -->
							<div class="flex gap-4 pt-1">
								{#if isTimerRunning}
									<button
										on:click={pauseTimer}
										class="px-6 py-3 rounded-2xl font-bold bg-amber-500/20 text-warning-content border border-amber-500/40 hover:bg-amber-500/30 text-base flex items-center gap-2"
									>
										<PauseIcon size="18" /> หยุดชั่วคราว
									</button>
								{:else}
									<button
										on:click={startTimer}
										class="px-6 py-3 rounded-2xl font-bold bg-emerald-500/20 text-primary border border-primary/30 hover:bg-emerald-500/30 text-base flex items-center gap-2"
									>
										<PlayIcon size="18" /> เล่นต่อ
									</button>
								{/if}

								<button
									on:click={resetTimer}
									class="px-5 py-3 rounded-2xl font-bold bg-base-100 text-base-content border border-base-300 text-base-content/70 hover:text-base-content text-base flex items-center gap-2"
								>
									<RotateCcwIcon size="18" /> ตั้งใหม่
								</button>

								<button
									on:click={finishTimerPhase}
									class="px-6 py-3 rounded-2xl font-black bg-blue-500 hover:bg-blue-400 text-base-content text-base shadow-lg shadow-blue-500/20"
								>
									ข้ามไปตรวจคำตอบ →
								</button>
							</div>
						</div>
					{/if}

					<!-- STEP 3: TEAM VALIDATION PHASE -->
					{#if phase === 'validation'}
						<div class="flex flex-col items-center gap-6 py-2 border-t border-base-300">
							{#if currentTeamIndex < randomizedTeams.length}
								{@const activeTeam = randomizedTeams[currentTeamIndex]}
								<div class="w-full max-w-xl bg-base-100 text-base-content border border-blue-500/40 rounded-3xl p-6 sm:p-8 flex flex-col gap-5 text-center shadow-2xl relative">
									<h3 class="text-3xl font-black text-base-content">{activeTeam.name}</h3>

									<div class="flex flex-col gap-2">
										<input
											type="text"
											bind:value={currentTeamInput}
											on:keydown={handleAnswerKeyPress}
											disabled={showAnswerAnimation}
											placeholder=""
											class="w-full px-5 py-4 rounded-2xl bg-base-100 text-base-content border border-base-300 text-base-content text-2xl font-black focus:outline-none focus:border-blue-400 focus:bg-base-100 text-base-content text-center shadow-inner"
										/>
									</div>

									<button
										on:click={submitTeamAnswer}
										disabled={showAnswerAnimation}
										class="w-full py-3.5 rounded-2xl font-black bg-blue-500 hover:bg-blue-400 text-base-content transition-all text-lg shadow-lg shadow-blue-500/30 disabled:opacity-50"
									>
										ส่งคำตอบ
									</button>

									<!-- ANIMATED ANSWER FEEDBACK POPUP -->
									{#if showAnswerAnimation && currentSubmissionResult}
										<div
											in:scale={{ duration: 300 }}
											out:fade={{ duration: 200 }}
											class="absolute inset-0 bg-base-100 text-base-content backdrop-blur-md rounded-3xl z-30 flex flex-col items-center justify-center p-6 gap-3 border-2
											{currentSubmissionResult.isCorrect ? 'border-primary/30 text-primary' : 'border-rose-500 text-error-content'}"
										>
											{#if currentSubmissionResult.isCorrect}
												<CheckCircleIcon size="48" class="text-primary" />
												<span class="text-3xl font-black text-base-content">ถูกต้อง!</span>
												<span class="text-2xl font-black text-primary font-mono">+{currentSubmissionResult.score} คะแนน</span>
											{:else}
												<XCircleIcon size="48" class="text-error-content" />
												<span class="text-3xl font-black text-base-content">ไม่ถูกต้อง</span>
												<span class="text-sm font-semibold text-error-content">({currentSubmissionResult.reason})</span>
												<span class="text-xl font-black text-rose-500 font-mono">0 คะแนน</span>
											{/if}
										</div>
									{/if}
								</div>
							{/if}

							<!-- SUBMITTED TEAMS LOG -->
							<div class="w-full flex flex-row flex-wrap justify-center items-center gap-3 pt-2">
								{#each randomizedTeams as t}
									<div class="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-base-100 text-base-content border border-base-300 text-sm font-bold shadow-md">
										<span class="text-base-content">{t.name}:</span>
										{#if t.submittedWord !== undefined}
											<span class="text-primary font-mono">"{t.submittedWord || 'ไม่ได้ตอบ'}"</span>
											{#if t.isCorrect}
												<span class="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-primary border border-primary/30 text-xs font-bold font-mono">
													+{t.wordScore} pt ✔️
												</span>
											{:else}
												<span class="px-2 py-0.5 rounded-lg bg-rose-500/20 text-error-content border border-rose-500/30 text-xs font-bold font-mono">
													0 pt ❌
												</span>
											{/if}
										{:else}
											<span class="text-base-content/70 text-xs font-mono">รอตอบ...</span>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- STEP 4: RESULTS & ACCEPTABLE ANSWERS PHASE -->
					{#if phase === 'results'}
						<div class="flex flex-col items-center gap-6 py-2 border-t border-base-300">
							<div class="flex flex-wrap gap-4">
								<button
									on:click={startNewRound}
									class="px-8 py-3.5 rounded-2xl font-black bg-blue-500 hover:bg-blue-400 text-base-content transition-all shadow-xl shadow-blue-500/30 text-lg"
								>
									เริ่มรอบใหม่ 🔄
								</button>

								<button
									on:click={triggerGameEndPodium}
									class="px-8 py-3.5 rounded-2xl font-black bg-base-100 text-base-content border border-rose-500/40 text-error-content hover:bg-rose-500/20 transition-all text-lg flex items-center gap-2"
								>
									<LogOutIcon size="20" /> จบเกม 🏁
								</button>
							</div>

							<div class="w-full max-w-4xl bg-base-100 text-base-content border border-blue-500/30 rounded-3xl p-6 flex flex-col gap-4 shadow-xl">
								<div class="flex items-center justify-between border-b border-base-300 pb-2">
									<h4 class="font-bold text-base-content text-base">
										เฉลยคำศัพท์ทั้งหมดที่สะกดได้ แยกตามคะแนน
									</h4>
									<span class="text-xs text-base-content/70 font-mono">เรียงจากคะแนนมากไปน้อย (ข้ามคำ 1 อักษร)</span>
								</div>

								<div class="flex flex-col gap-5 max-h-52 overflow-y-auto pr-2">
									{#each sortedScoreKeys as scoreKey}
										<div class="flex flex-col gap-2">
											<div class="flex items-center gap-2">
												<span class="px-3 py-1 rounded-xl bg-blue-500/20 border border-blue-500/40 text-primary font-black text-xs">
													คำ {scoreKey} ตัวอักษร ({scoreKey} คะแนน)
												</span>
												<span class="text-xs text-base-content/70">({groupedAcceptableAnswers[scoreKey].length} คำ)</span>
											</div>

											<div class="flex flex-wrap gap-2">
												{#each groupedAcceptableAnswers[scoreKey] as word}
													<div class="px-4 py-2 rounded-xl bg-base-100 text-base-content border border-base-300 shadow-sm">
														<span class="text-lg sm:text-2xl font-black text-base-content">{word}</span>
													</div>
												{/each}
											</div>
										</div>
									{:else}
										<div class="text-center py-6 text-base-content/70 text-xs font-mono">
											ไม่พบคำศัพท์ในพจนานุกรมจากตัวอักษรชุดนี้
										</div>
									{/each}
								</div>
							</div>
						</div>
					{/if}

					<!-- STEP 5: WINNER PODIUM SCREEN (On Game End) -->
					{#if phase === 'podium'}
						<div
							in:scale={{ duration: 400 }}
							class="flex flex-col items-center gap-8 py-6 text-center border-t border-base-300"
						>
							<div>
								<div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-warning-content font-black text-sm mb-2">
									<span>🏆 WINNER PODIUM 🏆</span>
								</div>
								<h2 class="text-4xl sm:text-5xl font-black text-base-content">สรุปอันดับเกมโชว์ Countdown</h2>
							</div>

							<!-- WINNERS PODIUM STANDS (1st Gold 🥇, 2nd Silver 🥈, 3rd Bronze 🥉) -->
							<div class="flex items-end justify-center gap-3 sm:gap-6 w-full max-w-2xl py-4 min-h-[220px]">
								<!-- 2nd Place Stand -->
								{#if sortedTeams[1]}
									<div class="flex-1 flex flex-col items-center">
										<div class="text-sm font-bold text-base-content/70 mb-1">{sortedTeams[1].name}</div>
										<div class="text-xl font-black text-primary font-mono mb-2">{sortedTeams[1].score} pt</div>
										<div class="w-full h-32 rounded-t-2xl bg-gradient-to-t from-base-200 to-base-200 border-t-4 border-base-300 flex items-center justify-center font-black text-2xl text-base-content/70 shadow-xl">
											🥈 2nd
										</div>
									</div>
								{/if}

								<!-- 1st Place Gold Stand (Center Taller) -->
								{#if sortedTeams[0]}
									<div class="flex-1 flex flex-col items-center">
										<div class="text-base font-black text-warning-content mb-1 animate-pulse">{sortedTeams[0].name}</div>
										<div class="text-2xl font-black text-warning-content font-mono mb-2">{sortedTeams[0].score} pt</div>
										<div class="w-full h-44 rounded-t-2xl bg-gradient-to-t from-amber-950 to-amber-600/40 border-t-4 border-amber-400 flex items-center justify-center font-black text-3xl text-warning-content shadow-2xl shadow-amber-500/20">
											🥇 1st
										</div>
									</div>
								{/if}

								<!-- 3rd Place Bronze Stand -->
								{#if sortedTeams[2]}
									<div class="flex-1 flex flex-col items-center">
										<div class="text-sm font-bold text-base-content/70 mb-1">{sortedTeams[2].name}</div>
										<div class="text-xl font-black text-primary font-mono mb-2">{sortedTeams[2].score} pt</div>
										<div class="w-full h-24 rounded-t-2xl bg-gradient-to-t from-base-200 to-amber-900/40 border-t-4 border-amber-700 flex items-center justify-center font-black text-xl text-amber-600 shadow-xl">
											🥉 3rd
										</div>
									</div>
								{/if}
							</div>

							<!-- Other Teams Ranking List -->
							{#if sortedTeams.length > 3}
								<div class="w-full max-w-md flex flex-col gap-2">
									{#each sortedTeams.slice(3) as t, idx}
										<div class="flex items-center justify-between px-4 py-2.5 rounded-xl bg-base-100 text-base-content border border-base-300 text-sm font-bold text-base-content">
											<span>อันดับ {idx + 4}: {t.name}</span>
											<span class="text-primary font-mono font-black">{t.score} แต้ม</span>
										</div>
									{/each}
								</div>
							{/if}

							<!-- Podium Action Buttons -->
							<div class="flex flex-wrap gap-4 pt-2">
								<button
									on:click={startNewRound}
									class="px-8 py-3.5 rounded-2xl font-black bg-blue-500 hover:bg-blue-400 text-base-content transition-all shadow-xl shadow-blue-500/30 text-lg"
								>
									เล่นต่อรอบใหม่ 🔄
								</button>

								<button
									on:click={exitGameShow}
									class="px-8 py-3.5 rounded-2xl font-black bg-base-100 text-base-content border border-rose-500/40 text-error-content hover:bg-rose-500/20 transition-all text-lg flex items-center gap-2"
								>
									<LogOutIcon size="20" /> ออกจากเกม 🚪
								</button>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- BIG TEAM SCORES DISPLAY AT THE BOTTOM WITH ROUND NUMBER BADGE -->
			<div class="fixed bottom-0 left-0 right-0 z-[10001] bg-base-100 text-base-content backdrop-blur-2xl border-t border-blue-500/30 p-3 sm:p-4 shadow-2xl">
				<div class="container mx-auto max-w-5xl flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
					<!-- Round Number Badge -->
					<div class="px-4 py-2.5 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-primary font-black text-sm sm:text-base shrink-0 shadow-md">
						รอบที่ {roundNumber}
					</div>

					{#each teams as t}
						<div class="flex items-center gap-3 px-6 py-2.5 sm:py-3 rounded-2xl bg-primary border border-blue-500/40 text-base-content shadow-lg">
							<span class="text-base sm:text-lg font-bold">{t.name}:</span>
							<span class="text-2xl sm:text-4xl font-black font-mono text-primary">{t.score}</span>
							<span class="text-xs text-base-content/70 font-mono">แต้ม</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
