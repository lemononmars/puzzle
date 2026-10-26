<script lang="ts">
	import AnswerChecker from '#lib/components/AnswerChecker.svelte';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
import RepeatIcon from '@lucide/svelte/icons/repeat';
import CopyIcon from '@lucide/svelte/icons/copy';
import CheckIcon from '@lucide/svelte/icons/check';
import GlobeIcon from '@lucide/svelte/icons/globe';
import CheckCircleIcon from '@lucide/svelte/icons/circle-check';

	// Helper to convert 6-dot array to Unicode Braille pattern character
	function dotsToUnicodeBraille(dots: number[]): string {
		if (!dots || dots.length === 0) return ' ';
		const bitmask =
			(dots.includes(1) ? 0x01 : 0) |
			(dots.includes(2) ? 0x02 : 0) |
			(dots.includes(3) ? 0x04 : 0) |
			(dots.includes(4) ? 0x08 : 0) |
			(dots.includes(5) ? 0x10 : 0) |
			(dots.includes(6) ? 0x20 : 0);
		return String.fromCharCode(0x2800 + bitmask);
	}

	// English Braille 6-dot matrix mappings
	const engBrailleData: Record<string, number[]> = {
		A: [1],
		B: [1, 2],
		C: [1, 4],
		D: [1, 4, 5],
		E: [1, 5],
		F: [1, 2, 4],
		G: [1, 2, 4, 5],
		H: [1, 2, 5],
		I: [2, 4],
		J: [2, 4, 5],
		K: [1, 3],
		L: [1, 2, 3],
		M: [1, 3, 4],
		N: [1, 3, 4, 5],
		O: [1, 3, 5],
		P: [1, 2, 3, 4],
		Q: [1, 2, 3, 4, 5],
		R: [1, 2, 3, 5],
		S: [2, 3, 4],
		T: [2, 3, 4, 5],
		U: [1, 3, 6],
		V: [1, 2, 3, 6],
		W: [2, 4, 5, 6],
		X: [1, 3, 4, 6],
		Y: [1, 3, 4, 5, 6],
		Z: [1, 3, 5, 6]
	};

	// Thai Braille 6-dot matrix mappings (including tone marks & vowels)
	const thaiBrailleData: Record<string, number[]> = {
		'ก': [1, 2, 4, 5],
		'ข': [1, 3],
		'ค': [1, 3, 6],
		'ง': [1, 2, 4, 6],
		'จ': [2, 4, 5],
		'ฉ': [1, 4, 6],
		'ช': [1, 4, 6],
		'ซ': [2, 3, 4],
		'ด': [1, 4, 5],
		'ต': [2, 3, 4, 5],
		'ถ': [1, 2, 5, 6],
		'ท': [1, 2, 5, 6],
		'น': [1, 3, 4, 5],
		'บ': [1, 2],
		'ป': [1, 2, 3, 4],
		'ผ': [1, 2, 3, 6],
		'ฝ': [1, 2, 3, 6],
		'พ': [1, 2, 3, 4],
		'ฟ': [1, 2, 4],
		'ภ': [1, 2, 3, 4],
		'ม': [1, 3, 4],
		'ย': [1, 3, 4, 5, 6],
		'ร': [1, 2, 3, 5],
		'ล': [1, 2, 3],
		'ว': [2, 4, 5, 6],
		'ส': [2, 3, 4],
		'ห': [1, 2, 5],
		'อ': [1, 3, 5],
		'ฮ': [1, 2, 4, 5, 6],
		'ะ': [1, 6],
		'า': [3, 4, 5],
		'ิ': [3, 5],
		'ี': [3, 5, 6],
		'ุ': [1, 5, 6],
		'ู': [1, 2, 5, 6],
		'เ': [1, 5],
		'แ': [1, 2, 6],
		'โ': [1, 3, 5],
		'่': [2],        // ไม้เอก
		'้': [2, 3],     // ไม้โท
		'๊': [2, 3, 5],  // ไม้ตรี
		'๋': [2, 3, 6],  // ไม้จัตวา
		'์': [2, 5, 6]   // ทัณฑฆาต / การันต์
	};

	// Reverse lookup tables for Decoding (Unicode Braille -> Text)
	const reverseEngBraille: Record<string, string> = {};
	Object.entries(engBrailleData).forEach(([k, v]) => {
		reverseEngBraille[dotsToUnicodeBraille(v)] = k;
	});

	const reverseThaiBraille: Record<string, string> = {};
	Object.entries(thaiBrailleData).forEach(([k, v]) => {
		if (!reverseThaiBraille[dotsToUnicodeBraille(v)]) {
			reverseThaiBraille[dotsToUnicodeBraille(v)] = k;
		}
	});

	let inputText = 'CODEBREAKER';
	let langMode: 'EN' | 'TH' = 'EN';
	let isSwapped = false; // false = Text -> Braille, true = Braille -> Text
	let isCopied = false;

	// Computed Braille Output using Unicode Braille Patterns
	$: outputResult = (() => {
		if (!inputText) return '';
		if (!isSwapped) {
			const data = langMode === 'EN' ? engBrailleData : thaiBrailleData;
			return inputText
				.toUpperCase()
				.split('')
				.map((ch) => {
					if (ch === ' ') return '  ';
					const dots = data[ch];
					return dots ? dotsToUnicodeBraille(dots) : ch;
				})
				.join('');
		} else {
			const reverseData = langMode === 'EN' ? reverseEngBraille : reverseThaiBraille;
			return inputText
				.split('')
				.map((ch) => {
					if (ch === ' ' || ch === '⠀') return ' ';
					return reverseData[ch] || ch;
				})
				.join('');
		}
	})();

	function copyOutput() {
		navigator.clipboard.writeText(outputResult);
		isCopied = true;
		setTimeout(() => (isCopied = false), 2000);
	}

	// Practice Exercises
	let answers = ['', '', ''];
	let feedback = ['', '', ''];

	const exercises = [
		{ id: 1, braille: '⠉⠕⠙⠑', correctAnswer: 'CODE' },
		{ id: 2, braille: '⠃⠗⠁⠔⠇⠇⠑', correctAnswer: 'BRAILLE' },
		{ id: 3, braille: '⠋⠔⠗⠎⠞', correctAnswer: 'FIRST' }
	];

	function checkAnswer(idx: number) {
		const user = answers[idx].trim().toUpperCase();
		if (user === exercises[idx].correctAnswer) {
			feedback[idx] = 'correct';
		} else {
			feedback[idx] = 'incorrect';
		}
	}

	const engLetters = Object.keys(engBrailleData);
	const thaiLetters = Object.keys(thaiBrailleData);
</script>

<svelte:head>
	<title>Chi Fun | Braille Code (อักษรเบรลล์) ⠃⠗⠁⠔⠇⠇⠑</title>
	<meta name="description" content="เครื่องมือแปลงอักษรเบรลล์ฟอนต์ยูนิโค้ด 6 จุด (English & Thai Braille) รวมวรรณยุกต์ไทย" />
</svelte:head>

<div class="flex flex-col gap-8 w-full max-w-5xl mx-auto px-4 py-8 select-none">
	<!-- Navigation -->
	<div class="flex items-center justify-between">
		<a href="/resources/ciphers" class="btn btn-ghost btn-xs gap-1.5 font-bold text-base-content/70 hover:text-base-content">
			<ArrowLeftIcon size={14} />
			<span>กลับไปหน้า Cipher Library</span>
		</a>
	</div>

	<!-- Header -->
	<header class="text-center max-w-2xl mx-auto space-y-3">
		<div class="w-16 h-16 rounded-2xl bg-cyan-500/10 text-primary flex items-center justify-center border border-primary/30 mx-auto shadow-lg shadow-cyan-500/5 text-3xl font-mono">
			⠃⠗
		</div>
		<h1 class="text-3xl lg:text-4xl font-black tracking-tight text-base-content">
			Braille Code (อักษรเบรลล์) ⠃⠗⠁⠔⠇⠇⠑
		</h1>
		<p class="text-base-content/70 text-sm lg:text-base leading-relaxed">
			แปลงอักษรเป็นฟอนต์เบรลล์ยูนิโค้ด 6 จุด รองรับทั้งภาษาอังกฤษ พยัญชนะ สระ และวรรณยุกต์ไทย
		</p>
	</header>

	<!-- Left-Right Converter Section -->
	<section class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl p-6 shadow-xl space-y-5">
		<!-- Top Controls: Language Switcher & Swap Direction -->
		<div class="flex items-center justify-between flex-wrap gap-3 border-b border-base-300 pb-3">
			<div class="flex items-center gap-2">
				<span class="text-xs font-bold text-base-content/70 flex items-center gap-1">
					<GlobeIcon size={14} class="text-primary" />
					<span>ภาษา (Language):</span>
				</span>
				<div class="join border border-base-300 bg-base-100 text-base-content rounded-xl p-0.5">
					<button
						on:click={() => {
							langMode = 'EN';
							if (inputText === 'โค้ดเบรกเกอร์') inputText = 'CODEBREAKER';
						}}
						class="join-item btn btn-xs font-extrabold rounded-lg {langMode === 'EN'
							? 'btn-primary text-base-content'
							: 'btn-ghost text-base-content/70'}"
					>
						English (EN)
					</button>
					<button
						on:click={() => {
							langMode = 'TH';
							if (inputText === 'CODEBREAKER') inputText = 'โค้ดเบรกเกอร์';
						}}
						class="join-item btn btn-xs font-extrabold rounded-lg {langMode === 'TH'
							? 'btn-primary text-base-content'
							: 'btn-ghost text-base-content/70'}"
					>
						ไทย (TH)
					</button>
				</div>
			</div>

			<button
				on:click={() => (isSwapped = !isSwapped)}
				class="btn btn-outline btn-xs gap-1.5 font-bold border-base-300 text-base-content/70 hover:bg-base-100 text-base-content"
			>
				<RepeatIcon size={14} />
				<span>{isSwapped ? 'สลับ (ถอดรหัส Braille ➔ ข้อความ)' : 'สลับ (เข้ารหัส ข้อความ ➔ Braille)'}</span>
			</button>
		</div>

		<!-- Left-Right Side-by-Side Converter Layout -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
			<div class="space-y-2 flex flex-col justify-between">
				<label for="braille-input-text" class="text-xs font-bold text-base-content/70">
					{isSwapped ? 'ใส่อักษรเบรลล์ยูนิโค้ด (Braille Input):' : `ข้อความต้นทาง (${langMode}):`}
				</label>
				<textarea
					id="braille-input-text"
					bind:value={inputText}
					placeholder={isSwapped ? 'วางอักษรเบรลล์ ⠃⠗⠁...' : 'พิมพ์ข้อความที่ต้องการแปลง...'}
					rows="4"
					class="textarea  w-full bg-base-100 text-base-content border-base-300 text-base-content font-mono text-base rounded-2xl focus:border-primary/30 resize-none flex-1"
				></textarea>
			</div>

			<div class="botanical-card space-y-2 bg-base-100 text-base-content p-4 rounded-2xl border border-base-300 flex flex-col justify-between">
				<div>
					<span class="text-xs font-bold text-base-content/70">
						{isSwapped ? 'ผลลัพธ์ข้อความ (Decoded Text):' : 'ผลลัพธ์ฟอนต์อักษรเบรลล์ (Unicode Braille Fonts):'}
					</span>
					<div
						class="text-3xl sm:text-4xl font-mono font-bold text-primary break-all leading-relaxed tracking-widest mt-2 select-all min-h-[80px]"
					>
						{outputResult || '---'}
					</div>
				</div>
				<button
					on:click={copyOutput}
					class="btn btn-sm btn-ghost gap-1.5 text-base-content/70 hover:text-base-content self-end"
				>
					{#if isCopied}
						<CheckIcon size={14} class="text-primary" />
						<span class="text-primary font-bold">คัดลอกสำเร็จ</span>
					{:else}
						<CopyIcon size={14} />
						<span>คัดลอกผลลัพธ์</span>
					{/if}
				</button>
			</div>
		</div>
	</section>

	<!-- Practice Exercises -->
	<section class="botanical-card bg-base-100 text-base-content p-6 rounded-3xl border border-base-300 shadow-xl space-y-5">
		<h2 class="text-xl font-extrabold text-primary flex items-center gap-2 border-b border-base-300 pb-3">
			<span>✏️</span> แบบฝึกหัดทดลองถอดรหัส Braille (Practice Exercises)
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#each exercises as ex, idx}
				<div class="botanical-card bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 space-y-4 flex flex-col justify-between">
					<div class="space-y-3">
						<span class="font-bold text-xs text-base-content/70">ข้อที่ {ex.id}</span>
						<div class="bg-base-100 text-base-content p-3 rounded-xl border border-base-300 text-3xl font-mono text-primary tracking-widest text-center min-h-[60px] flex items-center justify-center">
							{ex.braille}
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
							<div class="flex items-center gap-1 text-xs font-bold text-primary">
								<CheckCircleIcon size={14} />
								<span>ถูกต้อง!</span>
							</div>
						{:else if feedback[idx] === 'incorrect'}
							<div class="text-xs font-bold text-rose-400">
								✕ ยังไม่ถูกต้อง ลองใหม่อีกครั้ง
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Visual 6-Dot Cell Matrix Reference Section -->
	<section class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl p-6 shadow-xl space-y-4">
		<h2 class="text-lg font-bold text-base-content border-b border-base-300 pb-2 flex items-center justify-between">
			<span>📋 ตารางอ้างอิงและรูปจุดนูน 6 จุด ({langMode === 'EN' ? 'English A-Z' : 'ภาษาไทย & วรรณยุกต์'})</span>
			<span class="text-xs font-semibold text-primary">โหมด: {langMode}</span>
		</h2>

		{#if langMode === 'EN'}
			<div class="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-3">
				{#each engLetters as char}
					{@const activeDots = engBrailleData[char]}
					{@const brailleChar = dotsToUnicodeBraille(activeDots)}
					<div class="bg-base-100 text-base-content p-2.5 rounded-2xl border border-base-300 flex flex-col items-center gap-1.5 hover:border-primary/30 transition-colors">
						<div class="grid grid-cols-2 gap-1.5 bg-base-100 text-base-content p-2 rounded-xl">
							{#each [1, 4, 2, 5, 3, 6] as dotNum}
								<div
									class="w-2.5 h-2.5 rounded-full {activeDots.includes(dotNum)
										? 'bg-cyan-400 shadow-sm shadow-cyan-400'
										: 'bg-base-100 text-base-content'}"
								></div>
							{/each}
						</div>
						<div class="text-center">
							<span class="text-xs font-mono font-bold text-base-content block">{char}</span>
							<span class="text-base font-mono text-primary font-bold">{brailleChar}</span>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-3">
				{#each thaiLetters as char}
					{@const activeDots = thaiBrailleData[char]}
					{@const brailleChar = dotsToUnicodeBraille(activeDots)}
					<div class="bg-base-100 text-base-content p-2.5 rounded-2xl border border-base-300 flex flex-col items-center gap-1.5 hover:border-primary/30 transition-colors">
						<div class="grid grid-cols-2 gap-1.5 bg-base-100 text-base-content p-2 rounded-xl">
							{#each [1, 4, 2, 5, 3, 6] as dotNum}
								<div
									class="w-2.5 h-2.5 rounded-full {activeDots.includes(dotNum)
										? 'bg-emerald-400 shadow-sm shadow-emerald-400'
										: 'bg-base-100 text-base-content'}"
								></div>
							{/each}
						</div>
						<div class="text-center">
							<span class="text-sm font-bold text-base-content block">{char}</span>
							<span class="text-base font-mono text-primary font-bold">{brailleChar}</span>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>
