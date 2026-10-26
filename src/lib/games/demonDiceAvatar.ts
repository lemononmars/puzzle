export const seedColors = {
	terracotta: '#bd8766',
	rose: '#c78695',
	gold: '#c5a257',
	slate: '#7b91a4'
} as const;
export const leafColors = {
	sage: '#6f925e',
	mint: '#74a98e',
	fern: '#4f794b',
	plum: '#9474a4'
} as const;
export type Avatar = {
	seed: keyof typeof seedColors;
	leaves: keyof typeof leafColors;
	accessory: 'none' | 'flower' | 'bow';
};
export const defaultAvatar: Avatar = { seed: 'terracotta', leaves: 'sage', accessory: 'none' };
export function cleanAvatar(value: unknown): Avatar {
	const a = value as Partial<Avatar> | null;
	return {
		seed: a?.seed && Object.hasOwn(seedColors, a.seed) ? a.seed : 'terracotta',
		leaves: a?.leaves && Object.hasOwn(leafColors, a.leaves) ? a.leaves : 'sage',
		accessory: a?.accessory === 'flower' || a?.accessory === 'bow' ? a.accessory : 'none'
	};
}
