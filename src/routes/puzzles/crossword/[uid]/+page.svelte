

<script lang="ts">
export let data: any;


	import type { IPuzzleCrossword, CrosswordClue } from '#lib/interfaces/index.js';
	import { splitWord, isLegal, appendable, isMiddle } from '#lib/utils/thaiwords.js';
	import KeyboardLayout from '#lib/components/KeyboardLayout.svelte';
	import TitleTab from '#lib/components/TitleTab.svelte';
	import { onMount } from 'svelte';
	import { ChevronLeftIcon, ChevronRightIcon, EyeIcon, EyeOffIcon, CheckCircleIcon } from 'svelte-feather-icons';
	import { fade, scale } from 'svelte/transition';

	interface ExtendedClue extends CrosswordClue {
		id: number;
		index: number;
		solved: boolean;
	}

	let content: IPuzzleCrossword = data.content;

	let clues: ExtendedClue[] = [];
	let grid: any[][] = [];
	let activeCell: [number, number] = [0, 0];
	let activeClueId: number = -1;
	let solved = false;
	let openModal = false;

	// Settings & Timer
	let seconds = 0;
	let paused = false;
	let timerInterval: any;
	let showTimer = true;
	let autoCheck = true;

	function startTimer() {
		if (timerInterval) clearInterval(timerInterval);
		timerInterval = setInterval(() => {
			if (!paused && !solved) {
				seconds++;
			}
		}, 1000);
	}

	function togglePause() {
		paused = !paused;
	}

	function formatTime(s: number) {
		const m = Math.floor(s / 60);
		const sec = s % 60;
		return `${m}:${sec.toString().padStart(2, '0')}`;
	}

	const gridWidth = content.col;
	const gridHeight = content.row;

	// Responsive sizes
	$: sizeClass =
		gridWidth >= 12
			? 'w-8 h-8 sm:w-10 sm:h-10'
			: gridWidth >= 8
			? 'w-10 h-10 sm:w-12 sm:h-12'
			: 'w-12 h-12 sm:w-16 sm:h-16';
	$: letterSizeClass =
		gridWidth >= 12
			? 'text-lg sm:text-xl'
			: gridWidth >= 8
			? 'text-xl sm:text-2xl'
			: 'text-2xl sm:text-3xl';
	$: markSizeClass = gridWidth >= 12 ? 'text-[10px]' : 'text-xs';

	function init() {
		// Assign indices
		const extendedClues: ExtendedClue[] = content.clues.map((c, i) => ({
			...c,
			id: i,
			index: 0,
			solved: false
		}));

		const uniquePositions = Array.from(
			new Set(extendedClues.map((c) => `${c.position[0]},${c.position[1]}`))
		)
			.map((pos) => pos.split(',').map(Number))
			.sort((a, b) => (a[1] !== b[1] ? a[1] - b[1] : a[0] - b[0]));

		extendedClues.forEach((c) => {
			c.index =
				uniquePositions.findIndex((p) => p[0] === c.position[0] && p[1] === c.position[1]) + 1;
		});

		// Sort clues for display
		clues = extendedClues.sort((a, b) => {
			if (a.direction === b.direction) return a.index - b.index;
			return a.direction === 'across' ? -1 : 1;
		});

		// Init grid
		grid = Array(gridHeight)
			.fill(null)
			.map(() =>
				Array(gridWidth)
					.fill(null)
					.map(() => ({
						input: '',
						solution: '',
						mark: '',
						downClueId: -1,
						acrossClueId: -1,
						locked: false
					}))
			);

		// Populate grid
		clues.forEach((c) => {
			const letters = splitWord(c.answer);
			grid[c.position[1]][c.position[0]].mark = String(c.index);

			letters.forEach((letter, i) => {
				const r = c.direction === 'down' ? c.position[1] + i : c.position[1];
				const col = c.direction === 'across' ? c.position[0] + i : c.position[0];

				if (grid[r] && grid[r][col]) {
					grid[r][col].solution = letter;
					if (c.direction === 'down') grid[r][col].downClueId = c.id;
					else grid[r][col].acrossClueId = c.id;
				}
			});
		});

		// Default selection
		if (clues.length > 0) {
			activeClueId = clues[0].id;
			activeCell = [clues[0].position[1], clues[0].position[0]];
		}
	}

	$: if (content) {
		init();
		if (typeof window !== 'undefined') {
			seconds = 0;
			solved = false;
			openModal = false;
			paused = false;
		}
	}

	onMount(() => {
		startTimer();
		return () => clearInterval(timerInterval);
	});

	$: activeClue = clues.find((c) => c.id === activeClueId);
	$: activeClueCells = activeClue ? getClueCells(activeClue) : [];

	function getClueCells(c: ExtendedClue) {
		const cells: [number, number][] = [];
		const letters = splitWord(c.answer);
		letters.forEach((_, i) => {
			const r = c.direction === 'down' ? c.position[1] + i : c.position[1];
			const col = c.direction === 'across' ? c.position[0] + i : c.position[0];
			cells.push([r, col]);
		});
		return cells;
	}

	function isCellInActiveClue(r: number, c: number) {
		return activeClueCells.some(([cellR, cellC]) => cellR === r && cellC === c);
	}

	function selectPosition(r: number, c: number) {
		const cell = grid[r][c];
		if (cell.solution === '') return;

		if (activeCell[0] === r && activeCell[1] === c) {
			// Toggle direction
			if (cell.downClueId !== -1 && cell.acrossClueId !== -1) {
				activeClueId = activeClue?.direction === 'across' ? cell.downClueId : cell.acrossClueId;
			}
		} else {
			activeCell = [r, c];
			// Choose clue that matches current direction if possible
			if (activeClue?.direction === 'down' && cell.downClueId !== -1) {
				activeClueId = cell.downClueId;
			} else if (activeClue?.direction === 'across' && cell.acrossClueId !== -1) {
				activeClueId = cell.acrossClueId;
			} else {
				activeClueId = cell.acrossClueId !== -1 ? cell.acrossClueId : cell.downClueId;
			}
		}
	}

	function selectClue(c: ExtendedClue) {
		activeClueId = c.id;
		activeCell = [c.position[1], c.position[0]];
	}

	function nextClue() {
		const idx = clues.findIndex((c) => c.id === activeClueId);
		const next = clues[(idx + 1) % clues.length];
		selectClue(next);
	}

	function prevClue() {
		const idx = clues.findIndex((c) => c.id === activeClueId);
		const prev = clues[(idx + clues.length - 1) % clues.length];
		selectClue(prev);
	}

	function nextCell() {
		if (!activeClue) return;
		const letters = splitWord(activeClue.answer);
		const curIdx = activeClueCells.findIndex(
			([r, c]) => r === activeCell[0] && c === activeCell[1]
		);
		if (curIdx < letters.length - 1) {
			activeCell = activeClueCells[curIdx + 1];
		} else {
			nextClue();
		}
	}

	function prevCell() {
		if (!activeClue) return;
		const curIdx = activeClueCells.findIndex(
			([r, c]) => r === activeCell[0] && c === activeCell[1]
		);
		if (curIdx > 0) {
			activeCell = activeClueCells[curIdx - 1];
		} else {
			prevClue();
		}
	}

	function handleKeyPress(e: KeyboardEvent) {
		if (openModal) {
			openModal = false;
			return;
		}
		if (solved || paused) return;
		if (e.key === 'Tab') {
			e.preventDefault();
			nextClue();
		} else if (e.key === ' ') {
			e.preventDefault();
			nextCell();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			if (activeCell[1] < gridWidth - 1) selectPosition(activeCell[0], activeCell[1] + 1);
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			if (activeCell[1] > 0) selectPosition(activeCell[0], activeCell[1] - 1);
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (activeCell[0] < gridHeight - 1) selectPosition(activeCell[0] + 1, activeCell[1]);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (activeCell[0] > 0) selectPosition(activeCell[0] - 1, activeCell[1]);
		} else if (e.key === 'Backspace') {
			const cell = grid[activeCell[0]][activeCell[1]];
			if (!cell.locked) {
				if (cell.input) cell.input = '';
				else prevCell();
				grid = grid;
			}
		} else {
			modifyCell(e.key);
		}
	}

	function modifyCell(letter: string) {
		const cell = grid[activeCell[0]][activeCell[1]];
		if (cell.locked) return;

		if (appendable(cell.input, letter)) {
			// It's an upper/lower mark, append and stay
			cell.input += letter;
			checkAnswer(activeCell[0], activeCell[1]);
		} else if (isLegal(letter)) {
			const isMid = isMiddle(letter);

			// If it's a base character and we already have one here, move first
			if (isMid && cell.input && isMiddle(cell.input)) {
				nextCell();
				const nextC = grid[activeCell[0]][activeCell[1]];
				if (!nextC.locked) {
					nextC.input = letter;
					checkAnswer(activeCell[0], activeCell[1]);
				}
			} else {
				// Otherwise just set it and STAY (allows user to add upper/lower marks)
				cell.input = letter;
				checkAnswer(activeCell[0], activeCell[1]);
			}
		}
		grid = grid;
	}

	function handleType(event: CustomEvent) {
		const letter = event.detail;
		if (letter === '⬅') {
			const cell = grid[activeCell[0]][activeCell[1]];
			if (!cell.locked) {
				if (cell.input) cell.input = '';
				else prevCell();
				grid = grid;
			}
		} else {
			modifyCell(letter);
		}
	}

	function checkAnswer(r: number, c: number) {
		if (!autoCheck) return;
		const cell = grid[r][c];
		if (cell.downClueId !== -1) checkClue(cell.downClueId);
		if (cell.acrossClueId !== -1) checkClue(cell.acrossClueId);

		if (clues.every((cl) => cl.solved)) {
			solved = true;
			openModal = true;
		}
	}

	function manualCheckAll() {
		clues.forEach((cl) => {
			if (!cl.solved) checkClue(cl.id);
		});
		if (clues.every((cl) => cl.solved)) {
			solved = true;
			openModal = true;
		}
	}

	function checkClue(clueId: number) {
		const clue = clues.find((c) => c.id === clueId);
		if (!clue || clue.solved) return;

		const cells = getClueCells(clue);
		const letters = splitWord(clue.answer);
		const isCorrect = cells.every((pos, i) => grid[pos[0]][pos[1]].input === letters[i]);

		if (isCorrect) {
			clue.solved = true;
			cells.forEach((pos) => {
				grid[pos[0]][pos[1]].locked = true;
			});
			// Update local state to trigger reactivity
			clues = [...clues];
			grid = grid;
		}
	}

$: ({ content } = data);
</script>

<svelte:window on:keydown={handleKeyPress} />

<div class="max-w-6xl mx-auto px-4 py-8">
	<div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
		<div class="flex-1">
			<TitleTab {content} />
			{#if content.author}
				<p class="text-sm text-base-content/60 mt-1">โดย <span class="font-bold">{content.author}</span></p>
			{/if}
		</div>

	</div>

	<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 relative">
		<!-- Pause Overlay -->
		{#if paused}
			<div
				class="absolute inset-0 z-40 bg-base-100/80 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center border border-primary/20"
				transition:fade
			>
				<h2 class="text-4xl font-black mb-6">หยุดพักสักครู่...</h2>
				<button class="btn btn-primary btn-lg px-12 rounded-full shadow-xl shadow-primary/20" on:click={togglePause}>
					กลับไปเล่นต่อ
				</button>
			</div>
		{/if}

		<!-- Left: Grid Area -->
		<div class="lg:col-span-7 flex flex-col items-center">
			<div
				class="bg-base-300 p-1 rounded-xl shadow-2xl border border-white/10 overflow-auto max-w-full"
			>
				<div class="flex flex-col">
					{#each grid as row, r}
						<div class="flex flex-row">
							{#each row as cell, c}
								{#if cell.solution === ''}
									<div class="{sizeClass} bg-white m-[0.5px] rounded-sm"></div>
								{:else}
									<div
										class="{sizeClass} m-[0.5px] relative cursor-pointer select-none rounded-sm transition-all duration-150 border border-base-content/10"
										class:bg-primary={activeCell[0] === r && activeCell[1] === c}
										class:bg-primary-focus={isCellInActiveClue(r, c) &&
											!(activeCell[0] === r && activeCell[1] === c)}
										class:bg-base-100={!isCellInActiveClue(r, c) &&
											activeCell[0] !== r &&
											activeCell[1] !== c}
										class:ring-2={activeCell[0] === r && activeCell[1] === c}
										class:ring-primary={activeCell[0] === r && activeCell[1] === c}
										on:click={() => selectPosition(r, c)}
									>
										{#if cell.mark}
											<span
												class="absolute top-0.5 left-1 {markSizeClass} text-base-content/60 z-10 leading-none"
											>
												{cell.mark}
											</span>
										{/if}
										<div class="w-full h-full flex items-center justify-center">
											<span
												class="{letterSizeClass} font-medium transition-colors"
												class:text-primary-content={activeCell[0] === r && activeCell[1] === c}
												class:text-success-content={cell.locked &&
													!(activeCell[0] === r && activeCell[1] === c)}
												class:font-bold={cell.locked}
											>
												{cell.input}
											</span>
										</div>
									</div>
								{/if}
							{/each}
						</div>
					{/each}
				</div>
			</div>

			<!-- Active Clue Banner -->
			<div
				class="w-full mt-6 bg-base-200 rounded-2xl p-4 flex items-center justify-between shadow-lg border border-white/5"
			>
				<button class="btn btn-circle btn-ghost" on:click={prevClue}>
					<ChevronLeftIcon />
				</button>
				<div class="text-center px-4">
					<span class="text-xs uppercase tracking-widest text-base-content/50 font-bold">
						{activeClue?.direction === 'across' ? 'แนวนอน' : 'แนวตั้ง'}
						{activeClue?.index}
					</span>
					<h2 class="text-xl font-bold mt-1 line-clamp-2">
						{activeClue?.clue}
					</h2>
				</div>
				<button class="btn btn-circle btn-ghost" on:click={nextClue}>
					<ChevronRightIcon />
				</button>
			</div>

			<!-- Mobile Keyboard -->
			<div class="w-full lg:hidden mt-6">
				<KeyboardLayout on:type={handleType} />
			</div>
		</div>

		<!-- Right: Clue List Area -->
		<div class="lg:col-span-5 hidden lg:flex flex-col gap-6 max-h-[70vh]">
			<div
				class="bg-base-200 rounded-3xl p-6 flex flex-col overflow-hidden border border-white/5 shadow-xl"
			>
				<div class="flex items-center justify-between mb-4 bg-base-300/50 p-3 rounded-2xl border border-white/5 shadow-inner">
					<div class="flex items-center gap-2">
						<div class="w-2 h-6 bg-primary rounded-full" />
						<h3 class="text-lg font-black uppercase tracking-tight">คำใบ้</h3>
					</div>
					<div class="flex items-center gap-2">
						<div class="text-xl font-mono font-bold tracking-tighter text-primary w-16 transition-all {showTimer ? 'opacity-100' : 'opacity-0 select-none'}">
							{formatTime(seconds)}
						</div>
						<div class="flex items-center bg-base-100 rounded-full p-1 border border-white/5 shadow-sm">
							<button
								class="btn btn-xs btn-circle btn-ghost {showTimer ? 'text-primary' : 'opacity-30'}"
								on:click={() => showTimer = !showTimer}
								title={showTimer ? "ซ่อนเวลา" : "แสดงเวลา"}
							>
								{#if showTimer}<EyeIcon size="12" />{:else}<EyeOffIcon size="12" />{/if}
							</button>
							<button
								class="btn btn-xs btn-circle btn-ghost {autoCheck ? 'text-success-content' : 'opacity-30'}"
								on:click={() => autoCheck = !autoCheck}
								title={autoCheck ? "ตรวจสอบอัตโนมัติ: เปิด" : "ตรวจสอบอัตโนมัติ: ปิด"}
							>
								<CheckCircleIcon size="12" />
							</button>
							<div class="w-px h-3 bg-base-content/10 mx-0.5" />
							<button class="btn btn-xs btn-circle btn-ghost hover:bg-primary/20 transition-colors" on:click={togglePause}>
								{#if paused}
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-primary" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
								{:else}
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-primary" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
								{/if}
							</button>
						</div>
					</div>
				</div>

				{#if !autoCheck}
					<button
						class="btn btn-xs btn-success btn-block mb-4 rounded-xl shadow-md transition-all animate-fade-in"
						on:click={manualCheckAll}
					>
						ตรวจสอบคำตอบทั้งหมด
					</button>
				{/if}

				<div class="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
					<!-- Across Clues -->
					<div class="flex flex-col overflow-hidden">
						<h4 class="text-xs font-bold text-base-content/40 uppercase mb-3 px-2">แนวนอน</h4>
						<div class="overflow-y-auto pr-2 space-y-1">
							{#each clues as c}
								{#if c.direction === 'across'}
									<button
										class="w-full text-left p-3 rounded-xl transition-all duration-200 group relative"
										class:bg-primary={activeClueId === c.id}
										class:text-primary-content={activeClueId === c.id}
										class:hover:bg-base-300={activeClueId !== c.id}
										class:opacity-50={c.solved}
										on:click={() => selectClue(c)}
									>
										<div class="flex gap-2">
											<span class="font-bold shrink-0">{c.index}</span>
											<span class="text-sm font-medium leading-tight">{c.clue}</span>
										</div>
										{#if c.solved}
											<div class="absolute right-2 top-1/2 -translate-y-1/2">
												<div class="w-1.5 h-1.5 bg-success rounded-full" />
											</div>
										{/if}
									</button>
								{/if}
							{/each}
						</div>
					</div>

					<!-- Down Clues -->
					<div class="flex flex-col overflow-hidden border-l border-base-300 pl-4">
						<h4 class="text-xs font-bold text-base-content/40 uppercase mb-3 px-2">แนวตั้ง</h4>
						<div class="overflow-y-auto pr-2 space-y-1">
							{#each clues as c}
								{#if c.direction === 'down'}
									<button
										class="w-full text-left p-3 rounded-xl transition-all duration-200 group relative"
										class:bg-primary={activeClueId === c.id}
										class:text-primary-content={activeClueId === c.id}
										class:hover:bg-base-300={activeClueId !== c.id}
										class:opacity-50={c.solved}
										on:click={() => selectClue(c)}
									>
										<div class="flex gap-2">
											<span class="font-bold shrink-0">{c.index}</span>
											<span class="text-sm font-medium leading-tight">{c.clue}</span>
										</div>
										{#if c.solved}
											<div class="absolute right-2 top-1/2 -translate-y-1/2">
												<div class="w-1.5 h-1.5 bg-success rounded-full" />
											</div>
										{/if}
									</button>
								{/if}
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

{#if openModal}
	<div class="modal modal-open bg-black/60 backdrop-blur-sm z-50" transition:fade>
		<div
			class="modal-box bg-base-100 border border-white/10 shadow-2xl text-center p-10"
			transition:scale
		>
			<div
				class="w-20 h-20 bg-success/20 text-success-content rounded-full flex items-center justify-center mx-auto mb-6"
			>
				<span class="text-4xl">🎉</span>
			</div>
			<h3 class="text-3xl font-black mb-2">ยินดีด้วย!</h3>
			<p class="text-lg text-base-content/70 mb-8">คุณแก้ปริศนาอักษรไขว้สำเร็จแล้ว</p>
			<button
				class="btn btn-primary btn-lg btn-block shadow-lg"
				on:click={() => (openModal = false)}
			>
				เยี่ยมไปเลย!
			</button>
		</div>
	</div>
{/if}

<style>
	/* Hide scrollbar for grid but allow scrolling */
	::-webkit-scrollbar {
		width: 4px;
		height: 4px;
	}
	::-webkit-scrollbar-track {
		background: transparent;
	}
	::-webkit-scrollbar-thumb {
		background: hsl(var(--bc) / 0.2);
		border-radius: 10px;
	}
	::-webkit-scrollbar-thumb:hover {
		background: hsl(var(--bc) / 0.3);
	}
</style>
