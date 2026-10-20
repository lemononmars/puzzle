class e {
	static t = [
		{ color: 'green', ms: 1600 },
		{ color: 'dark', ms: 325 },
		{ color: 'yellow', ms: 1050 },
		{ color: 'dark', ms: 325 },
		{ color: 'red', ms: 1375 },
		{ color: 'dark', ms: 325 }
	];
	static o = 15e3;
	static i = 650;
	static l = 10;
	static u = 2e3;
	constructor() {
		((this.m = 0), (this.h = 0), (this.p = 0), (this.G = 0), (this.v = !1), (this.C = ''));
	}
	S() {
		let t = Math.min(this.m, e.o - 0.001) % 5e3;
		for (const r of e.t) {
			if (t < r.ms) return { ...r, remaining: r.ms - t };
			t -= r.ms;
		}
	}
	get k() {
		return this.m < this.G;
	}
	get T() {
		return !this.v && this.m >= this.p;
	}
	L(e) {
		((this.v = !0), (this.C = e));
	}
	R() {
		if (!this.T) return 'busy';
		const t = this.S().color;
		return 'red' === t || 'yellow' === t
			? ((this.G = this.m + e.u), (this.p = this.G), 'police')
			: (this.h++, (this.p = this.m + e.i), 'drive');
	}
	B(t) {
		this.v ||
			!Number.isFinite(t) ||
			t <= 0 ||
			((this.m = Math.min(e.o, this.m + t)), this.m >= e.o && this.L('timeout'));
	}
	get N() {
		return this.v && 'timeout' === this.C && this.h >= e.l;
	}
}
('undefined' != typeof module && (module.exports = e),
	(function (e) {
		const t = {
			createRecordsClient: function ({
				storage: e,
				request: t,
				uuid: r,
				enabled: a = !0,
				now: n = Date.now
			}) {
				const s = 'short-cut-records-v2-';
				let o = null,
					c = null,
					i = null,
					l = 0,
					u = null;
				const d = (t) => {
						try {
							return e?.getItem(s + t);
						} catch {
							return null;
						}
					},
					g = (t, r) => {
						try {
							return (e?.setItem(s + t, r), d(t) === r);
						} catch {
							return !1;
						}
					};
				function m() {
					if (o) return o;
					const e = d('id');
					if (/^[a-f0-9-]{36}$/i.test(e || '')) return (o = e);
					const t = r();
					return g('id', t) ? (o = t) : null;
				}
				async function h(e, r) {
					if (!a || d('cleared-run') === e) return;
					const n = m(),
						s = Number(r);
					if (!(!n || !e || !Number.isInteger(s) || s < 10 || s > 15))
						try {
							(await t('POST', { id: n, run: e, action: 'clear', proof: 's-4c91a7e2', score: s }),
								g('cleared-run', e),
								g('pending-clear', '0'),
								g('pending-run', ''),
								g('pending-score', ''),
								(i = null));
						} catch {}
				}
				return {
					recover() {
						if ('1' === d('pending-clear')) return h(d('pending-run'), d('pending-score'));
					},
					async start() {
						if (!a) return;
						const e = m();
						if (e) {
							((c = r()), g('active-run', c));
							try {
								(await t('POST', { id: e, run: c, action: 'play' }), (i = null));
							} catch {}
						}
					},
					clear(e) {
						const t = c || d('active-run');
						if (t)
							return (
								g('pending-clear', '1'),
								g('pending-run', t),
								g('pending-score', String(e)),
								h(t, e)
							);
					},
					async summary() {
						if (!a) throw new Error('preview');
						if (i && n() - l < 6e4) return i;
						if (u) return u;
						u = (async () => {
							const e = await t('GET'),
								r = e?.scores;
							if (
								!e ||
								!Number.isSafeInteger(e.plays) ||
								!Number.isSafeInteger(e.clears) ||
								e.plays < 0 ||
								e.clears < 0 ||
								e.clears > e.plays ||
								!r ||
								[10, 11, 12, 13, 14, 15].some((e) => !Number.isSafeInteger(r[e]) || r[e] < 0) ||
								[10, 11, 12, 13, 14, 15].reduce((e, t) => e + r[t], 0) !== e.clears
							)
								throw new Error('Invalid records');
							return (
								(i = { ...e, rate: e.plays ? Math.round((e.clears / e.plays) * 1e3) / 10 : 0 }),
								(l = n()),
								i
							);
						})();
						try {
							return await u;
						} finally {
							u = null;
						}
					}
				};
			},
			request: async function (e, t) {
				const r = new AbortController(),
					a = setTimeout(() => r.abort(), 7e3);
				try {
					const a = await fetch('records.php', {
						method: e,
						signal: r.signal,
						credentials: 'same-origin',
						...('POST' === e
							? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(t) }
							: {})
					});
					if (!a.ok || !a.headers.get('Content-Type')?.includes('application/json'))
						throw new Error('Records unavailable');
					return 'POST' === e ? null : await a.json();
				} finally {
					clearTimeout(a);
				}
			}
		};
		('undefined' != typeof module && module.exports && (module.exports = t),
			e && (e.SignalRecords = t));
	})('undefined' != typeof window ? window : null),
	(() => {
		'use strict';
		const t = (e) => document.getElementById(e),
			r = (e) => new TextDecoder().decode(Uint8Array.from(atob(e), (e) => e.charCodeAt(0))),
			a = r('aHR0cHM6Ly9zYWppcW9vay5qcC9nYW1lL3Nob3J0Yy8='),
			n = r('I3Nob3J0Y3V0'),
			s = {
				ja: {
					instruction: '\u9ec4\u8d64\u306e\u6642\u306f\u6b62\u307e\u308d\u3046\uff01',
					ready: '\u6e96\u5099\u304c\u3067\u304d\u305f\u3089\u3001\u30b9\u30bf\u30fc\u30c8\u3002',
					paused: '\u4e00\u6642\u505c\u6b62\u4e2d',
					police: '\u30d1\u30c8\u30ab\u30fc\u306b\u9023\u308c\u3066\u3044\u304b\u308c\u305f\u3002',
					signalDark: '\u4fe1\u53f7\u6a5f\uff1a\u6d88\u706f',
					signals: {
						red: '\u4fe1\u53f7\u6a5f\uff1a\u8d64',
						yellow: '\u4fe1\u53f7\u6a5f\uff1a\u9ec4',
						green: '\u4fe1\u53f7\u6a5f\uff1a\u9752'
					},
					start: '\u30b9\u30bf\u30fc\u30c8',
					restart: '\u30ea\u30b9\u30bf\u30fc\u30c8',
					again: '\u3082\u3046\u4e00\u5ea6\u6311\u6226\u3059\u308b',
					settings: '\u8a2d\u5b9a',
					settingsClose: '\u8a2d\u5b9a\u3092\u9589\u3058\u308b',
					language: '\u8868\u793a\u8a00\u8a9e',
					volume: 'SE\u97f3\u91cf',
					mute: '\u30df\u30e5\u30fc\u30c8',
					unmute: '\u30df\u30e5\u30fc\u30c8\u89e3\u9664',
					links: '\u95a2\u9023\u30ea\u30f3\u30af',
					hint: '\u30d2\u30f3\u30c8\u30fb\u89e3\u8aac \u2197',
					hintCopy:
						'\u3059\u3079\u3066\u306eWEB\u8b0e\u306e\u30d2\u30f3\u30c8\u3068\u89e3\u8aac\u3092\u3001\u3053\u306e\u6709\u6599\u8a18\u4e8b\u3072\u3068\u3064\u3067\u697d\u3057\u3081\u307e\u3059\u3002',
					games: '\u4ed6\u306e\u30b2\u30fc\u30e0 \u2197',
					settingsNote:
						'\u3053\u306e\u753b\u9762\u306e\u8a2d\u5b9a\u3001\u5185\u5bb9\u306f\u8b0e\u89e3\u304d\u3068\u306f\u95a2\u4fc2\u3042\u308a\u307e\u305b\u3093\u3002',
					records: '\u304d\u308d\u304f',
					recordsClose: '\u304d\u308d\u304f\u3092\u9589\u3058\u308b',
					plays: '\u7dcf\u30d7\u30ec\u30a4\u56de\u6570',
					clears: '\u30af\u30ea\u30a2\u56de\u6570',
					rate: '\u30af\u30ea\u30a2\u7387',
					breakdown: '\u30af\u30ea\u30a2\u8a73\u7d30',
					unclassified: '\u5185\u8a33\u8a18\u9332\u524d',
					people: '\u4eba',
					scoreUnit: '\u53f0',
					recordsNote:
						'\u3053\u306e\u753b\u9762\u306f\u8b0e\u89e3\u304d\u3068\u306f\u95a2\u4fc2\u3042\u308a\u307e\u305b\u3093\u3002',
					loading: '\u8aad\u307f\u8fbc\u307f\u4e2d\u2026',
					recordsError:
						'\u8a18\u9332\u3092\u53d6\u5f97\u3067\u304d\u307e\u305b\u3093\u3067\u3057\u305f\u3002\u6642\u9593\u3092\u304a\u3044\u3066\u304a\u8a66\u3057\u304f\u3060\u3055\u3044\u3002',
					recordsPreview:
						'\u5168\u4f53\u306e\u8a18\u9332\u306f\u516c\u958b\u5f8c\u306b\u5229\u7528\u3067\u304d\u307e\u3059\u3002\u30ed\u30fc\u30ab\u30eb\u7248\u306e\u30d7\u30ec\u30a4\u306f\u96c6\u8a08\u3055\u308c\u307e\u305b\u3093\u3002',
					resultClose: '\u7d50\u679c\u3092\u9589\u3058\u308b',
					unit: '\u53f0',
					share: 'X\u306b\u8a18\u9332\u3092\u30b7\u30a7\u30a2',
					failResult: r('5a6J5YWo56ys5LiA44Gn44GZ44GL77yf'),
					failShare: r('56eB44Gv5a6J5YWo56ys5LiA'),
					scores: {
						10: r('6KaL5LqL44CB44OO44Or44Oe44KS6YGU5oiQ44GX44G+44GX44Gf77yB'),
						11: r('6KaL5LqL44CB44GT44Gu44Ky44O844Og44KS55CG6Kej44GX44G+44GX44Gf77yB'),
						12: r('6KaL5LqL44CB5pmC6ZaT44KS5a6M55Kn44Gr5L2/44GE44GT44Gq44GX44Gf77yB'),
						13: r('6KaL5LqL44CB5YWo44Gm44Gu5pmC6ZaT44KS5a6M55Kn44Gr5L2/44GE44GT44Gq44GX44Gf77yB'),
						14: r('6KaL5LqL44CB5pys5b2T44Gr5Lq66ZaT44Gg44KN44GG44GL44CC'),
						15: r('5pyA6auY5Yiw6YGU54K577yB5Lq66ZaT44KS44KE44Cc44KB44Gf77yB')
					},
					shareLead: (e) =>
						r(
							'V0VC6KyO44CMc2hvcnQgY3V044CN44Gne3Njb3JlfeWPsOOBrui7iuOCkumAmuOBl+OBvuOBl+OBn++8gQ=='
						).replace('{score}', e),
					clock: '\u6b8b\u308a\u6642\u9593\u306e\u6642\u8a08',
					cars: '\u901a\u3057\u305f\u8eca',
					scene: '\u9053\u8def\u3068\u4fe1\u53f7\u6a5f'
				},
				en: {
					instruction: 'Stop at yellow and red!',
					ready: 'Ready? Press START.',
					paused: 'Paused',
					police: 'The police took the car away.',
					signalDark: 'Traffic light: off',
					signals: {
						red: 'Traffic light: red',
						yellow: 'Traffic light: yellow',
						green: 'Traffic light: green'
					},
					start: 'START',
					restart: 'RESTART',
					again: 'TRY AGAIN',
					settings: 'Settings',
					settingsClose: 'Close settings',
					language: 'Language',
					volume: 'SE volume',
					mute: 'Mute',
					unmute: 'Unmute',
					links: 'Related links',
					hint: 'Hints & solution \u2197',
					hintCopy: 'Enjoy hints and solutions for every web puzzle in this article.',
					games: 'Other games \u2197',
					settingsNote: 'This screen and its settings are unrelated to the puzzle.',
					records: 'Records',
					recordsClose: 'Close records',
					plays: 'Total plays',
					clears: 'Clears',
					rate: 'Clear rate',
					breakdown: 'Clear details',
					unclassified: 'Before breakdown',
					people: 'players',
					scoreUnit: 'cars',
					recordsNote: 'This screen is unrelated to the puzzle.',
					loading: 'Loading\u2026',
					recordsError: 'Could not load the records. Please try again later.',
					recordsPreview:
						'Global records will be available after publication. Local plays are not counted.',
					resultClose: 'Close result',
					unit: 'cars',
					share: 'Share your score on X',
					failResult: r('U2FmZXR5IGZpcnN0Pw=='),
					failShare: r('SSBwdXQgc2FmZXR5IGZpcnN0Lg=='),
					scores: {
						10: r('R3JlYXQgam9i4oCUeW91IGNvbXBsZXRlZCB0aGUgcXVvdGEh'),
						11: r('R3JlYXQgam9i4oCUeW91IHVuZGVyc3Rvb2QgdGhlIGdhbWUh'),
						12: r('R3JlYXQgam9i4oCUeW91IG1hc3RlcmVkIHRoZSB0aW1pbmch'),
						13: r('R3JlYXQgam9i4oCUeW91IG1hc3RlcmVkIGV2ZXJ5IG1vbWVudCE='),
						14: r('R3JlYXQgam9i4oCUYXJlIHlvdSByZWFsbHkgaHVtYW4/'),
						15: r('VGhlIGFic29sdXRlIGxpbWl0ISBHb29kYnllLCBodW1hbml0eSE=')
					},
					shareLead: (e) =>
						r(
							'V2ViIHB1enpsZSDigJxzaG9ydCBjdXTigJ06IEkgZ290IHtzY29yZX0gY2FycyB0aHJvdWdoIQ=='
						).replace('{score}', e),
					clock: 'Remaining time',
					cars: 'Cars through',
					scene: 'Road and traffic light'
				}
			};
		((s.ja.plays = '\u6311\u6226\u3055\u308c\u305f\u56de\u6570'),
			(s.en.plays = 'Attempts'),
			(s.ja.people = '\u56de'),
			(s.en.people = 'times'));
		let o,
			c = new e(),
			i = !1,
			l = !1,
			u = 0,
			d = 0,
			g = 0.65,
			m = !1,
			h = 'ja',
			p = 0,
			y = 0,
			f = 0;
		try {
			const e = localStorage.getItem('signal-se-volume');
			(null !== e && Number.isFinite(Number(e)) && (g = Math.max(0, Math.min(1, Number(e)))),
				(m = '1' === localStorage.getItem('signal-se-muted')),
				(h = 'en' === localStorage.getItem('signal-language') ? 'en' : 'ja'));
		} catch {}
		const b = () => s[h];
		function w(e) {
			try {
				const t = window.AudioContext || window.webkitAudioContext;
				if (!t || 0 === g || m) return;
				((o ||= new t()), o.resume().catch(() => {}));
				const r = o.currentTime;
				('clear' === e
					? [523, 659, 784]
					: 'stop' === e
						? [180]
						: 'police' === e
							? [650, 480, 650, 480]
							: [540]
				).forEach((e, t) => {
					const a = o.createOscillator(),
						n = o.createGain();
					((a.type = 'sine'),
						(a.frequency.value = e),
						n.gain.setValueAtTime(0.055 * g, r + 0.1 * t),
						n.gain.exponentialRampToValueAtTime(1e-4, r + 0.1 * t + 0.13),
						a.connect(n).connect(o.destination),
						a.start(r + 0.1 * t),
						a.stop(r + 0.1 * t + 0.14));
				});
			} catch {}
		}
		function G() {
			const e = t('mute');
			(e.setAttribute('aria-pressed', String(m)), (e.textContent = m ? b().unmute : b().mute));
		}
		((t('volume').value = 100 * g), (t('volume-value').textContent = `${Math.round(100 * g)}%`));
		let v = null;
		try {
			v = localStorage;
		} catch {}
		const C =
				/^https?:$/.test(location.protocol) &&
				!['localhost', '127.0.0.1', '[::1]'].includes(location.hostname),
			S = SignalRecords.createRecordsClient({
				storage: v,
				request: SignalRecords.request,
				uuid: () =>
					crypto.randomUUID
						? crypto.randomUUID()
						: `${crypto.getRandomValues(new Uint32Array(1))[0].toString(16).padStart(8, '0')}-0000-4000-8000-${crypto.getRandomValues(new Uint32Array(2)).join('').slice(0, 12).padEnd(12, '0')}`,
				enabled: C
			});
		S.recover();
		const k = document.querySelector('.scene'),
			T = document.createElement('div');
		function L() {
			const e = b();
			((document.documentElement.lang = h),
				(t('instruction').textContent = e.instruction),
				(t('settings-title').textContent = e.settings),
				t('settings-close').setAttribute('aria-label', e.settingsClose),
				(t('language-label').textContent = e.language),
				(t('volume-label-text').textContent = e.volume),
				t('settings-links').setAttribute('aria-label', e.links),
				(t('hint-link').textContent = e.hint),
				(t('hint-copy').textContent = e.hintCopy),
				(t('games-link').textContent = e.games),
				(t('settings-note').textContent = e.settingsNote),
				(t('records-title').textContent = e.records),
				t('records-close').setAttribute('aria-label', e.recordsClose),
				(t('records-plays-label').textContent = e.plays),
				(t('records-clears-label').textContent = e.clears),
				(t('records-rate-label').textContent = e.rate),
				(t('records-breakdown-title').textContent = e.breakdown),
				(t('records-unclassified-label').textContent = e.unclassified),
				document
					.querySelectorAll('[data-score-label]')
					.forEach((t) => (t.textContent = `${t.dataset.scoreLabel}${e.scoreUnit}`)),
				document.querySelectorAll('[data-people-unit]').forEach((t) => (t.textContent = e.people)),
				(t('records-note').textContent = e.recordsNote),
				t('result-close').setAttribute('aria-label', e.resultClose),
				(t('score-unit').textContent = e.unit),
				(t('result-unit').textContent = e.unit),
				(t('share').textContent = e.share),
				(t('retry').textContent = e.again),
				(t('start').textContent = c.v ? e.again : e.start),
				(t('drive').textContent = 'GO!'),
				(t('restart').textContent = e.restart),
				document
					.querySelectorAll('.language-button')
					.forEach((e) => e.setAttribute('aria-pressed', String(e.dataset.language === h))),
				document.querySelector('.clock').setAttribute('aria-label', e.clock),
				document.querySelector('.scoreboard>div:last-child').setAttribute('aria-label', e.cars),
				k.setAttribute('aria-label', e.scene),
				G(),
				R());
		}
		function R() {
			((t('clock-hand').style.transform = `rotate(${(c.m / e.o) * 360}deg)`),
				(t('count').textContent = `${c.h}/${e.l}`));
			const r = i || c.v ? c.S().color : 'red';
			document
				.querySelectorAll('.lamp')
				.forEach((e) => e.classList.toggle('on', e.classList.contains(r)));
			const a = b();
			(document
				.querySelector('.traffic-light')
				.setAttribute('aria-label', 'dark' === r ? a.signalDark : a.signals[r]),
				(t('drive').disabled = !c.T || l));
			const n = c.k && !c.v;
			((T.hidden = !n), k.classList.toggle('detaining', n), k.classList.toggle('paused', l));
			const s = i ? (l ? a.paused : n ? a.police : '') : c.v ? '' : a.ready;
			t('status').textContent !== s && (t('status').textContent = s);
		}
		function B() {
			((i = !1), cancelAnimationFrame(d), R());
			const e = c.N;
			(t('result').classList.toggle('clear', e),
				(t('result-title').textContent = e ? 'CLEAR' : 'TIME UP'),
				(t('result-count').textContent = c.h));
			const r = b(),
				s = e ? ((o = c.h), b().scores[Math.min(15, Math.max(10, o))]) : r.failResult;
			var o;
			t('result-message').textContent = s;
			const l = e ? s : r.failShare,
				u = `${r.shareLead(c.h)}\n${l}\n\n${a}\n\n${n}`;
			((t('share').href = 'https://x.com/intent/tweet?text=' + encodeURIComponent(u)),
				(t('status').textContent = ''),
				(t('play-actions').hidden = !0),
				(t('start').hidden = !1),
				(t('start').textContent = r.again),
				clearTimeout(p),
				t('result').classList.add('guarded'),
				t('share').setAttribute('aria-disabled', 'true'),
				(t('retry').disabled = !0),
				t('result').showModal(),
				(p = setTimeout(() => {
					(t('result').classList.remove('guarded'),
						t('share').removeAttribute('aria-disabled'),
						(t('retry').disabled = !1));
				}, 1200)),
				e && S.clear(c.h),
				w(e ? 'clear' : 'stop'));
		}
		function N(e = performance.now()) {
			i && !l && (c.B(e - u), (u = e), R(), c.v && B());
		}
		function X(e) {
			(N(e), i && !l && (d = requestAnimationFrame(X)));
		}
		function I() {
			(cancelAnimationFrame(d),
				(c = new e()),
				(i = !0),
				(l = !1),
				S.start(),
				document.querySelectorAll('.passing').forEach((e) => e.remove()),
				(t('start').hidden = !0),
				(t('play-actions').hidden = !1),
				(u = performance.now()),
				R(),
				(d = requestAnimationFrame(X)));
		}
		function Y() {
			i && !l && (N(), i && ((l = !0), cancelAnimationFrame(d), R()));
		}
		function A() {
			!i ||
				!l ||
				t('settings').open ||
				t('records').open ||
				document.hidden ||
				((l = !1), (u = performance.now()), R(), (d = requestAnimationFrame(X)));
		}
		((T.className = 'escort'),
			(T.hidden = !0),
			(T.innerHTML =
				'<div class="car detained"><span></span></div><div class="car police"><span></span><i class="siren"></i></div>'),
			document.getElementById('cars').append(T),
			t('start').addEventListener('click', () => {
				(w('car'), I());
			}),
			t('retry').addEventListener('click', () => {
				(t('result').close(), I());
			}),
			t('drive').addEventListener('click', function () {
				if ((N(), !i || l)) return;
				const e = c.R();
				('drive' === e &&
					((function () {
						const e = document.createElement('div');
						((e.className = 'car passing'),
							(e.innerHTML = '<span></span>'),
							t('cars').append(e),
							e.addEventListener('animationend', () => e.remove(), { once: !0 }));
					})(),
					w('car')),
					'police' === e && w('police'),
					R(),
					c.v && B());
			}),
			t('restart').addEventListener('click', I),
			t('drive').addEventListener('keydown', (e) => {
				e.repeat && [' ', 'Enter'].includes(e.key) && e.preventDefault();
			}),
			t('settings-open').addEventListener('click', () => {
				(Y(), t('settings').showModal());
			}),
			t('settings').addEventListener('close', () => {
				((y = 0), A());
			}),
			t('records').addEventListener('close', A),
			document
				.querySelectorAll('[data-close]')
				.forEach((e) => e.addEventListener('click', () => t(e.dataset.close).close())),
			document.querySelectorAll('dialog').forEach((e) =>
				e.addEventListener('click', (t) => {
					const r = e.getBoundingClientRect();
					t.target === e &&
						(t.clientX < r.left ||
							t.clientX > r.right ||
							t.clientY < r.top ||
							t.clientY > r.bottom) &&
						e.close();
				})
			),
			document.addEventListener('visibilitychange', () => (document.hidden ? Y() : A())),
			window.addEventListener('blur', Y),
			window.addEventListener('focus', A),
			t('mute').addEventListener('click', () => {
				m = !m;
				try {
					localStorage.setItem('signal-se-muted', m ? '1' : '0');
				} catch {}
				(G(),
					y++,
					8 === y
						? ((y = 0),
							(async function () {
								const e = ++f,
									r = b(),
									a = 'ja' === h ? 'ja-JP' : 'en-US';
								((t('records-totals').hidden = !0),
									(t('records-breakdown').hidden = !0),
									(t('records-status').textContent = r.loading),
									t('settings').open && t('settings').close(),
									t('records').showModal(),
									Y());
								try {
									const r = await S.summary();
									if (e !== f || !t('records').open) return;
									((t('records-plays').textContent = r.plays.toLocaleString(a)),
										(t('records-clears').textContent = r.clears.toLocaleString(a)),
										(t('records-rate').textContent = `${r.rate.toFixed(1)}%`));
									let n = 0;
									for (let e = 10; e <= 15; e++) {
										const s = r.scores[e];
										((n += s), (t(`records-score-${e}`).textContent = s.toLocaleString(a)));
									}
									const s = Math.max(0, r.clears - n);
									((t('records-unclassified').textContent = s.toLocaleString(a)),
										(t('records-unclassified-row').hidden = 0 === s),
										(t('records-status').textContent = ''),
										(t('records-totals').hidden = !1),
										(t('records-breakdown').hidden = !1));
								} catch {
									e === f &&
										(t('records-status').textContent = C ? r.recordsError : r.recordsPreview);
								}
							})())
						: m || w('car'));
			}),
			document.addEventListener('click', (e) => {
				e.target.closest('#mute') || (y = 0);
			}),
			document.querySelectorAll('.language-button').forEach((e) =>
				e.addEventListener('click', () => {
					h = e.dataset.language;
					try {
						localStorage.setItem('signal-language', h);
					} catch {}
					(L(), w('car'));
				})
			),
			t('volume').addEventListener('input', () => {
				((g = Number(t('volume').value) / 100),
					(m = !1),
					G(),
					(t('volume-value').textContent = `${Math.round(100 * g)}%`));
				try {
					(localStorage.setItem('signal-se-volume', String(g)),
						localStorage.setItem('signal-se-muted', '0'));
				} catch {}
			}),
			t('volume').addEventListener('change', () => w('car')),
			L());
	})(),
	(() => {
		'use strict';
		const e = (e) => e.preventDefault();
		(document.addEventListener('contextmenu', e, { capture: !0 }),
			document.addEventListener('dragstart', e, { capture: !0 }),
			document.addEventListener(
				'selectstart',
				(t) => {
					t.target.closest('input') || e(t);
				},
				{ capture: !0 }
			),
			['gesturestart', 'gesturechange', 'gestureend'].forEach((t) =>
				document.addEventListener(t, e, { capture: !0, passive: !1 })
			),
			document.addEventListener(
				'keydown',
				(e) => {
					const t = e.key.toLowerCase(),
						r = (e.ctrlKey && !e.shiftKey && 'u' === t) || (e.metaKey && e.altKey && 'u' === t),
						a =
							'F12' === e.key ||
							(((e.ctrlKey && e.shiftKey) || (e.metaKey && e.altKey)) &&
								['i', 'j', 'c'].includes(t));
					(r || a) && (e.preventDefault(), e.stopImmediatePropagation());
				},
				{ capture: !0 }
			));
	})());
