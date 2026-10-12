<script lang="ts">
	import { search, getFirstLetter } from '#lib/thwordsearch.js';
	import { slide } from 'svelte/transition';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import {
		SearchIcon,
		AlertOctagonIcon,
		AlertTriangleIcon,
		Share2Icon,
		BookIcon,
		ClockIcon,
		Maximize2Icon,
		TrendingUpIcon,
		BookOpenIcon,
		Trash2Icon,
		XIcon
	} from 'svelte-feather-icons';
	import { getWordFrequency, getWordFrequencyTier } from '#lib/utils/dict_pythainlp.js';

	let input: string = $state(page.url.searchParams.get('q') || '');
	let query: string = $state(input);
	let start: number = $state(0);
	//const atHomePage: boolean = (!query)? true: false
	let includeWiki: boolean = $state(false);
	let queryResults: any = $state({ valid: false, count: 0, results: [] });
	let loading: boolean = $state(!!input);
	let revealHistory: boolean = $state(false);
	let strict: boolean = $state(true);
	let sortByFreq: boolean = $state(false);
	let history: string[] = $state([]);

	let activeWord = $state('');
	let toastTimeout: NodeJS.Timeout;

	function copyWord(word: string) {
		navigator.clipboard.writeText(word);
		activeWord = word;
		if (toastTimeout) clearTimeout(toastTimeout);
		toastTimeout = setTimeout(() => {
			activeWord = '';
		}, 3000);
	}

	let shareCopied = $state(false);
	let shareTimeout: NodeJS.Timeout;

	function shareUrl() {
		const shareUrl = new URL(window.location.href);
		if (query) {
			shareUrl.searchParams.set('q', query);
		}
		navigator.clipboard.writeText(shareUrl.toString());

		shareCopied = true;
		if (shareTimeout) clearTimeout(shareTimeout);
		shareTimeout = setTimeout(() => {
			shareCopied = false;
		}, 3000);
	}

	let letter: string = $state('');
	let allFirstLetters: string[] = $state([]);

	let filteredResults = $derived(letter === ''
		? queryResults?.results || []
		: (queryResults?.results || []).filter((r: string) => getFirstLetter(r) == letter));
	let sortedResults = $derived(sortByFreq
		? [...filteredResults].sort((a: string, b: string) => {
				const freqA = getWordFrequency(a);
				const freqB = getWordFrequency(b);
				if (freqB !== freqA) return freqB - freqA;
				return a.localeCompare(b, 'th');
			})
		: filteredResults);
	let currentQueryResults = $derived(sortedResults.slice(
		start,
		start + Math.min(100, sortedResults.length - start)
	));

	const url = 'https://codebreakerth.vercel.app/tool/thwordsearch';
	const title = 'Thai Word Search';
	const description = 'Pattern-matching in Thai language';

	// Assemble bracket syntax at runtime so Tailwind's source scanner does not
	// mistake search examples for arbitrary utility classes.
	const squarePattern = `${String.fromCharCode(91)}ใไโ${String.fromCharCode(93)}ก.`;
	const exactLettersPattern = `${String.fromCharCode(123)}บนมา${String.fromCharCode(125)}`;
	const examples = [
		['มีตัวอักษรในตำแหน่งที่กำหนด', 'ส..น', 'สงวน, สถาน, สุทัศน์, ...'],
		['ตัวอักษรบางตำแหน่งเป็นไปได้หลายแบบ', squarePattern, 'โกก, ไกร, ใกล้, ...'],
		['มีแต่ตัวอักษรที่กำหนด', exactLettersPattern, 'มัน, นมนาน, บนบาน, ...'],
		['มีตัวอักษรที่กำหนด และตัวอักษรอื่นได้อีก 1 ตัว', `${exactLettersPattern}+1`, 'รามา, สนามบิน, ขนานนาม, ...'],
		['ขึ้นต้นด้วย สับ', 'สับ*', 'สับไก, สับราง, สับปะรด,...'],
		['มีตัวอักษรเรียงกันตามลำดับ', '*ธ*ท*', 'กรีธาทัพ, ธรณีวิทยา, อิทธิบาท, ...'],
		['anagram ตัวอักษรทั้งหมด', '/กลม', 'กมล, มกุล, มีลูก, ...'],
		[
			'anagram ตัวอักษรทั้งหมด และเพิ่มอีกกี่ตัวก็ได้',
			'/กะลา*',
			'การละคร, เจาะลึก, เพาะปลูก, ...'
		],

		[
			'มี 3-8 ตัวอักษร และมี ก ข ค',
			'3-8:/กขค*',
			'ขนมครก, คณะลูกขุน, คุกเข่า, ...'
		],

		[
			'มีอย่างน้อย 12 ตัวอักษร และมี ปลา',
			'12-:*ปลา*',
			'กระต่ายแก่แม่ปลาช่อน, ...'
		],

		[
			'มี 7 ตัวอักษร มี ม อยู่ตำแหน่งที่ 3 และมี ส ะ',
			'7:..ม* & /สะ*',
			'สามัตถิยะ, เหมาะสม, อัสมิมานะ'
		],
		['มี 11 ตัวอักษร และไม่มีสระในบรรทัด', '11:/* & ^ใเแโไาำะฤา', 'กล้องจุลทรรศน์, ...'],
		['มี ฮ แต่ไม่ได้ขึ้นต้นด้วย ฮ', '/*ฮ & !ฮ*', 'เก๊กฮวย, นกฮูก, เฮ, ...'],
		['ขึ้นต้นด้วยไม้ม้วนหรือไม้มลาย', 'ใ* | ไ*', 'ไก, ใกล้, ไข, ใข, ...'],
		['ใช้ตัวแปร (A-Z) อ้างอิงข้อความเดียวกัน', 'AA', 'นานา, กก, ...'],
		['หาชุดคำที่สอดคล้องกันด้วยสมการ (;)', 'AB; BA', 'กมลา; มลาก, กู้เงิน; เงินกู้, ...'],
		['ใช้ตัวแปรสองตัวขึ้นไป', 'AาB; AะB', 'เอาใจ; เอะใจ, ...'],
		['หาพาลินโดรมความยาวเป็นเลขคู่', 'A~A', 'การราก, ...'],
		['หาพาลินโดรมความยาวเป็นเลขคี่', 'A.~A', 'กนก, ยาย, ทายาท, การกราก, ...']
	];

	function onKeypress(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			submit();
		}
	}

	let timerInterval: NodeJS.Timeout;
	let searchTime = $state(0);
	let searchProgress = $state({ count: 0 });
	let abortController: AbortController | undefined = $state();

	function loadExample(ip: string) {
		input = ip;
		window.scrollTo({ top: 0, behavior: 'smooth' });
		submit();
	}

	function saveHistory(q: string) {
		if (!q) return;
		history = [q, ...history.filter((item) => item !== q)].slice(0, 20);
		try {
			localStorage.setItem('thwordsearch_history', JSON.stringify(history));
		} catch (e) {}
	}

	function removeHistoryItem(q: string) {
		history = history.filter((item) => item !== q);
		try {
			localStorage.setItem('thwordsearch_history', JSON.stringify(history));
		} catch (e) {}
	}

	function clearHistory() {
		history = [];
		try {
			localStorage.removeItem('thwordsearch_history');
		} catch (e) {}
	}

	async function submit() {
		if (!input) alert('ใส่คำก่อนสิเอ้อ!');
		else {
			query = input;
			start = 0;
			letter = '';
			loading = true;
			searchTime = 0;
			searchProgress.count = 0;
			saveHistory(query);

			// Update the URL without reloading the page
			const url = new URL(window.location.href);
			url.searchParams.set('q', query);
			window.history.replaceState({}, '', url);

			if (abortController) abortController.abort();
			abortController = new AbortController();

			if (timerInterval) clearInterval(timerInterval);
			timerInterval = setInterval(() => {
					searchTime += 0.1;
					searchProgress = searchProgress;
				},
				100
			);

			try {
				queryResults = await search(query, includeWiki, abortController.signal, searchProgress, strict);
				allFirstLetters = [];
				if (queryResults.results.length > 0) {
					let latest = getFirstLetter(queryResults.results[0]);
					allFirstLetters.push(latest);

					for (var w of queryResults.results) {
						if (getFirstLetter(w) != latest) {
							latest = getFirstLetter(w);
							allFirstLetters.push(latest);
						}
					}
				}
			} catch (e: any) {
				console.error(e);
			} finally {
				clearInterval(timerInterval);
				loading = false;
			}
		}
	}

	onMount(() => {
		try {
			const saved = localStorage.getItem('thwordsearch_history');
			if (saved) history = JSON.parse(saved);
		} catch (e) {}

		if (input) {
			submit();
		}
	});
</script>


<svelte:head>
	<title>{title} | Code Breaker</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/og-thai-wordsearch.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="/og-thai-wordsearch.png" />
</svelte:head>

<div class="flex flex-col justify-items-center text-center gap-2">
	<div class="flex items-center justify-center gap-2 mb-2">
		<h1 class="text-2xl lg:text-3xl font-extrabold">Thai Word Search</h1>
		<a
			href="/tools/thwordsearch/guide"
			class="tooltip tooltip-right flex items-center"
			data-tip="คู่มือการใช้งานอย่างละเอียด"
		>
			<span
				class="cursor-pointer text-primary hover:bg-primary/15 p-1.5 rounded-lg transition-all"
				role="button"
				tabindex="0"
			>
				<BookOpenIcon size="26" />
			</span>
		</a>
	</div>
	<div class="flex flex-col lg:flex-row m-auto">
		<div class="flex flex-row justify-center items-center gap-4">
			<input
				type="text"
				class="input  input-sm lg:input-md lg:text-xl"
				onkeypress={onKeypress}
				bind:value={input}
				placeholder="พิมพ์รูปแบบที่นี่"
			/>
			<div class="tooltip tooltip-bottom" data-tip="ค้นหา">
				<span
					onclick={submit}
					class="cursor-pointer text-primary hover:bg-primary/15 p-2 rounded-lg transition-all"
					role="button"
					tabindex="0"
				>
					<SearchIcon size="30" />
				</span>
			</div>

			<div class="tooltip tooltip-bottom" data-tip="วิธีใช้">
				<span
					onclick={() => {
						query = '';
						input = '';
					}}
					class="cursor-pointer text-info-content hover:bg-info/15 p-2 rounded-lg transition-all"
					role="button"
					tabindex="0"
				>
					<AlertOctagonIcon size="30" />
				</span>
			</div>

			<div class="relative inline-block">
				<div class="tooltip tooltip-bottom" data-tip="แชร์คำค้นหา">
					<span
						onclick={shareUrl}
						class="cursor-pointer text-accent-content hover:bg-accent/15 p-2 rounded-lg transition-all"
						role="button"
						tabindex="0"
					>
						<Share2Icon size="30" />
					</span>
				</div>
				{#if shareCopied}
					<div
						class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-success text-success-content rounded shadow-xl z-50 whitespace-nowrap text-sm font-bold"
						in:slide={{ duration: 200 }}
					>
						Copied!
						<div
							class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-success rotate-45"
						></div>
					</div>
				{/if}
			</div>
		</div>

		<div class="divider divider-horizontal mx-2"></div>

		<div
			class="flex flex-row justify-center mt-2 lg:mt-0 gap-4 items-center"
		>
			<div
				class="tooltip tooltip-bottom"
				data-tip="นับอักษรบนล่าง"
			>
				<label class="cursor-pointer flex items-center gap-1">
					<input
						type="checkbox"
						class="checkbox checkbox-sm checkbox-primary"
						bind:checked={strict}
					/>
					<span
						class="{strict ? 'text-primary' : 'opacity-50'} transition-colors font-bold text-lg"
					>
						<Maximize2Icon size="24" />
					</span>
				</label>
			</div>
			<div class="tooltip tooltip-bottom" data-tip="รวมหัวข้อใน Wikipedia">
				<label class="cursor-pointer flex items-center gap-1">
					<input type="checkbox" class="checkbox checkbox-sm" bind:checked={includeWiki} />
					<span class="{includeWiki ? 'text-primary' : 'opacity-50'} transition-colors">
						<BookIcon size="24" />
					</span>
				</label>
			</div>
			<div class="tooltip tooltip-bottom" data-tip="เรียงตามความนิยม">
				<label class="cursor-pointer flex items-center gap-1">
					<input
						type="checkbox"
						class="checkbox checkbox-sm checkbox-secondary"
						bind:checked={sortByFreq}
					/>
					<span
						class="{sortByFreq ? 'text-secondary' : 'opacity-50'} transition-colors font-bold text-lg"
					>
						<TrendingUpIcon size="24" />
					</span>
				</label>
			</div>
			<div class="tooltip tooltip-bottom" data-tip="แสดงประวัติการค้นหา">
				<label class="cursor-pointer flex items-center gap-1">
					<input type="checkbox" class="checkbox checkbox-sm" bind:checked={revealHistory} />
					<span class="{revealHistory ? 'text-primary' : 'opacity-50'} transition-colors">
						<ClockIcon size="24" />
					</span>
				</label>
			</div>
		</div>
	</div>
	{#if revealHistory}
		<div
			class="bg-base-200/40 backdrop-blur-md border border-base-300 rounded-2xl my-3 p-4 shadow-lg w-full max-w-4xl mx-auto"
			in:slide={{ duration: 250 }}
			out:slide={{ duration: 200 }}
		>
			<div class="flex items-center justify-between pb-3 mb-3 border-b border-base-300/60">
				<div class="flex items-center gap-2">
					<ClockIcon size="18" class="text-primary" />
					<span class="font-bold text-sm text-base-content/90">ประวัติการค้นหา</span>
					<span class="badge badge-sm badge-primary badge-outline font-mono">{history.length}</span>
				</div>
				{#if history.length > 0}
					<button
						class="btn btn-xs btn-ghost text-error-content hover:bg-error/15 gap-1 transition-colors"
						onclick={clearHistory}
					>
						<Trash2Icon size="14" />
						<span>ล้างประวัติ</span>
					</button>
				{/if}
			</div>

			{#if history.length > 0}
				<div class="flex flex-wrap gap-2 justify-start items-center">
					{#each history as h (h)}
						<div
							class="group flex items-center bg-base-100 hover:bg-primary/10 border border-base-300 hover:border-primary/40 rounded-xl px-3 py-1.5 transition-all shadow-sm"
						>
							<button
								class="font-mono text-sm font-medium text-base-content hover:text-primary transition-colors pr-1.5"
								onclick={() => {
									input = h;
									submit();
								}}
							>
								{h}
							</button>
							<button
								class="text-base-content/40 hover:text-error-content p-0.5 rounded-md transition-colors"
								title="ลบรายการนี้"
								onclick={() => removeHistoryItem(h)}
							>
								<XIcon size="14" />
							</button>
						</div>
					{/each}
				</div>
			{:else}
				<div class="text-center py-4 text-sm text-base-content/50 italic">
					ยังไม่มีประวัติการค้นหา
				</div>
			{/if}
		</div>
	{/if}

	<div class="overflow-x-auto mx-auto mt-4">
		{#if loading}
			<div class="flex justify-center items-center py-16 flex-col gap-6">
				<svg
					class="animate-spin h-12 w-12 text-primary"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						class="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				<div class="flex flex-col items-center gap-2">
					<span class="text-2xl animate-pulse font-bold text-base-content/80"
						>กำลังค้นหา "{query}"...</span
					>
					<span class="font-mono text-lg text-base-content/60"
						>เวลา: {searchTime.toFixed(1)}s | พบแล้ว: {searchProgress.count} คำ</span
					>
				</div>
				<button class="btn btn-error btn-outline mt-2" onclick={() => abortController?.abort()}>
					ยกเลิก
				</button>
			</div>
		{:else if query}
			{#if queryResults.aborted}
				<div class="alert alert-warning shadow-sm my-4 flex gap-4 max-w-2xl mx-auto">
					<AlertTriangleIcon size="24" />
					<span> หยุดการค้นหา! แสดงผลลัพธ์ที่ค้นพบแล้วบางส่วน...</span>
				</div>
			{/if}
			{#if filteredResults.length > 0}
				<div class="join justify-center my-4">
					{#each Array(Math.floor(filteredResults.length / 100)) as _, idx}
						<button
							class="join-item btn btn-sm {idx == start / 100 ? 'btn-accent' : ''}"
							name="pageButtons"
							onclick={() => {
								start = idx * 100;
								window.scrollTo(0, 0);
							}}
						>
							{idx + 1}
						</button>
					{/each}
				</div>
				<div class="join justify-center my-4">
					{#each allFirstLetters as a}
						<button
							class="join-item btn btn-sm {a == letter ? 'btn-accent' : ''} text-lg font-thin"
							name="pageButtons"
							onclick={() => {
								letter = letter == a ? '' : a;
								start = 0;
								window.scrollTo(0, 0);
							}}
						>
							{a}
						</button>
					{/each}
				</div>
				<span
					>แสดงผลลัพธ์หน้าที่ {start / 100 + 1} ({start + 1} ถึง {Math.min(
						start + 100,
						queryResults.count
					)}) จาก {queryResults.count} คำ</span
				><br />
				{#each currentQueryResults as qr}
					<div class="relative inline-block m-0.5">
						<button
							class="btn btn-outline btn-sm lg:btn-md lg:text-xl font-thin w-full gap-1"
							onclick={() => copyWord(qr)}
						>
							<span>{qr}</span>
							{#if sortByFreq}
								{@const tier = getWordFrequencyTier(getWordFrequency(qr))}
								{#if tier}
									<span class="tooltip tooltip-top" data-tip={tier.label}>
										{#if tier.icon}
											<span class="text-xs">{tier.icon}</span>
										{:else}
											<span class="inline-block w-2 h-2 rounded-full {tier.color} opacity-60"></span>
										{/if}
									</span>
								{/if}
							{/if}
						</button>
						{#if activeWord === qr}
							<div
								class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-base-100 text-base-content text-base-content rounded-lg shadow-xl flex items-center gap-3 z-50 whitespace-nowrap"
								in:slide={{ duration: 200 }}
							>
								<span class="font-bold text-sm">Copied!</span>
								<a
									href="https://www.google.com/search?q={encodeURIComponent(qr)}"
									target="_blank"
									rel="noopener noreferrer"
									class="btn btn-xs btn-primary"
								>
									Google It
								</a>
								<div
									class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-base-100 text-base-content rotate-45"
								></div>
							</div>
						{/if}
					</div>
				{/each}
				<div class="join justify-center my-4">
					{#each Array(Math.floor(filteredResults.length / 100) + 1) as _, idx}
						<button
							class="join-item btn btn-sm {idx == start / 100 ? 'btn-accent' : ''}"
							name="pageButtons"
							onclick={() => {
								start = idx * 100;
								window.scrollTo(0, 0);
							}}
						>
							{idx + 1}
						</button>
					{/each}
				</div>
			{:else}
				<span>ไม่เจอรูปแบบ </span> <span class="text-error-content"> {query} </span>
				<span>ลองใหม่นะ</span>
			{/if}
		{:else}
			<div class="bg-base-100 text-base-content backdrop-blur-xl border border-base-300 rounded-2xl overflow-hidden hidden lg:block shadow-xl">
				<table
					class="table w-full text-base-content/70 [&_th]:border [&_td]:border [&_th]:border-base-300 [&_td]:border-base-300"
				>
					<thead class="bg-base-100 text-base-content text-base-content/70">
						<tr>
							<th class="py-3 px-4 text-left">ถ้าอยากหาคำที่...</th>
							<th class="py-3 px-4 text-left">...ให้ใส่...</th>
							<th class="py-3 px-4 text-left">...จะได้</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-base-300 text-sm">
						{#each examples as [desc, ip, result]}
							<tr class="hover:bg-base-100 text-base-content transition-colors">
								<td class="py-3 px-4">{desc}</td>
								<td class="py-3 px-4">
									<div data-tip="ลองเลย" class="tooltip">
										<button
											class="px-4 py-2 rounded-xl bg-cyan-500/20 text-primary border border-primary/30 hover:bg-cyan-500/30 font-mono text-base transition-colors"
											onclick={() => loadExample(ip)}>{ip}</button
										>
									</div>
								</td>
								<td class="py-3 px-4 text-base-content/70">{result}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div
				class="bg-base-100 text-base-content backdrop-blur-xl border border-base-300 rounded-2xl overflow-hidden lg:hidden shadow-xl mx-auto w-full max-w-sm"
			>
				<table
					class="table w-full text-base-content/70 [&_th]:border [&_td]:border [&_th]:border-base-300 [&_td]:border-base-300"
				>
					<thead class="bg-base-100 text-base-content text-base-content/70">
						<tr>
							<th class="py-3 px-4 text-left">ถ้าอยากหาคำที่...ให้ใส่...</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-base-300 text-sm">
						{#each examples as [desc, ip]}
							<tr class="hover:bg-base-100 text-base-content transition-colors">
								<td class="py-3 px-4">
									<p class="font-medium text-base-content/70">{desc}</p>
									<div data-tip="ลองเลย" class="tooltip mt-2">
										<button class="px-3 py-1 rounded-lg bg-cyan-500/20 text-primary border border-primary/30 font-mono text-xs" onclick={() => loadExample(ip)}
											>{ip}</button
										>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
