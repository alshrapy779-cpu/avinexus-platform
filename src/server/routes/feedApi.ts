import { Router, type RequestHandler } from 'express';
import { randomUUID } from 'node:crypto';
import {
  FeedModel,
  validateFeed,
  type OfficeFeed
} from '../models/Feed';

type Dependencies = {
  authenticate: RequestHandler;
  authorizeOffice: RequestHandler;
};

function parse(body: unknown) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new Error('invalid_body');
  }
  const b = body as Record<string, unknown>;
  const get = (key: string) => String(b[key] ?? '').trim();
  const required = (key: string) => {
    const value = get(key);
    if (!value) throw new Error(`${key}_required`);
    return value;
  };

  const feedType = required('feedType');
  const unit = required('unit');
  const currency = required('currency');
  const expiryDate = get('expiryDate');

  if (!['STARTER', 'GROWER', 'FINISHER', 'OTHER'].includes(feedType)) {
    throw new Error('invalid_feed_type');
  }
  if (!['KG', 'TON', 'BAG_25KG', 'BAG_50KG'].includes(unit)) {
    throw new Error('invalid_unit');
  }
  if (!['SAR', 'USD', 'YER_NEW', 'YER_OLD'].includes(currency)) {
    throw new Error('invalid_currency');
  }
  if (expiryDate) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(expiryDate) ||
      new Date(`${expiryDate}T00:00:00Z`)
        .toISOString().slice(0, 10) !== expiryDate
    ) throw new Error('invalid_expiry_date');
  }

  const data = {
    code: required('code'),
    name: required('name'),
    feedType: feedType as OfficeFeed['feedType'],
    supplier: required('supplier'),
    batchNumber: required('batchNumber'),
    quantity: required('quantity'),
    unit: unit as OfficeFeed['unit'],
    purchasePrice: required('purchasePrice'),
    sellingPrice: required('sellingPrice'),
    currency: currency as OfficeFeed['currency'],
    expiryDate
  };
  validateFeed(data);
  return data;
}

function errorText(error: unknown) {
  return error instanceof Error ? error.message : 'operation_failed';
}

export function createOfficeFeedRouter(deps: Dependencies): Router {
  const router = Router({ mergeParams: true });
  router.use(deps.authenticate, deps.authorizeOffice);

  router.get('/', async (req, res) => {
    try {
      const feeds = await FeedModel.find({
        officeId: String(req.params.officeId)
      }).sort({ createdAt: -1 }).lean();

      res.setHeader('Cache-Control', 'no-store');
      res.json({
        success: true,
        feeds,
        inventoryCertified: false
      });
    } catch {
      res.status(500).json({ error: 'feed_fetch_failed' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const feed = await FeedModel.create({
        ...parse(req.body),
        id: randomUUID(),
        officeId: String(req.params.officeId),
        status: 'DRAFT',
        version: 1
      });
      res.status(201).json({ success: true, feed });
    } catch (error) {
      const duplicate =
        (error as { code?: number })?.code === 11000;
      res.status(duplicate ? 409 : 400).json({
        error: duplicate ? 'duplicate_feed_batch' : errorText(error)
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
      const feed = await FeedModel.findOneAndUpdate(
        {
          id: String(req.params.id),
          officeId: String(req.params.officeId),
          status: 'DRAFT',
          version
        },
        {
          $set: parse(req.body),
          $inc: { version: 1 }
        },
        { new: true, runValidators: true }
      );
      if (!feed) {
        res.status(409).json({ error: 'version_conflict' });
        return;
      }
      res.json({ success: true, feed });
    } catch (error) {
      res.status(400).json({ error: errorText(error) });
    }
  });

  router.post('/:id/submit', async (req, res) => {
    try {
      const feed = await FeedModel.findOneAndUpdate(
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
      if (!feed) {
        res.status(409).json({ error: 'draft_not_found' });
        return;
      }
      res.json({
        success: true,
        feed,
        inventoryPosted: false
      });
    } catch {
      res.status(500).json({ error: 'feed_submit_failed' });
    }
  });

  return router;
}
