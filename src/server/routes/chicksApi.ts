import { Router, type RequestHandler } from 'express';
import { randomUUID } from 'node:crypto';
import {
  ChickBatchModel,
  validateChickBatch,
  type ChickBatch
} from '../models/ChickBatch';

type Dependencies = {
  authenticate: RequestHandler;
  authorizeOffice: RequestHandler;
};

function parse(body: unknown) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new Error('invalid_body');
  }
  const b = body as Record<string, unknown>;
  const str = (key: string) => String(b[key] ?? '').trim();
  const required = (key: string) => {
    const value = str(key);
    if (!value) throw new Error(`${key}_required`);
    return value;
  };
  const date = required('receivedDate');
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date
  ) throw new Error('invalid_date');

  const currency = required('currency');
  const paymentStatus = required('paymentStatus');

  if (!['SAR', 'USD', 'YER_NEW', 'YER_OLD'].includes(currency)) {
    throw new Error('invalid_currency');
  }
  if (!['CASH', 'CREDIT'].includes(paymentStatus)) {
    throw new Error('invalid_payment_status');
  }

  const data = {
    batchNumber: required('batchNumber'),
    supplier: required('supplier'),
    receivedDate: date,
    quantityReceived: Number(b.quantityReceived),
    mortality: Number(b.mortality),
    transportCost: required('transportCost'),
    wagesCost: required('wagesCost'),
    purchasePrice: required('purchasePrice'),
    currency: currency as ChickBatch['currency'],
    paymentStatus: paymentStatus as ChickBatch['paymentStatus'],
    invoiceId: str('invoiceId')
  };
  validateChickBatch(data);
  return data;
}

function failure(error: unknown) {
  return error instanceof Error ? error.message : 'operation_failed';
}

export function createOfficeChicksRouter(
  deps: Dependencies
): Router {
  const router = Router({ mergeParams: true });
  router.use(deps.authenticate, deps.authorizeOffice);

  router.get('/', async (req, res) => {
    try {
      const batches = await ChickBatchModel.find({
        officeId: String(req.params.officeId)
      }).sort({ createdAt: -1 }).lean();

      res.setHeader('Cache-Control', 'no-store');
      res.json({
        success: true,
        batches: batches.map(batch => ({
          ...batch,
          remainingUnposted:
            batch.quantityReceived - batch.mortality
        }))
      });
    } catch {
      res.status(500).json({ error: 'chicks_fetch_failed' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const batch = await ChickBatchModel.create({
        ...parse(req.body),
        id: randomUUID(),
        officeId: String(req.params.officeId),
        status: 'DRAFT',
        version: 1
      });
      res.status(201).json({ success: true, batch });
    } catch (error) {
      const duplicate =
        (error as { code?: number })?.code === 11000;
      res.status(duplicate ? 409 : 400).json({
        error: duplicate ? 'duplicate_batch' : failure(error)
      });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const version = Number(req.body?.version);
      if (!Number.isSafeInteger(version) || version < 1) {
        res.status(400).json({ error: 'version_required' });
        return;
      }

      const batch = await ChickBatchModel.findOneAndUpdate(
        {
          id: String(req.params.id),
          officeId: String(req.params.officeId),
          version,
          status: 'DRAFT'
        },
        {
          $set: parse(req.body),
          $inc: { version: 1 }
        },
        { new: true, runValidators: true }
      );

      if (!batch) {
        res.status(409).json({ error: 'version_conflict' });
        return;
      }
      res.json({ success: true, batch });
    } catch (error) {
      res.status(400).json({ error: failure(error) });
    }
  });

  router.post('/:id/submit', async (req, res) => {
    try {
      const batch = await ChickBatchModel.findOneAndUpdate(
        {
          id: String(req.params.id),
          officeId: String(req.params.officeId),
          status: 'DRAFT'
        },
        {
          $set: { status: 'PENDING_INVENTORY' },
          $inc: { version: 1 }
        },
        { new: true }
      );

      if (!batch) {
        res.status(409).json({ error: 'draft_not_found' });
        return;
      }

      res.json({
        success: true,
        batch,
        inventoryPosted: false,
        accountingPosted: false
      });
    } catch {
      res.status(500).json({ error: 'submit_failed' });
    }
  });

  return router;
}
