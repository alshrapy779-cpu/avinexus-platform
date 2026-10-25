# Historical Recovery Step 08 — Office treasury reconciliation

Implemented read-only S12 account-level opening, incoming, outgoing, closing balances by original currency and as-of date. Authenticated office-scoped endpoint `/api/v20.2.3/contracted-office/:officeId/treasury-reconciliation?as_of=YYYY-MM-DD`. Rejects mismatched office/currency, invalid amounts and duplicate movements. Does not mutate ledger, convert currencies, or sum different currencies.

Limitations: existing businessOr403V2023 policy still needs penetration testing; not yet integrated into Office 360 UI; financial reconciliation against journal postings and real Windows end-to-end acceptance remain outstanding. No production certification.
