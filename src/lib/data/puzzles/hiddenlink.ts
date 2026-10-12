export interface IHiddenLink {
	id: number;
	title: string;
	words: string[];
	answer: string;
	acceptableAnswers: string[];
	author: string;
	date: string;
	image: string;
	tags: string[];
	hints?: string[];
	type?: string;
}

export const staticHiddenLinkPuzzles: IHiddenLink[] = [
	{
		id: 1,
		title: 'Hidden Link 1',
		words: ['โดนัท', 'เรขา', 'มีนาคม', 'ลางาน'],
		answer: 'พยางค์แรกเป็นโน้ตดนตรี',
		acceptableAnswers: [
			'พยางค์แรกเป็นโน้ตดนตรี',
			'คำแรกเป็นโน้ตดนตรี',
			'โน้ตดนตรี',
			'ตัวโน้ต',
			'โน้ต',
			'โด เร มี ลา'
		],
		author: 'Code Breaker',
		date: '2026-07-31',
		image: '/puzzles/hiddenlink/link01.jpg',
		tags: ['Hidden Link', 'Music'],
		hints: ['พยางค์แรกของแต่ละคำเป็นโน้ตดนตรี (โด, เร, มี, ลา)']
	},
	{
		id: 2,
		title: 'Hidden Link 2',
		words: ['หมอ', 'ทอง', 'การ์ตูน', 'เทวดา'],
		answer: 'ปลา',
		acceptableAnswers: ['ปลา'],
		author: 'Code Breaker',
		date: '2026-07-31',
		image: '/puzzles/hiddenlink/link02.jpg',
		tags: ['Hidden Link', 'Animals'],
		hints: ['คำนำหน้าเหมือนกัน เป็นชื่อสายพันธุ์สัตว์น้ำ']
	},
	{
		id: 3,
		title: 'Hidden Link 3',
		words: ['จุก', 'จอก', 'บอก', 'ทง'],
		answer: 'กระ',
		acceptableAnswers: ['กระ'],
		author: 'Code Breaker',
		date: '2026-07-31',
		image: '/puzzles/hiddenlink/link03.jpg',
		tags: ['Hidden Link', 'Prefix'],
		hints: ['คำนำหน้าเหมือนกัน']
	},
	{
		id: 4,
		title: 'Hidden Link 4',
		words: ['นาง', 'ไฟ', 'สาย', 'ท้อง'],
		answer: 'ฟ้า',
		acceptableAnswers: ['ฟ้า'],
		author: 'Code Breaker',
		date: '2026-07-31',
		image: '/puzzles/hiddenlink/link04.jpg',
		tags: ['Hidden Link', 'Suffix'],
		hints: ['คำต่อท้ายเหมือนกัน']
	},
	{
		id: 5,
		title: 'Hidden Link 5',
		words: ['ขาย', 'แดด', 'เขียน', 'เหลื่อม'],
		answer: 'เปลี่ยนตัวอักษร 1 ตัวเป็นชื่อสี',
		acceptableAnswers: [
			'เปลี่ยนตัวอักษร 1 ตัวเป็นชื่อสี',
			'ชื่อสี',
			'สี',
			'เปลี่ยน 1 ตัวอักษรเป็นสี',
			'เปลี่ยนตัวอักษรเป็นชื่อสี'
		],
		author: 'Code Breaker',
		date: '2026-07-31',
		image: '/puzzles/hiddenlink/link05.jpg',
		tags: ['Hidden Link', 'Colors'],
		hints: ['เปลี่ยนตัวอักษร 1 ตัวในแต่ละคำแล้วได้ชื่อสี (ขาว, แดง, เขียว, เหลือง)']
	},
	{
		id: 6,
		title: 'Hidden Link 6',
		words: ['จุดบอด', 'ดอกจิก', 'กบฏ', 'ปฏิบัติ'],
		answer: 'พยัญชนะต้นเป็นอักษรกลาง',
		acceptableAnswers: [
			'พยัญชนะต้นเป็นอักษรกลาง',
			'อักษรกลาง',
			'พยัญชนะอักษรกลาง',
			'อักษรกลางทั้งหมด'
		],
		author: 'Code Breaker',
		date: '2026-07-31',
		image: '/puzzles/hiddenlink/link06.jpg',
		tags: ['Hidden Link', 'Alphabet'],
		hints: ['พยัญชนะต้นของทุกคำเป็นอักษรกลาง (ก จ ด ต บ ป อ ฎ ฏ)']
	},
	{
		id: 7,
		title: 'Hidden Link 7',
		words: ['จรรโลง', 'พุทรา', 'สุขภาพ', 'เสาวรส'],
		answer: 'พยางค์แรกสัมผัสเสียงวันในสัปดาห์',
		acceptableAnswers: [
			'พยางค์แรกสัมผัสเสียงวันในสัปดาห์',
			'วันในสัปดาห์',
			'พยางค์แรกคล้องจองกับวัน',
			'สัมผัสเสียงวันในสัปดาห์',
			'ชื่อวันในสัปดาห์'
		],
		author: 'Code Breaker',
		date: '2026-07-31',
		image: '/puzzles/hiddenlink/link07.jpg',
		tags: ['Hidden Link', 'Phonetics'],
		hints: ['พยางค์แรกออกเสียงคล้องจองกับชื่อวันในสัปดาห์ (จันทร์, พุธ, ศุกร์, เสาร์)']
	},
	{
		id: 8,
		title: 'Hidden Link 8',
		words: ['มือ', 'จักร', 'หมาย', 'ดนตรี'],
		answer: 'เครื่อง',
		acceptableAnswers: ['เครื่อง', 'คำนำหน้าคือเครื่อง'],
		author: 'Code Breaker',
		date: '2026-07-31',
		image: '/puzzles/hiddenlink/link08.jpg',
		tags: ['Hidden Link', 'Prefix'],
		hints: ['คำนำหน้าเหมือนกัน']
	},
	{
		id: 9,
		title: 'Hidden Link 9',
		words: ['วุ่นวาย', 'ส้มโอ', 'เส้นเอ็น', 'ขจี'],
		answer: 'พยางค์หลังออกเสียงเป็นอักษรภาษาอังกฤษ',
		acceptableAnswers: [
			'พยางค์หลังออกเสียงเป็นอักษรภาษาอังกฤษ',
			'อักษรภาษาอังกฤษ',
			'ตัวอักษรภาษาอังกฤษ',
			'พยางค์หลังเป็นตัวอักษรภาษาอังกฤษ'
		],
		author: 'Code Breaker',
		date: '2026-07-31',
		image: '/puzzles/hiddenlink/link09.jpg',
		tags: ['Hidden Link', 'Colors'],
		hints: ['พยางค์หลังออกเสียงตรงกับตัวอักษรภาษาอังกฤษ (Y, O, N, G)']
	},
	{
		id: 10,
		title: 'Hidden Link 10',
		words: ['คูปอง', 'บุฟเฟต์', 'ยางมะตอย', 'ซังเต'],
		answer: 'คำยืมภาษาฝรั่งเศส',
		acceptableAnswers: [
			'คำยืมภาษาฝรั่งเศส',
			'ภาษาฝรั่งเศส',
			'คำมาจากภาษาฝรั่งเศส',
			'คำยืมภาษาต่างประเทศ'
		],
		author: 'Code Breaker',
		date: '2026-07-31',
		image: '/puzzles/hiddenlink/link10.jpg',
		tags: ['Hidden Link', 'Etymology'],
		hints: ['เป็นคำยืมมาจากภาษาฝรั่งเศส']
	},
	{
		id: 11,
		title: 'Hidden Link 11',
		words: ['หมาล่าเนื้อ', 'สามเหลี่ยมใต้', 'คันชั่ง', 'นายพราน'],
		answer: 'กลุ่มดาว',
		acceptableAnswers: ['กลุ่มดาว', 'ดาว', 'ชื่อกลุ่มดาว', 'กลุ่มดาวบนท้องฟ้า'],
		author: 'Code Breaker',
		date: '2026-07-31',
		image: '/puzzles/hiddenlink/link11.jpg',
		tags: ['Hidden Link', 'Astronomy'],
		hints: ['เป็นชื่อกลุ่มดาวบนท้องฟ้า']
	},
	{
		id: 12,
		title: 'Hidden Link 12',
		words: ['ฝันวัน', 'ใจเมือง', 'วัยคน', 'ผีเสื้อคืน'],
		answer: 'กลาง',
		acceptableAnswers: ['กลาง', 'คำเชื่อมตรงกลางคือกลาง'],
		author: 'Code Breaker',
		date: '2026-07-31',
		image: '/puzzles/hiddenlink/link12.jpg',
		tags: ['Hidden Link', 'Infix'],
		hints: ['คำที่แทรกอยู่ตรงกลางระหว่างสองคำแล้วเกิดคำใหม่']
	},
	{
		id: 13,
		title: 'Hidden Link 13',
		words: ['อังศุมาลี', 'ภาณุมาศ', 'ประภากร', 'สุริยา'],
		answer: 'ดวงอาทิตย์',
		acceptableAnswers: ['ดวงอาทิตย์', 'พระอาทิตย์', 'อาทิตย์'],
		author: 'Code Breaker',
		date: '2026-07-31',
		image: '/puzzles/hiddenlink/link13.jpg',
		tags: ['Hidden Link', 'Synonyms'],
		hints: ['เป็นคำไวพจน์ที่หมายถึงดวงอาทิตย์']
	},
	{
		id: 14,
		title: 'Hidden Link 14',
		words: ['บุตร', 'สามารถ', 'ชาติ', 'อาถรรพณ์'],
		answer: 'มีรูปสระหรือพยัญชนะท้ายไม่ออกเสียง',
		acceptableAnswers: [
			'มีรูปสระหรือพยัญชนะท้ายไม่ออกเสียง',
			'ตัวสะกดไม่ออกเสียง',
			'สระหรือพยัญชนะไม่ออกเสียง',
			'ไม่ออกเสียงพยัญชนะท้าย'
		],
		author: 'Code Breaker',
		date: '2026-07-31',
		image: '/puzzles/hiddenlink/link14.jpg',
		tags: ['Hidden Link', 'Spelling'],
		hints: ['มีรูปสระหรือพยัญชนะการันต์/ตัวสะกดท้ายที่ไม่ออกเสียง']
	},
	{
		id: 15,
		title: 'Hidden Link 15',
		words: ['อากาศ', 'เส้นผม', 'เก้าอี้', 'ความยุติธรรม'],
		answer: 'คำแปลภาษาอังกฤษลงท้ายด้วย air เหมือนกัน (air, hair, chair, fair)',
		acceptableAnswers: [
			'คำแปลภาษาอังกฤษลงท้ายด้วย air เหมือนกัน (air, hair, chair, fair)',
			'คำแปลภาษาอังกฤษลงท้ายด้วย air เหมือนกัน',
			'ลงท้ายด้วย air',
			'air, hair, chair, fair',
			'air',
			'ภาษาอังกฤษลงท้ายด้วย air'
		],
		author: 'Code Breaker',
		date: '2026-07-31',
		image: '/puzzles/hiddenlink/link15.jpg',
		tags: ['Hidden Link', 'Translation'],
		hints: ['แปลเป็นภาษาอังกฤษ']
	},
	{
		id: 16,
		title: 'Hidden Link 16',
		words: ['ส่องแสง', 'วิสามัญ', 'เสี่ยงทาย', 'ไขว่ห้าง'],
		answer: 'มีตัวเลขซ่อนอยู่ในคำ (สอง, สาม, สี่, ห้า)',
		acceptableAnswers: [
			'มีตัวเลขซ่อนอยู่ในคำ (สอง, สาม, สี่, ห้า)',
			'มีตัวเลขซ่อนอยู่ในคำ',
			'ตัวเลขซ่อนอยู่',
			'ซ่อนตัวเลข',
			'สอง สาม สี่ ห้า',
			'ตัวเลข'
		],
		author: 'Code Breaker',
		date: '2026-07-31',
		image: '/puzzles/hiddenlink/link16.jpg',
		tags: ['Hidden Link', 'Wordplay'],
		hints: ['มีคำอื่นซ่อนอยู่']
	}
];
