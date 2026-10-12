import type { Message } from '@line/bot-sdk';
import { reply } from '#lib/lineapiServer.js';
import type { RequestHandler } from './$types';

const hints = [
	`นับว่ามี ม.ม้า กี่ตัว คำตอบอยู่ในรูป "จำนวน + ม"`,
	`นับว่ามี ส.เสือ กี่ตัว คำตอบอยู่ในรูป "ส + จำนวน"`,
	`นับว่ามี ย.ยักษ์ กี่ตัว คำตอบอยู่ในรูป "เ + จำนวน + ย"`,
	`นับว่ามีสระอีกี่ตัว คำตอบอยู่ในรูป "จำนวน + สระอี"`
];

const answers = ['ห้าม', 'สร้อย', 'เสี่ย', 'สามี'];

const imgUrlPrefix = `https://raw.githubusercontent.com/lemononmars/codebreaker/main/src/lib/images/line/test/`;
/**
 *
 * @param {null}
 * @return {object} array of objects
 */
export const POST: RequestHandler = async ({ request }) => {
	let data = await request.json();
	if (!data || !data.events || data.events.length == 0)
		return Response.json({}, { status: 200, headers: { 'Content-Type': 'application/json' } });

	const event = data.events[0];
	const replyToken = event.replyToken;
	const userMessage: string = event.message?.text || '';

	let replyMessage: Message | Message[] = {
		type: 'text',
		text: `พิมพ์ 'เริ่ม' เพื่อเริ่มต้นใหม่ พิมพ์ 'ใบ้#' (ไม่มีช่องว่าง) เพื่อขอคำใบ้ของข้อที่ #`
	};

	if (event.type === 'follow') {
		replyMessage = [
			{
				type: 'text',
				text: 'ยินดีต้อนรับสู่ห้องปริศนา !'
			},
			{
				type: 'text',
				text: `พิมพ์ 'เริ่ม' เพื่อเริ่มเล่น`
			},
			{
				type: 'text',
				text: `พิมพ์ 'ใบ้#' (ไม่มีช่องว่าง) เพื่อขอคำใบ้ของข้อที่ #`
			}
		];

		await reply(replyToken, replyMessage);
		return Response.json({}, { status: 200, headers: { 'Content-Type': 'application/json' } });
	}

	if (event.type === 'message') {
		if (userMessage === 'เริ่ม') {
			replyMessage = {
				type: 'image',
				originalContentUrl: imgUrlPrefix + 'rebus01.png',
				previewImageUrl: imgUrlPrefix + 'rebus01.png'
			};
		} else if (answers.includes(userMessage)) {
			const answerNo = answers.indexOf(userMessage);
			if (answerNo < 3)
				replyMessage = [
					{
						type: 'sticker',
						packageId: '6359',
						stickerId: '11069848'
					},
					{
						type: 'image',
						originalContentUrl: imgUrlPrefix + `rebus0${answerNo + 2}.png`,
						previewImageUrl: imgUrlPrefix + `rebus0${answerNo + 2}.png`
					}
				];
			else
				replyMessage = [
					{
						type: 'text',
						text: 'ยินดีด้วย! คุณแก้ปริศนาครบทั้ง 4 ข้อแล้ว ไว้มาเล่นกันใหม่ในเกมหน้า'
					},
					{
						type: 'sticker',
						packageId: '6359',
						stickerId: '11069868'
					}
				];
		} else if (userMessage.startsWith('ใบ้')) {
			const hintNo: number = parseInt(userMessage[userMessage.length - 1]);
			if (hintNo >= 1 && hintNo <= 4)
				replyMessage = {
					type: 'text',
					text: `คำใบ้ข้อที่ ${hintNo}: ${hints[hintNo - 1]}`
				};
			else
				replyMessage = {
					type: 'text',
					text: `ลองใหม่ พิมพ์ 'ใบ้#' เพื่อขอคำใบ้ของข้อ #`
				};
		}
		await reply(replyToken, replyMessage);
	}

	return Response.json({}, { status: 200, headers: { 'Content-Type': 'application/json' } });
};
