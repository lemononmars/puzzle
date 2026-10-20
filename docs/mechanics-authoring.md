# Writing mechanics articles

## Add material to an existing mechanic

1. Find its ID in `src/lib/data/resources/puzzleMechanics.ts` (for example `answer-the-question-mark`).
2. Copy `templates/mechanics/article.svelte` to `src/lib/content/mechanics/answer-the-question-mark.svelte`.
3. Edit the paragraphs directly. Delete any sections you do not need. This is regular Svelte: HTML, components, SVGs, and interactive controls work.
4. Visit `/resources/mechanics/answer-the-question-mark`. Your article replaces the generated concept, approach, and terms sections. Existing title, navigation, and any enabled exercise remain.
5. Every mechanic links to its reference page; your Svelte article loads automatically when the matching file exists. The blank template itself is never published.

Keep drafts outside `src/lib/content/mechanics`, since files in that folder are publishable articles. Remove an article file to return to the existing generated explanation.

Images go in `static/images/mechanics/`; reference them as `/images/mechanics/example.png`. Add useful alt text and intrinsic width/height. Use semantic theme colors, and the shared Surface and AnswerChecker components. Avoid putting solution words in image alt text or titles before the solver reveals them. Client-side exercises are suitable for teaching, not competitive secret answers.

## Add an entirely new mechanic

Add matching metadata to the appropriate chapter in `src/lib/data/resources/puzzleMechanics.ts` and a matching JSON file in `src/lib/data/resources/mechanics/<mechanic-id>.json` (copy an existing file as a starting point). Both entries must have the same unique ID. Then create the Svelte article as above. Set `hasExercise` only when there is an actual working exercise; prose articles do not need it. The existing detail type currently requires the puzzle fields even when `hasExercise` is false; use empty strings and an empty acceptedAnswers array for an article-only entry.

Titles/descriptions live in the metadata files; article body text lives in your Svelte file. This keeps existing URLs and previous/next navigation intact. Markdown is already configured through mdsvex, but this authoring hook intentionally accepts `.svelte` only so you can freely add interactive examples without another content format.

Run `npm run check` before committing. Preview both narrow and wide layouts. Use `docs/design-system.md` for styling.
