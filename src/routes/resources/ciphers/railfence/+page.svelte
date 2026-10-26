<script lang="ts">
import UiArrowLeft from '@lucide/svelte/icons/arrow-left';
	import AnswerChecker from '#lib/components/AnswerChecker.svelte';
	import CheckCircleIcon from '@lucide/svelte/icons/circle-check';
import RepeatIcon from '@lucide/svelte/icons/repeat';
import CopyIcon from '@lucide/svelte/icons/copy';
import CheckIcon from '@lucide/svelte/icons/check';

	let inputText = 'WE ARE DISCOVERED FLEE AT ONCE';
	let rails = 3;
	let isSwapped = false;
	let isCopied = false;

	function encodeRailFence(text: string, numRails: number): string {
		const clean = text.toUpperCase().replace(/[^A-Z]/g, '');
		if (numRails <= 1 || clean.length <= numRails) return clean;

		const fence: string[][] = Array.from({ length: numRails }, () => []);
		let rail = 0;
		let direction = 1;

		for (const ch of clean) {
			fence[rail].push(ch);
			rail += direction;
			if (rail === 0 || rail === numRails - 1) direction *= -1;
		}

		return fence.map((r) => r.join('')).join('');
	}

	function decodeRailFence(cipher: string, numRails: number): string {
		const clean = cipher.toUpperCase().replace(/[^A-Z]/g, '');
		if (numRails <= 1 || clean.length <= numRails) return clean;

		const pattern: number[] = [];
		let rail = 0;
		let direction = 1;
		for (let i = 0; i < clean.length; i++) {
			pattern.push(rail);
			rail += direction;
			if (rail === 0 || rail === numRails - 1) direction *= -1;
		}

		const counts = Array(numRails).fill(0);
		pattern.forEach((r) => counts[r]++);

		const railsText: string[][] = [];
		let idx = 0;
		for (let r = 0; r < numRails; r++) {
			railsText.push(clean.slice(idx, idx + counts[r]).split(''));
			idx += counts[r];
		}

		let result = '';
		for (const r of pattern) {
			result += railsText[r].shift();
		}
		return result;
	}

	$: processedResult = isSwapped
		? decodeRailFence(inputText, rails)
		: encodeRailFence(inputText, rails);

	// Grid matrix for interactive visual diagram
	$: visualGrid = (() => {
		const clean = inputText.toUpperCase().replace(/[^A-Z]/g, '');
		const grid: (string | null)[][] = Array.from({ length: rails }, () =>
			Array(clean.length).fill(null)
		);
		let r = 0;
		let dir = 1;

		for (let col = 0; col < clean.length; col++) {
			grid[r][col] = clean[col];
			r += dir;
			if (r === 0 || r === rails - 1) dir *= -1;
		}
		return grid;
	})();

	function copyOutput() {
		navigator.clipboard.writeText(processedResult);
		isCopied = true;
		setTimeout(() => (isCopied = false), 2000);
	}

	let answers = ['', '', ''];
	let feedback = ['', '', ''];

	const exercises = [
		{ id: 1, cipherText: 'HOLEL (Rails = 2)', correctAnswer: 'HELLO' },
		{ id: 2, cipherText: 'CDEO (Rails = 2)', correctAnswer: 'CODE' },
		{ id: 3, cipherText: 'WECRLTEERDSOEEFEAOC (Rails = 3)', correctAnswer: 'WEAREDISCOVEREDFLEEATONCE' }
	];

	function checkAnswer(idx: number) {
		const user = answers[idx].trim().toUpperCase().replace(/[^A-Z]/g, '');
		if (user === exercises[idx].correctAnswer) {
			feedback[idx] = 'correct';
		} else {
			feedback[idx] = 'incorrect';
		}
	}
</script>

<svelte:head>
	<title>Chi Fun | Rail Fence Cipher 🔐</title>
	<meta name="description" content="คู่มือและแบบฝึกหัด Rail Fence Cipher รหัสลับแบบซิกแซก" />
</svelte:head>

<div class="flex flex-col gap-8 w-full max-w-5xl mx-auto px-4 py-8 select-none">
	<div class="flex items-center justify-between">
		<a href="/resources/ciphers" class="btn btn-ghost btn-xs gap-1.5 font-bold">
			<UiArrowLeft size={16} class="inline-block align-middle" aria-hidden="true" /> กลับไปคลังรหัสลับ
		</a>
	</div>

	<header class="space-y-2 text-center md:text-left">
		<div class="flex items-center gap-2 justify-center md:justify-start">
			<span class="badge badge-info font-bold text-xs py-2 px-3">EASY - MEDIUM</span>
			<span class="text-xs text-base-content/70 font-mono uppercase tracking-wider">Transposition Cipher</span>
		</div>
		<h1 class="text-3xl lg:text-4xl font-black text-base-content">Rail Fence Cipher (รหัสรั้วกั้น / Zigzag)</h1>
		<p class="text-base-content/70 text-sm lg:text-base leading-relaxed">
			รหัสสลับตำแหน่งแบบฟันปลา (Zigzag) โดยเขียนอักษรลงบนรางรั้วกั้น แล้วอ่านตามแนวนอนทีละบรรทัด
		</p>
	</header>

	<!-- Interactive Visual Zigzag Grid Diagram -->
	<section class="botanical-card bg-base-200 p-6 rounded-3xl border border-base-300 shadow-xl space-y-4">
		<div class="flex items-center justify-between flex-wrap gap-2">
			<h2 class="text-xl font-extrabold text-primary flex items-center gap-2">
				<span>📐</span> ผังจำลองรางซิกแซก (Visual Rail Fence Diagram)
			</h2>
			<span class="badge badge-primary font-bold text-xs px-3 py-1.5">{rails} ราง (Rails)</span>
		</div>

		<div class="overflow-x-auto pb-2">
			<div class="flex flex-col gap-2 font-mono text-center min-w-[500px]">
				{#each visualGrid as row, rIdx}
					<div class="flex items-center gap-1.5 bg-base-100 text-base-content p-2 rounded-xl border border-base-300">
						<span class="w-12 text-xs font-bold text-amber-400 shrink-0">ราง {rIdx + 1}</span>
						<div class="flex items-center gap-1 flex-1 overflow-x-auto">
							{#each row as cell}
								{#if cell !== null}
									<div class="w-7 h-7 rounded-lg bg-primary text-primary-content font-bold flex items-center justify-center text-sm shadow-md animate-pulse">
										{cell}
									</div>
								{:else}
									<div class="w-7 h-7 rounded-lg bg-base-100 text-base-content border border-base-300"></div>
								{/if}
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Converter Tool -->
	<section class="botanical-card bg-base-200 p-6 rounded-3xl border border-base-300 shadow-xl space-y-4">
		<div class="flex items-center justify-between flex-wrap gap-2">
			<h2 class="text-xl font-extrabold text-accent-content flex items-center gap-2">
				<span>⚡</span> เครื่องมือแปลงรหัส (Converter)
			</h2>
			<button
				on:click={() => (isSwapped = !isSwapped)}
				class="btn btn-outline btn-xs gap-1.5 font-bold"
			>
				<RepeatIcon size={14} />
				<span>{isSwapped ? 'สลับทิศทาง (ถอดรหัส ➔ เข้ารหัส)' : 'สลับทิศทาง (เข้ารหัส ➔ ถอดรหัส)'}</span>
			</button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
			<div class="botanical-card bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 flex flex-col justify-between space-y-4 {isSwapped ? 'order-2' : 'order-1'}">
				<div class="space-y-3">
					<label for="railfence-input-text" class="block text-xs font-semibold text-base-content/70">
						{isSwapped ? 'ข้อความ Ciphertext (Input):' : 'ข้อความ Plaintext (Input):'}
					</label>
					<textarea
						id="railfence-input-text"
						bind:value={inputText}
						rows="3"
						placeholder="พิมพ์ข้อความ..."
						class="textarea  w-full bg-base-100 text-base-content font-mono text-sm uppercase focus:textarea-primary"
					></textarea>

					<div class="space-y-1">
						<div class="flex justify-between text-xs font-bold text-amber-400">
							<span>จำนวนราง (Rails):</span>
							<span>{rails} ราง</span>
						</div>
						<input type="range" min="2" max="5" bind:value={rails} class="range range-primary range-xs" />
					</div>
				</div>
				<span class="text-[11px] text-base-content/70">ปรับจำนวนรางซิกแซก (2-5) แบบเรียลไทม์</span>
			</div>

			<div class="botanical-card bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 flex flex-col justify-between space-y-3 {isSwapped ? 'order-1' : 'order-2'}">
				<div>
					<div class="flex items-center justify-between mb-2">
						<span class="block text-xs font-semibold text-base-content/70">ผลลัพธ์ (Output):</span>
						<button on:click={copyOutput} class="btn btn-ghost btn-xs gap-1 text-base-content/70 hover:text-base-content">
							{#if isCopied}
								<CheckIcon size={14} class="text-success-content" />
								<span class="text-success-content">คัดลอกแล้ว</span>
							{:else}
								<CopyIcon size={14} />
								<span>คัดลอกข้อความ</span>
							{/if}
						</button>
					</div>

					<div class="bg-base-100 text-base-content p-4 rounded-xl border border-base-300 min-h-[110px] font-mono text-lg text-primary tracking-widest break-words flex items-center">
						{processedResult || 'พิมพ์เพื่อดูผลลัพธ์...'}
					</div>
				</div>

				<span class="text-[11px] text-base-content/70">ผลลัพธ์การสลับตำแหน่งสเกล {rails} ราง</span>
			</div>
		</div>
	</section>

	<!-- Exercises -->
	<section class="botanical-card bg-base-200 p-6 rounded-3xl border border-base-300 shadow-xl space-y-6">
		<h2 class="text-xl font-extrabold text-warning-content flex items-center gap-2">
			<span>✏️</span> แบบฝึกหัด (Exercises)
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#each exercises as ex, idx}
				<div class="botanical-card bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 space-y-3 flex flex-col justify-between">
					<div class="space-y-3">
						<span class="font-bold text-xs text-base-content/70">ข้อที่ {ex.id}</span>

						<div class="bg-base-100 text-base-content p-3 rounded-xl border border-base-300 font-mono text-sm text-primary tracking-widest text-center min-h-[60px] flex items-center justify-center break-all">
							{ex.cipherText}
						</div>
					</div>

					<div class="space-y-2 pt-2">
						<AnswerChecker
							bind:value={answers[idx]}
							placeholder="พิมพ์คำตอบ..."
							buttonText="ตรวจ"
							btnClass="btn-primary text-primary-content"
							size="sm"
							on:submit={() => checkAnswer(idx)}
						/>

						{#if feedback[idx] === 'correct'}
							<div class="flex items-center gap-1 text-xs font-bold text-success-content">
								<CheckCircleIcon size={14} />
								<span>ถูกต้อง!</span>
							</div>
						{:else if feedback[idx] === 'incorrect'}
							<div class="text-xs font-bold text-error-content">
								✕ ยังไม่ถูกต้อง
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</section>
</div>
