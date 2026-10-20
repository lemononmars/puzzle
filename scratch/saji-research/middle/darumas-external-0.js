(() => {
	var e = '\x64\x61\x72\x75\x6d\x61\x2d\x70\x75\x7a\x7a\x6c\x65\x2d\x76\x34',
		t = (e) => {
			const t = Math.floor(e / 3),
				n = e % 3;
			return { x: t % 2 ? 2 - n : n, y: 3 - t };
		};
	function n(e, t, n = '\x70\x61\x67\x65') {
		return '\x61\x70\x70\x72\x6f\x61\x63\x68' !== e.phase || null !== e.awayAt
			? e
			: { ...e, turns: e.turns + 1, awayAt: t, awaySource: n };
	}
	function a(e, t, n = !1) {
		if ('\x61\x70\x70\x72\x6f\x61\x63\x68' !== e.phase || null === e.awayAt) return e;
		if (n && '\x73\x65\x74\x74\x69\x6e\x67\x73' !== e.awaySource)
			return { ...e, awayAt: null, awaySource: null, turns: Math.max(0, e.turns - 1) };
		const a = Math.min(11e3, e.elapsed + Math.max(0, t - e.awayAt));
		return {
			...e,
			awayAt: null,
			awaySource: null,
			elapsed: a,
			phase: a >= 11e3 ? '\x74\x61\x67\x67\x65\x64' : '\x61\x70\x70\x72\x6f\x61\x63\x68'
		};
	}
	var r = (e) =>
			'\x72\x65\x61\x64\x79' === e.phase
				? 11
				: '\x61\x70\x70\x72\x6f\x61\x63\x68' === e.phase
					? Math.max(0, 11 - Math.floor(e.elapsed / 1e3))
					: '\x74\x61\x67\x67\x65\x64' === e.phase
						? 0
						: '\x72\x65\x74\x72\x65\x61\x74' === e.phase
							? e.retreatStep
							: 5,
		s = {
			ja: {
				title: '\u3060\u308b\u307e\u3055\u3093\u304c',
				pageTitle: '\u3060\u308b\u307e\u3055\u3093\u304c\uff5c\x57\x45\x42\u8b0e',
				restart: '\u6700\u521d\u304b\u3089',
				settings: '\u8a2d\u5b9a',
				language: '\u8868\u793a\u8a00\u8a9e',
				toggle: '\u82f1\u8a9e\u306b\u5207\u308a\u66ff\u3048\u308b',
				hints: '\u30d2\u30f3\u30c8\u30fb\u89e3\u8aac\x20\u2197',
				paidNote:
					'\u3059\u3079\u3066\u306e\x57\x45\x42\u8b0e\u306e\u30d2\u30f3\u30c8\u3068\u89e3\u8aac\u3092\u3001\u3053\u306e\u6709\u6599\u8a18\u4e8b\u3072\u3068\u3064\u3067\u697d\u3057\u3081\u307e\u3059\u3002',
				games: '\u4ed6\u306e\u30b2\u30fc\u30e0\x20\u2197',
				resetTitle: '\u3082\u3046\u4e00\u5ea6\u3001\u306f\u3058\u3081\u308b\uff1f',
				resetBody:
					'\u4eca\u306e\u52dd\u8ca0\u3092\u7d42\u3048\u3066\u3001\u6700\u521d\u306e\u4f4d\u7f6e\u306b\u623b\u308a\u307e\u3059\u3002',
				cancel: '\u3082\u3069\u308b',
				resetConfirm: '\u306f\u3058\u3081\u308b',
				records: '\u8a18\u9332',
				closeRecords: '\u8a18\u9332\u3092\u9589\u3058\u308b',
				recordsNotice:
					'\u3053\u306e\u753b\u9762\u306f\u8b0e\u89e3\u304d\u3068\u306f\u95a2\u4fc2\u3042\u308a\u307e\u305b\u3093\u3002',
				plays: '\u7dcf\u30d7\u30ec\u30a4\u56de\u6570',
				clears: '\u30af\u30ea\u30a2\u56de\u6570',
				rate: '\u30af\u30ea\u30a2\u7387',
				falls: '\u9b3c\u304c\u5d16\u306b\u843d\u3061\u305f\u6570',
				maxStep: '\u9b3c\u306e\u6307\u5b9a\u6700\u5927\u6b69\u6570',
				recordsScope:
					'\u5168\u4f53\u306e\u8a18\u9332\u3067\u3059\u3002\u30d7\u30ec\u30a4\u30fb\u30af\u30ea\u30a2\u306f\u540c\u3058\u30d6\u30e9\u30a6\u30b6\u306b\u3064\u304d\u5404\x31\u56de\u3067\u3059\u3002',
				loading: '\u8aad\u307f\u8fbc\u307f\u4e2d\u2026',
				unavailable:
					'\u8a18\u9332\u3092\u53d6\u5f97\u3067\u304d\u307e\u305b\u3093\u3002\u6642\u9593\u3092\u304a\u3044\u3066\u304a\u8a66\u3057\u304f\u3060\u3055\u3044\u3002',
				offline:
					'\u901a\u4fe1\u304c\u5207\u308c\u3066\u3044\u307e\u3059\u3002\u63a5\u7d9a\u5f8c\u306b\u3054\u78ba\u8a8d\u304f\u3060\u3055\u3044\u3002',
				settingsChanged:
					'\u8a2d\u5b9a\u753b\u9762\u304c\u3058\u3083\u307e\u306b\u306a\u308b\u304b\u3089\u898b\u3048\u65b9\u3092\u5909\u66f4\u3057\u305f\u3088\uff01',
				settingsNotice:
					'\u3053\u306e\u753b\u9762\u306e\u8a2d\u5b9a\u3001\u5185\u5bb9\u306f\u8b0e\u89e3\u304d\u3068\u306f\u95a2\u4fc2\u3042\u308a\u307e\u305b\u3093\u3002',
				closeSettings: '\u8a2d\u5b9a\u3092\u9589\u3058\u308b',
				se: '\u52b9\u679c\u97f3',
				seOn: '\u30aa\u30f3',
				seOff: '\u30aa\u30d5',
				intro:
					'\u30ad\u30df\u304c\u9b3c\u3060\u3088\uff01\x0a\u898b\u3066\u3044\u306a\u3044\u9593\u306b\u3001\u30bf\u30c3\u30c1\u3059\u308b\u3088\u3002',
				start: '\u306f\u3058\u3081\u308b',
				walk: '\u6b69\u304f',
				again: '\u3082\u3046\u4e00\u5ea6',
				share: '\x58\u3067\u30b7\u30a7\u30a2',
				sharePending:
					'\u30b7\u30a7\u30a2\u306f\u516c\u958b\u6642\u306b\u5229\u7528\u3067\u304d\u307e\u3059\u3002',
				tagged: '\u30bf\u30c3\u30c1\uff01',
				escape: '\u306b\u3052\u308d\uff01',
				collapse: '\u3042\u3063\u2026\u2026\uff01',
				won: '\u3064\u304b\u307e\u3048\u305f\uff01',
				short: '\u5c4a\u304b\u306a\u304b\u3063\u305f\u3002',
				fallen: '\u884c\u304d\u3059\u304e\u305f\u3002',
				winNote: '\u3053\u3093\u3069\u306f\u3001\u307c\u304f\u304c\u9b3c\u3060\u306d\u3002',
				fallNote: '\u5d16\u306b\u843d\u3061\u3066\u3057\u307e\u3063\u305f\u3002',
				rules:
					'\u8a00\u308f\u308c\u305f\u6b69\u6570\u3060\u3051\u9032\u3093\u3067\u3002\x0a\u30d4\u30c3\u30bf\u30ea\u6b62\u307e\u3089\u306a\u3044\u3068\u6355\u307e\u3048\u3089\u308c\u306a\u3044\u3088\uff01',
				turns: (e) => `\u9b3c\u3055\u3093\u3001${e}\u6b69\uff01`,
				shortNote: (e) => `\u3042\u3068${e}\u6b69\u3002`,
				steps: (e) => `${e}\u6b69`,
				runnerLabel: '\u30c0\u30eb\u30de',
				oniLabel: '\u9b3c',
				hardCount: '\u6570\u3048\u308b\u306e\u5927\u5909\u3060\u3063\u305f\u3088\u2026',
				touchSpeech: '\u3055\u308f\u3063\u3066\u3082\u4f55\u3082\u306a\u3044\u3088',
				runnerRareSpeech: '\u898b\u3066\u3044\u305f\u3089\u52d5\u3051\u306a\u3044\u3088',
				oniTouchSpeech: '\u305d\u308d\u305d\u308d\u59cb\u3081\u3088\u3046\u304b\u306a',
				oniRareSpeech:
					'\u7d76\u5bfe\u306b\u3074\u3063\u305f\u308a\u6355\u307e\u3048\u308b\u305e\uff01',
				idleSpeech: '\u305d\u308d\u305d\u308d\u59cb\u3081\u308b\uff1f',
				board: (e, t, n) =>
					`3\u52174\u884c\u306e12\u30de\u30b9\u3002\u9752\u3044\u9b3c\u306f\u958b\u59cb\u4f4d\u7f6e\u304b\u3089${e}\u6b69\u3001\u8d64\u3044\u30c0\u30eb\u30de\u306f${t}\u6b69\u306e\u4f4d\u7f6e\u3002${n ? '\x36\u301c\x31\x31\u6b69\u5148\u306e\x36\u30de\u30b9\u306f\u5d29\u308c\u3066\u5d16\u306b\u306a\u3063\u305f\u3002' : ''}`,
				fallBoard: '\u9b3c\u304c\x36\u6b69\u76ee\u3067\u5d16\u306b\u843d\u3061\u305f\u3002'
			},
			en: {
				title: '\x44\x61\x72\x75\x6d\x61\x2d\x73\x61\x6e\x20\x67\x61',
				pageTitle:
					'\x44\x61\x72\x75\x6d\x61\x2d\x73\x61\x6e\x20\x67\x61\x20\x7c\x20\x57\x65\x62\x20\x50\x75\x7a\x7a\x6c\x65',
				restart: '\x52\x65\x73\x74\x61\x72\x74',
				settings: '\x53\x65\x74\x74\x69\x6e\x67\x73',
				language: '\x4c\x61\x6e\x67\x75\x61\x67\x65',
				toggle: '\x53\x77\x69\x74\x63\x68\x20\x74\x6f\x20\x4a\x61\x70\x61\x6e\x65\x73\x65',
				hints: '\x48\x69\x6e\x74\x73\x20\x26\x20\x73\x6f\x6c\x75\x74\x69\x6f\x6e\x20\u2197',
				paidNote:
					'\x48\x69\x6e\x74\x73\x20\x61\x6e\x64\x20\x73\x6f\x6c\x75\x74\x69\x6f\x6e\x73\x20\x66\x6f\x72\x20\x61\x6c\x6c\x20\x6f\x75\x72\x20\x77\x65\x62\x20\x70\x75\x7a\x7a\x6c\x65\x73\x20\x69\x6e\x20\x6f\x6e\x65\x20\x70\x61\x69\x64\x20\x61\x72\x74\x69\x63\x6c\x65\x20\x28\x4a\x61\x70\x61\x6e\x65\x73\x65\x29\x2e',
				games: '\x4d\x6f\x72\x65\x20\x67\x61\x6d\x65\x73\x20\u2197',
				resetTitle: '\x53\x74\x61\x72\x74\x20\x61\x67\x61\x69\x6e\x3f',
				resetBody:
					'\x45\x6e\x64\x20\x74\x68\x69\x73\x20\x72\x6f\x75\x6e\x64\x20\x61\x6e\x64\x20\x72\x65\x74\x75\x72\x6e\x20\x74\x6f\x20\x74\x68\x65\x20\x73\x74\x61\x72\x74\x69\x6e\x67\x20\x70\x6f\x73\x69\x74\x69\x6f\x6e\x73\x2e',
				cancel: '\x42\x61\x63\x6b',
				resetConfirm: '\x53\x74\x61\x72\x74\x20\x61\x67\x61\x69\x6e',
				records: '\x52\x65\x63\x6f\x72\x64\x73',
				closeRecords: '\x43\x6c\x6f\x73\x65\x20\x72\x65\x63\x6f\x72\x64\x73',
				recordsNotice:
					'\x54\x68\x69\x73\x20\x73\x63\x72\x65\x65\x6e\x20\x69\x73\x20\x6e\x6f\x74\x20\x70\x61\x72\x74\x20\x6f\x66\x20\x74\x68\x65\x20\x70\x75\x7a\x7a\x6c\x65\x2e',
				plays: '\x54\x6f\x74\x61\x6c\x20\x70\x6c\x61\x79\x65\x72\x73',
				clears: '\x50\x6c\x61\x79\x65\x72\x73\x20\x77\x68\x6f\x20\x63\x6c\x65\x61\x72\x65\x64',
				rate: '\x43\x6c\x65\x61\x72\x20\x72\x61\x74\x65',
				falls:
					'\x54\x69\x6d\x65\x73\x20\x74\x68\x65\x20\x63\x68\x61\x73\x65\x72\x20\x66\x65\x6c\x6c',
				maxStep:
					'\x48\x69\x67\x68\x65\x73\x74\x20\x61\x73\x73\x69\x67\x6e\x65\x64\x20\x73\x74\x65\x70\x20\x63\x6f\x75\x6e\x74',
				recordsScope:
					'\x54\x6f\x74\x61\x6c\x73\x20\x61\x63\x72\x6f\x73\x73\x20\x61\x6c\x6c\x20\x70\x6c\x61\x79\x65\x72\x73\x2e\x20\x50\x6c\x61\x79\x73\x20\x61\x6e\x64\x20\x63\x6c\x65\x61\x72\x73\x20\x63\x6f\x75\x6e\x74\x20\x6f\x6e\x63\x65\x20\x70\x65\x72\x20\x62\x72\x6f\x77\x73\x65\x72\x2e',
				loading: '\x4c\x6f\x61\x64\x69\x6e\x67\u2026',
				unavailable:
					'\x52\x65\x63\x6f\x72\x64\x73\x20\x61\x72\x65\x20\x75\x6e\x61\x76\x61\x69\x6c\x61\x62\x6c\x65\x2e\x20\x50\x6c\x65\x61\x73\x65\x20\x74\x72\x79\x20\x61\x67\x61\x69\x6e\x20\x6c\x61\x74\x65\x72\x2e',
				offline:
					'\x59\x6f\x75\x20\x61\x72\x65\x20\x6f\x66\x66\x6c\x69\x6e\x65\x2e\x20\x50\x6c\x65\x61\x73\x65\x20\x72\x65\x63\x6f\x6e\x6e\x65\x63\x74\x20\x74\x6f\x20\x76\x69\x65\x77\x20\x72\x65\x63\x6f\x72\x64\x73\x2e',
				settingsChanged:
					'\x53\x65\x74\x74\x69\x6e\x67\x73\x20\x67\x6f\x74\x20\x69\x6e\x20\x74\x68\x65\x20\x77\x61\x79\x2c\x20\x73\x6f\x20\x49\x20\x63\x68\x61\x6e\x67\x65\x64\x20\x68\x6f\x77\x20\x74\x68\x65\x79\x20\x6f\x70\x65\x6e\x21',
				settingsNotice:
					'\x54\x68\x65\x20\x73\x65\x74\x74\x69\x6e\x67\x73\x20\x61\x6e\x64\x20\x63\x6f\x6e\x74\x65\x6e\x74\x20\x6f\x6e\x20\x74\x68\x69\x73\x20\x73\x63\x72\x65\x65\x6e\x20\x61\x72\x65\x20\x6e\x6f\x74\x20\x70\x61\x72\x74\x20\x6f\x66\x20\x74\x68\x65\x20\x70\x75\x7a\x7a\x6c\x65\x2e',
				closeSettings: '\x43\x6c\x6f\x73\x65\x20\x73\x65\x74\x74\x69\x6e\x67\x73',
				se: '\x53\x6f\x75\x6e\x64\x20\x65\x66\x66\x65\x63\x74\x73',
				seOn: '\x4f\x6e',
				seOff: '\x4f\x66\x66',
				intro:
					'\x59\x6f\x75\u2019\x72\x65\x20\x69\x74\x21\x0a\x49\u2019\x6c\x6c\x20\x74\x61\x67\x20\x79\x6f\x75\x20\x77\x68\x69\x6c\x65\x20\x79\x6f\x75\u2019\x72\x65\x20\x6e\x6f\x74\x20\x6c\x6f\x6f\x6b\x69\x6e\x67\x2e',
				start: '\x53\x74\x61\x72\x74',
				walk: '\x57\x61\x6c\x6b',
				again: '\x50\x6c\x61\x79\x20\x61\x67\x61\x69\x6e',
				share: '\x53\x68\x61\x72\x65\x20\x6f\x6e\x20\x58',
				sharePending:
					'\x53\x68\x61\x72\x69\x6e\x67\x20\x77\x69\x6c\x6c\x20\x62\x65\x20\x61\x76\x61\x69\x6c\x61\x62\x6c\x65\x20\x61\x74\x20\x6c\x61\x75\x6e\x63\x68\x2e',
				tagged: '\x54\x61\x67\x21',
				escape: '\x52\x75\x6e\x21',
				collapse: '\x55\x68\x2d\x6f\x68\u2026',
				won: '\x43\x61\x75\x67\x68\x74\x20\x79\x6f\x75\x21',
				short: '\x4e\x6f\x74\x20\x66\x61\x72\x20\x65\x6e\x6f\x75\x67\x68\x2e',
				fallen: '\x54\x6f\x6f\x20\x66\x61\x72\x21',
				winNote:
					'\x4e\x6f\x77\x20\x69\x74\u2019\x73\x20\x6d\x79\x20\x74\x75\x72\x6e\x20\x74\x6f\x20\x62\x65\x20\x69\x74\x2e',
				fallNote:
					'\x59\x6f\x75\x20\x66\x65\x6c\x6c\x20\x6f\x66\x66\x20\x74\x68\x65\x20\x63\x6c\x69\x66\x66\x2e',
				rules:
					'\x54\x61\x6b\x65\x20\x74\x68\x65\x20\x6e\x75\x6d\x62\x65\x72\x20\x6f\x66\x20\x73\x74\x65\x70\x73\x20\x79\x6f\x75\u2019\x72\x65\x20\x74\x6f\x6c\x64\x2e\x0a\x59\x6f\x75\x20\x6d\x75\x73\x74\x20\x73\x74\x6f\x70\x20\x69\x6e\x20\x65\x78\x61\x63\x74\x6c\x79\x20\x74\x68\x65\x20\x72\x69\x67\x68\x74\x20\x73\x70\x6f\x74\x20\x74\x6f\x20\x63\x61\x74\x63\x68\x20\x6d\x65\x21',
				turns: (e) => `Take ${e} ${1 === e ? '\x73\x74\x65\x70' : '\x73\x74\x65\x70\x73'}!`,
				shortNote: (e) => `${e} ${1 === e ? '\x73\x74\x65\x70' : '\x73\x74\x65\x70\x73'} short.`,
				steps: (e) => `${e} ${1 === e ? '\x73\x74\x65\x70' : '\x73\x74\x65\x70\x73'}`,
				runnerLabel: '\x44\x61\x72\x75\x6d\x61',
				oniLabel: '\x43\x68\x61\x73\x65\x72',
				hardCount:
					'\x54\x68\x61\x74\x20\x77\x61\x73\x20\x61\x20\x6c\x6f\x74\x20\x74\x6f\x20\x63\x6f\x75\x6e\x74\u2026',
				touchSpeech:
					'\x4e\x6f\x74\x68\x69\x6e\x67\x20\x68\x61\x70\x70\x65\x6e\x73\x20\x69\x66\x20\x79\x6f\x75\x20\x74\x6f\x75\x63\x68\x20\x6d\x65\x2e',
				runnerRareSpeech:
					'\x49\x20\x63\x61\x6e\x27\x74\x20\x6d\x6f\x76\x65\x20\x77\x68\x69\x6c\x65\x20\x79\x6f\x75\x27\x72\x65\x20\x77\x61\x74\x63\x68\x69\x6e\x67\x2e',
				oniTouchSpeech:
					'\x4d\x61\x79\x62\x65\x20\x49\x20\x73\x68\x6f\x75\x6c\x64\x20\x67\x65\x74\x20\x73\x74\x61\x72\x74\x65\x64\x2e',
				oniRareSpeech:
					'\x49\x27\x6c\x6c\x20\x63\x61\x74\x63\x68\x20\x79\x6f\x75\x20\x69\x6e\x20\x65\x78\x61\x63\x74\x6c\x79\x20\x74\x68\x65\x20\x72\x69\x67\x68\x74\x20\x73\x70\x6f\x74\x21',
				idleSpeech: '\x52\x65\x61\x64\x79\x20\x74\x6f\x20\x73\x74\x61\x72\x74\x3f',
				board: (e, t, n) =>
					`Twelve squares in three columns and four rows, including your starting square. You are ${e} steps from the start; the runner is ${t} steps away.${n ? '\x20\x54\x68\x65\x20\x73\x69\x78\x20\x73\x71\x75\x61\x72\x65\x73\x20\x36\u2013\x31\x31\x20\x73\x74\x65\x70\x73\x20\x61\x77\x61\x79\x20\x68\x61\x76\x65\x20\x63\x6f\x6c\x6c\x61\x70\x73\x65\x64\x20\x69\x6e\x74\x6f\x20\x61\x20\x63\x6c\x69\x66\x66\x2e' : ''}`,
				fallBoard:
					'\x59\x6f\x75\x20\x66\x65\x6c\x6c\x20\x6f\x66\x66\x20\x74\x68\x65\x20\x63\x6c\x69\x66\x66\x20\x6f\x6e\x20\x73\x74\x65\x70\x20\x36\x2e'
			}
		},
		o = '\x64\x61\x72\x75\x6d\x61\x2d\x72\x65\x63\x6f\x72\x64\x73\x2d\x76\x31\x2d',
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
				l('\x70\x65\x6e\x64\x69\x6e\x67\x2d\x72\x65\x73\x75\x6c\x74\x73') || '\x5b\x5d'
			);
			return Array.isArray(e) ? e.filter((e) => e && c(e.event)).slice(-50) : [];
		} catch {
			return [];
		}
	}
	function p(e) {
		i('\x70\x65\x6e\x64\x69\x6e\x67\x2d\x72\x65\x73\x75\x6c\x74\x73', JSON.stringify(e.slice(-50)));
	}
	function g(e = !1) {
		let t = e ? null : l('\x72\x75\x6e');
		return (c(t) || ((t = crypto.randomUUID()), i('\x72\x75\x6e', t)), t);
	}
	async function h(e, t) {
		const n = new AbortController(),
			a = setTimeout(() => n.abort(), 7e3);
		try {
			const a = await fetch('\x2e\x2f\x72\x65\x63\x6f\x72\x64\x73\x2e\x70\x68\x70', {
				method: e,
				cache: '\x6e\x6f\x2d\x73\x74\x6f\x72\x65',
				credentials: '\x73\x61\x6d\x65\x2d\x6f\x72\x69\x67\x69\x6e',
				signal: n.signal,
				...(t
					? {
							headers: {
								'\x43\x6f\x6e\x74\x65\x6e\x74\x2d\x54\x79\x70\x65':
									'\x61\x70\x70\x6c\x69\x63\x61\x74\x69\x6f\x6e\x2f\x6a\x73\x6f\x6e'
							},
							body: JSON.stringify(t)
						}
					: {})
			});
			if (!a.ok) throw new Error('\x75\x6e\x61\x76\x61\x69\x6c\x61\x62\x6c\x65');
			return '\x47\x45\x54' === e ? await a.json() : null;
		} finally {
			clearTimeout(a);
		}
	}
	async function f() {
		if (d) return d;
		if (!/^https?:$/.test(location.protocol) || !navigator.onLine) return;
		const e = (function () {
			let e = l('\x69\x64');
			return c(e) ? e : ((e = crypto.randomUUID()), i('\x69\x64', e) ? e : null);
		})();
		if (e) {
			d = (async () => {
				try {
					('\x31' === l('\x70\x65\x6e\x64\x69\x6e\x67\x2d\x63\x6c\x65\x61\x72') &&
						'\x31' !== l('\x63\x6c\x65\x61\x72') &&
						(await h('\x50\x4f\x53\x54', {
							id: e,
							action: '\x63\x6c\x65\x61\x72',
							turns: 5,
							step: 5,
							elapsed: 11e3
						}),
						i('\x70\x6c\x61\x79', '\x31'),
						i('\x63\x6c\x65\x61\x72', '\x31'),
						i('\x70\x65\x6e\x64\x69\x6e\x67\x2d\x63\x6c\x65\x61\x72', '\x30')),
						'\x31' === l('\x70\x65\x6e\x64\x69\x6e\x67\x2d\x70\x6c\x61\x79') &&
							'\x31' !== l('\x70\x6c\x61\x79') &&
							(await h('\x50\x4f\x53\x54', { id: e, action: '\x70\x6c\x61\x79' }),
							i('\x70\x6c\x61\x79', '\x31'),
							i('\x70\x65\x6e\x64\x69\x6e\x67\x2d\x70\x6c\x61\x79', '\x30')));
					const t = u();
					for (; t.length;)
						(await h('\x50\x4f\x53\x54', { id: e, action: '\x72\x65\x73\x75\x6c\x74', ...t[0] }),
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
			(g(e), i('\x70\x65\x6e\x64\x69\x6e\x67\x2d\x70\x6c\x61\x79', '\x31'), f());
		},
		finish(e) {
			if (!['\x77\x6f\x6e', '\x73\x68\x6f\x72\x74', '\x66\x61\x6c\x6c\x65\x6e'].includes(e.phase))
				return;
			const t = g(!1),
				n = e.phase,
				a = u();
			(a.some((e) => e.event === t) ||
				a.push({ event: t, outcome: n, turns: e.turns, step: e.step, elapsed: e.elapsed }),
				p(a),
				(() => {
					try {
						localStorage.removeItem(o + '\x72\x75\x6e');
					} catch {}
				})(),
				i('\x70\x65\x6e\x64\x69\x6e\x67\x2d\x70\x6c\x61\x79', '\x31'),
				f());
		},
		async summary() {
			if (!navigator.onLine) throw new Error('\x6f\x66\x66\x6c\x69\x6e\x65');
			await f();
			const e = await h('\x47\x45\x54');
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
				throw new Error('\x69\x6e\x76\x61\x6c\x69\x64');
			return { ...e, rate: e.plays ? Math.round((e.clears / e.plays) * 1e3) / 10 : 0 };
		}
	};
	(window.addEventListener('\x6f\x6e\x6c\x69\x6e\x65', () => {
		f();
	}),
		document.addEventListener(
			'\x76\x69\x73\x69\x62\x69\x6c\x69\x74\x79\x63\x68\x61\x6e\x67\x65',
			() => {
				document.hidden || f();
			}
		),
		f());
	var y = null,
		w = !0;
	try {
		w = '\x6f\x66\x66' !== localStorage.getItem('\x64\x61\x72\x75\x6d\x61\x2d\x73\x65');
	} catch {}
	var S = {
			get enabled() {
				return w;
			},
			unlock() {
				if (w)
					try {
						(y ?? (y = new (window.AudioContext || window.webkitAudioContext)()),
							'\x73\x75\x73\x70\x65\x6e\x64\x65\x64' === y.state && y.resume().catch(() => {}));
					} catch {}
			},
			toggle() {
				w = !w;
				try {
					localStorage.setItem(
						'\x64\x61\x72\x75\x6d\x61\x2d\x73\x65',
						w ? '\x6f\x6e' : '\x6f\x66\x66'
					);
				} catch {}
				return (w && this.unlock(), w);
			},
			play(e = '\x73\x74\x65\x70') {
				if (!w || document.hidden || '\x72\x75\x6e\x6e\x69\x6e\x67' !== y?.state) return;
				const t = y.currentTime,
					n = '\x73\x74\x65\x70' === e;
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
					((r.type = '\x73\x69\x6e\x65'),
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
			title: '\u3060\u308b\u307e\u3055\u3093\u304c',
			url: '\x68\x74\x74\x70\x73\x3a\x2f\x2f\x73\x61\x6a\x69\x71\x6f\x6f\x6b\x2e\x6a\x70\x2f\x67\x61\x6d\x65\x2f\x64\x61\x72\x75\x6d\x61\x73\x2f',
			hashtag: '\u3060\u308b\u307e\u3055\u3093\u304c',
			quoteUrl:
				'\x68\x74\x74\x70\x73\x3a\x2f\x2f\x78\x2e\x63\x6f\x6d\x2f\x73\x61\x6a\x69\x5f\x71\x6f\x6f\x6b\x2f\x73\x74\x61\x74\x75\x73\x2f\x32\x31\x30\x32\x34\x38\x37\x36\x36\x31\x35\x37\x35\x36\x31\x34\x34\x39\x34\x3f\x73\x3d\x32\x30'
		});
	function b(e = v) {
		const t = (function (e = v) {
			const { title: t, url: n, hashtag: a, quoteUrl: r } = e;
			if (!t.trim() || !a.trim() || !/^https:\/\/sajiqook\.jp\/game\/[^/?#]+\/?$/.test(n))
				return null;
			const s = a.trim().replace(/^[#\uff03]+/, '');
			return !s ||
				/\s/.test(s) ||
				(r && !/^https:\/\/x\.com\/[^/]+\/status\/\d+(?:\?[^\s]*)?$/.test(r))
				? null
				: `WEB\u8b0e\u300c${t.trim()}\u300d\u3092\u89e3\u304d\u307e\u3057\u305f\uff01\n\n${n}\n\n#${s}${r ? '\x0a' + r : ''}`;
		})(e);
		return t
			? '\x68\x74\x74\x70\x73\x3a\x2f\x2f\x78\x2e\x63\x6f\x6d\x2f\x69\x6e\x74\x65\x6e\x74\x2f\x74\x77\x65\x65\x74\x3f' +
					new URLSearchParams({ text: t })
			: null;
	}
	var x,
		A = (e) => document.getElementById(e),
		L = '\x64\x61\x72\x75\x6d\x61\x2d\x61\x63\x74\x69\x76\x65\x2d\x76\x31',
		T = (e, t = {}) => {
			'\x66\x75\x6e\x63\x74\x69\x6f\x6e' == typeof window.gtag &&
				window.gtag('\x65\x76\x65\x6e\x74', e, { game_slug: '\x64\x61\x72\x75\x6d\x61\x73', ...t });
		},
		E = '\x6a\x61',
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
		B = '\x72\x75\x6e\x6e\x65\x72',
		D = null,
		z = document.hasFocus(),
		Y =
			'\x72\x65\x6c\x6f\x61\x64' ===
			performance.getEntriesByType('\x6e\x61\x76\x69\x67\x61\x74\x69\x6f\x6e')[0]?.type,
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
						'\x72\x65\x61\x64\x79',
						'\x61\x70\x70\x72\x6f\x61\x63\x68',
						'\x74\x61\x67\x67\x65\x64',
						'\x72\x65\x74\x72\x65\x61\x74',
						'\x63\x6f\x6c\x6c\x61\x70\x73\x69\x6e\x67',
						'\x64\x65\x63\x6c\x61\x72\x65',
						'\x77\x61\x6c\x6b\x69\x6e\x67',
						'\x77\x6f\x6e',
						'\x73\x68\x6f\x72\x74',
						'\x66\x61\x6c\x6c\x65\x6e'
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
								phase: '\x72\x65\x61\x64\x79',
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
										: '\x73\x65\x74\x74\x69\x6e\x67\x73' === t.awaySource
											? '\x73\x65\x74\x74\x69\x6e\x67\x73'
											: '\x70\x61\x67\x65',
								step: t.step,
								retreatStep: t.retreatStep
							}
					: {
							version: 4,
							phase: '\x72\x65\x61\x64\x79',
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
					phase: '\x72\x65\x61\x64\x79',
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
				'\x65\x6e' ===
				localStorage.getItem('\x64\x61\x72\x75\x6d\x61\x2d\x6c\x61\x6e\x67\x75\x61\x67\x65')
					? '\x65\x6e'
					: '\x6a\x61'),
			(R = Math.min(
				2,
				Number(
					localStorage.getItem(
						'\x64\x61\x72\x75\x6d\x61\x2d\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x6f\x70\x65\x6e\x73'
					)
				) || 0
			)),
			(U = Number(localStorage.getItem(L)) || 0));
	} catch {
		x = {
			version: 4,
			phase: '\x72\x65\x61\x64\x79',
			elapsed: 0,
			turns: 0,
			awayAt: null,
			awaySource: null,
			step: 0,
			retreatStep: 0
		};
	}
	'\x61\x70\x70\x72\x6f\x61\x63\x68' === x.phase &&
		null === x.awayAt &&
		!Y &&
		U > 0 &&
		_ - U >= 1e3 &&
		((x = n(x, U)), te());
	var W = matchMedia(
			'\x28\x70\x72\x65\x66\x65\x72\x73\x2d\x72\x65\x64\x75\x63\x65\x64\x2d\x6d\x6f\x74\x69\x6f\x6e\x3a\x20\x72\x65\x64\x75\x63\x65\x29'
		).matches,
		V = W ? 150 : 320,
		H = () => s[E],
		G = () => A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x6d\x6f\x64\x61\x6c').open,
		X = () =>
			'\x74\x72\x75\x65' ===
				A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x6f\x70\x65\x6e').getAttribute(
					'\x61\x72\x69\x61\x2d\x65\x78\x70\x61\x6e\x64\x65\x64'
				) && !G();
	function K(e, n) {
		const { x: a, y: r } = t(n);
		(e.style.setProperty('\x2d\x2d\x78', a), e.style.setProperty('\x2d\x2d\x79', r));
	}
	var Q = [];
	for (let e = 0; e <= 11; e++) {
		const t = document.createElement('\x64\x69\x76');
		((t.className = `cell${0 === e ? '\x20\x68\x6f\x6d\x65' : ''}${e > 5 ? '\x20\x66\x72\x61\x67\x69\x6c\x65' : ''}`),
			(t.dataset.index = e),
			K(t, e),
			A('\x6c\x61\x6e\x65').append(t),
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
		}).join('\x20');
	}
	(A('\x73\x61\x66\x65\x2d\x72\x6f\x75\x74\x65').setAttribute('\x64', Z(0, 5)),
		A('\x66\x72\x61\x67\x69\x6c\x65\x2d\x72\x6f\x75\x74\x65').setAttribute('\x64', Z(5, 11)));
	for (const [e, t] of [
		['\x72\x75\x6e\x6e\x65\x72', '\x64\x61\x72\x75\x6d\x61\x2d\x61\x2e\x70\x6e\x67'],
		['\x6f\x6e\x69', '\x6f\x6e\x69\x2d\x61\x2e\x70\x6e\x67']
	])
		A(e).innerHTML =
			`<svg viewBox="0 0 64 76"><ellipse class="pawn-shadow" cx="32" cy="69" rx="20" ry="4" fill="#473727" opacity=".17"/><g class="figure"><image href="./assets/${t}" x="0" y="-4" width="64" height="76" preserveAspectRatio="xMidYMax meet"/></g></svg>`;
	function ee() {
		const e = A('\x62\x6f\x61\x72\x64\x2d\x73\x70\x61\x63\x65').getBoundingClientRect(),
			t = Math.max(0, Math.floor(Math.min(e.width / 3, e.height / 4, 110)));
		(A('\x62\x6f\x61\x72\x64').style.setProperty(
			'\x2d\x2d\x62\x6f\x61\x72\x64\x2d\x73\x69\x7a\x65',
			4 * t + '\x70\x78'
		),
			A('\x62\x6f\x61\x72\x64').style.setProperty(
				'\x2d\x2d\x62\x6f\x61\x72\x64\x2d\x77\x69\x64\x74\x68',
				3 * t + '\x70\x78'
			));
		const n = t ? 480 / t : 6;
		(A('\x73\x61\x66\x65\x2d\x72\x6f\x75\x74\x65').setAttribute('\x64', Z(0, 5, n)),
			A('\x66\x72\x61\x67\x69\x6c\x65\x2d\x72\x6f\x75\x74\x65').setAttribute('\x64', Z(5, 11, n)));
	}
	function te() {
		try {
			localStorage.setItem(e, JSON.stringify(x));
		} catch {}
	}
	function ne(e = Date.now(), t = !1) {
		if (
			'\x61\x70\x70\x72\x6f\x61\x63\x68' !== x.phase ||
			null !== x.awayAt ||
			document.hidden ||
			se()
		) {
			if (0 !== F || '\x61\x70\x70\x72\x6f\x61\x63\x68' !== x.phase) {
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
			'\x2e\x66\x69\x67\x75\x72\x65\x2c\x2e\x70\x61\x77\x6e\x2d\x73\x68\x61\x64\x6f\x77'
		))
			for (const t of e.getAnimations()) t.cancel();
	}
	function se() {
		return (
			A('\x72\x65\x73\x65\x74\x2d\x64\x69\x61\x6c\x6f\x67').open ||
			A('\x72\x65\x63\x6f\x72\x64\x73').open ||
			G()
		);
	}
	function oe() {
		(clearTimeout(q),
			(q = null),
			(j = null),
			(A('\x70\x61\x77\x6e\x2d\x73\x70\x65\x65\x63\x68').hidden = !0));
	}
	function le(e, t = 3500, n = '\x72\x75\x6e\x6e\x65\x72') {
		(clearTimeout(q),
			(j = e),
			(B = n),
			(A('\x70\x61\x77\x6e\x2d\x73\x70\x65\x65\x63\x68').textContent = H()[e]),
			(A('\x70\x61\x77\x6e\x2d\x73\x70\x65\x65\x63\x68').hidden = !1),
			(q = setTimeout(() => {
				((q = null), (j = null), (A('\x70\x61\x77\x6e\x2d\x73\x70\x65\x65\x63\x68').hidden = !0));
			}, t)),
			K(A('\x70\x61\x77\x6e\x2d\x73\x70\x65\x65\x63\x68'), '\x6f\x6e\x69' === B ? x.step : r(x)));
	}
	function ie() {
		return (
			['\x72\x65\x61\x64\x79', '\x61\x70\x70\x72\x6f\x61\x63\x68'].includes(x.phase) &&
			!document.hidden &&
			!se()
		);
	}
	function ce(e = !1) {
		if ((e && (clearTimeout(P), (P = null)), !ie())) return (clearTimeout(P), void (P = null));
		P ||
			(P = setTimeout(() => {
				((P = null), ie() && le('\x69\x64\x6c\x65\x53\x70\x65\x65\x63\x68', 5e3));
			}, 3e4));
	}
	function de() {
		('\x69\x64\x6c\x65\x53\x70\x65\x65\x63\x68' === j && oe(), ce(!0));
	}
	function ue(e, t, n) {
		const a = A(e).querySelector('\x2e\x66\x69\x67\x75\x72\x65');
		for (const e of a.getAnimations()) e.cancel();
		(W ||
			a.animate(
				[
					{ transform: '\x72\x6f\x74\x61\x74\x65\x28\x30\x64\x65\x67\x29' },
					{ transform: '\x72\x6f\x74\x61\x74\x65\x28\x2d\x31\x34\x64\x65\x67\x29' },
					{ transform: '\x72\x6f\x74\x61\x74\x65\x28\x31\x30\x64\x65\x67\x29' },
					{ transform: '\x72\x6f\x74\x61\x74\x65\x28\x2d\x35\x64\x65\x67\x29' },
					{ transform: '\x72\x6f\x74\x61\x74\x65\x28\x30\x64\x65\x67\x29' }
				],
				{ duration: 560, easing: '\x65\x61\x73\x65\x2d\x6f\x75\x74' }
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
			n = t.querySelector('\x2e\x66\x69\x67\x75\x72\x65'),
			a = t.querySelector('\x2e\x70\x61\x77\x6e\x2d\x73\x68\x61\x64\x6f\x77');
		for (const e of [n, a]) for (const t of e.getAnimations()) t.cancel();
		W ||
			(n.animate(
				[
					{ transform: '\x74\x72\x61\x6e\x73\x6c\x61\x74\x65\x59\x28\x30\x29' },
					{
						transform: '\x74\x72\x61\x6e\x73\x6c\x61\x74\x65\x59\x28\x2d\x31\x34\x70\x78\x29',
						offset: 0.45
					},
					{ transform: '\x74\x72\x61\x6e\x73\x6c\x61\x74\x65\x59\x28\x30\x29' }
				],
				{ duration: 230, easing: '\x65\x61\x73\x65\x2d\x69\x6e\x2d\x6f\x75\x74' }
			),
			a.animate(
				[
					{ opacity: 0.17, transform: '\x73\x63\x61\x6c\x65\x28\x31\x29' },
					{ opacity: 0.07, transform: '\x73\x63\x61\x6c\x65\x28\x2e\x37\x29', offset: 0.45 },
					{ opacity: 0.17, transform: '\x73\x63\x61\x6c\x65\x28\x31\x29' }
				],
				{ duration: 230, easing: '\x65\x61\x73\x65\x2d\x69\x6e\x2d\x6f\x75\x74' }
			));
		const r = setTimeout(
			() => {
				(J.delete(r), document.hidden || S.play('\x73\x74\x65\x70'));
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
			G() && A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x6d\x6f\x64\x61\x6c').close(),
			A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x68\x6f\x6d\x65').append(
				A('\x73\x65\x74\x74\x69\x6e\x67\x73')
			),
			(A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x63\x6c\x6f\x73\x65').hidden = !0),
			(A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x63\x68\x61\x6e\x67\x65\x64').hidden = !0),
			A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x64\x72\x61\x77\x65\x72').classList.remove(
				'\x6f\x70\x65\x6e'
			),
			(A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x64\x72\x61\x77\x65\x72').hidden = !0),
			(A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x64\x72\x61\x77\x65\x72').inert = !0),
			A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x6f\x70\x65\x6e').setAttribute(
				'\x61\x72\x69\x61\x2d\x65\x78\x70\x61\x6e\x64\x65\x64',
				'\x66\x61\x6c\x73\x65'
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
				phase: '\x72\x65\x61\x64\x79',
				elapsed: 0,
				turns: 0,
				awayAt: null,
				awaySource: null,
				step: 0,
				retreatStep: 0,
				phase: '\x61\x70\x70\x72\x6f\x61\x63\x68'
			}),
			te(),
			ne(Date.now(), !0),
			m.start(!0),
			T('\x67\x61\x6d\x65\x5f\x73\x74\x61\x72\x74'),
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
				phase: '\x72\x65\x61\x64\x79',
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
			s = ['\x72\x65\x61\x64\x79', '\x61\x70\x70\x72\x6f\x61\x63\x68'].includes(n),
			o = ['\x64\x65\x63\x6c\x61\x72\x65', '\x77\x61\x6c\x6b\x69\x6e\x67'].includes(n);
		(A('\x69\x6e\x74\x72\x6f').classList.toggle('\x69\x6e\x69\x74\x69\x61\x6c', s),
			A('\x68\x65\x61\x64\x6c\x69\x6e\x65').replaceChildren(),
			s
				? t.intro.split('\x0a').forEach((e, t) => {
						const n = document.createElement('\x73\x70\x61\x6e'),
							a = '\x6a\x61' === E ? '\u9b3c' : '\x69\x74';
						if (0 === t && e.includes(a)) {
							const t = e.indexOf(a),
								r = document.createElement('\x65\x6d');
							((r.className = '\x6f\x6e\x69\x2d\x77\x6f\x72\x64'),
								(r.textContent = a),
								n.append(e.slice(0, t), r, e.slice(t + a.length)));
						} else n.textContent = e;
						A('\x68\x65\x61\x64\x6c\x69\x6e\x65').append(n);
					})
				: (A('\x68\x65\x61\x64\x6c\x69\x6e\x65').textContent = o
						? t.turns(x.turns)
						: t[
								{
									tagged: '\x74\x61\x67\x67\x65\x64',
									retreat: '\x65\x73\x63\x61\x70\x65',
									collapsing: '\x63\x6f\x6c\x6c\x61\x70\x73\x65',
									won: '\x77\x6f\x6e',
									short: '\x73\x68\x6f\x72\x74',
									fallen: '\x66\x61\x6c\x6c\x65\x6e'
								}[n]
							]));
		const l = o
			? t.rules
			: '\x77\x6f\x6e' === n
				? t.winNote
				: '\x73\x68\x6f\x72\x74' === n
					? t.shortNote(5 - x.step)
					: '\x66\x61\x6c\x6c\x65\x6e' === n
						? t.fallNote
						: '';
		((A('\x64\x65\x73\x63\x72\x69\x70\x74\x69\x6f\x6e').textContent = l),
			(A('\x64\x65\x73\x63\x72\x69\x70\x74\x69\x6f\x6e').hidden = !l));
		const i =
			'\x72\x65\x61\x64\x79' === n
				? t.start
				: '\x64\x65\x63\x6c\x61\x72\x65' === n
					? t.walk
					: ['\x77\x6f\x6e', '\x73\x68\x6f\x72\x74', '\x66\x61\x6c\x6c\x65\x6e'].includes(n)
						? t.again
						: null;
		((A('\x61\x63\x74\x69\x6f\x6e').hidden = !i),
			i && (A('\x61\x63\x74\x69\x6f\x6e').textContent = i));
		const c = b();
		((A('\x73\x68\x61\x72\x65\x2d\x61\x72\x65\x61').hidden = '\x77\x6f\x6e' !== n),
			(A('\x73\x68\x61\x72\x65\x2d\x78').disabled = !c),
			(A('\x73\x68\x61\x72\x65\x2d\x6e\x6f\x74\x65').hidden = Boolean(c)));
		const d = G() && '\x61\x70\x70\x72\x6f\x61\x63\x68' === x.phase ? a(x, Date.now()) : x,
			u = r(d),
			p = [
				'\x63\x6f\x6c\x6c\x61\x70\x73\x69\x6e\x67',
				'\x64\x65\x63\x6c\x61\x72\x65',
				'\x77\x61\x6c\x6b\x69\x6e\x67',
				'\x77\x6f\x6e',
				'\x73\x68\x6f\x72\x74',
				'\x66\x61\x6c\x6c\x65\x6e'
			].includes(n);
		j && K(A('\x70\x61\x77\x6e\x2d\x73\x70\x65\x65\x63\x68'), '\x6f\x6e\x69' === B ? x.step : u);
		const g = (d.elapsed % 1e3) / 1e3;
		for (const e of Q) {
			const t =
				['\x72\x65\x61\x64\x79', '\x61\x70\x70\x72\x6f\x61\x63\x68'].includes(n) &&
				Number(e.dataset.index) === u;
			(e.classList.toggle('\x72\x75\x6e\x6e\x65\x72\x2d\x63\x65\x6c\x6c', t),
				t
					? e.style.setProperty(
							'\x2d\x2d\x72\x75\x6e\x6e\x65\x72\x2d\x70\x61\x73\x73\x65\x64\x2d\x61\x6e\x67\x6c\x65',
							360 * g + '\x64\x65\x67'
						)
					: e.style.removeProperty(
							'\x2d\x2d\x72\x75\x6e\x6e\x65\x72\x2d\x70\x61\x73\x73\x65\x64\x2d\x61\x6e\x67\x6c\x65'
						));
		}
		for (const t of ['\x6f\x6e\x69', '\x72\x75\x6e\x6e\x65\x72'])
			(A(t).classList.toggle('\x69\x6e\x73\x74\x61\x6e\x74', e),
				A(t).classList.toggle('\x63\x61\x75\x67\x68\x74', '\x77\x6f\x6e' === n));
		(K(A('\x72\x75\x6e\x6e\x65\x72'), u),
			K(A('\x6f\x6e\x69'), x.step),
			e || null === M || M === u || ge('\x72\x75\x6e\x6e\x65\x72'),
			e || null === O || O === x.step || '\x66\x61\x6c\x6c\x65\x6e' === n || ge('\x6f\x6e\x69'),
			(M = u),
			(O = x.step),
			A('\x6f\x6e\x69').classList.toggle('\x66\x61\x6c\x6c', '\x66\x61\x6c\x6c\x65\x6e' === n),
			A('\x62\x6f\x61\x72\x64').classList.toggle('\x63\x6f\x6c\x6c\x61\x70\x73\x65\x64', p),
			A('\x62\x6f\x61\x72\x64').classList.toggle('\x69\x6e\x73\x74\x61\x6e\x74', e),
			(A('\x73\x74\x65\x70').hidden = '\x77\x61\x6c\x6b\x69\x6e\x67' !== n),
			(A('\x73\x74\x65\x70').textContent = t.steps(x.step)),
			A('\x62\x6f\x61\x72\x64').setAttribute(
				'\x61\x72\x69\x61\x2d\x6c\x61\x62\x65\x6c',
				'\x66\x61\x6c\x6c\x65\x6e' === n ? t.fallBoard : t.board(x.step, u, p)
			),
			'\x64\x65\x63\x6c\x61\x72\x65' === n && x.turns >= 10 && D !== x.turns
				? ((D = x.turns), le('\x68\x61\x72\x64\x43\x6f\x75\x6e\x74', 5e3))
				: '\x64\x65\x63\x6c\x61\x72\x65' !== n &&
					((D = null), '\x68\x61\x72\x64\x43\x6f\x75\x6e\x74' === j && oe()),
			ce());
	}
	function we() {
		const e = H();
		((document.documentElement.lang = E),
			(document.title = e.pageTitle),
			document
				.querySelectorAll('\x5b\x64\x61\x74\x61\x2d\x69\x31\x38\x6e\x5d')
				.forEach((t) => (t.textContent = e[t.dataset.i18n])));
		for (const t of [
			'\x73\x65\x74\x74\x69\x6e\x67\x73',
			'\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x6f\x70\x65\x6e'
		])
			A(t).setAttribute('\x61\x72\x69\x61\x2d\x6c\x61\x62\x65\x6c', e.settings);
		(A('\x6c\x61\x6e\x67\x75\x61\x67\x65\x2d\x74\x6f\x67\x67\x6c\x65').setAttribute(
			'\x61\x72\x69\x61\x2d\x6c\x61\x62\x65\x6c',
			e.toggle
		),
			A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x63\x6c\x6f\x73\x65').setAttribute(
				'\x61\x72\x69\x61\x2d\x6c\x61\x62\x65\x6c',
				e.closeSettings
			),
			A('\x72\x65\x63\x6f\x72\x64\x73\x2d\x63\x6c\x6f\x73\x65').setAttribute(
				'\x61\x72\x69\x61\x2d\x6c\x61\x62\x65\x6c',
				e.closeRecords
			),
			A('\x72\x75\x6e\x6e\x65\x72').setAttribute(
				'\x61\x72\x69\x61\x2d\x6c\x61\x62\x65\x6c',
				e.runnerLabel
			),
			A('\x6f\x6e\x69').setAttribute('\x61\x72\x69\x61\x2d\x6c\x61\x62\x65\x6c', e.oniLabel),
			j && (A('\x70\x61\x77\x6e\x2d\x73\x70\x65\x65\x63\x68').textContent = e[j]),
			A('\x6c\x61\x6e\x67\x2d\x6a\x61').classList.toggle(
				'\x61\x63\x74\x69\x76\x65',
				'\x6a\x61' === E
			),
			A('\x6c\x61\x6e\x67\x2d\x65\x6e').classList.toggle(
				'\x61\x63\x74\x69\x76\x65',
				'\x65\x6e' === E
			),
			(A('\x73\x6f\x75\x6e\x64\x2d\x74\x6f\x67\x67\x6c\x65').textContent = S.enabled
				? e.seOn
				: e.seOff),
			A('\x73\x6f\x75\x6e\x64\x2d\x74\x6f\x67\x67\x6c\x65').setAttribute(
				'\x61\x72\x69\x61\x2d\x70\x72\x65\x73\x73\x65\x64',
				String(S.enabled)
			),
			ye(!0));
	}
	function Se() {
		document.hidden ||
			se() ||
			('\x74\x61\x67\x67\x65\x64' === x.phase
				? (ye(!0),
					pe(() => {
						((x.phase = '\x72\x65\x74\x72\x65\x61\x74'), (x.retreatStep = 0), te(), ye(), Se());
					}, 850))
				: '\x72\x65\x74\x72\x65\x61\x74' === x.phase
					? pe(() => {
							(x.retreatStep < 5
								? x.retreatStep++
								: (x.phase = '\x63\x6f\x6c\x6c\x61\x70\x73\x69\x6e\x67'),
								te(),
								ye(),
								Se());
						}, V)
					: '\x63\x6f\x6c\x6c\x61\x70\x73\x69\x6e\x67' === x.phase
						? pe(() => {
								((x.phase = '\x64\x65\x63\x6c\x61\x72\x65'), te(), ye());
							}, 1100)
						: '\x77\x61\x6c\x6b\x69\x6e\x67' === x.phase &&
							pe(() => {
								((x = (function (e) {
									if ('\x77\x61\x6c\x6b\x69\x6e\x67' !== e.phase) return e;
									const t = e.step + 1,
										n =
											t > 5
												? '\x66\x61\x6c\x6c\x65\x6e'
												: t >= e.turns
													? 5 === t
														? '\x77\x6f\x6e'
														: '\x73\x68\x6f\x72\x74'
													: '\x77\x61\x6c\x6b\x69\x6e\x67';
									return { ...e, step: t, phase: n };
								})(x)),
									te(),
									ye(),
									'\x77\x61\x6c\x6b\x69\x6e\x67' !== x.phase &&
										(m.finish(x),
										T(
											'\x77\x6f\x6e' === x.phase
												? '\x67\x61\x6d\x65\x5f\x63\x6c\x65\x61\x72'
												: '\x67\x61\x6d\x65\x5f\x6f\x76\x65\x72',
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
				['\x61\x70\x70\x72\x6f\x61\x63\x68', '\x74\x61\x67\x67\x65\x64'].includes(x.phase) &&
				ge('\x72\x75\x6e\x6e\x65\x72'),
			Se());
	}
	function xe(e = Date.now(), t = _) {
		const a = e - t;
		return (
			!(
				document.hidden ||
				se() ||
				X() ||
				'\x61\x70\x70\x72\x6f\x61\x63\x68' !== x.phase ||
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
						((z = !0), be(!1), ee(), A('\x62\x6f\x61\x72\x64').offsetWidth, ce(!0)));
			})));
	}
	function Le() {
		try {
			localStorage.setItem(
				'\x64\x61\x72\x75\x6d\x61\x2d\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x6f\x70\x65\x6e\x73',
				String(R)
			);
		} catch {}
	}
	(new ResizeObserver(ee).observe(A('\x62\x6f\x61\x72\x64\x2d\x73\x70\x61\x63\x65')),
		A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x6f\x70\x65\x6e').addEventListener(
			'\x63\x6c\x69\x63\x6b',
			() => {
				if (
					'\x74\x72\x75\x65' ===
					A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x6f\x70\x65\x6e').getAttribute(
						'\x61\x72\x69\x61\x2d\x65\x78\x70\x61\x6e\x64\x65\x64'
					)
				)
					return (
						clearTimeout(I),
						A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x64\x72\x61\x77\x65\x72').classList.remove(
							'\x6f\x70\x65\x6e'
						),
						(A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x64\x72\x61\x77\x65\x72').inert = !0),
						A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x6f\x70\x65\x6e').setAttribute(
							'\x61\x72\x69\x61\x2d\x65\x78\x70\x61\x6e\x64\x65\x64',
							'\x66\x61\x6c\x73\x65'
						),
						(k = 0),
						void (I = setTimeout(
							() => {
								A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x64\x72\x61\x77\x65\x72').hidden = !0;
							},
							W ? 0 : 380
						))
					);
				0 === R
					? ('\x72\x65\x61\x64\x79' === x.phase && fe(),
						ae(),
						(A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x63\x68\x61\x6e\x67\x65\x64').hidden = !0),
						(A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x63\x6c\x6f\x73\x65').hidden = !1),
						A(
							'\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x6d\x6f\x64\x61\x6c\x2d\x62\x6f\x64\x79'
						).append(A('\x73\x65\x74\x74\x69\x6e\x67\x73')),
						A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x6d\x6f\x64\x61\x6c').showModal(),
						A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x6f\x70\x65\x6e').setAttribute(
							'\x61\x72\x69\x61\x2d\x65\x78\x70\x61\x6e\x64\x65\x64',
							'\x74\x72\x75\x65'
						),
						(x = n(x, Date.now(), '\x73\x65\x74\x74\x69\x6e\x67\x73')),
						te(),
						(R = 1),
						Le(),
						(N = setInterval(() => {
							!document.hidden && G() && '\x61\x70\x70\x72\x6f\x61\x63\x68' === x.phase && ye();
						}, 100)))
					: ((R = 2),
						Le(),
						clearTimeout(I),
						A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x68\x6f\x6d\x65').append(
							A('\x73\x65\x74\x74\x69\x6e\x67\x73')
						),
						(A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x63\x6c\x6f\x73\x65').hidden = !0),
						(A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x63\x68\x61\x6e\x67\x65\x64').hidden = !1),
						(A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x64\x72\x61\x77\x65\x72').hidden = !1),
						(A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x64\x72\x61\x77\x65\x72').inert = !1),
						A(
							'\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x64\x72\x61\x77\x65\x72'
						).getBoundingClientRect(),
						requestAnimationFrame(() => {
							A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x64\x72\x61\x77\x65\x72').hidden ||
								A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x64\x72\x61\x77\x65\x72').inert ||
								A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x64\x72\x61\x77\x65\x72').classList.add(
									'\x6f\x70\x65\x6e'
								);
						}),
						A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x6f\x70\x65\x6e').setAttribute(
							'\x61\x72\x69\x61\x2d\x65\x78\x70\x61\x6e\x64\x65\x64',
							'\x74\x72\x75\x65'
						));
			}
		),
		A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x63\x6c\x6f\x73\x65').addEventListener(
			'\x63\x6c\x69\x63\x6b',
			() => A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x6d\x6f\x64\x61\x6c').close()
		),
		A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x6d\x6f\x64\x61\x6c').addEventListener(
			'\x63\x6c\x6f\x73\x65',
			() => {
				(clearInterval(N),
					(N = null),
					re(),
					(k = 0),
					A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x68\x6f\x6d\x65').append(
						A('\x73\x65\x74\x74\x69\x6e\x67\x73')
					),
					(A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x63\x6c\x6f\x73\x65').hidden = !0),
					A('\x73\x65\x74\x74\x69\x6e\x67\x73\x2d\x6f\x70\x65\x6e').setAttribute(
						'\x61\x72\x69\x61\x2d\x65\x78\x70\x61\x6e\x64\x65\x64',
						'\x66\x61\x6c\x73\x65'
					),
					be(),
					ce(!0));
			}
		),
		A('\x61\x63\x74\x69\x6f\x6e').addEventListener('\x63\x6c\x69\x63\x6b', () => {
			'\x64\x65\x63\x6c\x61\x72\x65' === x.phase
				? ((x.phase = '\x77\x61\x6c\x6b\x69\x6e\x67'), (x.step = 0), te(), ye(), Se())
				: [
						'\x72\x65\x61\x64\x79',
						'\x77\x6f\x6e',
						'\x73\x68\x6f\x72\x74',
						'\x66\x61\x6c\x6c\x65\x6e'
					].includes(x.phase) && fe();
		}),
		A('\x72\x65\x73\x74\x61\x72\x74').addEventListener('\x63\x6c\x69\x63\x6b', () => {
			[
				'\x72\x65\x61\x64\x79',
				'\x77\x6f\x6e',
				'\x73\x68\x6f\x72\x74',
				'\x66\x61\x6c\x6c\x65\x6e'
			].includes(x.phase)
				? me()
				: (ae(), A('\x72\x65\x73\x65\x74\x2d\x64\x69\x61\x6c\x6f\x67').showModal());
		}),
		A('\x63\x61\x6e\x63\x65\x6c\x2d\x72\x65\x73\x65\x74').addEventListener(
			'\x63\x6c\x69\x63\x6b',
			() => A('\x72\x65\x73\x65\x74\x2d\x64\x69\x61\x6c\x6f\x67').close()
		),
		A('\x72\x65\x73\x65\x74\x2d\x64\x69\x61\x6c\x6f\x67').addEventListener(
			'\x63\x6c\x6f\x73\x65',
			() => {
				(Se(), ce(!0));
			}
		),
		A('\x63\x6f\x6e\x66\x69\x72\x6d\x2d\x72\x65\x73\x65\x74').addEventListener(
			'\x63\x6c\x69\x63\x6b',
			() => {
				(A('\x72\x65\x73\x65\x74\x2d\x64\x69\x61\x6c\x6f\x67').close(), me());
			}
		),
		A('\x6c\x61\x6e\x67\x75\x61\x67\x65\x2d\x74\x6f\x67\x67\x6c\x65').addEventListener(
			'\x63\x6c\x69\x63\x6b',
			() => {
				E = '\x6a\x61' === E ? '\x65\x6e' : '\x6a\x61';
				try {
					localStorage.setItem('\x64\x61\x72\x75\x6d\x61\x2d\x6c\x61\x6e\x67\x75\x61\x67\x65', E);
				} catch {}
				(we(),
					8 === ++k &&
						((k = 0),
						(async function () {
							(ae(),
								A('\x72\x65\x63\x6f\x72\x64\x73').showModal(),
								(A('\x72\x65\x63\x6f\x72\x64\x73\x2d\x6d\x65\x73\x73\x61\x67\x65').textContent =
									H().loading));
							for (const e of [
								'\x70\x6c\x61\x79\x73',
								'\x63\x6c\x65\x61\x72\x73',
								'\x72\x61\x74\x65',
								'\x66\x61\x6c\x6c\x73',
								'\x6d\x61\x78\x2d\x73\x74\x65\x70'
							])
								A('\x72\x65\x63\x6f\x72\x64\x2d' + e).textContent = '\u2014';
							try {
								const e = await m.summary();
								((A('\x72\x65\x63\x6f\x72\x64\x2d\x70\x6c\x61\x79\x73').textContent =
									e.plays.toLocaleString(E)),
									(A('\x72\x65\x63\x6f\x72\x64\x2d\x63\x6c\x65\x61\x72\x73').textContent =
										e.clears.toLocaleString(E)),
									(A('\x72\x65\x63\x6f\x72\x64\x2d\x72\x61\x74\x65').textContent =
										e.rate.toLocaleString(E) + '\x25'),
									(A('\x72\x65\x63\x6f\x72\x64\x2d\x66\x61\x6c\x6c\x73').textContent =
										e.falls.toLocaleString(E)),
									(A('\x72\x65\x63\x6f\x72\x64\x2d\x6d\x61\x78\x2d\x73\x74\x65\x70').textContent =
										H().steps(e.maxStep)),
									(A('\x72\x65\x63\x6f\x72\x64\x73\x2d\x6d\x65\x73\x73\x61\x67\x65').textContent =
										''));
							} catch {
								A('\x72\x65\x63\x6f\x72\x64\x73\x2d\x6d\x65\x73\x73\x61\x67\x65').textContent =
									navigator.onLine ? H().unavailable : H().offline;
							}
						})()));
			}
		),
		A('\x73\x6f\x75\x6e\x64\x2d\x74\x6f\x67\x67\x6c\x65').addEventListener(
			'\x63\x6c\x69\x63\x6b',
			() => {
				(S.toggle(), we());
			}
		),
		A('\x73\x68\x61\x72\x65\x2d\x78').addEventListener('\x63\x6c\x69\x63\x6b', () => {
			const e = b();
			'\x77\x6f\x6e' === x.phase &&
				e &&
				(T('\x73\x68\x61\x72\x65', {
					method: '\x58',
					content_type: '\x67\x61\x6d\x65',
					item_id: '\x64\x61\x72\x75\x6d\x61\x73'
				}),
				window.open(
					e,
					'\x5f\x62\x6c\x61\x6e\x6b',
					'\x6e\x6f\x6f\x70\x65\x6e\x65\x72\x2c\x6e\x6f\x72\x65\x66\x65\x72\x72\x65\x72'
				));
		}),
		document.addEventListener(
			'\x70\x6f\x69\x6e\x74\x65\x72\x64\x6f\x77\x6e',
			(e) => {
				(de(),
					document.hidden || null === x.awayAt || Ae(),
					e.target.closest('\x62\x75\x74\x74\x6f\x6e\x2c\x61') && S.unlock());
			},
			{ capture: !0 }
		),
		document.addEventListener('\x6b\x65\x79\x64\x6f\x77\x6e', de, { capture: !0 }),
		document.addEventListener(
			'\x63\x6c\x69\x63\x6b',
			(e) => {
				e.target.closest('\x62\x75\x74\x74\x6f\x6e\x2c\x61') &&
					(S.unlock(), S.play('\x63\x6c\x69\x63\x6b'));
			},
			{ capture: !0 }
		),
		A('\x72\x75\x6e\x6e\x65\x72').addEventListener('\x63\x6c\x69\x63\x6b', () =>
			ue(
				'\x72\x75\x6e\x6e\x65\x72',
				'\x74\x6f\x75\x63\x68\x53\x70\x65\x65\x63\x68',
				'\x72\x75\x6e\x6e\x65\x72\x52\x61\x72\x65\x53\x70\x65\x65\x63\x68'
			)
		),
		A('\x6f\x6e\x69').addEventListener('\x63\x6c\x69\x63\x6b', () =>
			ue(
				'\x6f\x6e\x69',
				'\x6f\x6e\x69\x54\x6f\x75\x63\x68\x53\x70\x65\x65\x63\x68',
				'\x6f\x6e\x69\x52\x61\x72\x65\x53\x70\x65\x65\x63\x68'
			)
		),
		A('\x72\x65\x63\x6f\x72\x64\x73\x2d\x63\x6c\x6f\x73\x65').addEventListener(
			'\x63\x6c\x69\x63\x6b',
			() => A('\x72\x65\x63\x6f\x72\x64\x73').close()
		),
		A('\x72\x65\x63\x6f\x72\x64\x73').addEventListener('\x63\x6c\x6f\x73\x65', () => {
			(Se(), ce(!0));
		}),
		document.addEventListener(
			'\x76\x69\x73\x69\x62\x69\x6c\x69\x74\x79\x63\x68\x61\x6e\x67\x65',
			() => {
				document.hidden ? ((z = !1), ve()) : Ae();
			}
		),
		window.addEventListener('\x62\x6c\x75\x72', () => {
			((z = !1), ve());
		}),
		window.addEventListener('\x66\x6f\x63\x75\x73', Ae),
		window.addEventListener('\x70\x61\x67\x65\x68\x69\x64\x65', () => {
			((z = !1), ve());
		}),
		window.addEventListener('\x70\x61\x67\x65\x73\x68\x6f\x77', Ae),
		document.addEventListener('\x72\x65\x73\x75\x6d\x65', Ae),
		we(),
		[
			'\x72\x65\x61\x64\x79',
			'\x77\x6f\x6e',
			'\x73\x68\x6f\x72\x74',
			'\x66\x61\x6c\x6c\x65\x6e'
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
						? ((z = !0), be(), A('\x72\x75\x6e\x6e\x65\x72').getBoundingClientRect())
						: xe(t, n) &&
							((z = !0), be(!1), A('\x72\x75\x6e\x6e\x65\x72').getBoundingClientRect())),
				ne(t),
				requestAnimationFrame(e));
		}));
})();
