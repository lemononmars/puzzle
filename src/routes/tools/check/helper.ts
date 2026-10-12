const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

export function decode(s: string) {
	if (!s) return '';
	try {
		s = unmask(s);
		// Restore base64 padding '=' if missing
		const paddingNeeded = (4 - (s.length % 4)) % 4;
		s = s + '='.repeat(paddingNeeded);
		return decodeURIComponent(
			atob(s)
				.split('')
				.map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join('')
		);
	} catch (e) {
		console.error('Decode failed:', e);
		return '';
	}
}

export function encode(s: string) {
	if (!s) return '';
	try {
		s = btoa(
			encodeURIComponent(s).replace(
				/%([0-9A-F]{2})/g,
				function toSolidBytes(match: any, p1: string) {
					return String.fromCharCode(parseInt(p1, 16));
				}
			)
		);
		s = s.replace(/=/g, ''); // Strip padding '=' to prevent corruption in mask
		return mask(s);
	} catch (e) {
		console.error('Encode failed:', e);
		return '';
	}
}

function mask(s: string) {
	s = s.replace(/\+/g, '-').replace(/\//g, '_');
	return s
		.split('')
		.map((x, index) => {
			return str.charAt((str.indexOf(x) + index) % 64);
		})
		.join('');
}

function unmask(s: string) {
	s = s
		.split('')
		.map((x, index) => {
			return str.charAt((str.indexOf(x) - index + 64) % 64);
		})
		.join('');
	return s.replace(/\-/g, '+').replace(/\_/g, '/');
}
