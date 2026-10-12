import type { IRebus } from '#lib/interfaces/index.js';

export const rebuses: IRebus[] = [
	{
		type: 'rebus',
		id: 1,
		title: 'Rebus 01',
		image: 'rebus01.png',
		question: '(static file) ภาพนี้หมายถึงคำว่าอะไร?',
		date: '2022-06-01',
		tags: ['rebus', 'word puzzle'],
		answer: 'ยาหลังอาหาร',
		hints: [`แยกคำว่า "ยา" และ "อาหาร"`, `ลำดับการวาง อะไรอยู่หลังอะไรอยู่หน้า`]
	},
	{
		type: 'rebus',
		id: 2,
		title: 'Rebus 02',
		image: 'rebus02.png',
		question: 'ภาพนี้หมายถึงคำว่าอะไร?',
		date: '2022-06-02',
		tags: ['rebus', 'word puzzle'],
		answer: 'กบในกะลา',
		hints: [`แยกคำว่า "กบ" ที่อยู่ตรงกลางออกมา`, `คำที่เหลือหลังจากที่แยกแล้วคือ "กะลา"`]
	},
	{
		type: 'rebus',
		id: 3,
		title: 'Rebus 03',
		image: 'rebus03.png',
		question: 'ภาพนี้หมายถึงคำว่าอะไร?',
		date: '2022-06-03',
		tags: ['rebus', 'word puzzle'],
		answer: 'คนเดียวหัวหาย',
		hints: [
			`คำด้านบนคือคำว่า "คน" ส่วนคำด้านล่างมีไว้เปรียบเทียบให้เห็นว่าด้านบนมีความแตกต่างอย่างไร`,
			`ทั้งตัว ค และ น มีส่วนนึงที่ขาดไปเหมือนกัน`
		]
	},
	{
		type: 'rebus',
		id: 4,
		title: 'Rebus 04',
		image: 'rebus04.png',
		question: 'ภาพนี้หมายถึงคำว่าอะไร?',
		date: '2022-06-04',
		tags: ['rebus', 'word puzzle'],
		answer: 'ห้าม',
		hints: [`นับจำนวนตัวอักษรดูก่อน`, `ตัวอักษร ม ซ้ำกัน 5 ตัว`]
	},
	{
		type: 'rebus',
		id: 5,
		title: 'Rebus 05',
		image: 'rebus05.png',
		question: 'ภาพนี้หมายถึงคำว่าอะไร?',
		date: '2022-06-05',
		tags: ['rebus', 'word puzzle'],
		answer: 'สร้อย',
		hints: [
			`นับจำนวนตัวอักษรดูก่อน`,
			`ตัวอักษร ส ซ้ำกัน 100 ตัว`,
			`ถ้านำ ส กับคำว่า ร้อย มาต่อกัน จะอ่านได้เป็นคำใหม่`
		]
	}
];
