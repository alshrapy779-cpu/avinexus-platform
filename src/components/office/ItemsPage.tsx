import React, { useCallback, useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';
type Department = 'MEDICINES' | 'EQUIPMENT' | 'CHICKENS';
type Unit = 'BOX' | 'ML' | 'GRAM' | 'SACHET' | 'LITER' | 'TON' | 'CAN' | 'MG' | 'KG' | 'PIECE' | 'CHICK';
type Currency = 'SAR' | 'USD' | 'YER_NEW' | 'YER_OLD';
interface ItemRow { id: string; officeId: string; code: string; name: string; department: Department; baseUnit: Unit; purchaseUnit: Unit; sellingUnit: Unit; purchasePrice: string; sellingPrice: string; currency: Currency; reorderLimit: string; conversions: Array<{ fromUnit: Unit; toUnit: Unit; factor: string; effectiveFrom: string; }>; status: string; version: number; }
interface BatchRow { id: string; batchNumber: string; expiryDate?: string; remainingQuantity: string; unit: Unit; status: string; }
interface Props { officeId: string; }
type FormData = { code: string; name: string; department: Department; baseUnit: Unit; purchaseUnit: Unit; sellingUnit: Unit; purchasePrice: string; sellingPrice: string; currency: Currency; reorderLimit: string; conversionFactor: string; };
const departments: Array<{ value: Department; label: string; }> = [ { value: 'MEDICINES', label: 'الأدوية واللقاحات' }, { value: 'EQUIPMENT', label: 'المعدات' }, { value: 'CHICKENS', label: 'الكتاكيت' } ];
const units: Array<{ value: Unit; label: string; }> = [ { value: 'BOX', label: 'علبة' }, { value: 'ML', label: 'ملليلتر' }, { value: 'GRAM', label: 'جرام' }, { value: 'SACHET', label: 'ظرف' }, { value: 'LITER', label: 'لتر' }, { value: 'TON', label: 'طن' }, { value: 'CAN', label: 'عبوة' }, { value: 'MG', label: 'مليجرام' }, { value: 'KG', label: 'كيلوجرام' }, { value: 'PIECE', label: 'قطعة' }, { value: 'CHICK', label: 'كتكوت' } ];
const initialForm: FormData = { code: '', name: '', department: 'MEDICINES', baseUnit: 'BOX', purchaseUnit: 'BOX', sellingUnit: 'BOX', purchasePrice: '0', sellingPrice: '0', currency: 'SAR', reorderLimit: '0', conversionFactor: '' };
const styles: Record<string, React.CSSProperties> = { page: { direction: 'rtl', color: '#e5f4f1', padding: 16, background: '#061a20', borderRadius: 14 }, toolbar: { display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }, input: { background: '#091522', border: '1px solid #31515b', color: '#ffffff', padding: 10, borderRadius: 8, minWidth: 0, width: '100%', boxSizing: 'border-box' }, button: { background: '#075b4b', border: '1px solid #19836c', color: '#ffffff', borderRadius: 8, padding: '10px 15px', cursor: 'pointer' }, table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 }, cell: { padding: 11, borderBottom: '1px solid #26404a', textAlign: 'right' }, modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 12 }, dialog: { background: '#09232b', border: '1px solid #35666b', borderRadius: 14, padding: 20, width: 'min(680px,100%)', maxHeight: '90vh', overflowY: 'auto' }, field: { display: 'flex', flexDirection: 'column', gap: 6 }, grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 12 } };
function errorMessage(error: unknown): string { return error instanceof Error ? error.message : 'حدث خطأ غير معروف'; }
function unitLabel(value: Unit): string { return units.find(unit => unit.value === value)?.label || value; }
export default function ItemsPage({ officeId }: Props): React.ReactElement {
  const [items, setItems] = useState<ItemRow[]>([]); const [batches, setBatches] = useState<BatchRow[]>([]); const [selectedItem, setSelectedItem] = useState<ItemRow | null>(null);
  const [loading, setLoading] = useState(false); const [saving, setSaving] = useState(false); const [error, setError] = useState(''); const [notice, setNotice] = useState(''); const [search, setSearch] = useState(''); const [filter, setFilter] = useState(''); const [modalOpen, setModalOpen] = useState(false); const [editing, setEditing] = useState<ItemRow | null>(null); const [form, setForm] = useState<FormData>(initialForm);
  const endpoint = `/api/office/${encodeURIComponent(officeId)}/items`;
  const request = useCallback(async <T,>(path: string, options: RequestInit = {}): Promise<T> => { return apiService.officeItemsRequest<T>(path, options); }, []);
  const loadItems = useCallback(async () => {
    if (!officeId) { setItems([]); setError('يرجى تحديد المكتب أولًا.'); return; }
    setLoading(true); setError('');
    try { const result = await request<{ success: boolean; items: ItemRow[]; }>(endpoint); setItems(Array.isArray(result.items) ? result.items : []); } catch (cause) { setError(errorMessage(cause)); } finally { setLoading(false); }
  }, [officeId, endpoint, request]);
  useEffect(() => { void loadItems(); }, [loadItems]);
  const loadBatches = async (item: ItemRow) => { setSelectedItem(item); setBatches([]); setError(''); try { const result = await request<{ batches: BatchRow[]; }>(`${endpoint}/${encodeURIComponent(item.id)}/batches`); setBatches(Array.isArray(result.batches) ? result.batches : []); } catch (cause) { setError(errorMessage(cause)); } };
  const openNew = () => { setEditing(null); setForm(initialForm); setError(''); setModalOpen(true); };
  const openEdit = (item: ItemRow) => { setEditing(item); setForm({ code: item.code, name: item.name, department: item.department, baseUnit: item.baseUnit, purchaseUnit: item.purchaseUnit, sellingUnit: item.sellingUnit, purchasePrice: item.purchasePrice, sellingPrice: item.sellingPrice, currency: item.currency, reorderLimit: item.reorderLimit, conversionFactor: item.conversions[0]?.factor || '' }); setModalOpen(true); };
  const change = <K extends keyof FormData>(key: K, value: FormData[K]) => { setForm(previous => ({ ...previous, [key]: value })); };
  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.code.trim() || !form.name.trim()) { setError('رمز الصنف واسمه مطلوبان.'); return; }
    if (form.baseUnit !== form.sellingUnit && !form.conversionFactor.trim()) { setError('يجب تحديد معامل التحويل بين الوحدة الأساسية ووحدة البيع.'); return; }
    setSaving(true); setError('');
    try {
      const conversions = form.baseUnit === form.sellingUnit ? [] : [{ fromUnit: form.baseUnit, toUnit: form.sellingUnit, factor: form.conversionFactor, effectiveFrom: new Date().toISOString() }];
      const payload = { code: form.code.trim(), name: form.name.trim(), department: form.department, baseUnit: form.baseUnit, purchaseUnit: form.purchaseUnit, sellingUnit: form.sellingUnit, purchasePrice: form.purchasePrice, sellingPrice: form.sellingPrice, currency: form.currency, reorderLimit: form.reorderLimit, conversions: editing && form.baseUnit === editing.baseUnit && form.sellingUnit === editing.sellingUnit && !form.conversionFactor ? editing.conversions : conversions, version: editing?.version };
      const path = editing ? `${endpoint}/${encodeURIComponent(editing.id)}` : endpoint;
      await request(path, { method: editing ? 'PUT' : 'POST', body: JSON.stringify(payload) });
      setModalOpen(false); setEditing(null); setNotice('تم حفظ بيانات الصنف بنجاح.'); await loadItems();
    } catch (cause) { setError(errorMessage(cause)); } finally { setSaving(false); }
  };
  const filteredItems = items.filter(item => { const matchesDepartment = !filter || item.department === filter; const query = search.toLowerCase(); const matchesSearch = item.name.toLowerCase().includes(query) || item.code.toLowerCase().includes(query); return matchesDepartment && matchesSearch; });
  return (
    <section style={styles.page} dir="rtl">
      <header><h2>دليل الأدوية والمعدات</h2><p>الأصناف الخاصة بالمكتب المحدد، مع الوحدات والأسعار والدفعات.</p></header>
      <div style={styles.toolbar}>
        <div style={{ flex: '1 1 180px' }}><input style={styles.input} value={search} onChange={event => setSearch(event.target.value)} placeholder="البحث بالاسم أو الرمز" /></div>
        <div style={{ flex: '1 1 150px' }}><select style={styles.input} value={filter} onChange={event => setFilter(event.target.value)}><option value="">جميع الأقسام</option>{departments.map(department => (<option key={department.value} value={department.value}>{department.label}</option>))}</select></div>
        <button type="button" style={styles.button} onClick={openNew} disabled={!officeId}>إضافة صنف جديد</button>
        <button type="button" style={styles.button} onClick={() => void loadItems()} disabled={loading}>تحديث القائمة</button>
      </div>
      {error && (<p role="alert" style={{ color: '#ff9a9a' }}>{error}</p>)}
      {notice && (<p role="status" style={{ color: '#76e0ba' }}>{notice}</p>)}
      {loading && <p>جارٍ تحميل الأصناف...</p>}
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead><tr>{['الرمز','الصنف','القسم','الوحدة','الشراء','البيع','العملة','الإجراءات'].map(heading => (<th key={heading} style={styles.cell}>{heading}</th>))}</tr></thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td style={styles.cell}>{item.code}</td><td style={styles.cell}>{item.name}</td><td style={styles.cell}>{departments.find(value => value.value === item.department)?.label}</td><td style={styles.cell}>{unitLabel(item.sellingUnit)}</td><td style={styles.cell}>{item.purchasePrice}</td><td style={styles.cell}>{item.sellingPrice}</td><td style={styles.cell}>{item.currency}</td>
                <td style={styles.cell}><button type="button" style={styles.button} onClick={() => openEdit(item)}>تعديل</button>{' '}<button type="button" style={styles.button} onClick={() => void loadBatches(item)}>الدفعات</button></td>
              </tr>
            ))}
            {!loading && filteredItems.length === 0 && (<tr><td colSpan={8} style={styles.cell}>لا توجد أصناف مطابقة.</td></tr>)}
          </tbody>
        </table>
      </div>
      {selectedItem && (
        <section style={{ marginTop: 22 }}>
          <h3>دفعات الصنف: {selectedItem.name}</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead><tr><th style={styles.cell}>رقم الدفعة</th><th style={styles.cell}>الصلاحية</th><th style={styles.cell}>المتبقي</th><th style={styles.cell}>الوحدة</th><th style={styles.cell}>الحالة</th></tr></thead>
              <tbody>
                {batches.map(batch => (<tr key={batch.id}><td style={styles.cell}>{batch.batchNumber}</td><td style={styles.cell}>{batch.expiryDate || '—'}</td><td style={styles.cell}>{batch.remainingQuantity}</td><td style={styles.cell}>{unitLabel(batch.unit)}</td><td style={styles.cell}>{batch.status}</td></tr>))}
                {batches.length === 0 && (<tr><td colSpan={5} style={styles.cell}>لا توجد دفعات مسجلة لهذا الصنف.</td></tr>)}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {modalOpen && (
        <div style={styles.modal}>
          <div style={styles.dialog} role="dialog" aria-modal="true" aria-label="بيانات الصنف">
            <h3>{editing ? 'تعديل بيانات الصنف' : 'إضافة صنف جديد'}</h3>
            <form onSubmit={save}>
              <div style={styles.grid}>
                <label style={styles.field}>رمز الصنف<input required style={styles.input} value={form.code} onChange={event => change('code', event.target.value)} /></label>
                <label style={styles.field}>اسم الصنف<input required style={styles.input} value={form.name} onChange={event => change('name', event.target.value)} /></label>
                <label style={styles.field}>القسم<select style={styles.input} value={form.department} onChange={event => change('department', event.target.value as Department)}>{departments.map(department => (<option key={department.value} value={department.value}>{department.label}</option>))}</select></label>
                {([ ['baseUnit', 'الوحدة الأساسية'], ['purchaseUnit', 'وحدة الشراء'], ['sellingUnit', 'وحدة البيع'] ] as const).map(([key, label]) => (<label key={key} style={styles.field}>{label}<select style={styles.input} value={form[key]} onChange={event => change(key, event.target.value as Unit)}>{units.map(unit => (<option key={unit.value} value={unit.value}>{unit.label}</option>))}</select></label>))}
                <label style={styles.field}>معامل التحويل إلى وحدة البيع<input style={styles.input} type="number" min="0.000001" step="any" value={form.conversionFactor} onChange={event => change('conversionFactor', event.target.value)} placeholder="مثال: 100" /></label>
                <label style={styles.field}>سعر الشراء<input required style={styles.input} type="number" min="0" step="any" value={form.purchasePrice} onChange={event => change('purchasePrice', event.target.value)} /></label>
                <label style={styles.field}>سعر البيع<input required style={styles.input} type="number" min="0" step="any" value={form.sellingPrice} onChange={event => change('sellingPrice', event.target.value)} /></label>
                <label style={styles.field}>العملة<select style={styles.input} value={form.currency} onChange={event => change('currency', event.target.value as Currency)}><option value="SAR">SAR</option><option value="USD">USD</option><option value="YER_NEW">YER_NEW</option><option value="YER_OLD">YER_OLD</option></select></label>
                <label style={styles.field}>حد إعادة الطلب<input style={styles.input} type="number" min="0" step="any" value={form.reorderLimit} onChange={event => change('reorderLimit', event.target.value)} /></label>
              </div>
              <p style={{ fontSize: 12 }}>رقم الدفعة وتاريخ الصلاحية والكمية تُسجل من خلال استلام المخزون، وليس من خلال إنشاء دليل الصنف.</p>
              {error && (<p role="alert" style={{ color: '#ff9a9a' }}>{error}</p>)}
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="submit" style={styles.button} disabled={saving}>{saving ? 'جارٍ الحفظ...' : 'حفظ الصنف'}</button>
                <button type="button" style={styles.button} onClick={() => setModalOpen(false)} disabled={saving}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
