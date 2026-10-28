
import assert from "node:assert/strict";
import test from "node:test";

import {
  OFFICE360_MODULES,
  canAccessOffice360,
  getAvailableOffice360Modules
} from "../src/server/services/office360Scope.ts";

const context = {
  userId: "user-1",
  officeId: "office-1",
  role: "office_owner",
  permittedModules: ["sales", "reports"],
  assignedFarmIds: ["farm-1", "farm-2"],
  active: true
};

test("Office360 has 12 modules", () => {
  assert.equal(OFFICE360_MODULES.length, 12);
});

test("Authorized office can access its farm", () => {
  assert.equal(
    canAccessOffice360(
      context,
      { officeId: "office-1", farmId: "farm-1" },
      "sales"
    ),
    true
  );
});

test("Other office is blocked", () => {
  assert.equal(
    canAccessOffice360(
      context,
      { officeId: "office-2", farmId: "farm-1" },
      "sales"
    ),
    false
  );
});

test("Unassigned farm is blocked", () => {
  assert.equal(
    canAccessOffice360(
      context,
      { officeId: "office-1", farmId: "farm-99" },
      "sales"
    ),
    false
  );
});

test("Unauthorized module is blocked", () => {
  assert.equal(
    canAccessOffice360(
      context,
      { officeId: "office-1" },
      "treasury"
    ),
    false
  );
});

test("Inactive user is blocked", () => {
  assert.equal(
    canAccessOffice360(
      { ...context, active: false },
      { officeId: "office-1" },
      "sales"
    ),
    false
  );
});

test("Only permitted modules are listed", () => {
  assert.deepEqual(
    getAvailableOffice360Modules(context),
    ["sales", "reports"]
  );
});

test("Missing identity is blocked", () => {
  assert.equal(
    canAccessOffice360(
      { ...context, userId: "" },
      { officeId: "office-1" },
      "sales"
    ),
    false
  );
});

