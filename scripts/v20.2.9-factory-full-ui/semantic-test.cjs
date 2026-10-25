const fs=require('fs'),path=require('path'),cp=require('child_process'),os=require('os');
const root=path.resolve(__dirname,'../..'); const checks=[]; const ok=(n,c)=>{checks.push([n,!!c]);if(!c)console.error('FAIL',n)};
const regPath=path.join(root,'src/modules/v20/FactoryFullScreenRegistryV20_2_9.ts');
const uiPath=path.join(root,'src/components/v20/FeedFactoryCompletionV20_2_9.tsx');
const reg=fs.readFileSync(regPath,'utf8'),ui=fs.readFileSync(uiPath,'utf8');
ok('full registry present',reg.includes('FACTORY_FULL_SCREENS_V2029'));
ok('nested workspace present',ui.includes('FactorySectionWorkspace'));
ok('screen selector present',ui.includes('screenCode')&&ui.includes('setScreenCode'));
ok('screen context data-bound',ui.includes('FactoryScreenContext'));
ok('screen operations retained',ui.includes('محرك العمليات المرتبط بهذه الشاشة'));
ok('registry badge 189',ui.includes('FACTORY_FULL_SCREEN_COUNT_V2029'));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'factory-full-ui-'));
try{
 cp.execFileSync('tsc',[regPath,'--target','ES2022','--module','commonjs','--outDir',tmp,'--skipLibCheck'],{stdio:'pipe'});
 const m=require(path.join(tmp,'FactoryFullScreenRegistryV20_2_9.js'));
 ok('189 screen definitions',m.FACTORY_FULL_SCREENS_V2029.length===189);
 const expected={1:7,2:5,3:15,4:3,5:3,6:3,7:7,8:3,9:10,10:5,11:15,12:27,13:13,14:32,15:41};
 for(const [k,v] of Object.entries(expected)) ok(`section ${k} screen count ${v}`,m.factoryScreensForSectionV2029(Number(k)).length===v);
 ok('unique screen codes',new Set(m.FACTORY_FULL_SCREENS_V2029.map(x=>x.code)).size===189);
 ok('no empty screen names',m.FACTORY_FULL_SCREENS_V2029.every(x=>x.name_ar&&x.name_en&&x.purpose_ar));
}catch(e){console.error(String(e.stdout||e.stack||e));ok('registry runtime compile',false)}
const failed=checks.filter(x=>!x[1]);console.log(`Factory Full UI Checks: ${checks.length}; Failed: ${failed.length}`);if(failed.length)process.exit(1);console.log('FACTORY FULL SCREEN REGISTRY PASS');
