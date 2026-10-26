import { json } from '@sveltejs/kit';
import { examReply } from '#lib/server/thai-language.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { stage, message, bonusHintSeen } = await request.json();
		if (!Number.isInteger(stage) || stage < 0 || stage > 6 || typeof message !== 'string' || message.length > 100) return json({ message: 'Invalid message' }, { status: 400 });
		return json(examReply(stage, message, bonusHintSeen === true));
	} catch {
		return json({ message: 'Invalid request' }, { status: 400 });
	}
};
