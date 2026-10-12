<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import {
		RadioIcon,
		KeyIcon,
		BookOpenIcon,
		VideoIcon,
		InfoIcon,
		LayersIcon
	} from 'svelte-feather-icons';

	const mediaResources = [
		{
			name: 'Codebreaker Podcast',
			path: '/resources/podcast',
			description: 'พอดแคสต์เกมไขปริศนา Escape Room และเรื่องราวน่าสนใจ',
			icon: RadioIcon,
			color: 'text-secondary'
		},
		{
			name: 'Logic Puzzle Tutorials',
			path: '/resources/logictutorial',
			description: 'คลิปและคู่มือสอนวิธีเล่น 21 ปริศนาตรรกะสไตล์ญี่ปุ่น (Nikoli)',
			icon: VideoIcon,
			color: 'text-secondary'
		}
	];

	const referenceResources = [
		{
			name: 'Cipher Library',
			path: '/resources/ciphers',
			description:
				'คลังรหัสลับพื้นฐาน (Pigpen, Morse, Caesar, Atbash, Vigenère, A1Z26, Polybius, Rail Fence ฯลฯ)',
			icon: KeyIcon,
			color: 'text-primary'
		},
		{
			name: 'Spelling Dictionary',
			path: '/resources/spellingdictionary',
			description: 'พจนานุกรมคำศัพท์ภาษาไทยที่มักสะกดผิดบ่อย',
			icon: BookOpenIcon,
			color: 'text-primary'
		},
		{
			name: 'Puzzle Knowledge',
			path: '/resources/knowledge',
			description:
				'ข้อมูลอ้างอิงที่ใช้บ่อยในพัซเซิลญี่ปุ่น (วันในสัปดาห์, 12 ราศี, ระบบสุริยะ, ทิศคันจิ, โน้ตดนตรี ฯลฯ)',
			icon: InfoIcon,
			color: 'text-primary'
		},
		{
			name: 'Puzzle Mechanic',
			path: '/resources/mechanics',
			description: 'สารานุกรมกลไกปริศนา 94 รูปแบบ พร้อมชื่อและคำอธิบายภาษาอังกฤษ ไทย และญี่ปุ่น',
			icon: LayersIcon,
			color: 'text-primary'
		}
	];
</script>

<svelte:head>
	<title>Puzzle | แหล่งความรู้ & ทรัพยากร 📚</title>
	<meta
		name="description"
		content="ศูนย์รวมความรู้สำหรับนักไขปริศนา พอดแคสต์ สื่อสอน แหล่งข้อมูลอ้างอิง คลังรหัสลับ และพจนานุกรม"
	/>
</svelte:head>

<div class="flex flex-col gap-8 w-full max-w-5xl mx-auto px-4 py-8 select-none">
	<PageHeading title="แหล่งความรู้ & ทรัพยากร" description="ศูนย์รวมความรู้ พอดแคสต์ สื่อการสอน และคลังรหัสลับ" eyebrow="LEARN THROUGH PLAY" />

	<!-- Section 1: สื่อและพอดแคสต์ (Podcasts & Media) -->
	<section class="space-y-4">
		<div class="flex items-center gap-2 border-b border-base-300 pb-2">
			<h2 class="text-xl font-extrabold text-secondary">สื่อและพอดแคสต์ (Podcasts & Media)</h2>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each mediaResources as tool}
				<a
					href={tool.path}
					class="card bg-base-100 text-base-content hover:bg-base-100 text-base-content transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group border border-base-300 shadow-md block h-full rounded-2xl overflow-hidden"
				>
					<div class="card-body flex flex-row items-center text-left p-4 sm:p-5 gap-4">
						<div
							class="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-base-100 text-base-content shadow-inner flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-base-300"
						>
							<svelte:component this={tool.icon} size="24" class={tool.color} />
						</div>
						<div class="flex flex-col gap-0.5 flex-1 min-w-0">
							<h3
								class="card-title text-base sm:text-lg font-bold text-base-content group-hover:text-secondary transition-colors line-clamp-1"
							>
								{tool.name}
							</h3>
							<p class="text-xs sm:text-sm text-base-content/70 font-light line-clamp-2">
								{tool.description}
							</p>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- Section 2: แหล่งข้อมูลอ้างอิง (Reference Resources) -->
	<section class="space-y-4">
		<div class="flex items-center gap-2 border-b border-base-300 pb-2">
			<h2 class="text-xl font-extrabold text-primary">
				แหล่งข้อมูลอ้างอิง (Reference Resources)
			</h2>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each referenceResources as tool}
				<a
					href={tool.path}
					class="card bg-base-100 text-base-content hover:bg-base-100 text-base-content transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group border border-base-300 shadow-md block h-full rounded-2xl overflow-hidden"
				>
					<div class="card-body flex flex-row items-center text-left p-4 sm:p-5 gap-4">
						<div
							class="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-base-100 text-base-content shadow-inner flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-base-300"
						>
							<svelte:component this={tool.icon} size="24" class={tool.color} />
						</div>
						<div class="flex flex-col gap-0.5 flex-1 min-w-0">
							<h3
								class="card-title text-base sm:text-lg font-bold text-base-content group-hover:text-primary transition-colors line-clamp-1"
							>
								{tool.name}
							</h3>
							<p class="text-xs sm:text-sm text-base-content/70 font-light line-clamp-2">
								{tool.description}
							</p>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</section>
</div>
