# V20.2.8 REQUIREMENTS STATUS

Release: **V20.2.8 — Department Isolation & Data Restoration**  
Baseline: **V20.2.7**  
Rule: V8–V20.2.7 is preserved; V20.2.8 is additive.

## Corrective requirements requested after V20.2.7

| Requirement | Status | Implementation |
|---|---|---|
| Remove `صباح الخير` | DONE | Time-of-day greeting removed from HomeDashboard. |
| Stop mixing departments in one working screen | DONE for corrective workspace | New V20.2.8 department control center provides separate screens for factory, offices, materials, suppliers, customers, sales, transfers, receipts/payments, accounting/profit, FX, banking, marketing, partner directory and timeline. Legacy screens remain preserved. |
| Explicit factory selection | DONE | Factory is never silently selected in V20.2.8; user selects the factory explicitly. |
| Factory dashboard | DONE / expanded | Factory identity, warehouses, open orders, production, finished inventory, exceptions, direct factory sales and production dates are shown together. |
| Cost per bag | DONE | Preserved from V20.2.4 and surfaced in factory cost report. |
| Cost per ton | DONE | Derived from canonical cost/kg (`cost_per_kg × 1000`) and surfaced next to cost/kg and cost/bag. |
| Materials | DONE / surfaced | Raw-material definitions, nutrient data and shared product master are in a dedicated screen. |
| Suppliers | DONE / dedicated | Dedicated supplier registration/listing, balance and dates per selected business/factory context. |
| Customers | DONE / dedicated | Dedicated customer registration/listing, credit data, balance and dates. |
| Sales | DONE / dedicated | Dedicated sales entry and full sales ledger with date, time, currency, FX, paid/balance and actor. Factory sales no longer require the marketing screen. |
| Transfers / movements | DONE / visibility | Treasury movements and stock transfers are separated and date/time-visible. |
| Receipts and payments | DONE / dedicated | Customer receipt and supplier payment actions plus complete receipt/payment voucher history. |
| Profit / accounting | DONE / dedicated summary | Business-unit revenue, expenses, P/L, asset/liability movement, journals and counterparty balances. |
| Currencies / exchange-rate dashboard | DONE | SAR base plus USD, YER_OLD and YER_NEW approval UI and full approved-rate history. |
| Bank-account management | DONE | Bank/cashbox/transfer accounts support bank, beneficiary, account number, IBAN/wallet, currency, customer visibility and transfer/withdrawal instructions. |
| Bank instructions visible to customers | DONE | Customer portal displays only accounts explicitly marked `customer_visible`. |
| Marketing separated from sales | DONE | Marketing screen is informational/marketing-only; commercial posting stays in Sales/Factory workflows. |
| Chicks/feed/equipment companies display-only directory | DONE | V19.5 supplier/company data reused; shows commission, contacts, categories, branches, addresses and phones without turning the directory into sales posting. |
| Dates across operational movement | DONE for primary commercial/treasury/factory flows | Unified timeline surfaces sale, receipt, treasury in/out, stock transfer and manufacturing timestamps. Existing source timestamps are preserved. |
| V17/V19 preservation | DONE | V17 core files/routes remain and V20.2.7 baseline preservation passes with zero missing baseline files. |
| Global 90% completeness target per department | ACTIVE GATE — NOT CLAIMED COMPLETE | This release corrects the identified structural/data-visibility gaps. The platform must not be called 90% complete globally until every role/department passes its own field-by-field DoD audit. |
| Full dependency-backed production build | NOT CERTIFIED HERE | Source-level checks show no new local TypeScript diagnostics in modified V20.2.8 files, but external React/Vite/Express dependencies are absent from this execution environment. |

## Definition of Done from V20.2.8 forward
A department is not `DONE` because a route or data model exists. It must have: **identity/scope → complete data fields → dedicated UI → actions → dates/times → accounting/stock effects where applicable → audit → reports → role visibility → tests → preservation**.
