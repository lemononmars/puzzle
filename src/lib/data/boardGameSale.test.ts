import { describe, expect, it } from 'vitest';
import { buildSaleInquiry, parseCsv, parseSaleSheet } from './boardGameSale.js';

const header = 'Title,buy ฿,60% ฿,sale ฿,Condition,Expansion / Add-on,Comment,Availability';

describe('board game sale source and inquiry', () => {
	it('reads quoted commas, multiline notes, escaped quotes, and CRLF', () => {
		expect(parseCsv('\uFEFFTitle,Comment\r\n"Game, Deluxe","One \"\"special\"\" card\nmissing"\r\n'))
			.toEqual([['Title', 'Comment'], ['Game, Deluxe', 'One "special" card\nmissing']]);
		expect(() => parseCsv('Title\n"unfinished')).toThrow();
	});
	it('uses only sale prices, keeping missing, zero, malformed, and negative prices distinct', () => {
		const games = parseSaleSheet(`${header}\nA,3000,1800,"1,200",,,,\nB,900,540,,,,,\nC,100,60,0,,,,\nD,100,60,-10,,,,\nE,100,60,sold,,,,`);
		expect(games.map((game) => game.price)).toEqual([1200, null, 0, null, null]);
		expect(games.every((game) => game.availability === 'check')).toBe(true);
		expect(JSON.stringify(games)).not.toContain('1800');
	});
	it('handles the editable status column and excludes hidden rows and sheet totals', () => {
		const games = parseSaleSheet(`${header}\nA,,,100,,,,available\nB,,,200,,,,ติดจอง\nC,,,300,,,,sold\nD,,,400,,,,hidden\nE,,,500,,,,typo\n,,1500,,,,,`);
		expect(games.map((game) => [game.title, game.availability])).toEqual([['A', 'available'], ['B', 'reserved'], ['C', 'sold'], ['E', 'check']]);
		expect(() => parseSaleSheet('Title,buy ฿\nA,100')).toThrow();
	});
	it('keeps duplicate listings separate and selection IDs stable after a price edit', () => {
		const source = `${header}\nCitadels,,,300,,,,\nCitadels,,,500,,,,`;
		const games = parseSaleSheet(source);
		expect(games[0].id).not.toBe(games[1].id);
		expect(games.map((game) => game.id)).toEqual(parseSaleSheet(source.replace('300', '400')).map((game) => game.id));
		const hiddenFirst = parseSaleSheet(`${header}\nCitadels,,,300,,,,hidden\nCitadels,,,500,,,,`);
		expect(hiddenFirst[0].id).toBe(games[1].id);
	});
	it('creates an honest partial-price inquiry with condition notes and excludes sold items', () => {
		const games = parseSaleSheet(`${header}\nA,,,500,6+ plays,Expansion,One card missing,available\nB,,,,1-5 plays,,,\nC,,,900,,,,sold`);
		const message = buildSaleInquiry(games);
		expect(message).toContain('One card missing');
		expect(message).toContain('Expansion');
		expect(message).toContain('500 บาท');
		expect(message).toContain('ยังไม่รวมรายการที่สอบถามราคา');
		expect(message).not.toContain('900');
		expect(buildSaleInquiry([games[1]])).toContain('ขอสอบถามราคาทุกรายการ');
		expect(buildSaleInquiry([games[1]])).not.toContain('ฟรี');
		expect(buildSaleInquiry([games[2]])).toBe('');
	});
});
