import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';

type Voucher = {
  id: string;
  voucherNumber: string;
  voucherType: string;
  voucherDate: string;
  partyName: string;
  amount: string;
  currency: string;
  settlementMethod: string;
  accountId: string;
  invoiceId: string;
  description: string;
  status: string;
  version: number;
};

const initial = {
  voucherNumber: '',
  voucherType: 'RECEIPT',
  voucherDate: '',
  partyName: '',
  amount: '',
  currency: 'SAR',
  settlementMethod: 'CASH',
  accountId: '',
  invoiceId: '',
  description: ''
};

const labels: Record<string, string> = {
  voucherNumber: 'رقم السند',
  voucherDate: 'التاريخ',
  partyName: 'الطرف',
  amount: 'المبلغ',
  accountId: 'معرّف الصندوق أو البنك',
  invoiceId: 'مرجع الفاتورة',
  description: 'البيان'
};

export default function TreasuryPage({
  officeId
}: { officeId: string }) {
  const [rows, setRows] = useState<Voucher[]>([]);
  const [form, setForm] = useState({ ...initial });
  const [editing, setEditing] = useState<Voucher | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [balanceStatus, setBalanceStatus] = useState(
    'الأرصدة المحاسبية غير محمّلة'
  );
  const endpoint =
    `/api/office/${encodeURIComponent(officeId)}/treasury`;

  async function reload() {
    const result = await apiService.officeItemsRequest<{
      vouchers: Voucher[];
    }>(endpoint);
    setRows(result.vouchers || []);
  }

  useEffect(() => {
    let active = true;
    setRows([]);
    setEditing(null);
    setForm({ ...initial });
    setBalanceStatus('الأرصدة المحاسبية غير محمّلة');
    apiService.officeItemsRequest<{ vouchers: Voucher[] }>(
      endpoint
    ).then(result => {
      if (active) setRows(result.vouchers || []);
    }).catch(error => {
      if (active) setError(String(error));
    });
    return () => { active = false; };
  }, [endpoint]);

  async function checkBalances() {
    try {
      await apiService.officeItemsRequest(`${endpoint}/balances`);
      setBalanceStatus('تم الاتصال بخدمة الأرصدة');
    } catch {
      setBalanceStatus(
        'لم يكتمل ربط S12. لا توجد أرصدة معتمدة للعرض.'
      );
    }
  }

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
      setEditing(null);
      setForm({ ...initial });
      await reload();
    } catch (error) {
      setError(String(error));
    } finally {
      setBusy(false);
    }
  }

  function edit(row: Voucher) {
    setEditing(row);
    setForm({
      voucherNumber: row.voucherNumber,
      voucherType: row.voucherType,
      voucherDate: row.voucherDate,
      partyName: row.partyName,
      amount: row.amount,
      currency: row.currency,
      settlementMethod: row.settlementMethod,
      accountId: row.accountId,
      invoiceId: row.invoiceId || '',
      description: row.description
    });
  }

  async function submit(row: Voucher) {
    if (!window.confirm('إرسال السند للمراجعة المحاسبية؟')) return;
    setBusy(true);
    try {
      await apiService.officeItemsRequest(
        `${endpoint}/${encodeURIComponent(row.id)}/submit`,
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
      <h2>خزينة المكتب</h2>
      <p>
        طلبات سندات القبض والصرف. لا تؤثر في أرصدة S12
        قبل الاعتماد والترحيل.
      </p>
      <section>
        <h3>الأرصدة النقدية والبنكية</h3>
        <p role="status">{balanceStatus}</p>
        <button type="button" onClick={() => void checkBalances()}>
          فحص الأرصدة
        </button>
      </section>

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
                  required={!['invoiceId', 'description'].includes(key)}
                  type={key === 'voucherDate' ? 'date' :
                    key === 'amount' ? 'number' : 'text'}
                  min={key === 'amount' ? '0.000001' : undefined}
                  step={key === 'amount' ? 'any' : undefined}
                  value={form[key]}
                  onChange={event => setForm(previous => ({
                    ...previous, [key]: event.target.value
                  }))}
                />
              </label>
            ))}

          <label>نوع السند
            <select value={form.voucherType}
              onChange={event => setForm(previous => ({
                ...previous, voucherType: event.target.value
              }))}>
              <option value="RECEIPT">قبض</option>
              <option value="DISBURSEMENT">صرف</option>
            </select>
          </label>

          <label>وسيلة السداد
            <select value={form.settlementMethod}
              onChange={event => setForm(previous => ({
                ...previous, settlementMethod: event.target.value
              }))}>
              <option value="CASH">نقدي</option>
              <option value="BANK">بنكي</option>
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
          {editing ? 'حفظ التعديل' : 'حفظ مسودة سند'}
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
              {['السند', 'النوع', 'التاريخ', 'الطرف', 'المبلغ',
                'الحساب', 'الفاتورة', 'الحالة', 'إجراءات']
                .map(x => <th key={x}>{x}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id}>
                <td>{row.voucherNumber}</td>
                <td>{row.voucherType === 'RECEIPT' ? 'قبض' : 'صرف'}</td>
                <td>{row.voucherDate}</td>
                <td>{row.partyName}</td>
                <td>{row.amount} {row.currency}</td>
                <td>{row.accountId}</td>
                <td>{row.invoiceId || '—'}</td>
                <td>{row.status}</td>
                <td>
                  {row.status === 'DRAFT' && <>
                    <button onClick={() => edit(row)}>تعديل</button>
                    <button disabled={busy}
                      onClick={() => void submit(row)}>
                      إرسال للمحاسبة
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
