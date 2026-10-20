import fs from 'node:fs/promises';
import ts from 'typescript';

// Only public metadata belongs here. Never index raw puzzle bodies, answers,
// hints, private sales, admin pages, or user-generated check URLs.
export async function publicRecords() {
 const catalog = JSON.parse(await fs.readFile('src/lib/data/catalog.json', 'utf8'));
 const records = new Map();
 const add = (url, title, description, section) => {
  if (!url.startsWith('/') || records.has(url)) return;
  records.set(url, { url, title, description, section });
 };
 for (const [area, groups] of Object.entries(catalog)) {
  add('/'+area, {puzzles:'เล่นปริศนา / Play',tools:'เครื่องมือ / Create',resources:'ข้อมูล / Resources'}[area], 'Puzzle '+area, area);
  for (const group of groups) {
   add('/'+area+'/'+group.id, group.title, group.description, area);
   for (const entry of group.entries) add(entry.href, entry.title, entry.description ?? group.description, area);
  }
 }
 const source = await fs.readFile('src/lib/data/resources/puzzleMechanics.ts', 'utf8');
 const exports = {};
 new Function('exports', ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(exports);
 for (const chapter of exports.PUZZLE_MECHANIC_CHAPTERS) for (const item of chapter.mechanics) add('/resources/mechanics/'+item.id, item.englishTitle+' / '+item.thaiTitle, item.description+' '+item.japaneseTitle, 'resources');
 for (const [url,title,description] of [
  ['/','Puzzle','Small puzzles. Fresh discoveries. A botanical playroom for curious minds.'],
  ['/portfolio','Sakulbuth Ekvittayaniphon / lemononmars','Board game design, puzzle crafting, escape rooms, and web development.'],
  ['/portfolio/board-games','Board game designer','Board game design projects and ปั้นกระดาน.'],
  ['/portfolio/puzzle-crafter','Puzzle crafter','Original puzzles, puzzle hunts, and logic puzzle events.'],
  ['/portfolio/escape-rooms','Escape room enthusiast','A world map and passport of escape room visits.'],
  ['/portfolio/web-development','Web development','Thai Board Game Database, mathematical animation, and this website.'],
  ['/contact','Contact for work / ติดต่อร่วมงาน','Puzzle design, game design, and web development.'],
  ['/shop','Puzzle bookshop / ร้านหนังสือปริศนา','Browse puzzle books.'],
  ['/puzzles/tbs2021','TBS2021','Thailand Board Game Show 2021 puzzles and event writeup.'],
  ['/puzzles/cryptic/guide','Cryptic Guide / คู่มือศัพท์ซับซ้อน','Learn cryptic wordplay types, definitions, and fodder with credited English references.']
 ]) add(url,title,description,url.startsWith('/portfolio')?'portfolio':'pages');
 const puzzles=JSON.parse(await fs.readFile('src/lib/server/enigmarch.json','utf8'));
 for (const puzzle of puzzles) add(`/puzzles/enigmarch/${puzzle.year}/${puzzle.day}`, `${puzzle.title} · EnigMarch ${puzzle.year} / Day ${puzzle.day}`, `A crafted puzzle from EnigMarch ${puzzle.year}.`, 'puzzles');
 return [...records.values()];
}
