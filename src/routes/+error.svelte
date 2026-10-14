<script lang="ts">
 import { page } from '$app/state';
 import PageHeading from '#lib/components/ui/PageHeading.svelte';
 import Surface from '#lib/components/ui/Surface.svelte';
 import ActionLink from '#lib/components/ui/ActionLink.svelte';
 let status = $derived(page.status);
 let title = $derived(status === 404 ? 'หลงทางนิดหน่อย' : status === 403 ? 'หน้านี้ยังเปิดให้คุณไม่ได้' : 'ขอพักไขปริศนาสักครู่');
 let description = $derived(status === 404 ? 'ไม่พบหน้าที่คุณกำลังหา ลิงก์อาจเปลี่ยนไปหรือหน้านี้ถูกย้ายแล้ว' : status === 403 ? 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้ เลือกสำรวจหน้าอื่นได้จากลิงก์ด้านล่าง' : 'มีบางอย่างขัดข้อง ลองเปิดหน้านี้ใหม่อีกครั้ง หรือกลับไปเริ่มที่หน้าหลัก');
</script>

<svelte:head>
 <title>{status} · Puzzle</title>
 <meta name="robots" content="noindex" />
</svelte:head>

<section class="error-page" aria-label={`ข้อผิดพลาด ${status}`}>
 <Surface class="error-surface">
  <div class="error-layout">
   <div class="lost-tile" aria-hidden="true">
    <div class="tile-grid">{#each ['4','✦','0','▧','','◈','⌕','4','▦'] as mark}<span class:missing={!mark}>{mark}</span>{/each}</div>
    <span class="loose-tile">?</span>
   </div>
   <div>
    <PageHeading eyebrow={`A LITTLE DETOUR / ${status}`} {title} {description} />
    <div class="actions"><ActionLink href="/">กลับหน้าหลัก</ActionLink><ActionLink href="/puzzles" secondary>หาเกมใหม่เล่น</ActionLink></div>
    <p class="hint botanical-muted">ทุกทางตัน อาจเป็นจุดเริ่มต้นของไอเดียใหม่ ✦</p>
   </div>
  </div>
 </Surface>
</section>

<style>
 .error-page { max-width:820px; margin:32px auto; text-align:left; }
 .error-layout { display:grid; grid-template-columns:180px 1fr; align-items:center; gap:36px; }
 .lost-tile { position:relative; padding:20px 0; }
 .tile-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; transform:rotate(-5deg); }
 .tile-grid > span { aspect-ratio:1; display:grid; place-items:center; border-radius:14px; background:var(--color-base-200); color:var(--color-primary); font-size:23px; font-weight:600; }
 .tile-grid > .missing { border:2px dashed var(--color-base-300); background:transparent; }
 .loose-tile { position:absolute; top:58px; right:-12px; width:52px; height:52px; display:grid; place-items:center; border-radius:14px; background:var(--color-accent); color:var(--color-accent-content); font-size:26px; transform:rotate(12deg); box-shadow:0 6px 14px #364b3e12; }
 .actions { display:flex; flex-wrap:wrap; gap:10px; }
 .hint { font-size:12px; margin-top:20px; }
 @media(max-width:600px) { .error-page { margin:12px auto; } .error-layout { grid-template-columns:1fr; gap:16px; } .lost-tile { width:135px; padding:8px 0; } .loose-tile { top:42px; width:40px; height:40px; } }
</style>
