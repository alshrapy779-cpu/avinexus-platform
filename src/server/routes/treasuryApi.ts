import { Router, type RequestHandler } from 'express';
import { randomUUID } from 'node:crypto';
import {
  TreasuryModel,
  validateTreasuryAmount,
  type TreasuryVoucher
} from '../models/Treasury';

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

  const voucherType = required('voucherType');
  const settlementMethod = required('settlementMethod');
  const currency = required('currency');
  const amount = required('amount');
  const voucherDate = required('voucherDate');

  if (!['RECEIPT', 'DISBURSEMENT'].includes(voucherType)) {
    throw new Error('invalid_voucher_type');
  }
  if (!['CASH', 'BANK'].includes(settlementMethod)) {
    throw new Error('invalid_settlement_method');
  }
  if (!['SAR', 'USD', 'YER_NEW', 'YER_OLD'].includes(currency)) {
    throw new Error('invalid_currency');
  }
  validateTreasuryAmount(amount);

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(voucherDate) ||
    new Date(`${voucherDate}T00:00:00Z`)
      .toISOString().slice(0, 10) !== voucherDate
  ) throw new Error('invalid_voucher_date');

  return {
    voucherNumber: required('voucherNumber'),
    voucherType: voucherType as TreasuryVoucher['voucherType'],
    voucherDate,
    partyName: required('partyName'),
    amount,
    currency: currency as TreasuryVoucher['currency'],
    settlementMethod:
      settlementMethod as TreasuryVoucher['settlementMethod'],
    accountId: required('accountId'),
    invoiceId: get('invoiceId'),
    description: get('description')
  };
}

function errorText(error: unknown) {
  return error instanceof Error ? error.message : 'operation_failed';
}

export function createOfficeTreasuryRouter(
  deps: Dependencies
): Router {
  const router = Router({ mergeParams: true });
  router.use(deps.authenticate, deps.authorizeOffice);

  router.get('/', async (req, res) => {
    try {
      const vouchers = await TreasuryModel.find({
        officeId: String(req.params.officeId)
      }).sort({ createdAt: -1 }).lean();

      res.setHeader('Cache-Control', 'no-store');
      res.json({ success: true, vouchers });
    } catch {
      res.status(500).json({ error: 'treasury_fetch_failed' });
    }
  });

  router.get('/balances', (_req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.status(503).json({
      success: false,
      error: 's12_adapter_required',
      balances: null
    });
  });

  router.post('/', async (req, res) => {
    try {
      const voucher = await TreasuryModel.create({
        ...parse(req.body),
        id: randomUUID(),
        officeId: String(req.params.officeId),
        status: 'DRAFT',
        version: 1
      });
      res.status(201).json({ success: true, voucher });
    } catch (error) {
      const duplicate =
        (error as { code?: number })?.code === 11000;
      res.status(duplicate ? 409 : 400).json({
        error: duplicate ? 'duplicate_voucher' : errorText(error)
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

      const voucher = await TreasuryModel.findOneAndUpdate(
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

      if (!voucher) {
        res.status(409).json({ error: 'version_conflict' });
        return;
      }
      res.json({ success: true, voucher });
    } catch (error) {
      res.status(400).json({ error: errorText(error) });
    }
  });

  router.post('/:id/submit', async (req, res) => {
    try {
      const voucher = await TreasuryModel.findOneAndUpdate(
        {
          id: String(req.params.id),
          officeId: String(req.params.officeId),
          status: 'DRAFT'
        },
        {
          $set: { status: 'PENDING_ACCOUNTING' },
          $inc: { version: 1 }
        },
        { new: true }
      );

      if (!voucher) {
        res.status(409).json({ error: 'draft_not_found' });
        return;
      }

      res.json({
        success: true,
        voucher,
        posted: false,
        invoiceAllocated: false
      });
    } catch {
      res.status(500).json({ error: 'treasury_submit_failed' });
    }
  });

  return router;
}
