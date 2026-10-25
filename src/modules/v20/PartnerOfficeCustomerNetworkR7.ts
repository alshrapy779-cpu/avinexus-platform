export type R7PartyKind='marketing_company'|'company'|'distributor'|'feed_mill'|'medicine_supplier'|'vaccine_supplier'|'hatchery'|'laboratory'|'transport_provider'|'marketing_office'|'equipment_supplier'|'platform_office'|'other';
export type R7CustomerJourney='retail'|'guest'|'managed_farm'|'farm_owner_seller'|'marketing_partner';
export type R7Currency='SAR'|'USD'|'YER_NEW'|'YER_OLD';
export type R7Status='active'|'suspended'|'archived'|'draft';

export interface R7CustomerRelationship{ id:string; party_name:string; phone:string; journey:R7CustomerJourney; office_id?:string; farm_ids:string[]; governorate?:string; district?:string; address?:string; whatsapp?:string; preferred_currency:R7Currency; credit_days:number; active:boolean; created_at:string; }
export interface R7Office{ id:string; code:string; name:string; office_type:'platform'|'managed_farm'|'medicine'|'feed'|'equipment'|'chick'|'marketing'|'warehouse'|'laboratory'|'mixed'; governorate:string; district:string; address:string; phone:string; whatsapp?:string; lat?:number; lng?:number; manager_name:string; responsible_roles:string[]; warehouse_ids:string[]; cost_center_code?:string; status:R7Status; }
export interface R7PartnerOrganization{ id:string; code:string; name:string; kind:R7PartyKind; commercial_registration?:string; tax_number?:string; contact_name:string; phone:string; whatsapp?:string; email?:string; governorates_served:string[]; payment_terms:string; credit_days:number; preferred_currency:R7Currency; status:R7Status; contract_ids:string[]; branch_ids:string[]; attachments:string[]; }
export interface R7PartnerBranch{ id:string; organization_id:string; name:string; governorate:string; district:string; address:string; phone:string; whatsapp?:string; lat?:number; lng?:number; working_hours:string; responsible_person:string; service_area:string[]; cold_chain_capable:boolean; warehouse_id?:string; status:R7Status; }
export interface R7CommercialContract{ id:string; contract_number:string; organization_id:string; office_id?:string; title:string; start_date:string; end_date?:string; payment_terms:string; credit_days:number; currencies:R7Currency[]; tax_percent:number; delivery_terms:string; transport_terms:string; minimum_order_note?:string; attachment_refs:string[]; status:'draft'|'active'|'expired'|'terminated'; versions:Array<{version:number;effective_from:string;effective_to?:string;note:string;changed_by:string;changed_at:string}>; }
export interface R7Offer{ id:string; organization_id:string; branch_id?:string; contract_id?:string; sku:string; item_name:string; category:'medicine'|'vaccine'|'feed'|'chick'|'equipment'|'disinfectant'|'feed_additive'|'lab_service'|'transport'|'other'; variant?:string; unit:string; bag_weight_kg?:number; normal_price:number; contract_price:number; currency:R7Currency; min_quantity:number; tax_percent:number; available_quantity?:number; availability:'available'|'limited'|'unavailable'|'on_request'; effective_from:string; effective_to?:string; vet_restriction?:string; cold_chain_required:boolean; public_visible:boolean; status:R7Status; }
export interface R7LabPrice{ id:string; laboratory_id:string; branch_id?:string; contract_id?:string; service_code:string; service_name:string; sample_type:string; normal_price:number; contract_price:number; currency:R7Currency; turnaround_hours:number; linked_catalog_sku?:string; effective_from:string; effective_to?:string; status:R7Status; }
export interface R7RegionalMarket{ id:string; name:string; governorate:string; district?:string; market_type:'poultry_live'|'chicks'|'feed'|'mixed'; phone?:string; address?:string; active:boolean; }
export interface R7MarketPrice{ id:string; market_id:string; date:string; category:'broiler_live_kg'|'chick'|'feed_starter'|'feed_grower'|'feed_finisher'|'other'; value:number; currency:R7Currency; trend:'up'|'stable'|'down'; entered_by:string; }
export interface R7MarketingOffice{ id:string; name:string; governorate:string; district:string; address:string; phone:string; contact_name:string; commission_rule:string; contract_id?:string; status:R7Status; }
export interface R7RouteRequest{ id:string; requested_at:string; requester_name:string; requester_type:'customer'|'farm_manager'|'veterinarian'|'procurement'|'inventory'; governorate:string; district?:string; category:R7Offer['category']; sku?:string; quantity:number; cold_chain_required:boolean; selected_branch_id?:string; selected_offer_id?:string; distance_km?:number; eta_hours?:number; reason?:string; status:'requested'|'routed'|'accepted'|'closed'; }
export interface PartnerOfficeCustomerNetworkR7State{ price_change_history?:Array<{id:string;offer_id:string;at:string;actor_id:string;previous:{organization_id:string;sku:string;item_name:string;category:string;contract_price:number;currency:R7Currency};next:{organization_id:string;sku:string;item_name:string;category:string;contract_price:number;currency:R7Currency}}>; version:'R7'; brand_name:string; brand_name_ar:string; product_owner_name:string; governorates:string[]; customers:R7CustomerRelationship[]; offices:R7Office[]; organizations:R7PartnerOrganization[]; branches:R7PartnerBranch[]; contracts:R7CommercialContract[]; offers:R7Offer[]; lab_prices:R7LabPrice[]; regional_markets:R7RegionalMarket[]; market_prices:R7MarketPrice[]; marketing_offices:R7MarketingOffice[]; route_requests:R7RouteRequest[]; settings:{canonical_office_id_required_for_managed_contracts:boolean;preserve_history:boolean;nearest_branch_uses_geo_when_available:boolean;hide_internal_contract_prices_from_public:boolean;section7_inventory_owner:boolean;section12_accounting_owner:boolean;}; }

const D='2026-09-27T00:00:00+03:00';
export const INITIAL_PARTNER_OFFICE_CUSTOMER_NETWORK_R7:PartnerOfficeCustomerNetworkR7State={
 version:'R7',brand_name:'AviNexus Poultry Enterprise',brand_name_ar:'أفي نيكسس لإدارة الدواجن',product_owner_name:'فارع الفارعي',
 governorates:['أمانة العاصمة','صنعاء','عدن','تعز','الحديدة','إب','ذمار','حجة','عمران','المحويت','ريمة','صعدة','الجوف','مأرب','البيضاء','الضالع','لحج','أبين','شبوة','حضرموت','المهرة','أرخبيل سقطرى'],
 customers:[
  {id:'r7-c-retail',party_name:'عميل متجر نموذجي',phone:'777100001',journey:'retail',farm_ids:[],governorate:'صنعاء',district:'أمانة العاصمة',preferred_currency:'SAR',credit_days:0,active:true,created_at:D},
  {id:'r7-c-managed',party_name:'مالك مزرعة متعاقد',phone:'777100002',journey:'managed_farm',office_id:'r7-off-sanaa',farm_ids:['farm-001'],governorate:'صنعاء',district:'بني حشيش',preferred_currency:'SAR',credit_days:15,active:true,created_at:D},
  {id:'r7-c-seller',party_name:'مالك قطيع للتسويق',phone:'777100003',journey:'farm_owner_seller',office_id:'r7-off-ibb-mkt',farm_ids:[],governorate:'إب',district:'المدينة',preferred_currency:'YER_OLD',credit_days:0,active:true,created_at:D}
 ],
 offices:[
  {id:'r7-off-sanaa',code:'OFF-SA-01',name:'مكتب صنعاء لإدارة المزارع',office_type:'managed_farm',governorate:'صنعاء',district:'أمانة العاصمة',address:'صنعاء - المركز التشغيلي',phone:'777000901',whatsapp:'777000901',lat:15.3694,lng:44.1910,manager_name:'مدير مكتب صنعاء',responsible_roles:['farm_manager','supervisor','veterinarian','accountant','procurement','inventory','marketing'],warehouse_ids:['wh19-sanaa-01'],cost_center_code:'OFF-SA-01',status:'active'},
  {id:'r7-off-ibb-mkt',code:'MKT-IB-01',name:'مكتب إب للتسويق الداجني',office_type:'marketing',governorate:'إب',district:'المدينة',address:'إب - السوق المركزي',phone:'777000902',manager_name:'مسؤول تسويق إب',responsible_roles:['marketing','sales','settlement'],warehouse_ids:[],cost_center_code:'MKT-IB-01',status:'active'}
 ],
 organizations:[
  {id:'r7-org-vac',code:'VAC-CO-01',name:'شركة لقاحات متعاقدة',kind:'vaccine_supplier',contact_name:'مسؤول التوريد',phone:'771111111',whatsapp:'771111111',governorates_served:['صنعاء','ذمار','عمران'],payment_terms:'حسب العقد',credit_days:30,preferred_currency:'SAR',status:'active',contract_ids:['r7-ctr-vac'],branch_ids:['r7-br-vac-sa'],attachments:['contracts/VAC-CO-01.pdf']},
  {id:'r7-org-feed',code:'FEED-MILL-01',name:'مصنع أعلاف متعاقد',kind:'feed_mill',contact_name:'مدير المبيعات',phone:'772222222',whatsapp:'772222222',governorates_served:['إب','تعز','صنعاء'],payment_terms:'تحويل/آجل',credit_days:15,preferred_currency:'YER_OLD',status:'active',contract_ids:['r7-ctr-feed'],branch_ids:['r7-br-feed-ibb'],attachments:['contracts/FEED-MILL-01.pdf']},
  {id:'r7-org-med',code:'MED-CO-01',name:'شركة أدوية بيطرية متعاقدة',kind:'medicine_supplier',contact_name:'مسؤول المنتجات البيطرية',phone:'773333333',governorates_served:['إب','تعز','عدن'],payment_terms:'نقد/آجل حسب العميل',credit_days:20,preferred_currency:'SAR',status:'active',contract_ids:['r7-ctr-med'],branch_ids:['r7-br-med-ibb'],attachments:[]},
  {id:'r7-org-hat',code:'HATCH-01',name:'فقاسة متعاقدة - صنعاء',kind:'hatchery',contact_name:'مسؤول الحجز',phone:'777003001',governorates_served:['صنعاء','عمران','ذمار'],payment_terms:'دفعة حجز + رصيد قبل التوريد',credit_days:0,preferred_currency:'YER_OLD',status:'active',contract_ids:['r7-ctr-hat'],branch_ids:['r7-br-hat-sa'],attachments:[]},
  {id:'r7-org-lab',code:'LAB-01',name:'مختبر بيطري شريك',kind:'laboratory',contact_name:'مسؤول المختبر',phone:'777002004',governorates_served:['مأرب','صنعاء'],payment_terms:'حسب الفحص والعقد',credit_days:10,preferred_currency:'SAR',status:'active',contract_ids:['r7-ctr-lab'],branch_ids:['r7-br-lab-marib'],attachments:[]}
 ],
 branches:[
  {id:'r7-br-vac-sa',organization_id:'r7-org-vac',name:'فرع صنعاء',governorate:'صنعاء',district:'أمانة العاصمة',address:'صنعاء - شارع تجاري',phone:'777002001',whatsapp:'777002001',lat:15.36,lng:44.20,working_hours:'08:00-18:00',responsible_person:'مدير الفرع',service_area:['صنعاء','عمران','ذمار'],cold_chain_capable:true,warehouse_id:'wh-sanaa-vac',status:'active'},
  {id:'r7-br-feed-ibb',organization_id:'r7-org-feed',name:'مصنع/فرع إب',governorate:'إب',district:'المدينة',address:'إب - المنطقة الصناعية',phone:'772222223',working_hours:'07:00-17:00',responsible_person:'مدير المصنع',service_area:['إب','تعز','صنعاء'],cold_chain_capable:false,warehouse_id:'wh-ibb-feed',status:'active'},
  {id:'r7-br-med-ibb',organization_id:'r7-org-med',name:'فرع إب للأدوية',governorate:'إب',district:'المدينة',address:'إب - المدينة',phone:'777002002',working_hours:'08:00-20:00',responsible_person:'مدير الفرع',service_area:['إب','تعز'],cold_chain_capable:false,status:'active'},
  {id:'r7-br-hat-sa',organization_id:'r7-org-hat',name:'فقاسة صنعاء',governorate:'صنعاء',district:'أمانة العاصمة',address:'صنعاء',phone:'777003001',working_hours:'حسب برنامج الفقس',responsible_person:'مسؤول الحجز',service_area:['صنعاء','عمران','ذمار'],cold_chain_capable:false,status:'active'},
  {id:'r7-br-lab-marib',organization_id:'r7-org-lab',name:'مختبر مأرب',governorate:'مأرب',district:'المدينة',address:'مأرب - المدينة',phone:'777002004',working_hours:'08:00-16:00',responsible_person:'LabReviewer',service_area:['مأرب','الجوف'],cold_chain_capable:true,status:'active'}
 ],
 contracts:[
  {id:'r7-ctr-vac',contract_number:'CTR-VAC-2026-01',organization_id:'r7-org-vac',office_id:'r7-off-sanaa',title:'توريد لقاحات وأدوية سلسلة تبريد',start_date:'2026-09-01',end_date:'2027-08-31',payment_terms:'30 يوم',credit_days:30,currencies:['SAR','USD'],tax_percent:0,delivery_terms:'إلى الفرع/المزرعة حسب الطلب',transport_terms:'سلسلة تبريد إلزامية',attachment_refs:['contracts/CTR-VAC-2026-01.pdf'],status:'active',versions:[{version:1,effective_from:'2026-09-01',note:'العقد الأساسي',changed_by:'الإدارة',changed_at:D}]},
  {id:'r7-ctr-feed',contract_number:'CTR-FEED-2026-01',organization_id:'r7-org-feed',title:'توريد أعلاف بادي/نامي/ناهي',start_date:'2026-09-01',end_date:'2027-06-30',payment_terms:'15 يوم',credit_days:15,currencies:['SAR','YER_OLD','YER_NEW'],tax_percent:0,delivery_terms:'مصنع/فرع أو توصيل للمزرعة',transport_terms:'حسب المحافظة والحمولة',minimum_order_note:'طن أو حسب الاتفاق',attachment_refs:[],status:'active',versions:[{version:1,effective_from:'2026-09-01',note:'العقد الأساسي',changed_by:'الإدارة',changed_at:D}]},
  {id:'r7-ctr-med',contract_number:'CTR-MED-2026-01',organization_id:'r7-org-med',title:'أدوية ومطهرات وإضافات علفية',start_date:'2026-09-01',payment_terms:'حسب العميل',credit_days:20,currencies:['SAR','YER_OLD'],tax_percent:0,delivery_terms:'فرع/توصيل',transport_terms:'حسب الطلب',attachment_refs:[],status:'active',versions:[{version:1,effective_from:'2026-09-01',note:'العقد الأساسي',changed_by:'الإدارة',changed_at:D}]},
  {id:'r7-ctr-hat',contract_number:'CTR-HAT-2026-01',organization_id:'r7-org-hat',title:'توريد كتاكيت لاحم',start_date:'2026-09-01',payment_terms:'حجز مسبق',credit_days:0,currencies:['YER_OLD','SAR'],tax_percent:0,delivery_terms:'موعد فقس وتسليم محدد',transport_terms:'نقل كتاكيت مخصص',attachment_refs:[],status:'active',versions:[{version:1,effective_from:'2026-09-01',note:'العقد الأساسي',changed_by:'الإدارة',changed_at:D}]},
  {id:'r7-ctr-lab',contract_number:'CTR-LAB-2026-01',organization_id:'r7-org-lab',title:'خدمات مختبرية وتشخيصية',start_date:'2026-09-01',payment_terms:'10 أيام',credit_days:10,currencies:['SAR','YER_OLD'],tax_percent:0,delivery_terms:'استلام عينات/مندوب',transport_terms:'حفظ العينة حسب النوع',attachment_refs:[],status:'active',versions:[{version:1,effective_from:'2026-09-01',note:'العقد الأساسي',changed_by:'الإدارة',changed_at:D}]}
 ],
 offers:[
  {id:'r7-offer-vac-nd',organization_id:'r7-org-vac',branch_id:'r7-br-vac-sa',contract_id:'r7-ctr-vac',sku:'VAC-ND',item_name:'لقاح نيوكاسل',category:'vaccine',unit:'أمبول',normal_price:18,contract_price:16,currency:'SAR',min_quantity:1,tax_percent:0,available_quantity:38,availability:'available',effective_from:'2026-09-01',vet_restriction:'يتطلب اعتماد البرنامج التحصيني من الطبيب',cold_chain_required:true,public_visible:true,status:'active'},
  {id:'r7-offer-feed-starter',organization_id:'r7-org-feed',branch_id:'r7-br-feed-ibb',contract_id:'r7-ctr-feed',sku:'FEED-STARTER-50',item_name:'علف بادي',category:'feed',variant:'Starter',unit:'كيس',bag_weight_kg:50,normal_price:27000,contract_price:25500,currency:'YER_OLD',min_quantity:20,tax_percent:0,available_quantity:340,availability:'available',effective_from:'2026-09-01',cold_chain_required:false,public_visible:true,status:'active'},
  {id:'r7-offer-feed-grower',organization_id:'r7-org-feed',branch_id:'r7-br-feed-ibb',contract_id:'r7-ctr-feed',sku:'FEED-GROWER-50',item_name:'علف نامي',category:'feed',variant:'Grower',unit:'كيس',bag_weight_kg:50,normal_price:27500,contract_price:26000,currency:'YER_OLD',min_quantity:20,tax_percent:0,available_quantity:280,availability:'available',effective_from:'2026-09-01',cold_chain_required:false,public_visible:true,status:'active'},
  {id:'r7-offer-feed-finisher',organization_id:'r7-org-feed',branch_id:'r7-br-feed-ibb',contract_id:'r7-ctr-feed',sku:'FEED-FINISHER-50',item_name:'علف ناهي',category:'feed',variant:'Finisher',unit:'كيس',bag_weight_kg:50,normal_price:27800,contract_price:26300,currency:'YER_OLD',min_quantity:20,tax_percent:0,available_quantity:250,availability:'available',effective_from:'2026-09-01',cold_chain_required:false,public_visible:true,status:'active'},
  {id:'r7-offer-chick-ross',organization_id:'r7-org-hat',branch_id:'r7-br-hat-sa',contract_id:'r7-ctr-hat',sku:'CHICK-ROSS308-D1',item_name:'كتكوت لاحم Ross 308 عمر يوم',category:'chick',variant:'Ross 308',unit:'كتكوت',normal_price:1300,contract_price:1250,currency:'YER_OLD',min_quantity:1000,tax_percent:0,available_quantity:48000,availability:'available',effective_from:'2026-09-01',cold_chain_required:false,public_visible:true,status:'active'},
  {id:'r7-offer-med-support',organization_id:'r7-org-med',branch_id:'r7-br-med-ibb',contract_id:'r7-ctr-med',sku:'MED-ELECTROLYTE',item_name:'محلول إلكتروليت بيطري',category:'medicine',unit:'عبوة',normal_price:35,contract_price:31,currency:'SAR',min_quantity:1,tax_percent:0,available_quantity:120,availability:'available',effective_from:'2026-09-01',vet_restriction:'الاستخدام حسب تعليمات الطبيب/الملصق',cold_chain_required:false,public_visible:true,status:'active'}
 ],
 lab_prices:[
  {id:'r7-lp-1',laboratory_id:'r7-org-lab',branch_id:'r7-br-lab-marib',contract_id:'r7-ctr-lab',service_code:'LAB-CULT-SENS',service_name:'زراعة بكتيرية وحساسية',sample_type:'مسحات/أنسجة',normal_price:55,contract_price:45,currency:'SAR',turnaround_hours:48,effective_from:'2026-09-01',status:'active'},
  {id:'r7-lp-2',laboratory_id:'r7-org-lab',branch_id:'r7-br-lab-marib',contract_id:'r7-ctr-lab',service_code:'LAB-PCR-ND',service_name:'PCR نيوكاسل',sample_type:'مسحات تنفسية',normal_price:75,contract_price:65,currency:'SAR',turnaround_hours:24,linked_catalog_sku:'VAC-ND',effective_from:'2026-09-01',status:'active'}
 ],
 regional_markets:[
  {id:'r7-market-sanaa',name:'سوق صنعاء للدواجن',governorate:'صنعاء',district:'أمانة العاصمة',market_type:'poultry_live',phone:'777400001',address:'صنعاء',active:true},
  {id:'r7-market-ibb',name:'سوق إب للدواجن',governorate:'إب',district:'المدينة',market_type:'mixed',phone:'777400002',address:'إب',active:true},
  {id:'r7-market-taiz',name:'سوق تعز للدواجن',governorate:'تعز',district:'القاهرة',market_type:'poultry_live',phone:'777400003',address:'تعز',active:true},
  {id:'r7-market-hodeidah',name:'سوق الحديدة للدواجن',governorate:'الحديدة',market_type:'mixed',address:'الحديدة',active:true},
  {id:'r7-market-dhamar',name:'سوق ذمار للدواجن',governorate:'ذمار',market_type:'poultry_live',address:'ذمار',active:true},
  {id:'r7-market-marib',name:'سوق مأرب للدواجن',governorate:'مأرب',market_type:'mixed',address:'مأرب',active:true},
  {id:'r7-market-aden',name:'سوق عدن للدواجن',governorate:'عدن',market_type:'mixed',address:'عدن',active:true}
 ],
 market_prices:[
  {id:'r7-mp-sa',market_id:'r7-market-sanaa',date:'2026-09-27',category:'broiler_live_kg',value:1650,currency:'YER_OLD',trend:'stable',entered_by:'التسويق'},
  {id:'r7-mp-ibb',market_id:'r7-market-ibb',date:'2026-09-27',category:'broiler_live_kg',value:1600,currency:'YER_OLD',trend:'up',entered_by:'التسويق'}
 ],
 marketing_offices:[
  {id:'r7-mkt-office-ibb',name:'مكتب إب للتسويق الداجني',governorate:'إب',district:'المدينة',address:'السوق المركزي',phone:'777000902',contact_name:'مسؤول التسويق',commission_rule:'حسب العقد/الصفقة',status:'active'}
 ],
 route_requests:[],
 settings:{canonical_office_id_required_for_managed_contracts:true,preserve_history:true,nearest_branch_uses_geo_when_available:true,hide_internal_contract_prices_from_public:true,section7_inventory_owner:true,section12_accounting_owner:true}
};

export function buildPartnerOfficeCustomerNetworkR7(existing?:Partial<PartnerOfficeCustomerNetworkR7State>):PartnerOfficeCustomerNetworkR7State{
 const b=INITIAL_PARTNER_OFFICE_CUSTOMER_NETWORK_R7;
 return {...b,...(existing||{}),version:'R7',governorates:existing?.governorates||b.governorates,customers:existing?.customers||b.customers,offices:existing?.offices||b.offices,organizations:existing?.organizations||b.organizations,branches:existing?.branches||b.branches,contracts:existing?.contracts||b.contracts,offers:existing?.offers||b.offers,lab_prices:existing?.lab_prices||b.lab_prices,regional_markets:existing?.regional_markets||b.regional_markets,market_prices:existing?.market_prices||b.market_prices,marketing_offices:existing?.marketing_offices||b.marketing_offices,route_requests:existing?.route_requests||[],settings:{...b.settings,...(existing?.settings||{})}};
}
function rad(x:number){return x*Math.PI/180}
function distanceKm(a:{lat:number;lng:number},b:{lat:number;lng:number}){const R=6371,dlat=rad(b.lat-a.lat),dlon=rad(b.lng-a.lng),q=Math.sin(dlat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dlon/2)**2;return 2*R*Math.asin(Math.sqrt(q));}
export function nearestEligibleBranchesR7(state:PartnerOfficeCustomerNetworkR7State,input:{governorate:string;district?:string;category:R7Offer['category'];sku?:string;quantity:number;cold_chain_required:boolean;gps?:{lat:number;lng:number}}){
 const rows=state.offers.filter(o=>o.status==='active'&&o.category===input.category&&(!input.sku||o.sku===input.sku)&&o.availability!=='unavailable'&&(o.available_quantity===undefined||o.available_quantity>=input.quantity)).flatMap(o=>{const b=state.branches.find(x=>x.id===o.branch_id);if(!b||b.status!=='active'||(input.cold_chain_required&&!b.cold_chain_capable))return[];const org=state.organizations.find(x=>x.id===o.organization_id);const d=input.gps&&b.lat!==undefined&&b.lng!==undefined?distanceKm(input.gps,{lat:b.lat,lng:b.lng}):undefined;let score=0;if(b.governorate===input.governorate)score+=100;if(input.district&&b.district===input.district)score+=25;if(b.service_area.includes(input.governorate))score+=30;if(d!==undefined)score+=Math.max(0,50-d);return [{offer:o,branch:b,organization:org,score,distance_km:d}];});
 return rows.sort((a,b)=>b.score-a.score);
}
export function addRouteRequestR7(state:PartnerOfficeCustomerNetworkR7State,input:Omit<R7RouteRequest,'id'|'requested_at'|'status'>):PartnerOfficeCustomerNetworkR7State{const row:R7RouteRequest={...input,id:`R7-ROUTE-${Date.now()}`,requested_at:new Date().toISOString(),status:input.selected_branch_id?'routed':'requested'};return {...state,route_requests:[row,...state.route_requests]};}
export function addCustomerR7(state:PartnerOfficeCustomerNetworkR7State,input:Omit<R7CustomerRelationship,'id'|'created_at'>):PartnerOfficeCustomerNetworkR7State{return {...state,customers:[{...input,id:`R7-CUS-${Date.now()}`,created_at:new Date().toISOString()},...state.customers]};}
export function addOfficeR7(state:PartnerOfficeCustomerNetworkR7State,input:Omit<R7Office,'id'>):PartnerOfficeCustomerNetworkR7State{return {...state,offices:[{...input,id:`R7-OFF-${Date.now()}`},...state.offices]};}
export function addPartnerR7(state:PartnerOfficeCustomerNetworkR7State,input:Omit<R7PartnerOrganization,'id'|'contract_ids'|'branch_ids'|'attachments'>):PartnerOfficeCustomerNetworkR7State{return {...state,organizations:[{...input,id:`R7-ORG-${Date.now()}`,contract_ids:[],branch_ids:[],attachments:[]},...state.organizations]};}
export function validatePartnerOfficeCustomerNetworkR7(s:PartnerOfficeCustomerNetworkR7State){const issues:string[]=[];for(const c of s.customers.filter(x=>x.journey==='managed_farm'))if(!c.office_id||!s.offices.some(o=>o.id===c.office_id))issues.push(`managed_customer_without_canonical_office:${c.id}`);for(const b of s.branches)if(!s.organizations.some(o=>o.id===b.organization_id))issues.push(`orphan_branch:${b.id}`);for(const c of s.contracts)if(!s.organizations.some(o=>o.id===c.organization_id))issues.push(`orphan_contract:${c.id}`);for(const o of s.offers){if(!s.organizations.some(x=>x.id===o.organization_id))issues.push(`orphan_offer_org:${o.id}`);if(o.branch_id&&!s.branches.some(x=>x.id===o.branch_id))issues.push(`orphan_offer_branch:${o.id}`);}return issues;}


/** Historical recovery: distinct marketing company identity, never an office alias. */
export function classifyR7Party(kind:R7PartyKind):'marketing_company'|'supplier_or_partner'{
 return kind==='marketing_company'?'marketing_company':'supplier_or_partner';
}
/** Immutable edits preserve the existing office identifier and all unrelated records. */
export function renameOfficeR7(state:PartnerOfficeCustomerNetworkR7State,officeId:string,name:string):PartnerOfficeCustomerNetworkR7State{
 const clean=name.trim();if(!clean)throw new Error('office_name_required');
 if(!state.offices.some(o=>o.id===officeId))throw new Error('office_not_found');
 if(state.offices.some(o=>o.id!==officeId&&o.name===clean))throw new Error('office_name_conflict');
 return {...state,offices:state.offices.map(o=>o.id===officeId?{...o,name:clean}:o)};
}
/** Non-destructive region rename: do not silently rewrite historically recorded addresses. */
export function addGovernorateR7(state:PartnerOfficeCustomerNetworkR7State,name:string):PartnerOfficeCustomerNetworkR7State{
 const clean=name.trim();if(!clean)throw new Error('governorate_name_required');
 if(state.governorates.includes(clean))throw new Error('governorate_already_exists');
 return {...state,governorates:[...state.governorates,clean]};
}
/** Referentially safe company registration; marketing companies are never registered as offices. */
export function registerMarketingCompanyR7(state:PartnerOfficeCustomerNetworkR7State,input:Omit<R7PartnerOrganization,'id'|'kind'|'contract_ids'|'branch_ids'|'attachments'>):PartnerOfficeCustomerNetworkR7State{
 if(!input.name.trim()||!input.code.trim())throw new Error('company_identity_required');
 if(state.organizations.some(o=>o.code===input.code))throw new Error('company_code_conflict');
 return {...state,organizations:[...state.organizations,{...input,kind:'marketing_company',id:`R7-MCO-${Date.now()}`,contract_ids:[],branch_ids:[],attachments:[]}]};
}
