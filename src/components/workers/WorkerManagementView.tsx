import React, { useState } from 'react';
import {
  Users,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Phone,
  FileText,
  TrendingDown,
  Activity,
  Search,
  Plus,
  X,
  CreditCard,
  Briefcase,
  Star
} from 'lucide-react';
import { WorkerProfile, WorkerProfessionalLevel, CycleHistoryItem, SmartOperationsState, JobApplication } from '../../types';

interface WorkerManagementViewProps {
  workers: WorkerProfile[];
  onAddWorker?: (worker: WorkerProfile) => void;
  smartOperations: SmartOperationsState;
  onUpdateSmartOperations: (operations: SmartOperationsState) => void;
}

export const WorkerManagementView: React.FC<WorkerManagementViewProps> = ({
  workers,
  onAddWorker,
  smartOperations,
  onUpdateSmartOperations
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [showAddWorkerModal, setShowAddWorkerModal] = useState<boolean>(false);
  const [showJobModal, setShowJobModal] = useState<boolean>(false);
  const [jobSuccess, setJobSuccess] = useState('');
  const [jobApplication, setJobApplication] = useState({ full_name: '', role_requested: 'عامل' as JobApplication['role_requested'], phone: '', age: 25, national_id: '', governorate: 'صنعاء', experience_years: 1, desired_salary_yer: 0, identity_image_url: '', notes: '' });
  const [selectedWorkerDetails, setSelectedWorkerDetails] = useState<WorkerProfile | null>(null);

  // New Worker Form State
  const [newWorker, setNewWorker] = useState<Partial<WorkerProfile>>({
    full_name: '',
    national_id: '',
    birth_date: '1992-01-01',
    age: 34,
    experience_years: 6,
    professional_level: 'محترف',
    phone: '',
    current_residence: 'محافظة صنعاء',
    specialization_role: 'مشرف عنبر',
    biosecurity_training_certified: true,
    status: 'متاح للعمل فوراً',
    id_card_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    previous_cycles_history: [
      {
        cycle_year: '2024',
        farm_name: 'مزرعة نموذجية خاصة',
        breed: 'Ross 308',
        flock_size: 10000,
        mortality_rate_percent: 2.9,
        fcr_achieved: 1.51,
        evaluator_vet_notes: 'ملتزم ببروتوكولات الأمان الحيوي ومكافحة الهدر في العلف.'
      }
    ]
  });

  const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('تعذر قراءة الملف')); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); });

  const submitJobApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobApplication.full_name.trim() || !jobApplication.phone.trim() || !jobApplication.national_id.trim()) return;
    const item: JobApplication = { id: `job-${Date.now()}`, created_at: new Date().toISOString(), ...jobApplication, full_name: jobApplication.full_name.trim(), phone: jobApplication.phone.trim(), national_id: jobApplication.national_id.trim(), status: 'new' };
    onUpdateSmartOperations({ ...smartOperations, job_applications: [item, ...smartOperations.job_applications] });
    setJobSuccess('تم إرسال طلبك للإدارة. سيبقى ضمن قاعدة المرشحين تحت إشراف المنصة بعد المراجعة.');
  };

  const handleCreateWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorker.full_name || !newWorker.national_id || !newWorker.phone) {
      alert('يرجى تعبئة الاسم الكامل ورقم الهوية ورقم الهاتف');
      return;
    }

    const created: WorkerProfile = {
      id: `worker-${Date.now()}`,
      full_name: newWorker.full_name!,
      national_id: newWorker.national_id!,
      birth_date: newWorker.birth_date || '1992-01-01',
      age: Number(newWorker.age) || 30,
      id_card_image_url:
        newWorker.id_card_image_url ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      experience_years: Number(newWorker.experience_years) || 5,
      professional_level: (newWorker.professional_level as WorkerProfessionalLevel) || 'محترف',
      phone: newWorker.phone!,
      current_residence: newWorker.current_residence || 'محافظة صنعاء',
      specialization_role: newWorker.specialization_role || 'مشرف عنبر',
      previous_cycles_history: newWorker.previous_cycles_history || [],
      biosecurity_training_certified: Boolean(newWorker.biosecurity_training_certified),
      status: (newWorker.status as any) || 'متاح للعمل فوراً'
    };

    if (onAddWorker) {
      onAddWorker(created);
    }
    setShowAddWorkerModal(false);
  };

  const filteredWorkers = workers.filter((w) => {
    const matchSearch =
      w.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.national_id.includes(searchQuery) ||
      w.current_residence.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLevel = selectedLevel === 'all' || w.professional_level === selectedLevel;
    const matchRole = selectedRole === 'all' || w.specialization_role === selectedRole;
    return matchSearch && matchLevel && matchRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
                سجل الموارد البشرية والعمالة الميدانية
              </span>
              <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-mono">
                HR & Field Supervisors
              </span>
            </div>
            <h2 className="text-xl font-black text-white">
              ملف إدارة العمالة، المشرفين والمربين المحترفين
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl">
              قاعدة بيانات توثيقية ترصد السجلات الميدانية للعمالة، معدلات التحويل FCR والنفوق المحققة بالدورات السابقة، وشهادات الأمان الحيوي لرفع كفاءة مزارع التسمين.
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
          <button onClick={() => { setShowJobModal(true); setJobSuccess(''); }} className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-2"><Briefcase className="w-4 h-4" /><span>التقديم للعمل معنا</span></button>
          <button
            onClick={() => setShowAddWorkerModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-teal-900/40 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل مربي / مشرف جديد</span>
          </button>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            placeholder="بحث بالاسم، رقم الهوية، أو المحافظة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">المستوى:</span>
            {['all', 'محترف', 'متوسط', 'مبتدئ'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                  selectedLevel === lvl
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {lvl === 'all' ? 'الكل' : lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">التخصص:</span>
            {['all', 'مشرف عنبر', 'مربي متخصص تحضين', 'فني تهوية وتبريد'].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                  selectedRole === role
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {role === 'all' ? 'كافة الأدوار' : role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkers.map((worker) => (
          <div
            key={worker.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 space-y-4 shadow-xl transition flex flex-col justify-between"
          >
            <div className="space-y-3.5">
              {/* Header Profile Info */}
              <div className="flex items-start gap-3.5">
                <img
                  src={worker.id_card_image_url}
                  alt={worker.full_name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/40 shrink-0"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white leading-tight">{worker.full_name}</h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        worker.professional_level === 'محترف'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                          : worker.professional_level === 'متوسط'
                          ? 'bg-teal-950/80 text-teal-300 border-teal-800'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {worker.professional_level}
                    </span>
                  </div>

                  <span className="text-xs text-teal-400 font-medium block">{worker.specialization_role}</span>
                  <span className="text-[11px] text-slate-400 font-mono block">
                    هوية رقم: {worker.national_id} • العمر: {worker.age} سنة
                  </span>
                </div>
              </div>

              {/* Status and BioSecurity Badge */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="bg-slate-950 text-slate-300 px-2.5 py-1 rounded-xl border border-slate-800 flex items-center gap-1.5 text-[11px]">
                  <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                  <span>الخبرة: {worker.experience_years} سنوات</span>
                </span>

                {worker.biosecurity_training_certified && (
                  <span className="bg-emerald-950/70 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-xl flex items-center gap-1 text-[11px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>معتمد أمان حيوي</span>
                  </span>
                )}
              </div>

              {/* Residence */}
              <p className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                📍 {worker.current_residence}
              </p>

              {/* Cycles Track Record Summary */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-300 block">السجل الميداني والدورات السابقة:</span>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {worker.previous_cycles_history.map((cycle, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-200">
                        <span>{cycle.farm_name}</span>
                        <span className="text-[11px] text-teal-400 font-mono">{cycle.cycle_year}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>سلالة {cycle.breed} ({cycle.flock_size.toLocaleString()} طائر)</span>
                        <span className="text-amber-300">FCR: {cycle.fcr_achieved}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 italic mt-0.5">"{cycle.evaluator_vet_notes}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  worker.status === 'متاح للعمل فوراً'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {worker.status}
              </span>

              <a
                href={`tel:${worker.phone}`}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
              >
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <span>اتصال بالمشرف</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {showJobModal && (
        <div className="fixed inset-0 z-[55] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="bg-slate-900 border border-cyan-800/50 rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-start"><div><h3 className="font-black text-white">طلب عمل تحت إشراف المنصة</h3><p className="text-[11px] text-slate-400 mt-1">متاح للعامل، المشرف الميداني والطبيب البيطري. الطلب يخضع للمراجعة ولا يعني التوظيف المباشر.</p></div><button onClick={()=>setShowJobModal(false)} className="text-slate-400"><X className="w-5 h-5" /></button></div>
            <form onSubmit={submitJobApplication} className="grid sm:grid-cols-2 gap-3 text-xs">
              <label className="space-y-1"><span className="text-slate-400">الاسم الكامل</span><input required value={jobApplication.full_name} onChange={e=>setJobApplication({...jobApplication,full_name:e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" /></label>
              <label className="space-y-1"><span className="text-slate-400">الصفة المطلوبة</span><select value={jobApplication.role_requested} onChange={e=>setJobApplication({...jobApplication,role_requested:e.target.value as any})} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"><option>عامل</option><option>مشرف ميداني</option><option>طبيب بيطري</option></select></label>
              <label className="space-y-1"><span className="text-slate-400">رقم الهاتف</span><input required value={jobApplication.phone} onChange={e=>setJobApplication({...jobApplication,phone:e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" /></label>
              <label className="space-y-1"><span className="text-slate-400">العمر</span><input type="number" min={18} value={jobApplication.age} onChange={e=>setJobApplication({...jobApplication,age:Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" /></label>
              <label className="space-y-1"><span className="text-slate-400">رقم الهوية</span><input required value={jobApplication.national_id} onChange={e=>setJobApplication({...jobApplication,national_id:e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" /></label>
              <label className="space-y-1"><span className="text-slate-400">المحافظة</span><input value={jobApplication.governorate} onChange={e=>setJobApplication({...jobApplication,governorate:e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" /></label>
              <label className="space-y-1"><span className="text-slate-400">سنوات الخبرة</span><input type="number" min={0} value={jobApplication.experience_years} onChange={e=>setJobApplication({...jobApplication,experience_years:Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" /></label>
              <label className="space-y-1"><span className="text-slate-400">الراتب المطلوب</span><input type="number" min={0} value={jobApplication.desired_salary_yer} onChange={e=>setJobApplication({...jobApplication,desired_salary_yer:Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white" /></label>
              <label className="sm:col-span-2 space-y-1"><span className="text-slate-400">صورة الهوية</span><input type="file" accept="image/*" capture="environment" onChange={async e=>{const f=e.target.files?.[0]; if(f)setJobApplication({...jobApplication,identity_image_url:await fileToDataUrl(f)})}} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-slate-300" /></label>
              <label className="sm:col-span-2 space-y-1"><span className="text-slate-400">ملاحظات / نوع الخبرة</span><textarea rows={3} value={jobApplication.notes} onChange={e=>setJobApplication({...jobApplication,notes:e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white resize-none" /></label>
              {jobSuccess && <div className="sm:col-span-2 bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3 text-emerald-300">{jobSuccess}</div>}
              <button className="sm:col-span-2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black">إرسال طلب العمل للإدارة</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Worker Modal */}
      {showAddWorkerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">تسجيل مشرف أو مربي داجن</h3>
                  <p className="text-xs text-slate-400">توثيق بيانات الهوية والخبرة وسجل الدورات الميدانية</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddWorkerModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWorker} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">الاسم الكامل الرباعي:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أحمد صالح عبد الله البرطي"
                  value={newWorker.full_name}
                  onChange={(e) => setNewWorker({ ...newWorker, full_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">رقم البطاقة الشخصية / الهوية:</label>
                  <input
                    type="text"
                    required
                    placeholder="01020304051"
                    value={newWorker.national_id}
                    onChange={(e) => setNewWorker({ ...newWorker, national_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono placeholder-slate-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">تاريخ الميلاد والعمر:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={newWorker.birth_date}
                      onChange={(e) => setNewWorker({ ...newWorker, birth_date: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-white"
                    />
                    <input
                      type="number"
                      placeholder="العمر"
                      value={newWorker.age}
                      onChange={(e) => setNewWorker({ ...newWorker, age: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-white font-mono text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">سنوات الخبرة:</label>
                  <input
                    type="number"
                    value={newWorker.experience_years}
                    onChange={(e) => setNewWorker({ ...newWorker, experience_years: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-teal-400 font-mono font-bold text-center"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">مستوى الاحتراف:</label>
                  <select
                    value={newWorker.professional_level}
                    onChange={(e) => setNewWorker({ ...newWorker, professional_level: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="محترف">محترف (أكثر من 8 سنوات)</option>
                    <option value="متوسط">متوسط (3 - 7 سنوات)</option>
                    <option value="مبتدئ">مبتدئ (أقل من 3 سنوات)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">التخصص الميداني:</label>
                  <select
                    value={newWorker.specialization_role}
                    onChange={(e) => setNewWorker({ ...newWorker, specialization_role: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="مشرف عنبر">مشرف عنبر</option>
                    <option value="مربي متخصص تحضين">مربي متخصص تحضين</option>
                    <option value="فني تهوية وتبريد">فني تهوية وتبريد</option>
                    <option value="مدير مزرعة شامل">مدير مزرعة شامل</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">رقم الهاتف للتواصل:</label>
                  <input
                    type="text"
                    required
                    placeholder="+967 770 000 000"
                    value={newWorker.phone}
                    onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono placeholder-slate-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">محل الإقامة الحالي:</label>
                  <input
                    type="text"
                    placeholder="محافظة صنعاء / مستعد للعمل في ذمار"
                    value={newWorker.current_residence}
                    onChange={(e) => setNewWorker({ ...newWorker, current_residence: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={newWorker.biosecurity_training_certified}
                    onChange={(e) => setNewWorker({ ...newWorker, biosecurity_training_certified: e.target.checked })}
                    className="rounded accent-teal-500"
                  />
                  <span className="font-bold">حاصل على دورة تدريبية معتمدة في الأمان الحيوي والتطهير</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddWorkerModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-lg shadow-teal-900/40"
                >
                  حفظ وتوثيق الملف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
