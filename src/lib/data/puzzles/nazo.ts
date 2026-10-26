export const nazoPuzzles = Array.from({ length: 29 }, (_, index) => ({
	id: index + 1,
	title: `Nazo #${String(index + 1).padStart(2, '0')}`,
	image: `/puzzles/nazo/${String(index + 1).padStart(2, '0')}.png`
}));
