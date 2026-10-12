const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

export function decode(s: string) {
	s = unmask(s);
	return decodeURIComponent(
		atob(s)
			.split('')
			.map(function (c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join('')
	);
}

export function encode(s: string) {
	s = btoa(
		encodeURIComponent(s).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match: any, p1: string) {
			return String.fromCharCode(parseInt(p1, 16));
		})
	);
	return mask(s);
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
