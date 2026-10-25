import type { PlatformRoleV195 } from '../platform/PlatformCoreV19_5';
import type {
  DailyFarmPlanV197,
  FarmTaskV197,
  ManagedOperationsStateV197,
  VeterinaryDecisionV197,
} from '../managed/ManagedPoultryOperationsV19_7';
import type { FarmAssignmentRoleV2029, FarmDivisionStateV2029 } from './FarmDivisionCompletionV20_2_9';

export type FarmOperationalRoleR6 =
  | 'executive'
  | 'regional_manager'
  | 'farm_owner'
  | 'farm_manager'
  | 'supervisor'
  | 'worker'
  | 'doctor'
  | 'consultant'
  | 'vet_assistant'
  | 'lab_technician'
  | 'accountant'
  | 'inventory_support'
  | 'supplier'
  | 'commercial'
  | 'support';

export interface FarmRoleContractR6 {
  role: FarmOperationalRoleR6;
  name_ar: string;
  mission_ar: string;
  responsibilities: string[];
  inputs: string[];
  outputs: string[];
  handoff_to: FarmOperationalRoleR6[];
  required_evidence: string[];
  can_approve: string[];
  prohibited: string[];
  default_screen: string;
}

export interface FarmRoleInboxItemR6 {
  id: string;
  type: 'task'|'alert'|'daily_report'|'vet_decision'|'lab'|'expense'|'requirement'|'handoff'|'document';
  title: string;
  detail: string;
  priority: 'normal'|'high'|'critical';
  status: string;
  source_id: string;
  screen_code: string;
}

export interface VetPlanApprovalInputR6 {
  decision_id: string;
  vet_name: string;
  vet_note: string;
  decision: 'approved'|'modified'|'rejected';
  treatment_category: 'no_treatment'|'supportive'|'anti_inflammatory'|'antipyretic'|'anticoccidial'|'antibiotic'|'vaccine'|'lab_investigation';
  medication_name?: string;
  active_ingredient?: string;
  dose_instruction?: string;
  duration_days?: number;
  withdrawal_days?: number;
  feed_target_kg?: number;
  temperature_target_c?: number;
  water_target_liters?: number;
  extra_actions?: string[];
}

const now=()=>new Date().toISOString();
const rid=(p:string)=>`${p}-R6-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
const tomorrowDate=(date:string)=>new Date(new Date(`${date}T00:00:00`).getTime()+86400000).toISOString().slice(0,10);

export const FARM_ROLE_CONTRACTS_R6:FarmRoleContractR6[]=[
  {role:'executive',name_ar:'المالك التنفيذي / الإدارة العليا',mission_ar:'متابعة الأداء والمخاطر والمال والالتزام دون تنفيذ الأعمال اليومية بدل أصحابها.',responsibilities:['مراقبة جميع المزارع والدورات','مراجعة الاستثناءات الحرجة','متابعة الربحية والتكلفة','مراقبة اكتمال الأقسام والصلاحيات'],inputs:['لوحات المديرين','تقارير الطبيب والمختبر','تقارير المالية والمخزون'],outputs:['قرارات إدارية','تصعيدات','اعتمادات استراتيجية'],handoff_to:['regional_manager','farm_manager','accountant'],required_evidence:['تقارير ثابتة','سجل تدقيق'],can_approve:['استثناءات عالية المستوى','اعتمادات حسب حدود الصلاحية'],prohibited:['تعديل السجلات الميدانية بصمت','وصف دواء بدل الطبيب'],default_screen:'R6-ROLE-EXEC'},
  {role:'regional_manager',name_ar:'المدير الإقليمي',mission_ar:'إدارة مجموعة مزارع ومقارنة الأداء وتوجيه مديري المزارع.',responsibilities:['مقارنة المزارع','متابعة SLA والتنبيهات','إدارة التصعيدات بين المزارع','مراجعة اكتمال التشغيل'],inputs:['لوحات المزارع','التقارير اليومية','التنبيهات'],outputs:['أوامر متابعة','تصعيدات للإدارة','خطط تصحيح'],handoff_to:['farm_manager','executive'],required_evidence:['ملاحظات القرار','تقارير المقارنة'],can_approve:['إجراءات تشغيلية حسب السياسة'],prohibited:['تجاوز الطبيب في العلاج','تجاوز Section 12 في المحاسبة'],default_screen:'R6-ROLE-REGIONAL'},
  {role:'farm_owner',name_ar:'مالك المزرعة',mission_ar:'رؤية حالة مزرعته وتكاليفها وموافقاته دون الوصول لدفاتر داخلية غير مصرح بها.',responsibilities:['متابعة القطيع','مراجعة التكلفة والنتائج','الموافقة على الاحتياجات التي تتطلب موافقته','متابعة خطة الغد'],inputs:['لوحة المزرعة','طلبات الموافقة','التقارير المالية المسموحة'],outputs:['موافقة/رفض','تمويل المالك عند الحاجة'],handoff_to:['farm_manager','accountant'],required_evidence:['طلب شراء','ملخص سبب المصروف'],can_approve:['احتياجات المزرعة ضمن العقد'],prohibited:['تعديل السجل الطبي','الترحيل المحاسبي المباشر'],default_screen:'R6-ROLE-OWNER'},
  {role:'farm_manager',name_ar:'مدير المزرعة',mission_ar:'ربط العمال والمشرف والطبيب والمحاسب والمخزون في دورة تشغيل واحدة.',responsibilities:['توزيع الأعمال','مراجعة الإقفال اليومي','متابعة العلف والماء والنفوق','متابعة خطة الغد','رفع الاحتياجات','متابعة الصيانة'],inputs:['تقارير العمال','قرارات الطبيب','تنبيهات المخزون','طلبات المالية'],outputs:['اعتماد تشغيلي','مهام','تصعيدات','احتياجات شراء'],handoff_to:['supervisor','doctor','accountant','regional_manager'],required_evidence:['إقفال يومي','مرفقات عند المخالفة'],can_approve:['المراجعة التشغيلية','إقفال المهام'],prohibited:['اعتماد الدواء دون الطبيب','إنشاء قيد GL'],default_screen:'R6-ROLE-MANAGER'},
  {role:'supervisor',name_ar:'المشرف',mission_ar:'التحقق من إدخال العامل وجودة التنفيذ قبل التسليم للمدير والطبيب.',responsibilities:['مراجعة التقرير اليومي','التحقق من النفوق والأوزان','متابعة تنفيذ المهام','توثيق المخالفات'],inputs:['إدخال العامل','الوسائط','الحساسات'],outputs:['مراجعة مشرف','طلب تصحيح','تصعيد'],handoff_to:['farm_manager','doctor'],required_evidence:['صور/ملاحظات عند الانحراف'],can_approve:['مراجعة التشغيل الميداني'],prohibited:['صرف علاج غير معتمد','اعتماد مصروف محاسبي'],default_screen:'R6-ROLE-SUPERVISOR'},
  {role:'worker',name_ar:'العامل / المربي',mission_ar:'إدخال البيانات اليومية وتنفيذ خطة اليوم وإثبات التنفيذ.',responsibilities:['إدخال النفوق','العلف والماء','الحرارة والرطوبة','أوزان العينات','الأعراض والملاحظات','تنفيذ المهام المعتمدة'],inputs:['خطة اليوم','تعليمات المشرف والطبيب'],outputs:['تقرير يومي','أدلة','إشعار تعذر التنفيذ'],handoff_to:['supervisor','farm_manager','doctor'],required_evidence:['وسائط عند الحاجة','توقيع/وقت الإدخال'],can_approve:[],prohibited:['اختيار علاج من تلقاء نفسه','تعديل يوم مغلق'],default_screen:'R6-DAILY-ENTRY'},
  {role:'doctor',name_ar:'الطبيب البيطري',mission_ar:'مراجعة بيانات القطيع واتخاذ القرار الطبي النهائي وتحديد خطة الغد السريرية.',responsibilities:['مراجعة AI والبيانات','تشخيص الحالات','اعتماد/تعديل خطة الغد','وصف العلاج والتحصين','تحديد فترة السحب','طلب المختبر'],inputs:['التقرير اليومي','AI flags','نتائج المختبر','التاريخ العلاجي'],outputs:['قرار طبي','وصفة/خطة','طلب مختبر','فترة سحب'],handoff_to:['worker','vet_assistant','lab_technician','consultant','farm_manager'],required_evidence:['سبب القرار','مرجع الحالة','نتيجة مختبر عند الحاجة'],can_approve:['العلاج','التحصين','الخطة السريرية'],prohibited:['ترحيل محاسبي','إخفاء فترة السحب'],default_screen:'R6-VET-DECISION'},
  {role:'consultant',name_ar:'الاستشاري البيطري',mission_ar:'مراجعة الحالات المصعدة ودعم الطبيب دون إلغاء مسؤوليته التشغيلية.',responsibilities:['مراجعة الحالات الحرجة','الرأي الاستشاري','توصية فحوص إضافية','متابعة الاستجابة'],inputs:['ملف الحالة','نتائج المختبر','قرارات الطبيب'],outputs:['رأي استشاري موثق','توصيات'],handoff_to:['doctor'],required_evidence:['ملاحظات استشارية'],can_approve:['رأي استشاري حسب السياسة'],prohibited:['تنفيذ الدواء ميدانيًا دون أمر'],default_screen:'R6-ROLE-CONSULTANT'},
  {role:'vet_assistant',name_ar:'المساعد البيطري',mission_ar:'تنفيذ الأعمال البيطرية المسموح بها وتوثيقها تحت تفويض الطبيب.',responsibilities:['جمع العينات','دعم التحصين','توثيق العلاج','متابعة السحب'],inputs:['أمر الطبيب','طلب المختبر'],outputs:['سجل تنفيذ','سلسلة حيازة'],handoff_to:['doctor','lab_technician'],required_evidence:['Batch/Lot','كمية','وقت التنفيذ'],can_approve:[],prohibited:['تشخيص نهائي','تغيير الجرعة'],default_screen:'R6-ROLE-VETASSIST'},
  {role:'lab_technician',name_ar:'فني المختبر / LabReviewer',mission_ar:'استلام العينات وتشغيل الفحوص وإصدار نتائج خاضعة للمراجعة.',responsibilities:['Chain of Custody','تشغيل الفحص','إدخال النتيجة','مراجعة/اعتماد حسب الصلاحية'],inputs:['طلب الفحص','العينة'],outputs:['نتيجة مخبرية','تعديل Versioned'],handoff_to:['doctor'],required_evidence:['هوية العينة','المراجع والمراجِع'],can_approve:['النتيجة النهائية إذا كان LabReviewer مخولًا'],prohibited:['تغيير العلاج مباشرة'],default_screen:'R6-ROLE-LAB'},
  {role:'accountant',name_ar:'محاسب المزرعة',mission_ar:'إدارة المستندات المالية التشغيلية وتسليم القيود والمدفوعات إلى Section 12.',responsibilities:['مطالبات المصروف','فواتير الموردين','سندات الاستلام/الطلب','تكلفة الدورة','كشف المالك والمورد','متابعة الترحيل S12'],inputs:['PO/GRN','مصروفات','رواتب وتكاليف','إيرادات S9/S12'],outputs:['مستندات مالية','أحداث تكامل S12','تقارير تكلفة'],handoff_to:['farm_owner','farm_manager','executive'],required_evidence:['فاتورة/مرجع','موافقة','عملة'],can_approve:['اعتماد مستندات حسب الحدود'],prohibited:['إنشاء دفتر موازٍ لـSection 12','تعديل حركة مخزون S7'],default_screen:'R6-FIN-DESK'},
  {role:'inventory_support',name_ar:'المخزون / الإمداد',mission_ar:'تنفيذ حركة المواد عبر Section 7 ومطابقة احتياجات المزرعة.',responsibilities:['فحص التوفر','الحجز والتحويل','الاستلام','Lot/Expiry/Cold chain'],inputs:['احتياج معتمد','PO/تحويل'],outputs:['حركة S7','مرجع استلام'],handoff_to:['farm_manager','accountant'],required_evidence:['Lot','كمية','استلام'],can_approve:['حركة مخزون حسب الصلاحية'],prohibited:['قيد محاسبي مباشر'],default_screen:'R6-ROLE-INVENTORY'},
  {role:'supplier',name_ar:'المورد',mission_ar:'تأكيد التوفر والتوريد والمستندات الخاصة به فقط.',responsibilities:['تأكيد التوفر','تأكيد أمر الشراء','التسليم'],inputs:['PO'],outputs:['تأكيد/رفض','فاتورة المورد'],handoff_to:['inventory_support','accountant'],required_evidence:['فاتورة','Batch/Lot'],can_approve:['تأكيد توريده فقط'],prohibited:['عرض بيانات مزارع أخرى'],default_screen:'R6-ROLE-SUPPLIER'},
  {role:'commercial',name_ar:'التجاري / التسويق',mission_ar:'قراءة الجاهزية والقيود التسويقية وربط البيع بالقنوات المسموحة.',responsibilities:['جاهزية التسويق','الأسعار','القيود'],inputs:['وزن القطيع','فترة السحب','أسعار السوق'],outputs:['طلب بيع/جاهزية'],handoff_to:['farm_owner','accountant'],required_evidence:['جاهزية الطبيب عند السحب'],can_approve:[],prohibited:['تجاوز withdrawal restriction'],default_screen:'R6-ROLE-COMMERCIAL'},
  {role:'support',name_ar:'الدعم',mission_ar:'دعم المستخدمين دون الوصول لقرارات طبية/مالية حساسة.',responsibilities:['مشكلات الدخول','أخطاء الواجهة','مساعدة المزامنة'],inputs:['تذكرة دعم'],outputs:['حل/تصعيد'],handoff_to:['farm_manager','executive'],required_evidence:['سجل المشكلة'],can_approve:[],prohibited:['تغيير بيانات طبية/مالية'],default_screen:'R6-ROLE-SUPPORT'},
];

export function farmOperationalRoleForUserR6(platformRole:PlatformRoleV195,userId:string,farmId:string|undefined,state:FarmDivisionStateV2029):FarmOperationalRoleR6{
  const assignment=state.staff_assignments.find(x=>x.user_id===userId&&x.status==='active'&&(!farmId||x.farm_id===farmId));
  if(assignment){
    const map:Record<FarmAssignmentRoleV2029,FarmOperationalRoleR6>={farm_manager:'farm_manager',supervisor:'supervisor',worker:'worker',doctor:'doctor',consultant:'consultant',accountant:'accountant',vet_assistant:'vet_assistant',lab_technician:'lab_technician',regional_manager:'regional_manager'};
    return map[assignment.role];
  }
  const platformMap:Record<PlatformRoleV195,FarmOperationalRoleR6>={system_owner:'executive',ceo:'executive',sector_manager:'regional_manager',finance:'accountant',marketing:'commercial',vet_consultant:'consultant',field_vet:'doctor',supervisor:'supervisor',worker:'worker',supplier:'supplier',warehouse:'inventory_support',laboratory:'lab_technician',farmer:'farm_owner',support:'support'};
  return platformMap[platformRole];
}

export function farmRoleContractR6(role:FarmOperationalRoleR6){return FARM_ROLE_CONTRACTS_R6.find(x=>x.role===role)!;}

export function roleInboxR6(state:FarmDivisionStateV2029,managed:ManagedOperationsStateV197,role:FarmOperationalRoleR6,userId:string,farmId?:string):FarmRoleInboxItemR6[]{
  const sameFarm=(x:any)=>!farmId||!x.farm_id||x.farm_id===farmId;
  const items:FarmRoleInboxItemR6[]=[];
  for(const t of state.tasks.filter(x=>sameFarm(x)&&x.status!=='completed'&&(x.assigned_user_id===userId||!x.assigned_user_id||x.assigned_role===role as any))){items.push({id:`task-${t.id}`,type:'task',title:t.title,detail:t.instructions,priority:t.priority==='critical'?'critical':t.priority==='high'?'high':'normal',status:t.status,source_id:t.id,screen_code:'FLD-12'});}
  for(const a of state.alerts.filter(x=>sameFarm(x)&&x.status!=='resolved'&&(!x.assigned_role||x.assigned_role===role))){items.push({id:`alert-${a.id}`,type:'alert',title:a.title,detail:a.message,priority:a.severity==='critical'?'critical':(['high','warning'] as string[]).includes(a.severity)?'high':'normal',status:a.status,source_id:a.id,screen_code:'FLD-10'});}
  if(['supervisor','farm_manager','doctor','executive','regional_manager'].includes(role))for(const r of managed.daily_reports.filter(x=>sameFarm(x)&&x.vet_review_status==='pending').slice(0,20)){items.push({id:`rpt-${r.id}`,type:'daily_report',title:`تقرير ${r.report_number}`,detail:`${r.farm_name} · ${r.report_date} · نفوق ${r.mortality} · وزن ${r.avg_weight_g||'—'}g`,priority:r.opening_birds&&r.mortality/r.opening_birds>=.01?'critical':'normal',status:r.vet_review_status,source_id:r.id,screen_code:'R6-DAILY-REVIEW'});}
  if(['doctor','consultant'].includes(role))for(const d of managed.veterinary_decisions.filter(x=>sameFarm(x)&&x.vet_decision==='pending').slice(0,20)){items.push({id:`vet-${d.id}`,type:'vet_decision',title:`قرار ${d.decision_number}`,detail:`${d.ai_risk_level} · ${d.ai_summary}`,priority:d.ai_risk_level==='critical'?'critical':d.ai_risk_level==='high'?'high':'normal',status:d.vet_decision,source_id:d.id,screen_code:'R6-VET-DECISION'});}
  if(['lab_technician','doctor','consultant'].includes(role))for(const s of state.lab_samples.filter(x=>sameFarm(x)&&!['final','rejected'].includes(x.status)).slice(0,20)){items.push({id:`lab-${s.id}`,type:'lab',title:`عينة ${s.sample_number}`,detail:`${s.sample_type} · ${s.status}`,priority:'normal',status:s.status,source_id:s.id,screen_code:'R6-ROLE-LAB'});}
  if(['accountant','farm_owner','farm_manager'].includes(role))for(const e of state.expense_claims.filter(x=>sameFarm(x)&&['submitted','sent_to_accounting'].includes(x.status)).slice(0,20)){items.push({id:`exp-${e.id}`,type:'expense',title:`مطالبة ${e.claim_number}`,detail:`${e.description} · ${e.amount} ${e.currency}`,priority:'normal',status:e.status,source_id:e.id,screen_code:'R6-FIN-DESK'});}
  if(['farm_owner','farm_manager','accountant','inventory_support'].includes(role))for(const r of managed.requirements.filter(x=>sameFarm(x)&&x.procurement_status!=='closed').slice(0,20)){items.push({id:`req-${r.id}`,type:'requirement',title:`احتياج ${r.requirement_number}`,detail:`${r.item_name} · ${r.quantity} ${r.unit}`,priority:r.urgency==='critical'?'critical':r.urgency==='urgent'?'high':'normal',status:`${r.owner_decision}/${r.finance_status}/${r.procurement_status}`,source_id:r.id,screen_code:'SUP-01'});}
  for(const h of state.role_handoffs.filter(x=>sameFarm(x)&&x.status!=='completed'&&x.to_role===role).slice(0,20)){items.push({id:`hand-${h.id}`,type:'handoff',title:h.subject,detail:h.payload_summary,priority:h.priority,status:h.status,source_id:h.id,screen_code:'R6-HANDOFFS'});}
  return items.sort((a,b)=>({critical:0,high:1,normal:2}[a.priority]-{critical:0,high:1,normal:2}[b.priority]));
}

export function reviewVeterinaryDecisionAndPlanR6(state:ManagedOperationsStateV197,input:VetPlanApprovalInputR6):ManagedOperationsStateV197{
  const decision=state.veterinary_decisions.find(x=>x.id===input.decision_id);if(!decision)throw new Error('القرار البيطري غير موجود.');
  const report=state.daily_reports.find(x=>decision.source_report_ids.includes(x.id));if(!report)throw new Error('التقرير اليومي المرتبط غير موجود.');
  const plan=state.daily_plans.find(x=>x.generated_from_report_id===report.id);
  const medicationTask=input.treatment_category==='no_treatment'||input.treatment_category==='lab_investigation'||input.treatment_category==='vaccine'?'':[
    input.treatment_category,
    input.medication_name||'',
    input.active_ingredient?`(${input.active_ingredient})`:'',
    input.dose_instruction||'',
    input.duration_days?`لمدة ${input.duration_days} يوم`:'' ,
    input.withdrawal_days?`فترة سحب ${input.withdrawal_days} يوم`:''
  ].filter(Boolean).join(' · ');
  const vaccinationTasks=input.treatment_category==='vaccine'?[input.medication_name||'تحصين يحدده الطبيب',input.dose_instruction||'حسب أمر الطبيب'].filter(Boolean).join(' · '):undefined;
  const extraActions=[...(decision.proposed_actions||[]),...(input.extra_actions||[])];
  const nextDecision:VeterinaryDecisionV197={...decision,medical_proposal:input.treatment_category,vet_decision:input.decision,vet_name:input.vet_name,vet_note:input.vet_note,approved_at:now(),proposed_feed_kg:input.feed_target_kg??decision.proposed_feed_kg,proposed_temperature_c:input.temperature_target_c??decision.proposed_temperature_c,proposed_actions:extraActions};
  let dailyPlans=state.daily_plans;
  let approvedPlan:DailyFarmPlanV197|undefined=plan;
  if(plan){
    approvedPlan={...plan,target_feed_kg:input.feed_target_kg??plan.target_feed_kg,target_temperature_c:input.temperature_target_c??plan.target_temperature_c,water_target_liters:input.water_target_liters??plan.water_target_liters,medication_tasks:medicationTask?[medicationTask]:[],vaccination_tasks:vaccinationTasks?[vaccinationTasks]:plan.vaccination_tasks,approved_by_vet:input.vet_name,approved_at:now(),status:input.decision==='rejected'?'vet_review':'approved'};
    dailyPlans=state.daily_plans.map(x=>x.id===plan.id?approvedPlan!:x);
  }
  const due=`${plan?.plan_date||tomorrowDate(report.report_date)}T07:00:00`;
  const tasks:FarmTaskV197[]=[...state.farm_tasks];
  const addTask=(title:string,instructions:string,evidence=false)=>{if(tasks.some(t=>t.plan_id===approvedPlan?.id&&t.title===title))return;tasks.unshift({id:rid('TASK'),task_number:rid('TASKNO'),farm_id:report.farm_id,flock_id:report.flock_id,plan_id:approvedPlan?.id,title,instructions,assigned_to:'worker',due_at:due,evidence_required:evidence,evidence_refs:[],status:'pending'});};
  if(input.decision!=='rejected'){
    addTask('علف اليوم التالي',`إجمالي مستهدف ${input.feed_target_kg??plan?.target_feed_kg??decision.proposed_feed_kg??0} كجم وفق الجدول المعتمد.`);
    addTask('متابعة البيئة',`درجة الحرارة المستهدفة ${input.temperature_target_c??plan?.target_temperature_c??decision.proposed_temperature_c??'—'}°C ومراجعة الماء والتهوية.`);
    if(medicationTask)addTask('تنفيذ العلاج المعتمد',medicationTask,true);
    if(vaccinationTasks)addTask('تنفيذ التحصين المعتمد',vaccinationTasks,true);
    if(input.treatment_category==='lab_investigation')addTask('جمع عينة للمختبر',input.vet_note||'جمع العينات حسب طلب الطبيب.',true);
  }
  return {...state,veterinary_decisions:state.veterinary_decisions.map(x=>x.id===decision.id?nextDecision:x),daily_plans:dailyPlans,farm_tasks:tasks,daily_reports:state.daily_reports.map(x=>x.id===report.id?{...x,vet_review_status:input.decision==='rejected'?'action_required':'reviewed'}:x),timeline:[{id:rid('TL'),at:now(),farm_id:report.farm_id,flock_id:report.flock_id,actor:input.vet_name,actor_role:'field_vet',action:`مراجعة القرار ${decision.decision_number}: ${input.decision}`,why:input.vet_note,evidence_refs:[],entity_type:'veterinary_decision',entity_id:decision.id},...state.timeline]};
}

export const FARM_R6_CRITICAL_DESTINATIONS=[
  ['R6-ROLE-MY','مساحة عملي حسب الدور'],['R6-ROLE-EXEC','لوحة الإدارة التنفيذية'],['R6-ROLE-REGIONAL','لوحة المدير الإقليمي'],['R6-ROLE-OWNER','لوحة مالك المزرعة'],['R6-ROLE-MANAGER','مركز مدير المزرعة'],['R6-ROLE-SUPERVISOR','مركز المشرف'],['R6-DAILY-ENTRY','إدخال العامل اليومي الكامل'],['R6-DAILY-REVIEW','مراجعة وإقفال اليوم'],['R6-AI-ANALYSIS','تحليل AI التشغيلي'],['R6-VET-DECISION','قرار الطبيب وخطة الغد'],['R6-TOMORROW-PLAN','خطة الغد ومهام التنفيذ'],['R6-ROLE-CONSULTANT','غرفة الاستشاري'],['R6-ROLE-VETASSIST','مساحة المساعد البيطري'],['R6-ROLE-LAB','مساحة المختبر'],['R6-FIN-DESK','مكتب محاسب المزرعة'],['R6-FIN-DOCUMENTS','الفواتير والسندات'],['R6-REPORT-STUDIO','استوديو التقارير والطباعة'],['R6-BREED-GUIDE','دليل سلالات اللاحم'],['R6-CLINICAL-GUIDE','الدليل السريري'],['R6-PRODUCT-CATALOG','كتالوج المنتجات'],['R6-HANDOFFS','تسليم المهام بين الأدوار'],['R6-APPROVALS','مركز الموافقات'],['R6-EXCEPTIONS','الاستثناءات والتصعيدات'],['R6-PRINT-CENTER','مركز الطباعة']
] as const;
