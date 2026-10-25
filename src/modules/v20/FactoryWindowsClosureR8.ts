import { FACTORY_FULL_SCREENS_V2029, type FactoryFullScreenDefinitionV2029 } from './FactoryFullScreenRegistryV20_2_9';

export type FactoryR8RoleId =
  | 'executive' | 'factory_manager' | 'procurement' | 'receiving' | 'nutritionist'
  | 'production_planner' | 'production_operator' | 'warehouse' | 'dispatch' | 'sales'
  | 'accountant' | 'treasury' | 'hr_payroll' | 'transport' | 'quality' | 'auditor_admin';

export interface FactoryR8RoleContract {
  id: FactoryR8RoleId;
  name_ar: string;
  name_en: string;
  sections: number[];
  responsibilities: string[];
  handoffs: string[];
  critical_screen_codes: string[];
}

export interface FactoryR8ScreenCapability {
  screen_code: string;
  section: number;
  owner_roles: FactoryR8RoleId[];
  can_create: boolean;
  can_update: boolean;
  can_approve: boolean;
  can_print: boolean;
  can_export: boolean;
  has_history: boolean;
  source_owner: 'S7'|'S12'|'S11'|'S13'|'S14'|'S15'|'FACTORY';
  acceptance_required: true;
}

const sectionOwner = (s:number):FactoryR8ScreenCapability['source_owner'] => {
  if(s===7) return 'S7';
  if(s===11) return 'S11';
  if(s===12) return 'S12';
  if(s===13) return 'S13';
  if(s===14) return 'S14';
  if(s===15) return 'S15';
  return 'FACTORY';
};

const rolesForSection = (s:number):FactoryR8RoleId[] => {
  const map:Record<number,FactoryR8RoleId[]> = {
    1:['factory_manager','warehouse','quality','procurement'],
    2:['factory_manager','procurement','accountant','auditor_admin'],
    3:['procurement','receiving','warehouse','accountant','factory_manager'],
    4:['nutritionist','quality','factory_manager'],
    5:['production_planner','warehouse','production_operator','factory_manager'],
    6:['production_operator','production_planner','quality','factory_manager'],
    7:['warehouse','receiving','dispatch','quality','accountant','auditor_admin'],
    8:['dispatch','warehouse','sales','transport','factory_manager'],
    9:['sales','dispatch','accountant','factory_manager'],
    10:['accountant','sales','treasury','factory_manager'],
    11:['hr_payroll','factory_manager','accountant'],
    12:['accountant','treasury','factory_manager','executive','auditor_admin'],
    13:['transport','dispatch','accountant','factory_manager'],
    14:['executive','factory_manager','accountant','quality','auditor_admin'],
    15:['auditor_admin','factory_manager','executive'],
  };
  return map[s] || ['factory_manager'];
};

export const FACTORY_R8_ROLE_CONTRACTS:FactoryR8RoleContract[] = [
  {id:'executive',name_ar:'الإدارة التنفيذية',name_en:'Executive',sections:[9,10,12,14,15],responsibilities:['اعتماد السياسات والحدود العليا','متابعة الأداء والمخاطر والتكلفة','اعتماد الاستثناءات الجوهرية'],handoffs:['Factory Manager → Executive','Accounting → Executive'],critical_screen_codes:['REP-01','REP-02','SET-06']},
  {id:'factory_manager',name_ar:'مدير المصنع',name_en:'Factory Manager',sections:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],responsibilities:['المسؤول التشغيلي الشامل','اعتماد خطط الإنتاج والصرف','متابعة العمال والمخزون والتكلفة والنقل'],handoffs:['All operational roles → Factory Manager','Factory Manager → Executive'],critical_screen_codes:['WO-01','PRD-01','DSP-01','REP-01']},
  {id:'procurement',name_ar:'المشتريات',name_en:'Procurement',sections:[1,2,3],responsibilities:['طلبات الشراء','عروض الموردين','أوامر الشراء والعقود','اختيار المورد المعتمد'],handoffs:['Warehouse/Planner → Procurement','Procurement → Receiving/Accounting'],critical_screen_codes:['PUR-01','PUR-02','PUR-03']},
  {id:'receiving',name_ar:'الاستلام والميزان',name_en:'Receiving & Weighbridge',sections:[3,7],responsibilities:['استلام المواد','مطابقة الكمية المرسلة/المستلمة','الوزن والجودة والحجر'],handoffs:['Procurement → Receiving','Receiving → S7/Accounting'],critical_screen_codes:['PUR-04','INV-01']},
  {id:'nutritionist',name_ar:'أخصائي التركيبات والتغذية',name_en:'Nutrition & Formulation',sections:[1,4,6],responsibilities:['إدارة التركيبات بادي/نامي/ناهي','المراجعة الغذائية','اعتماد إصدارات التركيبات'],handoffs:['Quality/Materials → Nutritionist','Nutritionist → Production Planner'],critical_screen_codes:['FRM-01','FRM-02']},
  {id:'production_planner',name_ar:'مخطط الإنتاج',name_en:'Production Planner',sections:[4,5,6],responsibilities:['خطة التشغيل','أوامر التشغيل','المواد المرحّلة WIP','مقارنة المخطط بالفعلي'],handoffs:['Nutritionist → Planner','Planner → Operator/Warehouse'],critical_screen_codes:['WO-01','WO-02','PRD-01']},
  {id:'production_operator',name_ar:'عامل/مشغل الإنتاج',name_en:'Production Operator',sections:[5,6],responsibilities:['بدء أمر التشغيل','إدخال الاستهلاك والإنتاج الفعلي','تسجيل الفروقات والوقت'],handoffs:['Planner → Operator','Operator → Supervisor/Manager'],critical_screen_codes:['PRD-01','PRD-02']},
  {id:'warehouse',name_ar:'المخازن',name_en:'Warehouse',sections:[1,3,5,7,8],responsibilities:['أرصدة يومية','حجز/تحويل/صرف','استلام المنتج النهائي','الجرد والحجر'],handoffs:['Receiving → Warehouse','Warehouse → Production/Dispatch'],critical_screen_codes:['INV-01','INV-02','INV-03']},
  {id:'dispatch',name_ar:'الصرف والشحن',name_en:'Dispatch',sections:[7,8,9,13],responsibilities:['تحضير الصرف','التحميل والتسليم','POD','المرتجعات'],handoffs:['Sales → Dispatch','Dispatch → Customer/Transport'],critical_screen_codes:['DSP-01','DSP-02','SLS-03']},
  {id:'sales',name_ar:'المبيعات',name_en:'Sales',sections:[8,9,10],responsibilities:['طلبات البيع','التسعير والائتمان','الفاتورة التجارية','حالة العميل'],handoffs:['Customer → Sales','Sales → Dispatch/Accounting'],critical_screen_codes:['SLS-01','SLS-02','STM-01']},
  {id:'accountant',name_ar:'محاسب المصنع',name_en:'Factory Accountant',sections:[2,3,9,10,11,12,13,14],responsibilities:['AP/AR والقيود','تكلفة التصنيع','مطابقة الفواتير','رواتب مستحقة','تقارير مالية'],handoffs:['Operations → Accounting','Accounting → Treasury/Executive'],critical_screen_codes:['ACC-01','ACC-02','STM-01','REP-02']},
  {id:'treasury',name_ar:'الخزينة',name_en:'Treasury',sections:[10,12],responsibilities:['الصندوق والبنك','المدفوعات والتحصيلات','الحوالات والأرصدة بالعملة'],handoffs:['Accounting → Treasury','Treasury → Supplier/Employee/Customer'],critical_screen_codes:['ACC-03','STM-02']},
  {id:'hr_payroll',name_ar:'الموارد البشرية والرواتب',name_en:'HR & Payroll',sections:[11,12],responsibilities:['ملفات العاملين','الحضور والإجازات','المكافآت والخصومات والسلف','الرواتب'],handoffs:['Supervisor → HR','HR → Accounting/Treasury'],critical_screen_codes:['HR-01','HR-02','HR-03']},
  {id:'transport',name_ar:'النقل والسائقون',name_en:'Transport',sections:[8,13],responsibilities:['السائقون والمركبات','المناطق والتعرفة','الرحلات والأجور وPOD'],handoffs:['Dispatch → Transport','Transport → Accounting'],critical_screen_codes:['TRP-01','TRP-02']},
  {id:'quality',name_ar:'الجودة والرقابة',name_en:'Quality',sections:[1,3,4,6,7,14],responsibilities:['قبول المواد','مراقبة جودة الإنتاج','الحجر والإفراج','فروقات الإنتاج والجرد'],handoffs:['Receiving/Production → Quality','Quality → Manager'],critical_screen_codes:['PRD-02','INV-03','REP-03']},
  {id:'auditor_admin',name_ar:'التدقيق والحوكمة',name_en:'Audit & Governance',sections:[2,7,12,14,15],responsibilities:['RBAC/SoD','سجل التدقيق','السياسات والإعدادات','فحص الحذف والتعديلات'],handoffs:['All sections → Audit','Audit → Executive'],critical_screen_codes:['SET-08','SET-09','SET-14']},
];

export const FACTORY_R8_SCREEN_CAPABILITIES:FactoryR8ScreenCapability[] = FACTORY_FULL_SCREENS_V2029.map((screen:FactoryFullScreenDefinitionV2029)=>{
  const readOnly = ['report','dashboard','history','statement'].includes(screen.kind);
  const settings = screen.kind==='settings';
  return {
    screen_code:screen.code,
    section:screen.section,
    owner_roles:rolesForSection(screen.section),
    can_create:!readOnly,
    can_update:!readOnly,
    can_approve:['workflow','detail','settings'].includes(screen.kind),
    can_print:true,
    can_export:true,
    has_history:true,
    source_owner:sectionOwner(screen.section),
    acceptance_required:true,
  };
});

export const FACTORY_R8_SCREEN_COUNT = FACTORY_R8_SCREEN_CAPABILITIES.length;

export function factoryR8RoleFromPlatformRole(role:string):FactoryR8RoleId {
  const r=String(role||'').toLowerCase();
  if(/owner|executive|super_admin/.test(r)) return 'executive';
  if(/factory.*manager|manager/.test(r)) return 'factory_manager';
  if(/procurement|purchase/.test(r)) return 'procurement';
  if(/receiv|weigh/.test(r)) return 'receiving';
  if(/nutrition|formula/.test(r)) return 'nutritionist';
  if(/planner/.test(r)) return 'production_planner';
  if(/worker|operator/.test(r)) return 'production_operator';
  if(/warehouse|inventory|store/.test(r)) return 'warehouse';
  if(/dispatch|shipping/.test(r)) return 'dispatch';
  if(/sales|commercial|marketing/.test(r)) return 'sales';
  if(/treasury|cashier/.test(r)) return 'treasury';
  if(/account|finance/.test(r)) return 'accountant';
  if(/hr|payroll/.test(r)) return 'hr_payroll';
  if(/transport|driver/.test(r)) return 'transport';
  if(/quality|qa|qc/.test(r)) return 'quality';
  if(/audit|admin|govern/.test(r)) return 'auditor_admin';
  return 'factory_manager';
}

export function factoryR8RoleContract(role:string){
  const id=factoryR8RoleFromPlatformRole(role);
  return FACTORY_R8_ROLE_CONTRACTS.find(x=>x.id===id)!;
}

export const FACTORY_R8_CRITICAL_CHAINS = [
  {code:'CHAIN-PROCURE',name_ar:'المورد → طلب شراء → عروض → PO → استلام → مخزون → AP',sections:[2,3,7,12]},
  {code:'CHAIN-PRODUCE',name_ar:'تركيبة → أمر تشغيل → staging/WIP → إنتاج فعلي → منتج نهائي → تكلفة',sections:[4,5,6,7,12]},
  {code:'CHAIN-SELL',name_ar:'طلب بيع → ائتمان → صرف → تسليم/POD → فاتورة → تحصيل → كشف عميل',sections:[9,8,7,12,10]},
  {code:'CHAIN-HR',name_ar:'عامل → حضور/إجازة/سلفة → راتب → مستحق → دفع خزينة',sections:[11,12]},
  {code:'CHAIN-TRANSPORT',name_ar:'منطقة/تعرفة → رحلة → تحميل → POD → مطالبة/أجر → محاسبة',sections:[13,8,12]},
  {code:'CHAIN-COST',name_ar:'مواد S7 + عمل S11 + مصاريف S12 + إنتاج S6 → تكلفة نهائية → true-up',sections:[7,11,12,6]},
] as const;

export function factoryR8ScreenCapability(code:string){
  return FACTORY_R8_SCREEN_CAPABILITIES.find(x=>x.screen_code===code);
}

export function factoryR8ScreensForRole(role:string){
  const contract=factoryR8RoleContract(role);
  return FACTORY_FULL_SCREENS_V2029.filter(x=>contract.sections.includes(x.section));
}
