<script lang="ts">
	export let url: string = '';
	export let title: string;
	export let description: string;
	export let imgUrl: string = '';
	export let imgUrlPrefix: string = 'https://raw.githubusercontent.com/lemononmars/codebreaker/main/src/lib/images/product/';
	export let price: number | null = null;
	export let shipping: number | null = null;
	export let badge: string = '';
	export let category: string = '';
	export let isComingSoon: boolean = false;
</script>

{#if isComingSoon}
	<div
		class="group flex flex-col justify-between bg-base-100 text-base-content border border-dashed border-base-300 hover:border-base-300 rounded-2xl p-5 sm:p-6 shadow-md transition-all duration-300 h-full"
	>
		<div class="space-y-3">
			<div class="flex items-center justify-between gap-2">
				<span class="badge badge-warning text-warning-content font-bold text-xs py-1">
					{badge || 'Coming Soon'}
				</span>
				{#if category}
					<span class="badge badge-outline text-base-content/70 text-xs py-1">
						{category}
					</span>
				{/if}
			</div>
			<div>
				<h3 class="text-base sm:text-lg font-bold text-base-content/70 line-clamp-1 mb-1.5">
					{title}
				</h3>
				<p class="text-xs sm:text-sm text-base-content/70 font-light line-clamp-3 leading-relaxed">
					{description}
				</p>
			</div>
		</div>

		<div class="pt-4 mt-4 border-t border-base-300 flex items-center justify-between text-xs">
			<span class="inline-flex items-center gap-1.5 text-warning-content font-medium bg-warning px-2.5 py-1 rounded-full border border-amber-800/40">
				<span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
				<span>เร็ว ๆ นี้</span>
			</span>
			<span class="text-base-content/70 font-normal">รอติดตามประกาศ</span>
		</div>
	</div>
{:else}
	<a
		href="/shop/{url}"
		class="group flex flex-col bg-base-100 text-base-content hover:bg-base-100 text-base-content border border-base-300 hover:border-primary/30 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full"
	>
		<div class="relative w-full h-48 sm:h-56 shrink-0 overflow-hidden bg-base-100 text-base-content border-b border-base-300">
			<img
				src={imgUrl.startsWith('http') || imgUrl.startsWith('/') ? imgUrl : imgUrlPrefix + imgUrl}
				alt={title}
				class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
			/>
			<div class="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
				{#if badge}
					<span class="badge badge-accent text-accent-content font-bold shadow-md text-xs py-1">
						{badge}
					</span>
				{/if}
				{#if category}
					<span class="badge badge-outline bg-base-100 text-base-content text-base-content/70 backdrop-blur-sm text-xs py-1">
						{category}
					</span>
				{/if}
			</div>
		</div>
		<div class="flex flex-col justify-between flex-1 p-4 sm:p-5 gap-3">
			<div>
				<h3 class="text-base sm:text-lg font-bold text-base-content group-hover:text-primary transition-colors line-clamp-1 mb-1">
					{title}
				</h3>
				<p class="text-xs sm:text-sm text-base-content/70 font-light line-clamp-2">
					{description}
				</p>
			</div>
			<div class="mt-auto pt-3 border-t border-base-300 flex items-center justify-between">
				<div class="flex flex-col">
					{#if price !== null}
						<div class="flex items-baseline gap-1.5">
							<span class="text-lg font-extrabold text-primary">฿{price}</span>
							{#if shipping !== null}
								<span class="text-[11px] text-base-content/70 font-normal">(ค่าส่ง ฿{shipping})</span>
							{/if}
						</div>
					{/if}
				</div>
				<div class="flex items-center text-xs font-semibold text-primary group-hover:text-primary">
					<span>ดูรายละเอียด</span>
					<span class="ml-1 transform group-hover:translate-x-1 transition-transform">→</span>
				</div>
			</div>
		</div>
	</a>
{/if}
