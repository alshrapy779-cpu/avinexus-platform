# Historical Recovery Step 10 — Authorized Office Discovery

- Server GET `/api/v20.2.3/contracted-offices/authorized` uses existing authentication and per-office `businessAccessV2023(..., 'read')` before returning only minimal office IDs/names/codes.
- Office 360 now populates its office selector exclusively from that server endpoint. No local all-offices fallback.
- Workspace and treasury endpoints remain independently protected by per-office server checks.
- No modifications to historical finance, inventory, migrations, or data files.

## Remaining gates
- Server role policy and session/tenant enforcement audit; full end-to-end login and office permission tests.
- Contracts, receipts, payments, posting, and banking workflows and restart persistence.
- Real Windows build, GUI and printing acceptance. This is not production-certified.
