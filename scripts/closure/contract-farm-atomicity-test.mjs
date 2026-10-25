import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../../src/modules/v20/MultiBusinessEnterpriseV20_2_3.ts',import.meta.url),'utf8');
const creation=source.split('export function createBusinessContractV2023(')[1]?.split('export function linkFarmToBusinessUnitV2023(')[0]||'';
const linking=source.split('export function linkFarmToBusinessUnitV2023(')[1]?.split('export function assignBusinessStaffV2023(')[0]||'';
for(const token of ['linked_farm_ids:farmIds','status===\'active\'','farm_links:[...links,...state.farm_links]','farm_already_linked_to_active_business_unit','contract_id:row.id','farm_business_link_create'])assert.ok(creation.includes(token),`missing atomic contract rule: ${token}`);
for(const token of ['contract.business_unit_id!==input.business_unit_id','contract.status!==\'active\'','contract.linked_farm_ids.includes(input.farm_id)','farm_contract_scope_invalid'])assert.ok(linking.includes(token),`missing scope check: ${token}`);
console.log('PASS contract-to-farm atomic source invariants (not runtime/API certification)');
