<script lang="ts">
	import { onMount } from 'svelte';
	import { WifiOffIcon, WifiIcon } from 'svelte-feather-icons';

	let isOnline = true;
	let showRestoredBanner = false;
	let timeoutId: any = null;

	onMount(() => {
		if (typeof window === 'undefined') return;

		isOnline = navigator.onLine;

		const handleOnline = () => {
			isOnline = true;
			showRestoredBanner = true;
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				showRestoredBanner = false;
			}, 3500);
		};

		const handleOffline = () => {
			isOnline = false;
			showRestoredBanner = false;
		};

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
			clearTimeout(timeoutId);
		};
	});
</script>

{#if !isOnline}
	<div
		class="fixed top-2 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full bg-warning border border-amber-500/50 text-warning-content text-xs font-bold shadow-xl backdrop-blur-md flex items-center gap-2 animate-pulse"
	>
		<WifiOffIcon size="14" />
		<span>โหมดออฟไลน์ (Offline) - ปริศนาที่โหลดไว้ยังเล่นได้ตามปกติ</span>
	</div>
{:else if showRestoredBanner}
	<div
		class="fixed top-2 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full bg-base-300 text-base-content border border-primary/30 text-primary text-xs font-bold shadow-xl backdrop-blur-md flex items-center gap-2"
	>
		<WifiIcon size="14" />
		<span>เชื่อมต่ออินเทอร์เน็ตแล้ว</span>
	</div>
{/if}
