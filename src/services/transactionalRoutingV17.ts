import {
  EnterpriseOperationsV11State,
  FlockSalePipelineV17,
  FlockSaleSettlementV17,
  PoultryMarketerContractV12,
  PoultryMarketingDailyRateV12,
  SupplierRoutingOrderV17,
  PartnerTradeContractV12,
  FarmLeaseListingV17,
  ApprovedSupplementProtocolV17
} from '../types';

const nowIso = () => new Date().toISOString();

export function buildBrokerQueueV17(
  contracts: PoultryMarketerContractV12[],
  governorate: string,
  timeoutMinutes: number
): FlockSalePipelineV17['broker_queue'] {
  const active = contracts.filter(c => c.status === 'active');
  return active
    .map(c => ({ c, regionMatch: c.governorates.includes(governorate) }))
    .sort((a, b) => Number(b.regionMatch) - Number(a.regionMatch) || a.c.settlement_days - b.c.settlement_days)
    .map(({ c, regionMatch }, index) => ({
      broker_contract_id: c.id,
      broker_name: c.company_name || c.marketer_name,
      priority: index + 1,
      region_match: regionMatch,
      status: 'pending' as const,
      settlement_days: c.settlement_days,
      mortality_terms:
        c.mortality_liability === 'none'
          ? 'لا يتحمل المكتب النافق بعد الاستلام حسب العقد.'
          : c.mortality_liability === 'limited_window'
            ? `تحمل محدود لمدة ${c.mortality_liability_hours} ساعة وبحد ${c.mortality_liability_cap_percent ?? 0}% وفق العقد.`
            : 'يتحمل المكتب المسؤولية حتى التسليم/الاستلام وفق العقد.',
      expires_at: new Date(Date.now() + timeoutMinutes * 60_000).toISOString()
    }));
}

export function resolvePublishedBourseRateV17(
  rates: PoultryMarketingDailyRateV12[],
  governorate: string,
  district: string,
  averageWeightKg: number
) {
  const published = rates.filter(r => r.published && r.governorate === governorate);
  const districtMatches = published.filter(r => !r.district || r.district === district);
  const pool = districtMatches.length ? districtMatches : published;
  if (!pool.length) return undefined;
  const weightText = String(averageWeightKg.toFixed(2));
  return pool.find(r => r.weight_category.includes(weightText)) || pool[0];
}

export function activateCurrentBrokerAttemptV17(pipeline: FlockSalePipelineV17): FlockSalePipelineV17 {
  if (!pipeline.broker_queue.length) return { ...pipeline, status: 'human_sales_intervention', updated_at: nowIso() };
  const idx = Math.min(pipeline.current_broker_index, pipeline.broker_queue.length - 1);
  const timeout = pipeline.broker_timeout_minutes;
  const queue = pipeline.broker_queue.map((x, i) => i === idx ? {
    ...x,
    status: 'offered' as const,
    offered_at: nowIso(),
    expires_at: new Date(Date.now() + timeout * 60_000).toISOString()
  } : x);
  return { ...pipeline, broker_queue: queue, status: 'routing_brokers', updated_at: nowIso() };
}

export function routeToNextBrokerV17(pipeline: FlockSalePipelineV17, reason = 'انتهت المهلة أو تم الاعتذار'): FlockSalePipelineV17 {
  const idx = pipeline.current_broker_index;
  const queue = pipeline.broker_queue.map((x, i) => i === idx && ['offered','pending'].includes(x.status)
    ? { ...x, status: 'expired' as const, rejection_reason: x.rejection_reason || reason, responded_at: nowIso() }
    : x);
  const next = idx + 1;
  if (next >= queue.length) return { ...pipeline, broker_queue: queue, current_broker_index: next, status: 'human_sales_intervention', updated_at: nowIso() };
  const nextQueue = queue.map((x, i) => i === next ? {
    ...x,
    status: 'offered' as const,
    offered_at: nowIso(),
    expires_at: new Date(Date.now() + pipeline.broker_timeout_minutes * 60_000).toISOString()
  } : x);
  return { ...pipeline, broker_queue: nextQueue, current_broker_index: next, status: 'routing_brokers', updated_at: nowIso() };
}

export function calculateFlockSettlementV17(
  pipeline: FlockSalePipelineV17,
  invoiceLines: FlockSaleSettlementV17['invoice_lines'],
  debtDeductionYer = 0,
  otherDeductionsYer = 0
): FlockSaleSettlementV17 {
  const gross = invoiceLines.reduce((s, x) => s + x.line_total_yer, 0);
  const accepted = pipeline.broker_queue.find(x => x.status === 'accepted');
  let marketingFee = 0;
  if (pipeline.marketing_fee_mode === 'percent_of_sale') marketingFee = gross * pipeline.marketing_fee_value / 100;
  if (pipeline.marketing_fee_mode === 'fixed_per_kg') marketingFee = invoiceLines.reduce((s, x) => s + x.total_weight_kg, 0) * pipeline.marketing_fee_value;
  if (pipeline.marketing_fee_mode === 'fixed_per_load') marketingFee = pipeline.marketing_fee_value;
  const platformFee = gross * pipeline.platform_commission_percent / 100;
  return {
    id: `settle-v17-${Date.now()}`,
    sale_pipeline_id: pipeline.id,
    broker_name: accepted?.broker_name || 'مكتب التسويق المعتمد',
    customer_name: pipeline.customer_name,
    gross_sale_yer: Math.round(gross),
    marketing_fee_yer: Math.round(marketingFee),
    platform_fee_yer: Math.round(platformFee),
    debt_deduction_yer: Math.max(0, Math.round(debtDeductionYer)),
    other_deductions_yer: Math.max(0, Math.round(otherDeductionsYer)),
    net_customer_yer: Math.max(0, Math.round(gross - marketingFee - platformFee - debtDeductionYer - otherDeductionsYer)),
    invoice_lines: invoiceLines,
    status: 'awaiting_broker_payment',
    created_at: nowIso()
  };
}

export function buildSupplierQueueV17(
  contracts: PartnerTradeContractV12[],
  category: SupplierRoutingOrderV17['category'],
  governorate: string,
  timeoutMinutes: number
): SupplierRoutingOrderV17['supplier_queue'] {
  const businessMap: Record<SupplierRoutingOrderV17['category'], string[]> = {
    medicine: ['شركة أدوية','مكتب أدوية'],
    antibiotic: ['شركة أدوية','مكتب أدوية'],
    vaccine: ['وكيل لقاحات','شركة أدوية','مكتب أدوية'],
    feed: ['مصنع/مطبخ أعلاف'],
    chicks: ['مفرخ كتاكيت'],
    equipment: ['مورد معدات']
  };
  const allowed = new Set(businessMap[category]);
  return contracts
    .filter(c => c.status === 'active' && c.customer_visible && allowed.has(c.business_type))
    .map(c => ({ c, regionMatch: c.governorates.includes(governorate) }))
    .sort((a,b)=>Number(b.regionMatch)-Number(a.regionMatch) || b.c.customer_discount_percent-a.c.customer_discount_percent)
    .map(({c,regionMatch}, index)=>({
      partner_contract_id:c.id,
      supplier_name:c.partner_name,
      priority:index+1,
      governorate_match:regionMatch,
      status:'pending' as const,
      expires_at:new Date(Date.now()+timeoutMinutes*60_000).toISOString()
    }));
}

export function routeToNextSupplierV17(order: SupplierRoutingOrderV17, reason='انتهت المهلة أو المورد اعتذر'): SupplierRoutingOrderV17 {
  const idx=order.current_supplier_index;
  const q=order.supplier_queue.map((x,i)=>i===idx && ['pending','offered'].includes(x.status)?{...x,status:'expired' as const,rejection_reason:x.rejection_reason||reason}:x);
  const next=idx+1;
  if(next>=q.length) return {...order,supplier_queue:q,current_supplier_index:next,status:'sales_review'};
  const q2=q.map((x,i)=>i===next?{...x,status:'offered' as const,offered_at:nowIso(),expires_at:new Date(Date.now()+order.supplier_timeout_minutes*60_000).toISOString()}:x);
  return {...order,supplier_queue:q2,current_supplier_index:next,status:'routing_suppliers'};
}

export function estimateLeaseCapacityV17(lengthM:number,widthM:number,density:number){
  return Math.max(0, Math.floor(lengthM*widthM*Math.max(0,density)));
}

export function recalcLeaseListingV17(listing: FarmLeaseListingV17, defaultCommissionPercent:number): FarmLeaseListingV17 {
  const commissionPercent=listing.platform_commission_percent || defaultCommissionPercent;
  return {
    ...listing,
    estimated_capacity_birds:estimateLeaseCapacityV17(listing.length_m,listing.width_m,listing.target_density_birds_m2),
    platform_commission_percent:commissionPercent,
    platform_commission_yer:Math.round(listing.asking_price_yer*commissionPercent/100)
  };
}

export function findApprovedSupplementProtocolV17(
  protocols: ApprovedSupplementProtocolV17[],
  ageDays:number,
  climate:'hot'|'cold'|'moderate'
){
  return protocols.find(p=>p.active && ageDays>=p.min_age_days && ageDays<=p.max_age_days && (p.climate==='any'||p.climate===climate));
}

export function appendRoutedReportV17(
  enterprise: EnterpriseOperationsV11State,
  category: EnterpriseOperationsV11State['report_routing_rules_v17'][number]['category'],
  governorate: string,
  reference: string,
  summary: string
){
  const rule=enterprise.report_routing_rules_v17.find(r=>r.active && r.category===category && (r.governorate===governorate||r.governorate==='ALL'));
  if(!rule) return enterprise;
  const routed={
    id:`routed-v17-${Date.now()}`,created_at:nowIso(),category,governorate,reference,summary,
    assigned_to:rule.primary_staff_name,assigned_role:rule.primary_role,
    channels:[...(rule.app_notification?['app' as const]:[]),...(rule.whatsapp_notification?['whatsapp' as const]:[])],
    status:'queued' as const
  };
  return {...enterprise,routed_reports_v17:[routed,...enterprise.routed_reports_v17]};
}
