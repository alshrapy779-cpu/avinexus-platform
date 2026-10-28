
export const OFFICE360_MODULES = [
  "sales",
  "profit_loss",
  "treasury",
  "contacts",
  "medicines",
  "chicks",
  "equipment",
  "poultry_marketing",
  "transport",
  "employees",
  "expenses",
  "reports"
] as const;

export type Office360Module =
  (typeof OFFICE360_MODULES)[number];

export type Office360Role =
  | "office_owner"
  | "office_manager"
  | "accountant"
  | "veterinarian"
  | "supervisor"
  | "worker"
  | "auditor";

export interface Office360AccessContext {
  userId: string;
  officeId: string;
  role: Office360Role;
  permittedModules: readonly Office360Module[];
  assignedFarmIds: readonly string[];
  active: boolean;
}

export interface Office360Resource {
  officeId: string;
  farmId?: string;
}

export function canAccessOffice360(
  context: Office360AccessContext | null | undefined,
  resource: Office360Resource,
  module: Office360Module
): boolean {
  if (
    !context ||
    !context.active ||
    !context.userId ||
    !context.officeId ||
    !resource.officeId
  ) {
    return false;
  }

  if (context.officeId !== resource.officeId) {
    return false;
  }

  if (!context.permittedModules.includes(module)) {
    return false;
  }

  if (
    resource.farmId &&
    !context.assignedFarmIds.includes(resource.farmId)
  ) {
    return false;
  }

  return true;
}

export function getAvailableOffice360Modules(
  context: Office360AccessContext | null | undefined
): Office360Module[] {
  if (
    !context ||
    !context.active ||
    !context.userId ||
    !context.officeId
  ) {
    return [];
  }

  return OFFICE360_MODULES.filter(module =>
    context.permittedModules.includes(module)
  );
}

export const OFFICE360_ARCHITECTURE = {
  platform: "AviNexus",
  workspace: "Office360",
  officeIsolation: true,
  farmIsolation: true,
  inventoryOwner: "S7",
  accountingOwner: "S12",
  separateGeneralLedger: false,
  nativeAndroidDeferred: true
} as const;

