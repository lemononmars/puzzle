<script lang="ts">
	export let genre: string = 'slither';
	export const width: number = 5;
	export const height: number = 5;
	export let title: string = '';
	export let thumbnail: string | undefined = undefined;
	export let url: string = '';

	$: cleanGenre = (genre || '').toLowerCase();

	function getPreviewUrl(urlStr: string): string {
		if (!urlStr) return '';
		if (urlStr.includes('/p?')) {
			return urlStr.replace('/p?', '/pv?');
		}
		return urlStr;
	}
</script>

<div class="relative w-full h-full bg-base-100 text-base-content flex items-center justify-center select-none overflow-hidden">
	{#if thumbnail}
		<img
			src={thumbnail}
			alt={title}
			class="w-full h-full object-contain mx-auto group-hover:scale-105 transition-transform duration-300"
		/>
	{:else if url}
		<img
			src={getPreviewUrl(url)}
			alt={title}
			class="w-full h-full object-contain bg-white mx-auto group-hover:scale-105 transition-transform duration-300"
			loading="lazy"
		/>
	{:else if cleanGenre === 'slither'}
		<!-- Slitherlink Centered SVG Thumbnail -->
		<svg class="w-28 h-28 mx-auto text-primary group-hover:scale-105 transition-transform duration-300" viewBox="0 0 100 100" fill="none">
			<!-- Background Grid -->
			<rect x="10" y="10" width="80" height="80" fill="#090d16" rx="6" />
			<!-- Grid dots (5x5 grid intersections) -->
			{#each [20, 35, 50, 65, 80] as x}
				{#each [20, 35, 50, 65, 80] as y}
					<circle cx={x} cy={y} r="2.2" fill="#64748b" />
				{/each}
			{/each}
			<!-- Numbers in cells -->
			<text x="27.5" y="32" font-size="12" font-weight="900" text-anchor="middle" fill="#38bdf8">3</text>
			<text x="42.5" y="32" font-size="12" font-weight="900" text-anchor="middle" fill="#38bdf8">2</text>
			<text x="27.5" y="47" font-size="12" font-weight="900" text-anchor="middle" fill="#38bdf8">1</text>
			<text x="57.5" y="47" font-size="12" font-weight="900" text-anchor="middle" fill="#38bdf8">3</text>
			<!-- Centered Loop Line Path -->
			<path
				d="M 20 20 L 50 20 L 50 35 L 65 35 L 65 65 L 35 65 L 35 35 L 20 35 Z"
				stroke="#10b981"
				stroke-width="3.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if cleanGenre === 'sudoku'}
		<!-- Sudoku Centered SVG Thumbnail -->
		<svg class="w-28 h-28 mx-auto text-sky-400 group-hover:scale-105 transition-transform duration-300" viewBox="0 0 100 100" fill="none">
			<rect x="10" y="10" width="80" height="80" fill="#090d16" stroke="#334155" stroke-width="2" rx="6" />
			<!-- 3x3 Subgrid lines -->
			<line x1="36.6" y1="10" x2="36.6" y2="90" stroke="#38bdf8" stroke-width="2" />
			<line x1="63.3" y1="10" x2="63.3" y2="90" stroke="#38bdf8" stroke-width="2" />
			<line x1="10" y1="36.6" x2="90" y2="36.6" stroke="#38bdf8" stroke-width="2" />
			<line x1="10" y1="63.3" x2="90" y2="63.3" stroke="#38bdf8" stroke-width="2" />
			<!-- Inner cell lines -->
			<line x1="18.8" y1="10" x2="18.8" y2="90" stroke="#1e293b" stroke-width="1" />
			<line x1="27.7" y1="10" x2="27.7" y2="90" stroke="#1e293b" stroke-width="1" />
			<line x1="45.5" y1="10" x2="45.5" y2="90" stroke="#1e293b" stroke-width="1" />
			<line x1="54.4" y1="10" x2="54.4" y2="90" stroke="#1e293b" stroke-width="1" />
			<!-- Cell Numbers -->
			<text x="23" y="30" font-size="14" font-weight="900" fill="#38bdf8" text-anchor="middle">5</text>
			<text x="50" y="30" font-size="14" font-weight="900" fill="#94a3b8" text-anchor="middle">3</text>
			<text x="77" y="57" font-size="14" font-weight="900" fill="#38bdf8" text-anchor="middle">7</text>
			<text x="23" y="84" font-size="14" font-weight="900" fill="#94a3b8" text-anchor="middle">1</text>
		</svg>
	{:else if cleanGenre === 'masyu'}
		<!-- Masyu Centered SVG Thumbnail -->
		<svg class="w-28 h-28 mx-auto text-purple-400 group-hover:scale-105 transition-transform duration-300" viewBox="0 0 100 100" fill="none">
			<rect x="10" y="10" width="80" height="80" fill="#090d16" stroke="#334155" stroke-width="1.5" rx="6" />
			<!-- Grid lines -->
			<line x1="30" y1="10" x2="30" y2="90" stroke="#1e293b" stroke-width="1" />
			<line x1="50" y1="10" x2="50" y2="90" stroke="#1e293b" stroke-width="1" />
			<line x1="70" y1="10" x2="70" y2="90" stroke="#1e293b" stroke-width="1" />
			<line x1="10" y1="30" x2="90" y2="30" stroke="#1e293b" stroke-width="1" />
			<line x1="10" y1="50" x2="90" y2="50" stroke="#1e293b" stroke-width="1" />
			<line x1="10" y1="70" x2="90" y2="70" stroke="#1e293b" stroke-width="1" />
			<!-- White and Black Pearls -->
			<circle cx="30" cy="30" r="7" fill="#f8fafc" stroke="#0f172a" stroke-width="2" />
			<circle cx="70" cy="70" r="7" fill="#0f172a" stroke="#f8fafc" stroke-width="2" />
			<!-- Loop Line -->
			<path d="M 30 70 L 30 30 L 70 30 L 70 70 Z" stroke="#c084fc" stroke-width="3.5" stroke-linejoin="round" />
		</svg>
	{:else if cleanGenre === 'akari'}
		<!-- Akari Centered SVG Thumbnail -->
		<svg class="w-28 h-28 mx-auto text-yellow-400 group-hover:scale-105 transition-transform duration-300" viewBox="0 0 100 100" fill="none">
			<rect x="10" y="10" width="80" height="80" fill="#090d16" stroke="#334155" stroke-width="1.5" rx="6" />
			<!-- Wall cell -->
			<rect x="40" y="40" width="20" height="20" fill="#1e293b" stroke="#475569" />
			<text x="50" y="55" font-size="12" font-weight="900" fill="#f8fafc" text-anchor="middle">2</text>
			<!-- Light Bulb -->
			<circle cx="25" cy="25" r="7" fill="#facc15" />
			<path d="M 25 10 L 25 40 M 10 25 L 40 25" stroke="#fef08a" stroke-width="2" opacity="0.6" />
		</svg>
	{:else}
		<!-- Default Centered Grid SVG Thumbnail -->
		<svg class="w-28 h-28 mx-auto text-purple-400 group-hover:scale-105 transition-transform duration-300" viewBox="0 0 100 100" fill="none">
			<rect x="15" y="15" width="70" height="70" fill="#090d16" stroke="#475569" stroke-width="2" rx="6" />
			<line x1="38" y1="15" x2="38" y2="85" stroke="#334155" stroke-width="1.5" />
			<line x1="61" y1="15" x2="61" y2="85" stroke="#334155" stroke-width="1.5" />
			<line x1="15" y1="38" x2="85" y2="38" stroke="#334155" stroke-width="1.5" />
			<line x1="15" y1="61" x2="85" y2="61" stroke="#334155" stroke-width="1.5" />
			<circle cx="38" cy="38" r="5" fill="#a855f7" />
			<circle cx="61" cy="61" r="5" fill="#a855f7" />
		</svg>
	{/if}
</div>
