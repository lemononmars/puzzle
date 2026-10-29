/** Board game room routes share a distraction-free shell; static rules pages do not. */
export function isGameRoom(pathname: string): boolean {
	return /^\/web-game\/(pakklongboard|pakklongdice|sky-scan|game)\/(?!rules(?:\/|$))[^/]+\/?$/.test(
		pathname
	);
}


