export type FarmScreenKindV2029='master'|'detail'|'workflow'|'dashboard'|'history'|'quality'|'clinical'|'finance'|'report'|'settings'|'offline';
export interface FarmScreenDefinitionV2029{section:number;section_code:string;section_name_ar:string;code:string;name_ar:string;name_en:string;kind:FarmScreenKindV2029;purpose_ar:string;route:string;capabilities:string[];}

type RawScreen=[string,string,FarmScreenKindV2029];
type RawSection={section:number;code:string;name_ar:string;screens:RawScreen[]};
const s=(code:string,name_ar:string,kind:FarmScreenKindV2029='workflow'):RawScreen=>[code,name_ar,kind];

const SECTIONS:RawSection[]=[
  {section:1,code:'CORE',name_ar:'الهيكل والملكية والملف 360',screens:[
    s('CORE-01','دليل المزارع','master'),s('CORE-02','ملف المزرعة 360','detail'),s('CORE-03','إنشاء وربط المزرعة'),s('CORE-04','علاقة مالك المزرعة','master'),s('CORE-05','ملف المالك 360','detail'),s('CORE-06','الشركة/الجهة المالكة','detail'),s('CORE-07','الفروع والمواقع','master'),s('CORE-08','الموقع الجغرافي','detail'),s('CORE-09','الطاقة والمياه والبنية التحتية','detail'),s('CORE-10','قدرة المزرعة والطاقة الاستيعابية','detail'),s('CORE-11','حالة المزرعة ودورة حياتها','workflow'),s('CORE-12','السجل الزمني للمزرعة','history'),s('CORE-13','المستندات والمرفقات','detail'),s('CORE-14','لوحة المزرعة التنفيذية','dashboard')
  ]},
  {section:2,code:'HIER',name_ar:'الحظائر والقطعان والدورات والاستقبال',screens:[
    s('HIER-01','دليل الحظائر','master'),s('HIER-02','ملف الحظيرة 360','detail'),s('HIER-03','إضافة/تعديل الحظيرة'),s('HIER-04','تجهيز الحظيرة قبل الاستقبال'),s('HIER-05','قائمة التحقق قبل التسكين'),s('HIER-06','دليل دورات القطيع','master'),s('HIER-07','إنشاء دورة قطيع'),s('HIER-08','استلام الكتاكيت والتسكين'),s('HIER-09','تفاصيل المفرخ والدفعة','detail'),s('HIER-10','أوزان الوصول','detail'),s('HIER-11','حالة الدورة ومراحلها','workflow'),s('HIER-12','إغلاق دورة القطيع'),s('HIER-13','تاريخ الدورات السابقة','history'),s('HIER-14','مقارنة الحظائر والدورات','dashboard')
  ]},
  {section:3,code:'DAILY',name_ar:'التشغيل اليومي والسكان والنفوق',screens:[
    s('DAY-01','سجل التشغيل اليومي','workflow'),s('DAY-02','إدخال العامل اليومي'),s('DAY-03','إقفال اليوم'),s('DAY-04','مراجعة المشرف'),s('DAY-05','سجل Bird Population Event','history'),s('DAY-06','التسكين السكاني'),s('DAY-07','النفوق اليومي'),s('DAY-08','الاستبعاد Culling'),s('DAY-09','التحويلات السكانية'),s('DAY-10','التسوية وإعادة المطابقة'),s('DAY-11','لقطة العدد الحالية','dashboard'),s('DAY-12','أوزان العينات'),s('DAY-13','تجانس القطيع CV/Uniformity','dashboard'),s('DAY-14','ملاحظات العامل'),s('DAY-15','الأدلة اليومية'),s('DAY-16','المهام اليومية'),s('DAY-17','الاستثناءات اليومية','dashboard'),s('DAY-18','سجل تعديلات اليوم','history')
  ]},
  {section:4,code:'NUTR',name_ar:'العلف والمياه والبيئة والجودة',screens:[
    s('NUTR-01','استهلاك العلف اليومي'),s('NUTR-02','رصيد العلف بالحظيرة','dashboard'),s('NUTR-03','صرف العلف من المخزون'),s('NUTR-04','سجل الفاقد من العلف'),s('NUTR-05','استهلاك المياه اليومي'),s('NUTR-06','عدادات المياه'),s('NUTR-07','معالجة ومياه الأدوية'),s('NUTR-08','قراءات الحرارة والرطوبة','dashboard'),s('NUTR-09','قراءات الأمونيا وCO2','dashboard'),s('NUTR-10','قراءات سرعة الهواء والضغط','dashboard'),s('NUTR-11','سجل الحساسات غير القابل للتعديل','history'),s('NUTR-12','فحوص جودة المياه','quality'),s('NUTR-13','فحوص جودة العلف','quality'),s('NUTR-14','انحرافات الجودة والإجراءات','quality'),s('NUTR-15','FCR وكفاءة التغذية','dashboard'),s('NUTR-16','لوحة التغذية والبيئة','dashboard')
  ]},
  {section:5,code:'BIO',name_ar:'الأمان الحيوي والتنظيف والتطهير',screens:[
    s('BIO-01','لوحة الأمان الحيوي','dashboard'),s('BIO-02','فحص الدخول اليومي','quality'),s('BIO-03','الزوار والمركبات'),s('BIO-04','أحواض التطهير Footbath'),s('BIO-05','مكافحة الآفات'),s('BIO-06','التخلص من النافق'),s('BIO-07','التنظيف والتطهير'),s('BIO-08','حادث أمان حيوي'),s('BIO-09','الإجراءات التصحيحية'),s('BIO-10','التحقق من الإغلاق'),s('BIO-11','قوالب الأمان الحيوي','settings'),s('BIO-12','سجل التدقيق الحيوي','history')
  ]},
  {section:6,code:'VET',name_ar:'الصحة والطب البيطري والاستشارات',screens:[
    s('VET-01','لوحة الطبيب','dashboard'),s('VET-02','دليل الحالات السريرية','clinical'),s('VET-03','فتح حالة سريرية','clinical'),s('VET-04','ملف الحالة 360','clinical'),s('VET-05','التشخيص التفريقي','clinical'),s('VET-06','قرار الطبيب','clinical'),s('VET-07','تصعيد الاستشاري','clinical'),s('VET-08','غرفة الاستشاري','clinical'),s('VET-09','الوصفات الطبية','clinical'),s('VET-10','تنفيذ الدواء','clinical'),s('VET-11','خطة التحصين','clinical'),s('VET-12','تنفيذ التحصين','clinical'),s('VET-13','فترة السحب والمنع التسويقي','clinical'),s('VET-14','التشريح Necropsy','clinical'),s('VET-15','مراقبة الحالة بعد العلاج','clinical'),s('VET-16','إغلاق الحالة','clinical'),s('VET-17','سجل القرارات السريرية','history'),s('VET-18','مؤشرات الصحة والانسحاب','dashboard')
  ]},
  {section:7,code:'LAB',name_ar:'المختبر والعينات والنتائج',screens:[
    s('LAB-01','دليل المختبرات والشركاء','master'),s('LAB-02','ملف المختبر 360','detail'),s('LAB-03','إنشاء طلب فحص','clinical'),s('LAB-04','تسجيل العينة','clinical'),s('LAB-05','جمع العينة','clinical'),s('LAB-06','سلسلة الحيازة Chain of Custody','history'),s('LAB-07','استلام المختبر','clinical'),s('LAB-08','تشغيل الفحوص','clinical'),s('LAB-09','إدخال نتيجة أولية','clinical'),s('LAB-10','مراجعة LabReviewer','clinical'),s('LAB-11','اعتماد النتيجة النهائية','clinical'),s('LAB-12','تعديل نتيجة بإصدار جديد','clinical'),s('LAB-13','ربط النتيجة بالحالة','detail'),s('LAB-14','لوحة المختبر','dashboard')
  ]},
  {section:8,code:'TEAM',name_ar:'الفريق والتكليفات والأدوار',screens:[
    s('TEAM-01','دليل فريق المزرعة','master'),s('TEAM-02','ملف الموظف بالمزرعة','detail'),s('TEAM-03','التكليفات الفعالة'),s('TEAM-04','تكليف مدير المزرعة'),s('TEAM-05','تكليف المشرف'),s('TEAM-06','تكليف العامل'),s('TEAM-07','تكليف الطبيب'),s('TEAM-08','تكليف الاستشاري'),s('TEAM-09','تكليف المحاسب'),s('TEAM-10','المساعد البيطري وفني المختبر'),s('TEAM-11','المدير الإقليمي'),s('TEAM-12','سجل تغييرات التكليفات','history')
  ]},
  {section:9,code:'SUPPLY',name_ar:'المخزون والاحتياجات والمشتريات',screens:[
    s('SUP-01','احتياجات المزرعة'),s('SUP-02','موافقة مالك المزرعة'),s('SUP-03','فحص التوفر'),s('SUP-04','طلب شراء للمزرعة'),s('SUP-05','أمر الشراء'),s('SUP-06','استلام المواد'),s('SUP-07','التحويل من المصنع/المخزن'),s('SUP-08','طلب حركة S7'),s('SUP-09','سجل تكامل S7','history'),s('SUP-10','استهلاك الأدوية واللقاحات'),s('SUP-11','الاستهلاك الفعلي للعلف'),s('SUP-12','لوحة إمداد المزرعة','dashboard')
  ]},
  {section:10,code:'ECON',name_ar:'المالية والاقتصاد والسوق والقياس',screens:[
    s('ECO-01','مطالبات مصاريف المزرعة','finance'),s('ECO-02','اعتماد المصروف','finance'),s('ECO-03','تكامل Section 12','finance'),s('ECO-04','تكلفة الدورة','finance'),s('ECO-05','تكلفة الحظيرة','finance'),s('ECO-06','تكلفة المزرعة','finance'),s('ECO-07','تكلفة الطائر','finance'),s('ECO-08','تكلفة كجم الزيادة','finance'),s('ECO-09','أسعار السوق','finance'),s('ECO-10','مصدر سعر السوق Provider/Manual','settings'),s('ECO-11','نقطة التعادل','finance'),s('ECO-12','الربحية والهامش','finance'),s('ECO-13','Benchmark الدورة','report'),s('ECO-14','Benchmark الحظيرة','report'),s('ECO-15','Benchmark المزرعة','report'),s('ECO-16','لوحة الاقتصاد والإغلاق','dashboard')
  ]},
  {section:11,code:'FIELD',name_ar:'العمل الميداني Offline والوسائط والتنبيهات',screens:[
    s('FLD-01','حالة الاتصال والمزامنة','offline'),s('FLD-02','الطابور المشفر Offline Queue','offline'),s('FLD-03','عمليات Idempotency','offline'),s('FLD-04','انحراف ساعة الجهاز','offline'),s('FLD-05','حل التعارض حسب الحقل','offline'),s('FLD-06','رفع الصور المشفر','offline'),s('FLD-07','رفع الفيديو المشفر','offline'),s('FLD-08','رفع الصوت المشفر','offline'),s('FLD-09','مركز الأدلة والوسائط','detail'),s('FLD-10','مركز تنبيهات المزرعة','dashboard'),s('FLD-11','مركز مهام المزرعة','workflow'),s('FLD-12','مهامي حسب الدور','dashboard'),s('FLD-13','سجل المزامنة والتعارضات','history')
  ]},
  {section:12,code:'GOV',name_ar:'التقارير والحوكمة والبيانات المرجعية',screens:[
    s('GOV-01','مركز تقارير المزرعة','report'),s('GOV-02','تقرير التشغيل اليومي','report'),s('GOV-03','تقرير السكان والنفوق','report'),s('GOV-04','تقرير العلف والمياه','report'),s('GOV-05','تقرير البيئة','report'),s('GOV-06','تقرير الصحة والمختبر','report'),s('GOV-07','تقرير الأمان الحيوي','report'),s('GOV-08','تقرير تكلفة الدورة','report'),s('GOV-09','تقرير الإغلاق النهائي','report'),s('GOV-10','تنفيذ التقارير عبر Section 14','report'),s('GOV-11','دليل السلالات والإصدارات','settings'),s('GOV-12','ملف المفرخ التشغيلي','settings'),s('GOV-13','المراجع السريرية','settings'),s('GOV-14','معايير المياه والعلف','settings'),s('GOV-15','مكتبة القوالب','settings'),s('GOV-16','سياسات SLA والمراجعة عبر Section 15','settings'),s('GOV-17','سجل التدقيق الكامل','history'),s('GOV-18','بوابة اكتمال Farm 100%','dashboard')
  ]}
];

export const FARM_DIVISION_SECTIONS_V2029=SECTIONS.map(x=>({section:x.section,code:x.code,name_ar:x.name_ar,count:x.screens.length}));
const KIND_CAPABILITIES:Record<FarmScreenKindV2029,string[]>={
  master:['search','filter','create','edit','history','export'],
  detail:['view','edit','history','documents','export'],
  workflow:['create','submit','approve','reject','history'],
  dashboard:['refresh','filter','drilldown','export','print'],
  history:['search','filter','audit','export','print'],
  quality:['record','review','corrective_action','history','export'],
  clinical:['create','update','escalate','close','history'],
  finance:['create','approve','send_to_s12','history','export'],
  report:['generate','filter','export','print','history'],
  settings:['create_version','activate','history','export'],
  offline:['queue','sync','resolve_conflict','history','export']
};
export const FARM_DIVISION_SCREENS_V2029:FarmScreenDefinitionV2029[]=SECTIONS.flatMap(sec=>sec.screens.map(([code,name_ar,kind])=>({
  section:sec.section,section_code:sec.code,section_name_ar:sec.name_ar,code,name_ar,name_en:name_ar,kind,
  route:`/farm/${sec.code.toLowerCase()}/${code.toLowerCase()}`,
  capabilities:[...KIND_CAPABILITIES[kind]],
  purpose_ar:`شاشة مستقلة ضمن قسم المزارع ${sec.section} (${sec.name_ar}) لتنفيذ ومراجعة ${name_ar} مع صلاحيات وتاريخ وتدقيق وربط بمصدر الحقيقة دون حذف أو إنشاء دفتر مكرر.`
})));
export const FARM_DIVISION_SCREEN_COUNT_V2029=FARM_DIVISION_SCREENS_V2029.length;
export function farmScreensForSectionV2029(section:number){return FARM_DIVISION_SCREENS_V2029.filter(x=>x.section===section);}
export function farmScreenByCodeV2029(code:string){return FARM_DIVISION_SCREENS_V2029.find(x=>x.code===code);}
