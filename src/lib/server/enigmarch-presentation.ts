import type { EnigMarchBlock, EnigMarchPuzzle } from '#lib/enigmarch.js';

export function puzzlePreview(blocks: EnigMarchBlock[]): string {
	for (const block of blocks) {
		if (block.type === 'image' && block.src) return block.src;
		const nested = puzzlePreview(block.children);
		if (nested) return nested;
	}
	return '';
}
export function flattenSolution(blocks: EnigMarchBlock[]): EnigMarchBlock[] {
	return blocks.flatMap(block => block.type === 'toggle' ? flattenSolution(block.children) : [{...block, children:flattenSolution(block.children)}]);
}
export function maskHintAnswers(blocks: EnigMarchBlock[], answers: string[], mask: string): EnigMarchBlock[] {
	const patterns = answers.map(answer => new RegExp('(?<![A-Za-z0-9])' + answer.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '(?![A-Za-z0-9])','gi'));
	const replace = (text:string) => patterns.reduce((value,pattern)=>value.replace(pattern,mask),text);
	return blocks.map(block => {
		const text = replace(block.text);
		let html = block.html.split(/(<[^>]*>)/g).map(part=>part.startsWith('<')?part:replace(part)).join('');
		const visible = html.replace(/<[^>]*>/g,'');
		// Fall back to plain text if an answer crosses formatting tags.
		if (replace(visible) !== visible) html=text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
		return {...block,text,html,children:maskHintAnswers(block.children,answers,mask)};
	});
}
export function presentPuzzle(puzzle: EnigMarchPuzzle & { rules?: unknown }) {
	const { answers, rules: _rules, ...rest } = puzzle;
	return { ...rest, solution:flattenSolution(puzzle.solution), hints:puzzle.hints.map(hint=>({
		...hint,
		title:hint.title.replace(' · hint (may reveal the answer)',''),
		blocks:puzzle.year === 2024 ? maskHintAnswers(hint.blocks,answers,puzzle.title.match(/\?+/)?.[0] || '?'.repeat(answers[0]?.length || 1)) : hint.blocks
	})) };
}
