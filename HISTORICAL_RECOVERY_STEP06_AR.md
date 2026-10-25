# AviNexus Historical Recovery — Step 06 (UNCERTIFIED)

## Implemented
- Added a read-only authenticated `GET /api/v20.2.3/contracted-office/:officeId/workspace` endpoint.
- Endpoint checks existing V20.2.3 business-unit read authorization, returns no-store, rejects non-office/inactive records.
- Workspace derives active contracts, linked farms, assignments, customers, treasury account *metadata*, and financial documents/invoices from canonical V20.2.3 state.
- Uses exact IDs and effective dates; no matching by name. Separate business-unit IDs prevent mixing marketing companies, suppliers and offices.
- Does not create a second ledger or mutate any business/financial records. Four currency codes are exposed as supported codes, not a claim that FX reconciliation is complete.

## Verification
- Existing R8.1 semantic source tests: 78/78 PASS.
- Isolated runtime projection test: office A excludes office B data; unknown office rejected.
- ZIP integrity verified.

## Limitations / blockers
- Existing `businessAccessV2023` allows executive/finance global roles; verify least-privilege rules against actual organization hierarchy before production.
- Endpoint not yet connected to Office 360 UI, and is not a substitute for server-side authorization of every other endpoint.
- Canonical office state is legacy enterprise state; full relational DB migration, durable price versioning, S12 reconciliation, and edit/save workflows remain unimplemented.
- No real Windows build/startup/printing/persistence-after-restart acceptance was performed.
- Do not install over production or live data.
