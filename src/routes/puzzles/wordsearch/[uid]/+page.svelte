<script lang="ts">
 import {saveGame,loadGame,fingerprint} from "#lib/progress/local.js";
 let progressReady=false;
export let data: any;


	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import TitleTab from '#lib/components/TitleTab.svelte';
	import RepeatIcon from '@lucide/svelte/icons/repeat';

	let content: any = data.content;

	// Timer
	let seconds = 0;
	let timerInterval: NodeJS.Timeout;
	let solved = false;
	let showModal = false;
	let isPaused = false;
	// Layout Flip State (Desktop Grid left / Wordlist right)
	let isFlipped = false;

	function startTimer() {
		if (timerInterval) clearInterval(timerInterval);
		timerInterval = setInterval(() => {
			if (!solved && !isPaused) seconds++;
		}, 1000);
	}

	function togglePause() {
		if (solved) return;
		isPaused = !isPaused;
	}

	function resetTimer() {
		seconds = 0;
	}

	function formatTime(s: number) {
		const m = Math.floor(s / 60);
		const sec = s % 60;
		return `${m}:${sec.toString().padStart(2, '0')}`;
	}

	let grid: string[][] = [];
	let wordsData: { word: string; chars: string[]; found: boolean }[] = [];
	let gridSize = 10;

	type FoundWordLine = { startR: number; startC: number; endR: number; endC: number };
	let foundWordsLines: FoundWordLine[] = [];

	let isDragging = false;
	let dragStart: [number, number] | null = null;
	let dragCurrent: [number, number] | null = null;
	let currentSelection: [number, number][] = [];

	let scaleFactor = 0.9;
	$: cellSize = Math.max(24, Math.min(36 * scaleFactor, 340 / gridSize));

	function exportImage() {
		const canvas = document.createElement('canvas');
		const padding = 40;
		const boardSize = gridSize * 36;
		const wordsPanelWidth = 300;
		const height = Math.max(boardSize, wordsData.length * 30 + 50) + padding * 2 + 50;
		const width = boardSize + wordsPanelWidth + padding * 3;

		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, width, height);

		ctx.fillStyle = '#000000';
		ctx.font = 'bold 32px DM Sans, Noto Serif Thai';
		ctx.textAlign = 'left';
		ctx.fillText(content?.title || 'Word Search', padding, padding);

		ctx.font = 'bold 20px DM Sans, Noto Serif Thai';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		const gridX = padding;
		const gridY = padding + 40;

		for (let r = 0; r < gridSize; r++) {
			for (let c = 0; c < gridSize; c++) {
				const x = gridX + c * 36 + 18;
				const y = gridY + r * 36 + 18;
				ctx.fillStyle = '#000000';
				ctx.fillText(grid[r][c], x, y);
			}
		}

		ctx.textAlign = 'left';
		ctx.font = 'bold 24px DM Sans, Noto Serif Thai';
		const listX = gridX + boardSize + padding;
		ctx.fillStyle = '#000000';
		ctx.fillText('คำศัพท์ที่ต้องหา', listX, gridY + 20);

		ctx.font = '20px DM Sans, Noto Serif Thai';
		let currY = gridY + 60;
		wordsData.forEach(w => {
			ctx.fillStyle = '#000000';
			ctx.fillText(w.word, listX, currY);
			currY += 30;
		});

		const link = document.createElement('a');
		link.download = `${content?.title || 'wordsearch'}.png`;
		link.href = canvas.toDataURL('image/png');
		link.click();
	}

	function initGame() {
		if (content.clues) {
			grid = content.clues.grid || [];
			wordsData = (content.clues.wordsData || []).map((item:any)=>({...item,chars:[...(item.chars??[])]}));
			gridSize = grid.length || 10;
 const saved=loadGame<any>('/puzzles/wordsearch/'+content.uid);
 if(saved?.fingerprint===fingerprint(content.clues)&&Array.isArray(saved.found)&&saved.found.length===wordsData.length&&saved.found.every((value:any)=>typeof value==='boolean')&&Array.isArray(saved.lines)&&saved.lines.length<=wordsData.length&&saved.lines.every((line:any)=>line&&['startR','startC','endR','endC'].every(key=>Number.isInteger(line[key])&&line[key]>=0&&line[key]<gridSize))){
 wordsData=wordsData.map((word,index)=>({...word,found:saved.found[index]}));foundWordsLines=saved.lines;seconds=Number.isFinite(saved.seconds)?Math.max(0,saved.seconds):0;solved=wordsData.length>0&&wordsData.every(word=>word.found);
 }else {foundWordsLines=[];seconds=0;solved=false;}
		}
	}

	$: if (content) {
		if (typeof window !== 'undefined') {
			initGame();
			startTimer();
		}
	}

	onMount(() => {
 initGame();progressReady=true;
		const handleMouseUp = () => endDrag();
		window.addEventListener('mouseup', handleMouseUp);
		window.addEventListener('touchend', handleMouseUp);
		return () => {
			if (timerInterval) clearInterval(timerInterval);
			window.removeEventListener('mouseup', handleMouseUp);
			window.removeEventListener('touchend', handleMouseUp);
		};
	});

	function getLine(r1: number, c1: number, r2: number, c2: number) {
		const dr = r2 - r1;
		const dc = c2 - c1;
		if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return [];

		const steps = Math.max(Math.abs(dr), Math.abs(dc));
		const stepR = dr === 0 ? 0 : dr / steps;
		const stepC = dc === 0 ? 0 : dc / steps;

		const line: [number, number][] = [];
		for (let i = 0; i <= steps; i++) {
			line.push([r1 + i * stepR, c1 + i * stepC]);
		}
		return line;
	}

	function startDrag(r: number, c: number) {
		if (solved) return;
		isDragging = true;
		dragStart = [r, c];
		dragCurrent = [r, c];
		currentSelection = [[r, c]];
	}

	function onDragOver(r: number, c: number) {
		if (!isDragging || !dragStart) return;
		dragCurrent = [r, c];
		currentSelection = getLine(dragStart[0], dragStart[1], dragCurrent[0], dragCurrent[1]);
	}

	async function endDrag() {
		if (!isDragging) return;
		isDragging = false;

		let foundOne = false;
		if (currentSelection.length > 0) {
			try {
				const res = await fetch('/api/wordsearch/verify', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ grid, words: wordsData, selectionCoords: currentSelection })
				});
				const data = await res.json();
				if (data.matched && typeof data.index === 'number' && wordsData[data.index] && !wordsData[data.index].found) {
					wordsData[data.index].found = true;
					foundOne = true;
					foundWordsLines = [...foundWordsLines, data.line];
				}
			} catch {
				const selectedText = currentSelection.map(([r, c]) => grid[r][c]).join('');
				const reversedText = selectedText.split('').reverse().join('');
				const cleanSel = selectedText.normalize('NFC').trim();
				const cleanRev = reversedText.normalize('NFC').trim();

				for (let w of wordsData) {
					const cleanW = (w.word || '').normalize('NFC').trim();
					const charsStr = Array.isArray(w.chars) ? w.chars.join('').normalize('NFC').trim() : '';

					const matches =
						w.word === selectedText ||
						w.word === reversedText ||
						cleanW === cleanSel ||
						cleanW === cleanRev ||
						(charsStr && (charsStr === cleanSel || charsStr === cleanRev));

					if (!w.found && matches) {
						w.found = true;
						foundOne = true;
						foundWordsLines = [
							...foundWordsLines,
							{
								startR: currentSelection[0][0],
								startC: currentSelection[0][1],
								endR: currentSelection[currentSelection.length - 1][0],
								endC: currentSelection[currentSelection.length - 1][1]
							}
						];
					}
				}
			}
		}

		if (foundOne) {
			wordsData = [...wordsData];
			checkWin();
		}
	}

	function checkWin() {
		if (wordsData.every(w => w.found)) {
			solved = true;
			showModal = true;
			if (timerInterval) clearInterval(timerInterval);
		}
	}

	function handleTouchMove(e: TouchEvent) {
		if (!isDragging) return;
		e.preventDefault();
		const touch = e.touches[0];
		const element = document.elementFromPoint(touch.clientX, touch.clientY);
		if (element && element.hasAttribute('data-r')) {
			const r = parseInt(element.getAttribute('data-r')!);
			const c = parseInt(element.getAttribute('data-c')!);
			onDragOver(r, c);
		}
	}

$: ({ content } = data);
$: if(progressReady&&wordsData.length)saveGame('/puzzles/wordsearch/'+content.uid,content.title||'Word Search',{fingerprint:fingerprint(content.clues),found:wordsData.map(word=>word.found),lines:foundWordsLines,seconds},solved);
</script>

<div class="max-w-6xl mx-auto px-2 sm:px-4 py-4 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 select-none overflow-x-hidden {isFlipped ? 'lg:flex-row-reverse' : ''}">
	<!-- MAIN COLUMN: GRID BOARD -->
	<div class="flex-1 flex flex-col items-center justify-center min-w-0 w-full">
		<div
			class="botanical-card bg-base-200 p-2 sm:p-4 rounded-3xl shadow-xl inline-block select-none touch-none border border-base-300 relative"
			on:touchmove={handleTouchMove}
		>
			{#if isPaused}
				<div class="absolute inset-0 bg-base-100/80 backdrop-blur-sm z-30 flex items-center justify-center rounded-3xl">
					<span class="text-2xl font-black text-base-content/60">หยุดพัก</span>
				</div>
			{/if}
			<div
				class="relative mx-auto"
				style="width: {gridSize * cellSize}px; height: {gridSize * cellSize}px;"
			>
				<svg class="absolute inset-0 pointer-events-none z-10" width="100%" height="100%">
					{#each foundWordsLines as fw}
						<line
							x1={fw.startC * cellSize + cellSize/2}
							y1={fw.startR * cellSize + cellSize/2}
							x2={fw.endC * cellSize + cellSize/2}
							y2={fw.endR * cellSize + cellSize/2}
							stroke="currentColor"
							class="text-success-content opacity-50"
							stroke-width={cellSize * 0.65}
							stroke-linecap="round"
						/>
					{/each}

					{#if isDragging && currentSelection.length > 0}
						<line
							x1={currentSelection[0][1] * cellSize + cellSize/2}
							y1={currentSelection[0][0] * cellSize + cellSize/2}
							x2={currentSelection[currentSelection.length-1][1] * cellSize + cellSize/2}
							y2={currentSelection[currentSelection.length-1][0] * cellSize + cellSize/2}
							stroke="currentColor"
							class="text-primary opacity-50 drop-shadow-md"
							stroke-width={cellSize * 0.65}
							stroke-linecap="round"
						/>
					{/if}
				</svg>

				<div
					class="absolute inset-0 grid"
					style="grid-template-columns: repeat({gridSize}, 1fr); grid-template-rows: repeat({gridSize}, 1fr);"
				>
					{#each grid as row, r}
						{#each row as cell, c}
							<div
								data-r={r}
								data-c={c}
								class="flex items-center justify-center font-bold text-base-content hover:bg-base-content/10 transition-colors cursor-pointer rounded-full z-20"
								style="font-size: {Math.max(0.8, cellSize * 0.035)}rem;"
								on:mousedown={() => { if (!isPaused) startDrag(r, c); }}
								on:mouseenter={() => { if (!isPaused) onDragOver(r, c); }}
								on:touchstart|preventDefault={() => { if (!isPaused) startDrag(r, c); }}
							>
								{cell}
							</div>
						{/each}
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- SIDE PANEL (DESKTOP) / BOTTOM PANEL (MOBILE): WORD LIST & CONTROLS -->
	<div class="w-full max-w-xl lg:max-w-xs shrink-0 flex flex-col gap-4">
		<!-- Header, Title, Timer & Controls -->
		<div class="botanical-card w-full bg-base-100 text-base-content border border-base-300 rounded-2xl p-4 shadow-lg flex flex-col gap-3 text-center sm:text-left">
			<div class="flex flex-col sm:flex-row lg:flex-col justify-between items-center lg:items-start gap-3">
				<div>
					<TitleTab {content} />
					{#if content.author}
						<p class="text-xs text-base-content/70 mt-0.5">โดย <span class="font-bold">{content.author}</span></p>
					{/if}
				</div>

				<div class="flex items-center gap-2">
					<div class="text-xl font-mono font-black text-primary bg-emerald-500/10 px-4 py-1 rounded-full border border-primary/30">
						{formatTime(seconds)}
					</div>
					<button class="btn btn-circle btn-ghost btn-xs" on:click={togglePause} title={isPaused ? 'เล่นต่อ' : 'หยุดเวลา'}>
						{#if isPaused}
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-warning-content" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
						{/if}
					</button>
					<button class="btn btn-circle btn-ghost btn-xs text-base-content/70" on:click={resetTimer} title="เริ่มเวลาใหม่">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
					</button>
					<button class="btn btn-circle btn-ghost btn-xs text-base-content/70" on:click={exportImage} title="บันทึกเป็นรูปภาพ">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
					</button>
					<!-- FLIP LEFT-RIGHT LAYOUT TOGGLE BUTTON (DESKTOP) -->
					<button
						class="btn btn-circle btn-ghost btn-xs text-base-content/70 hidden lg:inline-flex"
						on:click={() => (isFlipped = !isFlipped)}
						title="สลับตำแหน่ง ซ้าย-ขวา"
					>
						<RepeatIcon size={18} />
					</button>
				</div>
			</div>

			<div class="flex items-center justify-between gap-2 text-xs text-base-content/70 pt-1 border-t border-base-300">
				<span>ปรับขนาด:</span>
				<input type="range" min="0.6" max="1.3" step="0.1" bind:value={scaleFactor} class="range range-primary range-xs w-28" />
			</div>
		</div>

		<!-- Word List Box -->
		<div class="botanical-card w-full bg-base-200/90 border border-base-300 rounded-2xl p-3 sm:p-4 shadow-md flex flex-col gap-2">
			<div class="text-xs font-bold text-base-content/70 flex justify-between items-center">
				<span>คำที่ต้องหา:</span>
				<span class="text-[10px] opacity-70">สำเร็จ {wordsData.filter(w => w.found).length}/{wordsData.length}</span>
			</div>
			<div class="grid grid-cols-2 lg:grid-cols-2 gap-1.5 max-h-64 lg:max-h-96 overflow-y-auto p-1">
				{#each wordsData as w}
					<div
						class="px-2 py-1.5 rounded-xl text-center text-xs font-bold transition-all border truncate
						{w.found ? 'bg-success/20 text-success-content border-success/40 line-through' : 'bg-base-100 text-base-content border-base-300'}"
						title={w.word}
					>
						{w.word}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

{#if showModal}
	<div class="modal modal-open bg-black/60 backdrop-blur-md z-50" transition:fade>
		<div class="botanical-card modal-box bg-base-100 text-base-content border border-base-300 text-base-content text-center p-8 rounded-3xl" transition:scale>
			<div class="text-6xl mb-4 animate-bounce">🏆</div>
			<h3 class="text-3xl font-black mb-2 text-primary">เก่งมาก!</h3>
			<p class="text-lg text-base-content/70 mb-6 font-medium">คุณหาคำศัพท์ครบทุกคำแล้ว<br/>ใช้เวลาไป <span class="font-bold text-warning-content">{formatTime(seconds)}</span></p>
			<div class="flex gap-4 justify-center">
				<button class="btn btn-primary font-bold px-6 rounded-xl" on:click={() => { showModal = false; seconds = 0; startTimer(); solved = false; foundWordsLines = []; wordsData.forEach(w => w.found = false); wordsData=wordsData; }}>
					เล่นอีกครั้ง
				</button>
				<button class="btn btn-ghost font-bold px-6 rounded-xl text-base-content/70" on:click={() => showModal = false}>
					ปิดหน้าต่าง
				</button>
			</div>
		</div>
	</div>
{/if}
