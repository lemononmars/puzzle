import {brand} from "#lib/brand.js";
import catalog from '#lib/data/catalog.json';
import { portfolioSections } from '#lib/data/portfolioSections.js';
type Social = {title:string;description:string;image:string;imageAlt:string;canonical:string;noindex:boolean};
const defaults={title:brand.title,description:brand.description,image:'/og-main.png?brand=lockups-v4',imageAlt:'Chi Fun / ไขสนุก — Chi Key and Thai wordmark.'};
const fixed: Record<string, Partial<Social>> = {
 '/puzzles/cryptic/guide':{title:'Cryptic Guide / คู่มือศัพท์ซับซ้อน · Chi Fun',description:'ประเภทการเล่นคำ นิยาม และวัตถุดิบ พร้อมแหล่งอ้างอิงภาษาอังกฤษ'},
 '/':defaults,
 '/about':{title:'เกี่ยวกับ Chi Fun · ไขสนุก',description:'Chi Fun คือ ไขสนุก: ที่มาของชื่อ Chi Key และพื้นที่สำหรับเล่น สร้าง และเรียนรู้เรื่องปริศนา'},
 '/search':{title:'Search / ค้นหา · Chi Fun',description:'Find puzzles, tools, mechanics, and portfolio projects.'},
 '/puzzles':{title:'Play / เล่นปริศนา · Chi Fun',description:'Explore quizzes, crafted puzzles, generated games, logic puzzles, and more.'},
 '/tools':{title:'Create / เครื่องมือ · Chi Fun',description:'Create puzzles, solve word problems, and host games with reusable tools.'},
 '/resources':{title:'Resources / ข้อมูล · Chi Fun',description:'Explore ciphers, spelling, knowledge, puzzle mechanics, and logic guides.'},
 '/portfolio':{title:'Sakulbuth Ekvittayaniphon / lemononmars',description:'Board game design, puzzle crafting, escape rooms, and playful web development.'},
 '/contact':{title:'Contact for work · Chi Fun',description:'Work with Sakulbuth on puzzles, board games, events, and web development.'},
 '/shop':{title:'Puzzle bookshop · Chi Fun',description:'Browse puzzle books for curious minds.'},
 '/puzzles/tbs2021':{title:'TBS2021 · Puzzle archive',description:'Thailand Board Game Show 2021 puzzles and the original event writeup.'},
 '/tools/wordsearch':{image:'/og-wordsearch-builder.png?brand=lockups-v4'},
 '/tools/thwordsearch':{image:'/og-thai-wordsearch.png?brand=lockups-v4'},
 '/tools/jigsaw':{image:'/og-jigsaw-quiz.png?brand=lockups-v4'},
 '/tools/crossword':{image:'/og-crossword-builder.png?brand=lockups-v4'},
 '/tools/check':{title:'Answer checker builder · Chi Fun',description:'Create an answer-checking link for your own puzzle.'},
 '/portfolio/web-development':{image:'/og-main.png?brand=lockups-v4'}
};
const entries=Object.entries(catalog).flatMap(([area,groups])=>groups.flatMap(group=>[{url:`/${area}/${group.id}`,title:group.title,description:group.description},...group.entries.map(entry=>({url:entry.href,title:entry.title,description:('description' in entry ? entry.description : undefined)??group.description}))]));
export function socialMetadata(pathname:string, data:Record<string,any>, origin:string):Social {
 const path=pathname.replace(/\/$/,'')||'/';
 const entry=entries.find(entry=>entry.url===path) ?? entries.filter(entry=>entry.url.startsWith("/") && path.startsWith(entry.url+"/")).sort((a,b)=>b.url.length-a.url.length)[0];
 const portfolio=portfolioSections.find(item=>path===`/portfolio/${item.id}`);
 let title=entry?.title ?? portfolio?.title;
 let description=entry?.description ?? portfolio?.description;
 if(data.mechanic) {title=`${data.mechanic.englishTitle} · Puzzle Mechanics`;description=data.mechanic.description;}
 else if(data.puzzle?.title && path.startsWith('/puzzles/')) {title=data.puzzle.title+(path.includes('/enigmarch/')?` · EnigMarch ${data.puzzle.year}`:'');description=data.puzzle.description ?? `Explore ${data.puzzle.title}, a puzzle from Chi Fun / ไขสนุก.`;}
 else if(data.content?.title && path.startsWith('/puzzles/')) {title=data.content.title;description=data.content.description ?? description;}
 else if(data.group) {title=data.group.title;description=data.group.description;}
 // Unknown routes get a readable route title without reflecting private IDs or answer segments.
 const privatePath=/^\/(admin|board-games|check\/v1|tools\/check\/v1)(\/|$)|^\/tools\/jeopardy\/(host|player|audience)\//.test(path);
 const fallbackTitle=path.split('/').filter(Boolean).slice(0,2).map(segment=>segment.replace(/[-_]/g,' ').replace(/\b\w/g,letter=>letter.toUpperCase())).join(' / ');
 const result={...defaults,title:title?`${title} · Chi Fun`:(fallbackTitle?`${fallbackTitle} · Chi Fun`:defaults.title),description:description??defaults.description,...fixed[path]};
 if (data.social?.title) result.title=data.social.title;
 if (data.social?.description) result.description=data.social.description;
 if (typeof data.social?.image === 'string' && /^\/(?!\/).+\.(png|jpe?g|webp)$/i.test(data.social.image)) {result.image=data.social.image;result.imageAlt=data.social.imageAlt??result.title;}
 if(privatePath) {result.title='Chi Fun';result.description=defaults.description;}
 return {...result,image:new URL(result.image,origin).href,canonical:new URL(privatePath?'/':path,origin).href,noindex:privatePath||path==='/search'};
}
