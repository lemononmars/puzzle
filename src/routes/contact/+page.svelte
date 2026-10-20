<script lang="ts">
 import PageIcon from "#lib/components/ui/PageIcon.svelte";
import UiArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
 import PageHeading from '#lib/components/ui/PageHeading.svelte';
 import Surface from '#lib/components/ui/Surface.svelte';
 import { services } from '#lib/data/services.js';
 let service = $state('Custom puzzles');
 let brief = $state('');
 let deadline = $state('');
 let budget = $state('');
 const email = 'sakulbuth@gmail.com';
 let emailLink = $derived(`mailto:${email}?subject=${encodeURIComponent('Work inquiry: ' + service)}&body=${encodeURIComponent(`Type of work: ${service}\n\nProject brief:\n${brief}\n\nTimeline: ${deadline}\nBudget: ${budget}\n\nYour name / organisation:\n`)}`);
</script>
<svelte:head><title>Contact for work · Sakulbuth Ekvittayaniphon</title><meta name="description" content="Commission custom puzzles, puzzle hunts, workshops, and interactive puzzle tools." /></svelte:head>
<PageHeading eyebrow="LET’S MAKE SOMETHING CURIOUS" title="Contact for work" description="ชวนกันสร้างประสบการณ์ที่ทำให้คนอยากคิด อยากลอง และอยากค้นพบ — เล่าไอเดียของคุณ แล้วเรามาคุยกัน" />
<section class="grid md:grid-cols-2 gap-5 text-left" aria-label="Types of work offered">
 {#each services as item}<Surface><p class="text-primary text-3xl" aria-hidden="true"><PageIcon href={item.title === "Custom puzzles" ? "/puzzles/crafted" : item.title.startsWith("Puzzle hunts") ? "/puzzles/puzzlehunt" : item.title.startsWith("Learning") ? "/resources/logictutorial" : "/tools"} size={32} /></p><h2>{item.title}</h2><p class="botanical-muted text-sm">{item.description}</p><p class="botanical-eyebrow mt-5">{item.examples}</p></Surface>{/each}
</section>
<section class="mt-12 text-left" aria-labelledby="brief-title">
 <Surface><h2 id="brief-title">Tell me about your project</h2><p class="botanical-muted text-sm mb-6">เลือกประเภทงานและเล่ารายละเอียดเบื้องต้น ปุ่มด้านล่างจะเปิดแอปอีเมลพร้อมข้อความร่าง ข้อมูลจะส่งเมื่อคุณกดส่งในอีเมลเท่านั้น</p>
 <div class="grid md:grid-cols-2 gap-5">
 <label class="flex flex-col gap-2 text-sm">ประเภทงาน<select class="select w-full" bind:value={service}>{#each services as item}<option>{item.title}</option>{/each}<option>Other / มาคุยไอเดียกัน</option></select></label>
 <label class="flex flex-col gap-2 text-sm">ช่วงเวลาที่ต้องการ<input class="input w-full" bind:value={deadline} placeholder="เช่น ภายในเดือนธันวาคม" /></label>
 <label class="flex flex-col gap-2 text-sm md:col-span-2">เล่าไอเดียของคุณ<textarea class="textarea w-full" rows="5" bind:value={brief} placeholder="เป้าหมาย กลุ่มผู้เล่น รูปแบบงาน และสิ่งที่อยากได้" /></label>
 <label class="flex flex-col gap-2 text-sm">งบประมาณโดยประมาณ (ถ้ามี)<input class="input w-full" bind:value={budget} placeholder="ระบุช่วงงบประมาณ หรือสอบถามก่อนได้" /></label>
 </div>
 <div class="flex flex-wrap items-center gap-5 mt-7"><a href={emailLink} class="btn btn-primary text-primary-content">เตรียมอีเมลติดต่อ <UiArrowUpRight size={16} class="inline-block align-middle" aria-hidden="true" /></a><a href="mailto:{email}" class="link text-primary">{email}</a></div>
 </Surface>
</section>
