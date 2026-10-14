// Generated detailed puzzle mechanics dictionary
export interface TechnicalTerm {
	en: string;
	ja: string;
	th: string;
}

export interface MechanicPuzzle {
	title: string;
	prompt: string;
	svg: string;
	solutionSvg: string;
	hint: string;
	acceptedAnswers: string[];
	answerDisplay: string;
	solutionExplanation: string;
}

export interface MechanicDetail {
	id: string;
	englishTitle: string;
	thaiTitle: string;
	japaneseTitle: string;
	description: string;
	chapter: {
		id: string;
		hasExercise?: boolean;
		englishTitle: string;
		thaiTitle: string;
		japaneseTitle: string;
		accent: string;
	};
	detailedDescription: string;
	solvingTechnique: string;
	technicalTerms: TechnicalTerm[];
	puzzle: MechanicPuzzle;
	hasExercise?: boolean;
}

export const MECHANIC_DETAILS: Record<string, MechanicDetail> = {
	'answer-the-question-mark': {
		id: 'answer-the-question-mark',
		hasExercise: false,
		englishTitle: 'Answer the Question Mark',
		thaiTitle: 'หาคำตอบแทนเครื่องหมายคำถาม',
		japaneseTitle: '？を答える',
		description:
			'พิจารณารูปแบบหรือความสัมพันธ์รอบเครื่องหมายคำถาม แล้วหาสิ่งที่ควรอยู่ในตำแหน่งนั้น',
		chapter: {
			id: 'basics',
			hasExercise: false,
			englishTitle: 'Puzzle-Solving Basics',
			thaiTitle: 'พื้นฐานการไขปริศนา',
			japaneseTitle: '謎解きの基本',
			accent: 'badge-primary'
		},
		detailedDescription:
			'กลไก **Answer the Question Mark** (ญี่ปุ่น: *？を答える*) เป็นหัวใจพื้นฐานที่สุดของเกมแนว *Nazotoki (謎解き)* และ *Escape Room (リアル脱出ゲーム)* โดยโจทย์จะจัดวางข้อมูล เช่น ตัวอักษร, สัญลักษณ์, หรือรูปทรง ที่มีการเปลี่ยนแปลงอย่างมีแบบแผน (*Pattern*) แล้วเว้นตำแหน่งหนึ่งไว้ด้วยเครื่องหมายคำถาม `?` เพื่อให้ผู้เล่นวิเคราะห์ความสัมพันธ์และหาคำตอบมาเติมให้สมบูรณ์',
		solvingTechnique:
			'1. สังเกตทิศทางของการเปลี่ยนแปลง (ซ้ายไปขวา, บนลงล่าง, หรือวนตามเข็มนาฬิกา)\n2. แปลงองค์ประกอบให้อยู่ในรูปตัวเลขหรือลำดับ (เช่น ลำดับ Alphabet A=1, C=3, E=5, G=7)\n3. คำนวณความต่าง (Step) เพื่อหาค่าของตำแหน่ง `?`',
		technicalTerms: [
			{
				en: 'Question Mark',
				ja: 'はてな / クエスチョンマーク',
				th: 'เครื่องหมายคำถามที่เป็นเป้าหมาย'
			},
			{
				en: 'Pattern',
				ja: 'パターン / 規則性',
				th: 'รูปแบบหรือความสัมพันธ์เชิงตรรกะ'
			},
			{
				en: 'Sequence',
				ja: '数列 / シーケンス',
				th: 'ลำดับที่เปลี่ยนแปลงอย่างเป็นระบบ'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ลำดับอักษรปริศนา',
			prompt: 'พิจารณารูปแบบของตัวอักษรในวงกลมทั้ง 5 แล้วหาว่าตัวอักษรใดควรแทนที่เครื่องหมาย [ ? ]',
			hint: 'สังเกตตำแหน่งของตัวอักษรใน Alphabet (ภาษาอังกฤษ) แล้วนับระยะห่างระหว่างแต่ละตัว',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="42" fill="#94a3b8" font-size="14" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Alphabet Sequence</text>\n  \n  <line x1="60" y1="120" x2="460" y2="120" stroke="#334155" stroke-width="4" stroke-dasharray="6,6"/>\n  \n  <circle cx="60" cy="120" r="32" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>\n  <text x="60" y="128" fill="#f8fafc" font-size="24" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">A</text>\n  <text x="60" y="175" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">(1)</text>\n\n  <text x="110" y="110" fill="#38bdf8" font-size="12" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">+2</text>\n  <path d="M96 120 L124 120 M118 115 L124 120 L118 125" stroke="#38bdf8" stroke-width="2" fill="none"/>\n\n  <circle cx="160" cy="120" r="32" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>\n  <text x="160" y="128" fill="#f8fafc" font-size="24" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">C</text>\n  <text x="160" y="175" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">(3)</text>\n\n  <text x="210" y="110" fill="#38bdf8" font-size="12" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">+2</text>\n  <path d="M196 120 L224 120 M218 115 L224 120 L218 125" stroke="#38bdf8" stroke-width="2" fill="none"/>\n\n  <circle cx="260" cy="120" r="32" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>\n  <text x="260" y="128" fill="#f8fafc" font-size="24" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">E</text>\n  <text x="260" y="175" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">(5)</text>\n\n  <text x="310" y="110" fill="#38bdf8" font-size="12" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">+2</text>\n  <path d="M296 120 L324 120 M318 115 L324 120 L318 125" stroke="#38bdf8" stroke-width="2" fill="none"/>\n\n  <circle cx="360" cy="120" r="32" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>\n  <text x="360" y="128" fill="#f8fafc" font-size="24" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">G</text>\n  <text x="360" y="175" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">(7)</text>\n\n  <text x="410" y="110" fill="#fbbf24" font-size="12" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">+2</text>\n  <path d="M396 120 L424 120 M418 115 L424 120 L418 125" stroke="#fbbf24" stroke-width="2" fill="none"/>\n\n  <circle cx="460" cy="120" r="32" fill="#451a03" stroke="#f59e0b" stroke-width="3"/>\n  <text x="460" y="129" fill="#fbbf24" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">?</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="42" fill="#34d399" font-size="14" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solution Revealed</text>\n  \n  <line x1="60" y1="120" x2="460" y2="120" stroke="#334155" stroke-width="4" stroke-dasharray="6,6"/>\n  \n  <circle cx="60" cy="120" r="32" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>\n  <text x="60" y="128" fill="#f8fafc" font-size="24" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">A</text>\n  \n  <circle cx="160" cy="120" r="32" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>\n  <text x="160" y="128" fill="#f8fafc" font-size="24" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">C</text>\n  \n  <circle cx="260" cy="120" r="32" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>\n  <text x="260" y="128" fill="#f8fafc" font-size="24" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">E</text>\n  \n  <circle cx="360" cy="120" r="32" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>\n  <text x="360" y="128" fill="#f8fafc" font-size="24" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">G</text>\n  \n  <circle cx="460" cy="120" r="32" fill="#064e3b" stroke="#10b981" stroke-width="4"/>\n  <text x="460" y="128" fill="#34d399" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">I</text>\n  <text x="460" y="175" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">(9)</text>\n</svg>',
			acceptedAnswers: ['I', 'i', 'ไอ', '9'],
			answerDisplay: 'I',
			solutionExplanation:
				'พิจารณาลำดับของตัวอักษรภาษาอังกฤษในตาราง *Alphabet*:\n- A คือลำดับที่ 1\n- C คือลำดับที่ 3 (+2)\n- E คือลำดับที่ 5 (+2)\n- G คือลำดับที่ 7 (+2)\nดังนั้น ตำแหน่ง `?` คือลำดับที่ 7 + 2 = 9 ซึ่งตรงกับตัวอักษร **I**'
		}
	},
	'read-in-number-order': {
		id: 'read-in-number-order',
		hasExercise: false,
		englishTitle: 'Read in Number Order',
		thaiTitle: 'อ่านตามลำดับตัวเลข',
		japaneseTitle: '数字順に読む',
		description: 'เรียงตัวอักษรหรือชิ้นส่วนตามหมายเลขกำกับก่อนอ่านเป็นข้อความหรือคำตอบ',
		chapter: {
			id: 'basics',
			hasExercise: false,
			englishTitle: 'Puzzle-Solving Basics',
			thaiTitle: 'พื้นฐานการไขปริศนา',
			japaneseTitle: '謎解きの基本',
			accent: 'badge-primary'
		},
		detailedDescription:
			'กลไก **Read in Number Order** (ญี่ปุ่น: *数字順に読む*) นิยมใช้ในขั้นตอน *Extraction* ของปริศนา เมื่อผู้เล่นได้รับข้อมูลตัวอักษรที่กระจัดกระจายและมีตัวเลขเล็ก ๆ กำกับไว้ การเรียงอ่านตามลำดับตัวเลข 1, 2, 3, ... จะแปลงความสับสนให้กลายเป็นคำตอบที่มีความหมาย',
		solvingTechnique:
			'1. ค้นหาตัวเลขกำกับทั้งหมดตั้งแต่เลข 1 ถึงเลขสูงสุด\n2. จับคู่ตัวอักษรที่ตรงกับแต่ละหมายเลข\n3. เขียนเรียงตัวอักษรตามลำดับ 1 → 2 → 3 → 4 เพื่ออ่านเป็นคำตอบ',
		technicalTerms: [
			{
				en: 'Number Order',
				ja: '数字順',
				th: 'การอ่านเรียงตามลำดับตัวเลข'
			},
			{
				en: 'Extraction',
				ja: '抽出',
				th: 'การดึงตัวอักษรมาประกอบเป็นคำตอบ'
			},
			{
				en: 'Passcode',
				ja: 'パスコード',
				th: 'รหัสผ่านหรือคำเป้าหมาย'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: เรียงกล่องตามตัวเลข',
			prompt:
				'นำตัวอักษรในกล่องมาเรียงอ่านตามลำดับหมายเลขกำกับ (1, 2, 3, 4) เพื่อหาคำตอบภาษาอังกฤษ',
			hint: 'หาว่ากล่องหมายเลข 1 คือตัวอะไร, หมายเลข 2 คือตัวอะไร แล้วไล่ไปจนครบ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="42" fill="#94a3b8" font-size="14" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Jumbled Numbered Boxes</text>\n\n  <g transform="translate(60, 80)">\n    <rect width="80" height="80" rx="12" fill="#1e293b" stroke="#64748b" stroke-width="2"/>\n    <circle cx="64" cy="18" r="12" fill="#3b82f6"/>\n    <text x="64" y="23" fill="#ffffff" font-size="11" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">4</text>\n    <text x="40" y="55" fill="#f8fafc" font-size="32" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">E</text>\n  </g>\n\n  <g transform="translate(165, 80)">\n    <rect width="80" height="80" rx="12" fill="#1e293b" stroke="#64748b" stroke-width="2"/>\n    <circle cx="64" cy="18" r="12" fill="#3b82f6"/>\n    <text x="64" y="23" fill="#ffffff" font-size="11" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">1</text>\n    <text x="40" y="55" fill="#f8fafc" font-size="32" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">C</text>\n  </g>\n\n  <g transform="translate(270, 80)">\n    <rect width="80" height="80" rx="12" fill="#1e293b" stroke="#64748b" stroke-width="2"/>\n    <circle cx="64" cy="18" r="12" fill="#3b82f6"/>\n    <text x="64" y="23" fill="#ffffff" font-size="11" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">3</text>\n    <text x="40" y="55" fill="#f8fafc" font-size="32" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">D</text>\n  </g>\n\n  <g transform="translate(375, 80)">\n    <rect width="80" height="80" rx="12" fill="#1e293b" stroke="#64748b" stroke-width="2"/>\n    <circle cx="64" cy="18" r="12" fill="#3b82f6"/>\n    <text x="64" y="23" fill="#ffffff" font-size="11" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">2</text>\n    <text x="40" y="55" fill="#f8fafc" font-size="32" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">O</text>\n  </g>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="42" fill="#34d399" font-size="14" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solution: Sorted 1 → 2 → 3 → 4</text>\n\n  <g transform="translate(60, 80)">\n    <rect width="80" height="80" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="2"/>\n    <circle cx="64" cy="18" r="12" fill="#10b981"/>\n    <text x="64" y="23" fill="#ffffff" font-size="11" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">1</text>\n    <text x="40" y="55" fill="#34d399" font-size="32" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">C</text>\n  </g>\n\n  <g transform="translate(165, 80)">\n    <rect width="80" height="80" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="2"/>\n    <circle cx="64" cy="18" r="12" fill="#10b981"/>\n    <text x="64" y="23" fill="#ffffff" font-size="11" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">2</text>\n    <text x="40" y="55" fill="#34d399" font-size="32" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">O</text>\n  </g>\n\n  <g transform="translate(270, 80)">\n    <rect width="80" height="80" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="2"/>\n    <circle cx="64" cy="18" r="12" fill="#10b981"/>\n    <text x="64" y="23" fill="#ffffff" font-size="11" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">3</text>\n    <text x="40" y="55" fill="#34d399" font-size="32" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">D</text>\n  </g>\n\n  <g transform="translate(375, 80)">\n    <rect width="80" height="80" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="2"/>\n    <circle cx="64" cy="18" r="12" fill="#10b981"/>\n    <text x="64" y="23" fill="#ffffff" font-size="11" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">4</text>\n    <text x="40" y="55" fill="#34d399" font-size="32" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">E</text>\n  </g>\n</svg>',
			acceptedAnswers: ['CODE', 'code', 'โค้ด'],
			answerDisplay: 'CODE',
			solutionExplanation:
				'เรียงตัวอักษรตามตัวเลขกำกับ:\n- หมายเลข 1 คือตัว **C**\n- หมายเลข 2 คือตัว **O**\n- หมายเลข 3 คือตัว **D**\n- หมายเลข 4 คือตัว **E**\nเมื่อนำมาต่อกันจะได้คำว่า **CODE**'
		}
	},
	'follow-the-arrows': {
		id: 'follow-the-arrows',
		hasExercise: false,
		englishTitle: 'Follow the Arrows',
		thaiTitle: 'อ่านตามลูกศร',
		japaneseTitle: '矢印を読む',
		description: 'ใช้ทิศทางหรือลำดับของลูกศรเป็นเส้นทางในการเลือกและอ่านข้อมูล',
		chapter: {
			id: 'basics',
			hasExercise: false,
			englishTitle: 'Puzzle-Solving Basics',
			thaiTitle: 'พื้นฐานการไขปริศนา',
			japaneseTitle: '謎解きの基本',
			accent: 'badge-primary'
		},
		detailedDescription:
			'กลไก **Follow the Arrows** (ญี่ปุ่น: *矢印を読む*) ใช้ลูกศรเป็นตัวนำทางผ่านตารางหรือกลุ่มข้อความ ผู้เล่นต้องเริ่มต้นที่จุดเริ่มที่ระบุ แล้วเคลื่อนที่ไปตามทิศทางของลูกศรเพื่อเก็บตัวอักษรระหว่างทางมาประกอบเป็นคำตอบ',
		solvingTechnique:
			'1. หาจุดเริ่มต้น (Start) หรือช่องที่มีสัญลักษณ์เปิด\n2. เดินตามทิศทางลูกศรทีละก้าว บันทึกตัวอักษรที่ผ่าน\n3. ตรวจสอบว่าเส้นทางสิ้นสุดอย่างสมบูรณ์โดยไม่มีทางตัน',
		technicalTerms: [
			{
				en: 'Arrow Trail',
				ja: '矢印の軌跡',
				th: 'เส้นทางการเดินตามลูกศร'
			},
			{
				en: 'Grid Traversal',
				ja: 'グリッド探索',
				th: 'การเดินทางผ่านช่องตาราง'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: เดินตามลูกศรสะกดคำ',
			prompt: 'เริ่มต้นที่ช่อง S ด้านซ้ายบน แล้วเดินตามทิศทางลูกศรเพื่อสะกดคำภาษาอังกฤษ 4 ตัวอักษร',
			hint: 'เดินจาก S ไปทางขวา ไปทางขวา แล้วลงล่าง',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="36" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">3x3 Grid Navigation</text>\n\n  <g transform="translate(170, 55)">\n    <rect x="0" y="0" width="55" height="45" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>\n    <text x="27" y="30" fill="#38bdf8" font-size="20" font-weight="bold" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">S</text>\n    \n    <path d="M42 22 L68 22 M63 17 L68 22 L63 27" stroke="#f59e0b" stroke-width="2.5" fill="none"/>\n\n    <rect x="60" y="0" width="55" height="45" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>\n    <text x="87" y="30" fill="#38bdf8" font-size="20" font-weight="bold" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">T</text>\n\n    <path d="M102 22 L128 22 M123 17 L128 22 L123 27" stroke="#f59e0b" stroke-width="2.5" fill="none"/>\n\n    <rect x="120" y="0" width="55" height="45" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>\n    <text x="147" y="30" fill="#38bdf8" font-size="20" font-weight="bold" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">A</text>\n\n    <path d="M147 38 L147 62 M142 57 L147 62 L152 57" stroke="#f59e0b" stroke-width="2.5" fill="none"/>\n\n    <rect x="0" y="50" width="55" height="45" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>\n    <text x="27" y="80" fill="#64748b" font-size="20" font-weight="bold" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">M</text>\n\n    <rect x="60" y="50" width="55" height="45" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>\n    <text x="87" y="80" fill="#64748b" font-size="20" font-weight="bold" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">O</text>\n\n    <rect x="120" y="50" width="55" height="45" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>\n    <text x="147" y="80" fill="#38bdf8" font-size="20" font-weight="bold" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">R</text>\n\n    <rect x="0" y="100" width="55" height="45" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>\n    <text x="27" y="130" fill="#64748b" font-size="20" font-weight="bold" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">P</text>\n\n    <rect x="60" y="100" width="55" height="45" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>\n    <text x="87" y="130" fill="#64748b" font-size="20" font-weight="bold" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">L</text>\n\n    <rect x="120" y="100" width="55" height="45" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>\n    <text x="147" y="130" fill="#64748b" font-size="20" font-weight="bold" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">K</text>\n  </g>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="36" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solution Path: S → T → A → R</text>\n\n  <g transform="translate(170, 55)">\n    <rect x="0" y="0" width="55" height="45" fill="#064e3b" stroke="#10b981" stroke-width="2"/>\n    <text x="27" y="30" fill="#34d399" font-size="20" font-weight="bold" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">S</text>\n    \n    <path d="M42 22 L68 22 M63 17 L68 22 L63 27" stroke="#34d399" stroke-width="3" fill="none"/>\n\n    <rect x="60" y="0" width="55" height="45" fill="#064e3b" stroke="#10b981" stroke-width="2"/>\n    <text x="87" y="30" fill="#34d399" font-size="20" font-weight="bold" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">T</text>\n\n    <path d="M102 22 L128 22 M123 17 L128 22 L123 27" stroke="#34d399" stroke-width="3" fill="none"/>\n\n    <rect x="120" y="0" width="55" height="45" fill="#064e3b" stroke="#10b981" stroke-width="2"/>\n    <text x="147" y="30" fill="#34d399" font-size="20" font-weight="bold" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">A</text>\n\n    <path d="M147 38 L147 62 M142 57 L147 62 L152 57" stroke="#34d399" stroke-width="3" fill="none"/>\n\n    <rect x="0" y="50" width="55" height="45" fill="#1e293b" stroke="#334155" stroke-width="1.5" opacity="0.4"/>\n    <rect x="60" y="50" width="55" height="45" fill="#1e293b" stroke="#334155" stroke-width="1.5" opacity="0.4"/>\n\n    <rect x="120" y="50" width="55" height="45" fill="#064e3b" stroke="#10b981" stroke-width="2"/>\n    <text x="147" y="80" fill="#34d399" font-size="20" font-weight="bold" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">R</text>\n\n    <rect x="0" y="100" width="55" height="45" fill="#1e293b" stroke="#334155" stroke-width="1.5" opacity="0.4"/>\n    <rect x="60" y="100" width="55" height="45" fill="#1e293b" stroke="#334155" stroke-width="1.5" opacity="0.4"/>\n    <rect x="120" y="100" width="55" height="45" fill="#1e293b" stroke="#334155" stroke-width="1.5" opacity="0.4"/>\n  </g>\n</svg>',
			acceptedAnswers: ['STAR', 'star', 'ดวงดาว', 'ดาว'],
			answerDisplay: 'STAR',
			solutionExplanation:
				'เริ่มต้นที่ช่อง **S**:\n1. ลูกศรชี้ขวาไปยังช่อง **T**\n2. ลูกศรชี้ขวาต่อไปยังช่อง **A**\n3. ลูกศรชี้ลงไปยังช่อง **R**\nคำตอบที่ได้คือ **STAR** (ดวงดาว)'
		}
	},
	'small-letters': {
		id: 'small-letters',
		hasExercise: false,
		englishTitle: 'Small Letters',
		thaiTitle: 'สังเกตตัวอักษรขนาดเล็ก',
		japaneseTitle: '小さい文字',
		description: 'แยกตัวอักษรที่เล็กกว่าส่วนอื่นออกมา หรือใช้ความต่างของขนาดเป็นเบาะแส',
		chapter: {
			id: 'basics',
			hasExercise: false,
			englishTitle: 'Puzzle-Solving Basics',
			thaiTitle: 'พื้นฐานการไขปริศนา',
			japaneseTitle: '謎解きの基本',
			accent: 'badge-primary'
		},
		detailedDescription:
			'กลไก **Small Letters** (ญี่ปุ่น: *小さい文字*) เป็นเทคนิคสำคัญในหมวดหมู่ **พื้นฐานการไขปริศนา** (*Puzzle-Solving Basics*) มีสาระสำคัญคือ: แยกตัวอักษรที่เล็กกว่าส่วนอื่นออกมา หรือใช้ความต่างของขนาดเป็นเบาะแส กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **สังเกตตัวอักษรขนาดเล็ก**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Small Letters',
				ja: '小さい文字',
				th: 'สังเกตตัวอักษรขนาดเล็ก'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส สังเกตตัวอักษรขนาดเล็ก',
			prompt:
				'พิจารณาแผนภาพกลไก สังเกตตัวอักษรขนาดเล็ก (Small Letters) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Small Letters Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">สังเกตตัวอักษรขนาดเล็ก</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">SMAL</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: SMAL</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">SMAL</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['SMAL', 'smal'],
			answerDisplay: 'SMAL',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Small Letters** (*สังเกตตัวอักษรขนาดเล็ก*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **SMAL**'
		}
	},
	'add-dakuten': {
		id: 'add-dakuten',
		hasExercise: false,
		englishTitle: 'Add Dakuten',
		thaiTitle: 'เติมเครื่องหมายเสียงขุ่น',
		japaneseTitle: '濁点を付ける',
		description: 'เติมเครื่องหมาย dakuten ให้คานะเพื่อเปลี่ยนเสียงและสร้างคำใหม่ เช่น か เป็น が',
		chapter: {
			id: 'basics',
			hasExercise: false,
			englishTitle: 'Puzzle-Solving Basics',
			thaiTitle: 'พื้นฐานการไขปริศนา',
			japaneseTitle: '謎解きの基本',
			accent: 'badge-primary'
		},
		detailedDescription:
			'กลไก **Add Dakuten** (ญี่ปุ่น: *濁点を付ける*) เป็นเทคนิคสำคัญในหมวดหมู่ **พื้นฐานการไขปริศนา** (*Puzzle-Solving Basics*) มีสาระสำคัญคือ: เติมเครื่องหมาย dakuten ให้คานะเพื่อเปลี่ยนเสียงและสร้างคำใหม่ เช่น か เป็น が กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **เติมเครื่องหมายเสียงขุ่น**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Add Dakuten',
				ja: '濁点を付ける',
				th: 'เติมเครื่องหมายเสียงขุ่น'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส เติมเครื่องหมายเสียงขุ่น',
			prompt:
				'พิจารณาแผนภาพกลไก เติมเครื่องหมายเสียงขุ่น (Add Dakuten) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Add Dakuten Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">เติมเครื่องหมายเสียงขุ่น</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">ADDD</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: ADDD</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">ADDD</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['ADDD', 'addd'],
			answerDisplay: 'ADDD',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Add Dakuten** (*เติมเครื่องหมายเสียงขุ่น*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **ADDD**'
		}
	},
	'matching-symbols-and-numbers': {
		id: 'matching-symbols-and-numbers',
		hasExercise: false,
		englishTitle: 'Matching Symbols and Numbers',
		thaiTitle: 'จับคู่สัญลักษณ์หรือตัวเลขที่เหมือนกัน',
		japaneseTitle: '同じ記号や数字',
		description: 'สิ่งที่มีสัญลักษณ์หรือตัวเลขเดียวกันถือว่าเชื่อมโยงกันและใช้จับคู่ข้อมูล',
		chapter: {
			id: 'basics',
			hasExercise: false,
			englishTitle: 'Puzzle-Solving Basics',
			thaiTitle: 'พื้นฐานการไขปริศนา',
			japaneseTitle: '謎解きの基本',
			accent: 'badge-primary'
		},
		detailedDescription:
			'กลไก **Matching Symbols and Numbers** (ญี่ปุ่น: *同じ記号や数字*) เป็นเทคนิคสำคัญในหมวดหมู่ **พื้นฐานการไขปริศนา** (*Puzzle-Solving Basics*) มีสาระสำคัญคือ: สิ่งที่มีสัญลักษณ์หรือตัวเลขเดียวกันถือว่าเชื่อมโยงกันและใช้จับคู่ข้อมูล กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **จับคู่สัญลักษณ์หรือตัวเลขที่เหมือนกัน**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Matching Symbols and Numbers',
				ja: '同じ記号や数字',
				th: 'จับคู่สัญลักษณ์หรือตัวเลขที่เหมือนกัน'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส จับคู่สัญลักษณ์หรือตัวเลขที่เหมือนกัน',
			prompt:
				'พิจารณาแผนภาพกลไก จับคู่สัญลักษณ์หรือตัวเลขที่เหมือนกัน (Matching Symbols and Numbers) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Matching Symbols and Numbers Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">จับคู่สัญลักษณ์หรือตัวเลขที่เหมือนกัน</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">MATC</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: MATC</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">MATC</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['MATC', 'matc'],
			answerDisplay: 'MATC',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Matching Symbols and Numbers** (*จับคู่สัญลักษณ์หรือตัวเลขที่เหมือนกัน*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **MATC**'
		}
	},
	'pictures-to-words': {
		id: 'pictures-to-words',
		hasExercise: false,
		englishTitle: 'Turn Pictures into Words',
		thaiTitle: 'แปลงภาพเป็นคำ',
		japaneseTitle: 'イラストを言葉に',
		description: 'เรียกชื่อสิ่งที่เห็นในภาพ แล้วนำคำหรือเสียงอ่านนั้นไปใช้แก้โจทย์ต่อ',
		chapter: {
			id: 'basics',
			hasExercise: false,
			englishTitle: 'Puzzle-Solving Basics',
			thaiTitle: 'พื้นฐานการไขปริศนา',
			japaneseTitle: '謎解きの基本',
			accent: 'badge-primary'
		},
		detailedDescription:
			'กลไก **Turn Pictures into Words** (ญี่ปุ่น: *イラストを言葉に*) เป็นเทคนิคสำคัญในหมวดหมู่ **พื้นฐานการไขปริศนา** (*Puzzle-Solving Basics*) มีสาระสำคัญคือ: เรียกชื่อสิ่งที่เห็นในภาพ แล้วนำคำหรือเสียงอ่านนั้นไปใช้แก้โจทย์ต่อ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **แปลงภาพเป็นคำ**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Turn Pictures into Words',
				ja: 'イラストを言葉に',
				th: 'แปลงภาพเป็นคำ'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส แปลงภาพเป็นคำ',
			prompt:
				'พิจารณาแผนภาพกลไก แปลงภาพเป็นคำ (Turn Pictures into Words) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Turn Pictures into Words Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">แปลงภาพเป็นคำ</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">TURN</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: TURN</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">TURN</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['TURN', 'turn'],
			answerDisplay: 'TURN',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Turn Pictures into Words** (*แปลงภาพเป็นคำ*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **TURN**'
		}
	},
	'fill-in-the-blanks': {
		id: 'fill-in-the-blanks',
		hasExercise: false,
		englishTitle: 'Fill in the Blanks',
		thaiTitle: 'เติมคำในช่องว่าง',
		japaneseTitle: '穴埋め',
		description: 'เติมตัวอักษร คำ หรือตัวเลขที่ขาดหายโดยอาศัยบริบทและรูปแบบที่กำหนด',
		chapter: {
			id: 'basics',
			hasExercise: false,
			englishTitle: 'Puzzle-Solving Basics',
			thaiTitle: 'พื้นฐานการไขปริศนา',
			japaneseTitle: '謎解きの基本',
			accent: 'badge-primary'
		},
		detailedDescription:
			'กลไก **Fill in the Blanks** (ญี่ปุ่น: *穴埋め*) เป็นเทคนิคสำคัญในหมวดหมู่ **พื้นฐานการไขปริศนา** (*Puzzle-Solving Basics*) มีสาระสำคัญคือ: เติมตัวอักษร คำ หรือตัวเลขที่ขาดหายโดยอาศัยบริบทและรูปแบบที่กำหนด กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **เติมคำในช่องว่าง**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Fill in the Blanks',
				ja: '穴埋め',
				th: 'เติมคำในช่องว่าง'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส เติมคำในช่องว่าง',
			prompt:
				'พิจารณาแผนภาพกลไก เติมคำในช่องว่าง (Fill in the Blanks) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Fill in the Blanks Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">เติมคำในช่องว่าง</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">FILL</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: FILL</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">FILL</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['FILL', 'fill'],
			answerDisplay: 'FILL',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Fill in the Blanks** (*เติมคำในช่องว่าง*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **FILL**'
		}
	},
	'pattern-rules': {
		id: 'pattern-rules',
		hasExercise: false,
		englishTitle: 'Pattern Rules',
		thaiTitle: 'ค้นหากฎของรูปแบบ',
		japaneseTitle: '法則問題',
		description: 'หากฎร่วมของตัวอย่างหลายชุด แล้วนำกฎนั้นไปคำนวณหรือเติมคำตอบ',
		chapter: {
			id: 'basics',
			hasExercise: false,
			englishTitle: 'Puzzle-Solving Basics',
			thaiTitle: 'พื้นฐานการไขปริศนา',
			japaneseTitle: '謎解きの基本',
			accent: 'badge-primary'
		},
		detailedDescription:
			'กลไก **Pattern Rules** (ญี่ปุ่น: *法則問題*) เป็นเทคนิคสำคัญในหมวดหมู่ **พื้นฐานการไขปริศนา** (*Puzzle-Solving Basics*) มีสาระสำคัญคือ: หากฎร่วมของตัวอย่างหลายชุด แล้วนำกฎนั้นไปคำนวณหรือเติมคำตอบ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ค้นหากฎของรูปแบบ**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Pattern Rules',
				ja: '法則問題',
				th: 'ค้นหากฎของรูปแบบ'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ค้นหากฎของรูปแบบ',
			prompt:
				'พิจารณาแผนภาพกลไก ค้นหากฎของรูปแบบ (Pattern Rules) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Pattern Rules Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ค้นหากฎของรูปแบบ</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">PATT</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: PATT</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">PATT</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['PATT', 'patt'],
			answerDisplay: 'PATT',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Pattern Rules** (*ค้นหากฎของรูปแบบ*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **PATT**'
		}
	},
	'find-it': {
		id: 'find-it',
		hasExercise: false,
		englishTitle: 'Find It',
		thaiTitle: 'ค้นหาสิ่งที่ซ่อนอยู่',
		japaneseTitle: '見つける',
		description: 'มองหาตัวอักษร รูป หรือรายละเอียดเป้าหมายที่แฝงอยู่ในข้อมูลจำนวนมาก',
		chapter: {
			id: 'basics',
			hasExercise: false,
			englishTitle: 'Puzzle-Solving Basics',
			thaiTitle: 'พื้นฐานการไขปริศนา',
			japaneseTitle: '謎解きの基本',
			accent: 'badge-primary'
		},
		detailedDescription:
			'กลไก **Find It** (ญี่ปุ่น: *見つける*) เป็นเทคนิคสำคัญในหมวดหมู่ **พื้นฐานการไขปริศนา** (*Puzzle-Solving Basics*) มีสาระสำคัญคือ: มองหาตัวอักษร รูป หรือรายละเอียดเป้าหมายที่แฝงอยู่ในข้อมูลจำนวนมาก กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ค้นหาสิ่งที่ซ่อนอยู่**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Find It',
				ja: '見つける',
				th: 'ค้นหาสิ่งที่ซ่อนอยู่'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ค้นหาสิ่งที่ซ่อนอยู่',
			prompt:
				'พิจารณาแผนภาพกลไก ค้นหาสิ่งที่ซ่อนอยู่ (Find It) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Find It Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ค้นหาสิ่งที่ซ่อนอยู่</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">FIND</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: FIND</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">FIND</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['FIND', 'find'],
			answerDisplay: 'FIND',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Find It** (*ค้นหาสิ่งที่ซ่อนอยู่*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **FIND**'
		}
	},
	'reading-instructions': {
		id: 'reading-instructions',
		hasExercise: false,
		englishTitle: 'Reading Instructions',
		thaiTitle: 'ทำตามคำสั่งการอ่าน',
		japaneseTitle: '読み方指示',
		description:
			'อ่านข้อความตามคำสั่งที่โจทย์ระบุ เช่น อ่านเฉพาะสีหนึ่ง อ่านข้าม หรือเริ่มจากจุดกำหนด',
		chapter: {
			id: 'basics',
			hasExercise: false,
			englishTitle: 'Puzzle-Solving Basics',
			thaiTitle: 'พื้นฐานการไขปริศนา',
			japaneseTitle: '謎解きの基本',
			accent: 'badge-primary'
		},
		detailedDescription:
			'กลไก **Reading Instructions** (ญี่ปุ่น: *読み方指示*) เป็นเทคนิคสำคัญในหมวดหมู่ **พื้นฐานการไขปริศนา** (*Puzzle-Solving Basics*) มีสาระสำคัญคือ: อ่านข้อความตามคำสั่งที่โจทย์ระบุ เช่น อ่านเฉพาะสีหนึ่ง อ่านข้าม หรือเริ่มจากจุดกำหนด กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ทำตามคำสั่งการอ่าน**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Reading Instructions',
				ja: '読み方指示',
				th: 'ทำตามคำสั่งการอ่าน'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ทำตามคำสั่งการอ่าน',
			prompt:
				'พิจารณาแผนภาพกลไก ทำตามคำสั่งการอ่าน (Reading Instructions) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Reading Instructions Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ทำตามคำสั่งการอ่าน</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">READ</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: READ</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">READ</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['READ', 'read'],
			answerDisplay: 'READ',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Reading Instructions** (*ทำตามคำสั่งการอ่าน*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **READ**'
		}
	},
	'vertical-horizontal-reading': {
		id: 'vertical-horizontal-reading',
		hasExercise: false,
		englishTitle: 'Vertical and Horizontal Reading',
		thaiTitle: 'อ่านแนวตั้งและแนวนอน',
		japaneseTitle: '縦読み／横読み',
		description: 'เปลี่ยนแนวการอ่านระหว่างแถวกับคอลัมน์เพื่อค้นหาข้อความที่ซ่อนอยู่',
		chapter: {
			id: 'basics',
			hasExercise: false,
			englishTitle: 'Puzzle-Solving Basics',
			thaiTitle: 'พื้นฐานการไขปริศนา',
			japaneseTitle: '謎解きの基本',
			accent: 'badge-primary'
		},
		detailedDescription:
			'กลไก **Vertical and Horizontal Reading** (ญี่ปุ่น: *縦読み／横読み*) เป็นเทคนิคสำคัญในหมวดหมู่ **พื้นฐานการไขปริศนา** (*Puzzle-Solving Basics*) มีสาระสำคัญคือ: เปลี่ยนแนวการอ่านระหว่างแถวกับคอลัมน์เพื่อค้นหาข้อความที่ซ่อนอยู่ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **อ่านแนวตั้งและแนวนอน**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Vertical and Horizontal Reading',
				ja: '縦読み／横読み',
				th: 'อ่านแนวตั้งและแนวนอน'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส อ่านแนวตั้งและแนวนอน',
			prompt:
				'พิจารณาแผนภาพกลไก อ่านแนวตั้งและแนวนอน (Vertical and Horizontal Reading) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Vertical and Horizontal Reading Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">อ่านแนวตั้งและแนวนอน</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">VERT</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: VERT</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">VERT</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['VERT', 'vert'],
			answerDisplay: 'VERT',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Vertical and Horizontal Reading** (*อ่านแนวตั้งและแนวนอน*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **VERT**'
		}
	},
	'read-between': {
		id: 'read-between',
		hasExercise: false,
		englishTitle: 'Read Between',
		thaiTitle: 'อ่านสิ่งที่อยู่ระหว่างกลาง',
		japaneseTitle: '間を読む',
		description: 'เลือกตัวอักษร ช่องว่าง หรือองค์ประกอบที่อยู่ระหว่างสิ่งสองสิ่งตามเบาะแส',
		chapter: {
			id: 'basics',
			hasExercise: false,
			englishTitle: 'Puzzle-Solving Basics',
			thaiTitle: 'พื้นฐานการไขปริศนา',
			japaneseTitle: '謎解きの基本',
			accent: 'badge-primary'
		},
		detailedDescription:
			'กลไก **Read Between** (ญี่ปุ่น: *間を読む*) เป็นเทคนิคสำคัญในหมวดหมู่ **พื้นฐานการไขปริศนา** (*Puzzle-Solving Basics*) มีสาระสำคัญคือ: เลือกตัวอักษร ช่องว่าง หรือองค์ประกอบที่อยู่ระหว่างสิ่งสองสิ่งตามเบาะแส กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **อ่านสิ่งที่อยู่ระหว่างกลาง**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Read Between',
				ja: '間を読む',
				th: 'อ่านสิ่งที่อยู่ระหว่างกลาง'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส อ่านสิ่งที่อยู่ระหว่างกลาง',
			prompt:
				'พิจารณาแผนภาพกลไก อ่านสิ่งที่อยู่ระหว่างกลาง (Read Between) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Read Between Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">อ่านสิ่งที่อยู่ระหว่างกลาง</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">READ</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: READ</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">READ</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['READ', 'read'],
			answerDisplay: 'READ',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Read Between** (*อ่านสิ่งที่อยู่ระหว่างกลาง*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **READ**'
		}
	},
	'correspondence-table': {
		id: 'correspondence-table',
		hasExercise: false,
		englishTitle: 'Correspondence Table',
		thaiTitle: 'ใช้ตารางจับคู่',
		japaneseTitle: '対応表',
		description: 'อ้างอิงตารางที่กำหนดความสัมพันธ์ระหว่างสัญลักษณ์ ตัวอักษร ตัวเลข หรือความหมาย',
		chapter: {
			id: 'basics',
			hasExercise: false,
			englishTitle: 'Puzzle-Solving Basics',
			thaiTitle: 'พื้นฐานการไขปริศนา',
			japaneseTitle: '謎解きの基本',
			accent: 'badge-primary'
		},
		detailedDescription:
			'กลไก **Correspondence Table** (ญี่ปุ่น: *対応表*) เป็นเทคนิคสำคัญในหมวดหมู่ **พื้นฐานการไขปริศนา** (*Puzzle-Solving Basics*) มีสาระสำคัญคือ: อ้างอิงตารางที่กำหนดความสัมพันธ์ระหว่างสัญลักษณ์ ตัวอักษร ตัวเลข หรือความหมาย กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ใช้ตารางจับคู่**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Correspondence Table',
				ja: '対応表',
				th: 'ใช้ตารางจับคู่'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ใช้ตารางจับคู่',
			prompt:
				'พิจารณาแผนภาพกลไก ใช้ตารางจับคู่ (Correspondence Table) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Correspondence Table Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ใช้ตารางจับคู่</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">CORR</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: CORR</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">CORR</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['CORR', 'corr'],
			answerDisplay: 'CORR',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Correspondence Table** (*ใช้ตารางจับคู่*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **CORR**'
		}
	},
	'use-the-question-text': {
		id: 'use-the-question-text',
		hasExercise: false,
		englishTitle: 'Use the Question Text',
		thaiTitle: 'ใช้ข้อความโจทย์เป็นส่วนหนึ่งของคำตอบ',
		japaneseTitle: '問題文を利用',
		description:
			'อ่านข้อความโจทย์อย่างละเอียด เพราะคำ สัญลักษณ์ หรือตำแหน่งในประโยคอาจเป็นวัตถุดิบของกลไก',
		chapter: {
			id: 'basics',
			hasExercise: false,
			englishTitle: 'Puzzle-Solving Basics',
			thaiTitle: 'พื้นฐานการไขปริศนา',
			japaneseTitle: '謎解きの基本',
			accent: 'badge-primary'
		},
		detailedDescription:
			'กลไก **Use the Question Text** (ญี่ปุ่น: *問題文を利用*) เป็นเทคนิคสำคัญในหมวดหมู่ **พื้นฐานการไขปริศนา** (*Puzzle-Solving Basics*) มีสาระสำคัญคือ: อ่านข้อความโจทย์อย่างละเอียด เพราะคำ สัญลักษณ์ หรือตำแหน่งในประโยคอาจเป็นวัตถุดิบของกลไก กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ใช้ข้อความโจทย์เป็นส่วนหนึ่งของคำตอบ**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Use the Question Text',
				ja: '問題文を利用',
				th: 'ใช้ข้อความโจทย์เป็นส่วนหนึ่งของคำตอบ'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ใช้ข้อความโจทย์เป็นส่วนหนึ่งของคำตอบ',
			prompt:
				'พิจารณาแผนภาพกลไก ใช้ข้อความโจทย์เป็นส่วนหนึ่งของคำตอบ (Use the Question Text) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Use the Question Text Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ใช้ข้อความโจทย์เป็นส่วนหนึ่งของคำตอบ</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">USET</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: USET</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">USET</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['USET', 'uset'],
			answerDisplay: 'USET',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Use the Question Text** (*ใช้ข้อความโจทย์เป็นส่วนหนึ่งของคำตอบ*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **USET**'
		}
	},
	'tanuki-removal': {
		id: 'tanuki-removal',
		hasExercise: false,
		englishTitle: 'Tanuki Removal',
		thaiTitle: 'ตัดตัวอักษรตามคำใบ้',
		japaneseTitle: 'たぬき問題',
		description:
			'ใช้ภาพหรือคำว่า たぬき เป็นนัยว่า “เอา た ออก” หรือประยุกต์ให้ลบตัวอักษรที่ระบุออกจากข้อความ',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Tanuki Removal** (ญี่ปุ่น: *たぬき問題*) มาจากการเล่นคำของญี่ปุ่น คำว่า *Tanuki (たぬき)* พ้องเสียงกับวลีว่า *Ta-nuki (「た」を抜く)* ซึ่งแปลว่า **"เอาตัว た ออก"** ในการไขปริศนาสากล กลไกนี้หมายถึงการได้รับข้อความที่มีตัวอักษรส่วนเกินปะปนอยู่ พร้อมคำใบ้หรือภาพสัญลักษณ์ที่เป็นตัวแทนของการ "คัดตัวอักษรนั้นทิ้ง"',
		solvingTechnique:
			'1. สังเกตว่ามีภาพหรือเบาะแสที่บ่งบอกตัวอักษรที่ต้องตัดทิ้ง (เช่น รูป Tanuki หรือคำใบ้ TA)\n2. กวาดสายตามองข้อความแล้วตัดตัวอักษรเป้าหมายออกทั้งหมด\n3. อ่านตัวอักษรที่เหลือติดต่อกันเป็นคำตอบ',
		technicalTerms: [
			{
				en: 'Tanuki Removal',
				ja: 'たぬき問題 / 「た」抜き',
				th: 'การตัดอักษรตามคำสั่งพ้องเสียง'
			},
			{
				en: 'Wordplay',
				ja: '言葉遊び',
				th: 'การเล่นคำ'
			},
			{
				en: 'Letter Elimination',
				ja: '文字削除',
				th: 'การคัดตัวอักษรที่ไม่ต้องการออก'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: กฎของทานุกิ (Tanuki Rule)',
			prompt: 'ใช้กฎ Tanuki Removal โดยตัดตัวอักษร "T" และ "A" ออกจากข้อความ แล้วอ่านคำตอบที่เหลือ',
			hint: 'ข้อความคือ T - K - A - E - T - Y - A ให้ลบ T และ A ออกทั้งหมด',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Eliminate "TA" from the message</text>\n\n  <rect x="180" y="55" width="160" height="30" rx="15" fill="#451a03" stroke="#f59e0b" stroke-width="1.5"/>\n  <text x="260" y="75" fill="#fbbf24" font-size="12" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Rule: - ( T + A )</text>\n\n  <g transform="translate(60, 110)">\n    <rect x="0" y="0" width="45" height="55" rx="8" fill="#7f1d1d" stroke="#ef4444" stroke-width="2"/>\n    <text x="22" y="38" fill="#fca5a5" font-size="24" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">T</text>\n\n    <rect x="60" y="0" width="45" height="55" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>\n    <text x="82" y="38" fill="#38bdf8" font-size="24" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">K</text>\n\n    <rect x="120" y="0" width="45" height="55" rx="8" fill="#7f1d1d" stroke="#ef4444" stroke-width="2"/>\n    <text x="142" y="38" fill="#fca5a5" font-size="24" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">A</text>\n\n    <rect x="180" y="0" width="45" height="55" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>\n    <text x="202" y="38" fill="#38bdf8" font-size="24" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">E</text>\n\n    <rect x="240" y="0" width="45" height="55" rx="8" fill="#7f1d1d" stroke="#ef4444" stroke-width="2"/>\n    <text x="262" y="38" fill="#fca5a5" font-size="24" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">T</text>\n\n    <rect x="300" y="0" width="45" height="55" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>\n    <text x="322" y="38" fill="#38bdf8" font-size="24" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Y</text>\n\n    <rect x="360" y="0" width="45" height="55" rx="8" fill="#7f1d1d" stroke="#ef4444" stroke-width="2"/>\n    <text x="382" y="38" fill="#fca5a5" font-size="24" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">A</text>\n  </g>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Remaining Letters Spell the Answer</text>\n\n  <g transform="translate(130, 90)">\n    <rect x="0" y="0" width="70" height="70" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="35" y="48" fill="#34d399" font-size="34" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">K</text>\n\n    <rect x="95" y="0" width="70" height="70" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="130" y="48" fill="#34d399" font-size="34" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">E</text>\n\n    <rect x="190" y="0" width="70" height="70" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="225" y="48" fill="#34d399" font-size="34" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Y</text>\n  </g>\n</svg>',
			acceptedAnswers: ['KEY', 'key', 'กุญแจ'],
			answerDisplay: 'KEY',
			solutionExplanation:
				'จากข้อความเดิม: [T] - **K** - [A] - **E** - [T] - **Y** - [A]\nเมื่อตัดตัว **T** และ **A** ทั้งหมดออกตามกฎ Tanuki Removal จะเหลือตัวอักษร:\n**K** - **E** - **Y** รวมเป็นคำว่า **KEY** (กุญแจ)'
		}
	},
	'megane-replacement': {
		id: 'megane-replacement',
		hasExercise: false,
		englishTitle: 'Megane Replacement',
		thaiTitle: 'แทนที่ตัวอักษรตามคำใบ้',
		japaneseTitle: 'めがね問題',
		description:
			'ใช้คำอย่าง めがね เป็นคำสั่งให้เปลี่ยน め เป็น ね หรือแทนที่อักษรหนึ่งด้วยอีกอักษรหนึ่ง',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Megane Replacement** (ญี่ปุ่น: *めがね問題*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: ใช้คำอย่าง めがね เป็นคำสั่งให้เปลี่ยน め เป็น ね หรือแทนที่อักษรหนึ่งด้วยอีกอักษรหนึ่ง กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **แทนที่ตัวอักษรตามคำใบ้**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Megane Replacement',
				ja: 'めがね問題',
				th: 'แทนที่ตัวอักษรตามคำใบ้'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส แทนที่ตัวอักษรตามคำใบ้',
			prompt:
				'พิจารณาแผนภาพกลไก แทนที่ตัวอักษรตามคำใบ้ (Megane Replacement) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Megane Replacement Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">แทนที่ตัวอักษรตามคำใบ้</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">MEGA</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: MEGA</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">MEGA</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['MEGA', 'mega'],
			answerDisplay: 'MEGA',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Megane Replacement** (*แทนที่ตัวอักษรตามคำใบ้*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **MEGA**'
		}
	},
	'nth-letter': {
		id: 'nth-letter',
		hasExercise: false,
		englishTitle: 'Nth Letter',
		thaiTitle: 'เลือกตัวอักษรลำดับที่กำหนด',
		japaneseTitle: '何文字目？',
		description: 'นับตำแหน่งตัวอักษรในแต่ละคำแล้วหยิบลำดับที่โจทย์กำหนดมาต่อกัน',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Nth Letter** (ญี่ปุ่น: *何文字目？*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: นับตำแหน่งตัวอักษรในแต่ละคำแล้วหยิบลำดับที่โจทย์กำหนดมาต่อกัน กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **เลือกตัวอักษรลำดับที่กำหนด**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Nth Letter',
				ja: '何文字目？',
				th: 'เลือกตัวอักษรลำดับที่กำหนด'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส เลือกตัวอักษรลำดับที่กำหนด',
			prompt:
				'พิจารณาแผนภาพกลไก เลือกตัวอักษรลำดับที่กำหนด (Nth Letter) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Nth Letter Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">เลือกตัวอักษรลำดับที่กำหนด</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">NTHL</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: NTHL</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">NTHL</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['NTHL', 'nthl'],
			answerDisplay: 'NTHL',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Nth Letter** (*เลือกตัวอักษรลำดับที่กำหนด*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **NTHL**'
		}
	},
	'english-japanese-conversion': {
		id: 'english-japanese-conversion',
		hasExercise: false,
		englishTitle: 'English–Japanese Conversion',
		thaiTitle: 'แปลงระหว่างภาษาอังกฤษกับภาษาญี่ปุ่น',
		japaneseTitle: '英語／日本語変換',
		description: 'แปลคำหรือสลับภาษาเพื่อให้ได้คำที่สามารถนำไปเข้ากลไกขั้นถัดไป',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **English–Japanese Conversion** (ญี่ปุ่น: *英語／日本語変換*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: แปลคำหรือสลับภาษาเพื่อให้ได้คำที่สามารถนำไปเข้ากลไกขั้นถัดไป กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **แปลงระหว่างภาษาอังกฤษกับภาษาญี่ปุ่น**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'English–Japanese Conversion',
				ja: '英語／日本語変換',
				th: 'แปลงระหว่างภาษาอังกฤษกับภาษาญี่ปุ่น'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส แปลงระหว่างภาษาอังกฤษกับภาษาญี่ปุ่น',
			prompt:
				'พิจารณาแผนภาพกลไก แปลงระหว่างภาษาอังกฤษกับภาษาญี่ปุ่น (English–Japanese Conversion) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">English–Japanese Conversion Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">แปลงระหว่างภาษาอังกฤษกับภาษาญี่ปุ่น</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">ENGL</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: ENGL</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">ENGL</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['ENGL', 'engl'],
			answerDisplay: 'ENGL',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **English–Japanese Conversion** (*แปลงระหว่างภาษาอังกฤษกับภาษาญี่ปุ่น*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **ENGL**'
		}
	},
	'script-conversion': {
		id: 'script-conversion',
		hasExercise: false,
		englishTitle: 'Script Conversion',
		thaiTitle: 'แปลงชนิดตัวอักษร',
		japaneseTitle: '文字種変換',
		description:
			'เปลี่ยนระบบอักษร เช่น ฮิรางานะ คาตากานะ คันจิ หรือตัวละติน โดยคงเสียงหรือความหมายเดิม',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Script Conversion** (ญี่ปุ่น: *文字種変換*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: เปลี่ยนระบบอักษร เช่น ฮิรางานะ คาตากานะ คันจิ หรือตัวละติน โดยคงเสียงหรือความหมายเดิม กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **แปลงชนิดตัวอักษร**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Script Conversion',
				ja: '文字種変換',
				th: 'แปลงชนิดตัวอักษร'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส แปลงชนิดตัวอักษร',
			prompt:
				'พิจารณาแผนภาพกลไก แปลงชนิดตัวอักษร (Script Conversion) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Script Conversion Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">แปลงชนิดตัวอักษร</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">SCRI</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: SCRI</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">SCRI</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['SCRI', 'scri'],
			answerDisplay: 'SCRI',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Script Conversion** (*แปลงชนิดตัวอักษร*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **SCRI**'
		}
	},
	'romaji-conversion': {
		id: 'romaji-conversion',
		hasExercise: false,
		englishTitle: 'Romaji Conversion',
		thaiTitle: 'แปลงเป็นหรือจากโรมาจิ',
		japaneseTitle: 'ローマ字変換',
		description: 'เขียนเสียงภาษาญี่ปุ่นด้วยตัวอักษรโรมัน หรือแปลงโรมาจิกลับเป็นคานะ',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Romaji Conversion** (ญี่ปุ่น: *ローマ字変換*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: เขียนเสียงภาษาญี่ปุ่นด้วยตัวอักษรโรมัน หรือแปลงโรมาจิกลับเป็นคานะ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **แปลงเป็นหรือจากโรมาจิ**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Romaji Conversion',
				ja: 'ローマ字変換',
				th: 'แปลงเป็นหรือจากโรมาจิ'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส แปลงเป็นหรือจากโรมาจิ',
			prompt:
				'พิจารณาแผนภาพกลไก แปลงเป็นหรือจากโรมาจิ (Romaji Conversion) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Romaji Conversion Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">แปลงเป็นหรือจากโรมาจิ</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">ROMA</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: ROMA</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">ROMA</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['ROMA', 'roma'],
			answerDisplay: 'ROMA',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Romaji Conversion** (*แปลงเป็นหรือจากโรมาจิ*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **ROMA**'
		}
	},
	'symbol-letter-conversion': {
		id: 'symbol-letter-conversion',
		hasExercise: false,
		englishTitle: 'Symbol–Letter Conversion',
		thaiTitle: 'แปลงสัญลักษณ์เป็นตัวอักษร',
		japaneseTitle: '記号文字変換',
		description: 'ตีความเครื่องหมาย ไอคอน หรือรูปทรงให้เป็นตัวอักษรตามรูปร่าง ชื่อ หรือตารางกำกับ',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Symbol–Letter Conversion** (ญี่ปุ่น: *記号文字変換*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: ตีความเครื่องหมาย ไอคอน หรือรูปทรงให้เป็นตัวอักษรตามรูปร่าง ชื่อ หรือตารางกำกับ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **แปลงสัญลักษณ์เป็นตัวอักษร**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Symbol–Letter Conversion',
				ja: '記号文字変換',
				th: 'แปลงสัญลักษณ์เป็นตัวอักษร'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส แปลงสัญลักษณ์เป็นตัวอักษร',
			prompt:
				'พิจารณาแผนภาพกลไก แปลงสัญลักษณ์เป็นตัวอักษร (Symbol–Letter Conversion) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Symbol–Letter Conversion Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">แปลงสัญลักษณ์เป็นตัวอักษร</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">SYMB</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: SYMB</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">SYMB</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['SYMB', 'symb'],
			answerDisplay: 'SYMB',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Symbol–Letter Conversion** (*แปลงสัญลักษณ์เป็นตัวอักษร*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **SYMB**'
		}
	},
	'split-and-join-words': {
		id: 'split-and-join-words',
		hasExercise: false,
		englishTitle: 'Split and Join Words',
		thaiTitle: 'แบ่งและรวมคำ',
		japaneseTitle: '言葉の分割／結合',
		description: 'แบ่งคำออกเป็นส่วนย่อยหรือรวมหลายส่วนเข้าด้วยกันเพื่อสร้างเสียงและความหมายใหม่',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Split and Join Words** (ญี่ปุ่น: *言葉の分割／結合*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: แบ่งคำออกเป็นส่วนย่อยหรือรวมหลายส่วนเข้าด้วยกันเพื่อสร้างเสียงและความหมายใหม่ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **แบ่งและรวมคำ**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Split and Join Words',
				ja: '言葉の分割／結合',
				th: 'แบ่งและรวมคำ'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส แบ่งและรวมคำ',
			prompt:
				'พิจารณาแผนภาพกลไก แบ่งและรวมคำ (Split and Join Words) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Split and Join Words Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">แบ่งและรวมคำ</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">SPLI</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: SPLI</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">SPLI</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['SPLI', 'spli'],
			answerDisplay: 'SPLI',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Split and Join Words** (*แบ่งและรวมคำ*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **SPLI**'
		}
	},
	homophones: {
		id: 'homophones',
		hasExercise: false,
		englishTitle: 'Homophones',
		thaiTitle: 'คำพ้องเสียง',
		japaneseTitle: '同音異義語',
		description: 'ใช้คำที่ออกเสียงเหมือนกันแต่เขียนหรือมีความหมายต่างกันเป็นจุดเปลี่ยนของคำตอบ',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Homophones** (ญี่ปุ่น: *同音異義語*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: ใช้คำที่ออกเสียงเหมือนกันแต่เขียนหรือมีความหมายต่างกันเป็นจุดเปลี่ยนของคำตอบ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **คำพ้องเสียง**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Homophones',
				ja: '同音異義語',
				th: 'คำพ้องเสียง'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส คำพ้องเสียง',
			prompt: 'พิจารณาแผนภาพกลไก คำพ้องเสียง (Homophones) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Homophones Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำพ้องเสียง</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">HOMO</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: HOMO</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">HOMO</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['HOMO', 'homo'],
			answerDisplay: 'HOMO',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Homophones** (*คำพ้องเสียง*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **HOMO**'
		}
	},
	antonyms: {
		id: 'antonyms',
		hasExercise: false,
		englishTitle: 'Antonyms',
		thaiTitle: 'คำตรงข้าม',
		japaneseTitle: '対義語',
		description: 'เปลี่ยนคำให้เป็นความหมายตรงข้าม เช่น บน–ล่าง หรือเข้า–ออก แล้วใช้คำใหม่แก้โจทย์',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Antonyms** (ญี่ปุ่น: *対義語*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: เปลี่ยนคำให้เป็นความหมายตรงข้าม เช่น บน–ล่าง หรือเข้า–ออก แล้วใช้คำใหม่แก้โจทย์ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **คำตรงข้าม**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Antonyms',
				ja: '対義語',
				th: 'คำตรงข้าม'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส คำตรงข้าม',
			prompt: 'พิจารณาแผนภาพกลไก คำตรงข้าม (Antonyms) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Antonyms Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตรงข้าม</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">ANTO</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: ANTO</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">ANTO</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['ANTO', 'anto'],
			answerDisplay: 'ANTO',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Antonyms** (*คำตรงข้าม*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **ANTO**'
		}
	},
	'heads-and-tails': {
		id: 'heads-and-tails',
		hasExercise: false,
		englishTitle: 'Heads and Tails',
		thaiTitle: 'อักษรหัวและอักษรท้าย',
		japaneseTitle: '頭／お尻',
		description: 'หยิบตัวอักษรแรกหรือตัวอักษรสุดท้ายของคำหลายคำมาต่อกัน',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Heads and Tails** (ญี่ปุ่น: *頭／お尻*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: หยิบตัวอักษรแรกหรือตัวอักษรสุดท้ายของคำหลายคำมาต่อกัน กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **อักษรหัวและอักษรท้าย**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Heads and Tails',
				ja: '頭／お尻',
				th: 'อักษรหัวและอักษรท้าย'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส อักษรหัวและอักษรท้าย',
			prompt:
				'พิจารณาแผนภาพกลไก อักษรหัวและอักษรท้าย (Heads and Tails) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Heads and Tails Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">อักษรหัวและอักษรท้าย</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">HEAD</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: HEAD</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">HEAD</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['HEAD', 'head'],
			answerDisplay: 'HEAD',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Heads and Tails** (*อักษรหัวและอักษรท้าย*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **HEAD**'
		}
	},
	'reverse-and-palindrome': {
		id: 'reverse-and-palindrome',
		hasExercise: false,
		englishTitle: 'Reverse Reading and Palindromes',
		thaiTitle: 'อ่านย้อนกลับและคำพาลินโดรม',
		japaneseTitle: '逆から読む／回文',
		description: 'อ่านลำดับจากท้ายไปหน้า หรือสังเกตข้อความที่อ่านได้เหมือนกันทั้งสองทิศทาง',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Reverse Reading and Palindromes** (ญี่ปุ่น: *逆から読む／回文*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: อ่านลำดับจากท้ายไปหน้า หรือสังเกตข้อความที่อ่านได้เหมือนกันทั้งสองทิศทาง กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **อ่านย้อนกลับและคำพาลินโดรม**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Reverse Reading and Palindromes',
				ja: '逆から読む／回文',
				th: 'อ่านย้อนกลับและคำพาลินโดรม'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส อ่านย้อนกลับและคำพาลินโดรม',
			prompt:
				'พิจารณาแผนภาพกลไก อ่านย้อนกลับและคำพาลินโดรม (Reverse Reading and Palindromes) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Reverse Reading and Palindromes Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">อ่านย้อนกลับและคำพาลินโดรม</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">REVE</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: REVE</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">REVE</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['REVE', 'reve'],
			answerDisplay: 'REVE',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Reverse Reading and Palindromes** (*อ่านย้อนกลับและคำพาลินโดรม*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **REVE**'
		}
	},
	'letter-manipulation': {
		id: 'letter-manipulation',
		hasExercise: false,
		englishTitle: 'Letter Manipulation',
		thaiTitle: 'จัดการตัวอักษร',
		japaneseTitle: '文字操作',
		description: 'เพิ่ม ลบ ย้าย สลับ หรือเปลี่ยนตัวอักษรตามคำสั่งเพื่อสร้างคำใหม่',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Letter Manipulation** (ญี่ปุ่น: *文字操作*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: เพิ่ม ลบ ย้าย สลับ หรือเปลี่ยนตัวอักษรตามคำสั่งเพื่อสร้างคำใหม่ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **จัดการตัวอักษร**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Letter Manipulation',
				ja: '文字操作',
				th: 'จัดการตัวอักษร'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส จัดการตัวอักษร',
			prompt:
				'พิจารณาแผนภาพกลไก จัดการตัวอักษร (Letter Manipulation) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Letter Manipulation Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">จัดการตัวอักษร</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">LETT</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: LETT</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">LETT</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['LETT', 'lett'],
			answerDisplay: 'LETT',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Letter Manipulation** (*จัดการตัวอักษร*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **LETT**'
		}
	},
	'add-the-same-letter': {
		id: 'add-the-same-letter',
		hasExercise: false,
		englishTitle: 'Add the Same Letter',
		thaiTitle: 'เติมตัวอักษรเดียวกัน',
		japaneseTitle: '同じ文字を加える',
		description: 'เติมอักษรตัวเดียวกันลงในหลายช่องหรือหลายคำเพื่อให้ทุกชุดกลายเป็นคำที่ถูกต้อง',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Add the Same Letter** (ญี่ปุ่น: *同じ文字を加える*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: เติมอักษรตัวเดียวกันลงในหลายช่องหรือหลายคำเพื่อให้ทุกชุดกลายเป็นคำที่ถูกต้อง กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **เติมตัวอักษรเดียวกัน**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Add the Same Letter',
				ja: '同じ文字を加える',
				th: 'เติมตัวอักษรเดียวกัน'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส เติมตัวอักษรเดียวกัน',
			prompt:
				'พิจารณาแผนภาพกลไก เติมตัวอักษรเดียวกัน (Add the Same Letter) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Add the Same Letter Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">เติมตัวอักษรเดียวกัน</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">ADDT</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: ADDT</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">ADDT</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['ADDT', 'addt'],
			answerDisplay: 'ADDT',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Add the Same Letter** (*เติมตัวอักษรเดียวกัน*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **ADDT**'
		}
	},
	'complete-missing-letters': {
		id: 'complete-missing-letters',
		hasExercise: false,
		englishTitle: 'Complete Missing Letters',
		thaiTitle: 'เติมตัวอักษรที่ขาด',
		japaneseTitle: '足りない文字を補完',
		description: 'ตรวจว่าชุดตัวอักษรควรครบตามระบบใด แล้วเติมตัวที่หายไป',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Complete Missing Letters** (ญี่ปุ่น: *足りない文字を補完*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: ตรวจว่าชุดตัวอักษรควรครบตามระบบใด แล้วเติมตัวที่หายไป กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **เติมตัวอักษรที่ขาด**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Complete Missing Letters',
				ja: '足りない文字を補完',
				th: 'เติมตัวอักษรที่ขาด'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส เติมตัวอักษรที่ขาด',
			prompt:
				'พิจารณาแผนภาพกลไก เติมตัวอักษรที่ขาด (Complete Missing Letters) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Complete Missing Letters Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">เติมตัวอักษรที่ขาด</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">COMP</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: COMP</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">COMP</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['COMP', 'comp'],
			answerDisplay: 'COMP',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Complete Missing Letters** (*เติมตัวอักษรที่ขาด*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **COMP**'
		}
	},
	'vowels-and-consonants': {
		id: 'vowels-and-consonants',
		hasExercise: false,
		englishTitle: 'Vowels and Consonants',
		thaiTitle: 'สระและพยัญชนะ',
		japaneseTitle: '母音子音',
		description: 'แยกหรือแทนเสียงสระและพยัญชนะ เพื่อวิเคราะห์โครงสร้างเสียงของคำ',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Vowels and Consonants** (ญี่ปุ่น: *母音子音*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: แยกหรือแทนเสียงสระและพยัญชนะ เพื่อวิเคราะห์โครงสร้างเสียงของคำ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **สระและพยัญชนะ**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Vowels and Consonants',
				ja: '母音子音',
				th: 'สระและพยัญชนะ'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส สระและพยัญชนะ',
			prompt:
				'พิจารณาแผนภาพกลไก สระและพยัญชนะ (Vowels and Consonants) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Vowels and Consonants Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">สระและพยัญชนะ</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">VOWE</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: VOWE</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">VOWE</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['VOWE', 'vowe'],
			answerDisplay: 'VOWE',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Vowels and Consonants** (*สระและพยัญชนะ*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **VOWE**'
		}
	},
	'kanji-katakana-readings': {
		id: 'kanji-katakana-readings',
		hasExercise: false,
		englishTitle: 'Kanji and Katakana Readings',
		thaiTitle: 'การอ่านคันจิและคาตากานะ',
		japaneseTitle: '漢字カタカナ読み',
		description: 'ใช้เสียงอ่านหลายแบบของคันจิหรือการถอดเสียงคาตากานะเพื่อค้นหาคำที่ตั้งใจไว้',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Kanji and Katakana Readings** (ญี่ปุ่น: *漢字カタカナ読み*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: ใช้เสียงอ่านหลายแบบของคันจิหรือการถอดเสียงคาตากานะเพื่อค้นหาคำที่ตั้งใจไว้ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **การอ่านคันจิและคาตากานะ**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Kanji and Katakana Readings',
				ja: '漢字カタカナ読み',
				th: 'การอ่านคันจิและคาตากานะ'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส การอ่านคันจิและคาตากานะ',
			prompt:
				'พิจารณาแผนภาพกลไก การอ่านคันจิและคาตากานะ (Kanji and Katakana Readings) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Kanji and Katakana Readings Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">การอ่านคันจิและคาตากานะ</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">KANJ</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: KANJ</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">KANJ</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['KANJ', 'kanj'],
			answerDisplay: 'KANJ',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Kanji and Katakana Readings** (*การอ่านคันจิและคาตากานะ*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **KANJ**'
		}
	},
	'combined-kanji': {
		id: 'combined-kanji',
		hasExercise: false,
		englishTitle: 'Combined Kanji',
		thaiTitle: 'ประกอบคันจิ',
		japaneseTitle: '合体漢字',
		description: 'นำส่วนประกอบหรือคันจิหลายตัวมาซ้อนและรวมกันให้เกิดคันจิตัวใหม่',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Combined Kanji** (ญี่ปุ่น: *合体漢字*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: นำส่วนประกอบหรือคันจิหลายตัวมาซ้อนและรวมกันให้เกิดคันจิตัวใหม่ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ประกอบคันจิ**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Combined Kanji',
				ja: '合体漢字',
				th: 'ประกอบคันจิ'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ประกอบคันจิ',
			prompt: 'พิจารณาแผนภาพกลไก ประกอบคันจิ (Combined Kanji) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Combined Kanji Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ประกอบคันจิ</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">COMB</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: COMB</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">COMB</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['COMB', 'comb'],
			answerDisplay: 'COMB',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Combined Kanji** (*ประกอบคันจิ*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **COMB**'
		}
	},
	'rotate-to-read': {
		id: 'rotate-to-read',
		hasExercise: false,
		englishTitle: 'Rotate to Read',
		thaiTitle: 'หมุนทิศทางแล้วอ่าน',
		japaneseTitle: '向きを変えて読む',
		description: 'หมุนตัวอักษร กระดาษ หรือมุมมองเพื่อให้รูปร่างกลายเป็นข้อความที่อ่านได้',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Rotate to Read** (ญี่ปุ่น: *向きを変えて読む*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: หมุนตัวอักษร กระดาษ หรือมุมมองเพื่อให้รูปร่างกลายเป็นข้อความที่อ่านได้ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **หมุนทิศทางแล้วอ่าน**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Rotate to Read',
				ja: '向きを変えて読む',
				th: 'หมุนทิศทางแล้วอ่าน'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส หมุนทิศทางแล้วอ่าน',
			prompt:
				'พิจารณาแผนภาพกลไก หมุนทิศทางแล้วอ่าน (Rotate to Read) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Rotate to Read Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">หมุนทิศทางแล้วอ่าน</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">ROTA</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: ROTA</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">ROTA</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['ROTA', 'rota'],
			answerDisplay: 'ROTA',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Rotate to Read** (*หมุนทิศทางแล้วอ่าน*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **ROTA**'
		}
	},
	'furigana-and-okurigana': {
		id: 'furigana-and-okurigana',
		hasExercise: false,
		englishTitle: 'Furigana and Okurigana',
		thaiTitle: 'ฟูริงานะและโอคุริงานะ',
		japaneseTitle: 'ふりがな／送りがな',
		description: 'ใช้ตัวกำกับเสียงอ่านหรือคานะท้ายคันจิเป็นเบาะแสในการเลือกและประกอบคำ',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Furigana and Okurigana** (ญี่ปุ่น: *ふりがな／送りがな*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: ใช้ตัวกำกับเสียงอ่านหรือคานะท้ายคันจิเป็นเบาะแสในการเลือกและประกอบคำ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ฟูริงานะและโอคุริงานะ**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Furigana and Okurigana',
				ja: 'ふりがな／送りがな',
				th: 'ฟูริงานะและโอคุริงานะ'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ฟูริงานะและโอคุริงานะ',
			prompt:
				'พิจารณาแผนภาพกลไก ฟูริงานะและโอคุริงานะ (Furigana and Okurigana) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Furigana and Okurigana Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ฟูริงานะและโอคุริงานะ</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">FURI</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: FURI</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">FURI</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['FURI', 'furi'],
			answerDisplay: 'FURI',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Furigana and Okurigana** (*ฟูริงานะและโอคุริงานะ*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **FURI**'
		}
	},
	'hidden-words': {
		id: 'hidden-words',
		hasExercise: false,
		englishTitle: 'Hidden Words',
		thaiTitle: 'คำที่ซ่อนอยู่',
		japaneseTitle: '隠れた言葉',
		description: 'ค้นหาคำที่ซ่อนต่อเนื่องอยู่ภายในคำ ประโยค หรือรอยต่อระหว่างหลายคำ',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Hidden Words** (ญี่ปุ่น: *隠れた言葉*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: ค้นหาคำที่ซ่อนต่อเนื่องอยู่ภายในคำ ประโยค หรือรอยต่อระหว่างหลายคำ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **คำที่ซ่อนอยู่**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Hidden Words',
				ja: '隠れた言葉',
				th: 'คำที่ซ่อนอยู่'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส คำที่ซ่อนอยู่',
			prompt: 'พิจารณาแผนภาพกลไก คำที่ซ่อนอยู่ (Hidden Words) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Hidden Words Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำที่ซ่อนอยู่</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">HIDD</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: HIDD</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">HIDD</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['HIDD', 'hidd'],
			answerDisplay: 'HIDD',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Hidden Words** (*คำที่ซ่อนอยู่*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **HIDD**'
		}
	},
	'word-chain': {
		id: 'word-chain',
		hasExercise: false,
		englishTitle: 'Word Chain',
		thaiTitle: 'เกมต่อคำ',
		japaneseTitle: 'しりとり',
		description: 'ต่อคำโดยให้เสียงหรืออักษรท้ายของคำก่อนหน้าเป็นจุดเริ่มของคำถัดไป',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Word Chain** (ญี่ปุ่น: *しりとり*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: ต่อคำโดยให้เสียงหรืออักษรท้ายของคำก่อนหน้าเป็นจุดเริ่มของคำถัดไป กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **เกมต่อคำ**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Word Chain',
				ja: 'しりとり',
				th: 'เกมต่อคำ'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส เกมต่อคำ',
			prompt: 'พิจารณาแผนภาพกลไก เกมต่อคำ (Word Chain) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Word Chain Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">เกมต่อคำ</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">WORD</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: WORD</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">WORD</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['WORD', 'word'],
			answerDisplay: 'WORD',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Word Chain** (*เกมต่อคำ*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **WORD**'
		}
	},
	riddles: {
		id: 'riddles',
		hasExercise: false,
		englishTitle: 'Riddles',
		thaiTitle: 'ปริศนาคำทาย',
		japaneseTitle: 'なぞなぞ',
		description: 'ตีความคำถามแบบเล่นคำหรือมุมมองนอกกรอบเพื่อหาคำตอบที่มีเหตุผลซ่อนอยู่',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Riddles** (ญี่ปุ่น: *なぞなぞ*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: ตีความคำถามแบบเล่นคำหรือมุมมองนอกกรอบเพื่อหาคำตอบที่มีเหตุผลซ่อนอยู่ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ปริศนาคำทาย**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Riddles',
				ja: 'なぞなぞ',
				th: 'ปริศนาคำทาย'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ปริศนาคำทาย',
			prompt: 'พิจารณาแผนภาพกลไก ปริศนาคำทาย (Riddles) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Riddles Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ปริศนาคำทาย</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">RIDD</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: RIDD</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">RIDD</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['RIDD', 'ridd'],
			answerDisplay: 'RIDD',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Riddles** (*ปริศนาคำทาย*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **RIDD**'
		}
	},
	'ari-nashi': {
		id: 'ari-nashi',
		hasExercise: false,
		englishTitle: 'Ari–Nashi Classification',
		thaiTitle: 'โจทย์แบ่งกลุ่มมี–ไม่มี',
		japaneseTitle: 'あるなし問題',
		description:
			'เปรียบเทียบกลุ่ม “มี” กับ “ไม่มี” เพื่อค้นหาคุณสมบัติร่วมที่แบ่งสองกลุ่มออกจากกัน',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Ari–Nashi Classification** (ญี่ปุ่น: *あるなし問題*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: เปรียบเทียบกลุ่ม “มี” กับ “ไม่มี” เพื่อค้นหาคุณสมบัติร่วมที่แบ่งสองกลุ่มออกจากกัน กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **โจทย์แบ่งกลุ่มมี–ไม่มี**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Ari–Nashi Classification',
				ja: 'あるなし問題',
				th: 'โจทย์แบ่งกลุ่มมี–ไม่มี'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส โจทย์แบ่งกลุ่มมี–ไม่มี',
			prompt:
				'พิจารณาแผนภาพกลไก โจทย์แบ่งกลุ่มมี–ไม่มี (Ari–Nashi Classification) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Ari–Nashi Classification Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">โจทย์แบ่งกลุ่มมี–ไม่มี</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">ARIN</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: ARIN</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">ARIN</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['ARIN', 'arin'],
			answerDisplay: 'ARIN',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Ari–Nashi Classification** (*โจทย์แบ่งกลุ่มมี–ไม่มี*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **ARIN**'
		}
	},
	'character-composition': {
		id: 'character-composition',
		hasExercise: false,
		englishTitle: 'Character Composition',
		thaiTitle: 'โครงสร้างตัวอักษร',
		japaneseTitle: '文字構成',
		description:
			'แยกตัวอักษรเป็นเส้น ส่วนประกอบ หรือตัวอักษรย่อย แล้วประกอบความหมายจากโครงสร้างนั้น',
		chapter: {
			id: 'wordplay',
			hasExercise: false,
			englishTitle: 'Wordplay',
			thaiTitle: 'การเล่นคำ',
			japaneseTitle: '言葉遊び',
			accent: 'badge-secondary'
		},
		detailedDescription:
			'กลไก **Character Composition** (ญี่ปุ่น: *文字構成*) เป็นเทคนิคสำคัญในหมวดหมู่ **การเล่นคำ** (*Wordplay*) มีสาระสำคัญคือ: แยกตัวอักษรเป็นเส้น ส่วนประกอบ หรือตัวอักษรย่อย แล้วประกอบความหมายจากโครงสร้างนั้น กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **โครงสร้างตัวอักษร**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Character Composition',
				ja: '文字構成',
				th: 'โครงสร้างตัวอักษร'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส โครงสร้างตัวอักษร',
			prompt:
				'พิจารณาแผนภาพกลไก โครงสร้างตัวอักษร (Character Composition) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Character Composition Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">โครงสร้างตัวอักษร</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">CHAR</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: CHAR</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">CHAR</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['CHAR', 'char'],
			answerDisplay: 'CHAR',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Character Composition** (*โครงสร้างตัวอักษร*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **CHAR**'
		}
	},
	gojuon: {
		id: 'gojuon',
		hasExercise: false,
		englishTitle: 'The Japanese Syllabary',
		thaiTitle: 'ตารางห้าสิบเสียงญี่ปุ่น',
		japaneseTitle: '五十音',
		description: 'ใช้ลำดับแถวและคอลัมน์ของตารางโกจูองเพื่อแทนตำแหน่งหรือแปลงเสียงคานะ',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **The Japanese Syllabary** (ญี่ปุ่น: *五十音*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: ใช้ลำดับแถวและคอลัมน์ของตารางโกจูองเพื่อแทนตำแหน่งหรือแปลงเสียงคานะ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ตารางห้าสิบเสียงญี่ปุ่น**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'The Japanese Syllabary',
				ja: '五十音',
				th: 'ตารางห้าสิบเสียงญี่ปุ่น'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ตารางห้าสิบเสียงญี่ปุ่น',
			prompt:
				'พิจารณาแผนภาพกลไก ตารางห้าสิบเสียงญี่ปุ่น (The Japanese Syllabary) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">The Japanese Syllabary Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตารางห้าสิบเสียงญี่ปุ่น</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">THEJ</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: THEJ</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">THEJ</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['THEJ', 'thej'],
			answerDisplay: 'THEJ',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **The Japanese Syllabary** (*ตารางห้าสิบเสียงญี่ปุ่น*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **THEJ**'
		}
	},
	alphabet: {
		id: 'alphabet',
		hasExercise: false,
		englishTitle: 'The Alphabet',
		thaiTitle: 'ตัวอักษรภาษาอังกฤษ',
		japaneseTitle: 'アルファベット',
		description: 'ใช้ลำดับ A–Z รูปร่างตัวอักษร หรือค่าตัวเลขประจำตำแหน่งเป็นข้อมูลแก้ปริศนา',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Alphabet** (ญี่ปุ่น: *アルファベット*) เป็นหนึ่งในแม่แบบที่พบบ่อยที่สุดในวงการ *Puzzle* โดยนำระบบอักษรละติน 26 ตัวมาแปลงเป็นตัวเลข A=1, B=2, ... Z=26 หรือใช้ตำแหน่งของตัวอักษรเป็นพิกัดในการถอดรหัสคำตอบ',
		solvingTechnique:
			'1. ตรวจสอบว่าตัวเลขอยู่ในช่วง 1 ถึง 26 หรือไม่\n2. เทียบค่า: 1=A, 2=B, 3=C, ... 16=P, 15=O, 16=P\n3. ประกอบอักษรที่ได้เพื่ออ่านเป็นคำตอบ',
		technicalTerms: [
			{
				en: 'A1Z26 Cipher',
				ja: 'アルファベット暗号',
				th: 'รหัสแทนตัวอักษรด้วยเลขลำดับ 1-26'
			},
			{
				en: 'Index Number',
				ja: 'インデックス番号',
				th: 'ตัวเลขอ้างอิงลำดับ'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: รหัสตัวเลขอักษร A1Z26',
			prompt: 'ถอดรหัสตัวเลข [ 16 - 15 - 16 ] ตามลำดับตัวอักษรภาษาอังกฤษ A=1 ถึง Z=26',
			hint: 'P คือตัวอักษรที่ 16 และ O คือตัวอักษรที่ 15',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="40" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">A=1, B=2, C=3 ... Z=26</text>\n\n  <g transform="translate(100, 75)">\n    <rect x="0" y="0" width="90" height="85" rx="14" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>\n    <text x="45" y="55" fill="#38bdf8" font-size="36" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">16</text>\n    <text x="45" y="112" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">( ? )</text>\n\n    <rect x="115" y="0" width="90" height="85" rx="14" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>\n    <text x="160" y="55" fill="#38bdf8" font-size="36" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">15</text>\n    <text x="160" y="112" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">( ? )</text>\n\n    <rect x="230" y="0" width="90" height="85" rx="14" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>\n    <text x="275" y="55" fill="#38bdf8" font-size="36" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">16</text>\n    <text x="275" y="112" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">( ? )</text>\n  </g>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="40" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">16=P, 15=O, 16=P</text>\n\n  <g transform="translate(100, 75)">\n    <rect x="0" y="0" width="90" height="85" rx="14" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="45" y="55" fill="#34d399" font-size="36" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">P</text>\n    <text x="45" y="112" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">(16)</text>\n\n    <rect x="115" y="0" width="90" height="85" rx="14" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="160" y="55" fill="#34d399" font-size="36" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">O</text>\n    <text x="160" y="112" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">(15)</text>\n\n    <rect x="230" y="0" width="90" height="85" rx="14" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="275" y="55" fill="#34d399" font-size="36" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">P</text>\n    <text x="275" y="112" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">(16)</text>\n  </g>\n</svg>',
			acceptedAnswers: ['POP', 'pop', 'ป๊อป'],
			answerDisplay: 'POP',
			solutionExplanation:
				'แปลงตัวเลขตามลำดับ Alphabet (A=1 ถึง Z=26):\n- 16 ตรงกับตัวอักษร **P**\n- 15 ตรงกับตัวอักษร **O**\n- 16 ตรงกับตัวอักษร **P**\nคำตอบที่ได้คือ **POP**'
		}
	},
	'chinese-zodiac': {
		id: 'chinese-zodiac',
		hasExercise: false,
		englishTitle: 'Chinese Zodiac',
		thaiTitle: 'สิบสองนักษัตร',
		japaneseTitle: '十二支',
		description: 'อาศัยลำดับสัตว์ 12 นักษัตร ชื่อ หรือคุณสมบัติของแต่ละปีเป็นชุดอ้างอิง',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Chinese Zodiac** (ญี่ปุ่น: *十二支*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: อาศัยลำดับสัตว์ 12 นักษัตร ชื่อ หรือคุณสมบัติของแต่ละปีเป็นชุดอ้างอิง กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **สิบสองนักษัตร**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Chinese Zodiac',
				ja: '十二支',
				th: 'สิบสองนักษัตร'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส สิบสองนักษัตร',
			prompt:
				'พิจารณาแผนภาพกลไก สิบสองนักษัตร (Chinese Zodiac) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Chinese Zodiac Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">สิบสองนักษัตร</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">CHIN</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: CHIN</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">CHIN</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['CHIN', 'chin'],
			answerDisplay: 'CHIN',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Chinese Zodiac** (*สิบสองนักษัตร*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **CHIN**'
		}
	},
	'days-of-the-week': {
		id: 'days-of-the-week',
		hasExercise: false,
		englishTitle: 'Days of the Week',
		thaiTitle: 'วันในสัปดาห์',
		japaneseTitle: '曜日',
		description: 'ใช้ลำดับ ชื่อ สี หรือคันจิของวันทั้งเจ็ดในการเรียงและแปลงข้อมูล',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Days of the Week** (ญี่ปุ่น: *曜日*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: ใช้ลำดับ ชื่อ สี หรือคันจิของวันทั้งเจ็ดในการเรียงและแปลงข้อมูล กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **วันในสัปดาห์**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Days of the Week',
				ja: '曜日',
				th: 'วันในสัปดาห์'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส วันในสัปดาห์',
			prompt:
				'พิจารณาแผนภาพกลไก วันในสัปดาห์ (Days of the Week) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Days of the Week Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">วันในสัปดาห์</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">DAYS</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: DAYS</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">DAYS</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['DAYS', 'days'],
			answerDisplay: 'DAYS',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Days of the Week** (*วันในสัปดาห์*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **DAYS**'
		}
	},
	planets: {
		id: 'planets',
		hasExercise: false,
		englishTitle: 'Planets',
		thaiTitle: 'ดาวเคราะห์',
		japaneseTitle: '惑星',
		description: 'ใช้ลำดับดาวเคราะห์จากดวงอาทิตย์ ชื่อ สัญลักษณ์ หรือคุณสมบัติเด่นเป็นกุญแจ',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Planets** (ญี่ปุ่น: *惑星*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: ใช้ลำดับดาวเคราะห์จากดวงอาทิตย์ ชื่อ สัญลักษณ์ หรือคุณสมบัติเด่นเป็นกุญแจ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ดาวเคราะห์**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Planets',
				ja: '惑星',
				th: 'ดาวเคราะห์'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ดาวเคราะห์',
			prompt: 'พิจารณาแผนภาพกลไก ดาวเคราะห์ (Planets) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Planets Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ดาวเคราะห์</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">PLAN</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: PLAN</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">PLAN</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['PLAN', 'plan'],
			answerDisplay: 'PLAN',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Planets** (*ดาวเคราะห์*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **PLAN**'
		}
	},
	'japanese-prefectures': {
		id: 'japanese-prefectures',
		hasExercise: false,
		englishTitle: 'Japanese Prefectures',
		thaiTitle: 'จังหวัดของญี่ปุ่น',
		japaneseTitle: '都道府県',
		description: 'อ้างอิงชื่อ ตำแหน่ง รูปร่าง หรือการแบ่งเขตของ 47 จังหวัดญี่ปุ่น',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Japanese Prefectures** (ญี่ปุ่น: *都道府県*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: อ้างอิงชื่อ ตำแหน่ง รูปร่าง หรือการแบ่งเขตของ 47 จังหวัดญี่ปุ่น กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **จังหวัดของญี่ปุ่น**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Japanese Prefectures',
				ja: '都道府県',
				th: 'จังหวัดของญี่ปุ่น'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส จังหวัดของญี่ปุ่น',
			prompt:
				'พิจารณาแผนภาพกลไก จังหวัดของญี่ปุ่น (Japanese Prefectures) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Japanese Prefectures Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">จังหวัดของญี่ปุ่น</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">JAPA</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: JAPA</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">JAPA</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['JAPA', 'japa'],
			answerDisplay: 'JAPA',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Japanese Prefectures** (*จังหวัดของญี่ปุ่น*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **JAPA**'
		}
	},
	directions: {
		id: 'directions',
		hasExercise: false,
		englishTitle: 'Directions',
		thaiTitle: 'ทิศทาง',
		japaneseTitle: '方角',
		description: 'ใช้ทิศเหนือ ใต้ ออก ตก หรือทิศย่อยเพื่อกำหนดการเดิน การอ่าน และตำแหน่ง',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Directions** (ญี่ปุ่น: *方角*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: ใช้ทิศเหนือ ใต้ ออก ตก หรือทิศย่อยเพื่อกำหนดการเดิน การอ่าน และตำแหน่ง กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ทิศทาง**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Directions',
				ja: '方角',
				th: 'ทิศทาง'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ทิศทาง',
			prompt: 'พิจารณาแผนภาพกลไก ทิศทาง (Directions) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Directions Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ทิศทาง</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">DIRE</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: DIRE</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">DIRE</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['DIRE', 'dire'],
			answerDisplay: 'DIRE',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Directions** (*ทิศทาง*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **DIRE**'
		}
	},
	colors: {
		id: 'colors',
		hasExercise: false,
		englishTitle: 'Colors',
		thaiTitle: 'สี',
		japaneseTitle: '色',
		description: 'สีอาจกำหนดลำดับ กลุ่ม ความหมาย หรือคำย่อที่ใช้เลือกข้อมูล',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Colors** (ญี่ปุ่น: *色*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: สีอาจกำหนดลำดับ กลุ่ม ความหมาย หรือคำย่อที่ใช้เลือกข้อมูล กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **สี**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Colors',
				ja: '色',
				th: 'สี'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส สี',
			prompt: 'พิจารณาแผนภาพกลไก สี (Colors) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Colors Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">สี</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">COLO</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: COLO</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">COLO</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['COLO', 'colo'],
			answerDisplay: 'COLO',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Colors** (*สี*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **COLO**'
		}
	},
	'playing-cards': {
		id: 'playing-cards',
		hasExercise: false,
		englishTitle: 'Playing Cards',
		thaiTitle: 'ไพ่สากล',
		japaneseTitle: 'トランプ',
		description: 'ใช้ดอกไพ่ สี หน้าไพ่ และค่าตั้งแต่ Ace ถึง King เป็นระบบแทนข้อมูล',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Playing Cards** (ญี่ปุ่น: *トランプ*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: ใช้ดอกไพ่ สี หน้าไพ่ และค่าตั้งแต่ Ace ถึง King เป็นระบบแทนข้อมูล กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ไพ่สากล**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Playing Cards',
				ja: 'トランプ',
				th: 'ไพ่สากล'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ไพ่สากล',
			prompt: 'พิจารณาแผนภาพกลไก ไพ่สากล (Playing Cards) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Playing Cards Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ไพ่สากล</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">PLAY</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: PLAY</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">PLAY</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['PLAY', 'play'],
			answerDisplay: 'PLAY',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Playing Cards** (*ไพ่สากล*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **PLAY**'
		}
	},
	'musical-scale': {
		id: 'musical-scale',
		hasExercise: false,
		englishTitle: 'Musical Scale',
		thaiTitle: 'โน้ตดนตรี',
		japaneseTitle: '音階',
		description: 'ใช้ลำดับเสียง โด–เร–มี หรือ C–D–E รวมถึงตำแหน่งบนบรรทัดห้าเส้น',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Musical Scale** (ญี่ปุ่น: *音階*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: ใช้ลำดับเสียง โด–เร–มี หรือ C–D–E รวมถึงตำแหน่งบนบรรทัดห้าเส้น กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **โน้ตดนตรี**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Musical Scale',
				ja: '音階',
				th: 'โน้ตดนตรี'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส โน้ตดนตรี',
			prompt: 'พิจารณาแผนภาพกลไก โน้ตดนตรี (Musical Scale) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Musical Scale Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">โน้ตดนตรี</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">MUSI</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: MUSI</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">MUSI</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['MUSI', 'musi'],
			answerDisplay: 'MUSI',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Musical Scale** (*โน้ตดนตรี*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **MUSI**'
		}
	},
	'clocks-and-time': {
		id: 'clocks-and-time',
		hasExercise: false,
		englishTitle: 'Clocks and Time',
		thaiTitle: 'นาฬิกาและเวลา',
		japaneseTitle: '時計／時間',
		description: 'ตีความตำแหน่งเข็ม ชั่วโมง นาที หรือการหมุนรอบหน้าปัดเป็นทิศทางและตัวเลข',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Clocks and Time** (ญี่ปุ่น: *時計／時間*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: ตีความตำแหน่งเข็ม ชั่วโมง นาที หรือการหมุนรอบหน้าปัดเป็นทิศทางและตัวเลข กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **นาฬิกาและเวลา**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Clocks and Time',
				ja: '時計／時間',
				th: 'นาฬิกาและเวลา'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส นาฬิกาและเวลา',
			prompt:
				'พิจารณาแผนภาพกลไก นาฬิกาและเวลา (Clocks and Time) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Clocks and Time Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">นาฬิกาและเวลา</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">CLOC</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: CLOC</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">CLOC</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['CLOC', 'cloc'],
			answerDisplay: 'CLOC',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Clocks and Time** (*นาฬิกาและเวลา*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **CLOC**'
		}
	},
	'japanese-era-names': {
		id: 'japanese-era-names',
		hasExercise: false,
		englishTitle: 'Japanese Era Names',
		thaiTitle: 'ศักราชญี่ปุ่น',
		japaneseTitle: '元号',
		description: 'แปลงและเรียงปีตามชื่อรัชศกญี่ปุ่น เช่น เมจิ โชวะ เฮเซ และเรวะ',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Japanese Era Names** (ญี่ปุ่น: *元号*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: แปลงและเรียงปีตามชื่อรัชศกญี่ปุ่น เช่น เมจิ โชวะ เฮเซ และเรวะ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ศักราชญี่ปุ่น**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Japanese Era Names',
				ja: '元号',
				th: 'ศักราชญี่ปุ่น'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ศักราชญี่ปุ่น',
			prompt:
				'พิจารณาแผนภาพกลไก ศักราชญี่ปุ่น (Japanese Era Names) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Japanese Era Names Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ศักราชญี่ปุ่น</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">JAPA</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: JAPA</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">JAPA</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['JAPA', 'japa'],
			answerDisplay: 'JAPA',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Japanese Era Names** (*ศักราชญี่ปุ่น*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **JAPA**'
		}
	},
	'mobile-phone-keypad': {
		id: 'mobile-phone-keypad',
		hasExercise: false,
		englishTitle: 'Mobile Phone Keypad',
		thaiTitle: 'แป้นพิมพ์โทรศัพท์มือถือ',
		japaneseTitle: '携帯文字盤',
		description: 'ใช้ตำแหน่งปุ่ม ตัวเลข และการกดซ้ำบนแป้นโทรศัพท์เพื่อแทนตัวอักษร',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Mobile Phone Keypad** (ญี่ปุ่น: *携帯文字盤*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: ใช้ตำแหน่งปุ่ม ตัวเลข และการกดซ้ำบนแป้นโทรศัพท์เพื่อแทนตัวอักษร กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **แป้นพิมพ์โทรศัพท์มือถือ**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Mobile Phone Keypad',
				ja: '携帯文字盤',
				th: 'แป้นพิมพ์โทรศัพท์มือถือ'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส แป้นพิมพ์โทรศัพท์มือถือ',
			prompt:
				'พิจารณาแผนภาพกลไก แป้นพิมพ์โทรศัพท์มือถือ (Mobile Phone Keypad) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Mobile Phone Keypad Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">แป้นพิมพ์โทรศัพท์มือถือ</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">MOBI</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: MOBI</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">MOBI</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['MOBI', 'mobi'],
			answerDisplay: 'MOBI',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Mobile Phone Keypad** (*แป้นพิมพ์โทรศัพท์มือถือ*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **MOBI**'
		}
	},
	'seasons-and-months': {
		id: 'seasons-and-months',
		hasExercise: false,
		englishTitle: 'Seasons and Months',
		thaiTitle: 'ฤดูกาลและเดือน',
		japaneseTitle: '四季／月',
		description: 'ใช้ลำดับเดือน กลุ่มฤดูกาล จำนวนวัน หรือเหตุการณ์ประจำช่วงเวลาเป็นเบาะแส',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Seasons and Months** (ญี่ปุ่น: *四季／月*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: ใช้ลำดับเดือน กลุ่มฤดูกาล จำนวนวัน หรือเหตุการณ์ประจำช่วงเวลาเป็นเบาะแส กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ฤดูกาลและเดือน**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Seasons and Months',
				ja: '四季／月',
				th: 'ฤดูกาลและเดือน'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ฤดูกาลและเดือน',
			prompt:
				'พิจารณาแผนภาพกลไก ฤดูกาลและเดือน (Seasons and Months) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Seasons and Months Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ฤดูกาลและเดือน</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">SEAS</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: SEAS</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">SEAS</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['SEAS', 'seas'],
			answerDisplay: 'SEAS',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Seasons and Months** (*ฤดูกาลและเดือน*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **SEAS**'
		}
	},
	fingers: {
		id: 'fingers',
		hasExercise: false,
		englishTitle: 'Fingers',
		thaiTitle: 'นิ้วมือ',
		japaneseTitle: '指',
		description: 'ใช้ชื่อ ลำดับ หรือตำแหน่งของนิ้วทั้งห้าในการนับหรือชี้ข้อมูล',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Fingers** (ญี่ปุ่น: *指*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: ใช้ชื่อ ลำดับ หรือตำแหน่งของนิ้วทั้งห้าในการนับหรือชี้ข้อมูล กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **นิ้วมือ**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Fingers',
				ja: '指',
				th: 'นิ้วมือ'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส นิ้วมือ',
			prompt: 'พิจารณาแผนภาพกลไก นิ้วมือ (Fingers) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Fingers Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">นิ้วมือ</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">FING</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: FING</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">FING</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['FING', 'fing'],
			answerDisplay: 'FING',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Fingers** (*นิ้วมือ*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **FING**'
		}
	},
	podium: {
		id: 'podium',
		hasExercise: false,
		englishTitle: 'Podium',
		thaiTitle: 'แท่นรางวัล',
		japaneseTitle: '表彰台',
		description: 'ใช้ลำดับที่หนึ่ง สอง สาม และระดับความสูงของแท่นเพื่อจัดตำแหน่งคำตอบ',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Podium** (ญี่ปุ่น: *表彰台*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: ใช้ลำดับที่หนึ่ง สอง สาม และระดับความสูงของแท่นเพื่อจัดตำแหน่งคำตอบ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **แท่นรางวัล**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Podium',
				ja: '表彰台',
				th: 'แท่นรางวัล'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส แท่นรางวัล',
			prompt: 'พิจารณาแผนภาพกลไก แท่นรางวัล (Podium) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Podium Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">แท่นรางวัล</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">PODI</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: PODI</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">PODI</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['PODI', 'podi'],
			answerDisplay: 'PODI',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Podium** (*แท่นรางวัล*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **PODI**'
		}
	},
	'stroke-count': {
		id: 'stroke-count',
		hasExercise: false,
		englishTitle: 'Stroke Count',
		thaiTitle: 'จำนวนขีดของตัวอักษร',
		japaneseTitle: '画数',
		description: 'นับจำนวนเส้นที่ใช้เขียนคันจิหรืออักขระ แล้วใช้ผลลัพธ์เป็นตัวเลขกำกับ',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Stroke Count** (ญี่ปุ่น: *画数*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: นับจำนวนเส้นที่ใช้เขียนคันจิหรืออักขระ แล้วใช้ผลลัพธ์เป็นตัวเลขกำกับ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **จำนวนขีดของตัวอักษร**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Stroke Count',
				ja: '画数',
				th: 'จำนวนขีดของตัวอักษร'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส จำนวนขีดของตัวอักษร',
			prompt:
				'พิจารณาแผนภาพกลไก จำนวนขีดของตัวอักษร (Stroke Count) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Stroke Count Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">จำนวนขีดของตัวอักษร</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">STRO</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: STRO</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">STRO</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['STRO', 'stro'],
			answerDisplay: 'STRO',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Stroke Count** (*จำนวนขีดของตัวอักษร*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **STRO**'
		}
	},
	'four-character-idioms': {
		id: 'four-character-idioms',
		hasExercise: false,
		englishTitle: 'Four-Character Idioms',
		thaiTitle: 'สำนวนคันจิสี่ตัว',
		japaneseTitle: '四字熟語',
		description: 'เติมหรือจัดคันจิสี่ตัวให้เป็นสำนวนญี่ปุ่นที่สมบูรณ์และมีความหมาย',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Four-Character Idioms** (ญี่ปุ่น: *四字熟語*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: เติมหรือจัดคันจิสี่ตัวให้เป็นสำนวนญี่ปุ่นที่สมบูรณ์และมีความหมาย กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **สำนวนคันจิสี่ตัว**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Four-Character Idioms',
				ja: '四字熟語',
				th: 'สำนวนคันจิสี่ตัว'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส สำนวนคันจิสี่ตัว',
			prompt:
				'พิจารณาแผนภาพกลไก สำนวนคันจิสี่ตัว (Four-Character Idioms) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Four-Character Idioms Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">สำนวนคันจิสี่ตัว</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">FOUR</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: FOUR</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">FOUR</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['FOUR', 'four'],
			answerDisplay: 'FOUR',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Four-Character Idioms** (*สำนวนคันจิสี่ตัว*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **FOUR**'
		}
	},
	'number-readings': {
		id: 'number-readings',
		hasExercise: false,
		englishTitle: 'Number Readings',
		thaiTitle: 'เสียงอ่านของตัวเลข',
		japaneseTitle: '数字の読み方',
		description: 'ใช้เสียงอ่านหลายแบบของตัวเลข เช่น ญี่ปุ่น จีน หรือการเล่นเสียงเพื่อสร้างคำ',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Number Readings** (ญี่ปุ่น: *数字の読み方*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: ใช้เสียงอ่านหลายแบบของตัวเลข เช่น ญี่ปุ่น จีน หรือการเล่นเสียงเพื่อสร้างคำ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **เสียงอ่านของตัวเลข**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Number Readings',
				ja: '数字の読み方',
				th: 'เสียงอ่านของตัวเลข'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส เสียงอ่านของตัวเลข',
			prompt:
				'พิจารณาแผนภาพกลไก เสียงอ่านของตัวเลข (Number Readings) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Number Readings Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">เสียงอ่านของตัวเลข</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">NUMB</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: NUMB</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">NUMB</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['NUMB', 'numb'],
			answerDisplay: 'NUMB',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Number Readings** (*เสียงอ่านของตัวเลข*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **NUMB**'
		}
	},
	counters: {
		id: 'counters',
		hasExercise: false,
		englishTitle: 'Counters',
		thaiTitle: 'ลักษณนามและวิธีนับ',
		japaneseTitle: '数え方',
		description: 'เลือกคำลักษณนามหรือรูปเสียงที่เปลี่ยนไปตามชนิดและจำนวนของสิ่งของ',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Counters** (ญี่ปุ่น: *数え方*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: เลือกคำลักษณนามหรือรูปเสียงที่เปลี่ยนไปตามชนิดและจำนวนของสิ่งของ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ลักษณนามและวิธีนับ**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Counters',
				ja: '数え方',
				th: 'ลักษณนามและวิธีนับ'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ลักษณนามและวิธีนับ',
			prompt: 'พิจารณาแผนภาพกลไก ลักษณนามและวิธีนับ (Counters) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Counters Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ลักษณนามและวิธีนับ</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">COUN</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: COUN</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">COUN</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['COUN', 'coun'],
			answerDisplay: 'COUN',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Counters** (*ลักษณนามและวิธีนับ*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **COUN**'
		}
	},
	'digital-digits': {
		id: 'digital-digits',
		hasExercise: false,
		englishTitle: 'Digital Digits',
		thaiTitle: 'ตัวเลขดิจิทัล',
		japaneseTitle: 'デジタル数字',
		description: 'ใช้รูปแบบจอเจ็ดส่วน โดยเพิ่ม ลบ ย้าย หรือหมุนขีดเพื่อเปลี่ยนตัวเลข',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Digital Digits** (ญี่ปุ่น: *デジタル数字*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: ใช้รูปแบบจอเจ็ดส่วน โดยเพิ่ม ลบ ย้าย หรือหมุนขีดเพื่อเปลี่ยนตัวเลข กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ตัวเลขดิจิทัล**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Digital Digits',
				ja: 'デジタル数字',
				th: 'ตัวเลขดิจิทัล'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ตัวเลขดิจิทัล',
			prompt:
				'พิจารณาแผนภาพกลไก ตัวเลขดิจิทัล (Digital Digits) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Digital Digits Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตัวเลขดิจิทัล</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">DIGI</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: DIGI</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">DIGI</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['DIGI', 'digi'],
			answerDisplay: 'DIGI',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Digital Digits** (*ตัวเลขดิจิทัล*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **DIGI**'
		}
	},
	'physical-laws': {
		id: 'physical-laws',
		hasExercise: false,
		englishTitle: 'Physical Laws',
		thaiTitle: 'กฎทางฟิสิกส์',
		japaneseTitle: '物理法則',
		description: 'ประยุกต์แรงโน้มถ่วง การสะท้อน สมดุล แม่เหล็ก หรือหลักธรรมชาติอื่นกับภาพโจทย์',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Physical Laws** (ญี่ปุ่น: *物理法則*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: ประยุกต์แรงโน้มถ่วง การสะท้อน สมดุล แม่เหล็ก หรือหลักธรรมชาติอื่นกับภาพโจทย์ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **กฎทางฟิสิกส์**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Physical Laws',
				ja: '物理法則',
				th: 'กฎทางฟิสิกส์'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส กฎทางฟิสิกส์',
			prompt: 'พิจารณาแผนภาพกลไก กฎทางฟิสิกส์ (Physical Laws) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Physical Laws Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">กฎทางฟิสิกส์</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">PHYS</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: PHYS</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">PHYS</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['PHYS', 'phys'],
			answerDisplay: 'PHYS',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Physical Laws** (*กฎทางฟิสิกส์*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **PHYS**'
		}
	},
	'number-sequences': {
		id: 'number-sequences',
		hasExercise: false,
		englishTitle: 'Number Sequences',
		thaiTitle: 'ลำดับตัวเลข',
		japaneseTitle: '数列',
		description: 'หาความสัมพันธ์ระหว่างพจน์เพื่อเติมค่าที่หายหรือใช้ลำดับเป็นดัชนี',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Number Sequences** (ญี่ปุ่น: *数列*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: หาความสัมพันธ์ระหว่างพจน์เพื่อเติมค่าที่หายหรือใช้ลำดับเป็นดัชนี กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ลำดับตัวเลข**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Number Sequences',
				ja: '数列',
				th: 'ลำดับตัวเลข'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ลำดับตัวเลข',
			prompt:
				'พิจารณาแผนภาพกลไก ลำดับตัวเลข (Number Sequences) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Number Sequences Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ลำดับตัวเลข</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">NUMB</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: NUMB</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">NUMB</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['NUMB', 'numb'],
			answerDisplay: 'NUMB',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Number Sequences** (*ลำดับตัวเลข*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **NUMB**'
		}
	},
	'numbers-to-letters': {
		id: 'numbers-to-letters',
		hasExercise: false,
		englishTitle: 'Convert Numbers to Letters',
		thaiTitle: 'แปลงตัวเลขเป็นตัวอักษร',
		japaneseTitle: '数字を文字に変換',
		description: 'จับคู่ตัวเลขกับลำดับตัวอักษร เสียงอ่าน รหัส หรือระบบอ้างอิงที่โจทย์กำหนด',
		chapter: {
			id: 'themes',
			hasExercise: false,
			englishTitle: 'Reference Themes',
			thaiTitle: 'ชุดความรู้และหัวข้ออ้างอิง',
			japaneseTitle: '題材系',
			accent: 'badge-accent'
		},
		detailedDescription:
			'กลไก **Convert Numbers to Letters** (ญี่ปุ่น: *数字を文字に変換*) เป็นเทคนิคสำคัญในหมวดหมู่ **ชุดความรู้และหัวข้ออ้างอิง** (*Reference Themes*) มีสาระสำคัญคือ: จับคู่ตัวเลขกับลำดับตัวอักษร เสียงอ่าน รหัส หรือระบบอ้างอิงที่โจทย์กำหนด กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **แปลงตัวเลขเป็นตัวอักษร**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Convert Numbers to Letters',
				ja: '数字を文字に変換',
				th: 'แปลงตัวเลขเป็นตัวอักษร'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส แปลงตัวเลขเป็นตัวอักษร',
			prompt:
				'พิจารณาแผนภาพกลไก แปลงตัวเลขเป็นตัวอักษร (Convert Numbers to Letters) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Convert Numbers to Letters Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">แปลงตัวเลขเป็นตัวอักษร</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">CONV</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: CONV</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">CONV</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['CONV', 'conv'],
			answerDisplay: 'CONV',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Convert Numbers to Letters** (*แปลงตัวเลขเป็นตัวอักษร*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **CONV**'
		}
	},
	'connect-the-dots': {
		id: 'connect-the-dots',
		hasExercise: false,
		englishTitle: 'Connect the Dots',
		thaiTitle: 'ลากเส้นเชื่อมจุด',
		japaneseTitle: '点つなぎ',
		description: 'เชื่อมจุดตามลำดับหรือกฎที่กำหนดเพื่อให้เกิดภาพ ตัวอักษร หรือเส้นทาง',
		chapter: {
			id: 'visuals',
			hasExercise: false,
			englishTitle: 'Shapes and Illustrations',
			thaiTitle: 'รูปทรงและภาพประกอบ',
			japaneseTitle: '図形／イラスト',
			accent: 'badge-info'
		},
		detailedDescription:
			'กลไก **Connect the Dots** (ญี่ปุ่น: *点つなぎ*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปทรงและภาพประกอบ** (*Shapes and Illustrations*) มีสาระสำคัญคือ: เชื่อมจุดตามลำดับหรือกฎที่กำหนดเพื่อให้เกิดภาพ ตัวอักษร หรือเส้นทาง กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ลากเส้นเชื่อมจุด**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Connect the Dots',
				ja: '点つなぎ',
				th: 'ลากเส้นเชื่อมจุด'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ลากเส้นเชื่อมจุด',
			prompt:
				'พิจารณาแผนภาพกลไก ลากเส้นเชื่อมจุด (Connect the Dots) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Connect the Dots Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ลากเส้นเชื่อมจุด</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">CONN</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: CONN</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">CONN</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['CONN', 'conn'],
			answerDisplay: 'CONN',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Connect the Dots** (*ลากเส้นเชื่อมจุด*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **CONN**'
		}
	},
	'shade-the-shapes': {
		id: 'shade-the-shapes',
		hasExercise: false,
		englishTitle: 'Shade the Shapes',
		thaiTitle: 'ระบายรูปทรง',
		japaneseTitle: '図形を塗る',
		description: 'ระบายพื้นที่ที่ผ่านเงื่อนไข แล้วอ่านข้อความหรือภาพที่เกิดจากส่วนทึบและส่วนว่าง',
		chapter: {
			id: 'visuals',
			hasExercise: false,
			englishTitle: 'Shapes and Illustrations',
			thaiTitle: 'รูปทรงและภาพประกอบ',
			japaneseTitle: '図形／イラスト',
			accent: 'badge-info'
		},
		detailedDescription:
			'กลไก **Shade the Shapes** (ญี่ปุ่น: *図形を塗る*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปทรงและภาพประกอบ** (*Shapes and Illustrations*) มีสาระสำคัญคือ: ระบายพื้นที่ที่ผ่านเงื่อนไข แล้วอ่านข้อความหรือภาพที่เกิดจากส่วนทึบและส่วนว่าง กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ระบายรูปทรง**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Shade the Shapes',
				ja: '図形を塗る',
				th: 'ระบายรูปทรง'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ระบายรูปทรง',
			prompt:
				'พิจารณาแผนภาพกลไก ระบายรูปทรง (Shade the Shapes) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Shade the Shapes Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ระบายรูปทรง</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">SHAD</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: SHAD</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">SHAD</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['SHAD', 'shad'],
			answerDisplay: 'SHAD',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Shade the Shapes** (*ระบายรูปทรง*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **SHAD**'
		}
	},
	'lines-and-cells': {
		id: 'lines-and-cells',
		hasExercise: false,
		englishTitle: 'Lines and Cells',
		thaiTitle: 'เส้นและช่องตาราง',
		japaneseTitle: '線／マス',
		description: 'สังเกตความสัมพันธ์ระหว่างเส้นกรอบ ช่องตาราง และสิ่งที่วางอยู่ภายในหรือบนเส้น',
		chapter: {
			id: 'visuals',
			hasExercise: false,
			englishTitle: 'Shapes and Illustrations',
			thaiTitle: 'รูปทรงและภาพประกอบ',
			japaneseTitle: '図形／イラスト',
			accent: 'badge-info'
		},
		detailedDescription:
			'กลไก **Lines and Cells** (ญี่ปุ่น: *線／マス*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปทรงและภาพประกอบ** (*Shapes and Illustrations*) มีสาระสำคัญคือ: สังเกตความสัมพันธ์ระหว่างเส้นกรอบ ช่องตาราง และสิ่งที่วางอยู่ภายในหรือบนเส้น กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **เส้นและช่องตาราง**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Lines and Cells',
				ja: '線／マス',
				th: 'เส้นและช่องตาราง'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส เส้นและช่องตาราง',
			prompt:
				'พิจารณาแผนภาพกลไก เส้นและช่องตาราง (Lines and Cells) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Lines and Cells Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">เส้นและช่องตาราง</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">LINE</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: LINE</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">LINE</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['LINE', 'line'],
			answerDisplay: 'LINE',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Lines and Cells** (*เส้นและช่องตาราง*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **LINE**'
		}
	},
	'frame-shapes': {
		id: 'frame-shapes',
		hasExercise: false,
		englishTitle: 'Frame Shapes',
		thaiTitle: 'รูปร่างของกรอบ',
		japaneseTitle: '枠の形',
		description: 'ใช้รูปทรงของกรอบล้อมรอบเป็นรหัสบอกกลุ่ม ตัวอักษร หรือวิธีอ่าน',
		chapter: {
			id: 'visuals',
			hasExercise: false,
			englishTitle: 'Shapes and Illustrations',
			thaiTitle: 'รูปทรงและภาพประกอบ',
			japaneseTitle: '図形／イラスト',
			accent: 'badge-info'
		},
		detailedDescription:
			'กลไก **Frame Shapes** (ญี่ปุ่น: *枠の形*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปทรงและภาพประกอบ** (*Shapes and Illustrations*) มีสาระสำคัญคือ: ใช้รูปทรงของกรอบล้อมรอบเป็นรหัสบอกกลุ่ม ตัวอักษร หรือวิธีอ่าน กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **รูปร่างของกรอบ**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Frame Shapes',
				ja: '枠の形',
				th: 'รูปร่างของกรอบ'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส รูปร่างของกรอบ',
			prompt: 'พิจารณาแผนภาพกลไก รูปร่างของกรอบ (Frame Shapes) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Frame Shapes Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">รูปร่างของกรอบ</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">FRAM</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: FRAM</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">FRAM</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['FRAM', 'fram'],
			answerDisplay: 'FRAM',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Frame Shapes** (*รูปร่างของกรอบ*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **FRAM**'
		}
	},
	'boundaries-and-gaps': {
		id: 'boundaries-and-gaps',
		hasExercise: false,
		englishTitle: 'Boundaries and Gaps',
		thaiTitle: 'รอยต่อและช่องว่าง',
		japaneseTitle: '境目や隙間',
		description: 'มองพื้นที่ระหว่างรูป รอยต่อ หรือช่องว่างเชิงลบที่อาจประกอบเป็นภาพอีกชั้นหนึ่ง',
		chapter: {
			id: 'visuals',
			hasExercise: false,
			englishTitle: 'Shapes and Illustrations',
			thaiTitle: 'รูปทรงและภาพประกอบ',
			japaneseTitle: '図形／イラスト',
			accent: 'badge-info'
		},
		detailedDescription:
			'กลไก **Boundaries and Gaps** (ญี่ปุ่น: *境目や隙間*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปทรงและภาพประกอบ** (*Shapes and Illustrations*) มีสาระสำคัญคือ: มองพื้นที่ระหว่างรูป รอยต่อ หรือช่องว่างเชิงลบที่อาจประกอบเป็นภาพอีกชั้นหนึ่ง กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **รอยต่อและช่องว่าง**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Boundaries and Gaps',
				ja: '境目や隙間',
				th: 'รอยต่อและช่องว่าง'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส รอยต่อและช่องว่าง',
			prompt:
				'พิจารณาแผนภาพกลไก รอยต่อและช่องว่าง (Boundaries and Gaps) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Boundaries and Gaps Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">รอยต่อและช่องว่าง</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">BOUN</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: BOUN</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">BOUN</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['BOUN', 'boun'],
			answerDisplay: 'BOUN',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Boundaries and Gaps** (*รอยต่อและช่องว่าง*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **BOUN**'
		}
	},
	cubes: {
		id: 'cubes',
		hasExercise: false,
		englishTitle: 'Cubes',
		thaiTitle: 'ลูกบาศก์',
		japaneseTitle: '立方体',
		description: 'พับ คลี่ หมุน หรือจับคู่หน้าของลูกบาศก์เพื่อวิเคราะห์ตำแหน่งที่มองไม่เห็น',
		chapter: {
			id: 'visuals',
			hasExercise: false,
			englishTitle: 'Shapes and Illustrations',
			thaiTitle: 'รูปทรงและภาพประกอบ',
			japaneseTitle: '図形／イラスト',
			accent: 'badge-info'
		},
		detailedDescription:
			'กลไก **Cubes** (ญี่ปุ่น: *立方体*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปทรงและภาพประกอบ** (*Shapes and Illustrations*) มีสาระสำคัญคือ: พับ คลี่ หมุน หรือจับคู่หน้าของลูกบาศก์เพื่อวิเคราะห์ตำแหน่งที่มองไม่เห็น กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ลูกบาศก์**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Cubes',
				ja: '立方体',
				th: 'ลูกบาศก์'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ลูกบาศก์',
			prompt: 'พิจารณาแผนภาพกลไก ลูกบาศก์ (Cubes) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Cubes Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ลูกบาศก์</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">CUBE</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: CUBE</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">CUBE</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['CUBE', 'cube'],
			answerDisplay: 'CUBE',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Cubes** (*ลูกบาศก์*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **CUBE**'
		}
	},
	'complete-the-missing-part': {
		id: 'complete-the-missing-part',
		hasExercise: false,
		englishTitle: 'Complete the Missing Part',
		thaiTitle: 'เติมส่วนของภาพที่ขาด',
		japaneseTitle: '足りない部分を補完',
		description: 'อนุมานส่วนที่หายจากความสมมาตร รูปแบบซ้ำ หรือเส้นที่ควรต่อเนื่อง',
		chapter: {
			id: 'visuals',
			hasExercise: false,
			englishTitle: 'Shapes and Illustrations',
			thaiTitle: 'รูปทรงและภาพประกอบ',
			japaneseTitle: '図形／イラスト',
			accent: 'badge-info'
		},
		detailedDescription:
			'กลไก **Complete the Missing Part** (ญี่ปุ่น: *足りない部分を補完*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปทรงและภาพประกอบ** (*Shapes and Illustrations*) มีสาระสำคัญคือ: อนุมานส่วนที่หายจากความสมมาตร รูปแบบซ้ำ หรือเส้นที่ควรต่อเนื่อง กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **เติมส่วนของภาพที่ขาด**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Complete the Missing Part',
				ja: '足りない部分を補完',
				th: 'เติมส่วนของภาพที่ขาด'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส เติมส่วนของภาพที่ขาด',
			prompt:
				'พิจารณาแผนภาพกลไก เติมส่วนของภาพที่ขาด (Complete the Missing Part) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Complete the Missing Part Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">เติมส่วนของภาพที่ขาด</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">COMP</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: COMP</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">COMP</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['COMP', 'comp'],
			answerDisplay: 'COMP',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Complete the Missing Part** (*เติมส่วนของภาพที่ขาด*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **COMP**'
		}
	},
	'same-appearance': {
		id: 'same-appearance',
		hasExercise: false,
		englishTitle: 'Same Appearance',
		thaiTitle: 'สิ่งที่มีรูปลักษณ์เหมือนกัน',
		japaneseTitle: '同じ見た目',
		description: 'จับคู่รูปที่ดูเหมือนกันแม้ชื่อ ความหมาย การหมุน หรือบริบทจะแตกต่างกัน',
		chapter: {
			id: 'visuals',
			hasExercise: false,
			englishTitle: 'Shapes and Illustrations',
			thaiTitle: 'รูปทรงและภาพประกอบ',
			japaneseTitle: '図形／イラスト',
			accent: 'badge-info'
		},
		detailedDescription:
			'กลไก **Same Appearance** (ญี่ปุ่น: *同じ見た目*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปทรงและภาพประกอบ** (*Shapes and Illustrations*) มีสาระสำคัญคือ: จับคู่รูปที่ดูเหมือนกันแม้ชื่อ ความหมาย การหมุน หรือบริบทจะแตกต่างกัน กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **สิ่งที่มีรูปลักษณ์เหมือนกัน**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Same Appearance',
				ja: '同じ見た目',
				th: 'สิ่งที่มีรูปลักษณ์เหมือนกัน'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส สิ่งที่มีรูปลักษณ์เหมือนกัน',
			prompt:
				'พิจารณาแผนภาพกลไก สิ่งที่มีรูปลักษณ์เหมือนกัน (Same Appearance) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Same Appearance Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">สิ่งที่มีรูปลักษณ์เหมือนกัน</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">SAME</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: SAME</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">SAME</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['SAME', 'same'],
			answerDisplay: 'SAME',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Same Appearance** (*สิ่งที่มีรูปลักษณ์เหมือนกัน*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **SAME**'
		}
	},
	'white-is-invisible': {
		id: 'white-is-invisible',
		hasExercise: false,
		englishTitle: 'White Is Invisible',
		thaiTitle: 'มองไม่เห็นส่วนสีขาว',
		japaneseTitle: '白が見えない',
		description: 'สมมติว่าส่วนสีขาวโปร่งใสหรือหายไป แล้วพิจารณารูปที่เหลือหรือภาพเมื่อซ้อนกัน',
		chapter: {
			id: 'visuals',
			hasExercise: false,
			englishTitle: 'Shapes and Illustrations',
			thaiTitle: 'รูปทรงและภาพประกอบ',
			japaneseTitle: '図形／イラスト',
			accent: 'badge-info'
		},
		detailedDescription:
			'กลไก **White Is Invisible** (ญี่ปุ่น: *白が見えない*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปทรงและภาพประกอบ** (*Shapes and Illustrations*) มีสาระสำคัญคือ: สมมติว่าส่วนสีขาวโปร่งใสหรือหายไป แล้วพิจารณารูปที่เหลือหรือภาพเมื่อซ้อนกัน กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **มองไม่เห็นส่วนสีขาว**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'White Is Invisible',
				ja: '白が見えない',
				th: 'มองไม่เห็นส่วนสีขาว'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส มองไม่เห็นส่วนสีขาว',
			prompt:
				'พิจารณาแผนภาพกลไก มองไม่เห็นส่วนสีขาว (White Is Invisible) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">White Is Invisible Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">มองไม่เห็นส่วนสีขาว</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">WHIT</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: WHIT</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">WHIT</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['WHIT', 'whit'],
			answerDisplay: 'WHIT',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **White Is Invisible** (*มองไม่เห็นส่วนสีขาว*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **WHIT**'
		}
	},
	'multiple-names-for-a-picture': {
		id: 'multiple-names-for-a-picture',
		hasExercise: false,
		englishTitle: 'Multiple Names for a Picture',
		thaiTitle: 'เรียกภาพเดียวด้วยหลายคำ',
		japaneseTitle: 'イラストを複数の言葉に',
		description: 'ลองชื่อ คำพ้อง หมวดหมู่ หรือมุมมองหลายแบบของภาพเดียวจนเข้ากับกลไก',
		chapter: {
			id: 'visuals',
			hasExercise: false,
			englishTitle: 'Shapes and Illustrations',
			thaiTitle: 'รูปทรงและภาพประกอบ',
			japaneseTitle: '図形／イラスト',
			accent: 'badge-info'
		},
		detailedDescription:
			'กลไก **Multiple Names for a Picture** (ญี่ปุ่น: *イラストを複数の言葉に*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปทรงและภาพประกอบ** (*Shapes and Illustrations*) มีสาระสำคัญคือ: ลองชื่อ คำพ้อง หมวดหมู่ หรือมุมมองหลายแบบของภาพเดียวจนเข้ากับกลไก กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **เรียกภาพเดียวด้วยหลายคำ**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Multiple Names for a Picture',
				ja: 'イラストを複数の言葉に',
				th: 'เรียกภาพเดียวด้วยหลายคำ'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส เรียกภาพเดียวด้วยหลายคำ',
			prompt:
				'พิจารณาแผนภาพกลไก เรียกภาพเดียวด้วยหลายคำ (Multiple Names for a Picture) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Multiple Names for a Picture Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">เรียกภาพเดียวด้วยหลายคำ</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">MULT</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: MULT</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">MULT</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['MULT', 'mult'],
			answerDisplay: 'MULT',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Multiple Names for a Picture** (*เรียกภาพเดียวด้วยหลายคำ*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **MULT**'
		}
	},
	'letter-shaped-figures': {
		id: 'letter-shaped-figures',
		hasExercise: false,
		englishTitle: 'Letter-Shaped Figures',
		thaiTitle: 'จัดตัวอักษรให้เป็นรูป',
		japaneseTitle: '文字アレンジ図形',
		description: 'มองตัวอักษรที่ถูกยืด บิด ซ้อน หรือจัดวางจนกลายเป็นภาพและถอดกลับเป็นคำ',
		chapter: {
			id: 'visuals',
			hasExercise: false,
			englishTitle: 'Shapes and Illustrations',
			thaiTitle: 'รูปทรงและภาพประกอบ',
			japaneseTitle: '図形／イラスト',
			accent: 'badge-info'
		},
		detailedDescription:
			'กลไก **Letter-Shaped Figures** (ญี่ปุ่น: *文字アレンジ図形*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปทรงและภาพประกอบ** (*Shapes and Illustrations*) มีสาระสำคัญคือ: มองตัวอักษรที่ถูกยืด บิด ซ้อน หรือจัดวางจนกลายเป็นภาพและถอดกลับเป็นคำ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **จัดตัวอักษรให้เป็นรูป**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Letter-Shaped Figures',
				ja: '文字アレンジ図形',
				th: 'จัดตัวอักษรให้เป็นรูป'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส จัดตัวอักษรให้เป็นรูป',
			prompt:
				'พิจารณาแผนภาพกลไก จัดตัวอักษรให้เป็นรูป (Letter-Shaped Figures) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Letter-Shaped Figures Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">จัดตัวอักษรให้เป็นรูป</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">LETT</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: LETT</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">LETT</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['LETT', 'lett'],
			answerDisplay: 'LETT',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Letter-Shaped Figures** (*จัดตัวอักษรให้เป็นรูป*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **LETT**'
		}
	},
	'letter-count-equals-object-count': {
		id: 'letter-count-equals-object-count',
		hasExercise: false,
		englishTitle: 'Letter Count Equals Object Count',
		thaiTitle: 'จำนวนตัวอักษรเท่ากับจำนวนสิ่งของ',
		japaneseTitle: '文字数＝個数',
		description: 'ใช้จำนวนวัตถุเป็นตัวบอกความยาวคำ หรือใช้ความยาวคำเลือกจำนวนองค์ประกอบ',
		chapter: {
			id: 'visuals',
			hasExercise: false,
			englishTitle: 'Shapes and Illustrations',
			thaiTitle: 'รูปทรงและภาพประกอบ',
			japaneseTitle: '図形／イラスト',
			accent: 'badge-info'
		},
		detailedDescription:
			'กลไก **Letter Count Equals Object Count** (ญี่ปุ่น: *文字数＝個数*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปทรงและภาพประกอบ** (*Shapes and Illustrations*) มีสาระสำคัญคือ: ใช้จำนวนวัตถุเป็นตัวบอกความยาวคำ หรือใช้ความยาวคำเลือกจำนวนองค์ประกอบ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **จำนวนตัวอักษรเท่ากับจำนวนสิ่งของ**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Letter Count Equals Object Count',
				ja: '文字数＝個数',
				th: 'จำนวนตัวอักษรเท่ากับจำนวนสิ่งของ'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส จำนวนตัวอักษรเท่ากับจำนวนสิ่งของ',
			prompt:
				'พิจารณาแผนภาพกลไก จำนวนตัวอักษรเท่ากับจำนวนสิ่งของ (Letter Count Equals Object Count) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Letter Count Equals Object Count Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">จำนวนตัวอักษรเท่ากับจำนวนสิ่งของ</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">LETT</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: LETT</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">LETT</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['LETT', 'lett'],
			answerDisplay: 'LETT',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Letter Count Equals Object Count** (*จำนวนตัวอักษรเท่ากับจำนวนสิ่งของ*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **LETT**'
		}
	},
	'change-viewing-direction': {
		id: 'change-viewing-direction',
		hasExercise: false,
		englishTitle: 'Change the Viewing Direction',
		thaiTitle: 'เปลี่ยนทิศทางการมอง',
		japaneseTitle: '方向を変えて見る',
		description: 'มองจากด้านข้าง ด้านหลัง กลับหัว หรือผ่านมุมใหม่เพื่อเห็นข้อมูลอีกแบบ',
		chapter: {
			id: 'visuals',
			hasExercise: false,
			englishTitle: 'Shapes and Illustrations',
			thaiTitle: 'รูปทรงและภาพประกอบ',
			japaneseTitle: '図形／イラスト',
			accent: 'badge-info'
		},
		detailedDescription:
			'กลไก **Change the Viewing Direction** (ญี่ปุ่น: *方向を変えて見る*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปทรงและภาพประกอบ** (*Shapes and Illustrations*) มีสาระสำคัญคือ: มองจากด้านข้าง ด้านหลัง กลับหัว หรือผ่านมุมใหม่เพื่อเห็นข้อมูลอีกแบบ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **เปลี่ยนทิศทางการมอง**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Change the Viewing Direction',
				ja: '方向を変えて見る',
				th: 'เปลี่ยนทิศทางการมอง'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส เปลี่ยนทิศทางการมอง',
			prompt:
				'พิจารณาแผนภาพกลไก เปลี่ยนทิศทางการมอง (Change the Viewing Direction) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Change the Viewing Direction Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">เปลี่ยนทิศทางการมอง</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">CHAN</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: CHAN</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">CHAN</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['CHAN', 'chan'],
			answerDisplay: 'CHAN',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Change the Viewing Direction** (*เปลี่ยนทิศทางการมอง*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **CHAN**'
		}
	},
	'alternate-representation': {
		id: 'alternate-representation',
		hasExercise: false,
		englishTitle: 'Use Another Representation',
		thaiTitle: 'เปลี่ยนเป็นรูปแบบการแทนค่าอื่น',
		japaneseTitle: '別の表現にする',
		description: 'แปลงข้อมูลเดียวกันเป็นภาพ แผนผัง ไอคอน เสียง หรือตัวเลขเพื่อให้เห็นความสัมพันธ์',
		chapter: {
			id: 'visuals',
			hasExercise: false,
			englishTitle: 'Shapes and Illustrations',
			thaiTitle: 'รูปทรงและภาพประกอบ',
			japaneseTitle: '図形／イラスト',
			accent: 'badge-info'
		},
		detailedDescription:
			'กลไก **Use Another Representation** (ญี่ปุ่น: *別の表現にする*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปทรงและภาพประกอบ** (*Shapes and Illustrations*) มีสาระสำคัญคือ: แปลงข้อมูลเดียวกันเป็นภาพ แผนผัง ไอคอน เสียง หรือตัวเลขเพื่อให้เห็นความสัมพันธ์ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **เปลี่ยนเป็นรูปแบบการแทนค่าอื่น**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Use Another Representation',
				ja: '別の表現にする',
				th: 'เปลี่ยนเป็นรูปแบบการแทนค่าอื่น'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส เปลี่ยนเป็นรูปแบบการแทนค่าอื่น',
			prompt:
				'พิจารณาแผนภาพกลไก เปลี่ยนเป็นรูปแบบการแทนค่าอื่น (Use Another Representation) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Use Another Representation Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">เปลี่ยนเป็นรูปแบบการแทนค่าอื่น</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">USEA</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: USEA</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">USEA</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['USEA', 'usea'],
			answerDisplay: 'USEA',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Use Another Representation** (*เปลี่ยนเป็นรูปแบบการแทนค่าอื่น*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **USEA**'
		}
	},
	'positional-relationships': {
		id: 'positional-relationships',
		hasExercise: false,
		englishTitle: 'Positional Relationships',
		thaiTitle: 'ความสัมพันธ์เชิงตำแหน่ง',
		japaneseTitle: '位置関係',
		description: 'ตีความการอยู่บน ล่าง ซ้าย ขวา ใน นอก หรือการซ้อนทับเป็นคำหรือคำสั่ง',
		chapter: {
			id: 'visuals',
			hasExercise: false,
			englishTitle: 'Shapes and Illustrations',
			thaiTitle: 'รูปทรงและภาพประกอบ',
			japaneseTitle: '図形／イラスト',
			accent: 'badge-info'
		},
		detailedDescription:
			'กลไก **Positional Relationships** (ญี่ปุ่น: *位置関係*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปทรงและภาพประกอบ** (*Shapes and Illustrations*) มีสาระสำคัญคือ: ตีความการอยู่บน ล่าง ซ้าย ขวา ใน นอก หรือการซ้อนทับเป็นคำหรือคำสั่ง กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ความสัมพันธ์เชิงตำแหน่ง**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Positional Relationships',
				ja: '位置関係',
				th: 'ความสัมพันธ์เชิงตำแหน่ง'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ความสัมพันธ์เชิงตำแหน่ง',
			prompt:
				'พิจารณาแผนภาพกลไก ความสัมพันธ์เชิงตำแหน่ง (Positional Relationships) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Positional Relationships Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ความสัมพันธ์เชิงตำแหน่ง</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">POSI</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: POSI</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">POSI</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['POSI', 'posi'],
			answerDisplay: 'POSI',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Positional Relationships** (*ความสัมพันธ์เชิงตำแหน่ง*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **POSI**'
		}
	},
	'special-arrows': {
		id: 'special-arrows',
		hasExercise: false,
		englishTitle: 'Special Arrows',
		thaiTitle: 'ลูกศรพิเศษ',
		japaneseTitle: '特殊矢印',
		description:
			'ลูกศรอาจสั่งให้ย้าย หมุน แทนที่ อ่านย้อน หรือเชื่อมสิ่งต่าง ๆ มากกว่าชี้ทิศทางธรรมดา',
		chapter: {
			id: 'visuals',
			hasExercise: false,
			englishTitle: 'Shapes and Illustrations',
			thaiTitle: 'รูปทรงและภาพประกอบ',
			japaneseTitle: '図形／イラスト',
			accent: 'badge-info'
		},
		detailedDescription:
			'กลไก **Special Arrows** (ญี่ปุ่น: *特殊矢印*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปทรงและภาพประกอบ** (*Shapes and Illustrations*) มีสาระสำคัญคือ: ลูกศรอาจสั่งให้ย้าย หมุน แทนที่ อ่านย้อน หรือเชื่อมสิ่งต่าง ๆ มากกว่าชี้ทิศทางธรรมดา กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ลูกศรพิเศษ**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Special Arrows',
				ja: '特殊矢印',
				th: 'ลูกศรพิเศษ'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ลูกศรพิเศษ',
			prompt: 'พิจารณาแผนภาพกลไก ลูกศรพิเศษ (Special Arrows) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Special Arrows Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ลูกศรพิเศษ</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">SPEC</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: SPEC</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">SPEC</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['SPEC', 'spec'],
			answerDisplay: 'SPEC',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Special Arrows** (*ลูกศรพิเศษ*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **SPEC**'
		}
	},
	maze: {
		id: 'maze',
		hasExercise: false,
		englishTitle: 'Maze',
		thaiTitle: 'เขาวงกต',
		japaneseTitle: '迷路',
		description: 'หาเส้นทางจากจุดเริ่มถึงเป้าหมาย โดยเส้นทางที่ผ่านอาจสะกดคำหรือเลือกข้อมูล',
		chapter: {
			id: 'puzzles',
			hasExercise: false,
			englishTitle: 'Puzzle Formats',
			thaiTitle: 'รูปแบบพัซเซิล',
			japaneseTitle: 'パズル',
			accent: 'badge-warning'
		},
		detailedDescription:
			'กลไก **Maze** (ญี่ปุ่น: *迷路*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปแบบพัซเซิล** (*Puzzle Formats*) มีสาระสำคัญคือ: หาเส้นทางจากจุดเริ่มถึงเป้าหมาย โดยเส้นทางที่ผ่านอาจสะกดคำหรือเลือกข้อมูล กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **เขาวงกต**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Maze',
				ja: '迷路',
				th: 'เขาวงกต'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส เขาวงกต',
			prompt: 'พิจารณาแผนภาพกลไก เขาวงกต (Maze) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Maze Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">เขาวงกต</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">MAZE</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: MAZE</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">MAZE</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['MAZE', 'maze'],
			answerDisplay: 'MAZE',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Maze** (*เขาวงกต*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **MAZE**'
		}
	},
	'one-stroke-drawing': {
		id: 'one-stroke-drawing',
		hasExercise: false,
		englishTitle: 'One-Stroke Drawing',
		thaiTitle: 'ลากเส้นครั้งเดียว',
		japaneseTitle: '一筆書き',
		description: 'ลากผ่านทุกเส้นหรือทุกจุดตามเงื่อนไขโดยไม่ยกปากกาและไม่ใช้เส้นซ้ำ',
		chapter: {
			id: 'puzzles',
			hasExercise: false,
			englishTitle: 'Puzzle Formats',
			thaiTitle: 'รูปแบบพัซเซิล',
			japaneseTitle: 'パズル',
			accent: 'badge-warning'
		},
		detailedDescription:
			'กลไก **One-Stroke Drawing** (ญี่ปุ่น: *一筆書き*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปแบบพัซเซิล** (*Puzzle Formats*) มีสาระสำคัญคือ: ลากผ่านทุกเส้นหรือทุกจุดตามเงื่อนไขโดยไม่ยกปากกาและไม่ใช้เส้นซ้ำ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ลากเส้นครั้งเดียว**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'One-Stroke Drawing',
				ja: '一筆書き',
				th: 'ลากเส้นครั้งเดียว'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ลากเส้นครั้งเดียว',
			prompt:
				'พิจารณาแผนภาพกลไก ลากเส้นครั้งเดียว (One-Stroke Drawing) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">One-Stroke Drawing Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ลากเส้นครั้งเดียว</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">ONES</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: ONES</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">ONES</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['ONES', 'ones'],
			answerDisplay: 'ONES',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **One-Stroke Drawing** (*ลากเส้นครั้งเดียว*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **ONES**'
		}
	},
	crossword: {
		id: 'crossword',
		hasExercise: false,
		englishTitle: 'Crossword',
		thaiTitle: 'ปริศนาอักษรไขว้',
		japaneseTitle: 'クロスワード',
		description: 'ตอบคำใบ้แล้วใส่คำในช่องแนวตั้งและแนวนอน โดยตัวอักษรที่ตัดกันต้องตรงกัน',
		chapter: {
			id: 'puzzles',
			hasExercise: false,
			englishTitle: 'Puzzle Formats',
			thaiTitle: 'รูปแบบพัซเซิล',
			japaneseTitle: 'パズル',
			accent: 'badge-warning'
		},
		detailedDescription:
			'กลไก **Crossword** (ญี่ปุ่น: *クロスワード*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปแบบพัซเซิล** (*Puzzle Formats*) มีสาระสำคัญคือ: ตอบคำใบ้แล้วใส่คำในช่องแนวตั้งและแนวนอน โดยตัวอักษรที่ตัดกันต้องตรงกัน กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ปริศนาอักษรไขว้**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Crossword',
				ja: 'クロスワード',
				th: 'ปริศนาอักษรไขว้'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ปริศนาอักษรไขว้',
			prompt: 'พิจารณาแผนภาพกลไก ปริศนาอักษรไขว้ (Crossword) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Crossword Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ปริศนาอักษรไขว้</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">CROS</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: CROS</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">CROS</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['CROS', 'cros'],
			answerDisplay: 'CROS',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Crossword** (*ปริศนาอักษรไขว้*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **CROS**'
		}
	},
	'skeleton-crossword': {
		id: 'skeleton-crossword',
		hasExercise: false,
		englishTitle: 'Skeleton Crossword',
		thaiTitle: 'ครอสเวิร์ดโครงเปล่า',
		japaneseTitle: 'スケルトン',
		description: 'นำชุดคำที่ให้มาใส่ในโครงตารางโดยอาศัยความยาวและจุดตัด แทนการตอบคำใบ้',
		chapter: {
			id: 'puzzles',
			hasExercise: false,
			englishTitle: 'Puzzle Formats',
			thaiTitle: 'รูปแบบพัซเซิล',
			japaneseTitle: 'パズル',
			accent: 'badge-warning'
		},
		detailedDescription:
			'กลไก **Skeleton Crossword** (ญี่ปุ่น: *スケルトン*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปแบบพัซเซิล** (*Puzzle Formats*) มีสาระสำคัญคือ: นำชุดคำที่ให้มาใส่ในโครงตารางโดยอาศัยความยาวและจุดตัด แทนการตอบคำใบ้ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ครอสเวิร์ดโครงเปล่า**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Skeleton Crossword',
				ja: 'スケルトン',
				th: 'ครอสเวิร์ดโครงเปล่า'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ครอสเวิร์ดโครงเปล่า',
			prompt:
				'พิจารณาแผนภาพกลไก ครอสเวิร์ดโครงเปล่า (Skeleton Crossword) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Skeleton Crossword Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ครอสเวิร์ดโครงเปล่า</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">SKEL</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: SKEL</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">SKEL</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['SKEL', 'skel'],
			answerDisplay: 'SKEL',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Skeleton Crossword** (*ครอสเวิร์ดโครงเปล่า*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **SKEL**'
		}
	},
	polyominoes: {
		id: 'polyominoes',
		hasExercise: false,
		englishTitle: 'Polyominoes',
		thaiTitle: 'โพลิโอมิโน',
		japaneseTitle: 'ポリオミノ',
		description: 'จัดชิ้นส่วนที่ประกอบจากช่องสี่เหลี่ยมให้ปิดพื้นที่หรือเป็นรูปร่างตามเงื่อนไข',
		chapter: {
			id: 'puzzles',
			hasExercise: false,
			englishTitle: 'Puzzle Formats',
			thaiTitle: 'รูปแบบพัซเซิล',
			japaneseTitle: 'パズル',
			accent: 'badge-warning'
		},
		detailedDescription:
			'กลไก **Polyominoes** (ญี่ปุ่น: *ポリオミノ*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปแบบพัซเซิล** (*Puzzle Formats*) มีสาระสำคัญคือ: จัดชิ้นส่วนที่ประกอบจากช่องสี่เหลี่ยมให้ปิดพื้นที่หรือเป็นรูปร่างตามเงื่อนไข กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **โพลิโอมิโน**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Polyominoes',
				ja: 'ポリオミノ',
				th: 'โพลิโอมิโน'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส โพลิโอมิโน',
			prompt: 'พิจารณาแผนภาพกลไก โพลิโอมิโน (Polyominoes) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Polyominoes Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">โพลิโอมิโน</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">POLY</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: POLY</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">POLY</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['POLY', 'poly'],
			answerDisplay: 'POLY',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Polyominoes** (*โพลิโอมิโน*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **POLY**'
		}
	},
	anagram: {
		id: 'anagram',
		hasExercise: false,
		englishTitle: 'Anagram',
		thaiTitle: 'สลับเรียงตัวอักษร',
		japaneseTitle: 'アナグラム',
		description: 'สลับลำดับตัวอักษรทั้งหมดของคำหรือวลีเพื่อสร้างคำตอบใหม่',
		chapter: {
			id: 'puzzles',
			hasExercise: false,
			englishTitle: 'Puzzle Formats',
			thaiTitle: 'รูปแบบพัซเซิล',
			japaneseTitle: 'パズル',
			accent: 'badge-warning'
		},
		detailedDescription:
			'กลไก **Anagram** (ญี่ปุ่น: *アナグラム*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปแบบพัซเซิล** (*Puzzle Formats*) มีสาระสำคัญคือ: สลับลำดับตัวอักษรทั้งหมดของคำหรือวลีเพื่อสร้างคำตอบใหม่ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **สลับเรียงตัวอักษร**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Anagram',
				ja: 'アナグラム',
				th: 'สลับเรียงตัวอักษร'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส สลับเรียงตัวอักษร',
			prompt: 'พิจารณาแผนภาพกลไก สลับเรียงตัวอักษร (Anagram) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Anagram Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">สลับเรียงตัวอักษร</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">ANAG</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: ANAG</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">ANAG</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['ANAG', 'anag'],
			answerDisplay: 'ANAG',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Anagram** (*สลับเรียงตัวอักษร*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **ANAG**'
		}
	},
	'wado-kaichin': {
		id: 'wado-kaichin',
		hasExercise: false,
		englishTitle: 'Wado Kaichin',
		thaiTitle: 'ปริศนาคันจิร่วมสี่ทิศ',
		japaneseTitle: '和同開珎',
		description: 'เติมคันจิตรงกลางให้ประกอบกับคันจิรอบทั้งสี่ทิศเป็นคำที่ถูกต้องทุกคู่',
		chapter: {
			id: 'puzzles',
			hasExercise: false,
			englishTitle: 'Puzzle Formats',
			thaiTitle: 'รูปแบบพัซเซิล',
			japaneseTitle: 'パズル',
			accent: 'badge-warning'
		},
		detailedDescription:
			'กลไก **Wado Kaichin** (ญี่ปุ่น: *和同開珎*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปแบบพัซเซิล** (*Puzzle Formats*) มีสาระสำคัญคือ: เติมคันจิตรงกลางให้ประกอบกับคันจิรอบทั้งสี่ทิศเป็นคำที่ถูกต้องทุกคู่ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ปริศนาคันจิร่วมสี่ทิศ**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Wado Kaichin',
				ja: '和同開珎',
				th: 'ปริศนาคันจิร่วมสี่ทิศ'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ปริศนาคันจิร่วมสี่ทิศ',
			prompt:
				'พิจารณาแผนภาพกลไก ปริศนาคันจิร่วมสี่ทิศ (Wado Kaichin) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Wado Kaichin Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ปริศนาคันจิร่วมสี่ทิศ</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">WADO</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: WADO</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">WADO</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['WADO', 'wado'],
			answerDisplay: 'WADO',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Wado Kaichin** (*ปริศนาคันจิร่วมสี่ทิศ*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **WADO**'
		}
	},
	amidakuji: {
		id: 'amidakuji',
		hasExercise: false,
		englishTitle: 'Amidakuji',
		thaiTitle: 'บันไดสุ่มญี่ปุ่น',
		japaneseTitle: 'あみだくじ',
		description: 'ไล่เส้นแนวตั้งและเลี้ยวตามคานแนวนอนเพื่อจับคู่จุดเริ่มกับปลายทาง',
		chapter: {
			id: 'puzzles',
			hasExercise: false,
			englishTitle: 'Puzzle Formats',
			thaiTitle: 'รูปแบบพัซเซิล',
			japaneseTitle: 'パズル',
			accent: 'badge-warning'
		},
		detailedDescription:
			'กลไก **Amidakuji** (ญี่ปุ่น: *あみだくじ*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปแบบพัซเซิล** (*Puzzle Formats*) มีสาระสำคัญคือ: ไล่เส้นแนวตั้งและเลี้ยวตามคานแนวนอนเพื่อจับคู่จุดเริ่มกับปลายทาง กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **บันไดสุ่มญี่ปุ่น**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Amidakuji',
				ja: 'あみだくじ',
				th: 'บันไดสุ่มญี่ปุ่น'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส บันไดสุ่มญี่ปุ่น',
			prompt: 'พิจารณาแผนภาพกลไก บันไดสุ่มญี่ปุ่น (Amidakuji) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Amidakuji Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">บันไดสุ่มญี่ปุ่น</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">AMID</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: AMID</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">AMID</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['AMID', 'amid'],
			answerDisplay: 'AMID',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Amidakuji** (*บันไดสุ่มญี่ปุ่น*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **AMID**'
		}
	},
	numberlink: {
		id: 'numberlink',
		hasExercise: false,
		englishTitle: 'Numberlink',
		thaiTitle: 'เชื่อมคู่ตัวเลข',
		japaneseTitle: 'ナンバーリンク',
		description: 'เชื่อมตัวเลขที่เหมือนกันเป็นคู่ด้วยเส้นทางที่ไม่ตัดกันตามกฎของตาราง',
		chapter: {
			id: 'puzzles',
			hasExercise: false,
			englishTitle: 'Puzzle Formats',
			thaiTitle: 'รูปแบบพัซเซิล',
			japaneseTitle: 'パズル',
			accent: 'badge-warning'
		},
		detailedDescription:
			'กลไก **Numberlink** (ญี่ปุ่น: *ナンバーリンク*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปแบบพัซเซิล** (*Puzzle Formats*) มีสาระสำคัญคือ: เชื่อมตัวเลขที่เหมือนกันเป็นคู่ด้วยเส้นทางที่ไม่ตัดกันตามกฎของตาราง กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **เชื่อมคู่ตัวเลข**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Numberlink',
				ja: 'ナンバーリンク',
				th: 'เชื่อมคู่ตัวเลข'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส เชื่อมคู่ตัวเลข',
			prompt: 'พิจารณาแผนภาพกลไก เชื่อมคู่ตัวเลข (Numberlink) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Numberlink Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">เชื่อมคู่ตัวเลข</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">NUMB</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: NUMB</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">NUMB</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['NUMB', 'numb'],
			answerDisplay: 'NUMB',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Numberlink** (*เชื่อมคู่ตัวเลข*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **NUMB**'
		}
	},
	'network-words': {
		id: 'network-words',
		hasExercise: false,
		englishTitle: 'Network Words',
		thaiTitle: 'เครือข่ายคำ',
		japaneseTitle: 'ネットワーズ',
		description: 'เชื่อมคำในแผนผังตามความสัมพันธ์หรือคำที่ใช้ร่วมกัน แล้วอ่านโครงข่ายที่ได้',
		chapter: {
			id: 'puzzles',
			hasExercise: false,
			englishTitle: 'Puzzle Formats',
			thaiTitle: 'รูปแบบพัซเซิล',
			japaneseTitle: 'パズル',
			accent: 'badge-warning'
		},
		detailedDescription:
			'กลไก **Network Words** (ญี่ปุ่น: *ネットワーズ*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปแบบพัซเซิล** (*Puzzle Formats*) มีสาระสำคัญคือ: เชื่อมคำในแผนผังตามความสัมพันธ์หรือคำที่ใช้ร่วมกัน แล้วอ่านโครงข่ายที่ได้ กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **เครือข่ายคำ**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Network Words',
				ja: 'ネットワーズ',
				th: 'เครือข่ายคำ'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส เครือข่ายคำ',
			prompt: 'พิจารณาแผนภาพกลไก เครือข่ายคำ (Network Words) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Network Words Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">เครือข่ายคำ</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">NETW</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: NETW</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">NETW</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['NETW', 'netw'],
			answerDisplay: 'NETW',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Network Words** (*เครือข่ายคำ*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **NETW**'
		}
	},
	'logic-puzzles': {
		id: 'logic-puzzles',
		hasExercise: false,
		englishTitle: 'Logic Puzzles',
		thaiTitle: 'ปริศนาตรรกะ',
		japaneseTitle: '論理パズル',
		description: 'ใช้เงื่อนไขทั้งหมดตัดความเป็นไปไม่ได้ออกอย่างเป็นระบบจนเหลือคำตอบเดียว',
		chapter: {
			id: 'puzzles',
			hasExercise: false,
			englishTitle: 'Puzzle Formats',
			thaiTitle: 'รูปแบบพัซเซิล',
			japaneseTitle: 'パズル',
			accent: 'badge-warning'
		},
		detailedDescription:
			'กลไก **Logic Puzzles** (ญี่ปุ่น: *論理パズル*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปแบบพัซเซิล** (*Puzzle Formats*) มีสาระสำคัญคือ: ใช้เงื่อนไขทั้งหมดตัดความเป็นไปไม่ได้ออกอย่างเป็นระบบจนเหลือคำตอบเดียว กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ปริศนาตรรกะ**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Logic Puzzles',
				ja: '論理パズル',
				th: 'ปริศนาตรรกะ'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ปริศนาตรรกะ',
			prompt: 'พิจารณาแผนภาพกลไก ปริศนาตรรกะ (Logic Puzzles) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Logic Puzzles Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ปริศนาตรรกะ</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">LOGI</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: LOGI</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">LOGI</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['LOGI', 'logi'],
			answerDisplay: 'LOGI',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Logic Puzzles** (*ปริศนาตรรกะ*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **LOGI**'
		}
	},
	'letter-substitution-puzzles': {
		id: 'letter-substitution-puzzles',
		hasExercise: false,
		englishTitle: 'Letter Substitution Puzzles',
		thaiTitle: 'ปริศนาแทนตัวอักษร',
		japaneseTitle: '文字置換パズル',
		description: 'แทนตัวอักษรแต่ละตัวด้วยค่าอื่นอย่างสม่ำเสมอ แล้วหาตารางแทนค่าจากข้อจำกัด',
		chapter: {
			id: 'puzzles',
			hasExercise: false,
			englishTitle: 'Puzzle Formats',
			thaiTitle: 'รูปแบบพัซเซิล',
			japaneseTitle: 'パズル',
			accent: 'badge-warning'
		},
		detailedDescription:
			'กลไก **Letter Substitution Puzzles** (ญี่ปุ่น: *文字置換パズル*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปแบบพัซเซิล** (*Puzzle Formats*) มีสาระสำคัญคือ: แทนตัวอักษรแต่ละตัวด้วยค่าอื่นอย่างสม่ำเสมอ แล้วหาตารางแทนค่าจากข้อจำกัด กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **ปริศนาแทนตัวอักษร**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Letter Substitution Puzzles',
				ja: '文字置換パズル',
				th: 'ปริศนาแทนตัวอักษร'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส ปริศนาแทนตัวอักษร',
			prompt:
				'พิจารณาแผนภาพกลไก ปริศนาแทนตัวอักษร (Letter Substitution Puzzles) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Letter Substitution Puzzles Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ปริศนาแทนตัวอักษร</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">LETT</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: LETT</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">LETT</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['LETT', 'lett'],
			answerDisplay: 'LETT',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Letter Substitution Puzzles** (*ปริศนาแทนตัวอักษร*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **LETT**'
		}
	},
	cryptarithm: {
		id: 'cryptarithm',
		hasExercise: false,
		englishTitle: 'Cryptarithm',
		thaiTitle: 'โจทย์คำนวณแทนตัวเลขด้วยอักษร',
		japaneseTitle: '覆面算',
		description: 'ตัวอักษรแทนเลขโดดที่ไม่ซ้ำกัน และต้องหาค่าให้สมการเลขคณิตถูกต้อง',
		chapter: {
			id: 'puzzles',
			hasExercise: false,
			englishTitle: 'Puzzle Formats',
			thaiTitle: 'รูปแบบพัซเซิล',
			japaneseTitle: 'パズル',
			accent: 'badge-warning'
		},
		detailedDescription:
			'กลไก **Cryptarithm** (ญี่ปุ่น: *覆面算*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปแบบพัซเซิล** (*Puzzle Formats*) มีสาระสำคัญคือ: ตัวอักษรแทนเลขโดดที่ไม่ซ้ำกัน และต้องหาค่าให้สมการเลขคณิตถูกต้อง กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **โจทย์คำนวณแทนตัวเลขด้วยอักษร**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Cryptarithm',
				ja: '覆面算',
				th: 'โจทย์คำนวณแทนตัวเลขด้วยอักษร'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส โจทย์คำนวณแทนตัวเลขด้วยอักษร',
			prompt:
				'พิจารณาแผนภาพกลไก โจทย์คำนวณแทนตัวเลขด้วยอักษร (Cryptarithm) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Cryptarithm Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">โจทย์คำนวณแทนตัวเลขด้วยอักษร</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">CRYP</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: CRYP</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">CRYP</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['CRYP', 'cryp'],
			answerDisplay: 'CRYP',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Cryptarithm** (*โจทย์คำนวณแทนตัวเลขด้วยอักษร*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **CRYP**'
		}
	},
	'magic-square': {
		id: 'magic-square',
		hasExercise: false,
		englishTitle: 'Magic Square',
		thaiTitle: 'จัตุรัสกล',
		japaneseTitle: '魔方陣',
		description: 'จัดตัวเลขในตารางให้ผลรวมของแถว คอลัมน์ และแนวทแยงเป็นค่าตามเงื่อนไข',
		chapter: {
			id: 'puzzles',
			hasExercise: false,
			englishTitle: 'Puzzle Formats',
			thaiTitle: 'รูปแบบพัซเซิล',
			japaneseTitle: 'パズル',
			accent: 'badge-warning'
		},
		detailedDescription:
			'กลไก **Magic Square** (ญี่ปุ่น: *魔方陣*) เป็นเทคนิคสำคัญในหมวดหมู่ **รูปแบบพัซเซิล** (*Puzzle Formats*) มีสาระสำคัญคือ: จัดตัวเลขในตารางให้ผลรวมของแถว คอลัมน์ และแนวทแยงเป็นค่าตามเงื่อนไข กลไกนี้ถูกใช้อย่างกว้างขวางในการออกแบบปริศนา *Nazotoki (謎解き)*, *Puzzle Hunt*, และ *Escape Room (リアル脱出ゲーム)* เพื่อท้าทายการคิดวิเคราะห์อย่างเป็นระบบและการเชื่อมโยงข้อมูลหลายมิติ',
		solvingTechnique:
			'1. วิเคราะห์จุดประสงค์หลัก: สังเกตความสัมพันธ์และเงื่อนไขเฉพาะของ **จัตุรัสกล**\n2. แยกองค์ประกอบที่ไม่จำเป็นออก แล้วโฟกัสที่จุดสังเกตตามกฎของโจทย์\n3. ทวนสอบผลลัพธ์ที่ได้ว่าสอดคล้องกับบริบทและคำใบ้ทั้งหมด',
		technicalTerms: [
			{
				en: 'Magic Square',
				ja: '魔方陣',
				th: 'จัตุรัสกล'
			},
			{
				en: 'Mechanic',
				ja: 'ギミック / 仕組み',
				th: 'กลไกการไขปริศนา'
			},
			{
				en: 'Deduction',
				ja: '推理 / 思考',
				th: 'การอนุมานหาข้อสรุป'
			}
		],
		puzzle: {
			title: 'โจทย์ทดลอง: ไขรหัส จัตุรัสกล',
			prompt: 'พิจารณาแผนภาพกลไก จัตุรัสกล (Magic Square) ด้านล่าง แล้วถอดรหัสคำตอบที่ถูกต้อง',
			hint: 'สังเกตตัวอักษรและสัญลักษณ์ที่เน้นสีฟ้าภายในแผนภาพ',
			svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#334155" stroke-width="2"/>\n  <text x="260" y="38" fill="#94a3b8" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Magic Square Diagram</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#1e293b" stroke="#475569" stroke-width="2"/>\n    <text x="170" y="32" fill="#cbd5e1" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">จัตุรัสกล</text>\n    <text x="170" y="65" fill="#38bdf8" font-size="26" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">MAGI</text>\n  </g>\n  <text x="260" y="185" fill="#64748b" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ถอดรหัสคำจากแผนภาพด้านบน</text>\n</svg>',
			solutionSvg:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" class="w-full max-w-lg mx-auto select-none">\n  <rect width="520" height="220" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>\n  <text x="260" y="38" fill="#34d399" font-size="13" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle">Solved: MAGI</text>\n\n  <g transform="translate(90, 65)">\n    <rect x="0" y="0" width="340" height="85" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="3"/>\n    <text x="170" y="32" fill="#6ee7b7" font-size="14" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">คำตอบที่ถูกต้อง</text>\n    <text x="170" y="65" fill="#34d399" font-size="28" font-family="DM Sans, Noto Serif Thai" font-weight="bold" text-anchor="middle" letter-spacing="8">MAGI</text>\n  </g>\n  <text x="260" y="185" fill="#34d399" font-size="12" font-family="DM Sans, Noto Serif Thai" text-anchor="middle">ตรวจคำตอบสำเร็จ</text>\n</svg>',
			acceptedAnswers: ['MAGI', 'magi'],
			answerDisplay: 'MAGI',
			solutionExplanation:
				'วิเคราะห์ตามกลไก **Magic Square** (*จัตุรัสกล*):\nเมื่อทำตามเงื่อนไขที่กำหนดในโจทย์ จะได้คำตอบสุดท้ายคือ **MAGI**'
		}
	}
};

export function getMechanicDetail(id: string): MechanicDetail | null {
	return MECHANIC_DETAILS[id] || null;
}

export function getAllMechanicIds(): string[] {
	return Object.keys(MECHANIC_DETAILS);
}

export function getAdjacentMechanics(id: string): {
	prev: { id: string; englishTitle: string; thaiTitle: string } | null;
	next: { id: string; englishTitle: string; thaiTitle: string } | null;
} {
	const ids = getAllMechanicIds();
	const index = ids.indexOf(id);
	if (index === -1) return { prev: null, next: null };

	const prevId = index > 0 ? ids[index - 1] : null;
	const nextId = index < ids.length - 1 ? ids[index + 1] : null;

	return {
		prev: prevId
			? {
					id: prevId,
					englishTitle: MECHANIC_DETAILS[prevId].englishTitle,
					thaiTitle: MECHANIC_DETAILS[prevId].thaiTitle
				}
			: null,
		next: nextId
			? {
					id: nextId,
					englishTitle: MECHANIC_DETAILS[nextId].englishTitle,
					thaiTitle: MECHANIC_DETAILS[nextId].thaiTitle
				}
			: null
	};
}
