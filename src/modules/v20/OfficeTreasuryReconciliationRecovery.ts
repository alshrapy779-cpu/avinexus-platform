/** Read-only office treasury reconciliation from S12-owned canonical movements.
 * Does not post, adjust, convert or mutate accounting data. Each account retains its currency.
 */
import type { MultiBusinessEnterpriseStateV2023 } from './MultiBusinessEnterpriseV20_2_3';
export function officeTreasuryReconciliationV2026(state: MultiBusinessEnterpriseStateV2023, officeId: string, through: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(through) || Number.isNaN(Date.parse(through+'T00:00:00Z'))) throw new Error('invalid_as_of_date');
  const office = state.business_units.find(u=>u.id===officeId && u.type==='office' && u.status==='active');
  if (!office) throw new Error('active_contracted_office_not_found');
  const accounts=state.treasury_accounts.filter(a=>a.business_unit_id===officeId);
  const accountIds=new Set(accounts.map(a=>a.id));
  const seen=new Set<string>();
  const totals=new Map<string,{incoming:number;outgoing:number}>();
  for(const a of accounts){
    if(!Number.isFinite(a.opening_balance)) throw new Error('invalid_opening_balance');
    totals.set(a.id,{incoming:0,outgoing:0});
  }
  for(const m of state.treasury_movements){
    if(!accountIds.has(m.treasury_account_id))continue;
    if(m.business_unit_id!==officeId)throw new Error('cross_office_treasury_movement');
    const a=accounts.find(x=>x.id===m.treasury_account_id)!;
    if(m.original_currency!==a.currency)throw new Error('treasury_currency_mismatch');
    if(!Number.isFinite(m.original_amount)||m.original_amount<0)throw new Error('invalid_treasury_amount');
    if(seen.has(m.id))throw new Error('duplicate_treasury_movement');
    seen.add(m.id);
    if(!/^\d{4}-\d{2}-\d{2}/.test(m.occurred_at))throw new Error('invalid_movement_date');
    if(m.occurred_at.slice(0,10)>through)continue;
    const total=totals.get(a.id)!;
    if(m.direction==='in')total.incoming+=m.original_amount;
    else if(m.direction==='out')total.outgoing+=m.original_amount;
    else throw new Error('invalid_movement_direction');
  }
  return {office_id:officeId,as_of:through,accounting_owner:'S12' as const,read_only:true as const,
    accounts:accounts.map(a=>{const t=totals.get(a.id)!;return {id:a.id,code:a.code,name:a.name,kind:a.kind,currency:a.currency,opening:a.opening_balance,incoming:t.incoming,outgoing:t.outgoing,closing:a.opening_balance+t.incoming-t.outgoing};})};
}
