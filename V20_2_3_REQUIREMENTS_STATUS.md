# V20.2.3 REQUIREMENTS STATUS

Release: **V20.2.3 – Multi-Business Enterprise Operations**  
Baseline: **V20.2.2 – Veterinary & Field Operations**  
Platform priority: **Windows/Web first; Android remains deferred**.

Status meanings: `DONE` = implemented and exercised at the applicable layers in this release. `PARTIAL` = useful implementation exists, but one or more planned enterprise layers remain for a later release. `DEFERRED` = deliberately assigned to a later roadmap release, not forgotten.

| Requirement | Status | Current implementation / remaining work |
|---|---|---|
| Preservation of V8–V20.2.2 | DONE | Automated V20.2.2 file/API/export baseline comparison passes. |
| Business Unit model | DONE | Platform HQ, office, managed company, feed factory, warehouse unit and specialist office types supported. |
| Multi-office hierarchy | DONE | Parent business unit supported; business-unit scope and cost center included. |
| Business contracts | PARTIAL | Contract, services, linked farms, dates, commission, approval limit and expense responsibility rules exist. Full contract-document lifecycle/e-signature remains later. |
| Staff/doctor/accountant assignments by office | DONE | Data model, API and Windows UI exist with business unit/role/farm/warehouse scope. |
| Existing farm linkage | DONE | Existing farms are linked to offices/business units without rebuilding the farm model. |
| Veterinary/office integration | PARTIAL | Office dashboard derives open/critical veterinary cases from linked farms; full office-specific veterinary analytics continues in later iterations. |
| Customer 360 | PARTIAL | Profile, linked farms, credit terms, invoices, receipts, ledger and statement implemented. Booking/service aggregation remains to be unified later. |
| Supplier 360 | PARTIAL | Profile, supplied categories, PO/invoices/payments, ledger and statement implemented. Supplier scorecards/quotations remain later. |
| Shared Product Master | DONE | Medicine/vaccine/feed/chicks/equipment/farm supply/raw material/finished feed/service categories implemented. |
| Multi-warehouse | DONE | Warehouse ownership and stock ledger implemented. |
| Stock units kg/bag/ton | DONE | Base-unit storage with kg/ton/bag display conversion and bag weight. |
| Stock transfers | DONE | Request → dispatch → receive semantics, API and UI implemented. |
| Negative-stock control | DONE | Configurable negative-stock prevention is validated in inventory/sales flow. |
| Procurement foundation | DONE | PO → receiving → purchase invoice → inventory/AP/journal implemented. |
| Receiving variance | DONE | Ordered/received/accepted/damaged/rejected/shortage captured and exceptions opened. |
| Sales end-to-end | DONE | Invoice → stock issue → customer ledger → AR/cash → revenue + COGS journals implemented. |
| Cash / credit sales | DONE | Both supported; cash requires treasury account. |
| Customer credit control | PARTIAL | Limit breach opens a high-severity exception and transaction remains auditable. Approval routing to V20.2.1 approval engine is the next integration step. |
| Customer receipts | DONE | Receipt voucher, treasury inflow, customer ledger, AR journal and invoice allocation implemented. |
| Supplier payments | DONE | Payment voucher, treasury outflow, supplier ledger, AP journal and invoice allocation implemented. |
| Treasury accounts | DONE | Cashbox/bank/transfer account types and balances implemented. |
| SAR / USD / YER OLD / YER NEW | PARTIAL | Domain/API retain transaction currency and FX rate; advanced rate approval/revaluation UI remains later. |
| Double-entry integration | DONE | Reuses V20.2 accounting engine; generated journals are balanced and source-linked. |
| Business-unit cost centers | DONE | One operational cost center is provisioned for each business unit. |
| Business-unit financial summary | DONE | Revenue, expense, P/L, asset/liability movement and journal count implemented. |
| Full accounting suite | PARTIAL | GL/source posting foundation works; reconciliation, budgets, formal period closing and broader AP/AR aging remain planned. |
| Platform dashboard | PARTIAL | Multi-business aggregation implemented; richer executive analytics/report scheduling remains later. |
| Office/business-unit dashboard | PARTIAL | Farms, customers, suppliers, warehouses, sales, AR/AP, inventory, low stock, treasury, exceptions and veterinary cases implemented. More role-specific widgets remain later. |
| Exceptions Center | PARTIAL | Credit-limit and receiving variance events implemented. Overdue/contract/medical/report/expense rules remain extensible and will expand. |
| Factory Business Unit / Factory Profile | DONE | Factory entity, manager/accountant references and warehouse links implemented. |
| Raw-material master | DONE | Corn, soy, premix, mycotoxin binder, salt, calcium, alfalfa, bran and oil supplied as starting master data; new materials can be added. |
| Nutrient Profile foundation | DONE | Protein, ME, calcium, phosphorus, fiber, moisture and bag weight fields supported; UI/API update supported. |
| Starter / Grower / Finisher master | DONE | بادي / نامي / ناهي definitions included. |
| Formula engine | DEFERRED | V20.2.4. |
| Manufacturing orders | DEFERRED | V20.2.4. |
| Protein/energy/calcium formula calculation | DEFERRED | V20.2.4; nutrient foundation is already present. |
| Production yield/loss | DEFERRED | V20.2.4. |
| Finished-goods manufacturing posting | DEFERRED | V20.2.4. |
| Evidence/document integration | PARTIAL | Receiving evidence references and inherited evidence infrastructure are used; unified enterprise document center continues later. |
| Audit trail | DONE | New V20.2.3 domain writes create audit events. |
| Authentication/RBAC/scopes | PARTIAL | V20.2.1 bearer authentication and business-unit assignment checks are used by V20.2.3 APIs. Remaining older-route migration is still part of platform hardening. |
| Localization | PARTIAL | Existing localization foundation preserved; new workspace is currently mixed Arabic/English by design until localization keys are fully migrated. |
| End-to-end semantic test | DONE | Office/farm/procurement/receiving/sales/finance/transfer/factory foundation scenario passes. |
| Previous semantic regressions | DONE | V20.2.1 and V20.2.2 semantic tests continue to pass. |
| Production build | PARTIAL | New domain module and new UI compile checks pass independently. Full npm/Vite production build cannot be certified in this execution environment because `node_modules` is absent. |

## Release assessment
V20.2.3 is a **working enterprise expansion increment**, not a claim that the entire final platform is production-finished. Its key achievement is that office/business-unit, farm, customer, supplier, inventory, commercial and accounting data now participate in one connected operating flow instead of being isolated screens.

The next planned release is **V20.2.4 – Feed Factory, Procurement & Inventory Expansion**, while all accepted older backlog items remain preserved in the master roadmap.
