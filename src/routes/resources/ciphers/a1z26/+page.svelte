<script lang="ts">
	import AnswerChecker from '#lib/components/AnswerChecker.svelte';
	import { ArrowLeftIcon, CheckCircleIcon, RepeatIcon, CopyIcon, CheckIcon } from 'svelte-feather-icons';

	let langMode: 'ENG' | 'THAI' = 'ENG';
	let inputText = 'CODEBREAKER';
	let isSwapped = false; // false = Encode (Text -> Numbers), true = Decode (Numbers -> Text)
	let isCopied = false;

	const engAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
	const thaiAlphabet = [
		'ก','ข','ฃ','ค','ฅ','ฆ','ง','จ','ฉ','ช','ซ','ฌ','ญ','ฎ','ฏ','ฐ','ฑ','ฒ','ณ','ด',
		'ต','ถ','ท','ธ','น','บ','ป','ผ','ฝ','พ','ฟ','ภ','ม','ย','ร','ล','ว','ศ','ษ','ส',
		'ห','ฬ','อ','ฮ'
	];

	$: alphabet = langMode === 'ENG' ? engAlphabet : thaiAlphabet;

	function textToA1Z26(text: string, mode: 'ENG' | 'THAI'): string {
		const alpha = mode === 'ENG' ? engAlphabet : thaiAlphabet;
		if (mode === 'ENG') {
			return text
				.toUpperCase()
				.split('')
				.map((ch) => {
					const idx = alpha.indexOf(ch);
					return idx !== -1 ? (idx + 1).toString() : ch;
				})
				.filter(Boolean)
				.join('-');
		} else {
			return text
				.split('')
				.map((ch) => {
					const idx = alpha.indexOf(ch);
					return idx !== -1 ? (idx + 1).toString() : ch;
				})
				.filter(Boolean)
				.join('-');
		}
	}

	function a1z26ToText(numStr: string, mode: 'ENG' | 'THAI'): string {
		const alpha = mode === 'ENG' ? engAlphabet : thaiAlphabet;
		const max = alpha.length;
		return numStr
			.trim()
			.split(/[-,\s]+/)
			.map((n) => {
				const val = parseInt(n, 10);
				if (!isNaN(val) && val >= 1 && val <= max) {
					return alpha[val - 1];
				}
				return n;
			})
			.join('');
	}

	$: processedResult = isSwapped ? a1z26ToText(inputText, langMode) : textToA1Z26(inputText, langMode);

	function toggleSwap() {
		isSwapped = !isSwapped;
		inputText = processedResult;
	}

	function toggleLang(mode: 'ENG' | 'THAI') {
		langMode = mode;
		if (mode === 'ENG') {
			inputText = 'CODEBREAKER';
		} else {
			inputText = 'สวัสดี';
		}
	}

	function copyOutput() {
		navigator.clipboard.writeText(processedResult);
		isCopied = true;
		setTimeout(() => (isCopied = false), 2000);
	}

	// Practice Exercises
	let answers = ['', '', ''];
	let feedback = ['', '', ''];

	const exercises = [
		{ id: 1, cipherText: '3-15-4-5', correctAnswer: 'CODE' },
		{ id: 2, cipherText: '16-21-26-26-12-5', correctAnswer: 'PUZZLE' },
		{ id: 3, cipherText: '3-15-4-5-2-18-5-1-11-5-18', correctAnswer: 'CODEBREAKER' }
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
	<title>Code Breaker | A1Z26 Cipher (รหัสตัวเลขแทนอักษร)</title>
	<meta name="description" content="คู่มือ A1Z26 Cipher รหัสตัวเลขแทนตัวอักษร A=1 Z=26 และ ก=1 ฮ=44 พร้อมเครื่องมือแปลงสด" />
</svelte:head>

<div class="flex flex-col gap-8 w-full max-w-5xl mx-auto px-4 py-8 select-none">
	<div class="flex items-center justify-between">
		<a href="/resources/ciphers" class="btn btn-ghost btn-xs gap-1.5 font-bold">
			← กลับไปคลังรหัสลับ
		</a>
	</div>

	<header class="space-y-2 text-center md:text-left">
		<div class="flex items-center gap-2 justify-center md:justify-start">
			<span class="badge badge-success font-bold text-xs py-2 px-3">EASY</span>
			<span class="text-xs text-base-content/70 font-mono uppercase tracking-wider">Numeric Index</span>
		</div>
		<h1 class="text-3xl lg:text-4xl font-black text-base-content">A1Z26 Cipher (รหัสตัวเลขแทนอักษร)</h1>
		<p class="text-base-content/70 text-sm lg:text-base leading-relaxed">
			A1Z26 เป็นรหัสลับทดตัวอักษรตรงตามลำดับดรรชนีของตัวอักษร โดยกำหนดให้ A=1..Z=26 หรือ ก=1..ฮ=44
		</p>
	</header>

	<!-- Chart with Language Switcher -->
	<section class="bg-base-200 p-6 rounded-3xl border border-base-300 shadow-xl space-y-4">
		<div class="flex items-center justify-between flex-wrap gap-3">
			<h2 class="text-xl font-extrabold text-primary flex items-center gap-2">
				<span>🔢</span> ตารางเทียบดรรชนีตัวเลข A1Z26 ({langMode})
			</h2>
			<!-- Language Mode Selector -->
			<div class="join">
				<button
					class="join-item btn btn-xs font-bold {langMode === 'ENG' ? 'btn-primary' : 'btn-outline'}"
					on:click={() => toggleLang('ENG')}
				>
					English (A=1..Z=26)
				</button>
				<button
					class="join-item btn btn-xs font-bold {langMode === 'THAI' ? 'btn-primary' : 'btn-outline'}"
					on:click={() => toggleLang('THAI')}
				>
					ภาษาไทย (ก=1..ฮ=44)
				</button>
			</div>
		</div>

		<div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-13 gap-2 font-mono text-center text-xs">
			{#each alphabet as letter, i}
				<div class="bg-base-100 text-base-content p-2.5 rounded-xl border border-base-300">
					<div class="font-bold text-amber-400 text-sm">{letter}</div>
					<div class="text-base-content/70 text-xs font-mono">{i + 1}</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Interactive Converter -->
	<section class="bg-base-200 p-6 rounded-3xl border border-base-300 shadow-xl space-y-6">
		<div class="flex items-center justify-between flex-wrap gap-4 border-b border-base-300 pb-4">
			<div class="space-y-1">
				<h2 class="text-xl font-bold text-base-content">เครื่องมือแปลงรหัส A1Z26</h2>
				<p class="text-xs text-base-content/70">แปลงข้อความเป็นดรรชนีตัวเลขหรือถอดรหัสตัวเลขเป็นข้อความ</p>
			</div>

			<!-- Left-Right Toggle Button -->
			<button on:click={toggleSwap} class="btn btn-sm btn-outline gap-2 font-bold">
				<RepeatIcon size="16" />
				<span>{isSwapped ? 'โหมด: ถอดรหัส (ตัวเลข → ตัวอักษร)' : 'โหมด: เข้ารหัส (ตัวอักษร → ตัวเลข)'}</span>
			</button>
		</div>

		<!-- Input / Output Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="space-y-2">
				<label class="text-xs font-bold text-base-content/70 block" for="a1z26-input">
					{isSwapped ? 'ชุดตัวเลข (คั่นด้วย - หรือ เว้นวรรค):' : 'ข้อความต้นฉบับ:'}
				</label>
				<textarea
					id="a1z26-input"
					bind:value={inputText}
					rows="4"
					class="textarea  w-full bg-base-100 text-base-content font-mono text-sm leading-relaxed focus:border-primary/30"
					placeholder={isSwapped ? 'เช่น 3-15-4-5' : 'พิมพ์ข้อความที่นี่...'}
				></textarea>
			</div>

			<div class="space-y-2">
				<div class="flex justify-between items-center">
					<label class="text-xs font-bold text-base-content/70 block" for="a1z26-output">
						{isSwapped ? 'ผลลัพธ์ถอดรหัส (ข้อความ):' : 'ผลลัพธ์เข้ารหัส (ชุดตัวเลข):'}
					</label>
					<button on:click={copyOutput} class="btn btn-ghost btn-xs gap-1 font-bold text-primary">
						{#if isCopied}
							<CheckIcon size="14" />
							<span>คัดลอกแล้ว</span>
						{:else}
							<CopyIcon size="14" />
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
		<h2 class="text-xl font-bold text-base-content">แบบฝึกหัดถอดรหัส A1Z26</h2>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#each exercises as ex, idx}
				<div class="bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 space-y-3 flex flex-col justify-between">
					<div class="space-y-3">
						<span class="font-bold text-xs text-base-content/70">ข้อที่ {ex.id}</span>

						<div class="bg-base-100 text-base-content p-3 rounded-xl border border-base-300 font-mono text-lg text-primary tracking-widest text-center min-h-[60px] flex items-center justify-center">
							{ex.cipherText}
						</div>
					</div>

					<div class="space-y-2 pt-2">
						<AnswerChecker
							bind:value={answers[idx]}
							placeholder="พิมพ์คำตอบ..."
							buttonText="ตรวจ"
							btnClass="bg-emerald-500 hover:bg-emerald-400 text-base-content/70"
							size="sm"
							on:submit={() => checkAnswer(idx)}
						/>

						{#if feedback[idx] === 'correct'}
							<div class="flex items-center gap-1 text-xs font-bold text-success-content">
								<CheckCircleIcon size="14" />
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
