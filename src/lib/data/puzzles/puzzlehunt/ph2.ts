export default {
	type: 'puzzlehunt' as const,
	date: '2020-12-10',
	id: 2,
	image: 'ph2.png',
	title: 'Code Breaker Mini Puzzle Hunt 02 - Gadget',
	puzzles: [
		{
			index: 1,
			title: 'ไทม์แมชชีน',
			file: 'https://drive.google.com/file/d/10tltB0Gsy3hHew0jQyd_vXW4PuGo8Tfc',
			hints: [
				`ใช้การหยิบตัวอักษร (indexing) แต่เดือน JUNE ไม่มีตัว L อยู่ แล้วจะหยิบ L มาจากไหนกัน`,
				`คำโปรยใบ้ว่า "ให้กลับมาแก้ปริศนาในเดือนถัดไป" ต่อจากเดือนมิถุนายนก็เป็นเดือนกรกฎาคม`
			],
			solution: 'REMEMBER'
		},
		{
			index: 2,
			title: 'น้ำยาเพิ่มจำนวน',
			file: 'https://drive.google.com/file/d/1_npFefoD2TN122JxU0gU6Ydj_Ya-wS3Y',
			hints: [
				`ตัวอักษรที่มีคู่ได้แก่ A C G I N O P`,
				`ถ้าลากเส้นเชื่อมตัวอักษรทุกคู่ จะผ่านตัวอักษรอื่น 1 ตัวเสมอ`
			],
			solution: 'CLONING'
		},
		{
			index: 3,
			title: 'วุ้นแปลภาษา',
			file: 'https://drive.google.com/file/d/1XxieZgfBu0XHXNa3Qxn0ico6U3-OYCK-',
			hints: [
				`8/23/19 = NET`,
				`สัญลักษณ์บวกหมายถึงให้นำตัวเลขในแถวแนวนอนด้านบน มาบวกกับตัวเลขในแถวแนวตั้งด้านซ้าย`,
				`ตัวเลขในแถวแนวนอนด้านบนคือ 1,4,3,5,2`
			],
			solution: 'ADDONE'
		},
		{
			index: 4,
			title: 'ประตูไปที่ไหนก็ได้',
			file: 'https://drive.google.com/file/d/1wDit7sAvY59md1n1W7mNu-vvv2g6LZ5Y',
			hints: [
				`ประตูที่ติดกับเลข 3 และ 4 หลอกตา ต้องไปใช้ประตูที่ไกลกว่านั้น`,
				`เลข 2, 5, 7, 8, 10 และ 11 ไม่ต้องใช้ประตู`,
				`หยิบตัวอักษรที่ติดกับช่องที่เข้า/ออกประตู แล้วอ่านเรียงลำดับจากแถวบนลงล่าง ในแต่ละแถวอ่านจากซ้ายไปขวา (เช่น ตัวแรกคือ T จากแถวบนสุด ตัวสุดท้ายคือ E แถวล่างสุด)`
			],
			solution: 'TRANSLATE'
		},
		{
			index: 5,
			title: 'Meta - อุปกรณ์อัศจรรย์',
			file: 'https://drive.google.com/file/d/1OVgfForkU2fvTGKdFYHVaRvIUauhB--G',
			hints: [
				`ไฟฉายใช้เพิ่มตัวอักษร 1 ตัว, วุ้นแปลเป็นภาษาไทย, หุ่นยนต์เพิ่มคำให้กลายเป็นคำซ้ำ`,
				`ฝังแล้ว = [กลบ] จับคู่กับ ส่วนของดอกไม้ = [กลีบ] เพราะเราใช้ไฟฉายเพื่อเพิ่มสระอี 1 ตัว`,
				`คำฝั่งซ้ายคือ กลบ, ลุก, แสด, กวน, รัก, นา และ วาฬ ตามลำดับบนลงล่าง`
			],
			solution: 'DREAMON'
		}
	]
};
