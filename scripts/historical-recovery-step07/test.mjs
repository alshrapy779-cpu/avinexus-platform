import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../../src/modules/v20/InventoryBalanceQueryV2026.ts',import.meta.url),'utf8');
const server=readFileSync(new URL('../../server.ts',import.meta.url),'utf8');
assert.match(server,/inventory\/balance', requireAuthV2021\(\)/);
assert.match(server,/businessOr403V2023\(res,unitId,'read'\)/);
assert.match(src,/reservation/);
assert.match(src,/duplicate_inventory_movement_id/);
console.log('Step07 source security checks: 4/4');
