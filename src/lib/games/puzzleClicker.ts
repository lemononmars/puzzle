export const helpers = [
	{ name: 'ผู้ช่วยแกะคำใบ้', description: 'ค่อย ๆ ต่อเบาะแสให้เข้าที่', base: 15, rate: 0.2, mark: '✎' },
	{ name: 'ทีมไขปริศนา', description: 'หลายหัวช่วยกันคิด ได้ชิ้นส่วนไวขึ้น', base: 100, rate: 2, mark: '⌘' },
	{ name: 'โรงพิมพ์ปริศนา', description: 'ผลิตความท้าทายใหม่ไม่หยุด', base: 650, rate: 12, mark: '▦' }
] as const;

export type Workshop = { pieces: number; lifetime: number; pencil: number; owned: number[]; savedAt: number };
export const freshWorkshop = (now: number): Workshop => ({ pieces: 0, lifetime: 0, pencil: 0, owned: [0, 0, 0], savedAt: now });
export const clickPower = (state: Workshop) => 1 + state.pencil;
export const production = (state: Workshop) => helpers.reduce((sum, helper, index) => sum + helper.rate * state.owned[index], 0);
export const price = (base: number, owned: number) => Math.ceil(base * 1.15 ** owned);
export const pencilPrice = (state: Workshop) => Math.ceil(25 * 1.8 ** state.pencil);
const MAX = 1e100;
export function earn(state: Workshop, amount: number): Workshop {
	if (!Number.isFinite(amount) || amount < 0) return state;
	return { ...state, pieces: Math.min(MAX, state.pieces + amount), lifetime: Math.min(MAX, state.lifetime + amount) };
}
export function advance(state: Workshop, now: number): Workshop {
	const seconds = Math.min(8 * 3600, Math.max(0, (now - state.savedAt) / 1000));
	return { ...earn(state, production(state) * seconds), savedAt: now };
}
export function buy(state: Workshop, item: number | 'pencil'): Workshop {
	if (item !== 'pencil' && (!Number.isInteger(item) || !helpers[item])) return state;
	const owned = item === 'pencil' ? state.pencil : state.owned[item];
	const cost = item === 'pencil' ? pencilPrice(state) : price(helpers[item].base, owned);
	if (owned >= 1000 || state.pieces < cost) return state;
	return { ...state, pieces: state.pieces - cost, pencil: state.pencil + (item === 'pencil' ? 1 : 0), owned: state.owned.map((count, index) => count + (index === item ? 1 : 0)) };
}
export function restoreWorkshop(value: unknown, now: number): Workshop {
	if (!value || typeof value !== 'object') return freshWorkshop(now);
	const candidate = value as Workshop;
	const validAmount = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= MAX;
	const validCount = (value: unknown): value is number => validAmount(value) && Number.isInteger(value) && value <= 1000;
	if (!validAmount(candidate.pieces) || !validAmount(candidate.lifetime) || candidate.lifetime < candidate.pieces || !validCount(candidate.pencil) || !Array.isArray(candidate.owned) || candidate.owned.length !== helpers.length || !candidate.owned.every(validCount) || !validAmount(candidate.savedAt)) return freshWorkshop(now);
	return { ...candidate, savedAt: Math.min(now, candidate.savedAt) };
}
