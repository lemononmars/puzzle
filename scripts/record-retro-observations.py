"""Expand concise, manually observed face notes against the researched board grid."""
import json
from pathlib import Path

rows = json.loads(Path('scratch/retro-board-rows.json').read_text())
notes = json.loads(Path('scratch/retro-root-notes.json').read_text())
stages = []
for number, (player, north_values) in sorted(notes.items(), key=lambda item: int(item[0])):
    number = int(number)
    board = rows[number-1]
    width, height = max(map(len, board['rows'])), len(board['rows'])
    dice, removed = [], []
    for y, row in enumerate(board['rows']):
        for x in range(width):
            cell = row[x] if x < len(row) else 't-b.icon'
            if cell == 't-b.icon':
                removed.append({'x': x, 'y': y})
            elif cell.startswith('d-'):
                kind = ['normal','wood','ice','stone','metal'][int(cell[2])]
                dice.append({'x': x, 'y': y, 'kind': kind, 'top': int(cell[3]),
                             'north': north_values[len(dice)], 'east': None})
    assert len(dice) == len(north_values), number
    evidence = json.loads(Path(f'scratch/retro-frames/stage-{number:03}/timestamps.json').read_text())
    stages.append({'stage': number, 'width': width, 'height': height,
                   'removedTiles': removed, 'maxMoves': board['maxMoves'],
                   'player': dict(zip(['x','y','riding'], player)), 'dice': dice,
                   'evidence': [{'seconds': evidence[i]['seconds'],
                                 'file': f'scratch/retro-frames/stage-{number:03}/'+evidence[i]['file']}
                                for i in [6,7,9] if len(evidence)>i],
                   'deductions': 'North from directly visible South, or from visible East and the verified 24-orientation physical face layout; East completed by the same layout.',
                   'ambiguities': []})
Path('docs/retro-stages-root.json').write_text(json.dumps({'stages': stages}, indent=2)+'\n')
print('Recorded', len(stages), 'stages')
