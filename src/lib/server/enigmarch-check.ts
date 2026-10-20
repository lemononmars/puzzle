export const normalizeEnigMarchAnswer = (answer: string) => answer.normalize('NFKC').toUpperCase().replace(/[^\p{L}\p{N}]/gu, '');

export function validateThermoSudoku(answer: string, rules: { grid: { value?: number }[][]; thermometer: { lines: string[][] }[] }) {
	const clean = normalizeEnigMarchAnswer(answer);
	if (!/^[1-9]{81}$/.test(clean)) return false;
	const digits = [...clean].map(Number);
	for (let i = 0; i < 9; i++) {
		const row = digits.slice(i * 9, i * 9 + 9);
		const column = Array.from({ length:9 },(_,j) => digits[j * 9 + i]);
		const box = Array.from({ length:9 },(_,j) => digits[(Math.floor(i/3)*3 + Math.floor(j/3))*9 + (i%3)*3 + j%3]);
		if ([row,column,box].some(group => new Set(group).size !== 9)) return false;
	}
	for (let r=0;r<9;r++) for(let c=0;c<9;c++) if(rules.grid[r][c].value && digits[r*9+c] !== rules.grid[r][c].value) return false;
	for (const thermo of rules.thermometer) for (const line of thermo.lines) {
		const values=line.map(cell => { const match=/^R(\d)C(\d)$/.exec(cell); return match ? digits[(Number(match[1])-1)*9+Number(match[2])-1] : 0; });
		if(values.some((value,i)=>i>0 && value<=values[i-1])) return false;
	}
	return true;
}
