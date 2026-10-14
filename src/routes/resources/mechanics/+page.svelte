<script lang="ts">
	import {
		ArrowLeftIcon,
		BookOpenIcon,
		ExternalLinkIcon,
		LayersIcon,
		SearchIcon
	} from 'svelte-feather-icons';
	import {
		PUZZLE_MECHANIC_CHAPTERS,
		PUZZLE_MECHANIC_COUNT
	} from '#lib/data/resources/puzzleMechanics.js';
	import { getMechanicIcon } from '#lib/data/resources/mechanicIcons.js';

	let searchQuery = '';

	$: normalizedQuery = searchQuery.trim().toLocaleLowerCase();
	$: filteredChapters = PUZZLE_MECHANIC_CHAPTERS.map((chapter) => ({
		...chapter,
		mechanics: chapter.mechanics.filter((mechanic) =>
			[mechanic.englishTitle, mechanic.thaiTitle, mechanic.japaneseTitle, mechanic.description]
				.join(' ')
				.toLocaleLowerCase()
				.includes(normalizedQuery)
		)
	})).filter((chapter) => chapter.mechanics.length > 0);

	$: visibleCount = filteredChapters.reduce(
		(total, chapter) => total + chapter.mechanics.length,
		0
	);
</script>

<svelte:head>
	<title>Code Breaker | Puzzle Mechanics Wiki</title>
	<meta
		name="description"
		content="สารานุกรมกลไกปริศนา 94 รูปแบบ พร้อมชื่อภาษาอังกฤษ ไทย และญี่ปุ่น"
	/>
</svelte:head>

<div class="w-full max-w-7xl mx-auto px-4 py-8 lg:py-10 text-base-content">
	<a href="/resources" class="btn btn-ghost btn-sm gap-2 mb-6">
		<ArrowLeftIcon size="16" />
		กลับไปหน้า Resources
	</a>

	<header
		class="rounded-3xl border border-base-300 bg-base-200 text-base-content overflow-hidden shadow-xl"
	>
		<div class="p-6 sm:p-8 lg:p-10 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-center">
			<div class="space-y-5">
				<div class="flex items-center gap-3">
					<div
						class="w-14 h-14 rounded-2xl bg-primary text-primary-content flex items-center justify-center shadow-lg"
					>
						<LayersIcon size="28" />
					</div>
					<div>
						<p class="text-xs font-black uppercase tracking-[0.2em] text-primary">Reference wiki</p>
						<p class="text-sm opacity-70">{PUZZLE_MECHANIC_COUNT} mechanics · 5 sections</p>
					</div>
				</div>

				<div class="space-y-2">
					<h1 class="text-4xl sm:text-5xl font-black tracking-tight">Puzzle Mechanics</h1>
					<p class="text-xl font-bold">
						กลไกปริศนา <span class="opacity-40">·</span> <span lang="ja">謎解きの仕組み</span>
					</p>
					<p class="max-w-3xl leading-relaxed opacity-75">
						ดัชนีรูปแบบการคิดและกลไกที่พบบ่อยในปริศนาแบบภาพ เกมล่าปริศนา และห้องหลบหนี
						พร้อมคำอธิบายภาษาไทย ศัพท์เทคนิคภาษาอังกฤษและญี่ปุ่น โจทย์ทดลองแบบเวกเตอร์ (SVG)
						ระบบตรวจคำตอบ และเฉลยวิธีคิดครบทุกหัวข้อ
					</p>
				</div>
			</div>

			<aside class="rounded-2xl border border-base-300 bg-base-100 text-base-content p-5 space-y-3">
				<div class="flex items-center gap-2 font-black">
					<BookOpenIcon size="18" class="text-primary" />
					Book credit
				</div>
				<p class="text-sm leading-relaxed opacity-75">
					โครงสร้างหมวดหมู่และรายชื่อหัวข้ออ้างอิงจากหนังสือของ SCRAP ซึ่งจัดกลไกปริศนาแบบภาพไว้ 94
					หัวข้อ
				</p>
				<a
					href="https://www.scrapgoods.jp/c/scrap/book/SCR-01-0230"
					target="_blank"
					rel="noreferrer"
					class="btn btn-primary btn-sm w-full gap-2"
				>
					SCRAP presents 謎図鑑
					<ExternalLinkIcon size="14" />
				</a>
				<p class="text-xs opacity-60">SCRAP · 2023 · ISBN 978-4-909474-70-4</p>
			</aside>
		</div>
	</header>

	<div
		class="botanical-card sticky top-2 z-20 mt-6 rounded-2xl border border-base-300 bg-base-100 text-base-content shadow-lg p-3 sm:p-4"
	>
		<label class="relative block">
			<SearchIcon size="18" class="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
			<input
				type="search"
				bind:value={searchQuery}
				class="input  bg-base-200 text-base-content w-full pl-11 pr-24"
				placeholder="Search in English, Thai, or Japanese…"
				aria-label="Search puzzle mechanics"
			/>
			<span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold opacity-60">
				{visibleCount}/{PUZZLE_MECHANIC_COUNT}
			</span>
		</label>
	</div>

	<div class="mt-8 grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
		<aside
			class="hidden lg:block sticky top-24 rounded-2xl border border-base-300 bg-base-200 text-base-content p-5 max-h-[calc(100vh-7rem)] overflow-y-auto"
		>
			<h2 class="font-black text-sm uppercase tracking-wider mb-4">Contents</h2>
			<nav aria-label="Puzzle mechanic chapters" class="space-y-4">
				{#each PUZZLE_MECHANIC_CHAPTERS as chapter}
					<div class="space-y-1">
						<a href={'#' + chapter.id} class="font-bold text-sm link link-hover text-primary">
							{chapter.englishTitle}
						</a>
						<p class="text-xs opacity-60">
							{chapter.thaiTitle} · <span lang="ja">{chapter.japaneseTitle}</span>
						</p>
					</div>
				{/each}
			</nav>
		</aside>

		<main class="min-w-0 space-y-12">
			{#if filteredChapters.length === 0}
				<div
					class="rounded-3xl border border-dashed border-base-300 bg-base-200 text-base-content p-12 text-center"
				>
					<p class="text-4xl mb-3">🔎</p>
					<h2 class="text-xl font-black">No mechanics found</h2>
					<p class="opacity-65 mt-1">ลองค้นด้วยชื่อภาษาอังกฤษ ภาษาไทย หรือภาษาญี่ปุ่น</p>
				</div>
			{:else}
				{#each filteredChapters as chapter, chapterIndex}
					<section id={chapter.id} class="scroll-mt-28 space-y-5">
						<header
							class="border-b border-base-300 pb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
						>
							<div>
								<p class="text-xs font-black uppercase tracking-[0.18em] opacity-50">
									Section {chapterIndex + 1}
								</p>
								<h2 class="text-3xl font-black mt-1">{chapter.englishTitle}</h2>
								<p class="font-bold opacity-70 mt-1">
									{chapter.thaiTitle} <span class="opacity-35">·</span>
									<span lang="ja">{chapter.japaneseTitle}</span>
								</p>
							</div>
							<span class="badge {chapter.accent} font-bold self-start sm:self-auto"
								>{chapter.mechanics.length} topics</span
							>
						</header>

						<div class="grid gap-4 md:grid-cols-2">
							{#each chapter.mechanics as mechanic}
								<article
									id={mechanic.id}
									class="botanical-card scroll-mt-28 rounded-2xl border border-base-300 bg-base-100 text-base-content p-5 shadow-sm hover:shadow-lg transition-shadow flex flex-col gap-4"
								>
									<div class="flex items-start gap-3.5">
										<div
											class="w-11 h-11 rounded-2xl bg-primary/10 text-primary shrink-0 flex items-center justify-center p-2.5 shadow-sm border border-primary/20"
											title={mechanic.englishTitle}
										>
											{@html getMechanicIcon(mechanic.id)}
										</div>
										<div class="min-w-0 flex-1">
											<h3 class="text-xl font-black leading-tight">{mechanic.englishTitle}</h3>
											<div class="mt-1.5 space-y-0.5">
												<p class="font-bold text-primary text-sm">{mechanic.thaiTitle}</p>
												<p class="font-medium opacity-65 text-xs" lang="ja">{mechanic.japaneseTitle}</p>
											</div>
										</div>
									</div>

									<p class="text-sm leading-relaxed opacity-75 flex-1">{mechanic.description}</p>

									<div
										class="pt-3 border-t border-base-300 flex items-center justify-between gap-3"
									>
										<a
											href={'#' + mechanic.id}
											class="text-xs link link-hover opacity-50"
											aria-label={'Link to ' + mechanic.englishTitle}>#{mechanic.id}</a
										>
										{#if mechanic.hasExercise}
											<a
												href="/resources/mechanics/{mechanic.id}"
												class="btn btn-primary btn-xs sm:btn-sm gap-1 text-primary-content font-bold shadow-sm"
											>
												<span>ดูโจทย์ & ลองไข</span>
												<span>→</span>
											</a>
										{/if}
									</div>
								</article>
							{/each}
						</div>
					</section>
				{/each}
			{/if}
		</main>
	</div>
</div>
