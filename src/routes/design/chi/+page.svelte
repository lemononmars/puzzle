<script lang="ts">
import UiArrowLeft from '@lucide/svelte/icons/arrow-left';
 import PageHeading from '#lib/components/ui/PageHeading.svelte';
 const designs = [
  {file:'chi-01',title:'Maze Chi',group:'directions',description:'Paths carved into chi: search, wrong turns and discovery.'},
  {file:'chi-02',title:'Secret Chi',group:'directions',description:'A keyhole hidden at the crossing: unlock the answer.'},
  {file:'chi-03',title:'Cipher Chi',group:'directions',description:'Separate fragments resolve into a single cryptic symbol.'},
  {file:'chi-04',title:'Woven Chi',group:'directions',description:'Two curved strands interlock like connected ideas.'},
  {file:'chi-05',title:'Clue Constellation',group:'directions',description:'Connect the clue points to reveal chi.'},
  {file:'chi-cube',title:'Chi Cube',group:'geometry',description:'Three shaded faces, a hidden chi and a clue at the intersection.'},
  {file:'chi-square',title:'Chi Square',group:'geometry',description:'Four corner pieces frame chi in the negative space.'},
  {file:'chi-square-v01',title:'Curved Chi Square',group:'refinements',description:'Hooked upper-left and lower-right terminals make the chi more expressive.'},
  {file:'chi-square-v02',title:'Implied Square',group:'refinements',description:'Color on the letter; cutouts and clipped ends suggest an invisible square.'},
  {file:'chi-square-v03',title:'Infinity Squares',group:'refinements',description:'Two joined squares form infinity, with chi woven into their crossing.'},
  {file:'chi-key',title:'Chi Key',group:'key',description:'A curved key bow and toothed shaft meet a crossing stroke: a symbol for unlocking clues.'}
 ];
 const filters=[{id:'all',label:'ทั้งหมด / All'},{id:'directions',label:'First directions'},{id:'geometry',label:'Cube & square'},{id:'refinements',label:'Square refinements'},{id:'key',label:'The key'}];
 let filter=$state('all');
 let background=$state('paper');
 let shown=$derived(designs.filter(design=>filter==='all'||design.group===filter));
</script>
<svelte:head><title>Chi symbol sketchbook · Puzzle</title><meta name="description" content="Eleven chi symbol explorations: maze, cipher, woven chi, cube, square, infinity and a key. Browse the design sketchbook and download the SVGs." /></svelte:head>
<div class="text-left">
 <a href="/portfolio" class="link link-primary text-sm"><UiArrowLeft size={16} class="inline-block align-middle" aria-hidden="true" /> Portfolio</a>
 <div class="mt-5"><PageHeading title="Chi symbol sketchbook" eyebrow="DESIGN / FROM A CROSSING TO A CLUE" description="χ / X เป็นจุดเริ่มต้นของการทดลองเหล่านี้ สำรวจทุกแนวทาง ตั้งแต่เขาวงกตไปจนถึงกุญแจ" /></div>
 <div class="controls"><div class="flex flex-wrap gap-2" aria-label="กลุ่มแบบสัญลักษณ์">{#each filters as option}<button class={`btn btn-sm ${filter===option.id?'btn-primary text-primary-content':'btn-outline'}`} aria-pressed={filter===option.id} onclick={()=>filter=option.id}>{option.label}</button>{/each}</div><div class="flex gap-2" aria-label="พื้นหลังตัวอย่าง"><button class="btn btn-sm btn-ghost" aria-pressed={background==='paper'} onclick={()=>background='paper'}>Paper</button><button class="btn btn-sm btn-ghost" aria-pressed={background==='moss'} onclick={()=>background='moss'}>Moss</button></div></div>
 <p class="botanical-muted text-xs mb-5" aria-live="polite">{shown.length} / {designs.length} designs · Vector sketches, ready to compare</p>
 <div class="design-grid">
  {#each shown as design}
   <article class="botanical-card design-card">
    <div class="preview bg-base-200 text-base-content" class:moss={background==='moss'}><img src={`/images/chi/${design.file}.svg`} alt={`${design.title} symbol`} width="240" height="240" /></div>
    <div class="details"><p class="botanical-eyebrow">{design.group}</p><h2>{design.title}</h2><p class="description botanical-muted">{design.description}</p><div class="card-footer"><div class="miniatures" aria-label="ตัวอย่างขนาดเล็ก"><img src={`/images/chi/${design.file}.svg`} alt="" width="20" height="20" /><img src={`/images/chi/${design.file}.svg`} alt="" width="32" height="32" /></div><a class="btn btn-sm btn-outline btn-primary" href={`/images/chi/${design.file}.svg`} download>SVG ↓</a></div></div>
   </article>
  {/each}
 </div>
</div>
<style>
 .controls { display:flex; flex-wrap:wrap; justify-content:space-between; gap:16px; margin:24px 0 16px; }
 .design-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:20px; }
 .design-card { overflow:hidden; } .preview { min-height:245px; display:grid; place-items:center; padding:24px; transition:background .15s; } .preview.moss { background:var(--color-primary); color:var(--color-primary-content); } .preview img { width:100%; max-width:220px; height:200px; object-fit:contain; }
 .details { padding:22px; } h2 { font-size:1.25rem; margin:8px 0 12px; } .description { font-size:13px; min-height:66px; } .card-footer { display:flex; align-items:center; justify-content:space-between; margin-top:16px; } .miniatures { display:flex; align-items:center; gap:12px; }
 @media(max-width:850px) { .design-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } } @media(max-width:550px) { .design-grid { grid-template-columns:1fr; } }
</style>
