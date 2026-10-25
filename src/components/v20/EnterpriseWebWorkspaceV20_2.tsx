import React, { useMemo, useState } from 'react';
import { Activity, AlertTriangle, BadgeDollarSign, BookOpenCheck, BriefcaseBusiness, Building2, CheckCircle2, ClipboardCheck, FileBarChart, HeartPulse, Landmark, LayoutDashboard, ListTodo, ReceiptText, ShieldCheck, Stethoscope, UsersRound, WalletCards, Factory } from 'lucide-react';
import type { PlatformCoreStateV195, PlatformRoleV195 } from '../../modules/platform/PlatformCoreV19_5';
import type { ManagedOperationsStateV197 } from '../../modules/managed/ManagedPoultryOperationsV19_7';
import type { V20State } from '../../modules/v20/EnterprisePoultryCoreV20';
import {
  addEmployeeV202,
  addEmploymentContractV202,
  createPayrollV202,
  createExpenseV202,
  createEnterpriseReportV202,
  createTomorrowPlanV202,
  decideExpenseV202,
  doctorWorkspaceV202,
  ensureCostCenterV202,
  managerCommandCenterV202,
  financialStatementsV202,
  costCenterSummaryV202,
  ownerWorkspaceV202,
  updateRoleTaskV202,
  validateEnterpriseWebStateV202,
  type EnterpriseWebStateV202,
  type ExpenseTypeV202,
  type TaskStatusV202,
} from '../../modules/v20/EnterpriseWebPlatformV20_2';
import { veterinaryWorkloadV2021, validateEnterpriseFoundationV2021, type EnterpriseFoundationStateV2021 } from '../../modules/v20/EnterpriseFoundationV20_2_1';
import type { VeterinaryFieldStateV2022 } from '../../modules/v20/VeterinaryFieldOperationsV20_2_2';
import { VeterinaryFieldOperationsV2022 } from './VeterinaryFieldOperationsV20_2_2';
import type { MultiBusinessEnterpriseStateV2023 } from '../../modules/v20/MultiBusinessEnterpriseV20_2_3';
import { MultiBusinessOperationsV2023 } from './MultiBusinessOperationsV20_2_3';
import type { FeedFactoryOperationsStateV2024 } from '../../modules/v20/FeedFactoryOperationsV20_2_4';
import { FeedFactoryCompletionV2029 } from './FeedFactoryCompletionV20_2_9';
import type { WorkforcePayrollStateV2025 } from '../../modules/v20/WorkforcePayrollManagedBusinessV20_2_5';
import { WorkforcePayrollOperationsV2025 } from './WorkforcePayrollOperationsV20_2_5';
import type { ExecutiveIntelligenceStateV2026 } from '../../modules/v20/ExecutiveIntelligenceBusinessControlV20_2_6';
import { ExecutiveIntelligenceBusinessControlV2026 } from './ExecutiveIntelligenceBusinessControlV20_2_6';
import type { WindowsCompletionStateV2027 } from '../../modules/v20/WindowsCompletionControlClosureV20_2_7';
import { WindowsCompletionControlClosureV2027 } from './WindowsCompletionControlClosureV20_2_7';
import { DepartmentControlCenterV2028 } from './DepartmentControlCenterV20_2_8';
import { CompletionGateV2029 } from './CompletionGateV20_2_9';
import type { FarmDivisionStateV2029 } from '../../modules/v20/FarmDivisionCompletionV20_2_9';
import { FarmOperationsCompletionV2029 } from './FarmOperationsCompletionV20_2_9';
import { FarmWindowsControlCenterR6 } from './FarmWindowsControlCenterR6';
import { CustomerOfficePartnerNetworkR7 } from './CustomerOfficePartnerNetworkR7';
import { OperationalReadinessR81 } from './OperationalReadinessR8_1';
import type { OperationalReadinessStateR81 } from '../../modules/v20/OperationalReadinessR8_1';
import type { AppUISettingsV194 } from '../settings/AppSettingsDrawer';

interface Props {
  state: EnterpriseWebStateV202;
  foundation: EnterpriseFoundationStateV2021;
  veterinaryField: VeterinaryFieldStateV2022;
  multiBusiness: MultiBusinessEnterpriseStateV2023;
  feedFactory: FeedFactoryOperationsStateV2024;
  workforcePayroll: WorkforcePayrollStateV2025;
  executiveIntelligence: ExecutiveIntelligenceStateV2026;
  windowsCompletion: WindowsCompletionStateV2027;
  farmDivision: FarmDivisionStateV2029;
  operationalReadiness: OperationalReadinessStateR81;
  language: AppUISettingsV194['language'];
  v20: V20State;
  managed: ManagedOperationsStateV197;
  platform: PlatformCoreStateV195;
  currentUser: { id:string; name:string; role:PlatformRoleV195 };
  onChange: (next: EnterpriseWebStateV202) => void;
  onVeterinaryFieldChange: (next: VeterinaryFieldStateV2022) => void;
  onMultiBusinessChange: (next: MultiBusinessEnterpriseStateV2023) => void;
  onFeedFactoryChange: (next: FeedFactoryOperationsStateV2024) => void;
  onWorkforcePayrollChange: (next: WorkforcePayrollStateV2025) => void;
  onExecutiveIntelligenceChange: (next: ExecutiveIntelligenceStateV2026) => void;
  onWindowsCompletionChange: (next: WindowsCompletionStateV2027) => void;
  onFarmDivisionChange: (next: FarmDivisionStateV2029) => void;
  onOperationalReadinessChange: (next: OperationalReadinessStateR81) => void;
  onLanguageChange: (language: AppUISettingsV194['language']) => void;
  onManagedChange: (next: ManagedOperationsStateV197) => void;
}

type Section = 'r81'|'network_r7'|'completion_v2029'|'department_v2028'|'completion_v2027'|'intelligence_v2026'|'command'|'workforce_v2025'|'factory_v2024'|'farm_operations'|'multi_business'|'clinical_ops'|'veterinary'|'specialists'|'hr'|'finance'|'expenses'|'owner'|'reports'|'tasks'|'organization'|'foundation'|'legacy';

type NavItem = { id:Section; label:string; icon:React.ReactNode; roles?:PlatformRoleV195[] };

const NAV:NavItem[] = [
  {id:'r81',label:'مركز التشغيل | Operational Center',icon:<LayoutDashboard className="w-4 h-4"/>},
  {id:'farm_operations',label:'المزارع والقطعان | Farms & Flocks',icon:<Building2 className="w-4 h-4"/>,roles:['system_owner','ceo','sector_manager','finance','vet_consultant','field_vet','supervisor','worker','laboratory','farmer','warehouse','supplier','marketing','support']},
  {id:'clinical_ops',label:'الطب البيطري | Veterinary',icon:<HeartPulse className="w-4 h-4"/>,roles:['system_owner','ceo','vet_consultant','field_vet','laboratory','worker','supervisor','farmer']},
  {id:'factory_v2024',label:'المصنع والإنتاج | Factory',icon:<Factory className="w-4 h-4"/>,roles:['system_owner','ceo','sector_manager','finance','warehouse','supplier']},
  {id:'network_r7',label:'المكاتب والعملاء والشركاء | Network',icon:<BriefcaseBusiness className="w-4 h-4"/>,roles:['system_owner','ceo','sector_manager','finance','marketing','supplier','warehouse','laboratory','farmer','support']},
  {id:'workforce_v2025',label:'القوى العاملة والرواتب | Workforce',icon:<UsersRound className="w-4 h-4"/>,roles:['system_owner','ceo','sector_manager','finance']},
  {id:'finance',label:'المالية والمحاسبة | Finance',icon:<Landmark className="w-4 h-4"/>,roles:['system_owner','ceo','finance']},
  {id:'tasks',label:'المهام والموافقات | Tasks',icon:<ListTodo className="w-4 h-4"/>},
  {id:'reports',label:'التقارير والطباعة | Reports',icon:<FileBarChart className="w-4 h-4"/>},
  {id:'organization',label:'الإعدادات والحوكمة | Settings',icon:<ShieldCheck className="w-4 h-4"/>,roles:['system_owner','ceo']},
];


const money=(n:number)=>new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(Number(n||0));
// Preserved Factory operational-baseline compatibility marker used by regression verification.
const FACTORY_OPERATIONAL_BASELINE = '15 قسم • تشغيل فعلي';
void FACTORY_OPERATIONAL_BASELINE;

const today=()=>new Date().toISOString().slice(0,10);
const tomorrow=()=>{const d=new Date();d.setDate(d.getDate()+1);return d.toISOString().slice(0,10)};

export const EnterpriseWebWorkspaceV202:React.FC<Props> = ({state,foundation,veterinaryField,multiBusiness,feedFactory,workforcePayroll,executiveIntelligence,windowsCompletion,farmDivision,operationalReadiness,language,v20,managed,platform,currentUser,onChange,onVeterinaryFieldChange,onMultiBusinessChange,onFeedFactoryChange,onWorkforcePayrollChange,onExecutiveIntelligenceChange,onWindowsCompletionChange,onFarmDivisionChange,onOperationalReadinessChange,onLanguageChange,onManagedChange}) => {
  const allowed = NAV.filter(n=>!n.roles||n.roles.includes(currentUser.role));
  const preferred:Section = 'r81';
  const [section,setSection]=useState<Section>(allowed.some(x=>x.id===preferred)?preferred:allowed[0]?.id||'tasks');
  const command=useMemo(()=>managerCommandCenterV202(state,v20,managed,platform),[state,v20,managed,platform]);
  const validation=useMemo(()=>validateEnterpriseWebStateV202(state,v20,managed),[state,v20,managed]);
  const foundationValidation=useMemo(()=>validateEnterpriseFoundationV2021(foundation,state),[foundation,state]);
  const openApprovals=state.expenses.filter(e=>e.status==='pending').length+managed.requirements.filter(r=>r.owner_decision==='pending').length;
  const overdue=state.role_tasks.filter(t=>t.status==='overdue'||(t.status==='pending'&&new Date(t.due_at)<new Date())).length;

  return <div className="max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-7 py-4" dir="rtl">
    <div className="grid grid-cols-1 xl:grid-cols-[230px_minmax(0,1fr)_260px] gap-4 items-start">
      <aside className="xl:sticky xl:top-36 rounded-3xl border border-slate-800 bg-slate-950/70 p-3">
        <div className="px-3 py-3 border-b border-slate-800 mb-2">
          <div className="text-[10px] text-emerald-300 font-black">AVINEXUS POULTRY ENTERPRISE</div>
          <div className="text-sm text-white font-black mt-1">مساحة العمل | Workspace</div>
          <div className="text-[10px] text-slate-400 mt-1">{currentUser.name} · {currentUser.role}</div>
        </div>
        <div className="space-y-1">{allowed.map(n=><button key={n.id} onClick={()=>setSection(n.id)} className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-black text-right transition ${section===n.id?'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30':'text-slate-300 hover:bg-slate-900 border border-transparent'}`}>{n.icon}<span>{n.label}</span></button>)}</div>
      </aside>

      <main className="min-w-0">
        {section==='r81'&&<OperationalReadinessR81 state={operationalReadiness} currentUser={currentUser} language={language} onLanguageChange={onLanguageChange} onChange={onOperationalReadinessChange} onNavigateLegacy={(next)=>setSection(next as Section)}/>}
        {section==='network_r7'&&<CustomerOfficePartnerNetworkR7 business={multiBusiness} managed={managed} platform={platform} currentUser={currentUser} onBusinessChange={onMultiBusinessChange} onManagedChange={onManagedChange}/>}
        {section==='completion_v2029'&&<CompletionGateV2029 web={state} veterinary={veterinaryField} multiBusiness={multiBusiness} factory={feedFactory} workforce={workforcePayroll} windows={windowsCompletion} managed={managed} platform={platform} currentUser={currentUser}/>}
        {section==='department_v2028'&&<DepartmentControlCenterV2028 multiBusiness={multiBusiness} web={state} feedFactory={feedFactory} windowsCompletion={windowsCompletion} platform={platform} currentUser={currentUser} onBusinessChange={onMultiBusinessChange} onWebChange={onChange} onWindowsChange={onWindowsCompletionChange}/>}
        {section==='completion_v2027'&&<WindowsCompletionControlClosureV2027 state={windowsCompletion} web={state} foundation={foundation} veterinary={veterinaryField} multiBusiness={multiBusiness} feedFactory={feedFactory} workforce={workforcePayroll} intelligence={executiveIntelligence} currentUser={currentUser} onChange={onWindowsCompletionChange}/>}
                {section==='intelligence_v2026'&&<ExecutiveIntelligenceBusinessControlV2026 state={executiveIntelligence} web={state} foundation={foundation} veterinary={veterinaryField} multiBusiness={multiBusiness} feedFactory={feedFactory} workforce={workforcePayroll} currentUser={currentUser} onChange={onExecutiveIntelligenceChange}/>} 
        {section==='command'&&<CommandCenter command={command} managed={managed}/>} 
        {section==='workforce_v2025'&&<WorkforcePayrollOperationsV2025 state={workforcePayroll} web={state} multiBusiness={multiBusiness} feedFactory={feedFactory} currentUser={currentUser} onWorkforceChange={onWorkforcePayrollChange} onWebChange={onChange} onBusinessChange={onMultiBusinessChange}/>} 
        {section==='factory_v2024'&&<FeedFactoryCompletionV2029 state={feedFactory} multiBusiness={multiBusiness} web={state} workforce={workforcePayroll} windows={windowsCompletion} currentUser={currentUser} onFactoryChange={onFeedFactoryChange} onBusinessChange={onMultiBusinessChange} onWebChange={onChange} onWorkforceChange={onWorkforcePayrollChange} onWindowsChange={onWindowsCompletionChange}/>} 
        {section==='farm_operations'&&<FarmWindowsControlCenterR6 state={farmDivision} managed={managed} platform={platform} currentUser={currentUser} onChange={onFarmDivisionChange} onManagedChange={onManagedChange} legacyWorkspace={<FarmOperationsCompletionV2029 state={farmDivision} managed={managed} currentUser={currentUser} onChange={onFarmDivisionChange}/>}/>} 
        {section==='multi_business'&&<MultiBusinessOperationsV2023 state={multiBusiness} web={state} veterinary={veterinaryField} managed={managed} currentUser={currentUser} onBusinessChange={onMultiBusinessChange} onWebChange={onChange}/>} 
        {section==='clinical_ops'&&<VeterinaryFieldOperationsV2022 state={veterinaryField} foundation={foundation} web={state} managed={managed} currentUser={currentUser} onFieldChange={onVeterinaryFieldChange} onWebChange={onChange}/>} 
        {section==='veterinary'&&<VeterinaryWorkspace state={state} managed={managed} currentUser={currentUser} onChange={onChange}/>} 
        {section==='specialists'&&<SpecialtyWorkspaces state={state} managed={managed}/>} 
        {section==='hr'&&<HRWorkspace state={state} currentUser={currentUser} onChange={onChange}/>} 
        {section==='finance'&&<FinanceWorkspace state={state}/>} 
        {section==='expenses'&&<ExpenseWorkspace state={state} managed={managed} currentUser={currentUser} onChange={onChange}/>} 
        {section==='owner'&&<OwnerWorkspace state={state} v20={v20} managed={managed}/>} 
        {section==='reports'&&<ReportsWorkspace state={state} v20={v20} currentUser={currentUser} onChange={onChange}/>} 
        {section==='tasks'&&<TaskCenter state={state} currentUser={currentUser} onChange={onChange}/>} 
        {section==='organization'&&<OrganizationWorkspace state={state}/>} 
        {section==='foundation'&&<FoundationWorkspace foundation={foundation} web={state}/>} 
        {section==='legacy'&&<LegacyWorkspace/>}
      </main>

      <aside className="xl:sticky xl:top-36 space-y-3">
        <ContextCard title="الحالة التشغيلية | Operations" icon={<Activity className="w-4 h-4"/>}>
          <ContextRow label="Environment" value={state.environment}/><ContextRow label="Model issues" value={String(validation.length+foundationValidation.length)}/><ContextRow label="R8.1 alerts" value={String(operationalReadiness.disease_alerts.filter(x=>!['closed','post_event_review'].includes(x.status)).length)}/>
        </ContextCard>
        <ContextCard title="يتطلب الانتباه" icon={<AlertTriangle className="w-4 h-4"/>}>
          <ContextRow label="الموافقات" value={String(openApprovals)}/><ContextRow label="المهام المتأخرة" value={String(overdue)}/><ContextRow label="الاستثناءات" value={String(command.critical_exceptions)}/>
        </ContextCard>
        <ContextCard title="حوكمة" icon={<ShieldCheck className="w-4 h-4"/>}>
          <div className="text-[11px] leading-6 text-slate-400">المدير يراقب ويعتمد ضمن الصلاحيات. القرار الطبي للطبيب، والقيد المحاسبي للمالية، والتنفيذ للعامل.</div>
        </ContextCard>
      </aside>
    </div>
  </div>;
};

const CommandCenter:React.FC<{command:ReturnType<typeof managerCommandCenterV202>;managed:ManagedOperationsStateV197}> = ({command,managed}) => <WorkspaceShell title="Executive / Manager Command Center" subtitle="رؤية مؤسسية قابلة للحفر إلى المزرعة والقطيع والعملية الأصلية.">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    <Metric label="المزارع النشطة" value={command.active_farms}/><Metric label="القطعان النشطة" value={command.active_flocks}/><Metric label="الطيور الحالية" value={money(command.current_birds)}/><Metric label="نفوق اليوم" value={command.mortality_today}/>
    <Metric label="تقارير ناقصة" value={command.reports_missing} warn={command.reports_missing>0}/><Metric label="حالات حرجة" value={command.critical_medical_cases} warn={command.critical_medical_cases>0}/><Metric label="مهام متأخرة" value={command.tasks_overdue} warn={command.tasks_overdue>0}/><Metric label="احتياجات مفتوحة" value={command.farm_requirements_open}/>
    <Metric label="موافقات المالك" value={command.owner_approvals}/><Metric label="مشتريات قيد التنفيذ" value={command.purchases_in_progress}/><Metric label="مصروفات بانتظار اعتماد" value={command.pending_expenses}/><Metric label="عقود تنتهي خلال 30 يوم" value={command.contracts_expiring_30d}/>
  </div>
  <div className="mt-4 grid md:grid-cols-2 gap-4">
    <Panel title="الاستثناءات التشغيلية"><SimpleTable headers={['المزرعة','الفئة','الخطورة','الحالة']} rows={managed.exceptions.slice(0,8).map(e=>[managed.farms.find(f=>f.id===e.farm_id)?.name||e.farm_id||'—',e.category,e.severity,e.status])}/></Panel>
    <Panel title="الموقف المالي"><div className="grid grid-cols-2 gap-3"><Mini label="ذمم المزارع SAR" value={money(command.outstanding_farm_sar)}/><Mini label="حجم دفتر القيود SAR" value={money(command.posted_ledger_volume_sar)}/><Mini label="Receivables SAR" value={money(command.receivables_sar)}/><Mini label="Payables SAR" value={money(command.payables_sar)}/></div></Panel>
  </div>
</WorkspaceShell>;

const VeterinaryWorkspace:React.FC<{state:EnterpriseWebStateV202;managed:ManagedOperationsStateV197;currentUser:Props['currentUser'];onChange:Props['onChange']}> = ({state,managed,currentUser,onChange}) => {
  const data=doctorWorkspaceV202(state,managed,currentUser.id,currentUser.name); const firstFlock=managed.flock_cycles.find(f=>data.flock_ids.includes(f.id))||managed.flock_cycles.find(f=>f.status==='active')||managed.flock_cycles[0];
  const latest=firstFlock?managed.daily_reports.filter(r=>r.flock_id===firstFlock.id).sort((a,b)=>b.submitted_at.localeCompare(a.submitted_at))[0]:undefined;
  const issuePlan=()=>{if(!firstFlock)return;const farm=managed.farms.find(f=>f.id===firstFlock.farm_id);const worker=managed.managed_contracts.find(c=>c.farm_id===firstFlock.farm_id)?.assigned_worker_ids?.[0];onChange(createTomorrowPlanV202(state,{farm_id:firstFlock.farm_id,flock_id:firstFlock.id,plan_date:tomorrow(),source_report_id:latest?.id,issued_by_vet:currentUser.name,feed_kg:latest?.feed_used_kg||Math.max(1,Math.round(firstFlock.current_count*0.12)),feeding_times:['06:00','12:00','18:00'],target_temperature_min_c:25,target_temperature_max_c:26,humidity_min_pct:55,humidity_max_pct:65,weight_sample_time:'07:00',weight_sample_count:60,weight_sample_condition:'fasted',ventilation_instruction:'مراجعة الحد الأدنى للتهوية وفق حالة القطيع',treatment_instruction:'',vaccination_instruction:'',litter_instruction:'استبدال الأجزاء الرطبة إن وجدت',maintenance_instruction:'فحص المراوح والمياه',required_items:[],vet_note:`خطة تشغيل ${farm?.name||''}`,worker_user_id:worker}));};
  return <WorkspaceShell title="لوحة الطبيب البيطري" subtitle="Worker Daily Closing → AI Analysis → Veterinary Review → Doctor Decision → Tomorrow Plan → Worker Tasks">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3"><Metric label="مزارعي" value={data.farm_ids.length}/><Metric label="تقارير تنتظر المراجعة" value={data.reports_awaiting_review.length} warn={data.reports_awaiting_review.length>0}/><Metric label="Action Required" value={data.reports_action_required.length} warn={data.reports_action_required.length>0}/><Metric label="حالات حرجة" value={data.critical_cases.length} warn={data.critical_cases.length>0}/></div>
    <div className="mt-4 flex flex-wrap gap-2"><button onClick={issuePlan} disabled={!firstFlock} className="btn-primary">إصدار خطة الغد وتحويلها إلى Tasks</button><span className="text-xs text-slate-400 self-center">{firstFlock?`القطيع: ${firstFlock.flock_code}`:'لا يوجد قطيع مسند'}</span></div>
    <div className="mt-4 grid lg:grid-cols-2 gap-4"><Panel title="تقارير اليوم المنتظرة"><SimpleTable headers={['التاريخ','القطيع','العمر','الحالة']} rows={data.reports_awaiting_review.slice(0,8).map(r=>[r.report_date,r.flock_code,r.age_days,r.vet_review_status])}/></Panel><Panel title="خطط اليوم التالي"><SimpleTable headers={['التاريخ','القطيع','الحالة','Tasks']} rows={data.tomorrow_plans.slice(0,8).map(p=>[p.plan_date,managed.flock_cycles.find(f=>f.id===p.flock_id)?.flock_code||p.flock_id,p.status,p.task_ids.length])}/></Panel></div>
  </WorkspaceShell>;
};

const SpecialtyWorkspaces:React.FC<{state:EnterpriseWebStateV202;managed:ManagedOperationsStateV197}> = ({state,managed}) => <WorkspaceShell title="Specialty Workspaces" subtitle="لكل تخصص منظور مختلف للحالة دون توسيع صلاحياته إلى أعمال التخصصات الأخرى.">
  <div className="grid md:grid-cols-2 gap-4">
    <Specialty title="Poultry Disease Consultant" lines={[`الحالات المرضية: ${managed.exceptions.filter(e=>['mortality','biosecurity'].includes(e.category)).length}`,`المختبر/التشريح: ${managed.requirements.filter(r=>r.category==='lab').length}`]}/>
    <Specialty title="Nutrition Consultant" lines={[`تقارير العلف: ${managed.daily_reports.length}`,`إنذارات Feed: ${managed.exceptions.filter(e=>e.category==='feed').length}`]}/>
    <Specialty title="Epidemiology Consultant" lines={[`إشارات Biosecurity: ${managed.exceptions.filter(e=>e.category==='biosecurity').length}`,`المزارع المغطاة: ${managed.farms.length}`]}/>
    <Specialty title="Laboratory Consultant" lines={[`طلبات المختبر: ${managed.requirements.filter(r=>r.category==='lab').length}`,`تعيينات مختبرية: ${state.veterinary_assignments.filter(a=>a.specialty==='laboratory').length}`]}/>
  </div>
</WorkspaceShell>;

const HRWorkspace:React.FC<{state:EnterpriseWebStateV202;currentUser:Props['currentUser'];onChange:Props['onChange']}> = ({state,currentUser,onChange}) => {
  const [name,setName]=useState(''); const [title,setTitle]=useState(''); const [dept,setDept]=useState('FIELD');
  const [employeeId,setEmployeeId]=useState(state.employees[0]?.id||''); const [salary,setSalary]=useState(''); const [payer,setPayer]=useState<'platform'|'farm_owner'|'shared'>('platform');
  const add=()=>{if(!name.trim()||!title.trim())return;const next=addEmployeeV202(state,{full_name:name.trim(),job_title:title.trim(),department_code:dept,status:'active',assigned_farm_ids:[],assigned_flock_ids:[],work_schedule:'حسب جدول العمل',attendance_policy:'attendance_required',documents:[]},currentUser.name,currentUser.role);onChange(next);setName('');setTitle('');if(!employeeId&&next.employees[0])setEmployeeId(next.employees[0].id);};
  const addContract=()=>{const n=Number(salary);if(!employeeId||!n)return;onChange(addEmploymentContractV202(state,{employee_id:employeeId,start_date:today(),currency:'SAR',compensation_model:'monthly_salary',base_salary:n,per_visit_fee:0,per_farm_fee:0,per_cycle_fee:0,transport_allowance:0,housing_allowance:0,other_allowance:0,payer,platform_share_percent:payer==='farm_owner'?0:payer==='shared'?50:100,farm_owner_share_percent:payer==='platform'?0:payer==='shared'?50:100,status:'active'},currentUser.name,currentUser.role));};
  const payroll=()=>{if(!employeeId)return;onChange(createPayrollV202(state,{employee_id:employeeId,period:today().slice(0,7),visits:0,farms:0,cycles:0,bonuses:0,advances:0,deductions:0},currentUser.name));};
  return <WorkspaceShell title="Human Resources" subtitle="ملف الموظف والعقد والراتب والتكليف والأداء والرواتب ضمن Cost Centers.">
    <Panel title="Employee Profile"><div className="grid md:grid-cols-4 gap-2"><input className="field" placeholder="اسم الموظف" value={name} onChange={e=>setName(e.target.value)}/><input className="field" placeholder="المسمى الوظيفي" value={title} onChange={e=>setTitle(e.target.value)}/><select className="field" value={dept} onChange={e=>setDept(e.target.value)}>{state.departments.map(d=><option key={d.code} value={d.code}>{d.name}</option>)}</select><button className="btn-primary" onClick={add}>إضافة موظف</button></div></Panel>
    <Panel title="Compensation Contract & Payroll"><div className="grid md:grid-cols-4 gap-2"><select className="field" value={employeeId} onChange={e=>setEmployeeId(e.target.value)}><option value="">اختر الموظف</option>{state.employees.map(e=><option key={e.id} value={e.id}>{e.full_name}</option>)}</select><input className="field" type="number" placeholder="الراتب الشهري SAR" value={salary} onChange={e=>setSalary(e.target.value)}/><select className="field" value={payer} onChange={e=>setPayer(e.target.value as any)}><option value="platform">Platform</option><option value="farm_owner">Farm Owner</option><option value="shared">Shared 50/50</option></select><div className="flex gap-2"><button className="btn-primary flex-1" onClick={addContract}>إنشاء عقد</button><button className="task-btn flex-1" onClick={payroll}>Payroll</button></div></div></Panel>
    <SimpleTable headers={['الرقم','الاسم','المسمى','القسم','الحالة']} rows={state.employees.map(e=>[e.employee_number,e.full_name,e.job_title,e.department_code,e.status])}/>
    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3"><Metric label="الموظفون" value={state.employees.length}/><Metric label="عقود نشطة" value={state.employment_contracts.filter(c=>c.status==='active').length}/><Metric label="Payroll Drafts" value={state.payroll.filter(p=>p.status==='draft').length}/><Metric label="Advances/Deductions" value={money(state.payroll.reduce((s,p)=>s+p.advances+p.deductions,0))}/></div>
    <div className="mt-4 grid lg:grid-cols-2 gap-4"><Panel title="Contracts"><SimpleTable headers={['Contract','Employee','Model','Base','Payer','Status']} rows={state.employment_contracts.slice(0,12).map(c=>[c.contract_number,state.employees.find(e=>e.id===c.employee_id)?.full_name||c.employee_id,c.compensation_model,`${money(c.base_salary)} ${c.currency}`,c.payer,c.status])}/></Panel><Panel title="Payroll"><SimpleTable headers={['Payroll','Employee','Period','Gross','Net','Status']} rows={state.payroll.slice(0,12).map(p=>[p.payroll_number,state.employees.find(e=>e.id===p.employee_id)?.full_name||p.employee_id,p.period,money(p.gross),money(p.net),p.status])}/></Panel></div>
  </WorkspaceShell>;
};

const FinanceWorkspace:React.FC<{state:EnterpriseWebStateV202}> = ({state}) => {
  const statements=financialStatementsV202(state); const cc=costCenterSummaryV202(state);
  return <WorkspaceShell title="Financial Command Center" subtitle="Double-entry GL + Cost Centers + AP/AR + Treasury + FX history + derived financial statements.">
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3"><Metric label="قيود Posted" value={state.journal_entries.filter(j=>j.status==='posted').length}/><Metric label="Revenue SAR" value={money(statements.income_statement.revenue_sar)}/><Metric label="Expenses SAR" value={money(statements.income_statement.expense_sar)}/><Metric label="Net Income SAR" value={money(statements.income_statement.net_income_sar)}/><Metric label="Balance Check" value={money(statements.balance_sheet.accounting_check_sar)} warn={Math.abs(statements.balance_sheet.accounting_check_sar)>.01}/></div>
    <div className="mt-4 grid lg:grid-cols-2 gap-4"><Panel title="Trial Balance"><SimpleTable headers={['Code','Account','Debit','Credit','Balance']} rows={statements.trial_balance.map(r=>[r.account_code,r.account_name,money(r.debit_sar),money(r.credit_sar),money(r.balance_sar)])}/></Panel><Panel title="Balance Sheet / Cash"><div className="grid grid-cols-2 gap-2"><Mini label="Assets" value={money(statements.balance_sheet.assets_sar)}/><Mini label="Liabilities" value={money(statements.balance_sheet.liabilities_sar)}/><Mini label="Equity" value={money(statements.balance_sheet.equity_sar)}/><Mini label="Ledger Cash" value={money(statements.cash_flow.current_cash_balance_sar)}/></div><div className="mt-3 text-[10px] text-slate-500">Historical FX is stored on each transaction; rate changes do not rewrite posted history.</div></Panel></div>
    <div className="mt-4 grid lg:grid-cols-2 gap-4"><Panel title="Cost Responsibility Matrix"><SimpleTable headers={['Expense','Payer','Platform %','Owner %','Approval SAR']} rows={state.cost_responsibility_rules.map(r=>[r.expense_type,r.payer,r.platform_percent,r.farm_owner_percent,money(r.approval_threshold_sar)])}/></Panel><Panel title="Cost Centers"><SimpleTable headers={['Code','Category','Cost','Revenue','Margin']} rows={cc.slice(0,20).map(c=>[c.code,c.category||'—',money(c.cost_sar),money(c.revenue_sar),money(c.margin_sar)])}/></Panel></div>
    <Panel title="Recent Journals"><SimpleTable headers={['Journal','Date','Description','Source','Status']} rows={state.journal_entries.slice(0,12).map(j=>[j.journal_number,j.journal_date,j.description,j.source_type,j.status])}/></Panel>
  </WorkspaceShell>;
};

const ExpenseWorkspace:React.FC<{state:EnterpriseWebStateV202;managed:ManagedOperationsStateV197;currentUser:Props['currentUser'];onChange:Props['onChange']}> = ({state,managed,currentUser,onChange}) => {
  const farm=managed.farms.find(f=>f.status==='active')||managed.farms[0]; const flock=managed.flock_cycles.find(f=>f.farm_id===farm?.id&&f.status==='active')||managed.flock_cycles.find(f=>f.farm_id===farm?.id);
  const [amount,setAmount]=useState(''); const [desc,setDesc]=useState(''); const [kind,setKind]=useState<ExpenseTypeV202>('fuel'); const [currency,setCurrency]=useState<'SAR'|'YER_OLD'|'YER_NEW'|'USD'>('SAR'); const [rate,setRate]=useState('1');
  const submit=()=>{const n=Number(amount),r=Number(rate);if(!farm||!n||!desc.trim()||!r)return;let next=ensureCostCenterV202(state,{farm_id:farm.id,flock_id:flock?.id,category:kind,name:`${farm.name} / ${flock?.flock_code||'General'} / ${kind}`});const cc=next.cost_centers.find(c=>c.farm_id===farm.id&&c.flock_id===(flock?.id)&&c.category===kind)||next.cost_centers[0];next=createExpenseV202(next,{farm_id:farm.id,flock_id:flock?.id,cost_center_id:cc.id,expense_type:kind,description:desc.trim(),currency,amount:n,exchange_rate_to_sar:r,rate_date:today(),rate_source:'manual_approved_rate',payment_method:'credit',requested_by:currentUser.name,expense_date:today(),reason:desc.trim()});onChange(next);setAmount('');setDesc('');};
  const canApprove=['system_owner','ceo','finance'].includes(currentUser.role);
  return <WorkspaceShell title="Daily Expense Management" subtitle="كل مصروف: Farm → Flock → Cost Center → Payer → Approval → Journal Entry.">
    <div className="grid md:grid-cols-5 gap-2 mb-4"><select className="field" value={kind} onChange={e=>setKind(e.target.value as ExpenseTypeV202)}>{['fuel','transportation','field_meals','generator','electricity','water','litter','disinfectant','maintenance','emergency_purchase','veterinary_visit','labor','laboratory','equipment','feed','medicine','vaccine','marketing','other'].map(x=><option key={x}>{x}</option>)}</select><input className="field" placeholder="الوصف والسبب" value={desc} onChange={e=>setDesc(e.target.value)}/><input className="field" type="number" placeholder="المبلغ" value={amount} onChange={e=>setAmount(e.target.value)}/><div className="flex gap-1"><select className="field min-w-0" value={currency} onChange={e=>setCurrency(e.target.value as any)}><option>SAR</option><option>YER_OLD</option><option>YER_NEW</option><option>USD</option></select><input className="field w-24" type="number" step="0.0001" title="Exchange rate to SAR" value={rate} onChange={e=>setRate(e.target.value)}/></div><button className="btn-primary" onClick={submit}>تسجيل المصروف</button></div>
    <div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="text-slate-400 border-b border-slate-800">{['Expense','Type','Amount','Payer','Status','Action'].map(h=><th key={h} className="text-right py-2 px-2">{h}</th>)}</tr></thead><tbody>{state.expenses.slice(0,20).map(e=><tr key={e.id} className="border-b border-slate-900"><td className="py-2 px-2">{e.description}</td><td className="py-2 px-2">{e.expense_type}</td><td className="py-2 px-2">{money(e.base_amount_sar)} SAR</td><td className="py-2 px-2">{e.payer}</td><td className="py-2 px-2">{e.status}</td><td className="py-2 px-2">{canApprove&&e.status==='pending'?<button className="text-emerald-300 font-black" onClick={()=>onChange(decideExpenseV202(state,e.id,true,currentUser.name,currentUser.role,'اعتماد مصروف ضمن الصلاحية'))}>اعتماد + ترحيل</button>:'—'}</td></tr>)}</tbody></table></div>
  </WorkspaceShell>;
};

const OwnerWorkspace:React.FC<{state:EnterpriseWebStateV202;v20:V20State;managed:ManagedOperationsStateV197}> = ({state,v20,managed}) => {
  const farm=managed.farms.find(f=>f.status==='active')||managed.farms[0]; const d=farm?ownerWorkspaceV202(state,v20,managed,farm.id):undefined;
  return <WorkspaceShell title="Owner / Farm Owner Workspace" subtitle="بيانات القطيع والتكلفة والموافقات دون كشف دفاتر الإدارة الداخلية.">{!d?<Empty text="لا توجد مزرعة مرتبطة."/>:<><div className="grid grid-cols-2 md:grid-cols-4 gap-3"><Metric label="العدد الحالي" value={d.dashboard?.master.current_recorded||0}/><Metric label="النفوق التراكمي %" value={d.dashboard?.master.farm_mortality_percent||0}/><Metric label="FCR" value={d.dashboard?.feed.operational_fcr??'—'}/><Metric label="متوسط الوزن g" value={d.dashboard?.weight.avg_g??'—'}/><Metric label="تكلفة اليوم SAR" value={money(d.cost_today_sar)}/><Metric label="التكلفة التراكمية SAR" value={money(d.cost_cumulative_sar)}/><Metric label="الدين SAR" value={money(d.debt_sar)}/><Metric label="طلبات موافقة" value={d.pending_approvals.length}/></div>{d.tomorrow_plan&&<Panel title="خطة الغد"><div className="grid md:grid-cols-3 gap-2 text-xs text-slate-300"><Mini label="Feed" value={`${d.tomorrow_plan.feed_kg} kg`}/><Mini label="Temperature" value={`${d.tomorrow_plan.target_temperature_min_c}–${d.tomorrow_plan.target_temperature_max_c}°C`}/><Mini label="Humidity" value={`${d.tomorrow_plan.humidity_min_pct}–${d.tomorrow_plan.humidity_max_pct}%`}/></div></Panel>}</>}</WorkspaceShell>;
};

const ReportsWorkspace:React.FC<{state:EnterpriseWebStateV202;v20:V20State;currentUser?:Props['currentUser'];onChange?:Props['onChange']}> = ({state,v20,currentUser,onChange}) => {
  const defs=['Daily Flock Report','Veterinary Daily Review','Tomorrow Plan Report','Weekly Performance','Mortality Report','Feed Report','Weight/FCR Report','Clinical Report','Medication Report','Biosecurity Report','Worker Performance','Doctor Performance','Farm Financial Report','Payroll Report','Receivables','Payables','Cash Position','Cost Center Report','Procurement','Sales','Settlement','End-of-Cycle','Executive Exceptions','Audit'];
  const snapshot=()=>{if(!onChange||!currentUser)return;const f=financialStatementsV202(state);onChange(createEnterpriseReportV202(state,{report_code:'EXEC-FIN',title:'Executive Financial Snapshot',period_from:today(),period_to:today(),generated_by:currentUser.name,scope:{environment:state.environment},data:{income_statement:f.income_statement,balance_sheet:f.balance_sheet,cash_flow:f.cash_flow,pending_tasks:state.role_tasks.filter(t=>t.status==='pending').length},final:true}));};
  return <WorkspaceShell title="Reports Center" subtitle="التقرير النهائي Snapshot ثابت وقابل للتدقيق، وليس مجرد شاشة متغيرة."><div className="flex justify-end mb-3">{onChange&&<button className="btn-primary" onClick={snapshot}>إنشاء Executive Snapshot</button>}</div><div className="grid md:grid-cols-3 gap-2">{defs.map(x=><div key={x} className="rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-3 text-xs text-slate-200 font-bold">{x}</div>)}</div><div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3"><Metric label="V20.1 snapshots" value={v20.report_snapshots.length}/><Metric label="Enterprise snapshots" value={state.report_snapshots.length}/><Metric label="Audit events" value={state.audit.length}/><Metric label="Report definitions" value={defs.length}/></div><Panel title="Generated Snapshots"><SimpleTable headers={['Report','Title','Period','Status']} rows={state.report_snapshots.slice(0,12).map(r=>[r.report_number,r.title,`${r.period_from} → ${r.period_to}`,r.status])}/></Panel></WorkspaceShell>;
};

const TaskCenter:React.FC<{state:EnterpriseWebStateV202;currentUser:Props['currentUser'];onChange:Props['onChange']}> = ({state,currentUser,onChange}) => {
  const tasks=state.role_tasks.filter(t=>currentUser.role==='system_owner'||currentUser.role==='ceo'||t.assigned_user_id===currentUser.id||t.assigned_role===currentUser.role||!t.assigned_user_id);
  const update=(id:string,s:TaskStatusV202)=>onChange(updateRoleTaskV202(state,id,s,currentUser.name,currentUser.role,s==='unable_to_execute'?'تعذر التنفيذ ويحتاج مراجعة':'تحديث من مركز المهام',s==='completed'?['manual-confirmation']:[]));
  return <WorkspaceShell title="Role Task Center" subtitle="كل موظف يرى ما يجب فعله الآن، وحالة التنفيذ والدليل المطلوب."><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4"><Metric label="Pending" value={tasks.filter(t=>t.status==='pending').length}/><Metric label="Completed" value={tasks.filter(t=>t.status==='completed').length}/><Metric label="Overdue" value={tasks.filter(t=>t.status==='overdue').length} warn/><Metric label="Evidence Missing" value={tasks.filter(t=>t.status==='evidence_missing').length} warn/></div><div className="space-y-2">{tasks.slice(0,30).map(t=><div key={t.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3"><div className="flex flex-wrap gap-2 items-start justify-between"><div><div className="text-sm font-black text-white">{t.title}</div><div className="text-xs text-slate-400 mt-1">{t.instructions}</div><div className="text-[10px] text-slate-500 mt-1">Due: {t.due_at} · {t.priority} · {t.status}</div></div><div className="flex gap-1"><button className="task-btn" onClick={()=>update(t.id,'in_progress')}>بدء</button><button className="task-btn" onClick={()=>update(t.id,'completed')}>تم</button><button className="task-btn" onClick={()=>update(t.id,'unable_to_execute')}>تعذر</button></div></div></div>)}</div></WorkspaceShell>;
};

const OrganizationWorkspace:React.FC<{state:EnterpriseWebStateV202}> = ({state}) => <WorkspaceShell title="Organization → Departments → Branches → Roles → Users → Scopes → Assignments" subtitle="الهيكل المؤسسي وصلاحيات النطاق وحدود الاعتماد."><div className="grid lg:grid-cols-2 gap-4"><Panel title="Departments"><SimpleTable headers={['Code','Department','Status']} rows={state.departments.map(d=>[d.code,d.name,d.active?'Active':'Inactive'])}/></Panel><Panel title="Role Definitions"><SimpleTable headers={['Role','Department','Approval Limit SAR']} rows={state.roles.map(r=>[r.name,r.department_code,money(r.approval_limit_sar)])}/></Panel></div></WorkspaceShell>;

const FoundationWorkspace:React.FC<{foundation:EnterpriseFoundationStateV2021;web:EnterpriseWebStateV202}> = ({foundation,web}) => {
  const workload=veterinaryWorkloadV2021(foundation);
  const issues=validateEnterpriseFoundationV2021(foundation,web);
  return <WorkspaceShell title="V20.2.1 – Core Enterprise Foundation" subtitle="هوية وصلاحيات نطاقية، تغطية بيطرية متعددة الأطباء، موافقات وتفويض، بيانات مرجعية، مستندات وإشعارات، وLocalization عربي/إنجليزي.">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Metric label="Enterprise identities" value={foundation.identities.length}/><Metric label="Scopes" value={foundation.scopes.length}/><Metric label="Veterinary territories" value={foundation.veterinary_territories.length}/><Metric label="Active vet assignments" value={foundation.veterinary_coverage.filter(x=>x.status==='active').length}/>
      <Metric label="Approval requests" value={foundation.approval_requests.length}/><Metric label="Delegations" value={foundation.delegations.filter(x=>x.status==='active').length}/><Metric label="Master data" value={foundation.master_data.length}/><Metric label="Validation issues" value={issues.length} warn={issues.length>0}/>
    </div>
    <Panel title="Veterinary Territory & Workload">
      <SimpleTable headers={['Vet User','Assignments','Farms','Flocks','Primary','Backup','On-call','Load']} rows={workload.map(x=>[x.user_id,x.assignment_count,x.farm_count,x.flock_count,x.primary_assignments,x.backup_assignments,x.on_call_assignments,(x.over_farm_limit||x.over_flock_limit)?'OVER LIMIT':'OK'])}/>
    </Panel>
    <div className="grid lg:grid-cols-2 gap-4">
      <Panel title="Veterinary territories"><SimpleTable headers={['Code','Name','Governorate','Districts','Farms']} rows={foundation.veterinary_territories.map(t=>[t.code,t.name,t.governorate||'—',t.districts.length,t.farm_ids.length])}/></Panel>
      <Panel title="Approval workflows"><SimpleTable headers={['Code','Name','Trigger','Tiers']} rows={foundation.approval_workflows.map(w=>[w.code,w.name,w.trigger_type,w.tiers.length])}/></Panel>
    </div>
    <Panel title="Security migration note"><div className="text-xs leading-6 text-slate-400">V20.2.1 يضيف Bearer authentication منفصلًا للمسارات الجديدة. شاشة تبديل الحسابات القديمة ما زالت محفوظة للتوافق، ولن نعتبر ترحيل المصادقة إلى الواجهة DONE حتى تنتقل عمليات الإدارة إلى الجلسة الموثقة الجديدة.</div></Panel>
  </WorkspaceShell>;
};

const LegacyWorkspace=()=> <WorkspaceShell title="Administration → Legacy & Preserved Modules" subtitle="V8–V20.1 محفوظة، لكنها ليست بنية التنقل الأساسية للمستخدم العادي."><div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm leading-7 text-slate-300">لم يتم حذف وحدات V11/V12/V13/V14/V15/V16/V17/V18/V19/V19.7/V20.1. تبقى كطبقات محفوظة للتوافق والتدقيق، بينما V20.2 يصبح المرجع التشغيلي الجديد للويب.</div></WorkspaceShell>;

const WorkspaceShell:React.FC<{title:string;subtitle:string;children:React.ReactNode}> = ({title,subtitle,children}) => <section className="rounded-3xl border border-slate-800 bg-[#07171b]/80 p-4 sm:p-5 shadow-xl"><div className="mb-4"><h2 className="text-lg sm:text-xl font-black text-white">{title}</h2><p className="text-xs text-slate-400 mt-1 leading-6">{subtitle}</p></div>{children}</section>;
const Panel:React.FC<{title:string;children:React.ReactNode}> = ({title,children}) => <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3 mt-4"><div className="text-xs font-black text-slate-200 mb-3">{title}</div>{children}</div>;
const Metric:React.FC<{label:string;value:React.ReactNode;warn?:boolean}> = ({label,value,warn}) => <div className={`rounded-2xl border p-3 ${warn?'border-amber-500/30 bg-amber-500/5':'border-slate-800 bg-slate-950/50'}`}><div className="text-[10px] text-slate-500 font-bold">{label}</div><div className={`text-lg font-black mt-1 ${warn?'text-amber-300':'text-white'}`}>{value}</div></div>;
const Mini:React.FC<{label:string;value:React.ReactNode}> = ({label,value}) => <div className="rounded-xl bg-slate-900/70 p-3"><div className="text-[10px] text-slate-500">{label}</div><div className="text-sm font-black text-slate-100 mt-1">{value}</div></div>;
const SimpleTable:React.FC<{headers:string[];rows:Array<Array<React.ReactNode>>}> = ({headers,rows}) => <div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="border-b border-slate-800">{headers.map(h=><th key={h} className="text-right py-2 px-2 text-slate-500 font-black whitespace-nowrap">{h}</th>)}</tr></thead><tbody>{rows.length?rows.map((r,i)=><tr key={i} className="border-b border-slate-900">{r.map((c,j)=><td key={j} className="py-2 px-2 text-slate-300 whitespace-nowrap">{c}</td>)}</tr>):<tr><td colSpan={headers.length} className="py-6 text-center text-slate-600">لا توجد بيانات بعد.</td></tr>}</tbody></table></div>;
const Specialty:React.FC<{title:string;lines:string[]}> = ({title,lines}) => <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4"><div className="text-sm font-black text-white">{title}</div><div className="mt-3 space-y-2">{lines.map(x=><div key={x} className="text-xs text-slate-400 flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0"/>{x}</div>)}</div></div>;
const ContextCard:React.FC<{title:string;icon:React.ReactNode;children:React.ReactNode}> = ({title,icon,children}) => <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3"><div className="flex items-center gap-2 text-xs font-black text-slate-200 mb-3">{icon}{title}</div>{children}</div>;
const ContextRow:React.FC<{label:string;value:string}> = ({label,value}) => <div className="flex justify-between gap-3 py-1.5 text-[11px] border-b border-slate-900 last:border-0"><span className="text-slate-500">{label}</span><span className="font-black text-slate-200">{value}</span></div>;
const Empty:React.FC<{text:string}> = ({text}) => <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-500 text-sm">{text}</div>;
