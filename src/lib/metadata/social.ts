import catalog from '#lib/data/catalog.json';
import { portfolioSections } from '#lib/data/portfolioSections.js';
type Social = {title:string;description:string;image:string;imageAlt:string;canonical:string;noindex:boolean};
const defaults={title:'Puzzle · Small puzzles. Fresh discoveries.',description:'A playroom for curious minds. Play puzzles, create your own, and explore new ideas.',image:'/og-main.png',imageAlt:'Puzzle botanical playroom: Small puzzles. Fresh discoveries.'};
const fixed: Record<string, Partial<Social>> = {
 '/puzzles/cryptic/guide':{title:'Cryptic Guide / คู่มือศัพท์ซับซ้อน · Puzzle',description:'ประเภทการเล่นคำ นิยาม และวัตถุดิบ พร้อมแหล่งอ้างอิงภาษาอังกฤษ'},
 '/':defaults,
 '/library':{title:'My puzzles · Puzzle',description:'Your locally saved favorites, notes, and puzzle progress.'},
 '/search':{title:'Search / ค้นหา · Puzzle',description:'Find puzzles, tools, mechanics, and portfolio projects.'},
 '/puzzles':{title:'Play / เล่นปริศนา · Puzzle',description:'Explore quizzes, crafted puzzles, generated games, logic puzzles, and more.'},
 '/tools':{title:'Create / เครื่องมือ · Puzzle',description:'Create puzzles, solve word problems, and host games with reusable tools.'},
 '/resources':{title:'Resources / ข้อมูล · Puzzle',description:'Explore ciphers, spelling, knowledge, puzzle mechanics, and logic guides.'},
 '/portfolio':{title:'Sakulbuth Ekvittayaniphon / lemononmars',description:'Board game design, puzzle crafting, escape rooms, and playful web development.'},
 '/contact':{title:'Contact for work · Puzzle',description:'Work with Sakulbuth on puzzles, board games, events, and web development.'},
 '/shop':{title:'Puzzle bookshop · Puzzle',description:'Browse puzzle books for curious minds.'},
 '/puzzles/tbs2021':{title:'TBS2021 · Puzzle archive',description:'Thailand Board Game Show 2021 puzzles and the original event writeup.'},
 '/tools/wordsearch':{image:'/og-wordsearch-builder.png'},
 '/tools/thwordsearch':{image:'/og-thai-wordsearch.png'},
 '/tools/jigsaw':{image:'/og-jigsaw-quiz.png'},
 '/tools/crossword':{image:'/og-crossword-builder.png'},
 '/tools/check':{title:'Answer checker builder · Puzzle',description:'Create an answer-checking link for your own puzzle.'},
 '/portfolio/web-development':{image:'/images/portfolio/thai-board-game-database.png',imageAlt:'Thai Board Game Database website preview.'}
};
const entries=Object.entries(catalog).flatMap(([area,groups])=>groups.flatMap(group=>[{url:`/${area}/${group.id}`,title:group.title,description:group.description},...group.entries.map(entry=>({url:entry.href,title:entry.title,description:('description' in entry ? entry.description : undefined)??group.description}))]));
export function socialMetadata(pathname:string, data:Record<string,any>, origin:string):Social {
 const path=pathname.replace(/\/$/,'')||'/';
 const entry=entries.find(entry=>entry.url===path) ?? entries.filter(entry=>entry.url.startsWith("/") && path.startsWith(entry.url+"/")).sort((a,b)=>b.url.length-a.url.length)[0];
 const portfolio=portfolioSections.find(item=>path===`/portfolio/${item.id}`);
 let title=entry?.title ?? portfolio?.title;
 let description=entry?.description ?? portfolio?.description;
 if(data.mechanic) {title=`${data.mechanic.englishTitle} · Puzzle Mechanics`;description=data.mechanic.description;}
 else if(data.puzzle?.title && path.startsWith('/puzzles/')) {title=data.puzzle.title+(path.includes('/enigmarch/')?` · EnigMarch ${data.puzzle.year}`:'');description=data.puzzle.description ?? `Explore ${data.puzzle.title}, a puzzle from the Botanical Playroom.`;}
 else if(data.content?.title && path.startsWith('/puzzles/')) {title=data.content.title;description=data.content.description ?? description;}
 else if(data.group) {title=data.group.title;description=data.group.description;}
 // Unknown routes get a readable route title without reflecting private IDs or answer segments.
 const privatePath=/^\/(admin|board-games|check\/v1|tools\/check\/v1)(\/|$)|^\/tools\/jeopardy\/(host|player|audience)\//.test(path);
 const fallbackTitle=path.split('/').filter(Boolean).slice(0,2).map(segment=>segment.replace(/[-_]/g,' ').replace(/\b\w/g,letter=>letter.toUpperCase())).join(' / ');
 const result={...defaults,title:title?`${title} · Puzzle`:(fallbackTitle?`${fallbackTitle} · Puzzle`:defaults.title),description:description??defaults.description,...fixed[path]};
 if (data.social?.title) result.title=data.social.title;
 if (data.social?.description) result.description=data.social.description;
 if (typeof data.social?.image === 'string' && /^\/(?!\/).+\.(png|jpe?g|webp)$/i.test(data.social.image)) {result.image=data.social.image;result.imageAlt=data.social.imageAlt??result.title;}
 if(privatePath) {result.title='Puzzle';result.description=defaults.description;}
 return {...result,image:new URL(result.image,origin).href,canonical:new URL(privatePath?'/':path,origin).href,noindex:privatePath||path==='/search'||path==='/library'};
}
