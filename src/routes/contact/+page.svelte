<script lang="ts">
 import BrandLogo from "#lib/components/ui/BrandLogo.svelte";
 import PageIcon from "#lib/components/ui/PageIcon.svelte";
import { enhance } from '$app/forms';
 import type { ActionData } from './$types';
 import PageHeading from '#lib/components/ui/PageHeading.svelte';
 import Surface from '#lib/components/ui/Surface.svelte';
 import { services } from '#lib/data/services.js';
 let { form }: { form: ActionData } = $props();
 let sending = $state(false);
 const email = 'sakulbuth@gmail.com';
</script>
<svelte:head><title>Contact for work · Sakulbuth Ekvittayaniphon</title><meta name="description" content="Commission custom puzzles, puzzle hunts, workshops, and interactive puzzle tools." /></svelte:head>
<PageHeading eyebrow="LET’S MAKE SOMETHING CURIOUS" title="Contact for work" description="ชวนกันสร้างประสบการณ์ที่ทำให้คนอยากคิด อยากลอง และอยากค้นพบ — เล่าไอเดียของคุณ แล้วเรามาคุยกัน" />
<section class="grid md:grid-cols-2 gap-5 text-left" aria-label="Types of work offered">
 {#each services as item}<Surface><p class="text-primary text-3xl" aria-hidden="true"><PageIcon href={item.title === "Custom puzzles" ? "/puzzles/crafted" : item.title.startsWith("Puzzle hunts") ? "/puzzles/puzzlehunt" : item.title.startsWith("Learning") ? "/resources/logictutorial" : "/tools"} size={32} /></p><h2>{item.title}</h2><p class="botanical-muted text-sm">{item.description}</p><p class="botanical-eyebrow mt-5">{item.examples}</p></Surface>{/each}
</section>
<section class="mt-12 text-left" aria-labelledby="brief-title">
 <Surface><div class="float-right ml-4 mb-4 w-[100px] sm:w-[140px]"><BrandLogo variant="occasion" /></div><h2 id="brief-title">Tell me about your project</h2><p class="botanical-muted text-sm mb-6">ฝากชื่อ ช่องทางติดต่อ และรายละเอียดงาน แล้วกด Send เพื่อส่งข้อความถึงฉัน</p>
 <form method="POST" use:enhance={() => { sending = true; return async ({ update }) => { try { await update(); } finally { sending = false; } }; }}>
 <div class="grid md:grid-cols-2 gap-5">
 <label class="flex flex-col gap-2 text-sm">ชื่อ / Name<input name="name" class="input w-full bg-base-100 text-base-content" required maxlength="150" autocomplete="name" value={form && 'values' in form ? form.values?.name ?? '' : ''} /></label>
 <label class="flex flex-col gap-2 text-sm">ช่องทางติดต่อ / Contact<input name="contact" class="input w-full bg-base-100 text-base-content" required maxlength="300" placeholder="อีเมล เบอร์โทร หรือ Line ID" value={form && 'values' in form ? form.values?.contact ?? '' : ''} /></label>
 <label class="hidden" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off" /></label>
 <label class="flex flex-col gap-2 text-sm">ประเภทงาน<select class="select w-full" name="service" value={form && 'values' in form ? form.values?.service ?? services[0].title : services[0].title}>{#each services as item}<option>{item.title}</option>{/each}<option>Other / มาคุยไอเดียกัน</option></select></label>
 <label class="flex flex-col gap-2 text-sm">ช่วงเวลาที่ต้องการ<input class="input w-full" name="deadline" maxlength="200" value={form && 'values' in form ? form.values?.deadline ?? '' : ''} placeholder="เช่น ภายในเดือนธันวาคม" /></label>
 <label class="flex flex-col gap-2 text-sm md:col-span-2">เล่าไอเดียของคุณ<textarea class="textarea w-full" rows="5" name="brief" required maxlength="5000" value={form && 'values' in form ? form.values?.brief ?? '' : ''} placeholder="เป้าหมาย กลุ่มผู้เล่น รูปแบบงาน และสิ่งที่อยากได้" /></label>
 <label class="flex flex-col gap-2 text-sm">งบประมาณโดยประมาณ (ถ้ามี)<input class="input w-full" name="budget" maxlength="200" value={form && 'values' in form ? form.values?.budget ?? '' : ''} placeholder="ระบุช่วงงบประมาณ หรือสอบถามก่อนได้" /></label>
 </div>
 <div class="flex flex-wrap items-center gap-5 mt-7"><button type="submit" class="btn btn-primary text-primary-content" disabled={sending}>{sending ? 'กำลังส่ง…' : 'Send / ส่งข้อความ'}</button><a href="mailto:{email}" class="link text-primary">{email}</a></div>
 {#if form?.message}<p role="status" class="mt-4 rounded-xl p-3 {form.success ? 'bg-success text-success-content' : 'bg-error text-error-content'}">{form.message}</p>{/if}
 </form>
 </Surface>
</section>
