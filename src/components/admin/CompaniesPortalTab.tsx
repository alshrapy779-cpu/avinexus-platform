import React, { useState } from 'react';
import {
  Building2,
  FileText,
  Percent,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  Upload,
  ShieldCheck,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronDown,
  Info
} from 'lucide-react';
import {
  PartnerCompany,
  CompanyCategory,
  CompanyPortalPermission,
  ContractStatus
} from '../../types';

interface CompaniesPortalTabProps {
  companies: PartnerCompany[];
  onUpdateCompanies: (companies: PartnerCompany[]) => void;
  onNavigateToCatalog?: (companyId?: string) => void;
}

export const CompaniesPortalTab: React.FC<CompaniesPortalTabProps> = ({
  companies,
  onUpdateCompanies,
  onNavigateToCatalog
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedCompanyDetail, setSelectedCompanyDetail] = useState<PartnerCompany | null>(null);

  // New Company Form State
  const [newCompany, setNewCompany] = useState<Partial<PartnerCompany>>({
    name: '',
    category: 'أدوية بيطرية',
    governorate: 'أمانة العاصمة صنعاء',
    contact_person: '',
    phone: '',
    email: '',
    contract_number: `YEM-CONT-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
    contract_start_date: new Date().toISOString().split('T')[0],
    contract_end_date: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    contract_status: 'ساري',
    regional_commission_percent: 7.0,
    portal_permission: 'self_service_with_approval',
    active: true,
    products_count: 0,
    total_volume_yer: 0,
    contract_document_name: 'وثيقة_العقد_المعتمد.pdf',
    notes: ''
  });

  const handleToggleActive = (companyId: string) => {
    const updated = companies.map((c) => (c.id === companyId ? { ...c, active: !c.active } : c));
    onUpdateCompanies(updated);
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.contact_person || !newCompany.phone) {
      alert('يرجى تعبئة اسم الشركة، الشخص المسؤول، ورقم الهاتف');
      return;
    }

    const companyToSave: PartnerCompany = {
      id: `comp-${Date.now()}`,
      name: newCompany.name!,
      category: (newCompany.category as CompanyCategory) || 'أدوية بيطرية',
      governorate: newCompany.governorate || 'أمانة العاصمة صنعاء',
      contact_person: newCompany.contact_person!,
      phone: newCompany.phone!,
      email: newCompany.email || '',
      contract_number: newCompany.contract_number || `YEM-CONT-${Date.now()}`,
      contract_start_date: newCompany.contract_start_date || '2026-01-01',
      contract_end_date: newCompany.contract_end_date || '2027-01-01',
      contract_status: (newCompany.contract_status as ContractStatus) || 'ساري',
      regional_commission_percent: Number(newCompany.regional_commission_percent) || 7.0,
      portal_permission: (newCompany.portal_permission as CompanyPortalPermission) || 'self_service_with_approval',
      active: true,
      products_count: 0,
      total_volume_yer: 0,
      contract_document_name: newCompany.contract_document_name || 'وثيقة_العقد_المعتمد.pdf',
      notes: newCompany.notes || ''
    };

    onUpdateCompanies([...companies, companyToSave]);
    setShowAddModal(false);
    // Reset form
    setNewCompany({
      name: '',
      category: 'أدوية بيطرية',
      governorate: 'أمانة العاصمة صنعاء',
      contact_person: '',
      phone: '',
      email: '',
      contract_number: `YEM-CONT-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
      contract_start_date: new Date().toISOString().split('T')[0],
      contract_end_date: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      contract_status: 'ساري',
      regional_commission_percent: 7.0,
      portal_permission: 'self_service_with_approval',
      active: true,
      products_count: 0,
      total_volume_yer: 0,
      contract_document_name: 'وثيقة_العقد_المعتمد.pdf',
      notes: ''
    });
  };

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contract_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contact_person.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-3xl">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <span>مركز إدارة الشركات والتعاقدات (Vendors & Partners Portal)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            توثيق العقود والنسب الإقليمية مع شركات الأدوية، مطابخ الأعلاف، مصانع المعدات، ووكلاء اللقاحات.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl text-xs font-bold transition shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل شركة متعاقدة جديدة</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث بالاسم، رقم العقد، أو مسؤول التواصل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-2xl pr-9 pl-4 py-2.5 outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-2xl text-xs">
          {(['all', 'أدوية بيطرية', 'مطابخ ومصانع أعلاف', 'معدات ومستلزمات', 'وكلاء لقاحات'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl transition ${
                selectedCategory === cat ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'جميع الشركاء' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className={`bg-slate-900 border rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${
              company.active ? 'border-slate-800 hover:border-amber-500/50' : 'border-rose-950/60 opacity-80'
            }`}
          >
            {/* Ribbon if inactive */}
            {!company.active && (
              <div className="absolute top-3 left-3 bg-rose-950 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-rose-800">
                الشراكة معلقة رقابياً
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {company.category}
                  </span>
                  <h4 className="text-sm font-bold text-white pt-1">{company.name}</h4>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{company.governorate}</span>
                  </div>
                </div>

                {/* Status toggle */}
                <button
                  onClick={() => handleToggleActive(company.id)}
                  title={company.active ? 'إيقاف التعاقد مؤقتاً' : 'تفعيل التعاقد'}
                  className={`p-2 rounded-xl transition ${
                    company.active ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {company.active ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </button>
              </div>

              {/* Contract Key Metrics */}
              <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>رقم العقد المعتمد:</span>
                  <span className="font-mono text-white font-bold">{company.contract_number}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>النسبة الإقليمية المتفق عليها:</span>
                  <span className="font-mono text-amber-400 font-black">{company.regional_commission_percent}%</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>صلاحية الحساب:</span>
                  <span className="text-[11px] text-slate-300 font-medium">
                    {company.portal_permission === 'self_service_with_approval'
                      ? 'بوابة مورد (بموافقة المدير)'
                      : 'إدخال مباشر بيد المدير'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>سريان العقد:</span>
                  <span className="text-emerald-400 text-[11px]">حتى {company.contract_end_date}</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">المسؤول:</span>
                  <span className="text-slate-300 font-medium">{company.contact_person}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-slate-500" />
                  <span className="text-slate-300 font-mono" dir="ltr">{company.phone}</span>
                </div>
              </div>

              {/* Contract Document Attachment */}
              <div className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-xl border border-slate-700/50 text-xs">
                <div className="flex items-center gap-2 text-slate-300 truncate">
                  <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate text-[11px]">{company.contract_document_name || 'وثيقة_العقد.pdf'}</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 shrink-0">
                  موثق رسمي
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="text-[11px] text-slate-400">
                المبيعات: <span className="font-mono text-amber-300 font-bold">{company.total_volume_yer.toLocaleString()} ريال</span>
              </div>

              <button
                onClick={() => setSelectedCompanyDetail(company)}
                className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
              >
                <span>التفاصيل والأصناف</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL */}
      {selectedCompanyDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  {selectedCompanyDetail.category}
                </span>
                <h3 className="text-lg font-black text-white mt-1">{selectedCompanyDetail.name}</h3>
                <p className="text-xs text-slate-400">ملف التعاقد والضوابط الإقليمية المعتمدة بالمنظومة</p>
              </div>

              <button
                onClick={() => setSelectedCompanyDetail(null)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-500">رقم العقد المسجل:</span>
                <div className="font-mono font-bold text-white">{selectedCompanyDetail.contract_number}</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-500">النسبة الإقليمية المتفق عليها:</span>
                <div className="font-mono font-bold text-amber-400">{selectedCompanyDetail.regional_commission_percent}%</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-500">فترة العقد:</span>
                <div className="text-slate-200">
                  من {selectedCompanyDetail.contract_start_date} حتى {selectedCompanyDetail.contract_end_date}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-500">صلاحية حساب الشركة:</span>
                <div className="text-slate-200">
                  {selectedCompanyDetail.portal_permission === 'self_service_with_approval'
                    ? 'بوابة مورد خاصة (تتطلب مراجعة واعتماد المدير)'
                    : 'إدارة مباشرة وإدخال يدوي من المدير فقط'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-amber-950/20 border border-amber-800/30 rounded-2xl text-center"><div className="text-[10px] text-slate-500">إجمالي مبيعات الشركة</div><div className="text-sm font-black text-amber-300 font-mono mt-1">{selectedCompanyDetail.total_volume_yer.toLocaleString()} ريال</div></div>
              <div className="p-3 bg-cyan-950/20 border border-cyan-800/30 rounded-2xl text-center"><div className="text-[10px] text-slate-500">الأصناف المرتبطة</div><div className="text-sm font-black text-cyan-300 mt-1">{selectedCompanyDetail.products_count}</div></div>
              <div className="p-3 bg-emerald-950/20 border border-emerald-800/30 rounded-2xl text-center"><div className="text-[10px] text-slate-500">عمولة المنصة التقديرية</div><div className="text-sm font-black text-emerald-300 font-mono mt-1">{Math.round(selectedCompanyDetail.total_volume_yer * selectedCompanyDetail.regional_commission_percent / 100).toLocaleString()} ريال</div></div>
            </div>
            <div className="text-[10px] text-slate-500 bg-slate-950 border border-slate-800 rounded-xl p-3">هذا تقرير مستقل للشركة. عند ربط Backend بالمبيعات الفعلية يمكن إضافة تفصيل يومي/شهري حسب كل صنف وفاتورة وفرع.</div>

            {selectedCompanyDetail.notes && (
              <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs space-y-1">
                <span className="text-slate-400 font-bold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  ملاحظات وشروط العقد الخاصة:
                </span>
                <p className="text-slate-300 leading-relaxed">{selectedCompanyDetail.notes}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="text-xs text-slate-400">
                الحالة: <span className={selectedCompanyDetail.active ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                  {selectedCompanyDetail.active ? 'نشط ومعتمد رسمياً' : 'معلق'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleToggleActive(selectedCompanyDetail.id);
                    setSelectedCompanyDetail(null);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs rounded-xl text-white transition"
                >
                  {selectedCompanyDetail.active ? 'تجميد الشراكة مؤقتاً' : 'تفعيل الشراكة'}
                </button>
                <button
                  onClick={() => setSelectedCompanyDetail(null)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW COMPANY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span>تسجيل شركة / مورد جديد وتوثيق العقد</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">اسم الشركة / المنشأة *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: شركة سبأ الوطنية للأعلاف"
                    value={newCompany.name || ''}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">تصنيف النشاط *</label>
                  <select
                    value={newCompany.category}
                    onChange={(e) => setNewCompany({ ...newCompany, category: e.target.value as CompanyCategory })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                  >
                    <option value="أدوية بيطرية">أدوية بيطرية</option>
                    <option value="مطابخ ومصانع أعلاف">مطابخ ومصانع أعلاف</option>
                    <option value="معدات ومستلزمات">معدات ومستلزمات</option>
                    <option value="وكلاء لقاحات">وكلاء لقاحات</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">المحافظة / الإقليم *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: أمانة العاصمة صنعاء"
                    value={newCompany.governorate || ''}
                    onChange={(e) => setNewCompany({ ...newCompany, governorate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">الشخص المسؤول / مندوب التواصل *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: د. محمد الحميري"
                    value={newCompany.contact_person || ''}
                    onChange={(e) => setNewCompany({ ...newCompany, contact_person: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">رقم الهاتف والتواصل *</label>
                  <input
                    type="text"
                    required
                    placeholder="+967 77X XXX XXX"
                    value={newCompany.phone || ''}
                    onChange={(e) => setNewCompany({ ...newCompany, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">النسبة الإقليمية المتفق عليها (%) *</label>
                  <input
                    type="number"
                    step={0.5}
                    min={1}
                    max={25}
                    required
                    value={newCompany.regional_commission_percent || 7.0}
                    onChange={(e) => setNewCompany({ ...newCompany, regional_commission_percent: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">رقم العقد والوثيقة *</label>
                  <input
                    type="text"
                    required
                    value={newCompany.contract_number || ''}
                    onChange={(e) => setNewCompany({ ...newCompany, contract_number: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">صلاحية حساب الشركة بالمنصة *</label>
                  <select
                    value={newCompany.portal_permission}
                    onChange={(e) =>
                      setNewCompany({
                        ...newCompany,
                        portal_permission: e.target.value as CompanyPortalPermission
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                  >
                    <option value="self_service_with_approval">بوابة مورد خاصة (يدخل منتجاته لتراجعها أنت وتعتمدها)</option>
                    <option value="direct_admin_managed">إدارة مباشرة (تدخل أنت كافة المنتجات والأسعار بنفسك)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">تاريخ بداية العقد</label>
                  <input
                    type="date"
                    value={newCompany.contract_start_date}
                    onChange={(e) => setNewCompany({ ...newCompany, contract_start_date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">تاريخ نهاية العقد</label>
                  <input
                    type="date"
                    value={newCompany.contract_end_date}
                    onChange={(e) => setNewCompany({ ...newCompany, contract_end_date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Upload Contract Document */}
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">توثيق ملف العقد المعتمد (PDF / مسح ضوئي)</label>
                <div className="border border-dashed border-slate-700 bg-slate-950/60 rounded-2xl p-4 text-center cursor-pointer hover:border-amber-500 transition">
                  <Upload className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <span className="text-slate-300 text-xs">اضغط لرفع نسخة العقد الموقعة أو استخدم اسم المستند الافتراضي</span>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">{newCompany.contract_document_name}</div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">ملاحظات والتزامات خاصة</label>
                <textarea
                  rows={2}
                  placeholder="أي اشتراطات خاصة بفترات السحب، الضمانات، أو جداول التوريد..."
                  value={newCompany.notes || ''}
                  onChange={(e) => setNewCompany({ ...newCompany, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20"
                >
                  حفظ وتوثيق الشراكة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
