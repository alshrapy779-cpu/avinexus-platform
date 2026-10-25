import React, { useMemo, useState } from 'react';
import {
  BadgeCheck,
  BellRing,
  Building2,
  CircleDollarSign,
  FlaskConical,
  KeyRound,
  LockKeyhole,
  PackageSearch,
  ShieldCheck,
  Stethoscope,
  Truck,
  UserCog,
  WalletCards
} from 'lucide-react';
import { StaffMember } from '../../types';

interface AdminAccessControlTabProps {
  staffMembers: StaffMember[];
  onUpdateStaffMembers: (members: StaffMember[]) => void;
}

type PermissionKey = keyof StaffMember['permissions'];

const PERMISSIONS: { key: PermissionKey; label: string; description: string; icon: React.ReactNode }[] = [
  { key: 'can_issue_prescriptions', label: 'اعتماد الروشتات', description: 'إصدار أو اعتماد القرارات العلاجية المصرح بها.', icon: <Stethoscope className="w-4 h-4" /> },
  { key: 'can_order_field_visits', label: 'إدارة النزول الميداني', description: 'إسناد ومتابعة طلبات الطوارئ وأخذ العينات.', icon: <Truck className="w-4 h-4" /> },
  { key: 'can_manage_prices', label: 'تعديل الأسعار العامة', description: 'تعديل الأسعار التشغيلية التي سمح بها المدير.', icon: <CircleDollarSign className="w-4 h-4" /> },
  { key: 'can_view_financials', label: 'عرض المالية', description: 'عرض التقارير المالية والحوالات والتحصيل.', icon: <WalletCards className="w-4 h-4" /> },
  { key: 'can_freeze_accounts', label: 'تجميد الحسابات', description: 'تجميد حساب عميل أو مورد عند الحاجة الرقابية.', icon: <LockKeyhole className="w-4 h-4" /> },
  { key: 'can_manage_catalog', label: 'إدارة الكتالوج', description: 'تعديل صور وبيانات الأدوية والأعلاف واللقاحات والمعدات.', icon: <PackageSearch className="w-4 h-4" /> },
  { key: 'can_manage_exchange_rates', label: 'تعديل أسعار الصرف', description: 'تغيير صرف السعودي مقابل اليمني القديم والجديد.', icon: <CircleDollarSign className="w-4 h-4" /> },
  { key: 'can_manage_zone_pricing', label: 'تسعير المناطق والأجور', description: 'تعديل تكلفة وأجرة النقل والنزول والتسويق حسب المنطقة.', icon: <Truck className="w-4 h-4" /> },
  { key: 'can_manage_payment_accounts', label: 'إدارة حسابات التحويل', description: 'إظهار أو تعديل حسابات المحافظ والتحويلات المعتمدة.', icon: <WalletCards className="w-4 h-4" /> },
  { key: 'can_manage_laboratories', label: 'إدارة المختبرات', description: 'تعديل المختبرات والأسعار وزمن ظهور النتائج.', icon: <FlaskConical className="w-4 h-4" /> },
  { key: 'can_manage_notifications', label: 'إرسال التنبيهات', description: 'إرسال تنبيهات الأسعار والأوبئة والخدمات.', icon: <BellRing className="w-4 h-4" /> },
  { key: 'can_manage_companies', label: 'إدارة الشركات', description: 'إدارة الشركات المتعاقدة والمنتجات المرتبطة بها.', icon: <Building2 className="w-4 h-4" /> }
];

export const AdminAccessControlTab: React.FC<AdminAccessControlTabProps> = ({ staffMembers, onUpdateStaffMembers }) => {
  const [selectedId, setSelectedId] = useState(staffMembers[0]?.id || '');
  const selected = staffMembers.find((item) => item.id === selectedId) || staffMembers[0];

  const privilegedCount = useMemo(
    () => staffMembers.filter((member) => Object.values(member.permissions).some(Boolean)).length,
    [staffMembers]
  );

  const togglePermission = (key: PermissionKey) => {
    if (!selected) return;
    onUpdateStaffMembers(
      staffMembers.map((member) =>
        member.id === selected.id
          ? { ...member, permissions: { ...member.permissions, [key]: !Boolean(member.permissions[key]) } }
          : member
      )
    );
  };

  const updateDuty = (field: 'is_online' | 'on_duty', value: boolean) => {
    if (!selected) return;
    onUpdateStaffMembers(staffMembers.map((member) => member.id === selected.id ? { ...member, [field]: value } : member));
  };

  if (!selected) return null;

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-950 to-cyan-950/60 border border-emerald-700/40 rounded-3xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300"><KeyRound className="w-6 h-6" /></div>
            <div>
              <div className="flex flex-wrap gap-2 items-center"><h3 className="text-lg font-black text-white">من يمكنه التعديل والتحكم؟</h3><span className="text-[10px] px-2 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30">مدير عام فقط</span></div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">هذه الصفحة هي المرجع الوحيد لصلاحيات التعديل داخل الواجهة الإدارية. لا يستطيع العميل تغيير الأسعار أو الصور أو الصرف أو حسابات التحويل. صلاحية تعديل هذه الصفحة نفسها تبقى حصراً للمدير العام ولا يمكن تفويضها من هنا.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center shrink-0">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2"><div className="text-[10px] text-slate-500">الكوادر</div><div className="text-xl font-black text-white">{staffMembers.length}</div></div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2"><div className="text-[10px] text-slate-500">لديهم صلاحيات</div><div className="text-xl font-black text-emerald-300">{privilegedCount}</div></div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 space-y-2 h-fit">
          <div className="text-[11px] font-black text-slate-400 px-2 py-1 flex items-center gap-2"><UserCog className="w-4 h-4" /> اختر الموظف</div>
          {staffMembers.map((member) => (
            <button key={member.id} onClick={() => setSelectedId(member.id)} className={`w-full text-right rounded-xl border p-3 transition ${selected.id === member.id ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'}`}>
              <div className="flex items-start justify-between gap-2"><div><div className="text-xs font-black text-white">{member.name}</div><div className="text-[10px] text-cyan-300 mt-0.5">{member.role}</div><div className="text-[10px] text-slate-500 mt-1">{member.governorate}</div></div><span className={`w-2.5 h-2.5 rounded-full mt-1 ${member.is_online ? 'bg-emerald-400' : 'bg-slate-600'}`} /></div>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div><div className="text-base font-black text-white">{selected.name}</div><div className="text-xs text-slate-400 mt-1">{selected.role} • {selected.phone} • {selected.specialization}</div></div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <label className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2"><input type="checkbox" checked={Boolean(selected.is_online)} onChange={(e) => updateDuty('is_online', e.target.checked)} className="accent-emerald-500" /> متصل الآن</label>
              <label className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2"><input type="checkbox" checked={Boolean(selected.on_duty)} onChange={(e) => updateDuty('on_duty', e.target.checked)} className="accent-cyan-500" /> مداوم</label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {PERMISSIONS.map((permission) => {
              const enabled = Boolean(selected.permissions[permission.key]);
              return (
                <button key={permission.key} onClick={() => togglePermission(permission.key)} className={`text-right p-4 rounded-2xl border transition ${enabled ? 'bg-emerald-500/10 border-emerald-500/45' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
                  <div className="flex items-start justify-between gap-3"><div className={`w-9 h-9 rounded-xl flex items-center justify-center ${enabled ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-950 text-slate-500'}`}>{permission.icon}</div><div className={`text-[10px] font-black px-2 py-1 rounded-full border ${enabled ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-slate-950 text-slate-500 border-slate-800'}`}>{enabled ? 'مسموح' : 'غير مسموح'}</div></div>
                  <div className="text-xs font-black text-white mt-3">{permission.label}</div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-relaxed">{permission.description}</div>
                </button>
              );
            })}
          </div>

          <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-4 flex items-start gap-3 text-xs text-rose-200">
            <ShieldCheck className="w-5 h-5 text-rose-300 shrink-0" />
            <div><strong className="block text-white">قفل المالك التنفيذي</strong><span className="text-[11px] text-rose-200/80">إضافة أو حذف المدير العام، أو منح صلاحية إدارة هذه الصفحة، يجب أن يتم عبر نظام مصادقة خادمي موثوق. الواجهة الحالية تمنع تفويض صلاحية إدارة الصلاحيات نفسها.</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
