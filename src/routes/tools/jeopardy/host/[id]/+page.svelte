<script lang="ts">
export let data: any;


	import { onMount, onDestroy } from 'svelte';
	import type { PlayerInfo, GameState } from '#lib/interfaces/jeopardy.js';
	import {
		CheckCircleIcon,
		XCircleIcon,
		LockIcon,
		UnlockIcon,
		RefreshCwIcon,
		UserXIcon
	} from 'svelte-feather-icons';
	import { supabaseClient } from '#lib/supabase.js';
	import CountDownBar from '#lib/components/CountDownBar.svelte';

	let id: string = data.id;
	const channel = supabaseClient.channel('quiz-' + id);

	let answerQueue: string[] = [];
	let logs: string[] = [];
	let kicking: boolean = false;

	let gameState: GameState = {
		round: 1,
		isLocked: true,
		isDouble: false,
		isWagering: false,
		isAnswering: false
	};

	const scoreList: number[] = [200, 400, 600, 800, 1000];
	let scoreIdx: number = 0;
	$: currentScore = scoreList[scoreIdx] * gameState.round;
	let wager: number = 0;

	let playerList: PlayerInfo[] = [];
	let initializing: boolean = true;

	const MAX_ANSWER: number = 5000;
	const MAX_DOUBLE_ANSWER: number = 7000;
	$: maxAnswerTime = gameState.round == 3 ? MAX_DOUBLE_ANSWER : MAX_ANSWER;
	let answerTime: number = 0;
	let answerTimer: any = '';

	function getPlayer(name: string): PlayerInfo {
		for (var p of playerList) {
			if (p.username === name) return p;
		}
		return playerList[0] || { username: name, color: 0, score: 0, wager: 0, answer: '' };
	}

	function addLog(msg: string) {
		logs = [new Date().toLocaleTimeString('th-TH') + ' - ' + msg, ...logs.slice(0, 15)];
	}

	onMount(async () => {
		channel.on('broadcast', { event: 'pushButton' }, (payload) => {
			updateQueue(payload.payload.username);
		});

		channel.on('broadcast', { event: 'submitWager' }, (payload) => {
			if (!gameState.isWagering && !gameState.isDouble) return;
			const { username, wager: pWager } = payload.payload.playerInfo;
			const p = getPlayer(username);
			if (p) p.wager = parseInt(pWager);
			playerList = playerList;
			addLog(`${username} wagered ${pWager}`);
		});

		channel.on('broadcast', { event: 'submitAnswer' }, (payload) => {
			const { playerInfo } = payload.payload;
			if (playerInfo) {
				const { username, answer } = playerInfo;
				const p = getPlayer(username);
				if (p) p.answer = answer;
				playerList = playerList;
				addLog(`${username} submitted answer`);
			}
		});

		channel.on('broadcast', { event: 'playerJoin' }, (payload) => {
			const newUsername = payload.payload.info.username;
			const dupe = playerList.some((p) => p.username == newUsername);
			if (!dupe) {
				playerList = [...playerList, payload.payload.info];
				addLog(newUsername + ' joined');
			} else {
				addLog(newUsername + ' rejoined');
			}

			channel.send({
				type: 'broadcast',
				event: 'sharePlayerList',
				payload: { playerList }
			});

			updateGameState();
		});

		channel.on('broadcast', { event: 'playerLeave' }, (payload) => {
			const leftPlayerUsername = payload.payload.username;
			addLog(leftPlayerUsername + ' disconnected');
		});

		channel.on('broadcast', { event: 'resendPlayerList' }, () => {
			channel.send({
				type: 'broadcast',
				event: 'sharePlayerList',
				payload: { playerList }
			});
		});

		subscribe();
	});

	function subscribe() {
		if (channel.state === 'joined') return;
		channel.subscribe((status) => {
			if (status === 'SUBSCRIBED') {
				channel.send({
					type: 'broadcast',
					event: 'hostReconnect'
				});
				initializing = false;
			}
		});
	}

	function toggleLockButton() {
		gameState.isLocked = !gameState.isLocked;
		if (!gameState.isLocked) {
			resetAnswerTimer();
		}
		channel.send({
			type: 'broadcast',
			event: 'toggleLockButton',
			payload: { isLocked: gameState.isLocked }
		});
	}

	function resetButton() {
		answerQueue = [];
		gameState.isLocked = true;
		gameState.isDouble = false;
		resetAnswerTimer();
		channel.send({
			type: 'broadcast',
			event: 'resetButton',
			payload: {}
		});
	}

	function resetAnswerTimer() {
		clearInterval(answerTimer);
		answerTime = 0;
	}

	function correctAnswer() {
		if (answerQueue.length == 0) return;
		const p = getPlayer(answerQueue[0]);
		const s = wager != 0 ? wager : currentScore;
		wager = 0;
		updateScore(s, p.username);
		resetButton();
	}

	function wrongAnswer() {
		if (answerQueue.length == 0) return;
		resetAnswerTimer();
		const q = answerQueue.shift() || '';
		const p = getPlayer(q);
		const s = wager != 0 ? wager : currentScore;
		wager = 0;
		updateScore(-s, p.username);
		answerQueue = answerQueue;
		if (!gameState.isDouble) {
			toggleLockButton();
		} else {
			resetButton();
		}
	}

	function updateScore(s: number, targetUsername: string) {
		addLog(
			(s > 0 ? '✅ ' : s < 0 ? '❌ ' : '') + targetUsername + ' score change: ' + (s > 0 ? '+' : '') + s
		);

		const p = getPlayer(targetUsername);
		if (p) {
			p.score += s;
			p.wager = 0;
			p.answer = '';
		}
		playerList = playerList;

		channel.send({
			type: 'broadcast',
			event: 'updateScore',
			payload: { score: s, username: targetUsername }
		});

		if (gameState.isDouble) {
			gameState.isDouble = false;
		}
	}

	function adjustScoreManual(targetUsername: string, delta: number) {
		updateScore(delta, targetUsername);
	}

	function updateQueue(u: string) {
		addLog(u + ' pressed button');
		if (answerQueue.length > 0) return;
		if (kicking) {
			playerList = playerList.filter((p) => p.username != u);
			addLog(u + ' was kicked');
			channel.send({
				type: 'broadcast',
				event: 'playerLeave',
				payload: { username: u }
			});
			kicking = false;
			return;
		}

		resetAnswerTimer();
		gameState.isLocked = true;
		answerTime = maxAnswerTime;
		answerTimer = setInterval(() => {
			answerTime -= 100;
			if (answerTime <= 0) {
				resetAnswerTimer();
				gameState.isLocked = false;
				channel.send({
					type: 'broadcast',
					event: 'toggleLockButton',
					payload: { isLocked: false }
				});
			}
		}, 100);

		answerQueue = [...answerQueue, u];

		channel.send({
			type: 'broadcast',
			event: 'updateQueue',
			payload: { username: u }
		});
	}

	function updateRound(r: number) {
		gameState.round = r;
		if (r == 3) {
			gameState.isAnswering = true;
			gameState.isWagering = true;
		} else {
			gameState.isAnswering = false;
			gameState.isWagering = false;
		}
		updateGameState();
	}

	function updateGameState() {
		channel.send({
			type: 'broadcast',
			event: 'updateGameState',
			payload: { gameState }
		});
	}

	onDestroy(() => {
		supabaseClient.removeChannel(channel);
	});

$: ({ id } = data);
</script>

<svelte:head>
	<title>Jeopardy Host | Room {id}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl flex flex-col gap-6">
	<!-- Top Bar -->
	<div class="flex flex-wrap items-center justify-between bg-base-200 p-4 rounded-xl gap-4 border border-base-content/10">
		<div>
			<h1 class="text-2xl font-bold">Jeopardy Host Control</h1>
			<p class="text-xs text-base-content/60">Room ID: <span class="font-mono text-primary font-bold">{id}</span></p>
		</div>

		<!-- Round Controls -->
		<div class="flex items-center gap-2">
			<span class="text-sm font-bold">Round:</span>
			<button class="btn btn-xs" class:btn-primary={gameState.round === 1} on:click={() => updateRound(1)}>1</button>
			<button class="btn btn-xs" class:btn-primary={gameState.round === 2} on:click={() => updateRound(2)}>2</button>
			<button class="btn btn-xs" class:btn-primary={gameState.round === 3} on:click={() => updateRound(3)}>Final</button>
		</div>

		<!-- Lock/Unlock & Reset -->
		<div class="flex gap-2">
			<button
				class="btn btn-sm gap-2"
				class:btn-error={gameState.isLocked}
				class:btn-success={!gameState.isLocked}
				on:click={toggleLockButton}
			>
				{#if gameState.isLocked}
					<LockIcon size="18" /> Locked
				{:else}
					<UnlockIcon size="18" /> Open!
				{/if}
			</button>

			<button class="btn btn-sm btn-outline btn-warning gap-1" on:click={resetButton}>
				<RefreshCwIcon size="18" /> Reset
			</button>
		</div>
	</div>

	<!-- Score Value Selector -->
	<div class="card bg-base-200 p-4 border border-base-content/10">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div class="text-sm font-bold">Base Question Value:</div>
			<div class="join gap-1">
				{#each scoreList as val, i}
					<button
						class="join-item btn btn-sm"
						class:btn-amber-400={scoreIdx === i}
						class:btn-primary={scoreIdx === i}
						on:click={() => (scoreIdx = i)}
					>
						${val * gameState.round}
					</button>
				{/each}
			</div>

			<!-- Wager override -->
			<div class="flex items-center gap-2">
				<span class="text-xs">Wager Override:</span>
				<input
					type="number"
					bind:value={wager}
					placeholder="Custom"
					class="input input-xs  w-24 text-center font-bold"
				/>
			</div>
		</div>
	</div>

	<!-- Timer & Queue Display -->
	<CountDownBar {answerTime} {maxAnswerTime} />

	{#if answerQueue.length > 0}
		<div class="card bg-amber-500/10 border border-amber-500/30 p-6 text-center">
			<div class="text-lg font-bold text-warning-content mb-2">Buzzed In:</div>
			<div class="text-4xl font-extrabold text-base-content mb-4">
				{answerQueue[0]}
			</div>
			<div class="flex justify-center gap-4">
				<button class="btn btn-lg btn-success gap-2 px-8" on:click={correctAnswer}>
					<CheckCircleIcon size="28" /> Correct (+${wager || currentScore})
				</button>
				<button class="btn btn-lg btn-error gap-2 px-8" on:click={wrongAnswer}>
					<XCircleIcon size="28" /> Wrong (-${wager || currentScore})
				</button>
			</div>
		</div>
	{/if}

	<!-- Leaderboard & Scoring Grid -->
	<div class="card bg-base-200 p-6 border border-base-content/10">
		<h2 class="text-xl font-bold mb-4 flex items-center justify-between">
			<span>Players & Scoring Sync</span>
			<button class="btn btn-xs btn-ghost text-error-content gap-1" on:click={() => (kicking = !kicking)}>
				<UserXIcon size="14" /> {kicking ? 'Click player to kick' : 'Kick Player'}
			</button>
		</h2>

		{#if initializing}
			<div class="text-center py-6 text-warning-content">Connecting to room channel...</div>
		{:else if playerList.length === 0}
			<div class="text-center py-6 text-base-content/60">No players connected yet.</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each playerList as p}
					<div class="card bg-base-300 p-4 flex flex-col gap-3 border border-base-content/5">
						<div class="flex items-center justify-between">
							<div class="font-bold text-lg">{p.username}</div>
							<div class="text-2xl font-extrabold text-primary">${p.score}</div>
						</div>

						{#if p.wager > 0}
							<div class="text-xs text-warning-content">Wager: ${p.wager}</div>
						{/if}
						{#if p.answer}
							<div class="text-xs text-success-content">Answer: "{p.answer}"</div>
						{/if}

						<!-- Manual Score Adjustment Buttons -->
						<div class="flex items-center gap-1 justify-end">
							<button class="btn btn-xs btn-outline btn-success" on:click={() => adjustScoreManual(p.username, currentScore)}>
								+${currentScore}
							</button>
							<button class="btn btn-xs btn-outline btn-error" on:click={() => adjustScoreManual(p.username, -currentScore)}>
								-${currentScore}
							</button>
							<button class="btn btn-xs btn-outline btn-info" on:click={() => adjustScoreManual(p.username, 100)}>
								+$100
							</button>
							<button class="btn btn-xs btn-outline btn-warning" on:click={() => adjustScoreManual(p.username, -100)}>
								-$100
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Activity Log -->
	<div class="card bg-base-200 p-4 border border-base-content/10 text-xs font-mono">
		<div class="font-bold text-sm text-base-content/70 mb-2">Live Activity Log</div>
		<div class="h-32 overflow-y-auto space-y-1">
			{#each logs as log}
				<div class="text-base-content/80">{log}</div>
			{/each}
		</div>
	</div>
</div>
