export type MusicMode = 'tutorials' | 'puzzles' | 'endless';

export const musicTracks = {
	tutorials: '/audio/demon-dice/tutorial-garden.mp3',
	puzzles: '/audio/demon-dice/tutorial-garden.mp3',
	endless: '/audio/demon-dice/endless-twilight.mp3'
} as const;

/** One loop per mounted game. Playback requires an explicit user gesture. */
export function createBackgroundMusic(mode: MusicMode) {
	const track = new Audio(musicTracks[mode]);
	track.loop = true;
	track.preload = 'none';
	track.volume = 0.32;
	let unlocked = false;
	let active = false;
	let muted = false;
	let disposed = false;
	let pending = false;

	const sync = () => {
		if (disposed) return;
		if (!unlocked || !active || muted) {
			track.pause();
			return;
		}
		if (!track.paused || pending) return;
		pending = true;
		void track
			.play()
			.then(() => {
				pending = false;
				if (disposed || !active || muted) track.pause();
			})
			.catch(() => {
				// A later gesture can retry if the browser denied or interrupted playback.
				pending = false;
			});
	};
	return {
		unlock() {
			unlocked = true;
			sync();
		},
		setActive(value: boolean) {
			active = value;
			sync();
		},
		setMuted(value: boolean) {
			muted = value;
			track.muted = value;
			sync();
		},
		dispose() {
			disposed = true;
			track.pause();
			track.removeAttribute('src');
			track.load();
		}
	};
}
