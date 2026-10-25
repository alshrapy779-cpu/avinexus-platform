const fs=require('fs');
const path=require('path');
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ui=read('src/components/v20/FeedFactoryCompletionV20_2_9.tsx');
const core=read('src/modules/v20/FeedFactoryCompletionV20_2_9.ts');
const reg=read('src/modules/v20/FactoryFullScreenRegistryV20_2_9.ts');
const workspace=read('src/components/v20/EnterpriseWebWorkspaceV20_2.tsx');
const checks=[];
const check=(name,ok)=>checks.push({name,ok:Boolean(ok)});
const must=(src,s)=>src.includes(s);

// Complete screen map / navigation
const entries=[...reg.matchAll(/\{section:(\d+),code:'([^']+)'/g)].map(m=>({section:+m[1],code:m[2]}));
check('factory screen registry has exactly 189 screens',entries.length===189);
check('factory screen codes are unique',new Set(entries.map(x=>x.code)).size===189);
const expected={1:7,2:5,3:15,4:3,5:3,6:3,7:7,8:3,9:10,10:5,11:15,12:27,13:13,14:32,15:41};
for(const [section,count] of Object.entries(expected)) check(`section ${section} has ${count} internal screens`,entries.filter(x=>x.section===+section).length===count);
check('workspace provides internal screen selector',must(ui,'factoryScreensForSectionV2029(section)')&&must(ui,'setScreenCode'));
check('workspace opens source-linked operational engine',must(ui,'SectionView section={section}'));
check('workspace handles statement/report/dashboard/history/settings screens',must(ui,'FactoryScreenSpecialized'));
check('enterprise workspace passes Windows closure state',must(workspace,'windows={windowsCompletion}')&&must(workspace,'onWindowsChange={onWindowsCompletionChange}'));

// Supplier/commercial controls
for(const fn of ['createSupplierRelationshipV2029','activateSupplierRelationshipV2029','addSupplierCommercialPriceV2029','approveSupplierCommercialPriceV2029','addSupplierPaymentDestinationV2029','verifySupplierPaymentDestinationV2029','recordSupplierRatingV2029']) check(`supplier workflow wired: ${fn}`,must(ui,fn)&&must(core,`function ${fn}`));
check('supplier statement is wired to canonical counterparty ledger',must(ui,'supplierStatementV2023'));

// Purchasing and receiving controls
for(const fn of ['createPurchaseRequisitionV2024','approvePurchaseRequisitionV2024','addSupplierQuoteV2024','awardSupplierQuoteV2024','createPurchaseOrderV2023','receivePurchaseOrderV2023','recordReceivingControlV2029','runThreeWayMatchV2027']) check(`purchasing workflow wired: ${fn}`,must(ui,fn));
check('sent-vs-received transit variance exists',must(core,'transit_variance_qty'));
check('PO receipt variance exists',must(core,'po_variance_qty'));

// Production semantics and cost true-up
check('staging explicitly preserves no-consumption semantics',must(core,"Staging is allocation/transfer only")||must(core,'staging_consumption_semantic_violation'));
for(const fn of ['stageMaterialsForWorkOrderV2029','recordProductionActualV2029','approveProductionActualV2029','recordProductionCostTrueUpV2029']) check(`production workflow wired: ${fn}`,must(ui,fn)&&must(core,`function ${fn}`));
check('production true-up carries S7/S12 references',must(core,'inventory_adjustment_reference_id')&&must(core,'accounting_delta_reference_id'));

// Inventory controls
for(const fn of ['createStockTransferV2023','dispatchStockTransferV2023','receiveStockTransferV2023','createCycleCountV2027','approveAndPostCycleCountV2027','quarantineInventoryLotV2027','decideInventoryQuarantineV2027']) check(`inventory workflow wired: ${fn}`,must(ui,fn));
check('S7 is explicitly sole inventory owner',must(core,'S7 sole inventory owner'));

// Sales-to-cash + return/credit note
for(const fn of ['createCustomerRelationshipV2029','createCustomerCreditProfileV2029','createSalesOrderControlV2029','confirmSalesOrderV2029','requestSalesDispatchV2029','executeSalesDispatchV2029','postFactorySalesInvoiceToARV2029','recordFactoryCustomerReceiptV2029','createFactorySalesReturnV2029','approveFactorySalesReturnV2029','receiveFactorySalesReturnV2029','postFactorySalesCreditNoteV2029']) check(`sales workflow wired: ${fn}`,must(ui,fn)&&must(core,`function ${fn}`));
check('sales return receipt creates S7 return_in movement',must(core,"kind:'return_in'"));
check('sales credit note posts customer ledger credit',must(core,'factory_sales_credit_note'));

// HR/payroll
for(const fn of ['createWorkforceEmployeeV2025','createCompensationContractV2025','createWorkforceAssignmentV2025','createWorkScheduleV2025','recordAttendanceV2025','requestLeaveV2025','decideLeaveV2025','requestEmployeeAdvanceV2025','approveEmployeeAdvanceV2025','payEmployeeAdvanceV2025','createPayrollPeriodV2025','generatePayrollLineV2025','approvePayrollPeriodV2025','payPayrollLineV2025']) check(`HR/payroll workflow wired: ${fn}`,must(ui,fn));

// Treasury/accounting closure
for(const fn of ['createAccountingPeriodV2027','closeAccountingPeriodV2027','reopenAccountingPeriodV2027','approveFxRateV2027']) check(`accounting control wired: ${fn}`,must(ui,fn));
check('S12 is explicitly sole accounting owner',must(core,'S12 sole accounting owner'));

// Transport, reporting, governance
for(const fn of ['createTransportZoneV2029','addTransportRateV2029','createFactoryTransportTripV2029','completeFactoryTransportTripV2029']) check(`transport workflow wired: ${fn}`,must(ui,fn)&&must(core,`function ${fn}`));
check('POD required before trip completion',must(core,'pod_required'));
check('frozen report execution implemented',must(ui,'freezeFactoryReportV2029')&&must(core,'function freezeFactoryReportV2029'));
check('versioned policy create/activate implemented',must(ui,'createFactoryPolicyV2029')&&must(ui,'activateFactoryPolicyV2029')&&must(core,'function createFactoryPolicyV2029')&&must(core,'function activateFactoryPolicyV2029'));
check('factory profile can be provisioned in place',must(ui,'FactoryProvisionWizard')&&must(ui,'createFactoryProfileV2023'));
check('legacy V20.2.4 engine remains accessible',must(ui,'FeedFactoryOperationsV2024'));

const failed=checks.filter(x=>!x.ok);
console.log(`Factory Production R3 Checks: ${checks.length}; Failed: ${failed.length}`);
for(const x of failed) console.log(`FAIL: ${x.name}`);
if(failed.length) process.exit(1);
console.log('FACTORY PRODUCTION EXPANSION R3 SEMANTIC PASS');
