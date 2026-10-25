const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'../..');
const baseline=JSON.parse(fs.readFileSync(path.join(__dirname,'baseline-r5.json'),'utf8'));
const allowed=new Set([
  'package.json','README.md','src/App.tsx','src/components/v20/EnterpriseWebWorkspaceV20_2.tsx',
  'src/modules/v20/FarmDivisionCompletionV20_2_9.ts','windows/INSTALL_WINDOWS_PLATFORM.ps1','windows/VERIFY_WINDOWS_PLATFORM.ps1'
]);
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const missing=[],unexpected=[],allowedChanged=[];
for(const [rel,expected] of Object.entries(baseline.files)){
  const p=path.join(root,rel); if(!fs.existsSync(p)){missing.push(rel);continue;}
  const actual=sha(p); if(actual!==expected){if(allowed.has(rel))allowedChanged.push(rel);else unexpected.push(rel);}
}
console.log(`R5 baseline files: ${Object.keys(baseline.files).length}`);
console.log(`Missing R5 files: ${missing.length}`);
console.log(`Unexpected changed R5 files: ${unexpected.length}`);
console.log(`Approved additive integration changes used: ${allowedChanged.length}`);
if(allowedChanged.length)console.log(allowedChanged.map(x=>`  + ${x}`).join('\n'));
if(missing.length)console.error('MISSING:\n'+missing.join('\n'));
if(unexpected.length)console.error('UNEXPECTED CHANGES:\n'+unexpected.join('\n'));
if(missing.length||unexpected.length)process.exit(1);
console.log('FARM WINDOWS R6 PRESERVATION PASS');
