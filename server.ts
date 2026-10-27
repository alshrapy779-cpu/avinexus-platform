import { createOfficeItemsRouter } from './src/server/routes/itemsApi';
import { mongoItemsRepository } from './src/server/repositories/mongoItemsRepository';
import { createOfficeContactsRouter } from './src/server/routes/contactsApi';
import { mongoContactsRepository } from './src/server/repositories/mongoContactsRepository';
import { connectDB } from "./src/server/db";
import { randomUUID } from 'node:crypto';
import { type UserRegistration } from './src/server/User';
import 'dotenv/config';
import {addOfficeR7, buildPartnerOfficeCustomerNetworkR7, renameOfficeR7, addGovernorateR7, registerMarketingCompanyR7, type PartnerOfficeCustomerNetworkR7State } from './src/modules/v20/PartnerOfficeCustomerNetworkR7';
import { officeTreasuryReconciliationV2026 } from './src/modules/v20/OfficeTreasuryReconciliationRecovery';
import { inventoryBalanceQueryV2026 } from './src/modules/v20/InventoryBalanceQueryV2026';
import { contractedOfficeWorkspaceV2026 } from './src/modules/v20/OfficeWorkspaceRecoveryV2026';
import { authorizeAIAction, guardAIAdvisorReply } from './src/modules/ai/AIActionSafetyPolicy';
import { createClinicalReferral, listClinicalReferrals, appendClinicalReview, listClinicalReviews } from './src/modules/ai/AIClinicalReferralStore';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_FARMS,
  INITIAL_FLOCKS,
  INITIAL_DAILY_LOGS,
  INITIAL_NECROPSY_CASES,
  INITIAL_LAB_REPORTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_ACOUSTIC_SESSIONS,
  INITIAL_OUTBREAKS
} from './src/data/initialData';
import { DailyLog, NecropsyCase, Prescription, LabSensitivityResult, AcousticAnalysisSession, EpidemiologicalOutbreak, EnterpriseOperationsV11State } from './src/types';
import { INITIAL_ENTERPRISE_V11 } from './src/data/enterpriseV11Data';
import { buildBrokerQueueV17, buildSupplierQueueV17, calculateFlockSettlementV17, routeToNextBrokerV17, routeToNextSupplierV17, recalcLeaseListingV17 } from './src/services/transactionalRoutingV17';
import { canPublishHealthyLabelV19, chooseFreelanceVetV19, routeLogisticsV19 } from './src/services/sovereigntyV19';
import { buildDailyInventoryAttestationsV19 } from './src/modules/logistics/AILogisticsRoutingEngine';
import { validateTransitPermitV19 } from './src/modules/biosecurity/BiosecurityTransitEngine';
import { profitabilityGuardV19 } from './src/modules/finance/FinancialPolicyEngine';
import { settlePodV19 } from './src/modules/finance/EscrowPODSettlementEngine';
import { parseFieldMediaTranscriptV19 } from './src/modules/chat/MediaDataParser';
import { shouldEscalateV19 } from './src/modules/escalation/EmergencyConsultationEngine';
import { buildExecutiveIssuesV19 } from './src/modules/executive/ExecutiveCommandEngine';
import { availableChickOffersV19 } from './src/modules/hatchery/HatcheryMarketplaceEngine';
import { buildCorporateInvestmentSignalsV19 } from './src/modules/ai/CorporateInvestmentAdvisor';
import { addChatMessageV195, advanceApprovalV195, createBackupSnapshotV195, createReservationV195, globalSearchV195, runDataQualityAuditV195, setCatalogPriceV195, withAuditV195 } from './src/modules/platform/PlatformCoreV19_5';
import { buildEnterpriseCoreV196 } from './src/modules/enterprise/EnterpriseCoreV19_6';
import {
  buildManagedPoultryOperationsV197, buildDailyAvailabilityAttestationsV197, createMarketplaceRequestV197,
  supplierRespondMarketplaceV197, createManagedContractV197, createFlockCycleV197, submitDailyFarmReportV197,
  generateVetDecisionAndTomorrowPlanV197, createFarmRequirementV197, decideFarmRequirementV197, financeApproveRequirementV197,
  issueFarmPurchaseOrderV197, confirmFarmPurchaseOrderSupplierV197, receiveFarmGoodsAndBookCostV197, sendFarmChatMessageV197, generateMarketingReadinessV197, createPoultrySaleV197,
  completeSaleDeliveryV197, generateCycleSettlementV197, validateManagedOperationsV197, customerConfirmMarketplaceRequestV197,
  recordMarketplacePaymentV197, dispatchMarketplaceOrderV197, completeMarketplaceDeliveryV197, escalateMarketplaceToOnCallVetV197
} from './src/modules/managed/ManagedPoultryOperationsV19_7';
import {
  buildV20State, buildFlockMasterRecordV20, closeFlockDayV20, addReconciliationAdjustmentV20, approveReconciliationAdjustmentV20, createReportSnapshotV20, validateV20State
} from './src/modules/v20/EnterprisePoultryCoreV20';
import {
  buildEnterpriseWebStateV202, managerCommandCenterV202, doctorWorkspaceV202, ownerWorkspaceV202, validateEnterpriseWebStateV202,
  createExpenseV202, decideExpenseV202, postJournalV202, createTomorrowPlanV202, updateRoleTaskV202,
  addEmployeeV202, addEmploymentContractV202, createPayrollV202, createEnterpriseReportV202, ensureCostCenterV202, financialStatementsV202, costCenterSummaryV202, type EnvironmentV202
} from './src/modules/v20/EnterpriseWebPlatformV20_2';
import {
  buildEnterpriseFoundationV2021, upsertEnterpriseIdentityV2021, upsertEnterpriseScopeV2021, upsertBranchV2021, upsertDepartmentV2021, upsertRoleDefinitionV2021, createVeterinaryTerritoryV2021,
  assignVeterinarianV2021, resolveVeterinaryCoverageV2021, createVeterinaryHandoverV2021, createDelegationV2021,
  createApprovalRequestV2021, actOnApprovalV2021, registerEvidenceDocumentV2021, emitEnterpriseNotificationV2021,
  validateEnterpriseFoundationV2021, authorizeEnterpriseActionV2021, effectivePermissionsV2021, upsertMasterDataEntryV2021, updateLocalizationV2021, veterinaryWorkloadV2021, type EnterpriseResourceContextV2021
} from './src/modules/v20/EnterpriseFoundationV20_2_1';
import {
  buildVeterinaryFieldStateV2022, createWorkerDailyClosingV2022, validateWorkerDailyClosingV2022, analyzeWorkerClosingV2022,
  submitVeterinaryReviewV2022, requestSpecialistConsultationV2022, respondToConsultationV2022, requestLabSampleV2022, advanceLabSampleV2022,
  prescribeMedicationV2022, recordTaskExecutionV2022, reviewTaskExecutionV2022, scheduleVeterinaryFollowUpV2022, completeVeterinaryFollowUpV2022,
  closeMedicalCaseV2022, issueTomorrowPlanFromVeterinaryReviewV2022, runAutomaticClinicalEscalationsV2022, acknowledgeClinicalEscalationV2022,
  veterinaryDailyQueueV2022, caseTimelineV2022, withdrawalLocksV2022, validateVeterinaryFieldStateV2022
} from './src/modules/v20/VeterinaryFieldOperationsV20_2_2';
import {
  buildMultiBusinessEnterpriseStateV2023, ensureMultiBusinessFinanceV2023, createBusinessUnitV2023, createBusinessContractV2023, linkFarmToBusinessUnitV2023,
  assignBusinessStaffV2023, createCustomerV2023, createSupplierV2023, createProductV2023, createWarehouseV2023, createTreasuryAccountV2023, createFactoryProfileV2023, addRawMaterialDefinitionV2023, updateRawMaterialNutrientsV2023,
  createPurchaseOrderV2023, receivePurchaseOrderV2023, createSalesInvoiceV2023, recordCustomerReceiptV2023, recordSupplierPaymentV2023,
  createStockTransferV2023, dispatchStockTransferV2023, receiveStockTransferV2023, platformBusinessDashboardV2023, businessUnitDashboardV2023,
  customerStatementV2023, supplierStatementV2023, factoryDashboardV2023, validateMultiBusinessStateV2023
} from './src/modules/v20/MultiBusinessEnterpriseV20_2_3';
import {
  buildFeedFactoryOperationsStateV2024, ensureFactoryFinanceV2024, createFeedFormulaV2024, submitFormulaForReviewV2024, approveFeedFormulaV2024,
  createPurchaseRequisitionV2024, approvePurchaseRequisitionV2024, addSupplierQuoteV2024, awardSupplierQuoteV2024,
  createManufacturingOrderV2024, approveManufacturingOrderV2024, startManufacturingOrderV2024, completeManufacturingOrderV2024,
  createFactoryDispatchV2024, approveFactoryDispatchV2024, dispatchFactoryGoodsV2024, receiveFactoryDispatchV2024, recordFarmFeedConsumptionV2024,
  factoryOperationsDashboardV2024, productionCostReportV2024, validateFeedFactoryStateV2024
} from './src/modules/v20/FeedFactoryOperationsV20_2_4';
import {
  buildWorkforcePayrollStateV2025, ensureWorkforceFinanceV2025, createWorkforceEmployeeV2025, createCompensationContractV2025, createWorkforceAssignmentV2025,
  createWorkScheduleV2025, recordAttendanceV2025, requestLeaveV2025, decideLeaveV2025, createCommissionRuleV2025, requestEmployeeAdvanceV2025,
  approveEmployeeAdvanceV2025, payEmployeeAdvanceV2025, createPayrollPeriodV2025, generatePayrollLineV2025, approvePayrollPeriodV2025, payPayrollLineV2025,
  createTransportTripV2025, allocateFactoryLaborV2025, manufacturingLaborCostV2025, registerEmployeeDocumentV2025, createPerformanceSnapshotV2025,
  workforceDashboardV2025, employee360V2025, payrollRegisterV2025, validateWorkforcePayrollStateV2025
} from './src/modules/v20/WorkforcePayrollManagedBusinessV20_2_5';
import {
  buildExecutiveIntelligenceStateV2026, executiveCommandCenterV2026, profitabilityV2026, financeControlV2026,
  inventoryIntelligenceV2026, factoryIntelligenceV2026, veterinaryIntelligenceV2026, workforceIntelligenceV2026,
  refreshControlExceptionsV2026, updateControlExceptionV2026, runDataQualityScanV2026, runReconciliationV2026,
  generateIntelligenceReportV2026, createReportScheduleV2026, drilldownV2026, validateExecutiveIntelligenceStateV2026
} from './src/modules/v20/ExecutiveIntelligenceBusinessControlV20_2_6';
import {
  buildWindowsCompletionStateV2027, windowsCompletionDashboardV2027, validateWindowsCompletionStateV2027, hasClosurePermissionV2027,
  registerDeviceSessionV2027, revokeDeviceSessionV2027, enrollMfaV2027, recordOrganizationLifecycleV2027, planApprovedVeterinarianLeaveCoverageV2027,
  dispenseMedicationLotV2027, createAccountingPeriodV2027, closeAccountingPeriodV2027, reopenAccountingPeriodV2027, reconcileBankV2027, approveFxRateV2027, createBudgetV2027,
  upsertFlockFinanceRuleV2027, postFlockFinancialEventV2027, flockProfitabilityV2027, runThreeWayMatchV2027, refreshSupplierScorecardsV2027, createProcurementClaimV2027,
  createCycleCountV2027, approveAndPostCycleCountV2027, quarantineInventoryLotV2027, decideInventoryQuarantineV2027, recordFactoryQcV2027, solveLeastCostFormulaV2027, createProductionPlanV2027,
  renewCompensationContractV2027, renewBusinessContractV2027, generatePayslipV2027, veterinaryKpisV2027, workforceKpisV2027, indexEvidenceDocumentV2027, queueNotificationDeliveryV2027, markNotificationDeliveryV2027, executeReportScheduleV2027,
  setLocalizationPreferenceV2027, enqueueOfflineCommandV2027, completeOfflineCommandV2027, type ClosurePermissionV2027
} from './src/modules/v20/WindowsCompletionControlClosureV20_2_7';
import {
  buildFarmDivisionStateV2029, validateFarmDivisionV2029, FARM_DIVISION_ACCEPTANCE_V2029
} from './src/modules/v20/FarmDivisionCompletionV20_2_9';
import { FARM_DIVISION_SCREEN_COUNT_V2029, FARM_DIVISION_SECTIONS_V2029 } from './src/modules/v20/FarmDivisionScreenRegistryV20_2_9';
import { buildOperationalReadinessR81, analyzeOperationalContextR81 } from './src/modules/v20/OperationalReadinessR8_1';
import { answerPoultrySizingQuestionR81 } from './src/modules/ai/PoultryScientificCalculatorR81';
import {
  buildAuthRuntimeV2021, loadAuthStoreV2021, saveAuthStoreV2021, ensureBootstrapCredentialV2021, verifyPasswordV2021,
  issueAccessTokenV2021, verifyAccessTokenV2021, revokeAccessTokenV2021, publicAuthStatusV2021, createCredentialV2021, changeCredentialPasswordV2021, setCredentialDisabledV2021,
  issueRefreshSessionV2027, rotateRefreshSessionV2027, revokeRefreshSessionV2027, revokeUserRefreshSessionsV2027,
  type AuthClaimsV2021
} from './src/server/authV20_2_1';

const app = express();
const PORT = Number(process.env.PORT || 3000);
const SPP_ENVIRONMENT = (String(process.env.SPP_ENVIRONMENT || 'DEVELOPMENT').toUpperCase() as EnvironmentV202);
const RUNTIME_ENVIRONMENT:EnvironmentV202 = ['DEMO','DEVELOPMENT','STAGING','PRODUCTION'].includes(SPP_ENVIRONMENT) ? SPP_ENVIRONMENT : 'DEVELOPMENT';

app.use(express.json({ limit: '15mb' }));


// Android/Capacitor clients call this API from a WebView origin.
// Configure production origins with CORS_ORIGINS (comma-separated).
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost,https://localhost,capacitor://localhost')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes('*') || allowedOrigins.includes(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Role, X-User-Id, X-User-Name, X-Device-Id');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

function requireV202Roles(roles:string[]){
  return (req:Request,res:Response,next:NextFunction)=>{
    const header=String(req.headers.authorization||'');
    const token=header.startsWith('Bearer ')?header.slice(7).trim():'';
    if(token){
      const checked=verifyAccessTokenV2021(authRuntimeV2021,authStoreV2021,token);
      if(!checked.ok||!checked.claims){res.status(401).json({success:false,error:checked.reason||'authentication_required'});return;}
      const alias:Record<string,string>={SYSTEM_OWNER:'system_owner',EXECUTIVE_MANAGER:'ceo',FINANCE_OFFICER:'finance',FIELD_VET:'field_vet',SPECIALIST_CONSULTANT:'vet_consultant',FARM_WORKER:'worker',FARM_OWNER:'farmer',LABORATORY:'laboratory'};
      const role=alias[checked.claims.role_code]||String(checked.claims.role_code||'').toLowerCase();
      if(role!=='system_owner'&&!roles.includes(role)){res.status(403).json({success:false,error:'forbidden_v20_2_role',required_roles:roles});return;}
      res.locals.auth_v20_2_1=checked.claims;next();return;
    }
    if(RUNTIME_ENVIRONMENT==='PRODUCTION'||RUNTIME_ENVIRONMENT==='STAGING'){res.status(401).json({success:false,error:'bearer_authentication_required_for_legacy_v20_2'});return;}
    const role=String(req.headers['x-user-role']||'');
    if(!role||(!roles.includes(role)&&role!=='system_owner')){ res.status(403).json({success:false,error:'forbidden_v20_2_role',required_roles:roles}); return; }
    res.setHeader('X-SPP-Auth-Warning','legacy-header-compatibility-development-only');
    next();
  };
}

// In-memory persistent state initialized with realistic data
let farms = [...INITIAL_FARMS];
let flocks = [...INITIAL_FLOCKS];
let dailyLogs: DailyLog[] = [...INITIAL_DAILY_LOGS];
let necropsyCases: NecropsyCase[] = [...INITIAL_NECROPSY_CASES];
let labReports: LabSensitivityResult[] = [...INITIAL_LAB_REPORTS];
let prescriptions: Prescription[] = [...INITIAL_PRESCRIPTIONS];
let acousticSessions: AcousticAnalysisSession[] = [...INITIAL_ACOUSTIC_SESSIONS];
let outbreaks: EpidemiologicalOutbreak[] = [...INITIAL_OUTBREAKS];

// V11 development persistence: durable JSON state. Production can replace this adapter
// with PostgreSQL/Firebase without changing the client contract.
const runtimeDataDir = path.resolve(process.cwd(), 'runtime-data');
const enterpriseStateFile = path.join(runtimeDataDir, `enterprise-${RUNTIME_ENVIRONMENT.toLowerCase()}.json`);
const legacyEnterpriseStateFile = path.join(runtimeDataDir, 'enterprise-v11.json');
if (!fs.existsSync(runtimeDataDir)) fs.mkdirSync(runtimeDataDir, { recursive: true });

function scrubArraysDeep<T>(value:T):T {
  if (Array.isArray(value)) return [] as T;
  if (value && typeof value === 'object') {
    const out:Record<string,unknown>={};
    for (const [key,item] of Object.entries(value as Record<string,unknown>)) out[key]=scrubArraysDeep(item);
    return out as T;
  }
  return value;
}

function productionInitialEnterpriseState():EnterpriseOperationsV11State {
  const clean=scrubArraysDeep(JSON.parse(JSON.stringify(INITIAL_ENTERPRISE_V11))) as EnterpriseOperationsV11State;
  const bootstrapUser={id:'prod-system-owner',name:String(process.env.SPP_BOOTSTRAP_ADMIN_NAME||'Production Administrator'),role:'system_owner' as const,phone:String(process.env.SPP_BOOTSTRAP_ADMIN_PHONE||''),governorate:String(process.env.SPP_BOOTSTRAP_ADMIN_GOVERNORATE||''),status:'active' as const,permissions:['*']};
  const platform={...clean.platform_core_v19_5,version:'19.5' as const,active_user_id:bootstrapUser.id,users:[bootstrapUser],staff:[],suppliers:[],supplier_branches:[],catalog:[],price_history:[],inventory_lots:[],inventory_reservations:[],inventory_movements:[],procurement:[],recalls:[],cold_chain_events:[],cases:[],complaints:[],appointments:[],chat_rooms:[],chat_messages:[],approvals:[],documents:[],notifications:[],audit:[],data_quality:[],emergency_modes:[],backups:[],ai_governance:[],fraud_signals:[],support_tickets:[]};
  const enterprise=buildEnterpriseCoreV196(platform, undefined);
  const managed=buildManagedPoultryOperationsV197(platform,enterprise,undefined);
  return {...clean,platform_core_v19_5:platform,enterprise_core_v19_6:enterprise,managed_operations_v19_7:managed,v20_core:buildV20State(),enterprise_web_v20_2:buildEnterpriseWebStateV202(undefined,'PRODUCTION'),enterprise_foundation_v20_2_1:buildEnterpriseFoundationV2021(),veterinary_field_v20_2_2:buildVeterinaryFieldStateV2022(),multi_business_v20_2_3:buildMultiBusinessEnterpriseStateV2023(),feed_factory_v20_2_4:buildFeedFactoryOperationsStateV2024(),workforce_payroll_v20_2_5:buildWorkforcePayrollStateV2025(),executive_intelligence_v20_2_6:buildExecutiveIntelligenceStateV2026(),windows_completion_v20_2_7:buildWindowsCompletionStateV2027(),farm_division_v20_2_9:buildFarmDivisionStateV2029()};
}

function loadEnterpriseState(): EnterpriseOperationsV11State {
  try {
    const stateSource=fs.existsSync(enterpriseStateFile)?enterpriseStateFile:(RUNTIME_ENVIRONMENT==='DEVELOPMENT'&&fs.existsSync(legacyEnterpriseStateFile)?legacyEnterpriseStateFile:undefined);
    if (stateSource) {
      const parsed = JSON.parse(fs.readFileSync(stateSource, 'utf8'));
      return {
        ...INITIAL_ENTERPRISE_V11,
        ...parsed,
        sovereignty_v19: {
          ...INITIAL_ENTERPRISE_V11.sovereignty_v19,
          ...(parsed.sovereignty_v19 || {})
        },
        platform_core_v19_5: {
          ...INITIAL_ENTERPRISE_V11.platform_core_v19_5,
          ...(parsed.platform_core_v19_5 || {})
        },
        enterprise_core_v19_6: buildEnterpriseCoreV196(
          { ...INITIAL_ENTERPRISE_V11.platform_core_v19_5, ...(parsed.platform_core_v19_5 || {}) },
          parsed.enterprise_core_v19_6 || INITIAL_ENTERPRISE_V11.enterprise_core_v19_6
        ),
        managed_operations_v19_7: buildManagedPoultryOperationsV197(
          { ...INITIAL_ENTERPRISE_V11.platform_core_v19_5, ...(parsed.platform_core_v19_5 || {}) },
          buildEnterpriseCoreV196(
            { ...INITIAL_ENTERPRISE_V11.platform_core_v19_5, ...(parsed.platform_core_v19_5 || {}) },
            parsed.enterprise_core_v19_6 || INITIAL_ENTERPRISE_V11.enterprise_core_v19_6
          ),
          parsed.managed_operations_v19_7 || INITIAL_ENTERPRISE_V11.managed_operations_v19_7
        ),
        v20_core: buildV20State(parsed.v20_core || INITIAL_ENTERPRISE_V11.v20_core),
        enterprise_web_v20_2: buildEnterpriseWebStateV202(parsed.enterprise_web_v20_2 || INITIAL_ENTERPRISE_V11.enterprise_web_v20_2, RUNTIME_ENVIRONMENT),
        enterprise_foundation_v20_2_1: buildEnterpriseFoundationV2021(parsed.enterprise_foundation_v20_2_1 || INITIAL_ENTERPRISE_V11.enterprise_foundation_v20_2_1),
        veterinary_field_v20_2_2: buildVeterinaryFieldStateV2022(parsed.veterinary_field_v20_2_2 || INITIAL_ENTERPRISE_V11.veterinary_field_v20_2_2),
        multi_business_v20_2_3: buildMultiBusinessEnterpriseStateV2023(parsed.multi_business_v20_2_3 || INITIAL_ENTERPRISE_V11.multi_business_v20_2_3),
        feed_factory_v20_2_4: buildFeedFactoryOperationsStateV2024(parsed.feed_factory_v20_2_4 || INITIAL_ENTERPRISE_V11.feed_factory_v20_2_4),
        workforce_payroll_v20_2_5: buildWorkforcePayrollStateV2025(parsed.workforce_payroll_v20_2_5 || INITIAL_ENTERPRISE_V11.workforce_payroll_v20_2_5),
        executive_intelligence_v20_2_6: buildExecutiveIntelligenceStateV2026(parsed.executive_intelligence_v20_2_6 || INITIAL_ENTERPRISE_V11.executive_intelligence_v20_2_6),
        windows_completion_v20_2_7: buildWindowsCompletionStateV2027(parsed.windows_completion_v20_2_7 || INITIAL_ENTERPRISE_V11.windows_completion_v20_2_7),
        farm_division_v20_2_9: buildFarmDivisionStateV2029(parsed.farm_division_v20_2_9 || INITIAL_ENTERPRISE_V11.farm_division_v20_2_9)
      };
    }
  } catch (error) {
    console.warn('Unable to load V11 enterprise state, using defaults:', error);
  }
  if(RUNTIME_ENVIRONMENT==='PRODUCTION') return productionInitialEnterpriseState();
  return { ...INITIAL_ENTERPRISE_V11, enterprise_web_v20_2: buildEnterpriseWebStateV202(INITIAL_ENTERPRISE_V11.enterprise_web_v20_2, RUNTIME_ENVIRONMENT), enterprise_foundation_v20_2_1: buildEnterpriseFoundationV2021(INITIAL_ENTERPRISE_V11.enterprise_foundation_v20_2_1), veterinary_field_v20_2_2: buildVeterinaryFieldStateV2022(INITIAL_ENTERPRISE_V11.veterinary_field_v20_2_2), multi_business_v20_2_3: buildMultiBusinessEnterpriseStateV2023(INITIAL_ENTERPRISE_V11.multi_business_v20_2_3), feed_factory_v20_2_4: buildFeedFactoryOperationsStateV2024(INITIAL_ENTERPRISE_V11.feed_factory_v20_2_4), workforce_payroll_v20_2_5: buildWorkforcePayrollStateV2025(INITIAL_ENTERPRISE_V11.workforce_payroll_v20_2_5), executive_intelligence_v20_2_6: buildExecutiveIntelligenceStateV2026(INITIAL_ENTERPRISE_V11.executive_intelligence_v20_2_6), windows_completion_v20_2_7: buildWindowsCompletionStateV2027(INITIAL_ENTERPRISE_V11.windows_completion_v20_2_7), farm_division_v20_2_9: buildFarmDivisionStateV2029(INITIAL_ENTERPRISE_V11.farm_division_v20_2_9) };
}

let enterpriseV11: EnterpriseOperationsV11State = loadEnterpriseState();

const enterpriseBackupDir = path.join(runtimeDataDir, 'backups');
const enterpriseAuditFile = path.join(runtimeDataDir, 'audit-v11.jsonl');
if (!fs.existsSync(enterpriseBackupDir)) fs.mkdirSync(enterpriseBackupDir, { recursive: true });

function persistEnterpriseState(actor = 'system_owner', action = 'enterprise_state_update') {
  const tmp = `${enterpriseStateFile}.tmp`;
  const payload = JSON.stringify(enterpriseV11, null, 2);
  fs.writeFileSync(tmp, payload, 'utf8');
  fs.renameSync(tmp, enterpriseStateFile);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  fs.writeFileSync(path.join(enterpriseBackupDir, `enterprise-${stamp}.json`), payload, 'utf8');
  const backups = fs.readdirSync(enterpriseBackupDir).filter((name) => name.endsWith('.json')).sort();
  while (backups.length > 20) {
    const oldest = backups.shift();
    if (oldest) fs.unlinkSync(path.join(enterpriseBackupDir, oldest));
  }
  fs.appendFileSync(enterpriseAuditFile, JSON.stringify({ at: new Date().toISOString(), actor, action }) + '\n', 'utf8');
}


const authRuntimeV2021 = buildAuthRuntimeV2021(runtimeDataDir, RUNTIME_ENVIRONMENT);
let authStoreV2021 = loadAuthStoreV2021(authRuntimeV2021);
{
  const activeUserId=enterpriseV11.platform_core_v19_5.active_user_id || (RUNTIME_ENVIRONMENT==='PRODUCTION'?'prod-system-owner':'usr-owner');
  const bootstrap=ensureBootstrapCredentialV2021(authRuntimeV2021,authStoreV2021,{user_id:activeUserId,role_code:'SYSTEM_OWNER',permission_codes:['*']});
  authStoreV2021=bootstrap.store;
}

// Additive registration queue. The existing authentication store remains authoritative.
const registrationFile = path.join(runtimeDataDir, 'user-registration-requests.json');
let registrations: UserRegistration[] = [];
try {
  if (fs.existsSync(registrationFile)) {
    const parsed: unknown = JSON.parse(fs.readFileSync(registrationFile, 'utf8'));
    if (Array.isArray(parsed)) registrations = parsed as UserRegistration[];
  }
} catch (error) { throw new Error('registration_store_unreadable: ' + String(error)); }
function saveRegistrations(): void {
  fs.mkdirSync(runtimeDataDir, {recursive:true});
  const temp = registrationFile + '.' + randomUUID() + '.tmp';
  fs.writeFileSync(temp, JSON.stringify(registrations, null, 2), {encoding:'utf8',mode:0o600});
  fs.renameSync(temp, registrationFile);
}
function registrationManager(req:Request,res:Response,next:NextFunction):void {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i,'').trim();
  const checked = token && verifyAccessTokenV2021(authRuntimeV2021,authStoreV2021,token);
  if (!checked || !checked.ok || !checked.claims) {res.status(401).json({success:false,error:'authentication_required'});return;}
  if (checked.claims.role_code !== 'SYSTEM_OWNER') {res.status(403).json({success:false,error:'system_owner_required'});return;}
  res.locals.registrationManager = checked.claims.sub;
  next();
}
// Public endpoint, but only creates a disabled credential; it grants no access.
app.post('/api/registration/request', (req:Request,res:Response) => {
  const username = String(req.body?.username || '').trim().toLowerCase();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const display_name = String(req.body?.display_name || '').trim();
  const password = String(req.body?.password || '');
  if (!/^[a-z0-9._-]{3,64}$/.test(username) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || display_name.length<2 || display_name.length>150 || password.length<12 || password.length>256) {
    res.status(400).json({success:false,error:'invalid_registration_fields'});return;
  }
  if (registrations.some(r=>r.email===email) || authStoreV2021.credentials.some(c=>c.username===username)) {
    res.status(409).json({success:false,error:'registration_already_exists'});return;
  }
  const user_id = 'usr-' + randomUUID();
  try {
    const created = createCredentialV2021(authStoreV2021,{user_id,username,password,role_code:'REGISTRATION_PENDING',permission_codes:[]});
    authStoreV2021 = setCredentialDisabledV2021(created,user_id,true);
    saveAuthStoreV2021(authRuntimeV2021,authStoreV2021);
    const row:UserRegistration={id:'reg-'+randomUUID(),user_id,username,email,display_name,requested_department:String(req.body?.requested_department||'').slice(0,100),requested_organization:String(req.body?.requested_organization||'').slice(0,150),status:'PENDING',created_at:new Date().toISOString()};
    registrations.push(row);saveRegistrations();
    res.status(202).json({success:true,id:row.id,status:row.status});
  } catch(error) {res.status(500).json({success:false,error:'registration_failed'});}
});
app.get('/api/registration/requests',registrationManager,(_req:Request,res:Response)=>{
  res.setHeader('Cache-Control','no-store');res.json({success:true,requests:registrations});
});
app.post('/api/registration/requests/:id/decision',registrationManager,(req:Request,res:Response)=>{
  const row=registrations.find(r=>r.id===req.params.id);
  if(!row){res.status(404).json({success:false,error:'request_not_found'});return;}
  if(row.status!=='PENDING'){res.status(409).json({success:false,error:'already_reviewed'});return;}
  const decision=String(req.body?.decision||'').toUpperCase();
  if(!['APPROVED','REJECTED'].includes(decision)){res.status(400).json({success:false,error:'invalid_decision'});return;}
  const credential=authStoreV2021.credentials.find(c=>c.user_id===row.user_id);
  if(!credential){res.status(409).json({success:false,error:'credential_missing'});return;}
  if(decision==='APPROVED') {
    // An owner must first provision an active, scoped identity using the existing identity API.
    const identity=enterpriseV11.enterprise_foundation_v20_2_1.identities.find(i=>i.user_id===row.user_id && i.active && i.role_code!=='SYSTEM_OWNER' && i.role_code!=='REGISTRATION_PENDING');
    if(!identity || !identity.scope_ids?.length){res.status(409).json({success:false,error:'active_scoped_identity_required_before_approval'});return;}
    authStoreV2021={...authStoreV2021,credentials:authStoreV2021.credentials.map(c=>c.user_id===row.user_id?{...c,role_code:identity.role_code,permission_codes:[],disabled:false,auth_version:c.auth_version+1}:c)};
  }
  row.status=decision as 'APPROVED'|'REJECTED';row.reviewed_at=new Date().toISOString();row.reviewed_by=String(res.locals.registrationManager);
  if(decision==='REJECTED'){row.rejection_reason=String(req.body?.reason||'').slice(0,500);}
  saveAuthStoreV2021(authRuntimeV2021,authStoreV2021);saveRegistrations();
  res.json({success:true,request:row});
});

function requireAuthV2021(permission?:string){
  return (req:Request,res:Response,next:NextFunction)=>{
    const header=String(req.headers.authorization||'');
    const token=header.startsWith('Bearer ')?header.slice(7).trim():'';
    if(!token){res.status(401).json({success:false,error:'authentication_required'});return;}
    const checked=verifyAccessTokenV2021(authRuntimeV2021,authStoreV2021,token);
    if(!checked.ok||!checked.claims){res.status(401).json({success:false,error:checked.reason});return;}
    const identity=enterpriseV11.enterprise_foundation_v20_2_1.identities.find(i=>i.user_id===checked.claims!.sub&&i.active);
    if(checked.claims.role_code!=='SYSTEM_OWNER'&&!identity){res.status(403).json({success:false,error:'enterprise_identity_required'});return;}
    if(identity&&identity.role_code!==checked.claims.role_code){res.status(401).json({success:false,error:'role_changed_reauthenticate'});return;}
    const effectivePermissions=checked.claims.role_code==='SYSTEM_OWNER'?['*']:effectivePermissionsV2021(enterpriseV11.enterprise_foundation_v20_2_1,enterpriseV11.enterprise_web_v20_2,checked.claims.sub);
    if(permission&&!(effectivePermissions.includes('*')||effectivePermissions.includes(permission))){res.status(403).json({success:false,error:'permission_denied',permission});return;}
    res.locals.auth_v20_2_1=checked.claims;
    res.locals.permissions_v20_2_1=effectivePermissions;
    next();
  };
}

function authClaimsV2021(res:Response):AuthClaimsV2021{
  return res.locals.auth_v20_2_1 as AuthClaimsV2021;
}

function requireClosurePermissionV2027(permission:ClosurePermissionV2027){
  return (_req:Request,res:Response,next:NextFunction)=>{
    const claims=authClaimsV2021(res);
    if(claims.role_code==='SYSTEM_OWNER'||hasClosurePermissionV2027(enterpriseV11.windows_completion_v20_2_7,claims.role_code,permission)){next();return;}
    res.status(403).json({success:false,error:'v20_2_7_permission_denied',permission});
  };
}

function foundationContextFromRequest(req:Request):EnterpriseResourceContextV2021{
  return {branch_id:String(req.query.branch_id||req.body?.branch_id||'')||undefined,governorate:String(req.query.governorate||req.body?.governorate||'')||undefined,district:String(req.query.district||req.body?.district||'')||undefined,farm_id:String(req.query.farm_id||req.body?.farm_id||'')||undefined,flock_id:String(req.query.flock_id||req.body?.flock_id||'')||undefined};
}

function authorizeScopedV2022(res:Response,permission:string,context:EnterpriseResourceContextV2021){
  const claims=authClaimsV2021(res);
  if(claims.role_code==='SYSTEM_OWNER') return {allowed:true,reason:'system_owner'};
  return authorizeEnterpriseActionV2021(enterpriseV11.enterprise_foundation_v20_2_1,enterpriseV11.enterprise_web_v20_2,claims.sub,permission,context);
}

function scopedOr403V2022(res:Response,permission:string,context:EnterpriseResourceContextV2021){
  const access=authorizeScopedV2022(res,permission,context);
  if(!access.allowed){res.status(403).json({success:false,error:access.reason,permission});return false;}
  return true;
}


function businessAccessV2023(res:Response,businessUnitId?:string,mode:'read'|'operate'|'finance'|'admin'='read'){
  const claims=authClaimsV2021(res);
  if(claims.role_code==='SYSTEM_OWNER') return true;
  const globalByMode:Record<string,string[]>={read:['EXECUTIVE_MANAGER','FINANCE_OFFICER'],operate:['EXECUTIVE_MANAGER'],finance:['EXECUTIVE_MANAGER','FINANCE_OFFICER'],admin:['EXECUTIVE_MANAGER']};
  if(globalByMode[mode]?.includes(claims.role_code)) return true;
  if(businessUnitId){
    const assignment=enterpriseV11.multi_business_v20_2_3.staff_assignments.find(x=>x.business_unit_id===businessUnitId&&x.user_id===claims.sub&&x.active);
    if(assignment){
      if(mode==='read')return true;
      if(mode==='finance'&&['OFFICE_MANAGER','ACCOUNTANT','FINANCE_OFFICER'].includes(assignment.role_code))return true;
      if(mode==='operate'&&['OFFICE_MANAGER','WAREHOUSE_OFFICER','PROCUREMENT_OFFICER','SALES_OFFICER','FACTORY_MANAGER'].includes(assignment.role_code))return true;
      if(mode==='admin'&&assignment.role_code==='OFFICE_MANAGER')return true;
    }
  }
  return false;
}
function businessOr403V2023(res:Response,businessUnitId?:string,mode:'read'|'operate'|'finance'|'admin'='read'){
  if(businessAccessV2023(res,businessUnitId,mode))return true;
  res.status(403).json({success:false,error:'business_unit_scope_denied',business_unit_id:businessUnitId,mode});return false;
}


// V20.2.7 production closure: preserve every legacy route, but do not allow
// unauthenticated state-changing access in STAGING/PRODUCTION. Public health,
// login/refresh and verification endpoints remain available.
app.use('/api', (req:Request,res:Response,next:NextFunction)=>{
  if(!['STAGING','PRODUCTION'].includes(RUNTIME_ENVIRONMENT)){next();return;}
  const fullPath=String(req.originalUrl||req.url).split('?')[0];
  const publicExact=new Set(['/api/health','/api/v20.2.1/auth/status','/api/v20.2.1/auth/login','/api/v20.2.7/auth/refresh','/api/registration/request']);
  const publicPrefix=['/api/v19/quality/'];
  if(publicExact.has(fullPath)||publicPrefix.some(p=>fullPath.startsWith(p))){next();return;}
  const sensitiveRead=req.method==='GET'&&(fullPath.startsWith('/api/v11/')||fullPath.startsWith('/api/v20.')||fullPath.startsWith('/api/v12/')||fullPath.startsWith('/api/v14/')||fullPath.startsWith('/api/v15/')||fullPath.startsWith('/api/v16/')||fullPath.startsWith('/api/v17/')||fullPath.startsWith('/api/v19/'));
  const mutating=!['GET','HEAD','OPTIONS'].includes(req.method);
  if(!mutating&&!sensitiveRead){next();return;}
  const header=String(req.headers.authorization||'');
  const token=header.startsWith('Bearer ')?header.slice(7).trim():'';
  if(!token){res.status(401).json({success:false,error:'bearer_authentication_required_v20_2_7'});return;}
  const checked=verifyAccessTokenV2021(authRuntimeV2021,authStoreV2021,token);
  if(!checked.ok||!checked.claims){res.status(401).json({success:false,error:checked.reason||'authentication_required'});return;}
  res.locals.auth_v20_2_1=checked.claims;
  next();
});


// Lazy helper to get Gemini instance with recommended headers
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// ----------------------------------------------------
// Health Check Endpoint
// ----------------------------------------------------
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    project: 'المنصة الوطنية للسيادة البيطرية والداجنة الذكية',
    supervisor: 'الطبيب البيطري الاستشاري المعتمد',
    gemini_configured: Boolean(process.env.GEMINI_API_KEY),
    v11_persistence: 'local_json',
    v11_state_file: enterpriseStateFile,
    v12_commercial_clinical_modules: true,
    v12_ai_advisor_enabled: Boolean(enterpriseV11.ai_advisor_v12?.enabled),
    v13_farm_management_modules: true,
    v13_cloud_ready: enterpriseV11.deployment_readiness_v13?.every((x) => x.status === 'production_ready') || false,
    v14_field_workspace: true,
    v14_cloud_mode: enterpriseV11.cloud_production_v14?.database_connection_status || 'local_only',
    v14_media_storage: enterpriseV11.cloud_production_v14?.media_storage_status || 'local_only',
    v15_indexeddb_offline: Boolean(enterpriseV11.offline_sync_v15?.indexeddb_enabled),
    v15_conflict_strategy: enterpriseV11.offline_sync_v15?.conflict_strategy || 'last_write_wins',
    v15_excel_exchange: true,
    v15_android_hardware_bridge: true,
    v16_leadership_war_room: true,
    v16_crm_customer_360: true,
    v16_field_force_gps: true,
    v20_2_3_multi_business_enterprise: true,
    v20_2_3_financial_inventory_integration: true,
    v20_2_3_factory_foundation: true,
    v19_7_managed_operations: true,
    v19_7_broker_availability_network: true,
    v19_7_ai_final_medical_decision: false,
    v20_1_architecture_registry: true,
    v20_1_flock_accounting: true,
    v20_2_1_foundation: true,
    v20_2_1_auth_ready: authRuntimeV2021.ready,
    v20_2_1_auth_bootstrap_configured: authStoreV2021.credentials.length > 0,
    v20_1_population_reconciliation: true,
    v20_2_enterprise_web: true,
    v20_2_environment: RUNTIME_ENVIRONMENT,
    v20_2_double_entry_gl: true,
    v20_2_hr_payroll: true,
    v20_2_cost_responsibility_matrix: true,
    v20_2_veterinary_tasking: true,
    v16_whatsapp_adapter_configured: Boolean(process.env.WHATSAPP_API_URL && process.env.WHATSAPP_ACCESS_TOKEN),
    v17_sequential_broker_routing: true,
    v17_supplier_failover_routing: true,
    v17_finance_settlement_guard: true,
    v17_lease_escrow: true
  });
});

// Farm isolation: never trust client-provided role, owner name, or farm scope.
// Scope decisions are evaluated against authenticated server-side identities.
function authorizedFarmIdsV2026(res:Response):Set<string>{
  const claims=authClaimsV2021(res);
  if(claims.role_code==='SYSTEM_OWNER')return new Set(farms.map(f=>f.id));
  const foundation=enterpriseV11.enterprise_foundation_v20_2_1;
  const identity=foundation.identities.find(x=>x.user_id===claims.sub&&x.active&&x.role_code===claims.role_code);
  if(!identity)return new Set();
  const allowed=new Set<string>();
  const seen=new Set<string>();
  const visit=(id:string):void=>{
    if(seen.has(id))return;
    seen.add(id);
    const scope=foundation.scopes.find(x=>x.id===id&&x.active);
    if(!scope)return;
    if(scope.type==='global')farms.forEach(f=>allowed.add(f.id));
    scope.farm_ids.forEach(id=>allowed.add(id));
    scope.flock_ids.forEach(id=>{const flock=flocks.find(f=>f.id===id);if(flock)allowed.add(flock.farm_id);});
    scope.inherits_scope_ids.forEach(visit);
  };
  identity.scope_ids.forEach(visit);
  return allowed;
}
function legacyFarmAccessV2026(req:Request,res:Response,next:NextFunction):void{
  const allowed=authorizedFarmIdsV2026(res);
  const claims=authClaimsV2021(res);
  const isOwner=claims.role_code==='SYSTEM_OWNER';
  const farmId=String(req.params.id||req.body?.farm_id||'');
  const flockId=String(req.body?.flock_id||req.query.flockId||'');
  const resolved=flockId?flocks.find(f=>f.id===flockId)?.farm_id:undefined;
  const target=resolved||farmId;
  if(req.method!=='GET'&&!isOwner){
    // Legacy write handlers do not provide transactional scoped persistence.
    // Fail closed until they are replaced with the canonical farm workflow.
    res.status(403).json({success:false,error:'legacy_farm_write_disabled_use_scoped_workflow'});return;
  }
  if(target&&!allowed.has(target)){
    res.status(403).json({success:false,error:'farm_scope_denied'});return;
  }
  res.locals.allowed_farm_ids_v2026=allowed;
  next();
}
app.use(['/api/farms','/api/farms/:id/biosecurity','/api/flocks','/api/daily-logs','/api/necropsy-cases','/api/necropsy-cases/:id'],requireAuthV2021(),legacyFarmAccessV2026);

// ----------------------------------------------------
// Data Endpoints
// ----------------------------------------------------
app.get('/api/farms', (req: Request, res: Response) => {
  res.json(farms.filter(f=> (res.locals.allowed_farm_ids_v2026 as Set<string>).has(f.id)));
});

app.get('/api/flocks', (req: Request, res: Response) => {
  res.json(flocks.filter(f=> (res.locals.allowed_farm_ids_v2026 as Set<string>).has(f.farm_id)));
});

app.get('/api/daily-logs', (req: Request, res: Response) => {
  const { flockId } = req.query;
  if (flockId) {
    res.json(dailyLogs.filter((log) => log.flock_id === flockId && flocks.some(f=>f.id===log.flock_id&&(res.locals.allowed_farm_ids_v2026 as Set<string>).has(f.farm_id))));
  } else {
    res.json(dailyLogs.filter(log=>flocks.some(f=>f.id===log.flock_id&&(res.locals.allowed_farm_ids_v2026 as Set<string>).has(f.farm_id))));
  }
});

app.post('/api/daily-logs', (req: Request, res: Response) => {
  const newLog: DailyLog = {
    id: `log-${Date.now()}`,
    ...req.body,
    synced: true,
    sync_method: req.body.sync_method || 'online'
  };
  dailyLogs.push(newLog);

  // Update current flock count if mortality was logged
  if (newLog.mortality_count) {
    const flock = flocks.find((f) => f.id === newLog.flock_id);
    if (flock) {
      flock.current_count = Math.max(0, flock.current_count - (newLog.mortality_count + (newLog.culling_count || 0)));
    }
  }

  res.status(201).json(newLog);
});

app.get('/api/necropsy-cases', (req: Request, res: Response) => {
  res.json(necropsyCases.filter(c=>flocks.some(f=>f.id===c.flock_id&&(res.locals.allowed_farm_ids_v2026 as Set<string>).has(f.farm_id))));
});

app.post('/api/necropsy-cases', (req: Request, res: Response) => {
  const newCase: NecropsyCase = {
    id: `case-${Date.now()}`,
    ...req.body,
    created_at: new Date().toLocaleString('ar-YE', { hour12: false })
  };
  necropsyCases.unshift(newCase);
  res.status(201).json(newCase);
});

app.patch('/api/necropsy-cases/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = necropsyCases.findIndex((c) => c.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'الحالة غير موجودة' });
    return;
  }
  necropsyCases[index] = {
    ...necropsyCases[index],
    ...req.body
  };
  res.json(necropsyCases[index]);
});

app.get('/api/lab-reports', (req: Request, res: Response) => {
  res.json(labReports);
});

app.post('/api/lab-reports', (req: Request, res: Response) => {
  const newReport: LabSensitivityResult = {
    id: `lab-res-${Date.now()}`,
    ...req.body
  };
  labReports.unshift(newReport);
  res.status(201).json(newReport);
});

app.get('/api/prescriptions', (req: Request, res: Response) => {
  res.json(prescriptions);
});

/**
 * MEDICATION LOCK LOGIC ENFORCEMENT
 * IF (Requested_Medication == "Antibiotic") {
 *     IF (Lab_Sensitivity_Test_Attached == FALSE) {
 *         BLOCK_PRESCRIPTION();
 *         SHOW_ERROR("عفواً، يمنع صرف المضادات الحيوية بدون تقرير فحص حساسية بكتيرية مرفق.");
 *     }
 * }
 */
app.post('/api/prescriptions', (req: Request, res: Response) => {
  const {
    case_id,
    flock_id,
    farm_name,
    vet_id,
    vet_name,
    medication_category,
    medication_name,
    active_ingredient,
    dosage,
    administration_route,
    duration_days,
    withdrawal_days,
    lab_sensitivity_attached,
    lab_sensitivity_id,
    lab_sensitivity_summary
  } = req.body;

  // Strict Antibiotic Lock Enforcement
  if (medication_category === 'antibiotic') {
    if (!lab_sensitivity_attached || !lab_sensitivity_id) {
      res.status(403).json({
        blocked: true,
        error: 'عفواً، يمنع صرف المضادات الحيوية المقيدة بدون تقرير فحص حساسية بكتيرية مرفق ومطابق.',
        error_code: 'ERR_MEDICATION_LOCKED',
        message: 'Selected antibiotic is not marked as Sensitive in the attached lab result.',
        code: 'ERR_MEDICATION_LOCKED'
      });
      return;
    }
  }

  // Calculate harvest safe date based on duration and withdrawal days
  const now = new Date();
  const safeDate = new Date(now.getTime() + (Number(duration_days) + Number(withdrawal_days)) * 24 * 60 * 60 * 1000);
  const formattedSafeDate = safeDate.toISOString().split('T')[0];

  const randomHash = Math.random().toString(36).substring(2, 10).toUpperCase();
  const qrHash = `YE-VET-SECURE:${flock_id}:${medication_name.substring(0, 8)}:${withdrawal_days}D:${randomHash}`;

  const newPrescription: Prescription = {
    id: `rx-${Date.now()}`,
    case_id,
    flock_id,
    farm_name,
    vet_id: vet_id || 'vet-consultant',
    vet_name: vet_name || 'الطبيب البيطري الاستشاري المعتمد',
    medication_category,
    medication_name,
    active_ingredient: active_ingredient || medication_name,
    dosage,
    administration_route: administration_route || 'ماء الشرب',
    duration_days: Number(duration_days) || 3,
    withdrawal_days: Number(withdrawal_days) || 0,
    lab_sensitivity_attached: Boolean(lab_sensitivity_attached),
    lab_sensitivity_id,
    lab_sensitivity_summary,
    qr_code_hash: qrHash,
    created_at: new Date().toISOString(),
    harvest_safe_date: formattedSafeDate,
    status: 'issued_active'
  };

  prescriptions.unshift(newPrescription);
  res.status(201).json(newPrescription);
});

app.get('/api/acoustic-sessions', (req: Request, res: Response) => {
  res.json(acousticSessions);
});

app.post('/api/acoustic-sessions', (req: Request, res: Response) => {
  const newSession: AcousticAnalysisSession = {
    id: `audio-${Date.now()}`,
    ...req.body
  };
  acousticSessions.unshift(newSession);
  res.status(201).json(newSession);
});

// ----------------------------------------------------
// Epidemiological Outbreaks & Biosecurity
// ----------------------------------------------------
app.get('/api/outbreaks', (req: Request, res: Response) => {
  res.json(outbreaks);
});

app.post('/api/outbreaks/:id/broadcast', (req: Request, res: Response) => {
  const { id } = req.params;
  const outbreak = outbreaks.find((o) => o.id === id);
  if (!outbreak) {
    res.status(404).json({ error: 'بؤرة التفشي غير موجودة' });
    return;
  }
  outbreak.alert_broadcasted = true;
  res.json({ success: true, outbreak });
});

app.post('/api/farms/:id/biosecurity', (req: Request, res: Response) => {
  const { id } = req.params;
  const { score } = req.body;
  const farm = farms.find((f) => f.id === id);
  if (!farm) {
    res.status(404).json({ error: 'المزرعة غير موجودة' });
    return;
  }
  farm.biosecurity_score = Number(score);
  res.json({ success: true, farm });
});

// ----------------------------------------------------
// V11 Enterprise Operations API (development persistent adapter)
// ----------------------------------------------------
app.get('/api/v11/enterprise', requireAuthV2021(), (req: Request, res: Response) => {
  if (authClaimsV2021(res).role_code !== 'SYSTEM_OWNER') { res.status(403).json({success:false,error:'platform_owner_only'}); return; }
  res.setHeader('Cache-Control','private, no-store');
  res.json(enterpriseV11);
});

app.put('/api/v11/enterprise', requireAuthV2021(), (req: Request, res: Response) => {
  const claims = authClaimsV2021(res);
  const role = claims.sub;
  if (claims.role_code !== 'SYSTEM_OWNER') {
    res.status(403).json({ error: 'ليس لديك صلاحية تعديل مركز V11.' });
    return;
  }
  enterpriseV11 = {
    ...enterpriseV11,
    ...req.body,
    sovereignty_v19: req.body?.sovereignty_v19
      ? { ...enterpriseV11.sovereignty_v19, ...req.body.sovereignty_v19 }
      : enterpriseV11.sovereignty_v19,
    platform_core_v19_5: req.body?.platform_core_v19_5
      ? { ...enterpriseV11.platform_core_v19_5, ...req.body.platform_core_v19_5 }
      : enterpriseV11.platform_core_v19_5,
    enterprise_core_v19_6: req.body?.enterprise_core_v19_6
      ? buildEnterpriseCoreV196(enterpriseV11.platform_core_v19_5, { ...enterpriseV11.enterprise_core_v19_6, ...req.body.enterprise_core_v19_6 })
      : enterpriseV11.enterprise_core_v19_6,
    managed_operations_v19_7: req.body?.managed_operations_v19_7
      ? buildManagedPoultryOperationsV197(enterpriseV11.platform_core_v19_5, enterpriseV11.enterprise_core_v19_6, { ...enterpriseV11.managed_operations_v19_7, ...req.body.managed_operations_v19_7 })
      : enterpriseV11.managed_operations_v19_7,
    v20_core: req.body?.v20_core
      ? buildV20State({ ...enterpriseV11.v20_core, ...req.body.v20_core })
      : enterpriseV11.v20_core,
    enterprise_web_v20_2: req.body?.enterprise_web_v20_2
      ? buildEnterpriseWebStateV202({ ...enterpriseV11.enterprise_web_v20_2, ...req.body.enterprise_web_v20_2 }, RUNTIME_ENVIRONMENT)
      : enterpriseV11.enterprise_web_v20_2,
    enterprise_foundation_v20_2_1: req.body?.enterprise_foundation_v20_2_1
      ? buildEnterpriseFoundationV2021({ ...enterpriseV11.enterprise_foundation_v20_2_1, ...req.body.enterprise_foundation_v20_2_1 })
      : enterpriseV11.enterprise_foundation_v20_2_1,
    veterinary_field_v20_2_2: req.body?.veterinary_field_v20_2_2
      ? buildVeterinaryFieldStateV2022({ ...enterpriseV11.veterinary_field_v20_2_2, ...req.body.veterinary_field_v20_2_2 })
      : enterpriseV11.veterinary_field_v20_2_2,
    multi_business_v20_2_3: req.body?.multi_business_v20_2_3
      ? buildMultiBusinessEnterpriseStateV2023({ ...enterpriseV11.multi_business_v20_2_3, ...req.body.multi_business_v20_2_3 })
      : enterpriseV11.multi_business_v20_2_3,
    feed_factory_v20_2_4: req.body?.feed_factory_v20_2_4
      ? buildFeedFactoryOperationsStateV2024({ ...enterpriseV11.feed_factory_v20_2_4, ...req.body.feed_factory_v20_2_4 })
      : enterpriseV11.feed_factory_v20_2_4,
    workforce_payroll_v20_2_5: req.body?.workforce_payroll_v20_2_5
      ? buildWorkforcePayrollStateV2025({ ...enterpriseV11.workforce_payroll_v20_2_5, ...req.body.workforce_payroll_v20_2_5 })
      : enterpriseV11.workforce_payroll_v20_2_5,
    farm_division_v20_2_9: req.body?.farm_division_v20_2_9
      ? buildFarmDivisionStateV2029({ ...enterpriseV11.farm_division_v20_2_9, ...req.body.farm_division_v20_2_9 })
      : enterpriseV11.farm_division_v20_2_9
    ,operational_readiness_r8_1: req.body?.operational_readiness_r8_1
      ? buildOperationalReadinessR81({ ...(enterpriseV11.operational_readiness_r8_1 || {}), ...req.body.operational_readiness_r8_1 })
      : buildOperationalReadinessR81(enterpriseV11.operational_readiness_r8_1)
  };
  persistEnterpriseState(role, 'enterprise_state_update');
  res.json({ success: true, enterprise: enterpriseV11 });
});

app.post('/api/v11/enterprise/sync', requireAuthV2021(), (req: Request, res: Response) => {
  const claims = authClaimsV2021(res);
  if (claims.role_code !== 'SYSTEM_OWNER') { res.status(403).json({success:false,error:'platform_owner_only'}); return; }
  enterpriseV11 = {
    ...enterpriseV11,
    backend_runtime: {
      ...enterpriseV11.backend_runtime,
      pending_offline_actions: 0,
      last_server_sync_at: new Date().toISOString()
    }
  };
  persistEnterpriseState(claims.sub, 'offline_queue_sync');
  res.json({ success: true, synced_at: enterpriseV11.backend_runtime.last_server_sync_at });
});



// ----------------------------------------------------
// AviNexus Windows R8.1 — Operational Readiness / Scientific Intelligence
// Cross-cutting layer only; no new department and no parallel inventory/accounting authority.
// ----------------------------------------------------
const weatherCacheR81 = new Map<string,{at:number;payload:any}>();

app.get('/api/r8.1/weather', requireAuthV2021(), async (req: Request, res: Response) => {
  const siteId=String(req.query.site_id||'').trim();
  const lat=Number(req.query.lat),lon=Number(req.query.lon);
  if(!siteId||!Number.isFinite(lat)||!Number.isFinite(lon)){res.status(400).json({error:'site_id_lat_lon_required'});return;}
  const r81=buildOperationalReadinessR81(enterpriseV11.operational_readiness_r8_1);
  const site=r81.sites.find(x=>x.id===siteId);
  if(!site){res.status(404).json({error:'site_not_found'});return;}
  const flock=r81.flock_contexts.find(x=>x.site_id===siteId&&x.status==='active');
  if(flock){
    const claims=authClaimsV2021(res);
    if(claims.role_code!=='SYSTEM_OWNER'){
      const identity=enterpriseV11.enterprise_foundation_v20_2_1.identities.find(x=>x.user_id===claims.sub&&x.active);
      const scopes=identity?enterpriseV11.enterprise_foundation_v20_2_1.scopes.filter(x=>identity.scope_ids.includes(x.id)&&x.active):[];
      const scoped=scopes.some(x=>x.type==='global'||x.farm_ids.includes(flock.farm_id));
      const assigned=enterpriseV11.farm_division_v20_2_9.staff_assignments.some(x=>x.user_id===claims.sub&&x.farm_id===flock.farm_id&&x.status==='active');
      if(!scoped&&!assigned){res.status(403).json({error:'r8_1_site_scope_denied'});return;}
    }
  }
  const cacheKey=`${lat.toFixed(4)},${lon.toFixed(4)}`;const cached=weatherCacheR81.get(cacheKey);const ttl=r81.settings.weather_cache_minutes*60*1000;
  if(cached&&Date.now()-cached.at<ttl){res.json({...cached.payload,cached:true});return;}
  if(r81.settings.weather_provider==='manual_only'){
    const manual=[...r81.weather].filter(x=>x.site_id===siteId).sort((a,b)=>b.captured_at.localeCompare(a.captured_at))[0];
    if(!manual){res.status(503).json({error:'manual_weather_missing'});return;}res.json({...manual,cached:false});return;
  }
  try{
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),7000);
    const url=`https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation&forecast_days=2`;
    const response=await fetch(url,{signal:controller.signal});clearTimeout(timer);
    if(!response.ok)throw new Error(`weather_provider_${response.status}`);
    const raw:any=await response.json();const c=raw.current||{};
    const payload={id:`wx-${Date.now()}`,site_id:siteId,provider:'open_meteo',captured_at:c.time||new Date().toISOString(),outdoor_temperature_c:c.temperature_2m,humidity_pct:c.relative_humidity_2m,wind_speed_kph:c.wind_speed_10m,wind_direction_deg:c.wind_direction_10m,precipitation_mm:c.precipitation,source_quality:'provider',stale:false,provider_timezone:raw.timezone};
    weatherCacheR81.set(cacheKey,{at:Date.now(),payload});res.json({...payload,cached:false});
  }catch(error:any){
    const fallback=[...r81.weather].filter(x=>x.site_id===siteId).sort((a,b)=>b.captured_at.localeCompare(a.captured_at))[0];
    if(fallback){res.json({...fallback,stale:true,cached:true,provider_error:String(error?.message||error)});return;}
    res.status(503).json({error:'weather_provider_unavailable',detail:String(error?.message||error)});
  }
});

app.post('/api/r8.1/intelligence/analyze', requireAuthV2021(), async (req: Request, res: Response) => {
  const {message,flock_cycle_id}=req.body||{};const question=String(message||'').trim();const cycleId=String(flock_cycle_id||'').trim();
  if(!question||!cycleId){res.status(400).json({error:'message_and_flock_cycle_id_required'});return;}
  const r81=buildOperationalReadinessR81(enterpriseV11.operational_readiness_r8_1);const flock=r81.flock_contexts.find(x=>x.flock_cycle_id===cycleId&&x.status==='active');
  if(!flock){res.status(404).json({error:'active_flock_context_not_found'});return;}
  const claims=authClaimsV2021(res);
  if(claims.role_code!=='SYSTEM_OWNER'){
    const identity=enterpriseV11.enterprise_foundation_v20_2_1.identities.find(x=>x.user_id===claims.sub&&x.active);
    const scopes=identity?enterpriseV11.enterprise_foundation_v20_2_1.scopes.filter(x=>identity.scope_ids.includes(x.id)&&x.active):[];
    const scoped=scopes.some(x=>x.type==='global'||x.farm_ids.includes(flock.farm_id));
    const assigned=enterpriseV11.farm_division_v20_2_9.staff_assignments.some(x=>x.user_id===claims.sub&&x.farm_id===flock.farm_id&&x.status==='active');
    if(!scoped&&!assigned){res.status(403).json({error:'r8_1_flock_scope_denied'});return;}
  }
  const insight=analyzeOperationalContextR81(r81,cycleId);
  const lower=question.toLowerCase();const clinicalSignal=/مرض|فيروس|عدوى|نفوق|تنفس|اسهال|إسهال|علاج|مضاد|لقاح|تحصين|diagnos|virus|infection|mortality|treat|antibiotic|vaccine/.test(lower);
  const clinicalRole=['FIELD_VET','VET_CONSULTANT'].includes(claims.role_code);
  const activeRules=r81.scientific_rules.filter(x=>x.status==='active').map(x=>({name:x.name_en,domain:x.domain,kind:x.kind,expression:x.expression,source:x.source_ref,vet_required:x.veterinarian_required}));
  const site=r81.sites.find(x=>x.id===flock.site_id);const house=r81.houses.find(x=>x.id===flock.house_id);const weather=[...r81.weather].filter(x=>x.site_id===flock.site_id).sort((a,b)=>b.captured_at.localeCompare(a.captured_at))[0];const environment=[...r81.environment_readings].filter(x=>x.house_id===flock.house_id).sort((a,b)=>b.captured_at.localeCompare(a.captured_at))[0];
  const suggested=insight.next_actions.length?insight.next_actions:['Verify today\'s feed, water, mortality, weight and house environment measurements.'];
  const ai=getGeminiClient();
  if(!ai){
    const reply=[`AviNexus scientific analysis for ${flock.flock_code} (day ${flock.age_days}).`,...insight.observations,insight.missing_data.length?`Missing data: ${insight.missing_data.join(', ')}.`:'',clinicalSignal?'Clinical question detected: the platform can support investigation, but diagnosis, medication, vaccination changes and containment decisions require an authorized veterinarian.':'',`Next actions: ${suggested.join(' ')}`].filter(Boolean).join('\n');
    res.json({reply,requires_vet_escalation:clinicalSignal||insight.requires_veterinarian,severity:insight.severity,provenance:insight.provenance,suggested_actions:suggested});return;
  }
  const prompt=`You are the contextual scientific intelligence layer of AviNexus Poultry Enterprise. Support poultry operations scientifically, especially open-sided houses and variable hot/cold climates. Use the supplied context; do not invent missing farm measurements. Distinguish observations, calculations, missing data and inference. Never diagnose or prescribe medication. High-risk clinical decisions, treatment, vaccination changes, withdrawal and containment require an authorized veterinarian. If the current user is not a veterinarian (${clinicalRole?'authorized veterinary role':'not a veterinary role'}), do not provide prescription-level instructions. For open-sided houses, evaluate outdoor weather, wind, indoor readings, curtain position, active fans/heaters and flock age together; never blindly tell the user to seal or fully open the house.\n\nQuestion: ${question}\n\nFlock: ${JSON.stringify(flock)}\nSite: ${JSON.stringify(site)}\nHouse: ${JSON.stringify(house)}\nLatest weather: ${JSON.stringify(weather)}\nLatest house environment: ${JSON.stringify(environment)}\nDeterministic context analysis: ${JSON.stringify(insight)}\nActivated scientific rules: ${JSON.stringify(activeRules)}\n\nAnswer in the user's language. Structure the answer as: Current findings; Scientific interpretation; Missing measurements; Recommended next checks/actions; Veterinary escalation if needed. Keep provenance explicit and concise.`;
  try{
    const response=await ai.models.generateContent({model:process.env.GEMINI_MODEL||'gemini-2.5-flash',contents:prompt});
    const reply=String(response.text||'').trim()||'No AI text was returned; use the deterministic analysis and veterinarian workflow.';
    res.json({reply,requires_vet_escalation:clinicalSignal||insight.requires_veterinarian,severity:insight.severity,provenance:insight.provenance,suggested_actions:suggested});
  }catch(error:any){res.json({reply:[...insight.observations,...suggested].join('\n'),requires_vet_escalation:clinicalSignal||insight.requires_veterinarian,severity:insight.severity,provenance:insight.provenance,suggested_actions:suggested,ai_fallback:true});}
});

// ----------------------------------------------------
// V20.2.9 Farm Operations R4 API
// Additive persistence adapter over the protected Factory R3 baseline.
// Section 7 remains inventory owner; Section 12 remains accounting owner.
// ----------------------------------------------------
app.get('/api/v20.2.9/farm/status', (req: Request, res: Response) => {
  const issues=validateFarmDivisionV2029(enterpriseV11.farm_division_v20_2_9, enterpriseV11.managed_operations_v19_7);
  res.json({
    version: enterpriseV11.farm_division_v20_2_9.version,
    migrated_from: enterpriseV11.farm_division_v20_2_9.migrated_from,
    complete: issues.length===0 && FARM_DIVISION_SCREEN_COUNT_V2029>=enterpriseV11.farm_division_v20_2_9.settings.screen_floor,
    completeness_gate_percent: issues.length===0?100:0,
    screen_count: FARM_DIVISION_SCREEN_COUNT_V2029,
    screen_floor: enterpriseV11.farm_division_v20_2_9.settings.screen_floor,
    sections: FARM_DIVISION_SECTIONS_V2029,
    acceptance_count: FARM_DIVISION_ACCEPTANCE_V2029.length,
    validation_issues: issues,
    ownership: { inventory:'SECTION_7', accounting:'SECTION_12', reports:'SECTION_14', governance:'SECTION_15' }
  });
});

app.get('/api/v20.2.9/farm/state', requireAuthV2021(), (req: Request, res: Response) => {
  if(authClaimsV2021(res).role_code!=='SYSTEM_OWNER'){res.status(403).json({success:false,error:'farm_bulk_state_owner_only'});return;}
  res.json({ success:true, farm_division_v20_2_9:enterpriseV11.farm_division_v20_2_9 });
});

app.put('/api/v20.2.9/farm/state', requireAuthV2021(), (req: Request, res: Response) => {
  try {
    const role=authClaimsV2021(res).role_code;
    if(role!=='SYSTEM_OWNER'){
      res.status(403).json({success:false,error:'farm_state_update_permission_denied'}); return;
    }
    const next=buildFarmDivisionStateV2029({ ...enterpriseV11.farm_division_v20_2_9, ...(req.body?.farm_division_v20_2_9 || req.body || {}) });
    const issues=validateFarmDivisionV2029(next,enterpriseV11.managed_operations_v19_7);
    if(issues.length){res.status(400).json({success:false,error:'farm_state_validation_failed',issues});return;}
    enterpriseV11={...enterpriseV11,farm_division_v20_2_9:next};
    persistEnterpriseState(String(res.locals.auth_v20_2_1?.sub||role),'farm_r4_state_update');
    res.json({success:true,farm_division_v20_2_9:enterpriseV11.farm_division_v20_2_9});
  } catch(error) {
    res.status(400).json({success:false,error:error instanceof Error?error.message:'farm_state_update_failed'});
  }
});

// ----------------------------------------------------
// V20.1 Architecture & Flock Accounting API
// ----------------------------------------------------
// Legacy V20.1 endpoints previously bypassed authentication and farm isolation.
// The full enterprise snapshot is restricted to the system owner because it
// contains cross-tenant accounting and farm records.
function v201OwnerOnly(_req:Request,res:Response,next:NextFunction):void{
  if(authClaimsV2021(res).role_code!=='SYSTEM_OWNER'){
    res.status(403).json({success:false,error:'v20_1_legacy_owner_only'});return;
  }
  next();
}
function v201FlockReadScope(req:Request,res:Response,next:NextFunction):void{
  const id=String(req.params.id||'');
  const legacy=flocks.find(f=>f.id===id);
  const canonical=enterpriseV11.managed_operations_v19_7.flock_cycles.find(f=>f.id===id);
  const farmId=legacy?.farm_id||canonical?.farm_id;
  if(!farmId){res.status(404).json({success:false,error:'flock_not_found'});return;}
  if(!authorizedFarmIdsV2026(res).has(farmId)){
    res.status(403).json({success:false,error:'farm_scope_denied'});return;
  }
  next();
}
app.get('/api/v20.1/state', requireAuthV2021(), v201OwnerOnly, (req: Request, res: Response) => {
  res.json({ version:'20.1', v20_core:enterpriseV11.v20_core, validation:validateV20State(enterpriseV11.v20_core, enterpriseV11.managed_operations_v19_7) });
});

app.get('/api/v20.1/flocks/:id/master', requireAuthV2021(), v201FlockReadScope, (req: Request, res: Response) => {
  try { res.json(buildFlockMasterRecordV20(enterpriseV11.v20_core, enterpriseV11.managed_operations_v19_7, req.params.id)); }
  catch(error:any){ res.status(404).json({error:error?.message||'flock_not_found'}); }
});

app.post('/api/v20.1/flocks/:id/close-day', requireAuthV2021(), v201OwnerOnly, (req: Request, res: Response) => {
  try {
    enterpriseV11={...enterpriseV11,v20_core:closeFlockDayV20(enterpriseV11.v20_core,enterpriseV11.managed_operations_v19_7,{flock_id:req.params.id,report_date:String(req.body?.report_date||''),worker:String(req.body?.worker||'field_worker'),vet:req.body?.vet?String(req.body.vet):undefined,forceReopen:Boolean(req.body?.force_reopen),reason:req.body?.reason?String(req.body.reason):undefined})};
    persistEnterpriseState(String(req.body?.vet||req.body?.worker||'system'),'v20_1_daily_close');
    res.json({success:true,closure:enterpriseV11.v20_core.daily_closures[0],validation:validateV20State(enterpriseV11.v20_core,enterpriseV11.managed_operations_v19_7)});
  } catch(error:any){res.status(400).json({success:false,error:error?.message||'daily_close_failed'});}
});

app.post('/api/v20.1/flocks/:id/reconciliation', requireAuthV2021(), v201OwnerOnly, (req: Request, res: Response) => {
  try {
    enterpriseV11={...enterpriseV11,v20_core:addReconciliationAdjustmentV20(enterpriseV11.v20_core,enterpriseV11.managed_operations_v19_7,{flock_id:req.params.id,quantity_delta:Number(req.body?.quantity_delta||0),reason:String(req.body?.reason||''),requested_by:String(req.body?.requested_by||'user'),requested_by_role:String(req.body?.requested_by_role||'user'),evidence_refs:Array.isArray(req.body?.evidence_refs)?req.body.evidence_refs:[]})};
    persistEnterpriseState(String(req.body?.requested_by||'user'),'v20_1_reconciliation_request');
    res.json({success:true,adjustment:enterpriseV11.v20_core.reconciliation_adjustments[0]});
  } catch(error:any){res.status(400).json({success:false,error:error?.message||'reconciliation_request_failed'});}
});

app.post('/api/v20.1/reconciliation/:id/decision', requireAuthV2021(), v201OwnerOnly, (req: Request, res: Response) => {
  try {
    enterpriseV11={...enterpriseV11,v20_core:approveReconciliationAdjustmentV20(enterpriseV11.v20_core,req.params.id,Boolean(req.body?.approved),String(req.body?.actor||'management'),String(req.body?.actor_role||'management'),String(req.body?.reason||'مراجعة التصحيح'))};
    persistEnterpriseState(String(req.body?.actor||'management'),'v20_1_reconciliation_decision');
    res.json({success:true});
  } catch(error:any){res.status(400).json({success:false,error:error?.message||'reconciliation_decision_failed'});}
});

app.post('/api/v20.1/reports/:kind/:flockId', requireAuthV2021(), v201OwnerOnly, (req: Request, res: Response) => {
  try {
    const kind=String(req.params.kind); if(!['daily','weekly','cycle','finance','clinical','biosecurity','procurement','sales','audit'].includes(kind)){res.status(400).json({success:false,error:'unsupported_report_kind'});return;}
    enterpriseV11={...enterpriseV11,v20_core:createReportSnapshotV20(enterpriseV11.v20_core,enterpriseV11.managed_operations_v19_7,{kind:kind as any,flock_id:req.params.flockId,generated_by:String(req.body?.generated_by||'reporting'),period_from:req.body?.period_from,period_to:req.body?.period_to})};
    persistEnterpriseState(String(req.body?.generated_by||'reporting'),'v20_1_report_snapshot');
    res.json({success:true,report:enterpriseV11.v20_core.report_snapshots[0]});
  } catch(error:any){res.status(400).json({success:false,error:error?.message||'report_generation_failed'});}
});

// ----------------------------------------------------
// ----------------------------------------------------
// ----------------------------------------------------
// Phase 2 historical identity write-through: owner-only until tenant-scoped edit policies are certified.
// Independent R7 master-data state; never writes or replaces S7 stock / S12 accounting ledgers.
const r7MasterFile = path.join(runtimeDataDir, `r7-master-${RUNTIME_ENVIRONMENT.toLowerCase()}.json`);
const r7MasterAudit = path.join(runtimeDataDir, `r7-master-audit-${RUNTIME_ENVIRONMENT.toLowerCase()}.jsonl`);
function loadR7Master():PartnerOfficeCustomerNetworkR7State {
  if(!fs.existsSync(r7MasterFile))return buildPartnerOfficeCustomerNetworkR7();
  return buildPartnerOfficeCustomerNetworkR7(JSON.parse(fs.readFileSync(r7MasterFile,'utf8')));
}
let r7MasterState:PartnerOfficeCustomerNetworkR7State=loadR7Master();
function ownerR7Or403(res:Response):boolean {
  if(authClaimsV2021(res).role_code==='SYSTEM_OWNER')return true;
  res.status(403).json({success:false,error:'r7_master_admin_required'});return false;
}
function commitR7Master(next:PartnerOfficeCustomerNetworkR7State,actor:string,action:string,entityId:string){
  const tmp=`${r7MasterFile}.tmp`;
  // Persist the complete next snapshot before making it visible to readers.
  // A failed rename leaves the previous committed state untouched.
  const fd=fs.openSync(tmp,'w',0o600);
  try {
    fs.writeFileSync(fd,JSON.stringify(next,null,2),'utf8');
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  fs.renameSync(tmp,r7MasterFile);
  r7MasterState=next;
  fs.appendFileSync(r7MasterAudit,JSON.stringify({at:new Date().toISOString(),actor,action,entity_id:entityId})+'\n','utf8');
}
app.get('/api/r7/master/identity',requireAuthV2021(),(_req:Request,res:Response)=>{
  if(!ownerR7Or403(res))return;
  res.json({offices:r7MasterState.offices,organizations:r7MasterState.organizations,branches:r7MasterState.branches,governorates:r7MasterState.governorates,contracts:r7MasterState.contracts,offers:r7MasterState.offers,regional_markets:r7MasterState.regional_markets,market_prices:r7MasterState.market_prices,price_change_history:r7MasterState.price_change_history||[]});
});
app.post('/api/r7/master/offices',requireAuthV2021(),(req:Request,res:Response)=>{
  if(!ownerR7Or403(res))return;
  try{
    const body=req.body||{};
    const name=String(body.name||'').trim();const code=String(body.code||'').trim();
    if(!name||!code||!String(body.governorate||'').trim())throw new Error('office_required_fields');
    if(r7MasterState.offices.some(x=>x.code.toLowerCase()===code.toLowerCase()))throw new Error('office_code_duplicate');
    const next=addOfficeR7(r7MasterState,{
      code,name,office_type:'mixed',governorate:String(body.governorate).trim(),
      district:String(body.district||''),address:String(body.address||''),phone:String(body.phone||''),
      manager_name:String(body.manager_name||''),responsible_roles:['manager','veterinarian','accountant','procurement','inventory'],
      warehouse_ids:[],status:'active'
    });
    const office=next.offices[0];commitR7Master(next,authClaimsV2021(res).sub,'office_create',office.id);
    res.status(201).json({success:true,office});
  }catch(e){res.status(400).json({success:false,error:e instanceof Error?e.message:'office_create_failed'});}
});
app.patch('/api/r7/master/offices/:id/name',requireAuthV2021(),(req:Request,res:Response)=>{
  if(!ownerR7Or403(res))return;
  try{const name=String(req.body?.name||'').trim();const next=renameOfficeR7(r7MasterState,req.params.id,name);
    commitR7Master(next,authClaimsV2021(res).sub,'office_rename',req.params.id);
    res.json({success:true,office:next.offices.find(x=>x.id===req.params.id)});
  }catch(e){res.status(400).json({success:false,error:e instanceof Error?e.message:'office_rename_failed'});}
});
app.post('/api/r7/master/governorates',requireAuthV2021(),(req:Request,res:Response)=>{
  if(!ownerR7Or403(res))return;
  try{const name=String(req.body?.name||'').trim();const next=addGovernorateR7(r7MasterState,name);
    commitR7Master(next,authClaimsV2021(res).sub,'governorate_add',name);
    res.status(201).json({success:true,name});
  }catch(e){res.status(400).json({success:false,error:e instanceof Error?e.message:'governorate_add_failed'});}
});
// Branch writes are owner-authorized and preserve canonical organization references.
app.post('/api/r7/master/branches',requireAuthV2021(),(req:Request,res:Response)=>{
  if(!ownerR7Or403(res))return;
  try{
    const b=req.body||{};const organization_id=String(b.organization_id||'').trim();
    const name=String(b.name||'').trim();const governorate=String(b.governorate||'').trim();
    if(!organization_id||!name||!governorate)throw new Error('branch_required_fields');
    if(!r7MasterState.organizations.some(o=>o.id===organization_id))throw new Error('branch_organization_not_found');
    if(!r7MasterState.governorates.includes(governorate))throw new Error('branch_governorate_not_found');
    if(r7MasterState.branches.some(x=>x.organization_id===organization_id&&x.name.trim().toLowerCase()===name.toLowerCase()))throw new Error('branch_duplicate');
    const id=`R7-BR-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
    const branch={id,organization_id,name,governorate,district:String(b.district||''),address:String(b.address||''),phone:String(b.phone||''),working_hours:'',responsible_person:'',service_area:[],cold_chain_capable:false,status:'active' as const};
    const next={...r7MasterState,branches:[...r7MasterState.branches,branch],organizations:r7MasterState.organizations.map(o=>o.id===organization_id?{...o,branch_ids:[...new Set([...o.branch_ids,id])]}:o)};
    commitR7Master(next,authClaimsV2021(res).sub,'branch_create',id);
    res.status(201).json({success:true,branch});
  }catch(e){res.status(400).json({success:false,error:e instanceof Error?e.message:'branch_create_failed'});}
});
app.patch('/api/r7/master/branches/:id',requireAuthV2021(),(req:Request,res:Response)=>{
  if(!ownerR7Or403(res))return;
  try{
    const existing=r7MasterState.branches.find(x=>x.id===req.params.id);
    if(!existing)throw new Error('branch_not_found');
    const b=req.body||{};const name=String(b.name||'').trim();const governorate=String(b.governorate||'').trim();
    if(!name||!governorate)throw new Error('branch_required_fields');
    if(!r7MasterState.governorates.includes(governorate))throw new Error('branch_governorate_not_found');
    if(r7MasterState.branches.some(x=>x.id!==existing.id&&x.organization_id===existing.organization_id&&x.name.trim().toLowerCase()===name.toLowerCase()))throw new Error('branch_duplicate');
    // Organization identity cannot be reassigned by editing a branch.
    if(b.organization_id!==undefined&&b.organization_id!==existing.organization_id)throw new Error('branch_organization_immutable');
    const branch={...existing,name,governorate,district:String(b.district||''),phone:String(b.phone||'')};
    const next={...r7MasterState,branches:r7MasterState.branches.map(x=>x.id===existing.id?branch:x)};
    commitR7Master(next,authClaimsV2021(res).sub,'branch_update',existing.id);
    res.json({success:true,branch});
  }catch(e){res.status(400).json({success:false,error:e instanceof Error?e.message:'branch_update_failed'});}
});
app.post('/api/r7/master/marketing-companies',requireAuthV2021(),(req:Request,res:Response)=>{
  if(!ownerR7Or403(res))return;
  try{
    const b=req.body||{};
    const allowedCurrencies=['SAR','USD','YER_NEW','YER_OLD'];
    if(!allowedCurrencies.includes(b.preferred_currency))throw new Error('invalid_currency');
    if(!Number.isInteger(b.credit_days)||b.credit_days<0)throw new Error('invalid_credit_days');
    const next=registerMarketingCompanyR7(r7MasterState,{
      code:String(b.code||'').trim(),name:String(b.name||'').trim(),contact_name:String(b.contact_name||''),
      phone:String(b.phone||''),governorates_served:Array.isArray(b.governorates_served)?b.governorates_served:[],
      payment_terms:String(b.payment_terms||''),credit_days:b.credit_days,preferred_currency:b.preferred_currency,
      status:'active',commercial_registration:b.commercial_registration,tax_number:b.tax_number,email:b.email,whatsapp:b.whatsapp
    });
    const company=next.organizations[next.organizations.length-1];
    commitR7Master(next,authClaimsV2021(res).sub,'marketing_company_create',company.id);
    res.status(201).json({success:true,company});
  }catch(e){res.status(400).json({success:false,error:e instanceof Error?e.message:'marketing_company_create_failed'});}
});

function validR7CurrencyPrecision(amount:number,currency:string):boolean {
  const digits=currency==='SAR'||currency==='USD'?2:0;
  const scale=10**digits;
  return Number.isSafeInteger(Math.round(amount*scale))&&Math.abs(amount*scale-Math.round(amount*scale))<1e-7;
}
// Phase 2 price catalog: owner-authorized write-through, immutable historical price events.
app.post('/api/r7/master/offers',requireAuthV2021(),(req:Request,res:Response)=>{
  if(!ownerR7Or403(res))return;
  try{
    const b=req.body||{};
    const organization_id=String(b.organization_id||'').trim();
    const sku=String(b.sku||'').trim();const item_name=String(b.item_name||'').trim();
    const category=String(b.category||'');const currency=String(b.currency||'');
    const amount=Number(b.contract_price);
    if(!organization_id||!sku||!item_name)throw new Error('offer_required_fields');
    if(!r7MasterState.organizations.some(x=>x.id===organization_id))throw new Error('offer_organization_not_found');
    if(!['medicine','vaccine','feed','chick','equipment','disinfectant','feed_additive','lab_service','transport','other'].includes(category))throw new Error('offer_invalid_category');
    if(!['SAR','USD','YER_NEW','YER_OLD'].includes(currency))throw new Error('offer_invalid_currency');
    if(b.contract_price===null||b.contract_price===undefined||b.contract_price===''||!Number.isFinite(amount)||amount<0||amount>1_000_000_000_000)throw new Error('offer_invalid_price');
    if(!validR7CurrencyPrecision(amount,currency))throw new Error('offer_invalid_currency_precision');
    if(r7MasterState.offers.some(x=>x.organization_id===organization_id&&x.sku.toLowerCase()===sku.toLowerCase()))throw new Error('offer_duplicate_sku');
    const id=`R7-OFFER-${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
    const offer={id,organization_id,sku,item_name,category:category as typeof r7MasterState.offers[number]['category'],contract_price:amount,normal_price:amount,currency:currency as typeof r7MasterState.offers[number]['currency'],unit:category==='chick'?'كتكوت':'وحدة',min_quantity:1,tax_percent:0,availability:'on_request' as const,effective_from:new Date().toISOString().slice(0,10),cold_chain_required:false,public_visible:false,status:'active' as const};
    commitR7Master({...r7MasterState,offers:[...r7MasterState.offers,offer]},authClaimsV2021(res).sub,'offer_create',id);
    res.status(201).json({success:true,offer});
  }catch(e){res.status(400).json({success:false,error:e instanceof Error?e.message:'offer_create_failed'});}
});
app.patch('/api/r7/master/offers/:id',requireAuthV2021(),(req:Request,res:Response)=>{
  if(!ownerR7Or403(res))return;
  try{
    const old=r7MasterState.offers.find(x=>x.id===req.params.id);if(!old)throw new Error('offer_not_found');
    const b=req.body||{};
    if(b.organization_id!==undefined&&b.organization_id!==old.organization_id)throw new Error('offer_organization_immutable');
    if(b.sku!==undefined&&b.sku!==old.sku)throw new Error('offer_sku_immutable');
    if(b.category!==undefined&&b.category!==old.category)throw new Error('offer_category_immutable');
    if(b.item_name!==undefined&&b.item_name!==old.item_name)throw new Error('offer_name_immutable');
    const currency=String(b.currency||'');const amount=Number(b.contract_price);
    if(!['SAR','USD','YER_NEW','YER_OLD'].includes(currency))throw new Error('offer_invalid_currency');
    if(b.contract_price===null||b.contract_price===undefined||b.contract_price===''||!Number.isFinite(amount)||amount<0||amount>1_000_000_000_000)throw new Error('offer_invalid_price');
    if(!validR7CurrencyPrecision(amount,currency))throw new Error('offer_invalid_currency_precision');
    // Reject stale edits before writing a new immutable price event.
    if(!Object.prototype.hasOwnProperty.call(b,'expected_contract_price')||!Object.prototype.hasOwnProperty.call(b,'expected_currency'))throw new Error('offer_price_expected_snapshot_required');
    if(typeof b.expected_contract_price!=='number'||!Number.isFinite(b.expected_contract_price)||b.expected_contract_price!==old.contract_price||b.expected_currency!==old.currency){res.status(409).json({success:false,error:'offer_price_revision_conflict',current:{contract_price:old.contract_price,currency:old.currency}});return;}
    const note=String(b.note||'').trim();if(!note)throw new Error('offer_price_change_reason_required');
    if(amount===old.contract_price&&currency===old.currency)throw new Error('offer_price_unchanged');
    const actor=authClaimsV2021(res).sub;const at=new Date().toISOString();
    const offer={...old,contract_price:amount,currency:currency as typeof old.currency};
    const projection=(x:typeof old)=>({organization_id:x.organization_id,sku:x.sku,item_name:x.item_name,category:x.category,contract_price:x.contract_price,currency:x.currency});
    const event={id:`PRICE-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,offer_id:old.id,at,actor_id:actor,note,previous:projection(old),next:projection(offer)};
    const next={...r7MasterState,offers:r7MasterState.offers.map(x=>x.id===old.id?offer:x),price_change_history:[...(r7MasterState.price_change_history||[]),event]};
    commitR7Master(next,actor,'offer_price_revision',old.id);res.json({success:true,offer,price_change:event});
  }catch(e){res.status(400).json({success:false,error:e instanceof Error?e.message:'offer_revision_failed'});}
});
// Historical regional markets and append-only market price observations. These are
// reference data, never inventory issues, customer invoices, or accounting entries.
app.post('/api/r7/master/markets',requireAuthV2021(),(req:Request,res:Response)=>{
  if(!ownerR7Or403(res))return;
  try {
    const b=req.body||{};
    const name=String(b.name||'').trim();
    const governorate=String(b.governorate||'').trim();
    const market_type=String(b.market_type||'').trim();
    if(name.length<2||name.length>160||!governorate||!r7MasterState.governorates.includes(governorate))throw new Error('market_invalid_name_or_governorate');
    if(!['poultry_live','chicks','feed','mixed'].includes(market_type))throw new Error('market_invalid_type');
    if(r7MasterState.regional_markets.some(m=>m.name.toLocaleLowerCase()===name.toLocaleLowerCase()&&m.governorate===governorate))throw new Error('market_duplicate');
    const market={id:`R7-MARKET-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,name,governorate,market_type:market_type as typeof r7MasterState.regional_markets[number]['market_type'],district:String(b.district||'').trim().slice(0,160),address:String(b.address||'').trim().slice(0,400),phone:String(b.phone||'').trim().slice(0,60),active:true};
    commitR7Master({...r7MasterState,regional_markets:[...r7MasterState.regional_markets,market]},authClaimsV2021(res).sub,'market_create',market.id);
    res.status(201).json({success:true,market});
  }catch(e){res.status(400).json({success:false,error:e instanceof Error?e.message:'market_create_failed'});}
});
app.patch('/api/r7/master/markets/:id',requireAuthV2021(),(req:Request,res:Response)=>{
  if(!ownerR7Or403(res))return;
  try {
    const old=r7MasterState.regional_markets.find(m=>m.id===req.params.id);
    if(!old){res.status(404).json({success:false,error:'market_not_found'});return;}
    const b=req.body||{};
    if(typeof b.active!=='boolean')throw new Error('market_active_boolean_required');
    if(b.active===old.active)throw new Error('market_status_unchanged');
    const market={...old,active:b.active};
    commitR7Master({...r7MasterState,regional_markets:r7MasterState.regional_markets.map(m=>m.id===old.id?market:m)},authClaimsV2021(res).sub,'market_status_change',old.id);
    res.json({success:true,market});
  }catch(e){res.status(400).json({success:false,error:e instanceof Error?e.message:'market_update_failed'});}
});
app.post('/api/r7/master/market-prices',requireAuthV2021(),(req:Request,res:Response)=>{
  if(!ownerR7Or403(res))return;
  try {
    const b=req.body||{};
    const market_id=String(b.market_id||'').trim();
    const market=r7MasterState.regional_markets.find(m=>m.id===market_id&&m.active);
    if(!market)throw new Error('market_price_market_not_active');
    const date=String(b.date||'').trim();
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)throw new Error('market_price_invalid_date');
    const category=String(b.category||'');
    if(!['broiler_live_kg','chick','feed_starter','feed_grower','feed_finisher','other'].includes(category))throw new Error('market_price_invalid_category');
    const currency=String(b.currency||'');
    if(!['SAR','USD','YER_NEW','YER_OLD'].includes(currency))throw new Error('market_price_invalid_currency');
    const value=b.value;
    if(typeof value!=='number'||!Number.isFinite(value)||value<=0||value>1_000_000_000_000||!validR7CurrencyPrecision(value,currency))throw new Error('market_price_invalid_value');
    const trend=String(b.trend||'stable');
    if(!['up','stable','down'].includes(trend))throw new Error('market_price_invalid_trend');
    const observation={id:`R7-MPRICE-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,market_id,date,category:category as typeof r7MasterState.market_prices[number]['category'],value,currency:currency as typeof r7MasterState.market_prices[number]['currency'],trend:trend as typeof r7MasterState.market_prices[number]['trend'],entered_by:authClaimsV2021(res).sub};
    commitR7Master({...r7MasterState,market_prices:[...r7MasterState.market_prices,observation]},authClaimsV2021(res).sub,'market_price_observation',observation.id);
    res.status(201).json({success:true,observation});
  }catch(e){res.status(400).json({success:false,error:e instanceof Error?e.message:'market_price_create_failed'});}
});
// Phase 2: versioned R7 commercial contracts. No financial or stock postings here.
app.post('/api/r7/master/contracts',requireAuthV2021(),(req:Request,res:Response)=>{
  if(!ownerR7Or403(res))return;
  try{
    const b=req.body||{};const organization_id=String(b.organization_id||'');const office_id=b.office_id?String(b.office_id):undefined;
    const contract_number=String(b.contract_number||'').trim();const title=String(b.title||'').trim();
    const start_date=String(b.start_date||'');const end_date=b.end_date?String(b.end_date):undefined;
    if(!contract_number||!title||!/^\d{4}-\d{2}-\d{2}$/.test(start_date)||!Number.isFinite(Date.parse(start_date)))throw new Error('contract_required_fields');
    if(end_date&&(!/^\d{4}-\d{2}-\d{2}$/.test(end_date)||!Number.isFinite(Date.parse(end_date))||end_date<start_date))throw new Error('contract_invalid_end_date');
    if(!r7MasterState.organizations.some(o=>o.id===organization_id))throw new Error('contract_organization_not_found');
    if(office_id&&!r7MasterState.offices.some(o=>o.id===office_id))throw new Error('contract_office_not_found');
    if(r7MasterState.contracts.some(c=>c.contract_number.toLowerCase()===contract_number.toLowerCase()))throw new Error('contract_number_duplicate');
    const currencies=Array.isArray(b.currencies)?b.currencies:[];
    if(!currencies.length||currencies.some((c:unknown)=>!['SAR','USD','YER_NEW','YER_OLD'].includes(String(c))))throw new Error('contract_invalid_currencies');
    const credit_days=Number(b.credit_days??0);const tax_percent=Number(b.tax_percent??0);
    if(!Number.isInteger(credit_days)||credit_days<0||!Number.isFinite(tax_percent)||tax_percent<0||tax_percent>100)throw new Error('contract_invalid_terms');
    const actor=authClaimsV2021(res).sub;const at=new Date().toISOString();
    const contract={id:`R7-CTR-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,contract_number,organization_id,office_id,title,start_date,end_date,
      payment_terms:String(b.payment_terms||''),credit_days,currencies,tax_percent,delivery_terms:String(b.delivery_terms||''),transport_terms:String(b.transport_terms||''),
      attachment_refs:[] as string[],status:'draft' as const,versions:[{version:1,effective_from:start_date,note:'initial contract',changed_by:actor,changed_at:at}]};
    const next={...r7MasterState,contracts:[...r7MasterState.contracts,contract],organizations:r7MasterState.organizations.map(o=>o.id===organization_id?{...o,contract_ids:[...new Set([...o.contract_ids,contract.id])]}:o)};
    commitR7Master(next,actor,'contract_create',contract.id);res.status(201).json({success:true,contract});
  }catch(e){res.status(400).json({success:false,error:e instanceof Error?e.message:'contract_create_failed'});}
});
app.patch('/api/r7/master/contracts/:id',requireAuthV2021(),(req:Request,res:Response)=>{
  if(!ownerR7Or403(res))return;
  try{
    const old=r7MasterState.contracts.find(c=>c.id===req.params.id);if(!old)throw new Error('contract_not_found');
    const b=req.body||{};if(b.organization_id!==undefined&&b.organization_id!==old.organization_id)throw new Error('contract_organization_immutable');
    if(b.office_id!==undefined&&b.office_id!==old.office_id)throw new Error('contract_office_immutable');
    if(b.contract_number!==undefined&&b.contract_number!==old.contract_number)throw new Error('contract_number_immutable');
    const expected=Number(b.expected_version);const latest=old.versions[old.versions.length-1]?.version||1;
    if(!Number.isInteger(expected)||expected!==latest)throw new Error('contract_version_conflict');
    const effective_from=String(b.effective_from||'');const note=String(b.note||'').trim();
    if(!/^\d{4}-\d{2}-\d{2}$/.test(effective_from)||!Number.isFinite(Date.parse(effective_from))||!note)throw new Error('contract_revision_reason_required');
    if(effective_from<old.start_date||effective_from<old.versions[old.versions.length-1].effective_from)throw new Error('contract_revision_date_invalid');
    const allowed=['draft','active','expired','terminated'];const status=b.status===undefined?old.status:String(b.status);
    if(!allowed.includes(status))throw new Error('contract_invalid_status');
    const payment_terms=b.payment_terms===undefined?old.payment_terms:String(b.payment_terms);
    const actor=authClaimsV2021(res).sub;const at=new Date().toISOString();
    const versions=[...old.versions,{version:latest+1,effective_from,note,changed_by:actor,changed_at:at}];
    const contract={...old,payment_terms,status:status as typeof old.status,versions};
    const next={...r7MasterState,contracts:r7MasterState.contracts.map(c=>c.id===old.id?contract:c)};
    commitR7Master(next,actor,'contract_revision',old.id);res.json({success:true,contract});
  }catch(e){res.status(400).json({success:false,error:e instanceof Error?e.message:'contract_revision_failed'});}
});

// V20.2.3 Multi-Business Enterprise Operations API
// ----------------------------------------------------
app.get('/api/v20.2.3/validation', requireAuthV2021(), (req:Request,res:Response)=>{
  const web=ensureMultiBusinessFinanceV2023(enterpriseV11.enterprise_web_v20_2,enterpriseV11.multi_business_v20_2_3);
  const issues=validateMultiBusinessStateV2023(enterpriseV11.multi_business_v20_2_3,web);
  res.json({version:'20.2.3',status:issues.length?'PARTIAL':'PASS',issues});
});

app.get('/api/v20.2.3/dashboard', requireAuthV2021(), (req:Request,res:Response)=>{
  if(!businessOr403V2023(res,undefined,'read'))return;
  res.json(platformBusinessDashboardV2023(enterpriseV11.multi_business_v20_2_3,enterpriseV11.veterinary_field_v20_2_2));
});

app.get('/api/v20.2.3/business-units', requireAuthV2021(), (req:Request,res:Response)=>{
  const claims=authClaimsV2021(res);
  const all=businessAccessV2023(res,undefined,'read');
  const ids=new Set(enterpriseV11.multi_business_v20_2_3.staff_assignments.filter(x=>x.user_id===claims.sub&&x.active).map(x=>x.business_unit_id));
  res.json({business_units:all?enterpriseV11.multi_business_v20_2_3.business_units:enterpriseV11.multi_business_v20_2_3.business_units.filter(x=>ids.has(x.id))});
});

// Historical recovery Step 10: list only offices visible to the authenticated user.
// Never use the unscoped browser business-unit collection to select an office.
app.get('/api/v20.2.3/contracted-offices/authorized', requireAuthV2021(), (_req:Request,res:Response)=>{
  const offices=enterpriseV11.multi_business_v20_2_3.business_units
    .filter(unit=>unit.type==='office'&&unit.status==='active')
    .filter(unit=>businessAccessV2023(res,unit.id,'read'))
    .map(unit=>({id:unit.id,code:unit.code,name:unit.name}));
  res.setHeader('Cache-Control','no-store');
  res.json({success:true,offices});
});

// Historical recovery: scoped read-only Office 360, using existing canonical records.
app.get('/api/v20.2.3/contracted-office/:officeId/workspace', requireAuthV2021(), (req:Request,res:Response)=>{
  const officeId=String(req.params.officeId||'');
  if(!businessOr403V2023(res,officeId,'read'))return;
  try { res.setHeader('Cache-Control','no-store'); res.json({success:true,workspace:contractedOfficeWorkspaceV2026(enterpriseV11.multi_business_v20_2_3,officeId,new Date().toISOString())}); }
  catch(error){res.status(404).json({success:false,error:error instanceof Error?error.message:'office_workspace_unavailable'});}
});

// Historical office recovery: S12 treasury balances per account/currency, never cross-currency summed.
app.get('/api/v20.2.3/contracted-office/:officeId/treasury-reconciliation', requireAuthV2021(), (req:Request,res:Response)=>{
  const officeId=String(req.params.officeId||'');
  if(!businessOr403V2023(res,officeId,'read'))return;
  try {
    res.setHeader('Cache-Control','no-store');
    res.json({success:true,reconciliation:officeTreasuryReconciliationV2026(enterpriseV11.multi_business_v20_2_3,officeId,String(req.query.as_of||new Date().toISOString().slice(0,10)))});
  }catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'treasury_reconciliation_unavailable'});}
});

// AI / Excel-style balance query: deterministic read-only calculation, never Gemini-generated figures.
app.get('/api/v20.2.3/inventory/balance', requireAuthV2021(), (req:Request,res:Response)=>{
  const unitId=String(req.query.business_unit_id||'');
  if(!businessOr403V2023(res,unitId,'read'))return;
  try {
    const report=inventoryBalanceQueryV2026(enterpriseV11.multi_business_v20_2_3.inventory_movements,{
      business_unit_id:unitId,from:String(req.query.from||''),to:String(req.query.to||''),
      warehouse_id:req.query.warehouse_id?String(req.query.warehouse_id):undefined,
      product_id:req.query.product_id?String(req.query.product_id):undefined
    });
    res.setHeader('Cache-Control','no-store');res.json({success:true,report});
  }catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'balance_query_failed'});}
});

app.post('/api/v20.2.3/business-units', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);if(!businessOr403V2023(res,undefined,'admin'))return;let next=createBusinessUnitV2023(enterpriseV11.multi_business_v20_2_3,{code:String(req.body?.code||''),name:String(req.body?.name||''),type:req.body?.type||'office',parent_business_unit_id:req.body?.parent_business_unit_id,logo_url:req.body?.logo_url,address:req.body?.address,phone:req.body?.phone,manager_user_id:req.body?.manager_user_id,responsible_user_id:req.body?.responsible_user_id,status:req.body?.status||'active',currency_preferences:Array.isArray(req.body?.currency_preferences)?req.body.currency_preferences:['SAR','YER_OLD','YER_NEW','USD']},claims.sub);let web=ensureMultiBusinessFinanceV2023(enterpriseV11.enterprise_web_v20_2,next);enterpriseV11={...enterpriseV11,multi_business_v20_2_3:next,enterprise_web_v20_2:web};persistEnterpriseState(claims.sub,'v20_2_3_business_unit_create');res.status(201).json({success:true,business_unit:next.business_units[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'business_unit_create_failed'});}
});

app.post('/api/v20.2.3/contracts', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res),unitId=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unitId,'admin'))return;const next=createBusinessContractV2023(enterpriseV11.multi_business_v20_2_3,{business_unit_id:unitId,counterparty_name:String(req.body?.counterparty_name||''),counterparty_type:req.body?.counterparty_type||'other',services:Array.isArray(req.body?.services)?req.body.services:[],linked_farm_ids:Array.isArray(req.body?.linked_farm_ids)?req.body.linked_farm_ids:[],start_date:String(req.body?.start_date||new Date().toISOString().slice(0,10)),end_date:req.body?.end_date,payment_terms:String(req.body?.payment_terms||''),platform_commission_percent:Number(req.body?.platform_commission_percent||0),approval_limit_sar:Number(req.body?.approval_limit_sar||0),expense_rules:Array.isArray(req.body?.expense_rules)?req.body.expense_rules:[],status:req.body?.status||'active'},claims.sub);enterpriseV11={...enterpriseV11,multi_business_v20_2_3:next};persistEnterpriseState(claims.sub,'v20_2_3_contract_create');res.status(201).json({success:true,contract:next.contracts[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'contract_create_failed'});}
});

app.post('/api/v20.2.3/farm-links', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res),unitId=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unitId,'admin'))return;const next=linkFarmToBusinessUnitV2023(enterpriseV11.multi_business_v20_2_3,{business_unit_id:unitId,farm_id:String(req.body?.farm_id||''),contract_id:req.body?.contract_id,assigned_manager_user_id:req.body?.assigned_manager_user_id,primary_vet_user_id:req.body?.primary_vet_user_id,backup_vet_user_id:req.body?.backup_vet_user_id,supervisor_user_id:req.body?.supervisor_user_id,cost_center_code:String(req.body?.cost_center_code||`BU:${unitId}:FARM:${req.body?.farm_id||''}`),active:req.body?.active!==false,starts_at:String(req.body?.starts_at||new Date().toISOString()),ends_at:req.body?.ends_at},claims.sub);enterpriseV11={...enterpriseV11,multi_business_v20_2_3:next};persistEnterpriseState(claims.sub,'v20_2_3_farm_link');res.status(201).json({success:true,farm_link:next.farm_links[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'farm_link_failed'});}
});

app.post('/api/v20.2.3/staff-assignments', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res),unitId=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unitId,'admin'))return;const next=assignBusinessStaffV2023(enterpriseV11.multi_business_v20_2_3,{business_unit_id:unitId,user_id:String(req.body?.user_id||''),role_code:String(req.body?.role_code||''),job_title:req.body?.job_title,branch_id:req.body?.branch_id,warehouse_ids:Array.isArray(req.body?.warehouse_ids)?req.body.warehouse_ids:[],farm_ids:Array.isArray(req.body?.farm_ids)?req.body.farm_ids:[],starts_at:String(req.body?.starts_at||new Date().toISOString()),ends_at:req.body?.ends_at,active:req.body?.active!==false},claims.sub);enterpriseV11={...enterpriseV11,multi_business_v20_2_3:next};persistEnterpriseState(claims.sub,'v20_2_3_staff_assign');res.status(201).json({success:true,assignment:next.staff_assignments[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'staff_assignment_failed'});}
});

app.post('/api/v20.2.3/customers', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res),unitId=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unitId,'operate'))return;const next=createCustomerV2023(enterpriseV11.multi_business_v20_2_3,{business_unit_id:unitId,name:String(req.body?.name||''),phone:req.body?.phone,address:req.body?.address,linked_farm_ids:Array.isArray(req.body?.linked_farm_ids)?req.body.linked_farm_ids:[],assigned_user_id:req.body?.assigned_user_id,preferred_currency:req.body?.preferred_currency||'SAR',credit_limit_sar:Number(req.body?.credit_limit_sar||0),credit_days:Number(req.body?.credit_days||0),active:req.body?.active!==false},claims.sub);enterpriseV11={...enterpriseV11,multi_business_v20_2_3:next};persistEnterpriseState(claims.sub,'v20_2_3_customer_create');res.status(201).json({success:true,customer:next.customers[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'customer_create_failed'});}
});

app.get('/api/v20.2.3/customers/:id/statement', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const customer=enterpriseV11.multi_business_v20_2_3.customers.find(x=>x.id===req.params.id);if(!customer){res.status(404).json({success:false,error:'customer_not_found'});return;}if(!businessOr403V2023(res,customer.business_unit_id,'read'))return;res.json(customerStatementV2023(enterpriseV11.multi_business_v20_2_3,customer.id));}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'customer_statement_failed'});}
});

app.post('/api/v20.2.3/suppliers', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res),unitId=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unitId,'operate'))return;const next=createSupplierV2023(enterpriseV11.multi_business_v20_2_3,{business_unit_id:unitId,name:String(req.body?.name||''),phone:req.body?.phone,address:req.body?.address,supplied_categories:Array.isArray(req.body?.supplied_categories)?req.body.supplied_categories:[],preferred_currency:req.body?.preferred_currency||'SAR',payment_terms_days:Number(req.body?.payment_terms_days||0),active:req.body?.active!==false},claims.sub);enterpriseV11={...enterpriseV11,multi_business_v20_2_3:next};persistEnterpriseState(claims.sub,'v20_2_3_supplier_create');res.status(201).json({success:true,supplier:next.suppliers[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'supplier_create_failed'});}
});

app.get('/api/v20.2.3/suppliers/:id/statement', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const supplier=enterpriseV11.multi_business_v20_2_3.suppliers.find(x=>x.id===req.params.id);if(!supplier){res.status(404).json({success:false,error:'supplier_not_found'});return;}if(!businessOr403V2023(res,supplier.business_unit_id,'read'))return;res.json(supplierStatementV2023(enterpriseV11.multi_business_v20_2_3,supplier.id));}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'supplier_statement_failed'});}
});

app.post('/api/v20.2.3/products', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);if(!businessOr403V2023(res,String(req.body?.business_unit_id||''),'operate'))return;const next=createProductV2023(enterpriseV11.multi_business_v20_2_3,{id:String(req.body?.id||`prd-${Date.now()}`),sku:String(req.body?.sku||''),name:String(req.body?.name||''),category:req.body?.category||'other',base_unit:req.body?.base_unit||'unit',bag_weight_kg:req.body?.bag_weight_kg===undefined?undefined:Number(req.body.bag_weight_kg),purchase_price:Number(req.body?.purchase_price||0),sales_price:Number(req.body?.sales_price||0),pricing_currency:req.body?.pricing_currency||'SAR',inventory_account_code:String(req.body?.inventory_account_code||((req.body?.category==='raw_material')?'1210':(req.body?.category==='finished_feed'?'1220':'1200'))),revenue_account_code:String(req.body?.revenue_account_code||(req.body?.category==='finished_feed'?'4010':'4000')),cogs_account_code:String(req.body?.cogs_account_code||'5900'),minimum_stock_base:Number(req.body?.minimum_stock_base||0),track_lot:req.body?.track_lot!==false,track_expiry:Boolean(req.body?.track_expiry),active:req.body?.active!==false},claims.sub);enterpriseV11={...enterpriseV11,multi_business_v20_2_3:next};persistEnterpriseState(claims.sub,'v20_2_3_product_create');res.status(201).json({success:true,product:next.products[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'product_create_failed'});}
});

app.post('/api/v20.2.3/warehouses', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res),unitId=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unitId,'operate'))return;const next=createWarehouseV2023(enterpriseV11.multi_business_v20_2_3,{code:String(req.body?.code||''),business_unit_id:unitId,name:String(req.body?.name||''),address:req.body?.address,manager_user_id:req.body?.manager_user_id,warehouse_type:req.body?.warehouse_type||'general',active:req.body?.active!==false},claims.sub);enterpriseV11={...enterpriseV11,multi_business_v20_2_3:next};persistEnterpriseState(claims.sub,'v20_2_3_warehouse_create');res.status(201).json({success:true,warehouse:next.warehouses[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'warehouse_create_failed'});}
});

app.post('/api/v20.2.3/treasury-accounts', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res),unitId=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unitId,'finance'))return;const next=createTreasuryAccountV2023(enterpriseV11.multi_business_v20_2_3,{code:String(req.body?.code||''),business_unit_id:unitId,name:String(req.body?.name||''),kind:req.body?.kind||'cashbox',currency:req.body?.currency||'SAR',opening_balance:Number(req.body?.opening_balance||0),active:req.body?.active!==false},claims.sub);enterpriseV11={...enterpriseV11,multi_business_v20_2_3:next};persistEnterpriseState(claims.sub,'v20_2_3_treasury_create');res.status(201).json({success:true,treasury_account:next.treasury_accounts[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'treasury_create_failed'});}
});

app.post('/api/v20.2.3/factories', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res),unitId=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unitId,'admin'))return;const next=createFactoryProfileV2023(enterpriseV11.multi_business_v20_2_3,{business_unit_id:unitId,factory_code:String(req.body?.factory_code||''),name:String(req.body?.name||''),contract_id:req.body?.contract_id,raw_material_warehouse_id:req.body?.raw_material_warehouse_id,finished_goods_warehouse_id:req.body?.finished_goods_warehouse_id,manager_user_id:req.body?.manager_user_id,accountant_user_id:req.body?.accountant_user_id,active:req.body?.active!==false},claims.sub);enterpriseV11={...enterpriseV11,multi_business_v20_2_3:next};persistEnterpriseState(claims.sub,'v20_2_3_factory_create');res.status(201).json({success:true,factory:next.factories[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'factory_create_failed'});}
});

app.post('/api/v20.2.3/raw-materials', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);if(!businessOr403V2023(res,undefined,'admin'))return;const next=addRawMaterialDefinitionV2023(enterpriseV11.multi_business_v20_2_3,{code:String(req.body?.code||''),name_ar:String(req.body?.name_ar||''),name_en:String(req.body?.name_en||''),default_unit:'kg',default_bag_weight_kg:req.body?.default_bag_weight_kg===undefined?undefined:Number(req.body.default_bag_weight_kg),protein_pct:req.body?.protein_pct===undefined?undefined:Number(req.body.protein_pct),metabolizable_energy_kcal_kg:req.body?.metabolizable_energy_kcal_kg===undefined?undefined:Number(req.body.metabolizable_energy_kcal_kg),calcium_pct:req.body?.calcium_pct===undefined?undefined:Number(req.body.calcium_pct),phosphorus_pct:req.body?.phosphorus_pct===undefined?undefined:Number(req.body.phosphorus_pct),fiber_pct:req.body?.fiber_pct===undefined?undefined:Number(req.body.fiber_pct),moisture_pct:req.body?.moisture_pct===undefined?undefined:Number(req.body.moisture_pct),active:req.body?.active!==false},claims.sub);enterpriseV11={...enterpriseV11,multi_business_v20_2_3:next};persistEnterpriseState(claims.sub,'v20_2_3_raw_material_create');res.status(201).json({success:true,raw_material:next.raw_material_definitions[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'raw_material_create_failed'});}
});
app.patch('/api/v20.2.3/raw-materials/:id/nutrients', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);if(!businessOr403V2023(res,undefined,'admin'))return;const patch:any={};for(const k of ['protein_pct','metabolizable_energy_kcal_kg','calcium_pct','phosphorus_pct','fiber_pct','moisture_pct','default_bag_weight_kg'])if(req.body?.[k]!==undefined)patch[k]=Number(req.body[k]);const next=updateRawMaterialNutrientsV2023(enterpriseV11.multi_business_v20_2_3,req.params.id,patch,claims.sub);enterpriseV11={...enterpriseV11,multi_business_v20_2_3:next};persistEnterpriseState(claims.sub,'v20_2_3_raw_material_update');res.json({success:true,raw_material:next.raw_material_definitions.find(x=>x.id===req.params.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'raw_material_update_failed'});}
});

app.post('/api/v20.2.3/purchase-orders', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res),unitId=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unitId,'operate'))return;const next=createPurchaseOrderV2023(enterpriseV11.multi_business_v20_2_3,{business_unit_id:unitId,warehouse_id:String(req.body?.warehouse_id||''),supplier_id:String(req.body?.supplier_id||''),order_date:String(req.body?.order_date||new Date().toISOString().slice(0,10)),expected_date:req.body?.expected_date,lines:Array.isArray(req.body?.lines)?req.body.lines:[],transport_cost:Number(req.body?.transport_cost||0),transport_currency:req.body?.transport_currency||'SAR',requested_by:claims.sub,approve:Boolean(req.body?.approve),approved_by:Boolean(req.body?.approve)?claims.sub:undefined},claims.sub);enterpriseV11={...enterpriseV11,multi_business_v20_2_3:next};persistEnterpriseState(claims.sub,'v20_2_3_purchase_order');res.status(201).json({success:true,purchase_order:next.purchase_orders[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'purchase_order_failed'});}
});

app.post('/api/v20.2.3/purchase-orders/:id/receive', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res),po=enterpriseV11.multi_business_v20_2_3.purchase_orders.find(x=>x.id===req.params.id);if(!po){res.status(404).json({success:false,error:'purchase_order_not_found'});return;}if(!businessOr403V2023(res,po.business_unit_id,'operate'))return;const r=receivePurchaseOrderV2023(enterpriseV11.multi_business_v20_2_3,enterpriseV11.enterprise_web_v20_2,{purchase_order_id:po.id,arrival_date:String(req.body?.arrival_date||new Date().toISOString().slice(0,10)),arrival_time:String(req.body?.arrival_time||new Date().toTimeString().slice(0,5)),lines:Array.isArray(req.body?.lines)?req.body.lines:[],transport_cost_sar:Number(req.body?.transport_cost_sar||0),received_by:claims.sub,evidence_refs:Array.isArray(req.body?.evidence_refs)?req.body.evidence_refs:[],note:req.body?.note,supplier_invoice_number:req.body?.supplier_invoice_number});enterpriseV11={...enterpriseV11,multi_business_v20_2_3:r.state,enterprise_web_v20_2:r.web};persistEnterpriseState(claims.sub,'v20_2_3_purchase_receive');res.status(201).json({success:true,receipt:r.receipt,invoice:r.invoice});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'purchase_receive_failed'});}
});

app.post('/api/v20.2.3/sales-invoices', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res),unitId=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unitId,'operate'))return;const r=createSalesInvoiceV2023(enterpriseV11.multi_business_v20_2_3,enterpriseV11.enterprise_web_v20_2,{business_unit_id:unitId,warehouse_id:String(req.body?.warehouse_id||''),customer_id:String(req.body?.customer_id||''),invoice_date:String(req.body?.invoice_date||new Date().toISOString().slice(0,10)),invoice_time:String(req.body?.invoice_time||new Date().toTimeString().slice(0,5)),payment_term:req.body?.payment_term||'credit',currency:req.body?.currency||'SAR',exchange_rate_to_sar:Number(req.body?.exchange_rate_to_sar||1),lines:Array.isArray(req.body?.lines)?req.body.lines:[],issued_by:claims.sub,recipient_name:req.body?.recipient_name,treasury_account_id:req.body?.treasury_account_id});enterpriseV11={...enterpriseV11,multi_business_v20_2_3:r.state,enterprise_web_v20_2:r.web};persistEnterpriseState(claims.sub,'v20_2_3_sales_invoice');res.status(201).json({success:true,invoice:r.invoice});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'sales_invoice_failed'});}
});

app.post('/api/v20.2.3/receipts', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res),unitId=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unitId,'finance'))return;const r=recordCustomerReceiptV2023(enterpriseV11.multi_business_v20_2_3,enterpriseV11.enterprise_web_v20_2,{business_unit_id:unitId,customer_id:String(req.body?.customer_id||''),treasury_account_id:String(req.body?.treasury_account_id||''),date:String(req.body?.date||new Date().toISOString().slice(0,10)),time:String(req.body?.time||new Date().toTimeString().slice(0,5)),currency:req.body?.currency||'SAR',original_amount:Number(req.body?.original_amount||0),exchange_rate_to_sar:Number(req.body?.exchange_rate_to_sar||1),received_by:claims.sub,invoice_id:req.body?.invoice_id,note:req.body?.note});enterpriseV11={...enterpriseV11,multi_business_v20_2_3:r.state,enterprise_web_v20_2:r.web};persistEnterpriseState(claims.sub,'v20_2_3_customer_receipt');res.status(201).json({success:true,document:r.document});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'customer_receipt_failed'});}
});

app.post('/api/v20.2.3/supplier-payments', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res),unitId=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unitId,'finance'))return;const r=recordSupplierPaymentV2023(enterpriseV11.multi_business_v20_2_3,enterpriseV11.enterprise_web_v20_2,{business_unit_id:unitId,supplier_id:String(req.body?.supplier_id||''),treasury_account_id:String(req.body?.treasury_account_id||''),date:String(req.body?.date||new Date().toISOString().slice(0,10)),time:String(req.body?.time||new Date().toTimeString().slice(0,5)),currency:req.body?.currency||'SAR',original_amount:Number(req.body?.original_amount||0),exchange_rate_to_sar:Number(req.body?.exchange_rate_to_sar||1),paid_by:claims.sub,invoice_id:req.body?.invoice_id,note:req.body?.note});enterpriseV11={...enterpriseV11,multi_business_v20_2_3:r.state,enterprise_web_v20_2:r.web};persistEnterpriseState(claims.sub,'v20_2_3_supplier_payment');res.status(201).json({success:true,document:r.document});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'supplier_payment_failed'});}
});

app.post('/api/v20.2.3/transfers', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res),unitId=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unitId,'operate'))return;const next=createStockTransferV2023(enterpriseV11.multi_business_v20_2_3,{business_unit_id:unitId,from_warehouse_id:String(req.body?.from_warehouse_id||''),to_warehouse_id:String(req.body?.to_warehouse_id||''),product_id:String(req.body?.product_id||''),quantity_base:Number(req.body?.quantity_base||0),lot_number:req.body?.lot_number,requested_by:claims.sub},claims.sub);enterpriseV11={...enterpriseV11,multi_business_v20_2_3:next};persistEnterpriseState(claims.sub,'v20_2_3_transfer_create');res.status(201).json({success:true,transfer:next.stock_transfers[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'transfer_create_failed'});}
});
app.post('/api/v20.2.3/transfers/:id/dispatch', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),tr=enterpriseV11.multi_business_v20_2_3.stock_transfers.find(x=>x.id===req.params.id);if(!tr){res.status(404).json({success:false,error:'transfer_not_found'});return;}if(!businessOr403V2023(res,tr.business_unit_id,'operate'))return;const next=dispatchStockTransferV2023(enterpriseV11.multi_business_v20_2_3,tr.id,claims.sub);enterpriseV11={...enterpriseV11,multi_business_v20_2_3:next};persistEnterpriseState(claims.sub,'v20_2_3_transfer_dispatch');res.json({success:true,transfer:next.stock_transfers.find(x=>x.id===tr.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'transfer_dispatch_failed'});}});
app.post('/api/v20.2.3/transfers/:id/receive', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),tr=enterpriseV11.multi_business_v20_2_3.stock_transfers.find(x=>x.id===req.params.id);if(!tr){res.status(404).json({success:false,error:'transfer_not_found'});return;}const dest=enterpriseV11.multi_business_v20_2_3.warehouses.find(x=>x.id===tr.to_warehouse_id);if(!businessOr403V2023(res,dest?.business_unit_id,'operate'))return;const next=receiveStockTransferV2023(enterpriseV11.multi_business_v20_2_3,tr.id,claims.sub);enterpriseV11={...enterpriseV11,multi_business_v20_2_3:next};persistEnterpriseState(claims.sub,'v20_2_3_transfer_receive');res.json({success:true,transfer:next.stock_transfers.find(x=>x.id===tr.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'transfer_receive_failed'});}});

app.get('/api/v20.2.3/business-units/:id/dashboard', requireAuthV2021(), (req:Request,res:Response)=>{try{if(!businessOr403V2023(res,req.params.id,'read'))return;res.json(businessUnitDashboardV2023(enterpriseV11.multi_business_v20_2_3,req.params.id,enterpriseV11.veterinary_field_v20_2_2));}catch(error){res.status(404).json({success:false,error:error instanceof Error?error.message:'business_unit_dashboard_failed'});}});
app.get('/api/v20.2.3/factories/:id/dashboard', requireAuthV2021(), (req:Request,res:Response)=>{try{const f=enterpriseV11.multi_business_v20_2_3.factories.find(x=>x.id===req.params.id);if(!f){res.status(404).json({success:false,error:'factory_not_found'});return;}if(!businessOr403V2023(res,f.business_unit_id,'read'))return;res.json(factoryDashboardV2023(enterpriseV11.multi_business_v20_2_3,f.id));}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'factory_dashboard_failed'});}});



// ----------------------------------------------------
// V20.2.4 Feed Factory, Procurement & Inventory API
// ----------------------------------------------------
app.get('/api/v20.2.4/validation', requireAuthV2021(), (req:Request,res:Response)=>{
  const web=ensureFactoryFinanceV2024(enterpriseV11.enterprise_web_v20_2,enterpriseV11.multi_business_v20_2_3);
  const issues=validateFeedFactoryStateV2024(enterpriseV11.feed_factory_v20_2_4,enterpriseV11.multi_business_v20_2_3,web);
  res.json({version:'20.2.4',status:issues.length?'PARTIAL':'PASS',issues});
});
app.get('/api/v20.2.4/factories/:id/dashboard', requireAuthV2021(), (req:Request,res:Response)=>{try{const f=enterpriseV11.multi_business_v20_2_3.factories.find(x=>x.id===req.params.id);if(!f){res.status(404).json({success:false,error:'factory_not_found'});return;}if(!businessOr403V2023(res,f.business_unit_id,'read'))return;res.json(factoryOperationsDashboardV2024(enterpriseV11.feed_factory_v20_2_4,enterpriseV11.multi_business_v20_2_3,f.id));}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'factory_dashboard_failed'});}});
app.get('/api/v20.2.4/factories/:id/production-cost', requireAuthV2021(), (req:Request,res:Response)=>{const f=enterpriseV11.multi_business_v20_2_3.factories.find(x=>x.id===req.params.id);if(!f){res.status(404).json({success:false,error:'factory_not_found'});return;}if(!businessOr403V2023(res,f.business_unit_id,'read'))return;res.json({rows:productionCostReportV2024(enterpriseV11.feed_factory_v20_2_4,f.id)});});

app.post('/api/v20.2.4/formulas', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),factory=enterpriseV11.multi_business_v20_2_3.factories.find(x=>x.id===String(req.body?.factory_id||''));if(!factory){res.status(404).json({success:false,error:'factory_not_found'});return;}if(!businessOr403V2023(res,factory.business_unit_id,'operate'))return;const next=createFeedFormulaV2024(enterpriseV11.feed_factory_v20_2_4,enterpriseV11.multi_business_v20_2_3,{formula_code:String(req.body?.formula_code||''),name:String(req.body?.name||''),factory_id:factory.id,feed_product_type_id:String(req.body?.feed_product_type_id||''),finished_product_id:String(req.body?.finished_product_id||''),batch_basis_kg:req.body?.batch_basis_kg===undefined?undefined:Number(req.body.batch_basis_kg),ingredients:Array.isArray(req.body?.ingredients)?req.body.ingredients:[],targets:req.body?.targets,note:req.body?.note},claims.sub);enterpriseV11={...enterpriseV11,feed_factory_v20_2_4:next};persistEnterpriseState(claims.sub,'v20_2_4_formula_create');res.status(201).json({success:true,formula:next.formulas[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'formula_create_failed'});}});
app.post('/api/v20.2.4/formulas/:id/review', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),formula=enterpriseV11.feed_factory_v20_2_4.formulas.find(x=>x.id===req.params.id);if(!formula){res.status(404).json({success:false,error:'formula_not_found'});return;}const f=enterpriseV11.multi_business_v20_2_3.factories.find(x=>x.id===formula.factory_id);if(!businessOr403V2023(res,f?.business_unit_id,'operate'))return;const next=submitFormulaForReviewV2024(enterpriseV11.feed_factory_v20_2_4,formula.id,claims.sub);enterpriseV11={...enterpriseV11,feed_factory_v20_2_4:next};persistEnterpriseState(claims.sub,'v20_2_4_formula_review');res.json({success:true,formula:next.formulas.find(x=>x.id===formula.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'formula_review_failed'});}});
app.post('/api/v20.2.4/formulas/:id/approve', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),formula=enterpriseV11.feed_factory_v20_2_4.formulas.find(x=>x.id===req.params.id);if(!formula){res.status(404).json({success:false,error:'formula_not_found'});return;}const f=enterpriseV11.multi_business_v20_2_3.factories.find(x=>x.id===formula.factory_id);if(!businessOr403V2023(res,f?.business_unit_id,'admin'))return;const next=approveFeedFormulaV2024(enterpriseV11.feed_factory_v20_2_4,enterpriseV11.multi_business_v20_2_3,formula.id,claims.sub);enterpriseV11={...enterpriseV11,feed_factory_v20_2_4:next};persistEnterpriseState(claims.sub,'v20_2_4_formula_approve');res.json({success:true,formula:next.formulas.find(x=>x.id===formula.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'formula_approve_failed'});}});

app.post('/api/v20.2.4/procurement/requisitions', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),unit=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unit,'operate'))return;const next=createPurchaseRequisitionV2024(enterpriseV11.feed_factory_v20_2_4,enterpriseV11.multi_business_v20_2_3,{business_unit_id:unit,warehouse_id:String(req.body?.warehouse_id||''),factory_id:req.body?.factory_id,requested_by:claims.sub,request_date:String(req.body?.request_date||new Date().toISOString().slice(0,10)),reason:String(req.body?.reason||''),lines:Array.isArray(req.body?.lines)?req.body.lines:[]},claims.sub);enterpriseV11={...enterpriseV11,feed_factory_v20_2_4:next};persistEnterpriseState(claims.sub,'v20_2_4_requisition_create');res.status(201).json({success:true,requisition:next.purchase_requisitions[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'requisition_create_failed'});}});
app.post('/api/v20.2.4/procurement/requisitions/:id/approve', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),r=enterpriseV11.feed_factory_v20_2_4.purchase_requisitions.find(x=>x.id===req.params.id);if(!r){res.status(404).json({success:false,error:'requisition_not_found'});return;}if(!businessOr403V2023(res,r.business_unit_id,'admin'))return;const next=approvePurchaseRequisitionV2024(enterpriseV11.feed_factory_v20_2_4,r.id,claims.sub);enterpriseV11={...enterpriseV11,feed_factory_v20_2_4:next};persistEnterpriseState(claims.sub,'v20_2_4_requisition_approve');res.json({success:true,requisition:next.purchase_requisitions.find(x=>x.id===r.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'requisition_approve_failed'});}});
app.post('/api/v20.2.4/procurement/requisitions/:id/quotes', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),r=enterpriseV11.feed_factory_v20_2_4.purchase_requisitions.find(x=>x.id===req.params.id);if(!r){res.status(404).json({success:false,error:'requisition_not_found'});return;}if(!businessOr403V2023(res,r.business_unit_id,'operate'))return;const next=addSupplierQuoteV2024(enterpriseV11.feed_factory_v20_2_4,enterpriseV11.multi_business_v20_2_3,{requisition_id:r.id,supplier_id:String(req.body?.supplier_id||''),quoted_at:String(req.body?.quoted_at||new Date().toISOString()),valid_until:req.body?.valid_until,transport_cost_sar:Number(req.body?.transport_cost_sar||0),lines:Array.isArray(req.body?.lines)?req.body.lines:[],note:req.body?.note},claims.sub);enterpriseV11={...enterpriseV11,feed_factory_v20_2_4:next};persistEnterpriseState(claims.sub,'v20_2_4_quote_add');res.status(201).json({success:true,quote:next.supplier_quotes[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'quote_add_failed'});}});
app.post('/api/v20.2.4/procurement/quotes/:id/award', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),q=enterpriseV11.feed_factory_v20_2_4.supplier_quotes.find(x=>x.id===req.params.id),r=q&&enterpriseV11.feed_factory_v20_2_4.purchase_requisitions.find(x=>x.id===q.requisition_id);if(!q||!r){res.status(404).json({success:false,error:'quote_or_requisition_not_found'});return;}if(!businessOr403V2023(res,r.business_unit_id,'admin'))return;const next=awardSupplierQuoteV2024(enterpriseV11.feed_factory_v20_2_4,q.id,claims.sub);enterpriseV11={...enterpriseV11,feed_factory_v20_2_4:next};persistEnterpriseState(claims.sub,'v20_2_4_quote_award');res.json({success:true,quote:next.supplier_quotes.find(x=>x.id===q.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'quote_award_failed'});}});

app.post('/api/v20.2.4/manufacturing-orders', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),f=enterpriseV11.multi_business_v20_2_3.factories.find(x=>x.id===String(req.body?.factory_id||''));if(!f){res.status(404).json({success:false,error:'factory_not_found'});return;}if(!businessOr403V2023(res,f.business_unit_id,'operate'))return;const next=createManufacturingOrderV2024(enterpriseV11.feed_factory_v20_2_4,enterpriseV11.multi_business_v20_2_3,{factory_id:f.id,formula_id:String(req.body?.formula_id||''),planned_output_kg:Number(req.body?.planned_output_kg||0),bag_weight_kg:req.body?.bag_weight_kg===undefined?undefined:Number(req.body.bag_weight_kg),scheduled_date:String(req.body?.scheduled_date||new Date().toISOString().slice(0,10)),requested_by:claims.sub,production_supervisor_user_id:req.body?.production_supervisor_user_id,note:req.body?.note},claims.sub);enterpriseV11={...enterpriseV11,feed_factory_v20_2_4:next};persistEnterpriseState(claims.sub,'v20_2_4_manufacturing_create');res.status(201).json({success:true,order:next.manufacturing_orders[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'manufacturing_create_failed'});}});
app.post('/api/v20.2.4/manufacturing-orders/:id/approve', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),o=enterpriseV11.feed_factory_v20_2_4.manufacturing_orders.find(x=>x.id===req.params.id);if(!o){res.status(404).json({success:false,error:'manufacturing_order_not_found'});return;}if(!businessOr403V2023(res,o.business_unit_id,'admin'))return;const r=approveManufacturingOrderV2024(enterpriseV11.feed_factory_v20_2_4,enterpriseV11.multi_business_v20_2_3,o.id,claims.sub);enterpriseV11={...enterpriseV11,feed_factory_v20_2_4:r.state,multi_business_v20_2_3:r.multiBusiness};persistEnterpriseState(claims.sub,'v20_2_4_manufacturing_approve');res.json({success:true,order:r.state.manufacturing_orders.find(x=>x.id===o.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'manufacturing_approve_failed'});}});
app.post('/api/v20.2.4/manufacturing-orders/:id/start', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),o=enterpriseV11.feed_factory_v20_2_4.manufacturing_orders.find(x=>x.id===req.params.id);if(!o){res.status(404).json({success:false,error:'manufacturing_order_not_found'});return;}if(!businessOr403V2023(res,o.business_unit_id,'operate'))return;const r=startManufacturingOrderV2024(enterpriseV11.feed_factory_v20_2_4,enterpriseV11.multi_business_v20_2_3,enterpriseV11.enterprise_web_v20_2,o.id,{actor:claims.sub,actual_materials:Array.isArray(req.body?.actual_materials)?req.body.actual_materials:undefined,started_at:req.body?.started_at});enterpriseV11={...enterpriseV11,feed_factory_v20_2_4:r.state,multi_business_v20_2_3:r.multiBusiness,enterprise_web_v20_2:r.web};persistEnterpriseState(claims.sub,'v20_2_4_manufacturing_start');res.json({success:true,order:r.state.manufacturing_orders.find(x=>x.id===o.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'manufacturing_start_failed'});}});
app.post('/api/v20.2.4/manufacturing-orders/:id/complete', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),o=enterpriseV11.feed_factory_v20_2_4.manufacturing_orders.find(x=>x.id===req.params.id);if(!o){res.status(404).json({success:false,error:'manufacturing_order_not_found'});return;}if(!businessOr403V2023(res,o.business_unit_id,'operate'))return;const r=completeManufacturingOrderV2024(enterpriseV11.feed_factory_v20_2_4,enterpriseV11.multi_business_v20_2_3,enterpriseV11.enterprise_web_v20_2,o.id,{actor:claims.sub,actual_output_kg:Number(req.body?.actual_output_kg||0),direct_labor_sar:Number(req.body?.direct_labor_sar||0),allocated_overhead_sar:Number(req.body?.allocated_overhead_sar||0),completed_at:req.body?.completed_at,lot_number:req.body?.lot_number});enterpriseV11={...enterpriseV11,feed_factory_v20_2_4:r.state,multi_business_v20_2_3:r.multiBusiness,enterprise_web_v20_2:r.web};persistEnterpriseState(claims.sub,'v20_2_4_manufacturing_complete');res.json({success:true,order:r.state.manufacturing_orders.find(x=>x.id===o.id),batch:r.batch});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'manufacturing_complete_failed'});}});

app.post('/api/v20.2.4/dispatches', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),f=enterpriseV11.multi_business_v20_2_3.factories.find(x=>x.id===String(req.body?.factory_id||''));if(!f){res.status(404).json({success:false,error:'factory_not_found'});return;}if(!businessOr403V2023(res,f.business_unit_id,'operate'))return;const next=createFactoryDispatchV2024(enterpriseV11.feed_factory_v20_2_4,enterpriseV11.multi_business_v20_2_3,{factory_id:f.id,destination_type:req.body?.destination_type||'warehouse',destination_business_unit_id:req.body?.destination_business_unit_id,destination_warehouse_id:String(req.body?.destination_warehouse_id||''),farm_id:req.body?.farm_id,flock_id:req.body?.flock_id,product_id:String(req.body?.product_id||''),production_batch_id:req.body?.production_batch_id,quantity_kg:Number(req.body?.quantity_kg||0),bag_weight_kg:req.body?.bag_weight_kg===undefined?undefined:Number(req.body.bag_weight_kg),requested_by:claims.sub,evidence_refs:Array.isArray(req.body?.evidence_refs)?req.body.evidence_refs:[]},claims.sub);enterpriseV11={...enterpriseV11,feed_factory_v20_2_4:next};persistEnterpriseState(claims.sub,'v20_2_4_dispatch_create');res.status(201).json({success:true,dispatch:next.dispatches[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'dispatch_create_failed'});}});
app.post('/api/v20.2.4/dispatches/:id/approve', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),d=enterpriseV11.feed_factory_v20_2_4.dispatches.find(x=>x.id===req.params.id);if(!d){res.status(404).json({success:false,error:'dispatch_not_found'});return;}if(!businessOr403V2023(res,d.business_unit_id,'admin'))return;const next=approveFactoryDispatchV2024(enterpriseV11.feed_factory_v20_2_4,d.id,claims.sub);enterpriseV11={...enterpriseV11,feed_factory_v20_2_4:next};persistEnterpriseState(claims.sub,'v20_2_4_dispatch_approve');res.json({success:true,dispatch:next.dispatches.find(x=>x.id===d.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'dispatch_approve_failed'});}});
app.post('/api/v20.2.4/dispatches/:id/dispatch', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),d=enterpriseV11.feed_factory_v20_2_4.dispatches.find(x=>x.id===req.params.id);if(!d){res.status(404).json({success:false,error:'dispatch_not_found'});return;}if(!businessOr403V2023(res,d.business_unit_id,'operate'))return;const r=dispatchFactoryGoodsV2024(enterpriseV11.feed_factory_v20_2_4,enterpriseV11.multi_business_v20_2_3,d.id,claims.sub);enterpriseV11={...enterpriseV11,feed_factory_v20_2_4:r.state,multi_business_v20_2_3:r.multiBusiness};persistEnterpriseState(claims.sub,'v20_2_4_dispatch_goods');res.json({success:true,dispatch:r.state.dispatches.find(x=>x.id===d.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'dispatch_failed'});}});
app.post('/api/v20.2.4/dispatches/:id/receive', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),d=enterpriseV11.feed_factory_v20_2_4.dispatches.find(x=>x.id===req.params.id);if(!d){res.status(404).json({success:false,error:'dispatch_not_found'});return;}const wh=enterpriseV11.multi_business_v20_2_3.warehouses.find(x=>x.id===d.destination_warehouse_id);if(!businessOr403V2023(res,wh?.business_unit_id,'operate'))return;const r=receiveFactoryDispatchV2024(enterpriseV11.feed_factory_v20_2_4,enterpriseV11.multi_business_v20_2_3,enterpriseV11.enterprise_web_v20_2,d.id,{actor:claims.sub,accepted_kg:Number(req.body?.accepted_kg||0),damaged_kg:Number(req.body?.damaged_kg||0),evidence_refs:Array.isArray(req.body?.evidence_refs)?req.body.evidence_refs:[]});enterpriseV11={...enterpriseV11,feed_factory_v20_2_4:r.state,multi_business_v20_2_3:r.multiBusiness,enterprise_web_v20_2:r.web};persistEnterpriseState(claims.sub,'v20_2_4_dispatch_receive');res.json({success:true,dispatch:r.state.dispatches.find(x=>x.id===d.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'dispatch_receive_failed'});}});
app.post('/api/v20.2.4/farm-feed-consumption', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),unit=String(req.body?.business_unit_id||''),farm=String(req.body?.farm_id||'');if(!businessOr403V2023(res,unit,'operate'))return;const r=recordFarmFeedConsumptionV2024(enterpriseV11.feed_factory_v20_2_4,enterpriseV11.multi_business_v20_2_3,enterpriseV11.enterprise_web_v20_2,{business_unit_id:unit,farm_id:farm,flock_id:req.body?.flock_id,warehouse_id:String(req.body?.warehouse_id||''),product_id:String(req.body?.product_id||''),consumption_date:String(req.body?.consumption_date||new Date().toISOString().slice(0,10)),quantity_kg:Number(req.body?.quantity_kg||0),source_report_id:req.body?.source_report_id,recorded_by:claims.sub});enterpriseV11={...enterpriseV11,feed_factory_v20_2_4:r.state,multi_business_v20_2_3:r.multiBusiness,enterprise_web_v20_2:r.web};persistEnterpriseState(claims.sub,'v20_2_4_farm_feed_consumption');res.status(201).json({success:true,record:r.record});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'farm_feed_consumption_failed'});}});

// ----------------------------------------------------
// V20.2.5 Workforce, Payroll & Managed Business API
// ----------------------------------------------------
app.get('/api/v20.2.5/validation', requireAuthV2021(), (_req:Request,res:Response)=>{
  const web=ensureWorkforceFinanceV2025(enterpriseV11.enterprise_web_v20_2,enterpriseV11.multi_business_v20_2_3,enterpriseV11.workforce_payroll_v20_2_5);
  const issues=validateWorkforcePayrollStateV2025(enterpriseV11.workforce_payroll_v20_2_5,enterpriseV11.multi_business_v20_2_3,web,enterpriseV11.feed_factory_v20_2_4);
  res.json({version:'20.2.5',status:issues.length?'PARTIAL':'PASS',issues});
});
app.get('/api/v20.2.5/business-units/:id/workforce-dashboard', requireAuthV2021(), (req:Request,res:Response)=>{try{if(!businessOr403V2023(res,req.params.id,'read'))return;res.json(workforceDashboardV2025(enterpriseV11.workforce_payroll_v20_2_5,enterpriseV11.multi_business_v20_2_3,req.params.id));}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'workforce_dashboard_failed'});}});
app.get('/api/v20.2.5/employees/:id', requireAuthV2021(), (req:Request,res:Response)=>{try{const p=enterpriseV11.workforce_payroll_v20_2_5.profiles.find(x=>x.employee_id===req.params.id||x.id===req.params.id);if(!p){res.status(404).json({success:false,error:'employee_not_found'});return;}if(!businessOr403V2023(res,p.home_business_unit_id,'read'))return;res.json(employee360V2025(enterpriseV11.workforce_payroll_v20_2_5,p.employee_id));}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'employee_360_failed'});}});
app.post('/api/v20.2.5/employees', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),unit=String(req.body?.home_business_unit_id||'');if(!businessOr403V2023(res,unit,'admin'))return;const r=createWorkforceEmployeeV2025(enterpriseV11.workforce_payroll_v20_2_5,enterpriseV11.enterprise_web_v20_2,enterpriseV11.multi_business_v20_2_3,{user_id:req.body?.user_id,full_name:String(req.body?.full_name||''),job_family:req.body?.job_family||'worker',job_title:String(req.body?.job_title||''),department_code:String(req.body?.department_code||'HR'),home_business_unit_id:unit,supervisor_employee_id:req.body?.supervisor_employee_id,phone:req.body?.phone,default_currency:req.body?.default_currency||'SAR',professional_license_no:req.body?.professional_license_no,license_expiry_date:req.body?.license_expiry_date,hired_at:String(req.body?.hired_at||new Date().toISOString().slice(0,10))},claims.sub);enterpriseV11={...enterpriseV11,workforce_payroll_v20_2_5:r.state,enterprise_web_v20_2:r.web};persistEnterpriseState(claims.sub,'v20_2_5_employee_create');res.status(201).json({success:true,profile:r.profile});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'employee_create_failed'});}});
app.post('/api/v20.2.5/contracts', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),unit=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unit,'admin'))return;const r=createCompensationContractV2025(enterpriseV11.workforce_payroll_v20_2_5,enterpriseV11.enterprise_web_v20_2,enterpriseV11.multi_business_v20_2_3,{employee_id:String(req.body?.employee_id||''),business_unit_id:unit,start_date:String(req.body?.start_date||new Date().toISOString().slice(0,10)),end_date:req.body?.end_date,currency:req.body?.currency||'SAR',exchange_rate_to_sar:Number(req.body?.exchange_rate_to_sar||1),model:req.body?.model||'monthly_salary',base_salary:Number(req.body?.base_salary||0),daily_rate:Number(req.body?.daily_rate||0),hourly_rate:Number(req.body?.hourly_rate||0),overtime_rate:Number(req.body?.overtime_rate||0),per_visit_fee:Number(req.body?.per_visit_fee||0),per_farm_fee:Number(req.body?.per_farm_fee||0),per_cycle_fee:Number(req.body?.per_cycle_fee||0),transport_allowance:Number(req.body?.transport_allowance||0),housing_allowance:Number(req.body?.housing_allowance||0),other_allowance:Number(req.body?.other_allowance||0),commission_rule_id:req.body?.commission_rule_id,payer_breakdown:Array.isArray(req.body?.payer_breakdown)?req.body.payer_breakdown:[{payer:'business_unit',percent:100}],payment_day:req.body?.payment_day===undefined?undefined:Number(req.body.payment_day),probation_end_date:req.body?.probation_end_date,notice_days:Number(req.body?.notice_days||30),status:req.body?.status||'active'},claims.sub);enterpriseV11={...enterpriseV11,workforce_payroll_v20_2_5:r.state,enterprise_web_v20_2:r.web};persistEnterpriseState(claims.sub,'v20_2_5_contract_create');res.status(201).json({success:true,contract:r.contract});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'contract_create_failed'});}});
app.post('/api/v20.2.5/assignments', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),unit=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unit,'admin'))return;const r=createWorkforceAssignmentV2025(enterpriseV11.workforce_payroll_v20_2_5,enterpriseV11.enterprise_web_v20_2,enterpriseV11.multi_business_v20_2_3,{employee_id:String(req.body?.employee_id||''),business_unit_id:unit,scope_type:req.body?.scope_type||'business_unit',role_code:String(req.body?.role_code||'worker'),allocation_percent:Number(req.body?.allocation_percent||100),branch_id:req.body?.branch_id,factory_id:req.body?.factory_id,warehouse_id:req.body?.warehouse_id,farm_id:req.body?.farm_id,flock_id:req.body?.flock_id,territory_id:req.body?.territory_id,cost_center_id:req.body?.cost_center_id,starts_at:String(req.body?.starts_at||new Date().toISOString().slice(0,10)),ends_at:req.body?.ends_at,primary:req.body?.primary!==false,active:req.body?.active!==false},claims.sub);enterpriseV11={...enterpriseV11,workforce_payroll_v20_2_5:r.state,enterprise_web_v20_2:r.web};persistEnterpriseState(claims.sub,'v20_2_5_assignment_create');res.status(201).json({success:true,assignment:r.assignment});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'assignment_create_failed'});}});
app.post('/api/v20.2.5/attendance', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),unit=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unit,'operate'))return;const next=recordAttendanceV2025(enterpriseV11.workforce_payroll_v20_2_5,enterpriseV11.multi_business_v20_2_3,{employee_id:String(req.body?.employee_id||''),business_unit_id:unit,work_date:String(req.body?.work_date||new Date().toISOString().slice(0,10)),status:req.body?.status||'present',check_in_at:req.body?.check_in_at,check_out_at:req.body?.check_out_at,regular_hours:Number(req.body?.regular_hours||0),overtime_hours:Number(req.body?.overtime_hours||0),farm_id:req.body?.farm_id,factory_id:req.body?.factory_id,manufacturing_order_id:req.body?.manufacturing_order_id,visit_case_id:req.body?.visit_case_id,evidence_refs:Array.isArray(req.body?.evidence_refs)?req.body.evidence_refs:[],note:req.body?.note,recorded_by:claims.sub});enterpriseV11={...enterpriseV11,workforce_payroll_v20_2_5:next};persistEnterpriseState(claims.sub,'v20_2_5_attendance');res.status(201).json({success:true,attendance:next.attendance[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'attendance_failed'});}});
app.post('/api/v20.2.5/leaves', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),unit=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unit,'read'))return;const next=requestLeaveV2025(enterpriseV11.workforce_payroll_v20_2_5,enterpriseV11.multi_business_v20_2_3,{employee_id:String(req.body?.employee_id||''),business_unit_id:unit,leave_type:req.body?.leave_type||'annual',from_date:String(req.body?.from_date||''),to_date:String(req.body?.to_date||''),reason:String(req.body?.reason||''),requested_by:claims.sub});enterpriseV11={...enterpriseV11,workforce_payroll_v20_2_5:next};persistEnterpriseState(claims.sub,'v20_2_5_leave_request');res.status(201).json({success:true,leave:next.leave_requests[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'leave_request_failed'});}});
app.post('/api/v20.2.5/leaves/:id/decision', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),leave=enterpriseV11.workforce_payroll_v20_2_5.leave_requests.find(x=>x.id===req.params.id);if(!leave){res.status(404).json({success:false,error:'leave_not_found'});return;}if(!businessOr403V2023(res,leave.business_unit_id,'admin'))return;const next=decideLeaveV2025(enterpriseV11.workforce_payroll_v20_2_5,leave.id,Boolean(req.body?.approved),claims.sub);enterpriseV11={...enterpriseV11,workforce_payroll_v20_2_5:next};persistEnterpriseState(claims.sub,'v20_2_5_leave_decision');res.json({success:true,leave:next.leave_requests.find(x=>x.id===leave.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'leave_decision_failed'});}});
app.post('/api/v20.2.5/commission-rules', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),unit=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unit,'admin'))return;const next=createCommissionRuleV2025(enterpriseV11.workforce_payroll_v20_2_5,enterpriseV11.multi_business_v20_2_3,{code:String(req.body?.code||''),business_unit_id:unit,name:String(req.body?.name||''),basis:req.body?.basis||'collected_sales',rate_type:req.body?.rate_type||'percent',percent:req.body?.percent===undefined?undefined:Number(req.body.percent),amount_per_unit_sar:req.body?.amount_per_unit_sar===undefined?undefined:Number(req.body.amount_per_unit_sar),tiers:req.body?.tiers,active:req.body?.active!==false},claims.sub);enterpriseV11={...enterpriseV11,workforce_payroll_v20_2_5:next};persistEnterpriseState(claims.sub,'v20_2_5_commission_rule');res.status(201).json({success:true,rule:next.commission_rules[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'commission_rule_failed'});}});
app.post('/api/v20.2.5/advances', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),unit=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unit,'read'))return;const next=requestEmployeeAdvanceV2025(enterpriseV11.workforce_payroll_v20_2_5,enterpriseV11.multi_business_v20_2_3,{employee_id:String(req.body?.employee_id||''),business_unit_id:unit,request_date:String(req.body?.request_date||new Date().toISOString().slice(0,10)),currency:req.body?.currency||'SAR',original_amount:Number(req.body?.original_amount||0),exchange_rate_to_sar:Number(req.body?.exchange_rate_to_sar||1),installments:Number(req.body?.installments||1),reason:String(req.body?.reason||''),requested_by:claims.sub});enterpriseV11={...enterpriseV11,workforce_payroll_v20_2_5:next};persistEnterpriseState(claims.sub,'v20_2_5_advance_request');res.status(201).json({success:true,advance:next.advances[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'advance_request_failed'});}});
app.post('/api/v20.2.5/advances/:id/approve', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),adv=enterpriseV11.workforce_payroll_v20_2_5.advances.find(x=>x.id===req.params.id);if(!adv){res.status(404).json({success:false,error:'advance_not_found'});return;}if(!businessOr403V2023(res,adv.business_unit_id,'admin'))return;const next=approveEmployeeAdvanceV2025(enterpriseV11.workforce_payroll_v20_2_5,adv.id,claims.sub,true);enterpriseV11={...enterpriseV11,workforce_payroll_v20_2_5:next};persistEnterpriseState(claims.sub,'v20_2_5_advance_approve');res.json({success:true,advance:next.advances.find(x=>x.id===adv.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'advance_approve_failed'});}});
app.post('/api/v20.2.5/advances/:id/pay', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),adv=enterpriseV11.workforce_payroll_v20_2_5.advances.find(x=>x.id===req.params.id);if(!adv){res.status(404).json({success:false,error:'advance_not_found'});return;}if(!businessOr403V2023(res,adv.business_unit_id,'finance'))return;const r=payEmployeeAdvanceV2025(enterpriseV11.workforce_payroll_v20_2_5,enterpriseV11.multi_business_v20_2_3,enterpriseV11.enterprise_web_v20_2,{advance_id:adv.id,treasury_account_id:String(req.body?.treasury_account_id||''),paid_by:claims.sub,payment_date:String(req.body?.payment_date||new Date().toISOString().slice(0,10))});enterpriseV11={...enterpriseV11,workforce_payroll_v20_2_5:r.state,multi_business_v20_2_3:r.multiBusiness,enterprise_web_v20_2:r.web};persistEnterpriseState(claims.sub,'v20_2_5_advance_pay');res.json({success:true,advance:r.state.advances.find(x=>x.id===adv.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'advance_pay_failed'});}});
app.post('/api/v20.2.5/payroll-periods', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),unit=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unit,'finance'))return;const next=createPayrollPeriodV2025(enterpriseV11.workforce_payroll_v20_2_5,enterpriseV11.multi_business_v20_2_3,{period_code:String(req.body?.period_code||''),business_unit_id:unit,date_from:String(req.body?.date_from||''),date_to:String(req.body?.date_to||''),pay_date:String(req.body?.pay_date||''),currency:req.body?.currency||'SAR',created_by:claims.sub});enterpriseV11={...enterpriseV11,workforce_payroll_v20_2_5:next};persistEnterpriseState(claims.sub,'v20_2_5_payroll_period_create');res.status(201).json({success:true,period:next.payroll_periods[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'payroll_period_create_failed'});}});
app.post('/api/v20.2.5/payroll-periods/:id/lines', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),period=enterpriseV11.workforce_payroll_v20_2_5.payroll_periods.find(x=>x.id===req.params.id);if(!period){res.status(404).json({success:false,error:'payroll_period_not_found'});return;}if(!businessOr403V2023(res,period.business_unit_id,'finance'))return;const next=generatePayrollLineV2025(enterpriseV11.workforce_payroll_v20_2_5,enterpriseV11.multi_business_v20_2_3,enterpriseV11.enterprise_web_v20_2,{payroll_period_id:period.id,employee_id:String(req.body?.employee_id||''),visits:req.body?.visits===undefined?undefined:Number(req.body.visits),farms:req.body?.farms===undefined?undefined:Number(req.body.farms),cycles:req.body?.cycles===undefined?undefined:Number(req.body.cycles),bonus:req.body?.bonus===undefined?undefined:Number(req.body.bonus),other_deductions:req.body?.other_deductions===undefined?undefined:Number(req.body.other_deductions)});enterpriseV11={...enterpriseV11,workforce_payroll_v20_2_5:next};persistEnterpriseState(claims.sub,'v20_2_5_payroll_line_generate');res.status(201).json({success:true,line:next.payroll_lines[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'payroll_line_generate_failed'});}});
app.post('/api/v20.2.5/payroll-periods/:id/approve', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),period=enterpriseV11.workforce_payroll_v20_2_5.payroll_periods.find(x=>x.id===req.params.id);if(!period){res.status(404).json({success:false,error:'payroll_period_not_found'});return;}if(!businessOr403V2023(res,period.business_unit_id,'finance'))return;const r=approvePayrollPeriodV2025(enterpriseV11.workforce_payroll_v20_2_5,enterpriseV11.enterprise_web_v20_2,enterpriseV11.multi_business_v20_2_3,period.id,claims.sub);enterpriseV11={...enterpriseV11,workforce_payroll_v20_2_5:r.state,enterprise_web_v20_2:r.web};persistEnterpriseState(claims.sub,'v20_2_5_payroll_approve');res.json({success:true,register:payrollRegisterV2025(r.state,period.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'payroll_approve_failed'});}});
app.post('/api/v20.2.5/payroll-lines/:id/pay', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),line=enterpriseV11.workforce_payroll_v20_2_5.payroll_lines.find(x=>x.id===req.params.id);if(!line){res.status(404).json({success:false,error:'payroll_line_not_found'});return;}if(!businessOr403V2023(res,line.business_unit_id,'finance'))return;const r=payPayrollLineV2025(enterpriseV11.workforce_payroll_v20_2_5,enterpriseV11.multi_business_v20_2_3,enterpriseV11.enterprise_web_v20_2,{payroll_line_id:line.id,treasury_account_id:String(req.body?.treasury_account_id||''),payment_date:String(req.body?.payment_date||new Date().toISOString().slice(0,10)),amount_sar:req.body?.amount_sar===undefined?undefined:Number(req.body.amount_sar),paid_by:claims.sub});enterpriseV11={...enterpriseV11,workforce_payroll_v20_2_5:r.state,multi_business_v20_2_3:r.multiBusiness,enterprise_web_v20_2:r.web};persistEnterpriseState(claims.sub,'v20_2_5_payroll_pay');res.json({success:true,payment:r.payment});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'payroll_payment_failed'});}});
app.get('/api/v20.2.5/payroll-periods/:id/register', requireAuthV2021(), (req:Request,res:Response)=>{try{const period=enterpriseV11.workforce_payroll_v20_2_5.payroll_periods.find(x=>x.id===req.params.id);if(!period){res.status(404).json({success:false,error:'payroll_period_not_found'});return;}if(!businessOr403V2023(res,period.business_unit_id,'finance'))return;res.json(payrollRegisterV2025(enterpriseV11.workforce_payroll_v20_2_5,period.id));}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'payroll_register_failed'});}});
app.post('/api/v20.2.5/transport-trips', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),unit=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unit,'operate'))return;const r=createTransportTripV2025(enterpriseV11.workforce_payroll_v20_2_5,enterpriseV11.enterprise_web_v20_2,enterpriseV11.multi_business_v20_2_3,{business_unit_id:unit,driver_employee_id:req.body?.driver_employee_id,vehicle_ref:req.body?.vehicle_ref,trip_date:String(req.body?.trip_date||new Date().toISOString().slice(0,10)),from_location:String(req.body?.from_location||''),to_location:String(req.body?.to_location||''),farm_id:req.body?.farm_id,factory_id:req.body?.factory_id,warehouse_id:req.body?.warehouse_id,purchase_order_id:req.body?.purchase_order_id,dispatch_id:req.body?.dispatch_id,distance_km:Number(req.body?.distance_km||0),transport_fee_sar:Number(req.body?.transport_fee_sar||0),fuel_cost_sar:Number(req.body?.fuel_cost_sar||0),loading_cost_sar:Number(req.body?.loading_cost_sar||0),payer:req.body?.payer||'business_unit',cost_center_id:req.body?.cost_center_id,status:req.body?.status||'completed',created_by:claims.sub},claims.sub);enterpriseV11={...enterpriseV11,workforce_payroll_v20_2_5:r.state,enterprise_web_v20_2:r.web};persistEnterpriseState(claims.sub,'v20_2_5_transport_trip');res.status(201).json({success:true,trip:r.trip});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'transport_trip_failed'});}});
app.post('/api/v20.2.5/factory-labor', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),factory=enterpriseV11.multi_business_v20_2_3.factories.find(x=>x.id===String(req.body?.factory_id||''));if(!factory){res.status(404).json({success:false,error:'factory_not_found'});return;}if(!businessOr403V2023(res,factory.business_unit_id,'operate'))return;const next=allocateFactoryLaborV2025(enterpriseV11.workforce_payroll_v20_2_5,enterpriseV11.feed_factory_v20_2_4,enterpriseV11.multi_business_v20_2_3,{factory_id:factory.id,manufacturing_order_id:String(req.body?.manufacturing_order_id||''),employee_id:String(req.body?.employee_id||''),attendance_id:req.body?.attendance_id,work_date:String(req.body?.work_date||new Date().toISOString().slice(0,10)),hours:Number(req.body?.hours||0),labor_cost_sar:Number(req.body?.labor_cost_sar||0),allocated_by:claims.sub});enterpriseV11={...enterpriseV11,workforce_payroll_v20_2_5:next};persistEnterpriseState(claims.sub,'v20_2_5_factory_labor');res.status(201).json({success:true,allocation:next.factory_labor_allocations[0],manufacturing_labor_cost_sar:manufacturingLaborCostV2025(next,String(req.body?.manufacturing_order_id||''))});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'factory_labor_failed'});}});
app.post('/api/v20.2.5/employee-documents', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),p=enterpriseV11.workforce_payroll_v20_2_5.profiles.find(x=>x.employee_id===String(req.body?.employee_id||''));if(!p){res.status(404).json({success:false,error:'employee_not_found'});return;}if(!businessOr403V2023(res,p.home_business_unit_id,'admin'))return;const next=registerEmployeeDocumentV2025(enterpriseV11.workforce_payroll_v20_2_5,{employee_id:p.employee_id,document_type:req.body?.document_type||'other',title:String(req.body?.title||''),reference:String(req.body?.reference||''),issued_at:req.body?.issued_at,expires_at:req.body?.expires_at,visibility:req.body?.visibility||'hr',uploaded_by:claims.sub});enterpriseV11={...enterpriseV11,workforce_payroll_v20_2_5:next};persistEnterpriseState(claims.sub,'v20_2_5_employee_document');res.status(201).json({success:true,document:next.employee_documents[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'employee_document_failed'});}});

// ----------------------------------------------------
// V20.2.6 Executive Intelligence, Reports & Business Control API
// ----------------------------------------------------
app.get('/api/v20.2.6/command-center', requireAuthV2021(), (req:Request,res:Response)=>{try{const unit=String(req.query.business_unit_id||'')||undefined;if(!businessOr403V2023(res,unit,'read'))return;const data=executiveCommandCenterV2026(enterpriseV11.executive_intelligence_v20_2_6,enterpriseV11.enterprise_web_v20_2,enterpriseV11.enterprise_foundation_v20_2_1,enterpriseV11.veterinary_field_v20_2_2,enterpriseV11.multi_business_v20_2_3,enterpriseV11.feed_factory_v20_2_4,enterpriseV11.workforce_payroll_v20_2_5);res.json(unit?{...data,unit_profitability:data.unit_profitability.filter(x=>x.business_unit_id===unit)}:data);}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'command_center_failed'});}});
app.get('/api/v20.2.6/profitability', requireAuthV2021(), (req:Request,res:Response)=>{const unit=String(req.query.business_unit_id||'')||undefined;if(!businessOr403V2023(res,unit,'read'))return;const rows=profitabilityV2026(enterpriseV11.enterprise_web_v20_2,enterpriseV11.multi_business_v20_2_3,enterpriseV11.workforce_payroll_v20_2_5).filter(x=>!unit||x.business_unit_id===unit);res.json({version:'20.2.6',rows});});
app.get('/api/v20.2.6/finance-control', requireAuthV2021(), (req:Request,res:Response)=>{const unit=String(req.query.business_unit_id||'')||undefined;if(!businessOr403V2023(res,unit,'finance'))return;res.json(financeControlV2026(enterpriseV11.enterprise_web_v20_2,enterpriseV11.multi_business_v20_2_3,unit));});
app.get('/api/v20.2.6/inventory-intelligence', requireAuthV2021(), (req:Request,res:Response)=>{const unit=String(req.query.business_unit_id||'')||undefined;if(!businessOr403V2023(res,unit,'read'))return;res.json(inventoryIntelligenceV2026(enterpriseV11.multi_business_v20_2_3,unit));});
app.get('/api/v20.2.6/factory-intelligence', requireAuthV2021(), (req:Request,res:Response)=>{const unit=String(req.query.business_unit_id||'')||undefined;if(!businessOr403V2023(res,unit,'read'))return;const data=factoryIntelligenceV2026(enterpriseV11.feed_factory_v20_2_4,enterpriseV11.multi_business_v20_2_3);res.json(unit?{...data,factories:data.factories.filter(x=>x.business_unit_id===unit)}:data);});
app.get('/api/v20.2.6/veterinary-intelligence', requireAuthV2021(), (req:Request,res:Response)=>{const unit=String(req.query.business_unit_id||'')||undefined;if(!businessOr403V2023(res,unit,'read'))return;res.json(veterinaryIntelligenceV2026(enterpriseV11.veterinary_field_v20_2_2,enterpriseV11.enterprise_foundation_v20_2_1,enterpriseV11.multi_business_v20_2_3,unit));});
app.get('/api/v20.2.6/workforce-intelligence', requireAuthV2021(), (req:Request,res:Response)=>{const unit=String(req.query.business_unit_id||'')||undefined;if(!businessOr403V2023(res,unit,'read'))return;res.json(workforceIntelligenceV2026(enterpriseV11.workforce_payroll_v20_2_5,enterpriseV11.multi_business_v20_2_3,unit));});
app.post('/api/v20.2.6/exceptions/refresh', requireAuthV2021(), (req:Request,res:Response)=>{const claims=authClaimsV2021(res);if(!businessOr403V2023(res,undefined,'read'))return;const next=refreshControlExceptionsV2026(enterpriseV11.executive_intelligence_v20_2_6,enterpriseV11.multi_business_v20_2_3,enterpriseV11.veterinary_field_v20_2_2,enterpriseV11.workforce_payroll_v20_2_5,claims.sub);enterpriseV11={...enterpriseV11,executive_intelligence_v20_2_6:next};persistEnterpriseState(claims.sub,'v20_2_6_refresh_exceptions');res.json({success:true,open:next.exceptions.filter(x=>x.status!=='closed')});});
app.get('/api/v20.2.6/exceptions', requireAuthV2021(), (req:Request,res:Response)=>{const unit=String(req.query.business_unit_id||'')||undefined;if(!businessOr403V2023(res,unit,'read'))return;res.json({exceptions:enterpriseV11.executive_intelligence_v20_2_6.exceptions.filter(x=>!unit||x.business_unit_id===unit)});});
app.patch('/api/v20.2.6/exceptions/:id', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),e=enterpriseV11.executive_intelligence_v20_2_6.exceptions.find(x=>x.id===req.params.id);if(!e){res.status(404).json({success:false,error:'control_exception_not_found'});return;}if(!businessOr403V2023(res,e.business_unit_id,'admin'))return;const next=updateControlExceptionV2026(enterpriseV11.executive_intelligence_v20_2_6,e.id,{status:req.body?.status,owner_user_id:req.body?.owner_user_id,owner_role:req.body?.owner_role,resolution_note:req.body?.resolution_note,evidence_refs:Array.isArray(req.body?.evidence_refs)?req.body.evidence_refs:undefined},claims.sub);enterpriseV11={...enterpriseV11,executive_intelligence_v20_2_6:next};persistEnterpriseState(claims.sub,'v20_2_6_exception_update');res.json({success:true,exception:next.exceptions.find(x=>x.id===e.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'exception_update_failed'});}});
app.post('/api/v20.2.6/data-quality/scan', requireAuthV2021(), (req:Request,res:Response)=>{const claims=authClaimsV2021(res);if(!businessOr403V2023(res,undefined,'admin'))return;const next=runDataQualityScanV2026(enterpriseV11.executive_intelligence_v20_2_6,enterpriseV11.enterprise_web_v20_2,enterpriseV11.enterprise_foundation_v20_2_1,enterpriseV11.veterinary_field_v20_2_2,enterpriseV11.multi_business_v20_2_3,enterpriseV11.feed_factory_v20_2_4,enterpriseV11.workforce_payroll_v20_2_5);enterpriseV11={...enterpriseV11,executive_intelligence_v20_2_6:next};persistEnterpriseState(claims.sub,'v20_2_6_data_quality_scan');res.json({success:true,findings:next.data_quality_findings});});
app.get('/api/v20.2.6/data-quality', requireAuthV2021(), (req:Request,res:Response)=>{if(!businessOr403V2023(res,undefined,'read'))return;res.json({findings:enterpriseV11.executive_intelligence_v20_2_6.data_quality_findings,latest_reconciliation:enterpriseV11.executive_intelligence_v20_2_6.reconciliation_runs[0]});});
app.post('/api/v20.2.6/reconciliation/run', requireAuthV2021(), (req:Request,res:Response)=>{const claims=authClaimsV2021(res),unit=String(req.body?.business_unit_id||'')||undefined;if(!businessOr403V2023(res,unit,'finance'))return;const scanned=runDataQualityScanV2026(enterpriseV11.executive_intelligence_v20_2_6,enterpriseV11.enterprise_web_v20_2,enterpriseV11.enterprise_foundation_v20_2_1,enterpriseV11.veterinary_field_v20_2_2,enterpriseV11.multi_business_v20_2_3,enterpriseV11.feed_factory_v20_2_4,enterpriseV11.workforce_payroll_v20_2_5);const r=runReconciliationV2026(scanned,enterpriseV11.enterprise_web_v20_2,enterpriseV11.multi_business_v20_2_3,claims.sub,unit);enterpriseV11={...enterpriseV11,executive_intelligence_v20_2_6:r.state};persistEnterpriseState(claims.sub,'v20_2_6_reconciliation');res.json({success:true,run:r.run});});
app.get('/api/v20.2.6/reconciliation', requireAuthV2021(), (req:Request,res:Response)=>{const unit=String(req.query.business_unit_id||'')||undefined;if(!businessOr403V2023(res,unit,'finance'))return;res.json({runs:enterpriseV11.executive_intelligence_v20_2_6.reconciliation_runs.filter(x=>!unit||x.business_unit_id===unit)});});
app.post('/api/v20.2.6/reports/generate', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),unit=String(req.body?.business_unit_id||'')||undefined;if(!businessOr403V2023(res,unit,'read'))return;const r=generateIntelligenceReportV2026(enterpriseV11.executive_intelligence_v20_2_6,enterpriseV11.enterprise_web_v20_2,enterpriseV11.enterprise_foundation_v20_2_1,enterpriseV11.veterinary_field_v20_2_2,enterpriseV11.multi_business_v20_2_3,enterpriseV11.feed_factory_v20_2_4,enterpriseV11.workforce_payroll_v20_2_5,{definition_code:String(req.body?.definition_code||''),period_from:String(req.body?.period_from||new Date().toISOString().slice(0,7)+'-01'),period_to:String(req.body?.period_to||new Date().toISOString().slice(0,10)),generated_by:claims.sub,business_unit_id:unit});enterpriseV11={...enterpriseV11,executive_intelligence_v20_2_6:r.state};persistEnterpriseState(claims.sub,'v20_2_6_report_generate');res.status(201).json({success:true,report:r.report});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'report_generate_failed'});}});
app.get('/api/v20.2.6/reports', requireAuthV2021(), (req:Request,res:Response)=>{const unit=String(req.query.business_unit_id||'')||undefined;if(!businessOr403V2023(res,unit,'read'))return;res.json({definitions:enterpriseV11.executive_intelligence_v20_2_6.report_definitions,schedules:enterpriseV11.executive_intelligence_v20_2_6.report_schedules.filter(x=>!unit||x.business_unit_id===unit),snapshots:enterpriseV11.executive_intelligence_v20_2_6.report_snapshots.filter(x=>!unit||x.business_unit_id===unit).slice(0,200)});});
app.post('/api/v20.2.6/report-schedules', requireAuthV2021(), (req:Request,res:Response)=>{try{const claims=authClaimsV2021(res),unit=String(req.body?.business_unit_id||'')||undefined;if(!businessOr403V2023(res,unit,'admin'))return;const next=createReportScheduleV2026(enterpriseV11.executive_intelligence_v20_2_6,{definition_code:String(req.body?.definition_code||''),business_unit_id:unit,frequency:req.body?.frequency||'daily',recipients:Array.isArray(req.body?.recipients)?req.body.recipients.map(String):[],format:req.body?.format||'json',active:req.body?.active!==false,created_by:claims.sub});enterpriseV11={...enterpriseV11,executive_intelligence_v20_2_6:next};persistEnterpriseState(claims.sub,'v20_2_6_report_schedule');res.status(201).json({success:true,schedule:next.report_schedules[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'report_schedule_failed'});}});
app.get('/api/v20.2.6/drilldown', requireAuthV2021(), (req:Request,res:Response)=>{try{if(!businessOr403V2023(res,undefined,'read'))return;res.json(drilldownV2026(enterpriseV11.enterprise_web_v20_2,enterpriseV11.veterinary_field_v20_2_2,enterpriseV11.multi_business_v20_2_3,enterpriseV11.feed_factory_v20_2_4,enterpriseV11.workforce_payroll_v20_2_5,String(req.query.source_type||''),String(req.query.source_id||'')));}catch(error){res.status(404).json({success:false,error:error instanceof Error?error.message:'drilldown_failed'});}});
app.get('/api/v20.2.6/validation', requireAuthV2021(), (req:Request,res:Response)=>{const issues=validateExecutiveIntelligenceStateV2026(enterpriseV11.executive_intelligence_v20_2_6);res.json({version:'20.2.6',status:issues.length?'PARTIAL':'PASS',issues});});

// ----------------------------------------------------
// V20.2.7 Windows Completion & Enterprise Control Closure API
// ----------------------------------------------------
app.get('/api/v20.2.7/state', requireAuthV2021(), (req:Request,res:Response)=>{if(!businessOr403V2023(res,undefined,'read'))return;res.json({version:'20.2.7',state:enterpriseV11.windows_completion_v20_2_7,dashboard:windowsCompletionDashboardV2027(enterpriseV11.windows_completion_v20_2_7)});});
app.get('/api/v20.2.7/dashboard', requireAuthV2021(), (req:Request,res:Response)=>{if(!businessOr403V2023(res,undefined,'read'))return;res.json(windowsCompletionDashboardV2027(enterpriseV11.windows_completion_v20_2_7));});
app.post('/api/v20.2.7/security/device-sessions', requireAuthV2021(), requireClosurePermissionV2027('security.admin'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const next=registerDeviceSessionV2027(enterpriseV11.windows_completion_v20_2_7,{user_id:String(req.body?.user_id||c.sub),device_id:String(req.body?.device_id||req.headers['x-device-id']||'unknown-device'),device_name:req.body?.device_name, trusted:Boolean(req.body?.trusted)},c.sub);enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_device_session');res.status(201).json({success:true,session:next.device_sessions[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'device_session_failed'});}});
app.delete('/api/v20.2.7/security/device-sessions/:id', requireAuthV2021(), requireClosurePermissionV2027('security.session.revoke'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const next=revokeDeviceSessionV2027(enterpriseV11.windows_completion_v20_2_7,req.params.id,c.sub);enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_device_revoke');res.json({success:true});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'device_revoke_failed'});}});
app.post('/api/v20.2.7/security/mfa', requireAuthV2021(), requireClosurePermissionV2027('security.admin'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const next=enrollMfaV2027(enterpriseV11.windows_completion_v20_2_7,{user_id:String(req.body?.user_id||c.sub),method:req.body?.method||'authenticator',label:String(req.body?.label||'Primary MFA'),verified:Boolean(req.body?.verified)},c.sub);enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_mfa_enroll');res.status(201).json({success:true,enrollment:next.mfa_enrollments[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'mfa_enroll_failed'});}});
app.post('/api/v20.2.7/organization/lifecycle', requireAuthV2021(), requireClosurePermissionV2027('org.admin'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const next=recordOrganizationLifecycleV2027(enterpriseV11.windows_completion_v20_2_7,{action:req.body?.action||'update',entity_type:req.body?.entity_type||'user',entity_id:String(req.body?.entity_id||''),actor:c.sub,reason:String(req.body?.reason||'administrative change'),before:req.body?.before,after:req.body?.after});enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_org_lifecycle');res.status(201).json({success:true,record:next.organization_lifecycle[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'org_lifecycle_failed'});}});
app.post('/api/v20.2.7/veterinary/leave-coverage/:leaveId', requireAuthV2021(), requireClosurePermissionV2027('veterinary.coverage.manage'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const r=planApprovedVeterinarianLeaveCoverageV2027(enterpriseV11.windows_completion_v20_2_7,enterpriseV11.enterprise_foundation_v20_2_1,enterpriseV11.workforce_payroll_v20_2_5,req.params.leaveId,c.sub);enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:r.state};persistEnterpriseState(c.sub,'v20_2_7_vet_leave_coverage');res.status(201).json({success:true,overrides:r.overrides});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'leave_coverage_failed'});}});
app.get('/api/v20.2.7/veterinary/kpis', requireAuthV2021(), requireClosurePermissionV2027('veterinary.kpi.view'), (_req:Request,res:Response)=>{res.json({version:'20.2.7',rows:veterinaryKpisV2027(enterpriseV11.enterprise_foundation_v20_2_1,enterpriseV11.veterinary_field_v20_2_2)});});
app.post('/api/v20.2.7/veterinary/medication-dispense', requireAuthV2021(), requireClosurePermissionV2027('veterinary.medication.dispense'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res),unit=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unit,'operate'))return;const r=dispenseMedicationLotV2027(enterpriseV11.windows_completion_v20_2_7,enterpriseV11.veterinary_field_v20_2_2,enterpriseV11.multi_business_v20_2_3,{medication_order_id:String(req.body?.medication_order_id||''),business_unit_id:unit,warehouse_id:String(req.body?.warehouse_id||''),product_id:String(req.body?.product_id||''),lot_number:String(req.body?.lot_number||''),quantity_base:Number(req.body?.quantity_base||0),dispensed_by:c.sub});enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:r.state,multi_business_v20_2_3:r.multiBusiness};persistEnterpriseState(c.sub,'v20_2_7_medication_dispense');res.status(201).json({success:true,dispense:r.dispense});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'medication_dispense_failed'});}});
app.post('/api/v20.2.7/finance/periods', requireAuthV2021(), requireClosurePermissionV2027('finance.period.manage'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res),unit=String(req.body?.business_unit_id||'')||undefined;if(unit&&!businessOr403V2023(res,unit,'finance'))return;const next=createAccountingPeriodV2027(enterpriseV11.windows_completion_v20_2_7,{code:String(req.body?.code||''),business_unit_id:unit,date_from:String(req.body?.date_from||''),date_to:String(req.body?.date_to||'')},c.sub);enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_period_create');res.status(201).json({success:true,period:next.accounting_periods[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'period_create_failed'});}});
app.post('/api/v20.2.7/finance/periods/:id/close', requireAuthV2021(), requireClosurePermissionV2027('finance.period.manage'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const next=closeAccountingPeriodV2027(enterpriseV11.windows_completion_v20_2_7,enterpriseV11.enterprise_web_v20_2,req.params.id,c.sub,req.body?.note);enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_period_close');res.json({success:true,period:next.accounting_periods.find(x=>x.id===req.params.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'period_close_failed'});}});
app.post('/api/v20.2.7/finance/periods/:id/reopen', requireAuthV2021(), requireClosurePermissionV2027('finance.period.manage'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const next=reopenAccountingPeriodV2027(enterpriseV11.windows_completion_v20_2_7,req.params.id,c.sub,String(req.body?.reason||''));enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_period_reopen');res.json({success:true,period:next.accounting_periods.find(x=>x.id===req.params.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'period_reopen_failed'});}});
app.post('/api/v20.2.7/finance/bank-reconciliation', requireAuthV2021(), requireClosurePermissionV2027('finance.bank.reconcile'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const next=reconcileBankV2027(enterpriseV11.windows_completion_v20_2_7,enterpriseV11.multi_business_v20_2_3,{treasury_account_id:String(req.body?.treasury_account_id||''),statement_date:String(req.body?.statement_date||new Date().toISOString().slice(0,10)),statement_balance_sar:Number(req.body?.statement_balance_sar||0),reconciled_by:c.sub,note:req.body?.note});enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_bank_reconcile');res.status(201).json({success:true,reconciliation:next.bank_reconciliations[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'bank_reconcile_failed'});}});
app.post('/api/v20.2.7/finance/fx-approvals', requireAuthV2021(), requireClosurePermissionV2027('finance.fx.approve'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const next=approveFxRateV2027(enterpriseV11.windows_completion_v20_2_7,{currency:req.body?.currency,rate_to_sar:Number(req.body?.rate_to_sar||0),effective_date:String(req.body?.effective_date||new Date().toISOString().slice(0,10)),source:String(req.body?.source||'manual-approved'),approved_by:c.sub});enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_fx_approve');res.status(201).json({success:true,rate:next.fx_approvals[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'fx_approve_failed'});}});
app.post('/api/v20.2.7/finance/budgets', requireAuthV2021(), requireClosurePermissionV2027('finance.budget.manage'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const web=createBudgetV2027(enterpriseV11.enterprise_web_v20_2,{period:String(req.body?.period||''),cost_center_id:String(req.body?.cost_center_id||''),account_code:String(req.body?.account_code||''),budget_sar:Number(req.body?.budget_sar||0)},c.sub);enterpriseV11={...enterpriseV11,enterprise_web_v20_2:web};persistEnterpriseState(c.sub,'v20_2_7_budget_create');res.status(201).json({success:true,budget:web.budgets[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'budget_create_failed'});}});
app.post('/api/v20.2.7/finance/flock-rules', requireAuthV2021(), requireClosurePermissionV2027('finance.flock.post'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const next=upsertFlockFinanceRuleV2027(enterpriseV11.windows_completion_v20_2_7,{id:req.body?.id,code:String(req.body?.code||''),event_type:String(req.body?.event_type||''),debit_account_code:String(req.body?.debit_account_code||''),credit_account_code:String(req.body?.credit_account_code||''),description:String(req.body?.description||''),active:req.body?.active!==false},c.sub);enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_flock_rule');res.status(201).json({success:true,rule:next.flock_finance_rules[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'flock_rule_failed'});}});
app.post('/api/v20.2.7/finance/flock-events', requireAuthV2021(), requireClosurePermissionV2027('finance.flock.post'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const r=postFlockFinancialEventV2027(enterpriseV11.windows_completion_v20_2_7,enterpriseV11.enterprise_web_v20_2,enterpriseV11.multi_business_v20_2_3,{rule_code:String(req.body?.rule_code||''),farm_id:String(req.body?.farm_id||''),flock_id:String(req.body?.flock_id||''),event_date:String(req.body?.event_date||new Date().toISOString().slice(0,10)),amount_sar:Number(req.body?.amount_sar||0),quantity:req.body?.quantity===undefined?undefined:Number(req.body.quantity),source_type:String(req.body?.source_type||'flock_event'),source_id:String(req.body?.source_id||''),posted_by:c.sub});enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:r.state,enterprise_web_v20_2:r.web};persistEnterpriseState(c.sub,'v20_2_7_flock_finance_event');res.status(201).json({success:true,event:r.event});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'flock_finance_event_failed'});}});
app.get('/api/v20.2.7/finance/flock-profitability/:farmId/:flockId', requireAuthV2021(), (req:Request,res:Response)=>{if(!businessOr403V2023(res,undefined,'finance'))return;res.json(flockProfitabilityV2027(enterpriseV11.windows_completion_v20_2_7,enterpriseV11.enterprise_web_v20_2,enterpriseV11.multi_business_v20_2_3,req.params.farmId,req.params.flockId,req.query.current_birds?Number(req.query.current_birds):undefined,req.query.live_weight_kg?Number(req.query.live_weight_kg):undefined));});
app.post('/api/v20.2.7/procurement/three-way-match/:poId', requireAuthV2021(), requireClosurePermissionV2027('procurement.match'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const next=runThreeWayMatchV2027(enterpriseV11.windows_completion_v20_2_7,enterpriseV11.multi_business_v20_2_3,req.params.poId,c.sub);enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_three_way_match');res.status(201).json({success:true,match:next.three_way_matches[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'three_way_match_failed'});}});
app.post('/api/v20.2.7/procurement/supplier-scorecards/refresh', requireAuthV2021(), requireClosurePermissionV2027('procurement.scorecard.view'), (req:Request,res:Response)=>{const c=authClaimsV2021(res);const next=refreshSupplierScorecardsV2027(enterpriseV11.windows_completion_v20_2_7,enterpriseV11.multi_business_v20_2_3,c.sub);enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_supplier_scorecards');res.json({success:true,scorecards:next.supplier_scorecards});});
app.post('/api/v20.2.7/procurement/claims', requireAuthV2021(), requireClosurePermissionV2027('procurement.claim'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res),unit=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unit,'operate'))return;const next=createProcurementClaimV2027(enterpriseV11.windows_completion_v20_2_7,{supplier_id:String(req.body?.supplier_id||''),business_unit_id:unit,purchase_order_id:req.body?.purchase_order_id,goods_receipt_id:req.body?.goods_receipt_id,claim_type:req.body?.claim_type||'other',amount_sar:Number(req.body?.amount_sar||0),description:String(req.body?.description||''),created_by:c.sub},c.sub);enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_procurement_claim');res.status(201).json({success:true,claim:next.procurement_claims[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'procurement_claim_failed'});}});
app.post('/api/v20.2.7/inventory/cycle-counts', requireAuthV2021(), requireClosurePermissionV2027('inventory.count'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res),unit=String(req.body?.business_unit_id||'');if(!businessOr403V2023(res,unit,'operate'))return;const next=createCycleCountV2027(enterpriseV11.windows_completion_v20_2_7,enterpriseV11.multi_business_v20_2_3,{business_unit_id:unit,warehouse_id:String(req.body?.warehouse_id||''),product_id:String(req.body?.product_id||''),lot_number:req.body?.lot_number,physical_quantity:Number(req.body?.physical_quantity||0),counted_by:c.sub});enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_cycle_count');res.status(201).json({success:true,count:next.cycle_counts[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'cycle_count_failed'});}});
app.post('/api/v20.2.7/inventory/cycle-counts/:id/post', requireAuthV2021(), requireClosurePermissionV2027('inventory.adjust'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const r=approveAndPostCycleCountV2027(enterpriseV11.windows_completion_v20_2_7,enterpriseV11.multi_business_v20_2_3,req.params.id,c.sub);enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:r.state,multi_business_v20_2_3:r.multiBusiness};persistEnterpriseState(c.sub,'v20_2_7_cycle_count_post');res.json({success:true,count:r.count});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'cycle_count_post_failed'});}});
app.post('/api/v20.2.7/inventory/quarantine', requireAuthV2021(), requireClosurePermissionV2027('inventory.quarantine'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const next=quarantineInventoryLotV2027(enterpriseV11.windows_completion_v20_2_7,enterpriseV11.multi_business_v20_2_3,{business_unit_id:String(req.body?.business_unit_id||''),warehouse_id:String(req.body?.warehouse_id||''),product_id:String(req.body?.product_id||''),lot_number:String(req.body?.lot_number||''),quantity_base:Number(req.body?.quantity_base||0),reason:String(req.body?.reason||''),created_by:c.sub});enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_quarantine');res.status(201).json({success:true,quarantine:next.quarantines[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'quarantine_failed'});}});
app.post('/api/v20.2.7/inventory/quarantine/:id/decision', requireAuthV2021(), requireClosurePermissionV2027('inventory.quarantine'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const decision=req.body?.decision==='rejected'?'rejected':'released';const next=decideInventoryQuarantineV2027(enterpriseV11.windows_completion_v20_2_7,req.params.id,decision,c.sub);enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_quarantine_decision');res.json({success:true,quarantine:next.quarantines.find(x=>x.id===req.params.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'quarantine_decision_failed'});}});
app.post('/api/v20.2.7/factory/qc', requireAuthV2021(), requireClosurePermissionV2027('factory.qc'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const r=recordFactoryQcV2027(enterpriseV11.windows_completion_v20_2_7,enterpriseV11.feed_factory_v20_2_4,{factory_id:String(req.body?.factory_id||''),subject_type:req.body?.subject_type||'production_batch',subject_id:String(req.body?.subject_id||''),lot_number:req.body?.lot_number,tests:req.body?.tests||{},result:req.body?.result||'accepted',reviewed_by:c.sub,document_refs:Array.isArray(req.body?.document_refs)?req.body.document_refs:[],note:req.body?.note});enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:r.state,feed_factory_v20_2_4:r.feedFactory};persistEnterpriseState(c.sub,'v20_2_7_factory_qc');res.status(201).json({success:true,qc:r.qc});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'factory_qc_failed'});}});
app.post('/api/v20.2.7/factory/least-cost-formulation', requireAuthV2021(), requireClosurePermissionV2027('factory.formulation.optimize'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const r=solveLeastCostFormulaV2027(enterpriseV11.windows_completion_v20_2_7,enterpriseV11.multi_business_v20_2_3,{factory_id:String(req.body?.factory_id||''),target_output_kg:Number(req.body?.target_output_kg||1000),target_protein_pct:Number(req.body?.target_protein_pct||0),target_energy_kcal_kg:Number(req.body?.target_energy_kcal_kg||0),target_calcium_pct:Number(req.body?.target_calcium_pct||0),candidates:Array.isArray(req.body?.candidates)?req.body.candidates:[],generated_by:c.sub});enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:r.state};persistEnterpriseState(c.sub,'v20_2_7_least_cost');res.status(201).json({success:true,result:r.result});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'least_cost_failed'});}});
app.post('/api/v20.2.7/factory/production-plans', requireAuthV2021(), requireClosurePermissionV2027('factory.plan'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const next=createProductionPlanV2027(enterpriseV11.windows_completion_v20_2_7,enterpriseV11.feed_factory_v20_2_4,enterpriseV11.multi_business_v20_2_3,{factory_id:String(req.body?.factory_id||''),period_from:String(req.body?.period_from||''),period_to:String(req.body?.period_to||''),demand_kg:Number(req.body?.demand_kg||0),safety_stock_kg:Number(req.body?.safety_stock_kg||0),finished_product_id:String(req.body?.finished_product_id||''),planned_formula_id:req.body?.planned_formula_id,created_by:c.sub});enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_production_plan');res.status(201).json({success:true,plan:next.production_plans[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'production_plan_failed'});}});
app.post('/api/v20.2.7/business-contracts/:id/renew', requireAuthV2021(), requireClosurePermissionV2027('org.admin'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const r=renewBusinessContractV2027(enterpriseV11.windows_completion_v20_2_7,enterpriseV11.multi_business_v20_2_3,req.params.id,{start_date:String(req.body?.start_date||''),end_date:req.body?.end_date,approved_by:c.sub,patch:req.body?.patch||{}});enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:r.state,multi_business_v20_2_3:r.multiBusiness};persistEnterpriseState(c.sub,'v20_2_7_business_contract_renew');res.status(201).json({success:true,contract:r.contract,renewal:r.renewal});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'business_contract_renew_failed'});}});
app.get('/api/v20.2.7/hr/kpis', requireAuthV2021(), requireClosurePermissionV2027('hr.kpi.view'), (_req:Request,res:Response)=>{res.json({version:'20.2.7',rows:workforceKpisV2027(enterpriseV11.workforce_payroll_v20_2_5,enterpriseV11.enterprise_web_v20_2)});});
app.post('/api/v20.2.7/hr/contracts/:id/renew', requireAuthV2021(), requireClosurePermissionV2027('hr.contract.renew'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const r=renewCompensationContractV2027(enterpriseV11.windows_completion_v20_2_7,enterpriseV11.workforce_payroll_v20_2_5,req.params.id,{start_date:String(req.body?.start_date||''),end_date:req.body?.end_date,approved_by:c.sub,patch:req.body?.patch||{}});enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:r.state,workforce_payroll_v20_2_5:r.workforce};persistEnterpriseState(c.sub,'v20_2_7_contract_renew');res.status(201).json({success:true,contract:r.contract});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'contract_renew_failed'});}});
app.post('/api/v20.2.7/hr/payslips/:payrollLineId', requireAuthV2021(), requireClosurePermissionV2027('hr.payslip.generate'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const next=generatePayslipV2027(enterpriseV11.windows_completion_v20_2_7,enterpriseV11.workforce_payroll_v20_2_5,req.params.payrollLineId,c.sub);enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_payslip');res.status(201).json({success:true,payslip:next.payslips[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'payslip_failed'});}});
app.post('/api/v20.2.7/documents/index/:evidenceId', requireAuthV2021(), requireClosurePermissionV2027('documents.manage'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const next=indexEvidenceDocumentV2027(enterpriseV11.windows_completion_v20_2_7,enterpriseV11.enterprise_foundation_v20_2_1,req.params.evidenceId,c.sub);enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_document_index');res.status(201).json({success:true,index:next.document_index[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'document_index_failed'});}});
app.post('/api/v20.2.7/notifications/:notificationId/deliveries', requireAuthV2021(), requireClosurePermissionV2027('notifications.manage'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res),n=enterpriseV11.enterprise_foundation_v20_2_1.notifications.find(x=>x.id===req.params.notificationId);if(!n){res.status(404).json({success:false,error:'notification_not_found'});return;}const next=queueNotificationDeliveryV2027(enterpriseV11.windows_completion_v20_2_7,n,{channel:req.body?.channel||'in_app',recipient:String(req.body?.recipient||'')},c.sub);enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_notification_delivery');res.status(201).json({success:true,delivery:next.notification_deliveries[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'notification_delivery_failed'});}});
app.patch('/api/v20.2.7/notification-deliveries/:id', requireAuthV2021(), requireClosurePermissionV2027('notifications.manage'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const next=markNotificationDeliveryV2027(enterpriseV11.windows_completion_v20_2_7,req.params.id,{status:req.body?.status||'sent',error:req.body?.error},c.sub);enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_notification_delivery_update');res.json({success:true,delivery:next.notification_deliveries.find(x=>x.id===req.params.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'notification_delivery_update_failed'});}});
app.post('/api/v20.2.7/reports/schedules/:scheduleId/execute', requireAuthV2021(), requireClosurePermissionV2027('reports.execute'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const next=executeReportScheduleV2027(enterpriseV11.windows_completion_v20_2_7,enterpriseV11.executive_intelligence_v20_2_6,req.params.scheduleId,c.sub);enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_report_execute');res.status(201).json({success:true,execution:next.report_executions[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'report_execute_failed'});}});
app.patch('/api/v20.2.7/localization', requireAuthV2021(), requireClosurePermissionV2027('localization.manage'), (req:Request,res:Response)=>{const c=authClaimsV2021(res);const next=setLocalizationPreferenceV2027(enterpriseV11.windows_completion_v20_2_7,String(req.body?.user_id||c.sub),req.body?.language==='en'?'en':'ar',c.sub);enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_localization');res.json({success:true,preference:next.localization_preferences[0]});});
app.post('/api/v20.2.7/offline/commands', requireAuthV2021(), requireClosurePermissionV2027('offline.manage'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const r=enqueueOfflineCommandV2027(enterpriseV11.windows_completion_v20_2_7,{idempotency_key:String(req.body?.idempotency_key||req.headers['idempotency-key']||''),user_id:c.sub,device_id:String(req.body?.device_id||req.headers['x-device-id']||'unknown'),command_type:String(req.body?.command_type||''),payload:req.body?.payload||{}},c.sub);enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:r.state};persistEnterpriseState(c.sub,'v20_2_7_offline_enqueue');res.status(r.duplicate?200:201).json({success:true,duplicate:r.duplicate,command:r.command});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'offline_enqueue_failed'});}});
app.patch('/api/v20.2.7/offline/commands/:id/complete', requireAuthV2021(), requireClosurePermissionV2027('offline.manage'), (req:Request,res:Response)=>{try{const c=authClaimsV2021(res);const next=completeOfflineCommandV2027(enterpriseV11.windows_completion_v20_2_7,req.params.id,{result_ref:req.body?.result_ref,error:req.body?.error,conflict:Boolean(req.body?.conflict)},c.sub);enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:next};persistEnterpriseState(c.sub,'v20_2_7_offline_complete');res.json({success:true,command:next.offline_commands.find(x=>x.id===req.params.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'offline_complete_failed'});}});
app.get('/api/v20.2.7/validation', requireAuthV2021(), (req:Request,res:Response)=>{const issues=validateWindowsCompletionStateV2027(enterpriseV11.windows_completion_v20_2_7,enterpriseV11.enterprise_web_v20_2,enterpriseV11.enterprise_foundation_v20_2_1,enterpriseV11.veterinary_field_v20_2_2,enterpriseV11.multi_business_v20_2_3,enterpriseV11.feed_factory_v20_2_4,enterpriseV11.workforce_payroll_v20_2_5,enterpriseV11.executive_intelligence_v20_2_6);res.json({version:'20.2.7',status:issues.length?'PARTIAL':'PASS',issues});});

// ----------------------------------------------------
// V20.2.2 Veterinary & Field Operations API
// ----------------------------------------------------
app.get('/api/v20.2.2/validation', requireAuthV2021(), (req:Request,res:Response)=>{
  const issues=validateVeterinaryFieldStateV2022(enterpriseV11.veterinary_field_v20_2_2,enterpriseV11.enterprise_web_v20_2,enterpriseV11.enterprise_foundation_v20_2_1);
  res.json({version:'20.2.2',status:issues.length?'PARTIAL':'PASS',issues});
});

app.get('/api/v20.2.2/veterinary/queue', requireAuthV2021(), (req:Request,res:Response)=>{
  const claims=authClaimsV2021(res);
  res.json({version:'20.2.2',queue:veterinaryDailyQueueV2022(enterpriseV11.veterinary_field_v20_2_2,enterpriseV11.enterprise_foundation_v20_2_1,claims.sub),withdrawal_locks:withdrawalLocksV2022(enterpriseV11.veterinary_field_v20_2_2)});
});

app.post('/api/v20.2.2/worker/daily-closing', requireAuthV2021(), (req:Request,res:Response)=>{
  try{
    const claims=authClaimsV2021(res);const context={farm_id:String(req.body?.farm_id||''),flock_id:String(req.body?.flock_id||'')};
    if(!scopedOr403V2022(res,'submit_daily_close',context))return;
    let next=createWorkerDailyClosingV2022(enterpriseV11.veterinary_field_v20_2_2,{farm_id:context.farm_id,flock_id:context.flock_id,report_date:String(req.body?.report_date||new Date().toISOString().slice(0,10)),shift:req.body?.shift||'full_day',worker_user_id:claims.sub,mortality_count:Number(req.body?.mortality_count||0),cull_count:Number(req.body?.cull_count||0),feed_used_kg:Number(req.body?.feed_used_kg||0),water_liters:req.body?.water_liters===undefined?undefined:Number(req.body.water_liters),avg_weight_g:req.body?.avg_weight_g===undefined?undefined:Number(req.body.avg_weight_g),weight_sample_count:req.body?.weight_sample_count===undefined?undefined:Number(req.body.weight_sample_count),temperature_min_c:req.body?.temperature_min_c===undefined?undefined:Number(req.body.temperature_min_c),temperature_max_c:req.body?.temperature_max_c===undefined?undefined:Number(req.body.temperature_max_c),temperature_avg_c:req.body?.temperature_avg_c===undefined?undefined:Number(req.body.temperature_avg_c),humidity_min_pct:req.body?.humidity_min_pct===undefined?undefined:Number(req.body.humidity_min_pct),humidity_max_pct:req.body?.humidity_max_pct===undefined?undefined:Number(req.body.humidity_max_pct),observations:String(req.body?.observations||''),symptom_tags:Array.isArray(req.body?.symptom_tags)?req.body.symptom_tags:[],feed_change_note:req.body?.feed_change_note,water_change_note:req.body?.water_change_note,evidence_refs:Array.isArray(req.body?.evidence_refs)?req.body.evidence_refs:[]});
    const id=next.worker_daily_closings[0].id;next=validateWorkerDailyClosingV2022(next,id,claims.sub);if(next.worker_daily_closings[0].status==='validated')next=analyzeWorkerClosingV2022(next,id);
    enterpriseV11={...enterpriseV11,veterinary_field_v20_2_2:runAutomaticClinicalEscalationsV2022(next,enterpriseV11.enterprise_web_v20_2)};persistEnterpriseState(claims.sub,'v20_2_2_worker_daily_closing');
    res.status(201).json({success:true,closing:enterpriseV11.veterinary_field_v20_2_2.worker_daily_closings[0],analysis:enterpriseV11.veterinary_field_v20_2_2.ai_clinical_analyses.find(a=>a.closing_id===id)});
  }catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'daily_closing_failed'});}
});

app.post('/api/v20.2.2/veterinary/reviews', requireAuthV2021(), (req:Request,res:Response)=>{
  try{
    const claims=authClaimsV2021(res);const closing=enterpriseV11.veterinary_field_v20_2_2.worker_daily_closings.find(x=>x.id===String(req.body?.closing_id||''));if(!closing){res.status(404).json({success:false,error:'daily_closing_not_found'});return;}
    if(!scopedOr403V2022(res,'review_daily_reports',{farm_id:closing.farm_id,flock_id:closing.flock_id}))return;
    const next=submitVeterinaryReviewV2022(enterpriseV11.veterinary_field_v20_2_2,{closing_id:closing.id,vet_user_id:claims.sub,disposition:req.body?.disposition||'monitor',findings:String(req.body?.findings||''),decision_note:String(req.body?.decision_note||''),approved_signal_codes:Array.isArray(req.body?.approved_signal_codes)?req.body.approved_signal_codes:[],rejected_signal_codes:Array.isArray(req.body?.rejected_signal_codes)?req.body.rejected_signal_codes:[],requires_lab:Boolean(req.body?.requires_lab),requires_consultation:Boolean(req.body?.requires_consultation),next_review_at:req.body?.next_review_at,open_case:Boolean(req.body?.open_case)});
    enterpriseV11={...enterpriseV11,veterinary_field_v20_2_2:runAutomaticClinicalEscalationsV2022(next,enterpriseV11.enterprise_web_v20_2)};persistEnterpriseState(claims.sub,'v20_2_2_veterinary_review');res.status(201).json({success:true,review:enterpriseV11.veterinary_field_v20_2_2.veterinary_reviews[0],case:enterpriseV11.veterinary_field_v20_2_2.medical_cases[0]});
  }catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'veterinary_review_failed'});}
});

app.post('/api/v20.2.2/veterinary/consultations', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);const c=enterpriseV11.veterinary_field_v20_2_2.medical_cases.find(x=>x.id===String(req.body?.case_id||''));if(!c){res.status(404).json({success:false,error:'medical_case_not_found'});return;}if(!scopedOr403V2022(res,'issue_medical_tasks',{farm_id:c.farm_id,flock_id:c.flock_id}))return;enterpriseV11={...enterpriseV11,veterinary_field_v20_2_2:requestSpecialistConsultationV2022(enterpriseV11.veterinary_field_v20_2_2,enterpriseV11.enterprise_foundation_v20_2_1,{case_id:c.id,specialty:req.body?.specialty||'poultry_disease',urgency:req.body?.urgency||c.severity,requested_by_vet_user_id:claims.sub,question:String(req.body?.question||''),clinical_summary:String(req.body?.clinical_summary||c.presenting_problem)})};persistEnterpriseState(claims.sub,'v20_2_2_consultation_request');res.status(201).json({success:true,consultation:enterpriseV11.veterinary_field_v20_2_2.consultations[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'consultation_request_failed'});}
});

app.post('/api/v20.2.2/veterinary/consultations/:id/respond', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);const assignedConsultation=enterpriseV11.veterinary_field_v20_2_2.consultations.find(x=>x.id===req.params.id);if(!assignedConsultation){res.status(404).json({success:false,error:'consultation_not_found'});return;}if(claims.role_code!=='SYSTEM_OWNER'&&(claims.role_code!=='SPECIALIST_CONSULTANT'||assignedConsultation.assigned_consultant_user_id!==claims.sub||!authorizedFarmIdsV2026(res).has(assignedConsultation.farm_id))){res.status(403).json({success:false,error:'consultation_assignment_denied'});return;}enterpriseV11={...enterpriseV11,veterinary_field_v20_2_2:respondToConsultationV2022(enterpriseV11.veterinary_field_v20_2_2,{consultation_id:req.params.id,consultant_user_id:claims.sub,recommendation:String(req.body?.recommendation||''),close:Boolean(req.body?.close)})};persistEnterpriseState(claims.sub,'v20_2_2_consultation_response');res.json({success:true,consultation:enterpriseV11.veterinary_field_v20_2_2.consultations.find(x=>x.id===req.params.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'consultation_response_failed'});}
});

app.post('/api/v20.2.2/laboratory/orders', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);const c=enterpriseV11.veterinary_field_v20_2_2.medical_cases.find(x=>x.id===String(req.body?.case_id||''));if(!c){res.status(404).json({success:false,error:'medical_case_not_found'});return;}if(!scopedOr403V2022(res,'issue_medical_tasks',{farm_id:c.farm_id,flock_id:c.flock_id}))return;enterpriseV11={...enterpriseV11,veterinary_field_v20_2_2:requestLabSampleV2022(enterpriseV11.veterinary_field_v20_2_2,{case_id:c.id,requested_by_vet_user_id:claims.sub,sample_type:String(req.body?.sample_type||''),sample_count:Number(req.body?.sample_count||0),requested_tests:Array.isArray(req.body?.requested_tests)?req.body.requested_tests:[],collection_instructions:String(req.body?.collection_instructions||''),assigned_collector_user_id:req.body?.assigned_collector_user_id,laboratory_id:req.body?.laboratory_id,urgency:req.body?.urgency||c.severity})};persistEnterpriseState(claims.sub,'v20_2_2_lab_order');res.status(201).json({success:true,lab_order:enterpriseV11.veterinary_field_v20_2_2.lab_orders[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'lab_order_failed'});}
});

app.post('/api/v20.2.2/laboratory/orders/:id/advance', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);const order=enterpriseV11.veterinary_field_v20_2_2.lab_orders.find(x=>x.id===req.params.id);if(!order){res.status(404).json({success:false,error:'lab_order_not_found'});return;}if(claims.role_code!=='LABORATORY'&&claims.role_code!=='SYSTEM_OWNER'&&!scopedOr403V2022(res,'view_assigned_farms',{farm_id:order.farm_id,flock_id:order.flock_id}))return;enterpriseV11={...enterpriseV11,veterinary_field_v20_2_2:advanceLabSampleV2022(enterpriseV11.veterinary_field_v20_2_2,{lab_order_id:order.id,to_status:req.body?.to_status,actor_user_id:claims.sub,location:req.body?.location,note:req.body?.note,evidence_refs:Array.isArray(req.body?.evidence_refs)?req.body.evidence_refs:[],result_summary:req.body?.result_summary,result_document_refs:Array.isArray(req.body?.result_document_refs)?req.body.result_document_refs:[]})};persistEnterpriseState(claims.sub,'v20_2_2_lab_advance');res.json({success:true,lab_order:enterpriseV11.veterinary_field_v20_2_2.lab_orders.find(x=>x.id===order.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'lab_advance_failed'});}
});

app.post('/api/v20.2.2/veterinary/medication-orders', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);const context={farm_id:String(req.body?.farm_id||''),flock_id:String(req.body?.flock_id||'')};if(!scopedOr403V2022(res,'issue_medical_tasks',context))return;enterpriseV11={...enterpriseV11,veterinary_field_v20_2_2:prescribeMedicationV2022(enterpriseV11.veterinary_field_v20_2_2,{case_id:req.body?.case_id,farm_id:context.farm_id,flock_id:context.flock_id,order_type:req.body?.order_type||'treatment',item_name:String(req.body?.item_name||''),active_ingredient:req.body?.active_ingredient,dose:String(req.body?.dose||''),route:String(req.body?.route||''),frequency:req.body?.frequency,duration_days:req.body?.duration_days===undefined?undefined:Number(req.body.duration_days),start_date:String(req.body?.start_date||new Date().toISOString().slice(0,10)),restricted_antibiotic:Boolean(req.body?.restricted_antibiotic),sensitivity_report_ref:req.body?.sensitivity_report_ref,emergency_override_reason:req.body?.emergency_override_reason,meat_withdrawal_days:Number(req.body?.meat_withdrawal_days||0),egg_withdrawal_days:req.body?.egg_withdrawal_days===undefined?undefined:Number(req.body.egg_withdrawal_days),issued_by_vet_user_id:claims.sub,notes:req.body?.notes})};persistEnterpriseState(claims.sub,'v20_2_2_medication_order');res.status(201).json({success:true,medication_order:enterpriseV11.veterinary_field_v20_2_2.medication_orders[0],withdrawal_locks:withdrawalLocksV2022(enterpriseV11.veterinary_field_v20_2_2)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'medication_order_failed'});}
});

app.post('/api/v20.2.2/veterinary/reviews/:id/tomorrow-plan', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);const review=enterpriseV11.veterinary_field_v20_2_2.veterinary_reviews.find(x=>x.id===req.params.id);if(!review){res.status(404).json({success:false,error:'veterinary_review_not_found'});return;}if(!scopedOr403V2022(res,'issue_tomorrow_plan',{farm_id:review.farm_id,flock_id:review.flock_id}))return;const result=issueTomorrowPlanFromVeterinaryReviewV2022(enterpriseV11.veterinary_field_v20_2_2,enterpriseV11.enterprise_web_v20_2,{review_id:review.id,plan_date:String(req.body?.plan_date||new Date(Date.now()+86400000).toISOString().slice(0,10)),issued_by_vet:claims.sub,worker_user_id:req.body?.worker_user_id,feed_kg:Number(req.body?.feed_kg||0),feeding_times:Array.isArray(req.body?.feeding_times)?req.body.feeding_times:[],target_temperature_min_c:Number(req.body?.target_temperature_min_c||0),target_temperature_max_c:Number(req.body?.target_temperature_max_c||0),humidity_min_pct:Number(req.body?.humidity_min_pct||0),humidity_max_pct:Number(req.body?.humidity_max_pct||0),weight_sample_time:req.body?.weight_sample_time,weight_sample_count:req.body?.weight_sample_count===undefined?undefined:Number(req.body.weight_sample_count),weight_sample_condition:req.body?.weight_sample_condition,ventilation_instruction:req.body?.ventilation_instruction,treatment_instruction:req.body?.treatment_instruction,vaccination_instruction:req.body?.vaccination_instruction,litter_instruction:req.body?.litter_instruction,maintenance_instruction:req.body?.maintenance_instruction,required_items:Array.isArray(req.body?.required_items)?req.body.required_items:[],vet_note:req.body?.vet_note});enterpriseV11={...enterpriseV11,veterinary_field_v20_2_2:result.field,enterprise_web_v20_2:result.web};persistEnterpriseState(claims.sub,'v20_2_2_tomorrow_plan');res.status(201).json({success:true,plan:result.plan});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'tomorrow_plan_failed'});}
});

app.post('/api/v20.2.2/field/tasks/:id/execute', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);const task=enterpriseV11.enterprise_web_v20_2.role_tasks.find(x=>x.id===req.params.id);if(!task){res.status(404).json({success:false,error:'task_not_found'});return;}if(!scopedOr403V2022(res,'view_assigned_tasks',{farm_id:task.farm_id,flock_id:task.flock_id}))return;if(claims.role_code!=='SYSTEM_OWNER'&&task.assigned_user_id!==claims.sub){res.status(403).json({success:false,error:'task_assignment_denied'});return;}const result=recordTaskExecutionV2022(enterpriseV11.veterinary_field_v20_2_2,enterpriseV11.enterprise_web_v20_2,{task_id:task.id,submitted_by_user_id:claims.sub,note:String(req.body?.note||''),measurements:req.body?.measurements||{},evidence_refs:Array.isArray(req.body?.evidence_refs)?req.body.evidence_refs:[]});enterpriseV11={...enterpriseV11,veterinary_field_v20_2_2:runAutomaticClinicalEscalationsV2022(result.field,result.web),enterprise_web_v20_2:result.web};persistEnterpriseState(claims.sub,'v20_2_2_task_execute');res.status(201).json({success:true,execution:enterpriseV11.veterinary_field_v20_2_2.task_executions[0],task:enterpriseV11.enterprise_web_v20_2.role_tasks.find(x=>x.id===task.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'task_execution_failed'});}
});

app.post('/api/v20.2.2/field/executions/:id/review', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);const execution=enterpriseV11.veterinary_field_v20_2_2.task_executions.find(x=>x.id===req.params.id);if(!execution){res.status(404).json({success:false,error:'task_execution_not_found'});return;}if(!scopedOr403V2022(res,'review_daily_reports',{farm_id:execution.farm_id,flock_id:execution.flock_id}))return;enterpriseV11={...enterpriseV11,veterinary_field_v20_2_2:reviewTaskExecutionV2022(enterpriseV11.veterinary_field_v20_2_2,{execution_id:execution.id,reviewer_user_id:claims.sub,accepted:Boolean(req.body?.accepted),reason:req.body?.reason})};persistEnterpriseState(claims.sub,'v20_2_2_execution_review');res.json({success:true,execution:enterpriseV11.veterinary_field_v20_2_2.task_executions.find(x=>x.id===execution.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'execution_review_failed'});}
});

app.post('/api/v20.2.2/veterinary/cases/:id/followups', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);const c=enterpriseV11.veterinary_field_v20_2_2.medical_cases.find(x=>x.id===req.params.id);if(!c){res.status(404).json({success:false,error:'medical_case_not_found'});return;}if(!scopedOr403V2022(res,'review_daily_reports',{farm_id:c.farm_id,flock_id:c.flock_id}))return;enterpriseV11={...enterpriseV11,veterinary_field_v20_2_2:scheduleVeterinaryFollowUpV2022(enterpriseV11.veterinary_field_v20_2_2,{case_id:c.id,scheduled_at:String(req.body?.scheduled_at||new Date(Date.now()+86400000).toISOString()),assigned_vet_user_id:String(req.body?.assigned_vet_user_id||claims.sub),actor:claims.sub})};persistEnterpriseState(claims.sub,'v20_2_2_followup_schedule');res.status(201).json({success:true,followup:enterpriseV11.veterinary_field_v20_2_2.followups[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'followup_schedule_failed'});}
});

app.post('/api/v20.2.2/veterinary/followups/:id/complete', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);const assignedFollowup=enterpriseV11.veterinary_field_v20_2_2.followups.find(x=>x.id===req.params.id);if(!assignedFollowup){res.status(404).json({success:false,error:'followup_not_found'});return;}if(claims.role_code!=='SYSTEM_OWNER'&&(claims.role_code!=='FIELD_VET'||assignedFollowup.assigned_vet_user_id!==claims.sub||!authorizedFarmIdsV2026(res).has(assignedFollowup.farm_id))){res.status(403).json({success:false,error:'followup_assignment_denied'});return;}enterpriseV11={...enterpriseV11,veterinary_field_v20_2_2:completeVeterinaryFollowUpV2022(enterpriseV11.veterinary_field_v20_2_2,{followup_id:req.params.id,vet_user_id:claims.sub,findings:String(req.body?.findings||''),outcome:String(req.body?.outcome||''),resolve_case:Boolean(req.body?.resolve_case)})};persistEnterpriseState(claims.sub,'v20_2_2_followup_complete');res.json({success:true,followup:enterpriseV11.veterinary_field_v20_2_2.followups.find(x=>x.id===req.params.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'followup_complete_failed'});}
});

app.post('/api/v20.2.2/veterinary/cases/:id/close', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);const c=enterpriseV11.veterinary_field_v20_2_2.medical_cases.find(x=>x.id===req.params.id);if(!c){res.status(404).json({success:false,error:'medical_case_not_found'});return;}if(!scopedOr403V2022(res,'review_daily_reports',{farm_id:c.farm_id,flock_id:c.flock_id}))return;enterpriseV11={...enterpriseV11,veterinary_field_v20_2_2:closeMedicalCaseV2022(enterpriseV11.veterinary_field_v20_2_2,{case_id:c.id,vet_user_id:claims.sub,final_diagnosis:String(req.body?.final_diagnosis||''),diagnostic_basis:Array.isArray(req.body?.diagnostic_basis)?req.body.diagnostic_basis:[],note:String(req.body?.note||'')})};persistEnterpriseState(claims.sub,'v20_2_2_case_close');res.json({success:true,case:enterpriseV11.veterinary_field_v20_2_2.medical_cases.find(x=>x.id===c.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'case_close_failed'});}
});

app.get('/api/v20.2.2/veterinary/cases/:id/timeline', requireAuthV2021(), (req:Request,res:Response)=>{
  const c=enterpriseV11.veterinary_field_v20_2_2.medical_cases.find(x=>x.id===req.params.id);if(!c){res.status(404).json({success:false,error:'medical_case_not_found'});return;}if(!c.consultant_user_ids.includes(authClaimsV2021(res).sub)&&!scopedOr403V2022(res,'view_assigned_farms',{farm_id:c.farm_id,flock_id:c.flock_id}))return;res.json({case:c,timeline:caseTimelineV2022(enterpriseV11.veterinary_field_v20_2_2,c.id)});
});

app.post('/api/v20.2.2/escalations/run', requireAuthV2021(), (req:Request,res:Response)=>{
  const claims=authClaimsV2021(res);enterpriseV11={...enterpriseV11,veterinary_field_v20_2_2:runAutomaticClinicalEscalationsV2022(enterpriseV11.veterinary_field_v20_2_2,enterpriseV11.enterprise_web_v20_2)};persistEnterpriseState(claims.sub,'v20_2_2_escalations_run');res.json({success:true,open:enterpriseV11.veterinary_field_v20_2_2.escalations.filter(x=>['open','acknowledged'].includes(x.status))});
});

app.post('/api/v20.2.2/escalations/:id/action', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);enterpriseV11={...enterpriseV11,veterinary_field_v20_2_2:acknowledgeClinicalEscalationV2022(enterpriseV11.veterinary_field_v20_2_2,{escalation_id:req.params.id,actor_user_id:claims.sub,resolve:Boolean(req.body?.resolve)})};persistEnterpriseState(claims.sub,'v20_2_2_escalation_action');res.json({success:true,escalation:enterpriseV11.veterinary_field_v20_2_2.escalations.find(x=>x.id===req.params.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'escalation_action_failed'});}
});

// V20.2.1 Core Enterprise Foundation API
// ----------------------------------------------------
app.get('/api/v20.2.1/auth/status', (req:Request,res:Response)=>{
  res.json(publicAuthStatusV2021(authRuntimeV2021,authStoreV2021));
});

app.post('/api/v20.2.1/auth/login', (req:Request,res:Response)=>{
  try{
    if(!authRuntimeV2021.ready){res.status(503).json({success:false,error:'auth_runtime_not_ready',details:authRuntimeV2021.readiness_errors});return;}
    const checked=verifyPasswordV2021(authStoreV2021,String(req.body?.username||''),String(req.body?.password||''));
    authStoreV2021=checked.store; saveAuthStoreV2021(authRuntimeV2021,authStoreV2021);
    if(!checked.ok||!checked.credential){res.status(401).json({success:false,error:checked.reason});return;}
    const issued=issueAccessTokenV2021(authRuntimeV2021,checked.credential);
    const deviceId=String(req.body?.device_id||req.headers['x-device-id']||'').trim()||undefined;
    const refreshed=issueRefreshSessionV2027(authRuntimeV2021,authStoreV2021,checked.credential,deviceId);
    authStoreV2021=refreshed.store; saveAuthStoreV2021(authRuntimeV2021,authStoreV2021);
    enterpriseV11={...enterpriseV11,windows_completion_v20_2_7:registerDeviceSessionV2027(enterpriseV11.windows_completion_v20_2_7,{user_id:issued.claims.sub,device_id:deviceId||`web-${issued.claims.jti}`,device_name:String(req.body?.device_name||'Windows/Web'),trusted:Boolean(req.body?.trusted_device)},issued.claims.sub)};
    persistEnterpriseState(issued.claims.sub,'v20_2_7_authenticated_login');
    res.json({success:true,access_token:issued.token,refresh_token:refreshed.refresh_token,token_type:'Bearer',expires_at:new Date(issued.claims.exp*1000).toISOString(),refresh_expires_at:refreshed.session.expires_at,identity:{user_id:issued.claims.sub,username:issued.claims.username,role_code:issued.claims.role_code,permission_codes:issued.claims.permission_codes}});
  }catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'login_failed'});}
});

app.post('/api/v20.2.7/auth/refresh', (req:Request,res:Response)=>{
  try{
    const token=String(req.body?.refresh_token||'');
    if(!token){res.status(400).json({success:false,error:'refresh_token_required'});return;}
    const deviceId=String(req.body?.device_id||req.headers['x-device-id']||'').trim()||undefined;
    const rotated=rotateRefreshSessionV2027(authRuntimeV2021,authStoreV2021,token,deviceId);
    authStoreV2021=rotated.store; saveAuthStoreV2021(authRuntimeV2021,authStoreV2021);
    res.json({success:true,access_token:rotated.access_token,refresh_token:rotated.refresh_token,token_type:'Bearer',expires_at:new Date(rotated.claims.exp*1000).toISOString(),refresh_expires_at:rotated.session.expires_at,identity:{user_id:rotated.claims.sub,username:rotated.claims.username,role_code:rotated.claims.role_code,permission_codes:rotated.claims.permission_codes}});
  }catch(error){res.status(401).json({success:false,error:error instanceof Error?error.message:'refresh_failed'});}
});

app.post('/api/v20.2.1/auth/logout', requireAuthV2021(), (req:Request,res:Response)=>{
  const claims=authClaimsV2021(res); authStoreV2021=revokeAccessTokenV2021(authStoreV2021,claims,'logout');
  const refreshToken=String(req.body?.refresh_token||''); if(refreshToken)authStoreV2021=revokeRefreshSessionV2027(authStoreV2021,refreshToken,'logout');
  saveAuthStoreV2021(authRuntimeV2021,authStoreV2021); res.json({success:true});
});

app.post('/api/v20.2.1/auth/change-password', requireAuthV2021(), (req:Request,res:Response)=>{
  try{
    const claims=authClaimsV2021(res);
    const current=verifyPasswordV2021(authStoreV2021,claims.username,String(req.body?.current_password||'')); authStoreV2021=current.store;
    if(!current.ok){saveAuthStoreV2021(authRuntimeV2021,authStoreV2021);res.status(401).json({success:false,error:'current_password_invalid'});return;}
    authStoreV2021=changeCredentialPasswordV2021(authStoreV2021,claims.sub,String(req.body?.new_password||'')); authStoreV2021=revokeUserRefreshSessionsV2027(authStoreV2021,claims.sub,'password_change'); saveAuthStoreV2021(authRuntimeV2021,authStoreV2021);
    res.json({success:true,reauthentication_required:true});
  }catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'password_change_failed'});}
});

app.patch('/api/v20.2.1/auth/credentials/:userId/status', requireAuthV2021('security.credentials.manage'), (req:Request,res:Response)=>{
  try{authStoreV2021=setCredentialDisabledV2021(authStoreV2021,req.params.userId,Boolean(req.body?.disabled));authStoreV2021=revokeUserRefreshSessionsV2027(authStoreV2021,req.params.userId,'credential_status_change');saveAuthStoreV2021(authRuntimeV2021,authStoreV2021);res.json({success:true,user_id:req.params.userId,disabled:Boolean(req.body?.disabled),sessions_revoked:true});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'credential_status_update_failed'});}
});

app.get('/api/v20.2.1/auth/me', requireAuthV2021(), (req:Request,res:Response)=>{
  const claims=authClaimsV2021(res);
  const identity=enterpriseV11.enterprise_foundation_v20_2_1.identities.find(i=>i.user_id===claims.sub&&i.active);
  res.json({user_id:claims.sub,username:claims.username,role_code:claims.role_code,permission_codes:res.locals.permissions_v20_2_1||[],identity});
});

app.post('/api/v20.2.1/auth/credentials', requireAuthV2021('security.credentials.manage'), (req:Request,res:Response)=>{
  try{
    const roleCode=String(req.body?.role_code||'');
    if(roleCode!=='SYSTEM_OWNER'&&!enterpriseV11.enterprise_web_v20_2.roles.some(r=>r.code===roleCode&&r.active)) throw new Error('role_not_found');
    authStoreV2021=createCredentialV2021(authStoreV2021,{user_id:String(req.body?.user_id||''),username:String(req.body?.username||''),role_code:roleCode,permission_codes:Array.isArray(req.body?.permission_codes)?req.body.permission_codes:[],password:String(req.body?.password||'')});
    saveAuthStoreV2021(authRuntimeV2021,authStoreV2021);
    const created=authStoreV2021.credentials[0];
    res.status(201).json({success:true,credential:{id:created.id,user_id:created.user_id,username:created.username,role_code:created.role_code,permission_codes:created.permission_codes,disabled:created.disabled,created_at:created.created_at}});
  }catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'credential_create_failed'});}
});

app.get('/api/v20.2.1/foundation', requireAuthV2021('foundation.read'), (req:Request,res:Response)=>{
  res.json({version:'20.2.1',foundation:enterpriseV11.enterprise_foundation_v20_2_1,roles:enterpriseV11.enterprise_web_v20_2.roles,departments:enterpriseV11.enterprise_web_v20_2.departments,validation:validateEnterpriseFoundationV2021(enterpriseV11.enterprise_foundation_v20_2_1,enterpriseV11.enterprise_web_v20_2)});
});

app.post('/api/v20.2.1/organization/departments', requireAuthV2021('organization.manage'), (req:Request,res:Response)=>{
  try{enterpriseV11={...enterpriseV11,enterprise_web_v20_2:upsertDepartmentV2021(enterpriseV11.enterprise_web_v20_2,{id:req.body?.id,code:String(req.body?.code||''),name:String(req.body?.name||''),parent_id:req.body?.parent_id,active:req.body?.active!==false})};persistEnterpriseState(authClaimsV2021(res).sub,'v20_2_1_department_upsert');res.status(201).json({success:true,departments:enterpriseV11.enterprise_web_v20_2.departments});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'department_upsert_failed'});}
});

app.post('/api/v20.2.1/organization/branches', requireAuthV2021('organization.manage'), (req:Request,res:Response)=>{
  try{enterpriseV11={...enterpriseV11,enterprise_web_v20_2:upsertBranchV2021(enterpriseV11.enterprise_web_v20_2,{id:req.body?.id,code:String(req.body?.code||''),name:String(req.body?.name||''),governorate:String(req.body?.governorate||''),district:req.body?.district,active:req.body?.active!==false})};persistEnterpriseState(authClaimsV2021(res).sub,'v20_2_1_branch_upsert');res.status(201).json({success:true,branches:enterpriseV11.enterprise_web_v20_2.branches});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'branch_upsert_failed'});}
});

app.post('/api/v20.2.1/organization/roles', requireAuthV2021('security.roles.manage'), (req:Request,res:Response)=>{
  try{enterpriseV11={...enterpriseV11,enterprise_web_v20_2:upsertRoleDefinitionV2021(enterpriseV11.enterprise_web_v20_2,{id:req.body?.id,code:String(req.body?.code||''),name:String(req.body?.name||''),department_code:String(req.body?.department_code||''),permissions:Array.isArray(req.body?.permissions)?req.body.permissions:[],approval_limit_sar:Number(req.body?.approval_limit_sar||0),active:req.body?.active!==false})};persistEnterpriseState(authClaimsV2021(res).sub,'v20_2_1_role_upsert');res.status(201).json({success:true,roles:enterpriseV11.enterprise_web_v20_2.roles});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'role_upsert_failed'});}
});

app.post('/api/v20.2.1/scopes', requireAuthV2021('security.scopes.manage'), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);enterpriseV11={...enterpriseV11,enterprise_foundation_v20_2_1:upsertEnterpriseScopeV2021(enterpriseV11.enterprise_foundation_v20_2_1,{id:req.body?.id,code:String(req.body?.code||''),name:String(req.body?.name||''),type:req.body?.type||'farm',governorate:req.body?.governorate,district:req.body?.district,branch_ids:Array.isArray(req.body?.branch_ids)?req.body.branch_ids:[],farm_ids:Array.isArray(req.body?.farm_ids)?req.body.farm_ids:[],flock_ids:Array.isArray(req.body?.flock_ids)?req.body.flock_ids:[],inherits_scope_ids:Array.isArray(req.body?.inherits_scope_ids)?req.body.inherits_scope_ids:[],active:req.body?.active!==false},claims.sub)};persistEnterpriseState(claims.sub,'v20_2_1_scope_upsert');res.status(201).json({success:true,scope:enterpriseV11.enterprise_foundation_v20_2_1.scopes[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'scope_upsert_failed'});}
});

app.post('/api/v20.2.1/identities', requireAuthV2021('security.identities.manage'), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);const candidate=upsertEnterpriseIdentityV2021(enterpriseV11.enterprise_foundation_v20_2_1,{id:req.body?.id,user_id:String(req.body?.user_id||''),display_name:String(req.body?.display_name||''),role_code:String(req.body?.role_code||''),department_code:String(req.body?.department_code||''),branch_ids:Array.isArray(req.body?.branch_ids)?req.body.branch_ids:[],scope_ids:Array.isArray(req.body?.scope_ids)?req.body.scope_ids:[],permission_allow:Array.isArray(req.body?.permission_allow)?req.body.permission_allow:[],permission_deny:Array.isArray(req.body?.permission_deny)?req.body.permission_deny:[],locale:req.body?.locale==='en'?'en':'ar',timezone:String(req.body?.timezone||'Asia/Aden'),active:req.body?.active!==false,manager_user_id:req.body?.manager_user_id},claims.sub);const issues=validateEnterpriseFoundationV2021(candidate,enterpriseV11.enterprise_web_v20_2);if(issues.some(i=>i.startsWith('identity_role_missing')||i.startsWith('identity_scope_missing'))) throw new Error(issues.join('|'));enterpriseV11={...enterpriseV11,enterprise_foundation_v20_2_1:candidate};persistEnterpriseState(claims.sub,'v20_2_1_identity_upsert');res.status(201).json({success:true,identity:candidate.identities[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'identity_upsert_failed'});}
});

app.post('/api/v20.2.1/veterinary/territories', requireAuthV2021('veterinary.assignment.manage'), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);enterpriseV11={...enterpriseV11,enterprise_foundation_v20_2_1:createVeterinaryTerritoryV2021(enterpriseV11.enterprise_foundation_v20_2_1,{code:String(req.body?.code||''),name:String(req.body?.name||''),governorate:req.body?.governorate,districts:Array.isArray(req.body?.districts)?req.body.districts:[],branch_ids:Array.isArray(req.body?.branch_ids)?req.body.branch_ids:[],farm_ids:Array.isArray(req.body?.farm_ids)?req.body.farm_ids:[],flock_ids:Array.isArray(req.body?.flock_ids)?req.body.flock_ids:[],active:req.body?.active!==false},claims.sub)};persistEnterpriseState(claims.sub,'v20_2_1_vet_territory_create');res.status(201).json({success:true,territory:enterpriseV11.enterprise_foundation_v20_2_1.veterinary_territories[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'territory_create_failed'});}
});

app.post('/api/v20.2.1/veterinary/assignments', requireAuthV2021('veterinary.assignment.manage'), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);enterpriseV11={...enterpriseV11,enterprise_foundation_v20_2_1:assignVeterinarianV2021(enterpriseV11.enterprise_foundation_v20_2_1,{vet_user_id:String(req.body?.vet_user_id||''),specialty:req.body?.specialty||'general_veterinary',coverage_role:req.body?.coverage_role||'primary',territory_id:req.body?.territory_id,farm_ids:Array.isArray(req.body?.farm_ids)?req.body.farm_ids:[],flock_ids:Array.isArray(req.body?.flock_ids)?req.body.flock_ids:[],priority:Number(req.body?.priority||100),workload_limit_farms:req.body?.workload_limit_farms?Number(req.body.workload_limit_farms):undefined,workload_limit_flocks:req.body?.workload_limit_flocks?Number(req.body.workload_limit_flocks):undefined,starts_at:String(req.body?.starts_at||new Date().toISOString()),ends_at:req.body?.ends_at,status:req.body?.status||'active',assigned_by:claims.sub})};persistEnterpriseState(claims.sub,'v20_2_1_vet_assignment_create');res.status(201).json({success:true,assignment:enterpriseV11.enterprise_foundation_v20_2_1.veterinary_coverage[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'vet_assignment_failed'});}
});

app.get('/api/v20.2.1/veterinary/coverage', requireAuthV2021(), (req:Request,res:Response)=>{
  const claims=authClaimsV2021(res); const context=foundationContextFromRequest(req);
  if(claims.role_code!=='SYSTEM_OWNER'){
    const access=authorizeEnterpriseActionV2021(enterpriseV11.enterprise_foundation_v20_2_1,enterpriseV11.enterprise_web_v20_2,claims.sub,'view_assigned_farms',context);
    if(!access.allowed){res.status(403).json({success:false,error:access.reason});return;}
  }
  res.json({coverage:resolveVeterinaryCoverageV2021(enterpriseV11.enterprise_foundation_v20_2_1,context,(req.query.specialty as any)||'general_veterinary')});
});

app.post('/api/v20.2.1/veterinary/handovers', requireAuthV2021('veterinary.handover.manage'), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);enterpriseV11={...enterpriseV11,enterprise_foundation_v20_2_1:createVeterinaryHandoverV2021(enterpriseV11.enterprise_foundation_v20_2_1,{from_vet_user_id:String(req.body?.from_vet_user_id||''),to_vet_user_id:String(req.body?.to_vet_user_id||''),farm_ids:Array.isArray(req.body?.farm_ids)?req.body.farm_ids:[],flock_ids:Array.isArray(req.body?.flock_ids)?req.body.flock_ids:[],reason:String(req.body?.reason||''),effective_from:String(req.body?.effective_from||new Date().toISOString()),effective_until:req.body?.effective_until,case_refs:Array.isArray(req.body?.case_refs)?req.body.case_refs:[],plan_refs:Array.isArray(req.body?.plan_refs)?req.body.plan_refs:[],lab_refs:Array.isArray(req.body?.lab_refs)?req.body.lab_refs:[],medication_refs:Array.isArray(req.body?.medication_refs)?req.body.medication_refs:[],note:req.body?.note,created_by:claims.sub,status:req.body?.status||'draft'})};persistEnterpriseState(claims.sub,'v20_2_1_vet_handover_create');res.status(201).json({success:true,handover:enterpriseV11.enterprise_foundation_v20_2_1.veterinary_handovers[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'handover_create_failed'});}
});

app.post('/api/v20.2.1/delegations', requireAuthV2021('security.delegation.manage'), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);enterpriseV11={...enterpriseV11,enterprise_foundation_v20_2_1:createDelegationV2021(enterpriseV11.enterprise_foundation_v20_2_1,{from_user_id:String(req.body?.from_user_id||''),to_user_id:String(req.body?.to_user_id||''),permission_codes:Array.isArray(req.body?.permission_codes)?req.body.permission_codes:[],max_amount_sar:req.body?.max_amount_sar===undefined?undefined:Number(req.body.max_amount_sar),scope_ids:Array.isArray(req.body?.scope_ids)?req.body.scope_ids:[],valid_from:String(req.body?.valid_from||new Date().toISOString()),valid_to:String(req.body?.valid_to||''),reason:String(req.body?.reason||''),status:req.body?.status||'active',approved_by:claims.sub})};persistEnterpriseState(claims.sub,'v20_2_1_delegation_create');res.status(201).json({success:true,delegation:enterpriseV11.enterprise_foundation_v20_2_1.delegations[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'delegation_create_failed'});}
});

app.post('/api/v20.2.1/approvals', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);enterpriseV11={...enterpriseV11,enterprise_foundation_v20_2_1:createApprovalRequestV2021(enterpriseV11.enterprise_foundation_v20_2_1,{workflow_code:String(req.body?.workflow_code||''),source_type:String(req.body?.source_type||''),source_id:String(req.body?.source_id||''),title:String(req.body?.title||''),amount_sar:Number(req.body?.amount_sar||0),requested_by:claims.sub,context:req.body?.context||{}})};persistEnterpriseState(claims.sub,'v20_2_1_approval_request');res.status(201).json({success:true,approval:enterpriseV11.enterprise_foundation_v20_2_1.approval_requests[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'approval_request_failed'});}
});

app.post('/api/v20.2.1/approvals/:id/decision', requireAuthV2021(), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);enterpriseV11={...enterpriseV11,enterprise_foundation_v20_2_1:actOnApprovalV2021(enterpriseV11.enterprise_foundation_v20_2_1,{approval_id:req.params.id,actor_user_id:claims.sub,actor_role_code:claims.role_code,decision:req.body?.decision==='rejected'?'rejected':'approved',note:req.body?.note,delegated_from_user_id:req.body?.delegated_from_user_id})};persistEnterpriseState(claims.sub,'v20_2_1_approval_decision');res.json({success:true,approval:enterpriseV11.enterprise_foundation_v20_2_1.approval_requests.find(a=>a.id===req.params.id)});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'approval_decision_failed'});}
});

app.post('/api/v20.2.1/documents/register', requireAuthV2021('documents.upload'), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);enterpriseV11={...enterpriseV11,enterprise_foundation_v20_2_1:registerEvidenceDocumentV2021(enterpriseV11.enterprise_foundation_v20_2_1,{title:String(req.body?.title||''),classification:req.body?.classification||'internal',entity_type:String(req.body?.entity_type||''),entity_id:String(req.body?.entity_id||''),file_name:String(req.body?.file_name||''),mime_type:String(req.body?.mime_type||'application/octet-stream'),size_bytes:Number(req.body?.size_bytes||0),sha256:String(req.body?.sha256||''),storage_provider:req.body?.storage_provider||'external',storage_key:String(req.body?.storage_key||''),uploaded_by:claims.sub,immutable:req.body?.immutable!==false,retention_until:req.body?.retention_until,status:'active'})};persistEnterpriseState(claims.sub,'v20_2_1_document_register');res.status(201).json({success:true,document:enterpriseV11.enterprise_foundation_v20_2_1.evidence_documents[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'document_register_failed'});}
});

app.post('/api/v20.2.1/notifications', requireAuthV2021('notifications.emit'), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);enterpriseV11={...enterpriseV11,enterprise_foundation_v20_2_1:emitEnterpriseNotificationV2021(enterpriseV11.enterprise_foundation_v20_2_1,{event_type:String(req.body?.event_type||''),title:String(req.body?.title||''),body:String(req.body?.body||''),source_type:String(req.body?.source_type||''),source_id:String(req.body?.source_id||''),target_user_ids:Array.isArray(req.body?.target_user_ids)?req.body.target_user_ids:[]})};persistEnterpriseState(claims.sub,'v20_2_1_notification_emit');res.status(201).json({success:true,notification:enterpriseV11.enterprise_foundation_v20_2_1.notifications[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'notification_emit_failed'});}
});

app.get('/api/v20.2.1/veterinary/workload', requireAuthV2021('foundation.read'), (req:Request,res:Response)=>{
  res.json({workload:veterinaryWorkloadV2021(enterpriseV11.enterprise_foundation_v20_2_1)});
});

app.post('/api/v20.2.1/master-data', requireAuthV2021('master_data.manage'), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);const candidate=upsertMasterDataEntryV2021(enterpriseV11.enterprise_foundation_v20_2_1,{id:req.body?.id,domain:String(req.body?.domain||''),code:String(req.body?.code||''),label_ar:String(req.body?.label_ar||''),label_en:String(req.body?.label_en||''),parent_code:req.body?.parent_code,sort_order:Number(req.body?.sort_order||0),metadata:req.body?.metadata||{},active:req.body?.active!==false,effective_from:req.body?.effective_from,effective_to:req.body?.effective_to},claims.sub);enterpriseV11={...enterpriseV11,enterprise_foundation_v20_2_1:candidate};persistEnterpriseState(claims.sub,'v20_2_1_master_data_upsert');res.status(201).json({success:true,entry:candidate.master_data[0]});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'master_data_upsert_failed'});}
});

app.patch('/api/v20.2.1/localization', requireAuthV2021('settings.localization.manage'), (req:Request,res:Response)=>{
  try{const claims=authClaimsV2021(res);const candidate=updateLocalizationV2021(enterpriseV11.enterprise_foundation_v20_2_1,{default_language:req.body?.default_language,available_languages:req.body?.available_languages,fallback_language:req.body?.fallback_language,rtl_languages:req.body?.rtl_languages},claims.sub);enterpriseV11={...enterpriseV11,enterprise_foundation_v20_2_1:candidate};persistEnterpriseState(claims.sub,'v20_2_1_localization_update');res.json({success:true,localization:candidate.localization});}catch(error){res.status(400).json({success:false,error:error instanceof Error?error.message:'localization_update_failed'});}
});

app.get('/api/v20.2.1/validation', requireAuthV2021('foundation.read'), (req:Request,res:Response)=>{
  const issues=validateEnterpriseFoundationV2021(enterpriseV11.enterprise_foundation_v20_2_1,enterpriseV11.enterprise_web_v20_2);
  res.json({version:'20.2.1',status:issues.length?'PARTIAL':'PASS',issues});
});

// ----------------------------------------------------
// V20.2 Enterprise Web Platform API
// ----------------------------------------------------
app.get('/api/v20.2/state', requireV202Roles(['ceo','sector_manager','finance']), (req: Request, res: Response) => {
  res.json({ version:'20.2', environment:RUNTIME_ENVIRONMENT, enterprise_web_v20_2:enterpriseV11.enterprise_web_v20_2, validation:validateEnterpriseWebStateV202(enterpriseV11.enterprise_web_v20_2, enterpriseV11.v20_core, enterpriseV11.managed_operations_v19_7) });
});

// Legacy endpoints are retained for compatibility, but must not accept client-asserted identity.
app.get('/api/v20.2/tasks', requireAuthV2021(), (_req:Request,res:Response)=>{
  const claims=authClaimsV2021(res);
  const allowed=authorizedFarmIdsV2026(res);
  const privileged=claims.role_code==='SYSTEM_OWNER';
  const tasks=enterpriseV11.enterprise_web_v20_2.role_tasks.filter(t=>
    Boolean(t.farm_id)&&allowed.has(t.farm_id)&&
    (privileged||t.assigned_user_id===claims.sub||
      (claims.role_code==='FARM_MANAGER'&&allowed.has(t.farm_id))));
  res.setHeader('Cache-Control','private, no-store');
  res.json({tasks});
});

// This historical projection aggregates multiple farms and cannot be safely scoped.
// Use /api/v20.2.9/role-workspace for assigned clinical cases and consultations.
app.get('/api/v20.2/doctor-workspace', requireAuthV2021(), (_req:Request,res:Response)=>{
  res.status(410).json({success:false,error:'legacy_cross_farm_projection_retired',replacement:'/api/v20.2.9/role-workspace'});
});

app.get('/api/v20.2/owner-workspace/:farmId', requireAuthV2021(), (req:Request,res:Response)=>{
  const claims=authClaimsV2021(res);
  if(!['SYSTEM_OWNER','FARM_OWNER','FARM_MANAGER'].includes(claims.role_code)){
    res.status(403).json({success:false,error:'role_not_authorized'});return;
  }
  if(!authorizedFarmIdsV2026(res).has(req.params.farmId)){
    res.status(403).json({success:false,error:'farm_scope_denied'});return;
  }
  res.setHeader('Cache-Control','private, no-store');
  res.json(ownerWorkspaceV202(enterpriseV11.enterprise_web_v20_2,enterpriseV11.v20_core,enterpriseV11.managed_operations_v19_7,req.params.farmId));
});

app.get('/api/v20.2/command-center', requireAuthV2021(), (_req:Request,res:Response)=>{
  if(authClaimsV2021(res).role_code!=='SYSTEM_OWNER'){
    res.status(403).json({success:false,error:'platform_scope_required'});return;
  }
  res.setHeader('Cache-Control','private, no-store');
  res.json(managerCommandCenterV202(enterpriseV11.enterprise_web_v20_2,enterpriseV11.v20_core,enterpriseV11.managed_operations_v19_7,enterpriseV11.platform_core_v19_5));
});

app.post('/api/v20.2/cost-centers/ensure', requireV202Roles(['ceo','finance','sector_manager']), (req: Request, res: Response) => {
  try {
    enterpriseV11={...enterpriseV11,enterprise_web_v20_2:ensureCostCenterV202(enterpriseV11.enterprise_web_v20_2,{farm_id:req.body?.farm_id,flock_id:req.body?.flock_id,category:String(req.body?.category||'general'),name:req.body?.name})};
    persistEnterpriseState(String(req.body?.actor||'system'),'v20_2_cost_center_ensure'); res.status(201).json({success:true,cost_center:enterpriseV11.enterprise_web_v20_2.cost_centers[0]});
  } catch(error:any){res.status(400).json({success:false,error:error?.message||'cost_center_failed'});}
});

app.post('/api/v20.2/expenses', requireV202Roles(['ceo','finance','sector_manager','field_vet','supervisor']), (req: Request, res: Response) => {
  try {
    enterpriseV11={...enterpriseV11,enterprise_web_v20_2:createExpenseV202(enterpriseV11.enterprise_web_v20_2,{farm_id:req.body?.farm_id,flock_id:req.body?.flock_id,cost_center_id:String(req.body?.cost_center_id||''),expense_type:req.body?.expense_type,description:String(req.body?.description||''),currency:req.body?.currency||'SAR',amount:Number(req.body?.amount||0),exchange_rate_to_sar:Number(req.body?.exchange_rate_to_sar||1),rate_date:String(req.body?.rate_date||new Date().toISOString().slice(0,10)),rate_source:String(req.body?.rate_source||'manual'),payment_method:req.body?.payment_method||'credit',requested_by:String(req.body?.requested_by||'user'),evidence_refs:Array.isArray(req.body?.evidence_refs)?req.body.evidence_refs:[],invoice_number:req.body?.invoice_number,expense_date:String(req.body?.expense_date||new Date().toISOString().slice(0,10)),reason:String(req.body?.reason||req.body?.description||''),contract_id:req.body?.contract_id})};
    persistEnterpriseState(String(req.body?.requested_by||'user'),'v20_2_expense_create'); res.status(201).json({success:true,expense:enterpriseV11.enterprise_web_v20_2.expenses[0]});
  } catch(error:any){res.status(400).json({success:false,error:error?.message||'expense_failed'});}
});

app.post('/api/v20.2/expenses/:id/decision', requireV202Roles(['ceo','finance']), (req: Request, res: Response) => {
  try {
    enterpriseV11={...enterpriseV11,enterprise_web_v20_2:decideExpenseV202(enterpriseV11.enterprise_web_v20_2,req.params.id,Boolean(req.body?.approved),String(req.body?.actor||'finance'),String(req.body?.actor_role||'finance'),String(req.body?.reason||'expense decision'))};
    persistEnterpriseState(String(req.body?.actor||'finance'),'v20_2_expense_decision'); res.json({success:true});
  } catch(error:any){res.status(400).json({success:false,error:error?.message||'expense_decision_failed'});}
});

app.post('/api/v20.2/journals', requireV202Roles(['ceo','finance']), (req: Request, res: Response) => {
  try {
    enterpriseV11={...enterpriseV11,enterprise_web_v20_2:postJournalV202(enterpriseV11.enterprise_web_v20_2,{journal_date:String(req.body?.journal_date||new Date().toISOString().slice(0,10)),description:String(req.body?.description||''),source_type:String(req.body?.source_type||'manual'),source_id:String(req.body?.source_id||'manual'),original_currency:req.body?.original_currency,original_amount:req.body?.original_amount,exchange_rate_to_sar:req.body?.exchange_rate_to_sar,rate_date:req.body?.rate_date,lines:Array.isArray(req.body?.lines)?req.body.lines:[],created_by:String(req.body?.created_by||'finance'),approved_by:req.body?.approved_by},String(req.body?.actor_role||'finance'))};
    persistEnterpriseState(String(req.body?.created_by||'finance'),'v20_2_journal_post'); res.status(201).json({success:true,journal:enterpriseV11.enterprise_web_v20_2.journal_entries[0]});
  } catch(error:any){res.status(400).json({success:false,error:error?.message||'journal_failed'});}
});

app.post('/api/v20.2/tomorrow-plans', requireV202Roles(['ceo','vet_consultant','field_vet']), (req: Request, res: Response) => {
  try {
    enterpriseV11={...enterpriseV11,enterprise_web_v20_2:createTomorrowPlanV202(enterpriseV11.enterprise_web_v20_2,{farm_id:String(req.body?.farm_id||''),flock_id:String(req.body?.flock_id||''),plan_date:String(req.body?.plan_date||''),source_report_id:req.body?.source_report_id,issued_by_vet:String(req.body?.issued_by_vet||''),feed_kg:Number(req.body?.feed_kg||0),feeding_times:Array.isArray(req.body?.feeding_times)?req.body.feeding_times:[],target_temperature_min_c:Number(req.body?.target_temperature_min_c||0),target_temperature_max_c:Number(req.body?.target_temperature_max_c||0),humidity_min_pct:Number(req.body?.humidity_min_pct||0),humidity_max_pct:Number(req.body?.humidity_max_pct||0),weight_sample_time:req.body?.weight_sample_time,weight_sample_count:req.body?.weight_sample_count?Number(req.body.weight_sample_count):undefined,weight_sample_condition:req.body?.weight_sample_condition,ventilation_instruction:req.body?.ventilation_instruction,treatment_instruction:req.body?.treatment_instruction,vaccination_instruction:req.body?.vaccination_instruction,litter_instruction:req.body?.litter_instruction,maintenance_instruction:req.body?.maintenance_instruction,required_items:Array.isArray(req.body?.required_items)?req.body.required_items:[],vet_note:req.body?.vet_note,worker_user_id:req.body?.worker_user_id},String(req.body?.actor_role||'field_vet'))};
    persistEnterpriseState(String(req.body?.issued_by_vet||'vet'),'v20_2_tomorrow_plan'); res.status(201).json({success:true,plan:enterpriseV11.enterprise_web_v20_2.tomorrow_plans[0]});
  } catch(error:any){res.status(400).json({success:false,error:error?.message||'tomorrow_plan_failed'});}
});

app.patch('/api/v20.2/tasks/:id', requireV202Roles(['ceo','sector_manager','vet_consultant','field_vet','supervisor','worker','finance','laboratory']), (req: Request, res: Response) => {
  try {
    enterpriseV11={...enterpriseV11,enterprise_web_v20_2:updateRoleTaskV202(enterpriseV11.enterprise_web_v20_2,req.params.id,req.body?.status,String(req.body?.actor||'user'),String(req.body?.actor_role||'user'),req.body?.note,Array.isArray(req.body?.evidence_refs)?req.body.evidence_refs:[])};
    persistEnterpriseState(String(req.body?.actor||'user'),'v20_2_task_update'); res.json({success:true});
  } catch(error:any){res.status(400).json({success:false,error:error?.message||'task_update_failed'});}
});

app.post('/api/v20.2/employees', requireV202Roles(['ceo','sector_manager']), (req: Request, res: Response) => {
  try {
    enterpriseV11={...enterpriseV11,enterprise_web_v20_2:addEmployeeV202(enterpriseV11.enterprise_web_v20_2,{user_id:req.body?.user_id,full_name:String(req.body?.full_name||''),job_title:String(req.body?.job_title||''),department_code:String(req.body?.department_code||'FIELD'),branch_id:req.body?.branch_id,supervisor_employee_id:req.body?.supervisor_employee_id,phone:req.body?.phone,status:req.body?.status||'active',assigned_farm_ids:Array.isArray(req.body?.assigned_farm_ids)?req.body.assigned_farm_ids:[],assigned_flock_ids:Array.isArray(req.body?.assigned_flock_ids)?req.body.assigned_flock_ids:[],work_schedule:String(req.body?.work_schedule||''),attendance_policy:String(req.body?.attendance_policy||'attendance_required'),documents:Array.isArray(req.body?.documents)?req.body.documents:[]},String(req.body?.actor||'hr'),String(req.body?.actor_role||'hr'))};
    persistEnterpriseState(String(req.body?.actor||'hr'),'v20_2_employee_create'); res.status(201).json({success:true,employee:enterpriseV11.enterprise_web_v20_2.employees[0]});
  } catch(error:any){res.status(400).json({success:false,error:error?.message||'employee_failed'});}
});

app.post('/api/v20.2/employment-contracts', requireV202Roles(['ceo','sector_manager','finance']), (req: Request, res: Response) => {
  try {
    enterpriseV11={...enterpriseV11,enterprise_web_v20_2:addEmploymentContractV202(enterpriseV11.enterprise_web_v20_2,{employee_id:String(req.body?.employee_id||''),start_date:String(req.body?.start_date||new Date().toISOString().slice(0,10)),end_date:req.body?.end_date,currency:req.body?.currency||'SAR',compensation_model:req.body?.compensation_model||'monthly_salary',base_salary:Number(req.body?.base_salary||0),per_visit_fee:Number(req.body?.per_visit_fee||0),per_farm_fee:Number(req.body?.per_farm_fee||0),per_cycle_fee:Number(req.body?.per_cycle_fee||0),transport_allowance:Number(req.body?.transport_allowance||0),housing_allowance:Number(req.body?.housing_allowance||0),other_allowance:Number(req.body?.other_allowance||0),payer:req.body?.payer||'platform',farm_owner_share_percent:Number(req.body?.farm_owner_share_percent||0),platform_share_percent:Number(req.body?.platform_share_percent??100),status:req.body?.status||'draft'},String(req.body?.actor||'hr'),String(req.body?.actor_role||'sector_manager'))};
    persistEnterpriseState(String(req.body?.actor||'hr'),'v20_2_employment_contract_create'); res.status(201).json({success:true,contract:enterpriseV11.enterprise_web_v20_2.employment_contracts[0]});
  } catch(error:any){res.status(400).json({success:false,error:error?.message||'employment_contract_failed'});}
});

app.post('/api/v20.2/payroll', requireV202Roles(['ceo','finance']), (req: Request, res: Response) => {
  try {
    enterpriseV11={...enterpriseV11,enterprise_web_v20_2:createPayrollV202(enterpriseV11.enterprise_web_v20_2,{employee_id:String(req.body?.employee_id||''),period:String(req.body?.period||new Date().toISOString().slice(0,7)),visits:Number(req.body?.visits||0),farms:Number(req.body?.farms||0),cycles:Number(req.body?.cycles||0),bonuses:Number(req.body?.bonuses||0),advances:Number(req.body?.advances||0),deductions:Number(req.body?.deductions||0),cost_center_id:req.body?.cost_center_id},String(req.body?.actor||'finance'))};
    persistEnterpriseState(String(req.body?.actor||'finance'),'v20_2_payroll_create'); res.status(201).json({success:true,payroll:enterpriseV11.enterprise_web_v20_2.payroll[0]});
  } catch(error:any){res.status(400).json({success:false,error:error?.message||'payroll_failed'});}
});

app.get('/api/v20.2/cost-responsibility', requireV202Roles(['ceo','sector_manager','finance']), (req:Request,res:Response)=>{
  res.json({rules:enterpriseV11.enterprise_web_v20_2.cost_responsibility_rules});
});

app.get('/api/v20.2/finance/summary', requireV202Roles(['ceo','finance','sector_manager']), (req:Request,res:Response)=>{
  res.json({...financialStatementsV202(enterpriseV11.enterprise_web_v20_2),cost_centers:costCenterSummaryV202(enterpriseV11.enterprise_web_v20_2)});
});

app.post('/api/v20.2/reports', requireV202Roles(['ceo','sector_manager','finance','vet_consultant','field_vet','laboratory']), (req: Request, res: Response) => {
  try {
    enterpriseV11={...enterpriseV11,enterprise_web_v20_2:createEnterpriseReportV202(enterpriseV11.enterprise_web_v20_2,{report_code:String(req.body?.report_code||'GENERAL'),title:String(req.body?.title||'Enterprise Report'),period_from:String(req.body?.period_from||new Date().toISOString().slice(0,10)),period_to:String(req.body?.period_to||new Date().toISOString().slice(0,10)),generated_by:String(req.body?.generated_by||'reporting'),scope:req.body?.scope||{},data:req.body?.data||{},final:Boolean(req.body?.final)})};
    persistEnterpriseState(String(req.body?.generated_by||'reporting'),'v20_2_report'); res.status(201).json({success:true,report:enterpriseV11.enterprise_web_v20_2.report_snapshots[0]});
  } catch(error:any){res.status(400).json({success:false,error:error?.message||'report_failed'});}
});

// ----------------------------------------------------
// V19 Operational & Supply Chain Sovereignty API
// ----------------------------------------------------
app.get('/api/v19/command-center', (req: Request, res: Response) => {
  const s = enterpriseV11.sovereignty_v19;
  res.json({
    config: s.config,
    active_offices: s.market_offices.filter(x => x.status === 'active').length,
    available_freelance_vets: s.freelance_vets.filter(x => x.status === 'available').length,
    open_executive_issues: s.executive_issues.filter(x => x.status !== 'resolved').length,
    pending_pod: s.proof_of_delivery.filter(x => x.status === 'awaiting_arrival').length,
    published_health_labels: s.healthy_certificates.filter(canPublishHealthyLabelV19).length,
    epidemic_signals: s.epidemic_signals.filter(x => x.status !== 'resolved')
  });
});

app.post('/api/v19/logistics/route', (req: Request, res: Response) => {
  const b = req.body || {};
  const required = ['customer_name','governorate','district','product_id','product_name','category','quantity','criticality'];
  const missing = required.filter(k => b[k] === undefined || b[k] === null || b[k] === '');
  if (missing.length) { res.status(400).json({ error: `حقول مطلوبة: ${missing.join(', ')}` }); return; }
  const route = routeLogisticsV19(enterpriseV11.sovereignty_v19, {
    customer_name:String(b.customer_name), governorate:String(b.governorate), district:String(b.district),
    product_id:String(b.product_id), product_name:String(b.product_name), category:String(b.category), quantity:Number(b.quantity), criticality:b.criticality
  });
  enterpriseV11 = { ...enterpriseV11, sovereignty_v19: { ...enterpriseV11.sovereignty_v19, logistics_routes: [route, ...enterpriseV11.sovereignty_v19.logistics_routes] } };
  persistEnterpriseState(String(req.headers['x-user-role'] || 'system'), 'v19_logistics_route');
  res.status(201).json(route);
});

app.post('/api/v19/field-vets/assign', (req: Request, res: Response) => {
  const governorate = String(req.body?.governorate || '');
  const district = String(req.body?.district || '');
  if (!governorate || !district) { res.status(400).json({ error:'المحافظة والمديرية مطلوبتان.' }); return; }
  const vet = chooseFreelanceVetV19(enterpriseV11.sovereignty_v19, governorate, district);
  if (!vet) { res.status(404).json({ error:'لا يوجد طبيب مستقل مؤهل ومتاح حالياً.' }); return; }
  res.json({ suggested_vet:vet, note:'الترشيح آلي، أما المكافأة والتكليف النهائي فيعتمدان من الإدارة.' });
});

app.get('/api/v19/quality/:qrCode', (req: Request, res: Response) => {
  const c = enterpriseV11.sovereignty_v19.healthy_certificates.find(x => x.qr_public_code === req.params.qrCode);
  if (!c || !canPublishHealthyLabelV19(c)) { res.status(404).json({ verified:false, error:'الشهادة غير موجودة أو غير قابلة للنشر.' }); return; }
  res.json({ verified:true, certificate_number:c.certificate_number, farm_name:c.farm_name, issue_date:c.issue_date, valid_until:c.valid_until, lab_verified:c.lab_verified, withdrawal_period_cleared:c.withdrawal_period_cleared, toxin_screen_cleared:c.toxin_screen_cleared, vet_signed:c.vet_signed, public_summary:c.public_summary });
});

app.post('/api/v19/pod/:id/confirm', (req: Request, res: Response) => {
  const s = enterpriseV11.sovereignty_v19;
  const pod = s.proof_of_delivery.find(x => x.id === req.params.id);
  if (!pod) { res.status(404).json({ error:'سجل الاستلام غير موجود.' }); return; }
  const qty = Number(req.body?.received_quantity ?? pod.expected_quantity);
  const confirmedBy = String(req.body?.confirmed_by || 'مسؤول المكتب');
  const settlement = settlePodV19(pod, qty, confirmedBy, 'YER_OLD');
  enterpriseV11 = { ...enterpriseV11, sovereignty_v19: { ...s,
    proof_of_delivery:s.proof_of_delivery.map(x => x.id === pod.id ? {...settlement.pod, discrepancy_note:settlement.pod.discrepancy_note || req.body?.discrepancy_note} : x),
    financial_documents:settlement.document ? [settlement.document, ...s.financial_documents] : s.financial_documents
  }};
  persistEnterpriseState(String(req.headers['x-user-role'] || 'system'), 'v19_pod_confirm');
  res.json({ success:true, status:settlement.pod.status, received_quantity:qty, settlement_document:settlement.document });
});

// Expanded V19 operational endpoints
app.get('/api/v19/state', (req: Request, res: Response) => {
  res.json({ version:'1.9.0', sovereignty_v19:enterpriseV11.sovereignty_v19 });
});

app.get('/api/v19/inventory/attestations', (req: Request, res: Response) => {
  res.json({ requests:buildDailyInventoryAttestationsV19(enterpriseV11.sovereignty_v19) });
});

app.post('/api/v19/biosecurity/transit/validate', (req: Request, res: Response) => {
  const permit = req.body?.permit;
  if (!permit) { res.status(400).json({ error:'permit مطلوب' }); return; }
  res.json(validateTransitPermitV19(permit, enterpriseV11.sovereignty_v19.epidemic_signals));
});

app.post('/api/v19/finance/profitability-check', (req: Request, res: Response) => {
  const b=req.body||{};
  const values=['revenue','direct_cost','freight','platform_profit'].map(k=>Number(b[k]));
  if(values.some(Number.isNaN)){res.status(400).json({error:'revenue/direct_cost/freight/platform_profit مطلوبة كأرقام'});return;}
  res.json(profitabilityGuardV19(values[0],values[1],values[2],values[3],Number(b.min_margin_percent??3)));
});

app.post('/api/v19/chat/parse', (req: Request, res: Response) => {
  const text=String(req.body?.transcript||req.body?.text||'');
  if(!text){res.status(400).json({error:'text أو transcript مطلوب'});return;}
  res.json({fields:parseFieldMediaTranscriptV19(text),medical_decision:false,requires_human_vet:Boolean(req.body?.clinician_review_required)});
});

app.post('/api/v19/escalation/check', (req: Request, res: Response) => {
  res.json(shouldEscalateV19(req.body||{}, enterpriseV11.sovereignty_v19.config.mortality_escalation_percent_24h));
});

app.get('/api/v19/executive/issues/rebuild', (req: Request, res: Response) => {
  res.json({ generated:buildExecutiveIssuesV19(enterpriseV11.sovereignty_v19) });
});

app.get('/api/v19/hatchery/offers', (req: Request, res: Response) => {
  const governorate=typeof req.query.governorate==='string'?req.query.governorate:undefined;
  res.json({offers:availableChickOffersV19(enterpriseV11.sovereignty_v19.hatcheries,enterpriseV11.sovereignty_v19.chick_marketing_prices,governorate)});
});

app.post('/api/v19/ai/investment-signals', (req: Request, res: Response) => {
  const points=Array.isArray(req.body?.points)?req.body.points:[];
  if(!points.length){res.status(400).json({error:'points مطلوبة'});return;}
  res.json({signals:buildCorporateInvestmentSignalsV19(points,Number(req.body?.forecast_days||30))});
});

// ----------------------------------------------------
// V19.6 Preservation + Enterprise Financial Command API
// ----------------------------------------------------
// ----------------------------------------------------
// V19.7 Managed Poultry Operations + Broker Marketplace APIs
// ----------------------------------------------------
app.get('/api/v19.7/state', (req: Request, res: Response) => {
  res.json({ version:'1.9.7', managed_operations_v19_7: enterpriseV11.managed_operations_v19_7 });
});

app.post('/api/v19.7/state', (req: Request, res: Response) => {
  enterpriseV11 = {
    ...enterpriseV11,
    managed_operations_v19_7: buildManagedPoultryOperationsV197(
      enterpriseV11.platform_core_v19_5,
      enterpriseV11.enterprise_core_v19_6,
      { ...enterpriseV11.managed_operations_v19_7, ...(req.body || {}) }
    )
  };
  persistEnterpriseState(String(req.headers['x-user-role'] || 'system_owner'), 'v19_7_state_update');
  res.json({ success:true, managed_operations_v19_7:enterpriseV11.managed_operations_v19_7, validation:validateManagedOperationsV197(enterpriseV11.managed_operations_v19_7) });
});

app.post('/api/v19.7/availability/attestations/rebuild', (req: Request, res: Response) => {
  enterpriseV11 = { ...enterpriseV11, managed_operations_v19_7: buildDailyAvailabilityAttestationsV197(enterpriseV11.managed_operations_v19_7) };
  persistEnterpriseState(String(req.headers['x-user-role'] || 'system_owner'), 'v19_7_availability_attestations');
  res.json({ success:true, attestations:enterpriseV11.managed_operations_v19_7.availability_attestations });
});

app.post('/api/v19.7/marketplace/requests', (req: Request, res: Response) => {
  try {
    enterpriseV11 = { ...enterpriseV11, managed_operations_v19_7: createMarketplaceRequestV197(enterpriseV11.managed_operations_v19_7, req.body) };
    persistEnterpriseState('marketplace', 'v19_7_market_request');
    res.json({ success:true, request:enterpriseV11.managed_operations_v19_7.marketplace_requests[0] });
  } catch (error:any) { res.status(400).json({ success:false, error:error?.message || 'invalid_request' }); }
});

app.post('/api/v19.7/marketplace/requests/:id/supplier-response', (req: Request, res: Response) => {
  try {
    enterpriseV11 = { ...enterpriseV11, managed_operations_v19_7: supplierRespondMarketplaceV197(enterpriseV11.managed_operations_v19_7, req.params.id, req.body) };
    persistEnterpriseState('supplier', 'v19_7_supplier_availability_response');
    res.json({ success:true, request:enterpriseV11.managed_operations_v19_7.marketplace_requests.find(r=>r.id===req.params.id) });
  } catch (error:any) { res.status(400).json({ success:false, error:error?.message || 'invalid_response' }); }
});

app.post('/api/v19.7/marketplace/requests/:id/customer-confirm', (req: Request, res: Response) => {
  try { enterpriseV11={...enterpriseV11,managed_operations_v19_7:customerConfirmMarketplaceRequestV197(enterpriseV11.managed_operations_v19_7,req.params.id)}; persistEnterpriseState('customer','v19_7_market_customer_confirm');res.json({success:true}); } catch(error:any){res.status(400).json({success:false,error:error?.message||'customer_confirm_failed'});}
});
app.post('/api/v19.7/marketplace/requests/:id/payment', (req: Request, res: Response) => {
  try { enterpriseV11={...enterpriseV11,managed_operations_v19_7:recordMarketplacePaymentV197(enterpriseV11.managed_operations_v19_7,req.params.id,Boolean(req.body?.paid))}; persistEnterpriseState('finance','v19_7_market_payment');res.json({success:true}); } catch(error:any){res.status(400).json({success:false,error:error?.message||'payment_failed'});}
});
app.post('/api/v19.7/marketplace/requests/:id/dispatch', (req: Request, res: Response) => {
  try { enterpriseV11={...enterpriseV11,managed_operations_v19_7:dispatchMarketplaceOrderV197(enterpriseV11.managed_operations_v19_7,req.params.id)}; persistEnterpriseState('logistics','v19_7_market_dispatch');res.json({success:true}); } catch(error:any){res.status(400).json({success:false,error:error?.message||'dispatch_failed'});}
});
app.post('/api/v19.7/marketplace/requests/:id/pod', (req: Request, res: Response) => {
  try { enterpriseV11={...enterpriseV11,managed_operations_v19_7:completeMarketplaceDeliveryV197(enterpriseV11.managed_operations_v19_7,req.params.id,String(req.body?.pod_reference||`POD-${Date.now()}`))}; persistEnterpriseState('logistics','v19_7_market_pod');res.json({success:true}); } catch(error:any){res.status(400).json({success:false,error:error?.message||'pod_failed'});}
});
app.post('/api/v19.7/marketplace/requests/:id/escalate-vet', (req: Request, res: Response) => {
  enterpriseV11={...enterpriseV11,managed_operations_v19_7:escalateMarketplaceToOnCallVetV197(enterpriseV11.managed_operations_v19_7,req.params.id,req.body?.vet)}; persistEnterpriseState('system','v19_7_market_emergency_vet');res.json({success:true,case:enterpriseV11.managed_operations_v19_7.marketplace_emergency_cases[0]});
});

app.post('/api/v19.7/purchase-orders', (req: Request, res: Response) => {
  try { enterpriseV11={...enterpriseV11,managed_operations_v19_7:issueFarmPurchaseOrderV197(enterpriseV11.managed_operations_v19_7,req.body)}; persistEnterpriseState(String(req.body?.issued_by_finance||'finance'),'v19_7_purchase_order');res.json({success:true,po:enterpriseV11.managed_operations_v19_7.purchase_orders[0]}); } catch(error:any){res.status(400).json({success:false,error:error?.message||'po_failed'});}
});
app.post('/api/v19.7/purchase-orders/:id/supplier-confirm', (req: Request, res: Response) => {
  try { enterpriseV11={...enterpriseV11,managed_operations_v19_7:confirmFarmPurchaseOrderSupplierV197(enterpriseV11.managed_operations_v19_7,req.params.id,req.body)}; persistEnterpriseState(String(req.body?.actor||'supplier'),'v19_7_po_supplier_confirm');res.json({success:true}); } catch(error:any){res.status(400).json({success:false,error:error?.message||'po_confirm_failed'});}
});

app.post('/api/v19.7/managed/contracts', (req: Request, res: Response) => {
  try {
    enterpriseV11 = { ...enterpriseV11, managed_operations_v19_7: createManagedContractV197(enterpriseV11.managed_operations_v19_7, req.body) };
    persistEnterpriseState('management', 'v19_7_managed_contract');
    res.json({ success:true, contract:enterpriseV11.managed_operations_v19_7.managed_contracts[0] });
  } catch (error:any) { res.status(400).json({ success:false, error:error?.message || 'invalid_contract' }); }
});

app.post('/api/v19.7/flocks', (req: Request, res: Response) => {
  try {
    enterpriseV11 = { ...enterpriseV11, managed_operations_v19_7: createFlockCycleV197(enterpriseV11.managed_operations_v19_7, req.body) };
    persistEnterpriseState('management', 'v19_7_flock_cycle');
    res.json({ success:true, flock:enterpriseV11.managed_operations_v19_7.flock_cycles[0] });
  } catch (error:any) { res.status(400).json({ success:false, error:error?.message || 'invalid_flock' }); }
});

app.post('/api/v19.7/daily-reports', (req: Request, res: Response) => {
  try {
    enterpriseV11 = { ...enterpriseV11, managed_operations_v19_7: submitDailyFarmReportV197(enterpriseV11.managed_operations_v19_7, req.body) };
    persistEnterpriseState(String(req.body?.entered_by || 'worker'), 'v19_7_daily_report');
    res.json({ success:true, report:enterpriseV11.managed_operations_v19_7.daily_reports[0] });
  } catch (error:any) { res.status(400).json({ success:false, error:error?.message || 'invalid_daily_report' }); }
});

app.post('/api/v19.7/vet/decision/:reportId', (req: Request, res: Response) => {
  try {
    enterpriseV11 = { ...enterpriseV11, managed_operations_v19_7: generateVetDecisionAndTomorrowPlanV197(enterpriseV11.managed_operations_v19_7, req.params.reportId, req.body?.vet_name) };
    persistEnterpriseState(String(req.body?.vet_name || 'vet'), 'v19_7_vet_decision');
    res.json({ success:true, decision:enterpriseV11.managed_operations_v19_7.veterinary_decisions[0], plan:enterpriseV11.managed_operations_v19_7.daily_plans[0] });
  } catch (error:any) { res.status(400).json({ success:false, error:error?.message || 'decision_failed' }); }
});

app.post('/api/v19.7/requirements', (req: Request, res: Response) => {
  try {
    enterpriseV11 = { ...enterpriseV11, managed_operations_v19_7: createFarmRequirementV197(enterpriseV11.managed_operations_v19_7, req.body) };
    persistEnterpriseState(String(req.body?.requested_by || 'staff'), 'v19_7_farm_requirement');
    res.json({ success:true, requirement:enterpriseV11.managed_operations_v19_7.requirements[0] });
  } catch (error:any) { res.status(400).json({ success:false, error:error?.message || 'requirement_failed' }); }
});

app.post('/api/v19.7/requirements/:id/owner-decision', (req: Request, res: Response) => {
  enterpriseV11 = { ...enterpriseV11, managed_operations_v19_7: decideFarmRequirementV197(enterpriseV11.managed_operations_v19_7, req.params.id, req.body?.decision, String(req.body?.note||''), String(req.body?.actor||'farm_owner')) };
  persistEnterpriseState(String(req.body?.actor || 'farm_owner'), 'v19_7_owner_decision');
  res.json({ success:true });
});

app.post('/api/v19.7/requirements/:id/finance', (req: Request, res: Response) => {
  try {
    enterpriseV11 = { ...enterpriseV11, managed_operations_v19_7: financeApproveRequirementV197(enterpriseV11.managed_operations_v19_7, req.params.id, Boolean(req.body?.approved), String(req.body?.actor||'finance')) };
    persistEnterpriseState(String(req.body?.actor || 'finance'), 'v19_7_finance_requirement');
    res.json({ success:true });
  } catch (error:any) { res.status(400).json({ success:false, error:error?.message || 'finance_approval_failed' }); }
});

app.post('/api/v19.7/goods-receipts', (req: Request, res: Response) => {
  try {
    enterpriseV11 = { ...enterpriseV11, managed_operations_v19_7: receiveFarmGoodsAndBookCostV197(enterpriseV11.managed_operations_v19_7, enterpriseV11.platform_core_v19_5, req.body) };
    persistEnterpriseState(String(req.body?.received_by || 'worker'), 'v19_7_goods_receipt');
    res.json({ success:true, receipt:enterpriseV11.managed_operations_v19_7.goods_receipts[0] });
  } catch (error:any) { res.status(400).json({ success:false, error:error?.message || 'goods_receipt_failed' }); }
});

app.post('/api/v19.7/chat/messages', (req: Request, res: Response) => {
  enterpriseV11 = { ...enterpriseV11, managed_operations_v19_7: sendFarmChatMessageV197(enterpriseV11.managed_operations_v19_7, req.body) };
  persistEnterpriseState(String(req.body?.sender_name || 'chat'), 'v19_7_chat_message');
  res.json({ success:true, message:enterpriseV11.managed_operations_v19_7.chat_messages[0] });
});

app.post('/api/v19.7/marketing/readiness/:flockId', (req: Request, res: Response) => {
  try {
    enterpriseV11 = { ...enterpriseV11, managed_operations_v19_7: generateMarketingReadinessV197(enterpriseV11.managed_operations_v19_7, req.params.flockId, Number(req.body?.market_price||0), req.body?.currency || 'SAR', Number(req.body?.extra_day_feed_cost||0)) };
    persistEnterpriseState('marketing', 'v19_7_marketing_readiness');
    res.json({ success:true, readiness:enterpriseV11.managed_operations_v19_7.marketing_readiness[0] });
  } catch (error:any) { res.status(400).json({ success:false, error:error?.message || 'readiness_failed' }); }
});

app.post('/api/v19.7/sales', (req: Request, res: Response) => {
  try {
    enterpriseV11 = { ...enterpriseV11, managed_operations_v19_7: createPoultrySaleV197(enterpriseV11.managed_operations_v19_7, req.body) };
    persistEnterpriseState('marketing', 'v19_7_poultry_sale');
    res.json({ success:true, sale:enterpriseV11.managed_operations_v19_7.poultry_sales[0] });
  } catch (error:any) { res.status(400).json({ success:false, error:error?.message || 'sale_failed' }); }
});

app.post('/api/v19.7/sales/:id/delivery', (req: Request, res: Response) => {
  try {
    enterpriseV11 = { ...enterpriseV11, managed_operations_v19_7: completeSaleDeliveryV197(enterpriseV11.managed_operations_v19_7, req.params.id, req.body) };
    persistEnterpriseState('marketing', 'v19_7_sale_delivery');
    res.json({ success:true });
  } catch (error:any) { res.status(400).json({ success:false, error:error?.message || 'delivery_failed' }); }
});

app.post('/api/v19.7/settlements/:flockId', (req: Request, res: Response) => {
  try {
    enterpriseV11 = { ...enterpriseV11, managed_operations_v19_7: generateCycleSettlementV197(enterpriseV11.managed_operations_v19_7, req.params.flockId) };
    persistEnterpriseState('finance', 'v19_7_cycle_settlement');
    res.json({ success:true, settlement:enterpriseV11.managed_operations_v19_7.settlements[0], performance:enterpriseV11.managed_operations_v19_7.cycle_performance[0] });
  } catch (error:any) { res.status(400).json({ success:false, error:error?.message || 'settlement_failed' }); }
});

app.get('/api/v19.6/state', (req: Request, res: Response) => {
  res.json({ version:'1.9.6', enterprise_core_v19_6: enterpriseV11.enterprise_core_v19_6, platform_core_v19_5: enterpriseV11.platform_core_v19_5 });
});

app.post('/api/v19.6/state', (req: Request, res: Response) => {
  enterpriseV11 = {
    ...enterpriseV11,
    enterprise_core_v19_6: buildEnterpriseCoreV196(enterpriseV11.platform_core_v19_5, { ...enterpriseV11.enterprise_core_v19_6, ...(req.body || {}) })
  };
  persistEnterpriseState(String(req.headers['x-user-role'] || 'system_owner'), 'v19_6_enterprise_update');
  res.json({ success:true, enterprise_core_v19_6:enterpriseV11.enterprise_core_v19_6 });
});

// ----------------------------------------------------
// V19.5 Operational Completion API
// ----------------------------------------------------
app.get('/api/v19.5/state', (req: Request, res: Response) => {
  res.json({ version:'1.9.5', platform_core_v19_5:enterpriseV11.platform_core_v19_5 });
});

app.get('/api/v19.5/search', (req: Request, res: Response) => {
  const q=String(req.query.q||'');
  res.json({ results:globalSearchV195(enterpriseV11.platform_core_v19_5,q) });
});

app.post('/api/v19.5/chat/messages', (req: Request, res: Response) => {
  const b=req.body||{}; const required=['room_id','sender_id','sender_name','sender_role','type'];
  const missing=required.filter(k=>!b[k]); if(missing.length){res.status(400).json({error:`حقول مطلوبة: ${missing.join(', ')}`});return;}
  enterpriseV11={...enterpriseV11,platform_core_v19_5:addChatMessageV195(enterpriseV11.platform_core_v19_5,{room_id:String(b.room_id),sender_id:String(b.sender_id),sender_name:String(b.sender_name),sender_role:b.sender_role,type:b.type,text:b.text?String(b.text):undefined,transcript:b.transcript?String(b.transcript):undefined,media_name:b.media_name?String(b.media_name):undefined,media_data_url:b.media_data_url?String(b.media_data_url):undefined})};
  persistEnterpriseState(String(req.headers['x-user-role']||b.sender_role||'system'),'v19_5_chat_message');
  res.status(201).json({success:true,platform_core_v19_5:enterpriseV11.platform_core_v19_5});
});

app.post('/api/v19.5/catalog/:id/price', (req: Request, res: Response) => {
  const currency=String(req.body?.currency||'SAR') as any; const amount=Number(req.body?.amount); if(!Number.isFinite(amount)){res.status(400).json({error:'amount مطلوب'});return;}
  enterpriseV11={...enterpriseV11,platform_core_v19_5:setCatalogPriceV195(enterpriseV11.platform_core_v19_5,req.params.id,currency,amount,String(req.body?.actor||'الإدارة'),req.body?.governorate?String(req.body.governorate):undefined)};
  persistEnterpriseState(String(req.headers['x-user-role']||'admin'),'v19_5_price_update'); res.json({success:true});
});

app.post('/api/v19.5/inventory/reserve', (req: Request, res: Response) => {
  try{
    enterpriseV11={...enterpriseV11,platform_core_v19_5:createReservationV195(enterpriseV11.platform_core_v19_5,{item_id:String(req.body?.item_id||''),quantity:Number(req.body?.quantity||0),customer_name:String(req.body?.customer_name||''),order_reference:String(req.body?.order_reference||'')},String(req.body?.actor||'المبيعات'))};
    persistEnterpriseState(String(req.headers['x-user-role']||'sales'),'v19_5_inventory_reservation');res.status(201).json({success:true});
  }catch(error:any){res.status(409).json({error:error?.message||'تعذر حجز الكمية'});}
});

app.post('/api/v19.5/approvals/:id/advance', (req: Request, res: Response) => {
  enterpriseV11={...enterpriseV11,platform_core_v19_5:advanceApprovalV195(enterpriseV11.platform_core_v19_5,req.params.id,String(req.body?.actor||'الإدارة'),String(req.body?.role||'ceo') as any,req.body?.approve!==false,String(req.body?.note||''))};
  persistEnterpriseState(String(req.headers['x-user-role']||'ceo'),'v19_5_approval');res.json({success:true});
});

app.post('/api/v19.5/data-quality/audit', (req: Request, res: Response) => {
  enterpriseV11={...enterpriseV11,platform_core_v19_5:runDataQualityAuditV195(enterpriseV11.platform_core_v19_5)};persistEnterpriseState('system','v19_5_data_quality_audit');res.json({issues:enterpriseV11.platform_core_v19_5.data_quality});
});

app.post('/api/v19.5/backups', (req: Request, res: Response) => {
  enterpriseV11={...enterpriseV11,platform_core_v19_5:createBackupSnapshotV195(enterpriseV11.platform_core_v19_5,String(req.body?.actor||'الإدارة'))};persistEnterpriseState(String(req.headers['x-user-role']||'admin'),'v19_5_backup_snapshot');res.status(201).json({backup:enterpriseV11.platform_core_v19_5.backups[0]});
});

// ----------------------------------------------------
// V14 Field Doctor / Tele-consultation API (development adapter)
// ----------------------------------------------------

// ----------------------------------------------------
// V15 Offline Sync / Conflict Resolution / Veterinary Verification
// ----------------------------------------------------
app.get('/api/v15/sync/status', (req: Request, res: Response) => {
  res.json({
    online: true,
    server_revision: enterpriseV11.offline_sync_v15?.server_revision || 0,
    last_sync_at: enterpriseV11.offline_sync_v15?.last_sync_at,
    conflict_strategy: enterpriseV11.offline_sync_v15?.conflict_strategy || 'last_write_wins',
    unresolved_conflicts: (enterpriseV11.sync_conflicts_v15 || []).filter((x) => x.resolution === 'pending').length
  });
});

app.post('/api/v15/sync', (req: Request, res: Response) => {
  const incoming = req.body?.enterprise as EnterpriseOperationsV11State | undefined;
  const baseRevision = Number(req.body?.base_revision ?? incoming?.offline_sync_v15?.client_revision ?? 0);
  const strategy = String(req.body?.strategy || incoming?.offline_sync_v15?.conflict_strategy || 'last_write_wins');
  const clientUpdatedAt = String(req.body?.client_updated_at || new Date().toISOString());
  const deviceId = String(req.headers['x-device-id'] || incoming?.offline_sync_v15?.device_id || 'unknown-device');
  const serverRevision = Number(enterpriseV11.offline_sync_v15?.server_revision || 0);

  if (!incoming) {
    res.status(400).json({ success: false, error: 'enterprise payload is required' });
    return;
  }

  if (baseRevision < serverRevision && strategy === 'manual_review') {
    const conflict = {
      id: `sync-conflict-${Date.now()}`,
      entity_type: 'enterprise_snapshot', entity_id: 'singleton', field_name: 'snapshot',
      client_value: { device_id: deviceId, revision: baseRevision },
      server_value: { revision: serverRevision },
      client_updated_at: clientUpdatedAt,
      server_updated_at: enterpriseV11.offline_sync_v15?.last_sync_at || new Date().toISOString(),
      strategy: 'manual_review' as const, resolution: 'pending' as const
    };
    enterpriseV11 = { ...enterpriseV11, sync_conflicts_v15: [conflict, ...(enterpriseV11.sync_conflicts_v15 || [])] };
    persistEnterpriseState('sync-engine', 'v15_sync_conflict_created');
    res.status(409).json({ success: false, conflict: true, server_revision: serverRevision, enterprise: enterpriseV11 });
    return;
  }

  if (baseRevision < serverRevision && strategy === 'server_wins') {
    res.json({ success: true, resolution: 'server_wins', server_revision: serverRevision, enterprise: enterpriseV11 });
    return;
  }

  const now = new Date().toISOString();
  const nextRevision = serverRevision + 1;
  enterpriseV11 = {
    ...enterpriseV11,
    ...incoming,
    offline_sync_v15: {
      ...(enterpriseV11.offline_sync_v15 || incoming.offline_sync_v15),
      ...(incoming.offline_sync_v15 || {}),
      server_revision: nextRevision,
      client_revision: nextRevision,
      pending_actions: 0,
      last_sync_at: now,
      last_successful_full_sync_at: now
    }
  };
  persistEnterpriseState(String(req.headers['x-user-role'] || 'sync-client'), `v15_sync_${strategy}`);
  res.json({ success: true, resolution: baseRevision < serverRevision ? strategy : 'no_conflict', server_revision: nextRevision, synced_at: now, enterprise: enterpriseV11 });
});

app.post('/api/v15/vet-verification', (req: Request, res: Response) => {
  const record = { id: `verify-${Date.now()}`, verified_at: new Date().toISOString(), ...req.body } as EnterpriseOperationsV11State['vet_verification_feedback_v15'][number];
  enterpriseV11 = { ...enterpriseV11, vet_verification_feedback_v15: [record, ...(enterpriseV11.vet_verification_feedback_v15 || [])] };
  persistEnterpriseState(String(req.headers['x-user-role'] || 'vet'), 'v15_vet_verification');
  res.status(201).json({ success: true, record });
});

app.get('/api/v14/field-visits', (req: Request, res: Response) => {
  res.json(enterpriseV11.field_doctor_visits_v14 || []);
});

app.post('/api/v14/field-visits', (req: Request, res: Response) => {
  const role = String(req.headers['x-user-role'] || 'field_vet');
  const visit = {
    id: `fdv-${Date.now()}`,
    visit_number: String(req.body?.visit_number || `VIS-${Date.now()}`),
    started_at: new Date().toISOString(),
    offline_created: Boolean(req.body?.offline_created),
    sync_status: 'synced',
    status: 'submitted',
    barn_photos: [], droppings_photos: [], litter_photos: [], necropsy_observations: [], voice_notes: [],
    ...req.body
  } as EnterpriseOperationsV11State['field_doctor_visits_v14'][number];
  enterpriseV11 = { ...enterpriseV11, field_doctor_visits_v14: [visit, ...(enterpriseV11.field_doctor_visits_v14 || [])] };
  persistEnterpriseState(role, 'v14_field_visit_created');
  res.status(201).json({ success: true, visit });
});

app.post('/api/v14/field-visits/:id/escalate', (req: Request, res: Response) => {
  const visit = enterpriseV11.field_doctor_visits_v14.find((x) => x.id === req.params.id);
  if (!visit) { res.status(404).json({ error: 'الزيارة غير موجودة' }); return; }
  const escalation = {
    id: `esc-${Date.now()}`, case_id: visit.case_id, visit_id: visit.id, created_at: new Date().toISOString(),
    escalated_by: String(req.body?.escalated_by || visit.doctor_name),
    reason: String(req.body?.reason || 'الحالة تحتاج مراجعة استشاري.'),
    priority: ['normal','urgent','critical'].includes(req.body?.priority) ? req.body.priority : 'urgent',
    assigned_senior_vet: String(req.body?.assigned_senior_vet || 'الاستشاري المناوب'),
    attachment_summary: Array.isArray(req.body?.attachment_summary) ? req.body.attachment_summary : [`${visit.necropsy_observations.length} صور تشريح`, `${visit.voice_notes.length} صوت`],
    status: 'queued'
  } as EnterpriseOperationsV11State['case_escalations_v14'][number];
  enterpriseV11 = {
    ...enterpriseV11,
    case_escalations_v14: [escalation, ...(enterpriseV11.case_escalations_v14 || [])],
    field_doctor_visits_v14: enterpriseV11.field_doctor_visits_v14.map((x) => x.id === visit.id ? { ...x, status: 'escalated' } : x)
  };
  persistEnterpriseState(String(req.headers['x-user-role'] || 'field_vet'), 'v14_case_escalated');
  res.status(201).json({ success: true, escalation });
});

app.get('/api/v14/cloud-readiness', (req: Request, res: Response) => {
  const c = enterpriseV11.cloud_production_v14;
  res.json({
    config: c,
    production_ready: c.database_connection_status === 'connected' && c.auth_connection_status === 'connected' && c.media_storage_status === 'connected' && c.encrypted_transport_required && c.signed_media_urls_required,
    note: 'لا تُعد المنظومة سحابية إنتاجية قبل اتصال قاعدة البيانات والمصادقة والتخزين فعلياً.'
  });
});

// V12 supervision schedule adapter: returns active contracts whose daily report is due.
app.get('/api/v12/supervision/due', (req: Request, res: Response) => {
  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const due = enterpriseV11.farm_supervision_contracts_v12
    .filter((c) => c.status === 'active')
    .filter((c) => {
      const reportsToday = enterpriseV11.supervision_daily_reports_v12.some((r) => r.contract_id === c.id && r.date === todayKey);
      if (reportsToday) return false;
      const [hour, minute] = (c.daily_report_time || '19:00').split(':').map(Number);
      const dueAt = new Date(now);
      dueAt.setHours(hour || 19, minute || 0, 0, 0);
      return now >= dueAt;
    })
    .map((c) => ({
      contract_id: c.id,
      contract_number: c.contract_number,
      farm_name: c.farm_name,
      customer_name: c.customer_name,
      responsible_vet_id: c.responsible_vet_id,
      responsible_vet_name: c.responsible_vet_name,
      responsible_supervisor_name: c.responsible_supervisor_name,
      daily_report_time: c.daily_report_time,
      governorate: c.governorate,
      district: c.district
    }));
  res.json({ generated_at: now.toISOString(), due });
});

app.post('/api/v12/supervision/reports', (req: Request, res: Response) => {
  const contractId = String(req.body?.contract_id || '');
  const contract = enterpriseV11.farm_supervision_contracts_v12.find((c) => c.id === contractId);
  if (!contract) {
    res.status(404).json({ error: 'عقد الإشراف غير موجود.' });
    return;
  }
  const now = new Date();
  const report = {
    id: `sdr-${Date.now()}`,
    contract_id: contract.id,
    date: String(req.body?.date || now.toISOString().slice(0, 10)),
    submitted_at: now.toISOString(),
    submitted_by: String(req.body?.submitted_by || contract.responsible_supervisor_name || 'المشرف الميداني'),
    feed_kg: Number(req.body?.feed_kg || 0),
    water_liters: Number(req.body?.water_liters || 0),
    mortality_count: Number(req.body?.mortality_count || 0),
    average_weight_grams: req.body?.average_weight_grams == null ? undefined : Number(req.body.average_weight_grams),
    temperature_celsius: Number(req.body?.temperature_celsius || 0),
    humidity_percent: Number(req.body?.humidity_percent || 0),
    ventilation_note: String(req.body?.ventilation_note || ''),
    litter_note: String(req.body?.litter_note || ''),
    vaccine_or_treatment_note: req.body?.vaccine_or_treatment_note ? String(req.body.vaccine_or_treatment_note) : undefined,
    ai_summary: String(req.body?.ai_summary || 'تم استلام التقرير اليومي وتحويله للطبيب المسؤول للمراجعة.'),
    alert_level: ['normal','watch','urgent'].includes(req.body?.alert_level) ? req.body.alert_level : 'watch',
    sent_to_vet: true,
    sent_to_vet_at: now.toISOString()
  } as EnterpriseOperationsV11State['supervision_daily_reports_v12'][number];
  enterpriseV11 = {
    ...enterpriseV11,
    supervision_daily_reports_v12: [report, ...enterpriseV11.supervision_daily_reports_v12],
    farm_supervision_contracts_v12: enterpriseV11.farm_supervision_contracts_v12.map((c) => c.id === contract.id ? { ...c, last_daily_report_at: report.submitted_at } : c)
  };
  persistEnterpriseState(String(req.headers['x-user-role'] || 'supervisor'), 'v12_supervision_report_submitted');
  res.status(201).json({ success: true, report, assigned_vet: { id: contract.responsible_vet_id, name: contract.responsible_vet_name } });
});


// ----------------------------------------------------
// V16 Leadership / CRM / Field Force / Communications
// ----------------------------------------------------
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

app.get('/api/v16/live-control-center', (req: Request, res: Response) => {
  res.json({
    war_room: enterpriseV11.owner_war_room_v16,
    branches: enterpriseV11.branch_accounting_v16,
    field_staff: enterpriseV11.field_staff_positions_v16,
    owner_alerts: enterpriseV11.owner_change_alerts_v16.filter(x => !x.acknowledged),
    crm_pipeline: enterpriseV11.crm_opportunities_v16,
    whatsapp_status: enterpriseV11.whatsapp_hub_v16,
    generated_at: new Date().toISOString()
  });
});

app.post('/api/v16/field-position', (req: Request, res: Response) => {
  const { id, staff_name, staff_role, phone, lat, lng, assigned_route, assigned_farm, movement_status, geofence_valid, visit_cost_yer } = req.body || {};
  if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) {
    res.status(400).json({ error: 'إحداثيات GPS مطلوبة' });
    return;
  }
  const existing = enterpriseV11.field_staff_positions_v16.find(x => x.id === id || (staff_name && x.staff_name === staff_name));
  const record = {
    id: existing?.id || `pos-${Date.now()}`,
    staff_name: String(staff_name || existing?.staff_name || 'عضو فريق ميداني'),
    staff_role: (staff_role || existing?.staff_role || 'field_supervisor') as any,
    phone: String(phone || existing?.phone || ''),
    lat: Number(lat), lng: Number(lng), last_ping_at: new Date().toISOString(),
    assigned_route: assigned_route ?? existing?.assigned_route,
    assigned_farm: assigned_farm ?? existing?.assigned_farm,
    movement_status: (movement_status || existing?.movement_status || 'available') as any,
    geofence_valid: Boolean(geofence_valid ?? existing?.geofence_valid ?? false),
    visit_cost_yer: Number(visit_cost_yer ?? existing?.visit_cost_yer ?? 0)
  };
  enterpriseV11 = {
    ...enterpriseV11,
    field_staff_positions_v16: existing
      ? enterpriseV11.field_staff_positions_v16.map(x => x.id === existing.id ? record : x)
      : [record, ...enterpriseV11.field_staff_positions_v16]
  };
  persistEnterpriseState(String(req.header('X-User-Role') || 'field_app'), 'v16_field_position_update');
  res.status(existing ? 200 : 201).json(record);
});

app.post('/api/v16/smart-route', (req: Request, res: Response) => {
  const { customer_name, governorate, district, customer_lat, customer_lng, prescribed_product, doctor_approval_reference } = req.body || {};
  if (!prescribed_product) {
    res.status(400).json({ error: 'اسم المنتج/الخطة المعتمدة مطلوب' });
    return;
  }
  const restricted = /مضاد|antibiotic/i.test(String(prescribed_product));
  if (restricted && !doctor_approval_reference) {
    res.status(409).json({ error: 'المضاد الحيوي يحتاج مرجع اعتماد الطبيب قبل التوجيه للمخزون.' });
    return;
  }
  const activeBranches = enterpriseV11.vendor_branches_v16.filter(b => b.active);
  const scored = activeBranches.map(branch => {
    const lot = enterpriseV11.inventory_lots.find(l => l.branch_id === branch.linked_platform_branch_id && l.product_name === prescribed_product)
      || enterpriseV11.inventory_lots.find(l => l.branch_id === branch.linked_platform_branch_id && l.quantity_on_hand > l.quantity_reserved);
    const stock = lot ? Math.max(0, lot.quantity_on_hand - lot.quantity_reserved) : 0;
    const distance = Number.isFinite(Number(customer_lat)) && Number.isFinite(Number(customer_lng))
      ? haversineKm(Number(customer_lat), Number(customer_lng), branch.lat, branch.lng)
      : (branch.governorate === governorate ? 25 : 250);
    return { branch, stock, distance, score: distance + (stock > 0 ? 0 : 500) + (branch.governorate === governorate ? 0 : 75) };
  }).sort((a,b) => a.score - b.score);
  const pick = scored[0];
  if (!pick) { res.status(404).json({ error: 'لا توجد فروع نشطة للتوجيه' }); return; }
  const route: EnterpriseOperationsV11State['ai_smart_routes_v16'][number] = {
    id: `route-${Date.now()}`, created_at: new Date().toISOString(), customer_name: String(customer_name || 'عميل'),
    governorate: String(governorate || pick.branch.governorate), district: String(district || 'غير محدد'),
    customer_lat: Number.isFinite(Number(customer_lat)) ? Number(customer_lat) : undefined,
    customer_lng: Number.isFinite(Number(customer_lng)) ? Number(customer_lng) : undefined,
    prescribed_product: String(prescribed_product), doctor_approval_reference: doctor_approval_reference ? String(doctor_approval_reference) : undefined,
    branch_id: pick.branch.id, branch_name: pick.branch.branch_name, company_name: pick.branch.company_name,
    distance_km: Number(pick.distance.toFixed(1)), stock_available: pick.stock, eta_minutes: Math.max(20, Math.round(pick.distance * 3)),
    routing_reason: pick.stock > 0 ? 'أقرب فرع نشط مع مخزون متاح بعد تطبيق ضوابط الاعتماد.' : 'أقرب فرع نشط، لكن المخزون يحتاج تأكيد أو تحويل داخلي.',
    status: 'suggested'
  };
  enterpriseV11 = { ...enterpriseV11, ai_smart_routes_v16: [route, ...enterpriseV11.ai_smart_routes_v16] };
  persistEnterpriseState('ai_smart_routing_v16', 'v16_route_created');
  res.status(201).json(route);
});

app.post('/api/v16/communications/queue', (req: Request, res: Response) => {
  const body = req.body || {};
  const msg: EnterpriseOperationsV11State['communication_queue_v16'][number] = {
    id: `comm-${Date.now()}`, created_at: new Date().toISOString(), channel: body.channel || 'whatsapp',
    recipient_name: String(body.recipient_name || 'مستلم'), recipient_phone: body.recipient_phone ? String(body.recipient_phone) : undefined,
    audience_group: body.audience_group ? String(body.audience_group) : undefined, template_key: String(body.template_key || 'custom'),
    subject: String(body.subject || 'رسالة المنصة'), body: String(body.body || ''), attachment_url: body.attachment_url ? String(body.attachment_url) : undefined,
    related_reference: body.related_reference ? String(body.related_reference) : undefined, priority: body.priority || 'normal',
    status: enterpriseV11.whatsapp_hub_v16.connection_status === 'connected' ? 'queued' : 'simulation'
  };
  enterpriseV11 = { ...enterpriseV11, communication_queue_v16: [msg, ...enterpriseV11.communication_queue_v16] };
  persistEnterpriseState(String(req.header('X-User-Role') || 'communications'), 'v16_communication_queued');
  res.status(201).json(msg);
});

app.post('/api/v16/communications/send', async (req: Request, res: Response) => {
  const { message_id } = req.body || {};
  const msg = enterpriseV11.communication_queue_v16.find(x => x.id === message_id);
  if (!msg) { res.status(404).json({ error: 'الرسالة غير موجودة' }); return; }
  const apiUrl = process.env.WHATSAPP_API_URL;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (msg.channel !== 'whatsapp' || !apiUrl || !token || !msg.recipient_phone) {
    enterpriseV11 = { ...enterpriseV11, communication_queue_v16: enterpriseV11.communication_queue_v16.map(x => x.id === msg.id ? { ...x, status: 'simulation' } : x) };
    persistEnterpriseState('communications_v16', 'v16_whatsapp_simulation');
    res.json({ mode: 'simulation', message: { ...msg, status: 'simulation' }, note: 'WHATSAPP_API_URL/WHATSAPP_ACCESS_TOKEN غير مهيأة على الخادم.' });
    return;
  }
  try {
    const response = await fetch(apiUrl, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ messaging_product: 'whatsapp', to: msg.recipient_phone, type: 'text', text: { body: msg.body } })
    });
    if (!response.ok) throw new Error(`WhatsApp provider HTTP ${response.status}`);
    enterpriseV11 = { ...enterpriseV11, communication_queue_v16: enterpriseV11.communication_queue_v16.map(x => x.id === msg.id ? { ...x, status: 'sent', sent_at: new Date().toISOString() } : x) };
    persistEnterpriseState('communications_v16', 'v16_whatsapp_sent');
    res.json({ mode: 'backend_api', status: 'sent' });
  } catch (error: any) {
    enterpriseV11 = { ...enterpriseV11, communication_queue_v16: enterpriseV11.communication_queue_v16.map(x => x.id === msg.id ? { ...x, status: 'failed' } : x) };
    persistEnterpriseState('communications_v16', 'v16_whatsapp_failed');
    res.status(502).json({ error: 'تعذر إرسال WhatsApp عبر المزود المهيأ', details: error.message });
  }
});

app.post('/api/v16/owner-alerts/:id/ack', (req: Request, res: Response) => {
  const { id } = req.params;
  let found = false;
  enterpriseV11 = { ...enterpriseV11, owner_change_alerts_v16: enterpriseV11.owner_change_alerts_v16.map(x => {
    if (x.id !== id) return x; found = true; return { ...x, acknowledged: true, acknowledged_at: new Date().toISOString() };
  }) };
  if (!found) { res.status(404).json({ error: 'التنبيه غير موجود' }); return; }
  persistEnterpriseState('system_owner', 'v16_owner_alert_ack');
  res.json({ ok: true });
});


// ----------------------------------------------------
// V17 Sequential Sales / Supplier Routing / Settlement / Leasing
// ----------------------------------------------------
app.get('/api/v17/operations', (req: Request, res: Response) => {
  res.json({
    config: enterpriseV11.v17_config,
    flock_sales: enterpriseV11.flock_sales_pipeline_v17,
    settlements: enterpriseV11.flock_sale_settlements_v17,
    supplier_orders: enterpriseV11.supplier_routing_orders_v17,
    routed_reports: enterpriseV11.routed_reports_v17,
    lease_listings: enterpriseV11.farm_lease_listings_v17,
    lease_contracts: enterpriseV11.lease_escrow_contracts_v17
  });
});

app.post('/api/v17/flock-sales', (req: Request, res: Response) => {
  const body = req.body || {};
  const required = ['customer_name','phone','farm_name','flock_code','governorate','birds_count','average_weight_kg','bourse_price_per_kg_yer'];
  const missing = required.filter(k => body[k] === undefined || body[k] === '');
  if (missing.length) { res.status(400).json({ error: 'بيانات ناقصة', missing }); return; }
  const queue = buildBrokerQueueV17(enterpriseV11.poultry_marketer_contracts_v12, String(body.governorate), enterpriseV11.v17_config.flock_sale_broker_timeout_minutes);
  const pipeline: EnterpriseOperationsV11State['flock_sales_pipeline_v17'][number] = {
    id:`flocksale-v17-${Date.now()}`,request_number:`FSALE-${Date.now().toString().slice(-8)}`,created_at:new Date().toISOString(),updated_at:new Date().toISOString(),
    customer_name:String(body.customer_name),phone:String(body.phone),farm_name:String(body.farm_name),flock_code:String(body.flock_code),governorate:String(body.governorate),district:String(body.district||'غير محدد'),address:String(body.address||''),
    lat:Number.isFinite(Number(body.lat))?Number(body.lat):undefined,lng:Number.isFinite(Number(body.lng))?Number(body.lng):undefined,birds_count:Number(body.birds_count),average_weight_kg:Number(body.average_weight_kg),estimated_live_weight_kg:Math.round(Number(body.birds_count)*Number(body.average_weight_kg)),weight_category:String(body.weight_category||'مختلط'),
    bourse_price_per_kg_yer:Number(body.bourse_price_per_kg_yer),bourse_reference:String(body.bourse_reference||'سعر معتمد من الإدارة'),customer_price_accepted:Boolean(body.customer_price_accepted ?? true),sales_manager_name:String(body.sales_manager_name||'مسؤول المبيعات المختص'),marketing_fee_mode:body.marketing_fee_mode||'fixed_per_kg',marketing_fee_value:Number(body.marketing_fee_value||0),platform_commission_percent:Number(body.platform_commission_percent ?? enterpriseV11.v17_config.default_platform_sale_commission_percent),broker_timeout_minutes:enterpriseV11.v17_config.flock_sale_broker_timeout_minutes,broker_queue:queue,current_broker_index:0,negotiation_attempts:0,customer_final_accepted:false,loading_evidence_urls:[],status:'sales_manager_review',sales_manager_phone:body.sales_manager_phone?String(body.sales_manager_phone):undefined,notes:String(body.notes||'')
  };
  enterpriseV11 = { ...enterpriseV11, flock_sales_pipeline_v17:[pipeline,...enterpriseV11.flock_sales_pipeline_v17] };
  persistEnterpriseState(String(req.header('X-User-Role')||'customer'), 'v17_flock_sale_created');
  res.status(201).json(pipeline);
});

app.post('/api/v17/flock-sales/:id/route-next', (req: Request, res: Response) => {
  const p = enterpriseV11.flock_sales_pipeline_v17.find(x=>x.id===req.params.id);
  if(!p){res.status(404).json({error:'طلب التسويق غير موجود'});return;}
  const updated = routeToNextBrokerV17(p, String(req.body?.reason||'انتهت المهلة أو تم الاعتذار'));
  enterpriseV11={...enterpriseV11,flock_sales_pipeline_v17:enterpriseV11.flock_sales_pipeline_v17.map(x=>x.id===p.id?updated:x)};
  persistEnterpriseState('sales_manager','v17_broker_failover'); res.json(updated);
});

app.post('/api/v17/flock-sales/:id/broker-response', (req: Request, res: Response) => {
  const p=enterpriseV11.flock_sales_pipeline_v17.find(x=>x.id===req.params.id); if(!p){res.status(404).json({error:'الطلب غير موجود'});return;}
  const idx=p.current_broker_index; const accepted=Boolean(req.body?.accepted);
  const queue=p.broker_queue.map((x,i)=>i===idx?{...x,status:(accepted?'accepted':'rejected') as any,responded_at:new Date().toISOString(),final_price_per_kg_yer:accepted?Number(req.body?.final_price_per_kg_yer||p.bourse_price_per_kg_yer):x.final_price_per_kg_yer,settlement_days:accepted?Number(req.body?.settlement_days??x.settlement_days??1):x.settlement_days,loading_at:accepted?String(req.body?.loading_at||new Date(Date.now()+8*3600_000).toISOString()):x.loading_at,rejection_reason:accepted?undefined:String(req.body?.reason||'اعتذر المكتب')}:x);
  let updated={...p,broker_queue:queue,status:(accepted?'broker_offer_ready':'routing_brokers') as any,updated_at:new Date().toISOString()};
  if(!accepted) updated=routeToNextBrokerV17(updated,String(req.body?.reason||'اعتذر المكتب'));
  enterpriseV11={...enterpriseV11,flock_sales_pipeline_v17:enterpriseV11.flock_sales_pipeline_v17.map(x=>x.id===p.id?updated:x)};persistEnterpriseState('sales_manager','v17_broker_response');res.json(updated);
});

app.post('/api/v17/flock-sales/:id/customer-decision', (req: Request, res: Response) => {
  const p=enterpriseV11.flock_sales_pipeline_v17.find(x=>x.id===req.params.id); if(!p){res.status(404).json({error:'الطلب غير موجود'});return;}
  const accept=Boolean(req.body?.accepted); const attempts=accept?p.negotiation_attempts:p.negotiation_attempts+1;
  const status=accept?'confirmed':(attempts>enterpriseV11.v17_config.max_ai_negotiation_attempts?'human_sales_intervention':'customer_negotiation');
  const updated={...p,customer_final_accepted:accept,negotiation_attempts:attempts,status:status as any,updated_at:new Date().toISOString()};
  enterpriseV11={...enterpriseV11,flock_sales_pipeline_v17:enterpriseV11.flock_sales_pipeline_v17.map(x=>x.id===p.id?updated:x)};persistEnterpriseState('customer','v17_customer_sale_decision');res.json(updated);
});

app.post('/api/v17/flock-sales/:id/settlement', (req: Request, res: Response) => {
  const p=enterpriseV11.flock_sales_pipeline_v17.find(x=>x.id===req.params.id); if(!p){res.status(404).json({error:'الطلب غير موجود'});return;}
  if(!p.customer_final_accepted){res.status(409).json({error:'لا يمكن إنشاء التسوية قبل موافقة العميل النهائية'});return;}
  const accepted=p.broker_queue.find(x=>x.status==='accepted'); if(!accepted?.final_price_per_kg_yer){res.status(409).json({error:'لا يوجد مكتب مقبول بسعر نهائي'});return;}
  const lines=(Array.isArray(req.body?.invoice_lines)&&req.body.invoice_lines.length?req.body.invoice_lines:[{id:`w-${Date.now()}`,size_class:'mixed',birds_count:p.birds_count,total_weight_kg:p.estimated_live_weight_kg,price_per_kg_yer:accepted.final_price_per_kg_yer,line_total_yer:Math.round(p.estimated_live_weight_kg*accepted.final_price_per_kg_yer)}]).map((x:any)=>({...x,line_total_yer:Number(x.line_total_yer ?? Number(x.total_weight_kg)*Number(x.price_per_kg_yer))}));
  const settlement=calculateFlockSettlementV17(p,lines,Number(req.body?.debt_deduction_yer||0),Number(req.body?.other_deductions_yer||0));
  enterpriseV11={...enterpriseV11,flock_sale_settlements_v17:[settlement,...enterpriseV11.flock_sale_settlements_v17],flock_sales_pipeline_v17:enterpriseV11.flock_sales_pipeline_v17.map(x=>x.id===p.id?{...x,settlement_id:settlement.id,status:'awaiting_broker_payment',updated_at:new Date().toISOString()}:x)};persistEnterpriseState('finance','v17_settlement_created');res.status(201).json(settlement);
});

app.post('/api/v17/settlements/:id/verify-broker-payment', (req: Request, res: Response) => {
  const s=enterpriseV11.flock_sale_settlements_v17.find(x=>x.id===req.params.id);if(!s){res.status(404).json({error:'التسوية غير موجودة'});return;}
  const now=new Date().toISOString(); const updated={...s,status:'settlement_ready' as const,broker_payment_reference:String(req.body?.reference||s.broker_payment_reference||`BR-${Date.now()}`),broker_payment_proof_url:req.body?.proof_url?String(req.body.proof_url):s.broker_payment_proof_url,broker_payment_verified_by:String(req.body?.verified_by||'الإدارة المالية'),broker_payment_verified_at:now};
  enterpriseV11={...enterpriseV11,flock_sale_settlements_v17:enterpriseV11.flock_sale_settlements_v17.map(x=>x.id===s.id?updated:x),flock_sales_pipeline_v17:enterpriseV11.flock_sales_pipeline_v17.map(p=>p.settlement_id===s.id?{...p,status:'finance_settlement',updated_at:now}:p)};persistEnterpriseState('finance','v17_broker_payment_verified');res.json(updated);
});

app.post('/api/v17/settlements/:id/pay-customer', (req: Request, res: Response) => {
  const s=enterpriseV11.flock_sale_settlements_v17.find(x=>x.id===req.params.id);if(!s){res.status(404).json({error:'التسوية غير موجودة'});return;}
  if(enterpriseV11.v17_config.require_finance_verification_before_customer_payout && !s.broker_payment_verified_at){res.status(409).json({error:'ممنوع تحويل مستحق العميل قبل تحقق المالية من وصول مبلغ مكتب التسويق'});return;}
  const now=new Date().toISOString();const updated={...s,status:'closed' as const,customer_transfer_reference:String(req.body?.reference||`CUST-${Date.now()}`),customer_transfer_proof_url:req.body?.proof_url?String(req.body.proof_url):s.customer_transfer_proof_url,customer_transfer_at:now};
  enterpriseV11={...enterpriseV11,flock_sale_settlements_v17:enterpriseV11.flock_sale_settlements_v17.map(x=>x.id===s.id?updated:x),flock_sales_pipeline_v17:enterpriseV11.flock_sales_pipeline_v17.map(p=>p.settlement_id===s.id?{...p,status:'completed',updated_at:now}:p)};persistEnterpriseState('finance','v17_customer_payout');res.json(updated);
});

app.post('/api/v17/supplier-orders', (req: Request, res: Response) => {
  const b=req.body||{}; const category=b.category as EnterpriseOperationsV11State['supplier_routing_orders_v17'][number]['category'];
  if(!category||!b.product_name||!b.customer_name){res.status(400).json({error:'category/product_name/customer_name مطلوبة'});return;}
  const restricted=category==='antibiotic'; if(restricted&&!b.doctor_approval_reference){res.status(409).json({error:'طلب المضاد يحتاج مرجع موافقة الطبيب قبل التوجيه للمورد'});return;}
  const q=buildSupplierQueueV17(enterpriseV11.partner_trade_contracts_v12,category,String(b.governorate||''),enterpriseV11.v17_config.supplier_timeout_minutes);
  const order:EnterpriseOperationsV11State['supplier_routing_orders_v17'][number]={id:`sup-v17-${Date.now()}`,order_number:`SUP-${Date.now().toString().slice(-8)}`,created_at:new Date().toISOString(),customer_name:String(b.customer_name),phone:String(b.phone||''),governorate:String(b.governorate||''),district:String(b.district||''),address:String(b.address||''),category,product_name:String(b.product_name),product_id:b.product_id?String(b.product_id):undefined,quantity:Number(b.quantity||1),unit_label:String(b.unit_label||'وحدة'),official_price_yer:Number(b.official_price_yer||0),transport_fee_yer:Number(b.transport_fee_yer||0),customer_accepted_total:Boolean(b.customer_accepted_total),doctor_approval_reference:b.doctor_approval_reference?String(b.doctor_approval_reference):undefined,requires_doctor_approval:restricted,supplier_timeout_minutes:enterpriseV11.v17_config.supplier_timeout_minutes,supplier_queue:q,current_supplier_index:0,platform_commission_percent:Number(b.platform_commission_percent||3),payment_status:'not_ready',supplier_settlement_status:'not_due',status:'sales_review'};
  enterpriseV11={...enterpriseV11,supplier_routing_orders_v17:[order,...enterpriseV11.supplier_routing_orders_v17]};persistEnterpriseState('sales','v17_supplier_order_created');res.status(201).json(order);
});


app.post('/api/v17/supplier-orders/:id/route-next', (req: Request, res: Response) => {
  const order=enterpriseV11.supplier_routing_orders_v17.find(x=>x.id===req.params.id);if(!order){res.status(404).json({error:'طلب المورد غير موجود'});return;}
  const updated=routeToNextSupplierV17(order,String(req.body?.reason||'انتهت المهلة أو المورد اعتذر'));
  enterpriseV11={...enterpriseV11,supplier_routing_orders_v17:enterpriseV11.supplier_routing_orders_v17.map(x=>x.id===order.id?updated:x)};persistEnterpriseState('sales','v17_supplier_failover');res.json(updated);
});

app.post('/api/v17/supplier-orders/:id/supplier-response', (req: Request, res: Response) => {
  const order=enterpriseV11.supplier_routing_orders_v17.find(x=>x.id===req.params.id);if(!order){res.status(404).json({error:'طلب المورد غير موجود'});return;}
  const idx=order.current_supplier_index;const accepted=Boolean(req.body?.accepted);
  const q=order.supplier_queue.map((x,i)=>i===idx?{...x,status:(accepted?'accepted':'rejected') as any,confirmed_quantity:accepted?Number(req.body?.confirmed_quantity||order.quantity):x.confirmed_quantity,confirmed_unit_price_yer:accepted?Number(req.body?.confirmed_unit_price_yer||order.official_price_yer):x.confirmed_unit_price_yer,eta_hours:accepted?Number(req.body?.eta_hours||6):x.eta_hours,rejection_reason:accepted?undefined:String(req.body?.reason||'المورد اعتذر')}:x);
  let updated={...order,supplier_queue:q,status:(accepted?'supplier_confirmed':'routing_suppliers') as any,payment_status:(accepted?'awaiting_customer':order.payment_status) as any};
  if(!accepted) updated=routeToNextSupplierV17(updated,String(req.body?.reason||'المورد اعتذر'));
  enterpriseV11={...enterpriseV11,supplier_routing_orders_v17:enterpriseV11.supplier_routing_orders_v17.map(x=>x.id===order.id?updated:x)};persistEnterpriseState('sales','v17_supplier_response');res.json(updated);
});

app.post('/api/v17/supplier-orders/:id/customer-payment-proof', (req: Request, res: Response) => {
  const order=enterpriseV11.supplier_routing_orders_v17.find(x=>x.id===req.params.id);if(!order){res.status(404).json({error:'طلب المورد غير موجود'});return;}
  const updated={...order,payment_status:'proof_uploaded' as const,customer_payment_reference:String(req.body?.reference||`PAY-${Date.now()}`),customer_payment_proof_url:req.body?.proof_url?String(req.body.proof_url):order.customer_payment_proof_url,status:'awaiting_payment' as const};
  enterpriseV11={...enterpriseV11,supplier_routing_orders_v17:enterpriseV11.supplier_routing_orders_v17.map(x=>x.id===order.id?updated:x)};persistEnterpriseState('customer','v17_customer_payment_proof');res.json(updated);
});

app.post('/api/v17/supplier-orders/:id/verify-payment', (req: Request, res: Response) => {
  const order=enterpriseV11.supplier_routing_orders_v17.find(x=>x.id===req.params.id);if(!order){res.status(404).json({error:'طلب المورد غير موجود'});return;}
  if(order.payment_status!=='proof_uploaded' && order.payment_status!=='awaiting_customer'){res.status(409).json({error:'لا يوجد إثبات دفع جاهز للتحقق'});return;}
  const updated={...order,payment_status:'verified' as const,finance_verified_by:String(req.body?.verified_by||'الإدارة المالية'),finance_verified_at:new Date().toISOString(),invoice_number:order.invoice_number||`INV-V17-${Date.now().toString().slice(-8)}`,lot_numbers:Array.isArray(req.body?.lot_numbers)?req.body.lot_numbers.map(String):order.lot_numbers,supplier_settlement_status:'pending' as const,status:'preparing' as const};
  enterpriseV11={...enterpriseV11,supplier_routing_orders_v17:enterpriseV11.supplier_routing_orders_v17.map(x=>x.id===order.id?updated:x)};persistEnterpriseState('finance','v17_customer_payment_verified');res.json(updated);
});

app.post('/api/v17/supplier-orders/:id/pay-supplier', (req: Request, res: Response) => {
  const order=enterpriseV11.supplier_routing_orders_v17.find(x=>x.id===req.params.id);if(!order){res.status(404).json({error:'طلب المورد غير موجود'});return;}
  if(order.payment_status!=='verified'){res.status(409).json({error:'ممنوع تحويل مستحق المورد قبل تحقق المالية من مبلغ العميل'});return;}
  const updated={...order,supplier_settlement_status:'paid' as const,supplier_payment_reference:String(req.body?.reference||`SUPPAY-${Date.now()}`),supplier_payment_proof_url:req.body?.proof_url?String(req.body.proof_url):order.supplier_payment_proof_url};
  enterpriseV11={...enterpriseV11,supplier_routing_orders_v17:enterpriseV11.supplier_routing_orders_v17.map(x=>x.id===order.id?updated:x)};persistEnterpriseState('finance','v17_supplier_paid');res.json(updated);
});

app.post('/api/v17/lease-listings', (req: Request, res: Response) => {
  const b=req.body||{};if(!b.owner_name||!b.owner_phone||!b.governorate){res.status(400).json({error:'بيانات المالك والمنطقة مطلوبة'});return;}
  let listing:EnterpriseOperationsV11State['farm_lease_listings_v17'][number]={id:`lease-${Date.now()}`,listing_number:`LEASE-${Date.now().toString().slice(-8)}`,created_at:new Date().toISOString(),owner_name:String(b.owner_name),owner_phone:String(b.owner_phone),governorate:String(b.governorate),district:String(b.district||''),address:String(b.address||''),lat:Number.isFinite(Number(b.lat))?Number(b.lat):undefined,lng:Number.isFinite(Number(b.lng))?Number(b.lng):undefined,hangars_count:Number(b.hangars_count||1),length_m:Number(b.length_m||0),width_m:Number(b.width_m||0),height_m:Number(b.height_m||0),ventilation_type:b.ventilation_type||'open',target_density_birds_m2:Number(b.target_density_birds_m2||12),estimated_capacity_birds:0,equipment_items:Array.isArray(b.equipment_items)?b.equipment_items.map(String):[],equipment_gaps:Array.isArray(b.equipment_gaps)?b.equipment_gaps.map(String):[],image_urls:Array.isArray(b.image_urls)?b.image_urls.map(String):[],video_urls:Array.isArray(b.video_urls)?b.video_urls.map(String):[],media_quality_status:(Array.isArray(b.image_urls)&&b.image_urls.length>=3?'needs_review':'missing') as any,rent_mode:b.rent_mode||'per_cycle',asking_price_yer:Number(b.asking_price_yer||0),advance_payment_percent:Number(b.advance_payment_percent||30),platform_commission_percent:Number(b.platform_commission_percent||enterpriseV11.v17_config.default_lease_commission_percent),platform_commission_yer:0,admin_review_status:'pending_review',published:false,contact_released:false,ai_assessment_note:'السعة والحالة تقدير أولي. اعتماد الصور والمعدات والسعة مسؤولية الإدارة/المختص.'};
  listing=recalcLeaseListingV17(listing,enterpriseV11.v17_config.default_lease_commission_percent);
  enterpriseV11={...enterpriseV11,farm_lease_listings_v17:[listing,...enterpriseV11.farm_lease_listings_v17]};persistEnterpriseState('customer','v17_lease_listing_created');res.status(201).json(listing);
});

app.post('/api/v17/lease-listings/:id/contract', (req: Request, res: Response) => {
  const l=enterpriseV11.farm_lease_listings_v17.find(x=>x.id===req.params.id);if(!l){res.status(404).json({error:'عرض الإيجار غير موجود'});return;}
  if(l.admin_review_status!=='approved'){res.status(409).json({error:'يجب اعتماد العرض من الإدارة قبل إنشاء العقد'});return;}
  const first=Math.round(l.asking_price_yer*l.advance_payment_percent/100);
  const contract:EnterpriseOperationsV11State['lease_escrow_contracts_v17'][number]={id:`lec-${Date.now()}`,contract_number:`LEC-${Date.now().toString().slice(-8)}`,listing_id:l.id,lessor_name:l.owner_name,lessee_name:String(req.body?.lessee_name||'مستأجر بانتظار الإدخال'),start_date:String(req.body?.start_date||new Date().toISOString().slice(0,10)),end_date:String(req.body?.end_date||''),rent_value_yer:l.asking_price_yer,platform_commission_yer:l.platform_commission_yer,collection_method:req.body?.collection_method||'first_payment_escrow',first_payment_yer:first,platform_received_yer:0,owner_net_yer:Math.max(0,first-l.platform_commission_yer),penalty_clause_summary:String(req.body?.penalty_clause_summary||'الشروط الجزائية تحتاج مراجعة قانونية واعتماد الأطراف.'),legal_review_status:'required',lessor_signed:false,lessee_signed:false,platform_signed:false,contact_release_allowed:false,status:'awaiting_signatures'};
  enterpriseV11={...enterpriseV11,lease_escrow_contracts_v17:[contract,...enterpriseV11.lease_escrow_contracts_v17]};persistEnterpriseState('admin','v17_lease_contract_created');res.status(201).json(contract);
});


app.post('/api/v17/whatsapp/inbound', (req: Request, res: Response) => {
  const b=req.body||{}; const phone=String(b.from||b.phone||''); const text=String(b.text||b.message||'').trim();
  if(!phone||!text){res.status(400).json({error:'رقم المرسل والنص مطلوبان'});return;}
  const lower=text.toLowerCase();
  const saleIntent=/بيع|تسويق|ابيع|أبيع|قطيع|دجاج/.test(lower);
  const purchaseIntent=/شراء|علف|كتاكيت|معدات|لقاح|علاج/.test(lower);
  const existing=enterpriseV11.ai_conversations.find(x=>x.phone===phone&&x.status!=='completed');
  const missing=saleIntent?['الاسم','المزرعة','المحافظة','المديرية','العنوان','عدد الطيور','متوسط الوزن']:purchaseIntent?['الاسم','المحافظة','المديرية','العنوان','الصنف','الكمية']:['الاسم','هدف الرسالة'];
  const session:EnterpriseOperationsV11State['ai_conversations'][number]={
    id:existing?.id||`wa-session-${Date.now()}`,customer_name:String(b.customer_name||existing?.customer_name||'عميل واتساب'),phone,
    intent:saleIntent?'flock_sale':purchaseIntent?'purchase':'general',current_step:missing[0],collected_fields:existing?.collected_fields||[],missing_fields:missing,last_message:text,status:'waiting_customer',updated_at:new Date().toISOString()
  };
  const reply=saleIntent
    ? 'مرحباً. سأجهز طلب تسويق القطيع خطوة بخطوة. أرسل: الاسم، اسم المزرعة، المحافظة/المديرية، الموقع، عدد الطيور، ومتوسط الوزن. بعد اكتمال البيانات سأعرض سعر البورصة المعتمد ثم أحول الطلب لمسؤول المبيعات.'
    : purchaseIntent
      ? 'مرحباً. أرسل اسمك، المنطقة، الصنف المطلوب والكمية. سأعرض السعر المعتمد وأجرة المنطقة ثم أحول الطلب لمسؤول المبيعات/المورد المناسب. المضادات الحيوية تحتاج اعتماد الطبيب قبل الاستخدام والتوريد.'
      : 'مرحباً بك. اذكر هدفك أو استفسارك وسأوجهه للقسم المناسب.';
  const msg:EnterpriseOperationsV11State['communication_queue_v16'][number]={id:`comm-${Date.now()}`,created_at:new Date().toISOString(),channel:'whatsapp',recipient_name:session.customer_name,recipient_phone:phone,template_key:'v17_inbound_reply',subject:'متابعة آلية',body:reply,priority:'normal',status:enterpriseV11.whatsapp_hub_v16.connection_status==='connected'?'queued':'simulation'};
  enterpriseV11={...enterpriseV11,ai_conversations:existing?enterpriseV11.ai_conversations.map(x=>x.id===existing.id?session:x):[session,...enterpriseV11.ai_conversations],communication_queue_v16:[msg,...enterpriseV11.communication_queue_v16]};
  persistEnterpriseState('whatsapp_v17','v17_whatsapp_inbound');
  res.status(201).json({session,reply,message_mode:msg.status});
});

app.post('/api/v17/reports/route', (req: Request, res: Response) => {
  const {category,governorate,reference,summary}=req.body||{}; const rule=enterpriseV11.report_routing_rules_v17.find(r=>r.active&&r.category===category&&(r.governorate===governorate||r.governorate==='ALL'));
  if(!rule){res.status(404).json({error:'لا توجد قاعدة توجيه مطابقة'});return;}
  const report:EnterpriseOperationsV11State['routed_reports_v17'][number]={id:`route-report-${Date.now()}`,created_at:new Date().toISOString(),category,governorate:String(governorate||''),reference:String(reference||''),summary:String(summary||''),assigned_to:rule.primary_staff_name,assigned_role:rule.primary_role,channels:[...(rule.app_notification?['app' as const]:[]),...(rule.whatsapp_notification?['whatsapp' as const]:[])],status:'queued'};
  enterpriseV11={...enterpriseV11,routed_reports_v17:[report,...enterpriseV11.routed_reports_v17]};persistEnterpriseState('routing_engine','v17_report_routed');res.status(201).json(report);
});

app.post('/api/v17/lease-listings/:id/approve', (req: Request, res: Response) => {
  const l=enterpriseV11.farm_lease_listings_v17.find(x=>x.id===req.params.id);if(!l){res.status(404).json({error:'العرض غير موجود'});return;}
  const updated=recalcLeaseListingV17({...l,admin_review_status:'approved',published:true},enterpriseV11.v17_config.default_lease_commission_percent);
  enterpriseV11={...enterpriseV11,farm_lease_listings_v17:enterpriseV11.farm_lease_listings_v17.map(x=>x.id===l.id?updated:x)};persistEnterpriseState('admin','v17_lease_approved');res.json(updated);
});

// ----------------------------------------------------
// AI Services (Gemini 3.8 Flash)
// ----------------------------------------------------

/**
 * 1. AI-Guided Necropsy Engine
 * Analyzes organ observations (Liver, Intestine, Bursa, Trachea, Droppings)
 */
app.post('/api/ai/necropsy', async (req: Request, res: Response) => {
  try {
    const { observations, bird_age_days, flock_context, breed } = req.body;
    const language = /[\u0600-\u06ff]/.test(text) ? 'ar' : 'en';
    const deterministicSizing = answerPoultrySizingQuestionR81(text, language);
    const ai = getGeminiClient();

    if (!ai && deterministicSizing) {
      res.json({ reply: deterministicSizing.reply, requires_vet_escalation: false, intent: 'poultry_advice', suggested_actions: ['Register/confirm the house equipment type and actual capacities.', 'Use the approved breed/region feed curve for exact daily feed and water.', 'Record indoor temperature/humidity and local weather for brooding validation.'], deterministic_calculation: deterministicSizing.result, provenance: ['Poultry Equations PDF pp. 12–13, 17', 'AviNexus R8.1 deterministic calculator'] });
      return;
    }

    if (!ai) {
      // Fallback mock diagnostics if key is not configured
      res.json({
        primary_disease: 'اشتباه إصابة بميكوبلازما تنفسية مترافقة مع التهاب معوي (CRD + Enteritis)',
        confidence_score: 84,
        differential_diagnoses: [
          { disease: 'ميكوبلازما تنفسية (Mycoplasma gallisepticum)', probability: 84 },
          { disease: 'التهاب الأمعاء النخري (Necrotic Enteritis)', probability: 62 },
          { disease: 'التهاب الشعب الهوائية المعدي (IB)', probability: 41 }
        ],
        pathological_findings: [
          'احتقان ومخاط في مجرى القصبة الهوائية.',
          'سماكة في جدار الأمعاء المتوسطة مع تجمعات غازية.',
          'كيس بورسيا سليم نسبياً مما يستبعد الجمبورو الحاد.'
        ],
        recommended_lab_tests: [
          'فحص حساسية بكتيرية لعزلات الأمعاء والقصبة.',
          'فحص سيرولوجي لتترات الأجسام المضادة.'
        ],
        emergency_level: 'متوسط'
      });
      return;
    }

    const observationsSummary = observations
      .map((obs: any) => `- ${obs.organ_name_ar}: الحالة (${obs.status})، الآفات: ${obs.lesion_description}`)
      .join('\n');

    const prompt = `أنت محرك الذكاء الاصطناعي التشريحي المتقدم لمنظومة "المنصة الوطنية للسيادة البيطرية والداجنة الذكية" في اليمن، بإشراف وتوجيهات الاستشاري الطبيب البيطري الاستشاري المعتمد.
قم بتحليل الصفة التشريحية للعينات الطازجة بالبيانات التالية:
- عمر الطيور: ${bird_age_days} يوماً
- السلالة: ${breed || 'Ross 308'}
- معلومات إضافية عن القطيع: ${flock_context || 'عنبر دواجن لاحم تجاري'}
- نتائج فحص الأعضاء الـ 5 الحيوية:
${observationsSummary}

أجب بتنسيق JSON حصراً بالمخطط التالي:
{
  "primary_disease": "الاسم العلمي والطبي الدقيق للمرض الأكثر احتمالاً باللغة العربية مع المصطلح الإنجليزي",
  "confidence_score": 88,
  "differential_diagnoses": [
    { "disease": "مرض محتمل 1", "probability": 88 },
    { "disease": "مرض محتمل 2", "probability": 55 },
    { "disease": "مرض محتمل 3", "probability": 30 }
  ],
  "pathological_findings": [
    "ملاحظة نسيجية وتشريحية هامة 1",
    "ملاحظة 2",
    "ملاحظة 3"
  ],
  "recommended_lab_tests": [
    "فحص مخبري مقترح 1",
    "فحص حساسية بكتيرية مستهدف"
  ],
  "emergency_level": "منخفض" | "متوسط" | "مرتفع" | "حرج (طارئ)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Necropsy AI error:', err);
    res.status(500).json({
      error: 'فشل في استجابة محرك التشريح الذكي',
      details: err.message
    });
  }
});

/**
 * 2. Acoustic AI Sound Analysis
 * Analyzes audio frequency, snicking, coughing, and nocturnal respiratory distress
 */
app.post('/api/ai/acoustic', async (req: Request, res: Response) => {
  try {
    const { snick_count, sneeze_count, duration_seconds, time_of_recording, ambient_notes } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const distress = Math.min(100, Math.round((snick_count * 2.5 + sneeze_count * 3) * (30 / duration_seconds)));
      res.json({
        respiratory_distress_index: distress,
        severity: distress > 70 ? 'ضائقة حادة' : distress > 35 ? 'انحراف مبكر' : 'طبيعي',
        ai_assessment: `رصد ${snick_count} صوت شخير و ${sneeze_count} عطسة خلال ${duration_seconds} ثانية. مؤشر الضائقة يوضح بداية تهيج القصبة الهوائية.`,
        recommended_actions: [
          'فحص سرعة الهواء والتهوية الدنيا في العنبر.',
          'التحقق من جفاف الفرشة ومستوى غاز الأمونيا.',
          'أخذ عينات للتشريح الموجه في حال استمرار التصاعد الليلي.'
        ]
      });
      return;
    }

    const prompt = `أنت خبير الاستشعار الصوتي وتحليل ترددات أصوات الدواجن (Acoustic Audio Frequency Analysis) في "المنصة الوطنية للسيادة البيطرية والداجنة الذكية" في اليمن تحت إشراف الطبيب البيطري الاستشاري المعتمد.
حلل المقطع الصوتي المسجل (المدة: ${duration_seconds} ثانية):
- توقيت التسجيل: ${time_of_recording || 'تسجيل ليلي أثناء سكون القطيع'}
- عدد أصوات الشخير والرالز المرصودة (Snicks/Rales): ${snick_count}
- عدد العطسات (Sneezes): ${sneeze_count}
- ملاحظات المربي: ${ambient_notes || 'لا توجد'}

أجب بصيغة JSON حصراً:
{
  "respiratory_distress_index": 72,
  "severity": "طبيعي" | "انحراف مبكر" | "ضائقة حادة",
  "ai_assessment": "شرح بيطري دقيق وواضح لنمط الأصوات وتوقيتها وتأثيرها على الأداء التنفسي واستهلاك العلف",
  "recommended_actions": [
    "إجراء تدبير بيئي أو تهوية محدد",
    "توصية وقائية بدون صرف أدوية عشوائية"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Acoustic AI error:', err);
    res.status(500).json({
      error: 'فشل في التحليل الصوتي الذكي',
      details: err.message
    });
  }
});

/**
 * 3. Voice-to-Data Parsing (Voice Bridge)
 * Extracts structured numbers from colloquial Arabic / Yemeni farmer voice notes
 */
app.post('/api/ai/voice-log', async (req: Request, res: Response) => {
  try {
    const { voice_text } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Robust regex-based fallback if no API key
      const waterMatch = voice_text.match(/(?:ماء|الماء|لتر)\D*(\d+)/i);
      const feedMatch = voice_text.match(/(?:علف|العلف|كيلو|كجم)\D*(\d+)/i);
      const tempMatch = voice_text.match(/(?:حرارة|الحرارة|درجة)\D*(\d+(?:\.\d+)?)/i);
      const mortMatch = voice_text.match(/(?:نافق|النافق|موت|مات|طير)\D*(\d+)/i);

      res.json({
        water_consumption_liters: waterMatch ? parseInt(waterMatch[1]) : 3100,
        feed_consumption_kg: feedMatch ? parseInt(feedMatch[1]) : 1550,
        temp_celsius: tempMatch ? parseFloat(tempMatch[1]) : 26.5,
        humidity_percent: 55,
        mortality_count: mortMatch ? parseInt(mortMatch[1]) : 8,
        notes: voice_text,
        confidence: 85
      });
      return;
    }

    const prompt = `أنت مساعد الإدخال الصوتي الذكي لمربي الدواجن في اليمن ضمن "المنصة الوطنية للسيادة البيطرية والداجنة الذكية".
قام المربي بتسجيل هذه الملاحظة الصوتية اليومية (باللهجة اليمنية أو العربية الدارجة):
"${voice_text}"

استخرج الأرقام التشغيلية بدقة متناهية وحولها إلى كائن JSON وفق الحقول التالية:
- water_consumption_liters: استهلاك الماء باللتر (رقم صحيح)
- feed_consumption_kg: استهلاك العلف بالكيلوجرام (رقم)
- temp_celsius: درجة الحرارة المئوية (رقم)
- humidity_percent: نسبة الرطوبة المئوية إن ذُكرت (رقم) وإلا ضع 55
- mortality_count: عدد الطيور النافقة اليوم (رقم صحيح)
- notes: تلخيص موجز ومهني للملاحظة السلوكية أو الصحية المذكورة
- confidence: نسبة الثقة في الاستخراج من 100

أجب بصيغة JSON حصراً.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Voice Log AI error:', err);
    res.status(500).json({
      error: 'فشل في تحويل الصوت إلى بيانات',
      details: err.message
    });
  }
});


// ----------------------------------------------------
// V13 Managed Farm Client Portal (development adapter)
// ----------------------------------------------------
app.get('/api/v13/client-portal', (req: Request, res: Response) => {
  const phone = String(req.query.phone || '');
  const contract = enterpriseV11.farm_management_contracts_v13.find((c) => c.status === 'active' && (!phone || c.phone === phone));
  if (!contract) {
    res.status(404).json({ error: 'لا يوجد عقد إدارة نشط مطابق.' });
    return;
  }
  res.json({
    contract,
    reports: enterpriseV11.daily_executive_reports_v13.filter((r) => r.contract_id === contract.id).slice(0, 30),
    activity: enterpriseV11.farm_activity_stream_v13.filter((a) => a.contract_id === contract.id).slice(0, 100),
    approvals: enterpriseV11.expense_approvals_v13.filter((a) => a.contract_id === contract.id),
    settlement: enterpriseV11.profit_sharing_settlements_v13.find((x) => x.contract_id === contract.id),
    production_note: 'هذا endpoint تطويري. الإنتاج يحتاج مصادقة حقيقية وعزل بيانات حسب هوية المستخدم.'
  });
});

/** Human-review referral. The AI cannot choose a veterinarian, prescribe or approve actions. */
app.post('/api/ai/clinical-referrals', requireAuthV2021(), (req: Request, res: Response) => {
  const farm_id = typeof req.body?.farm_id === 'string' ? req.body.farm_id.trim() : '';
  const flock_id = typeof req.body?.flock_id === 'string' ? req.body.flock_id.trim() : undefined;
  const summary = typeof req.body?.summary === 'string' ? req.body.summary.trim() : '';
  if (!farm_id || farm_id.length > 128 || (flock_id && flock_id.length > 128) || !summary || summary.length > 4000) {
    res.status(400).json({success:false,error:'invalid_referral'}); return;
  }
  if (!scopedOr403V2022(res, 'farm.read', {farm_id})) return;
  try {
    const created = createClinicalReferral(runtimeDataDir, {farm_id, flock_id, summary,
      symptoms: Array.isArray(req.body?.symptoms) ? req.body.symptoms : [], created_by:authClaimsV2021(res).sub});
    res.status(201).json({success:true,referral:created,handoff_created:true,review_required:true});
  } catch { res.status(500).json({success:false,error:'referral_persistence_failed'}); }
});

app.get('/api/ai/clinical-referrals', requireAuthV2021(), (req: Request, res: Response) => {
  const claims = authClaimsV2021(res);
  const farm_id = typeof req.query.farm_id === 'string' ? req.query.farm_id.trim() : '';
  if (!farm_id || farm_id.length > 128) { res.status(400).json({success:false,error:'farm_id_required'}); return; }
  if (!scopedOr403V2022(res, 'farm.read', {farm_id})) return;
  const all = listClinicalReferrals(runtimeDataDir).filter(x=>x.farm_id===farm_id);
  const clinicalRoles = new Set(['SYSTEM_OWNER','VETERINARIAN','VET','FARM_DOCTOR','FARM_MANAGER']);
  const visible = clinicalRoles.has(claims.role_code) ? all : all.filter(x=>x.created_by===claims.sub);
  res.json({success:true,referrals:visible});
});

/** Veterinarian review: a recorded human decision, never a prescription or release clearance. */
app.post('/api/ai/clinical-referrals/:id/reviews', requireAuthV2021(), (req: Request, res: Response) => {
  const claims = authClaimsV2021(res);
  const clinicalRoles = new Set(['SYSTEM_OWNER', 'VETERINARIAN', 'VET', 'FARM_DOCTOR']);
  if (!clinicalRoles.has(claims.role_code)) { res.status(403).json({success:false,error:'vet_role_required'}); return; }
  const referral = listClinicalReferrals(runtimeDataDir).find(x => x.id === req.params.id);
  if (!referral) { res.status(404).json({success:false,error:'referral_not_found'}); return; }
  if (!scopedOr403V2022(res, 'farm.read', {farm_id:referral.farm_id})) return;
  const decision = req.body?.decision;
  const note = req.body?.note;
  if (!['acknowledged','needs_information','reviewed'].includes(decision) || typeof note !== 'string' || note.length > 4000) {
    res.status(400).json({success:false,error:'invalid_review'}); return;
  }
  try {
    const review = appendClinicalReview(runtimeDataDir, {referral_id:referral.id, farm_id:referral.farm_id,
      reviewer_id:claims.sub, decision, note});
    res.status(201).json({success:true,review,clinical_approval_created:false});
  } catch { res.status(500).json({success:false,error:'review_persistence_failed'}); }
});

app.get('/api/ai/clinical-referrals/:id/reviews', requireAuthV2021(), (req: Request, res: Response) => {
  const claims = authClaimsV2021(res);
  const referral = listClinicalReferrals(runtimeDataDir).find(x => x.id === req.params.id);
  if (!referral) { res.status(404).json({success:false,error:'referral_not_found'}); return; }
  if (!scopedOr403V2022(res, 'farm.read', {farm_id:referral.farm_id})) return;
  const clinicalRoles = new Set(['SYSTEM_OWNER','VETERINARIAN','VET','FARM_DOCTOR','FARM_MANAGER']);
  if (!clinicalRoles.has(claims.role_code) && referral.created_by !== claims.sub) {
    res.status(403).json({success:false,error:'review_access_denied'}); return;
  }
  res.json({success:true,reviews:listClinicalReviews(runtimeDataDir, referral.id)});
});

/** Deny AI-triggered operational actions before they reach any business handler. */
app.post('/api/ai/action', requireAuthV2021(), (req: Request, res: Response) => {
  const action = typeof req.body?.action === 'string' ? req.body.action : '';
  const verdict = authorizeAIAction(action);
  if (!verdict.allowed) {
    res.status(403).json({ success: false, error: verdict.reason, action, executed: false });
    return;
  }
  // This endpoint intentionally does not perform a write. Advisory work must be
  // submitted through the separately authorized, scoped human workflow.
  res.json({ success: true, action, executed: false, requires_workflow_submission: true });
});

/**
 * 4. V12 Poultry Business & Veterinary Advisor
 * Poultry-specialized Q&A + ethical sales support + customer education.
 * Medical decisions remain human-in-the-loop.
 */
app.post('/api/ai/advisor', async (req: Request, res: Response) => {
  try {
    const { message } = req.body || {}; // Public advisor: never trust or forward caller-supplied private account/flock context.
    const text = String(message || '').trim();
    if (!text) {
      res.status(400).json({ error: 'الرسالة مطلوبة' });
      return;
    }

    const lower = text.toLowerCase();
    const clinicalSignal = /نافق|نفوق|يموت|مرض|اسهال|إسهال|تنفس|شخر|عطس|كوكس|نيوكاسل|جمبورو|بكتير|مضاد|علاج/.test(lower);
    const purchaseSignal = /شراء|سعر|خصم|علف|لقاح|معدات|كتاكيت|اشراف|إشراف|نزول|تسويق/.test(lower);
    const activePartners = enterpriseV11.partner_trade_contracts_v12.filter(c => c.status === 'active' && c.customer_visible);
    const publishedMarketing = enterpriseV11.poultry_marketing_rates_v12.filter(r => r.published);
    const activeLabs = enterpriseV11.laboratory_partner_contracts_v12.filter(l => l.status === 'active' && l.customer_visible);
    const activeLabTests = enterpriseV11.laboratory_test_prices_v12.filter(t => t.active);
    const ai = getGeminiClient();

    if (!ai) {
      let reply = 'أنا مستشار متخصص بالدواجن: أساعدك في التحضين، العلف والماء، التهوية، الأمان الحيوي، التحصينات، التسويق واختيار الخدمة أو الصنف المناسب. ';
      if (clinicalSignal) {
        reply += 'بما أن سؤالك يتضمن جانباً مرضياً، يرجى فتح حالة بيطرية عبر المسار الموثق لإرفاق بيانات القطيع والصور والصوت وإحالتها للطبيب؛ هذه المحادثة لا تنشئ إحالة تلقائية. لا أوصي بمضاد حيوي عشوائياً ولا أعتبر شراءه إذناً باستخدامه.';
      } else if (purchaseSignal) {
        reply += `يوجد حالياً ${activePartners.length} عقد شريك ظاهر للعملاء. يمكنني شرح العروض المنشورة؛ تأكيد السعر والتوصيل يتطلب طلباً عبر مسار المبيعات، وأعرض البدائل حسب احتياج القطيع بدلاً من البيع لمجرد البيع.`;
      } else {
        reply += 'أعطني عمر القطيع وعدده والمنطقة وهدفك أو المشكلة الحالية، وسأحوّل السؤال إلى خطوات عملية وأرقام يمكن متابعتها.';
      }
      res.json({ reply, requires_vet_escalation: clinicalSignal, handoff_created: false, ai_mode: 'local_fallback', intent: clinicalSignal ? 'clinical' : purchaseSignal ? 'sales' : 'poultry_advice', suggested_actions: clinicalSignal ? ['فتح ملف حالة', 'جمع البيانات اليومية', 'مراجعة الطبيب'] : ['تحديد الاحتياج', 'عرض الخيارات', 'مقارنة التكلفة والقيمة'] });
      return;
    }

    const partnerSummary = activePartners.slice(0, 8).map(c => `${c.partner_name}: ${c.business_type}, خصم عميل ${c.customer_discount_percent}%, تسوية ${c.settlement_days} يوم`).join('\n') || 'لا توجد عروض شريك منشورة حالياً.';
    const marketingSummary = publishedMarketing.slice(0, 8).map(r => `${r.governorate}/${r.district}: ${r.buy_price_per_kg_yer} ر.ي/كجم، سداد ${r.settlement_days} يوم، ${r.mortality_terms}`).join('\n') || 'لا توجد أسعار تسويق منشورة.';
    const labSummary = activeLabs.slice(0, 5).map(l => {
      const tests = activeLabTests.filter(t => t.lab_contract_id === l.id).slice(0, 5).map(t => `${t.test_name}: ${t.customer_price_yer} ر.ي (${t.turnaround_hours}س)`).join('، ');
      return `${l.laboratory_name} - ${l.governorate}/${l.district} - خصم ${l.default_discount_percent}%${tests ? ` - الفحوص: ${tests}` : ''}`;
    }).join('\n') || 'لا توجد مختبرات متعاقدة منشورة.';
    const config = enterpriseV11.ai_advisor_v12;
    const managementContext = enterpriseV11.farm_management_contracts_v13.filter(c => c.status === 'active').slice(0, 5).map(c => `${c.farm_name}: ${c.management_mode === 'full_management' ? 'إدارة شاملة' : 'إدارة ذاتية'}، ${c.flock_size} طائر، تقرير يومي ${c.daily_report_time}`).join('\n') || 'لا توجد عقود إدارة نشطة مرتبطة بالسياق.';
    const forecastContext = enterpriseV11.predictive_forecasts_v13.slice(0, 5).map(f => `${f.flock_code}: عمر ${f.age_days} يوم، وزن حالي ${f.current_average_weight_grams} جم، بيع مقترح ${f.recommended_sale_date}، ثقة ${f.confidence_percent}%`).join('\n') || 'لا توجد توقعات حالية.';
    const earlySignals = enterpriseV11.early_disease_signals_v13.filter(x => x.status !== 'closed').slice(0, 5).map(x => `${x.flock_code}: خطورة ${x.risk_level} - ${x.trigger_summary}`).join('\n') || 'لا توجد إشارات مبكرة مفتوحة.';
    const supplyContext = enterpriseV11.auto_reorder_rules_v13.filter(x => x.enabled && x.current_stock <= x.reorder_level).slice(0, 5).map(x => `${x.item_name}: متاح ${x.current_stock} ${x.unit}، حد الطلب ${x.reorder_level}، مورد ${x.preferred_supplier}`).join('\n') || 'لا توجد نواقص مخزون حرجة مسجلة.';
    const fieldContext = (enterpriseV11.field_doctor_visits_v14 || []).filter(v => v.status !== 'closed').slice(0, 5).map(v => `${v.visit_number}: ${v.farm_name}، عمر ${v.age_days} يوم، نافق ${v.mortality_today}، حرارة ${v.temperature_celsius}، رطوبة ${v.humidity_percent}، ${v.necropsy_observations.length} صور تشريح`).join('\n') || 'لا توجد زيارات ميدانية V14 مفتوحة.';
    const escalationContext = (enterpriseV11.case_escalations_v14 || []).filter(x => !['closed','decision_sent'].includes(x.status)).slice(0, 5).map(x => `${x.priority}: ${x.reason} → ${x.assigned_senior_vet}`).join('\n') || 'لا توجد تصعيدات استشارية مفتوحة.';
    const customer360Context = (enterpriseV11.customer_360_v16 || []).slice(0, 5).map(c => `${c.customer_name}: ${c.customer_tier}, ${c.governorate}/${c.district}, دين ${c.outstanding_debt_yer} ر.ي، تفضيلات ${c.preferred_categories.join('/')}, الطبيب ${c.assigned_vet || '-'}, المندوب ${c.assigned_sales_rep || '-'}`).join('\n') || 'لا توجد ملفات Customer 360.';
    const regionalPricingContext = (enterpriseV11.regional_pricing_rules_v16 || []).filter(r => r.published).slice(0, 10).map(r => `${r.product_name} - ${r.governorate} - ${r.customer_tier}: ${r.net_price_yer} ر.ي بعد خصم ${r.discount_percent}%`).join('\n') || 'لا توجد قواعد أسعار إقليمية منشورة.';
    const vendorBranchContext = (enterpriseV11.vendor_branches_v16 || []).filter(b => b.active && b.customer_visible).slice(0, 10).map(b => `${b.company_name}/${b.branch_name}: ${b.governorate}/${b.district}`).join('\n') || 'لا توجد فروع شركات منشورة.';
    const crmContext = (enterpriseV11.crm_opportunities_v16 || []).filter(o => !['won','lost'].includes(o.stage)).slice(0, 5).map(o => `${o.customer_name}: ${o.title}, مرحلة ${o.stage}, التالي ${o.next_action}`).join('\n') || 'لا توجد فرص CRM مفتوحة.';
    const v17SalesContext = (enterpriseV11.flock_sales_pipeline_v17 || []).filter(x => !['completed','cancelled'].includes(x.status)).slice(0, 5).map(x => {
      const offer = x.broker_queue.find(b => b.status === 'accepted');
      return `${x.request_number}: ${x.customer_name}, ${x.birds_count} طائر @ ${x.average_weight_kg}كجم، بورصة ${x.bourse_price_per_kg_yer}، الحالة ${x.status}${offer ? `، عرض مكتب ${offer.final_price_per_kg_yer} ر.ي/كجم، سداد ${offer.settlement_days} يوم` : ''}`;
    }).join('\n') || 'لا توجد صفقات تسويق V17 مفتوحة.';
    const v17SupplierContext = (enterpriseV11.supplier_routing_orders_v17 || []).filter(x => !['delivered','cancelled'].includes(x.status)).slice(0, 5).map(x => `${x.order_number}: ${x.product_name} × ${x.quantity} ${x.unit_label}، ${x.governorate}، الحالة ${x.status}`).join('\n') || 'لا توجد طلبات توريد V17 مفتوحة.';
    const v17SupplementContext = (enterpriseV11.approved_supplement_protocols_v17 || []).filter(x => x.active).slice(0, 10).map(x => `${x.name}: من عمر ${x.min_age_days}-${x.max_age_days} يوم، مناخ ${x.climate}، الجرعة المعتمدة: ${x.approved_dose_text}، الوقت: ${x.administration_window}`).join('\n') || 'لا توجد بروتوكولات دعم غذائي معتمدة.';
    const v18LabContext = (enterpriseV11.sample_tracking_v18 || []).filter(x => !['closed'].includes(x.status)).slice(0,5).map(x => `${x.tracking_number}: ${x.farm_name}، طبيب ${x.assigned_vet_name}، حالة ${x.status}، فحوص ${x.requested_tests.join('/')}${x.final_decision ? `، القرار المعتمد ${x.final_decision}` : ''}`).join('\n') || 'لا توجد عينات V18 مفتوحة.';
    const v18StandardContext = (enterpriseV11.breed_regional_standards_v18 || []).filter(x=>x.active).slice(0,10).map(x=>`${x.strain}/${x.governorate} عمر ${x.min_age_days}-${x.max_age_days}: وزن ${x.target_weight_g}جم، علف ${x.daily_feed_g_per_bird}جم/طير، ماء ${x.daily_water_ml_per_bird}مل/طير، حرارة ${x.temperature_c}°C، علف ${x.feed_form}`).join('\n') || 'لا توجد معايير V18 نشطة.';
    const v18ChickContext = (enterpriseV11.hatchery_prices_v18 || []).filter(x=>x.published).slice(0,10).map(x=>`${x.hatchery_name}/${x.governorate}: ${x.strain} ${x.price_per_chick_yer} ر.ي، متاح ${x.available_quantity}`).join('\n') || 'لا توجد أسعار كتاكيت V18 منشورة.';
    const v18OutbreakContext = (enterpriseV11.geo_outbreak_alerts_v18 || []).filter(x=>x.status==='published').slice(0,5).map(x=>`${x.disease_name} - ${x.governorate}/${x.district} - نطاق ${x.radius_km}كم - ${x.lab_confirmed?'مؤكد':'اشتباه'}`).join('\n') || 'لا توجد تنبيهات وبائية جغرافية V18.';
    const v18FeedContext = (enterpriseV11.feed_replenishment_v18 || []).filter(x=>x.status==='reorder_now').slice(0,5).map(x=>`${x.farm_name}: المخزون ${x.current_stock_kg}كجم يكفي ${x.days_remaining} يوم، طلب مقترح ${x.recommended_order_kg}كجم`).join('\n') || 'لا توجد تنبيهات إعادة علف V18.';


    const prompt = `أنت المستشار الذكي الرئيسي لمنصة دواجن تجارية وبيطرية. أنت متخصص بقوة في الدواجن اللاحمة والبياض والأمهات، وتجمع بين الاستشارة التشغيلية، التوعية، ودعم البيع المهني بدون تضليل أو ضغط.

أهدافك:
${config.primary_objectives.map(x => `- ${x}`).join('\n')}

منهج البيع:
${config.sales_playbook.map(x => `- ${x}`).join('\n')}

ضوابط إلزامية:
${config.safety_guardrails.map(x => `- ${x}`).join('\n')}
- لا تهين العميل أو تصف ممارساته بالتخلف. صحح الممارسات التقليدية غير المبنية على البيانات باحترام وبالدليل.
- لا تعد العميل بضمان الربح أو عدم النفوق.
- لا تخترع سعراً أو خصماً أو مسؤولية نافق غير موجودة في بيانات الإدارة.
- المضاد الحيوي: اشرح مخاطر الاستخدام العشوائي (المقاومة، بقايا الدواء، إخفاء التشخيص، فشل السيطرة) ولا تصف جرعة نهائية ولا تسمح بالاستخدام دون الطبيب.
- في حالة مرضية اجمع البيانات وارفعها للطبيب؛ يمكنك إعطاء إجراءات أمان حيوي ودعم تشغيلي غير دوائي.
- عند البيع: افهم احتياج العميل أولاً، ثم اربط الصنف أو الخدمة بحجم القطيع والعمر والمرحلة والمنطقة، واذكر السعر/الخصم فقط إذا كان ضمن بيانات الإدارة.

السياق الحالي للعميل:
غير متاح في المحادثة العامة؛ يتطلب تسجيل الدخول والتفويض.

بيانات القطيع المتاحة:
غير متاح في المحادثة العامة؛ يتطلب تسجيل الدخول والتفويض.

العروض المتعاقدة المنشورة:
${partnerSummary}

أسعار وشروط تسويق الدواجن المنشورة:
${marketingSummary}

المختبرات المتعاقدة:
${labSummary}

عقود إدارة المزارع النشطة المتاحة للسياق:
محجوب في المحادثة العامة؛ لا تُعرض بيانات تشغيلية أو شخصية دون تفويض.

التوقعات التشغيلية المتاحة:
محجوب في المحادثة العامة؛ لا تُعرض بيانات تشغيلية أو شخصية دون تفويض.

إشارات الإنذار المبكر المفتوحة:
محجوب في المحادثة العامة؛ لا تُعرض بيانات تشغيلية أو شخصية دون تفويض.

مؤشرات إعادة الطلب والمخزون:
محجوب في المحادثة العامة؛ لا تُعرض بيانات تشغيلية أو شخصية دون تفويض.

الزيارات الميدانية المفتوحة V14:
محجوب في المحادثة العامة؛ لا تُعرض بيانات تشغيلية أو شخصية دون تفويض.

التصعيدات للاستشاريين:
محجوب في المحادثة العامة؛ لا تُعرض بيانات تشغيلية أو شخصية دون تفويض.

Customer 360:
محجوب في المحادثة العامة؛ لا تُعرض بيانات تشغيلية أو شخصية دون تفويض.

الأسعار الإقليمية المنشورة:
${regionalPricingContext}

شبكة فروع الشركات المتعاقدة:
${vendorBranchContext}

فرص CRM المفتوحة:
محجوب في المحادثة العامة؛ لا تُعرض بيانات تشغيلية أو شخصية دون تفويض.

صفقات تسويق القطيع V17:
محجوب في المحادثة العامة؛ لا تُعرض بيانات تشغيلية أو شخصية دون تفويض.

طلبات الموردين V17:
محجوب في المحادثة العامة؛ لا تُعرض بيانات تشغيلية أو شخصية دون تفويض.

بروتوكولات الفيتامينات/الدعم الغذائي المعتمدة من الطبيب:
${v17SupplementContext}

العينات وتتبع المختبر V18:
محجوب في المحادثة العامة؛ لا تُعرض بيانات تشغيلية أو شخصية دون تفويض.

معايير السلالة والمنطقة المعتمدة V18:
${v18StandardContext}

أسعار الكتاكيت المنشورة V18:
${v18ChickContext}

التنبيهات الوبائية الجغرافية V18:
${v18OutbreakContext}

تنبيهات نقص العلف V18:
محجوب في المحادثة العامة؛ لا تُعرض بيانات تشغيلية أو شخصية دون تفويض.

قواعد استشارية إضافية:
- عند وجود زيارة ميدانية، استخدم بيانات البيئة والصور والصوت كقرائن داعمة فقط ولا تعتبر أي تحليل آلي بديلاً للفحص السريري/المخبري.
- إذا كانت الحالة مصعّدة لاستشاري، أخبر العميل أن الملف لدى الطبيب المسؤول وقدم إرشادات أمان حيوي مؤقتة غير دوائية حتى يصدر القرار.
- في أسئلة التربية: اربط الإجابة بالعمر والسلالة والعدد والوزن والعلف والماء والحرارة والرطوبة والتهوية والفرشة كلما توفرت.
- في أسئلة الشراء: لا تدفع العميل للشراء بلا حاجة؛ اشرح القيمة والبدائل والتكلفة الإجمالية وأجرة المنطقة وزمن التوصيل.
- في عقود الإدارة: فرّق بين صلاحية العميل في الرقابة/الاعتماد وصلاحية الفريق في التشغيل اليومي.
- في التنبؤ: قدم الاحتمال والثقة والعوامل المستخدمة، ولا تعرض التنبؤ كضمان.
- في الاستهلاك غير الطبيعي: نبّه الطبيب مبكراً واجمع الأدلة قبل اقتراح أي علاج دوائي.
- هدف التوعية هو الانتقال من الممارسة العشوائية إلى الإدارة المبنية على القياس والفحص، دون إهانة العميل أو وصفه بأوصاف مهينة.
- استخدم ملف Customer 360 لتخصيص الرد وخدمة العميل، لكن لا تكشف الدين أو البيانات الحساسة إلا لصاحب الحساب/الدور المخول.
- عند وجود منتج معتمد من الطبيب أو برنامج وقائي، يمكنك ترشيح أقرب فرع متاح ومقارنة السعر/الخصم/زمن الوصول؛ لا تختَر مضاداً حيوياً مستقلاً.
- الحملات التجارية الصحية يجب أن تكون تعليمية وغير استغلالية، وأي ادعاء علاجي يبقى تحت مراجعة الطبيب.
- في بيع القطيع: اعرض فقط سعر البورصة أو عرض مكتب مسجل في V17. اشرح فترة السداد وموعد التحميل وشروط النافق كما هي، ولا تعد بضمان السداد قبل تحقق المالية.
- إذا رفض العميل عرض مكتب التسويق، يسمح لك بشرح الفائدة والشروط بحد أقصى عدد المحاولات المحدد إدارياً؛ بعد ذلك تحول الحالة لمسؤول المبيعات البشري.
- لا تكشف رقم مكتب التسويق أو المؤجر/المستأجر إذا كانت سياسة V17 تمنع التواصل قبل العقد.
- في شراء المدخلات: لا تخترع مورداً أو سعراً. استخدم الطلبات والعقود المنشورة، وانتقل للمورد التالي عند الاعتذار أو انتهاء المهلة.
- الفيتامينات والإلكتروليتات: لا تبتكر جرعة. اعرض فقط نص الجرعة والتوقيت من بروتوكول V17 المعتمد من الطبيب/الشركة، وإلا اجمع البيانات وحوّل للطبيب أو المختص.
- لا تعتبر الدفع مكتملًا ولا تعد بتحويل صافي البيع للعميل قبل اعتماد المالية لوصول مبلغ مكتب التسويق إلى حساب المنصة.
- V18: عند الإجابة عن العلف/الماء/الحرارة/الوزن استخدم فقط معيار السلالة والمنطقة والعمر النشط من الإدارة. إذا لم يوجد معيار مطابق، قل ذلك ولا تخترع رقماً.
- V18: نتيجة المختبر لا تُرسل كقرار نهائي للعميل قبل توقيع الطبيب المسند. يمكن تلخيص النتيجة للطبيب فقط.
- V18: حجز الكتاكيت يحتاج تقييم جاهزية المزرعة، وموافقة المبيعات، ثم 100% سداد أو ضمانة معتمدة من المالية قبل الإطلاق.
- V18: تنبيه الوباء الجغرافي وقائي؛ فرّق بوضوح بين الاشتباه والحالة المؤكدة مخبرياً.
- V18: توقعات السوق أداة تخطيط وليست ضماناً للسعر أو الربح.
- V18: Credit/Quality Score يفسر عوامل الجودة والالتزام ولا يستخدم وحده لاتخاذ قرار ائتماني عالي الأثر دون مراجعة بشرية.

حساب AviNexus الحتمي إذا كان السؤال عن المساحة/المعالف/المساقي/التجهيزات:
${deterministicSizing ? JSON.stringify(deterministicSizing.result) : 'لا يوجد حساب حتمي مستخرج من السؤال.'}

سؤال العميل:
${text}

أجب بالعربية الواضحة وبأسلوب مهني مقنع. إذا كان السؤال يحتاج معلومات إضافية، اطلب أقل عدد ضروري من الأسئلة وبترتيب عملي. اجعل الرد مفيداً للتشغيل والقرار، وليس دعاية فارغة.
أجب JSON حصراً:
{
  "reply": "الرد الكامل للعميل",
  "requires_vet_escalation": true,
  "intent": "sales|clinical|poultry_advice|marketing|lab|supervision|finance",
  "suggested_actions": ["خطوة 1", "خطوة 2"]
}`;

    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const response = await Promise.race([
      ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('AI advisor timeout after 8 seconds')), 8000))
    ]);
    const parsed = JSON.parse(response.text || '{}');
    res.json({
      reply: guardAIAdvisorReply(parsed.reply),
      requires_vet_escalation: Boolean(parsed.requires_vet_escalation), handoff_created: false, ai_mode: 'gemini',
      intent: parsed.intent || 'poultry_advice',
      suggested_actions: Array.isArray(parsed.suggested_actions) ? parsed.suggested_actions : []
    });
  } catch (err: any) {
    console.error('V12 advisor error:', err);
    res.status(500).json({ error: 'تعذر تشغيل المستشار الذكي المتخصص', details: err.message });
  }
});


// ----------------------------------------------------
// V18 Laboratory / Chick Booking / Standards / Scoring / TeleVet
// ----------------------------------------------------
app.get('/api/v18/command-center', (req: Request, res: Response) => {
  res.json({
    config: enterpriseV11.v18_config,
    assigned_vets: enterpriseV11.assigned_vet_farms_v18,
    samples: enterpriseV11.sample_tracking_v18,
    hatchery_prices: enterpriseV11.hatchery_prices_v18,
    chick_reservations: enterpriseV11.chick_reservations_v18,
    standards: enterpriseV11.breed_regional_standards_v18,
    outbreak_alerts: enterpriseV11.geo_outbreak_alerts_v18,
    market_forecasts: enterpriseV11.market_forecasts_v18,
    scores: enterpriseV11.credit_quality_scores_v18,
    integrator_contracts: enterpriseV11.integrator_contracts_v18,
    televet: enterpriseV11.televet_sessions_v18,
    feed_replenishment: enterpriseV11.feed_replenishment_v18
  });
});

app.post('/api/v18/lab-samples', (req: Request, res: Response) => {
  const b=req.body||{};
  const assigned=enterpriseV11.assigned_vet_farms_v18.find(x=>x.active&&(x.farm_id===b.farm_id||x.customer_phone===b.phone));
  if(!assigned){res.status(409).json({error:'لا يوجد طبيب مسند لهذا الحساب/المزرعة. يجب الإسناد أولاً لمنع تداخل الحالات.'});return;}
  const lab=enterpriseV11.laboratory_partner_contracts_v12.find(x=>x.status==='active'&&(x.governorate===assigned.governorate||!x.governorate));
  const sample:EnterpriseOperationsV11State['sample_tracking_v18'][number]={
    id:`sample-v18-${Date.now()}`,tracking_number:`LAB-TRACK-${Date.now().toString().slice(-9)}`,case_id:String(b.case_id||`CASE-${Date.now().toString().slice(-8)}`),farm_id:assigned.farm_id,farm_name:assigned.farm_name,customer_name:assigned.customer_name,customer_phone:assigned.customer_phone,assigned_vet_id:assigned.vet_id,assigned_vet_name:assigned.vet_name,assigned_vet_phone:assigned.vet_phone,laboratory_id:String(b.laboratory_id||lab?.id||'pending'),laboratory_name:String(b.laboratory_name||lab?.laboratory_name||'بانتظار اختيار مختبر'),symptoms_summary:String(b.symptoms_summary||''),bird_age_days:Number(b.bird_age_days||0),vaccination_history:Array.isArray(b.vaccination_history)?b.vaccination_history.map(String):[],field_notes:String(b.field_notes||''),preliminary_ai_summary:'ملخص أولي للمعلومات فقط. لا يمثل تشخيصاً نهائياً.',test_reason:String(b.test_reason||'تأكيد التشخيص التفريقي قبل القرار الطبي'),sample_type:String(b.sample_type||'يحدده الطبيب'),requested_tests:Array.isArray(b.requested_tests)?b.requested_tests.map(String):[],fresh_dead_birds_requested:Number(b.fresh_dead_birds_requested||0)||undefined,preservation_instructions:String(b.preservation_instructions||'يتبع العميل تعليمات الطبيب والمختبر للحفظ والنقل.'),estimated_result_at:b.estimated_result_at?String(b.estimated_result_at):undefined,status:'awaiting_vet_approval',chain_of_custody:['إنشاء طلب فحص وربطه بالطبيب المسند']
  };
  enterpriseV11={...enterpriseV11,sample_tracking_v18:[sample,...enterpriseV11.sample_tracking_v18]};persistEnterpriseState('clinical_v18','v18_lab_sample_created');res.status(201).json(sample);
});

app.post('/api/v18/lab-samples/:id/vet-sign', (req: Request, res: Response) => {
  const x=enterpriseV11.sample_tracking_v18.find(s=>s.id===req.params.id);if(!x){res.status(404).json({error:'العينة غير موجودة'});return;}
  const finalDecision=String(req.body?.final_decision||'') as any;
  const allowed=['سليم','برنامج علاج','برنامج تحصين','خطر','أمر إعدام','بيع اضطراري'];
  if(!allowed.includes(finalDecision)){res.status(400).json({error:'القرار النهائي غير صالح'});return;}
  const updated={...x,lab_result_summary:String(req.body?.lab_result_summary||x.lab_result_summary||''),ai_result_summary:String(req.body?.ai_result_summary||x.ai_result_summary||'تم تلخيص النتيجة للمراجعة الطبية.'),vet_signed_by:x.assigned_vet_name,vet_signed_at:new Date().toISOString(),final_decision:finalDecision,status:'awaiting_vet_signature' as const,chain_of_custody:[...x.chain_of_custody,'توقيع واعتماد الطبيب للنتيجة النهائية']};
  enterpriseV11={...enterpriseV11,sample_tracking_v18:enterpriseV11.sample_tracking_v18.map(s=>s.id===x.id?updated:s)};persistEnterpriseState('assigned_vet','v18_lab_signed');res.json(updated);
});

app.post('/api/v18/lab-samples/:id/release', (req: Request, res: Response) => {
  const x=enterpriseV11.sample_tracking_v18.find(s=>s.id===req.params.id);if(!x){res.status(404).json({error:'العينة غير موجودة'});return;}
  if(enterpriseV11.v18_config.require_vet_signature_before_lab_release&&(!x.vet_signed_at||!x.final_decision)){res.status(409).json({error:'لا يمكن إصدار النتيجة للعميل قبل توقيع الطبيب المسند واعتماد القرار النهائي'});return;}
  const updated={...x,status:'released_to_customer' as const,customer_released_at:new Date().toISOString(),chain_of_custody:[...x.chain_of_custody,'إصدار التقرير المعتمد للعميل']};
  enterpriseV11={...enterpriseV11,sample_tracking_v18:enterpriseV11.sample_tracking_v18.map(s=>s.id===x.id?updated:s)};persistEnterpriseState('assigned_vet','v18_lab_released');res.json(updated);
});

app.post('/api/v18/chick-reservations', (req: Request, res: Response) => {
  const b=req.body||{}; const price=enterpriseV11.hatchery_prices_v18.find(x=>x.published&&x.governorate===b.governorate&&(!b.strain||x.strain===b.strain));
  if(!price){res.status(404).json({error:'لا يوجد سعر كتاكيت منشور لهذه المنطقة/السلالة. يحول الطلب للمبيعات للتسعير.'});return;}
  const qty=Number(b.quantity||0);if(qty<=0){res.status(400).json({error:'الكمية مطلوبة'});return;}
  let readiness=0;if(Boolean(b.farm_cleaned))readiness+=35;if(Boolean(b.biosecurity_closed))readiness+=35;readiness+=Math.min(30,Math.round(Number(b.downtime_days||0)/Math.max(1,Number(b.minimum_downtime_days||10))*30));readiness=Math.min(100,readiness);
  const status=readiness>=90?'ready':readiness>=65?'needs_review':'not_ready'; const base=qty*price.price_per_chick_yer; const transport=Number(b.transport_yer||0);
  const lab=Math.round(base*enterpriseV11.v18_config.chick_default_lab_reserve_percent/100),feed=Math.round(base*enterpriseV11.v18_config.chick_default_feed_reserve_percent/100),emg=Math.round(base*enterpriseV11.v18_config.chick_default_emergency_reserve_percent/100);
  const r:EnterpriseOperationsV11State['chick_reservations_v18'][number]={id:`cres18-${Date.now()}`,reservation_number:`CHICK-RES-${Date.now().toString().slice(-8)}`,created_at:new Date().toISOString(),customer_name:String(b.customer_name||''),phone:String(b.phone||''),farm_id:String(b.farm_id||''),farm_name:String(b.farm_name||''),governorate:String(b.governorate),district:String(b.district||''),address:String(b.address||''),lat:Number.isFinite(Number(b.lat))?Number(b.lat):undefined,lng:Number.isFinite(Number(b.lng))?Number(b.lng):undefined,hatchery_name:price.hatchery_name,strain:price.strain,quantity:qty,requested_delivery_date:String(b.requested_delivery_date||''),farm_cleaned:Boolean(b.farm_cleaned),biosecurity_closed:Boolean(b.biosecurity_closed),downtime_days:Number(b.downtime_days||0),minimum_downtime_days:Number(b.minimum_downtime_days||10),readiness_score:readiness,readiness_status:status as any,chick_cost_yer:base,transport_yer:transport,reserve_lab_yer:lab,reserve_feed_yer:feed,reserve_emergency_yer:emg,total_package_yer:base+transport+lab+feed+emg,customer_accepted:Boolean(b.customer_accepted),finance_status:'unpaid',sales_status:status==='ready'?'sales_review':'draft',notes:'لا يتم إطلاق الكتاكيت قبل تحقق المالية من السداد الكامل أو ضمانة معتمدة.'};
  enterpriseV11={...enterpriseV11,chick_reservations_v18:[r,...enterpriseV11.chick_reservations_v18]};persistEnterpriseState('customer','v18_chick_reservation');res.status(201).json(r);
});

app.post('/api/v18/chick-reservations/:id/finance-release', (req: Request, res: Response) => {
  const r=enterpriseV11.chick_reservations_v18.find(x=>x.id===req.params.id);if(!r){res.status(404).json({error:'الحجز غير موجود'});return;}
  const guarantee=Boolean(req.body?.guarantee_approved); const paid=Boolean(req.body?.paid_100_percent);
  if(enterpriseV11.v18_config.require_full_payment_or_finance_guarantee_before_release&&!paid&&!guarantee){res.status(409).json({error:'لا إطلاق قبل 100% سداد أو ضمانة/رهن معتمد من المالية'});return;}
  const updated={...r,finance_status:(paid?'verified':'guarantee_approved') as any,sales_status:'released' as const}; enterpriseV11={...enterpriseV11,chick_reservations_v18:enterpriseV11.chick_reservations_v18.map(x=>x.id===r.id?updated:x)};persistEnterpriseState('finance','v18_chick_release');res.json(updated);
});

app.post('/api/v18/televet', (req: Request, res: Response) => {
  if(!enterpriseV11.v18_config.tele_vet_enabled){res.status(409).json({error:'خدمة TeleVet متوقفة من الإدارة'});return;}
  const b=req.body||{}; const assigned=enterpriseV11.assigned_vet_farms_v18.find(x=>x.active&&x.farm_id===b.farm_id);
  if(!assigned){res.status(409).json({error:'لا يوجد طبيب مسند للمزرعة'});return;}
  const session:EnterpriseOperationsV11State['televet_sessions_v18'][number]={id:`tv18-${Date.now()}`,case_id:b.case_id?String(b.case_id):undefined,farm_id:assigned.farm_id,customer_name:assigned.customer_name,assigned_vet_name:assigned.vet_name,scheduled_at:String(b.scheduled_at||new Date(Date.now()+30*60000).toISOString()),channel:b.channel==='audio'?'audio':'video',provider:'webrtc',emergency:Boolean(b.emergency),status:'requested',notes:String(b.notes||'')}; enterpriseV11={...enterpriseV11,televet_sessions_v18:[session,...enterpriseV11.televet_sessions_v18]};persistEnterpriseState('customer','v18_televet_requested');res.status(201).json(session);
});

app.get('/api/v18/customer/:farmId', requireAuthV2021(), (req: Request, res: Response) => {
  if(!authorizedFarmIdsV2026(res).has(req.params.farmId)){res.status(403).json({success:false,error:'farm_scope_denied'});return;}
  const farmId=req.params.farmId; const assigned=enterpriseV11.assigned_vet_farms_v18.find(x=>x.farm_id===farmId&&x.active);
  res.json({assigned_vet:assigned,samples:enterpriseV11.sample_tracking_v18.filter(x=>x.farm_id===farmId),reservations:enterpriseV11.chick_reservations_v18.filter(x=>x.farm_id===farmId),performance:enterpriseV11.farm_performance_v18.filter(x=>x.farm_id===farmId),outbreak_alerts:enterpriseV11.geo_outbreak_alerts_v18.filter(x=>x.governorate===assigned?.governorate&&x.status==='published'),score:enterpriseV11.credit_quality_scores_v18.find(x=>x.entity_type==='farm'&&x.entity_id===farmId),contracts:enterpriseV11.integrator_contracts_v18.filter(x=>x.farm_id===farmId),televet:enterpriseV11.televet_sessions_v18.filter(x=>x.farm_id===farmId),feed_replenishment:enterpriseV11.feed_replenishment_v18.filter(x=>x.farm_id===farmId)});
});

// Dedicated role inbox: server-derived identity and assignment, never client-selected roles.
// This endpoint is read-only; clinical and financial mutations stay in their owning workflows.
app.get('/api/v20.2.9/role-workspace', requireAuthV2021(), (_req:Request,res:Response)=>{
  const claims=authClaimsV2021(res);
  const role=claims.role_code;
  const supported=new Set(['SYSTEM_OWNER','FIELD_VET','SPECIALIST_CONSULTANT','FARM_WORKER','FARM_OWNER','FARM_MANAGER']);
  if(!supported.has(role)){res.status(403).json({success:false,error:'role_workspace_not_available'});return;}
  const farmIds=authorizedFarmIdsV2026(res);
  const all=role==='SYSTEM_OWNER';
  const farmVisible=(farmId:string)=>farmIds.has(farmId);
  const field=enterpriseV11.veterinary_field_v20_2_2;
  const web=enterpriseV11.enterprise_web_v20_2;
  const visibleCases=field.medical_cases.filter(c=>farmVisible(c.farm_id)&&(
    all||role==='FARM_OWNER'||role==='FARM_MANAGER'||
    (role==='FIELD_VET'&&c.primary_vet_user_id===claims.sub)||
    (role==='SPECIALIST_CONSULTANT'&&c.consultant_user_ids.includes(claims.sub))));
  const visibleCaseIds=new Set(visibleCases.map(c=>c.id));
  const consultations=field.consultations.filter(c=>farmVisible(c.farm_id)&&(
    all||(role==='SPECIALIST_CONSULTANT'&&c.assigned_consultant_user_id===claims.sub)||
    (role==='FIELD_VET'&&c.requested_by_vet_user_id===claims.sub)||
    ((role==='FARM_OWNER'||role==='FARM_MANAGER')&&visibleCaseIds.has(c.case_id))));
  const tasks=web.role_tasks.filter(t=>{
    if(!t.farm_id||!farmVisible(t.farm_id))return false;
    if(all)return true;
    if(role==='FARM_WORKER')return t.assigned_user_id===claims.sub;
    if(role==='FIELD_VET')return t.assigned_user_id===claims.sub;
    if(role==='FARM_MANAGER')return true;
    return false;
  });
  const followups=field.followups.filter(f=>farmVisible(f.farm_id)&&(
    all||(role==='FIELD_VET'&&f.assigned_vet_user_id===claims.sub)||
    ((role==='FARM_MANAGER'||role==='FARM_OWNER')&&visibleCaseIds.has(f.case_id))));
  const closings=field.worker_daily_closings.filter(c=>farmVisible(c.farm_id)&&(
    all||role==='FARM_MANAGER'||role==='FARM_OWNER'||
    (role==='FARM_WORKER'&&c.worker_user_id===claims.sub)));
  res.setHeader('Cache-Control','private, no-store');
  res.json({success:true,role,user_id:claims.sub,
    farms:farms.filter(f=>farmVisible(f.id)).map(f=>({id:f.id,name:f.name})),
    tasks,medical_cases:role==='FARM_WORKER'?[]:visibleCases,
    consultations:role==='FARM_WORKER'?[]:consultations,
    followups:role==='FARM_WORKER'?[]:followups,
    daily_closings:role==='SPECIALIST_CONSULTANT'||role==='FIELD_VET'?[]:closings});
});

// Excel-compatible, scoped task export. CSV values are neutralized against formula injection.
app.get('/api/v20.2.9/role-workspace/tasks.csv',requireAuthV2021(),(_req:Request,res:Response)=>{
  const claims=authClaimsV2021(res);
  const permitted=new Set(['SYSTEM_OWNER','FARM_MANAGER','FARM_WORKER','FIELD_VET']);
  if(!permitted.has(claims.role_code)){res.status(403).json({success:false,error:'task_export_denied'});return;}
  const farmIds=authorizedFarmIdsV2026(res);
  const tasks=enterpriseV11.enterprise_web_v20_2.role_tasks.filter(t=>
    Boolean(t.farm_id)&&farmIds.has(t.farm_id)&&
    (claims.role_code==='SYSTEM_OWNER'||claims.role_code==='FARM_MANAGER'||t.assigned_user_id===claims.sub));
  const cell=(value:unknown)=>{
    let v=String(value??'').replace(/\r|\n/g,' ');
    if(/^[\s]*[=+\-@]/.test(v))v="'"+v;
    return '"'+v.replace(/"/g,'""')+'"';
  };
  const rows=[['task_id','farm_id','flock_id','assigned_user_id','status','title'],...tasks.map(t=>[
    t.id,t.farm_id,t.flock_id,t.assigned_user_id,t.status,(t as any).title??(t as any).description??''
  ])];
  res.setHeader('Cache-Control','private, no-store');
  res.setHeader('Content-Type','text/csv; charset=utf-8');
  res.setHeader('Content-Disposition','attachment; filename="assigned-farm-tasks.csv"');
  res.send('\uFEFF'+rows.map(row=>row.map(cell).join(',')).join('\r\n'));
});

// ----------------------------------------------------
// Vite Middleware / Static Files
// ----------------------------------------------------

app.use(
  '/api/office/:officeId/contacts',
  createOfficeContactsRouter({
    authenticate: requireAuthV2021(),
    authorizeOffice: (req, res, next) => {
      const officeId = String(req.params.officeId || '');
      const office = enterpriseV11.multi_business_v20_2_3.business_units.find(
        unit => unit.id === officeId && unit.type === 'office' && unit.status === 'active'
      );
      if (!office) {
        res.status(404).json({ success: false, error: 'office_not_found' });
        return;
      }
      const method = req.method.toUpperCase();
      const action = method === 'GET' ? 'read' : 'write';
      if (!businessOr403V2023(res, officeId, action)) return;
      next();
    },
    repository: mongoContactsRepository,
    audit: async event => {
      console.info('[Office360 Contact Audit]', {
        action: event.action, officeId: event.officeId, contactId: event.contactId,
        actor: authClaimsV2021(event.request.res!).sub, timestamp: new Date().toISOString()
      });
    }
  })
);


app.use(
  '/api/office/:officeId/items',
  createOfficeItemsRouter({
    authenticate: requireAuthV2021(),
    authorizeOffice: (req, res, next) => {
      const officeId = String(req.params.officeId || '');
      const office = enterpriseV11.multi_business_v20_2_3.business_units.find(unit => unit.id === officeId && unit.type === 'office' && unit.status === 'active');
      if (!office) { res.status(404).json({ success: false, error: 'office_not_found' }); return; }
      const mode = req.method.toUpperCase() === 'GET' ? 'read' : 'write';
      if (!businessOr403V2023(res, officeId, mode)) return;
      next();
    },
    repository: mongoItemsRepository
  })
);

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Poultry Platform server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
connectDB();
