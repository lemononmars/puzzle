<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import Surface from '#lib/components/ui/Surface.svelte';
	import BoardGameSaleCard from '#lib/components/BoardGameSaleCard.svelte';
	import { buildSaleInquiry, canInquire, formatPrice, saleContacts, type SaleGame } from '#lib/data/boardGameSale.js';
	let { data }: { data: { games: SaleGame[]; checkedAt: string; stale: boolean } } = $props();
	let search = $state('');
	let availability = $state('inquire');
	let priceFilter = $state('all');
	let sort = $state('title');
	let shown = $state(24);
	let selectedIds: string[] = $state([]);
	let copyStatus = $state('');
	let refreshing = $state(false);
	let refreshStatus = $state('');
	let selected = $derived(data.games.filter((game) => selectedIds.includes(game.id) && canInquire(game)));
	let total = $derived(selected.reduce((sum, game) => sum + (game.price ?? 0), 0));
	let unknownPrices = $derived(selected.filter((game) => game.price === null).length);
	let inquiry = $derived(buildSaleInquiry(selected));
	let lineUrl = $derived(`https://line.me/R/share?text=${encodeURIComponent(inquiry)}`);
	let checkedLabel = $derived(new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Bangkok' }).format(new Date(data.checkedAt)));
	let visible = $derived.by(() => {
		const matches = data.games.filter((game) => `${game.title} ${game.addOns} ${game.note}`.toLowerCase().includes(search.toLowerCase().trim())
			&& (availability === 'all' || (availability === 'inquire' ? canInquire(game) : game.availability === availability))
			&& (priceFilter === 'all' || (priceFilter === 'priced' ? game.price !== null : game.price === null)));
		return matches.sort((a, b) => sort === 'price-low' ? (a.price ?? Infinity) - (b.price ?? Infinity)
			: sort === 'price-high' ? (b.price ?? -Infinity) - (a.price ?? -Infinity) : a.title.localeCompare(b.title));
	});
	$effect(() => {
		const allowed = new Set(data.games.filter(canInquire).map((game) => game.id));
		if (selectedIds.some((id) => !allowed.has(id))) selectedIds = selectedIds.filter((id) => allowed.has(id));
	});

	function toggle(game: SaleGame) {
		if (!canInquire(game)) return;
		selectedIds = selectedIds.includes(game.id) ? selectedIds.filter((id) => id !== game.id) : [...selectedIds, game.id];
		copyStatus = '';
	}
	async function copy(text: string, success: string) {
		try { await navigator.clipboard.writeText(text); copyStatus = success; }
		catch { copyStatus = 'คัดลอกอัตโนมัติไม่ได้ กรุณาเลือกข้อความแล้วคัดลอกด้วยตัวเอง'; }
	}
	async function refresh() {
		refreshing = true;
		copyStatus = '';
		try { await invalidateAll(); refreshStatus = data.stale ? 'ยังเชื่อมต่อรายการล่าสุดไม่ได้' : 'แสดงข้อมูลล่าสุดที่ตรวจสอบได้แล้ว'; }
		catch { refreshStatus = 'รีเฟรชไม่สำเร็จ กรุณาลองอีกครั้ง'; }
		finally { refreshing = false; }
	}
</script>

<svelte:head>
	<title>Board games for sale · Sakulbuth</title>
	<meta name="description" content="บอร์ดเกมจากคอลเลกชันของ Sakulbuth เลือกรายการแล้วสอบถามราคา สภาพ และการจัดส่งผ่าน Messenger หรือ LINE" />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="text-left space-y-8">
	<PageHeading title="A new home for my board games" eyebrow="SAKULBUTH’S GAME SHELF" description="บอร์ดเกมจากคอลเลกชันส่วนตัว เลือกเกมที่สนใจ แล้วส่งรายการมาคุยกันเรื่องสภาพ ราคา และการรับของ" />
	<ol class="journey grid grid-cols-3 gap-3" aria-label="วิธีซื้อ">
		<li><span>1</span><div><strong>เลือกเกม</strong><p>ค้นหา อ่านราคาและหมายเหตุ</p></div></li>
		<li><span>2</span><div><strong>เตรียมรายการ</strong><p>เลือกหลายเกมแล้วคัดลอกข้อความ</p></div></li>
		<li><span>3</span><div><strong>ทักมาคุยกัน</strong><p>ยืนยันรายละเอียดก่อนตกลงซื้อ</p></div></li>
	</ol>
	<div class="flex flex-wrap items-center gap-3 text-sm">
		<p class="botanical-muted">{data.games.length} รายการ · ตรวจสอบข้อมูล {checkedLabel}</p>
		<button type="button" class="btn btn-ghost btn-sm" onclick={refresh} disabled={refreshing}>{refreshing ? 'กำลังตรวจสอบ…' : 'รีเฟรชรายการ'}</button>
		<span role="status" class="botanical-muted">{refreshStatus}</span>
	</div>
	{#if data.stale}<p role="status" class="alert alert-warning text-warning-content">กำลังแสดงรายการที่บันทึกไว้ เพราะเชื่อมต่อข้อมูลล่าสุดไม่ได้ กรุณายืนยันราคาและสถานะผ่านแชต</p>{/if}
	<div class="sale-layout">
		<section aria-label="รายการเกม">
			<div class="filters bg-base-100 text-base-content border border-base-300 rounded-2xl p-4 grid sm:grid-cols-2 gap-3 mb-5">
				<label class="sm:col-span-2 text-sm">ค้นหาเกม<input type="search" class="input mt-2 w-full" bind:value={search} placeholder="ชื่อเกม หรือ Expansion…" /></label>
				<label class="text-sm">สถานะ<select class="select mt-2 w-full" bind:value={availability}><option value="inquire">รายการที่สอบถามได้</option><option value="available">พร้อมขาย</option><option value="check">สอบถามสถานะ</option><option value="reserved">ติดจอง</option><option value="sold">ขายแล้ว</option><option value="all">ทุกสถานะ</option></select></label>
				<label class="text-sm">ราคา<select class="select mt-2 w-full" bind:value={priceFilter}><option value="all">ทุกช่วงราคา</option><option value="priced">มีราคาแล้ว</option><option value="ask">สอบถามราคา</option></select></label>
			</div>
			<div class="flex flex-wrap items-center justify-between gap-3 mb-5"><p class="text-sm botanical-muted" aria-live="polite">พบ {visible.length} รายการ</p><label class="text-sm flex items-center gap-2">เรียงตาม<select class="select select-sm w-auto" bind:value={sort}><option value="title">ชื่อเกม A–Z</option><option value="price-low">ราคาน้อยไปมาก</option><option value="price-high">ราคามากไปน้อย</option></select></label></div>
			<div class="grid sm:grid-cols-2 gap-4">
				{#each visible.slice(0, shown) as game (game.id)}<BoardGameSaleCard {game} selected={selectedIds.includes(game.id)} onToggle={() => toggle(game)} />{:else}<Surface><p>ไม่พบเกมที่ตรงกับตัวกรอง ลองเปลี่ยนคำค้นหรือสถานะ</p></Surface>{/each}
			</div>
			{#if visible.length > shown}<button type="button" class="btn btn-outline text-base-content w-full mt-6" onclick={() => shown += 24}>แสดงเพิ่ม ({visible.length - shown} รายการที่เหลือ)</button>{/if}
		</section>
		<aside id="inquiry" aria-labelledby="inquiry-title" class="inquiry">
			<Surface>
				<p class="botanical-eyebrow">YOUR SHORTLIST</p><h2 id="inquiry-title" class="text-2xl mt-2 mb-4">รายการที่สนใจ ({selected.length})</h2>
				{#if selected.length}
					<ul class="space-y-3 mb-5">{#each selected as game (game.id)}<li class="flex gap-2 items-start justify-between text-sm"><span>{game.title}<span class="block botanical-muted">{formatPrice(game.price)}</span></span><button type="button" class="btn btn-ghost btn-xs shrink-0" aria-label={`เอา ${game.title} ออกจากรายการ`} onclick={() => toggle(game)}>✕</button></li>{/each}</ul>
					{#if selected.length > unknownPrices}<p class="font-bold text-primary">{unknownPrices ? 'ยอดเฉพาะเกมที่มีราคา' : 'ราคาเกมรวม'}: {formatPrice(total)}</p>{/if}
					{#if unknownPrices}<p class="botanical-muted text-sm mt-2">ยังมี {unknownPrices} รายการที่ต้องสอบถามราคา</p>{/if}
					<p class="botanical-muted text-xs mt-2 mb-5">ยังไม่รวมค่าจัดส่ง · การเลือกรายการยังไม่เป็นการจอง</p>
					<label class="block text-sm font-semibold">ข้อความพร้อมส่ง<textarea class="textarea w-full mt-2 h-48 text-sm font-normal" readonly value={inquiry}></textarea></label>
					<button type="button" class="btn btn-primary text-primary-content w-full mt-3" onclick={() => copy(inquiry, 'คัดลอกรายการแล้ว เปิดแชตแล้ววางข้อความได้เลย')}>คัดลอกรายการ</button>
					<div class="grid gap-3 mt-4"><a class="btn btn-outline text-base-content w-full" href={saleContacts.messenger} target="_blank" rel="noopener noreferrer">เปิด Messenger ↗</a><a class="btn btn-outline text-base-content w-full" href={lineUrl} target="_blank" rel="noopener noreferrer">ส่งรายการทาง LINE ↗</a></div>
					<p class="botanical-muted text-xs mt-3">Messenger: วางข้อความที่คัดลอก · LINE: เลือกส่งให้ {saleContacts.lineId}</p>
					<button type="button" class="btn btn-ghost btn-sm w-full mt-3" onclick={() => { selectedIds = []; copyStatus = ''; }}>ล้างรายการ</button>
				{:else}<p class="botanical-muted text-sm leading-relaxed mb-5">กด “เลือกไว้สอบถาม” ที่เกมที่สนใจ รายการและข้อความสำหรับส่งแชตจะปรากฏที่นี่</p><a class="btn btn-outline text-base-content w-full" href={saleContacts.messenger} target="_blank" rel="noopener noreferrer">สอบถามผ่าน Messenger ↗</a>{/if}
				<div class="border-t border-base-300 mt-5 pt-5 text-sm"><p class="font-semibold">LINE ID: {saleContacts.lineId}</p><p class="botanical-muted text-xs mt-2">หากยังไม่เป็นเพื่อน เพิ่มด้วย ID นี้ใน LINE ก่อนส่งรายการ</p><button type="button" class="btn btn-ghost btn-sm mt-2" onclick={() => copy(saleContacts.lineId, 'คัดลอก LINE ID แล้ว')}>คัดลอก LINE ID</button></div>
				<p role="status" class="text-sm text-primary mt-3">{copyStatus}</p>
			</Surface>
		</aside>
	</div>
	{#if selected.length}<a href="#inquiry" class="shortlist-bar lg:hidden bg-primary text-primary-content rounded-2xl shadow-lg px-5 py-3 flex justify-between gap-3"><span>{selected.length} เกมที่สนใจ</span><strong>ดูรายการ / ติดต่อ ↗</strong></a>{/if}
</div>

<style>
	.journey li { display: flex; align-items: center; gap: 14px; padding: 16px; border: 1px solid var(--color-base-300); border-radius: 16px; background: var(--color-base-100); color: var(--color-base-content); }
	.journey li > span { display: grid; place-items: center; border-radius: 50%; width: 32px; height: 32px; flex-shrink: 0; background: var(--color-accent); color: var(--color-accent-content); }
	.journey p { font-size: 12px; margin-top: 4px; }
	.sale-layout { display: grid; grid-template-columns: minmax(0, 1fr) 340px; align-items: start; gap: 24px; }
	.inquiry { position: sticky; top: 96px; max-height: calc(100dvh - 112px); overflow-y: auto; scroll-margin-top: 96px; }
	.shortlist-bar { position: fixed; bottom: calc(4rem + env(safe-area-inset-bottom)); inset-inline: 16px; z-index: 30; font-size: 14px; }
	@media (max-width: 1023px) { .sale-layout { grid-template-columns: 1fr; } .inquiry { position: static; max-height: none; overflow: visible; scroll-margin-top: 20px; } }
	@media (max-width: 640px) { .journey li { flex-direction: column; align-items: flex-start; padding: 12px; gap: 8px; font-size: 12px; } .journey p { display: none; } }
</style>
