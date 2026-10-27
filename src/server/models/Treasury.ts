import mongoose, { Schema } from 'mongoose';

export interface TreasuryVoucher {
  id: string;
  officeId: string;
  voucherNumber: string;
  voucherType: 'RECEIPT' | 'DISBURSEMENT';
  voucherDate: string;
  partyName: string;
  amount: string;
  currency: 'SAR' | 'USD' | 'YER_NEW' | 'YER_OLD';
  settlementMethod: 'CASH' | 'BANK';
  accountId: string;
  invoiceId: string;
  description: string;
  status: 'DRAFT' | 'PENDING_ACCOUNTING';
  version: number;
}

const schema = new Schema<TreasuryVoucher>({
  id: { type: String, required: true, unique: true },
  officeId: { type: String, required: true, index: true },
  voucherNumber: { type: String, required: true },
  voucherType: {
    type: String,
    enum: ['RECEIPT', 'DISBURSEMENT'],
    required: true
  },
  voucherDate: { type: String, required: true },
  partyName: { type: String, required: true },
  amount: { type: String, required: true },
  currency: {
    type: String,
    enum: ['SAR', 'USD', 'YER_NEW', 'YER_OLD'],
    required: true
  },
  settlementMethod: {
    type: String,
    enum: ['CASH', 'BANK'],
    required: true
  },
  accountId: { type: String, required: true },
  invoiceId: { type: String, default: '' },
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ['DRAFT', 'PENDING_ACCOUNTING'],
    default: 'DRAFT'
  },
  version: { type: Number, default: 1 }
}, {
  timestamps: true,
  versionKey: false,
  collection: 'office_treasury_requests'
});

schema.index(
  { officeId: 1, voucherNumber: 1 },
  { unique: true }
);

export const TreasuryModel =
  (mongoose.models.OfficeTreasuryVoucher as
    mongoose.Model<TreasuryVoucher>) ||
  mongoose.model<TreasuryVoucher>(
    'OfficeTreasuryVoucher', schema
  );

export function validateTreasuryAmount(
  amount: unknown
): void {
  if (
    typeof amount !== 'string' ||
    !/^(0|[1-9]\d*)(\.\d+)?$/.test(amount) ||
    Number(amount) <= 0
  ) throw new Error('invalid_amount');
}
