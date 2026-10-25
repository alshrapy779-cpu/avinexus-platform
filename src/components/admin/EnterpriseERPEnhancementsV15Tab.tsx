import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Database, RefreshCw, GitMerge, BrainCircuit, Stethoscope, Wheat, ShieldCheck,
  Bluetooth, Printer, Scale, Download, Upload, BarChart3, CheckCircle2, AlertTriangle,
  Smartphone, CloudCog, FileSpreadsheet, Activity, TrendingUp, WifiOff, HardDrive,
  Syringe, MapPinned
} from 'lucide-react';
import { SmartOperationsState, SyncConflictStrategyV15 } from '../../types';
import { offlineDatabaseV15 } from '../../services/offlineDatabaseV15';
import { recalculateFeedFormulaV15 } from '../../services/feedFormulationV15';
import { calculateDiseaseRiskV15 } from '../../services/predictiveAnalyticsV15';
import { hardwareV15 } from '../../services/hardwareV15';
import { exportCsvV15, exportEnterpriseXlsxV15, parseEnterpriseWorkbookV15 } from '../../services/dataExchangeV15';
import { apiService } from '../../services/apiService';

interface Props {
  operations: SmartOperationsState;
  onUpdateOperations: (operations: SmartOperationsState) => void;
}

type Section = 'offline' | 'ai' | 'feed_biosecurity' | 'hardware' | 'reports';

export const EnterpriseERPEnhancementsV15Tab: React.FC<Props> = ({ operations, onUpdateOperations }) => {
  const enterprise = operations.enterprise;
  const [section, setSection] = useState<Section>('offline');
  const [storage, setStorage] = useState({ usage: 0, quota: 0 });
  const [queueCount, setQueueCount] = useState(0);
  const [hardwareMessage, setHardwareMessage] = useState('');
  const [syncMessage, setSyncMessage] = useState('');
  const [pairedDevices, setPairedDevices] = useState<Array<{name?:string;address:string}>>([]);
  const [printerAddress, setPrinterAddress] = useState('');
  const [scaleAddress, setScaleAddress] = useState('');
  const [importPreview, setImportPreview] = useState<Record<string, any[]> | null>(null);
  const [selectedFormulaId, setSelectedFormulaId] = useState(enterprise.feed_formulation_v15.formulas[0]?.id || '');
  const [nutritionBirdType, setNutritionBirdType] = useState<'broiler'|'layer'>('broiler');
  const [nutritionAgeDays, setNutritionAgeDays] = useState(21);
  const [nutritionWeightG, setNutritionWeightG] = useState(900);
  const fileRef = useRef<HTMLInputElement>(null);

  const patchEnterprise = (patch: Partial<typeof enterprise>) => {
    onUpdateOperations({ ...operations, enterprise: { ...enterprise, ...patch } });
  };

  const refreshOfflineStats = async () => {
    try {
      const [estimate, queue] = await Promise.all([offlineDatabaseV15.getStorageEstimate(), offlineDatabaseV15.listQueue()]);
      setStorage(estimate);
      setQueueCount(queue.length);
      patchEnterprise({ offline_sync_v15: { ...enterprise.offline_sync_v15, pending_actions: queue.length } });
    } catch {
      setStorage({usage:0,quota:0});
    }
  };

  useEffect(() => { refreshOfflineStats(); }, []);

  const syncNow = async () => {
    setSyncMessage('جاري المزامنة...');
    try {
      const result = await apiService.syncEnterpriseV15(enterprise);
      if (result.enterprise) {
        onUpdateOperations({ ...operations, enterprise: result.enterprise });
        await offlineDatabaseV15.saveSmartOperations({ ...operations, enterprise: result.enterprise });
      }
      const queue = await offlineDatabaseV15.listQueue();
      for (const item of queue) await offlineDatabaseV15.removeQueueItem(item.id);
      setQueueCount(0);
      setSyncMessage(result.conflict ? 'تم اكتشاف تعارض ويحتاج مراجعة حسب السياسة.' : `تمت المزامنة. Server revision: ${result.server_revision}`);
    } catch (e:any) {
      await offlineDatabaseV15.enqueueLatestState(operations);
      setSyncMessage(`تعذر الاتصال بالخادم؛ تم حفظ أحدث حالة في طابور IndexedDB. ${e?.message || ''}`);
      refreshOfflineStats();
    }
  };

  const setConflictStrategy = (strategy: SyncConflictStrategyV15) => patchEnterprise({
    offline_sync_v15: { ...enterprise.offline_sync_v15, conflict_strategy: strategy }
  });

  const resolveConflict = (id: string, resolution: 'client'|'server'|'merged') => patchEnterprise({
    sync_conflicts_v15: enterprise.sync_conflicts_v15.map((c) => c.id === id ? {
      ...c, resolution, resolved_at: new Date().toISOString(), resolved_by: 'System Owner'
    } : c)
  });

  const verifyAssessment = () => {
    const assessment = enterprise.ai_diagnostic_assessments_v14[0];
    if (!assessment) return;
    const existing = enterprise.vet_verification_feedback_v15.some((x) => x.assessment_id === assessment.id);
    if (existing) return;
    const top = assessment.suspected_conditions?.[0];
    patchEnterprise({ vet_verification_feedback_v15: [{
      id:`verify-${Date.now()}`, assessment_id:assessment.id, visit_id:assessment.visit_id, case_id:assessment.case_id,
      ai_top_suggestion:top?.disease || 'غير محدد', ai_confidence_percent:top?.probability_percent || 0,
      vet_confirmed_diagnosis:'بانتظار التشخيص النهائي للطبيب', confirmation_level:'pending_lab', image_labels_verified:[],
      clinical_note:'تم فتح حلقة التحقق البيطري. يجب ربطها بالنتيجة النهائية/المخبرية قبل استخدامها لتحسين النموذج.',
      use_for_model_improvement:true, verified_by:'الطبيب البيطري المعتمد', verified_at:new Date().toISOString()
    }, ...enterprise.vet_verification_feedback_v15] });
  };

  const regenerateRisk = () => {
    const current = enterprise.predictive_performance_v15[0];
    if (!current) return;
    const r = calculateDiseaseRiskV15({
      fcrCurrent:current.fcr_current, fcrBaseline:current.fcr_baseline, feedChangePercent:current.feed_change_percent,
      waterChangePercent:current.water_change_percent, mortalityChangePercent:current.mortality_change_percent,
      temperatureDeltaC:current.temperature_delta_c, humidityDeltaPercent:current.humidity_delta_percent
    });
    patchEnterprise({ predictive_performance_v15: enterprise.predictive_performance_v15.map((x,i) => i === 0 ? {...x, disease_risk_score:r.score, risk_level:r.riskLevel, generated_at:new Date().toISOString()} : x) });
  };

  const autoSelectNutritionProfile = () => {
    const formulas = enterprise.feed_formulation_v15.formulas;
    let stage: 'starter'|'grower'|'finisher'|'layer' = 'grower';
    if (nutritionBirdType === 'layer') stage = 'layer';
    else if (nutritionAgeDays <= 14 || nutritionWeightG < 500) stage = 'starter';
    else if (nutritionAgeDays >= 29 || nutritionWeightG > 1400) stage = 'finisher';
    const target = formulas.find((x)=>x.bird_type===nutritionBirdType && x.stage===stage) || formulas[0];
    if (target) setSelectedFormulaId(target.id);
  };

  const updateFormulaLine = (formulaId:string, ingredientId:string, value:number) => {
    const fs = enterprise.feed_formulation_v15;
    const formulas = fs.formulas.map((f) => {
      if (f.id !== formulaId) return f;
      const edited = {...f, lines:f.lines.map((l) => l.ingredient_id === ingredientId ? {...l, inclusion_percent:value} : l)};
      return recalculateFeedFormulaV15(edited, fs.ingredients);
    });
    patchEnterprise({ feed_formulation_v15:{...fs, formulas, last_recalculated_at:new Date().toISOString()} });
  };

  const refreshBiosecurityFromOutbreaks = () => {
    const runs = enterprise.biosecurity_checklists_v15.map((run) => {
      const nearby = enterprise.outbreak_clusters.filter((c) => c.governorate === run.governorate && (c.district === run.district || c.risk_level === 'critical'));
      if (!nearby.length) return { ...run, outbreak_risk_level:'normal' as const, movement_restriction_active:false, restriction_reason:undefined };
      const critical = nearby.some((c)=>c.risk_level==='critical');
      const high = nearby.some((c)=>c.risk_level==='high');
      return {
        ...run,
        outbreak_risk_level: critical ? 'critical' as const : high ? 'restricted' as const : 'watch' as const,
        movement_restriction_active: critical || high,
        restriction_reason: critical || high ? `رصد ${nearby.length} بؤرة/إشارة وبائية مرتبطة بالنطاق؛ تقييد حركة الأفراد والمركبات غير الضرورية حتى مراجعة الإدارة البيطرية.` : run.restriction_reason
      };
    });
    patchEnterprise({biosecurity_checklists_v15:runs});
  };

  const toggleChecklistItem = (runId:string, itemId:string) => {
    const runs = enterprise.biosecurity_checklists_v15.map((run) => {
      if (run.id !== runId) return run;
      const items = run.items.map((item) => item.id === itemId ? {...item, completed:!item.completed, completed_at:!item.completed ? new Date().toISOString() : undefined, completed_by:!item.completed ? 'المشرف الميداني' : undefined} : item);
      const required = items.filter((x)=>x.required);
      const score = required.length ? Math.round(required.filter((x)=>x.completed).length / required.length * 100) : 100;
      return {...run, items, score_percent:score};
    });
    patchEnterprise({biosecurity_checklists_v15:runs});
  };

  const loadPaired = async () => {
    const devices = await hardwareV15.pairedDevices();
    setPairedDevices(devices);
    setHardwareMessage(devices.length ? `تم العثور على ${devices.length} جهازاً مقترناً.` : 'لا توجد أجهزة مقترنة أو أن التشغيل ليس على Android.');
  };

  const printTest = async () => {
    if (!printerAddress) return setHardwareMessage('اختر/أدخل عنوان طابعة Bluetooth أولاً.');
    try {
      await hardwareV15.print(printerAddress, 'Smart Poultry Platform\nفاتورة اختبار V15\n----------------\nتم الاتصال بالطابعة بنجاح\n\n');
      setHardwareMessage('تم إرسال فاتورة الاختبار إلى الطابعة.');
      patchEnterprise({hardware_integrations_v15: enterprise.hardware_integrations_v15.map((d)=>d.device_type==='thermal_printer'?{...d,bluetooth_address:printerAddress,status:'connected',last_seen_at:new Date().toISOString()}:d)});
    } catch (e:any) { setHardwareMessage(`تعذر الطباعة: ${e?.message || 'تحقق من الاقتران والصلاحيات'}`); }
  };

  const readScale = async () => {
    if (!scaleAddress) return setHardwareMessage('اختر/أدخل عنوان الميزان أولاً.');
    try {
      const result = await hardwareV15.readScale(scaleAddress);
      setHardwareMessage(`قراءة الميزان: ${result.value ?? result.raw} ${result.unit || ''}`);
      patchEnterprise({hardware_integrations_v15: enterprise.hardware_integrations_v15.map((d)=>d.device_type==='digital_scale'?{...d,bluetooth_address:scaleAddress,status:'connected',last_seen_at:new Date().toISOString(),last_value:result.value}:d)});
    } catch (e:any) { setHardwareMessage(`تعذر قراءة الميزان: ${e?.message || 'تحقق من البروتوكول'}`); }
  };

  const checkUpdate = async () => {
    try {
      const result = await hardwareV15.checkUpdate();
      patchEnterprise({app_update_v15:{...enterprise.app_update_v15,last_checked_at:new Date().toISOString(),update_available:result.updateAvailable,available_version_code:result.availableVersionCode,status:result.updateAvailable?'available':'up_to_date'}});
      setHardwareMessage(result.updateAvailable ? `يوجد تحديث إصدار code ${result.availableVersionCode}.` : 'التطبيق محدث أو غير منشور عبر Google Play.');
    } catch { patchEnterprise({app_update_v15:{...enterprise.app_update_v15,last_checked_at:new Date().toISOString(),status:'error'}}); setHardwareMessage('تعذر فحص Google Play In-App Update في هذه البيئة.'); }
  };

  const startUpdate = async () => {
    try { await hardwareV15.startUpdate(); setHardwareMessage('بدأ مسار التحديث من Google Play.'); }
    catch { setHardwareMessage('التحديث داخل التطبيق يتطلب نسخة منشورة عبر Google Play.'); }
  };

  const importWorkbook = async (file:File) => {
    const parsed = await parseEnterpriseWorkbookV15(file);
    setImportPreview(parsed);
    const rows = Object.values(parsed).reduce((s,a)=>s+a.length,0);
    patchEnterprise({data_exchange_jobs_v15:[{id:`exchange-${Date.now()}`,created_at:new Date().toISOString(),direction:'import',format:'xlsx',dataset:Object.keys(parsed).join(','),rows_count:rows,status:'preview',file_name:file.name,note:'تمت القراءة والمعاينة؛ اضغط تطبيق الاستيراد لدمج الجداول المدعومة.'},...enterprise.data_exchange_jobs_v15]});
  };

  const applyImport = () => {
    if (!importPreview) return;
    const patch: Partial<typeof enterprise> = {};
    if (importPreview.Inventory?.length) patch.inventory_lots = importPreview.Inventory as any;
    if (importPreview.RegionalPrices?.length) patch.regional_price_history = importPreview.RegionalPrices as any;
    if (importPreview.Vendors?.length) patch.vendor_reports = importPreview.Vendors as any;
    patch.data_exchange_jobs_v15 = enterprise.data_exchange_jobs_v15.map((j,i)=>i===0?{...j,status:'completed'}:j);
    patchEnterprise(patch);
    setImportPreview(null);
  };

  const refreshExecutive = () => {
    const liveBirds = enterprise.farm_management_contracts_v13.filter((x)=>x.status==='active').reduce((s,x)=>s+x.flock_size,0);
    const fcrs = enterprise.predictive_forecasts_v13.map((x)=>x.current_fcr).filter(Boolean);
    const avgFcr = fcrs.length ? fcrs.reduce((a,b)=>a+b,0)/fcrs.length : 0;
    const audits = enterprise.remote_farm_audits_v13.map((x)=>x.biosecurity_score);
    const bio = audits.length ? audits.reduce((a,b)=>a+b,0)/audits.length : 0;
    const inv = enterprise.inventory_lots.reduce((s,x)=>s+x.quantity_on_hand*x.cost_per_unit_yer,0);
    patchEnterprise({executive_dashboard_v15:{...enterprise.executive_dashboard_v15,generated_at:new Date().toISOString(),gross_revenue_yer:enterprise.financial_kpis.gross_revenue_yer,net_profit_yer:enterprise.financial_kpis.net_profit_yer,active_farms:enterprise.farm_management_contracts_v13.filter(x=>x.status==='active').length,live_birds:liveBirds,average_fcr:Number(avgFcr.toFixed(2)),biosecurity_average_percent:Math.round(bio),open_clinical_cases:enterprise.field_doctor_visits_v14.filter(x=>x.status!=='closed').length,high_risk_farms:enterprise.predictive_performance_v15.filter(x=>['high','critical'].includes(x.risk_level)).length,inventory_value_yer:Math.round(inv),receivables_yer:enterprise.financial_kpis.receivables_yer}});
  };

  const exec = enterprise.executive_dashboard_v15;
  const formula = enterprise.feed_formulation_v15.formulas.find((x)=>x.id===selectedFormulaId) || enterprise.feed_formulation_v15.formulas[0];
  const totalInclusion = formula?.lines.reduce((s,x)=>s+x.inclusion_percent,0) || 0;
  const verificationAccuracy = useMemo(() => {
    const rows=enterprise.vet_verification_feedback_v15.filter(x=>x.confirmation_level!=='pending_lab');
    if(!rows.length) return 0;
    const values=rows.map(x=>x.confirmation_level==='confirmed'?100:x.confirmation_level==='partially_confirmed'?60:0);
    return Math.round(values.reduce((a,b)=>a+b,0)/values.length);
  },[enterprise.vet_verification_feedback_v15]);

  return <div className="space-y-4">
    <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-l from-slate-950 via-emerald-950/20 to-slate-950 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><div className="text-xs text-emerald-300 font-black">V15 • Enterprise ERP Field Scale</div><h3 className="text-xl font-black text-white mt-1">التوسع المؤسسي: Offline • AI • Feed • Hardware • Analytics</h3><p className="text-xs text-slate-400 mt-1">طبقة تشغيل ميداني واسعة السعة مع إدارة تعارض، حلقة تحقق بيطري، تغذية، أمن حيوي، أجهزة Bluetooth، Excel/CSV ولوحة قيادة تنفيذية.</p></div>
        <div className="flex gap-2 flex-wrap"><Badge ok>IndexedDB</Badge><Badge ok>Conflict Engine</Badge><Badge ok>Vet Feedback</Badge><Badge ok>Excel</Badge><Badge>Hardware depends on device</Badge></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">{([
        ['offline','الأوفلاين والمزامنة',Database],['ai','AI والتحقق البيطري',BrainCircuit],['feed_biosecurity','التغذية والأمان الحيوي',Wheat],['hardware','الأجهزة والتحديث',Bluetooth],['reports','التقارير والقيادة',BarChart3]
      ] as const).map(([id,label,Icon])=><button key={id} onClick={()=>setSection(id)} className={`p-3 rounded-xl text-xs font-bold border flex gap-2 items-center ${section===id?'bg-emerald-500 text-slate-950 border-emerald-400':'bg-slate-950/60 text-slate-300 border-slate-800'}`}><Icon className="w-4 h-4"/>{label}</button>)}</div>
    </div>

    {section==='offline' && <div className="grid xl:grid-cols-2 gap-4">
      <Card title="1) IndexedDB + Offline Media Cache" icon={<HardDrive className="w-5 h-5"/>}>
        <div className="grid grid-cols-2 gap-2"><Kpi l="محرك التخزين" v={enterprise.offline_sync_v15.storage_engine}/><Kpi l="الطابور المحلي" v={`${queueCount} عملية`}/><Kpi l="الاستخدام" v={bytes(storage.usage)}/><Kpi l="الحصة المتاحة" v={bytes(storage.quota)}/></div>
        <div className="mt-3 text-xs text-slate-400 leading-6">يخزن V15 حالة المنظومة في IndexedDB، ويجهز مخزن Blobs للصور والصوت أثناء انقطاع الإنترنت. localStorage يبقى كنسخة توافق احتياطية فقط.</div>
        <div className="flex flex-wrap gap-2 mt-3"><button onClick={refreshOfflineStats} className="btn"><RefreshCw className="w-4 h-4"/> تحديث حالة التخزين</button><button onClick={syncNow} className="btn"><CloudCog className="w-4 h-4"/> مزامنة الآن</button></div>{syncMessage&&<div className="box mt-2 text-xs text-cyan-200">{syncMessage}</div>}
      </Card>
      <Card title="2) Conflict Resolution" icon={<GitMerge className="w-5 h-5"/>}>
        <select value={enterprise.offline_sync_v15.conflict_strategy} onChange={(e)=>setConflictStrategy(e.target.value as SyncConflictStrategyV15)} className="input mb-3"><option value="last_write_wins">Last Write Wins</option><option value="server_wins">Server Wins</option><option value="client_wins">Client Wins</option><option value="manual_review">Manual Review</option></select>
        {enterprise.sync_conflicts_v15.map(c=><div key={c.id} className="box text-xs"><div className="flex justify-between gap-2"><b>{c.entity_type} / {c.entity_id}</b><Status s={c.resolution}/></div><div className="text-slate-400 mt-1">{c.field_name}: جهاز = {String(c.client_value)} • خادم = {String(c.server_value)}</div>{c.resolution==='pending'&&<div className="flex gap-2 mt-2"><button className="mini" onClick={()=>resolveConflict(c.id,'client')}>اعتماد الجهاز</button><button className="mini" onClick={()=>resolveConflict(c.id,'server')}>اعتماد الخادم</button><button className="mini" onClick={()=>resolveConflict(c.id,'merged')}>دمج يدوي</button></div>}</div>)}
      </Card>
    </div>}

    {section==='ai' && <div className="space-y-4">
      <div className="grid xl:grid-cols-2 gap-4"><Card title="3) Veterinary Verification Feedback Loop" icon={<Stethoscope className="w-5 h-5"/>}><div className="grid grid-cols-2 gap-2 mb-3"><Kpi l="سجلات تحقق" v={`${enterprise.vet_verification_feedback_v15.length}`}/><Kpi l="مؤشر توافق مبدئي" v={`${verificationAccuracy}%`}/></div>{enterprise.vet_verification_feedback_v15.map(v=><div key={v.id} className="box text-xs"><b>{v.ai_top_suggestion}</b><div className="text-slate-400">AI {v.ai_confidence_percent}% → الطبيب: {v.vet_confirmed_diagnosis}</div><div className="text-emerald-300 mt-1">{v.confirmation_level} • تحسين النموذج: {v.use_for_model_improvement?'نعم':'لا'}</div></div>)}<button onClick={verifyAssessment} className="btn mt-2"><CheckCircle2 className="w-4 h-4"/> فتح تحقق للحالة الأخيرة</button></Card>
      <Card title="4) Predictive Performance Analytics" icon={<TrendingUp className="w-5 h-5"/>}>{enterprise.predictive_performance_v15.map(p=><div key={p.id} className="box text-xs"><div className="flex justify-between"><b>{p.flock_code}</b><Status s={p.risk_level}/></div><div className="grid grid-cols-2 gap-2 mt-2"><Info l="FCR" v={`${p.fcr_current} / ${p.fcr_baseline}`}/><Info l="Risk Score" v={`${p.disease_risk_score}/100`}/><Info l="وزن 7 أيام" v={`${p.predicted_weight_7d_grams} جم`}/><Info l="بيع متوقع" v={p.predicted_harvest_date}/></div><div className="text-amber-300 mt-2">{p.weather_risk_label}</div></div>)}<button onClick={regenerateRisk} className="btn mt-2"><Activity className="w-4 h-4"/> إعادة حساب مؤشر الخطر</button></Card></div>
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-xs text-blue-100"><b>ضابط طبي:</b> حلقة التحقق تحفظ تأكيد الطبيب والنتائج المخبرية كبيانات تدريب/معايرة مستقبلية، لكنها لا تعيد تدريب نموذج طبي تلقائياً داخل الهاتف ولا تحول احتمالات AI إلى تشخيص نهائي.</div>
    </div>}

    {section==='feed_biosecurity' && <div className="grid xl:grid-cols-2 gap-4">
      <Card title="5) Feed Formulation Engine" icon={<Wheat className="w-5 h-5"/>}><div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3"><select value={nutritionBirdType} onChange={e=>setNutritionBirdType(e.target.value as any)} className="input"><option value="broiler">لاحم Broiler</option><option value="layer">بياض Layer</option></select><input type="number" value={nutritionAgeDays} onChange={e=>setNutritionAgeDays(Number(e.target.value))} className="input" placeholder="العمر يوم"/><input type="number" value={nutritionWeightG} onChange={e=>setNutritionWeightG(Number(e.target.value))} className="input" placeholder="الوزن جم"/><button onClick={autoSelectNutritionProfile} className="btn">اختيار البرنامج حسب العمر/الوزن</button></div><select value={formula?.id||''} onChange={e=>setSelectedFormulaId(e.target.value)} className="input mb-3">{enterprise.feed_formulation_v15.formulas.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</select>{formula&&<><div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3"><Kpi l="البروتين" v={`${formula.calculated_protein_percent}%`}/><Kpi l="الطاقة" v={`${formula.calculated_energy_kcal_kg} kcal/kg`}/><Kpi l="Lysine" v={`${formula.calculated_digestible_lysine_percent}%`}/><Kpi l="Ca" v={`${formula.calculated_calcium_percent}%`}/><Kpi l="Av.P" v={`${formula.calculated_available_phosphorus_percent}%`}/><Kpi l="التكلفة/كجم" v={`${formula.calculated_cost_per_kg_yer} ر.ي`}/></div><div className={`text-xs mb-2 ${Math.abs(totalInclusion-100)<.05?'text-emerald-300':'text-rose-300'}`}>إجمالي التركيبة: {totalInclusion.toFixed(2)}% • الحالة: {formula.status}</div><div className="space-y-2">{formula.lines.map(line=><div key={line.ingredient_id} className="grid grid-cols-[1fr_90px] items-center gap-2 text-xs"><span>{line.ingredient_name}<small className="block text-slate-500">{enterprise.feed_formulation_v15.ingredients.find(i=>i.id===line.ingredient_id)?.price_per_kg_yer || 0} ر.ي/كجم • مساهمة تكلفة {(((enterprise.feed_formulation_v15.ingredients.find(i=>i.id===line.ingredient_id)?.price_per_kg_yer || 0)*line.inclusion_percent)/100).toFixed(1)} ر.ي</small></span><input type="number" step="0.1" value={line.inclusion_percent} onChange={e=>updateFormulaLine(formula.id,line.ingredient_id,Number(e.target.value))} className="input py-1.5"/></div>)}</div></>}</Card>
      <Card title="6) Biosecurity Checklist + Movement Control" icon={<ShieldCheck className="w-5 h-5"/>}><button onClick={refreshBiosecurityFromOutbreaks} className="btn mb-3"><RefreshCw className="w-4 h-4"/> تحديث القيود من رادار الأوبئة</button>{enterprise.biosecurity_checklists_v15.map(run=><div key={run.id}><div className="flex justify-between gap-2 mb-2"><div><b className="text-sm">{run.farm_name}</b><div className="text-xs text-slate-400"><MapPinned className="inline w-3 h-3"/> {run.governorate} / {run.district}</div></div><div className="text-left"><div className="text-2xl font-black text-emerald-300">{run.score_percent}%</div><Status s={run.outbreak_risk_level}/></div></div>{run.movement_restriction_active&&<div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-2 text-xs text-rose-200 mb-2">حظر حركة نشط: {run.restriction_reason}</div>}{run.items.map(item=><label key={item.id} className="box flex gap-2 items-start text-xs cursor-pointer"><input type="checkbox" checked={item.completed} onChange={()=>toggleChecklistItem(run.id,item.id)} className="mt-1"/><div><b>{item.label}</b><div className="text-slate-500">{item.frequency} • {item.required?'إلزامي':'اختياري'}</div></div></label>)}</div>)}</Card>
    </div>}

    {section==='hardware' && <div className="grid xl:grid-cols-2 gap-4">
      <Card title="7) Bluetooth Printers & Scales" icon={<Bluetooth className="w-5 h-5"/>}><button onClick={loadPaired} className="btn mb-3"><Bluetooth className="w-4 h-4"/> قراءة الأجهزة المقترنة</button>{pairedDevices.length>0&&<div className="box text-xs mb-3">{pairedDevices.map(d=><button key={d.address} onClick={()=>{if((d.name||'').toLowerCase().includes('scale'))setScaleAddress(d.address);else setPrinterAddress(d.address)}} className="block w-full text-right py-1">{d.name||'Bluetooth Device'} • {d.address}</button>)}</div>}<label className="label"><Printer className="inline w-3 h-3"/> عنوان الطابعة</label><input value={printerAddress} onChange={e=>setPrinterAddress(e.target.value)} placeholder="AA:BB:CC:DD:EE:FF" className="input mb-2"/><button onClick={printTest} className="btn mb-4"><Printer className="w-4 h-4"/> طباعة فاتورة اختبار ESC/POS</button><label className="label"><Scale className="inline w-3 h-3"/> عنوان الميزان</label><input value={scaleAddress} onChange={e=>setScaleAddress(e.target.value)} placeholder="AA:BB:CC:DD:EE:FF" className="input mb-2"/><button onClick={readScale} className="btn"><Scale className="w-4 h-4"/> قراءة الوزن</button>{hardwareMessage&&<div className="mt-3 text-xs text-cyan-200 box">{hardwareMessage}</div>}</Card>
      <Card title="8) Android In-App Update" icon={<Smartphone className="w-5 h-5"/>}><div className="grid grid-cols-2 gap-2"><Kpi l="الإصدار" v={enterprise.app_update_v15.current_version_name}/><Kpi l="Version Code" v={`${enterprise.app_update_v15.current_version_code}`}/><Kpi l="الحالة" v={enterprise.app_update_v15.status}/><Kpi l="المزود" v="Google Play"/></div><div className="flex gap-2 mt-3"><button onClick={checkUpdate} className="btn"><RefreshCw className="w-4 h-4"/> فحص تحديث</button>{enterprise.app_update_v15.update_available&&<button onClick={startUpdate} className="btn"><Download className="w-4 h-4"/> تحديث الآن</button>}</div><p className="text-[11px] text-slate-500 mt-3">Google Play In-App Update يعمل للنسخ المثبتة من Google Play. APK الجانبي لا يحصل على مسار Play Update.</p></Card>
    </div>}

    {section==='reports' && <div className="space-y-4">
      <Card title="9) Import / Export Excel & CSV" icon={<FileSpreadsheet className="w-5 h-5"/>}><div className="flex flex-wrap gap-2"><button onClick={()=>exportEnterpriseXlsxV15(enterprise)} className="btn"><Download className="w-4 h-4"/> تصدير Excel XLSX</button><button onClick={()=>exportCsvV15(enterprise.inventory_lots as any,'inventory-v15.csv')} className="btn"><Download className="w-4 h-4"/> CSV المخزون</button><button onClick={()=>fileRef.current?.click()} className="btn"><Upload className="w-4 h-4"/> استيراد XLSX</button><input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)importWorkbook(f)}}/></div>{importPreview&&<div className="box mt-3 text-xs"><b>معاينة الاستيراد:</b> {Object.entries(importPreview).map(([k,v])=><span key={k} className="mr-2">{k}: {(v as any[]).length} صف</span>)}<button onClick={applyImport} className="mini mt-2">تطبيق الجداول المدعومة</button></div>}<div className="mt-3 text-xs text-slate-400">الجداول المدعومة للاستيراد المباشر: Inventory وRegionalPrices وVendors. بقية الجداول تُقرأ للمعاينة والتدقيق قبل الدمج.</div></Card>
      <Card title="10) Executive Dashboard" icon={<BarChart3 className="w-5 h-5"/>}><div className="flex justify-end mb-2"><button onClick={refreshExecutive} className="mini"><RefreshCw className="w-3 h-3"/> تحديث المؤشرات</button></div><div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2"><Kpi l="إجمالي المبيعات" v={`${money(exec.gross_revenue_yer)} ر.ي`}/><Kpi l="صافي الربح" v={`${money(exec.net_profit_yer)} ر.ي`}/><Kpi l="المزارع النشطة" v={`${exec.active_farms}`}/><Kpi l="الطيور الحية" v={money(exec.live_birds)}/><Kpi l="FCR" v={`${exec.average_fcr}`}/><Kpi l="الأمان الحيوي" v={`${exec.biosecurity_average_percent}%`}/><Kpi l="حالات مفتوحة" v={`${exec.open_clinical_cases}`}/><Kpi l="مزارع خطر" v={`${exec.high_risk_farms}`}/><Kpi l="قيمة المخزون" v={`${money(exec.inventory_value_yer)} ر.ي`}/><Kpi l="الذمم" v={`${money(exec.receivables_yer)} ر.ي`}/></div><div className="grid md:grid-cols-2 gap-3 mt-4"><Trend title="اتجاه المبيعات" values={exec.sales_trend}/><Trend title="اتجاه الأرباح" values={exec.profit_trend}/><Trend title="اتجاه FCR" values={exec.fcr_trend}/><Trend title="اتجاه النفوق" values={exec.mortality_trend}/></div></Card>
    </div>}
  </div>;
};

const Card:React.FC<{title:string;icon?:React.ReactNode;children:React.ReactNode}>=({title,icon,children})=><section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg"><div className="flex gap-2 items-center text-white font-black mb-3">{icon}<h4>{title}</h4></div>{children}</section>;
const Kpi:React.FC<{l:string;v:string}>=({l,v})=><div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3"><div className="text-[10px] text-slate-500">{l}</div><div className="text-sm font-black text-emerald-300 mt-1 break-words">{v}</div></div>;
const Info:React.FC<{l:string;v:string}>=({l,v})=><div className="flex justify-between border-b border-slate-800 py-1"><span className="text-slate-500">{l}</span><b>{v}</b></div>;
const Badge:React.FC<{children:React.ReactNode;ok?:boolean}>=({children,ok})=><span className={`px-2 py-1 rounded-full text-[10px] border ${ok?'text-emerald-300 border-emerald-500/30 bg-emerald-500/10':'text-amber-300 border-amber-500/30 bg-amber-500/10'}`}>{children}</span>;
const Status:React.FC<{s:string}>=({s})=><span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] text-slate-200">{s.replaceAll('_',' ')}</span>;
function bytes(v:number){if(!v)return '0 MB'; return `${(v/1024/1024).toFixed(1)} MB`;}
function money(v:number){return Math.round(v||0).toLocaleString('en-US');}
const Trend:React.FC<{title:string;values:number[]}>=({title,values})=>{const min=Math.min(...values),max=Math.max(...values),span=max-min||1;const pts=values.map((v,i)=>`${(i/(values.length-1))*100},${38-((v-min)/span)*32}`).join(' ');return <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"><div className="text-xs font-bold text-slate-300 mb-1">{title}</div><svg viewBox="0 0 100 42" className="w-full h-20"><polyline fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400" points={pts}/></svg><div className="text-[10px] text-slate-500">{values.map(v=>Number(v).toFixed(2)).join(' • ')}</div></div>};
