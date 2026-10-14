<script lang="ts">
	import AnswerChecker from '#lib/components/AnswerChecker.svelte';
	import { ArrowLeftIcon, RadioIcon, CopyIcon, CheckIcon, CheckCircleIcon } from 'svelte-feather-icons';

	let inputText = 'CODEBREAKER';
	let isSwapped = false; // false = Text -> NATO | true = NATO -> Text
	let isCopied = false;

	const natoData: Record<string, string> = {
		A: 'Alpha',
		B: 'Bravo',
		C: 'Charlie',
		D: 'Delta',
		E: 'Echo',
		F: 'Foxtrot',
		G: 'Golf',
		H: 'Hotel',
		I: 'India',
		J: 'Juliett',
		K: 'Kilo',
		L: 'Lima',
		M: 'Mike',
		N: 'November',
		O: 'Oscar',
		P: 'Papa',
		Q: 'Quebec',
		R: 'Romeo',
		S: 'Sierra',
		T: 'Tango',
		U: 'Uniform',
		V: 'Victor',
		W: 'Whiskey',
		X: 'X-ray',
		Y: 'Yankee',
		Z: 'Zulu'
	};

	const reverseNato: Record<string, string> = {};
	Object.entries(natoData).forEach(([k, v]) => {
		reverseNato[v.toUpperCase()] = k;
	});

	$: outputResult = (() => {
		if (!inputText) return '';
		if (!isSwapped) {
			// Encode text -> NATO words
			return inputText
				.toUpperCase()
				.split('')
				.map((ch) => {
					if (ch === ' ') return '/';
					return natoData[ch] || ch;
				})
				.join(' ');
		} else {
			// Decode NATO words -> Text
			return inputText
				.trim()
				.toUpperCase()
				.split(/\s+/)
				.map((word) => {
					if (word === '/') return ' ';
					return reverseNato[word] || word;
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
		{ id: 1, nato: 'Charlie Oscar Delta Echo', correctAnswer: 'CODE' },
		{ id: 2, nato: 'Sierra Alpha Foxtrot Epsilon', correctAnswer: 'SAFE' },
		{ id: 3, nato: 'Whiskey India November', correctAnswer: 'WIN' }
	];

	function checkAnswer(idx: number) {
		const user = answers[idx].trim().toUpperCase();
		if (user === exercises[idx].correctAnswer) {
			feedback[idx] = 'correct';
		} else {
			feedback[idx] = 'incorrect';
		}
	}

	const letters = Object.keys(natoData);
</script>

<svelte:head>
	<title>Code Breaker | NATO Phonetic Alphabet 🎙️</title>
	<meta name="description" content="ตารางคำสื่อสารวิทยุมาตรฐานสากล NATO Phonetic Alphabet (Alpha, Bravo, Charlie...)" />
</svelte:head>

<div class="flex flex-col gap-8 w-full max-w-5xl mx-auto px-4 py-8 select-none">
	<!-- Navigation -->
	<div class="flex items-center justify-between">
		<a href="/resources/ciphers" class="btn btn-ghost btn-xs gap-1.5 font-bold text-base-content/70 hover:text-base-content">
			<ArrowLeftIcon size="14" />
			<span>กลับไปหน้า Cipher Library</span>
		</a>
	</div>

	<!-- Header -->
	<header class="text-center max-w-2xl mx-auto space-y-3">
		<div class="w-14 h-14 rounded-2xl bg-emerald-500/10 text-primary flex items-center justify-center border border-primary/30 mx-auto shadow-lg shadow-emerald-500/5">
			<RadioIcon size="32" />
		</div>
		<h1 class="text-3xl lg:text-4xl font-black tracking-tight text-base-content">
			NATO Phonetic Alphabet 🎙️
		</h1>
		<p class="text-base-content/70 text-sm lg:text-base leading-relaxed">
			รหัสคำสะกดวิทยุสื่อสารสากล ป้องกันการฟังออกเสียงตัวอักษรผิดพลาดในการส่งสาร
		</p>
	</header>

	<!-- Left-Right Side-by-Side Converter Section -->
	<section class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl p-6 shadow-xl space-y-5">
		<div class="flex items-center justify-between flex-wrap gap-3 border-b border-base-300 pb-3">
			<h2 class="text-xl font-extrabold text-primary flex items-center gap-2">
				<span>⚡</span> เครื่องมือแปลงรหัส NATO
			</h2>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
			<div class="space-y-2 flex flex-col justify-between">
				<label for="nato-input-text" class="text-xs font-bold text-base-content/70">
					{isSwapped ? 'คำรหัส NATO (Input):' : 'ข้อความต้นทาง (Input):'}
				</label>
				<textarea
					id="nato-input-text"
					bind:value={inputText}
					placeholder={isSwapped ? 'เช่น Charlie Oscar Delta Echo...' : 'พิมพ์ข้อความ...'}
					rows="4"
					class="textarea  w-full bg-base-100 text-base-content border-base-300 text-base-content font-mono text-base rounded-2xl focus:border-primary/30 resize-none flex-1"
				></textarea>
			</div>

			<div class="botanical-card space-y-2 bg-base-100 text-base-content p-4 rounded-2xl border border-base-300 flex flex-col justify-between">
				<div>
					<span class="text-xs font-bold text-base-content/70">
						{isSwapped ? 'ผลลัพธ์ข้อความ (Decoded Text):' : 'ผลลัพธ์คำรหัส NATO (Encoded NATO Words):'}
					</span>
					<div
						class="text-lg font-mono font-bold text-primary break-words leading-relaxed mt-2 select-all min-h-[80px]"
					>
						{outputResult || '---'}
					</div>
				</div>
				<button
					on:click={copyOutput}
					class="btn btn-sm btn-ghost gap-1.5 text-base-content/70 hover:text-base-content self-end"
				>
					{#if isCopied}
						<CheckIcon size="14" class="text-primary" />
						<span class="text-primary font-bold">คัดลอกสำเร็จ</span>
					{:else}
						<CopyIcon size="14" />
						<span>คัดลอกผลลัพธ์</span>
					{/if}
				</button>
			</div>
		</div>
	</section>

	<!-- Practice Exercises -->
	<section class="botanical-card bg-base-100 text-base-content p-6 rounded-3xl border border-base-300 shadow-xl space-y-5">
		<h2 class="text-xl font-extrabold text-primary flex items-center gap-2 border-b border-base-300 pb-3">
			<span>✏️</span> แบบฝึกหัดทดลองถอดรหัส NATO (Practice Exercises)
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#each exercises as ex, idx}
				<div class="botanical-card bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 space-y-4 flex flex-col justify-between">
					<div class="space-y-3">
						<span class="font-bold text-xs text-base-content/70">ข้อที่ {ex.id}</span>
						<div class="bg-base-100 text-base-content p-3 rounded-xl border border-base-300 text-sm font-mono text-primary font-bold tracking-wide text-center min-h-[60px] flex items-center justify-center">
							{ex.nato}
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
								<CheckCircleIcon size="14" />
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

	<!-- NATO Alphabet Reference Chart Grid (Without Pronunciation) -->
	<section class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl p-6 shadow-xl space-y-4">
		<h2 class="text-lg font-bold text-base-content border-b border-base-300 pb-2">
			📻 ตารางคำรหัสมาตรฐาน NATO (A - Z)
		</h2>
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
			{#each letters as char}
				{@const codeWord = natoData[char]}
				<div class="bg-base-100 text-base-content p-3.5 rounded-2xl border border-base-300 flex items-center justify-between hover:border-primary/30 transition-colors">
					<span class="text-lg font-black text-primary font-mono">{char}</span>
					<span class="text-sm font-bold text-base-content">{codeWord}</span>
				</div>
			{/each}
		</div>
	</section>
</div>
