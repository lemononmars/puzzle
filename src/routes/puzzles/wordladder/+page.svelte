<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { fade, scale, fly } from 'svelte/transition';
	import { buildWordList, generatePuzzle, bfsPath, splitSlots, diffSlots } from '#lib/wordladder/wordladder.js';
	import dictJson from '#lib/dict.json';
	import { HelpCircleIcon, Maximize2Icon, Minimize2Icon } from 'svelte-feather-icons';

	let isFullscreen = false;
	function toggleFullscreen() {
		const elem = document.getElementById('wordladder-game-container');
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

	// ─── State ────────────────────────────────────────────────────────────────
	let slotSize: 3 | 4 | 5 | 6 = 3;
	let wordList: string[] = [];
	let wordSet: Set<string> = new Set();

	let start = '';
	let end = '';
	let minPath: string[] = [];

	let chain: string[] = [];
	let inputVal = '';
	let inputEl: HTMLInputElement;

	let loading = true;
	let solved = false;
	let showHint = false;       // next-word only hint
	let showSolution = false;   // full path reveal (เฉลย)
	let hintWord = '';          // single next word hint
	let hintPath: string[] | null = null;
	let errorMsg = '';
	let copied = false;
	let showRules = false;      // rules modal

	let scrollEl: HTMLDivElement;

	// Random puzzle (bypass daily seed)
	let randomSeed: number | undefined = undefined;

	// Daily seed based on date + slot size
	function getDailySeed(n: number) {
		const d = new Date();
		return (d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()) * 10 + n;
	}

	// ─── Init ─────────────────────────────────────────────────────────────────
	async function initPuzzle(n: typeof slotSize, seed?: number) {
		loading = true;
		solved = false;
		showHint = false;
		showSolution = false;
		hintWord = '';
		hintPath = null;
		errorMsg = '';
		chain = [];
		inputVal = '';

		await new Promise((r) => setTimeout(r, 10));

		wordList = buildWordList(dictJson as string[], n);
		wordSet = new Set(wordList);

		const useSeed = seed;
		const puzzle = generatePuzzle(wordList, 3, n === 3 ? 5 : n === 4 ? 6 : n === 5 ? 7 : 8, useSeed);

		if (!puzzle) {
			errorMsg = 'ไม่สามารถสร้างโจทย์ได้ กรุณาลองใหม่';
			loading = false;
			return;
		}

		start = puzzle.start;
		end = puzzle.end;
		minPath = puzzle.minPath;
		chain = [start];
		loading = false;

		await new Promise((r) => setTimeout(r, 50));
		inputEl?.focus();
	}

	function newRandom() {
		randomSeed = Math.floor(Math.random() * 2_000_000_000);
		initPuzzle(slotSize, randomSeed);
	}

	onMount(() => { initPuzzle(slotSize); });

	afterUpdate(() => {
		if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
	});

	function changeSlotSize(n: number) {
		const s = n as 3 | 4 | 5 | 6;
		if (s === slotSize && !loading) return;
		slotSize = s;
		randomSeed = undefined;
		initPuzzle(s);
	}

	// ─── Input & submission ───────────────────────────────────────────────────
	function submitWord() {
		if (solved || loading) return;
		const word = inputVal.trim();
		if (!word) return;

		if (!wordSet.has(word)) { errorMsg = `"${word}" ไม่พบในพจนานุกรม`; return; }

		const last = chain[chain.length - 1];
		if (word === last) { errorMsg = 'คำซ้ำกับคำก่อนหน้า'; return; }
		if (chain.includes(word)) { errorMsg = `"${word}" ถูกใช้ไปแล้ว`; return; }

		const d = diffSlots(splitSlots(last), splitSlots(word));
		if (d !== 1) {
			errorMsg = `"${word}" ต่างจากคำก่อน ${d === Infinity ? '∞' : d} ช่อง (ต้องต่างแค่ 1 ช่อง)`;
			return;
		}

		chain = [...chain, word];
		inputVal = '';
		errorMsg = '';
		// Invalidate hint when user moves
		showHint = false;
		hintWord = '';
		hintPath = null;

		if (word === end) solved = true;
	}

	function undoLast() {
		if (chain.length <= 1) return;
		chain = chain.slice(0, -1);
		errorMsg = '';
		showHint = false;
		hintWord = '';
		hintPath = null;
		if (solved) solved = false;
	}

	function resetChain() {
		chain = [start];
		inputVal = '';
		errorMsg = '';
		solved = false;
		showHint = false;
		showSolution = false;
		hintWord = '';
		hintPath = null;
	}

	let revealingSolution = false;

	function requestHint() {
		if (solved || loading || revealingSolution) return;
		const currentWord = chain[chain.length - 1] || start;
		const path = bfsPath(currentWord, end, wordList);
		if (path && path.length > 1) {
			const nextWord = path[1];
			chain = [...chain, nextWord];
			errorMsg = '';
			if (nextWord === end) solved = true;
		}
	}

	async function revealSolution() {
		if (solved || loading || revealingSolution) return;
		revealingSolution = true;
		await new Promise((r) => setTimeout(r, 20));

		const currentWord = chain[chain.length - 1] || start;
		const path = bfsPath(currentWord, end, wordList);
		if (path && path.length > 1) {
			chain = [...chain, ...path.slice(1)];
		} else if (minPath && minPath.length > 0) {
			chain = [...minPath];
		}
		solved = true;
		errorMsg = '';
		revealingSolution = false;
	}

	function copyResult() {
		const steps = chain.length - 1;
		const minSteps = minPath.length - 1;
		const emoji = steps === minSteps ? '🏆' : '✅';
		const text = [
			`Thai Word Ladder – ${slotSize} ช่อง ${emoji}`,
			`${start} → ${end}`,
			`${steps} ก้าว (น้อยสุด ${minSteps} ก้าว)`,
			'',
			chain.join(' → ')
		].join('\n');
		navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') { showRules = false; return; }
		if (e.target instanceof HTMLInputElement) {
			if (e.key === 'Enter') { e.preventDefault(); submitWord(); }
			return;
		}
	}

	function displaySlots(word: string) { return splitSlots(word); }

	// Live slots from what the user is currently typing
	$: typedSlots = splitSlots(inputVal);

	function getDiffIndices(a: string, b: string): Set<number> {
		const sa = splitSlots(a);
		const sb = splitSlots(b);
		const res = new Set<number>();
		for (let i = 0; i < Math.min(sa.length, sb.length); i++) {
			if (sa[i] !== sb[i]) res.add(i);
		}
		return res;
	}
</script>

<svelte:window on:keydown={onKeydown} />

<svelte:head>
	<title>Word Ladder | Code Breaker</title>
	<meta name="description" content="ปริศนาบันไดคำ (Word Ladder) เปลี่ยนคำภาษาไทยทีละหนึ่งช่องเพื่อไปให้ถึงคำปลายทาง" />
</svelte:head>

<div id="wordladder-game-container" class="max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-4 flex flex-col gap-3 select-none">
	<div class="botanical-card bg-base-100 text-base-content text-base-content border border-base-300 rounded-3xl p-3 sm:p-6 shadow-2xl flex flex-col gap-3 relative overflow-hidden">
		<div class="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

		<!-- ── Header row ─────────────────────────────────────────────────── -->
		<div class="flex items-center justify-between gap-2 border-b border-base-300/80 pb-2">
			<div class="flex items-center gap-2 overflow-hidden">
				<span class="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0"></span>
				<h1 class="text-base sm:text-xl font-extrabold text-base-content tracking-tight truncate">
					Word Ladder <span class="text-xs text-base-content/70 font-medium hidden sm:inline">(บันไดคำ)</span>
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
				<a
					href="/puzzles/wordladder/graph"
					class="btn btn-ghost btn-xs sm:btn-sm gap-1 text-base-content hover:bg-base-200"
					title="ดู Connected Components"
				>
					<span>📊 กราฟ</span>
				</a>
				<button
					on:click={newRandom}
					class="btn btn-ghost btn-xs sm:btn-sm gap-1 text-primary hover:bg-primary/20"
				>
					<span>🎲 สุ่มใหม่</span>
				</button>
				<button
					on:click={() => (showRules = true)}
					class="btn btn-ghost btn-xs sm:btn-sm text-base-content hover:bg-base-200"
				>
					?
				</button>
			</div>
		</div>

		<!-- ── Slot-size selector ─────────────────────────────────────────── -->
		<div class="flex gap-2 justify-center">
			{#each [3, 4, 5, 6] as n}
				<button
					on:click={() => changeSlotSize(n)}
					class={`btn flex-1 max-w-[100px] h-10 rounded-xl font-bold text-sm transition-all duration-200 ${
						slotSize === n
							? 'btn-primary text-primary-content shadow-lg'
							: 'btn-outline border-base-300 text-base-content hover:bg-base-200'
					}`}
				>
					{n} ช่อง
				</button>
			{/each}
		</div>

	<!-- ── Main content ───────────────────────────────────────────────── -->
	{#if loading}
		<div class="flex-1 flex flex-col items-center justify-center gap-3">
			<div class="w-10 h-10 rounded-full border-4 border-primary/30 border-t-emerald-400 animate-spin"></div>
			<p class="text-base-content/70 text-sm">กำลังสร้างโจทย์...</p>
		</div>

	{:else if errorMsg && !start}
		<div class="flex-1 flex items-center justify-center text-error-content text-sm">{errorMsg}</div>

	{:else}
		<!-- ── Chain (scrollable) ──────────────────────────────────── -->
		<div bind:this={scrollEl} class="flex-1 overflow-y-auto flex flex-col gap-1 py-1 min-h-0">
			{#each chain as word, i}
				{@const isStart = i === 0}
				{@const isLast = i === chain.length - 1}
				{@const isEndWord = word === end}
				{@const diffIndices = i > 0 ? getDiffIndices(chain[i - 1], word) : new Set()}
				<div in:scale={{ duration: 180, start: 0.93 }} class="flex justify-center gap-1.5">
					{#each displaySlots(word) as slot, si}
						<div
							class={`w-9 h-9 rounded-lg border-2 flex items-center justify-center font-bold text-base shadow transition-all ${
								isEndWord && isLast
									? 'bg-emerald-500 border-primary/30 text-base-content/70'
									: isStart
									? 'bg-base-100 text-base-content border-base-300 text-base-content/70'
									: diffIndices.has(si)
									? 'bg-amber-600/80 border-amber-400 text-base-content'
									: 'bg-base-100 text-base-content border-base-300 text-base-content/70'
							}`}
						>
							{slot}
						</div>
					{/each}
				</div>
				{#if isEndWord && isLast}
					<div class="text-center text-primary text-xs font-bold">🎉 ถึงแล้ว!</div>
				{:else}
					<div class="text-base-content/70 text-center text-xs leading-none">↓</div>
				{/if}
			{/each}

			<!-- Interactive input row + ปลายทาง -->
			{#if !solved}
				<div class="flex justify-center gap-1.5">
					{#each Array(slotSize) as _, si}
						{@const slot = typedSlots[si] ?? ''}
						<div
							class={`w-9 h-9 rounded-lg border-2 flex items-center justify-center font-bold text-base transition-all ${
								slot
									? 'bg-base-100 text-base-content border-base-300 text-base-content/70'
									: 'border-dashed border-base-300 bg-transparent text-transparent'
							}`}
						>
							{slot}
						</div>
					{/each}
				</div>
				<div class="text-base-content/70 text-center text-xs leading-none">↓</div>
				<!-- ปลายทาง row — always last in chain view -->
				<div class="flex justify-center gap-1.5">
					{#each displaySlots(end) as slot}
						<div class="w-9 h-9 rounded-lg bg-base-300 text-base-content border-2 border-primary/30 flex items-center justify-center font-bold text-base text-primary shadow">
							{slot}
						</div>
					{/each}
				</div>
				<div class="text-xs text-base-content/70 text-center">ปลายทาง · น้อยสุด <span class="text-base-content/70 font-bold">{minPath.length - 1}</span> ก้าว</div>
			{/if}
		</div>



		<!-- ── Error message ────────────────────────────────────────── -->
		{#if errorMsg}
			<div in:fly={{ y: 4, duration: 150 }} out:fade={{ duration: 100 }}
				class="shrink-0 text-error-content text-xs text-center bg-error border border-red-800/40 rounded-lg px-3 py-1.5">
				{errorMsg}
			</div>
		{/if}

		<!-- ── Input + controls ─────────────────────────────────────── -->
		{#if !solved}
			<form on:submit|preventDefault={submitWord} class="shrink-0 flex gap-2">
				<input
					bind:this={inputEl}
					bind:value={inputVal}
					on:input={() => (errorMsg = '')}
					type="text"
					placeholder="พิมพ์คำถัดไป..."
					class="input  flex-1 rounded-xl border-2 border-base-300 bg-base-300 text-base-content px-3 py-2.5 font-bold focus:outline-none focus:border-primary transition-colors"
					autocomplete="off"
					spellcheck="false"
				/>
				<button
					type="submit"
					class="btn btn-primary text-primary-content min-w-[56px] px-4 rounded-xl font-bold text-sm transition-all"
				>
					ส่ง
				</button>
			</form>

			<div class="shrink-0 flex gap-1.5 justify-center">
				<button
					on:click={undoLast}
					disabled={chain.length <= 1}
					class="btn btn-outline border-base-300 text-base-content hover:bg-base-200 flex-1 h-11 rounded-lg text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
				>
					↩ ย้อน
				</button>
				<button
					on:click={newRandom}
					class="btn btn-outline border-base-300 text-base-content hover:bg-base-200 flex-1 h-11 rounded-lg text-xs font-bold transition-colors"
				>
					🎲 ข้อใหม่
				</button>
				<button
					on:click={requestHint}
					class="btn btn-secondary text-secondary-content flex-1 h-11 rounded-lg text-xs font-bold transition-colors"
				>
					💡 ใบ้
				</button>
				<button
					on:click={revealSolution}
					disabled={revealingSolution}
					class="btn btn-error text-error-content flex-1 h-11 rounded-lg text-xs font-bold disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
				>
					{#if revealingSolution}
						<div class="w-4 h-4 rounded-full border-2 border-error-content border-t-transparent animate-spin"></div>
					{:else}
						📖 เฉลย
					{/if}
				</button>
			</div>


		{:else}
			<!-- ── Solved panel ───────────────────────────────────────── -->
			<div in:scale={{ duration: 250 }} class="shrink-0 flex flex-col items-center gap-2">
				<p class="text-lg font-extrabold text-primary">
					{chain.length - 1 === minPath.length - 1 ? '🏆 ยอดเยี่ยม! เส้นทางสั้นที่สุด!' : '🎉 แก้ปริศนาสำเร็จ!'}
				</p>
				<p class="text-base-content/70 text-xs">
					คุณใช้ <span class="text-base-content font-bold">{chain.length - 1}</span> ก้าว
					(น้อยสุด <span class="text-primary font-bold">{minPath.length - 1}</span> ก้าว)
				</p>
				{#if chain.length - 1 > minPath.length - 1}
					<div class="text-xs text-base-content/70 flex flex-wrap gap-1 items-center justify-center">
						<span>เส้นทางน้อยสุด:</span>
						{#each minPath as w, i}
							<span class={i === 0 ? 'text-primary' : i === minPath.length - 1 ? 'text-primary' : 'text-base-content/70'} class:font-bold={true}>{w}</span>
							{#if i < minPath.length - 1}<span class="text-base-content/70">→</span>{/if}
						{/each}
					</div>
				{/if}
				<div class="flex gap-2 flex-wrap justify-center mt-1">
					<button
						on:click={copyResult}
						class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-base-content/70 font-bold text-sm transition-all"
					>
						{copied ? '✓ คัดลอกแล้ว!' : '📋 แชร์'}
					</button>
					<button
						on:click={newRandom}
						class="px-4 py-2 rounded-xl bg-base-100 text-base-content hover:bg-base-200 text-base-content text-base-content/70 font-bold text-sm transition-colors border border-base-300"
					>
						🎲 สุ่มข้อใหม่
					</button>
				</div>
			</div>
		{/if}
	{/if}
</div>
</div>

<!-- ── Rules Modal ─────────────────────────────────────────────────────────── -->
{#if showRules}
	<div
		class="fixed inset-0 z-50 bg-base-100 text-base-content backdrop-blur-sm flex items-center justify-center p-4"
		on:click={() => (showRules = false)}
	>
		<div
			class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl p-6 max-w-sm w-full text-base-content/70 flex flex-col gap-4 shadow-2xl"
			on:click|stopPropagation
		>
			<h2 class="text-xl font-bold text-primary border-b border-base-300 pb-2">กติกา Word Ladder</h2>
			<ul class="list-disc list-inside flex flex-col gap-2 text-sm text-base-content/70">
				<li>โจทย์จะให้คำ <strong class="text-base-content">เริ่มต้น</strong> และ <strong class="text-base-content">ปลายทาง</strong></li>
				<li>เปลี่ยน <strong class="text-base-content">หนึ่งช่อง</strong> ต่อก้าว</li>
				<li>หนึ่งช่อง = พยัญชนะ + สระ + วรรณยุกต์ รวมกัน</li>
				<li>ตัวอย่าง: <span class="text-primary font-bold">เก่ง → เจ๊ง → เจ้ง</span></li>
				<li>คำทุกคำต้องอยู่ในพจนานุกรม</li>
				<li>พยายามถึงปลายทางด้วยก้าวน้อยที่สุด!</li>
			</ul>
			<div class="flex flex-col gap-1.5 text-xs">
				<div class="flex items-center gap-2">
					<span class="w-6 h-6 rounded bg-base-100 text-base-content border-2 border-base-300 flex items-center justify-center font-bold text-base-content/70">ก</span>
					<span>ช่องปกติ (ยังไม่เปลี่ยน)</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="w-6 h-6 rounded bg-amber-600/80 border-2 border-amber-400 flex items-center justify-center font-bold text-base-content">ข</span>
					<span>ช่องที่เปลี่ยนจากขั้นก่อน</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="w-6 h-6 rounded bg-cyan-500 border-2 border-primary/30 flex items-center justify-center font-bold text-base-content/70">ค</span>
					<span>ถึงปลายทางแล้ว!</span>
				</div>
			</div>
			<button
				on:click={() => (showRules = false)}
				class="mt-1 w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-base-content/70 font-bold rounded-2xl transition-colors"
			>
				เข้าใจแล้ว
			</button>
		</div>
	</div>
{/if}
