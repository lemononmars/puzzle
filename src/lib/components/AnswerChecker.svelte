<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value: string | number = '';
	export let placeholder: string = 'พิมพ์คำตอบที่นี่...';
	export let type: 'text' | 'number' = 'text';
	export let buttonText: string = 'ตอบ';
	export let btnClass: string = 'btn-primary text-primary-content';
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
				class:botanical-answer-input={true}
				class="join-item input  border border-base-300 focus:border-primary flex-1 min-w-0 font-medium bg-base-100 text-base-content placeholder:text-base-content/60
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
				class:botanical-answer-input={true}
				class="join-item input  border border-base-300 focus:border-primary flex-1 min-w-0 font-medium bg-base-100 text-base-content placeholder:text-base-content/60
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
