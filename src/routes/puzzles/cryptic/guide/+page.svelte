<script lang="ts">
	import PageHeading from '#lib/components/ui/PageHeading.svelte';
	import Surface from '#lib/components/ui/Surface.svelte';
	const basics = [
		['Anagram · สลับอักษร', 'จัดตัวอักษรใหม่'],
		['Charade · ต่อคำ', 'นำชิ้นคำมาเรียงต่อกัน'],
		['Container · แทรกคำ', 'ใส่ตัวอักษรชุดหนึ่งในอีกชุด'],
		['Deletion · ตัดคำ', 'นำตัวอักษรที่ระบุออก'],
		['Reversal · ย้อนกลับ', 'อ่านตัวอักษรจากท้ายไปหน้า'],
		['Hidden answer · ซ่อนคำ', 'ค้นตัวอักษรที่อยู่ในข้อความ'],
		['Initial letters · อักษรต้น', 'หยิบตัวแรกของแต่ละคำ'],
		['Alternate letters · ตัวเว้นตัว', 'เลือกตัวตำแหน่งคี่หรือคู่'],
		['Homophone · พ้องเสียง', 'ใช้คำที่ออกเสียงเหมือนกัน'],
		['Replacement · แทนที่', 'เปลี่ยนอักษรบางตัว'],
		['Double definition · สองนิยาม', 'สองความหมายชี้คำเดียวกัน'],
		['Cryptic definition · นิยามเล่นกล', 'อ่านความหมายทั้งประโยคอีกมุม']
	];
	const extensions = [
		['Final / middle letters', 'เลือกตัวท้ายหรือตัวกลาง'],
		['Beheading / curtailment / heartless', 'ตัดหัว ตัดท้าย หรือตัดกลาง'],
		['Letter bank', 'ใช้ชุดอักษรเดิมซ้ำสร้างคำใหม่'],
		['Spoonerism', 'สลับเสียงต้นระหว่างคำ'],
		['Palindrome', 'อ่านได้เหมือนเดิมทั้งสองทิศ'],
		['Reverse anagram', 'คำตอบบอกวิธีสลับอักษรในโจทย์'],
		['&lit. / semi-&lit.', 'ทั้งประโยคช่วยนิยามและเล่นคำ'],
		['Homograph', 'คำเขียนเหมือนกันแต่ต่างความหมาย'],
		['Combination clue', 'ผสมหลายวิธีในข้อเดียว'],
		['Outsides', 'เลือกอักษรขอบนอก'],
		['Speech peculiarities', 'ตีความเสียงตามสำเนียงที่ระบุ'],
		['Foreign words', 'ใช้คำจากภาษาอื่น'],
		['Literary reference', 'อ้างถึงวรรณกรรม'],
		['Word as part of another', 'มองคำเป็นส่วนของอีกคำ']
	];
</script>

<svelte:head><title>Cryptic Guide / คู่มือศัพท์ซับซ้อน · Chi Fun</title><meta name="description" content="คู่มือศัพท์ซับซ้อน: นิยาม วัตถุดิบ และประเภทการเล่นคำ พร้อมแหล่งอ้างอิงภาษาอังกฤษ" /></svelte:head>

<div class="mx-auto max-w-4xl px-4 py-6">
	<a class="link mb-3 inline-block text-sm" href="/puzzles/cryptic">← Cryptic / ศัพท์ซับซ้อน</a>
	<PageHeading title="คู่มือ Cryptic" description="แยกนิยาม มองหาวัตถุดิบ แล้วอ่านคำสั่งเล่นคำ" />
	<Surface>
		<p class="leading-relaxed">คำใบ้ทั่วไปมีนิยามและกลไกสร้างคำตอบจากวัตถุดิบ นิยามมักอยู่ต้นหรือท้าย ตัวชี้กลไกบอกวิธีจัดการวัตถุดิบ บางประเภท เช่น สองนิยาม ไม่มีวัตถุดิบให้แปลงอักษร</p>
		<p class="mt-3 leading-relaxed">บนเว็บนี้ (X) นับช่องอักษรไทย โดยสระบน สระล่าง และวรรณยุกต์รวมกับตัวกลาง เช่น “กุ้ง” มี 2 ช่อง: “กุ้” และ “ง”</p>
	</Surface>
	<section class="mt-6" aria-labelledby="basic-types">
		<h2 id="basic-types" class="mb-3 text-xl font-bold">ประเภทหลัก / Core clue types</h2>
		<p class="botanical-muted mb-4 text-sm">สรุปย่อจาก <a class="link" href="https://crypticinkling.co.uk/start">Cryptic Inkling: How cryptic crosswords work</a></p>
		<div class="overflow-x-auto rounded-2xl border border-base-300 bg-base-100 text-base-content"><table class="table"><thead><tr><th scope="col">ประเภท</th><th scope="col">วิธีอ่าน</th></tr></thead><tbody>{#each basics as [name, description]}<tr><th scope="row" class="whitespace-normal">{name}</th><td class="whitespace-normal">{description}</td></tr>{/each}</tbody></table></div>
	</section>
	<section class="mt-6" aria-labelledby="more-types">
		<h2 id="more-types" class="mb-3 text-xl font-bold">รูปแบบย่อยและแบบผสม</h2>
		<p class="botanical-muted mb-4 text-sm">อ้างอิงเพิ่มเติมจาก <a class="link" href="https://en.wikipedia.org/wiki/Cryptic_crossword#Types_of_cryptic_clues">Wikipedia: Cryptic crossword — Types of cryptic clues</a></p>
		<div class="overflow-x-auto rounded-2xl border border-base-300 bg-base-100 text-base-content"><table class="table"><thead><tr><th scope="col">ประเภท</th><th scope="col">วิธีอ่าน</th></tr></thead><tbody>{#each extensions as [name, description]}<tr><th scope="row" class="whitespace-normal">{name}</th><td class="whitespace-normal">{description}</td></tr>{/each}</tbody></table></div>
	</section>
	<section class="mt-6" aria-labelledby="other-types">
		<Surface>
			<h2 id="other-types" class="mb-3 text-xl font-bold">รูปแบบเพิ่มเติม</h2>
			<ul class="list-disc space-y-2 pl-5"><li>Cycling: หมุนลำดับอักษร</li><li>Stuttering: ซ้ำเสียงต้น</li><li>Definition by example: ใช้ตัวอย่างแทนหมวด</li></ul>
			<p class="botanical-muted mt-3 text-sm">อ้างอิง <a class="link" href="https://www.theguardian.com/crosswords/crossword-blog/2024/oct/21/how-to-solve-cryptic-crosswords-the-ultimate-beginners-guide">Alan Connor / The Guardian — Beginner’s guide</a></p>
		</Surface>
	</section>
	<section class="mt-6" aria-labelledby="thai-types">
		<Surface>
			<h2 id="thai-types" class="mb-3 text-xl font-bold">กลไกภาษาไทยในชุดนี้</h2>
			<ul class="list-disc space-y-2 pl-5"><li>ลำดับพยัญชนะ: ก่อนหรือหลังชื่อพยัญชนะ เช่น ฒ.ผู้เฒ่า → ณ.เณร</li><li>ชื่อพยัญชนะ: แปลง “ไก่” เป็น ก หรือ “หอ” เป็น ห</li><li>เครื่องหมายไทย: การตัด “ไม้” อาจหมายถึงลบวรรณยุกต์</li><li>ซ่อนคำไทย: อาจเลือกเฉพาะพยัญชนะ ขึ้นกับคำอธิบายของโจทย์</li></ul>
		</Surface>
	</section>
	<p class="botanical-muted mt-6 text-sm leading-relaxed">เครดิต: เนื้อหาอ้างอิงภาษาอังกฤษข้างต้นสรุปและเรียบเรียงใหม่เป็นภาษาไทยสำหรับคู่มือฉบับเริ่มต้น เข้าถึง 21 ตุลาคม 2026 ไม่ได้คัดลอกบทความเต็ม ตัวอย่างภาษาไทยมาจากชุดโจทย์ของเว็บไซต์ การแบ่งประเภทต่างกันได้ตามสำนัก และบางข้อใช้หลายกลไกร่วมกัน</p>
</div>
