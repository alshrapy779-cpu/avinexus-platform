export const ITEM_DEPARTMENTS = ['MEDICINES', 'EQUIPMENT', 'CHICKENS'] as const;
export const ITEM_UNITS = ['BOX', 'ML', 'GRAM', 'SACHET', 'LITER', 'TON', 'CAN', 'MG', 'KG', 'PIECE', 'CHICK'] as const;
export type ItemDepartment = typeof ITEM_DEPARTMENTS[number];
export type ItemUnit = typeof ITEM_UNITS[number];
export type ItemCurrency = 'SAR' | 'USD' | 'YER_NEW' | 'YER_OLD';

export interface UnitConversion { fromUnit: ItemUnit; toUnit: ItemUnit; factor: string; effectiveFrom: string; approvedBy?: string; }
export interface Item { id: string; officeId: string; enterpriseItemId?: string; code: string; name: string; department: ItemDepartment; baseUnit: ItemUnit; purchaseUnit: ItemUnit; sellingUnit: ItemUnit; conversions: UnitConversion[]; purchasePrice: string; sellingPrice: string; currency: ItemCurrency; reorderLimit: string; status: 'ACTIVE' | 'ARCHIVED'; createdAt: string; updatedAt: string; version: number; }
export interface ItemBatch { id: string; officeId: string; itemId: string; batchNumber: string; expiryDate?: string; receivedDate: string; receivedQuantity: string; remainingQuantity: string; unit: ItemUnit; provisionalUnitCost?: string; status: 'ACTIVE' | 'EXPIRED' | 'CLOSED'; createdAt: string; updatedAt: string; }

export function validateItem(input: Item): void {
  if (!input.officeId.trim()) throw new Error('office_required');
  if (!input.code.trim() || !input.name.trim()) throw new Error('item_code_and_name_required');
  if (!ITEM_DEPARTMENTS.includes(input.department)) throw new Error('invalid_department');
  const units = [input.baseUnit, input.purchaseUnit, input.sellingUnit];
  if (units.some(unit => !ITEM_UNITS.includes(unit))) throw new Error('invalid_unit');
  for (const value of [input.purchasePrice, input.sellingPrice, input.reorderLimit]) {
    if (!/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(value)) throw new Error('invalid_decimal_value');
  }
}
