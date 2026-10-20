<script lang="ts">
	import { isLower, isUpper } from '#lib/utils/thai-text.js';
	import { createEventDispatcher } from 'svelte';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';

	const dispatch = createEventDispatcher();
	let isShift: boolean = false;
	let pressedKey: string | null = null;

	function type(ridx: number, kidx: number) {
		const letter = isShift ? layout.rowsShifted[ridx][kidx] : layout.rows[ridx][kidx];

		if (letter === '⇧') {
			isShift = !isShift;
			return;
		}

		pressedKey = `${ridx}-${kidx}`;
		setTimeout(() => {
			pressedKey = null;
		}, 100);

		if (isShift) isShift = false;
		dispatch('type', letter);
	}

	const layout = {
		rows: [
			['ภ', 'ถ', 'ุ', 'ึ', 'ค', 'ต', 'จ', 'ข', 'ช', '⬅'],
			['ไ', 'ำ', 'พ', 'ะ', 'ั', 'ี', 'ร', 'น', 'ย', 'บ', 'ล'],
			['ฟ', 'ห', 'ก', 'ด', 'เ', '้', '่', 'า', 'ส', 'ว', 'ง'],
			['⇧', 'ผ', 'ป', 'แ', 'อ', 'ิ', 'ื', 'ท', 'ม', 'ใ', 'ฝ']
		],
		rowsShifted: [
			['ภ', 'ถ', 'ู', 'ึ', 'ค', 'ต', 'จ', 'ข', 'ช', '⬅'],
			['ไ', 'ฎ', 'ฑ', 'ธ', 'ั', '๊', 'ณ', 'น', 'ญ', 'ฐ', 'ล'],
			['ฤ', 'ฆ', 'ฏ', 'โ', 'ฌ', '็', '๋', 'ษ', 'ศ', 'ซ', 'ง'],
			['⇧', 'ผ', 'ป', 'ฉ', 'ฮ', 'ิ', '์', 'ท', 'ฒ', 'ฬ', 'ฝ']
		]
	};
</script>

<div class="flex flex-col gap-1.5 p-2 bg-base-300/50 rounded-2xl border border-white/5 shadow-inner">
	{#each layout.rows as r, ridx}
		<div class="flex flex-row gap-1 w-full justify-center">
			{#each r as key, kidx}
				{@const shiftKey = layout.rowsShifted[ridx][kidx]}
				{@const isPressed = pressedKey === `${ridx}-${kidx}`}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="relative flex-1 min-w-0 h-11 sm:h-12 bg-base-100 rounded-lg shadow-[0_2px_0_rgba(0,0,0,0.2)] flex items-center justify-center cursor-pointer transition-all active:translate-y-0.5 active:shadow-none select-none
                  {key === '⇧' && isShift ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}
                  {isPressed ? 'bg-primary/20 scale-95' : ''}"
					on:click={() => type(ridx, kidx)}
				>
					{#if key === '⇧'}
						<ArrowUpIcon size={18} />
					{:else if key === '⬅'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
					{:else}
						<div class="flex flex-col items-center justify-center pt-1">
							{#if !isShift && key !== shiftKey}
								<span class="absolute top-0.5 right-1 text-[8px] opacity-30 font-bold">
									{shiftKey}
								</span>
							{/if}
							<span
								class="text-lg sm:text-xl font-medium
                        {isUpper(isShift ? shiftKey : key) ? 'translate-y-1' : ''}
                        {isLower(isShift ? shiftKey : key) ? '-translate-y-1' : ''}"
							>
								{isShift ? shiftKey : key}
							</span>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	/* Prevent pull-to-refresh on mobile when typing fast */
	div {
		touch-action: manipulation;
	}
</style>
