/** Board game room routes share a distraction-free shell; static rules pages do not. */
export function isGameRoom(pathname: string): boolean {
	return /^\/boardgame\/(pakklongboard|pakklongdice|game)\/(?!rules(?:\/|$))[^/]+\/?$/.test(
		pathname
	);
}
