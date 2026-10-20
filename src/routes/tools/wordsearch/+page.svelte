<script lang="ts">
	import { splitWord } from '#lib/utils/thai-text.js';
	import SaveIcon from '@lucide/svelte/icons/save';
import LinkIcon from '@lucide/svelte/icons/link';
import EyeIcon from '@lucide/svelte/icons/eye';

	let title = '';
	let author = '';
	let wordsInput = '';
	let difficulty = 1; // 1: Easy, 2: Medium, 3: Hard
	let gridSize = 12; // 10, 12, 15

	let isSaving = false;
	let saveStatus = '';
	let savedLink = '';

	let grid: string[][] | null = null;
	let wordsData: { word: string; chars: string[]; found: boolean }[] = [];
	let isGenerated = false;

	// UI Settings
	let scaleFactor = 1.0;
	$: cellSize = 44 * scaleFactor;

	function generateGrid() {
		const rawWords = wordsInput
			.split('\n')
			.map((w) => w.trim())
			.filter((w) => w.length > 0);
		const wordsList = [...new Set(rawWords)];

		if (wordsList.length === 0) {
			alert('กรุณาใส่คำศัพท์อย่างน้อย 1 คำ');
			return;
		}

		const dirsEasy = [
			[0, 1],
			[1, 0]
		];
		const dirsMed = [
			[0, 1],
			[1, 0],
			[1, 1],
			[-1, 1]
		];
		const dirsHard = [
			[0, 1],
			[1, 0],
			[1, 1],
			[-1, 1],
			[0, -1],
			[-1, 0],
			[-1, -1],
			[1, -1]
		];
		const availableDirs = difficulty === 1 ? dirsEasy : difficulty === 2 ? dirsMed : dirsHard;
		const allDirs = [
			[0, 1],
			[1, 0],
			[1, 1],
			[-1, 1],
			[0, -1],
			[-1, 0],
			[-1, -1],
			[1, -1]
		];
		const thaiLetters = 'กขคฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ'.split('');

		function countWord(wordChars: string[], g: string[][]) {
			let count = 0;
			for (let r = 0; r < gridSize; r++) {
				for (let c = 0; c < gridSize; c++) {
					for (let dir of allDirs) {
						let match = true;
						for (let i = 0; i < wordChars.length; i++) {
							let rr = r + i * dir[0];
							let cc = c + i * dir[1];
							if (
								rr < 0 ||
								rr >= gridSize ||
								cc < 0 ||
								cc >= gridSize ||
								g[rr][cc] !== wordChars[i]
							) {
								match = false;
								break;
							}
						}
						if (match) count++;
					}
				}
			}
			return count;
		}

		let bestGrid: string[][] | null = null;
		let bestWordsData: any[] = [];
		let maxAttempts = 50;

		for (let globalAttempt = 0; globalAttempt < maxAttempts; globalAttempt++) {
			let newGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
			let newWordsData: any[] = [];

			function placeWord(wordChars: string[]) {
				for (let attempts = 0; attempts < 100; attempts++) {
					const dir = availableDirs[Math.floor(Math.random() * availableDirs.length)];
					const startR = Math.floor(Math.random() * gridSize);
					const startC = Math.floor(Math.random() * gridSize);

					let canPlace = true;
					for (let i = 0; i < wordChars.length; i++) {
						const r = startR + i * dir[0];
						const c = startC + i * dir[1];
						if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) {
							canPlace = false;
							break;
						}
						if (newGrid[r][c] !== '' && newGrid[r][c] !== wordChars[i]) {
							canPlace = false;
							break;
						}
					}

					if (canPlace) {
						const positions = [];
						for (let i = 0; i < wordChars.length; i++) {
							const r = startR + i * dir[0];
							const c = startC + i * dir[1];
							newGrid[r][c] = wordChars[i];
							positions.push([r, c]);
						}
						return positions;
					}
				}
				return null;
			}

			if (difficulty === 3) {
				wordsList.forEach((w) => {
					const chars = splitWord(w);
					if (chars.length > 2) {
						const nearMissLen = chars.length - 1;
						const nearMissChars = chars.slice(0, nearMissLen);
						nearMissChars[nearMissLen - 1] =
							thaiLetters[Math.floor(Math.random() * thaiLetters.length)];
						placeWord(nearMissChars);
					}
				});
			}

			let allPlaced = true;
			wordsList.forEach((w) => {
				const chars = splitWord(w);
				const pos = placeWord(chars);
				if (pos) {
					newWordsData.push({ word: w, chars, found: false });
				} else {
					allPlaced = false;
				}
			});

			if (!allPlaced) continue; // Try again if couldn't fit words

			let fillLetters = [...thaiLetters];
			if (difficulty === 2) {
				const allWordChars = wordsList.flatMap((w) => splitWord(w));
				if (allWordChars.length > 0) fillLetters = allWordChars;
			} else if (difficulty === 3) {
				const allWordChars = wordsList.flatMap((w) => splitWord(w));
				if (allWordChars.length > 0)
					fillLetters = [...fillLetters, ...allWordChars, ...allWordChars];
			}

			for (let r = 0; r < gridSize; r++) {
				for (let c = 0; c < gridSize; c++) {
					if (newGrid[r][c] === '') {
						newGrid[r][c] = fillLetters[Math.floor(Math.random() * fillLetters.length)];
					}
				}
			}

			// Validate Uniqueness
			let isUnique = true;
			for (let w of wordsList) {
				const chars = splitWord(w);
				// A word search solution is technically unique if the word count is exactly 1 (for normal words),
				// or if it matches exactly the amount of times it was intended, but usually it's just 1.
				if (countWord(chars, newGrid) > 1) {
					isUnique = false;
					break;
				}
			}

			if (isUnique) {
				bestGrid = newGrid;
				bestWordsData = newWordsData;
				break;
			}
		}

		if (!bestGrid) {
			alert('ไม่สามารถสร้างตารางที่รับประกันคำตอบเดียวได้ กรุณาลดจำนวนคำหรือเปลี่ยนระดับความยาก');
			return;
		}

		wordsData = bestWordsData.sort((a, b) => a.word.localeCompare(b.word));
		grid = bestGrid;
		isGenerated = true;
	}

	async function saveToDatabase(isPublic: boolean) {
		if (!isGenerated || !grid) {
			saveStatus = 'สร้างและดูตัวอย่างก่อนบันทึก';
			return;
		}
		if (!title.trim()) {
			saveStatus = 'กรุณาใส่ชื่อปริศนา';
			return;
		}

		isSaving = true;
		saveStatus = 'กำลังบันทึก...';
		savedLink = '';

		const uid = Math.random().toString(36).substring(2, 12);

		try {
			const payload = {
				type: 'wordsearch',
				data: {
					uid,
					title,
					author,
					clues: { grid, wordsData, difficulty },
					is_public: isPublic,
					created_at: new Date().toISOString()
				}
			};

			const res = await fetch('/api/puzzle/add', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			if (!res.ok) throw new Error('Failed to save');

			saveStatus = 'บันทึกสำเร็จ!';
			savedLink = `${window.location.origin}/puzzles/wordsearch/${uid}`;
		} catch (error: any) {
			console.error(error);
			saveStatus = 'เกิดข้อผิดพลาด: ' + error.message;
		} finally {
			isSaving = false;
		}
	}

	function copyLink() {
		if (savedLink) {
			navigator.clipboard.writeText(savedLink);
			alert('คัดลอกลิงก์แล้ว!');
		}
	}
</script>

<svelte:head>
	<title>Code Breaker | Word Search Builder</title>
	<meta
		name="description"
		content="Create and play custom Word Search puzzles with support for Thai letters. Features difficulty levels and automatic grid generation."
	/>






</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<div class="botanical-card bg-base-200 rounded-3xl p-8 shadow-xl border border-base-300">
		<h1 class="text-4xl font-black mb-6 text-center text-primary">Word Search Builder</h1>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<div class="space-y-4">
				<div class="flex flex-col gap-2">
					<label for="ws-title" class="label"><span class="text-sm font-bold">ชื่อปริศนา</span></label>
					<input
						id="ws-title"
						type="text"
						bind:value={title}
						class="input  w-full"
						placeholder="ex. ผลไม้ไทย"
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label for="ws-author" class="label"
						><span class="text-sm font-bold">ชื่อผู้สร้าง (ไม่บังคับ)</span></label
					>
					<input
						id="ws-author"
						type="text"
						bind:value={author}
						class="input  w-full"
						placeholder="ex. นามปากกา"
					/>
				</div>

				<div class="flex flex-col gap-2">
					<div class="label">
						<span class="text-sm font-bold">ขนาดตาราง</span>
					</div>
					<div class="flex flex-col gap-2">
						<label class="cursor-pointer flex items-center gap-2">
							<input type="radio" name="size" value={10} bind:group={gridSize} class="radio radio-primary" />
							<span>10x10 (เล็ก)</span>
						</label>
						<label class="cursor-pointer flex items-center gap-2">
							<input type="radio" name="size" value={12} bind:group={gridSize} class="radio radio-primary" />
							<span>12x12 (กลาง)</span>
						</label>
						<label class="cursor-pointer flex items-center gap-2">
							<input type="radio" name="size" value={15} bind:group={gridSize} class="radio radio-primary" />
							<span>15x15 (ใหญ่)</span>
						</label>
					</div>
				</div>

				<div class="flex flex-col gap-2 mt-2">
					<div class="label">
						<span class="text-sm font-bold">ระดับความยาก (ตัวหลอก)</span>
					</div>
					<div class="flex flex-col gap-2">
						<label class="cursor-pointer flex items-center gap-2">
							<input type="radio" name="diff" value={1} bind:group={difficulty} class="radio radio-primary" />
							<span>ง่าย (สุ่มตัวอักษรมั่ว)</span>
						</label>
						<label class="cursor-pointer flex items-center gap-2">
							<input type="radio" name="diff" value={2} bind:group={difficulty} class="radio radio-primary" />
							<span>ปานกลาง (ดึงตัวอักษรจากคำศัพท์มาหลอก)</span>
						</label>
						<label class="cursor-pointer flex items-center gap-2">
							<input type="radio" name="diff" value={3} bind:group={difficulty} class="radio radio-primary" />
							<span>ยาก (สร้างคำที่เกือบถูก Near Misses ซ่อนไว้)</span>
						</label>
					</div>
				</div>
			</div>

			<div class="space-y-4">
				<div class="flex flex-col gap-2 h-full">
					<label for="wordsearch-textarea" class="label">
						<span class="text-sm font-bold">รายการคำศัพท์ (1 คำต่อบรรทัด)</span>
					</label>
					<textarea
						id="wordsearch-textarea"
						bind:value={wordsInput}
						class="textarea  h-48 text-lg font-medium resize-none"
						placeholder="ส้ม&#10;มะละกอ&#10;กล้วย&#10;สับปะรด"
						on:input={() => {
							isGenerated = false;
						}}
					/>
				</div>
			</div>
		</div>

		<div class="mt-8 border-t border-base-300 pt-8">
			<div class="flex flex-col items-center gap-4">
				<button class="btn btn-secondary btn-lg shadow-lg" on:click={generateGrid}>
					<EyeIcon class="mr-2" />
					{isGenerated ? 'สุ่มตารางใหม่ (Regenerate)' : 'สร้างตัวอย่างตาราง'}
				</button>
			</div>

			{#if isGenerated && grid}
				<div class="flex justify-end mb-4 items-center gap-3">
					<span class="text-sm font-bold text-base-content/60">ขนาดตัวอักษร:</span>
					<input
						type="range"
						min="0.6"
						max="1.5"
						step="0.1"
						bind:value={scaleFactor}
						class="range range-primary range-xs w-32"
					/>
				</div>

				<div
					class="mt-4 bg-base-300 p-4 rounded-3xl shadow-inner overflow-x-auto border border-base-100/50 flex justify-center"
				>
					<div
						class="grid"
						style="width: {grid[0].length * cellSize}px; height: {grid.length *
							cellSize}px; grid-template-columns: repeat({grid[0]
							.length}, 1fr); grid-template-rows: repeat({grid.length}, 1fr);"
					>
						{#each grid as row}
							{#each row as cell}
								<div
									class="flex items-center justify-center font-bold text-base-content hover:bg-base-content/10 transition-colors cursor-pointer rounded-full"
									style="font-size: {1.2 * scaleFactor}rem;"
								>
									{cell}
								</div>
							{/each}
						{/each}
					</div>
				</div>

				<div class="mt-10 flex flex-col items-center">
					<div class="flex gap-4">
						<button
							class="btn btn-primary btn-lg shadow-xl"
							on:click={() => saveToDatabase(true)}
							disabled={isSaving}
						>
							<SaveIcon class="mr-2" />
							{isSaving ? 'กำลังบันทึก...' : 'บันทึกสู่สาธารณะ'}
						</button>
						<button
							class="btn btn-outline btn-lg shadow-xl"
							on:click={() => saveToDatabase(false)}
							disabled={isSaving}
						>
							<SaveIcon class="mr-2" />
							{isSaving ? 'กำลังบันทึก...' : 'บันทึกส่วนตัว (มีแค่ลิงก์)'}
						</button>
					</div>

					{#if saveStatus}
						<div
							class="mt-4 font-bold text-center {saveStatus.includes('สำเร็จ')
								? 'text-success-content'
								: 'text-error-content'}"
						>
							{saveStatus}
						</div>
					{/if}

					{#if savedLink}
						<div
							class="mt-6 bg-base-100 p-4 rounded-xl border border-success/30 flex items-center gap-4 w-full max-w-2xl"
						>
							<div class="flex-1 font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap">
								{savedLink}
							</div>
							<a href={savedLink} target="_blank" class="btn btn-success btn-sm">เปิดเล่น</a>
							<button class="btn btn-outline btn-sm" on:click={copyLink}>
								<LinkIcon size={16} class="mr-1" /> คัดลอกลิงก์
							</button>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
