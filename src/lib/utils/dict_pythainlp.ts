import freqMapRaw from './dict_pythainlp.json?raw';

const freqMap: Record<string, number> = JSON.parse(freqMapRaw);

// Calculate Quartile Cutoffs (Q1, Q2, Q3) from frequency dataset
const freqs = Object.values(freqMap)
	.filter((v): v is number => typeof v === 'number' && v > 0)
	.sort((a, b) => a - b);

export const Q1 = freqs.length > 0 ? freqs[Math.floor(freqs.length * 0.25)] : 0;
export const Q2 = freqs.length > 0 ? freqs[Math.floor(freqs.length * 0.5)] : 0;
export const Q3 = freqs.length > 0 ? freqs[Math.floor(freqs.length * 0.75)] : 0;

export function getWordFrequency(word: string): number {
	if (!word) return 0;
	const clean = word.split(' ')[0];
	const val = freqMap[clean] ?? freqMap[word];
	return typeof val === 'number' ? val : 0;
}

export type FreqTier = {
	label: string;
	color: string;
	icon: string;
};

export function getWordFrequencyTier(freq: number): FreqTier | null {
	if (freq >= Q3)
		return { label: `ใช้บ่อยมาก (≥ ${Q3.toLocaleString()})`, color: 'bg-error', icon: '🔥🔥🔥' };
	if (freq >= Q2)
		return { label: `ใช้บ่อย (≥ ${Q2.toLocaleString()})`, color: 'bg-warning', icon: '🔥🔥' };
	if (freq >= Q1)
		return { label: `ปานกลาง (≥ ${Q1.toLocaleString()})`, color: 'bg-info', icon: '🔥' };
	if (freq > 0)
		return { label: `พบน้อย (< ${Q1.toLocaleString()})`, color: 'bg-base-content/20', icon: '' };
	return null;
}
