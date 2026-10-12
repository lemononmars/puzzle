import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const ids = [
		'o1juoVXG6ic',
		'oTrqUbNvzzs',
		'JXeokyrRNmQ',
		'7FforKYuIRY',
		'DsiBV31hFdE',
		'-o8ih7WCiCo',
		'qriDwpJPXgM',
		'Je9qTO1IwDs',
		'RPsh6t1IP78',
		'lxDb93Bl880',
		'BcFKb5AMuQ0',
		'w-beijl8-z8',
		'HfRSmvwGxo4'
	];

	const results = await Promise.all(
		ids.map(async (id) => {
			try {
				const res = await fetch(
					`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`
				);
				if (res.ok) {
					const data = await res.json();
					return { id, title: data.title, thumbnail: data.thumbnail_url };
				} else {
					return { id, error: `HTTP ${res.status}` };
				}
			} catch (e: any) {
				return { id, error: e.message };
			}
		})
	);

	return Response.json({ results }, {});
};
