import React,{useEffect,useMemo,useState} from 'react';
import {Building2,Users,MapPin,FileText,Boxes,FlaskConical,Store,Route,ShoppingCart,MessagesSquare,BrainCircuit,Printer,Search,ShieldCheck,PlusCircle,Phone,Landmark,Info} from 'lucide-react';
import type {MultiBusinessEnterpriseStateV2023} from '../../modules/v20/MultiBusinessEnterpriseV20_2_3';
import type {ManagedOperationsStateV197} from '../../modules/managed/ManagedPoultryOperationsV19_7';
import type {PlatformCoreStateV195,PlatformRoleV195} from '../../modules/platform/PlatformCoreV19_5';
import {addCustomerR7,addOfficeR7,addPartnerR7,addRouteRequestR7,nearestEligibleBranchesR7,validatePartnerOfficeCustomerNetworkR7,type R7Offer,type R7CustomerJourney} from '../../modules/v20/PartnerOfficeCustomerNetworkR7';
import './CustomerOfficePartnerNetworkR7.css';
import {apiService} from '../../services/apiService';
import {Office360ErrorBoundary} from '../office/Office360ErrorBoundary';
import ItemsPage from '../office/ItemsPage';

type Props={business:MultiBusinessEnterpriseStateV2023;managed:ManagedOperationsStateV197;platform:PlatformCoreStateV195;currentUser:{id:string;name:string;role:PlatformRoleV195};onBusinessChange:(n:MultiBusinessEnterpriseStateV2023)=>void;onManagedChange:(n:ManagedOperationsStateV197)=>void};
type Tab='overview'|'office360'|'customers'|'offices'|'partners'|'branches'|'contracts'|'catalog'|'markets'|'labs'|'route'|'procurement'|'communication'|'items'|'about';
const journeyName:Record<R7CustomerJourney,string>={retail:'عميل متجر/Marketplace',guest:'ضيف/Guest',managed_farm:'عميل إدارة مزرعة',farm_owner_seller:'مالك مزرعة/بائع قطيع',marketing_partner:'شريك/مكتب تسويق'};
const tabs:Array<[Tab,string,React.ReactNode]>= [['overview','القيادة',<Landmark/>],['office360','مساحة المكتب المتعاقد',<Building2/>],['items','الأدوية والمعدات',<Boxes/>],['customers','العملاء · Customer 360',<Users/>],['offices','المكاتب',<Building2/>],['partners','الشركات والشركاء',<Store/>],['branches','الفروع والمحافظات',<MapPin/>],['contracts','العقود والأسعار',<FileText/>],['catalog','الكتالوج والتوفر',<Boxes/>],['markets','الأسواق والتسويق',<ShoppingCart/>],['labs','المختبرات والفقاسات',<FlaskConical/>],['route','أقرب فرع',<Route/>],['procurement','المشتريات والتسوية',<ShieldCheck/>],['communication','AI والتواصل',<MessagesSquare/>],['about','هوية النظام',<Info/>]];
const tabGroups:Array<{name:string;items:Tab[]}>= [
 {name:'المنصة والعمليات',items:['overview','customers','procurement','communication']},
 {name:'المكاتب المتعاقدة',items:['office360','items','offices','contracts']},
 {name:'شركات التسويق والأسواق',items:['partners','markets']},
 {name:'الفروع والمنتجات والخدمات',items:['branches','catalog','labs','route']},
 {name:'الإعدادات',items:['about']}
];
const tabLabel=(id:Tab)=>tabs.find(([key])=>key===id)?.[1]||id;
const fmt=(n:number)=>new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(n||0);
export const CustomerOfficePartnerNetworkR7:React.FC<Props>=({business,managed,platform,currentUser,onBusinessChange,onManagedChange})=>{
 const net=business.partner_office_customer_network_r7; const [tab,setTab]=useState<Tab>('overview'); const [q,setQ]=useState(''); const [toast,setToast]=useState('');
 const issues=useMemo(()=>validatePartnerOfficeCustomerNetworkR7(net),[net]); const show=(x:string)=>setToast(x);
 const [identityBusy,setIdentityBusy]=useState(false);
 const [identityError,setIdentityError]=useState('');
 const [identityLoaded,setIdentityLoaded]=useState(false);
 const refreshIdentity=async()=>{
   setIdentityBusy(true);
   try{
     const identity=await apiService.getR7MasterIdentity();
     onBusinessChange({...business,partner_office_customer_network_r7:{...net,offices:identity.offices,organizations:identity.organizations,branches:identity.branches,governorates:identity.governorates,contracts:identity.contracts,offers:identity.offers,regional_markets:identity.regional_markets,market_prices:identity.market_prices,price_change_history:identity.price_change_history}});
     setIdentityLoaded(true);setIdentityError('');
   }catch(e){setIdentityLoaded(false);setIdentityError(e instanceof Error?e.message:String(e));}
   finally{setIdentityBusy(false);}
 };
 useEffect(()=>{void refreshIdentity();},[]);
 const commitIdentity=async(operation:()=>Promise<void>)=>{
   setIdentityBusy(true);
   try{await operation();await refreshIdentity();show('تم الحفظ في الخادم وتحديث البيانات');}
   catch(e){setIdentityError(e instanceof Error?e.message:String(e));show('فشل الحفظ بالخادم، لم يتم تأكيد العملية');}
   finally{setIdentityBusy(false);}
 };

 const update=(next:any,msg:string)=>{onBusinessChange({...business,partner_office_customer_network_r7:next});show(msg);};
 const managedUnlinked=managed.managed_contracts.filter(c=>!c.office_id);
 const reconcile=()=>{let changed=0;const contracts=managed.managed_contracts.map(c=>{if(c.office_id)return c;const matches=net.offices.filter(o=>o.name.trim()===c.office_name.trim());if(matches.length!==1)return c;changed++;return {...c,office_id:matches[0].id};});onManagedChange({...managed,managed_contracts:contracts});show(changed?`تم ربط ${changed} عقد إدارة بـ office_id canonical.`:'لا توجد عقود يمكن ربطها تلقائيًا؛ راجع الاسم/المكتب.');};
 return <div className="r7-shell" dir="rtl">{toast&&<div className="r7-toast" onClick={()=>setToast('')}>{toast}</div>}
  <header className="r7-hero"><div><div className="r7-kicker">AVINEXUS · WINDOWS CUSTOMER / OFFICE / PARTNER NETWORK · R7</div><h1>{net.brand_name_ar}</h1><p>شبكة موحدة للعملاء والمكاتب والشركات والفروع والعقود والأسواق والمختبرات والتوريد. لا تنشئ دفتر مخزون أو محاسبة موازياً: Section 7 للمخزون وSection 12 للمحاسبة.</p></div><div className="r7-owner"><span>هوية المنتج</span><b>{net.brand_name}</b><small>Product Owner · {net.product_owner_name}</small></div></header>
  <div className="r7-panel" role="status"><button onClick={()=>void refreshIdentity()} disabled={identityBusy}>تحديث بيانات الهوية من الخادم</button> <span>{identityLoaded?'تم تحميل الهوية من الخادم':'بيانات الهوية المحلية غير مؤكدة الحفظ بالخادم'}</span>{identityError&&<strong role="alert">خطأ: {identityError}</strong>}</div>
  <nav className="r7-quick-nav" aria-label="الانتقال المباشر إلى أقسام الشبكة">
    <label htmlFor="r7-direct-section">الانتقال المباشر إلى القسم</label>
    <select id="r7-direct-section" value={tab} onChange={e=>setTab(e.target.value as Tab)}>
      {tabGroups.map(group=><optgroup key={group.name} label={group.name}>{group.items.map(id=><option key={id} value={id}>{tabLabel(id)}</option>)}</optgroup>)}
    </select>
    <span role="status">القسم الحالي: {tabLabel(tab)}</span>
  </nav>
  <div className="r7-nav" aria-label="أقسام الشبكة">{tabGroups.map(group=><div className="r7-nav-group" key={group.name}><strong>{group.name}</strong><div className="r7-nav-group-items">{group.items.map(id=>{const item=tabs.find(([key])=>key===id);if(!item)return null;const [,l,ic]=item;return <button type="button" key={id} aria-current={tab===id?'page':undefined} className={tab===id?'active':''} onClick={()=>setTab(id)}>{React.cloneElement(ic as React.ReactElement,{className:'r7-ico'})}{l}</button>;})}</div></div>)}</div>
  {tab==='overview'&&<Overview net={net} managed={managed} platform={platform} issues={issues} managedUnlinked={managedUnlinked.length} reconcile={reconcile}/>} 
  {tab==='office360'&&<Office360ErrorBoundary><Office360 net={net} managed={managed} business={business} currentUser={currentUser}/></Office360ErrorBoundary> }
  {tab==='items'&&<Office360ErrorBoundary><OfficeItemsWorkspace/></Office360ErrorBoundary>}
  {tab==='customers'&&<Customers net={net} q={q} setQ={setQ} update={update}/>} 
  {tab==='offices'&&<Offices net={net} update={update} commitIdentity={commitIdentity} identityLoaded={identityLoaded} identityBusy={identityBusy}/>} 
  {tab==='partners'&&<Partners net={net} q={q} setQ={setQ} update={update} commitIdentity={commitIdentity} identityLoaded={identityLoaded} identityBusy={identityBusy}/>} 
  {tab==='branches'&&<Branches net={net} update={update} commitIdentity={commitIdentity} identityLoaded={identityLoaded} identityBusy={identityBusy}/>} 
  {tab==='contracts'&&<Contracts net={net} commitIdentity={commitIdentity} identityLoaded={identityLoaded} identityBusy={identityBusy}/>} 
  {tab==='catalog'&&<Catalog net={net} q={q} setQ={setQ} commitIdentity={commitIdentity} identityLoaded={identityLoaded} identityBusy={identityBusy}/>} 
  {tab==='markets'&&<Markets net={net} managed={managed} commitIdentity={commitIdentity} identityLoaded={identityLoaded} identityBusy={identityBusy}/>} 
  {tab==='labs'&&<Labs net={net}/>} 
  {tab==='route'&&<Routing net={net} update={update} user={currentUser.name}/>} 
  {tab==='procurement'&&<Procurement business={business} managed={managed}/>} 
  {tab==='communication'&&<Communication managed={managed} platform={platform}/>} 
  {tab==='about'&&<About net={net}/>} 
  <footer className="r7-footer"><span>Factory R3 preserved</span><span>Farm R4/R5/R6 preserved</span><span>Android deferred</span><span>Windows/Web reference platform</span></footer>
 </div>;
};
const K:React.FC<{l:string;v:React.ReactNode;w?:boolean}>=({l,v,w})=><div className={w?'r7-kpi warn':'r7-kpi'}><span>{l}</span><b>{v}</b></div>;
const Panel:React.FC<{title:string;children:React.ReactNode;actions?:React.ReactNode}>=({title,children,actions})=><section className="r7-panel"><header><h3>{title}</h3>{actions}</header><div className="r7-body">{children}</div></section>;
const Table:React.FC<{h:string[];r:React.ReactNode[][]}>=({h,r})=><div className="r7-table-wrap"><table><thead><tr>{h.map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{r.length?r.map((x,i)=><tr key={i}>{x.map((v,j)=><td key={j}>{v}</td>)}</tr>):<tr><td colSpan={h.length}>لا توجد بيانات.</td></tr>}</tbody></table></div>;
const Overview=({net,managed,platform,issues,managedUnlinked,reconcile}:any)=><div className="r7-grid"><Panel title="ملخص الشبكة"><div className="r7-kpis"><K l="المحافظات المرجعية" v={net.governorates.length}/><K l="العملاء/العلاقات" v={net.customers.length}/><K l="المكاتب" v={net.offices.length}/><K l="الشركات/الشركاء" v={net.organizations.length}/><K l="الفروع" v={net.branches.length}/><K l="العقود" v={net.contracts.length}/><K l="العروض/الأسعار" v={net.offers.length}/><K l="الأسواق" v={net.regional_markets.length}/><K l="أسعار مختبر" v={net.lab_prices.length}/><K l="عقود مزارع غير مربوطة" v={managedUnlinked} w={managedUnlinked>0}/><K l="مشاكل التكامل" v={issues.length} w={issues.length>0}/><K l="كتالوج مؤسسي" v={platform.catalog.length}/><K l="مزارع مُدارة" v={managed.farms.length}/></div></Panel><Panel title="سلسلة القبول النهائية"><div className="r7-flow">{['Customer / Farm Owner','Canonical Office ID','Company / Feed Mill / Lab / Hatchery','Contract + Historical Pricing','Branch + Governorate + Availability','Nearest Branch','Purchase / Order','Receipt / Section 7','Invoice / Section 12','Reports / Printing / History'].map((x,i)=><div key={x}><span>{i+1}</span><b>{x}</b></div>)}</div>{managedUnlinked>0&&<button className="r7-primary" onClick={reconcile}>ربط العقود القديمة تلقائيًا بالمكتب canonical</button>}</Panel><Panel title="قواعد عدم التكرار"><ul className="r7-list"><li>Customer identity واحد، وعلاقات متعددة حسب الرحلة.</li><li>office_id هو المرجع التشغيلي للعقد؛ office_name يبقى للعرض والتوافق.</li><li>Section 7 وحده يملك حركات المخزون.</li><li>Section 12 وحده يملك GL/AP/AR/Treasury.</li><li>التاريخ السعري والعقود Append-only/versioned.</li><li>الطبيب يملك القرار الطبي النهائي؛ AI استشاري.</li></ul></Panel><Panel title="التكامل/المشاكل">{issues.length?<ul className="r7-list danger">{issues.map((x:string)=><li key={x}>{x}</li>)}</ul>:<div className="r7-ok">PASS — لا توجد علاقات orphan في شبكة R7.</div>}</Panel></div>;
const OfficeItemsWorkspace:React.FC=()=>{
 const [offices,setOffices]=useState<Array<{id:string;name:string;code:string}>>([]);
 const [officeId,setOfficeId]=useState('');
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 useEffect(()=>{
  const controller=new AbortController();
  setLoading(true);setError('');setOffices([]);setOfficeId('');
  apiService.getAuthorizedContractedOfficesV2026(controller.signal)
   .then(result=>{if(!controller.signal.aborted)setOffices(Array.isArray(result)?result.filter(office=>office&&typeof office.id==='string'&&office.id.length>0):[]);})
   .catch(cause=>{if(!controller.signal.aborted)setError(cause instanceof Error?cause.message:String(cause));})
   .finally(()=>{if(!controller.signal.aborted)setLoading(false);});
  return ()=>controller.abort();
 },[]);
 const selectedOfficeId=offices.some(office=>office.id===officeId)?officeId:(offices[0]?.id||'');
 return <div className="r7-grid one"><Panel title="الأدوية والمعدات — دليل أصناف المكتب">
  <p>اختر مكتبًا من المكاتب المصرح بها. يخضع الوصول إلى الأصناف والدفعات للتحقق من الصلاحيات على الخادم.</p>
  {loading&&<p role="status">جارٍ تحميل المكاتب المصرح بها…</p>}
  {error&&<p role="alert">تعذر تحميل المكاتب: {error}</p>}
  {!loading&&!error&&offices.length===0&&<p>لا توجد مكاتب مصرح بها لحسابك.</p>}
  {!loading&&!error&&offices.length>0&&<>
   <div className="r7-form"><label htmlFor="r7-items-office">المكتب المتعاقد</label><select id="r7-items-office" value={selectedOfficeId} onChange={event=>setOfficeId(event.target.value)}>{offices.map(office=><option key={office.id} value={office.id}>{office.name} ({office.code})</option>)}</select></div>
   {selectedOfficeId&&<ItemsPage key={selectedOfficeId} officeId={selectedOfficeId}/>}
  </>}
 </Panel></div>;
};
const Office360=(_props:any)=>{
 const safeRows=(value:unknown):any[]=>Array.isArray(value)?value:[];
 const [offices,setOffices]=useState<Array<{id:string;name:string;code:string}>>([]);
 const [listLoading,setListLoading]=useState(true);
 const [officeId,setOfficeId]=useState('');
 const [workspace,setWorkspace]=useState<any>(null);
 const [treasury,setTreasury]=useState<any>(null);
 const [error,setError]=useState('');
 const [loading,setLoading]=useState(false);
 useEffect(()=>{
  const controller=new AbortController();setListLoading(true);setOffices([]);setWorkspace(null);setTreasury(null);
  apiService.getAuthorizedContractedOfficesV2026(controller.signal)
   .then(items=>{if(!controller.signal.aborted)setOffices(Array.isArray(items)?items.filter((x:any)=>x&&typeof x.id==='string'):[]);})
   .catch(e=>{if(!controller.signal.aborted)setError(String(e.message||e));})
   .finally(()=>{if(!controller.signal.aborted)setListLoading(false);});
  return ()=>controller.abort();
 },[]);
 const selectedId=offices.some(o=>o.id===officeId)?officeId:(offices[0]?.id||'');
 useEffect(()=>{
  setWorkspace(null);setTreasury(null);
  if(!selectedId)return;
  setError('');
  const controller=new AbortController();setLoading(true);
  Promise.all([apiService.getContractedOfficeWorkspaceV2026(selectedId,controller.signal),apiService.getContractedOfficeTreasuryV2026(selectedId,controller.signal)])
   .then(([w,t])=>{if(!controller.signal.aborted){setWorkspace(w&&typeof w==='object'?w:null);setTreasury(t&&typeof t==='object'?t:null);}})
   .catch((e:any)=>{if(!controller.signal.aborted)setError(String(e.message||e));})
   .finally(()=>{if(!controller.signal.aborted)setLoading(false);});
  return ()=>controller.abort();
 },[selectedId]);
 return <div className="r7-grid one"><Panel title="Office 360 — بيانات المكتب المصرح بها من الخادم">
  <p>تعرض هذه المساحة فقط البيانات التي يجيزها الخادم. لا تعرض بيانات مالية محلية عند فشل المصادقة أو الاتصال.</p>
  <div className="r7-form"><select aria-label="المكتب المتعاقد" value={selectedId} onChange={e=>setOfficeId(e.target.value)}>{offices.map((o:any)=><option key={o.id} value={o.id}>{o.name}</option>)}</select></div>
  {listLoading&&<p role="status">جارٍ تحميل المكاتب المصرح بها…</p>}
  {!listLoading&&!offices.length&&!error&&<p>لا توجد مكاتب متعاقدة مصرح بها لحسابك.</p>}
  {loading&&<p role="status">جارٍ تحميل بيانات المكتب والتحقق من الصلاحيات…</p>}
  {error&&<p role="alert">{error} — لم تُعرض أي بيانات مالية بديلة.</p>}
  {workspace&&!loading&&!error&&<><div className="r7-kpis"><K l="العقود النشطة" v={safeRows(workspace.contracts).length}/><K l="المزارع المرتبطة" v={safeRows(workspace.farm_ids).length}/><K l="الموظفون" v={safeRows(workspace.staff).length}/><K l="المستندات" v={safeRows(workspace.financial_documents).length}/></div>
   <Table h={['رقم العقد','المزرعة/المزارع','الحالة']} r={safeRows(workspace.contracts).map((c:any)=>[c?.contract_number||c?.id,safeRows(c?.linked_farm_ids).join('، '),c?.status])}/>
   <Table h={['الموظف','الدور','المزارع']} r={safeRows(workspace.staff).map((x:any)=>[x?.user_id,x?.role,safeRows(x?.farm_ids).join('، ')])}/>
   <Table h={['المستند','النوع','العملة','المبلغ']} r={safeRows(workspace.financial_documents).map((d:any)=>[d?.document_number||d?.id,d?.document_type,d?.currency,d?.original_amount])}/>
   <Table h={['الحساب','العملة','البنك']} r={safeRows(workspace.treasury_accounts).map((a:any)=>[a?.name,a?.currency,a?.bank_name||'—'])}/>
   {treasury&&<p>تم تحميل مطابقة الخزينة من الخادم. لا تُجمع أرصدة العملات المختلفة في إجمالي واحد.</p>}
   <p>جميع العمليات المحاسبية تتبع Section 12، وحركات المخزون Section 7. هذا العرض للقراءة فقط.</p>
  </>}
 </Panel></div>;
};
const Customers = ({ net, q, setQ, update }: any) => {
  const customers = Array.isArray(net?.customers) ? net.customers : [];
  const filtered = customers.filter((customer: any) => {
    const search = String(q || '').toLowerCase();
    return [customer?.name, customer?.phone, customer?.email, customer?.id].some(value => String(value || '').toLowerCase().includes(search));
  });
  return (
    <div className="r7-grid one">
      <Panel title="العملاء | Customer 360">
        <div className="r7-form">
          <input type="search" placeholder="البحث عن عميل" value={q || ''} onChange={e => setQ(e.target.value)} />
        </div>
        <Table h={['الاسم', 'الهاتف', 'البريد الإلكتروني', 'المعرف']} r={filtered.map((customer: any) => [customer.name || '—', customer.phone || '—', customer.email || '—', customer.id || '—'])} />
      </Panel>
    </div>
  );
};

const Offices=({net,commitIdentity,identityLoaded,identityBusy}:any)=>{
 const [name,setName]=useState('');
 const [gov,setGov]=useState('صنعاء');
 const [phone,setPhone]=useState('');
 const [manager,setManager]=useState('');
 const [renameId,setRenameId]=useState('');
 const [renameName,setRenameName]=useState('');
 const [saveError,setSaveError]=useState('');
 const add=async()=>{
  setSaveError('');
  if(!name.trim()){setSaveError('يجب إدخال اسم المكتب.');return;}
  if(!gov.trim()){setSaveError('يجب إدخال المحافظة.');return;}
  if(identityBusy){setSaveError('توجد عملية أخرى قيد التنفيذ.');return;}
  if(!identityLoaded){setSaveError('لم يتم تحميل الهوية من الخادم. يرجى إعادة المحاولة.');return;}
  try{
   await commitIdentity(async()=>{
    await apiService.createR7Office({code:`OFF-${Date.now()}`,name:name.trim(),office_type:'mixed',governorate:gov.trim(),district:'',address:'',phone:phone.trim(),manager_name:manager.trim(),responsible_roles:['manager','veterinarian','accountant','procurement','inventory'],warehouse_ids:[],status:'active'});
    setName('');
   });
  }catch(error){
   const message=error instanceof Error?error.message:'فشل حفظ المكتب';
   console.error('[Office360] Save office failed:',error);
   setSaveError(message);
  }
 };
 return <div className="r7-grid">
  <Panel title="إنشاء مكتب"><div className="r7-form">
   <input placeholder="اسم المكتب" value={name} onChange={e=>setName(e.target.value)}/>
   <input placeholder="المحافظة" value={gov} onChange={e=>setGov(e.target.value)}/>
   <input placeholder="الهاتف" value={phone} onChange={e=>setPhone(e.target.value)}/>
   <input placeholder="المدير" value={manager} onChange={e=>setManager(e.target.value)}/>
   <button type="button" className="r7-primary" onClick={()=>void add()} disabled={identityBusy||!identityLoaded||!name.trim()||!gov.trim()}><PlusCircle/>{identityBusy?'جارٍ الحفظ...':'حفظ المكتب بالخادم'}</button>
   {saveError&&<p role="alert" style={{color:'#f87171'}}>{saveError}</p>}
  </div></Panel>
  <Panel title="تعديل اسم مكتب محفوظ بالخادم"><div className="r7-form">
   <select value={renameId} onChange={e=>{setRenameId(e.target.value);setRenameName(net.offices.find((o:any)=>o.id===e.target.value)?.name||'')}}><option value="">اختر المكتب</option>{net.offices.map((o:any)=><option key={o.id} value={o.id}>{o.name}</option>)}</select>
   <input value={renameName} onChange={e=>setRenameName(e.target.value)} placeholder="الاسم الجديد"/>
   <button disabled={!identityLoaded||identityBusy||!renameId||!renameName.trim()} onClick={()=>void commitIdentity(()=>apiService.renameR7Office(renameId,renameName.trim()))}>حفظ الاسم بالخادم</button>
  </div></Panel>
  <Panel title="Office 360"><Table h={['الكود','المكتب','النوع','المحافظة','الهاتف','المدير','المسؤوليات']} r={net.offices.map((o:any)=>[o.code,o.name,o.office_type,o.governorate,o.phone,o.manager_name,Array.isArray(o.responsible_roles)?o.responsible_roles.join('، '):'—'])}/></Panel>
 </div>;
};
const Partners=({net,q,setQ,update,commitIdentity,identityLoaded,identityBusy}:any)=>{const [name,setName]=useState(''),[phone,setPhone]=useState(''),[kind,setKind]=useState('company'),[gov,setGov]=useState('صنعاء');const add=()=>{if(!name)return;if(kind==='marketing_company'){
  if(!identityLoaded)return;
  void commitIdentity(()=>apiService.createR7MarketingCompany({code:`MKT-${Date.now()}`,name:name.trim(),phone,governorates_served:[gov],preferred_currency:'SAR',credit_days:0,contact_name:'',payment_terms:'حسب العقد'}));setName('');return;
 }update(addPartnerR7(net,{code:`ORG-${Date.now().toString().slice(-5)}`,name,kind,contact_name:'',phone,governorates_served:[gov],payment_terms:'حسب العقد',credit_days:0,preferred_currency:'SAR',status:'active'} as any),'تم إنشاء الشريك.');setName('')};const rows=net.organizations.filter((x:any)=>`${x.name} ${x.phone} ${x.kind}`.includes(q));return <div className="r7-grid"><Panel title="إضافة شركة/شريك"><div className="r7-form"><input placeholder="اسم الشركة" value={name} onChange={e=>setName(e.target.value)}/><select value={kind} onChange={e=>setKind(e.target.value)}>{['company','distributor','feed_mill','medicine_supplier','vaccine_supplier','hatchery','laboratory','transport_provider','marketing_company','marketing_office','equipment_supplier'].map(x=><option value={x} key={x}>{x}</option>)}</select><input placeholder="الهاتف" value={phone} onChange={e=>setPhone(e.target.value)}/><input placeholder="محافظة الخدمة" value={gov} onChange={e=>setGov(e.target.value)}/><button className="r7-primary" onClick={add} disabled={identityBusy||(kind==='marketing_company'&&!identityLoaded)}><PlusCircle/>إضافة</button></div></Panel><Panel title="Partner 360" actions={<SearchBox q={q} setQ={setQ}/> }><Table h={['الكود','الشركة','النوع','الهاتف','المحافظات','الائتمان','العقود','الفروع']} r={rows.map((x:any)=>[x.code,x.name,x.kind,x.phone,x.governorates_served.join('، '),`${x.credit_days} يوم`,x.contract_ids.length,x.branch_ids.length])}/></Panel></div>};
const Branches=({net,update,commitIdentity,identityLoaded,identityBusy}:any)=>{const [company,setCompany]=useState(''),[name,setName]=useState(''),[gov,setGov]=useState(''),[district,setDistrict]=useState(''),[phone,setPhone]=useState(''),[editId,setEditId]=useState(''),[newGov,setNewGov]=useState('');const save=()=>{if(!company||!name.trim()||!gov.trim())return;if(!identityLoaded)return;void commitIdentity(async()=>{await apiService.saveR7Branch({id:editId||undefined,organization_id:company,name:name.trim(),governorate:gov.trim(),district,phone});setEditId('');setName('')});};const edit=(x:any)=>{setEditId(x.id);setCompany(x.organization_id);setName(x.name);setGov(x.governorate);setDistrict(x.district);setPhone(x.phone)};const addGov=()=>{const v=newGov.trim();if(!v||net.governorates.includes(v)||!identityLoaded)return;void commitIdentity(()=>apiService.createR7Governorate(v));setNewGov('')};return <div className="r7-grid one"><Panel title="إدارة المحافظات والفروع"><div className="r7-form"><input aria-label="اسم المحافظة الجديدة" placeholder="إضافة محافظة" value={newGov} onChange={e=>setNewGov(e.target.value)}/><button className="r7-primary" onClick={addGov} disabled={!identityLoaded||identityBusy}>إضافة محافظة بالخادم</button></div><div className="r7-chips">{net.governorates.map((g:string)=><span key={g}>{g}</span>)}</div><div className="r7-form"><select aria-label="الشركة المالكة للفرع" value={company} onChange={e=>setCompany(e.target.value)}><option value="">اختر الشركة</option>{net.organizations.map((o:any)=><option key={o.id} value={o.id}>{o.name}</option>)}</select><input placeholder="اسم الفرع" value={name} onChange={e=>setName(e.target.value)}/><select aria-label="محافظة الفرع" value={gov} onChange={e=>setGov(e.target.value)}><option value="">المحافظة</option>{net.governorates.map((g:string)=><option key={g}>{g}</option>)}</select><input placeholder="المديرية" value={district} onChange={e=>setDistrict(e.target.value)}/><input placeholder="الهاتف" value={phone} onChange={e=>setPhone(e.target.value)}/><button className="r7-primary" onClick={save} disabled={!identityLoaded||identityBusy||!company||!name.trim()||!gov}>{editId?'حفظ التعديل':'إضافة فرع'}</button>{editId&&<button onClick={()=>{setEditId('');setName('')}}>إلغاء</button>}</div><Table h={['الشركة','الفرع','المحافظة','المديرية','العنوان','الهاتف','المسؤول','إجراء']} r={net.branches.map((b:any)=>[net.organizations.find((o:any)=>o.id===b.organization_id)?.name||'—',b.name,b.governorate,b.district,b.address,b.phone,b.responsible_person,<button className="r7-small" onClick={()=>edit(b)}>تعديل</button>])}/></Panel></div>};
const Contracts=({net,commitIdentity,identityLoaded,identityBusy}:any)=>{
 const [organizationId,setOrganizationId]=useState('');const [officeId,setOfficeId]=useState('');
 const [number,setNumber]=useState('');const [title,setTitle]=useState('');
 const [startDate,setStartDate]=useState('');const [endDate,setEndDate]=useState('');
 const [currency,setCurrency]=useState<'SAR'|'USD'|'YER_NEW'|'YER_OLD'>('SAR');
 const [creditDays,setCreditDays]=useState('0');const [taxPercent,setTaxPercent]=useState('0');
 const [terms,setTerms]=useState('');const [revisionId,setRevisionId]=useState('');
 const [revisionDate,setRevisionDate]=useState('');const [revisionNote,setRevisionNote]=useState('');
 const [revisionStatus,setRevisionStatus]=useState<'draft'|'active'|'expired'|'terminated'>('active');
 const [revisionTerms,setRevisionTerms]=useState('');
 const selected=net.contracts.find((c:any)=>c.id===revisionId);
 const create=()=>{
  if(!identityLoaded||identityBusy||!organizationId||!number.trim()||!title.trim()||!startDate|| (endDate&&endDate<startDate))return;
  const credit=Number(creditDays),tax=Number(taxPercent);
  if(!Number.isInteger(credit)||credit<0||!Number.isFinite(tax)||tax<0||tax>100)return;
  void commitIdentity(async()=>{await apiService.createR7Contract({contract_number:number.trim(),organization_id:organizationId,office_id:officeId||undefined,title:title.trim(),start_date:startDate,end_date:endDate||undefined,currencies:[currency],credit_days:credit,tax_percent:tax,payment_terms:terms});setNumber('');setTitle('');setStartDate('');setEndDate('');});
 };
 const revise=()=>{
  if(!selected||!identityLoaded||identityBusy||!revisionDate||!revisionNote.trim())return;
  const last=selected.versions[selected.versions.length-1];
  if(revisionDate<selected.start_date||revisionDate<last.effective_from)return;
  void commitIdentity(async()=>{await apiService.reviseR7Contract(selected.id,{expected_version:last.version,effective_from:revisionDate,note:revisionNote.trim(),status:revisionStatus,payment_terms:revisionTerms});setRevisionId('');setRevisionNote('');setRevisionDate('');});
 };
 return <div className="r7-grid">
 <Panel title="إنشاء عقد تجاري محفوظ بالخادم"><div className="r7-form">
 <select value={organizationId} onChange={e=>setOrganizationId(e.target.value)}><option value="">اختر الشركة</option>{net.organizations.map((o:any)=><option key={o.id} value={o.id}>{o.name}</option>)}</select>
 <select value={officeId} onChange={e=>setOfficeId(e.target.value)}><option value="">دون مكتب مرتبط</option>{net.offices.map((o:any)=><option key={o.id} value={o.id}>{o.name}</option>)}</select>
 <input placeholder="رقم العقد" value={number} onChange={e=>setNumber(e.target.value)}/><input placeholder="عنوان العقد" value={title} onChange={e=>setTitle(e.target.value)}/>
 <label>تاريخ البداية<input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}/></label><label>تاريخ النهاية (اختياري)<input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)}/></label>
 <select value={currency} onChange={e=>setCurrency(e.target.value as any)}>{['SAR','USD','YER_NEW','YER_OLD'].map(c=><option key={c}>{c}</option>)}</select>
 <input type="number" min="0" step="1" placeholder="أيام الائتمان" value={creditDays} onChange={e=>setCreditDays(e.target.value)}/><input type="number" min="0" max="100" step="any" placeholder="الضريبة %" value={taxPercent} onChange={e=>setTaxPercent(e.target.value)}/>
 <input placeholder="شروط الدفع" value={terms} onChange={e=>setTerms(e.target.value)}/>
 <button className="r7-primary" disabled={!identityLoaded||identityBusy||!organizationId||!number.trim()||!title.trim()||!startDate} onClick={create}>حفظ العقد بالخادم</button></div></Panel>
 <Panel title="العقود النشطة"><Table h={['رقم العقد','الشريك','العنوان','من','إلى','الائتمان','العملات','الحالة','تعديل']} r={net.contracts.map((c:any)=>[c.contract_number,net.organizations.find((o:any)=>o.id===c.organization_id)?.name||'—',c.title,c.start_date,c.end_date||'مفتوح',`${c.credit_days} يوم`,c.currencies.join('/'),c.status,<button className="r7-small" disabled={!identityLoaded||identityBusy} onClick={()=>{setRevisionId(c.id);setRevisionDate('');setRevisionNote('');setRevisionStatus(c.status);setRevisionTerms(c.payment_terms)}}>إصدار تعديل</button>])}/></Panel>
 {selected&&<Panel title={`تعديل العقد ${selected.contract_number} — الإصدار ${selected.versions[selected.versions.length-1].version+1}`}><div className="r7-form"><label>تاريخ سريان التعديل<input type="date" value={revisionDate} onChange={e=>setRevisionDate(e.target.value)}/></label><input placeholder="سبب التعديل (إلزامي)" value={revisionNote} onChange={e=>setRevisionNote(e.target.value)}/><input placeholder="شروط الدفع الجديدة" value={revisionTerms} onChange={e=>setRevisionTerms(e.target.value)}/><select value={revisionStatus} onChange={e=>setRevisionStatus(e.target.value as any)}>{['draft','active','expired','terminated'].map(x=><option key={x}>{x}</option>)}</select><button className="r7-primary" disabled={!identityLoaded||identityBusy||!revisionDate||!revisionNote.trim()} onClick={revise}>حفظ إصدار جديد</button><button onClick={()=>setRevisionId('')}>إلغاء</button></div></Panel>}
 <Panel title="التاريخ والإصدارات"><Table h={['العقد','الإصدار','ساري من','ساري إلى','السبب','بواسطة']} r={net.contracts.flatMap((c:any)=>c.versions.map((v:any)=>[c.contract_number,v.version,v.effective_from,v.effective_to||'—',v.note,v.changed_by]))}/></Panel></div>;
};
const Catalog=({net,q,setQ,commitIdentity,identityLoaded,identityBusy}:any)=>{
 const [editId,setEditId]=useState('');const [company,setCompany]=useState('');const [sku,setSku]=useState('');const [name,setName]=useState('');
 const [category,setCategory]=useState<R7Offer['category']>('chick');const [price,setPrice]=useState('');
 const [currency,setCurrency]=useState<'SAR'|'USD'|'YER_NEW'|'YER_OLD'>('YER_OLD');const [note,setNote]=useState('');
 const [expectedPrice,setExpectedPrice]=useState<number|null>(null);const [expectedCurrency,setExpectedCurrency]=useState<'SAR'|'USD'|'YER_NEW'|'YER_OLD'|null>(null);
 const rows=net.offers.filter((x:any)=>`${x.sku} ${x.item_name} ${x.category}`.toLowerCase().includes(q.toLowerCase()));
 const edit=(x:any)=>{setEditId(x.id);setCompany(x.organization_id);setSku(x.sku);setName(x.item_name);setCategory(x.category);setPrice(String(x.contract_price));setCurrency(x.currency);setExpectedPrice(x.contract_price);setExpectedCurrency(x.currency);setNote('')};
 const clear=()=>{setEditId('');setSku('');setName('');setPrice('');setNote('');setExpectedPrice(null);setExpectedCurrency(null)};
 const save=()=>{
  const amount=Number(price);
  if(!identityLoaded||identityBusy||!company||!sku.trim()||!name.trim()||!price.trim()||!Number.isFinite(amount)||amount<0||(editId&&(!note.trim()||expectedPrice===null||expectedCurrency===null)))return;
  void commitIdentity(async()=>{await apiService.saveR7Offer({id:editId||undefined,organization_id:company,sku:sku.trim(),item_name:name.trim(),category,contract_price:amount,currency,note:editId?note.trim():undefined,expected_contract_price:editId?expectedPrice!:undefined,expected_currency:editId?expectedCurrency!:undefined});clear()});
 };
 return <div className="r7-grid one"><Panel title="إضافة وتعديل أسعار الكتاكيت والأعلاف والعلاجات"><div className="r7-form">
 <select value={company} disabled={Boolean(editId)} onChange={e=>setCompany(e.target.value)}><option value="">الشركة</option>{net.organizations.map((o:any)=><option value={o.id} key={o.id}>{o.name}</option>)}</select>
 <input placeholder="SKU" disabled={Boolean(editId)} value={sku} onChange={e=>setSku(e.target.value)}/>
 <input placeholder="الصنف / السلالة" disabled={Boolean(editId)} value={name} onChange={e=>setName(e.target.value)}/>
 <select value={category} disabled={Boolean(editId)} onChange={e=>setCategory(e.target.value as R7Offer['category'])}>{['chick','feed','medicine','vaccine','equipment','disinfectant','feed_additive','lab_service','transport','other'].map(x=><option key={x} value={x}>{x}</option>)}</select>
 <input type="number" min="0" step="any" placeholder="السعر" value={price} onChange={e=>setPrice(e.target.value)}/>
 <select value={currency} onChange={e=>setCurrency(e.target.value as any)}>{['SAR','USD','YER_NEW','YER_OLD'].map(x=><option key={x}>{x}</option>)}</select>
 {editId&&<input placeholder="سبب تعديل السعر (إلزامي)" value={note} onChange={e=>setNote(e.target.value)}/>}
 <button className="r7-primary" onClick={save} disabled={!identityLoaded||identityBusy||!company||!sku.trim()||!name.trim()||!price.trim()||(Boolean(editId)&&!note.trim())}>{editId?'حفظ إصدار السعر بالخادم':'إضافة الصنف بالخادم'}</button>
 {editId&&<button onClick={clear}>إلغاء</button>}</div></Panel>
 <Panel title="سجل تعديلات الأسعار (لا يحذف السابق)"><Table h={['التاريخ','الصنف','المستخدم','السعر السابق','السعر الجديد','السبب']} r={(net.price_change_history||[]).slice().reverse().map((h:any)=>[h.at,h.previous.item_name,h.actor_id,`${h.previous.contract_price} ${h.previous.currency}`,`${h.next.contract_price} ${h.next.currency}`,h.note||'—'])}/></Panel>
 <Panel title="Contract Catalog + Availability" actions={<SearchBox q={q} setQ={setQ}/>}><Table h={['SKU','الصنف','الفئة','الشركة','السعر العادي','سعر العقد','العملة','التوفر','إجراء']} r={rows.map((o:any)=>[o.sku,o.item_name,o.category,net.organizations.find((x:any)=>x.id===o.organization_id)?.name||'—',fmt(o.normal_price),fmt(o.contract_price),o.currency,o.availability,<button className="r7-small" disabled={!identityLoaded||identityBusy} onClick={()=>edit(o)}>تعديل</button>])}/></Panel></div>;
};
const Markets=({net,managed,commitIdentity,identityLoaded,identityBusy}:any)=>{
 const [name,setName]=useState('');
 const [governorate,setGovernorate]=useState('');
 const [marketType,setMarketType]=useState<'poultry_live'|'chicks'|'feed'|'mixed'>('mixed');
 const [marketId,setMarketId]=useState('');
 const [category,setCategory]=useState<'broiler_live_kg'|'chick'|'feed_starter'|'feed_grower'|'feed_finisher'|'other'>('chick');
 const [date,setDate]=useState(new Date().toISOString().slice(0,10));
 const [price,setPrice]=useState('');
 const [currency,setCurrency]=useState<'SAR'|'USD'|'YER_NEW'|'YER_OLD'>('YER_NEW');
 const [trend,setTrend]=useState<'up'|'stable'|'down'>('stable');
 const canWrite=identityLoaded&&!identityBusy;
 return <div className="r7-grid">
  <Panel title="تسجيل سوق إقليمي بالخادم"><div className="r7-form">
   <input placeholder="اسم السوق" value={name} onChange={e=>setName(e.target.value)}/>
   <select value={governorate} onChange={e=>setGovernorate(e.target.value)}><option value="">اختر المحافظة</option>{net.governorates.map((g:string)=><option key={g} value={g}>{g}</option>)}</select>
   <select value={marketType} onChange={e=>setMarketType(e.target.value as typeof marketType)}>{['mixed','poultry_live','chicks','feed'].map(x=><option key={x} value={x}>{x}</option>)}</select>
   <button disabled={!canWrite||name.trim().length<2||!governorate} onClick={()=>void commitIdentity(async()=>{await apiService.createR7Market({name:name.trim(),governorate,market_type:marketType});setName('');})}>حفظ السوق</button>
  </div></Panel>
  <Panel title="تسجيل سعر سوق تاريخي"><div className="r7-form">
   <select value={marketId} onChange={e=>setMarketId(e.target.value)}><option value="">اختر السوق النشط</option>{net.regional_markets.filter((m:any)=>m.active).map((m:any)=><option key={m.id} value={m.id}>{m.name} — {m.governorate}</option>)}</select>
   <input type="date" value={date} onChange={e=>setDate(e.target.value)}/>
   <select value={category} onChange={e=>setCategory(e.target.value as typeof category)}>{['broiler_live_kg','chick','feed_starter','feed_grower','feed_finisher','other'].map(x=><option key={x} value={x}>{x}</option>)}</select>
   <input type="number" min="0" step="any" value={price} placeholder="السعر" onChange={e=>setPrice(e.target.value)}/>
   <select value={currency} onChange={e=>setCurrency(e.target.value as typeof currency)}>{['SAR','USD','YER_NEW','YER_OLD'].map(x=><option key={x} value={x}>{x}</option>)}</select>
   <select value={trend} onChange={e=>setTrend(e.target.value as typeof trend)}>{['stable','up','down'].map(x=><option key={x} value={x}>{x}</option>)}</select>
   <button disabled={!canWrite||!marketId||!date||!price||!Number.isFinite(Number(price))||Number(price)<=0} onClick={()=>void commitIdentity(async()=>{await apiService.addR7MarketPrice({market_id:marketId,date,category,value:Number(price),currency,trend});setPrice('');})}>حفظ الملاحظة السعرية</button>
  </div></Panel>
  <Panel title="الأسواق الإقليمية"><Table h={['السوق','المحافظة','النوع','الحالة','الإجراء']} r={net.regional_markets.map((m:any)=>[m.name,m.governorate,m.market_type,m.active?'نشط':'موقوف',<button key={m.id} disabled={!canWrite} onClick={()=>void commitIdentity(()=>apiService.setR7MarketActive(m.id,!m.active))}>{m.active?'إيقاف':'تفعيل'}</button>])}/></Panel>
  <Panel title="أسعار السوق — سجل غير قابل للتعديل"><Table h={['التاريخ','السوق','الفئة','السعر','العملة','الاتجاه']} r={net.market_prices.map((p:any)=>[p.date,net.regional_markets.find((m:any)=>m.id===p.market_id)?.name||'—',p.category,fmt(p.value),p.currency,p.trend])}/></Panel>
  <Panel title="مكاتب التسويق"><Table h={['المكتب','المحافظة','الهاتف','المسؤول','العمولة']} r={net.marketing_offices.map((o:any)=>[o.name,o.governorate,o.phone,o.contact_name,o.commission_rule])}/></Panel>
  <Panel title="جاهزية القطعان للبيع"><Table h={['المزرعة','القطيع','سعر السوق المرجعي','التعادل','قرار المالك']} r={managed.marketing_readiness.map((x:any)=>[managed.farms.find((f:any)=>f.id===x.farm_id)?.name||x.farm_id,x.flock_id,`${fmt(x.market_reference_price_per_kg)} ${x.currency}`,fmt(x.break_even_price_per_kg),x.owner_decision])}/></Panel>
 </div>;
};
const Labs=({net}:any)=><div className="r7-grid"><Panel title="المختبرات وأسعار الفحوص"><Table h={['المختبر','الخدمة','العينة','العادي','العقد','العملة','TAT','SKU مرتبط']} r={net.lab_prices.map((x:any)=>[net.organizations.find((o:any)=>o.id===x.laboratory_id)?.name||'—',x.service_name,x.sample_type,fmt(x.normal_price),fmt(x.contract_price),x.currency,`${x.turnaround_hours} ساعة`,x.linked_catalog_sku||'—'])}/></Panel><Panel title="الفقاسات/الكتاكيت"><Table h={['الشركة','الصنف','السلالة','السعر','المتاح','الفرع']} r={net.offers.filter((x:any)=>x.category==='chick').map((x:any)=>[net.organizations.find((o:any)=>o.id===x.organization_id)?.name||'—',x.item_name,x.variant||'—',`${fmt(x.contract_price)} ${x.currency}`,x.available_quantity??'—',net.branches.find((b:any)=>b.id===x.branch_id)?.name||'—'])}/></Panel></div>;
const Routing=({net,update,user}:any)=>{const [gov,setGov]=useState('صنعاء'),[dist,setDist]=useState(''),[cat,setCat]=useState<R7Offer['category']>('vaccine'),[qty,setQty]=useState(1),[cold,setCold]=useState(true);const results=nearestEligibleBranchesR7(net,{governorate:gov,district:dist||undefined,category:cat,quantity:qty,cold_chain_required:cold});const commit=(r:any)=>update(addRouteRequestR7(net,{requester_name:user,requester_type:'procurement',governorate:gov,district:dist||undefined,category:cat,quantity:qty,cold_chain_required:cold,selected_branch_id:r.branch.id,selected_offer_id:r.offer.id,distance_km:r.distance_km,eta_hours:r.distance_km?Math.max(1,r.distance_km/45):undefined,reason:'أقرب فرع مؤهل حسب المحافظة/التوفر/السلسلة الباردة'}),'تم تثبيت مسار الفرع المختار في السجل.');return <div className="r7-grid"><Panel title="طلب أقرب فرع"><div className="r7-form"><input value={gov} onChange={e=>setGov(e.target.value)} placeholder="المحافظة"/><input value={dist} onChange={e=>setDist(e.target.value)} placeholder="المديرية"/><select value={cat} onChange={e=>setCat(e.target.value as any)}>{['medicine','vaccine','feed','chick','equipment','disinfectant','feed_additive','lab_service','transport'].map(x=><option value={x} key={x}>{x}</option>)}</select><input type="number" min="1" value={qty} onChange={e=>setQty(Number(e.target.value)||1)}/><label className="r7-check"><input type="checkbox" checked={cold} onChange={e=>setCold(e.target.checked)}/> سلسلة تبريد</label></div></Panel><Panel title="النتائج المؤهلة"><Table h={['الترتيب','الشركة','الفرع','المحافظة','الصنف','سعر العقد','المتاح','Cold Chain','إجراء']} r={results.map((r:any,i:number)=>[i+1,r.organization?.name||'—',r.branch.name,r.branch.governorate,r.offer.item_name,`${fmt(r.offer.contract_price)} ${r.offer.currency}`,r.offer.available_quantity??'—',r.branch.cold_chain_capable?'نعم':'لا',<button className="r7-small" onClick={()=>commit(r)}>اختيار</button>])}/></Panel><Panel title="طلبات التوجيه السابقة"><Table h={['الوقت','الطالب','المحافظة','الفئة','الكمية','الفرع','الحالة']} r={net.route_requests.map((x:any)=>[new Date(x.requested_at).toLocaleString('ar'),x.requester_name,x.governorate,x.category,x.quantity,net.branches.find((b:any)=>b.id===x.selected_branch_id)?.name||'—',x.status])}/></Panel></div>};
const Procurement=({business,managed}:any)=><div className="r7-grid"><Panel title="Farm Requirement → PO"><Table h={['الاحتياج','المزرعة','الصنف','الكمية','Owner','Finance','الحالة']} r={managed.requirements.map((x:any)=>[x.requirement_number||x.id,managed.farms.find((f:any)=>f.id===x.farm_id)?.name||x.farm_id,x.item_name,`${x.quantity} ${x.unit}`,x.owner_decision,x.finance_status,x.status])}/></Panel><Panel title="Purchase Orders"><Table h={['PO','المورد','المخزن','التاريخ','الحالة','المبلغ/العملات']} r={business.purchase_orders.map((x:any)=>[x.purchase_order_number,business.suppliers.find((s:any)=>s.id===x.supplier_id)?.name||x.supplier_id,business.warehouses.find((w:any)=>w.id===x.warehouse_id)?.name||x.warehouse_id,x.order_date,x.status,x.lines.map((l:any)=>`${l.unit_price} ${l.currency}`).join('، ')])}/></Panel><Panel title="Receiving / GRN"><Table h={['GRN','PO','تاريخ الوصول','المستلم','الحالة','فاتورة']} r={business.goods_receipts.map((x:any)=>[x.receipt_number,x.purchase_order_id,x.arrival_date,x.received_by,x.status,x.purchase_invoice_id||'—'])}/></Panel><Panel title="Section 12 / Financial Documents"><Table h={['المستند','النوع','التاريخ','العملة','المبلغ','الحالة','Journal']} r={business.financial_documents.map((x:any)=>[x.document_number,x.document_type,x.date,x.currency,fmt(x.original_amount),x.status,x.journal_entry_id||'Pending'])}/></Panel></div>;
const Communication=({managed,platform}:any)=><div className="r7-grid"><Panel title="التواصل والـ Handoffs"><Table h={['المجموعة','الفئة','المزرعة','السياسة','الحالة']} r={managed.chat_groups.map((x:any)=>[x.title,x.category,managed.farms.find((f:any)=>f.id===x.farm_id)?.name||'—',x.posting_policy,x.status])}/></Panel><Panel title="AI Governance"><ul className="r7-list"><li>AI: تحليل التشغيل والمخاطر والمقارنة والتوصية.</li><li>Supervisor: بوابة مراجعة قبل تحرير التقرير للتحليل.</li><li>Veterinarian: القرار النهائي للعلاج/اللقاح.</li><li>Consultant: رأي استشاري للحالات المصعدة.</li><li>LabReviewer: اعتماد النتائج المخبرية وفق الصلاحية.</li><li>Chat/voice/media remain linked to farm/flock/case context.</li></ul></Panel><Panel title="شبكة الموردين الحالية"><Table h={['المورد','الفئات','الهاتف','العقد','الحالة']} r={platform.suppliers.map((x:any)=>[x.name,x.categories.join('، '),x.phone,x.contract_number,x.status])}/></Panel></div>;
const About=({net}:any)=><div className="r7-grid"><Panel title="System Identity"><div className="r7-brand"><div className="r7-logo">AN</div><div><h2>{net.brand_name}</h2><p>{net.brand_name_ar}</p><b>Product Owner: {net.product_owner_name}</b><small>V20.2.9 · Windows/Web Control Center · R7 Consolidation</small></div></div></Panel><Panel title="سياسة التطوير"><ul className="r7-list"><li>لا حذف صامت للأقسام أو البيانات التاريخية.</li><li>كل إصدار جديد cumulative/additive.</li><li>إزالة التكرار تعني توحيد source of truth مع إبقاء سجل الترحيل.</li><li>Windows/Web هو المرجع الحالي؛ Android مؤجل.</li><li>الانتقال للقسم التالي بعد قبول مرئي End-to-End.</li></ul></Panel></div>;
const SearchBox=({q,setQ}:any)=><label className="r7-search"><Search/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="بحث..."/></label>;
