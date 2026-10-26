<script lang="ts">
import UiArrowLeft from '@lucide/svelte/icons/arrow-left';
	import AnswerChecker from '#lib/components/AnswerChecker.svelte';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
import CheckCircleIcon from '@lucide/svelte/icons/circle-check';
import RepeatIcon from '@lucide/svelte/icons/repeat';
import CopyIcon from '@lucide/svelte/icons/copy';
import CheckIcon from '@lucide/svelte/icons/check';

	let inputText = 'CODE';
	let bitMode: '8BIT' | '5BIT' = '8BIT';
	let isSwapped = false;
	let isCopied = false;

	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

	function charToBinary(ch: string, mode: '8BIT' | '5BIT'): string {
		const upper = ch.toUpperCase();
		const code = upper.charCodeAt(0);
		if (mode === '8BIT') {
			return code.toString(2).padStart(8, '0');
		} else {
			// 5-Bit Index: A=1 (00001), B=2 (00010) ... Z=26 (11010)
			if (code >= 65 && code <= 90) {
				const idx = code - 64;
				return idx.toString(2).padStart(5, '0');
			}
			return ch;
		}
	}

	function binaryToChar(binStr: string, mode: '8BIT' | '5BIT'): string {
		const num = parseInt(binStr, 2);
		if (isNaN(num)) return binStr;
		if (mode === '8BIT') {
			return String.fromCharCode(num);
		} else {
			if (num >= 1 && num <= 26) {
				return String.fromCharCode(num + 64);
			}
			return binStr;
		}
	}

	$: binaryTable = (() => {
		const table: Record<string, string> = {};
		alphabet.forEach((ch) => {
			table[ch] = charToBinary(ch, bitMode);
		});
		return table;
	})();

	function textToBinary(text: string, mode: '8BIT' | '5BIT'): string {
		return text
			.split('')
			.map((ch) => charToBinary(ch, mode))
			.join(' ');
	}

	function binaryToText(binStr: string, mode: '8BIT' | '5BIT'): string {
		return binStr
			.trim()
			.split(/\s+/)
			.map((b) => binaryToChar(b, mode))
			.join('');
	}

	$: processedResult = isSwapped ? binaryToText(inputText, bitMode) : textToBinary(inputText, bitMode);

	function toggleSwap() {
		isSwapped = !isSwapped;
		inputText = processedResult;
	}

	function copyOutput() {
		navigator.clipboard.writeText(processedResult);
		isCopied = true;
		setTimeout(() => (isCopied = false), 2000);
	}

	let answers = ['', '', ''];
	let feedback = ['', '', ''];

	const exercises = [
		{ id: 1, cipherText: '01000011 01001111 01000100 01000101', correctAnswer: 'CODE' },
		{ id: 2, cipherText: '01010011 01001111 01010011', correctAnswer: 'SOS' },
		{ id: 3, cipherText: '01001000 01000101 01001100 01001100 01001111', correctAnswer: 'HELLO' }
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
	<title>Chi Fun | Binary Code Cipher</title>
	<meta name="description" content="คู่มือและแบบฝึกหัด Binary Code รหัสเลขฐานสอง (8-Bit ASCII และ 5-Bit Index)" />
</svelte:head>

<div class="flex flex-col gap-8 w-full max-w-5xl mx-auto px-4 py-8 select-none">
	<div class="flex items-center justify-between">
		<a href="/resources/ciphers" class="btn btn-ghost btn-xs gap-1.5 font-bold">
			<UiArrowLeft size={16} class="inline-block align-middle" aria-hidden="true" /> กลับไปคลังรหัสลับ
		</a>
	</div>

	<header class="space-y-2 text-center md:text-left">
		<div class="flex items-center gap-2 justify-center md:justify-start">
			<span class="badge badge-success font-bold text-xs py-2 px-3">EASY</span>
			<span class="text-xs text-base-content/70 font-mono uppercase tracking-wider">Binary System</span>
		</div>
		<h1 class="text-3xl lg:text-4xl font-black text-base-content">Binary Code (รหัสเลขฐานสอง)</h1>
		<p class="text-base-content/70 text-sm lg:text-base leading-relaxed">
			รหัสคอมพิวเตอร์พื้นฐาน โดยแทนแต่ละตัวอักษรด้วยรหัสตัวเลขฐานสอง 8 บิต (ASCII) หรือ 5 บิต (Alphabet Index A=00001..Z=11010)
		</p>
	</header>

	<!-- Visual Reference Table (ASCII A-Z to Binary) -->
	<section class="botanical-card bg-base-200 p-6 rounded-3xl border border-base-300 shadow-xl space-y-4">
		<div class="flex items-center justify-between flex-wrap gap-3">
			<h2 class="text-xl font-extrabold text-primary flex items-center gap-2">
				<span>💻</span> ตารางอ้างอิง Binary ({bitMode === '8BIT' ? '8-Bit ASCII' : '5-Bit Last Bits'})
			</h2>
			<!-- Bit Mode Switcher -->
			<div class="join">
				<button
					class="join-item btn btn-xs font-bold {bitMode === '8BIT' ? 'btn-primary' : 'btn-outline'}"
					on:click={() => (bitMode = '8BIT')}
				>
					8-Bit ASCII
				</button>
				<button
					class="join-item btn btn-xs font-bold {bitMode === '5BIT' ? 'btn-primary' : 'btn-outline'}"
					on:click={() => (bitMode = '5BIT')}
				>
					5-Bit (Last 5 Bits)
				</button>
			</div>
		</div>

		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 font-mono text-xs">
			{#each alphabet as letter}
				<div class="bg-base-100 text-base-content p-2.5 rounded-xl border border-base-300 flex items-center justify-between px-3">
					<span class="font-bold text-amber-400 text-sm">{letter}</span>
					<span class="text-base-content font-mono text-[11px]">{binaryTable[letter]}</span>
				</div>
			{/each}
		</div>
	</section>

	<!-- Converter Tool -->
	<section class="botanical-card bg-base-200 p-6 rounded-3xl border border-base-300 shadow-xl space-y-4">
		<div class="flex items-center justify-between flex-wrap gap-2 border-b border-base-300 pb-3">
			<h2 class="text-xl font-bold text-base-content">เครื่องมือแปลงรหัส Binary</h2>
			<!-- Left-Right Swap Button -->
			<button on:click={toggleSwap} class="btn btn-sm btn-outline gap-2 font-bold">
				<RepeatIcon size={16} />
				<span>{isSwapped ? 'โหมด: ถอดรหัส (Binary → ข้อความ)' : 'โหมด: เข้ารหัส (ข้อความ → Binary)'}</span>
			</button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="space-y-2">
				<label class="text-xs font-bold text-base-content/70 block" for="binary-input">
					{isSwapped ? 'ชุดเลขฐานสอง (คั่นด้วยเว้นวรรค):' : 'ข้อความต้นฉบับ:'}
				</label>
				<textarea
					id="binary-input"
					bind:value={inputText}
					rows="4"
					class="textarea  w-full bg-base-100 text-base-content font-mono text-sm leading-relaxed focus:border-primary/30"
					placeholder="พิมพ์ข้อความที่นี่..."
				></textarea>
			</div>

			<div class="space-y-2">
				<div class="flex justify-between items-center">
					<label class="text-xs font-bold text-base-content/70 block" for="binary-output">
						{isSwapped ? 'ผลลัพธ์ถอดรหัส (ข้อความ):' : 'ผลลัพธ์เข้ารหัส (Binary):'}
					</label>
					<button on:click={copyOutput} class="btn btn-ghost btn-xs gap-1 font-bold text-primary">
						{#if isCopied}
							<CheckIcon size={14} />
							<span>คัดลอกแล้ว</span>
						{:else}
							<CopyIcon size={14} />
							<span>คัดลอก</span>
						{/if}
					</button>
				</div>
				<div class="bg-base-100 text-base-content p-4 rounded-xl border border-base-300 font-mono text-sm leading-relaxed text-primary min-h-[105px] break-all">
					{processedResult}
				</div>
			</div>
		</div>
	</section>

	<!-- Practice Exercises -->
	<section class="space-y-4">
		<h2 class="text-xl font-bold text-base-content">แบบฝึกหัดถอดรหัส Binary Code</h2>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#each exercises as ex, idx}
				<div class="botanical-card bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 space-y-3 flex flex-col justify-between">
					<div class="space-y-3">
						<span class="font-bold text-xs text-base-content/70">ข้อที่ {ex.id}</span>

						<div class="bg-base-100 text-base-content p-3 rounded-xl border border-base-300 font-mono text-xs text-primary tracking-wider text-center min-h-[60px] flex items-center justify-center break-all">
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
