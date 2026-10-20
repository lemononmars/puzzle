<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import UsersIcon from '@lucide/svelte/icons/users';
import PlayIcon from '@lucide/svelte/icons/play';
import PlusCircleIcon from '@lucide/svelte/icons/plus-circle';
import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
import AwardIcon from '@lucide/svelte/icons/award';
import ZapIcon from '@lucide/svelte/icons/zap';
import CopyIcon from '@lucide/svelte/icons/copy';
import CheckIcon from '@lucide/svelte/icons/check';
import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
import ClockIcon from '@lucide/svelte/icons/clock';
import AlertCircleIcon from '@lucide/svelte/icons/circle-alert';
import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
import ShuffleIcon from '@lucide/svelte/icons/refresh-cw';
import RotateCcwIcon from '@lucide/svelte/icons/rotate-ccw';
import EyeIcon from '@lucide/svelte/icons/eye';
import RadioIcon from '@lucide/svelte/icons/radio';

	import type {
		BattleGameConfig,
		BattlePlayer,
		BattlePuzzleType,
		BattleRoomMeta,
		PlayerLocalSession,
		SupabaseRoomRow
	} from '#lib/battle/types.js';
	import {
		fetchPublicRooms,
		subscribeToLobbyRealtime,
		subscribeToRoomRealtime,
		createBattleRoom,
		joinBattleRoom,
		reconnectBattleRoom,
		spectateBattleRoom,
		leaveBattleRoom,
		togglePlayerReady,
		startBattleMatch,
		submitPlayerProgress,
		submitSharedWord,
		submitQuizClaim,
		finishOrNextRound,
		endBattleMatchEarly,
		resetRoomToLobby,
		parseRoomMeta
	} from '#lib/battle/roomService.js';
	import { search, isUpper, isLower } from '#lib/utils/thaiwords.js';
	import { splitSlots, diffSlots } from '#lib/wordladder/wordladder.js';
	import { canBuildWordFromLetters, getBogglePathWord, isBattleRoundOpen } from '#lib/battle/rules.js';
	import KeyboardLayout from '#lib/components/KeyboardLayout.svelte';

	// Available Avatars
	const AVATARS = ['🧙‍♂️', '🦊', '🐉', '🐱', '🤖', '🐯', '🦅', '🚀', '👑', '⚡'];

	// Available Puzzle Types Info
	const PUZZLE_TYPES: Array<{
		id: BattlePuzzleType;
		name: string;
		desc: string;
		icon: string;
		badgeColor: string;
	}> = [
		{
			id: 'spellingbee',
			name: 'Spelling Bee',
			desc: 'ผสมคำรวงผึ้ง 7 ตัวอักษร',
			icon: '🐝',
			badgeColor: 'badge-warning'
		},
		{
			id: 'blanks',
			name: 'Blanks',
			desc: 'เติมอักษรที่ขาดหายในคำ',
			icon: '🕳️',
			badgeColor: 'badge-accent'
		},
		{
			id: 'crossroad',
			name: 'Crossroad',
			desc: 'เติมคำตัดกัน 4 ทิศทาง',
			icon: '🔠',
			badgeColor: 'badge-primary'
		},
		{
			id: 'spellingquiz',
			name: 'Spelling Quiz',
			desc: 'ควิซสะกดคำจากพจนานุกรม',
			icon: '📝',
			badgeColor: 'badge-info'
		},
		{
			id: 'boggle',
			name: 'Boggle',
			desc: 'ลากเส้นผสมคำในตาราง 4x4',
			icon: '🧭',
			badgeColor: 'badge-secondary'
		},
		{
			id: 'wordladder',
			name: 'Word Ladder',
			desc: 'แปลงคำทีละขั้นสู่เป้าหมาย',
			icon: '🪜',
			badgeColor: 'badge-success'
		},
		{
			id: 'thaiquiz',
			name: 'Quiz',
			desc: 'ควิซความรู้รอบตัวไทย 4 ตัวเลือก',
			icon: '🇹🇭',
			badgeColor: 'badge-warning'
		}
	];

	// Local Player State
	let localPlayer: PlayerLocalSession = {
		id: '',
		name: 'ผู้ประลอง',
		avatar: '🧙‍♂️'
	};

	// Navigation & Room State
	let currentView: 'lobby' | 'waiting' | 'battle' | 'podium' = 'lobby';
	let rooms: SupabaseRoomRow[] = [];
	let currentRoom: SupabaseRoomRow | null = null;
	let roomMeta: BattleRoomMeta | null = null;

	let isLoadingRooms = false;
	let isJoiningRoom = false;
	let isCreatingRoom = false;
	let errorMessage = '';
	let copiedCode = false;

	// Join inputs
	let quickJoinCode = '';

	// Create Room Form State
	let showCreateModal = false;
	let createForm: BattleGameConfig = {
		roomName: 'ห้องประลองสุดเดือด',
		puzzleType: 'spellingbee',
		mode: 'race',
		theme: 'general',
		difficulty: 'normal',
		rounds: 3,
		timePerRound: 60,
		isPublic: true,
		maxPlayers: 4
	};
	const ROOM_PRESETS: Array<{ name: string; description: string; config: Partial<BattleGameConfig> }> = [
		{ name: '⚡ Quick Match', description: '3 รอบ • 30 วิ • 4 คน', config: { rounds: 3, timePerRound: 30, maxPlayers: 4, difficulty: 'easy', isPublic: true } },
		{ name: '🏆 Ranked Night', description: '5 รอบ • 60 วิ • 8 คน', config: { rounds: 5, timePerRound: 60, maxPlayers: 8, difficulty: 'hard', isPublic: true } },
		{ name: '👨‍👩‍👧 Private Party', description: '3 รอบ • 90 วิ • ห้องส่วนตัว', config: { rounds: 3, timePerRound: 90, maxPlayers: 8, difficulty: 'normal', isPublic: false } }
	];

	function applyRoomPreset(config: Partial<BattleGameConfig>) {
		createForm = { ...createForm, ...config };
	}

	// Live Game & Timers
	let countdownNumber: number | null = null;
	let matchTimeRemaining = 0;
	let matchTimerInterval: any = null;
	let countdownInterval: any = null;
	let activeRoundStartTime: number | null = null;
	let advancingRoundStartTime: number | null = null;
	let scoreFeed: Array<{ id: string; text: string; color: string }> = [];

	// Active Round Gameplay State
	let currentRoundIndex = 0;
	let activeRoundData: any = null;
	let playerInput = '';
	let crossroadWiggle = false;
	let blanksQuestionIdx = 0;
	let spellingQuizIdx = 0;
	let thaiQuizIdx = 0;
	let spellingBeeFound: string[] = [];
	let boggleFound: string[] = [];
	let crossroadSolved = false;

	// Crossroad Reroll Clues State
	let currentTopClue = '';
	let currentBottomClue = '';
	let currentLeftClue = '';
	let currentRightClue = '';

	// Boggle State
	let boggleSelectedPath: Array<{ r: number; c: number }> = [];
	let boggleIsDragging = false;

	// Word Ladder State
	let ladderChain: string[] = [];
	let ladderSolved = false;

	// Realtime unsubscribers
	let unsubLobby: (() => void) | null = null;
	let unsubRoom: (() => void) | null = null;

	function handleBeforeUnload(e: BeforeUnloadEvent) {
		if (currentView === 'waiting' || currentView === 'battle') {
			e.preventDefault();
			e.returnValue = '';
			return '';
		}
	}

	onMount(async () => {
		initLocalPlayer();
		if (typeof window !== 'undefined') {
			window.addEventListener('beforeunload', handleBeforeUnload);
		}

		await refreshRooms();
		unsubLobby = subscribeToLobbyRealtime(() => {
			refreshRooms();
		});

		// Check for active session or URL invite code
		if (typeof window !== 'undefined') {
			const urlParams = new URLSearchParams(window.location.search);
			const codeParam = urlParams.get('code') || sessionStorage.getItem('cb_active_room_id');
			if (codeParam) {
				const clean = codeParam.toUpperCase().trim();
				quickJoinCode = clean;
				// Try reconnecting first (preserves player session, score, and state)
				const { room } = await reconnectBattleRoom(clean, localPlayer.id);
				if (room) {
					setupActiveRoom(room);
				} else {
					// Fallback to fresh join if room exists
					handleJoinRoom(clean);
				}
			}
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		}
		if (unsubLobby) unsubLobby();
		if (unsubRoom) unsubRoom();
		clearInterval(matchTimerInterval);
		clearInterval(countdownInterval);
	});

	function initLocalPlayer() {
		if (typeof window === 'undefined') return;
		const savedId = localStorage.getItem('cb_battle_player_id');
		const savedName = localStorage.getItem('codebreaker_player_name') || localStorage.getItem('cb_battle_player_name');
		const savedAvatar = localStorage.getItem('cb_battle_player_avatar');

		localPlayer = {
			id: savedId || 'p_' + Math.random().toString(36).substring(2, 9),
			name: savedName || 'ผู้ประลอง_' + Math.floor(100 + Math.random() * 900),
			avatar: savedAvatar || AVATARS[Math.floor(Math.random() * AVATARS.length)]
		};

		localStorage.setItem('cb_battle_player_id', localPlayer.id);
		localStorage.setItem('cb_battle_player_name', localPlayer.name);
		localStorage.setItem('cb_battle_player_avatar', localPlayer.avatar);
	}

	function savePlayerProfile() {
		if (typeof window === 'undefined') return;
		localStorage.setItem('codebreaker_player_name', localPlayer.name);
		localStorage.setItem('cb_battle_player_name', localPlayer.name);
		localStorage.setItem('cb_battle_player_avatar', localPlayer.avatar);
	}

	async function refreshRooms() {
		isLoadingRooms = true;
		rooms = await fetchPublicRooms();
		isLoadingRooms = false;
	}

	function toPlayerObj(isHost = false): BattlePlayer {
		return {
			id: localPlayer.id,
			name: localPlayer.name,
			avatar: localPlayer.avatar,
			color: 'emerald',
			isHost,
			isReady: isHost,
			isSpectator: false,
			score: 0,
			currentRoundScore: 0,
			solvedCount: 0,
			progress: 0,
			lastSeen: Date.now()
		};
	}

	async function handleCreateRoom() {
		isCreatingRoom = true;
		errorMessage = '';
		savePlayerProfile();

		const hostPlayer = toPlayerObj(true);
		const { room, error } = await createBattleRoom(hostPlayer, createForm);

		isCreatingRoom = false;
		if (error || !room) {
			errorMessage = error || 'ไม่สามารถสร้างห้องได้';
			return;
		}

		showCreateModal = false;
		setupActiveRoom(room);
	}

	async function handleJoinRoom(roomId: string) {
		if (!roomId.trim()) return;
		isJoiningRoom = true;
		errorMessage = '';
		savePlayerProfile();

		const player = toPlayerObj(false);
		const { room, error } = await joinBattleRoom(roomId.trim(), player);

		isJoiningRoom = false;
		if (error || !room) {
			errorMessage = error || 'ไม่สามารถเข้าร่วมห้องได้';
			return;
		}

		setupActiveRoom(room);
	}

	async function handleWatchRoom(roomId: string) {
		if (!roomId.trim()) return;
		isJoiningRoom = true;
		errorMessage = '';
		savePlayerProfile();

		const player = toPlayerObj(false);
		player.isSpectator = true;
		const { room, error } = await spectateBattleRoom(roomId.trim(), player);

		isJoiningRoom = false;
		if (error || !room) {
			errorMessage = error || 'ไม่สามารถเข้าชมห้องนี้ได้';
			return;
		}

		setupActiveRoom(room);
	}

	function setupActiveRoom(room: SupabaseRoomRow) {
		currentRoom = room;
		roomMeta = parseRoomMeta(room.game_title);

		if (typeof window !== 'undefined') {
			sessionStorage.setItem('cb_active_room_id', room.room_id);
			history.replaceState({}, '', '?code=' + room.room_id);
		}

		if (unsubRoom) unsubRoom();
		unsubRoom = subscribeToRoomRealtime(room.room_id, (updatedRoom) => {
			currentRoom = updatedRoom;
			roomMeta = parseRoomMeta(updatedRoom.game_title);
			syncRoomState(updatedRoom);
		});

		syncRoomState(room);
	}

	function syncRoomState(room: SupabaseRoomRow) {
		const meta = parseRoomMeta(room.game_title);
		roomMeta = meta;

		if (room.status === 0) {
			currentView = 'waiting';
			clearInterval(matchTimerInterval);
			clearInterval(countdownInterval);
			countdownNumber = null;
			activeRoundData = null;
			activeRoundStartTime = null;
			advancingRoundStartTime = null;
			resetRoundState();
		} else if (room.status === 1) {
			currentView = 'battle';
			handleBattleSync(meta);
		} else if (room.status === 2) {
			currentView = 'podium';
			clearInterval(matchTimerInterval);
			clearInterval(countdownInterval);
		}
	}

	function resetRoundState() {
		playerInput = '';
		crossroadSolved = false;
		crossroadWiggle = false;
		blanksQuestionIdx = 0;
		spellingQuizIdx = 0;
		thaiQuizIdx = 0;
		spellingBeeFound = [];
		boggleFound = [];
		boggleSelectedPath = [];
		boggleIsDragging = false;
		ladderChain = [];
		ladderSolved = false;
		currentTopClue = '';
		currentBottomClue = '';
		currentLeftClue = '';
		currentRightClue = '';
	}

	function handleBattleSync(meta: BattleRoomMeta | null) {
		if (!meta) return;

		if (meta.currentRound !== currentRoundIndex || meta.roundStartTime !== activeRoundStartTime) {
			resetRoundState();
			advancingRoundStartTime = null;
		}

		currentRoundIndex = meta.currentRound;
		activeRoundStartTime = meta.roundStartTime;
		activeRoundData = meta.rounds[currentRoundIndex] || null;

		// In Quiz mode, sync question index across all players
		if (meta.config?.mode === 'quiz' && typeof meta.currentQuestionIndex === 'number') {
			if (
				blanksQuestionIdx !== meta.currentQuestionIndex ||
				spellingQuizIdx !== meta.currentQuestionIndex ||
				thaiQuizIdx !== meta.currentQuestionIndex
			) {
				blanksQuestionIdx = meta.currentQuestionIndex;
				spellingQuizIdx = meta.currentQuestionIndex;
				thaiQuizIdx = meta.currentQuestionIndex;
				if (meta.lastAction && meta.lastAction.playerId !== localPlayer.id && Date.now() - meta.lastAction.timestamp < 3000) {
					addScoreToast(`${meta.lastAction.playerName}: ${meta.lastAction.detail}`, 'text-warning-content');
				}
			}
		}

		// Initialize Crossroad clues
		if (activeRoundData?.puzzleType === 'crossroad' && !currentTopClue) {
			const p = activeRoundData.payload;
			currentTopClue = p.topClue;
			currentBottomClue = p.bottomClue;
			currentLeftClue = p.leftClue;
			currentRightClue = p.rightClue;
		}

		// Initialize Word Ladder chain
		if (activeRoundData?.puzzleType === 'wordladder' && ladderChain.length === 0) {
			ladderChain = [activeRoundData.payload.start];
		}

		const now = Date.now();
		if (meta.roundStartTime && now < meta.roundStartTime) {
			const diffSec = Math.max(1, Math.ceil((meta.roundStartTime - now) / 1000));
			countdownNumber = diffSec;
			if (!countdownInterval) {
				countdownInterval = setInterval(() => {
					if (!roomMeta?.roundStartTime) return;
					const left = Math.ceil((roomMeta.roundStartTime - Date.now()) / 1000);
					if (left <= 0) {
						countdownNumber = null;
						clearInterval(countdownInterval);
						countdownInterval = null;
						startRoundTimer();
					} else {
						countdownNumber = left;
					}
				}, 500);
			}
		} else {
			countdownNumber = null;
			startRoundTimer();
		}
	}

	function startRoundTimer() {
		clearInterval(matchTimerInterval);
		if (!roomMeta?.roundEndTime) return;

		const updateTimer = () => {
			if (!roomMeta?.roundEndTime) return;
			const remaining = Math.max(0, Math.ceil((roomMeta.roundEndTime - Date.now()) / 1000));
			matchTimeRemaining = remaining;

			if (remaining <= 0) {
				clearInterval(matchTimerInterval);
				matchTimerInterval = null;
				const me = currentRoom?.players.find((p) => p.id === localPlayer.id);
				const roundStartTime = roomMeta?.roundStartTime || null;
				if (me?.isHost && currentRoom && advancingRoundStartTime !== roundStartTime) {
					advancingRoundStartTime = roundStartTime;
					finishOrNextRound(currentRoom.room_id, localPlayer.id).then((room) => {
						if (!room) advancingRoundStartTime = null;
					});
				}
			}
		};

		updateTimer();
		matchTimerInterval = setInterval(updateTimer, 1000);
	}

	async function handleToggleReady() {
		if (!currentRoom) return;
		const me = currentRoom.players.find((p) => p.id === localPlayer.id);
		if (!me) return;
		await togglePlayerReady(currentRoom.room_id, localPlayer.id, !me.isReady);
	}

	async function handleStartMatch() {
		if (!currentRoom) return;
		await startBattleMatch(currentRoom.room_id, localPlayer.id);
	}

	async function handleLeaveRoom() {
		if (typeof window !== 'undefined') {
			sessionStorage.removeItem('cb_active_room_id');
			history.replaceState({}, '', '/puzzles/battle');
		}
		if (currentRoom) {
			await leaveBattleRoom(currentRoom.room_id, localPlayer.id);
		}
		if (unsubRoom) unsubRoom();
		currentRoom = null;
		roomMeta = null;
		currentView = 'lobby';
		refreshRooms();
	}

	async function handleHostEndMatch() {
		if (!currentRoom || !isHostUser) return;
		const ok = confirm('คุณต้องการจบการแข่งขันทันทีและไปที่หน้าสรุปคะแนนหรือไม่?');
		if (ok) {
			await endBattleMatchEarly(currentRoom.room_id, localPlayer.id);
		}
	}

	async function handleRematch() {
		if (!currentRoom || !isHostUser) return;
		await resetRoomToLobby(currentRoom.room_id, localPlayer.id);
	}

	function canAnswerActiveRound(): boolean {
		return !!roomMeta && isBattleRoundOpen(roomMeta.roundStartTime, roomMeta.roundEndTime);
	}

	function actionId(kind: string, detail: string): string {
		return `${roomMeta?.roundStartTime || 0}:${localPlayer.id}:${kind}:${detail}`;
	}

	function copyInviteLink() {
		if (!currentRoom) return;
		if (typeof window !== 'undefined') {
			const link = `${window.location.origin}/puzzles/battle?code=${currentRoom.room_id}`;
			navigator.clipboard.writeText(link);
			copiedCode = true;
			setTimeout(() => (copiedCode = false), 2500);
		}
	}

	function addScoreToast(text: string, color = 'text-primary') {
		const id = Math.random().toString();
		scoreFeed = [{ id, text, color }, ...scoreFeed.slice(0, 3)];
		setTimeout(() => {
			scoreFeed = scoreFeed.filter((s) => s.id !== id);
		}, 2000);
	}

	// 1. Crossroad Handlers
	function rerollCrossroadClues() {
		if (!activeRoundData?.payload) return;
		const pre = activeRoundData.payload.allPre || [];
		const post = activeRoundData.payload.allPost || [];
		if (post.length > 0) currentTopClue = post[Math.floor(Math.random() * post.length)];
		if (pre.length > 0) currentBottomClue = pre[Math.floor(Math.random() * pre.length)];
		if (post.length > 1) currentLeftClue = post[Math.floor(Math.random() * post.length)];
		if (pre.length > 1) currentRightClue = pre[Math.floor(Math.random() * pre.length)];
		addScoreToast('เปลี่ยนคำใบ้แล้ว 🎲', 'text-primary');
	}

	async function handleCrossroadSubmit() {
		if (myPlayer?.isSpectator || !canAnswerActiveRound() || crossroadSolved || !playerInput.trim() || !activeRoundData || !currentRoom) return;
		const target = (activeRoundData.payload.targetWord || '').trim();
		const input = playerInput.trim();

		const isQuiz = roomMeta?.config?.mode === 'quiz';
		const claimKey = `crossroad_r${currentRoundIndex}`;

		if (isQuiz && roomMeta?.quizClaims?.[claimKey]) {
			addScoreToast(`ข้อนี้ถูก ${roomMeta.quizClaims[claimKey].playerName} ชิงตอบไปแล้ว!`, 'text-error-content');
			return;
		}

		if (input === target) {
			if (isQuiz) {
				const result = await submitQuizClaim(
					currentRoom.room_id,
					localPlayer.id,
					claimKey,
					100,
					100,
					`ชิงตอบ Crossroad สำเร็จ: "${target}"`
					,
					actionId('crossroad', input)
				);
				if (!result.success) {
					addScoreToast(result.reason || 'มีผู้เล่นชิงตอบข้อนี้ไปแล้ว', 'text-error-content');
					return;
				}
			}
			crossroadSolved = true;
			playerInput = target;
			addScoreToast('+100 ตอบถูกเป้าหมาย!', 'text-primary');

			if (!isQuiz) {
				await submitPlayerProgress(currentRoom.room_id, localPlayer.id, 100, 100, 1, `แก้ Crossroad สำเร็จ: "${target}"`, actionId('crossroad', input));
			}
		} else {
			crossroadWiggle = true;
			setTimeout(() => (crossroadWiggle = false), 600);
			addScoreToast('-20 ยังไม่ถูกต้อง', 'text-error-content');
			if (!isQuiz) {
				await submitPlayerProgress(currentRoom.room_id, localPlayer.id, -20, 25, 0, undefined, actionId('crossroad-wrong', input));
			}
		}
	}

	// 2. Spelling Bee Submit
	async function handleSpellingBeeSubmit() {
		if (myPlayer?.isSpectator || !canAnswerActiveRound() || !playerInput.trim() || !activeRoundData || !currentRoom) return;
		const word = playerInput.trim();
		playerInput = '';

		const solutions: string[] = activeRoundData.payload.solutions || [];
		const isQuiz = roomMeta?.config?.mode === 'quiz';

		if (isQuiz && roomMeta?.sharedFoundWords?.[word]) {
			addScoreToast(`คำนี้ถูก ${roomMeta.sharedFoundWords[word].playerName} ตอบไปแล้ว!`, 'text-warning-content');
			return;
		}

		if (spellingBeeFound.includes(word)) {
			addScoreToast('พบคำนี้ไปแล้ว!', 'text-warning-content');
			return;
		}

		if (canBuildWordFromLetters(word, activeRoundData.payload.letters || []) && (solutions.includes(word) || search(word))) {
			const points = word.length >= 6 ? 120 : word.length * 20;
			const totalSols = Math.max(1, solutions.length);
			const progress = Math.min(100, Math.round(((spellingBeeFound.length + 1) / totalSols) * 100));

			if (isQuiz) {
				const result = await submitSharedWord(currentRoom.room_id, localPlayer.id, word, points, progress, `ชิงพบคำว่า "${word}"`, actionId('spellingbee', word));
				if (!result.success) {
					addScoreToast(result.reason || 'มีผู้เล่นชิงคำนี้ไปแล้ว', 'text-warning-content');
					return;
				}
			} else {
				await submitPlayerProgress(currentRoom.room_id, localPlayer.id, points, progress, 1, `พบคำว่า "${word}"`, actionId('spellingbee', word));
			}
			spellingBeeFound = [...spellingBeeFound, word];
			addScoreToast(`+${points} พบคำว่า "${word}"`, 'text-warning-content');
		} else {
			addScoreToast('ไม่อยู่ในพจนานุกรม', 'text-error-content');
		}
	}

	function shuffleSpellingBeeLetters() {
		if (!activeRoundData?.payload?.letters) return;
		activeRoundData.payload.letters = [...activeRoundData.payload.letters].sort(() => 0.5 - Math.random());
	}

	// 3. Blanks Letter Choice
	async function handleBlanksType(letter: string) {
		if (myPlayer?.isSpectator || !canAnswerActiveRound() || !activeRoundData || !currentRoom) return;
		const questions = activeRoundData.payload.questions || [];
		const currentQ = questions[blanksQuestionIdx];
		if (!currentQ) return;

		const isQuiz = roomMeta?.config?.mode === 'quiz';
		const claimKey = `blanks_r${currentRoundIndex}_q${blanksQuestionIdx}`;

		if (isQuiz && roomMeta?.quizClaims?.[claimKey]) {
			addScoreToast(`ข้อนี้ถูก ${roomMeta.quizClaims[claimKey].playerName} ชิงตอบไปแล้ว!`, 'text-error-content');
			return;
		}

		if (letter === currentQ.targetChar) {
			const nextIdx = blanksQuestionIdx + 1;
			const progress = Math.min(100, Math.round((nextIdx / questions.length) * 100));

			if (isQuiz) {
				const result = await submitQuizClaim(currentRoom.room_id, localPlayer.id, claimKey, 50, progress, `ชิงตอบถูก ${currentQ.word}`, actionId('blanks', `${blanksQuestionIdx}:${letter}`));
				if (!result.success) {
					addScoreToast(result.reason || 'มีผู้เล่นชิงตอบข้อนี้ไปแล้ว', 'text-error-content');
					return;
				}
			} else {
				await submitPlayerProgress(currentRoom.room_id, localPlayer.id, 50, progress, 1, `ตอบถูก ${currentQ.word}`, actionId('blanks', `${blanksQuestionIdx}:${letter}`));
			}
			blanksQuestionIdx = nextIdx;
			addScoreToast('+50 เติมถูกต้อง!', 'text-primary');

			if (nextIdx >= questions.length) {
				addScoreToast('🎉 ผ่านทุกข้อในรอบนี้!', 'text-primary');
			}
		} else if (letter === '⬅') {
			// Backspace
		} else {
			addScoreToast('-10 อักษรผิด', 'text-error-content');
			if (!isQuiz) {
				await submitPlayerProgress(currentRoom.room_id, localPlayer.id, -10, 0, 0, undefined, actionId('blanks-wrong', `${blanksQuestionIdx}:${letter}`));
			}
		}
	}

	// 4. Spelling Quiz Choice
	async function handleSpellingQuizSide(side: 'left' | 'right') {
		if (myPlayer?.isSpectator || !canAnswerActiveRound() || !activeRoundData || !currentRoom) return;
		const questions = activeRoundData.payload.questions || [];
		const currentQ = questions[spellingQuizIdx];
		if (!currentQ) return;

		const isQuiz = roomMeta?.config?.mode === 'quiz';
		const claimKey = `spellingquiz_r${currentRoundIndex}_q${spellingQuizIdx}`;

		if (isQuiz && roomMeta?.quizClaims?.[claimKey]) {
			addScoreToast(`ข้อนี้ถูก ${roomMeta.quizClaims[claimKey].playerName} ชิงตอบไปแล้ว!`, 'text-error-content');
			return;
		}

		const isCorrect = (side === 'left' && currentQ.leftIsCorrect) || (side === 'right' && !currentQ.leftIsCorrect);

		if (isCorrect) {
			const nextIdx = spellingQuizIdx + 1;
			const progress = Math.min(100, Math.round((nextIdx / questions.length) * 100));

			if (isQuiz) {
				const result = await submitQuizClaim(currentRoom.room_id, localPlayer.id, claimKey, 50, progress, `ชิงตอบถูก: "${currentQ.correct}"`, actionId('spellingquiz', `${spellingQuizIdx}:${side}`));
				if (!result.success) {
					addScoreToast(result.reason || 'มีผู้เล่นชิงตอบข้อนี้ไปแล้ว', 'text-error-content');
					return;
				}
			} else {
				await submitPlayerProgress(currentRoom.room_id, localPlayer.id, 50, progress, 1, `สะกดถูก: "${currentQ.correct}"`, actionId('spellingquiz', `${spellingQuizIdx}:${side}`));
			}
			spellingQuizIdx = nextIdx;
			addScoreToast(`+50 สะกดถูกต้อง! (${currentQ.correct})`, 'text-info-content');
		} else {
			addScoreToast(`-20 สะกดผิด! คำที่ถูกคือ "${currentQ.correct}"`, 'text-error-content');
			if (!isQuiz) {
				const nextIdx = spellingQuizIdx + 1;
				spellingQuizIdx = nextIdx;
				await submitPlayerProgress(currentRoom.room_id, localPlayer.id, -20, Math.min(100, Math.round((nextIdx / questions.length) * 100)), 0, undefined, actionId('spellingquiz-wrong', `${spellingQuizIdx}:${side}`));
			}
		}
	}

	// 5. Thai Quiz Choice (4 choices)
	async function handleThaiQuizChoice(choiceIdx: number) {
		if (myPlayer?.isSpectator || !canAnswerActiveRound() || !activeRoundData || !currentRoom) return;
		const questions = activeRoundData.payload.questions || [];
		const currentQ = questions[thaiQuizIdx];
		if (!currentQ) return;

		const isQuiz = roomMeta?.config?.mode === 'quiz';
		const claimKey = `thaiquiz_r${currentRoundIndex}_q${thaiQuizIdx}`;

		if (isQuiz && roomMeta?.quizClaims?.[claimKey]) {
			addScoreToast(`ข้อนี้ถูก ${roomMeta.quizClaims[claimKey].playerName} ชิงตอบไปแล้ว!`, 'text-error-content');
			return;
		}

		const isCorrect = choiceIdx === currentQ.correctIndex;

		if (isCorrect) {
			const nextIdx = thaiQuizIdx + 1;
			const progress = Math.min(100, Math.round((nextIdx / questions.length) * 100));

			if (isQuiz) {
				const result = await submitQuizClaim(currentRoom.room_id, localPlayer.id, claimKey, 60, progress, `ชิงตอบถูกข้อ ${nextIdx}`, actionId('thaiquiz', `${thaiQuizIdx}:${choiceIdx}`));
				if (!result.success) {
					addScoreToast(result.reason || 'มีผู้เล่นชิงตอบข้อนี้ไปแล้ว', 'text-error-content');
					return;
				}
			} else {
				await submitPlayerProgress(currentRoom.room_id, localPlayer.id, 60, progress, 1, `ตอบถูกข้อ ${nextIdx}`, actionId('thaiquiz', `${thaiQuizIdx}:${choiceIdx}`));
			}
			thaiQuizIdx = nextIdx;
			addScoreToast(`+60 ตอบถูกต้อง! (${currentQ.choices[currentQ.correctIndex]})`, 'text-warning-content');
		} else {
			addScoreToast(`-20 ตอบผิด! คำตอบที่ถูกคือ "${currentQ.choices[currentQ.correctIndex]}"`, 'text-error-content');
			if (!isQuiz) {
				const nextIdx = thaiQuizIdx + 1;
				thaiQuizIdx = nextIdx;
				await submitPlayerProgress(currentRoom.room_id, localPlayer.id, -20, Math.min(100, Math.round((nextIdx / questions.length) * 100)), 0, undefined, actionId('thaiquiz-wrong', `${thaiQuizIdx}:${choiceIdx}`));
			}
		}
	}

	// 6. Boggle Handlers with SVG Drag Line
	function getCellSVGCoord(val: number): number {
		return (val + 0.5) * 25;
	}

	$: bogglePathSVGData =
		boggleSelectedPath.length > 0
			? `M ${getCellSVGCoord(boggleSelectedPath[0].c)} ${getCellSVGCoord(boggleSelectedPath[0].r)} ` +
			  boggleSelectedPath
					.slice(1)
					.map((p) => `L ${getCellSVGCoord(p.c)} ${getCellSVGCoord(p.r)}`)
					.join(' ')
			: '';

	function handleBoggleCellStart(r: number, c: number) {
		if (myPlayer?.isSpectator || !canAnswerActiveRound()) return;
		boggleIsDragging = true;
		boggleSelectedPath = [{ r, c }];
		if (activeRoundData?.payload?.grid) {
			playerInput = activeRoundData.payload.grid[r][c];
		}
	}

	function handleBoggleCellEnter(r: number, c: number) {
		if (myPlayer?.isSpectator || !boggleIsDragging || !activeRoundData?.payload?.grid) return;
		const pathIndex = boggleSelectedPath.findIndex((p) => p.r === r && p.c === c);
		if (pathIndex !== -1) {
			boggleSelectedPath = boggleSelectedPath.slice(0, pathIndex + 1);
		} else {
			if (boggleSelectedPath.length > 0) {
				const lastCell = boggleSelectedPath[boggleSelectedPath.length - 1];
				const isAdjacent = Math.abs(lastCell.r - r) <= 1 && Math.abs(lastCell.c - c) <= 1;
				if (isAdjacent) {
					boggleSelectedPath = [...boggleSelectedPath, { r, c }];
				}
			} else {
				boggleSelectedPath = [{ r, c }];
			}
		}
		playerInput = boggleSelectedPath.map((p) => activeRoundData.payload.grid[p.r][p.c]).join('');
	}

	function handleBoggleCellEnd() {
		if (myPlayer?.isSpectator || !boggleIsDragging) return;
		boggleIsDragging = false;
		if (boggleSelectedPath.length >= 3) {
			handleBoggleSubmit();
		}
	}

	async function handleBoggleSubmit() {
		if (myPlayer?.isSpectator || !canAnswerActiveRound() || !playerInput.trim() || !activeRoundData || !currentRoom) return;
		const word = playerInput.trim();
		const pathLength = boggleSelectedPath.length;
		const pathWord = getBogglePathWord(activeRoundData.payload.grid || [], boggleSelectedPath);
		playerInput = '';
		boggleSelectedPath = [];
		boggleIsDragging = false;

		if (pathLength < 3) {
			addScoreToast('ต้องมีอย่างน้อย 3 ตัวอักษร', 'text-error-content');
			return;
		}
		if (!pathWord || pathWord !== word) {
			addScoreToast('ต้องลากอักษรที่อยู่ติดกันโดยไม่ใช้ช่องซ้ำ', 'text-error-content');
			return;
		}

		const isQuiz = roomMeta?.config?.mode === 'quiz';
		if (isQuiz && roomMeta?.sharedFoundWords?.[word]) {
			addScoreToast(`คำนี้ถูก ${roomMeta.sharedFoundWords[word].playerName} ตอบไปแล้ว!`, 'text-warning-content');
			return;
		}

		if (boggleFound.includes(word)) {
			addScoreToast('พบคำนี้ไปแล้ว!', 'text-warning-content');
			return;
		}

		if (search(word)) {
			const points = pathLength >= 5 ? 100 : pathLength * 20;
			const progress = Math.min(100, (boggleFound.length + 1) * 15);

			if (isQuiz) {
				const result = await submitSharedWord(currentRoom.room_id, localPlayer.id, word, points, progress, `ชิงพบคำว่า "${word}"`, actionId('boggle', word));
				if (!result.success) {
					addScoreToast(result.reason || 'มีผู้เล่นชิงคำนี้ไปแล้ว', 'text-warning-content');
					return;
				}
			} else {
				await submitPlayerProgress(currentRoom.room_id, localPlayer.id, points, progress, 1, `พบคำว่า "${word}"`, actionId('boggle', word));
			}
			boggleFound = [...boggleFound, word];
			addScoreToast(`+${points} พบคำว่า "${word}"`, 'text-secondary');
		} else {
			addScoreToast('ไม่อยู่ในพจนานุกรม', 'text-error-content');
		}
	}

	// 6. Word Ladder Handlers
	async function handleLadderSubmit() {
		if (myPlayer?.isSpectator || !canAnswerActiveRound() || ladderSolved || !playerInput.trim() || !activeRoundData || !currentRoom) return;
		const word = playerInput.trim();
		playerInput = '';

		const last = ladderChain[ladderChain.length - 1];
		const endWord = activeRoundData.payload.end;

		if (!search(word)) {
			addScoreToast(`"${word}" ไม่อยู่ในพจนานุกรม`, 'text-error-content');
			return;
		}

		if (ladderChain.includes(word)) {
			addScoreToast('คำนี้ถูกใช้ในบันไดไปแล้ว', 'text-warning-content');
			return;
		}

		const d = diffSlots(splitSlots(last), splitSlots(word));
		if (d !== 1) {
			addScoreToast(`ต่างจากคำก่อนหน้า ${d} ช่อง (ต้องต่าง 1 ช่อง)`, 'text-error-content');
			return;
		}

		ladderChain = [...ladderChain, word];
		addScoreToast(`+30 ก้าวสำเร็จ: ${word}`, 'text-success-content');

		if (word === endWord) {
			ladderSolved = true;
			addScoreToast('🎉 พิชิต Word Ladder สำเร็จ! +150', 'text-primary');
			await submitPlayerProgress(currentRoom.room_id, localPlayer.id, 150, 100, 1, `พิชิต Word Ladder สู่ "${endWord}"`, actionId('wordladder-finish', word));
		} else {
			await submitPlayerProgress(currentRoom.room_id, localPlayer.id, 30, Math.min(90, ladderChain.length * 20), 0, undefined, actionId('wordladder-step', `${ladderChain.length}:${word}`));
		}
	}

	function handleLadderUndo() {
		if (myPlayer?.isSpectator || ladderChain.length <= 1 || ladderSolved) return;
		ladderChain = ladderChain.slice(0, -1);
	}

	// Global Keyboard Handler
	function handleGlobalKeyDown(e: KeyboardEvent) {
		if (currentView !== 'battle' || !activeRoundData || myPlayer?.isSpectator) return;
		const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();

		if (targetTag === 'input') {
			if (e.key === 'Enter') {
				if (activeRoundData.puzzleType === 'crossroad') handleCrossroadSubmit();
				else if (activeRoundData.puzzleType === 'spellingbee') handleSpellingBeeSubmit();
				else if (activeRoundData.puzzleType === 'boggle') handleBoggleSubmit();
				else if (activeRoundData.puzzleType === 'wordladder') handleLadderSubmit();
			}
			return;
		}

		if (activeRoundData.puzzleType === 'blanks') {
			if (/^[ก-ฮ\u0E30-\u0E39\u0E47-\u0E4C]$/.test(e.key)) {
				handleBlanksType(e.key);
			} else if (e.key === 'Backspace') {
				handleBlanksType('⬅');
			}
		} else if (activeRoundData.puzzleType === 'spellingquiz') {
			if (e.key === 'ArrowLeft' || e.key === '1') {
				handleSpellingQuizSide('left');
			} else if (e.key === 'ArrowRight' || e.key === '2') {
				handleSpellingQuizSide('right');
			}
		} else if (activeRoundData.puzzleType === 'spellingbee') {
			if (e.key === 'Enter') {
				handleSpellingBeeSubmit();
			} else if (e.key === ' ' || e.code === 'Space') {
				e.preventDefault();
				shuffleSpellingBeeLetters();
			} else if (e.key === 'Backspace') {
				playerInput = playerInput.slice(0, -1);
			} else if (/^[ก-ฮ\u0E30-\u0E39\u0E47-\u0E4C]$/.test(e.key)) {
				playerInput += e.key;
			}
		} else if (activeRoundData.puzzleType === 'boggle') {
			if (e.key === 'Enter') {
				handleBoggleSubmit();
			} else if (e.key === 'Backspace') {
				playerInput = playerInput.slice(0, -1);
				boggleSelectedPath = boggleSelectedPath.slice(0, -1);
			}
		} else if (activeRoundData.puzzleType === 'thaiquiz') {
			if (e.key === '1' || e.key === 'a' || e.key === 'A') handleThaiQuizChoice(0);
			else if (e.key === '2' || e.key === 'b' || e.key === 'B') handleThaiQuizChoice(1);
			else if (e.key === '3' || e.key === 'c' || e.key === 'C') handleThaiQuizChoice(2);
			else if (e.key === '4' || e.key === 'd' || e.key === 'D') handleThaiQuizChoice(3);
		}
	}

	function timeAgo(isoString: string): string {
		const diffSec = Math.max(1, Math.floor((Date.now() - new Date(isoString).getTime()) / 1000));
		if (diffSec < 60) return `${diffSec} วินาทีที่แล้ว`;
		const diffMin = Math.floor(diffSec / 60);
		if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`;
		return `${Math.floor(diffMin / 60)} ชม. ที่แล้ว`;
	}

	$: sortedPlayers = (currentRoom?.players || []).slice().sort((a, b) => b.score - a.score);
	$: isHostUser = currentRoom?.players.find((p) => p.id === localPlayer.id)?.isHost || false;
	$: myPlayer = currentRoom?.players.find((p) => p.id === localPlayer.id);
	$: allReady = (currentRoom?.players || []).length >= 1 && (currentRoom?.players || []).every((p) => p.isReady);
	$: isQuizMode = roomMeta?.config?.mode === 'quiz';
	$: sharedWordsMap = roomMeta?.sharedFoundWords || {};

	function countFoundWords(words: string[], quizMode: boolean, wordsMap: Record<string, any>, found: string[]): number {
		return words.filter((w) => (quizMode ? !!wordsMap[w] : found.includes(w))).length;
	}

	// Aggregate online players list
	$: onlinePlayers = (() => {
		const map = new Map<string, { id: string; name: string; avatar: string; status: string; roomCode?: string }>();
		map.set(localPlayer.id, {
			id: localPlayer.id,
			name: localPlayer.name,
			avatar: localPlayer.avatar,
			status: currentRoom ? (currentRoom.status === 1 ? '⚔️ กำลังแข่งขัน' : '🟡 รอในห้อง') : '🟢 ออนไลน์',
			roomCode: currentRoom?.room_id
		});

		for (const r of rooms) {
			for (const p of r.players || []) {
				if (!map.has(p.id)) {
					map.set(p.id, {
						id: p.id,
						name: p.name,
						avatar: p.avatar,
						status: r.status === 1 ? '⚔️ กำลังแข่งขัน' : '🟡 รอในห้อง',
						roomCode: r.room_id
					});
				}
			}
		}
		return Array.from(map.values());
	})();
</script>

<svelte:window on:keydown={handleGlobalKeyDown} />

<svelte:head>
 <meta name="robots" content="noindex, nofollow" />
	<title>Code Breaker | Puzzle Battle Arena</title>
	<meta
		name="description"
		content="ห้องประลองปริศนาออนไลน์แบบเรียลไทม์ ท้าประลองความไวและปัญญาในโหมด Multiplayer"
	/>
</svelte:head>

<div class="{currentView === 'battle' ? 'min-h-screen bg-base-100 text-base-content text-base-content/70 p-2 sm:p-4 selection:bg-emerald-500 selection:text-base-content/70 flex flex-col justify-between' : 'min-h-screen bg-base-100 text-base-content text-base-content/70 pb-24 pt-4 px-3 sm:px-4 selection:bg-emerald-500 selection:text-base-content/70'}">
	<div class="{currentView === 'battle' ? 'w-full max-w-7xl mx-auto flex flex-col gap-3 flex-1' : 'max-w-6xl mx-auto flex flex-col gap-4'}">

		<!-- Top Header Bar (With Elevated Z-Index For Emoji Picker) -->
		{#if currentView !== 'battle'}
			<header class="relative z-50 overflow-visible flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-base-100 text-base-content backdrop-blur-xl border border-base-300 rounded-2xl p-3 sm:p-4 shadow-2xl">
				<div class="flex items-center gap-3">
					<a
						href="/puzzles"
						class="btn btn-sm btn-ghost gap-1.5 text-base-content/70 hover:text-base-content"
						title="กลับหน้า Puzzles"
					>
						<ArrowLeftIcon size={16} />
						<span class="hidden sm:inline">Puzzles</span>
					</a>
					<div class="h-6 w-px bg-base-100 text-base-content"></div>
					<div class="flex items-center gap-2">
						<span class="text-2xl animate-pulse">⚔️</span>
						<div>
							<h1 class="text-base sm:text-lg font-black tracking-tight text-primary">
								Puzzle Battle Arena
							</h1>
							<p class="text-[11px] text-base-content/70 font-medium">สังเวียนประลองปริศนาสด Realtime Multiplayer</p>
						</div>
					</div>
				</div>

				<!-- Player Profile Quick Bar (Elevated Z-Index) -->
				<div class="relative z-50 flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end bg-base-100 text-base-content border border-base-300 rounded-xl px-3 py-1">
					<div class="flex items-center gap-1.5 relative">
						<div class="dropdown dropdown-end">
							<button tabindex="0" class="btn btn-xs btn-ghost text-xl px-1 hover:bg-base-100 text-base-content" title="เปลี่ยน Avatar">
								{localPlayer.avatar}
							</button>
							<div tabindex="0" class="botanical-card dropdown-content menu p-2 shadow-2xl bg-base-100 text-base-content border border-base-300 rounded-2xl w-48 z-[999] absolute right-0 top-full mt-2 grid grid-cols-4 gap-1">
								{#each AVATARS as av}
									<button
										class="btn btn-ghost text-xl p-1 hover:bg-emerald-500/20 rounded-xl transition-all"
										on:click={() => {
											localPlayer.avatar = av;
											savePlayerProfile();
										}}
									>
										{av}
									</button>
								{/each}
							</div>
						</div>
						<input
							type="text"
							bind:value={localPlayer.name}
							on:change={savePlayerProfile}
							maxlength="18"
							class="input input-xs bg-transparent border-b border-base-300 focus:border-primary/30 focus:outline-none font-bold text-base-content max-w-[120px]"
							placeholder="ชื่อผู้เล่น"
						/>
					</div>
					<div class="badge badge-success badge-xs gap-1 py-2 font-mono text-[10px] text-success-content">
						<span class="h-1.5 w-1.5 rounded-full bg-base-100 text-base-content animate-ping"></span>
						ONLINE
					</div>
				</div>
			</header>
		{/if}

		<!-- ========================================================================= -->
		<!-- VIEW 1: MAIN LOBBY (COMPACT CREATION / JOIN / ONLINE PLAYERS)             -->
		<!-- ========================================================================= -->
		{#if currentView === 'lobby'}
			<div class="flex flex-col gap-4" in:fade={{ duration: 200 }}>
				<!-- Compact Room Action Bar -->
				<div class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-2xl p-3.5 sm:p-4 shadow-xl flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
					<div class="flex items-center gap-2.5">
						<div class="h-8 w-8 rounded-xl bg-emerald-500/20 text-primary flex items-center justify-center font-bold">
							<ZapIcon size={16} />
						</div>
						<div>
							<h2 class="text-sm sm:text-base font-black text-base-content">ห้องประลองออนไลน์ (Battle Arena)</h2>
							<p class="text-xs text-base-content/70">สร้างห้องแข่งความไว หรือใส่รหัส 4 หลักเพื่อเข้าร่วม</p>
						</div>
					</div>

					<div class="flex flex-wrap items-center gap-2 justify-end">
						<!-- Quick Join Input -->
						<div class="join">
							<input
								type="text"
								bind:value={quickJoinCode}
								placeholder="รหัสห้อง 4 หลัก"
								maxlength="6"
								class="join-item input input-sm  bg-base-100 text-base-content uppercase font-mono tracking-widest text-center text-base-content border-base-300 w-32 focus:border-primary/30"
							/>
							<button
								class="join-item btn btn-sm btn-accent text-accent-content font-bold"
								disabled={isJoiningRoom || quickJoinCode.trim().length < 3}
								on:click={() => handleJoinRoom(quickJoinCode)}
							>
								{#if isJoiningRoom}
									<span class="loading loading-spinner loading-xs"></span>
								{:else}
									เข้าร่วม
								{/if}
							</button>
						</div>

						<button
							class="btn btn-primary btn-sm gap-1.5 font-bold text-primary-content shadow-lg shadow-emerald-900/40"
							on:click={() => (showCreateModal = true)}
						>
							<PlusCircleIcon size={15} />
							สร้างห้องใหม่ (Create)
						</button>
					</div>
				</div>

				<!-- Error Alert -->
				{#if errorMessage}
					<div class="alert alert-error shadow-lg rounded-2xl flex items-center justify-between text-error-content py-2" in:fly={{ y: -10 }}>
						<div class="flex items-center gap-2">
							<AlertCircleIcon size={16} />
							<span class="text-xs sm:text-sm font-medium">{errorMessage}</span>
						</div>
						<button class="btn btn-xs btn-ghost" on:click={() => (errorMessage = '')}>ปิด</button>
					</div>
				{/if}

				<!-- Two Columns: Active Rooms (Main) + Online Players (Sidebar) -->
				<div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
					<!-- Active Rooms List (3 cols) -->
					<div class="lg:col-span-3 flex flex-col gap-3">
						<div class="flex justify-between items-center border-b border-base-300 pb-2">
							<div class="flex items-center gap-2">
								<UsersIcon size={16} class="text-primary" />
								<h3 class="text-sm sm:text-base font-bold text-base-content">ห้องแข่งขันที่เปิดอยู่ (Active Rooms)</h3>
								<span class="badge badge-neutral badge-xs font-mono">{rooms.length}</span>
							</div>

							<button
								class="btn btn-xs btn-ghost gap-1 text-base-content/70 hover:text-base-content"
								on:click={refreshRooms}
								title="รีเฟรชรายการห้อง"
							>
								<RefreshCwIcon size={12} class={isLoadingRooms ? 'animate-spin' : ''} />
								<span class="text-xs">รีเฟรช</span>
							</button>
						</div>

						<!-- Rooms Grid -->
						{#if isLoadingRooms && rooms.length === 0}
							<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
								{#each Array(2) as _}
									<div class="h-36 rounded-2xl bg-base-100 text-base-content border border-base-300 animate-pulse"></div>
								{/each}
							</div>
						{:else if rooms.length === 0}
							<div class="botanical-card flex flex-col items-center justify-center p-8 bg-base-100 text-base-content border border-dashed border-base-300 rounded-2xl text-center gap-2">
								<span class="text-3xl">🏜️</span>
								<p class="text-sm font-bold text-base-content/70">ยังไม่มีห้องแข่งขันในขณะนี้</p>
								<p class="text-xs text-base-content/70 max-w-xs">เป็นคนแรกที่สร้างห้องประลอง แล้วชวนเพื่อนๆ เข้ามาร่วมแข่งได้เลย!</p>
								<button
									class="btn btn-xs btn-primary mt-1 gap-1 font-bold text-primary-content"
									on:click={() => (showCreateModal = true)}
								>
									<PlusCircleIcon size={14} />
									สร้างห้องแรก
								</button>
							</div>
						{:else}
							<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
								{#each rooms as r (r.room_id)}
									{@const meta = parseRoomMeta(r.game_title)}
									{@const puzzleInfo = meta?.config ? PUZZLE_TYPES.find((p) => p.id === meta.config.puzzleType) : null}
									{@const playerCount = (r.players || []).length}
									{@const maxPlayers = meta?.config?.maxPlayers || 4}
									<div
										class="botanical-card bg-base-100 text-base-content hover:bg-base-100 text-base-content border border-base-300 hover:border-primary/30 rounded-2xl p-4 shadow-xl transition-all flex flex-col justify-between gap-3 group relative overflow-hidden"
									>
										<div class="flex flex-col gap-2">
											<div class="flex items-center justify-between">
												<div class="flex items-center gap-2">
													<span class="px-2 py-0.5 rounded-lg bg-base-100 text-base-content text-primary font-mono text-xs font-bold border border-base-300 tracking-wider">
														#{r.room_id}
													</span>
													{#if r.status === 0}
														<span class="badge badge-success badge-xs gap-1 text-success-content font-bold">
															<span class="h-1.5 w-1.5 rounded-full bg-base-100 text-base-content animate-pulse"></span>
															รอผู้เล่น
														</span>
													{:else}
														<span class="badge badge-warning badge-xs text-warning-content font-bold">
															⚔️ กำลังแข่ง
														</span>
													{/if}
												</div>

												<div class="flex items-center gap-1 text-xs text-base-content/70">
													<span class="text-[10px] text-base-content/70">⏳ {timeAgo(r.created_at)}</span>
													<span class="mx-1 text-base-content/70">•</span>
													<UsersIcon size={12} />
													<span class="font-mono font-bold text-base-content text-xs">{playerCount}/{maxPlayers}</span>
												</div>
											</div>

											<div>
												<h4 class="font-bold text-base-content text-sm group-hover:text-primary transition-colors line-clamp-1">
													{meta?.config?.roomName || `ห้องของ ${r.players?.[0]?.name || 'Host'}`}
												</h4>
												<div class="flex flex-wrap items-center gap-1 mt-1.5">
													{#if puzzleInfo}
														<span class="badge {puzzleInfo.badgeColor} badge-xs gap-1 font-semibold">
															{puzzleInfo.icon} {puzzleInfo.name}
														</span>
													{/if}
													<span class="badge {meta?.config?.mode === 'quiz' ? 'badge-secondary' : 'badge-primary'} badge-xs font-bold">
														{meta?.config?.mode === 'quiz' ? '🎯 Quiz' : '🏎️ Race'}
													</span>
													<span class="badge badge-ghost badge-xs text-base-content/70">
														{meta?.config?.rounds || 1} รอบ
													</span>
												</div>
											</div>
										</div>

										<div class="flex items-center justify-between pt-2 border-t border-base-300">
											<div class="flex items-center gap-1.5 text-xs text-base-content/70">
												<span>โฮสต์:</span>
												<span class="text-base-content/70 font-medium text-xs">{r.players?.[0]?.avatar || '👑'} {r.players?.[0]?.name || 'ผู้สร้าง'}</span>
											</div>

											<div class="flex items-center gap-1.5">
												{#if r.status === 1}
													<button
														class="btn btn-xs btn-outline border-primary/30 text-primary hover:bg-cyan-500/20 font-bold gap-1 shadow"
														on:click={() => handleWatchRoom(r.room_id)}
													>
														<EyeIcon size={12} />
														ชมการแข่ง
													</button>
												{/if}

												<button
													class="btn btn-xs btn-primary gap-1 font-bold text-primary-content shadow-md"
													disabled={r.status !== 0 || playerCount >= maxPlayers}
													on:click={() => handleJoinRoom(r.room_id)}
												>
													{r.status === 0 ? 'เข้าร่วม' : 'แข่งอยู่'}
												</button>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Online Players Sidebar (1 col) -->
					<div class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-2xl p-3.5 shadow-xl flex flex-col gap-3 h-fit">
						<div class="flex items-center justify-between border-b border-base-300 pb-2">
							<div class="flex items-center gap-2">
								<RadioIcon size={15} class="text-primary animate-pulse" />
								<h4 class="font-bold text-base-content text-sm">ผู้เล่นออนไลน์</h4>
							</div>
							<span class="badge badge-success badge-xs font-mono text-[10px] text-success-content">{onlinePlayers.length} คน</span>
						</div>

						<div class="flex flex-col gap-2 max-h-72 overflow-y-auto">
							{#each onlinePlayers as p (p.id)}
								<div class="flex items-center justify-between p-2 rounded-xl bg-base-100 text-base-content border border-base-300">
									<div class="flex items-center gap-2 overflow-hidden">
										<span class="text-xl">{p.avatar}</span>
										<span class="font-bold text-xs text-base-content truncate max-w-[100px] {p.id === localPlayer.id ? 'text-primary' : ''}">
											{p.name}
										</span>
									</div>
									<span class="text-[10px] font-semibold text-base-content/70">
										{p.status}
									</span>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>

		<!-- ========================================================================= -->
		<!-- VIEW 2: WAITING ROOM (LOBBY)                                              -->
		<!-- ========================================================================= -->
		{:else if currentView === 'waiting' && currentRoom}
			{@const meta = roomMeta}
			{@const puzzleInfo = meta?.config ? PUZZLE_TYPES.find((p) => p.id === meta.config.puzzleType) : null}
			<div class="flex flex-col gap-4" in:fade={{ duration: 200 }}>
				<!-- Room Header Bar -->
				<div class="botanical-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-base-100 text-base-content backdrop-blur-xl border border-base-300 rounded-3xl p-5 shadow-2xl">
					<div class="flex flex-col gap-1">
						<div class="flex items-center gap-2.5">
							<span class="px-2.5 py-0.5 rounded-xl bg-emerald-500/20 text-primary border border-primary/30 font-mono text-sm font-black tracking-widest">
								ROOM #{currentRoom.room_id}
							</span>
							<button
								class="btn btn-xs btn-ghost gap-1 text-base-content/70 hover:text-base-content"
								on:click={copyInviteLink}
								title="คัดลอกลิงก์เชิญ"
							>
								{#if copiedCode}
									<CheckIcon size={14} class="text-primary" />
									<span class="text-primary font-bold">คัดลอกแล้ว!</span>
								{:else}
									<CopyIcon size={14} />
									<span>คัดลอกลิงก์</span>
								{/if}
							</button>
						</div>
						<h2 class="text-xl sm:text-2xl font-black text-base-content">{meta?.config?.roomName || 'ห้องประลอง'}</h2>
						<div class="flex flex-wrap items-center gap-2 text-xs text-base-content/70">
							{#if puzzleInfo}
								<span class="badge {puzzleInfo.badgeColor} badge-xs">{puzzleInfo.icon} {puzzleInfo.name}</span>
							{/if}
							<span class="badge {meta?.config?.mode === 'quiz' ? 'badge-secondary' : 'badge-primary'} badge-xs font-bold">
								{meta?.config?.mode === 'quiz' ? '🎯 โหมดชิงคะแนนสด (Quiz)' : '🏎️ โหมดแข่งความเร็ว (Race)'}
							</span>
							<span>• {meta?.config?.rounds || 3} รอบ</span>
							<span>• รอบละ {meta?.config?.timePerRound || 60} วินาที</span>
						</div>
					</div>

					<div class="flex items-center gap-2.5 w-full md:w-auto justify-end">
						<button class="btn btn-outline btn-sm border-base-300 text-base-content/70 hover:bg-rose-500/20 hover:text-error-content" on:click={handleLeaveRoom}>
							ออกจากห้อง
						</button>
						{#if isHostUser}
							<button
								class="btn btn-primary btn-sm sm:btn-md gap-1.5 font-bold text-primary-content shadow-lg shadow-emerald-900/50"
								disabled={!allReady}
								on:click={handleStartMatch}
							>
								<PlayIcon size={16} />
								เริ่มการประลอง (Start)
							</button>
						{:else}
							<button
								class="btn btn-sm sm:btn-md gap-1.5 font-bold {myPlayer?.isReady ? 'btn-success text-success-content' : 'btn-warning text-warning-content'}"
								on:click={handleToggleReady}
							>
								<CheckIcon size={16} />
								{myPlayer?.isReady ? 'พร้อมแล้ว (Ready!)' : 'กดพร้อม (Set Ready)'}
							</button>
						{/if}
					</div>
				</div>

				<!-- Player Roster Grid -->
				<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
					{#each (currentRoom.players || []) as player (player.id)}
						<div
							class="botanical-card bg-base-100 text-base-content border {player.isReady ? 'border-primary/30 bg-base-300 text-base-content' : 'border-base-300'} rounded-2xl p-4 flex flex-col items-center text-center gap-2.5 relative overflow-hidden transition-all"
						>
							{#if player.isHost}
								<div class="absolute top-2.5 left-2.5 badge badge-warning badge-xs text-warning-content font-bold gap-1">
									👑 HOST
								</div>
							{/if}

							<div class="relative mt-1">
								<div class="botanical-card w-16 h-16 rounded-2xl bg-base-100 text-base-content border-2 {player.isReady ? 'border-primary/30 shadow-lg shadow-emerald-500/20' : 'border-base-300'} flex items-center justify-center text-3xl">
									{player.avatar}
								</div>
								{#if player.isReady}
									<div class="absolute -bottom-1 -right-1 bg-emerald-500 text-base-content/70 rounded-full p-0.5 shadow-md">
										<CheckIcon size={12} />
									</div>
								{/if}
							</div>

							<div>
								<h4 class="font-bold text-base-content text-sm line-clamp-1">{player.name}</h4>
								<p class="text-[11px] {player.isReady ? 'text-primary font-bold' : 'text-warning-content'}">
									{player.isReady ? 'พร้อมประลองแล้ว' : 'กำลังเตรียมตัว...'}
								</p>
							</div>
						</div>
					{/each}

					<!-- Empty Slot Placeholders -->
					{#each Array(Math.max(0, (meta?.config?.maxPlayers || 4) - (currentRoom.players || []).length)) as _}
						<div class="border border-dashed border-base-300 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1 text-base-content/70 min-h-[140px]">
							<UsersIcon size={22} />
							<span class="text-[11px] font-semibold">รอผู้เล่นเข้าร่วม...</span>
							<button class="btn btn-xs btn-ghost text-base-content/70 hover:text-base-content" on:click={copyInviteLink}>
								แชร์รหัส #{currentRoom.room_id}
							</button>
						</div>
					{/each}
				</div>

				{#if isHostUser && !allReady}
					<div class="alert alert-info bg-info/20 border-info/40 rounded-2xl text-info-content flex items-center gap-2 py-2">
						<AlertCircleIcon size={16} />
						<span class="text-xs sm:text-sm font-medium">รอให้ผู้เล่นทุกคนกดปุ่ม "พร้อม (Ready)" เพื่อเริ่มเกมได้</span>
					</div>
				{/if}
			</div>

		<!-- ========================================================================= -->
		<!-- VIEW 3: ACTIVE BATTLE ARENA (FULL SCREEN IMMERSION)                       -->
		<!-- ========================================================================= -->
		{:else if currentView === 'battle' && currentRoom && activeRoundData}
			{@const meta = roomMeta}
			{@const puzzleInfo = meta?.config ? PUZZLE_TYPES.find((p) => p.id === meta.config.puzzleType) : null}

			<!-- Synchronized Countdown Overlay -->
			{#if countdownNumber !== null}
				<div class="fixed inset-0 z-50 bg-base-100 text-base-content backdrop-blur-md flex flex-col items-center justify-center gap-4 text-center" in:fade>
					<span class="text-sm uppercase tracking-widest text-primary font-black">รอบที่ {currentRoundIndex + 1} / {meta?.rounds.length || 1}</span>
					<div class="text-8xl sm:text-9xl font-black bg-gradient-to-r from-base-200 via-base-200 to-base-200 text-primary animate-bounce" in:scale>
						{countdownNumber}
					</div>
					<p class="text-lg text-base-content/70 font-bold">{activeRoundData.title}</p>
				</div>
			{/if}

			<div class="flex flex-col gap-3 h-full" in:fade={{ duration: 200 }}>
				<!-- Arena Header & Live Timer -->
				<div class="botanical-card flex flex-row justify-between items-center gap-2 bg-base-100 text-base-content backdrop-blur-xl border border-base-300 rounded-2xl p-3 sm:p-4 shadow-xl">
					<div class="flex items-center gap-2 sm:gap-3">
						<div class="badge badge-primary badge-md sm:badge-lg font-bold text-primary-content whitespace-nowrap">
							รอบ {currentRoundIndex + 1}/{meta?.rounds.length || 1}
						</div>
						<div>
							<h3 class="text-sm sm:text-base font-extrabold text-base-content flex items-center gap-1.5">
								<span>{puzzleInfo?.icon || '🎮'}</span>
								<span class="line-clamp-1">{activeRoundData.title}</span>
							</h3>
						</div>
						<div class="badge {isQuizMode ? 'badge-secondary' : 'badge-primary'} badge-sm font-bold hidden sm:inline-flex">
							{isQuizMode ? '🎯 Quiz' : '🏎️ Race'}
						</div>
						{#if myPlayer?.isSpectator}
							<div class="badge badge-info badge-sm font-bold gap-1 text-info-content animate-pulse">
								<EyeIcon size={12} />
								<span>ผู้ชม (Spectator)</span>
							</div>
						{/if}
					</div>

					<div class="flex items-center gap-2 sm:gap-3">
						{#if isHostUser}
							<button
								class="btn btn-xs sm:btn-sm btn-error text-error-content font-bold shadow-md"
								on:click={handleHostEndMatch}
								title="จบการแข่งขันและไปสรุปคะแนนทันที"
							>
								จบการแข่ง 🏁
							</button>
						{:else if myPlayer?.isSpectator}
							<button class="btn btn-xs btn-outline border-base-300 text-base-content/70 hover:bg-rose-500/20" on:click={handleLeaveRoom}>
								ออกจากการชม
							</button>
						{/if}

						<div class="flex items-center gap-2 bg-base-100 text-base-content border border-base-300 rounded-xl px-3 py-1.5">
							<ClockIcon size={16} class={matchTimeRemaining <= 10 ? 'text-error-content animate-spin' : 'text-primary'} />
							<span class="font-mono text-base sm:text-lg font-black {matchTimeRemaining <= 10 ? 'text-error-content animate-pulse' : 'text-base-content'}">
								{Math.floor(matchTimeRemaining / 60)}:{String(matchTimeRemaining % 60).padStart(2, '0')}
							</span>
						</div>
					</div>
				</div>

				<!-- Gameplay Layout (2 Columns: Main Stage + Live Scoreboard) -->
				<div class="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1">
					<!-- Main Gameplay Stage (3 cols) -->
					<div class="lg:col-span-3 flex flex-col gap-4">
						<div class="botanical-card bg-base-100 text-base-content backdrop-blur-xl border border-base-300 rounded-3xl p-4 sm:p-6 shadow-2xl min-h-[460px] flex flex-col justify-between relative overflow-hidden">

							<!-- Floating Score Feed Toasts -->
							<div class="absolute top-4 right-4 flex flex-col gap-2 pointer-events-none z-20">
								{#each scoreFeed as item (item.id)}
									<div class="badge badge-lg bg-base-100 text-base-content border border-base-300 shadow-xl {item.color} font-black text-sm" in:fly={{ y: 20 }} out:fade>
										{item.text}
									</div>
								{/each}
							</div>

							<!-- 1. SPELLING BEE GAMEPLAY -->
							{#if activeRoundData.puzzleType === 'spellingbee'}
								{@const payload = activeRoundData.payload}
								{@const solutions = payload.solutions || []}
								<div class="flex flex-col gap-4 my-auto w-full">
									<div class="flex flex-col items-center gap-3">
										<div class="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-xl select-none">
											{#each (payload.letters || []) as l (l)}
												<button
													disabled={myPlayer?.isSpectator}
													on:click={() => (playerInput += l)}
													class="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl border-2 font-black text-2xl sm:text-3xl flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg
													{playerInput.includes(l)
														? 'bg-amber-400 text-base-content/70 border-amber-400'
														: 'bg-base-100 text-base-content text-base-content border-base-300 hover:border-amber-400'}"
												>
													<span class={isUpper(l) || isLower(l) ? 'translate-x-0.5' : ''}>{l}</span>
												</button>
											{/each}
										</div>

										<!-- Input Bar -->
										<div class="w-full max-w-md flex items-center gap-2">
											<button
												disabled={myPlayer?.isSpectator}
												on:click={shuffleSpellingBeeLetters}
												class="btn btn-square btn-outline border-base-300 text-warning-content hover:bg-amber-400/20 p-3 rounded-2xl shadow-inner"
												title="สลับอักษร (Space)"
											>
												<ShuffleIcon size={18} />
											</button>

											<div class="relative flex-1 w-full">
												<input
													type="text"
													bind:value={playerInput}
													disabled={myPlayer?.isSpectator}
													placeholder={myPlayer?.isSpectator ? 'โหมดผู้เข้าชม (Spectating)...' : 'พิมพ์หรือคลิกตัวอักษร...'}
													class="input  w-full px-4 py-3 rounded-2xl bg-base-100 text-base-content text-base-content text-xl font-black focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
													class:botanical-answer-input={true}
												/>
												{#if playerInput}
													<button
														on:click={() => (playerInput = '')}
														class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/70 hover:text-base-content"
													>
														✕
													</button>
												{/if}
											</div>

											<button
												disabled={myPlayer?.isSpectator}
												on:click={handleSpellingBeeSubmit}
												class="btn btn-warning text-warning-content px-6 rounded-2xl font-black text-base shadow-lg"
											>
												ส่ง (Enter)
											</button>
										</div>
									</div>

									<!-- Bottom: Revealed Solutions Grid -->
									<div class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-2xl p-3 sm:p-4 flex flex-col gap-2">
										<div class="flex items-center justify-between border-b border-base-300 pb-2">
											<h4 class="font-bold text-xs sm:text-sm text-base-content">
												รายการคำศัพท์ทั้งหมด ({countFoundWords(solutions, isQuizMode, sharedWordsMap, spellingBeeFound)}/{solutions.length})
											</h4>
											{#if isQuizMode}
												<span class="text-[10px] text-warning-content font-semibold">* ชิงตอบ: คำที่ใครเจอแล้วจะล็อกทันที</span>
											{/if}
										</div>

										<div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1">
											{#each solutions as s}
												{@const claimed = isQuizMode ? sharedWordsMap[s] : null}
												{@const isSolved = isQuizMode ? !!claimed : spellingBeeFound.includes(s)}
												<div
													class="rounded-xl border transition-all h-8 flex items-center justify-center text-xs font-bold px-2 truncate
													{isSolved
														? 'bg-emerald-500/20 text-primary border-primary/30'
														: 'bg-base-100 text-base-content border-base-300 text-base-content/70'}"
												>
													{#if isSolved}
														<span class="truncate">{claimed ? `${claimed.avatar} ` : '✔ '}{s}</span>
													{:else}
														<span>{s.length} อักษร</span>
													{/if}
												</div>
											{/each}
										</div>
									</div>
								</div>

							<!-- 2. BLANKS GAMEPLAY -->
							{:else if activeRoundData.puzzleType === 'blanks'}
								{@const questions = activeRoundData.payload.questions || []}
								{@const currentQ = questions[blanksQuestionIdx]}
								<div class="flex flex-col items-center justify-between gap-4 my-auto w-full">
									{#if currentQ}
										<div class="text-center">
											<span class="text-xs font-bold uppercase tracking-wider text-primary">
												ข้อที่ {blanksQuestionIdx + 1} / {questions.length}
											</span>
										</div>

										<div class="flex items-center justify-center gap-1 sm:gap-2 py-3 px-2 sm:px-4 bg-base-100 text-base-content border border-base-300 rounded-2xl w-full max-w-lg shadow-inner overflow-x-auto">
											{#each (currentQ.blocks || []) as b}
												{@const isBlank = b.base === currentQ.targetChar}
												<div class="flex flex-col items-center justify-center select-none min-w-[28px] max-w-[44px] flex-1">
													<div class="h-6 sm:h-8 font-black text-xl sm:text-3xl text-primary flex items-center justify-center leading-none">
														{b.upper || ''}
													</div>
													<div
														class="w-full aspect-square max-h-11 sm:max-h-14 rounded-xl border-2 flex items-center justify-center font-black text-base sm:text-2xl transition-all
														{isBlank
															? 'bg-teal-500/10 text-primary border-primary/30 shadow-sm'
															: 'border-base-300 bg-base-100 text-base-content text-base-content'}"
													>
														{isBlank ? '_' : b.base}
													</div>
													<div class="h-6 sm:h-8 font-black text-xl sm:text-3xl text-primary flex items-center justify-center leading-none">
														{b.lower || ''}
													</div>
												</div>
											{/each}
										</div>

										<div class="w-full max-w-2xl">
											{#if !myPlayer?.isSpectator}
												<KeyboardLayout on:type={(e) => handleBlanksType(e.detail)} />
											{:else}
												<div class="p-4 text-center text-xs text-base-content/70 border border-dashed border-base-300 rounded-2xl">
													โหมดผู้เข้าชม (Spectating)
												</div>
											{/if}
										</div>
									{:else}
										<div class="text-center py-8">
											<span class="text-4xl">🌟</span>
											<h3 class="text-xl font-bold text-primary mt-2">ทำครบทุกข้อแล้ว!</h3>
											<p class="text-xs text-base-content/70 mt-1">รอสรุปผลคะแนนประจำรอบ</p>
										</div>
									{/if}
								</div>

							<!-- 3. CROSSROAD GAMEPLAY -->
							{:else if activeRoundData.puzzleType === 'crossroad'}
								<div class="flex flex-col items-center justify-center gap-3 my-auto w-full py-2">
									<div class="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center select-none">
										<div class="botanical-card absolute top-0 inset-x-0 mx-auto w-24 h-14 rounded-2xl bg-base-100 text-base-content border-2 border-primary/30 text-primary flex items-center justify-center font-black text-lg sm:text-xl shadow-lg">
											{currentTopClue || 'ต้น'}
										</div>
										<ArrowDownIcon class="absolute top-16 inset-x-0 mx-auto text-primary animate-bounce" size={20} />

										<div class="botanical-card absolute left-0 inset-y-0 my-auto w-24 h-14 rounded-2xl bg-base-100 text-base-content border-2 border-primary/30 text-primary flex items-center justify-center font-black text-lg sm:text-xl shadow-lg">
											{currentLeftClue || 'ใบ'}
										</div>
										<ArrowRightIcon class="absolute left-24 inset-y-0 my-auto text-primary animate-pulse" size={20} />

										<input
											type="text"
											bind:value={playerInput}
											disabled={crossroadSolved || myPlayer?.isSpectator}
											placeholder={myPlayer?.isSpectator ? 'ผู้ชม' : 'คำตรงกลาง'}
											class="w-28 h-28 rounded-3xl text-center font-black text-2xl sm:text-3xl border-4 transition-all focus:outline-none shadow-2xl z-10
											{crossroadSolved
												? 'border-primary/30 text-primary'
												: crossroadWiggle
													? 'border-rose-500 text-error-content animate-shake'
													: 'border-base-300 focus:border-primary/30'}"
											class:botanical-answer-input={true}
										/>

										<ArrowRightIcon class="absolute right-24 inset-y-0 my-auto text-primary -scale-x-100 animate-pulse" size={20} />
										<div class="botanical-card absolute right-0 inset-y-0 my-auto w-24 h-14 rounded-2xl bg-base-100 text-base-content border-2 border-primary/30 text-primary flex items-center justify-center font-black text-lg sm:text-xl shadow-lg">
											{currentRightClue || 'ดวง'}
										</div>

										<ArrowDownIcon class="absolute bottom-16 inset-x-0 mx-auto text-primary -scale-y-100 animate-bounce" size={20} />
										<div class="botanical-card absolute bottom-0 inset-x-0 mx-auto w-24 h-14 rounded-2xl bg-base-100 text-base-content border-2 border-primary/30 text-primary flex items-center justify-center font-black text-lg sm:text-xl shadow-lg">
											{currentBottomClue || 'ไม้'}
										</div>
									</div>

									<div class="flex items-center gap-2 w-full max-w-sm mt-2">
										<button
											disabled={myPlayer?.isSpectator}
											class="btn btn-secondary btn-md font-bold text-secondary-content gap-1.5 shadow"
											on:click={rerollCrossroadClues}
											title="สลับคำใบ้ทิศทางอื่น"
										>
											<RotateCcwIcon size={16} />
											เปลี่ยนคำใบ้
										</button>

										<button
											class="btn btn-primary btn-md flex-1 font-bold text-primary-content shadow-lg"
											disabled={crossroadSolved || !playerInput.trim() || myPlayer?.isSpectator}
											on:click={handleCrossroadSubmit}
										>
											{crossroadSolved ? '✅ ตอบถูกแล้ว!' : 'ส่งคำตอบ (Enter)'}
										</button>
									</div>
								</div>

							<!-- 4. SPELLING QUIZ GAMEPLAY -->
							{:else if activeRoundData.puzzleType === 'spellingquiz'}
								{@const questions = activeRoundData.payload.questions || []}
								{@const currentQ = questions[spellingQuizIdx]}
								<div class="flex flex-col items-center justify-center gap-6 my-auto w-full">
									{#if currentQ}
										<div class="text-center max-w-md">
											<span class="text-xs font-bold uppercase tracking-wider text-info-content">
												ข้อที่ {spellingQuizIdx + 1} / {questions.length}
											</span>
											<h3 class="text-xl sm:text-2xl font-black text-base-content mt-1">เลือกคำที่สะกดถูกต้องตามพจนานุกรม</h3>
										</div>

										<div class="flex flex-col sm:grid sm:grid-cols-2 gap-4 w-full max-w-2xl">
											<button
												disabled={myPlayer?.isSpectator}
												on:click={() => handleSpellingQuizSide('left')}
												class="bg-base-100 text-base-content hover:bg-base-100 text-base-content border-2 border-base-300 hover:border-info text-base-content rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center gap-2 shadow-2xl transition-all transform hover:scale-105 active:scale-95 relative group cursor-pointer disabled:pointer-events-none"
											>
												<span class="absolute left-4 top-1/2 -translate-y-1/2 hidden md:inline font-mono text-xs text-info-content font-black px-2 py-1 rounded-lg bg-info/10 border border-info/30">
													◀ [1]
												</span>
												<span class="font-black text-3xl sm:text-4xl text-base-content tracking-wide group-hover:text-info-content transition-colors">
													{currentQ.leftOption}
												</span>
											</button>

											<button
												disabled={myPlayer?.isSpectator}
												on:click={() => handleSpellingQuizSide('right')}
												class="bg-base-100 text-base-content hover:bg-base-100 text-base-content border-2 border-base-300 hover:border-info text-base-content rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center gap-2 shadow-2xl transition-all transform hover:scale-105 active:scale-95 relative group cursor-pointer disabled:pointer-events-none"
											>
												<span class="font-black text-3xl sm:text-4xl text-base-content tracking-wide group-hover:text-info-content transition-colors">
													{currentQ.rightOption}
												</span>
												<span class="absolute right-4 top-1/2 -translate-y-1/2 hidden md:inline font-mono text-xs text-info-content font-black px-2 py-1 rounded-lg bg-info/10 border border-info/30">
													[2] ▶
												</span>
											</button>
										</div>
									{:else}
										<div class="text-center py-8">
											<span class="text-4xl">🏆</span>
											<h3 class="text-xl font-bold text-info-content mt-2">ทำครบทุกข้อเรียบร้อย!</h3>
											<p class="text-xs text-base-content/70 mt-1">รอสรุปผลคะแนนประจำรอบ</p>
										</div>
									{/if}
								</div>

							<!-- 5. BOGGLE GAMEPLAY WITH DRAGGABLE LINE -->
							{:else if activeRoundData.puzzleType === 'boggle'}
								{@const payload = activeRoundData.payload}
								<div class="flex flex-col items-center justify-center gap-4 my-auto w-full">
									<div class="h-14 w-full max-w-sm bg-base-100 text-base-content border border-base-300 rounded-2xl flex items-center justify-between px-4">
										<div class="flex items-center gap-2">
											<span class="text-xs font-bold text-base-content/70">คำ:</span>
											<span class="font-black text-2xl text-base-content tracking-widest">{playerInput || '...'}</span>
										</div>
										<button class="btn btn-xs btn-ghost text-base-content/70 hover:text-base-content" on:click={() => { playerInput = ''; boggleSelectedPath = []; }}>
											ลบ
										</button>
									</div>

									{#if payload?.grid}
										<div class="botanical-card relative w-full max-w-[340px] sm:max-w-[380px] aspect-square bg-base-100 text-base-content p-3 rounded-3xl border border-base-300 select-none shadow-2xl overflow-hidden">
											<svg class="absolute inset-0 w-full h-full pointer-events-none z-10 p-3 text-secondary opacity-70" viewBox="0 0 100 100">
												{#if bogglePathSVGData}
													<path
														d={bogglePathSVGData}
														stroke="currentColor"
														stroke-width="5"
														stroke-linecap="round"
														stroke-linejoin="round"
														fill="none"
													/>
												{/if}
											</svg>

											<div class="grid grid-cols-4 grid-rows-4 gap-2 h-full w-full">
												{#each payload.grid as row, r}
													{#each row as cell, c}
														{@const isSelected = boggleSelectedPath.some((p) => p.r === r && p.c === c)}
														{@const isLast = boggleSelectedPath.length > 0 && boggleSelectedPath[boggleSelectedPath.length - 1].r === r && boggleSelectedPath[boggleSelectedPath.length - 1].c === c}
														<!-- svelte-ignore a11y-no-static-element-interactions -->
														<div
															on:mousedown={() => handleBoggleCellStart(r, c)}
															on:mouseenter={() => handleBoggleCellEnter(r, c)}
															on:mouseup={handleBoggleCellEnd}
															on:touchstart|preventDefault={() => handleBoggleCellStart(r, c)}
															on:touchmove|preventDefault={(e) => {
																const touch = e.touches[0];
																const element = document.elementFromPoint(touch.clientX, touch.clientY);
																if (element) {
																	const targetRow = element.getAttribute('data-row');
																	const targetCol = element.getAttribute('data-col');
																	if (targetRow !== null && targetCol !== null) {
																		handleBoggleCellEnter(parseInt(targetRow), parseInt(targetCol));
																	}
																}
															}}
															on:touchend={handleBoggleCellEnd}
															data-row={r}
															data-col={c}
															class="relative flex items-center justify-center rounded-2xl cursor-pointer transition-all duration-150 border active:scale-95 shadow-inner text-2xl sm:text-3xl font-black
															{isLast
																? 'bg-secondary text-secondary-content border-secondary scale-105 shadow-lg shadow-secondary/40 z-20'
																: isSelected
																	? 'bg-secondary/30 text-secondary border-secondary/60 z-10'
																	: 'bg-base-100 text-base-content text-base-content border-base-300 hover:border-secondary/60'}"
														>
															{cell}
														</div>
													{/each}
												{/each}
											</div>
										</div>
									{/if}

									<div class="flex items-center gap-2 w-full max-w-sm">
										<button disabled={myPlayer?.isSpectator} class="btn btn-secondary btn-md flex-1 font-bold text-secondary-content shadow-lg" on:click={handleBoggleSubmit}>
											ส่งคำ (Enter)
										</button>
									</div>

									<div class="flex flex-wrap gap-1.5 justify-center max-w-md max-h-20 overflow-y-auto">
										{#each boggleFound as found}
											<span class="badge badge-secondary badge-sm text-secondary-content font-bold">{found}</span>
										{/each}
									</div>
								</div>

							<!-- 6. WORD LADDER GAMEPLAY -->
							{:else if activeRoundData.puzzleType === 'wordladder'}
								{@const payload = activeRoundData.payload}
								<div class="flex flex-col items-center justify-center gap-4 my-auto w-full py-2">
									<div class="text-center">
										<span class="text-xs font-bold uppercase tracking-wider text-primary">
											เป้าหมาย: แปลงคำจาก "{payload.start}" สู่ "{payload.end}"
										</span>
									</div>

									<div class="flex flex-col items-center gap-2 w-full max-w-md max-h-56 overflow-y-auto p-2 bg-base-100 text-base-content border border-base-300 rounded-3xl">
										{#each ladderChain as stepWord, idx}
											<div class="flex items-center gap-2 w-full justify-center">
												<span class="font-mono text-xs font-bold text-base-content/70 w-6 text-right">#{idx + 1}</span>
												<div class="px-5 py-2 rounded-2xl font-black text-xl tracking-wider text-center flex-1 max-w-[200px] border shadow
													{idx === 0
														? 'bg-emerald-500/20 text-primary border-primary/30'
														: stepWord === payload.end
															? 'bg-amber-400 text-base-content/70 border-amber-400'
															: 'bg-base-100 text-base-content text-base-content border-base-300'}">
													{stepWord}
												</div>
												{#if idx === ladderChain.length - 1 && idx > 0 && !ladderSolved && !myPlayer?.isSpectator}
													<button class="btn btn-xs btn-ghost text-base-content/70 hover:text-error-content" on:click={handleLadderUndo} title="ย้อนกลับ">
														✕
													</button>
												{:else}
													<span class="w-6"></span>
												{/if}
											</div>
										{/each}

										{#if !ladderSolved}
											<div class="flex items-center gap-2 w-full justify-center opacity-60">
												<span class="font-mono text-xs font-bold text-warning-content w-6 text-right">🏁</span>
												<div class="px-5 py-2 rounded-2xl font-black text-xl tracking-wider text-center flex-1 max-w-[200px] bg-base-100 text-base-content border border-dashed border-amber-400/60 text-warning-content">
													{payload.end}
												</div>
												<span class="w-6"></span>
											</div>
										{/if}
									</div>

									{#if !ladderSolved}
										<div class="flex items-center gap-2 w-full max-w-md">
											<input
												type="text"
												bind:value={playerInput}
												disabled={myPlayer?.isSpectator}
												placeholder={myPlayer?.isSpectator ? 'โหมดผู้เข้าชม' : 'พิมพ์คำถัดไป (เปลี่ยน 1 อักษร)...'}
												class="input input-md  flex-1 bg-base-100 text-base-content text-base-content font-bold border-base-300 focus:border-primary/30 text-center text-lg"
												class:botanical-answer-input={true}
											/>
											<button disabled={myPlayer?.isSpectator} class="btn btn-md btn-success text-success-content font-bold shadow-lg" on:click={handleLadderSubmit}>
												ก้าวต่อ (Enter)
											</button>
										</div>
									{:else}
										<div class="text-center py-2">
											<span class="text-3xl">🎉</span>
											<h4 class="font-black text-lg text-primary mt-1">ถึงเป้าหมายแล้ว!</h4>
										</div>
									{/if}
								</div>

							<!-- 7. THAI QUIZ GAMEPLAY (4 CHOICES) -->
							{:else if activeRoundData.puzzleType === 'thaiquiz'}
								{@const questions = activeRoundData.payload.questions || []}
								{@const currentQ = questions[thaiQuizIdx]}
								<div class="flex flex-col items-center justify-center gap-6 my-auto w-full">
									{#if currentQ}
										<div class="text-center max-w-xl">
											<span class="text-xs font-bold uppercase tracking-wider text-warning-content">
												ข้อที่ {thaiQuizIdx + 1} / {questions.length}
											</span>
											<h3 class="text-lg sm:text-2xl font-black text-base-content mt-1 leading-relaxed">{currentQ.question}</h3>
										</div>

										<!-- 4 Choice Grid -->
										<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
											{#each (currentQ.choices || []) as choice, cIdx}
												<button
													disabled={myPlayer?.isSpectator}
													on:click={() => handleThaiQuizChoice(cIdx)}
													class="p-4 rounded-2xl border-2 text-left flex items-center justify-between gap-3 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl group
													bg-base-100 text-base-content border-base-300 text-base-content hover:border-amber-400 hover:bg-base-100 text-base-content"
												>
													<div class="flex items-center gap-2.5">
														<span class="w-6 h-6 rounded-lg bg-base-100 text-base-content border border-base-300 flex items-center justify-center font-mono text-xs font-bold text-base-content/70 group-hover:text-warning-content">
															{['1', '2', '3', '4'][cIdx]}
														</span>
														<span class="font-bold text-sm sm:text-base">{choice}</span>
													</div>
												</button>
											{/each}
										</div>
									{:else}
										<div class="text-center py-8">
											<span class="text-4xl">🏆</span>
											<h3 class="text-xl font-bold text-warning-content mt-2">ทำครบทุกข้อเรียบร้อย!</h3>
											<p class="text-xs text-base-content/70 mt-1">รอสรุปผลคะแนนประจำรอบ</p>
										</div>
									{/if}
								</div>
							{/if}
						</div>
					</div>

					<!-- Live Scoreboard & Opponent Progress (1 col) -->
					<div class="botanical-card bg-base-100 text-base-content backdrop-blur-xl border border-base-300 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col gap-4">
						<div class="flex items-center gap-2 border-b border-base-300 pb-3">
							<AwardIcon size={18} class="text-warning-content" />
							<h4 class="font-extrabold text-base-content text-base">คะแนนสด (Live Match)</h4>
						</div>

						<div class="flex flex-col gap-2.5">
							{#each sortedPlayers.filter(p => !p.isSpectator) as p, idx (p.id)}
								<div class="bg-base-100 text-base-content border {p.id === localPlayer.id ? 'border-primary/30 bg-base-300 text-base-content' : 'border-base-300'} rounded-2xl p-3 flex flex-col gap-2">
									<div class="flex items-center justify-between">
										<div class="flex items-center gap-2">
											<span class="font-mono text-xs font-bold text-base-content/70">#{idx + 1}</span>
											<span class="text-xl">{p.avatar}</span>
											<span class="font-bold text-sm text-base-content line-clamp-1 {p.id === localPlayer.id ? 'text-primary' : ''}">
												{p.name}
											</span>
										</div>
										<span class="font-mono font-black text-warning-content text-sm">{p.score} pt</span>
									</div>

									<div class="w-full bg-base-100 text-base-content rounded-full h-1.5 overflow-hidden">
										<div
											class="bg-gradient-to-r from-base-200 to-base-200 h-1.5 rounded-full transition-all duration-300"
											style="width: {p.progress || 0}%"
										></div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>

		<!-- ========================================================================= -->
		<!-- VIEW 4: MATCH PODIUM & SUMMARY                                            -->
		<!-- ========================================================================= -->
		{:else if currentView === 'podium' && currentRoom}
			<div class="flex flex-col items-center justify-center gap-8 py-8" in:scale={{ duration: 300 }}>
				<div class="text-center flex flex-col items-center gap-2">
					<span class="text-5xl animate-bounce">🏆</span>
					<h2 class="text-3xl sm:text-5xl font-black text-primary">
						การประลองเสร็จสิ้น!
					</h2>
					<p class="text-sm text-base-content/70">ตารางคะแนนรวมและผู้ชนะประจำแมตช์</p>
				</div>

				<div class="flex items-end justify-center gap-3 sm:gap-6 w-full max-w-2xl px-4">
					{#if sortedPlayers.filter(p => !p.isSpectator)[1]}
						{@const p = sortedPlayers.filter(p => !p.isSpectator)[1]}
						<div class="flex flex-col items-center gap-2 flex-1">
							<span class="text-3xl">{p.avatar}</span>
							<span class="font-bold text-sm text-base-content/70 line-clamp-1">{p.name}</span>
							<div class="w-full h-32 rounded-t-2xl bg-base-100 text-base-content border-t-2 border-base-300 flex flex-col items-center justify-center p-2">
								<span class="text-2xl font-black text-base-content/70">2nd</span>
								<span class="font-mono text-xs text-warning-content font-bold">{p.score} pt</span>
							</div>
						</div>
					{/if}

					{#if sortedPlayers.filter(p => !p.isSpectator)[0]}
						{@const p = sortedPlayers.filter(p => !p.isSpectator)[0]}
						<div class="flex flex-col items-center gap-2 flex-1">
							<span class="text-4xl animate-bounce">👑 {p.avatar}</span>
							<span class="font-black text-base text-warning-content line-clamp-1">{p.name}</span>
							<div class="w-full h-44 rounded-t-2xl bg-gradient-to-t from-amber-500/20 to-yellow-500/30 border-t-4 border-amber-400 flex flex-col items-center justify-center p-2 shadow-2xl">
								<span class="text-4xl font-black text-warning-content">1st</span>
								<span class="font-mono text-sm text-warning-content font-black">{p.score} pt</span>
							</div>
						</div>
					{/if}

					{#if sortedPlayers.filter(p => !p.isSpectator)[2]}
						{@const p = sortedPlayers.filter(p => !p.isSpectator)[2]}
						<div class="flex flex-col items-center gap-2 flex-1">
							<span class="text-3xl">{p.avatar}</span>
							<span class="font-bold text-sm text-base-content/70 line-clamp-1">{p.name}</span>
							<div class="w-full h-24 rounded-t-2xl bg-base-100 text-base-content border-t-2 border-amber-700 flex flex-col items-center justify-center p-2">
								<span class="text-xl font-black text-amber-700">3rd</span>
								<span class="font-mono text-xs text-warning-content font-bold">{p.score} pt</span>
							</div>
						</div>
					{/if}
				</div>

				<div class="flex items-center gap-4 mt-4">
					{#if isHostUser}
						<button class="btn btn-primary btn-md gap-2 font-bold text-primary-content shadow-xl" on:click={handleRematch}>
							<RefreshCwIcon size={18} />
							เริ่มแข่งใหม่ (Rematch)
						</button>
					{/if}
					<button class="btn btn-outline btn-md border-base-300 text-base-content/70 hover:bg-base-100 text-base-content" on:click={handleLeaveRoom}>
						กลับสู่หน้าล็อบบี้
					</button>
				</div>
			</div>
		{/if}

	</div>
</div>

<!-- CREATE ROOM MODAL -->
{#if showCreateModal}
	<div class="modal modal-open bg-base-100 text-base-content backdrop-blur-md z-50">
		<div class="botanical-card modal-box bg-base-100 text-base-content border border-base-300 rounded-3xl p-5 sm:p-6 max-w-lg text-base-content shadow-2xl flex flex-col gap-4">
			<div class="flex items-center justify-between border-b border-base-300 pb-2.5">
				<h3 class="text-lg font-black text-base-content flex items-center gap-2">
					<PlusCircleIcon size={18} class="text-primary" />
					สร้างห้องประลองใหม่ (Create Room)
				</h3>
				<button class="btn btn-xs btn-circle btn-ghost" on:click={() => (showCreateModal = false)}>✕</button>
			</div>

			<div class="flex flex-col gap-3.5 text-xs">
				<div class="flex flex-col gap-2">
					<div class="label py-1"><span class="text-sm text-xs text-base-content/70 font-bold">ตั้งค่าด่วน (Room Presets)</span></div>
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
						{#each ROOM_PRESETS as preset}
							<button type="button" class="rounded-xl border border-base-300 bg-base-100 text-base-content p-2 text-left hover:border-primary transition-colors" on:click={() => applyRoomPreset(preset.config)}>
								<strong class="text-base-content text-[11px]">{preset.name}</strong><span class="block text-[9px] text-base-content/70 mt-0.5">{preset.description}</span>
							</button>
						{/each}
					</div>
				</div>
				<div class="flex flex-col gap-2">
					<label for="create-room-name-input" class="label py-1"><span class="text-sm text-xs text-base-content/70 font-bold">ชื่อห้องแข่งขัน</span></label>
					<input
						id="create-room-name-input"
						type="text"
						bind:value={createForm.roomName}
						class="input input-sm  bg-base-100 text-base-content border-base-300 text-base-content font-bold focus:border-primary/30"
						placeholder="เช่น ห้องประลองสุดเดือด"
					/>
				</div>

				<div class="flex flex-col gap-2">
					<div class="label py-1"><span class="text-sm text-xs text-base-content/70 font-bold">รูปแบบการแข่งขัน (Game Mode)</span></div>
					<div class="grid grid-cols-2 gap-2">
						<button
							type="button"
							class="p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all {createForm.mode === 'race' ? 'border-primary bg-primary/20 text-base-content shadow-md' : 'border-base-300 bg-base-100 text-base-content text-base-content/70 hover:border-base-300'}"
							on:click={() => (createForm.mode = 'race')}
						>
							<div class="flex items-center gap-1.5 font-black text-xs text-base-content">
								<span>🏎️</span>
								<span>Race (แข่งความเร็ว)</span>
							</div>
							<span class="text-[10px] text-base-content/70 leading-tight">ตอบให้ได้มากที่สุดในเวลา ทุกคนได้โจทย์ชุดเดียวกัน</span>
						</button>

						<button
							type="button"
							class="p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all {createForm.mode === 'quiz' ? 'border-secondary bg-secondary/20 text-base-content shadow-md' : 'border-base-300 bg-base-100 text-base-content text-base-content/70 hover:border-base-300'}"
							on:click={() => (createForm.mode = 'quiz')}
						>
							<div class="flex items-center gap-1.5 font-black text-xs text-base-content">
								<span>🎯</span>
								<span>Quiz (ชิงคะแนนสด)</span>
							</div>
							<span class="text-[10px] text-base-content/70 leading-tight">ใครตอบถูกคนแรกได้คะแนนข้อนั้นทันที</span>
						</button>
					</div>
				</div>

				<div class="flex flex-col gap-2">
					<div class="label py-1"><span class="text-sm text-xs text-base-content/70 font-bold">เลือกประเภทปริศนา</span></div>
					<div class="grid grid-cols-3 gap-1.5">
						{#each PUZZLE_TYPES as pt}
							<button
								type="button"
								class="p-2 rounded-xl border text-center flex flex-col items-center gap-1 transition-all {createForm.puzzleType === pt.id ? 'border-primary/30 bg-emerald-500/15 text-base-content shadow' : 'border-base-300 bg-base-100 text-base-content text-base-content/70 hover:border-base-300'}"
								on:click={() => (createForm.puzzleType = pt.id)}
							>
								<span class="text-xl">{pt.icon}</span>
								<span class="font-bold text-[11px] text-base-content line-clamp-1">{pt.name}</span>
							</button>
						{/each}
					</div>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div class="flex flex-col gap-2">
						<div class="label py-1"><span class="text-sm text-xs text-base-content/70 font-bold">จำนวนรอบ</span></div>
						<div class="grid grid-cols-3 gap-1">
							{#each [1, 3, 5] as rOption}
								<button
									type="button"
									class="btn btn-sm text-xs font-bold {createForm.rounds === rOption ? 'btn-primary text-primary-content shadow' : 'btn-neutral bg-base-100 text-base-content text-base-content/70 border-base-300'}"
									on:click={() => (createForm.rounds = rOption)}
								>
									{rOption} รอบ
								</button>
							{/each}
						</div>
					</div>

					<div class="flex flex-col gap-2">
						<div class="label py-1"><span class="text-sm text-xs text-base-content/70 font-bold">เวลาต่อรอบ</span></div>
						<div class="grid grid-cols-4 gap-1">
							{#each [30, 45, 60, 90] as tOption}
								<button
									type="button"
									class="btn btn-sm text-xs font-bold {createForm.timePerRound === tOption ? 'btn-primary text-primary-content shadow' : 'btn-neutral bg-base-100 text-base-content text-base-content/70 border-base-300'}"
									on:click={() => (createForm.timePerRound = tOption)}
								>
									{tOption}s
								</button>
							{/each}
						</div>
					</div>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
					<label class="flex flex-col gap-2"><span class="text-sm text-xs text-base-content/70 font-bold mb-1">ระดับความยาก</span><select class="select select-sm  bg-base-100 text-base-content text-base-content border-base-300" bind:value={createForm.difficulty}><option value="easy">ง่าย</option><option value="normal">ปกติ</option><option value="hard">ยาก</option></select></label>
					<label class="flex flex-col gap-2"><span class="text-sm text-xs text-base-content/70 font-bold mb-1">ผู้เล่นสูงสุด</span><select class="select select-sm  bg-base-100 text-base-content text-base-content border-base-300" bind:value={createForm.maxPlayers}><option value={2}>2 คน</option><option value={4}>4 คน</option><option value={8}>8 คน</option><option value={12}>12 คน</option><option value={16}>16 คน</option></select></label>
					<label class="flex flex-col gap-2"><span class="text-sm text-xs text-base-content/70 font-bold mb-1">การมองเห็น</span><select class="select select-sm  bg-base-100 text-base-content text-base-content border-base-300" bind:value={createForm.isPublic}><option value={true}>สาธารณะ</option><option value={false}>ส่วนตัว / Invite</option></select></label>
				</div>

				<div class="rounded-xl bg-base-200 text-base-content border border-base-300 p-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
					<strong>สรุปห้อง:</strong><span>{createForm.mode === 'quiz' ? 'Quiz' : 'Race'}</span><span>{createForm.rounds} รอบ × {createForm.timePerRound} วิ</span><span>{createForm.maxPlayers} คน</span><span>{createForm.difficulty}</span><span>{createForm.isPublic ? 'Public' : 'Private'}</span>
				</div>
			</div>

			<div class="modal-action flex justify-end gap-2 pt-2 border-t border-base-300 mt-2">
				<button class="btn btn-sm btn-ghost" on:click={() => (showCreateModal = false)}>ยกเลิก</button>
				<button
					class="btn btn-sm btn-primary font-bold text-primary-content gap-1.5 shadow-lg"
					disabled={isCreatingRoom}
					on:click={handleCreateRoom}
				>
					{#if isCreatingRoom}
						<span class="loading loading-spinner loading-xs"></span>
					{:else}
						<PlusCircleIcon size={16} />
						สร้างห้องเลย
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
