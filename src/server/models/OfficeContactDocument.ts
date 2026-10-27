import mongoose, { Schema } from 'mongoose';

const OfficeContactSchema = new Schema(
  {
    id: { type: String, required: true },
    officeId: { type: String, required: true, index: true },
    partyId: { type: String, default: null },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['CUSTOMER', 'SUPPLIER', 'BOTH'], required: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    openingBalance: { type: String, default: '0' },
    currency: { type: String, enum: ['SAR', 'USD', 'YER_NEW', 'YER_OLD'], required: true },
    status: { type: String, enum: ['ACTIVE', 'ARCHIVED'], default: 'ACTIVE' },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
    version: { type: Number, required: true, default: 1 }
  },
  { collection: 'office_contacts', versionKey: false, strict: true }
);

OfficeContactSchema.index({ officeId: 1, id: 1 }, { unique: true });
OfficeContactSchema.index({ officeId: 1, partyId: 1 }, { unique: true, partialFilterExpression: { partyId: { $type: 'string' } } });

export const OfficeContactDocument = mongoose.models.OfficeContactDocument || mongoose.model('OfficeContactDocument', OfficeContactSchema);
