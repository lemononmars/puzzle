<script lang="ts">
export let data: any;


	import { onMount, onDestroy } from 'svelte';
	import type { PlayerInfo, GameState } from '#lib/interfaces/jeopardy.js';
	import { supabaseClient } from '#lib/supabase.js';
	import CountDownBar from '#lib/components/CountDownBar.svelte';

	let id: string = data.id;
	const channel = supabaseClient.channel('quiz-' + id);

	let answerQueue: string[] = [];
	let playerList: PlayerInfo[] = [];
	let gameState: GameState = {
		round: 1,
		isLocked: false,
		isDouble: false,
		isWagering: false,
		isAnswering: false
	};

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

	onMount(async () => {
		channel.on('broadcast', { event: 'playerJoin' }, (payload) => {
			const newUsername = payload.payload.info.username;
			const dupe = playerList.some((p) => p.username == newUsername);
			if (!dupe) {
				playerList = [...playerList, payload.payload.info];
			}
		});

		channel.on('broadcast', { event: 'playerLeave' }, (payload) => {
			const leftUsername = payload.payload.username;
			playerList = playerList.filter((p) => p.username !== leftUsername);
		});

		channel.on('broadcast', { event: 'updateScore' }, (payload) => {
			const { score, username: targetUser } = payload.payload;
			const p = getPlayer(targetUser);
			if (p) p.score += parseInt(score);
			playerList = playerList;

			clearInterval(answerTimer);
			answerTime = 0;

			if (answerQueue.length > 0) {
				answerQueue.shift();
				answerQueue = answerQueue;
			}
		});

		channel.on('broadcast', { event: 'updateQueue' }, (payload) => {
			const u = payload.payload.username;
			answerQueue = [...answerQueue, u];

			answerTime = maxAnswerTime;
			clearInterval(answerTimer);
			answerTimer = setInterval(() => {
				answerTime -= 100;
				if (answerTime <= 0) {
					clearInterval(answerTimer);
					answerTime = 0;
				}
			}, 100);
		});

		channel.on('broadcast', { event: 'updateGameState' }, (payload) => {
			gameState = payload.payload.gameState;
		});

		channel.on('broadcast', { event: 'sharePlayerList' }, (payload) => {
			playerList = payload.payload.playerList;
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
			}
		});
	}

	onDestroy(() => {
		supabaseClient.removeChannel(channel);
	});

$: ({ id } = data);
</script>

<svelte:head>
	<title>Jeopardy Audience | Room {id}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-5xl flex flex-col items-center gap-8">
	<!-- Title Header -->
	<div class="text-center">
		<h1 class="text-3xl sm:text-5xl font-black tracking-tight text-primary bg-gradient-to-r from-amber-400 to-red-500">
			Jeopardy Scoreboard
		</h1>
		<p class="text-sm text-base-content/60 mt-1">Live Room ID: <span class="font-mono font-bold text-warning-content">{id}</span></p>
	</div>

	<!-- Buzzed-in Queue Display -->
	{#if answerQueue.length > 0}
		<div class="card bg-amber-500/10 border-2 border-amber-500/40 p-6 w-full text-center shadow-2xl">
			<div class="text-sm font-bold uppercase tracking-wider text-warning-content mb-1">Active Player</div>
			<div class="text-4xl sm:text-6xl font-extrabold text-base-content mb-2">
				{answerQueue[0]}
			</div>
			<CountDownBar {answerTime} {maxAnswerTime} />
		</div>
	{/if}

	<!-- Live Scoreboard -->
	<div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
		{#each playerList as p}
			<div class="card bg-base-200 border border-base-content/10 shadow-xl p-6 flex flex-col items-center justify-between text-center transition-all hover:scale-105">
				<div class="text-xl sm:text-2xl font-bold mb-2">{p.username}</div>
				<div class="text-4xl sm:text-5xl font-black text-warning-content my-2">${p.score}</div>
				{#if p.wager > 0}
					<div class="badge badge-warning text-xs">Wager: ${p.wager}</div>
				{/if}
				{#if p.answer}
					<div class="text-xs text-success-content mt-2 italic">"{p.answer}"</div>
				{/if}
			</div>
		{:else}
			<div class="col-span-full card bg-base-200 p-12 text-center text-xl text-base-content/60">
				Waiting for players to join Room {id}...
			</div>
		{/each}
	</div>
</div>
