const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'../..');
const baseline=JSON.parse(fs.readFileSync(path.join(__dirname,'baseline-r4.json'),'utf8'));
const allowed=new Set([
  'server.ts','src/index.css','src/components/v20/FarmOperationsCompletionV20_2_9.tsx','src/modules/v20/FarmDivisionScreenRegistryV20_2_9.ts','package.json','src/components/v20/EnterpriseWebWorkspaceV20_2.tsx'
]);
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const missing=[],unexpected=[];
for(const [rel,expected] of Object.entries(baseline.files)){
  const p=path.join(root,rel);if(!fs.existsSync(p)){missing.push(rel);continue;}
  const actual=sha(p);if(actual!==expected&&!allowed.has(rel))unexpected.push(rel);
}
console.log(`R4 baseline files: ${Object.keys(baseline.files).length}`);
console.log(`Missing R4 files: ${missing.length}`);
console.log(`Unexpected changed R4 files: ${unexpected.length}`);
console.log(`Allowed additive integration changes: ${allowed.size}`);
if(missing.length)console.error('MISSING:\n'+missing.join('\n'));
if(unexpected.length)console.error('UNEXPECTED CHANGES:\n'+unexpected.join('\n'));
if(missing.length||unexpected.length)process.exit(1);
console.log('FARM WINDOWS R5 PRESERVATION PASS');
