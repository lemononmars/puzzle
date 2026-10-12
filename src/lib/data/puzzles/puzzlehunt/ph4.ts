export default {
	type: 'puzzlehunt' as const,
	date: '2021-10-10',
	id: 4,
	image: 'ph4.png',
	title: 'Code Breaker Mini Puzzle Hunt 04 - Halloween',
	puzzles: [
		{
			index: 1,
			title: 'Arithmophobia',
			file: 'https://drive.google.com/file/d/1SdM-rd8wMMgovBqs5r7OL7Iiz6vqgO6l',
			hints: [
				`บรรทัดแรก = เลขสองหลักแรกของเบอร์แจ้งเหตุฉุกเฉิน, เพนกวินในขั้วโลกเหนือ`,
				`บรรทัดที่สอง = วันในเดือนมีนาคม, เลขนำโชคของคนไทย`,
				`บรรทัดที่สาม = นิ้วในมือขวาของคน, มุมในสี่เหลี่ยมผืนผ้า`,
				`บรรทัดที่สี่ = วันออกสลากกินแบ่งครึ่งเดือนหลัง, แขนของลิงแสม`,
				`บรรทัดที่ห้า = ปีนักษัตร, มรรคมีองค์`
			],
			solution: 'SKIRT'
		},
		{
			index: 2,
			title: 'Rest In Peace',
			file: 'https://drive.google.com/file/d/1UfZSjEaR-HYRiup-D6gfxXrbr578Y9p2',
			hints: [
				`Rest In Peace = RIP`,
				`คนที่ตายคือคนที่มี RIP`,
				`คำที่มีตัวอักษร R, I และ P คือคนตาย ในแต่ละบรรทัดจะมีคนตาย 2 คน คนเป็น 1 คน`
			],
			solution: 'CHILL'
		},
		{
			index: 3,
			title: 'ปริศนาสายสิญจน์',
			file: 'https://drive.google.com/file/d/1q3Ph4ho0iEk1ueYRoPngCwbyuJ6kkDBL',
			hints: [
				`เกมนี้มีชื่อว่า Masyu (Black White) แบบที่ไม่มีกฎอะไรเพิ่มเป็นพิเศษ`,
				`ถ้าทำถูกต้อง จะเหลือตัวอักษร P,E,R ที่เป็นเส้นแทยงมุม หาที่เหลืออีกสองตัวให้เจอ`
			],
			solution: 'PLIER'
		},
		{
			index: 4,
			title: 'คฤหาสน์ผีสิง',
			file: 'https://drive.google.com/file/d/1g3WUGSP5xJ9FP0NLVviHF4KnuPv8o044',
			hints: [`ไม่ผ่าน M,N,O,Y ด้านบน`, `ผ่านตัว S`],
			solution: 'HORSE'
		},
		{
			index: 5,
			title: 'Meta - หลอก หรือ เลี้ยง',
			file: 'https://drive.google.com/file/d/1DRBBFYnEMd478lqIOdUebMlU36cDGEIA',
			hints: [
				`ไม่ต้องแปลงคำแต่อย่างใด ใช้คำตอบ 4 ข้อ ที่เป็น 5 ตัวอักษร มาใส่ในตารางอักษรไขว้ให้ถูกต้อง แล้วอ่านตัวอักษรเรียงลำดับ 1-5`
			],
			solution: 'TRICK'
		}
	]
};
