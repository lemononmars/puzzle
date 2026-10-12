import { from } from '#lib/supabase.js';
import {
	isAllowedTable,
	PUBLIC_INSERT_TABLES,
	PUBLIC_TABLES,
	publicError
} from '#lib/apiGuards.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { type } = params;
	if (!isAllowedTable(type, PUBLIC_TABLES)) {
		return publicError(404, 'Not found');
	}

	const { data, error } = await from(type).select('*');

	if (error) return publicError();

	return Response.json(data, { status: 200, headers: { 'Content-Type': 'application/json' } });
};

export const POST: RequestHandler = async ({ params, request }) => {
	const { type } = params;
	const body = await request.json();
	if (!isAllowedTable(type, PUBLIC_INSERT_TABLES)) {
		return publicError(404, 'Not found');
	}

	const { data, error } = await from(type).insert([body]);

	if (error) {
		console.error(`API Error inserting to ${type}:`, error);
		return publicError();
	}

	return Response.json(data ? data[0] : null, { status: 201 });
};
