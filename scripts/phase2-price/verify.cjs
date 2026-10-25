const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const server=fs.readFileSync(path.join(root,'server.ts'),'utf8');
const api=fs.readFileSync(path.join(root,'src/services/apiService.ts'),'utf8');
const ui=fs.readFileSync(path.join(root,'src/components/v20/CustomerOfficePartnerNetworkR7.tsx'),'utf8');
const checks={
 'Create endpoint':server.includes("app.post('/api/r7/master/offers'"),
 'Revision endpoint':server.includes("app.patch('/api/r7/master/offers/:id'"),
 'Server authorization':server.includes("if(!ownerR7Or403(res))return;"),
 'Historical price event':server.includes('price_change_history:[...(r7MasterState.price_change_history||[]),event]'),
 'Revision reason':server.includes('offer_price_change_reason_required'),
 'No cross-company offer move':server.includes('offer_organization_immutable'),
 'Duplicate SKU prevention':server.includes('offer_duplicate_sku'),
 'Currency validation':server.includes("'YER_NEW','YER_OLD'"),
 'Read-back price catalog':server.includes('offers:r7MasterState.offers,')&&server.includes('price_change_history:r7MasterState.price_change_history'),
 'Client POST/PATCH':api.includes('async saveR7Offer(')&&api.includes("method:offer.id?'PATCH':'POST'"),
 'UI server save':ui.includes('await apiService.saveR7Offer('),
 'UI refresh':ui.includes('offers:identity.offers,')&&ui.includes('price_change_history:identity.price_change_history'),
 'UI guards':ui.includes('!identityLoaded||identityBusy'),
 'Regional market retained':ui.includes('const Markets=')
};
for(const [name,pass] of Object.entries(checks)){console.log(`${pass?'PASS':'FAIL'} ${name}`);assert.ok(pass,name)}
console.log(`${Object.keys(checks).length}/${Object.keys(checks).length} source contract checks passed (not HTTP or Windows E2E)`);
