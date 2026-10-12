<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowLeftIcon, AwardIcon, GlobeIcon, UserIcon, RefreshCwIcon } from 'svelte-feather-icons';

	interface GlobalEntry {
		name: string;
		score: number;
		created_at: string;
	}

	let globalEntries: GlobalEntry[] = [];
	let globalLoaded = false;
	let globalError = false;

	async function fetchGlobal() {
		globalLoaded = false;
		globalError = false;
		try {
			const res = await fetch('/api/leaderboard/thaimapquiz');
			if (!res.ok) throw new Error('fetch failed');
			const data = await res.json();
			// Sort by score descending
			globalEntries = (data || []).sort((a: GlobalEntry, b: GlobalEntry) => b.score - a.score);
		} catch (e) {
			globalError = true;
		} finally {
			globalLoaded = true;
		}
	}

	onMount(() => {
		fetchGlobal();
	});

	function getRankEmoji(rank: number): string {
		if (rank === 1) return '🥇';
		if (rank === 2) return '🥈';
		if (rank === 3) return '🥉';
		return `#${rank}`;
	}

	function formatDate(iso: string): string {
		try {
			return new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
		} catch {
			return '';
		}
	}
</script>

<svelte:head>
	<title>Code Breaker | ตารางคะแนน — แผนที่ไทย</title>
	<meta name="description" content="ตารางคะแนนสูงสุด เกมแผนที่ไทย แข่งกับผู้เล่นทั่วโลก" />
</svelte:head>

<div class="flex flex-col gap-8 w-full max-w-3xl mx-auto px-4 pb-16 pt-4">
	<!-- Header -->
	<div class="flex flex-col gap-3">
		<a
			href="/puzzles/thaimapquiz"
			class="inline-flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 transition-opacity w-fit"
		>
			<ArrowLeftIcon size="16" />
			กลับไปเล่น
		</a>

		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-3">
				<div class="w-12 h-12 rounded-2xl bg-teal-500/15 border border-primary/30 flex items-center justify-center text-primary shadow-inner">
					<AwardIcon size="24" />
				</div>
				<div>
					<h1 class="text-2xl sm:text-3xl font-black tracking-tight text-base-content">ตารางคะแนน</h1>
					<p class="text-xs sm:text-sm opacity-60 font-semibold">เกมแผนที่ไทย — จังหวัดที่หาได้มากที่สุด</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Global Leaderboard -->
	<section class="flex flex-col gap-4">
		<div class="flex items-center justify-between">
			<h2 class="text-lg sm:text-xl font-black text-base-content flex items-center gap-2">
				<GlobeIcon size="20" class="text-primary" />
				อันดับโลก
			</h2>
			<button
				on:click={fetchGlobal}
				class="btn btn-ghost btn-xs gap-1 opacity-60 hover:opacity-100"
				title="รีโหลดข้อมูล"
			>
				<RefreshCwIcon size="12" />
				รีเฟรช
			</button>
		</div>

		{#if !globalLoaded}
			<div class="flex items-center justify-center py-20 opacity-50">
				<span class="loading loading-dots loading-lg" />
			</div>
		{:else if globalError}
			<div class="flex flex-col items-center gap-3 py-12 opacity-60">
				<span class="text-4xl">⚠️</span>
				<p class="font-bold text-center">ไม่สามารถโหลดข้อมูลได้<br/>ลองรีเฟรชอีกครั้ง</p>
				<button on:click={fetchGlobal} class="btn btn-outline btn-sm gap-2">
					<RefreshCwIcon size="14" /> ลองอีกครั้ง
				</button>
			</div>
		{:else if globalEntries.length === 0}
			<div class="flex flex-col items-center gap-4 py-12 opacity-50">
				<span class="text-5xl">🗺️</span>
				<p class="font-bold text-center">ยังไม่มีคะแนนในระบบ<br/>เป็นคนแรกที่ส่งคะแนน!</p>
				<a href="/puzzles/thaimapquiz" class="btn btn-primary btn-sm">เล่นเลย</a>
			</div>
		{:else}
			<div class="card bg-base-100 text-base-content shadow-xl border border-base-300 overflow-hidden">
				<table class="table w-full">
					<thead>
						<tr class="border-b border-base-300/60 bg-base-100/30 text-xs font-extrabold uppercase tracking-wider opacity-60">
							<th class="py-3 px-4 text-center w-16">อันดับ</th>
							<th class="py-3 px-4 text-left">ชื่อ</th>
							<th class="py-3 px-4 text-right">จังหวัด</th>
							<th class="py-3 px-4 text-right hidden sm:table-cell">วันที่</th>
						</tr>
					</thead>
					<tbody>
						{#each globalEntries as entry, i}
							<tr class="border-b border-base-300/30 last:border-0 transition-colors hover:bg-white/5 {i < 3 ? 'bg-warning/3' : ''}">
								<td class="py-4 px-4 text-center text-xl font-black">
									{getRankEmoji(i + 1)}
								</td>
								<td class="py-4 px-4">
									<div class="flex items-center gap-2">
										<div class="w-7 h-7 rounded-full bg-teal-500/20 border border-primary/30 flex items-center justify-center">
											<UserIcon size="12" class="text-primary" />
										</div>
										<span class="font-extrabold text-sm sm:text-base text-base-content truncate max-w-[140px]">
											{entry.name}
										</span>
									</div>
								</td>
								<td class="py-4 px-4 text-right">
									<span class="font-black font-mono text-lg sm:text-2xl text-primary">
										{entry.score}
									</span>
									<span class="text-xs opacity-50 ml-1 font-bold">จังหวัด</span>
								</td>
								<td class="py-4 px-4 text-right text-xs opacity-50 font-bold hidden sm:table-cell">
									{formatDate(entry.created_at)}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Top 3 summary -->
			{#if globalEntries.length >= 3}
				<div class="grid grid-cols-3 gap-3">
					{#each globalEntries.slice(0, 3) as entry, i}
						<div class="card bg-base-100 text-base-content border border-base-300 shadow-lg">
							<div class="card-body p-4 text-center">
								<p class="text-2xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</p>
								<p class="text-xs font-black text-base-content truncate">{entry.name}</p>
								<p class="text-lg font-black font-mono text-primary">{entry.score}</p>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	</section>

	<!-- Play CTA -->
	<a
		href="/puzzles/thaimapquiz"
		class="btn btn-primary w-full gap-2 font-black text-lg py-4 h-auto rounded-2xl shadow-xl hover:shadow-primary/30 hover:scale-[1.01] transition-all"
	>
		🗺️ เริ่มเล่นเกมใหม่
	</a>
</div>
