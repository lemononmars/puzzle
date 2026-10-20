import { redirect } from '@sveltejs/kit';

export function load() {
	redirect(307, '/puzzles/web-game/four-lines');
}
