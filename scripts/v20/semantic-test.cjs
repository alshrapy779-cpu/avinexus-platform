const assert=require('assert');
const v20=require('/tmp/v20_testbuild/v20/EnterprisePoultryCoreV20.js');

const managed={
  farms:[{id:'farm-1',name:'مزرعة اختبار',biosecurity_score:88,compliance_score:92}],
  houses:[{id:'house-1',farm_id:'farm-1',name:'عنبر 1'}],
  flock_cycles:[{id:'flock-1',flock_code:'FLK-TEST-001',farm_id:'farm-1',house_id:'house-1',breed:'Ross 308',hatchery_name:'فقاسة اختبار',placement_date:'2026-09-01T06:00:00Z',initial_count:1000,current_count:920,age_days:21,status:'active',target_market_weight_kg:2.2,cumulative_feed_kg:200,cumulative_mortality:30}],
  placements:[{id:'pl-1',flock_id:'flock-1',received_at:'2026-09-01T06:00:00Z',hatchery_name:'فقاسة اختبار',breed:'Ross 308',document_count:1020,received_count:1020,arrival_mortality:20,accepted_initial_count:1000,vehicle_plate:'1',driver_name:'سائق',driver_phone:'777',vehicle_disinfected:true,sample_weights_g:[42,43,41],average_arrival_weight_g:42,photo_refs:[],documents:[],received_by:'عامل'}],
  daily_reports:[
    {id:'r1',report_number:'R1',farm_id:'farm-1',farm_name:'مزرعة اختبار',flock_id:'flock-1',flock_code:'FLK-TEST-001',house_id:'house-1',report_date:'2026-09-20',age_days:20,shift:'daily_close',entered_by:'عامل',entered_by_role:'worker',opening_birds:1000,mortality:10,mortality_morning:4,mortality_evening:6,culls:5,closing_birds:985,feed_opening_kg:500,feed_received_kg:0,feed_used_kg:90,feed_closing_kg:410,water_liters:180,temperature_min_c:24,temperature_max_c:28,temperature_points_c:[24,25,27,28],humidity_min_pct:55,humidity_max_pct:65,weight_condition:'fasted',weight_time:'07:00',sample_weights_g:[900,920,910,895,930],sampling_locations:['A','B','C','D','E'],avg_weight_g:911,min_weight_g:895,max_weight_g:930,median_weight_g:910,cv_percent:1.4,uniformity_percent:100,expected_weight_g:950,weight_variance_percent:-4.1,daily_gain_g:60,cumulative_feed_kg:90,estimated_fcr:1.4,medication_entries:[],vaccination_entries:[],litter_condition:'جيدة',equipment_issues:[],respiratory_sound_observed:false,abnormal_droppings_observed:false,media_refs:[],mandatory_fields_complete:true,submitted_at:'2026-09-20T18:00:00Z',vet_review_status:'reviewed'},
    {id:'r2',report_number:'R2',farm_id:'farm-1',farm_name:'مزرعة اختبار',flock_id:'flock-1',flock_code:'FLK-TEST-001',house_id:'house-1',report_date:'2026-09-21',age_days:21,shift:'daily_close',entered_by:'عامل',entered_by_role:'worker',opening_birds:985,mortality:20,mortality_morning:9,mortality_evening:11,culls:5,closing_birds:960,feed_opening_kg:410,feed_received_kg:200,feed_used_kg:110,feed_closing_kg:500,water_liters:220,temperature_min_c:23,temperature_max_c:27,temperature_points_c:[23,24,26,27],humidity_min_pct:54,humidity_max_pct:63,weight_condition:'fasted',weight_time:'07:00',sample_weights_g:[980,1000,1020,990,1010],sampling_locations:['A','B','C','D','E'],avg_weight_g:1000,min_weight_g:980,max_weight_g:1020,median_weight_g:1000,cv_percent:1.4,uniformity_percent:100,expected_weight_g:1030,weight_variance_percent:-2.91,daily_gain_g:89,cumulative_feed_kg:200,estimated_fcr:1.45,medication_entries:[],vaccination_entries:[],litter_condition:'جيدة',equipment_issues:[],respiratory_sound_observed:false,abnormal_droppings_observed:false,media_refs:[],mandatory_fields_complete:true,submitted_at:'2026-09-21T18:00:00Z',vet_review_status:'reviewed'}
  ],
  poultry_sales:[{id:'s1',sale_number:'SALE-1',farm_id:'farm-1',flock_id:'flock-1',buyer_name:'مشتري',buyer_phone:'1',marketing_office:'مكتب',marketing_contact:'1',governorate:'صنعاء',district:'',address:'',birds_planned:40,avg_weight_kg:1,price_per_kg:10,currency:'SAR',gross_expected:400,office_fee:0,platform_fee:0,transport_fee:0,net_expected:400,owner_decision:'approved',loaded_birds:40,delivered_birds:30,transport_mortality:10,arrived_at:'2026-09-21T20:00:00Z',pod_reference:'POD1',receiver_name:'مستلم',status:'delivered'}],
  cost_entries:[{id:'c1',entry_number:'C1',farm_id:'farm-1',flock_id:'flock-1',date:'2026-09-21',category:'feed',description:'علف',amount:100,currency:'SAR',exchange_rate_to_sar:1,amount_sar:100,debit_credit:'debit',party_name:'مورد',payment_status:'paid'}],
  requirements:[],exceptions:[],settlements:[],cycle_performance:[],
};
const state=v20.buildV20State();
const master=v20.buildFlockMasterRecordV20(state,managed,'flock-1');
assert.equal(master.initial_accepted,1000);
assert.equal(master.arrival_mortality,20);
assert.equal(master.farm_mortality_cumulative,30);
assert.equal(master.culls_cumulative,10);
assert.equal(master.sold_cumulative,30);
assert.equal(master.transport_mortality_cumulative,10);
assert.equal(master.current_theoretical,920);
assert.equal(master.population_discrepancy,0);
assert.equal(master.farm_mortality_percent,3);
const ledger=v20.buildPopulationLedgerV20(state,managed,'flock-1');
assert(ledger.some(x=>x.event_type==='arrival_mortality'&&x.signed_quantity===0));
assert(ledger.some(x=>x.event_type==='transport_mortality'&&x.signed_quantity===-10));
const weight=v20.weightMetricsV20(managed,'flock-1');
assert.equal(weight.sample_count,5); assert(weight.avg_g>=999&&weight.avg_g<=1001); assert(weight.cv_percent>0);
const feed=v20.feedMetricsV20(state,managed,'flock-1');
assert.equal(feed.cumulative_used_kg,200); assert(feed.estimated_days_remaining>0);
const complete=v20.dataCompletenessV20(managed.daily_reports[1]); assert.equal(complete.score,100);
let closed=v20.closeFlockDayV20(state,managed,{flock_id:'flock-1',report_date:'2026-09-21',worker:'عامل',vet:'طبيب'}); assert.equal(closed.daily_closures[0].status,'closed');
const owner=v20.ownerDailyDashboardV20(closed,managed,'flock-1'); assert.equal(owner.master.current_theoretical,920); assert.equal(owner.cost_cumulative_sar,100);
const weekly=v20.weeklyPerformanceV20(closed,managed,'flock-1'); assert.equal(weekly.mortality,30);
let mismatch=JSON.parse(JSON.stringify(managed)); mismatch.flock_cycles[0].current_count=918;
let adj=v20.addReconciliationAdjustmentV20(state,mismatch,{flock_id:'flock-1',quantity_delta:-2,reason:'جرد فعلي معتمد',requested_by:'مشرف',requested_by_role:'supervisor'}); adj=v20.approveReconciliationAdjustmentV20(adj,adj.reconciliation_adjustments[0].id,true,'مدير','ceo','مطابقة الجرد'); const reconciled=v20.buildFlockMasterRecordV20(adj,mismatch,'flock-1'); assert.equal(reconciled.population_discrepancy,0);
console.log(JSON.stringify({ok:true,master,weight,feed,closure:closed.daily_closures[0].status,weekly,ledger_events:ledger.length},null,2));
