/** Read-only contracted-office workspace from canonical V20.2.3 records.
 * No new financial ledger or farm registration. Authorization must be enforced by caller.
 */
import type { MultiBusinessEnterpriseStateV2023 } from './MultiBusinessEnterpriseV20_2_3';

export function contractedOfficeWorkspaceV2026(state: MultiBusinessEnterpriseStateV2023, officeId:string, at:string){
  const office=state.business_units.find(u=>u.id===officeId && u.type==='office' && u.status==='active');
  if(!office) throw new Error('active_contracted_office_not_found');
  const day=at.slice(0,10);
  const contracts=state.contracts.filter(c=>c.business_unit_id===officeId && c.status==='active' && c.start_date<=day && (!c.end_date || c.end_date>=day));
  const contractIds=new Set(contracts.map(c=>c.id));
  const links=state.farm_links.filter(l=>l.business_unit_id===officeId && l.active && l.starts_at<=at && (!l.ends_at || l.ends_at>=at) && !!l.contract_id && contractIds.has(l.contract_id));
  const farmIds=new Set(links.map(l=>l.farm_id));
  // Explicit contract farm lists also count, but never infer ownership from names.
  for(const c of contracts) for(const id of c.linked_farm_ids) if(id) farmIds.add(id);
  const staff=state.staff_assignments.filter(s=>s.business_unit_id===officeId && s.active && s.starts_at<=at && (!s.ends_at || s.ends_at>=at) && (s.farm_ids.length===0 || s.farm_ids.some(id=>farmIds.has(id))));
  const scoped=<T extends {business_unit_id:string}>(rows:readonly T[])=>rows.filter(r=>r.business_unit_id===officeId);
  return {
    office, contracts, farm_links:links, farm_ids:[...farmIds], staff,
    customers:scoped(state.customers).filter(c=>c.linked_farm_ids.length===0 || c.linked_farm_ids.some(id=>farmIds.has(id))),
    treasury_accounts:scoped(state.treasury_accounts).map(a=>({id:a.id,code:a.code,name:a.name,kind:a.kind,currency:a.currency,active:a.active,bank_name:a.bank_name,beneficiary_name:a.beneficiary_name,customer_visible:a.customer_visible})),
    // No balance is calculated from a subset of movements; Section 12 owns accounting.
    financial_documents:scoped(state.financial_documents),
    sales_invoices:scoped(state.sales_invoices), purchase_invoices:scoped(state.purchase_invoices),
    currency_codes:['SAR','USD','YER_NEW','YER_OLD'] as const,
    accounting_owner:'S12', inventory_owner:'S7', read_only:true
  };
}
