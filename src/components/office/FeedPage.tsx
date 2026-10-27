import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';

type Feed = {
  id: string;
  code: string;
  name: string;
  feedType: string;
  supplier: string;
  batchNumber: string;
  quantity: string;
  unit: string;
  purchasePrice: string;
  sellingPrice: string;
  currency: string;
  expiryDate: string;
  status: string;
  version: number;
};

const initial = {
  code: '',
  name: '',
  feedType: 'STARTER',
  supplier: '',
  batchNumber: '',
  quantity: '1',
  unit: 'BAG_50KG',
  purchasePrice: '0',
  sellingPrice: '0',
  currency: 'SAR',
  expiryDate: ''
};

const labels: Record<string, string> = {
  code: 'رمز الصنف',
  name: 'اسم العلف',
  supplier: 'المورد',
  batchNumber: 'رقم الدفعة',
  quantity: 'الكمية',
  purchasePrice: 'سعر الشراء',
  sellingPrice: 'سعر البيع',
  expiryDate: 'تاريخ الصلاحية'
};

export default function FeedPage({
  officeId
}: { officeId: string }) {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [form, setForm] = useState({ ...initial });
  const [editing, setEditing] = useState<Feed | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const endpoint =
    `/api/office/${encodeURIComponent(officeId)}/feed`;

  async function reload() {
    const result = await apiService.officeItemsRequest<{
      feeds: Feed[];
    }>(endpoint);
    setFeeds(result.feeds || []);
  }

  useEffect(() => {
    let active = true;
    setFeeds([]);
    setForm({ ...initial });
    setEditing(null);
    apiService.officeItemsRequest<{ feeds: Feed[] }>(
      endpoint
    ).then(result => {
      if (active) setFeeds(result.feeds || []);
    }).catch(error => {
      if (active) setError(String(error));
    });
    return () => { active = false; };
  }, [endpoint]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await apiService.officeItemsRequest(
        editing ? `${endpoint}/${encodeURIComponent(editing.id)}` : endpoint,
        {
          method: editing ? 'PUT' : 'POST',
          body: JSON.stringify({
            ...form,
            ...(editing ? { version: editing.version } : {})
          })
        }
      );
      setForm({ ...initial });
      setEditing(null);
      await reload();
    } catch (error) {
      setError(String(error));
    } finally {
      setBusy(false);
    }
  }

  function edit(feed: Feed) {
    setEditing(feed);
    setForm({
      code: feed.code,
      name: feed.name,
      feedType: feed.feedType,
      supplier: feed.supplier,
      batchNumber: feed.batchNumber,
      quantity: feed.quantity,
      unit: feed.unit,
      purchasePrice: feed.purchasePrice,
      sellingPrice: feed.sellingPrice,
      currency: feed.currency,
      expiryDate: feed.expiryDate || ''
    });
  }

  async function submit(feed: Feed) {
    if (!window.confirm('إرسال دفعة العلف للمراجعة؟')) return;
    setBusy(true);
    try {
      await apiService.officeItemsRequest(
        `${endpoint}/${encodeURIComponent(feed.id)}/submit`,
        { method: 'POST' }
      );
      await reload();
    } catch (error) {
      setError(String(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section dir="rtl" style={{ padding: 16 }}>
      <h2>الأعلاف والمخزون</h2>
      <p>الكميات المسجلة ليست أرصدة مخزنية معتمدة حتى ترحيل S7.</p>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={save}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
          gap: 12
        }}>
          {(Object.keys(labels) as Array<keyof typeof initial>)
            .map(key => (
              <label key={key}>
                {labels[key]}
                <input
                  required={key !== 'expiryDate'}
                  type={key === 'expiryDate' ? 'date' :
                    ['quantity', 'purchasePrice', 'sellingPrice']
                      .includes(key) ? 'number' : 'text'}
                  min={key === 'quantity' ? '0.000001' : '0'}
                  step="any"
                  value={form[key]}
                  onChange={event => setForm(previous => ({
                    ...previous, [key]: event.target.value
                  }))}
                />
              </label>
            ))}
          <label>نوع العلف
            <select value={form.feedType}
              onChange={event => setForm(previous => ({
                ...previous, feedType: event.target.value
              }))}>
              <option value="STARTER">بادئ</option>
              <option value="GROWER">نامي</option>
              <option value="FINISHER">ناهي</option>
              <option value="OTHER">أخرى</option>
            </select>
          </label>
          <label>الوحدة
            <select value={form.unit}
              onChange={event => setForm(previous => ({
                ...previous, unit: event.target.value
              }))}>
              <option value="KG">كيلوجرام</option>
              <option value="TON">طن</option>
              <option value="BAG_25KG">كيس 25 كجم</option>
              <option value="BAG_50KG">كيس 50 كجم</option>
            </select>
          </label>
          <label>العملة
            <select value={form.currency}
              onChange={event => setForm(previous => ({
                ...previous, currency: event.target.value
              }))}>
              {['SAR', 'USD', 'YER_NEW', 'YER_OLD'].map(c =>
                <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>
        <button disabled={busy || !officeId} type="submit">
          {editing ? 'حفظ التعديل' : 'إضافة دفعة'}
        </button>
        {editing && <button type="button"
          onClick={() => {
            setEditing(null);
            setForm({ ...initial });
          }}>إلغاء</button>}
      </form>

      <div style={{ overflowX: 'auto', marginTop: 20 }}>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              {['الرمز', 'العلف', 'الدفعة', 'الكمية',
                'الشراء', 'البيع', 'الصلاحية', 'الحالة',
                'الإجراءات'].map(x => <th key={x}>{x}</th>)}
            </tr>
          </thead>
          <tbody>
            {feeds.map(feed => (
              <tr key={feed.id}>
                <td>{feed.code}</td>
                <td>{feed.name}</td>
                <td>{feed.batchNumber}</td>
                <td>{feed.quantity} {feed.unit}</td>
                <td>{feed.purchasePrice} {feed.currency}</td>
                <td>{feed.sellingPrice} {feed.currency}</td>
                <td>{feed.expiryDate || '—'}</td>
                <td>{feed.status}</td>
                <td>
                  {feed.status === 'DRAFT' && <>
                    <button onClick={() => edit(feed)}>تعديل</button>
                    <button disabled={busy}
                      onClick={() => void submit(feed)}>
                      إرسال للمراجعة
                    </button>
                  </>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
