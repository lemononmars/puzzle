const FB_API_VERSION = process.env.FB_API_VERSION || 'v20.0';
const FB_PAGE_ID = process.env.FB_PAGE_ID || '';
const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN || '';

export interface FacebookPublishOptions {
	caption: string;
	imageUrl?: string;
	published?: boolean;
	scheduledPublishTime?: number; // Unix timestamp in seconds
	dryRun?: boolean;
}

export interface FacebookPublishResult {
	success: boolean;
	id?: string;
	post_id?: string;
	status?: string;
	error?: string;
	details?: any;
}

let cachedPageToken: { pageId: string; token: string } | null = null;

export async function getEffectivePageToken(
	pageId: string,
	rawToken: string
): Promise<{ pageId: string; token: string }> {
	if (cachedPageToken && cachedPageToken.pageId === pageId) {
		return cachedPageToken;
	}

	try {
		const meRes = await fetch(
			`https://graph.facebook.com/${FB_API_VERSION}/me?access_token=${encodeURIComponent(
				rawToken
			)}&fields=id,name`
		);
		const meData = await meRes.json();

		if (String(meData.id) === String(pageId)) {
			cachedPageToken = { pageId, token: rawToken };
			return cachedPageToken;
		}

		const accRes = await fetch(
			`https://graph.facebook.com/${FB_API_VERSION}/me/accounts?access_token=${encodeURIComponent(
				rawToken
			)}&limit=100`
		);
		const accData = await accRes.json();
		const pages: Array<{ id: string; name?: string; access_token?: string }> = accData.data || [];

		const matched = pages.find((p) => String(p.id) === String(pageId));
		if (matched && matched.access_token) {
			cachedPageToken = { pageId: matched.id, token: matched.access_token };
			return cachedPageToken;
		}

		// Fuzzy match by name if exact ID didn't match
		const fuzzy = pages.find(
			(p) =>
				p.name &&
				(p.name.toLowerCase().includes('codebreaker') ||
					p.name.toLowerCase().includes('code breaker'))
		);
		if (fuzzy && fuzzy.access_token) {
			cachedPageToken = { pageId: fuzzy.id, token: fuzzy.access_token };
			return cachedPageToken;
		}
	} catch (err) {
		console.warn('Facebook token resolution error:', err);
	}

	return { pageId, token: rawToken };
}

export async function publishToFacebook(
	options: FacebookPublishOptions
): Promise<FacebookPublishResult> {
	const pageId = FB_PAGE_ID;
	const rawToken = FB_PAGE_ACCESS_TOKEN;

	if (!pageId || !rawToken) {
		return {
			success: false,
			error: 'FB_PAGE_ID or FB_PAGE_ACCESS_TOKEN is missing in server environment.'
		};
	}

	if (options.dryRun) {
		return {
			success: true,
			status: 'dry_run',
			id: 'mock_fb_post_id',
			details: {
				pageId,
				caption: options.caption,
				imageUrl: options.imageUrl,
				published: options.published ?? true,
				scheduledPublishTime: options.scheduledPublishTime
			}
		};
	}

	const { pageId: realPageId, token: effectiveToken } = await getEffectivePageToken(
		pageId,
		rawToken
	);

	const isScheduled = options.published === false && !!options.scheduledPublishTime;

	if (isScheduled && options.scheduledPublishTime) {
		const nowSec = Math.floor(Date.now() / 1000);
		const minAllowed = nowSec + 10 * 60; // 10 minutes
		const maxAllowed = nowSec + 75 * 24 * 3600; // 75 days

		if (options.scheduledPublishTime < minAllowed) {
			return {
				success: false,
				error:
					'เวลาที่ตั้งเผยแพร่ต้องอยู่ล่วงหน้าอย่างน้อย 10 นาที (Scheduled time must be at least 10 minutes in the future)'
			};
		}
		if (options.scheduledPublishTime > maxAllowed) {
			return {
				success: false,
				error:
					'เวลาที่ตั้งเผยแพร่ต้องไม่เกิน 75 วันล่วงหน้า (Scheduled time cannot exceed 75 days in the future)'
			};
		}
	}

	try {
		if (options.imageUrl) {
			// Photo post
			const url = `https://graph.facebook.com/${FB_API_VERSION}/${realPageId}/photos`;
			const params = new URLSearchParams();
			params.append('access_token', effectiveToken);
			params.append('caption', options.caption);
			params.append('url', options.imageUrl);

			if (options.published === false) {
				params.append('published', 'false');
				if (options.scheduledPublishTime) {
					params.append('scheduled_publish_time', String(options.scheduledPublishTime));
				}
			} else {
				params.append('published', 'true');
			}

			const res = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: params.toString()
			});

			const data = await res.json();
			if (!res.ok || data.error) {
				return {
					success: false,
					error: data.error?.message || 'Failed to post photo to Facebook',
					details: data
				};
			}

			return {
				success: true,
				id: data.id,
				post_id: data.post_id || data.id,
				status:
					options.published === false
						? options.scheduledPublishTime
							? 'scheduled'
							: 'draft'
						: 'published',
				details: data
			};
		} else {
			// Feed / Status post
			const url = `https://graph.facebook.com/${FB_API_VERSION}/${realPageId}/feed`;
			const params = new URLSearchParams();
			params.append('access_token', effectiveToken);
			params.append('message', options.caption);

			if (options.published === false) {
				params.append('published', 'false');
				if (options.scheduledPublishTime) {
					params.append('scheduled_publish_time', String(options.scheduledPublishTime));
				} else {
					params.append('unpublished_content_type', 'DRAFT');
				}
			} else {
				params.append('published', 'true');
			}

			const res = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: params.toString()
			});

			const data = await res.json();
			if (!res.ok || data.error) {
				return {
					success: false,
					error: data.error?.message || 'Failed to post message to Facebook',
					details: data
				};
			}

			return {
				success: true,
				id: data.id,
				post_id: data.id,
				status:
					options.published === false
						? options.scheduledPublishTime
							? 'scheduled'
							: 'draft'
						: 'published',
				details: data
			};
		}
	} catch (err: any) {
		return {
			success: false,
			error: err?.message || 'Network error while contacting Facebook Graph API'
		};
	}
}
