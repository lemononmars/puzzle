<script lang="ts">
	import { search, splitWord } from '#lib/thwordsearch.js';
	import { onMount } from 'svelte';
	import { beforeNavigate } from '$app/navigation';
	import {
		PlusSquareIcon,
		MinusSquareIcon,
		CheckSquareIcon,
		DownloadIcon,
		CornerUpLeftIcon,
		GridIcon,
		HashIcon,
		Maximize2Icon,
		ZapIcon,
		ClipboardIcon,
		XIcon,
		CloudIcon,
		ExternalLinkIcon,
		InfoIcon,
		ChevronRightIcon,
		CheckCircleIcon
	} from 'svelte-feather-icons';

	let cellSize = 44; // px
	let numZoom = 1.0;
	const CELL_MIN = 24;
	const CELL_MAX = 80;

	type Cell = { letter: string; black: boolean };

	let rows = 5;
	let cols = 5;
	let grid: Cell[][] = [];

	// Modal
	let showModal = false;
	let modalRows = 5;
	let modalCols = 5;

	$: effectiveCellSize = showResizeControls ? Math.min(cellSize, 34) : cellSize;

	// Selection
	let selectedRow = -1;
	let selectedCol = -1;

	// Suggestions
	let acrossPattern = '';
	let downPattern = '';
	let acrossResults: string[] = [];
	let downResults: string[] = [];
	let loadingSuggestions = false;
	let strict = false;
	let smartMode = false;
	let includeWiki = true;
	let showResizeControls = false;
	let showImportModal = false;
	let importText = '';
	let suggestionZoom = 1.0;
	let suggestionAbort: AbortController | null = null;

	// Clue Management
	let title = '';
	let author = '';
	let clues: Record<string, string> = {}; // key: "dir-r-c"
	let isSavingToDB = false;
	let saveStatus = '';
	let isPublic = true;
	let toasts: { id: number; message: string; type: 'info' | 'success' | 'error' }[] = [];
	let toastId = 0;
	let showQuickTips = true;

	function addToast(message: string, type: 'info' | 'success' | 'error' = 'info') {
		const id = toastId++;
		toasts = [...toasts, { id, message, type }];
		setTimeout(() => {
			toasts = toasts.filter((t) => t.id !== id);
		}, 3000);
	}

	// Stepped Workflow
	let currentStep = 1; // 1: Construct, 2: Clues, 3: Share

	function goToStep(s: number) {
		currentStep = s;
	}

	function getSlotWord(r: number, c: number, dir: 'across' | 'down') {
		const slot = getSlot(r, c, dir);
		return slot.map((cell) => cell.letter || '').join('');
	}

	$: detectedClues = (() => {
		if (grid.length === 0) return [];
		const clues: any[] = [];
		const numbers = cellNumbers;

		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				if (grid[r][c].black) continue;
				const posKey = `${r},${c}`;
				if (numbers.has(posKey)) {
					const index = numbers.get(posKey);
					// Across
					if ((c === 0 || grid[r][c - 1].black) && c < cols - 1 && !grid[r][c + 1].black) {
						clues.push({
							index,
							r,
							c,
							direction: 'across',
							answer: getSlotWord(r, c, 'across')
						});
					}
					// Down
					if ((r === 0 || grid[r - 1][c].black) && r < rows - 1 && !grid[r + 1][c].black) {
						clues.push({
							index,
							r,
							c,
							direction: 'down',
							answer: getSlotWord(r, c, 'down')
						});
					}
				}
			}
		}
		return clues;
	})();

	let savedLink = '';

	async function saveToDatabase(publicMode: boolean) {
		isPublic = publicMode;
		if (!title.trim()) {
			saveStatus = 'กรุณาใส่ชื่อปริศนา';
			return;
		}

		isSavingToDB = true;
		saveStatus = 'กำลังบันทึก...';
		savedLink = '';

		const cluesToSave = detectedClues.map((c) => ({
			clue: clues[`${c.direction}-${c.r}-${c.c}`] || '',
			answer: c.answer,
			direction: c.direction,
			position: [c.c, c.r] // UI uses [c, r] format for database
		}));

		const uid = Math.random().toString(36).substring(2, 12);

		try {
			const res = await fetch('/api/puzzle/add', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					type: 'crossword',
					data: {
						title,
						author,
						row: rows,
						col: cols,
						clues: cluesToSave,
						uid,
						is_public: isPublic,
						created_at: new Date().toISOString()
					}
				})
			});

			if (!res.ok) throw new Error('Failed to save');

			saveStatus = 'บันทึกสำเร็จ!';
			savedLink = `${window.location.origin}/puzzles/crossword/${uid}`;
		} catch (error: any) {
			console.error(error);
			saveStatus = 'เกิดข้อผิดพลาด: ' + error.message;
		} finally {
			isSavingToDB = false;
		}
	}

	function initGrid(r: number, c: number) {
		grid = Array.from({ length: r }, () =>
			Array.from({ length: c }, () => ({ letter: '', black: false }))
		);
		rows = r;
		cols = c;
		selectedRow = -1;
		selectedCol = -1;
		acrossResults = [];
		downResults = [];

		// Auto-scale cell size
		if (typeof window !== 'undefined') {
			const availW = window.innerWidth * 0.8;
			const availH = window.innerHeight * 0.6;
			const fitW = Math.floor(availW / c);
			const fitH = Math.floor(availH / r);
			cellSize = Math.min(CELL_MAX, Math.max(CELL_MIN, Math.min(fitW, fitH)));
		}
	}

	onMount(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (grid.some((row) => row.some((c) => c.letter || c.black))) {
				e.preventDefault();
				e.returnValue = '';
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	});

	beforeNavigate(({ cancel, shallow, type }) => {
		if (shallow && type === 'goto') return;

		if (grid.some((row) => row.some((c) => c.letter || c.black))) {
			if (!confirm('ยังไม่ได้บันทึก ต้องการออกจากหน้านี้ใช่หรือไม่?')) {
				cancel();
			}
		}
	});

	function openModal() {
		modalRows = rows;
		modalCols = cols;
		showModal = true;
	}

	function confirmModal() {
		initGrid(modalRows, modalCols);
		showModal = false;
	}

	function getCellNumbers(): Map<string, number> {
		const numbers = new Map<string, number>();
		let n = 1;
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				if (grid[r][c].black) continue;
				const startsAcross =
					(c === 0 || grid[r][c - 1].black) && c < cols - 1 && !grid[r][c + 1].black;
				const startsDown =
					(r === 0 || grid[r - 1][c].black) && r < rows - 1 && !grid[r + 1][c].black;
				if (startsAcross || startsDown) {
					numbers.set(`${r},${c}`, n++);
				}
			}
		}
		return numbers;
	}

	function getSlotBounds(r: number, c: number, dir: 'across' | 'down') {
		let start = dir === 'across' ? c : r;
		let end = start;

		if (dir === 'across') {
			while (start > 0 && !grid[r][start - 1].black) start--;
			while (end < cols - 1 && !grid[r][end + 1].black) end++;
		} else {
			while (start > 0 && !grid[start - 1][c].black) start--;
			while (end < rows - 1 && !grid[end + 1][c].black) end++;
		}
		return { start, end };
	}

	function getSlot(r: number, c: number, dir: 'across' | 'down'): Cell[] {
		const { start, end } = getSlotBounds(r, c, dir);
		if (dir === 'across') {
			return grid[r].slice(start, end + 1);
		} else {
			return grid.slice(start, end + 1).map((row) => row[c]);
		}
	}

	function buildPattern(cells: Cell[]) {
		return cells.map((cell) => cell.letter || '.').join('');
	}

	function getSlotInfo(r: number, c: number, dir: 'across' | 'down') {
		const { start, end } = getSlotBounds(r, c, dir);
		if (dir === 'across') {
			const coords = [];
			for (let i = start; i <= end; i++) coords.push({ r, c: i });
			return { coords, pattern: buildPattern(grid[r].slice(start, end + 1)), start };
		} else {
			const cells = grid.slice(start, end + 1).map((row) => row[c]);
			const coords = [];
			for (let i = start; i <= end; i++) coords.push({ r: i, c });
			return { coords, pattern: buildPattern(cells), start };
		}
	}

	async function updateSuggestions() {
		if (selectedRow < 0 || selectedCol < 0 || showResizeControls) return;
		if (suggestionAbort) suggestionAbort.abort();
		suggestionAbort = new AbortController();
		const sig = suggestionAbort.signal;
		loadingSuggestions = true;
		acrossResults = [];
		downResults = [];

		const aInfo = getSlotInfo(selectedRow, selectedCol, 'across');
		const dInfo = getSlotInfo(selectedRow, selectedCol, 'down');
		acrossPattern = aInfo.pattern;
		downPattern = dInfo.pattern;

		const aIdx = selectedCol - aInfo.start;
		const dIdx = selectedRow - dInfo.start;

		try {
			const [aRes, dRes] = await Promise.all([
				aInfo.coords.length > 1
					? search(acrossPattern, includeWiki, sig, undefined, strict)
					: Promise.resolve({ results: [], valid: false, count: 0 }),
				dInfo.coords.length > 1
					? search(downPattern, includeWiki, sig, undefined, strict)
					: Promise.resolve({ results: [], valid: false, count: 0 })
			]);

			let aResList = aRes?.results ?? [];
			let dResList = dRes?.results ?? [];

			if (smartMode) {
				// Smart mode: Check ALL intersecting slots for each word
				const [aConstraints, dConstraints] = await Promise.all([
					// Constraints for across words (from down slots)
					Promise.all(
						aInfo.coords.map(async (coord) => {
							if (coord.r === selectedRow && coord.c === selectedCol) {
								return dInfo.coords.length > 1
									? new Set(dResList.map((w) => splitWord(w)[dIdx]))
									: null;
							}
							const ds = getSlot(coord.r, coord.c, 'down');
							if (ds.length <= 1) return null;
							const pattern = buildPattern(ds);
							let startR = coord.r;
							while (startR > 0 && !grid[startR - 1][coord.c].black) startR--;
							const intersectIdx = coord.r - startR;
							const res = await search(pattern, includeWiki, sig, undefined, strict);
							return new Set((res?.results ?? []).map((w) => splitWord(w)[intersectIdx]));
						})
					),
					// Constraints for down words (from across slots)
					Promise.all(
						dInfo.coords.map(async (coord) => {
							if (coord.r === selectedRow && coord.c === selectedCol) {
								return aInfo.coords.length > 1
									? new Set(aResList.map((w) => splitWord(w)[aIdx]))
									: null;
							}
							const as = getSlot(coord.r, coord.c, 'across');
							if (as.length <= 1) return null;
							const pattern = buildPattern(as);
							let startC = coord.c;
							while (startC > 0 && !grid[coord.r][startC - 1].black) startC--;
							const intersectIdx = coord.c - startC;
							const res = await search(pattern, includeWiki, sig, undefined, strict);
							return new Set((res?.results ?? []).map((w) => splitWord(w)[intersectIdx]));
						})
					)
				]);

				acrossResults = aResList.filter((word) => {
					const chars = splitWord(word);
					return chars.every((char, i) => {
						const constraint = aConstraints[i];
						return !constraint || constraint.has(char);
					});
				});
				downResults = dResList.filter((word) => {
					const chars = splitWord(word);
					return chars.every((char, i) => {
						const constraint = dConstraints[i];
						return !constraint || constraint.has(char);
					});
				});
			} else {
				// Simple mode: Only check intersection at current cell
				if (aInfo.coords.length > 1 && dInfo.coords.length > 1) {
					const aPossibleChars = new Set(aResList.map((w) => splitWord(w)[aIdx]));
					const dPossibleChars = new Set(dResList.map((w) => splitWord(w)[dIdx]));
					acrossResults = aResList.filter((w) => dPossibleChars.has(splitWord(w)[aIdx]));
					downResults = dResList.filter((w) => aPossibleChars.has(splitWord(w)[dIdx]));
				} else {
					acrossResults = aResList;
					downResults = dResList;
				}
			}
		} catch (e) {
			// aborted
		} finally {
			loadingSuggestions = false;
		}
	}

	function fillSlot(r: number, c: number, dir: 'across' | 'down', word: string) {
		saveHistory();
		const chars = splitThaiCells(word);
		// Figure out slot start
		if (dir === 'across') {
			let start = c;
			while (start > 0 && !grid[r][start - 1].black) start--;
			for (let i = 0; i < chars.length && start + i < cols; i++) {
				if (!grid[r][start + i].black) grid[r][start + i].letter = chars[i];
			}
		} else {
			let start = r;
			while (start > 0 && !grid[start - 1][c].black) start--;
			for (let i = 0; i < chars.length && start + i < rows; i++) {
				if (!grid[start + i][c].black) grid[start + i][c].letter = chars[i];
			}
		}
		grid = grid;
		updateSuggestions();
		syncHiddenInput();
	}

	function toggleBlack(r: number, c: number) {
		saveHistory();
		grid[r][c].black = !grid[r][c].black;
		grid[r][c].letter = '';
		showQuickTips = false;
		if (selectedRow === r && selectedCol === c) {
			selectedRow = -1;
			selectedCol = -1;
		}
		grid = grid;
	}

	let hiddenInput: HTMLInputElement;

	function splitThaiCells(text: string): string[] {
		const out: string[] = [];
		const alphas = [...text];
		const startRegex = /[ก-ฮใเแโไาำะๆฯฤา]/;
		const thaiRegex = /[\u0E00-\u0E7F]/;

		alphas
			.filter((a) => thaiRegex.test(a))
			.forEach((a) => {
				if (startRegex.test(a)) {
					out.push(a);
				} else if (out.length > 0) {
					out[out.length - 1] += a;
				} else {
					out.push(a);
				}
			});
		return out;
	}

	function syncHiddenInput() {
		if (!hiddenInput || selectedRow < 0 || selectedCol < 0) return;
		hiddenInput.value = grid[selectedRow][selectedCol].letter;
		// Defer focus so click event doesn't steal it back
		setTimeout(() => {
			hiddenInput?.focus();
			const len = hiddenInput?.value.length ?? 0;
			hiddenInput?.setSelectionRange(len, len);
		}, 0);
	}

	function handleCellInput() {
		if (selectedRow < 0 || selectedCol < 0 || showResizeControls) return;
		saveHistory();
		const newValue = hiddenInput.value;
		const parts = splitThaiCells(newValue);
		if (parts.length === 0) {
			grid[selectedRow][selectedCol].letter = '';
		} else if (parts.length === 1) {
			grid[selectedRow][selectedCol].letter = parts[0];
		} else {
			grid[selectedRow][selectedCol].letter = parts[0];
			for (let i = 1; i < parts.length; i++) {
				if (moveCursorNoUpdate(0, 1)) {
					grid[selectedRow][selectedCol].letter = parts[i];
				}
			}
			hiddenInput.value = grid[selectedRow][selectedCol].letter;
			hiddenInput.setSelectionRange(hiddenInput.value.length, hiddenInput.value.length);
		}
		grid = grid;
		updateSuggestions();
	}

	function selectCell(r: number, c: number) {
		if (grid[r][c].black) return;
		selectedRow = r;
		selectedCol = c;
		showQuickTips = false;
		updateSuggestions();
		syncHiddenInput();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (selectedRow < 0 || selectedCol < 0) return;
		if (showModal || showResizeControls) return;

		switch (e.key) {
			case 'Escape':
				selectedRow = -1;
				selectedCol = -1;
				return;
			case 'ArrowRight':
				e.preventDefault();
				moveCursor(0, 1);
				return;
			case 'ArrowLeft':
				e.preventDefault();
				moveCursor(0, -1);
				return;
			case 'ArrowDown':
				e.preventDefault();
				moveCursor(1, 0);
				return;
			case 'ArrowUp':
				e.preventDefault();
				moveCursor(-1, 0);
				return;
			case 'Delete':
				e.preventDefault();
				saveHistory();
				grid[selectedRow][selectedCol].letter = '';
				grid = grid;
				syncHiddenInput();
				updateSuggestions();
				return;
		}
	}

	function moveCursorNoUpdate(dr: number, dc: number): boolean {
		let r = selectedRow + dr;
		let c = selectedCol + dc;
		while (r >= 0 && r < rows && c >= 0 && c < cols) {
			if (!grid[r][c].black) {
				selectedRow = r;
				selectedCol = c;
				return true;
			}
			r += dr;
			c += dc;
		}
		return false;
	}

	function moveCursor(dr: number, dc: number): boolean {
		const moved = moveCursorNoUpdate(dr, dc);
		if (moved) {
			syncHiddenInput();
			updateSuggestions();
		}
		return moved;
	}

	$: cellNumbers = grid.length > 0 ? getCellNumbers() : new Map<string, number>();

	// ─── Solver ───────────────────────────────────────────
	let isSolving = false;
	let solveAbort: AbortController | null = null;

	function getSlots() {
		const slots: { cells: { r: number; c: number }[]; dir: 'across' | 'down' }[] = [];
		for (let r = 0; r < rows; r++) {
			let c = 0;
			while (c < cols) {
				if (!grid[r][c].black) {
					const s = c;
					while (c < cols && !grid[r][c].black) c++;
					if (c - s > 1)
						slots.push({
							cells: Array.from({ length: c - s }, (_, i) => ({ r, c: s + i })),
							dir: 'across'
						});
				} else c++;
			}
		}
		for (let c = 0; c < cols; c++) {
			let r = 0;
			while (r < rows) {
				if (!grid[r][c].black) {
					const s = r;
					while (r < rows && !grid[r][c].black) r++;
					if (r - s > 1)
						slots.push({
							cells: Array.from({ length: r - s }, (_, i) => ({ r: s + i, c })),
							dir: 'down'
						});
				} else r++;
			}
		}
		return slots.filter((slot) => slot.cells.some(({ r, c }) => !grid[r][c].letter));
	}

	function slotPattern(slot: { cells: { r: number; c: number }[] }, g: Cell[][]) {
		return slot.cells.map(({ r, c }) => g[r][c].letter || '.').join('');
	}

	async function finishGrid() {
		saveHistory();
		isSolving = true;
		if (solveAbort) solveAbort.abort();
		solveAbort = new AbortController();
		const sig = solveAbort.signal;

		const timeoutId = setTimeout(() => {
			if (isSolving) {
				solveAbort?.abort();
			}
		}, 60000);

		try {
			const slots = getSlots();
			const tempGrid = grid.map((row) => row.map((c) => ({ ...c })));
			const wordLists: string[][] = [];
			for (const slot of slots) {
				if (sig.aborted) return;
				const res = await search(slotPattern(slot, tempGrid), includeWiki, sig, undefined, strict);
				wordLists.push(res?.results ?? []);
			}
			if (sig.aborted) return;

			// Optimization: Sort slots by number of candidates (MCV - Most Constrained Variable first)
			// This drastically reduces the search space by filling hard slots early.
			// Also shuffle each word list for variety.
			const combined = slots.map((s, i) => ({
				slot: s,
				list: wordLists[i].sort(() => Math.random() - 0.5)
			}));
			combined.sort((a, b) => a.list.length - b.list.length);

			const sortedSlots = combined.map((c) => c.slot);
			const sortedWordLists = combined.map((c) => c.list);

			const ok = await solveBacktrack(tempGrid, sortedSlots, sortedWordLists, 0, sig, new Set());
			if (!sig.aborted) {
				if (ok) {
					grid = tempGrid;
					grid = grid;
					addToast('เติมคำสำเร็จ!', 'success');
				} else {
					addToast('ไม่พบคำที่ลงตัวในตารางนี้', 'error');
				}
			}
		} catch (e) {
			// error or abort
		} finally {
			clearTimeout(timeoutId);
			isSolving = false;
		}
	}

	async function solveBacktrack(
		g: Cell[][],
		slots: { cells: { r: number; c: number }[] }[],
		wl: string[][],
		idx: number,
		sig: AbortSignal,
		usedWords: Set<string>
	): Promise<boolean> {
		if (sig.aborted || idx === slots.length) return !sig.aborted;
		await new Promise((r) => setTimeout(r, 0));

		const slot = slots[idx];
		const candidates = wl[idx].filter((word) => {
			if (usedWords.has(word)) return false;
			const parts = splitThaiCells(word);
			if (parts.length !== slot.cells.length) return false;
			return parts.every((p, i) => {
				const existing = g[slot.cells[i].r][slot.cells[i].c].letter;
				return !existing || existing === p;
			});
		});

		let count = 0;
		for (const word of candidates) {
			if (sig.aborted) return false;
			count++;
			if (count % 25 === 0) await new Promise((r) => setTimeout(r, 0));

			const backup = slot.cells.map(({ r, c }) => g[r][c].letter);
			const parts = splitThaiCells(word);
			slot.cells.forEach(({ r, c }, i) => {
				g[r][c].letter = parts[i] ?? '';
			});
			usedWords.add(word);
			if (await solveBacktrack(g, slots, wl, idx + 1, sig, usedWords)) return true;
			usedWords.delete(word);
			slot.cells.forEach(({ r, c }, i) => {
				g[r][c].letter = backup[i];
			});
		}
		return false;
	}

	// ─── Grid Resizing ──────────────────────────────────
	function addRowTop() {
		saveHistory();
		grid = [Array.from({ length: cols }, () => ({ letter: '', black: false })), ...grid];
		rows++;
		if (selectedRow >= 0) selectedRow++;
		grid = grid;
	}
	function addRowBottom() {
		saveHistory();
		grid = [...grid, Array.from({ length: cols }, () => ({ letter: '', black: false }))];
		rows++;
		grid = grid;
	}
	function removeRowTop() {
		if (rows <= 3) return;
		saveHistory();
		grid = grid.slice(1);
		rows--;
		if (selectedRow === 0) {
			selectedRow = -1;
			selectedCol = -1;
		} else if (selectedRow > 0) {
			selectedRow--;
		}
		grid = grid;
	}
	function removeRowBottom() {
		if (rows <= 3) return;
		saveHistory();
		grid = grid.slice(0, -1);
		rows--;
		if (selectedRow === rows) {
			selectedRow = -1;
			selectedCol = -1;
		}
		grid = grid;
	}
	function addColLeft() {
		saveHistory();
		grid = grid.map((row) => [{ letter: '', black: false }, ...row]);
		cols++;
		if (selectedCol >= 0) selectedCol++;
		grid = grid;
	}
	function addColRight() {
		saveHistory();
		grid = grid.map((row) => [...row, { letter: '', black: false }]);
		cols++;
		grid = grid;
	}
	function removeColLeft() {
		if (cols <= 3) return;
		saveHistory();
		grid = grid.map((row) => row.slice(1));
		cols--;
		if (selectedCol === 0) {
			selectedRow = -1;
			selectedCol = -1;
		} else if (selectedCol > 0) {
			selectedCol--;
		}
		grid = grid;
	}
	function removeColRight() {
		if (cols <= 3) return;
		saveHistory();
		grid = grid.map((row) => row.slice(0, -1));
		cols--;
		if (selectedCol === cols) {
			selectedRow = -1;
			selectedCol = -1;
		}
		grid = grid;
	}

	// ─── Undo/History ───────────────────────────────────
	let history: string[] = [];
	const MAX_HISTORY = 50;

	function saveHistory() {
		const state = JSON.stringify(grid);
		if (history.length > 0 && history[history.length - 1] === state) return;
		history.push(state);
		if (history.length > MAX_HISTORY) history.shift();
		history = history;
	}

	function undo() {
		if (history.length === 0) return;
		const prevState = history.pop();
		if (!prevState) return;
		grid = JSON.parse(prevState);
		grid = grid;
		history = history;
		updateSuggestions();
		syncHiddenInput();
	}

	// ─── Export ──────────────────────────────────────────
	function exportCSV() {
		let csv = '\uFEFF'; // UTF-8 BOM for Excel/Thai support
		csv += `Title,${title}\n`;
		csv += `Author,${author}\n\n`;

		csv += 'GRID\n';
		for (let r = 0; r < rows; r++) {
			const rowChars = grid[r].map((c) => c.black ? '#' : c.letter || ' ');
			csv += rowChars.join(',') + '\n';
		}

		csv += '\nCLUES\n';
		csv += 'No,Dir,Answer,Clue\n';
		detectedClues.forEach((c) => {
			const hint = (clues[`${c.direction}-${c.r}-${c.c}`] || '').replace(/"/g, '""');
			csv += `${c.index},${c.direction},${c.answer},"${hint}"\n`;
		});

		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.setAttribute('href', url);
		link.setAttribute('download', `${title || 'crossword'}.csv`);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function exportPNG(showAnswers = false) {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const padding = 40;
		const drawCellSize = 50;
		const gridWidth = cols * drawCellSize;
		const gridHeight = rows * drawCellSize;
		const cluePanelWidth = 360;
		const gridStartY = padding + 60;
		let currY = gridStartY;

		// Pre-calculate height based on actual line wrapping
		ctx.font = 'bold 18px DM Sans, Noto Serif Thai';
		const sectionTitleHeight = 25;
		const clueLineHeight = 20;
		const clueSpacing = 5;
		const sectionSpacing = 20;

		const estimateSectionHeight = (dir: string) => {
			let h = sectionTitleHeight;
			const list = detectedClues.filter((c) => c.direction === dir);
			list.forEach((c) => {
				const hint = clues[`${c.direction}-${c.r}-${c.c}`] || '(ว่าง)';
				const text = `${c.index}. ${hint}`;
				const words = text.split(' ');
				let line = '';
				let lineCount = 1;
				ctx.font = '14px DM Sans, Noto Serif Thai';
				for (let i = 0; i < words.length; i++) {
					const testLine = line + words[i] + ' ';
					if (ctx.measureText(testLine).width > cluePanelWidth && i > 0) {
						lineCount++;
						line = words[i] + ' ';
					} else {
						line = testLine;
					}
				}
				h += lineCount * clueLineHeight + clueSpacing;
			});
			return h + sectionSpacing;
		};

		const totalCluesHeight =
			currY + estimateSectionHeight('across') + estimateSectionHeight('down');

		canvas.width = gridWidth + cluePanelWidth + padding * 2.5;
		const baseHeight = gridHeight + padding * 3.5;
		canvas.height = Math.max(baseHeight, totalCluesHeight, 600);

		// Background
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Header
		ctx.fillStyle = '#000000';
		ctx.font = 'bold 32px DM Sans, Noto Serif Thai';
		ctx.fillText(title || 'อักษรไขว้', padding, padding);
		ctx.font = '16px DM Sans, Noto Serif Thai';
		ctx.fillStyle = '#666666';
		ctx.fillText(`By ${author || 'นิรนาม'}`, padding, padding + 30);

		// Draw cells
		grid.forEach((row, r) => {
			row.forEach((cell, c) => {
				const x = padding + c * drawCellSize;
				const y = gridStartY + r * drawCellSize;

				if (cell.black) {
					ctx.fillStyle = '#000000';
					ctx.fillRect(x, y, drawCellSize, drawCellSize);
				} else {
					ctx.strokeStyle = '#333333';
					ctx.lineWidth = 1;
					ctx.strokeRect(x, y, drawCellSize, drawCellSize);

					// Number
					const posKey = `${r},${c}`;
					if (cellNumbers.has(posKey)) {
						ctx.fillStyle = '#000000';
						ctx.font = '10px DM Sans, Noto Serif Thai';
						ctx.fillText((cellNumbers.get(posKey)!).toString(), x + 4, y + 12);
					}

					// Letter (Answer)
					if (showAnswers && cell.letter) {
						ctx.fillStyle = '#000000';
						ctx.font = 'bold 24px DM Sans, Noto Serif Thai';
						ctx.textAlign = 'center';
						ctx.textBaseline = 'middle';
						ctx.fillText(cell.letter, x + drawCellSize / 2, y + drawCellSize / 2 + 5);
						ctx.textAlign = 'start';
						ctx.textBaseline = 'alphabetic';
					}
				}
			});
		});

		// Draw Clues
		const clueX = gridWidth + padding * 2;
		currY = gridStartY;

		const drawClueSection = (label: string, dir: string) => {
			ctx.fillStyle = '#000000';
			ctx.font = 'bold 18px DM Sans, Noto Serif Thai';
			ctx.fillText(label, clueX, currY);
			currY += 25;
			ctx.font = '14px DM Sans, Noto Serif Thai';

			detectedClues
				.filter((c) => c.direction === dir)
				.forEach((c) => {
					const hint = clues[`${c.direction}-${c.r}-${c.c}`] || '(ว่าง)';
					const text = `${c.index}. ${hint}`;

				// Simple line wrapping
				const words = text.split(' ');
				let line = '';
				for (let i = 0; i < words.length; i++) {
					const testLine = line + words[i] + ' ';
					if (ctx.measureText(testLine).width > cluePanelWidth && i > 0) {
						ctx.fillText(line, clueX + 10, currY);
						currY += 20;
						line = words[i] + ' ';
					} else {
						line = testLine;
					}
				}
				ctx.fillText(line, clueX + 10, currY);
				currY += 25;
			});
			currY += 20;
		};

		drawClueSection('แนวนอน', 'across');
		drawClueSection('แนวตั้ง', 'down');

		const link = document.createElement('a');
		link.download = `${title || 'crossword'}${showAnswers ? '-solution' : ''}.png`;
		link.href = canvas.toDataURL('image/png');
		link.click();
	}

	function abortSolve() {
		if (solveAbort) solveAbort.abort();
		isSolving = false;
		addToast('ยกเลิกการเติมคำ', 'info');
	}

	function importFromText() {
		if (!importText.trim()) return;
		saveHistory();

		const lines = importText.trim().split(/\r?\n/);

		// 1. Extract Metadata
		const titleLine = lines.find((l) => l.startsWith('Title,'));
		if (titleLine) title = titleLine.split(',')[1] || title;

		const authorLine = lines.find((l) => l.startsWith('Author,'));
		if (authorLine) author = authorLine.split(',')[1] || author;

		// 2. Extract Grid
		let gridLines: string[] = [];
		const gridStart = lines.findIndex((l) => l.trim().toUpperCase() === 'GRID');
		const cluesStart = lines.findIndex((l) => l.trim().toUpperCase() === 'CLUES');

		if (gridStart !== -1) {
			const end = cluesStart !== -1 ? cluesStart : lines.length;
			gridLines = lines
				.slice(gridStart + 1, end)
				.filter((l) => l.trim().length > 0 && !l.startsWith('Title,') && !l.startsWith('Author,'));
		} else {
			// Fallback to old behavior (everything before CLUES or everything)
			const end = cluesStart !== -1 ? cluesStart : lines.length;
			gridLines = lines
				.slice(0, end)
				.filter((l) => l.trim().length > 0 && !l.startsWith('Title,') && !l.startsWith('Author,'));
		}

		const dataLines = gridLines.map((line) => line.split(/[,\t; ]+/).filter((x) => x !== ''));
		if (dataLines.length > 0) {
			const newRows = dataLines.length;
			const newCols = Math.max(...dataLines.map((d) => d.length));
			grid = Array.from({ length: newRows }, (_, r) =>
				Array.from({ length: newCols }, (_, c) => {
					let val = (dataLines[r][c] || '').trim();
					if (val === '#') return { letter: '', black: true };
					const thaiOnly = splitThaiCells(val).join('');
					return { letter: thaiOnly, black: false };
				})
			);
			rows = newRows;
			cols = newCols;
		}

		// 3. Extract Hints
		if (cluesStart !== -1) {
			const clueLines = lines.slice(cluesStart + 2); // Skip CLUES and Header
			clues = {}; // Reset hints
			clueLines.forEach((line) => {
				// Format: No,Dir,Answer,Clue
				// Use a simple CSV parser that handles quotes
				const match = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
				if (match && match.length >= 4) {
					const dir = match[1].toLowerCase().trim();
					const hint = match[3].replace(/^"|"$/g, '').replace(/""/g, '"');

					// We need to find the r,c for this clue
					// Since we just updated the grid, we can recalculate cellNumbers
					// and then match the clue to the r,c
					const numbers = getCellNumbers();
					for (let r = 0; r < rows; r++) {
						for (let c = 0; c < cols; c++) {
							const num = numbers.get(`${r},${c}`);
							if (num && num.toString() === match[0]) {
								clues[`${dir}-${r}-${c}`] = hint;
							}
						}
					}
				}
			});
		}

		selectedRow = -1;
		selectedCol = -1;
		showImportModal = false;
		importText = '';
		updateSuggestions();
	}

	onMount(() => {
		initGrid(rows, cols);
	});
</script>

<svelte:head>
	<title>Thai Crossword Builder | Code Breaker</title>
	<meta
		name="description"
		content="Build and share Thai crossword puzzles with this advanced tool. Features smart word suggestions and automated solving."
	/>

	<meta
		property="og:title"
		content="Thai Crossword Builder"
	/>

	<meta
		property="og:description"
		content="Build and share Thai crossword puzzles with this advanced tool. Features smart word suggestions and automated solving."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/og-crossword-builder.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="/og-crossword-builder.png" />
</svelte:head>

<svelte:window on:keydown={handleKeydown}></svelte:window>

<!-- Hidden input for reliable Thai IME input -->
<input
	bind:this={hiddenInput}
	type="text"
	on:input={handleCellInput}
	class="fixed top-0 left-0 opacity-0 w-px h-px pointer-events-none"
	autocomplete="off"
	spellcheck="false"
	tabindex="-1"
	aria-hidden="true"
	disabled={showResizeControls}
/>

<div
	class="flex flex-col items-center p-0 h-[100dvh] overflow-hidden bg-base-100 text-base-content relative overscroll-none"
	style="height: 100dvh; max-height: 100dvh;"
	on:click={() => {
		selectedRow = -1;
		selectedCol = -1;
		updateSuggestions();
	}}
	on:keydown={() => {}}
>
	<!-- Compact Header & Toolbar -->
	<div
		class="sticky top-0 flex items-center justify-between w-full px-4 py-1 bg-base-200/90 backdrop-blur-md border-b border-base-300 z-[9999] shadow-sm shrink-0"
	>
		<div class="flex items-center gap-3">
			<!-- Logo & Info -->
			<div class="flex items-center gap-2 shrink-0">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
					on:click|stopPropagation
				>
					<div
						class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-content"
					>
						<GridIcon size="18" />
					</div>
					<span class="text-xs font-black tracking-tighter hidden lg:block uppercase">Builder</span>
				</div>
				<div class="tooltip tooltip-bottom" data-tip="วิธีสร้าง">
					<button
						class="btn btn-ghost btn-xs btn-circle {showQuickTips
							? 'text-info-content bg-primary/10 opacity-100'
							: 'opacity-40 hover:opacity-100'}"
						on:click|stopPropagation={() => {
							showQuickTips = !showQuickTips;
							if (showQuickTips) {
								selectedRow = -1;
								selectedCol = -1;
							}
							updateSuggestions();
						}}
					>
						<InfoIcon size="14" />
					</button>
				</div>
			</div>

			<div
				class="h-6 w-px bg-base-content/10 mx-1 hidden sm:block"
			></div>

			<!-- Tools (Moved Left) -->
			<div class="flex items-center" on:click|stopPropagation on:keydown={() => {}}>
				{#if currentStep === 1}
					<div
						class="bg-base-300/30 p-1 rounded-xl flex items-center gap-0.5 sm:gap-1 animate-fade-in scale-[0.85] sm:scale-90 lg:scale-100"
					>
						<div class="tooltip tooltip-bottom" data-tip="สร้างตารางใหม่">
							<button
								on:click={openModal}
								class="btn btn-ghost btn-xs text-primary px-1 sm:px-2"
								disabled={showResizeControls}
							>
								<PlusSquareIcon size="16" />
							</button>
						</div>
						<div class="tooltip tooltip-bottom" data-tip="ปรับขนาดตาราง">
							<button
								on:click={() => showResizeControls = !showResizeControls}
								class="btn btn-ghost btn-xs {showResizeControls ? 'text-primary' : 'opacity-40'} px-1 sm:px-2"
							><Maximize2Icon size="16" /></button>
						</div>

						<div
							class="h-4 w-px bg-base-content/10 mx-0.5 hidden sm:block"
						></div>

						<div
							class="tooltip tooltip-bottom hidden sm:block"
							data-tip="นำเข้าข้อมูล"
						>
							<button
								on:click={() => showImportModal = true}
								class="btn btn-ghost btn-xs text-primary px-1 sm:px-2"
								disabled={showResizeControls}
							>
								<ClipboardIcon size="16" />
							</button>
						</div>
						<div class="tooltip tooltip-bottom" data-tip="ย้อนกลับ">
							<button
								on:click={undo}
								disabled={history.length === 0 || showResizeControls}
								class="btn btn-ghost btn-xs px-1 sm:px-2"
							>
								<CornerUpLeftIcon size="16" />
							</button>
						</div>

						<div
							class="h-4 w-px bg-base-content/10 mx-0.5 hidden lg:block"
						></div>

						<!-- Zoom Dropdowns -->
						<div class="hidden md:flex items-center">
							<div class="dropdown dropdown-hover dropdown-bottom dropdown-end">
								<div
									tabindex="0"
									role="button"
									class="btn btn-ghost btn-xs px-1 flex items-center justify-center"
								>
									<GridIcon size="14" class="text-primary" />
								</div>
								<div
									tabindex="0"
									class="botanical-card dropdown-content p-3 shadow-xl bg-base-200 border border-base-300 rounded-xl w-48 mt-0 pt-2 z-[9999]"
								>
									<span class="text-sm font-bold opacity-50 uppercase mb-1 block">ขนาดช่อง</span>
									<input
										type="range"
										min={CELL_MIN}
										max={CELL_MAX}
										bind:value={cellSize}
										class="range range-xs range-primary"
									/>
								</div>
							</div>
							<div class="dropdown dropdown-hover dropdown-bottom dropdown-end">
								<div
									tabindex="0"
									role="button"
									class="btn btn-ghost btn-xs px-1 flex items-center justify-center"
								>
									<HashIcon size="14" class="text-primary" />
								</div>
								<div
									tabindex="0"
									class="botanical-card dropdown-content p-3 shadow-xl bg-base-200 border border-base-300 rounded-xl w-48 mt-0 pt-2 z-[9999]"
								>
									<span class="text-sm font-bold opacity-50 uppercase mb-1 block">ขนาดตัวเลข</span>
									<input
										type="range"
										min="0.5"
										max="2.5"
										step="0.05"
										bind:value={numZoom}
										class="range range-xs range-primary"
									/>
								</div>
							</div>
						</div>

						<div class="h-4 w-px bg-base-content/10 mx-0.5 lg:mx-1"></div>

						{#if !isSolving}
							<div class="flex items-center gap-0.5">
								<div
									class="tooltip tooltip-bottom"
									data-tip="ค้นหาอัจฉริยะ {smartMode ? 'เปิดอยู่' : 'ปิดอยู่'}"
								>
									<button
										on:click={() => {
											smartMode = !smartMode;
											updateSuggestions();
										}}
										class="btn btn-ghost btn-xs {smartMode
											? 'text-secondary'
											: 'opacity-40'} px-1 sm:px-2"
										disabled={showResizeControls}
									>
										<ZapIcon size="16" />
									</button>
								</div>
								<div class="tooltip tooltip-bottom" data-tip="เติมคำอัตโนมัติ">
									<button
										on:click={finishGrid}
										class="btn btn-ghost btn-xs text-emerald-600 gap-1 px-1.5 sm:px-2"
										disabled={showResizeControls}
									>
										<CheckSquareIcon size="16" />
									</button>
								</div>
							</div>
						{:else}
							<div class="flex items-center gap-1 px-1 animate-fade-in">
								<div class="relative flex items-center justify-center">
									<span
										class="loading loading-spinner loading-xs text-primary scale-75"
									></span>

									<ZapIcon
										size="10"
										class="absolute text-secondary animate-spin-slow"
									/>
								</div>
								<button
									on:click={abortSolve}
									class="btn btn-error btn-xs scale-75 hover:scale-90 transition-transform px-1"
									>Cancel</button
								>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<div class="flex items-center justify-end" on:click|stopPropagation on:keydown={() => {}}>
			<div class="flex items-center gap-1 sm:gap-4">
				<!-- Consolidated Step Navigation -->
				<div
					class="flex items-center bg-base-300/30 rounded-full p-0.5 sm:p-1 border border-base-300 shadow-inner px-2"
				>
					<!-- Indicators -->
					<div class="flex items-center gap-0.5 px-0.5 sm:px-1">
						{#each [{ s: 1, l: 'สร้างตาราง' }, { s: 2, l: 'ใส่คำใบ้' }, { s: 3, l: 'แชร์' }] as step}
							<button
								class="flex items-center gap-1 px-1.5 sm:px-2 h-6 sm:h-7 rounded-full transition-all duration-200 {currentStep ===
								step.s
									? 'bg-primary text-primary-content shadow-md'
									: 'hover:bg-base-300/50 text-base-content/40 hover:text-base-content'}"
								on:click={() => goToStep(step.s)}
							>
								<span
									class="w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full flex items-center justify-center text-[7px] sm:text-[8px] font-black {currentStep ===
									step.s
										? 'bg-white text-primary'
										: 'bg-base-content/10'}"
								>
									{step.s}
								</span>
								<span
									class="text-[8px] sm:text-[9px] font-black uppercase tracking-wider hidden md:inline"
									>{step.l}</span
								>
							</button>
							{#if step.s < 3}
								<ChevronRightIcon size="10" class="opacity-10 mx-0" />
							{/if}
						{/each}
					</div>
				</div>
			</div>

			<div
				class="h-8 w-px bg-base-content/5 mx-4 hidden xl:block"
			></div>
		</div>
	</div>

	<div
		class="flex flex-col lg:flex-row gap-6 w-full justify-center items-stretch flex-1 overflow-y-auto lg:overflow-hidden p-2 sm:p-4 lg:p-6 custom-scrollbar relative z-0"
	>
		<!-- Main Content Area -->
		<div
			class="flex flex-col gap-6 flex-1 items-center lg:overflow-y-auto h-auto lg:h-full custom-scrollbar py-4 sm:py-8"
		>
			<!-- Grid View -->
			<div class="flex flex-col items-center gap-3">
				{#if showResizeControls && currentStep === 1}
					<div class="flex items-center gap-2 animate-fade-in mb-1">
						<div class="tooltip" data-tip="แถวบน">
							<div
								class="join bg-base-200 shadow-md border border-primary/20 scale-90 sm:scale-100"
							>
								<button
									on:click={addRowTop}
									class="join-item btn btn-ghost btn-xs text-primary px-2"
								>
									<PlusSquareIcon size="14" />
								</button>
								<button
									on:click={removeRowTop}
									class="join-item btn btn-ghost btn-xs text-error-content px-2"
									disabled={rows <= 3}
								>
									<MinusSquareIcon size="14" />
								</button>
							</div>
						</div>
					</div>
				{/if}

				<div class="flex items-center gap-3">
					{#if showResizeControls && currentStep === 1}
						<div class="tooltip tooltip-left animate-fade-in mr-1" data-tip="คอลัมน์ซ้าย">
							<div
								class="flex flex-col join join-vertical bg-base-200 shadow-md border border-primary/20 scale-90 sm:scale-100"
							>
								<button
									on:click={addColLeft}
									class="join-item btn btn-ghost btn-xs text-primary py-2 h-auto"
								>
									<PlusSquareIcon size="14" />
								</button>
								<button
									on:click={removeColLeft}
									class="join-item btn btn-ghost btn-xs text-error-content py-2 h-auto"
									disabled={cols <= 3}
								>
									<MinusSquareIcon size="14" />
								</button>
							</div>
						</div>
					{/if}

					<div
						class="flex flex-col items-center gap-2 border-2 border-base-300 rounded-2xl p-1 bg-base-300 shadow-inner"
						on:click|stopPropagation
						on:keydown={() => {}}
					>
						{#if grid.length > 0}
							<div class="relative group">
								<div
									class="grid bg-base-content/20 border-2 border-base-content/20 rounded-lg shadow-2xl overflow-hidden {isSolving
										? 'blur-[1px] grayscale-[0.3]'
										: ''} transition-all"
									style="grid-template-columns: repeat({cols}, {effectiveCellSize}px); gap: 1px;"
								>
									{#each grid as row, r}
										{#each row as cell, c}
											<!-- svelte-ignore a11y-click-events-have-key-events -->
											<div
												class="relative flex items-center justify-center select-none cursor-pointer transition-all duration-150
													{cell.black
													? 'bg-base-content'
													: selectedRow === r && selectedCol === c
													? 'bg-primary/20 ring-2 ring-primary ring-inset z-10'
													: 'bg-base-100 hover:bg-base-200'}"
												style="width:{effectiveCellSize}px; height:{effectiveCellSize}px;"
												on:click={() => selectCell(r, c)}
												on:dblclick={() => toggleBlack(r, c)}
												role="gridcell"
												tabindex="-1"
											>
												{#if !cell.black}
													{#if cellNumbers.has(`${r},${c}`)}
														<span
															class="absolute top-0.5 left-1 font-bold text-base-content/30 leading-none pointer-events-none"
															style="font-size:{Math.max(8, effectiveCellSize * 0.22 * numZoom)}px"
														>
															{cellNumbers.get(`${r},${c}`)}
														</span>
													{/if}
													<span
														class="font-bold text-base-content leading-none pointer-events-none"
														style="font-size:{Math.max(10, effectiveCellSize * 0.45)}px"
														>{cell.letter}</span
													>
												{/if}
											</div>
										{/each}
									{/each}
								</div>

								{#if isSolving}
									<div
										class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-base-300/60 backdrop-blur-[3px] rounded-lg animate-fade-in"
									>
										<div
											class="bg-base-100 p-8 rounded-[2.5rem] shadow-2xl border border-base-300 flex flex-col items-center gap-5 scale-110 lg:scale-125"
										>
											<div class="relative">
												<div
													class="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"
												></div>
												<ZapIcon
													size="24"
													class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-secondary animate-pulse"
												/>
											</div>
											<div class="flex flex-col items-center gap-1">
												<span class="text-sm font-black uppercase tracking-[0.2em] text-primary"
													>Autofilling</span
												>
												<div class="flex gap-1">
													{#each [0, 1, 2] as i}
														<div
															class="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce"
															style="animation-delay: {i * 0.1}s"
														></div>
													{/each}
												</div>
											</div>
											<div class="w-48 h-1.5 bg-base-300 rounded-full overflow-hidden">
												<div
													class="h-full bg-gradient-to-r from-primary to-secondary animate-progress-indefinite"
												></div>
											</div>
											<button
												on:click={abortSolve}
												class="btn btn-error btn-xs rounded-full px-6 hover:scale-110 transition-transform font-bold"
												>Cancel</button
											>
										</div>
									</div>
								{/if}
							</div>
						{/if}
					</div>

					{#if showResizeControls && currentStep === 1}
						<div class="flex flex-col gap-4 items-center animate-fade-in ml-1">
							<div class="tooltip tooltip-right" data-tip="คอลัมน์ขวา">
								<div
									class="flex flex-col join join-vertical bg-base-200 shadow-md border border-primary/20 scale-90 sm:scale-100"
								>
									<button
										on:click={addColRight}
										class="join-item btn btn-ghost btn-xs text-primary py-2 h-auto"
									>
										<PlusSquareIcon size="14" />
									</button>
									<button
										on:click={removeColRight}
										class="join-item btn btn-ghost btn-xs text-error-content py-2 h-auto"
										disabled={cols <= 3}
									>
										<MinusSquareIcon size="14" />
									</button>
								</div>
							</div>
						</div>
					{/if}
				</div>

				{#if showResizeControls && currentStep === 1}
					<div class="flex items-center gap-2 animate-fade-in mt-1">
						<div class="tooltip tooltip-bottom" data-tip="แถวล่าง">
							<div
								class="join bg-base-200 shadow-md border border-primary/20 scale-90 sm:scale-100"
							>
								<button
									on:click={addRowBottom}
									class="join-item btn btn-ghost btn-xs text-primary px-2"
								>
									<PlusSquareIcon size="14" />
								</button>
								<button
									on:click={removeRowBottom}
									class="join-item btn btn-ghost btn-xs text-error-content px-2"
									disabled={rows <= 3}
								>
									<MinusSquareIcon size="14" />
								</button>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Right Panel -->
		<div class="lg:w-96 flex flex-col gap-4 lg:overflow-hidden h-auto lg:h-full shrink-0">
			<!-- Step 2: Clues Section -->
			{#if currentStep === 2}
				<div
					class="botanical-card bg-base-200 rounded-3xl border border-base-300 shadow-xl overflow-hidden flex flex-col max-h-[80vh] animate-fade-in"
				>
					<div
						class="p-4 bg-base-300/50 border-b border-base-300 flex items-center justify-between"
					>
						<h3 class="font-bold text-sm uppercase tracking-widest">คำใบ้</h3>
						<span class="badge badge-sm">{detectedClues.length} คำ</span>
					</div>
					<div class="p-2 overflow-y-auto space-y-4">
						{#if detectedClues.length === 0}
							<div class="p-8 text-center text-xs text-base-content/30 italic">
								ยังไม่มีคำในตาราง
							</div>
						{:else}
							<!-- Across Clues -->
							<div>
								<h4 class="text-[10px] font-black text-primary uppercase px-2 mb-2 tracking-widest">
									แนวนอน
								</h4>
								<div class="space-y-2">
									{#each detectedClues as c}
										{#if c.direction === 'across'}
											<div class="bg-base-100 p-3 rounded-xl border border-base-300 shadow-sm">
												<div class="flex gap-3 items-start">
													<div class="flex flex-col items-center gap-1 min-w-[4.5rem]">
														<span class="badge badge-primary badge-md font-bold">{c.index}</span>
														<span class="text-md opacity-50 uppercase">{c.answer}</span>
													</div>
													<textarea
														bind:value={clues[`${c.direction}-${c.r}-${c.c}`]}
														class="textarea  textarea-sm w-full leading-snug h-16 text-base"
														placeholder={c.answer}
													></textarea>
												</div>
											</div>
										{/if}
									{/each}
								</div>
							</div>

							<!-- Down Clues -->
							<div>
								<h4
									class="text-[10px] font-black text-secondary uppercase px-2 mb-2 tracking-widest"
								>
									แนวตั้ง
								</h4>
								<div class="space-y-2">
									{#each detectedClues as c}
										{#if c.direction === 'down'}
											<div class="bg-base-100 p-3 rounded-xl border border-base-300 shadow-sm">
												<div class="flex gap-3 items-start">
													<div class="flex flex-col items-center gap-1 min-w-[4.5rem]">
														<span class="badge badge-secondary badge-md font-bold">{c.index}</span>
														<span class="text-md opacity-50 uppercase">{c.answer}</span>
													</div>
													<textarea
														bind:value={clues[`${c.direction}-${c.r}-${c.c}`]}
														class="textarea  textarea-sm w-full leading-snug h-16 text-base"
														placeholder={c.answer}
													></textarea>
												</div>
											</div>
										{/if}
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Step 3: Share Card -->
			{#if currentStep === 3}
				<div
					class="botanical-card bg-base-200 p-6 rounded-3xl border border-primary/20 shadow-xl w-full animate-fade-in flex flex-col gap-6"
				>
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
							<CloudIcon class="text-primary" size="20" />
						</div>
						<h3 class="font-bold">ข้อมูลปริศนา</h3>
					</div>

					<div class="space-y-4">
						<div class="flex flex-col gap-2">
							<label for="cw-title" class="label pt-0"
								><span class="text-xs font-bold">ชื่อปริศนา</span></label
							>
							<input
								id="cw-title"
								type="text"
								bind:value={title}
								class="input  input-sm focus:input-primary"
								placeholder="อักษรไขว้"
							/>
						</div>
						<div class="flex flex-col gap-2">
							<label for="cw-author" class="label pt-0"
								><span class="text-xs font-bold">ผู้เขียน</span></label
							>
							<input
								id="cw-author"
								type="text"
								bind:value={author}
								class="input  input-sm focus:input-primary"
								placeholder="นิรนาม"
							/>
						</div>
					</div>

					<div class="flex flex-col gap-3">
						<div class="grid grid-cols-2 gap-2">
							<button
								class="btn btn-primary gap-2 shadow-lg shadow-primary/20"
								on:click={() => saveToDatabase(true)}
								disabled={isSavingToDB}
							>
								{#if isSavingToDB && isPublic}
									<span class="loading loading-spinner loading-xs"></span>
								{/if}
								<CloudIcon size="18" />
								<div class="flex flex-col items-start leading-tight">
									<span class="text-xs font-bold">บันทึก Cloud</span>
									<span class="text-[8px] opacity-70 uppercase tracking-tighter">Public</span>
								</div>
							</button>
							<button
								class="btn btn-outline gap-2"
								on:click={() => saveToDatabase(false)}
								disabled={isSavingToDB}
							>
								{#if isSavingToDB && !isPublic}
									<span class="loading loading-spinner loading-xs"></span>
								{/if}
								<ZapIcon size="18" />
								<div class="flex flex-col items-start leading-tight">
									<span class="text-xs font-bold">บันทึกส่วนตัว</span>
									<span class="text-[8px] opacity-70 uppercase tracking-tighter">Private</span>
								</div>
							</button>
						</div>
						<p class="text-[9px] text-center opacity-40 italic">สิทธิ์ในปริศนาเป็นของผู้เขียน</p>

						<div class="grid grid-cols-3 gap-2">
							<button class="btn btn-outline btn-sm gap-2 px-1" on:click={exportCSV}>
								<DownloadIcon size="14" />
								<span class="text-[10px]">CSV</span>
							</button>
							<button class="btn btn-outline btn-sm gap-2 px-1" on:click={() => exportPNG(false)}>
								<GridIcon size="14" />
								<span class="text-[10px]">รูปตาราง</span>
							</button>
							<button class="btn btn-outline btn-sm gap-2 px-1" on:click={() => exportPNG(true)}>
								<CheckSquareIcon size="14" />
								<span class="text-[10px]">รูปเฉลย</span>
							</button>
						</div>
					</div>

					{#if saveStatus}
						<div
							class="p-4 rounded-xl text-center text-xs font-bold {saveStatus.includes('สำเร็จ')
								? 'bg-success/10 text-success-content border border-success/20'
								: 'bg-error/10 text-error-content border border-error/20'}"
						>
							{saveStatus}
							{#if savedLink}
								<div class="mt-3 flex flex-col items-center gap-2">
									<a
										href={savedLink}
										target="_blank"
										class="btn btn-primary btn-xs w-full gap-2"
										rel="noreferrer"
									>
										<span>เปิดหน้าเล่น</span>
										<ExternalLinkIcon size="12" />
									</a>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/if}

			<!-- Step 1: Suggestions panel -->
			{#if currentStep === 1}
				<div
					class="flex flex-col gap-4 animate-fade-in w-full lg:w-80"
					on:click|stopPropagation
					on:keydown={() => {}}
				>
					{#if showResizeControls}
						<div
							class="botanical-card bg-base-200 p-4 rounded-3xl border-2 border-primary shadow-xl animate-bounce-subtle"
						>
							<h3 class="font-bold text-sm mb-1">โหมดปรับขนาดตาราง</h3>
							<p class="text-[10px] opacity-60 mb-4">กดปุ่มรอบตารางเพื่อเพิ่มหรือลดแถว/คอลัมน์</p>
							<button
								class="btn btn-primary btn-block rounded-2xl shadow-lg shadow-primary/20"
								on:click={() => showResizeControls = false}
							>
								<CheckCircleIcon size="18" />
								<span>เสร็จสิ้น</span>
							</button>
						</div>
					{/if}
					{#if selectedRow < 0 && showQuickTips}
						<div class="flex flex-col gap-4 animate-fade-in">
							<div class="bg-primary/5 border border-primary/10 rounded-2xl p-4">
								<h4 class="text-md font-black uppercase tracking-widest text-primary mb-3">
									วิธีสร้าง
								</h4>
								<ul class="text-left text-sm">
									<li>คลิกที่ช่องเพื่อพิมพ์ตัวอักษร</li>
									<li>และกดปุ่มลูกศรเพื่อเปลี่ยนช่อง</li>

									<li>
										ดับเบิลคลิกที่ช่องเพื่อสลับเป็น
										<strong>"ช่องดำ"</strong>
										หรือช่องปกติ
									</li>

									<li>
										<span class="inline-flex items-center gap-2">
											กด <CheckSquareIcon size="16" /> เพื่อเติมคำที่เหลือในตารางให้โดยอัตโนมัติ
										</span>
									</li>
									<li>
										<span class="inline-flex items-center gap-2"
											>กด <ZapIcon size="16" /> เพื่อตัดคำที่ใช้ไม่ได้ออก</span
										>
									</li>
									<li>เมื่อสร้างตารางเสร็จแล้ว คลิก <strong>"เพิ่มคำใบ้"</strong></li>
								</ul>
							</div>
						</div>
					{:else if loadingSuggestions}
						<div
							class="flex items-center gap-2 text-base-content/60 py-2 justify-center"
						>
							<span class="loading loading-spinner loading-sm"></span>
							<span class="text-xs">กำลังค้นหา...</span>
						</div>
					{:else}
						<!-- Across suggestions -->
						{#if acrossPattern.length > 1}
							<div class="border border-base-300 rounded-2xl p-3 bg-base-100 shadow-sm">
								<div
									class="font-bold mb-2 flex items-center gap-2"
									style="font-size: {10 * suggestionZoom}px"
								>
									<span class="text-primary">→</span>
									<span>แนวนอน</span>
									<code
										class="bg-base-200 px-1.5 py-0.5 rounded font-mono text-base-content/60 ml-auto"
										style="font-size: {9 * suggestionZoom}px">{acrossPattern}</code
									>
								</div>
								{#if acrossResults.length === 0}
									<p class="text-[10px] text-base-content/40 italic">ไม่พบคำที่ตรงกัน</p>
								{:else}
									<div class="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
										{#each acrossResults.slice(0, 40) as word}
											<button
												class="badge badge-outline hover:bg-primary hover:text-primary-content hover:border-primary cursor-pointer transition-colors whitespace-nowrap"
												style="font-size: {14 *
													suggestionZoom}px; height: auto; padding-top: 2px; padding-bottom: 2px;"
												on:click={() => fillSlot(selectedRow, selectedCol, 'across', word)}
											>
												{word}
											</button>
										{/each}
										{#if acrossResults.length > 40}
											<span class="text-[10px] opacity-40 font-bold self-center ml-1">
												+{acrossResults.length - 40} more
											</span>
										{/if}
									</div>
								{/if}
							</div>
						{/if}

						<!-- Down suggestions -->
						{#if downPattern.length > 1}
							<div class="border border-base-300 rounded-2xl p-3 bg-base-100 shadow-sm">
								<div
									class="font-bold mb-2 flex items-center gap-2"
									style="font-size: {10 * suggestionZoom}px"
								>
									<span class="text-secondary">↓</span>
									<span>แนวตั้ง</span>
									<code
										class="bg-base-200 px-1.5 py-0.5 rounded font-mono text-base-content/60 ml-auto"
										style="font-size: {9 * suggestionZoom}px">{downPattern}</code
									>
								</div>
								{#if downResults.length === 0}
									<p class="text-[10px] text-base-content/40 italic">ไม่พบคำที่ตรงกัน</p>
								{:else}
									<div class="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
										{#each downResults.slice(0, 40) as word}
											<button
												class="badge badge-outline hover:bg-secondary hover:text-secondary-content hover:border-secondary cursor-pointer transition-colors whitespace-nowrap"
												style="font-size: {14 *
													suggestionZoom}px; height: auto; padding-top: 2px; padding-bottom: 2px;"
												on:click={() => fillSlot(selectedRow, selectedCol, 'down', word)}
											>
												{word}
											</button>
										{/each}
										{#if downResults.length > 40}
											<span class="text-[10px] opacity-40 font-bold self-center ml-1">
												+{downResults.length - 40} more
											</span>
										{/if}
									</div>
								{/if}
							</div>
						{/if}
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- New Grid Modal -->
{#if showModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="modal modal-open">
		<div class="modal-box max-w-sm rounded-3xl border border-primary/20 shadow-2xl">
			<h3 class="font-bold text-lg text-primary">สร้างตารางใหม่</h3>
			<p class="text-xs opacity-50 mt-1">ข้อมูลเดิมจะถูกล้างทั้งหมด</p>
			<div class="grid grid-cols-2 gap-4 mt-6">
				<div class="flex flex-col gap-2">
					<label for="cw-rows" class="label pt-0"><span class="text-xs font-bold">แถว</span></label>
					<input
						id="cw-rows"
						type="number"
						min="3"
						max="25"
						bind:value={modalRows}
						class="input  input-primary w-full"
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label for="cw-cols" class="label pt-0"><span class="text-xs font-bold">คอลัมน์</span></label>
					<input
						id="cw-cols"
						type="number"
						min="3"
						max="25"
						bind:value={modalCols}
						class="input  input-primary w-full"
					/>
				</div>
			</div>
			<div class="modal-action mt-8">
				<button
					class="btn btn-ghost"
					on:click={() => showModal = false}
				>ยกเลิก</button>

				<button
					class="btn btn-primary px-8 rounded-full"
					on:click={confirmModal}
				>สร้าง</button>
			</div>
		</div>
		<div
			class="modal-backdrop bg-base-300/80 backdrop-blur-sm"
			on:click={() => showModal = false}
		></div>
	</div>
{/if}

<!-- Import Modal -->
{#if showImportModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg">นำเข้าตารางจากข้อความ</h3>
			<p class="text-sm text-base-content/60 mt-1">
				วางข้อความที่คัดลอกมาจากไฟล์ CSV หรือ Excel (ใช้คอมมาหรือ Tab แบ่งช่อง)
			</p>
			<div class="flex flex-col gap-2 mt-4">
				<textarea
					bind:value={importText}
					class="textarea  h-48 font-mono text-xs"
					placeholder="ก,ข,ค #,ง,จ"
				></textarea>
			</div>
			<div class="modal-action">
				<button
					class="btn"
					on:click={() => showImportModal = false}
				>ยกเลิก</button>

				<button
					class="btn btn-primary"
					on:click={importFromText}
					disabled={!importText.trim()}
				>นำเข้า</button>
			</div>
		</div>

		<div
			class="modal-backdrop"
			on:click={() => showImportModal = false}
		></div>
	</div>
{/if}

{#if toasts.length > 0}
	<div
		class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none flex flex-col gap-2"
	>
		{#each toasts as t (t.id)}
			<div
				class="alert {t.type === 'success'
					? 'alert-success'
					: t.type === 'error'
					? 'alert-error'
					: 'alert-info'}
				shadow-2xl border-none text-base-content font-bold py-3 px-6 rounded-2xl animate-fade-in flex items-center gap-3 min-w-[200px]"
			>
				{#if t.type === 'success'}
					<CheckSquareIcon size="18" />
				{:else if t.type === 'error'}
					<XIcon size="18" />
				{:else}
					<ZapIcon size="18" />
				{/if}
				<span class="text-sm">{t.message}</span>
			</div>
		{/each}
	</div>
{/if}

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: hsl(var(--bc) / 0.1);
		border-radius: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: hsl(var(--bc) / 0.2);
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateX(10px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
	.animate-fade-in {
		animation: fadeIn 0.3s ease-out forwards;
	}
	:global(.animate-spin-slow) {
		animation: spin 3s linear infinite;
	}
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	@keyframes progress-indefinite {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
	.animate-progress-indefinite {
		animation: progress-indefinite 1.5s infinite linear;
	}
</style>
