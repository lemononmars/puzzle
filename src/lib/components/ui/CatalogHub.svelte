<script lang="ts">
 import ArrowUpRight from "@lucide/svelte/icons/arrow-up-right";
 import PageHeading from './PageHeading.svelte';
 import CatalogArtwork from './CatalogArtwork.svelte';
 type Group = { id:string; title:string; description:string; mark:string; entries:{ title:string; description?:string; href:string; mark:string }[] };
 let { area, groups }: { area:'puzzles'|'tools'|'resources'; groups:Group[] } = $props();
</script>
<svelte:head><title>{area === 'puzzles' ? 'Play / เล่นปริศนา' : area === 'tools' ? 'Create / เครื่องมือ' : 'Resources / ข้อมูล'} · Puzzle</title><meta name="description" content={area === 'puzzles' ? 'เลือกสำรวจปริศนาในห้าหมวด ควิซ ปริศนาทำมือ ปริศนาสร้างใหม่ ตรรกะ และเกมอื่น ๆ' : area === 'tools' ? 'เครื่องมือสร้างปริศนา ช่วยหาคำตอบ จัดเกม และตรวจคำตอบ' : 'ข้อมูลสำหรับนักไขปริศนา รหัสลับ คำสะกด คลังความรู้ กลไกปริศนา และคู่มือตรรกะ'} /></svelte:head>
<PageHeading title={area === 'puzzles' ? 'เลือกห้องเล่นของคุณ' : area === 'tools' ? 'เปิดกล่องเครื่องมือ' : 'เปิดชั้นข้อมูลของคุณ'} eyebrow={area === 'puzzles' ? 'FIVE ROOMS / MANY LITTLE DISCOVERIES' : area === 'tools' ? 'FIVE WORKBENCHES / ONE CURIOUS IDEA' : 'FIVE SHELVES / A WORLD OF IDEAS'} description={area === 'puzzles' ? 'ชอบค้นคำ ทายคำถาม หรือไล่เหตุผล? เลือกประตูที่อยากลองเปิด' : area === 'tools' ? 'จากไอเดียแรก ไปจนถึงเกมที่พร้อมเล่น เลือกเครื่องมือที่ช่วยคุณได้' : 'อ่าน ค้นหา และเชื่อมเบาะแส เลือกข้อมูลที่ช่วยให้คุณไปต่อ'} />
<div class="category-grid">
 {#each groups as group, i}
  <a href={`/${area}/${group.id}`} class={`catalog-poster poster-${i}`}>
   <div class="poster-top"><span class="botanical-eyebrow">0{i + 1} / {area === 'resources' ? 'REFERENCE' : group.entries.length + (area === 'puzzles' ? ' games' : ' tools')}</span><span class="enter" aria-hidden="true"><ArrowUpRight size={18} /></span></div>
   <div class="poster-art" aria-hidden="true"><CatalogArtwork category={group.id} /><span class="seal">{area === 'puzzles' ? 'PLAY' : area === 'tools' ? 'MAKE' : 'INFO'}</span></div>
   <h2>{group.title}</h2><p>{group.description}</p><div class="previews">{#each group.entries.slice(0,3) as entry}<span>{entry.title}</span>{/each}{#if group.entries.length > 3}<span>+{group.entries.length - 3}</span>{/if}</div>
  </a>
 {/each}
</div>
<style>
 .catalog-poster:hover :global(.category-illustration) { transform:translateY(-3px) rotate(-3deg); }
 .category-grid { display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:24px; padding:8px 0 24px; text-align:left; }
 .catalog-poster { grid-column:span 2; position:relative; overflow:hidden; padding:24px; background:var(--color-base-100); color:var(--color-base-content); border:1px solid var(--color-base-300); border-radius:32px; transition:transform .2s,border-color .2s; }
 .catalog-poster:nth-child(-n+2) { grid-column:span 3; } .catalog-poster:hover { transform:translateY(-5px); border-color:var(--color-primary); }
 .poster-top { display:flex; align-items:center; justify-content:space-between; } .enter { width:32px; height:32px; display:grid; place-items:center; border-radius:50%; background:var(--color-base-200); }
 .poster-art { height:170px; display:grid; place-items:center; position:relative; margin:16px 0 24px; background:var(--color-base-200); border-radius:90px 90px 24px 24px; }
 .seal { position:absolute; right:14px; bottom:12px; width:42px; height:42px; display:grid; place-items:center; background:var(--color-accent); color:var(--color-accent-content); border-radius:50%; font-size:9px; transform:rotate(12deg); border:1px dashed currentColor; }
 .poster-1 .poster-art { border-radius:24px; background:var(--color-accent); color:var(--color-accent-content); }  .poster-2 .poster-art { border-radius:24px 80px 24px 80px; } .poster-4 .poster-art { border-radius:50%; }
 h2 { margin:0 0 10px; font-size:1.3rem; } p { font-size:14px; opacity:.8; } .previews { display:flex; flex-wrap:wrap; gap:6px; margin-top:20px; } .previews span { padding:3px 9px; border:1px solid var(--color-base-300); border-radius:20px; font-size:10px; }
 @media(max-width:750px) { .category-grid { grid-template-columns:1fr; gap:16px; } .catalog-poster,.catalog-poster:nth-child(-n+2) { grid-column:auto; } .poster-art { height:145px; } }
</style>
