import { afterEach, describe, expect, it, vi } from 'vitest';
import { createBackgroundMusic, musicTracks } from './demonDiceMusic.js';
const flush = async () => {
	await Promise.resolve();
	await Promise.resolve();
};
function setup() {
	const track = {
		paused: true,
		loop: false,
		preload: '',
		volume: 1,
		muted: false,
		play: vi.fn(),
		pause: vi.fn(),
		removeAttribute: vi.fn(),
		load: vi.fn()
	};
	track.play.mockImplementation(() => {
		track.paused = false;
		return Promise.resolve();
	});
	track.pause.mockImplementation(() => {
		track.paused = true;
	});
	const Audio = vi.fn(function () {
		return track;
	});
	vi.stubGlobal('Audio', Audio);
	return { track, Audio };
}
afterEach(() => vi.unstubAllGlobals());
describe('Demon Dice background music', () => {
	it('chooses distinct looping music for tutorials and Endless, with no autoplay', () => {
		const { track, Audio } = setup();
		const music = createBackgroundMusic('tutorials');
		music.setActive(true);
		expect(Audio).toHaveBeenCalledWith(musicTracks.tutorials);
		expect(track.loop).toBe(true);
		expect(track.volume).toBeLessThan(0.5);
		expect(track.play).not.toHaveBeenCalled();
		createBackgroundMusic('endless');
		expect(Audio).toHaveBeenLastCalledWith(musicTracks.endless);
		expect(musicTracks.endless).not.toBe(musicTracks.tutorials);
	});
	it('follows mute and game activity after a gesture, then releases playback on disposal', async () => {
		const { track } = setup();
		const music = createBackgroundMusic('endless');
		music.unlock();
		expect(track.play).not.toHaveBeenCalled();
		music.setActive(true);
		await flush();
		expect(track.paused).toBe(false);
		music.setMuted(true);
		expect(track.muted).toBe(true);
		expect(track.paused).toBe(true);
		music.setMuted(false);
		await flush();
		expect(track.paused).toBe(false);
		music.setActive(false);
		expect(track.paused).toBe(true);
		music.setActive(true);
		await flush();
		expect(track.paused).toBe(false);
		music.dispose();
		expect(track.paused).toBe(true);
		expect(track.removeAttribute).toHaveBeenCalledWith('src');
		expect(track.load).toHaveBeenCalledOnce();
		const count = track.play.mock.calls.length;
		music.unlock();
		music.setActive(true);
		expect(track.play).toHaveBeenCalledTimes(count);
	});
	it('retries denied playback on the next interaction without an unhandled rejection', async () => {
		const { track } = setup();
		track.play.mockRejectedValueOnce(new Error('autoplay denied'));
		const music = createBackgroundMusic('tutorials');
		music.setActive(true);
		music.unlock();
		await flush();
		await flush();
		music.unlock();
		await flush();
		expect(track.play).toHaveBeenCalledTimes(2);
		expect(track.paused).toBe(false);
	});
});
