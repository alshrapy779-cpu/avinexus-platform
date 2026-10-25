const fs=require('node:fs');
const assert=require('node:assert/strict');
const source=fs.readFileSync('server.ts','utf8');
const routes=[['GET',"app.get('/api/v11/enterprise'"],['PUT',"app.put('/api/v11/enterprise'"],['SYNC',"app.post('/api/v11/enterprise/sync'"]];
for(const [name,signature] of routes){
 const start=source.indexOf(signature);assert.ok(start>=0,`${name} route exists`);
 const segment=source.slice(start,start+430);
 assert.ok(segment.includes('requireAuthV2021()'),`${name} requires verified bearer authentication`);
 assert.ok(segment.includes("claims.role_code !== 'SYSTEM_OWNER'")||segment.includes("authClaimsV2021(res).role_code !== 'SYSTEM_OWNER'"),`${name} restricted to platform owner`);
 assert.ok(segment.includes('403'),`${name} rejects other tenants`);
 console.log(`PASS ${name} platform owner access guard`);
}
assert.ok(!source.includes("const role = String(req.headers['x-user-role'] || 'system_owner');"),'legacy V11 role header fallback removed');
console.log('PASS no V11 client-supplied role fallback');
console.log('4/4 static access checks; runtime HTTP authorization testing remains required');
