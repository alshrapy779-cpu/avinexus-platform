import { Router, type RequestHandler } from 'express';
import { randomUUID } from 'node:crypto';
import { type Item, type ItemBatch, validateItem } from '../models/Item';

export interface ItemRepository {
  list(officeId: string): Promise<Item[]>;
  get(officeId: string, id: string): Promise<Item | null>;
  insert(item: Item): Promise<void>;
  update(item: Item, expectedVersion: number): Promise<boolean>;
  listBatches(officeId: string, itemId: string): Promise<ItemBatch[]>;
}

export interface ItemsApiDependencies {
  authenticate: RequestHandler;
  authorizeOffice: RequestHandler;
  repository: ItemRepository;
}

export function createOfficeItemsRouter(deps: ItemsApiDependencies): Router {
  const router = Router({ mergeParams: true });
  router.use(deps.authenticate, deps.authorizeOffice);

  router.get('/', async (req, res) => {
    try {
      const officeId = String(req.params.officeId);
      let items = await deps.repository.list(officeId);
      const department = String(req.query.department || '');
      const search = String(req.query.search || '').toLowerCase();
      if (department) items = items.filter(item => item.department === department);
      if (search) items = items.filter(item => item.name.toLowerCase().includes(search) || item.code.toLowerCase().includes(search));
      res.setHeader('Cache-Control', 'no-store');
      res.json({ success: true, items });
    } catch { res.status(500).json({ success: false, error: 'items_fetch_failed' }); }
  });

  router.post('/', async (req, res) => {
    try {
      const now = new Date().toISOString();
      const item: Item = {
        id: randomUUID(), officeId: String(req.params.officeId), code: String(req.body.code || '').trim(), name: String(req.body.name || '').trim(),
        department: req.body.department, baseUnit: req.body.baseUnit, purchaseUnit: req.body.purchaseUnit, sellingUnit: req.body.sellingUnit,
        conversions: req.body.conversions || [], purchasePrice: String(req.body.purchasePrice), sellingPrice: String(req.body.sellingPrice),
        currency: req.body.currency, reorderLimit: String(req.body.reorderLimit), status: 'ACTIVE', createdAt: now, updatedAt: now, version: 1
      };
      validateItem(item);
      await deps.repository.insert(item);
      res.status(201).json({ success: true, item });
    } catch (error) {
      res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'item_create_failed' });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const officeId = String(req.params.officeId); const id = String(req.params.id);
      const existing = await deps.repository.get(officeId, id);
      if (!existing) { res.status(404).json({ success: false, error: 'item_not_found' }); return; }
      if (existing.status === 'ARCHIVED') { res.status(409).json({ success: false, error: 'item_archived' }); return; }
      const updated: Item = { ...existing, code: req.body.code ?? existing.code, name: req.body.name ?? existing.name, department: req.body.department ?? existing.department, baseUnit: req.body.baseUnit ?? existing.baseUnit, purchaseUnit: req.body.purchaseUnit ?? existing.purchaseUnit, sellingUnit: req.body.sellingUnit ?? existing.sellingUnit, conversions: req.body.conversions ?? existing.conversions, purchasePrice: req.body.purchasePrice ?? existing.purchasePrice, sellingPrice: req.body.sellingPrice ?? existing.sellingPrice, currency: req.body.currency ?? existing.currency, reorderLimit: req.body.reorderLimit ?? existing.reorderLimit, updatedAt: new Date().toISOString(), version: existing.version + 1 };
      validateItem(updated);
      const saved = await deps.repository.update(updated, existing.version);
      if (!saved) { res.status(409).json({ success: false, error: 'version_conflict' }); return; }
      res.json({ success: true, item: updated });
    } catch (error) {
      res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'item_update_failed' });
    }
  });

  router.get('/:id/batches', async (req, res) => {
    try {
      const officeId = String(req.params.officeId); const itemId = String(req.params.id);
      const item = await deps.repository.get(officeId, itemId);
      if (!item) { res.status(404).json({ success: false, error: 'item_not_found' }); return; }
      const batches = await deps.repository.listBatches(officeId, itemId);
      res.json({ success: true, batches });
    } catch { res.status(500).json({ success: false, error: 'batches_fetch_failed' }); }
  });

  return router;
}
