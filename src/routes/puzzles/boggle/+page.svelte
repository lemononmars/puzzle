<script lang="ts">
	import { onMount } from 'svelte';
	import dict from '#lib/utils/dict.js';
	import { isUpper, isLower } from '#lib/utils/thaiwords.js';
	import {
		CompassIcon,
		AwardIcon,
		CheckCircleIcon,
		XCircleIcon,
		PlayCircleIcon,
		InfoIcon,
		XIcon,
		Maximize2Icon,
		Minimize2Icon
	} from 'svelte-feather-icons';
	import { fly } from 'svelte/transition';

	let isFullscreen = false;
	function toggleFullscreen() {
		const elem = document.getElementById('boggle-game-container');
		if (!elem) return;
		if (!document.fullscreenElement) {
			elem.requestFullscreen().catch((err) => console.error(err));
		} else {
			document.exitFullscreen().catch(() => {});
		}
	}

	onMount(() => {
		const handleFsChange = () => {
			isFullscreen = !!document.fullscreenElement;
		};
		document.addEventListener('fullscreenchange', handleFsChange);
		return () => {
			document.removeEventListener('fullscreenchange', handleFsChange);
		};
	});

	// Board configurations
	const rows = 4;
	const cols = 4;

	// Game state
	let grid: string[][] = [
		['', '', '', ''],
		['', '', '', ''],
		['', '', '', ''],
		['', '', '', '']
	];
	let isPlaying = false;
	let gameEnded = false;
	let timeLeft = 120;
	let timerInterval: any = null;
	let score = 0;

	// Draggable / selectable state
	let selectedPath: Array<{ r: number; c: number }> = [];
	let isDragging = false;
	let foundWords: Set<string> = new Set();
	let allPossibleWords: string[] = [];
	let showRulesModal = false;
	let showPossibleCount = true;

	let sortedDict: string[] = [];
	let dictSet: Set<string> = new Set();

	function search(word: string): boolean {
		return dictSet.has(word);
	}

	$: possibleCountsByLength = allPossibleWords.reduce(
		(acc, word) => {
			const len = word.length;
			const key = len >= 6 ? '6+' : len.toString();
			acc[key] = (acc[key] || 0) + 1;
			return acc;
		},
		{ '3': 0, '4': 0, '5': 0, '6+': 0 } as Record<string, number>
	);

	$: missedWords = allPossibleWords.filter((w) => !foundWords.has(w));

	// Sound/Visual Feedback messages
	let feedbackMessage = '';
	let feedbackType: 'success' | 'error' | 'info' | '' = '';
	let feedbackTimeout: any = null;

	// Letters distributions & weights
	const boggleDiceWeights: Record<string, number> = {
		ร: 624,
		ก: 536,
		น: 514,
		อ: 398,
		ม: 371,
		ง: 371,
		ว: 308,
		ย: 308,
		ล: 270,
		ส: 238,
		ต: 231,
		ด: 231,
		ห: 205,
		ค: 205,
		บ: 187,
		ท: 167,
		ป: 162,
		พ: 150,
		จ: 126,
		ช: 108,
		ข: 106,
		ศ: 54,
		ผ: 48,
		ถ: 43,
		ณ: 42,
		ธ: 40,
		ภ: 39,
		ญ: 38,
		ษ: 37,
		ซ: 34,
		ฟ: 23,
		ฉ: 20,
		ฝ: 13,
		ฐ: 12,
		ฮ: 11,
		า: 778,
		เ: 373,
		แ: 115,
		โ: 88,
		ใ: 40,
		ไ: 69,
		ะ: 228,
		ำ: 80,
		'็': 46,
		'ั': 328,
		'ุ/ู': 240,
		'ิ/ี': 463,
		'ึ/ื': 124,
		'่/้/๊/๋': 612
	};

	function getRandomWeightedChar(): string {
		const entries = Object.entries(boggleDiceWeights);
		const totalWeight = entries.reduce((sum, [, w]) => sum + w, 0);
		let r = Math.random() * totalWeight;
		for (const [char, w] of entries) {
			r -= w;
			if (r <= 0) return char;
		}
		return entries[0][0];
	}

	function normalizeToCombinedChar(char: string): string {
		if (char === 'ุ' || char === 'ู') return 'ุ/ู';
		if (char === 'ิ' || char === 'ี') return 'ิ/ี';
		if (char === 'ึ' || char === 'ื') return 'ึ/ื';
		if (char === '่' || char === '้' || char === '๊' || char === '๋') return '่/้/๊/๋';
		return char;
	}

	function generateBoard() {
		const freshGrid = Array(rows)
			.fill(null)
			.map(() => Array(cols).fill(''));

		const playableLongWords = dict.filter(
			(w) =>
				w.length >= 6 && w.length <= 8 && !w.includes('-') && !w.includes(' ') && !w.includes('์')
		);

		let placed = false;
		let attempts = 0;
		while (!placed && attempts < 200) {
			attempts++;
			const mainWord =
				playableLongWords[Math.floor(Math.random() * playableLongWords.length)] || 'กระต่าย';
			const tempGrid = Array(rows)
				.fill(null)
				.map(() => Array(cols).fill(''));
			const chars = mainWord.split('').map(normalizeToCombinedChar);
			let r = Math.floor(Math.random() * rows);
			let c = Math.floor(Math.random() * cols);
			tempGrid[r][c] = chars[0];
			let success = true;
			const visited = new Set<string>([`${r},${c}`]);

			for (let i = 1; i < chars.length; i++) {
				const dirs = [
					[-1, -1],
					[-1, 0],
					[-1, 1],
					[0, -1],
					[0, 1],
					[1, -1],
					[1, 0],
					[1, 1]
				].sort(() => Math.random() - 0.5);

				let stepPlaced = false;
				for (const [dr, dc] of dirs) {
					const nr = r + dr;
					const nc = c + dc;
					if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(`${nr},${nc}`)) {
						tempGrid[nr][nc] = chars[i];
						visited.add(`${nr},${nc}`);
						r = nr;
						c = nc;
						stepPlaced = true;
						break;
					}
				}
				if (!stepPlaced) {
					success = false;
					break;
				}
			}

			if (success) {
				for (let r = 0; r < rows; r++) {
					for (let c = 0; c < cols; c++) {
						if (tempGrid[r][c] === '') {
							tempGrid[r][c] = getRandomWeightedChar();
						}
					}
				}
				const solved = solveBoard(tempGrid);
				if (solved.some((w) => w.length >= 6)) {
					placed = true;
					for (let tr = 0; tr < rows; tr++) {
						for (let tc = 0; tc < cols; tc++) {
							freshGrid[tr][tc] = tempGrid[tr][tc];
						}
					}
				}
			}
		}

		if (!placed) {
			const fallbackWord = 'กระต่าย';
			const chars = fallbackWord.split('').map(normalizeToCombinedChar);
			for (let i = 0; i < chars.length && i < 16; i++) {
				freshGrid[Math.floor(i / 4)][i % 4] = chars[i];
			}
			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					if (freshGrid[r][c] === '') {
						freshGrid[r][c] = getRandomWeightedChar();
					}
				}
			}
		}

		grid = freshGrid;
		allPossibleWords = solveBoard(grid).sort((a, b) => b.length - a.length || a.localeCompare(b));
	}

	// DFS Solver with Prefix Pruning (supporting combined cells)
	function solveBoard(board: string[][]): string[] {
		const found = new Set<string>();

		function dfs(r: number, c: number, prefix: string, visited: boolean[][]) {
			if (prefix.length >= 3) {
				if (search(prefix)) {
					found.add(prefix);
				}
			}

			if (prefix.length >= 9 || !hasPrefix(prefix)) return;

			for (let dr = -1; dr <= 1; dr++) {
				for (let dc = -1; dc <= 1; dc++) {
					if (dr === 0 && dc === 0) continue;
					const nr = r + dr;
					const nc = c + dc;
					if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
						const nextCellVal = board[nr][nc];
						visited[nr][nc] = true;
						let optStart = 0;
						for (let i = 0; i <= nextCellVal.length; i++) {
							if (i === nextCellVal.length || nextCellVal[i] === '/') {
								const opt = nextCellVal.substring(optStart, i);
								dfs(nr, nc, prefix + opt, visited);
								optStart = i + 1;
							}
						}
						visited[nr][nc] = false;
					}
				}
			}
		}

		const visited = Array(rows)
			.fill(null)
			.map(() => Array(cols).fill(false));
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				const cellVal = board[r][c];
				visited[r][c] = true;
				let optStart = 0;
				for (let i = 0; i <= cellVal.length; i++) {
					if (i === cellVal.length || cellVal[i] === '/') {
						const opt = cellVal.substring(optStart, i);
						dfs(r, c, opt, visited);
						optStart = i + 1;
					}
				}
				visited[r][c] = false;
			}
		}
		return Array.from(found);
	}

	// Prefix check using binary search over sortedDict array
	function hasPrefix(prefix: string): boolean {
		let low = 0;
		let high = sortedDict.length - 1;
		while (low <= high) {
			const mid = Math.floor((low + high) / 2);
			const val = sortedDict[mid];
			if (val.startsWith(prefix)) {
				return true;
			}
			if (val < prefix) {
				low = mid + 1;
			} else {
				high = mid - 1;
			}
		}
		return false;
	}

	function startNewGame() {
		clearInterval(timerInterval);
		timeLeft = 120;
		score = 0;
		foundWords = new Set();
		foundWords = foundWords; // trigger reactivity
		selectedPath = [];
		gameEnded = false;
		isPlaying = true;

		generateBoard();

		timerInterval = setInterval(() => {
			if (timeLeft > 0) {
				timeLeft--;
			} else {
				endGame();
			}
		}, 1000);
	}

	function endGame() {
		clearInterval(timerInterval);
		isPlaying = false;
		gameEnded = true;
		selectedPath = [];
	}

	// Scoring table helper
	function getWordScore(word: string): number {
		const len = word.length;
		if (len < 3) return 0;
		if (len === 3) return 1;
		if (len === 4) return 2;
		if (len === 5) return 4;
		if (len === 6) return 6;
		return 9;
	}

	// Dragging handlers
	function handleCellStart(r: number, c: number) {
		if (!isPlaying || gameEnded) return;
		feedbackMessage = '';
		isDragging = true;
		selectedPath = [{ r, c }];
	}

	function handleCellEnter(r: number, c: number) {
		if (!isDragging || !isPlaying) return;

		// Check if it's already in the path
		const pathIndex = selectedPath.findIndex((p) => p.r === r && p.c === c);
		if (pathIndex !== -1) {
			selectedPath = selectedPath.slice(0, pathIndex + 1);
			return;
		}

		// Ensure the cell is adjacent to the last selected cell
		const lastCell = selectedPath[selectedPath.length - 1];
		const isAdjacent = Math.abs(lastCell.r - r) <= 1 && Math.abs(lastCell.c - c) <= 1;
		if (isAdjacent) {
			selectedPath = [...selectedPath, { r, c }];
		}
	}

	// Submit word when dragging finishes
	function handleCellEnd() {
		if (!isDragging) return;
		isDragging = false;
		submitWord();
	}

	function handleGlobalMouseUp() {
		if (isDragging) {
			isDragging = false;
			submitWord();
		}
	}

	function getPossibleStrings(path: Array<{ r: number; c: number }>): string[] {
		if (path.length === 0) return [];
		let results = [''];
		for (let i = 0; i < path.length; i++) {
			const p = path[i];
			const cellVal = grid[p.r][p.c];

			if (cellVal.indexOf('/') === -1) {
				// Fast path: no split needed
				const resLen = results.length;
				for (let r = 0; r < resLen; r++) {
					results[r] += cellVal;
				}
			} else {
				// Slow path: split and pre-allocate
				const options = cellVal.split('/');
				const optLen = options.length;
				const resLen = results.length;
				const nextResults: string[] = new Array(resLen * optLen);
				let idx = 0;

				for (let r = 0; r < resLen; r++) {
					const res = results[r];
					for (let o = 0; o < optLen; o++) {
						nextResults[idx++] = res + options[o];
					}
				}
				results = nextResults;
			}
		}
		return results;
	}

	$: currentWordOptions = getPossibleStrings(selectedPath);
	$: currentWordDisplay = selectedPath
		.map((p) => {
			const char = grid[p.r][p.c];
			return char.includes('/') ? `(${char})` : char;
		})
		.join(' ');
	$: currentWordValid = selectedPath.length >= 3 && currentWordOptions.some((w) => search(w));

	function showFeedback(msg: string, type: 'success' | 'error' | 'info') {
		feedbackMessage = msg;
		feedbackType = type;
		clearTimeout(feedbackTimeout);
		feedbackTimeout = setTimeout(() => {
			feedbackMessage = '';
			feedbackType = '';
		}, 2000);
	}

	function submitWord() {
		const path = selectedPath;
		selectedPath = [];

		if (path.length === 0) return;

		const options = getPossibleStrings(path);
		const validWords = options.filter(search);

		if (path.length < 3) {
			showFeedback('คำต้องมีความยาวอย่างน้อย 3 ตัวอักษรขึ้นไป', 'info');
			return;
		}

		if (validWords.length > 0) {
			let addedAny = false;
			for (const word of validWords) {
				if (!foundWords.has(word)) {
					foundWords.add(word);
					score += getWordScore(word);
					addedAny = true;
				}
			}
			if (addedAny) {
				foundWords = foundWords; // trigger reactivity
				showFeedback(`ยอดเยี่ยม! พบคำว่า "${validWords.join(', ')}"`, 'success');
			} else {
				showFeedback(`คำนี้ถูกหาเจอไปแล้ว`, 'info');
			}
		} else {
			const rawWord = options[0] || '';
			showFeedback(`"${rawWord}" ไม่อยู่ในพจนานุกรม`, 'error');
		}
	}

	function getCellSVGCoord(val: number): number {
		return (val + 0.5) * 25;
	}

	$: pathSVGData =
		selectedPath.length > 0
			? `M ${getCellSVGCoord(selectedPath[0].c)} ${getCellSVGCoord(selectedPath[0].r)} ` +
			  selectedPath
					.slice(1)
					.map((p) => `L ${getCellSVGCoord(p.c)} ${getCellSVGCoord(p.r)}`)
					.join(' ')
			: '';

	onMount(() => {
		sortedDict = [...dict].sort();
		dictSet = new Set(sortedDict);
		generateBoard();

		return () => {
			clearInterval(timerInterval);
		};
	});
</script>

<svelte:head>
	<title>Code Breaker | เส้นทางศัพท์ 🧭</title>
	<meta name="description" content="ลากเส้นเชื่อมตัวอักษรเพื่อผสมคำภาษาไทยในพจนานุกรม" />
</svelte:head>

<svelte:window on:mouseup={handleGlobalMouseUp} on:touchend={handleGlobalMouseUp} />

<div id="boggle-game-container" class="max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-4 flex flex-col gap-3 select-none">
	<div class="botanical-card bg-base-100 text-base-content text-base-content border border-base-300 rounded-3xl p-3 sm:p-6 shadow-2xl flex flex-col gap-3 relative overflow-hidden">
		<div class="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

		<!-- Compact Header -->
		<div class="flex items-center justify-between gap-2 border-b border-base-300/80 pb-2">
			<div class="flex items-center gap-2 overflow-hidden">
				<span class="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0"></span>
				<h1 class="text-base sm:text-xl font-extrabold text-base-content tracking-tight truncate">
					เส้นทางศัพท์ <span class="text-xs text-base-content/70 font-medium hidden sm:inline">(Boggle)</span>
				</h1>
			</div>

			<div class="flex items-center gap-1 shrink-0">
				<button
					on:click={toggleFullscreen}
					class="btn btn-ghost btn-xs sm:btn-sm gap-1 text-primary hover:bg-primary/20"
					title={isFullscreen ? 'ออกจากเต็มจอ' : 'เต็มจอ'}
				>
					{#if isFullscreen}
						<Minimize2Icon size="16" />
						<span class="hidden sm:inline">ออกจากเต็มจอ</span>
					{:else}
						<Maximize2Icon size="16" />
						<span class="hidden sm:inline">เต็มจอ</span>
					{/if}
				</button>
				<button
					on:click={() => (showRulesModal = true)}
					class="btn btn-ghost btn-xs sm:btn-sm gap-1 text-base-content hover:bg-base-200"
				>
					<InfoIcon size="16" />
					<span class="hidden sm:inline">วิธีเล่น</span>
				</button>
			</div>
		</div>

		<!-- Main Layout -->
		<div class="w-full grid lg:grid-cols-12 gap-6 items-start text-left">
			<!-- Left Column: The Interactive Board -->
		<div class="lg:col-span-7 flex flex-col gap-4 items-center w-full">
			<!-- Current Word Drag preview bar -->
			<div
				class="botanical-card w-full h-14 bg-base-100 text-base-content border border-base-300 rounded-2xl flex items-center justify-between px-6 shadow-xl relative overflow-hidden"
			>
				{#if feedbackMessage}
					<div
						class="absolute inset-0 flex items-center justify-end gap-3 px-6 transition-all duration-300 z-30
						{feedbackType === 'success' ? 'bg-success/15 text-success-content' : ''}
						{feedbackType === 'error' ? 'bg-error/15 text-error-content' : ''}
						{feedbackType === 'info' ? 'bg-base-300 text-info-content' : ''}"
						in:fly={{ y: 5, duration: 150 }}
					>
						<span class="text-sm font-black flex items-center gap-1.5">
							{#if feedbackType === 'success'}
								<CheckCircleIcon size="16" class="text-success-content" />
							{:else if feedbackType === 'error'}
								<XCircleIcon size="16" class="text-error-content" />
							{:else}
								<InfoIcon size="16" class="text-info-content" />
							{/if}
							{feedbackMessage}
						</span>
						<button
							on:click={() => (feedbackMessage = '')}
							class="text-base-content/70 hover:text-base-content p-1"
						>
							<XIcon size="14" />
						</button>
					</div>
				{/if}

				<div class="flex items-center gap-2">
					<span class="text-xs font-bold opacity-60 uppercase tracking-wider">กำลังสร้าง:</span>
					<span class="text-xl sm:text-2xl font-black text-base-content tracking-wide">
						{currentWordDisplay || '...'}
					</span>
				</div>
				{#if selectedPath.length >= 2}
					<div class="flex items-center gap-1">
						{#if selectedPath.length < 3}
							<span
								class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-warning/20 text-warning-content border border-warning/30"
							>
								สั้นเกินไป
							</span>
						{:else}
							<span
								class="px-2.5 py-0.5 rounded-full text-[10px] font-bold {currentWordValid
									? 'bg-success/20 text-success-content border border-success/30'
									: 'bg-base-300 text-base-content/70'}"
							>
								{currentWordValid ? 'เป็นคำศัพท์' : 'รอสร้างต่อ'}
							</span>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Boggle Grid wrapper -->
			<div
				class="botanical-card relative w-full max-w-[400px] aspect-square bg-base-100 text-base-content border border-white/5 rounded-3xl p-3 shadow-2xl overflow-hidden select-none"
			>
				<!-- SVG Connection line overlay -->
				<svg
					class="absolute inset-0 w-full h-full pointer-events-none z-10 p-3 text-primary opacity-60"
					viewBox="0 0 100 100"
				>
					{#if pathSVGData}
						<path
							d={pathSVGData}
							stroke="currentColor"
							stroke-width="5"
							stroke-linecap="round"
							stroke-linejoin="round"
							fill="none"
							class="drop-shadow-[0_0_8px_rgba(var(--p),0.45)]"
						/>
					{/if}
				</svg>

				<!-- 4x4 Grid Cells -->
				<div
					class="grid grid-cols-4 grid-rows-4 gap-2.5 h-full w-full transition-all duration-300 {gameEnded
						? 'opacity-40 grayscale pointer-events-none'
						: ''}"
				>
					{#each grid as row, r}
						{#each row as char, c}
							{@const isSelected = selectedPath.some((p) => p.r === r && p.c === c)}
							{@const isLastSelected =
								selectedPath.length > 0 &&
								selectedPath[selectedPath.length - 1].r === r &&
								selectedPath[selectedPath.length - 1].c === c}
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<div
								on:mousedown={() => handleCellStart(r, c)}
								on:mouseenter={() => handleCellEnter(r, c)}
								on:mouseup={handleCellEnd}
								on:touchstart|preventDefault={() => handleCellStart(r, c)}
								on:touchmove|preventDefault={(e) => {
									const touch = e.touches[0];
									const element = document.elementFromPoint(touch.clientX, touch.clientY);
									if (element) {
										const targetRow = element.getAttribute('data-row');
										const targetCol = element.getAttribute('data-col');
										if (targetRow !== null && targetCol !== null) {
											handleCellEnter(parseInt(targetRow), parseInt(targetCol));
										}
									}
								}}
								data-row={r}
								data-col={c}
								class="relative flex items-center justify-center rounded-2xl cursor-pointer transition-all duration-150 border active:scale-95 shadow-inner
									{isSelected
									? isLastSelected
										? 'bg-primary border-primary text-primary-content scale-105 shadow-[0_0_15px_rgba(var(--p),0.5)] z-20'
										: 'bg-base-100 text-base-content border-primary/40 text-primary z-15'
									: 'bg-base-100 text-base-content border-base-300/40 text-base-content hover:bg-base-100 text-base-content hover:border-base-300'}"
							>
								<!-- Letter text layout optimized for Thai accents and combined characters -->
								{#if char.includes('/')}
									{@const symbols = char.split('/')}
									<div
										class="grid h-full w-full select-none pointer-events-none text-center rounded-2xl overflow-hidden
										{symbols.length === 2 ? 'grid-cols-2 divide-x' : 'grid-cols-2 grid-rows-2 divide-x divide-y'}
										{isSelected ? 'divide-primary/20' : 'divide-base-300/30'}"
									>
										{#each symbols as symbol}
											<div class="flex items-center justify-center h-full w-full">
												<span
													class="font-black select-none pointer-events-none tracking-tighter"
													class:text-2xl={symbols.length === 2}
													class:text-lg={symbols.length > 2}
													class:md:text-3xl={symbols.length === 2}
													class:md:text-xl={symbols.length > 2}
												>
													{symbol}
												</span>
											</div>
										{/each}
									</div>
								{:else}
									<span
										class="font-black select-none pointer-events-none tracking-tighter text-3xl md:text-4xl"
										class:text-4xl={isUpper(char) || isLower(char)}
										class:md:text-5xl={isUpper(char) || isLower(char)}
										class:translate-x-2={isUpper(char) || isLower(char)}
										class:translate-y-1.5={!isLower(char)}
									>
										{char}
									</span>
								{/if}
							</div>
						{/each}
					{/each}
				</div>

				<!-- Game Starting Mask -->
				{#if !isPlaying && !gameEnded}
					<div
						class="absolute inset-0 bg-base-100 text-base-content backdrop-blur-[3px] z-30 flex flex-col items-center justify-center p-6 text-center"
					>
						<div class="flex flex-col items-center gap-4 max-w-[280px]">
							<div
								class="w-14 h-14 bg-primary/10 border border-primary/30 rounded-2xl flex items-center justify-center text-primary shadow-inner animate-pulse"
							>
								<CompassIcon size="28" />
							</div>
							<div class="flex flex-col gap-1.5">
								<h3 class="text-lg font-extrabold text-base-content">พร้อมเล่นไหม? ⏱️</h3>
								<p class="text-xs opacity-70 leading-relaxed font-bold">
									เวลาจำกัด 2 นาที คุณจะหาคำภาษาไทยในตาราง 4x4 ได้ทั้งหมดกี่คำ?
								</p>
							</div>
							<button
								on:click={startNewGame}
								class="btn btn-primary w-full gap-2 font-bold rounded-xl shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all text-sm py-3.5 h-auto"
							>
								<PlayCircleIcon size="16" />
								เริ่มเล่นเกม
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Right Column: Stats, Timers, List of Found Words -->
		<div class="lg:col-span-5 flex flex-col gap-4">
			<!-- Score & Timer Card -->
			<div
				class="botanical-card w-full h-14 bg-base-100 text-base-content border border-base-300 rounded-2xl flex items-center justify-between px-6 shadow-xl relative overflow-hidden"
			>
				<div class="flex items-center gap-3">
					<AwardIcon size="18" class="text-warning-content" />
					<div class="flex items-center gap-1.5">
						<span class="text-xs font-bold opacity-60 uppercase tracking-wider">คะแนน:</span>
						<span class="text-xl font-black text-primary font-mono">{score}</span>
					</div>
				</div>

				<div class="divider divider-horizontal my-2.5 opacity-20" />

				<div class="flex items-center gap-3">
					<div
						class="w-8 h-8 rounded-lg flex items-center justify-center
						{timeLeft > 20
							? 'bg-primary/15 border border-primary/30 text-primary'
							: 'bg-error/15 border border-error/30 text-error-content animate-pulse'}"
					>
						<span class="font-bold text-sm font-mono">{timeLeft}</span>
					</div>
					<div class="flex flex-col">
						<span class="text-xs font-black text-base-content">
							{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
						</span>
					</div>
				</div>

				<!-- Timer Bar absolute at bottom -->
				<div class="absolute bottom-0 left-0 w-full bg-base-300/40 h-1 overflow-hidden">
					<div
						class="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(var(--p),0.4)]"
						style="width: {(timeLeft / 120) * 100}%"
					/>
				</div>
			</div>

			<!-- Found Words Board -->
			<div
				class="botanical-card bg-base-100 text-base-content border border-base-300 p-4 md:p-5 rounded-2xl shadow-xl flex-1 flex flex-col min-h-[180px] md:min-h-[300px] max-h-[280px] md:max-h-[480px]"
			>
				{#if gameEnded}
					{@const pct =
						allPossibleWords.length > 0
							? Math.round((foundWords.size / allPossibleWords.length) * 100)
							: 0}
					<h3
						class="text-sm font-bold text-base-content uppercase tracking-widest flex items-center gap-1.5 border-b border-base-300/60 pb-3 mb-3"
					>
						<AwardIcon size="16" class="text-warning-content animate-bounce" />
						สรุปผลการเล่น 🎉
					</h3>

					<div
						class="grid grid-cols-2 gap-2 bg-base-100 p-2.5 rounded-xl border border-base-300 shadow-inner text-center mb-3"
					>
						<div class="flex flex-col">
							<span class="text-[9px] opacity-60 font-bold uppercase tracking-wider"
								>คะแนนที่ทำได้</span
							>
							<span class="text-lg font-black text-primary font-mono">{score} คะแนน</span>
						</div>
						<div class="flex flex-col">
							<span class="text-[9px] opacity-60 font-bold uppercase tracking-wider">คำที่พบ</span>
							<span class="text-lg font-black text-success-content font-mono">{pct}%</span>
						</div>
					</div>

					<div class="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
						<!-- List of words player found -->
						<div class="flex flex-col gap-1">
							<span class="text-xs font-bold text-success-content flex items-center gap-1">
								<CheckCircleIcon size="11" />
								คำที่คุณพบ ({foundWords.size})
							</span>
							{#if foundWords.size === 0}
								<p class="text-[10px] text-base-content/70 italic pl-1">ยังไม่มีคำศัพท์ที่พบ</p>
							{:else}
								<div class="flex flex-wrap gap-1">
									{#each Array.from(foundWords) as word}
										<span
											class="px-2 py-0.5 text-xs font-semibold bg-success/10 text-success-content border border-success/20 rounded-md"
										>
											{word}
										</span>
									{/each}
								</div>
							{/if}
						</div>

						<div class="divider my-0 opacity-10" />

						<!-- All missed words list -->
						<div class="flex flex-col gap-1">
							<span class="text-xs font-bold text-error-content flex items-center gap-1">
								<XCircleIcon size="11" />
								คำศัพท์ที่คุณพลาดไป ({missedWords.length})
							</span>
							{#if missedWords.length === 0}
								<p class="text-[10px] text-base-content/70 italic pl-1">ยอดเยี่ยม! ไม่พลาดเลย</p>
							{:else}
								<div class="flex flex-wrap gap-1">
									{#each missedWords as word}
										<span
											class="px-2 py-0.5 text-xs font-semibold rounded-md border bg-base-100 border-base-300 text-base-content/70"
										>
											{word}
										</span>
									{/each}
								</div>
							{/if}
						</div>
					</div>

					<button
						on:click={startNewGame}
						class="btn btn-primary w-full mt-3 font-bold rounded-xl shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all text-sm py-2.5 h-auto"
					>
						เริ่มเล่นรอบใหม่
					</button>
				{:else}
					<!-- Normal playing view -->
					<h3
						class="text-xs sm:text-sm font-bold text-base-content/70 uppercase tracking-widest flex items-center justify-between border-b border-base-300/60 pb-3 mb-3"
					>
						<span class="flex items-center gap-1.5 text-base-content">
							<CheckCircleIcon size="15" class="text-success-content" />
							คำศัพท์ที่พบ ({foundWords.size} คำ)
						</span>
						<button
							on:click={() => (showPossibleCount = !showPossibleCount)}
							class="btn btn-ghost btn-xs font-bold text-base-content/70 hover:text-base-content shadow-sm bg-base-100/50 rounded-lg text-[9px] px-2"
						>
							{showPossibleCount ? 'ซ่อน' : 'แสดง'}จำนวนที่เป็นไปได้
						</button>
					</h3>

					{#if showPossibleCount}
						<div
							class="mb-3 text-[10px] text-base-content/70 flex flex-wrap gap-x-2 gap-y-1 font-semibold items-center bg-base-100/40 px-2.5 py-1.5 rounded-xl border border-base-300 justify-between"
						>
							<div>
								3 ตัว: <span class="text-primary font-mono font-bold"
									>{possibleCountsByLength['3'] || 0}</span
								>
							</div>
							<div class="w-1 h-1 rounded-full bg-base-300" />
							<div>
								4 ตัว: <span class="text-primary font-mono font-bold"
									>{possibleCountsByLength['4'] || 0}</span
								>
							</div>
							<div class="w-1 h-1 rounded-full bg-base-300" />
							<div>
								5 ตัว: <span class="text-primary font-mono font-bold"
									>{possibleCountsByLength['5'] || 0}</span
								>
							</div>
							<div class="w-1 h-1 rounded-full bg-base-300" />
							<div>
								6+ ตัว: <span class="text-primary font-mono font-bold"
									>{possibleCountsByLength['6+'] || 0}</span
								>
							</div>
							<div class="w-1 h-1 rounded-full bg-base-300" />
							<div class="text-base-content/70">
								รวม: <span class="text-primary font-mono font-black">{allPossibleWords.length}</span
								> คำ
							</div>
						</div>
					{/if}

					<div class="flex-1 overflow-y-auto flex flex-wrap gap-2.5 align-content-start pr-1">
						{#if foundWords.size === 0}
							<div
								class="w-full flex flex-col items-center justify-center gap-2 py-8 text-center text-base-content/70 opacity-60"
							>
								<span class="text-3xl">🔍</span>
								<p class="text-xs font-medium">ยังไม่พบคำศัพท์ ลากเส้นบนตารางเพื่อหาคำศัพท์เลย!</p>
							</div>
						{:else}
							{#each Array.from(foundWords) as word}
								<span
									class="px-3 py-1.5 text-sm md:text-base font-bold bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center gap-1 shadow-sm transition-all hover:scale-105"
								>
									{word}
									<span class="text-[10px] opacity-60 font-mono font-black"
										>({getWordScore(word)})</span
									>
								</span>
							{/each}
						{/if}
					</div>

					<!-- End game actions -->
					{#if isPlaying}
						<button
							on:click={endGame}
							class="btn btn-outline btn-error w-full mt-4 gap-1.5 rounded-xl text-xs font-bold"
						>
							<XCircleIcon size="14" />
							เปิดเฉลย
						</button>
					{/if}
				{/if}
			</div>
		</div>
	</div>
</div>

	<!-- How to play Modal -->
	{#if showRulesModal}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-base-100 text-base-content backdrop-blur-md p-4 transition-all duration-300"
		>
			<div
				class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-6 relative animate-in fade-in zoom-in-95 duration-200 text-base-content"
			>
				<button
					on:click={() => (showRulesModal = false)}
					class="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-base-100 text-base-content/70 hover:text-base-content transition-all"
				>
					<XIcon size="18" />
				</button>

				<div class="flex items-center gap-3">
					<CompassIcon class="text-primary" size="24" />
					<h3 class="text-xl font-black text-base-content">วิธีการเล่น</h3>
				</div>

				<div
					class="flex flex-col gap-4 text-xs md:text-sm text-base-content/70 leading-relaxed text-left"
				>
					<div class="bg-base-100 p-4 rounded-xl border border-base-300 flex flex-col gap-2.5">
						<span class="text-primary font-bold text-xs uppercase tracking-wider">กติกา</span>
						<ul class="list-disc text-left pl-5 flex flex-col gap-1.5 opacity-90 text-base-content">
							<li>คลิกเพื่อเชื่อมตัวอักษรที่ติดกันในแนวตั้ง แนวนอน หรือแนวทแยง</li>
							<li>ใช้ 3 ช่องหรือมากกว่า</li>
							<li>ห้ามใช้ช่องเดิมซ้ำ</li>
						</ul>
					</div>

					<div class="bg-base-100 p-4 rounded-xl border border-base-300 flex flex-col gap-2.5">
						<span class="text-warning-content font-bold text-xs uppercase tracking-wider">การนับคะแนน</span>
						<ul class="list-disc text-left pl-5 flex flex-col gap-1.5 opacity-90 text-base-content">
							<li>3 ตัวอักษร = 1 คะแนน</li>
							<li>4 ตัวอักษร = 2 คะแนน</li>
							<li>5 ตัวอักษร = 4 คะแนน</li>
							<li>6 ตัวอักษร = 6 คะแนน</li>
							<li>7 ตัวอักษรขึ้นไป = 9 คะแนน</li>
						</ul>
					</div>
				</div>

				<button
					on:click={() => (showRulesModal = false)}
					class="btn btn-primary w-full font-bold rounded-xl shadow-lg transition-all text-center"
				>
					ปิด
				</button>
			</div>
		</div>
	{/if}
</div>
