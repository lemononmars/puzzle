"""Extract timestamped research frames from a local Devil Dice playthrough.

Example: python scripts/extract-devil-dice-frames.py scratch/retro-playthrough.webm
For every original frame of a specific stage: add --stage 1 --fps 60
"""
import argparse
import json
import subprocess
import zipfile
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('video', type=Path)
parser.add_argument('--metadata', type=Path, default=Path('scratch/retro-video-info.json'))
parser.add_argument('--output', type=Path, default=Path('scratch/retro-frames'))
parser.add_argument('--fps', type=float, default=2)
parser.add_argument('--stage', type=int)
parser.add_argument('--width', type=int, default=960)
parser.add_argument('--resume', action='store_true')
parser.add_argument('--archive', action='store_true', help='Store frame images inside one ZIP per stage')
args = parser.parse_args()
if not args.video.is_file():
    parser.error('Local video file does not exist')
if not 0 < args.fps <= 60:
    parser.error('FPS must be between 0 and 60')
info = json.loads(args.metadata.read_text(encoding='utf-8-sig'))
chapters = [c for c in info['chapters'] if c['title'].startswith('Stage ')]
if args.stage:
    chapters = [c for c in chapters if c['title'] == f'Stage {args.stage}']
if not chapters:
    parser.error('No matching stage chapters')
args.output.mkdir(parents=True, exist_ok=True)
manifest = []
for chapter in chapters:
    stage = int(chapter['title'].split()[-1])
    destination = args.output / f'stage-{stage:03}'
    destination.mkdir(exist_ok=True)
    start, end = chapter['start_time'], chapter['end_time']
    if args.archive:
        archive = args.output/f'stage-{stage:03}.zip'
        if args.resume and archive.exists():
            print(f'Stage {stage}: archive already extracted', flush=True)
            continue
        result = subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-threads', '2',
            '-ss', str(start), '-i', str(args.video), '-t', str(end-start),
            '-vf', f'fps={args.fps},scale={args.width}:-2', '-q:v', '3',
            '-f', 'image2pipe', '-vcodec', 'mjpeg', '-'], check=True, stdout=subprocess.PIPE)
        records = []
        position = 0
        with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_STORED) as package:
            while True:
                first = result.stdout.find(b'\xff\xd8', position)
                last = result.stdout.find(b'\xff\xd9', first+2)
                if first < 0 or last < 0:
                    break
                name = f'frame-{len(records)+1:05}.jpg'
                package.writestr(name, result.stdout[first:last+2])
                records.append({'file': name, 'seconds': round(start+len(records)/args.fps, 6)})
                position = last+2
            package.writestr('timestamps.json', json.dumps(records, indent=2))
        manifest.append({'stage': stage, 'start': start, 'end': end, 'fps': args.fps,
                         'frames': len(records), 'archive': archive.name})
        print(f'Stage {stage}: archived {len(records)} frame images', flush=True)
        continue
    if args.resume and (destination/'timestamps.json').exists():
        records = json.loads((destination/'timestamps.json').read_text())
        recorded_fps = round(1 / (records[1]['seconds'] - records[0]['seconds'])) if len(records)>1 else args.fps
        manifest.append({'stage': stage, 'start': start, 'end': end, 'fps': recorded_fps,
                         'frames': len(records), 'directory': destination.name})
        print(f'Stage {stage}: already extracted', flush=True)
        continue
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-threads', '2',
                    '-ss', str(start), '-i', str(args.video), '-t', str(end-start),
                    '-vf', f'fps={args.fps},scale={args.width}:-2', '-q:v', '3',
                    str(destination / 'frame-%05d.jpg')], check=True)
    frames = sorted(destination.glob('frame-*.jpg'))[:round((end-start)*args.fps)]
    records = [{'file': f.name, 'seconds': round(start+i/args.fps, 6)}
               for i, f in enumerate(frames)]
    (destination/'timestamps.json').write_text(json.dumps(records, indent=2))
    manifest.append({'stage': stage, 'start': start, 'end': end, 'fps': args.fps,
                     'frames': len(frames), 'directory': destination.name})
    print(f'Stage {stage}: {len(frames)} frames', flush=True)
(args.output/'manifest.json').write_text(json.dumps({
    'source': 'https://www.youtube.com/watch?v=Um5NdG5McKI',
    'creator': 'BigSilentRob Retro Gaming', 'stages': manifest}, indent=2))
