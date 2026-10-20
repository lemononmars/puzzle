<script lang="ts">
	let { showLibraryLink = true }: { showLibraryLink?: boolean } = $props();
	import {
		storageMessage,
		exportBackup,
		importBackup,
		resetAllProgress
	} from '#lib/progress/local.js';
	let message = $state('');
	let confirm = $state(false);
	let needsReload = $state(false);
	function download() {
		try {
			const blob = new Blob([exportBackup()], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = 'puzzle-progress-backup.json';
			link.click();
			setTimeout(() => URL.revokeObjectURL(url), 1000);
			message = 'ดาวน์โหลดไฟล์สำรองแล้ว';
		} catch {
			message = 'ไม่สามารถส่งออกข้อมูลได้';
		}
	}
	async function restore(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		try {
			const file = input.files?.[0];
			if (!file) return;
			if (file.size > 5000000) throw new Error('Maximum backup size is 5 MB.');
			const count = importBackup(await file.text());
			needsReload = true;
			message = `Restored ${count} records. Reload any open puzzle to resume.`;
		} catch (error) {
			message = error instanceof Error ? error.message : 'Could not restore backup.';
		} finally {
			input.value = '';
		}
	}
</script>

<section
	class="mt-5 pt-5 border-t border-base-300 space-y-3 text-left"
	aria-label="Local puzzle data"
>
	<h3 class="font-bold">ความคืบหน้าและรายการโปรด</h3>
	<p class="text-xs botanical-muted">เก็บเฉพาะในเบราว์เซอร์นี้ ไม่มีบัญชีหรือการซิงก์ข้ามเครื่อง</p>
	{#if showLibraryLink}<a href="/library" class="btn btn-sm btn-outline"
			>My puzzles / ปริศนาของฉัน</a
		>{/if}
	<div class="flex flex-wrap gap-2">
		<button type="button" class="btn btn-sm btn-outline" onclick={download}>Export backup</button
		><label class="btn btn-sm btn-outline"
			>Import backup<input
				type="file"
				accept="application/json,.json"
				class="sr-only"
				onchange={restore}
			/></label
		><button
			type="button"
			class="btn btn-sm btn-ghost text-error-content"
			onclick={() => (confirm = !confirm)}>Reset local progress</button
		>
	</div>
	{#if confirm}<div class="bg-error text-error-content rounded-xl p-3 text-sm space-y-2">
			<p>ล้างรายการโปรด โน้ต เกมที่บันทึก และประวัติคำตอบในเครื่องนี้? ชื่อผู้เล่นจะยังอยู่</p>
			<button
				type="button"
				class="btn btn-sm btn-error text-error-content"
				onclick={() => {
					try {
						resetAllProgress();
						needsReload = true;
						message = 'Local progress cleared. Reload open puzzles to start fresh.';
					} catch {
						message = 'Could not clear local storage.';
					}
					confirm = false;
				}}>Clear puzzle data</button
			><button type="button" class="btn btn-sm btn-ghost" onclick={() => (confirm = false)}
				>Cancel</button
			>
		</div>{/if}
	{#if needsReload}<button
			type="button"
			class="btn btn-sm btn-primary text-primary-content"
			onclick={() => window.location.reload()}>Reload to apply</button
		>{/if}
	<p role="status" class="text-xs">{message || $storageMessage}</p>
</section>
