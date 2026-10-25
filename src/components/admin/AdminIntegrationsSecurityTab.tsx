import React, { useMemo, useState } from 'react';
import {
  BellRing,
  CheckCircle2,
  CloudCog,
  DatabaseBackup,
  FileClock,
  KeyRound,
  Landmark,
  LockKeyhole,
  RefreshCw,
  Save,
  ServerCog,
  ShieldCheck,
  Smartphone,
  TriangleAlert,
  WalletCards,
  WifiOff
} from 'lucide-react';
import {
  AdminAuditLogEntry,
  IntegrationConnectionStatus,
  PaymentProviderIntegrationSettings,
  SmartOperationsState,
  SystemHealthItem
} from '../../types';

interface AdminIntegrationsSecurityTabProps {
  operations: SmartOperationsState;
  onUpdateOperations: (operations: SmartOperationsState) => void;
}

type SubTab = 'integrations' | 'security' | 'approvals' | 'health' | 'backup' | 'templates' | 'audit';

const statusLabel: Record<IntegrationConnectionStatus, string> = {
  not_configured: 'غير مهيأ',
  configured: 'مهيأ',
  testing: 'جاري الفحص',
  connected: 'متصل',
  error: 'خطأ'
};

const statusClass: Record<IntegrationConnectionStatus, string> = {
  not_configured: 'bg-slate-800 text-slate-400 border-slate-700',
  configured: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  testing: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
  connected: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  error: 'bg-rose-500/10 text-rose-300 border-rose-500/30'
};

const healthLabel: Record<SystemHealthItem['status'], string> = {
  healthy: 'سليم',
  warning: 'يحتاج متابعة',
  offline: 'متوقف',
  not_connected: 'غير مربوط'
};

const healthClass: Record<SystemHealthItem['status'], string> = {
  healthy: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
  warning: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
  offline: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
  not_connected: 'text-slate-400 bg-slate-800/70 border-slate-700'
};

export const AdminIntegrationsSecurityTab: React.FC<AdminIntegrationsSecurityTabProps> = ({ operations, onUpdateOperations }) => {
  const [activeTab, setActiveTab] = useState<SubTab>('integrations');

  const appendAudit = (action: string, module: string, details: string, result: AdminAuditLogEntry['result'] = 'success') => {
    const entry: AdminAuditLogEntry = {
      id: `audit-${Date.now()}`,
      created_at: new Date().toISOString(),
      actor_name: 'المدير العام',
      actor_role: 'System Owner',
      action,
      module,
      result,
      details
    };
    return [entry, ...operations.audit_log].slice(0, 250);
  };

  const updateFcm = (field: string, value: string | boolean) => {
    onUpdateOperations({
      ...operations,
      integrations: {
        ...operations.integrations,
        fcm: { ...operations.integrations.fcm, [field]: value }
      }
    });
  };

  const checkFcmReadiness = () => {
    const fcm = operations.integrations.fcm;
    const ready = Boolean(fcm.project_id.trim() && fcm.backend_endpoint?.trim());
    onUpdateOperations({
      ...operations,
      integrations: {
        ...operations.integrations,
        fcm: {
          ...fcm,
          connection_status: ready ? 'configured' : 'not_configured',
          last_tested_at: new Date().toISOString(),
          last_test_message: ready
            ? 'إعدادات الواجهة مكتملة. الاتصال الحقيقي يحتاج Backend مزوداً بـ Firebase Admin SDK.'
            : 'أدخل Project ID ورابط Backend قبل اختبار الربط.'
        }
      },
      audit_log: appendAudit(
        'فحص جاهزية FCM',
        'الإشعارات',
        ready ? 'اكتملت بيانات الربط غير السرية؛ ما زال اختبار الخادم الفعلي مطلوباً.' : 'بيانات FCM غير مكتملة.',
        ready ? 'success' : 'warning'
      )
    });
  };

  const updatePaymentProvider = (id: string, patch: Partial<PaymentProviderIntegrationSettings>) => {
    onUpdateOperations({
      ...operations,
      integrations: {
        ...operations.integrations,
        payment_providers: operations.integrations.payment_providers.map((item) => item.id === id ? { ...item, ...patch } : item)
      }
    });
  };

  const testPaymentProvider = (id: string) => {
    const provider = operations.integrations.payment_providers.find((item) => item.id === id);
    if (!provider) return;
    const ready = provider.mode === 'manual_verification' || Boolean(provider.api_base_url?.trim());
    onUpdateOperations({
      ...operations,
      integrations: {
        ...operations.integrations,
        payment_providers: operations.integrations.payment_providers.map((item) => item.id === id ? {
          ...item,
          connection_status: item.mode === 'manual_verification' ? 'configured' : ready ? 'configured' : 'not_configured',
          last_tested_at: new Date().toISOString()
        } : item)
      },
      audit_log: appendAudit(
        `فحص بوابة ${provider.provider}`,
        'المدفوعات',
        provider.mode === 'manual_verification'
          ? 'مسار التحقق اليدوي جاهز: تحويل + صورة إثبات + اعتماد المالية.'
          : ready ? 'عنوان API مسجل؛ الاتصال الحقيقي يتطلب مفاتيح خادمية رسمية.' : 'عنوان API غير مسجل.',
        ready ? 'success' : 'warning'
      )
    });
  };

  const updateAuth = (field: string, value: string | boolean | number) => {
    onUpdateOperations({
      ...operations,
      integrations: {
        ...operations.integrations,
        auth_security: { ...operations.integrations.auth_security, [field]: value }
      }
    });
  };

  const saveAuthPolicy = () => {
    const auth = operations.integrations.auth_security;
    const productionReady = auth.provider !== 'local_prototype' && auth.backend_rbac_enforced;
    onUpdateOperations({
      ...operations,
      integrations: {
        ...operations.integrations,
        auth_security: {
          ...auth,
          connection_status: productionReady ? 'configured' : 'not_configured'
        }
      },
      audit_log: appendAudit(
        'حفظ سياسة الدخول والصلاحيات',
        'الأمان وRBAC',
        productionReady ? 'تم تحديد مزود مصادقة مع فرض RBAC خادمي.' : 'الإعداد ما يزال في وضع النموذج المحلي؛ لا يعد حماية إنتاجية.',
        productionReady ? 'success' : 'warning'
      )
    });
  };

  const updateApproval = (field: keyof SmartOperationsState['approval_workflows'], value: boolean | number) => {
    onUpdateOperations({
      ...operations,
      approval_workflows: { ...operations.approval_workflows, [field]: value }
    });
  };

  const runLocalBackup = () => {
    onUpdateOperations({
      ...operations,
      backup_sync: {
        ...operations.backup_sync,
        last_backup_at: new Date().toISOString(),
        backup_status: 'ok'
      },
      audit_log: appendAudit('إنشاء نقطة نسخ احتياطي', 'النسخ الاحتياطي', 'تم تسجيل نقطة نسخ احتياطي في النموذج. الربط بسحابة/خادم يتم عند تجهيز Backend.')
    });
  };

  const syncNow = () => {
    onUpdateOperations({
      ...operations,
      backup_sync: {
        ...operations.backup_sync,
        pending_sync_items: 0,
        last_sync_at: new Date().toISOString()
      },
      audit_log: appendAudit('مزامنة يدوية', 'المزامنة', 'تمت تصفية طابور المزامنة المحلي. المزامنة المركزية الفعلية تتطلب قاعدة بيانات وBackend.')
    });
  };

  const updateTemplate = (id: string, field: 'title' | 'body' | 'active', value: string | boolean) => {
    onUpdateOperations({
      ...operations,
      notification_templates: operations.notification_templates.map((item) => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const healthCounts = useMemo(() => ({
    healthy: operations.system_health.filter((item) => item.status === 'healthy').length,
    attention: operations.system_health.filter((item) => item.status !== 'healthy').length
  }), [operations.system_health]);

  const tabs: { id: SubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'integrations', label: 'التكاملات', icon: <CloudCog className="w-4 h-4" /> },
    { id: 'security', label: 'الدخول وRBAC', icon: <KeyRound className="w-4 h-4" /> },
    { id: 'approvals', label: 'الموافقات', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'health', label: 'حالة الأنظمة', icon: <ServerCog className="w-4 h-4" /> },
    { id: 'backup', label: 'النسخ والمزامنة', icon: <DatabaseBackup className="w-4 h-4" /> },
    { id: 'templates', label: 'قوالب التنبيهات', icon: <BellRing className="w-4 h-4" /> },
    { id: 'audit', label: 'سجل التدقيق', icon: <FileClock className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-cyan-950/70 via-slate-950 to-emerald-950/60 border border-cyan-700/40 rounded-3xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300"><ServerCog className="w-6 h-6" /></div>
            <div>
              <div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-black text-white">مركز التكاملات والأمان</h3><span className="text-[10px] px-2 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30">مدير عام فقط</span></div>
              <p className="text-xs text-slate-300 mt-1 max-w-4xl leading-relaxed">تبقى هنا إعدادات FCM، ربط الكريمي/جيب، والمصادقة وRBAC. لا يتم حفظ مفاتيح Firebase أو أسرار البنوك داخل تطبيق Android؛ المفاتيح الحساسة مكانها Backend فقط.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 shrink-0 text-center">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2"><div className="text-[10px] text-slate-500">أنظمة سليمة</div><div className="text-xl font-black text-emerald-300">{healthCounts.healthy}</div></div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2"><div className="text-[10px] text-slate-500">تحتاج ربط/متابعة</div><div className="text-xl font-black text-amber-300">{healthCounts.attention}</div></div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`shrink-0 px-3 py-2 rounded-xl border text-[11px] font-black flex items-center gap-2 ${activeTab === tab.id ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-900 text-slate-300 border-slate-800'}`}>{tab.icon}{tab.label}</button>)}
      </div>

      {activeTab === 'integrations' && <div className="grid xl:grid-cols-2 gap-4">
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Smartphone className="w-5 h-5 text-cyan-300" /><div><div className="text-sm font-black text-white">Push Notifications — FCM</div><div className="text-[10px] text-slate-500">الربط الفعلي يتم عبر Backend + Firebase Admin SDK</div></div></div><span className={`text-[10px] px-2 py-1 rounded-full border ${statusClass[operations.integrations.fcm.connection_status]}`}>{statusLabel[operations.integrations.fcm.connection_status]}</span></div>
          <label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={operations.integrations.fcm.enabled} onChange={(e) => updateFcm('enabled', e.target.checked)} className="accent-cyan-500" /> تفعيل الإشعارات عند اكتمال الربط</label>
          <div className="grid sm:grid-cols-2 gap-2"><input value={operations.integrations.fcm.project_id} onChange={(e) => updateFcm('project_id', e.target.value)} placeholder="Firebase Project ID" className="bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white" /><input value={operations.integrations.fcm.sender_id || ''} onChange={(e) => updateFcm('sender_id', e.target.value)} placeholder="Sender ID (غير سري)" className="bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white" /></div>
          <input value={operations.integrations.fcm.backend_endpoint || ''} onChange={(e) => updateFcm('backend_endpoint', e.target.value)} placeholder="https://api.example.com/notifications" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white direction-ltr" />
          <div className="flex gap-2"><button onClick={checkFcmReadiness} className="px-3 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold flex items-center gap-2"><RefreshCw className="w-4 h-4" />فحص الجاهزية</button></div>
          {operations.integrations.fcm.last_test_message && <div className="text-[10px] bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-300">{operations.integrations.fcm.last_test_message}</div>}
          <div className="text-[10px] text-amber-200 bg-amber-950/20 border border-amber-900/40 rounded-xl p-3"><strong>ممنوع:</strong> وضع Service Account JSON أو Server Key داخل الكود أو APK.</div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2"><WalletCards className="w-5 h-5 text-emerald-300" /><div><div className="text-sm font-black text-white">بوابات الدفع والمحافظ</div><div className="text-[10px] text-slate-500">التحقق اليدوي يعمل الآن؛ API مباشر عند توفره رسمياً</div></div></div>
          {operations.integrations.payment_providers.map((provider) => <div key={provider.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><Landmark className="w-4 h-4 text-emerald-300" /><span className="text-xs font-black text-white">{provider.provider}</span></div><span className={`text-[10px] px-2 py-1 rounded-full border ${statusClass[provider.connection_status]}`}>{statusLabel[provider.connection_status]}</span></div>
            <div className="grid sm:grid-cols-2 gap-2"><select value={provider.mode} onChange={(e) => updatePaymentProvider(provider.id, { mode: e.target.value as PaymentProviderIntegrationSettings['mode'] })} className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"><option value="manual_verification">تحقق يدوي بالحوالة</option><option value="api">API مباشر</option></select><label className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 text-xs text-slate-300"><input type="checkbox" checked={provider.enabled} onChange={(e) => updatePaymentProvider(provider.id, { enabled: e.target.checked })} className="accent-emerald-500" /> مفعل</label></div>
            {provider.mode === 'api' && <><input value={provider.api_base_url || ''} onChange={(e) => updatePaymentProvider(provider.id, { api_base_url: e.target.value })} placeholder="API Base URL" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" /><input value={provider.merchant_reference || ''} onChange={(e) => updatePaymentProvider(provider.id, { merchant_reference: e.target.value })} placeholder="Merchant Reference (غير سري)" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white" /></>}
            <button onClick={() => testPaymentProvider(provider.id)} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold">فحص الإعداد</button>
            {provider.note && <div className="text-[10px] text-slate-500">{provider.note}</div>}
          </div>)}
        </section>
      </div>}

      {activeTab === 'security' && <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-start gap-3"><LockKeyhole className="w-6 h-6 text-rose-300" /><div><div className="text-sm font-black text-white">تسجيل الدخول الآمن وBackend RBAC</div><p className="text-[11px] text-slate-400 mt-1">هذه الإعدادات تحدد سياسة الأمان المستهدفة. الواجهة وحدها لا تستطيع فرض RBAC آمناً دون خادم مصادقة.</p></div></div>
        <div className="grid md:grid-cols-3 gap-3">
          <label className="space-y-1"><span className="text-[10px] text-slate-400">مزود المصادقة</span><select value={operations.integrations.auth_security.provider} onChange={(e) => updateAuth('provider', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"><option value="local_prototype">Local Prototype</option><option value="firebase_auth">Firebase Auth</option><option value="custom_backend">Custom Backend</option></select></label>
          <label className="space-y-1"><span className="text-[10px] text-slate-400">انتهاء الجلسة/دقيقة</span><input type="number" min={5} value={operations.integrations.auth_security.session_timeout_minutes} onChange={(e) => updateAuth('session_timeout_minutes', Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white" /></label>
          <label className="space-y-1"><span className="text-[10px] text-slate-400">محاولات الدخول الفاشلة</span><input type="number" min={3} value={operations.integrations.auth_security.max_failed_login_attempts} onChange={(e) => updateAuth('max_failed_login_attempts', Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white" /></label>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-2 text-xs">
          {[
            ['backend_rbac_enforced','فرض RBAC من الخادم'],
            ['require_mfa_for_admins','MFA للمديرين'],
            ['require_strong_passwords','كلمات مرور قوية'],
            ['audit_login_events','تسجيل أحداث الدخول']
          ].map(([field,label]) => <label key={field} className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-300"><input type="checkbox" checked={Boolean((operations.integrations.auth_security as any)[field])} onChange={(e) => updateAuth(field, e.target.checked)} className="accent-rose-500" /> {label}</label>)}
        </div>
        <button onClick={saveAuthPolicy} className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-black flex items-center gap-2"><Save className="w-4 h-4" />حفظ سياسة الأمان</button>
      </section>}

      {activeTab === 'approvals' && <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div><div className="text-sm font-black text-white">محرك الموافقات الإدارية</div><div className="text-[11px] text-slate-500 mt-1">يمنع تغييرات حساسة من المرور دون مراجعة إدارية محددة.</div></div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {[
            ['price_changes_require_approval','تغييرات أسعار الأصناف'],
            ['exchange_rate_changes_require_approval','تغيير أسعار الصرف'],
            ['zone_fee_changes_require_approval','تعديل أجور المناطق'],
            ['payment_account_changes_require_approval','تعديل حسابات التحويل'],
            ['antibiotic_override_requires_vet','أي تجاوز للمضاد يحتاج طبيب'],
            ['high_value_payment_requires_second_approver','دفعات كبيرة تحتاج معتمد ثانٍ']
          ].map(([field,label]) => <label key={field} className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300"><input type="checkbox" checked={Boolean((operations.approval_workflows as any)[field])} onChange={(e) => updateApproval(field as keyof SmartOperationsState['approval_workflows'], e.target.checked)} className="accent-amber-500" />{label}</label>)}
        </div>
        <label className="block max-w-sm space-y-1"><span className="text-[10px] text-slate-400">حد الدفعة الكبيرة التي تحتاج اعتماداً إضافياً (YER)</span><input type="number" min={0} value={operations.approval_workflows.high_value_payment_threshold_yer} onChange={(e) => updateApproval('high_value_payment_threshold_yer', Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white" /></label>
      </section>}

      {activeTab === 'health' && <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">{operations.system_health.map((item) => <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4"><div className="flex items-start justify-between gap-3"><div><div className="text-xs font-black text-white">{item.service_name}</div><div className="text-[10px] text-slate-500 mt-1">{item.category}</div></div><span className={`text-[10px] px-2 py-1 rounded-full border ${healthClass[item.status]}`}>{healthLabel[item.status]}</span></div>{item.note && <div className="text-[10px] text-slate-400 mt-3 leading-relaxed">{item.note}</div>}</div>)}</div>}

      {activeTab === 'backup' && <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4"><div className="text-[10px] text-slate-500">آخر مزامنة</div><div className="text-xs font-bold text-white mt-2">{operations.backup_sync.last_sync_at || 'لم تتم'}</div></div>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4"><div className="text-[10px] text-slate-500">آخر نسخة احتياطية</div><div className="text-xs font-bold text-white mt-2">{operations.backup_sync.last_backup_at || 'لم تتم'}</div></div>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4"><div className="text-[10px] text-slate-500">عناصر بانتظار المزامنة</div><div className="text-xl font-black text-cyan-300 mt-1">{operations.backup_sync.pending_sync_items}</div></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-2"><label className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300"><input type="checkbox" checked={operations.backup_sync.offline_mode_enabled} onChange={(e) => onUpdateOperations({...operations, backup_sync:{...operations.backup_sync, offline_mode_enabled:e.target.checked}})} className="accent-cyan-500" /> Offline-first</label><label className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300"><input type="checkbox" checked={operations.backup_sync.auto_sync_enabled} onChange={(e) => onUpdateOperations({...operations, backup_sync:{...operations.backup_sync, auto_sync_enabled:e.target.checked}})} className="accent-cyan-500" /> مزامنة تلقائية</label></div>
        <input value={operations.backup_sync.backup_destination_label} onChange={(e) => onUpdateOperations({...operations, backup_sync:{...operations.backup_sync, backup_destination_label:e.target.value}})} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white" />
        <div className="flex flex-wrap gap-2"><button onClick={syncNow} className="px-3 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold flex items-center gap-2"><RefreshCw className="w-4 h-4" />مزامنة الآن</button><button onClick={runLocalBackup} className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2"><DatabaseBackup className="w-4 h-4" />تسجيل نسخة احتياطية</button></div>
      </section>}

      {activeTab === 'templates' && <div className="grid xl:grid-cols-2 gap-3">{operations.notification_templates.map((template) => <div key={template.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2"><div className="flex justify-between gap-2"><div><div className="text-xs font-black text-white">{template.name}</div><div className="text-[10px] text-slate-500">{template.category}</div></div><label className="text-[10px] text-slate-300 flex items-center gap-1"><input type="checkbox" checked={template.active} onChange={(e) => updateTemplate(template.id,'active',e.target.checked)} className="accent-cyan-500" /> فعال</label></div><input value={template.title} onChange={(e) => updateTemplate(template.id,'title',e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" /><textarea value={template.body} onChange={(e) => updateTemplate(template.id,'body',e.target.value)} rows={3} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white" /></div>)}</div>}

      {activeTab === 'audit' && <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"><div className="p-4 border-b border-slate-800"><div className="text-sm font-black text-white">سجل التدقيق الإداري</div><div className="text-[10px] text-slate-500 mt-1">يعرض من فعل ماذا ومتى. في الإنتاج يجب تخزينه خادمياً كسجل غير قابل للتعديل من العميل.</div></div><div className="divide-y divide-slate-800 max-h-[560px] overflow-auto">{operations.audit_log.map((entry) => <div key={entry.id} className="p-4 flex items-start gap-3"><div className={`w-8 h-8 rounded-xl flex items-center justify-center ${entry.result==='success'?'bg-emerald-500/10 text-emerald-300':entry.result==='warning'?'bg-amber-500/10 text-amber-300':'bg-rose-500/10 text-rose-300'}`}>{entry.result==='success'?<CheckCircle2 className="w-4 h-4"/>:<TriangleAlert className="w-4 h-4"/>}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-black text-white">{entry.action}</span><span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{entry.module}</span></div><div className="text-[10px] text-slate-500 mt-1">{entry.actor_name} • {entry.actor_role} • {entry.created_at}</div>{entry.details && <div className="text-[10px] text-slate-300 mt-2">{entry.details}</div>}</div></div>)}</div></section>}

      <div className="bg-amber-950/20 border border-amber-900/40 rounded-2xl p-4 flex items-start gap-3"><WifiOff className="w-5 h-5 text-amber-300 shrink-0" /><div className="text-[11px] text-amber-100"><strong className="block text-white mb-1">ما الذي أصبح داخل لوحة الإدارة؟</strong>FCM، الدفع API/التحقق اليدوي، المصادقة وRBAC، سياسات الموافقة، النسخ والمزامنة، قوالب الرسائل، حالة الأنظمة وسجل التدقيق. التشغيل الخارجي الحقيقي يظل مشروطاً بربط Backend والخدمات الرسمية.</div></div>
    </div>
  );
};
