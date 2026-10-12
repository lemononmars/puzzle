// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { tick } from 'svelte';
import AdminLayout from '../routes/admin/+layout.svelte';
import { POST } from '../routes/api/admin/session/+server';

let component: AdminLayout | undefined;
const originalFetch = globalThis.fetch;
const settle = async () => {
	await new Promise((resolve) => setTimeout(resolve, 0));
	await tick();
};
async function mount() {
	component = new AdminLayout({ target: document.body });
	await settle();
}
async function login(password: string) {
	const input = document.querySelector('input')!;
	input.value = password;
	input.dispatchEvent(new Event('input', { bubbles: true }));
	await tick();
	document
		.querySelector('form')!
		.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
	await settle();
}
beforeEach(() => {
	sessionStorage.clear();
	vi.stubGlobal(
		'fetch',
		vi.fn(async (_url, options) => ({
			ok: options.headers['x-admin-password'] === 'custom-admin',
			status: options.headers['x-admin-password'] === 'custom-admin' ? 200 : 401
		}))
	);
});
afterEach(() => {
	component?.$destroy();
	document.body.innerHTML = '';
	globalThis.fetch = originalFetch;
	component = undefined;
});
describe('shared admin login', () => {
	it('unlocks all admin links with one login and restores the session after reload', async () => {
		await mount();
		expect(document.querySelector('nav')).toBeNull();
		await login('custom-admin');
		expect(document.querySelector('form')).toBeNull();
		expect(document.querySelector('a[href="/admin"]')).toBeNull();
		for (const page of ['questions', 'logic'])
			expect(document.querySelector(`a[href="/admin/${page}"]`)).not.toBeNull();
		component!.$destroy();
		document.body.innerHTML = '';
		await mount();
		expect(document.querySelector('form')).toBeNull();
		expect(document.querySelector('nav')).not.toBeNull();
		document.querySelector('nav button')!.dispatchEvent(new Event('click'));
		await tick();
		expect(sessionStorage.getItem('admin_password')).toBeNull();
		expect(document.querySelector('nav')).toBeNull();
		expect(document.querySelector('input')).not.toBeNull();
	});
	it('keeps all admin pages locked for an incorrect password', async () => {
		await mount();
		await login('wrong');
		expect(document.querySelector('[role="alert"]')).not.toBeNull();
		expect(document.querySelector('nav')).toBeNull();
		expect(sessionStorage.getItem('admin_password')).toBeNull();
	});
	it('validates the configured password on the server', async () => {
		const original = process.env.ADMIN_REVIEW_PASSWORD;
		process.env.ADMIN_REVIEW_PASSWORD = 'custom-admin';
		try {
			for (const [password, status] of [
				['custom-admin', 200],
				['wrong', 401],
				['', 401]
			]) {
				const result = await POST({
					request: { headers: new Map([['x-admin-password', password]]) }
				} as any);
				expect(result.status).toBe(status);
			}
		} finally {
			if (original === undefined) delete process.env.ADMIN_REVIEW_PASSWORD;
			else process.env.ADMIN_REVIEW_PASSWORD = original;
		}
	});
});
