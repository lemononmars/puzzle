(() => {
	var e = 'daruma-puzzle-v4',
		t = (e) => {
			const t = Math.floor(e / 3),
				n = e % 3;
			return { x: t % 2 ? 2 - n : n, y: 3 - t };
		};
	function n(e, t, n = 'page') {
		return 'approach' !== e.phase || null !== e.awayAt
			? e
			: { ...e, turns: e.turns + 1, awayAt: t, awaySource: n };
	}
	function a(e, t, n = !1) {
		if ('approach' !== e.phase || null === e.awayAt) return e;
		if (n && 'settings' !== e.awaySource)
			return { ...e, awayAt: null, awaySource: null, turns: Math.max(0, e.turns - 1) };
		const a = Math.min(11e3, e.elapsed + Math.max(0, t - e.awayAt));
		return {
			...e,
			awayAt: null,
			awaySource: null,
			elapsed: a,
			phase: a >= 11e3 ? 'tagged' : 'approach'
		};
	}
	var r = (e) =>
			'ready' === e.phase
				? 11
				: 'approach' === e.phase
					? Math.max(0, 11 - Math.floor(e.elapsed / 1e3))
					: 'tagged' === e.phase
						? 0
						: 'retreat' === e.phase
							? e.retreatStep
							: 5,
		s = {
			ja: {
				title: 'だるまさんが',
				pageTitle: 'だるまさんが｜WEB謎',
				restart: '最初から',
				settings: '設定',
				language: '表示言語',
				toggle: '英語に切り替える',
				hints: 'ヒント・解説 ↗',
				paidNote:
					'すべてのWEB謎のヒントと解説を、この有料記事ひとつで楽しめます。',
				games: '他のゲーム ↗',
				resetTitle: 'もう一度、はじめる？',
				resetBody:
					'今の勝負を終えて、最初の位置に戻ります。',
				cancel: 'もどる',
				resetConfirm: 'はじめる',
				records: '記録',
				closeRecords: '記録を閉じる',
				recordsNotice:
					'この画面は謎解きとは関係ありません。',
				plays: '総プレイ回数',
				clears: 'クリア回数',
				rate: 'クリア率',
				falls: '鬼が崖に落ちた数',
				maxStep: '鬼の指定最大歩数',
				recordsScope:
					'全体の記録です。プレイ・クリアは同じブラウザにつき各1回です。',
				loading: '読み込み中…',
				unavailable:
					'記録を取得できません。時間をおいてお試しください。',
				offline:
					'通信が切れています。接続後にご確認ください。',
				settingsChanged:
					'設定画面がじゃまになるから見え方を変更したよ！',
				settingsNotice:
					'この画面の設定、内容は謎解きとは関係ありません。',
				closeSettings: '設定を閉じる',
				se: '効果音',
				seOn: 'オン',
				seOff: 'オフ',
				intro:
					'キミが鬼だよ！
見ていない間に、タッチするよ。',
				start: 'はじめる',
				walk: '歩く',
				again: 'もう一度',
				share: 'Xでシェア',
				sharePending:
					'シェアは公開時に利用できます。',
				tagged: 'タッチ！',
				escape: 'にげろ！',
				collapse: 'あっ……！',
				won: 'つかまえた！',
				short: '届かなかった。',
				fallen: '行きすぎた。',
				winNote: 'こんどは、ぼくが鬼だね。',
				fallNote: '崖に落ちてしまった。',
				rules:
					'言われた歩数だけ進んで。
ピッタリ止まらないと捕まえられないよ！',
				turns: (e) => `鬼さん、${e}歩！`,
				shortNote: (e) => `あと${e}歩。`,
				steps: (e) => `${e}歩`,
				runnerLabel: 'ダルマ',
				oniLabel: '鬼',
				hardCount: '数えるの大変だったよ…',
				touchSpeech: 'さわっても何もないよ',
				runnerRareSpeech: '見ていたら動けないよ',
				oniTouchSpeech: 'そろそろ始めようかな',
				oniRareSpeech:
					'絶対にぴったり捕まえるぞ！',
				idleSpeech: 'そろそろ始める？',
				board: (e, t, n) =>
					`3列4行の12マス。青い鬼は開始位置から${e}歩、赤いダルマは${t}歩の位置。${n ? '6〜11歩先の6マスは崩れて崖になった。' : ''}`,
				fallBoard: '鬼が6歩目で崖に落ちた。'
			},
			en: {
				title: 'Daruma-san ga',
				pageTitle:
					'Daruma-san ga | Web Puzzle',
				restart: 'Restart',
				settings: 'Settings',
				language: 'Language',
				toggle: 'Switch to Japanese',
				hints: 'Hints & solution ↗',
				paidNote:
					'Hints and solutions for all our web puzzles in one paid article (Japanese).',
				games: 'More games ↗',
				resetTitle: 'Start again?',
				resetBody:
					'End this round and return to the starting positions.',
				cancel: 'Back',
				resetConfirm: 'Start again',
				records: 'Records',
				closeRecords: 'Close records',
				recordsNotice:
					'This screen is not part of the puzzle.',
				plays: 'Total players',
				clears: 'Players who cleared',
				rate: 'Clear rate',
				falls:
					'Times the chaser fell',
				maxStep:
					'Highest assigned step count',
				recordsScope:
					'Totals across all players. Plays and clears count once per browser.',
				loading: 'Loading…',
				unavailable:
					'Records are unavailable. Please try again later.',
				offline:
					'You are offline. Please reconnect to view records.',
				settingsChanged:
					'Settings got in the way, so I changed how they open!',
				settingsNotice:
					'The settings and content on this screen are not part of the puzzle.',
				closeSettings: 'Close settings',
				se: 'Sound effects',
				seOn: 'On',
				seOff: 'Off',
				intro:
					'You’re it!
I’ll tag you while you’re not looking.',
				start: 'Start',
				walk: 'Walk',
				again: 'Play again',
				share: 'Share on X',
				sharePending:
					'Sharing will be available at launch.',
				tagged: 'Tag!',
				escape: 'Run!',
				collapse: 'Uh-oh…',
				won: 'Caught you!',
				short: 'Not far enough.',
				fallen: 'Too far!',
				winNote:
					'Now it’s my turn to be it.',
				fallNote:
					'You fell off the cliff.',
				rules:
					'Take the number of steps you’re told.
You must stop in exactly the right spot to catch me!',
				turns: (e) => `Take ${e} ${1 === e ? 'step' : 'steps'}!`,
				shortNote: (e) => `${e} ${1 === e ? 'step' : 'steps'} short.`,
				steps: (e) => `${e} ${1 === e ? 'step' : 'steps'}`,
				runnerLabel: 'Daruma',
				oniLabel: 'Chaser',
				hardCount:
					'That was a lot to count…',
				touchSpeech:
					'Nothing happens if you touch me.',
				runnerRareSpeech:
					'I can't move while you're watching.',
				oniTouchSpeech:
					'Maybe I should get started.',
				oniRareSpeech:
					'I'll catch you in exactly the right spot!',
				idleSpeech: 'Ready to start?',
				board: (e, t, n) =>
					`Twelve squares in three columns and four rows, including your starting square. You are ${e} steps from the start; the runner is ${t} steps away.${n ? ' The six squares 6–11 steps away have collapsed into a cliff.' : ''}`,
				fallBoard:
					'You fell off the cliff on step 6.'
			}
		},
		o = 'daruma-records-v1-',
		l = (e) => {
			try {
				return localStorage.getItem(o + e);
			} catch {
				return null;
			}
		},
		i = (e, t) => {
			try {
				return (localStorage.setItem(o + e, t), l(e) === t);
			} catch {
				return !1;
			}
		},
		c = (e) => /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(e || ''),
		d = null;
	function u() {
		try {
			const e = JSON.parse(
				l('pending-results') || '[]'
			);
			return Array.isArray(e) ? e.filter((e) => e && c(e.event)).slice(-50) : [];
		} catch {
			return [];
		}
	}
	function p(e) {
		i('pending-results', JSON.stringify(e.slice(-50)));
	}
	function g(e = !1) {
		let t = e ? null : l('run');
		return (c(t) || ((t = crypto.randomUUID()), i('run', t)), t);
	}
	async function h(e, t) {
		const n = new AbortController(),
			a = setTimeout(() => n.abort(), 7e3);
		try {
			const a = await fetch('./records.php', {
				method: e,
				cache: 'no-store',
				credentials: 'same-origin',
				signal: n.signal,
				...(t
					? {
							headers: {
								'Content-Type':
									'application/json'
							},
							body: JSON.stringify(t)
						}
					: {})
			});
			if (!a.ok) throw new Error('unavailable');
			return 'GET' === e ? await a.json() : null;
		} finally {
			clearTimeout(a);
		}
	}
	async function f() {
		if (d) return d;
		if (!/^https?:$/.test(location.protocol) || !navigator.onLine) return;
		const e = (function () {
			let e = l('id');
			return c(e) ? e : ((e = crypto.randomUUID()), i('id', e) ? e : null);
		})();
		if (e) {
			d = (async () => {
				try {
					('1' === l('pending-clear') &&
						'1' !== l('clear') &&
						(await h('POST', {
							id: e,
							action: 'clear',
							turns: 5,
							step: 5,
							elapsed: 11e3
						}),
						i('play', '1'),
						i('clear', '1'),
						i('pending-clear', '0')),
						'1' === l('pending-play') &&
							'1' !== l('play') &&
							(await h('POST', { id: e, action: 'play' }),
							i('play', '1'),
							i('pending-play', '0')));
					const t = u();
					for (; t.length;)
						(await h('POST', { id: e, action: 'result', ...t[0] }),
							t.shift(),
							p(t));
				} catch {}
			})();
			try {
				await d;
			} finally {
				d = null;
			}
		}
	}
	var m = {
		start(e = !1) {
			(g(e), i('pending-play', '1'), f());
		},
		finish(e) {
			if (!['won', 'short', 'fallen'].includes(e.phase))
				return;
			const t = g(!1),
				n = e.phase,
				a = u();
			(a.some((e) => e.event === t) ||
				a.push({ event: t, outcome: n, turns: e.turns, step: e.step, elapsed: e.elapsed }),
				p(a),
				(() => {
					try {
						localStorage.removeItem(o + 'run');
					} catch {}
				})(),
				i('pending-play', '1'),
				f());
		},
		async summary() {
			if (!navigator.onLine) throw new Error('offline');
			await f();
			const e = await h('GET');
			if (
				!Number.isSafeInteger(e.plays) ||
				!Number.isSafeInteger(e.clears) ||
				!Number.isSafeInteger(e.falls) ||
				!Number.isSafeInteger(e.maxStep) ||
				e.plays < 0 ||
				e.clears < 0 ||
				e.clears > e.plays ||
				e.falls < 0 ||
				e.maxStep < 0 ||
				e.maxStep > 1e3
			)
				throw new Error('invalid');
			return { ...e, rate: e.plays ? Math.round((e.clears / e.plays) * 1e3) / 10 : 0 };
		}
	};
	(window.addEventListener('online', () => {
		f();
	}),
		document.addEventListener(
			'visibilitychange',
			() => {
				document.hidden || f();
			}
		),
		f());
	var y = null,
		w = !0;
	try {
		w = 'off' !== localStorage.getItem('daruma-se');
	} catch {}
	var S = {
			get enabled() {
				return w;
			},
			unlock() {
				if (w)
					try {
						(y ?? (y = new (window.AudioContext || window.webkitAudioContext)()),
							'suspended' === y.state && y.resume().catch(() => {}));
					} catch {}
			},
			toggle() {
				w = !w;
				try {
					localStorage.setItem(
						'daruma-se',
						w ? 'on' : 'off'
					);
				} catch {}
				return (w && this.unlock(), w);
			},
			play(e = 'step') {
				if (!w || document.hidden || 'running' !== y?.state) return;
				const t = y.currentTime,
					n = 'step' === e;
				for (const [e, a] of n
					? [
							[720, 0.075],
							[1560, 0.027]
						]
					: [
							[1050, 0.035],
							[2100, 0.009]
						]) {
					const r = y.createOscillator(),
						s = y.createGain();
					((r.type = 'sine'),
						r.frequency.setValueAtTime(e, t),
						r.frequency.exponentialRampToValueAtTime(0.75 * e, t + 0.07),
						s.gain.setValueAtTime(1e-4, t),
						s.gain.exponentialRampToValueAtTime(a, t + 0.002),
						s.gain.exponentialRampToValueAtTime(1e-4, t + (n ? 0.095 : 0.045)),
						r.connect(s),
						s.connect(y.destination),
						r.start(t),
						r.stop(t + 0.12),
						(r.onended = () => {
							(r.disconnect(), s.disconnect());
						}));
				}
			}
		},
		v = Object.freeze({
			title: 'だるまさんが',
			url: 'https://sajiqook.jp/game/darumas/',
			hashtag: 'だるまさんが',
			quoteUrl:
				'https://x.com/saji_qook/status/2102487661575614494?s=20'
		});
	function b(e = v) {
		const t = (function (e = v) {
			const { title: t, url: n, hashtag: a, quoteUrl: r } = e;
			if (!t.trim() || !a.trim() || !/^https:\/\/sajiqook\.jp\/game\/[^/?#]+\/?$/.test(n))
				return null;
			const s = a.trim().replace(/^[#＃]+/, '');
			return !s ||
				/\s/.test(s) ||
				(r && !/^https:\/\/x\.com\/[^/]+\/status\/\d+(?:\?[^\s]*)?$/.test(r))
				? null
				: `WEB謎「${t.trim()}」を解きました！\n\n${n}\n\n#${s}${r ? '
' + r : ''}`;
		})(e);
		return t
			? 'https://x.com/intent/tweet?' +
					new URLSearchParams({ text: t })
			: null;
	}
	var x,
		A = (e) => document.getElementById(e),
		L = 'daruma-active-v1',
		T = (e, t = {}) => {
			'function' == typeof window.gtag &&
				window.gtag('event', e, { game_slug: 'darumas', ...t });
		},
		E = 'ja',
		k = 0,
		C = null,
		N = null,
		I = null,
		$ = null,
		R = 0,
		M = null,
		O = null,
		q = null,
		P = null,
		j = null,
		B = 'runner',
		D = null,
		z = document.hasFocus(),
		Y =
			'reload' ===
			performance.getEntriesByType('navigation')[0]?.type,
		_ = Date.now(),
		F = 0,
		U = 0,
		J = new Set();
	try {
		((x = (function (e) {
			try {
				const t = JSON.parse(e);
				return 4 === t?.version &&
					[
						'ready',
						'approach',
						'tagged',
						'retreat',
						'collapsing',
						'declare',
						'walking',
						'won',
						'short',
						'fallen'
					].includes(t.phase) &&
					[t.elapsed, t.turns, t.step, t.retreatStep].every((e) => Number.isFinite(e) && e >= 0) &&
					Number.isInteger(t.turns) &&
					Number.isInteger(t.step) &&
					Number.isInteger(t.retreatStep)
					? (null !== t.awayAt && (!Number.isFinite(t.awayAt) || t.awayAt < 0)) ||
						t.elapsed > 11e3 ||
						t.step > 6 ||
						t.retreatStep > 5
						? {
								version: 4,
								phase: 'ready',
								elapsed: 0,
								turns: 0,
								awayAt: null,
								awaySource: null,
								step: 0,
								retreatStep: 0
							}
						: {
								version: 4,
								phase: t.phase,
								elapsed: Math.min(11e3, t.elapsed),
								turns: t.turns,
								awayAt: t.awayAt,
								awaySource:
									null === t.awayAt
										? null
										: 'settings' === t.awaySource
											? 'settings'
											: 'page',
								step: t.step,
								retreatStep: t.retreatStep
							}
					: {
							version: 4,
							phase: 'ready',
							elapsed: 0,
							turns: 0,
							awayAt: null,
							awaySource: null,
							step: 0,
							retreatStep: 0
						};
			} catch {
				return {
					version: 4,
					phase: 'ready',
					elapsed: 0,
					turns: 0,
					awayAt: null,
					awaySource: null,
					step: 0,
					retreatStep: 0
				};
			}
		})(localStorage.getItem(e))),
			(E =
				'en' ===
				localStorage.getItem('daruma-language')
					? 'en'
					: 'ja'),
			(R = Math.min(
				2,
				Number(
					localStorage.getItem(
						'daruma-settings-opens'
					)
				) || 0
			)),
			(U = Number(localStorage.getItem(L)) || 0));
	} catch {
		x = {
			version: 4,
			phase: 'ready',
			elapsed: 0,
			turns: 0,
			awayAt: null,
			awaySource: null,
			step: 0,
			retreatStep: 0
		};
	}
	'approach' === x.phase &&
		null === x.awayAt &&
		!Y &&
		U > 0 &&
		_ - U >= 1e3 &&
		((x = n(x, U)), te());
	var W = matchMedia(
			'(prefers-reduced-motion: reduce)'
		).matches,
		V = W ? 150 : 320,
		H = () => s[E],
		G = () => A('settings-modal').open,
		X = () =>
			'true' ===
				A('settings-open').getAttribute(
					'aria-expanded'
				) && !G();
	function K(e, n) {
		const { x: a, y: r } = t(n);
		(e.style.setProperty('--x', a), e.style.setProperty('--y', r));
	}
	var Q = [];
	for (let e = 0; e <= 11; e++) {
		const t = document.createElement('div');
		((t.className = `cell${0 === e ? ' home' : ''}${e > 5 ? ' fragile' : ''}`),
			(t.dataset.index = e),
			K(t, e),
			A('lane').append(t),
			Q.push(t));
	}
	function Z(e, n, a = 6) {
		return Array.from({ length: n - e }, (n, r) => {
			const s = t(e + r),
				o = t(e + r + 1),
				l = o.x - s.x,
				i = o.y - s.y,
				c = 40 - a;
			return `M${80 * s.x + 40 + l * c} ${80 * s.y + 40 + i * c}L${80 * o.x + 40 - l * c} ${80 * o.y + 40 - i * c}`;
		}).join(' ');
	}
	(A('safe-route').setAttribute('d', Z(0, 5)),
		A('fragile-route').setAttribute('d', Z(5, 11)));
	for (const [e, t] of [
		['runner', 'daruma-a.png'],
		['oni', 'oni-a.png']
	])
		A(e).innerHTML =
			`<svg viewBox="0 0 64 76"><ellipse class="pawn-shadow" cx="32" cy="69" rx="20" ry="4" fill="#473727" opacity=".17"/><g class="figure"><image href="./assets/${t}" x="0" y="-4" width="64" height="76" preserveAspectRatio="xMidYMax meet"/></g></svg>`;
	function ee() {
		const e = A('board-space').getBoundingClientRect(),
			t = Math.max(0, Math.floor(Math.min(e.width / 3, e.height / 4, 110)));
		(A('board').style.setProperty(
			'--board-size',
			4 * t + 'px'
		),
			A('board').style.setProperty(
				'--board-width',
				3 * t + 'px'
			));
		const n = t ? 480 / t : 6;
		(A('safe-route').setAttribute('d', Z(0, 5, n)),
			A('fragile-route').setAttribute('d', Z(5, 11, n)));
	}
	function te() {
		try {
			localStorage.setItem(e, JSON.stringify(x));
		} catch {}
	}
	function ne(e = Date.now(), t = !1) {
		if (
			'approach' !== x.phase ||
			null !== x.awayAt ||
			document.hidden ||
			se()
		) {
			if (0 !== F || 'approach' !== x.phase) {
				try {
					localStorage.removeItem(L);
				} catch {}
				F = 0;
			}
		} else if (t || e - F >= 250) {
			try {
				localStorage.setItem(L, String(e));
			} catch {}
			F = e;
		}
	}
	function ae() {
		(clearTimeout(C), (C = null));
	}
	function re() {
		for (const e of J) clearTimeout(e);
		J.clear();
		for (const e of document.querySelectorAll(
			'.figure,.pawn-shadow'
		))
			for (const t of e.getAnimations()) t.cancel();
	}
	function se() {
		return (
			A('reset-dialog').open ||
			A('records').open ||
			G()
		);
	}
	function oe() {
		(clearTimeout(q),
			(q = null),
			(j = null),
			(A('pawn-speech').hidden = !0));
	}
	function le(e, t = 3500, n = 'runner') {
		(clearTimeout(q),
			(j = e),
			(B = n),
			(A('pawn-speech').textContent = H()[e]),
			(A('pawn-speech').hidden = !1),
			(q = setTimeout(() => {
				((q = null), (j = null), (A('pawn-speech').hidden = !0));
			}, t)),
			K(A('pawn-speech'), 'oni' === B ? x.step : r(x)));
	}
	function ie() {
		return (
			['ready', 'approach'].includes(x.phase) &&
			!document.hidden &&
			!se()
		);
	}
	function ce(e = !1) {
		if ((e && (clearTimeout(P), (P = null)), !ie())) return (clearTimeout(P), void (P = null));
		P ||
			(P = setTimeout(() => {
				((P = null), ie() && le('idleSpeech', 5e3));
			}, 3e4));
	}
	function de() {
		('idleSpeech' === j && oe(), ce(!0));
	}
	function ue(e, t, n) {
		const a = A(e).querySelector('.figure');
		for (const e of a.getAnimations()) e.cancel();
		(W ||
			a.animate(
				[
					{ transform: 'rotate(0deg)' },
					{ transform: 'rotate(-14deg)' },
					{ transform: 'rotate(10deg)' },
					{ transform: 'rotate(-5deg)' },
					{ transform: 'rotate(0deg)' }
				],
				{ duration: 560, easing: 'ease-out' }
			),
			le(Math.random() < 0.1 ? n : t, 3500, e));
	}
	function pe(e, t) {
		(ae(),
			(C = setTimeout(() => {
				((C = null), document.hidden || se() || e());
			}, t)));
	}
	function ge(e) {
		const t = A(e),
			n = t.querySelector('.figure'),
			a = t.querySelector('.pawn-shadow');
		for (const e of [n, a]) for (const t of e.getAnimations()) t.cancel();
		W ||
			(n.animate(
				[
					{ transform: 'translateY(0)' },
					{
						transform: 'translateY(-14px)',
						offset: 0.45
					},
					{ transform: 'translateY(0)' }
				],
				{ duration: 230, easing: 'ease-in-out' }
			),
			a.animate(
				[
					{ opacity: 0.17, transform: 'scale(1)' },
					{ opacity: 0.07, transform: 'scale(.7)', offset: 0.45 },
					{ opacity: 0.17, transform: 'scale(1)' }
				],
				{ duration: 230, easing: 'ease-in-out' }
			));
		const r = setTimeout(
			() => {
				(J.delete(r), document.hidden || S.play('step'));
			},
			W ? 0 : 230
		);
		J.add(r);
	}
	function he() {
		(clearInterval(N),
			(N = null),
			clearTimeout(I),
			(I = null),
			G() && A('settings-modal').close(),
			A('settings-home').append(
				A('settings')
			),
			(A('settings-close').hidden = !0),
			(A('settings-changed').hidden = !0),
			A('settings-drawer').classList.remove(
				'open'
			),
			(A('settings-drawer').hidden = !0),
			(A('settings-drawer').inert = !0),
			A('settings-open').setAttribute(
				'aria-expanded',
				'false'
			),
			(k = 0),
			(R = 0),
			Le());
	}
	function fe() {
		(ae(),
			re(),
			he(),
			oe(),
			(D = null),
			(x = {
				version: 4,
				phase: 'ready',
				elapsed: 0,
				turns: 0,
				awayAt: null,
				awaySource: null,
				step: 0,
				retreatStep: 0,
				phase: 'approach'
			}),
			te(),
			ne(Date.now(), !0),
			m.start(!0),
			T('game_start'),
			ye(!0),
			de(),
			document.hidden && ve());
	}
	function me() {
		(ae(),
			re(),
			he(),
			oe(),
			(D = null),
			(x = {
				version: 4,
				phase: 'ready',
				elapsed: 0,
				turns: 0,
				awayAt: null,
				awaySource: null,
				step: 0,
				retreatStep: 0
			}),
			te(),
			ne(),
			ye(!0),
			de());
	}
	function ye(e = !1) {
		const t = H(),
			n = x.phase,
			s = ['ready', 'approach'].includes(n),
			o = ['declare', 'walking'].includes(n);
		(A('intro').classList.toggle('initial', s),
			A('headline').replaceChildren(),
			s
				? t.intro.split('
').forEach((e, t) => {
						const n = document.createElement('span'),
							a = 'ja' === E ? '鬼' : 'it';
						if (0 === t && e.includes(a)) {
							const t = e.indexOf(a),
								r = document.createElement('em');
							((r.className = 'oni-word'),
								(r.textContent = a),
								n.append(e.slice(0, t), r, e.slice(t + a.length)));
						} else n.textContent = e;
						A('headline').append(n);
					})
				: (A('headline').textContent = o
						? t.turns(x.turns)
						: t[
								{
									tagged: 'tagged',
									retreat: 'escape',
									collapsing: 'collapse',
									won: 'won',
									short: 'short',
									fallen: 'fallen'
								}[n]
							]));
		const l = o
			? t.rules
			: 'won' === n
				? t.winNote
				: 'short' === n
					? t.shortNote(5 - x.step)
					: 'fallen' === n
						? t.fallNote
						: '';
		((A('description').textContent = l),
			(A('description').hidden = !l));
		const i =
			'ready' === n
				? t.start
				: 'declare' === n
					? t.walk
					: ['won', 'short', 'fallen'].includes(n)
						? t.again
						: null;
		((A('action').hidden = !i),
			i && (A('action').textContent = i));
		const c = b();
		((A('share-area').hidden = 'won' !== n),
			(A('share-x').disabled = !c),
			(A('share-note').hidden = Boolean(c)));
		const d = G() && 'approach' === x.phase ? a(x, Date.now()) : x,
			u = r(d),
			p = [
				'collapsing',
				'declare',
				'walking',
				'won',
				'short',
				'fallen'
			].includes(n);
		j && K(A('pawn-speech'), 'oni' === B ? x.step : u);
		const g = (d.elapsed % 1e3) / 1e3;
		for (const e of Q) {
			const t =
				['ready', 'approach'].includes(n) &&
				Number(e.dataset.index) === u;
			(e.classList.toggle('runner-cell', t),
				t
					? e.style.setProperty(
							'--runner-passed-angle',
							360 * g + 'deg'
						)
					: e.style.removeProperty(
							'--runner-passed-angle'
						));
		}
		for (const t of ['oni', 'runner'])
			(A(t).classList.toggle('instant', e),
				A(t).classList.toggle('caught', 'won' === n));
		(K(A('runner'), u),
			K(A('oni'), x.step),
			e || null === M || M === u || ge('runner'),
			e || null === O || O === x.step || 'fallen' === n || ge('oni'),
			(M = u),
			(O = x.step),
			A('oni').classList.toggle('fall', 'fallen' === n),
			A('board').classList.toggle('collapsed', p),
			A('board').classList.toggle('instant', e),
			(A('step').hidden = 'walking' !== n),
			(A('step').textContent = t.steps(x.step)),
			A('board').setAttribute(
				'aria-label',
				'fallen' === n ? t.fallBoard : t.board(x.step, u, p)
			),
			'declare' === n && x.turns >= 10 && D !== x.turns
				? ((D = x.turns), le('hardCount', 5e3))
				: 'declare' !== n &&
					((D = null), 'hardCount' === j && oe()),
			ce());
	}
	function we() {
		const e = H();
		((document.documentElement.lang = E),
			(document.title = e.pageTitle),
			document
				.querySelectorAll('[data-i18n]')
				.forEach((t) => (t.textContent = e[t.dataset.i18n])));
		for (const t of [
			'settings',
			'settings-open'
		])
			A(t).setAttribute('aria-label', e.settings);
		(A('language-toggle').setAttribute(
			'aria-label',
			e.toggle
		),
			A('settings-close').setAttribute(
				'aria-label',
				e.closeSettings
			),
			A('records-close').setAttribute(
				'aria-label',
				e.closeRecords
			),
			A('runner').setAttribute(
				'aria-label',
				e.runnerLabel
			),
			A('oni').setAttribute('aria-label', e.oniLabel),
			j && (A('pawn-speech').textContent = e[j]),
			A('lang-ja').classList.toggle(
				'active',
				'ja' === E
			),
			A('lang-en').classList.toggle(
				'active',
				'en' === E
			),
			(A('sound-toggle').textContent = S.enabled
				? e.seOn
				: e.seOff),
			A('sound-toggle').setAttribute(
				'aria-pressed',
				String(S.enabled)
			),
			ye(!0));
	}
	function Se() {
		document.hidden ||
			se() ||
			('tagged' === x.phase
				? (ye(!0),
					pe(() => {
						((x.phase = 'retreat'), (x.retreatStep = 0), te(), ye(), Se());
					}, 850))
				: 'retreat' === x.phase
					? pe(() => {
							(x.retreatStep < 5
								? x.retreatStep++
								: (x.phase = 'collapsing'),
								te(),
								ye(),
								Se());
						}, V)
					: 'collapsing' === x.phase
						? pe(() => {
								((x.phase = 'declare'), te(), ye());
							}, 1100)
						: 'walking' === x.phase &&
							pe(() => {
								((x = (function (e) {
									if ('walking' !== e.phase) return e;
									const t = e.step + 1,
										n =
											t > 5
												? 'fallen'
												: t >= e.turns
													? 5 === t
														? 'won'
														: 'short'
													: 'walking';
									return { ...e, step: t, phase: n };
								})(x)),
									te(),
									ye(),
									'walking' !== x.phase &&
										(m.finish(x),
										T(
											'won' === x.phase
												? 'game_clear'
												: 'game_over',
											{ game_result: x.phase, steps: x.step, turns: x.turns }
										)),
									Se());
							}, V));
	}
	function ve() {
		(ae(), re(), clearTimeout(P), (P = null), (x = n(x, Date.now())), te());
	}
	function be(e = Y) {
		if (document.hidden || !z) return;
		if (G()) return void ye(!0);
		const t = M;
		((x = a(x, Date.now(), e)),
			te(),
			ye(!0),
			(Y = !1),
			null !== t &&
				t !== M &&
				['approach', 'tagged'].includes(x.phase) &&
				ge('runner'),
			Se());
	}
	function xe(e = Date.now(), t = _) {
		const a = e - t;
		return (
			!(
				document.hidden ||
				se() ||
				X() ||
				'approach' !== x.phase ||
				null !== x.awayAt ||
				Y
			) &&
			a >= 1e3 &&
			((x = n(x, t)), te(), !0)
		);
	}
	function Ae() {
		if (document.hidden) return;
		const e = Date.now();
		(xe(e),
			(_ = e),
			(z = !0),
			be(),
			cancelAnimationFrame($),
			($ = requestAnimationFrame(() => {
				(($ = null),
					document.hidden ||
						((z = !0), be(!1), ee(), A('board').offsetWidth, ce(!0)));
			})));
	}
	function Le() {
		try {
			localStorage.setItem(
				'daruma-settings-opens',
				String(R)
			);
		} catch {}
	}
	(new ResizeObserver(ee).observe(A('board-space')),
		A('settings-open').addEventListener(
			'click',
			() => {
				if (
					'true' ===
					A('settings-open').getAttribute(
						'aria-expanded'
					)
				)
					return (
						clearTimeout(I),
						A('settings-drawer').classList.remove(
							'open'
						),
						(A('settings-drawer').inert = !0),
						A('settings-open').setAttribute(
							'aria-expanded',
							'false'
						),
						(k = 0),
						void (I = setTimeout(
							() => {
								A('settings-drawer').hidden = !0;
							},
							W ? 0 : 380
						))
					);
				0 === R
					? ('ready' === x.phase && fe(),
						ae(),
						(A('settings-changed').hidden = !0),
						(A('settings-close').hidden = !1),
						A(
							'settings-modal-body'
						).append(A('settings')),
						A('settings-modal').showModal(),
						A('settings-open').setAttribute(
							'aria-expanded',
							'true'
						),
						(x = n(x, Date.now(), 'settings')),
						te(),
						(R = 1),
						Le(),
						(N = setInterval(() => {
							!document.hidden && G() && 'approach' === x.phase && ye();
						}, 100)))
					: ((R = 2),
						Le(),
						clearTimeout(I),
						A('settings-home').append(
							A('settings')
						),
						(A('settings-close').hidden = !0),
						(A('settings-changed').hidden = !1),
						(A('settings-drawer').hidden = !1),
						(A('settings-drawer').inert = !1),
						A(
							'settings-drawer'
						).getBoundingClientRect(),
						requestAnimationFrame(() => {
							A('settings-drawer').hidden ||
								A('settings-drawer').inert ||
								A('settings-drawer').classList.add(
									'open'
								);
						}),
						A('settings-open').setAttribute(
							'aria-expanded',
							'true'
						));
			}
		),
		A('settings-close').addEventListener(
			'click',
			() => A('settings-modal').close()
		),
		A('settings-modal').addEventListener(
			'close',
			() => {
				(clearInterval(N),
					(N = null),
					re(),
					(k = 0),
					A('settings-home').append(
						A('settings')
					),
					(A('settings-close').hidden = !0),
					A('settings-open').setAttribute(
						'aria-expanded',
						'false'
					),
					be(),
					ce(!0));
			}
		),
		A('action').addEventListener('click', () => {
			'declare' === x.phase
				? ((x.phase = 'walking'), (x.step = 0), te(), ye(), Se())
				: [
						'ready',
						'won',
						'short',
						'fallen'
					].includes(x.phase) && fe();
		}),
		A('restart').addEventListener('click', () => {
			[
				'ready',
				'won',
				'short',
				'fallen'
			].includes(x.phase)
				? me()
				: (ae(), A('reset-dialog').showModal());
		}),
		A('cancel-reset').addEventListener(
			'click',
			() => A('reset-dialog').close()
		),
		A('reset-dialog').addEventListener(
			'close',
			() => {
				(Se(), ce(!0));
			}
		),
		A('confirm-reset').addEventListener(
			'click',
			() => {
				(A('reset-dialog').close(), me());
			}
		),
		A('language-toggle').addEventListener(
			'click',
			() => {
				E = 'ja' === E ? 'en' : 'ja';
				try {
					localStorage.setItem('daruma-language', E);
				} catch {}
				(we(),
					8 === ++k &&
						((k = 0),
						(async function () {
							(ae(),
								A('records').showModal(),
								(A('records-message').textContent =
									H().loading));
							for (const e of [
								'plays',
								'clears',
								'rate',
								'falls',
								'max-step'
							])
								A('record-' + e).textContent = '—';
							try {
								const e = await m.summary();
								((A('record-plays').textContent =
									e.plays.toLocaleString(E)),
									(A('record-clears').textContent =
										e.clears.toLocaleString(E)),
									(A('record-rate').textContent =
										e.rate.toLocaleString(E) + '%'),
									(A('record-falls').textContent =
										e.falls.toLocaleString(E)),
									(A('record-max-step').textContent =
										H().steps(e.maxStep)),
									(A('records-message').textContent =
										''));
							} catch {
								A('records-message').textContent =
									navigator.onLine ? H().unavailable : H().offline;
							}
						})()));
			}
		),
		A('sound-toggle').addEventListener(
			'click',
			() => {
				(S.toggle(), we());
			}
		),
		A('share-x').addEventListener('click', () => {
			const e = b();
			'won' === x.phase &&
				e &&
				(T('share', {
					method: 'X',
					content_type: 'game',
					item_id: 'darumas'
				}),
				window.open(
					e,
					'_blank',
					'noopener,noreferrer'
				));
		}),
		document.addEventListener(
			'pointerdown',
			(e) => {
				(de(),
					document.hidden || null === x.awayAt || Ae(),
					e.target.closest('button,a') && S.unlock());
			},
			{ capture: !0 }
		),
		document.addEventListener('keydown', de, { capture: !0 }),
		document.addEventListener(
			'click',
			(e) => {
				e.target.closest('button,a') &&
					(S.unlock(), S.play('click'));
			},
			{ capture: !0 }
		),
		A('runner').addEventListener('click', () =>
			ue(
				'runner',
				'touchSpeech',
				'runnerRareSpeech'
			)
		),
		A('oni').addEventListener('click', () =>
			ue(
				'oni',
				'oniTouchSpeech',
				'oniRareSpeech'
			)
		),
		A('records-close').addEventListener(
			'click',
			() => A('records').close()
		),
		A('records').addEventListener('close', () => {
			(Se(), ce(!0));
		}),
		document.addEventListener(
			'visibilitychange',
			() => {
				document.hidden ? ((z = !1), ve()) : Ae();
			}
		),
		window.addEventListener('blur', () => {
			((z = !1), ve());
		}),
		window.addEventListener('focus', Ae),
		window.addEventListener('pagehide', () => {
			((z = !1), ve());
		}),
		window.addEventListener('pageshow', Ae),
		document.addEventListener('resume', Ae),
		we(),
		[
			'ready',
			'won',
			'short',
			'fallen'
		].includes(x.phase) || m.start(!1),
		!document.hidden && z ? be() : ye(!0),
		ce(!0),
		requestAnimationFrame(function e() {
			const t = Date.now(),
				n = _,
				a = t - n;
			((_ = t),
				document.hidden ||
					se() ||
					X() ||
					(null !== x.awayAt && (z || a > 500)
						? ((z = !0), be(), A('runner').getBoundingClientRect())
						: xe(t, n) &&
							((z = !0), be(!1), A('runner').getBoundingClientRect())),
				ne(t),
				requestAnimationFrame(e));
		}));
})();
