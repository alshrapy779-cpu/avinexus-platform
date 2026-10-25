import fs from 'fs';import path from 'path';import crypto from 'crypto';import {fileURLToPath} from 'url';
const here=path.dirname(fileURLToPath(import.meta.url));const root=path.resolve(here,'../..');
const baseline=JSON.parse(fs.readFileSync(path.join(root,'docs/v20.2.9/FARM_R4_FACTORY_R3_PRESERVATION_BASELINE.json'),'utf8'));
const intentional=new Set(['package.json','src/App.tsx','src/data/enterpriseV11Data.ts','src/types.ts','src/components/v20/EnterpriseWebWorkspaceV20_2.tsx','server.ts']);
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');const missing=[],changed=[];
for(const [rel,h] of Object.entries(baseline.hashes)){const p=path.join(root,rel);if(!fs.existsSync(p))missing.push(rel);else if(sha(p)!==h&&!intentional.has(rel))changed.push(rel)}
const integrationChanged=[...intentional].filter(rel=>baseline.hashes[rel]&&fs.existsSync(path.join(root,rel))&&sha(path.join(root,rel))!==baseline.hashes[rel]);
console.log(`Factory R3 baseline files: ${baseline.file_count}`);console.log(`Missing: ${missing.length}`);console.log(`Unexpected changed: ${changed.length}`);console.log(`Intentional additive integration changes: ${integrationChanged.length}`);if(integrationChanged.length)console.log(integrationChanged.join('\n'));if(missing.length)console.log(missing.join('\n'));if(changed.length)console.log(changed.join('\n'));if(missing.length||changed.length)process.exit(1);console.log('FARM R4 PRESERVATION PASS — no Factory R3 file deleted or unexpectedly changed');
