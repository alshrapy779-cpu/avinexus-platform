import React, { useCallback, useEffect, useMemo, useState } from 'react';
const defaultBranches = [{ id: 'BR-01', name: 'الفرع الرئيسي' }];
const defaultScopes = [{ id: 'SC-01', name: 'النطاق الشامل' }];


type Status='PENDING'|'APPROVED'|'REJECTED';
type Registration={id:string;user_id:string;username:string;display_name:string;email:string;requested_department:string;requested_organization:string;status:Status;created_at:string;reviewed_at?:string;reviewed_by?:string;rejection_reason?:string};
const departmentNames:Record<string,string>={FARM_WORKER:'عامل مزرعة',FARM_SUPERVISOR:'مشرف مزرعة',VETERINARIAN:'طبيب بيطري',VET_ASSISTANT:'مساعد بيطري',LAB_TECHNICIAN:'فني مختبر',ACCOUNTANT:'محاسب',FARM_MANAGER:'مدير مزرعة',FACTORY_MANAGER:'مدير مصنع',FACTORY_WORKER:'عامل مصنع',FACTORY_OWNER:'مالك مصنع',FARM_OWNER:'مالك مزرعة',OFFICE_MANAGER:'مدير مكتب',WAREHOUSE:'مسؤول مخزن',SALES:'مبيعات',TRANSPORT:'النقل',PROCUREMENT:'المشتريات',OTHER:'أخرى'};
const errors:Record<string,string>={authentication_required:'انتهت الجلسة أو لم يتم تسجيل الدخول.',system_owner_required:'هذه الصفحة متاحة لمالك النظام فقط.',active_scoped_identity_required_before_approval:'لا يمكن الموافقة قبل إنشاء هوية مؤسسية نشطة للمستخدم وربطها بدور ونطاق صلاحيات في إدارة الهويات.',already_reviewed:'تمت مراجعة هذا الطلب سابقًا.',credential_missing:'بيانات اعتماد المستخدم غير موجودة.'};
export default function AdminRegistrationDashboard({accessToken,apiBaseUrl='',onOpenIdentityManagement}:{accessToken:string;apiBaseUrl?:string;onOpenIdentityManagement?:(userId:string)=>void}){
  const [requests,setRequests]=useState<Registration[]>([]);
  const [selected,setSelected]=useState<Registration|null>(null);
  const [foundation,setFoundation]=useState<any>(null);
  const [role,setRole]=useState('');
  const [department,setDepartment]=useState('');
  const [scopeIds,setScopeIds]=useState<string[]>([]);
  const [scopeMode,setScopeMode]=useState<'existing'|'global'|'branches'>('existing');
  const [branchIds,setBranchIds]=useState<string[]>([]);
  const [creatingScope,setCreatingScope]=useState(false);
  const [savingIdentity,setSavingIdentity]=useState(false);
  const [identityId,setIdentityId]=useState('');
  async function openIdentity(r:Registration){
    setError('');setSelected(r);setRole('');setDepartment(r.requested_department||'');setScopeIds([]);setBranchIds([]);setScopeMode('existing');setIdentityId('');
    try{
      const response=await fetch(`${apiBaseUrl}/api/v20.2.1/foundation`,{headers:{Authorization:`Bearer ${accessToken}`},cache:'no-store'});
      const data=await response.json();if(!response.ok)throw new Error(data.error||'تعذر تحميل الأدوار والنطاقات.');
      setFoundation({...data.foundation,roles:data.roles||[],departments:data.departments||[],branches:data.branches||[]});
      console.info('[AviNexus identity] loaded foundation metadata', {
        roles:(data.roles||[]).length, departments:(data.departments||[]).length,
        scopes:(data.foundation?.scopes||[]).length
      });
      const existing=data.foundation?.identities?.find((x:any)=>x.user_id===r.user_id);
      if(existing){setIdentityId(existing.id);setRole(existing.role_code);setDepartment(existing.department_code);setScopeIds(existing.scope_ids||[]);}
    }catch(e){setError(e instanceof Error?e.message:'فشل تحميل الهوية');setSelected(null);}
  }
  async function readApi(response:Response){
    const raw=await response.text();
    let data:any={};
    try{data=raw?JSON.parse(raw):{};}catch{throw new Error(`استجابة غير صالحة من الخادم (${response.status}): ${raw.slice(0,200)}`);}
    if(!response.ok||data.success===false)throw new Error(
      `HTTP ${response.status}: ${String(data.error||data.message||'فشل الطلب')}`);
    return data;
  }
  async function saveIdentity(){
    if(!selected)return;
    if(!role||!department){
      const message='اختر الدور المؤسسي والقسم أولًا.';
      setError(message);window.alert(message);return;
    }
    if(scopeMode==='existing'&&!scopeIds.length){
      const message='اختر نطاق وصول واحدًا على الأقل، أو أنشئ نطاقًا مناسبًا.';
      setError(message);window.alert(message);return;
    }
    if(scopeMode==='branches'&&!branchIds.length){
      const message='اختر فرعًا واحدًا على الأقل قبل إنشاء نطاق الفروع.';
      setError(message);window.alert(message);return;
    }
    if(scopeMode==='global'&&!window.confirm('تنبيه أمني: النطاق الشامل يتيح الوصول إلى جميع الجهات التي يسمح بها الدور. هل تؤكد منحه لهذا المستخدم؟'))return;
    setSavingIdentity(true);setError('');setNotice('');
    try{
      let resolvedScopeIds=[...scopeIds];
      if(scopeMode!=='existing'){
        setCreatingScope(true);
        const scopePayload={
          code:`REG_${scopeMode.toUpperCase()}_${selected.user_id.replace(/[^a-zA-Z0-9_-]/g,'_')}`,
          name:scopeMode==='global'?`نطاق شامل للمستخدم ${selected.display_name}`:`فروع المستخدم ${selected.display_name}`,
          type:scopeMode==='global'?'global':'branch',
          branch_ids:scopeMode==='branches'?branchIds:[],
          farm_ids:[],flock_ids:[],inherits_scope_ids:[],active:true
        };
        console.info('[AviNexus identity] scope creation request',scopePayload);
        const scopeResponse=await fetch(`${apiBaseUrl}/api/v20.2.1/scopes`,{
          method:'POST',headers:{Authorization:`Bearer ${accessToken}`,'Content-Type':'application/json'},
          credentials:'same-origin',body:JSON.stringify(scopePayload)
        });
        const scopeData=await readApi(scopeResponse);
        const scope=scopeData.scope;
        if(!scope?.id)throw new Error('الخادم لم يُرجع معرف نطاق الوصول بعد إنشائه.');
        resolvedScopeIds=[scope.id];
        setScopeIds(resolvedScopeIds);
        setCreatingScope(false);
      }
      const payload={
        ...(identityId?{id:identityId}:{}),
        user_id:selected.user_id,display_name:selected.display_name,
        role_code:role,department_code:department,scope_ids:resolvedScopeIds,
        branch_ids:scopeMode==='branches'?branchIds:[],
        permission_allow:[],permission_deny:[],active:true,
        locale:'ar',timezone:'Asia/Aden'
      };
      console.info('[AviNexus identity] saving role, department and scope IDs',{
        user_id:payload.user_id,role_code:role,department_code:department,
        scope_ids:resolvedScopeIds,branch_ids:payload.branch_ids
      });
      const response=await fetch(`${apiBaseUrl}/api/v20.2.1/identities`,{
        method:'POST',headers:{Authorization:`Bearer ${accessToken}`,'Content-Type':'application/json'},
        credentials:'same-origin',body:JSON.stringify(payload)
      });
      const data=await readApi(response);
      if(!data.identity?.id)throw new Error('لم يُرجع الخادم تأكيد الهوية المحفوظة.');
      setSelected(null);
      setNotice('تم حفظ الهوية المؤسسية والصلاحيات. يمكنك الآن الموافقة على الطلب.');
      console.info('[AviNexus identity] saved successfully',data.identity.id);
    }catch(e){
      const message=e instanceof Error?e.message:'فشل حفظ الهوية المؤسسية.';
      console.error('[AviNexus identity] save failed',e);
      setError(message);
      window.alert(`تعذر حفظ الهوية والصلاحيات:\n${message}`);
    }finally{setSavingIdentity(false);setCreatingScope(false);}
  }
  const [loading,setLoading]=useState(true);
  const [busyId,setBusyId]=useState('');
  const [filter,setFilter]=useState<'ALL'|Status>('PENDING');
  const [search,setSearch]=useState('');
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const load=useCallback(async()=>{
    setLoading(true);setError('');
    try{
      if(!accessToken)throw new Error('لا توجد جلسة مدير نشطة. سجّل الدخول بحساب مالك النظام.');
      const response=await fetch(`${apiBaseUrl}/api/registration/requests`,{headers:{Authorization:`Bearer ${accessToken}`,Accept:'application/json'},cache:'no-store',credentials:'same-origin'});
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(errors[data.error]||data.error||'تعذر تحميل الطلبات.');
      setRequests(Array.isArray(data.requests)?data.requests:[]);
    }catch(e){setError(e instanceof Error?e.message:'خطأ في الاتصال.');}
    finally{setLoading(false);}
  },[accessToken,apiBaseUrl]);
  useEffect(()=>{void load();},[load]);
  const filtered=useMemo(()=>requests.filter(r=>(filter==='ALL'||r.status===filter)&&[r.display_name,r.username,r.email,r.requested_department,r.requested_organization].join(' ').toLowerCase().includes(search.toLowerCase())),[requests,filter,search]);
  async function decide(r:Registration,decision:'APPROVED'|'REJECTED'){
    let reason='';
    if(decision==='REJECTED'){
      const entered=window.prompt(`سبب رفض طلب ${r.display_name}:`);
      if(entered===null)return;
      reason=entered.trim();
      if(!reason){setError('يرجى إدخال سبب الرفض.');return;}
    }else if(!window.confirm(`هل تؤكد الموافقة على طلب ${r.display_name}؟ يجب أن تكون هويته المؤسسية ونطاق صلاحياته قد أُنشئا مسبقًا.`))return;
    setBusyId(r.id);setError('');setNotice('');
    try{
      const response=await fetch(`${apiBaseUrl}/api/registration/requests/${encodeURIComponent(r.id)}/decision`,{method:'POST',headers:{Authorization:`Bearer ${accessToken}`,'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({decision,reason})});
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(errors[data.error]||data.error||'تعذرت معالجة الطلب.');
      await load();
      setNotice(decision==='APPROVED'?'تمت الموافقة وتفعيل بيانات اعتماد المستخدم.':'تم رفض الطلب.');
    }catch(e){setError(e instanceof Error?e.message:'خطأ في الاتصال.');}
    finally{setBusyId('');}
  }
  const button:React.CSSProperties={border:0,borderRadius:7,padding:'9px 12px',cursor:'pointer',font:'inherit'};
  return <main dir="rtl" style={{minHeight:'100vh',padding:24,background:'#f1f5f9',fontFamily:'Tahoma,Arial,sans-serif',color:'#0f172a'}}>
    <div style={{maxWidth:1200,margin:'auto'}}>
      <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}><div><h1>إدارة طلبات تسجيل المستخدمين</h1><p>الموافقة النهائية تتطلب هوية مؤسسية نشطة ونطاق وصول محددًا.</p></div><button style={{...button,background:'#0f766e',color:'white'}} onClick={()=>void load()} disabled={loading}>تحديث الطلبات</button></header>
      <section style={{display:'flex',gap:12,flexWrap:'wrap',margin:'20px 0'}}>{(['PENDING','APPROVED','REJECTED'] as const).map(status=><div key={status} style={{background:'white',borderRadius:10,padding:16,minWidth:135}}><strong>{status==='PENDING'?'قيد الانتظار':status==='APPROVED'?'مقبولة':'مرفوضة'}</strong><div style={{fontSize:25}}>{requests.filter(r=>r.status===status).length}</div></div>)}</section>
      <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:16}}><input aria-label="البحث في الطلبات" placeholder="ابحث بالاسم أو البريد أو الجهة" value={search} onChange={e=>setSearch(e.target.value)} style={{padding:11,borderRadius:8,border:'1px solid #cbd5e1',flex:'1 1 250px'}}/><select aria-label="حالة الطلب" value={filter} onChange={e=>setFilter(e.target.value as typeof filter)} style={{padding:11,borderRadius:8}}><option value="ALL">جميع الطلبات</option><option value="PENDING">بانتظار الموافقة</option><option value="APPROVED">مقبولة</option><option value="REJECTED">مرفوضة</option></select></div>
      {error&&<p role="alert" style={{color:'#b91c1c'}}>{error}</p>}{notice&&<p role="status" style={{color:'#166534'}}>{notice}</p>}
      {loading?<p role="status">جارٍ تحميل الطلبات من الخادم...</p>:<div style={{overflowX:'auto',background:'white',borderRadius:12}}><table style={{width:'100%',borderCollapse:'collapse',textAlign:'right',minWidth:850}}><thead><tr style={{background:'#e2e8f0'}}>{['المستخدم','البريد الإلكتروني','التخصص','الجهة','تاريخ الطلب','الحالة','الإجراءات'].map(h=><th key={h} style={{padding:12}}>{h}</th>)}</tr></thead><tbody>{filtered.map(r=><tr key={r.id} style={{borderBottom:'1px solid #e2e8f0'}}><td style={{padding:12}}><strong>{r.display_name}</strong><div style={{color:'#64748b'}}>{r.username}</div></td><td style={{padding:12}}>{r.email}</td><td style={{padding:12}}>{departmentNames[r.requested_department]||r.requested_department||'—'}</td><td style={{padding:12}}>{r.requested_organization||'—'}</td><td style={{padding:12}}>{new Date(r.created_at).toLocaleString('ar')}</td><td style={{padding:12}}>{r.status==='PENDING'?'بانتظار الموافقة':r.status==='APPROVED'?'مقبول':'مرفوض'}{r.rejection_reason&&<div style={{color:'#b91c1c'}}>{r.rejection_reason}</div>}</td><td style={{padding:12}}>{r.status==='PENDING'?<div style={{display:'flex',gap:6,flexWrap:'wrap'}}><button style={{...button,background:'#dbeafe'}} onClick={()=>void openIdentity(r)}>تحديد الهوية والصلاحيات</button><button disabled={!!busyId} style={{...button,background:'#166534',color:'white'}} onClick={()=>void decide(r,'APPROVED')}>موافقة</button><button disabled={!!busyId} style={{...button,background:'#fee2e2',color:'#991b1b'}} onClick={()=>void decide(r,'REJECTED')}>رفض</button></div>:'—'}</td></tr>)}{filtered.length===0&&<tr><td colSpan={7} style={{padding:25,textAlign:'center'}}>لا توجد طلبات مطابقة.</td></tr>}</tbody></table></div>}
      {selected&&<div role="dialog" aria-modal="true" aria-label="تحديد الهوية والصلاحيات" style={{position:'fixed',inset:0,background:'rgba(0,0,0,.65)',display:'grid',placeItems:'center',zIndex:9999,padding:15}}>
        <div style={{background:'white',borderRadius:14,padding:22,width:'min(100%,560px)',maxHeight:'90vh',overflowY:'auto'}}>
          <h2>هوية وصلاحيات: {selected.display_name}</h2>
          <p>تُحفظ الهوية أولًا، ثم تُعتمد الموافقة من قائمة الطلبات.</p>
          <label style={{display:'block',marginTop:12}}>الدور المؤسسي</label>
          <select style={{width:'100%',padding:10}} value={role} onChange={e=>{const next=e.target.value;setRole(next);const matching=(foundation?.roles||[]).find((x:any)=>x.code===next);if(matching?.department_code)setDepartment(matching.department_code);}}><option value="">اختر الدور</option>{(foundation?.roles||[]).filter((x:any)=>x.active!==false&&x.code!=='SYSTEM_OWNER').map((x:any)=><option key={x.id} value={x.code}>{x.name} ({x.code})</option>)}</select>
          <label style={{display:'block',marginTop:12}}>القسم</label>
          <select style={{width:'100%',padding:10}} value={department} onChange={e=>setDepartment(e.target.value)}><option value="">اختر القسم</option>{(foundation?.departments||[]).filter((x:any)=>x.active!==false).map((x:any)=><option key={x.id} value={x.code}>{x.name}</option>)}</select>
          <label style={{display:'block',marginTop:12}}>نطاق الوصول</label>
          <select aria-label="طريقة تحديد نطاق الوصول" style={{width:'100%',padding:10}} value={scopeMode} onChange={e=>setScopeMode(e.target.value as typeof scopeMode)}>
            <option value="existing">اختيار نطاق موجود</option>
            <option value="branches">إنشاء نطاق لفروع محددة</option>
            <option value="global">إنشاء نطاق شامل (صلاحية واسعة)</option>
          </select>
          {scopeMode==='existing'&&<div style={{maxHeight:180,overflowY:'auto',border:'1px solid #cbd5e1',padding:10}}>
            {(foundation?.scopes||[]).filter((x:any)=>x.active!==false).map((x:any)=><label key={x.id} style={{display:'block',padding:5}}>
              <input type="checkbox" checked={scopeIds.includes(x.id)} onChange={e=>setScopeIds(old=>e.target.checked?[...old,x.id]:old.filter(v=>v!==x.id))}/> {x.name} ({x.type})
            </label>)}
            {!(foundation?.scopes||[]).some((x:any)=>x.active!==false)&&<p>لا توجد نطاقات محفوظة. اختر إنشاء نطاق فروع أو نطاق شامل عند الضرورة.</p>}
          </div>}
          {scopeMode==='branches'&&<div style={{maxHeight:180,overflowY:'auto',border:'1px solid #cbd5e1',padding:10}}>
            {(foundation?.branches||[]).filter((x:any)=>x.active!==false).map((x:any)=><label key={x.id} style={{display:'block',padding:5}}>
              <input type="checkbox" checked={branchIds.includes(x.id)} onChange={e=>setBranchIds(old=>e.target.checked?[...old,x.id]:old.filter(v=>v!==x.id))}/> {x.name} ({x.code})
            </label>)}
            {!(foundation?.branches||[]).length&&<p>لا توجد فروع متاحة في بيانات المؤسسة. يجب إنشاء الفروع أولًا.</p>}
          </div>}
          {scopeMode==='global'&&<p style={{color:'#9a3412'}}>تنبيه: هذا النطاق يشمل جميع المواقع، ويجب منحه فقط للأدوار المخولة بذلك.</p>}
          {error&&<p role="alert" style={{color:'#b91c1c',whiteSpace:'pre-wrap'}}>{error}</p>}
          <div style={{display:'flex',gap:10,marginTop:18}}><button style={{...button,background:'#166534',color:'white'}} disabled={savingIdentity||!foundation} onClick={()=>void saveIdentity()}>{savingIdentity?(creatingScope?'جارٍ إنشاء النطاق':'جارٍ حفظ الهوية'):'حفظ الهوية والصلاحيات'}</button><button style={button} onClick={()=>setSelected(null)}>إلغاء</button></div>
        </div>
      </div>}
    </div>
  </main>;
}
