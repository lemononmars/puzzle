<script lang="ts">
import UiArrowLeft from '@lucide/svelte/icons/arrow-left';
	import { wordDatabase } from '#lib/data/puzzles/spelling/words.js';
	import SearchIcon from '@lucide/svelte/icons/search';
import BookOpenIcon from '@lucide/svelte/icons/book-open';
import CheckCircleIcon from '@lucide/svelte/icons/circle-check';
import XCircleIcon from '@lucide/svelte/icons/circle-x';
import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
import GridIcon from '@lucide/svelte/icons/grid-2x2';
import ListIcon from '@lucide/svelte/icons/list';

	let searchQuery = '';
	let wordTypeFilter: 'all' | 'native' | 'loan' = 'all';
	let showExplanations = false;
	let viewMode: 'card' | 'table' = 'card';
	let letterFilter = '';

	// Pagination state
	let currentPage = 1;
	const itemsPerPage = 24;

	// Extract the first consonant (ignore leading vowels เ แ โ ใ ไ)
	function getFirstConsonant(word: string) {
		const firstChar = word[0];
		if (['เ', 'แ', 'โ', 'ใ', 'ไ'].includes(firstChar) && word.length > 1) {
			return word[1];
		}
		return firstChar;
	}

	// Get unique starting letters from database, sorted by Unicode
	$: startingLetters = [...new Set(wordDatabase.map((w) => getFirstConsonant(w.correct)))].sort();

	$: filteredWords = wordDatabase.filter((word) => {
		const matchesSearch =
			searchQuery === '' ||
			word.correct.includes(searchQuery) ||
			word.incorrect.some((w) => w.includes(searchQuery));

		const matchesType =
			wordTypeFilter === 'all' ||
			(wordTypeFilter === 'loan' && word.isLoanWord) ||
			(wordTypeFilter === 'native' && !word.isLoanWord);

		const matchesLetter = letterFilter === '' || getFirstConsonant(word.correct) === letterFilter;

		return matchesSearch && matchesType && matchesLetter;
	});

	// Reset page on any filter change
	$: if (searchQuery || wordTypeFilter || letterFilter || viewMode) {
		currentPage = 1;
	}

	$: totalPages = Math.ceil(filteredWords.length / itemsPerPage);
	$: paginatedWords = filteredWords.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	function clearFilters() {
		searchQuery = '';
		wordTypeFilter = 'all';
		letterFilter = '';
	}
</script>

<svelte:head>
	<title>Chi Fun | พจนานุกรมคำสะกด 📚</title>
	<meta name="description" content="รวมคำที่มักสะกดผิดบ่อยในภาษาไทย พร้อมระบบค้นหาและตัวกรอง" />
</svelte:head>

<div class="flex flex-col gap-0 w-full max-w-5xl mx-auto px-4 pb-12 select-none">
	<!-- Navigation Bar -->
	<nav class="w-full border-b border-base-300 mb-6 pt-2">
		<div class="flex items-center justify-between py-2 flex-wrap gap-2">
			<a href="/resources" class="btn btn-ghost btn-xs gap-1.5 font-bold text-base-content/80 hover:text-base-content">
				<UiArrowLeft size={16} class="inline-block align-middle" aria-hidden="true" /> กลับไปหน้าข้อมูล
			</a>
			<a
				href="/puzzles/spellingquiz"
				class="btn btn-outline btn-xs gap-1.5 font-bold flex-shrink-0"
			>
				ทดสอบการสะกดคำ
			</a>
		</div>
	</nav>

	<!-- Page Header -->
	<div class="flex flex-col items-center text-center gap-3 mb-6">
		<div
			class="botanical-card w-16 h-16 rounded-2xl bg-base-100 text-base-content text-primary flex items-center justify-center shadow-xl border border-base-300"
		>
			<BookOpenIcon size={28} />
		</div>
		<h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">พจนานุกรมคำสะกด</h1>
		<p class="text-sm opacity-80 max-w-2xl leading-relaxed mx-auto">
			รวบรวม <span class="font-black text-primary">{wordDatabase.length}</span> คำในภาษาไทยที่มักสะกดผิด
			พร้อมระบบค้นหาและตัวกรอง
		</p>
	</div>

	<!-- Search & Filters -->
	<div class="botanical-card bg-base-200 text-base-content p-4 md:p-6 rounded-2xl border border-base-300 shadow-xl mb-6 flex flex-col gap-4">
		<div class="flex flex-col md:flex-row gap-3">
			<div class="relative flex-1">
				<SearchIcon size={18} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/50" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="ค้นหาคำถูกต้อง หรือคำที่มักเขียนผิด..."
					class="input  w-full pl-10 bg-base-100 text-sm focus:input-primary"
				/>
				{#if searchQuery}
					<button
						on:click={() => (searchQuery = '')}
						class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-base-content/60 hover:text-base-content"
					>
						✕ Clear
					</button>
				{/if}
			</div>

			<div class="flex items-center gap-2">
				<select bind:value={wordTypeFilter} class="select  bg-base-100 text-sm">
					<option value="all">ทุกประเภทคำ</option>
					<option value="native">คำไทยแท้ / คำยืมเดิม</option>
					<option value="loan">คำยืมต่างประเทศ</option>
				</select>

				<button
					on:click={() => (showExplanations = !showExplanations)}
					class="btn btn-sm {showExplanations ? 'btn-accent text-accent-content' : 'btn-outline'} gap-1 text-xs"
				>
					{showExplanations ? 'ซ่อนคำอธิบาย' : 'แสดงคำอธิบาย'}
				</button>
			</div>
		</div>

		<!-- Alphabet Filter Chips -->
		<div class="flex flex-wrap items-center gap-1.5 pt-1">
			<button
				on:click={() => (letterFilter = '')}
				class="badge badge-lg cursor-pointer transition {letterFilter === '' ? 'badge-primary text-primary-content font-bold' : 'badge-ghost text-base-content/70 hover:bg-base-300'}"
			>
				ทั้งหมด
			</button>
			{#each startingLetters as char}
				<button
					on:click={() => (letterFilter = char)}
					class="badge badge-lg cursor-pointer transition font-mono {letterFilter === char ? 'badge-primary text-primary-content font-bold' : 'badge-ghost text-base-content/70 hover:bg-base-300'}"
				>
					{char}
				</button>
			{/each}
		</div>
	</div>

	<!-- Results Info & View Toggle -->
	<div class="flex items-center justify-between mb-4 text-xs text-base-content/70">
		<div>
			พบ <span class="font-bold text-primary">{filteredWords.length}</span> คำ
			{#if filteredWords.length !== wordDatabase.length}
				(จากทั้งหมด {wordDatabase.length} คำ)
				<button on:click={clearFilters} class="text-accent-content underline ml-2 hover:text-base-content">
					ล้างตัวกรอง
				</button>
			{/if}
		</div>

		<div class="flex items-center gap-1 bg-base-200 p-1 rounded-lg border border-base-300">
			<button
				on:click={() => (viewMode = 'card')}
				class="p-1.5 rounded transition {viewMode === 'card' ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}"
				title="มุมมองการ์ด"
			>
				<GridIcon size={16} />
			</button>
			<button
				on:click={() => (viewMode = 'table')}
				class="p-1.5 rounded transition {viewMode === 'table' ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}"
				title="มุมมองตาราง"
			>
				<ListIcon size={16} />
			</button>
		</div>
	</div>

	<!-- Words Display -->
	{#if paginatedWords.length === 0}
		<div class="bg-base-200 p-12 rounded-2xl border border-base-300 text-center my-6">
			<XCircleIcon size={48} class="mx-auto text-error-content/60 mb-3" />
			<h3 class="text-lg font-bold">ไม่พบคำศัพท์ที่ค้นหา</h3>
			<p class="text-xs opacity-70 my-2">ลองค้นหาด้วยคำอื่น หรือกดล้างตัวกรอง</p>
			<button on:click={clearFilters} class="btn btn-outline btn-sm mt-3">ล้างตัวกรอง</button>
		</div>
	{:else if viewMode === 'card'}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each paginatedWords as item}
				<div class="botanical-card card bg-base-200 text-base-content border border-base-300 hover:border-primary/40 transition shadow-lg p-5 rounded-2xl flex flex-col justify-between">
					<div>
						<div class="flex items-center justify-between gap-2 mb-3">
							<span class="badge badge-success text-success-content gap-1.5 font-bold text-base py-3 px-3.5">
								<CheckCircleIcon size={16} />
								{item.correct}
							</span>
							{#if item.isLoanWord}
								<span class="badge badge-ghost text-xs text-base-content/70">คำยืม</span>
							{/if}
						</div>

						<!-- Incorrect spellings with XCircleIcon instead of text -->
						<div class="flex items-start gap-2 text-base mt-3">
							<XCircleIcon size={18} class="text-error-content flex-shrink-0 mt-1" />
							<div class="flex flex-wrap gap-1.5">
								{#each item.incorrect as wrong}
									<span class="badge badge-error text-error-content gap-1 text-base font-mono font-medium py-2.5 px-3">
										{wrong}
									</span>
								{/each}
							</div>
						</div>
					</div>

					{#if showExplanations && item.explanation}
						<div class="mt-4 pt-3 border-t border-base-300 text-sm text-base-content/80 leading-relaxed italic bg-base-300/40 p-3 rounded-lg">
							💡 {item.explanation}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<div class="botanical-card overflow-x-auto bg-base-200 text-base-content rounded-2xl border border-base-300 shadow-xl">
			<table class="table w-full text-base">
				<thead>
					<tr class="bg-base-300/50 text-base-content font-bold text-base">
						<th>คำที่ถูกต้อง</th>
						<th>มักสะกดผิดเป็น</th>
						<th>ประเภท</th>
						{#if showExplanations}<th>คำอธิบาย</th>{/if}
					</tr>
				</thead>
				<tbody>
					{#each paginatedWords as item}
						<tr class="hover:bg-base-300/30 border-b border-base-300">
							<td class="font-bold text-success-content flex items-center gap-1.5 text-base">
								<CheckCircleIcon size={16} />
								{item.correct}
							</td>
							<td>
								<div class="flex flex-wrap gap-1.5">
									{#each item.incorrect as wrong}
										<span class="badge badge-error text-error-content gap-1 text-base font-mono">
											{wrong}
										</span>
									{/each}
								</div>
							</td>
							<td>
								<span class="text-sm text-base-content/70">{item.isLoanWord ? 'คำยืม' : 'คำไทย'}</span>
							</td>
							{#if showExplanations}
								<td class="text-sm text-base-content/80">{item.explanation || '-'}</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	<!-- Pagination -->
	{#if totalPages > 1}
		<div class="flex justify-center items-center gap-2 mt-8">
			<button
				disabled={currentPage === 1}
				on:click={() => (currentPage -= 1)}
				class="btn btn-outline btn-sm"
			>
				<ChevronLeftIcon size={16} />
			</button>
			<span class="text-xs text-base-content/70 font-mono px-3">
				หน้า {currentPage} / {totalPages}
			</span>
			<button
				disabled={currentPage === totalPages}
				on:click={() => (currentPage += 1)}
				class="btn btn-outline btn-sm"
			>
				<ChevronRightIcon size={16} />
			</button>
		</div>
	{/if}
</div>
