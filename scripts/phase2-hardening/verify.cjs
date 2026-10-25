const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const server = fs.readFileSync(path.join(root, 'server.ts'), 'utf8');
const api = fs.readFileSync(path.join(root, 'src/services/apiService.ts'), 'utf8');
const checks = [
  ['atomic master-data rename', /fs\.renameSync\(tmp,r7MasterFile\)/],
  ['durable fsync', /fs\.fsyncSync\(fd\)/],
  ['audit actor', /actor,action,entity_id:entityId/],
  ['price precision validation', /validR7CurrencyPrecision\(amount,currency\)/],
  ['currency-specific scale', /currency==='SAR'\|\|currency==='USD'\?2:0/],
  ['stale edit rejection', /status\(409\).*offer_price_revision_conflict/],
  ['price event history', /price_change_history:\[\.\.\.\(r7MasterState\.price_change_history\|\|\[\]\),event\]/],
  ['owner authorization', /if\(!ownerR7Or403\(res\)\)return;/],
];
for (const [name, pattern] of checks) {
  assert.match(server, pattern, name);
  console.log('PASS', name);
}
assert.match(api, /expected_contract_price/);
assert.match(api, /expected_currency/);
console.log('PASS API concurrency fields');
console.log('Phase2 hardening source checks: 10/10');
