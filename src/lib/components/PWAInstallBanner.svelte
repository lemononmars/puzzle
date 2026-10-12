<script lang="ts">
	import { onMount } from 'svelte';
	import { DownloadIcon, XIcon, CheckCircleIcon } from 'svelte-feather-icons';
	import logo from '#lib/images/logo.png';

	let deferredPrompt: any = null;
	let showBanner = false;
	let isInstalled = false;

	onMount(() => {
		if (typeof window === 'undefined') return;

		// Check if already in standalone mode
		if (
			window.matchMedia('(display-mode: standalone)').matches ||
			(window.navigator as any).standalone === true
		) {
			isInstalled = true;
			return;
		}

		// Check if user dismissed recently (within 7 days)
		const lastDismissed = localStorage.getItem('cb_pwa_install_dismissed');
		if (lastDismissed) {
			const timeDiff = Date.now() - parseInt(lastDismissed, 10);
			if (timeDiff < 7 * 24 * 60 * 60 * 1000) {
				return;
			}
		}

		const handleBeforeInstall = (e: Event) => {
			e.preventDefault();
			deferredPrompt = e;
			showBanner = true;
		};

		const handleAppInstalled = () => {
			showBanner = false;
			deferredPrompt = null;
			isInstalled = true;
		};

		window.addEventListener('beforeinstallprompt', handleBeforeInstall);
		window.addEventListener('appinstalled', handleAppInstalled);

		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
			window.removeEventListener('appinstalled', handleAppInstalled);
		};
	});

	async function handleInstall() {
		if (!deferredPrompt) return;
		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === 'accepted') {
			showBanner = false;
		}
		deferredPrompt = null;
	}

	function handleDismiss() {
		showBanner = false;
		if (typeof window !== 'undefined') {
			localStorage.setItem('cb_pwa_install_dismissed', Date.now().toString());
		}
	}
</script>

{#if showBanner && !isInstalled}
	<div
		class="fixed bottom-16 lg:bottom-6 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-bounce-in"
	>
		<div
			class="bg-base-100 text-base-content backdrop-blur-md border border-primary/30 rounded-2xl p-4 shadow-2xl shadow-emerald-950/50 flex flex-col gap-3 text-base-content/70"
		>
			<div class="flex items-start justify-between gap-3">
				<div class="flex items-center gap-3">
					<img src={logo} alt="Code Breaker" class="w-11 h-11 rounded-xl shadow-md border border-base-300 shrink-0" />
					<div class="flex flex-col">
						<h4 class="font-extrabold text-sm text-base-content">ติดตั้งแอป Code Breaker</h4>
						<p class="text-xs text-base-content/70">เข้าถึงได้ทันทีจากหน้าจอหลัก พร้อมเล่นออฟไลน์</p>
					</div>
				</div>
				<button
					class="btn btn-ghost btn-xs btn-circle text-base-content/70 hover:text-base-content"
					on:click={handleDismiss}
					title="ปิด"
				>
					<XIcon size="16" />
				</button>
			</div>

			<div class="flex items-center justify-end gap-2 pt-1 border-t border-base-300">
				<button class="btn btn-ghost btn-xs text-base-content/70 hover:text-base-content" on:click={handleDismiss}>
					ไว้คราวหลัง
				</button>
				<button
					class="btn btn-primary btn-sm gap-1.5 text-primary-content font-bold shadow-md shadow-emerald-900/30"
					on:click={handleInstall}
				>
					<DownloadIcon size="14" />
					<span>ติดตั้งเลย</span>
				</button>
			</div>
		</div>
	</div>
{/if}
