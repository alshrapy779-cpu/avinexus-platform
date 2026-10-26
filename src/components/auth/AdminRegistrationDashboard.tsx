import React, { useCallback, useEffect, useMemo, useState } from 'react';

type Status='PENDING'|'APPROVED'|'REJECTED';
type Registration={id:string;user_id:string;username:string;display_name:string;email:string;requested_department:string;requested_organization:string;status:Status;created_at:string;reviewed_at?:string;reviewed_by?:string;rejection_reason?:string};
const departmentNames:Record<string,string>={FARM_WORKER:'عامل مزرعة',FARM_SUPERVISOR:'مشرف مزرعة',VETERINARIAN:'طبيب بيطري',VET_ASSISTANT:'مساعد بيطري',LAB_TECHNICIAN:'فني مختبر',ACCOUNTANT:'محاسب',FARM_MANAGER:'مدير مزرعة',FACTORY_MANAGER:'مدير مصنع',FACTORY_WORKER:'عامل مصنع',FACTORY_OWNER:'مالك مصنع',FARM_OWNER:'مالك مزرعة',OFFICE_MANAGER:'مدير مكتب',WAREHOUSE:'مسؤول مخزن',SALES:'مبيعات',TRANSPORT:'النقل',PROCUREMENT:'المشتريات',OTHER:'أخرى'};
const errors:Record<string,string>={authentication_required:'انتهت الجلسة أو لم يتم تسجيل الدخول.',system_owner_required:'هذه الصفحة متاحة لمالك النظام فقط.',active_scoped_identity_required_before_approval:'لا يمكن الموافقة قبل إنشاء هوية مؤسسية نشطة للمستخدم وربطها بدور ونطاق صلاحيات في إدارة الهويات.',already_reviewed:'تمت مراجعة هذا الطلب سابقًا.',credential_missing:'بيانات اعتماد المستخدم غير موجودة.'};
export default function AdminRegistrationDashboard({accessToken,apiBaseUrl='',onOpenIdentityManagement}:{accessToken:string;apiBaseUrl?:string;onOpenIdentityManagement?:(userId:string)=>void}){
  const [requests,setRequests]=useState<Registration[]>([]);
  const [loading,setLoading]=useState(true);
  const [busyId,setBusyId]=useState('');
  const [filter,setFilter]=useState<'ALL'|Status>('PENDING');
  const [search,setSearch]=useState('');
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const load=useCallback(async()=>{
    setLoading(true);setError('');
    try{
      const response=await fetch(`${apiBaseUrl}/api/registration/requests`,{headers:{Authorization:`Bearer ${accessToken}`},cache:'no-store'});
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
      const response=await fetch(`${apiBaseUrl}/api/registration/requests/${encodeURIComponent(r.id)}/decision`,{method:'POST',headers:{Authorization:`Bearer ${accessToken}`,'Content-Type':'application/json'},body:JSON.stringify({decision,reason})});
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(errors[data.error]||data.error||'تعذرت معالجة الطلب.');
      setRequests(prev=>prev.map(item=>item.id===r.id?data.request:item));
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
      {loading?<p>جارٍ تحميل الطلبات...</p>:<div style={{overflowX:'auto',background:'white',borderRadius:12}}><table style={{width:'100%',borderCollapse:'collapse',textAlign:'right',minWidth:850}}><thead><tr style={{background:'#e2e8f0'}}>{['المستخدم','البريد الإلكتروني','التخصص','الجهة','تاريخ الطلب','الحالة','الإجراءات'].map(h=><th key={h} style={{padding:12}}>{h}</th>)}</tr></thead><tbody>{filtered.map(r=><tr key={r.id} style={{borderBottom:'1px solid #e2e8f0'}}><td style={{padding:12}}><strong>{r.display_name}</strong><div style={{color:'#64748b'}}>{r.username}</div></td><td style={{padding:12}}>{r.email}</td><td style={{padding:12}}>{departmentNames[r.requested_department]||r.requested_department||'—'}</td><td style={{padding:12}}>{r.requested_organization||'—'}</td><td style={{padding:12}}>{new Date(r.created_at).toLocaleString('ar')}</td><td style={{padding:12}}>{r.status==='PENDING'?'بانتظار الموافقة':r.status==='APPROVED'?'مقبول':'مرفوض'}{r.rejection_reason&&<div style={{color:'#b91c1c'}}>{r.rejection_reason}</div>}</td><td style={{padding:12}}>{r.status==='PENDING'?<div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{onOpenIdentityManagement&&<button style={{...button,background:'#dbeafe'}} onClick={()=>onOpenIdentityManagement(r.user_id)}>تحديد الهوية والصلاحيات</button>}<button disabled={!!busyId} style={{...button,background:'#166534',color:'white'}} onClick={()=>void decide(r,'APPROVED')}>موافقة</button><button disabled={!!busyId} style={{...button,background:'#fee2e2',color:'#991b1b'}} onClick={()=>void decide(r,'REJECTED')}>رفض</button></div>:'—'}</td></tr>)}{filtered.length===0&&<tr><td colSpan={7} style={{padding:25,textAlign:'center'}}>لا توجد طلبات مطابقة.</td></tr>}</tbody></table></div>}
    </div>
  </main>;
}
