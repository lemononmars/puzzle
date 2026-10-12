export const adventureLevels = [
	{
		level: 1,
		code: 'start',
		question: `
            <h1 class="text-4xl mb-4">Level 1</h1>
            <p class="mb-4">Welcome to the Adventure. This is a warm-up.</p>
            <p>The password for the next level is <b>start</b>.</p>
            <p class="text-sm text-gray-500">(Type 'start' in the box below)</p>
        `,
		answer: 'start',
		hint: 'read the text carefully'
	},
	{
		level: 2,
		code: 'start',
		question: `
            <h1 class="text-4xl mb-4">Level 2</h1>
            <p>Sometimes what you're looking for is right in front of you.</p>
            <p>Password: <span class="bg-black text-black select-all selection:bg-white selection:text-black px-2">invisible</span></p>
        `,
		answer: 'invisible',
		hint: 'highlight the text'
	},
	{
		level: 3,
		code: 'invisible',
		question: `
            <h1 class="text-4xl mb-4">Level 3</h1>
            <p>Developers often leave notes for themselves.</p>
            <!-- Password: inspector -->
        `,
		answer: 'inspector',
		hint: 'inspect element (F12)'
	},
	{
		level: 4,
		code: 'inspector',
		question: `
            <h1 class="text-4xl mb-4">Level 4</h1>
            <p>Check the console for errors... or passwords.</p>
        `,
		answer: 'debug',
		hint: 'open console (F12 -> Console)',
		get script() {
			return `console.log("Password: ${this.answer}")`;
		}
	},
	{
		level: 5,
		code: 'debug',
		question: `
            <h1 class="text-4xl mb-4">Level 5</h1>
            <p>Can you decode this secret message?</p>
            <p class="font-mono text-xl mt-4">U2VjcmV0</p>
        `,
		answer: 'Secret',
		hint: 'it is Base64 encoded'
	},
	{
		level: 6,
		code: 'Secret',
		question: `
            <h1 class="text-4xl mb-4">Level 6</h1>
            <p>I've hidden the password in the metadata.</p>
        `,
		answer: 'meta',
		hint: 'check the <meta> tags in the head',
		get script() {
			return `const meta = document.createElement("meta"); meta.name = "password"; meta.content = "${this.answer}"; document.head.appendChild(meta);`;
		},
		cleanup:
			'const meta = document.querySelector("meta[name=\\"password\\"]"); if(meta) meta.remove();'
	},
	{
		level: 7,
		code: 'meta',
		question: `
            <h1 class="text-4xl mb-4">Level 7</h1>
            <p>Everyone loves cookies.</p>
        `,
		answer: 'biscuit',
		hint: 'check the document cookies',
		get script() {
			return `document.cookie = "password=${this.answer}; path=/";`;
		},
		cleanup: 'document.cookie = "password=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"'
	},
	{
		level: 8,
		code: 'biscuit',
		question: `
            <h1 class="text-4xl mb-4">Level 8</h1>
            <p>Look at the tab up there.</p>
        `,
		answer: 'title',
		hint: 'check the browser tab title',
		get script() {
			return `document.title = "Password: ${this.answer}";`;
		},
		cleanup: 'document.title = "Code Breaker | Adventure";'
	},
	{
		level: 9,
		code: 'title',
		question: `
            <h1 class="text-4xl mb-4">Level 9</h1>
            <p class="text-xl">.elcitra na ton si sihT</p>
        `,
		answer: 'reverse',
		hint: 'reverse the text'
	},
	{
		level: 10,
		code: 'reverse',
		question: `
            <h1 class="text-4xl mb-4">Level 10</h1>
            <p>The end is near.</p>
            <p class="text-xs text-base-300">final</p>
        `,
		answer: 'final',
		hint: 'it is very small'
	},
	{
		level: 11,
		code: 'final',
		question: `
            <h1 class="text-6xl mb-8 text-primary">Congratulations!</h1>
            <p class="text-2xl">You have completed all available levels.</p>
            <p class="mt-8 text-xl animate-pulse">More levels coming soon...</p>
        `,
		answer: '', // No answer, end state
		hint: ''
	}
];
