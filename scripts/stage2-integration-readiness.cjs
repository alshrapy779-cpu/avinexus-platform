const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=(p)=>fs.existsSync(path.join(root,p))?fs.readFileSync(path.join(root,p),'utf8'):'';
const server=read('server.ts');
const all=[];
function check(id,description,ok,evidence){all.push({id,description,status:ok?'FOUND_SOURCE_EVIDENCE':'REQUIRES_IMPLEMENTATION_OR_VERIFICATION',evidence});}
const modules=[['office','office'],['farm','farm'],['factory','factory'],['finance','finance'],['ai','ai'],['market','market']];
for(const [id,needle] of modules){check('module_'+id,'Presence of '+id+' source references',server.toLowerCase().includes(needle), 'server.ts textual reference; does not certify runtime');}
check('server_auth','Server authentication references',/auth|authenticate|requireUser|requireAuth/i.test(server),'server.ts textual check');
check('server_office_scope','Office scope references',/office_id|officeId|office.*scope/i.test(server),'server.ts textual check');
check('server_audit','Audit trail references',/audit|auditLog/i.test(server),'server.ts textual check');
check('server_currency','All four currency codes', ['SAR','USD','YER_NEW','YER_OLD'].every(x=>server.includes(x)),'server.ts literal currency codes');
check('office_360','Office 360 frontend references',fs.existsSync(path.join(root,'src/components/customer/CustomerOfficePartnerNetworkR7.tsx')) || fs.existsSync(path.join(root,'src/components/admin/CustomerOfficePartnerNetworkR7.tsx')),'filename presence only');
check('windows_verify','Windows verification script',fs.existsSync(path.join(root,'windows/VERIFY_WINDOWS_PLATFORM.ps1')),'script existence only');
check('stage1_gate','Stage 1 gate present',fs.existsSync(path.join(root,'scripts/stage1-historical-functional-gate.cjs')),'unresolved failures must be fixed');
const result={date:'2026-10-19',phase:'2 - integration baseline',certification:'NOT_PRODUCTION_READY',source_checks:all,summary:{checks:all.length,found:all.filter(x=>x.status==='FOUND_SOURCE_EVIDENCE').length,requires_verification:all.filter(x=>x.status!=='FOUND_SOURCE_EVIDENCE').length},mandatory_e2e:['Historical V17-V20 behavior restoration','Office contract -> existing farm visibility with server isolation','Marketing company vs contracted office segregation','Price and governorate CRUD with append-only history','S7 inventory balances and S12 financial balances','Four currency posting and reconciliation','AI authorized read and controlled actions','Windows build/start/restart/persistence/print and backup restore']};
fs.writeFileSync(path.join(root,'STAGE2_INTEGRATION_READINESS.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result.summary));
