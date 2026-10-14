<script lang="ts">
	import AnswerChecker from '#lib/components/AnswerChecker.svelte';
	import { ArrowLeftIcon, CheckCircleIcon, RepeatIcon, CopyIcon, CheckIcon, GlobeIcon } from 'svelte-feather-icons';

	let inputText = 'CODEBREAKER';
	let langMode: 'EN' | 'TH' = 'EN';
	let isSwapped = false;
	let isCopied = false;
	let clickedCellInfo: { char: string; code: string; row: number; col: number } | null = null;

	// English 5x5 Grid
	const polybiusGridEng = [
		['A', 'B', 'C', 'D', 'E'],
		['F', 'G', 'H', 'I/J', 'K'],
		['L', 'M', 'N', 'O', 'P'],
		['Q', 'R', 'S', 'T', 'U'],
		['V', 'W', 'X', 'Y', 'Z']
	];

	const polybiusMapEng: Record<string, string> = {
		'A': '11', 'B': '12', 'C': '13', 'D': '14', 'E': '15',
		'F': '21', 'G': '22', 'H': '23', 'I': '24', 'J': '24', 'K': '25',
		'L': '31', 'M': '32', 'N': '33', 'O': '34', 'P': '35',
		'Q': '41', 'R': '42', 'S': '43', 'T': '44', 'U': '45',
		'V': '51', 'W': '52', 'X': '53', 'Y': '54', 'Z': '55'
	};

	const reversePolybiusEng: Record<string, string> = {
		'11': 'A', '12': 'B', '13': 'C', '14': 'D', '15': 'E',
		'21': 'F', '22': 'G', '23': 'H', '24': 'I', '25': 'K',
		'31': 'L', '32': 'M', '33': 'N', '34': 'O', '35': 'P',
		'41': 'Q', '42': 'R', '43': 'S', '44': 'T', '45': 'U',
		'51': 'V', '52': 'W', '53': 'X', '54': 'Y', '55': 'Z'
	};

	// Thai 8x8 Grid
	const polybiusGridThai = [
		['ก', 'ข', 'ค', 'ฆ', 'ง', 'จ', 'ฉ', 'ช'],
		['ซ', 'ฌ', 'ญ', 'ฎ', 'ฏ', 'ฐ', 'ฑ', 'ฒ'],
		['ณ', 'ด', 'ต', 'ถ', 'ท', 'ธ', 'น', 'บ'],
		['ป', 'ผ', 'ฝ', 'พ', 'ฟ', 'ภ', 'ม', 'ย'],
		['ร', 'ฤ', 'ล', 'ฦ', 'ว', 'ศ', 'ษ', 'ส'],
		['ห', 'ฬ', 'อ', 'ฮ', 'ะ', 'า', 'ำ', 'ิ'],
		['ี', 'ึ', 'ื', 'ุ', 'ู', 'เ', 'แ', 'โ'],
		['ใ', 'ไ', '็', '่', '้', '๊', '๋', '์']
	];

	const polybiusMapThai: Record<string, string> = {};
	const reversePolybiusThai: Record<string, string> = {};

	polybiusGridThai.forEach((row, rIdx) => {
		row.forEach((char, cIdx) => {
			const code = `${rIdx + 1}${cIdx + 1}`;
			polybiusMapThai[char] = code;
			reversePolybiusThai[code] = char;
		});
	});

	$: processedResult = (() => {
		if (!inputText) return '';
		if (!isSwapped) {
			const map = langMode === 'EN' ? polybiusMapEng : polybiusMapThai;
			return inputText
				.toUpperCase()
				.split('')
				.map((ch) => map[ch] || ch)
				.join(' ');
		} else {
			const reverseMap = langMode === 'EN' ? reversePolybiusEng : reversePolybiusThai;
			return inputText
				.trim()
				.split(/\s+/)
				.map((num) => reverseMap[num] || num)
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

	function handleCellClick(char: string, row: number, col: number) {
		const code = `${row}${col}`;
		clickedCellInfo = { char, code, row, col };
	}

	let answers = ['', '', ''];
	let feedback = ['', '', ''];

	const exercises = [
		{ id: 1, cipherText: '13 34 14 15', correctAnswer: 'CODE' },
		{ id: 2, cipherText: '43 34 43', correctAnswer: 'SOS' },
		{ id: 3, cipherText: '23 15 31 31 34', correctAnswer: 'HELLO' }
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
	<title>Code Breaker | Polybius Square Cipher</title>
	<meta name="description" content="คู่มือและแบบฝึกหัด Polybius Square Cipher ตารางพิกัด 5x5 และตารางภาษาไทย 8x8" />
</svelte:head>

<div class="flex flex-col gap-8 w-full max-w-5xl mx-auto px-4 py-8 select-none">
	<div class="flex items-center justify-between">
		<a href="/resources/ciphers" class="btn btn-ghost btn-xs gap-1.5 font-bold text-base-content/70 hover:text-base-content">
			<ArrowLeftIcon size="14" />
			<span>กลับไปคลังรหัสลับ</span>
		</a>
	</div>

	<header class="space-y-2 text-center md:text-left">
		<div class="flex items-center gap-2 justify-center md:justify-start">
			<span class="badge badge-success font-bold text-xs py-2 px-3">EASY</span>
			<span class="text-xs text-base-content/70 font-mono uppercase tracking-wider">Coordinates Substitution</span>
		</div>
		<h1 class="text-3xl lg:text-4xl font-black text-base-content">Polybius Square Cipher (ตารางโพลีบิอุส)</h1>
		<p class="text-base-content/70 text-sm lg:text-base leading-relaxed">
			รหัสตารางพิกัดตัวเลข 5x5 (ภาษาอังกฤษ) และระบบตารางพิกัด 8x8 (ภาษาไทย) แทนอักษรด้วยพิกัด [แถว, คอลัมน์]
		</p>
	</header>

	<!-- Converter Tool -->
	<section class="botanical-card bg-base-100 text-base-content p-6 rounded-3xl border border-base-300 shadow-xl space-y-4">
		<div class="flex items-center justify-between flex-wrap gap-2 border-b border-base-300 pb-3">
			<div class="flex items-center gap-2">
				<span class="text-xs font-bold text-base-content/70 flex items-center gap-1">
					<GlobeIcon size="14" class="text-primary" />
					<span>ภาษา (Language):</span>
				</span>
				<div class="join border border-base-300 bg-base-100 text-base-content rounded-xl p-0.5">
					<button
						on:click={() => {
							langMode = 'EN';
							if (inputText === 'กขค') inputText = 'CODEBREAKER';
						}}
						class="join-item btn btn-xs font-extrabold rounded-lg {langMode === 'EN'
							? 'btn-primary text-base-content'
							: 'btn-ghost text-base-content/70'}"
					>
						English (5x5 Grid)
					</button>
					<button
						on:click={() => {
							langMode = 'TH';
							if (inputText === 'CODEBREAKER') inputText = 'กขค';
						}}
						class="join-item btn btn-xs font-extrabold rounded-lg {langMode === 'TH'
							? 'btn-primary text-base-content'
							: 'btn-ghost text-base-content/70'}"
					>
						ไทย (8x8 Grid)
					</button>
				</div>
			</div>

			<button on:click={toggleSwap} class="btn btn-outline btn-xs gap-1.5 font-bold border-base-300 text-base-content/70 hover:bg-base-100 text-base-content">
				<RepeatIcon size="14" />
				<span>{isSwapped ? 'สลับ (ถอดรหัส พิกัด ➔ ข้อความ)' : 'สลับ (เข้ารหัส ข้อความ ➔ พิกัด)'}</span>
			</button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
			<div class="space-y-2">
				<label class="text-xs font-bold text-base-content/70 block" for="polybius-input">
					{isSwapped ? 'พิกัดตัวเลข (Input Coordinates):' : `ข้อความ ${langMode === 'EN' ? 'ภาษาอังกฤษ' : 'ภาษาไทย'} (Input):`}
				</label>
				<textarea
					id="polybius-input"
					bind:value={inputText}
					placeholder={isSwapped ? 'เช่น 13 34 14 15...' : 'พิมพ์ข้อความ...'}
					rows="4"
					class="textarea  w-full bg-base-100 text-base-content border-base-300 text-base-content font-mono uppercase text-sm rounded-2xl focus:border-primary/30"
				></textarea>
			</div>

			<div class="botanical-card space-y-2 bg-base-100 text-base-content p-4 rounded-2xl border border-base-300 flex flex-col justify-between">
				<div>
					<span class="text-xs font-bold text-base-content/70">
						{isSwapped ? 'ผลลัพธ์ข้อความ (Output Text):' : 'ผลลัพธ์พิกัดตัวเลข (Output Coordinates):'}
					</span>
					<div class="text-xl font-mono font-bold text-primary break-all mt-2 min-h-[60px]">
						{processedResult || '---'}
					</div>
				</div>
				<button
					on:click={copyOutput}
					class="btn btn-sm btn-ghost gap-1.5 text-base-content/70 hover:text-base-content self-end font-bold"
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

	<!-- Interactive Grid Chart Section with Row & Column Highlighting -->
	<section class="botanical-card bg-base-100 text-base-content border border-base-300 p-6 rounded-3xl shadow-xl space-y-4">
		<div class="flex items-center justify-between flex-wrap gap-2 border-b border-base-300 pb-2">
			<h2 class="text-xl font-extrabold text-base-content">
				📊 ตารางพิกัด Polybius ({langMode === 'EN' ? '5x5 English Grid' : '8x8 Thai Grid'})
			</h2>
			<span class="text-xs text-base-content/70 font-medium">คลิกที่ตัวอักษรเพื่อไฮไลต์พิกัด แถว และคอลัมน์</span>
		</div>

		{#if clickedCellInfo}
			<div class="bg-base-100 text-base-content border border-primary/30 p-3 px-5 rounded-2xl flex items-center justify-between text-sm animate-fade-in">
				<div class="flex items-center gap-3">
					<span class="text-2xl font-bold text-amber-400 font-mono">"{clickedCellInfo.char}"</span>
					<span class="text-base-content/70">
						➔ พิกัดคือ <strong class="text-primary font-mono text-base">{clickedCellInfo.code}</strong> (แถว {clickedCellInfo.row}, คอลัมน์ {clickedCellInfo.col})
					</span>
				</div>
				<button on:click={() => (clickedCellInfo = null)} class="btn btn-ghost btn-xs text-base-content/70 hover:text-base-content font-bold">
					✕ ล้างไฮไลต์
				</button>
			</div>
		{/if}

		{#if langMode === 'EN'}
			<!-- 5x5 Grid with Row/Column Highlighting -->
			<div class="overflow-x-auto">
				<table class="table table-compact w-full text-center border-collapse font-mono">
					<thead>
						<tr>
							<th class="bg-base-100 text-base-content text-base-content/70">#</th>
							{#each [1, 2, 3, 4, 5] as colNum, cIdx}
								<th class="bg-base-100 text-base-content font-bold transition-colors {clickedCellInfo?.col === cIdx + 1 ? 'bg-base-300 text-base-content text-amber-300 font-black' : 'text-amber-400'}">
									{colNum}
								</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each polybiusGridEng as row, rIdx}
							<tr>
								<th class="bg-base-100 text-base-content font-bold transition-colors {clickedCellInfo?.row === rIdx + 1 ? 'bg-base-300 text-base-content text-amber-300 font-black' : 'text-amber-400'}">
									{rIdx + 1}
								</th>
								{#each row as cell, cIdx}
									{@const isSelected = clickedCellInfo?.row === rIdx + 1 && clickedCellInfo?.col === cIdx + 1}
									{@const isHighlightedRowOrCol = clickedCellInfo && (clickedCellInfo.row === rIdx + 1 || clickedCellInfo.col === cIdx + 1)}
									<td
										on:click={() => handleCellClick(cell, rIdx + 1, cIdx + 1)}
										class="border border-base-300 text-base p-3 cursor-pointer transition-all duration-200 {isSelected ? 'bg-emerald-500 text-base-content/70 font-black scale-105 shadow-xl rounded-xl z-10' : isHighlightedRowOrCol ? 'bg-base-300 text-base-content text-primary font-bold border-primary/30' : 'bg-base-100 text-base-content text-base-content font-bold hover:bg-emerald-500/20 hover:text-primary'}"
									>
										{cell}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<!-- 8x8 Thai Grid with Row/Column Highlighting -->
			<div class="overflow-x-auto">
				<table class="table table-compact w-full text-center border-collapse font-mono text-xs">
					<thead>
						<tr>
							<th class="bg-base-100 text-base-content text-base-content/70">#</th>
							{#each [1, 2, 3, 4, 5, 6, 7, 8] as colNum, cIdx}
								<th class="bg-base-100 text-base-content font-bold transition-colors {clickedCellInfo?.col === cIdx + 1 ? 'bg-base-300 text-base-content text-primary font-black' : 'text-primary'}">
									{colNum}
								</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each polybiusGridThai as row, rIdx}
							<tr>
								<th class="bg-base-100 text-base-content font-bold transition-colors {clickedCellInfo?.row === rIdx + 1 ? 'bg-base-300 text-base-content text-primary font-black' : 'text-primary'}">
									{rIdx + 1}
								</th>
								{#each row as cell, cIdx}
									{@const isSelected = clickedCellInfo?.row === rIdx + 1 && clickedCellInfo?.col === cIdx + 1}
									{@const isHighlightedRowOrCol = clickedCellInfo && (clickedCellInfo.row === rIdx + 1 || clickedCellInfo.col === cIdx + 1)}
									<td
										on:click={() => handleCellClick(cell, rIdx + 1, cIdx + 1)}
										class="border border-base-300 text-sm p-3 cursor-pointer transition-all duration-200 {isSelected ? 'bg-emerald-500 text-base-content/70 font-black scale-105 shadow-xl rounded-xl z-10' : isHighlightedRowOrCol ? 'bg-base-300 text-base-content text-primary font-bold border-primary/30' : 'bg-base-100 text-base-content text-base-content font-bold hover:bg-emerald-500/20 hover:text-primary'}"
									>
										{cell}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>

	<!-- Practice Exercises -->
	<section class="botanical-card bg-base-100 text-base-content p-6 rounded-3xl border border-base-300 shadow-xl space-y-5">
		<h2 class="text-xl font-extrabold text-primary flex items-center gap-2 border-b border-base-300 pb-3">
			<span>✏️</span> แบบฝึกหัดทดลองถอดรหัส Polybius (Practice Exercises)
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			{#each exercises as ex, idx}
				<div class="botanical-card bg-base-100 text-base-content p-5 rounded-2xl border border-base-300 space-y-4 flex flex-col justify-between">
					<div class="space-y-3">
						<span class="font-bold text-xs text-base-content/70">ข้อที่ {ex.id}</span>
						<div class="bg-base-100 text-base-content p-3 rounded-xl border border-base-300 font-mono text-lg font-bold text-primary tracking-widest text-center min-h-[60px] flex items-center justify-center">
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
								<CheckCircleIcon size="14" />
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
