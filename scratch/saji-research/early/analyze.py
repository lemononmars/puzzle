from pathlib import Path
import re,base64,hashlib,itertools,json
root=Path(__file__).parent
text='そこは静かなのだろう。週末、消す準備は済ませた。君を守るためだ'
cells=' '*6+text
print('DIARY sundays',cells[::7], 'cells',len(cells))
alphabet=''.join(chr(e^((109+i*7)&127)) for i,e in enumerate([3,27,12,110,102,113,115,119,75,75]))
print('LAFTG alphabet',alphabet)
def fnv(s):
 h=2166136261
 for c in s:h=((h^ord(c))*16777619)&0xffffffff
 return h
for n in range(1,5):
 for chars in itertools.product(alphabet,repeat=n):
  s=''.join(chars)
  if fnv(s) in [376399990,682728183]:print('LAFTG answer',s,fnv(s))
source=(root/'alight.js').read_text(encoding='utf-8-sig')
data=base64.b64decode('+oKuUGRCGTTU8YSQRnQCLjrfy5i4SWMc')
print('ALIGHT banks',bytes(c^((173+i*29)&255) for i,c in enumerate(data)).decode())
print('SONOKANNI sai-go',hashlib.sha256('さいご'.encode()).hexdigest())
source=(root/'iroiro.js').read_text(encoding='utf-8-sig')
for x in re.findall(r'unpack\("([A-Za-z0-9+/=]+)"\)',source):
 print('IROIRO',base64.b64decode(x).decode())
source=(root/'search.js').read_text(encoding='utf-8-sig')
for x in re.findall(r'"([A-Za-z0-9+/=]{12,})"',source)[:6]:
 try:print('SEARCH target',base64.b64decode(x).decode())
 except:pass
