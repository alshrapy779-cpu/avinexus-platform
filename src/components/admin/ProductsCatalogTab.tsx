import React, { useState } from 'react';
import {
  Pill,
  Wheat,
  Wrench,
  ShieldAlert,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Edit2,
  DollarSign,
  Tag,
  Building2,
  AlertTriangle,
  Layers,
  Filter,
  Syringe
} from 'lucide-react';
import {
  VeterinaryMedicine,
  FeedItem,
  FarmEquipment,
  VaccineProtocolItem,
  PartnerCompany
} from '../../types';

interface ProductsCatalogTabProps {
  medicines: VeterinaryMedicine[];
  onUpdateMedicines: (medicines: VeterinaryMedicine[]) => void;
  feeds: FeedItem[];
  onUpdateFeeds: (feeds: FeedItem[]) => void;
  equipment: FarmEquipment[];
  onUpdateEquipment: (equipment: FarmEquipment[]) => void;
  vaccines: VaccineProtocolItem[];
  onUpdateVaccines: (vaccines: VaccineProtocolItem[]) => void;
  companies: PartnerCompany[];
}

export const ProductsCatalogTab: React.FC<ProductsCatalogTabProps> = ({
  medicines,
  onUpdateMedicines,
  feeds,
  onUpdateFeeds,
  equipment,
  onUpdateEquipment,
  vaccines,
  onUpdateVaccines,
  companies
}) => {
  const [catalogType, setCatalogType] = useState<'medicines' | 'feeds' | 'equipment' | 'vaccines'>('medicines');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('all');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<number>(0);

  // New Item Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newMed, setNewMed] = useState<Partial<VeterinaryMedicine>>({
    commercial_name: '',
    active_ingredient: '',
    manufacturer: companies[0]?.name || 'شركة ابن حيان للتقنية البيطرية',
    package_type_size: 'سائل 1 لتر',
    price_yer: 20000,
    withdrawal_period_days: 7,
    sensitivity_test_required: true,
    category: 'مضاد حيوي مقيد',
    in_stock: true,
    is_active_in_market: true,
    indications_ar: ''
  });

  const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('تعذر قراءة الصورة')); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); });

  const updateCatalogImage = async (type: 'medicines' | 'feeds' | 'equipment' | 'vaccines', id: string, file?: File) => {
    if (!file) return;
    const url = await fileToDataUrl(file);
    if (type === 'medicines') onUpdateMedicines(medicines.map((m) => m.id === id ? { ...m, image_url: url } : m));
    if (type === 'feeds') onUpdateFeeds(feeds.map((f) => f.id === id ? { ...f, image_url: url } : f));
    if (type === 'equipment') onUpdateEquipment(equipment.map((e) => e.id === id ? { ...e, image_url: url } : e));
    if (type === 'vaccines') onUpdateVaccines(vaccines.map((v) => v.id === id ? { ...v, image_url: url } : v));
  };

  // Toggle active status for medicines
  const toggleMedicineActive = (id: string) => {
    const updated = medicines.map((m) =>
      m.id === id ? { ...m, is_active_in_market: m.is_active_in_market === false ? true : false } : m
    );
    onUpdateMedicines(updated);
  };

  // Toggle active status for feeds
  const toggleFeedActive = (id: string) => {
    const updated = feeds.map((f) =>
      f.id === id ? { ...f, is_active_in_market: f.is_active_in_market === false ? true : false } : f
    );
    onUpdateFeeds(updated);
  };

  // Toggle active status for equipment
  const toggleEquipmentActive = (id: string) => {
    const updated = equipment.map((e) =>
      e.id === id ? { ...e, is_active_in_market: e.is_active_in_market === false ? true : false } : e
    );
    onUpdateEquipment(updated);
  };

  // Toggle active status for vaccines
  const toggleVaccineActive = (id: string) => {
    const updated = vaccines.map((v) =>
      v.id === id ? { ...v, is_active_in_market: v.is_active_in_market === false ? true : false } : v
    );
    onUpdateVaccines(updated);
  };

  // Save edited price
  const handleSavePrice = (id: string, type: 'medicines' | 'feeds' | 'equipment' | 'vaccines') => {
    if (type === 'medicines') {
      onUpdateMedicines(medicines.map((m) => (m.id === id ? { ...m, price_yer: editPriceValue } : m)));
    } else if (type === 'feeds') {
      onUpdateFeeds(feeds.map((f) => (f.id === id ? { ...f, price_ton_yer: editPriceValue } : f)));
    } else if (type === 'equipment') {
      onUpdateEquipment(equipment.map((e) => (e.id === id ? { ...e, unit_price_yer: editPriceValue } : e)));
    } else if (type === 'vaccines') {
      onUpdateVaccines(vaccines.map((v) => (v.id === id ? { ...v, price_dose_vial_yer: editPriceValue } : v)));
    }
    setEditingPriceId(null);
  };

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.commercial_name || !newMed.active_ingredient) {
      alert('يرجى كتابة اسم الدواء والمادة الفعالة');
      return;
    }

    const created: VeterinaryMedicine = {
      id: `med-${Date.now()}`,
      commercial_name: newMed.commercial_name!,
      active_ingredient: newMed.active_ingredient!,
      manufacturer: newMed.manufacturer || 'مورد معتمد',
      package_type_size: newMed.package_type_size || 'عبوة 1 كجم/لتر',
      price_yer: Number(newMed.price_yer) || 20000,
      withdrawal_period_days: Number(newMed.withdrawal_period_days) || 7,
      sensitivity_test_required: Boolean(newMed.sensitivity_test_required),
      category: newMed.category as any,
      in_stock: true,
      is_active_in_market: true,
      indications_ar: newMed.indications_ar || 'علاج متطابق مع اشتراطات السيادة البيطرية'
    };

    onUpdateMedicines([created, ...medicines]);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-3xl">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-400" />
            <span>إدارة كتالوج المنتجات وتفعيل الأسعار والموردين</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            التحكم الفوري في إتاحة أو حظر أي صنف، وتعديل أسعار السوق ومقارنة وكلاء التوريد.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl text-xs font-bold transition shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة صنف جديد للكتالوج</span>
        </button>
      </div>

      {/* Categories & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl text-xs">
          <button
            onClick={() => setCatalogType('medicines')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
              catalogType === 'medicines' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>الأدوية والعلاجات ({medicines.length})</span>
          </button>

          <button
            onClick={() => setCatalogType('feeds')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
              catalogType === 'feeds' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wheat className="w-3.5 h-3.5" />
            <span>الأعلاف وإضافات التغذية ({feeds.length})</span>
          </button>

          <button
            onClick={() => setCatalogType('equipment')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
              catalogType === 'equipment' ? 'bg-indigo-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>المعدات والتجهيزات ({equipment.length})</span>
          </button>

          <button
            onClick={() => setCatalogType('vaccines')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
              catalogType === 'vaccines' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Syringe className="w-3.5 h-3.5" />
            <span>اللقاحات والتحصينات ({vaccines.length})</span>
          </button>
        </div>

        <div className="flex-1 min-w-[220px] max-w-sm relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث بالاسم، المادة الفعالة، أو المورد..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-2xl pr-9 pl-4 py-2 outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* TABLE OF PRODUCTS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-3 px-4">الصنف التجاري والمواصفات</th>
                <th className="py-3 px-4">الشركة المصنعة / المورد المعتمد</th>
                <th className="py-3 px-4">البيانات الفنية / السحب</th>
                <th className="py-3 px-4">السعر للمزارع (ريال يمني)</th>
                <th className="py-3 px-4 text-center">حالة التفعيل بالسوق</th>
                <th className="py-3 px-4 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {/* MEDICINES LIST */}
              {catalogType === 'medicines' &&
                medicines
                  .filter(
                    (m) =>
                      m.commercial_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      m.active_ingredient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      m.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((med) => {
                    const isActive = med.is_active_in_market !== false;
                    return (
                      <tr
                        key={med.id}
                        className={`hover:bg-slate-800/40 transition ${!isActive ? 'bg-rose-950/10 opacity-75' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-sans">
                          <div className="font-bold text-white text-xs">{med.commercial_name}</div>
                          <div className="text-[11px] text-amber-400/90 font-mono">{med.active_ingredient}</div>
                          <div className="text-[10px] text-slate-500">{med.package_type_size}</div>
                        </td>

                        <td className="py-3.5 px-4 font-sans">
                          <div className="text-slate-300 font-medium">{med.manufacturer}</div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            {med.category}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-sans text-slate-400">
                          <div className="flex items-center gap-1">
                            <span>فترة السحب:</span>
                            <span className="font-mono text-white font-bold">{med.withdrawal_period_days} يوم</span>
                          </div>
                          <div className="text-[10px]">
                            {med.sensitivity_test_required ? (
                              <span className="text-amber-400 font-bold">فحص الحساسية إلزامي (AST)</span>
                            ) : (
                              <span className="text-slate-500">صرف روتيني</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {editingPriceId === med.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={editPriceValue}
                                onChange={(e) => setEditPriceValue(Number(e.target.value))}
                                className="w-24 bg-slate-950 border border-amber-500 rounded px-2 py-1 text-xs text-white"
                              />
                              <button
                                onClick={() => handleSavePrice(med.id, 'medicines')}
                                className="px-2 py-1 bg-amber-500 text-slate-950 font-bold rounded text-[10px]"
                              >
                                حفظ
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-white font-bold">{med.price_yer.toLocaleString()} ريال</span>
                              <button
                                onClick={() => {
                                  setEditingPriceId(med.id);
                                  setEditPriceValue(med.price_yer);
                                }}
                                className="text-slate-500 hover:text-amber-400 p-1"
                                title="تعديل السعر"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-center font-sans">
                          <button
                            onClick={() => toggleMedicineActive(med.id)}
                            className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition ${
                              isActive
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-rose-950 text-rose-400 border border-rose-800'
                            }`}
                          >
                            {isActive ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>مفعل بالسوق</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" />
                                <span>معطل ومحجوب</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-left font-sans">
                          <div className="flex flex-col gap-1 items-end"><button onClick={() => toggleMedicineActive(med.id)} className="text-xs text-slate-400 hover:text-white">{isActive ? 'إيقاف الصنف' : 'إعادة التفعيل'}</button><label className="text-[10px] text-cyan-300 cursor-pointer">تغيير الصورة<input type="file" accept="image/*" className="hidden" onChange={e=>updateCatalogImage('medicines',med.id,e.target.files?.[0])} /></label></div>
                        </td>
                      </tr>
                    );
                  })}

              {/* FEEDS LIST */}
              {catalogType === 'feeds' &&
                feeds
                  .filter(
                    (f) =>
                      f.feed_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      f.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((feed) => {
                    const isActive = feed.is_active_in_market !== false;
                    return (
                      <tr
                        key={feed.id}
                        className={`hover:bg-slate-800/40 transition ${!isActive ? 'bg-rose-950/10 opacity-75' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-sans">
                          <div className="font-bold text-white text-xs">{feed.feed_name}</div>
                          <div className="text-[11px] text-teal-400">مرحلة: {feed.stage}</div>
                        </td>

                        <td className="py-3.5 px-4 font-sans text-slate-300">{feed.manufacturer}</td>

                        <td className="py-3.5 px-4 font-sans text-slate-400">
                          <div>بروتين: <span className="font-mono text-white font-bold">{feed.protein_percent}%</span></div>
                          <div className="text-[10px]">طاقة: {feed.energy_kcal_per_kg} ك.ك/كجم</div>
                        </td>

                        <td className="py-3.5 px-4">
                          {editingPriceId === feed.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={editPriceValue}
                                onChange={(e) => setEditPriceValue(Number(e.target.value))}
                                className="w-28 bg-slate-950 border border-teal-500 rounded px-2 py-1 text-xs text-white"
                              />
                              <button
                                onClick={() => handleSavePrice(feed.id, 'feeds')}
                                className="px-2 py-1 bg-teal-500 text-slate-950 font-bold rounded text-[10px]"
                              >
                                حفظ
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1 text-white font-bold">
                                <span>{feed.price_ton_yer.toLocaleString()} ريال / طن</span>
                                <button
                                  onClick={() => {
                                    setEditingPriceId(feed.id);
                                    setEditPriceValue(feed.price_ton_yer);
                                  }}
                                  className="text-slate-500 hover:text-teal-400 p-1"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="text-[10px] text-slate-400">
                                كيس 50كجم: {feed.price_bag_50kg_yer.toLocaleString()} ريال
                              </div>
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-center font-sans">
                          <button
                            onClick={() => toggleFeedActive(feed.id)}
                            className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition ${
                              isActive
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-rose-950 text-rose-400 border border-rose-800'
                            }`}
                          >
                            {isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            <span>{isActive ? 'متاح بالأسواق' : 'محجوب مؤقتاً'}</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-left font-sans">
                          <div className="flex flex-col gap-1 items-end"><button onClick={() => toggleFeedActive(feed.id)} className="text-xs text-slate-400 hover:text-white">{isActive ? 'إيقاف الصنف' : 'تفعيل'}</button><label className="text-[10px] text-cyan-300 cursor-pointer">تغيير الصورة<input type="file" accept="image/*" className="hidden" onChange={e=>updateCatalogImage('feeds',feed.id,e.target.files?.[0])} /></label></div>
                        </td>
                      </tr>
                    );
                  })}

              {/* EQUIPMENT LIST */}
              {catalogType === 'equipment' &&
                equipment
                  .filter(
                    (eq) =>
                      eq.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      eq.brand_manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((eq) => {
                    const isActive = eq.is_active_in_market !== false;
                    return (
                      <tr
                        key={eq.id}
                        className={`hover:bg-slate-800/40 transition ${!isActive ? 'bg-rose-950/10 opacity-75' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-sans">
                          <div className="font-bold text-white text-xs">{eq.model_name}</div>
                          <div className="text-[10px] text-indigo-400">تصنيف: {eq.category}</div>
                        </td>

                        <td className="py-3.5 px-4 font-sans text-slate-300">{eq.brand_manufacturer}</td>

                        <td className="py-3.5 px-4 font-sans text-slate-400">
                          <div>الحالة: <span className="text-white font-medium">{eq.condition}</span></div>
                          <div className="text-[10px]">الضمان: {eq.warranty_months} شهر</div>
                        </td>

                        <td className="py-3.5 px-4">
                          {editingPriceId === eq.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={editPriceValue}
                                onChange={(e) => setEditPriceValue(Number(e.target.value))}
                                className="w-24 bg-slate-950 border border-indigo-500 rounded px-2 py-1 text-xs text-white"
                              />
                              <button
                                onClick={() => handleSavePrice(eq.id, 'equipment')}
                                className="px-2 py-1 bg-indigo-500 text-white font-bold rounded text-[10px]"
                              >
                                حفظ
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-white font-bold">
                              <span>{eq.unit_price_yer.toLocaleString()} ريال</span>
                              <button
                                onClick={() => {
                                  setEditingPriceId(eq.id);
                                  setEditPriceValue(eq.unit_price_yer);
                                }}
                                className="text-slate-500 hover:text-indigo-400 p-1"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-center font-sans">
                          <button
                            onClick={() => toggleEquipmentActive(eq.id)}
                            className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition ${
                              isActive
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-rose-950 text-rose-400 border border-rose-800'
                            }`}
                          >
                            {isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            <span>{isActive ? 'معروض للطلب' : 'معطل'}</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-left font-sans">
                          <div className="flex flex-col gap-1 items-end"><button onClick={() => toggleEquipmentActive(eq.id)} className="text-xs text-slate-400 hover:text-white">{isActive ? 'إيقاف' : 'تفعيل'}</button><label className="text-[10px] text-cyan-300 cursor-pointer">تغيير الصورة<input type="file" accept="image/*" className="hidden" onChange={e=>updateCatalogImage('equipment',eq.id,e.target.files?.[0])} /></label></div>
                        </td>
                      </tr>
                    );
                  })}

              {/* VACCINES LIST */}
              {catalogType === 'vaccines' &&
                vaccines
                  .filter(
                    (v) =>
                      v.vaccine_name_strain.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      v.disease_targeted.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((vac) => {
                    const isActive = vac.is_active_in_market !== false;
                    return (
                      <tr
                        key={vac.id}
                        className={`hover:bg-slate-800/40 transition ${!isActive ? 'bg-rose-950/10 opacity-75' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-sans">
                          <div className="font-bold text-white text-xs">{vac.vaccine_name_strain}</div>
                          <div className="text-[11px] text-rose-400">{vac.disease_targeted}</div>
                        </td>

                        <td className="py-3.5 px-4 font-sans text-slate-300">{vac.manufacturer_country}</td>

                        <td className="py-3.5 px-4 font-sans text-slate-400">
                          <div>العمر الموصى به: <span className="font-mono text-white font-bold">يوم {vac.recommended_age_days}</span></div>
                          <div className="text-[10px]">طريقة الإعطاء: {vac.administration_route}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-white font-bold">{vac.price_dose_vial_yer.toLocaleString()} ريال</span>
                        </td>

                        <td className="py-3.5 px-4 text-center font-sans">
                          <button
                            onClick={() => toggleVaccineActive(vac.id)}
                            className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition ${
                              isActive
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-rose-950 text-rose-400 border border-rose-800'
                            }`}
                          >
                            {isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            <span>{isActive ? 'معتمد' : 'موقوف'}</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-left font-sans">
                          <div className="flex flex-col gap-1 items-end"><button onClick={() => toggleVaccineActive(vac.id)} className="text-xs text-slate-400 hover:text-white">{isActive ? 'إيقاف' : 'تفعيل'}</button><label className="text-[10px] text-cyan-300 cursor-pointer">تغيير الصورة<input type="file" accept="image/*" className="hidden" onChange={e=>updateCatalogImage('vaccines',vac.id,e.target.files?.[0])} /></label></div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW MEDICINE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Pill className="w-4 h-4 text-amber-400" />
                <span>إضافة صنف علاجي / منتج جديد للكتالوج</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMedicine} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">اسم العلاج التجاري *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فوسفومايسين بلس 25%"
                  value={newMed.commercial_name || ''}
                  onChange={(e) => setNewMed({ ...newMed, commercial_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">المادة الفعالة والتركيز *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: Fosfomycin 250mg + Tylosin 100mg"
                  value={newMed.active_ingredient || ''}
                  onChange={(e) => setNewMed({ ...newMed, active_ingredient: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">الشركة الموردة المتعاقدة</label>
                  <select
                    value={newMed.manufacturer}
                    onChange={(e) => setNewMed({ ...newMed, manufacturer: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                  >
                    {companies.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">نوع وحجم العبوة</label>
                  <input
                    type="text"
                    value={newMed.package_type_size || ''}
                    onChange={(e) => setNewMed({ ...newMed, package_type_size: e.target.value })}
                    placeholder="سائل 1 لتر / بودرة 1 كجم"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">سعر العبوة (ريال يمني) *</label>
                  <input
                    type="number"
                    required
                    value={newMed.price_yer || 20000}
                    onChange={(e) => setNewMed({ ...newMed, price_yer: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">فترة السحب (Withdrawal Days) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={60}
                    value={newMed.withdrawal_period_days || 7}
                    onChange={(e) => setNewMed({ ...newMed, withdrawal_period_days: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-medium">اشتراط فحص الحساسية (AST Required):</span>
                <input
                  type="checkbox"
                  checked={newMed.sensitivity_test_required || false}
                  onChange={(e) => setNewMed({ ...newMed, sensitivity_test_required: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">دواعي الاستعمال البيطرية</label>
                <textarea
                  rows={2}
                  value={newMed.indications_ar || ''}
                  onChange={(e) => setNewMed({ ...newMed, indications_ar: e.target.value })}
                  placeholder="دواعي الاستخدام والجرعات الاسترشادية..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20"
                >
                  إضافة المنتج للكتالوج
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
