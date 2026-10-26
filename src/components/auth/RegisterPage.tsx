import React, { useState, type FormEvent } from 'react';

const SPECIALTIES = [
  ['FARM_WORKER', 'عامل مزرعة'], ['FARM_SUPERVISOR', 'مشرف مزرعة'],
  ['VETERINARIAN', 'طبيب بيطري'], ['VET_ASSISTANT', 'مساعد بيطري'],
  ['LAB_TECHNICIAN', 'فني مختبر'], ['ACCOUNTANT', 'محاسب'],
  ['FARM_MANAGER', 'مدير مزرعة'], ['FACTORY_MANAGER', 'مدير مصنع'],
  ['FACTORY_WORKER', 'عامل مصنع'], ['FACTORY_OWNER', 'مالك مصنع'],
  ['FARM_OWNER', 'مالك مزرعة'], ['OFFICE_MANAGER', 'مدير مكتب'],
  ['WAREHOUSE', 'مسؤول مخزن'], ['SALES', 'مبيعات'],
  ['TRANSPORT', 'نقل وسائقون'], ['PROCUREMENT', 'مشتريات'],
  ['OTHER', 'تخصص آخر'],
] as const;

type FormData = {display_name:string;username:string;email:string;password:string;confirmPassword:string;requested_department:string;requested_organization:string};
const initial:FormData = {display_name:'',username:'',email:'',password:'',confirmPassword:'',requested_department:'',requested_organization:''};

export default function RegisterPage({apiBaseUrl = '', onGoToLogin}:{apiBaseUrl?:string;onGoToLogin?:()=>void}) {
  const [form,setForm] = useState<FormData>(initial);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');
  const [success,setSuccess] = useState('');
  const set = (key:keyof FormData,value:string) => setForm(prev=>({...prev,[key]:value}));
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();setError('');setSuccess('');
    if(form.password!==form.confirmPassword){setError('كلمتا المرور غير متطابقتين.');return;}
    if(form.password.length<12){setError('يجب أن تتكون كلمة المرور من 12 حرفًا على الأقل.');return;}
    if(!form.requested_department){setError('يرجى اختيار التخصص.');return;}
    setLoading(true);
    try {
      const {confirmPassword,...payload} = form;
      const response = await fetch(`${apiBaseUrl}/api/registration/request`,{
        method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)
      });
      const result = await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(result.error==='registration_already_exists'?'اسم المستخدم أو البريد مسجل مسبقًا.':result.error==='invalid_registration_fields'?'يرجى مراجعة البيانات: اسم المستخدم إنجليزي (3–64 حرفًا) وكلمة المرور 12 حرفًا على الأقل.':result.error||'تعذر إرسال الطلب.');
      setSuccess('تم إرسال طلبك بنجاح. الحساب بانتظار موافقة مدير النظام، ولا يمكن تسجيل الدخول قبل الموافقة.');
      setForm(initial);
    } catch(e) {setError(e instanceof Error?e.message:'تعذر الاتصال بالخادم.');}
    finally {setLoading(false);}
  }
  const inputStyle:React.CSSProperties={width:'100%',boxSizing:'border-box',padding:'11px 12px',border:'1px solid #cbd5e1',borderRadius:9,font:'inherit',marginTop:5};
  return <main dir="rtl" style={{minHeight:'100vh',background:'#f1f5f9',padding:'40px 16px',fontFamily:'Tahoma,Arial,sans-serif',color:'#0f172a'}}>
    <section style={{maxWidth:540,margin:'auto',background:'white',padding:28,borderRadius:16,boxShadow:'0 8px 30px #0f172a12'}}>
      <h1 style={{marginTop:0}}>إنشاء حساب في AviNexus</h1>
      <p style={{color:'#475569'}}>تُراجع طلبات التسجيل من مدير النظام قبل تفعيل الحساب.</p>
      <form onSubmit={submit} style={{display:'grid',gap:15}}>
        <label>الاسم الكامل<input style={inputStyle} required minLength={2} maxLength={150} autoComplete="name" value={form.display_name} onChange={e=>set('display_name',e.target.value)}/></label>
        <label>اسم المستخدم (بالإنجليزية)<input style={inputStyle} required minLength={3} maxLength={64} pattern="[a-zA-Z0-9._-]{3,64}" autoComplete="username" value={form.username} onChange={e=>set('username',e.target.value)}/></label>
        <label>البريد الإلكتروني<input style={inputStyle} type="email" required autoComplete="email" value={form.email} onChange={e=>set('email',e.target.value)}/></label>
        <label>التخصص المطلوب<select style={inputStyle} required value={form.requested_department} onChange={e=>set('requested_department',e.target.value)}><option value="">اختر التخصص</option>{SPECIALTIES.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
        <label>اسم المؤسسة أو المزرعة أو المصنع<input style={inputStyle} maxLength={150} value={form.requested_organization} onChange={e=>set('requested_organization',e.target.value)} placeholder="اسم الجهة التي ترغب بالانضمام إليها"/></label>
        <label>كلمة المرور<input style={inputStyle} type="password" required minLength={12} maxLength={256} autoComplete="new-password" value={form.password} onChange={e=>set('password',e.target.value)}/></label>
        <label>تأكيد كلمة المرور<input style={inputStyle} type="password" required minLength={12} maxLength={256} autoComplete="new-password" value={form.confirmPassword} onChange={e=>set('confirmPassword',e.target.value)}/></label>
        {error&&<p role="alert" style={{color:'#b91c1c',margin:0}}>{error}</p>}
        {success&&<p role="status" style={{color:'#166534',margin:0}}>{success}</p>}
        <button type="submit" disabled={loading} style={{padding:13,border:0,borderRadius:9,background:'#14532d',color:'white',cursor:'pointer',font:'inherit',opacity:loading?.65:1}}>{loading?'جارٍ إرسال الطلب...':'إرسال طلب التسجيل'}</button>
      </form>
      {onGoToLogin&&<button type="button" onClick={onGoToLogin} style={{marginTop:15,background:'none',border:0,color:'#1d4ed8',cursor:'pointer',font:'inherit'}}>لديك حساب؟ تسجيل الدخول</button>}
    </section>
  </main>;
}
