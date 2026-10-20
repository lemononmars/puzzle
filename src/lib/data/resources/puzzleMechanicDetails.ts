import { PUZZLE_MECHANIC_CHAPTERS } from './puzzleMechanics.js';
import type { MechanicDetail } from './mechanicTypes.js';
export type { MechanicDetail, MechanicPuzzle, TechnicalTerm } from './mechanicTypes.js';

const loaders = import.meta.glob<{ default: MechanicDetail }>('./mechanics/*.json');
const summaries = PUZZLE_MECHANIC_CHAPTERS.flatMap(chapter => chapter.mechanics);

// Load only the selected article's prose, diagrams, and teaching exercise.
export async function getMechanicDetail(id: string): Promise<MechanicDetail | null> {
 const load = loaders['./mechanics/' + id + '.json'];
 return load ? (await load()).default : null;
}
export function getAllMechanicIds(): string[] { return summaries.map(item => item.id); }
export function getAdjacentMechanics(id: string) {
 const index = summaries.findIndex(item => item.id === id);
 if (index < 0) return { prev: null, next: null };
 const summary = (item: typeof summaries[number] | undefined) => item ? { id: item.id, englishTitle: item.englishTitle, thaiTitle: item.thaiTitle } : null;
 return { prev: summary(summaries[index - 1]), next: summary(summaries[index + 1]) };
}
