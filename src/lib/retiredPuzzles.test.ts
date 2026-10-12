import { describe, expect, it, vi } from 'vitest';
import { from } from '#lib/supabase.js';
import { GET as listPuzzles } from '../routes/api/puzzle/[type]/+server';
import { GET as getPuzzle } from '../routes/api/puzzle/[type]/[id]/+server';
import { POST as submitScore } from '../routes/api/post/leaderboard/+server';
import { GET as getLeaderboard } from '../routes/api/leaderboard/[type]/+server';

vi.mock('#lib/supabase.js', () => ({ from: vi.fn() }));
vi.mock('#lib/discordServer.js', () => ({ sendhook: vi.fn() }));

describe('retired puzzle types', () => {
	it('rejects reads and score submissions before accessing the retained database', async () => {
		const list = await listPuzzles({ params: { type: 'weekly' } } as any);
		const puzzle = await getPuzzle({ params: { type: 'weekly', id: '202601' } } as any);
		const leaderboard = await getLeaderboard({ params: { type: 'weekly' } } as any);
		const submission = await submitScore({
			request: new Request('http://localhost/api/post/leaderboard', {
				method: 'POST',
				body: JSON.stringify({ name: 'Player', puzzle_type: 'weekly', puzzle_id: '202601' })
			})
		} as any);
		expect(list.status).toBe(404);
		expect(puzzle.status).toBe(404);
		expect(leaderboard.status).toBe(404);
		expect(submission.status).toBe(410);
		expect(from).not.toHaveBeenCalled();
	});
	it.each(['seventh', 'tbs2021'])('rejects legacy %s leaderboards and scores', async (type) => {
		vi.mocked(from).mockClear();
		const leaderboard = await getLeaderboard({ params: { type } } as any);
		const submission = await submitScore({ request: new Request('http://localhost/api/post/leaderboard', {
			method: 'POST', body: JSON.stringify({ name: 'Player', puzzle_type: type, puzzle_id: '1' })
		}) } as any);
		expect(leaderboard.status).toBe(404);
		expect(submission.status).toBe(410);
		expect(from).not.toHaveBeenCalled();
	});
});
