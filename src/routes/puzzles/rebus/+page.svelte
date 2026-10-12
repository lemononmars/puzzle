

<script lang="ts">
export let data: any;


	import { getPuzzleImageURL } from '#lib/supabase.js';
	import type { IRebus } from '#lib/interfaces/index.js';
	let puzzles: IRebus[] = data.puzzles ?? ([]);

$: ({ puzzles } = data);
</script>

<svelte:head>
	<title>Code Breaker | Rebus</title>
	<meta name="description" content="ทายคำจากภาพแทนคำ (Rebus Puzzles) โดย Codebreaker Thailand" />
</svelte:head>

<div class="container mx-auto px-4 py-6 flex flex-col gap-6 max-w-6xl select-none">
	<div class="text-center mb-2">
		<h1 class="text-3xl lg:text-4xl font-extrabold tracking-tight text-base-content">Rebus</h1>
		<p class="text-xs sm:text-sm text-base-content/70 mt-1">ทายคำจากภาพแทนคำ ฝึกไหวพริบและความคิดสร้างสรรค์</p>
	</div>

	<!-- Rebus Cards Grid with Image Thumbnails -->
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
		{#each puzzles as p}
			{@const imgFilename = 'rebus' + ('0' + p.id).slice(-2) + '.png'}
			<a
				href="/puzzles/rebus/{p.id}"
				class="bg-base-100 text-base-content border border-base-300 hover:border-primary/30 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group"
			>
				<!-- Card Top: Rebus Image Thumbnail Preview -->
				<div class="relative w-full h-44 bg-base-100 text-base-content flex items-center justify-center p-3 overflow-hidden border-b border-base-300">
					<img
						src={getPuzzleImageURL('rebus', imgFilename)}
						alt={p.title}
						on:error={(e) => {
							if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.display = 'none';
						}}
						class="w-full h-full object-contain mx-auto group-hover:scale-105 transition-transform duration-300"
					/>
				</div>

				<!-- Card Content -->
				<div class="p-4 flex-1 flex flex-col justify-between">
					<div class="space-y-1">
						<h3 class="text-base font-bold text-base-content group-hover:text-primary transition-colors">
							{p.title}
						</h3>
						{#if p.author}
							<p class="text-xs text-base-content/70">ผู้แต่ง: {p.author}</p>
						{/if}
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
