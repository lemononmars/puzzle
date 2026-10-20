<script lang="ts">
	import type { IContent } from '#lib/interfaces/index.js';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import { dateToThaiString } from '#lib/utils/date.js';

	export let content: IContent;
</script>

<div class="w-full flex items-center justify-between gap-3 py-1">
	<a
		href="/puzzles/{content.type}"
		class="p-2 rounded-xl bg-base-100 text-base-content border border-base-300 text-base-content/70 hover:text-base-content hover:border-primary/30 transition-all shrink-0 flex items-center justify-center"
		title="กลับไปหน้ารายการปริศนา"
	>
		<ChevronLeftIcon size={20} />
	</a>

	<h1 class="text-xl sm:text-2xl font-black tracking-tight text-base-content text-center flex-1 truncate px-2">
		{content.title}
	</h1>

	<!-- Right balance spacer for exact title centering -->
	<div class="w-9 shrink-0"></div>
</div>

{#if content.date || (content.tags && content.tags.length > 0)}
	<div class="flex flex-wrap items-center justify-center gap-2 text-xs text-base-content/70 mt-1">
		{#if content.date}
			<span>วันที่ {dateToThaiString(content.date)}</span>
		{/if}

		{#if content.tags && content.tags.length > 0}
			<div class="flex flex-wrap gap-1">
				{#each content.tags as t}
					<a href="/puzzles/{content.type}?tag={t}" class="px-2 py-0.5 rounded-md bg-base-100 text-base-content border border-base-300 text-base-content/70 text-[10px]">
						{t}
					</a>
				{/each}
			</div>
		{/if}
	</div>
{/if}
