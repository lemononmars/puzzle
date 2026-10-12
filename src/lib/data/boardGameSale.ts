export type Availability = 'available' | 'check' | 'reserved' | 'sold';

export type SaleGame = {
	id: string;
	title: string;
	listing: number;
	price: number | null;
	condition: string;
	addOns: string;
	note: string;
	availability: Availability;
};

export const saleContacts = {
	messenger: 'https://m.me/sakulbuth',
	lineId: 'lemononmars'
};

export const availabilityLabels: Record<Availability, string> = {
	available: 'พร้อมขาย',
	check: 'สอบถามสถานะ',
	reserved: 'ติดจอง',
	sold: 'ขายแล้ว'
};

export const canInquire = (game: SaleGame) => game.availability === 'available' || game.availability === 'check';
export const formatPrice = (price: number | null) => price === null ? 'สอบถามราคา' : price === 0 ? 'ฟรี' : `${price.toLocaleString('th-TH')} บาท`;

export function buildSaleInquiry(games: SaleGame[]): string {
	const selected = games.filter(canInquire);
	if (!selected.length) return '';
	const total = selected.reduce((sum, game) => sum + (game.price ?? 0), 0);
	const lines = selected.map((game, i) => `${i + 1}. ${game.title}${game.listing > 1 ? ` (รายการ ${game.listing})` : ''} — ${formatPrice(game.price)}${game.condition ? ` / ${game.condition}` : ''}${game.addOns ? ` / รวม ${game.addOns}` : ''}${game.note ? ` / หมายเหตุ: ${game.note}` : ''}`);
	return ['สวัสดีครับ/ค่ะ สนใจบอร์ดเกมรายการต่อไปนี้', '', ...lines, '',
		selected.every((game) => game.price === null) ? 'ขอสอบถามราคาทุกรายการ' : selected.some((game) => game.price === null) ? `ยอดเฉพาะรายการที่ระบุราคา: ${formatPrice(total)} (ยังไม่รวมรายการที่สอบถามราคา)` : `รวมราคาเกม: ${formatPrice(total)}`,
		'รบกวนยืนยันสถานะเกม สภาพอุปกรณ์ และค่าจัดส่ง/วิธีรับของก่อนตกลงซื้อครับ/ค่ะ'].join('\n');
}

/** Google exports quoted commas, multiline notes, and escaped double quotes. */
export function parseCsv(csv: string): string[][] {
	const rows: string[][] = [];
	let row: string[] = [], field = '', quoted = false;
	const text = csv.replace(/^\uFEFF/, '');
	for (let i = 0; i < text.length; i++) {
		const ch = text[i];
		if (ch === '"') {
			if (quoted && text[i + 1] === '"') { field += '"'; i++; }
			else quoted = !quoted;
		} else if (!quoted && (ch === ',' || ch === '\n' || ch === '\r')) {
			row.push(field); field = '';
			if (ch !== ',') { rows.push(row); row = []; if (ch === '\r' && text[i + 1] === '\n') i++; }
		} else field += ch;
	}
	if (quoted) throw new Error('Incomplete sheet export');
	if (field || row.length) { row.push(field); rows.push(row); }
	return rows;
}

export function parseSaleSheet(csv: string): SaleGame[] {
	const [headers = [], ...rows] = parseCsv(csv);
	const names = headers.map((header) => header.trim().toLowerCase());
	const column = (name: string) => names.indexOf(name.toLowerCase());
	if (column('Title') < 0 || column('sale ฿') < 0) throw new Error('Sale sheet headers missing');
	const duplicates = new Map<string, number>();
	return rows.flatMap((row) => {
		const read = (name: string) => (row[column(name)] ?? '').trim();
		const title = read('Title');
		if (!title) return [];
		const key = title.normalize('NFKC').toLowerCase();
		const listing = (duplicates.get(key) ?? 0) + 1;
		duplicates.set(key, listing);
		const status = (read('Availability') || read('Status') || read('สถานะ')).toLowerCase();
		if (['hidden', 'ซ่อน'].includes(status)) return [];
		const availability: Availability = ['available', 'พร้อมขาย', 'ว่าง'].includes(status) ? 'available'
			: ['reserved', 'ติดจอง', 'จอง'].includes(status) ? 'reserved'
			: ['sold', 'ขายแล้ว'].includes(status) ? 'sold' : 'check';
		const rawPrice = read('sale ฿').replace(/฿|THB|บาท|\s/gi, '');
		const price = /^\d+(?:,\d{3})*(?:\.\d{1,2})?$/.test(rawPrice) ? Number(rawPrice.replaceAll(',', '')) : null;
		return [{ id: `${key}::${listing}`, title, listing, price: Number.isFinite(price) ? price : null,
			condition: read('Condition'), addOns: read('Expansion / Add-on'), note: read('Comment'), availability }];
	});
}
