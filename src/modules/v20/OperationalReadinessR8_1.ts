import { FACTORY_FULL_SCREENS_V2029 } from './FactoryFullScreenRegistryV20_2_9';
import { FARM_DIVISION_SCREENS_V2029 } from './FarmDivisionScreenRegistryV20_2_9';
import { FARM_R6_CRITICAL_DESTINATIONS } from './FarmWindowsRoleCompletionR6';

/**
 * AviNexus Windows R8.1 — Operational Readiness, Scientific AI & Full Closure
 * Cross-cutting operational layer. It does not create a new business department.
 * Protected ownership: S7 inventory, S12 accounting, S11 payroll, S14 reports, S15 governance.
 */

export type R81Language = 'ar'|'en'|'bilingual';
export type R81EntityPurpose = 'farm'|'rented_poultry_house'|'factory'|'office'|'company'|'market'|'branch'|'laboratory'|'feed_mill'|'hatchery'|'supplier'|'veterinary_service'|'warehouse'|'transport'|'marketing';
export type R81RegionStatus = 'active'|'inactive'|'archived'|'merged';
export type R81HouseType = 'open_sided'|'semi_open'|'closed'|'controlled_environment';
export type R81EquipmentCategory = 'feeder'|'drinker'|'water_tank'|'pump'|'filter'|'fan'|'cooling_pad'|'heater'|'brooder'|'curtain'|'sensor'|'thermometer'|'hygrometer'|'generator'|'solar'|'lighting'|'scale'|'disinfection'|'sprayer'|'footbath'|'washer'|'storage'|'feed_silo'|'medicine_refrigerator'|'vaccination'|'emergency';
export type R81KnowledgeStatus = 'extracted'|'normalized'|'expert_review'|'approved'|'active'|'retired';
export type R81DiseaseAlertStatus = 'detected'|'acknowledged'|'investigating'|'containment'|'clinical_decision'|'monitoring'|'closed'|'post_event_review';
export type R81AcceptanceState = 'not_checked'|'pass'|'fail'|'blocked';
export type R81ClosureBucket = 'broken'|'incomplete'|'poor_ux'|'required_for_existing_workflow';

export interface R81GeoNode {
  id:string; type:'country'|'governorate'|'district'|'locality'|'site'; parent_id?:string;
  code:string; name_ar:string; name_en:string; status:R81RegionStatus; purposes:R81EntityPurpose[];
  latitude?:number; longitude?:number; elevation_m?:number; climate_profile?:string;
  effective_from:string; archived_reason?:string; merged_into_id?:string; history:string[];
}

export interface R81RegionalProtocol {
  id:string; region_id:string; type:'vaccination'|'biosecurity'|'nutrition'|'environment'|'disease_risk'|'treatment_reference';
  name_ar:string; name_en:string; version:number; status:'draft'|'approved'|'active'|'retired';
  effective_from:string; effective_to?:string; approved_by?:string; notes:string;
  requires_veterinary_authority:boolean;
}

export interface R81PoultrySite {
  id:string; code:string; name_ar:string; name_en:string; purpose:'farm'|'rented_poultry_house'; owner_party_id?:string;
  governorate_id:string; district_id?:string; locality_id?:string; full_address:string; latitude?:number; longitude?:number; elevation_m?:number;
  access_road_notes?:string; surrounding_poultry_density:'unknown'|'low'|'medium'|'high'; status:'draft'|'active'|'suspended'|'archived';
  created_at:string; updated_at:string;
}

export interface R81HouseProfile {
  id:string; site_id:string; code:string; name:string; house_type:R81HouseType; length_m:number; width_m:number; height_m:number;
  usable_floor_area_m2:number; orientation_degrees?:number; construction_type:string; insulation:string;
  curtain_sides:string[]; curtain_mechanism:'manual'|'motorized'|'none'; litter_system:string;
  feed_storage_area_m2:number; feed_storage_capacity_kg:number; water_source:string; water_tank_capacity_l:number;
  filtration:boolean; water_treatment:boolean; emergency_water:boolean; emergency_power:boolean;
  monitoring_mode:'manual'|'sensor'|'hybrid'; status:'active'|'maintenance'|'inactive';
}

export interface R81EquipmentAsset {
  id:string; site_id:string; house_id?:string; category:R81EquipmentCategory; subtype:string; manufacturer?:string; model?:string;
  quantity:number; capacity_value?:number; capacity_unit?:string; spacing_m?:number; operating_status:'operational'|'maintenance'|'fault'|'inactive';
  last_inspection_at?:string; next_maintenance_at?:string; notes?:string;
}

export interface R81WeatherSnapshot {
  id:string; site_id:string; provider:'manual'|'open_meteo'|'sensor'|'cached_provider'; captured_at:string; forecast_for?:string;
  outdoor_temperature_c?:number; humidity_pct?:number; wind_speed_kph?:number; wind_direction_deg?:number; precipitation_mm?:number;
  severe_weather?:string; source_quality:'measured'|'provider'|'manual'|'estimated'; stale:boolean;
}

export interface R81HouseEnvironmentReading {
  id:string; site_id:string; house_id:string; flock_cycle_id?:string; captured_at:string; source:'manual'|'sensor';
  temperature_c?:number; humidity_pct?:number; ammonia_ppm?:number; curtain_open_pct?:number; active_fans?:number; heater_state?:'off'|'partial'|'on'; notes?:string;
}

export interface R81FlockContext {
  id:string; farm_id:string; site_id:string; house_id:string; flock_cycle_id:string; flock_code:string; strain:string; age_days:number;
  initial_population:number; current_population:number; status:'active'|'closed'; feed_phase:'starter'|'grower'|'finisher'|'other';
  vaccination_status:'on_schedule'|'overdue'|'incomplete'|'not_configured'; biosecurity_score?:number; current_avg_weight_g?:number;
}

export interface R81ScientificKnowledgeRule {
  id:string; domain:'biosecurity'|'nutrition'|'environment'|'equipment'|'clinical'|'vaccination'|'water'|'production';
  name_ar:string; name_en:string; kind:'fact'|'equation'|'threshold'|'sop'|'reference'; status:R81KnowledgeStatus; version:number;
  source_type:'approved_document'|'breed_manual'|'scientific_reference'|'company_sop'|'expert_rule'|'provider'; source_ref:string; source_page?:string;
  applies_to:string[]; expression?:string; inputs?:string[]; output_unit?:string; reviewed_by?:string; approved_at?:string;
  veterinarian_required:boolean; notes:string;
}

export interface R81DiseaseAlert {
  id:string; alert_number:string; farm_id:string; site_id:string; house_id:string; flock_cycle_id:string; detected_at:string;
  severity:'info'|'warning'|'high'|'critical'; status:R81DiseaseAlertStatus; triggers:string[]; ai_summary:string; evidence_refs:string[];
  assigned_role:'supervisor'|'farm_manager'|'doctor'|'consultant'|'laboratory'|'regional_manager'; assigned_user_id?:string;
  acknowledgement_at?:string; clinical_decision_id?:string; containment_actions:string[]; withdrawal_restrictions:string[]; history:string[];
}

export interface R81ActionContract {
  id:string; action_code:string; label_ar:string; label_en:string; domain:string; allowed_roles:string[]; required_context:string[];
  required_fields:string[]; validations:string[]; mutation:string; destination:string; downstream_handoffs:string[]; notifications:string[];
  audit_event:string; failure_behavior:string; clinical_authority_required:boolean;
}

export interface R81NavigationDestination {
  id:string; group:'my_work'|'farm'|'veterinary'|'factory'|'commercial'|'finance'|'regional'|'reports'|'administration';
  label_ar:string; label_en:string; legacy_section?:string; search_terms:string[]; roles:string[];
}

export interface R81ScreenAcceptance {
  id:string; screen_code:string; screen_name:string; domain:string; bucket?:R81ClosureBucket;
  opens:R81AcceptanceState; role_access:R81AcceptanceState; entity_scope:R81AcceptanceState; fields:R81AcceptanceState; validation:R81AcceptanceState;
  save:R81AcceptanceState; history:R81AcceptanceState; search_filter:R81AcceptanceState; actions:R81AcceptanceState; handoff:R81AcceptanceState;
  ai_context:R81AcceptanceState; attachments:R81AcceptanceState; print_export:R81AcceptanceState; restart_persistence:R81AcceptanceState;
  field_ux:R81AcceptanceState; notes:string[];
}

export interface R81AIInsight {
  id:string; created_at:string; scope:{region_id?:string;site_id?:string;house_id?:string;flock_cycle_id?:string}; severity:'normal'|'attention'|'high'|'critical';
  title_ar:string; title_en:string; observations:string[]; calculations:Record<string,number|string>; missing_data:string[]; next_actions:string[];
  requires_veterinarian:boolean; provenance:string[];
}

export interface OperationalReadinessStateR81 {
  version:'R8.1'; release_name:string; language:R81Language; scope_freeze:true; android_deferred:true;
  ownership:{inventory:'S7';accounting:'S12';payroll:'S11';reports:'S14';governance:'S15'};
  geography:R81GeoNode[]; regional_protocols:R81RegionalProtocol[]; sites:R81PoultrySite[]; houses:R81HouseProfile[]; equipment:R81EquipmentAsset[];
  weather:R81WeatherSnapshot[]; environment_readings:R81HouseEnvironmentReading[]; flock_contexts:R81FlockContext[];
  scientific_rules:R81ScientificKnowledgeRule[]; disease_alerts:R81DiseaseAlert[]; action_contracts:R81ActionContract[];
  navigation:R81NavigationDestination[]; acceptance:R81ScreenAcceptance[]; ai_insights:R81AIInsight[];
  settings:{weather_provider:'open_meteo'|'manual_only';weather_cache_minutes:number;require_location_for_weather:boolean;unsafe_action_guard:boolean;ai_provenance_required:boolean;clinical_ai_human_in_loop:true;offline_field_queue_required:true;};
}

const now='2026-09-29T18:00:00.000Z';
const govs:[string,string,string][] = [
  ['YE-AD','عدن','Aden'],['YE-AM','عمران','Amran'],['YE-AB','أبين','Abyan'],['YE-BA','البيضاء','Al Bayda'],['YE-DA','الضالع','Al Dhale'],['YE-DH','ذمار','Dhamar'],['YE-HD','حضرموت','Hadramaut'],['YE-HJ','حجة','Hajjah'],['YE-HU','الحديدة','Al Hudaydah'],['YE-IB','إب','Ibb'],['YE-JA','الجوف','Al Jawf'],['YE-LA','لحج','Lahij'],['YE-MA','مأرب','Marib'],['YE-MR','المحويت','Al Mahwit'],['YE-RA','ريمة','Raymah'],['YE-SA','صعدة','Saada'],['YE-SN','صنعاء','Sana\'a'],['YE-SC','أرخبيل سقطرى','Socotra'],['YE-SH','شبوة','Shabwah'],['YE-TA','تعز','Taiz'],['YE-MW','المهرة','Al Mahrah'],['YE-AS','أمانة العاصمة','Amanat Al Asimah']
];

const geographySeed:R81GeoNode[] = [
  {id:'country-ye',type:'country',code:'YE',name_ar:'اليمن',name_en:'Yemen',status:'active',purposes:['farm','factory','office','company','market','branch','laboratory','feed_mill','hatchery','supplier','veterinary_service','warehouse','transport','marketing'],effective_from:'2026-01-01',history:['Seeded as configurable country master.']},
  ...govs.map(([code,ar,en],i)=>({id:`gov-${String(i+1).padStart(2,'0')}`,type:'governorate' as const,parent_id:'country-ye',code,name_ar:ar,name_en:en,status:'active' as const,purposes:['farm','rented_poultry_house','office','factory','branch','market','laboratory','feed_mill','hatchery','supplier','veterinary_service','transport','marketing'] as R81EntityPurpose[],effective_from:'2026-01-01',history:['Initial configurable governorate seed; may be renamed/merged/archived by authorized governance.']}))
];
const govId=(code:string)=>geographySeed.find(x=>x.code===code)?.id||'gov-17';

const actionContracts:R81ActionContract[] = [
  {id:'act-daily-close',action_code:'FARM_DAILY_CLOSE',label_ar:'إقفال السجل اليومي',label_en:'Close Daily Record',domain:'farm',allowed_roles:['worker','supervisor','farm_manager'],required_context:['farm','house','active_cycle','date'],required_fields:['opening_population','mortality','feed','water','environment'],validations:['population_reconciliation','nonnegative_values','idempotency'],mutation:'append_daily_record_and_population_events',destination:'daily-review',downstream_handoffs:['supervisor_review','ai_analysis'],notifications:['supervisor_if_anomaly'],audit_event:'farm.daily.closed',failure_behavior:'save_draft_and_show_validation',clinical_authority_required:false},
  {id:'act-treatment',action_code:'VET_APPROVE_TREATMENT',label_ar:'اعتماد القرار العلاجي',label_en:'Approve Treatment Decision',domain:'veterinary',allowed_roles:['field_vet','vet_consultant'],required_context:['farm','house','active_cycle','clinical_case'],required_fields:['clinical_findings','decision','instructions'],validations:['authorized_veterinarian','active_case','withdrawal_policy','medicine_reference'],mutation:'version_clinical_decision',destination:'treatment-plan',downstream_handoffs:['worker_tasks','inventory_request','withdrawal_control'],notifications:['farm_manager','supervisor'],audit_event:'clinical.treatment.approved',failure_behavior:'block_approval_preserve_draft',clinical_authority_required:true},
  {id:'act-vaccine',action_code:'VET_CONFIRM_VACCINATION',label_ar:'اعتماد خطة/تنفيذ التحصين',label_en:'Approve/Confirm Vaccination',domain:'vaccination',allowed_roles:['field_vet','vet_consultant'],required_context:['farm','house','active_cycle'],required_fields:['vaccine','schedule','route','lot_if_administered'],validations:['authorized_veterinarian','cold_chain_if_applicable','cycle_age'],mutation:'version_vaccination_event',destination:'vaccination-history',downstream_handoffs:['worker_task','inventory_consumption_on_administration'],notifications:['farm_manager'],audit_event:'clinical.vaccination.confirmed',failure_behavior:'block_approval_preserve_draft',clinical_authority_required:true},
  {id:'act-alert-ack',action_code:'DISEASE_ALERT_ACK',label_ar:'استلام تنبيه مرضي',label_en:'Acknowledge Disease Alert',domain:'disease_alert',allowed_roles:['supervisor','farm_manager','field_vet','vet_consultant','sector_manager'],required_context:['disease_alert'],required_fields:['acknowledgement'],validations:['assigned_scope'],mutation:'append_alert_status_acknowledged',destination:'disease-alert',downstream_handoffs:['investigation'],notifications:['assigned_team'],audit_event:'disease_alert.acknowledged',failure_behavior:'deny_out_of_scope',clinical_authority_required:false},
  {id:'act-grn',action_code:'CONFIRM_MATERIAL_RECEIPT',label_ar:'تأكيد استلام المواد',label_en:'Confirm Material Receipt',domain:'factory',allowed_roles:['receiving','warehouse','factory_manager'],required_context:['purchase_order','supplier'],required_fields:['received_quantity','date','receiver'],validations:['po_open','sent_vs_received_variance'],mutation:'create_grn_then_s7_inventory_event',destination:'grn-detail',downstream_handoffs:['S7','quality','S12_match'],notifications:['procurement','accounting_on_approval'],audit_event:'factory.material.received',failure_behavior:'hold_receipt_for_review',clinical_authority_required:false},
  {id:'act-production',action_code:'FINALIZE_PRODUCTION_ACTUAL',label_ar:'اعتماد الإنتاج الفعلي',label_en:'Finalize Production Actual',domain:'factory',allowed_roles:['production_operator','production_planner','factory_manager'],required_context:['work_order'],required_fields:['actual_material_used','actual_output','timestamp'],validations:['work_order_active','variance_calculated','no_double_consumption'],mutation:'post_actual_then_S7_consumption_and_output',destination:'production-actual',downstream_handoffs:['S7','quality','S12_costing'],notifications:['factory_manager_if_variance'],audit_event:'factory.production.actual_finalized',failure_behavior:'keep_draft_variance_review',clinical_authority_required:false},
  {id:'act-finance',action_code:'POST_FINANCIAL_DOCUMENT',label_ar:'ترحيل المستند المالي',label_en:'Post Financial Document',domain:'finance',allowed_roles:['finance','accountant'],required_context:['legal_entity','document'],required_fields:['document_number','currency','counterparty','lines'],validations:['balanced_document','currency_precision','approval_limit'],mutation:'S12_posting_only',destination:'financial-document',downstream_handoffs:['treasury_if_payable'],notifications:['requester'],audit_event:'S12.document.posted',failure_behavior:'preserve_unposted_document',clinical_authority_required:false}
];

const navigationSeed:R81NavigationDestination[] = [
  {id:'nav-mywork',group:'my_work',label_ar:'مساحة عملي',label_en:'My Work',legacy_section:'tasks',search_terms:['tasks','approvals','alerts','مهامي','الموافقات','التنبيهات'],roles:['*']},
  {id:'nav-farm',group:'farm',label_ar:'المزارع والقطعان',label_en:'Farms & Flocks',legacy_section:'farm_operations',search_terms:['farm','house','flock','cycle','مزرعة','عنبر','قطيع','دورة'],roles:['system_owner','ceo','sector_manager','farmer','farm_manager','supervisor','worker','field_vet','vet_consultant','finance','laboratory']},
  {id:'nav-vet',group:'veterinary',label_ar:'الطب البيطري والتنبيهات',label_en:'Veterinary & Disease Alerts',legacy_section:'clinical_ops',search_terms:['vet','disease','alert','lab','vaccine','طبيب','مرض','تنبيه','مختبر','تحصين'],roles:['system_owner','ceo','sector_manager','field_vet','vet_consultant','laboratory','supervisor','farmer']},
  {id:'nav-factory',group:'factory',label_ar:'المصنع والإنتاج',label_en:'Factory & Production',legacy_section:'factory_v2024',search_terms:['factory','production','formula','inventory','مصنع','انتاج','تركيبة','مخزون'],roles:['system_owner','ceo','sector_manager','finance','warehouse','supplier']},
  {id:'nav-network',group:'commercial',label_ar:'المكاتب والعملاء والشركاء',label_en:'Offices, Customers & Partners',legacy_section:'network_r7',search_terms:['office','customer','partner','contract','مكتب','عميل','شريك','عقد'],roles:['system_owner','ceo','sector_manager','finance','marketing','supplier','farmer','support']},
  {id:'nav-finance',group:'finance',label_ar:'المالية والمحاسبة',label_en:'Finance & Accounting',legacy_section:'finance',search_terms:['finance','accounting','payment','receipt','مالية','محاسبة','دفع','سند'],roles:['system_owner','ceo','finance']},
  {id:'nav-regional',group:'regional',label_ar:'المناطق والمحافظات',label_en:'Regions & Governorates',search_terms:['region','governorate','weather','محافظة','منطقة','طقس'],roles:['system_owner','ceo','sector_manager']},
  {id:'nav-reports',group:'reports',label_ar:'التقارير والطباعة',label_en:'Reports & Printing',legacy_section:'reports',search_terms:['report','print','document','تقرير','طباعة','مستند'],roles:['*']},
  {id:'nav-admin',group:'administration',label_ar:'الإعدادات والحوكمة',label_en:'Settings & Governance',legacy_section:'organization',search_terms:['settings','governance','permissions','إعدادات','حوكمة','صلاحيات'],roles:['system_owner','ceo']}
];

const baseAcceptance=(screen_code:string,screen_name:string,domain:string):R81ScreenAcceptance=>({id:`acc-${screen_code}`,screen_code,screen_name,domain,opens:'not_checked',role_access:'not_checked',entity_scope:'not_checked',fields:'not_checked',validation:'not_checked',save:'not_checked',history:'not_checked',search_filter:'not_checked',actions:'not_checked',handoff:'not_checked',ai_context:'not_checked',attachments:'not_checked',print_export:'not_checked',restart_persistence:'not_checked',field_ux:'not_checked',notes:[]});

function fullAcceptanceRegistryR81():R81ScreenAcceptance[] {
  const r81=[
    baseAcceptance('R81-HOME','Operational Readiness Command Center','platform'),
    baseAcceptance('R81-GEO','Geography & Governorate Control','regional'),
    baseAcceptance('R81-SITE','Site / Poultry House Profile','farm'),
    baseAcceptance('R81-WEATHER','Weather & Climate Intelligence','farm'),
    baseAcceptance('R81-AI','AviNexus Scientific Intelligence','ai'),
    baseAcceptance('R81-DISEASE','Disease Alert Center','veterinary'),
    baseAcceptance('R81-ACTIONS','Button / Action Closure Audit','governance'),
    baseAcceptance('R81-ACCEPT','R8.1 Acceptance Matrix','governance'),
    baseAcceptance('R81-SETTINGS','الإعدادات | Settings','administration')
  ];
  const factory=FACTORY_FULL_SCREENS_V2029.map(screen=>({
    ...baseAcceptance(`FACTORY-${screen.code}`,`${screen.name_ar} | ${screen.name_en}`,`factory-s${screen.section}`),
    notes:[`Preserved Factory screen ${screen.code}; source registry is active. Visible Windows acceptance remains required.`]
  }));
  const farm=FARM_DIVISION_SCREENS_V2029.map(screen=>({
    ...baseAcceptance(`FARM-${screen.code}`,`${screen.name_ar} | ${screen.name_en}`,`farm-s${screen.section}`),
    notes:[`Preserved Farm screen ${screen.code}; route ${screen.route} and capabilities are registered. Visible role acceptance remains required.`]
  }));
  const r6=FARM_R6_CRITICAL_DESTINATIONS.map(([code,name])=>({
    ...baseAcceptance(`FARM-R6-${code}`,String(name),'farm-role-workflow'),
    notes:[`Preserved R6 critical destination ${code}; visible role/handoff acceptance remains required.`]
  }));
  return [...r81,...factory,...farm,...r6];
}


export function defaultOperationalReadinessR81():OperationalReadinessStateR81 {
  const sanaa=govId('YE-SN');
  const taiz=govId('YE-TA');
  return {
    version:'R8.1',release_name:'AviNexus Windows R8.1 — Operational Readiness, Scientific AI & Full Closure',language:'bilingual',scope_freeze:true,android_deferred:true,
    ownership:{inventory:'S7',accounting:'S12',payroll:'S11',reports:'S14',governance:'S15'},
    geography:geographySeed,
    regional_protocols:[
      {id:'rp-sanaa-bio-1',region_id:sanaa,type:'biosecurity',name_ar:'الخط الأساس للأمان الحيوي',name_en:'Biosecurity Baseline',version:1,status:'active',effective_from:'2026-09-01',approved_by:'Governance/Veterinary',notes:'Regional baseline; farm and flock context may require stricter controls.',requires_veterinary_authority:false},
      {id:'rp-sanaa-vax-1',region_id:sanaa,type:'vaccination',name_ar:'مرجع التحصين الإقليمي',name_en:'Regional Vaccination Reference',version:1,status:'approved',effective_from:'2026-09-01',approved_by:'Authorized Veterinarian',notes:'Reference baseline only. Actual flock program remains veterinarian-governed.',requires_veterinary_authority:true},
      {id:'rp-taiz-env-1',region_id:taiz,type:'environment',name_ar:'إدارة البيئة للمساكن المفتوحة',name_en:'Open-house Environment Baseline',version:1,status:'active',effective_from:'2026-09-01',approved_by:'Poultry Operations',notes:'Uses site weather, house orientation and live/manual readings.',requires_veterinary_authority:false}
    ],
    sites:[{id:'site-demo-sanaa',code:'SITE-SN-001',name_ar:'مزرعة أفي نيكسس التجريبية - صنعاء',name_en:'AviNexus Test Farm - Sana\'a',purpose:'farm',governorate_id:sanaa,full_address:'بيانات اختبار تشغيلية — يحدد العنوان الحقيقي عند التسجيل',latitude:15.35,longitude:44.2,elevation_m:2200,surrounding_poultry_density:'medium',status:'active',created_at:now,updated_at:now}],
    houses:[{id:'house-demo-1',site_id:'site-demo-sanaa',code:'H-01',name:'House 1 / العنبر 1',house_type:'open_sided',length_m:80,width_m:12,height_m:3.2,usable_floor_area_m2:960,orientation_degrees:90,construction_type:'masonry/steel mixed',insulation:'basic',curtain_sides:['north','south'],curtain_mechanism:'manual',litter_system:'deep_litter',feed_storage_area_m2:30,feed_storage_capacity_kg:12000,water_source:'tank/well',water_tank_capacity_l:10000,filtration:true,water_treatment:true,emergency_water:true,emergency_power:true,monitoring_mode:'hybrid',status:'active'}],
    equipment:[
      {id:'eq-drink-1',site_id:'site-demo-sanaa',house_id:'house-demo-1',category:'drinker',subtype:'nipple automatic',quantity:120,capacity_value:80,capacity_unit:'birds/line-point',operating_status:'operational',notes:'Test configuration; validate against approved equipment rule.'},
      {id:'eq-feed-1',site_id:'site-demo-sanaa',house_id:'house-demo-1',category:'feeder',subtype:'pan automatic',quantity:160,operating_status:'operational'},
      {id:'eq-heat-1',site_id:'site-demo-sanaa',house_id:'house-demo-1',category:'heater',subtype:'gas brooder',quantity:8,capacity_value:120,capacity_unit:'m2/unit',operating_status:'operational'},
      {id:'eq-fan-1',site_id:'site-demo-sanaa',house_id:'house-demo-1',category:'fan',subtype:'exhaust fan',quantity:6,capacity_value:18000,capacity_unit:'m3/h',operating_status:'operational'},
      {id:'eq-therm-1',site_id:'site-demo-sanaa',house_id:'house-demo-1',category:'thermometer',subtype:'digital thermometer',quantity:3,operating_status:'operational'},
      {id:'eq-gen-1',site_id:'site-demo-sanaa',category:'generator',subtype:'backup generator',quantity:1,capacity_value:30,capacity_unit:'kVA',operating_status:'operational'}
    ],
    weather:[{id:'wx-demo-1',site_id:'site-demo-sanaa',provider:'manual',captured_at:now,outdoor_temperature_c:25,humidity_pct:46,wind_speed_kph:11,wind_direction_deg:65,source_quality:'manual',stale:false}],
    environment_readings:[{id:'env-demo-1',site_id:'site-demo-sanaa',house_id:'house-demo-1',flock_cycle_id:'cycle-demo-1',captured_at:now,source:'manual',temperature_c:28,humidity_pct:58,curtain_open_pct:60,active_fans:2,heater_state:'off',notes:'Acceptance seed reading'}],
    flock_contexts:[{id:'flockctx-demo-1',farm_id:'farm-demo-1',site_id:'site-demo-sanaa',house_id:'house-demo-1',flock_cycle_id:'cycle-demo-1',flock_code:'ROSS308-SN-001',strain:'Ross 308',age_days:14,initial_population:10000,current_population:9925,status:'active',feed_phase:'starter',vaccination_status:'on_schedule',biosecurity_score:82,current_avg_weight_g:475}],
    scientific_rules:[
      {id:'rule-fcr-1',domain:'nutrition',name_ar:'معامل التحويل الغذائي',name_en:'Feed Conversion Ratio',kind:'equation',status:'active',version:1,source_type:'approved_document',source_ref:'Poultry equations / nutrition references',applies_to:['broiler'],expression:'feed_consumed_kg / live_weight_gain_kg',inputs:['feed_consumed_kg','live_weight_gain_kg'],output_unit:'kg/kg',reviewed_by:'Pending final named specialist assignment',veterinarian_required:false,notes:'Executable only after approved input provenance is available.'},
      {id:'rule-mort-1',domain:'production',name_ar:'نسبة النفوق',name_en:'Mortality Rate',kind:'equation',status:'active',version:1,source_type:'expert_rule',source_ref:'AviNexus canonical population model',applies_to:['broiler','layer','breeder'],expression:'mortality / opening_population * 100',inputs:['mortality','opening_population'],output_unit:'%',reviewed_by:'AviNexus governance',approved_at:now,veterinarian_required:false,notes:'Operational metric; clinical meaning requires context.'},
      {id:'rule-water-biofilm',domain:'water',name_ar:'مخاطر تلوث خطوط المياه',name_en:'Water-line Biofilm Risk',kind:'reference',status:'expert_review',version:1,source_type:'approved_document',source_ref:'Biosecurity Guide Arabic',source_page:'Water line sanitation section',applies_to:['poultry_house'],reviewed_by:'Pending expert validation',veterinarian_required:false,notes:'Used as supporting evidence, not a diagnosis.'}
    ],
    disease_alerts:[{id:'da-demo-1',alert_number:'DA-2026-0001',farm_id:'farm-demo-1',site_id:'site-demo-sanaa',house_id:'house-demo-1',flock_cycle_id:'cycle-demo-1',detected_at:now,severity:'warning',status:'detected',triggers:['acceptance_test_seed'],ai_summary:'Acceptance seed alert to verify routing, acknowledgement, investigation and veterinary handoff.',evidence_refs:[],assigned_role:'supervisor',containment_actions:[],withdrawal_restrictions:[],history:['Created as realistic acceptance data.']}],
    action_contracts:actionContracts,
    navigation:navigationSeed,
    acceptance:fullAcceptanceRegistryR81(),
    ai_insights:[],
    settings:{weather_provider:'open_meteo',weather_cache_minutes:30,require_location_for_weather:true,unsafe_action_guard:true,ai_provenance_required:true,clinical_ai_human_in_loop:true,offline_field_queue_required:true}
  };
}

export function buildOperationalReadinessR81(input?:Partial<OperationalReadinessStateR81>):OperationalReadinessStateR81 {
  const base=defaultOperationalReadinessR81();
  if(!input) return base;
  return {
    ...base,...input,version:'R8.1',scope_freeze:true,android_deferred:true,
    ownership:{...base.ownership,...(input.ownership||{})},
    geography:input.geography?.length?input.geography:base.geography,
    regional_protocols:input.regional_protocols||base.regional_protocols,
    sites:input.sites||base.sites,houses:input.houses||base.houses,equipment:input.equipment||base.equipment,
    weather:input.weather||base.weather,environment_readings:input.environment_readings||base.environment_readings,flock_contexts:input.flock_contexts||base.flock_contexts,
    scientific_rules:input.scientific_rules||base.scientific_rules,disease_alerts:input.disease_alerts||base.disease_alerts,action_contracts:input.action_contracts?.length?input.action_contracts:base.action_contracts,
    navigation:input.navigation?.length?input.navigation:base.navigation,acceptance:input.acceptance?.length?input.acceptance:base.acceptance,ai_insights:input.ai_insights||base.ai_insights,
    settings:{...base.settings,...(input.settings||{})}
  };
}

export function archiveRegionR81(state:OperationalReadinessStateR81,regionId:string,reason:string):OperationalReadinessStateR81 {
  const referenced=state.sites.some(x=>x.governorate_id===regionId)||state.regional_protocols.some(x=>x.region_id===regionId);
  return {...state,geography:state.geography.map(x=>x.id===regionId?{...x,status:'archived',archived_reason:reason||'Archived by authorized governance',history:[...x.history,`${new Date().toISOString()}: archived${referenced?' with preserved historical references':''}: ${reason||'no reason supplied'}`]}:x)};
}

export function calculateR81(ruleId:string,inputs:Record<string,number>):number {
  if(ruleId==='rule-fcr-1'){
    if(!(inputs.feed_consumed_kg>0)||!(inputs.live_weight_gain_kg>0)) throw new Error('Valid feed consumed and live weight gain are required.');
    return Number((inputs.feed_consumed_kg/inputs.live_weight_gain_kg).toFixed(3));
  }
  if(ruleId==='rule-mort-1'){
    if(!(inputs.opening_population>0)||inputs.mortality<0) throw new Error('Valid opening population and mortality are required.');
    return Number((inputs.mortality/inputs.opening_population*100).toFixed(3));
  }
  throw new Error('Equation is not activated in the deterministic engine.');
}

export function analyzeOperationalContextR81(state:OperationalReadinessStateR81,flockCycleId:string):R81AIInsight {
  const flock=state.flock_contexts.find(x=>x.flock_cycle_id===flockCycleId);
  if(!flock) throw new Error('Flock context is required before AI analysis.');
  const site=state.sites.find(x=>x.id===flock.site_id); const house=state.houses.find(x=>x.id===flock.house_id);
  const wx=[...state.weather].filter(x=>x.site_id===flock.site_id).sort((a,b)=>b.captured_at.localeCompare(a.captured_at))[0];
  const env=[...state.environment_readings].filter(x=>x.house_id===flock.house_id).sort((a,b)=>b.captured_at.localeCompare(a.captured_at))[0];
  const observations:string[]=[]; const missing:string[]=[]; const next:string[]=[]; const provenance:string[]=[];
  if(site) provenance.push(`site:${site.code}`); if(wx) provenance.push(`weather:${wx.provider}:${wx.captured_at}`); if(env) provenance.push(`house_environment:${env.source}:${env.captured_at}`); provenance.push(`flock:${flock.flock_code}`);
  if(!site?.latitude||!site?.longitude) missing.push('site_coordinates');
  if(env?.temperature_c==null) missing.push('indoor_temperature');
  if(env?.humidity_pct==null) missing.push('indoor_humidity');
  if(wx?.wind_direction_deg==null) missing.push('wind_direction');
  if(flock.vaccination_status==='overdue'||flock.vaccination_status==='incomplete'){observations.push(`Vaccination status: ${flock.vaccination_status}`);next.push('Escalate vaccination review to authorized veterinarian.');}
  if((flock.biosecurity_score??100)<70){observations.push(`Biosecurity score is ${flock.biosecurity_score??'unknown'}.`);next.push('Create corrective biosecurity tasks and supervisor review.');}
  if(house?.house_type==='open_sided'){
    observations.push('Open-sided house: wind, curtains and manual/sensor readings must be interpreted together.');
    if((env?.curtain_open_pct??-1)<0) missing.push('curtain_position');
    if(wx?.wind_speed_kph!=null&&wx.wind_speed_kph>=25) next.push('Review curtain/fan configuration against actual wind direction before changing ventilation.');
  }
  if(env?.temperature_c!=null&&wx?.outdoor_temperature_c!=null&&Math.abs(env.temperature_c-wx.outdoor_temperature_c)>=8){observations.push(`Indoor/outdoor temperature delta is ${Math.abs(env.temperature_c-wx.outdoor_temperature_c).toFixed(1)}°C.`);}
  const severity: R81AIInsight['severity'] = flock.vaccination_status==='overdue'?'high':missing.length>=4?'attention':observations.length>=3?'attention':'normal';
  return {id:`insight-${Date.now()}`,created_at:new Date().toISOString(),scope:{region_id:site?.governorate_id,site_id:site?.id,house_id:house?.id,flock_cycle_id:flockCycleId},severity,title_ar:'تحليل تشغيلي علمي للسياق الحالي',title_en:'Scientific Operational Context Analysis',observations,calculations:{age_days:flock.age_days,current_population:flock.current_population,avg_weight_g:flock.current_avg_weight_g??'missing'},missing_data:missing,next_actions:next,requires_veterinarian:flock.vaccination_status==='overdue'||flock.vaccination_status==='incomplete',provenance};
}

export function validateOperationalReadinessR81(state:OperationalReadinessStateR81):string[] {
  const issues:string[]=[];
  if(state.ownership.inventory!=='S7')issues.push('inventory_owner_must_be_S7');
  if(state.ownership.accounting!=='S12')issues.push('accounting_owner_must_be_S12');
  if(!state.geography.some(x=>x.type==='governorate'&&x.status==='active'))issues.push('active_governorate_required');
  for(const site of state.sites.filter(x=>x.status==='active')){
    if(!state.geography.some(g=>g.id===site.governorate_id&&g.status==='active'))issues.push(`site_region_invalid:${site.id}`);
    if(state.settings.require_location_for_weather&&(site.latitude==null||site.longitude==null))issues.push(`site_coordinates_missing:${site.id}`);
  }
  for(const flock of state.flock_contexts.filter(x=>x.status==='active')){
    if(!state.houses.some(h=>h.id===flock.house_id&&h.status==='active'))issues.push(`active_flock_house_invalid:${flock.id}`);
  }
  if(!state.action_contracts.some(x=>x.action_code==='VET_APPROVE_TREATMENT'&&x.clinical_authority_required))issues.push('veterinary_action_contract_missing');
  if(!state.settings.clinical_ai_human_in_loop)issues.push('clinical_human_in_loop_must_remain_true');
  return issues;
}
