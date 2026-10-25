# V20.2.4 REQUIREMENTS STATUS

Status vocabulary: **DONE / PARTIAL / DEFERRED**. A visible screen alone is not considered DONE.

| Capability | Status | Evidence / limitation |
|---|---|---|
| Feed formula data model + versioning | DONE | Formula code/version, superseding and immutable approved-history behavior implemented. |
| Protein / ME / calcium calculation | DONE | Weighted calculation from editable raw-material nutrient profiles. |
| Formula target validation | DONE | Weight + required nutrient profiles + target tolerances enforced before approval. |
| Formula Review / Approval workflow | DONE | Draft → in_review → approved, prior approved version superseded. |
| Starter / Grower / Finisher support | DONE | Uses V20.2.3 feed product types and permits future types. |
| Purchase requisition | DONE | Data model, workflow, API and UI foundation. |
| Supplier RFQ / quote / award | DONE | Multiple quote records and award state supported. |
| Awarded quote → automatic PO | PARTIAL | Existing PO engine is preserved; automatic conversion is not yet closed. |
| Raw-material receiving and variance | DONE | Preserved V20.2.3 PO/GRN/shortage-damage-rejection workflow and integrated with factory stock. |
| Manufacturing order | DONE | Create, approve/reserve, start/issue, complete. |
| Material reservation | DONE | Inventory reservation/release ledger implemented. |
| Actual material issue | DONE | Physical stock check, actual quantity issue and WIP posting. |
| Material usage variance analytics | PARTIAL | Planned/issued quantities are retained; richer exception thresholds/reporting remain. |
| Production start / finish | DONE | Start/completion timestamps and supervisor fields. |
| Finished batch / lot | DONE | ProductionBatch with lot, formula, factory, warehouse, quantity and unit cost. |
| Bags / kg / tons | DONE | kg is canonical inventory basis; bags/loose quantity are derived; tons are derived by inventory display. |
| Yield / loss | DONE | kg and % calculations with abnormal-loss exception. |
| Production costing | DONE | Materials + direct labour + allocated overhead → cost/kg and cost/bag. |
| Advanced cost allocation | PARTIAL | Core direct/allocated costing is implemented; advanced burden drivers remain future work. |
| Finished-goods inventory | DONE | Manufacturing completion posts a receipt to the finished-goods warehouse. |
| Factory dispatch | DONE | Draft → approved → dispatched → receiving confirmation. |
| Dispatch shortage / damage | DONE | Destination variance and financial/operational exception handling. |
| Office/warehouse receiving | DONE | Accepted quantity goes to destination stock ledger. |
| Farm feed consumption | DONE | Linked farm/flock consumption reduces stock and posts feed cost to the farm cost centre. |
| Direct factory sales | PARTIAL | Existing V20.2.3 sales engine can sell stocked product; a dedicated factory-sales shortcut is not added. |
| Factory dashboard | DONE | Operational dashboard and Windows workspace tabs implemented. |
| Production cost report | DONE | Report rows generated from completed manufacturing orders. |
| Full factory report catalogue | PARTIAL | Production-cost/dashboard reports exist; broader scheduled/BI catalogue remains V20.2.6. |
| Finance integration | DONE | WIP, raw materials, finished goods, variance and farm feed journals are balanced. |
| V20.2.4 API | DONE | 19 new V20.2.4 routes; baseline routes preserved. |
| Business-unit scope | DONE | V20.2.4 endpoints use signed auth and business-unit scope checks where applicable. |
| Audit trail | DONE | Formula, procurement, manufacturing, dispatch and consumption operations audited. |
| Windows/Web UI | DONE | Factory workspace integrated into Enterprise Web Workspace. |
| Production dependency build | PARTIAL | Source syntax and semantic checks pass; full Vite/npm production build not executed because node_modules/vite are absent in this environment. |
| Preservation V8–V20.2.3 | DONE | V20.2.3 baseline preservation check passes. |
| Upgrade / rollback | DONE | Upgrade package includes baseline hash guard, backup and rollback; simulation report included. |

## Overall release status
**FUNCTIONALLY IMPLEMENTED / NOT YET PRODUCTION-HARDENED.** V20.2.4 completes the factory manufacturing operating loop at application/domain level. Production deployment certification remains scheduled for the hardening phase.
