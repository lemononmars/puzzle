<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value: string | number = '';
	export let placeholder: string = 'พิมพ์คำตอบที่นี่...';
	export let type: 'text' | 'number' = 'text';
	export let buttonText: string = 'ตอบ';
	export let btnClass: string = 'bg-amber-500 hover:bg-amber-400 text-base-content/70';
	export let disabled: boolean = false;
	export let min: number | string | undefined = undefined;
	export let max: number | string | undefined = undefined;
	export let size: 'sm' | 'md' | 'lg' = 'md';

	const dispatch = createEventDispatcher<{ submit: { value: string | number } }>();

	function handleSubmit() {
		if (disabled) return;
		dispatch('submit', { value });
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-2 w-full">
	<div class="join w-full justify-center">
		{#if type === 'number'}
			<input
				type="number"
				bind:value
				{placeholder}
				{disabled}
				{min}
				{max}
				style="background-color: #020617 !important; color: #f8fafc !important;"
				class="join-item input  border border-base-300 focus:border-amber-400 flex-1 font-bold text-base-content/70 placeholder-slate-500
					{size === 'sm' ? 'input-sm text-xs' : ''}
					{size === 'md' ? 'input-md text-sm' : ''}
					{size === 'lg' ? 'input-lg text-base' : ''}"
			/>
		{:else}
			<input
				type="text"
				bind:value
				{placeholder}
				{disabled}
				style="background-color: #020617 !important; color: #f8fafc !important;"
				class="join-item input  border border-base-300 focus:border-amber-400 flex-1 font-bold text-base-content/70 placeholder-slate-500
					{size === 'sm' ? 'input-sm text-xs' : ''}
					{size === 'md' ? 'input-md text-sm' : ''}
					{size === 'lg' ? 'input-lg text-base' : ''}"
			/>
		{/if}
		<button
			type="submit"
			{disabled}
			class="join-item btn border-none font-bold shadow-md shrink-0 {btnClass}
				{size === 'sm' ? 'btn-sm text-xs px-3' : ''}
				{size === 'md' ? 'btn-md text-sm px-5' : ''}
				{size === 'lg' ? 'btn-lg text-base px-6' : ''}"
		>
			{buttonText}
		</button>
	</div>
</form>
