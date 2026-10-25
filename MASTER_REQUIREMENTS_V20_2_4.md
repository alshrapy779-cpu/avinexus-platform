# MASTER REQUIREMENTS — V20.2.4

## Release
**Smart Poultry Platform V20.2.4 — Feed Factory, Procurement & Inventory Expansion**

## Baseline
V20.2.3 — Multi-Business Enterprise Operations.

## Platform direction
Windows/Web remains the reference operational platform. Android remains deferred until Windows/Web production hardening is completed.

## Preservation Contract
All accepted features, APIs, farms, flock ledgers, veterinary workflows, marketplace, marketing, bookings, sales, business units, customers, suppliers, finance, warehouses, legacy modules and reports from V8 through V20.2.3 must remain available unless an explicitly approved migration replaces them with rollback protection.

## Required capabilities
1. Versioned feed formulas for Starter/Grower/Finisher and future feed types.
2. Raw-material nutrient profiles with editable protein, metabolizable energy, calcium and supporting nutrients.
3. Formula calculation and validation against target protein/ME/calcium tolerances.
4. Draft → Review → Approved formula lifecycle; approved history cannot be silently overwritten.
5. Purchase requisition → approval → supplier quote/RFQ → award foundation.
6. Manufacturing order lifecycle: draft → approved/reserved → in production → completed.
7. Raw-material reservation and actual issue from the factory raw-material warehouse.
8. Actual-vs-planned raw-material quantities and auditable manufacturing records.
9. Production start/completion timestamps and supervisor attribution.
10. Finished output in kg, derived bags and tonnes, with lot/batch traceability.
11. Yield, loss and production-variance calculation with exception generation.
12. Production costing from material cost + direct labour + allocated overhead.
13. Finished-goods inventory receipt into the factory finished-goods warehouse.
14. Factory dispatch → in transit → destination receiving confirmation.
15. Shortage/damage variance at destination with stock/finance exception handling.
16. Farm feed consumption tied to office/business unit, farm/flock, stock ledger and farm cost centre.
17. Factory dashboard covering formulas, orders, output, yield, raw stock, finished stock, batches, exceptions and dispatches.
18. Production cost report.
19. Balanced double-entry postings for material issue, finished production, dispatch variance and farm feed consumption.
20. RBAC/business-unit scope protection on V20.2.4 APIs using the V20.2.1 authentication foundation.
21. Full audit trail for V20.2.4 factory actions.
22. Preservation and rollback-safe upgrade from V20.2.3.

## Acceptance flow
Raw-material PO/receiving → raw inventory → requisition/RFQ → approved formula → manufacturing order → reserve/issue materials → production completion → yield/loss/cost → finished stock → factory dispatch → office receipt with variance → farm feed consumption → balanced finance postings → dashboard/report → audit/validation.

## Deferred / next layers
- Automatic conversion of an awarded supplier quote into a purchase order with full three-way matching.
- Advanced quality-control laboratory acceptance for raw materials.
- Advanced least-cost formulation/optimization solver.
- Full stock coverage forecasting by farm demand.
- HR/payroll/workforce completion (V20.2.5).
- Executive BI and full scheduled reporting (V20.2.6).
- Production deployment hardening and final production build (V20.2.7).
