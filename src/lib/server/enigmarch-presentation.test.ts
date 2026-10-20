import { describe, expect, it } from 'vitest';
import puzzles from './enigmarch.json';
import { maskHintAnswers, presentPuzzle } from './enigmarch-presentation.js';
import type { EnigMarchBlock, EnigMarchPuzzle } from '#lib/enigmarch.js';
const all = (blocks: EnigMarchBlock[]): EnigMarchBlock[] => blocks.flatMap(block=>[block,...all(block.children)]);
describe('EnigMarch presentation',()=>{
	it('flattens every solution and masks answer words in 2024 hints',()=>{
		for(const source of puzzles){
			const puzzle=presentPuzzle(source as EnigMarchPuzzle);
			expect('rules' in puzzle).toBe(false);
			expect(all(puzzle.solution).some(block=>block.type==='toggle')).toBe(false);
			if(puzzle.year===2024){
				const hint=all(puzzle.hints.flatMap(h=>h.blocks)).map(b=>b.text+' '+b.html.replace(/<[^>]*>/g,'')).join(' ');
				for(const answer of source.answers)expect(hint).not.toMatch(new RegExp('\\b'+answer+'\\b','i'));
			}
		}
	});
	it('masks words split by formatting without damaging image paths or unrelated words',()=>{
		const blocks=[{type:'text',text:'Door, DOOR and doorway.',html:'Do<strong>or</strong>, DOOR and doorway.',children:[]}];
		const [block]=maskHintAnswers(blocks,['DOOR'],'????');
		expect(block.text).toBe('????, ???? and doorway.');
		expect(block.html).not.toContain('or</strong>');
	});
});
