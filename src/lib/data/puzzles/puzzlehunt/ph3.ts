export default {
	type: 'puzzlehunt' as const,
	date: '2021-2-1',
	id: 3,
	image: 'ph3.png',
	title: 'Code Breaker Mini Puzzle Hunt 03 - Weathering',
	puzzles: [
		{
			index: 1,
			title: 'พยากรณ์อากาศ',
			file: 'https://drive.google.com/file/d/1asiy_S-cGyYfGENOzVF_A1r3RNDObjYD',
			hints: [
				`ใช้การเปลี่ยนตัวเลขเป็นตัวอักษรภาษาอังกฤษ 1 = A, 2 = B, 3 = C, ...`,
				`ADD SUN AND SNOW แปลว่าให้รวมพระอาทิตย์กับหิมะ เช่น ในพื้นที่แรกมุมขนซ้าย รวม 1+4=5 แปลงกลับมาเป็นตัวอักษรได้เป็นตัว E`
			],
			solution: 'EYE'
		},
		{
			index: 2,
			title: 'ฝนตกวันไหนบ้าง',
			file: 'https://drive.google.com/file/d/1VreFGgCiUkwRh7nOVYwh7GCicBRaHQ_u',
			hints: [
				`ถ้าพูดถึงตาราง ที่มีแนวนอน 7 ช่อง นับรวมกันได้ 31 ช่อง จะนึกถึงอะไรบ้าง`,
				`ตารางที่เห็นคือปฏิทิน เลือกปฏิทินให้ถูกเดือน (ปล. จะมี 1 วันที่เป็นของเดือนอื่น ส่วนอีก 30 วันเป็นเดือนเดียวกัน)`,
				`วันจักกรีคือวันที่ 6 เมษายน วันครอบครัวคือวันที่ 14 เมษายน วันแรงงานคือวันที่ 1 พฤษภาคม`
			],
			solution: 'POTATO'
		},
		{
			index: 3,
			title: 'ปริศนาน่าฝน',
			file: 'https://drive.google.com/file/d/1GgTa7cxASHnqOY_FoXjWetUAjzUSZP2X',
			hints: [
				`เกมนี้มีชื่อว่า nonogram หรือ picross แบบที่มี 2 สี โดยสีที่ต่างกันอยู่ติดกันได้`,
				`เป็นอุปกรณ์ในเกมโปเกมอน มี 8 ตัวอักษร ถ้าหยิบแค่ครึ่งแรก (ตัดคำว่า ball ครึ่งหลังทิ้งไป) ก็จะได้คำตอบ`
			],
			solution: 'POKE'
		},
		{
			index: 4,
			title: 'เทอร์โมมิเตอร์',
			file: 'https://drive.google.com/file/d/17oJjTykGffNf35S4f-Bzd3zAgWDdN0fp',
			hints: [
				`เทอร์โมมิเตอร์ของจริง ใช้วัดอุณหภูมิยังไงเอ่ย`,
				`จุดสูงสุดเทียบเท่ากับอุณหภูมิ 40 องศา`,
				`เลื่อนเส้นสีเขียว A ไปที่จุดกึ่งกลาง (อุณหภูมิ 20 องศา) เลื่อนเส้นสีเขียว B ไปที่จุดบนสุด (อุณหภูมิ 40 องศา) ยกเทอร์โมมิเตอร์ C ตั้งตรงขึ้นมา`
			],
			solution: 'HARD'
		},
		{
			index: 5,
			title: 'Meta - วรุณ',
			file: 'https://drive.google.com/file/d/1jMhWBjtzNPFdu8OqI-47gaMicTNH9SIa',
			hints: [
				`ใส่ "น้ำ" ไว้ข้าง "หน้า" คำที่แปลเป็น "ไทย"`,
				`แปลเป็นไทยได้คำว่า มัน,ตา,จิ้ม,แข็ง`,
				`ถ้าเติมคำว่า "น้ำ" ไปข้างหน้าจะได้คำใหม่ นำคำใหม่มาแปลเป็นภาษาอังกฤษเพื่อใส่ในตารางอักษรไขว้ (เช่น POKE > จิ้ม > น้ำจิ้ม > SAUCE)`
			],
			solution: 'COASTER'
		}
	]
};
