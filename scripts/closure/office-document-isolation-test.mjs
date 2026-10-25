import assert from 'node:assert/strict';
import {projectContractedOffice} from '../../src/modules/v20/OfficeContractScopeRecovery.ts';
const access={user_id:'user-a',office_id:'office-a',allowed_office_ids:['office-a']};
const source={contracts:[{id:'c-a',office_id:'office-a',farm_id:'farm-a',status:'active'}],farms:[{id:'farm-a'},{id:'farm-b'}],assignments:[{farm_id:'farm-a'},{farm_id:'farm-b'}],documents:[
 {id:'own',office_id:'office-a',farm_id:'farm-a'},
 {id:'other-office',office_id:'office-b',farm_id:'farm-a'},
 {id:'unrelated-farm',office_id:'office-a',farm_id:'farm-b'},
 {id:'legacy-linked',farm_id:'farm-a'},
 {id:'legacy-unlinked',farm_id:'farm-b'},
 {id:'own-office-only',office_id:'office-a'}]};
const projected=projectContractedOffice(access,source);
assert.deepEqual(projected.documents.map(d=>d.id),['own','legacy-linked','own-office-only']);
assert.deepEqual(projected.farms.map(f=>f.id),['farm-a']);
assert.deepEqual(projected.assignments.map(a=>a.farm_id),['farm-a']);
assert.throws(()=>projectContractedOffice({...access,allowed_office_ids:[]},source),/office_access_denied/);
console.log('PASS: office ownership and contracted-farm document isolation');
