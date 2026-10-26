import { beforeEach, describe, expect, it, vi } from 'vitest';
const config = vi.hoisted(() => ({ RESEND_API_KEY: '', CONTACT_FROM_EMAIL: '' }));
vi.mock('$env/dynamic/private', () => ({ env: config }));
import { actions } from './+page.server.js';

async function submit(fields: Record<string, string>, send = vi.fn()) {
	const body = new FormData();
	for (const [name, value] of Object.entries(fields)) body.set(name, value);
	return actions.default!({ request: new Request('https://puzzle.test/contact', { method: 'POST', body }), fetch: send } as any);
}
const fields = { name: 'Test visitor', contact: 'visitor@example.com', brief: 'A custom puzzle inquiry.' };
beforeEach(() => { config.RESEND_API_KEY = ''; config.CONTACT_FROM_EMAIL = ''; });
describe('contact delivery', () => {
	it('rejects missing required fields without contacting the provider', async () => {
		const send = vi.fn();
		expect(await submit({ ...fields, name: '' }, send)).toMatchObject({ status: 400 });
		expect(send).not.toHaveBeenCalled();
	});
	it('never claims success when delivery is unconfigured', async () => {
		expect(await submit(fields)).toMatchObject({ status: 503, data: { success: false, values: fields } });
	});
	it('sends to the fixed owner address and succeeds only after provider acceptance', async () => {
		config.RESEND_API_KEY = 'test-key'; config.CONTACT_FROM_EMAIL = 'Puzzle <hello@example.com>';
		const send = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 'accepted-id' }), { status: 200 }));
		expect(await submit(fields, send)).toMatchObject({ success: true });
		const payload = JSON.parse(send.mock.calls[0][1].body);
		expect(payload.to).toEqual(['sakulbuth@gmail.com']);
		expect(payload.reply_to).toBe(fields.contact);
		expect(payload.text).toContain(fields.brief);
	});
	it('preserves the message when the provider rejects delivery', async () => {
		config.RESEND_API_KEY = 'test-key'; config.CONTACT_FROM_EMAIL = 'hello@example.com';
		const send = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: 'Unavailable' }), { status: 500 }));
		expect(await submit(fields, send)).toMatchObject({ status: 502, data: { success: false, values: fields } });
	});
});
