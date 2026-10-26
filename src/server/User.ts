/** Registration approval records. Credentials remain in the existing PBKDF2 auth store. */
export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export interface UserRegistration {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  email: string;
  requested_department: string;
  requested_organization: string;
  status: RegistrationStatus;
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
}
export function publicRegistration(row: UserRegistration): Omit<UserRegistration, 'requested_organization'> & {requested_organization:string} {
  return {...row};
}
