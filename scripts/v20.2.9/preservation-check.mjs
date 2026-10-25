import fs from 'fs'; import path from 'path'; import crypto from 'crypto'; import {fileURLToPath} from 'url';
const here=path.dirname(fileURLToPath(import.meta.url)); const root=path.resolve(here,'../..');
const baseline=JSON.parse(fs.readFileSync(path.join(root,'docs/v20.2.9/PRESERVATION_BASELINE_V20_2_8.json'),'utf8'));
const allow=new Set(['package.json','src/config/appVersion.ts','src/components/v20/EnterpriseWebWorkspaceV20_2.tsx']);
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'); const missing=[],changed=[];
for(const [rel,h] of Object.entries(baseline.hashes)){const p=path.join(root,rel);if(!fs.existsSync(p))missing.push(rel);else if(sha(p)!==h&&!allow.has(rel))changed.push(rel)}
console.log(`Baseline files: ${baseline.file_count}`); console.log(`Missing: ${missing.length}`); console.log(`Unexpected changed: ${changed.length}`); if(missing.length)console.log(missing.join('\n')); if(changed.length)console.log(changed.join('\n')); if(missing.length||changed.length)process.exit(1); console.log('PRESERVATION PASS');
