const fs=require('node:fs');const assert=require('node:assert/strict');
const s=fs.readFileSync('server.ts','utf8');
const tests=[
 ['customer endpoint authenticated',/app\.get\('\/api\/v18\/customer\/:farmId', requireAuthV2021\(\)/],
 ['customer farm scope enforced',/if\(!authorizedFarmIdsV2026\(res\)\.has\(req\.params\.farmId\)\)/],
 ['workspace authenticated',/app\.get\('\/api\/v20\.2\.9\/role-workspace', requireAuthV2021\(\)/],
 ['role checked',/supported\.has\(role\)/],
 ['farm scope server derived',/const farmIds=authorizedFarmIdsV2026\(res\)/],
 ['consultant assigned only',/c\.assigned_consultant_user_id===claims\.sub/],
 ['worker tasks assigned only',/t\.assigned_user_id===claims\.sub/],
 ['no worker medical cases',/medical_cases:role==='FARM_WORKER'\?\[\]:visibleCases/],
 ['private response no store',/res\.setHeader\('Cache-Control','private, no-store'\)/]
];for(const [name,re] of tests){assert.match(s,re,name);console.log('PASS',name)}console.log(`${tests.length}/${tests.length} source checks passed; not HTTP or Windows certification`);
