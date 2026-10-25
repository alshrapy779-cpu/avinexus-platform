const fs=require('fs'),path=require('path'),cp=require('child_process'),os=require('os');
const root=path.resolve(__dirname,'../..'); const checks=[]; const ok=(n,c)=>{checks.push([n,!!c]);if(!c)console.error('FAIL',n)};
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const component=read('src/components/v20/CompletionGateV20_2_9.tsx');
const registry=read('src/modules/v20/DepartmentCompletenessV20_2_9.ts');
const workspace=read('src/components/v20/EnterpriseWebWorkspaceV20_2.tsx');
const pkg=JSON.parse(read('package.json'));
ok('version 20.2.9',pkg.version==='20.2.9');
for(const x of ['بوابة 90%','الأشخاص 360','الشركات/المكاتب 360','العملاء 360','الموردون 360','المزارع 360','كل التواريخ والحركات'])ok(`surface ${x}`,component.includes(x));
for(const x of ['Person','Customer','Supplier','Farm','Business']) ok(`360 code ${x}`,component.toLowerCase().includes(x.toLowerCase()));
for(const d of ['EXEC','ORG','OFFICE','FACTORY','MATERIALS','PROC','INVENTORY','SUP','CUSTOMER','SALES','MARKETING','TREASURY','FIN','FX','BANK','HR','PAYROLL','VET','CONS','LAB','FIELD','FARM','LOG','REPORTS','IT'])ok(`department ${d}`,registry.includes(`'${d}'`));
ok('workspace wired',workspace.includes('CompletionGateV2029')&&workspace.includes("completion_v2029"));
ok('regular role visibility gate',component.includes('privileged(currentUser.role)')&&component.includes('currentUser.id'));
ok('android remains deferred',read('VERSION_V20_2_8.txt').includes('Android: deferred'));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'v2029-'));
try{
  cp.execFileSync('tsc',[path.join(root,'src/modules/v20/DepartmentCompletenessV20_2_9.ts'),'--target','ES2022','--module','commonjs','--outDir',tmp,'--skipLibCheck'],{stdio:'pipe'});
  const m=require(path.join(tmp,'DepartmentCompletenessV20_2_9.js')); const rows=m.departmentCompletionRegistryV2029(); const global=m.globalCompletionV2029(rows);
  ok('25 departments audited',rows.length===25); ok('every department >=90',rows.every(x=>x.score>=90)); ok('global gate passed',global.passed90===true); ok('record field completeness engine',m.fieldCompletenessV2029({id:'1',name:'A',role:'worker',status:'active'},['id','name','role','status']).score===100);
}catch(e){console.error(String(e.stdout||e.message));ok('pure module compiles',false)}
const failed=checks.filter(x=>!x[1]); console.log(`Checks: ${checks.length}; Failed: ${failed.length}`); if(failed.length)process.exit(1); console.log('V20.2.9 SEMANTIC PASS');
