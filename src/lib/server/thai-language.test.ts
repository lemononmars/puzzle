import { describe, expect, it } from 'vitest';
import { checkThaiLanguageAnswer, examReply } from './thai-language.js';
describe('Thai language puzzle answer key', () => {
	it('accepts all five owner-supplied answers', () => {
		['ก', 'อก', 'บวก', 'เลือก', 'กระจก'].forEach((answer, index) => expect(checkThaiLanguageAnswer(index + 1, answer)).toBe(true));
	});
	it('starts only on the start command and advances on correct answers', () => {
		expect(examReply(0, 'ก')).not.toHaveProperty('next');
		expect(examReply(0, 'เริ่ม')).toMatchObject({ next: 1 });
		expect(examReply(1, 'ข')).not.toHaveProperty('next');
		expect(examReply(1, 'ก')).toMatchObject({ next: 2 });
		expect(examReply(5, 'กระจก')).toMatchObject({ next: 6 });
	});
	it('returns one stable hint per question and supports Thai digits', () => {
		for (let i = 1; i <= 5; i++) {
			const reply = examReply(1, `ใบ้${i}`);
			expect(reply.text).toBeTruthy();
			expect(reply).not.toHaveProperty('next');
			expect(examReply(1, `ใบ้${'๑๒๓๔๕'[i - 1]}`).text).toBe(reply.text);
		}
	});
	it('keeps the extra hint and province answer outside the visible numbered flow', () => {
		expect(examReply(5, 'ใบ้6')).toMatchObject({ text: 'คำตอบเป็นชื่อจังหวัด', bonusHintSeen: true });
		expect(examReply(6, 'พิษณุโลก')).toMatchObject({ bonus: true });
		expect(examReply(2, 'พิษณุโลก', true)).toMatchObject({ bonus: true });
		expect(examReply(2, 'พิษณุโลก')).not.toHaveProperty('bonus');
	});
	it('keeps the instruction typo as the target of question four', () => {
		expect(checkThaiLanguageAnswer(4, 'ปรากฏ')).toBe(false);
		expect(checkThaiLanguageAnswer(4, ' เลือก ')).toBe(true);
		expect(checkThaiLanguageAnswer(0, 'ก')).toBe(false);
	});
});
