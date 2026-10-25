import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const root=process.cwd();
const baselinePath=path.join(root,'docs/v20/PRESERVATION_BASELINE_V19_7.json');
const baseline=JSON.parse(fs.readFileSync(baselinePath,'utf8'));
const missingFiles=[];
for(const rel of Object.keys(baseline.files)){ if(!fs.existsSync(path.join(root,rel))) missingFiles.push(rel); }
const server=fs.readFileSync(path.join(root,'server.ts'),'utf8');
const routeRx=/app\.(get|post|put|patch|delete)\(\s*['"]([^'"]+)['"]/g;
const routeSet=new Set(); let m; while((m=routeRx.exec(server))) routeSet.add(`${m[1].toUpperCase()} ${m[2]}`);
const missingRoutes=baseline.routes.filter(r=>!routeSet.has(`${r.method} ${r.path}`));
const exportRx=/export\s+(?:default\s+)?(?:async\s+)?(?:function|class|const|let|var|interface|type|enum)\s+([A-Za-z0-9_]+)/g;
const missingExports=[];
for(const [rel,names] of Object.entries(baseline.exports)){
  const abs=path.join(root,rel); if(!fs.existsSync(abs)) continue;
  const s=fs.readFileSync(abs,'utf8'); const current=new Set(); let e; while((e=exportRx.exec(s)))current.add(e[1]);
  for(const name of names) if(!current.has(name)) missingExports.push({file:rel,export:name});
}
const result={baseline:baseline.baseline,baseline_files:baseline.file_count,missing_files:missingFiles,missing_routes:missingRoutes,missing_exports:missingExports,passed:missingFiles.length===0&&missingRoutes.length===0&&missingExports.length===0,checked_at:new Date().toISOString()};
fs.writeFileSync(path.join(root,'V20_PRESERVATION_REPORT.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
if(!result.passed) process.exit(2);
