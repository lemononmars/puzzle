import { json, type RequestHandler } from '@sveltejs/kit';
import { getDiceRoom, actDiceRoom, RoomError } from '#lib/server/demonDiceRooms.js';
const token = (request: Request) =>
	request.headers.get('authorization')?.replace(/^Bearer /, '') ?? null;
export const GET: RequestHandler = ({ params, request }) => {
	try {
		return json(getDiceRoom(params.code!, token(request)), {
			headers: { 'Cache-Control': 'no-store' }
		});
	} catch (error) {
		return json(
			{ error: error instanceof RoomError ? error.message : 'Could not load room.' },
			{ status: error instanceof RoomError ? error.status : 400 }
		);
	}
};
export const POST: RequestHandler = async ({ params, request }) => {
	try {
		if (Number(request.headers.get('content-length')) > 4096)
			return json({ error: 'Request too large.' }, { status: 413 });
		return json(actDiceRoom(params.code!, token(request), await request.json()), {
			headers: { 'Cache-Control': 'no-store' }
		});
	} catch (error) {
		return json(
			{ error: error instanceof RoomError ? error.message : 'Room action failed.' },
			{ status: error instanceof RoomError ? error.status : 400 }
		);
	}
};
