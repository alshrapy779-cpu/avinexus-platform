import React, { useMemo, useState } from 'react';
import {
  Bot,
  Send,
  ShieldAlert,
  AlertTriangle,
  X,
  Calculator,
  Droplets,
  Wheat,
  Flame,
  Fan,
  ShieldCheck,
  Stethoscope, Camera, Volume2, ClipboardList
} from 'lucide-react';
import { AIGuidanceChat, ClinicalTriageCase, LaboratoryDirectoryItem, NecropsyGuideAsset } from '../../types';
import { apiService } from '../../services/apiService';
import { answerPoultrySizingQuestionR81 } from '../../modules/ai/PoultryScientificCalculatorR81';

interface AIVeterinaryGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsultVet?: () => void;
  customerName?: string;
  customerPhone?: string;
  customerGovernorate?: string;
  customerDistrict?: string;
  customerAddress?: string;
  laboratories?: LaboratoryDirectoryItem[];
  necropsyGuides?: NecropsyGuideAsset[];
  onSubmitClinicalCase?: (caseItem: ClinicalTriageCase) => void;
  externalAIEnabled?: boolean;
}

export const AIVeterinaryGuidanceModal: React.FC<AIVeterinaryGuidanceModalProps> = ({
  isOpen,
  onClose,
  onConsultVet,
  customerName = '',
  customerPhone = '',
  customerGovernorate = 'صنعاء',
  customerDistrict = '',
  customerAddress = '',
  laboratories = [],
  necropsyGuides = [],
  onSubmitClinicalCase,
  externalAIEnabled = true
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [flockSize, setFlockSize] = useState(10000);
  const [ageDays, setAgeDays] = useState(14);
  const [feedKg, setFeedKg] = useState(700);
  const [waterLiters, setWaterLiters] = useState(1400);
  const [birdsPerDrinker, setBirdsPerDrinker] = useState(80);
  const [birdsPerFeeder, setBirdsPerFeeder] = useState(50);
  const [birdsPerHeater, setBirdsPerHeater] = useState(1000);
  const [triageOpen, setTriageOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<'chat' | 'calculator'>('chat');
  const [advisorNotice, setAdvisorNotice] = useState('');
  const [triageNotice, setTriageNotice] = useState('');
  const [triage, setTriage] = useState({
    customer_name: customerName, phone: customerPhone, governorate: customerGovernorate, district: customerDistrict, detailed_address: customerAddress,
    flock_size: 10000, age_days: 21, mortality_today: 0, average_weight_grams: 900, feed_kg: 0, water_liters: 0, temperature_celsius: 27, humidity_percent: 60,
    symptoms_description: '', droppings_image_url: '', barn_image_url: '', litter_image_url: '', audio_url: '', necropsy_images: [] as { organ_name: string; image_url: string }[], remote_area_without_lab: false
  });

  const [messages, setMessages] = useState<AIGuidanceChat[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text:
        'أهلاً بك. أنا مستشار الدواجن والبيع الذكي في المنصة. أساعدك في التحضين، العلف والماء، التهوية والتبريد، المعدات، اللقاحات، الأمان الحيوي، التسويق، مقارنة الخيارات وفهم التكلفة والقيمة قبل الشراء.\n\nهدفي أن يكون قرارك مبنياً على بيانات القطيع لا على الممارسة العشوائية. في الحالات المرضية أجمع الأدلة وأشرح المخاطر والخطوات الآمنة، لكن التشخيص النهائي ووصف المضادات الحيوية واعتماد استخدامها يبقى للطبيب البيطري.',
      timestamp: 'الآن',
      requires_vet_escalation: false
    }
  ]);

  const calculator = useMemo(() => {
    const safeFlock = Math.max(1, flockSize || 1);
    const feedPerBirdG = (Math.max(0, feedKg) * 1000) / safeFlock;
    const waterPerBirdMl = (Math.max(0, waterLiters) * 1000) / safeFlock;
    const waterFeedRatio = feedKg > 0 ? waterLiters / feedKg : 0;
    return {
      feedPerBirdG,
      waterPerBirdMl,
      waterFeedRatio,
      drinkers: Math.ceil(safeFlock / Math.max(1, birdsPerDrinker)),
      feeders: Math.ceil(safeFlock / Math.max(1, birdsPerFeeder)),
      heaters: Math.ceil(safeFlock / Math.max(1, birdsPerHeater))
    };
  }, [flockSize, feedKg, waterLiters, birdsPerDrinker, birdsPerFeeder, birdsPerHeater]);

  const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('تعذر قراءة الملف'));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const triageDecision = (description: string) => {
    const t = description.toLowerCase();
    if (/دم|اسهال|إسهال|كوكس|مخاط/.test(t)) return { group: 'طفيلي/كوكسيديا' as const, organs: ['الأعوران', 'الأمعاء الدقيقة', 'الكبد'], lab: false, note: 'التركيز على الإسهال والفرشة وصور الأعورين والأمعاء مع حساب شدة النافق.' };
    if (/شخر|عطس|تنفس|كحة|خرخرة|افراز|إفراز/.test(t)) return { group: 'ميكوبلازما/تنفسي' as const, organs: ['القصبة الهوائية', 'الأكياس الهوائية', 'الكبد والقلب'], lab: true, note: 'الأعراض التنفسية تحتاج صوتاً واضحاً وصور القصبة والأكياس الهوائية، وقد يلزم فحص مخبري قبل المضاد.' };
    if (/عصبي|التواء|شلل|نيوكاسل|جمبورو|تحصين/.test(t)) return { group: 'فيروسي' as const, organs: ['المعدة الغدية', 'غدة البرسا', 'القصبة الهوائية', 'الأمعاء'], lab: true, note: 'الاشتباه الفيروسي لا يُحسم من الصورة وحدها؛ تُجمع صور الأعضاء وسجل التحصين ويقرر الطبيب الحاجة للفحص.' };
    if (/كولاي|بكتير|تورم|صديد|التهاب/.test(t)) return { group: 'بكتيري' as const, organs: ['الكبد والقلب', 'الأكياس الهوائية', 'الأمعاء'], lab: true, note: 'عند الاشتباه البكتيري تُفضّل العينة والفحص والحساسية متى كان ذلك متاحاً قبل اختيار المضاد.' };
    if (/عفن|سموم|فطري|علف متعفن/.test(t)) return { group: 'فطري/سموم' as const, organs: ['الكبد', 'المعدة الغدية', 'الأمعاء'], lab: true, note: 'يتم توثيق العلف والتخزين والكبد والأمعاء، وقد يلزم تحليل علف/سموم حسب قرار الطبيب.' };
    return { group: 'غير محدد' as const, organs: ['القصبة الهوائية', 'الكبد والقلب', 'الأمعاء', 'المعدة الغدية'], lab: false, note: 'المعطيات غير كافية للتصنيف؛ الصور والصوت واتجاه الاستهلاك تساعد الطبيب على تضييق الاحتمالات.' };
  };

  const submitTriage = () => {
    if (!triage.customer_name.trim() || !triage.phone.trim() || !triage.detailed_address.trim() || !triage.symptoms_description.trim()) { setTriageNotice('أكمل اسم العميل والهاتف والعنوان وشرح الحالة قبل الإرسال.'); return; }
    const decision = triageDecision(triage.symptoms_description);
    const localLab = laboratories.find((l) => l.active && (l.governorate.includes(triage.governorate) || triage.governorate.includes(l.governorate)));
    const mortalityPct = triage.flock_size > 0 ? (triage.mortality_today / triage.flock_size) * 100 : 0;
    const labRecommended = decision.lab && !triage.remote_area_without_lab;
    const item: ClinicalTriageCase = {
      id: `clinical-${Date.now()}`, case_number: `CASE-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`, created_at: new Date().toISOString(),
      customer_name: triage.customer_name.trim(), phone: triage.phone.trim(), governorate: triage.governorate, district: triage.district || 'غير محدد', detailed_address: triage.detailed_address.trim(),
      flock_size: Number(triage.flock_size), age_days: Number(triage.age_days), mortality_today: Number(triage.mortality_today), average_weight_grams: Number(triage.average_weight_grams),
      feed_kg: Number(triage.feed_kg), water_liters: Number(triage.water_liters), temperature_celsius: Number(triage.temperature_celsius), humidity_percent: Number(triage.humidity_percent),
      symptoms_description: triage.symptoms_description.trim(), droppings_image_url: triage.droppings_image_url || undefined, barn_image_url: triage.barn_image_url || undefined, litter_image_url: triage.litter_image_url || undefined, audio_url: triage.audio_url || undefined,
      necropsy_images: triage.necropsy_images, ai_suspected_group: decision.group, ai_requested_organs: decision.organs,
      ai_triage_note: `${decision.note} معدل النافق اليومي التقريبي ${mortalityPct.toFixed(2)}%. ${localLab && labRecommended ? `المختبر الأقرب المسجل: ${localLab.name} — زمن النتيجة التقريبي ${localLab.turnaround_hours} ساعة.` : triage.remote_area_without_lab ? 'المنطقة بعيدة عن المختبر؛ تُرفع الحالة للطبيب لتحديد قرار ميداني آمن دون تأخير غير ضروري.' : ''}`,
      laboratory_recommended: labRecommended,
      lab_reason: labRecommended ? 'الحالة قد تستفيد من تأكيد مخبري/حساسية بحسب تقييم الطبيب قبل قرار علاجي حاسم.' : undefined,
      recommended_lab_id: localLab && labRecommended ? localLab.id : undefined,
      recommended_lab_name: localLab && labRecommended ? localLab.name : undefined,
      recommended_lab_address: localLab && labRecommended ? localLab.address : undefined,
      recommended_lab_phone: localLab && labRecommended ? localLab.phone : undefined,
      sample_collection_required: labRecommended,
      field_visit_for_sample_required: labRecommended,
      remote_area_without_lab: triage.remote_area_without_lab,
      status: 'submitted'
    };
    onSubmitClinicalCase?.(item);
    const labMessage = item.laboratory_recommended
      ? ` الحالة تحتاج تقييماً مخبرياً مبدئياً؛ تم ترشيح ${item.recommended_lab_name || 'مختبر المنطقة'}، وسيُطلب من الطبيب/المشرف تنسيق النزول الميداني وأخذ العينة قبل القرار العلاجي عند الحاجة.`
      : item.remote_area_without_lab
        ? ' المنطقة بعيدة عن المختبر؛ سيقيّم الطبيب الملف والأدلة ويحدد خطة ميدانية آمنة وما إذا كان يمكن التعامل ميدانياً أو يلزم نقل عينة لاحقاً.'
        : '';
    setTriageNotice(`تم إرسال ${item.case_number}. ${item.ai_requested_organs.length ? `الأعضاء المطلوبة للتصوير: ${item.ai_requested_organs.join('، ')}.` : ''}${labMessage} سيصل الملف للطبيب/المشرف المداوم، وسأبقيك على خطوات الأمان والدعم التشغيلي حتى يرد.`);
  };

  const addNecropsyImage = async (organ: string, file?: File) => {
    if (!file) return;
    const url = await fileToDataUrl(file);
    setTriage((prev) => ({ ...prev, necropsy_images: [...prev.necropsy_images.filter((n) => n.organ_name !== organ), { organ_name: organ, image_url: url }] }));
  };

  if (!isOpen) return null;

  const quickPrompts = [
    'عندي نافق مرتفع وأريد فتح حالة الآن',
    'رشح لي ما أحتاجه لقطيع جديد حسب العدد والعمر',
    'قارن لي بين العلف أو المعدات حسب القيمة والتكلفة',
    'ما هي عروض الشركات المتعاقدة والخصومات؟',
    'حلل استهلاك العلف والماء عندي',
    'احسب تجهيزات التحضين والدفايات',
    'اشرح لي الأمراض الفيروسية وأهم علامات الخطر',
    'اشرح الأمراض البكتيرية والميكوبلازما',
    'اشرح الكوكسيديا والطفيليات',
    'أريد إشراف بيطري ونزول ميداني حتى التسويق',
    'أريد شراء علاج أو لقاح أو علف',
    'متى أحتاج فحص مختبر؟',
    'اعطني قائمة فحص للأمان الحيوي'
  ];

  const buildReply = (text: string) => {
    const sizing = answerPoultrySizingQuestionR81(text, /[\u0600-\u06ff]/.test(text) ? 'ar' : 'en');
    if (sizing) return { reply: sizing.reply, escalation: false };
    const lower = text.toLowerCase();
    let escalation = false;
    let reply = '';

    if (lower.includes('نافق') || lower.includes('نفوق') || lower.includes('يموت') || lower.includes('موت مرتفع')) {
      escalation = true;
      setTriageOpen(true);
      reply = 'سأفتح لك ملف حالة مستقل الآن. لا تقلق من ناحية تنظيم الخطوات: سأجمع بيانات القطيع والصوت وصور الإسهال والعنبر والفرشة، ثم أحدد الأعضاء التي ينبغي تصويرها وأرسل الملف إلى الطبيب/المشرف المداوم. لا أؤخر الحالات الخطرة بانتظار محادثة عامة.';
    } else if (lower.includes('استهلاك') || lower.includes('علف') || lower.includes('ماء') || lower.includes('مياه')) {
      reply =
        `**تحليل الاستهلاك الحالي:**\n` +
        `• العدد: ${flockSize.toLocaleString()} طائر — العمر: ${ageDays} يوم.\n` +
        `• العلف المسجل: ${feedKg.toLocaleString()} كجم = ${calculator.feedPerBirdG.toFixed(1)} جم/طائر.\n` +
        `• الماء المسجل: ${waterLiters.toLocaleString()} لتر = ${calculator.waterPerBirdMl.toFixed(0)} مل/طائر.\n` +
        `• نسبة الماء إلى العلف: ${calculator.waterFeedRatio.toFixed(2)} لتر/كجم.\n\n` +
        'أتعامل مع هذه الأرقام كمؤشرات تشغيلية، ثم أقارنها بمنحنى السلالة والعمر والحرارة. أي تغير مفاجئ عن الأيام السابقة أهم من رقم منفرد؛ انخفاض الماء أو العلف مع ارتفاع النافق يستدعي فتح ملف حالة للطبيب.';
    } else if (lower.includes('تحضين') || lower.includes('دفاي') || lower.includes('تجهيز')) {
      reply =
        `**تقدير تجهيزات القطيع حسب السعات التي أدخلتها:**\n` +
        `• سقايات/نقاط خدمة: ${calculator.drinkers} وحدة تقريباً عند ${birdsPerDrinker} طائر/وحدة.\n` +
        `• معالف: ${calculator.feeders} وحدة تقريباً عند ${birdsPerFeeder} طائر/وحدة.\n` +
        `• دفايات: ${calculator.heaters} وحدة تقريباً عند ${birdsPerHeater} طائر/دفاية.\n\n` +
        'العدد النهائي يعتمد على نوع الجهاز وقدرته الحرارية ومساحة العنبر والعزل ودرجة الحرارة الخارجية. غيّر سعة كل جهاز في الحاسبة حسب الداتا شيت الفعلية للمعدة.';
    } else if (lower.includes('فيروسي') || lower.includes('نيوكاسل') || lower.includes('جمبورو') || lower.includes('ib')) {
      escalation = true;
      reply =
        '**مسار الأمراض الفيروسية:**\n' +
        'يشمل النظام التوعية والفرز الأولي لأمراض مثل النيوكاسل، الجمبورو، والتهاب الشعب الهوائية المعدي وغيرها. أراجع العمر، التحصينات، سرعة انتشار الأعراض، النفوق، الأعراض التنفسية/العصبية، وصور التشريح.\n\n' +
        'الذكاء الاصطناعي لا يثبت المرض وحده ولا يصف مضاداً حيوياً للفيروس. عند الاشتباه المرتفع يتم طلب صور الأعضاء المناسبة ورفع الحالة للطبيب وربطها بالتحاليل المخبرية عند الحاجة.';
    } else if (lower.includes('مضاد') || lower.includes('انتيبيوتك') || lower.includes('antibiotic')) {
      escalation = true;
      reply =
        '**المضادات الحيوية — قرار طبي وليس تجربة عشوائية:**\n' +
        'الاستخدام العشوائي قد يرفع مقاومة البكتيريا، يخفي السبب الحقيقي للمرض، يسبب فشل العلاج لاحقاً، ويضيف مخاطر بقايا الدواء وفترة السحب. لذلك أستطيع تسجيل طلب الشراء وجمع ملف القطيع، لكن لا أصرح باستخدام المضاد أو جرعته النهائية بدون الطبيب.\n\n' +
        'أرسل العمر، العدد، النافق، العلف والماء، الحرارة والرطوبة، الأعراض، صور الإسهال والتشريح وصوت التنفس عند الحاجة. إذا كان الاشتباه بكتيرياً فقد يطلب الطبيب زراعة وحساسية قبل اختيار المادة الفعالة.';
    } else if (lower.includes('بكتيري') || lower.includes('كولاي') || lower.includes('ميكوبلاز') || lower.includes('ميكروب')) {
      escalation = true;
      reply =
        '**مسار الأمراض البكتيرية والميكوبلازما:**\n' +
        'أجمع: عدد القطيع، العمر، النافق، الحرارة، العلف، الماء، وصف التنفس/الإسهال، وصور التشريح. أفرق بين الاشتباه البكتيري الأولي وبين المضاعفات الثانوية، وأوصي بإجراءات الأمان الحيوي والعزل.\n\n' +
        'إذا طُلب مضاد حيوي، يُفتح ملف موافقة للطبيب. لا يعتبر شراء المضاد إذناً باستخدامه؛ الاستخدام يبدأ فقط بعد اعتماد الطبيب للسبب والجرعة وفترة السحب، وقد يطلب فحص حساسية بكتيرية.';
    } else if (lower.includes('طفيلي') || lower.includes('كوكس') || lower.includes('ديدان')) {
      escalation = true;
      reply =
        '**مسار الأمراض الطفيلية والكوكسيديا:**\n' +
        'يركز النظام على العمر، طبيعة الإسهال، وجود دم أو مخاط، رطوبة الفرشة، النفوق، وصور الأمعاء والأعورين. تُعرض للعميل صور إرشادية للأعضاء المطلوب تصويرها ثم تُرسل الصور الأصلية للطبيب بدقة كاملة للمراجعة.';
    } else if (lower.includes('فطري') || lower.includes('سموم') || lower.includes('عفن')) {
      escalation = true;
      reply =
        '**مسار الأمراض الفطرية والسموم:**\n' +
        'أراجع تخزين العلف والرطوبة والرائحة وتغير اللون، الأداء الإنتاجي وصور الكبد/الأمعاء عند الاشتباه. يتم التركيز أولاً على وقف مصدر الخطر وتحسين التخزين والأمان الحيوي، ثم إحالة الحالة للطبيب أو المختبر عندما تكون الأعراض مرضية.';
    } else if (lower.includes('إشراف') || lower.includes('اشراف') || lower.includes('نزول') || lower.includes('متابعة') || lower.includes('حتى التسويق')) {
      reply =
        '**الإشراف البيطري والمتابعة حتى التسويق:**\n' +
        'أستطيع تنظيم طلب إشراف يبدأ من متابعة العلف والماء والحرارة والرطوبة والتهوية والأمان الحيوي، ويمتد إلى برنامج اللقاحات، مراجعة العلاجات المعتمدة، النزول الميداني عند الحاجة، ثم تجهيز القطيع للتسويق.\n\n' +
        'التكلفة لا تُفرض عليك بشكل عشوائي؛ تحسبها المنصة حسب عدد الهناجر وحجم القطيع والباقـة التي تختارها، وتعرضها لك قبل التأكيد. وجود متابعة منتظمة يساعد على اكتشاف الانحراف مبكراً وتقليل الهدر والمخاطر، لكن القرار النهائي بالاشتراك لك. افتح زر «إشراف بيطري ومتابعة» لمشاهدة السعر والموافقة.';
    } else if (lower.includes('شراء') || lower.includes('اشتري') || lower.includes('علاج') || lower.includes('لقاح') || lower.includes('معدات')) {
      reply =
        '**مساعدة الشراء:**\n' +
        'عند اختيار أي صنف أجمع اسم العميل ورقم الهاتف والعنوان والمنطقة، ثم أعرض سعر الصنف وأجرة النقل ووقت التوصيل والفرع المسؤول قبل التأكيد. إذا كانت المنطقة جديدة، تُرسل بياناتها للإدارة لتحديد الأجرة ومدة التوصيل ثم تعود لك للموافقة.\n\n' +
        'بعد موافقتك تظهر حسابات التحويل التي تعتمدها الإدارة، وترفع صورة الحوالة ليتم إرسالها للمالية. لا يتحول الطلب إلى مدفوع إلا بعد تأكيد وصول المبلغ. وإذا كان الصنف مضاداً حيوياً، يمكن طلب شرائه لكن لا يُعتمد للاستخدام قبل مراجعة الطبيب وملف الحالة.';
    } else if (lower.includes('مختبر') || lower.includes('فحص') || lower.includes('عينة') || lower.includes('حساسية')) {
      const localLab = laboratories.find((l) => l.active && (l.governorate.includes(customerGovernorate) || customerGovernorate.includes(l.governorate)));
      escalation = true;
      reply = localLab
        ? `**الفحص المخبري:**\nالمختبر المسجل الأقرب في النظام: ${localLab.name} — ${localLab.address}. رسوم أخذ العينة المرجعية ${localLab.sample_collection_fee_yer.toLocaleString()} ريال، وسعر الفحص الأساسي ${localLab.base_test_price_yer.toLocaleString()} ريال، والنتيجة التقريبية خلال ${localLab.turnaround_hours} ساعة.\n\nإذا كانت الحالة تستدعي فحصاً، سأفتح ملف حالة وأرسله للطبيب/المشرف المداوم لتنسيق النزول وأخذ العينة. المساعد لا يقرر المضاد بناءً على التخمين.`
        : '**الفحص المخبري:**\nلا يوجد مختبر نشط مسجل لهذه المحافظة حالياً. سأرفع الحالة للطبيب/المشرف؛ وإذا كانت المنطقة بعيدة عن المختبر يحدد الطبيب، بناءً على شدة الحالة والأدلة الميدانية، هل يلزم أخذ عينة/نقلها أم يمكن وضع خطة ميدانية آمنة مؤقتة.';
    } else if (lower.includes('أمان') || lower.includes('حيوي') || lower.includes('تطهير') || lower.includes('توعية')) {
      reply =
        '**قائمة فحص الأمان الحيوي:**\n' +
        '1. منع الدخول غير الضروري وتسجيل الزوار.\n2. نقطة تطهير للأحذية والمركبات مع تغيير المطهر بانتظام.\n3. فصل الأدوات بين العنابر وعدم مشاركتها دون تطهير.\n4. مكافحة القوارض والحشرات والطيور البرية.\n5. عزل النافق والتخلص الآمن منه.\n6. مراقبة الماء والعلف والحرارة والرطوبة يومياً.\n7. أي ارتفاع غير معتاد في النفوق أو أعراض تنفسية ينتقل لمسار البلاغ الطبي.';
    } else {
      escalation = true;
      reply =
        `فهمت سؤالك: «${text}». أستطيع مساعدتك تشغيلياً، لكن للحصول على تحليل دقيق أحتاج: عدد الطيور، العمر، استهلاك العلف والماء، النافق اليوم، درجة الحرارة والرطوبة، والأعراض الرئيسية. إذا كانت الحالة مرضية سأطلب صور الإسهال وصور التشريح المناسبة وأرفعها للطبيب للمصادقة.`;
    }
    return { reply, escalation };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isTyping) return;
    setMessages((prev) => [
      ...prev,
      { id: `msg-u-${Date.now()}`, sender: 'user', text, timestamp: 'الآن' }
    ]);
    setInputMessage('');
    setIsTyping(true);
    setAdvisorNotice('');

    // Local rules always run first so emergency/triage UI still opens even if the backend is unavailable.
    const local = buildReply(text);
    if (!externalAIEnabled) {
      setAdvisorNotice('الاتصال الخارجي بالذكاء الاصطناعي متوقف من إعدادات المالك؛ المساعد المحلي الآمن يعمل الآن ويمكنه فتح الحالات وإرشاد المستخدم.');
      setMessages((prev) => [
        ...prev,
        { id: `msg-a-${Date.now()}`, sender: 'assistant', text: local.reply, timestamp: 'الآن', requires_vet_escalation: local.escalation }
      ]);
      setIsTyping(false);
      return;
    }
    try {
      const answer = await apiService.poultryAdvisorAI({
        message: text,
        customer_context: {
          name: customerName,
          phone: customerPhone,
          governorate: customerGovernorate,
          district: customerDistrict,
          address: customerAddress
        },
        flock_context: {
          flock_size: flockSize,
          age_days: ageDays,
          feed_kg: feedKg,
          water_liters: waterLiters,
          feed_per_bird_g: Number(calculator.feedPerBirdG.toFixed(1)),
          water_per_bird_ml: Number(calculator.waterPerBirdMl.toFixed(0)),
          water_feed_ratio: Number(calculator.waterFeedRatio.toFixed(2))
        }
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-a-${Date.now()}`,
          sender: 'assistant',
          text: answer.reply || local.reply,
          timestamp: 'الآن',
          requires_vet_escalation: Boolean(answer.requires_vet_escalation || local.escalation)
        }
      ]);
    } catch (error) {
      setAdvisorNotice(error instanceof Error && /timeout|abort/i.test(error.message) ? 'تعذر الوصول لخدمة الذكاء الاصطناعي خلال المهلة؛ تم تشغيل الرد المحلي الآمن بدلاً منها.' : 'الخدمة الذكية الخارجية غير متاحة حالياً؛ تم تشغيل الرد المحلي الآمن.');
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-a-${Date.now()}`,
          sender: 'assistant',
          text: local.reply,
          timestamp: 'الآن',
          requires_vet_escalation: local.escalation
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#071a24]/96 sm:bg-[#071a24]/85 sm:backdrop-blur-sm flex items-center justify-center p-0 sm:p-3">
      <div className="bg-[#0b2430] border-0 sm:border border-cyan-800/50 rounded-none sm:rounded-3xl w-full max-w-5xl shadow-2xl flex flex-col h-[100dvh] sm:h-[91vh] overflow-hidden" dir="rtl">
        <div className="p-3 sm:p-4 bg-gradient-to-l from-[#12394a] via-[#0c2f3c] to-[#12394a] border-b border-cyan-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-600 flex items-center justify-center text-white"><Bot className="w-5 h-5" /></div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">مستشار الدواجن والبيع الذكي</h3>
              <p className="hidden sm:block text-[11px] text-cyan-100/70">استشارات دواجن • تطوير البيع • تشغيل القطيع • توعية • أمان حيوي • إحالة للطبيب</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 text-slate-300 hover:text-white flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>

        <div className="bg-amber-950/40 border-b border-amber-700/40 px-3 sm:px-4 py-2 flex items-start sm:items-center justify-between gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-amber-200">
          <span className="flex items-center gap-2"><ShieldAlert className="w-4 h-4" /><strong>ضابط طبي:</strong> التحليل إرشادي؛ المضادات الحيوية لا تُستخدم إلا بعد موافقة الطبيب وتسجيل فترة السحب.</span>
          {onConsultVet && <button onClick={() => { onClose(); onConsultVet(); }} className="px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 font-bold whitespace-nowrap">فتح ملف للطبيب</button>}
        </div>

        {!externalAIEnabled && (
          <div className="px-3 sm:px-4 py-2 bg-cyan-950/50 border-b border-cyan-800/40 text-[10px] sm:text-[11px] text-cyan-200">
            المساعد مفتوح ويعمل محلياً. الاتصال الخارجي بالـAI متوقف من لوحة المالك ويمكن إعادة تفعيله لاحقاً دون تعطيل واجهة المساعد.
          </div>
        )}

        <div className="lg:hidden grid grid-cols-3 gap-2 p-2 border-b border-cyan-900/40 bg-[#071b25]">
          <button onClick={() => setMobilePanel('chat')} className={`py-2 rounded-xl text-[11px] font-black ${mobilePanel === 'chat' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-300'}`}>المحادثة</button>
          <button onClick={() => setMobilePanel('calculator')} className={`py-2 rounded-xl text-[11px] font-black ${mobilePanel === 'calculator' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-300'}`}>حاسبة القطيع</button>
          <button onClick={() => setTriageOpen(true)} className="py-2 rounded-xl text-[11px] font-black bg-rose-950/70 border border-rose-800/50 text-rose-200">ملف حالة</button>
        </div>

        {advisorNotice && <div className="px-3 py-2 text-[10px] sm:text-[11px] bg-amber-950/35 border-b border-amber-800/40 text-amber-200">{advisorNotice}</div>}

        <div className="grid grid-rows-[minmax(0,1fr)] lg:grid-cols-[320px_1fr] min-h-0 flex-1 overflow-hidden">
          <aside className={`${mobilePanel === 'calculator' ? 'block' : 'hidden'} lg:block p-3 sm:p-4 border-l border-cyan-900/40 bg-[#081f2a] overflow-y-auto space-y-4`}>
            <div className="flex items-center gap-2 text-white font-black text-xs"><Calculator className="w-4 h-4 text-cyan-400" /> حاسبة القطيع الذكية</div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <Field label="عدد الطيور" value={flockSize} onChange={setFlockSize} />
              <Field label="العمر/يوم" value={ageDays} onChange={setAgeDays} />
              <Field label="العلف كجم/يوم" value={feedKg} onChange={setFeedKg} />
              <Field label="الماء لتر/يوم" value={waterLiters} onChange={setWaterLiters} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Metric icon={<Wheat className="w-3.5 h-3.5" />} label="علف/طير" value={`${calculator.feedPerBirdG.toFixed(1)} جم`} />
              <Metric icon={<Droplets className="w-3.5 h-3.5" />} label="ماء/طير" value={`${calculator.waterPerBirdMl.toFixed(0)} مل`} />
            </div>

            <div className="pt-3 border-t border-cyan-900/40 space-y-2">
              <div className="text-[11px] font-bold text-cyan-100">سعة الأجهزة الفعلية</div>
              <Field label="طائر لكل سقاية/نقطة" value={birdsPerDrinker} onChange={setBirdsPerDrinker} />
              <Field label="طائر لكل معلف" value={birdsPerFeeder} onChange={setBirdsPerFeeder} />
              <Field label="طائر لكل دفاية" value={birdsPerHeater} onChange={setBirdsPerHeater} />
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                <EquipmentMetric label="سقايات" value={calculator.drinkers} icon={<Droplets className="w-3 h-3" />} />
                <EquipmentMetric label="معالف" value={calculator.feeders} icon={<Wheat className="w-3 h-3" />} />
                <EquipmentMetric label="دفايات" value={calculator.heaters} icon={<Flame className="w-3 h-3" />} />
              </div>
              <p className="text-[9px] text-slate-500 leading-relaxed">هذه أداة تخطيط. أدخل سعة الجهاز من كتالوج الشركة؛ القدرة الحرارية والتهوية تعتمد أيضاً على مساحة العنبر والعزل والمناخ.</p>
            </div>

            <button onClick={() => setTriageOpen(true)} className="w-full py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-700/50 text-rose-200 text-xs font-black flex items-center justify-center gap-2"><ClipboardList className="w-4 h-4" /> فتح بلاغ مرضي وجمع الأدلة</button>

            <div className="pt-3 border-t border-cyan-900/40 space-y-2">
              <div className="text-[11px] font-bold text-white flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> صلاحيات المساعد</div>
              <div className="text-[10px] text-slate-400 leading-5">✓ حساب الاستهلاك والتجهيزات<br/>✓ إرشاد التحضين والتهوية<br/>✓ توعية بالأمراض والأمان الحيوي<br/>✓ مقارنة الخيارات والبيع المهني<br/>✓ شرح الأسعار والخصومات المعتمدة<br/>✓ جمع بيانات الحالة والصور<br/>✕ لا يعتمد التشخيص النهائي<br/>✕ لا يصرح باستخدام المضاد دون الطبيب</div>
            </div>
          </aside>

          <section className={`${mobilePanel === 'chat' ? 'flex' : 'hidden'} lg:flex flex-col min-h-0 overflow-hidden`}>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'assistant' && <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-300 flex items-center justify-center shrink-0"><Bot className="w-4 h-4" /></div>}
                  <div className={`max-w-[88%] rounded-2xl p-4 whitespace-pre-line leading-relaxed ${msg.sender === 'user' ? 'bg-cyan-700 text-white' : 'bg-[#071b25] border border-cyan-900/40 text-slate-200'}`}>
                    {msg.text}
                    {msg.requires_vet_escalation && <div className="mt-3 pt-2 border-t border-amber-800/30 text-amber-300 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> الحالة المرضية تحتاج مراجعة الطبيب قبل أي قرار علاجي.</div>}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[11px] text-cyan-300 flex items-center gap-2"><Bot className="w-4 h-4 animate-pulse" /> جاري تحليل البيانات...</div>}
            </div>

            <div className="px-4 py-2 border-t border-cyan-900/30 flex gap-2 overflow-x-auto bg-[#081f2a]">
              {quickPrompts.map((q) => <button key={q} onClick={() => handleSendMessage(q)} className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-cyan-900/40 text-[10px] text-cyan-100 whitespace-nowrap">{q}</button>)}
            </div>
            <div className="p-2.5 sm:p-3 border-t border-cyan-900/40 bg-[#061922] flex items-center gap-2 mobile-bottom-safe">
              <input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="مثال: عندي 12000 طير عمر 18 يوم واستهلاك الماء انخفض..." className="flex-1 bg-[#0d2b38] border border-cyan-900/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-500" />
              <button onClick={() => handleSendMessage()} disabled={!inputMessage.trim() || isTyping} className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1"><Send className="w-3.5 h-3.5" /> إرسال</button>
            </div>
          </section>
        </div>
      </div>

      {triageOpen && (
        <div className="absolute inset-0 z-20 bg-[#061922]/95 overflow-y-auto p-3 sm:p-6" dir="rtl">
          <div className="max-w-4xl mx-auto bg-[#0b2733] border border-rose-800/50 rounded-3xl p-5 space-y-4">
            <div className="flex justify-between items-start"><div><h3 className="font-black text-white flex items-center gap-2"><Stethoscope className="w-5 h-5 text-rose-400" /> ملف الحالة المرضية الذكي</h3><p className="text-[11px] text-slate-400 mt-1">كل حالة ترسل منفصلة للطبيب/المشرف. المساعد يجمع الأدلة ولا يعتمد علاجاً نهائياً.</p></div><button onClick={()=>setTriageOpen(false)} className="text-slate-400"><X className="w-5 h-5" /></button></div>
            <div className="grid sm:grid-cols-3 gap-2 text-[11px]">
              <TextField label="اسم العميل" value={triage.customer_name} onChange={(v)=>setTriage({...triage,customer_name:v})} />
              <TextField label="رقم الهاتف" value={triage.phone} onChange={(v)=>setTriage({...triage,phone:v})} />
              <TextField label="المحافظة" value={triage.governorate} onChange={(v)=>setTriage({...triage,governorate:v})} />
              <TextField label="المديرية / المنطقة" value={triage.district} onChange={(v)=>setTriage({...triage,district:v})} />
              <div className="sm:col-span-2"><TextField label="العنوان بالتفصيل" value={triage.detailed_address} onChange={(v)=>setTriage({...triage,detailed_address:v})} /></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Field label="عدد القطيع" value={triage.flock_size} onChange={(v)=>setTriage({...triage,flock_size:v})} /><Field label="العمر/يوم" value={triage.age_days} onChange={(v)=>setTriage({...triage,age_days:v})} /><Field label="النافق اليوم" value={triage.mortality_today} onChange={(v)=>setTriage({...triage,mortality_today:v})} /><Field label="متوسط الوزن/جم" value={triage.average_weight_grams} onChange={(v)=>setTriage({...triage,average_weight_grams:v})} /><Field label="العلف كجم" value={triage.feed_kg} onChange={(v)=>setTriage({...triage,feed_kg:v})} /><Field label="الماء لتر" value={triage.water_liters} onChange={(v)=>setTriage({...triage,water_liters:v})} /><Field label="الحرارة °C" value={triage.temperature_celsius} onChange={(v)=>setTriage({...triage,temperature_celsius:v})} /><Field label="الرطوبة %" value={triage.humidity_percent} onChange={(v)=>setTriage({...triage,humidity_percent:v})} />
            </div>
            <label className="block text-[11px] text-slate-400 space-y-1"><span>اشرح ما تلاحظه بالتفصيل: التنفس، الإسهال، الحركة، الشهية، تغير الوزن، وقت بداية المشكلة</span><textarea rows={4} value={triage.symptoms_description} onChange={e=>setTriage({...triage,symptoms_description:e.target.value})} className="w-full bg-[#071b25] border border-cyan-900/50 rounded-xl p-3 text-white resize-none" /></label>
            <div className="grid sm:grid-cols-4 gap-2 text-[10px]">
              <FileField label="صورة الإسهال" accept="image/*" onFile={async f=>setTriage({...triage,droppings_image_url:await fileToDataUrl(f)})} />
              <FileField label="صورة العنبر/التهوية" accept="image/*" onFile={async f=>setTriage({...triage,barn_image_url:await fileToDataUrl(f)})} />
              <FileField label="صورة الفرشة" accept="image/*" onFile={async f=>setTriage({...triage,litter_image_url:await fileToDataUrl(f)})} />
              <FileField label="صوت الشخير/التنفس" accept="audio/*" onFile={async f=>setTriage({...triage,audio_url:await fileToDataUrl(f)})} />
            </div>
            {triage.symptoms_description && (()=>{ const d=triageDecision(triage.symptoms_description); return <div className="bg-violet-950/25 border border-violet-800/40 rounded-2xl p-4 text-[11px]"><div className="font-black text-violet-200">التوجيه التشريحي المقترح: {d.group}</div><div className="text-slate-300 mt-1">{d.note}</div><div className="grid sm:grid-cols-2 gap-2 mt-3">{d.organs.map(org=>{ const guide=necropsyGuides.find(g=>g.organ_name===org); return <label key={org} className="p-3 rounded-xl bg-[#071b25] border border-cyan-900/40 text-cyan-100"><div className="font-bold mb-1">صوّر: {org}</div>{guide?.image_url && guide.approved_by_admin ? <img src={guide.image_url} alt={`دليل ${org}`} className="w-full h-28 object-contain bg-white/95 rounded-lg mb-2" /> : <div className="h-16 rounded-lg border border-dashed border-amber-800/50 text-amber-300 flex items-center justify-center text-center p-2 mb-2">الصورة المرجعية المعتمدة لم تُرفع من الإدارة بعد</div>}<div className="text-[9px] text-slate-400 mb-2">{guide?.instructions || 'التقط صورة واضحة قريبة ومضاءة، مع ظهور العضو كاملاً.'}</div><input type="file" accept="image/*" capture="environment" onChange={e=>addNecropsyImage(org,e.target.files?.[0])} className="w-full text-[9px] text-slate-300" /></label>})}</div></div>})()}
            <label className="flex items-center gap-2 text-[11px] text-amber-200 bg-amber-950/20 border border-amber-800/30 rounded-xl p-3"><input type="checkbox" checked={triage.remote_area_without_lab} onChange={e=>setTriage({...triage,remote_area_without_lab:e.target.checked})} /> المنطقة بعيدة عن المختبرات أو الوصول للمختبر متعذر حالياً.</label>
            {triageNotice && <div className="bg-emerald-950/30 border border-emerald-700/40 rounded-xl p-3 text-[11px] text-emerald-200">{triageNotice}</div>}
            <button onClick={submitTriage} className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black">إرسال الملف للطبيب/المشرف المداوم</button>
          </div>
        </div>
      )}
    </div>
  );
};

const Field: React.FC<{ label: string; value: number; onChange: (v: number) => void }> = ({ label, value, onChange }) => (
  <label className="space-y-1 text-[10px] text-slate-400 block">
    <span>{label}</span>
    <input type="number" min={0} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full bg-[#0c2b37] border border-cyan-900/50 rounded-lg p-2 text-white font-mono outline-none focus:border-cyan-500" />
  </label>
);

const TextField: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <label className="space-y-1 text-[10px] text-slate-400 block"><span>{label}</span><input value={value} onChange={e=>onChange(e.target.value)} className="w-full bg-[#0c2b37] border border-cyan-900/50 rounded-lg p-2 text-white outline-none focus:border-cyan-500" /></label>
);

const FileField: React.FC<{ label: string; accept: string; onFile: (file: File) => void }> = ({ label, accept, onFile }) => (
  <label className="p-3 rounded-xl bg-[#071b25] border border-cyan-900/40 text-slate-300"><span className="block mb-2 font-bold">{label}</span><input type="file" accept={accept} capture={accept.startsWith('image') ? 'environment' : undefined} onChange={e=>{const f=e.target.files?.[0]; if(f) onFile(f);}} className="w-full text-[9px]" /></label>
);

const Metric: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-[#0c2b37] border border-cyan-900/50 rounded-xl p-2.5 text-center"><div className="text-cyan-400 flex justify-center">{icon}</div><div className="text-[9px] text-slate-500 mt-1">{label}</div><div className="text-xs text-white font-black mt-0.5">{value}</div></div>
);

const EquipmentMetric: React.FC<{ label: string; value: number; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-[#0c2b37] border border-cyan-900/40 rounded-lg p-2"><div className="flex justify-center text-emerald-400">{icon}</div><div className="text-white font-black mt-1">{value}</div><div className="text-slate-500">{label}</div></div>
);
