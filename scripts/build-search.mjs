import fs from 'node:fs/promises';
import * as pagefind from 'pagefind';
import { publicRecords } from './public-records.mjs';
const records=await publicRecords();
const {index,errors}=await pagefind.createIndex({ forceLanguage:'th' });
if (!index || errors?.length) throw new Error(JSON.stringify(errors));
try {
 for(const record of records) {
  const result=await index.addCustomRecord({url:record.url,content:`${record.title}\n${record.description}`,language:'th',meta:{title:record.title,description:record.description},filters:{section:[record.section]}});
  if(result.errors?.length) throw new Error(JSON.stringify(result.errors));
 }
 await index.writeFiles({outputPath:'static/pagefind'});
 await fs.writeFile('static/search-records.json',JSON.stringify(records));
 console.log(`Pagefind: indexed ${records.length} public titles and descriptions (solutions and unlisted pages excluded).`);
} finally { await pagefind.close(); }
