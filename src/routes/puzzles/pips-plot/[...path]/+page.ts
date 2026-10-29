import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
export const load: PageLoad = ({ params, url }) => {
 const suffix = params.path ? `/${params.path}` : '';
 redirect(308, `/web-game/pips-plot${suffix}${url.search}`);
};
