
import type {
  MultiBusinessEnterpriseStateV2023
} from "../../modules/v20/MultiBusinessEnterpriseV20_2_3";

import type {
  Office360DataSource
} from "./office360Resolver.ts";

import type {
  OfficeContractSnapshot,
  OfficeUserAssignment
} from "./office360Workspace.ts";

import {
  OFFICE360_MODULES,
  type Office360Module,
  type Office360Role
} from "./office360Scope.ts";

const ROLE_MAP: Record<string, Office360Role> = {
  OFFICE_MANAGER: "office_manager",
  ACCOUNTANT: "accountant",
  FINANCE_OFFICER: "accountant",
  FIELD_VET: "veterinarian",
  VETERINARIAN: "veterinarian",
  FARM_MANAGER: "supervisor",
  SUPERVISOR: "supervisor",
  FARM_WORKER: "worker",
  AUDITOR: "auditor"
};

const ROLE_MODULES: Record<Office360Role, readonly Office360Module[]> = {
  office_owner: OFFICE360_MODULES,
  office_manager: OFFICE360_MODULES,
  accountant: [
    "sales", "profit_loss", "treasury",
    "contacts", "expenses", "reports"
  ],
  veterinarian: ["medicines", "reports"],
  supervisor: ["chicks", "medicines", "reports"],
  worker: [],
  auditor: ["reports"]
};

function isActiveAt(
  startsAt: string,
  endsAt: string | undefined,
  at: string
): boolean {
  return startsAt <= at && (!endsAt || endsAt >= at);
}

export function createCanonicalOffice360Source(
  getState: () => MultiBusinessEnterpriseStateV2023,
  at: string
): Office360DataSource {
  return {
    async findUserAssignments(userId): Promise<OfficeUserAssignment[]> {
      const state = getState();

      return state.staff_assignments
        .filter(row =>
          row.user_id === userId &&
          row.active &&
          isActiveAt(row.starts_at, row.ends_at, at) &&
          state.business_units.some(unit =>
            unit.id === row.business_unit_id &&
            unit.type === "office" &&
            unit.status === "active"
          )
        )
        .flatMap(row => {
          const role = ROLE_MAP[row.role_code];
          if (!role) return [];

          return [{
            userId: row.user_id,
            officeId: row.business_unit_id,
            role,
            active: true,
            permittedModules: ROLE_MODULES[role],
            assignedFarmIds: row.farm_ids
          }];
        });
    },

    async findOfficeContracts(officeId): Promise<OfficeContractSnapshot[]> {
      const state = getState();

      return state.contracts
        .filter(row => row.business_unit_id === officeId)
        .map(row => {
          const farmIds = new Set(row.linked_farm_ids);

          for (const link of state.farm_links) {
            if (
              link.business_unit_id === officeId &&
              link.contract_id === row.id &&
              link.active &&
              isActiveAt(link.starts_at, link.ends_at, at)
            ) {
              farmIds.add(link.farm_id);
            }
          }

          return {
            id: row.id,
            officeId,
            status: row.status === "active"
              ? "ACTIVE" as const
              : row.status === "draft"
                ? "DRAFT" as const
                : row.status === "expired"
                  ? "EXPIRED" as const
                  : "TERMINATED" as const,
            effectiveFrom: row.start_date.slice(0, 10),
            effectiveTo: row.end_date?.slice(0, 10),
            farmIds: [...farmIds],
            permittedModules: OFFICE360_MODULES
          };
        });
    }
  };
}

