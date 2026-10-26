<script lang="ts">
import UiArrowRight from '@lucide/svelte/icons/arrow-right';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
import ZapIcon from '@lucide/svelte/icons/zap';
import AwardIcon from '@lucide/svelte/icons/award';
</script>

<svelte:head>
	<title>Chi Fun | Deduction Games 🧩</title>
	<meta
		name="description"
		content="เกมนิรนัยทายกฎลับ"
	/>
</svelte:head>

<div class="flex flex-col gap-10 w-full max-w-4xl mx-auto px-4 py-8 select-none">
	<!-- Navigation -->
	<div class="flex items-center justify-between">
		<a href="/puzzles" class="btn btn-ghost btn-xs gap-1.5 font-bold text-base-content/70 hover:text-base-content">
			<ArrowLeftIcon size={14} />
			<span>กลับไปหน้า Puzzles</span>
		</a>
	</div>

	<!-- Header -->
	<header class="text-center max-w-2xl mx-auto space-y-3">
		<div class="w-14 h-14 rounded-2xl bg-purple-500/10 text-secondary flex items-center justify-center border border-purple-500/20 mx-auto shadow-lg shadow-purple-500/5">
			<ZapIcon size={32} />
		</div>
		<h1 class="text-3xl lg:text-5xl font-black tracking-tight text-primary">
			Deduction Games
		</h1>
		<p class="text-base-content/70 text-sm lg:text-base leading-relaxed">
			สังเกตรูปแบบเพื่อสืบหากฎลับ
		</p>
	</header>

	<!-- Game Selection Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		<!-- Petals Around the Rose -->
		<a
			href="/puzzles/deduction/petalsaroundtherose"
			class="botanical-card bg-base-100 text-base-content border border-base-300 hover:border-rose-500/50 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group"
		>
			<div class="space-y-4">
				<div class="w-12 h-12 rounded-2xl bg-rose-500/10 text-error-content flex items-center justify-center border border-rose-500/20 shadow-md">
					<AwardIcon size={24} />
				</div>
				<div class="space-y-1">
					<span class="badge bg-rose-500/20 text-error-content border border-rose-500/40 text-xs px-2.5 py-0.5 font-bold rounded-lg">
						GAME 1
					</span>
					<h2 class="text-xl font-black text-base-content group-hover:text-error-content transition-colors">
						กลีบรอบกุหลาบ
					</h2>
					<p class="text-xs text-base-content/70 font-light leading-relaxed">
						ทายตัวเลขจากหน้าลูกเต๋า
					</p>
				</div>
			</div>
			<div class="btn btn-rose btn-sm bg-primary hover:bg-primary/90 text-primary-content font-bold rounded-xl border-none w-full shadow-lg">
				เล่นเลย <UiArrowRight size={16} class="inline-block align-middle" aria-hidden="true" />
			</div>
		</a>

		<!-- หมู ไก่ ปลา กุ้ง -->
		<a
			href="/puzzles/deduction/moogaiplakung"
			class="botanical-card bg-base-100 text-base-content border border-base-300 hover:border-indigo-500/50 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group"
		>
			<div class="space-y-4">
				<div class="w-12 h-12 rounded-2xl bg-indigo-500/10 text-primary flex items-center justify-center border border-indigo-500/20 shadow-md">
					<ZapIcon size={24} />
				</div>
				<div class="space-y-1">
					<span class="badge bg-indigo-500/20 text-primary border border-indigo-500/40 text-xs px-2.5 py-0.5 font-bold rounded-lg">
						GAME 2
					</span>
					<h2 class="text-xl font-black text-base-content group-hover:text-primary transition-colors">
						หมู ไก่ ปลา กุ้ง
					</h2>
					<p class="text-xs text-base-content/70 font-light leading-relaxed">
						ทายราคาสินค้า
					</p>
				</div>
			</div>
			<div class="btn btn-indigo btn-sm bg-primary hover:bg-primary/90 text-primary-content font-bold rounded-xl border-none w-full shadow-lg">
				เล่นเลย <UiArrowRight size={16} class="inline-block align-middle" aria-hidden="true" />
			</div>
		</a>

		<!-- Around the World -->
		<a
			href="/puzzles/deduction/aroundtheworld"
			class="botanical-card bg-base-100 text-base-content border border-base-300 hover:border-primary/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group"
		>
			<div class="space-y-4">
				<div class="w-12 h-12 rounded-2xl bg-cyan-500/10 text-primary flex items-center justify-center border border-primary/30 shadow-md">
					<ZapIcon size={24} />
				</div>
				<div class="space-y-1">
					<span class="badge bg-cyan-500/20 text-primary border border-primary/30 text-xs px-2.5 py-0.5 font-bold rounded-lg">
						GAME 3
					</span>
					<h2 class="text-xl font-black text-base-content group-hover:text-primary transition-colors">
						Around the World
					</h2>
					<p class="text-xs text-base-content/70 font-light leading-relaxed">
						เดินทางรอบโลก
					</p>
				</div>
			</div>
			<div class="btn btn-cyan btn-sm bg-cyan-500 hover:bg-cyan-400 text-base-content/70 font-bold rounded-xl border-none w-full shadow-lg">
				เล่นเลย <UiArrowRight size={16} class="inline-block align-middle" aria-hidden="true" />
			</div>
		</a>

		<!-- Back to the Future -->
		<a
			href="/puzzles/deduction/backtothefuture"
			class="botanical-card bg-base-100 text-base-content border border-base-300 hover:border-amber-500/50 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group"
		>
			<div class="space-y-4">
				<div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-warning-content flex items-center justify-center border border-amber-500/20 shadow-md">
					<ZapIcon size={24} />
				</div>
				<div class="space-y-1">
					<span class="badge bg-amber-500/20 text-warning-content border border-amber-500/40 text-xs px-2.5 py-0.5 font-bold rounded-lg">
						GAME 4
					</span>
					<h2 class="text-xl font-black text-base-content group-hover:text-warning-content transition-colors">
						Back to the Future
					</h2>
					<p class="text-xs text-base-content/70 font-light leading-relaxed">
						นิ้วนี้เลขอะไร
					</p>
				</div>
			</div>
			<div class="btn btn-amber btn-sm bg-primary hover:bg-primary/90 text-primary-content font-bold rounded-xl border-none w-full shadow-lg">
				เล่นเลย <UiArrowRight size={16} class="inline-block align-middle" aria-hidden="true" />
			</div>
		</a>
	</div>
</div>
