<script lang="ts">
	import RadioIcon from '@lucide/svelte/icons/radio';
import UserIcon from '@lucide/svelte/icons/user';
import MonitorIcon from '@lucide/svelte/icons/monitor';
</script>

<svelte:head>
	<title>Code Breaker | Quiz Button</title>
	<meta name="description" content="ระบบปุ่มกดแย่งกันตอบสำหรับแข่งตอบคำถาม" />
</svelte:head>

<div class="container mx-auto px-4 py-12 max-w-2xl">
	<div class="text-center mb-10">
		<div class="inline-flex items-center justify-center p-4 bg-primary/10 text-primary rounded-full mb-4">
			<RadioIcon size={40} />
		</div>
		<h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Quiz Button</h1>
		<p class="text-base-content/70">เลือกรอบการทำงาน: ผู้ควบคุมเกม (Host) หรือ ผู้เล่น (Player)</p>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto">
		<a href="/tools/button/host" class="card bg-base-200 hover:bg-base-300 transition-all hover:scale-105 shadow-xl border border-base-content/10">
			<div class="card-body items-center text-center p-8">
				<MonitorIcon size={48} class="text-accent-content mb-3" />
				<h2 class="card-title text-2xl font-bold">Host</h2>
				<p class="text-sm text-base-content/60">สำหรับผู้คุมเกม คุมการเปิด-ปิดปุ่มและตรวจคำตอบ</p>
				<div class="card-actions mt-4">
					<button class="btn btn-accent btn-block">เข้าสู่ระบบ Host</button>
				</div>
			</div>
		</a>

		<a href="/tools/button/player" class="card bg-base-200 hover:bg-base-300 transition-all hover:scale-105 shadow-xl border border-base-content/10">
			<div class="card-body items-center text-center p-8">
				<UserIcon size={48} class="text-success-content mb-3" />
				<h2 class="card-title text-2xl font-bold">Player</h2>
				<p class="text-sm text-base-content/60">สำหรับผู้เล่น เข้าร่วมและกดปุ่มแย่งกันตอบ</p>
				<div class="card-actions mt-4">
					<button class="btn btn-success btn-block">เข้าสู่ระบบ Player</button>
				</div>
			</div>
		</a>
	</div>
</div>
