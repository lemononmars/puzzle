import { describe, expect, it } from 'vitest';
import puzzles from './enigmarch.json';
import { normalizeEnigMarchAnswer, validateThermoSudoku } from './enigmarch-check.js';
import { POST } from '../../routes/puzzles/enigmarch/[year]/[day]/check/+server';

const submit = (year: string, day: string, answer: unknown) => POST({ params:{year,day},request:new Request('http://localhost/check',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({answer})}) } as any);

describe('EnigMarch archive answer checking', () => {
	it('checks word, numeric, and diagram answers and rejects incorrect guesses', async () => {
		for(const [year,day,answer] of [['2023','1',' trophy '],['2023','22','dark horse'],['2023','24','LION'],['2024','15','3d'],['2023','21','45']]) {
			expect(await (await submit(year,day,answer)).json()).toEqual({correct:true});
		}
		expect(await (await submit('2024','1','wrong')).json()).toEqual({correct:false});
		expect((await submit('2023','1',null)).status).toBe(400);
	});
	it('has 31 complete puzzles per year, with local artwork and usable checkers', () => {
		for(const year of [2023,2024]) expect(puzzles.filter(p=>p.year===year).map(p=>p.day)).toEqual(Array.from({length:31},(_,i)=>i+1));
		for(const puzzle of puzzles) {
			expect(puzzle.blocks.length).toBeGreaterThan(0);
			expect(puzzle.answers.length>0 || Boolean(puzzle.rules)).toBe(true);
			if(puzzle.year===2024) expect(puzzle.hints.some(h=>h.title.startsWith('Explanation'))).toBe(true);
		}
	});
	it('validates actual Sudoku rules and thermometer direction', () => {
		const solution='123456789456789123789123456234567891567891234891234567345678912678912345912345678';
		const rules={grid:Array.from({length:9},()=>Array.from({length:9},()=>({}))),thermometer:[{lines:[['R1C1','R1C2','R1C3']]}]};
		expect(validateThermoSudoku(solution,rules)).toBe(true);
		expect(validateThermoSudoku('2'+solution.slice(1),rules)).toBe(false);
		expect(validateThermoSudoku(solution,{...rules,thermometer:[{lines:[['R1C3','R1C2']]}]})).toBe(false);
		expect(normalizeEnigMarchAnswer(' Ｄark-horse ')).toBe('DARKHORSE');
	});
});
