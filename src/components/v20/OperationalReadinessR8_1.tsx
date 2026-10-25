import React, { useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, Bot, Building2, Calculator, CheckCircle2, ChevronLeft, ClipboardCheck,
  CloudSun, Factory, FileCheck2, Gauge, Globe2, MapPin, Search, Settings2, ShieldCheck, Stethoscope,
  ThermometerSun, UsersRound, Wind, Wrench, XCircle
} from 'lucide-react';
import type { AppUISettingsV194 } from '../settings/AppSettingsDrawer';
import { apiService } from '../../services/apiService';
import {
  analyzeOperationalContextR81, archiveRegionR81, buildOperationalReadinessR81, calculateR81,
  validateOperationalReadinessR81, type OperationalReadinessStateR81, type R81GeoNode, type R81ScreenAcceptance
} from '../../modules/v20/OperationalReadinessR8_1';

export type R81WorkspaceSection = 'overview'|'my_work'|'regions'|'sites'|'equipment'|'intelligence'|'disease'|'actions'|'acceptance'|'settings';

interface Props {
  state:OperationalReadinessStateR81;
  currentUser:{id:string;name:string;role:string};
  language:AppUISettingsV194['language'];
  onLanguageChange:(language:AppUISettingsV194['language'])=>void;
  onChange:(next:OperationalReadinessStateR81)=>void;
  onNavigateLegacy:(section:string)=>void;
}

const groups:[string,R81WorkspaceSection[]][] = [
  ['العمل | Work',['overview','my_work']],
  ['الميدان | Field',['regions','sites','equipment']],
  ['الذكاء العلمي | Scientific AI',['intelligence','disease']],
  ['الإغلاق والاختبار | Closure',['actions','acceptance']],
  ['الإدارة | Administration',['settings']]
];
const sectionMeta:Record<R81WorkspaceSection,{ar:string;en:string;icon:React.ReactNode}> = {
  overview:{ar:'مركز التشغيل',en:'Operational Center',icon:<Gauge className="w-4 h-4"/>},
  my_work:{ar:'مساحة عملي',en:'My Work',icon:<ClipboardCheck className="w-4 h-4"/>},
  regions:{ar:'المحافظات والمناطق',en:'Regions & Governorates',icon:<Globe2 className="w-4 h-4"/>},
  sites:{ar:'المواقع والعنابر',en:'Sites & Houses',icon:<Building2 className="w-4 h-4"/>},
  equipment:{ar:'التجهيزات والمرافق',en:'Equipment & Utilities',icon:<Wrench className="w-4 h-4"/>},
  intelligence:{ar:'ذكاء أفي نيكسس',en:'AviNexus Intelligence',icon:<Bot className="w-4 h-4"/>},
  disease:{ar:'تنبيهات الأمراض',en:'Disease Alerts',icon:<Stethoscope className="w-4 h-4"/>},
  actions:{ar:'تدقيق الأزرار والإجراءات',en:'Action Closure Audit',icon:<FileCheck2 className="w-4 h-4"/>},
  acceptance:{ar:'مصفوفة القبول',en:'Acceptance Matrix',icon:<CheckCircle2 className="w-4 h-4"/>},
  settings:{ar:'الإعدادات',en:'Settings',icon:<Settings2 className="w-4 h-4"/>}
};

const L=(lang:Props['language'],ar:string,en:string)=>lang==='ar'?ar:lang==='en'?en:`${ar} | ${en}`;
const isAdmin=(role:string)=>['system_owner','ceo','sector_manager'].includes(role);

export const OperationalReadinessR81:React.FC<Props> = ({state:input,currentUser,language,onLanguageChange,onChange,onNavigateLegacy}) => {
  const state=useMemo(()=>buildOperationalReadinessR81(input),[input]);
  const [section,setSection]=useState<R81WorkspaceSection>('overview');
  const [query,setQuery]=useState('');
  const issues=useMemo(()=>validateOperationalReadinessR81(state),[state]);
  const activeGovernorates=state.geography.filter(x=>x.type==='governorate'&&x.status==='active');
  const activeAlerts=state.disease_alerts.filter(x=>!['closed','post_event_review'].includes(x.status));
  const failedAcceptance=state.acceptance.filter(x=>Object.values(x).includes('fail')).length;
  const searchResults=useMemo(()=>{
    const q=query.trim().toLowerCase(); if(!q)return [];
    const items:{id:string;title:string;kind:string;action:()=>void}[]=[];
    for(const n of state.navigation){const hay=[n.label_ar,n.label_en,...n.search_terms].join(' ').toLowerCase();if(hay.includes(q)&&roleAllowed(n.roles,currentUser.role))items.push({id:n.id,title:L(language,n.label_ar,n.label_en),kind:'Navigation',action:()=>n.legacy_section?onNavigateLegacy(n.legacy_section):setSection(n.group==='regional'?'regions':n.group==='administration'?'settings':'overview')});}
    for(const g of state.geography.filter(x=>x.status==='active')){if(`${g.name_ar} ${g.name_en} ${g.code}`.toLowerCase().includes(q))items.push({id:g.id,title:L(language,g.name_ar,g.name_en),kind:'Region',action:()=>setSection('regions')});}
    for(const s of state.sites){if(`${s.name_ar} ${s.name_en} ${s.code} ${s.full_address}`.toLowerCase().includes(q))items.push({id:s.id,title:L(language,s.name_ar,s.name_en),kind:'Site',action:()=>setSection('sites')});}
    for(const a of activeAlerts){if(`${a.alert_number} ${a.ai_summary} ${a.triggers.join(' ')}`.toLowerCase().includes(q))items.push({id:a.id,title:`${a.alert_number} — ${a.ai_summary}`,kind:'Disease Alert',action:()=>setSection('disease')});}
    return items.slice(0,12);
  },[query,state,language,currentUser.role,onNavigateLegacy,activeAlerts]);

  return <div className="r81-shell" dir={language==='en'?'ltr':'rtl'}>
    <div className="r81-commandbar">
      <div className="min-w-0">
        <div className="text-[11px] font-black text-emerald-300">AviNexus Poultry Enterprise</div>
        <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">{L(language,'جاهزية التشغيل والذكاء العلمي','Operational Readiness & Scientific AI')}</h2>
        <p className="text-[11px] text-slate-400 mt-1">{L(language,'منصة تشغيل موحدة: الأدوار، المواقع، المناخ، الذكاء العلمي وسير العمل','Unified operations: roles, sites, climate, scientific intelligence and workflows')}</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <StatusPill ok={issues.length===0} label={issues.length===0?L(language,'سلامة النموذج','Model valid'):`${issues.length} ${L(language,'ملاحظة','issues')}`}/>
        <StatusPill ok={false} neutral label={L(language,'Android مؤجل','Android deferred')}/>
      </div>
    </div>

    <div className="relative mb-4">
      <Search className="absolute top-3.5 start-4 w-4 h-4 text-slate-500"/>
      <input value={query} onChange={e=>setQuery(e.target.value)} className="r81-search" placeholder={L(language,'ابحث عن مزرعة، عنبر، محافظة، تنبيه، شاشة، عقد، مستند...','Search farm, house, region, alert, screen, contract, document...')}/>
      {query&&<button onClick={()=>setQuery('')} className="absolute top-3 end-4 text-slate-500"><XCircle className="w-4 h-4"/></button>}
      {query&&<div className="r81-search-results">{searchResults.length?searchResults.map(r=><button key={`${r.kind}-${r.id}`} onClick={()=>{r.action();setQuery('')}} className="r81-search-result"><span><b>{r.title}</b><small>{r.kind}</small></span><ChevronLeft className="w-4 h-4"/></button>):<div className="p-4 text-xs text-slate-500">{L(language,'لا توجد نتيجة ضمن صلاحياتك.','No result in your authorized scope.')}</div>}</div>}
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-[245px_minmax(0,1fr)] gap-4 items-start">
      <aside className="r81-sidebar">
        <div className="px-3 pb-3 border-b border-slate-800 mb-3"><div className="text-xs font-black text-white">{currentUser.name}</div><div className="text-[10px] text-slate-500 mt-1">{currentUser.role}</div></div>
        {groups.map(([title,ids])=><div key={title} className="mb-3"><div className="px-3 mb-1 text-[9px] uppercase tracking-wide text-slate-600 font-black">{title}</div>{ids.filter(id=>id!=='settings'||isAdmin(currentUser.role)).map(id=>{const m=sectionMeta[id];return <button key={id} onClick={()=>setSection(id)} className={`r81-nav ${section===id?'is-active':''}`}>{m.icon}<span>{L(language,m.ar,m.en)}</span>{id==='disease'&&activeAlerts.length>0&&<b>{activeAlerts.length}</b>}</button>})}</div>)}
      </aside>

      <main className="min-w-0">
        {section==='overview'&&<Overview state={state} language={language} alerts={activeAlerts.length} acceptanceFail={failedAcceptance} onOpen={setSection} onNavigateLegacy={onNavigateLegacy}/>} 
        {section==='my_work'&&<MyWork state={state} language={language} role={currentUser.role} onNavigateLegacy={onNavigateLegacy}/>} 
        {section==='regions'&&<Regions state={state} language={language} admin={isAdmin(currentUser.role)} onChange={onChange}/>} 
        {section==='sites'&&<Sites state={state} language={language} admin={isAdmin(currentUser.role)} onChange={onChange}/>} 
        {section==='equipment'&&<Equipment state={state} language={language} admin={isAdmin(currentUser.role)} onChange={onChange}/>} 
        {section==='intelligence'&&<Intelligence state={state} language={language} onChange={onChange}/>} 
        {section==='disease'&&<Disease state={state} language={language} role={currentUser.role} onChange={onChange}/>} 
        {section==='actions'&&<Actions state={state} language={language}/>} 
        {section==='acceptance'&&<Acceptance state={state} language={language} onChange={onChange}/>} 
        {section==='settings'&&<Settings state={state} language={language} onLanguageChange={onLanguageChange} onChange={onChange}/>} 
      </main>
    </div>
  </div>;
};

const Overview:React.FC<{state:OperationalReadinessStateR81;language:Props['language'];alerts:number;acceptanceFail:number;onOpen:(s:R81WorkspaceSection)=>void;onNavigateLegacy:(s:string)=>void}> = ({state,language,alerts,acceptanceFail,onOpen,onNavigateLegacy}) => {
  const activeSites=state.sites.filter(x=>x.status==='active').length;
  const activeFlocks=state.flock_contexts.filter(x=>x.status==='active').length;
  const activeRules=state.scientific_rules.filter(x=>x.status==='active').length;
  return <Panel title={L(language,'مركز التشغيل الموحد','Unified Operational Center')} subtitle={L(language,'نقطة دخول واحدة للعمل اليومي؛ التفاصيل تبقى في مصادرها الأصلية.','One entry point for daily work; source-of-truth ownership remains unchanged.')}>
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3"><Metric label={L(language,'المواقع النشطة','Active sites')} value={activeSites}/><Metric label={L(language,'القطعان النشطة','Active flocks')} value={activeFlocks}/><Metric label={L(language,'تنبيهات الأمراض','Disease alerts')} value={alerts} warn={alerts>0}/><Metric label={L(language,'قواعد علمية مفعلة','Active scientific rules')} value={activeRules}/><Metric label={L(language,'فشل قبول ظاهر','Acceptance failures')} value={acceptanceFail} warn={acceptanceFail>0}/></div>
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 mt-4">
      <Launch icon={<Building2/>} title={L(language,'المزارع والقطعان','Farms & Flocks')} note={L(language,'اليومي، الماء، العلف، البيئة، الأمان الحيوي','Daily, water, feed, environment, biosecurity')} onClick={()=>onNavigateLegacy('farm_operations')}/>
      <Launch icon={<Stethoscope/>} title={L(language,'الطب البيطري','Veterinary')} note={L(language,'الحالات، المختبر، التحصين، التنبيهات','Cases, lab, vaccination, alerts')} onClick={()=>onNavigateLegacy('clinical_ops')}/>
      <Launch icon={<Factory/>} title={L(language,'المصنع والإنتاج','Factory & Production')} note={L(language,'المواد، التشغيل، الإنتاج، المخزون والتكلفة','Materials, work orders, production, inventory, costing')} onClick={()=>onNavigateLegacy('factory_v2024')}/>
      <Launch icon={<UsersRound/>} title={L(language,'المكاتب والعملاء والشركاء','Offices, Customers & Partners')} note={L(language,'Office 360 والعقود والشبكة','Office 360, contracts and network')} onClick={()=>onNavigateLegacy('network_r7')}/>
      <Launch icon={<Globe2/>} title={L(language,'المحافظات والمناخ','Regions & Climate')} note={L(language,'الطقس، الرياح، السياسات الإقليمية','Weather, wind and regional profiles')} onClick={()=>onOpen('regions')}/>
      <Launch icon={<Bot/>} title={L(language,'الذكاء العلمي','Scientific Intelligence')} note={L(language,'اسأل، حلّل، احسب، تحقق، مخاطر وإجراءات','Ask, analyze, calculate, check, risk and actions')} onClick={()=>onOpen('intelligence')}/>
    </div>
    <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs leading-6 text-slate-300">{L(language,'قاعدة الملكية محفوظة: S7 للمخزون، S12 للمحاسبة، S11 للرواتب، S14 للتقارير، S15 للحوكمة. الذكاء الاصطناعي لا ينشئ سلطة موازية.','Ownership is preserved: S7 inventory, S12 accounting, S11 payroll, S14 reports, S15 governance. AI never creates a parallel authority.')}</div>
  </Panel>;
};

const MyWork:React.FC<{state:OperationalReadinessStateR81;language:Props['language'];role:string;onNavigateLegacy:(s:string)=>void}> = ({state,language,role,onNavigateLegacy}) => {
  const destinations=state.navigation.filter(x=>roleAllowed(x.roles,role));
  return <Panel title={L(language,'مساحة عملي حسب الدور','Role-based My Work')} subtitle={L(language,'تعرض المسؤوليات المصرح بها فقط.','Only authorized responsibilities are surfaced.')}><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">{destinations.map(d=><Launch key={d.id} icon={<Activity/>} title={L(language,d.label_ar,d.label_en)} note={d.search_terms.slice(0,4).join(' • ')} onClick={()=>d.legacy_section&&onNavigateLegacy(d.legacy_section)}/>)}</div></Panel>;
};

const Regions:React.FC<{state:OperationalReadinessStateR81;language:Props['language'];admin:boolean;onChange:(s:OperationalReadinessStateR81)=>void}> = ({state,language,admin,onChange}) => {
  const [filter,setFilter]=useState(''); const [nameAr,setNameAr]=useState(''); const [nameEn,setNameEn]=useState('');
  const govs=state.geography.filter(x=>x.type==='governorate'&&x.status!=='merged').filter(x=>`${x.name_ar} ${x.name_en} ${x.code}`.toLowerCase().includes(filter.toLowerCase()));
  const add=()=>{if(!admin||!nameAr.trim()||!nameEn.trim())return;const id=`gov-${Date.now()}`;const node:R81GeoNode={id,type:'governorate',parent_id:'country-ye',code:`YE-X${state.geography.length}`,name_ar:nameAr.trim(),name_en:nameEn.trim(),status:'active',purposes:['farm','rented_poultry_house','office','factory','branch','market','laboratory','supplier'],effective_from:new Date().toISOString().slice(0,10),history:[`${new Date().toISOString()}: added by authorized governance`]};onChange({...state,geography:[...state.geography,node]});setNameAr('');setNameEn('');};
  return <Panel title={L(language,'مركز المحافظات والمناطق','Governorate & Region Control Center')} subtitle={L(language,'مرجع قابل للإدارة وليس قائمة ثابتة داخل الشاشات.','Configurable master, not a hard-coded list embedded in screens.')}>
    <div className="flex gap-2 flex-wrap mb-4"><input className="r81-field flex-1 min-w-48" value={filter} onChange={e=>setFilter(e.target.value)} placeholder={L(language,'بحث في المحافظات','Search governorates')}/>{admin&&<><input className="r81-field" value={nameAr} onChange={e=>setNameAr(e.target.value)} placeholder="الاسم العربي"/><input className="r81-field" value={nameEn} onChange={e=>setNameEn(e.target.value)} placeholder="English name"/><button className="r81-primary" onClick={add}>{L(language,'إضافة محافظة','Add governorate')}</button></>}</div>
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">{govs.map(g=>{const sites=state.sites.filter(s=>s.governorate_id===g.id&&s.status==='active').length;const protocols=state.regional_protocols.filter(p=>p.region_id===g.id&&['approved','active'].includes(p.status)).length;return <div key={g.id} className="r81-card"><div className="flex items-start justify-between gap-2"><div><b className="text-sm text-white">{L(language,g.name_ar,g.name_en)}</b><div className="text-[10px] text-slate-500 mt-1">{g.code} · {g.status}</div></div><MapPin className="w-4 h-4 text-emerald-300"/></div><div className="grid grid-cols-2 gap-2 mt-3"><Mini label={L(language,'مواقع','Sites')} value={sites}/><Mini label={L(language,'بروتوكولات','Protocols')} value={protocols}/></div><div className="text-[10px] text-slate-500 mt-3 line-clamp-2">{g.purposes.join(' • ')}</div>{admin&&g.status==='active'&&<button className="mt-3 text-[10px] font-black text-amber-300" onClick={()=>onChange(archiveRegionR81(state,g.id,'Archived during R8.1 governance review'))}>{L(language,'أرشفة مع حفظ التاريخ','Archive preserving history')}</button>}</div>})}</div>
  </Panel>;
};

const Sites:React.FC<{state:OperationalReadinessStateR81;language:Props['language'];admin:boolean;onChange:(s:OperationalReadinessStateR81)=>void}> = ({state,language,admin,onChange}) => {
  const activeGovs=state.geography.filter(g=>g.type==='governorate'&&g.status==='active');
  const [siteForm,setSiteForm]=useState({name_ar:'',name_en:'',purpose:'farm',governorate_id:activeGovs[0]?.id||'',full_address:'',latitude:'',longitude:'',elevation_m:''});
  const [houseForm,setHouseForm]=useState({site_id:state.sites[0]?.id||'',code:'',name:'',house_type:'open_sided',length_m:'80',width_m:'12',height_m:'3.2',feed_storage_capacity_kg:'0',water_tank_capacity_l:'0',monitoring_mode:'manual'});
  const [weatherBusy,setWeatherBusy]=useState<string>('');
  const addSite=()=>{if(!admin||!siteForm.name_ar.trim()||!siteForm.name_en.trim()||!siteForm.governorate_id||!siteForm.full_address.trim())return;const id=`site-${Date.now()}`;const now=new Date().toISOString();onChange({...state,sites:[...state.sites,{id,code:`SITE-${Date.now().toString().slice(-6)}`,name_ar:siteForm.name_ar.trim(),name_en:siteForm.name_en.trim(),purpose:siteForm.purpose as any,governorate_id:siteForm.governorate_id,full_address:siteForm.full_address.trim(),latitude:siteForm.latitude?Number(siteForm.latitude):undefined,longitude:siteForm.longitude?Number(siteForm.longitude):undefined,elevation_m:siteForm.elevation_m?Number(siteForm.elevation_m):undefined,surrounding_poultry_density:'unknown',status:'active',created_at:now,updated_at:now}]});setSiteForm({...siteForm,name_ar:'',name_en:'',full_address:'',latitude:'',longitude:'',elevation_m:''});};
  const addHouse=()=>{if(!admin||!houseForm.site_id||!houseForm.code.trim()||!houseForm.name.trim())return;const length=Number(houseForm.length_m)||0,width=Number(houseForm.width_m)||0;onChange({...state,houses:[...state.houses,{id:`house-${Date.now()}`,site_id:houseForm.site_id,code:houseForm.code.trim(),name:houseForm.name.trim(),house_type:houseForm.house_type as any,length_m:length,width_m:width,height_m:Number(houseForm.height_m)||0,usable_floor_area_m2:Number((length*width).toFixed(2)),construction_type:'to_be_assessed',insulation:'to_be_assessed',curtain_sides:houseForm.house_type==='open_sided'||houseForm.house_type==='semi_open'?['north','south']:[],curtain_mechanism:houseForm.house_type==='closed'||houseForm.house_type==='controlled_environment'?'none':'manual',litter_system:'deep_litter',feed_storage_area_m2:0,feed_storage_capacity_kg:Number(houseForm.feed_storage_capacity_kg)||0,water_source:'to_be_registered',water_tank_capacity_l:Number(houseForm.water_tank_capacity_l)||0,filtration:false,water_treatment:false,emergency_water:false,emergency_power:false,monitoring_mode:houseForm.monitoring_mode as any,status:'active'}]});setHouseForm({...houseForm,code:'',name:''});};
  const refreshWeather=async(site:any)=>{if(site.latitude==null||site.longitude==null)return;setWeatherBusy(site.id);try{const wx=await apiService.getWeatherR81({site_id:site.id,latitude:site.latitude,longitude:site.longitude});const snapshot={...wx,id:wx.id||`wx-${Date.now()}`,site_id:site.id,provider:wx.provider||'open_meteo',captured_at:wx.captured_at||new Date().toISOString(),source_quality:wx.source_quality||'provider',stale:Boolean(wx.stale)};onChange({...state,weather:[snapshot,...state.weather.filter(w=>w.id!==snapshot.id)]});}finally{setWeatherBusy('')}};
  return <div className="space-y-4">
    {admin&&<Panel title={L(language,'تسجيل موقع/عنبر','Register Site / Poultry House')} subtitle={L(language,'الموقع الكامل والإحداثيات وبنية العنبر تصبح سياقاً تشغيلياً للطقس والذكاء العلمي.','Address, coordinates and house structure become operational context for weather and scientific AI.')}>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-2">
        <input className="r81-field" placeholder="اسم الموقع بالعربية" value={siteForm.name_ar} onChange={e=>setSiteForm({...siteForm,name_ar:e.target.value})}/><input className="r81-field" placeholder="Site name English" value={siteForm.name_en} onChange={e=>setSiteForm({...siteForm,name_en:e.target.value})}/>
        <select className="r81-field" value={siteForm.purpose} onChange={e=>setSiteForm({...siteForm,purpose:e.target.value})}><option value="farm">Farm</option><option value="rented_poultry_house">Rented poultry house</option></select>
        <select className="r81-field" value={siteForm.governorate_id} onChange={e=>setSiteForm({...siteForm,governorate_id:e.target.value})}>{activeGovs.map(g=><option key={g.id} value={g.id}>{L(language,g.name_ar,g.name_en)}</option>)}</select>
        <input className="r81-field md:col-span-2" placeholder={L(language,'العنوان الكامل','Full address')} value={siteForm.full_address} onChange={e=>setSiteForm({...siteForm,full_address:e.target.value})}/><input className="r81-field" type="number" step="any" placeholder="Latitude" value={siteForm.latitude} onChange={e=>setSiteForm({...siteForm,latitude:e.target.value})}/><input className="r81-field" type="number" step="any" placeholder="Longitude" value={siteForm.longitude} onChange={e=>setSiteForm({...siteForm,longitude:e.target.value})}/><input className="r81-field" type="number" placeholder={L(language,'الارتفاع م','Elevation m')} value={siteForm.elevation_m} onChange={e=>setSiteForm({...siteForm,elevation_m:e.target.value})}/><button className="r81-primary" onClick={addSite}>{L(language,'إضافة الموقع','Add site')}</button>
      </div>
      <div className="border-t border-slate-800 mt-4 pt-4 grid md:grid-cols-2 xl:grid-cols-5 gap-2">
        <select className="r81-field" value={houseForm.site_id} onChange={e=>setHouseForm({...houseForm,site_id:e.target.value})}>{state.sites.map(x=><option key={x.id} value={x.id}>{L(language,x.name_ar,x.name_en)}</option>)}</select><input className="r81-field" placeholder="House code" value={houseForm.code} onChange={e=>setHouseForm({...houseForm,code:e.target.value})}/><input className="r81-field" placeholder={L(language,'اسم العنبر','House name')} value={houseForm.name} onChange={e=>setHouseForm({...houseForm,name:e.target.value})}/>
        <select className="r81-field" value={houseForm.house_type} onChange={e=>setHouseForm({...houseForm,house_type:e.target.value})}>{['open_sided','semi_open','closed','controlled_environment'].map(x=><option key={x}>{x}</option>)}</select><select className="r81-field" value={houseForm.monitoring_mode} onChange={e=>setHouseForm({...houseForm,monitoring_mode:e.target.value})}>{['manual','sensor','hybrid'].map(x=><option key={x}>{x}</option>)}</select>
        <input className="r81-field" type="number" placeholder="Length m" value={houseForm.length_m} onChange={e=>setHouseForm({...houseForm,length_m:e.target.value})}/><input className="r81-field" type="number" placeholder="Width m" value={houseForm.width_m} onChange={e=>setHouseForm({...houseForm,width_m:e.target.value})}/><input className="r81-field" type="number" placeholder="Height m" value={houseForm.height_m} onChange={e=>setHouseForm({...houseForm,height_m:e.target.value})}/><input className="r81-field" type="number" placeholder="Feed storage kg" value={houseForm.feed_storage_capacity_kg} onChange={e=>setHouseForm({...houseForm,feed_storage_capacity_kg:e.target.value})}/><input className="r81-field" type="number" placeholder="Water tank L" value={houseForm.water_tank_capacity_l} onChange={e=>setHouseForm({...houseForm,water_tank_capacity_l:e.target.value})}/><button className="r81-primary" onClick={addHouse}>{L(language,'إضافة العنبر','Add house')}</button>
      </div>
    </Panel>}
    <Panel title={L(language,'ملفات المواقع والعنابر','Site & Poultry House Profiles')} subtitle={L(language,'الموقع، الإحداثيات، نوع العنبر، البنية، المياه، العلف، الطاقة والمراقبة.','Location, coordinates, house type, infrastructure, water, feed, power and monitoring.')}><div className="space-y-4">{state.sites.map(site=>{const houses=state.houses.filter(h=>h.site_id===site.id);const gov=state.geography.find(g=>g.id===site.governorate_id);const wx=[...state.weather].filter(w=>w.site_id===site.id).sort((a,b)=>b.captured_at.localeCompare(a.captured_at))[0];return <div key={site.id} className="r81-card"><div className="flex flex-wrap justify-between gap-3"><div><b className="text-white">{L(language,site.name_ar,site.name_en)}</b><div className="text-[11px] text-slate-500 mt-1">{site.code} · {L(language,gov?.name_ar||'—',gov?.name_en||'—')} · {site.full_address}</div></div><div className="flex gap-2"><span className="r81-badge">{site.purpose}</span>{site.latitude!=null&&site.longitude!=null&&<button className="r81-secondary" disabled={weatherBusy===site.id} onClick={()=>refreshWeather(site)}><CloudSun className="w-3.5 h-3.5"/>{weatherBusy===site.id?'...':L(language,'تحديث الطقس','Refresh weather')}</button>}</div></div><div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mt-3"><Mini label={L(language,'الإحداثيات','Coordinates')} value={site.latitude!=null&&site.longitude!=null?`${site.latitude}, ${site.longitude}`:'—'}/><Mini label={L(language,'الارتفاع','Elevation')} value={site.elevation_m!=null?`${site.elevation_m} m`:'—'}/><Mini label={L(language,'العنابر','Houses')} value={houses.length}/><Mini label={L(language,'الطقس الخارجي','Outdoor')} value={wx?.outdoor_temperature_c!=null?`${wx.outdoor_temperature_c}°C`:'—'}/><Mini label={L(language,'الرياح','Wind')} value={wx?.wind_speed_kph!=null?`${wx.wind_speed_kph} km/h @ ${wx.wind_direction_deg??'—'}°`:'—'}/></div><div className="grid md:grid-cols-2 gap-3 mt-3">{houses.map(h=><div key={h.id} className="rounded-xl border border-slate-800 p-3 bg-slate-950/50"><div className="text-xs font-black text-slate-200">{h.name}</div><div className="text-[10px] text-slate-500 mt-1">{h.house_type} · {h.length_m}×{h.width_m}m · {h.usable_floor_area_m2}m² · {h.monitoring_mode}</div><div className="text-[10px] text-slate-400 mt-2">Curtains: {h.curtain_mechanism} · Feed store: {h.feed_storage_capacity_kg}kg · Water tank: {h.water_tank_capacity_l}L · Backup power: {h.emergency_power?'Yes':'No'}</div></div>)}</div></div>})}</div></Panel>
  </div>;
};

const Equipment:React.FC<{state:OperationalReadinessStateR81;language:Props['language'];admin:boolean;onChange:(s:OperationalReadinessStateR81)=>void}> = ({state,language,admin,onChange}) => {
  const categories=['feeder','drinker','water_tank','pump','filter','fan','cooling_pad','heater','brooder','curtain','sensor','thermometer','hygrometer','generator','solar','lighting','scale','disinfection','sprayer','footbath','washer','storage','feed_silo','medicine_refrigerator','vaccination','emergency'];
  const [form,setForm]=useState({site_id:state.sites[0]?.id||'',house_id:'',category:'drinker',subtype:'',quantity:'1',capacity_value:'',capacity_unit:'',spacing_m:''});
  const add=()=>{if(!admin||!form.site_id||!form.subtype.trim()||Number(form.quantity)<=0)return;onChange({...state,equipment:[...state.equipment,{id:`eq-${Date.now()}`,site_id:form.site_id,house_id:form.house_id||undefined,category:form.category as any,subtype:form.subtype.trim(),quantity:Number(form.quantity),capacity_value:form.capacity_value?Number(form.capacity_value):undefined,capacity_unit:form.capacity_unit||undefined,spacing_m:form.spacing_m?Number(form.spacing_m):undefined,operating_status:'operational',notes:'Registered through AviNexus Equipment Master'}]});setForm({...form,subtype:'',quantity:'1',capacity_value:'',capacity_unit:'',spacing_m:''});};
  const houses=state.houses.filter(h=>!form.site_id||h.site_id===form.site_id);
  return <Panel title={L(language,'التجهيزات والمرافق','Equipment & Utilities')} subtitle={L(language,'سجل قابل للتوسع للمشارب، المعالف، التدفئة، التهوية، القياس والطاقة.','Extensible asset register for drinking, feeding, heating, ventilation, measurement and power.')}>
    {admin&&<div className="grid md:grid-cols-2 xl:grid-cols-4 gap-2 mb-4"><select className="r81-field" value={form.site_id} onChange={e=>setForm({...form,site_id:e.target.value,house_id:''})}>{state.sites.map(x=><option key={x.id} value={x.id}>{L(language,x.name_ar,x.name_en)}</option>)}</select><select className="r81-field" value={form.house_id} onChange={e=>setForm({...form,house_id:e.target.value})}><option value="">Site-level</option>{houses.map(h=><option key={h.id} value={h.id}>{h.name}</option>)}</select><select className="r81-field" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.map(x=><option key={x}>{x}</option>)}</select><input className="r81-field" placeholder={L(language,'النوع/الموديل','Subtype/model')} value={form.subtype} onChange={e=>setForm({...form,subtype:e.target.value})}/><input className="r81-field" type="number" min="1" placeholder="Quantity" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})}/><input className="r81-field" type="number" placeholder="Capacity" value={form.capacity_value} onChange={e=>setForm({...form,capacity_value:e.target.value})}/><input className="r81-field" placeholder="Capacity unit" value={form.capacity_unit} onChange={e=>setForm({...form,capacity_unit:e.target.value})}/><input className="r81-field" type="number" step="any" placeholder="Spacing m" value={form.spacing_m} onChange={e=>setForm({...form,spacing_m:e.target.value})}/><button className="r81-primary" onClick={add}>{L(language,'إضافة التجهيز','Add equipment')}</button></div>}
    <div className="overflow-x-auto"><table className="r81-table"><thead><tr><th>{L(language,'الفئة','Category')}</th><th>{L(language,'النوع','Type')}</th><th>{L(language,'الكمية','Qty')}</th><th>{L(language,'السعة','Capacity')}</th><th>{L(language,'الحالة','Status')}</th><th>{L(language,'الصيانة','Maintenance')}</th></tr></thead><tbody>{state.equipment.map(e=><tr key={e.id}><td>{e.category}</td><td>{e.subtype}</td><td>{e.quantity}</td><td>{e.capacity_value??'—'} {e.capacity_unit||''}</td><td>{e.operating_status}</td><td>{e.next_maintenance_at||'—'}</td></tr>)}</tbody></table></div>
  </Panel>;
};

const Intelligence:React.FC<{state:OperationalReadinessStateR81;language:Props['language'];onChange:(s:OperationalReadinessStateR81)=>void}> = ({state,language,onChange}) => {
  const activeFlocks=state.flock_contexts.filter(x=>x.status==='active'); const [flockId,setFlockId]=useState(activeFlocks[0]?.flock_cycle_id||''); const flock=activeFlocks.find(x=>x.flock_cycle_id===flockId)||activeFlocks[0];
  const [question,setQuestion]=useState(''); const [answer,setAnswer]=useState(''); const [busy,setBusy]=useState(false); const [tool,setTool]=useState<'ask'|'analyze'|'calculate'|'check'|'risk'|'next'>('ask');
  const localInsight=()=>{if(!flock)return undefined;const x=analyzeOperationalContextR81(state,flock.flock_cycle_id);onChange({...state,ai_insights:[x,...state.ai_insights]});return x;};
  const ask=async()=>{if(!flock)return;setBusy(true);try{const prompt=question.trim()||({analyze:'Analyze the current flock operational context scientifically.',check:'Check the current flock and house data against approved operational rules and identify missing measurements.',risk:'Assess current operational risk using flock, weather, house, vaccination and biosecurity context.',next:'Recommend the next authorized operational actions and identify any veterinarian escalation.'} as any)[tool]||'Analyze the current flock.';const r=await apiService.analyzeOperationalR81({message:prompt,flock_cycle_id:flock.flock_cycle_id,site_id:flock.site_id,house_id:flock.house_id});setAnswer(r.reply+(r.suggested_actions?.length?`\n\n${L(language,'الإجراءات التالية','Next actions')}:\n- ${r.suggested_actions.join('\n- ')}`:''));}catch{const x=localInsight();if(x)setAnswer(`${L(language,x.title_ar,x.title_en)}\n${x.observations.join('\n')}\n${x.next_actions.join('\n')}`);}finally{setBusy(false)}};
  const calculate=()=>{if(!flock)return;const mortality=Math.max(0,flock.initial_population-flock.current_population);const rate=calculateR81('rule-mort-1',{mortality,opening_population:flock.initial_population});setAnswer(`${L(language,'نسبة الانخفاض السكاني التقريبية من عدد التسكين','Approximate population reduction from placement count')}: ${rate}%\n${L(language,'هذه ليست تشخيصاً؛ يجب فصل النفوق والاستبعاد والتحويلات من السجلات الأساسية.','This is not a diagnosis; canonical mortality, culling and transfer events must be separated.')}`);};
  const runTool=(next:typeof tool)=>{setTool(next);if(next==='calculate'){calculate();return;}if(next==='analyze'){localInsight();void ask();return;}if(next==='check'||next==='risk'||next==='next'){void ask();}};
  const latest=state.ai_insights[0];
  return <Panel title={L(language,'AviNexus Intelligence — ذكاء سياقي لا دردشة منفصلة','AviNexus Intelligence — contextual intelligence, not a detached chatbot')} subtitle={L(language,'يجمع الموقع والمناخ والعنبر والقطيع والبيانات الحية والقواعد المعتمدة قبل الإجابة.','Combines location, climate, house, flock, live data and approved rules before answering.')}>
    {activeFlocks.length>1&&<select className="r81-field mb-3" value={flock?.flock_cycle_id||''} onChange={e=>setFlockId(e.target.value)}>{activeFlocks.map(x=><option key={x.id} value={x.flock_cycle_id}>{x.flock_code} · {x.strain} · Day {x.age_days}</option>)}</select>}
    {flock&&<div className="grid grid-cols-2 lg:grid-cols-5 gap-2"><Mini label="Flock" value={flock.flock_code}/><Mini label={L(language,'العمر','Age')} value={`${flock.age_days} d`}/><Mini label={L(language,'العدد','Population')} value={flock.current_population}/><Mini label={L(language,'السلالة','Strain')} value={flock.strain}/><Mini label={L(language,'التحصين','Vaccination')} value={flock.vaccination_status}/></div>}
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 mt-4">{([['ask','اسأل','Ask'],['analyze','حلّل','Analyze'],['calculate','احسب','Calculate'],['check','تحقق','Check'],['risk','المخاطر','Risk'],['next','الإجراءات التالية','Next Actions']] as const).map(([id,ar,en])=><button key={id} className={tool===id?'r81-primary':'r81-secondary'} onClick={()=>runTool(id)}>{L(language,ar,en)}</button>)}</div>
    <div className="mt-4 flex gap-2"><input className="r81-field flex-1" value={question} onChange={e=>setQuestion(e.target.value)} placeholder={L(language,'اسأل عن القطيع أو البيئة أو الأداء...','Ask about the flock, environment or performance...')} onKeyDown={e=>e.key==='Enter'&&ask()}/><button className="r81-primary" disabled={busy||!flock} onClick={ask}>{busy?'...':L(language,'إرسال','Send')}</button></div>
    {answer&&<div className="mt-3 whitespace-pre-wrap rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-xs leading-6 text-slate-200">{answer}</div>}
    {latest&&<div className="mt-3 r81-card"><div className="flex justify-between gap-3"><b className="text-sm text-white">{L(language,latest.title_ar,latest.title_en)}</b><span className={`r81-risk ${latest.severity}`}>{latest.severity}</span></div><div className="mt-2 text-xs text-slate-400 leading-6">{latest.observations.join(' • ')||L(language,'لا يوجد شذوذ مهم ضمن البيانات المتاحة.','No significant anomaly in available data.')}</div>{latest.missing_data.length>0&&<div className="text-[10px] text-amber-300 mt-2">Missing: {latest.missing_data.join(', ')}</div>}<div className="text-[10px] text-slate-600 mt-2">Provenance: {latest.provenance.join(' · ')}</div></div>}
  </Panel>;
};

const Disease:React.FC<{state:OperationalReadinessStateR81;language:Props['language'];role:string;onChange:(s:OperationalReadinessStateR81)=>void}> = ({state,language,role,onChange}) => {
  const canClinical=['field_vet','vet_consultant'].includes(role);
  const advance=(id:string)=>{const order=['detected','acknowledged','investigating','containment','clinical_decision','monitoring','closed','post_event_review'];const a=state.disease_alerts.find(x=>x.id===id);if(!a)return;const idx=order.indexOf(a.status);const next=(order[Math.min(idx+1,order.length-1)]||a.status) as any;if(next==='clinical_decision'&&!canClinical)return;onChange({...state,disease_alerts:state.disease_alerts.map(x=>x.id===id?{...x,status:next,history:[...x.history,`${new Date().toISOString()}: ${role} → ${next}`]}:x)});};
  return <Panel title={L(language,'مركز تنبيهات الأمراض','Disease Alert Center')} subtitle={L(language,'الذكاء يكتشف ويربط ويصعّد؛ القرار السريري للطبيب المخول.','AI detects, correlates and escalates; clinical decisions remain with authorized veterinarians.')}><div className="space-y-3">{state.disease_alerts.map(a=><div key={a.id} className="r81-card"><div className="flex flex-wrap justify-between gap-2"><div><b className="text-white">{a.alert_number}</b><div className="text-xs text-slate-400 mt-1">{a.ai_summary}</div></div><span className={`r81-risk ${a.severity}`}>{a.severity}</span></div><div className="grid md:grid-cols-4 gap-2 mt-3"><Mini label={L(language,'الحالة','Status')} value={a.status}/><Mini label={L(language,'المسؤول','Assigned')} value={a.assigned_role}/><Mini label={L(language,'المحفزات','Triggers')} value={a.triggers.length}/><Mini label={L(language,'التاريخ','Detected')} value={a.detected_at.slice(0,16).replace('T',' ')}/></div><button className="mt-3 r81-secondary" onClick={()=>advance(a.id)}>{a.status==='clinical_decision'&&!canClinical?L(language,'يتطلب طبيباً مخولاً','Authorized veterinarian required'):L(language,'نقل للمرحلة التالية','Advance workflow')}</button></div>)}</div></Panel>;
};

const Actions:React.FC<{state:OperationalReadinessStateR81;language:Props['language']}> = ({state,language}) => <Panel title={L(language,'تدقيق إغلاق الأزرار والإجراءات','Button / Action Closure Audit')} subtitle={L(language,'كل زر تشغيلي له صلاحية وسياق وتحقيق ونتيجة وتسليم وتدقيق.','Every operational action has permission, context, validation, mutation, handoff and audit.')}><div className="space-y-3">{state.action_contracts.map(a=><div key={a.id} className="r81-card"><div className="flex justify-between gap-3"><div><b className="text-white">{L(language,a.label_ar,a.label_en)}</b><div className="text-[10px] text-slate-500 mt-1">{a.action_code} · {a.domain}</div></div>{a.clinical_authority_required&&<span className="r81-badge">Vet authority</span>}</div><div className="grid md:grid-cols-3 gap-3 mt-3 text-[10px]"><KV label="Roles" value={a.allowed_roles.join(', ')}/><KV label="Context" value={a.required_context.join(', ')}/><KV label="Validation" value={a.validations.join(', ')}/><KV label="Mutation" value={a.mutation}/><KV label="Handoff" value={a.downstream_handoffs.join(', ')}/><KV label="Audit" value={a.audit_event}/></div></div>)}</div></Panel>;

const Acceptance:React.FC<{state:OperationalReadinessStateR81;language:Props['language'];onChange:(s:OperationalReadinessStateR81)=>void}> = ({state,language,onChange}) => {
  const fields:(keyof R81ScreenAcceptance)[]=['opens','role_access','entity_scope','fields','validation','save','history','search_filter','actions','handoff','ai_context','attachments','print_export','restart_persistence','field_ux'];
  const cycle=(v:any)=>v==='not_checked'?'pass':v==='pass'?'fail':v==='fail'?'blocked':'not_checked';
  const set=(id:string,key:keyof R81ScreenAcceptance)=>onChange({...state,acceptance:state.acceptance.map(x=>x.id===id?{...x,[key]:cycle(x[key])}:x)});
  return <Panel title={L(language,'مصفوفة القبول التشغيلي R8.1','R8.1 Operational Acceptance Matrix')} subtitle={L(language,'لا تُعد الشاشة مكتملة لأنها تُرسم فقط؛ القبول مرئي ووظيفي ويشمل إعادة التشغيل.','A screen is not complete because it renders; acceptance is visible, functional and includes restart persistence.')}><div className="overflow-x-auto"><table className="r81-table min-w-[1500px]"><thead><tr><th>Screen</th>{fields.map(f=><th key={String(f)}>{String(f)}</th>)}</tr></thead><tbody>{state.acceptance.map(a=><tr key={a.id}><td><b>{a.screen_name}</b><small className="block text-slate-600">{a.screen_code}</small></td>{fields.map(f=><td key={String(f)}><button onClick={()=>set(a.id,f)} className={`acc-state ${a[f]}`}>{String(a[f])}</button></td>)}</tr>)}</tbody></table></div></Panel>;
};

const Settings:React.FC<{state:OperationalReadinessStateR81;language:Props['language'];onLanguageChange:(l:Props['language'])=>void;onChange:(s:OperationalReadinessStateR81)=>void}> = ({state,language,onLanguageChange,onChange}) => <Panel title="الإعدادات | Settings" subtitle={L(language,'إعدادات التشغيل واللغة والذكاء والمناخ.','Operational, language, intelligence and climate settings.')}>
  <div className="grid lg:grid-cols-2 gap-4"><div className="r81-card"><b className="text-white">{L(language,'اللغة','Language')}</b><div className="grid grid-cols-3 gap-1 mt-3">{([['ar','العربية'],['en','English'],['bilingual','عربي | English']] as const).map(([id,label])=><button key={id} className={`r81-choice ${language===id?'is-active':''}`} onClick={()=>onLanguageChange(id)}>{label}</button>)}</div></div><div className="r81-card"><b className="text-white">{L(language,'الطقس والمناخ','Weather & Climate')}</b><div className="mt-3 grid grid-cols-2 gap-2"><Mini label="Provider" value={state.settings.weather_provider}/><Mini label="Cache" value={`${state.settings.weather_cache_minutes} min`}/></div></div></div>
  <div className="grid md:grid-cols-3 gap-3 mt-4"><SettingToggle label={L(language,'حارس الإجراءات غير الآمنة','Unsafe Action Guard')} value={state.settings.unsafe_action_guard} onClick={()=>onChange({...state,settings:{...state.settings,unsafe_action_guard:!state.settings.unsafe_action_guard}})}/><SettingToggle label={L(language,'إظهار مصدر تحليل AI','AI provenance required')} value={state.settings.ai_provenance_required} onClick={()=>onChange({...state,settings:{...state.settings,ai_provenance_required:!state.settings.ai_provenance_required}})}/><SettingToggle label={L(language,'العمل الميداني دون اتصال','Offline field queue required')} value={state.settings.offline_field_queue_required} onClick={()=>onChange({...state,settings:{...state.settings,offline_field_queue_required:!state.settings.offline_field_queue_required}})}/></div>
  <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-100">{L(language,'القرار الطبي عالي المخاطر يبقى دائماً تحت الطبيب المخول، ولا يمكن تعطيل Human-in-the-loop من الواجهة.','High-risk clinical decisions always remain under authorized veterinary control; human-in-the-loop cannot be disabled from this UI.')}</div>
</Panel>;

const CalcDemo:React.FC<{state:OperationalReadinessStateR81;language:Props['language']}> = ({language}) => {
  const [value,setValue]=useState<string>('');
  const run=()=>{try{setValue(`${calculateR81('rule-mort-1',{mortality:25,opening_population:10000})}%`);}catch(e:any){setValue(e.message)}};
  return <button className="r81-secondary" onClick={run}>{value?`${L(language,'مثال نسبة النفوق','Mortality example')}: ${value}`:L(language,'احسب بمُعادلة معتمدة','Calculate approved equation')}</button>;
};

function roleAllowed(roles:string[],role:string){return roles.includes('*')||roles.includes(role)||role==='system_owner'}
const Panel:React.FC<{title:string;subtitle?:string;children:React.ReactNode}> = ({title,subtitle,children}) => <section className="r81-panel"><div className="mb-4"><h3 className="text-base sm:text-lg font-black text-white">{title}</h3>{subtitle&&<p className="text-[11px] leading-5 text-slate-500 mt-1">{subtitle}</p>}</div>{children}</section>;
const Metric:React.FC<{label:string;value:React.ReactNode;warn?:boolean}> = ({label,value,warn}) => <div className={`r81-metric ${warn?'warn':''}`}><span>{label}</span><b>{value}</b></div>;
const Mini:React.FC<{label:string;value:React.ReactNode}> = ({label,value}) => <div className="r81-mini"><span>{label}</span><b>{value}</b></div>;
const Launch:React.FC<{icon:React.ReactNode;title:string;note:string;onClick:()=>void}> = ({icon,title,note,onClick}) => <button className="r81-launch" onClick={onClick}><span className="r81-launch-icon">{icon}</span><span className="text-start"><b>{title}</b><small>{note}</small></span><ChevronLeft className="w-4 h-4 ms-auto opacity-50"/></button>;
const StatusPill:React.FC<{ok:boolean;neutral?:boolean;label:string}> = ({ok,neutral,label}) => <span className={`r81-status ${neutral?'neutral':ok?'ok':'warn'}`}>{label}</span>;
const KV:React.FC<{label:string;value:string}> = ({label,value}) => <div><b className="text-slate-500">{label}</b><div className="text-slate-300 mt-1 leading-5">{value||'—'}</div></div>;
const SettingToggle:React.FC<{label:string;value:boolean;onClick:()=>void}> = ({label,value,onClick}) => <button className="r81-card flex items-center justify-between text-start" onClick={onClick}><span className="text-xs font-black text-slate-200">{label}</span><span className={`r81-toggle ${value?'on':''}`}><i/></span></button>;
