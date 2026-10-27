import { Router, type RequestHandler } from 'express';
import { randomUUID } from 'node:crypto';
import { type Item, type ItemBatch, type ItemDepartment, type ItemUnit, type ItemCurrency, type UnitConversion, validateItem, ITEM_DEPARTMENTS, ITEM_UNITS, ITEM_CURRENCIES } from '../models/Item';
export interface ItemRepository { list(officeId: string): Promise<Item[]>; get(officeId: string, id: string): Promise<Item | null>; insert(item: Item): Promise<void>; update(item: Item, expectedVersion: number): Promise<boolean>; listBatches(officeId: string, itemId: string): Promise<ItemBatch[]>; }
export interface ItemsApiDependencies { authenticate: RequestHandler; authorizeOffice: RequestHandler; repository: ItemRepository; }
function stringValue(value: unknown): string { return typeof value === 'string' ? value.trim() : ''; }
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value); }
function parseConversions(value: unknown): UnitConversion[] { if (!Array.isArray(value)) throw new Error('invalid_conversions'); return value.map(entry => { if (!isRecord(entry)) throw new Error('invalid_conversion'); return { fromUnit: entry.fromUnit as ItemUnit, toUnit: entry.toUnit as ItemUnit, factor: stringValue(entry.factor), effectiveFrom: stringValue(entry.effectiveFrom), approvedBy: stringValue(entry.approvedBy) }; }); }
function parseItem(body: Record<string, unknown>, officeId: string, existing?: Item): Item {
  const now = new Date().toISOString();
  const read = (key: string, fallback: string): string => { return body[key] === undefined ? fallback : stringValue(body[key]); };
  const item: Item = { id: existing?.id || randomUUID(), officeId, enterpriseItemId: existing?.enterpriseItemId, code: read('code', existing?.code || ''), name: read('name', existing?.name || ''), department: read('department', existing?.department || 'MEDICINES') as ItemDepartment, baseUnit: read('baseUnit', existing?.baseUnit || 'BOX') as ItemUnit, purchaseUnit: read('purchaseUnit', existing?.purchaseUnit || 'BOX') as ItemUnit, sellingUnit: read('sellingUnit', existing?.sellingUnit || 'BOX') as ItemUnit, conversions: body.conversions === undefined ? existing?.conversions || [] : parseConversions(body.conversions), purchasePrice: read('purchasePrice', existing?.purchasePrice || '0'), sellingPrice: read('sellingPrice', existing?.sellingPrice || '0'), currency: read('currency', existing?.currency || 'SAR') as ItemCurrency, reorderLimit: read('reorderLimit', existing?.reorderLimit || '0'), status: existing?.status || 'ACTIVE', createdAt: existing?.createdAt || now, updatedAt: now, version: existing ? existing.version + 1 : 1 };
  validateItem(item); return item;
}
export function createOfficeItemsRouter(deps: ItemsApiDependencies): Router {
  const router = Router({ mergeParams: true });
  router.use(deps.authenticate, deps.authorizeOffice);
  router.get('/metadata', (_req, res) => { res.json({ success: true, departments: ITEM_DEPARTMENTS, units: ITEM_UNITS, currencies: ITEM_CURRENCIES }); });
  router.get('/', async (req, res) => {
    try {
      const officeId = String(req.params.officeId || '');
      let items = await deps.repository.list(officeId);
      const department = stringValue(req.query.department);
      const search = stringValue(req.query.search).toLowerCase();
      if (department) { if (!ITEM_DEPARTMENTS.includes(department as ItemDepartment)) { res.status(400).json({ success: false, error: 'invalid_department' }); return; } items = items.filter(item => item.department === department); }
      if (search) { items = items.filter(item => item.name.toLowerCase().includes(search) || item.code.toLowerCase().includes(search)); }
      res.setHeader('Cache-Control', 'no-store');
      res.json({ success: true, items });
    } catch (error) { res.status(500).json({ success: false, error: 'items_fetch_failed' }); }
  });
  router.get('/:id/batches', async (req, res) => {
    try {
      const officeId = String(req.params.officeId || '');
      const itemId = String(req.params.id || '');
      const item = await deps.repository.get(officeId, itemId);
      if (!item) { res.status(404).json({ success: false, error: 'item_not_found' }); return; }
      const batches = await deps.repository.listBatches(officeId, itemId);
      res.json({ success: true, batches });
    } catch (error) { res.status(500).json({ success: false, error: 'batches_fetch_failed' }); }
  });
  router.post('/', async (req, res) => {
    try {
      if (!isRecord(req.body)) { res.status(400).json({ success: false, error: 'invalid_request_body' }); return; }
      const officeId = String(req.params.officeId || '');
      const item = parseItem(req.body, officeId);
      const existingItems = await deps.repository.list(officeId);
      const duplicate = existingItems.some(current => current.code.toLowerCase() === item.code.toLowerCase());
      if (duplicate) { res.status(409).json({ success: false, error: 'duplicate_item_code' }); return; }
      await deps.repository.insert(item);
      res.status(201).json({ success: true, item });
    } catch (error) { const message = error instanceof Error ? error.message : 'item_create_failed'; res.status(400).json({ success: false, error: message }); }
  });
  router.put('/:id', async (req, res) => {
    try {
      if (!isRecord(req.body)) { res.status(400).json({ success: false, error: 'invalid_request_body' }); return; }
      const officeId = String(req.params.officeId || '');
      const id = String(req.params.id || '');
      const existing = await deps.repository.get(officeId, id);
      if (!existing) { res.status(404).json({ success: false, error: 'item_not_found' }); return; }
      if (existing.status === 'ARCHIVED') { res.status(409).json({ success: false, error: 'item_archived' }); return; }
      if (req.body.version !== undefined && Number(req.body.version) !== existing.version) { res.status(409).json({ success: false, error: 'version_conflict' }); return; }
      const updated = parseItem(req.body, officeId, existing);
      const allItems = await deps.repository.list(officeId);
      const duplicate = allItems.some(current => current.id !== id && current.code.toLowerCase() === updated.code.toLowerCase());
      if (duplicate) { res.status(409).json({ success: false, error: 'duplicate_item_code' }); return; }
      const saved = await deps.repository.update(updated, existing.version);
      if (!saved) { res.status(409).json({ success: false, error: 'version_conflict' }); return; }
      res.json({ success: true, item: updated });
    } catch (error) { const message = error instanceof Error ? error.message : 'item_update_failed'; res.status(400).json({ success: false, error: message }); }
  });
  return router;
}
