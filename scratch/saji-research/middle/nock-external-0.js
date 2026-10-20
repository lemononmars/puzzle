(() => {
	'use strict';
	const e = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
		t = {
			一: 'いち',
			二: 'に',
			三: 'さん',
			四: 'よん',
			五: 'ご',
			六: 'ろく',
			七: 'なな',
			八: 'はち',
			九: 'きゅう',
			十: 'じゅう',
			回: 'かい'
		};
	function n(e, t, n) {
		if (t.used || !Number.isInteger(n) || n < 0 || n + t.reading.length > e.length) return null;
		const r = [...e];
		return (
			[...t.reading].forEach((e, t) => {
				r[n + t] = e;
			}),
			r
		);
	}
	function r(e) {
		let t = 2166136261;
		for (const n of e) t = Math.imul(t ^ n.codePointAt(0), 16777619);
		return t >>> 0;
	}
	function o(e, t, n = 3e3) {
		return e - t < n;
	}
	let i,
		s = 0.65;
	try {
		const e = localStorage.getItem('knock-se-volume');
		null !== e && Number.isFinite(Number(e)) && (s = Math.max(0, Math.min(1, Number(e))));
	} catch {}
	function a(e, t) {
		try {
			const n = t.currentTime;
			function r(e, r, o, i, a = e, c = 'sine') {
				const l = t.createOscillator(),
					d = t.createGain();
				((l.type = c),
					l.frequency.setValueAtTime(e, n + r),
					l.frequency.exponentialRampToValueAtTime(a, n + r + o),
					d.gain.setValueAtTime(i * s, n + r),
					d.gain.exponentialRampToValueAtTime(1e-4, n + r + o),
					l.connect(d).connect(t.destination),
					l.start(n + r),
					l.stop(n + r + o));
			}
			function o(e, r, o, i) {
				const a = t.createBuffer(1, Math.ceil(t.sampleRate * r), t.sampleRate),
					c = a.getChannelData(0);
				for (let e = 0; e < c.length; e++) c[e] = 2 * Math.random() - 1;
				const l = t.createBufferSource(),
					d = t.createBiquadFilter(),
					u = t.createGain();
				((l.buffer = a),
					(d.type = 'bandpass'),
					(d.frequency.value = o),
					u.gain.setValueAtTime(i * s, n + e),
					u.gain.exponentialRampToValueAtTime(1e-4, n + e + r),
					l.connect(d).connect(u).connect(t.destination),
					l.start(n + e));
			}
			('knock' === e && (r(170, 0, 0.12, 0.18, 75), o(0, 0.055, 900, 0.22)),
				'undo' === e && (r(640, 0, 0.09, 0.055), r(420, 0.06, 0.12, 0.045)),
				'confirm' === e && (r(540, 0, 0.11, 0.055), r(810, 0.075, 0.16, 0.05)),
				'rank' === e &&
					[523, 659, 784, 1047].forEach((e, t) => r(e, 0.12 + 0.095 * t, 0.24, 0.065)),
				'reunion' === e &&
					(r(523, 0.1, 0.32, 0.055), r(659, 0.25, 0.35, 0.055), r(784, 0.45, 0.5, 0.055)),
				'protest' === e &&
					(r(240, 0, 0.18, 0.08, 380, 'triangle'), r(350, 0.19, 0.25, 0.065, 140, 'triangle')),
				'dismissal' === e && [650, 490, 330].forEach((e, t) => r(e, 0.15 * t, 0.17, 0.05)),
				'bubbles' === e &&
					[310, 470, 620, 810].forEach((e, t) => r(e, 0.16 * t, 0.16, 0.055, 1.7 * e)),
				'open' === e &&
					(o(0, 0.07, 2200, 0.25),
					r(1250, 0, 0.075, 0.055, 700, 'triangle'),
					o(0.09, 0.16, 1100, 0.3),
					r(340, 0.09, 0.17, 0.09, 120, 'triangle')));
		} catch {}
	}
	function c(e) {
		try {
			if (!s) return;
			const t = window.AudioContext || window.webkitAudioContext;
			if (!t) return;
			if (((i ||= new t()), 'running' === i.state)) return void a(e, i);
			const n = i.createBufferSource();
			((n.buffer = i.createBuffer(1, 1, i.sampleRate)),
				n.connect(i.destination),
				n.start(0),
				Promise.resolve(i.resume())
					.then(() => a(e, i))
					.catch(() => {}));
		} catch {}
	}
	const l = 'https://x.com/saji_qook/status/2098909528406581693?s=20',
		d = document.querySelector('.door'),
		u = document.querySelector('.door-frame'),
		m = document.querySelector('.timer'),
		p = document.querySelector('.hand'),
		f = document.querySelector('.tokens'),
		h = document.querySelector('.board'),
		y = document.querySelector('.status'),
		g = document.querySelector('.undo'),
		v = document.querySelector('.confirm'),
		b = document.querySelector('.actions'),
		S = document.querySelector('.success-actions'),
		k = document.querySelector('.settings-dialog'),
		L = document.querySelector('.settings-toggle'),
		q = document.querySelector('#volume'),
		E = document.querySelector('#volume-value');
	((q.value = Math.round(100 * s)),
		(E.value = q.value + '%'),
		L.addEventListener('click', () => k.showModal()),
		document.querySelector('.settings-close').addEventListener('click', () => k.close()),
		k.addEventListener('pointerdown', (e) => {
			const t = k.getBoundingClientRect();
			(e.clientX < t.left || e.clientX > t.right || e.clientY < t.top || e.clientY > t.bottom) &&
				k.close();
		}),
		q.addEventListener('input', () => {
			(!(function (e) {
				s = Math.max(0, Math.min(1, e));
				try {
					localStorage.setItem('knock-se-volume', String(s));
				} catch {}
			})(Number(q.value) / 100),
				(E.value = q.value + '%'));
		}),
		q.addEventListener('change', () => c('confirm')));
	let w = 'idle',
		x = 0,
		A = 0,
		T = [],
		C = Array(5).fill(''),
		P = 0,
		I = null,
		M = null,
		N = 0,
		j = [],
		O = 0,
		R = 3e3,
		$ = 3e3,
		F = !1,
		B = 0,
		D = 0;
	const K = document.querySelector('.door-dialogue'),
		X = document.querySelector('.dialogue-note'),
		Y = document.querySelector('.records-dialog'),
		V = document.querySelector('.records-status'),
		_ = document.querySelector('.records-totals');
	let U = 0,
		W = 0,
		G = null;
	try {
		G = window.localStorage;
	} catch {}
	const J =
			/^https?:$/.test(location.protocol) &&
			!['localhost', '127.0.0.1', '[::1]'].includes(location.hostname),
		H = (function ({ storage: e, request: t, uuid: n, enabled: r = !0, now: o = Date.now }) {
			const i = 'knock-records-v2-',
				s = new Set();
			let a = null,
				c = null,
				l = 0,
				d = null;
			const u = (t) => {
					try {
						return e?.getItem(i + t);
					} catch {
						return null;
					}
				},
				m = (t, n) => {
					try {
						return (e?.setItem(i + t, n), u(t) === n);
					} catch {
						return !1;
					}
				};
			async function p(e) {
				if (!r || '1' === u(e) || s.has(e)) return;
				const o = (function () {
					if (a) return a;
					const e = u('id');
					if (/^[a-f0-9-]{36}$/i.test(e || '')) return (a = e);
					const t = n();
					return m('id', t) ? (a = t) : null;
				})();
				if (o) {
					s.add(e);
					try {
						(await t('POST', {
							id: o,
							action: e,
							...('clear' === e ? { proof: 'k-6f10d2c8' } : {})
						}),
							m(e, '1'),
							'clear' === e && (m('play', '1'), m('pending-clear', '0')));
					} catch {}
				}
			}
			return {
				start: () => p('1' === u('pending-clear') ? 'clear' : 'play'),
				clear: () => ('1' !== u('clear') && m('pending-clear', '1'), p('clear')),
				async summary() {
					if (!r) throw new Error('preview');
					if (c && o() - l < 6e4) return c;
					if (d) return d;
					d = (async () => {
						const e = await t('GET');
						if (
							!e ||
							!Number.isSafeInteger(e.plays) ||
							!Number.isSafeInteger(e.clears) ||
							e.plays < 0 ||
							e.clears < 0 ||
							e.clears > e.plays
						)
							throw new Error('Invalid records');
						return (
							(c = { ...e, rate: e.plays ? Math.round((e.clears / e.plays) * 1e3) / 10 : 0 }),
							(l = o()),
							c
						);
					})();
					try {
						return await d;
					} finally {
						d = null;
					}
				}
			};
		})({
			storage: G,
			request: async function (e, t) {
				const n = new AbortController(),
					r = setTimeout(() => n.abort(), 7e3);
				try {
					const r = await fetch('records.php', {
						method: e,
						signal: n.signal,
						credentials: 'same-origin',
						...('POST' === e
							? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(t) }
							: {})
					});
					if (!r.ok || !r.headers.get('Content-Type')?.includes('application/json'))
						throw new Error('Records unavailable');
					return 'POST' === e ? null : await r.json();
				} finally {
					clearTimeout(r);
				}
			},
			uuid: () => crypto.randomUUID(),
			enabled: J
		});
	(H.start(),
		document.querySelector('.records-close').addEventListener('click', () => Y.close()),
		Y.addEventListener('close', () => {
			W++;
		}),
		k.addEventListener('close', () => {
			U = 0;
		}));
	const z = [
		'なんだよ。どちら様？',
		'冗談じゃない！',
		'呼んだ覚えはない',
		'構わず消えてくれ',
		'まだ居やがったのか',
		'消えてくれって言ったろう！'
	];
	function Q() {
		(clearTimeout(D), (K.hidden = !0), (K.textContent = ''));
	}
	(document.querySelectorAll('input[name="dialogue"]').forEach((e) =>
		e.addEventListener('change', () => {
			((F = 'on' === e.value),
				(X.hidden = !F),
				F || Q(),
				8 === ++U &&
					((U = 0),
					(async function () {
						const e = ++W;
						((_.hidden = !0), (V.textContent = '読み込み中…'), Y.showModal());
						try {
							const t = await H.summary();
							if (e !== W || !Y.open) return;
							((document.querySelector('.records-plays').textContent =
								t.plays.toLocaleString('ja-JP')),
								(document.querySelector('.records-clears').textContent =
									t.clears.toLocaleString('ja-JP')),
								(document.querySelector('.records-rate').textContent = t.rate.toFixed(1) + '%'),
								(V.textContent = ''),
								(_.hidden = !1));
						} catch {
							e === W &&
								(V.textContent = J
									? '記録を取得できませんでした。時間をおいてお試しください。'
									: '全体の記録は公開後に利用できます。ローカル版のプレイは集計されません。');
						}
					})()));
		})
	),
		document.querySelectorAll('input[name="duration"]').forEach((e) =>
			e.addEventListener('change', () => {
				const t = Number(e.value);
				[3e3, 5e3, 1e4].includes(t) && (R = t);
			})
		));
	const Z = document.querySelector('.peek-layer'),
		ee = document.querySelector('.peek-character'),
		te = document.querySelector('.reunion-layer'),
		ne = document.querySelector('.rank-message'),
		re = document.querySelector('.reply-message'),
		oe = document.querySelector('.vet-layer'),
		ie = document.querySelector('.coral-layer');
	function se() {
		(clearTimeout(O),
			u.classList.remove('peeking', 'protesting'),
			(Z.hidden = !0),
			(te.hidden = !0),
			te.classList.remove('dismissal'),
			(ne.hidden = !0),
			(re.hidden = !0),
			(oe.hidden = !0),
			(ie.hidden = !0));
	}
	const ae = Array.from({ length: 5 }, (e, t) => {
		const n = document.createElement('button');
		return (
			(n.type = 'button'),
			(n.className = 'slot'),
			n.setAttribute('aria-label', `${t + 1}マス目：空`),
			(n.dataset.index = t),
			(n.disabled = !0),
			n.addEventListener('click', () => {
				null !== I && ye(I, t);
			}),
			h.append(n),
			n
		);
	});
	function ce(e) {
		y.textContent = e;
	}
	function le() {
		(ae.forEach((e, t) => {
			(e.classList.toggle('filled', !!C[t]),
				e.setAttribute('aria-label', `${t + 1}マス目：${C[t] ? '■' : '空'}`),
				(e.disabled = 'ready' !== w));
		}),
			(g.disabled = 'ready' !== w || !j.length),
			(v.disabled = 'ready' !== w || !C.some(Boolean)));
	}
	function de() {
		(M && (M.ghost?.remove(), M.el.classList.remove('drag-source', 'selected'), (M = null)),
			ae.forEach((e) => e.classList.remove('drop-target')));
	}
	function ue() {
		(Q(),
			P++,
			cancelAnimationFrame(N),
			de(),
			(I = null),
			(j = []),
			(C = Array(5).fill('')),
			(T = []),
			f.replaceChildren(),
			h.classList.remove('complete', 'incorrect'),
			u.classList.remove('open'),
			(d.disabled = !1),
			d.classList.remove('knock'),
			document.querySelector('.welcome').setAttribute('aria-hidden', 'true'),
			(b.hidden = !1),
			(S.hidden = !0),
			(w = 'idle'),
			(A = 0),
			(p.style.transform = 'rotate(0deg)'),
			m.classList.remove('running'),
			m.setAttribute('aria-label', 'タイマー：待機中'),
			ae.forEach((e) => e.classList.remove('reveal')),
			le(),
			ce(''));
	}
	function me() {
		'counting' === w &&
			((w = 'ready'),
			cancelAnimationFrame(N),
			(p.style.transform = 'rotate(360deg)'),
			m.classList.remove('running'),
			m.setAttribute('aria-label', 'タイマー：計測終了'),
			(T = (function (n) {
				if (!Number.isInteger(n) || n < 1 || n > 99) throw new RangeError('Invalid count');
				const r = Math.floor(n / 10),
					o = (r ? (r > 1 ? e[r] : '') + '十' : '') + e[n % 10] + '回';
				return [...o].map((e, n) => {
					let r = t[e];
					return (
						'回' === o[n + 1] && (r = { 一: 'いっ', 六: 'ろっ', 八: 'はっ', 十: 'じゅっ' }[e] || r),
						{ id: n, symbol: e, reading: r, used: !1 }
					);
				});
			})(A)),
			f.replaceChildren(
				...T.map((e) => {
					const t = document.createElement('button');
					return (
						(t.type = 'button'),
						(t.className = 'token'),
						(t.dataset.id = e.id),
						t.setAttribute(
							'aria-label',
							`${e.id + 1}番目の${'回' === e.symbol ? '二重四角' : '四角'}`
						),
						(t.innerHTML = `<span class="square${'回' === e.symbol ? ' double' : ''}"></span>`),
						t.addEventListener('pointerdown', (n) =>
							(function (e, t, n) {
								0 !== e.button ||
									!e.isPrimary ||
									'ready' !== w ||
									t.used ||
									M ||
									(e.preventDefault(),
									he(null),
									n.focus({ preventScroll: !0 }),
									n.setPointerCapture(e.pointerId),
									(M = {
										id: t.id,
										el: n,
										pointer: e.pointerId,
										x: e.clientX,
										y: e.clientY,
										ghost: null
									}),
									n.classList.add('selected'));
							})(n, e, t)
						),
						t.addEventListener('keydown', (t) => {
							(('Enter' !== t.key && ' ' !== t.key) ||
								(t.preventDefault(), he(e.id), ae[0].focus()),
								'Escape' === t.key && he(null));
						}),
						t
					);
				})
			),
			le(),
			ce('計測が終わりました。'));
	}
	function pe(e) {
		if ('counting' !== w) return;
		const t = Math.min($, Math.max(0, e - x));
		((p.style.transform = `rotate(${(t / $) * 360}deg)`),
			o(e, x, $) ? (N = requestAnimationFrame(pe)) : me());
	}
	function fe() {
		if ('solved' === w || 'secret' === w) return;
		const e = performance.now();
		'counting' !== w || o(e, x, $)
			? ('counting' !== w &&
					(function (e) {
						(se(),
							ue(),
							(w = 'counting'),
							($ = R),
							(x = e),
							m.classList.add('running'),
							le(),
							ce('計測中'),
							(N = requestAnimationFrame(pe)));
					})(e),
				(A = Math.min(99, A + 1)),
				c('knock'),
				d.classList.remove('knock'),
				d.offsetWidth,
				d.classList.add('knock'),
				m.setAttribute('aria-label', 'タイマー：計測中'))
			: me();
	}
	function he(e) {
		((I = e),
			f
				.querySelectorAll('.token')
				.forEach((t) => t.classList.toggle('selected', Number(t.dataset.id) === e)));
	}
	function ye(e, t) {
		if ('ready' !== w) return !1;
		const r = T[e];
		if (!r) return !1;
		const o = n(C, r, t);
		if (!o) return (ce('そこには置けません。'), !1);
		(j.push({ board: [...C], used: T.map((e) => e.used) }), (C = o), (r.used = !0));
		const i = f.children[e];
		return (
			i.classList.add('used'),
			(i.disabled = !0),
			he(null),
			le(),
			r.reading.split('').forEach((e, n) => {
				const r = ae[t + n];
				(r.classList.remove('reveal'),
					r.offsetWidth,
					r.style.setProperty('--delay', 85 * n + 'ms'),
					r.classList.add('reveal'));
			}),
			ce(`${t + 1}マス目から${r.reading.length}マスを埋めました。`),
			!0
		);
	}
	function ge() {
		if ('ready' !== w || !j.length) return;
		(de(), he(null));
		const e = j.pop();
		((C = e.board),
			T.forEach((t, n) => {
				((t.used = e.used[n]),
					f.children[n].classList.toggle('used', t.used),
					(f.children[n].disabled = t.used));
			}),
			ae.forEach((e) => e.classList.remove('reveal')),
			h.classList.remove('incorrect'),
			le(),
			c('undo'),
			ce('一つ戻しました。'));
	}
	function ve() {
		if ('ready' !== w || !C.some(Boolean)) return;
		(Q(), de(), he(null), h.classList.remove('incorrect'), c('confirm'));
		const e = (function (e) {
			const t = e
				.map((e) => e || ' ')
				.join('')
				.trimEnd();
			return (
				new Map([
					[607640838, 'resident'],
					[2693107901, 'monster'],
					[3004450738, 'rank'],
					[1094603171, 'reunion'],
					[4187812180, 'misunderstanding'],
					[20376058, 'dismissal'],
					[2335186124, 'vet'],
					[2109247287, 'coral']
				]).get(r(t)) || null
			);
		})(C);
		if (e)
			return void (function (e) {
				(se(),
					(w = 'secret'),
					(d.disabled = !0),
					d.classList.remove('knock'),
					le(),
					f.querySelectorAll('button').forEach((e) => (e.disabled = !0)));
				let t = 3300;
				'resident' === e || 'monster' === e
					? ((ee.src =
							'resident' === e ? 'assets/grandma-gag.png' : 'assets/monster-gag-transparent.png'),
						(Z.hidden = !1),
						u.classList.add('peeking'),
						c('open'),
						ce(
							'resident' === e
								? 'おばあちゃんが隙間から覗いています。'
								: '怪獣が隙間から覗いています。'
						))
					: 'rank' === e
						? ((t = 2800), (ne.hidden = !1), c('rank'), ce('ランクが上がった！'))
						: 'reunion' === e
							? ((t = 4200),
								(te.hidden = !1),
								c('reunion'),
								ce('右からおばあちゃん、左からおじいちゃんが現れて、再会しました。'))
							: 'misunderstanding' === e
								? ((t = 3e3),
									(re.hidden = !1),
									u.classList.add('protesting'),
									c('protest'),
									ce('扉の向こうから「誤解です！」と返事がありました。'))
								: 'dismissal' === e
									? ((t = 3400),
										te.classList.add('dismissal'),
										(te.hidden = !1),
										c('dismissal'),
										ce('おばあちゃんとおじいちゃんが、左右に分かれて帰っていきました。'))
									: 'vet' === e
										? ((t = 4600),
											(oe.hidden = !1),
											c('reunion'),
											ce('獣医が怪獣を診察し、怪獣は元気に帰っていきました。'))
										: 'coral' === e &&
											((t = 3800),
											(ie.hidden = !1),
											c('bubbles'),
											ce('扉の下から珊瑚が生えてきました。'));
				const n = P;
				O = setTimeout(() => {
					n === P &&
						'secret' === w &&
						(se(),
						(w = 'ready'),
						(d.disabled = !1),
						T.forEach((e, t) => (f.children[t].disabled = e.used)),
						le(),
						k.open || v.focus({ preventScroll: !0 }));
				}, t);
			})(e);
		if (
			!(function (e) {
				return 4201482606 === r(e.join(''));
			})(C)
		)
			return (
				h.offsetWidth,
				h.classList.add('incorrect'),
				ce('扉は開きませんでした。'),
				void (function () {
					if ((Q(), !F)) return;
					const e = z[B];
					((B = (B + 1) % z.length),
						(K.textContent = e),
						(K.hidden = !1),
						ce(`扉の中から「${e}」`),
						(D = setTimeout(Q, 4200)));
				})()
			);
		((w = 'solved'),
			(d.disabled = !0),
			d.classList.remove('knock'),
			f.querySelectorAll('button').forEach((e) => (e.disabled = !0)),
			le());
		const t = P;
		setTimeout(() => {
			t === P &&
				(c('open'),
				h.classList.add('complete'),
				u.classList.add('open'),
				document.querySelector('.welcome').setAttribute('aria-hidden', 'false'),
				(b.hidden = !0),
				(S.hidden = !1),
				k.open || document.querySelector('.share').focus({ preventScroll: !0 }),
				ce('ようこそ！見事入会に成功した。'),
				H.clear());
		}, 320);
	}
	(d.addEventListener('pointerdown', (e) => {
		0 === e.button && e.isPrimary && (e.preventDefault(), d.focus({ preventScroll: !0 }), fe());
	}),
		d.addEventListener('keydown', (e) => {
			('Enter' !== e.key && ' ' !== e.key) || e.repeat || (e.preventDefault(), fe());
		}),
		document.addEventListener('visibilitychange', () => {
			document.hidden || 'counting' !== w || pe(performance.now());
		}),
		g.addEventListener('click', ge),
		v.addEventListener('click', ve),
		document.querySelector('.retry').addEventListener('click', () => {
			(c('undo'), se(), ue(), d.focus({ preventScroll: !0 }));
		}));
	const be = document.querySelector('.share'),
		Se = new URL('https://twitter.com/intent/tweet');
	(Se.searchParams.set(
		'text',
		'WEB謎「knock」を解きました！\n\nhttps://sajiqook.jp/game/nock\n\n#knock' + (l ? '\n' + l : '')
	),
		(be.href = Se.href));
	const ke = navigator.userAgent;
	function Le(e, t) {
		const n = document.elementFromPoint(e, t)?.closest('.slot');
		return n ? Number(n.dataset.index) : -1;
	}
	if (
		(/iP(?:hone|ad|od)/.test(ke) &&
			/Safari/.test(ke) &&
			!/CriOS|FxiOS|EdgiOS|OPiOS|Twitter/i.test(ke) &&
			(be.target = '_self'),
		document.addEventListener('pointermove', (e) => {
			if (!M || e.pointerId !== M.pointer) return;
			const t = M;
			if (
				(!t.ghost &&
					Math.hypot(e.clientX - t.x, e.clientY - t.y) > 5 &&
					((t.ghost = t.el.cloneNode(!0)),
					t.ghost.removeAttribute('data-id'),
					t.ghost.removeAttribute('aria-label'),
					t.ghost.setAttribute('aria-hidden', 'true'),
					(t.ghost.tabIndex = -1),
					(t.ghost.className = 'token drag-ghost'),
					document.body.append(t.ghost),
					t.el.classList.add('drag-source')),
				t.ghost)
			) {
				((t.ghost.style.left = e.clientX + 'px'), (t.ghost.style.top = e.clientY + 'px'));
				const r = Le(e.clientX, e.clientY);
				ae.forEach((e, o) =>
					e.classList.toggle(
						'drop-target',
						r >= 0 && !!n(C, T[t.id], r) && o >= r && o < r + T[t.id].reading.length
					)
				);
			}
		}),
		document.addEventListener('pointerup', (e) => {
			if (!M || e.pointerId !== M.pointer) return;
			const t = M,
				n = Le(e.clientX, e.clientY),
				r = !!t.ghost;
			(de(), t.el.classList.remove('selected'), r && n >= 0 && ye(t.id, n));
		}),
		document.addEventListener('pointercancel', de),
		document.addEventListener('keydown', (e) => {
			if (
				('Escape' === e.key && (de(), he(null)),
				null !== I && ['ArrowLeft', 'ArrowRight'].includes(e.key))
			) {
				const t = ae.indexOf(document.activeElement);
				(e.preventDefault(),
					ae[Math.max(0, Math.min(4, t + ('ArrowRight' === e.key ? 1 : -1)))].focus());
			}
		}),
		document.addEventListener(
			'keydown',
			(e) => {
				const t = e.key.toLowerCase(),
					n = (e.ctrlKey && !e.shiftKey && 'u' === t) || (e.metaKey && e.altKey && 'u' === t),
					r =
						'F12' === e.key ||
						(((e.ctrlKey && e.shiftKey) || (e.metaKey && e.altKey)) && ['i', 'j', 'c'].includes(t));
				(n || r) &&
					(e.preventDefault(),
					e.stopImmediatePropagation(),
					window.alert('今でも本当に俺を笑わせるつもりか？'));
			},
			{ capture: !0 }
		),
		document.modelContext?.registerTool)
	) {
		const e = () => ({
				phase: w,
				tiles: T.filter((e) => !e.used).map((e) => ({
					position: e.id + 1,
					shape: '回' === e.symbol ? 'double-square' : 'square'
				})),
				slots: C.map((e) => (e ? '■' : '□'))
			}),
			t = [
				{
					name: 'confirm_board',
					description: 'Press the visible confirm button to submit the current board.',
					inputSchema: { type: 'object', properties: {}, additionalProperties: !1 },
					execute: () => (ve(), e())
				},
				{
					name: 'undo_placement',
					description: 'Undo the last square placement using the visible undo button.',
					inputSchema: { type: 'object', properties: {}, additionalProperties: !1 },
					execute: () => (ge(), e())
				},
				{
					name: 'knock_once',
					description:
						'Knock on the visible door once. Starts a timed round or adds one knock to the running round.',
					inputSchema: { type: 'object', properties: {}, additionalProperties: !1 },
					execute: () => (fe(), e())
				},
				{
					name: 'place_square',
					description:
						'Place one available square into a visible board slot. Consumes the square only when placement succeeds.',
					inputSchema: {
						type: 'object',
						properties: {
							position: { type: 'integer', minimum: 1, maximum: 4 },
							slot: { type: 'integer', minimum: 1, maximum: 5 }
						},
						required: ['position', 'slot'],
						additionalProperties: !1
					},
					execute: (t) => {
						if (
							!t ||
							!Number.isInteger(t.position) ||
							!Number.isInteger(t.slot) ||
							t.position < 1 ||
							t.position > 4 ||
							t.slot < 1 ||
							t.slot > 5
						)
							throw new Error('Invalid position');
						return { placed: ye(t.position - 1, t.slot - 1), ...e() };
					}
				}
			];
		for (const e of t)
			try {
				Promise.resolve(
					document.modelContext.registerTool({ ...e, annotations: { readOnlyHint: !1 } })
				).catch(() => {});
			} catch {}
	}
})();
