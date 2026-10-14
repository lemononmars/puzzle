<script lang="ts">
	import TheChaseGame from '#lib/components/TheChaseGame.svelte';
	import { ArrowLeftIcon } from 'svelte-feather-icons';
</script>

<svelte:head>
	<title>The Chase (ผู้ล่าท้าดวล) - Codebreaker Puzzles</title>
	<meta name="description" content="เกมโชว์ตอบคำถามสไตล์ The Chase UK 500 คำถาม 3 ตัวเลือก พร้อมระบบบอร์ด 7 ขั้น และผู้ล่า AI" />
</svelte:head>

<div class="min-h-screen bg-base-100 text-base-content text-base-content/70 pb-20 pt-4 px-3 sm:px-4 selection:bg-amber-500 selection:text-base-content/70">
	<div class="max-w-4xl mx-auto flex flex-col gap-4">

		<!-- Top Navigation Header -->
		<header class="flex items-center justify-between bg-base-100 text-base-content backdrop-blur-md border border-base-300 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 shadow-lg">
			<div class="flex items-center gap-2 sm:gap-3">
				<a
					href="/puzzles"
					class="btn btn-xs sm:btn-sm btn-ghost gap-1 text-base-content/70 hover:text-base-content px-1.5"
					title="กลับหน้า Puzzles"
				>
					<ArrowLeftIcon size="14" />
					<span class="hidden sm:inline text-xs">Puzzles</span>
				</a>
				<div class="h-4 w-px bg-base-100 text-base-content"></div>
				<div class="flex items-center gap-1.5 sm:gap-2">
					<span class="text-lg sm:text-xl">⚡</span>
					<div class="flex items-baseline gap-2">
						<h1 class="text-sm sm:text-base font-black tracking-tight text-primary">
							The Chase (ผู้ล่าท้าดวล)
						</h1>
						<span class="text-[10px] text-base-content/70 font-medium hidden md:inline">• UK Quiz Show 500 ข้อ</span>
					</div>
				</div>
			</div>

		</header>

		<!-- The Chase Game Engine Component -->
		<TheChaseGame />

	</div>
</div>
