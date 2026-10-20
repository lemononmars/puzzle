import json
from pathlib import Path

root = Path(__file__).resolve().parents[2]
meta = json.loads((root / 'scratch/saji-research/catalogue.json').read_text(encoding='utf-8-sig'))
games = [g for g in meta['games'] if g.get('enabled') and g.get('badge') in ('GAME', 'NAZO')]
rows = ['| # | Game | Slug | Catalogue type |', '|---:|---|---|---|']
for index, game in enumerate(games, 1):
    slug = game['slug']
    rows.append(f"| {index} | [{game['name']}](https://sajiqook.jp/game/{slug}/) | `{slug}` | {game['badge']} |")
intro = (root / 'scratch/saji-research-intro.md').read_text(encoding='utf-8')
intro = intro.replace('<!-- INVENTORY -->', '\n'.join(rows))
(root / 'scratch/saji-research-intro-built.md').write_text(intro, encoding='utf-8')
print(f'Inventory: {len(games)} enabled games.')

intro, detail_heading = intro.split('## Detailed game notes', 1)
parts = [intro.strip(), (root / 'scratch/saji-research-stack.md').read_text(encoding='utf-8').strip(), '## Detailed game notes' + detail_heading.rstrip()]
for name in ('root', 'early', 'middle', 'recent'):
    content = (root / f'scratch/saji-research-{name}.md').read_text(encoding='utf-8').strip()
    if content.startswith('# '):
        content = content[content.index('\n## ') + 1:]
    content = content.replace('## 魔法図書館 (`maglibrary`)', '## 魔法使いの書庫 / The Wizard’s Library (`maglibrary`)')
    content = content.replace('## だるまさん (`darumas`)', '## だるまさんが (`darumas`)')
    content = content.replace('## おばけ屋敷 (`obakeya`)', '## お化け屋敷 (`obakeya`)')
    parts.append(content)
parts.append((root / 'scratch/saji-research-outro.md').read_text(encoding='utf-8').strip())
report = '\n\n'.join(parts) + '\n'
target = root / 'docs/research/saji-web-games.md'
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(report, encoding='utf-8')

headings = [line for line in report.splitlines() if line.startswith('## ')]
for game in games:
    slug = game['slug']
    matches = [h for h in headings if f'`{slug}`' in h or h.startswith(f'## {slug} —')]
    assert len(matches) == 1, (slug, matches)
assert '<!--' not in report
assert report.count('\n# ') == 0
print(f'Validated {len(games)} unique detailed entries; saved {target} ({len(report.split())} words).')
