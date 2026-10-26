

<script lang="ts">
import { staticLogicPuzzles } from '#lib/data/puzzles/logicpuzzle.js';
export let data: any;


	import { onMount } from 'svelte';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
import BookOpenIcon from '@lucide/svelte/icons/book-open';
import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
import GridIcon from '@lucide/svelte/icons/grid-2x2';
import PlayIcon from '@lucide/svelte/icons/play';
import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
import SearchIcon from '@lucide/svelte/icons/search';
import SlidersIcon from '@lucide/svelte/icons/sliders-horizontal';
import XIcon from '@lucide/svelte/icons/x';
import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import type { ILogicPuzzle } from '#lib/interfaces/index.js';
	import LogicPuzzleThumbnail from '#lib/components/LogicPuzzleThumbnail.svelte';

	let initialPuzzles: (ILogicPuzzle & { thumbnail?: string })[] = data.initialPuzzles ?? (staticLogicPuzzles);
	let puzzles: (ILogicPuzzle & { thumbnail?: string })[] = initialPuzzles;
	let loading = false;

	// Filter state
	let searchQuery = '';
	let selectedGenre = 'all';
	let selectedDifficulty = 'all';
	let selectedSize = 'all';
	let sortBy = 'newest';

	// Pagination state
	let currentPage = 1;
	let pageSize = 12;
	$: totalPages = Math.max(1, Math.ceil(filteredPuzzles.length / pageSize));
	$: paginatedPuzzles = filteredPuzzles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	$: if (searchQuery || selectedGenre || selectedDifficulty || selectedSize || sortBy) {
		currentPage = 1;
	}

	// Interactive Player Modal State
	let activePuzzleModal: (ILogicPuzzle & { thumbnail?: string }) | null = null;

	onMount(async () => {
		if (puzzles.length === 0) {
			try {
				loading = true;
				const res = await fetch('/api/puzzle/logicpuzzle');
				if (res.ok) {
					const data = await res.json();
					if (Array.isArray(data) && data.length > 0) {
						puzzles = data;
					} else {
						puzzles = staticLogicPuzzles;
					}
				} else {
					puzzles = staticLogicPuzzles;
				}
			} catch (err) {
				console.warn('Error loading logic puzzles:', err);
				puzzles = staticLogicPuzzles;
			} finally {
				loading = false;
			}
		}
	});

	// Convert pzpr puzzle URL (e.g. /p?slither/5/5/...) to pv preview URL (e.g. /pv?slither/5/5/...)
	function getPreviewUrl(url: string): string {
		if (!url) return '';
		if (url.includes('/p?')) {
			return url.replace('/p?', '/pv?');
		}
		return url;
	}

	// Filtered & Sorted puzzles
	$: filteredPuzzles = puzzles
		.filter((p) => {
			const titleClean = p.title.toLowerCase();
			const genreClean = p.genre.toLowerCase();
			const query = searchQuery.toLowerCase();

			const matchSearch =
				searchQuery === '' ||
				titleClean.includes(query) ||
				genreClean.includes(query) ||
				(p.author && p.author.toLowerCase().includes(query));

			const matchGenre = selectedGenre === 'all' || genreClean === selectedGenre.toLowerCase();

			const matchDiff =
				selectedDifficulty === 'all' || p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

			const maxDim = Math.max(p.width || 0, p.height || 0);
			const matchSize =
				selectedSize === 'all' ||
				(selectedSize === 'small' && maxDim <= 5) ||
				(selectedSize === 'medium' && maxDim >= 6 && maxDim <= 10) ||
				(selectedSize === 'large' && maxDim > 10);

			return matchSearch && matchGenre && matchDiff && matchSize;
		})
		.sort((a, b) => {
			if (sortBy === 'newest') {
				return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
			} else if (sortBy === 'oldest') {
				return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
			} else if (sortBy === 'difficulty') {
				const map: Record<string, number> = { easy: 1, medium: 2, hard: 3, expert: 4 };
				return (map[a.difficulty.toLowerCase()] || 0) - (map[b.difficulty.toLowerCase()] || 0);
			} else if (sortBy === 'title') {
				return a.title.localeCompare(b.title);
			}
			return 0;
		});

	// Reset all filters
	function resetFilters() {
		searchQuery = '';
		selectedGenre = 'all';
		selectedDifficulty = 'all';
		selectedSize = 'all';
		sortBy = 'newest';
	}

$: ({ initialPuzzles } = data);
</script>

<svelte:head>
	<title>Chi Fun | Logic Puzzles Collection 🧩</title>
	<meta
		name="description"
		content="Collection of logic puzzles (Slitherlink, Sudoku, Masyu, Akari) with search, filter, and online player"
	/>
</svelte:head>

<div class="flex flex-col gap-8 w-full max-w-6xl mx-auto px-4 py-8 select-none">
	<!-- Navigation -->
	<div class="flex items-center justify-between">
		<a href="/puzzles" class="btn btn-ghost btn-xs gap-1.5 font-bold text-base-content/70 hover:text-base-content">
			<ArrowLeftIcon size={14} />
			<span>Back to Puzzles</span>
		</a>
		<a
			href="/resources/logictutorial"
			class="btn btn-ghost btn-xs gap-1.5 text-warning-content hover:bg-amber-500/10 font-bold"
		>
			<BookOpenIcon size={14} />
			<span>Tutorials & Guides</span>
		</a>
	</div>

	<!-- Header -->
	<header class="text-center max-w-3xl mx-auto space-y-3">
		<div
			class="w-16 h-16 rounded-2xl bg-purple-500/10 text-secondary flex items-center justify-center border border-purple-500/20 mx-auto shadow-lg shadow-purple-500/5"
		>
			<GridIcon size={36} />
		</div>
		<h1 class="text-3xl lg:text-4xl font-black tracking-tight text-base-content">
			Logic Puzzles
		</h1>
		<p class="text-base-content/70 text-sm lg:text-base leading-relaxed">
			Interactive pencil & paper logic puzzles. Filter by genre, size, or difficulty.
		</p>
	</header>

	<!-- Filters & Search Controls (puzsq style) -->
	<section class="botanical-card bg-base-100 text-base-content p-5 rounded-3xl border border-base-300 shadow-xl space-y-5">
		<!-- Search & Sort Bar -->
		<div class="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
			<!-- Search Input -->
			<div class="relative flex-1">
				<div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/70">
					<SearchIcon size={18} />
				</div>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search title, genre (Slitherlink, Sudoku...), author..."
					class="input  w-full pl-10 bg-base-100 text-base-content border-base-300 text-sm text-base-content focus:border-purple-500 transition-all rounded-xl"
				/>
				{#if searchQuery}
					<button
						on:click={() => (searchQuery = '')}
						class="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/70 hover:text-base-content/70"
					>
						<XIcon size={16} />
					</button>
				{/if}
			</div>

			<!-- Sort Dropdown -->
			<div class="flex items-center gap-2">
				<span class="text-xs text-base-content/70 whitespace-nowrap font-medium">Sort:</span>
				<select
					bind:value={sortBy}
					class="select select-sm bg-base-100 text-base-content border-base-300 text-xs font-semibold text-base-content rounded-xl focus:border-purple-500"
				>
					<option value="newest">Newest</option>
					<option value="oldest">Oldest</option>
					<option value="difficulty">Difficulty</option>
					<option value="title">Title (A-Z)</option>
				</select>
			</div>
		</div>

		<!-- Filter Selectors -->
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-base-300">
			<!-- Genre Filter -->
			<div class="space-y-1">
				<label for="genre-filter-select" class="text-xs font-bold text-base-content/70">Genre</label>
				<select
					id="genre-filter-select"
					bind:value={selectedGenre}
					class="select select-sm w-full bg-base-100 text-base-content border-base-300 text-xs font-medium text-base-content rounded-xl focus:border-purple-500"
				>
					<option value="all">All Genres</option>
					<option value="slither">Slitherlink</option>
					<option value="sudoku">Sudoku</option>
					<option value="masyu">Masyu</option>
					<option value="akari">Akari</option>
					<option value="nurikabe">Nurikabe</option>
					<option value="nonogram">Nonogram</option>
				</select>
			</div>

			<!-- Difficulty Filter -->
			<div class="space-y-1">
				<label for="difficulty-filter-select" class="text-xs font-bold text-base-content/70">Difficulty</label>
				<select
					id="difficulty-filter-select"
					bind:value={selectedDifficulty}
					class="select select-sm w-full bg-base-100 text-base-content border-base-300 text-xs font-medium text-base-content rounded-xl focus:border-purple-500"
				>
					<option value="all">All Difficulties</option>
					<option value="easy">Easy</option>
					<option value="medium">Medium</option>
					<option value="hard">Hard</option>
					<option value="expert">Expert</option>
				</select>
			</div>

			<!-- Size Filter -->
			<div class="space-y-1">
				<label for="size-filter-select" class="text-xs font-bold text-base-content/70">Grid Size</label>
				<select
					id="size-filter-select"
					bind:value={selectedSize}
					class="select select-sm w-full bg-base-100 text-base-content border-base-300 text-xs font-medium text-base-content rounded-xl focus:border-purple-500"
				>
					<option value="all">All Sizes</option>
					<option value="small">Small (≤ 5x5)</option>
					<option value="medium">Medium (6x6 - 10x10)</option>
					<option value="large">Large (> 10x10)</option>
				</select>
			</div>
		</div>

		<!-- Filter Summary Bar -->
		<div class="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs">
			<div class="flex items-center gap-2 text-base-content/70">
				<SlidersIcon size={14} class="text-secondary" />
				<span>Puzzles found: <strong class="text-secondary font-extrabold">{filteredPuzzles.length}</strong></span>
			</div>

			{#if selectedGenre !== 'all' || selectedDifficulty !== 'all' || selectedSize !== 'all' || searchQuery}
				<button
					on:click={resetFilters}
					class="btn btn-ghost btn-xs text-xs text-base-content/70 hover:text-error-content gap-1"
				>
					<RefreshCwIcon size={12} />
					<span>Reset Filters</span>
				</button>
			{/if}
		</div>
	</section>

	<!-- Puzzle List Grid (Extracted Live Thumbnail from link, ONLY Title and Size, NO tags/subtitles) -->
	<section class="space-y-4">
		{#if filteredPuzzles.length === 0}
			<div class="bg-base-100 text-base-content p-12 rounded-3xl border border-base-300 text-center space-y-3">
				<div class="text-4xl">🔍</div>
				<h3 class="text-lg font-bold text-base-content">No puzzles found matching filters</h3>
				<button on:click={resetFilters} class="btn btn-primary btn-sm rounded-xl font-bold mt-2">
					Reset Filters
				</button>
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each paginatedPuzzles as puzzle (puzzle.id)}
					<div
						class="botanical-card bg-base-100 text-base-content border border-base-300 hover:border-purple-500/50 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group"
					>
						<!-- Card Top: Extracted Live Preview from Link -->
						<div class="relative w-full h-48 bg-base-100 text-base-content flex items-center justify-center overflow-hidden border-b border-base-300">
							<LogicPuzzleThumbnail
								genre={puzzle.genre}
								width={puzzle.width}
								height={puzzle.height}
								title={puzzle.title}
								thumbnail={puzzle.thumbnail}
								url={puzzle.url}
							/>
						</div>

						<!-- Card Content: ONLY Title and Size (NO tags / subtitles) -->
						<div class="p-5 flex-1 flex flex-col justify-between space-y-4">
							<div class="space-y-1">
								<!-- Title -->
								<h3 class="text-lg font-bold text-base-content group-hover:text-secondary transition-colors">
									{puzzle.title}
								</h3>
								<!-- Size & Author -->
								<div class="flex items-center justify-between text-xs font-semibold text-base-content/70">
									{#if puzzle.width && puzzle.height}
										<span>Size: {puzzle.width} × {puzzle.height}</span>
									{/if}
									{#if puzzle.author}
										<span>By: {puzzle.author}</span>
									{/if}
								</div>
							</div>

							<!-- Action Buttons -->
							<div class="grid grid-cols-2 gap-2 pt-2">
								<button
									on:click={() => (activePuzzleModal = puzzle)}
									class="btn btn-primary btn-sm rounded-xl font-bold gap-1 text-xs shadow-md shadow-purple-500/10"
								>
									<PlayIcon size={14} />
									<span>Play</span>
								</button>
								<a
									href={puzzle.url}
									target="_blank"
									rel="noopener noreferrer"
									class="btn btn-outline btn-sm rounded-xl font-bold gap-1 text-xs border-base-300 text-base-content/70 hover:bg-base-100 text-base-content hover:text-base-content"
								>
									<ExternalLinkIcon size={13} />
									<span>Open Tab</span>
								</a>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Pagination Bar -->
			{#if totalPages > 1}
				<div class="flex items-center justify-between pt-6 border-t border-base-300 text-xs sm:text-sm font-medium text-base-content/70 flex-wrap gap-4">
					<span>Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredPuzzles.length)} of {filteredPuzzles.length} puzzles</span>
					<div class="flex items-center gap-2">
						<button
							class="btn btn-sm bg-base-100 text-base-content border-base-300 text-base-content/70 hover:border-purple-500 disabled:opacity-40 rounded-xl"
							disabled={currentPage === 1}
							on:click={() => (currentPage -= 1)}
						>
							<ChevronLeftIcon size={16} />
							<span>Previous</span>
						</button>
						<span class="px-3.5 py-1.5 bg-base-100 text-base-content border border-base-300 rounded-xl font-mono font-bold text-secondary text-xs">
							{currentPage} / {totalPages}
						</span>
						<button
							class="btn btn-sm bg-base-100 text-base-content border-base-300 text-base-content/70 hover:border-purple-500 disabled:opacity-40 rounded-xl"
							disabled={currentPage >= totalPages}
							on:click={() => (currentPage += 1)}
						>
							<span>Next</span>
							<ChevronRightIcon size={16} />
						</button>
					</div>
				</div>
			{/if}
		{/if}
	</section>
</div>

<!-- Interactive Puzzle Player Modal -->
{#if activePuzzleModal}
	<div class="fixed inset-0 z-[9999] pt-16 lg:pt-20 flex items-center justify-center p-2 sm:p-4 bg-base-100 text-base-content backdrop-blur-md animate-fade-in select-none">
		<div class="botanical-card bg-base-100 text-base-content border border-base-300 rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
			<!-- Modal Header -->
			<div class="flex items-center justify-between p-3.5 px-6 border-b border-base-300 bg-base-100 text-base-content shrink-0">
				<div class="flex items-center gap-3">
					<div class="w-9 h-9 rounded-xl bg-purple-500/20 text-secondary flex items-center justify-center border border-purple-500/30">
						<GridIcon size={20} />
					</div>
					<div>
						<h3 class="text-base font-bold text-base-content leading-tight">
							{activePuzzleModal.title}
						</h3>
						<span class="text-xs text-base-content/70 font-semibold">
							Size: {activePuzzleModal.width} × {activePuzzleModal.height}
						</span>
					</div>
				</div>
				<div class="flex items-center gap-2">
					<a
						href={activePuzzleModal.url}
						target="_blank"
						rel="noopener noreferrer"
						class="btn btn-ghost btn-xs text-base-content/70 hover:text-base-content gap-1"
					>
						<ExternalLinkIcon size={14} />
						<span class="hidden sm:inline">Open External</span>
					</a>
					<button
						on:click={() => (activePuzzleModal = null)}
						class="btn btn-circle btn-ghost btn-xs text-base-content/70 hover:text-base-content"
					>
						<XIcon size={20} />
					</button>
				</div>
			</div>

			<!-- Modal Body (Iframe Player) -->
			<div class="flex-1 bg-white relative w-full h-full overflow-hidden">
				<iframe
					src={activePuzzleModal.url}
					title={activePuzzleModal.title}
					class="w-full h-full border-0"
					allowfullscreen
				></iframe>
			</div>
		</div>
	</div>
{/if}
