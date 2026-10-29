"""Build the Retro pack from timestamped visual observations, never from solution prose."""
import json
from pathlib import Path

sources = [Path('docs/retro-observations.json'), *sorted(Path('docs').glob('retro-stages-*.json'))]
stages = {1: {'stage': 1, 'width': 4, 'height': 4, 'removedTiles': [], 'maxMoves': 2,
    'player': {'x': 2, 'y': 1, 'riding': True}, 'dice': [
        {'x': 2, 'y': 1, 'kind': 'normal', 'top': 1, 'north': 5, 'east': 3},
        {'x': 1, 'y': 2, 'kind': 'normal', 'top': 3, 'north': 6, 'east': 2},
        {'x': 2, 'y': 2, 'kind': 'normal', 'top': 2, 'north': 4, 'east': 1}],
    'evidence': [{'seconds': 15}, {'seconds': 18}]}}
for source in sources:
    stages.update({s['stage']: s for s in json.loads(source.read_text(encoding='utf-8'))['stages']})
orientations = set()
queue = [(1, 5, 3)]
while queue:
    top, north, east = queue.pop()
    if (top, north, east) in orientations:
        continue
    orientations.add((top, north, east))
    queue.extend([(7-north, top, east), (north, 7-top, east),
                  (east, north, 7-top), (7-east, north, top)])
levels = []
unresolved = []
for number, stage in sorted(stages.items()):
    dice = []
    for i, original in enumerate(stage['dice']):
        die = {k: original[k] for k in ('x', 'y', 'kind', 'top', 'north', 'east')}
        candidates = [faces for faces in sorted(orientations) if all(
            die[key] is None or die[key] == faces[n] for n, key in enumerate(('top','north','east')))]
        if len(candidates) != 1:
            unresolved.append((number, i, len(candidates)))
            break
        die.update(zip(('top', 'north', 'east'), candidates[0]))
        dice.append({'id': i+1, **die})
    else:
        levels.append({'id': f'R{number:03}', 'set': str((number-1)//10+1),
            'title': f'Stage {number:03}', 'lesson': '',
            'hint': f'Clear every die within {stage["maxMoves"]} moves. Finish below the limit for a star.',
            'maxMoves': stage['maxMoves'], 'solution': [],
            'state': {'width': stage['width'], 'height': stage['height'],
                      'removedTiles': stage.get('removedTiles', []), 'player': stage['player'],
                      'dice': dice, 'sinkDuration': 4800, 'iceMatchStops': True},
            'sourceStage': number,
            'sourceTimes': sorted({e['seconds'] for e in stage.get('evidence', []) if isinstance(e, dict) and 'seconds' in e})})
Path('src/lib/games/demonDiceRetroData.json').write_text(json.dumps(levels, indent=2)+'\n', encoding='utf-8')
print(f'Built {len(levels)} visually reconstructed levels; unresolved: {unresolved}')
