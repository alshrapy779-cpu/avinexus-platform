const iso = () => new Date().toISOString();
const nid = (p) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const serial = (p) => `${p}-YE-${new Date().getFullYear()}-${String(Date.now()).slice(-7)}`;
const exchangeToSar = (currency, core195) => currency === 'SAR' ? 1 : currency === 'YER_OLD' ? 1 / Math.max(1, core195.settings.sar_to_yer_old) : 1 / Math.max(1, core195.settings.sar_to_yer_new);
export function buildEnterpriseCoreV196(core195, existing) {
    const now = iso();
    const companies = core195.suppliers.map(s => ({
        id: s.id, legal_name: s.name, trade_name: s.name, categories: s.categories, country: 'اليمن', governorate: core195.supplier_branches.find(b => b.supplier_id === s.id)?.governorate || 'غير محدد',
        head_office_address: core195.supplier_branches.find(b => b.supplier_id === s.id)?.address || 'يستكمل من العقد', phone: s.phone, email: s.email, contact_name: s.contact_name,
        status: s.status === 'active' ? 'active' : s.status === 'suspended' ? 'suspended' : 'under_review', contract_ids: [`v196-contract-${s.id}`], branch_ids: s.branch_ids, notes: 'تم ترحيل السجل من Supplier 360 V19.5 دون حذف الأصل.', created_at: now, updated_at: now
    }));
    const contracts = core195.suppliers.map(s => ({ id: `v196-contract-${s.id}`, contract_number: s.contract_number, company_id: s.id, company_name: s.name, title: `عقد توريد وتعاون — ${s.name}`, start_date: '2026-01-01', end_date: s.contract_valid_until, currency: s.currency, commission_percent: s.commission_percent, payment_terms: 'وفق شروط العقد المعتمد', supply_terms: 'وفق مواصفات الجودة والتوريد المعتمدة', signed_by_platform: true, signed_by_company: true, status: new Date(s.contract_valid_until) >= new Date() ? 'active' : 'expired', created_at: now, updated_at: now }));
    const branches = core195.supplier_branches.map(b => ({ id: b.id, company_id: b.supplier_id, company_name: b.supplier_name, name: b.name, governorate: b.governorate, district: b.district, address: b.address, manager_name: 'مسؤول الفرع', phone: b.phone, delivery_scope: `${b.governorate} والمحافظات المعتمدة`, cold_chain_capable: b.cold_chain, warehouse_ids: b.warehouse_id ? [b.warehouse_id] : [], status: b.status === 'active' ? 'active' : b.status === 'suspended' ? 'suspended' : 'archived' }));
    const warehouses = core195.supplier_branches.filter(b => b.warehouse_id).map(b => ({ id: b.warehouse_id, company_id: b.supplier_id, branch_id: b.id, name: core195.inventory_lots.find(l => l.branch_id === b.id)?.warehouse_name || `مخزن ${b.name}`, governorate: b.governorate, district: b.district, address: b.address, manager_name: 'مسؤول المخزن', phone: b.phone, contract_id: `v196-contract-${b.supplier_id}`, contract_verified: b.status === 'active', cold_chain: b.cold_chain, status: b.status === 'active' ? 'active' : 'pending_contract' }));
    const accounts = [
        { id: 'fa-cash-sar', code: '11101', name: 'الصندوق الرئيسي — SAR', type: 'cash', currency: 'SAR', department: 'treasury', opening_balance: 0, current_balance: 0, active: true },
        { id: 'fa-cash-old', code: '11102', name: 'الصندوق الرئيسي — YER قديم', type: 'cash', currency: 'YER_OLD', department: 'treasury', opening_balance: 0, current_balance: 0, active: true },
        { id: 'fa-cash-new', code: '11103', name: 'الصندوق الرئيسي — YER جديد', type: 'cash', currency: 'YER_NEW', department: 'treasury', opening_balance: 0, current_balance: 0, active: true },
        { id: 'fa-ar', code: '12100', name: 'الذمم المدينة — العملاء', type: 'receivable', currency: 'SAR', department: 'finance', opening_balance: 0, current_balance: 0, active: true },
        { id: 'fa-ap', code: '21100', name: 'الذمم الدائنة — الموردون', type: 'payable', currency: 'SAR', department: 'finance', opening_balance: 0, current_balance: 0, active: true },
        { id: 'fa-sales', code: '41100', name: 'إيرادات المبيعات والخدمات', type: 'revenue', currency: 'SAR', department: 'finance', opening_balance: 0, current_balance: 0, active: true },
        { id: 'fa-exp', code: '51100', name: 'المصروفات التشغيلية', type: 'expense', currency: 'SAR', department: 'finance', opening_balance: 0, current_balance: 0, active: true }
    ];
    const rules = [
        { id: 'rule-pay-1', category: 'payment', min_amount: 0, max_amount: 100000, currency: 'YER_OLD', required_roles: ['finance'], active: true },
        { id: 'rule-pay-2', category: 'payment', min_amount: 100001, max_amount: 1000000, currency: 'YER_OLD', required_roles: ['finance', 'ceo'], active: true },
        { id: 'rule-contract', category: 'contract', min_amount: 0, currency: 'SAR', required_roles: ['contracts', 'finance', 'ceo'], active: true },
        { id: 'rule-transfer', category: 'transfer', min_amount: 0, currency: 'SAR', required_roles: ['treasury', 'finance'], active: true }
    ];
    const base = { version: '19.6', migrated_from: core195.version, companies, contracts, branches, warehouses, assignments: [], financial_accounts: accounts, financial_documents: [], journal_entries: [], debts: [], cash_closings: [], approval_rules: rules, tasks: [{ id: 'task-v196-1', title: 'مراجعة العقود القريبة من الانتهاء', department: 'contracts', assigned_role: 'contracts', priority: 'high', status: 'open', created_at: now }, { id: 'task-v196-2', title: 'مطابقة الصندوق والحوالات اليومية', department: 'treasury', assigned_role: 'finance', priority: 'normal', status: 'open', created_at: now }], settings: { fiscal_year_start: '2026-01-01', base_currency: 'SAR', allow_hard_delete_financial: false, require_double_entry: true, preserve_legacy_modules: true, demo_identity_visible: false } };
    if (!existing)
        return base;
    return { ...base, ...existing, companies: existing.companies?.length ? existing.companies : base.companies, contracts: existing.contracts?.length ? existing.contracts : base.contracts, branches: existing.branches?.length ? existing.branches : base.branches, warehouses: existing.warehouses?.length ? existing.warehouses : base.warehouses, financial_accounts: existing.financial_accounts?.length ? existing.financial_accounts : base.financial_accounts, approval_rules: existing.approval_rules?.length ? existing.approval_rules : base.approval_rules, settings: { ...base.settings, ...(existing.settings || {}) } };
}
export function createCompanyV196(state, input) {
    const now = iso();
    const company = { ...input, id: nid('CMP'), status: 'under_review', contract_ids: [], branch_ids: [], created_at: now, updated_at: now };
    return { ...state, companies: [company, ...state.companies] };
}
export function createContractV196(state, input) {
    const now = iso();
    const c = { ...input, id: nid('CTR'), contract_number: serial('CTR'), status: input.signed_by_platform && input.signed_by_company ? 'active' : 'pending_signature', created_at: now, updated_at: now };
    return { ...state, contracts: [c, ...state.contracts], companies: state.companies.map(x => x.id === c.company_id ? { ...x, contract_ids: [c.id, ...x.contract_ids], status: c.status === 'active' ? 'active' : x.status, updated_at: now } : x) };
}
export function createBranchV196(state, input) {
    const b = { ...input, id: nid('BR'), warehouse_ids: [], status: 'active' };
    return { ...state, branches: [b, ...state.branches], companies: state.companies.map(c => c.id === b.company_id ? { ...c, branch_ids: [b.id, ...c.branch_ids], updated_at: iso() } : c) };
}
export function createWarehouseV196(state, input) {
    const contract = state.contracts.find(c => c.id === input.contract_id && c.company_id === input.company_id);
    const verified = Boolean(contract && contract.status === 'active' && contract.signed_by_platform && contract.signed_by_company && new Date(contract.end_date) >= new Date());
    const w = { ...input, id: nid('WH'), contract_verified: verified, status: verified ? 'active' : 'pending_contract' };
    return { ...state, warehouses: [w, ...state.warehouses], branches: state.branches.map(b => b.id === w.branch_id ? { ...b, warehouse_ids: [w.id, ...b.warehouse_ids] } : b) };
}
function accountById(state, id) { const a = state.financial_accounts.find(x => x.id === id); if (!a)
    throw new Error('الحساب المالي غير موجود'); return a; }
function postJournal(state, description, currency, lines, sourceDocumentId, actor) {
    const debit = lines.reduce((s, l) => s + l.debit, 0), credit = lines.reduce((s, l) => s + l.credit, 0);
    if (Math.abs(debit - credit) > .0001)
        throw new Error('القيد غير متوازن');
    const e = { id: nid('JE'), entry_number: serial('JV'), date: iso().slice(0, 10), description, source_document_id: sourceDocumentId, currency, lines, total_debit: debit, total_credit: credit, status: 'posted', created_by: actor, approved_by: actor, posted_at: iso() };
    return { ...state, journal_entries: [e, ...state.journal_entries] };
}
export function createFinancialDocumentV196(state, core195, input) {
    const now = iso();
    const total = Math.max(0, input.subtotal - (input.discount || 0) + (input.tax || 0));
    const paid = Math.min(total, input.paid || 0);
    const doc = { id: nid('FD'), document_number: serial(input.type === 'receipt' ? 'RCPT' : input.type === 'payment' ? 'PAY' : input.type === 'sales_invoice' ? 'SINV' : input.type === 'purchase_invoice' ? 'PINV' : input.type === 'transfer' ? 'TRF' : 'DOC'), type: input.type, status: paid >= total && total > 0 ? 'paid' : 'posted', date: now.slice(0, 10), due_date: input.due_date, party_type: input.party_type, party_id: input.party_id, party_name: input.party_name, currency: input.currency, exchange_rate_to_sar: exchangeToSar(input.currency, core195), subtotal: input.subtotal, discount: input.discount || 0, tax: input.tax || 0, total, paid, balance: Math.max(0, total - paid), account_id: input.account_id, related_contract_id: input.related_contract_id, related_order_reference: input.related_order_reference, cost_center: input.cost_center, notes: input.notes, created_by: input.created_by, approved_by: input.created_by, posted_at: now, created_at: now, updated_at: now };
    let next = { ...state, financial_documents: [doc, ...state.financial_documents] };
    const cashId = input.account_id || state.financial_accounts.find(a => a.type === 'cash' && a.currency === input.currency)?.id;
    if (input.type === 'receipt') {
        if (!cashId)
            throw new Error('حدد حساب الصندوق/البنك للقبض');
        const cash = accountById(next, cashId);
        if (cash.currency !== input.currency)
            throw new Error('عملة حساب القبض لا تطابق عملة المستند');
        const ar = next.financial_accounts.find(a => a.type === 'receivable');
        next = { ...next, financial_accounts: next.financial_accounts.map(a => a.id === cash.id ? { ...a, current_balance: a.current_balance + total } : a) };
        next = postJournal(next, `سند قبض ${doc.document_number}`, input.currency, [{ account_id: cash.id, account_name: cash.name, debit: total, credit: 0 }, { account_id: ar.id, account_name: ar.name, debit: 0, credit: total }], doc.id, input.created_by);
    }
    else if (input.type === 'payment') {
        if (!cashId)
            throw new Error('حدد حساب الصندوق/البنك للصرف');
        const cash = accountById(next, cashId);
        if (cash.currency !== input.currency)
            throw new Error('عملة حساب الصرف لا تطابق عملة المستند');
        const exp = next.financial_accounts.find(a => a.type === 'expense');
        next = { ...next, financial_accounts: next.financial_accounts.map(a => a.id === cash.id ? { ...a, current_balance: a.current_balance - total } : a) };
        next = postJournal(next, `سند صرف ${doc.document_number}`, input.currency, [{ account_id: exp.id, account_name: exp.name, debit: total, credit: 0 }, { account_id: cash.id, account_name: cash.name, debit: 0, credit: total }], doc.id, input.created_by);
    }
    else if (input.type === 'sales_invoice') {
        const ar = next.financial_accounts.find(a => a.type === 'receivable'), rev = next.financial_accounts.find(a => a.type === 'revenue');
        next = postJournal(next, `فاتورة بيع ${doc.document_number}`, input.currency, [{ account_id: ar.id, account_name: ar.name, debit: total, credit: 0 }, { account_id: rev.id, account_name: rev.name, debit: 0, credit: total }], doc.id, input.created_by);
    }
    else if (input.type === 'purchase_invoice') {
        const ap = next.financial_accounts.find(a => a.type === 'payable'), exp = next.financial_accounts.find(a => a.type === 'expense');
        next = postJournal(next, `فاتورة شراء ${doc.document_number}`, input.currency, [{ account_id: exp.id, account_name: exp.name, debit: total, credit: 0 }, { account_id: ap.id, account_name: ap.name, debit: 0, credit: total }], doc.id, input.created_by);
    }
    return next;
}
export function transferFundsV196(state, core195, input) {
    const from = accountById(state, input.from_account_id), to = accountById(state, input.to_account_id);
    if (from.currency !== input.currency || to.currency !== input.currency)
        throw new Error('التحويل الداخلي يتطلب نفس العملة؛ استخدم تسوية صرف للعملات المختلفة');
    if (input.amount <= 0)
        throw new Error('المبلغ غير صالح');
    let next = { ...state, financial_accounts: state.financial_accounts.map(a => a.id === from.id ? { ...a, current_balance: a.current_balance - input.amount } : a.id === to.id ? { ...a, current_balance: a.current_balance + input.amount } : a) };
    const now = iso();
    const d = { id: nid('FD'), document_number: serial('TRF'), type: 'transfer', status: 'posted', date: now.slice(0, 10), party_type: 'internal', party_name: `${from.name} → ${to.name}`, currency: input.currency, exchange_rate_to_sar: exchangeToSar(input.currency, core195), subtotal: input.amount, discount: 0, tax: 0, total: input.amount, paid: input.amount, balance: 0, account_id: from.id, notes: input.note, created_by: input.actor, approved_by: input.actor, posted_at: now, created_at: now, updated_at: now };
    next = { ...next, financial_documents: [d, ...next.financial_documents] };
    return postJournal(next, `تحويل ${d.document_number}`, input.currency, [{ account_id: to.id, account_name: to.name, debit: input.amount, credit: 0 }, { account_id: from.id, account_name: from.name, debit: 0, credit: input.amount }], d.id, input.actor);
}
export function createDebtV196(state, input) {
    const n = Math.max(1, input.installments || 1), part = input.amount / n;
    const plan = Array.from({ length: n }, (_, i) => ({ id: nid('INST'), due_date: i === 0 ? input.due_date : new Date(new Date(input.due_date).getTime() + i * 30 * 86400000).toISOString().slice(0, 10), amount: Number(part.toFixed(2)), paid: 0, status: 'pending' }));
    const d = { id: nid('DBT'), debt_number: serial('DBT'), direction: input.direction, party_id: input.party_id, party_name: input.party_name, currency: input.currency, original_amount: input.amount, paid_amount: 0, remaining_amount: input.amount, due_date: input.due_date, installment_plan: plan, related_document_id: input.related_document_id, guarantee_note: input.guarantee_note, status: 'current' };
    return { ...state, debts: [d, ...state.debts] };
}
export function closeCashDayV196(state, input) {
    const a = accountById(state, input.account_id);
    const docs = state.financial_documents.filter(d => d.date === input.date && d.currency === a.currency);
    const receipts = docs.filter(d => d.type === 'receipt' && d.account_id === a.id).reduce((s, d) => s + d.total, 0);
    const payments = docs.filter(d => d.type === 'payment' && d.account_id === a.id).reduce((s, d) => s + d.total, 0);
    const transfersIn = docs.filter(d => d.type === 'transfer' && d.party_name.endsWith(a.name)).reduce((s, d) => s + d.total, 0);
    const transfersOut = docs.filter(d => d.type === 'transfer' && d.account_id === a.id).reduce((s, d) => s + d.total, 0);
    const expected = a.opening_balance + receipts - payments + transfersIn - transfersOut, variance = input.counted_balance - expected;
    const c = { id: nid('CLOSE'), close_number: serial('CLOSE'), account_id: a.id, account_name: a.name, date: input.date, currency: a.currency, opening_balance: a.opening_balance, receipts, payments, transfers_in: transfersIn, transfers_out: transfersOut, expected_balance: expected, counted_balance: input.counted_balance, variance, closed_by: input.closed_by, status: Math.abs(variance) < .01 ? 'balanced' : 'variance_case_open' };
    return { ...state, cash_closings: [c, ...state.cash_closings] };
}
export function financialSummaryV196(state) {
    const posted = state.financial_documents.filter(d => ['posted', 'paid', 'partially_paid'].includes(d.status));
    const sales = posted.filter(d => d.type === 'sales_invoice').reduce((s, d) => s + d.total * d.exchange_rate_to_sar, 0);
    const purchases = posted.filter(d => d.type === 'purchase_invoice').reduce((s, d) => s + d.total * d.exchange_rate_to_sar, 0);
    const receipts = posted.filter(d => d.type === 'receipt').reduce((s, d) => s + d.total * d.exchange_rate_to_sar, 0);
    const payments = posted.filter(d => d.type === 'payment').reduce((s, d) => s + d.total * d.exchange_rate_to_sar, 0);
    const receivable = state.debts.filter(d => d.direction === 'receivable' && d.status !== 'settled').reduce((s, d) => s + d.remaining_amount * (d.currency === 'SAR' ? 1 : 1), 0);
    const payable = state.debts.filter(d => d.direction === 'payable' && d.status !== 'settled').reduce((s, d) => s + d.remaining_amount * (d.currency === 'SAR' ? 1 : 1), 0);
    return { sales, purchases, receipts, payments, gross_margin: sales - purchases, receivable, payable, contracts_active: state.contracts.filter(c => c.status === 'active').length, companies_active: state.companies.filter(c => c.status === 'active').length };
}
