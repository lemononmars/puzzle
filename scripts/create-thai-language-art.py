"""Editable, text-based Inkscape artwork transcribed from the supplied originals.

Render with installed Inkscape; keep text (including intentional misspellings).
Question 2 is intentionally clipped: the player must infer the continuation.
"""
from pathlib import Path
from html import escape
from math import ceil

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'static/puzzles/thai-language'
DEST.mkdir(parents=True, exist_ok=True)

def text(value, x, y, size=100, anchor='start'):
    # Inkscape's Thai shaping handles explicit nikhahit + sara aa more reliably.
    value = value.replace('\u0e33', '\u0e4d\u0e32')
    # Align the Thai middle-letter baseline with a notebook rule.
    # The intentionally off-page row stays in place so its crop is unchanged.
    if y < 794:
        y = 48 + 56 * ceil((y - 48) / 56)
    return f'<text x="{x}" y="{y}" style="font-family:TH Sarabun New;font-size:{size}px;font-weight:400;text-anchor:{anchor};fill:#263d42">{escape(value)}</text>'

def save(name, elements, height=794):
    # Add a binding gutter horizontally; retain the original page's crop.
    width = 1243
    rules = ''.join(f'<path d="M65 {y}H{width}"/>' for y in range(48, height, 56))
    holes = ''.join(f'<circle cx="32" cy="{y}" r="11" fill="#e4e8df" stroke="#cbd2c5" stroke-width="1.5"/>' for y in range(88, height, 154))
    paper = f'<rect width="{width}" height="{height}" fill="#fffdf5"/>\n<g stroke="#a8bdc2" stroke-width="1" opacity="0.3">{rules}</g>\n<path d="M94 0V{height}" stroke="#ce9d95" stroke-width="1.5" opacity="0.7"/>\n{holes}'
    svg = f'<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="{width}" height="{height}" viewBox="0 0 {width} {height}">\n<title>ปริศนาภาษาไทย</title>\n{paper}\n<g transform="translate(100 0)">\n' + '\n'.join(elements) + '\n</g>\n</svg>\n'
    (DEST / f'{name}.svg').write_text(svg, encoding='utf-8')

save('question-1', [text('ข้อที่ ๑. จงเลือกตัวอักษรภาษาไทย ๑ ตัว', 45, 133), text('ที่เติมในช่องว่างทั้งหมดได้อย่างเหมาะสม', 45, 255)] + [text(value, x, y, 170) for y, row in [(470, ['ม','□','ม','ม','พ','ม']), (685,['□','ส','□','ต','พ','ธ'])] for x,value in zip([67,240,430,610,800,980], row)])
consonants = 'กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ'
save('question-2', [text('ข้อที่ ๒. ข้อใดต่อไปนี้เป็นชื่อของอวัยวะ', 60, 137)] + [text(f'{label}. ก', [75,455,835][i%3], 390+(i//3)*155,185) for i,label in enumerate(consonants[:12])])
save('question-3', [text('ข้อที่ ๓. จงหาความหมายของชุดคำต่อไปนี้', 24, 132)] + [text(value,561,y,165,'middle') for value,y in [('หน้าบาง',370),('กลางสวน',530),('หลังฉาก',690)]])
save('question-4', [text('ข้อที่ ๔. จงเลีอกคำที่ผิดในที่นี้มา ๑ คำ',40,132),text('โดยใส่คำตอบเป็นคำที่แก้ไขถูกต้องแล้ว',40,252)] + [text(value,x,y,160) for x,values in [(75,['อนุญาต','ปรากฏ','ศีรษะ']), (600,['สังเกต','กฎหมาย','เสน่ห์'])] for y,value in zip([435,600,770],values)])
save('question-5', [text('ข้อที่ ๕. จงสลับตำแหน่งตัวอักษรต่อไปนี้',45,133),text('เพื่อสร้างเป็นคำที่เป็นของใช้ทั่วไป',45,252),text('จักรัก',561,587,245,'middle')])
save('complete', [text('คะแนนสอบ',45,256,180),text('๕/๕',820,256,180),text('ขอแสดงความยินดีด้วย !',45,455,90),text('คุณคือผู้เชี่ยวชาญการใช้ภาษาไทย',45,562,90),text('รอบหน้าตั้งเป้าหมายให้ได้คะแนนสูงขึ้นไปอีก !',45,672,85)])
print('Created six editable SVG documents:', DEST)
