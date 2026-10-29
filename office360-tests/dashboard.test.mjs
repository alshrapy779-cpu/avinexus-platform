
import test from "node:test";
import assert from "node:assert/strict";

import {
  buildOffice360Dashboard
} from "../src/server/services/office360Dashboard.ts";

function fixture() {
  const state = {
    business_units: [
      {
        id: "office-A",
        code: "OA",
        name: "مكتب أ",
        type: "office",
        status: "active"
      },
      {
        id: "office-B",
        code: "OB",
        name: "مكتب ب",
        type: "office",
        status: "active"
      }
    ],
    contracts: [
      {
        id: "contract-A",
        business_unit_id: "office-A",
        status: "active",
        start_date: "2026-01-01",
        end_date: "2026-12-31",
        linked_farm_ids: ["farm-A"]
      },
      {
        id: "contract-B",
        business_unit_id: "office-B",
        status: "active",
        start_date: "2026-01-01",
        linked_farm_ids: ["farm-B"]
      }
    ],
    farm_links: [],
    customers: [
      {
        business_unit_id: "office-A",
        linked_farm_ids: ["farm-A"]
      },
      {
        business_unit_id: "office-B",
        linked_farm_ids: ["farm-B"]
      }
    ],
    suppliers: [
      { business_unit_id: "office-A" },
      { business_unit_id: "office-B" }
    ],
    exceptions: [
      {
        id: "alert-A",
        business_unit_id: "office-A",
        type: "low_stock",
        status: "open",
        exception_number: "EX-A",
        opened_at: "2026-10-20T09:00:00Z"
      },
      {
        id: "alert-B",
        business_unit_id: "office-B",
        type: "low_stock",
        status: "open",
        exception_number: "EX-B",
        opened_at: "2026-10-20T09:00:00Z"
      }
    ]
  };

  const workspace = {
    officeId: "office-A",
    userId: "user-A",
    role: "office_manager",
    contractIds: ["contract-A"],
    farmIds: ["farm-A", "farm-B"],
    modules: ["contacts", "reports"],
    accessContext: {
      userId: "user-A",
      officeId: "office-A",
      active: true
    }
  };

  return { state, workspace };
}

const at = "2026-10-29T10:00:00Z";

test("Dashboard identifies correct office", () => {
  const { state, workspace } = fixture();
  const result = buildOffice360Dashboard(
    state, workspace, at
  );

  assert.equal(result.office.id, "office-A");
});

test("Other office data is isolated", () => {
  const { state, workspace } = fixture();
  const result = buildOffice360Dashboard(
    state, workspace, at
  );

  assert.equal(result.summary.customers, 1);
  assert.equal(result.summary.suppliers, 1);
  assert.equal(result.summary.openAlerts, 1);
  assert.equal(
    result.recentOperations[0].reference,
    "EX-A"
  );
});

test("Only contracted farms are counted", () => {
  const { state, workspace } = fixture();
  const result = buildOffice360Dashboard(
    state, workspace, at
  );

  assert.equal(result.summary.assignedFarms, 1);
});

test("No contact permission hides counts", () => {
  const { state, workspace } = fixture();
  workspace.modules = ["reports"];

  const result = buildOffice360Dashboard(
    state, workspace, at
  );

  assert.equal(result.summary.customers, null);
  assert.equal(result.summary.suppliers, null);
});

test("No report permission hides alerts", () => {
  const { state, workspace } = fixture();
  workspace.modules = ["contacts"];

  const result = buildOffice360Dashboard(
    state, workspace, at
  );

  assert.equal(result.summary.openAlerts, null);
  assert.deepEqual(result.recentOperations, []);
});

test("Financial values are never invented", () => {
  const { state, workspace } = fixture();
  const result = buildOffice360Dashboard(
    state, workspace, at
  );

  assert.equal(result.finance.balances, null);
  assert.equal(result.finance.profitLoss, null);
  assert.equal(result.inventory.stockBalances, null);
});

test("Inactive office is rejected", () => {
  const { state, workspace } = fixture();
  state.business_units[0].status = "suspended";

  assert.throws(
    () => buildOffice360Dashboard(
      state, workspace, at
    ),
    /office360_office_not_active/
  );
});

test("Mismatched identity is rejected", () => {
  const { state, workspace } = fixture();
  workspace.accessContext.userId = "other-user";

  assert.throws(
    () => buildOffice360Dashboard(
      state, workspace, at
    ),
    /office360_invalid_workspace/
  );
});

