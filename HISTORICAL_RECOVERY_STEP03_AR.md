# AviNexus R8.1 — Historical Recovery Step 03 (UNCERTIFIED)

## Implemented in existing R7 network workspace
- Restored add/edit/save controls for supplier/partner branches with company ownership and governorate assignment.
- Added a non-destructive governorate append control.
- Restored add/edit/save controls for catalog offers including chick, feed, medicine, vaccine and other categories.
- Currency selector explicitly includes SAR, USD, YER_NEW and YER_OLD.
- Preserved all existing components, records and legacy files in the source tree.

## Known limitations — release blockers
- These changes use the existing onBusinessChange state update path; central server-side transaction persistence and role authorization have NOT been certified.
- Price edits currently replace the current offer in the state rather than producing a versioned immutable price-history record. DO NOT use this candidate for financial/production data.
- Office contract-scoped isolation, automatic farm assignment, accounting/treasury integration, historical bank operations and separation of marketing companies remain unverified or incomplete.
- Target Windows install/build, browser E2E tests, multi-role acceptance, offline sync and printing have NOT been performed.
- Original baseline ZIP remains untouched.

## Tests
- R8.1 source semantic test: 78 checks, 0 failed. This is not proof of runtime behavior.
