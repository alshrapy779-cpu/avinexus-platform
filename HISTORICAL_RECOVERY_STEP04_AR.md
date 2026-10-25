# Historical Recovery Step 04 — NOT PRODUCTION CERTIFIED

## Source modifications
- R7 network now has a Contracted Office 360 read-only projection using exact `office_id` contract links and original farm/house/flock/person records. No duplicate ledgers or farm registrations.
- Financial document display is limited to records carrying explicit office/farm link fields. Does not certify server-side tenancy.
- Offer edits append price_change_history snapshots with previous/next values, actor and timestamp. Existing offers remain compatible through optional history field.
- Automatic legacy contract linking no longer uses partial name matching; exact unique office-name matches only.

## Unresolved production blockers
- Server-side RBAC/tenant authorization for Office 360 and all APIs remains unverified; do not expose this page to real contracted office users.
- Client state update persistence, append-only server-side immutable audit, migration and restart persistence not certified.
- Bank accounts, receipt/payment vouchers, office treasury reconciliation and multicurrency posting still require integration with canonical Section 12.
- Office employee assignment authentication, owner approvals, signed contract permissions and invoices linkage require E2E testing.
- Windows npm dependencies absent; build and visible tests not run.

## Tests
- `node scripts/v20.2.9-r8.1/semantic-test.cjs`: 78/78 passing.
- ZIP CRC verification performed separately.
