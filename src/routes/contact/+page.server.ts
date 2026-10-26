import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const data = await request.formData();
		const read = (key: string) => typeof data.get(key) === 'string' ? String(data.get(key)).trim() : '';
		const values = { name: read('name'), contact: read('contact'), service: read('service'), brief: read('brief'), deadline: read('deadline'), budget: read('budget') };
		if (!values.name || !values.contact || !values.brief || values.name.length > 150 || values.contact.length > 300 || values.brief.length > 5000 || values.service.length > 150 || values.deadline.length > 200 || values.budget.length > 200) {
			return fail(400, { values, message: 'กรุณากรอกชื่อ ช่องทางติดต่อ และข้อความให้ครบตามความยาวที่กำหนด', success: false });
		}
		if (read('website')) return fail(400, { values, message: 'ส่งข้อความไม่สำเร็จ กรุณาลองใหม่', success: false });
		if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL) return fail(503, { values, message: 'ระบบส่งข้อความยังไม่พร้อม กรุณาติดต่อ sakulbuth@gmail.com', success: false });
		try {
			const response = await fetch('https://api.resend.com/emails', {
				method: 'POST',
				headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
				body: JSON.stringify({
					from: env.CONTACT_FROM_EMAIL,
					to: ['sakulbuth@gmail.com'],
					subject: 'Puzzle: New contact message',
					text: `Name: ${values.name}\nContact: ${values.contact}\nService: ${values.service}\nTimeline: ${values.deadline}\nBudget: ${values.budget}\n\n${values.brief}`,
					...(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contact) ? { reply_to: values.contact } : {})
				}),
				signal: AbortSignal.timeout(15000)
			});
			const result = await response.json();
			if (!response.ok || typeof result.id !== 'string') return fail(502, { values, message: 'ส่งข้อความไม่สำเร็จ กรุณาลองใหม่หรือติดต่อ sakulbuth@gmail.com', success: false });
			return { success: true, message: 'ส่งข้อความเรียบร้อยแล้ว ขอบคุณที่ติดต่อมา' };
		} catch {
			return fail(502, { values, message: 'ส่งข้อความไม่สำเร็จ กรุณาลองใหม่หรือติดต่อ sakulbuth@gmail.com', success: false });
		}
	}
};
