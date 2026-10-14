import { error } from '@sveltejs/kit';
import catalog from '#lib/data/catalog.json';
export const load = ({ params }: { params: { section: string } }) => {
 const group = catalog.puzzles.find(group => group.id === params.section);
 if (!group) error(404, 'Category not found');
 return { group };
};
