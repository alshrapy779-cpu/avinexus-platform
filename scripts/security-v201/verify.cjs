const fs=require('node:fs');
const assert=require('node:assert/strict');
const source=fs.readFileSync('server.ts','utf8');
const checks=[
  ['full v20 state is owner-only',/app\.get\('\/api\/v20\.1\/state', requireAuthV2021\(\), v201OwnerOnly/],
  ['flock master checks server farm scope',/app\.get\('\/api\/v20\.1\/flocks\/:id\/master', requireAuthV2021\(\), v201FlockReadScope/],
  ['daily closure requires owner',/app\.post\('\/api\/v20\.1\/flocks\/:id\/close-day', requireAuthV2021\(\), v201OwnerOnly/],
  ['reconciliation requires owner',/app\.post\('\/api\/v20\.1\/flocks\/:id\/reconciliation', requireAuthV2021\(\), v201OwnerOnly/],
  ['decision requires owner',/app\.post\('\/api\/v20\.1\/reconciliation\/:id\/decision', requireAuthV2021\(\), v201OwnerOnly/],
  ['report snapshot requires owner',/app\.post\('\/api\/v20\.1\/reports\/:kind\/:flockId', requireAuthV2021\(\), v201OwnerOnly/],
  ['role from authenticated claims',/authClaimsV2021\(res\)\.role_code!=='SYSTEM_OWNER'/],
  ['scope from authenticated server state',/authorizedFarmIdsV2026\(res\)\.has\(farmId\)/],
  ['no v20.1 legacy route missing auth',/^app\.(?:get|post|put|patch|delete)\('\/api\/v20\.1[^\n]+requireAuthV2021\(\)/m]
];
for(const [name,re] of checks){assert.match(source,re,name);console.log('PASS',name)}
const routes=source.split('\n').filter(x=>/^app\.(?:get|post|put|patch|delete)\('\/api\/v20\.1/.test(x));
assert.equal(routes.length,6);
assert.ok(routes.every(x=>x.includes('requireAuthV2021()')));
console.log(`Security source checks: ${checks.length+2}/${checks.length+2} passed`);
