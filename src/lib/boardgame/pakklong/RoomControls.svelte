<script lang="ts">
	import { selfInfo } from '../stores/self.js';
	import GameIcon from './GameIcon.svelte';
	export let roomID: string;
	export let showHelp = true;
	let settings: HTMLDialogElement;
</script>

<section class="room-controls" aria-label="Room controls">
	<span class="room-code">Room <strong>{roomID}</strong></span>
	<div class="room-buttons">
		<a
			class="btn btn-sm btn-ghost tooltip"
			data-tip="Rulebook"
			href="/boardgame/pakklongboard/rules"
			target="_blank"
			rel="noopener"
			aria-label="Open rulebook"><GameIcon name="book" /></a
		>
		<button
			class="btn btn-sm btn-ghost tooltip"
			data-tip="Room settings"
			aria-label="Room settings"
			onclick={() => settings.showModal()}><GameIcon name="settings" /></button
		>
		<a
			class="btn btn-sm btn-outline tooltip"
			data-tip="Leave room"
			href="/boardgame/pakklongboard"
			aria-label="Leave room"><GameIcon name="leave" /></a
		>
	</div>
</section>
<dialog bind:this={settings} class="modal" aria-labelledby="room-settings-heading">
	<div class="modal-box bg-base-100 text-base-content text-left">
		<h2 id="room-settings-heading">Room settings</h2>
		<p class="botanical-muted mb-4">Room {roomID} · {$selfInfo.username}</p>
		<label class="flex items-center justify-between gap-6"
			>Show play tips<input
				class="toggle toggle-primary"
				type="checkbox"
				bind:checked={showHelp}
			/></label
		>
		<form method="dialog" class="modal-action"><button class="btn btn-primary">Done</button></form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button aria-label="Close room settings">Close</button>
	</form>
</dialog>
