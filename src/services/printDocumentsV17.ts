import { FlockSaleSettlementV17, SupplierRoutingOrderV17, LeaseEscrowContractV17 } from '../types';

const esc=(v:unknown)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c));
const money=(v:number)=>new Intl.NumberFormat('ar-YE').format(Math.round(v||0));

function openPrint(title:string, body:string){
  const w=window.open('','_blank','noopener,noreferrer,width=900,height=800');
  if(!w) return false;
  w.document.write(`<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>${esc(title)}</title><style>body{font-family:Arial,Tahoma,sans-serif;padding:28px;color:#111}h1{font-size:20px}h2{font-size:15px;margin-top:24px}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.box{border:1px solid #ddd;border-radius:8px;padding:10px}table{width:100%;border-collapse:collapse;margin-top:12px}th,td{border:1px solid #ddd;padding:8px;text-align:right}th{background:#f3f4f6}.total{font-size:18px;font-weight:700}.muted{color:#555;font-size:12px}@media print{button{display:none}}</style></head><body>${body}<button onclick="window.print()" style="margin-top:24px;padding:10px 18px">طباعة</button></body></html>`);
  w.document.close(); w.focus(); return true;
}

export function printFlockSettlementV17(s:FlockSaleSettlementV17){
  const rows=s.invoice_lines.map(x=>`<tr><td>${esc(x.size_class)}</td><td>${money(x.birds_count)}</td><td>${money(x.total_weight_kg)} كجم</td><td>${money(x.price_per_kg_yer)}</td><td>${money(x.line_total_yer)}</td></tr>`).join('');
  return openPrint(`تسوية بيع القطيع - ${s.customer_name}`,`<h1>فاتورة وزن وتسوية بيع القطيع</h1><div class="muted">مرجع: ${esc(s.sale_pipeline_id)} • الحالة: ${esc(s.status)}</div><div class="grid"><div class="box">العميل: <b>${esc(s.customer_name)}</b></div><div class="box">مكتب التسويق: <b>${esc(s.broker_name)}</b></div></div><h2>تفاصيل الوزن</h2><table><thead><tr><th>التصنيف</th><th>العدد</th><th>الوزن</th><th>السعر/كجم</th><th>الإجمالي</th></tr></thead><tbody>${rows}</tbody></table><h2>التسوية</h2><div class="grid"><div class="box">إجمالي البيع: ${money(s.gross_sale_yer)} ر.ي</div><div class="box">أجر التسويق: ${money(s.marketing_fee_yer)} ر.ي</div><div class="box">عمولة المنصة: ${money(s.platform_fee_yer)} ر.ي</div><div class="box">خصم الذمم: ${money(s.debt_deduction_yer)} ر.ي</div></div><p class="total">صافي مستحق العميل: ${money(s.net_customer_yer)} ر.ي</p><p class="muted">مرجع دفع المكتب: ${esc(s.broker_payment_reference||'بانتظار التحقق')} • مرجع تحويل العميل: ${esc(s.customer_transfer_reference||'بانتظار التحويل')}</p>`);
}

export function printSupplierOrderV17(o:SupplierRoutingOrderV17){
  const supplier=o.supplier_queue.find(x=>x.status==='accepted');
  const subtotal=o.quantity*(supplier?.confirmed_unit_price_yer||o.official_price_yer);
  return openPrint(`فاتورة طلب ${o.order_number}`,`<h1>فاتورة توريد موحدة</h1><div class="muted">${esc(o.order_number)} • ${esc(o.status)}</div><div class="grid"><div class="box">العميل: <b>${esc(o.customer_name)}</b></div><div class="box">المورد: <b>${esc(supplier?.supplier_name||'بانتظار القبول')}</b></div><div class="box">الصنف: ${esc(o.product_name)}</div><div class="box">الكمية: ${money(o.quantity)} ${esc(o.unit_label)}</div><div class="box">قيمة الصنف: ${money(subtotal)} ر.ي</div><div class="box">التوصيل: ${money(o.transport_fee_yer)} ر.ي</div></div><p class="total">الإجمالي: ${money(subtotal+o.transport_fee_yer)} ر.ي</p><p class="muted">رقم الفاتورة: ${esc(o.invoice_number||'يصدر بعد اعتماد المالية')} • التشغيلات: ${esc((o.lot_numbers||[]).join('، ')||'تضاف عند التجهيز')}</p>`);
}

export function printLeaseContractV17(c:LeaseEscrowContractV17){
  return openPrint(`عقد إيجار ${c.contract_number}`,`<h1>ملخص عقد إيجار وضمان تحصيل</h1><div class="grid"><div class="box">رقم العقد: ${esc(c.contract_number)}</div><div class="box">الحالة: ${esc(c.status)}</div><div class="box">المؤجر: ${esc(c.lessor_name)}</div><div class="box">المستأجر: ${esc(c.lessee_name)}</div><div class="box">قيمة الإيجار: ${money(c.rent_value_yer)} ر.ي</div><div class="box">عمولة المنصة: ${money(c.platform_commission_yer)} ر.ي</div><div class="box">الدفعة الأولى: ${money(c.first_payment_yer)} ر.ي</div><div class="box">طريقة التحصيل: ${esc(c.collection_method)}</div></div><h2>التوثيق</h2><p>${esc(c.penalty_clause_summary)}</p><p class="muted">الحالة القانونية: ${esc(c.legal_review_status)}. يجب اعتماد الصياغة القانونية محلياً قبل الاستخدام الملزم.</p>`);
}
