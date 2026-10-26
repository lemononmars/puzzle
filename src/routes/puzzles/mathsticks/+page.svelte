<script lang="ts">
	import MathstickBoard from '#lib/mathsticks/MathstickBoard.svelte';
	import puzzlesData from '#lib/mathsticks/puzzles.json';
	import { evaluateExpr } from '#lib/mathsticks/solver.js';
	import { fade } from 'svelte/transition';

	const CATEGORIES = [
		{ id: '1_stick_0_19', name: 'ง่าย', moves: 1 },
		{ id: '1_stick_2_digits', name: 'กลาง', moves: 1 },
		{ id: '2_sticks_0_19', name: 'ยาก', moves: 2 },
		{ id: '2_sticks_2_digits', name: 'ยากสัส', moves: 2 }
	];

	const ALL_LEGEND_SYMBOLS = [
		{ label: '0', tokens: ['0'] },
		{ label: '1', tokens: ['1'] },
		{ label: '2', tokens: ['2'] },
		{ label: '3', tokens: ['3'] },
		{ label: '4', tokens: ['4'] },
		{ label: '5', tokens: ['5'] },
		{ label: '6', tokens: ['6'] },
		{ label: '7', tokens: ['7'] },
		{ label: '8', tokens: ['8'] },
		{ label: '9', tokens: ['9'] },
		{ label: '-', tokens: ['-'] },
		{ label: '+', tokens: ['+'] },
		{ label: '=', tokens: ['='] }
	];

	let activeCategoryIdx = 0;
	let currentPuzzleIndex = 0;
	let currentPuzzle = puzzlesData['1_stick_0_19'][0];

	let activeTokens: string[] = ['6', '+', '4', '=', '4'];
	let initialTokens: string[] = ['6', '+', '4', '=', '4'];
	let movesCount = 0;
	let solved = false;
	let revealed = false;
	let showInfoModal = false;

	$: activeCategory = CATEGORIES[activeCategoryIdx];
	$: categoryFilteredSolutions = currentPuzzle?.solutions || [];

	function selectCategory(idx: number) {
		activeCategoryIdx = idx;
		nextPuzzle();
	}

	function nextPuzzle() {
		const list = puzzlesData[CATEGORIES[activeCategoryIdx].id as keyof typeof puzzlesData] || [];
		if (list.length === 0) return;

		let randIdx = Math.floor(Math.random() * list.length);
		if (list.length > 1 && randIdx === currentPuzzleIndex) {
			randIdx = (randIdx + 1) % list.length;
		}

		currentPuzzleIndex = randIdx;
		currentPuzzle = list[randIdx];

		activeTokens = currentPuzzle.equation.split('');
		initialTokens = [...activeTokens];
		movesCount = 0;
		solved = false;
		revealed = false;
	}

	function resetPuzzle() {
		activeTokens = [...initialTokens];
		movesCount = 0;
		solved = false;
	}

	function checkStatus() {
		const currentStr = activeTokens.join('');
		const parts = currentStr.split('=');
		if (parts.length === 2) {
			const lhs = evaluateExpr(parts[0]);
			const rhs = evaluateExpr(parts[1]);
			if (lhs !== null && rhs !== null && lhs === rhs) {
				solved = true;
			} else {
				solved = false;
			}
		} else {
			solved = false;
		}
	}

	// Initialize on load
	selectCategory(0);
</script>

<svelte:head>
	<title>Mathsticks | Chi Fun</title>
	<meta name="description" content="ปริศนาย้ายไม้ขีดไฟเพื่อแก้สมการคณิตศาสตร์ (Mathsticks)" />
</svelte:head>

<div class="container mx-auto px-2 sm:px-4 py-3 sm:py-6 max-w-4xl flex flex-col items-center gap-4 sm:gap-6 min-h-[85vh]">
	<!-- Header & Info Button -->
	<div class="text-center flex flex-col items-center gap-1 relative w-full">
		<button
			on:click={() => (showInfoModal = true)}
			class="absolute top-0 right-2 px-2.5 py-1 bg-base-100 text-base-content hover:bg-base-100 text-base-content text-base-content/70 rounded-xl border border-base-300 text-[11px] sm:text-xs font-bold transition-colors flex items-center gap-1 shadow"
			title="ดูสัญลักษณ์กติกา"
		>
			ℹ️ กติกา
		</button>

		<h1 class="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-primary !my-0">
			Mathsticks 🔥
		</h1>
		<p class="text-base-content/70 text-xs sm:text-sm font-medium">ย้ายไม้ขีดไฟเพื่อให้ได้สมการคณิตศาสตร์ที่ถูกต้อง</p>
	</div>

	<!-- Category Selection (ง่าย, กลาง, ยาก, ยากสัส) -->
	<div class="flex flex-wrap justify-center gap-1.5 sm:gap-2">
		{#each CATEGORIES as cat, idx}
			<button
				on:click={() => selectCategory(idx)}
				class={`btn btn-sm rounded-xl font-bold transition-all ${
					activeCategoryIdx === idx
						? 'btn-warning shadow-lg shadow-warning/20'
						: 'btn-ghost bg-base-200 text-base-content hover:bg-base-300'
				}`}
			>
				{cat.name}
			</button>
		{/each}
	</div>

	<!-- Constraint Banner & Move Counter -->
	<div class="flex items-center gap-3 sm:gap-4 bg-base-100 text-base-content border border-base-300 px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-2xl shadow text-xs sm:text-sm">
		<div class="font-bold text-warning-content flex items-center gap-1">
			<span>🎯 เงื่อนไข:</span>
			<span class="text-base-content/70 font-extrabold">ย้าย {activeCategory.moves} ก้าน</span>
		</div>
		<div class="h-4 w-px bg-base-100 text-base-content" />
		<div class="font-bold text-base-content/70 flex items-center gap-1">
			<span>ย้ายแล้ว:</span>
			<span class={`font-extrabold font-mono ${movesCount > activeCategory.moves ? 'text-error-content' : 'text-primary'}`}>
				{movesCount} / {activeCategory.moves}
			</span>
			<span>ก้าน</span>
		</div>
	</div>

	<!-- Interactive Matchstick Board -->
	<div class="w-full flex flex-col items-center gap-6">
		<MathstickBoard
			bind:equationTokens={activeTokens}
			{initialTokens}
			bind:movesCount
			onMove={checkStatus}
			isSolved={solved}
		/>

		<!-- Controls -->
		<div class="flex items-center gap-3 sm:gap-4">
			{#if solved}
				<!-- Player solved by themselves -->
				<span class="text-primary font-extrabold text-xl sm:text-2xl flex items-center gap-1.5 animate-bounce">
					✅ ถูกต้อง
				</span>

				<button
					on:click={nextPuzzle}
					class="btn btn-warning rounded-2xl font-bold shadow-xl shadow-warning/20 text-base px-6"
				>
					🎲 ข้อใหม่
				</button>
			{:else if revealed}
				<!-- Player clicked "เปิดเฉลย" -->
				<button
					on:click={nextPuzzle}
					class="btn btn-warning rounded-2xl font-bold shadow-xl shadow-warning/20 text-base px-6"
				>
					🎲 ข้อใหม่
				</button>
			{:else}
				<!-- Normal game state -->
				<button
					on:click={resetPuzzle}
					class="btn btn-ghost btn-sm bg-base-200 text-base-content border border-base-300 rounded-xl font-bold px-4"
				>
					🔄 รีเซ็ต
				</button>

				<button
					on:click={nextPuzzle}
					class="btn btn-warning btn-sm rounded-xl font-bold shadow-md shadow-warning/20 px-5"
				>
					🎲 ข้อใหม่
				</button>

				<button
					on:click={() => (revealed = true)}
					class="btn btn-secondary btn-sm rounded-xl font-bold px-4"
				>
					💡 เปิดเฉลย
				</button>
			{/if}
		</div>
	</div>

	<!-- Solutions Panel when "เปิดเฉลย" is active -->
	{#if revealed}
		<div in:fade class="botanical-card w-full max-w-4xl bg-base-100 text-base-content border border-base-300 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl">
			<div class="flex justify-between items-center border-b border-base-300 pb-3">
				<h3 class="text-lg font-bold text-secondary">💡 เฉลยคำตอบ (ย้าย {activeCategory.moves} ก้าน)</h3>
				<span class="text-xs text-base-content/70 font-mono">{categoryFilteredSolutions.length} วิธี</span>
			</div>

			<div class="flex flex-col gap-4">
				{#each categoryFilteredSolutions as solEq, idx}
					<div class="botanical-card bg-base-100 text-base-content p-4 rounded-2xl border border-base-300 flex flex-col gap-2">
						<span class="text-xs text-base-content/70 font-medium">คำตอบที่ {idx + 1}:</span>
						<MathstickBoard
							equationTokens={solEq.split('')}
							initialTokens={initialTokens}
							isSolved={true}
							showHelperText={false}
						/>
					</div>
				{/each}
			</div>

			<button
				on:click={nextPuzzle}
				class="btn btn-warning rounded-2xl font-bold shadow-lg shadow-warning/20 w-full py-3 mt-2"
			>
				🎲 สุ่มข้อใหม่ (Next Puzzle)
			</button>
		</div>
	{/if}
</div>

<!-- Rules & Symbol Legend Modal -->
{#if showInfoModal}
	<div
		class="fixed inset-0 z-50 bg-base-100 text-base-content backdrop-blur-sm flex items-center justify-center p-4 pt-16 sm:pt-20 overflow-y-auto"
		on:click={() => (showInfoModal = false)}
	>
		<div
			class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-2xl p-4 sm:p-6 max-w-xl w-full text-base-content/70 flex flex-col gap-4 shadow-2xl my-auto"
			on:click|stopPropagation
		>
			<div class="flex justify-between items-center border-b border-base-300 pb-3">
				<h2 class="text-xl sm:text-2xl font-bold text-warning-content">ℹ️ รูปแบบตัวเลขและเครื่องหมาย</h2>
				<button
					on:click={() => (showInfoModal = false)}
					class="btn btn-ghost btn-xs btn-circle text-base-content/70 hover:text-base-content"
				>
					✕
				</button>
			</div>

			<div class="grid grid-cols-4 sm:grid-cols-7 gap-1.5 overflow-x-hidden my-2">
				{#each ALL_LEGEND_SYMBOLS as item}
					<div class="flex flex-col items-center p-1">
						<MathstickBoard
							equationTokens={item.tokens}
							initialTokens={item.tokens}
							showHelperText={false}
							showParsedLabels={true}
							showBorder={false}
						/>
					</div>
				{/each}
			</div>

			<button
				on:click={() => (showInfoModal = false)}
				class="btn btn-warning rounded-xl font-bold w-full mt-1"
			>
				เข้าใจแล้ว
			</button>
		</div>
	</div>
{/if}
