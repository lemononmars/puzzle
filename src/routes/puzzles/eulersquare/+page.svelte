<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, scale, fly } from 'svelte/transition';
	import {
		ArrowLeftIcon,
		HelpCircleIcon,
		RefreshCwIcon,
		RotateCcwIcon,
		AwardIcon,
		AlertTriangleIcon,
		EyeIcon,
		ZapIcon,
		XIcon,
		SettingsIcon
	} from 'svelte-feather-icons';
	import {
		type BoardSize,
		type ClueMode,
		type Difficulty,
		type EulerCell,
		type EulerSquarePuzzle,
		type CellConflicts,
		EULER_LETTERS,
		EULER_COLORS,
		generatePuzzle,
		detectConflicts,
		isBoardSolved,
		getHint
	} from '#lib/utils/eulerSquare.js';

	const SIZES: BoardSize[] = [3, 4, 5];

	let currentSize: BoardSize = 4;
	let clueMode: ClueMode = 'separate';
	let difficulty: Difficulty = 'normal';

	let puzzle: EulerSquarePuzzle | null = null;
	let playerGrid: EulerCell[][] = [];
	let selectedCell: [number, number] | null = null;
	let hintCell: [number, number] | null = null;

	let showRules = false;
	let showVictory = false;
	let showSolution = false;
	let showSettings = false;
	let isGenerating = false;

	let draftSize: BoardSize = currentSize;
	let draftClueMode: ClueMode = clueMode;
	let draftDifficulty: Difficulty = difficulty;

	function openSettings(): void {
		draftSize = currentSize;
		draftClueMode = clueMode;
		draftDifficulty = difficulty;
		showSettings = true;
	}

	function applySettingsAndGenerate(): void {
		currentSize = draftSize;
		clueMode = draftClueMode;
		difficulty = draftDifficulty;
		newGame(currentSize, clueMode, difficulty);
		showSettings = false;
	}

	// Toast notification
	let toastMessage = '';
	let toastType: 'warning' | 'info' | 'success' = 'info';
	let toastTimeout: any = null;

	function showToast(msg: string, type: 'warning' | 'info' | 'success' = 'info'): void {
		if (toastTimeout) clearTimeout(toastTimeout);
		toastMessage = msg;
		toastType = type;
		toastTimeout = setTimeout(() => {
			toastMessage = '';
		}, 3500);
	}

	// Timer state
	let timerSeconds = 0;
	let timerInterval: any = null;
	let timerRunning = false;

	function formatTime(secs: number): string {
		const m = Math.floor(secs / 60);
		const s = secs % 60;
		return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
	}

	function startTimer(): void {
		stopTimer();
		timerSeconds = 0;
		timerRunning = true;
		timerInterval = setInterval(() => {
			timerSeconds++;
		}, 1000);
	}

	function stopTimer(): void {
		if (timerInterval) {
			clearInterval(timerInterval);
			timerInterval = null;
		}
		timerRunning = false;
	}

	function changeSize(size: BoardSize): void {
		newGame(size, clueMode, difficulty);
	}

	function setClueMode(mode: ClueMode): void {
		clueMode = mode;
		newGame(currentSize, clueMode, difficulty);
	}

	function setDifficulty(diff: Difficulty): void {
		difficulty = diff;
		newGame(currentSize, clueMode, difficulty);
	}

	function newGame(
		size: BoardSize = currentSize,
		mode: ClueMode = clueMode,
		diff: Difficulty = difficulty
	): void {
		isGenerating = true;
		showVictory = false;
		showSolution = false;
		hintCell = null;
		currentSize = size;
		clueMode = mode;
		difficulty = diff;
		selectedCell = null;

		try {
			puzzle = generatePuzzle(size, mode, diff);
			playerGrid = puzzle.initialGrid.map((row) =>
				row.map((c) => ({
					letter: c.letter,
					color: c.color,
					isGivenLetter: c.isGivenLetter,
					isGivenColor: c.isGivenColor
				}))
			);

			// Auto-select first editable cell
			let firstCell: [number, number] = [0, 0];
			for (let r = 0; r < size; r++) {
				for (let c = 0; c < size; c++) {
					if (!playerGrid[r][c].isGivenLetter || !playerGrid[r][c].isGivenColor) {
						firstCell = [r, c];
						break;
					}
				}
			}
			selectedCell = firstCell;
			startTimer();
		} catch (err) {
			console.error('Error generating puzzle:', err);
		} finally {
			isGenerating = false;
		}
	}

	function restartCurrent(): void {
		if (!puzzle) return;
		showVictory = false;
		showSolution = false;
		hintCell = null;
		playerGrid = puzzle.initialGrid.map((row) =>
			row.map((c) => ({
				letter: c.letter,
				color: c.color,
				isGivenLetter: c.isGivenLetter,
				isGivenColor: c.isGivenColor
			}))
		);
		startTimer();
	}

	function selectCell(r: number, c: number): void {
		selectedCell = [r, c];
		if (hintCell && hintCell[0] === r && hintCell[1] === c) {
			hintCell = null;
		}
	}

	function setLetter(lIndex: number | null): void {
		if (!selectedCell || !playerGrid) return;
		const [r, c] = selectedCell;
		if (playerGrid[r][c].isGivenLetter) return;

		playerGrid[r][c].letter = playerGrid[r][c].letter === lIndex ? null : lIndex;
		playerGrid = playerGrid;

		// Check for conflicts immediately and trigger toast
		if (lIndex !== null) {
			const res = detectConflicts(playerGrid, currentSize);
			const cellConf = res.conflicts[`${r},${c}`];
			if (cellConf.rowLetter || cellConf.colLetter || cellConf.duplicatePair) {
				const firstRelevant = res.conflictList.find(
					(msg) => msg.includes(`Row ${r + 1}`) || msg.includes(`Column ${c + 1}`) || msg.includes(`(${r + 1},${c + 1})`)
				);
				showToast(firstRelevant || `Conflict with letter '${EULER_LETTERS[lIndex]}'!`, 'warning');
			}
		}

		checkGameEnd();
	}

	function setColor(cIndex: number | null): void {
		if (!selectedCell || !playerGrid) return;
		const [r, c] = selectedCell;
		if (playerGrid[r][c].isGivenColor) return;

		playerGrid[r][c].color = playerGrid[r][c].color === cIndex ? null : cIndex;
		playerGrid = playerGrid;

		// Check for conflicts immediately and trigger toast
		if (cIndex !== null) {
			const res = detectConflicts(playerGrid, currentSize);
			const cellConf = res.conflicts[`${r},${c}`];
			if (cellConf.rowColor || cellConf.colColor || cellConf.duplicatePair) {
				const firstRelevant = res.conflictList.find(
					(msg) => msg.includes(`Row ${r + 1}`) || msg.includes(`Column ${c + 1}`) || msg.includes(`(${r + 1},${c + 1})`)
				);
				showToast(firstRelevant || `Conflict with color ${EULER_COLORS[cIndex].name} (${EULER_COLORS[cIndex].symbol})!`, 'warning');
			}
		}

		checkGameEnd();
	}

	function clearSelectedCell(): void {
		if (!selectedCell || !playerGrid) return;
		const [r, c] = selectedCell;
		if (!playerGrid[r][c].isGivenLetter) playerGrid[r][c].letter = null;
		if (!playerGrid[r][c].isGivenColor) playerGrid[r][c].color = null;
		playerGrid = playerGrid;
	}

	function handleHint(): void {
		if (!puzzle || !playerGrid) return;
		const hint = getHint(playerGrid, puzzle.solution, currentSize);
		if (hint) {
			selectedCell = [hint.r, hint.c];
			hintCell = [hint.r, hint.c];
			showToast(`💡 Hint: ${hint.message}`, hint.isCorrection ? 'warning' : 'info');
		} else {
			showToast('All filled cells look consistent!', 'success');
		}
	}

	function checkGameEnd(): void {
		if (isBoardSolved(playerGrid, currentSize)) {
			stopTimer();
			showVictory = true;
		}
	}

	function toggleSolution(): void {
		showSolution = !showSolution;
	}

	function nextLevel(): void {
		if (currentSize < 5) {
			const next = (currentSize + 1) as BoardSize;
			newGame(next, clueMode, difficulty);
		}
	}

	function handleKeydown(e: KeyboardEvent): void {
		if (showRules || showVictory) return;
		if (!selectedCell) return;
		const [r, c] = selectedCell;

		if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectCell((r - 1 + currentSize) % currentSize, c);
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectCell((r + 1) % currentSize, c);
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			selectCell(r, (c - 1 + currentSize) % currentSize);
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			selectCell(r, (c + 1) % currentSize);
		} else if (e.key === 'Backspace' || e.key === 'Delete') {
			clearSelectedCell();
		} else {
			const upper = e.key.toUpperCase();
			const letterIndex = EULER_LETTERS.indexOf(upper);
			if (letterIndex >= 0 && letterIndex < currentSize) {
				e.preventDefault();
				setLetter(letterIndex);
			}

			const num = parseInt(e.key, 10);
			if (!isNaN(num) && num >= 1 && num <= currentSize) {
				e.preventDefault();
				setColor(num - 1);
			}
		}
	}

	$: conflictData = playerGrid.length > 0 ? detectConflicts(playerGrid, currentSize) : { conflicts: {}, conflictList: [] };
	$: conflicts = conflictData.conflicts;
	$: conflictList = conflictData.conflictList;
	$: totalConflictsCount = conflictList.length;

	$: filledCellsCount = playerGrid.reduce(
		(sum, row) => sum + row.filter((c) => c.letter !== null && c.color !== null).length,
		0
	);
	$: totalCells = currentSize * currentSize;
	$: activeCell = selectedCell ? playerGrid[selectedCell[0]]?.[selectedCell[1]] : null;

	$: activeLetter = activeCell?.letter ?? null;
	$: activeColor = activeCell?.color ?? null;
	$: isCellGiven = !!(activeCell?.isGivenLetter && activeCell?.isGivenColor);

	onMount(() => {
		newGame(4, 'separate', 'normal');
		window.addEventListener('keydown', handleKeydown);
		return () => {
			stopTimer();
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<svelte:head>
	<title>Euler Square | Code Breaker</title>
	<meta
		name="description"
		content="Euler Square (Graeco-Latin Square) logic puzzle with board sizes 3 to 5, letters, and geometry color symbols."
	/>
</svelte:head>

<!-- Floating Toast Notification -->
{#if toastMessage}
	<div
		class="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
		transition:fly={{ y: -20, duration: 200 }}
	>
		<div
			class="botanical-card px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2.5 border text-sm font-semibold pointer-events-auto
				{toastType === 'warning'
					? 'bg-error border-red-500/80 text-error-content'
					: toastType === 'success'
					? 'bg-base-300 text-base-content border-primary/30 text-primary'
					: 'bg-base-100 text-base-content border-primary/30 text-primary'}"
		>
			{#if toastType === 'warning'}
				<AlertTriangleIcon size="17" class="text-error-content shrink-0 animate-bounce" />
			{:else}
				<ZapIcon size="17" class="text-primary shrink-0" />
			{/if}
			<span>{toastMessage}</span>
			<button
				class="ml-1 opacity-70 hover:opacity-100 transition-opacity"
				on:click={() => (toastMessage = '')}
			>
				<XIcon size="14" />
			</button>
		</div>
	</div>
{/if}

<div class="container mx-auto px-3 sm:px-6 py-6 max-w-5xl flex flex-col gap-6 text-base-content/70">
	<!-- Top Header (Clean: Euler Square title + Rules button, no badge, no explanation) -->
	<div class="flex items-center justify-between border-b border-base-300 pb-4">
		<div class="flex items-center gap-3">
			<a
				href="/puzzles"
				class="btn btn-sm btn-ghost btn-circle text-base-content/70 hover:text-base-content"
				title="All Puzzles"
			>
				<ArrowLeftIcon size="20" />
			</a>
			<h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
				Euler Square
			</h1>
		</div>
		<button
			class="btn btn-sm btn-outline border-base-300 text-base-content/70 hover:bg-base-100 text-base-content gap-1.5"
			on:click={() => (showRules = true)}
		>
			<HelpCircleIcon size="16" />
			<span>Rules</span>
		</button>
	</div>

	<!-- Main Area: Board on Left, Single Combined Control Div on Right -->
	<!-- Main Area: Board on Left, Single Combined Control Div on Right -->
	<div class="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-8 w-full">
		<!-- Left / Mobile Top Area: Board (+ Mobile Inputs Above Board) -->
		<div class="flex flex-col items-center w-full lg:w-auto">
			<!-- MOBILE INPUTS: Directly above the board on mobile mode (lg:hidden) -->
			<div
				class="botanical-card block lg:hidden w-full p-3.5 mb-3 rounded-2xl bg-base-100 text-base-content border border-base-300 shadow-xl backdrop-blur-md space-y-2.5"
				style="max-width: min(92vw, {currentSize === 3 ? '420px' : currentSize === 4 ? '480px' : '540px'});"
			>
				<!-- Selected Cell Header & Clear -->
				<div class="flex items-center justify-between text-xs">
					<span class="font-bold text-base-content/70">
						{#if selectedCell}
							Cell ({selectedCell[0] + 1}, {selectedCell[1] + 1})
							{#if isCellGiven}
								<span class="text-warning-content font-normal ml-1">(Locked)</span>
							{/if}
						{:else}
							<span class="text-base-content/70 font-normal">Select a cell on the board</span>
						{/if}
					</span>
					{#if selectedCell && !isCellGiven}
						<button
							class="btn btn-xs btn-ghost text-error-content hover:bg-red-500/20 text-[10px] px-2 h-6"
							on:click={clearSelectedCell}
						>
							Clear Cell
						</button>
					{/if}
				</div>

				<!-- Letters Row (Square buttons, no "Letters" label) -->
				<div class="flex items-center justify-center gap-2">
					{#each Array.from({ length: currentSize }, (_, i) => i) as lIdx}
						{@const isSelectedLetter = activeLetter === lIdx}
						{@const isGivenLetter = activeCell?.isGivenLetter}
						<button
							type="button"
							class="btn btn-sm aspect-square w-11 h-11 min-h-0 p-0 text-base font-black transition-all rounded-xl
								{isSelectedLetter
									? 'btn-primary text-primary-content ring-2 ring-emerald-400 scale-105'
									: 'btn-ghost bg-base-100 text-base-content hover:bg-base-100 text-base-content text-base-content/70'}
								{isGivenLetter ? 'opacity-50 cursor-not-allowed' : ''}"
							disabled={isGivenLetter}
							on:click={() => setLetter(lIdx)}
						>
							{EULER_LETTERS[lIdx]}
						</button>
					{/each}
					{#if activeCell && !activeCell.isGivenLetter && activeCell.letter !== null}
						<button
							class="btn btn-xs btn-ghost text-base-content/70 hover:text-error-content text-xs px-1.5 ml-1"
							on:click={() => setLetter(null)}
							title="Clear Letter"
						>
							✕
						</button>
					{/if}
				</div>

				<!-- Colors Row (Square buttons, no "Colors & Symbols" label, symbol only) -->
				<div class="flex items-center justify-center gap-2">
					{#each Array.from({ length: currentSize }, (_, i) => i) as cIdx}
						{@const color = EULER_COLORS[cIdx]}
						{@const isSelectedColor = activeColor === cIdx}
						{@const isGivenColor = activeCell?.isGivenColor}
						<button
							type="button"
							class="btn btn-sm aspect-square w-11 h-11 min-h-0 p-0 flex items-center justify-center text-lg font-black transition-all rounded-xl border
								{isSelectedColor
									? `${color.bgClass} ${color.borderClass} ring-2 ring-white scale-105`
									: 'bg-base-100 text-base-content border-base-300 hover:bg-base-100 text-base-content text-base-content/70'}
								{isGivenColor ? 'opacity-50 cursor-not-allowed' : ''}"
							disabled={isGivenColor}
							on:click={() => setColor(cIdx)}
							title={color.name}
						>
							<span class="{color.textClass}">{color.symbol}</span>
						</button>
					{/each}
					{#if activeCell && !activeCell.isGivenColor && activeCell.color !== null}
						<button
							class="btn btn-xs btn-ghost text-base-content/70 hover:text-error-content text-xs px-1.5 ml-1"
							on:click={() => setColor(null)}
							title="Clear Color"
						>
							✕
						</button>
					{/if}
				</div>
			</div>

			<!-- Grid Board -->
			<div
				class="botanical-card relative p-3 sm:p-5 rounded-3xl bg-base-100 text-base-content border border-base-300 shadow-2xl backdrop-blur-md shrink-0 w-full"
				style="max-width: min(92vw, {currentSize === 3 ? '420px' : currentSize === 4 ? '480px' : '540px'});"
			>
				{#if isGenerating}
					<div class="absolute inset-0 z-20 rounded-3xl bg-base-100 text-base-content backdrop-blur-sm flex flex-col items-center justify-center gap-3">
						<span class="loading loading-spinner text-primary w-10"></span>
						<span class="text-sm font-medium text-base-content/70">Generating unique puzzle...</span>
					</div>
				{/if}

				<div
					class="grid gap-2 sm:gap-3"
					style="grid-template-columns: repeat({currentSize}, minmax(0, 1fr));"
				>
					{#each playerGrid as row, rIndex}
						{#each row as cell, cIndex}
							{@const isSelected = selectedCell?.[0] === rIndex && selectedCell?.[1] === cIndex}
							{@const isHinted = hintCell?.[0] === rIndex && hintCell?.[1] === cIndex}
							{@const isSameRowOrCol = selectedCell && (selectedCell[0] === rIndex || selectedCell[1] === cIndex)}
							{@const isSameLetter = selectedCell && activeLetter !== null && cell.letter === activeLetter}
							{@const isSameColor = selectedCell && activeColor !== null && cell.color === activeColor}
							{@const cellConflict = conflicts[`${rIndex},${cIndex}`]}
							{@const hasConflict = cellConflict && (cellConflict.rowLetter || cellConflict.colLetter || cellConflict.rowColor || cellConflict.colColor || cellConflict.duplicatePair)}
							{@const displayLetter = (showSolution && puzzle) ? puzzle.solution[rIndex][cIndex].letter : cell.letter}
							{@const displayColor = (showSolution && puzzle) ? puzzle.solution[rIndex][cIndex].color : cell.color}
							{@const colorInfo = displayColor !== null && displayColor !== undefined ? EULER_COLORS[displayColor] : null}

							<button
								type="button"
								class="aspect-square relative flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-200 outline-none select-none overflow-hidden group
									{isSelected
										? 'ring-4 ring-cyan-400 ring-offset-2 ring-offset-slate-950 border-white z-10 scale-[1.03] shadow-lg shadow-cyan-500/30'
										: isHinted
										? 'ring-4 ring-amber-400 border-amber-300 animate-pulse z-10 scale-[1.02]'
										: isSameRowOrCol
										? 'bg-base-100 text-base-content border-base-300'
										: 'bg-base-100 text-base-content border-base-300 hover:border-base-300 hover:bg-base-100 text-base-content'}
									{hasConflict ? 'border-red-500 ring-2 ring-red-500/70 animate-pulse' : ''}
									{colorInfo ? `${colorInfo.bgClass} ${colorInfo.borderClass}` : ''}"
								on:click={() => selectCell(rIndex, cIndex)}
							>
								<!-- Highlight matching letter or color -->
								{#if (isSameLetter || isSameColor) && !isSelected}
									<div class="absolute inset-0 bg-white/5 pointer-events-none"></div>
								{/if}

								<!-- Center Content: Letter + Geometry Symbol Side-by-Side -->
								<div class="flex items-center justify-center gap-1 sm:gap-1.5">
									{#if displayLetter !== null && displayLetter !== undefined}
										<span
											class="font-black text-2xl sm:text-4xl tracking-tight transition-transform
												{colorInfo ? colorInfo.textClass : 'text-base-content/70'}"
										>
											{EULER_LETTERS[displayLetter]}
										</span>
									{/if}

									{#if colorInfo}
										<span
											class="text-base sm:text-2xl font-bold transition-transform {colorInfo.textClass}"
											title={colorInfo.name}
										>
											{colorInfo.symbol}
										</span>
									{/if}

									{#if displayLetter === null && displayColor === null}
										<span class="text-base-content/70 font-bold text-xl">·</span>
									{/if}
								</div>
							</button>
						{/each}
					{/each}
				</div>
			</div>
		</div>

		<!-- Right: Single Combined Controls Panel (with separators) -->
		<div class="botanical-card w-full max-w-md bg-base-100 text-base-content border border-base-300 rounded-3xl p-5 shadow-xl backdrop-blur-md flex flex-col gap-3.5">
			<!-- DESKTOP INPUTS: Displayed on lg and above (hidden on mobile since it is above board) -->
			<div class="hidden lg:flex flex-col gap-2.5">
				<!-- Selected Cell Header -->
				<div class="flex items-center justify-between">
					<span class="text-[11px] font-bold uppercase tracking-wider text-base-content/70">
						{#if selectedCell}
							Cell ({selectedCell[0] + 1}, {selectedCell[1] + 1})
							{#if isCellGiven}
								<span class="text-warning-content font-normal ml-1">(Locked)</span>
							{/if}
						{:else}
							Select a cell
						{/if}
					</span>
					{#if selectedCell && !isCellGiven}
						<button
							class="btn btn-xs btn-ghost text-error-content hover:bg-red-500/20 text-[10px] px-1.5 h-6"
							on:click={clearSelectedCell}
						>
							Clear Cell
						</button>
					{/if}
				</div>

				<!-- Letters Row (Square buttons, no "Letters" label) -->
				<div class="flex items-center justify-center gap-2">
					{#each Array.from({ length: currentSize }, (_, i) => i) as lIdx}
						{@const isSelectedLetter = activeLetter === lIdx}
						{@const isGivenLetter = activeCell?.isGivenLetter}
						<button
							type="button"
							class="btn btn-sm aspect-square w-11 h-11 min-h-0 p-0 text-base font-black transition-all rounded-xl
								{isSelectedLetter
									? 'btn-primary text-primary-content ring-2 ring-emerald-400 scale-105'
									: 'btn-ghost bg-base-100 text-base-content hover:bg-base-100 text-base-content text-base-content/70'}
								{isGivenLetter ? 'opacity-50 cursor-not-allowed' : ''}"
							disabled={isGivenLetter}
							on:click={() => setLetter(lIdx)}
						>
							{EULER_LETTERS[lIdx]}
						</button>
					{/each}
					{#if activeCell && !activeCell.isGivenLetter && activeCell.letter !== null}
						<button
							class="btn btn-xs btn-ghost text-base-content/70 hover:text-error-content text-xs px-1.5 ml-1"
							on:click={() => setLetter(null)}
							title="Clear Letter"
						>
							✕
						</button>
					{/if}
				</div>

				<!-- Colors Row (Square buttons, no "Colors & Symbols" label, symbol only) -->
				<div class="flex items-center justify-center gap-2">
					{#each Array.from({ length: currentSize }, (_, i) => i) as cIdx}
						{@const color = EULER_COLORS[cIdx]}
						{@const isSelectedColor = activeColor === cIdx}
						{@const isGivenColor = activeCell?.isGivenColor}
						<button
							type="button"
							class="btn btn-sm aspect-square w-11 h-11 min-h-0 p-0 flex items-center justify-center text-lg font-black transition-all rounded-xl border
								{isSelectedColor
									? `${color.bgClass} ${color.borderClass} ring-2 ring-white scale-105`
									: 'bg-base-100 text-base-content border-base-300 hover:bg-base-100 text-base-content text-base-content/70'}
								{isGivenColor ? 'opacity-50 cursor-not-allowed' : ''}"
							disabled={isGivenColor}
							on:click={() => setColor(cIdx)}
							title={color.name}
						>
							<span class="{color.textClass}">{color.symbol}</span>
						</button>
					{/each}
					{#if activeCell && !activeCell.isGivenColor && activeCell.color !== null}
						<button
							class="btn btn-xs btn-ghost text-base-content/70 hover:text-error-content text-xs px-1.5 ml-1"
							on:click={() => setColor(null)}
							title="Clear Color"
						>
							✕
						</button>
					{/if}
				</div>

				<div class="border-t border-base-300 my-0.5"></div>
			</div>

			<!-- Top Row: Stats & Current Settings Display (swapped) -->
			<div class="flex items-center justify-between gap-2">
				<div class="flex items-center gap-3">
					<div class="flex flex-col">
						<span class="text-[10px] uppercase tracking-wider text-base-content/70 font-medium">Time</span>
						<span class="font-mono text-base font-bold text-base-content">{formatTime(timerSeconds)}</span>
					</div>
					<div class="flex flex-col">
						<span class="text-[10px] uppercase tracking-wider text-base-content/70 font-medium">Progress</span>
						<span class="text-sm font-bold {totalConflictsCount > 0 ? 'text-error-content' : 'text-primary'}">
							{filledCellsCount}/{totalCells}
						</span>
					</div>
				</div>

				<!-- Current Settings Display -->
				<div class="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-base-100 text-base-content border border-base-300 text-[11px]">
					<span class="text-primary font-bold">{currentSize}×{currentSize}</span>
					<span class="text-base-content/70">•</span>
					<span class="text-primary font-medium">{clueMode === 'separate' ? 'Separate' : 'Full'}</span>
					<span class="text-base-content/70">•</span>
					<span class="{difficulty === 'hard' ? 'text-warning-content font-semibold' : 'text-base-content/70'} capitalize">{difficulty}</span>
				</div>
			</div>

			<!-- Quick Toolbar: Hint, Reset, Solution -->
			<div class="grid grid-cols-3 gap-1.5">
				<button
					class="btn btn-xs btn-outline border-amber-500/60 text-warning-content hover:bg-amber-500/20 gap-1"
					on:click={handleHint}
					title="Get a hint on which cell to examine next"
				>
					<span>💡</span>
					<span>Hint</span>
				</button>

				<button
					class="btn btn-xs btn-ghost bg-base-100 text-base-content hover:bg-base-100 text-base-content text-base-content/70 gap-1"
					on:click={restartCurrent}
					title="Reset to initial puzzle clues"
				>
					<RotateCcwIcon size="12" />
					<span>Reset</span>
				</button>

				<button
					class="btn btn-xs btn-ghost bg-base-100 text-base-content hover:bg-base-100 text-base-content text-base-content/70 gap-1"
					on:click={toggleSolution}
					title="Toggle solution peek"
				>
					<EyeIcon size="12" />
					<span>{showSolution ? 'Hide Sol' : 'Solution'}</span>
				</button>
			</div>

			<!-- Separator -->
			<div class="border-t border-base-300 my-0.5"></div>

			<!-- Custom & New Buttons Grouped (swapped) -->
			<div class="join w-full grid grid-cols-2">
				<button
					type="button"
					class="join-item btn btn-xs btn-outline border-base-300 hover:bg-base-100 text-base-content text-base-content/70 gap-1.5"
					on:click={openSettings}
					title="Configure custom settings"
				>
					<SettingsIcon size="12" />
					<span>Custom</span>
				</button>

				<button
					type="button"
					class="join-item btn btn-xs btn-primary text-primary-content gap-1.5 shadow"
					on:click={() => newGame(currentSize, clueMode, difficulty)}
					title="Generate new puzzle with same settings"
				>
					<RefreshCwIcon size="12" class={isGenerating ? 'animate-spin' : ''} />
					<span>New</span>
				</button>
			</div>

			<!-- Separator -->
			<div class="border-t border-base-300 my-0.5"></div>

			<!-- Section 4: Keyboard shortcuts info -->
			<div class="text-[10px] text-base-content/70 flex items-center justify-between opacity-75">
				<span>Shortcuts: A–{EULER_LETTERS[currentSize - 1]} / 1–{currentSize} / Arrows / Del</span>
			</div>
		</div>
	</div>
</div>

<!-- Rules Modal -->
{#if showRules}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-100 text-base-content backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
	>
		<div
			class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 text-left"
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<div class="flex items-center justify-between border-b border-base-300 pb-3">
				<h3 class="text-xl font-bold text-base-content flex items-center gap-2">
					<HelpCircleIcon class="text-primary" size="22" />
					<span>Euler Square (Graeco-Latin Square) Rules</span>
				</h3>
				<button class="btn btn-sm btn-circle btn-ghost text-base-content/70" on:click={() => (showRules = false)}>✕</button>
			</div>

			<div class="text-sm text-base-content/70 flex flex-col gap-3 leading-relaxed">
				<p>
					An <strong>Euler Square</strong> (order <em>N</em>) superimposes two orthogonal Latin squares onto one grid:
				</p>
				<ol class="list-decimal pl-5 space-y-2 text-base-content/70">
					<li>
						<strong>Letters:</strong> Each row and column must contain every letter from <code>A</code> to <code>{EULER_LETTERS[currentSize - 1]}</code> exactly once.
					</li>
					<li>
						<strong>Color Symbols:</strong> Each row and column must contain every color geometry symbol (●, ■, ▲, ◆...) exactly once.
					</li>
					<li>
						<strong>Orthogonality (Unique Pairs):</strong> Every square forms a pair of <code>(Letter + Symbol)</code>. <strong>No two squares on the board may share the same pair!</strong>
					</li>
				</ol>
				<div class="bg-base-100 text-base-content border border-base-300 rounded-xl p-3 text-xs text-primary">
					💡 <strong>Input:</strong> Click a square on the board, then select a letter or color symbol from the lists on the right.
				</div>
			</div>

			<div class="flex justify-end pt-2">
				<button class="btn btn-primary text-primary-content" on:click={() => (showRules = false)}>
					Got it, Let's Play!
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Victory Modal -->
{#if showVictory}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-100 text-base-content backdrop-blur-md"
		transition:fade={{ duration: 150 }}
	>
		<div
			class="botanical-card bg-base-100 text-base-content border border-primary/30 rounded-3xl max-w-md w-full p-6 shadow-2xl flex flex-col items-center text-center gap-4"
			transition:scale={{ duration: 250, start: 0.9 }}
		>
			<div class="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-primary/30 flex items-center justify-center text-primary shadow-lg shadow-emerald-500/30 animate-bounce">
				<AwardIcon size="44" />
			</div>

			<div class="flex flex-col gap-1">
				<h3 class="text-2xl sm:text-3xl font-extrabold text-base-content">Euler Square Solved!</h3>
				<p class="text-sm text-base-content/70">
					You solved the {currentSize}×{currentSize} Euler Square ({difficulty} difficulty) with all conditions satisfied!
				</p>
			</div>

			<div class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-2xl p-4 w-full flex justify-around">
				<div class="flex flex-col">
					<span class="text-xs text-base-content/70 uppercase">Time</span>
					<span class="text-xl font-bold font-mono text-primary">{formatTime(timerSeconds)}</span>
				</div>
				<div class="flex flex-col">
					<span class="text-xs text-base-content/70 uppercase">Board Size</span>
					<span class="text-xl font-bold text-primary">{currentSize}×{currentSize}</span>
				</div>
			</div>

			<div class="flex flex-col sm:flex-row gap-2 w-full pt-2">
				<button
					class="btn btn-ghost bg-base-100 text-base-content hover:bg-base-100 text-base-content text-base-content flex-1"
					on:click={() => (showVictory = false)}
				>
					View Board
				</button>
				{#if currentSize < 5}
					<button
						class="btn btn-primary text-primary-content flex-1 shadow-lg shadow-emerald-500/20"
						on:click={nextLevel}
					>
						Next Level ({currentSize + 1}×{currentSize + 1})
					</button>
				{:else}
					<button
						class="btn btn-primary text-primary-content flex-1 shadow-lg shadow-emerald-500/20"
						on:click={() => newGame(currentSize, clueMode, difficulty)}
					>
						Play Again
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}

<!-- Settings Modal -->
{#if showSettings}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-100 text-base-content backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
	>
		<div
			class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-5 text-left"
			transition:scale={{ duration: 200, start: 0.95 }}
		>
			<div class="flex items-center justify-between border-b border-base-300 pb-3">
				<h3 class="text-lg font-bold text-base-content flex items-center gap-2">
					<SettingsIcon class="text-primary" size="20" />
					<span>Game Settings</span>
				</h3>
				<button type="button" class="btn btn-sm btn-circle btn-ghost text-base-content/70" on:click={() => (showSettings = false)}>✕</button>
			</div>

			<div class="flex flex-col gap-4">
				<!-- Size -->
				<div class="flex flex-col gap-1.5">
					<span class="text-xs font-bold text-base-content/70 uppercase tracking-wider">Board Size</span>
					<div class="grid grid-cols-3 gap-2">
						{#each SIZES as size}
							<button
								type="button"
								class="btn btn-sm {draftSize === size ? 'btn-primary text-primary-content font-bold' : 'btn-ghost bg-base-100 text-base-content hover:bg-base-100 text-base-content text-base-content/70'}"
								on:click={() => {
									draftSize = size;
								}}
							>
								{size}×{size}
							</button>
						{/each}
					</div>
				</div>

				<div class="border-t border-base-300 my-0.5"></div>

				<!-- Clue Mode -->
				<div class="flex flex-col gap-1.5">
					<span class="text-xs font-bold text-base-content/70 uppercase tracking-wider">Clue Style</span>
					<div class="grid grid-cols-2 gap-2">
						<button
							type="button"
							class="btn btn-sm {draftClueMode === 'separate' ? 'btn-accent text-accent-content font-bold' : 'btn-ghost bg-base-100 text-base-content hover:bg-base-100 text-base-content text-base-content/70'}"
							on:click={() => {
								draftClueMode = 'separate';
							}}
						>
							Separate
						</button>
						<button
							type="button"
							class="btn btn-sm {draftClueMode === 'cell' ? 'btn-accent text-accent-content font-bold' : 'btn-ghost bg-base-100 text-base-content hover:bg-base-100 text-base-content text-base-content/70'}"
							on:click={() => {
								draftClueMode = 'cell';
							}}
						>
							Full Cells
						</button>
					</div>
				</div>

				<div class="border-t border-base-300 my-0.5"></div>

				<!-- Difficulty -->
				<div class="flex flex-col gap-1.5">
					<span class="text-xs font-bold text-base-content/70 uppercase tracking-wider">Difficulty</span>
					<div class="grid grid-cols-2 gap-2">
						<button
							type="button"
							class="btn btn-sm {draftDifficulty === 'normal' ? 'btn-warning text-warning-content font-bold' : 'btn-ghost bg-base-100 text-base-content hover:bg-base-100 text-base-content text-base-content/70'}"
							on:click={() => {
								draftDifficulty = 'normal';
							}}
						>
							Normal
						</button>
						<button
							type="button"
							class="btn btn-sm {draftDifficulty === 'hard' ? 'btn-warning text-warning-content font-bold' : 'btn-ghost bg-base-100 text-base-content hover:bg-base-100 text-base-content text-base-content/70'}"
							on:click={() => {
								draftDifficulty = 'hard';
							}}
						>
							Hard
						</button>
					</div>
				</div>
			</div>

			<div class="flex justify-end pt-2 border-t border-base-300">
				<button type="button" class="btn btn-sm btn-primary text-primary-content gap-1.5 shadow" on:click={applySettingsAndGenerate}>
					<RefreshCwIcon size="13" />
					<span>Generate</span>
				</button>
			</div>
		</div>
	</div>
{/if}
