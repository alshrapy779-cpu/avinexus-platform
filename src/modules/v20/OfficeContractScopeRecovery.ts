/** Historical restoration: fail-closed, read-only office relationship projection.
 * This module never creates financial postings, inventory movements, or farms.
 * The caller MUST enforce authenticated server-side authorization before returning data.
 */
export type OfficeContractLink = { id:string; office_id?:string; farm_id:string; status:string; contract_number?:string };
export type OfficeFarm = { id:string; [key:string]:unknown };
export type OfficePersonAssignment = { farm_id:string; [key:string]:unknown };
export type OfficeFinancialDocument = { office_id?:string; farm_id?:string; [key:string]:unknown };
export type OfficeAccess = { office_id:string; user_id:string; allowed_office_ids:readonly string[] };
export type OfficeSource = { contracts:readonly OfficeContractLink[]; farms:readonly OfficeFarm[]; assignments:readonly OfficePersonAssignment[]; documents:readonly OfficeFinancialDocument[] };

export function projectContractedOffice(access:OfficeAccess, source:OfficeSource){
  if(!access.user_id || !access.office_id || !access.allowed_office_ids.includes(access.office_id)){
    throw new Error('office_access_denied');
  }
  const contracts=source.contracts.filter(c=>c.office_id===access.office_id && c.status==='active');
  const farmIds=new Set(contracts.map(c=>c.farm_id).filter(Boolean));
  const farms=source.farms.filter(f=>farmIds.has(f.id));
  const assignments=source.assignments.filter(a=>farmIds.has(a.farm_id));
  // Office ownership is mandatory when explicitly present. A farm link must never
  // override another office's ownership (cross-tenant document disclosure).
  // Legacy documents without office_id require an active contracted farm link.
  const documents=source.documents.filter(d=>
    d.office_id
      ? d.office_id===access.office_id && (!d.farm_id || farmIds.has(d.farm_id))
      : !!d.farm_id && farmIds.has(d.farm_id)
  );
  return {office_id:access.office_id,contracts,farms,assignments,documents};
}
