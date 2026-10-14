<script lang="ts">
	import {
		KeyIcon,
		RadioIcon,
		GridIcon,
		SlidersIcon,
		RefreshCwIcon,
		HashIcon,
		CpuIcon,
		ColumnsIcon,
		FlagIcon,
		EyeIcon,
		MicIcon
	} from 'svelte-feather-icons';

	const ciphersList = [
		{
			id: 'pigpen',
			name: 'Pigpen Cipher',
			path: '/resources/ciphers/pigpen',
			difficulty: 'Easy',
			badgeColor: 'text-primary',
			icon: GridIcon
		},
		{
			id: 'morse',
			name: 'Morse Code',
			path: '/resources/ciphers/morse',
			difficulty: 'Easy',
			badgeColor: 'text-primary',
			icon: RadioIcon
		},
		{
			id: 'caesar',
			name: 'Caesar Cipher',
			path: '/resources/ciphers/caesar',
			difficulty: 'Easy - Medium',
			badgeColor: 'text-primary',
			icon: SlidersIcon
		},
		{
			id: 'atbash',
			name: 'Atbash Cipher',
			path: '/resources/ciphers/atbash',
			difficulty: 'Easy - Medium',
			badgeColor: 'text-primary',
			icon: RefreshCwIcon
		},
		{
			id: 'vigenere',
			name: 'Vigenère Cipher',
			path: '/resources/ciphers/vigenere',
			difficulty: 'Medium - Advanced',
			badgeColor: 'text-amber-400',
			icon: KeyIcon
		},
		{
			id: 'semaphore',
			name: 'Flag Semaphore',
			path: '/resources/ciphers/semaphore',
			difficulty: 'Easy - Medium',
			badgeColor: 'text-primary',
			icon: FlagIcon
		},
		{
			id: 'braille',
			name: 'Braille Code',
			path: '/resources/ciphers/braille',
			difficulty: 'Easy - Medium',
			badgeColor: 'text-primary',
			icon: EyeIcon
		},
		{
			id: 'nato',
			name: 'NATO Alphabet',
			path: '/resources/ciphers/nato',
			difficulty: 'Easy',
			badgeColor: 'text-primary',
			icon: MicIcon
		},
		{
			id: 'a1z26',
			name: 'A1Z26 Cipher',
			path: '/resources/ciphers/a1z26',
			difficulty: 'Easy',
			badgeColor: 'text-primary',
			icon: HashIcon
		},
		{
			id: 'polybius',
			name: 'Polybius Square',
			path: '/resources/ciphers/polybius',
			difficulty: 'Easy',
			badgeColor: 'text-primary',
			icon: GridIcon
		},
		{
			id: 'railfence',
			name: 'Rail Fence Cipher',
			path: '/resources/ciphers/railfence',
			difficulty: 'Easy - Medium',
			badgeColor: 'text-primary',
			icon: ColumnsIcon
		},
		{
			id: 'binary',
			name: 'Binary Code',
			path: '/resources/ciphers/binary',
			difficulty: 'Easy',
			badgeColor: 'text-primary',
			icon: CpuIcon
		}
	];
</script>

<svelte:head>
	<title>Code Breaker | คลังรหัสลับ (Cipher Library) 🔐</title>
	<meta
		name="description"
		content="รวบรวมรหัสลับรูปแบบต่าง ๆ (Pigpen, Morse, Caesar, Atbash, Vigenère, Semaphore, Braille, NATO ฯลฯ)"
	/>
</svelte:head>

<div class="flex flex-col gap-8 w-full max-w-5xl mx-auto px-4 py-8 select-none">
	<!-- Navigation -->
	<div class="flex items-center justify-between">
		<a href="/resources" class="btn btn-ghost btn-xs gap-1.5 font-bold text-base-content/70 hover:text-base-content">
			← กลับไปหน้าแหล่งทรัพยากร
		</a>
	</div>

	<!-- Header -->
	<header class="text-center max-w-2xl mx-auto space-y-2">
		<h1 class="text-3xl lg:text-4xl font-extrabold tracking-tight">คลังรหัสลับ (Cipher Library) 🔐</h1>
		<p class="text-base-content/70 text-sm lg:text-base">
			ศึกษาหลักการเข้ารหัส/ถอดรหัส ตารางอ้างอิง และทดลองใช้เครื่องมือแปลงรหัสสดสำหรับรหัสลับยอดนิยม
		</p>
	</header>

	<!-- Ciphers Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each ciphersList as item}
			<a
				href={item.path}
				class="botanical-card card bg-base-100 text-base-content hover:bg-base-100 text-base-content transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group border border-base-300 shadow-md block rounded-2xl overflow-hidden p-5"
			>
				<div class="flex items-center justify-between mb-3">
					<div
						class="w-12 h-12 rounded-2xl bg-base-100 text-base-content shadow-inner flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-base-300"
					>
						<svelte:component this={item.icon} size="24" class={item.badgeColor} />
					</div>
					<span class="badge badge-sm badge-outline border-base-300 text-base-content/70 font-bold">
						{item.difficulty}
					</span>
				</div>
				<h2 class="text-lg font-bold text-base-content group-hover:text-primary transition-colors">
					{item.name}
				</h2>
			</a>
		{/each}
	</div>
</div>
