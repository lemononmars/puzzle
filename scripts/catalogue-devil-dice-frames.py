"""Build opening contact sheets and a local image index for extracted stages."""
import json
from pathlib import Path
from PIL import Image, ImageDraw

root = Path('scratch/retro-frames')
sheets = root/'contact-sheets'
sheets.mkdir(exist_ok=True)
links = []
for stage in sorted(root.glob('stage-*')):
    timestamps = stage/'timestamps.json'
    if not timestamps.exists():
        continue
    records = json.loads(timestamps.read_text())[:16]
    canvas = Image.new('RGB', (1600, 1000), '#e9eddf')
    draw = ImageDraw.Draw(canvas)
    for i, record in enumerate(records):
        image = Image.open(stage/record['file'])
        image.thumbnail((396, 222))
        x, y = (i % 4)*400, (i//4)*250
        canvas.paste(image, (x, y+24))
        draw.text((x+8, y+5), f'{stage.name} | {record["seconds"]:.3f}s', fill='#243b2e')
    canvas.save(sheets/f'{stage.name}.jpg', quality=90)
    links.append(f'<article><h2>{stage.name}</h2><a href="contact-sheets/{stage.name}.jpg"><img loading="lazy" src="contact-sheets/{stage.name}.jpg" alt="Opening frames for {stage.name}"></a><a href="{stage.name}/timestamps.json">Sample timestamps</a> · <a href="../retro-frame-archives/{stage.name}.zip">Every frame (ZIP)</a></article>')
(root/'index.html').write_text('''<!doctype html><meta charset="utf-8"><title>Devil Dice stage references</title>
<style>body{font:16px system-ui;background:#e9eddf;color:#243b2e;margin:24px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:24px}img{width:100%}a{color:inherit}h1{font-size:26px}h2{font-size:18px}</style>
<h1>Devil Dice — 100 stage reference frames</h1><p>Recording: <a href="https://www.youtube.com/watch?v=Um5NdG5McKI">BigSilentRob Retro Gaming</a>. Original game: Shift, 1998. Research captures; stage chapter markers may precede the playable board.</p><main>'''+''.join(links)+'</main>', encoding='utf-8')
print(f'Created {len(links)} stage contact sheets and index.')
