<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowLeftIcon, AwardIcon, GlobeIcon, UserIcon, RefreshCwIcon } from 'svelte-feather-icons';

	interface ScoreEntry {
		type: string;
		typeLabel: string;
		mode: string;
		modeLabel: string;
		modeColor: string;
		score: number;
		key: string;
	}

	interface GlobalEntry {
		name: string;
		score: number;
		created_at: string;
	}

	let scores: ScoreEntry[] = [];
	let loaded = false;

	let globalEntries: GlobalEntry[] = [];
	let globalLoaded = false;
	let globalError = false;

	let activeTab: 'personal' | 'global' = 'personal';

	const typeConfigs = [
		{ key: 'choices', label: 'เลือกคำที่ถูก ✏️', emoji: '✏️' },
		{ key: 'yesno', label: 'ถูกหรือผิด? ❓', emoji: '❓' }
	];

	const modeConfigs = [
		{ key: 'normal', label: 'Normal', icon: '❤️', color: 'text-error-content', bg: 'bg-error/10', border: 'border-error/30' },
		{ key: 'timeattack', label: 'Time Attack', icon: '⚡', color: 'text-warning-content', bg: 'bg-warning/10', border: 'border-warning/30' }
	];

	onMount(() => {
		if (typeof window === 'undefined') return;
		const saved = localStorage.getItem('codebreaker_spelling_highscores');
		const parsed = saved ? JSON.parse(saved) : {};

		const rows: ScoreEntry[] = [];
		for (const t of typeConfigs) {
			for (const m of modeConfigs) {
				const key = `${t.key}_${m.key}`;
				rows.push({
					type: t.key,
					typeLabel: t.label,
					mode: m.key,
					modeLabel: `${m.icon} ${m.label}`,
					modeColor: m.color,
					score: parsed[key] || 0,
					key
				});
			}
		}
		scores = rows;
		loaded = true;
	});

	async function fetchGlobal() {
		globalLoaded = false;
		globalError = false;
		try {
			const res = await fetch('/api/leaderboard/spellingquiz');
			if (!res.ok) throw new Error('fetch failed');
			const data = await res.json();
			globalEntries = (data || []).sort((a: GlobalEntry, b: GlobalEntry) => b.score - a.score);
		} catch (e) {
			globalError = true;
		} finally {
			globalLoaded = true;
		}
	}

	function handleTabChange(tab: 'personal' | 'global') {
		activeTab = tab;
		if (tab === 'global' && !globalLoaded) {
			fetchGlobal();
		}
	}

	$: grouped = typeConfigs.map(t => ({
		...t,
		rows: scores.filter(s => s.type === t.key)
	}));

	function getBestScore(type: string) {
		return Math.max(...scores.filter(s => s.type === type).map(s => s.score), 0);
	}

	function getRank(score: number, allScores: number[]): string {
		if (score === 0) return '—';
		const sorted = [...new Set(allScores)].sort((a, b) => b - a);
		const rank = sorted.indexOf(score) + 1;
		if (rank === 1) return '🥇';
		if (rank === 2) return '🥈';
		if (rank === 3) return '🥉';
		return `#${rank}`;
	}

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
	<title>Code Breaker | ตารางคะแนน — สะกดศัพท์</title>
	<meta name="description" content="ตารางคะแนนสูงสุด เกมสะกดศัพท์ แยกตามวิธีเล่นและโหมด" />
</svelte:head>

<div class="flex flex-col gap-8 w-full max-w-3xl mx-auto px-4 pb-16 pt-4">
	<!-- Header -->
	<div class="flex flex-col gap-3">
		<a
			href="/puzzles/spellingquiz"
			class="inline-flex items-center gap-2 text-sm font-bold opacity-60 hover:opacity-100 transition-opacity w-fit"
		>
			<ArrowLeftIcon size="16" />
			กลับไปเล่น
		</a>

		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-3">
				<div class="w-12 h-12 rounded-2xl bg-warning/15 border border-warning/30 flex items-center justify-center text-warning-content shadow-inner">
					<AwardIcon size="24" />
				</div>
				<div>
					<h1 class="text-2xl sm:text-3xl font-black tracking-tight text-base-content">ตารางคะแนน</h1>
					<p class="text-xs sm:text-sm opacity-60 font-semibold">เกมสะกดศัพท์</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Tabs -->
	<div class="flex gap-2 bg-base-300/20 p-1 rounded-2xl border border-base-300/30">
		<button
			on:click={() => handleTabChange('personal')}
			class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-black text-sm transition-all duration-200
				{activeTab === 'personal' ? 'bg-base-100 text-base-content text-base-content shadow-md border border-base-300' : 'opacity-50 hover:opacity-80'}"
		>
			<UserIcon size="14" />
			ส่วนตัว
		</button>
		<button
			on:click={() => handleTabChange('global')}
			class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-black text-sm transition-all duration-200
				{activeTab === 'global' ? 'bg-base-100 text-base-content text-base-content shadow-md border border-base-300' : 'opacity-50 hover:opacity-80'}"
		>
			<GlobeIcon size="14" />
			ทั่วโลก
		</button>
	</div>

	<!-- PERSONAL TAB -->
	{#if activeTab === 'personal'}
		<div class="mt-1 text-xs opacity-50 bg-base-300/20 border border-base-300/30 rounded-xl px-3 py-2 leading-relaxed">
			💡 คะแนนเหล่านี้บันทึกอยู่บนอุปกรณ์ของคุณเท่านั้น (localStorage)
		</div>

		{#if !loaded}
			<div class="flex items-center justify-center py-20 opacity-50">
				<span class="loading loading-dots loading-lg" />
			</div>
		{:else}
			{#each grouped as group}
				<section class="flex flex-col gap-4">
					<!-- Type Header -->
					<div class="flex items-center justify-between">
						<h2 class="text-lg sm:text-xl font-black text-base-content flex items-center gap-2">
							<span class="text-2xl">{group.emoji}</span>
							{group.label}
						</h2>
						{#if getBestScore(group.key) > 0}
							<div class="flex items-center gap-1.5 badge badge-warning badge-lg font-black">
								🏆 {getBestScore(group.key).toLocaleString()}
							</div>
						{/if}
					</div>

					<!-- Scores Table -->
					<div class="card bg-base-100 text-base-content shadow-xl border border-base-300 overflow-hidden">
						<table class="table w-full">
							<thead>
								<tr class="border-b border-base-300/60 bg-base-100/30 text-xs font-extrabold uppercase tracking-wider opacity-60">
									<th class="py-3 px-4 text-left">โหมด</th>
									<th class="py-3 px-4 text-right">คะแนนสูงสุด</th>
									<th class="py-3 px-4 text-center w-20">อันดับ</th>
								</tr>
							</thead>
							<tbody>
								{#each group.rows as row}
									{@const allScores = group.rows.map(r => r.score)}
									{@const modeConf = modeConfigs.find(m => m.key === row.mode)}
									<tr class="border-b border-base-300/30 last:border-0 transition-colors hover:bg-white/5 {row.score === 0 ? 'opacity-50' : ''}">
										<td class="py-4 px-4">
											<div class="flex items-center gap-2">
												<span class="w-7 h-7 rounded-lg {modeConf?.bg} {modeConf?.border} border flex items-center justify-center text-sm">
													{modeConf?.icon}
												</span>
												<span class="font-extrabold {modeConf?.color} text-sm sm:text-base">
													{modeConf?.label}
												</span>
											</div>
										</td>
										<td class="py-4 px-4 text-right">
											{#if row.score > 0}
												<span class="font-black font-mono text-lg sm:text-2xl text-primary">
													{row.score.toLocaleString()}
												</span>
												<span class="text-xs opacity-50 ml-1 font-bold">คะแนน</span>
											{:else}
												<span class="text-sm opacity-40 font-bold">ยังไม่เคยเล่น</span>
											{/if}
										</td>
										<td class="py-4 px-4 text-center text-xl font-black">
											{getRank(row.score, allScores)}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</section>
			{/each}

			<!-- Overall Summary -->
			{#if scores.some(s => s.score > 0)}
				<section class="flex flex-col gap-3">
					<h2 class="text-lg font-black text-base-content opacity-60 uppercase tracking-wider text-sm">สรุปภาพรวม</h2>
					<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
						<div class="card bg-base-100 text-base-content border border-base-300 shadow-lg">
							<div class="card-body p-4 text-center">
								<p class="text-xs opacity-50 font-bold uppercase tracking-wider mb-1">คะแนนสูงสุดตลอด</p>
								<p class="text-2xl font-black font-mono text-primary">
									{Math.max(...scores.map(s => s.score)).toLocaleString()}
								</p>
							</div>
						</div>
						<div class="card bg-base-100 text-base-content border border-base-300 shadow-lg">
							<div class="card-body p-4 text-center">
								<p class="text-xs opacity-50 font-bold uppercase tracking-wider mb-1">โหมดที่เล่น</p>
								<p class="text-2xl font-black text-secondary">{scores.filter(s => s.score > 0).length} / {scores.length}</p>
							</div>
						</div>
						<div class="card bg-base-100 text-base-content border border-base-300 shadow-lg col-span-2 sm:col-span-1">
							<div class="card-body p-4 text-center">
								<p class="text-xs opacity-50 font-bold uppercase tracking-wider mb-1">คะแนนรวมทั้งหมด</p>
								<p class="text-2xl font-black font-mono text-accent-content">
									{scores.reduce((a, s) => a + s.score, 0).toLocaleString()}
								</p>
							</div>
						</div>
					</div>
				</section>
			{:else}
				<div class="flex flex-col items-center gap-4 py-12 opacity-50">
					<span class="text-5xl">🎮</span>
					<p class="font-bold text-center">ยังไม่มีคะแนน<br/>เริ่มเล่นเกมก่อนนะ!</p>
					<a href="/puzzles/spellingquiz" class="btn btn-primary btn-sm">เล่นเลย</a>
				</div>
			{/if}

			<!-- Play Again CTA -->
			<a
				href="/puzzles/spellingquiz"
				class="btn btn-primary w-full gap-2 font-black text-lg py-4 h-auto rounded-2xl shadow-xl hover:shadow-primary/30 hover:scale-[1.01] transition-all"
			>
				🚀 เริ่มเกมใหม่
			</a>
		{/if}

	<!-- GLOBAL TAB -->
	{:else}
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
					<span class="text-5xl">🎮</span>
					<p class="font-bold text-center">ยังไม่มีคะแนนในระบบ<br/>เป็นคนแรกที่ส่งคะแนน!</p>
					<a href="/puzzles/spellingquiz" class="btn btn-primary btn-sm">เล่นเลย</a>
				</div>
			{:else}
				<div class="card bg-base-100 text-base-content shadow-xl border border-base-300 overflow-hidden">
					<table class="table w-full">
						<thead>
							<tr class="border-b border-base-300/60 bg-base-100/30 text-xs font-extrabold uppercase tracking-wider opacity-60">
								<th class="py-3 px-4 text-center w-16">อันดับ</th>
								<th class="py-3 px-4 text-left">ชื่อ</th>
								<th class="py-3 px-4 text-right">คะแนน</th>
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
											<div class="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
												<UserIcon size="12" class="text-primary" />
											</div>
											<span class="font-extrabold text-sm sm:text-base text-base-content truncate max-w-[140px]">
												{entry.name}
											</span>
										</div>
									</td>
									<td class="py-4 px-4 text-right">
										<span class="font-black font-mono text-lg sm:text-2xl text-primary">
											{entry.score.toLocaleString()}
										</span>
										<span class="text-xs opacity-50 ml-1 font-bold">คะแนน</span>
									</td>
									<td class="py-4 px-4 text-right text-xs opacity-50 font-bold hidden sm:table-cell">
										{formatDate(entry.created_at)}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</section>

		<a
			href="/puzzles/spellingquiz"
			class="btn btn-primary w-full gap-2 font-black text-lg py-4 h-auto rounded-2xl shadow-xl hover:shadow-primary/30 hover:scale-[1.01] transition-all"
		>
			🚀 เริ่มเกมใหม่
		</a>
	{/if}
</div>
