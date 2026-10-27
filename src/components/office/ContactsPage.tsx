import React, { useCallback, useEffect, useState } from 'react';

type ContactType = 'CUSTOMER' | 'SUPPLIER' | 'BOTH';
type Currency = 'SAR' | 'USD' | 'YER_NEW' | 'YER_OLD';
type Contact = {
  id: string; officeId: string; partyId?: string; name: string;
  type: ContactType; phone: string; address: string;
  openingBalance: string; currency: Currency;
  status: 'ACTIVE' | 'ARCHIVED'; version: number;
};
type FormData = Pick<Contact, 'name'|'type'|'phone'|'address'|'openingBalance'|'currency'>;
const emptyForm: FormData = { name: '', type: 'CUSTOMER', phone: '', address: '', openingBalance: '0', currency: 'SAR' };
const typeLabels: Record<ContactType, string> = { CUSTOMER: 'عميل', SUPPLIER: 'مورد', BOTH: 'عميل ومورد' };

export interface ContactsPageProps {
  officeId: string;
  accessToken: string;
  apiBaseUrl?: string;
  canManage?: boolean;
}

export default function ContactsPage({ officeId, accessToken, apiBaseUrl = '', canManage = false }: ContactsPageProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL'|ContactType>('ALL');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const endpoint = `${apiBaseUrl.replace(/\/$/, '')}/api/office/${encodeURIComponent(officeId)}/contacts`;

  const api = useCallback(async (url: string, init: RequestInit = {}) => {
    const response = await fetch(url, {
      ...init,
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        Authorization: `Bearer ${accessToken}`,
        ...init.headers,
      },
    });
    const raw = await response.text();
    let data: any;
    try { data = raw ? JSON.parse(raw) : {}; }
    catch { throw new Error(`استجابة غير صالحة من الخادم (HTTP ${response.status})`); }
    if (!response.ok || data.success === false) {
      throw new Error(String(data.error || data.message || `HTTP ${response.status}`));
    }
    return data;
  }, [accessToken]);

  const reload = useCallback(async () => {
    if (!officeId || !accessToken) return;
    setLoading(true); setError('');
    try {
      const result = await api(endpoint);
      if (!Array.isArray(result.contacts)) throw new Error('استجابة العملاء والموردين لا تحتوي على قائمة صحيحة');
      setContacts(result.contacts.filter((c: Contact) => c.officeId === officeId && c.status !== 'ARCHIVED'));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'تعذر تحميل الجهات');
    } finally { setLoading(false); }
  }, [officeId, accessToken, endpoint, api]);

  useEffect(() => { void reload(); }, [reload]);

  function startAdd() { setEditing(null); setForm(emptyForm); setError(''); setOpen(true); }
  function startEdit(c: Contact) {
    setEditing(c);
    setForm({ name: c.name, type: c.type, phone: c.phone, address: c.address, openingBalance: c.openingBalance, currency: c.currency });
    setError(''); setOpen(true);
  }
  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canManage || !officeId) return;
    if (form.name.trim().length < 2) { setError('الاسم يجب أن يحتوي على حرفين على الأقل'); return; }
    setSaving(true); setError(''); setNotice('');
    try {
      const url = editing ? `${endpoint}/${encodeURIComponent(editing.id)}` : endpoint;
      await api(url, { method: editing ? 'PUT' : 'POST', body: JSON.stringify(form) });
      setOpen(false); setEditing(null);
      setNotice(editing ? 'تم تحديث الجهة' : 'تمت إضافة الجهة');
      await reload();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'فشل الحفظ';
      console.error('[Office Contacts] Save failed', e);
      setError(message);
    } finally { setSaving(false); }
  }
  async function archive(c: Contact) {
    if (!canManage || !window.confirm(`هل تريد أرشفة ${c.name}؟ لن تُحذف السجلات المالية.`)) return;
    setError(''); setNotice('');
    try {
      await api(`${endpoint}/${encodeURIComponent(c.id)}`, { method: 'DELETE' });
      setNotice('تمت الأرشفة'); await reload();
    } catch (e) { setError(e instanceof Error ? e.message : 'فشلت الأرشفة'); }
  }
  const visible = contacts.filter(c =>
    (filter === 'ALL' || c.type === filter || (c.type === 'BOTH' && filter !== 'ALL')) &&
    `${c.name} ${c.phone} ${c.address}`.toLowerCase().includes(search.trim().toLowerCase())
  );
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: 8, boxSizing: 'border-box' };
  const buttonStyle: React.CSSProperties = { padding: '9px 15px', borderRadius: 8, border: '1px solid #cbd5e1', cursor: 'pointer' };
  return (
    <section dir="rtl" lang="ar" style={{ padding: 18, color: '#172b35', fontFamily: 'inherit' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div><h2 style={{ marginBottom: 4 }}>العملاء والموردون</h2><p style={{ marginTop: 0 }}>دليل الجهات التجارية الخاص بالمكتب الحالي</p></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" style={buttonStyle} onClick={() => void reload()} disabled={loading}>تحديث</button>
          {canManage && <button type="button" style={{ ...buttonStyle, background: '#116149', color: 'white' }} onClick={startAdd}>+ إضافة جديد</button>}
        </div>
      </header>
      <div style={{ display: 'flex', gap: 10, margin: '15px 0', flexWrap: 'wrap' }}>
        <input aria-label="البحث في العملاء والموردين" style={{ ...inputStyle, flex: '1 1 220px', width: 'auto' }} placeholder="ابحث بالاسم أو الهاتف أو العنوان" value={search} onChange={e => setSearch(e.target.value)} />
        <select aria-label="تصفية نوع الجهة" style={{ ...inputStyle, width: 'auto' }} value={filter} onChange={e => setFilter(e.target.value as typeof filter)}>
          <option value="ALL">جميع الجهات</option><option value="CUSTOMER">العملاء</option><option value="SUPPLIER">الموردون</option><option value="BOTH">عميل ومورد</option>
        </select>
      </div>
      {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
      {notice && <p role="status" style={{ color: '#166534' }}>{notice}</p>}
      {loading ? <p>جارٍ تحميل البيانات...</p> : <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 700, textAlign: 'right' }}>
          <thead><tr style={{ background: '#e8f0f3' }}>{['الاسم','الصفة','الهاتف','العنوان','العملة','الرصيد الافتتاحي المقترح','الإجراءات'].map(h => <th key={h} style={{ padding: 10 }}>{h}</th>)}</tr></thead>
          <tbody>{visible.map(c => <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td style={{ padding: 10 }}>{c.name}</td><td>{typeLabels[c.type]}</td><td>{c.phone || '—'}</td><td>{c.address || '—'}</td><td>{c.currency}</td><td>{c.openingBalance}</td>
            <td>{canManage ? <div style={{ display: 'flex', gap: 6 }}><button type="button" style={buttonStyle} onClick={() => startEdit(c)}>تعديل</button><button type="button" style={buttonStyle} onClick={() => void archive(c)}>أرشفة</button></div> : 'عرض فقط'}</td>
          </tr>)}</tbody>
        </table>
        {!visible.length && <p style={{ textAlign: 'center', padding: 20 }}>لا توجد جهات مطابقة.</p>}
      </div>}
      {open && <div role="presentation" style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,.55)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 14 }}>
        <div role="dialog" aria-modal="true" aria-labelledby="contact-dialog-title" style={{ width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', background: '#fff', padding: 22, borderRadius: 14 }}>
          <h3 id="contact-dialog-title">{editing ? 'تعديل جهة' : 'إضافة عميل أو مورد'}</h3>
          <form onSubmit={e => void save(e)} style={{ display: 'grid', gap: 12 }}>
            <label>الاسم الكامل<input required minLength={2} maxLength={200} style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/></label>
            <label>نوع الجهة<select style={inputStyle} value={form.type} onChange={e => setForm({ ...form, type: e.target.value as ContactType })}><option value="CUSTOMER">عميل</option><option value="SUPPLIER">مورد</option><option value="BOTH">عميل ومورد</option></select></label>
            <label>الهاتف<input maxLength={60} style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}/></label>
            <label>العنوان<textarea maxLength={500} style={inputStyle} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}/></label>
            <label>العملة<select style={inputStyle} value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value as Currency })}>{(['SAR','USD','YER_NEW','YER_OLD'] as Currency[]).map(c => <option key={c} value={c}>{c}</option>)}</select></label>
            <label>الرصيد الافتتاحي المقترح<input required type="text" inputMode="decimal" pattern="-?(0|[1-9][0-9]{0,14})(\.[0-9]{1,4})?" style={inputStyle} value={form.openingBalance} onChange={e => setForm({ ...form, openingBalance: e.target.value })}/></label>
            <small>لا يؤدي حفظ هذا المبلغ إلى ترحيل قيد محاسبي. الاعتماد المالي يتم عبر قسم المحاسبة المركزي.</small>
            {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}><button type="button" style={buttonStyle} disabled={saving} onClick={() => { setOpen(false); setError(''); }}>إلغاء</button><button type="submit" disabled={saving} style={{ ...buttonStyle, background: '#116149', color: '#fff' }}>{saving ? 'جارٍ الحفظ...' : 'حفظ'}</button></div>
          </form>
        </div>
      </div>}
    </section>
  );
}
