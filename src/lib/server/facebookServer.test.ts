import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { publishToFacebook } from './facebookServer';

vi.hoisted(() => {
	process.env.FB_PAGE_ID = '114752709892205';
	process.env.FB_PAGE_ACCESS_TOKEN = 'test_token_123';
	process.env.FB_API_VERSION = 'v20.0';
});

describe('Facebook Server Module', () => {
	const originalEnv = { ...process.env };

	beforeEach(() => {
		process.env.FB_PAGE_ID = '114752709892205';
		process.env.FB_PAGE_ACCESS_TOKEN = 'test_token_123';
		process.env.FB_API_VERSION = 'v20.0';
	});

	afterEach(() => {
		process.env = { ...originalEnv };
		vi.restoreAllMocks();
	});

	it('handles dry-run mode correctly', async () => {
		const result = await publishToFacebook({
			caption: 'Test caption',
			imageUrl: 'https://example.com/test.jpg',
			published: true,
			dryRun: true
		});

		expect(result.success).toBe(true);
		expect(result.status).toBe('dry_run');
		expect(result.details?.caption).toBe('Test caption');
		expect(result.details?.imageUrl).toBe('https://example.com/test.jpg');
		expect(result.details?.published).toBe(true);
	});

	it('validates scheduled time minimum constraint (>= 10 minutes)', async () => {
		const nowSec = Math.floor(Date.now() / 1000);
		const tooSoon = nowSec + 5 * 60; // 5 mins in future

		const result = await publishToFacebook({
			caption: 'Scheduled test',
			published: false,
			scheduledPublishTime: tooSoon
		});

		expect(result.success).toBe(false);
		expect(result.error).toContain('10 นาที');
	});

	it('validates scheduled time maximum constraint (<= 75 days)', async () => {
		const nowSec = Math.floor(Date.now() / 1000);
		const tooFar = nowSec + 80 * 24 * 3600; // 80 days in future

		const result = await publishToFacebook({
			caption: 'Scheduled test',
			published: false,
			scheduledPublishTime: tooFar
		});

		expect(result.success).toBe(false);
		expect(result.error).toContain('75 วัน');
	});

	it('returns error when FB_PAGE_ID or FB_PAGE_ACCESS_TOKEN is missing', async () => {
		delete process.env.FB_PAGE_ID;
		delete process.env.FB_PAGE_ACCESS_TOKEN;
		vi.resetModules();
		const { publishToFacebook } = await import('./facebookServer');

		const result = await publishToFacebook({
			caption: 'Missing credentials'
		});

		expect(result.success).toBe(false);
		expect(result.error).toContain('missing in server environment');
	});
});
