# Farm Windows R6 — Responsibility Matrix

| Role | Primary responsibility | Main input | Required output / handoff | Restricted from |
|---|---|---|---|---|
| Executive | Portfolio governance and critical exceptions | Manager, veterinary and finance dashboards | strategic approval/escalation | silently rewriting field records; prescribing instead of vet |
| Regional Manager | Multi-farm operational control | farm dashboards/alerts | corrective direction to farm manager | medical override; Section 12 override |
| Farm Owner | Own-farm status, permitted approvals and funding | farm/financial summaries | approval/rejection/funding | clinical edits; direct GL posting |
| Farm Manager | Connect field, health, supply and finance | worker/supervisor/vet/inventory inputs | tasks, approvals, purchase needs, escalation | prescribing medicine; GL posting |
| Supervisor | Validate field daily close | worker entry/evidence | reviewed close/correction/escalation | unapproved treatment; accounting approval |
| Worker | Capture daily reality and execute plan | approved daily plan | daily close/evidence/execution status | choosing medicine; modifying closed day |
| Veterinarian | Final clinical decision | daily close, AI flags, lab history | treatment/vaccine/lab order/tomorrow plan | accounting posting |
| Consultant | Advisory clinical review | escalated case/lab data | documented recommendation to veterinarian | replacing vet authorization |
| Vet Assistant | Execute delegated veterinary work | vet order | execution evidence / sample custody | diagnosis or changing dose |
| Lab Technician | Sample custody/testing/review | sample + request | versioned reviewed result to veterinarian | changing treatment directly |
| Accountant | Farm operational financial documents and cost | PO/GRN/claims/revenue references | documents + S12 integration | parallel ledger; S7 inventory posting |
| Inventory Support | Supply and stock execution | approved requirement / PO | Section 7 movement/receipt reference | direct GL entry |
| Supplier | Confirm availability/delivery | PO | confirmation, delivery and supplier invoice | other-farm data |
| Commercial | Market/readiness interface | weight, withdrawal, market data | readiness/sale request | bypassing withdrawal restrictions |
| Support | Technical assistance | support ticket | fix/escalation | medical/financial data alteration |

## Critical handoffs
- Worker → Supervisor: daily close review.
- Supervisor/Manager → AI/Veterinarian: release reviewed daily data for analysis.
- Veterinarian → Worker: approved next-day operational/clinical tasks.
- Veterinarian → Laboratory: lab investigation with chain-of-custody expectation.
- Consultant → Veterinarian: advisory recommendation only.
- Manager/Owner → Accountant: approved financial need/document context.
- Accountant → Section 12: accounting/payment event; no duplicate Farm ledger.
- Farm consumption → Section 7: canonical inventory issue/event; no duplicate inventory deduction.
