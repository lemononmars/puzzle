<script lang="ts">
	import { seedColors, leafColors, type Avatar } from '#lib/games/demonDiceAvatar.js';
	let { avatar = $bindable(), disabled = false }: { avatar: Avatar; disabled?: boolean } = $props();
</script>

<div class="picker">
	{#each ['seed', 'leaves'] as part}
		<fieldset {disabled}>
			<legend>{part === 'seed' ? 'Seed' : 'Leaves'}</legend>
			<div class="choices">
				{#each Object.entries(part === 'seed' ? seedColors : leafColors) as [name, color]}
					<button
						type="button"
						class="choice"
						class:chosen={avatar[part as 'seed' | 'leaves'] === name}
						aria-label={`${part === 'seed' ? 'Seed' : 'Leaves'}: ${name}`}
						aria-pressed={avatar[part as 'seed' | 'leaves'] === name}
						title={name}
						onclick={() => {
							avatar = { ...avatar, [part]: name };
						}}
					>
						<span class="dot" style:background={color}></span>
					</button>
				{/each}
			</div>
		</fieldset>
	{/each}
	<fieldset {disabled}>
		<legend>Accessory</legend>
		<div class="choices">
			{#each ['none', 'flower', 'bow'] as accessory}
				<button
					type="button"
					class="choice"
					class:chosen={avatar.accessory === accessory}
					aria-label={`Accessory: ${accessory}`}
					aria-pressed={avatar.accessory === accessory}
					title={accessory}
					onclick={() => {
						avatar = { ...avatar, accessory: accessory as Avatar['accessory'] };
					}}
				>
					<svg
						width="25"
						height="25"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.6"
						aria-hidden="true"
					>
						{#if accessory === 'none'}<circle cx="12" cy="12" r="8" /><path d="m6 18 12-12" />
						{:else if accessory === 'flower'}<path
								d="M12 8C4-2 0 12 8 12-2 20 12 24 12 16c8 10 14-4 4-4 10-8-4-14-4-4Z"
							/><circle cx="12" cy="12" r="2" />
						{:else}<path d="M10 10 3 6v12l7-4m4-4 7-4v12l-7-4" /><rect
								x="9"
								y="9"
								width="6"
								height="6"
								rx="2"
							/>{/if}
					</svg>
				</button>
			{/each}
		</div>
	</fieldset>
</div>

<style>
	.picker {
		display: grid;
		gap: 1rem;
	}
	fieldset {
		border: 0;
		padding: 0;
		min-width: 0;
	}
	legend {
		font-size: 0.85rem;
		margin-bottom: 0.4rem;
	}
	.choices {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}
	.choice {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: 2px solid transparent;
		background: var(--color-base-200);
		color: var(--color-base-content);
		cursor: pointer;
	}
	.choice.chosen {
		border-color: var(--color-primary);
		box-shadow: 0 0 0 2px var(--color-base-100) inset;
	}
	.choice:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 3px;
	}
	.choice:disabled {
		opacity: 0.5;
		cursor: default;
	}
	.dot {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		border: 1px solid #0003;
	}
</style>
