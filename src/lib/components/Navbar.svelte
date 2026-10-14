<script lang="ts">
	import { preventDefault } from 'svelte/legacy';
	import PWAInstallSettings from '#lib/components/PWAInstallSettings.svelte';


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
 import catalog from '#lib/data/catalog.json';
	import BottomSheet from '#lib/components/ui/BottomSheet.svelte';
	import { afterNavigate } from '$app/navigation';

	const icons = [HomeIcon, PlayCircleIcon, ToolIcon, BookOpenIcon, ShoppingCartIcon, BriefcaseIcon, MailIcon];
	const menus = ['หน้าแรก', 'ปริศนา', 'เครื่องมือ', 'ค้น', 'ร้านค้า', 'ผลงาน', 'ร่วมงาน'];
	const links = ['', 'puzzles', 'tools', 'resources', 'shop', 'portfolio', 'contact'];

	let openMore = $state(false);
 let desktopMenu = $state<number | null>(null);
 let section = $state(3);
 const compact = [
 { title:'เล่น', links:[['/puzzles','ห้องเล่นทั้งหมด'],...catalog.puzzles.map(group => ['/puzzles/'+group.id,group.title])] },
 { title:'สร้าง', links:[['/tools','กล่องเครื่องมือทั้งหมด'],...catalog.tools.map(group => ['/tools/'+group.id,group.title])] },
 { title:'ค้น', links:[['/resources','ข้อมูลทั้งหมด'],...catalog.resources.map(group => ['/resources/'+group.id,group.title])] },
 { title:'เพิ่มเติม', links:[['/portfolio','ผลงาน / เกี่ยวกับฉัน'],['/contact','ติดต่อร่วมงาน'],['/shop','ร้านหนังสือปริศนา']] }
 ];
 function pageMark(href: string) { const puzzleGroup = catalog.puzzles.find(group => href === "/puzzles/"+group.id); const toolGroup = catalog.tools.find(group => href === "/tools/"+group.id); if (puzzleGroup || toolGroup) return (puzzleGroup || toolGroup)!.mark; return ({'/puzzles':'▦','/puzzles/deduction':'◈','/puzzles/logicpuzzle':'▧','/puzzles/spellingquiz':'ก','/tools':'⚒','/tools/wordsearch':'⌕','/tools/crossword':'▦','/tools/pentomino':'▰','/resources':'▤','/resources/logictutorial':'▧','/resources/spellingdictionary':'ก','/resources/knowledge':'◈','/resources/ciphers':'⌘','/resources/mechanics':'⚙','/portfolio':'✦','/contact':'✉','/shop':'▤'} as Record<string,string>)[href] ?? '•'; }
 function openSection(index: number) { if (window.matchMedia("(min-width:1024px)").matches) { desktopMenu = index; } else { section = index; openMore = true; } }
	afterNavigate(() => { openMore = false; desktopMenu = null; });
	let openNameModal = $state(false);
	let settingsDialog: HTMLDialogElement;
	$effect(() => {
		if (!settingsDialog) return;
		if (openNameModal) settingsDialog.showModal();
		else settingsDialog.close();
	});
	let tempName = $state('');

	let currentPath = $derived(page.url.pathname);
	let isActive = $derived((path: string) => {
		if (path === '' && currentPath === '/') return true;
		if (path !== '' && (currentPath === '/' + path || currentPath.startsWith('/' + path + '/'))) return true;
		return false;
	});

	function handleOpenModal() {
 desktopMenu = null;
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

<svelte:window onkeydown={(event) => { if (event.key === 'Escape') desktopMenu = null; }} />
<div class="compact-navbar bg-base-100 text-base-content">
 <a href="/" class="brand" aria-label="Puzzle หน้าแรก"><span class="bg-primary text-primary-content" aria-hidden="true">✦</span><strong>Puzzle</strong></a>
 <nav aria-label="เมนูหลัก" class="compact-links">
  <a href="/" aria-current={currentPath === '/' ? 'page' : undefined} class:active={currentPath === '/'}><HomeIcon size="19" /><span>หน้าแรก</span></a>
  {#each compact as group, i}
   {@const Icon = [PlayCircleIcon, ToolIcon, BookOpenIcon, MoreHorizontalIcon][i]}
   {@const active = i === 3 ? ['shop','portfolio','contact'].some(isActive) : isActive(links[i + 1])}
   <div class="nav-group" role="group" aria-label={group.title} onpointerenter={() => { if (window.matchMedia('(min-width:1024px)').matches) desktopMenu = i; }} onpointerleave={() => desktopMenu = null} onfocusout={(event) => { if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) desktopMenu = null; }}>
    <button type="button" aria-expanded={desktopMenu === i || (openMore && section === i)} aria-controls={desktopMenu === i ? 'desktop-submenu-' + i : undefined} class:active={active || desktopMenu === i || (openMore && section === i)} onclick={() => openSection(i)}><Icon size="19" /><span>{group.title}</span><span class="chevron" aria-hidden="true">⌄</span></button>
    {#if desktopMenu === i}<div class="dropdown-bridge" id={'desktop-submenu-' + i}><nav class="dropdown-panel bg-base-100 text-base-content" aria-label={group.title + ' — เมนูย่อย'}>
     {#each group.links as [href, label]}<a {href} onclick={() => desktopMenu = null} aria-current={currentPath === href ? 'page' : undefined}><span class="page-mark" aria-hidden="true">{pageMark(href)}</span>{label}</a>{/each}
     {#if i === 3}<button type="button" onclick={handleOpenModal}><UserIcon size="16" />ตั้งค่าผู้เล่น: {$username || 'Guest'}</button>{/if}
    </nav></div>{/if}
   </div>
  {/each}
 </nav>
</div>
<BottomSheet bind:open={openMore} title={compact[section].title}>
 <nav aria-label={compact[section].title} class="grid gap-2">
  {#each compact[section].links as [href, label]}
   <a {href} onclick={() => openMore = false} aria-current={currentPath === href ? 'page' : undefined} class="flex items-center justify-between min-h-12 px-4 rounded-xl hover:bg-base-200 text-base-content"><span aria-hidden="true">{pageMark(href)}</span><span>{label}</span></a>
  {/each}
  {#if section === 3}<button type="button" onclick={handleOpenModal} class="btn btn-ghost justify-start"><UserIcon size="18" />ตั้งค่าผู้เล่น: {$username || 'Guest'}</button>{/if}
 </nav>
</BottomSheet>
<style>
 .nav-group { position:relative; } .dropdown-bridge { position:absolute; top:100%; right:0; width:290px; padding-top:8px; } .dropdown-panel { border:1px solid var(--color-base-300); border-radius:20px; padding:8px; box-shadow:0 12px 30px #364b3e18; } .dropdown-panel > :is(a,button) { display:flex; align-items:center; justify-content:flex-start; gap:10px; text-align:left; width:100%; min-height:36px; padding:7px 10px; border-radius:12px; font-size:13px; } .dropdown-panel > :is(a,button):hover { background:var(--color-base-200); }
 @media(max-width:1023px) { .nav-group { flex:1; min-width:0; } .nav-group > button { width:100%; } .dropdown-bridge { display:none; } }
 .compact-navbar { display:flex; align-items:center; justify-content:space-between; gap:24px; max-width:1180px; margin:auto; padding:10px 24px; border:1px solid var(--color-base-300); border-radius:0 0 24px 24px; }
 .brand { display:flex; align-items:center; gap:10px; } .brand > span { display:grid; place-items:center; width:34px; height:34px; border-radius:50%; font-size:22px; }
 .compact-links { display:flex; gap:6px; } .compact-links > a, .nav-group > button { display:flex; align-items:center; justify-content:center; gap:8px; min-height:44px; padding:8px 15px; border-radius:16px; font-size:13px; cursor:pointer; }
 .compact-links > a:hover, .nav-group > button:hover { background:var(--color-base-200); } .compact-links > a.active, .nav-group > button.active { background:var(--color-primary); color:var(--color-primary-content); } .compact-links > a.active:hover, .nav-group > button.active:hover { background:var(--color-primary); }
 @media(max-width:1023px) { .compact-navbar { padding:4px 4px max(4px,env(safe-area-inset-bottom)); border-radius:0; border-width:1px 0 0; } .brand,.chevron { display:none; } .compact-links { width:100%; gap:4px; } .compact-links > a, .nav-group > button { flex:1; flex-direction:column; gap:3px; padding:6px 2px; font-size:11px; min-height:52px; } }
</style>

<!-- Player settings stay mounted to capture installation availability without a popup. -->
<dialog bind:this={settingsDialog} class="modal z-50" aria-labelledby="player-settings-heading" onclose={() => openNameModal = false} oncancel={() => openNameModal = false}>
		<div class="botanical-card modal-box bg-base-100 text-base-content border border-base-300 rounded-3xl p-6 relative max-w-md text-left">
			<button
				onclick={() => openNameModal = false}
				aria-label="ปิดการตั้งค่า"
				class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-base-content hover:bg-base-200"
			>
				<XIcon size="18" />
			</button>

			<div class="flex items-center gap-3 mb-4">
				<div class="w-10 h-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
					<Edit3Icon size="20" />
				</div>
				<div>
					<h3 id="player-settings-heading" class="font-extrabold text-lg text-base-content">ตั้งค่าผู้เล่น</h3>
					<p class="text-xs text-base-content/70">บันทึกชื่อไว้ในเครื่องนี้ สำหรับแสดงคะแนน</p>
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
			<PWAInstallSettings />
		</div>

		<form method="dialog" class="modal-backdrop"><button aria-label="ปิดการตั้งค่า">ปิด</button></form>
</dialog>
