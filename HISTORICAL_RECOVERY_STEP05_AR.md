# AviNexus Historical Recovery — Step 05 (UNCERTIFIED)

## Implemented
- Added a fail-closed, read-only contracted-office projection in `src/modules/v20/OfficeContractScopeRecovery.ts`.
- Only active contracts with exact `office_id` expose their linked farms, assignments, and financial document references.
- Rejects a requested office not included in the server-supplied allowed-office set; no fuzzy name matches.
- No parallel ledger, new inventory owner, or destructive migration.

## Verified
- Runtime isolation scenario: allowed office sees its own farm/assignment/document; other office and cancelled-contract data excluded.
- Unauthorized office rejected.
- Existing R8.1 semantic checks: 78/78 pass.

## NOT YET IMPLEMENTED / NOT CERTIFIED
- Server authentication and assignment-derived allowed-office resolution for the new projection.
- Wiring the new projection into actual Office 360 API and UI.
- Server-side durable price history, bank accounts, S12 posting/reconciliation, migration, and full CRUD.
- Real Windows build, UI acceptance, printing, and persistence-after-restart.

Do not install over production or import live financial records.
