const fs=require('node:fs');const assert=require('node:assert/strict');
const server=fs.readFileSync('server.ts','utf8');const api=fs.readFileSync('src/services/apiService.ts','utf8');const ui=fs.readFileSync('src/components/v20/CustomerOfficePartnerNetworkR7.tsx','utf8');
for(const needle of ['expected_contract_price','expected_currency','offer_price_revision_conflict','res.status(409)','offer_price_expected_snapshot_required'])assert.ok(server.includes(needle),`missing server ${needle}`);
for(const needle of ['expected_contract_price','expected_currency'])assert.ok(api.includes(needle),`missing API ${needle}`);
for(const needle of ['setExpectedPrice(x.contract_price)','setExpectedCurrency(x.currency)','expected_contract_price:editId?expectedPrice!','expected_currency:editId?expectedCurrency!'])assert.ok(ui.includes(needle),`missing UI ${needle}`);
console.log('PASS: 11 source contract assertions (not an HTTP or browser integration test)');
