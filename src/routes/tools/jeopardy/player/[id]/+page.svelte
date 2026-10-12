<script lang="ts">
export let data: any;


	import { onMount, onDestroy } from 'svelte';
	import type { PlayerInfo, GameState } from '#lib/interfaces/jeopardy.js';
	import { supabaseClient } from '#lib/supabase.js';
	import { username, storeGameState, storeMyInfo } from '#lib/store/index.js';

	let id: string = data.id;
	const channel = supabaseClient.channel('quiz-' + id);

	let myInfo: PlayerInfo = $storeMyInfo !== ''
		? JSON.parse($storeMyInfo)
		: { username: 'Player', color: 0, score: 0, wager: 0, answer: '' };

	let gameState: GameState = $storeGameState !== ''
		? JSON.parse($storeGameState)
		: { round: 1, isLocked: true, isDouble: false, isWagering: false, isAnswering: false };

	let isLoggedIn: boolean = false;
	let isPushed: boolean = false;
	let pushable: boolean = true;
	let answerQueue: string[] = [];
	let currentWager: number = 0;
	let currentAnswer: string = '';

	let statusText: string = 'READY';
	const MAX_PENALTY: number = 250;
	const MAX_ANSWER: number = 5000;
	const MAX_DOUBLE_ANSWER: number = 7000;
	$: maxAnswerTime = gameState.round == 3 ? MAX_DOUBLE_ANSWER : MAX_ANSWER;
	let penaltyTime: number = 0;
	let penaltyTimer: any = '';
	let answerTime: number = 0;
	let answerTimer: any = '';

	function getPlayer(name: string): PlayerInfo {
		for (var p of playerList) {
			if (p.username === name) return p;
		}
		return playerList[0] || { username: name, color: 0, score: 0, wager: 0, answer: '' };
	}

	function updateStatusText() {
		if (gameState.isLocked) statusText = 'LOCK';
		else if (answerQueue.length == 0) {
			if (!pushable) statusText = 'Wait...';
			else statusText = 'READY';
		} else if (answerQueue[0] === myInfo.username) statusText = 'ANSWER!';
		else statusText = answerQueue[0];
	}

	let playerList: PlayerInfo[] = [];
	let newUsername: string = myInfo.username !== 'Player' ? myInfo.username : $username !== 'code breaker' ? $username : '';

	onMount(async () => {
		channel.on('broadcast', { event: 'toggleLockButton' }, (payload) => {
			gameState.isLocked = payload.payload.isLocked;
			updateStatusText();
		});

		channel.on('broadcast', { event: 'resetButton' }, () => {
			resetQuestion();
		});

		channel.on('broadcast', { event: 'updateScore' }, (payload) => {
			const { score, username: targetUser } = payload.payload;
			const p = getPlayer(targetUser);
			if (p) p.score += parseInt(score);
			playerList = playerList;

			if (targetUser === myInfo.username) {
				myInfo.score = (p ? p.score : myInfo.score);
				$storeMyInfo = JSON.stringify(myInfo);
				resetTimer();
			}

			if (gameState.isDouble || score > 0) {
				resetQuestion();
			} else {
				if (targetUser !== myInfo.username) pushable = true;
				answerQueue.shift();
				answerQueue = answerQueue;
				updateStatusText();
			}
		});

		channel.on('broadcast', { event: 'updateQueue' }, (payload) => {
			pushable = false;
			const u = payload.payload.username;
			answerQueue = [...answerQueue, u];
			if (u === myInfo.username) {
				isPushed = true;
				answerTime = maxAnswerTime;
				answerTimer = setInterval(() => {
					answerTime -= 100;
					if (answerTime <= 0) {
						resetTimer();
					}
				}, 100);
			}
			updateStatusText();
		});

		channel.on('broadcast', { event: 'updateGameState' }, (payload) => {
			gameState = payload.payload.gameState;
			$storeGameState = JSON.stringify(gameState);
			updateStatusText();
		});

		channel.on('broadcast', { event: 'sharePlayerList' }, (payload) => {
			playerList = payload.payload.playerList;
			for (var p of playerList) {
				if (p.username === myInfo.username) {
					myInfo = p;
					$storeMyInfo = JSON.stringify(myInfo);
				}
			}
		});

		channel.on('broadcast', { event: 'playerJoin' }, (payload) => {
			const joinedUsername = payload.payload.info.username;
			const dupe = playerList.some((p) => p.username == joinedUsername);
			if (dupe) return;

			playerList.push(payload.payload.info);
			playerList = playerList;
		});

		channel.on('broadcast', { event: 'playerLeave' }, (payload) => {
			const leftUsername = payload.payload.username;
			playerList = playerList.filter((p) => p.username !== leftUsername);
		});

		subscribe();
	});

	function subscribe() {
		if (channel.state === 'joined') return;
		channel.subscribe((status) => {
			if (status === 'SUBSCRIBED' && isLoggedIn) {
				channel.send({
					type: 'broadcast',
					event: 'playerJoin',
					payload: { info: myInfo }
				});
			}
		});
	}

	function login() {
		if (!newUsername.trim()) return;
		myInfo = {
			username: newUsername,
			color: 0,
			score: 0,
			wager: 0,
			answer: ''
		};
		$username = newUsername;
		$storeMyInfo = JSON.stringify(myInfo);

		channel.subscribe((status) => {
			if (status !== 'SUBSCRIBED') return null;

			channel.send({
				type: 'broadcast',
				event: 'playerJoin',
				payload: { info: myInfo }
			});
		});

		isLoggedIn = true;
		playerList.push(myInfo);
		playerList = playerList;
	}

	function pushButton() {
		if (isPushed || !pushable) return;

		if (gameState.isLocked) {
			penaltyTime = MAX_PENALTY;
			penaltyTimer = setInterval(() => (penaltyTime -= 10), 10);
			setTimeout(() => {
				clearInterval(penaltyTimer);
				penaltyTime = 0;
			}, MAX_PENALTY);
			return;
		} else {
			isPushed = true;
			answerTime = maxAnswerTime;
			answerTimer = setInterval(() => (answerTime -= 100), 100);
			setTimeout(() => {
				clearInterval(answerTimer);
				answerTime = 0;
			}, maxAnswerTime);
		}

		channel.send({
			type: 'broadcast',
			event: 'pushButton',
			payload: { username: myInfo.username }
		});
	}

	function submitWager() {
		myInfo.wager = currentWager;
		channel.send({
			type: 'broadcast',
			event: 'submitWager',
			payload: { playerInfo: myInfo }
		});
	}

	function submitAnswer() {
		myInfo.answer = currentAnswer;
		channel.send({
			type: 'broadcast',
			event: 'submitAnswer',
			payload: { playerInfo: myInfo }
		});
	}

	function resetTimer() {
		clearInterval(answerTimer);
		clearInterval(penaltyTimer);
		answerTime = 0;
		penaltyTime = 0;
	}

	function resetQuestion() {
		isPushed = false;
		pushable = true;
		gameState.isLocked = true;
		gameState.isDouble = false;
		answerQueue = [];
		resetTimer();
		updateStatusText();
	}

	onDestroy(() => {
		channel.send({
			type: 'broadcast',
			event: 'playerLeave',
			payload: { username: myInfo.username }
		});
		supabaseClient.removeChannel(channel);
		isLoggedIn = false;
	});

$: ({ id } = data);
</script>

<svelte:head>
	<title>Jeopardy Player | Room {id}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-lg flex flex-col items-center gap-y-6">
	{#if isLoggedIn}
		<!-- Header / Player Badge -->
		<div class="flex items-center justify-between w-full bg-base-200 p-4 rounded-xl border border-base-content/10">
			<div>
				<div class="text-xs text-base-content/60">Room: {id}</div>
				<div class="text-xl font-bold">{myInfo.username}</div>
			</div>
			<div class="text-2xl font-extrabold text-primary">${myInfo.score}</div>
		</div>

		<!-- Wager Form -->
		{#if gameState.isWagering}
			<div class="card bg-amber-500/10 border border-amber-500/30 p-6 w-full text-center">
				<h3 class="text-lg font-bold text-warning-content mb-2">Submit Wager / เดิมพันคะแนน</h3>
				<input
					type="number"
					bind:value={currentWager}
					placeholder="Score Wager"
					class="input  text-center text-xl font-bold w-full mb-4"
				/>
				<button class="btn btn-warning btn-block" on:click={submitWager}>Send Wager</button>
			</div>
		{/if}

		<!-- Answer Form -->
		{#if gameState.isAnswering}
			<div class="card bg-info/10 border border-info/30 p-6 w-full text-center">
				<h3 class="text-lg font-bold text-info-content mb-2">Submit Answer / พิมพ์คำตอบ</h3>
				<input
					type="text"
					bind:value={currentAnswer}
					placeholder="Your Answer..."
					class="input  text-center text-lg w-full mb-4"
				/>
				<button class="btn btn-info btn-block" on:click={submitAnswer}>Send Answer</button>
			</div>
		{/if}

		<!-- Buzzer Button -->
		<div class="flex flex-col items-center justify-center my-4 w-full">
			{#if penaltyTime > 0}
				<div
					class="radial-progress bg-error text-error-content border-4 border-error w-56 h-56 text-3xl font-bold flex items-center justify-center"
					style="--value:{(penaltyTime * 100) / MAX_PENALTY};"
				>
					PENALTY
				</div>
			{:else if answerTime > 0}
				<div
					class="radial-progress bg-success text-success-content border-4 border-success w-56 h-56 text-3xl font-bold flex items-center justify-center"
					style="--value:{(answerTime * 100) / maxAnswerTime};"
				>
					{Math.floor(answerTime / 1000)}.{((answerTime / 100) % 10)} s
				</div>
			{:else}
				<button
					class="btn btn-circle w-56 h-56 text-3xl font-extrabold shadow-2xl transition-all active:scale-95"
					class:btn-ghost={gameState.isLocked || (isPushed && !pushable)}
					class:btn-outline={gameState.isLocked || !pushable}
					class:btn-warning={isPushed}
					class:btn-success={pushable && !isPushed && !gameState.isLocked}
					on:click={pushButton}
				>
					{statusText}
				</button>
			{/if}
		</div>

		<!-- Live Leaderboard -->
		<div class="card bg-base-200 p-4 border border-base-content/10 w-full">
			<div class="text-sm font-bold mb-3 text-center">Score Board</div>
			<div class="grid grid-cols-1 gap-2">
				{#each playerList as p}
					<div class="flex items-center justify-between bg-base-300 px-4 py-2 rounded-lg">
						<span class="font-medium">{p.username}</span>
						<span class="font-bold text-primary">${p.score}</span>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<!-- Login -->
		<div class="card bg-base-200 shadow-xl border border-base-content/10 w-full">
			<div class="card-body items-center text-center p-8">
				<h2 class="card-title text-2xl font-bold mb-2">Jeopardy Player</h2>
				<p class="text-xs text-base-content/60 mb-4">Joining Room: {id}</p>
				<input
					class="input  text-2xl w-full text-center mb-6"
					type="text"
					placeholder="Username"
					bind:value={newUsername}
					on:keydown={(e) => e.key === 'Enter' && login()}
				/>
				<button class="btn btn-success btn-block text-lg" on:click={login}>Join Room</button>
			</div>
		</div>
	{/if}
</div>
