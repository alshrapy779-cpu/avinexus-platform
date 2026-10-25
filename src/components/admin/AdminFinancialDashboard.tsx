import React, { useState } from 'react';
import {
  ShieldAlert,
  DollarSign,
  TrendingUp,
  Sliders,
  Users,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Tag,
  Scale,
  Brain,
  Layers,
  ArrowUpRight,
  Wallet,
  Percent,
  Download,
  KeyRound,
  ServerCog,
  Handshake,
  BriefcaseBusiness,
  CloudCog,
  RadioTower,
  ClipboardList,
  Landmark
} from 'lucide-react';
import {
  PlatformFinancialConfig,
  PartnerCompany,
  VeterinaryMedicine,
  FeedItem,
  FarmEquipment,
  VaccineProtocolItem,
  SystemUserAccount,
  GovernancePolicy,
  SmartOperationsState,
  PoultrySaleRequest,
  PoultryDailyPrice,
  StaffMember,
  AcousticAnalysisSession,
  NecropsyCase
} from '../../types';
import { RevenueMarginEngineTab } from './RevenueMarginEngineTab';
import { CompaniesPortalTab } from './CompaniesPortalTab';
import { ProductsCatalogTab } from './ProductsCatalogTab';
import { GovernanceAuthorityTab } from './GovernanceAuthorityTab';
import { SmartOperationsCenter } from './SmartOperationsCenter';
import { AdminAccessControlTab } from './AdminAccessControlTab';
import { AdminIntegrationsSecurityTab } from './AdminIntegrationsSecurityTab';
import { EnterpriseOperationsV11Tab } from './EnterpriseOperationsV11Tab';
import { CommercialClinicalV12Tab } from './CommercialClinicalV12Tab';
import { FarmManagementAutomationV13Tab } from './FarmManagementAutomationV13Tab';
import { ClinicalProductionV14Tab } from './ClinicalProductionV14Tab';
import { EnterpriseERPEnhancementsV15Tab } from './EnterpriseERPEnhancementsV15Tab';
import { LeadershipCRMFieldV16Tab } from './LeadershipCRMFieldV16Tab';
import { SalesSettlementRoutingV17Tab } from './SalesSettlementRoutingV17Tab';
import { EnterpriseCommandV18Tab } from './EnterpriseCommandV18Tab';
import { SovereigntyOperationsV19Tab } from './SovereigntyOperationsV19Tab';
import { OperationalLifecycleV194Tab } from './OperationalLifecycleV194Tab';
import { PlatformOperationsV195Tab } from './PlatformOperationsV195Tab';
import { EnterpriseCommandV196Tab } from './v196/EnterpriseCommandV196Tab';

interface AdminFinancialDashboardProps {
  initialConfig: PlatformFinancialConfig;
  onUpdateConfig?: (newConfig: PlatformFinancialConfig) => void;
  companies: PartnerCompany[];
  onUpdateCompanies: (companies: PartnerCompany[]) => void;
  medicines: VeterinaryMedicine[];
  onUpdateMedicines: (medicines: VeterinaryMedicine[]) => void;
  feeds: FeedItem[];
  onUpdateFeeds: (feeds: FeedItem[]) => void;
  equipment: FarmEquipment[];
  onUpdateEquipment: (equipment: FarmEquipment[]) => void;
  vaccines: VaccineProtocolItem[];
  onUpdateVaccines: (vaccines: VaccineProtocolItem[]) => void;
  systemUsers: SystemUserAccount[];
  onUpdateSystemUsers: (users: SystemUserAccount[]) => void;
  policies: GovernancePolicy[];
  onUpdatePolicies: (policies: GovernancePolicy[]) => void;
  smartOperations: SmartOperationsState;
  onUpdateSmartOperations: (operations: SmartOperationsState) => void;
  poultrySaleRequests: PoultrySaleRequest[];
  onUpdatePoultrySaleRequests: (requests: PoultrySaleRequest[]) => void;
  poultryPrices: PoultryDailyPrice[];
  onUpdatePoultryPrices: (prices: PoultryDailyPrice[]) => void;
  staffMembers: StaffMember[];
  onUpdateStaffMembers: (members: StaffMember[]) => void;
  acousticSessions: AcousticAnalysisSession[];
  necropsyCases: NecropsyCase[];
}

export const AdminFinancialDashboard: React.FC<AdminFinancialDashboardProps> = ({
  initialConfig,
  onUpdateConfig,
  companies,
  onUpdateCompanies,
  medicines,
  onUpdateMedicines,
  feeds,
  onUpdateFeeds,
  equipment,
  onUpdateEquipment,
  vaccines,
  onUpdateVaccines,
  systemUsers,
  onUpdateSystemUsers,
  policies,
  onUpdatePolicies,
  smartOperations,
  onUpdateSmartOperations,
  poultrySaleRequests,
  onUpdatePoultrySaleRequests,
  poultryPrices,
  onUpdatePoultryPrices,
  staffMembers,
  onUpdateStaffMembers,
  acousticSessions,
  necropsyCases
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'revenue_engine' | 'companies_portal' | 'products_catalog' | 'governance_authority' | 'smart_operations' | 'access_control' | 'integrations_security' | 'enterprise_v11' | 'commercial_v12' | 'farm_management_v13' | 'clinical_v14' | 'enterprise_v15' | 'leadership_v16' | 'sales_settlement_v17' | 'enterprise_v18' | 'sovereignty_v19' | 'lifecycle_v19_4' | 'platform_v19_5' | 'enterprise_v19_6'>('enterprise_v19_6');
  const [config, setConfig] = useState<PlatformFinancialConfig>(initialConfig);

  const handleConfigUpdate = (updated: PlatformFinancialConfig) => {
    setConfig(updated);
    if (onUpdateConfig) {
      onUpdateConfig(updated);
    }
  };

  const activeCompaniesCount = companies.filter((c) => c.active).length;
  const frozenUsersCount = systemUsers.filter((u) => u.status === 'مجمد رقابياً').length;
  const activeProductsCount =
    medicines.filter((m) => m.is_active_in_market !== false).length +
    feeds.filter((f) => f.is_active_in_market !== false).length +
    equipment.filter((e) => e.is_active_in_market !== false).length +
    vaccines.filter((v) => v.is_active_in_market !== false).length;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Enterprise Executive Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-3 py-0.5 rounded-full font-bold">
                لوحة تحكم المدير العام (System Owner & Enterprise Dashboard)
              </span>
              <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-mono">
                صلاحيات المالك التنفيذي • REPUBLIC_OF_YEMEN
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">
              المرجع الإداري والمالي الشامل • المنصة الوطنية للسيادة البيطرية والداجنة
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              المركز الرئيسي للتعاقد مع الشركات والموردين، إدارة كتالوج السوق والأسعار، حساب الأرباح والعمولات بدقة متناهية، والرقابة على الحسابات وكبار الاستشاريين.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs shrink-0">
            <div className="text-center px-3 border-l border-slate-800">
              <div className="text-[10px] text-slate-400">الشركات المتعاقدة</div>
              <div className="text-lg font-black text-amber-400 font-mono">{activeCompaniesCount}</div>
            </div>
            <div className="text-center px-3 border-l border-slate-800">
              <div className="text-[10px] text-slate-400">المنتجات النشطة</div>
              <div className="text-lg font-black text-teal-400 font-mono">{activeProductsCount}</div>
            </div>
            <div className="text-center px-3">
              <div className="text-[10px] text-slate-400">الحسابات المجمدة رقابياً</div>
              <div className="text-lg font-black text-rose-400 font-mono">{frozenUsersCount}</div>
            </div>
          </div>
        </div>

        {/* Historical V17–V20 recovery: direct entry to ORIGINAL working modules.
            No duplicate records, no replacement data store, no new accounting ledger. */}
        <section aria-label="استعادة إدارة الإصدارات السابقة" className="mt-5 rounded-2xl border border-emerald-600/40 bg-slate-950/60 p-4 space-y-3">
          <div className="text-right">
            <h3 className="font-bold text-emerald-200">الإدارة الأصلية — الوصول السريع</h3>
            <p className="text-xs text-slate-300">فتح شاشات V17–V20 الموجودة أصلًا لإدارة الأسعار والشركات والتسويات والمزارع. لا تُنشأ سجلات مكررة.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2" dir="rtl">
            {([
              ['products_catalog', 'الكتاكيت والعلاجات والأعلاف'],
              ['companies_portal', 'الشركات والموردون'],
              ['sales_settlement_v17', 'التسويق والتسويات وإيجار العنابر'],
              ['platform_v19_5', 'المستخدمون والفروع والمخزون'],
              ['sovereignty_v19', 'الأسواق والمحافظات والتشغيل'],
              ['enterprise_v19_6', 'المالية والخزينة والإدارة'],
              ['farm_management_v13', 'إدارة المزارع والعقود'],
              ['access_control', 'الصلاحيات وحسابات المستخدمين'],
              ['governance_authority', 'الرقابة وسجل التغييرات']
            ] as const).map(([target, label]) => (
              <button key={target} type="button" onClick={() => setActiveMainTab(target)}
                aria-pressed={activeMainTab === target}
                className={`min-h-12 rounded-xl border px-3 py-2 text-right text-sm font-semibold transition ${activeMainTab === target ? 'bg-emerald-700 text-white border-emerald-400' : 'bg-slate-900 text-slate-100 border-slate-700 hover:border-emerald-500'}`}>
                {label}
              </button>
            ))}
          </div>
        </section>
        {/* Enterprise module navigation */}
        <div className="spp-admin-modules grid grid-cols-2 md:grid-cols-3 xl:grid-cols-12 gap-2 pt-6 mt-6 border-t border-slate-800/80">
          <button
            onClick={() => setActiveMainTab('enterprise_v19_6')}
            className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 xl:col-span-2 ${
              activeMainTab === 'enterprise_v19_6'
                ? 'bg-gradient-to-l from-amber-400 via-emerald-400 to-cyan-400 text-slate-950 shadow-lg shadow-amber-500/20 font-black ring-1 ring-white/20'
                : 'bg-gradient-to-l from-amber-950/40 to-cyan-950/30 text-amber-100 hover:bg-slate-800/80 border border-amber-700/40'
            }`}
          >
            <Landmark className="w-4 h-4 shrink-0" />
            <div className="text-right">
              <div>القيادة والمالية</div>
              <div className="text-[10px] font-normal opacity-80">Preservation • Finance • Companies • Roles</div>
            </div>
          </button>
          <button
            onClick={() => setActiveMainTab('platform_v19_5')}
            className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 xl:col-span-2 ${
              activeMainTab === 'platform_v19_5'
                ? 'bg-gradient-to-l from-teal-400 to-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-black ring-1 ring-white/20'
                : 'bg-gradient-to-l from-teal-950/50 to-emerald-950/30 text-emerald-200 hover:bg-emerald-900/50 border border-emerald-700/40'
            }`}
          >
            <BriefcaseBusiness className="w-4 h-4 shrink-0" />
            <div className="text-right">
              <div>التشغيل المتكامل V19.5</div>
              <div className="text-[10px] font-normal opacity-80">Users • Chat • Catalog • Stock • Cases • Governance</div>
            </div>
          </button>

          <button
            onClick={() => setActiveMainTab('sovereignty_v19')}
            className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 xl:col-span-2 ${
              activeMainTab === 'sovereignty_v19'
                ? 'bg-gradient-to-l from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-black ring-1 ring-white/20'
                : 'bg-gradient-to-l from-emerald-950/50 to-cyan-950/30 text-emerald-200 hover:bg-emerald-900/50 border border-emerald-700/40'
            }`}
          >
            <RadioTower className="w-4 h-4 shrink-0" />
            <div className="text-right">
              <div>مركز السيادة التشغيلية V19</div>
              <div className="text-[10px] font-normal opacity-80">CEO • Logistics • Quality • AI • Finance</div>
            </div>
          </button>
          <button
            onClick={() => setActiveMainTab('lifecycle_v19_4')}
            className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeMainTab === 'lifecycle_v19_4'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-black'
                : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800/60'
            }`}
          >
            <ClipboardList className="w-4 h-4 shrink-0" />
            <div className="text-right">
              <div>دورة التشغيل V19.4 (الأساس)</div>
              <div className="text-[10px] font-normal opacity-80">Cases • Lots • Approvals • Audit</div>
            </div>
          </button>

          <button
            onClick={() => setActiveMainTab('revenue_engine')}
            className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeMainTab === 'revenue_engine'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 font-black'
                : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800/60'
            }`}
          >
            <DollarSign className="w-4 h-4 shrink-0" />
            <div className="text-right">
              <div>محرك المبيعات والأرباح</div>
              <div className="text-[10px] font-normal opacity-80">العمولات والمحفظة الرقمية</div>
            </div>
          </button>

          <button
            onClick={() => setActiveMainTab('companies_portal')}
            className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeMainTab === 'companies_portal'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 font-black'
                : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <div className="text-right">
              <div>مركز إدارة الشركاء</div>
              <div className="text-[10px] font-normal opacity-80">العقود والنسب الإقليمية</div>
            </div>
          </button>

          <button
            onClick={() => setActiveMainTab('products_catalog')}
            className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeMainTab === 'products_catalog'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 font-black'
                : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800/60'
            }`}
          >
            <Tag className="w-4 h-4 shrink-0" />
            <div className="text-right">
              <div>كتالوج الأصناف والأسعار</div>
              <div className="text-[10px] font-normal opacity-80">تفعيل/إيقاف بنقرة زر واحدة</div>
            </div>
          </button>

          <button
            onClick={() => setActiveMainTab('governance_authority')}
            className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeMainTab === 'governance_authority'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 font-black'
                : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <div className="text-right">
              <div>مرجع الرقابة والحسابات</div>
              <div className="text-[10px] font-normal opacity-80">الاستشاريون وموجهات الذكاء</div>
            </div>
          </button>

          <button
            onClick={() => setActiveMainTab('smart_operations')}
            className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeMainTab === 'smart_operations'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 font-black'
                : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <div className="text-right">
              <div>مركز العمليات الذكية</div>
              <div className="text-[10px] font-normal opacity-80">الطوارئ والآجل والتسعير والتسويق</div>
            </div>
          </button>

          <button
            onClick={() => setActiveMainTab('integrations_security')}
            className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeMainTab === 'integrations_security'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 font-black'
                : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800/60'
            }`}
          >
            <ServerCog className="w-4 h-4 shrink-0" />
            <div className="text-right">
              <div>التكاملات والأمان</div>
              <div className="text-[10px] font-normal opacity-80">FCM • الدفع • Login/RBAC</div>
            </div>
          </button>

          <button
            onClick={() => setActiveMainTab('enterprise_v11')}
            className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeMainTab === 'enterprise_v11'
                ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25 font-black'
                : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <div className="text-right">
              <div>تشغيل V11 الكامل</div>
              <div className="text-[10px] font-normal opacity-80">المخزون • الطلبات • المختبر • الأمان</div>
            </div>
          </button>

          <button
            onClick={() => setActiveMainTab('commercial_v12')}
            className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeMainTab === 'commercial_v12'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 font-black'
                : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800/60'
            }`}
          >
            <Handshake className="w-4 h-4 shrink-0" />
            <div className="text-right">
              <div>التجارة والعقود V12</div>
              <div className="text-[10px] font-normal opacity-80">AI • شركات • مسوقون • تمويل • مختبرات</div>
            </div>
          </button>

          <button
            onClick={() => setActiveMainTab('farm_management_v13')}
            className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeMainTab === 'farm_management_v13'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 font-black'
                : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800/60'
            }`}
          >
            <BriefcaseBusiness className="w-4 h-4 shrink-0" />
            <div className="text-right">
              <div>إدارة المزارع V13</div>
              <div className="text-[10px] font-normal opacity-80">عقود • تقارير • HR • AI • IoT</div>
            </div>
          </button>

          <button
            onClick={() => setActiveMainTab('clinical_v14')}
            className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeMainTab === 'clinical_v14'
                ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/25 font-black'
                : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800/60'
            }`}
          >
            <Brain className="w-4 h-4 shrink-0" />
            <div className="text-right">
              <div>التشخيص والإنتاج V14</div>
              <div className="text-[10px] font-normal opacity-80">ميدان • AI • مضادات • استشاري • Cloud</div>
            </div>
          </button>

          <button
            onClick={() => setActiveMainTab('enterprise_v15')}
            className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeMainTab === 'enterprise_v15'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 font-black'
                : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800/60'
            }`}
          >
            <CloudCog className="w-4 h-4 shrink-0" />
            <div className="text-right">
              <div>ERP الميداني V15</div>
              <div className="text-[10px] font-normal opacity-80">Offline • AI • Feed • Bluetooth • Excel</div>
            </div>
          </button>

          <button
            onClick={() => setActiveMainTab('leadership_v16')}
            className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeMainTab === 'leadership_v16'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 font-black'
                : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800/60'
            }`}
          >
            <RadioTower className="w-4 h-4 shrink-0" />
            <div className="text-right">
              <div>القيادة والميدان V16</div>
              <div className="text-[10px] font-normal opacity-80">War Room • CRM • GPS • WhatsApp</div>
            </div>
          </button>

          <button
            onClick={() => setActiveMainTab('sales_settlement_v17')}
            className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeMainTab === 'sales_settlement_v17'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25 font-black'
                : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800/60'
            }`}
          >
            <ArrowUpRight className="w-4 h-4 shrink-0" />
            <div className="text-right">
              <div>المبيعات والتسويات V17</div>
              <div className="text-[10px] font-normal opacity-80">مسوقون • موردون • Escrow • إيجار</div>
            </div>
          </button>

          <button
            onClick={() => setActiveMainTab('enterprise_v18')}
            className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeMainTab === 'enterprise_v18'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 font-black'
                : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4 shrink-0" />
            <div className="text-right">
              <div>الذكاء المؤسسي V18</div>
              <div className="text-[10px] font-normal opacity-80">مختبر • كتاكيت • معايير • Credit • TeleVet</div>
            </div>
          </button>

          <button
            onClick={() => setActiveMainTab('access_control')}
            className={`p-3 rounded-2xl text-xs font-bold transition flex items-center gap-2.5 ${
              activeMainTab === 'access_control'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 font-black'
                : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800/60'
            }`}
          >
            <KeyRound className="w-4 h-4 shrink-0" />
            <div className="text-right">
              <div>صلاحيات التحكم</div>
              <div className="text-[10px] font-normal opacity-80">من يمكنه التعديل؟</div>
            </div>
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeMainTab === 'enterprise_v19_6' && (
        <EnterpriseCommandV196Tab operations={smartOperations} onChange={onUpdateSmartOperations} />
      )}

      {activeMainTab === 'revenue_engine' && (
        <RevenueMarginEngineTab config={config} onUpdateConfig={handleConfigUpdate} />
      )}

      {activeMainTab === 'companies_portal' && (
        <CompaniesPortalTab
          companies={companies}
          onUpdateCompanies={onUpdateCompanies}
          onNavigateToCatalog={() => setActiveMainTab('products_catalog')}
        />
      )}

      {activeMainTab === 'products_catalog' && (
        <ProductsCatalogTab
          medicines={medicines}
          onUpdateMedicines={onUpdateMedicines}
          feeds={feeds}
          onUpdateFeeds={onUpdateFeeds}
          equipment={equipment}
          onUpdateEquipment={onUpdateEquipment}
          vaccines={vaccines}
          onUpdateVaccines={onUpdateVaccines}
          companies={companies}
        />
      )}

      {activeMainTab === 'governance_authority' && (
        <GovernanceAuthorityTab
          systemUsers={systemUsers}
          onUpdateSystemUsers={onUpdateSystemUsers}
          policies={policies}
          onUpdatePolicies={onUpdatePolicies}
          companies={companies}
          config={config}
        />
      )}



      {activeMainTab === 'integrations_security' && (
        <AdminIntegrationsSecurityTab
          operations={smartOperations}
          onUpdateOperations={onUpdateSmartOperations}
        />
      )}

      {activeMainTab === 'enterprise_v11' && (
        <EnterpriseOperationsV11Tab
          operations={smartOperations}
          onUpdateOperations={onUpdateSmartOperations}
        />
      )}


      {activeMainTab === 'commercial_v12' && (
        <CommercialClinicalV12Tab
          operations={smartOperations}
          onUpdateOperations={onUpdateSmartOperations}
        />
      )}

      {activeMainTab === 'farm_management_v13' && (
        <FarmManagementAutomationV13Tab
          operations={smartOperations}
          onUpdateOperations={onUpdateSmartOperations}
        />
      )}

      {activeMainTab === 'clinical_v14' && (
        <ClinicalProductionV14Tab
          operations={smartOperations}
          onUpdateOperations={onUpdateSmartOperations}
        />
      )}


      {activeMainTab === 'enterprise_v15' && (
        <EnterpriseERPEnhancementsV15Tab
          operations={smartOperations}
          onUpdateOperations={onUpdateSmartOperations}
        />
      )}

      {activeMainTab === 'leadership_v16' && (
        <LeadershipCRMFieldV16Tab
          operations={smartOperations}
          onUpdateOperations={onUpdateSmartOperations}
        />
      )}

      {activeMainTab === 'sales_settlement_v17' && (
        <SalesSettlementRoutingV17Tab
          operations={smartOperations}
          onUpdateOperations={onUpdateSmartOperations}
        />
      )}

      {activeMainTab === 'enterprise_v18' && (
        <EnterpriseCommandV18Tab
          operations={smartOperations}
          onUpdateOperations={onUpdateSmartOperations}
        />
      )}

      {activeMainTab === 'platform_v19_5' && (
        <PlatformOperationsV195Tab
          operations={smartOperations}
          onUpdateOperations={onUpdateSmartOperations}
        />
      )}

      {activeMainTab === 'sovereignty_v19' && (
        <SovereigntyOperationsV19Tab
          operations={smartOperations}
          onUpdateOperations={onUpdateSmartOperations}
        />
      )}

      {activeMainTab === 'lifecycle_v19_4' && (
        <OperationalLifecycleV194Tab />
      )}

      {activeMainTab === 'access_control' && (
        <AdminAccessControlTab
          staffMembers={staffMembers}
          onUpdateStaffMembers={onUpdateStaffMembers}
        />
      )}

      {activeMainTab === 'smart_operations' && (
        <SmartOperationsCenter
          operations={smartOperations}
          onUpdateOperations={onUpdateSmartOperations}
          saleRequests={poultrySaleRequests}
          onUpdateSaleRequests={onUpdatePoultrySaleRequests}
          poultryPrices={poultryPrices}
          onUpdatePoultryPrices={onUpdatePoultryPrices}
          staffMembers={staffMembers}
          acousticSessions={acousticSessions}
          necropsyCases={necropsyCases}
        />
      )}
    </div>
  );
};
