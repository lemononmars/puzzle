export default {
	type: 'puzzlehunt' as const,
	date: '2020-10-10',
	id: 1,
	image: 'ph1.png',
	title: 'Code Breaker Mini Puzzle Hunt 01 - Night',
	puzzles: [
		{
			index: 1,
			title: 'สร้างสี่เหลี่ยม',
			file: 'https://drive.google.com/file/d/1C5ravyVbtjEbJQBbeVS6P_gS7wq8fpgv',
			hints: [
				`ด้านของสี่เหลี่ยมจัตุรัสไม่จำเป็นต้องขนานกับตาราง`,
				`ตัวอักษร E เป็นจุดมุมหนึ่งของสี่เหลี่ยมจัตุรัส`
			],
			solution: 'BLUE'
		},
		{
			index: 2,
			title: 'เสาไฟฟ้า',
			file: 'https://drive.google.com/file/d/1nQmV9lwfTNUCE4WVgSHT4iqvkCa289aP',
			hints: [
				`เกมนี้มีอีกชื่อหนึ่งว่า Akari หรือ Light Up`,
				`ตัว S และ P ทั้งหมดเป็นช่องวางเสาไฟฟ้าที่ใช้งานได้`
			],
			solution: 'AWAKE'
		},
		{
			index: 3,
			title: 'เส้นที่ตัด',
			file: 'https://drive.google.com/file/d/1XTRjYU_l6m2qzRS3e5_QQCePfG1d8-qY',
			hints: [
				`ตัวเลขบอกตำแหน่งของตัวอักษรในตาราง ว่าแต่เรามีตารางอะไรแบบนี้หรือเปล่า`,
				`กติกาบอกว่าไม่ต้อง google หาข้อมูลเฉพาะเจาะจง แปลว่าต้องเป็นตารางที่เรามี`,
				`G11 มาจากการหยิบวงกลมในแถวแนวตั้งแรก และแถวแนวนอนแรก (นั่นคือ มุมบนซ้าย) ได้เป็นตัว G, ส่วน A71 มาจากการหยิบวงกลมในแถวแนวตั้งที่ 7 (ขวาสุด) และแถวแนวนอนแรก ได้เป็นตัว A`
			],
			solution: 'LIGHT'
		},
		{
			index: 4,
			title: 'เส้นทางดารา',
			file: 'https://drive.google.com/file/d/1SfBx_HdDb21458BGPTEIZ3j3yMIhvQx_',
			hints: [
				`แปลงชื่อดาวตัวอย่าง 3 ดวงก่อน แล้วใส่ตัวอักษรให้ตรงกับทิศทางทั้ง 8 ทิศ`,
				`เมื่อได้ชื่อดาวทั้ง 7 ดวงแล้ว ให้วาดเส้นทางดาว ที่จะออกมาเป็นตัวอักษรภาษาอังกฤษ`,
				`ชื่อดาวทั้ง 7 ดวงคือ ยาย, นอก, กาก, วน, กนก, ยาย, สกาว`
			],
			solution: 'SUNRISE'
		},
		{
			index: 5,
			title: 'Meta - สนธยา',
			file: 'https://drive.google.com/file/d/166bj9DUbKS4_YMt28ZVq79xmsk1mhVen',
			hints: [
				`จำนวนช่องที่เห็น ไม่ตรงกับจำนวนตัวอักษรของคำตอบที่ได้มา แสดงว่าต้องหาวิธีเปลี่ยนก่อน อ่านกลอนดูอีกที`,
				`คำตอบทั้ง 4 ข้อมีความเกี่ยวข้องกันอยู่ (แสง, พระอาทิตย์ขึ้น, การตื่น, สีฟ้า) ถ้าเอามาใส่ในข้อ "สนธยา" แล้วจะเกิดอะไรขึ้น`,
				`เปลี่ยนคำตอบ "กลางวัน" ให้เป็นคำใน "กลางคืน" (เช่น AWAKE เปลี่ยนเป็น ASLEEP)`,
				`เมื่อเปลี่ยนเป็นคำว่า DARK, SUNSET, ASLEEP, BLACK แล้วให้นำไปใส่ในช่องตามลำดับ`
			],
			solution: 'DAWN'
		}
	]
};
