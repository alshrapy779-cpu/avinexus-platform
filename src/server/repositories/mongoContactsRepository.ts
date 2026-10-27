import type { Contact } from '../models/Contact';
import type { ContactRepository } from '../routes/contactsApi';
import { OfficeContactDocument } from '../models/OfficeContactDocument';

function toContact(doc: any): Contact {
  const data = doc.toObject ? doc.toObject() : doc;
  return {
    id: data.id, officeId: data.officeId,
    ...(data.partyId ? { partyId: data.partyId } : {}),
    name: data.name, type: data.type, phone: data.phone, address: data.address,
    openingBalance: data.openingBalance, currency: data.currency, status: data.status,
    createdAt: data.createdAt, updatedAt: data.updatedAt, version: data.version
  };
}

export const mongoContactsRepository: ContactRepository = {
  async list(officeId) {
    const docs = await OfficeContactDocument.find({ officeId }).sort({ createdAt: -1 }).lean();
    return docs.map(toContact);
  },
  async get(officeId, id) {
    const doc = await OfficeContactDocument.findOne({ officeId, id }).lean();
    return doc ? toContact(doc) : null;
  },
  async insert(contact) { await OfficeContactDocument.create(contact); },
  async update(contact, expectedVersion) {
    const result = await OfficeContactDocument.updateOne(
      { officeId: contact.officeId, id: contact.id, version: expectedVersion },
      { $set: { name: contact.name, type: contact.type, phone: contact.phone, address: contact.address, openingBalance: contact.openingBalance, currency: contact.currency, status: contact.status, updatedAt: contact.updatedAt, version: contact.version } }
    );
    return result.matchedCount === 1;
  }
};
