export interface ITBS2021Log {
	name: string;
	time: string;
	timetotal: string;
}

export interface ITBS2021AnswerLog {
	round: string;
	id: string;
	correct: string;
	incorrect: string;
	fun: string;
	difficulty: string;
	num: string;
}

export const letterTable = [
	['U', 'H', 'T', 'L', 'R'],
	['W', 'E', 'T', 'A', 'R'],
	['A', 'N', 'D', 'K', 'I'],
	['C', 'N', 'D', 'E', 'S'],
	['E', 'N', 'L', 'E', 'S']
];

export const solutions = [
	['READS', 'UNDER', 'CELLS', 'TAKEN', 'TWICE', 'ENTER'],
	['SKIP', 'ROLL', 'DRAW', 'PICK', 'PRIZE']
];

export const keepGoingMap: Record<string, string> = {
	ABC: '(ด่าน 2 PUZZLE D) ใช่แล้ว เพลงนี้หละ! แล้วจะถอดรหัสต่ออย่างไรดี',
	ABCSONG: '(ด่าน 2 PUZZLE D) ใช่แล้ว เพลงนี้หละ! แล้วจะถอดรหัสต่ออย่างไรดี',
	TOPRIGHTCORNER: '(ด่าน 2 PUZZLE A) ถูกต้อง! แต่ยังไม่ใช่คำตอบ ทำต่ออีกนิด',
	CETER: '(ด่าน 1 ข้อสุดท้าย) ใช่! ช่องเหล่านี้ถูกใช้สองครั้ง แต่คำสั่งไม่ได้บอกให้ตอบช่องนี้นะ',
	STAR: '(ด่าน 2 PUZZLE D) ใช่แล้ว! คำที่หายไปในชื่อเพลงคือ STAR แต่นั่นไม่ใช่เพลงที่เป็นคำตอบ อ่านโจทย์อีกทีนะ ว่าเป็นเพลงอะไร',
	SONG: '(ด่าน 2 PUZZLE D) เพลง... นั่นสิ เพลงอะไรนะ',
	READBLUE: '(ด่าน 2 PUZZLE B) ถูกทางแล้ว ทำตามคำสั่งต่อเลย มีอะไรสีน้ำเงินบ้าง',
	RL: '(ด่าน 2 PUZZLE B) ยังไม่ครบ ขาดอีกสองตัว',
	ROL: '(ด่าน 2 PUZZLE B) ยังไม่ครบ ออกไปดื่มน้ำดื่มท่าแล้วกลับมาอีกทีนะ',
	TWINKLE: '(ด่าน 2 PUZZLE D) เพลงนี้แหละ! มีอีกเพลงที่ทำนองเดียวกัน',
	TWINKLETWINKELITTLESTAR: '(ด่าน 2 PUZZLE D) เพลงนี้แหละ! มีอีกเพลงที่ทำนองเดียวกัน',
	ANDER: '(ด่าน 1 ข้อ 2) ตำแหน่งถูกหมด แต่พลิกจากแนวตั้งเป็นแนวนอนนะ'
};

export const round1Puzzles = [
	{
		title: 'วิธีเล่น',
		icon: '',
		sections: [
			{
				title: 'วิธีหาข้อมูล',
				content: `<ul>
					<li>ใช้ตารางตัวอักษร 5x5 (ด้านข้าง) สำหรับปริศนาทั้ง 5 ข้อ</li>
					<li>หาคำใบ้ในงาน Thailand Board Game Show 2021 เท่านั้น (ทั้งหมดอยู่ในคลิปด้านล่าง) ไม่ต้อง Google หาข้อมูล</li>
				</ul>
				<div class="mt-4 aspect-video w-full max-w-xl mx-auto rounded-2xl overflow-hidden border border-base-300 shadow-xl">
					<iframe class="w-full h-full" src="https://www.youtube.com/embed/9X8Cj8z1TuY?start=175" title="TBS 2021 Walkthrough" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
				</div>`
			},
			{
				title: 'วิธีแก้ปริศนา',
				content: `<ul>
					<li>วิเคราะห์ข้อมูลที่ได้มา ว่าจะแก้ปริศนาอย่างไร</li>
					<li>ถ้าแก้ปริศนาถูก จะได้ตำแหน่งในตาราง 5 ช่อง เป็นตัวอักษร 5 ตัว</li>
				</ul>`
			},
			{
				title: 'วิธีอ่านคำตอบ',
				content: `<ul>
					<li>อ่านตัวอักษร 5 ตัวนั้น บนลงล่าง หรือซ้ายไปขวา อย่างใดอย่างหนึ่ง จะได้คำตอบของข้อนั้น</li>
					<li>นำคำตอบไปใส่ในช่องด้านบน และกด 'ส่งคำตอบ'</li>
				</ul>`
			}
		]
	},
	{
		title: 'ปริศนาข้อที่ 1',
		icon: '/puzzles/tbs2021/round1/puzzleicon1.png',
		sections: [
			{
				title: 'วิธีหาข้อมูล',
				content: 'หากลุ่มปลาที่ซ่อนอยู่ในทะเล ทั้งหมด 5 กลุ่ม แต่ละกลุ่มจะมี 1 ช่องที่มีทั้งปลาทั้งไฟ'
			},
			{
				title: 'วิธีแก้ปริศนา',
				content: 'นำกลุ่มปลาทั้ง 5 กลุ่ม มาวางในตารางขนาด 5x5 ให้ทับทุกช่อง (เหมือน Tetris) โดยไม่ซ้อนทับกัน และไม่ต้องหมุน'
			},
			{
				title: 'วิธีอ่านคำตอบ',
				content: 'อ่านตัวอักษรที่ตำแหน่งตรงกับไฟ จะได้ตัวอักษร 5 ตัว เรียงจากบนลงล่าง'
			}
		]
	},
	{
		title: 'ปริศนาข้อที่ 2',
		icon: '/puzzles/tbs2021/round1/puzzleicon2.png',
		sections: [
			{
				title: 'วิธีหาข้อมูล',
				content: 'หาช่องลับที่ซ่อนบนแผนที่ ใน Brick Zone ที่เมื่อเดินไปเหยียบแล้วจะมีตัวเลข 0,1,2 และตัว 💣? โผล่ขี้นมา'
			},
			{
				title: 'วิธีแก้ปริศนา',
				content: 'นำตัวเลขมาใส่ในตารางขนาด 5x5 จะได้ตารางเกม Minesweeper โดยให้หาว่าระเบิด 5 ลูกนั้น ซ่อนอยู่ในช่อง ? ช่องไหน'
			},
			{
				title: 'วิธีอ่านคำตอบ',
				content: 'อ่านตำแหน่งระเบิด จะได้ตัวอักษร 5 ตัว เรียงจากซ้ายไปขวา'
			}
		]
	},
	{
		title: 'ปริศนาข้อที่ 3',
		icon: '/puzzles/tbs2021/round1/puzzleicon3.png',
		sections: [
			{
				title: 'วิธีหาข้อมูล',
				content: `หากลุ่มใบเฟิร์น 5 กลุ่ม แต่ละกลุ่มจะมีใบเฟิร์นหลายช่องวางเรียงกัน <br><br>
				มีใบเฟิร์นกลุ่มนึงที่ในคลิปข้ามไป คือกลุ่มนี้ <br>
				<img src="/puzzles/tbs2021/round1/puzzle3missingclue.png" alt="puzzle 3 missing clue" class="rounded-xl mt-3 max-w-xs border border-base-300 shadow-md"/>`
			},
			{
				title: 'วิธีแก้ปริศนา',
				content: `แต่ละกลุ่ม จะมีช่องนึงที่ยืนทับแล้วมีอีโมจิขึ้นมา ให้หาว่าแทนความหมายอะไรในภาษาอังกฤษ (เช่น ❤️=HEART) และหาว่าอยู่ส่วนใดของตาราง โดยให้อ่านเป็นเส้นตรงจากด้านหนึ่งไปอีกด้านนึง<br>
				<img src="/puzzles/tbs2021/round1/puzzle3hint.png" alt="puzzle 3 example" class="rounded-xl mt-3 max-w-sm border border-base-300 shadow-md"/>`
			},
			{
				title: 'วิธีอ่านคำตอบ',
				content: 'อ่านตำแหน่งในช่องที่มีอีโมจิ จะได้ตัวอักษร 5 ตัว อ่านเรียงจากซ้ายไปขวา จะได้คำตอบสุดท้าย'
			}
		]
	},
	{
		title: 'ปริศนาข้อที่ 4',
		icon: '/puzzles/tbs2021/round1/puzzleicon4.png',
		sections: [
			{
				title: 'วิธีหาข้อมูล',
				content: 'หาวิทยุ 5 ตัว'
			},
			{
				title: 'วิธีแก้ปริศนา',
				content: 'เมื่อยืนใกล้วิทยุ จะได้คำใบ้ (ตัวอย่าง "แถวที่ 1: มีชู้ = #") โดย # หมายถึงตัวเลข'
			},
			{
				title: 'วิธีอ่านคำตอบ',
				content: 'อ่านตัวอักษรในแถวที่ระบุ และตำแหน่งที่ตรงกับตัวเลข จะได้ตัวอักษร 5 ตัว เรียงบนลงล่าง จะได้คำตอบสุดท้าย'
			}
		]
	},
	{
		title: 'ปริศนาข้อที่ 5',
		icon: '/puzzles/tbs2021/round1/puzzleicon5.png',
		sections: [
			{
				title: 'วิธีหาข้อมูล',
				content: 'หาดาบทั้งหมด 5 คู่ ที่แต่ละคู่จะชี้เข้าหากัน'
			},
			{
				title: 'วิธีแก้ปริศนา',
				content: `วางดาบแต่ละคู่ที่ขอบตาราง 5x5 ด้านนอก ดาบจะบอกพิกัดของตัวอักษรในตาราง 5x5 <br>
				<img src="/puzzles/tbs2021/round1/puzzle5hint.png" alt="puzzle 5 hint" class="rounded-xl mt-3 max-w-xs border border-base-300 shadow-md"/>`
			},
			{
				title: 'วิธีอ่านคำตอบ',
				content: 'อ่านตัวอักษรในพิกัดทั้ง 5 ช่อง จะได้ตัวอักษร 5 ตัว อ่านเรียงบนลงล่าง'
			}
		]
	},
	{
		title: 'ปริศนาข้อสุดท้าย',
		icon: '/puzzles/tbs2021/round1/puzzleicon6.png',
		sections: [
			{
				title: 'วิธีหาข้อมูล',
				content: 'นำคำตอบที่ได้จากข้อ 1-5 มาอ่านเรียงกัน จะได้เป็นคำสั่ง (READS UNDER CELLS TAKEN TWICE)'
			},
			{
				title: 'วิธีแก้ปริศนา',
				content: 'ความหมายคือ "ดูใต้ช่องที่ถูกใช้สองครั้ง" โดยให้ดูว่าคำตอบในข้อ 1-5 ใช้ช่องไหนไปบ้าง'
			},
			{
				title: 'วิธีอ่านคำตอบ',
				content: 'อ่านตัวอักษรตามคำสั่ง จะได้ 5 ตัว เรียงจากซ้ายไปขวา จะได้คำตอบสุดท้าย'
			}
		]
	}
];

export const round2Puzzles = [
	{
		title: 'Puzzle A',
		image: '/puzzles/tbs2021/enter/puzzle1.png',
		hint: 'ภาพที่เห็นเป็นส่วนหนึ่งของในงาน Thailand Board Game Show 2021 <br> คุ้น ๆ กันไหมว่ามันอยู่ตรงไหนบ้าง? <br> เติมคำในช่องว่าง แล้วลองเทียบตัวอักษรกับ EMOJI ดูสิ',
		link: ''
	},
	{
		title: 'Puzzle B',
		image: '/puzzles/tbs2021/enter/puzzle2.png',
		hint: '4 อักษรงั้นเหรอ ทำไมเห็นแค่ 2 ล่ะ ?? <br> อักษร 1 ตัว ค่อนข้างต่างไปจากพวกหน่อย <br> อักษรอีก 1 ตัวต้องมองทั้งกระดานถึงจะเห็น',
		link: ''
	},
	{
		title: 'Puzzle C',
		image: '/puzzles/tbs2021/enter/puzzle3.png',
		hint: 'เลข 4 ลากผ่านตัว E <br> แต่เลข 2 ไม่ได้ลากผ่านตัว A',
		link: 'https://puzz.link/p?numlin/9/9/h1j32j4l5v67o2g4l7r3j165i'
	},
	{
		title: 'Puzzle D',
		image: '/puzzles/tbs2021/enter/puzzle4.png',
		hint: `เพลงนี้เป็นเพลงที่คุณคุ้นเคยดีตอนเริ่มท่อง 'อักษรภาษาอังกฤษ' <br> เทียบเนื้อเพลงกับตัวโน้ตดูสิ <br>(ลองดีดเปียโน อาจจะช่วยให้นึกชื่อเพลงออกได้นะ)`,
		link: ''
	},
	{
		title: 'Final',
		image: '/puzzles/tbs2021/enter/final.png',
		hint: `คุณไขปริศนาด่านที่ 1 รอบ ๆ งานครบแล้วหรือยัง? <br> หากยัง คุณควรไปไขปริศนาให้ครบก่อน <br> จากนั้นลองดูในตาราง 5x5 ของด่านที่ 1 จะมีตำแหน่งของตัวอักษรที่ยังไม่ได้ถูกใช้อยู่ <br> ส่วนภาพปริศนาในข้อนี้ 1 ช่องเท่ากับอักษรภาษาอังกฤษ 1 ตัว <br> คุณผ่านมาแล้วทั้งนั้นแหละคุ้นเคยกันดีไม่ยากใช่ไหมล่ะ !!`,
		link: ''
	}
];

export function submitTBSAnswer(round: number, id: number, rawAnswer: string) {
	const result = {
		isCorrect: false,
		isFinished: false,
		message: ''
	};

	if (!rawAnswer) return result;

	const cleanAnswer = rawAnswer.trim().replace(/\s+/g, '').toUpperCase();
	const sol = solutions[round]?.[id];
	if (!sol) return result;

	const isCorrect = cleanAnswer === sol;
	result.isCorrect = isCorrect;

	if (isCorrect) {
		result.message = 'ถูกต้อง! ✔️';
		if ((round === 0 && id === 5) || (round === 1 && id === 4)) {
			result.isFinished = true;
		}
		return result;
	}

	if (keepGoingMap[cleanAnswer]) {
		result.message = '⚠️ ' + keepGoingMap[cleanAnswer];
		return result;
	}

	if (cleanAnswer.length !== sol.length) {
		result.message = 'ยังไม่ถูก ❌';
		return result;
	}

	let matchingChars = 0;
	for (let i = 0; i < sol.length; i++) {
		if (cleanAnswer[i] === sol[i]) matchingChars++;
	}

	if (matchingChars === sol.length - 1) {
		result.message = '⚠️ ผิดตัวอักษรเดียว ตรวจคำตอบอีกที';
	} else {
		result.message = 'ยังไม่ถูก ❌';
	}

	return result;
}

export const statsComments: string[] = [
	'GG EZ หยอกๆ',
	'เรื่องสีอยากให้คิดเผื่อคนตาบอดสีด้วยฮะ แหะๆ',
	'ล้ำลึกมากค่ะ จิตใจทำด้วยอะไร แต่สนุกดีค่ะ',
	'สุดยอดครับ ถ้าเป็นรหัสปลดระเบิดน่าจะไม่มีใครรอด',
	'หมดเวลาไป 1 วันเลยครับ แต่สนุกมากกกกกกกกกกกก พรุ่งนี้ค่อยมาเดินเล่นงาน วันนี้หัวจะแตก',
	'ปริศนาดีมากเลยครับมี easter egg ซ่อนอยู่พอสมควรเลย สนุกดีครับ',
	'โอ๊ยยยยยยยยยยยยยยยยยยยยยยยย จะขาดใจ',
	'เหนื่อยค่ะ',
	'สนุกแต่ว่าก็แอบยากไปบางปริศนาใช้เวลานานเลย',
	'puzzle b ด่าน 2 ผมว่าคำใบ้ไม่ค่อยเคลียครับ',
	'ขอบคุณค่ะที่ทำให้ได้ฝึกสมอง ตอนนี้หิวข้าวมาก 555 ดีใจมากที่ไขได้ แงงง',
	'สนุกดีแต่กวนไปหน่อย555',
	'ยากมากค่ะ ใช้เวลานานมากกกก ><',
	'แอบหลังหัก....',
	'ขอพารา ลูกเพจด้วยครับ',
	'ปวดหัววววววววว',
	'ยากมากกกกกก',
	'สนุกมากครับ',
	'intelligent people',
	'สนุกมากค่ะ แต่ยากมากค่ะ 555555',
	'โหดมาก เทพๆๆๆๆ เอาแบบนี้เรื่อยๆ',
	'เปิดๆ ปิดๆ หลายรอบเลยเวลาก็นับรัวๆ ถือว่าสนุกมากเลยย',
	'พอมีแจ้งเตือนว่า ผิด1ตัว 2 ตัว คือง่ายขึ้นระดับนึง ไม่ต้องหาตัวให้ครบ ก็ไล่นตัวเดาได้ แต่สนุกมาๆครับ ซับซ้อนใช้ได้',
	'สมองเต้นเป็นระบำแซมบ้า',
	'Puzzle B ยากมากครับ งงตรรกะมาก คำใบ้ทำให้เขวมากTT',
	'เกมยากมาก สนุกดีครับ กว่าจะแกะออกทำตั้งแต่ก่อนงานเปิด จนเที่ยงคืนแล้วมาเล่นต่อถึงตี 5',
	'สนุกมากครับแต่ไม่ค่อยว่างเล่นครับ',
	'ร้อนสิครับบบบบบบบบบบบบบ จะบ้าอยู้แล้ว5555+',
	'อยากใส่ Code Breaker คนคิด Puzzle (Code Breaker ก็ชื่อท่ามวยปล้ำ)',
	'ขอยาก ๆ หน่อยครับ EZ เกิ้น 555++  :)',
	'ประทับใจมากจ้า รอปีหน้าเลย',
	'สนุกมากครับ',
	'ยากมาก',
	'puzzle b ยากมากค่ะ',
	'สุดยอดครับ แต่ Puzzle B ด่าน2 คนตาบอดสีมองไม่ได้เลยครับ',
	'โหดจริงงงงงงง ><',
	'ยากไปนิดนึง คำใบ้ไม่ชัดเจนมากพอ',
	'ยากเกิ๊น',
	'งานดีมากครับ คราวหน้าทำ offline ด้วยนะ :D',
	'เพลงอะไรว๊ะ !!!',
	'สนุกมากครับ'
];

export const answerLogsData: ITBS2021AnswerLog[] = [
	{ round: '0', id: '0', correct: '89', incorrect: '153', fun: '89', difficulty: '72', num: '24' },
	{ round: '0', id: '1', correct: '82', incorrect: '114', fun: '65', difficulty: '46', num: '19' },
	{ round: '0', id: '2', correct: '80', incorrect: '219', fun: '55', difficulty: '46', num: '15' },
	{ round: '0', id: '3', correct: '86', incorrect: '657', fun: '39', difficulty: '34', num: '11' },
	{ round: '0', id: '4', correct: '79', incorrect: '1105', fun: '41', difficulty: '32', num: '11' },
	{ round: '0', id: '5', correct: '75', incorrect: '254', fun: '23', difficulty: '26', num: '6' },
	{ round: '1', id: '0', correct: '87', incorrect: '319', fun: '51', difficulty: '45', num: '12' },
	{ round: '1', id: '1', correct: '76', incorrect: '1168', fun: '51', difficulty: '55', num: '13' },
	{ round: '1', id: '2', correct: '76', incorrect: '244', fun: '70', difficulty: '59', num: '16' },
	{ round: '1', id: '3', correct: '76', incorrect: '416', fun: '41', difficulty: '39', num: '10' },
	{ round: '1', id: '4', correct: '62', incorrect: '428', fun: '0', difficulty: '0', num: '1' }
];

export const round1Leaderboard: ITBS2021Log[] = [
	{ name: 'Momo.w', time: '26/11/2564 09:40:52', timetotal: '6571837' },
	{ name: 'FireRabbit', time: '26/11/2564 11:06:03', timetotal: '3548629' },
	{ name: 'dragoNogarb', time: '26/11/2564 11:45:27', timetotal: '2789084' },
	{ name: 'Buritoburo', time: '26/11/2564 11:54:44', timetotal: '9875914' },
	{ name: 'SATHUchonZ', time: '26/11/2564 12:24:23', timetotal: '4354537' },
	{ name: '129lek_adipat', time: '26/11/2564 12:24:55', timetotal: '3860892' },
	{ name: 'Arm.Time2play', time: '26/11/2564 13:41:53', timetotal: '4992982' },
	{ name: 'winit04', time: '26/11/2564 14:15:47', timetotal: '11781729' },
	{ name: 'Nakpaiya', time: '23/11/2564 22:18:29', timetotal: '0' },
	{ name: 'NUTLAI', time: '23/11/2564 23:36:45', timetotal: '0' },
	{ name: 'Mackyz', time: '26/11/2564 14:33:29', timetotal: '10230569' },
	{ name: 'RushingOn', time: '26/11/2564 14:36:29', timetotal: '10740587' },
	{ name: 'KRUFORD', time: '26/11/2564 14:50:57', timetotal: '11509526' },
	{ name: 'MeMiMe', time: '26/11/2564 14:55:53', timetotal: '15680760' },
	{ name: 'Alnup', time: '26/11/2564 14:59:06', timetotal: '4173256' },
	{ name: '154DragoCHAIN', time: '26/11/2564 15:04:05', timetotal: '4929939' },
	{ name: 'Teera%20Sav', time: '26/11/2564 15:38:34', timetotal: '7819217' },
	{ name: 'LizFoxelion', time: '26/11/2564 15:40:12', timetotal: '8109692' },
	{ name: 'Doc%20Guide', time: '26/11/2564 15:49:01', timetotal: '4185309' },
	{ name: 'beaver41', time: '26/11/2564 15:59:07', timetotal: '15735213' },
	{ name: 'Suang', time: '26/11/2564 16:57:23', timetotal: '18559687' },
	{ name: 'samuel', time: '26/11/2564 17:13:29', timetotal: '9619267' },
	{ name: 'CutiePP', time: '26/11/2564 17:48:28', timetotal: '19569703' },
	{ name: 'Board%20Game%20Attention', time: '26/11/2564 18:33:19', timetotal: '23567897' },
	{ name: 'Art', time: '26/11/2564 19:05:04', timetotal: '4059694' },
	{ name: 'billyoswarit', time: '26/11/2564 19:27:34', timetotal: '24165330' },
	{ name: 'Teera%20sav', time: '26/11/2564 19:36:59', timetotal: '4396920' },
	{ name: '113%20Kru%20Nine', time: '26/11/2564 20:12:03', timetotal: '20869594' },
	{ name: '181pookiru', time: '26/11/2564 21:09:54', timetotal: '11872906' },
	{ name: '156VEE', time: '26/11/2564 21:15:18', timetotal: '3687016' },
	{ name: 'COOLTREE', time: '26/11/2564 23:28:50', timetotal: '26256899' },
	{ name: 'Bosnie', time: '27/11/2564 03:24:42', timetotal: '6335431' },
	{ name: '%E0%B8%93%E0%B8%B1%E0%B8%90%E0%B8%98%E0%B8%B4%E0%B8%94%E0%B8%B2', time: '27/11/2564 11:02:44', timetotal: '3550243' },
	{ name: 'Napa', time: '27/11/2564 11:42:47', timetotal: '970330' },
	{ name: '%E0%B8%84%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%B4%E0%B9%88%E0%B8%99', time: '27/11/2564 11:51:19', timetotal: '3245100' },
	{ name: 'M4%20DiceCup', time: '27/11/2564 11:53:54', timetotal: '68128009' },
	{ name: 'Pnpest', time: '27/11/2564 12:14:24', timetotal: '85904600' },
	{ name: 'Build', time: '27/11/2564 12:40:49', timetotal: '1206622' },
	{ name: 'Arm5259', time: '27/11/2564 14:05:07', timetotal: '5143426' },
	{ name: '191Mali', time: '27/11/2564 15:22:32', timetotal: '5945320' },
	{ name: '226warakornp', time: '27/11/2564 17:11:06', timetotal: '1553256' },
	{ name: '145Terry_Plumbob', time: '27/11/2564 17:12:15', timetotal: '102651156' },
	{ name: '125Aor', time: '27/11/2564 18:32:34', timetotal: '7725796' },
	{ name: 'Run', time: '27/11/2564 19:27:10', timetotal: '3984060' },
	{ name: 'Pastet', time: '27/11/2564 19:39:42', timetotal: '4737267' },
	{ name: 'Georgelnwza007', time: '27/11/2564 20:24:05', timetotal: '40400824' },
	{ name: 'WasaVised', time: '27/11/2564 21:11:17', timetotal: '127555281' },
	{ name: 'Pitch%20Ratchaburana', time: '28/11/2564 10:56:42', timetotal: '423088' },
	{ name: 'Meanbook', time: '28/11/2564 10:58:25', timetotal: '172272152' },
	{ name: 'pitch', time: '28/11/2564 12:29:23', timetotal: '35008' },
	{ name: 'KarnGG', time: '28/11/2564 12:54:06', timetotal: '3350009' },
	{ name: 'Board%20Band', time: '28/11/2564 13:35:17', timetotal: '926869' },
	{ name: 'Boss%20Lab%20Board%20Game', time: '28/11/2564 14:35:55', timetotal: '159888072' },
	{ name: 'ULTIMA', time: '28/11/2564 14:46:08', timetotal: '10925258' },
	{ name: 'Zyanise', time: '28/11/2564 15:03:58', timetotal: '13936852' },
	{ name: 'SeiiChirO', time: '28/11/2564 15:35:58', timetotal: '107698283' },
	{ name: 'benjimbo', time: '28/11/2564 15:54:53', timetotal: '5852325' },
	{ name: 'SevenNov', time: '28/11/2564 17:01:13', timetotal: '12450485' },
	{ name: 'Saran-Moo%20ADMIN', time: '28/11/2564 17:12:08', timetotal: '10669275' },
	{ name: 'Poom%20%5BLunar%20Gravity%5D', time: '28/11/2564 17:46:03', timetotal: '1699236' },
	{ name: 'PerusWoL', time: '28/11/2564 18:57:32', timetotal: '3448722' }
];

export const round2Leaderboard: ITBS2021Log[] = [
	{ name: 'Momo.w', time: '26/11/2564 10:51:38', timetotal: '10908790' },
	{ name: 'FireRabbit', time: '26/11/2564 13:27:11', timetotal: '12260010' },
	{ name: 'dragoNogarb', time: '26/11/2564 13:27:38', timetotal: '8914829' },
	{ name: 'Arm.Time2play', time: '26/11/2564 14:35:44', timetotal: '8736458' },
	{ name: '154DragoCHAIN', time: '26/11/2564 16:24:23', timetotal: '3414872' },
	{ name: 'napa', time: '26/11/2564 16:43:54', timetotal: '11352893' },
	{ name: 'cooltree', time: '26/11/2564 16:43:59', timetotal: '1929400' },
	{ name: 'KRUFORD', time: '26/11/2564 16:47:38', timetotal: '18509257' },
	{ name: 'winit04', time: '26/11/2564 16:57:50', timetotal: '21501572' },
	{ name: 'Nakpaiya', time: '23/11/2564 22:28:30', timetotal: '0' },
	{ name: 'NUTLAI', time: '24/11/2564 00:58:28', timetotal: '0' },
	{ name: 'buritoburo', time: '26/11/2564 17:10:37', timetotal: '28822085' },
	{ name: 'RushingOn', time: '26/11/2564 17:16:17', timetotal: '2839718' },
	{ name: 'LizFoxelion', time: '26/11/2564 17:50:16', timetotal: '15911477' },
	{ name: 'Alnup_Creator', time: '26/11/2564 18:15:34', timetotal: '8333075' },
	{ name: 'Doc%20guide', time: '26/11/2564 18:33:13', timetotal: '13992843' },
	{ name: 'riceberrii3', time: '26/11/2564 18:46:26', timetotal: '11818772' },
	{ name: 'F5%20MC%20D.O.', time: '26/11/2564 18:48:42', timetotal: '16066503' },
	{ name: 'samuel', time: '26/11/2564 20:24:37', timetotal: '21135809' },
	{ name: 'CutiePP', time: '26/11/2564 20:33:27', timetotal: '29472495' },
	{ name: 'billyoswarit', time: '26/11/2564 20:35:13', timetotal: '28221840' },
	{ name: 'beaver41', time: '26/11/2564 20:35:19', timetotal: '32286516' },
	{ name: 'Teera%20sav', time: '26/11/2564 20:36:44', timetotal: '7985250' },
	{ name: 'Artisty', time: '26/11/2564 21:02:52', timetotal: '11121943' },
	{ name: 'Suang', time: '26/11/2564 22:20:31', timetotal: '37932650' },
	{ name: '113%20Kru%20nine', time: '26/11/2564 22:39:12', timetotal: '29702687' },
	{ name: 'bosnie', time: '27/11/2564 04:48:20', timetotal: '11352136' },
	{ name: 'Blackomochii', time: '27/11/2564 12:14:24', timetotal: '7839551' },
	{ name: 'pnpest', time: '27/11/2564 14:09:05', timetotal: '92765132' },
	{ name: '226warakornp', time: '27/11/2564 17:14:10', timetotal: '12545855' },
	{ name: '141Mackyz', time: '27/11/2564 17:42:01', timetotal: '107942496' },
	{ name: '191Mali', time: '27/11/2564 17:51:54', timetotal: '14907973' },
	{ name: 'Arm5259', time: '27/11/2564 18:58:24', timetotal: '22728773' },
	{ name: '156VEE', time: '27/11/2564 21:57:26', timetotal: '127354908' },
	{ name: 'wasavised', time: '27/11/2564 23:11:39', timetotal: '134701526' },
	{ name: 'Georgelnwza007', time: '28/11/2564 07:03:57', timetotal: '78763695' },
	{ name: 'M3%20MEANBOOK', time: '28/11/2564 13:04:44', timetotal: '179829107' },
	{ name: 'pitch', time: '28/11/2564 13:43:24', timetotal: '4450082' },
	{ name: 'W3%20BoardBand', time: '28/11/2564 14:38:04', timetotal: '4678917' },
	{ name: 'KarnGG', time: '28/11/2564 14:39:26', timetotal: '9673295' },
	{ name: 'Boss%20Lab%20Board%20Game', time: '28/11/2564 15:21:58', timetotal: '162646202' },
	{ name: 'Ultima', time: '28/11/2564 15:45:23', timetotal: '14457462' },
	{ name: 'Snowball', time: '28/11/2564 15:50:15', timetotal: '186545402' },
	{ name: '181pookiru', time: '28/11/2564 17:01:33', timetotal: '187950410' },
	{ name: 'Pastet', time: '28/11/2564 17:34:17', timetotal: '83614843' },
	{ name: 'Run', time: '28/11/2564 17:43:02', timetotal: '84130225' },
	{ name: 'SeiiChirO', time: '28/11/2564 18:47:45', timetotal: '119207698' },
	{ name: 'Zyanise', time: '28/11/2564 18:56:42', timetotal: '27741079' },
	{ name: 'SevenNov', time: '28/11/2564 18:58:13', timetotal: '19456973' },
	{ name: 'Poom%20%5BLunar%20Gravity%5D', time: '28/11/2564 19:02:27', timetotal: '6281113' },
	{ name: '108PerusWoL', time: '28/11/2564 20:30:05', timetotal: '9000957' },
	{ name: 'benjimbo', time: '28/11/2564 21:41:45', timetotal: '26664712' }
];
