export const ITEM_DEPARTMENTS = ['MEDICINES','EQUIPMENT','CHICKENS'] as const;
export const ITEM_UNITS = ['BOX','ML','GRAM','SACHET','LITER','TON','CAN','MG','KG','PIECE','CHICK'] as const;
export const ITEM_CURRENCIES = ['SAR','USD','YER_NEW','YER_OLD'] as const;
export type ItemDepartment = typeof ITEM_DEPARTMENTS[number];
export type ItemUnit = typeof ITEM_UNITS[number];
export type ItemCurrency = typeof ITEM_CURRENCIES[number];
export interface UnitConversion { fromUnit: ItemUnit; toUnit: ItemUnit; factor: string; effectiveFrom: string; approvedBy?: string; }
export interface Item { id: string; officeId: string; enterpriseItemId?: string; code: string; name: string; department: ItemDepartment; baseUnit: ItemUnit; purchaseUnit: ItemUnit; sellingUnit: ItemUnit; conversions: UnitConversion[]; purchasePrice: string; sellingPrice: string; currency: ItemCurrency; reorderLimit: string; status: 'ACTIVE' | 'ARCHIVED'; createdAt: string; updatedAt: string; version: number; }
export interface ItemBatch { id: string; officeId: string; itemId: string; batchNumber: string; expiryDate?: string; receivedDate: string; receivedQuantity: string; remainingQuantity: string; unit: ItemUnit; provisionalUnitCost?: string; status: 'ACTIVE' | 'EXPIRED' | 'CLOSED'; createdAt: string; updatedAt: string; }
const DECIMAL_PATTERN = /^(?:0|[1-9]\d*)(?:\.\d+)?$/;
export function validDecimal(value: unknown, allowZero = true): boolean { if (typeof value !== 'string') return false; if (!DECIMAL_PATTERN.test(value)) return false; if (!allowZero && Number(value) <= 0) return false; return Number.isFinite(Number(value)); }
export function validateItem(input: Item): void {
  if (!input.officeId?.trim()) throw new Error('office_required');
  if (!input.code?.trim() || !input.name?.trim()) throw new Error('item_code_and_name_required');
  if (!ITEM_DEPARTMENTS.includes(input.department)) throw new Error('invalid_department');
  const units = [input.baseUnit, input.purchaseUnit, input.sellingUnit];
  for (const unit of units) { if (!ITEM_UNITS.includes(unit)) throw new Error('invalid_unit'); }
  if (!ITEM_CURRENCIES.includes(input.currency)) throw new Error('invalid_currency');
  for (const value of [input.purchasePrice, input.sellingPrice, input.reorderLimit]) { if (!validDecimal(value)) throw new Error('invalid_decimal_value'); }
  if (!Array.isArray(input.conversions)) throw new Error('invalid_conversions');
  for (const conversion of input.conversions) {
    if (!ITEM_UNITS.includes(conversion.fromUnit) || !ITEM_UNITS.includes(conversion.toUnit) || !validDecimal(conversion.factor, false)) throw new Error('invalid_unit_conversion');
    if (!Number.isFinite(Date.parse(conversion.effectiveFrom))) throw new Error('invalid_conversion_date');
  }
}
export function validateItemBatch(batch: ItemBatch): void {
  if (!batch.officeId?.trim() || !batch.itemId?.trim() || !batch.batchNumber?.trim()) throw new Error('invalid_batch_identity');
  if (!ITEM_UNITS.includes(batch.unit)) throw new Error('invalid_batch_unit');
  if (!validDecimal(batch.receivedQuantity) || !validDecimal(batch.remainingQuantity)) throw new Error('invalid_batch_quantity');
  if (Number(batch.remainingQuantity) > Number(batch.receivedQuantity)) throw new Error('remaining_exceeds_received');
  if (batch.expiryDate && !Number.isFinite(Date.parse(batch.expiryDate))) throw new Error('invalid_expiry_date');
  if (!Number.isFinite(Date.parse(batch.receivedDate))) throw new Error('invalid_received_date');
  if (batch.provisionalUnitCost !== undefined && !validDecimal(batch.provisionalUnitCost)) throw new Error('invalid_provisional_cost');
}
