<script lang="ts">
	import AnswerChecker from '#lib/components/AnswerChecker.svelte';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
import CheckCircleIcon from '@lucide/svelte/icons/circle-check';
import CopyIcon from '@lucide/svelte/icons/copy';
import CheckIcon from '@lucide/svelte/icons/check';
import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';

	let inputText = 'ATTACKATDAWN';
	let key = 'LEMON';
	let isEncodeMode = true;
	let isSwapped = false;
	let isCopied = false;
	let currentStep = 0;

	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

	function vigenereCipher(text: string, keyword: string, encode: boolean): string {
		if (!keyword) return text;
		const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
		const cleanKey = keyword.toUpperCase().replace(/[^A-Z]/g, '');
		if (!cleanKey) return cleanText;

		let keyIdx = 0;
		return cleanText
			.split('')
			.map((ch) => {
				const textCode = ch.charCodeAt(0) - 65;
				const keyShift = cleanKey[keyIdx % cleanKey.length].charCodeAt(0) - 65;
				keyIdx++;

				const resultShift = encode
					? (textCode + keyShift) % 26
					: (textCode - keyShift + 26) % 26;

				return String.fromCharCode(resultShift + 65);
			})
			.join('');
	}

	$: effectiveEncode = isSwapped ? !isEncodeMode : isEncodeMode;
	$: resultText = vigenereCipher(inputText, key, effectiveEncode);

	// Derived step-by-step state for Interactive Vigenère Table
	$: cleanInput = inputText.toUpperCase().replace(/[^A-Z]/g, '');
	$: cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '') || 'A';
	$: maxSteps = Math.max(1, cleanInput.length);
	$: safeStep = Math.min(currentStep, maxSteps - 1);

	$: activeTextChar = cleanInput[safeStep] || 'A';
	$: activeKeyChar = cleanKey[safeStep % cleanKey.length] || 'A';
	$: activeTextVal = activeTextChar.charCodeAt(0) - 65;
	$: activeKeyVal = activeKeyChar.charCodeAt(0) - 65;

	$: activeResultVal = effectiveEncode
		? (activeTextVal + activeKeyVal) % 26
		: (activeTextVal - activeKeyVal + 26) % 26;
	$: activeResultChar = String.fromCharCode(activeResultVal + 65);

	function copyOutput() {
		navigator.clipboard.writeText(resultText);
		isCopied = true;
		setTimeout(() => (isCopied = false), 2000);
	}

	// Practice Exercises
	let answers = ['', '', ''];
	let feedback = ['', '', ''];

	const exercises = [
		{ id: 1, cipherText: 'LXFOPVE (KEY: LEMON)', correctAnswer: 'ATTACKA' },
		{ id: 2, cipherText: 'EGFH (KEY: CODE)', correctAnswer: 'CODE' },
		{ id: 3, cipherText: 'RIZR (KEY: KEY)', correctAnswer: 'HOST' }
	];

	function checkAnswer(idx: number) {
		const user = answers[idx].trim().toUpperCase();
		if (user === exercises[idx].correctAnswer) {
			feedback[idx] = 'correct';
		} else {
			feedback[idx] = 'incorrect';
		}
	}
</script>

<svelte:head>
	<title>Chi Fun | Vigenère Cipher (รหัสวีเชอแนร์) 🔐</title>
	<meta name="description" content="คู่มือ Vigenère Cipher รหัสลับใช้ Keyword พร้อมเครื่องมือแปลงสด ตารางโต้ตอบ Tabula Recta และแบบฝึกหัด" />
</svelte:head>

<div class="flex flex-col gap-8 w-full max-w-5xl mx-auto px-4 py-8 select-none">
	<div class="flex items-center justify-between">
		<a href="/resources/ciphers" class="btn btn-ghost btn-xs gap-1.5 font-bold text-base-content/70 hover:text-base-content">
			<ArrowLeftIcon size={14} />
			<span>กลับไปคลังรหัสลับ</span>
		</a>
	</div>

	<header class="space-y-2 text-center md:text-left">
		<div class="flex items-center gap-2 justify-center md:justify-start">
			<span class="badge badge-warning font-bold text-xs py-2 px-3">MEDIUM - ADVANCED</span>
			<span class="text-xs text-base-content/70 font-mono uppercase tracking-wider">Polyalphabetic Key</span>
		</div>
		<h1 class="text-3xl lg:text-4xl font-black text-base-content">Vigenère Cipher (รหัสวีเชอแนร์)</h1>
		<p class="text-base-content/70 text-sm lg:text-base leading-relaxed">
			รหัสวีเชอแนร์เป็นรหัสแบบหลากตัวอักษรที่ใช้คำสำคัญ (Keyword) กำหนดค่า Shift แตกต่างกันในแต่ละตำแหน่งอักษร
		</p>
	</header>

	<!-- Converter Tool -->
	<section class="botanical-card bg-base-100 text-base-content p-6 rounded-3xl border border-base-300 shadow-xl space-y-4">
		<div class="flex items-center justify-between flex-wrap gap-2">
			<h2 class="text-xl font-extrabold text-amber-400 flex items-center gap-2">
				<span>🔑</span> เครื่องมือแปลงรหัส (Converter)
			</h2>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
			<div class="space-y-2">
				<label for="vigenere-input-text" class="text-xs font-bold text-base-content/70">ข้อความต้นทาง (Input Text):</label>
				<input
					id="vigenere-input-text"
					type="text"
					bind:value={inputText}
					placeholder="พิมพ์ข้อความ..."
					class="input  w-full bg-base-100 text-base-content border-base-300 text-base-content font-mono uppercase text-sm rounded-xl focus:border-amber-500"
				/>
				<label for="vigenere-key-text" class="text-xs font-bold text-base-content/70 pt-2 block">คำสำคัญ (Keyword):</label>
				<input
					id="vigenere-key-text"
					type="text"
					bind:value={key}
					placeholder="คำสำคัญ..."
					class="input  w-full bg-base-100 text-base-content border-base-300 text-amber-400 font-mono uppercase text-sm rounded-xl focus:border-amber-500"
				/>
			</div>

			<div class="botanical-card space-y-2 bg-base-100 text-base-content p-4 rounded-2xl border border-base-300 flex flex-col justify-between">
				<div>
					<span class="text-xs font-bold text-base-content/70">ผลลัพธ์ (Output Text):</span>
					<div class="text-xl font-mono font-bold text-amber-400 break-all mt-1">
						{resultText || '---'}
					</div>
				</div>
				<button
					on:click={copyOutput}
					class="btn btn-sm btn-ghost gap-1.5 text-base-content/70 hover:text-base-content self-end"
				>
					{#if isCopied}
						<CheckIcon size={14} class="text-primary" />
						<span class="text-primary font-bold">คัดลอกแล้ว</span>
					{:else}
						<CopyIcon size={14} />
						<span>คัดลอกข้อความ</span>
					{/if}
				</button>
			</div>
		</div>
	</section>

	<!-- Interactive Tabula Recta Grid Explanation -->
	<section class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl p-6 shadow-xl space-y-5">
		<div class="flex items-center justify-between flex-wrap gap-3 border-b border-base-300 pb-3">
			<div>
				<h2 class="text-lg font-bold text-base-content flex items-center gap-2">
					<span>📊</span> ตารางวีเชอแนร์โต้ตอบ (Interactive Tabula Recta)
				</h2>
				<p class="text-xs text-base-content/70">เลื่อนดูการตัดกันของอักษรแถวและคอลัมน์ทีละตัวอักษร</p>
			</div>

			<!-- Step Controls -->
			<div class="flex items-center gap-2 bg-base-100 text-base-content px-3 py-1.5 rounded-xl border border-base-300">
				<button
					disabled={safeStep <= 0}
					on:click={() => currentStep--}
					class="btn btn-ghost btn-xs text-base-content/70 disabled:text-base-content/70"
				>
					<ChevronLeftIcon size={16} />
				</button>
				<span class="text-xs font-mono font-bold text-amber-400">
					Step {safeStep + 1} / {maxSteps}
				</span>
				<button
					disabled={safeStep >= maxSteps - 1}
					on:click={() => currentStep++}
					class="btn btn-ghost btn-xs text-base-content/70 disabled:text-base-content/70"
				>
					<ChevronRightIcon size={16} />
				</button>
			</div>
		</div>

		<!-- Step Info Card -->
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
			<div class="bg-base-100 text-base-content p-3 rounded-2xl border border-base-300">
				<div class="text-[11px] text-base-content/70">Plaintext (คอลัมน์)</div>
				<div class="text-2xl font-black font-mono text-primary">{activeTextChar}</div>
			</div>
			<div class="bg-base-100 text-base-content p-3 rounded-2xl border border-base-300">
				<div class="text-[11px] text-base-content/70">Key (แถว)</div>
				<div class="text-2xl font-black font-mono text-amber-400">{activeKeyChar}</div>
			</div>
			<div class="bg-base-100 text-base-content p-3 rounded-2xl border border-base-300">
				<div class="text-[11px] text-base-content/70">Cipher Result (จุดตัด)</div>
				<div class="text-2xl font-black font-mono text-primary">{activeResultChar}</div>
			</div>
		</div>

		<!-- Tabula Recta 26x26 Scrollable Table -->
		<div class="overflow-x-auto bg-base-100 text-base-content p-3 rounded-2xl border border-base-300">
			<table class="w-full text-center border-collapse font-mono text-[10px] sm:text-xs">
				<thead>
					<tr>
						<th class="p-1 bg-base-100 text-base-content text-base-content/70"></th>
						{#each alphabet as colChar, colIdx}
							<th
								class="p-1 font-bold {colIdx === activeTextVal
									? 'bg-cyan-500/20 text-primary border-b-2 border-primary/30'
									: 'text-base-content/70'}"
							>
								{colChar}
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each alphabet as rowChar, rowIdx}
						<tr class={rowIdx === activeKeyVal ? 'bg-amber-500/10' : ''}>
							<th
								class="p-1 font-bold {rowIdx === activeKeyVal
									? 'bg-amber-500/20 text-amber-400 border-r-2 border-amber-400'
									: 'text-base-content/70 bg-base-100 text-base-content'}"
							>
								{rowChar}
							</th>
							{#each alphabet as _, colIdx}
								{@const cellVal = (rowIdx + colIdx) % 26}
								{@const cellChar = String.fromCharCode(cellVal + 65)}
								{@const isSelectedCell = rowIdx === activeKeyVal && colIdx === activeTextVal}
								<td
									class="p-1 transition-all {isSelectedCell
										? 'bg-emerald-500 text-base-content/70 font-black text-sm rounded shadow-lg scale-110'
										: rowIdx === activeKeyVal || colIdx === activeTextVal
										? 'text-base-content font-bold bg-base-100 text-base-content'
										: 'text-base-content/70'}"
								>
									{cellChar}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<!-- Practice Exercises -->
	<section class="botanical-card bg-base-100 text-base-content p-6 rounded-3xl border border-base-300 shadow-xl space-y-4">
		<h2 class="text-lg font-bold text-base-content border-b border-base-300 pb-2">
			📝 แบบฝึกหัดถอดรหัส Vigenère
		</h2>
		<div class="space-y-3">
			{#each exercises as ex, idx}
				<div class="botanical-card bg-base-100 text-base-content p-4 rounded-2xl border border-base-300 space-y-2">
					<div class="flex items-center justify-between">
						<span class="text-xs font-bold text-amber-400">ข้อที่ {ex.id}: {ex.cipherText}</span>
						{#if feedback[idx] === 'correct'}
							<span class="text-xs font-bold text-primary flex items-center gap-1">
								<CheckCircleIcon size={14} />
								<span>ถูกต้อง!</span>
							</span>
						{:else if feedback[idx] === 'incorrect'}
							<span class="text-xs font-bold text-rose-400">ยังไม่ถูกต้อง ลองใหม่อีกครั้ง</span>
						{/if}
					</div>
					<AnswerChecker
						bind:value={answers[idx]}
						placeholder="พิมพ์คำตอบ..."
						buttonText="ตรวจ"
						btnClass="btn-primary text-primary-content"
						size="sm"
						on:submit={() => checkAnswer(idx)}
					/>
				</div>
			{/each}
		</div>
	</section>
</div>
