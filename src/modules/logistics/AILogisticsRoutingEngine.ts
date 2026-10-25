import {
  BranchStockCheckV19,
  LogisticsRouteDecisionV19,
  PartnerBranchV19,
  ProductAlternativeV19,
  SovereigntyV19State,
  V19ProductCriticality
} from '../../types';

export interface LogisticsRequest {
  customer_name: string;
  governorate: string;
  district: string;
  product_id: string;
  product_name: string;
  category: string;
  quantity: number;
  criticality: V19ProductCriticality;
  customer_lat?: number;
  customer_lng?: number;
}

export interface InventoryAttestationRequestV19 {
  branch_id: string;
  branch_name: string;
  due_at: string;
  reason: 'daily_attestation' | 'realtime_request';
  product_id?: string;
  requested_quantity?: number;
}

const critical = (value: V19ProductCriticality) => ['time_sensitive','cold_chain_critical','emergency'].includes(value);

const radians = (value: number) => value * Math.PI / 180;
export function distanceKmV19(aLat?: number, aLng?: number, bLat?: number, bLng?: number): number | undefined {
  if ([aLat,aLng,bLat,bLng].some(v => typeof v !== 'number')) return undefined;
  const R = 6371;
  const dLat = radians((bLat as number) - (aLat as number));
  const dLng = radians((bLng as number) - (aLng as number));
  const x = Math.sin(dLat/2) ** 2 + Math.cos(radians(aLat as number)) * Math.cos(radians(bLat as number)) * Math.sin(dLng/2) ** 2;
  return Math.round((2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1-x))) * 10) / 10;
}

export function buildDailyInventoryAttestationsV19(state: SovereigntyV19State, now = new Date()): InventoryAttestationRequestV19[] {
  const due = new Date(now);
  due.setHours(state.config.daily_inventory_attestation_hour, 0, 0, 0);
  if (due.getTime() <= now.getTime()) due.setDate(due.getDate() + 1);
  return state.partner_branches
    .filter(branch => branch.status === 'active')
    .map(branch => ({ branch_id: branch.id, branch_name: branch.branch_name, due_at: due.toISOString(), reason: 'daily_attestation' as const }));
}

export function buildRealtimeStockCheckRequestV19(branch: PartnerBranchV19, request: LogisticsRequest): InventoryAttestationRequestV19 {
  return {
    branch_id: branch.id,
    branch_name: branch.branch_name,
    due_at: new Date().toISOString(),
    reason: 'realtime_request',
    product_id: request.product_id,
    requested_quantity: request.quantity
  };
}

function confirmedStock(state: SovereigntyV19State, productId: string, quantity: number): BranchStockCheckV19[] {
  return state.stock_checks.filter(s => s.product_id === productId && s.status === 'confirmed' && s.quantity_available >= quantity);
}

function branchScore(branch: PartnerBranchV19, request: LogisticsRequest, stock?: BranchStockCheckV19) {
  let score = 0;
  if (branch.governorate === request.governorate) score += 100;
  if (branch.district === request.district) score += 35;
  if (request.criticality === 'cold_chain_critical' && branch.cold_chain_capable) score += 40;
  if (stock?.cold_chain_ok) score += 15;
  if (stock?.expiry_date) {
    const days = (new Date(stock.expiry_date).getTime() - Date.now()) / 86400000;
    if (days > 90) score += 10;
    else if (days < 30) score -= 20;
  }
  const distance = distanceKmV19(request.customer_lat, request.customer_lng, branch.lat, branch.lng);
  if (distance !== undefined) score -= Math.min(40, distance / 10);
  return { score, distance };
}

function selectAlternative(state: SovereigntyV19State, request: LogisticsRequest): ProductAlternativeV19 | undefined {
  return state.alternatives
    .filter(a => a.requested_product_id === request.product_id && a.admin_approved && a.available_quantity >= request.quantity)
    .sort((a,b) => Number(b.same_governorate) - Number(a.same_governorate) || Number(a.clinical_equivalence_requires_vet) - Number(b.clinical_equivalence_requires_vet))[0];
}

export function routeLogistics(state: SovereigntyV19State, request: LogisticsRequest): LogisticsRouteDecisionV19 {
  const stocks = confirmedStock(state, request.product_id, request.quantity);
  const candidates = state.partner_branches
    .filter(b => b.status === 'active' && stocks.some(s => s.branch_id === b.id))
    .map(branch => {
      const stock = stocks.find(s => s.branch_id === branch.id);
      return { branch, stock, ...branchScore(branch, request, stock) };
    })
    .filter(x => request.criticality !== 'cold_chain_critical' || (x.branch.cold_chain_capable && x.stock?.cold_chain_ok !== false))
    .sort((a,b) => b.score - a.score);

  const best = candidates[0];
  if (best) {
    const local = best.branch.governorate === request.governorate;
    const routeStatus: LogisticsRouteDecisionV19['route_status'] = local
      ? 'local_available'
      : critical(request.criticality)
        ? 'manual_review'
        : 'inter_governorate_shipping';
    return {
      id:`lr19-${Date.now()}`,
      created_at:new Date().toISOString(),
      customer_name:request.customer_name,
      governorate:request.governorate,
      district:request.district,
      requested_product_id:request.product_id,
      requested_product_name:request.product_name,
      quantity:request.quantity,
      criticality:request.criticality,
      selected_branch_id:best.branch.id,
      selected_branch_name:best.branch.branch_name,
      estimated_distance_km:best.distance,
      stock_check_id:best.stock?.id,
      route_status:routeStatus,
      decision_reason: local
        ? 'مخزون مؤكد في نفس المحافظة؛ تم اختيار الفرع الأعلى ترتيباً وفق المنطقة والتبريد وحداثة التحقق.'
        : critical(request.criticality)
          ? 'المخزون المؤكد خارج المحافظة، والصنف حساس للوقت/التبريد؛ يلزم اعتماد بشري لخطة النقل وسلسلة التبريد.'
          : 'المخزون المؤكد خارج المحافظة؛ يمكن عرض الشحن أو الانتظار على العميل.'
    };
  }

  const alternative = selectAlternative(state, request);
  if (alternative) {
    return {
      id:`lr19-${Date.now()}`,
      created_at:new Date().toISOString(),
      customer_name:request.customer_name,
      governorate:request.governorate,
      district:request.district,
      requested_product_id:request.product_id,
      requested_product_name:request.product_name,
      quantity:request.quantity,
      criticality:request.criticality,
      selected_branch_id:alternative.branch_id,
      selected_branch_name:alternative.branch_name,
      route_status:'alternative_offered',
      alternative_id:alternative.id,
      decision_reason: alternative.clinical_equivalence_requires_vet
        ? 'يوجد بديل متوفر ومجاز إدارياً، لكن المطابقة العلاجية/التحصينية النهائية تتطلب اعتماد الطبيب.'
        : 'يوجد بديل محلي متوفر ومعتمد إدارياً ويمكن عرضه للعميل.'
    };
  }

  return {
    id:`lr19-${Date.now()}`,
    created_at:new Date().toISOString(),
    customer_name:request.customer_name,
    governorate:request.governorate,
    district:request.district,
    requested_product_id:request.product_id,
    requested_product_name:request.product_name,
    quantity:request.quantity,
    criticality:request.criticality,
    route_status:'manual_review',
    decision_reason:'لا يوجد مخزون مؤكد أو بديل معتمد. يُحوّل الطلب للمبيعات وسلسلة الإمداد لتسعير مسار جديد أو إضافة مورد/محافظة.'
  };
}

export const findAlternatives = (state: SovereigntyV19State, requestedProductId: string) =>
  state.alternatives.filter(a => a.requested_product_id === requestedProductId && a.admin_approved);

export const chooseFreelanceVet = (state: SovereigntyV19State, governorate: string, district: string) =>
  state.freelance_vets
    .filter(v => v.status === 'available' && v.identity_verified && v.license_verified)
    .sort((a,b) => Number(b.governorate === governorate) - Number(a.governorate === governorate)
      || Number(b.districts.includes(district)) - Number(a.districts.includes(district))
      || b.rating - a.rating
      || a.completed_visits - b.completed_visits)[0];
