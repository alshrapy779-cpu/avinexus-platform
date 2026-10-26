import React, { useState, useEffect } from 'react';
import { Header, AppView } from './components/Header';
import RegisterPage from './components/auth/RegisterPage';
import AdminRegistrationDashboard from './components/auth/AdminRegistrationDashboard';
import { FarmerApp } from './components/farmer/FarmerApp';
import { VetDashboard } from './components/vet/VetDashboard';
import { EconomicLossCalculator } from './components/calculator/EconomicLossCalculator';
import { DigitalPassportView } from './components/passport/DigitalPassportView';
import { DetailedSRSViewer } from './components/srs/DetailedSRSViewer';
import { MarketplaceView } from './components/marketplace/MarketplaceView';
import { WorkerManagementView } from './components/workers/WorkerManagementView';
import { VaccineProtocolView } from './components/vaccination/VaccineProtocolView';
import { AdminFinancialDashboard } from './components/admin/AdminFinancialDashboard';
import { AIVeterinaryGuidanceModal } from './components/ai/AIVeterinaryGuidanceModal';
import { HomeDashboard } from './components/home/HomeDashboard';
import { WelcomeExperience } from './components/home/WelcomeExperience';
import { NavigationTrail } from './components/navigation/NavigationTrail';
import { AppSettingsDrawer, DEFAULT_UI_SETTINGS_V194, loadUISettingsV194, AppUISettingsV194 } from './components/settings/AppSettingsDrawer';
import { CustomerOnboardingModal } from './components/customer/CustomerOnboardingModal';
import { FinancialCommandCenterV196 } from './components/admin/v196/FinancialCommandCenterV196';
import { FieldChatWorkspaceV195 } from './components/chat/FieldChatWorkspaceV195';
import { AccountSwitcherV195 } from './components/auth/AccountSwitcherV195';
import { EnterpriseLoginV2027 } from './components/auth/EnterpriseLoginV20_2_7';
import type { EnterpriseAuthSessionV2027 } from './services/apiService';
import { allowedViewsForRoleV195, permissionsForRoleV195, withAuditV195 } from './modules/platform/PlatformCoreV19_5';
import { buildEnterpriseCoreV196 } from './modules/enterprise/EnterpriseCoreV19_6';
import { buildManagedPoultryOperationsV197 } from './modules/managed/ManagedPoultryOperationsV19_7';
import { ManagedOperationsWorkspaceV197 } from './components/managed/ManagedOperationsWorkspaceV197';
import { buildV20State } from './modules/v20/EnterprisePoultryCoreV20';
import { buildEnterpriseWebStateV202 } from './modules/v20/EnterpriseWebPlatformV20_2';
import { buildEnterpriseFoundationV2021 } from './modules/v20/EnterpriseFoundationV20_2_1';
import { buildVeterinaryFieldStateV2022 } from './modules/v20/VeterinaryFieldOperationsV20_2_2';
import { buildMultiBusinessEnterpriseStateV2023 } from './modules/v20/MultiBusinessEnterpriseV20_2_3';
import { buildFeedFactoryOperationsStateV2024 } from './modules/v20/FeedFactoryOperationsV20_2_4';
import { buildWorkforcePayrollStateV2025 } from './modules/v20/WorkforcePayrollManagedBusinessV20_2_5';
import { buildExecutiveIntelligenceStateV2026 } from './modules/v20/ExecutiveIntelligenceBusinessControlV20_2_6';
import { buildWindowsCompletionStateV2027 } from './modules/v20/WindowsCompletionControlClosureV20_2_7';
import { buildFarmDivisionStateV2029 } from './modules/v20/FarmDivisionCompletionV20_2_9';
import { buildOperationalReadinessR81 } from './modules/v20/OperationalReadinessR8_1';
import { EnterpriseWebWorkspaceV202 } from './components/v20/EnterpriseWebWorkspaceV20_2';
import { CustomerRegistrationAdminPanel } from './components/customer/CustomerRegistrationAdminPanel';
import { CustomerRegistrationV194, findDuplicateRegistrationV194 } from './modules/customer/CustomerLifecycleV19_4';
import { apiService } from './services/apiService';
import { offlineDatabaseV15 } from './services/offlineDatabaseV15';
import {
  Farm,
  Flock,
  DailyLog,
  NecropsyCase,
  Prescription,
  LabSensitivityResult,
  AcousticAnalysisSession,
  VeterinaryMedicine,
  FeedItem,
  FarmEquipment,
  HangarRental,
  WorkerProfile,
  VaccineProtocolItem,
  PlatformFinancialConfig,
  PartnerCompany,
  SystemUserAccount,
  GovernancePolicy,
  SmartOperationsState,
  PoultryDailyPrice,
  PoultrySaleRequest,
  StaffMember,
  EmergencyFieldRequest,
  ClinicalTriageCase,
  SupervisionServiceRequest
} from './types';
import {
  INITIAL_FARMS,
  INITIAL_FLOCKS,
  INITIAL_DAILY_LOGS,
  INITIAL_NECROPSY_CASES,
  INITIAL_PRESCRIPTIONS,
  INITIAL_LAB_REPORTS,
  INITIAL_ACOUSTIC_SESSIONS,
  INITIAL_OUTBREAKS
} from './data/initialData';
import {
  INITIAL_VET_MEDICINES,
  INITIAL_FEEDS,
  INITIAL_EQUIPMENT,
  INITIAL_HANGAR_RENTALS,
  INITIAL_WORKERS,
  INITIAL_VACCINE_PROTOCOLS,
  INITIAL_FINANCIAL_CONFIG,
  INITIAL_COMPANIES,
  INITIAL_SYSTEM_USERS,
  INITIAL_POLICIES,
  INITIAL_STAFF_MEMBERS,
  INITIAL_POULTRY_PRICES,
  INITIAL_POULTRY_SALE_REQUESTS
} from './data/marketData';
import { INITIAL_SMART_OPERATIONS } from './data/operationalData';
import { ShieldCheck, Heart } from 'lucide-react';
import { EpidemiologicalOutbreak } from './types';

const normalizeEnterpriseV19 = (enterprise: any) => {
  const base = INITIAL_SMART_OPERATIONS.enterprise;
  const incoming = enterprise || {};
  const incomingV19 = incoming.sovereignty_v19 || {};
  const incomingCore195 = incoming.platform_core_v19_5 || {};
  const core195 = {
    ...base.platform_core_v19_5,
    ...incomingCore195,
    users: incomingCore195.users || base.platform_core_v19_5.users,
    staff: incomingCore195.staff || base.platform_core_v19_5.staff,
    suppliers: incomingCore195.suppliers || base.platform_core_v19_5.suppliers,
    supplier_branches: incomingCore195.supplier_branches || base.platform_core_v19_5.supplier_branches,
    catalog: incomingCore195.catalog || base.platform_core_v19_5.catalog,
    inventory_lots: incomingCore195.inventory_lots || base.platform_core_v19_5.inventory_lots,
    master_data: { ...base.platform_core_v19_5.master_data, ...(incomingCore195.master_data || {}) },
    settings: { ...base.platform_core_v19_5.settings, ...(incomingCore195.settings || {}) }
  };
  const activeUser = core195.users.find((u:any) => u.id === core195.active_user_id);
  if (!activeUser || /تجريبي|demo/i.test(activeUser.name || '')) core195.active_user_id = 'usr-owner';
  return {
    ...base,
    ...incoming,
    sovereignty_v19: {
      ...base.sovereignty_v19,
      ...incomingV19,
      governorates: incomingV19.governorates || base.sovereignty_v19.governorates,
      market_offices: incomingV19.market_offices || base.sovereignty_v19.market_offices,
      warehouses: incomingV19.warehouses || base.sovereignty_v19.warehouses,
      warehouse_contracts: incomingV19.warehouse_contracts || base.sovereignty_v19.warehouse_contracts
    },
    platform_core_v19_5: core195,
    enterprise_core_v19_6: buildEnterpriseCoreV196(core195, incoming.enterprise_core_v19_6 || base.enterprise_core_v19_6),
    managed_operations_v19_7: buildManagedPoultryOperationsV197(
      core195,
      buildEnterpriseCoreV196(core195, incoming.enterprise_core_v19_6 || base.enterprise_core_v19_6),
      incoming.managed_operations_v19_7 || base.managed_operations_v19_7
    ),
    v20_core: buildV20State(incoming.v20_core || base.v20_core),
    enterprise_web_v20_2: buildEnterpriseWebStateV202(incoming.enterprise_web_v20_2 || base.enterprise_web_v20_2, (incoming.enterprise_web_v20_2?.environment || base.enterprise_web_v20_2?.environment || 'DEVELOPMENT')),
    enterprise_foundation_v20_2_1: buildEnterpriseFoundationV2021(incoming.enterprise_foundation_v20_2_1 || base.enterprise_foundation_v20_2_1),
    veterinary_field_v20_2_2: buildVeterinaryFieldStateV2022(incoming.veterinary_field_v20_2_2 || base.veterinary_field_v20_2_2),
    multi_business_v20_2_3: buildMultiBusinessEnterpriseStateV2023(incoming.multi_business_v20_2_3 || base.multi_business_v20_2_3),
    feed_factory_v20_2_4: buildFeedFactoryOperationsStateV2024(incoming.feed_factory_v20_2_4 || base.feed_factory_v20_2_4),
    workforce_payroll_v20_2_5: buildWorkforcePayrollStateV2025(incoming.workforce_payroll_v20_2_5 || base.workforce_payroll_v20_2_5),
    executive_intelligence_v20_2_6: buildExecutiveIntelligenceStateV2026(incoming.executive_intelligence_v20_2_6 || base.executive_intelligence_v20_2_6),
    windows_completion_v20_2_7: buildWindowsCompletionStateV2027(incoming.windows_completion_v20_2_7 || base.windows_completion_v20_2_7),
    farm_division_v20_2_9: buildFarmDivisionStateV2029(incoming.farm_division_v20_2_9 || base.farm_division_v20_2_9)
    ,operational_readiness_r8_1: buildOperationalReadinessR81(incoming.operational_readiness_r8_1 || base.operational_readiness_r8_1)
  };
};

export default function App() {
  const initialUISettings = loadUISettingsV194();
  const [uiSettings, setUISettings] = useState<AppUISettingsV194>(initialUISettings);
  const [activeView, setActiveView] = useState<AppView>(initialUISettings.startView || 'home');
  const [navHistory, setNavHistory] = useState<AppView[]>([initialUISettings.startView || 'home']);
  const [navIndex, setNavIndex] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [registrationScreen, setRegistrationScreen] = useState<any>('register');
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingMode, setOnboardingMode] = useState<'self' | 'admin'>('self');
  const [toastMessage, setToastMessage] = useState('');
  const [customerPortalKey, setCustomerPortalKey] = useState(0);
  const [welcomeOpen, setWelcomeOpen] = useState<boolean>(() => {
    try {
      return initialUISettings.showWelcome && sessionStorage.getItem('spp-welcome-v19-4') !== 'shown';
    } catch {
      return initialUISettings.showWelcome;
    }
  });
  const [customerRegistrations, setCustomerRegistrations] = useState<CustomerRegistrationV194[]>(() => {
    try {
      const raw = localStorage.getItem('spp-customer-registrations-v19-4');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof navigator === 'undefined' ? true : navigator.onLine);
  const [isAIGuidanceOpen, setIsAIGuidanceOpen] = useState<boolean>(false);
  const [accountSwitcherOpen, setAccountSwitcherOpen] = useState(false);
  const [enterpriseAuth,setEnterpriseAuth]=useState<{checked:boolean;required:boolean;authenticated:boolean;environment:string;bootstrapConfigured:boolean;session?:EnterpriseAuthSessionV2027;error?:string}>({checked:false,required:false,authenticated:false,environment:'UNKNOWN',bootstrapConfigured:false});

  // Core Application State
  const [farms, setFarms] = useState<Farm[]>(INITIAL_FARMS);
  const [flocks, setFlocks] = useState<Flock[]>(INITIAL_FLOCKS);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(INITIAL_DAILY_LOGS);
  const [necropsyCases, setNecropsyCases] = useState<NecropsyCase[]>(INITIAL_NECROPSY_CASES);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [labReports, setLabReports] = useState<LabSensitivityResult[]>(INITIAL_LAB_REPORTS);
  const [acousticSessions, setAcousticSessions] = useState<AcousticAnalysisSession[]>(INITIAL_ACOUSTIC_SESSIONS);
  const [outbreaks, setOutbreaks] = useState<EpidemiologicalOutbreak[]>(INITIAL_OUTBREAKS);

  // Market & Expanded Modules State
  const [vetMedicines, setVetMedicines] = useState<VeterinaryMedicine[]>(INITIAL_VET_MEDICINES);
  const [feedItems, setFeedItems] = useState<FeedItem[]>(INITIAL_FEEDS);
  const [equipment, setEquipment] = useState<FarmEquipment[]>(INITIAL_EQUIPMENT);
  const [rentals, setRentals] = useState<HangarRental[]>(INITIAL_HANGAR_RENTALS);
  const [workers, setWorkers] = useState<WorkerProfile[]>(INITIAL_WORKERS);
  const [vaccines, setVaccines] = useState<VaccineProtocolItem[]>(INITIAL_VACCINE_PROTOCOLS);
  const [financialConfig, setFinancialConfig] = useState<PlatformFinancialConfig>(INITIAL_FINANCIAL_CONFIG);
  const [companies, setCompanies] = useState<PartnerCompany[]>(INITIAL_COMPANIES);
  const [systemUsers, setSystemUsers] = useState<SystemUserAccount[]>(INITIAL_SYSTEM_USERS);
  const [policies, setPolicies] = useState<GovernancePolicy[]>(INITIAL_POLICIES);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem('spp-staff-permissions-v1');
      return saved ? JSON.parse(saved) : INITIAL_STAFF_MEMBERS;
    } catch {
      return INITIAL_STAFF_MEMBERS;
    }
  });
  const [poultryPrices, setPoultryPrices] = useState<PoultryDailyPrice[]>(INITIAL_POULTRY_PRICES);
  const [poultrySaleRequests, setPoultrySaleRequests] = useState<PoultrySaleRequest[]>(INITIAL_POULTRY_SALE_REQUESTS);
  const [smartOperations, setSmartOperations] = useState<SmartOperationsState>(() => {
    try {
      const saved = localStorage.getItem('spp-smart-operations-v1');
      if (!saved) return INITIAL_SMART_OPERATIONS;
      const parsed = JSON.parse(saved);
      return {
        ...INITIAL_SMART_OPERATIONS,
        ...parsed,
        purchase_requests: parsed.purchase_requests || [],
        branches: parsed.branches || INITIAL_SMART_OPERATIONS.branches,
        payment_accounts: parsed.payment_accounts || INITIAL_SMART_OPERATIONS.payment_accounts,
        payment_verifications: parsed.payment_verifications || [],
        supervision_packages: parsed.supervision_packages || INITIAL_SMART_OPERATIONS.supervision_packages,
        supervision_requests: parsed.supervision_requests || [],
        clinical_cases: parsed.clinical_cases || [],
        job_applications: parsed.job_applications || [],
        laboratories: parsed.laboratories || INITIAL_SMART_OPERATIONS.laboratories,
        necropsy_guides: parsed.necropsy_guides || INITIAL_SMART_OPERATIONS.necropsy_guides,
        integrations: parsed.integrations || INITIAL_SMART_OPERATIONS.integrations,
        audit_log: parsed.audit_log || INITIAL_SMART_OPERATIONS.audit_log,
        approval_workflows: parsed.approval_workflows || INITIAL_SMART_OPERATIONS.approval_workflows,
        backup_sync: parsed.backup_sync || INITIAL_SMART_OPERATIONS.backup_sync,
        notification_templates: parsed.notification_templates || INITIAL_SMART_OPERATIONS.notification_templates,
        system_health: parsed.system_health || INITIAL_SMART_OPERATIONS.system_health,
        enterprise: normalizeEnterpriseV19(parsed.enterprise)
      };
    } catch {
      return INITIAL_SMART_OPERATIONS;
    }
  });

  const navigateTo = (view: AppView) => {
    if (view === 'register') { setRegistrationScreen('register'); return; }
    if (view === 'registration-approvals') {
      if (enterpriseAuth.session?.identity?.role_code === 'SYSTEM_OWNER') setRegistrationScreen('approvals');
      else setToastMessage('لوحة الموافقات مخصصة لمالك النظام.');
      return;
    }
    setRegistrationScreen(null);
    const core = smartOperations?.enterprise?.platform_core_v19_5;
    const user = core?.users?.find((u) => u.id === core.active_user_id);
    if (user && !allowedViewsForRoleV195(user.role).includes(view)) {
      setToastMessage('هذا القسم غير متاح لصلاحيات الحساب الحالي.');
      setTimeout(() => setToastMessage(''), 2200);
      return;
    }
    if (view === activeView) return;
    setNavHistory((prev) => {
      const trimmed = prev.slice(0, navIndex + 1);
      const next = [...trimmed, view];
      setNavIndex(next.length - 1);
      return next;
    });
    setActiveView(view);
  };

  const navigateBack = () => {
    if (navIndex <= 0) return;
    const nextIndex = navIndex - 1;
    setNavIndex(nextIndex);
    setActiveView(navHistory[nextIndex]);
  };

  const navigateForward = () => {
    if (navIndex >= navHistory.length - 1) return;
    const nextIndex = navIndex + 1;
    setNavIndex(nextIndex);
    setActiveView(navHistory[nextIndex]);
  };

  useEffect(() => {
    try {
      localStorage.setItem('spp-ui-settings-v19-4', JSON.stringify(uiSettings));
    } catch {}
    document.body.dataset.appTheme = uiSettings.theme;
    document.body.dataset.uiDensity = uiSettings.density;
    document.body.dataset.uiFont = uiSettings.fontScale;
    document.body.dataset.uiReduceMotion = String(uiSettings.reduceMotion);
    document.body.dataset.appLanguage = uiSettings.language;
    document.documentElement.lang = uiSettings.language === 'en' ? 'en' : 'ar';
    document.documentElement.dir = uiSettings.language === 'en' ? 'ltr' : 'rtl';
  }, [uiSettings]);

  useEffect(() => {
    try { localStorage.setItem('spp-customer-registrations-v19-4', JSON.stringify(customerRegistrations)); } catch {}
  }, [customerRegistrations]);

  const closeWelcome = () => {
    setWelcomeOpen(false);
    try { sessionStorage.setItem('spp-welcome-v19-4', 'shown'); } catch {}
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(''), 3400);
  };

  const activateRegistration = (registration: CustomerRegistrationV194) => {
    const farm: Farm = {
      id: registration.farm_code,
      name: registration.farm_name,
      owner_name: registration.full_name,
      phone: registration.phone,
      location_name: [registration.district, registration.area].filter(Boolean).join(' / '),
      location_gps: registration.gps || { lat: 0, lng: 0 },
      system_type: registration.system_type,
      capacity: registration.capacity,
      biosecurity_score: 50,
      governorate: registration.governorate
    };
    setFarms((prev) => prev.some((item) => item.id === farm.id) ? prev : [farm, ...prev]);
    setCustomerPortalKey((value) => value + 1);

    if (registration.flock_code && registration.active_flock_count && registration.active_flock_count > 0) {
      const age = registration.active_flock_age_days || 1;
      const start = new Date();
      start.setDate(start.getDate() - age);
      const flock: Flock = {
        id: registration.flock_code,
        farm_id: registration.farm_code,
        farm_name: registration.farm_name,
        flock_code: registration.flock_code,
        breed_type: registration.breed_type || 'Ross 308',
        initial_count: registration.active_flock_count,
        current_count: registration.active_flock_count,
        start_date: start.toISOString().slice(0, 10),
        current_age_days: age,
        status: 'active',
        target_market_weight_kg: 2.2,
        house_number: 'عنبر 1'
      };
      setFlocks((prev) => prev.some((item) => item.id === flock.id) ? prev : [flock, ...prev]);
    }

    // V19.5: approved onboarding also creates a role-aware customer account and a farm communication room.
    setSmartOperations((prev) => {
      const core = prev.enterprise.platform_core_v19_5;
      const existing = core.users.find((u) => u.phone === registration.phone);
      const userId = existing?.id || `usr-${registration.customer_code.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`;
      const users = existing ? core.users : [{ id:userId, name:registration.full_name, role:'farmer' as const, phone:registration.phone, governorate:registration.governorate, status:'active' as const, permissions:permissionsForRoleV195('farmer') }, ...core.users];
      const roomExists = core.chat_rooms.some((r) => r.farm_name === registration.farm_name);
      const consultant = core.users.find((u) => u.role === 'vet_consultant');
      const supervisor = core.users.find((u) => u.role === 'supervisor');
      const room = roomExists ? undefined : {
        id:`room-${registration.farm_code}`,
        title:`متابعة ${registration.farm_name}`,
        farm_name:registration.farm_name,
        flock_code:registration.flock_code || 'بدون قطيع نشط',
        participant_ids:[userId, consultant?.id, supervisor?.id].filter(Boolean) as string[],
        participant_names:[registration.full_name, consultant?.name, supervisor?.name].filter(Boolean) as string[],
        priority:'normal' as const,
        status:'active' as const,
        last_message_at:new Date().toISOString()
      };
      const nextCore = { ...core, users, chat_rooms: room ? [room, ...core.chat_rooms] : core.chat_rooms };
      return { ...prev, enterprise: { ...prev.enterprise, platform_core_v19_5: withAuditV195(nextCore, 'الإدارة', 'ceo', 'تفعيل عميل ومزرعة', 'customer', registration.customer_code, undefined, {userId,farm:registration.farm_name}) } };
    });
  };

  const handleCustomerRegistration = (registration: CustomerRegistrationV194) => {
    const duplicate = findDuplicateRegistrationV194(customerRegistrations, registration);
    if (duplicate) {
      showToast(`يوجد تسجيل مشابه بالفعل: ${duplicate.customer_code}`);
      return;
    }
    setCustomerRegistrations((prev) => [registration, ...prev]);
    if (registration.status === 'approved') {
      activateRegistration(registration);
      showToast(`تم إنشاء واعتماد ${registration.customer_code} وربط المزرعة.`);
      navigateTo('farmer');
    } else {
      showToast(`تم استلام الطلب ${registration.customer_code} وإرساله للإدارة للمراجعة.`);
    }
    setOnboardingOpen(false);
  };

  const approveCustomerRegistration = (id: string) => {
    const registration = customerRegistrations.find((item) => item.id === id);
    if (!registration) return;
    const approved: CustomerRegistrationV194 = { ...registration, status: 'approved', approved_at: new Date().toISOString(), approved_by: 'الإدارة' };
    setCustomerRegistrations((prev) => prev.map((item) => item.id === id ? approved : item));
    activateRegistration(approved);
    showToast(`تم اعتماد ${approved.customer_code} وتفعيل المزرعة.`);
  };

  const rejectCustomerRegistration = (id: string) => {
    setCustomerRegistrations((prev) => prev.map((item) => item.id === id ? { ...item, status: 'rejected' } : item));
    showToast('تم رفض طلب التسجيل مع الاحتفاظ بسجل التدقيق.');
  };

  useEffect(() => {
    let cancelled=false;
    (async()=>{
      try{
        const status=await apiService.getAuthStatusV2027();
        const required=['STAGING','PRODUCTION'].includes(String(status.environment||'').toUpperCase());
        if(!required){if(!cancelled)setEnterpriseAuth({checked:true,required:false,authenticated:true,environment:status.environment,bootstrapConfigured:status.bootstrap_configured,session:apiService.getStoredAuthSessionV2027()});return;}
        let session=apiService.getStoredAuthSessionV2027();
        if(session){try{await apiService.getAuthMeV2027();}catch{session=await apiService.refreshEnterpriseV2027();}}
        if(!cancelled)setEnterpriseAuth({checked:true,required:true,authenticated:Boolean(session),environment:status.environment,bootstrapConfigured:status.bootstrap_configured,session});
      }catch(err){
        const prodBuild=Boolean(import.meta.env.PROD);
        if(!cancelled)setEnterpriseAuth({checked:true,required:prodBuild,authenticated:!prodBuild,environment:prodBuild?'PRODUCTION':'DEVELOPMENT',bootstrapConfigured:false,error:err instanceof Error?err.message:'auth_status_unavailable'});
      }
    })();
    return()=>{cancelled=true;};
  },[]);

  useEffect(() => {
    customerRegistrations.filter((item) => item.status === 'approved').forEach(activateRegistration);
    // Hydrate locally approved demo/onboarding records once; production will move this to the central database.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openOnboarding = (mode: 'self' | 'admin') => {
    setOnboardingMode(mode);
    setOnboardingOpen(true);
  };

  const [loading, setLoading] = useState<boolean>(true);
  const [enterpriseHydrated, setEnterpriseHydrated] = useState(false);

  // V15 network awareness + IndexedDB hydration. localStorage remains a compatibility fallback.
  useEffect(() => {
    const syncStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', syncStatus);
    window.addEventListener('offline', syncStatus);
    offlineDatabaseV15.loadSmartOperations().then((cached) => {
      if (cached) {
        setSmartOperations((prev) => ({
          ...prev,
          ...cached,
          enterprise: normalizeEnterpriseV19({ ...prev.enterprise, ...(cached.enterprise || {}), sovereignty_v19: { ...prev.enterprise.sovereignty_v19, ...((cached.enterprise || {}).sovereignty_v19 || {}) } })
        }));
      }
    }).catch(() => { /* IndexedDB may be unavailable in a restricted browser. */ });
    return () => {
      window.removeEventListener('online', syncStatus);
      window.removeEventListener('offline', syncStatus);
    };
  }, []);

  // Load initial data from server APIs
  useEffect(() => {
    if(!enterpriseAuth.checked||(enterpriseAuth.required&&!enterpriseAuth.authenticated))return;
    async function loadData() {
      try {
        const [
          serverFarms,
          serverFlocks,
          serverLogs,
          serverCases,
          serverRxs,
          serverLabs,
          serverAudio,
          serverOutbreaks
        ] = await Promise.all([
          apiService.getFarms(),
          apiService.getFlocks(),
          apiService.getDailyLogs(),
          apiService.getNecropsyCases(),
          apiService.getPrescriptions(),
          apiService.getLabReports(),
          apiService.getAcousticSessions(),
          apiService.getOutbreaks()
        ]);

        if (serverFarms?.length) setFarms(serverFarms);
        if (serverFlocks?.length) setFlocks(serverFlocks);
        if (serverLogs?.length) setDailyLogs(serverLogs);
        if (serverCases?.length) setNecropsyCases(serverCases);
        if (serverRxs?.length) setPrescriptions(serverRxs);
        if (serverLabs?.length) setLabReports(serverLabs);
        if (serverAudio?.length) setAcousticSessions(serverAudio);
        if (serverOutbreaks?.length) setOutbreaks(serverOutbreaks);
      } catch (err) {
        console.warn('Using local fallback mock dataset:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [enterpriseAuth.checked, enterpriseAuth.required, enterpriseAuth.authenticated]);

  useEffect(() => {
    if(!enterpriseAuth.checked||(enterpriseAuth.required&&!enterpriseAuth.authenticated))return;
    apiService.getEnterpriseV11()
      .then((enterprise) => setSmartOperations((prev) => ({ ...prev, enterprise: normalizeEnterpriseV19(enterprise) })))
      .catch(() => {
        if(enterpriseAuth.required)return;
        // Development/offline compatibility only; production never treats bundled state as authoritative.
      })
      .finally(() => setEnterpriseHydrated(true));
  }, [enterpriseAuth.checked, enterpriseAuth.required, enterpriseAuth.authenticated]);

  useEffect(() => {
    if (!enterpriseHydrated || (enterpriseAuth.required&&!enterpriseAuth.authenticated)) return;
    const timer = window.setTimeout(() => {
      apiService.saveEnterpriseV11(smartOperations.enterprise).catch(() => {
        // Best-effort development persistence; localStorage remains the offline fallback.
      });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [smartOperations.enterprise, enterpriseHydrated]);

  useEffect(() => {
    if(enterpriseAuth.required)return;
    try {
      localStorage.setItem('spp-smart-operations-v1', JSON.stringify(smartOperations));
    } catch {
      // Local persistence is best-effort in the prototype.
    }
  }, [smartOperations]);

  useEffect(() => {
    if(enterpriseAuth.required)return;
    const timer = window.setTimeout(() => {
      offlineDatabaseV15.saveSmartOperations(smartOperations).catch(() => {});
      if (!navigator.onLine) offlineDatabaseV15.enqueueLatestState(smartOperations).catch(() => {});
    }, 650);
    return () => window.clearTimeout(timer);
  }, [smartOperations]);

  useEffect(() => {
    const ui = smartOperations.enterprise.ui_design_v13;
    if (!ui || typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--spp-primary', ui.primary_hex);
    root.style.setProperty('--spp-accent', ui.accent_hex);
    root.style.setProperty('--spp-light-bg', ui.light_background_hex);
    root.style.setProperty('--spp-dark-bg', ui.dark_background_hex);
    root.style.setProperty('--spp-success', ui.success_hex);
    root.style.setProperty('--spp-danger', ui.danger_hex);
    root.style.setProperty('--spp-info', ui.info_hex);
    document.body.dataset.sppMicro = ui.micro_interactions_enabled ? 'true' : 'false';
  }, [smartOperations.enterprise.ui_design_v13]);



  useEffect(() => {
    try {
      localStorage.setItem('spp-staff-permissions-v1', JSON.stringify(staffMembers));
    } catch {
      // صلاحيات النموذج الأولي تحفظ محلياً؛ الإنتاج يجب أن يعتمد على RBAC خادمي.
    }
  }, [staffMembers]);

  // Handlers for state updates
  const handleAddDailyLog = (newLog: DailyLog) => {
    setDailyLogs((prev) => [newLog, ...prev]);
  };

  const handleAddNecropsyCase = (newCase: NecropsyCase) => {
    setNecropsyCases((prev) => [newCase, ...prev]);
  };

  const handleAddAcousticSession = (newSession: AcousticAnalysisSession) => {
    setAcousticSessions((prev) => [newSession, ...prev]);
  };

  const handlePrescriptionIssued = (newRx: Prescription, updatedCase: NecropsyCase) => {
    setPrescriptions((prev) => [newRx, ...prev]);
    setNecropsyCases((prev) =>
      prev.map((c) => (c.id === updatedCase.id ? updatedCase : c))
    );
  };

  const handleUpdateFarmScore = (farmId: string, newScore: number) => {
    setFarms((prev) =>
      prev.map((f) => (f.id === farmId ? { ...f, biosecurity_score: newScore } : f))
    );
    apiService.updateFarmBiosecurity(farmId, newScore).catch(() => {});
  };

  const handleBroadcastAlert = (outbreakId: string) => {
    setOutbreaks((prev) =>
      prev.map((o) =>
        o.id === outbreakId ? { ...o, alert_broadcasted: true } : o
      )
    );
    apiService.broadcastOutbreakAlert(outbreakId).catch(() => {});
  };

  const handleCreateSaleRequest = (request: PoultrySaleRequest) => {
    setPoultrySaleRequests((prev) => [request, ...prev]);
  };

  const handleCreateEmergency = (request: EmergencyFieldRequest) => {
    const eligibleStaff = staffMembers
      .filter((staff) => staff.permissions.can_order_field_visits && staff.status === 'نشط' && staff.is_online && staff.on_duty)
      .sort((a, b) => {
        const aLocal = request.governorate.includes(a.governorate.replace('محافظة ', '')) ? 0 : 1;
        const bLocal = request.governorate.includes(b.governorate.replace('محافظة ', '')) ? 0 : 1;
        return aLocal - bLocal || a.active_cases_count - b.active_cases_count;
      });
    const assigned = eligibleStaff[0];
    const enriched: EmergencyFieldRequest = assigned
      ? { ...request, assigned_staff_id: assigned.id, assigned_staff_name: assigned.name, status: 'assigned' }
      : request;
    setSmartOperations((prev) => {
      const hasZone = prev.zone_service_prices.some(
        (zone) => zone.governorate.includes(request.governorate) && zone.district.includes(request.district)
      );
      const currencyMode = prev.governorate_currency_rules.find(
        (rule) => rule.active && request.governorate.includes(rule.governorate)
      )?.currency_mode || 'YER_OLD_SAR';
      return {
        ...prev,
        emergency_requests: [enriched, ...prev.emergency_requests],
        zone_service_prices: hasZone
          ? prev.zone_service_prices
          : [
              {
                id: `zone-${Date.now()}`,
                governorate: request.governorate,
                district: request.district,
                currency_mode: currencyMode,
                transport_fee_yer: 0,
                field_visit_fee_yer: 0,
                marketing_fee_yer: 0,
                last_updated: new Date().toISOString(),
                status: 'pending_new_location_pricing' as const
              },
              ...prev.zone_service_prices
            ]
      };
    });
  };

  const handleSubmitClinicalCase = (caseItem: ClinicalTriageCase) => {
    const eligible = staffMembers
      .filter((s) => s.status === 'نشط' && s.is_online && s.on_duty && (s.role === 'طبيب بيطري استشاري' || s.permissions.can_order_field_visits))
      .sort((a,b) => {
        const aLocal = a.governorate.includes(caseItem.governorate) || caseItem.governorate.includes(a.governorate.replace('محافظة ', '')) ? 0 : 1;
        const bLocal = b.governorate.includes(caseItem.governorate) || caseItem.governorate.includes(b.governorate.replace('محافظة ', '')) ? 0 : 1;
        return aLocal - bLocal || a.active_cases_count - b.active_cases_count;
      });
    const assigned = eligible[0];
    const enriched: ClinicalTriageCase = assigned ? { ...caseItem, assigned_staff_id: assigned.id, assigned_staff_name: assigned.name, assigned_role: assigned.role, status: 'assigned_online_staff' } : caseItem;
    setSmartOperations((prev) => {
      const relatedCases = [enriched, ...prev.clinical_cases].filter((item) =>
        item.ai_suspected_group !== 'غير محدد' &&
        item.ai_suspected_group === enriched.ai_suspected_group &&
        item.governorate === enriched.governorate &&
        item.district === enriched.district
      );
      const alertKey = `${enriched.ai_suspected_group}-${enriched.governorate}-${enriched.district}`;
      const alreadyAlerted = prev.notifications.some((item) => item.type === 'outbreak_alert' && item.target_value === alertKey);
      const notifications = relatedCases.length >= 2 && !alreadyAlerted
        ? [{
            id: `outbreak-auto-${Date.now()}`,
            created_at: new Date().toISOString(),
            title: `رصد بؤرة مرضية ناشئة — ${enriched.ai_suspected_group}`,
            body: `تم تسجيل ${relatedCases.length} حالات متقاربة ضمن ${enriched.district} / ${enriched.governorate}. يوصى برفع الأمان الحيوي ومراجعة الحالات من الطبيب قبل تعميم أي إجراء علاجي.`,
            audience: 'governorate' as const,
            target_value: alertKey,
            type: 'outbreak_alert' as const,
            priority: 'critical' as const,
            sent: true
          }, ...prev.notifications]
        : prev.notifications;

      const now = new Date().toISOString();
      const aiSession = {
        id: `ai-session-${Date.now()}`,
        customer_name: enriched.customer_name,
        phone: enriched.phone,
        intent: 'clinical_triage' as const,
        current_step: assigned ? 'بانتظار مراجعة الطبيب/المشرف المداوم' : 'بانتظار تعيين مختص',
        collected_fields: ['الاسم','الهاتف','العنوان','عدد القطيع','العمر','النافق','العلف','الماء','الحرارة','الرطوبة','الأعراض','الصور/الصوت المتاح'],
        missing_fields: enriched.necropsy_images.length ? [] : enriched.ai_requested_organs.map((o) => `صورة ${o}`),
        last_message: assigned ? `تم إرسال الملف إلى ${assigned.name}. اتبع إجراءات الأمان الحيوي وحافظ على الماء والتهوية حتى يصلك القرار المعتمد.` : 'تم حفظ الحالة وسيتم تصعيدها إلى الإدارة لتعيين أقرب مختص مداوم.',
        related_case_id: enriched.id,
        status: assigned ? 'waiting_staff' as const : 'waiting_staff' as const,
        updated_at: now
      };

      const labOrder = enriched.laboratory_recommended && enriched.recommended_lab_id
        ? {
            id: `labord-${Date.now()}`,
            case_id: enriched.id,
            case_number: enriched.case_number,
            laboratory_id: enriched.recommended_lab_id,
            laboratory_name: enriched.recommended_lab_name || 'مختبر المنطقة',
            requested_by: assigned?.name || 'الإدارة',
            sample_type: 'يحدد الطبيب حسب الحالة',
            sample_count: 1,
            chain_of_custody: ['تم إنشاء طلب الفحص من ملف الحالة'],
            requested_tests: ['فحص تشخيصي يحدده الطبيب/المختبر'],
            estimated_cost_yer: prev.laboratories.find((l) => l.id === enriched.recommended_lab_id)?.base_test_price_yer || 0,
            status: 'requested' as const
          }
        : undefined;

      const existingCluster = prev.enterprise.outbreak_clusters.find((c) => c.disease_group === enriched.ai_suspected_group && c.governorate === enriched.governorate && c.district === enriched.district);
      const outbreak_clusters = enriched.ai_suspected_group !== 'غير محدد' && relatedCases.length >= 2
        ? existingCluster
          ? prev.enterprise.outbreak_clusters.map((c) => c.id === existingCluster.id ? { ...c, suspected_cases: relatedCases.length, last_seen_at: now.split('T')[0], risk_level: relatedCases.length >= 4 ? 'critical' as const : 'high' as const, heat_score: Math.min(100, 55 + relatedCases.length * 10) } : c)
          : [{ id: `cluster-${Date.now()}`, disease_group: enriched.ai_suspected_group, disease_name: `اشتباه ${enriched.ai_suspected_group}`, governorate: enriched.governorate, district: enriched.district, suspected_cases: relatedCases.length, lab_confirmed_cases: 0, first_seen_at: now.split('T')[0], last_seen_at: now.split('T')[0], risk_level: 'high' as const, nearby_farms_count: 0, prevention_message: 'رفع مستوى الأمان الحيوي، تقييد الحركة غير الضرورية، ومراجعة الحالات من الطبيب.', heat_score: 70, broadcast_status: 'queued' as const }, ...prev.enterprise.outbreak_clusters]
        : prev.enterprise.outbreak_clusters;

      const push_campaigns = relatedCases.length >= 2 && !alreadyAlerted
        ? [{ id: `push-outbreak-${Date.now()}`, created_at: now, title: `تنبيه وقائي — ${enriched.ai_suspected_group}`, body: `رصد نشاط مرضي في ${enriched.district}. ارفع مستوى الأمان الحيوي وراقب القطيع وأبلغ عن أي تغيرات.`, audience: 'district' as const, target: `${enriched.governorate}/${enriched.district}`, trigger: 'outbreak' as const, sent_count: 0, failed_count: 0, status: 'queued' as const }, ...prev.enterprise.push_campaigns]
        : prev.enterprise.push_campaigns;

      return {
        ...prev,
        clinical_cases: [enriched, ...prev.clinical_cases],
        notifications,
        enterprise: {
          ...prev.enterprise,
          ai_conversations: [aiSession, ...prev.enterprise.ai_conversations],
          lab_orders: labOrder ? [labOrder, ...prev.enterprise.lab_orders] : prev.enterprise.lab_orders,
          outbreak_clusters,
          push_campaigns
        }
      };
    });
  };

  const handleCreateServiceRequest = (request: SupervisionServiceRequest) => {
    setSmartOperations((prev) => ({ ...prev, supervision_requests: [request, ...prev.supervision_requests] }));
  };

  const platformCore = smartOperations.enterprise.platform_core_v19_5;
  const enterpriseCoreV196 = buildEnterpriseCoreV196(platformCore, smartOperations.enterprise.enterprise_core_v19_6);
  const managedOperationsV197 = buildManagedPoultryOperationsV197(platformCore, enterpriseCoreV196, smartOperations.enterprise.managed_operations_v19_7);
  const v20Core = buildV20State(smartOperations.enterprise.v20_core);
  const enterpriseWebV202 = buildEnterpriseWebStateV202(smartOperations.enterprise.enterprise_web_v20_2);
  const enterpriseFoundationV2021 = buildEnterpriseFoundationV2021(smartOperations.enterprise.enterprise_foundation_v20_2_1);
  const veterinaryFieldV2022 = buildVeterinaryFieldStateV2022(smartOperations.enterprise.veterinary_field_v20_2_2);
  const multiBusinessV2023 = buildMultiBusinessEnterpriseStateV2023(smartOperations.enterprise.multi_business_v20_2_3);
  const feedFactoryV2024 = buildFeedFactoryOperationsStateV2024(smartOperations.enterprise.feed_factory_v20_2_4);
  const workforcePayrollV2025 = buildWorkforcePayrollStateV2025(smartOperations.enterprise.workforce_payroll_v20_2_5);
  const executiveIntelligenceV2026 = buildExecutiveIntelligenceStateV2026(smartOperations.enterprise.executive_intelligence_v20_2_6);
  const windowsCompletionV2027 = buildWindowsCompletionStateV2027(smartOperations.enterprise.windows_completion_v20_2_7);
  const farmDivisionV2029 = buildFarmDivisionStateV2029(smartOperations.enterprise.farm_division_v20_2_9);
  const operationalReadinessR81 = buildOperationalReadinessR81(smartOperations.enterprise.operational_readiness_r8_1);
  const updateEnterpriseCoreV196 = (next: ReturnType<typeof buildEnterpriseCoreV196>) => {
    setSmartOperations((prev) => ({ ...prev, enterprise: { ...prev.enterprise, enterprise_core_v19_6: next } }));
  };
  const updateManagedOperationsV197 = (next: ReturnType<typeof buildManagedPoultryOperationsV197>) => {
    setSmartOperations((prev) => ({ ...prev, enterprise: { ...prev.enterprise, managed_operations_v19_7: next } }));
  };
  const updateV20Core = (next: ReturnType<typeof buildV20State>) => {
    setSmartOperations((prev) => ({ ...prev, enterprise: { ...prev.enterprise, v20_core: next } }));
  };
  const updateEnterpriseWebV202 = (next: ReturnType<typeof buildEnterpriseWebStateV202>) => {
    setSmartOperations((prev) => ({ ...prev, enterprise: { ...prev.enterprise, enterprise_web_v20_2: next } }));
  };
  const updateVeterinaryFieldV2022 = (next: ReturnType<typeof buildVeterinaryFieldStateV2022>) => {
    setSmartOperations((prev) => ({ ...prev, enterprise: { ...prev.enterprise, veterinary_field_v20_2_2: next } }));
  };
  const updateMultiBusinessV2023 = (next: ReturnType<typeof buildMultiBusinessEnterpriseStateV2023>) => {
    setSmartOperations((prev) => ({ ...prev, enterprise: { ...prev.enterprise, multi_business_v20_2_3: next } }));
  };
  const updateFeedFactoryV2024 = (next: ReturnType<typeof buildFeedFactoryOperationsStateV2024>) => {
    setSmartOperations((prev) => ({ ...prev, enterprise: { ...prev.enterprise, feed_factory_v20_2_4: next } }));
  };
  const updateWorkforcePayrollV2025 = (next: ReturnType<typeof buildWorkforcePayrollStateV2025>) => {
    setSmartOperations((prev) => ({ ...prev, enterprise: { ...prev.enterprise, workforce_payroll_v20_2_5: next } }));
  };
  const updateExecutiveIntelligenceV2026 = (next: ReturnType<typeof buildExecutiveIntelligenceStateV2026>) => {
    setSmartOperations((prev) => ({ ...prev, enterprise: { ...prev.enterprise, executive_intelligence_v20_2_6: next } }));
  };
  const updateWindowsCompletionV2027 = (next: ReturnType<typeof buildWindowsCompletionStateV2027>) => {
    setSmartOperations((prev) => ({ ...prev, enterprise: { ...prev.enterprise, windows_completion_v20_2_7: next } }));
  };
  const updateFarmDivisionV2029 = (next: ReturnType<typeof buildFarmDivisionStateV2029>) => {
    setSmartOperations((prev) => ({ ...prev, enterprise: { ...prev.enterprise, farm_division_v20_2_9: next } }));
  };
  const updateOperationalReadinessR81 = (next: ReturnType<typeof buildOperationalReadinessR81>) => {
    setSmartOperations((prev) => ({ ...prev, enterprise: { ...prev.enterprise, operational_readiness_r8_1: next } }));
  };
  const activePlatformUser = platformCore.users.find((u) => u.id === platformCore.active_user_id) || platformCore.users[0];
  const switchPlatformUser = (id: string) => {
    setSmartOperations((prev) => {
      const core = prev.enterprise.platform_core_v19_5;
      const current = core.users.find((u) => u.id === core.active_user_id) || core.users[0];
      const nextCore = withAuditV195({ ...core, active_user_id: id }, current?.name || 'system', current?.role || 'system', 'تبديل الحساب النشط', 'session', id);
      return { ...prev, enterprise: { ...prev.enterprise, platform_core_v19_5: nextCore } };
    });
    const selected = platformCore.users.find((u) => u.id === id);
    if (selected && !allowedViewsForRoleV195(selected.role).includes(activeView)) navigateTo('home');
  };

  const primaryCustomerDisplayName = /أحمد صالح العنسي/.test(farms[0]?.owner_name || '') ? '' : (farms[0]?.owner_name || '');
  const pendingCasesCount = necropsyCases.filter((c) => c.vet_approval_status === 'pending').length;

  if(!enterpriseAuth.checked){return <div className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center text-sm font-bold">تهيئة طبقة الأمان المؤسسية...</div>;}
  if(registrationScreen === 'register') return <RegisterPage onGoToLogin={() => setRegistrationScreen(null)} />;
  if(enterpriseAuth.required&&!enterpriseAuth.authenticated){return <div dir="rtl"><EnterpriseLoginV2027 environment={enterpriseAuth.environment} bootstrapConfigured={enterpriseAuth.bootstrapConfigured} initialError={enterpriseAuth.error} onAuthenticated={(session)=>setEnterpriseAuth(prev=>({...prev,authenticated:true,session,error:undefined}))}/><div className="fixed bottom-4 left-4"><button className="rounded-xl bg-emerald-700 px-5 py-3 text-white" onClick={() => setRegistrationScreen('register')}>تسجيل مستخدم جديد</button></div></div>;}

  if(registrationScreen === 'approvals') return enterpriseAuth.session?.identity?.role_code === 'SYSTEM_OWNER' ? <div dir="rtl"><button className="m-4 rounded-lg bg-slate-800 px-4 py-2 text-white" onClick={() => setRegistrationScreen(null)}>العودة للمنصة</button><AdminRegistrationDashboard accessToken={enterpriseAuth.session.access_token} onOpenIdentityManagement={() => { setRegistrationScreen(null); navigateTo('enterprise'); }} /></div> : <div dir="rtl">غير مصرح بالوصول <button onClick={() => setRegistrationScreen(null)}>عودة</button></div>;

  return (
    <div className="app-shell min-h-screen text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 font-sans">
      {/* Top Header & Navigation */}
      <Header
        activeView={activeView}
        onViewChange={navigateTo}
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
        pendingCasesCount={pendingCasesCount}
        onOpenAIGuidance={() => setIsAIGuidanceOpen(true)}
        theme={uiSettings.theme}
        onToggleTheme={() => setUISettings((prev) => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }))}
        onOpenSettings={() => setSettingsOpen(true)}
        aiShortcutEnabled={uiSettings.aiShortcutEnabled}
        currentUserName={activePlatformUser?.name}
        currentUserRole={activePlatformUser ? activePlatformUser.role : ''}
        onOpenAccount={() => setAccountSwitcherOpen(true)}
        allowedViews={activePlatformUser ? allowedViewsForRoleV195(activePlatformUser.role) as AppView[] : undefined}
        language={uiSettings.language}
        onRegisterUser={() => setRegistrationScreen('register')}
        onOpenRegistrationApprovals={enterpriseAuth.session?.identity?.role_code === 'SYSTEM_OWNER' ? () => setRegistrationScreen('approvals') : undefined}
        onOpenLogin={() => setAccountSwitcherOpen(true)}
      />

      <NavigationTrail
        activeView={activeView}
        canBack={navIndex > 0}
        canForward={navIndex < navHistory.length - 1}
        onBack={navigateBack}
        onForward={navigateForward}
        onHome={() => navigateTo('home')}
        onSettings={() => setSettingsOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-12">
        {activeView === 'home' && (
          <HomeDashboard
            customerName={primaryCustomerDisplayName}
            farmCount={farms.length}
            activeFlocks={flocks.filter((flock) => flock.status === 'active').length}
            pendingCases={pendingCasesCount}
            pendingRegistrations={customerRegistrations.filter((r) => ['new','phone_verified','pending_review','needs_information'].includes(r.status)).length}
            isOnline={isOnline}
            onNavigate={navigateTo}
            onOpenAI={() => setIsAIGuidanceOpen(true)}
            onRegisterCustomer={() => openOnboarding('self')}
            multiBusiness={multiBusinessV2023}
            onOpenSettings={() => setSettingsOpen(true)}
            onRegisterUser={() => setRegistrationScreen('register')}
            onOpenRegistrationApprovals={enterpriseAuth.session?.identity?.role_code === 'SYSTEM_OWNER' ? () => setRegistrationScreen('approvals') : undefined}
          />
        )}
        {activeView === 'enterprise' && activePlatformUser && (
          <EnterpriseWebWorkspaceV202
            state={enterpriseWebV202}
            foundation={enterpriseFoundationV2021}
            veterinaryField={veterinaryFieldV2022}
            multiBusiness={multiBusinessV2023}
            feedFactory={feedFactoryV2024}
            workforcePayroll={workforcePayrollV2025}
            executiveIntelligence={executiveIntelligenceV2026}
            windowsCompletion={windowsCompletionV2027}
            farmDivision={farmDivisionV2029}
            operationalReadiness={operationalReadinessR81}
            language={uiSettings.language}
        onRegisterUser={() => setRegistrationScreen('register')}
        onOpenRegistrationApprovals={enterpriseAuth.session?.identity?.role_code === 'SYSTEM_OWNER' ? () => setRegistrationScreen('approvals') : undefined}
        onOpenLogin={() => setAccountSwitcherOpen(true)}
            v20={v20Core}
            managed={managedOperationsV197}
            platform={platformCore}
            currentUser={{ id: activePlatformUser.id, name: activePlatformUser.name, role: activePlatformUser.role }}
            onChange={updateEnterpriseWebV202}
            onVeterinaryFieldChange={updateVeterinaryFieldV2022}
            onMultiBusinessChange={updateMultiBusinessV2023}
            onFeedFactoryChange={updateFeedFactoryV2024}
            onWorkforcePayrollChange={updateWorkforcePayrollV2025}
            onExecutiveIntelligenceChange={updateExecutiveIntelligenceV2026}
            onWindowsCompletionChange={updateWindowsCompletionV2027}
            onFarmDivisionChange={updateFarmDivisionV2029}
            onOperationalReadinessChange={updateOperationalReadinessR81}
            onLanguageChange={(language) => setUISettings(prev => ({ ...prev, language }))}
            onManagedChange={updateManagedOperationsV197}
          />
        )}

        {activeView === 'farmer' && (
          <FarmerApp
            key={`customer-portal-${customerPortalKey}`}
            farms={farms}
            flocks={flocks}
            dailyLogs={dailyLogs}
            prescriptions={prescriptions}
            isOnline={isOnline}
            onAddDailyLog={handleAddDailyLog}
            onAddNecropsyCase={handleAddNecropsyCase}
            onAddAcousticSession={handleAddAcousticSession}
            onUpdateFarmScore={handleUpdateFarmScore}
            onSwitchToVet={() => navigateTo('vet')}
            onSwitchToCalculator={() => navigateTo('calculator')}
            smartOperations={smartOperations}
            poultryPrices={poultryPrices}
            onCreateSaleRequest={handleCreateSaleRequest}
            onCreateEmergency={handleCreateEmergency}
            onCreateServiceRequest={handleCreateServiceRequest}
            onUpdateSmartOperations={setSmartOperations}
            onOpenAIGuidance={() => setIsAIGuidanceOpen(true)}
            onRegisterCustomer={() => openOnboarding('self')}
          />
        )}

        {activeView === 'vet' && (
          <VetDashboard
            farms={farms}
            flocks={flocks}
            dailyLogs={dailyLogs}
            necropsyCases={necropsyCases}
            prescriptions={prescriptions}
            labReports={labReports}
            acousticSessions={acousticSessions}
            outbreaks={outbreaks}
            smartOperations={smartOperations}
            onUpdateSmartOperations={setSmartOperations}
            onPrescriptionIssued={handlePrescriptionIssued}
            onUpdateFarmScore={handleUpdateFarmScore}
            onBroadcastAlert={handleBroadcastAlert}
          />
        )}

        {activeView === 'managed' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ManagedOperationsWorkspaceV197
              state={managedOperationsV197}
              platformCore={platformCore}
              enterpriseCore={enterpriseCoreV196}
              onChange={updateManagedOperationsV197}
              v20={v20Core}
              onV20Change={updateV20Core}
              currentUserRole={activePlatformUser?.role || 'farmer'}
              currentUserName={activePlatformUser?.name || 'مستخدم المنصة'}
            />
          </div>
        )}

        {activeView === 'marketplace' && smartOperations.enterprise.owner_controls.disable_marketplace && (
          <div className="max-w-4xl mx-auto mt-10 p-6 rounded-3xl border border-amber-500/30 bg-amber-500/10 text-center"><div className="text-amber-300 font-black">السوق متوقف مؤقتاً بقرار System Owner</div><div className="text-xs text-slate-400 mt-2">يمكن للإدارة إعادة تفعيله من لوحة V11 → لوحة المالك.</div></div>
        )}

        {activeView === 'marketplace' && !smartOperations.enterprise.owner_controls.disable_marketplace && (
          <MarketplaceView
            medicines={vetMedicines}
            feeds={feedItems}
            equipment={equipment}
            vaccines={vaccines}
            rentals={rentals}
            onAddRental={(newR) => setRentals((prev) => [newR, ...prev])}
            onNavigateToVet={() => navigateTo('vet')}
            smartOperations={smartOperations}
            customerGovernorate={farms[0]?.governorate || 'صنعاء'}
            customerName={primaryCustomerDisplayName || 'عميل المنصة'}
            customerPhone={farms[0]?.phone || ''}
            customerAddress={farms[0]?.location_name || ''}
            onUpdateSmartOperations={setSmartOperations}
          />
        )}

        {activeView === 'communications' && (
          <FieldChatWorkspaceV195
            operations={smartOperations}
            onUpdateOperations={setSmartOperations}
            farmNames={farms.map((f) => f.name)}
            flockCodes={flocks.map((f) => f.flock_code)}
          />
        )}

        {activeView === 'workers' && (
          <WorkerManagementView
            workers={workers}
            onAddWorker={(newW) => setWorkers((prev) => [newW, ...prev])}
            smartOperations={smartOperations}
            onUpdateSmartOperations={setSmartOperations}
          />
        )}

        {activeView === 'vaccines' && (
          <VaccineProtocolView
            protocols={vaccines}
            flockAgeDays={14}
          />
        )}

        {activeView === 'calculator' && (
          <EconomicLossCalculator
            flocks={flocks}
            onNavigateToFarmer={() => navigateTo('farmer')}
          />
        )}

        {activeView === 'passport' && (
          <DigitalPassportView
            flocks={flocks}
            farms={farms}
            prescriptions={prescriptions}
            dailyLogs={dailyLogs}
          />
        )}

        {activeView === 'finance' && (
          <FinancialCommandCenterV196 state={enterpriseCoreV196} core195={platformCore} onChange={updateEnterpriseCoreV196} managedOperations={managedOperationsV197} />
        )}

        {activeView === 'admin' && (
          <>
          <CustomerRegistrationAdminPanel
            registrations={customerRegistrations}
            onAdd={() => openOnboarding('admin')}
            onApprove={approveCustomerRegistration}
            onReject={rejectCustomerRegistration}
          />
          <AdminFinancialDashboard
            initialConfig={financialConfig}
            onUpdateConfig={(newConf) => setFinancialConfig(newConf)}
            companies={companies}
            onUpdateCompanies={setCompanies}
            medicines={vetMedicines}
            onUpdateMedicines={setVetMedicines}
            feeds={feedItems}
            onUpdateFeeds={setFeedItems}
            equipment={equipment}
            onUpdateEquipment={setEquipment}
            vaccines={vaccines}
            onUpdateVaccines={setVaccines}
            systemUsers={systemUsers}
            onUpdateSystemUsers={setSystemUsers}
            policies={policies}
            onUpdatePolicies={setPolicies}
            smartOperations={smartOperations}
            onUpdateSmartOperations={setSmartOperations}
            poultrySaleRequests={poultrySaleRequests}
            onUpdatePoultrySaleRequests={setPoultrySaleRequests}
            poultryPrices={poultryPrices}
            onUpdatePoultryPrices={setPoultryPrices}
            staffMembers={staffMembers}
            onUpdateStaffMembers={setStaffMembers}
            acousticSessions={acousticSessions}
            necropsyCases={necropsyCases}
          />
          </>
        )}

        {activeView === 'srs' && (
          <DetailedSRSViewer
            onNavigateToVet={() => navigateTo('vet')}
            onNavigateToFarmer={() => navigateTo('farmer')}
            onNavigateToPassport={() => navigateTo('passport')}
          />
        )}
      </main>

      {/* Interactive AI Guidance Modal (Human-in-the-Loop) */}
      <AIVeterinaryGuidanceModal
        isOpen={isAIGuidanceOpen}
        externalAIEnabled={!smartOperations.enterprise.owner_controls.disable_ai_assistant}
        onClose={() => setIsAIGuidanceOpen(false)}
        onConsultVet={() => navigateTo('vet')}
        customerName={primaryCustomerDisplayName}
        customerPhone={farms[0]?.phone || ''}
        customerGovernorate={farms[0]?.governorate || 'صنعاء'}
        customerDistrict={farms[0]?.location_name || ''}
        customerAddress={farms[0]?.location_name || ''}
        laboratories={smartOperations.laboratories}
        necropsyGuides={smartOperations.necropsy_guides}
        onSubmitClinicalCase={handleSubmitClinicalCase}
      />

      <CustomerOnboardingModal
        open={onboardingOpen}
        mode={onboardingMode}
        governorates={(smartOperations.enterprise.sovereignty_v19.governorates || []).filter((g: any) => g.status !== 'deleted').map((g: any) => g.name)}
        onClose={() => setOnboardingOpen(false)}
        onSubmit={handleCustomerRegistration}
      />

      <AppSettingsDrawer
        open={settingsOpen}
        settings={uiSettings}
        onChange={setUISettings}
        onClose={() => setSettingsOpen(false)}
        onReset={() => setUISettings(DEFAULT_UI_SETTINGS_V194)}
      />

      <WelcomeExperience
        open={welcomeOpen}
        customerName={primaryCustomerDisplayName}
        onClose={closeWelcome}
        onRegister={() => { closeWelcome(); openOnboarding('self'); }}
        onOpenAI={() => { closeWelcome(); setIsAIGuidanceOpen(true); }}
        onSettings={() => { closeWelcome(); setSettingsOpen(true); }}
      />

      <AccountSwitcherV195
        open={accountSwitcherOpen}
        core={platformCore}
        onClose={() => setAccountSwitcherOpen(false)}
        onSwitch={switchPlatformUser}
      />

      {toastMessage && (
        <div className="fixed z-[120] bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 rounded-2xl border border-emerald-500/25 bg-[#07181b]/95 px-4 py-3 text-xs font-bold text-emerald-100 shadow-2xl backdrop-blur">
          {toastMessage}
        </div>
      )}

      {/* National Platform Footer */}
      <footer className="no-print bg-slate-950 border-t border-slate-900 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>أفي نيكسس لإدارة الدواجن (AviNexus Poultry Enterprise)</span>
            <span className="text-slate-700">•</span>
            <span>الجمهورية اليمنية</span>
          </div>

<div className="text-[11px] text-cyan-300/80">منصة تشغيلية رقمية لإدارة صحة وإنتاج الدواجن</div>
        </div>
      </footer>
    </div>
  );
}
