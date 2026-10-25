# AviNexus Windows R8.1 — Programming Hotfix 1

## Scope
This hotfix corrects the five reported TypeScript/startup blockers in two files without deleting or redesigning any R8/R8.1 section.

## Corrections
1. `src/components/Header.tsx`
   - Fixed the bilingual `labelFor` helper so it uses its `language` parameter rather than an out-of-scope `uiLanguage` identifier.
   - Normalized `uiLanguage` with `NonNullable<HeaderProps['language']>`.

2. `src/components/marketplace/v197/BrokerMarketplaceV197.tsx`
   - Imported and used canonical `AvailabilityAttestationV197` and `AvailabilityStateV197` types.
   - Added explicit typed props for RequestCard, SupplierAttestation, and AttestationCard.
   - Typed attestation item state and status updates to match the managed-operations interfaces.
   - Removed loose `any` typing from attestation item iteration.

## Preservation
- R8 baseline files: 515
- Missing: 0
- Unexpected changes: 0
- Documented integration points: 13
- No Factory, Farm, Office, Customer, Partner, finance, inventory, clinical, or historical section was removed.

## Verification
- Full `npm run verify:r8.1`: PASS
- Aggregate source/regression checks: 534 passed, 0 failed
- R8.1 semantic checks: 78/78
- Targeted TypeScript contract check for Header + Broker Marketplace domain interfaces: PASS

## Remaining runtime gate
A real Vite/esbuild production build still requires dependencies on the target Windows machine. This hotfix does not falsely mark production runtime acceptance as complete.
