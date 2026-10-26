<script lang="ts">
import UiArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
 import ActionLink from '#lib/components/ui/ActionLink.svelte';
 import Surface from '#lib/components/ui/Surface.svelte';
 import LinkCard from '#lib/components/ui/LinkCard.svelte';
 import PuzzleArtwork from '#lib/components/ui/PuzzleArtwork.svelte';




 const games = [
 {href:'/puzzles/spellingbee',title:'Spelling Bee',description:'เจ็ดตัวอักษร คุณจะค้นพบได้กี่คำ?',eyebrow:'Words / คำศัพท์',mark:'⬡ Aa'},
 {href:'/puzzles/thaiquiz',title:'Thai Quiz',description:'เรื่องใกล้ตัวที่อาจไม่เคยรู้ ลองทดสอบความรู้รอบตัว',eyebrow:'Quiz / ความรู้',mark:'ก ?'},
 {href:'/puzzles/logicpuzzle',title:'Logic Puzzle',description:'ต่อเบาะแสทีละนิด จนทุกอย่างลงตัว',eyebrow:'Logic / เหตุผล',mark:'▦'},
 {href:'/puzzles/wordsearch',title:'Word Search',description:'คำที่ซ่อนอยู่ในตาราง รอให้คุณค้นพบ',eyebrow:'Discovery / ค้นหา',mark:'A↗Z'}];

</script>
<svelte:head><title>Chi Fun · ไขสนุก</title><meta name="description" content="เล่นปริศนาคำและตรรกะ สร้างปริศนาของคุณ และค้นพบไอเดียใหม่" /></svelte:head>
<section class="hero-layout">
 <div><p class="botanical-eyebrow">Chi Fun / ไขสนุก</p><h1>พักสักนิด<br />แล้ว<span class="text-primary">คิดให้สนุก.</span></h1><p class="botanical-muted">พื้นที่เล็ก ๆ สำหรับความอยากรู้<br />เล่นกับคำ ไขปริศนา และค้นพบไอเดียใหม่<br />เริ่มจากเกมสั้น ๆ ที่ใช่สำหรับคุณ</p><div class="flex flex-wrap gap-5 mt-7"><ActionLink href="/puzzles">เริ่มเล่นปริศนา ↗</ActionLink><ActionLink href="/tools" secondary>ลองสร้างเอง</ActionLink></div><p class="botanical-muted text-xs mt-5">เล่นได้ฟรี · ภาษาไทย · เปิดรับทุกความสงสัย</p></div>
 <PuzzleArtwork />
</section>
<section class="text-left"><div class="flex justify-between items-center gap-4 mb-6"><h2>วันนี้ อยากเล่นอะไร?</h2><a href="/puzzles" class="text-sm text-primary">ดูทั้งหมด <UiArrowUpRight size={16} class="inline-block align-middle" aria-hidden="true" /></a></div><div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{#each games as game}<LinkCard {...game} />{/each}</div></section>
<section class="mt-10"><Surface class="text-left"><div class="flex flex-wrap justify-between items-center gap-6"><div><h2>ไอเดียของคุณ ก็เป็นปริศนาได้</h2><p class="botanical-muted text-sm">สร้างเกมค้นหาคำหรือครอสเวิร์ด แล้วชวนคนอื่นมาลองคิดด้วยกัน</p></div><ActionLink href="/tools" secondary>สำรวจเครื่องมือ ↗</ActionLink></div></Surface></section>

<section class="mt-10 text-left"><Surface><p class="botanical-eyebrow">LET’S MAKE SOMETHING CURIOUS</p><h2>ชวนกันสร้างงานที่ทำให้คนอยากคิด</h2><p class="botanical-muted mb-6">ปริศนาตามธีม กิจกรรมกลุ่ม เวิร์กช็อป และเครื่องมือปริศนาบนเว็บ</p><ActionLink href="/contact">ติดต่อร่วมงาน ↗</ActionLink></Surface></section>
<style>.hero-layout { display: grid; grid-template-columns: 1.1fr 1fr; gap: 75px; align-items: center; padding: 45px 0 70px; text-align: left; } h1 { font-weight: 400; font-size: clamp(36px,4.3vw,60px); } @media(max-width:750px) { .hero-layout { grid-template-columns: 1fr; gap: 35px; padding-top: 15px; } }</style>
