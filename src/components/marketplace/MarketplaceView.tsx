import React, { useState } from 'react';
import {
  Pill,
  Wheat,
  Wrench,
  Home,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Phone,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  Tag,
  Clock,
  Eye,
  X,
  MapPin,
  Zap,
  Sun,
  Droplet,
  Settings,
  Egg,
  Coins,
  ShoppingCart,
  Bot,
  ShieldAlert,
  Truck,
  ClipboardCheck,
  PackageSearch
} from 'lucide-react';
import {
  VeterinaryMedicine,
  FeedItem,
  FarmEquipment,
  HangarRental,
  FeedStage,
  EquipmentCategory,
  SmartOperationsState,
  MarketplacePurchaseRequest,
  VaccineProtocolItem
} from '../../types';
import { convertReferenceYerOld, getCurrencyMode } from '../../services/operationalRules';
import { BrokerMarketplaceV197 } from './v197/BrokerMarketplaceV197';

interface MarketplaceViewProps {
  medicines: VeterinaryMedicine[];
  feeds: FeedItem[];
  equipment: FarmEquipment[];
  vaccines: VaccineProtocolItem[];
  rentals: HangarRental[];
  onAddRental?: (rental: HangarRental) => void;
  onNavigateToVet?: () => void;
  smartOperations: SmartOperationsState;
  customerGovernorate: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  onUpdateSmartOperations: (operations: SmartOperationsState) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  medicines,
  feeds,
  equipment,
  vaccines,
  rentals,
  onAddRental,
  onNavigateToVet,
  smartOperations,
  customerGovernorate,
  customerName,
  customerPhone,
  customerAddress,
  onUpdateSmartOperations
}) => {
  const [activeTab, setActiveTab] = useState<'broker' | 'medicines' | 'vaccines' | 'feeds' | 'equipment' | 'rentals' | 'chicks' | 'orders'>('broker');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFeedStage, setSelectedFeedStage] = useState<string>('all');
  const [selectedEquipCategory, setSelectedEquipCategory] = useState<string>('all');
  const [selectedRentalGov, setSelectedRentalGov] = useState<string>('all');
  const currencyMode = getCurrencyMode(customerGovernorate, smartOperations.governorate_currency_rules);
  const regionalPrice = (referenceYerOld: number) => convertReferenceYerOld(referenceYerOld, currencyMode, smartOperations.exchange_rates);
  const contractOfferFor = (companyId?: string) => {
    if (!companyId) return undefined;
    return smartOperations.enterprise.partner_trade_contracts_v12?.find((contract) =>
      contract.partner_company_id === companyId &&
      contract.status === 'active' &&
      contract.customer_visible &&
      (contract.governorates.length === 0 || contract.governorates.some((g) => customerGovernorate.includes(g) || g.includes(customerGovernorate)))
    );
  };
  const contractedRegionalPrice = (referenceYerOld: number, companyId?: string) => {
    const contract = contractOfferFor(companyId);
    const discount = contract?.show_discount_badge ? Math.max(0, Math.min(100, contract.customer_discount_percent)) : 0;
    const discountedReference = Math.round(referenceYerOld * (1 - discount / 100));
    return { contract, discount, original: regionalPrice(referenceYerOld), final: regionalPrice(discountedReference) };
  };

  type PurchaseTarget = { category: 'medicine' | 'vaccine' | 'feed' | 'equipment' | 'chicks'; id: string; name: string; unitLabel: string; unitPriceLocal: number; isAntibiotic: boolean; };
  const [purchaseTarget, setPurchaseTarget] = useState<PurchaseTarget | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const zonesForGovernorate = smartOperations.zone_service_prices.filter((z) => customerGovernorate.includes(z.governorate) && z.status === 'active');
  const [purchaseDistrict, setPurchaseDistrict] = useState(zonesForGovernorate[0]?.district || '');
  const [customDistrict, setCustomDistrict] = useState('');
  const [transportAccepted, setTransportAccepted] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState('');
  const [buyerName, setBuyerName] = useState(customerName);
  const [buyerPhone, setBuyerPhone] = useState(customerPhone);
  const [buyerAddress, setBuyerAddress] = useState(customerAddress);
  const [paymentRequestId, setPaymentRequestId] = useState<string | null>(null);
  const [paymentAccountId, setPaymentAccountId] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentProof, setPaymentProof] = useState('');
  const [clinicalFile, setClinicalFile] = useState({
    flock_age_days: 21, flock_size: 10000, mortality_today: 0, temperature_celsius: 27,
    feed_consumption_kg: 0, water_consumption_liters: 0, reason_for_request: '', symptoms: '',
    diarrhea_image_note: '', diarrhea_image_url: '', necropsy_image_note: '', necropsy_image_urls: [] as string[], farm_address: ''
  });

  const selectedZone = smartOperations.zone_service_prices.find(
    (z) => customerGovernorate.includes(z.governorate) && z.district === purchaseDistrict && z.status === 'active'
  );
  const transportFeeLocal = selectedZone ? regionalPrice(selectedZone.transport_fee_yer).localYer : 0;
  const productTotalLocal = purchaseTarget ? purchaseTarget.unitPriceLocal * Math.max(1, purchaseQuantity) : 0;
  const grandTotalLocal = productTotalLocal + transportFeeLocal;

  const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('تعذر قراءة الصورة'));
    reader.onerror = () => reject(reader.error || new Error('تعذر قراءة الصورة'));
    reader.readAsDataURL(file);
  });

  const handleDiarrheaImage = async (file?: File) => {
    if (!file) return;
    try {
      const url = await fileToDataUrl(file);
      setClinicalFile((prev) => ({ ...prev, diarrhea_image_note: file.name, diarrhea_image_url: url }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleNecropsyImages = async (files: FileList | null) => {
    if (!files?.length) return;
    try {
      const selected = Array.from(files);
      const urls = await Promise.all(selected.map(fileToDataUrl));
      setClinicalFile((prev) => ({
        ...prev,
        necropsy_image_note: selected.map((file) => file.name).join(', '),
        necropsy_image_urls: urls
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const aiSalesMessage = (target: PurchaseTarget) => {
    if (target.isAntibiotic) return 'يمكنني تسجيل طلب شراء هذا المضاد لك، لكن حفاظاً على القطيع وسلامة المنتج سأجمع بيانات الحالة أولاً وأرسلها للطبيب. بعد موافقته يصبح الشراء مسموحاً، مع بقاء تحذير واضح بأن الاستخدام والجرعة وفترة السحب تحدد طبياً.';
    if (target.category === 'vaccine') return 'يمكنك طلب اللقاح من الكتالوج المعتمد. سأعرض السعر وأجرة المنطقة بوضوح، لكن العمر المناسب وطريقة التطبيق وسلامة سلسلة التبريد يجب أن تتوافق مع بروتوكول الطبيب/الإدارة قبل الاستخدام.';
    if (target.category === 'chicks') return 'هذا العرض مرتبط ببورصة الكتاكيت اليومية. اختر الكمية والمنطقة، وسأضيف أجرة النقل المعتمدة أمامك قبل التأكيد حتى تعرف التكلفة كاملة ولا توجد رسوم مخفية.';
    if (target.category === 'feed') return 'سأحسب لك قيمة الكمية مع أجرة المنطقة قبل التأكيد. يمكنك مراجعة مرحلة العلف والشركة والسعر، ثم تقرر الموافقة على الأجر وإرسال الطلب.';
    if (target.category === 'equipment') return 'اختيار المعدات حسب حجم القطيع يقلل الهدر ويثبت ظروف العنبر. سأعرض سعر الصنف وأجرة النقل منفصلة لتتخذ قرارك بوضوح.';
    return 'يمكنك إكمال شراء الصنف مباشرة بعد مراجعة الكمية وأجرة المنطقة. سأعرض التكلفة النهائية بوضوح قبل تأكيد الطلب.';
  };

  const openPurchase = (target: PurchaseTarget) => {
    setPurchaseTarget(target);
    setPurchaseQuantity(1);
    setTransportAccepted(false);
    setPurchaseSuccess('');
    setBuyerName(customerName);
    setBuyerPhone(customerPhone);
    setBuyerAddress(customerAddress);
    setPurchaseDistrict(zonesForGovernorate[0]?.district || '');
    setCustomDistrict('');
    setClinicalFile({
      flock_age_days: 21, flock_size: 10000, mortality_today: 0, temperature_celsius: 27,
      feed_consumption_kg: 0, water_consumption_liters: 0, reason_for_request: '', symptoms: '',
      diarrhea_image_note: '', diarrhea_image_url: '', necropsy_image_note: '', necropsy_image_urls: [], farm_address: ''
    });
  };

  const submitPurchase = () => {
    if (!purchaseTarget) return;
    if (!buyerName.trim() || !buyerPhone.trim() || !buyerAddress.trim()) return;
    const hasZone = Boolean(selectedZone);
    if (hasZone && !transportAccepted) return;
    if (!hasZone && !customDistrict.trim()) return;
    if (purchaseTarget.isAntibiotic && (!clinicalFile.reason_for_request.trim() || !clinicalFile.symptoms.trim() || !clinicalFile.farm_address.trim())) return;

    const finalDistrict = purchaseDistrict || customDistrict.trim() || 'منطقة جديدة';
    const request: MarketplacePurchaseRequest = {
      id: `buy-${Date.now()}`, created_at: new Date().toISOString(), customer_name: buyerName.trim(), phone: buyerPhone.trim(), customer_address: buyerAddress.trim(),
      category: purchaseTarget.category, product_id: purchaseTarget.id, product_name: purchaseTarget.name,
      quantity: Math.max(1, purchaseQuantity), unit_label: purchaseTarget.unitLabel, unit_price_local: purchaseTarget.unitPriceLocal,
      currency_label: regionalPrice(1).label, product_total_local: productTotalLocal, governorate: customerGovernorate, district: finalDistrict,
      transport_fee_local: transportFeeLocal, transport_fee_accepted: hasZone ? transportAccepted : false, grand_total_local: grandTotalLocal,
      is_antibiotic: purchaseTarget.isAntibiotic, requires_vet_approval: purchaseTarget.isAntibiotic, vet_approved: false,
      antibiotic_case: purchaseTarget.isAntibiotic ? { ...clinicalFile, farm_address: clinicalFile.farm_address || buyerAddress.trim() } : undefined, ai_sales_message: aiSalesMessage(purchaseTarget),
      assigned_branch_id: selectedZone?.branch_id, assigned_branch_name: selectedZone?.branch_name, delivery_eta_hours: selectedZone?.delivery_eta_hours,
      status: purchaseTarget.isAntibiotic ? 'pending_vet_approval' : hasZone ? 'awaiting_payment' : 'pending_customer_fee_acceptance'
    };
    const needsNewZone = !hasZone && finalDistrict !== 'منطقة جديدة' && !smartOperations.zone_service_prices.some((z) => z.governorate === customerGovernorate && z.district === finalDistrict);
    const pendingZone = needsNewZone ? [{
      id: `zone-buy-${Date.now()}`,
      governorate: customerGovernorate,
      district: finalDistrict,
      currency_mode: currencyMode,
      transport_fee_yer: 0,
      field_visit_fee_yer: 0,
      marketing_fee_yer: 0,
      last_updated: new Date().toISOString(),
      status: 'pending_new_location_pricing' as const
    }] : [];
    onUpdateSmartOperations({
      ...smartOperations,
      zone_service_prices: [...pendingZone, ...smartOperations.zone_service_prices],
      purchase_requests: [request, ...smartOperations.purchase_requests]
    });
    setPurchaseSuccess(purchaseTarget.isAntibiotic ? 'تم إرسال طلب المضاد وملف القطيع للطبيب. بعد موافقته ستظهر لك حسابات التحويل لإكمال الدفع.' : hasZone ? 'تم قبول أجرة النقل. انتقل إلى طلباتي لاختيار حساب التحويل ورفع صورة الحوالة.' : 'تم إرسال المنطقة الجديدة للإدارة لتحديد أجرة النقل ثم ستظهر لك للموافقة.');
  };

  const acceptPendingTransportFee = (requestId: string) => {
    const request = smartOperations.purchase_requests.find((r) => r.id === requestId);
    if (!request) return;
    const zone = smartOperations.zone_service_prices.find((z) => z.status === 'active' && request.governorate.includes(z.governorate) && z.district === request.district);
    if (!zone) return;
    const mode = getCurrencyMode(request.governorate, smartOperations.governorate_currency_rules);
    const fee = convertReferenceYerOld(zone.transport_fee_yer, mode, smartOperations.exchange_rates).localYer;
    onUpdateSmartOperations({
      ...smartOperations,
      purchase_requests: smartOperations.purchase_requests.map((item) => item.id === requestId ? {
        ...item,
        transport_fee_local: fee,
        transport_fee_accepted: true,
        grand_total_local: item.product_total_local + fee,
        status: item.is_antibiotic ? (item.vet_approved ? 'awaiting_payment' : 'pending_vet_approval') : 'awaiting_payment'
      } : item)
    });
  };

  const openPayment = (requestId: string) => {
    setPaymentRequestId(requestId);
    setPaymentAccountId(smartOperations.payment_accounts.find((a) => a.active)?.id || '');
    setPaymentReference('');
    setPaymentProof('');
  };

  const submitPaymentProof = () => {
    const request = smartOperations.purchase_requests.find((r) => r.id === paymentRequestId);
    const account = smartOperations.payment_accounts.find((a) => a.id === paymentAccountId);
    if (!request || !account || !paymentProof) return;
    const verification = {
      id: `pv-${Date.now()}`, purchase_request_id: request.id, customer_name: request.customer_name, phone: request.phone,
      amount_local: request.grand_total_local, currency_label: request.currency_label, payment_account_id: account.id,
      payment_account_label: `${account.provider} — ${account.account_name} — ${account.account_number}`, proof_image_url: paymentProof,
      reference_number: paymentReference.trim() || undefined, submitted_at: new Date().toISOString(), status: 'under_finance_review' as const
    };
    onUpdateSmartOperations({
      ...smartOperations,
      payment_verifications: [verification, ...smartOperations.payment_verifications],
      purchase_requests: smartOperations.purchase_requests.map((r) => r.id === request.id ? {
        ...r, payment_method_id: account.id, payment_method_label: verification.payment_account_label,
        payment_proof_image_url: paymentProof, payment_reference: paymentReference.trim(), payment_submitted_at: verification.submitted_at,
        status: 'payment_under_review'
      } : r)
    });
    setPaymentRequestId(null);
    setPurchaseSuccess('تم إرسال صورة الحوالة إلى المالية. سيظهر اعتماد المبلغ في حالة الطلب بعد المراجعة.');
  };

  // New Hangar Listing Modal
  const [showAddRentalModal, setShowAddRentalModal] = useState<boolean>(false);
  const [newHangar, setNewHangar] = useState<Partial<HangarRental>>({
    title: '',
    governorate: 'محافظة صنعاء',
    district: '',
    location_details: '',
    length_meters: 80,
    width_meters: 12,
    total_area_m2: 960,
    capacity_birds: 10000,
    rental_price_yer: 750000,
    rental_term: 'للدورة',
    amenities: {
      automatic_control_panel: true,
      water_well: true,
      solar_power_system: true,
      worker_housing: true,
      backup_generator: false
    },
    contact_phone: '',
    advertiser_name: '',
    images: ['https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=600&q=80']
  });

  const handleSaveRental = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHangar.title || !newHangar.contact_phone) {
      alert('يرجى تعبئة اسم المنشأة ورقم التواصل');
      return;
    }

    const createdRental: HangarRental = {
      id: `hangar-${Date.now()}`,
      title: newHangar.title!,
      governorate: newHangar.governorate || 'محافظة صنعاء',
      district: newHangar.district || 'مديرية عامة',
      location_details: newHangar.location_details || 'موقع مزرعة ملائم للاشتراطات',
      images: newHangar.images || ['https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=600&q=80'],
      length_meters: Number(newHangar.length_meters) || 80,
      width_meters: Number(newHangar.width_meters) || 12,
      total_area_m2: (Number(newHangar.length_meters) || 80) * (Number(newHangar.width_meters) || 12),
      capacity_birds: Number(newHangar.capacity_birds) || 10000,
      rental_price_yer: Number(newHangar.rental_price_yer) || 750000,
      rental_term: newHangar.rental_term || 'للدورة',
      amenities: newHangar.amenities || {
        automatic_control_panel: true,
        water_well: true,
        solar_power_system: true,
        worker_housing: true,
        backup_generator: false
      },
      contact_phone: newHangar.contact_phone!,
      advertiser_name: newHangar.advertiser_name || 'مالك المزرعة',
      is_verified_farm: true
    };

    if (onAddRental) {
      onAddRental(createdRental);
    }
    setShowAddRentalModal(false);
  };

  // Filtered data
  const filteredMeds = medicines.filter(
    (m) =>
      m.commercial_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.active_ingredient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFeeds = feeds.filter((f) => {
    const matchSearch =
      f.feed_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStage = selectedFeedStage === 'all' || f.stage === selectedFeedStage;
    return matchSearch && matchStage;
  });

  const filteredEquipment = equipment.filter((eq) => {
    const matchSearch =
      eq.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.brand_manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedEquipCategory === 'all' || eq.category === selectedEquipCategory;
    return matchSearch && matchCat;
  });

  const filteredRentals = rentals.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGov = selectedRentalGov === 'all' || r.governorate.includes(selectedRentalGov);
    return matchSearch && matchGov;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
                السوق والخدمات الداجنة المعتمدة
              </span>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Coins className="w-3 h-3" />
                {currencyMode === 'YER_NEW_SAR' ? 'ريال يمني جديد + ريال سعودي' : 'ريال يمني قديم + ريال سعودي'}
              </span>
            </div>
            <h2 className="text-xl font-black text-white">
              منصة التوريد المعتمدة: أدوية، أعلاف، مستلزمات، وسوق الهناجر
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl">
              سوق رقمي موثوق يخضع للرقابة البيطرية الصارمة. تخضع الأدوية المقيدة لمحرك فحص الحساسية (AST Lock) وتلتزم الأعلاف والمعدات بالمواصفات القياسية.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {activeTab === 'rentals' && (
              <button
                onClick={() => setShowAddRentalModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-900/30"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة هنجر / مزرعة للإيجار</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-700/80 overflow-x-auto pb-1 text-xs font-bold">
          <button
            onClick={() => { setActiveTab('broker'); setSearchQuery(''); }}
            className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${activeTab === 'broker' ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-900/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
          >
            <PackageSearch className="w-4 h-4" />
            <span>0. التحقق من عروض الشركات</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('medicines');
              setSearchQuery('');
            }}
            className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'medicines'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>1. الأدوية والعلاجات البيطرية ({medicines.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('feeds');
              setSearchQuery('');
            }}
            className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'feeds'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Wheat className="w-4 h-4" />
            <span>2. الأعلاف وإضافات التغذية ({feeds.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('equipment');
              setSearchQuery('');
            }}
            className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'equipment'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>3. معدات ومستلزمات المزارع ({equipment.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('rentals');
              setSearchQuery('');
            }}
            className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'rentals'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>4. سوق الهناجر والمزارع للإيجار ({rentals.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('chicks');
              setSearchQuery('');
            }}
            className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'chicks'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Egg className="w-4 h-4" />
            <span>5. بورصة الكتاكيت اليومية ({smartOperations.chick_prices.length})</span>
          </button>
          <button
            onClick={() => { setActiveTab('orders'); setSearchQuery(''); }}
            className={`px-4 py-2.5 rounded-xl transition whitespace-nowrap flex items-center gap-2 ${activeTab === 'orders' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'}`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>6. طلباتي ({smartOperations.purchase_requests.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'broker' && smartOperations.enterprise.managed_operations_v19_7 && (
        <BrokerMarketplaceV197
          state={smartOperations.enterprise.managed_operations_v19_7}
          onChange={(next) => onUpdateSmartOperations({ ...smartOperations, enterprise: { ...smartOperations.enterprise, managed_operations_v19_7: next } })}
          currentUserRole={smartOperations.enterprise.platform_core_v19_5.users.find((u) => u.id === smartOperations.enterprise.platform_core_v19_5.active_user_id)?.role || 'farmer'}
          currentUserName={smartOperations.enterprise.platform_core_v19_5.users.find((u) => u.id === smartOperations.enterprise.platform_core_v19_5.active_user_id)?.name || 'مستخدم المنصة'}
          defaultCustomer={{ name: buyerName, phone: buyerPhone, governorate: customerGovernorate, district: purchaseDistrict, address: buyerAddress }}
          onOpenVet={onNavigateToVet}
        />
      )}

      {/* Global Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            placeholder={
              activeTab === 'medicines'
                ? 'بحث بالاسم التجاري، المادة الفعالة، أو الشركة...'
                : activeTab === 'vaccines'
                ? 'بحث باسم اللقاح أو الشركة...'
                : activeTab === 'feeds'
                ? 'بحث باسم العلف أو المطحن أو المكون...'
                : activeTab === 'equipment'
                ? 'بحث باسم المعدة أو الماركة...'
                : activeTab === 'chicks'
                ? 'بحث بالسلالة أو الشركة...'
                : 'بحث بالهنجر أو المحافظة أو المديرية...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Sub Filters based on Active Tab */}
        {activeTab === 'feeds' && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
            <span className="text-slate-400 text-[11px] whitespace-nowrap">مرحلة العلف:</span>
            {['all', 'بادي', 'نامي', 'ناهي', 'مركزات', 'إضافات أعلاف'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedFeedStage(st)}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                  selectedFeedStage === st
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {st === 'all' ? 'الكل' : st}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
            <span className="text-slate-400 text-[11px] whitespace-nowrap">التصنيف:</span>
            {['all', 'دفايات', 'شبكات سقي', 'معالف', 'شفاطات', 'خلايا تبريد', 'لوحات تحكم'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedEquipCategory(cat)}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                  selectedEquipCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat === 'all' ? 'الكل' : cat}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'rentals' && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
            <span className="text-slate-400 text-[11px] whitespace-nowrap">المحافظة:</span>
            {['all', 'صنعاء', 'ذمار', 'إب'].map((gov) => (
              <button
                key={gov}
                onClick={() => setSelectedRentalGov(gov)}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                  selectedRentalGov === gov
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {gov === 'all' ? 'كافة المحافظات' : gov}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2 text-[11px] text-slate-400 flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
        التسعير الظاهر مرتبط بمنطقة العميل المسجلة: <strong className="text-white">{customerGovernorate}</strong> • آخر تحديث صرف: {smartOperations.exchange_rates.last_updated}
      </div>
      {smartOperations.enterprise.partner_trade_contracts_v12?.some(c => c.status === 'active' && c.customer_visible) && (
        <div className="bg-emerald-950/20 border border-emerald-700/30 rounded-xl px-4 py-3 text-[11px] text-emerald-100">
          <strong>عروض الشركاء المتعاقدين:</strong> الأسعار والخصومات التي تحمل شارة «عقد معتمد» منشورة من الإدارة، وتطبّق فقط على الأصناف المرتبطة بعقد نشط وفي المناطق المشمولة.
        </div>
      )}

      {/* 1. MEDICINES TAB */}
      {activeTab === 'medicines' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMeds.map((med) => (
              <div
                key={med.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-lg transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {med.image_url && (
                    <div className="h-52 rounded-2xl overflow-hidden catalog-image-frame p-2">
                      <img src={med.image_url} alt={med.commercial_name} className="w-full h-full object-contain rounded-xl" loading="lazy" />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 block">{med.id}</span>
                      <h4 className="text-sm font-bold text-white leading-tight mt-0.5">{med.commercial_name}</h4>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 border ${
                        med.category === 'مضاد حيوي مقيد'
                          ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                          : 'bg-teal-950/80 text-teal-300 border-teal-800'
                      }`}
                    >
                      {med.category}
                    </span>
                  </div>
                  {contractOfferFor(med.company_id) && (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-700/30 bg-emerald-950/20 px-3 py-2 text-[10px]">
                      <span className="text-emerald-200 font-bold">عقد معتمد: {contractOfferFor(med.company_id)?.partner_name}</span>
                      <span className="text-amber-300 font-black">خصم {contractedRegionalPrice(med.price_yer, med.company_id).discount}%</span>
                    </div>
                  )}

                  <div className="p-3 bg-slate-950 rounded-xl space-y-1.5 text-xs text-slate-300 border border-slate-800/80">
                    <div className="flex justify-between">
                      <span className="text-slate-400">المادة الفعالة:</span>
                      <span className="text-white font-medium text-left dir-ltr truncate max-w-[170px]">
                        {med.active_ingredient}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">المصنع / المورد:</span>
                      <span className="text-slate-300 truncate max-w-[160px]">{med.manufacturer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">نوع وحجم العبوة:</span>
                      <span className="text-amber-300 font-medium">{med.package_type_size}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{med.indications_ar}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">فترة السحب (لحم/بيض):</span>
                      <strong className={`font-mono text-sm ${med.withdrawal_period_days > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {med.withdrawal_period_days > 0 ? `${med.withdrawal_period_days} أيام` : 'آمن تماماً (0 يوم)'}
                      </strong>
                    </div>

                    <div className="text-left">
                      <span className="text-slate-400 block text-[11px]">سعر العبوة:</span>
                      <strong className="text-emerald-400 font-mono text-base">
                        {contractedRegionalPrice(med.price_yer, med.company_id).final.localYer.toLocaleString()} <span className="text-xs">{contractedRegionalPrice(med.price_yer, med.company_id).final.label}</span>
                      </strong>
                      {contractedRegionalPrice(med.price_yer, med.company_id).discount > 0 && <span className="block text-[10px] text-slate-500 line-through">قبل الخصم: {contractedRegionalPrice(med.price_yer, med.company_id).original.localYer.toLocaleString()}</span>}<span className="block text-[10px] text-cyan-300 mt-0.5">≈ {contractedRegionalPrice(med.price_yer, med.company_id).final.sar} ر.س</span>
                    </div>
                  </div>

                  {/* Sensitivity Lock Alert */}
                  {med.sensitivity_test_required ? (
                    <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-center justify-between text-xs text-rose-300">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span className="text-[11px] font-bold">طلب الشراء متاح • الاستخدام بعد موافقة الطبيب</span>
                      </div>
                      <span className="text-[10px] bg-rose-900/60 px-2 py-0.5 rounded font-mono">Vet Approval</span>
                    </div>
                  ) : (
                    <div className="p-2 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-[11px]">الشراء متاح مباشرة مع الالتزام بالتعليمات على العبوة</span>
                    </div>
                  )}
                  <button onClick={() => openPurchase({ category: 'medicine', id: med.id, name: med.commercial_name, unitLabel: 'عبوة', unitPriceLocal: contractedRegionalPrice(med.price_yer, med.company_id).final.localYer, isAntibiotic: med.category === 'مضاد حيوي مقيد' })} className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white text-xs font-black flex items-center justify-center gap-2"><ShoppingCart className="w-4 h-4" /> شراء</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'vaccines' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vaccines.filter(v => v.is_active_in_market !== false && (v.vaccine_name_strain.toLowerCase().includes(searchQuery.toLowerCase()) || v.manufacturer_country.toLowerCase().includes(searchQuery.toLowerCase()))).map(v => {
              const offer = contractedRegionalPrice(v.price_dose_vial_yer, v.company_id);
              return <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                {v.image_url && <div className="h-52 rounded-2xl overflow-hidden catalog-image-frame p-2"><img src={v.image_url} alt={v.vaccine_name_strain} className="w-full h-full object-contain rounded-xl" loading="lazy" /></div>}
                <div><h4 className="text-sm font-black text-white">{v.vaccine_name_strain}</h4><div className="text-[11px] text-rose-300">{v.disease_targeted}</div><div className="text-[10px] text-slate-500 mt-1">{v.manufacturer_country}</div></div>
                {offer.contract && <div className="rounded-xl border border-emerald-700/30 bg-emerald-950/20 p-2 text-[10px] text-emerald-200">عقد معتمد • خصم {offer.discount}% • {offer.contract.partner_name}</div>}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-300">العمر الموصى: يوم {v.recommended_age_days} • الطريقة: {v.administration_route}<br/>الحفظ: {v.temperature_storage_celsius} • {v.doses_per_vial.toLocaleString()} جرعة/عبوة</div>
                <div className="flex justify-between items-end"><div><div className="text-[10px] text-slate-500">السعر المحلي</div><div className="text-emerald-300 font-black">{offer.final.localYer.toLocaleString()} {offer.final.label}</div>{offer.discount>0&&<div className="text-[10px] text-slate-500 line-through">قبل الخصم {offer.original.localYer.toLocaleString()}</div>}</div><div className="text-cyan-300 text-xs">{offer.final.sar} ر.س</div></div>
                <button onClick={() => openPurchase({ category: 'vaccine', id: v.id, name: v.vaccine_name_strain, unitLabel: 'عبوة لقاح', unitPriceLocal: offer.final.localYer, isAntibiotic: false })} className="w-full px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center justify-center gap-2"><ShoppingCart className="w-4 h-4" /> طلب شراء اللقاح</button>
              </div>;
            })}
          </div>
        </div>
      )}

      {/* 2. FEEDS TAB */}
      {activeTab === 'feeds' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFeeds.map((feed) => (
              <div
                key={feed.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-lg transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {feed.image_url && (
                    <div className="h-52 rounded-2xl overflow-hidden catalog-image-frame p-2">
                      <img src={feed.image_url} alt={feed.feed_name} className="w-full h-full object-contain rounded-xl" loading="lazy" />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 block">{feed.id}</span>
                      <h4 className="text-sm font-bold text-white leading-tight mt-0.5">{feed.feed_name}</h4>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-950/80 text-amber-300 border border-amber-800 shrink-0">
                      {feed.stage}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl space-y-2 text-xs border border-slate-800/80">
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">المصنع / المطحن:</span>
                      <strong className="text-white truncate max-w-[160px]">{feed.manufacturer}</strong>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                      <div className="bg-slate-900 p-2 rounded-lg text-center">
                        <span className="text-[10px] text-slate-400 block">بروتين خام</span>
                        <strong className="text-amber-400 font-mono text-sm">{feed.protein_percent}%</strong>
                      </div>
                      <div className="bg-slate-900 p-2 rounded-lg text-center">
                        <span className="text-[10px] text-slate-400 block">طاقة ممثلة</span>
                        <strong className="text-cyan-400 font-mono text-sm">{feed.energy_kcal_per_kg} <span className="text-[10px]">ك.ك</span></strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>متوفر في: {feed.available_in_regions.join('، ')}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[11px]">سعر الكيس (50 كجم):</span>
                      <strong className="text-white font-mono text-sm">
                        {contractedRegionalPrice(feed.price_bag_50kg_yer, feed.company_id).final.localYer.toLocaleString()} <span className="text-xs text-slate-400">{contractedRegionalPrice(feed.price_bag_50kg_yer, feed.company_id).final.label}</span>
                      </strong>
                    </div>

                    <div className="text-left">
                      <span className="text-slate-400 block text-[11px]">سعر الطن المباشر:</span>
                      <strong className="text-emerald-400 font-mono text-base font-bold">
                        {contractedRegionalPrice(feed.price_ton_yer, feed.company_id).final.localYer.toLocaleString()} <span className="text-xs">{contractedRegionalPrice(feed.price_ton_yer, feed.company_id).final.label}</span>
                        {contractedRegionalPrice(feed.price_ton_yer, feed.company_id).discount > 0 && <span className="block text-[10px] text-amber-300">خصم عقد {contractedRegionalPrice(feed.price_ton_yer, feed.company_id).discount}%</span>}<span className="block text-[10px] text-cyan-300">≈ {contractedRegionalPrice(feed.price_ton_yer, feed.company_id).final.sar} ر.س</span>
                      </strong>
                    </div>
                  </div>
                  <button onClick={() => openPurchase({ category: 'feed', id: feed.id, name: feed.feed_name, unitLabel: 'كيس 50 كجم', unitPriceLocal: contractedRegionalPrice(feed.price_bag_50kg_yer, feed.company_id).final.localYer, isAntibiotic: false })} className="w-full px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black flex items-center justify-center gap-2"><ShoppingCart className="w-4 h-4" /> شراء العلف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. EQUIPMENT TAB */}
      {activeTab === 'equipment' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEquipment.map((eq) => (
              <div
                key={eq.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-lg transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {eq.image_url && (
                    <div className="h-52 rounded-2xl overflow-hidden catalog-image-frame p-2">
                      <img src={eq.image_url} alt={eq.model_name} className="w-full h-full object-contain rounded-xl" loading="lazy" />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400 block">{eq.id}</span>
                      <h4 className="text-sm font-bold text-white leading-tight mt-0.5">{eq.model_name}</h4>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold shrink-0 border ${
                        eq.condition === 'جديد'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                          : 'bg-amber-950/80 text-amber-300 border-amber-800'
                      }`}
                    >
                      {eq.condition}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl space-y-1.5 text-xs text-slate-300 border border-slate-800/80">
                    <div className="flex justify-between">
                      <span className="text-slate-400">التصنيف:</span>
                      <span className="text-cyan-300 font-medium">{eq.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">الشركة المصنعة / الماركة:</span>
                      <strong className="text-white">{eq.brand_manufacturer}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">فترة الضمان:</span>
                      <span className="text-emerald-400 font-mono">{eq.warranty_months} شهراً</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{eq.specifications}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px]">السعر الفردي / المباشر:</span>
                    <strong className="text-emerald-400 font-mono text-base font-bold">
                      {contractedRegionalPrice(eq.unit_price_yer, eq.company_id).final.localYer.toLocaleString()} <span className="text-xs">{contractedRegionalPrice(eq.unit_price_yer, eq.company_id).final.label}</span>
                      {contractedRegionalPrice(eq.unit_price_yer, eq.company_id).discount > 0 && <span className="block text-[10px] text-amber-300">خصم عقد {contractedRegionalPrice(eq.unit_price_yer, eq.company_id).discount}%</span>}<span className="block text-[10px] text-cyan-300">≈ {contractedRegionalPrice(eq.unit_price_yer, eq.company_id).final.sar} ر.س</span>
                    </strong>
                  </div>

                  <button onClick={() => openPurchase({ category: 'equipment', id: eq.id, name: eq.model_name, unitLabel: 'قطعة', unitPriceLocal: contractedRegionalPrice(eq.unit_price_yer, eq.company_id).final.localYer, isAntibiotic: false })} className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black transition flex items-center gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>شراء</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. DAILY CHICK EXCHANGE */}
      {activeTab === 'chicks' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {smartOperations.chick_prices
              .filter((item) => item.strain.toLowerCase().includes(searchQuery.toLowerCase()) || item.company_name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => (
                <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  {item.image_url && <div className="h-52 rounded-2xl overflow-hidden catalog-image-frame p-2"><img src={item.image_url} alt={`${item.strain} كتاكيت`} className="w-full h-full object-contain rounded-xl" loading="lazy" /></div>}
                  <div className="flex items-start justify-between gap-2"><div><div className="text-[10px] text-slate-500">{item.date}</div><div className="flex items-center gap-2"><h4 className="text-base font-black text-white">{item.strain}</h4><span className="text-[9px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-full px-2 py-0.5">{item.chick_type}</span></div><p className="text-[11px] text-slate-400">{item.company_name}</p></div><span className="text-[10px] bg-violet-500/10 text-violet-300 border border-violet-500/30 rounded-full px-2 py-1">{item.market_trend}</span></div>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3"><span className="text-[10px] text-slate-500 block">السعر المحلي</span><strong className="text-emerald-400 font-mono">{currencyMode === 'YER_NEW_SAR' ? item.price_per_chick_yer_new.toLocaleString() : item.price_per_chick_yer_old.toLocaleString()}</strong></div>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3"><span className="text-[10px] text-slate-500 block">الريال السعودي</span><strong className="text-cyan-400 font-mono">{item.price_per_chick_sar.toFixed(2)} ر.س</strong></div>
                  </div>
                  {item.notes && <p className="text-[11px] text-slate-400">{item.notes}</p>}
                  <button onClick={() => openPurchase({ category: 'chicks', id: item.id, name: `${item.strain} — ${item.company_name}`, unitLabel: 'كتكوت', unitPriceLocal: currencyMode === 'YER_NEW_SAR' ? item.price_per_chick_yer_new : item.price_per_chick_yer_old, isAntibiotic: false })} className="w-full px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-black flex items-center justify-center gap-2"><ShoppingCart className="w-4 h-4" /> شراء كتاكيت</button>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-[#0b2733] border border-cyan-900/50 rounded-2xl p-4"><h3 className="text-sm font-black text-white">طلبات الشراء الخاصة بك</h3><p className="text-[11px] text-slate-400 mt-1">يمكنك هنا متابعة موافقة الطبيب للمضادات، أو قبول أجرة النقل بعد تسعير الإدارة لمنطقتك الجديدة.</p></div>
          {smartOperations.purchase_requests.length === 0 ? <div className="p-10 text-center text-xs text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">لم ترسل أي طلب شراء حتى الآن.</div> : smartOperations.purchase_requests.map((request) => {
            const pricedZone = smartOperations.zone_service_prices.find((z) => z.status === 'active' && request.governorate.includes(z.governorate) && z.district === request.district);
            const pendingFee = !request.transport_fee_accepted && Boolean(pricedZone);
            const currentFee = pricedZone ? convertReferenceYerOld(pricedZone.transport_fee_yer, getCurrencyMode(request.governorate, smartOperations.governorate_currency_rules), smartOperations.exchange_rates).localYer : request.transport_fee_local;
            return <div key={request.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 grid md:grid-cols-[1fr_auto] gap-4">
              <div><div className="font-black text-white text-sm">{request.product_name}</div><div className="text-[11px] text-slate-400 mt-1">{request.customer_name} • {request.phone} • {request.quantity} {request.unit_label} • {request.governorate} / {request.district}</div><div className="text-[10px] text-slate-500 mt-1">{request.customer_address}</div><div className="text-[11px] text-slate-400 mt-1">حالة الطلب: <strong className="text-cyan-300">{request.status.replaceAll('_', ' ')}</strong></div>{request.is_antibiotic && <div className="text-[11px] mt-1 text-rose-300">موافقة الطبيب: {request.vet_approved ? 'تمت الموافقة — يمكن متابعة الشراء مع الالتزام بالوصفة وفترة السحب' : 'قيد المراجعة — لا تستخدم المضاد قبل الاعتماد'}</div>}{request.finance_approved && <div className="text-[11px] mt-1 text-emerald-300">المالية: تم تأكيد وصول المبلغ</div>}</div>
              <div className="min-w-[220px] text-xs space-y-2"><div className="text-slate-400">قيمة المنتجات: <strong className="text-white">{request.product_total_local.toLocaleString()}</strong></div><div className="text-slate-400">أجرة النقل: <strong className="text-amber-300">{pricedZone ? currentFee.toLocaleString() : request.transport_fee_accepted ? request.transport_fee_local.toLocaleString() : 'بانتظار الإدارة'}</strong></div>{request.delivery_eta_hours && <div className="text-cyan-300">التوصيل المتوقع: {request.delivery_eta_hours} ساعة • {request.assigned_branch_name || 'الفرع المعتمد'}</div>}{pendingFee && <button onClick={() => acceptPendingTransportFee(request.id)} className="w-full px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black">أوافق على الأجرة {currentFee.toLocaleString()}</button>}{request.transport_fee_accepted && <div className="text-emerald-300 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> تمت موافقتك على الأجرة</div>}{['awaiting_payment','approved_for_purchase'].includes(request.status) && <button onClick={() => openPayment(request.id)} className="w-full px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black">عرض حسابات التحويل ورفع الحوالة</button>}{request.status === 'payment_under_review' && <div className="text-amber-300">تم إرسال صورة الحوالة • بانتظار المالية</div>}{request.status === 'payment_verified' && <div className="text-emerald-300">تم اعتماد المبلغ • بانتظار التجهيز</div>}{request.status === 'preparing' && <div className="text-cyan-300">يجري تجهيز الطلب</div>}{request.status === 'out_for_delivery' && <div className="text-violet-300">الطلب خرج للتوصيل</div>}{request.status === 'delivered' && <div className="text-emerald-300 font-black">تم التسليم</div>}</div>
            </div>;
          })}
        </div>
      )}

      {/* 4. HANGAR RENTALS TAB */}
      {activeTab === 'rentals' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredRentals.map((rental) => (
              <div
                key={rental.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  {/* Photo Preview Banner */}
                  <div className="relative h-44 bg-slate-950 overflow-hidden">
                    <img
                      src={rental.images[0]}
                      alt={rental.title}
                      className="w-full h-full object-cover opacity-85 hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span className="bg-slate-900/90 backdrop-blur-md text-emerald-400 text-xs px-3 py-1 rounded-full font-bold border border-slate-700 flex items-center gap-1">
                        <Home className="w-3 h-3" />
                        <span>{rental.capacity_birds.toLocaleString()} طائر</span>
                      </span>
                      {rental.is_verified_farm && (
                        <span className="bg-emerald-950/90 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-700 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>معتمد</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{rental.governorate} • {rental.district}</span>
                      </div>
                      <h4 className="text-base font-bold text-white leading-snug">{rental.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rental.location_details}</p>
                    </div>

                    {/* Area & Dimensions */}
                    <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">الطول</span>
                        <strong className="text-white font-mono">{rental.length_meters} م</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">العرض</span>
                        <strong className="text-white font-mono">{rental.width_meters} م</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">المساحة الكلية</span>
                        <strong className="text-emerald-400 font-mono">{rental.total_area_m2} م²</strong>
                      </div>
                    </div>

                    {/* Amenities Checklist */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-300 block">المرافق والتجهيزات المتاحة:</span>
                      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                        <div className={`p-1.5 rounded-lg flex items-center gap-1.5 ${rental.amenities.automatic_control_panel ? 'text-emerald-300 bg-emerald-950/30' : 'text-slate-600'}`}>
                          <Settings className="w-3.5 h-3.5 shrink-0" />
                          <span>لوحة تحكم أوتوماتيك</span>
                        </div>
                        <div className={`p-1.5 rounded-lg flex items-center gap-1.5 ${rental.amenities.water_well ? 'text-emerald-300 bg-emerald-950/30' : 'text-slate-600'}`}>
                          <Droplet className="w-3.5 h-3.5 shrink-0" />
                          <span>بئر ماء مستقل</span>
                        </div>
                        <div className={`p-1.5 rounded-lg flex items-center gap-1.5 ${rental.amenities.solar_power_system ? 'text-emerald-300 bg-emerald-950/30' : 'text-slate-600'}`}>
                          <Sun className="w-3.5 h-3.5 shrink-0" />
                          <span>منظومة طاقة شمسية</span>
                        </div>
                        <div className={`p-1.5 rounded-lg flex items-center gap-1.5 ${rental.amenities.worker_housing ? 'text-emerald-300 bg-emerald-950/30' : 'text-slate-600'}`}>
                          <Home className="w-3.5 h-3.5 shrink-0" />
                          <span>سكن عمال مجهز</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[11px]">سعر الإيجار ({rental.rental_term}):</span>
                      <strong className="text-emerald-400 font-mono text-lg font-bold">
                        {rental.rental_price_yer.toLocaleString()} <span className="text-xs">ريال</span>
                      </strong>
                    </div>

                    <a
                      href={`tel:${rental.contact_phone}`}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-900/40"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>اتصال بالحاج {rental.advertiser_name.split(' ')[0]}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {paymentRequestId && (
        <div className="fixed inset-0 z-[65] bg-[#061922]/90 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-[#0b2733] border border-emerald-800/50 rounded-3xl w-full max-w-xl p-5 space-y-4" dir="rtl">
            <div className="flex justify-between items-start"><div><h3 className="font-black text-white">إثبات التحويل ومراجعة المالية</h3><p className="text-[11px] text-slate-400 mt-1">اختر الحساب الذي حولت إليه ثم ارفع صورة واضحة للحوالة.</p></div><button onClick={() => setPaymentRequestId(null)} className="text-slate-400"><X className="w-5 h-5" /></button></div>
            <div className="space-y-2">{smartOperations.payment_accounts.filter((a) => a.active).map((a) => <label key={a.id} className={`block p-3 rounded-xl border cursor-pointer ${paymentAccountId === a.id ? 'border-emerald-500 bg-emerald-950/30' : 'border-slate-700 bg-[#071b25]'}`}><div className="flex items-start gap-2"><input type="radio" checked={paymentAccountId === a.id} onChange={() => setPaymentAccountId(a.id)} /><div><div className="text-xs font-bold text-white">{a.provider} • {a.currency}</div><div className="text-[11px] text-emerald-300">{a.account_name}</div><div className="text-[11px] font-mono text-slate-300">{a.account_number}</div><div className="text-[10px] text-slate-500 mt-1">{a.instructions}</div></div></div></label>)}</div>
            <input value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} placeholder="رقم الحوالة / المرجع (إن وجد)" className="w-full bg-[#071b25] border border-slate-700 rounded-xl p-2.5 text-white text-xs" />
            <label className="block text-xs text-slate-300 space-y-1"><span>صورة إثبات الحوالة *</span><input type="file" accept="image/*" capture="environment" onChange={async (e) => { const f=e.target.files?.[0]; if(f) setPaymentProof(await fileToDataUrl(f)); }} className="w-full bg-[#071b25] border border-slate-700 rounded-xl p-2 text-slate-300" /></label>
            {paymentProof && <img src={paymentProof} alt="إثبات الحوالة" className="w-full h-44 object-contain bg-black/20 rounded-xl border border-emerald-900/40" />}
            <button disabled={!paymentAccountId || !paymentProof} onClick={submitPaymentProof} className="w-full py-2.5 rounded-xl bg-emerald-600 disabled:opacity-40 text-white text-xs font-black">إرسال الإثبات إلى المالية</button>
          </div>
        </div>
      )}

      {purchaseTarget && (
        <div className="fixed inset-0 z-[60] bg-[#061922]/90 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-[#0b2733] border border-cyan-800/50 rounded-3xl w-full max-w-3xl shadow-2xl max-h-[92vh] overflow-y-auto p-5 space-y-4" dir="rtl">
            <div className="flex items-start justify-between gap-3 border-b border-cyan-900/40 pb-3">
              <div><div className="flex items-center gap-2 text-white font-black"><ShoppingCart className="w-5 h-5 text-cyan-400" /> شراء: {purchaseTarget.name}</div><p className="text-[11px] text-slate-400 mt-1">راجع السعر، الكمية وأجرة المنطقة ثم أكد موافقتك.</p></div>
              <button onClick={() => setPurchaseTarget(null)} className="w-8 h-8 rounded-lg bg-white/5 text-slate-400 hover:text-white flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>

            <div className="bg-cyan-950/40 border border-cyan-800/40 rounded-2xl p-4 flex gap-3 text-xs">
              <Bot className="w-5 h-5 text-cyan-400 shrink-0" />
              <div><strong className="text-cyan-200 block mb-1">المساعد الذكي:</strong><span className="text-slate-300 leading-relaxed">{aiSalesMessage(purchaseTarget)}</span></div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <label className="space-y-1"><span className="text-slate-400">اسم العميل</span><input value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="w-full bg-[#071b25] border border-cyan-900/50 rounded-xl p-2.5 text-white" /></label>
              <label className="space-y-1"><span className="text-slate-400">رقم الهاتف</span><input value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} className="w-full bg-[#071b25] border border-cyan-900/50 rounded-xl p-2.5 text-white" /></label>
              <label className="space-y-1"><span className="text-slate-400">العنوان بالتفصيل</span><input value={buyerAddress} onChange={(e) => setBuyerAddress(e.target.value)} className="w-full bg-[#071b25] border border-cyan-900/50 rounded-xl p-2.5 text-white" /></label>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <label className="space-y-1"><span className="text-slate-400">الكمية ({purchaseTarget.unitLabel})</span><input type="number" min={1} value={purchaseQuantity} onChange={(e) => setPurchaseQuantity(Math.max(1, Number(e.target.value)))} className="w-full bg-[#071b25] border border-cyan-900/50 rounded-xl p-2.5 text-white font-mono" /></label>
              <label className="space-y-1"><span className="text-slate-400">المنطقة / المديرية</span><select value={purchaseDistrict} onChange={(e) => { setPurchaseDistrict(e.target.value); setTransportAccepted(false); }} className="w-full bg-[#071b25] border border-cyan-900/50 rounded-xl p-2.5 text-white"><option value="">منطقة أخرى تحتاج تسعير الإدارة</option>{zonesForGovernorate.map((z) => <option key={z.id} value={z.district}>{z.district}</option>)}</select></label>
              {!purchaseDistrict && <label className="space-y-1 sm:col-span-2"><span className="text-slate-400">اكتب اسم المديرية / المنطقة الجديدة</span><input value={customDistrict} onChange={(e) => setCustomDistrict(e.target.value)} placeholder="مثال: الحوبان" className="w-full bg-[#071b25] border border-violet-800/50 rounded-xl p-2.5 text-white" /></label>}
            </div>

            <div className="grid sm:grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-[#071b25] border border-cyan-900/40 rounded-xl p-3"><span className="text-slate-500 block text-[10px]">قيمة الأصناف</span><strong className="text-white font-mono">{productTotalLocal.toLocaleString()}</strong></div>
              <div className="bg-[#071b25] border border-cyan-900/40 rounded-xl p-3"><span className="text-slate-500 block text-[10px]">أجرة النقل للمنطقة</span><strong className="text-amber-300 font-mono">{selectedZone ? transportFeeLocal.toLocaleString() : 'بانتظار التسعير'}</strong></div>
              <div className="bg-[#071b25] border border-cyan-900/40 rounded-xl p-3"><span className="text-slate-500 block text-[10px]">الإجمالي</span><strong className="text-emerald-300 font-mono">{selectedZone ? grandTotalLocal.toLocaleString() : productTotalLocal.toLocaleString()} {regionalPrice(1).label}</strong></div>
            </div>

            {selectedZone && (selectedZone.branch_name || selectedZone.delivery_eta_hours) && <div className="p-3 rounded-xl bg-cyan-950/25 border border-cyan-800/40 text-[11px] text-cyan-100">الفرع المسؤول: <strong>{selectedZone.branch_name || 'يحدد من الإدارة'}</strong> {selectedZone.branch_address ? `• ${selectedZone.branch_address}` : ''} {selectedZone.delivery_eta_hours ? `• زمن التوصيل المتوقع: ${selectedZone.delivery_eta_hours} ساعة` : ''}</div>}

            {selectedZone ? (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-700/40 text-xs text-amber-100 space-y-2">
                <div className="flex items-center gap-2"><Truck className="w-4 h-4" /><strong>هل توافق على أجرة النقل للمنطقة بقيمة {transportFeeLocal.toLocaleString()} {regionalPrice(1).label}؟</strong></div>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={transportAccepted} onChange={(e) => setTransportAccepted(e.target.checked)} className="accent-emerald-500" /> نعم، أوافق على الأجرة وأريد متابعة الطلب.</label>
              </div>
            ) : <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-700/40 text-xs text-violet-200">هذه المنطقة غير مسعرة بعد. يمكنك إرسال الطلب للإدارة، وبعد تحديد الأجرة ستُعرض عليك للموافقة قبل التنفيذ.</div>}

            {purchaseTarget.isAntibiotic && (
              <div className="space-y-3 border border-rose-700/40 bg-rose-950/20 rounded-2xl p-4">
                <div className="flex gap-2 text-rose-200 text-xs"><ShieldAlert className="w-5 h-5 shrink-0" /><div><strong className="block">طلب مضاد حيوي — موافقة الطبيب إلزامية</strong><span className="text-[11px] text-rose-200/80">يسمح النظام بطلب الشراء، لكنه لا يسمح باعتبار الدواء صالحاً للاستخدام حتى يراجع الطبيب بيانات القطيع ويعتمد الطلب. فترة السحب تُطبق بعد الوصفة.</span></div></div>
                <div className="grid sm:grid-cols-3 gap-2 text-[11px]">
                  <ClinicalField label="عمر القطيع/يوم" value={clinicalFile.flock_age_days} onChange={(v) => setClinicalFile({ ...clinicalFile, flock_age_days: Number(v) })} type="number" />
                  <ClinicalField label="عدد القطيع" value={clinicalFile.flock_size} onChange={(v) => setClinicalFile({ ...clinicalFile, flock_size: Number(v) })} type="number" />
                  <ClinicalField label="النافق اليوم" value={clinicalFile.mortality_today} onChange={(v) => setClinicalFile({ ...clinicalFile, mortality_today: Number(v) })} type="number" />
                  <ClinicalField label="درجة الحرارة" value={clinicalFile.temperature_celsius} onChange={(v) => setClinicalFile({ ...clinicalFile, temperature_celsius: Number(v) })} type="number" />
                  <ClinicalField label="العلف كجم/يوم" value={clinicalFile.feed_consumption_kg} onChange={(v) => setClinicalFile({ ...clinicalFile, feed_consumption_kg: Number(v) })} type="number" />
                  <ClinicalField label="الماء لتر/يوم" value={clinicalFile.water_consumption_liters} onChange={(v) => setClinicalFile({ ...clinicalFile, water_consumption_liters: Number(v) })} type="number" />
                </div>
                <ClinicalField label="سبب طلب العلاج" value={clinicalFile.reason_for_request} onChange={(v) => setClinicalFile({ ...clinicalFile, reason_for_request: String(v) })} />
                <ClinicalField label="الأعراض الحالية" value={clinicalFile.symptoms} onChange={(v) => setClinicalFile({ ...clinicalFile, symptoms: String(v) })} />
                <ClinicalField label="العنوان بالتفصيل" value={clinicalFile.farm_address} onChange={(v) => setClinicalFile({ ...clinicalFile, farm_address: String(v) })} />
                <div className="grid sm:grid-cols-2 gap-2 text-[11px]">
                  <label className="space-y-1 text-slate-400">
                    صورة الإسهال
                    <input type="file" accept="image/*" capture="environment" onChange={(e) => handleDiarrheaImage(e.target.files?.[0])} className="w-full bg-[#071b25] border border-rose-900/40 rounded-xl p-2 text-slate-300" />
                    {clinicalFile.diarrhea_image_url && <img src={clinicalFile.diarrhea_image_url} alt="صورة الإسهال" className="w-full h-28 object-contain rounded-xl border border-rose-900/40 bg-black/20" />}
                  </label>
                  <label className="space-y-1 text-slate-400">
                    صور التشريح
                    <input type="file" accept="image/*" capture="environment" multiple onChange={(e) => handleNecropsyImages(e.target.files)} className="w-full bg-[#071b25] border border-rose-900/40 rounded-xl p-2 text-slate-300" />
                    {clinicalFile.necropsy_image_urls.length > 0 && <div className="grid grid-cols-3 gap-1">{clinicalFile.necropsy_image_urls.map((url, index) => <img key={index} src={url} alt={`صورة تشريح ${index + 1}`} className="w-full h-28 object-contain bg-black/20 rounded-lg border border-rose-900/40" />)}</div>}
                  </label>
                </div>
              </div>
            )}

            {purchaseSuccess && <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/40 text-emerald-200 text-xs flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {purchaseSuccess}</div>}
            <div className="flex justify-end gap-2"><button onClick={() => setPurchaseTarget(null)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs">إغلاق</button><button onClick={submitPurchase} disabled={!buyerName.trim() || !buyerPhone.trim() || !buyerAddress.trim() || (Boolean(selectedZone) && !transportAccepted) || (!selectedZone && !customDistrict.trim())} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 disabled:opacity-40 text-white font-black text-xs flex items-center gap-2"><ClipboardCheck className="w-4 h-4" /> {purchaseTarget.isAntibiotic ? 'إرسال للطبيب واعتماد الشراء' : selectedZone ? 'تأكيد الشراء' : 'إرسال المنطقة للتسعير'}</button></div>
          </div>
        </div>
      )}

      {/* Modal: Add Hangar Rental Listing */}
      {showAddRentalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">إضافة هنجر أو مزرعة للإيجار</h3>
                  <p className="text-xs text-slate-400">سجل بيانات المنشأة بدقة لعرضها للمربين والمستثمرين</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddRentalModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRental} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">اسم المنشأة / الإعلان:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: عنبر تسمين مغلق حديث (صنعاء - بني حشيش)"
                  value={newHangar.title}
                  onChange={(e) => setNewHangar({ ...newHangar, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">المحافظة:</label>
                  <select
                    value={newHangar.governorate}
                    onChange={(e) => setNewHangar({ ...newHangar, governorate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="محافظة صنعاء">محافظة صنعاء</option>
                    <option value="محافظة ذمار">محافظة ذمار</option>
                    <option value="محافظة إب">محافظة إب</option>
                    <option value="محافظة تعز">محافظة تعز</option>
                    <option value="محافظة الحديدة">محافظة الحديدة</option>
                    <option value="محافظة عمران">محافظة عمران</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">المديرية / المنطقة:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مديرية بني مطر"
                    value={newHangar.district}
                    onChange={(e) => setNewHangar({ ...newHangar, district: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px] block">الطول (متر):</label>
                  <input
                    type="number"
                    value={newHangar.length_meters}
                    onChange={(e) => setNewHangar({ ...newHangar, length_meters: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px] block">العرض (متر):</label>
                  <input
                    type="number"
                    value={newHangar.width_meters}
                    onChange={(e) => setNewHangar({ ...newHangar, width_meters: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 text-[11px] block">السعة (طير):</label>
                  <input
                    type="number"
                    value={newHangar.capacity_birds}
                    onChange={(e) => setNewHangar({ ...newHangar, capacity_birds: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-emerald-400 font-mono text-center font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">سعر الإيجار بالريال اليمني:</label>
                  <input
                    type="number"
                    required
                    value={newHangar.rental_price_yer}
                    onChange={(e) => setNewHangar({ ...newHangar, rental_price_yer: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">نوع فترة الإيجار:</label>
                  <select
                    value={newHangar.rental_term}
                    onChange={(e) => setNewHangar({ ...newHangar, rental_term: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="للدورة">للدورة الإنتاجية (45 - 60 يوماً)</option>
                    <option value="شهرياً">شهرياً</option>
                    <option value="سنوياً">عقد سنوي</option>
                  </select>
                </div>
              </div>

              {/* Amenities Checkboxes */}
              <div className="space-y-2 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-slate-300 font-bold block text-xs">المرافق المتاحة بالمنشأة:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={newHangar.amenities?.automatic_control_panel}
                      onChange={(e) =>
                        setNewHangar({
                          ...newHangar,
                          amenities: { ...newHangar.amenities!, automatic_control_panel: e.target.checked }
                        })
                      }
                      className="rounded accent-emerald-500"
                    />
                    <span>لوحة تحكم أوتوماتيك</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={newHangar.amenities?.water_well}
                      onChange={(e) =>
                        setNewHangar({
                          ...newHangar,
                          amenities: { ...newHangar.amenities!, water_well: e.target.checked }
                        })
                      }
                      className="rounded accent-emerald-500"
                    />
                    <span>بئر ماء مستقل</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={newHangar.amenities?.solar_power_system}
                      onChange={(e) =>
                        setNewHangar({
                          ...newHangar,
                          amenities: { ...newHangar.amenities!, solar_power_system: e.target.checked }
                        })
                      }
                      className="rounded accent-emerald-500"
                    />
                    <span>منظومة طاقة شمسية</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={newHangar.amenities?.worker_housing}
                      onChange={(e) =>
                        setNewHangar({
                          ...newHangar,
                          amenities: { ...newHangar.amenities!, worker_housing: e.target.checked }
                        })
                      }
                      className="rounded accent-emerald-500"
                    />
                    <span>سكن عمال مجهز</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">اسم المعلن / المالك:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: الحاج عبد الرقيب"
                    value={newHangar.advertiser_name}
                    onChange={(e) => setNewHangar({ ...newHangar, advertiser_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">رقم هاتف التواصل:</label>
                  <input
                    type="text"
                    required
                    placeholder="+967 771 234 567"
                    value={newHangar.contact_phone}
                    onChange={(e) => setNewHangar({ ...newHangar, contact_phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddRentalModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/40"
                >
                  نشر الإعلان في السوق
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ClinicalField: React.FC<{ label: string; value: string | number; onChange: (v: string | number) => void; type?: 'text' | 'number' }> = ({ label, value, onChange, type = 'text' }) => (
  <label className="space-y-1 text-[11px] text-slate-400 block"><span>{label}</span><input type={type} value={value} onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)} className="w-full bg-[#071b25] border border-rose-900/40 rounded-xl p-2 text-white outline-none focus:border-cyan-500" /></label>
);
