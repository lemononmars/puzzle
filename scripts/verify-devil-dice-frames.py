"""Verify the 100 stage image archives against their source timestamps."""
from io import BytesIO
import json
from pathlib import Path
from zipfile import ZipFile
from PIL import Image

root = Path('scratch/retro-frame-archives')
source = json.loads(Path('scratch/retro-video-info.json').read_text(encoding='utf-8-sig'))
chapters = [c for c in source['chapters'] if c['title'].startswith('Stage ')]
assert len(chapters) == 100
total = 0
for chapter in chapters:
    stage = int(chapter['title'].split()[-1])
    with ZipFile(root/f'stage-{stage:03}.zip') as archive:
        records = json.loads(archive.read('timestamps.json'))
        expected = round((chapter['end_time']-chapter['start_time'])*30)
        assert len(records) == expected, (stage, len(records), expected)
        assert len(archive.namelist()) == expected+1
        assert records[0]['seconds'] == chapter['start_time']
        assert records[-1]['seconds'] < chapter['end_time']
        for record in (records[0], records[-1]):
            image = Image.open(BytesIO(archive.read(record['file'])))
            image.verify()
        total += len(records)
print(f'PASS: 100 chapter archives, {total:,} JPEG frames at 30fps; timestamps, frame counts and first/last images verified.')
