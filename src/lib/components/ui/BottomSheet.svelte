<script lang="ts">
	import type { Snippet } from 'svelte';
	let { open = $bindable(false), title, children }: { open?: boolean; title: string; children: Snippet } = $props();
	let dialog: HTMLDialogElement;
	$effect(() => {
		if (open) dialog?.showModal();
		else dialog?.close();
	});
</script>

<dialog bind:this={dialog} class="modal modal-bottom" aria-label={title} onclose={() => open = false}>
	<div class="modal-box bg-base-100 text-base-content border border-base-300 rounded-t-3xl max-h-[80dvh] text-left pb-[max(1.5rem,env(safe-area-inset-bottom))]">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-xl font-bold">{title}</h2>
			<button type="button" class="btn btn-ghost btn-circle" aria-label="ปิดเมนู" onclick={() => open = false}>✕</button>
		</div>
		{@render children()}
	</div>
	<form method="dialog" class="modal-backdrop"><button aria-label="ปิดเมนู">ปิด</button></form>
</dialog>
