# AviNexus R8.1 — Historical Recovery: First Verified Increment

Status: PARTIAL RESTORATION / NOT PRODUCTION CERTIFIED.

Protected input: R8.1 Programming Hotfix 2 AI (original ZIP not modified).

## Actual code change
- `src/components/home/HomeDashboard.tsx`: restored a direct **Managed Farms** entry card to the existing `managed` AppView. The view, state and ManagedOperationsWorkspaceV197 were already wired in App.tsx. No new domain model, database migration, API or data rewrite was introduced.
- All other original files retained byte-for-byte.

## Historical code presence
- `src/components/admin/v196/FinancialCommandCenterV196.tsx`: PRESENT
- `src/components/admin/SalesSettlementRoutingV17Tab.tsx`: PRESENT
- `src/components/farmer/CustomerTradingV17.tsx`: PRESENT
- `src/components/marketplace/MarketplaceView.tsx`: PRESENT
- `src/modules/managed/ManagedPoultryOperationsV19_7.ts`: PRESENT
- `src/components/managed/ManagedOperationsWorkspaceV19_7.tsx`: NOT FOUND AT THIS PATH

## Outstanding functional deficits (not restored)
- Historical office vs marketing-company separation and per-contract scoped office workspace, treasury and financial approvals.
- Four-currency completeness (the V19.5 CurrencyV195 type currently contains SAR/YER_OLD/YER_NEW, not USD). No unsafe currency/ledger migration performed.
- Chick pricing management, editable company/branch/governorate master, rental-house workflow, bank remittance, and business-action integration: require end-to-end test and scoped repairs.
- 399 Windows screen acceptances, centralized multi-user persistence, role isolation, printing and real Gemini integration are unverified.
- Source presence is not proof that a feature is accessible, authorized, persisted, or working.

## Preservation criteria
- No deletions or modifications outside HomeDashboard.tsx in this incremental package.
- Original archive untouched. Do not install over live data.
