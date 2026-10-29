
import type {
  MultiBusinessEnterpriseStateV2023
} from "../../modules/v20/MultiBusinessEnterpriseV20_2_3";

import type {
  OfficeWorkspace
} from "./office360Workspace.ts";

export interface Office360Dashboard {
  office: {
    id: string;
    code: string;
    name: string;
    status: string;
  };
  viewer: {
    userId: string;
    role: string;
  };
  summary: {
    activeContracts: number;
    assignedFarms: number;
    customers: number | null;
    suppliers: number | null;
    openAlerts: number | null;
  };
  recentOperations: Array<{
    id: string;
    type: string;
    reference: string;
    date: string;
  }>;
  finance: {
    source: "S12";
    balances: null;
    receivables: null;
    salesToday: null;
    profitLoss: null;
    status: "awaiting_authorized_accounting_integration";
  };
  inventory: {
    source: "S7";
    stockBalances: null;
    status: "awaiting_authorized_inventory_integration";
  };
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

/**
 * Read-only operational projection.
 *
 * The caller MUST obtain workspace from the trusted
 * authenticated Office 360 resolver.
 *
 * This function does not authorize HTTP requests.
 * It does not post accounting or inventory movements.
 */
export function buildOffice360Dashboard(
  state: MultiBusinessEnterpriseStateV2023,
  workspace: OfficeWorkspace,
  at: string
): Office360Dashboard {
  if (
    !workspace.userId ||
    !workspace.officeId ||
    !workspace.accessContext.active ||
    workspace.accessContext.userId !== workspace.userId ||
    workspace.accessContext.officeId !== workspace.officeId
  ) {
    throw new Error("office360_invalid_workspace");
  }

  const office = state.business_units.find(
    unit =>
      unit.id === workspace.officeId &&
      unit.type === "office" &&
      unit.status === "active"
  );

  if (!office) {
    throw new Error("office360_office_not_active");
  }

  const date = at.slice(0, 10);

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    Number.isNaN(Date.parse(date + "T00:00:00Z"))
  ) {
    throw new Error("office360_invalid_date");
  }

  const activeContracts = state.contracts.filter(
    contract =>
      contract.business_unit_id === office.id &&
      workspace.contractIds.includes(contract.id) &&
      contract.status === "active" &&
      contract.start_date.slice(0, 10) <= date &&
      (!contract.end_date ||
        contract.end_date.slice(0, 10) >= date)
  );

  const validContractIds = new Set(
    activeContracts.map(contract => contract.id)
  );

  const contractFarmIds = new Set<string>();

  for (const contract of activeContracts) {
    for (const farmId of contract.linked_farm_ids) {
      if (farmId) contractFarmIds.add(farmId);
    }
  }

  for (const link of state.farm_links) {
    if (
      link.business_unit_id === office.id &&
      link.active &&
      link.contract_id &&
      validContractIds.has(link.contract_id) &&
      link.starts_at <= at &&
      (!link.ends_at || link.ends_at >= at)
    ) {
      contractFarmIds.add(link.farm_id);
    }
  }

  const authorizedFarms = unique(
    workspace.farmIds.filter(
      id => contractFarmIds.has(id)
    )
  );

  const allowedFarmIds = new Set(authorizedFarms);

  const canViewContacts =
    workspace.modules.includes("contacts");

  const canViewReports =
    workspace.modules.includes("reports");

  const customers = canViewContacts
    ? state.customers.filter(
        customer =>
          customer.business_unit_id === office.id &&
          (
            customer.linked_farm_ids.length === 0 ||
            customer.linked_farm_ids.some(
              id => allowedFarmIds.has(id)
            )
          )
      ).length
    : null;

  // Suppliers are office-scoped, never global.
  const suppliers = canViewContacts
    ? state.suppliers.filter(
        supplier =>
          supplier.business_unit_id === office.id
      ).length
    : null;

  const alerts = canViewReports
    ? state.exceptions.filter(
        alert =>
          alert.business_unit_id === office.id &&
          alert.status !== "resolved" &&
          (
            alert.type !== "medical_critical" ||
            workspace.modules.includes("medicines")
          )
      )
    : [];

  /*
   * Financial and inventory records must be obtained
   * from their canonical owners with separate
   * permissions. No financial totals are calculated
   * from partial invoice or movement lists.
   */

  return {
    office: {
      id: office.id,
      code: office.code,
      name: office.name,
      status: office.status
    },
    viewer: {
      userId: workspace.userId,
      role: workspace.role
    },
    summary: {
      activeContracts: activeContracts.length,
      assignedFarms: authorizedFarms.length,
      customers,
      suppliers,
      openAlerts: canViewReports ? alerts.length : null
    },
    recentOperations: canViewReports
      ? alerts
          .slice()
          .sort((a, b) =>
            b.opened_at.localeCompare(a.opened_at)
          )
          .slice(0, 8)
          .map(alert => ({
            id: alert.id,
            type: "office_alert",
            reference: alert.exception_number,
            date: alert.opened_at
          }))
      : [],
    finance: {
      source: "S12",
      balances: null,
      receivables: null,
      salesToday: null,
      profitLoss: null,
      status:
        "awaiting_authorized_accounting_integration"
    },
    inventory: {
      source: "S7",
      stockBalances: null,
      status:
        "awaiting_authorized_inventory_integration"
    }
  };
}

