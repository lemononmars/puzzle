<script lang="ts">
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
import BookOpenIcon from '@lucide/svelte/icons/book-open';
import SearchIcon from '@lucide/svelte/icons/search';
import ZapIcon from '@lucide/svelte/icons/zap';
import DatabaseIcon from '@lucide/svelte/icons/database';
import LayersIcon from '@lucide/svelte/icons/layers';
	import { Q1, Q2, Q3 } from '#lib/utils/dict_pythainlp.js';

	const title = 'คู่มือการใช้งาน Thai Word Search';
	const description = 'อธิบายหลักการทำงานและไวยากรณ์การค้นหาคำภาษาไทยอย่างละเอียด';

	const syntaxList = [
		{
			symbol: '.',
			name: 'ตัวอักษรใดก็ได้ 1 ตัว (Wildcard)',
			desc: 'แทนตำแหน่งตัวอักษร 1 ตำแหน่ง',
			example: 'ส..น',
			result: 'สงวน, สถาน, สุทัศน์'
		},
		{
			symbol: '*',
			name: 'ตัวอักษรใดก็ได้ กี่ตัวก็ได้ (Filler)',
			desc: 'แทนข้อความความยาวเท่าใดก็ได้ (0 ตัวขึ้นไป)',
			example: 'สับ*',
			result: 'สับไก, สับราง, สับปะรด'
		},
		{
			symbol: '[...]',
			name: 'เลือกตัวอักษรบางตัว (Character Class)',
			desc: 'กำหนดกลุ่มตัวอักษรที่ยอมรับในตำแหน่งนั้น',
			example: '[ใไโ]ก.',
			result: 'โกก, ไกร, ใกล้'
		},
		{
			symbol: '{...}',
			name: 'ค้นหาเฉพาะตัวอักษรที่กำหนด (Subset)',
			desc: 'คำนั้นต้องสร้างจากกลุ่มตัวอักษรในวงเล็บปีกกาเท่านั้น',
			example: '{บนมา}',
			result: 'มัน, นมนาน, บนบาน'
		},
		{
			symbol: '{...}+N',
			name: 'Subset + ตัวอักษรอืนได้ N ตัว',
			desc: 'อนุญาตให้มีอักษรนอกกลุ่มได้ไม่เกิน N ตัว',
			example: '{บนมา}+1',
			result: 'รามา, สนามบิน, ขนานนาม'
		},
		{
			symbol: '/',
			name: 'การสลับอักษร (Anagram)',
			desc: 'ค้นหาคำที่เกิดจากการสลับตัวอักษรชุดนี้',
			example: '/กลม',
			result: 'กมล, มกุล, มีลูก'
		},
		{
			symbol: 'A-Z',
			name: 'ตัวแปรอ้างอิงข้อความเดียวกัน (Variables)',
			desc: 'ใช้ตัวอักษรภาษาอังกฤษใหญ่เป็นตัวแปรแทนลำดับอักษรเดียวกัน',
			example: 'AA',
			result: 'นานา, กก'
		},
		{
			symbol: '~A-Z',
			name: 'ตัวแปรกลับทิศทาง (Reversed Variable)',
			desc: 'แทนตัวแปรเดิมแต่ย้อนกลับทิศทาง (เช่น พาลินโดรม)',
			example: 'A~A',
			result: 'การราก'
		},
		{
			symbol: ';',
			name: 'สมการชุดคำ (System of Equations)',
			desc: 'เชื่อมความสัมพันธ์ระหว่างหลายรูปแบบคำด้วยตัวแปร',
			example: 'AB; BA',
			result: 'กมลา; มลาก, กู้เงิน; เงินกู้'
		},
		{
			symbol: '& / | / ! / ^',
			name: 'ตัวดำเนินการตรรกศาสตร์ (Logic Operators)',
			desc: '& (และ), | (หรือ), ! (ยกเว้นรูปแบบ), ^ (ยกเว้นตัวอักษร)',
			example: '/*ฮ & !ฮ*',
			result: 'เก๊กฮวย, นกฮูก'
		}
	];
</script>

<svelte:head>
	<title>{title} | Chi Fun</title>
	<meta name="description" content={description} />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8 text-base-content">
	<div class="mb-6 flex items-center justify-between">
		<a href="/tools/thwordsearch" class="btn btn-outline btn-sm gap-2">
			<ArrowLeftIcon size={18} />
			<span>กลับหน้า Thai Word Search</span>
		</a>
	</div>

	<div class="botanical-card bg-base-200/50 backdrop-blur-lg border border-base-300 rounded-3xl p-6 lg:p-10 shadow-2xl mb-8">
		<div class="flex items-center gap-3 text-primary mb-3">
			<BookOpenIcon size={32} />
			<h1 class="text-3xl lg:text-4xl font-extrabold tracking-tight">คู่มือการใช้งาน Thai Word Search</h1>
		</div>
		<p class="text-base-content/80 text-lg leading-relaxed">
			เครื่องมือค้นหารูปแบบคำภาษาไทยขั้นสูง (Pattern-Matching Engine) ออกแบบมาสำหรับการแก้ปริศนาอักษรไขว้, คำซ่อน, Anagram, สมการคำ และงานวิเคราะห์โครงสร้างภาษาไทย
		</p>
	</div>

	<!-- Section 1: Core Architecture -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
		<div class="botanical-card bg-base-100 border border-base-300 rounded-2xl p-6 shadow-md flex flex-col">
			<div class="flex items-center gap-3 text-secondary mb-3">
				<ZapIcon size={24} />
				<h3 class="font-bold text-xl">Trie Engine</h3>
			</div>
			<p class="text-sm text-base-content/70 leading-relaxed flex-grow">
				สำหรับรูปแบบคำพื้นฐาน (พยัญชนะและจุด) ระบบใช้โครงสร้างข้อมูล <strong>Prefix Trie</strong> ทำให้สามารถค้นหาคำตรงกันได้ในเวลาระดับกิโลเฮิรตซ์ (Microseconds)
			</p>
		</div>

		<div class="botanical-card bg-base-100 border border-base-300 rounded-2xl p-6 shadow-md flex flex-col">
			<div class="flex items-center gap-3 text-accent-content mb-3">
				<LayersIcon size={24} />
				<h3 class="font-bold text-xl">Thai Grapheme Split</h3>
			</div>
			<p class="text-sm text-base-content/70 leading-relaxed flex-grow">
				รองรับอักขระภาษาไทยโดยรวบรวมพยัญชนะ สระบน-ล่าง และวรรณยุกต์เข้าเป็นหน่วยอักขระ (Grapheme Cluster) เพื่อให้นับจำนวนตัวอักษรได้ตรงตามหลักภาษาจริง
			</p>
		</div>

		<div class="botanical-card bg-base-100 border border-base-300 rounded-2xl p-6 shadow-md flex flex-col">
			<div class="flex items-center gap-3 text-info-content mb-3">
				<DatabaseIcon size={24} />
				<h3 class="font-bold text-xl">Popularity Index</h3>
			</div>
			<p class="text-sm text-base-content/70 leading-relaxed flex-grow">
				จัดลำดับคำตามดรรชนีความถี่การใช้งานในคลังข้อมูลภาษาไทย แบ่งออกเป็น 4 ระดับ (ใช้บ่อยมาก, ใช้บ่อย, ปานกลาง, พบน้อย) ช่วยแยกคำศัพท์ทั่วไปออกจากคำโบราณ
			</p>
		</div>
	</div>

	<!-- Section 2: Syntax Guide -->
	<div class="botanical-card bg-base-100 border border-base-300 rounded-3xl p-6 lg:p-8 shadow-lg mb-10">
		<h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
			<SearchIcon size={24} class="text-primary" />
			<span>ไวยากรณ์การค้นหา (Search Syntax Reference)</span>
		</h2>

		<div class="overflow-x-auto">
			<table class="table w-full">
				<thead>
					<tr>
						<th class="bg-base-200">สัญลักษณ์</th>
						<th class="bg-base-200">ชื่อและความหมาย</th>
						<th class="bg-base-200">ตัวอย่าง</th>
						<th class="bg-base-200">ผลลัพธ์ที่ได้</th>
					</tr>
				</thead>
				<tbody>
					{#each syntaxList as item}
						<tr class="hover">
							<td class="font-mono text-primary font-bold text-base">{item.symbol}</td>
							<td>
								<div class="font-bold">{item.name}</div>
								<div class="text-xs text-base-content/60">{item.desc}</div>
							</td>
							<td>
								<code class="px-2 py-1 bg-base-200 rounded font-mono text-sm text-accent-content">{item.example}</code>
							</td>
							<td class="text-sm text-base-content/80">{item.result}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Section 3: Special Options -->
	<div class="botanical-card bg-base-100 border border-base-300 rounded-3xl p-6 lg:p-8 shadow-lg mb-10">
		<h2 class="text-2xl font-bold mb-4">ตัวเลือกเสริม (Search Options)</h2>
		<div class="space-y-4">
			<div class="botanical-card p-4 border border-base-200 rounded-2xl bg-base-200/30">
				<h4 class="font-bold text-lg text-primary mb-1">1. นับอักษรบนล่าง (Strict Vowel & Tone Matching)</h4>
				<p class="text-sm text-base-content/70">
					เมื่อเปิดใช้งาน สระและวรรณยุกต์จะถือเป็นตัวอักษรแยกต่างหากตรงตามตำแหน่ง แต่หากปิดใช้งาน ระบบจะผ่อนปรนให้ค้นหาคำที่พยัญชนะตรงกันโดยไม่สนสระบนล่างในบางสัญลักษณ์
				</p>
			</div>

			<div class="botanical-card p-4 border border-base-200 rounded-2xl bg-base-200/30">
				<h4 class="font-bold text-lg text-secondary mb-1">2. รวมหัวข้อใน Wikipedia (Wikipedia Dictionary)</h4>
				<p class="text-sm text-base-content/70">
					ขยายฐานข้อมูลจากพจนานุกรมหลัก ให้ครอบคลุมชื่อเฉพาะ คำทับศัพท์ ชื่อสถานที่ และบุคคลสำคัญ โดยใช้อ้างอิงดรรชนีหัวข้อบทความจากคลังข้อมูล <strong>Thai Wikipedia (Wikipedia Database Dump ภาษาไทย)</strong>
				</p>
			</div>

			<div class="botanical-card p-4 border border-base-200 rounded-2xl bg-base-200/30">
				<h4 class="font-bold text-lg text-accent-content mb-1">3. เรียงตามความนิยม (Popularity Sorting & PyThaiNLP)</h4>
				<p class="text-sm text-base-content/70">
					เรียงลำดับคำตามความถี่การใช้งานจริงในภาษาไทย (อ้างอิงจากคลังข้อมูลความถี่คำ PyThaiNLP TNC Corpus) โดยแบ่งช่วงคำนวณด้วยค่าสถิติควอร์ไทล์ (Quartiles: Q1, Q2, Q3) ดังนี้:
				</p>
				<ul class="list-disc list-inside text-sm text-base-content/80 mt-2 space-y-1.5 font-mono">
					<li><strong>🔥🔥🔥 ใช้บ่อยมาก</strong>: ความถี่ ≥ {Q3.toLocaleString()} (Q3 Cutoff / Top 25%)</li>
					<li><strong>🔥🔥 ใช้บ่อย</strong>: ความถี่ {Q2.toLocaleString()} ถึง {Q3.toLocaleString()} (Q2 – Q3 / ช่วง 50% - 75%)</li>
					<li><strong>🔥 ปานกลาง</strong>: ความถี่ {Q1.toLocaleString()} ถึง {Q2.toLocaleString()} (Q1 – Q2 / ช่วง 25% - 50%)</li>
					<li><strong>พบน้อย</strong>: ความถี่ &lt; {Q1.toLocaleString()} (ต่ำกว่า Q1 / Bottom 25%)</li>
				</ul>
			</div>
		</div>
	</div>

	<div class="text-center">
		<a href="/tools/thwordsearch" class="btn btn-primary btn-lg rounded-2xl px-8 shadow-lg">
			ลองใช้งานเลย
		</a>
	</div>
</div>
