
import {
  OFFICE360_MODULES,
  type Office360Module,
  type Office360Role,
  type Office360AccessContext,
  getAvailableOffice360Modules
} from "./office360Scope.ts";

export type OfficeContractStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "ACTIVE"
  | "SUSPENDED"
  | "EXPIRED"
  | "TERMINATED";

export interface OfficeContractSnapshot {
  id: string;
  officeId: string;
  status: OfficeContractStatus;
  effectiveFrom: string;
  effectiveTo?: string;
  farmIds: readonly string[];
  permittedModules: readonly Office360Module[];
}

export interface OfficeUserAssignment {
  userId: string;
  officeId: string;
  role: Office360Role;
  active: boolean;
  permittedModules: readonly Office360Module[];
  assignedFarmIds: readonly string[];
}

export interface OfficeWorkspace {
  officeId: string;
  userId: string;
  role: Office360Role;
  contractIds: string[];
  farmIds: string[];
  modules: Office360Module[];
  accessContext: Office360AccessContext;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function validDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;

  const parsed = new Date(value + "T00:00:00Z");

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

export function isContractEffective(
  contract: OfficeContractSnapshot,
  today: string
): boolean {
  if (!validDate(today)) {
    throw new Error("invalid_current_date");
  }

  if (
    !validDate(contract.effectiveFrom) ||
    (contract.effectiveTo &&
      !validDate(contract.effectiveTo))
  ) {
    return false;
  }

  if (
    contract.status !== "APPROVED" &&
    contract.status !== "ACTIVE"
  ) {
    return false;
  }

  if (today < contract.effectiveFrom) {
    return false;
  }

  if (
    contract.effectiveTo &&
    today > contract.effectiveTo
  ) {
    return false;
  }

  return true;
}

export function buildOfficeWorkspace(
  assignment: OfficeUserAssignment,
  contracts: readonly OfficeContractSnapshot[],
  today: string
): OfficeWorkspace | null {
  if (
    !assignment.active ||
    !assignment.userId ||
    !assignment.officeId
  ) {
    return null;
  }

  if (!validDate(today)) {
    throw new Error("invalid_current_date");
  }

  const activeContracts = contracts.filter(
    contract =>
      contract.id &&
      contract.officeId === assignment.officeId &&
      isContractEffective(contract, today)
  );

  if (activeContracts.length === 0) {
    return null;
  }

  const contractedFarms = new Set(
    activeContracts.flatMap(contract => contract.farmIds)
  );

  const contractedModules = new Set(
    activeContracts.flatMap(
      contract => contract.permittedModules
    )
  );

  const farmIds = unique(
    assignment.assignedFarmIds.filter(
      farmId => contractedFarms.has(farmId)
    )
  );

  const permittedModules = OFFICE360_MODULES.filter(
    module =>
      assignment.permittedModules.includes(module) &&
      contractedModules.has(module)
  );

  const accessContext: Office360AccessContext = {
    userId: assignment.userId,
    officeId: assignment.officeId,
    role: assignment.role,
    active: true,
    permittedModules,
    assignedFarmIds: farmIds
  };

  return {
    officeId: assignment.officeId,
    userId: assignment.userId,
    role: assignment.role,
    contractIds: unique(
      activeContracts.map(contract => contract.id)
    ),
    farmIds,
    modules: getAvailableOffice360Modules(accessContext),
    accessContext
  };
}

