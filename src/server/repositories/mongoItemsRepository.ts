import type { Item, ItemBatch } from '../models/Item';
import type { ItemRepository } from '../routes/itemsApi';
import { OfficeItemDocument, OfficeItemBatchDocument } from '../models/OfficeItemDocument';
export const mongoItemsRepository: ItemRepository = {
  async list(officeId: string): Promise<Item[]> { return await OfficeItemDocument.find({ officeId }).sort({ name: 1 }).lean() as Item[]; },
  async get(officeId: string, id: string): Promise<Item | null> { return await OfficeItemDocument.findOne({ officeId, id }).lean() as Item | null; },
  async insert(item: Item): Promise<void> { await OfficeItemDocument.create(item); },
  async update(item: Item, expectedVersion: number): Promise<boolean> {
    const result = await OfficeItemDocument.updateOne({ officeId: item.officeId, id: item.id, version: expectedVersion }, { $set: { code: item.code, name: item.name, department: item.department, baseUnit: item.baseUnit, purchaseUnit: item.purchaseUnit, sellingUnit: item.sellingUnit, conversions: item.conversions, purchasePrice: item.purchasePrice, sellingPrice: item.sellingPrice, currency: item.currency, reorderLimit: item.reorderLimit, updatedAt: item.updatedAt, version: item.version } });
    return result.modifiedCount === 1;
  },
  async listBatches(officeId: string, itemId: string): Promise<ItemBatch[]> { return await OfficeItemBatchDocument.find({ officeId, itemId }).sort({ expiryDate: 1 }).lean() as ItemBatch[]; }
};
