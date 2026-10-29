"""Build a stable, original AAA–JJJ pack by reversible scrambling (seed v1).

Never accept a scramble with an intermediate matching group. The reversed
walk/roll path therefore joins all six sixes only on its final move.
Runtime-engine replay of every certificate lives in pipsPlotRandom.test.ts.
"""
import copy
import json
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VECTORS = {'up': (0, -1), 'down': (0, 1), 'left': (-1, 0), 'right': (1, 0)}
OPPOSITE = {'up': 'down', 'down': 'up', 'left': 'right', 'right': 'left'}


def rolled(d, direction):
    t, n, e = d['top'], d['north'], d['east']
    return dict(zip(('top', 'north', 'east'), {
        'up': (7-n, t, e), 'down': (n, 7-t, e),
        'left': (e, n, 7-t), 'right': (7-e, n, t)
    }[direction]))


def matches(dice):
    remaining = set(range(6))
    while remaining:
        start = remaining.pop()
        group = [start]
        for i in group:
            for j in list(remaining):
                if dice[i]['top'] == dice[j]['top'] and abs(dice[i]['x']-dice[j]['x']) + abs(dice[i]['y']-dice[j]['y']) == 1:
                    remaining.remove(j)
                    group.append(j)
        if dice[start]['top'] > 1 and len(group) >= dice[start]['top']:
            return True
    return False


def build():
    rng = random.Random(0x50495001)
    entries, seen = [], set()
    while len(entries) < 1000:
        # Grow a random connected six-cell goal; random physical yaw per die.
        cells = [rng.randrange(16)]
        while len(cells) < 6:
            cell = rng.choice(cells)
            dx, dy = rng.choice(list(VECTORS.values()))
            x, y = cell % 4 + dx, cell // 4 + dy
            if 0 <= x < 4 and 0 <= y < 4 and y*4+x not in cells:
                cells.append(y*4+x)
        dice = []
        for i, cell in enumerate(cells):
            n, e = rng.choice([(2, 3), (4, 2), (5, 4), (3, 5)])
            dice.append(dict(id=i+1, x=cell%4, y=cell//4, kind='normal', top=6, north=n, east=e))
        player = dict(x=dice[0]['x'], y=dice[0]['y'], riding=True)
        path, rolls = [], 0
        target = rng.randint(8, 15)
        previous = None
        for _ in range(180):
            options = list(VECTORS)
            rng.shuffle(options)
            accepted = False
            for direction in options:
                if previous and direction == OPPOSITE[previous]:
                    continue
                dx, dy = VECTORS[direction]
                x, y = player['x']+dx, player['y']+dy
                if not (0 <= x < 4 and 0 <= y < 4):
                    continue
                trial = copy.deepcopy(dice)
                occupied = any(d['x'] == x and d['y'] == y for d in trial)
                if not occupied:
                    d = next(d for d in trial if d['x'] == player['x'] and d['y'] == player['y'])
                    d.update(rolled(d, direction))
                    d.update(x=x, y=y)
                if matches(trial):
                    continue
                dice = trial
                player.update(x=x, y=y)
                path.append(direction)
                previous = direction
                rolls += not occupied
                accepted = True
                break
            if not accepted or rolls >= target:
                break
        if rolls < target or sum(d['top'] != 6 for d in dice) < 3:
            continue
        signature = json.dumps([player, sorted((d['x'], d['y'], d['top'], d['north'], d['east']) for d in dice)], sort_keys=True)
        if signature in seen:
            continue
        seen.add(signature)
        index = len(entries)
        code = ''.join(chr(65+d) for d in (index//100, index//10%10, index%10))
        entries.append(dict(id=code, set=code[0], title='Stage '+code, maxMoves=20,
            lesson='', hint='Connect all six dice showing six. A solution uses at most 15 moves.',
            solution=[OPPOSITE[d] for d in reversed(path)],
            state=dict(width=4, height=4, player=player, dice=dice)))
    destination = ROOT/'src/lib/games/pipsPlotRandomData.json'
    destination.write_text(json.dumps(entries, separators=(',', ':'))+'\n', encoding='utf-8')
    print(f'Generated {len(entries)} unique certified boards: {destination}')


if __name__ == '__main__':
    build()
