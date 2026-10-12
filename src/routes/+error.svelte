

<script lang="ts">
	import { AlertTriangleIcon } from 'svelte-feather-icons';
	import { page } from '$app/state';
	let error = $derived(page.error);
	let status = $derived(page.status);
</script>

<svelte:head><title>{status} | Error</title></svelte:head>

<div
	class="min-h-[70vh] flex items-center justify-center px-4"
>
	<div
		class="max-w-md w-full text-center space-y-8 p-10 bg-base-100 text-base-content rounded-3xl shadow-2xl border border-white/5"
	>
		<div class="relative">
			<div
				class="absolute inset-0 bg-error/20 blur-3xl rounded-full"
			></div>

			<div class="relative flex justify-center text-error-content"><AlertTriangleIcon size="80" strokeWidth={1.5} /></div>
		</div>

		<div class="space-y-4 relative">
			<h1 class="text-6xl font-black text-base-content">{status}</h1>
			<p class="text-xl text-primary font-medium">หน้านี้ไม่มีอยู่จริงนะ</p>
			<p class="text-base-content/60 text-sm italic">"{error?.message}"</p>
		</div>

		<div class="pt-6">
			<a
				href="/"
				class="btn btn-primary btn-wide rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
			>
				กลับหน้าหลัก
			</a>
		</div>
	</div>
</div>
