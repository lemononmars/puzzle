// Answer key supplied by the owner of the original artwork.
const answers = ['ก', 'อก', 'บวก', 'เลือก', 'กระจก'];
export function checkThaiLanguageAnswer(question: number, answer: string) {
	if (!Number.isInteger(question) || question < 1 || question > answers.length) return false;
	const normalized = answer.normalize('NFKC').replace(/[\s.。]/gu, '');
	return normalized === answers[question - 1];
}

const hints = ['ตัวอักษรเหล่านี้แทนชื่อเดือนทั้ง ๑๒ เดือน', 'ลองคิดต่อไปว่าตัวเลือกแถวถัด ๆ ไปจะเป็นอะไร', 'หน้าบาง กลางสวน หลังฉาก หมายถึงตำแหน่งตัวอักษร', 'อย่ามองเฉพาะคำตัวใหญ่ ลองอ่านคำสั่งอีกครั้ง', 'ลองย้ายสระด้วย ไม่จำเป็นต้องย้ายเฉพาะพยัญชนะ'];
export function examReply(stage: number, message: string, bonusHintSeen = false) {
	const command = message.trim().normalize('NFKC');
	const hint = /^ใบ้([1-6๑-๖])$/.exec(command);
	if (hint) {
		const number = '๑๒๓๔๕๖'.includes(hint[1]) ? '๑๒๓๔๕๖'.indexOf(hint[1]) + 1 : Number(hint[1]);
		return { text: number === 6 ? 'คำตอบเป็นชื่อจังหวัด' : hints[number - 1], bonusHintSeen: number === 6 || bonusHintSeen };
	}
	if ((stage === 6 || bonusHintSeen) && command === 'พิษณุโลก') return { text: 'ถูกต้อง!', bonus: true };
	if (stage === 0) return command === 'เริ่ม' ? { text: 'เริ่มทำข้อสอบได้', next: 1 } : { text: 'พิมพ์คำว่า เริ่ม เพื่อรับข้อสอบข้อแรก' };
	if (stage >= 1 && stage <= 5 && checkThaiLanguageAnswer(stage, command)) return { text: 'ถูกต้อง!', next: stage + 1 };
	return { text: 'ยังไม่ถูกต้อง ลองใหม่อีกครั้ง' };
}
