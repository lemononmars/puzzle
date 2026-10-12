

<script lang="ts">
import { puzzleHunts as defaultPuzzleHunts } from '#lib/data/puzzles/puzzlehunt/index.js';
export let data: any;


	import { dateToThaiString } from '#lib/utils/date.js';
	import type { IPuzzleHunt } from '#lib/interfaces/index.js';
	import { CalendarIcon, LayersIcon } from 'svelte-feather-icons';

	let puzzleHunts: IPuzzleHunt[] = data.puzzleHunts ?? (defaultPuzzleHunts);

	function getHuntIcon(title: string) {
		const t = (title || '').toLowerCase();
		if (t.includes('night')) {
			return `<svg class="w-10 h-10 text-primary group-hover:text-primary transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
				<path d="M15 5l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5z"></path>
			</svg>`;
		}
		if (t.includes('gadget')) {
			return `<svg class="w-10 h-10 text-primary group-hover:text-primary transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<rect x="4" y="4" width="16" height="16" rx="2"></rect>
				<rect x="9" y="9" width="6" height="6"></rect>
				<line x1="9" y1="1" x2="9" y2="4"></line>
				<line x1="15" y1="1" x2="15" y2="4"></line>
				<line x1="9" y1="20" x2="9" y2="23"></line>
				<line x1="15" y1="20" x2="15" y2="23"></line>
				<line x1="20" y1="9" x2="23" y2="9"></line>
				<line x1="20" y1="15" x2="23" y2="15"></line>
				<line x1="1" y1="9" x2="4" y2="9"></line>
				<line x1="1" y1="15" x2="4" y2="15"></line>
			</svg>`;
		}
		if (t.includes('secret') || t.includes('agent')) {
			return `<svg class="w-10 h-10 text-primary group-hover:text-primary transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
				<circle cx="12" cy="11" r="3"></circle>
			</svg>`;
		}
		if (t.includes('halloween') || t.includes('04')) {
			return `<svg class="w-10 h-10 text-primary group-hover:text-primary transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 2v3"></path>
				<path d="M12 5c-4.5 0-8 3-8 7.5S7.5 20 12 20s8-3 8-7.5S16.5 5 12 5z"></path>
				<path d="M12 5c-2 0-3.5 3-3.5 7.5s1.5 7.5 3.5 7.5 3.5-3 3.5-7.5S14 5 12 5z"></path>
				<polygon points="8.5,10.5 10,12 8.5,12" fill="currentColor"></polygon>
				<polygon points="15.5,10.5 14,12 15.5,12" fill="currentColor"></polygon>
				<path d="M8.5 16l1.5-1.5 1 1 1-1 1.5 1.5"></path>
			</svg>`;
		}
		if (t.includes('time') || t.includes('travel')) {
			return `<svg class="w-10 h-10 text-primary group-hover:text-primary transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="12" r="10"></circle>
				<polyline points="12 6 12 12 16 14"></polyline>
				<path d="M12 2v2M12 20v2M2 12h2M20 12h2"></path>
			</svg>`;
		}
		return `<svg class="w-10 h-10 text-primary group-hover:text-primary transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="12" cy="12" r="10"></circle>
			<polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
		</svg>`;
	}

$: ({ puzzleHunts } = data);
</script>

<svelte:head>
	<title>Code Breaker | Puzzle Hunts</title>
</svelte:head>

<div class="container mx-auto px-4 py-6 flex flex-col gap-8 max-w-5xl">
	<!-- Centered Header -->
	<div class="text-center mb-2">
		<h1 class="text-3xl lg:text-5xl font-extrabold tracking-tight text-primary bg-gradient-to-r from-base-200 to-base-200">
			Puzzle Hunts
		</h1>
		<p class="text-base-content/70 text-sm sm:text-base mt-2">ชุดปริศนาต่อเนื่องที่รวมมิติมินิเกมและปริศนาหลายด่าน</p>
	</div>

	<!-- 2-Column Grid with dark cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
		{#each puzzleHunts || [] as ph (ph.id)}
			<a
				href="/puzzles/puzzlehunt/{ph.id}"
				class="card bg-base-100 text-base-content hover:bg-base-100 text-base-content border border-base-300 hover:border-primary/30 shadow-xl transition-all duration-300 hover:-translate-y-1 block h-full group rounded-2xl overflow-hidden"
			>
				<div class="card-body flex flex-col items-center text-center gap-4 p-6">
					<div class="w-20 h-20 rounded-2xl bg-base-100 text-base-content text-primary flex items-center justify-center p-3 shadow-inner border border-base-300 group-hover:scale-110 transition-all duration-300">
						{@html getHuntIcon(ph.title)}
					</div>

					<div class="flex flex-col gap-2 flex-1 items-center">
						<h2 class="card-title text-xl font-bold tracking-wide text-base-content group-hover:text-primary transition-colors duration-200 justify-center">
							{ph.title}
						</h2>

						<div class="flex flex-wrap items-center justify-center gap-4 text-xs text-base-content/70 font-medium">
							{#if ph.date}
								<div class="flex items-center gap-1.5">
									<CalendarIcon size="14" class="text-primary" />
									<span>{dateToThaiString(ph.date)}</span>
								</div>
							{/if}

							{#if ph.puzzles}
								<div class="flex items-center gap-1.5 text-primary font-bold">
									<LayersIcon size="14" />
									<span>{ph.puzzles.length} ปริศนา</span>
								</div>
							{/if}
						</div>

						{#if ph.tags && ph.tags.length > 0}
							<div class="flex flex-wrap gap-1.5 justify-center mt-2">
								{#each ph.tags as t}
									<span class="px-2 py-0.5 text-[10px] rounded-md bg-base-100 text-base-content text-base-content/70 border border-base-300 font-mono">
										{t}
									</span>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
