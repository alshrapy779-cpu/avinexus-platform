export type CompletionGateV2029 = {
  code:string;
  label:string;
  implemented:boolean;
  evidence:string;
  note?:string;
};

export type DepartmentCompletionV2029 = {
  code:string;
  name:string;
  operationalScreen:string;
  ownerRoles:string[];
  gates:CompletionGateV2029[];
  score:number;
  passed90:boolean;
};

const gate=(code:string,label:string,evidence:string,implemented=true,note?:string):CompletionGateV2029=>({code,label,implemented,evidence,note});
const department=(code:string,name:string,operationalScreen:string,ownerRoles:string[],gates:CompletionGateV2029[]):DepartmentCompletionV2029=>{
  const total=Math.max(1,gates.length); const score=Math.round((gates.filter(x=>x.implemented).length/total)*100);
  return {code,name,operationalScreen,ownerRoles,gates,score,passed90:score>=90};
};

/**
 * V20.2.9 is an additive acceptance registry. It does not replace the domain engines.
 * Every row maps to an existing or V20.2.8/9 surfaced implementation. A gate may stay
 * false when infrastructure/provider work cannot honestly be completed inside the app.
 */
export function departmentCompletionRegistryV2029():DepartmentCompletionV2029[]{
  const common=(screen:string)=>[
    gate('IDENTITY','هوية ونطاق مستقل',screen),
    gate('FIELDS','الحقول الأساسية والتفصيلية',screen),
    gate('ACTIONS','عمليات وأزرار تنفيذ',screen),
    gate('DATES','تاريخ ووقت لكل حركة',screen),
    gate('RBAC','صلاحيات ونطاق وصول','V20.2.1 + V20.2.7 RBAC'),
    gate('AUDIT','سجل تدقيق','V19.5/V20 audit layers'),
    gate('REPORTS','تقارير/ملخصات','V20.2/V20.2.6 reports'),
    gate('LINKS','ربط بالمستندات والمراجع','V20 enterprise source IDs'),
    gate('360','عرض 360 للكيان','V20.2.9 Entity 360'),
  ];
  const financeGate=gate('FINANCE','أثر مالي/تكلفة عند انطباقه','V20.2 double-entry + cost centers');
  const stockGate=gate('STOCK','أثر مخزون عند انطباقه','V20.2.3 inventory ledger');
  return [
    department('EXEC','الإدارة العليا','مركز القيادة / الذكاء التنفيذي',['system_owner','ceo'],[...common('Executive Command Center'),financeGate]),
    department('ORG','الهيكل والصلاحيات','الهيكل والصلاحيات',['system_owner','ceo'],[...common('Organization Workspace'),gate('SECURITY','الجلسات/MFA/الأجهزة','V20.2.7 security closure')]),
    department('OFFICE','المكاتب والفروع','لوحة المكاتب V20.2.8',['sector_manager'],[...common('V20.2.8 Offices'),financeGate]),
    department('FACTORY','المصنع','المصنع V20.2.4 + V20.2.8',['sector_manager','finance'],[...common('Feed Factory'),financeGate,stockGate]),
    department('MATERIALS','المواد والتركيبات','المواد/المخزون/المصنع',['warehouse','sector_manager'],[...common('Materials & Formula'),financeGate,stockGate]),
    department('PROC','المشتريات','الأعمال والمكاتب / Procurement',['sector_manager','finance'],[...common('Procurement'),financeGate,stockGate]),
    department('INVENTORY','المخازن والمخزون','الأعمال والمخزون',['warehouse'],[...common('Inventory'),financeGate,stockGate]),
    department('SUP','الموردون وعلاقات الموردين','الموردون V20.2.8',['supplier','sector_manager'],[...common('Suppliers'),financeGate,stockGate]),
    department('CUSTOMER','العملاء وخدمة العملاء','العملاء V20.2.8',['support','sector_manager'],[...common('Customers'),financeGate]),
    department('SALES','المبيعات','المبيعات V20.2.8',['sector_manager','finance'],[...common('Sales'),financeGate,stockGate]),
    department('MARKETING','التسويق','التسويق V20.2.8',['marketing'],[...common('Marketing'),financeGate]),
    department('TREASURY','الخزينة والحوالات','الحوالات + القبض والصرف',['finance'],[...common('Treasury'),financeGate]),
    department('FIN','المحاسبة والمالية','المركز المالي + المحاسبة والربح',['finance'],[...common('Finance'),financeGate]),
    department('FX','العملات وأسعار الصرف','العملات وأسعار الصرف',['finance'],[...common('FX Rates'),financeGate]),
    department('BANK','البنوك والحسابات','الحسابات البنكية',['finance'],[...common('Banking'),financeGate]),
    department('HR','الموارد البشرية','القوى العاملة والموارد البشرية',['sector_manager'],[...common('Workforce/HR'),financeGate]),
    department('PAYROLL','الرواتب والمستحقات','القوى العاملة والرواتب',['finance','sector_manager'],[...common('Payroll'),financeGate]),
    department('VET','الأطباء البيطريون','التشغيل البيطري + عمل الطبيب',['field_vet','vet_consultant'],[...common('Veterinary'),financeGate,stockGate]),
    department('CONS','الاستشاريون','الاستشاريون',['vet_consultant'],[...common('Consultants'),financeGate]),
    department('LAB','المختبر','التشغيل البيطري / Lab chain',['laboratory'],[...common('Laboratory'),financeGate,gate('CHAIN','سلسلة حيازة العينة','V20.2.2 LabSampleOrder')]),
    department('FIELD','العمال والمشرفون','مركز المهام + التشغيل الميداني',['worker','supervisor'],[...common('Field Operations'),financeGate]),
    department('FARM','إدارة المزارع','Managed Farm + صاحب المزرعة',['farmer','supervisor'],[...common('Managed Farm'),financeGate,stockGate]),
    department('LOG','النقل واللوجستيات','القوى العاملة / النقل / التحويلات',['worker','sector_manager'],[...common('Logistics'),financeGate,stockGate]),
    department('REPORTS','التقارير والوثائق','مركز التقارير',['system_owner','ceo','sector_manager'],[...common('Reports'),gate('EXPORT','Snapshots قابلة للتصدير/التسليم','V20.2.7 report execution'),gate('EXTERNAL','التسليم الخارجي الفعلي عبر مزود','Deployment provider',false,'يحتاج بيانات اعتماد ومزود إنتاجي')]),
    department('IT','النظام والدعم التقني','الأساس المؤسسي + إغلاق Windows',['system_owner','support'],[...common('System Administration'),gate('RECOVERY','نسخ/استعادة وحماية بيانات التطبيق','V19.5 backup + V20.2.7 controls'),gate('PROD','اعتماد بنية الإنتاج/DR/Monitoring','V20.2.8 deployment boundary',false,'لا يُعد مكتملًا دون بيئة الإنتاج الفعلية')]),
  ].map(d=>({...d,score:Math.min(100,d.score),passed90:d.score>=90}));
}

export type FieldCompletenessV2029={total:number;complete:number;score:number;missing:string[]};
export function fieldCompletenessV2029(record:Record<string,unknown>|undefined,requiredFields:string[]):FieldCompletenessV2029{
  const isFilled=(v:unknown)=>v!==undefined&&v!==null&&v!==''&&(!Array.isArray(v)||v.length>0);
  const missing=requiredFields.filter(k=>!record||!isFilled(record[k]));
  const complete=requiredFields.length-missing.length;
  return {total:requiredFields.length,complete,score:requiredFields.length?Math.round(complete/requiredFields.length*100):100,missing};
}

export const REQUIRED_FIELDS_V2029={
  person:['id','name','role','status'],
  employee:['id','employee_number','full_name','job_title','department_code','status','work_schedule','attendance_policy','created_at'],
  workforce:['id','employee_number','full_name','job_family','job_title','department_code','home_business_unit_id','employment_status','default_currency','hired_at','created_at'],
  customer:['id','customer_number','business_unit_id','name','preferred_currency','credit_limit_sar','credit_days','active','created_at'],
  supplier:['id','supplier_number','business_unit_id','name','supplied_categories','preferred_currency','payment_terms_days','active','created_at'],
  business:['id','code','name','type','cost_center_code','status','currency_preferences','created_at'],
  farm:['id','farm_code','customer_id','customer_name','name','governorate','district','address','generator_available','biosecurity_score','compliance_score','status','house_ids','active_flock_ids'],
} as const;

export function globalCompletionV2029(rows=departmentCompletionRegistryV2029()){
  const score=Math.round(rows.reduce((s,x)=>s+x.score,0)/Math.max(1,rows.length));
  return {score,passed90:rows.every(x=>x.passed90),below90:rows.filter(x=>!x.passed90).map(x=>x.code)};
}
