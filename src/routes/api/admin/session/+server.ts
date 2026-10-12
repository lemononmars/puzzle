import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const expected = process.env.ADMIN_REVIEW_PASSWORD || 'nazo';
	const authorized = request.headers.get('x-admin-password') === expected;
	return Response.json({ authorized }, { status: authorized ? 200 : 401 });
};
