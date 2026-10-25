import React, { useState } from 'react';
import { LockKeyhole, ShieldCheck, Loader2, AlertTriangle } from 'lucide-react';
import { apiService, EnterpriseAuthSessionV2027 } from '../../services/apiService';

interface Props {
  environment:string;
  bootstrapConfigured:boolean;
  initialError?:string;
  onAuthenticated:(session:EnterpriseAuthSessionV2027)=>void;
}

export const EnterpriseLoginV2027:React.FC<Props>=({environment,bootstrapConfigured,initialError,onAuthenticated})=>{
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState(initialError||'');
  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();setError('');setBusy(true);
    try{const session=await apiService.loginEnterpriseV2027(username,password);onAuthenticated(session);}catch(err){setError(err instanceof Error?err.message:'login_failed');}finally{setBusy(false);}
  };
  return <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4" dir="rtl">
    <div className="w-full max-w-md rounded-3xl border border-emerald-500/20 bg-slate-900/90 p-6 shadow-2xl">
      <div className="flex items-center gap-3"><div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"><ShieldCheck className="w-6 h-6 text-emerald-300"/></div><div><div className="text-[10px] font-black tracking-widest text-emerald-300">AVINEXUS POULTRY ENTERPRISE · V20.2.7</div><h1 className="text-xl font-black">الدخول المؤسسي الآمن</h1></div></div>
      <p className="mt-4 text-xs leading-6 text-slate-400">بيئة <b className="text-slate-200">{environment}</b> تتطلب هوية خادمية مصادقًا عليها. لا يتم اعتماد تبديل الحساب المحلي كحد أمني في بيئات التشغيل.</p>
      {!bootstrapConfigured&&<div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0"/>لم يتم العثور على بيانات دخول Bootstrap. يجب ضبط SPP_BOOTSTRAP_ADMIN_USER وSPP_BOOTSTRAP_ADMIN_PASSWORD في بيئة الخادم.</div>}
      <form onSubmit={submit} className="mt-5 space-y-3">
        <label className="block text-xs font-bold text-slate-300">اسم المستخدم<input value={username} onChange={e=>setUsername(e.target.value)} autoComplete="username" className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-emerald-500" required/></label>
        <label className="block text-xs font-bold text-slate-300">كلمة المرور<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-emerald-500" required/></label>
        {error&&<div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">{error}</div>}
        <button disabled={busy||!bootstrapConfigured} className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-4 py-3 font-black flex items-center justify-center gap-2">{busy?<Loader2 className="w-4 h-4 animate-spin"/>:<LockKeyhole className="w-4 h-4"/>}تسجيل الدخول</button>
      </form>
      <div className="mt-4 text-[10px] text-slate-500">Access token + rotating refresh session · device-bound session metadata · server-side RBAC/scope enforcement</div>
    </div>
  </div>;
};
