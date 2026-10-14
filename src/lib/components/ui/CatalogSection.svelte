<script lang="ts">
 import PageHeading from './PageHeading.svelte';
 import LinkCard from './LinkCard.svelte';
 let { area, group }: { area:'puzzles'|'tools'; group:{id:string;title:string;description:string;mark:string;entries:{title:string;description?:string;href:string;mark:string;icon?:string}[]} } = $props();
</script>
<svelte:head><title>{group.title} · Puzzle</title><meta name="description" content={group.description} /></svelte:head>
<div class="text-left"><a class="link link-primary text-sm" href={`/${area}`}>← {area === 'puzzles' ? 'ห้องเล่นทั้งหมด' : 'กล่องเครื่องมือทั้งหมด'}</a><div class="mt-5"><PageHeading title={group.title} description={group.description} eyebrow={`${area === 'puzzles' ? 'PLAY' : 'CREATE'} / ${group.entries.length} TO EXPLORE`} /></div><div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{#each group.entries as entry}<LinkCard href={entry.href} title={entry.title} description={entry.description ?? ''} mark={entry.mark} icon={entry.icon ?? ''} />{/each}</div><nav aria-label="เลือกหมวดอื่น" class="flex flex-wrap gap-2 mt-8"><a class="btn btn-sm btn-outline" href={`/${area}`}>ดูทั้งห้าหมวด</a><a class="btn btn-sm btn-primary text-primary-content" href={area === 'puzzles' ? '/tools' : '/puzzles'}>{area === 'puzzles' ? 'ลองสร้างเอง' : 'ไปเล่นปริศนา'}</a></nav></div>
