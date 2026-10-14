<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	interface Puzzle {
		imageSrc: string;
		solution: string;
		topic: string;
		rows: number;
		cols: number;
	}

	let puzzles: Puzzle[] = [
		{ imageSrc: '', solution: '', topic: '', rows: 5, cols: 5 }
	];
	let currentPuzzleIndex = 0;

	let cells: boolean[] = [];
	let setupMode = true;
	let isCorrect = false;
	let revealedAll = false;
	let guesses: { text: string; correct: boolean; player?: string }[] = [];
	type TurnState = 'SELECTING' | 'GUESSING';
	let turnState: TurnState = 'SELECTING';
	let isFullscreen = false;
	let imageAspectRatio = 16 / 9;
	let containerWidth = 0;
	let containerHeight = 0;
	let panelsRevealedAtSolve = 0;

	$: currentPuzzle = puzzles[currentPuzzleIndex] || puzzles[0];
	$: imageSrc = currentPuzzle.imageSrc;
	$: solution = currentPuzzle.solution;
	$: topic = currentPuzzle.topic;
	$: rows = currentPuzzle.rows;
	$: cols = currentPuzzle.cols;

	$: availableHeight = containerHeight - 160;
	$: panelWidth = Math.min(containerWidth - 40, availableHeight * imageAspectRatio);
	$: panelHeight = panelWidth / imageAspectRatio;

	let players: { name: string; score: number }[] = [
		{ name: 'Player 1', score: 0 },
		{ name: 'Player 2', score: 0 }
	];
	let currentPlayerIndex = 0;
	const playerColors = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316'];

	function addPlayer() {
		players = [...players, { name: `Player ${players.length + 1}`, score: 0 }];
	}

	function removePlayer(index: number) {
		if (players.length > 1) {
			players = players.filter((_, i) => i !== index);
			if (currentPlayerIndex >= players.length) {
				currentPlayerIndex = 0;
			}
		}
	}

	function randomizePlayers() {
		players = [...players].sort(() => Math.random() - 0.5);
		currentPlayerIndex = 0;
	}

	function nextTurn() {
		currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
	}

	function addPuzzle() {
		puzzles = [...puzzles, { imageSrc: '', solution: '', topic: '', rows: 5, cols: 5 }];
	}

	function removePuzzle(index: number) {
		if (puzzles.length > 1) {
			puzzles = puzzles.filter((_, i) => i !== index);
		}
	}

	function handleImageUpload(event: Event, index: number) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			const reader = new FileReader();
			reader.onload = (e) => {
				puzzles[index].imageSrc = e.target?.result as string;
				puzzles = [...puzzles];
			};
			reader.readAsDataURL(target.files[0]);
		}
	}

	function handleImageLoad(e: Event) {
		const img = e.currentTarget as HTMLImageElement;
		imageAspectRatio = img.naturalWidth / img.naturalHeight;
	}

	function startSetup() {
		setupMode = true;
		showResults = false;
		revealedAll = false;
		isCorrect = false;
		guesses = [];
		players = players.map(p => ({ ...p, score: 0 }));
		sessionStats = [];
		currentPuzzleIndex = 0;
	}

	let showResults = false;
	let sessionStats: { topic: string; solution: string; revealedCount: number; totalCount: number; winner?: string }[] = [];

	function startGame() {
		const invalid = puzzles.find(p => !p.imageSrc);
		if (invalid) {
			alert('All puzzles must have an image!');
			return;
		}

		sessionStats = [];
		currentPuzzleIndex = 0;
		initPuzzle();
		setupMode = false;
		showResults = false;
		currentPlayerIndex = 0;

		// Default to fullscreen
		setTimeout(() => {
			const elem = document.getElementById('game-board-container');
			if (elem && !document.fullscreenElement) {
				elem.requestFullscreen().catch(() => {});
			}
		}, 300);
	}

	function initPuzzle(p?: Puzzle) {
		const r = p ? p.rows : rows;
		const c = p ? p.cols : cols;
		cells = new Array(r * c).fill(true);
		revealedAll = false;
		isCorrect = false;
		guesses = [];
		panelsRevealedAtSolve = 0;
		turnState = 'SELECTING';
	}

	function nextPuzzle() {
		// Record stats before moving
		// If not correct yet, record current revealed count
		if (!isCorrect) {
			panelsRevealedAtSolve = cells.filter(c => !c).length;
		}

		const lastGuess = guesses.find(g => g.correct);
		sessionStats = [...sessionStats, {
			topic: topic || solution,
			solution: solution,
			revealedCount: panelsRevealedAtSolve,
			totalCount: cells.length,
			winner: lastGuess?.player || 'Manual Reveal'
		}];

		if (currentPuzzleIndex < puzzles.length - 1) {
			currentPuzzleIndex++;
			// Explicitly pass the next puzzle to avoid reactive lag
			initPuzzle(puzzles[currentPuzzleIndex]);
		} else {
			showResults = true;
			if (document.fullscreenElement) {
				document.exitFullscreen();
			}
		}
	}

	function toggleCell(index: number) {
		if (revealedAll || !cells[index]) return;

		// If already correct, just reveal the tile manually
		if (isCorrect) {
			cells[index] = false;
			// If all tiles are now revealed manually, update revealedAll
			if (cells.every(c => !c)) revealedAll = true;
			return;
		}

		if (turnState === 'SELECTING') {
			cells[index] = false;
			turnState = 'GUESSING';
		} else if (turnState === 'GUESSING') {
			nextTurn();
			cells[index] = false;
		}
	}

	function submitGuess(correct: boolean) {
		if (correct) {
			isCorrect = true;
			panelsRevealedAtSolve = cells.filter(c => !c).length;
			const points = Math.max(1, 25 - (5 * panelsRevealedAtSolve));
			players[currentPlayerIndex].score += points;
			// Record winner for stats
			guesses = [{ text: 'Solved', correct: true, player: players[currentPlayerIndex].name }];
			playSound('https://www.soundjay.com/buttons/sounds/button-3.mp3');
		} else {
			// "Wrong" button
			playSound('https://www.soundjay.com/buttons/sounds/button-10.mp3');
			nextTurn();
			turnState = 'SELECTING';
		}
	}

	function playSound(url: string) {
		const audio = new Audio(url);
		audio.play().catch(e => console.error('Audio play failed:', e));
	}

	function resetGame() {
		cells = cells.map(() => true);
		guesses = [];
		isCorrect = false;
		revealedAll = false;
		currentPlayerIndex = 0;
	}

	function revealAll() {
		revealedAll = true;
		cells = cells.map(() => false);
	}

	function toggleFullscreen() {
		const elem = document.getElementById('game-board-container');
		if (!elem) return;

		if (!document.fullscreenElement) {
			elem.requestFullscreen().catch(err => {
				alert(`Error attempting to enable full-screen mode: ${err.message}`);
			});
			isFullscreen = true;
		} else {
			document.exitFullscreen();
			isFullscreen = false;
		}
	}

	onMount(() => {
		const handleFsChange = () => {
			isFullscreen = !!document.fullscreenElement;
		};
		document.addEventListener('fullscreenchange', handleFsChange);
		return () => document.removeEventListener('fullscreenchange', handleFsChange);
	});
</script>

<svelte:head>
	<title>Jigsaw Quiz | Code Breaker</title>
	<meta
		name="description"
		content="Play the ultimate interactive Jigsaw Quiz game. Select tiles to reveal clues and guess the mystery image in this game master console presentation."
	/>
	<meta property="og:title" content="Jigsaw Quiz" />
	<meta
		property="og:description"
		content="Play the ultimate interactive Jigsaw Quiz game. Select tiles to reveal clues and guess the mystery image in this game master console presentation."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/og-jigsaw-quiz.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="/og-jigsaw-quiz.png" />
</svelte:head>

<div class="min-h-screen bg-base-200 p-4 lg:p-8">
	<div class="max-w-5xl mx-auto space-y-8">
		<header class="text-center space-y-2">
			<h1 class="text-3xl font-black tracking-tight text-primary uppercase italic">
				Jigsaw Quiz
			</h1>
		</header>

		{#if showResults}
			<div class="card glass-panel shadow-2xl max-w-4xl mx-auto overflow-hidden animate-in zoom-in duration-500" in:fade>
				<div class="card-body items-center text-center space-y-8 p-12">
					<header>
						<span class="text-sm font-black uppercase tracking-[0.3em] opacity-40">Session Complete</span>
						<h2 class="text-6xl font-black text-primary uppercase italic">Final Results</h2>
					</header>

					<!-- Winner Announcement -->
					<div class="w-full max-w-2xl p-8 bg-secondary/10 rounded-[3rem] border-4 border-secondary/20 shadow-2xl relative overflow-hidden group">
						<div class="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
						<span class="text-xs font-black uppercase opacity-60 tracking-widest block relative z-10">
							{players.filter(p => p.score === Math.max(...players.map(pl => pl.score))).length > 1 ? 'Tied Champions' : 'Overall Champion'}
						</span>
						<div class="flex flex-wrap justify-center gap-4 mt-3 relative z-10">
							{#each players.filter(p => p.score === Math.max(...players.map(pl => pl.score))) as winner}
								<h3 class="text-5xl font-black text-secondary drop-shadow-sm">
									{winner.name}
								</h3>
							{/each}
						</div>
						<div class="mt-4 inline-flex items-center gap-2 bg-secondary text-secondary-content px-4 py-1 rounded-full text-sm font-black relative z-10">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
							{Math.max(...players.map(p => p.score))} Points
						</div>
					</div>

					<!-- Leaderboard -->
					<div class="botanical-card w-full max-w-2xl bg-base-100/50 rounded-3xl p-6 border border-base-300">
						<h4 class="text-xs font-black uppercase opacity-40 mb-4 tracking-widest">Final Standings</h4>
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{#each players.slice().sort((a,b) => b.score - a.score) as player, i}
								<div class="flex items-center justify-between p-3 rounded-xl bg-base-200 border border-base-300 {i === 0 ? 'ring-2 ring-secondary/50' : ''}">
									<div class="flex items-center gap-2">
										<span class="text-xs font-black opacity-30">{i + 1}</span>
										<span class="font-bold text-sm">{player.name}</span>
									</div>
									<span class="font-black text-secondary">{player.score}</span>
								</div>
							{/each}
						</div>
					</div>

					<!-- Stats Grid -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
						{#each sessionStats as stat, i}
							<div
								class="botanical-card flex items-center justify-between p-4 bg-base-100 rounded-2xl border border-base-300 shadow-sm hover:border-primary/30 transition-all group/stat animate-in slide-in-from-bottom duration-500"
								style="animation-delay: {400 + (i * 100)}ms"
							>
								<div class="text-left">
									<div class="flex items-center gap-2 mb-1">
										<span class="text-[10px] font-black opacity-30 uppercase">Puzzle #{i+1}</span>
										<span class="badge badge-primary badge-outline badge-xs uppercase font-black tracking-tighter">{stat.winner}</span>
									</div>
									<h4 class="font-bold text-lg group-hover/stat:text-primary transition-colors">{stat.topic}</h4>
									<p class="text-[10px] opacity-40 font-black uppercase">Answer: {stat.solution}</p>
								</div>
								<div class="text-right">
									<span class="text-[10px] font-black opacity-30 uppercase block">Solved at</span>
									<span class="text-xl font-black">{stat.revealedCount} <span class="text-xs opacity-30">Panels</span></span>
								</div>
							</div>
						{/each}
					</div>

					<div class="pt-8 animate-in fade-in zoom-in duration-1000 delay-700">
						<button class="btn btn-outline btn-lg px-12 gap-2 hover:btn-primary transition-all rounded-full" on:click={startSetup}>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
							Start New Session
						</button>
					</div>
				</div>
			</div>
		{:else if setupMode}
			<div class="space-y-8 max-w-2xl mx-auto" in:fade>
				<div class="card glass-panel shadow-2xl overflow-hidden">
					<div class="card-body space-y-6">
						<h2 class="card-title text-2xl border-b pb-2">1. Game Settings</h2>
						<div class="divider">Players</div>
						<div class="space-y-4">
							<div class="flex justify-between items-center">
								<span class="font-semibold">Manage Players</span>
								<div class="flex gap-2">
									<button class="btn btn-ghost btn-sm" on:click={randomizePlayers}>Randomize Order</button>
									<button class="btn btn-outline btn-sm" on:click={addPlayer}>+ Add Player</button>
								</div>
							</div>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
								{#each players as player, i}
									<div class="flex gap-2 items-center" in:scale>
										<span class="text-xs opacity-50 w-4">{i + 1}.</span>
										<input
											type="text"
											bind:value={player.name}
											placeholder="Player Name"
											class="input  input-sm flex-grow focus:input-primary"
										/>
										<button class="btn btn-ghost btn-sm btn-square text-error-content" on:click={() => removePlayer(i)}>
											<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
										</button>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>

				<div class="space-y-4">
					<h2 class="text-2xl font-bold px-4">2. Puzzle Session</h2>
					{#each puzzles as puzzle, i}
						<div class="card glass-panel shadow-xl overflow-hidden relative group" in:scale>
							{#if puzzles.length > 1}
								<button class="btn btn-circle btn-xs btn-error absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10" on:click={() => removePuzzle(i)}>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
								</button>
							{/if}
							<div class="card-body space-y-4">
								<h3 class="font-black text-primary uppercase tracking-tighter">Puzzle #{i + 1}</h3>

								<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div class="flex flex-col gap-2 w-full">
										<label class="label" for="image-upload-{i}">
											<span class="text-sm font-semibold">Image</span>
										</label>
										<div class="relative group/upload h-40">
											<input
												type="file"
												id="image-upload-{i}"
												accept="image/*"
												on:change={(e) => handleImageUpload(e, i)}
												class="absolute inset-0 opacity-0 cursor-pointer z-10"
											/>
											<div class="absolute inset-0 border-2 border-dashed border-base-300 rounded-xl flex flex-col items-center justify-center bg-base-200/50 group-hover/upload:border-primary group-hover/upload:bg-primary/5 transition-all">
												{#if puzzle.imageSrc}
													<img src={puzzle.imageSrc} alt="Preview" class="h-full w-full object-contain rounded-lg p-2" />
													<div class="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
														<span class="text-base-content text-xs font-bold">Change Image</span>
													</div>
												{:else}
													<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
													<span class="text-xs font-bold opacity-40">Click or Drag to Upload</span>
												{/if}
											</div>
										</div>
									</div>

									<div class="space-y-4">
										<div class="flex flex-col gap-2">
											<label class="label" for="topic-{i}">
												<span class="text-sm font-semibold">Topic</span>
											</label>
											<input
												type="text"
												id="topic-{i}"
												bind:value={puzzle.topic}
												placeholder="Category..."
												class="input  input-sm focus:input-primary"
											/>
										</div>

										<div class="flex flex-col gap-2">
											<label class="label" for="solution-{i}">
												<span class="text-sm font-semibold">Solution</span>
											</label>
											<input
												type="text"
												id="solution-{i}"
												bind:value={puzzle.solution}
												placeholder="Answer..."
												class="input  input-sm focus:input-primary"
											/>
										</div>

										<div class="grid grid-cols-2 gap-2">
											<div class="flex flex-col gap-2">
												<label class="label" for="rows-{i}">
													<span class="text-sm text-xs">Rows</span>
												</label>
												<input type="number" id="rows-{i}" bind:value={puzzle.rows} min="1" max="10" class="input  input-xs focus:input-primary" />
											</div>
											<div class="flex flex-col gap-2">
												<label class="label" for="cols-{i}">
													<span class="text-sm text-xs">Cols</span>
												</label>
												<input type="number" id="cols-{i}" bind:value={puzzle.cols} min="1" max="10" class="input  input-xs focus:input-primary" />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					{/each}

					<button class="btn btn-outline btn-block border-dashed border-2 hover:border-primary group" on:click={addPuzzle}>
						<span class="group-hover:scale-110 transition-transform">+ Add Another Puzzle</span>
					</button>
				</div>

				<div class="flex justify-center pt-4">
					<button
						class="btn btn-primary btn-lg px-12 gap-2 shadow-2xl hover:scale-105 transition-all"
						on:click={startGame}
					>
						Start Jigsaw Session
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
					</button>
				</div>
			</div>
		{:else}
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8" in:fade>
				<!-- Main Game Board -->
				<div class="lg:col-span-2 space-y-4">
					{#key currentPuzzleIndex}
						<div class="flex justify-between items-center gap-4 py-2">
							<div class="flex items-center gap-4">
								{#if topic}
									<span class="text-sm font-black text-primary uppercase tracking-wider">{topic}</span>
								{/if}
								<span class="badge badge-outline badge-sm opacity-50 uppercase font-black">Puzzle {currentPuzzleIndex + 1}/{puzzles.length}</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="text-xs font-bold opacity-50 uppercase text-[10px]">Turn:</span>
								<span class="text-xs font-black uppercase tracking-widest text-[10px]" style="color: {playerColors[currentPlayerIndex % playerColors.length]}">
									{players[currentPlayerIndex]?.name}
								</span>
							</div>
						</div>
					{/key}

					<div id="game-board-container"
						 bind:clientWidth={containerWidth}
						 bind:clientHeight={containerHeight}
						 class="relative bg-black rounded-2xl shadow-2xl overflow-hidden border-4 border-base-100 ring-1 ring-base-300 group flex flex-col mx-auto transition-all"
						 style="{isFullscreen ? 'width: 100vw; height: 100vh; max-width: none; max-height: none; border: none; border-radius: 0;' : 'width: fit-content; max-width: 100%;'}">
						{#key currentPuzzleIndex}
							<div class="contents">
								<div class="relative flex-grow flex items-center justify-center overflow-hidden p-2 md:p-6 min-h-0">
							<div class="relative shadow-2xl"
								 style="{isFullscreen ? `width: ${panelWidth}px; height: ${panelHeight}px;` : 'width: fit-content; height: fit-content;'}">
								{#if imageSrc}
									<img
										src={imageSrc}
										alt="Quiz"
										class="block {isFullscreen ? 'w-full h-full' : 'max-w-full max-h-[70vh] w-auto h-auto'} select-none pointer-events-none"
										id="quiz-image"
										on:load={handleImageLoad}
									/>
								{/if}

								<!-- Grid Overlay -->
								<div
									class="absolute inset-0 grid gap-0 bg-black/5"
									style="grid-template-rows: repeat({rows}, 1fr); grid-template-columns: repeat({cols}, 1fr); width: 100%; height: 100%;"
								>
									{#each cells as active, i}
										{#if active}
											<button
												on:click={() => toggleCell(i)}
												out:fade={{ duration: 1000 }}
												class="cell-reveal relative bg-base-100 text-base-content text-base-content flex items-center justify-center text-3xl font-black border border-white/5 hover:bg-base-300 transition-all overflow-hidden"
												style="grid-row: {Math.floor(i / cols) + 1}; grid-column: {(i % cols) + 1};"
											>
												<!-- Glossy effect -->
												<div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
												<span class="relative z-10 drop-shadow-lg">{i + 1}</span>
												<!-- Scanline/Pattern -->
												<div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 10px 10px;"></div>
											</button>
										{/if}
									{/each}
								</div>
							</div>
						</div>

						<!-- Minimal Console (Always visible in fullscreen) -->
						{#if isFullscreen}
							<div class="p-4 border-t transition-all duration-500 flex items-center justify-between gap-4 animate-in slide-in-from-bottom {isCorrect ? 'bg-success/20 backdrop-blur-2xl border-success/40' : 'bg-base-900/95 backdrop-blur-xl border-white/10'}" in:fade>
								<div class="flex items-center gap-4 {isCorrect ? 'border-success/20' : 'border-white/10'} border-r pr-4">
									{#if topic}
										<div class="hidden md:block">
											<span class="text-[10px] font-black uppercase text-base-content block">Topic</span>
											<span class="text-sm font-bold text-base-content truncate max-w-[150px] block">{topic}</span>
										</div>
									{/if}
									<div class="bg-white/5 px-3 py-1 rounded-lg border border-white/10 min-w-[100px] text-center">
										<span class="text-[10px] font-black uppercase text-base-content block">Puzzle</span>
										<span class="text-sm font-bold text-base-content block">{currentPuzzleIndex + 1} / {puzzles.length}</span>
									</div>
								</div>

								{#if isCorrect}
									<div class="flex-grow text-center animate-float">
										<span class="text-xs font-black uppercase tracking-widest text-success-content opacity-70 block">Correct Answer</span>
										<span class="text-3xl font-black text-base-content uppercase tracking-[0.2em]">{solution}</span>
									</div>
									<div class="flex gap-2">
										{#if !revealedAll}
											<button class="btn btn-accent btn-sm gap-2 shadow-lg" on:click={revealAll} in:fade>
												<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" /></svg>
												Reveal Image
											</button>
										{:else}
											<button class="btn btn-primary btn-sm animate-pulse" on:click={nextPuzzle} in:fade>
												{currentPuzzleIndex < puzzles.length - 1 ? 'Next Puzzle' : 'Finish Session'}
											</button>
										{/if}
										<button class="btn btn-ghost btn-sm btn-circle" on:click={toggleFullscreen}>
											<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
										</button>
									</div>
								{:else}
									<div class="flex-grow flex items-center justify-center gap-4">
										<div class="text-center px-8 border-r border-white/10">
											<span class="text-[10px] font-black uppercase text-base-content block">Current Action</span>
											<span class="text-lg font-black uppercase italic tracking-wider" style="color: {playerColors[currentPlayerIndex % playerColors.length]}">
												{players[currentPlayerIndex]?.name} - {turnState === 'GUESSING' ? 'Guess!' : 'Select'}
											</span>
										</div>
										<div class="flex gap-2">
											<button class="btn btn-error btn-sm gap-2 shadow-lg" on:click={() => submitGuess(false)}>
												<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
												Wrong
											</button>
											<button class="btn btn-success btn-sm gap-2 shadow-lg" on:click={() => submitGuess(true)}>
												<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
												Correct
											</button>
										</div>
									</div>
									<button class="btn btn-ghost btn-sm btn-circle" on:click={toggleFullscreen}>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
									</button>
								{/if}
							</div>
						{/if}

						<!-- Fullscreen Button (Only in normal mode) -->
						{#if !isFullscreen}
							<button
								class="absolute top-4 right-4 btn btn-circle btn-md glass opacity-0 group-hover:opacity-100 transition-all z-[60] shadow-2xl hover:scale-110"
								on:click={toggleFullscreen}
								title="Toggle Fullscreen"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
							</button>
						{/if}
							</div>
						{/key}
					</div>

					{#if isCorrect}
						<div class="bg-success text-success-content p-8 rounded-3xl text-center shadow-[0_0_50px_rgba(34,197,94,0.4)] border-4 border-white/20 animate-in zoom-in duration-500 relative overflow-hidden" in:scale>
							<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
							<span class="text-xs font-black uppercase tracking-[0.4em] opacity-70 mb-2 block relative z-10">Bingo! Correct Answer</span>
							<div class="text-6xl font-black uppercase tracking-[0.2em] relative z-10 drop-shadow-2xl animate-pulse">
								{solution.trim() || 'Correct!'}
							</div>
						</div>
					{/if}

					<div class="botanical-card flex justify-between items-center bg-base-100 p-4 rounded-xl shadow-lg border border-base-300">
						<div class="flex gap-2">
							<button class="btn btn-outline btn-sm gap-2" on:click={startSetup}>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" /></svg>
								Setup
							</button>
							<button class="btn btn-outline btn-sm gap-2" on:click={resetGame}>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" /></svg>
								Reset
							</button>
						</div>
						<div class="text-sm font-medium opacity-70">
							{cells.filter(c => !c).length} / {cells.length} Panels Revealed
						</div>
						<button class="btn btn-secondary btn-sm gap-2" on:click={revealAll}>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" /></svg>
							Reveal All
						</button>
					</div>
				</div>

				<!-- Gamemaster Controls -->
				<div class="space-y-6">
					<div class="card glass-panel shadow-2xl">
						<div class="card-body">
							<h3 class="card-title text-xl text-primary font-black">GM Console</h3>

							{#if players.length > 0}
								<div class="flex gap-2 overflow-x-auto py-2 scrollbar-hide border-b border-base-300">
									{#each players as player, i}
										<div class="flex flex-col items-center min-w-[60px] p-2 rounded-lg transition-all {i === currentPlayerIndex ? 'border-2 ring-2 scale-105' : 'bg-base-200 border-2 border-transparent opacity-60'}"
											 style="{i === currentPlayerIndex ? `background-color: ${playerColors[i % playerColors.length]}20; border-color: ${playerColors[i % playerColors.length]}; --tw-ring-color: ${playerColors[i % playerColors.length]}33;` : ''}">
											<span class="text-[8px] font-black uppercase opacity-50">Score</span>
											<span class="text-lg font-black leading-none">{player.score}</span>
											<span class="text-[9px] font-bold truncate w-full text-center mt-1">{player.name}</span>
										</div>
									{/each}
								</div>
							{/if}

							<div class="flex gap-2">
								<button class="btn btn-error btn-sm flex-grow gap-1" on:click={() => submitGuess(false)}>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
									Wrong
								</button>
								<button class="btn btn-success btn-sm flex-grow gap-1" on:click={() => submitGuess(true)}>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
									Correct
								</button>
							</div>

							<div class="divider">Session Control</div>

							{#if isCorrect || revealedAll}
								<div class="mt-4 p-6 bg-primary text-primary-content rounded-2xl text-center shadow-2xl animate-in zoom-in duration-500">
									<p class="text-[10px] font-black uppercase opacity-70 mb-2">Round Complete</p>
									<button class="btn btn-secondary btn-block shadow-lg hover:scale-[1.02] transition-transform" on:click={nextPuzzle}>
										{currentPuzzleIndex < puzzles.length - 1 ? 'Next Puzzle' : 'Finish Session'}
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
									</button>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.cell-reveal {
		background: var(--color-base-200);
		color: var(--color-base-content);
		text-shadow: none;
		transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.cell-reveal:hover {
		background: var(--color-base-300);
		box-shadow: inset 0 0 20px rgba(255,255,255,0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.3);
		z-index: 20;
	}

	.glass-panel {
		background: var(--color-base-100);
		color: var(--color-base-content);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid var(--color-base-300);
	}

	@keyframes float {
		0% { transform: translateY(0px); }
		50% { transform: translateY(-10px); }
		100% { transform: translateY(0px); }
	}

	.animate-float {
		animation: float 3s ease-in-out infinite;
	}

	#game-board-container:fullscreen {
		width: 100vw !important;
		height: 100vh !important;
		max-width: none !important;
		max-height: none !important;
		border: none !important;
		border-radius: 0 !important;
		background: var(--color-base-200) !important;
		color: var(--color-base-content);
	}
</style>
