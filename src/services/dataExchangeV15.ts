import * as XLSX from 'xlsx';
import { EnterpriseOperationsV11State } from '../types';

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportEnterpriseXlsxV15(enterprise: EnterpriseOperationsV11State) {
  const wb = XLSX.utils.book_new();
  const sheets: Array<[string, unknown[]]> = [
    ['Inventory', enterprise.inventory_lots],
    ['Orders', enterprise.order_lifecycle],
    ['RegionalPrices', enterprise.regional_price_history],
    ['Vendors', enterprise.vendor_reports],
    ['Attendance', enterprise.attendance_shifts_v13],
    ['Payroll', enterprise.payroll_records_v13],
    ['LabOrders', enterprise.lab_orders],
    ['ClinicalCases', enterprise.field_doctor_visits_v14],
    ['PredictiveV15', enterprise.predictive_performance_v15],
    ['BiosecurityV15', enterprise.biosecurity_checklists_v15.map((x) => ({...x, items: JSON.stringify(x.items)}))]
  ];
  sheets.forEach(([name, rows]) => XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows as any[]), name));
  XLSX.writeFile(wb, `smart-poultry-enterprise-v15-${new Date().toISOString().slice(0,10)}.xlsx`);
}

export function exportCsvV15(rows: Record<string, unknown>[], fileName: string) {
  const ws = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(ws);
  downloadBlob(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }), fileName);
}

export async function parseEnterpriseWorkbookV15(file: File): Promise<Record<string, any[]>> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' });
  const parsed: Record<string, any[]> = {};
  wb.SheetNames.forEach((name) => { parsed[name] = XLSX.utils.sheet_to_json(wb.Sheets[name], { defval: '' }); });
  return parsed;
}
