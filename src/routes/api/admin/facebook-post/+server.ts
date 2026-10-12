import type { RequestHandler } from './$types';
import { publishToFacebook } from '#lib/server/facebookServer.js';

function authorized(request: Request, bodyPassword?: string): boolean {
	const expected = process.env.ADMIN_REVIEW_PASSWORD || 'nazo';
	const headerPass = request.headers.get('x-admin-password');
	return headerPass === expected || bodyPassword === expected;
}

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json().catch(() => ({}));
	const {
		adminPassword,
		caption,
		imageUrl,
		published = true,
		scheduledPublishTime,
		dryRun = false
	} = body;

	if (!authorized(request, adminPassword)) {
		return Response.json(
			{ success: false, error: 'Unauthorized: รหัสผ่านแอดมินไม่ถูกต้อง' } as any,
			{ status: 401 }
		);
	}

	if (!caption || typeof caption !== 'string' || caption.trim().length === 0) {
		return Response.json(
			{ success: false, error: 'ข้อความโพสต์ (caption) ต้องไม่ว่างเปล่า' } as any,
			{ status: 400 }
		);
	}

	const result = await publishToFacebook({
		caption: caption.trim(),
		imageUrl: imageUrl ? String(imageUrl).trim() : undefined,
		published: Boolean(published),
		scheduledPublishTime: scheduledPublishTime ? Number(scheduledPublishTime) : undefined,
		dryRun: Boolean(dryRun)
	});

	if (!result.success) {
		return Response.json(result as any, { status: 400 });
	}

	return Response.json(result as any, { status: 200 });
};
