# EnigMarch puzzle archive

The two original Notion collections contain 31 puzzles each. Each puzzle has a permanent route at `/puzzles/enigmarch/{year}/{day}`; collection indexes are listed under both Crafted and Others in `src/lib/data/catalog.json`.

Content and solutions are stored in `src/lib/server/enigmarch.json`. Original puzzle, hint, and solution artwork is copied to `static/images/enigmarch`; preserve those images without recoloring or resizing, since some puzzles rely on exact colors. In particular, 2023 Day 22 uses original image color values.

2023 keeps its original hints for word puzzles. The five visual logic puzzles (Days 4, 9, 20, 25, and 28) have no hint section. 2024 uses the original Explanation sections as spoiler disclosures under Hints. Answers are checked on the server, ignoring case, whitespace, and punctuation. Solution disclosures intentionally contain spoilers.

The 2023 visual logic puzzles (Days 4, 9, 20, 25, and 28) use their original Penpa+, f-puzzles, or SudokuPad solving boards. Do not render an additional answer-entry component on these pages. Original solving-board links and solution artwork are retained.

Solution content is flattened inside one disclosure. For 2024, answer words in explanation hints are replaced by question marks matching the title, while the full answer stays available in Reveal solution. The shared PuzzlePreviewCard component is used for collection indexes. AnswerChecker records per-puzzle history in localStorage and renders themed result text, a brief incorrect-answer shake, and a correct-answer glow; reduced-motion preferences disable the shake.

2023 Day 31 deliberately presents a fake solution as the puzzle; keep that text visible as in the source.

Sources: [2023](https://sakulbuth.notion.site/EnigMarch-2023-266c45a29bab4e10b8bb04a8790ecd37), [2024](https://app.notion.com/p/sakulbuth/EnigMarch-Nazo-2024-89f93ab63b23421d9a6c4624406fdacf).
