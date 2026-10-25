# AviNexus Historical Recovery Step 07 — Inventory balance query

## Implemented
- Read-only deterministic Section 7 inventory balance calculator.
- Opening, incoming, outgoing, closing for a date range, business unit and optional warehouse/product.
- Reservation and release events excluded from actual inventory consumption.
- Rejects duplicate movement IDs, invalid quantities, unsupported movement kinds and malformed date windows.
- Authenticated GET `/api/v20.2.3/inventory/balance` guarded by existing `businessOr403V2023` server scope policy.
- Uses canonical `multi_business_v20_2_3.inventory_movements`, does not modify database or accounting journals.

Example: GET /api/v20.2.3/inventory/balance?business_unit_id=OFFICE_ID&from=2026-10-01&to=2026-10-19&warehouse_id=WAREHOUSE_ID

## Explicit limitations
- This is quantity reconciliation only, not financial balances, costs, receivables, treasury or FX.
- Not yet wired into AI chat UI, Excel export or live Windows acceptance.
- Scope protection depends on existing V20.2.3 auth middleware; cross-tenant end-to-end penetration testing pending.
- npm dependencies absent in execution environment, so production build/typecheck cannot be certified.
- No database migrations and no original files deleted.

## Validation
- 4/4 focused source checks.
- 78/78 R8.1 source semantic checks.
- Windows startup, database persistence and UI tests NOT run.
