import mongoose, { Schema } from 'mongoose';

export interface OfficeFeed {
  id: string;
  officeId: string;
  code: string;
  name: string;
  feedType: 'STARTER' | 'GROWER' | 'FINISHER' | 'OTHER';
  supplier: string;
  batchNumber: string;
  quantity: string;
  unit: 'KG' | 'TON' | 'BAG_25KG' | 'BAG_50KG';
  purchasePrice: string;
  sellingPrice: string;
  currency: 'SAR' | 'USD' | 'YER_NEW' | 'YER_OLD';
  expiryDate: string;
  status: 'DRAFT' | 'PENDING_INVENTORY';
  version: number;
}

const schema = new Schema<OfficeFeed>({
  id: { type: String, required: true, unique: true },
  officeId: { type: String, required: true, index: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  feedType: {
    type: String,
    enum: ['STARTER', 'GROWER', 'FINISHER', 'OTHER'],
    required: true
  },
  supplier: { type: String, required: true },
  batchNumber: { type: String, required: true },
  quantity: { type: String, required: true },
  unit: {
    type: String,
    enum: ['KG', 'TON', 'BAG_25KG', 'BAG_50KG'],
    required: true
  },
  purchasePrice: { type: String, required: true },
  sellingPrice: { type: String, required: true },
  currency: {
    type: String,
    enum: ['SAR', 'USD', 'YER_NEW', 'YER_OLD'],
    required: true
  },
  expiryDate: { type: String, default: '' },
  status: {
    type: String,
    enum: ['DRAFT', 'PENDING_INVENTORY'],
    default: 'DRAFT'
  },
  version: { type: Number, default: 1 }
}, {
  timestamps: true,
  versionKey: false,
  collection: 'office_feed_batches'
});

schema.index(
  { officeId: 1, code: 1, batchNumber: 1 },
  { unique: true }
);

export const FeedModel =
  (mongoose.models.OfficeFeed as mongoose.Model<OfficeFeed>) ||
  mongoose.model<OfficeFeed>('OfficeFeed', schema);

export function validateFeed(
  data: Record<string, unknown>
): void {
  for (const key of [
    'quantity', 'purchasePrice', 'sellingPrice'
  ]) {
    const value = data[key];
    if (
      typeof value !== 'string' ||
      !/^(0|[1-9]\d*)(\.\d+)?$/.test(value)
    ) throw new Error(`invalid_${key}`);
    if (key === 'quantity' && Number(value) <= 0) {
      throw new Error('invalid_quantity');
    }
  }
}
