import React, { useCallback, useEffect, useState } from 'react';
import ContactsPage from './ContactsPage';

type Office = {
  id: string;
  code: string;
  name: string;
};

type Workspace = {
  office: Office;
  contracts: Array<{ id: string }>;
  farm_ids: string[];
  customers: unknown[];
  treasury_accounts: unknown[];
  read_only: boolean;
};

type Props = {
  accessToken: string;
  onClose: () => void;
};

export default function Office360DashboardPage({
  accessToken,
  onClose
}: Props) {
  const [offices, setOffices] = useState<Office[]>([]);
  const [officeId, setOfficeId] = useState('');
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [section, setSection] = useState<'dashboard' | 'contacts'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const request = useCallback(async (url: string) => {
    const response = await fetch(url, {
      credentials: 'same-origin',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
  }, [accessToken]);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError('');

    request('/api/v20.2.3/contracted-offices/authorized')
      .then(data => {
        if (cancelled) return;

        const list = Array.isArray(data.offices) ? data.offices : [];
        setOffices(list);
        setOfficeId(current =>
          list.some((o: Office) => o.id === current)
            ? current
            : list[0]?.id || ''
        );
      })
      .catch(err => {
        if (!cancelled) setError(String(err.message || err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [request]);

  useEffect(() => {
    if (!officeId) {
      setWorkspace(null);
      return;
    }

    let cancelled = false;
    setWorkspace(null);
    setSection('dashboard');
    setLoading(true);
    setError('');

    request(
      `/api/v20.2.3/contracted-office/${encodeURIComponent(officeId)}/workspace`
    )
      .then(data => {
        if (!cancelled) setWorkspace(data.workspace);
      })
      .catch(err => {
        if (!cancelled) setError(String(err.message || err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [officeId, request]);

  const selectedOffice = offices.find(o => o.id === officeId);

  return (
    <section
      dir="rtl"
      lang="ar"
      className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8"
    >
      <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">إدارة المكاتب — Office 360</h1>
          <p className="text-slate-400 text-sm mt-2">
            مساحة المكتب المتعاقد داخل AviNexus
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="bg-slate-800 rounded-lg px-5 py-3"
        >
          العودة إلى المنصة
        </button>
      </header>

      <div className="bg-slate-900 rounded-xl p-5 mb-5">
        <label htmlFor="office360-selector" className="block mb-2 font-semibold">
          المكتب المصرح لك بالوصول إليه
        </label>
        <select
          id="office360-selector"
          value={officeId}
          onChange={e => setOfficeId(e.target.value)}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3"
        >
          {offices.length === 0 && <option value="">لا توجد مكاتب متاحة</option>}
          {offices.map(office => (
            <option key={office.id} value={office.id}>
              {office.name} — {office.code}
            </option>
          ))}
        </select>
      </div>

      {loading && <p role="status">جارٍ تحميل بيانات المكتب...</p>}

      {error && (
        <div role="alert" className="bg-red-950 border border-red-700 rounded-lg p-4 mb-4">
          تعذر تحميل البيانات: {error}
        </div>
      )}

      {!loading && !error && !selectedOffice && (
        <p className="text-amber-300">
          لا يوجد مكتب نشط مصرح لهذا الحساب بالوصول إليه.
        </p>
      )}

      {workspace && !loading && (
        <>
          <div className="mb-5">
            <h2 className="text-xl font-bold">{selectedOffice?.name}</h2>
            <p className="text-slate-400 text-sm">
              المعلومات مستمدة من سجلات المكتب والعقود الأصلية.
            </p>
          </div>

          <nav className="flex gap-3 mb-5 flex-wrap">
            <button
              type="button"
              onClick={() => setSection('dashboard')}
              className="bg-cyan-800 rounded-lg px-4 py-2"
            >
              لوحة المكتب
            </button>
            <button
              type="button"
              onClick={() => setSection('contacts')}
              className="bg-slate-700 rounded-lg px-4 py-2"
            >
              العملاء والموردون
            </button>
          </nav>

          {section === 'dashboard' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  ['العقود السارية', workspace.contracts.length],
                  ['المزارع المرتبطة بالعقود', workspace.farm_ids.length],
                  ['العملاء المرتبطون بالمكتب', workspace.customers.length]
                ].map(([label, value]) => (
                  <div key={String(label)} className="bg-slate-900 rounded-xl p-5">
                    <p className="text-slate-400">{label}</p>
                    <p className="text-3xl font-bold mt-3">{value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 rounded-xl p-5 mt-5">
                <h3 className="font-bold mb-3">المزارع المرتبطة بالعقود</h3>
                {workspace.farm_ids.length === 0 ? (
                  <p className="text-slate-400">لا توجد مزارع مرتبطة بعقد سارٍ.</p>
                ) : (
                  <ul className="space-y-2">
                    {workspace.farm_ids.map(id => (
                      <li key={id} className="border-b border-slate-800 py-2">
                        {id}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <p className="text-amber-300 text-sm mt-5">
                الأرصدة المالية والمخزون لم تُفعّل في هذه الشاشة بعد.
                لن تُعرض أرقام تقديرية أو تُجمع عملات مختلفة.
              </p>
            </>
          ) : (
            <div className="bg-white rounded-xl">
              <ContactsPage
                officeId={officeId}
                accessToken={accessToken}
                canManage={false}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
