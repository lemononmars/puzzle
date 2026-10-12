import { getImageURL } from '#lib/supabase.js';

export const puzzleDescriptions = [
	{
		type: 'adventure',
		description: 'ตะลุยด่านไขรหัส',
		icon: getImageURL('assets', 'adventure.png')
	},
	{
		type: 'rebus',
		description: 'ทายคำจากภาพ',
		icon: getImageURL('assets', 'rebus.png')
	},
	{
		type: 'crossword',
		description: 'ปริศนาอักษรไขว้',
		icon: getImageURL('assets', 'crossword.png')
	},
	{
		type: 'alphabet',
		description: 'ทายคำจากคำใบ้ โดยเปิดตัวอักษรให้น้อยที่สุด',
		icon: getImageURL('assets', 'alphabet.png')
	},
	{
		type: 'spellingbee',
		description: 'หาคำ 7 ตัวอักษร',
		icon: getImageURL('assets', 'spellingbee.png')
	},
	{
		type: 'puzzlehunt',
		description: 'แก้ชุดปริศนา',
		icon: getImageURL('assets', 'puzzlehunt.png')
	},
	{
		type: 'missingvowels',
		description: 'ทายคำโดยใช้แค่พยัญชนะ',
		icon: getImageURL('assets', 'missing.png')
	},
	{
		type: 'cryptogram',
		description: 'ทายคำจากรหัสอักษร',
		icon: getImageURL('assets', 'cryptogram.png')
	},
	{
		type: 'crossroad',
		description: 'เติมคำเพื่อสร้างคำทั้งสี่ทิศทาง',
		icon: getImageURL('assets', 'crossroad.png')
	},
	{
		type: 'spellingquiz',
		description: 'เกมสะกดคำไทย ทายคำสะกดที่ถูกต้องของคำที่คนมักเขียนผิดบ่อยที่สุด',
		icon: getImageURL('assets', 'spellingbee.png')
	}
];

export interface ShopProduct {
	url: string;
	title: string;
	description: string;
	imgUrl: string;
	price: number;
	shipping: number;
	badge?: string;
	category?: string;
	puzzlesCount?: string;
	format?: string;
	refParam?: string;
}

export interface ShopComingSoonProduct {
	title: string;
	description: string;
	imgUrl?: string;
	category: string;
	badge: string;
	expected?: string;
}

export const shopProductDescriptions: ShopProduct[] = [
	{
		url: 'logiccontestbook1',
		title: 'Logic Puzzle Contest 1 Book',
		description:
			'รวบรวมโจทย์ทั้งหมดจากงานแข่ง พร้อมโจทย์พิเศษ 40 ข้อ รวม 85 ปริศนา (เนื้อหาภาษาอังกฤษล้วน)',
		imgUrl: 'logic_puzzle_contest_book_cover.jpg',
		price: 150,
		shipping: 30,
		badge: '85+ ข้อ • English',
		category: 'Logic Puzzle',
		puzzlesCount: '85 ปริศนา (Logic & Variety)',
		format: 'หนังสือ A5 พร้อมเฉลยละเอียด',
		refParam: 'order_logiccontestbook1'
	},
	{
		url: 'logiccontestbook2',
		title: 'Logic Puzzle Contest 2 Book',
		description:
			'137 ปริศนาใน 48 ประเภท จาก Contest II, Choco Banana Bus และ Logic Showcase (คำอธิบายภาษาอังกฤษ มีปริศนาคำภาษาไทย)',
		imgUrl: '/images/product/logic_puzzle_contest_book2_cover.jpg',
		price: 150,
		shipping: 30,
		badge: '137 ข้อ • 48 ประเภท',
		category: 'Logic Puzzle',
		puzzlesCount: '137 ปริศนา',
		format: 'หนังสือ A4 พร้อมเฉลย',
		refParam: 'order_logiccontestbook2'
	},
	{
		url: 'rebusbook',
		title: 'Rebus Puzzle Book',
		description: 'ปริศนาอักษรแทนคำภาษาไทย 100 ข้อ พร้อมคำใบ้และเฉลยในตัว',
		imgUrl: 'rebus_book_cover.jpg',
		price: 100,
		shipping: 20,
		badge: '100 ข้อจุใจ',
		category: 'Word Puzzle',
		puzzlesCount: '100 ปริศนาคำไทย',
		format: 'หนังสือพกพา A6 (1 หน้าต่อ 1 ข้อ)',
		refParam: 'order_rebusbook'
	}
];

export const shopComingSoonProducts: ShopComingSoonProduct[] = [];

export const shopImgUrlPrefix =
	'https://raw.githubusercontent.com/lemononmars/codebreaker/main/src/lib/images/product/';
