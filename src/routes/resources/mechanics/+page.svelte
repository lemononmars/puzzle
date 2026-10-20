<script lang="ts">
 import PageHeading from '#lib/components/ui/PageHeading.svelte';
 import PageIcon from '#lib/components/ui/PageIcon.svelte';
 import Search from '@lucide/svelte/icons/search';
 import ArrowLeft from '@lucide/svelte/icons/arrow-left';
 import ArrowRight from '@lucide/svelte/icons/arrow-right';
 import { PUZZLE_MECHANIC_CHAPTERS, PUZZLE_MECHANIC_COUNT } from '#lib/data/resources/puzzleMechanics.js';
 let query=$state('');
 let filtered=$derived(PUZZLE_MECHANIC_CHAPTERS.map(chapter=>({...chapter,mechanics:chapter.mechanics.filter(item=>[item.englishTitle,item.thaiTitle,item.japaneseTitle,item.description].join(' ').toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))})).filter(chapter=>chapter.mechanics.length));
 let count=$derived(filtered.reduce((sum,chapter)=>sum+chapter.mechanics.length,0));
 function iconFor(id:string) {
  if(/letter|word|vowel|alphabet|dakuten/.test(id))return '/puzzles/alphabet';
  if(/number|count|math|square/.test(id))return '/puzzles/mathdle';
  if(/arrow|direction|path|route|order/.test(id))return '/puzzles/crossroad';
  if(/color|shape|overlap|fold|rotate/.test(id))return '/tools/pentomino';
  if(/question|answer|find/.test(id))return '/puzzles/quiz';
  if(/map|place|position/.test(id))return '/puzzles/thaimapquiz';
  if(/sound|music/.test(id))return '/tools/hosting';
  return '/resources/mechanics';
 }
</script>
<svelte:head><title>Puzzle Mechanics / กลไกปริศนา · Puzzle</title><meta name="description" content="สารานุกรมกลไกปริศนา พร้อมคำอธิบาย วิธีสังเกต และศัพท์ไทย อังกฤษ ญี่ปุ่น" /></svelte:head>
<div class="space-y-6 text-left">
 <a href="/resources" class="btn btn-sm btn-ghost"><ArrowLeft size={16} />ข้อมูลทั้งหมด</a>
 <PageHeading title="Puzzle Mechanics / กลไกปริศนา" eyebrow={`REFERENCE / ${PUZZLE_MECHANIC_COUNT} TOPICS`} description="สำรวจกลไกปริศนา พร้อมคำอธิบาย วิธีสังเกต และศัพท์ไทย อังกฤษ ญี่ปุ่น" />
 <details class="botanical-surface text-sm"><summary class="cursor-pointer font-bold">แหล่งอ้างอิง / Book credit</summary><p class="mt-3">โครงสร้างหมวดหมู่และรายชื่อหัวข้ออ้างอิงจาก SCRAP presents 謎図鑑 · 2023 · ISBN 978-4-909474-70-4</p><a class="link link-primary" href="https://www.scrapgoods.jp/c/scrap/book/SCR-01-0230" target="_blank" rel="noreferrer">SCRAP presents 謎図鑑</a></details>
 <div class="botanical-surface sticky top-20 z-20">
  <label class="input bg-base-100 text-base-content flex items-center gap-2 w-full"><Search size={18} aria-hidden="true" /><input type="search" bind:value={query} aria-label="Search puzzle mechanics" placeholder="English, ไทย, 日本語…" class="min-w-0 flex-1" /><span class="text-xs">{count}/{PUZZLE_MECHANIC_COUNT}</span></label>
 </div>
 <nav aria-label="Puzzle mechanic chapters" class="flex flex-wrap gap-2">{#each filtered as chapter}<a class="btn btn-sm btn-outline" href={`#${chapter.id}`}>{chapter.englishTitle}</a>{/each}</nav>
 {#if !filtered.length}<p role="status">ไม่พบกลไกปริศนา / No mechanics found.</p>{/if}
 {#each filtered as chapter}<section id={chapter.id} class="space-y-4 scroll-mt-40">
  <h2 class="text-2xl font-bold">{chapter.englishTitle}</h2><p class="botanical-muted text-sm">{chapter.thaiTitle} · <span lang="ja">{chapter.japaneseTitle}</span></p>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{#each chapter.mechanics as mechanic}<a href={`/resources/mechanics/${mechanic.id}`} class="botanical-link-card flex flex-col gap-3">
   <span class="text-primary" aria-hidden="true"><PageIcon href={iconFor(mechanic.id)} size={28} /></span><h3 class="font-bold text-lg">{mechanic.englishTitle}</h3><p class="text-primary text-sm">{mechanic.thaiTitle}</p><p class="botanical-muted text-xs" lang="ja">{mechanic.japaneseTitle}</p><p class="text-sm leading-relaxed flex-1">{mechanic.description}</p><span class="text-primary flex items-center gap-2 text-sm font-bold">{mechanic.hasExercise?'ดูโจทย์ & ลองไข':'อ่านเพิ่มเติม'}<ArrowRight size={16} aria-hidden="true" /></span>
  </a>{/each}</div>
 </section>{/each}
</div>
