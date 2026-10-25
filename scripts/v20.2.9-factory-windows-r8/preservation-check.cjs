const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'../..');
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'R7_BASELINE_SHA256.json'),'utf8'));
const allowed=new Set([
  'src/components/v20/FeedFactoryCompletionV20_2_9.tsx',
  'src/config/appVersion.ts','package.json','README.md',
  'windows/VERIFY_WINDOWS_PLATFORM.ps1','windows/INSTALL_WINDOWS_PLATFORM.ps1'
]);
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
let missing=[],unexpected=[],allowedChanged=[];
for(const [rel,h] of Object.entries(manifest)){
  const p=path.join(root,rel);
  if(!fs.existsSync(p)){missing.push(rel);continue;}
  if(sha(p)!==h)(allowed.has(rel)?allowedChanged:unexpected).push(rel);
}
console.log(`R8 preservation: baseline=${Object.keys(manifest).length} missing=${missing.length} unexpected=${unexpected.length} allowed_changed=${allowedChanged.length}`);
if(missing.length)console.log('MISSING',missing);
if(unexpected.length)console.log('UNEXPECTED',unexpected);
if(missing.length||unexpected.length)process.exit(1);
console.log('PASS R7 baseline preserved; R8 changes limited to documented Factory Windows closure integration points.');
