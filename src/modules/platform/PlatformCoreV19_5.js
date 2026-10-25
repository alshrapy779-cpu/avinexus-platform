import { parseFieldMediaTranscriptV19 } from '../chat/MediaDataParser';
const iso = () => new Date().toISOString();
const nid = (p) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
export const platformNumberV195 = (prefix) => `${prefix}-YE-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
export const PERMISSIONS_V195 = {
    system_owner: ['*'], ceo: ['view_all', 'manage_strategy', 'approve_finance', 'manage_users', 'manage_catalog', 'manage_suppliers', 'manage_cases', 'manage_emergency'],
    sector_manager: ['view_operations', 'manage_cases', 'manage_staff', 'approve_operations'], finance: ['view_finance', 'approve_finance', 'manage_fx', 'manage_documents'],
    marketing: ['view_market', 'manage_prices', 'manage_chicks', 'manage_customers'], vet_consultant: ['view_medical', 'approve_medical', 'manage_cases', 'view_farms'],
    field_vet: ['view_medical', 'field_reports', 'manage_assigned_cases', 'view_assigned_farms'], supervisor: ['field_reports', 'manage_workers', 'view_assigned_farms'],
    worker: ['field_reports', 'chat', 'view_assigned_farm'], supplier: ['supplier_portal', 'manage_own_catalog', 'manage_own_stock'], warehouse: ['warehouse_portal', 'manage_stock'],
    laboratory: ['lab_portal', 'manage_lab_results'], farmer: ['customer_portal', 'chat', 'orders', 'view_own_farms'], support: ['support', 'view_non_sensitive']
};
export const permissionsForRoleV195 = (role) => PERMISSIONS_V195[role] || [];
export const canV195 = (state, permission) => { const u = state.users.find(x => x.id === state.active_user_id); return Boolean(u && (u.permissions.includes('*') || u.permissions.includes(permission))); };
export const INITIAL_PLATFORM_CORE_V195 = {
    version: '19.5', active_user_id: 'usr-owner',
    users: [
        { id: 'usr-owner', name: 'مالك النظام', role: 'system_owner', phone: '770000001', governorate: 'صنعاء', status: 'active', permissions: ['*'] },
        { id: 'usr-ceo', name: 'المدير التنفيذي', role: 'ceo', phone: '770000002', governorate: 'صنعاء', status: 'active', permissions: permissionsForRoleV195('ceo') },
        { id: 'usr-vet', name: 'الاستشاري البيطري الرئيسي', role: 'vet_consultant', phone: '770000003', governorate: 'صنعاء', status: 'active', permissions: permissionsForRoleV195('vet_consultant') },
        { id: 'usr-field-vet', name: 'الطبيب الميداني', role: 'field_vet', phone: '770000006', governorate: 'صنعاء', status: 'active', permissions: permissionsForRoleV195('field_vet') },
        { id: 'usr-finance', name: 'مسؤول المالية', role: 'finance', phone: '770000007', governorate: 'صنعاء', status: 'active', permissions: permissionsForRoleV195('finance') },
        { id: 'usr-marketing', name: 'مسؤول المبيعات والتسويق', role: 'marketing', phone: '770000008', governorate: 'صنعاء', status: 'active', permissions: permissionsForRoleV195('marketing') },
        { id: 'usr-warehouse', name: 'مسؤول المخزن', role: 'warehouse', phone: '770000009', governorate: 'صنعاء', status: 'active', permissions: permissionsForRoleV195('warehouse') },
        { id: 'usr-lab', name: 'مسؤول المختبر', role: 'laboratory', phone: '770000010', governorate: 'صنعاء', status: 'active', permissions: permissionsForRoleV195('laboratory') },
        { id: 'usr-supervisor', name: 'المشرف الميداني', role: 'supervisor', phone: '770000011', governorate: 'صنعاء', status: 'active', permissions: permissionsForRoleV195('supervisor') },
        { id: 'usr-worker', name: 'عامل العنبر', role: 'worker', phone: '770000004', governorate: 'صنعاء', status: 'active', permissions: permissionsForRoleV195('worker') },
        { id: 'usr-farmer', name: 'حساب عميل للاختبار', role: 'farmer', phone: '770000005', governorate: 'صنعاء', status: 'active', permissions: permissionsForRoleV195('farmer') }
    ],
    staff: [
        { id: 'staff-vet-1', user_id: 'usr-vet', name: 'الاستشاري البيطري الرئيسي', role: 'vet_consultant', phone: '770000003', governorate: 'صنعاء', district: 'أمانة العاصمة', license_number: 'VET-YE-001', license_valid_until: '2027-12-31', contract_number: 'CTR-VET-001', contract_valid_until: '2027-12-31', availability: 'available', rating: 4.8, assigned_farms: ['مزرعة وادي سبأ النموذجية للدواجن'], reward_yer: 50000 },
        { id: 'staff-worker-1', user_id: 'usr-worker', name: 'عامل العنبر', role: 'worker', phone: '770000004', governorate: 'صنعاء', district: 'بني حشيش', contract_number: 'CTR-WRK-001', contract_valid_until: '2027-06-30', availability: 'available', rating: 4.5, assigned_farms: ['مزرعة وادي سبأ النموذجية للدواجن'] }
    ],
    suppliers: [
        { id: 'sup-vac-1', name: 'شركة لقاحات متعاقدة', categories: ['vaccine'], contact_name: 'مسؤول التوريد', phone: '771111111', contract_number: 'SUP-2026-001', contract_valid_until: '2027-12-31', commission_percent: 4, status: 'active', branch_ids: ['br-vac-sanaa'], rating: 4.7, complaints_open: 0, payable_balance: 0, currency: 'SAR' },
        { id: 'sup-feed-1', name: 'مصنع أعلاف متعاقد', categories: ['feed', 'feed_additive'], contact_name: 'مدير المبيعات', phone: '772222222', contract_number: 'SUP-2026-002', contract_valid_until: '2027-09-30', commission_percent: 3.5, status: 'active', branch_ids: ['br-feed-ibb'], rating: 4.5, complaints_open: 1, payable_balance: 350000, currency: 'YER_OLD' }
    ],
    supplier_branches: [
        { id: 'br-vac-sanaa', supplier_id: 'sup-vac-1', supplier_name: 'شركة لقاحات متعاقدة', category: 'vaccine', name: 'فرع صنعاء', governorate: 'صنعاء', district: 'أمانة العاصمة', address: 'صنعاء', phone: '771111112', warehouse_id: 'wh-sanaa-vac', cold_chain: true, contract_number: 'SUP-2026-001', contract_valid_until: '2027-12-31', status: 'active' },
        { id: 'br-feed-ibb', supplier_id: 'sup-feed-1', supplier_name: 'مصنع أعلاف متعاقد', category: 'feed', name: 'فرع إب', governorate: 'إب', district: 'المدينة', address: 'إب', phone: '772222223', warehouse_id: 'wh-ibb-feed', cold_chain: false, contract_number: 'SUP-2026-002', contract_valid_until: '2027-09-30', status: 'active' }
    ],
    catalog: [
        { id: 'cat-vac-nd', sku: 'VAC-ND-1000', category: 'vaccine', name: 'لقاح نيوكاسل 1000 جرعة', scientific_name: 'Newcastle Disease Vaccine', supplier_id: 'sup-vac-1', supplier_name: 'شركة لقاحات متعاقدة', unit: 'فيال', base_currency: 'SAR', prices: [{ id: 'p1', currency: 'SAR', amount: 32, effective_at: '2026-09-17T00:00:00+03:00', approved_by: 'الإدارة', active: true }, { id: 'p2', currency: 'YER_OLD', amount: 4480, effective_at: '2026-09-17T00:00:00+03:00', approved_by: 'الإدارة', active: true }, { id: 'p3', currency: 'YER_NEW', amount: 17120, effective_at: '2026-09-17T00:00:00+03:00', approved_by: 'الإدارة', active: true }], lot_tracking_required: true, cold_chain_required: true, status: 'active', created_at: '2026-09-17T00:00:00+03:00', updated_at: '2026-09-17T00:00:00+03:00' },
        { id: 'cat-feed-grower', sku: 'FEED-GROWER-50KG', category: 'feed', name: 'علف نامي 50 كجم', supplier_id: 'sup-feed-1', supplier_name: 'مصنع أعلاف متعاقد', unit: 'كيس 50كجم', base_currency: 'YER_OLD', prices: [{ id: 'p4', currency: 'YER_OLD', amount: 28500, effective_at: '2026-09-17T00:00:00+03:00', approved_by: 'الإدارة', active: true }], lot_tracking_required: true, cold_chain_required: false, status: 'active', created_at: '2026-09-17T00:00:00+03:00', updated_at: '2026-09-17T00:00:00+03:00' }
    ],
    price_history: [],
    inventory_lots: [
        { id: 'lot-vac-01', lot_number: 'ND-260901', item_id: 'cat-vac-nd', item_name: 'لقاح نيوكاسل 1000 جرعة', branch_id: 'br-vac-sanaa', warehouse_name: 'مخزن لقاحات صنعاء', quantity_on_hand: 120, quantity_reserved: 20, unit: 'فيال', expiry_date: '2027-03-01', cold_chain_required: true, temperature_c: 4.2, status: 'available' },
        { id: 'lot-feed-01', lot_number: 'GR-260915', item_id: 'cat-feed-grower', item_name: 'علف نامي 50 كجم', branch_id: 'br-feed-ibb', warehouse_name: 'مخزن أعلاف إب', quantity_on_hand: 850, quantity_reserved: 70, unit: 'كيس', expiry_date: '2026-12-15', cold_chain_required: false, status: 'available' }
    ], inventory_reservations: [], inventory_movements: [], procurement: [], recalls: [],
    cold_chain_events: [{ id: 'cc-1', at: '2026-09-17T01:00:00+03:00', shipment_or_lot: 'ND-260901', location: 'مخزن لقاحات صنعاء', temperature_c: 4.2, min_c: 2, max_c: 8, status: 'compliant' }],
    cases: [{ id: 'case-1', case_number: 'CASE-YE-2026-0001', type: 'veterinary', title: 'هبوط استهلاك العلف وارتفاع النفوق', customer_name: 'عميل المنصة التجريبي', farm_name: 'مزرعة وادي سبأ النموذجية للدواجن', flock_code: 'FLK-2026-07C', priority: 'high', status: 'under_review', owner_role: 'vet_consultant', owner_name: 'الاستشاري البيطري الرئيسي', created_at: '2026-09-17T00:15:00+03:00', updated_at: '2026-09-17T00:45:00+03:00', timeline: [{ id: 'ce-1', at: '2026-09-17T00:15:00+03:00', actor: 'عامل العنبر', role: 'worker', action: 'فتح الحالة', note: 'تم رصد انخفاض العلف وارتفاع النفوق' }, { id: 'ce-2', at: '2026-09-17T00:45:00+03:00', actor: 'النظام', role: 'ai_coordinator', action: 'تصعيد للطبيب', note: 'Human-in-the-Loop' }] }],
    complaints: [], appointments: [{ id: 'apt-1', vet_name: 'الاستشاري البيطري الرئيسي', farm_name: 'مزرعة وادي سبأ النموذجية للدواجن', governorate: 'صنعاء', scheduled_at: '2026-09-17T10:30:00+03:00', eta_minutes: 45, visit_fee_yer: 50000, status: 'scheduled', case_id: 'case-1' }],
    chat_rooms: [{ id: 'room-1', title: 'متابعة هنجر 2', farm_name: 'مزرعة وادي سبأ النموذجية للدواجن', flock_code: 'FLK-2026-07C', participant_ids: ['usr-worker', 'usr-vet', 'usr-ceo'], participant_names: ['عامل العنبر', 'الاستشاري البيطري الرئيسي', 'المدير التنفيذي'], priority: 'high', case_id: 'case-1', status: 'active', last_message_at: '2026-09-17T00:42:00+03:00' }],
    chat_messages: [{ id: 'cm-1', room_id: 'room-1', sender_id: 'usr-worker', sender_name: 'عامل العنبر', sender_role: 'worker', type: 'text', text: 'النافق 18 الحرارة 24 الرطوبة 58 العلف 2140 الماء 4250', extracted_fields: parseFieldMediaTranscriptV19('النافق 18 الحرارة 24 الرطوبة 58 العلف 2140 الماء 4250'), sent_at: '2026-09-17T00:40:00+03:00', requires_vet_review: false }],
    approvals: [{ id: 'apr-1', approval_number: 'APR-YE-2026-001', subject: 'اعتماد مخزن لقاحات صنعاء', category: 'warehouse', requested_by: 'سلسلة الإمداد', steps: [{ role: 'sector_manager', status: 'approved', actor: 'مدير القطاع', at: '2026-09-16T20:00:00+03:00' }, { role: 'finance', status: 'approved', actor: 'المالية', at: '2026-09-16T20:30:00+03:00' }, { role: 'ceo', status: 'pending' }], status: 'pending', created_at: '2026-09-16T19:00:00+03:00', updated_at: '2026-09-16T20:30:00+03:00' }],
    documents: [{ id: 'doc-1', document_number: 'DOC-YE-2026-001', type: 'contract', title: 'عقد شركة اللقاحات', entity_type: 'supplier', entity_id: 'sup-vac-1', file_name: 'SUP-2026-001.pdf', issued_at: '2026-01-01', expires_at: '2027-12-31', signed_by: ['المدير العام', 'الشركة'], status: 'valid' }],
    notifications: [{ id: 'ntf-1', created_at: '2026-09-17T00:50:00+03:00', severity: 'warning', title: 'مخزون لقاح يحتاج متابعة', body: 'المخزون المتاح بعد الحجز 100 فيال.', target_roles: ['ceo', 'marketing', 'warehouse'], channels: ['in_app'], read_by: [], status: 'sent' }],
    audit: [{ id: 'aud-1', at: '2026-09-17T00:50:00+03:00', actor: 'النظام', role: 'system', action: 'إنشاء تنبيه مخزون', entity_type: 'inventory_lot', entity_id: 'lot-vac-01', device_label: 'Server' }],
    data_quality: [], emergency_modes: [], backups: [], ai_governance: [{ id: 'ai-gov-1', at: '2026-09-17T00:45:00+03:00', feature: 'Field Case Escalation', model: 'rules+AI coordinator', input_summary: 'انخفاض العلف + نفوق', output_summary: 'تصعيد للطبيب للمراجعة', confidence: 78, human_decision: 'pending' }],
    fraud_signals: [], support_tickets: [], master_data: { governorates: ['صنعاء', 'إب', 'تعز', 'مأرب', 'ذمار', 'الحديدة', 'عدن'], districts: { 'صنعاء': ['أمانة العاصمة', 'بني حشيش', 'سنحان'], 'إب': ['المدينة', 'يريم'], 'تعز': ['القاهرة', 'صالة'], 'مأرب': ['المدينة', 'الوادي'], 'عدن': ['المنصورة', 'خور مكسر'] }, units: ['عبوة', 'فيال', 'جرعة', 'كيس 50كجم', 'طن', 'قطعة', 'رأس', 'كجم', 'لتر'], company_types: ['أدوية', 'لقاحات', 'كتاكيت/فقاسات', 'أعلاف', 'معدات', 'مختبرات', 'نقل ولوجستيات', 'مطهرات وإضافات'], case_types: ['veterinary', 'complaint', 'supply', 'finance', 'quality', 'field_visit', 'cold_chain', 'recall'] },
    settings: { default_currency: 'SAR', sar_to_yer_old: 140, sar_to_yer_new: 535, approval_finance_threshold: 1000000, low_stock_days: 7, notification_channels: ['in_app'], require_mfa_for_admin: true, require_signed_contract_for_warehouse: true, ai_medical_human_gate: true }
};
export function withAuditV195(state, actor, role, action, entityType, entityId, before, after) {
    return { ...state, audit: [{ id: nid('AUD'), at: iso(), actor, role, action, entity_type: entityType, entity_id: entityId, before: before === undefined ? undefined : JSON.stringify(before), after: after === undefined ? undefined : JSON.stringify(after), device_label: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 90) : 'server' }, ...state.audit].slice(0, 1000) };
}
export function addChatMessageV195(state, input) {
    const source = input.transcript || input.text || '';
    const extracted = parseFieldMediaTranscriptV19(source);
    const mortality = extracted.find(x => x.key === 'mortality');
    const review = Boolean(mortality && Number(mortality.value) >= 20) || /دم|اختناق|خمول شديد|نفوق مرتفع/.test(source);
    const msg = { id: nid('MSG'), ...input, extracted_fields: extracted, sent_at: iso(), requires_vet_review: review };
    const rooms = state.chat_rooms.map(r => r.id === input.room_id ? { ...r, last_message_at: msg.sent_at, priority: review ? 'high' : r.priority, status: review ? 'escalated' : r.status, daily_report: { ...(r.daily_report || {}), ...Object.fromEntries(extracted.filter(x => ['mortality', 'temperature_c', 'humidity_percent', 'weight_g', 'feed_kg', 'water_liters', 'age_days'].includes(x.key)).map(x => [x.key, x.value])) } } : r);
    let next = { ...state, chat_messages: [...state.chat_messages, msg], chat_rooms: rooms };
    if (review) {
        const room = rooms.find(r => r.id === input.room_id);
        if (room) {
            const caseId = room.case_id || nid('CASE');
            if (!room.case_id) {
                const c = { id: caseId, case_number: platformNumberV195('CASE'), type: 'veterinary', title: `تصعيد تلقائي: ${room.title}`, farm_name: room.farm_name, flock_code: room.flock_code, priority: 'high', status: 'new', owner_role: 'vet_consultant', created_at: iso(), updated_at: iso(), timeline: [{ id: nid('EVT'), at: iso(), actor: 'AI Coordinator', role: 'ai_coordinator', action: 'إنشاء حالة من الدردشة', note: 'تحتاج مراجعة طبيب' }] };
                next = { ...next, cases: [c, ...next.cases], chat_rooms: next.chat_rooms.map(r => r.id === room.id ? { ...r, case_id: caseId } : r) };
            }
        }
    }
    return withAuditV195(next, input.sender_name, input.sender_role, 'إرسال رسالة ميدانية', 'chat_room', input.room_id, undefined, { type: input.type, review });
}
export function setCatalogPriceV195(state, itemId, currency, amount, actor, governorate) {
    const item = state.catalog.find(i => i.id === itemId);
    if (!item)
        return state;
    const existing = item.prices.find(p => p.currency === currency && (p.governorate || '') === (governorate || '') && p.active);
    const price = { id: nid('PRICE'), currency, amount, governorate, effective_at: iso(), approved_by: actor, active: true };
    const catalog = state.catalog.map(i => i.id === itemId ? { ...i, prices: [...i.prices.map(p => (p.currency === currency && (p.governorate || '') === (governorate || '')) ? { ...p, active: false } : p), price], updated_at: iso() } : i);
    const hist = { id: nid('PH'), item_id: item.id, item_name: item.name, currency, old_amount: existing?.amount, new_amount: amount, governorate, changed_at: iso(), changed_by: actor, reason: 'تحديث سعر معتمد' };
    return withAuditV195({ ...state, catalog, price_history: [hist, ...state.price_history] }, actor, 'admin', 'تعديل سعر صنف', 'catalog_item', itemId, existing, price);
}
export function convertCurrencyV195(state, amount, from, to) {
    if (from === to)
        return amount;
    const old = state.settings.sar_to_yer_old || 1, neu = state.settings.sar_to_yer_new || 1;
    const sar = from === 'SAR' ? amount : from === 'YER_OLD' ? amount / old : amount / neu;
    return to === 'SAR' ? sar : to === 'YER_OLD' ? sar * old : sar * neu;
}
export function createReservationV195(state, input, actor) {
    const lots = state.inventory_lots.filter(l => l.item_id === input.item_id && l.status === 'available').sort((a, b) => (a.expiry_date || '9999').localeCompare(b.expiry_date || '9999'));
    const available = lots.reduce((s, l) => s + Math.max(0, l.quantity_on_hand - l.quantity_reserved), 0);
    if (available < input.quantity)
        throw new Error(`الكمية المتاحة ${available} فقط`);
    let remaining = input.quantity;
    const touched = new Set();
    const updated = state.inventory_lots.map(l => { if (remaining <= 0 || !lots.some(x => x.id === l.id))
        return l; const free = Math.max(0, l.quantity_on_hand - l.quantity_reserved); const use = Math.min(free, remaining); remaining -= use; touched.add(l.id); return { ...l, quantity_reserved: l.quantity_reserved + use }; });
    const itemName = state.catalog.find(i => i.id === input.item_id)?.name || state.inventory_lots.find(l => l.item_id === input.item_id)?.item_name || input.item_id;
    const r = { id: nid('RSV'), reservation_number: platformNumberV195('RSV'), ...input, item_name: itemName, lot_id: [...touched][0], reserved_at: iso(), expires_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), status: 'active' };
    return withAuditV195({ ...state, inventory_lots: updated, inventory_reservations: [r, ...state.inventory_reservations] }, actor, 'sales', 'حجز مخزون', 'inventory_reservation', r.id, undefined, r);
}
export function advanceApprovalV195(state, id, actor, actorRole, approve = true, note = '') {
    const target = state.approvals.find(a => a.id === id);
    if (!target || target.status !== 'pending')
        return state;
    const idx = target.steps.findIndex(s => s.status === 'pending');
    if (idx < 0)
        return state;
    const steps = target.steps.map((s, i) => i === idx ? { ...s, status: approve ? 'approved' : 'rejected', actor, at: iso(), note } : s);
    const rejected = steps.some(s => s.status === 'rejected');
    const done = steps.every(s => s.status === 'approved');
    const updated = { ...target, steps, status: rejected ? 'rejected' : done ? 'approved' : 'pending', updated_at: iso() };
    return withAuditV195({ ...state, approvals: state.approvals.map(a => a.id === id ? updated : a) }, actor, actorRole, approve ? 'اعتماد مرحلة' : 'رفض مرحلة', 'approval', id, target, updated);
}
export function runDataQualityAuditV195(state) {
    const issues = [];
    const push = (severity, entity_type, entity_id, label, issue) => issues.push({ id: nid('DQ'), severity, entity_type, entity_id, label, issue, status: 'open', detected_at: iso() });
    state.staff.forEach(s => { if ((s.role === 'vet_consultant' || s.role === 'field_vet') && !s.license_number)
        push('critical', 'staff', s.id, s.name, 'طبيب بدون رقم ترخيص'); if (s.license_valid_until && new Date(s.license_valid_until) < new Date())
        push('critical', 'staff', s.id, s.name, 'ترخيص منتهي'); });
    state.suppliers.forEach(s => { if (new Date(s.contract_valid_until) < new Date())
        push('critical', 'supplier', s.id, s.name, 'عقد المورد منتهي'); });
    state.catalog.forEach(i => { if (!i.prices.some(p => p.active))
        push('warning', 'catalog', i.id, i.name, 'لا يوجد سعر فعال'); });
    state.inventory_lots.forEach(l => { if (l.quantity_on_hand < l.quantity_reserved)
        push('critical', 'inventory_lot', l.id, l.lot_number, 'الحجوزات أكبر من المخزون'); if (l.expiry_date && new Date(l.expiry_date) < new Date())
        push('critical', 'inventory_lot', l.id, l.lot_number, 'دفعة منتهية'); });
    state.documents.forEach(d => { if (d.expires_at && new Date(d.expires_at) < new Date())
        push('critical', 'document', d.id, d.title, 'وثيقة منتهية'); });
    return withAuditV195({ ...state, data_quality: issues }, 'النظام', 'system', 'تشغيل فحص جودة البيانات', 'platform', 'data-quality', undefined, { issues: issues.length });
}
export function globalSearchV195(state, q) { const k = q.trim().toLowerCase(); if (!k)
    return []; const out = []; const add = (type, id, title, subtitle = '') => { if (`${title} ${subtitle}`.toLowerCase().includes(k))
    out.push({ type, id, title, subtitle }); }; state.users.forEach(x => add('مستخدم', x.id, x.name, `${x.phone} ${x.role} ${x.governorate}`)); state.staff.forEach(x => add('كادر', x.id, x.name, `${x.phone} ${x.license_number || ''}`)); state.suppliers.forEach(x => add('شركة', x.id, x.name, `${x.contract_number} ${x.phone}`)); state.catalog.forEach(x => add('صنف', x.id, x.name, `${x.sku} ${x.supplier_name}`)); state.cases.forEach(x => add('حالة', x.id, x.title, `${x.case_number} ${x.customer_name || ''} ${x.farm_name || ''}`)); state.documents.forEach(x => add('وثيقة', x.id, x.title, `${x.document_number} ${x.file_name || ''}`)); state.inventory_lots.forEach(x => add('دفعة', x.id, x.item_name, `${x.lot_number} ${x.warehouse_name}`)); return out.slice(0, 50); }
export function createBackupSnapshotV195(state, actor) { const count = Object.values(state).reduce((n, v) => n + (Array.isArray(v) ? v.length : 0), 0); const b = { id: nid('BKP'), created_at: iso(), created_by: actor, label: `نسخة تشغيلية ${new Date().toLocaleString('ar-YE')}`, record_count: count, status: 'ready' }; return withAuditV195({ ...state, backups: [b, ...state.backups].slice(0, 30) }, actor, 'admin', 'إنشاء نقطة استعادة', 'backup', b.id, undefined, b); }
export function allowedViewsForRoleV195(role) {
    if (['system_owner', 'ceo'].includes(role))
        return ['home', 'enterprise', 'farmer', 'managed', 'vet', 'communications', 'finance', 'marketplace', 'workers', 'vaccines', 'calculator', 'passport', 'admin', 'srs'];
    if (['sector_manager', 'finance', 'marketing', 'support'].includes(role))
        return ['home', 'enterprise', 'managed', 'communications', 'finance', 'marketplace', 'workers', 'vaccines', 'calculator', 'passport', 'admin'];
    if (['vet_consultant', 'field_vet'].includes(role))
        return ['home', 'enterprise', 'managed', 'vet', 'communications', 'workers', 'vaccines', 'calculator', 'passport', 'marketplace'];
    if (role === 'supervisor' || role === 'worker')
        return ['home', 'enterprise', 'managed', 'communications', 'workers', 'farmer', 'vaccines', 'marketplace'];
    if (role === 'farmer')
        return ['home', 'enterprise', 'managed', 'farmer', 'communications', 'marketplace', 'vaccines', 'calculator', 'passport'];
    if (role === 'supplier' || role === 'warehouse')
        return ['home', 'enterprise', 'communications', 'marketplace', 'admin'];
    if (role === 'laboratory')
        return ['home', 'enterprise', 'vet', 'communications', 'admin'];
    return ['home', 'enterprise'];
}
export function runFraudAuditV195(state) {
    const signals = [];
    const push = (severity, category, title, entity_type, entity_id, evidence) => signals.push({ id: nid('FRD'), detected_at: iso(), severity, category, title, entity_type, entity_id, evidence, status: 'open' });
    state.inventory_lots.forEach(l => { if (l.quantity_reserved > l.quantity_on_hand)
        push('critical', 'inventory', 'حجز يتجاوز المخزون', 'inventory_lot', l.id, `${l.quantity_reserved} > ${l.quantity_on_hand}`); });
    const grouped = new Map();
    state.price_history.forEach(h => { const k = `${h.item_id}:${h.currency}`; grouped.set(k, [...(grouped.get(k) || []), h]); });
    grouped.forEach(list => { const sorted = [...list].sort((a, b) => b.changed_at.localeCompare(a.changed_at)); if (sorted.length >= 2 && sorted[0].old_amount && Math.abs(sorted[0].new_amount - sorted[0].old_amount) / Math.max(1, sorted[0].old_amount) > .35)
        push('warning', 'pricing', 'تغير سعري كبير', 'catalog_item', sorted[0].item_id, `${sorted[0].old_amount} → ${sorted[0].new_amount}`); });
    const dup = new Map();
    state.documents.forEach(d => { const k = `${d.type}:${d.document_number}`; dup.set(k, (dup.get(k) || 0) + 1); });
    dup.forEach((n, k) => { if (n > 1)
        push('warning', 'duplicate', 'رقم مستند مكرر', 'document', k, `تكرر ${n} مرات`); });
    return withAuditV195({ ...state, fraud_signals: signals }, 'النظام', 'system', 'تشغيل كشف التلاعب', 'platform', 'fraud-audit', undefined, { signals: signals.length });
}
export function inventoryForecastV195(state) { return state.inventory_lots.map(l => { const free = Math.max(0, l.quantity_on_hand - l.quantity_reserved); const assumedDaily = Math.max(1, Math.round((l.quantity_reserved || 1) / 7)); return { lot_id: l.id, item_name: l.item_name, free, days_remaining: Math.round(free / assumedDaily), reorder: free / assumedDaily <= state.settings.low_stock_days }; }).sort((a, b) => a.days_remaining - b.days_remaining); }
export function exportPlatformSnapshotV195(state) { return JSON.stringify({ exported_at: iso(), version: state.version, data: state }, null, 2); }
