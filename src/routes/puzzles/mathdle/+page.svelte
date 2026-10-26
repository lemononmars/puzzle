<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import {
		CharState,
		getSolutions,
		validateEquation,
		layout,
		getShareResults,
		evaluate
	} from '#lib/mathdle/Mathdle.js';

	const epochMs = 1642957200000; // January 24, 2022
	const now = Date.now();
	const msInDay = 86400000;
	const dateIndex = Math.floor((now - epochMs) / msInDay);

	const difficultyString = ['Easy', 'Medium', 'Hard'];
	const numberRows = [
		['1', '2', '3', '4', '5'],
		['0', '6', '7', '8', '9'],
		['+', '-', '*', '/', '=']
	];

	let difficulty = 0;
	let input = '';
	let solutions = getSolutions(dateIndex);
	let attempts: string[][] = [[], [], []];
	let gameEnded: boolean[] = [false, false, false];
	let modal = false;
	let copied = false;
	let attemptsContainer: HTMLElement;

	$: solution = solutions[difficulty] || '';
	$: solutionLength = solution.length;
	$: input = input.replace(/[^0-9\+\-\*\/\=]/g, '');
	$: splittedInput = input.split('');

	$: validations = attempts.map((att, idx) =>
		att.map((word) => validateEquation(word, solutions[idx], idx))
	);

	$: alphabetsLayoutRows = layout(
		numberRows.map((r) => r.join('')),
		validations[difficulty]?.flat() || []
	);

	const colors = {
		[CharState.Correct]: 'bg-emerald-600 border-primary/30 text-base-content',
		[CharState.OutOfPlace]: 'bg-amber-600 border-amber-500 text-base-content',
		[CharState.Wrong]: 'bg-base-100 text-base-content border-base-300 text-base-content/70',
		[CharState.NotUsed]: 'bg-base-100 text-base-content border-base-300 text-base-content/70 hover:bg-base-100 text-base-content'
	};

	onMount(() => {
		try {
			const saved = localStorage.getItem('mathdle-attempts');
			if (saved) {
				const parsed = JSON.parse(saved);
				if (parsed?.data?.[dateIndex]) {
					attempts = parsed.data[dateIndex].attempts || [[], [], []];
					gameEnded = parsed.data[dateIndex].win || [false, false, false];
				}
			}
		} catch (e) {
			console.error(e);
		}
	});

	function saveStore() {
		try {
			const saved = localStorage.getItem('mathdle-attempts');
			const storeData = saved ? JSON.parse(saved) : { data: {} };
			storeData.data[`${dateIndex}`] = { attempts, win: gameEnded };
			localStorage.setItem('mathdle-attempts', JSON.stringify(storeData));
		} catch (e) {
			console.error(e);
		}
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.target instanceof HTMLInputElement) return;

		if (e.key === 'Enter') {
			e.preventDefault();
			submit();
		} else if (e.key === 'Backspace') {
			input = input.slice(0, -1);
		} else if ('0123456789+-*/='.includes(e.key)) {
			if (input.length < solutionLength) {
				input += e.key;
			}
		}
	}

	async function submit() {
		if (gameEnded[difficulty]) return;

		if (input.length !== solutionLength) {
			alert(`กรุณาใส่ให้ครบ ${solutionLength} ตัวอักษร`);
			return;
		}

		const splittedEquation = input.split('=');
		if (splittedEquation.length === 1) {
			alert('ขาดเครื่องหมายเท่ากับ (=)');
			return;
		}

		if (splittedEquation.length > 2) {
			alert('มีเครื่องหมายเท่ากับ (=) มากเกินไป');
			return;
		}

		let left: number, right: number;
		try {
			left = evaluate(splittedEquation[0]);
			right = evaluate(splittedEquation[1]);
		} catch (error) {
			alert('นิพจน์คณิตศาสตร์ไม่ถูกต้อง');
			return;
		}

		if (left !== right) {
			alert(`สมการไม่เป็นจริง: ${left} ≠ ${right}`);
			return;
		}

		attempts[difficulty] = [...attempts[difficulty], input];

		const validation = validateEquation(input, solution, difficulty);
		let win = validation.every((v) => v.correct === CharState.Correct);

		if (win) {
			gameEnded[difficulty] = true;
		}

		saveStore();
		input = '';

		await tick();
		if (attemptsContainer) {
			attemptsContainer.scrollTop = attemptsContainer.scrollHeight;
		}
	}

	function copyResult() {
		const results = getShareResults(validations[difficulty]);
		const shareText = `#Mathdle Day ${dateIndex + 1} ${difficultyString[difficulty]} (${
			results.length
		} attempts)\n\n${results.join('\n')}`;

		navigator.clipboard.writeText(shareText);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 2000);
	}
</script>

<svelte:window on:keydown={onKeydown} />

<svelte:head>
	<title>Mathdle | Chi Fun</title>
	<meta name="description" content="เกมนิรนัยทายสมการคณิตศาสตร์ประจำวัน (Mathdle)" />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-3xl flex flex-col items-center gap-6 min-h-[85vh]">
	<!-- Header -->
	<div class="text-center flex flex-col items-center gap-2">
		<h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary">
			Mathdle
		</h1>
		<p class="text-base-content/70 text-sm font-medium">Day #{dateIndex + 1} • ปริศนาสมการคณิตศาสตร์ประจำวัน</p>
	</div>

	<!-- Difficulty Selector -->
	<div class="flex gap-2">
		{#each difficultyString as label, idx}
			<button
				on:click={() => {
					difficulty = idx;
					input = '';
				}}
				class={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 border ${
					difficulty === idx
						? 'bg-amber-500 border-amber-400 text-base-content/70 shadow-lg shadow-amber-500/20'
						: 'bg-base-100 text-base-content border-base-300 text-base-content/70 hover:bg-base-100 text-base-content'
				}`}
			>
				{label}
			</button>
		{/each}
	</div>

	{#if difficulty === 2}
		<div class="bg-error border border-red-800/50 rounded-lg p-3 text-xs text-error-content max-w-md text-center">
			<strong>กฎพิเศษระดับ Hard:</strong> สำหรับทุกตัวเลข N ในคำตอบ ตำแหน่งที่ N จะไม่ถูกตรวจสอบ (เช่น ทาย 1+2=3 ตำแหน่งที่ 1, 2, 3 จะละเว้น)
		</div>
	{/if}

	<!-- Attempts Grid -->
	<div
		bind:this={attemptsContainer}
		class="w-full flex flex-col items-center gap-2 grow max-h-[40vh] overflow-y-auto py-2 px-1"
	>
		{#each attempts[difficulty] as att}
			<div class="flex gap-1.5 justify-center">
				{#each validateEquation(att, solution, difficulty) as { correct, char }}
					<div
						in:scale={{ duration: 300 }}
						out:fade
						class={`w-10 h-10 sm:w-12 sm:h-12 border-2 flex items-center justify-center font-bold text-lg sm:text-xl rounded-lg shadow ${
							colors[correct] || 'bg-base-100 text-base-content border-base-300 text-base-content'
						}`}
					>
						{char ?? ''}
					</div>
				{/each}
			</div>
		{/each}

		{#if !gameEnded[difficulty]}
			<div class="flex gap-1.5 justify-center">
				{#each new Array(solutionLength).fill(0) as _, i}
					<div
						class="w-10 h-10 sm:w-12 sm:h-12 border-2 border-base-300 bg-base-100 text-base-content flex items-center justify-center font-bold text-lg sm:text-xl rounded-lg text-base-content/70 animate-pulse"
					>
						{splittedInput[i] || ''}
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Onscreen Keypad -->
	<div class="w-full max-w-sm flex flex-col gap-2 mt-auto">
		{#each alphabetsLayoutRows as row}
			<div class="flex justify-center gap-1.5">
				{#each Object.entries(row) as [char, state]}
					<button
						on:click={() => {
							if (input.length < solutionLength && !gameEnded[difficulty]) {
								input += char;
							}
						}}
						class={`flex-1 h-11 border-2 font-bold text-lg rounded-lg transition-colors flex items-center justify-center ${colors[state]}`}
					>
						{char}
					</button>
				{/each}
			</div>
		{/each}
	</div>

	<!-- Action Controls -->
	<div class="flex gap-3 justify-center items-center w-full max-w-sm">
		{#if gameEnded[difficulty]}
			<button
				on:click={copyResult}
				class="w-full py-3 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-base-content/70 font-bold rounded-lg transition-all shadow-lg shadow-emerald-500/20"
			>
				{copied ? 'คัดลอกคำตอบแล้ว!' : 'แชร์ผลลัพธ์ (Share)'}
			</button>
		{:else}
			<button
				on:click={submit}
				class="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-base-content/70 font-bold rounded-lg transition-all shadow-lg shadow-amber-500/20 text-sm"
			>
				ส่งคำตอบ (Submit)
			</button>
			<button
				on:click={() => (input = '')}
				class="py-2.5 px-4 bg-base-100 text-base-content hover:bg-base-100 text-base-content text-base-content/70 font-bold rounded-lg border border-base-300 transition-colors text-sm"
			>
				ล้าง
			</button>
			<button
				on:click={() => (modal = true)}
				class="py-2.5 px-4 bg-base-100 text-base-content hover:bg-base-100 text-base-content text-base-content/70 font-bold rounded-lg border border-base-300 transition-colors text-sm"
			>
				กติกา
			</button>
		{/if}
	</div>
</div>

<!-- Rules Modal -->
{#if modal}
	<div
		class="fixed inset-0 z-50 bg-base-100 text-base-content backdrop-blur-sm flex items-center justify-center p-4"
		on:click={() => (modal = false)}
	>
		<div
			class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-xl p-6 max-w-md w-full text-base-content/70 flex flex-col gap-4 shadow-2xl"
			on:click|stopPropagation
		>
			<h2 class="text-2xl font-bold text-warning-content border-b border-base-300 pb-2">กติกาการเล่น Mathdle</h2>
			<ul class="list-disc list-inside flex flex-col gap-2 text-sm text-base-content/70">
				<li>ทายสมการคณิตศาสตร์ประจำวันให้ถูกต้อง</li>
				<li>สีของแต่ละช่องจะเปลี่ยนเพื่อบอกใบ้ความถูกต้อง:</li>
			</ul>
			<div class="flex flex-col gap-2 text-xs">
				<div class="flex items-center gap-2">
					<span class="w-6 h-6 rounded bg-emerald-600 border border-primary/30 flex items-center justify-center font-bold text-base-content">2</span>
					<span>ตัวเลข/เครื่องหมายถูกต้องและถูกตำแหน่ง</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="w-6 h-6 rounded bg-amber-600 border border-amber-500 flex items-center justify-center font-bold text-base-content">+</span>
					<span>อยู่ในสมการแต่อยู่ผิดตำแหน่ง</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="w-6 h-6 rounded bg-base-100 text-base-content border border-base-300 flex items-center justify-center font-bold text-base-content/70">7</span>
					<span>ไม่มีอยู่ในสมการ</span>
				</div>
			</div>
			<button
				on:click={() => (modal = false)}
				class="mt-2 w-full py-2 bg-amber-500 hover:bg-amber-400 text-base-content/70 font-bold rounded-lg transition-colors"
			>
				เข้าใจแล้ว
			</button>
		</div>
	</div>
{/if}
