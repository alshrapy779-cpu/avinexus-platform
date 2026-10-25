export type SovereigntyRoleV19 =
  | 'system_owner'
  | 'ceo'
  | 'finance'
  | 'vet_manager'
  | 'vet'
  | 'field_supervisor'
  | 'worker'
  | 'sales_marketing'
  | 'supplier_branch'
  | 'warehouse'
  | 'laboratory'
  | 'farmer_customer'
  | 'auditor';

export type SovereigntyPermissionV19 =
  | 'manage_master_data'
  | 'manage_permissions'
  | 'approve_financial_policy'
  | 'approve_high_value_payment'
  | 'publish_health_label'
  | 'sign_medical_decision'
  | 'manage_epidemic_alerts'
  | 'manage_inventory'
  | 'confirm_delivery'
  | 'manage_marketing_prices'
  | 'assign_field_vets'
  | 'view_executive_dashboard'
  | 'view_own_farms'
  | 'submit_field_data'
  | 'view_audit_logs';

const ROLE_PERMISSIONS: Record<SovereigntyRoleV19, readonly SovereigntyPermissionV19[]> = {
  system_owner: ['manage_master_data','manage_permissions','approve_financial_policy','approve_high_value_payment','publish_health_label','sign_medical_decision','manage_epidemic_alerts','manage_inventory','confirm_delivery','manage_marketing_prices','assign_field_vets','view_executive_dashboard','view_own_farms','submit_field_data','view_audit_logs'],
  ceo: ['manage_master_data','manage_permissions','approve_financial_policy','approve_high_value_payment','manage_epidemic_alerts','manage_marketing_prices','assign_field_vets','view_executive_dashboard','view_audit_logs'],
  finance: ['approve_financial_policy','approve_high_value_payment','confirm_delivery','view_executive_dashboard','view_audit_logs'],
  vet_manager: ['publish_health_label','sign_medical_decision','manage_epidemic_alerts','assign_field_vets','view_executive_dashboard','submit_field_data'],
  vet: ['publish_health_label','sign_medical_decision','submit_field_data','view_own_farms'],
  field_supervisor: ['submit_field_data','view_own_farms','confirm_delivery'],
  worker: ['submit_field_data','view_own_farms'],
  sales_marketing: ['manage_marketing_prices','assign_field_vets','confirm_delivery','view_executive_dashboard'],
  supplier_branch: ['manage_inventory','confirm_delivery'],
  warehouse: ['manage_inventory','confirm_delivery'],
  laboratory: ['submit_field_data','publish_health_label'],
  farmer_customer: ['view_own_farms','submit_field_data'],
  auditor: ['view_executive_dashboard','view_audit_logs']
};

export const permissionsForRoleV19 = (role: SovereigntyRoleV19) => [...ROLE_PERMISSIONS[role]];
export const hasPermissionV19 = (role: SovereigntyRoleV19, permission: SovereigntyPermissionV19) => ROLE_PERMISSIONS[role].includes(permission);
