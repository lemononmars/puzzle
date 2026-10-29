// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { createDiceScene } from './devilDiceScene.js';
import { completionReady } from './devilDiceVisuals.js';
import { move, type State } from './devilDice.js';

// Exercise the real scene sync/render loop, replacing only the GPU and canvas.
const drawing = vi.hoisted(() => ({ events: [] as string[] }));
vi.mock('three', async (importOriginal) => {
	const actual = await importOriginal<typeof import('three')>();
	return {
		...actual,
		WebGLRenderer: class {
			domElement = document.createElement('canvas');
			setPixelRatio() {}
			setSize() {}
			setViewport() {}
			setScissor() {}
			setScissorTest() {}
			clear() {}
			clearDepth() {}
			dispose() {}
			forceContextLoss() {}
			render() {
				drawing.events.push('draw');
			}
		}
	};
});
afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
	drawing.events.length = 0;
});

it('keeps Clear hidden through a late renderer start until the landing frame is drawn', () => {
	let frame: FrameRequestCallback = () => {};
	let renderTime = 0;
	vi.spyOn(performance, 'now').mockImplementation(() => renderTime);
	vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
		frame = callback;
		return 1;
	});
	vi.stubGlobal('cancelAnimationFrame', () => {});
	vi.stubGlobal(
		'ResizeObserver',
		class {
			observe() {}
			disconnect() {}
		}
	);
	vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
		() =>
			new Proxy(
				{
					getImageData: () => ({ data: new Uint8ClampedArray([90, 120, 60, 255]) })
				},
				{ get: (target, key) => (key in target ? target[key as keyof typeof target] : () => {}) }
			) as unknown as CanvasRenderingContext2D
	);
	const host = document.createElement('div');
	let moving = false;
	const view = createDiceScene(host, (value) => {
		moving = value;
		drawing.events.push(`moving:${value}`);
	});
	try {
		const before: State = {
			width: 4,
			height: 4,
			moves: 0,
			cleared: 0,
			score: 0,
			chainSerial: 0,
			player: { x: 0, y: 0, riding: true },
			dice: [
				{ id: 1, x: 0, y: 0, kind: 'normal', top: 3, north: 2, east: 1 },
				...[
					[2, 0],
					[1, 1],
					[2, 1],
					[1, 2],
					[2, 2]
				].map(([x, y], i) => ({
					id: i + 2,
					x,
					y,
					kind: 'normal' as const,
					top: 6,
					north: 2,
					east: 3
				}))
			]
		};
		view.sync(before, false);
		const after = move(before, 'right', false, 100)!;
		expect(after).not.toBeNull();
		// Delay scene synchronization beyond the old input-based deadline.
		renderTime = 1000;
		view.sync(after);
		expect(moving).toBe(true);
		expect(completionReady(after, 1000, 560, moving)).toBe(false);
		renderTime = 1419;
		frame(renderTime);
		expect(completionReady(after, 1419, 560, moving)).toBe(false);
		renderTime = 1420;
		drawing.events.length = 0;
		frame(renderTime);
		expect(moving).toBe(false);
		expect(drawing.events.indexOf('draw')).toBeLessThan(drawing.events.indexOf('moving:false'));
		expect(completionReady(after, 1420, 560, moving)).toBe(true);
	} finally {
		view.dispose();
	}
});
