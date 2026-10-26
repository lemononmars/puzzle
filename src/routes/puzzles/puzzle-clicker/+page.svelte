<script lang="ts">
	import { onMount } from 'svelte';
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import Surface from '#lib/components/ui/Surface.svelte';
	import { loadGame, saveGame } from '#lib/progress/local.js';
	import { helpers, freshWorkshop, clickPower, production, price, pencilPrice, earn, advance, buy, restoreWorkshop } from '#lib/games/puzzleClicker.js';

	const path = '/puzzles/puzzle-clicker';
	let game = $state(freshWorkshop(0));
	let ready = $state(false);
	let taps = $state(0);
	let message = $state('แตะชิ้นจิ๊กซอว์เพื่อเริ่มสะสม');
	let resetDialog: HTMLDialogElement;
	const format = (value: number) => new Intl.NumberFormat('en', { maximumFractionDigits: 1, notation: value >= 100000 ? 'compact' : 'standard' }).format(value);
	const milestones = [100, 1000, 10000, 1000000];
	let nextGoal = $derived(milestones.find(goal => game.lifetime < goal));
	let rate = $derived(production(game));
	function persist() { saveGame(path, 'Puzzle Workshop', game); }
	function tick() { game = advance(game, Date.now()); }
	function tap() {
		tick();
		game = earn(game, clickPower(game));
		taps++;
	}
	function purchase(item: number | 'pencil') {
		tick();
		const next = buy(game, item);
		if (next === game) return;
		game = next;
		message = item === 'pencil' ? `เหลาดินสอแล้ว! ได้ ${format(clickPower(game))} ชิ้นต่อครั้ง` : `ซื้อ${helpers[item].name}แล้ว! ผลิตรวม ${format(production(game))} ชิ้นต่อวินาที`;
		persist();
	}
	function restart() {
		game = freshWorkshop(Date.now());
		taps = 0;
		message = 'เริ่มเวิร์กช็อปใหม่แล้ว';
		persist();
		resetDialog.close();
	}
	onMount(() => {
		const now = Date.now();
		const saved = restoreWorkshop(loadGame(path), now);
		game = advance(saved, now);
		const offline = game.pieces - saved.pieces;
		if (offline >= 0.1) message = `ยินดีต้อนรับกลับ! ผู้ช่วยสะสมเพิ่ม ${format(offline)} ชิ้น`;
		ready = true;
		const timer = window.setInterval(tick, 250);
		const saver = window.setInterval(persist, 5000);
		const flush = () => { tick(); persist(); };
		window.addEventListener('pagehide', flush);
		const visibility = () => { if (document.hidden) flush(); else tick(); };
		document.addEventListener('visibilitychange', visibility);
		return () => {
			clearInterval(timer); clearInterval(saver); flush();
			window.removeEventListener('pagehide', flush);
			document.removeEventListener('visibilitychange', visibility);
		};
	});
</script>

<div class="mx-auto max-w-5xl px-4 py-6">
	<PageHeading title="Puzzle Workshop" eyebrow="โรงงานชิ้นส่วนปริศนา" description="เริ่มจากจิ๊กซอว์หนึ่งชิ้น แล้วสร้างเวิร์กช็อปปริศนาของคุณ" />
	<div class="grid gap-5 lg:grid-cols-2">
		<Surface class="p-5 sm:p-8 text-center">
			<p class="botanical-eyebrow">ชิ้นส่วนที่มี</p>
			<p class="balance font-semibold tabular-nums" data-testid="piece-balance">{format(game.pieces)}</p>
			<p class="text-sm botanical-muted">+{format(clickPower(game))} ต่อครั้ง · {format(rate)} ชิ้น/วินาที</p>
			<div class="piece-stage">
				<button type="button" class="piece-button" disabled={!ready} onclick={tap} aria-label="ต่อชิ้นจิ๊กซอว์" aria-describedby="tap-instructions">
					<svg viewBox="0 0 200 200" fill="none" aria-hidden="true">
						<path d="M40 40H80C65 12 125 12 110 40H155V80C183 65 183 125 155 110V155H110C125 183 65 183 80 155H40V110C12 125 12 65 40 80Z" fill="currentColor" stroke="var(--color-base-content)" stroke-width="2.5" stroke-linejoin="round" />
						<path d="m76 96 15 15 28-31" stroke="var(--color-primary-content)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</button>
				{#if taps > 0}{#key taps}<span class="click-gain" aria-hidden="true">+{format(clickPower(game))}</span>{/key}{/if}
			</div>
			<p id="tap-instructions" class="text-sm botanical-muted">แตะเพื่อเก็บชิ้นส่วน หรือใช้ Enter / Space</p>
			<div class="mt-6 border-t border-base-300 pt-5 text-left">
				<div class="flex justify-between gap-3 text-sm mb-2"><span>สะสมทั้งหมด</span><span class="tabular-nums">{format(game.lifetime)} ชิ้น</span></div>
				{#if nextGoal}
					<progress class="progress progress-primary w-full" value={game.lifetime} max={nextGoal} aria-label={`เป้าหมาย ${nextGoal} ชิ้น`}></progress>
					<p class="text-xs botanical-muted mt-2">เป้าหมายถัดไป: {format(nextGoal)} ชิ้น</p>
				{:else}<p class="text-sm font-semibold">✦ เวิร์กช็อประดับตำนาน! สะสมครบหนึ่งล้านชิ้นแล้ว</p>{/if}
				<div class="flex flex-wrap gap-2 mt-3" aria-label="ความสำเร็จ">
					{#each milestones as goal}<span class="badge {game.lifetime >= goal ? 'badge-primary' : 'badge-outline'}">{game.lifetime >= goal ? '✓ ' : ''}{format(goal)}</span>{/each}
				</div>
			</div>
		</Surface>
		<Surface class="p-5 sm:p-6">
			<h2 class="text-xl font-semibold mb-1">โต๊ะอัปเกรด</h2>
			<p class="text-sm botanical-muted mb-5">ใช้ชิ้นส่วนลงทุน แล้วปล่อยให้ไอเดียเติบโต</p>
			<div class="upgrade bg-base-200 text-base-content">
				<div><h3 class="font-semibold">✎ เหลาดินสอ <span class="text-xs">ระดับ {game.pencil}</span></h3><p class="text-sm botanical-muted mt-1">เพิ่มพลังแตะครั้งละ 1 ชิ้น</p></div>
				<button type="button" class="btn btn-primary btn-sm" disabled={!ready || game.pieces < pencilPrice(game) || game.pencil >= 1000} onclick={() => purchase('pencil')} aria-label={`เหลาดินสอ ราคา ${pencilPrice(game)} ชิ้น`}>{game.pencil >= 1000 ? 'เต็มแล้ว' : `${format(pencilPrice(game))} ชิ้น`}</button>
			</div>
			<h3 class="text-sm font-semibold mt-6 mb-3">ผู้ช่วยผลิตชิ้นส่วนอัตโนมัติ</h3>
			<div class="grid gap-3">
				{#each helpers as helper, index}
					{@const cost = price(helper.base, game.owned[index])}
					<div class="upgrade border border-base-300">
						<div><h4 class="font-semibold">{helper.mark} {helper.name}</h4><p class="text-xs botanical-muted mt-1">{helper.description}</p><p class="text-sm mt-2">+{helper.rate} ชิ้น/วินาที · มี {game.owned[index]}</p></div>
						<button type="button" class="btn btn-primary btn-sm" disabled={!ready || game.pieces < cost || game.owned[index] >= 1000} onclick={() => purchase(index)} aria-label={`ซื้อ${helper.name} ราคา ${cost} ชิ้น`}>{game.owned[index] >= 1000 ? 'เต็มแล้ว' : `${format(cost)} ชิ้น`}</button>
					</div>
				{/each}
			</div>
			<p class="mt-5 text-sm min-h-12" role="status" aria-live="polite" aria-atomic="true">{message}</p>
		</Surface>
	</div>
	<div class="flex flex-wrap justify-between items-center gap-3 mt-5">
		<p class="text-xs botanical-muted">บันทึกในเครื่องทุก 5 วินาที · ผลิตขณะปิดเกมได้สูงสุด 8 ชั่วโมง</p>
		<button type="button" class="btn btn-ghost btn-sm" disabled={!ready} onclick={() => resetDialog.showModal()}>เริ่มใหม่</button>
	</div>
	<dialog bind:this={resetDialog} class="modal">
		<div class="modal-box bg-base-100 text-base-content">
			<h2 class="font-semibold text-lg">เริ่มเวิร์กช็อปใหม่?</h2>
			<p class="py-4">ชิ้นส่วนและอัปเกรดทั้งหมดของเกมนี้จะถูกล้าง</p>
			<div class="modal-action"><button class="btn" onclick={() => resetDialog.close()}>ยกเลิก</button><button class="btn btn-error" onclick={restart}>ยืนยันเริ่มใหม่</button></div>
		</div>
		<form method="dialog" class="modal-backdrop"><button>ปิด</button></form>
	</dialog>
</div>

<style>
	.balance { font-size: clamp(2.5rem, 7vw, 4rem); line-height: 1.25; margin: .6rem 0; overflow-wrap: anywhere; }
	.piece-stage { position: relative; display: grid; place-items: center; min-height: 270px; }
	.piece-button { width: 240px; height: 240px; color: var(--color-primary); cursor: pointer; border-radius: 50%; background: var(--color-base-200); border: 1px solid var(--color-base-300); touch-action: manipulation; transition: transform 160ms cubic-bezier(.2,.8,.2,1); }
	.piece-button svg { width: 90%; height: 90%; margin: auto; filter: drop-shadow(0 7px 0 var(--color-base-300)); }
	.piece-button:active { transform: scale(.94); }
	.piece-button:focus-visible { outline: 3px solid var(--color-primary); outline-offset: 5px; }
	.piece-button:disabled { cursor: wait; }
	.click-gain { position: absolute; pointer-events: none; top: 24px; right: 20%; font-size: 1.5rem; font-weight: 700; color: var(--color-primary); animation: gain 600ms cubic-bezier(.16,1,.3,1) both; }
	.upgrade { display: flex; align-items: center; justify-content: space-between; gap: 12px; border-radius: 16px; padding: 16px; }
	.upgrade .btn { flex-shrink: 0; }
	@keyframes gain { from { opacity: 1; transform: translateY(10px) scale(.8); } to { opacity: 0; transform: translateY(-35px) scale(1); } }
	@media (max-width: 380px) { .upgrade { align-items: flex-start; flex-direction: column; } }
	@media (prefers-reduced-motion: reduce) { .piece-button { transition: none; } .piece-button:active { transform: none; } .click-gain { animation: none; display: none; } }
</style>
