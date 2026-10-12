<script lang="ts">
	export let type: string;
	export let title: string = '';
	export let description: string = '';
	export let icon: string = '';
	export let href: string = '';
	export const colorClass: string = 'text-primary';

	$: targetHref = href || `/puzzles/${type}`;
	$: displayTitle = title || (type === 'spellingquiz' ? 'Spelling Quiz' : type === 'thaimapquiz' ? 'Thai Map Quiz' : type === 'crossroad' ? 'Crossroad (ศัพท์สี่ทิศ)' : type);
</script>

<a
	href={targetHref}
	target={href.startsWith('http') ? '_blank' : undefined}
	rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
	class="botanical-link-card group overflow-hidden"
>
	<div class="card-body flex flex-row items-center text-left gap-4 p-4 sm:p-6">
		{#if icon}
			<div class="w-12 h-12 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-base-100 text-base-content flex items-center justify-center p-2 sm:p-3 shadow-inner border border-base-300 group-hover:scale-110 transition-transform">
				{@html icon}
			</div>
		{/if}
		<div class="flex flex-col gap-1 flex-1 min-w-0">
			<h3 class="card-title text-base sm:text-xl font-bold capitalize text-base-content group-hover:text-primary transition-colors line-clamp-1">
				{displayTitle}
			</h3>
			{#if description}
				<p class="text-xs sm:text-sm text-base-content/70 font-light line-clamp-2">{description}</p>
			{/if}
		</div>
	</div>
</a>
