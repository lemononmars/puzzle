<script lang="ts">
	import AnswerChecker from '#lib/components/AnswerChecker.svelte';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
import CheckCircleIcon from '@lucide/svelte/icons/circle-check';
import RepeatIcon from '@lucide/svelte/icons/repeat';
import CopyIcon from '@lucide/svelte/icons/copy';
import CheckIcon from '@lucide/svelte/icons/check';
import GlobeIcon from '@lucide/svelte/icons/globe';

	const englishMorse: Record<string, string> = {
		'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
		'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
		'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
		'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
		'Y': '-.--', 'Z': '--..'
	};

	const numberMorse: Record<string, string> = {
		'1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
		'6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----'
	};

	const thaiMorse: Record<string, string> = {
		'ก': '.-.', 'ข': '-.-.', 'ค': '-.-', 'ง': '--.', 'จ': '-..-.', 'ฉ': '---.',
		'ช': '-..-', 'ซ': '--..', 'ด': '-..', 'ต': '-', 'ถ': '-.-', 'ท': '-..-',
		'น': '-.', 'บ': '-...', 'ป': '.--.', 'ผ': '--..', 'พ': '.--', 'ฟ': '..-.',
		'ม': '--', 'ย': '-.--', 'ร': '.-.', 'ล': '.-..', 'ว': '.--', 'ส': '...',
		'ห': '....', 'อ': '---', 'ะ': '.-', 'า': '.-', 'ิ': '..', 'ี': '..',
		'ึ': '...', 'ื': '...', 'ุ': '..-', 'ู': '..-', 'เ': '.', 'แ': '..',
		'โ': '---', 'ใ': '.-.-', 'ไ': '.-.-'
	};

	// Reverse mapping for decoding Morse -> Text
	const reverseMorseEng: Record<string, string> = {};
	Object.entries(englishMorse).forEach(([k, v]) => (reverseMorseEng[v] = k));
	Object.entries(numberMorse).forEach(([k, v]) => (reverseMorseEng[v] = k));

	const reverseMorseThai: Record<string, string> = {};
	Object.entries(thaiMorse).forEach(([k, v]) => (reverseMorseThai[v] = k));
	Object.entries(numberMorse).forEach(([k, v]) => (reverseMorseThai[v] = k));

	let inputText = 'SOS CODEBREAKER';
	let langMode: 'EN' | 'TH' = 'EN';
	let isSwapped = false; // false = Encode (Text -> Morse), true = Decode (Morse -> Text)
	let isCopied = false;

	$: processedResult = (() => {
		if (!inputText) return '';
		if (!isSwapped) {
			// Encode text -> Morse
			const map = langMode === 'EN' ? englishMorse : thaiMorse;
			return inputText
				.toUpperCase()
				.split('')
				.map((ch) => {
					if (ch === ' ') return '/';
					return map[ch] || numberMorse[ch] || ch;
				})
				.join(' ');
		} else {
			// Decode Morse -> Text
			const revMap = langMode === 'EN' ? reverseMorseEng : reverseMorseThai;
			return inputText
				.trim()
				.split(/\s+/)
				.map((code) => {
					if (code === '/') return ' ';
					return revMap[code] || code;
				})
				.join('');
		}
	})();

	function toggleSwap() {
		isSwapped = !isSwapped;
		inputText = processedResult;
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
		{ id: 1, cipherText: '... --- ...', correctAnswer: 'SOS' },
		{ id: 2, cipherText: '-.-. --- -.. .', correctAnswer: 'CODE' },
		{ id: 3, cipherText: '..-. .. .-. ... -', correctAnswer: 'FIRST' }
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
	<title>Code Breaker | Morse Code (รหัสมอร์ส)</title>
	<meta name="description" content="คู่มือรหัสมอร์สภาษาอังกฤษ ภาษาไทย และตัวเลข พร้อมตารางอ้างอิงสดและแบบฝึกหัด" />
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
			<span class="badge badge-success font-bold text-xs py-2 px-3">EASY</span>
			<span class="text-xs text-base-content/70 font-mono uppercase tracking-wider">Signal & Rhythm</span>
		</div>
		<h1 class="text-3xl lg:text-4xl font-black text-base-content">Morse Code (รหัสมอร์ส)</h1>
		<p class="text-base-content/70 text-sm lg:text-base leading-relaxed">
			รหัสมอร์สใช้จุด (.) สำหรับสัญญาณสั้น และขีด (-) สำหรับสัญญาณยาว ครอบคลุมทั้งภาษาอังกฤษ ตัวเลข และภาษาไทย
		</p>
	</header>

	<!-- Converter Tool -->
	<section class="botanical-card bg-base-100 text-base-content p-6 rounded-3xl border border-base-300 shadow-xl space-y-4">
		<div class="flex items-center justify-between flex-wrap gap-2 border-b border-base-300 pb-3">
			<div class="flex items-center gap-2">
				<span class="text-xs font-bold text-base-content/70 flex items-center gap-1">
					<GlobeIcon size={14} class="text-amber-400" />
					<span>ภาษา (Language):</span>
				</span>
				<div class="join border border-base-300 bg-base-100 text-base-content rounded-xl p-0.5">
					<button
						on:click={() => {
							langMode = 'EN';
							if (inputText === 'สวัสดี') inputText = 'SOS CODEBREAKER';
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
							if (inputText === 'SOS CODEBREAKER') inputText = 'สวัสดี';
						}}
						class="join-item btn btn-xs font-extrabold rounded-lg {langMode === 'TH'
							? 'btn-primary text-base-content'
							: 'btn-ghost text-base-content/70'}"
					>
						ไทย (TH)
					</button>
				</div>
			</div>

			<button on:click={toggleSwap} class="btn btn-outline btn-xs gap-1.5 font-bold border-base-300 text-base-content/70 hover:bg-base-100 text-base-content">
				<RepeatIcon size={14} />
				<span>{isSwapped ? 'สลับ (ถอดรหัส Morse ➔ ข้อความ)' : 'สลับ (ข้อความ ➔ เข้ารหัส Morse)'}</span>
			</button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
			<div class="botanical-card bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 flex flex-col justify-between space-y-3">
				<div>
					<label class="block text-xs font-semibold text-base-content/70 mb-2 font-bold" for="morse-input">
						{isSwapped ? 'Morse Code (Input):' : `ข้อความ ${langMode === 'EN' ? 'ภาษาอังกฤษ' : 'ภาษาไทย'} (Input):`}
					</label>
					<textarea
						id="morse-input"
						bind:value={inputText}
						rows="4"
						placeholder={isSwapped ? 'วางรหัสมอร์ส เช่น ... --- ...' : 'พิมพ์ข้อความ...'}
						class="textarea  w-full bg-base-100 text-base-content border-base-300 text-base-content font-mono text-sm uppercase focus:border-amber-500"
					></textarea>
				</div>
			</div>

			<div class="botanical-card bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 flex flex-col justify-between space-y-3">
				<div>
					<div class="flex items-center justify-between mb-2">
						<label class="block text-xs font-semibold text-base-content/70 font-bold" for="morse-output">
							{isSwapped ? 'ผลลัพธ์ข้อความ (Output):' : 'ผลลัพธ์ Morse Code (Output):'}
						</label>
						<button on:click={copyOutput} class="btn btn-ghost btn-xs gap-1 text-base-content/70 hover:text-base-content font-bold">
							{#if isCopied}
								<CheckIcon size={14} class="text-primary" />
								<span class="text-primary font-bold">คัดลอกแล้ว</span>
							{:else}
								<CopyIcon size={14} />
								<span>คัดลอกข้อความ</span>
							{/if}
						</button>
					</div>

					<div class="bg-base-100 text-base-content p-4 rounded-xl border border-base-300 min-h-[110px] font-mono text-lg text-amber-400 tracking-widest break-words flex items-center">
						{processedResult || 'พิมพ์ข้อความเพื่อดูผลลัพธ์...'}
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Recovered Reference Tables Section -->
	<section class="botanical-card bg-base-100 text-base-content p-6 rounded-3xl border border-base-300 shadow-xl space-y-5">
		<h2 class="text-xl font-extrabold text-amber-400 flex items-center gap-2 border-b border-base-300 pb-3">
			<span>📜</span> ตารางอ้างอิงรหัสมอร์ส (Morse Code Reference Tables)
		</h2>

		<!-- English Alphabet Table -->
		<div class="space-y-2">
			<h3 class="text-sm font-bold text-base-content flex items-center gap-2">
				<span>🔤</span> ภาษาอังกฤษ (A - Z)
			</h3>
			<div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-13 gap-2 text-center text-xs font-mono">
				{#each Object.entries(englishMorse) as [char, code]}
					<div class="bg-base-100 text-base-content p-2.5 rounded-xl border border-base-300">
						<div class="font-bold text-base-content text-sm">{char}</div>
						<div class="text-amber-400 font-extrabold text-xs mt-1">{code}</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Numbers Table -->
		<div class="space-y-2 pt-3">
			<h3 class="text-sm font-bold text-base-content flex items-center gap-2">
				<span>🔢</span> ตัวเลข (0 - 9)
			</h3>
			<div class="grid grid-cols-5 sm:grid-cols-10 gap-2 text-center text-xs font-mono">
				{#each Object.entries(numberMorse) as [num, code]}
					<div class="bg-base-100 text-base-content p-2.5 rounded-xl border border-base-300">
						<div class="font-bold text-base-content text-sm">{num}</div>
						<div class="text-amber-400 font-extrabold text-xs mt-1">{code}</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Thai Morse Table -->
		<div class="space-y-2 pt-3">
			<h3 class="text-sm font-bold text-base-content flex items-center gap-2">
				<span>🇹🇭</span> ภาษาไทย (ก-ฮ & สระ)
			</h3>
			<div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 text-center text-xs font-mono">
				{#each Object.entries(thaiMorse) as [char, code]}
					<div class="bg-base-100 text-base-content p-2.5 rounded-xl border border-base-300">
						<div class="font-bold text-base-content text-sm">{char}</div>
						<div class="text-primary font-extrabold text-xs mt-1">{code}</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Practice Exercises -->
	<section class="botanical-card bg-base-100 text-base-content p-6 rounded-3xl border border-base-300 shadow-xl space-y-5">
		<h2 class="text-xl font-extrabold text-amber-400 flex items-center gap-2 border-b border-base-300 pb-3">
			<span>✏️</span> แบบฝึกหัดทดลองถอดรหัส (Practice Exercises)
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#each exercises as ex, idx}
				<div class="botanical-card bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 space-y-4 flex flex-col justify-between">
					<div class="space-y-3">
						<span class="font-bold text-xs text-base-content/70">ข้อที่ {ex.id}</span>

						<div class="bg-base-100 text-base-content p-3 rounded-xl border border-base-300 font-mono text-lg text-amber-400 tracking-widest text-center min-h-[60px] flex items-center justify-center">
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
							<div class="flex items-center gap-1 text-xs font-bold text-primary">
								<CheckCircleIcon size={14} />
								<span>ถูกต้อง!</span>
							</div>
						{:else if feedback[idx] === 'incorrect'}
							<div class="text-xs font-bold text-rose-400">
								✕ ยังไม่ถูกต้อง
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</section>
</div>
