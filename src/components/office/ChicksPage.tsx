import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';

type Batch = {
  id: string;
  batchNumber: string;
  supplier: string;
  receivedDate: string;
  quantityReceived: number;
  mortality: number;
  transportCost: string;
  wagesCost: string;
  purchasePrice: string;
  currency: string;
  paymentStatus: string;
  invoiceId: string;
  status: string;
  version: number;
};

const empty = {
  batchNumber: '',
  supplier: '',
  receivedDate: '',
  quantityReceived: '1',
  mortality: '0',
  transportCost: '0',
  wagesCost: '0',
  purchasePrice: '0',
  currency: 'SAR',
  paymentStatus: 'CREDIT',
  invoiceId: ''
};

const labels: Record<string, string> = {
  batchNumber: 'رقم الدفعة',
  supplier: 'المورد',
  receivedDate: 'تاريخ الاستلام',
  quantityReceived: 'الكمية المستلمة',
  mortality: 'النفوق',
  transportCost: 'تكلفة النقل',
  wagesCost: 'الأجور',
  purchasePrice: 'سعر شراء الكتكوت',
  invoiceId: 'مرجع الفاتورة'
};

const fieldStyle: React.CSSProperties = {
  padding: 9,
  border: '1px solid #64748b',
  borderRadius: 6,
  width: '100%'
};

export default function ChicksPage({
  officeId
}: { officeId: string }) {
  const [rows, setRows] = useState<Batch[]>([]);
  const [form, setForm] = useState({ ...empty });
  const [editing, setEditing] = useState<Batch | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const endpoint =
    `/api/office/${encodeURIComponent(officeId)}/chicks`;

  async function load() {
    const data = await apiService.officeItemsRequest<{
      batches: Batch[];
    }>(endpoint);
    setRows(data.batches || []);
  }

  useEffect(() => {
    let active = true;
    setRows([]);
    setForm({ ...empty });
    setEditing(null);
    apiService.officeItemsRequest<{ batches: Batch[] }>(
      endpoint
    ).then(data => {
      if (active) setRows(data.batches || []);
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
      const body = {
        ...form,
        quantityReceived: Number(form.quantityReceived),
        mortality: Number(form.mortality),
        ...(editing ? { version: editing.version } : {})
      };
      await apiService.officeItemsRequest(
        editing ? `${endpoint}/${encodeURIComponent(editing.id)}` : endpoint,
        {
          method: editing ? 'PUT' : 'POST',
          body: JSON.stringify(body)
        }
      );
      setEditing(null);
      setForm({ ...empty });
      await load();
    } catch (error) {
      setError(String(error));
    } finally {
      setBusy(false);
    }
  }

  function edit(row: Batch) {
    setEditing(row);
    setForm({
      batchNumber: row.batchNumber,
      supplier: row.supplier,
      receivedDate: row.receivedDate,
      quantityReceived: String(row.quantityReceived),
      mortality: String(row.mortality),
      transportCost: row.transportCost,
      wagesCost: row.wagesCost,
      purchasePrice: row.purchasePrice,
      currency: row.currency,
      paymentStatus: row.paymentStatus,
      invoiceId: row.invoiceId || ''
    });
  }

  async function submit(row: Batch) {
    if (!window.confirm('إرسال الدفعة للمراجعة؟')) return;
    setBusy(true);
    try {
      await apiService.officeItemsRequest(
        `${endpoint}/${encodeURIComponent(row.id)}/submit`,
        { method: 'POST' }
      );
      await load();
    } catch (error) {
      setError(String(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section dir="rtl" style={{ padding: 16 }}>
      <h2>الكتاكيت والدفعات</h2>
      <p>المتبقي المعروض حسابي وغير معتمد كمخزون S7.</p>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={save}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
          gap: 12
        }}>
          {(Object.keys(labels) as Array<keyof typeof empty>)
            .map(key => (
              <label key={key}>
                {labels[key]}
                <input
                  style={fieldStyle}
                  required={key !== 'invoiceId'}
                  type={key === 'receivedDate' ? 'date' :
                    ['quantityReceived', 'mortality', 'transportCost',
                      'wagesCost', 'purchasePrice'].includes(key)
                      ? 'number' : 'text'}
                  min={key === 'quantityReceived' ? 1 : 0}
                  step={['quantityReceived', 'mortality'].includes(key)
                    ? 1 : 'any'}
                  value={form[key]}
                  onChange={event => setForm(previous => ({
                    ...previous,
                    [key]: event.target.value
                  }))}
                />
              </label>
            ))}
          <label>العملة
            <select style={fieldStyle} value={form.currency}
              onChange={event => setForm(previous => ({
                ...previous, currency: event.target.value
              }))}>
              {['SAR', 'USD', 'YER_NEW', 'YER_OLD'].map(c =>
                <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label>الدفع
            <select style={fieldStyle} value={form.paymentStatus}
              onChange={event => setForm(previous => ({
                ...previous, paymentStatus: event.target.value
              }))}>
              <option value="CASH">نقدًا</option>
              <option value="CREDIT">آجل</option>
            </select>
          </label>
        </div>
        <button disabled={busy || !officeId} type="submit">
          {editing ? 'حفظ التعديل' : 'إضافة دفعة'}
        </button>
        {editing && <button type="button"
          onClick={() => {
            setEditing(null);
            setForm({ ...empty });
          }}>إلغاء</button>}
      </form>

      <div style={{ overflowX: 'auto', marginTop: 20 }}>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              {['الدفعة', 'المورد', 'المستلم', 'النفوق',
                'المتبقي', 'السداد', 'الحالة', 'إجراءات']
                .map(x => <th key={x}>{x}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id}>
                <td>{row.batchNumber}</td>
                <td>{row.supplier}</td>
                <td>{row.quantityReceived}</td>
                <td>{row.mortality}</td>
                <td>{row.quantityReceived - row.mortality}</td>
                <td>{row.paymentStatus}</td>
                <td>{row.status}</td>
                <td>
                  {row.status === 'DRAFT' && <>
                    <button onClick={() => edit(row)}>تعديل</button>
                    <button disabled={busy}
                      onClick={() => void submit(row)}>
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
