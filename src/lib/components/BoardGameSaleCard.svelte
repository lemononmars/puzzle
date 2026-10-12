<script lang="ts">
	import { availabilityLabels, canInquire, formatPrice, type SaleGame } from '#lib/data/boardGameSale.js';
	let { game, selected, onToggle }: { game: SaleGame; selected: boolean; onToggle: () => void } = $props();
</script>

<article class="botanical-surface flex flex-col text-left gap-4 p-5 {selected ? 'ring-2 ring-primary' : ''}">
	<div class="flex flex-wrap gap-2 items-center">
		<span class="badge {game.availability === 'available' ? 'badge-success text-success-content' : game.availability === 'check' ? 'badge-info text-info-content' : 'bg-base-200 text-base-content border-base-300'}">{availabilityLabels[game.availability]}</span>
		{#if game.listing > 1}<span class="text-xs botanical-muted">รายการ {game.listing}</span>{/if}
	</div>
	<h2 class="text-xl font-bold leading-snug">{game.title}</h2>
	<p class="text-primary font-bold text-xl">{formatPrice(game.price)}</p>
	<dl class="text-sm space-y-3">
		{#if game.condition}<div><dt class="botanical-muted">การใช้งานตามรายการ</dt><dd>{game.condition}</dd></div>{/if}
		{#if game.addOns}<div><dt class="botanical-muted">Expansion / Add-on</dt><dd class="leading-relaxed">{game.addOns}</dd></div>{/if}
		{#if game.note}<div class="bg-warning text-warning-content rounded-xl p-3"><dt class="font-bold">หมายเหตุ</dt><dd>{game.note}</dd></div>{/if}
	</dl>
	<button type="button" aria-pressed={selected} aria-label={`${selected ? 'เอาออก' : 'เลือก'} ${game.title}${game.listing > 1 ? ` รายการ ${game.listing}` : ''}`} disabled={!canInquire(game)} onclick={onToggle}
		class="btn mt-auto w-full {selected ? 'btn-primary text-primary-content' : 'btn-outline text-base-content'}">
		{!canInquire(game) ? availabilityLabels[game.availability] : selected ? '✓ เลือกแล้ว · เอาออก' : 'เลือกไว้สอบถาม'}
	</button>
</article>
