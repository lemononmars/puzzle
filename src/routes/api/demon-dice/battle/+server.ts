import { json, type RequestHandler } from '@sveltejs/kit';
import { createDiceRoom, RoomError } from '#lib/server/demonDiceRooms.js';
export const POST: RequestHandler = async ({ request }) => {
	try {
		if (Number(request.headers.get('content-length')) > 4096)
			return json({ error: 'Request too large.' }, { status: 413 });
		return json(createDiceRoom(await request.json()), { headers: { 'Cache-Control': 'no-store' } });
	} catch (error) {
		return json(
			{ error: error instanceof RoomError ? error.message : 'Could not create room.' },
			{ status: error instanceof RoomError ? error.status : 400 }
		);
	}
};
