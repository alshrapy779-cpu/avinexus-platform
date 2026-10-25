import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  Stethoscope,
  Users,
  Search,
  Filter,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  Bot,
  Brain,
  Scale,
  Building,
  Eye,
  Info
} from 'lucide-react';
import {
  SystemUserAccount,
  GovernancePolicy,
  PartnerCompany,
  PlatformFinancialConfig
} from '../../types';

interface GovernanceAuthorityTabProps {
  systemUsers: SystemUserAccount[];
  onUpdateSystemUsers: (users: SystemUserAccount[]) => void;
  policies: GovernancePolicy[];
  onUpdatePolicies: (policies: GovernancePolicy[]) => void;
  companies: PartnerCompany[];
  config: PlatformFinancialConfig;
}

export const GovernanceAuthorityTab: React.FC<GovernanceAuthorityTabProps> = ({
  systemUsers,
  onUpdateSystemUsers,
  policies,
  onUpdatePolicies,
  companies,
  config
}) => {
  const [subSection, setSubSection] = useState<'users_control' | 'senior_vets' | 'policies_ai' | 'master_search'>('users_control');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Freeze Modal State
  const [freezingUser, setFreezingUser] = useState<SystemUserAccount | null>(null);
  const [freezeReasonText, setFreezeReasonText] = useState<string>('');

  // Toggle user status
  const handleToggleUserStatus = (user: SystemUserAccount) => {
    if (user.status === 'نشط ومعتمد') {
      // Open freeze modal
      setFreezingUser(user);
      setFreezeReasonText(user.freeze_reason || 'مخالفة معايير الأمان الحيوي أو محاولة تجاوز فترات السحب');
    } else {
      // Unfreeze
      const updated = systemUsers.map((u) =>
        u.id === user.id ? { ...u, status: 'نشط ومعتمد' as const, freeze_reason: undefined } : u
      );
      onUpdateSystemUsers(updated);
    }
  };

  const confirmFreezeUser = () => {
    if (!freezingUser) return;
    const updated = systemUsers.map((u) =>
      u.id === freezingUser.id
        ? {
            ...u,
            status: 'مجمد رقابياً' as const,
            freeze_reason: freezeReasonText || 'تم التجميد بأمر مدير المنظومة للمراجعة الرقابية'
          }
        : u
    );
    onUpdateSystemUsers(updated);
    setFreezingUser(null);
    setFreezeReasonText('');
  };

  // Toggle policy
  const handleTogglePolicy = (id: string) => {
    const updated = policies.map((p) => (p.id === id ? { ...p, active: !p.active } : p));
    onUpdatePolicies(updated);
  };

  const seniorVets = systemUsers.filter((u) => u.role === 'طبيب بيطري استشاري');

  const filteredUsers = systemUsers.filter((u) => {
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.governorate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Sub navigation buttons */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
        <button
          onClick={() => setSubSection('users_control')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            subSection === 'users_control'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>إدارة واعتماد الحسابات ({systemUsers.length})</span>
        </button>

        <button
          onClick={() => setSubSection('senior_vets')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            subSection === 'senior_vets'
              ? 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>كبار الاستشاريين البيطريين ({seniorVets.length})</span>
        </button>

        <button
          onClick={() => setSubSection('policies_ai')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            subSection === 'policies_ai'
              ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-900/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>حوكمة الأمان والذكاء الاصطناعي ({policies.length})</span>
        </button>

        <button
          onClick={() => setSubSection('master_search')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            subSection === 'master_search'
              ? 'bg-slate-700 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>مرجع الاستعلام الشامل</span>
        </button>
      </div>

      {/* SECTION 1: USERS & ACCOUNTS CONTROL */}
      {subSection === 'users_control' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-2xl text-xs">
              {(['all', 'مربي / صاحب مزرعة', 'عامل / مشرف عنبر', 'مختبر بيطري'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setUserRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    userRoleFilter === r ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r === 'all' ? 'كافة الفئات' : r}
                </button>
              ))}
            </div>

            <div className="flex-1 min-w-[200px] max-w-sm relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث بالاسم، المحافظة، الهاتف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-2xl pr-9 pl-4 py-2 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="py-3 px-4">المستخدم / المنشأة</th>
                    <th className="py-3 px-4">الدور والمحافظة</th>
                    <th className="py-3 px-4">رقم التواصل</th>
                    <th className="py-3 px-4">عدد الدورات / المعاملات</th>
                    <th className="py-3 px-4">التقييم الرقابي</th>
                    <th className="py-3 px-4 text-center">حالة الحساب</th>
                    <th className="py-3 px-4 text-left">إجراء إداري</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredUsers.map((user) => {
                    const isFrozen = user.status === 'مجمد رقابياً';
                    return (
                      <tr
                        key={user.id}
                        className={`hover:bg-slate-800/40 transition ${isFrozen ? 'bg-rose-950/20' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-sans">
                          <div className="font-bold text-white text-xs">{user.name}</div>
                          {user.freeze_reason && (
                            <div className="text-[10px] text-rose-400 font-sans mt-0.5 max-w-xs">
                              سبب التجميد: {user.freeze_reason}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-sans">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                            {user.role}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1">{user.governorate}</div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-300" dir="ltr">
                          {user.phone}
                        </td>

                        <td className="py-3.5 px-4 text-slate-300">
                          {user.cases_or_cycles_count} دورة / حالة
                        </td>

                        <td className="py-3.5 px-4 font-sans">
                          <span className="text-amber-400 font-bold font-mono">{user.rating || 5.0}</span> / 5.0
                        </td>

                        <td className="py-3.5 px-4 text-center font-sans">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                              !isFrozen
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-rose-950 text-rose-400 border border-rose-800'
                            }`}
                          >
                            {!isFrozen ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            <span>{user.status}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-left font-sans">
                          <button
                            onClick={() => handleToggleUserStatus(user)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                              isFrozen
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                : 'bg-rose-600/80 hover:bg-rose-600 text-white'
                            }`}
                          >
                            {isFrozen ? 'فك التجميد واعتماده' : 'تجميد رقابي'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: SENIOR VETS MANAGEMENT */}
      {subSection === 'senior_vets' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  <span>سجل الاستشاريين البيطريين المعتمدين بالجمهورية اليمنية</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  القرار الطبي والعلاجي حكراً على الطبيب البيطري الاستشاري. متابعة دقة التشخيصات وتراخيص مزاولة المهنة.
                </p>
              </div>

              <div className="text-xs text-slate-400">
                إجمالي الاستشاريين: <span className="font-mono text-emerald-400 font-bold">{seniorVets.length}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {seniorVets.map((vet) => (
                <div
                  key={vet.id}
                  className="bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 space-y-3 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">{vet.name}</h4>
                      <div className="text-xs text-slate-400">{vet.governorate}</div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                      ★ {vet.rating || 5.0}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800 pt-2 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">الاستشارات والروشتات:</span>
                      <span className="font-bold text-white">{vet.cases_or_cycles_count} استشارة</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">رقم الهاتف:</span>
                      <span className="text-slate-300" dir="ltr">{vet.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">رقم القيد النقابي:</span>
                      <span className="text-slate-300">{vet.national_id || 'YEM-VET-882'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="text-emerald-400 text-[11px] flex items-center gap-1 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      مخول بصرف المضادات المقيدة
                    </span>
                    <button
                      onClick={() => handleToggleUserStatus(vet)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      {vet.status === 'نشط ومعتمد' ? 'تجميد الصلاحية' : 'تفعيل'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: POLICIES & AI GOVERNANCE */}
      {subSection === 'policies_ai' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-400" />
                <span>سياسات الحوكمة البيطرية وموجهات الذكاء الاصطناعي (AI Governance & Safety)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                ضبط أدوات المساعد الذكي وضمان مبدأ (Human-in-the-Loop) تحت إشراف الطبيب البيطري الاستشاري المعتمد وحظر الاستخدام العشوائي للمضادات.
              </p>
            </div>

            <div className="space-y-4">
              {policies.map((policy) => (
                <div
                  key={policy.id}
                  className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    policy.active
                      ? 'bg-slate-950 border-slate-800 hover:border-indigo-500/40'
                      : 'bg-slate-950/40 border-slate-800/40 opacity-60'
                  }`}
                >
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {policy.category}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {policy.enforcement_level}
                      </span>
                      <h4 className="text-sm font-bold text-white">{policy.title}</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{policy.description}</p>
                    <div className="text-[10px] text-slate-500">آخر مراجعة رقابية: {policy.last_updated}</div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <button
                      onClick={() => handleTogglePolicy(policy.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        policy.active
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                      }`}
                    >
                      {policy.active ? (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>القيد نافذ وملزم</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4" />
                          <span>معطل مؤقتاً</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Core System Instructions Preview */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-indigo-900/50 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <Bot className="w-4 h-4" />
                <span>موجهات النظام المدمجة للمساعد الذكي (System Prompt Architecture):</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                "أنت المساعد الذكي للمنصة الوطنية للسيادة البيطرية والداجنة بالجمهورية اليمنية، بإشراف وتوجيهات الخبير الاستشاري الطبيب البيطري الاستشاري المعتمد. دورك تحليلي وتوجيهي فقط لحساب معامل التحويل الغذائي (FCR)، كشف علامات الإنذار المبكر للأوبئة، والتنبيه لمواعيد اللقاحات. يُحظر عليك منعاً باتاً اعتماد أي تشخيص نهائي أو وصفة علاجية لمضادات حيوية إلا بعد مصادقة الطبيب البيطري الاستشاري البشري."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: MASTER SEARCH */}
      {subSection === 'master_search' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400" />
              <span>السجل الكامل والمرجع السريع للاستعلام التجاري والعلاجي</span>
            </h3>
            <p className="text-xs text-slate-400">
              استعلام شامل في كل العقود، الشحنات، الفواتير، والروشتات الصادرة عبر منصة السيادة البيطرية.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-slate-400">عقود الشركات الموثقة:</div>
                <div className="text-xl font-black text-amber-400 font-mono">{companies.length} شركة رسمية</div>
                <p className="text-[11px] text-slate-500">مغلفة بتراخيص وسجلات تجارية معتمدة داخل اليمن.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-slate-400">المعاملات المالية المقيدة:</div>
                <div className="text-xl font-black text-emerald-400 font-mono">{config.transactions.length} حركة مسجلة</div>
                <p className="text-[11px] text-slate-500">تشمل الأدوية والأعلاف والهناجر وتوثيق QR.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-slate-400">الحسابات النشطة بالمنظومة:</div>
                <div className="text-xl font-black text-white font-mono">{systemUsers.length} مستخدم مسجل</div>
                <p className="text-[11px] text-slate-500">أطباء استشاريون، مربون، عمال عنابر، ومختبرات.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FREEZE MODAL */}
      {freezingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <ShieldAlert className="w-5 h-5" />
              <span>تجميد حساب رقابي: {freezingUser.name}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              سيتم تعليق صلاحيات الحساب فوراً وإيقاف إمكانية إصدار الروشتات أو تسكين كتاكيت جديدة أو إتمام طلبات الشراء حتى انتهاء التحقيق.
            </p>

            <div className="space-y-1 text-xs">
              <label className="text-slate-400 font-medium">سبب التجميد الرقابي المسجل *</label>
              <textarea
                rows={3}
                required
                value={freezeReasonText}
                onChange={(e) => setFreezeReasonText(e.target.value)}
                placeholder="اكتب سبب التجميد (مثل: بيع طيور خلال فترة سحب العلاج، عدم استيفاء الأمان الحيوي...)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-rose-500 text-xs resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFreezingUser(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmFreezeUser}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-rose-600/30"
              >
                تأكيد التجميد الرقابي
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
