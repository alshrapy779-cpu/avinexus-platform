import { BreedType, SystemType } from '../../types';

export type CustomerRegistrationStatus =
  | 'new'
  | 'phone_verified'
  | 'pending_review'
  | 'needs_information'
  | 'approved'
  | 'suspended'
  | 'rejected';

export type CustomerRegistrationSource = 'self_service' | 'admin' | 'marketing_office' | 'vet_referral' | 'qr';

export interface CustomerRegistrationV194 {
  id: string;
  customer_code: string;
  farm_code: string;
  flock_code?: string;
  source: CustomerRegistrationSource;
  status: CustomerRegistrationStatus;
  created_at: string;
  approved_at?: string;
  approved_by?: string;
  full_name: string;
  phone: string;
  whatsapp?: string;
  governorate: string;
  district: string;
  area?: string;
  gps?: { lat: number; lng: number };
  identity_reference?: string;
  farm_name: string;
  farm_activity: 'broiler' | 'layer' | 'breeder' | 'hatchery' | 'mixed' | 'other';
  system_type: SystemType;
  hangars_count: number;
  capacity: number;
  breed_type?: BreedType;
  active_flock_count?: number;
  active_flock_age_days?: number;
  chicks_source?: string;
  assigned_vet_id?: string;
  assigned_vet_name?: string;
  assigned_office_id?: string;
  notes?: string;
}

const seq = () => `${Date.now()}`.slice(-6);
const year = () => new Date().getFullYear();

export const buildCustomerRegistrationIdsV194 = () => {
  const suffix = seq();
  return {
    id: `customer-reg-${Date.now()}`,
    customer_code: `CUS-YE-${year()}-${suffix}`,
    farm_code: `FRM-YE-${year()}-${suffix}`,
    flock_code: `FLK-YE-${year()}-${suffix}`
  };
};

export const normalizePhoneV194 = (value: string) => value.replace(/[\s()+-]/g, '').replace(/^00967/, '967');

export const findDuplicateRegistrationV194 = (
  registrations: CustomerRegistrationV194[],
  draft: Pick<CustomerRegistrationV194, 'phone' | 'farm_name' | 'governorate' | 'district'>
) => {
  const phone = normalizePhoneV194(draft.phone);
  const farm = draft.farm_name.trim().toLowerCase();
  return registrations.find((item) => {
    const samePhone = normalizePhoneV194(item.phone) === phone;
    const sameFarm = item.farm_name.trim().toLowerCase() === farm;
    const samePlace = item.governorate === draft.governorate && item.district === draft.district;
    return samePhone || (sameFarm && samePlace);
  });
};

export const customerStatusLabelV194: Record<CustomerRegistrationStatus, string> = {
  new: 'جديد',
  phone_verified: 'تم التحقق من الهاتف',
  pending_review: 'قيد المراجعة',
  needs_information: 'يحتاج استكمال بيانات',
  approved: 'معتمد',
  suspended: 'موقوف',
  rejected: 'مرفوض'
};
