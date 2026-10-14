<script lang="ts">
	import { onMount } from 'svelte';
	import { DownloadIcon, CheckCircleIcon } from 'svelte-feather-icons';

	interface InstallPrompt extends Event {
		prompt(): Promise<void>;
		userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
	}
	let prompt = $state<InstallPrompt | null>(null);
	let installed = $state(false);
	let installing = $state(false);
	let message = $state('');
	let ios = $state(false);

	onMount(() => {
		const standalone = window.matchMedia('(display-mode: standalone)');
		const navigator = window.navigator as Navigator & { standalone?: boolean };
		installed = standalone.matches || navigator.standalone === true;
		ios = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
			(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
		const capture = (event: Event) => {
			event.preventDefault();
			if (!installed) prompt = event as InstallPrompt;
			message = '';
		};
		const complete = () => { installed = true; prompt = null; message = ''; };
		const modeChanged = () => { if (standalone.matches) complete(); };
		window.addEventListener('beforeinstallprompt', capture);
		window.addEventListener('appinstalled', complete);
		standalone.addEventListener('change', modeChanged);
		return () => {
			window.removeEventListener('beforeinstallprompt', capture);
			window.removeEventListener('appinstalled', complete);
			standalone.removeEventListener('change', modeChanged);
		};
	});

	async function install() {
		if (!prompt || installing) return;
		const pending = prompt;
		prompt = null;
		installing = true;
		try {
			await pending.prompt();
			const { outcome } = await pending.userChoice;
			message = outcome === 'accepted'
				? 'กำลังติดตั้ง กรุณารอสักครู่'
				: 'ยกเลิกแล้ว คุณยังเพิ่มแอปจากเมนูเบราว์เซอร์ได้';
		} catch {
			message = 'ติดตั้งไม่สำเร็จ ลองใช้เมนูติดตั้งแอปของเบราว์เซอร์';
		} finally {
			installing = false;
		}
	}
</script>

<section class="mt-5 border-t border-base-300 pt-4" aria-labelledby="install-heading">
	<h4 id="install-heading" class="font-bold text-sm">แอป Puzzle</h4>
	<p class="mt-1 text-xs text-base-content/70">เพิ่ม Puzzle บนหน้าจอหลัก เพื่อเปิดเล่นได้สะดวก</p>
	{#if installed}
		<p class="mt-3 flex items-center gap-2 text-sm"><CheckCircleIcon size="16" />ติดตั้งแอปแล้ว</p>
	{:else if prompt || installing}
		<button type="button" onclick={install} disabled={installing} class="btn btn-primary text-primary-content btn-sm mt-3 rounded-xl">
			<DownloadIcon size="16" />{installing ? 'กำลังติดตั้ง…' : 'ติดตั้งแอป'}
		</button>
	{:else}
		<p class="mt-3 rounded-xl bg-base-200 text-base-content p-3 text-xs leading-relaxed">
			{#if ios}เปิดใน Safari แล้วกดแชร์ → เพิ่มไปยังหน้าจอโฮม
			{:else}เปิดเมนูเบราว์เซอร์ → ติดตั้งแอป หรือเพิ่มไปยังหน้าจอหลัก หากไม่มีตัวเลือกนี้ เบราว์เซอร์อาจยังไม่รองรับการติดตั้ง{/if}
		</p>
	{/if}
	<p class="mt-2 text-xs text-base-content/70" role="status">{message}</p>
</section>
