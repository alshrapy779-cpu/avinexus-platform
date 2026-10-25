/** Read-only Stage 1 gate. No application data is modified. */
const fs=require('node:fs');const path=require('node:path');const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ui=read('src/components/v20/CustomerOfficePartnerNetworkR7.tsx');
const model=read('src/modules/v20/PartnerOfficeCustomerNetworkR7.ts');
const server=read('server.ts');
const cases=[
 ['office workspace server route',/contracted-office\/:officeId\/workspace/.test(server)],
 ['office authorized discovery route',/contracted-offices\/authorized/.test(server)],
 ['office treasury reconciliation route',/treasury-reconciliation/.test(server)],
 ['office farm link API',/linkFarmToBusinessUnitV2023/.test(server)],
 ['all four currency codes', ['SAR','USD','YER_NEW','YER_OLD'].every(c=>server.includes(c)||model.includes(c))],
 ['marketing company separate party kind', /marketing_company/.test(model)],
 ['office list edit action', /const Offices=/.test(ui)&&/const Offices=[\s\S]*?const Partners=/.exec(ui)?.[0].includes('تعديل')],
 ['partner company edit action', /const Partners=[\s\S]*?const Branches=/.exec(ui)?.[0].includes('تعديل')],
 ['governorate rename/versioning action', /const Branches=[\s\S]*?const Contracts=/.exec(ui)?.[0].includes('تعديل محافظة')],
 ['contract UI create/edit actions', /const Contracts=[\s\S]*?const Catalog=/.exec(ui)?.[0].includes('onClick')],
 ['market UI create/edit actions', /const Markets=[\s\S]*?const Labs=/.exec(ui)?.[0].includes('onClick')],
 ['historical price audit model', /price_change_history/.test(model)],
 ['backend R7 price update endpoint', /app\.(post|put|patch)\(['"]\/api\/[^'"\n]*price/.test(server)],
 ['server-side authorized office read', /businessOr403V2023\(res,officeId,'read'\)/.test(server)],
 ['Windows acceptance evidence in this script', false]
];
const results=cases.map(([name,passed])=>({name,passed:!!passed,kind:'source_static_gate'}));
const out={generated_at:new Date().toISOString(),baseline:'R8.1 Step10',scope:'static code evidence, not runtime certification',passed:results.filter(x=>x.passed).length,total:results.length,results};
const target=path.join(root,'STAGE1_FUNCTIONAL_GATE_RESULTS.json');fs.writeFileSync(target,JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({passed:out.passed,total:out.total,failed:results.filter(x=>!x.passed).map(x=>x.name)},null,2));
process.exitCode=out.passed===out.total?0:2;
