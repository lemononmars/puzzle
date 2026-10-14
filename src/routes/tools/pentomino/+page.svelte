<script lang="ts">
	import { solvePentomino, countSolutions } from '#lib/pentomino_engine.js';
	import { fade } from 'svelte/transition';
	import { HelpCircleIcon } from 'svelte-feather-icons';

	type ForcedCell = { r: number; c: number; id: string };
	type BlockedCell = [number, number];

	let grid: (string | null)[][] = Array.from({ length: 8 }, () => Array(8).fill(null));
	let blockedCells: BlockedCell[] = [];
	let forcedCells: ForcedCell[] = [];
	let hasSolutionShown = false;
	let solving = false;
	let counting = false;
	let message = 'เลือกช่องที่ไม่ได้ใช้ 4 ช่อง';
	let error = '';
	let solutionCount: number | null = null;
	let showHelpModal = false;

	let selectedCell: { r: number; c: number } | null = null;
	let selectedPiece: string | null = null;

	const PIECE_COLORS: Record<string, string> = {
		F: '#ff5f5f',
		I: '#5fff5f',
		L: '#5f5fff',
		P: '#ffff5f',
		N: '#ff5fff',
		T: '#5fffff',
		U: '#ffaf5f',
		V: '#af5fff',
		W: '#5faf5f',
		X: '#afafaf',
		Y: '#ff5faf',
		Z: '#5fafff',
		X_BLOCK: '#333333'
	};

	const PIECE_SHAPES: Record<string, number[][]> = {
		F: [[0, 1, 1], [1, 1, 0], [0, 1, 0]],
		I: [[1, 1, 1, 1, 1]],
		L: [[1, 0], [1, 0], [1, 0], [1, 1]],
		P: [[1, 1], [1, 1], [1, 0]],
		N: [[0, 1], [0, 1], [1, 1], [1, 0]],
		T: [[1, 1, 1], [0, 1, 0], [0, 1, 0]],
		U: [[1, 0, 1], [1, 1, 1]],
		V: [[1, 0, 0], [1, 0, 0], [1, 1, 1]],
		W: [[1, 0, 0], [1, 1, 0], [0, 1, 1]],
		X: [[0, 1, 0], [1, 1, 1], [0, 1, 0]],
		Y: [[0, 1], [1, 1], [0, 1], [0, 1]],
		Z: [[1, 1, 0], [0, 1, 0], [0, 1, 1]]
	};

	function clearSolution() {
		const newGrid = Array.from({ length: 8 }, () => Array(8).fill(null));
		for (const [r, c] of blockedCells) newGrid[r][c] = 'X_BLOCK';
		for (const { r, c, id } of forcedCells) newGrid[r][c] = id;
		grid = newGrid;
	}

	function assignPieceToCell(r: number, c: number, pieceId: string) {
		if (hasSolutionShown) {
			clearSolution();
			hasSolutionShown = false;
		}

		const blockedIndex = blockedCells.findIndex(([br, bc]) => br === r && bc === c);
		if (blockedIndex !== -1) {
			blockedCells.splice(blockedIndex, 1);
			blockedCells = [...blockedCells];
		}

		if (pieceId === 'X_BLOCK') {
			forcedCells = forcedCells.filter((cell) => cell.r !== r || cell.c !== c);
			if (blockedCells.length < 4) {
				blockedCells = [...blockedCells, [r, c]];
				grid[r][c] = 'X_BLOCK';
			}
		} else {
			forcedCells = forcedCells.filter((cell) => cell.r !== r || cell.c !== c);
			forcedCells = [...forcedCells, { r, c, id: pieceId }];
			grid[r][c] = pieceId;
		}

		error = '';
		solutionCount = null;
		message = blockedCells.length < 4 ? `Selected ${blockedCells.length}/4 cells.` : 'Ready to solve!';
	}

	function removeCellContent(r: number, c: number) {
		if (hasSolutionShown) {
			clearSolution();
			hasSolutionShown = false;
		}

		const forcedIndex = forcedCells.findIndex((cell) => cell.r === r && cell.c === c);
		if (forcedIndex !== -1) {
			forcedCells.splice(forcedIndex, 1);
			forcedCells = [...forcedCells];
			grid[r][c] = null;
		}

		const blockedIndex = blockedCells.findIndex(([br, bc]) => br === r && bc === c);
		if (blockedIndex !== -1) {
			blockedCells.splice(blockedIndex, 1);
			blockedCells = [...blockedCells];
			grid[r][c] = null;
		}

		error = '';
		solutionCount = null;
		message = blockedCells.length < 4 ? `Selected ${blockedCells.length}/4 cells.` : 'Ready to solve!';
	}

	function handleCellClick(r: number, c: number) {
		if (solving || counting) return;

		if (selectedPiece) {
			if (grid[r][c] === selectedPiece || (grid[r][c] === 'X_BLOCK' && selectedPiece === 'X_BLOCK')) {
				removeCellContent(r, c);
			} else {
				assignPieceToCell(r, c, selectedPiece);
			}
			return;
		}

		if (selectedCell?.r === r && selectedCell?.c === c) {
			selectedCell = null;
			return;
		}

		selectedCell = { r, c };
		toggleCell(r, c);
	}

	function selectPieceFromPalette(pieceId: string) {
		if (solving || counting) return;

		if (selectedCell) {
			assignPieceToCell(selectedCell.r, selectedCell.c, pieceId);
			selectedCell = null;
		} else {
			selectedPiece = selectedPiece === pieceId ? null : pieceId;
		}
	}

	function toggleCell(r: number, c: number) {
		if (solving || counting) return;
		if (hasSolutionShown) {
			clearSolution();
			hasSolutionShown = false;
		}

		const forcedIndex = forcedCells.findIndex((cell) => cell.r === r && cell.c === c);
		if (forcedIndex !== -1) {
			forcedCells.splice(forcedIndex, 1);
			forcedCells = [...forcedCells];
			grid[r][c] = null;
			return;
		}

		const index = blockedCells.findIndex(([br, bc]) => br === r && bc === c);
		if (index !== -1) {
			blockedCells.splice(index, 1);
			blockedCells = [...blockedCells];
			grid[r][c] = null;
		} else if (blockedCells.length < 4) {
			blockedCells = [...blockedCells, [r, c]];
			grid[r][c] = 'X_BLOCK';
		}

		error = '';
		solutionCount = null;
		message = blockedCells.length < 4 ? `Selected ${blockedCells.length}/4 cells.` : 'Ready to solve!';
	}

	function handleKeydown(e: KeyboardEvent, r: number, c: number) {
		if (solving || counting) return;
		selectedCell = { r, c };

		const key = e.key.toUpperCase();
		if (PIECE_COLORS[key] && key !== 'X_BLOCK') {
			assignPieceToCell(r, c, key);
		} else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === ' ') {
			removeCellContent(r, c);
		}
	}

	async function handleSolve() {
		if (blockedCells.length !== 4) {
			error = 'Please select exactly 4 cells.';
			return;
		}

		solving = true;
		message = 'Solving...';
		error = '';
		solutionCount = null;

		setTimeout(() => {
			const result = solvePentomino(blockedCells, forcedCells);
			if (result) {
				grid = result;
				hasSolutionShown = true;
				message = 'เจอแล้ว!';
			} else {
				message = 'ไม่มีคำตอบ';
				error = 'หาไม่เจอจริง ๆ ลองเปลี่ยนช่องดูนะ';
			}
			solving = false;
		}, 100);
	}

	async function handleCount() {
		if (blockedCells.length !== 4) {
			error = 'เลือกให้ครบ 4 ช่อง';
			return;
		}

		counting = true;
		message = 'กำลังนับ...';
		error = '';
		solutionCount = null;

		setTimeout(() => {
			const count = countSolutions(blockedCells, forcedCells);
			solutionCount = count;
			message = `มี ${count} คำตอบ`;
			counting = false;
		}, 100);
	}

	function reset() {
		selectedCell = null;
		selectedPiece = null;
		if (hasSolutionShown) {
			clearSolution();
			hasSolutionShown = false;
			solutionCount = null;
			message = 'ล้างคำตอบแล้ว';
			error = '';
		} else {
			grid = Array.from({ length: 8 }, () => Array(8).fill(null));
			blockedCells = [];
			forcedCells = [];
			hasSolutionShown = false;
			solving = false;
			counting = false;
			solutionCount = null;
			message = 'เลือกช่องที่ไม่ได้ใช้ 4 ช่อง';
			error = '';
		}
	}
</script>

<svelte:head>
	<title>8x8 Pentomino Solver | Code Breaker</title>
	<meta
		name="description"
		content="Solve 8x8 pentomino puzzles with custom obstacles and forced piece positions."
	/>
</svelte:head>

<div class="py-1 text-base-content flex flex-col items-center font-sans max-w-5xl mx-auto px-2">
	<!-- Header -->
	<header class="text-center mb-2 flex items-center justify-center gap-2" style="margin-top: 0; margin-bottom: 0;">
		<h1 class="text-xl sm:text-3xl lg:text-4xl font-black text-primary" style="margin-top: 0; margin-bottom: 0;">
			8x8 Pentomino Solver
		</h1>
		<button
			on:click={() => (showHelpModal = true)}
			class="btn btn-circle btn-xs sm:btn-sm btn-ghost text-base-content/70 hover:text-base-content border border-base-300"
			title="วิธีใช้"
		>
			<HelpCircleIcon size="14" />
		</button>
	</header>

	<main class="flex flex-col md:flex-row gap-3 md:gap-6 items-center md:items-start justify-center w-full">
		<!-- Controls & Palette -->
		<div class="w-full md:w-72 flex flex-col gap-2">
			<!-- Action Buttons (Row on mobile, Stack on desktop) -->
			<div class="botanical-card grid grid-cols-3 sm:flex sm:flex-col gap-1.5 bg-base-100 text-base-content border border-base-300 p-2 sm:p-3 rounded-xl backdrop-blur-sm shadow-md">
				<button
					on:click={handleSolve}
					disabled={blockedCells.length !== 4 || solving || counting}
					class="py-1.5 sm:py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all
                           {blockedCells.length === 4 && !solving && !counting
						? 'bg-primary text-primary-content hover:bg-primary/90 shadow-md'
						: 'bg-base-100 text-base-content text-base-content/70 cursor-not-allowed'}"
				>
					{solving ? 'กำลังหา...' : 'หาคำตอบ'}
				</button>

				<button
					on:click={handleCount}
					disabled={blockedCells.length !== 4 || solving || counting}
					class="py-1.5 sm:py-2 rounded-lg font-bold text-[11px] sm:text-xs border border-secondary text-secondary hover:bg-secondary/10 transition-all
                           {blockedCells.length === 4 && !solving && !counting
						? 'opacity-100 cursor-pointer'
						: 'opacity-50 cursor-not-allowed'}"
				>
					{counting ? 'นับอยู่...' : 'หาจำนวน'}
				</button>

				<button
					on:click={reset}
					class="py-1.5 sm:py-2 rounded-lg border border-base-300 text-[11px] sm:text-xs font-semibold hover:bg-base-100 text-base-content transition-colors
                           {hasSolutionShown ? 'text-warning-content border-amber-500/50 hover:bg-warning' : ''}"
				>
					{hasSolutionShown ? 'ล้างคำตอบ' : 'ล้างกระดาน'}
				</button>
			</div>

			{#if message || error}
				<div
					class="py-1 px-2 rounded-lg text-center border transition-all text-[11px] sm:text-xs
                            {error ? 'bg-error text-error-content border-error' : 'bg-info text-info-content border-info'}"
				>
					{error || message}
				</div>
			{/if}

			<!-- Compact Interactive Pentomino Piece Selector -->
			<div class="bg-base-100 text-base-content border border-base-300 p-2 rounded-xl space-y-1">
				<div class="grid grid-cols-7 sm:grid-cols-4 gap-1">
					{#each Object.entries(PIECE_COLORS) as [id, color]}
						{@const isSelected = selectedPiece === id}
						<button
							on:click={() => selectPieceFromPalette(id)}
							class="flex flex-col items-center justify-center p-1 rounded-lg border transition-all hover:scale-105 active:scale-95
							       {isSelected
								? 'bg-base-100 text-base-content border-primary/30 ring-1 ring-primary/50'
								: 'bg-base-100 text-base-content border-base-300 hover:border-base-300'}"
						>
							{#if id === 'X_BLOCK'}
								<div class="h-5 flex items-center justify-center">
									<span class="text-xs text-base-content/70 font-bold">✕</span>
								</div>
								<span class="text-[9px] font-bold text-base-content/70 hidden sm:block">บล็อก</span>
							{:else}
								<!-- Mini Shape Grid -->
								<div class="h-5 flex items-center justify-center">
									<div class="flex flex-col gap-[1px]">
										{#each PIECE_SHAPES[id] || [] as row}
											<div class="flex gap-[1px]">
												{#each row as cell}
													<div
														class="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-[0.5px] border border-black/20"
														style="background-color: {cell ? color : 'transparent'}"
													/>
												{/each}
											</div>
										{/each}
									</div>
								</div>
								<span class="text-[10px] font-extrabold hidden sm:block" >{id}</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Grid -->
		<div class="relative group">
			<div
				class="absolute -inset-1 bg-primary rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"
			/>
			<div class="botanical-card relative bg-base-100 text-base-content p-2 sm:p-3 rounded-2xl border border-base-300 shadow-2xl">
				<div class="grid grid-cols-8 gap-1 sm:gap-1.5">
					{#each grid as row, r}
						{#each row as cell, c}
							{@const isCellFocused = selectedCell?.r === r && selectedCell?.c === c}
							<button
								aria-label={`Row ${r + 1}, column ${c + 1}: ${cell || "empty"}`}
								on:click={() => handleCellClick(r, c)}
								on:keydown={(e) => handleKeydown(e, r, c)}
								tabindex="0"
								class="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-md transition-all duration-200 relative overflow-hidden group/cell flex items-center justify-center
                                       {cell === null
									? 'bg-base-200 text-base-content hover:bg-base-300 focus:bg-base-300'
									: ''} {isCellFocused ? 'ring-2 ring-primary ring-offset-1 ring-offset-base-100' : ''} focus:ring-2 focus:ring-primary focus:outline-none"
								style="background-color: {cell ? PIECE_COLORS[cell] : ''}"
								disabled={solving}
							>
								{#if cell === 'X_BLOCK'}
									<div class="absolute inset-0 flex items-center justify-center opacity-60">
										<svg viewBox="0 0 24 24" class="w-4 h-4 sm:w-5 sm:h-5 fill-white">
											<path
												d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
											/>
										</svg>
									</div>
								{:else if cell === null}
									<div
										class="absolute inset-0 border-2 border-transparent group-hover/cell:border-primary/50 rounded-md"
									/>
								{/if}

								{#if cell && cell !== 'X_BLOCK'}
									<span class="text-black font-black text-xs sm:text-sm pointer-events-none">{cell}</span>
									{#if forcedCells.some((fc) => fc.r === r && fc.c === c)}
										<div
											class="absolute inset-0 border-[2px] border-black/60 rounded-md pointer-events-none shadow-inner"
										/>
									{/if}
								{/if}
							</button>
						{/each}
					{/each}
				</div>
			</div>
		</div>
	</main>
</div>

<!-- Modal for Explanation (Left Justified) -->
{#if showHelpModal}
	<div
		class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
		transition:fade={{ duration: 150 }}
	>
		<div class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-2xl p-5 max-w-md w-full shadow-2xl relative space-y-4 text-base-content text-left">
			<button
				on:click={() => (showHelpModal = false)}
				class="absolute top-4 right-4 text-base-content/70 hover:text-base-content btn btn-ghost btn-xs btn-circle"
			>
				✕
			</button>
			<h3 class="text-base sm:text-lg font-bold flex items-center gap-2 text-left">
				<span class="w-2 h-5 bg-blue-500 rounded-full" />
				วิธีใช้งาน Pentomino Solver
			</h3>
			<ul class="text-xs sm:text-sm text-base-content/70 space-y-2 list-disc pl-5 leading-relaxed text-left">
				<li>เลือกช่องที่ไม่ใช้ <strong>4 ช่อง</strong> (บล็อกสีดำ) โดยแตะที่กระดาน หรือกดปุ่ม <strong>✕ บล็อก</strong> ด้านล่าง</li>
				<li>กดเลือกชิ้นส่วน Pentomino (F, I, L, P, N, T, U, V, W, X, Y, Z) แล้วแตะช่องบนกระดานเพื่อวางบังคับ</li>
				<li>หรือแตะเลือกช่องบนกระดานก่อน แล้วกดเลือกชิ้นส่วน หรือพิมพ์ตัวอักษรบนคีย์บอร์ด</li>
				<li>เมื่อเลือกครบ 4 ช่องที่ไม่ใช้แล้ว กดปุ่ม <strong>"หาคำตอบ"</strong></li>
			</ul>
			<button
				on:click={() => (showHelpModal = false)}
				class="btn btn-primary w-full rounded-xl btn-sm font-bold mt-2"
			>
				เข้าใจแล้ว
			</button>
		</div>
	</div>
{/if}
