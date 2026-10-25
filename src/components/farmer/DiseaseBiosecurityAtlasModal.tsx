import React, { useMemo, useState } from 'react';
import { BookOpen, Bug, FlaskConical, ShieldCheck, Stethoscope, X } from 'lucide-react';
import { ClinicalDiseaseGroup, NecropsyGuideAsset } from '../../types';

interface DiseaseBiosecurityAtlasModalProps {
  onClose: () => void;
  guides: NecropsyGuideAsset[];
}

type DiseaseType = 'فيروسي' | 'بكتيري' | 'طفيلي' | 'ميكوبلازما' | 'فطري/سموم';

interface DiseaseAtlasEntry {
  id: string;
  nameAr: string;
  nameEn: string;
  type: DiseaseType;
  group: ClinicalDiseaseGroup;
  incubation: string;
  symptoms: string[];
  necropsy: string[];
  prevention: string[];
  lab: string;
}

const DISEASES: DiseaseAtlasEntry[] = [
  { id: 'nd', nameAr: 'مرض النيوكاسل', nameEn: 'Newcastle Disease (ND)', type: 'فيروسي', group: 'فيروسي', incubation: 'عادة 2–15 يوماً حسب العترة والجرعة المناعية.', symptoms: ['أعراض تنفسية وعصبية أو هضمية حسب العترة', 'انخفاض استهلاك العلف والماء والإنتاج', 'قد يرتفع النفوق بسرعة في العترات الشديدة'], necropsy: ['القصبة الهوائية', 'المعدة الغدية', 'الأمعاء والأعوران'], prevention: ['برنامج تحصين معتمد', 'منع الحركة غير الضرورية بين المزارع', 'تطهير الأدوات والمركبات وعزل الحالات'], lab: 'PCR/اختبارات فيروسية يحددها الطبيب عند الاشتباه الوبائي.' },
  { id: 'ibd', nameAr: 'مرض الجمبورو', nameEn: 'Infectious Bursal Disease (IBD)', type: 'فيروسي', group: 'فيروسي', incubation: 'غالباً 2–4 أيام.', symptoms: ['خمول وانكماش وافتراش', 'إسهال مائي أو أبيض', 'تثبيط مناعي قد يفتح الباب لعدوى ثانوية'], necropsy: ['غدة البرسا', 'الكلى', 'عضلات الفخذ والصدر'], prevention: ['التحصين وفق الأجسام المناعية والعمر', 'تطهير جيد بين الدورات', 'تقليل الإجهاد ومنع خلط الأعمار'], lab: 'PCR/Histopathology/Serology حسب قرار الاستشاري.' },
  { id: 'ib', nameAr: 'التهاب الشعب الهوائية المعدي', nameEn: 'Infectious Bronchitis (IB)', type: 'فيروسي', group: 'فيروسي', incubation: 'تقريباً 18–48 ساعة في كثير من العترات.', symptoms: ['كحة وعطس وأصوات تنفسية', 'انخفاض الماء والعلف', 'قد تظهر علامات كلوية أو انخفاض إنتاج البيض'], necropsy: ['القصبة الهوائية', 'الأكياس الهوائية', 'الكلى عند الاشتباه الكلوي'], prevention: ['تحصين مناسب للعترات المحلية', 'ضبط التهوية والرطوبة', 'تقليل الأمونيا والإجهاد الحراري'], lab: 'PCR وتحديد العترة عند الحالات المتكررة أو الشديدة.' },
  { id: 'ecoli', nameAr: 'الإيكولاي/التهاب الأكياس الهوائية', nameEn: 'Colibacillosis - E. coli', type: 'بكتيري', group: 'بكتيري', incubation: 'متغير؛ غالباً عدوى ثانوية مرتبطة بالإجهاد أو الجهاز التنفسي.', symptoms: ['خمول ونفوق متفاوت', 'ضائقة تنفسية في حالات الأكياس الهوائية', 'تراجع النمو والتحويل الغذائي'], necropsy: ['الأكياس الهوائية', 'الكبد والقلب', 'الأمعاء'], prevention: ['تحسين جودة الماء والفرشة والتهوية', 'تقليل العدوى الفيروسية/الميكوبلازما المهيئة', 'عدم استخدام المضادات عشوائياً'], lab: 'زرع بكتيري واختبار حساسية قبل المضاد عندما يكون ذلك ممكناً.' },
  { id: 'myco', nameAr: 'الميكوبلازما التنفسية', nameEn: 'Mycoplasma gallisepticum / CRD', type: 'ميكوبلازما', group: 'ميكوبلازما/تنفسي', incubation: 'قد تمتد من عدة أيام إلى أسابيع وتتأثر بالإجهاد والعدوى المصاحبة.', symptoms: ['شخير وعطس وخشخشة', 'تورم جيوب أنفية أحياناً', 'تباطؤ نمو وارتفاع FCR'], necropsy: ['القصبة الهوائية', 'الأكياس الهوائية', 'الكبد والقلب عند وجود عدوى ثانوية'], prevention: ['مصدر كتاكيت موثوق', 'تهوية جيدة وخفض الأمونيا', 'منع ازدحام العنبر والإجهاد'], lab: 'PCR/اختبارات مصلية، مع حساسية بكتيرية للعدوى الثانوية عند الحاجة.' },
  { id: 'cocci', nameAr: 'الكوكسيديا', nameEn: 'Coccidiosis - Eimeria spp.', type: 'طفيلي', group: 'طفيلي/كوكسيديا', incubation: 'عادة 4–7 أيام بحسب نوع الإيميريا.', symptoms: ['إسهال وقد يظهر دم', 'هبوط النمو واستهلاك العلف', 'شحوب وخمول وارتفاع نفوق في الحالات الشديدة'], necropsy: ['الأعوران', 'الأمعاء الدقيقة'], prevention: ['إدارة الفرشة والرطوبة', 'برنامج كوكسيديا/لقاح أو مضادات كوكسيديا بإشراف', 'تنظيف جيد بين الدورات'], lab: 'فحص آفات الأمعاء/الأعورين وعدّ الأكياس البيضية عند الحاجة.' },
  { id: 'coryza', nameAr: 'الكوريزا المعدية', nameEn: 'Infectious Coryza', type: 'بكتيري', group: 'بكتيري', incubation: 'عادة 1–3 أيام.', symptoms: ['تورم الوجه والجيوب الأنفية', 'إفرازات أنفية ورائحة مميزة أحياناً', 'انخفاض العلف والإنتاج'], necropsy: ['الجيوب الأنفية والرأس', 'القصبة الهوائية'], prevention: ['عزل المصاب ومنع خلط الأعمار', 'تنظيف المشارب والماء', 'تحصين القطعان المعرضة حسب قرار الطبيب'], lab: 'زرع/PCR عندما يلزم التفريق عن مسببات تنفسية أخرى.' },
  { id: 'mycotoxin', nameAr: 'السموم الفطرية', nameEn: 'Mycotoxicosis', type: 'فطري/سموم', group: 'فطري/سموم', incubation: 'ليست عدوى بحضانة ثابتة؛ ترتبط بكمية السم ومدة التعرض.', symptoms: ['ضعف نمو وتباين أوزان', 'هبوط مناعة ومشاكل كبدية/هضمية', 'انخفاض استهلاك العلف أو رداءة التحويل'], necropsy: ['الكبد', 'المعدة الغدية', 'الأمعاء'], prevention: ['تخزين العلف جافاً ومهوى', 'رفض العلف المتعفن أو مجهول المصدر', 'تحليل العلف عند الاشتباه'], lab: 'تحليل علف للسموم الفطرية حسب الاشتباه والمصدر.' }
];

export const DiseaseBiosecurityAtlasModal: React.FC<DiseaseBiosecurityAtlasModalProps> = ({ onClose, guides }) => {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(DISEASES[0].id);
  const filtered = DISEASES.filter((d) => `${d.nameAr} ${d.nameEn} ${d.type}`.toLowerCase().includes(query.toLowerCase()));
  const selected = DISEASES.find((d) => d.id === selectedId) || filtered[0] || DISEASES[0];
  const approvedGuides = useMemo(() => guides.filter((g) => g.approved_by_admin && g.image_url && g.disease_groups.includes(selected.group)), [guides, selected.group]);

  return (
    <div className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto" dir="rtl">
      <div className="max-w-5xl mx-auto bg-[#06171d] border border-emerald-900/50 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950/80 via-[#071c23] to-cyan-950/70 border-b border-emerald-900/40 flex items-start justify-between gap-3">
          <div className="flex gap-3"><div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center"><BookOpen className="w-6 h-6" /></div><div><h3 className="text-lg font-black text-white">أطلس الأمراض والأمان الحيوي</h3><p className="text-[11px] text-slate-300 mt-1">مرجع توعوي ميداني. الصور التشريحية المعروضة لا تظهر إلا بعد اعتمادها من الإدارة، والتشخيص والعلاج النهائي للطبيب.</p></div></div>
          <button onClick={onClose} className="p-2 rounded-xl bg-black/20 text-slate-300 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid lg:grid-cols-[310px_1fr] min-h-[600px]">
          <aside className="p-4 border-l border-slate-800 bg-slate-950/40 space-y-3">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث عن مرض أو نوع..." className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white" />
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filtered.map((d) => <button key={d.id} onClick={() => setSelectedId(d.id)} className={`w-full text-right p-3 rounded-xl border transition ${selected.id === d.id ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}><div className="flex items-center justify-between gap-2"><div><div className="text-xs font-black text-white">{d.nameAr}</div><div className="text-[9px] text-slate-500 mt-0.5">{d.nameEn}</div></div><span className="text-[9px] rounded-full px-2 py-0.5 bg-slate-950 border border-slate-700 text-cyan-300">{d.type}</span></div></button>)}
            </div>
          </aside>

          <main className="p-4 sm:p-6 space-y-5">
            <div><div className="flex flex-wrap items-center gap-2"><h4 className="text-xl font-black text-white">{selected.nameAr}</h4><span className="text-[10px] px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">{selected.type}</span></div><div className="text-xs text-slate-500 mt-1">{selected.nameEn}</div></div>
            <InfoBlock icon={<Bug className="w-4 h-4" />} title="فترة الحضانة / نمط الظهور"><p>{selected.incubation}</p></InfoBlock>
            <div className="grid md:grid-cols-2 gap-4"><InfoBlock icon={<Stethoscope className="w-4 h-4" />} title="الأعراض المهمة"><List items={selected.symptoms} /></InfoBlock><InfoBlock icon={<FlaskConical className="w-4 h-4" />} title="الصفة التشريحية والفحص"><List items={selected.necropsy} /><p className="text-violet-300 mt-2">{selected.lab}</p></InfoBlock></div>
            <InfoBlock icon={<ShieldCheck className="w-4 h-4" />} title="الوقاية والأمان الحيوي"><List items={selected.prevention} /></InfoBlock>

            <div className="space-y-2"><div className="text-xs font-black text-white">الصور التشريحية المعتمدة لهذه المجموعة</div>{approvedGuides.length ? <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{approvedGuides.map((g) => <a key={g.id} href={g.image_url} target="_blank" rel="noreferrer" className="catalog-image-frame rounded-2xl p-2 block"><img src={g.image_url} alt={g.organ_name} className="w-full h-40 object-contain rounded-xl" /><div className="text-[10px] text-slate-700 font-black mt-1 text-center">{g.organ_name}</div></a>)}</div> : <div className="bg-amber-950/20 border border-amber-800/30 rounded-2xl p-4 text-[11px] text-amber-200">لا توجد صورة تشريحية معتمدة من الإدارة لهذه المجموعة حتى الآن. لن يعرض التطبيق صورة طبية عامة على أنها مرجع تشخيصي.</div>}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

const InfoBlock: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 text-[11px] text-slate-300 leading-relaxed"><div className="flex items-center gap-2 text-emerald-300 font-black text-xs mb-2">{icon}{title}</div>{children}</section>;
const List: React.FC<{ items: string[] }> = ({ items }) => <ul className="space-y-1.5">{items.map((item, i) => <li key={i} className="flex gap-2"><span className="text-emerald-400">•</span><span>{item}</span></li>)}</ul>;
