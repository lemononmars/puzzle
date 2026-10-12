<script lang="ts">
	import { preventDefault } from 'svelte/legacy';


	import {
		MoreHorizontalIcon,
		HomeIcon,
		PlayCircleIcon,
		ShoppingCartIcon,
		BriefcaseIcon,
		MailIcon,
		ToolIcon,
		BookOpenIcon,
		UserIcon,
		Edit3Icon,
		XIcon
	} from 'svelte-feather-icons';
	import { username } from '#lib/store/index.js';
	import { page } from '$app/state';
	import BottomSheet from '#lib/components/ui/BottomSheet.svelte';
	import { afterNavigate } from '$app/navigation';

	const icons = [HomeIcon, PlayCircleIcon, ToolIcon, BookOpenIcon, ShoppingCartIcon, BriefcaseIcon, MailIcon];
	const menus = ['หน้าแรก', 'ปริศนา', 'เครื่องมือ', 'ข้อมูล', 'ร้านค้า', 'ผลงาน', 'ร่วมงาน'];
	const links = ['', 'puzzles', 'tools', 'resources', 'shop', 'portfolio', 'contact'];

	let openMore = $state(false);
	afterNavigate(() => openMore = false);
	let openNameModal = $state(false);
	let tempName = $state('');

	let currentPath = $derived(page.url.pathname);
	let isActive = $derived((path: string) => {
		if (path === '' && currentPath === '/') return true;
		if (path !== '' && (currentPath === '/' + path || currentPath.startsWith('/' + path + '/'))) return true;
		return false;
	});

	function handleOpenModal() {
		openMore = false;
		tempName = $username || 'Guest';
		openNameModal = true;
	}

	function handleSaveName() {
		const trimmed = tempName.trim();
		if (trimmed) {
			username.set(trimmed);
		}
		openNameModal = false;
	}
</script>

<!-- Mobile Navigation Bar -->
<nav aria-label="เมนูหลักบนมือถือ" class="flex lg:hidden w-full bg-base-100/95 text-base-content backdrop-blur-md border-t border-base-300 items-center p-1 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
	{#each ['หน้าแรก', 'เล่น', 'สร้าง', 'เรียนรู้'] as menu, i}
		{@const Icon = icons[i]}
		<a href="/{links[i]}" aria-current={isActive(links[i]) ? 'page' : undefined}
			class="flex-1 min-w-0 min-h-12 flex flex-col items-center justify-center gap-1 rounded-xl {isActive(links[i]) ? 'bg-primary text-primary-content font-bold' : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'}">
			<Icon size="20" />
			<span class="text-xs">{menu}</span>
		</a>
	{/each}
	<button type="button" aria-haspopup="dialog" aria-expanded={openMore} onclick={() => openMore = true}
		class="flex-1 min-w-0 min-h-12 flex flex-col items-center justify-center gap-1 rounded-xl {openMore || ['shop', 'portfolio', 'contact'].some(isActive) ? 'bg-primary text-primary-content font-bold' : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'}">
		<MoreHorizontalIcon size="20" />
		<span class="text-xs">เพิ่มเติม</span>
	</button>
</nav>

<BottomSheet bind:open={openMore} title="เพิ่มเติม">
	<div class="space-y-4">
		<section aria-labelledby="more-about">
			<h3 id="more-about" class="botanical-eyebrow mb-2">เกี่ยวกับฉัน</h3>
			{#each [5, 6] as i}
				{@const Icon = icons[i]}
				<a href="/{links[i]}" onclick={() => openMore = false} aria-current={isActive(links[i]) ? 'page' : undefined}
					class="flex items-center gap-3 min-h-12 px-3 rounded-xl {isActive(links[i]) ? 'bg-primary text-primary-content' : 'hover:bg-base-200 text-base-content'}">
					<Icon size="20" />{menus[i]}
				</a>
			{/each}
		</section>
		<section aria-labelledby="more-shop">
			<h3 id="more-shop" class="botanical-eyebrow mb-2">ร้านค้า</h3>
			<a href="/shop" onclick={() => openMore = false} aria-current={isActive('shop') ? 'page' : undefined}
				class="flex items-center gap-3 min-h-12 px-3 rounded-xl {isActive('shop') ? 'bg-primary text-primary-content' : 'hover:bg-base-200 text-base-content'}">
				<ShoppingCartIcon size="20" />หนังสือปริศนา
			</a>
		</section>
		<section aria-labelledby="more-player">
			<h3 id="more-player" class="botanical-eyebrow mb-2">ตั้งค่าผู้เล่น</h3>
			<button type="button" onclick={handleOpenModal} class="flex items-center gap-3 w-full min-h-12 px-3 rounded-xl hover:bg-base-200 text-base-content text-left">
				<UserIcon size="20" /><span>เปลี่ยนชื่อผู้เล่น <span class="text-base-content/60">({$username || 'Guest'})</span></span>
			</button>
		</section>
	</div>
</BottomSheet>

<!-- Desktop & Main Navbar -->
<div class="hidden lg:flex w-full bg-base-100/80 backdrop-blur border-b border-base-300 px-8 py-3 justify-between items-center max-w-[1180px] mx-auto rounded-b-2xl shadow-sm">
	<div class="flex items-center gap-4">
		<a href="/" class="flex items-center gap-3 group">
			<span class="grid place-items-center w-9 h-9 rounded-full bg-primary text-primary-content text-xl" aria-hidden="true">✦</span>
			<span class="font-extrabold text-xl text-primary tracking-tight">Puzzle</span>
		</a>

		<nav class="flex items-center gap-1">
			{#each menus as menu, i}
				{@const Icon = icons[i]}
				<a
					href="/{links[i]}"
					class="flex items-center gap-2 px-2 py-2 rounded-xl text-xs font-semibold transition duration-150 {isActive(links[i])
						? 'bg-primary text-primary-content shadow-md shadow-primary/20'
						: 'hover:bg-base-200 text-base-content/70 hover:text-base-content'}"
				>
					<Icon size="16" />
					<span>{menu}</span>
				</a>
			{/each}
		</nav>
	</div>

	<div class="flex items-center gap-3">

			<button
				onclick={handleOpenModal}
				class="btn btn-primary text-primary-content btn-sm font-bold rounded-xl shadow-md shadow-primary/20 gap-2"
				title="เปลี่ยนชื่อผู้ใช้ในเครื่อง"
			>
				<UserIcon size="16" />
				<span class="font-bold truncate max-w-[140px]">{$username || 'Guest'}</span>
			</button>

	</div>
</div>

<!-- Change Name Modal -->
{#if openNameModal}
	<div class="modal modal-open z-50">
		<div class="modal-box bg-base-100 text-base-content text-base-content border border-base-300 rounded-3xl p-6 relative max-w-md text-left">
			<button
				onclick={() => openNameModal = false}
				class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-base-content hover:bg-base-200"
			>
				<XIcon size="18" />
			</button>

			<div class="flex items-center gap-3 mb-4">
				<div class="w-10 h-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
					<Edit3Icon size="20" />
				</div>
				<div>
					<h3 class="font-extrabold text-lg text-base-content">ตั้งชื่อผู้เล่น (Guest Name)</h3>
					<p class="text-xs text-base-content/70">ชื่อนี้จะบันทึกในเครื่อง (localStorage) สำหรับส่งคะแนน</p>
				</div>
			</div>

			<form onsubmit={preventDefault(handleSaveName)} class="flex flex-col gap-4 mt-2">
				<div class="flex flex-col gap-2 w-full">
					<label for="guest-name-input" class="label text-xs font-bold text-base-content px-0">
						<span>ชื่อที่ต้องการแสดง:</span>
					</label>
					<input
						id="guest-name-input"
						type="text"
						bind:value={tempName}
						placeholder="ใส่ชื่อผู้เล่น..."
						class="input  w-full bg-base-300 text-base-content border-base-300 font-bold focus:border-primary"
					/>
				</div>

				<div class="flex items-center justify-between gap-3 pt-2">


					<button type="submit" class="btn btn-primary text-primary-content font-bold btn-sm rounded-xl px-4">
						บันทึก
					</button>
				</div>
			</form>
		</div>

		<div
			class="modal-backdrop bg-black/60"
			onclick={() => openNameModal = false}
		></div>
	</div>
{/if}
