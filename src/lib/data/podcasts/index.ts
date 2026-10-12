import type { PodcastEpisodeData } from '#lib/types/podcast.js';
import { ep1 } from './ep1';
import { ep2 } from './ep2';
import { ep3 } from './ep3';
import { ep4 } from './ep4';
import { ep5 } from './ep5';
import { ep6 } from './ep6';
import { ep7 } from './ep7';
import { ep8 } from './ep8';
import { ep9 } from './ep9';
import { ep10 } from './ep10';
import { ep11 } from './ep11';
import { ep12 } from './ep12';

export const podcasts: PodcastEpisodeData[] = [
	ep1,
	ep2,
	ep3,
	ep4,
	ep5,
	ep6,
	ep7,
	ep8,
	ep9,
	ep10,
	ep11,
	ep12
];

export function getPodcastById(id: string): PodcastEpisodeData | undefined {
	const normalized = id.toLowerCase().trim();
	return podcasts.find(
		(p) => p.id.toLowerCase() === normalized || `ep${p.epNumber}` === normalized
	);
}
