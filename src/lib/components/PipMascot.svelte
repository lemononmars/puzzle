<script lang="ts">
	let {
		bloom = false,
		smiling = false,
		seedColor = '#bd8766',
		leafColor = 'var(--color-primary)',
		accessory = 'none'
	}: {
		bloom?: boolean;
		smiling?: boolean;
		seedColor?: string;
		leafColor?: string;
		accessory?: 'none' | 'flower' | 'bow';
	} = $props();
</script>

<svg viewBox="0 0 140 155" role="img" aria-label="Pip the seedling"
	><g class="leaves"
		><path d="M70 66Q29 65 22 24q42-9 48 42" fill={leafColor} /><path
			d="M70 61q0-43 44-46 8 43-44 46"
			fill={leafColor}
		/><path
			d="M69 68 42 38m28 26 25-30"
			fill="none"
			stroke="#527344"
			stroke-width="3"
			stroke-linecap="round"
		/></g
	><g class="seed" class:happy={smiling}
		><ellipse cx="52" cy="135" rx="14" ry="7" fill="#82583f" /><ellipse
			cx="88"
			cy="135"
			rx="14"
			ry="7"
			fill="#82583f"
		/><path
			d="M70 54c-30 0-46 26-42 48 4 25 22 37 42 37s38-12 42-37C116 80 100 54 70 54"
			fill={seedColor}
		/><path
			d="M70 59q-12 40 0 74"
			fill="none"
			stroke="#936148"
			stroke-width="2"
			opacity=".4"
		/><ellipse cx="52" cy="91" rx="5" ry={smiling ? 2 : 7} fill="#302e25" /><ellipse
			cx="88"
			cy="91"
			rx="5"
			ry={smiling ? 2 : 7}
			fill="#302e25"
		/><circle cx="53" cy="89" r="1.7" fill="#fff8e9" /><circle
			cx="89"
			cy="89"
			r="1.7"
			fill="#fff8e9"
		/><path
			d={smiling ? 'M55 104q15 22 30 0Z' : 'M61 108q9 9 18 0'}
			fill="none"
			stroke="#553b2a"
			stroke-width="3"
			stroke-linecap="round"
		/><ellipse cx="43" cy="104" rx="7" ry="4" fill="#dc9a7f" /><ellipse
			cx="97"
			cy="104"
			rx="7"
			ry="4"
			fill="#dc9a7f"
		/></g
	>{#if bloom || accessory === 'flower'}<g aria-hidden="true"
			>{#each [0, 60, 120, 180, 240, 300] as angle}<ellipse
					cx="91"
					cy="20"
					rx="7"
					ry="12"
					fill="var(--color-accent)"
					transform={`rotate(${angle} 91 31)`}
				/>{/each}<circle cx="91" cy="31" r="7" fill="#eddf8e" /></g
		>{/if}{#if accessory === 'bow'}<path
			d="m70 65-16-8v16Zm0 0 16-8v16Z"
			fill="var(--color-secondary)"
		/>{/if}</svg
>

<style>
	.seed.happy {
		animation: happy-hop 0.45s ease-in-out 2;
	}
	@keyframes happy-hop {
		50% {
			transform: translateY(-7px) scale(1.04, 0.96);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.seed.happy {
			animation: none;
		}
	}
	svg {
		width: 100%;
		height: 100%;
		overflow: visible;
	}
	.leaves {
		transform-origin: 70px 64px;
		animation: leaves 4s ease-in-out infinite;
	}
	.seed {
		transform-origin: 70px 138px;
		animation: breathe 4s ease-in-out infinite;
	}
	@keyframes leaves {
		50% {
			transform: rotate(7deg);
		}
	}
	@keyframes breathe {
		50% {
			transform: scale(1.025, 0.975);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.leaves,
		.seed {
			animation: none;
		}
	}
</style>
