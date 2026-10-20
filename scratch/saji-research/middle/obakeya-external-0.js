(() => {
	'use strict';
	const e = (e) => document.querySelector(e),
		t = e('#old-paper'),
		n = e('#answer-panel'),
		a = e('#answer-entry'),
		o = e('#answer-status'),
		r = e('#memo-entry'),
		s = e('#memo-status'),
		i = e('#load-status'),
		c = e('#settings'),
		l = e('#records'),
		d = e('#success'),
		u = { paper: t, answer: n, memo: e('#memo-panel') },
		m = [...document.querySelectorAll('.page-tab')];
	let p = 'paper',
		f = !1,
		v = '',
		y = !1,
		g = !1,
		h = 0,
		w = 0,
		x = 0,
		E = null,
		b = { volume: 65, muted: !1 },
		k = '';
	try {
		((k = localStorage.getItem('obakeya-player-v1') || ''),
			/^[a-f0-9-]{36}$/i.test(k) ||
				((k = crypto.randomUUID()), localStorage.setItem('obakeya-player-v1', k)),
			(r.value = localStorage.getItem('bakemoji-memo-v13') || ''));
		const e = JSON.parse(localStorage.getItem('obakeya-sound-v1'));
		(Number.isFinite(e?.volume) && (b.volume = Math.max(0, Math.min(100, e.volume))),
			'boolean' == typeof e?.muted && (b.muted = e.muted));
	} catch {
		k || (k = crypto.randomUUID());
	}
	async function L(e, t = {}) {
		const n = new AbortController(),
			a = setTimeout(() => n.abort(), 8e3);
		try {
			const a = await fetch('./api.php', {
				method: 'POST',
				credentials: 'same-origin',
				cache: 'no-store',
				signal: n.signal,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: e, token: v, ...t })
			});
			if (!a.ok) throw new Error('unavailable');
			return await a.json();
		} finally {
			clearTimeout(a);
		}
	}
	function S() {
		i.textContent = '接続を確認してもう一度お試しください。';
	}
	function C(t) {
		for (const [n, a] of Object.entries(t || {})) {
			const t =
				'v4' === n
					? e('#answer-label')
					: 'v5' === n
						? o
						: 'v6' === n
							? e('#success-title')
							: document.getElementById(n);
			t && 'string' == typeof a && ((t.textContent = a), t.classList.add('veil'));
		}
	}
	function A() {
		((o.textContent = ''), o.classList.remove('veil'));
	}
	function T() {
		try {
			localStorage.setItem('bakemoji-memo-v13', r.value);
		} catch {}
	}
	function I() {
		((e('#volume').value = b.volume),
			(e('#volume-value').textContent = `${b.muted ? 0 : b.volume}%`),
			e('#mute').setAttribute('aria-pressed', String(b.muted)));
		try {
			localStorage.setItem('obakeya-sound-v1', JSON.stringify(b));
		} catch {}
	}
	function q(e = 'tap') {
		if (!b.muted && b.volume)
			try {
				((E ||= new (window.AudioContext || window.webkitAudioContext)()), E.resume());
				const t = E.currentTime,
					n = b.volume / 100,
					a = (e, a, o = 0, r = 'sine', s = 0.05, i = e) => {
						const c = E.createOscillator(),
							l = E.createGain(),
							d = E.createBiquadFilter();
						((c.type = r),
							c.frequency.setValueAtTime(e, t + o),
							c.frequency.exponentialRampToValueAtTime(i, t + o + a),
							(d.type = 'lowpass'),
							(d.frequency.value = 1800),
							l.gain.setValueAtTime(1e-4, t + o),
							l.gain.exponentialRampToValueAtTime(Math.max(2e-4, s * n), t + o + 0.018),
							l.gain.exponentialRampToValueAtTime(1e-4, t + o + a),
							c.connect(d).connect(l).connect(E.destination),
							c.start(t + o),
							c.stop(t + o + a + 0.02),
							(c.onended = () => {
								(c.disconnect(), d.disconnect(), l.disconnect());
							}));
					},
					o = (e, a, o) => {
						const r = E.createBuffer(1, Math.ceil(E.sampleRate * e), E.sampleRate),
							s = r.getChannelData(0);
						let i = 0;
						for (let e = 0; e < s.length; e++)
							((i = (i + 0.08 * (2 * Math.random() - 1)) / 1.08), (s[e] = 3 * i));
						const c = E.createBufferSource(),
							l = E.createBiquadFilter(),
							d = E.createGain();
						((c.buffer = r),
							(l.type = 'bandpass'),
							(l.frequency.value = a),
							(l.Q.value = 0.6),
							d.gain.setValueAtTime(1e-4, t),
							d.gain.exponentialRampToValueAtTime(Math.max(2e-4, o * n), t + 0.025),
							d.gain.exponentialRampToValueAtTime(1e-4, t + e),
							c.connect(l).connect(d).connect(E.destination),
							c.start(),
							(c.onended = () => {
								(c.disconnect(), l.disconnect(), d.disconnect());
							}));
					};
				'paper' === e
					? (o(0.36, 520, 0.13), a(110, 0.3, 0, 'triangle', 0.025, 68))
					: 'purify' === e
						? (o(0.25, 720, 0.09), a(196, 0.55, 0.03, 'sine', 0.025, 146.8))
						: 'wrong' === e
							? (a(82.4, 0.55, 0, 'triangle', 0.04, 61.7), a(87.3, 0.48, 0.05, 'sine', 0.02, 65.4))
							: 'clear' === e
								? [146.8, 220, 293.7].forEach((e, t) => a(e, 1.3, 0.17 * t, 'sine', 0.035))
								: (a(100, 0.15, 0, 'triangle', 0.04, 67), o(0.09, 340, 0.04));
			} catch {}
	}
	async function M(e) {
		if (y && !g && u[e] && e !== p) {
			if ('answer' === e && !f) {
				((g = !0), m.forEach((e) => (e.disabled = !0)));
				try {
					(C((await L('panel')).slots), (i.textContent = ''));
				} catch {
					return void S();
				} finally {
					((g = !1), m.forEach((e) => (e.disabled = !1)));
				}
				f = !0;
			}
			(A(), q('paper'), (p = e));
			for (const [t, n] of Object.entries(u)) {
				const a = t === e;
				((n.inert = !a),
					n.setAttribute('aria-hidden', String(!a)),
					n.classList.toggle('is-visible', a));
			}
			for (const t of m) {
				const n = t.dataset.page === e;
				(t.setAttribute('aria-selected', String(n)), (t.tabIndex = n ? 0 : -1));
			}
			m.find((t) => t.dataset.page === e).focus({ preventScroll: !0 });
		}
	}
	async function V() {
		((e('#record-status').textContent = '読み込み中…'),
			['plays', 'departures', 'completes', 'rate', 'kanta'].forEach(
				(t) => (e('#record-' + t).textContent = '—')
			),
			(e('#record-retry').disabled = !0));
		try {
			const t = await L('records');
			if (
				!['plays', 'departures', 'completes', 'kanta'].every(
					(e) => Number.isSafeInteger(t[e]) && t[e] >= 0
				) ||
				t.departures > t.plays ||
				t.completes > t.plays ||
				!Number.isFinite(t.rate) ||
				t.rate < 0 ||
				t.rate > 100
			)
				throw new Error('invalid');
			(['plays', 'departures', 'completes', 'kanta'].forEach(
				(n) => (e('#record-' + n).textContent = t[n].toLocaleString('ja-JP'))
			),
				(e('#record-rate').textContent = `${t.rate}%`),
				(e('#record-status').textContent = t.preview
					? 'ローカル動作確認用の記録です。公開後はMySQLへ保存されます。'
					: ''));
		} catch {
			e('#record-status').textContent = '記録を取得できませんでした。再読み込みをお試しください。';
		} finally {
			e('#record-retry').disabled = !1;
		}
	}
	function j() {
		window.visualViewport &&
			document.documentElement.style.setProperty(
				'--view-height',
				`${Math.round(window.visualViewport.height)}px`
			);
	}
	(m.forEach((e, t) => {
		(e.addEventListener('click', () => {
			M(e.dataset.page);
		}),
			e.addEventListener('keydown', (e) => {
				if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
				e.preventDefault();
				const n =
					'Home' === e.key
						? 0
						: 'End' === e.key
							? m.length - 1
							: (t + ('ArrowRight' === e.key ? 1 : -1) + m.length) % m.length;
				M(m[n].dataset.page);
			}));
	}),
		r.addEventListener('input', () => {
			(h++, T(), (s.textContent = ''));
		}),
		e('#clear-memo').addEventListener('click', () => {
			(h++, (r.value = ''), T(), (s.textContent = ''), r.focus({ preventScroll: !0 }), q());
		}),
		r.addEventListener('paste', async (e) => {
			const t = e.clipboardData?.getData('text/plain') || '';
			if (!/[\uE000-\uF8FF]/u.test(t)) return;
			if ((e.preventDefault(), !y)) return void S();
			const n = ++h,
				a = r.selectionStart,
				o = r.selectionEnd,
				i = r.value;
			s.textContent = '浄化しています。';
			try {
				const e = await L('purify', { text: t });
				if (n !== h) return;
				if ('string' != typeof e.text) throw new Error('invalid');
				r.value = i.slice(0, a) + e.text + i.slice(o);
				const c = a + e.text.length;
				(r.setSelectionRange(c, c),
					T(),
					(s.textContent = ''),
					q('purify'),
					'string' == typeof e.displayEvent &&
						requestAnimationFrame(() => {
							n === h &&
								'memo' === p &&
								(async function (e, t) {
									for (let t = 0; t < 2; t++)
										try {
											if (!0 === (await L('displayed', { eventId: e })).recordSaved) return;
										} catch {}
									t === h && (s.textContent = '記録の反映を確認できませんでした。');
								})(e.displayEvent, n);
						}));
			} catch {
				n === h && (s.textContent = 'もう一度メモ帳へ貼り付けてください。');
			}
		}),
		a.addEventListener('input', A),
		document.addEventListener(
			'pointerdown',
			(t) => {
				e('#mute').contains(t.target) || (w = 0);
			},
			{ capture: !0 }
		),
		document.addEventListener('keydown', (t) => {
			const n = t.key.toLowerCase(),
				a = t.ctrlKey || t.metaKey;
			if ('F12' === t.key || (a && ('u' === n || (t.shiftKey && ['i', 'j', 'c'].includes(n)))))
				return (
					t.preventDefault(),
					void (document.querySelector('dialog[open]') || e('#source-notice').showModal())
				);
		}),
		e('#answer-form').addEventListener('submit', async (t) => {
			if ((t.preventDefault(), !y || g)) return;
			(A(), (g = !0));
			const n = e('#answer-form .submit-button');
			n.disabled = !0;
			try {
				const t = await L('check', { answer: a.value });
				if (((i.textContent = ''), !0 === t.correct)) {
					const n = t.outcome;
					if (!n || 'string' != typeof n.message || 'string' != typeof n.share)
						throw new Error('invalid result');
					((e('#success-title').textContent = ''),
						e('#success-title').classList.remove('veil'),
						'string' == typeof n.title && (e('#success-title').textContent = n.title),
						C(t.slots),
						(e('#success-message').textContent = n.message),
						(e('#share').href =
							'https://x.com/intent/tweet?' +
							new URLSearchParams({
								text: n.share + '\nhttps://sajiqook.jp/game/obakeya/\n\n#お化け屋敷',
								url: 'https://x.com/saji_qook/status/2105794924465775086'
							}).toString()),
						q('clear'),
						(e('#clear-record-status').textContent =
							!1 === t.recordSaved ? '記録の反映を確認できませんでした。' : ''),
						d.open || d.showModal());
				} else
					(C(t.slots),
						q('wrong'),
						a.classList.remove('is-wrong'),
						a.offsetWidth,
						a.classList.add('is-wrong'));
			} catch {
				S();
			} finally {
				((g = !1), (n.disabled = !1));
			}
		}),
		a.addEventListener('animationend', () => a.classList.remove('is-wrong')),
		e('#settings-open').addEventListener('click', () => {
			(c.showModal(), e('#settings-open').setAttribute('aria-expanded', 'true'), q());
		}),
		c.addEventListener('close', () => {
			(e('#settings-open').setAttribute('aria-expanded', 'false'),
				e('#settings-open').focus({ preventScroll: !0 }));
		}),
		d.addEventListener('close', () => a.focus({ preventScroll: !0 })),
		document.querySelectorAll('[data-close]').forEach((e) =>
			e.addEventListener('click', () => {
				(document.getElementById(e.dataset.close).close(), q());
			})
		),
		e('#volume').addEventListener('input', () => {
			((b.volume = Number(e('#volume').value)), (b.muted = !1), I(), (w = 0));
		}),
		e('#mute').addEventListener('click', () => {
			const e = Date.now();
			((w = e - x < 1100 ? w + 1 : 1),
				(x = e),
				(b.muted = !b.muted),
				I(),
				w >= 8 && ((w = 0), c.close(), l.showModal(), V()));
		}),
		e('#record-retry').addEventListener('click', () => {
			V();
		}),
		e('#share').addEventListener('click', () => q()),
		I(),
		window.addEventListener('resize', j),
		window.visualViewport?.addEventListener('resize', j),
		j(),
		e('#play-notice').showModal(),
		Promise.all([
			Promise.all([
				document.fonts.load('20px PaperHand', '古い紙'),
				document.fonts.load('20px Veil', ''),
				document.fonts.load('20px TitleVeil')
			]).then((e) => {
				if (e.some((e) => !e.length)) throw new Error('font unavailable');
			}),
			L('init', { visitorId: k })
		])
			.then(([, e]) => {
				if ('string' != typeof e.token) throw new Error('invalid');
				((v = e.token),
					C(e.slots),
					(y = !0),
					m.forEach((e) => (e.disabled = !1)),
					document.documentElement.classList.add('fonts-ready'),
					(i.textContent = ''));
			})
			.catch(S));
})();
