import { Router, type RequestHandler } from 'express';
import { randomUUID } from 'node:crypto';
import type { Contact, ContactType, Currency } from '../models/Contact';

export interface ContactRepository {
  list(officeId: string): Promise<Contact[]>;
  get(officeId: string, id: string): Promise<Contact | null>;
  insert(contact: Contact): Promise<void>;
  update(contact: Contact, expectedVersion: number): Promise<boolean>;
}

export interface ContactsApiDependencies {
  authenticate: RequestHandler;
  authorizeOffice: RequestHandler;
  repository: ContactRepository;
  audit: (event: any) => Promise<void>;
}

export function createOfficeContactsRouter(deps: ContactsApiDependencies): Router {
  const router = Router({ mergeParams: true });
  router.use(deps.authenticate, deps.authorizeOffice);

  router.get('/', async (req, res) => {
    try {
      const officeId = String(req.params.officeId);
      const contacts = await deps.repository.list(officeId);
      res.setHeader('Cache-Control', 'no-store');
      res.json({ success: true, contacts });
    } catch { res.status(500).json({ success: false, error: 'contacts_fetch_failed' }); }
  });

  router.post('/', async (req, res) => {
    try {
      const now = new Date().toISOString();
      const contact: Contact = {
        id: randomUUID(), officeId: String(req.params.officeId),
        name: String(req.body.name || '').trim(), type: req.body.type as ContactType,
        phone: String(req.body.phone || '').trim(), address: String(req.body.address || '').trim(),
        openingBalance: String(req.body.openingBalance || '0'), currency: req.body.currency as Currency,
        status: 'ACTIVE', createdAt: now, updatedAt: now, version: 1
      };
      if (!contact.name || contact.name.length < 2) throw new Error('invalid_name');
      await deps.repository.insert(contact);
      res.status(201).json({ success: true, contact });
    } catch (error) {
      res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'contact_create_failed' });
    }
  });

  return router;
}
