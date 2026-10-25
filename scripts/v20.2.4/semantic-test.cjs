const cp=require('child_process'),fs=require('fs'),path=require('path'),os=require('os');
const root=path.resolve(__dirname,'../..'),out=path.join(os.tmpdir(),'spp-v2024-semantic');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
cp.execFileSync('tsc',['--pretty','false','--skipLibCheck','--moduleResolution','node','--module','commonjs','--target','es2022','--rootDir','src','--outDir',out,'src/modules/v20/FeedFactoryOperationsV20_2_4.ts'],{cwd:root,stdio:'inherit'});
fs.writeFileSync(path.join(out,'package.json'),' {"type":"commonjs"} ');
const f=require(path.join(out,'modules/v20/FeedFactoryOperationsV20_2_4.js'));
const m=require(path.join(out,'modules/v20/MultiBusinessEnterpriseV20_2_3.js'));
const w=require(path.join(out,'modules/v20/EnterpriseWebPlatformV20_2.js'));
let mb=m.buildMultiBusinessEnterpriseStateV2023(), web=w.buildEnterpriseWebStateV202(undefined,'DEVELOPMENT'), state=f.buildFeedFactoryOperationsStateV2024();
const actor='system_owner';
// Factory enterprise structure.
mb=m.createBusinessUnitV2023(mb,{code:'FEED-FACTORY-24',name:'Feed Factory V20.2.4',type:'feed_factory',address:'Lahj',manager_user_id:'factory-mgr',status:'active',currency_preferences:['SAR','USD','YER_OLD','YER_NEW']},actor);const factoryUnit=mb.business_units[0];
mb=m.createWarehouseV2023(mb,{code:'F24-RAW',business_unit_id:factoryUnit.id,name:'Raw Materials',warehouse_type:'raw_material',active:true},actor);const rawWh=mb.warehouses[0];
mb=m.createWarehouseV2023(mb,{code:'F24-FG',business_unit_id:factoryUnit.id,name:'Finished Feed',warehouse_type:'finished_goods',active:true},actor);const fgWh=mb.warehouses[0];
mb=m.createFactoryProfileV2023(mb,{business_unit_id:factoryUnit.id,factory_code:'FAC-24',name:'Feed Factory V20.2.4',raw_material_warehouse_id:rawWh.id,finished_goods_warehouse_id:fgWh.id,manager_user_id:'factory-mgr',accountant_user_id:'factory-acc',active:true},actor);const factory=mb.factories[0];
mb=m.createSupplierV2023(mb,{business_unit_id:factoryUnit.id,name:'Raw Materials Supplier',address:'Aden',supplied_categories:['raw_material'],preferred_currency:'SAR',payment_terms_days:30,active:true},actor);const supplier=mb.suppliers[0];
// Destination office and farm link.
mb=m.createBusinessUnitV2023(mb,{code:'ADEN-FEED-OFFICE',name:'Aden Feed Office',type:'feed_office',address:'Aden',manager_user_id:'office-mgr',status:'active',currency_preferences:['SAR','USD','YER_OLD','YER_NEW']},actor);const office=mb.business_units[0];
mb=m.createWarehouseV2023(mb,{code:'ADEN-FEED-WH',business_unit_id:office.id,name:'Aden Feed Warehouse',warehouse_type:'general',active:true},actor);const officeWh=mb.warehouses[0];
mb=m.linkFarmToBusinessUnitV2023(mb,{business_unit_id:office.id,farm_id:'farm-feed-24',assigned_manager_user_id:'office-mgr',primary_vet_user_id:'vet-24',cost_center_code:'FARM:FEED24:OPS',active:true,starts_at:'2026-09-18'},actor);
// Raw material nutrition profiles.
mb=m.updateRawMaterialNutrientsV2023(mb,'raw-corn',{protein_pct:8.5,metabolizable_energy_kcal_kg:3350,calcium_pct:0.03,phosphorus_pct:0.28,fiber_pct:2.2,moisture_pct:12,default_bag_weight_kg:50},actor);
mb=m.updateRawMaterialNutrientsV2023(mb,'raw-soy',{protein_pct:46,metabolizable_energy_kcal_kg:2450,calcium_pct:0.3,phosphorus_pct:0.65,fiber_pct:3.5,moisture_pct:11,default_bag_weight_kg:50},actor);
mb=m.updateRawMaterialNutrientsV2023(mb,'raw-premix',{protein_pct:0,metabolizable_energy_kcal_kg:0,calcium_pct:20,phosphorus_pct:4,fiber_pct:0,moisture_pct:1,default_bag_weight_kg:25},actor);
// Products use kg as inventory base unit.
for(const p of [
{id:'prod-corn-24',sku:'RAW-CORN-24',name:'Corn',category:'raw_material',base_unit:'kg',bag_weight_kg:50,purchase_price:1.2,sales_price:0,pricing_currency:'SAR',inventory_account_code:'1210',revenue_account_code:'4010',cogs_account_code:'5900',minimum_stock_base:500,track_lot:true,track_expiry:false,active:true},
{id:'prod-soy-24',sku:'RAW-SOY-24',name:'Soybean Meal',category:'raw_material',base_unit:'kg',bag_weight_kg:50,purchase_price:2,sales_price:0,pricing_currency:'SAR',inventory_account_code:'1210',revenue_account_code:'4010',cogs_account_code:'5900',minimum_stock_base:300,track_lot:true,track_expiry:false,active:true},
{id:'prod-premix-24',sku:'RAW-PREMIX-24',name:'Premix',category:'raw_material',base_unit:'kg',bag_weight_kg:25,purchase_price:5,sales_price:0,pricing_currency:'SAR',inventory_account_code:'1210',revenue_account_code:'4010',cogs_account_code:'5900',minimum_stock_base:50,track_lot:true,track_expiry:false,active:true},
{id:'prod-finisher-24',sku:'FEED-FINISHER-24',name:'Finisher Feed',category:'finished_feed',base_unit:'kg',bag_weight_kg:50,purchase_price:0,sales_price:2.5,pricing_currency:'SAR',inventory_account_code:'1220',revenue_account_code:'4010',cogs_account_code:'5900',minimum_stock_base:500,track_lot:true,track_expiry:false,active:true}
]) mb=m.createProductV2023(mb,p,actor);
// Purchase and receive raw materials into factory warehouse.
mb=m.createPurchaseOrderV2023(mb,{business_unit_id:factoryUnit.id,warehouse_id:rawWh.id,supplier_id:supplier.id,order_date:'2026-09-18',expected_date:'2026-09-18',lines:[
{id:'pol-corn',product_id:'prod-corn-24',ordered_quantity_base:2000,unit_price:1.2,currency:'SAR',exchange_rate_to_sar:1},
{id:'pol-soy',product_id:'prod-soy-24',ordered_quantity_base:1500,unit_price:2,currency:'SAR',exchange_rate_to_sar:1},
{id:'pol-premix',product_id:'prod-premix-24',ordered_quantity_base:300,unit_price:5,currency:'SAR',exchange_rate_to_sar:1}],transport_cost:0,transport_currency:'SAR',requested_by:'proc-24',approve:true,approved_by:'factory-mgr'},'proc-24');const po=mb.purchase_orders[0];
let rec=m.receivePurchaseOrderV2023(mb,web,{purchase_order_id:po.id,arrival_date:'2026-09-18',arrival_time:'08:30',lines:[{product_id:'prod-corn-24',received_quantity_base:2000,lot_number:'CORN-LOT-24'},{product_id:'prod-soy-24',received_quantity_base:1500,lot_number:'SOY-LOT-24'},{product_id:'prod-premix-24',received_quantity_base:300,lot_number:'PREMIX-LOT-24'}],received_by:'store-24',evidence_refs:['grn-24'],supplier_invoice_number:'SUP-24'});mb=rec.state;web=rec.web;
// Procurement requisition/RFQ/award layer.
state=f.createPurchaseRequisitionV2024(state,mb,{business_unit_id:factoryUnit.id,warehouse_id:rawWh.id,factory_id:factory.id,requested_by:'proc-24',request_date:'2026-09-18',reason:'Next production cycle',lines:[{product_id:'prod-corn-24',requested_quantity_base:3000},{product_id:'prod-soy-24',requested_quantity_base:1500}]},'proc-24');const pr=state.purchase_requisitions[0];
state=f.approvePurchaseRequisitionV2024(state,pr.id,'factory-mgr');
state=f.addSupplierQuoteV2024(state,mb,{requisition_id:pr.id,supplier_id:supplier.id,quoted_at:'2026-09-18T09:00:00Z',transport_cost_sar:150,lines:[{product_id:'prod-corn-24',quantity_base:3000,unit_price:1.18,currency:'SAR',exchange_rate_to_sar:1},{product_id:'prod-soy-24',quantity_base:1500,unit_price:1.95,currency:'SAR',exchange_rate_to_sar:1}]},'proc-24');const quote=state.supplier_quotes[0];
state=f.awardSupplierQuoteV2024(state,quote.id,'factory-mgr');
if(state.supplier_quotes.find(x=>x.id===quote.id).status!=='awarded')throw new Error('quote award failed');
// Formula with exact targets from the supplied nutrient profiles.
state=f.createFeedFormulaV2024(state,mb,{formula_code:'FINISHER-A',name:'Finisher A',factory_id:factory.id,feed_product_type_id:'feed-type-finisher',finished_product_id:'prod-finisher-24',batch_basis_kg:1000,ingredients:[{raw_material_definition_id:'raw-corn',product_id:'prod-corn-24',quantity_kg:600},{raw_material_definition_id:'raw-soy',product_id:'prod-soy-24',quantity_kg:350},{raw_material_definition_id:'raw-premix',product_id:'prod-premix-24',quantity_kg:50}],targets:{protein_pct:21.2,metabolizable_energy_kcal_kg:2867.5,calcium_pct:1.123,protein_tolerance_pct:0.01,energy_tolerance_kcal_kg:0.1,calcium_tolerance_pct:0.001}},'nutritionist-24');const formula=state.formulas[0];
state=f.submitFormulaForReviewV2024(state,formula.id,'nutrition-reviewer');
state=f.approveFeedFormulaV2024(state,mb,formula.id,'factory-mgr');
if(state.formulas.find(x=>x.id===formula.id).status!=='approved')throw new Error('formula approval failed');
// Manufacturing lifecycle.
state=f.createManufacturingOrderV2024(state,mb,{factory_id:factory.id,formula_id:formula.id,planned_output_kg:1000,bag_weight_kg:50,scheduled_date:'2026-09-18',requested_by:'factory-mgr',production_supervisor_user_id:'prod-supervisor'},'factory-mgr');let mo=state.manufacturing_orders[0];
let app=f.approveManufacturingOrderV2024(state,mb,mo.id,'factory-mgr');state=app.state;mb=app.multiBusiness;
if(m.inventoryAvailableV2023(mb,rawWh.id,'prod-corn-24')!==1400)throw new Error('material reservation failed');
let started=f.startManufacturingOrderV2024(state,mb,web,mo.id,{actor:'prod-supervisor',started_at:'2026-09-18T10:00:00Z'});state=started.state;mb=started.multiBusiness;web=started.web;
mo=state.manufacturing_orders.find(x=>x.id===mo.id);if(mo.actual_input_kg!==1000)throw new Error('actual input incorrect');
let completed=f.completeManufacturingOrderV2024(state,mb,web,mo.id,{actor:'prod-supervisor',actual_output_kg:970,direct_labor_sar:100,allocated_overhead_sar:50,completed_at:'2026-09-18T11:30:00Z',lot_number:'FG-24-001'});state=completed.state;mb=completed.multiBusiness;web=completed.web;const batch=completed.batch;
mo=state.manufacturing_orders.find(x=>x.id===mo.id);if(mo.yield_pct!==97||mo.loss_kg!==30)throw new Error('yield/loss calculation failed');
if(m.inventoryBalanceV2023(mb,fgWh.id,'prod-finisher-24')!==970)throw new Error('finished goods receipt failed');
if(!state.exceptions.some(x=>x.type==='production_loss'))throw new Error('production loss exception missing');
// Dispatch to office with controlled receiving variance.
state=f.createFactoryDispatchV2024(state,mb,{factory_id:factory.id,destination_type:'office',destination_business_unit_id:office.id,destination_warehouse_id:officeWh.id,product_id:'prod-finisher-24',production_batch_id:batch.id,quantity_kg:500,bag_weight_kg:50,requested_by:'dispatch-24',evidence_refs:['load-photo']},'dispatch-24');let dsp=state.dispatches[0];
state=f.approveFactoryDispatchV2024(state,dsp.id,'factory-mgr');let sent=f.dispatchFactoryGoodsV2024(state,mb,dsp.id,'dispatch-24');state=sent.state;mb=sent.multiBusiness;
let received=f.receiveFactoryDispatchV2024(state,mb,web,dsp.id,{actor:'office-store',accepted_kg:495,damaged_kg:2,evidence_refs:['receive-photo']});state=received.state;mb=received.multiBusiness;web=received.web;
dsp=state.dispatches.find(x=>x.id===dsp.id);if(dsp.shortage_kg!==3||dsp.damaged_kg!==2||dsp.status!=='partially_received')throw new Error('dispatch variance failed');
if(m.inventoryBalanceV2023(mb,officeWh.id,'prod-finisher-24')!==495)throw new Error('office receiving stock failed');
// Feed consumption by a linked farm and finance posting.
let consumed=f.recordFarmFeedConsumptionV2024(state,mb,web,{business_unit_id:office.id,farm_id:'farm-feed-24',flock_id:'flock-24',warehouse_id:officeWh.id,product_id:'prod-finisher-24',consumption_date:'2026-09-18',quantity_kg:100,source_report_id:'daily-report-24',recorded_by:'farm-worker'});state=consumed.state;mb=consumed.multiBusiness;web=consumed.web;
if(m.inventoryBalanceV2023(mb,officeWh.id,'prod-finisher-24')!==395)throw new Error('farm consumption stock failed');
// Validation, accounting and reporting assertions.
const issues=f.validateFeedFactoryStateV2024(state,mb,web);if(issues.length)throw new Error('validation failed: '+issues.join(','));
for(const j of web.journal_entries.filter(x=>x.status==='posted')){const d=j.lines.reduce((s,l)=>s+l.debit_sar,0),c=j.lines.reduce((s,l)=>s+l.credit_sar,0);if(Math.abs(d-c)>0.01)throw new Error('unbalanced journal '+j.id)}
const dash=f.factoryOperationsDashboardV2024(state,mb,factory.id), costs=f.productionCostReportV2024(state,factory.id);
if(dash.completed_orders!==1||dash.production_kg!==970||costs.length!==1)throw new Error('factory dashboard/report failed');
console.log(JSON.stringify({passed:true,procurement:{requisition:pr.request_number,quote_awarded:true},formula:{code:formula.formula_code,version:formula.version,protein:state.formulas.find(x=>x.id===formula.id).calculated.protein_pct,energy:state.formulas.find(x=>x.id===formula.id).calculated.metabolizable_energy_kcal_kg,calcium:state.formulas.find(x=>x.id===formula.id).calculated.calcium_pct},manufacturing:{order:mo.order_number,input_kg:mo.actual_input_kg,output_kg:mo.actual_output_kg,yield_pct:mo.yield_pct,loss_kg:mo.loss_kg,bags:mo.actual_bags,cost_per_kg_sar:mo.cost_per_kg_sar,cost_per_bag_sar:mo.cost_per_bag_sar},dispatch:{quantity_kg:dsp.quantity_kg,accepted_kg:dsp.accepted_kg,damaged_kg:dsp.damaged_kg,shortage_kg:dsp.shortage_kg,status:dsp.status},farm:{consumed_kg:consumed.record.quantity_kg,remaining_office_kg:m.inventoryBalanceV2023(mb,officeWh.id,'prod-finisher-24')},finance:{journal_entries:web.journal_entries.length,all_balanced:true},dashboard:{production_kg:dash.production_kg,finished_goods_kg:dash.finished_goods_kg,open_exceptions:dash.open_exceptions},validation_issues:issues.length},null,2));
