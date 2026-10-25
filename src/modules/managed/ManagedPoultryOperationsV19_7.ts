import type { CatalogCategoryV195, CurrencyV195, PlatformCoreStateV195, PlatformRoleV195 } from '../platform/PlatformCoreV19_5';
import type { EnterpriseCoreStateV196 } from '../enterprise/EnterpriseCoreV19_6';

export type CustomerJourneyV197 = 'marketplace'|'managed_farm';
export type AvailabilityStateV197 = 'available'|'limited'|'unconfirmed'|'unavailable'|'paused';
export type UrgencyV197 = 'normal'|'urgent'|'critical';
export type ManagedContractStatusV197 = 'draft'|'pending_owner'|'pending_platform'|'active'|'suspended'|'completed'|'terminated';
export type FlockCycleStatusV197 = 'preparation'|'ready_for_placement'|'active'|'marketing'|'selling'|'closed'|'suspended';
export type DailyReportShiftV197 = 'morning'|'evening'|'daily_close';
export type ApprovalDecisionV197 = 'pending'|'approved'|'clarification_requested'|'rejected';
export type FarmTaskStatusV197 = 'pending'|'in_progress'|'completed'|'blocked'|'skipped';
export type ChatGroupCategoryV197 = 'farm_operations'|'veterinary_board'|'finance_procurement'|'executive_control';
export type SaleStatusV197 = 'draft'|'owner_review'|'approved'|'loading'|'in_transit'|'delivered'|'settled'|'cancelled';
export type MarketplaceRequestStatusV197 = 'draft'|'checking'|'supplier_confirmed'|'customer_confirmed'|'payment_pending'|'paid'|'preparing'|'out_for_delivery'|'delivered'|'cancelled'|'needs_alternative'|'escalated_to_vet';

export interface ServicePackageV197 {
  id:string; code:string; name:string; journey:CustomerJourneyV197; description:string;
  billing_mode:'transaction_commission'|'monthly'|'per_cycle'|'hybrid'; active:boolean;
  includes:string[];
}

export interface CustomerProfileV197 {
  id:string; customer_code:string; journey:CustomerJourneyV197; full_name:string; phone:string; whatsapp?:string;
  governorate:string; district:string; address:string; gps?:{lat:number;lng:number}; status:'active'|'pending'|'suspended'|'archived';
  service_package_id:string; referral_source?:string; consent:{privacy:boolean;managed_data:boolean;marketing:boolean;accepted_at?:string};
  farm_ids:string[]; created_at:string; updated_at:string;
}

export interface SupplierAvailabilityOfferV197 {
  id:string; offer_number:string; company_id:string; company_name:string; branch_id:string; branch_name:string;
  governorate:string; district:string; product_id:string; product_name:string; category:CatalogCategoryV195;
  scientific_name?:string; unit:string; cold_chain_required:boolean; status:AvailabilityStateV197;
  quantity_disclosure:'hidden'|'range'|'exact'; disclosed_quantity?:number; quantity_band?:'sufficient'|'limited'|'very_limited';
  prices:Array<{currency:CurrencyV195;amount:number;active:boolean}>; last_confirmed_at?:string; confirmed_by?:string;
  next_attestation_due_at:string; response_sla_minutes:number; active:boolean;
}

export interface AvailabilityAttestationV197 {
  id:string; attestation_number:string; branch_id:string; branch_name:string; date:string; requested_at:string;
  due_at:string; status:'pending'|'responded'|'overdue'; items:Array<{
    offer_id:string; product_name:string; previous_status:AvailabilityStateV197; status:AvailabilityStateV197;
    quantity_band?:'sufficient'|'limited'|'very_limited'; price_changed:boolean; note?:string;
  }>;
  responded_at?:string; responded_by?:string;
}

export interface MarketplaceAvailabilityRequestV197 {
  id:string; request_number:string; created_at:string; customer_id?:string; customer_name:string; phone:string; whatsapp?:string;
  governorate:string; district:string; address:string; gps?:{lat:number;lng:number}; product_id:string; product_name:string;
  category:CatalogCategoryV195; requested_quantity:number; unit:string; urgency:UrgencyV197; max_wait_hours?:number;
  farm_context?:{farm_name?:string;flock_age_days?:number;flock_size?:number;mortality_today?:number;symptoms?:string;vaccination_history?:string;treatment_history?:string;media_refs?:string[]};
  route_attempts:Array<{branch_id:string;branch_name:string;sent_at:string;status:'waiting'|'confirmed'|'declined'|'timeout';available_quantity_band?:string;eta_hours?:number;note?:string}>;
  selected_offer_id?:string; selected_branch_id?:string; selected_branch_name?:string; confirmed_price?:number; confirmed_currency?:CurrencyV195;
  transport_cost?:number; platform_commission?:number; total_customer_price?:number; estimated_arrival_at?:string;
  alternative_offer_ids:string[]; vet_gate_required:boolean; vet_approved?:boolean; vet_approved_by?:string;
  status:MarketplaceRequestStatusV197; notes?:string;
}

export interface MarketplaceEmergencyCaseV197 {
  id:string; case_number:string; request_id:string; created_at:string; customer_name:string; phone:string; governorate:string; district:string; address:string;
  product_name:string; urgency:UrgencyV197; max_wait_hours?:number; farm_context?:MarketplaceAvailabilityRequestV197['farm_context'];
  attempted_branches:string[]; alternative_offer_ids:string[]; assigned_vet_id?:string; assigned_vet_name?:string;
  status:'open'|'assigned'|'under_review'|'resolved'|'closed'; resolution_note?:string;
}

export interface ManagedFarmContractV197 {
  id:string; contract_number:string; customer_id:string; customer_name:string; farm_id:string; farm_name:string;
  service_package_id:string; start_date:string; end_date:string; currency:CurrencyV195; management_fee:number;
  platform_commission_percent:number; payment_terms:string; owner_approval_threshold:number;
  assigned_vet_id:string; assigned_vet_name:string; assigned_worker_ids:string[]; assigned_worker_names:string[];
  finance_officer_id:string; finance_officer_name:string; office_id?:string; office_name:string; marketing_officer_name?:string;
  status:ManagedContractStatusV197; owner_signed:boolean; platform_signed:boolean; created_at:string; updated_at:string;
}

export interface ManagedFarmV197 {
  id:string; farm_code:string; customer_id:string; customer_name:string; name:string; governorate:string; district:string; address:string;
  gps?:{lat:number;lng:number}; water_source?:string; electricity_source?:string; generator_available:boolean; biosecurity_score:number;
  compliance_score:number; status:'onboarding'|'active'|'suspended'|'archived'; house_ids:string[]; active_flock_ids:string[];
}

export interface FarmHouseV197 {
  id:string; farm_id:string; code:string; name:string; length_m:number; width_m:number; area_m2:number; capacity_birds:number;
  feeder_count:number; drinker_count:number; heater_count:number; fan_count:number; ventilation_type:string; litter_type:'wood_shavings'|'straw'|'other';
  equipment_notes?:string; maintenance_status:'ready'|'needs_attention'|'blocked'; photo_refs:string[];
}

export interface PrePlacementChecklistV197 {
  id:string; flock_id:string; farm_id:string; house_id:string; created_at:string; target_placement_at:string;
  cleaning_completed:boolean; washing_completed:boolean; disinfectant_name:string; disinfectant_concentration:string; disinfectant_quantity:number;
  disinfectant_unit:string; disinfection_at?:string; drying_hours:number; dark_rest_hours:number; preheat_target_c:number;
  water_ready:boolean; feed_ready:boolean; electricity_ready:boolean; generator_ready:boolean; equipment_ready:boolean; litter_ready:boolean;
  photo_refs:string[]; worker_signed_by?:string; vet_reviewed_by?:string; vet_reviewed_at?:string;
  status:'not_ready'|'preparing'|'needs_correction'|'vet_approved'|'ready_for_placement'; correction_notes?:string;
}

export interface PlacementReceiptV197 {
  id:string; flock_id:string; received_at:string; hatchery_name:string; source_batch?:string; breed:string; hatch_date?:string;
  document_count:number; received_count:number; arrival_mortality:number; accepted_initial_count:number;
  transport_departed_at?:string; transport_arrived_at?:string; transport_duration_hours?:number; vehicle_plate:string; driver_name:string; driver_phone:string;
  vehicle_disinfected:boolean; sample_weights_g:number[]; average_arrival_weight_g:number; photo_refs:string[]; documents:string[];
  received_by:string; verified_by_vet?:string;
}

export interface DailyFarmReportV197 {
  id:string; report_number:string; farm_id:string; farm_name:string; flock_id:string; flock_code:string; house_id:string;
  report_date:string; age_days:number; shift:DailyReportShiftV197; entered_by:string; entered_by_role:PlatformRoleV195;
  opening_birds:number; mortality:number; mortality_morning:number; mortality_evening:number; culls:number; closing_birds:number;
  feed_opening_kg:number; feed_received_kg:number; feed_used_kg:number; feed_closing_kg:number; water_liters:number;
  temperature_min_c:number; temperature_max_c:number; temperature_points_c:number[]; humidity_min_pct:number; humidity_max_pct:number;
  weight_condition:'fasted'|'fed'|'not_measured'; weight_time?:string; sample_weights_g:number[]; sampling_locations:string[];
  avg_weight_g?:number; min_weight_g?:number; max_weight_g?:number; median_weight_g?:number; cv_percent?:number; uniformity_percent?:number;
  expected_weight_g?:number; weight_variance_percent?:number; daily_gain_g?:number; cumulative_feed_kg?:number; estimated_fcr?:number;
  medication_entries:Array<{name:string;active_ingredient?:string;quantity:number;unit:string;route?:string;vet_order_id?:string;photo_ref?:string}>;
  vaccination_entries:Array<{name:string;quantity:number;unit:string;batch?:string;cold_chain_ok:boolean;vet_order_id?:string}>;
  litter_condition:string; equipment_issues:string[]; respiratory_sound_observed:boolean; abnormal_droppings_observed:boolean;
  media_refs:string[]; notes?:string; mandatory_fields_complete:boolean; submitted_at:string; vet_review_status:'pending'|'reviewed'|'action_required';
}

export interface FarmOperatingProtocolV197 {
  id:string; protocol_number:string; farm_id:string; flock_id:string; version:number; effective_from:string; created_by_vet:string;
  reason_for_version:string; feed_plan:Array<{age_from:number;age_to:number;feed_type:string;target_g_per_bird?:number}>;
  temperature_plan:Array<{age_from:number;age_to:number;target_c:number;tolerance_c:number}>;
  humidity_target_pct:{min:number;max:number}; weighing_rule:{frequency:'daily'|'scheduled';time:string;condition:'fasted'|'fed';min_sample_count:number};
  vaccination_plan:Array<{age_day:number;name:string;method:string;notes?:string}>;
  biosecurity_rules:string[]; status:'draft'|'active'|'superseded'; approved_at?:string;
}

export interface VeterinaryDecisionV197 {
  id:string; decision_number:string; farm_id:string; flock_id:string; date:string; source_report_ids:string[];
  ai_summary:string; ai_risk_level:'low'|'medium'|'high'|'critical'; ai_confidence?:number; ai_flags:string[];
  proposed_feed_kg?:number; proposed_temperature_c?:number; proposed_sampling_count?:number; proposed_actions:string[];
  medical_proposal?:string; requires_vet_approval:boolean; vet_decision:'pending'|'approved'|'modified'|'rejected'; vet_name?:string; vet_note?:string; approved_at?:string;
}

export interface DailyFarmPlanV197 {
  id:string; plan_number:string; farm_id:string; flock_id:string; plan_date:string; generated_from_report_id?:string; protocol_version:number;
  target_feed_kg:number; feed_schedule:string[]; target_temperature_c:number; target_humidity_pct:{min:number;max:number};
  water_target_liters?:number; sampling_count:number; sampling_time:string; medication_tasks:string[]; vaccination_tasks:string[];
  cleaning_tasks:string[]; maintenance_tasks:string[]; farm_requirements:string[]; approved_by_vet?:string; approved_at?:string;
  status:'draft'|'vet_review'|'approved'|'in_execution'|'completed';
}

export interface FarmTaskV197 {
  id:string; task_number:string; farm_id:string; flock_id:string; plan_id?:string; title:string; instructions:string; assigned_to:string;
  due_at:string; evidence_required:boolean; evidence_refs:string[]; status:FarmTaskStatusV197; completed_at?:string; completion_note?:string;
}

export interface FarmRequirementV197 {
  id:string; requirement_number:string; farm_id:string; flock_id:string; requested_by:string; requested_by_role:string; requested_at:string;
  category:'feed'|'medicine'|'vaccine'|'equipment'|'disinfectant'|'litter'|'fuel'|'lab'|'transport'|'service'|'other'; item_name:string; reason:string;
  quantity:number; unit:string; urgency:UrgencyV197; expected_need_at:string; estimated_cost?:number; currency?:CurrencyV195;
  owner_approval_required:boolean; owner_decision:ApprovalDecisionV197; owner_decision_note?:string; owner_decided_at?:string;
  finance_status:'not_required'|'pending'|'approved'|'rejected'; procurement_status:'not_started'|'availability_check'|'po_issued'|'in_transit'|'received'|'closed';
  related_market_request_id?:string;
}

export interface FarmPurchaseOrderV197 {
  id:string; po_number:string; farm_id:string; flock_id:string; requirement_id:string; supplier_company_id?:string; supplier_name:string;
  branch_id?:string; branch_name?:string; item_name:string; quantity:number; unit:string; unit_price:number; currency:CurrencyV195;
  goods_amount:number; transport_cost:number; platform_fee:number; total_amount:number; payment_mode:'cash'|'credit'|'transfer'; due_date?:string;
  reason:string; issued_at:string; issued_by_finance:string; status:'issued'|'supplier_confirmed'|'in_transit'|'partially_received'|'received'|'cancelled';
  supplier_confirmation_at?:string; estimated_arrival_at?:string; source_offer_id?:string; source_market_request_id?:string;
}

export interface GoodsReceiptV197 {
  id:string; receipt_number:string; farm_id:string; flock_id:string; requirement_id:string; po_number?:string; supplier_name:string; branch_name?:string;
  item_name:string; ordered_quantity:number; received_quantity:number; unit:string; variance:number; received_at:string; received_by:string;
  batch_lot?:string; expiry_date?:string; cold_chain_required:boolean; temperature_c?:number; cold_chain_ok?:boolean; package_condition:'good'|'damaged'|'partial';
  photo_refs:string[]; invoice_number?:string; three_way_match:'pending'|'matched'|'variance'; finance_reviewed_by?:string;
}

export interface FarmCostEntryV197 {
  id:string; entry_number:string; farm_id:string; flock_id:string; date:string; category:'chicks'|'feed'|'medicine'|'vaccine'|'labor'|'vet'|'transport'|'litter'|'equipment'|'electricity'|'fuel'|'lab'|'marketing'|'platform_fee'|'other';
  description:string; amount:number; currency:CurrencyV195; exchange_rate_to_sar:number; amount_sar:number; debit_credit:'debit'|'credit';
  party_name:string; source_document?:string; approved_by_finance?:string; payment_status:'pending'|'paid'|'credit'|'settled'; due_date?:string;
}

export interface FarmChatGroupV197 {
  id:string; category:ChatGroupCategoryV197; title:string; farm_id?:string; flock_id?:string; owner_user_id:string; moderator_user_ids:string[];
  member_user_ids:string[]; posting_policy:'all'|'moderators_and_owner'|'structured_farmer'; status:'active'|'muted'|'archived'; created_at:string;
}

export interface FarmChatMessageV197 {
  id:string; group_id:string; sent_at:string; sender_id:string; sender_name:string; sender_role:string; type:'text'|'voice'|'image'|'video'|'file'|'system'|'action_card';
  text:string; media_refs:string[]; transcript?:string; extracted_data:Record<string,number|string|boolean>;
  linked_entity_type?:string; linked_entity_id?:string; requires_confirmation:boolean; confirmed_by?:string;
  action_card?:{kind:'purchase_approval'|'treatment_approval'|'invoice'|'executive_approval'|'data_confirmation';title:string;status:'pending'|'approved'|'rejected'|'completed';actions:string[]};
  delivery_status?:'sent'|'delivered'|'read'; read_by?:string[];
}

export interface MarketingReadinessV197 {
  id:string; farm_id:string; flock_id:string; generated_at:string; current_birds:number; current_avg_weight_kg:number; projected_sale_weight_kg:number;
  projected_sale_birds:number; market_reference_price_per_kg:number; currency:CurrencyV195; extra_day_feed_cost:number; break_even_price_per_kg:number;
  recommendation_summary:string; owner_decision:ApprovalDecisionV197;
}

export interface PoultrySaleV197 {
  id:string; sale_number:string; farm_id:string; flock_id:string; buyer_name:string; buyer_phone:string; marketing_office:string; marketing_contact:string;
  governorate:string; district:string; address:string; birds_planned:number; avg_weight_kg:number; price_per_kg:number; currency:CurrencyV195;
  gross_expected:number; office_fee:number; platform_fee:number; transport_fee:number; net_expected:number; owner_decision:ApprovalDecisionV197;
  vehicle_plate?:string; driver_name?:string; driver_phone?:string; vehicle_disinfected?:boolean; loaded_birds?:number; loading_weight_kg?:number; departed_at?:string;
  delivered_birds?:number; transport_mortality?:number; arrived_at?:string; pod_reference?:string; receiver_name?:string; payment_due_at?:string;
  status:SaleStatusV197;
}

export interface CycleSettlementV197 {
  id:string; settlement_number:string; farm_id:string; flock_id:string; generated_at:string; initial_birds:number; farm_mortality:number; culls:number;
  transport_mortality:number; sold_birds:number; remaining_birds:number; gross_sales_sar:number; marketing_fees_sar:number; transport_fees_sar:number;
  platform_fees_sar:number; operating_costs_sar:number; outstanding_debt_sar:number; net_due_owner_sar:number; status:'draft'|'finance_review'|'owner_review'|'approved'|'paid';
}

export interface CyclePerformanceV197 {
  id:string; farm_id:string; flock_id:string; closed_at?:string; age_at_sale_days?:number; final_weight_kg?:number; fcr?:number; mortality_percent:number;
  uniformity_percent?:number; total_feed_kg:number; feed_cost_sar:number; medical_cost_sar:number; total_cost_sar:number; revenue_sar:number;
  profit_loss_sar:number; cost_per_bird_sar?:number; cost_per_kg_sar?:number; worker_score?:number; vet_score?:number; biosecurity_score?:number; compliance_score?:number;
  loss_drivers:string[]; recommendations:string[];
}

export interface ComplianceEventV197 {
  id:string; at:string; farm_id:string; flock_id?:string; actor_type:'owner'|'worker'|'vet'|'finance'|'supplier'|'system'; actor_name:string;
  category:'data_completion'|'medical'|'biosecurity'|'finance'|'procurement'|'attendance'|'owner_refusal'; severity:'info'|'warning'|'critical';
  score_delta:number; description:string; evidence_ref?:string;
}

export interface FarmTimelineEventV197 {
  id:string; at:string; farm_id:string; flock_id?:string; actor:string; actor_role:string; action:string; why?:string; approval?:string; cost?:number; currency?:CurrencyV195;
  evidence_refs:string[]; entity_type:string; entity_id:string;
}

export interface ExceptionSignalV197 {
  id:string; detected_at:string; farm_id?:string; flock_id?:string; category:'mortality'|'weight'|'feed'|'water'|'temperature'|'biosecurity'|'finance'|'procurement'|'data_quality'|'cold_chain'|'sales';
  severity:'warning'|'critical'; title:string; detail:string; owner_role:string; status:'open'|'acknowledged'|'resolved';
}

export interface ManagedOperationsStateV197 {
  version:'19.7'; migrated_from:string; service_packages:ServicePackageV197[]; customers:CustomerProfileV197[];
  availability_offers:SupplierAvailabilityOfferV197[]; availability_attestations:AvailabilityAttestationV197[]; marketplace_requests:MarketplaceAvailabilityRequestV197[]; marketplace_emergency_cases:MarketplaceEmergencyCaseV197[];
  managed_contracts:ManagedFarmContractV197[]; farms:ManagedFarmV197[]; houses:FarmHouseV197[]; flock_cycles:Array<{
    id:string; flock_code:string; farm_id:string; house_id:string; breed:string; hatchery_name:string; placement_date?:string; initial_count:number; current_count:number; age_days:number; status:FlockCycleStatusV197; target_market_weight_kg:number; cumulative_feed_kg:number; cumulative_mortality:number;
  }>;
  pre_placement:PrePlacementChecklistV197[]; placements:PlacementReceiptV197[]; daily_reports:DailyFarmReportV197[]; protocols:FarmOperatingProtocolV197[];
  veterinary_decisions:VeterinaryDecisionV197[]; daily_plans:DailyFarmPlanV197[]; farm_tasks:FarmTaskV197[]; requirements:FarmRequirementV197[]; purchase_orders:FarmPurchaseOrderV197[]; goods_receipts:GoodsReceiptV197[];
  cost_entries:FarmCostEntryV197[]; chat_groups:FarmChatGroupV197[]; chat_messages:FarmChatMessageV197[]; marketing_readiness:MarketingReadinessV197[];
  poultry_sales:PoultrySaleV197[]; settlements:CycleSettlementV197[]; cycle_performance:CyclePerformanceV197[]; compliance_events:ComplianceEventV197[];
  timeline:FarmTimelineEventV197[]; exceptions:ExceptionSignalV197[];
  settings:{
    marketplace_supplier_response_minutes:number; marketplace_urgent_response_minutes:number; attestation_hour:number; auto_mark_unconfirmed_hours:number;
    require_vet_gate_for_medicine:boolean; require_vet_gate_for_vaccine:boolean; require_owner_approval_for_cost:boolean; enforce_daily_close:boolean;
    enforce_three_way_match:boolean; platform_brand_name:string; platform_brand_name_en:string; allow_guest_checkout:boolean; ai_final_medical_decision:false;
  };
}

const nowIso=()=>new Date().toISOString();
const id=(p:string)=>`${p}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
const serial=(p:string)=>`${p}-YE-${new Date().getFullYear()}-${String(Date.now()).slice(-7)}`;
const inHours=(hours:number)=>new Date(Date.now()+hours*3600000).toISOString();
const moneyToSar=(amount:number,currency:CurrencyV195, core:PlatformCoreStateV195)=>currency==='SAR'?amount:currency==='YER_OLD'?amount/Math.max(1,core.settings.sar_to_yer_old):amount/Math.max(1,core.settings.sar_to_yer_new);

export function buildManagedPoultryOperationsV197(core:PlatformCoreStateV195, enterprise:EnterpriseCoreStateV196, existing?:Partial<ManagedOperationsStateV197>):ManagedOperationsStateV197 {
  const offers:SupplierAvailabilityOfferV197[] = core.catalog.filter(c=>c.status==='active').flatMap(item=>{
    const branches=core.supplier_branches.filter(b=>b.supplier_id===item.supplier_id && b.status==='active');
    return branches.map((b,idx)=>({
      id:`offer-${item.id}-${b.id}`,offer_number:`OFR-${item.sku}-${idx+1}`,company_id:item.supplier_id,company_name:item.supplier_name,branch_id:b.id,branch_name:b.name,
      governorate:b.governorate,district:b.district,product_id:item.id,product_name:item.name,category:item.category,scientific_name:item.scientific_name,
      unit:item.unit,cold_chain_required:item.cold_chain_required,status:'unconfirmed' as const,quantity_disclosure:'hidden' as const,quantity_band:undefined,
      prices:item.prices.filter(p=>p.active).map(p=>({currency:p.currency,amount:p.amount,active:true})),next_attestation_due_at:inHours(12),response_sla_minutes:10,active:true
    }));
  });
  const packages:ServicePackageV197[]=[
    {id:'pkg-market',code:'MARKETPLACE',name:'السوق فقط',journey:'marketplace',description:'شراء وطلب وتوصيل بدون إدارة مزرعة.',billing_mode:'transaction_commission',active:true,includes:['التصفح','التحقق من التوفر','التوصيل','الدفع','POD']},
    {id:'pkg-vet',code:'VET-SUPPORT',name:'الدعم البيطري',journey:'managed_farm',description:'متابعة بيطرية وحالات دون إدارة تشغيلية كاملة.',billing_mode:'hybrid',active:true,includes:['طبيب مسؤول','حالات','مختبر','دردشة بيطرية']},
    {id:'pkg-farm',code:'FARM-MGMT',name:'إدارة المزرعة',journey:'managed_farm',description:'إدارة دورة القطيع من التجهيز حتى البيع.',billing_mode:'per_cycle',active:true,includes:['عامل منصة','طبيب','تشغيل يومي','مالية','مشتريات','تسويق','تسوية']},
    {id:'pkg-enterprise',code:'ENTERPRISE-FARM',name:'إدارة مؤسسية',journey:'managed_farm',description:'إدارة متعددة المزارع والقطعان مع رقابة تنفيذية.',billing_mode:'monthly',active:true,includes:['كل خدمات إدارة المزرعة','Executive Control','SLA','تقارير مجمعة']}
  ];
  const ownerUser=core.users.find(u=>u.role==='system_owner'||u.role==='ceo') || core.users[0];
  const vetUsers=core.users.filter(u=>['vet_consultant','vet_supervisor','field_vet'].includes(u.role));
  const financeUsers=core.users.filter(u=>u.role==='finance');
  const globalGroups:FarmChatGroupV197[]=[
    {id:'chat-vet-board-v197',category:'veterinary_board',title:'المجلس البيطري والاستشاري',owner_user_id:ownerUser?.id||'system',moderator_user_ids:vetUsers.slice(0,3).map(u=>u.id),member_user_ids:vetUsers.map(u=>u.id),posting_policy:'all',status:'active',created_at:nowIso()},
    {id:'chat-executive-v197',category:'executive_control',title:'غرفة القيادة التنفيذية',owner_user_id:ownerUser?.id||'system',moderator_user_ids:[ownerUser?.id||'system'],member_user_ids:[ownerUser?.id||'system',...financeUsers.map(u=>u.id),...core.users.filter(u=>u.role==='sector_manager').map(u=>u.id)],posting_policy:'moderators_and_owner',status:'active',created_at:nowIso()}
  ];
  const base:ManagedOperationsStateV197={
    version:'19.7',migrated_from:'19.6',service_packages:packages,customers:[],availability_offers:offers,availability_attestations:[],marketplace_requests:[],marketplace_emergency_cases:[],
    managed_contracts:[],farms:[],houses:[],flock_cycles:[],pre_placement:[],placements:[],daily_reports:[],protocols:[],veterinary_decisions:[],daily_plans:[],farm_tasks:[],requirements:[],purchase_orders:[],goods_receipts:[],cost_entries:[],chat_groups:globalGroups,chat_messages:[],marketing_readiness:[],poultry_sales:[],settlements:[],cycle_performance:[],compliance_events:[],timeline:[],exceptions:[],
    settings:{marketplace_supplier_response_minutes:10,marketplace_urgent_response_minutes:4,attestation_hour:20,auto_mark_unconfirmed_hours:24,require_vet_gate_for_medicine:true,require_vet_gate_for_vaccine:true,require_owner_approval_for_cost:true,enforce_daily_close:true,enforce_three_way_match:true,platform_brand_name:'أفي نيكسس لإدارة الدواجن',platform_brand_name_en:'AviNexus Poultry Enterprise',allow_guest_checkout:true,ai_final_medical_decision:false}
  };
  if(!existing) return base;
  return {
    ...base,...existing,version:'19.7',migrated_from:existing.migrated_from||'19.6',
    service_packages:existing.service_packages?.length?existing.service_packages:packages,
    availability_offers:existing.availability_offers?.length?existing.availability_offers:offers,
    settings:{...base.settings,...(existing.settings||{}),ai_final_medical_decision:false},
    customers:existing.customers||[],availability_attestations:existing.availability_attestations||[],marketplace_requests:existing.marketplace_requests||[],marketplace_emergency_cases:existing.marketplace_emergency_cases||[],managed_contracts:existing.managed_contracts||[],farms:existing.farms||[],houses:existing.houses||[],flock_cycles:existing.flock_cycles||[],pre_placement:existing.pre_placement||[],placements:existing.placements||[],daily_reports:existing.daily_reports||[],protocols:existing.protocols||[],veterinary_decisions:existing.veterinary_decisions||[],daily_plans:existing.daily_plans||[],farm_tasks:existing.farm_tasks||[],requirements:existing.requirements||[],purchase_orders:existing.purchase_orders||[],goods_receipts:existing.goods_receipts||[],cost_entries:existing.cost_entries||[],chat_groups:[...globalGroups.filter(g=>!(existing.chat_groups||[]).some(x=>x.id===g.id)),...(existing.chat_groups||[])],chat_messages:existing.chat_messages||[],marketing_readiness:existing.marketing_readiness||[],poultry_sales:existing.poultry_sales||[],settlements:existing.settlements||[],cycle_performance:existing.cycle_performance||[],compliance_events:existing.compliance_events||[],timeline:existing.timeline||[],exceptions:existing.exceptions||[]
  };
}

export function createMarketplaceRequestV197(state:ManagedOperationsStateV197,input:Omit<MarketplaceAvailabilityRequestV197,'id'|'request_number'|'created_at'|'route_attempts'|'alternative_offer_ids'|'vet_gate_required'|'status'>):ManagedOperationsStateV197{
  const offer=state.availability_offers.find(o=>o.product_id===input.product_id&&o.active);
  const vetGate=input.category==='medicine'?state.settings.require_vet_gate_for_medicine:input.category==='vaccine'?state.settings.require_vet_gate_for_vaccine:false;
  const req:MarketplaceAvailabilityRequestV197={...input,id:id('MKT'),request_number:serial('MKT'),created_at:nowIso(),route_attempts:[],alternative_offer_ids:[],vet_gate_required:vetGate,status:'checking'};
  return routeMarketplaceRequestV197({...state,marketplace_requests:[req,...state.marketplace_requests]},req.id,offer?.id);
}

export function routeMarketplaceRequestV197(state:ManagedOperationsStateV197,requestId:string,preferredOfferId?:string):ManagedOperationsStateV197{
  const req=state.marketplace_requests.find(r=>r.id===requestId); if(!req)return state;
  const attempted=new Set(req.route_attempts.map(a=>a.branch_id));
  const candidates=state.availability_offers.filter(o=>o.product_id===req.product_id&&o.active&&o.status!=='unavailable'&&o.status!=='paused'&&!attempted.has(o.branch_id));
  candidates.sort((a,b)=>{
    if(preferredOfferId){if(a.id===preferredOfferId)return -1;if(b.id===preferredOfferId)return 1;}
    const ag=a.governorate===req.governorate?0:1,bg=b.governorate===req.governorate?0:1;
    const ad=a.district===req.district?0:1,bd=b.district===req.district?0:1;
    const confirmedA=a.last_confirmed_at?0:1,confirmedB=b.last_confirmed_at?0:1;
    return ag-bg||ad-bd||confirmedA-confirmedB||a.branch_name.localeCompare(b.branch_name,'ar');
  });
  const target=candidates[0];
  if(!target){
    const alternatives=findAlternativeOffersV197(state,req.product_id,req.governorate);
    const status:MarketplaceRequestStatusV197=(req.urgency==='critical'&&(req.category==='medicine'||req.category==='vaccine'))?'escalated_to_vet':'needs_alternative';
    return {...state,marketplace_requests:state.marketplace_requests.map(r=>r.id===requestId?{...r,alternative_offer_ids:alternatives.map(a=>a.id),status}:r)};
  }
  const sla=req.urgency==='normal'?state.settings.marketplace_supplier_response_minutes:state.settings.marketplace_urgent_response_minutes;
  const attempt={branch_id:target.branch_id,branch_name:target.branch_name,sent_at:nowIso(),status:'waiting' as const,note:`مهلة الرد ${sla} دقائق`};
  return {...state,marketplace_requests:state.marketplace_requests.map(r=>r.id===requestId?{...r,route_attempts:[...r.route_attempts,attempt],selected_offer_id:target.id,selected_branch_id:target.branch_id,selected_branch_name:target.branch_name,status:'checking'}:r)};
}

export function supplierRespondMarketplaceV197(state:ManagedOperationsStateV197,requestId:string,input:{confirmed:boolean;availability?:AvailabilityStateV197;quantity_band?:'sufficient'|'limited'|'very_limited';price?:number;currency?:CurrencyV195;eta_hours?:number;transport_cost?:number;platform_commission?:number;note?:string}):ManagedOperationsStateV197{
  const req=state.marketplace_requests.find(r=>r.id===requestId); if(!req)return state;
  const offer=state.availability_offers.find(o=>o.id===req.selected_offer_id);
  const attempts=req.route_attempts.map((a,i)=>i===req.route_attempts.length-1?{...a,status:input.confirmed?'confirmed' as const:'declined' as const,available_quantity_band:input.quantity_band,eta_hours:input.eta_hours,note:input.note}:a);
  let nextReq:MarketplaceAvailabilityRequestV197={...req,route_attempts:attempts};
  let offers=state.availability_offers;
  if(offer){offers=offers.map(o=>o.id===offer.id?{...o,status:input.availability||(input.confirmed?'available':'unavailable'),quantity_band:input.quantity_band,last_confirmed_at:nowIso(),confirmed_by:'Supplier Branch'}:o);}
  if(input.confirmed){
    const price=input.price??offer?.prices.find(p=>p.active)?.amount??0; const currency=input.currency??offer?.prices.find(p=>p.active)?.currency??'SAR'; const tr=input.transport_cost||0, comm=input.platform_commission||0;
    nextReq={...nextReq,confirmed_price:price,confirmed_currency:currency,transport_cost:tr,platform_commission:comm,total_customer_price:price*req.requested_quantity+tr+comm,estimated_arrival_at:input.eta_hours?inHours(input.eta_hours):undefined,status:req.vet_gate_required?'supplier_confirmed':'supplier_confirmed'};
    return {...state,availability_offers:offers,marketplace_requests:state.marketplace_requests.map(r=>r.id===requestId?nextReq:r)};
  }
  const routed=routeMarketplaceRequestV197({...state,availability_offers:offers,marketplace_requests:state.marketplace_requests.map(r=>r.id===requestId?nextReq:r)},requestId);
  return routed;
}

export function customerConfirmMarketplaceRequestV197(state:ManagedOperationsStateV197,requestId:string):ManagedOperationsStateV197{
  const req=state.marketplace_requests.find(r=>r.id===requestId); if(!req) return state;
  if(req.status!=='supplier_confirmed') throw new Error('يجب تأكيد المورد أولًا.');
  if(req.vet_gate_required&&!req.vet_approved) throw new Error('اعتماد الطبيب مطلوب قبل تأكيد طلب علاجي/لقاح.');
  return {...state,marketplace_requests:state.marketplace_requests.map(r=>r.id===requestId?{...r,status:'customer_confirmed'}:r)};
}

export function recordMarketplacePaymentV197(state:ManagedOperationsStateV197,requestId:string,paid:boolean):ManagedOperationsStateV197{
  const req=state.marketplace_requests.find(r=>r.id===requestId); if(!req) return state;
  if(!['customer_confirmed','payment_pending'].includes(req.status)) throw new Error('يجب تأكيد العميل قبل الدفع.');
  return {...state,marketplace_requests:state.marketplace_requests.map(r=>r.id===requestId?{...r,status:paid?'paid':'payment_pending'}:r)};
}

export function dispatchMarketplaceOrderV197(state:ManagedOperationsStateV197,requestId:string):ManagedOperationsStateV197{
  const req=state.marketplace_requests.find(r=>r.id===requestId); if(!req) return state;
  if(!['paid','customer_confirmed','preparing'].includes(req.status)) throw new Error('الطلب غير جاهز للتجهيز/الشحن.');
  return {...state,marketplace_requests:state.marketplace_requests.map(r=>r.id===requestId?{...r,status:'out_for_delivery'}:r)};
}

export function completeMarketplaceDeliveryV197(state:ManagedOperationsStateV197,requestId:string,podReference:string):ManagedOperationsStateV197{
  const req=state.marketplace_requests.find(r=>r.id===requestId); if(!req) return state;
  if(req.status!=='out_for_delivery') throw new Error('يجب تسجيل الشحن قبل POD.');
  return {...state,marketplace_requests:state.marketplace_requests.map(r=>r.id===requestId?{...r,status:'delivered',notes:[r.notes,`POD: ${podReference}`].filter(Boolean).join(' • ')}:r)};
}

export function escalateMarketplaceToOnCallVetV197(state:ManagedOperationsStateV197,requestId:string,vet?:{id:string;name:string}):ManagedOperationsStateV197{
  const req=state.marketplace_requests.find(r=>r.id===requestId); if(!req) return state;
  const existing=state.marketplace_emergency_cases.find(c=>c.request_id===requestId&&c.status!=='closed'); if(existing) return state;
  const c:MarketplaceEmergencyCaseV197={id:id('EMV'),case_number:serial('EMV'),request_id:req.id,created_at:nowIso(),customer_name:req.customer_name,phone:req.phone,governorate:req.governorate,district:req.district,address:req.address,product_name:req.product_name,urgency:req.urgency,max_wait_hours:req.max_wait_hours,farm_context:req.farm_context,attempted_branches:req.route_attempts.map(a=>a.branch_name),alternative_offer_ids:req.alternative_offer_ids,assigned_vet_id:vet?.id,assigned_vet_name:vet?.name,status:vet?'assigned':'open'};
  return {...state,marketplace_emergency_cases:[c,...state.marketplace_emergency_cases],marketplace_requests:state.marketplace_requests.map(r=>r.id===requestId?{...r,status:'escalated_to_vet'}:r)};
}

export function findAlternativeOffersV197(state:ManagedOperationsStateV197,productId:string,governorate?:string):SupplierAvailabilityOfferV197[]{
  const source=state.availability_offers.find(o=>o.product_id===productId); if(!source)return[];
  return state.availability_offers.filter(o=>o.product_id!==productId&&o.active&&o.status!=='unavailable'&&o.status!=='paused'&&o.category===source.category&&(
    Boolean(source.scientific_name&&o.scientific_name&&source.scientific_name.trim().toLowerCase()===o.scientific_name.trim().toLowerCase())||source.category==='equipment'||source.category==='feed'||source.category==='feed_additive'||source.category==='disinfectant'
  )).sort((a,b)=>(a.governorate===governorate?0:1)-(b.governorate===governorate?0:1));
}

export function buildDailyAvailabilityAttestationsV197(state:ManagedOperationsStateV197):ManagedOperationsStateV197{
  const date=new Date().toISOString().slice(0,10); const branches=[...new Set(state.availability_offers.filter(o=>o.active).map(o=>o.branch_id))];
  const existing=new Set(state.availability_attestations.filter(a=>a.date===date).map(a=>a.branch_id));
  const added=branches.filter(b=>!existing.has(b)).map(branchId=>{
    const branchOffers=state.availability_offers.filter(o=>o.branch_id===branchId&&o.active); const branchName=branchOffers[0]?.branch_name||branchId;
    const requested=nowIso(); const due=new Date(); due.setHours(state.settings.attestation_hour,30,0,0); if(due.getTime()<Date.now()) due.setDate(due.getDate()+1);
    return {id:id('ATT'),attestation_number:serial('ATT'),branch_id:branchId,branch_name:branchName,date,requested_at:requested,due_at:due.toISOString(),status:'pending' as const,items:branchOffers.map(o=>({offer_id:o.id,product_name:o.product_name,previous_status:o.status,status:o.status,quantity_band:o.quantity_band,price_changed:false}))};
  });
  return {...state,availability_attestations:[...added,...state.availability_attestations]};
}

export function submitAvailabilityAttestationV197(state:ManagedOperationsStateV197,attestationId:string,items:AvailabilityAttestationV197['items'],actor:string):ManagedOperationsStateV197{
  const a=state.availability_attestations.find(x=>x.id===attestationId);if(!a)return state; const at=nowIso();
  const offers=state.availability_offers.map(o=>{const row=items.find(i=>i.offer_id===o.id);return row?{...o,status:row.status,quantity_band:row.quantity_band,last_confirmed_at:at,confirmed_by:actor,next_attestation_due_at:inHours(24)}:o});
  return {...state,availability_offers:offers,availability_attestations:state.availability_attestations.map(x=>x.id===attestationId?{...x,items,status:'responded',responded_at:at,responded_by:actor}:x)};
}

export function markStaleOffersV197(state:ManagedOperationsStateV197,now=Date.now()):ManagedOperationsStateV197{
  const max=state.settings.auto_mark_unconfirmed_hours*3600000;
  return {...state,availability_offers:state.availability_offers.map(o=>o.last_confirmed_at&&now-new Date(o.last_confirmed_at).getTime()>max&&o.status==='available'?{...o,status:'unconfirmed'}:o)};
}

export function createManagedContractV197(state:ManagedOperationsStateV197,input:{customer:Omit<CustomerProfileV197,'id'|'customer_code'|'journey'|'status'|'service_package_id'|'farm_ids'|'created_at'|'updated_at'>;farm_name:string;farm_code?:string;house:{name:string;length_m:number;width_m:number;capacity_birds:number};assigned_vet_id:string;assigned_vet_name:string;assigned_workers:Array<{id:string;name:string}>;finance_officer_id:string;finance_officer_name:string;office_id?:string;office_name:string;start_date:string;end_date:string;currency:CurrencyV195;management_fee:number;platform_commission_percent:number;payment_terms:string}):ManagedOperationsStateV197{
  const at=nowIso(); const customerId=id('CUS'); const farmId=id('FARM'); const houseId=id('HOUSE'); const contractId=id('CTR');
  const customer:CustomerProfileV197={...input.customer,id:customerId,customer_code:serial('CUS'),journey:'managed_farm',status:'active',service_package_id:'pkg-farm',farm_ids:[farmId],created_at:at,updated_at:at};
  const farm:ManagedFarmV197={id:farmId,farm_code:input.farm_code||serial('FARM'),customer_id:customerId,customer_name:customer.full_name,name:input.farm_name,governorate:customer.governorate,district:customer.district,address:customer.address,gps:customer.gps,generator_available:false,biosecurity_score:50,compliance_score:100,status:'onboarding',house_ids:[houseId],active_flock_ids:[]};
  const house:FarmHouseV197={id:houseId,farm_id:farmId,code:'H-01',name:input.house.name,length_m:input.house.length_m,width_m:input.house.width_m,area_m2:input.house.length_m*input.house.width_m,capacity_birds:input.house.capacity_birds,feeder_count:0,drinker_count:0,heater_count:0,fan_count:0,ventilation_type:'يستكمل بواسطة الطبيب',litter_type:'wood_shavings',maintenance_status:'needs_attention',photo_refs:[]};
  const contract:ManagedFarmContractV197={id:contractId,contract_number:serial('MFC'),customer_id:customerId,customer_name:customer.full_name,farm_id:farmId,farm_name:farm.name,service_package_id:'pkg-farm',start_date:input.start_date,end_date:input.end_date,currency:input.currency,management_fee:input.management_fee,platform_commission_percent:input.platform_commission_percent,payment_terms:input.payment_terms,owner_approval_threshold:0,assigned_vet_id:input.assigned_vet_id,assigned_vet_name:input.assigned_vet_name,assigned_worker_ids:input.assigned_workers.map(w=>w.id),assigned_worker_names:input.assigned_workers.map(w=>w.name),finance_officer_id:input.finance_officer_id,finance_officer_name:input.finance_officer_name,office_id:input.office_id,office_name:input.office_name,status:'active',owner_signed:true,platform_signed:true,created_at:at,updated_at:at};
  const groups:FarmChatGroupV197[]=[
    {id:id('CHAT'),category:'farm_operations',title:`تشغيل ${farm.name}`,farm_id:farmId,owner_user_id:customerId,moderator_user_ids:[input.assigned_vet_id],member_user_ids:[customerId,input.assigned_vet_id,...input.assigned_workers.map(w=>w.id)],posting_policy:'structured_farmer',status:'active',created_at:at},
    {id:id('CHAT'),category:'finance_procurement',title:`مالية ومشتريات ${farm.name}`,farm_id:farmId,owner_user_id:input.finance_officer_id,moderator_user_ids:[input.finance_officer_id],member_user_ids:[input.finance_officer_id,input.assigned_vet_id,customerId],posting_policy:'moderators_and_owner',status:'active',created_at:at}
  ];
  const timeline:FarmTimelineEventV197={id:id('TL'),at, farm_id:farmId,actor:'النظام',actor_role:'system',action:'تفعيل عقد إدارة مزرعة',why:'عقد إدارة قطيع معتمد',approval:`${customer.full_name} + المنصة`,cost:input.management_fee,currency:input.currency,evidence_refs:[contract.contract_number],entity_type:'managed_contract',entity_id:contractId};
  return {...state,customers:[customer,...state.customers],farms:[farm,...state.farms],houses:[house,...state.houses],managed_contracts:[contract,...state.managed_contracts],chat_groups:[...groups,...state.chat_groups],timeline:[timeline,...state.timeline]};
}

export function createFlockCycleV197(state:ManagedOperationsStateV197,input:{farm_id:string;house_id:string;breed:string;hatchery_name:string;target_market_weight_kg:number;target_placement_at:string;created_by:string}):ManagedOperationsStateV197{
  const farm=state.farms.find(f=>f.id===input.farm_id);if(!farm)throw new Error('المزرعة غير موجودة'); const flockId=id('FLK'); const code=serial('FLK');
  const flock={id:flockId,flock_code:code,farm_id:input.farm_id,house_id:input.house_id,breed:input.breed,hatchery_name:input.hatchery_name,initial_count:0,current_count:0,age_days:0,status:'preparation' as const,target_market_weight_kg:input.target_market_weight_kg,cumulative_feed_kg:0,cumulative_mortality:0};
  const checklist:PrePlacementChecklistV197={id:id('PRE'),flock_id:flockId,farm_id:input.farm_id,house_id:input.house_id,created_at:nowIso(),target_placement_at:input.target_placement_at,cleaning_completed:false,washing_completed:false,disinfectant_name:'',disinfectant_concentration:'',disinfectant_quantity:0,disinfectant_unit:'لتر',drying_hours:0,dark_rest_hours:0,preheat_target_c:32,water_ready:false,feed_ready:false,electricity_ready:false,generator_ready:false,equipment_ready:false,litter_ready:false,photo_refs:[],status:'not_ready'};
  const farms=state.farms.map(f=>f.id===farm.id?{...f,active_flock_ids:[...f.active_flock_ids,flockId]}:f);
  return {...state,farms,flock_cycles:[flock,...state.flock_cycles],pre_placement:[checklist,...state.pre_placement],timeline:[{id:id('TL'),at:nowIso(),farm_id:farm.id,flock_id:flockId,actor:input.created_by,actor_role:'management',action:'إنشاء دورة قطيع',why:'بدء التجهيز قبل الاستقبال',evidence_refs:[],entity_type:'flock_cycle',entity_id:flockId},...state.timeline]};
}

export function approvePrePlacementV197(state:ManagedOperationsStateV197,checklistId:string,vetName:string,correctionNotes=''):ManagedOperationsStateV197{
  const item=state.pre_placement.find(x=>x.id===checklistId);if(!item)return state;
  const allReady=item.cleaning_completed&&item.washing_completed&&Boolean(item.disinfectant_name)&&item.water_ready&&item.feed_ready&&item.electricity_ready&&item.equipment_ready&&item.litter_ready&&item.photo_refs.length>0;
  const status=allReady?'ready_for_placement' as const:'needs_correction' as const; const at=nowIso();
  return {...state,pre_placement:state.pre_placement.map(x=>x.id===checklistId?{...x,status,vet_reviewed_by:vetName,vet_reviewed_at:at,correction_notes:allReady?undefined:correctionNotes||'استكمال البنود والصور الإلزامية قبل اعتماد الاستقبال.'}:x),flock_cycles:state.flock_cycles.map(f=>f.id===item.flock_id?{...f,status:allReady?'ready_for_placement':f.status}:f)};
}

export function receiveFlockV197(state:ManagedOperationsStateV197,input:Omit<PlacementReceiptV197,'id'|'accepted_initial_count'|'average_arrival_weight_g'>):ManagedOperationsStateV197{
  const checklist=state.pre_placement.find(x=>x.flock_id===input.flock_id);if(!checklist||checklist.status!=='ready_for_placement')throw new Error('لا يمكن استلام القطيع قبل اعتماد جاهزية العنبر من الطبيب.');
  const accepted=Math.max(0,input.received_count-input.arrival_mortality); const avg=input.sample_weights_g.length?input.sample_weights_g.reduce((s,n)=>s+n,0)/input.sample_weights_g.length:0;
  const receipt:PlacementReceiptV197={...input,id:id('PLC'),accepted_initial_count:accepted,average_arrival_weight_g:Math.round(avg)};
  const flock=state.flock_cycles.find(f=>f.id===input.flock_id); if(!flock)throw new Error('دورة القطيع غير موجودة');
  return {...state,placements:[receipt,...state.placements],flock_cycles:state.flock_cycles.map(f=>f.id===input.flock_id?{...f,placement_date:input.received_at.slice(0,10),initial_count:accepted,current_count:accepted,age_days:Math.max(0,Math.floor((Date.now()-new Date(input.hatch_date||input.received_at).getTime())/86400000)),status:'active'}:f),farms:state.farms.map(f=>f.id===flock.farm_id?{...f,status:'active'}:f),timeline:[{id:id('TL'),at:input.received_at,farm_id:flock.farm_id,flock_id:flock.id,actor:input.received_by,actor_role:'worker',action:'استلام القطيع',why:'وصول دفعة الصيصان',evidence_refs:[...input.photo_refs,...input.documents],entity_type:'placement_receipt',entity_id:receipt.id},...state.timeline]};
}

const median=(values:number[])=>{if(!values.length)return 0;const s=[...values].sort((a,b)=>a-b),m=Math.floor(s.length/2);return s.length%2?s[m]:(s[m-1]+s[m])/2;};
const stdev=(values:number[],avg:number)=>values.length?Math.sqrt(values.reduce((s,v)=>s+(v-avg)**2,0)/values.length):0;

export function submitDailyFarmReportV197(state:ManagedOperationsStateV197,input:Omit<DailyFarmReportV197,'id'|'report_number'|'closing_birds'|'avg_weight_g'|'min_weight_g'|'max_weight_g'|'median_weight_g'|'cv_percent'|'uniformity_percent'|'weight_variance_percent'|'estimated_fcr'|'mandatory_fields_complete'|'submitted_at'|'vet_review_status'>):ManagedOperationsStateV197{
  const flock=state.flock_cycles.find(f=>f.id===input.flock_id);if(!flock)throw new Error('القطيع غير موجود');
  const closing=Math.max(0,input.opening_birds-input.mortality-input.culls); const samples=input.sample_weights_g.filter(n=>n>0); const avg=samples.length?samples.reduce((s,n)=>s+n,0)/samples.length:undefined;
  const min=avg!==undefined?Math.min(...samples):undefined,max=avg!==undefined?Math.max(...samples):undefined,med=avg!==undefined?median(samples):undefined,cv=avg?stdev(samples,avg)/avg*100:undefined;
  const uniformity=avg?samples.filter(v=>Math.abs(v-avg)<=avg*.1).length/Math.max(1,samples.length)*100:undefined; const variance=input.expected_weight_g&&avg?(avg-input.expected_weight_g)/input.expected_weight_g*100:undefined;
  const cumulativeFeed=(input.cumulative_feed_kg||flock.cumulative_feed_kg)+input.feed_used_kg; const biomass=avg?closing*(avg/1000):0; const fcr=biomass>0?cumulativeFeed/biomass:undefined;
  const mandatory=Boolean(input.report_date&&input.entered_by&&input.opening_birds>=0&&input.feed_closing_kg>=0&&input.temperature_min_c>0&&input.temperature_max_c>0&&input.humidity_min_pct>=0&&input.humidity_max_pct>=0&&(input.weight_condition==='not_measured'||samples.length>0));
  if(state.settings.enforce_daily_close&&input.shift==='daily_close'&&!mandatory)throw new Error('لا يمكن إغلاق اليوم قبل استكمال البيانات الإلزامية.');
  const report:DailyFarmReportV197={...input,id:id('RPT'),report_number:serial('RPT'),closing_birds:closing,avg_weight_g:avg?Math.round(avg):undefined,min_weight_g:min,max_weight_g:max,median_weight_g:med,cv_percent:cv?Number(cv.toFixed(2)):undefined,uniformity_percent:uniformity?Number(uniformity.toFixed(1)):undefined,weight_variance_percent:variance?Number(variance.toFixed(1)):undefined,cumulative_feed_kg:cumulativeFeed,estimated_fcr:fcr?Number(fcr.toFixed(3)):undefined,mandatory_fields_complete:mandatory,submitted_at:nowIso(),vet_review_status:'pending'};
  const mortalityPct=input.opening_birds?input.mortality/input.opening_birds*100:0; const exceptions=[...state.exceptions];
  if(mortalityPct>=0.5)exceptions.unshift({id:id('EX'),detected_at:nowIso(),farm_id:input.farm_id,flock_id:input.flock_id,category:'mortality',severity:mortalityPct>=1?'critical':'warning',title:'ارتفاع النفوق اليومي',detail:`${mortalityPct.toFixed(2)}% في التقرير ${report.report_number}`,owner_role:'vet',status:'open'});
  if(variance!==undefined&&variance<=-8)exceptions.unshift({id:id('EX'),detected_at:nowIso(),farm_id:input.farm_id,flock_id:input.flock_id,category:'weight',severity:variance<=-15?'critical':'warning',title:'الوزن أقل من الدليل',detail:`الانحراف ${variance.toFixed(1)}%`,owner_role:'vet',status:'open'});
  if(input.feed_closing_kg<Math.max(1,input.feed_used_kg*1.5))exceptions.unshift({id:id('EX'),detected_at:nowIso(),farm_id:input.farm_id,flock_id:input.flock_id,category:'feed',severity:'warning',title:'رصيد العلف منخفض',detail:`المتبقي ${input.feed_closing_kg} كجم`,owner_role:'procurement',status:'open'});
  return {...state,daily_reports:[report,...state.daily_reports],flock_cycles:state.flock_cycles.map(f=>f.id===input.flock_id?{...f,current_count:closing,age_days:input.age_days,cumulative_feed_kg:cumulativeFeed,cumulative_mortality:f.cumulative_mortality+input.mortality}:f),exceptions,timeline:[{id:id('TL'),at:report.submitted_at,farm_id:input.farm_id,flock_id:input.flock_id,actor:input.entered_by,actor_role:input.entered_by_role,action:`تقرير ${input.shift}`,why:'تسجيل التشغيل اليومي',evidence_refs:input.media_refs,entity_type:'daily_report',entity_id:report.id},...state.timeline]};
}

export function generateVetDecisionAndTomorrowPlanV197(state:ManagedOperationsStateV197,reportId:string,vetName?:string):ManagedOperationsStateV197{
  const report=state.daily_reports.find(r=>r.id===reportId);if(!report)throw new Error('التقرير غير موجود'); const flock=state.flock_cycles.find(f=>f.id===report.flock_id);if(!flock)throw new Error('القطيع غير موجود');
  const protocol=[...state.protocols].filter(p=>p.flock_id===report.flock_id&&p.status==='active').sort((a,b)=>b.version-a.version)[0];
  const mortalityPct=report.opening_birds?report.mortality/report.opening_birds*100:0; const flags:string[]=[]; let risk:'low'|'medium'|'high'|'critical'='low';
  if(mortalityPct>=1){flags.push(`نفوق ${mortalityPct.toFixed(2)}%`);risk='critical';}else if(mortalityPct>=.5){flags.push(`نفوق مرتفع ${mortalityPct.toFixed(2)}%`);risk='high';}
  if((report.weight_variance_percent||0)<=-8){flags.push(`انحراف وزن ${report.weight_variance_percent}%`);risk=risk==='critical'?risk:'high';}
  if(report.respiratory_sound_observed){flags.push('أصوات تنفسية غير طبيعية');risk=risk==='low'?'medium':risk;}
  if(report.abnormal_droppings_observed){flags.push('فضلات غير طبيعية');risk=risk==='low'?'medium':risk;}
  const perBirdTarget=protocol?.feed_plan.find(p=>report.age_days>=p.age_from&&report.age_days<=p.age_to)?.target_g_per_bird;
  const targetFeed=perBirdTarget?Number((perBirdTarget*report.closing_birds/1000).toFixed(1)):Math.max(report.feed_used_kg,Math.round(report.feed_used_kg*1.03));
  const temp=protocol?.temperature_plan.find(p=>report.age_days>=p.age_from&&report.age_days<=p.age_to)?.target_c??Number(((report.temperature_min_c+report.temperature_max_c)/2).toFixed(1));
  const sampling=Math.max(protocol?.weighing_rule.min_sample_count||50,Math.min(200,Math.ceil(report.closing_birds*.005)));
  const decision:VeterinaryDecisionV197={id:id('VETD'),decision_number:serial('VETD'),farm_id:report.farm_id,flock_id:report.flock_id,date:report.report_date,source_report_ids:[report.id],ai_summary:`تحليل تشغيلي: نفوق ${mortalityPct.toFixed(2)}%، متوسط وزن ${report.avg_weight_g||'غير مقاس'} جم، FCR تقديري ${report.estimated_fcr||'—'}.`,ai_risk_level:risk,ai_confidence:.78,ai_flags:flags,proposed_feed_kg:targetFeed,proposed_temperature_c:temp,proposed_sampling_count:sampling,proposed_actions:flags.length?['مراجعة الطبيب للعلامات المسجلة','التحقق من التهوية والماء','متابعة القياس في نفس التوقيت']:['الاستمرار على الخطة ومراقبة المؤشرات'],requires_vet_approval:true,vet_decision:vetName?'approved':'pending',vet_name:vetName,vet_note:vetName?'اعتمد الطبيب الخطة التشغيلية؛ أي علاج دوائي يحتاج أمرًا طبيًا صريحًا.':undefined,approved_at:vetName?nowIso():undefined};
  const plan:DailyFarmPlanV197={id:id('PLAN'),plan_number:serial('PLAN'),farm_id:report.farm_id,flock_id:report.flock_id,plan_date:new Date(new Date(report.report_date).getTime()+86400000).toISOString().slice(0,10),generated_from_report_id:report.id,protocol_version:protocol?.version||1,target_feed_kg:targetFeed,feed_schedule:['صباح','ظهر','مساء'],target_temperature_c:temp,target_humidity_pct:protocol?.humidity_target_pct||{min:55,max:70},sampling_count:sampling,sampling_time:protocol?.weighing_rule.time||report.weight_time||'07:00',medication_tasks:[],vaccination_tasks:protocol?.vaccination_plan.filter(v=>v.age_day===report.age_days+1).map(v=>`${v.name} — ${v.method}`)||[],cleaning_tasks:['تفقد المشارب والمعالف','إزالة النافق وتوثيقه فورًا'],maintenance_tasks:report.equipment_issues.map(x=>`معالجة: ${x}`),farm_requirements:[],approved_by_vet:vetName,approved_at:vetName?nowIso():undefined,status:vetName?'approved':'vet_review'};
  const tasks:FarmTaskV197[]=(['توزيع العلف','قياس الحرارة والرطوبة','تفقد الماء','جمع النافق وتوثيقه'] as string[]).map((title,i)=>({id:id('TASK'),task_number:serial('TSK'),farm_id:report.farm_id,flock_id:report.flock_id,plan_id:plan.id,title,instructions:title==='توزيع العلف'?`تنفيذ خطة ${targetFeed} كجم حسب تعليمات الطبيب`:'التنفيذ والتوثيق في موعده',assigned_to:'العامل المكلف',due_at:new Date(new Date(plan.plan_date).getTime()+(7+i*3)*3600000).toISOString(),evidence_required:title!=='توزيع العلف'?false:true,evidence_refs:[],status:'pending'}));
  return {...state,veterinary_decisions:[decision,...state.veterinary_decisions],daily_plans:[plan,...state.daily_plans],farm_tasks:[...tasks,...state.farm_tasks],daily_reports:state.daily_reports.map(r=>r.id===report.id?{...r,vet_review_status:vetName?'reviewed':'pending'}:r)};
}

export function createFarmRequirementV197(state:ManagedOperationsStateV197,input:Omit<FarmRequirementV197,'id'|'requirement_number'|'requested_at'|'owner_decision'|'finance_status'|'procurement_status'>):ManagedOperationsStateV197{
  const requirement:FarmRequirementV197={...input,id:id('REQ'),requirement_number:serial('REQ'),requested_at:nowIso(),owner_decision:input.owner_approval_required?'pending':'approved',finance_status:'pending',procurement_status:'not_started'};
  const group=state.chat_groups.find(g=>g.farm_id===input.farm_id&&g.category==='farm_operations');
  const card:FarmChatMessageV197|undefined=group?{id:id('MSG'),group_id:group.id,sent_at:nowIso(),sender_id:'requirements-system',sender_name:input.requested_by,sender_role:input.requested_by_role,type:'action_card',text:`احتياج ${requirement.requirement_number}: ${requirement.item_name} — ${requirement.quantity} ${requirement.unit}. السبب: ${requirement.reason}`,media_refs:[],extracted_data:{quantity:requirement.quantity},linked_entity_type:'farm_requirement',linked_entity_id:requirement.id,requires_confirmation:false,action_card:{kind:'purchase_approval',title:`طلب ${requirement.item_name}`,status:'pending',actions:['موافق','أحتاج توضيح','رفض']}}:undefined;
  return {...state,requirements:[requirement,...state.requirements],chat_messages:card?[card,...state.chat_messages]:state.chat_messages,timeline:[{id:id('TL'),at:requirement.requested_at,farm_id:input.farm_id,flock_id:input.flock_id,actor:input.requested_by,actor_role:input.requested_by_role,action:`طلب احتياج: ${input.item_name}`,why:input.reason,approval:input.owner_approval_required?'بانتظار المالك':'لا يحتاج',cost:input.estimated_cost,currency:input.currency,evidence_refs:[],entity_type:'farm_requirement',entity_id:requirement.id},...state.timeline]};
}

export function decideFarmRequirementV197(state:ManagedOperationsStateV197,requirementId:string,decision:ApprovalDecisionV197,note:string,actor:string):ManagedOperationsStateV197{
  const req=state.requirements.find(r=>r.id===requirementId);if(!req)return state; const at=nowIso(); const scoreDelta=decision==='rejected'&&['medicine','vaccine','lab'].includes(req.category)?-8:0;
  const compliance=scoreDelta?[{id:id('CMP'),at,farm_id:req.farm_id,flock_id:req.flock_id,actor_type:'owner' as const,actor_name:actor,category:'owner_refusal' as const,severity:req.urgency==='critical'?'critical' as const:'warning' as const,score_delta:scoreDelta,description:`رفض احتياج ${req.item_name}: ${note}`}]:[];
  return {...state,requirements:state.requirements.map(r=>r.id===requirementId?{...r,owner_decision:decision,owner_decision_note:note,owner_decided_at:at}:r),chat_messages:state.chat_messages.map(m=>m.linked_entity_type==='farm_requirement'&&m.linked_entity_id===requirementId&&m.action_card?{...m,action_card:{...m.action_card,status:decision==='approved'?'approved':decision==='rejected'?'rejected':m.action_card.status}}:m),compliance_events:[...compliance,...state.compliance_events],timeline:[{id:id('TL'),at,farm_id:req.farm_id,flock_id:req.flock_id,actor,actor_role:'owner',action:`قرار صاحب المزرعة: ${decision}`,why:note||req.reason,approval:decision,cost:req.estimated_cost,currency:req.currency,evidence_refs:[],entity_type:'farm_requirement',entity_id:req.id},...state.timeline]};
}

export function financeApproveRequirementV197(state:ManagedOperationsStateV197,requirementId:string,approved:boolean,actor:string):ManagedOperationsStateV197{
  const req=state.requirements.find(r=>r.id===requirementId);if(!req)return state;if(req.owner_approval_required&&req.owner_decision!=='approved')throw new Error('موافقة صاحب المزرعة مطلوبة قبل اعتماد المالية.');
  return {...state,requirements:state.requirements.map(r=>r.id===requirementId?{...r,finance_status:approved?'approved':'rejected',procurement_status:approved?'availability_check':r.procurement_status}:r),timeline:[{id:id('TL'),at:nowIso(),farm_id:req.farm_id,flock_id:req.flock_id,actor,actor_role:'finance',action:approved?'اعتماد مالي للاحتياج':'رفض مالي للاحتياج',why:req.reason,approval:approved?'approved':'rejected',cost:req.estimated_cost,currency:req.currency,evidence_refs:[],entity_type:'farm_requirement',entity_id:req.id},...state.timeline]};
}

export function issueFarmPurchaseOrderV197(state:ManagedOperationsStateV197,input:{requirement_id:string;supplier_company_id?:string;supplier_name:string;branch_id?:string;branch_name?:string;unit_price:number;currency:CurrencyV195;transport_cost?:number;platform_fee?:number;payment_mode:'cash'|'credit'|'transfer';due_date?:string;issued_by_finance:string;source_offer_id?:string;source_market_request_id?:string;estimated_arrival_at?:string}):ManagedOperationsStateV197{
  const req=state.requirements.find(r=>r.id===input.requirement_id); if(!req) throw new Error('الاحتياج غير موجود');
  if(req.owner_approval_required && req.owner_decision!=='approved') throw new Error('موافقة صاحب المزرعة مطلوبة قبل إصدار أمر الشراء.');
  if(req.finance_status!=='approved') throw new Error('الاعتماد المالي مطلوب قبل إصدار أمر الشراء.');
  const goodsAmount=input.unit_price*req.quantity, transport=input.transport_cost||0, fee=input.platform_fee||0;
  const po:FarmPurchaseOrderV197={id:id('PO'),po_number:serial('PO'),farm_id:req.farm_id,flock_id:req.flock_id,requirement_id:req.id,supplier_company_id:input.supplier_company_id,supplier_name:input.supplier_name,branch_id:input.branch_id,branch_name:input.branch_name,item_name:req.item_name,quantity:req.quantity,unit:req.unit,unit_price:input.unit_price,currency:input.currency,goods_amount:goodsAmount,transport_cost:transport,platform_fee:fee,total_amount:goodsAmount+transport+fee,payment_mode:input.payment_mode,due_date:input.due_date,reason:req.reason,issued_at:nowIso(),issued_by_finance:input.issued_by_finance,status:'issued',source_offer_id:input.source_offer_id,source_market_request_id:input.source_market_request_id,estimated_arrival_at:input.estimated_arrival_at};
  const group=state.chat_groups.find(g=>g.farm_id===req.farm_id&&g.category==='finance_procurement');
  const card:FarmChatMessageV197|undefined=group?{id:id('MSG'),group_id:group.id,sent_at:nowIso(),sender_id:'finance-system',sender_name:input.issued_by_finance,sender_role:'finance',type:'action_card',text:`أمر شراء ${po.po_number}: ${req.item_name} — ${req.quantity} ${req.unit} — الإجمالي ${po.total_amount.toFixed(2)} ${po.currency}`,media_refs:[],extracted_data:{total_amount:po.total_amount,quantity:req.quantity},linked_entity_type:'purchase_order',linked_entity_id:po.id,requires_confirmation:false,action_card:{kind:'invoice',title:`أمر شراء ${po.po_number}`,status:'approved',actions:['عرض أمر الشراء','تأكيد المورد','تسجيل الاستلام']}}:undefined;
  return {...state,purchase_orders:[po,...state.purchase_orders],requirements:state.requirements.map(r=>r.id===req.id?{...r,procurement_status:'po_issued'}:r),chat_messages:card?[card,...state.chat_messages]:state.chat_messages,timeline:[{id:id('TL'),at:po.issued_at,farm_id:req.farm_id,flock_id:req.flock_id,actor:input.issued_by_finance,actor_role:'finance',action:`إصدار أمر شراء ${po.po_number}`,why:req.reason,approval:'finance approved',cost:po.total_amount,currency:po.currency,evidence_refs:[po.po_number],entity_type:'purchase_order',entity_id:po.id},...state.timeline]};
}

export function confirmFarmPurchaseOrderSupplierV197(state:ManagedOperationsStateV197,poId:string,input:{confirmed:boolean;estimated_arrival_at?:string;actor:string;note?:string}):ManagedOperationsStateV197{
  const po=state.purchase_orders.find(p=>p.id===poId); if(!po) throw new Error('أمر الشراء غير موجود');
  return {...state,purchase_orders:state.purchase_orders.map(p=>p.id===poId?{...p,status:input.confirmed?'supplier_confirmed':'cancelled',supplier_confirmation_at:nowIso(),estimated_arrival_at:input.estimated_arrival_at||p.estimated_arrival_at}:p),requirements:state.requirements.map(r=>r.id===po.requirement_id?{...r,procurement_status:input.confirmed?'in_transit':'availability_check'}:r),timeline:[{id:id('TL'),at:nowIso(),farm_id:po.farm_id,flock_id:po.flock_id,actor:input.actor,actor_role:'supplier',action:input.confirmed?`تأكيد المورد لأمر ${po.po_number}`:`تعذر المورد لأمر ${po.po_number}`,why:input.note||po.reason,approval:input.confirmed?'confirmed':'declined',cost:po.total_amount,currency:po.currency,evidence_refs:[po.po_number],entity_type:'purchase_order',entity_id:po.id},...state.timeline]};
}

export function receiveFarmGoodsV197(state:ManagedOperationsStateV197,input:Omit<GoodsReceiptV197,'id'|'receipt_number'|'variance'|'three_way_match'>):ManagedOperationsStateV197{
  const variance=input.received_quantity-input.ordered_quantity; const matched=Math.abs(variance)<0.0001&&Boolean(input.invoice_number&&input.po_number)&&(input.cold_chain_required?input.cold_chain_ok===true:true);
  const receipt:GoodsReceiptV197={...input,id:id('GRN'),receipt_number:serial('GRN'),variance,three_way_match:matched?'matched':'variance'};
  const req=state.requirements.find(r=>r.id===input.requirement_id);
  return {...state,goods_receipts:[receipt,...state.goods_receipts],purchase_orders:state.purchase_orders.map(p=>input.po_number&&p.po_number===input.po_number?{...p,status:(Math.abs(variance)<0.0001?'received':'partially_received')}:p),requirements:state.requirements.map(r=>r.id===input.requirement_id?{...r,procurement_status:'received'}:r),exceptions:matched?state.exceptions:[{id:id('EX'),detected_at:nowIso(),farm_id:input.farm_id,flock_id:input.flock_id,category:input.cold_chain_required&&!input.cold_chain_ok?'cold_chain':'procurement',severity:'warning',title:'استلام يحتاج مراجعة',detail:`${receipt.receipt_number} — فرق ${variance} ${input.unit}`,owner_role:'finance',status:'open'},...state.exceptions],timeline:[{id:id('TL'),at:input.received_at,farm_id:input.farm_id,flock_id:input.flock_id,actor:input.received_by,actor_role:'worker',action:`استلام ${input.item_name}`,why:req?.reason||'توريد للمزرعة',approval:receipt.three_way_match,cost:req?.estimated_cost,currency:req?.currency,evidence_refs:input.photo_refs,entity_type:'goods_receipt',entity_id:receipt.id},...state.timeline]};
}

export function receiveFarmGoodsAndBookCostV197(state:ManagedOperationsStateV197,core:PlatformCoreStateV195,input:Omit<GoodsReceiptV197,'id'|'receipt_number'|'variance'|'three_way_match'>):ManagedOperationsStateV197{
  let next=receiveFarmGoodsV197(state,input);
  const po=input.po_number?next.purchase_orders.find(p=>p.po_number===input.po_number):undefined;
  const req=next.requirements.find(r=>r.id===input.requirement_id);
  if(!po||!req) return next;
  const alreadyBooked=next.cost_entries.some(e=>e.source_document===po.po_number&&e.farm_id===po.farm_id&&e.flock_id===po.flock_id);
  if(alreadyBooked) return next;
  const categoryMap:Record<FarmRequirementV197['category'],FarmCostEntryV197['category']>={feed:'feed',medicine:'medicine',vaccine:'vaccine',equipment:'equipment',disinfectant:'other',litter:'litter',fuel:'fuel',lab:'lab',transport:'transport',service:'other',other:'other'};
  next=addFarmCostEntryV197(next,core,{farm_id:po.farm_id,flock_id:po.flock_id,date:input.received_at.slice(0,10),category:categoryMap[req.category],description:`توريد ${po.item_name} — ${po.po_number}`,amount:po.total_amount,currency:po.currency,debit_credit:'debit',party_name:po.supplier_name,source_document:po.po_number,approved_by_finance:po.issued_by_finance,payment_status:po.payment_mode==='credit'?'credit':'paid',due_date:po.due_date});
  return next;
}

export function addFarmCostEntryV197(state:ManagedOperationsStateV197,core:PlatformCoreStateV195,input:Omit<FarmCostEntryV197,'id'|'entry_number'|'exchange_rate_to_sar'|'amount_sar'>):ManagedOperationsStateV197{
  const rate=input.currency==='SAR'?1:input.currency==='YER_OLD'?core.settings.sar_to_yer_old:core.settings.sar_to_yer_new;
  const entry:FarmCostEntryV197={...input,id:id('COST'),entry_number:serial('COST'),exchange_rate_to_sar:rate,amount_sar:Number(moneyToSar(input.amount,input.currency,core).toFixed(2))};
  return {...state,cost_entries:[entry,...state.cost_entries],timeline:[{id:id('TL'),at:nowIso(),farm_id:input.farm_id,flock_id:input.flock_id,actor:input.approved_by_finance||'المالية',actor_role:'finance',action:`قيد تكلفة: ${input.description}`,why:input.category,approval:input.approved_by_finance,cost:input.amount,currency:input.currency,evidence_refs:input.source_document?[input.source_document]:[],entity_type:'farm_cost',entity_id:entry.id},...state.timeline]};
}

export function createOperatingProtocolV197(state:ManagedOperationsStateV197,input:Omit<FarmOperatingProtocolV197,'id'|'protocol_number'|'version'|'status'>):ManagedOperationsStateV197{
  const prev=[...state.protocols].filter(p=>p.flock_id===input.flock_id).sort((a,b)=>b.version-a.version)[0]; const version=(prev?.version||0)+1;
  const protocols=state.protocols.map(p=>p.flock_id===input.flock_id&&p.status==='active'?{...p,status:'superseded' as const}:p);
  const protocol:FarmOperatingProtocolV197={...input,id:id('PROT'),protocol_number:serial('PROT'),version,status:'active',approved_at:nowIso()};
  return {...state,protocols:[protocol,...protocols]};
}

export function parseOperationalVoiceV197(text:string):Record<string,number|string|boolean>{
  const normalized=text.replace(/[،,]/g,' ').replace(/\s+/g,' ').trim(); const result:Record<string,number|string|boolean>={};
  const capture=(key:string,patterns:RegExp[])=>{for(const p of patterns){const m=normalized.match(p);if(m){const n=Number(String(m[1]).replace(/[^\d.]/g,''));if(Number.isFinite(n))result[key]=n;break;}}};
  capture('mortality',[/(?:النافق|نافق)\s*(?:اليوم)?\s*(\d+(?:\.\d+)?)/i]);
  capture('temperature_c',[/(?:الحرارة|درجة الحرارة)\s*(\d+(?:\.\d+)?)/i]);
  capture('humidity_pct',[/(?:الرطوبة)\s*(\d+(?:\.\d+)?)/i]);
  capture('feed_remaining_kg',[/(?:باقي|متبقي)(?:\s+من)?\s+العلف\s*(\d+(?:\.\d+)?)/i,/(?:العلف المتبقي)\s*(\d+(?:\.\d+)?)/i]);
  capture('water_liters',[/(?:الماء|المياه)\s*(\d+(?:\.\d+)?)/i]);
  capture('weight_g',[/(?:الوزن)\s*(\d+(?:\.\d+)?)/i]);
  if(/شخر|خرخرة|صوت تنفس|كحة/i.test(normalized))result.respiratory_sound_observed=true;
  if(/اسهال|إسهال|فضلات غريبة|زرق/i.test(normalized))result.abnormal_droppings_observed=true;
  result.raw_text=normalized;return result;
}

export function updateChatGroupModerationV197(state:ManagedOperationsStateV197,groupId:string,input:{actor_id:string;actor_role:string;status?:FarmChatGroupV197['status'];posting_policy?:FarmChatGroupV197['posting_policy'];add_member_id?:string;remove_member_id?:string;add_moderator_id?:string;remove_moderator_id?:string}):ManagedOperationsStateV197{
  const group=state.chat_groups.find(g=>g.id===groupId); if(!group) throw new Error('مجموعة التشغيل غير موجودة');
  const privileged=input.actor_role==='system_owner'||input.actor_role==='ceo'||group.owner_user_id===input.actor_id||group.moderator_user_ids.includes(input.actor_id);
  if(!privileged) throw new Error('ليس لديك صلاحية إدارة هذه المجموعة.');
  return {...state,chat_groups:state.chat_groups.map(g=>{if(g.id!==groupId)return g;let members=[...g.member_user_ids],mods=[...g.moderator_user_ids];if(input.add_member_id&&!members.includes(input.add_member_id))members.push(input.add_member_id);if(input.remove_member_id)members=members.filter(x=>x!==input.remove_member_id);if(input.add_moderator_id&&!mods.includes(input.add_moderator_id))mods.push(input.add_moderator_id);if(input.remove_moderator_id)mods=mods.filter(x=>x!==input.remove_moderator_id);return {...g,status:input.status||g.status,posting_policy:input.posting_policy||g.posting_policy,member_user_ids:members,moderator_user_ids:mods};})};
}

export function markFarmChatReadV197(state:ManagedOperationsStateV197,groupId:string,userId:string):ManagedOperationsStateV197{
  return {...state,chat_messages:state.chat_messages.map(m=>m.group_id===groupId?{...m,delivery_status:'read',read_by:[...new Set([...(m.read_by||[]),userId])]}:m)};
}

export function sendFarmChatMessageV197(state:ManagedOperationsStateV197,input:{group_id:string;sender_id:string;sender_name:string;sender_role:string;type:FarmChatMessageV197['type'];text:string;media_refs?:string[];transcript?:string}):ManagedOperationsStateV197{
  const group=state.chat_groups.find(g=>g.id===input.group_id); if(!group) throw new Error('مجموعة التشغيل غير موجودة');
  const executiveRoles=['system_owner','ceo','sector_manager']; const vetRoles=['system_owner','ceo','vet_consultant','field_vet']; const farmRoles=['system_owner','ceo','farmer','worker','supervisor','vet_consultant','field_vet']; const financeRoles=['system_owner','ceo','finance','farmer','vet_consultant','field_vet'];
  const isModerator=group.owner_user_id===input.sender_id||group.moderator_user_ids.includes(input.sender_id)||executiveRoles.includes(input.sender_role);
  const roleAllowed=group.category==='veterinary_board'?vetRoles.includes(input.sender_role):group.category==='executive_control'?executiveRoles.includes(input.sender_role):group.category==='finance_procurement'?financeRoles.includes(input.sender_role):farmRoles.includes(input.sender_role);
  if(!roleAllowed&&!group.member_user_ids.includes(input.sender_id)) throw new Error('الدور الحالي غير مصرح له بالنشر في هذه المجموعة.');
  if(group.status==='archived') throw new Error('المجموعة مؤرشفة.'); if(group.status==='muted'&&!isModerator) throw new Error('المجموعة مكتومة؛ النشر متاح للمشرفين فقط.');
  if(group.posting_policy==='moderators_and_owner'&&!isModerator&&!group.member_user_ids.includes(input.sender_id)) throw new Error('النشر مقيد بالمشرفين والأعضاء المعتمدين.');
  const extracted=parseOperationalVoiceV197(input.transcript||input.text); const requiresConfirmation=Object.keys(extracted).some(k=>k!=='raw_text');
  const message:FarmChatMessageV197={id:id('MSG'),group_id:input.group_id,sent_at:nowIso(),sender_id:input.sender_id,sender_name:input.sender_name,sender_role:input.sender_role,type:input.type,text:input.text,media_refs:input.media_refs||[],transcript:input.transcript,extracted_data:extracted,requires_confirmation:requiresConfirmation,action_card:requiresConfirmation?{kind:'data_confirmation',title:'بيانات مستخرجة من التقرير الميداني',status:'pending',actions:['تأكيد الحفظ','تعديل','إلغاء']}:undefined,delivery_status:'sent',read_by:[]};
  return {...state,chat_messages:[message,...state.chat_messages]};
}

export function confirmChatExtractedDataV197(state:ManagedOperationsStateV197,messageId:string,actor:string):ManagedOperationsStateV197{
  return {...state,chat_messages:state.chat_messages.map(m=>m.id===messageId?{...m,requires_confirmation:false,confirmed_by:actor,action_card:m.action_card?{...m.action_card,status:'completed'}:undefined}:m)};
}

export function generateMarketingReadinessV197(state:ManagedOperationsStateV197,flockId:string,marketPrice:number,currency:CurrencyV195,extraDayFeedCost:number):ManagedOperationsStateV197{
  const flock=state.flock_cycles.find(f=>f.id===flockId);if(!flock)throw new Error('القطيع غير موجود'); const report=state.daily_reports.find(r=>r.flock_id===flockId&&r.avg_weight_g);
  const avgKg=(report?.avg_weight_g||0)/1000; const totalCosts=state.cost_entries.filter(c=>c.flock_id===flockId&&c.debit_credit==='debit').reduce((s,c)=>s+c.amount_sar,0); const estimatedKg=Math.max(1,flock.current_count*avgKg); const breakEven=totalCosts/estimatedKg;
  const readiness:MarketingReadinessV197={id:id('MRK'),farm_id:flock.farm_id,flock_id:flock.id,generated_at:nowIso(),current_birds:flock.current_count,current_avg_weight_kg:Number(avgKg.toFixed(3)),projected_sale_weight_kg:Number(Math.max(avgKg,flock.target_market_weight_kg).toFixed(3)),projected_sale_birds:flock.current_count,market_reference_price_per_kg:marketPrice,currency,extra_day_feed_cost:extraDayFeedCost,break_even_price_per_kg:Number(breakEven.toFixed(3)),recommendation_summary:`مرجع السوق ${marketPrice} ${currency}. سعر التعادل التقريبي ${breakEven.toFixed(2)} SAR/kg؛ القرار النهائي لصاحب المزرعة حسب العقد.`,owner_decision:'pending'};
  return {...state,marketing_readiness:[readiness,...state.marketing_readiness],flock_cycles:state.flock_cycles.map(f=>f.id===flockId?{...f,status:'marketing'}:f)};
}

export function createPoultrySaleV197(state:ManagedOperationsStateV197,input:Omit<PoultrySaleV197,'id'|'sale_number'|'gross_expected'|'net_expected'|'owner_decision'|'status'>):ManagedOperationsStateV197{
  const gross=input.birds_planned*input.avg_weight_kg*input.price_per_kg; const net=gross-input.office_fee-input.platform_fee-input.transport_fee;
  const sale:PoultrySaleV197={...input,id:id('SALE'),sale_number:serial('SALE'),gross_expected:gross,net_expected:net,owner_decision:'pending',status:'owner_review'};
  return {...state,poultry_sales:[sale,...state.poultry_sales]};
}

export function ownerDecideSaleV197(state:ManagedOperationsStateV197,saleId:string,decision:ApprovalDecisionV197):ManagedOperationsStateV197{
  return {...state,poultry_sales:state.poultry_sales.map(s=>s.id===saleId?{...s,owner_decision:decision,status:decision==='approved'?'approved':decision==='rejected'?'cancelled':s.status}:s)};
}

export function completeSaleDeliveryV197(state:ManagedOperationsStateV197,saleId:string,input:{loaded_birds:number;loading_weight_kg:number;vehicle_plate:string;driver_name:string;driver_phone:string;vehicle_disinfected:boolean;departed_at:string;delivered_birds:number;transport_mortality:number;arrived_at:string;pod_reference:string;receiver_name:string}):ManagedOperationsStateV197{
  const sale=state.poultry_sales.find(s=>s.id===saleId);if(!sale)throw new Error('صفقة البيع غير موجودة');if(sale.owner_decision!=='approved')throw new Error('موافقة صاحب المزرعة مطلوبة.');
  const flock=state.flock_cycles.find(f=>f.id===sale.flock_id); const sold=Math.min(input.delivered_birds,flock?.current_count||input.delivered_birds);
  return {...state,poultry_sales:state.poultry_sales.map(s=>s.id===saleId?{...s,...input,status:'delivered'}:s),flock_cycles:state.flock_cycles.map(f=>f.id===sale.flock_id?{...f,current_count:Math.max(0,f.current_count-input.loaded_birds),status:Math.max(0,f.current_count-input.loaded_birds)===0?'closed':'selling'}:f),timeline:[{id:id('TL'),at:input.arrived_at,farm_id:sale.farm_id,flock_id:sale.flock_id,actor:input.receiver_name,actor_role:'receiver',action:`تسليم بيع ${sale.sale_number}`,why:'بيع وتسليم دواجن',approval:sale.owner_decision,cost:sale.net_expected,currency:sale.currency,evidence_refs:[input.pod_reference],entity_type:'poultry_sale',entity_id:sale.id},...state.timeline]};
}

export function generateCycleSettlementV197(state:ManagedOperationsStateV197,flockId:string):ManagedOperationsStateV197{
  const flock=state.flock_cycles.find(f=>f.id===flockId);if(!flock)throw new Error('القطيع غير موجود'); const sales=state.poultry_sales.filter(s=>s.flock_id===flockId&&['delivered','settled'].includes(s.status)); const placement=state.placements.find(p=>p.flock_id===flockId);
  const sold=sales.reduce((s,x)=>s+(x.delivered_birds||0),0); const transport=sales.reduce((s,x)=>s+(x.transport_mortality||0),0); const farmMort=state.daily_reports.filter(r=>r.flock_id===flockId).reduce((s,r)=>s+r.mortality,0); const culls=state.daily_reports.filter(r=>r.flock_id===flockId).reduce((s,r)=>s+r.culls,0);
  const initial=placement?.accepted_initial_count||flock.initial_count; const remaining=Math.max(0,initial-farmMort-culls-transport-sold); const grossSar=state.cost_entries.filter(c=>c.flock_id===flockId&&c.debit_credit==='credit').reduce((s,c)=>s+c.amount_sar,0)||sales.reduce((s,x)=>s+x.gross_expected,0);
  const costs=state.cost_entries.filter(c=>c.flock_id===flockId&&c.debit_credit==='debit').reduce((s,c)=>s+c.amount_sar,0); const marketing=sales.reduce((s,x)=>s+x.office_fee,0); const tr=sales.reduce((s,x)=>s+x.transport_fee,0); const platform=sales.reduce((s,x)=>s+x.platform_fee,0);
  const settlement:CycleSettlementV197={id:id('SET'),settlement_number:serial('SET'),farm_id:flock.farm_id,flock_id:flockId,generated_at:nowIso(),initial_birds:initial,farm_mortality:farmMort,culls,transport_mortality:transport,sold_birds:sold,remaining_birds:remaining,gross_sales_sar:grossSar,marketing_fees_sar:marketing,transport_fees_sar:tr,platform_fees_sar:platform,operating_costs_sar:costs,outstanding_debt_sar:state.cost_entries.filter(c=>c.flock_id===flockId&&c.payment_status==='credit').reduce((s,c)=>s+c.amount_sar,0),net_due_owner_sar:grossSar-marketing-tr-platform-costs,status:'finance_review'};
  const avgWeight=state.daily_reports.find(r=>r.flock_id===flockId&&r.avg_weight_g)?.avg_weight_g; const feed=flock.cumulative_feed_kg; const biomass=sold*(avgWeight||0)/1000; const perf:CyclePerformanceV197={id:id('PERF'),farm_id:flock.farm_id,flock_id:flockId,closed_at:remaining===0?nowIso():undefined,age_at_sale_days:flock.age_days,final_weight_kg:avgWeight?(avgWeight/1000):undefined,fcr:biomass?Number((feed/biomass).toFixed(3)):undefined,mortality_percent:initial?Number((farmMort/initial*100).toFixed(2)):0,uniformity_percent:state.daily_reports.find(r=>r.flock_id===flockId&&r.uniformity_percent)?.uniformity_percent,total_feed_kg:feed,feed_cost_sar:state.cost_entries.filter(c=>c.flock_id===flockId&&c.category==='feed').reduce((s,c)=>s+c.amount_sar,0),medical_cost_sar:state.cost_entries.filter(c=>c.flock_id===flockId&&['medicine','vaccine','lab'].includes(c.category)).reduce((s,c)=>s+c.amount_sar,0),total_cost_sar:costs,revenue_sar:grossSar,profit_loss_sar:grossSar-costs,cost_per_bird_sar:initial?costs/initial:undefined,cost_per_kg_sar:biomass?costs/biomass:undefined,biosecurity_score:state.farms.find(f=>f.id===flock.farm_id)?.biosecurity_score,compliance_score:calculateComplianceScoreV197(state,flock.farm_id,flockId),loss_drivers:[],recommendations:['مراجعة الانحرافات التشغيلية قبل الدورة التالية','اعتماد خطة تجهيز العنبر قبل الاستقبال التالي']};
  return {...state,settlements:[settlement,...state.settlements],cycle_performance:[perf,...state.cycle_performance]};
}

export function calculateComplianceScoreV197(state:ManagedOperationsStateV197,farmId:string,flockId?:string):number{
  const events=state.compliance_events.filter(e=>e.farm_id===farmId&&(!flockId||!e.flock_id||e.flock_id===flockId)); return Math.max(0,Math.min(100,100+events.reduce((s,e)=>s+e.score_delta,0)));
}

export function financialFarmSummaryV197(state:ManagedOperationsStateV197,farmId:string,flockId?:string){
  const entries=state.cost_entries.filter(c=>c.farm_id===farmId&&(!flockId||c.flock_id===flockId)); const debit=entries.filter(e=>e.debit_credit==='debit').reduce((s,e)=>s+e.amount_sar,0),credit=entries.filter(e=>e.debit_credit==='credit').reduce((s,e)=>s+e.amount_sar,0),outstanding=entries.filter(e=>e.payment_status==='credit').reduce((s,e)=>s+e.amount_sar,0),paid=entries.filter(e=>e.payment_status==='paid'||e.payment_status==='settled').reduce((s,e)=>s+e.amount_sar,0); return {cost_sar:debit,revenue_sar:credit,profit_loss_sar:credit-debit,outstanding_sar:outstanding,paid_sar:paid};
}

export function executiveExceptionsV197(state:ManagedOperationsStateV197){return state.exceptions.filter(e=>e.status==='open').sort((a,b)=>(a.severity==='critical'?0:1)-(b.severity==='critical'?0:1)||b.detected_at.localeCompare(a.detected_at));}

export function buildExecutiveBriefV197(state:ManagedOperationsStateV197){
  const activeFlocks=state.flock_cycles.filter(f=>['active','marketing','selling'].includes(f.status)); const birds=activeFlocks.reduce((s,f)=>s+f.current_count,0); const reportsToday=state.daily_reports.filter(r=>r.report_date===new Date().toISOString().slice(0,10)); const mortality=reportsToday.reduce((s,r)=>s+r.mortality,0); const pendingApprovals=state.requirements.filter(r=>r.owner_decision==='pending'||r.finance_status==='pending').length; return {generated_at:nowIso(),active_flocks:activeFlocks.length,active_birds:birds,mortality_today:mortality,open_exceptions:executiveExceptionsV197(state).length,pending_approvals:pendingApprovals,pending_marketplace:state.marketplace_requests.filter(r=>!['delivered','cancelled'].includes(r.status)).length,active_managed_farms:state.farms.filter(f=>f.status==='active').length};
}

export function validateManagedOperationsV197(state:ManagedOperationsStateV197):string[]{
  const issues:string[]=[]; state.managed_contracts.forEach(c=>{if(!state.customers.some(x=>x.id===c.customer_id))issues.push(`عقد ${c.contract_number}: العميل غير موجود`);if(!state.farms.some(x=>x.id===c.farm_id))issues.push(`عقد ${c.contract_number}: المزرعة غير موجودة`);if(!c.assigned_vet_id)issues.push(`عقد ${c.contract_number}: لا يوجد طبيب`);});
  state.flock_cycles.forEach(f=>{if(!state.farms.some(x=>x.id===f.farm_id))issues.push(`قطيع ${f.flock_code}: مزرعة غير موجودة`);if(!state.houses.some(x=>x.id===f.house_id))issues.push(`قطيع ${f.flock_code}: عنبر غير موجود`);});
  state.daily_reports.forEach(r=>{if(r.closing_birds!==Math.max(0,r.opening_birds-r.mortality-r.culls))issues.push(`تقرير ${r.report_number}: معادلة العدد غير متطابقة`);if(r.feed_closing_kg<0)issues.push(`تقرير ${r.report_number}: رصيد علف سالب`);});
  state.purchase_orders.forEach(po=>{const req=state.requirements.find(r=>r.id===po.requirement_id);if(!req)issues.push(`أمر شراء ${po.po_number}: الاحتياج غير موجود`);if(req?.finance_status!=='approved')issues.push(`أمر شراء ${po.po_number}: بدون اعتماد مالي`);}); state.poultry_sales.forEach(s=>{if(s.status!=='cancelled'&&s.owner_decision==='rejected')issues.push(`بيع ${s.sale_number}: حالة غير متوافقة مع رفض المالك`);}); return issues;
}
