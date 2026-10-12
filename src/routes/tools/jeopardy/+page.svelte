<script lang="ts">
	import { AwardIcon, MonitorIcon, UserIcon, TvIcon } from 'svelte-feather-icons';

	let roomId: string = '101';
</script>

<svelte:head>
	<title>Code Breaker | Jeopardy Quiz</title>
	<meta name="description" content="ระบบแข่งตอบคำถาม Jeopardy พร้อมระบบให้คะแนน และ Host / Player / Audience Sync" />
</svelte:head>

<div class="container mx-auto px-4 py-12 max-w-3xl">
	<div class="text-center mb-10">
		<div class="inline-flex items-center justify-center p-4 bg-amber-500/10 text-warning-content rounded-full mb-4">
			<AwardIcon size="44" />
		</div>
		<h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3 text-primary bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
			Jeopardy Quiz
		</h1>
		<p class="text-base-content/70 text-lg">
			ระบบแข่งตอบคำถามสด พร้อม Real-time Scoring & Sync ระหว่าง Host, Player และ Audience
		</p>
	</div>

	<div class="card bg-base-200 shadow-xl border border-base-content/10 max-w-md mx-auto mb-8 p-6">
		<label class="flex flex-col gap-2 w-full">
			<div class="label">
				<span class="text-sm font-bold text-lg">Room ID / รหัสห้องแข่งขัน</span>
			</div>
			<input
				type="text"
				bind:value={roomId}
				placeholder="เช่น 101, room1"
				class="input  input-primary text-center text-2xl font-bold tracking-wider"
			/>
		</label>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		<a
			href="/tools/jeopardy/host/{roomId}"
			class="card bg-base-200 hover:bg-base-300 transition-all hover:scale-105 shadow-xl border border-base-content/10"
		>
			<div class="card-body items-center text-center p-6">
				<MonitorIcon size="40" class="text-accent-content mb-2" />
				<h2 class="card-title text-xl font-bold">Host</h2>
				<p class="text-xs text-base-content/60">ควบคุมเกม ให้/ลบคะแนน ปลดล็อคปุ่ม</p>
				<button class="btn btn-accent btn-sm btn-block mt-4">เข้าสู่ Host ({roomId})</button>
			</div>
		</a>

		<a
			href="/tools/jeopardy/player/{roomId}"
			class="card bg-base-200 hover:bg-base-300 transition-all hover:scale-105 shadow-xl border border-base-content/10"
		>
			<div class="card-body items-center text-center p-6">
				<UserIcon size="40" class="text-success-content mb-2" />
				<h2 class="card-title text-xl font-bold">Player</h2>
				<p class="text-xs text-base-content/60">กดปุ่มแย่งตอบ ส่งคะแนนเดิมพัน และคำตอบ</p>
				<button class="btn btn-success btn-sm btn-block mt-4">เข้าสู่ Player ({roomId})</button>
			</div>
		</a>

		<a
			href="/tools/jeopardy/audience/{roomId}"
			class="card bg-base-200 hover:bg-base-300 transition-all hover:scale-105 shadow-xl border border-base-content/10"
		>
			<div class="card-body items-center text-center p-6">
				<TvIcon size="40" class="text-info-content mb-2" />
				<h2 class="card-title text-xl font-bold">Audience</h2>
				<p class="text-xs text-base-content/60">จอแสดงผลคะแนนและปุ่มกดสด สำหรับผู้ชม/สตรีม</p>
				<button class="btn btn-info btn-sm btn-block mt-4">เข้าสู่ Audience ({roomId})</button>
			</div>
		</a>
	</div>
</div>
