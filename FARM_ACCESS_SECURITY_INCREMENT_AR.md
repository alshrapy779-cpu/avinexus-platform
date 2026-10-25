# AviNexus — Farm Access Security Increment (2026-10-19)

## Changes
- Require verified bearer identity on legacy farm/flock/daily-log/necropsy endpoints in every environment.
- Filter farm, flock, daily log and necropsy lists to explicitly assigned farm IDs from server-side identity scopes.
- Deny legacy write handlers to non-system-owner users until canonical transactional scoped commands replace them.
- Deny bulk Farm R4 state read and update to non-system-owner users; remove authorization based on X-User-Role.

## Security tradeoffs and remaining blockers
- Legacy farm write UI for workers will return HTTP 403: it is intentionally disabled rather than leaking or corrupting records. A replacement role-scoped daily-work endpoint and durable persistence are required.
- The remaining API routes across V17–R8.1 still require endpoint-by-endpoint tenant isolation audit. This patch does NOT certify cross-tenant security globally.
- A global scope can grant all farms; scope assignment governance must be reviewed.
- Frontend login/session propagation and E2E Windows testing remain necessary.
- This is an incremental security patch, NOT a complete operational release.
