<script lang="ts">
import UiArrowLeft from '@lucide/svelte/icons/arrow-left';
	import AnswerChecker from '#lib/components/AnswerChecker.svelte';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
import CheckCircleIcon from '@lucide/svelte/icons/circle-check';
import RepeatIcon from '@lucide/svelte/icons/repeat';
import CopyIcon from '@lucide/svelte/icons/copy';
import CheckIcon from '@lucide/svelte/icons/check';

	let langMode: 'ENG' | 'THAI' = 'ENG';
	let inputText = 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG';
	let shift = 3;
	let isSwapped = false; // false = Encode (Plain -> Shift), true = Decode (Shift -> Plain)
	let isCopied = false;

	const engAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
	const thaiAlphabet = [
		'ก','ข','ฃ','ค','ฅ','ฆ','ง','จ','ฉ','ช','ซ','ฌ','ญ','ฎ','ฏ','ฐ','ฑ','ฒ','ณ','ด',
		'ต','ถ','ท','ธ','น','บ','ป','ผ','ฝ','พ','ฟ','ภ','ม','ย','ร','ล','ว','ศ','ษ','ส',
		'ห','ฬ','อ','ฮ'
	];

	$: alphabet = langMode === 'ENG' ? engAlphabet : thaiAlphabet;
	$: maxShift = alphabet.length - 1;

	$: shiftedAlphabet = alphabet.map((_, idx) => {
		return alphabet[(idx + shift) % alphabet.length];
	});

	function caesarCipher(str: string, shiftAmount: number, mode: 'ENG' | 'THAI'): string {
		const alpha = mode === 'ENG' ? engAlphabet : thaiAlphabet;
		const mod = alpha.length;
		const s = ((shiftAmount % mod) + mod) % mod;

		if (mode === 'ENG') {
			return str
				.toUpperCase()
				.split('')
				.map((ch) => {
					const idx = alpha.indexOf(ch);
					if (idx !== -1) {
						return alpha[(idx + s) % mod];
					}
					return ch;
				})
				.join('');
		} else {
			return str
				.split('')
				.map((ch) => {
					const idx = alpha.indexOf(ch);
					if (idx !== -1) {
						return alpha[(idx + s) % mod];
					}
					return ch;
				})
				.join('');
		}
	}

	$: processedResult = (() => {
		const mod = alphabet.length;
		if (!isSwapped) {
			return caesarCipher(inputText, shift, langMode);
		} else {
			return caesarCipher(inputText, mod - (shift % mod), langMode);
		}
	})();

	function toggleSwap() {
		isSwapped = !isSwapped;
		inputText = processedResult;
	}

	function toggleLang(mode: 'ENG' | 'THAI') {
		langMode = mode;
		shift = 3;
		if (mode === 'ENG') {
			inputText = 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG';
		} else {
			inputText = 'ไข่ในเกล็ดแก้วจงอยู่ถ้วนหน้า';
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
		{ id: 1, cipherText: 'KHOOR (Shift +3)', correctAnswer: 'HELLO' },
		{ id: 2, cipherText: 'EXSHS (Shift +1)', correctAnswer: 'DWRGR' },
		{ id: 3, cipherText: 'PBQR (Shift +13 / ROT13)', correctAnswer: 'CODE' }
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
	<title>Code Breaker | Caesar Cipher (รหัสซีซาร์)</title>
	<meta name="description" content="คู่มือ Caesar Cipher & ROT13 ภาษาอังกฤษและภาษาไทย พร้อมตาราง Shift และแบบฝึกหัด" />
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
			<span class="text-xs text-base-content/70 font-mono uppercase tracking-wider">Shift Substitution</span>
		</div>
		<h1 class="text-3xl lg:text-4xl font-black text-base-content">Caesar Cipher (รหัสซีซาร์)</h1>
		<p class="text-base-content/70 text-sm lg:text-base leading-relaxed">
			รหัสซีซาร์ใช้เทคนิคขยับตำแหน่งตัวอักษรไปข้างหน้าหรือถอยหลังตามจำนวนช่องที่กำหนด (รองรับทั้งภาษาอังกฤษ A-Z และภาษาไทย ก-ฮ)
		</p>
	</header>

	<!-- Language Toggle & Animated Shift Table -->
	<section class="botanical-card bg-base-200 p-6 rounded-3xl border border-base-300 shadow-xl space-y-4">
		<div class="flex items-center justify-between flex-wrap gap-3">
			<h2 class="text-xl font-extrabold text-primary flex items-center gap-2">
				<span>🔄</span> ตารางการจับคู่ตัวอักษร Caesar Shift
			</h2>
			<div class="flex items-center gap-2">
				<!-- Language Mode Selector -->
				<div class="join">
					<button
						class="join-item btn btn-xs font-bold {langMode === 'ENG' ? 'btn-primary' : 'btn-outline'}"
						on:click={() => toggleLang('ENG')}
					>
						English (A-Z)
					</button>
					<button
						class="join-item btn btn-xs font-bold {langMode === 'THAI' ? 'btn-primary' : 'btn-outline'}"
						on:click={() => toggleLang('THAI')}
					>
						ภาษาไทย (ก-ฮ)
					</button>
				</div>
				<span class="badge badge-primary font-mono text-xs font-bold px-3 py-2">Shift +{shift}</span>
			</div>
		</div>

		<div class="overflow-x-auto pb-2">
			<div class="grid grid-rows-2 gap-1 font-mono text-center text-xs min-w-[650px]">
				<!-- Plaintext Alphabet -->
				<div class="flex gap-1">
					<div class="w-16 py-1 font-bold text-base-content/70 bg-base-300 rounded">ต้นฉบับ</div>
					{#each alphabet as char}
						<div class="w-7 py-1 bg-base-100 text-base-content text-base-content/70 rounded font-bold">{char}</div>
					{/each}
				</div>
				<!-- Shifted Alphabet -->
				<div class="flex gap-1">
					<div class="w-16 py-1 font-bold text-primary bg-base-300 text-base-content rounded">เข้ารหัส</div>
					{#each shiftedAlphabet as char}
						<div class="w-7 py-1 bg-base-300 text-base-content text-primary rounded font-bold border border-primary/30">{char}</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Interactive Converter -->
	<section class="botanical-card bg-base-200 p-6 rounded-3xl border border-base-300 shadow-xl space-y-6">
		<div class="flex items-center justify-between flex-wrap gap-4 border-b border-base-300 pb-4">
			<div class="space-y-1">
				<h2 class="text-xl font-bold text-base-content">เครื่องมือแปลงรหัส Caesar Cipher</h2>
				<p class="text-xs text-base-content/70">เลือกจำนวนช่องขยับ (Shift) เพื่อเข้ารหัสหรือถอดรหัส</p>
			</div>

			<!-- Left-Right Toggle Button -->
			<button on:click={toggleSwap} class="btn btn-sm btn-outline gap-2 font-bold">
				<RepeatIcon size={16} />
				<span>{isSwapped ? 'โหมด: ถอดรหัส (Shift ←)' : 'โหมด: เข้ารหัส (Shift →)'}</span>
			</button>
		</div>

		<!-- Shift Slider Controller -->
		<div class="botanical-card space-y-2 bg-base-100 text-base-content p-4 rounded-2xl border border-base-300">
			<div class="flex justify-between items-center text-xs font-bold text-base-content/70">
				<span>ค่า Shift Offset:</span>
				<span class="text-primary text-sm font-mono font-black">+{shift} ช่อง ({langMode})</span>
			</div>
			<input
				type="range"
				min="1"
				max={maxShift}
				bind:value={shift}
				class="range range-primary range-xs"
			/>
			<div class="flex justify-between text-[10px] text-base-content/70 font-mono">
				<span>1</span>
				<span>ROT13 ({Math.floor(maxShift / 2)})</span>
				<span>{maxShift}</span>
			</div>
		</div>

		<!-- Input / Output Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="space-y-2">
				<label class="text-xs font-bold text-base-content/70 block" for="caesar-input">
					{isSwapped ? 'ข้อความเข้ารหัส (Ciphertext):' : 'ข้อความต้นฉบับ (Plaintext):'}
				</label>
				<textarea
					id="caesar-input"
					bind:value={inputText}
					rows="4"
					class="textarea  w-full bg-base-100 text-base-content font-mono text-sm leading-relaxed focus:border-primary/30"
					placeholder="พิมพ์ข้อความที่ต้องการ..."
				></textarea>
			</div>

			<div class="space-y-2">
				<div class="flex justify-between items-center">
					<label class="text-xs font-bold text-base-content/70 block" for="caesar-output">
						{isSwapped ? 'ผลลัพธ์ถอดรหัส (Plaintext):' : 'ผลลัพธ์เข้ารหัส (Ciphertext):'}
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
		<h2 class="text-xl font-bold text-base-content">แบบฝึกหัดถอดรหัส Caesar Cipher</h2>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#each exercises as ex, idx}
				<div class="botanical-card bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 space-y-3 flex flex-col justify-between">
					<div class="space-y-3">
						<span class="font-bold text-xs text-base-content/70">ข้อที่ {ex.id}</span>

						<div class="bg-base-100 text-base-content p-3 rounded-xl border border-base-300 font-mono text-lg text-primary tracking-widest text-center min-h-[60px] flex items-center justify-center">
							{ex.cipherText}
						</div>
					</div>

					<div class="space-y-2 pt-2">
						<!-- Input Group styled like Weekly puzzle -->
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
