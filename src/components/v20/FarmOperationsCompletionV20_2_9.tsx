import React,{useEffect,useMemo,useState} from 'react';
import './FarmWindowsControlCenterR5.css';
import {
  Activity,AlertTriangle,Archive,ArrowLeftRight,BarChart3,Bell,Boxes,Building2,CheckCircle2,ChevronLeft,ChevronRight,
  ClipboardCheck,ClipboardList,CloudOff,Database,Download,Droplets,ExternalLink,FileBarChart2,Filter,FlaskConical,
  HeartPulse,History,Home,Landmark,Leaf,ListTodo,Printer,RefreshCw,Search,Settings2,ShieldCheck,Stethoscope,
  Thermometer,TrendingUp,UploadCloud,UsersRound,Wheat,Wifi,X
} from 'lucide-react';
import type {PlatformRoleV195} from '../../modules/platform/PlatformCoreV19_5';
import type {ManagedOperationsStateV197} from '../../modules/managed/ManagedPoultryOperationsV19_7';
import {
  activateFarmReferenceVersionV2029,addFarmMediaEvidenceV2029,approveFarmExpenseClaimV2029,appendEnvironmentReadingV2029,
  completeFarmTaskV2029,createBenchmarkSnapshotV2029,createClinicalCaseV2029,createFarmAlertV2029,createFarmExpenseClaimV2029,
  createFarmOwnerRelationshipV2029,createFarmReferenceVersionV2029,createFarmStaffAssignmentV2029,createFarmTaskV2029,
  createLabFacilityV2029,createLabSampleV2029,escalateClinicalCaseV2029,farmFinancialKpisV2029,farmRoleDashboardV2029,
  markFarmAccountingIntegrationPostedV2029,markFarmInventoryIntegrationPostedV2029,markOfflineConflictV2029,
  markOfflineOperationSyncedV2029,populationProjectionV2029,queueOfflineOperationV2029,recordBiosecurityInspectionV2029,
  recordFeedConsumptionV2029,recordFeedQualityTestV2029,recordMarketPriceV2029,recordMedicationAdministrationV2029,
  recordMortalityOrCullV2029,recordVaccinationAdministrationV2029,recordWaterConsumptionV2029,recordWaterQualityTestV2029,
  resolveFarmAlertV2029,saveLabResultV2029,setWithdrawalRestrictionV2029,updateLabSampleStatusV2029,validateFarmDivisionV2029,
  type FarmAssignmentRoleV2029,type FarmDivisionStateV2029
} from '../../modules/v20/FarmDivisionCompletionV20_2_9';
import {
  FARM_DIVISION_SCREEN_COUNT_V2029,FARM_DIVISION_SCREENS_V2029,FARM_DIVISION_SECTIONS_V2029,
  farmScreenByCodeV2029,farmScreensForSectionV2029,type FarmScreenDefinitionV2029
} from '../../modules/v20/FarmDivisionScreenRegistryV20_2_9';

interface Props{
  state:FarmDivisionStateV2029;
  managed:ManagedOperationsStateV197;
  currentUser:{id:string;name:string;role:PlatformRoleV195};
  onChange:(next:FarmDivisionStateV2029)=>void;
}
const today=()=>new Date().toISOString().slice(0,10);
const now=()=>new Date().toISOString();
const n=(v:string)=>Number(v||0);
const fmt=(x:number)=>new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(x||0);
const roleOptions:FarmAssignmentRoleV2029[]=['farm_manager','supervisor','worker','doctor','consultant','accountant','vet_assistant','lab_technician','regional_manager'];

const ROLE_SECTION_ACCESS:Partial<Record<PlatformRoleV195,number[]>>={
  system_owner:[1,2,3,4,5,6,7,8,9,10,11,12],ceo:[1,2,3,4,5,6,7,8,9,10,11,12],sector_manager:[1,2,3,4,5,6,7,8,9,10,11,12],
  finance:[1,8,9,10,12],vet_consultant:[2,3,4,5,6,7,11,12],field_vet:[2,3,4,5,6,7,11,12],
  supervisor:[1,2,3,4,5,6,8,9,11,12],worker:[2,3,4,5,11],laboratory:[6,7,11,12],farmer:[1,2,3,4,5,6,9,10,11,12]
};
const canAccessFarmSection=(role:PlatformRoleV195,section:number)=>!ROLE_SECTION_ACCESS[role]||ROLE_SECTION_ACCESS[role]!.includes(section);

const SECTION_ICONS:Record<string,React.ReactNode>={
  CORE:<Building2 className="w-4 h-4"/>,HIER:<Home className="w-4 h-4"/>,DAILY:<ClipboardList className="w-4 h-4"/>,
  NUTR:<Wheat className="w-4 h-4"/>,BIO:<ShieldCheck className="w-4 h-4"/>,VET:<Stethoscope className="w-4 h-4"/>,
  LAB:<FlaskConical className="w-4 h-4"/>,TEAM:<UsersRound className="w-4 h-4"/>,SUPPLY:<Boxes className="w-4 h-4"/>,
  ECON:<Landmark className="w-4 h-4"/>,FIELD:<Wifi className="w-4 h-4"/>,GOV:<FileBarChart2 className="w-4 h-4"/>
};

export const FarmOperationsCompletionV2029:React.FC<Props>=({state,managed,currentUser,onChange})=>{
  const deepLinked=useMemo(()=>{if(typeof window==='undefined')return undefined;return new URLSearchParams(window.location.search).get('farmScreen')||undefined;},[]);
  const roleScreens=useMemo(()=>FARM_DIVISION_SCREENS_V2029.filter(x=>canAccessFarmSection(currentUser.role,x.section)),[currentUser.role]);
  const roleSections=useMemo(()=>FARM_DIVISION_SECTIONS_V2029.filter(x=>canAccessFarmSection(currentUser.role,x.section)),[currentUser.role]);
  const deepScreen=farmScreenByCodeV2029(deepLinked||'');
  const initial=(deepScreen&&canAccessFarmSection(currentUser.role,deepScreen.section)?deepScreen:roleScreens[0])||FARM_DIVISION_SCREENS_V2029[0];
  const [section,setSection]=useState(initial.section);
  const [screenCode,setScreenCode]=useState(initial.code);
  const [screenSearch,setScreenSearch]=useState('');
  const [farmId,setFarmId]=useState(managed.farms[0]?.id||'');
  const [houseId,setHouseId]=useState('');
  const [cycleId,setCycleId]=useState(managed.flock_cycles.find(x=>!farmId||x.farm_id===farmId)?.id||'');
  const [showHistory,setShowHistory]=useState(false);
  const [toast,setToast]=useState<{kind:'ok'|'warn';text:string}|null>(null);
  const [viewMode,setViewMode]=useState<'workspace'|'directory'>('workspace');

  const screens=farmScreensForSectionV2029(section);
  const selected=farmScreenByCodeV2029(screenCode)||screens[0]||FARM_DIVISION_SCREENS_V2029[0];
  const houses=managed.houses.filter(x=>!farmId||x.farm_id===farmId);
  const cycles=managed.flock_cycles.filter(x=>!farmId||x.farm_id===farmId);
  const validation=useMemo(()=>validateFarmDivisionV2029(state,managed),[state,managed]);
  const dashboard=useMemo(()=>farmRoleDashboardV2029(state,managed,currentUser.role,currentUser.id),[state,managed,currentUser]);
  const financial=useMemo(()=>farmId?farmFinancialKpisV2029(state,managed,farmId,cycleId||undefined):undefined,[state,managed,farmId,cycleId]);
  const projection=useMemo(()=>cycleId?populationProjectionV2029(state,managed,cycleId):undefined,[state,managed,cycleId]);
  const filteredDirectory=useMemo(()=>{
    const q=screenSearch.trim().toLowerCase();
    return q?roleScreens.filter(x=>`${x.code} ${x.name_ar} ${x.section_name_ar}`.toLowerCase().includes(q)):roleScreens;
  },[screenSearch,roleScreens]);
  const implementedScreens=useMemo(()=>FARM_DIVISION_SCREENS_V2029.filter(x=>Boolean(x.route)&&x.capabilities.length>0).length,[]);
  const readinessChecks=[
    state.settings.min_completeness_percent>=90,state.settings.durable_offline_queue_required,state.settings.media_encryption_required,
    state.settings.sensor_readings_append_only,state.settings.lab_final_requires_reviewer,state.settings.no_duplicate_inventory_ledger,
    state.settings.no_duplicate_financial_ledger,state.shared_report_execution_owner==='SECTION_14',state.shared_governance_owner==='SECTION_15',
    FARM_DIVISION_SCREEN_COUNT_V2029===177,implementedScreens===FARM_DIVISION_SCREEN_COUNT_V2029,validation.length===0
  ];
  const readiness=Math.round(readinessChecks.filter(Boolean).length/readinessChecks.length*100);

  useEffect(()=>{
    if(typeof window==='undefined'||!selected)return;
    const u=new URL(window.location.href);u.searchParams.set('farmScreen',selected.code);window.history.replaceState({},'',u);
  },[selected?.code]);
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(null),3200);return()=>clearTimeout(t)},[toast]);

  const gotoScreen=(screen:FarmScreenDefinitionV2029)=>{if(!canAccessFarmSection(currentUser.role,screen.section)){setToast({kind:'warn',text:'هذه الشاشة خارج نطاق صلاحيات دورك الحالي.'});return;}setSection(screen.section);setScreenCode(screen.code);setViewMode('workspace');setShowHistory(false)};
  const switchSection=(id:number)=>{setSection(id);const first=farmScreensForSectionV2029(id)[0];if(first)setScreenCode(first.code);setViewMode('workspace');setShowHistory(false)};
  const nextScreen=(delta:number)=>{const idx=FARM_DIVISION_SCREENS_V2029.findIndex(x=>x.code===selected.code);const nxt=FARM_DIVISION_SCREENS_V2029[Math.max(0,Math.min(FARM_DIVISION_SCREENS_V2029.length-1,idx+delta))];if(nxt)gotoScreen(nxt)};
  const run=(fn:()=>void,message:string)=>{try{fn();setToast({kind:'ok',text:message})}catch(e){setToast({kind:'warn',text:e instanceof Error?e.message:'تعذر تنفيذ العملية'})}};
  const exportScreen=()=>{if(typeof window==='undefined')return;const payload={screen:selected,context:{farm_id:farmId,house_id:houseId,cycle_id:cycleId},data:screenRows(selected,state,managed,farmId,houseId,cycleId),exported_at:now()};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`farm-${selected.code}-${today()}.json`;a.click();URL.revokeObjectURL(url);setToast({kind:'ok',text:`تم تصدير بيانات ${selected.code}`})};

  return <section className="farm-control-shell" dir="rtl">
    {toast&&<div className={`farm-toast ${toast.kind==='ok'?'farm-toast-ok':'farm-toast-warn'}`}>{toast.kind==='ok'?<CheckCircle2 className="w-4 h-4"/>:<AlertTriangle className="w-4 h-4"/>}<span>{toast.text}</span><button onClick={()=>setToast(null)}><X className="w-4 h-4"/></button></div>}

    <header className="farm-hero">
      <div className="min-w-0">
        <div className="farm-eyebrow">WINDOWS / WEB CONTROL CENTER · FARM R4 DOMAIN + R5 PROFESSIONAL UI</div>
        <h2>مركز تشغيل وإدارة المزارع</h2>
        <p>177 وجهة تشغيل فعلية داخل مساحة Windows/Web، مع الحفاظ على Factory R3 وFarm R4 وربط المخزون بـSection 7 والمحاسبة بـSection 12.</p>
      </div>
      <div className="farm-gate-card"><span>Windows Farm Gate</span><strong>{readiness}%</strong><small>{implementedScreens}/{FARM_DIVISION_SCREEN_COUNT_V2029} destinations</small></div>
    </header>

    <div className="farm-kpi-grid">
      <Metric label="الشاشات الفعلية" value={`${implementedScreens}/${FARM_DIVISION_SCREEN_COUNT_V2029}`}/>
      <Metric label="الأقسام المتاحة لدوري" value={`${roleSections.length}/${FARM_DIVISION_SECTIONS_V2029.length}`}/><Metric label="المزارع" value={managed.farms.length}/><Metric label="الدورات" value={managed.flock_cycles.length}/>
      <Metric label="تنبيهات مفتوحة" value={state.alerts.filter(x=>x.status!=='resolved').length}/><Metric label="مهام مفتوحة" value={state.tasks.filter(x=>x.status!=='completed').length}/>
      <Metric label="Offline Conflicts" value={state.offline_queue.filter(x=>x.status==='conflict').length}/><Metric label="Validation" value={validation.length?'ATTENTION':'PASS'} warn={validation.length>0}/>
    </div>

    <div className="farm-main-layout">
      <aside className="farm-sidebar">
        <div className="farm-sidebar-title"><span>الأقسام</span><button className="farm-icon-btn" onClick={()=>setViewMode(viewMode==='directory'?'workspace':'directory')} title="دليل الشاشات"><Search className="w-4 h-4"/></button></div>
        <div className="farm-section-list">{roleSections.map(x=><button key={x.section} onClick={()=>switchSection(x.section)} className={`farm-section-btn ${section===x.section?'farm-section-active':''}`}><span className="farm-section-icon">{SECTION_ICONS[x.code]||<ClipboardList className="w-4 h-4"/>}</span><span className="min-w-0"><b>{x.section}. {x.name_ar}</b><small>{x.count} شاشة</small></span></button>)}</div>
        <div className="farm-screen-list-title">شاشات القسم</div>
        <div className="farm-screen-list">{screens.map(x=><button key={x.code} onClick={()=>gotoScreen(x)} className={`farm-screen-link ${screenCode===x.code?'farm-screen-link-active':''}`}><span>{x.code}</span><b>{x.name_ar}</b></button>)}</div>
      </aside>

      <main className="farm-workspace">
        <div className="farm-context-bar">
          <div className="farm-context-grid">
            <Select value={farmId} onChange={v=>{setFarmId(v);setHouseId('');setCycleId(managed.flock_cycles.find(c=>c.farm_id===v)?.id||'')}} options={[['','اختر المزرعة'],...managed.farms.map(x=>[x.id,x.name])]}/>
            <Select value={houseId} onChange={setHouseId} options={[['','كل الحظائر'],...houses.map(x=>[x.id,x.name])]}/>
            <Select value={cycleId} onChange={setCycleId} options={[['','اختر الدورة'],...cycles.map(x=>[x.id,x.flock_code])]}/>
          </div>
          <div className="farm-context-actions"><button className="farm-secondary-btn" onClick={()=>setViewMode('directory')}><Search className="w-4 h-4"/>دليل 177 شاشة</button><button className="farm-secondary-btn" onClick={()=>setShowHistory(!showHistory)}><History className="w-4 h-4"/>السجل</button></div>
        </div>

        {viewMode==='directory'?<ScreenDirectory query={screenSearch} onQuery={setScreenSearch} screens={filteredDirectory} selected={selected.code} onOpen={gotoScreen}/>:<>
          <ScreenHeader selected={selected} onPrev={()=>nextScreen(-1)} onNext={()=>nextScreen(1)} />
          <ScreenToolbar selected={selected} onExport={exportScreen} onPrint={()=>window.print()} onHistory={()=>setShowHistory(!showHistory)} onRefresh={()=>setToast({kind:'ok',text:'تم تحديث العرض من الحالة الحالية'})}/>
          <ScreenOperationalCanvas selected={selected} state={state} managed={managed} farmId={farmId} houseId={houseId} cycleId={cycleId} currentUser={currentUser} onChange={onChange} run={run}/>
          {showHistory&&<AuditHistory state={state} selected={selected} farmId={farmId}/>} 
          <div className="farm-three-column">
            <Panel title="لوحة دوري"><Rows rows={[["Role",dashboard.role],["Farms",dashboard.farm_count],["Cycles",dashboard.cycle_count],["Open alerts",dashboard.open_alerts],["Pending tasks",dashboard.pending_tasks],["Clinical open",dashboard.clinical_open]]}/></Panel>
            <Panel title="Population Projection"><Rows rows={projection?[["Initial",projection.initial],["Current",projection.current],["Events",projection.events],["Legacy current",projection.legacy_projection_current],["Reconciled",projection.reconciled?'YES':'NO']]:[["Status","اختر دورة"]]}/></Panel>
            <Panel title="Economics"><Rows rows={financial?[["Total cost SAR",fmt(financial.total_cost_sar)],["Estimated revenue SAR",fmt(financial.estimated_revenue_sar)],["Margin SAR",fmt(financial.margin_sar)],["Break-even / live bird",fmt(financial.break_even_per_live_bird_sar)]]:[["Status","اختر مزرعة"]]}/></Panel>
          </div>
          {validation.length>0&&<Panel title="Validation Issues"><div className="space-y-1">{validation.map(x=><div key={x} className="text-xs text-amber-300 flex gap-2"><AlertTriangle className="w-3.5 h-3.5"/>{x}</div>)}</div></Panel>}
        </>}
      </main>
    </div>
  </section>;
};

const ScreenHeader:React.FC<{selected:FarmScreenDefinitionV2029;onPrev:()=>void;onNext:()=>void}>=({selected,onPrev,onNext})=><div className="farm-screen-header">
  <div className="min-w-0"><div className="farm-breadcrumb"><span>Farm Operations</span><span>›</span><span>{selected.section_name_ar}</span><span>›</span><strong>{selected.code}</strong></div><h3>{selected.name_ar}</h3><p>{selected.purpose_ar}</p><div className="farm-route"><ExternalLink className="w-3.5 h-3.5"/>{selected.route}</div></div>
  <div className="farm-pager"><button onClick={onPrev}><ChevronRight className="w-4 h-4"/></button><span>{FARM_DIVISION_SCREENS_V2029.findIndex(x=>x.code===selected.code)+1} / {FARM_DIVISION_SCREEN_COUNT_V2029}</span><button onClick={onNext}><ChevronLeft className="w-4 h-4"/></button></div>
</div>;

const ScreenToolbar:React.FC<{selected:FarmScreenDefinitionV2029;onExport:()=>void;onPrint:()=>void;onHistory:()=>void;onRefresh:()=>void}>=({selected,onExport,onPrint,onHistory,onRefresh})=><div className="farm-toolbar">
  <div className="farm-capabilities">{selected.capabilities.map(x=><span key={x}>{capLabel(x)}</span>)}</div>
  <div className="farm-toolbar-actions"><button onClick={onRefresh}><RefreshCw className="w-4 h-4"/>تحديث</button><button onClick={onHistory}><History className="w-4 h-4"/>تاريخ</button><button onClick={onExport}><Download className="w-4 h-4"/>تصدير</button><button onClick={onPrint}><Printer className="w-4 h-4"/>طباعة</button></div>
</div>;

const ScreenDirectory:React.FC<{query:string;onQuery:(v:string)=>void;screens:FarmScreenDefinitionV2029[];selected:string;onOpen:(s:FarmScreenDefinitionV2029)=>void}>=({query,onQuery,screens,selected,onOpen})=><div className="farm-directory">
  <div className="farm-directory-head"><div><h3>دليل شاشات Farm Operations</h3><p>كل سجل أدناه وجهة مستقلة يمكن فتحها مباشرة، والبحث يشمل الكود والاسم والقسم.</p></div><div className="farm-search"><Search className="w-4 h-4"/><input value={query} onChange={e=>onQuery(e.target.value)} placeholder="ابحث في 177 شاشة..."/></div></div>
  <div className="farm-directory-grid">{screens.map(s=><button key={s.code} onClick={()=>onOpen(s)} className={`farm-directory-card ${selected===s.code?'farm-directory-card-active':''}`}><div className="farm-directory-code">{s.code}<span>{s.kind}</span></div><b>{s.name_ar}</b><small>{s.section}. {s.section_name_ar}</small><div className="farm-directory-route">{s.route}</div></button>)}</div>
</div>;

type CanvasProps={selected:FarmScreenDefinitionV2029;state:FarmDivisionStateV2029;managed:ManagedOperationsStateV197;farmId:string;houseId:string;cycleId:string;currentUser:Props['currentUser'];onChange:Props['onChange'];run:(fn:()=>void,message:string)=>void};
const ScreenOperationalCanvas:React.FC<CanvasProps>=p=>{
  const rows=screenRows(p.selected,p.state,p.managed,p.farmId,p.houseId,p.cycleId);
  const metrics=screenMetrics(p.selected,p.state,p.managed,p.farmId,p.cycleId);
  return <div className="farm-screen-canvas">
    <div className="farm-canvas-status"><div><span className="farm-status-dot"/>واجهة تشغيل مستقلة</div><div>Source: {screenSource(p.selected)}</div><div>Role: {p.currentUser.role}</div></div>
    <div className="farm-screen-metrics">{metrics.map(x=><Mini key={x[0]} label={x[0]} value={x[1]}/>)}</div>
    <ScreenSpecificActions {...p}/>
    <Panel title={`بيانات الشاشة · ${p.selected.code}`}><GenericObjectTable rows={rows}/></Panel>
    <ContextIntegrity selected={p.selected} farmId={p.farmId} houseId={p.houseId} cycleId={p.cycleId}/>
  </div>;
};

const ScreenSpecificActions:React.FC<CanvasProps>=p=>{
  const c=p.selected.code;
  if(c.startsWith('CORE-')) return <CoreActions {...p}/>;
  if(c.startsWith('HIER-')) return <HierarchyActions {...p}/>;
  if(c.startsWith('DAY-')) return <DailyActions {...p}/>;
  if(c.startsWith('NUTR-')) return <NutritionActions {...p}/>;
  if(c.startsWith('BIO-')) return <BioActions {...p}/>;
  if(c.startsWith('VET-')) return <ClinicalActions {...p}/>;
  if(c.startsWith('LAB-')) return <LabActions {...p}/>;
  if(c.startsWith('TEAM-')) return <TeamActions {...p}/>;
  if(c.startsWith('SUP-')) return <SupplyActions {...p}/>;
  if(c.startsWith('ECO-')) return <EconomicsActions {...p}/>;
  if(c.startsWith('FLD-')) return <FieldActions {...p}/>;
  return <GovernanceActions {...p}/>;
};

const CoreActions:React.FC<CanvasProps>=p=>{const [name,setName]=useState('');const add=()=>p.run(()=>{if(!p.farmId||!name.trim())throw new Error('اختر المزرعة وأدخل اسم المالك/الجهة.');p.onChange(createFarmOwnerRelationshipV2029(p.state,{farm_id:p.farmId,party_id:`party-${Date.now()}`,party_type:'person',display_name:name.trim(),ownership_percent:100,is_primary:true,effective_from:today(),created_by:p.currentUser.name},p.currentUser.name,p.currentUser.role));setName('')},'تم إنشاء علاقة ملكية فعالة');return <ActionPanel title="إجراءات الهيكل والملكية"><div className="farm-form-grid"><Field label="اسم المالك/الجهة"><input value={name} onChange={e=>setName(e.target.value)} placeholder="اسم المالك أو الشركة"/></Field><div className="farm-form-action"><button className="farm-primary-btn" onClick={add}><Building2 className="w-4 h-4"/>إضافة علاقة ملكية</button></div></div><ActionHint text={p.selected.code==='CORE-03'?'إنشاء المزرعة الأساسية يتم في مصدر Managed Operations المحفوظ؛ هذه الشاشة تربط وتعرض ملف المزرعة دون إنشاء مصدر حقيقة ثانٍ.':'الملف يستخدم معرف المزرعة الحالي ويربط الملكية والمستندات والتاريخ به.'}/></ActionPanel>};

const HierarchyActions:React.FC<CanvasProps>=p=><ActionPanel title="تشغيل الحظائر والدورات"><div className="farm-action-row"><button className="farm-secondary-btn" onClick={()=>p.run(()=>{if(!p.farmId)throw new Error('اختر مزرعة.');},'تم التحقق من سياق المزرعة')}><ClipboardCheck className="w-4 h-4"/>فحص السياق</button><button className="farm-secondary-btn" onClick={()=>p.run(()=>{if(!p.houseId)throw new Error('اختر حظيرة.');},'الحظيرة جاهزة للعرض')}><Home className="w-4 h-4"/>فتح الحظيرة</button><button className="farm-secondary-btn" onClick={()=>p.run(()=>{if(!p.cycleId)throw new Error('اختر دورة.');},'تم فتح دورة القطيع')}><Activity className="w-4 h-4"/>فتح الدورة</button></div><ActionHint text="المزرعة/الحظيرة/الدورة تبقى Canonical في Managed Operations V19.7. لا يتم إنشاء نسخة مكررة داخل Farm R5."/></ActionPanel>;

const DailyActions:React.FC<CanvasProps>=p=>{const [count,setCount]=useState('1');const [kind,setKind]=useState<'mortality'|'cull'>('mortality');const add=()=>p.run(()=>{if(!p.farmId||!p.houseId||!p.cycleId)throw new Error('اختر المزرعة والحظيرة والدورة.');p.onChange(recordMortalityOrCullV2029(p.state,{farm_id:p.farmId,house_id:p.houseId,cycle_id:p.cycleId,kind,count:n(count),date:today(),necropsy_required:kind==='mortality'&&n(count)>3,evidence_refs:[],actor_id:p.currentUser.id,actor_name:p.currentUser.name,actor_role:p.currentUser.role,idempotency_key:`${kind}-${p.cycleId}-${today()}-${Date.now()}`}))},'تم تسجيل حدث السكان');return <ActionPanel title="التشغيل اليومي والسكان"><div className="farm-form-grid farm-form-grid-4"><Field label="النوع"><select value={kind} onChange={e=>setKind(e.target.value as any)}><option value="mortality">نفوق</option><option value="cull">استبعاد</option></select></Field><Field label="العدد"><input type="number" min="1" value={count} onChange={e=>setCount(e.target.value)}/></Field><div className="farm-form-action"><button className="farm-primary-btn" onClick={add}><ClipboardList className="w-4 h-4"/>تسجيل الحدث</button></div></div></ActionPanel>};

const NutritionActions:React.FC<CanvasProps>=p=>{const [feed,setFeed]=useState('100');const [water,setWater]=useState('500');const [temp,setTemp]=useState('27');const [ph,setPh]=useState('7');const saveDaily=()=>p.run(()=>{if(!p.farmId||!p.houseId||!p.cycleId)throw new Error('اختر المزرعة والحظيرة والدورة.');let next=recordFeedConsumptionV2029(p.state,{farm_id:p.farmId,house_id:p.houseId,cycle_id:p.cycleId,date:today(),feed_name:'Farm Feed',stage:'other',opening_kg:n(feed),received_kg:0,consumed_kg:n(feed),closing_kg:0,wastage_kg:0,entered_by:p.currentUser.name,idempotency_key:`feed-${p.cycleId}-${Date.now()}`});next=recordWaterConsumptionV2029(next,{farm_id:p.farmId,house_id:p.houseId,cycle_id:p.cycleId,date:today(),source:'Farm source',consumed_liters:n(water),flush_liters:0,medication_water_liters:0,entered_by:p.currentUser.name,idempotency_key:`water-${p.cycleId}-${Date.now()}`});next=appendEnvironmentReadingV2029(next,{farm_id:p.farmId,house_id:p.houseId,cycle_id:p.cycleId,measured_at:now(),source:'manual',temperature_c:n(temp),humidity_pct:60,note:'Windows control center reading'});p.onChange(next)},'تم حفظ العلف والمياه والبيئة');const waterQuality=()=>p.run(()=>{if(!p.farmId)throw new Error('اختر المزرعة.');p.onChange(recordWaterQualityTestV2029(p.state,{farm_id:p.farmId,house_id:p.houseId||undefined,sample_date:today(),source:'Farm source',ph:n(ph),decision:n(ph)>=6&&n(ph)<=8?'pass':'conditional',reviewed_by:p.currentUser.name}))},'تم تسجيل فحص جودة المياه');const feedQuality=()=>p.run(()=>{if(!p.farmId)throw new Error('اختر المزرعة.');p.onChange(recordFeedQualityTestV2029(p.state,{farm_id:p.farmId,cycle_id:p.cycleId||undefined,feed_name:'Farm Feed',sample_date:today(),moisture_pct:12,decision:'pass',reviewed_by:p.currentUser.name}))},'تم تسجيل فحص جودة العلف');return <ActionPanel title="العلف والمياه والبيئة والجودة"><div className="farm-form-grid farm-form-grid-4"><Field label="العلف كجم"><input type="number" value={feed} onChange={e=>setFeed(e.target.value)}/></Field><Field label="المياه لتر"><input type="number" value={water} onChange={e=>setWater(e.target.value)}/></Field><Field label="الحرارة °C"><input type="number" value={temp} onChange={e=>setTemp(e.target.value)}/></Field><div className="farm-form-action"><button className="farm-primary-btn" onClick={saveDaily}><Thermometer className="w-4 h-4"/>حفظ يومي</button></div></div><div className="farm-action-row"><Field label="pH"><input className="w-24" value={ph} onChange={e=>setPh(e.target.value)}/></Field><button className="farm-secondary-btn" onClick={waterQuality}><Droplets className="w-4 h-4"/>فحص مياه</button><button className="farm-secondary-btn" onClick={feedQuality}><Wheat className="w-4 h-4"/>فحص علف</button></div></ActionPanel>};

const BioActions:React.FC<CanvasProps>=p=>{const inspect=()=>p.run(()=>{if(!p.farmId)throw new Error('اختر المزرعة.');p.onChange(recordBiosecurityInspectionV2029(p.state,{farm_id:p.farmId,house_id:p.houseId||undefined,date:today(),inspection_type:'daily',inspector:p.currentUser.name,visitor_control:90,vehicle_control:85,footbath:90,pest_control:80,carcass_disposal:90,cleaning_disinfection:90,findings:[],corrective_actions:[],evidence_refs:[],status:'open'}))},'تم إنشاء فحص أمان حيوي');return <ActionPanel title="الأمان الحيوي"><div className="farm-action-row"><button className="farm-primary-btn" onClick={inspect}><ShieldCheck className="w-4 h-4"/>إنشاء فحص يومي</button><span className="farm-inline-note">أي نتيجة منخفضة تنشئ Alert وفق قواعد Farm R4.</span></div></ActionPanel>};

const ClinicalActions:React.FC<CanvasProps>=p=>{const [complaint,setComplaint]=useState('انخفاض استهلاك العلف');const add=()=>p.run(()=>{if(!p.farmId||!p.cycleId)throw new Error('اختر المزرعة والدورة.');p.onChange(createClinicalCaseV2029(p.state,{farm_id:p.farmId,house_id:p.houseId||undefined,cycle_id:p.cycleId,opened_by:p.currentUser.name,complaint,signs:[],differential_diagnoses:[],assigned_doctor_id:p.currentUser.id,assigned_doctor_name:p.currentUser.name}))},'تم فتح حالة سريرية');const current=p.state.clinical_cases.find(x=>x.cycle_id===p.cycleId)||p.state.clinical_cases[0];const escalate=()=>p.run(()=>{if(!current)throw new Error('لا توجد حالة سريرية.');p.onChange(escalateClinicalCaseV2029(p.state,current.id,{id:p.currentUser.id,name:`Consultant / ${p.currentUser.name}`}))},'تم تصعيد الحالة للاستشاري');const withdrawal=()=>p.run(()=>{if(!current)throw new Error('لا توجد حالة سريرية.');const d=new Date();d.setDate(d.getDate()+7);p.onChange(setWithdrawalRestrictionV2029(p.state,current.id,true,d.toISOString().slice(0,10),'Medication withdrawal'))},'تم تفعيل فترة السحب');const med=()=>p.run(()=>{if(!p.farmId||!p.cycleId||!current)throw new Error('اختر دورة وافتح حالة أولاً.');p.onChange(recordMedicationAdministrationV2029(p.state,{farm_id:p.farmId,house_id:p.houseId||undefined,cycle_id:p.cycleId,clinical_case_id:current.id,prescription_reference_id:`RX-${Date.now()}`,date:today(),medication_name:'Treatment',quantity:1,unit:'L',route:'water',withdrawal_days:7,administered_by:p.currentUser.name,authorized_by_doctor:p.currentUser.name,evidence_refs:[]}))},'تم تنفيذ الدواء وإرسال حدث S7');const vacc=()=>p.run(()=>{if(!p.farmId||!p.cycleId)throw new Error('اختر المزرعة والدورة.');p.onChange(recordVaccinationAdministrationV2029(p.state,{farm_id:p.farmId,house_id:p.houseId||undefined,cycle_id:p.cycleId,vaccination_plan_reference_id:`VP-${Date.now()}`,date:today(),vaccine_name:'Vaccine',quantity:1000,unit:'dose',cold_chain_ok:true,administered_by:p.currentUser.name,authorized_by_doctor:p.currentUser.name,evidence_refs:[]}))},'تم تنفيذ التحصين وإرسال حدث S7');return <ActionPanel title="الصحة والطب البيطري"><div className="farm-form-grid"><Field label="الشكوى"><input value={complaint} onChange={e=>setComplaint(e.target.value)}/></Field><div className="farm-form-action"><button className="farm-primary-btn" onClick={add}><HeartPulse className="w-4 h-4"/>فتح حالة</button></div></div><div className="farm-action-row"><button className="farm-secondary-btn" onClick={escalate}><Stethoscope className="w-4 h-4"/>تصعيد استشاري</button><button className="farm-secondary-btn" onClick={withdrawal}><Archive className="w-4 h-4"/>فترة سحب</button><button className="farm-secondary-btn" onClick={med}><Boxes className="w-4 h-4"/>تنفيذ دواء</button><button className="farm-secondary-btn" onClick={vacc}><ShieldCheck className="w-4 h-4"/>تنفيذ تحصين</button></div></ActionPanel>};

const LabActions:React.FC<CanvasProps>=p=>{const [facility,setFacility]=useState('مختبر شريك');const addFacility=()=>p.run(()=>p.onChange(createLabFacilityV2029(p.state,{name:facility,facility_type:'partner',governorate:'غير محدد',supported_tests:['PCR','Culture','Sensitivity'],active:true})),'تم إضافة المختبر');const addSample=()=>p.run(()=>{const c=p.state.clinical_cases.find(x=>x.cycle_id===p.cycleId)||p.state.clinical_cases[0];const f=p.state.lab_facilities[0];if(!c||!f)throw new Error('يلزم وجود حالة سريرية ومختبر.');p.onChange(createLabSampleV2029(p.state,{clinical_case_id:c.id,farm_id:c.farm_id,cycle_id:c.cycle_id,facility_id:f.id,sample_type:'Field sample',requested_tests:['PCR']}))},'تم تسجيل العينة');const advance=()=>p.run(()=>{const s=p.state.lab_samples[0];if(!s)throw new Error('لا توجد عينة.');const order:any={registered:'collected',collected:'in_transit',in_transit:'received',received:'testing',testing:'result_ready',result_ready:'final',final:'final',rejected:'registered'};p.onChange(updateLabSampleStatusV2029(p.state,s.id,order[s.status]||'testing',p.currentUser.name))},'تم تحديث سلسلة حيازة العينة');const result=()=>p.run(()=>{const s=p.state.lab_samples[0];if(!s)throw new Error('لا توجد عينة.');p.onChange(saveLabResultV2029(p.state,{sample_id:s.id,result_text:'Reviewed final result',findings:{reviewed:true},prepared_by:p.currentUser.name,finalize:true,lab_reviewer:p.currentUser.name}))},'تم اعتماد النتيجة النهائية');return <ActionPanel title="المختبر وسلسلة الحيازة"><div className="farm-action-row"><input className="farm-compact-input" value={facility} onChange={e=>setFacility(e.target.value)}/><button className="farm-secondary-btn" onClick={addFacility}>إضافة مختبر</button><button className="farm-secondary-btn" onClick={addSample}>تسجيل عينة</button><button className="farm-secondary-btn" onClick={advance}><ArrowLeftRight className="w-4 h-4"/>تقدم الحالة</button><button className="farm-primary-btn" onClick={result}><FlaskConical className="w-4 h-4"/>اعتماد نتيجة</button></div></ActionPanel>};

const TeamActions:React.FC<CanvasProps>=p=>{const [user,setUser]=useState('');const [role,setRole]=useState<FarmAssignmentRoleV2029>('worker');const add=()=>p.run(()=>{if(!p.farmId||!user.trim())throw new Error('اختر المزرعة وأدخل اسم الموظف.');p.onChange(createFarmStaffAssignmentV2029(p.state,{farm_id:p.farmId,house_id:p.houseId||undefined,cycle_id:p.cycleId||undefined,user_id:`user-${Date.now()}`,user_name:user,role,effective_from:today(),primary:false,on_call:false,created_by:p.currentUser.name},p.currentUser.name,p.currentUser.role));setUser('')},'تم إنشاء التكليف الفعال');return <ActionPanel title="الفريق والتكليفات"><div className="farm-form-grid farm-form-grid-4"><Field label="الموظف"><input value={user} onChange={e=>setUser(e.target.value)}/></Field><Field label="الدور"><select value={role} onChange={e=>setRole(e.target.value as FarmAssignmentRoleV2029)}>{roleOptions.map(x=><option key={x}>{x}</option>)}</select></Field><div className="farm-form-action"><button className="farm-primary-btn" onClick={add}><UsersRound className="w-4 h-4"/>إضافة تكليف</button></div></div></ActionPanel>};

const SupplyActions:React.FC<CanvasProps>=p=>{const post=()=>p.run(()=>{const e=p.state.inventory_integration_events.find(x=>x.status==='pending_s7');if(!e)throw new Error('لا يوجد حدث S7 معلّق.');p.onChange(markFarmInventoryIntegrationPostedV2029(p.state,e.id,`S7-${Date.now()}`))},'تم تسجيل مرجع حركة Section 7');return <ActionPanel title="تكامل المخزون والإمداد"><div className="farm-action-row"><button className="farm-primary-btn" onClick={post}><Boxes className="w-4 h-4"/>تأكيد حركة S7 المعلقة</button><span className="farm-inline-note">Farm يطلب/يعرض الحركة فقط؛ Section 7 هو مالك الرصيد والتقييم.</span></div></ActionPanel>};

const EconomicsActions:React.FC<CanvasProps>=p=>{const [amount,setAmount]=useState('100');const expense=()=>p.run(()=>{if(!p.farmId)throw new Error('اختر المزرعة.');p.onChange(createFarmExpenseClaimV2029(p.state,{farm_id:p.farmId,house_id:p.houseId||undefined,cycle_id:p.cycleId||undefined,category:'daily_expense',description:'مصروف تشغيلي ميداني',date:today(),amount:n(amount),currency:'SAR',requested_by:p.currentUser.name,settlement_mode:'cash',evidence_refs:[]}))},'تم إرسال مطالبة المصروف');const approve=()=>p.run(()=>{const c=p.state.expense_claims.find(x=>x.status==='submitted');if(!c)throw new Error('لا توجد مطالبة معلقة.');p.onChange(approveFarmExpenseClaimV2029(p.state,c.id,true))},'تم اعتماد المطالبة وإرسالها إلى Section 12');const post=()=>p.run(()=>{const e=p.state.accounting_integration_events.find(x=>x.status==='pending_s12');if(!e)throw new Error('لا يوجد حدث S12 معلّق.');p.onChange(markFarmAccountingIntegrationPostedV2029(p.state,e.id,`S12-${Date.now()}`))},'تم تسجيل مرجع محاسبي من Section 12');const price=()=>p.run(()=>p.onChange(recordMarketPriceV2029(p.state,{date:today(),governorate:'Yemen',commodity:'live_bird',item_name:'Live Broiler',unit:'bird',currency:'SAR',price:15,source_type:'manual',entered_by:p.currentUser.name,approved:true})),'تم تسجيل سعر السوق');const bench=()=>p.run(()=>{if(!p.farmId)throw new Error('اختر المزرعة.');p.onChange(createBenchmarkSnapshotV2029(p.state,{date:today(),farm_id:p.farmId,house_id:p.houseId||undefined,cycle_id:p.cycleId||undefined,scope:p.cycleId?'cycle':p.houseId?'house':'farm',reference_group:'Farm R5 operational benchmark'}))},'تم إنشاء Benchmark snapshot');return <ActionPanel title="الاقتصاد والمحاسبة"><div className="farm-action-row"><input className="farm-compact-input w-28" type="number" value={amount} onChange={e=>setAmount(e.target.value)}/><button className="farm-secondary-btn" onClick={expense}>مطالبة مصروف</button><button className="farm-secondary-btn" onClick={approve}>اعتماد → S12</button><button className="farm-secondary-btn" onClick={post}>مرجع S12</button><button className="farm-secondary-btn" onClick={price}><TrendingUp className="w-4 h-4"/>سعر سوق</button><button className="farm-primary-btn" onClick={bench}><BarChart3 className="w-4 h-4"/>Benchmark</button></div></ActionPanel>};

const FieldActions:React.FC<CanvasProps>=p=>{const queue=()=>p.run(()=>p.onChange(queueOfflineOperationV2029(p.state,{device_id:'windows-control-center',user_id:p.currentUser.id,entity_type:p.selected.code,entity_id:p.cycleId||p.farmId||'unassigned',operation:'append',payload_hash:`hash-${Date.now()}`,idempotency_key:`offline-${Date.now()}`,captured_at:now(),device_clock_drift_ms:0})),'تمت إضافة العملية للطابور المشفر');const sync=()=>p.run(()=>{const q=p.state.offline_queue.find(x=>x.status==='queued');if(!q)throw new Error('لا توجد عملية Queued.');p.onChange(markOfflineOperationSyncedV2029(p.state,q.id))},'تم تعليم العملية كمزامنة');const conflict=()=>p.run(()=>{const q=p.state.offline_queue[0];if(!q)throw new Error('لا توجد عملية Offline.');p.onChange(markOfflineConflictV2029(p.state,q.id,['field_value']))},'تم تسجيل تعارض حسب الحقل');const media=()=>p.run(()=>{if(!p.farmId)throw new Error('اختر المزرعة.');p.onChange(addFarmMediaEvidenceV2029(p.state,{farm_id:p.farmId,house_id:p.houseId||undefined,cycle_id:p.cycleId||undefined,entity_type:p.selected.code,entity_id:p.cycleId||p.farmId,kind:'photo',file_name:`evidence-${Date.now()}.jpg`,captured_at:now()}))},'تم إنشاء سجل وسائط مشفر');const alert=()=>p.run(()=>{if(!p.farmId)throw new Error('اختر المزرعة.');p.onChange(createFarmAlertV2029(p.state,{farm_id:p.farmId,house_id:p.houseId||undefined,cycle_id:p.cycleId||undefined,category:'task',severity:'warning',title:'متابعة ميدانية',message:'Generated from Windows Farm control center',source_entity_type:p.selected.code,source_entity_id:`manual-${Date.now()}`,assigned_role:'supervisor'}))},'تم إنشاء التنبيه');const task=()=>p.run(()=>{if(!p.farmId)throw new Error('اختر المزرعة.');p.onChange(createFarmTaskV2029(p.state,{farm_id:p.farmId,house_id:p.houseId||undefined,cycle_id:p.cycleId||undefined,title:`مهمة ${p.selected.code}`,instructions:'تنفيذ المهمة وتوثيقها من مركز Windows',assigned_user_id:p.currentUser.id,assigned_role:p.currentUser.role==='worker'?'worker':'supervisor',due_at:now(),priority:'normal',evidence_required:false}))},'تم إنشاء المهمة');const complete=()=>p.run(()=>{const t=p.state.tasks.find(x=>x.status!=='completed');if(!t)throw new Error('لا توجد مهمة مفتوحة.');p.onChange(completeFarmTaskV2029(p.state,t.id,p.currentUser.name))},'تم إكمال المهمة');const resolve=()=>p.run(()=>{const a=p.state.alerts.find(x=>x.status!=='resolved');if(!a)throw new Error('لا يوجد تنبيه مفتوح.');p.onChange(resolveFarmAlertV2029(p.state,a.id,p.currentUser.name))},'تم حل التنبيه');return <ActionPanel title="Offline / Media / Alerts / Tasks"><div className="farm-action-row"><button className="farm-secondary-btn" onClick={queue}><CloudOff className="w-4 h-4"/>Queue</button><button className="farm-secondary-btn" onClick={sync}><UploadCloud className="w-4 h-4"/>Sync</button><button className="farm-secondary-btn" onClick={conflict}>Conflict</button><button className="farm-secondary-btn" onClick={media}>Media</button><button className="farm-secondary-btn" onClick={alert}><Bell className="w-4 h-4"/>Alert</button><button className="farm-secondary-btn" onClick={resolve}>Resolve</button><button className="farm-secondary-btn" onClick={task}><ListTodo className="w-4 h-4"/>Task</button><button className="farm-primary-btn" onClick={complete}>Complete</button></div></ActionPanel>};

const GovernanceActions:React.FC<CanvasProps>=p=>{const create=()=>p.run(()=>p.onChange(createFarmReferenceVersionV2029(p.state,{reference_type:'daily_template',code:`R5-${Date.now()}`,name:'Windows Farm Template',effective_from:today(),payload:{screen:p.selected.code,source:'R5'}})),'تم إنشاء إصدار مرجعي Draft');const activate=()=>p.run(()=>{const r=p.state.reference_versions.find(x=>x.status==='draft');if(!r)throw new Error('لا يوجد إصدار Draft.');p.onChange(activateFarmReferenceVersionV2029(p.state,r.id,p.currentUser.name))},'تم تفعيل الإصدار المرجعي');return <ActionPanel title="التقارير والحوكمة والبيانات المرجعية"><div className="farm-action-row"><button className="farm-secondary-btn" onClick={create}><Settings2 className="w-4 h-4"/>إنشاء إصدار</button><button className="farm-primary-btn" onClick={activate}><CheckCircle2 className="w-4 h-4"/>تفعيل الإصدار</button><span className="farm-inline-note">التقرير النهائي يُنفذ عبر Section 14 والحوكمة عبر Section 15.</span></div></ActionPanel>};

const ActionPanel:React.FC<{title:string;children:React.ReactNode}>=({title,children})=><div className="farm-action-panel"><div className="farm-action-title"><ClipboardCheck className="w-4 h-4"/>{title}</div>{children}</div>;
const ActionHint:React.FC<{text:string}>=({text})=><div className="farm-action-hint"><Database className="w-4 h-4"/>{text}</div>;
const Field:React.FC<{label:string;children:React.ReactNode}>=({label,children})=><label className="farm-field"><span>{label}</span>{children}</label>;

const ContextIntegrity:React.FC<{selected:FarmScreenDefinitionV2029;farmId:string;houseId:string;cycleId:string}>=({selected,farmId,houseId,cycleId})=><div className="farm-integrity"><div><CheckCircle2 className="w-4 h-4"/><span>Destination</span><b>{selected.route}</b></div><div className={!farmId?'farm-integrity-warn':''}>{farmId?<CheckCircle2 className="w-4 h-4"/>:<AlertTriangle className="w-4 h-4"/>}<span>Farm</span><b>{farmId||'غير محدد'}</b></div><div><CheckCircle2 className="w-4 h-4"/><span>Inventory owner</span><b>Section 7</b></div><div><CheckCircle2 className="w-4 h-4"/><span>Accounting owner</span><b>Section 12</b></div></div>;

const AuditHistory:React.FC<{state:FarmDivisionStateV2029;selected:FarmScreenDefinitionV2029;farmId:string}>=({state,selected,farmId})=><Panel title={`السجل والتدقيق · ${selected.code}`}><GenericObjectTable rows={state.audit.filter(x=>!farmId||x.entity_id.includes(farmId)||true).slice(0,25)}/></Panel>;

function screenRows(screen:FarmScreenDefinitionV2029,state:FarmDivisionStateV2029,managed:ManagedOperationsStateV197,farmId:string,houseId:string,cycleId:string):any[]{
  const f=<T extends Record<string,any>>(rows:T[])=>rows.filter((x:any)=>(!farmId||!x.farm_id||x.farm_id===farmId)&&(!houseId||!x.house_id||x.house_id===houseId)&&(!cycleId||!x.cycle_id||!x.flock_id||x.cycle_id===cycleId||x.flock_id===cycleId));
  const c=screen.code;
  if(c==='CORE-01'||c==='CORE-02'||c==='CORE-03'||c==='CORE-06'||c==='CORE-07'||c==='CORE-08'||c==='CORE-09'||c==='CORE-10'||c==='CORE-11'||c==='CORE-14')return managed.farms.filter(x=>!farmId||x.id===farmId);
  if(c==='CORE-04'||c==='CORE-05')return f(state.owner_relationships);
  if(c==='CORE-12')return managed.timeline.filter(x=>!farmId||x.farm_id===farmId);
  if(c==='CORE-13')return f(state.media);
  if(c.startsWith('HIER-')){
    if(['HIER-01','HIER-02','HIER-03','HIER-04','HIER-05'].includes(c))return managed.houses.filter(x=>(!farmId||x.farm_id===farmId)&&(!houseId||x.id===houseId));
    if(['HIER-08','HIER-09','HIER-10'].includes(c))return managed.placements.filter((x:any)=>!cycleId||x.flock_id===cycleId);
    return managed.flock_cycles.filter(x=>(!farmId||x.farm_id===farmId)&&(!cycleId||x.id===cycleId));
  }
  if(c.startsWith('DAY-')){
    if(['DAY-05','DAY-06','DAY-09','DAY-10','DAY-11','DAY-18'].includes(c))return f(state.population_events);
    if(['DAY-07','DAY-08'].includes(c))return f(state.mortality_cull_details);
    if(['DAY-16'].includes(c))return f(state.tasks);
    return managed.daily_reports.filter((x:any)=>(!farmId||x.farm_id===farmId)&&(!cycleId||x.flock_id===cycleId));
  }
  if(c.startsWith('NUTR-')){
    if(['NUTR-01','NUTR-02','NUTR-03','NUTR-04','NUTR-15'].includes(c))return f(state.feed_records);
    if(['NUTR-05','NUTR-06','NUTR-07'].includes(c))return f(state.water_records);
    if(['NUTR-12'].includes(c))return f(state.water_quality_tests);
    if(['NUTR-13','NUTR-14'].includes(c))return f(state.feed_quality_tests);
    return f(state.environment_readings);
  }
  if(c.startsWith('BIO-'))return f(state.biosecurity_inspections);
  if(c.startsWith('VET-')){
    if(['VET-10'].includes(c))return f(state.medication_administrations);
    if(['VET-11','VET-12'].includes(c))return f(state.vaccination_administrations);
    return f(state.clinical_cases);
  }
  if(c.startsWith('LAB-')){
    if(['LAB-01','LAB-02'].includes(c))return state.lab_facilities;
    if(['LAB-09','LAB-10','LAB-11','LAB-12','LAB-13'].includes(c))return state.lab_results;
    return f(state.lab_samples);
  }
  if(c.startsWith('TEAM-'))return f(c==='TEAM-07'||c==='TEAM-08'?state.doctor_assignments:state.staff_assignments);
  if(c.startsWith('SUP-')){
    if(['SUP-01','SUP-02','SUP-03','SUP-04'].includes(c))return managed.requirements.filter((x:any)=>!farmId||x.farm_id===farmId);
    if(['SUP-05'].includes(c))return managed.purchase_orders.filter((x:any)=>!farmId||x.farm_id===farmId);
    if(['SUP-06'].includes(c))return managed.goods_receipts.filter((x:any)=>!farmId||x.farm_id===farmId);
    return f(state.inventory_integration_events);
  }
  if(c.startsWith('ECO-')){
    if(['ECO-01','ECO-02'].includes(c))return f(state.expense_claims);
    if(['ECO-03'].includes(c))return f(state.accounting_integration_events);
    if(['ECO-09','ECO-10'].includes(c))return state.market_prices;
    if(['ECO-13','ECO-14','ECO-15'].includes(c))return f(state.benchmarks);
    return managed.cost_entries.filter((x:any)=>(!farmId||x.farm_id===farmId)&&(!cycleId||x.flock_id===cycleId));
  }
  if(c.startsWith('FLD-')){
    if(['FLD-01','FLD-02','FLD-03','FLD-04','FLD-05','FLD-13'].includes(c))return state.offline_queue;
    if(['FLD-06','FLD-07','FLD-08','FLD-09'].includes(c))return f(state.media);
    if(['FLD-10'].includes(c))return f(state.alerts);
    return f(state.tasks);
  }
  if(['GOV-11','GOV-12','GOV-13','GOV-14','GOV-15','GOV-16'].includes(c))return state.reference_versions;
  return state.audit;
}

function screenMetrics(screen:FarmScreenDefinitionV2029,state:FarmDivisionStateV2029,managed:ManagedOperationsStateV197,farmId:string,cycleId:string):Array<[string,React.ReactNode]>{
  const rows=screenRows(screen,state,managed,farmId,'',cycleId); const base:Array<[string,React.ReactNode]>=[['Records',rows.length],['Screen',screen.code],['Kind',screen.kind]];
  if(screen.section===3)return [...base,['Population events',state.population_events.length],['Mortality/Cull',state.mortality_cull_details.length]];
  if(screen.section===4)return [...base,['Feed',state.feed_records.length],['Water',state.water_records.length],['Environment',state.environment_readings.length]];
  if(screen.section===6)return [...base,['Open cases',state.clinical_cases.filter(x=>x.status!=='closed').length],['Withdrawal',state.clinical_cases.filter(x=>x.withdrawal_restriction_active).length]];
  if(screen.section===7)return [...base,['Samples',state.lab_samples.length],['Final results',state.lab_results.filter(x=>x.status==='final'||x.status==='amended').length]];
  if(screen.section===10)return [...base,['Claims',state.expense_claims.length],['Market prices',state.market_prices.length]];
  if(screen.section===11)return [...base,['Queued',state.offline_queue.filter(x=>x.status==='queued').length],['Conflicts',state.offline_queue.filter(x=>x.status==='conflict').length]];
  return base;
}

function screenSource(s:FarmScreenDefinitionV2029){if(s.section<=2)return'Managed Operations + Farm R4';if(s.section===9)return'Section 7 integration + Managed procurement';if(s.section===10)return'Farm R4 + Section 12 integration';if(s.section===12)return'Farm R4 + Sections 14/15';return'Farm R4 canonical domain';}
function capLabel(x:string){return({search:'بحث',filter:'تصفية',create:'إنشاء',edit:'تعديل',history:'تاريخ',export:'تصدير',view:'عرض',documents:'مستندات',submit:'إرسال',approve:'اعتماد',reject:'رفض',refresh:'تحديث',drilldown:'تفاصيل',print:'طباعة',audit:'تدقيق',record:'تسجيل',review:'مراجعة',corrective_action:'إجراء تصحيحي',update:'تحديث',escalate:'تصعيد',close:'إغلاق',send_to_s12:'إرسال S12',generate:'إنشاء تقرير',create_version:'إصدار جديد',activate:'تفعيل',queue:'Queue',sync:'Sync',resolve_conflict:'حل تعارض'} as Record<string,string>)[x]||x;}
function displayValue(v:any):React.ReactNode{if(v===null||v===undefined||v==='')return'—';if(typeof v==='boolean')return v?'نعم':'لا';if(Array.isArray(v))return v.length?`${v.length} عناصر`:'—';if(typeof v==='object')return JSON.stringify(v).slice(0,80);return String(v);}
const FIELD_LABELS:Record<string,string>={id:'ID',farm_id:'المزرعة',house_id:'الحظيرة',cycle_id:'الدورة',flock_id:'الدورة',name:'الاسم',farm_code:'كود المزرعة',code:'الكود',status:'الحالة',date:'التاريخ',event_date:'التاريخ',created_at:'الإنشاء',opened_at:'الفتح',user_name:'الموظف',role:'الدور',display_name:'المالك',ownership_percent:'الملكية %',event_type:'نوع الحدث',quantity_delta:'التغير',count:'العدد',feed_name:'العلف',consumed_kg:'المستهلك كجم',consumed_liters:'المياه لتر',temperature_c:'الحرارة',humidity_pct:'الرطوبة',score:'النتيجة',case_number:'رقم الحالة',complaint:'الشكوى',sample_number:'رقم العينة',result_text:'النتيجة',claim_number:'رقم المطالبة',amount:'المبلغ',currency:'العملة',price:'السعر',title:'العنوان',severity:'الخطورة',operation:'العملية',route:'المسار'};
const GenericObjectTable:React.FC<{rows:any[]}>=({rows})=>{if(!rows.length)return <div className="farm-empty"><Database className="w-6 h-6"/><b>لا توجد بيانات لهذه الشاشة في السياق الحالي.</b><span>استخدم إجراءات الشاشة أعلاه لإنشاء البيانات أو غيّر المزرعة/الحظيرة/الدورة.</span></div>;const cols=Array.from(new Set<string>(rows.flatMap(r=>Object.keys(r||{})) as string[])).filter(k=>!['payload','findings','evidence_refs','photo_refs','documents','chain_of_custody','route_attempts'].includes(k)).slice(0,7);return <div className="farm-table-wrap"><table className="farm-table"><thead><tr>{cols.map(c=><th key={c}>{FIELD_LABELS[c]||c}</th>)}</tr></thead><tbody>{rows.slice(0,30).map((r,i)=><tr key={r.id||i}>{cols.map(c=><td key={c}>{displayValue(r[c])}</td>)}</tr>)}</tbody></table>{rows.length>30&&<div className="farm-table-more">عرض أول 30 من {rows.length} سجل</div>}</div>};

const Metric:React.FC<{label:string;value:React.ReactNode;warn?:boolean}>=({label,value,warn})=><div className={`farm-kpi ${warn?'farm-kpi-warn':''}`}><span>{label}</span><strong>{value}</strong></div>;
const Mini:React.FC<{label:string;value:React.ReactNode}>=({label,value})=><div className="farm-mini"><span>{label}</span><strong>{value}</strong></div>;
const Panel:React.FC<{title:string;children:React.ReactNode}>=({title,children})=><div className="farm-panel"><div className="farm-panel-title">{title}</div>{children}</div>;
const Select:React.FC<{value:string;onChange:(v:string)=>void;options:string[][]}>=({value,onChange,options})=><select className="farm-select" value={value} onChange={e=>onChange(e.target.value)}>{options.map(([v,l])=><option key={`${v}-${l}`} value={v}>{l}</option>)}</select>;
const Rows:React.FC<{rows:Array<[React.ReactNode,React.ReactNode]>}>=({rows})=><div>{rows.map((r,i)=><div key={i} className="farm-row"><span>{r[0]}</span><b>{r[1]}</b></div>)}</div>;
