
import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveOffice360Workspace,
  resolveOffice360Workspaces
} from "../src/server/services/office360Resolver.ts";

const date = "2026-10-29";

const assignment = {
  userId: "user-A",
  officeId: "office-A",
  role: "office_owner",
  active: true,
  permittedModules: [
    "sales",
    "contacts",
    "reports"
  ],
  assignedFarmIds: [
    "farm-1",
    "farm-2",
    "farm-outside"
  ]
};

const contract = {
  id: "contract-A",
  officeId: "office-A",
  status: "ACTIVE",
  effectiveFrom: "2026-01-01",
  effectiveTo: "2026-12-31",
  farmIds: ["farm-1", "farm-2"],
  permittedModules: [
    "sales",
    "reports"
  ]
};

function createSource(
  assignments = [assignment],
  contracts = [contract]
) {
  return {
    async findUserAssignments(userId) {
      return assignments.filter(
        item => item.userId === userId
      );
    },

    async findOfficeContracts(officeId) {
      return contracts.filter(
        item => item.officeId === officeId
      );
    }
  };
}

test("Authorized user opens own office", async () => {
  const workspace = await resolveOffice360Workspace(
    "user-A",
    "office-A",
    createSource(),
    date
  );

  assert.equal(workspace?.officeId, "office-A");
});

test("Other user cannot open office", async () => {
  const workspace = await resolveOffice360Workspace(
    "user-B",
    "office-A",
    createSource(),
    date
  );

  assert.equal(workspace, null);
});

test("Other office is not accessible", async () => {
  const workspace = await resolveOffice360Workspace(
    "user-A",
    "office-B",
    createSource(),
    date
  );

  assert.equal(workspace, null);
});

test("Only contracted farms are returned", async () => {
  const workspace = await resolveOffice360Workspace(
    "user-A",
    "office-A",
    createSource(),
    date
  );

  assert.deepEqual(
    workspace?.farmIds,
    ["farm-1", "farm-2"]
  );
});

test("Only contracted and permitted modules", async () => {
  const workspace = await resolveOffice360Workspace(
    "user-A",
    "office-A",
    createSource(),
    date
  );

  assert.deepEqual(
    workspace?.modules,
    ["sales", "reports"]
  );
});

test("Suspended contract denies workspace", async () => {
  const source = createSource(
    [assignment],
    [{ ...contract, status: "SUSPENDED" }]
  );

  const workspace = await resolveOffice360Workspace(
    "user-A",
    "office-A",
    source,
    date
  );

  assert.equal(workspace, null);
});

test("Inactive assignment denies workspace", async () => {
  const source = createSource([
    { ...assignment, active: false }
  ]);

  const workspaces = await resolveOffice360Workspaces(
    "user-A",
    source,
    date
  );

  assert.deepEqual(workspaces, []);
});

test("Duplicate assignments fail closed", async () => {
  const source = createSource([
    assignment,
    { ...assignment }
  ]);

  await assert.rejects(
    resolveOffice360Workspaces(
      "user-A",
      source,
      date
    ),
    /duplicate_office_assignment/
  );
});

test("Invalid user identity is rejected", async () => {
  await assert.rejects(
    resolveOffice360Workspaces(
      " ",
      createSource(),
      date
    ),
    /invalid_identifier/
  );
});

test("Database failure is not treated as empty", async () => {
  const source = {
    async findUserAssignments() {
      throw new Error("database_unavailable");
    },
    async findOfficeContracts() {
      return [];
    }
  };

  await assert.rejects(
    resolveOffice360Workspaces(
      "user-A",
      source,
      date
    ),
    /database_unavailable/
  );
});

