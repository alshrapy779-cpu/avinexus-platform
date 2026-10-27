export type ContactType = 'CUSTOMER' | 'SUPPLIER' | 'BOTH';
export type Currency = 'SAR' | 'USD' | 'YER_NEW' | 'YER_OLD';
export interface Contact {
  id: string; officeId: string; partyId?: string; name: string;
  type: ContactType; phone: string; address: string;
  openingBalance: string; currency: Currency;
  status: 'ACTIVE' | 'ARCHIVED'; createdAt: string; updatedAt: string; version: number;
}
