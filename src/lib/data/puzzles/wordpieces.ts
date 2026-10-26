export const wordPieces = [
	{ clue: 'ส่วนของพืชที่มักมีกลีบและสีสวย', chunks: ['ดอก', 'ไม้'], hint: 'มักนำมาจัดใส่แจกัน' },
	{ clue: 'เงินตอบแทนที่ธนาคารจ่ายให้ผู้ฝากเงิน', chunks: ['ดอก', 'เบี้ย'], hint: 'มักคิดเป็นอัตราร้อยละต่อปี' },
	{ clue: 'ลำน้ำสายใหญ่ เช่น เจ้าพระยา', chunks: ['แม่', 'น้ำ'], hint: 'ไหลผ่านกรุงเทพมหานคร' },
	{ clue: 'เครื่องปรุงรสเค็มที่ได้จากการหมักปลา', chunks: ['น้ำ', 'ปลา'], hint: 'มักใช้คู่กับพริกในถ้วยเครื่องปรุง' },
	{ clue: 'มีเมตตาและชอบช่วยเหลือผู้อื่น', chunks: ['ใจ', 'ดี'], hint: 'ตรงข้ามกับใจร้าย' }
] as const;

export const tiles = wordPieces.flatMap((word, index) =>
	word.chunks.map((text, part) => ({ id: `${index}-${part}`, text }))
);

export function matchesAnswer(clue: number, selected: string[], used: string[]): boolean {
	if (!wordPieces[clue] || !selected.length || new Set(selected).size !== selected.length) return false;
	if (selected.some(id => used.includes(id) || !tiles.some(tile => tile.id === id))) return false;
	return selected.map(id => tiles.find(tile => tile.id === id)!.text).join('') === wordPieces[clue].chunks.join('');
}
