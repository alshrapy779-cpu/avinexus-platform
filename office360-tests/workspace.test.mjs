
import assert from "node:assert/strict";
import test from "node:test";

import {
  buildOfficeWorkspace,
  isContractEffective
} from "../src/server/services/office360Workspace.ts";

import {
  canAccessOffice360
} from "../src/server/services/office360Scope.ts";

const today = "2026-10-29";

const assignment = {
  userId: "doctor-1",
  officeId: "office-A",
  role: "veterinarian",
  active: true,
  permittedModules: [
    "medicines",
    "reports",
    "treasury"
  ],
  assignedFarmIds: [
    "farm-1",
    "farm-2",
    "farm-999"
  ]
};

const contract = {
  id: "contract-1",
  officeId: "office-A",
  status: "ACTIVE",
  effectiveFrom: "2026-01-01",
  effectiveTo: "2026-12-31",
  farmIds: ["farm-1", "farm-2"],
  permittedModules: [
    "medicines",
    "reports",
    "contacts"
  ]
};

test("Active contract is effective", () => {
  assert.equal(
    isContractEffective(contract, today),
    true
  );
});

test("Expired contract is blocked", () => {
  assert.equal(
    isContractEffective(
      { ...contract, effectiveTo: "2026-01-31" },
      today
    ),
    false
  );
});

test("Suspended contract is blocked", () => {
  assert.equal(
    isContractEffective(
      { ...contract, status: "SUSPENDED" },
      today
    ),
    false
  );
});

test("Other office contract is excluded", () => {
  assert.equal(
    buildOfficeWorkspace(
      assignment,
      [{ ...contract, officeId: "office-B" }],
      today
    ),
    null
  );
});

test("Workspace contains only contracted farms", () => {
  const workspace = buildOfficeWorkspace(
    assignment,
    [contract],
    today
  );

  assert.deepEqual(
    workspace?.farmIds,
    ["farm-1", "farm-2"]
  );
});

test("Modules require both permissions", () => {
  const workspace = buildOfficeWorkspace(
    assignment,
    [contract],
    today
  );

  assert.deepEqual(
    workspace?.modules,
    ["medicines", "reports"]
  );
});

test("Unassigned farm cannot be accessed", () => {
  const workspace = buildOfficeWorkspace(
    assignment,
    [contract],
    today
  );

  assert.equal(
    canAccessOffice360(
      workspace.accessContext,
      {
        officeId: "office-A",
        farmId: "farm-999"
      },
      "medicines"
    ),
    false
  );
});

test("Inactive user cannot open workspace", () => {
  assert.equal(
    buildOfficeWorkspace(
      { ...assignment, active: false },
      [contract],
      today
    ),
    null
  );
});

test("Draft contract does not grant access", () => {
  assert.equal(
    buildOfficeWorkspace(
      assignment,
      [{ ...contract, status: "DRAFT" }],
      today
    ),
    null
  );
});

test("Contract does not grant extra modules", () => {
  const workspace = buildOfficeWorkspace(
    assignment,
    [contract],
    today
  );

  assert.equal(
    canAccessOffice360(
      workspace.accessContext,
      { officeId: "office-A" },
      "treasury"
    ),
    false
  );
});

