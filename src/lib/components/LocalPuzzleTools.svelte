<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import NotebookPen from '@lucide/svelte/icons/notebook-pen';
	import { library, storageMessage, initializeLibrary, updateEntry } from '#lib/progress/local.js';
	let path = $derived(page.url.pathname.replace(/\/$/, '') || '/');
	let available = $derived(/^\/(puzzles|tools|resources)\/.+/.test(path));
	let entry = $derived($library.find((item) => item.path === path));
	let note = $state('');
	let expanded = $state(false);
	let title = () =>
		document.querySelector('main h1')?.textContent?.trim() ||
		document.title.replace(/\s*[·|].*$/, '');
	onMount(initializeLibrary);
	$effect(() => {
		path;
		note = entry?.note ?? '';
	});
</script>

{#if available}<div
		class="local-tools flex flex-wrap items-center gap-2 text-sm mb-4"
		aria-label="Personal puzzle tools"
	>
		<button
			class="btn btn-sm btn-ghost"
			type="button"
			aria-pressed={entry?.favorite ?? false}
			onclick={() => updateEntry(path, title(), { favorite: !entry?.favorite })}
			><Bookmark size={16} fill={entry?.favorite ? 'currentColor' : 'none'} />{entry?.favorite
				? 'บันทึกแล้ว'
				: 'บันทึกไว้เล่น'}</button
		>
		<button
			class="btn btn-sm btn-ghost"
			type="button"
			aria-expanded={expanded}
			onclick={() => (expanded = !expanded)}><NotebookPen size={16} />โน้ต</button
		>
		{#if entry?.status === 'in-progress'}<span class="botanical-muted text-xs"
				>บันทึกความคืบหน้าในเครื่องแล้ว</span
			>{:else if entry?.status === 'solved'}<span class="text-success-content text-xs"
				>แก้สำเร็จแล้ว</span
			>{/if}
		{#if expanded}<label class="w-full text-xs space-y-2"
				><span>โน้ตส่วนตัว / Private notes (this device)</span><textarea
					class="textarea bg-base-100 text-base-content w-full"
					rows="3"
					maxlength="4000"
					bind:value={note}
					oninput={(event) => updateEntry(path, title(), { note: event.currentTarget.value })}
				></textarea></label
			>{/if}
		{#if $storageMessage}<p class="text-error-content text-xs w-full" role="status">
				{$storageMessage}
			</p>{/if}
	</div>{/if}
